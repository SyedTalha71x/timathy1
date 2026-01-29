// ============================================================================
// APPOINTMENTS-STATES.JS - Termin-Daten
// ============================================================================
// Alle Appointment-bezogenen Daten und Helper-Funktionen
// Backend-Endpoint: GET /api/appointments
// ============================================================================

// =============================================================================
// APPOINTMENT TYPES
// =============================================================================
// isTrialType = true bedeutet, dass dieser Typ NICHT in normalen Buchungs-Dropdowns erscheint
export const appointmentTypesData = [
  { id: 1, name: "EMS Strength", description: "High-intensity strength training with EMS technology", duration: 30, interval: 30, slotsRequired: 1, maxParallel: 2, contingentUsage: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", category: "Personal Training", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", isTrialType: false },
  { id: 2, name: "EMS Cardio", description: "Cardiovascular training enhanced with EMS", duration: 30, interval: 30, slotsRequired: 1, maxParallel: 2, contingentUsage: 1, color: "bg-[#10B981]", colorHex: "#10B981", category: "Personal Training", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", isTrialType: false },
  { id: 3, name: "EMP Chair", description: "Relaxing electromagnetic pulse therapy session", duration: 30, interval: 30, slotsRequired: 0, maxParallel: 1, contingentUsage: 0, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", category: "Wellness", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", isTrialType: false },
  { id: 4, name: "Body Check", description: "Comprehensive body analysis and measurements", duration: 30, interval: 30, slotsRequired: 2, maxParallel: 1, contingentUsage: 1, color: "bg-[#06B6D4]", colorHex: "#06B6D4", category: "Health Check", image: null, isTrialType: false },
  { id: 5, name: "Trial Training", description: "Introduction session for new potential members", duration: 60, interval: 30, slotsRequired: 3, maxParallel: 1, contingentUsage: 0, color: "bg-[#3B82F6]", colorHex: "#3B82F6", category: "Trial", image: null, isTrialType: true },
];

// Derived lists for dropdowns
export const regularAppointmentTypesData = appointmentTypesData.filter(t => !t.isTrialType);
export const trialAppointmentTypesData = appointmentTypesData.filter(t => t.isTrialType);

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
  date.setHours(12, 0, 0, 0); // Avoid timezone issues
  
  if (workingDaysOffset === 0) {
    // For "today", if it's a weekend, find the next/previous working day
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

// Helper to format date for display (e.g., "Mon | 27-01-2025")
const formatDisplayDate = (workingDaysOffset) => {
  const date = getWorkingDay(workingDaysOffset);
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${weekday} | ${day}-${month}-${year}`;
};

// Helper to get ISO date string for a working day
const getDateString = (workingDaysOffset) => {
  const date = getWorkingDay(workingDaysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get ISO date string for any day (including weekends)
const getCalendarDateString = (daysOffset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Check if a date string is a working day
const isWorkingDay = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return !isWeekend(date);
};

// =============================================================================
// APPOINTMENTS DATA (Dynamic - Only on Working Days)
// =============================================================================

const generateAppointmentsData = () => [
  // === 5 WORKING DAYS AGO ===
  { id: 1, title: "EMS Strength", name: "John", lastName: "Doe", date: formatDisplayDate(-5), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 1, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 2, title: "EMS Cardio", name: "Jane", lastName: "Smith", date: formatDisplayDate(-5), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "completed", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 2, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 3, title: "Body Check", name: "Michael", lastName: "Johnson", date: formatDisplayDate(-5), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "completed", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 3, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 4, title: "EMS Strength", name: "Sarah", lastName: "Williams", date: formatDisplayDate(-5), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 4, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 5, title: "EMP Chair", name: "David", lastName: "Brown", date: formatDisplayDate(-5), time: "14:00 - 14:30", startTime: "14:00", endTime: "14:30", status: "completed", type: "EMP Chair", typeId: 3, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", memberId: 5, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 6, title: "EMS Cardio", name: "Emily", lastName: "Davis", date: formatDisplayDate(-5), time: "14:00 - 14:30", startTime: "14:00", endTime: "14:30", status: "completed", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 6, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 7, title: "EMS Strength", name: "Lisa", lastName: "Garcia", date: formatDisplayDate(-5), time: "16:00 - 16:30", startTime: "16:00", endTime: "16:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 8, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 13, title: "Trial Training", name: "Sarah", lastName: "Wilson", date: formatDisplayDate(-5), time: "17:00 - 18:00", startTime: "17:00", endTime: "18:00", status: "completed", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h2", staffId: 5, specialNote: { text: "Good session. Needs nutrition consultation first.", isImportant: false }, isTrial: true, isCancelled: false, isPast: true, isCheckedIn: true },

  // === 4 WORKING DAYS AGO ===
  { id: 8, title: "EMS Cardio", name: "Thomas", lastName: "Anderson", date: formatDisplayDate(-4), time: "08:00 - 08:30", startTime: "08:00", endTime: "08:30", status: "completed", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 9, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 9, title: "EMS Strength", name: "Jennifer", lastName: "Martinez", date: formatDisplayDate(-4), time: "08:00 - 08:30", startTime: "08:00", endTime: "08:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 10, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 10, title: "Body Check", name: "John", lastName: "Doe", date: formatDisplayDate(-4), time: "09:30 - 10:00", startTime: "09:30", endTime: "10:00", status: "completed", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 1, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 11, title: "Trial Training", name: "John", lastName: "Smith", date: formatDisplayDate(-4), time: "10:00 - 11:00", startTime: "10:00", endTime: "11:00", status: "completed", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h1", staffId: 5, specialNote: { text: "Converted to member! Very motivated.", isImportant: true }, isTrial: true, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 12, title: "EMS Strength", name: "Jane", lastName: "Smith", date: formatDisplayDate(-4), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 2, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },

  // === 3 WORKING DAYS AGO ===
  { id: 16, title: "EMS Strength", name: "Emily", lastName: "Davis", date: formatDisplayDate(-3), time: "08:30 - 09:00", startTime: "08:30", endTime: "09:00", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 6, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 17, title: "EMS Cardio", name: "Lisa", lastName: "Garcia", date: formatDisplayDate(-3), time: "08:30 - 09:00", startTime: "08:30", endTime: "09:00", status: "completed", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 8, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 18, title: "Trial Training", name: "Emma", lastName: "Davis", date: formatDisplayDate(-3), time: "15:00 - 16:00", startTime: "15:00", endTime: "16:00", status: "cancelled", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h4", staffId: 5, specialNote: { text: "Cancelled - price concerns. Follow up in 3 months.", isImportant: true }, isTrial: true, isCancelled: true, isPast: true, isCheckedIn: false },
  { id: 19, title: "EMS Strength", name: "Jennifer", lastName: "Martinez", date: formatDisplayDate(-3), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "cancelled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 10, staffId: 2, specialNote: { text: "Cancelled - sick", isImportant: false }, isTrial: false, isCancelled: true, isPast: true, isCheckedIn: false },

  // === 2 WORKING DAYS AGO ===
  { id: 20, title: "EMS Cardio", name: "John", lastName: "Doe", date: formatDisplayDate(-2), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "completed", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 1, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 21, title: "EMS Strength", name: "Sarah", lastName: "Williams", date: formatDisplayDate(-2), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 4, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 22, title: "Trial Training", name: "Justin", lastName: "Multerio", date: formatDisplayDate(-2), time: "14:00 - 15:00", startTime: "14:00", endTime: "15:00", status: "completed", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h5", staffId: 5, specialNote: { text: "No-show. Tried calling, no answer.", isImportant: true }, isTrial: true, isCancelled: false, isPast: true, isCheckedIn: false },

  // === 1 WORKING DAY AGO (Yesterday working day) ===
  { id: 25, title: "EMS Strength", name: "Michael", lastName: "Johnson", date: formatDisplayDate(-1), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 3, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },
  { id: 26, title: "Body Check", name: "David", lastName: "Brown", date: formatDisplayDate(-1), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "completed", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 5, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: true, isCheckedIn: true },

  // === TODAY (Current working day) ===
  { id: 30, title: "EMS Strength", name: "John", lastName: "Doe", date: formatDisplayDate(0), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 1, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 31, title: "EMS Cardio", name: "Jane", lastName: "Smith", date: formatDisplayDate(0), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "scheduled", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 2, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 32, title: "Body Check", name: "Michael", lastName: "Johnson", date: formatDisplayDate(0), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "scheduled", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 3, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 33, title: "EMS Strength", name: "Sarah", lastName: "Williams", date: formatDisplayDate(0), time: "14:00 - 14:30", startTime: "14:00", endTime: "14:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 4, staffId: 2, specialNote: { text: "VIP Member", isImportant: true }, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 34, title: "EMP Chair", name: "David", lastName: "Brown", date: formatDisplayDate(0), time: "15:00 - 15:30", startTime: "15:00", endTime: "15:30", status: "scheduled", type: "EMP Chair", typeId: 3, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", memberId: 5, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 35, title: "Trial Training", name: "Michael", lastName: "Brown", date: formatDisplayDate(0), time: "16:00 - 17:00", startTime: "16:00", endTime: "17:00", status: "scheduled", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h3", staffId: 5, specialNote: { text: "Former athlete, interested in high-intensity workouts.", isImportant: true }, isTrial: true, isCancelled: false, isPast: false, isCheckedIn: false },

  // === NEXT WORKING DAY (+1) ===
  { id: 40, title: "EMS Cardio", name: "Emily", lastName: "Davis", date: formatDisplayDate(1), time: "08:00 - 08:30", startTime: "08:00", endTime: "08:30", status: "scheduled", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 6, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 41, title: "EMS Strength", name: "Lisa", lastName: "Garcia", date: formatDisplayDate(1), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 8, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 42, title: "Body Check", name: "Thomas", lastName: "Anderson", date: formatDisplayDate(1), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "scheduled", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 9, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 43, title: "EMS Strength", name: "Jennifer", lastName: "Martinez", date: formatDisplayDate(1), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 10, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 44, title: "Trial Training", name: "Emma", lastName: "Davis", date: formatDisplayDate(1), time: "15:00 - 16:00", startTime: "15:00", endTime: "16:00", status: "scheduled", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h4", staffId: 5, specialNote: { text: "Rescheduled - offered 20% discount.", isImportant: false }, isTrial: true, isCancelled: false, isPast: false, isCheckedIn: false },

  // === 2 WORKING DAYS FROM NOW (+2) ===
  { id: 50, title: "EMS Strength", name: "John", lastName: "Doe", date: formatDisplayDate(2), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 1, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 51, title: "EMS Cardio", name: "Sarah", lastName: "Williams", date: formatDisplayDate(2), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "scheduled", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 4, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 52, title: "EMP Chair", name: "Michael", lastName: "Johnson", date: formatDisplayDate(2), time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "scheduled", type: "EMP Chair", typeId: 3, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", memberId: 3, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },

  // === 3 WORKING DAYS FROM NOW (+3) ===
  { id: 60, title: "EMS Cardio", name: "David", lastName: "Brown", date: formatDisplayDate(3), time: "08:00 - 08:30", startTime: "08:00", endTime: "08:30", status: "scheduled", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 5, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 61, title: "EMS Strength", name: "Emily", lastName: "Davis", date: formatDisplayDate(3), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 6, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 62, title: "Trial Training", name: "Justin", lastName: "Multerio", date: formatDisplayDate(3), time: "16:00 - 17:00", startTime: "16:00", endTime: "17:00", status: "scheduled", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h5", staffId: 5, specialNote: { text: "Rescheduled after no-show. Confirmed by phone.", isImportant: true }, isTrial: true, isCancelled: false, isPast: false, isCheckedIn: false },

  // === 4 WORKING DAYS FROM NOW (+4) ===
  { id: 70, title: "EMS Strength", name: "Lisa", lastName: "Garcia", date: formatDisplayDate(4), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Strength", typeId: 1, color: "bg-[#EF4444]", colorHex: "#EF4444", memberId: 8, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 71, title: "Body Check", name: "Thomas", lastName: "Anderson", date: formatDisplayDate(4), time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "scheduled", type: "Body Check", typeId: 4, color: "bg-[#06B6D4]", colorHex: "#06B6D4", memberId: 9, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },

  // === 5 WORKING DAYS FROM NOW (+5) ===
  { id: 80, title: "EMS Cardio", name: "Jane", lastName: "Smith", date: formatDisplayDate(5), time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "scheduled", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 2, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false, isCheckedIn: false },
  { id: 81, title: "Trial Training", name: "Sarah", lastName: "Wilson", date: formatDisplayDate(5), time: "14:00 - 15:00", startTime: "14:00", endTime: "15:00", status: "scheduled", type: "Trial Training", typeId: 5, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: null, leadId: "h2", staffId: 5, specialNote: { text: "Interested in group fitness and nutrition guidance.", isImportant: false }, isTrial: true, isCancelled: false, isPast: false, isCheckedIn: false },
];

// Export the dynamically generated appointments
export const appointmentsData = generateAppointmentsData();

// =============================================================================
// FREE APPOINTMENTS (Available Slots) - Only on Working Days
// =============================================================================

const generateFreeAppointmentsData = () => {
  const standardSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30", "18:00"
  ];
  
  const result = [];
  let idCounter = 1;
  
  // Generate slots for 30 calendar days ahead, but only for working days
  for (let dayOffset = 0; dayOffset <= 30; dayOffset++) {
    const dateStr = getCalendarDateString(dayOffset);
    
    // Skip weekends
    if (!isWorkingDay(dateStr)) {
      continue;
    }
    
    standardSlots.forEach((time) => {
      result.push({
        id: idCounter++,
        date: dateStr,
        time: time,
        typeId: null // Available for all types
      });
    });
  }
  
  return result;
};

export const freeAppointmentsData = generateFreeAppointmentsData();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getAppointmentTypeById = (typeId) => 
  appointmentTypesData.find(t => t.id === typeId) || null;

export const getAppointmentTypeByName = (name) => 
  appointmentTypesData.find(t => t.name === name) || null;

export const getRegularAppointmentTypes = () => regularAppointmentTypesData;
export const getTrialAppointmentTypes = () => trialAppointmentTypesData;

export const isTrialAppointmentType = (typeNameOrId) => {
  const type = typeof typeNameOrId === 'number' 
    ? getAppointmentTypeById(typeNameOrId) 
    : getAppointmentTypeByName(typeNameOrId);
  return type?.isTrialType || false;
};

export const getAppointmentColor = (appointment) => {
  if (appointment.color) return appointment.color;
  const type = getAppointmentTypeById(appointment.typeId) || getAppointmentTypeByName(appointment.type);
  return type?.color || "bg-[#808080]";
};

export const getAppointmentColorHex = (appointment) => {
  if (appointment.colorHex) return appointment.colorHex;
  if (appointment.color) {
    const match = appointment.color.match(/#[A-Fa-f0-9]{6}/);
    if (match) return match[0];
  }
  const type = getAppointmentTypeById(appointment.typeId) || getAppointmentTypeByName(appointment.type);
  return type?.colorHex || "#808080";
};

export const hexToTailwindBg = (hex) => `bg-[${hex}]`;
export const tailwindBgToHex = (tailwindClass) => {
  const match = tailwindClass?.match(/#[A-Fa-f0-9]{6}/);
  return match ? match[0] : "#808080";
};

export const getMemberAppointments = (memberId) => 
  appointmentsData.filter(a => a.memberId === memberId);

export const getUpcomingAppointments = () => 
  appointmentsData.filter(a => !a.isPast && !a.isCancelled);

export const getTodaysAppointments = () => {
  const today = formatDisplayDate(0);
  return appointmentsData.filter(a => a.date === today);
};

export const getAppointmentsByDate = (date) => 
  appointmentsData.filter(a => a.date === date);

export const getAppointmentsByStaff = (staffId) => 
  appointmentsData.filter(a => a.staffId === staffId);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformAppointmentFromBackend = (backendAppt) => ({
  id: backendAppt.id,
  title: backendAppt.title || backendAppt.type,
  name: backendAppt.member_first_name || backendAppt.name,
  lastName: backendAppt.member_last_name || backendAppt.lastName,
  date: backendAppt.date,
  time: backendAppt.time,
  startTime: backendAppt.start_time || backendAppt.startTime,
  endTime: backendAppt.end_time || backendAppt.endTime,
  status: backendAppt.status,
  type: backendAppt.type,
  typeId: backendAppt.type_id || backendAppt.typeId,
  color: backendAppt.color,
  colorHex: backendAppt.color_hex || backendAppt.colorHex,
  memberId: backendAppt.member_id || backendAppt.memberId,
  staffId: backendAppt.staff_id || backendAppt.staffId,
  specialNote: backendAppt.special_note || backendAppt.specialNote,
  isTrial: backendAppt.is_trial ?? backendAppt.isTrial ?? false,
  isCancelled: backendAppt.is_cancelled ?? backendAppt.isCancelled ?? false,
  isPast: backendAppt.is_past ?? backendAppt.isPast ?? false,
  isCheckedIn: backendAppt.is_checked_in ?? backendAppt.isCheckedIn ?? false,
});

export const transformAppointmentToBackend = (frontendAppt) => ({
  id: frontendAppt.id,
  title: frontendAppt.title,
  member_first_name: frontendAppt.name,
  member_last_name: frontendAppt.lastName,
  date: frontendAppt.date,
  time: frontendAppt.time,
  start_time: frontendAppt.startTime,
  end_time: frontendAppt.endTime,
  status: frontendAppt.status,
  type: frontendAppt.type,
  type_id: frontendAppt.typeId,
  color: frontendAppt.color,
  color_hex: frontendAppt.colorHex,
  member_id: frontendAppt.memberId,
  staff_id: frontendAppt.staffId,
  special_note: frontendAppt.specialNote,
  is_trial: frontendAppt.isTrial,
  is_cancelled: frontendAppt.isCancelled,
  is_past: frontendAppt.isPast,
  is_checked_in: frontendAppt.isCheckedIn,
});

// =============================================================================
// MOCK API (Replace with real API calls)
// =============================================================================

export const appointmentsApi = {
  getAll: async () => appointmentsData,
  getById: async (id) => appointmentsData.find(a => a.id === id) || null,
  getByMember: async (memberId) => getMemberAppointments(memberId),
  getByDate: async (date) => getAppointmentsByDate(date),
  getUpcoming: async () => getUpcomingAppointments(),
  getTodays: async () => getTodaysAppointments(),
  create: async (data) => ({ ...data, id: Math.max(...appointmentsData.map(a => a.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  cancel: async (id) => ({ success: true }),
  checkIn: async (id) => ({ success: true }),
};

export const appointmentTypesApi = {
  getAll: async () => appointmentTypesData,
  getRegular: async () => regularAppointmentTypesData,
  getTrial: async () => trialAppointmentTypesData,
  getById: async (id) => getAppointmentTypeById(id),
};

export default {
  appointmentTypesData,
  regularAppointmentTypesData,
  trialAppointmentTypesData,
  appointmentsData,
  freeAppointmentsData,
  getAppointmentTypeById,
  getAppointmentTypeByName,
  getRegularAppointmentTypes,
  getTrialAppointmentTypes,
  isTrialAppointmentType,
  getAppointmentColor,
  getAppointmentColorHex,
  hexToTailwindBg,
  tailwindBgToHex,
  getMemberAppointments,
  getUpcomingAppointments,
  getTodaysAppointments,
  getAppointmentsByDate,
  getAppointmentsByStaff,
  transformAppointmentFromBackend,
  transformAppointmentToBackend,
  appointmentsApi,
  appointmentTypesApi,
};
