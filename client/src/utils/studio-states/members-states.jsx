// ============================================================================
// MEMBERS-STATES.JS - Mitglieder-Daten
// ============================================================================
// Alle Member-bezogenen Daten und Helper-Funktionen
// Backend-Endpoint: GET /api/members
// ============================================================================

// =============================================================================
// MEMBERS DATA
// =============================================================================
export const membersData = [
  {
    id: 1, firstName: "John", lastName: "Doe", title: "John Doe",
    email: "john@example.com", phone: "+1234567890",
    street: "123 Main St", zipCode: "12345", city: "New York", country: "United States",
    memberNumber: "M001", gender: "male", image: null,
    reason: "", isActive: true, isArchived: false, memberType: "full",
    note: "Allergic to peanuts", noteStartDate: "2023-01-01", noteEndDate: "2023-12-31", noteImportance: "important",
    dateOfBirth: "1990-05-15", about: "Experienced developer with a passion for clean code.",
    joinDate: "2022-03-01", contractStart: "2022-03-01", contractEnd: "2026-03-01",
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
    joinDate: "2021-11-15", contractStart: "2021-11-15", contractEnd: "2026-02-05",
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
    joinDate: "2022-06-15", contractStart: "2022-06-15", contractEnd: "2027-06-15",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 4, firstName: "Sarah", lastName: "Williams", title: "Sarah Williams",
    email: "sarah.w@example.com", phone: "+1234567893",
    street: "321 Elm Ave", zipCode: "54321", city: "Houston", country: "United States",
    memberNumber: "M004", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "VIP member - priority scheduling", noteStartDate: "2024-01-01", noteEndDate: "2024-12-31", noteImportance: "important",
    dateOfBirth: "1992-03-18", about: "Yoga instructor and wellness coach.",
    joinDate: "2023-01-10", contractStart: "2023-01-10", contractEnd: "2026-02-10",
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
    joinDate: "2023-09-01", contractStart: "2023-09-01", contractEnd: "2026-02-20",
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
    joinDate: "2024-06-01", contractStart: "2024-06-01", contractEnd: "2026-04-01",
    autoArchiveDate: null, documents: [],
  },
  {
    id: 7, firstName: "Robert", lastName: "Miller", title: "Robert Miller",
    email: "robert.m@example.com", phone: "+1234567896",
    street: "147 Birch Rd", zipCode: "55667", city: "San Antonio", country: "United States",
    memberNumber: "M007", gender: "male", image: null,
    isActive: true, isArchived: false, memberType: "temporary",
    note: "New potential member - scheduled for gym tour", noteStartDate: "2025-01-01", noteEndDate: "2025-01-31", noteImportance: "important",
    dateOfBirth: "1993-04-22", about: "Interested in joining the gym.",
    joinDate: "2025-01-24", contractStart: null, contractEnd: null,
    autoArchiveDate: "2025-03-07", documents: [],
  },
  {
    id: 8, firstName: "Lisa", lastName: "Garcia", title: "Lisa Garcia",
    email: "lisa.g@example.com", phone: "+1234567897",
    street: "258 Willow St", zipCode: "77889", city: "San Diego", country: "United States",
    memberNumber: "M008", gender: "female", image: null,
    isActive: true, isArchived: false, memberType: "full",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    dateOfBirth: "1989-09-14", about: "Group fitness enthusiast.",
    joinDate: "2024-02-01", contractStart: "2024-02-01", contractEnd: "2026-02-03",
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
    joinDate: "2024-03-15", contractStart: "2024-03-15", contractEnd: "2026-02-25",
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
    joinDate: "2024-01-01", contractStart: "2024-01-01", contractEnd: "2026-03-17",
    autoArchiveDate: null, documents: [],
  },
];

// =============================================================================
// MEMBER HISTORY
// =============================================================================
export const memberHistoryData = {
  1: {
    general: [
      { id: 1, date: "2025-01-15", time: "14:30", field: "Email", oldValue: "john.old@example.com", newValue: "john@example.com", changedBy: "Admin" },
      { id: 2, date: "2025-01-10", time: "09:15", field: "Phone Number", oldValue: "+1234567880", newValue: "+1234567890", changedBy: "Self" },
      { id: 3, date: "2024-11-20", time: "11:00", field: "Status", oldValue: "Inactive", newValue: "Active", changedBy: "Admin" },
    ],
    checkins: [
      { id: 1, date: "2025-02-17T08:15:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-17T10:30:00", type: "Check-out", location: "Main Entrance" },
      { id: 3, date: "2025-02-14T07:45:00", type: "Check-in", location: "Side Entrance" },
      { id: 4, date: "2025-02-14T09:50:00", type: "Check-out", location: "Side Entrance" },
      { id: 5, date: "2025-02-12T09:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 6, date: "2025-02-12T11:20:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-15", time: "10:00", action: "Appointment Completed", appointmentType: "Personal Training", appointmentDate: "2025-02-15", appointmentTime: "10:00", status: "Completed", bookedBy: "Admin" },
      { id: 2, date: "2025-02-20", time: "14:00", action: "Appointment Booked", appointmentType: "Body Assessment", appointmentDate: "2025-02-25", appointmentTime: "14:00", status: "Scheduled", bookedBy: "Self" },
      { id: 3, date: "2025-01-28", time: "16:00", action: "Appointment Cancelled", appointmentType: "Group Yoga", appointmentDate: "2025-01-30", appointmentTime: "16:00", status: "Cancelled", bookedBy: "Admin" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
      { id: 2, date: "2025-01-01", type: "Monthly Fee", amount: "€49.99", description: "January 2025 membership fee", status: "completed" },
      { id: 3, date: "2025-01-15", type: "Extra Service", amount: "€25.00", description: "Personal training session (single)", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2024-03-01", action: "Contract Signed", details: "48-month membership — Premium All-Access", user: "Admin" },
      { id: 2, date: "2024-12-15", action: "Contract Amended", details: "Added personal training add-on (4x/month)", user: "Admin" },
    ],
  },
  2: {
    general: [
      { id: 1, date: "2025-01-08", time: "10:20", field: "Status", oldValue: "Active", newValue: "Inactive", changedBy: "Admin" },
      { id: 2, date: "2025-01-08", time: "10:22", field: "Reason", oldValue: "—", newValue: "Vacation Leave", changedBy: "Admin" },
    ],
    checkins: [
      { id: 1, date: "2025-01-07T17:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-01-07T18:30:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-01-05", time: "09:00", action: "Appointment Completed", appointmentType: "Pilates Class", appointmentDate: "2025-01-05", appointmentTime: "09:00", status: "Completed", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€39.99", description: "February 2025 — paused (vacation credit pending)", status: "pending" },
      { id: 2, date: "2025-01-01", type: "Monthly Fee", amount: "€39.99", description: "January 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2021-11-15", action: "Contract Signed", details: "Standard membership — 24 months", user: "Reception" },
      { id: 2, date: "2023-11-15", action: "Contract Renewed", details: "Extended for another 24 months", user: "Admin" },
    ],
  },
  3: {
    general: [
      { id: 1, date: "2025-02-01", time: "08:00", field: "Address", oldValue: "456 Old Pine St", newValue: "789 Pine St", changedBy: "Self" },
    ],
    checkins: [
      { id: 1, date: "2025-02-17T06:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-17T07:45:00", type: "Check-out", location: "Main Entrance" },
      { id: 3, date: "2025-02-16T06:15:00", type: "Check-in", location: "Main Entrance" },
      { id: 4, date: "2025-02-16T08:00:00", type: "Check-out", location: "Main Entrance" },
      { id: 5, date: "2025-02-15T06:05:00", type: "Check-in", location: "Main Entrance" },
      { id: 6, date: "2025-02-15T07:50:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-10", time: "06:30", action: "Appointment Completed", appointmentType: "Running Coach Session", appointmentDate: "2025-02-10", appointmentTime: "06:30", status: "Completed", bookedBy: "Self" },
      { id: 2, date: "2025-02-18", time: "06:30", action: "Appointment Booked", appointmentType: "Running Coach Session", appointmentDate: "2025-02-24", appointmentTime: "06:30", status: "Scheduled", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2022-06-15", action: "Contract Signed", details: "60-month membership — Fitness Plus", user: "Admin" },
    ],
  },
  4: {
    general: [
      { id: 1, date: "2025-01-20", time: "13:00", field: "Member Type", oldValue: "Full", newValue: "Premium", changedBy: "Admin" },
      { id: 2, date: "2025-01-20", time: "13:05", field: "Note", oldValue: "—", newValue: "VIP member - priority scheduling", changedBy: "Admin" },
    ],
    checkins: [
      { id: 1, date: "2025-02-16T10:00:00", type: "Check-in", location: "VIP Lounge" },
      { id: 2, date: "2025-02-16T12:00:00", type: "Check-out", location: "VIP Lounge" },
      { id: 3, date: "2025-02-14T09:30:00", type: "Check-in", location: "Yoga Studio" },
      { id: 4, date: "2025-02-14T11:00:00", type: "Check-out", location: "Yoga Studio" },
    ],
    appointments: [
      { id: 1, date: "2025-02-14", time: "09:30", action: "Appointment Completed", appointmentType: "Private Yoga", appointmentDate: "2025-02-14", appointmentTime: "09:30", status: "Completed", bookedBy: "Self" },
      { id: 2, date: "2025-02-16", time: "10:00", action: "Appointment Completed", appointmentType: "Wellness Coaching", appointmentDate: "2025-02-16", appointmentTime: "10:00", status: "Completed", bookedBy: "Admin" },
      { id: 3, date: "2025-02-17", time: "11:00", action: "Appointment Booked", appointmentType: "Spa Treatment", appointmentDate: "2025-02-22", appointmentTime: "11:00", status: "Scheduled", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€89.99", description: "February 2025 premium membership", status: "completed" },
      { id: 2, date: "2025-01-01", type: "Monthly Fee", amount: "€89.99", description: "January 2025 premium membership", status: "completed" },
      { id: 3, date: "2025-01-20", type: "Upgrade Fee", amount: "€50.00", description: "One-time upgrade to premium tier", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2023-01-10", action: "Contract Signed", details: "Standard membership — 36 months", user: "Reception" },
      { id: 2, date: "2025-01-20", action: "Contract Upgraded", details: "Upgraded to Premium tier with VIP access", user: "Admin" },
    ],
  },
  5: {
    general: [
      { id: 1, date: "2025-01-25", time: "00:00", field: "Birthday", oldValue: "—", newValue: "Happy Birthday! 🎂", changedBy: "System" },
    ],
    checkins: [
      { id: 1, date: "2025-02-15T18:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-15T19:30:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-12", time: "18:30", action: "Appointment Completed", appointmentType: "Strength Training", appointmentDate: "2025-02-12", appointmentTime: "18:30", status: "Completed", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2023-09-01", action: "Contract Signed", details: "Standard membership — 36 months", user: "Admin" },
    ],
  },
  6: {
    general: [
      { id: 1, date: "2025-01-05", time: "09:00", field: "Note", oldValue: "—", newValue: "Focus on knee rehabilitation exercises", changedBy: "Trainer" },
      { id: 2, date: "2025-01-05", time: "09:05", field: "Note Importance", oldValue: "Normal", newValue: "Important", changedBy: "Trainer" },
    ],
    checkins: [
      { id: 1, date: "2025-02-17T10:00:00", type: "Check-in", location: "Rehab Center" },
      { id: 2, date: "2025-02-17T11:30:00", type: "Check-out", location: "Rehab Center" },
    ],
    appointments: [
      { id: 1, date: "2025-02-17", time: "10:00", action: "Appointment Booked", appointmentType: "Physio Rehab Session", appointmentDate: "2025-02-19", appointmentTime: "10:00", status: "Scheduled", bookedBy: "Trainer" },
      { id: 2, date: "2025-02-10", time: "10:00", action: "Appointment Completed", appointmentType: "Physio Rehab Session", appointmentDate: "2025-02-10", appointmentTime: "10:00", status: "Completed", bookedBy: "Trainer" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
      { id: 2, date: "2025-02-10", type: "Rehab Package", amount: "€120.00", description: "8-session knee rehab package", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2024-06-01", action: "Contract Signed", details: "Standard membership — 24 months", user: "Admin" },
    ],
  },
  7: {
    general: [
      { id: 1, date: "2025-01-24", time: "15:30", field: "Account Created", oldValue: "—", newValue: "Trial member registered", changedBy: "Reception" },
      { id: 2, date: "2025-01-24", time: "15:35", field: "Note", oldValue: "—", newValue: "New potential member - scheduled for gym tour", changedBy: "Reception" },
    ],
    checkins: [
      { id: 1, date: "2025-01-25T11:00:00", type: "Check-in", location: "Reception (Tour)" },
      { id: 2, date: "2025-01-25T12:00:00", type: "Check-out", location: "Reception" },
    ],
    appointments: [
      { id: 1, date: "2025-01-24", time: "15:40", action: "Appointment Booked", appointmentType: "Gym Tour & Consultation", appointmentDate: "2025-01-25", appointmentTime: "11:00", status: "Completed", bookedBy: "Reception" },
      { id: 2, date: "2025-02-01", time: "10:00", action: "Appointment Booked", appointmentType: "Trial Workout", appointmentDate: "2025-02-05", appointmentTime: "10:00", status: "Scheduled", bookedBy: "Admin" },
    ],
    finance: [],
    contracts: [],
  },
  8: {
    general: [],
    checkins: [
      { id: 1, date: "2025-02-16T17:30:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-16T19:00:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-13", time: "17:30", action: "Appointment Completed", appointmentType: "Group HIIT Class", appointmentDate: "2025-02-13", appointmentTime: "17:30", status: "Completed", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€39.99", description: "February 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2024-02-01", action: "Contract Signed", details: "Standard membership — 24 months", user: "Reception" },
    ],
  },
  9: {
    general: [
      { id: 1, date: "2024-12-20", time: "16:00", field: "About", oldValue: "—", newValue: "Business professional focused on stress relief.", changedBy: "Self" },
    ],
    checkins: [
      { id: 1, date: "2025-02-14T12:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-14T13:00:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-14", time: "12:00", action: "Appointment Completed", appointmentType: "Lunchtime Express Workout", appointmentDate: "2025-02-14", appointmentTime: "12:00", status: "Completed", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2024-03-15", action: "Contract Signed", details: "Standard membership — 24 months", user: "Admin" },
    ],
  },
  10: {
    general: [],
    checkins: [
      { id: 1, date: "2025-02-17T07:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 2, date: "2025-02-17T08:30:00", type: "Check-out", location: "Main Entrance" },
      { id: 3, date: "2025-02-15T07:00:00", type: "Check-in", location: "Main Entrance" },
      { id: 4, date: "2025-02-15T08:45:00", type: "Check-out", location: "Main Entrance" },
    ],
    appointments: [
      { id: 1, date: "2025-02-17", time: "07:00", action: "Appointment Completed", appointmentType: "Cardio Bootcamp", appointmentDate: "2025-02-17", appointmentTime: "07:00", status: "Completed", bookedBy: "Self" },
      { id: 2, date: "2025-02-15", time: "07:00", action: "Appointment Completed", appointmentType: "Weight Training", appointmentDate: "2025-02-15", appointmentTime: "07:00", status: "Completed", bookedBy: "Self" },
    ],
    finance: [
      { id: 1, date: "2025-02-01", type: "Monthly Fee", amount: "€49.99", description: "February 2025 membership fee", status: "completed" },
      { id: 2, date: "2025-01-01", type: "Monthly Fee", amount: "€49.99", description: "January 2025 membership fee", status: "completed" },
    ],
    contracts: [
      { id: 1, date: "2024-01-01", action: "Contract Signed", details: "Standard membership — 24 months", user: "Admin" },
    ],
  },
};

// =============================================================================
// MEMBER RELATIONS
// =============================================================================
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

// =============================================================================
// MEMBER CONTINGENT / CREDITS
// =============================================================================
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

// =============================================================================
// BILLING PERIODS
// =============================================================================
export const billingPeriodsData = [
  { id: 1, name: "January 2025", startDate: "2025-01-01", endDate: "2025-01-31" },
  { id: 2, name: "February 2025", startDate: "2025-02-01", endDate: "2025-02-28" },
  { id: 3, name: "March 2025", startDate: "2025-03-01", endDate: "2025-03-31" },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getMemberById = (id) => membersData.find(m => m.id === id) || null;

export const getMemberFullName = (memberId) => {
  const m = getMemberById(memberId);
  return m ? `${m.firstName} ${m.lastName}` : "Unknown";
};

export const getMemberContingent = (memberId) => 
  memberContingentData[memberId] || { current: { used: 0, total: 0 }, future: {} };

export const getMemberHistory = (memberId) => 
  memberHistoryData[memberId] || { general: [], checkins: [], appointments: [], finance: [], contracts: [] };

export const getMemberRelations = (memberId) => 
  memberRelationsData[memberId] || { family: [], friendship: [], relationship: [], work: [], other: [] };

export const isMemberBirthdayToday = (memberId) => {
  const member = getMemberById(memberId);
  if (!member || !member.dateOfBirth) return false;
  const today = new Date();
  const birthday = new Date(member.dateOfBirth);
  return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate();
};

export const getActiveMembers = () => membersData.filter(m => m.isActive && !m.isArchived);
export const getArchivedMembers = () => membersData.filter(m => m.isArchived);
export const getPausedMembers = () => membersData.filter(m => !m.isActive && !m.isArchived);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformMemberFromBackend = (backendMember) => ({
  id: backendMember.id,
  firstName: backendMember.first_name || backendMember.firstName,
  lastName: backendMember.last_name || backendMember.lastName,
  title: `${backendMember.first_name || backendMember.firstName} ${backendMember.last_name || backendMember.lastName}`,
  email: backendMember.email,
  phone: backendMember.phone,
  street: backendMember.street || "",
  zipCode: backendMember.zip_code || backendMember.zipCode || "",
  city: backendMember.city || "",
  country: backendMember.country || "",
  memberNumber: backendMember.member_number || backendMember.memberNumber || "",
  gender: backendMember.gender || "",
  image: backendMember.profile_image || backendMember.image || null,
  isActive: backendMember.is_active ?? backendMember.isActive ?? true,
  isArchived: backendMember.is_archived ?? backendMember.isArchived ?? false,
  memberType: backendMember.member_type || backendMember.memberType || "full",
  note: backendMember.note || "",
  noteStartDate: backendMember.note_start_date || backendMember.noteStartDate || "",
  noteEndDate: backendMember.note_end_date || backendMember.noteEndDate || "",
  noteImportance: backendMember.note_importance || backendMember.noteImportance || "unimportant",
  dateOfBirth: backendMember.date_of_birth || backendMember.dateOfBirth || "",
  about: backendMember.about || "",
  joinDate: backendMember.join_date || backendMember.joinDate || "",
  contractStart: backendMember.contract_start || backendMember.contractStart || "",
  contractEnd: backendMember.contract_end || backendMember.contractEnd || "",
  autoArchiveDate: backendMember.auto_archive_date || backendMember.autoArchiveDate || null,
  documents: backendMember.documents || [],
});

export const transformMemberToBackend = (frontendMember) => ({
  id: frontendMember.id,
  first_name: frontendMember.firstName,
  last_name: frontendMember.lastName,
  email: frontendMember.email,
  phone: frontendMember.phone,
  street: frontendMember.street,
  zip_code: frontendMember.zipCode,
  city: frontendMember.city,
  country: frontendMember.country,
  member_number: frontendMember.memberNumber,
  gender: frontendMember.gender,
  profile_image: frontendMember.image,
  is_active: frontendMember.isActive,
  is_archived: frontendMember.isArchived,
  member_type: frontendMember.memberType,
  note: frontendMember.note,
  note_start_date: frontendMember.noteStartDate,
  note_end_date: frontendMember.noteEndDate,
  note_importance: frontendMember.noteImportance,
  date_of_birth: frontendMember.dateOfBirth,
  about: frontendMember.about,
  join_date: frontendMember.joinDate,
  contract_start: frontendMember.contractStart,
  contract_end: frontendMember.contractEnd,
  auto_archive_date: frontendMember.autoArchiveDate,
  documents: frontendMember.documents,
});

// =============================================================================
// MOCK API (Replace with real API calls)
// =============================================================================

export const membersApi = {
  getAll: async () => membersData,
  getById: async (id) => getMemberById(id),
  getActive: async () => getActiveMembers(),
  create: async (data) => ({ ...data, id: Math.max(...membersData.map(m => m.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
  archive: async (id) => ({ success: true }),
};

// =============================================================================
// LEGACY EXPORTS (für Rückwärtskompatibilität)
// =============================================================================

// Für appointments.jsx und andere Komponenten die availableMembersLeadsMain verwenden
export const availableMembersLeadsMain = membersData.map(member => ({
  id: member.id,
  name: `${member.firstName} ${member.lastName}`,
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone,
  memberNumber: member.memberNumber,
  image: member.image,
}));

export default {
  membersData,
  memberHistoryData,
  memberRelationsData,
  memberContingentData,
  billingPeriodsData,
  relationOptionsData,
  getMemberById,
  getMemberFullName,
  getMemberContingent,
  getMemberHistory,
  getMemberRelations,
  isMemberBirthdayToday,
  getActiveMembers,
  getArchivedMembers,
  getPausedMembers,
  transformMemberFromBackend,
  transformMemberToBackend,
  membersApi,
  availableMembersLeadsMain,
};
