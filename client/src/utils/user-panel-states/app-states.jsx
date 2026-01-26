// ============================================================================
// APP-STATES.JSX - Konsolidierte State-Datei für das gesamte System
// ============================================================================
// Diese Datei ist die EINZIGE Quelle der Wahrheit für alle Kerndaten.
// Keine Duplikate mehr - Backend-Integration wird dadurch stark vereinfacht.
//
// STRUKTUR:
// 1. CORE - Members, Staff, Appointments (Hauptentitäten)
// 2. MEMBER_DATA - History, Relations, Contingent
// 3. COMMUNICATION - Chats, E-Mails, Templates
// 4. CONFIG - System-Konfiguration, Länder, Rollen
//
// Module wie Leads, Contracts, Selling, Training bleiben in eigenen Dateien,
// da sie keine Duplikate erzeugen.
// ============================================================================

// ============================================================================
// SECTION 1: CORE ENTITIES
// ============================================================================

// -----------------------------------------------------------------------------
// 1.1 MEMBERS - Alle Mitglieder des Studios
// -----------------------------------------------------------------------------
export const membersData = [
  {
    id: 1, firstName: "John", lastName: "Doe", title: "John Doe",
    email: "john@example.com", phone: "+1234567890",
    street: "123 Main St", zipCode: "12345", city: "New York", country: "United States",
    memberNumber: "M001", gender: "male", image: null,
    reason: "", isActive: true, isArchived: false, memberType: "full",
    note: "Allergic to peanuts", noteStartDate: "2023-01-01", noteEndDate: "2023-12-31", noteImportance: "important",
    dateOfBirth: "1990-05-15", about: "Experienced developer with a passion for clean code.",
    joinDate: "2022-03-01", contractStart: "2022-03-01", contractEnd: "2025-03-01",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 2, firstName: "Jane", lastName: "Smith", title: "Jane Smith",
    email: "jane@example.com", phone: "+1234567891",
    street: "456 Oak St", zipCode: "67890", city: "Los Angeles", country: "United States",
    memberNumber: "M002", gender: "female", image: null,
    isActive: false, reason: "Vacation Leave", isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1985-08-22", about: "Certified PMP with 10 years of experience.",
    joinDate: "2021-11-15", contractStart: "2021-11-15", contractEnd: "2024-11-15",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 3, firstName: "Michael", lastName: "Johnson", title: "Michael Johnson",
    email: "michael@example.com", phone: "+1234567892",
    street: "789 Pine St", zipCode: "10112", city: "Chicago", country: "United States",
    memberNumber: "M003", gender: "male", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "Prefers morning sessions", noteStartDate: "2023-03-01", noteEndDate: "2023-12-31", noteImportance: "unimportant",
    dateOfBirth: "1988-11-30", about: "Fitness enthusiast and marathon runner.",
    joinDate: "2022-06-15", contractStart: "2022-06-15", contractEnd: "2025-06-15",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 4, firstName: "Sarah", lastName: "Williams", title: "Sarah Williams",
    email: "sarah.w@example.com", phone: "+1234567893",
    street: "321 Elm Ave", zipCode: "54321", city: "Houston", country: "United States",
    memberNumber: "M004", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "premium",
    note: "VIP member - priority scheduling", noteStartDate: "2024-01-01", noteEndDate: "2024-12-31", noteImportance: "important",
    dateOfBirth: "1992-03-18", about: "Yoga instructor and wellness coach.",
    joinDate: "2023-01-10", contractStart: "2023-01-10", contractEnd: "2025-01-10",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 5, firstName: "David", lastName: "Brown", title: "David Brown",
    email: "david.brown@example.com", phone: "+1234567894",
    street: "654 Maple Dr", zipCode: "11223", city: "Phoenix", country: "United States",
    memberNumber: "M005", gender: "male", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1995-01-25", about: "Software engineer interested in strength training.",
    joinDate: "2023-09-01", contractStart: "2023-09-01", contractEnd: "2024-09-01",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 6, firstName: "Emily", lastName: "Davis", title: "Emily Davis",
    email: "emily.d@example.com", phone: "+1234567895",
    street: "987 Cedar Ln", zipCode: "33445", city: "Philadelphia", country: "United States",
    memberNumber: "M006", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "Focus on knee rehabilitation exercises", noteStartDate: "2025-01-01", noteEndDate: "2025-04-01", noteImportance: "important",
    dateOfBirth: "1991-12-05", about: "Recovering from knee surgery.",
    joinDate: "2024-06-01", contractStart: "2024-06-01", contractEnd: "2025-06-01",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 7, firstName: "Robert", lastName: "Miller", title: "Robert Miller",
    email: "robert.m@example.com", phone: "+1234567896",
    street: "147 Birch Rd", zipCode: "55667", city: "San Antonio", country: "United States",
    memberNumber: "M007", gender: "male", image: null,
    isActive: true, isArchived: false, memberType: "trial",
    note: "New potential member - scheduled for gym tour", noteStartDate: "2025-01-01", noteEndDate: "2025-01-31", noteImportance: "important",
    dateOfBirth: "1993-04-22", about: "Interested in joining the gym.",
    joinDate: "2025-01-24", contractStart: null, contractEnd: null,
    autoArchiveDate: null, documents: [],
  },
  {
    id: 8, firstName: "Lisa", lastName: "Garcia", title: "Lisa Garcia",
    email: "lisa.g@example.com", phone: "+1234567897",
    street: "258 Willow St", zipCode: "77889", city: "San Diego", country: "United States",
    memberNumber: "M008", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1989-09-14", about: "Group fitness enthusiast.",
    joinDate: "2024-02-01", contractStart: "2024-02-01", contractEnd: "2025-02-01",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 9, firstName: "Thomas", lastName: "Anderson", title: "Thomas Anderson",
    email: "thomas.a@example.com", phone: "+1234567898",
    street: "369 Spruce Ave", zipCode: "99001", city: "Dallas", country: "United States",
    memberNumber: "M009", gender: "male", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1987-02-28", about: "Business professional focused on stress relief.",
    joinDate: "2024-03-15", contractStart: "2024-03-15", contractEnd: "2025-03-15",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 10, firstName: "Jennifer", lastName: "Martinez", title: "Jennifer Martinez",
    email: "jennifer.m@example.com", phone: "+1234567899",
    street: "480 Ash Blvd", zipCode: "11234", city: "San Jose", country: "United States",
    memberNumber: "M010", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1994-06-17", about: "Cardio and weight training enthusiast.",
    joinDate: "2024-01-01", contractStart: "2024-01-01", contractEnd: "2025-01-01",
    autoArchiveDate: null, documents: [],
  },
];

// -----------------------------------------------------------------------------
// 1.2 STAFF - Alle Mitarbeiter des Studios
// -----------------------------------------------------------------------------
export const staffData = [
  {
    id: 1, firstName: "Natalia", lastName: "Brown", role: "Telephone operator",
    email: "natalia.brown@example.com", phone: "+1234567890",
    description: "Experienced telephone operator.", img: null,
    userId: "natalia.telephone-operator", username: "natalia.brown",
    street: "123 Main St", zipCode: "12345", city: "Anytown", country: "USA",
    vacationEntitlement: 30, vacationDays: 30, vacationUsed: 5, vacationNotes: "",
    dateOfBirth: "1990-05-10", gender: "female", color: "#5DAEFF",
    employmentStart: "2020-03-15", employmentEnd: null, contractType: "full-time", department: "Customer Service",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 2, firstName: "John", lastName: "Trainer", role: "Personal Trainer",
    email: "john.trainer@example.com", phone: "+9876543210",
    description: "Certified personal trainer.", img: null,
    userId: "john.trainer", username: "john.trainer",
    street: "456 Oak Ave", zipCode: "67890", city: "Fittown", country: "USA",
    vacationEntitlement: 25, vacationDays: 25, vacationUsed: 10, vacationNotes: "",
    dateOfBirth: "1992-11-20", gender: "male", color: "#FFD580",
    employmentStart: "2021-06-01", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 3, firstName: "Sarah", lastName: "Coach", role: "Fitness Coach",
    email: "sarah.coach@example.com", phone: "+92131232323",
    description: "Group fitness instructor.", img: null,
    userId: "sarah.coach", username: "sarah.coach",
    street: "789 Pine Rd", zipCode: "62390", city: "Gymville", country: "USA",
    vacationEntitlement: 20, vacationDays: 20, vacationUsed: 3, vacationNotes: "",
    dateOfBirth: "1988-07-15", gender: "female", color: "#D3D3D3",
    employmentStart: "2022-01-10", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 4, firstName: "Mike", lastName: "Manager", role: "Studio Manager",
    email: "mike.manager@example.com", phone: "+1122334455",
    description: "Team leader with 10+ years experience.", img: null,
    userId: "mike.manager", username: "mike.manager",
    street: "321 Elm St", zipCode: "11223", city: "Somewhere", country: "USA",
    vacationEntitlement: 30, vacationDays: 30, vacationUsed: 8, vacationNotes: "",
    dateOfBirth: "1985-03-22", gender: "male", color: "#FF6B6B",
    employmentStart: "2018-09-01", employmentEnd: null, contractType: "full-time", department: "Management",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 5, firstName: "Lisa", lastName: "Reception", role: "Receptionist",
    email: "lisa.reception@example.com", phone: "+5566778899",
    description: "Front desk specialist.", img: null,
    userId: "lisa.reception", username: "lisa.reception",
    street: "654 Maple Ln", zipCode: "44556", city: "Fittown", country: "USA",
    vacationEntitlement: 20, vacationDays: 20, vacationUsed: 2, vacationNotes: "",
    dateOfBirth: "1995-07-15", gender: "female", color: "#4CAF50",
    employmentStart: "2023-02-15", employmentEnd: null, contractType: "part-time", department: "Reception",
    isActive: true, isArchived: false, documents: [],
  },
];

// -----------------------------------------------------------------------------
// 1.3 APPOINTMENTS - Alle Termine (ISO-Format für Datum)
// -----------------------------------------------------------------------------
// WICHTIG: 
// - typeId referenziert appointmentTypesData.id
// - color ist Tailwind-Klasse für UI (bg-[#HEX])
// - colorHex ist der reine Hex-Wert für Charts/Kalender

export const appointmentsData = [
  { id: 1, title: "EMS Strength", name: "John", lastName: "Doe", date: "2025-01-26T10:00", time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "upcoming", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 1, staffId: 2, specialNote: { text: "First time client", isImportant: true }, isTrial: false, isCancelled: false, isPast: false },
  { id: 2, title: "EMS Strength", name: "John", lastName: "Doe", date: "2025-01-28T14:00", time: "14:00 - 14:30", startTime: "14:00", endTime: "14:30", status: "upcoming", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 1, staffId: 2, specialNote: { text: "Focus on upper body", isImportant: true }, isTrial: false, isCancelled: false, isPast: false },
  { id: 3, title: "Body Check", name: "Jane", lastName: "Smith", date: "2025-02-04T15:30", time: "15:30 - 16:00", startTime: "15:30", endTime: "16:00", status: "upcoming", type: "Body Check", typeId: 4, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: 2, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false },
  { id: 4, title: "EMS Cardio", name: "Michael", lastName: "Johnson", date: "2025-01-27T11:00", time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "upcoming", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 3, staffId: 2, specialNote: { text: "Marathon training", isImportant: true }, isTrial: false, isCancelled: false, isPast: false },
  { id: 5, title: "EMS Strength", name: "Sarah", lastName: "Williams", date: "2025-02-01T11:00", time: "11:00 - 11:30", startTime: "11:00", endTime: "11:30", status: "upcoming", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 4, staffId: 3, recurring: { frequency: "weekly", dayOfWeek: "1", startDate: "2025-02-01", occurrences: 8 }, isTrial: false, isCancelled: false, isPast: false },
  { id: 6, title: "EMS Strength", name: "David", lastName: "Brown", date: "2025-01-30T15:00", time: "15:00 - 15:30", startTime: "15:00", endTime: "15:30", status: "upcoming", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 5, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false },
  { id: 7, title: "EMP Chair", name: "Emily", lastName: "Davis", date: "2025-02-08T10:00", time: "10:00 - 10:30", startTime: "10:00", endTime: "10:30", status: "upcoming", type: "EMP Chair", typeId: 3, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", memberId: 6, staffId: 3, specialNote: { text: "Knee rehabilitation", isImportant: true }, isTrial: false, isCancelled: false, isPast: false },
  { id: 8, title: "Trial Training", name: "Robert", lastName: "Miller", date: "2025-01-26T10:00", time: "10:00 - 11:00", startTime: "10:00", endTime: "11:00", status: "upcoming", type: "Trial Training", typeId: 5, color: "bg-[#F59E0B]", colorHex: "#F59E0B", memberId: 7, staffId: 5, specialNote: { text: "New trial member - bring ID", isImportant: true }, isTrial: true, isCancelled: false, isPast: false },
  { id: 9, title: "EMS Cardio", name: "Lisa", lastName: "Garcia", date: "2025-01-28T09:00", time: "09:00 - 09:30", startTime: "09:00", endTime: "09:30", status: "upcoming", type: "EMS Cardio", typeId: 2, color: "bg-[#10B981]", colorHex: "#10B981", memberId: 8, staffId: 3, specialNote: null, isTrial: false, isCancelled: false, isPast: false },
  { id: 10, title: "EMS Strength", name: "John", lastName: "Doe", date: "2025-01-23T14:00", time: "14:00 - 14:30", startTime: "14:00", endTime: "14:30", status: "completed", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 1, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: true },
  { id: 11, title: "Body Check", name: "Thomas", lastName: "Anderson", date: "2025-01-16T13:00", time: "13:00 - 13:30", startTime: "13:00", endTime: "13:30", status: "completed", type: "Body Check", typeId: 4, color: "bg-[#3B82F6]", colorHex: "#3B82F6", memberId: 9, staffId: 4, specialNote: null, isTrial: false, isCancelled: false, isPast: true },
  { id: 12, title: "EMS Strength", name: "Jennifer", lastName: "Martinez", date: "2025-01-25T11:30", time: "11:30 - 12:00", startTime: "11:30", endTime: "12:00", status: "upcoming", type: "EMS Strength", typeId: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", memberId: 10, staffId: 2, specialNote: null, isTrial: false, isCancelled: false, isPast: false },
];

// Appointment Types - Synchron mit Configuration!
// color = Tailwind-Klasse, colorHex = Hex für Charts
// isTrialType = true bedeutet, dass dieser Typ NICHT in normalen Buchungs-Dropdowns erscheint
export const appointmentTypesData = [
  { id: 1, name: "EMS Strength", description: "High-intensity strength training with EMS technology", duration: 30, interval: 30, slotsRequired: 1, maxParallel: 2, contingentUsage: 1, color: "bg-[#FF843E]", colorHex: "#FF843E", category: "Personal Training", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", isTrialType: false },
  { id: 2, name: "EMS Cardio", description: "Cardiovascular training enhanced with EMS", duration: 30, interval: 30, slotsRequired: 1, maxParallel: 2, contingentUsage: 1, color: "bg-[#10B981]", colorHex: "#10B981", category: "Personal Training", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", isTrialType: false },
  { id: 3, name: "EMP Chair", description: "Relaxing electromagnetic pulse therapy session", duration: 30, interval: 30, slotsRequired: 0, maxParallel: 1, contingentUsage: 0, color: "bg-[#8B5CF6]", colorHex: "#8B5CF6", category: "Wellness", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", isTrialType: false },
  { id: 4, name: "Body Check", description: "Comprehensive body analysis and measurements", duration: 30, interval: 30, slotsRequired: 2, maxParallel: 1, contingentUsage: 1, color: "bg-[#3B82F6]", colorHex: "#3B82F6", category: "Health Check", image: null, isTrialType: false },
  { id: 5, name: "Trial Training", description: "Introduction session for new potential members", duration: 60, interval: 30, slotsRequired: 3, maxParallel: 1, contingentUsage: 0, color: "bg-[#F59E0B]", colorHex: "#F59E0B", category: "Trial", image: null, isTrialType: true },
];

// Regular appointment types (excluding trial) - für normale Buchungs-Dropdowns
export const regularAppointmentTypesData = appointmentTypesData.filter(type => !type.isTrialType);

// Trial appointment types only - für Lead-Buchungen
export const trialAppointmentTypesData = appointmentTypesData.filter(type => type.isTrialType);

// Appointment Categories
export const appointmentCategoriesData = [
  "Health Check",
  "Personal Training",
  "Wellness",
  "Recovery",
  "Mindfulness",
  "Group Class",
  "Trial"
];

// Free Appointment Slots - Buchbare Termine
// WICHTIG: date muss im Format YYYY-MM-DD sein (für HTML date input)
export const freeAppointmentsData = [
  // Heute + kommende Tage
  { id: 1, date: "2025-01-25", time: "09:00 AM", typeId: 1 },
  { id: 2, date: "2025-01-25", time: "10:00 AM", typeId: 1 },
  { id: 3, date: "2025-01-25", time: "11:00 AM", typeId: 2 },
  { id: 4, date: "2025-01-25", time: "02:00 PM", typeId: 1 },
  { id: 5, date: "2025-01-25", time: "03:00 PM", typeId: 3 },
  { id: 6, date: "2025-01-25", time: "04:00 PM", typeId: 2 },
  
  { id: 7, date: "2025-01-26", time: "09:00 AM", typeId: 1 },
  { id: 8, date: "2025-01-26", time: "10:00 AM", typeId: 2 },
  { id: 9, date: "2025-01-26", time: "11:00 AM", typeId: 1 },
  { id: 10, date: "2025-01-26", time: "02:00 PM", typeId: 3 },
  { id: 11, date: "2025-01-26", time: "03:00 PM", typeId: 1 },
  
  { id: 12, date: "2025-01-27", time: "09:00 AM", typeId: 1 },
  { id: 13, date: "2025-01-27", time: "10:00 AM", typeId: 1 },
  { id: 14, date: "2025-01-27", time: "11:00 AM", typeId: 2 },
  { id: 15, date: "2025-01-27", time: "02:00 PM", typeId: 1 },
  { id: 16, date: "2025-01-27", time: "03:00 PM", typeId: 4 },
  { id: 17, date: "2025-01-27", time: "04:00 PM", typeId: 2 },
  
  { id: 18, date: "2025-01-28", time: "09:00 AM", typeId: 2 },
  { id: 19, date: "2025-01-28", time: "10:30 AM", typeId: 3 },
  { id: 20, date: "2025-01-28", time: "11:00 AM", typeId: 1 },
  { id: 21, date: "2025-01-28", time: "02:00 PM", typeId: 1 },
  { id: 22, date: "2025-01-28", time: "03:30 PM", typeId: 2 },
  
  { id: 23, date: "2025-01-29", time: "08:00 AM", typeId: 4 },
  { id: 24, date: "2025-01-29", time: "09:00 AM", typeId: 1 },
  { id: 25, date: "2025-01-29", time: "10:00 AM", typeId: 2 },
  { id: 26, date: "2025-01-29", time: "03:00 PM", typeId: 1 },
  { id: 27, date: "2025-01-29", time: "04:00 PM", typeId: 3 },
  
  { id: 28, date: "2025-01-30", time: "09:00 AM", typeId: 1 },
  { id: 29, date: "2025-01-30", time: "10:00 AM", typeId: 1 },
  { id: 30, date: "2025-01-30", time: "11:00 AM", typeId: 2 },
  { id: 31, date: "2025-01-30", time: "02:00 PM", typeId: 4 },
  { id: 32, date: "2025-01-30", time: "03:00 PM", typeId: 1 },
  
  { id: 33, date: "2025-01-31", time: "09:00 AM", typeId: 2 },
  { id: 34, date: "2025-01-31", time: "10:00 AM", typeId: 1 },
  { id: 35, date: "2025-01-31", time: "11:00 AM", typeId: 3 },
  { id: 36, date: "2025-01-31", time: "02:00 PM", typeId: 1 },
  
  // Februar
  { id: 37, date: "2025-02-01", time: "09:00 AM", typeId: 1 },
  { id: 38, date: "2025-02-01", time: "10:00 AM", typeId: 2 },
  { id: 39, date: "2025-02-01", time: "02:00 PM", typeId: 1 },
  
  { id: 40, date: "2025-02-03", time: "09:00 AM", typeId: 1 },
  { id: 41, date: "2025-02-03", time: "10:00 AM", typeId: 1 },
  { id: 42, date: "2025-02-03", time: "11:00 AM", typeId: 2 },
  { id: 43, date: "2025-02-03", time: "02:00 PM", typeId: 3 },
  { id: 44, date: "2025-02-03", time: "03:00 PM", typeId: 1 },
];

// -----------------------------------------------------------------------------
// 1.4 STUDIO DATA - Studio-Informationen für Chats und Branding
// -----------------------------------------------------------------------------
export const studioData = {
  id: 100,
  name: "Fit & Fun Studio",
  shortName: "Fit & Fun",
  email: "info@fitfun-studio.com",
  phone: "+49 123 456789",
  street: "Hauptstraße 123",
  zipCode: "70173",
  city: "Stuttgart",
  country: "Germany",
  logo: null, // URL zum Studio-Logo oder null für Default
  avatar: null, // URL zum Avatar oder null für InitialsAvatar
  website: "https://www.fitfun-studio.com",
  openingHours: [
    { day: 'Monday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Tuesday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Wednesday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Thursday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Friday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Saturday', startTime: '10:00', endTime: '18:00', closed: false },
    { day: 'Sunday', startTime: null, endTime: null, closed: true },
  ],
  capacity: 3, // Max parallel appointments
  timezone: "Europe/Berlin",
};

// ============================================================================
// SECTION 2: MEMBER DATA
// ============================================================================

// Member History
export const memberHistoryData = {
  1: {
    general: [{ id: 1, date: "2025-01-15", action: "Email updated", details: "Changed email", user: "Admin" }],
    checkins: [{ id: 1, date: "2025-01-20T09:30", type: "Check-in", location: "Main Entrance", user: "John Doe" }],
    appointments: [{ id: 1, date: "2025-01-18T10:00", title: "Personal Training", status: "completed", trainer: "John Trainer" }],
    finance: [{ id: 1, date: "2025-01-01", type: "Payment", amount: "$99.99", description: "Monthly fee", status: "completed" }],
    contracts: [{ id: 1, date: "2024-03-01", action: "Contract signed", details: "12-month membership", user: "Admin" }],
  },
  2: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  3: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  4: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  5: { general: [{ id: 1, date: "2025-01-25", action: "Birthday", details: "Happy Birthday!", user: "System" }], checkins: [], appointments: [], finance: [], contracts: [] },
  6: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  7: { general: [{ id: 1, date: "2025-01-24", action: "Inquiry received", details: "Scheduled tour", user: "Reception" }], checkins: [], appointments: [], finance: [], contracts: [] },
  8: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  9: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  10: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
};

// Member Relations
export const memberRelationsData = {
  1: { family: [{ name: "Anna Doe", relation: "Mother", id: 101, type: "member" }], friendship: [], relationship: [], work: [], other: [] },
  2: { family: [], friendship: [], relationship: [], work: [], other: [] },
  3: { family: [], friendship: [], relationship: [], work: [], other: [] },
  4: { family: [], friendship: [], relationship: [], work: [], other: [] },
  5: { family: [], friendship: [], relationship: [], work: [], other: [] },
  6: { family: [], friendship: [], relationship: [], work: [], other: [] },
  7: { family: [], friendship: [], relationship: [], work: [], other: [] },
  8: { family: [], friendship: [], relationship: [], work: [], other: [] },
  9: { family: [], friendship: [], relationship: [], work: [], other: [] },
  10: { family: [], friendship: [], relationship: [], work: [], other: [] },
};

// Relation Options
export const relationOptionsData = {
  family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin"],
  friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
  relationship: ["Partner", "Spouse", "Ex-Partner"],
  work: ["Colleague", "Boss", "Employee", "Business Partner"],
  other: ["Neighbor", "Doctor", "Trainer", "Other"],
};

// Member Contingent/Credits
export const memberContingentData = {
  1: { current: { used: 3, total: 10 }, future: {} },
  2: { current: { used: 8, total: 8 }, future: {} },
  3: { current: { used: 1, total: 12 }, future: {} },
  4: { current: { used: 0, total: 15 }, future: {} },
  5: { current: { used: 5, total: 8 }, future: {} },
  6: { current: { used: 2, total: 8 }, future: {} },
  7: { current: { used: 0, total: 3 }, future: {} },
  8: { current: { used: 4, total: 8 }, future: {} },
  9: { current: { used: 2, total: 8 }, future: {} },
  10: { current: { used: 3, total: 8 }, future: {} },
};

// Billing Periods
export const billingPeriodsData = [
  { id: 1, name: "January 2025", startDate: "2025-01-01", endDate: "2025-01-31" },
  { id: 2, name: "February 2025", startDate: "2025-02-01", endDate: "2025-02-28" },
  { id: 3, name: "March 2025", startDate: "2025-03-01", endDate: "2025-03-31" },
];

// ============================================================================
// SECTION 3: COMMUNICATION
// ============================================================================

// Member Chat List - Vollständige Konversationen mit "You" Nachrichten
export const memberChatListData = [
  { 
    id: 1, memberId: 1, name: "John Doe", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi John! How was your first EMS session?", time: "01:45 PM", timestamp: "2025-01-25T13:45:00", status: "read" },
      { id: 2, sender: "John", content: "It was amazing! I can really feel the difference already.", time: "01:52 PM", timestamp: "2025-01-25T13:52:00", status: "read" },
      { id: 3, sender: "You", content: "Great to hear! Remember to stay hydrated and get enough protein today.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 4, sender: "John", content: "Will do! When is my next appointment?", time: "02:15 PM", timestamp: "2025-01-25T14:15:00", status: "read" },
      { id: 5, sender: "You", content: "You're scheduled for Monday at 10:00 AM. See you then! 💪", time: "02:20 PM", timestamp: "2025-01-25T14:20:00", status: "read" },
      { id: 6, sender: "John", content: "Thanks for the session!", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "read" },
    ]
  },
  { 
    id: 2, memberId: 4, name: "Sarah Williams", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Sarah", content: "Hi! I wanted to ask about the yoga class schedule.", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 2, sender: "You", content: "Hi Sarah! We have yoga classes every Tuesday and Thursday at 6 PM.", time: "10:45 AM", timestamp: "2025-01-25T10:45:00", status: "read" },
      { id: 3, sender: "Sarah", content: "Perfect! Can I still join tomorrow's class?", time: "11:00 AM", timestamp: "2025-01-25T11:00:00", status: "read" },
      { id: 4, sender: "You", content: "Yes, there are still 2 spots available! I'll reserve one for you.", time: "11:15 AM", timestamp: "2025-01-25T11:15:00", status: "read" },
      { id: 5, sender: "Sarah", content: "Is the yoga class still on?", time: "11:30 AM", timestamp: "2025-01-25T11:30:00", status: "delivered" },
      { id: 6, sender: "Sarah", content: "Looking forward to the yoga class!", time: "11:45 AM", timestamp: "2025-01-25T11:45:00", status: "delivered" },
    ]
  },
  { 
    id: 3, memberId: 3, name: "Michael Johnson", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Michael! Ready for your marathon training session?", time: "03:00 PM", timestamp: "2025-01-24T15:00:00", status: "read" },
      { id: 2, sender: "Michael", content: "Absolutely! I've been preparing all week.", time: "03:15 PM", timestamp: "2025-01-24T15:15:00", status: "read" },
      { id: 3, sender: "You", content: "Great! We'll focus on endurance today. Don't forget to bring extra water.", time: "03:30 PM", timestamp: "2025-01-24T15:30:00", status: "read" },
      { id: 4, sender: "Michael", content: "Got it! See you at 4 PM.", time: "03:45 PM", timestamp: "2025-01-24T15:45:00", status: "read" },
      { id: 5, sender: "You", content: "See you soon! 🏃", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 6, sender: "Michael", content: "See you at marathon prep!", time: "04:20 PM", timestamp: "2025-01-24T16:20:00", status: "read" },
    ]
  },
  { 
    id: 4, memberId: 5, name: "David Brown", 
    logo: null, isBirthday: true, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Happy Birthday, David! 🎂🎉", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "read" },
      { id: 2, sender: "David", content: "Thank you so much! That's so nice of you!", time: "08:30 AM", timestamp: "2025-01-25T08:30:00", status: "read" },
      { id: 3, sender: "You", content: "We have a special birthday discount for you - 20% off your next month!", time: "08:45 AM", timestamp: "2025-01-25T08:45:00", status: "read" },
      { id: 4, sender: "David", content: "Wow, that's amazing! I'll definitely use that.", time: "09:00 AM", timestamp: "2025-01-25T09:00:00", status: "read" },
      { id: 5, sender: "You", content: "Your next session is tomorrow at 3 PM. See you there!", time: "09:10 AM", timestamp: "2025-01-25T09:10:00", status: "read" },
      { id: 6, sender: "David", content: "Perfect, I'll be there!", time: "09:15 AM", timestamp: "2025-01-25T09:15:00", status: "read" },
    ]
  },
  { 
    id: 5, memberId: 7, name: "Robert Miller", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Robert", content: "Hello! I booked a trial training for today.", time: "07:30 AM", timestamp: "2025-01-25T07:30:00", status: "read" },
      { id: 2, sender: "You", content: "Welcome Robert! Yes, we have you down for 10 AM. Please bring your ID.", time: "07:45 AM", timestamp: "2025-01-25T07:45:00", status: "read" },
      { id: 3, sender: "Robert", content: "Great! What should I wear?", time: "07:50 AM", timestamp: "2025-01-25T07:50:00", status: "read" },
      { id: 4, sender: "You", content: "Comfortable sportswear is fine. We'll provide everything else including the EMS suit!", time: "07:55 AM", timestamp: "2025-01-25T07:55:00", status: "read" },
      { id: 5, sender: "Robert", content: "Looking forward to the tour!", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "delivered" },
    ]
  },
  { 
    id: 6, memberId: 8, name: "Lisa Garcia", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Lisa! Just confirming your cardio session for Monday at 9 AM.", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 2, sender: "Lisa", content: "Thanks for the reminder! I'll be there.", time: "04:30 PM", timestamp: "2025-01-24T16:30:00", status: "read" },
      { id: 3, sender: "You", content: "Perfect! Have a great weekend!", time: "04:45 PM", timestamp: "2025-01-24T16:45:00", status: "read" },
      { id: 4, sender: "Lisa", content: "You too! See you Monday!", time: "05:00 PM", timestamp: "2025-01-24T17:00:00", status: "read" },
    ]
  },
];

// Staff Chat List - Vollständige Konversationen zwischen Staff-Mitgliedern
export const staffChatListData = [
  { 
    id: 101, staffId: 2, name: "John Trainer", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hey John, can you cover my 2 PM session today?", time: "12:00 PM", timestamp: "2025-01-25T12:00:00", status: "read" },
      { id: 2, sender: "John Trainer", content: "Sure, no problem! Is everything okay?", time: "12:15 PM", timestamp: "2025-01-25T12:15:00", status: "read" },
      { id: 3, sender: "You", content: "Yes, just have a doctor's appointment. Thanks so much!", time: "12:20 PM", timestamp: "2025-01-25T12:20:00", status: "read" },
      { id: 4, sender: "John Trainer", content: "No worries. Who's the client?", time: "12:30 PM", timestamp: "2025-01-25T12:30:00", status: "read" },
      { id: 5, sender: "You", content: "It's David Brown - EMS Strength session. He prefers upper body focus.", time: "12:35 PM", timestamp: "2025-01-25T12:35:00", status: "read" },
      { id: 6, sender: "John Trainer", content: "Got it! I'll check the schedule.", time: "05:30 PM", timestamp: "2025-01-25T17:30:00", status: "delivered" },
    ]
  },
  { 
    id: 102, staffId: 3, name: "Sarah Coach", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Sarah Coach", content: "Hi! The yoga mats need to be replaced soon.", time: "01:00 PM", timestamp: "2025-01-25T13:00:00", status: "read" },
      { id: 2, sender: "You", content: "Thanks for letting me know. How many do we need?", time: "01:30 PM", timestamp: "2025-01-25T13:30:00", status: "read" },
      { id: 3, sender: "Sarah Coach", content: "At least 5 new ones. The current ones are getting worn.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 4, sender: "You", content: "I'll order them today. Any specific brand preference?", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "read" },
      { id: 5, sender: "Sarah Coach", content: "The Manduka ones are great if they're in budget.", time: "03:00 PM", timestamp: "2025-01-25T15:00:00", status: "read" },
      { id: 6, sender: "Sarah Coach", content: "Can we discuss the schedule?", time: "03:15 PM", timestamp: "2025-01-25T15:15:00", status: "delivered" },
    ]
  },
  { 
    id: 103, staffId: 4, name: "Mike Manager", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Mike Manager", content: "Team, don't forget the staff meeting tomorrow at 10 AM.", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 2, sender: "You", content: "Will be there! Do we need to prepare anything?", time: "04:30 PM", timestamp: "2025-01-24T16:30:00", status: "read" },
      { id: 3, sender: "Mike Manager", content: "Just bring your monthly stats if you have them ready.", time: "05:00 PM", timestamp: "2025-01-24T17:00:00", status: "read" },
      { id: 4, sender: "You", content: "Perfect, I'll have them ready.", time: "05:30 PM", timestamp: "2025-01-24T17:30:00", status: "read" },
      { id: 5, sender: "Mike Manager", content: "Staff meeting confirmed.", time: "06:00 PM", timestamp: "2025-01-24T18:00:00", status: "read" },
    ]
  },
  { 
    id: 104, staffId: 5, name: "Lisa Reception", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Lisa Reception", content: "New member signed up! Robert Miller, trial training today.", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "read" },
      { id: 2, sender: "You", content: "Great! Who's assigned to his trial?", time: "08:15 AM", timestamp: "2025-01-25T08:15:00", status: "read" },
      { id: 3, sender: "Lisa Reception", content: "John Trainer will handle it at 10 AM.", time: "08:20 AM", timestamp: "2025-01-25T08:20:00", status: "read" },
      { id: 4, sender: "You", content: "Perfect. Did you send the confirmation email?", time: "08:30 AM", timestamp: "2025-01-25T08:30:00", status: "read" },
      { id: 5, sender: "Lisa Reception", content: "Yes, all done! Forms are printed too.", time: "08:35 AM", timestamp: "2025-01-25T08:35:00", status: "read" },
    ]
  },
  { 
    id: 105, staffId: 1, name: "Natalia Brown", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Natalia, can you update the member database today?", time: "10:00 AM", timestamp: "2025-01-25T10:00:00", status: "read" },
      { id: 2, sender: "Natalia Brown", content: "Sure! Any specific members?", time: "10:15 AM", timestamp: "2025-01-25T10:15:00", status: "read" },
      { id: 3, sender: "You", content: "The new trial members from this week need their info completed.", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 4, sender: "Natalia Brown", content: "I'll get on it right away.", time: "10:45 AM", timestamp: "2025-01-25T10:45:00", status: "read" },
    ]
  },
];

// Company/Studio Chat List - Team-Gruppen-Chat
export const companyChatListData = [
  { 
    id: 100, 
    name: "Fit & Fun Studio", 
    logo: null,
    avatar: null, // Verwendet DefaultAvatar
    isCompany: true,
    isArchived: false,
    messages: [
      { id: 1, sender: "Mike Manager", staffId: 4, content: "Guten Morgen zusammen! Kurze Erinnerung: Heute um 10 Uhr findet das Team-Meeting statt.", time: "09:00 AM", timestamp: "2025-01-25T09:00:00", status: "read" },
      { id: 2, sender: "You", content: "Danke für die Erinnerung! Bin dabei.", time: "09:10 AM", timestamp: "2025-01-25T09:10:00", status: "read" },
      { id: 3, sender: "Sarah Coach", staffId: 3, content: "Ich bereite die Statistiken für die Gruppenklassen vor.", time: "09:15 AM", timestamp: "2025-01-25T09:15:00", status: "read" },
      { id: 4, sender: "John Trainer", staffId: 2, content: "Ich habe die neuen Trainingspläne fertig. Kann ich die im Meeting kurz vorstellen?", time: "09:22 AM", timestamp: "2025-01-25T09:22:00", status: "read" },
      { id: 5, sender: "Mike Manager", staffId: 4, content: "Ja klar, John! Das passt perfekt in die Agenda.", time: "09:25 AM", timestamp: "2025-01-25T09:25:00", status: "read" },
      { id: 6, sender: "You", content: "Super, freue mich auf die Vorstellung!", time: "09:30 AM", timestamp: "2025-01-25T09:30:00", status: "read" },
      { id: 7, sender: "Lisa Reception", staffId: 5, content: "Ich habe gerade einen Anruf bekommen - der neue Interessent Robert Miller kommt heute um 10 Uhr zum Probetraining.", time: "09:45 AM", timestamp: "2025-01-25T09:45:00", status: "read" },
      { id: 8, sender: "Natalia Brown", staffId: 1, content: "Super! Ich habe seine Kontaktdaten schon im System angelegt.", time: "09:50 AM", timestamp: "2025-01-25T09:50:00", status: "read" },
      { id: 9, sender: "John Trainer", staffId: 2, content: "Perfekt, ich übernehme das Probetraining dann. Ist alles vorbereitet?", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 10, sender: "Lisa Reception", staffId: 5, content: "Ja, die Einverständniserklärung liegt bereit!", time: "10:35 AM", timestamp: "2025-01-25T10:35:00", status: "read" },
      { id: 11, sender: "You", content: "Perfekt organisiert, Team! 👏", time: "10:40 AM", timestamp: "2025-01-25T10:40:00", status: "read" },
      { id: 12, sender: "Sarah Coach", staffId: 3, content: "Kurze Info: Der Yoga-Kurs um 18 Uhr ist schon fast ausgebucht - nur noch 2 Plätze frei!", time: "01:15 PM", timestamp: "2025-01-25T13:15:00", status: "read" },
      { id: 13, sender: "Mike Manager", staffId: 4, content: "Das sind tolle Neuigkeiten! Vielleicht sollten wir einen zweiten Kurs anbieten?", time: "01:30 PM", timestamp: "2025-01-25T13:30:00", status: "read" },
      { id: 14, sender: "Sarah Coach", staffId: 3, content: "Gute Idee! Ich könnte Donnerstags noch einen Kurs übernehmen.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 15, sender: "John Trainer", staffId: 2, content: "Das Probetraining mit Robert lief super! Er möchte sich für eine Mitgliedschaft anmelden. 💪", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "delivered" },
      { id: 16, sender: "You", content: "Fantastisch! Gut gemacht, John!", time: "02:35 PM", timestamp: "2025-01-25T14:35:00", status: "delivered" },
      { id: 17, sender: "Lisa Reception", staffId: 5, content: "Alles klar, ich kümmere mich um die Anmeldung!", time: "02:45 PM", timestamp: "2025-01-25T14:45:00", status: "delivered" },
    ]
  },
];

// Email Data - Structured by folder
// ============================================================================
// EMAIL DATA - Umfangreiche Email-Daten für das Communications-Modul
// ============================================================================
// Feldnamen kompatibel mit communications.jsx:
// - sender: Absender-Name | senderEmail: Absender-Email
// - recipient: Empfänger-Name | recipientEmail: Empfänger-Email  
// - time: ISO-Timestamp | status: Sent/Delivered/Read/Failed
// ============================================================================
export const emailListData = {
  inbox: [
    {
      id: 1,
      sender: "John Doe",
      senderEmail: "john.doe@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Membership Upgrade Request",
      body: `<p>Hello FitLife Team,</p>
<p>I've been a member for over <strong>6 months</strong> now and I'm absolutely loving the experience! The facilities are top-notch and the trainers are incredibly supportive.</p>
<p>I wanted to inquire about upgrading my current membership to the <strong>Premium Plan</strong>. Specifically, I'm interested in:</p>
<ul>
  <li>Access to the spa and sauna facilities</li>
  <li>Priority booking for group classes</li>
  <li>Personal training sessions included</li>
</ul>
<p>Could you please send me the details about the upgrade process and any promotional offers currently available?</p>
<p>Thank you!</p>
<p>Best regards,<br/><strong>John Doe</strong><br/>Member #M001</p>`,
      time: "2025-01-26T09:30:00Z",
      isRead: false,
      isPinned: true,
      isArchived: false,
      status: "Delivered",
      attachments: []
    },
    {
      id: 2,
      sender: "Sarah Williams",
      senderEmail: "sarah.w@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Yoga Class Schedule Change Request",
      body: `<p>Hi there,</p>
<p>I hope this email finds you well! I'm writing regarding the <em>morning yoga classes</em> on Tuesdays and Thursdays.</p>
<p>Due to a change in my work schedule, I'm no longer able to attend the <strong>7:00 AM sessions</strong>. I was wondering if there are any alternative time slots available, preferably:</p>
<ol>
  <li>Evening classes (6:00 PM - 8:00 PM)</li>
  <li>Lunch break sessions (12:00 PM - 1:00 PM)</li>
  <li>Weekend morning classes</li>
</ol>
<p>I've attached my current work schedule for reference. Please let me know what options might work best.</p>
<p>Thank you for your flexibility!</p>
<p>Warm regards,<br/><strong>Sarah Williams</strong></p>`,
      time: "2025-01-26T08:15:00Z",
      isRead: false,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "work_schedule_january.pdf", size: "245 KB", type: "application/pdf" }
      ]
    },
    {
      id: 3,
      sender: "Michael Johnson",
      senderEmail: "michael.j@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Training Plan Feedback & Questions",
      body: `<p>Hey Team!</p>
<p>First off, I wanted to say a <strong>huge thank you</strong> for the personalized training plan you put together for me. I've been following it for 3 weeks now and already seeing great results!</p>
<p>I do have some questions about the <strong>cardio section</strong>:</p>
<blockquote style="border-left: 3px solid #666; padding-left: 15px; margin-left: 0; color: #aaa;">
  "Complete 20 minutes of HIIT training 3x per week"
</blockquote>
<p>Is it okay if I substitute some HIIT sessions with swimming? I find it easier on my joints and I enjoy it more.</p>
<p>Also, regarding the <strong>nutrition guidelines</strong>:</p>
<ul>
  <li>Should I increase protein intake on rest days?</li>
  <li>What's your recommendation for pre-workout meals?</li>
  <li>Any suggestions for healthy snacks between meals?</li>
</ul>
<p>Looking forward to your advice!</p>
<p>Cheers,<br/><strong>Michael Johnson</strong> 💪</p>`,
      time: "2025-01-25T16:45:00Z",
      isRead: false,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "progress_photos.zip", size: "5.2 MB", type: "application/zip" },
        { name: "weight_tracking.xlsx", size: "42 KB", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      ]
    },
    {
      id: 4,
      sender: "Emily Davis",
      senderEmail: "emily.d@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Rehabilitation Progress Update",
      body: `<p>Dear FitLife Team,</p>
<p>I wanted to provide an update on my <strong>knee rehabilitation</strong> progress following the program you designed for me.</p>
<p><u>Week 4 Progress:</u></p>
<ul>
  <li>✅ Range of motion has improved by approximately 15%</li>
  <li>✅ Pain level decreased from 6/10 to 3/10</li>
  <li>✅ Successfully completed all prescribed exercises</li>
  <li>⚠️ Still experiencing slight discomfort during lateral movements</li>
</ul>
<p>My physiotherapist has reviewed the attached medical report and believes we can <strong>gradually increase the intensity</strong> of the exercises next week.</p>
<p>Could we schedule a <em>follow-up consultation</em> to discuss the next phase of my rehabilitation?</p>
<p>Thank you for all your support during this recovery journey.</p>
<p>Kind regards,<br/><strong>Emily Davis</strong></p>`,
      time: "2025-01-25T14:20:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [
        { name: "physiotherapy_report.pdf", size: "1.8 MB", type: "application/pdf" },
        { name: "exercise_log.pdf", size: "520 KB", type: "application/pdf" }
      ]
    },
    {
      id: 5,
      sender: "David Brown",
      senderEmail: "david.brown@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Question about Contract Renewal",
      body: `<p>Hello,</p>
<p>My membership contract is set to expire on <strong>September 1st, 2024</strong> and I'd like to discuss renewal options.</p>
<p>I've been very happy with my experience at FitLife, especially:</p>
<ul>
  <li>The modern equipment and clean facilities</li>
  <li>Friendly and knowledgeable staff</li>
  <li>Convenient location and operating hours</li>
</ul>
<p>However, before renewing, I wanted to ask about:</p>
<ol>
  <li>Are there any loyalty discounts for returning members?</li>
  <li>What are the differences between annual vs. monthly plans?</li>
  <li>Can I add my wife to my membership with a family discount?</li>
</ol>
<p>Please send me the available options when you have a chance.</p>
<p>Thanks,<br/><strong>David Brown</strong></p>`,
      time: "2025-01-25T11:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: []
    },
    {
      id: 6,
      sender: "Jennifer Martinez",
      senderEmail: "jen.martinez@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Group Fitness Class Suggestion 🎵",
      body: `<p>Hi FitLife Team! 👋</p>
<p>I've been attending your group fitness classes for the past few months and I absolutely <strong>love the variety</strong> you offer!</p>
<p>I wanted to suggest adding a new class that I think many members would enjoy:</p>
<h3 style="color: #FF843E;">🎵 Dance Fitness / Zumba</h3>
<p>Here's why I think it would be a great addition:</p>
<ul>
  <li><strong>Fun cardio workout</strong> - Burns calories while having fun</li>
  <li><strong>Social aspect</strong> - Great way to meet other members</li>
  <li><strong>All fitness levels</strong> - Easy to modify for beginners</li>
  <li><strong>Stress relief</strong> - Dancing is proven to improve mood</li>
</ul>
<p>I even found a few potential instructors:</p>
<table style="border-collapse: collapse; width: 100%; margin: 15px 0;">
  <tr style="background: #333;">
    <td style="padding: 10px; border: 1px solid #444;"><strong>Name</strong></td>
    <td style="padding: 10px; border: 1px solid #444;"><strong>Certification</strong></td>
    <td style="padding: 10px; border: 1px solid #444;"><strong>Availability</strong></td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #444;">Maria Santos</td>
    <td style="padding: 10px; border: 1px solid #444;">Zumba Certified</td>
    <td style="padding: 10px; border: 1px solid #444;">Evenings</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #444;">Carlos Rivera</td>
    <td style="padding: 10px; border: 1px solid #444;">Dance Fitness Pro</td>
    <td style="padding: 10px; border: 1px solid #444;">Weekends</td>
  </tr>
</table>
<p>Would love to hear your thoughts on this! 🙏</p>
<p>Best,<br/><strong>Jennifer</strong></p>`,
      time: "2025-01-24T19:30:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: []
    },
    {
      id: 7,
      sender: "Robert Miller",
      senderEmail: "robert.m@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Gym Tour Follow-Up",
      body: `<p>Hello!</p>
<p>Thank you so much for the <strong>gym tour yesterday</strong>. I was really impressed with what FitLife has to offer!</p>
<p>A few things that stood out to me:</p>
<ul>
  <li>The <strong>free weights section</strong> is well-equipped</li>
  <li><strong>Cleanliness</strong> of the locker rooms was excellent</li>
  <li>The <strong>staff</strong> were friendly and welcoming</li>
</ul>
<p>I'm definitely interested in joining, but I have a few more questions:</p>
<ol>
  <li>Is there a trial period available before committing?</li>
  <li>What's included in the basic membership?</li>
  <li>Are there any sign-up promotions this month?</li>
</ol>
<p>I'd also like to know more about the <em>personal training packages</em> as I'm looking to work with a trainer for my first few months.</p>
<p>Looking forward to hearing from you!</p>
<p>Best regards,<br/><strong>Robert Miller</strong></p>`,
      time: "2025-01-24T10:15:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: []
    },
    {
      id: 8,
      sender: "Amanda Thompson",
      senderEmail: "amanda.t@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "⚠️ Complaint: Equipment Issue in Weight Room",
      body: `<p>Dear Management,</p>
<p>I'm writing to report an issue I encountered during my workout session on <strong>January 23rd at approximately 6:30 PM</strong>.</p>
<div style="background: #3a2a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
  <strong>⚠️ Safety Concern:</strong><br/>
  The cable on <strong>Machine #4 (Lat Pulldown)</strong> in the weight room appears to be frayed and could potentially snap during use.
</div>
<p>I've attached a photo showing the damage for your reference.</p>
<p>While I understand equipment wears out over time, I believe this is a <strong>safety hazard</strong> that should be addressed immediately. I recommend:</p>
<ol>
  <li>Taking the machine out of service until repaired</li>
  <li>Posting a clear "Out of Order" sign</li>
  <li>Scheduling maintenance ASAP</li>
</ol>
<p>I hope this can be resolved quickly. Thank you for your attention to this matter.</p>
<p>Regards,<br/><strong>Amanda Thompson</strong><br/>Member since 2022</p>`,
      time: "2025-01-23T20:45:00Z",
      isRead: true,
      isPinned: true,
      isArchived: false,
      status: "Read",
      attachments: [
        { name: "equipment_damage.jpg", size: "2.1 MB", type: "image/jpeg" }
      ]
    },
    {
      id: 9,
      sender: "Lisa Chen",
      senderEmail: "lisa.chen@techvision.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Corporate Membership Inquiry - TechVision Inc.",
      body: `<p>Dear FitLife Team,</p>
<p>I'm the <strong>HR Manager</strong> at <em>TechVision Inc.</em> and I'm reaching out to inquire about <strong>corporate membership packages</strong> for our employees.</p>
<p>Our company has approximately <strong>150 employees</strong> in the area, and we're looking to partner with a fitness facility to promote workplace wellness.</p>
<p><u>We're interested in:</u></p>
<ul>
  <li>Discounted membership rates for employees</li>
  <li>Flexible payment options (payroll deduction)</li>
  <li>On-site fitness assessments or workshops</li>
  <li>Group class reservations for team building</li>
</ul>
<p>I've attached our company profile for your reference. Could we schedule a meeting to discuss partnership opportunities?</p>
<p><strong>Available times:</strong></p>
<ul>
  <li>Tuesday, Jan 28 - 10:00 AM or 2:00 PM</li>
  <li>Wednesday, Jan 29 - 11:00 AM</li>
  <li>Thursday, Jan 30 - Any time after 1:00 PM</li>
</ul>
<p>Looking forward to exploring this partnership!</p>
<p>Best regards,<br/><strong>Lisa Chen</strong><br/>HR Manager, TechVision Inc.<br/>📞 (555) 123-4567<br/>✉️ lisa.chen@techvision.com</p>`,
      time: "2025-01-22T09:00:00Z",
      isRead: true,
      isPinned: true,
      isArchived: false,
      status: "Read",
      attachments: [
        { name: "TechVision_Company_Profile.pdf", size: "3.4 MB", type: "application/pdf" },
        { name: "Employee_Wellness_Survey.xlsx", size: "156 KB", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      ]
    },
    {
      id: 10,
      sender: "Chris Anderson",
      senderEmail: "chris.a@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Re: Personal Training Package",
      body: `<p>Hi,</p>
<p>Thanks for sending over the personal training options! After reviewing them, I'd like to go with <strong>Option B: 12 Sessions Package</strong>.</p>
<p>My preferred schedule would be:</p>
<ul>
  <li><strong>Mondays</strong> at 7:00 AM</li>
  <li><strong>Wednesdays</strong> at 7:00 AM</li>
  <li><strong>Fridays</strong> at 6:00 PM</li>
</ul>
<p>I'd prefer to work with <strong>Trainer Mike</strong> if he's available, as we've worked together before and I really like his training style.</p>
<p>Let me know the next steps to finalize the booking!</p>
<p>Thanks,<br/><strong>Chris</strong></p>`,
      time: "2025-01-21T14:30:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: []
    }
  ],

  sent: [
    {
      id: 101,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "John Doe",
      recipientEmail: "john.doe@example.com",
      subject: "Re: Membership Upgrade Request",
      body: `<p>Dear John,</p>
<p>Thank you for reaching out and for your kind words about our facility! We're thrilled to hear you're enjoying your membership. 😊</p>
<p>Regarding the <strong>Premium Plan upgrade</strong>, here's what's included:</p>
<h3 style="color: #FF843E;">Premium Membership Benefits:</h3>
<ul>
  <li>✨ <strong>Unlimited spa & sauna access</strong> (normally $50/month extra)</li>
  <li>🎯 <strong>Priority booking</strong> for all group classes</li>
  <li>💪 <strong>2 personal training sessions</strong> per month included</li>
  <li>🧘 <strong>Free guest passes</strong> (2 per month)</li>
  <li>🎁 <strong>20% discount</strong> on all merchandise</li>
</ul>
<div style="background: #2a3a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 15px 0;">
  <strong>Special Offer for Existing Members:</strong><br/>
  As a valued member, we'd like to offer you a <strong>15% loyalty discount</strong> on the upgrade fee! This brings your monthly rate to <strong>$89.99/month</strong> (regularly $105.99).
</div>
<p>To proceed with the upgrade, simply:</p>
<ol>
  <li>Reply to this email confirming your interest</li>
  <li>Visit the front desk to sign the updated agreement</li>
  <li>Enjoy your new benefits immediately!</li>
</ol>
<p>Let us know if you have any questions!</p>
<p>Best regards,<br/><strong>Sarah</strong><br/>FitLife Studio Customer Service<br/>📞 (555) 987-6543</p>`,
      time: "2025-01-26T10:45:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "Premium_Membership_Details.pdf", size: "890 KB", type: "application/pdf" }
      ]
    },
    {
      id: 102,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Sarah Williams",
      recipientEmail: "sarah.w@example.com",
      subject: "Re: Yoga Class Schedule Change Request",
      body: `<p>Hi Sarah,</p>
<p>Thank you for letting us know about your schedule change. We completely understand and want to make sure you can continue your yoga practice with us!</p>
<p>Great news - we have several <strong>alternative time slots</strong> available:</p>
<h3>Evening Classes:</h3>
<table style="border-collapse: collapse; width: 100%; margin: 15px 0;">
  <tr style="background: #333;">
    <td style="padding: 10px; border: 1px solid #444;"><strong>Day</strong></td>
    <td style="padding: 10px; border: 1px solid #444;"><strong>Time</strong></td>
    <td style="padding: 10px; border: 1px solid #444;"><strong>Instructor</strong></td>
    <td style="padding: 10px; border: 1px solid #444;"><strong>Style</strong></td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #444;">Tuesday</td>
    <td style="padding: 10px; border: 1px solid #444;">6:30 PM</td>
    <td style="padding: 10px; border: 1px solid #444;">Maya</td>
    <td style="padding: 10px; border: 1px solid #444;">Vinyasa Flow</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #444;">Thursday</td>
    <td style="padding: 10px; border: 1px solid #444;">7:00 PM</td>
    <td style="padding: 10px; border: 1px solid #444;">David</td>
    <td style="padding: 10px; border: 1px solid #444;">Hatha Yoga</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #444;">Saturday</td>
    <td style="padding: 10px; border: 1px solid #444;">9:00 AM</td>
    <td style="padding: 10px; border: 1px solid #444;">Maya</td>
    <td style="padding: 10px; border: 1px solid #444;">Restorative</td>
  </tr>
</table>
<p>I've attached the complete class schedule for your reference. Let us know which classes you'd like to switch to!</p>
<p>Namaste 🙏</p>
<p><strong>Reception Team</strong><br/>FitLife Studio</p>`,
      time: "2025-01-26T09:30:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "January_February_Class_Schedule.pdf", size: "1.2 MB", type: "application/pdf" }
      ]
    },
    {
      id: 103,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Emily Davis",
      recipientEmail: "emily.d@example.com",
      subject: "Re: Rehabilitation Progress Update - Phase 2 Plan",
      body: `<p>Dear Emily,</p>
<p>What fantastic progress! 🎉 We're so proud of your dedication to your rehabilitation journey.</p>
<p>Your physiotherapist's feedback is very encouraging. Based on your update, I've discussed your case with our rehabilitation specialist, and we recommend the following for <strong>Phase 2</strong>:</p>
<h3 style="color: #FF843E;">Updated Exercise Plan:</h3>
<ul>
  <li>✅ Continue current exercises at same intensity (Week 1-2)</li>
  <li>⬆️ Gradually increase resistance on leg press by 10% (Week 3)</li>
  <li>➕ Add balance exercises using BOSU ball (Week 2)</li>
  <li>🏊 Pool exercises can begin (low-impact cardio)</li>
</ul>
<p><strong>⚠️ Important:</strong> For the lateral movement discomfort, we suggest:</p>
<ol>
  <li>Applying ice for 15 minutes post-workout</li>
  <li>Wearing a compression sleeve during exercise</li>
  <li>Avoiding sudden directional changes for now</li>
</ol>
<div style="background: #2a2a3a; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <strong>📅 Follow-up Consultation Scheduled:</strong><br/>
  <strong>Date:</strong> Thursday, January 30th<br/>
  <strong>Time:</strong> 11:00 AM<br/>
  <strong>With:</strong> Dr. Sarah Martinez (Rehabilitation Specialist)
</div>
<p>Please confirm this works for you!</p>
<p>Keep up the amazing work! 💪</p>
<p><strong>FitLife Rehabilitation Team</strong></p>`,
      time: "2025-01-25T15:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [
        { name: "Phase2_Exercise_Plan.pdf", size: "2.3 MB", type: "application/pdf" },
        { name: "Pool_Exercises_Guide.pdf", size: "1.5 MB", type: "application/pdf" }
      ]
    },
    {
      id: 104,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Amanda Thompson",
      recipientEmail: "amanda.t@example.com",
      subject: "Re: Equipment Issue - RESOLVED ✅",
      body: `<p>Dear Amanda,</p>
<p>Thank you so much for bringing this safety concern to our attention. We take equipment maintenance <strong>very seriously</strong>, and your vigilance helps us maintain a safe environment for all members.</p>
<h3>✅ Actions Taken:</h3>
<ul>
  <li>The Lat Pulldown machine (Machine #4) has been <strong>immediately taken out of service</strong></li>
  <li>A clear "Out of Order" sign has been posted</li>
  <li>Our maintenance team inspected the equipment this morning</li>
  <li>A new cable has been ordered and will arrive within 3-5 business days</li>
</ul>
<div style="background: #2a3a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 15px 0;">
  <strong>🎁 Token of Appreciation:</strong><br/>
  As thanks for your report, we'd like to offer you <strong>one complimentary personal training session</strong>!<br/>
  <em>Valid for the next 30 days. Simply mention this email at the front desk to redeem.</em>
</div>
<p>We've also conducted a full inspection of all equipment in the weight room to ensure everything else is in proper working condition.</p>
<p>Thank you again for being a responsible member of our community!</p>
<p>Best regards,<br/><strong>Marcus Johnson</strong><br/>Facility Manager, FitLife Studio</p>`,
      time: "2025-01-24T08:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: []
    },
    {
      id: 105,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Lisa Chen",
      recipientEmail: "lisa.chen@techvision.com",
      subject: "Re: Corporate Membership Inquiry - Meeting Confirmed 🤝",
      body: `<p>Dear Lisa,</p>
<p>Thank you for reaching out! We're very excited about the potential partnership with <strong>TechVision Inc.</strong> and would love to discuss corporate membership options with you.</p>
<p>I've reviewed your company profile and wellness survey results - it's clear that TechVision values employee wellbeing, which aligns perfectly with our mission!</p>
<div style="background: #2a2a3a; padding: 20px; border-radius: 8px; margin: 15px 0;">
  <h3 style="color: #3F74FF; margin-top: 0;">📅 Meeting Confirmation</h3>
  <strong>Date:</strong> Tuesday, January 28th, 2025<br/>
  <strong>Time:</strong> 10:00 AM<br/>
  <strong>Location:</strong> FitLife Studio - Conference Room A<br/>
  <strong>Attendees:</strong> You + Our Corporate Partnerships Manager
</div>
<p><strong>Agenda:</strong></p>
<ol>
  <li>Tour of our facilities</li>
  <li>Overview of corporate membership tiers</li>
  <li>Discussion of pricing and payment options</li>
  <li>On-site services and team-building activities</li>
  <li>Q&A and next steps</li>
</ol>
<p>I've attached our Corporate Partnership brochure and rate sheet for you to review before our meeting.</p>
<p>Looking forward to meeting you!</p>
<p>Best regards,<br/><strong>Jennifer Adams</strong><br/>Corporate Partnerships Manager<br/>FitLife Studio<br/>📞 (555) 987-6544</p>`,
      time: "2025-01-22T11:30:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [
        { name: "FitLife_Corporate_Partnership_Brochure.pdf", size: "4.7 MB", type: "application/pdf" },
        { name: "Corporate_Rate_Sheet_2025.pdf", size: "320 KB", type: "application/pdf" }
      ]
    },
    {
      id: 106,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "All Members",
      recipientEmail: "members@fitlife.com",
      subject: "🎉 February Newsletter - New Classes & Special Offers!",
      body: `<p>Dear FitLife Family,</p>
<p>Happy February! We hope your New Year's fitness resolutions are going strong! 💪</p>
<h2 style="color: #FF843E;">🆕 New This Month</h2>
<h3>Introducing: Dance Fitness Classes!</h3>
<p>Based on popular demand, we're thrilled to announce our new <strong>Dance Fitness program</strong> starting February 3rd!</p>
<ul>
  <li>🕺 <strong>Zumba</strong> - Tuesdays & Thursdays at 6:30 PM</li>
  <li>💃 <strong>Hip Hop Cardio</strong> - Saturdays at 10:00 AM</li>
  <li>🎵 <strong>Latin Rhythms</strong> - Wednesdays at 7:00 PM</li>
</ul>
<h2 style="color: #FF843E;">❤️ Valentine's Day Special</h2>
<div style="background: linear-gradient(135deg, #2a2a3a, #3a2a3a); padding: 20px; border-radius: 12px; text-align: center; margin: 15px 0;">
  <strong style="font-size: 20px; color: #FF6B6B;">Bring Your Partner for FREE</strong><br/>
  <span style="color: #aaa;">February 12-16, 2025</span><br/>
  <em>Couples who sweat together, stay together! 💕</em>
</div>
<h2 style="color: #FF843E;">🏆 Member Spotlight</h2>
<p>Congratulations to <strong>Michael Johnson</strong> for completing his 100th workout at FitLife! 🎊</p>
<h2 style="color: #FF843E;">📅 Upcoming Events</h2>
<ul>
  <li><strong>Feb 8:</strong> Nutrition Workshop with Dr. Martinez</li>
  <li><strong>Feb 15:</strong> Couples Workout Challenge</li>
  <li><strong>Feb 22:</strong> Open House - Invite a Friend Day</li>
</ul>
<p>See you at the gym!</p>
<p>Best,<br/><strong>The FitLife Team</strong></p>`,
      time: "2025-01-25T08:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "February_Calendar.pdf", size: "1.8 MB", type: "application/pdf" }
      ]
    },
    {
      id: 107,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Robert Miller",
      recipientEmail: "robert.m@example.com",
      subject: "Re: Gym Tour Follow-Up - Special Offer Inside! 🎁",
      body: `<p>Hi Robert,</p>
<p>Thank you for visiting FitLife yesterday and for your kind feedback! We're delighted that you enjoyed the tour.</p>
<p>To answer your questions:</p>
<h3>1. Trial Period</h3>
<p>Yes! We offer a <strong>7-day free trial</strong> for new members. This gives you full access to:</p>
<ul>
  <li>All gym equipment and facilities</li>
  <li>Group fitness classes</li>
  <li>Locker room amenities</li>
</ul>
<h3>2. Basic Membership Includes</h3>
<ul>
  <li>✅ Unlimited gym access (6 AM - 10 PM)</li>
  <li>✅ Access to cardio & weight areas</li>
  <li>✅ Locker room & shower facilities</li>
  <li>✅ Free fitness assessment</li>
</ul>
<h3>3. Current Promotions</h3>
<div style="background: #2a3a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #FF843E; margin: 15px 0;">
  <strong>🎁 January Special:</strong><br/>
  Sign up this month and get <strong>$0 enrollment fee</strong> (normally $99)!<br/>
  Plus: <strong>1 FREE personal training session</strong> to get you started.
</div>
<p>Ready to start your fitness journey? Simply reply to this email or stop by the front desk!</p>
<p>Best regards,<br/><strong>Reception Team</strong><br/>FitLife Studio</p>`,
      time: "2025-01-24T11:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "Membership_Plans_2025.pdf", size: "650 KB", type: "application/pdf" },
        { name: "Personal_Training_Packages.pdf", size: "480 KB", type: "application/pdf" }
      ]
    }
  ],

  draft: [
    {
      id: 201,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "",
      recipientEmail: "",
      subject: "March Promotions - Spring Into Fitness! 🌷",
      body: `<p>Dear Members,</p>
<p>Get ready for an amazing March at FitLife!</p>
<h3>🌷 Spring Into Fitness Sale</h3>
<ul>
  <li>50% off all new memberships</li>
  <li>Free personal training assessment</li>
  <li>Bring a friend for free week</li>
</ul>
<h3>New Classes Starting</h3>
<p><em>[Add details about new spring classes...]</em></p>
<p><em>[Continue drafting...]</em></p>`,
      time: "2025-01-24T16:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Draft",
      attachments: []
    },
    {
      id: 202,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Equipment Supplier",
      recipientEmail: "orders@gymequip.com",
      subject: "Equipment Order - Q1 2025",
      body: `<p>Dear Supplier,</p>
<p>We would like to place an order for the following equipment:</p>
<ul>
  <li>2x Commercial Treadmills (Model TRX-500)</li>
  <li>1x Cable Crossover Machine</li>
  <li>Set of Dumbbells (5-50 lbs, pairs)</li>
  <li>3x Yoga mats (professional grade)</li>
</ul>
<p><strong>Delivery Address:</strong><br/>
FitLife Studio<br/>
123 Fitness Ave<br/>
[City, State ZIP]</p>
<p><em>[Need to confirm budget with management before sending]</em></p>`,
      time: "2025-01-23T11:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Draft",
      attachments: [
        { name: "equipment_quote_request.pdf", size: "125 KB", type: "application/pdf" }
      ]
    }
  ],

  archive: [],

  trash: [
    {
      id: 301,
      sender: "Promo Deals",
      senderEmail: "noreply@spam-promo.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "🎁 EXCLUSIVE: 90% OFF SUPPLEMENTS!!!",
      body: `<p>CONGRATULATIONS! You've been selected for an EXCLUSIVE offer!</p>
<p>BUY NOW and get 90% OFF all supplements!</p>
<p>Click here: [suspicious link removed]</p>`,
      time: "2025-01-20T03:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [],
      deletedAt: "2025-01-20T08:00:00Z"
    },
    {
      id: 302,
      sender: "Old Member",
      senderEmail: "olduser@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Quick question",
      body: `<p>Hi, do you offer swimming classes?</p>
<p>Thanks!</p>`,
      time: "2025-01-10T14:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [],
      deletedAt: "2025-01-15T09:00:00Z"
    }
  ],

  error: [
    {
      id: 401,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Unknown User",
      recipientEmail: "invalid.email@nonexistent-domain.xyz",
      subject: "Your Membership Renewal Reminder",
      body: `<p>Dear Member,</p>
<p>This is a friendly reminder that your membership is due for renewal on February 1st, 2025.</p>
<p>Please contact us to discuss renewal options.</p>
<p>Best regards,<br/>FitLife Studio</p>`,
      time: "2025-01-21T10:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Failed",
      attachments: [],
      errorMessage: "Recipient email address does not exist (550 5.1.1 User unknown)"
    }
  ]
};

// Email Templates
export const emailTemplatesData = [
  { id: 1, name: "Welcome Email", subject: "Welcome to {Studio_Name}!", body: "Dear {Member_Name},\n\nWelcome!\n\nBest regards" },
  { id: 2, name: "Appointment Reminder", subject: "Reminder: {Date}", body: "Dear {Member_Name},\n\nReminder for your appointment on {Date}." },
  { id: 3, name: "Birthday Greeting", subject: "Happy Birthday!", body: "Dear {Member_Name},\n\nHappy Birthday! 🎂" },
];

// Pre-configured Messages
export const preConfiguredMessagesData = [
  { id: 1, title: "Greeting", message: "Hello! How can I help you today?" },
  { id: 2, title: "Confirmation", message: "Your appointment has been confirmed." },
  { id: 3, title: "Reschedule", message: "When would you like to reschedule?" },
];

// Communication Settings
export const communicationSettingsData = {
  autoArchiveDuration: 30,
  emailNotificationEnabled: true,
  birthdayMessageEnabled: true,
  birthdayMessageTemplate: "Happy Birthday! 🎂",
  birthdaySendTime: "09:00",
  appointmentNotificationEnabled: true,
};

// Notification Types
export const appointmentNotificationTypesData = { email: true, sms: false, push: true };

// ============================================================================
// SECTION 4: SYSTEM CONFIGURATION
// ============================================================================

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Belgium", "Brazil",
  "Canada", "Chile", "China", "Colombia", "Czech Republic", "Denmark", "Egypt", "Finland",
  "France", "Germany", "Greece", "Hungary", "India", "Indonesia", "Ireland", "Israel", "Italy",
  "Japan", "Mexico", "Netherlands", "New Zealand", "Norway", "Pakistan", "Peru", "Philippines",
  "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

export const staffRolesData = ["Personal Trainer", "Fitness Coach", "Studio Manager", "Receptionist", "Telephone operator", "Admin"];
export const contractTypesListData = [{ value: "full-time", label: "Full Time" }, { value: "part-time", label: "Part Time" }, { value: "contract", label: "Contract" }];
export const departmentsData = ["Customer Service", "Training", "Management", "Reception", "Administration"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getMemberById = (id) => membersData.find(m => m.id === id) || null;
export const getStaffById = (id) => staffData.find(s => s.id === id) || null;
export const getMemberAppointments = (memberId) => appointmentsData.filter(a => a.memberId === memberId);
export const getMemberFullName = (memberId) => { const m = getMemberById(memberId); return m ? `${m.firstName} ${m.lastName}` : "Unknown"; };
export const getMemberContingent = (memberId) => memberContingentData[memberId] || { current: { used: 0, total: 0 }, future: {} };
export const getMemberHistory = (memberId) => memberHistoryData[memberId] || { general: [], checkins: [], appointments: [], finance: [], contracts: [] };
export const getMemberRelations = (memberId) => memberRelationsData[memberId] || { family: [], friendship: [], relationship: [], work: [], other: [] };

export const isMemberBirthdayToday = (memberId) => {
  const member = getMemberById(memberId);
  if (!member || !member.dateOfBirth) return false;
  const today = new Date();
  const birthday = new Date(member.dateOfBirth);
  return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate();
};

// Appointment Type Helpers
export const getAppointmentTypeById = (typeId) => appointmentTypesData.find(t => t.id === typeId) || null;
export const getAppointmentTypeByName = (name) => appointmentTypesData.find(t => t.name === name) || null;

// Get regular appointment types (excluding trial) - für normale Buchungen
export const getRegularAppointmentTypes = () => regularAppointmentTypesData;

// Get trial appointment types only - für Lead-Probetrainings
export const getTrialAppointmentTypes = () => trialAppointmentTypesData;

// Check if appointment type is a trial type
export const isTrialAppointmentType = (typeNameOrId) => {
  const type = typeof typeNameOrId === 'number' 
    ? getAppointmentTypeById(typeNameOrId) 
    : getAppointmentTypeByName(typeNameOrId);
  return type?.isTrialType || false;
};

// Get color as Tailwind class (bg-[#HEX])
export const getAppointmentColor = (appointment) => {
  if (appointment.color) return appointment.color;
  const type = getAppointmentTypeById(appointment.typeId) || getAppointmentTypeByName(appointment.type);
  return type?.color || "bg-[#808080]";
};

// Get color as Hex value (#HEX)
export const getAppointmentColorHex = (appointment) => {
  if (appointment.colorHex) return appointment.colorHex;
  if (appointment.color) {
    // Extract hex from Tailwind class: bg-[#FF843E] -> #FF843E
    const match = appointment.color.match(/#[A-Fa-f0-9]{6}/);
    if (match) return match[0];
  }
  const type = getAppointmentTypeById(appointment.typeId) || getAppointmentTypeByName(appointment.type);
  return type?.colorHex || "#808080";
};

// Convert Hex to Tailwind class
export const hexToTailwindBg = (hex) => `bg-[${hex}]`;

// Convert Tailwind class to Hex
export const tailwindBgToHex = (tailwindClass) => {
  const match = tailwindClass?.match(/#[A-Fa-f0-9]{6}/);
  return match ? match[0] : "#808080";
};

// Studio Helper
export const getStudioData = () => studioData;

// ============================================================================
// CHAT HELPER FUNCTIONS
// ============================================================================

// Get last message from a chat
export const getLastMessage = (chat) => {
  if (!chat?.messages || chat.messages.length === 0) return null;
  return chat.messages[chat.messages.length - 1];
};

// Get last message content for display
export const getLastMessageContent = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return "No messages yet";
  return lastMsg.content;
};

// Get last message time for display
export const getLastMessageTime = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return "";
  
  // Parse timestamp if available, otherwise use time
  if (lastMsg.timestamp) {
    const msgDate = new Date(lastMsg.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = msgDate.toDateString() === today.toDateString();
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today | ${lastMsg.time}`;
    } else if (isYesterday) {
      return `Yesterday | ${lastMsg.time}`;
    } else {
      return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` | ${lastMsg.time}`;
    }
  }
  return lastMsg.time;
};

// Get unread count from messages
export const getUnreadCount = (chat) => {
  if (!chat?.messages) return 0;
  return chat.messages.filter(msg => msg.sender !== "You" && (msg.status === "delivered" || msg.status === "sent")).length;
};

// Check if chat is read (last message is read or from "You")
export const isChatRead = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return true;
  return lastMsg.sender === "You" || lastMsg.status === "read";
};

// Get message status from last message
export const getLastMessageStatus = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return "read";
  return lastMsg.status || "read";
};

// ============================================================================
// BACKWARDS COMPATIBILITY ALIASES
// ============================================================================

// From members-states.jsx
export const membersMainData = membersData;
export const appointmentsMainData = appointmentsData;
export const appointmentTypeMainData = appointmentTypesData;
export const freeAppointmentsMainData = freeAppointmentsData;
export const memberHistoryMainData = memberHistoryData;
export const memberRelationsMainData = memberRelationsData;
export const memberCreditsMainData = memberContingentData;
export const billingPeriodsMainData = billingPeriodsData;
export const relationOptionsMain = relationOptionsData;
export const availableMembersLeadsMain = membersData.map(m => ({ id: m.id, firstName: m.firstName, lastName: m.lastName, name: `${m.firstName} ${m.lastName}`, email: m.email, type: "member", image: m.image }));

// From communication-states.jsx
export const membersNew = membersData;
export const memberChatListNew = memberChatListData;
export const staffChatListNew = staffChatListData;
export const companyChatListNew = companyChatListData;
export const appointmentsNew = appointmentsData;
export const memberHistoryNew = memberHistoryData;
export const memberRelationsNew = memberRelationsData;
export const memberContingentDataNew = memberContingentData;
export const emailListNew = emailListData;
export const emailTemplatesNew = emailTemplatesData;
export const preConfiguredMessagesNew = preConfiguredMessagesData;
export const settingsNew = communicationSettingsData;
export const appointmentNotificationTypesNew = appointmentNotificationTypesData;

// From myarea-states.jsx
export const mockMemberHistoryNew = memberHistoryData;
export const mockMemberRelationsNew = memberRelationsData;
export const availableMembersLeadsNew = availableMembersLeadsMain;
export const relationOptions = relationOptionsData;

// From staff-states.jsx
export const staffMemberDataNew = staffData;

// From configuration-states.jsx (Re-exports for sync)
export const DEFAULT_APPOINTMENT_TYPES = appointmentTypesData;
export const DEFAULT_REGULAR_APPOINTMENT_TYPES = regularAppointmentTypesData;
export const DEFAULT_TRIAL_APPOINTMENT_TYPES = trialAppointmentTypesData;
export const DEFAULT_APPOINTMENT_CATEGORIES = appointmentCategoriesData;
export const DEFAULT_OPENING_HOURS = studioData.openingHours;
export const DEFAULT_STUDIO_CAPACITY = studioData.capacity;

// Alias for regular types (no trial) - Use this in booking modals!
export const appointmentTypesForBooking = regularAppointmentTypesData;
export const staffRoles = staffRolesData;
export const contractTypes = contractTypesListData;
export const departments = departmentsData;

// ============================================================================
// REACT COMPONENTS
// ============================================================================

// Staff Color Indicator Component
export const StaffColorIndicator = ({ color, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${className}`}
      style={{ backgroundColor: color }}
      title="Staff Color"
    />
  );
};

// ============================================================================
// HELPER FUNCTIONS FOR BACKEND INTEGRATION
// ============================================================================

/**
 * Transform backend staff data to frontend format
 */
export const transformStaffFromBackend = (backendStaff) => {
  return {
    id: backendStaff.id,
    firstName: backendStaff.first_name || backendStaff.firstName,
    lastName: backendStaff.last_name || backendStaff.lastName,
    role: backendStaff.role,
    email: backendStaff.email,
    phone: backendStaff.phone,
    description: backendStaff.description || backendStaff.about || "",
    img: backendStaff.profile_image || backendStaff.img || null,
    userId: backendStaff.user_id || backendStaff.userId,
    username: backendStaff.username,
    street: backendStaff.street || "",
    zipCode: backendStaff.zip_code || backendStaff.zipCode || "",
    city: backendStaff.city || "",
    country: backendStaff.country || "",
    vacationEntitlement: backendStaff.vacation_entitlement || backendStaff.vacationEntitlement || 0,
    vacationDays: backendStaff.vacation_days || backendStaff.vacationDays || 0,
    vacationUsed: backendStaff.vacation_used || backendStaff.vacationUsed || 0,
    vacationNotes: backendStaff.vacation_notes || backendStaff.vacationNotes || "",
    dateOfBirth: backendStaff.date_of_birth || backendStaff.dateOfBirth || "",
    gender: backendStaff.gender || "",
    color: backendStaff.color || "#808080",
    employmentStart: backendStaff.employment_start || backendStaff.employmentStart || "",
    employmentEnd: backendStaff.employment_end || backendStaff.employmentEnd || null,
    contractType: backendStaff.contract_type || backendStaff.contractType || "full-time",
    department: backendStaff.department || "",
    isActive: backendStaff.is_active ?? backendStaff.isActive ?? true,
    isArchived: backendStaff.is_archived ?? backendStaff.isArchived ?? false,
    documents: backendStaff.documents || [],
  };
};

/**
 * Transform frontend staff data to backend format
 */
export const transformStaffToBackend = (frontendStaff) => {
  return {
    id: frontendStaff.id,
    first_name: frontendStaff.firstName,
    last_name: frontendStaff.lastName,
    role: frontendStaff.role,
    email: frontendStaff.email,
    phone: frontendStaff.phone,
    description: frontendStaff.description,
    profile_image: frontendStaff.img,
    user_id: frontendStaff.userId,
    username: frontendStaff.username,
    street: frontendStaff.street,
    zip_code: frontendStaff.zipCode,
    city: frontendStaff.city,
    country: frontendStaff.country,
    vacation_entitlement: frontendStaff.vacationEntitlement,
    vacation_days: frontendStaff.vacationDays,
    vacation_used: frontendStaff.vacationUsed,
    vacation_notes: frontendStaff.vacationNotes,
    date_of_birth: frontendStaff.dateOfBirth,
    gender: frontendStaff.gender,
    color: frontendStaff.color,
    employment_start: frontendStaff.employmentStart,
    employment_end: frontendStaff.employmentEnd,
    contract_type: frontendStaff.contractType,
    department: frontendStaff.department,
    is_active: frontendStaff.isActive,
    is_archived: frontendStaff.isArchived,
    documents: frontendStaff.documents,
  };
};

/**
 * Staff API mock (replace with actual implementation)
 */
export const staffApi = {
  getAll: async () => staffData,
  getById: async (id) => staffData.find((s) => s.id === id) || null,
  create: async (data) => ({ ...data, id: Math.max(...staffData.map((s) => s.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
  uploadImage: async (id, file) => URL.createObjectURL(file),
};
