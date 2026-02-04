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
// =============================================================================
// SECTION 2B: GERMAN PUBLIC HOLIDAYS
// =============================================================================
// Helper function to calculate Easter Sunday (Gauss Algorithm)
const calculateEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// Helper to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Format date as YYYY-MM-DD
const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Generate holidays for a specific year (English names)
export const generateGermanHolidays = (year) => {
  const easter = calculateEasterSunday(year);
  
  return [
    // Fixed national holidays
    { date: `${year}-01-01`, name: "New Year's Day", type: "national" },
    { date: `${year}-05-01`, name: "Labour Day", type: "national" },
    { date: `${year}-10-03`, name: "German Unity Day", type: "national" },
    { date: `${year}-12-25`, name: "Christmas Day", type: "national" },
    { date: `${year}-12-26`, name: "Boxing Day", type: "national" },
    
    // Movable holidays (based on Easter)
    { date: formatDateISO(addDays(easter, -2)), name: "Good Friday", type: "national" },
    { date: formatDateISO(easter), name: "Easter Sunday", type: "national" },
    { date: formatDateISO(addDays(easter, 1)), name: "Easter Monday", type: "national" },
    { date: formatDateISO(addDays(easter, 39)), name: "Ascension Day", type: "national" },
    { date: formatDateISO(addDays(easter, 49)), name: "Whit Sunday", type: "national" },
    { date: formatDateISO(addDays(easter, 50)), name: "Whit Monday", type: "national" },
    
    // Regional holidays (commonly observed)
    { date: `${year}-01-06`, name: "Epiphany", type: "regional" },
    { date: formatDateISO(addDays(easter, 60)), name: "Corpus Christi", type: "regional" },
    { date: `${year}-08-15`, name: "Assumption Day", type: "regional" },
    { date: `${year}-10-31`, name: "Reformation Day", type: "regional" },
    { date: `${year}-11-01`, name: "All Saints' Day", type: "regional" },
    
    // Custom closing days (commonly closed)
    { date: `${year}-12-24`, name: "Christmas Eve", type: "custom" },
    { date: `${year}-12-31`, name: "New Year's Eve", type: "custom" },
  ];
};

// Pre-generate holidays for current and next 2 years
const currentYear = new Date().getFullYear();
export const germanHolidaysData = [
  ...generateGermanHolidays(currentYear),
  ...generateGermanHolidays(currentYear + 1),
  ...generateGermanHolidays(currentYear + 2),
];

// Generate closingDays from national holidays (for studioData initialization)
const generateClosingDays = () => {
  const closingDays = [];
  for (let year = currentYear; year <= currentYear + 2; year++) {
    const holidays = generateGermanHolidays(year);
    holidays.forEach(h => {
      if (h.type === 'national' || h.type === 'custom') {
        closingDays.push({ date: h.date, description: h.name });
      }
    });
  }
  return closingDays;
};

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
    { day: 'Saturday', startTime: null, endTime: null, closed: true },
    { day: 'Sunday', startTime: null, endTime: null, closed: true },
  ],
  closingDays: generateClosingDays(),
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

// Helper to check if a date is a holiday
export const getHolidayForDate = (dateStr) => {
  return germanHolidaysData.find(h => h.date === dateStr) || null;
};

// Helper to format date as YYYY-MM-DD (local timezone)
export const formatDateToISO = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to check if studio is closed on a specific date
export const isStudioClosedOnDate = (date) => {
  // Handle both Date objects and string dates
  let dateObj;
  let dateStr;
  
  if (typeof date === 'string') {
    // Parse string date carefully to avoid timezone issues
    const parts = date.split('-');
    if (parts.length === 3) {
      dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      dateStr = date;
    } else {
      dateObj = new Date(date);
      dateStr = formatDateToISO(dateObj);
    }
  } else {
    dateObj = date;
    dateStr = formatDateToISO(dateObj);
  }
  
  const dayOfWeek = dateObj.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeek];
  
  // Check custom closing days from studioData FIRST (highest priority)
  const customClosing = studioData.closingDays.find(d => d.date === dateStr);
  if (customClosing) {
    return { closed: true, reason: customClosing.description || 'Closed', isClosingDay: true };
  }
  
  // Check if it's a holiday
  const holiday = getHolidayForDate(dateStr);
  if (holiday && (holiday.type === 'national' || holiday.type === 'custom')) {
    return { closed: true, reason: holiday.name, isHoliday: true };
  }
  
  // Check opening hours for this day (weekend check)
  const dayConfig = studioData.openingHours.find(d => d.day === dayName);
  if (dayConfig?.closed) {
    return { closed: true, reason: dayName, isWeekend: true };
  }
  
  return { closed: false };
};

// Get opening hours for a specific date (returns null if closed)
export const getOpeningHoursForDate = (date) => {
  const closedInfo = isStudioClosedOnDate(date);
  if (closedInfo.closed) return null;
  
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const dayOfWeek = dateObj.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeek];
  
  return studioData.openingHours.find(d => d.day === dayName);
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
// SECTION 6B: CALENDAR SETTINGS
// =============================================================================
export const DEFAULT_CALENDAR_SETTINGS = {
  // Whether to hide closed days (weekends) in the calendar week/day view
  hideClosedDays: true,
  // Calendar time display range
  calendarStartTime: "06:00",
  calendarEndTime: "23:00",
  // Whether past appointments should be displayed faded
  fadePastAppointments: true,
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
    name: "Vollständige Mitgliedschaftsvereinbarung",
    globalHeader: {
      enabled: true,
      content: "FitnessPro Studio • Mitgliedschaftsvertrag • Mitglieds-Nr.: {Member ID}",
      fontSize: 10,
      alignment: 'center',
      verticalAlignment: 'center',
      bold: false,
      italic: false,
      showOnPages: 'all'
    },
    globalFooter: {
      enabled: true,
      content: "Seite {page} von {pages} • {Studio_Name} • {Studio_Address}",
      fontSize: 9,
      alignment: 'center',
      verticalAlignment: 'center',
      bold: false,
      italic: true,
      showOnPages: 'all'
    },
    folders: [
      { id: 1, name: "Persönliche Daten", color: "#3B82F6", expanded: true, sortIndex: 0 },
      { id: 2, name: "Kontaktdaten", color: "#10B981", expanded: true, sortIndex: 1 },
      { id: 3, name: "Vertragsdaten", color: "#F59E0B", expanded: true, sortIndex: 2 },
      { id: 4, name: "Bankdaten", color: "#8B5CF6", expanded: true, sortIndex: 3 },
      { id: 5, name: "Dekorative Elemente", color: "#EC4899", expanded: false, sortIndex: 4 }
    ],
    pages: [
      {
        id: 1,
        title: "Persönliche Daten & Kontakt",
        backgroundImage: null,
        elements: [
          // ==================== LOGO & HEADER ====================
          {
            id: 1,
            type: 'image',
            x: 220,
            y: 10,
            width: 200,
            height: 80,
            src: null,
            visible: true,
            sortIndex: 0
          },
          {
            id: 2,
            type: 'heading',
            x: 0,
            y: 100,
            width: 642,
            height: 45,
            content: 'MITGLIEDSCHAFTSVERTRAG',
            fontSize: 28,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            italic: false,
            underline: false,
            alignment: 'center',
            color: '#1F2937',
            visible: true,
            sortIndex: 1
          },
          {
            id: 3,
            type: 'divider',
            x: 100,
            y: 150,
            width: 442,
            height: 3,
            lineColor: '#FF843E',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 2,
            folderId: 5
          },
          
          // ==================== VERTRAGSINFO (SYSTEM-VARIABLEN) ====================
          {
            id: 4,
            type: 'subheading',
            x: 0,
            y: 170,
            width: 642,
            height: 30,
            content: '1. Vertragsinformationen',
            fontSize: 18,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            italic: false,
            alignment: 'left',
            color: '#374151',
            visible: true,
            sortIndex: 3,
            folderId: 3
          },
          // Member ID - System Variable
          {
            id: 5,
            type: 'system-text',
            x: 0,
            y: 210,
            width: 200,
            height: 55,
            variable: 'Member ID',
            label: 'Mitgliedsnummer',
            showTitle: true,
            labelFontSize: 12,
            labelFontFamily: 'Arial, sans-serif',
            labelBold: true,
            labelItalic: false,
            labelUnderline: false,
            labelColor: '#374151',
            inputFontSize: 14,
            inputFontFamily: 'Arial, sans-serif',
            inputBold: false,
            inputColor: '#1F2937',
            required: false,
            visible: true,
            sortIndex: 4,
            folderId: 3
          },
          // Contract Type - System Variable
          {
            id: 6,
            type: 'system-text',
            x: 220,
            y: 210,
            width: 200,
            height: 55,
            variable: 'Contract Type',
            label: 'Vertragsart',
            showTitle: true,
            labelFontSize: 12,
            labelFontFamily: 'Arial, sans-serif',
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputFontFamily: 'Arial, sans-serif',
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 5,
            folderId: 3
          },
          // Contract Cost - System Variable
          {
            id: 7,
            type: 'system-text',
            x: 440,
            y: 210,
            width: 200,
            height: 55,
            variable: 'Contract Cost',
            label: 'Monatsbeitrag',
            showTitle: true,
            labelFontSize: 12,
            labelFontFamily: 'Arial, sans-serif',
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputFontFamily: 'Arial, sans-serif',
            inputColor: '#10B981',
            inputBold: true,
            visible: true,
            sortIndex: 6,
            folderId: 3
          },
          // Contract Start Date - System Variable
          {
            id: 8,
            type: 'system-text',
            x: 0,
            y: 280,
            width: 200,
            height: 55,
            variable: 'Contract Start Date',
            label: 'Vertragsbeginn',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 7,
            folderId: 3
          },
          // Contract End Date - System Variable
          {
            id: 9,
            type: 'system-text',
            x: 220,
            y: 280,
            width: 200,
            height: 55,
            variable: 'Contract End Date',
            label: 'Vertragsende',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 8,
            folderId: 3
          },
          // Minimum Term - System Variable
          {
            id: 10,
            type: 'system-text',
            x: 440,
            y: 280,
            width: 200,
            height: 55,
            variable: 'Minimum Term',
            label: 'Mindestlaufzeit',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 9,
            folderId: 3
          },
          
          // Decorative Rectangle behind section
          {
            id: 11,
            type: 'rectangle',
            x: 0,
            y: 165,
            width: 642,
            height: 185,
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            visible: true,
            sortIndex: 100, // Hintergrund (hoher sortIndex = weiter hinten)
            folderId: 5
          },

          // ==================== PERSÖNLICHE DATEN (USER-VARIABLEN) ====================
          {
            id: 12,
            type: 'subheading',
            x: 0,
            y: 370,
            width: 642,
            height: 30,
            content: '2. Persönliche Daten des Mitglieds',
            fontSize: 18,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            alignment: 'left',
            color: '#374151',
            visible: true,
            sortIndex: 10,
            folderId: 1
          },
          // Salutation - User Variable
          {
            id: 13,
            type: 'text',
            x: 0,
            y: 410,
            width: 120,
            height: 55,
            variable: 'Salutation',
            label: 'Anrede',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 11,
            folderId: 1
          },
          // Member First Name - User Variable
          {
            id: 14,
            type: 'text',
            x: 140,
            y: 410,
            width: 240,
            height: 55,
            variable: 'Member First Name',
            label: 'Vorname',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 12,
            folderId: 1
          },
          // Member Last Name - User Variable
          {
            id: 15,
            type: 'text',
            x: 400,
            y: 410,
            width: 240,
            height: 55,
            variable: 'Member Last Name',
            label: 'Nachname',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 13,
            folderId: 1
          },
          // Date of Birth - User Variable
          {
            id: 16,
            type: 'text',
            x: 0,
            y: 480,
            width: 200,
            height: 55,
            variable: 'Date of Birth',
            label: 'Geburtsdatum',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 14,
            folderId: 1
          },
          
          // ==================== ADRESSE ====================
          // Street - User Variable
          {
            id: 17,
            type: 'text',
            x: 0,
            y: 555,
            width: 400,
            height: 55,
            variable: 'Street',
            label: 'Straße',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 15,
            folderId: 2
          },
          // House Number - User Variable
          {
            id: 18,
            type: 'text',
            x: 420,
            y: 555,
            width: 120,
            height: 55,
            variable: 'House Number',
            label: 'Hausnummer',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 16,
            folderId: 2
          },
          // ZIP Code - User Variable
          {
            id: 19,
            type: 'text',
            x: 0,
            y: 625,
            width: 150,
            height: 55,
            variable: 'ZIP Code',
            label: 'Postleitzahl',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 17,
            folderId: 2
          },
          // City - User Variable
          {
            id: 20,
            type: 'text',
            x: 170,
            y: 625,
            width: 300,
            height: 55,
            variable: 'City',
            label: 'Stadt',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 18,
            folderId: 2
          },
          
          // ==================== KONTAKTDATEN ====================
          // Telephone number - User Variable
          {
            id: 21,
            type: 'text',
            x: 0,
            y: 700,
            width: 200,
            height: 55,
            variable: 'Telephone number',
            label: 'Telefon (Festnetz)',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: false,
            visible: true,
            sortIndex: 19,
            folderId: 2
          },
          // Mobile number - User Variable
          {
            id: 22,
            type: 'text',
            x: 220,
            y: 700,
            width: 200,
            height: 55,
            variable: 'Mobile number',
            label: 'Mobilnummer',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 20,
            folderId: 2
          },
          // Email Address - User Variable
          {
            id: 23,
            type: 'text',
            x: 0,
            y: 770,
            width: 420,
            height: 55,
            variable: 'Email Address',
            label: 'E-Mail-Adresse',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 21,
            folderId: 2
          },
          
          // Decorative Circle as accent
          {
            id: 24,
            type: 'circle',
            x: 600,
            y: 850,
            width: 40,
            height: 40,
            backgroundColor: '#FF843E',
            borderWidth: 0,
            visible: true,
            sortIndex: 101,
            folderId: 5
          },
          
          // Info Text at bottom
          {
            id: 25,
            type: 'textarea',
            x: 0,
            y: 850,
            width: 580,
            height: 80,
            content: 'Bitte füllen Sie alle mit * gekennzeichneten Pflichtfelder vollständig aus. Ihre Daten werden gemäß unserer Datenschutzerklärung verarbeitet und nicht an Dritte weitergegeben.',
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            italic: true,
            color: '#6B7280',
            alignment: 'left',
            lineHeight: 1.4,
            visible: true,
            sortIndex: 22
          }
        ]
      },
      {
        id: 2,
        title: "Zahlungsinformationen & SEPA",
        backgroundImage: null,
        elements: [
          // ==================== SEPA HEADER ====================
          {
            id: 100,
            type: 'heading',
            x: 0,
            y: 10,
            width: 642,
            height: 40,
            content: 'SEPA-LASTSCHRIFTMANDAT',
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            alignment: 'center',
            color: '#1F2937',
            visible: true,
            sortIndex: 0
          },
          {
            id: 101,
            type: 'divider',
            x: 150,
            y: 55,
            width: 342,
            height: 2,
            lineColor: '#3B82F6',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 1
          },
          
          // Gläubiger Info
          {
            id: 102,
            type: 'subheading',
            x: 0,
            y: 80,
            width: 642,
            height: 25,
            content: 'Gläubiger-Informationen',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 2
          },
          {
            id: 103,
            type: 'textarea',
            x: 0,
            y: 110,
            width: 642,
            height: 80,
            content: 'Gläubiger: FitnessPro GmbH\nGläubiger-Identifikationsnummer: DE98ZZZ09999999999\nMusterstraße 123, 10115 Berlin',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            color: '#374151',
            alignment: 'left',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 3
          },
          
          // SEPA Mandate Reference - System Variable
          {
            id: 104,
            type: 'system-text',
            x: 0,
            y: 200,
            width: 300,
            height: 55,
            variable: 'SEPA mandate reference',
            label: 'Mandatsreferenz',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 4,
            folderId: 4
          },
          
          // ==================== KONTOINHABER ====================
          {
            id: 105,
            type: 'subheading',
            x: 0,
            y: 280,
            width: 642,
            height: 25,
            content: 'Bankverbindung des Zahlungspflichtigen',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 5,
            folderId: 4
          },
          // Account Holder - User Variable
          {
            id: 106,
            type: 'text',
            x: 0,
            y: 315,
            width: 400,
            height: 55,
            variable: 'Member first name and last name (account holder)',
            label: 'Kontoinhaber (Vor- und Nachname)',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 6,
            folderId: 4
          },
          // Credit Institution - User Variable
          {
            id: 107,
            type: 'text',
            x: 0,
            y: 385,
            width: 400,
            height: 55,
            variable: 'Credit institution',
            label: 'Kreditinstitut (Name der Bank)',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 7,
            folderId: 4
          },
          // IBAN - User Variable
          {
            id: 108,
            type: 'text',
            x: 0,
            y: 455,
            width: 400,
            height: 55,
            variable: 'IBAN',
            label: 'IBAN',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputFontFamily: "'Courier New', monospace",
            inputColor: '#1F2937',
            inputCapsLock: true,
            required: true,
            visible: true,
            sortIndex: 8,
            folderId: 4
          },
          // BIC - User Variable
          {
            id: 109,
            type: 'text',
            x: 420,
            y: 455,
            width: 220,
            height: 55,
            variable: 'BIC',
            label: 'BIC/SWIFT',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputFontFamily: "'Courier New', monospace",
            inputColor: '#1F2937',
            inputCapsLock: true,
            required: true,
            visible: true,
            sortIndex: 9,
            folderId: 4
          },
          
          // ==================== SEPA MANDAT TEXT ====================
          {
            id: 110,
            type: 'rectangle',
            x: 0,
            y: 530,
            width: 642,
            height: 180,
            backgroundColor: '#FEF3C7',
            borderWidth: 2,
            borderColor: '#F59E0B',
            borderRadius: 8,
            visible: true,
            sortIndex: 100
          },
          {
            id: 111,
            type: 'textarea',
            x: 15,
            y: 545,
            width: 612,
            height: 150,
            content: 'SEPA-Lastschriftmandat\n\nIch ermächtige die FitnessPro GmbH, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von der FitnessPro GmbH auf mein Konto gezogenen Lastschriften einzulösen.\n\nHinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen.',
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            color: '#92400E',
            alignment: 'left',
            lineHeight: 1.4,
            visible: true,
            sortIndex: 10
          },
          
          // ==================== WEITERE VERTRAGSDATEN ====================
          {
            id: 112,
            type: 'subheading',
            x: 0,
            y: 730,
            width: 642,
            height: 25,
            content: 'Weitere Vertragsdetails',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 11,
            folderId: 3
          },
          // Training Start Date - System Variable
          {
            id: 113,
            type: 'system-text',
            x: 0,
            y: 765,
            width: 200,
            height: 55,
            variable: 'Training Start Date',
            label: 'Trainingsbeginn',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 12,
            folderId: 3
          },
          // Termination Notice Period - System Variable
          {
            id: 114,
            type: 'system-text',
            x: 220,
            y: 765,
            width: 200,
            height: 55,
            variable: 'Termination Notice Period',
            label: 'Kündigungsfrist',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 13,
            folderId: 3
          },
          // Contract Renewal Duration - System Variable
          {
            id: 115,
            type: 'system-text',
            x: 440,
            y: 765,
            width: 200,
            height: 55,
            variable: 'Contract Renewal Duration',
            label: 'Verlängerungszeitraum',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 14,
            folderId: 3
          },
          // Contribution Adjustment - System Variable
          {
            id: 116,
            type: 'system-text',
            x: 0,
            y: 835,
            width: 300,
            height: 55,
            variable: 'Contribution Adjustment',
            label: 'Beitragsanpassung',
            showTitle: true,
            labelFontSize: 12,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 15,
            folderId: 3
          }
        ]
      },
      {
        id: 3,
        title: "AGB & Zustimmungen",
        backgroundImage: null,
        elements: [
          // ==================== AGB HEADER ====================
          {
            id: 200,
            type: 'heading',
            x: 0,
            y: 10,
            width: 642,
            height: 40,
            content: 'ALLGEMEINE GESCHÄFTSBEDINGUNGEN',
            fontSize: 22,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            alignment: 'center',
            color: '#1F2937',
            visible: true,
            sortIndex: 0
          },
          {
            id: 201,
            type: 'divider',
            x: 100,
            y: 55,
            width: 442,
            height: 2,
            lineColor: '#10B981',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 1
          },
          
          // AGB Text
          {
            id: 202,
            type: 'textarea',
            x: 0,
            y: 75,
            width: 642,
            height: 300,
            content: '§1 Vertragsgegenstand\nDer Vertrag regelt die Nutzung der Fitnesseinrichtungen und Dienstleistungen des Studios.\n\n§2 Mitgliedsbeitrag\nDer monatliche Mitgliedsbeitrag ist jeweils zum 1. des Monats im Voraus fällig. Bei Lastschrifteinzug wird der Betrag automatisch abgebucht.\n\n§3 Laufzeit und Kündigung\nDie Mindestlaufzeit beträgt die im Vertrag angegebene Dauer. Nach Ablauf der Mindestlaufzeit verlängert sich der Vertrag automatisch, sofern nicht fristgerecht gekündigt wird.\n\n§4 Hausordnung\nDas Mitglied verpflichtet sich, die Hausordnung und die Anweisungen des Personals zu befolgen.\n\n§5 Haftung\nDas Studio haftet nicht für den Verlust oder die Beschädigung von eingebrachten Gegenständen, soweit dies gesetzlich zulässig ist.',
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            color: '#374151',
            alignment: 'left',
            lineHeight: 1.4,
            visible: true,
            sortIndex: 2
          },
          
          // ==================== ZUSTIMMUNGEN (CHECKBOXES) ====================
          {
            id: 203,
            type: 'subheading',
            x: 0,
            y: 390,
            width: 642,
            height: 25,
            content: 'Erforderliche Zustimmungen',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 3
          },
          
          // Checkbox 1: AGB akzeptieren
          {
            id: 204,
            type: 'checkbox',
            x: 0,
            y: 425,
            width: 642,
            height: 70,
            label: 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen',
            showTitle: true,
            checkboxTitleFontFamily: 'Arial, sans-serif',
            checkboxTitleSize: 14,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Mit meiner Unterschrift bestätige ich, dass ich die AGB gelesen und verstanden habe und diese vollständig akzeptiere.',
            checkboxDescriptionFontFamily: 'Arial, sans-serif',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 4
          },
          
          // Checkbox 2: Datenschutz
          {
            id: 205,
            type: 'checkbox',
            x: 0,
            y: 505,
            width: 642,
            height: 70,
            label: 'Ich stimme der Datenschutzerklärung zu',
            showTitle: true,
            checkboxTitleFontFamily: 'Arial, sans-serif',
            checkboxTitleSize: 14,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Ich bin damit einverstanden, dass meine personenbezogenen Daten gemäß der Datenschutzerklärung verarbeitet werden.',
            checkboxDescriptionFontFamily: 'Arial, sans-serif',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 5
          },
          
          // Checkbox 3: SEPA Mandat
          {
            id: 206,
            type: 'checkbox',
            x: 0,
            y: 585,
            width: 642,
            height: 70,
            label: 'Ich erteile das SEPA-Lastschriftmandat',
            showTitle: true,
            checkboxTitleFontFamily: 'Arial, sans-serif',
            checkboxTitleSize: 14,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Ich ermächtige das Studio, die fälligen Beiträge von meinem angegebenen Konto einzuziehen.',
            checkboxDescriptionFontFamily: 'Arial, sans-serif',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 6
          },
          
          // Checkbox 4: Newsletter (optional)
          {
            id: 207,
            type: 'checkbox',
            x: 0,
            y: 665,
            width: 642,
            height: 60,
            label: 'Ich möchte den Newsletter erhalten (optional)',
            showTitle: true,
            checkboxTitleFontFamily: 'Arial, sans-serif',
            checkboxTitleSize: 14,
            titleBold: false,
            titleColor: '#6B7280',
            showDescription: true,
            description: 'Ich möchte über Neuigkeiten, Angebote und Veranstaltungen per E-Mail informiert werden.',
            checkboxDescriptionFontFamily: 'Arial, sans-serif',
            checkboxDescriptionSize: 11,
            descriptionColor: '#9CA3AF',
            required: false,
            visible: true,
            sortIndex: 7
          },
          
          // Checkbox 5: Foto-Einwilligung (optional)
          {
            id: 208,
            type: 'checkbox',
            x: 0,
            y: 735,
            width: 642,
            height: 60,
            label: 'Einwilligung zur Bildnutzung (optional)',
            showTitle: true,
            checkboxTitleFontFamily: 'Arial, sans-serif',
            checkboxTitleSize: 14,
            titleBold: false,
            titleColor: '#6B7280',
            showDescription: true,
            description: 'Ich bin damit einverstanden, dass Fotos von mir zu Marketingzwecken verwendet werden dürfen.',
            checkboxDescriptionFontFamily: 'Arial, sans-serif',
            checkboxDescriptionSize: 11,
            descriptionColor: '#9CA3AF',
            required: false,
            visible: true,
            sortIndex: 8
          },
          
          // Decorative Arrow pointing to signatures
          {
            id: 209,
            type: 'arrow',
            x: 280,
            y: 820,
            width: 80,
            height: 40,
            backgroundColor: '#FF843E',
            borderWidth: 0,
            rotation: 90,
            visible: true,
            sortIndex: 100
          },
          {
            id: 210,
            type: 'textarea',
            x: 0,
            y: 870,
            width: 642,
            height: 30,
            content: 'Bitte wenden Sie auf die nächste Seite für die Unterschriften →',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            color: '#FF843E',
            alignment: 'center',
            visible: true,
            sortIndex: 9
          }
        ]
      },
      {
        id: 4,
        title: "Unterschriften",
        backgroundImage: null,
        elements: [
          // ==================== UNTERSCHRIFTEN HEADER ====================
          {
            id: 300,
            type: 'heading',
            x: 0,
            y: 10,
            width: 642,
            height: 40,
            content: 'VERTRAGSUNTERZEICHNUNG',
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            bold: true,
            alignment: 'center',
            color: '#1F2937',
            visible: true,
            sortIndex: 0
          },
          {
            id: 301,
            type: 'divider',
            x: 150,
            y: 55,
            width: 342,
            height: 3,
            lineColor: '#FF843E',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 1
          },
          
          // Erklärungstext
          {
            id: 302,
            type: 'textarea',
            x: 0,
            y: 80,
            width: 642,
            height: 80,
            content: 'Mit meiner Unterschrift bestätige ich, dass alle von mir gemachten Angaben wahrheitsgemäß und vollständig sind. Ich habe die Allgemeinen Geschäftsbedingungen, die Datenschutzerklärung und die Hausordnung zur Kenntnis genommen und akzeptiere diese.',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            color: '#374151',
            alignment: 'left',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 2
          },
          
          // Decorative semicircle
          {
            id: 303,
            type: 'semicircle',
            x: 0,
            y: 170,
            width: 642,
            height: 30,
            backgroundColor: '#F3F4F6',
            borderWidth: 0,
            visible: true,
            sortIndex: 100
          },
          
          // ==================== MITGLIED UNTERSCHRIFT ====================
          {
            id: 304,
            type: 'subheading',
            x: 0,
            y: 220,
            width: 300,
            height: 25,
            content: 'Unterschrift Mitglied',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 3
          },
          {
            id: 305,
            type: 'signature',
            x: 0,
            y: 255,
            width: 300,
            height: 120,
            showLocationDate: true,
            location: 'Berlin',
            showDate: true,
            dateFormat: 'de-DE',
            locationFontFamily: 'Arial, sans-serif',
            signatureFontSize: 12,
            locationBold: false,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift des Mitglieds',
            belowTextFontFamily: 'Arial, sans-serif',
            belowTextFontSize: 11,
            belowTextBold: false,
            belowTextColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 4
          },
          
          // ==================== STUDIO UNTERSCHRIFT ====================
          {
            id: 306,
            type: 'subheading',
            x: 340,
            y: 220,
            width: 300,
            height: 25,
            content: 'Unterschrift Studio',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 5
          },
          {
            id: 307,
            type: 'signature',
            x: 340,
            y: 255,
            width: 300,
            height: 120,
            showLocationDate: true,
            location: 'Berlin',
            showDate: true,
            dateFormat: 'de-DE',
            locationFontFamily: 'Arial, sans-serif',
            signatureFontSize: 12,
            locationBold: false,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift Studiomitarbeiter',
            belowTextFontFamily: 'Arial, sans-serif',
            belowTextFontSize: 11,
            belowTextBold: false,
            belowTextColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 6
          },
          
          // Divider between signatures
          {
            id: 308,
            type: 'divider',
            x: 0,
            y: 400,
            width: 642,
            height: 1,
            lineColor: '#E5E7EB',
            lineStyle: 'dashed',
            visible: true,
            sortIndex: 7
          },
          
          // ==================== SEPA UNTERSCHRIFT ====================
          {
            id: 309,
            type: 'subheading',
            x: 0,
            y: 420,
            width: 642,
            height: 25,
            content: 'Unterschrift für SEPA-Lastschriftmandat',
            fontSize: 16,
            bold: true,
            color: '#374151',
            visible: true,
            sortIndex: 8
          },
          {
            id: 310,
            type: 'textarea',
            x: 0,
            y: 450,
            width: 642,
            height: 50,
            content: 'Falls der Kontoinhaber nicht mit dem Mitglied identisch ist, ist eine zusätzliche Unterschrift des Kontoinhabers erforderlich.',
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            italic: true,
            color: '#6B7280',
            alignment: 'left',
            visible: true,
            sortIndex: 9
          },
          {
            id: 311,
            type: 'signature',
            x: 0,
            y: 510,
            width: 300,
            height: 120,
            showLocationDate: true,
            location: 'Berlin',
            showDate: true,
            dateFormat: 'de-DE',
            locationFontFamily: 'Arial, sans-serif',
            signatureFontSize: 12,
            locationBold: false,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift Kontoinhaber',
            belowTextFontFamily: 'Arial, sans-serif',
            belowTextFontSize: 11,
            belowTextBold: false,
            belowTextColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 10
          },
          
          // ==================== VERTRAGSKOPIE INFO ====================
          {
            id: 312,
            type: 'rectangle',
            x: 0,
            y: 660,
            width: 642,
            height: 100,
            backgroundColor: '#ECFDF5',
            borderWidth: 2,
            borderColor: '#10B981',
            borderRadius: 8,
            visible: true,
            sortIndex: 101
          },
          {
            id: 313,
            type: 'textarea',
            x: 15,
            y: 675,
            width: 612,
            height: 70,
            content: '✓ Vertragskopie für das Mitglied\n\nDas Mitglied erhält eine Kopie dieses Vertrags. Bitte bewahren Sie diese sorgfältig auf. Bei Fragen stehen wir Ihnen gerne zur Verfügung.',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            color: '#065F46',
            alignment: 'left',
            lineHeight: 1.4,
            visible: true,
            sortIndex: 11
          },
          
          // Decorative triangle
          {
            id: 314,
            type: 'triangle',
            x: 590,
            y: 800,
            width: 50,
            height: 50,
            backgroundColor: '#FF843E',
            borderWidth: 0,
            rotation: 180,
            visible: true,
            sortIndex: 102
          },
          
          // Footer note
          {
            id: 315,
            type: 'textarea',
            x: 0,
            y: 880,
            width: 642,
            height: 60,
            content: 'FitnessPro Studio • Musterstraße 123 • 10115 Berlin\nTel: +49 30 12345678 • E-Mail: info@fitnesspro.de • Web: www.fitnesspro.de',
            fontSize: 10,
            fontFamily: 'Arial, sans-serif',
            color: '#9CA3AF',
            alignment: 'center',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 12
          }
        ]
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: new Date().toISOString()
  },
  
  // ============================================================================
  // CONTRACT FORM 2: PREMIUM MEMBERSHIP (Kompakter, eleganter)
  // ============================================================================
  {
    id: 2,
    name: "Premium Mitgliedschaft Kurzvertrag",
    globalHeader: {
      enabled: true,
      content: "★ PREMIUM MEMBERSHIP ★",
      fontSize: 12,
      alignment: 'center',
      bold: true,
      italic: false,
      showOnPages: 'first'
    },
    globalFooter: {
      enabled: true,
      content: "FitnessPro Studio • Premium Services",
      fontSize: 10,
      alignment: 'center',
      italic: true,
      showOnPages: 'all'
    },
    folders: [
      { id: 1, name: "Mitgliedsdaten", color: "#8B5CF6", expanded: true, sortIndex: 0 },
      { id: 2, name: "Styling", color: "#EC4899", expanded: false, sortIndex: 1 }
    ],
    pages: [
      {
        id: 1,
        title: "Premium Vertrag",
        backgroundImage: null,
        elements: [
          // Elegant header design with shapes
          {
            id: 1,
            type: 'rectangle',
            x: 0,
            y: 0,
            width: 642,
            height: 120,
            backgroundColor: '#7C3AED',
            borderWidth: 0,
            borderRadius: 0,
            visible: true,
            sortIndex: 100,
            folderId: 2
          },
          {
            id: 2,
            type: 'heading',
            x: 0,
            y: 30,
            width: 642,
            height: 50,
            content: 'PREMIUM MITGLIEDSCHAFT',
            fontSize: 32,
            fontFamily: 'Georgia, serif',
            bold: true,
            alignment: 'center',
            color: '#FFFFFF',
            visible: true,
            sortIndex: 0
          },
          {
            id: 3,
            type: 'subheading',
            x: 0,
            y: 75,
            width: 642,
            height: 25,
            content: 'Exklusiver Zugang zu allen Premium-Services',
            fontSize: 14,
            fontFamily: 'Georgia, serif',
            italic: true,
            alignment: 'center',
            color: '#E9D5FF',
            visible: true,
            sortIndex: 1
          },
          
          // Decorative circles
          {
            id: 4,
            type: 'circle',
            x: 20,
            y: 130,
            width: 20,
            height: 20,
            backgroundColor: '#8B5CF6',
            borderWidth: 0,
            visible: true,
            sortIndex: 101,
            folderId: 2
          },
          {
            id: 5,
            type: 'circle',
            x: 50,
            y: 130,
            width: 20,
            height: 20,
            backgroundColor: '#A78BFA',
            borderWidth: 0,
            visible: true,
            sortIndex: 102,
            folderId: 2
          },
          {
            id: 6,
            type: 'circle',
            x: 80,
            y: 130,
            width: 20,
            height: 20,
            backgroundColor: '#C4B5FD',
            borderWidth: 0,
            visible: true,
            sortIndex: 103,
            folderId: 2
          },
          
          // Member Data Section
          {
            id: 7,
            type: 'system-text',
            x: 0,
            y: 170,
            width: 200,
            height: 55,
            variable: 'Member ID',
            label: 'Mitglieds-ID',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 2,
            folderId: 1
          },
          {
            id: 8,
            type: 'text',
            x: 220,
            y: 170,
            width: 200,
            height: 55,
            variable: 'Member First Name',
            label: 'Vorname',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 3,
            folderId: 1
          },
          {
            id: 9,
            type: 'text',
            x: 440,
            y: 170,
            width: 200,
            height: 55,
            variable: 'Member Last Name',
            label: 'Nachname',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 4,
            folderId: 1
          },
          
          // Contract Info
          {
            id: 10,
            type: 'divider',
            x: 0,
            y: 240,
            width: 642,
            height: 2,
            lineColor: '#8B5CF6',
            lineStyle: 'dashed',
            visible: true,
            sortIndex: 5
          },
          {
            id: 11,
            type: 'system-text',
            x: 0,
            y: 260,
            width: 200,
            height: 55,
            variable: 'Contract Type',
            label: 'Vertragsart',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputBold: true,
            inputColor: '#7C3AED',
            visible: true,
            sortIndex: 6,
            folderId: 1
          },
          {
            id: 12,
            type: 'system-text',
            x: 220,
            y: 260,
            width: 200,
            height: 55,
            variable: 'Contract Cost',
            label: 'Monatsbeitrag',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 16,
            inputBold: true,
            inputColor: '#059669',
            visible: true,
            sortIndex: 7,
            folderId: 1
          },
          {
            id: 13,
            type: 'system-text',
            x: 440,
            y: 260,
            width: 200,
            height: 55,
            variable: 'Contract Start Date',
            label: 'Startdatum',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 8,
            folderId: 1
          },
          
          // Premium Benefits
          {
            id: 14,
            type: 'subheading',
            x: 0,
            y: 340,
            width: 642,
            height: 25,
            content: 'Ihre Premium-Vorteile',
            fontSize: 16,
            bold: true,
            color: '#7C3AED',
            visible: true,
            sortIndex: 9
          },
          {
            id: 15,
            type: 'textarea',
            x: 0,
            y: 375,
            width: 642,
            height: 120,
            content: '✓ Unbegrenzter Zugang zu allen Trainingsgeräten\n✓ Kostenlose Nutzung des Wellnessbereichs\n✓ Monatliche Personal Training Session inklusive\n✓ Zugang zur exklusiven Premium-Lounge\n✓ Priorität bei Kursbuchungen\n✓ 20% Rabatt auf alle Zusatzprodukte',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            color: '#374151',
            alignment: 'left',
            lineHeight: 1.6,
            listStyle: 'none',
            visible: true,
            sortIndex: 10
          },
          
          // Contact Info
          {
            id: 16,
            type: 'text',
            x: 0,
            y: 510,
            width: 300,
            height: 55,
            variable: 'Email Address',
            label: 'E-Mail',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 11,
            folderId: 1
          },
          {
            id: 17,
            type: 'text',
            x: 320,
            y: 510,
            width: 200,
            height: 55,
            variable: 'Mobile number',
            label: 'Telefon',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#7C3AED',
            inputFontSize: 14,
            inputColor: '#1F2937',
            required: true,
            visible: true,
            sortIndex: 12,
            folderId: 1
          },
          
          // Checkbox
          {
            id: 18,
            type: 'checkbox',
            x: 0,
            y: 590,
            width: 642,
            height: 60,
            label: 'Ich akzeptiere die Premium-Mitgliedschaftsbedingungen',
            showTitle: true,
            checkboxTitleSize: 13,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Inkl. AGB, Datenschutzerklärung und SEPA-Mandat',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 13
          },
          
          // Signatures side by side
          {
            id: 19,
            type: 'signature',
            x: 0,
            y: 680,
            width: 300,
            height: 100,
            showLocationDate: true,
            location: 'Berlin',
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 11,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'Mitglied',
            belowTextFontSize: 10,
            belowTextColor: '#7C3AED',
            belowTextBold: true,
            required: true,
            visible: true,
            sortIndex: 14
          },
          {
            id: 20,
            type: 'signature',
            x: 340,
            y: 680,
            width: 300,
            height: 100,
            showLocationDate: true,
            location: 'Berlin',
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 11,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'FitnessPro Studio',
            belowTextFontSize: 10,
            belowTextColor: '#7C3AED',
            belowTextBold: true,
            required: true,
            visible: true,
            sortIndex: 15
          },
          
          // Footer decoration
          {
            id: 21,
            type: 'rectangle',
            x: 0,
            y: 810,
            width: 642,
            height: 8,
            backgroundColor: '#7C3AED',
            borderWidth: 0,
            visible: true,
            sortIndex: 104,
            folderId: 2
          }
        ]
      }
    ],
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: new Date().toISOString()
  },
  
  // ============================================================================
  // CONTRACT FORM 3: TRIAL MEMBERSHIP (Probetraining)
  // ============================================================================
  {
    id: 3,
    name: "Probetraining Vereinbarung",
    globalHeader: {
      enabled: false
    },
    globalFooter: {
      enabled: true,
      content: "Gültig für 7 Tage ab Ausstellungsdatum",
      fontSize: 10,
      alignment: 'center',
      italic: true,
      showOnPages: 'all'
    },
    folders: [],
    pages: [
      {
        id: 1,
        title: "Probetraining",
        backgroundImage: null,
        elements: [
          // Header with accent
          {
            id: 1,
            type: 'rectangle',
            x: 0,
            y: 0,
            width: 642,
            height: 80,
            backgroundColor: '#059669',
            borderWidth: 0,
            visible: true,
            sortIndex: 100
          },
          {
            id: 2,
            type: 'heading',
            x: 0,
            y: 20,
            width: 642,
            height: 45,
            content: '🏋️ KOSTENLOSES PROBETRAINING',
            fontSize: 26,
            bold: true,
            alignment: 'center',
            color: '#FFFFFF',
            visible: true,
            sortIndex: 0
          },
          
          // Welcome text
          {
            id: 3,
            type: 'textarea',
            x: 0,
            y: 100,
            width: 642,
            height: 60,
            content: 'Herzlich willkommen bei FitnessPro! Wir freuen uns, dass Sie uns testen möchten. Bitte füllen Sie das folgende Formular aus, um Ihr kostenloses Probetraining zu starten.',
            fontSize: 13,
            color: '#374151',
            alignment: 'center',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 1
          },
          
          // Personal data
          {
            id: 4,
            type: 'text',
            x: 0,
            y: 180,
            width: 100,
            height: 55,
            variable: 'Salutation',
            label: 'Anrede',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 2
          },
          {
            id: 5,
            type: 'text',
            x: 120,
            y: 180,
            width: 250,
            height: 55,
            variable: 'Member First Name',
            label: 'Vorname',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 3
          },
          {
            id: 6,
            type: 'text',
            x: 390,
            y: 180,
            width: 250,
            height: 55,
            variable: 'Member Last Name',
            label: 'Nachname',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 4
          },
          
          // Contact
          {
            id: 7,
            type: 'text',
            x: 0,
            y: 250,
            width: 300,
            height: 55,
            variable: 'Email Address',
            label: 'E-Mail-Adresse',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 5
          },
          {
            id: 8,
            type: 'text',
            x: 320,
            y: 250,
            width: 200,
            height: 55,
            variable: 'Mobile number',
            label: 'Telefonnummer',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 6
          },
          
          // Date of birth
          {
            id: 9,
            type: 'text',
            x: 0,
            y: 320,
            width: 200,
            height: 55,
            variable: 'Date of Birth',
            label: 'Geburtsdatum',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 7
          },
          
          // Divider
          {
            id: 10,
            type: 'divider',
            x: 0,
            y: 395,
            width: 642,
            height: 2,
            lineColor: '#10B981',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 8
          },
          
          // Health disclaimer
          {
            id: 11,
            type: 'subheading',
            x: 0,
            y: 415,
            width: 642,
            height: 25,
            content: 'Gesundheitserklärung',
            fontSize: 16,
            bold: true,
            color: '#059669',
            visible: true,
            sortIndex: 9
          },
          {
            id: 12,
            type: 'checkbox',
            x: 0,
            y: 450,
            width: 642,
            height: 70,
            label: 'Ich bestätige, dass ich körperlich gesund bin',
            showTitle: true,
            checkboxTitleSize: 13,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Mir sind keine gesundheitlichen Einschränkungen bekannt, die gegen ein Fitnesstraining sprechen. Im Zweifel habe ich meinen Arzt konsultiert.',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 10
          },
          {
            id: 13,
            type: 'checkbox',
            x: 0,
            y: 530,
            width: 642,
            height: 60,
            label: 'Ich akzeptiere die Hausordnung und Sicherheitsregeln',
            showTitle: true,
            checkboxTitleSize: 13,
            titleBold: true,
            titleColor: '#1F2937',
            showDescription: true,
            description: 'Ich verpflichte mich, die Anweisungen des Personals zu befolgen.',
            checkboxDescriptionSize: 11,
            descriptionColor: '#6B7280',
            required: true,
            visible: true,
            sortIndex: 11
          },
          {
            id: 14,
            type: 'checkbox',
            x: 0,
            y: 600,
            width: 642,
            height: 50,
            label: 'Ich möchte Informationen zu Mitgliedschaften erhalten',
            showTitle: true,
            checkboxTitleSize: 13,
            titleBold: false,
            titleColor: '#6B7280',
            showDescription: false,
            required: false,
            visible: true,
            sortIndex: 12
          },
          
          // Signature
          {
            id: 15,
            type: 'signature',
            x: 0,
            y: 680,
            width: 320,
            height: 100,
            showLocationDate: true,
            location: '',
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 12,
            locationColor: '#374151',
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift Interessent',
            belowTextFontSize: 11,
            belowTextColor: '#059669',
            belowTextBold: true,
            required: true,
            visible: true,
            sortIndex: 13
          },
          
          // Info box
          {
            id: 16,
            type: 'rectangle',
            x: 360,
            y: 680,
            width: 280,
            height: 100,
            backgroundColor: '#D1FAE5',
            borderWidth: 2,
            borderColor: '#059669',
            borderRadius: 8,
            visible: true,
            sortIndex: 101
          },
          {
            id: 17,
            type: 'textarea',
            x: 375,
            y: 695,
            width: 250,
            height: 70,
            content: '📞 Fragen?\nRufen Sie uns an:\n+49 30 12345678\n\noder schreiben Sie an:\ninfo@fitnesspro.de',
            fontSize: 11,
            color: '#065F46',
            alignment: 'left',
            lineHeight: 1.3,
            visible: true,
            sortIndex: 14
          },
          
          // Footer decoration
          {
            id: 18,
            type: 'semicircle',
            x: 271,
            y: 820,
            width: 100,
            height: 50,
            backgroundColor: '#059669',
            borderWidth: 0,
            rotation: 180,
            visible: true,
            sortIndex: 102
          }
        ]
      }
    ],
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: new Date().toISOString()
  },
  
  // ============================================================================
  // CONTRACT FORM 4: SEPA MANDATE ONLY (Separates SEPA-Mandat)
  // ============================================================================
  {
    id: 4,
    name: "SEPA-Lastschriftmandat",
    globalHeader: {
      enabled: true,
      content: "SEPA-LASTSCHRIFTMANDAT",
      fontSize: 14,
      alignment: 'center',
      bold: true,
      showOnPages: 'all'
    },
    globalFooter: {
      enabled: true,
      content: "Mandatsreferenz: {SEPA mandate reference}",
      fontSize: 10,
      alignment: 'left',
      italic: true,
      showOnPages: 'all'
    },
    folders: [
      { id: 1, name: "Gläubiger", color: "#3B82F6", expanded: true, sortIndex: 0 },
      { id: 2, name: "Zahler", color: "#10B981", expanded: true, sortIndex: 1 }
    ],
    pages: [
      {
        id: 1,
        title: "SEPA Mandat",
        backgroundImage: null,
        elements: [
          // Header
          {
            id: 1,
            type: 'heading',
            x: 0,
            y: 10,
            width: 642,
            height: 40,
            content: 'SEPA-LASTSCHRIFTMANDAT',
            fontSize: 24,
            bold: true,
            alignment: 'center',
            color: '#1E40AF',
            visible: true,
            sortIndex: 0
          },
          {
            id: 2,
            type: 'subheading',
            x: 0,
            y: 50,
            width: 642,
            height: 20,
            content: 'SEPA Direct Debit Mandate',
            fontSize: 12,
            italic: true,
            alignment: 'center',
            color: '#6B7280',
            visible: true,
            sortIndex: 1
          },
          {
            id: 3,
            type: 'divider',
            x: 0,
            y: 80,
            width: 642,
            height: 3,
            lineColor: '#1E40AF',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 2
          },
          
          // Gläubiger Section
          {
            id: 4,
            type: 'subheading',
            x: 0,
            y: 100,
            width: 642,
            height: 25,
            content: 'Gläubiger / Creditor',
            fontSize: 14,
            bold: true,
            color: '#1E40AF',
            visible: true,
            sortIndex: 3,
            folderId: 1
          },
          {
            id: 5,
            type: 'textarea',
            x: 0,
            y: 130,
            width: 320,
            height: 100,
            content: 'FitnessPro GmbH\nMusterstraße 123\n10115 Berlin\nDeutschland',
            fontSize: 12,
            color: '#374151',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 4,
            folderId: 1
          },
          {
            id: 6,
            type: 'textarea',
            x: 340,
            y: 130,
            width: 300,
            height: 100,
            content: 'Gläubiger-Identifikationsnummer:\nDE98ZZZ09999999999\n\nTel: +49 30 12345678\nE-Mail: info@fitnesspro.de',
            fontSize: 11,
            color: '#6B7280',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 5,
            folderId: 1
          },
          
          // Mandatsreferenz
          {
            id: 7,
            type: 'system-text',
            x: 0,
            y: 245,
            width: 300,
            height: 55,
            variable: 'SEPA mandate reference',
            label: 'Mandatsreferenz / Mandate Reference',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#1E40AF',
            inputFontSize: 14,
            inputFontFamily: "'Courier New', monospace",
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 6,
            folderId: 1
          },
          
          // Zahler Section
          {
            id: 8,
            type: 'divider',
            x: 0,
            y: 320,
            width: 642,
            height: 1,
            lineColor: '#E5E7EB',
            lineStyle: 'dashed',
            visible: true,
            sortIndex: 7
          },
          {
            id: 9,
            type: 'subheading',
            x: 0,
            y: 340,
            width: 642,
            height: 25,
            content: 'Zahlungspflichtiger / Debtor',
            fontSize: 14,
            bold: true,
            color: '#059669',
            visible: true,
            sortIndex: 8,
            folderId: 2
          },
          {
            id: 10,
            type: 'text',
            x: 0,
            y: 375,
            width: 400,
            height: 55,
            variable: 'Member first name and last name (account holder)',
            label: 'Name des Kontoinhabers / Account Holder Name',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 9,
            folderId: 2
          },
          {
            id: 11,
            type: 'text',
            x: 0,
            y: 445,
            width: 300,
            height: 55,
            variable: 'Street',
            label: 'Straße / Street',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 10,
            folderId: 2
          },
          {
            id: 12,
            type: 'text',
            x: 320,
            y: 445,
            width: 100,
            height: 55,
            variable: 'House Number',
            label: 'Nr.',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 11,
            folderId: 2
          },
          {
            id: 13,
            type: 'text',
            x: 440,
            y: 445,
            width: 100,
            height: 55,
            variable: 'ZIP Code',
            label: 'PLZ',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 12,
            folderId: 2
          },
          {
            id: 14,
            type: 'text',
            x: 560,
            y: 445,
            width: 80,
            height: 55,
            variable: 'City',
            label: 'Ort',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 13,
            folderId: 2
          },
          
          // Bank Details
          {
            id: 15,
            type: 'text',
            x: 0,
            y: 515,
            width: 400,
            height: 55,
            variable: 'Credit institution',
            label: 'Kreditinstitut / Credit Institution',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 14,
            folderId: 2
          },
          {
            id: 16,
            type: 'text',
            x: 0,
            y: 585,
            width: 400,
            height: 55,
            variable: 'IBAN',
            label: 'IBAN',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            inputFontFamily: "'Courier New', monospace",
            inputCapsLock: true,
            required: true,
            visible: true,
            sortIndex: 15,
            folderId: 2
          },
          {
            id: 17,
            type: 'text',
            x: 420,
            y: 585,
            width: 220,
            height: 55,
            variable: 'BIC',
            label: 'BIC / SWIFT',
            showTitle: true,
            labelFontSize: 11,
            labelBold: true,
            labelColor: '#059669',
            inputFontSize: 14,
            inputFontFamily: "'Courier New', monospace",
            inputCapsLock: true,
            required: true,
            visible: true,
            sortIndex: 16,
            folderId: 2
          },
          
          // Mandate Text
          {
            id: 18,
            type: 'rectangle',
            x: 0,
            y: 660,
            width: 642,
            height: 130,
            backgroundColor: '#EFF6FF',
            borderWidth: 1,
            borderColor: '#3B82F6',
            borderRadius: 6,
            visible: true,
            sortIndex: 100
          },
          {
            id: 19,
            type: 'textarea',
            x: 15,
            y: 675,
            width: 612,
            height: 100,
            content: 'Ich ermächtige den oben genannten Gläubiger, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von diesem Gläubiger auf mein Konto gezogenen Lastschriften einzulösen.\n\nHinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen.',
            fontSize: 10,
            color: '#1E40AF',
            lineHeight: 1.4,
            visible: true,
            sortIndex: 17
          },
          
          // Signature
          {
            id: 20,
            type: 'signature',
            x: 0,
            y: 810,
            width: 320,
            height: 100,
            showLocationDate: true,
            location: '',
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 12,
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift des Kontoinhabers / Signature',
            belowTextFontSize: 10,
            belowTextColor: '#1E40AF',
            required: true,
            visible: true,
            sortIndex: 18
          }
        ]
      }
    ],
    createdAt: "2024-04-01T12:00:00Z",
    updatedAt: new Date().toISOString()
  },
  
  // ============================================================================
  // CONTRACT FORM 5: CORPORATE MEMBERSHIP (Firmenmitgliedschaft)
  // ============================================================================
  {
    id: 5,
    name: "Firmenmitgliedschaft Vertrag",
    globalHeader: {
      enabled: true,
      content: "CORPORATE MEMBERSHIP • B2B Contract",
      fontSize: 11,
      alignment: 'right',
      bold: false,
      italic: true,
      showOnPages: 'all'
    },
    globalFooter: {
      enabled: true,
      content: "Vertragsnr.: {Member ID} • Gültig ab: {Contract Start Date}",
      fontSize: 10,
      alignment: 'center',
      showOnPages: 'all'
    },
    folders: [
      { id: 1, name: "Firmendaten", color: "#F97316", expanded: true, sortIndex: 0 },
      { id: 2, name: "Ansprechpartner", color: "#3B82F6", expanded: true, sortIndex: 1 },
      { id: 3, name: "Konditionen", color: "#10B981", expanded: true, sortIndex: 2 }
    ],
    pages: [
      {
        id: 1,
        title: "Firmenmitgliedschaft",
        backgroundImage: null,
        elements: [
          // Corporate Header Design
          {
            id: 1,
            type: 'rectangle',
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            backgroundColor: '#F97316',
            borderWidth: 0,
            visible: true,
            sortIndex: 100
          },
          {
            id: 2,
            type: 'triangle',
            x: 200,
            y: 0,
            width: 100,
            height: 100,
            backgroundColor: '#F97316',
            borderWidth: 0,
            rotation: 90,
            visible: true,
            sortIndex: 101
          },
          {
            id: 3,
            type: 'heading',
            x: 15,
            y: 25,
            width: 270,
            height: 50,
            content: 'CORPORATE\nMEMBERSHIP',
            fontSize: 22,
            bold: true,
            color: '#FFFFFF',
            visible: true,
            sortIndex: 0
          },
          {
            id: 4,
            type: 'image',
            x: 450,
            y: 10,
            width: 180,
            height: 80,
            src: null,
            visible: true,
            sortIndex: 1
          },
          
          // Contract number
          {
            id: 5,
            type: 'system-text',
            x: 0,
            y: 120,
            width: 200,
            height: 50,
            variable: 'Member ID',
            label: 'Vertragsnummer',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#F97316',
            inputFontSize: 14,
            inputBold: true,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 2,
            folderId: 1
          },
          {
            id: 6,
            type: 'system-text',
            x: 220,
            y: 120,
            width: 200,
            height: 50,
            variable: 'Contract Start Date',
            label: 'Vertragsbeginn',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#F97316',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 3,
            folderId: 3
          },
          {
            id: 7,
            type: 'system-text',
            x: 440,
            y: 120,
            width: 200,
            height: 50,
            variable: 'Minimum Term',
            label: 'Laufzeit',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#F97316',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 4,
            folderId: 3
          },
          
          // Company Info Section
          {
            id: 8,
            type: 'divider',
            x: 0,
            y: 185,
            width: 642,
            height: 2,
            lineColor: '#F97316',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 5
          },
          {
            id: 9,
            type: 'subheading',
            x: 0,
            y: 200,
            width: 300,
            height: 25,
            content: 'Firmendaten',
            fontSize: 14,
            bold: true,
            color: '#F97316',
            visible: true,
            sortIndex: 6,
            folderId: 1
          },
          // Using Member fields for company data
          {
            id: 10,
            type: 'text',
            x: 0,
            y: 235,
            width: 400,
            height: 50,
            variable: 'Member First Name',
            label: 'Firmenname',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 7,
            folderId: 1
          },
          {
            id: 11,
            type: 'text',
            x: 0,
            y: 295,
            width: 350,
            height: 50,
            variable: 'Street',
            label: 'Straße',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 8,
            folderId: 1
          },
          {
            id: 12,
            type: 'text',
            x: 370,
            y: 295,
            width: 80,
            height: 50,
            variable: 'House Number',
            label: 'Nr.',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 9,
            folderId: 1
          },
          {
            id: 13,
            type: 'text',
            x: 470,
            y: 295,
            width: 80,
            height: 50,
            variable: 'ZIP Code',
            label: 'PLZ',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 10,
            folderId: 1
          },
          {
            id: 14,
            type: 'text',
            x: 560,
            y: 295,
            width: 80,
            height: 50,
            variable: 'City',
            label: 'Ort',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 11,
            folderId: 1
          },
          
          // Contact Person
          {
            id: 15,
            type: 'subheading',
            x: 0,
            y: 365,
            width: 300,
            height: 25,
            content: 'Ansprechpartner',
            fontSize: 14,
            bold: true,
            color: '#3B82F6',
            visible: true,
            sortIndex: 12,
            folderId: 2
          },
          {
            id: 16,
            type: 'text',
            x: 0,
            y: 400,
            width: 80,
            height: 50,
            variable: 'Salutation',
            label: 'Anrede',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 13,
            folderId: 2
          },
          {
            id: 17,
            type: 'text',
            x: 100,
            y: 400,
            width: 200,
            height: 50,
            variable: 'Member Last Name',
            label: 'Name Ansprechpartner',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 14,
            folderId: 2
          },
          {
            id: 18,
            type: 'text',
            x: 320,
            y: 400,
            width: 200,
            height: 50,
            variable: 'Email Address',
            label: 'E-Mail',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 15,
            folderId: 2
          },
          {
            id: 19,
            type: 'text',
            x: 540,
            y: 400,
            width: 100,
            height: 50,
            variable: 'Telephone number',
            label: 'Telefon',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            required: true,
            visible: true,
            sortIndex: 16,
            folderId: 2
          },
          
          // Pricing Section
          {
            id: 20,
            type: 'divider',
            x: 0,
            y: 470,
            width: 642,
            height: 2,
            lineColor: '#10B981',
            lineStyle: 'solid',
            visible: true,
            sortIndex: 17
          },
          {
            id: 21,
            type: 'subheading',
            x: 0,
            y: 485,
            width: 300,
            height: 25,
            content: 'Vertragskonditionen',
            fontSize: 14,
            bold: true,
            color: '#10B981',
            visible: true,
            sortIndex: 18,
            folderId: 3
          },
          {
            id: 22,
            type: 'system-text',
            x: 0,
            y: 520,
            width: 200,
            height: 50,
            variable: 'Contract Type',
            label: 'Tarifmodell',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputBold: true,
            inputColor: '#10B981',
            visible: true,
            sortIndex: 19,
            folderId: 3
          },
          {
            id: 23,
            type: 'system-text',
            x: 220,
            y: 520,
            width: 200,
            height: 50,
            variable: 'Contract Cost',
            label: 'Monatsbeitrag pro Mitarbeiter',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 16,
            inputBold: true,
            inputColor: '#10B981',
            visible: true,
            sortIndex: 20,
            folderId: 3
          },
          {
            id: 24,
            type: 'system-text',
            x: 440,
            y: 520,
            width: 200,
            height: 50,
            variable: 'Termination Notice Period',
            label: 'Kündigungsfrist',
            showTitle: true,
            labelFontSize: 10,
            labelBold: true,
            labelColor: '#374151',
            inputFontSize: 14,
            inputColor: '#1F2937',
            visible: true,
            sortIndex: 21,
            folderId: 3
          },
          
          // Leistungen
          {
            id: 25,
            type: 'textarea',
            x: 0,
            y: 590,
            width: 642,
            height: 100,
            content: 'Inkludierte Leistungen:\n• Unbegrenzter Zugang für alle eingetragenen Mitarbeiter\n• Kostenlose Einweisung für jeden neuen Nutzer\n• Monatliche Nutzungsstatistiken\n• Dedizierter Ansprechpartner für Ihr Unternehmen\n• Flexible An-/Abmeldung von Mitarbeitern',
            fontSize: 11,
            color: '#374151',
            lineHeight: 1.5,
            visible: true,
            sortIndex: 22
          },
          
          // Checkboxes
          {
            id: 26,
            type: 'checkbox',
            x: 0,
            y: 700,
            width: 642,
            height: 50,
            label: 'Wir akzeptieren die AGB für Firmenkunden',
            showTitle: true,
            checkboxTitleSize: 12,
            titleBold: true,
            showDescription: false,
            required: true,
            visible: true,
            sortIndex: 23
          },
          {
            id: 27,
            type: 'checkbox',
            x: 0,
            y: 755,
            width: 642,
            height: 50,
            label: 'Wir erteilen das SEPA-Lastschriftmandat',
            showTitle: true,
            checkboxTitleSize: 12,
            titleBold: true,
            showDescription: false,
            required: true,
            visible: true,
            sortIndex: 24
          },
          
          // Signatures
          {
            id: 28,
            type: 'signature',
            x: 0,
            y: 820,
            width: 300,
            height: 90,
            showLocationDate: true,
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 11,
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift Auftraggeber (Firma)',
            belowTextFontSize: 10,
            belowTextColor: '#F97316',
            required: true,
            visible: true,
            sortIndex: 25
          },
          {
            id: 29,
            type: 'signature',
            x: 340,
            y: 820,
            width: 300,
            height: 90,
            showLocationDate: true,
            showDate: true,
            dateFormat: 'de-DE',
            signatureFontSize: 11,
            showBelowSignature: true,
            belowSignatureText: 'Unterschrift FitnessPro Studio',
            belowTextFontSize: 10,
            belowTextColor: '#F97316',
            required: true,
            visible: true,
            sortIndex: 26
          }
        ]
      }
    ],
    createdAt: "2024-05-15T09:00:00Z",
    updatedAt: new Date().toISOString()
  }
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
    pages: [
      { 
        id: 1, 
        title: "Welcome to FitnessPro", 
        content: `<h2><span style="color: #FF6B35;">Welcome to FitnessPro Studio! 🎉</span></h2>
<p><br></p>
<p>We're thrilled to have you join our fitness family! This guide will help you get started on your journey to a healthier, stronger you.</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=300&fit=crop" alt="Gym Welcome"></p>
<p><br></p>
<p><strong>What to expect:</strong></p>
<ul>
<li>✅ State-of-the-art equipment</li>
<li>✅ Professional trainers ready to help</li>
<li>✅ Clean and welcoming environment</li>
<li>✅ Personalized training programs</li>
</ul>`
      },
      { 
        id: 2, 
        title: "Your First Visit", 
        content: `<h2><span style="color: #FF6B35;">Your First Visit Checklist</span></h2>
<p><br></p>
<p>Here's everything you need to know before your first workout:</p>
<p><br></p>
<p><strong><span style="font-size: 18px;">📋 What to Bring:</span></strong></p>
<ul>
<li><strong>Comfortable workout clothes</strong></li>
<li><strong>Clean indoor sports shoes</strong></li>
<li><strong>Water bottle</strong></li>
<li><strong>Small towel</strong></li>
<li><strong>Lock for locker</strong> (or rent one at reception)</li>
</ul>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=250&fit=crop" alt="Workout gear"></p>
<p><br></p>
<p><em><span style="color: #666666;">Pro tip: Arrive 15 minutes early for your first session!</span></em></p>`
      },
      { 
        id: 3, 
        title: "Meet Your Team", 
        content: `<h2><span style="color: #FF6B35;">Your Support Team</span></h2>
<p><br></p>
<p>Our dedicated team is here to support your fitness journey every step of the way.</p>
<p><br></p>
<p><strong>🏋️ Max Schmidt</strong> - Head Trainer</p>
<p><span style="color: #666666;">Specializes in strength training and body transformation</span></p>
<p><br></p>
<p><strong>💪 Lisa Müller</strong> - Fitness Coach</p>
<p><span style="color: #666666;">Expert in group classes and motivation</span></p>
<p><br></p>
<p><strong>🥗 Anna Weber</strong> - Nutritionist</p>
<p><span style="color: #666666;">Certified nutrition expert for your dietary needs</span></p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=250&fit=crop" alt="Team"></p>
<p><br></p>
<p><strong>Don't hesitate to ask for help!</strong> Our team loves helping members reach their goals.</p>`
      },
      { 
        id: 4, 
        title: "Contact & Hours", 
        content: `<h2><span style="color: #FF6B35;">📍 Contact & Opening Hours</span></h2>
<p><br></p>
<p><strong><span style="font-size: 18px;">📞 Contact Information</span></strong></p>
<ul>
<li><strong>Phone:</strong> +49 30 12345678</li>
<li><strong>Email:</strong> info@fitnesspro.de</li>
<li><strong>Address:</strong> Musterstraße 123, 10115 Berlin</li>
</ul>
<p><br></p>
<p><strong><span style="font-size: 18px;">🕐 Opening Hours</span></strong></p>
<ul>
<li><strong>Monday - Friday:</strong> 06:00 - 22:00</li>
<li><strong>Saturday:</strong> 08:00 - 20:00</li>
<li><strong>Sunday:</strong> 09:00 - 18:00</li>
</ul>
<p><br></p>
<p><span style="color: #4caf50;"><strong>💡 Tip:</strong> Download our app to book classes and track your progress!</span></p>`
      }
    ]
  },
  {
    id: 2,
    name: "Training Basics",
    pages: [
      { 
        id: 1, 
        title: "Getting Started", 
        content: `<h2><span style="color: #2196F3;">Training Basics 💪</span></h2>
<p><br></p>
<p>Whether you're new to fitness or getting back into it, these fundamentals will set you up for success.</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&h=280&fit=crop" alt="Training"></p>
<p><br></p>
<p><strong><span style="font-size: 18px;">The 3 Pillars of Fitness:</span></strong></p>
<p><br></p>
<p>🏋️ <strong>Strength</strong> - Build muscle and increase power</p>
<p>❤️ <strong>Cardio</strong> - Improve heart health and endurance</p>
<p>🧘 <strong>Flexibility</strong> - Enhance mobility and prevent injury</p>`
      },
      { 
        id: 2, 
        title: "Warm-Up Guide", 
        content: `<h2><span style="color: #2196F3;">🔥 Proper Warm-Up</span></h2>
<p><br></p>
<p><strong>Never skip your warm-up!</strong> It prepares your body for exercise and prevents injuries.</p>
<p><br></p>
<p><strong><span style="color: #f57c00;">⏱️ 5-Minute Dynamic Warm-Up:</span></strong></p>
<ol>
<li><strong>Jumping Jacks</strong> - 1 minute</li>
<li><strong>Arm Circles</strong> - 30 seconds each direction</li>
<li><strong>Leg Swings</strong> - 30 seconds each leg</li>
<li><strong>Hip Rotations</strong> - 30 seconds</li>
<li><strong>Light Jogging</strong> - 1 minute</li>
<li><strong>Dynamic Stretches</strong> - 1 minute</li>
</ol>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=200&fit=crop" alt="Stretching"></p>`
      },
      { 
        id: 3, 
        title: "Exercise Form", 
        content: `<h2><span style="color: #2196F3;">✅ Proper Exercise Form</span></h2>
<p><br></p>
<p>Good form is <em>everything</em>. It maximizes results and prevents injuries.</p>
<p><br></p>
<p><strong>🦵 Squats</strong></p>
<p><span style="color: #666666;">Keep knees aligned with toes, back straight, chest up</span></p>
<p><br></p>
<p><strong>🏋️ Deadlifts</strong></p>
<p><span style="color: #666666;">Neutral spine, engage core, push through heels</span></p>
<p><br></p>
<p><strong>💪 Bench Press</strong></p>
<p><span style="color: #666666;">Feet flat, shoulder blades pinched, controlled movement</span></p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=250&fit=crop" alt="Exercise"></p>
<p><br></p>
<p><em><span style="color: #666666;">Ask a trainer if you're unsure about any exercise!</span></em></p>`
      },
      { 
        id: 4, 
        title: "Recovery Tips", 
        content: `<h2><span style="color: #2196F3;">😴 Recovery & Rest</span></h2>
<p><br></p>
<p>Your muscles grow during rest, not during workouts. Recovery is just as important as training!</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=200&fit=crop" alt="Recovery"></p>
<p><br></p>
<p><strong><span style="font-size: 18px;">Recovery Essentials:</span></strong></p>
<ul>
<li>💤 <strong>Sleep 7-9 hours</strong> per night</li>
<li>💧 <strong>Stay hydrated</strong> - aim for 2-3L water daily</li>
<li>🥗 <strong>Eat protein</strong> within 2 hours post-workout</li>
<li>🧘 <strong>Stretch & foam roll</strong> on rest days</li>
<li>📅 <strong>Take 1-2 rest days</strong> per week</li>
</ul>
<p><br></p>
<p><span style="color: #2e7d32;"><strong>Remember:</strong> Overtraining leads to injury and burnout. Listen to your body!</span></p>`
      }
    ]
  },
  {
    id: 3,
    name: "Studio Rules",
    pages: [
      { 
        id: 1, 
        title: "General Rules", 
        content: `<h2><span style="color: #9C27B0;">📜 Studio Rules & Etiquette</span></h2>
<p><br></p>
<p>To ensure everyone has a great experience, please follow these guidelines.</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=250&fit=crop" alt="Gym"></p>
<p><br></p>
<p><strong><span style="color: #7b1fa2;">🏆 Golden Rules:</span></strong></p>
<ul>
<li>Always <strong>wipe down equipment</strong> after use</li>
<li><strong>Re-rack weights</strong> when finished</li>
<li>Use a <strong>towel on benches</strong></li>
<li>Respect <strong>time limits</strong> during peak hours</li>
<li>Keep <strong>noise levels</strong> appropriate</li>
</ul>`
      },
      { 
        id: 2, 
        title: "Equipment Usage", 
        content: `<h2><span style="color: #9C27B0;">🏋️ Equipment Guidelines</span></h2>
<p><br></p>
<p><strong><span style="color: #7b1fa2;">✅ DO:</span></strong></p>
<ul>
<li>Ask staff if you don't know how to use equipment</li>
<li>Use clips/collars on barbells</li>
<li>Share equipment during busy times</li>
<li>Report damaged equipment immediately</li>
</ul>
<p><br></p>
<p><strong><span style="color: #c62828;">❌ DON'T:</span></strong></p>
<ul>
<li>Drop weights unnecessarily</li>
<li>Hog multiple machines at once</li>
<li>Leave weights on the floor</li>
<li>Use phone calls on the workout floor</li>
</ul>
<p><br></p>
<p><em><span style="color: #666666;">30-minute time limit on cardio machines during peak hours (5-8 PM)</span></em></p>`
      },
      { 
        id: 3, 
        title: "Locker Rooms", 
        content: `<h2><span style="color: #9C27B0;">🚿 Locker Room Etiquette</span></h2>
<p><br></p>
<p>Keep our changing areas clean and comfortable for everyone.</p>
<p><br></p>
<p>🔒 <strong>Use a lock</strong> - Don't leave valuables unsecured</p>
<p><br></p>
<p>⏰ <strong>Be quick</strong> - Limit time during peak hours</p>
<p><br></p>
<p>🧹 <strong>Stay tidy</strong> - Clean up after yourself</p>
<p><br></p>
<p>📵 <strong>No phones</strong> - Respect others' privacy</p>
<p><br></p>
<p><span style="color: #e65100;"><strong>⚠️ Note:</strong> Lockers must be emptied daily. Overnight items may be removed.</span></p>`
      }
    ]
  },
  {
    id: 4,
    name: "Nutrition Guide",
    pages: [
      { 
        id: 1, 
        title: "Nutrition Basics", 
        content: `<h2><span style="color: #4CAF50;">🥗 Nutrition Fundamentals</span></h2>
<p><br></p>
<p><strong>You can't out-train a bad diet!</strong> Nutrition is 70% of your results.</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=280&fit=crop" alt="Healthy Food"></p>
<p><br></p>
<p><strong><span style="font-size: 18px;">The Macronutrients:</span></strong></p>
<p><br></p>
<p>🥩 <strong><span style="color: #c62828;">Protein</span></strong> - Builds and repairs muscle tissue</p>
<p><br></p>
<p>🍞 <strong><span style="color: #f57f17;">Carbs</span></strong> - Primary energy source for workouts</p>
<p><br></p>
<p>🥑 <strong><span style="color: #2e7d32;">Fats</span></strong> - Essential for hormone health</p>`
      },
      { 
        id: 2, 
        title: "Pre & Post Workout", 
        content: `<h2><span style="color: #4CAF50;">⚡ Workout Nutrition</span></h2>
<p><br></p>
<p><strong><span style="color: #2e7d32;">🔋 PRE-WORKOUT (1-2 hours before)</span></strong></p>
<p>Fuel your workout with carbs + protein:</p>
<ul>
<li>🍌 Banana + Peanut Butter</li>
<li>🥣 Oatmeal + Berries</li>
<li>🍞 Toast + Eggs</li>
</ul>
<p><br></p>
<p><strong><span style="color: #e65100;">🔄 POST-WORKOUT (within 30-60 min)</span></strong></p>
<p>Recover with protein + carbs:</p>
<ul>
<li>🥤 Protein Shake + Banana</li>
<li>🍗 Chicken + Rice</li>
<li>🥚 Eggs + Sweet Potato</li>
</ul>
<p><br></p>
<p><em><span style="color: #666666;">Aim for 20-40g protein post-workout for optimal recovery!</span></em></p>`
      },
      { 
        id: 3, 
        title: "Hydration", 
        content: `<h2><span style="color: #4CAF50;">💧 Stay Hydrated!</span></h2>
<p><br></p>
<p>Even mild dehydration can significantly impact your performance.</p>
<p><br></p>
<p><strong><span style="color: #1565c0; font-size: 24px;">💧 2-3 Liters Daily</span></strong></p>
<p><span style="color: #1976d2;">Your daily water intake goal</span></p>
<p><br></p>
<p><strong><span style="font-size: 18px;">Hydration Schedule:</span></strong></p>
<ul>
<li>🌅 <strong>Morning:</strong> 500ml upon waking</li>
<li>🏋️ <strong>Before workout:</strong> 500ml (2 hours before)</li>
<li>💦 <strong>During workout:</strong> 200ml every 15-20 min</li>
<li>✅ <strong>After workout:</strong> 500ml+ to replenish</li>
</ul>
<p><br></p>
<p><span style="color: #0277bd;"><strong>Pro tip:</strong> If your urine is dark yellow, you need more water!</span></p>`
      }
    ]
  },
  {
    id: 5,
    name: "Group Classes",
    pages: [
      { 
        id: 1, 
        title: "Available Classes", 
        content: `<h2><span style="color: #E91E63;">🗓️ Group Fitness Classes</span></h2>
<p><br></p>
<p>Join our energetic group classes led by certified instructors!</p>
<p><br></p>
<p><img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=250&fit=crop" alt="Group fitness"></p>
<p><br></p>
<p><strong><span style="font-size: 18px;">Our Classes:</span></strong></p>
<p><br></p>
<p>🚴 <strong>Spinning</strong> - High intensity cardio cycling</p>
<p><br></p>
<p>🧘 <strong>Yoga</strong> - All levels, focus on flexibility and mindfulness</p>
<p><br></p>
<p>💪 <strong>HIIT</strong> - High-intensity interval training for fat burning</p>
<p><br></p>
<p>🥊 <strong>Boxing</strong> - Cardio kickboxing and strength training</p>`
      },
      { 
        id: 2, 
        title: "How to Book", 
        content: `<h2><span style="color: #E91E63;">📱 Booking Classes</span></h2>
<p><br></p>
<p>Reserving your spot is quick and easy!</p>
<p><br></p>
<p><strong><span style="color: #c2185b; font-size: 18px;">3 Easy Steps:</span></strong></p>
<p><br></p>
<p><strong>1.</strong> <strong>Open our app</strong> or visit the reception desk</p>
<p><br></p>
<p><strong>2.</strong> <strong>Select your class</strong> and preferred time slot</p>
<p><br></p>
<p><strong>3.</strong> <strong>Confirm booking</strong> - you'll receive a reminder!</p>
<p><br></p>
<p><span style="color: #f57f17;"><strong>⚠️ Cancellation Policy:</strong> Please cancel at least 4 hours before class to avoid penalties.</span></p>`
      }
    ]
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
  
  // Holidays
  germanHolidaysData,
  generateGermanHolidays,
  getHolidayForDate,
  isStudioClosedOnDate,
  getOpeningHoursForDate,
  
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
  DEFAULT_CALENDAR_SETTINGS,
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
