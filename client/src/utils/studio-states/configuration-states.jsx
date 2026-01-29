// ============================================================================
// CONFIGURATION-STATES.JSX - Alle Konfigurationsdaten
// ============================================================================
// Diese Datei enthält ALLE Konfigurationsdaten für das Studio:
// - Studio-Informationen (Name, Adresse, Öffnungszeiten)
// - Permissions & Rollen
// - Appointment Types & Settings
// - Contract Types & Forms
// - Dropdowns & Listen (Countries, Departments, etc.)
// - Default Values
// ============================================================================

// =============================================================================
// SECTION 1: COUNTRIES LIST
// =============================================================================
// Format mit code und currency für Dropdown-Auswahl
export const COUNTRIES = [
  { code: "AT", name: "Austria", currency: "€" },
  { code: "BE", name: "Belgium", currency: "€" },
  { code: "CA", name: "Canada", currency: "$" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
  { code: "DE", name: "Germany", currency: "€" },
  { code: "ES", name: "Spain", currency: "€" },
  { code: "FR", name: "France", currency: "€" },
  { code: "GB", name: "United Kingdom", currency: "£" },
  { code: "IT", name: "Italy", currency: "€" },
  { code: "NL", name: "Netherlands", currency: "€" },
  { code: "PL", name: "Poland", currency: "zł" },
  { code: "US", name: "United States", currency: "$" },
];

// Simple string list for backwards compatibility
export const COUNTRIES_SIMPLE = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Belgium", "Brazil",
  "Canada", "Chile", "China", "Colombia", "Czech Republic", "Denmark", "Egypt", "Finland",
  "France", "Germany", "Greece", "Hungary", "India", "Indonesia", "Ireland", "Israel", "Italy",
  "Japan", "Mexico", "Netherlands", "New Zealand", "Norway", "Pakistan", "Peru", "Philippines",
  "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

// =============================================================================
// SECTION 2: STUDIO DATA
// =============================================================================
export const studioData = {
  id: 100,
  name: "FitnessPro Studio",
  shortName: "FitnessPro",
  studioId: "STU-2024-001847", // Read-only studio ID
  operator: "Max Mustermann",
  operatorEmail: "operator@fitnesspro.de",
  operatorPhone: "+49 30 12345678",
  operatorMobile: "+49 170 1234567",
  email: "info@fitnesspro.de",
  phone: "+49 30 12345678",
  mobile: "+49 170 1234567",
  street: "Musterstraße 123",
  zipCode: "10115",
  city: "Berlin",
  country: "DE",
  currency: "€",
  logo: null,
  avatar: null,
  website: "https://fitnesspro.de",
  openingHours: [
    { day: 'Monday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Tuesday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Wednesday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Thursday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Friday', startTime: '09:00', endTime: '21:00', closed: false },
    { day: 'Saturday', startTime: '10:00', endTime: '18:00', closed: false },
    { day: 'Sunday', startTime: null, endTime: null, closed: true },
  ],
  closingDays: [],
  capacity: 3,
  timezone: "Europe/Berlin",
  taxId: "DE123456789",
  bankAccount: {
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
    bankName: "Deutsche Bank",
    creditorId: "DE98ZZZ09999999999",
    creditorName: "FitnessPro GmbH",
  },
  socialMedia: {
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
  },
  settings: {
    defaultAppointmentDuration: 30,
    appointmentInterval: 30,
    maxAdvanceBookingDays: 30,
    cancellationDeadlineHours: 24,
    automaticReminders: true,
    reminderHoursBefore: 24,
  },
};

// =============================================================================
// SECTION 3: PERMISSION GROUPS
// =============================================================================
export const PERMISSION_GROUPS = [
  {
    group: "Appointments",
    icon: "CalendarOutlined",
    items: [
      { key: "appointments.view", label: "View appointments" },
      { key: "appointments.create", label: "Create appointments" },
      { key: "appointments.edit", label: "Edit appointments" },
      { key: "appointments.cancel", label: "Cancel appointments" },
      { key: "appointments.manage_contingent", label: "Manage contingent" },
    ],
  },
  {
    group: "Communication",
    icon: "MailOutlined",
    items: [
      { key: "communication.view", label: "View communication" },
      { key: "emails.send", label: "Send emails" },
      { key: "chat.member_send", label: "Chat with members" },
      { key: "chat.studio_send", label: "Chat with studio" },
      { key: "broadcasts.send", label: "Send broadcasts" },
      { key: "bulletin_board.view", label: "View bulletin board" },
      { key: "bulletin_board.posts_create", label: "Create posts" },
      { key: "bulletin_board.posts_edit", label: "Edit posts" },
      { key: "bulletin_board.posts_delete", label: "Delete posts" },
    ],
  },
  {
    group: "Activity Monitor",
    icon: "FileSearchOutlined",
    items: [
      { key: "activity_monitor.view", label: "View activity monitor" },
      { key: "activity_monitor.take_actions", label: "Take actions" },
    ],
  },
  {
    group: "To-Do & Tags",
    icon: "CheckSquareOutlined",
    items: [
      { key: "todos.view", label: "View to-dos" },
      { key: "todos.create", label: "Create to-dos" },
      { key: "todos.edit", label: "Edit to-dos" },
      { key: "todos.delete", label: "Delete to-dos" },
      { key: "tags.manage", label: "Manage tags" },
    ],
  },
  {
    group: "Notes",
    icon: "FileTextOutlined",
    items: [
      { key: "notes.view", label: "View notes" },
      { key: "notes.personal_create", label: "Create personal notes" },
      { key: "notes.studio_create", label: "Create studio notes" },
      { key: "notes.studio_delete", label: "Delete studio notes" },
    ],
  },
  {
    group: "Members",
    icon: "TeamOutlined",
    items: [
      { key: "members.view", label: "View members" },
      { key: "members.create", label: "Create members" },
      { key: "members.edit", label: "Edit members" },
      { key: "members.history_view", label: "View member history" },
      { key: "members.documents_manage", label: "Manage documents" },
    ],
  },
  {
    group: "Staff",
    icon: "UserOutlined",
    items: [
      { key: "staff.view", label: "View staff" },
      { key: "staff.create", label: "Create staff" },
      { key: "staff.edit", label: "Edit staff" },
      { key: "staff.history_view", label: "View staff history" },
      { key: "staff.vacation_calendar_view", label: "View vacation calendar" },
      { key: "staff.planning_view", label: "View planning" },
      { key: "staff.shifts_manage", label: "Manage shifts" },
    ],
  },
  {
    group: "Leads",
    icon: "UserAddOutlined",
    items: [
      { key: "leads.view", label: "View leads" },
      { key: "leads.create", label: "Create leads" },
      { key: "leads.edit", label: "Edit leads" },
      { key: "leads.columns_edit", label: "Edit lead columns" },
    ],
  },
  {
    group: "Contracts",
    icon: "FileProtectOutlined",
    items: [
      { key: "contracts.view", label: "View contracts" },
      { key: "contracts.create", label: "Create contracts" },
      { key: "contracts.edit", label: "Edit contracts" },
      { key: "contracts.cancel", label: "Cancel contracts" },
      { key: "contracts.view_details", label: "View contract details" },
      { key: "contracts.documents_manage", label: "Manage documents" },
    ],
  },
  {
    group: "Selling & Products",
    icon: "ShoppingCartOutlined",
    items: [
      { key: "selling.view", label: "View selling" },
      { key: "products.manage", label: "Manage products" },
      { key: "services.manage", label: "Manage services" },
      { key: "sales_journal.view", label: "View sales journal" },
      { key: "sales_journal.take_actions", label: "Take sales actions" },
    ],
  },
  {
    group: "Finances",
    icon: "DollarOutlined",
    items: [
      { key: "finances.view", label: "View finances" },
      { key: "payments.run", label: "Run payments" },
    ],
  },
  {
    group: "Training",
    icon: "ReadOutlined",
    items: [
      { key: "training.view", label: "View training" },
      { key: "training_plans.create", label: "Create training plans" },
      { key: "training_plans.assign", label: "Assign training plans" },
    ],
  },
  {
    group: "Analytics",
    icon: "LineChartOutlined",
    items: [
      { key: "analytics.view", label: "View analytics" },
      { key: "analytics.finance_view", label: "View finance analytics" },
      { key: "analytics.members_view", label: "View member analytics" },
      { key: "analytics.leads_view", label: "View lead analytics" },
      { key: "analytics.appointments_view", label: "View appointment analytics" },
    ],
  },
  {
    group: "Configuration",
    icon: "SettingOutlined",
    items: [
      { key: "profile.edit_own", label: "Edit own profile" },
      { key: "studio.config_manage", label: "Manage studio config" },
      { key: "appointments.config_manage", label: "Manage appointment config" },
      { key: "staff.config_manage", label: "Manage staff config" },
      { key: "leads.sources_manage", label: "Manage lead sources" },
      { key: "contracts.config_manage", label: "Manage contract config" },
      { key: "documents.config_manage", label: "Manage document config" },
      { key: "communication.config_manage", label: "Manage communication config" },
      { key: "finance.config_manage", label: "Manage finance config" },
      { key: "appearance.manage", label: "Manage appearance" },
    ],
  },
];

export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap(group => 
  group.items.map(item => item.key)
);

export const PERMISSION_DATA = PERMISSION_GROUPS.flatMap(group =>
  group.items.map(item => ({
    key: item.key,
    label: item.label,
    group: group.group,
  }))
);

// =============================================================================
// SECTION 4: STAFF CONFIGURATION
// =============================================================================
export const staffRolesData = [
  "Personal Trainer", 
  "Fitness Coach", 
  "Studio Manager", 
  "Receptionist", 
  "Telephone operator", 
  "Admin"
];

export const contractTypesListData = [
  { value: "full-time", label: "Full Time" }, 
  { value: "part-time", label: "Part Time" }, 
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "intern", label: "Intern" },
];

export const departmentsData = [
  "Customer Service", 
  "Training", 
  "Management", 
  "Reception", 
  "Administration",
  "Sales",
  "Marketing",
];

export const DEFAULT_STAFF_ROLES = [
  {
    id: 1,
    name: "Admin",
    permissions: ALL_PERMISSION_KEYS,
    color: "#FF843E",
    isAdmin: true,
    staffCount: 1,
    assignedStaff: [1]
  },
  {
    id: 2,
    name: "Trainer",
    permissions: [
      "appointments.view",
      "appointments.create",
      "appointments.edit",
      "appointments.cancel",
      "communication.view",
      "chat.member_send",
      "members.view",
      "members.history_view",
      "notes.view",
      "notes.personal_create",
      "notes.studio_create",
      "training.view",
      "training_plans.create",
      "training_plans.assign",
      "profile.edit_own",
    ],
    color: "#10B981",
    isAdmin: false,
    staffCount: 0,
    assignedStaff: []
  },
  {
    id: 3,
    name: "Studio Operator",
    permissions: [
      "appointments.view",
      "appointments.create",
      "appointments.edit",
      "appointments.cancel",
      "appointments.manage_contingent",
      "communication.view",
      "emails.send",
      "chat.member_send",
      "chat.studio_send",
      "broadcasts.send",
      "activity_monitor.view",
      "activity_monitor.take_actions",
      "todos.view",
      "todos.create",
      "todos.edit",
      "notes.view",
      "notes.personal_create",
      "notes.studio_create",
      "members.view",
      "members.create",
      "members.edit",
      "members.history_view",
      "leads.view",
      "leads.create",
      "leads.edit",
      "contracts.view",
      "contracts.create",
      "selling.view",
      "products.manage",
      "profile.edit_own",
    ],
    color: "#3B82F6",
    isAdmin: false,
    staffCount: 0,
    assignedStaff: []
  }
];

export const DEFAULT_VACATION_DAYS = 30;
export const DEFAULT_STAFF_ROLE_ID = 2;
export const DEFAULT_STAFF_COUNTRY = "studio"; // "studio" = use studio country

export const DEFAULT_STAFF_MEMBERS = [
  { id: 1, name: "John Doe", email: "john@studio.com", avatar: null },
  { id: 2, name: "Jane Smith", email: "jane@studio.com", avatar: null },
  { id: 3, name: "Mike Johnson", email: "mike@studio.com", avatar: null },
];

// =============================================================================
// SECTION 5: MEMBER CONFIGURATION
// =============================================================================
export const memberTypesData = [
  { value: "trial", label: "Trial Member" },
  { value: "full", label: "Full Member" },
  { value: "premium", label: "Premium Member" },
  { value: "vip", label: "VIP Member" },
  { value: "corporate", label: "Corporate Member" },
  { value: "student", label: "Student Member" },
  { value: "senior", label: "Senior Member" },
];

export const memberStatusData = [
  { value: "active", label: "Active", color: "#10B981" },
  { value: "inactive", label: "Inactive", color: "#EF4444" },
  { value: "paused", label: "Paused", color: "#F59E0B" },
  { value: "archived", label: "Archived", color: "#6B7280" },
];

export const genderOptionsData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// =============================================================================
// SECTION 6: APPOINTMENT CONFIGURATION
// =============================================================================
export const appointmentStatusData = [
  { value: "scheduled", label: "Scheduled", color: "#3B82F6" },
  { value: "confirmed", label: "Confirmed", color: "#10B981" },
  { value: "checked_in", label: "Checked In", color: "#8B5CF6" },
  { value: "completed", label: "Completed", color: "#059669" },
  { value: "cancelled", label: "Cancelled", color: "#EF4444" },
  { value: "no_show", label: "No Show", color: "#F97316" },
];

export const appointmentDurationsData = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
  { value: 120, label: "120 min" },
];

export const DEFAULT_STUDIO_CAPACITY = 3;

export const DEFAULT_APPOINTMENT_CATEGORIES = [
  "Health Check", "Personal Training", "Wellness", "Recovery", "Mindfulness", "Group Class"
];

export const DEFAULT_APPOINTMENT_TYPES = [
  {
    id: 1,
    name: "EMS Strength",
    description: "High-intensity strength training with EMS technology",
    duration: 30,
    maxParallel: 2,
    slotsRequired: 1,
    color: "#FF843E",
    interval: 30,
    category: "Personal Training",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    contingentUsage: 1,
  },
  {
    id: 2,
    name: "EMS Cardio",
    description: "Cardiovascular training enhanced with EMS",
    duration: 30,
    maxParallel: 2,
    slotsRequired: 1,
    color: "#10B981",
    interval: 30,
    category: "Personal Training",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    contingentUsage: 1,
  },
  {
    id: 3,
    name: "EMP Chair",
    description: "Relaxing electromagnetic pulse therapy session",
    duration: 30,
    maxParallel: 1,
    slotsRequired: 0,
    color: "#8B5CF6",
    interval: 30,
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    contingentUsage: 0,
  },
  {
    id: 4,
    name: "Body Check",
    description: "Comprehensive body analysis and measurements",
    duration: 30,
    maxParallel: 1,
    slotsRequired: 2,
    color: "#3B82F6",
    interval: 30,
    category: "Health Check",
    image: null,
    contingentUsage: 1,
  },
];

export const DEFAULT_TRIAL_TRAINING = {
  name: "Trial Training",
  duration: 60,
  maxParallel: 1,
  slotsRequired: 3,
  color: "#3B82F6",
};

// =============================================================================
// SECTION 7: LEAD CONFIGURATION
// =============================================================================
export const leadSourcesData = [
  "Website",
  "Social Media Ads",
  "Google Ads",
  "Referral",
  "Walk-in",
  "Phone Call",
  "Email Campaign",
  "Event",
  "Partner",
  "Other",
];

export const leadStatusData = [
  { value: "active", label: "Active Prospect", color: "#10B981" },
  { value: "passive", label: "Passive Prospect", color: "#F59E0B" },
  { value: "uninterested", label: "Uninterested", color: "#EF4444" },
  { value: "missed", label: "Missed Call", color: "#8B5CF6" },
  { value: "trial", label: "Trial Training", color: "#3B82F6" },
  { value: "converted", label: "Converted", color: "#059669" },
];

export const leadInterestedInData = [
  "Basic Membership",
  "Premium Membership",
  "Personal Training",
  "Group Classes",
  "Wellness Package",
  "Corporate Membership",
];

export const DEFAULT_LEAD_SOURCES = [
  { id: 1, name: "Website", color: "#3B82F6" },
  { id: 2, name: "Social Media Ads", color: "#E1306C" },
  { id: 3, name: "Google Ads", color: "#EA4335" },
  { id: 4, name: "Referral", color: "#10B981" },
  { id: 5, name: "Walk-in", color: "#8B5CF6" },
  { id: 6, name: "Phone Call", color: "#06B6D4" },
  { id: 7, name: "Email Campaign", color: "#F59E0B" },
  { id: 8, name: "Event", color: "#EC4899" },
  { id: 9, name: "Partner", color: "#84CC16" },
  { id: 10, name: "Other", color: "#6B7280" },
];

// Helper function to get lead source names as simple array (for backwards compatibility)
export const getLeadSourceNames = () => DEFAULT_LEAD_SOURCES.map(s => s.name);

// Helper function to get lead source by name
export const getLeadSourceByName = (name) => DEFAULT_LEAD_SOURCES.find(s => s.name === name) || null;

// Helper function to get lead source color
export const getLeadSourceColor = (name) => {
  const source = getLeadSourceByName(name);
  return source?.color || "#6B7280"; // Default gray if not found
};

// =============================================================================
// SECTION 8: RELATION OPTIONS
// =============================================================================
export const relationOptionsData = {
  family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Uncle", "Aunt", "Cousin", "Grandparent", "Grandchild"],
  friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
  relationship: ["Partner", "Spouse", "Fiancé/Fiancée", "Ex-Partner"],
  work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
  other: ["Neighbor", "Doctor", "Trainer", "Coach", "Mentor", "Other"],
};

// Legacy alias
export const relationOptionsMain = relationOptionsData;

// =============================================================================
// SECTION 9: NOTE CONFIGURATION
// =============================================================================
export const noteStatusOptionsData = [
  { value: "interest", label: "Interest", color: "#10B981" },
  { value: "contact_attempt", label: "Contact Attempt", color: "#3B82F6" },
  { value: "callback_requested", label: "Callback Requested", color: "#F59E0B" },
  { value: "follow_up", label: "Follow-up", color: "#8B5CF6" },
  { value: "personal_info", label: "Personal Info", color: "#06B6D4" },
  { value: "health", label: "Health", color: "#EF4444" },
  { value: "objection", label: "Objection", color: "#F97316" },
  { value: "general", label: "General", color: "#6B7280" },
];

export const noteImportanceData = [
  { value: "unimportant", label: "Normal", color: "#6B7280" },
  { value: "important", label: "Important", color: "#EF4444" },
];

// =============================================================================
// SECTION 10: TIME SLOTS
// =============================================================================
export const timeSlotIntervalsData = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "60 minutes" },
];

export const standardTimeSlotsData = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

// =============================================================================
// SECTION 11: DIFFICULTY LEVELS (Training)
// =============================================================================
export const difficultyLevelsData = [
  { value: "Beginner", label: "Beginner", color: "bg-green-600" },
  { value: "Intermediate", label: "Intermediate", color: "bg-yellow-600" },
  { value: "Advanced", label: "Advanced", color: "bg-red-600" },
];

// =============================================================================
// SECTION 12: CONTRACT CONFIGURATION
// =============================================================================
export const DEFAULT_CONTRACT_FORMS = [
  {
    id: 1,
    name: "Standard Membership Agreement",
    pages: [
      {
        id: 1,
        title: "Terms & Conditions",
        elements: [
          { id: 1, type: "heading", content: "Membership Agreement" },
          { id: 2, type: "paragraph", content: "This agreement is entered into between {Studio_Name} and the member." },
        ]
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Premium Membership Contract",
    pages: [
      {
        id: 1,
        title: "Premium Terms",
        elements: [
          { id: 1, type: "heading", content: "Premium Membership Agreement" },
          { id: 2, type: "paragraph", content: "Welcome to our Premium Membership program." },
        ]
      },
      {
        id: 2,
        title: "Signatures",
        elements: [
          { id: 1, type: "field", fieldType: "signature", label: "Member Signature", required: true },
        ]
      }
    ],
    createdAt: "2024-02-01T14:30:00Z",
  },
  {
    id: 3,
    name: "Trial Membership Form",
    pages: [
      {
        id: 1,
        title: "Trial Agreement",
        elements: [
          { id: 1, type: "heading", content: "Trial Membership" },
          { id: 2, type: "paragraph", content: "This trial membership allows you to experience our studio for a limited time." },
        ]
      }
    ],
    createdAt: "2024-03-01T08:00:00Z",
  },
];

export const DEFAULT_CONTRACT_TYPES = [
  {
    id: 1,
    name: "Basic Monthly",
    description: "Entry-level membership with essential features",
    duration: 12,
    cost: 79,
    billingPeriod: "monthly",
    userCapacity: 4,
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 79,
    cancellationPeriod: 30,
    contractFormId: 1,
  },
  {
    id: 2,
    name: "Standard Monthly",
    description: "Our most popular membership option",
    duration: 12,
    cost: 99,
    billingPeriod: "monthly",
    userCapacity: 8,
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 99,
    cancellationPeriod: 30,
    contractFormId: 1,
  },
  {
    id: 3,
    name: "Premium Unlimited",
    description: "Full access with unlimited training sessions",
    duration: 12,
    cost: 149,
    billingPeriod: "monthly",
    userCapacity: 0,
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 149,
    cancellationPeriod: 30,
    contractFormId: 2,
  },
  {
    id: 4,
    name: "Flex 10er Card",
    description: "10 training credits, use anytime within 6 months",
    duration: 6,
    cost: 199,
    billingPeriod: "monthly",
    userCapacity: 10,
    autoRenewal: false,
    renewalIndefinite: false,
    renewalPeriod: null,
    renewalPrice: 0,
    cancellationPeriod: 0,
    contractFormId: 1,
  },
  {
    id: 5,
    name: "Annual Premium",
    description: "Best value - pay annually, save 2 months",
    duration: 12,
    cost: 1490,
    billingPeriod: "annually",
    userCapacity: 0,
    autoRenewal: true,
    renewalIndefinite: false,
    renewalPeriod: 12,
    renewalPrice: 1490,
    cancellationPeriod: 60,
    contractFormId: 2,
  },
  {
    id: 6,
    name: "Trial Week",
    description: "7-day trial membership to experience our studio",
    duration: 1,
    cost: 29,
    billingPeriod: "weekly",
    userCapacity: 3,
    autoRenewal: false,
    renewalIndefinite: false,
    renewalPeriod: null,
    renewalPrice: 0,
    cancellationPeriod: 0,
    contractFormId: 3,
  },
];

export const DEFAULT_CONTRACT_SETTINGS = {
  allowMemberSelfCancellation: true,
  noticePeriod: 30,
  extensionPeriod: 12,
  defaultBillingPeriod: "monthly",
  defaultAutoRenewal: true,
  defaultRenewalIndefinite: true,
  defaultRenewalPeriod: 1,
  defaultAppointmentLimit: 8, // defaultContingent
};

export const DEFAULT_CONTRACT_PAUSE_REASONS = [
  { id: 1, name: "Vacation", maxDays: 30, requiresProof: false },
  { id: 2, name: "Medical / Illness", maxDays: 90, requiresProof: true },
  { id: 3, name: "Injury / Rehabilitation", maxDays: 120, requiresProof: true },
  { id: 4, name: "Pregnancy", maxDays: 180, requiresProof: true },
  { id: 5, name: "Parental Leave", maxDays: 365, requiresProof: true },
  { id: 6, name: "Work Relocation", maxDays: 90, requiresProof: true },
  { id: 7, name: "Military / Civil Service", maxDays: 365, requiresProof: true },
  { id: 8, name: "Personal Reasons", maxDays: 30, requiresProof: false },
];

export const DEFAULT_VAT_RATES = [
  { name: "Standard", percentage: 19, description: "Standard VAT rate" },
  { name: "Reduced", percentage: 7, description: "Reduced VAT rate" },
];

// =============================================================================
// SECTION 13: DEFAULT SETTINGS
// =============================================================================
export const DEFAULT_OPENING_HOURS = [
  { day: 'Monday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Tuesday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Wednesday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Thursday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Friday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Saturday', startTime: '10:00', endTime: '18:00', closed: false },
  { day: 'Sunday', startTime: null, endTime: null, closed: true },
];

export const DEFAULT_COMMUNICATION_SETTINGS = {
  autoArchiveDuration: 30,
  // Birthday notification
  birthdayNotificationEnabled: true,
  birthdaySendEmail: true,
  birthdaySendApp: true,
  birthdaySubject: "🎂 Happy Birthday, {Member_First_Name}!",
  birthdayTemplate: "<p>Dear {Member_First_Name},</p><p>The entire team at <strong>{Studio_Name}</strong> wishes you a wonderful birthday! 🎉</p><p>As a special gift, enjoy a <strong>free training session</strong> this week.</p><p>We look forward to seeing you!</p>",
  birthdaySendTime: "09:00",
  // SMTP
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "noreply@fitnesspro.de",
  smtpPass: "",
  smtpSecure: true,
  smtpFromEmail: "noreply@fitnesspro.de",
  senderName: "FitnessPro Studio",
  // Email signature
  emailSignature: "<p>Best regards,<br><strong>FitnessPro Studio Team</strong></p><p>📞 +49 30 12345678<br>📧 info@fitnesspro.de<br>🌐 www.fitnesspro.de</p><p style=\"color: #666; font-size: 12px;\">Musterstraße 123, 10115 Berlin</p>",
  // E-Invoice
  einvoiceSubject: "Invoice {Invoice_Number} - {Selling_Date}",
  einvoiceTemplate: "<p>Dear {Member_First_Name} {Member_Last_Name},</p><p>Please find attached your invoice <strong>#{Invoice_Number}</strong> dated {Selling_Date}.</p><p><strong>Total Amount: {Total_Amount}</strong></p><p>Thank you for your continued membership!</p>",
};

export const DEFAULT_APPOINTMENT_NOTIFICATION_TYPES = {
  confirmation: { 
    enabled: true, 
    subject: "✅ Appointment Confirmed - {Appointment_Type}", 
    template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been confirmed:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>We look forward to seeing you!</p>", 
    sendApp: true, 
    sendEmail: true, 
    hoursBefore: 24 
  },
  cancellation: { 
    enabled: true, 
    subject: "❌ Appointment Cancelled - {Appointment_Type}", 
    template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been cancelled:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>Please book a new appointment if needed.</p>", 
    sendApp: true, 
    sendEmail: true, 
    hoursBefore: 24 
  },
  rescheduled: { 
    enabled: true, 
    subject: "🔄 Appointment Rescheduled - {Appointment_Type}", 
    template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been rescheduled to:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p>", 
    sendApp: true, 
    sendEmail: true, 
    hoursBefore: 24 
  },
  reminder: { 
    enabled: true, 
    subject: "⏰ Reminder: {Appointment_Type} tomorrow", 
    template: "<p>Dear {Member_First_Name},</p><p>This is a reminder for your upcoming appointment:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>See you soon!</p>", 
    sendApp: true, 
    sendEmail: true, 
    hoursBefore: 24 
  },
  registration: { 
    enabled: true, 
    subject: "🎉 Welcome to {Studio_Name}!", 
    template: "<p>Dear {Member_First_Name} {Member_Last_Name},</p><p>Welcome to <strong>{Studio_Name}</strong>! We're excited to have you as a member.</p><p>Click the link below to complete your registration:</p><p>{Registration_Link}</p><p>If you have any questions, feel free to contact us.</p>", 
    sendApp: false, 
    sendEmail: true 
  },
};

export const DEFAULT_APPEARANCE_SETTINGS = {
  theme: "dark",
  primaryColor: "#FF843E",
  secondaryColor: "#1890ff",
  allowStaffThemeToggle: true,
  allowMemberThemeToggle: true
};

export const DEFAULT_INTRODUCTORY_MATERIALS = [
  {
    id: 1,
    name: "Welcome Guide",
    pages: [{ id: 1, title: "Welcome", content: "<p>Welcome to our studio!</p>", elements: [] }]
  }
];

export const DEFAULT_MEMBER_SETTINGS = {
  allowMemberQRCheckIn: false,
  memberQRCodeUrl: "",
};

// =============================================================================
// SECTION 14: HELPER FUNCTIONS
// =============================================================================

// --- Getter Functions ---
export const getCountries = () => COUNTRIES;
export const getStaffRoles = () => staffRolesData;
export const getDepartments = () => departmentsData;
export const getContractTypes = () => contractTypesListData;
export const getMemberTypes = () => memberTypesData;
export const getGenderOptions = () => genderOptionsData;
export const getLeadSources = () => leadSourcesData;
export const getLeadStatuses = () => leadStatusData;
export const getDifficultyLevels = () => difficultyLevelsData;

// --- Studio Helpers ---
export const getStudioData = () => studioData;
export const getStudioName = () => studioData.name;
export const getStudioShortName = () => studioData.shortName;

export const getOpeningHoursForDay = (day) => {
  return studioData.openingHours.find(h => h.day === day) || null;
};

export const isStudioOpenOnDay = (day) => {
  const hours = getOpeningHoursForDay(day);
  return hours && !hours.closed;
};

export const getStudioAddress = () => {
  return `${studioData.street}, ${studioData.zipCode} ${studioData.city}, ${studioData.country}`;
};

export const getStudioContactInfo = () => ({
  email: studioData.email,
  phone: studioData.phone,
  website: studioData.website,
});

// --- Label/Color Helpers ---
export const getDifficultyColor = (difficulty) => {
  const level = difficultyLevelsData.find(d => d.value === difficulty);
  return level?.color || "bg-gray-600";
};

export const getMemberTypeLabel = (value) => {
  const type = memberTypesData.find(t => t.value === value);
  return type?.label || value;
};

export const getLeadSourceLabel = (source) => {
  return leadSourcesData.includes(source) ? source : "Other";
};

// --- Validation Helpers ---
export const isValidCountry = (country) => COUNTRIES.includes(country);
export const isValidStaffRole = (role) => staffRolesData.includes(role);
export const isValidDepartment = (dept) => departmentsData.includes(dept);
export const isValidMemberType = (type) => memberTypesData.some(t => t.value === type);
export const isValidGender = (gender) => genderOptionsData.some(g => g.value === gender);

// --- Contract Helpers ---
export const generateId = () => Date.now();

export const formatCurrency = (amount, currency = "€", locale = "de-DE") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency === "€" ? "EUR" : currency === "$" ? "USD" : currency === "£" ? "GBP" : "EUR",
  }).format(amount);
};

export const calculateContractEndDate = (startDate, durationMonths) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString();
};

export const hasEnoughContingent = (memberContingent, appointmentContingentUsage) => {
  if (memberContingent === 0) return true;
  return memberContingent >= appointmentContingentUsage;
};

export const deductContingent = (currentContingent, usage) => {
  if (currentContingent === 0) return 0;
  return Math.max(0, currentContingent - usage);
};

// =============================================================================
// SECTION 15: BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformStudioFromBackend = (backendStudio) => ({
  id: backendStudio.id,
  name: backendStudio.name,
  shortName: backendStudio.short_name || backendStudio.shortName,
  email: backendStudio.email,
  phone: backendStudio.phone,
  street: backendStudio.street,
  zipCode: backendStudio.zip_code || backendStudio.zipCode,
  city: backendStudio.city,
  country: backendStudio.country,
  logo: backendStudio.logo_url || backendStudio.logo,
  avatar: backendStudio.avatar_url || backendStudio.avatar,
  website: backendStudio.website,
  openingHours: backendStudio.opening_hours || backendStudio.openingHours || [],
  capacity: backendStudio.capacity || 3,
  timezone: backendStudio.timezone || "Europe/Berlin",
  taxId: backendStudio.tax_id || backendStudio.taxId,
  bankAccount: backendStudio.bank_account || backendStudio.bankAccount,
  socialMedia: backendStudio.social_media || backendStudio.socialMedia,
  settings: backendStudio.settings || {},
});

export const transformStudioToBackend = (frontendStudio) => ({
  id: frontendStudio.id,
  name: frontendStudio.name,
  short_name: frontendStudio.shortName,
  email: frontendStudio.email,
  phone: frontendStudio.phone,
  street: frontendStudio.street,
  zip_code: frontendStudio.zipCode,
  city: frontendStudio.city,
  country: frontendStudio.country,
  logo_url: frontendStudio.logo,
  avatar_url: frontendStudio.avatar,
  website: frontendStudio.website,
  opening_hours: frontendStudio.openingHours,
  capacity: frontendStudio.capacity,
  timezone: frontendStudio.timezone,
  tax_id: frontendStudio.taxId,
  bank_account: frontendStudio.bankAccount,
  social_media: frontendStudio.socialMedia,
  settings: frontendStudio.settings,
});

// =============================================================================
// SECTION 16: MOCK API
// =============================================================================

export const studioApi = {
  get: async () => studioData,
  update: async (data) => ({ ...studioData, ...data }),
  updateOpeningHours: async (hours) => ({ success: true, openingHours: hours }),
  updateSettings: async (settings) => ({ success: true, settings }),
  uploadLogo: async (file) => ({ success: true, url: URL.createObjectURL(file) }),
};

export const configApi = {
  getCountries: async () => COUNTRIES,
  getStaffRoles: async () => staffRolesData,
  getDepartments: async () => departmentsData,
  getMemberTypes: async () => memberTypesData,
  getLeadSources: async () => leadSourcesData,
  getAppointmentTypes: async () => DEFAULT_APPOINTMENT_TYPES,
  getContractTypes: async () => DEFAULT_CONTRACT_TYPES,
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================
export default {
  // Countries
  COUNTRIES,
  COUNTRIES_SIMPLE,
  
  // Studio
  studioData,
  
  // Permissions
  PERMISSION_GROUPS,
  ALL_PERMISSION_KEYS,
  PERMISSION_DATA,
  
  // Staff Config
  staffRolesData,
  contractTypesListData,
  departmentsData,
  DEFAULT_STAFF_ROLES,
  DEFAULT_VACATION_DAYS,
  DEFAULT_STAFF_ROLE_ID,
  DEFAULT_STAFF_COUNTRY,
  DEFAULT_STAFF_MEMBERS,
  
  // Member Config
  memberTypesData,
  memberStatusData,
  genderOptionsData,
  
  // Appointment Config
  appointmentStatusData,
  appointmentDurationsData,
  DEFAULT_STUDIO_CAPACITY,
  DEFAULT_APPOINTMENT_CATEGORIES,
  DEFAULT_APPOINTMENT_TYPES,
  DEFAULT_TRIAL_TRAINING,
  DEFAULT_APPOINTMENT_NOTIFICATION_TYPES,
  
  // Lead Config
  leadSourcesData,
  leadStatusData,
  leadInterestedInData,
  DEFAULT_LEAD_SOURCES,
  
  // Relations
  relationOptionsData,
  relationOptionsMain,
  
  // Notes
  noteStatusOptionsData,
  noteImportanceData,
  
  // Time Slots
  timeSlotIntervalsData,
  standardTimeSlotsData,
  
  // Difficulty
  difficultyLevelsData,
  
  // Contract Config
  DEFAULT_CONTRACT_FORMS,
  DEFAULT_CONTRACT_TYPES,
  DEFAULT_CONTRACT_SETTINGS,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_VAT_RATES,
  
  // Default Settings
  DEFAULT_OPENING_HOURS,
  DEFAULT_COMMUNICATION_SETTINGS,
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_INTRODUCTORY_MATERIALS,
  DEFAULT_MEMBER_SETTINGS,
  
  // Helper Functions
  getCountries,
  getStaffRoles,
  getDepartments,
  getContractTypes,
  getMemberTypes,
  getGenderOptions,
  getLeadSources,
  getLeadStatuses,
  getDifficultyLevels,
  getStudioData,
  getStudioName,
  getStudioShortName,
  getOpeningHoursForDay,
  isStudioOpenOnDay,
  getStudioAddress,
  getStudioContactInfo,
  getDifficultyColor,
  getMemberTypeLabel,
  getLeadSourceLabel,
  isValidCountry,
  isValidStaffRole,
  isValidDepartment,
  isValidMemberType,
  isValidGender,
  generateId,
  formatCurrency,
  calculateContractEndDate,
  hasEnoughContingent,
  deductContingent,
  
  // Transformations
  transformStudioFromBackend,
  transformStudioToBackend,
  
  // APIs
  studioApi,
  configApi,
};
