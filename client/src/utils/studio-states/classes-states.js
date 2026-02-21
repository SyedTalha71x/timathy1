// ============================================================================
// CLASSES-STATES.JS - Kurs-/Klassen-Daten
// ============================================================================
// Alle Class-bezogenen Daten und Helper-Funktionen
// Backend-Endpoint: GET /api/classes
//
// STRUKTUR:
// - classTypesData        → Kurstypen (Yoga, Spinning, HIIT, etc.)
// - roomsData             → Verfügbare Räume
// - classesData           → Dynamisch generierte Klassen (analog appointmentsData)
// - markPastClasses       → Vergangene Klassen markieren
// - Helper-Funktionen     → getClassTypeById, getClassesByDate, etc.
// - Transformations       → transformClassFromBackend / transformClassToBackend
// - Mock API              → classesApi, classTypesApi
// ============================================================================

import { membersData } from './members-states';
import { getTrainers } from './staff-states';

// =============================================================================
// CLASS TYPES
// =============================================================================
export const classTypesData = [
  { id: 1, name: "Yoga",     description: "Mindful yoga session for flexibility and balance",     duration: 60, color: "bg-[#10b981]", colorHex: "#10b981", category: "Mind & Body",  image: null },
  { id: 2, name: "Spinning", description: "High-energy indoor cycling workout",                   duration: 45, color: "bg-[#f59e0b]", colorHex: "#f59e0b", category: "Cardio",       image: null },
  { id: 3, name: "HIIT",     description: "High-intensity interval training for maximum results",  duration: 30, color: "bg-[#ef4444]", colorHex: "#ef4444", category: "Strength",     image: null },
  { id: 4, name: "Pilates",  description: "Core-focused low-impact strength training",             duration: 50, color: "bg-[#8b5cf6]", colorHex: "#8b5cf6", category: "Mind & Body",  image: null },
  { id: 5, name: "Boxing",   description: "Boxing fitness class combining cardio and technique",    duration: 60, color: "bg-[#f97316]", colorHex: "#f97316", category: "Combat",       image: null },
  { id: 6, name: "Zumba",    description: "Dance-based fitness class with Latin rhythms",           duration: 45, color: "bg-[#ec4899]", colorHex: "#ec4899", category: "Dance",        image: null },
];

// =============================================================================
// ROOMS
// =============================================================================
export const roomsData = [
  "Studio 1",
  "Studio 2",
  "Spinning Room",
  "Boxing Area",
  "Yoga Room",
  "Outdoor Area",
];

// =============================================================================
// DEFAULT CLASS SETTINGS
// =============================================================================
export const DEFAULT_MAX_PARTICIPANTS = 12;
export const DEFAULT_CLASS_DURATION = 60;

// =============================================================================
// DYNAMIC DATE HELPERS - WITH CLOSED DAY AWARENESS
// =============================================================================

// Check if a date is a weekend (Saturday = 6, Sunday = 0)
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Get the Nth working day from today (skips weekends)
// Positive offset = future, Negative offset = past
const getWorkingDay = (workingDaysOffset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);

  if (workingDaysOffset === 0) {
    while (isWeekend(date)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  const direction = workingDaysOffset > 0 ? 1 : -1;
  let remainingDays = Math.abs(workingDaysOffset);

  while (remainingDays > 0) {
    date.setDate(date.getDate() + direction);
    if (!isWeekend(date)) {
      remainingDays--;
    }
  }

  return date;
};

// Helper to get ISO date string for a working day
const getDateString = (workingDaysOffset) => {
  const date = getWorkingDay(workingDaysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to format date as ISO string from Date object
export const fmtDate = (d) => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};

// Helper to compute end time from start + duration
const calcEndTime = (startHour, startMin, durationMinutes) => {
  const totalMin = startHour * 60 + startMin + durationMinutes;
  const eH = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const eM = String(totalMin % 60).padStart(2, '0');
  return `${eH}:${eM}`;
};

// =============================================================================
// MARK PAST CLASSES
// =============================================================================
// Exported so the component can refresh periodically (every minute)
export const markPastClasses = (classes) => {
  const now = new Date();
  return classes.map((c) => {
    const classEnd = new Date(`${c.date}T${c.endTime || '23:59'}`);
    return { ...c, isPast: classEnd < now && !c.isCancelled };
  });
};

// =============================================================================
// CLASSES DATA (Dynamic - Only on Working Days)
// =============================================================================

const generateClassesData = () => {
  const trainersList = getTrainers();
  const t = trainersList.length > 0
    ? trainersList
    : [{ id: 0, firstName: 'Unknown', lastName: 'Trainer', color: '#808080' }];

  const members = membersData || [];
  let idCounter = 1;

  // Helper to build a single class entry
  const makeClass = (dateStr, {
    typeId, hour, min, trainerIdx, room,
    maxParticipants = DEFAULT_MAX_PARTICIPANTS,
    isRecurring = false, seriesId = null, recurring = null,
    isCancelled = false,
  }) => {
    const type = classTypesData.find((x) => x.id === typeId);
    const trainer = t[trainerIdx % t.length] || t[0];
    const enrolledCount = Math.floor(Math.random() * 8) + 2;
    const enrolled = members.slice(0, Math.min(enrolledCount, maxParticipants)).map((m) => m.id);
    const sH = String(hour).padStart(2, '0');
    const sM = String(min).padStart(2, '0');
    const endTime = calcEndTime(hour, min, type.duration);

    return {
      id: idCounter++,
      typeId: type.id,
      typeName: type.name,
      color: type.colorHex,
      duration: type.duration,
      trainerId: trainer.id,
      trainerName: `${trainer.firstName} ${trainer.lastName}`,
      trainerImg: trainer.img || null,
      trainerColor: trainer.color || null,
      room,
      date: dateStr,
      startTime: `${sH}:${sM}`,
      endTime,
      maxParticipants,
      enrolledMembers: enrolled,
      isRecurring,
      seriesId,
      recurring,
      isCancelled,
      isPast: false,
    };
  };

  const classes = [];

  // ─── SERIES DEFINITIONS ───
  // Each series defines a recurring class pattern with a unique seriesId.
  // The recurring object stores the schedule metadata shown in the popover.

  const SERIES = {
    // Yoga — Mon/Wed/Fri 08:00
    YOGA_MWF: {
      seriesId: 1001,
      recurring: { frequency: "weekly", dayOfWeek: "1", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 1, hour: 8, min: 0, trainerIdx: 0, room: "Yoga Room" },
    },
    // HIIT — Mon/Wed/Fri 10:00
    HIIT_MWF: {
      seriesId: 1002,
      recurring: { frequency: "weekly", dayOfWeek: "3", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 3, hour: 10, min: 0, trainerIdx: 1, room: "Studio 2" },
    },
    // Spinning — Mon/Wed/Fri afternoon
    SPIN_MWF: {
      seriesId: 1003,
      recurring: { frequency: "weekly", dayOfWeek: "1", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 2, hour: 17, min: 0, trainerIdx: 2, room: "Spinning Room" },
    },
    // Pilates — Tue/Thu 09:00
    PILATES_TT: {
      seriesId: 1004,
      recurring: { frequency: "weekly", dayOfWeek: "2", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 4, hour: 9, min: 0, trainerIdx: 0, room: "Studio 1" },
    },
    // Boxing — Tue/Thu 11:00
    BOXING_TT: {
      seriesId: 1005,
      recurring: { frequency: "weekly", dayOfWeek: "4", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 5, hour: 11, min: 0, trainerIdx: 3, room: "Boxing Area" },
    },
    // Zumba — Tue/Thu 18:00
    ZUMBA_TT: {
      seriesId: 1006,
      recurring: { frequency: "weekly", dayOfWeek: "2", occurrences: 10, startDate: getDateString(-10) },
      base: { typeId: 6, hour: 18, min: 0, trainerIdx: 2, room: "Studio 2" },
    },
  };

  // Helper: create a series class instance
  const seriesClass = (dateStr, series, overrides = {}) =>
    makeClass(dateStr, {
      ...series.base,
      isRecurring: true,
      seriesId: series.seriesId,
      recurring: series.recurring,
      ...overrides,
    });

  // ─── 5 WORKING DAYS AGO ───
  const d5 = getDateString(-5);
  classes.push(seriesClass(d5, SERIES.YOGA_MWF));
  classes.push(seriesClass(d5, SERIES.HIIT_MWF));
  classes.push(seriesClass(d5, SERIES.SPIN_MWF));

  // ─── 4 WORKING DAYS AGO ───
  const d4 = getDateString(-4);
  classes.push(seriesClass(d4, SERIES.PILATES_TT));
  classes.push(seriesClass(d4, SERIES.BOXING_TT));
  classes.push(seriesClass(d4, SERIES.ZUMBA_TT));

  // ─── 3 WORKING DAYS AGO ───
  const d3 = getDateString(-3);
  classes.push(seriesClass(d3, SERIES.YOGA_MWF));
  classes.push(seriesClass(d3, SERIES.HIIT_MWF, { hour: 10, min: 30 }));
  classes.push(seriesClass(d3, SERIES.SPIN_MWF, { hour: 16 }));
  // Cancelled class in Zumba series
  classes.push(seriesClass(d3, SERIES.ZUMBA_TT, { isCancelled: true }));

  // ─── 2 WORKING DAYS AGO ───
  const d2 = getDateString(-2);
  classes.push(seriesClass(d2, SERIES.PILATES_TT));
  classes.push(seriesClass(d2, SERIES.BOXING_TT, { hour: 12 }));
  classes.push(seriesClass(d2, SERIES.ZUMBA_TT, { hour: 17 }));

  // ─── 1 WORKING DAY AGO ───
  const d1 = getDateString(-1);
  classes.push(seriesClass(d1, SERIES.YOGA_MWF));
  classes.push(seriesClass(d1, SERIES.HIIT_MWF));
  classes.push(seriesClass(d1, SERIES.SPIN_MWF, { hour: 15 }));

  // ─── TODAY ───
  const d0 = getDateString(0);
  classes.push(seriesClass(d0, SERIES.YOGA_MWF));
  classes.push(seriesClass(d0, SERIES.HIIT_MWF));
  classes.push(seriesClass(d0, SERIES.PILATES_TT, { hour: 11 }));
  classes.push(seriesClass(d0, SERIES.SPIN_MWF));
  classes.push(seriesClass(d0, SERIES.BOXING_TT, { hour: 18 }));
  // One-off (non-recurring) class
  classes.push(makeClass(d0, { typeId: 6, hour: 9, min: 0, trainerIdx: 2, room: "Studio 2" }));

  // ─── NEXT WORKING DAY (+1) ───
  const p1 = getDateString(1);
  classes.push(seriesClass(p1, SERIES.PILATES_TT));
  classes.push(seriesClass(p1, SERIES.BOXING_TT));
  classes.push(seriesClass(p1, SERIES.ZUMBA_TT));

  // ─── 2 WORKING DAYS FROM NOW (+2) ───
  const p2 = getDateString(2);
  classes.push(seriesClass(p2, SERIES.YOGA_MWF));
  classes.push(seriesClass(p2, SERIES.HIIT_MWF, { hour: 10, min: 30 }));
  classes.push(seriesClass(p2, SERIES.SPIN_MWF, { hour: 16 }));

  // ─── 3 WORKING DAYS FROM NOW (+3) ───
  const p3 = getDateString(3);
  classes.push(seriesClass(p3, SERIES.PILATES_TT));
  classes.push(seriesClass(p3, SERIES.BOXING_TT, { hour: 12 }));
  classes.push(seriesClass(p3, SERIES.ZUMBA_TT, { hour: 17 }));

  // ─── 4 WORKING DAYS FROM NOW (+4) ───
  const p4 = getDateString(4);
  classes.push(seriesClass(p4, SERIES.YOGA_MWF));
  classes.push(seriesClass(p4, SERIES.HIIT_MWF));
  classes.push(seriesClass(p4, SERIES.SPIN_MWF, { hour: 15 }));

  // ─── 5 WORKING DAYS FROM NOW (+5) ───
  const p5 = getDateString(5);
  classes.push(seriesClass(p5, SERIES.ZUMBA_TT, { hour: 9 }));
  classes.push(seriesClass(p5, SERIES.YOGA_MWF, { hour: 11, room: "Studio 1" }));
  // One-off Saturday workshop (non-recurring)
  classes.push(makeClass(p5, { typeId: 3, hour: 10, min: 0, trainerIdx: 1, room: "Studio 2" }));

  return markPastClasses(classes);
};

// Export the dynamically generated classes
export const classesData = generateClassesData();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getClassTypeById = (typeId) =>
  classTypesData.find((t) => t.id === typeId) || null;

export const getClassTypeByName = (name) =>
  classTypesData.find((t) => t.name === name) || null;

export const getClassTypeColor = (classItem) => {
  if (classItem?.isCancelled) return 'bg-[#6B7280]';
  if (classItem?.color) return `bg-[${classItem.color}]`;
  const type = getClassTypeById(classItem?.typeId);
  return type?.color || 'bg-[#808080]';
};

export const getClassTypeColorHex = (classItem) => {
  if (classItem?.isCancelled) return '#6B7280';
  if (classItem?.color) return classItem.color;
  const type = getClassTypeById(classItem?.typeId);
  return type?.colorHex || '#808080';
};

export const getClassesByDate = (date) => {
  const dateStr = typeof date === 'string' ? date : fmtDate(date);
  return classesData.filter((c) => c.date === dateStr);
};

export const getClassesByType = (typeId) =>
  classesData.filter((c) => c.typeId === typeId);

export const getClassesByTrainer = (trainerId) =>
  classesData.filter((c) => c.trainerId === trainerId);

export const getClassesByRoom = (room) =>
  classesData.filter((c) => c.room === room);

export const getUpcomingClasses = () =>
  classesData.filter((c) => !c.isPast && !c.isCancelled);

export const getTodaysClasses = () => {
  const today = getDateString(0);
  return classesData.filter((c) => c.date === today);
};

export const getCancelledClasses = () =>
  classesData.filter((c) => c.isCancelled);

export const getClassEnrolledCount = (classItem) =>
  classItem?.enrolledMembers?.length || 0;

export const isClassFull = (classItem) =>
  getClassEnrolledCount(classItem) >= (classItem?.maxParticipants || 0);

export const getClassSpotsLeft = (classItem) =>
  Math.max(0, (classItem?.maxParticipants || 0) - getClassEnrolledCount(classItem));

export const isMemberEnrolled = (classItem, memberId) =>
  classItem?.enrolledMembers?.includes(memberId) || false;

export const getClassesByMember = (memberId) =>
  classesData.filter((c) => c.enrolledMembers?.includes(memberId));

export const getClassesBySeries = (seriesId) =>
  classesData.filter((c) => c.seriesId === seriesId);

export const getUpcomingSeriesClasses = (seriesId) =>
  classesData.filter((c) => c.seriesId === seriesId && !c.isPast && !c.isCancelled);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformClassFromBackend = (backendClass) => ({
  id: backendClass.id,
  typeId: backendClass.type_id || backendClass.typeId,
  typeName: backendClass.type_name || backendClass.typeName,
  color: backendClass.color_hex || backendClass.colorHex || backendClass.color,
  duration: backendClass.duration,
  trainerId: backendClass.trainer_id || backendClass.trainerId,
  trainerName: backendClass.trainer_name || backendClass.trainerName,
  trainerImg: backendClass.trainer_img || backendClass.trainerImg || null,
  trainerColor: backendClass.trainer_color || backendClass.trainerColor || null,
  room: backendClass.room,
  date: backendClass.date,
  startTime: backendClass.start_time || backendClass.startTime,
  endTime: backendClass.end_time || backendClass.endTime,
  maxParticipants: backendClass.max_participants || backendClass.maxParticipants,
  enrolledMembers: backendClass.enrolled_members || backendClass.enrolledMembers || [],
  isRecurring: backendClass.is_recurring ?? backendClass.isRecurring ?? false,
  seriesId: backendClass.series_id || backendClass.seriesId || null,
  recurring: backendClass.recurring || null,
  isCancelled: backendClass.is_cancelled ?? backendClass.isCancelled ?? false,
  isPast: backendClass.is_past ?? backendClass.isPast ?? false,
});

export const transformClassToBackend = (frontendClass) => ({
  id: frontendClass.id,
  type_id: frontendClass.typeId,
  type_name: frontendClass.typeName,
  color_hex: frontendClass.color,
  duration: frontendClass.duration,
  trainer_id: frontendClass.trainerId,
  trainer_name: frontendClass.trainerName,
  trainer_img: frontendClass.trainerImg,
  trainer_color: frontendClass.trainerColor,
  room: frontendClass.room,
  date: frontendClass.date,
  start_time: frontendClass.startTime,
  end_time: frontendClass.endTime,
  max_participants: frontendClass.maxParticipants,
  enrolled_members: frontendClass.enrolledMembers,
  is_recurring: frontendClass.isRecurring,
  series_id: frontendClass.seriesId,
  recurring: frontendClass.recurring,
  is_cancelled: frontendClass.isCancelled,
  is_past: frontendClass.isPast,
});

// =============================================================================
// MOCK API (Replace with real API calls)
// =============================================================================

export const classesApi = {
  getAll: async () => classesData,
  getById: async (id) => classesData.find((c) => c.id === id) || null,
  getByDate: async (date) => getClassesByDate(date),
  getByType: async (typeId) => getClassesByType(typeId),
  getByTrainer: async (trainerId) => getClassesByTrainer(trainerId),
  getByRoom: async (room) => getClassesByRoom(room),
  getUpcoming: async () => getUpcomingClasses(),
  getTodays: async () => getTodaysClasses(),
  create: async (data) => ({ ...data, id: Math.max(...classesData.map((c) => c.id), 0) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  cancel: async (id) => ({ success: true }),
  cancelSeries: async (seriesId) => ({ success: true }),
  delete: async (id) => ({ success: true }),
  enrollMember: async (classId, memberId) => ({ success: true }),
  removeMember: async (classId, memberId) => ({ success: true }),
};

export const classTypesApi = {
  getAll: async () => classTypesData,
  getById: async (id) => getClassTypeById(id),
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Class Types
  classTypesData,
  roomsData,
  DEFAULT_MAX_PARTICIPANTS,
  DEFAULT_CLASS_DURATION,
  // Classes Data
  classesData,
  // Helpers
  fmtDate,
  markPastClasses,
  getClassTypeById,
  getClassTypeByName,
  getClassTypeColor,
  getClassTypeColorHex,
  getClassesByDate,
  getClassesByType,
  getClassesByTrainer,
  getClassesByRoom,
  getUpcomingClasses,
  getTodaysClasses,
  getCancelledClasses,
  getClassEnrolledCount,
  isClassFull,
  getClassSpotsLeft,
  isMemberEnrolled,
  getClassesByMember,
  getClassesBySeries,
  getUpcomingSeriesClasses,
  // Transformations
  transformClassFromBackend,
  transformClassToBackend,
  // API
  classesApi,
  classTypesApi,
};
