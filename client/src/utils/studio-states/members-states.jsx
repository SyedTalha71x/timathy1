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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2024-03-01", time: "10:15", to: "john@example.com", preview: "Dear John, welcome to FitStudio! Your Premium All-Access membership is now active.", body: "<p>Dear John,</p><p>Welcome to <strong>FitStudio</strong>! Your Premium All-Access membership is now active.</p><p>Your contract starts on <strong>March 1, 2024</strong>. We look forward to seeing you at the studio!</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "email", subject: "SEPA Direct Debit Mandate Confirmation", date: "2024-03-01", time: "10:20", to: "john@example.com", preview: "Dear John, we hereby confirm your SEPA direct debit mandate.", body: "<p>Dear John,</p><p>We hereby confirm your SEPA direct debit mandate with the following details:</p><p>Account Holder: <strong>John Doe</strong><br/>IBAN: <strong>DE89 3704 0044 0532 0130 00</strong><br/>BIC: <strong>COBADEFFXXX</strong><br/>Bank: <strong>Commerzbank</strong><br/>Mandate Reference: <strong>SEPA-M4X7K2-AB3CD</strong></p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 3, channel: "push", title: "Appointment Reminder", date: "2025-02-14", time: "18:00", preview: "Reminder: Personal Training tomorrow at 10:00", body: "<p>Reminder: You have a <strong>Personal Training</strong> session tomorrow at <strong>10:00</strong>.</p>", status: "delivered", sentBy: "System" },
      { id: 4, channel: "email", subject: "Invoice #2025-02 — February Membership Fee", date: "2025-02-01", time: "08:00", to: "john@example.com", preview: "Dear John, please find your invoice for February 2025 attached.", body: "<p>Dear John,</p><p>Please find your invoice for <strong>February 2025</strong> attached.</p><p>Amount: <strong>€49.99</strong><br/>Due date: February 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 5, channel: "email", subject: "Contract Amendment Confirmation", date: "2024-12-15", time: "11:30", to: "john@example.com", preview: "Dear John, your contract has been amended to include personal training.", body: "<p>Dear John,</p><p>Your contract has been amended. The following changes are now active:</p><p><strong>Added:</strong> Personal Training add-on (4x/month)</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 6, channel: "push", title: "Class Cancelled", date: "2025-01-28", time: "12:00", preview: "Your Group Yoga class on Jan 30 has been cancelled.", body: "<p>Your <strong>Group Yoga</strong> class on <strong>January 30 at 16:00</strong> has been cancelled.</p>", status: "delivered", sentBy: "System" },
      { id: 7, channel: "email", subject: "Invoice #2025-01 — January Membership Fee", date: "2025-01-01", time: "08:00", to: "john@example.com", preview: "Dear John, please find your invoice for January 2025 attached.", body: "<p>Dear John,</p><p>Please find your invoice for <strong>January 2025</strong> attached.</p><p>Amount: <strong>€49.99</strong><br/>Due date: January 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Contract Renewal Confirmation", date: "2023-11-15", time: "09:00", to: "jane@example.com", preview: "Dear Jane, your contract has been successfully renewed for another 24 months.", body: "<p>Dear Jane,</p><p>Your contract has been successfully renewed for another <strong>24 months</strong>.</p><p>New end date: <strong>November 15, 2025</strong></p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 2, channel: "email", subject: "Membership Pause Confirmation", date: "2025-01-08", time: "10:25", to: "jane@example.com", preview: "Dear Jane, your membership has been paused due to vacation leave.", body: "<p>Dear Jane,</p><p>Your membership has been <strong>paused</strong> effective immediately.</p><p>Reason: <strong>Vacation Leave</strong></p><p>If you'd like to reactivate your membership, please contact us.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 3, channel: "push", title: "Membership Paused", date: "2025-01-08", time: "10:26", preview: "Your membership has been paused. Contact us to reactivate.", body: "<p>Your membership has been <strong>paused</strong>. Contact us when you'd like to reactivate.</p>", status: "delivered", sentBy: "System" },
      { id: 4, channel: "email", subject: "Invoice #2025-01 — January Membership Fee", date: "2025-01-01", time: "08:00", to: "jane@example.com", preview: "Dear Jane, please find your invoice for January 2025 attached.", body: "<p>Dear Jane,</p><p>Please find your invoice for <strong>January 2025</strong> attached.</p><p>Amount: <strong>€39.99</strong><br/>Due date: January 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2022-06-15", time: "11:00", to: "emily@example.com", preview: "Dear Emily, welcome to FitStudio! Your Fitness Plus membership is now active.", body: "<p>Dear Emily,</p><p>Welcome to <strong>FitStudio</strong>! Your Fitness Plus membership is now active.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "push", title: "New Class Available", date: "2025-02-01", time: "09:00", preview: "Early Morning Bootcamp is now available — book your spot!", body: "<p>A new class <strong>Early Morning Bootcamp</strong> has been added to the schedule. Book your spot now!</p>", status: "delivered", sentBy: "System" },
      { id: 3, channel: "email", subject: "Invoice #2025-02 — February Membership Fee", date: "2025-02-01", time: "08:00", to: "emily@example.com", preview: "Dear Emily, please find your invoice for February 2025 attached.", body: "<p>Dear Emily,</p><p>Please find your invoice for <strong>February 2025</strong> attached.</p><p>Amount: <strong>€49.99</strong><br/>Due date: February 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Contract Upgrade Confirmation", date: "2025-01-20", time: "13:10", to: "michael@example.com", preview: "Dear Michael, your membership has been upgraded to Premium tier.", body: "<p>Dear Michael,</p><p>Your membership has been upgraded to <strong>Premium tier</strong> with VIP access.</p><p>You now have access to the VIP Lounge, priority scheduling, and exclusive wellness services.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 2, channel: "push", title: "Welcome to Premium!", date: "2025-01-20", time: "13:15", preview: "Congrats! Your account has been upgraded to Premium with VIP access.", body: "<p>Congratulations! Your account has been upgraded to <strong>Premium</strong>. Enjoy VIP access and priority scheduling.</p>", status: "delivered", sentBy: "System" },
      { id: 3, channel: "email", subject: "Invoice #2025-02 — February Premium Fee", date: "2025-02-01", time: "08:00", to: "michael@example.com", preview: "Dear Michael, please find your invoice for February 2025 attached.", body: "<p>Dear Michael,</p><p>Please find your invoice for <strong>February 2025</strong> attached.</p><p>Amount: <strong>€89.99</strong><br/>Due date: February 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 4, channel: "push", title: "Appointment Reminder", date: "2025-02-21", time: "18:00", preview: "Reminder: Spa Treatment tomorrow at 11:00", body: "<p>Reminder: You have a <strong>Spa Treatment</strong> appointment tomorrow at <strong>11:00</strong>.</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Appointment Confirmation — Strength Training", date: "2025-02-10", time: "14:00", to: "sarah@example.com", preview: "Dear Sarah, your Strength Training appointment has been confirmed.", body: "<p>Dear Sarah,</p><p>Your <strong>Strength Training</strong> appointment on <strong>February 12 at 18:30</strong> has been confirmed.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "push", title: "Workout Streak! 🔥", date: "2025-02-15", time: "20:00", preview: "You've trained 3 times this week — keep it up!", body: "<p>You've trained <strong>3 times</strong> this week — keep up the great work! 🔥</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2024-06-01", time: "09:30", to: "robert@example.com", preview: "Dear Robert, welcome to FitStudio! Your membership is now active.", body: "<p>Dear Robert,</p><p>Welcome to <strong>FitStudio</strong>! Your Standard membership is now active.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "email", subject: "Rehab Package Confirmation", date: "2025-02-10", time: "10:30", to: "robert@example.com", preview: "Dear Robert, your 8-session knee rehab package has been activated.", body: "<p>Dear Robert,</p><p>Your <strong>8-session knee rehabilitation package</strong> has been activated.</p><p>Amount: <strong>€120.00</strong></p><p>Please coordinate with your trainer for scheduling.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 3, channel: "push", title: "Appointment Reminder", date: "2025-02-18", time: "18:00", preview: "Reminder: Physio Rehab Session tomorrow at 10:00", body: "<p>Reminder: You have a <strong>Physio Rehab Session</strong> tomorrow at <strong>10:00</strong>.</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Trial Workout Scheduled", date: "2025-02-01", time: "10:05", to: "lisa@example.com", preview: "Dear Lisa, your trial workout has been scheduled for February 5 at 10:00.", body: "<p>Dear Lisa,</p><p>Your <strong>Trial Workout</strong> has been scheduled for <strong>February 5, 2025 at 10:00</strong>.</p><p>Please arrive 10 minutes early. We look forward to seeing you!</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 2, channel: "push", title: "Welcome!", date: "2025-01-24", time: "15:40", preview: "Thanks for signing up for a gym tour! See you tomorrow at 11:00.", body: "<p>Thanks for signing up! Your <strong>Gym Tour & Consultation</strong> is scheduled for tomorrow at <strong>11:00</strong>.</p>", status: "delivered", sentBy: "System" },
    ],
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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2024-02-01", time: "14:00", to: "david@example.com", preview: "Dear David, welcome to FitStudio! Your membership is now active.", body: "<p>Dear David,</p><p>Welcome to <strong>FitStudio</strong>! Your Standard membership is now active starting <strong>February 1, 2024</strong>.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "push", title: "Appointment Completed", date: "2025-02-13", time: "19:00", preview: "Great session! Your Group HIIT Class has been logged.", body: "<p>Great session! Your <strong>Group HIIT Class</strong> has been logged. Keep it up!</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2024-03-15", time: "12:00", to: "anna@example.com", preview: "Dear Anna, welcome to FitStudio! Your membership is now active.", body: "<p>Dear Anna,</p><p>Welcome to <strong>FitStudio</strong>! Your Standard membership is now active.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "email", subject: "SEPA Direct Debit Mandate Confirmation", date: "2024-03-15", time: "12:05", to: "anna@example.com", preview: "Dear Anna, we hereby confirm your SEPA direct debit mandate.", body: "<p>Dear Anna,</p><p>We hereby confirm your SEPA direct debit mandate.</p><p>Account Holder: <strong>Anna Weber</strong><br/>IBAN: <strong>DE75 5121 0800 1245 1261 99</strong><br/>BIC: <strong>DAAEDEDDXXX</strong><br/>Bank: <strong>Apobank</strong><br/>Mandate Reference: <strong>SEPA-R8T2P1-XY9FG</strong></p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "Admin" },
      { id: 3, channel: "push", title: "Lunchtime Workout Completed", date: "2025-02-14", time: "13:05", preview: "Great job on your Lunchtime Express Workout today!", body: "<p>Great job on your <strong>Lunchtime Express Workout</strong> today! 💪</p>", status: "delivered", sentBy: "System" },
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
    communication: [
      { id: 1, channel: "email", subject: "Welcome to FitStudio!", date: "2024-01-01", time: "07:00", to: "tom@example.com", preview: "Dear Tom, welcome to FitStudio! Your membership is now active.", body: "<p>Dear Tom,</p><p>Welcome to <strong>FitStudio</strong>! Your Standard membership is now active starting <strong>January 1, 2024</strong>.</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 2, channel: "push", title: "Workout Streak! 🔥", date: "2025-02-17", time: "09:00", preview: "5 sessions this month — you're on fire!", body: "<p>You've completed <strong>5 sessions</strong> this month — you're on fire! 🔥 Keep going!</p>", status: "delivered", sentBy: "System" },
      { id: 3, channel: "email", subject: "Invoice #2025-02 — February Membership Fee", date: "2025-02-01", time: "08:00", to: "tom@example.com", preview: "Dear Tom, please find your invoice for February 2025 attached.", body: "<p>Dear Tom,</p><p>Please find your invoice for <strong>February 2025</strong> attached.</p><p>Amount: <strong>€49.99</strong><br/>Due date: February 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
      { id: 4, channel: "email", subject: "Invoice #2025-01 — January Membership Fee", date: "2025-01-01", time: "08:00", to: "tom@example.com", preview: "Dear Tom, please find your invoice for January 2025 attached.", body: "<p>Dear Tom,</p><p>Please find your invoice for <strong>January 2025</strong> attached.</p><p>Amount: <strong>€49.99</strong><br/>Due date: January 5, 2025</p><p>Best regards,<br/>FitStudio Team</p>", status: "delivered", sentBy: "System" },
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
  memberHistoryData[memberId] || { general: [], checkins: [], appointments: [], finance: [], contracts: [], communication: [] };

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
