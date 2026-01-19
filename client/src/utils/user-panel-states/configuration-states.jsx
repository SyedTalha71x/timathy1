// Permission Groups for Staff Roles
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
]

// Flatten all permission keys for easy access
export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap(group => 
  group.items.map(item => item.key)
)

// Get all permissions as PERMISSION_DATA format (for backward compatibility)
export const PERMISSION_DATA = PERMISSION_GROUPS.flatMap(group =>
  group.items.map(item => ({
    key: item.key,
    label: item.label,
    group: group.group,
  }))
)

// ============================================
// Default Configuration Values
// ============================================

// Studio Capacity
export const DEFAULT_STUDIO_CAPACITY = 3

// Default Appointment Categories
export const DEFAULT_APPOINTMENT_CATEGORIES = [
  "Health Check",
  "Personal Training", 
  "Wellness",
  "Recovery",
  "Mindfulness",
  "Group Class"
]

// Default Appointment Types
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
  },
]

// Default Trial Training
export const DEFAULT_TRIAL_TRAINING = {
  name: "Trial Training",
  duration: 60,
  maxParallel: 1,
  slotsRequired: 3,
  color: "#3B82F6",
}

// Default Staff Roles
export const DEFAULT_STAFF_ROLES = [
  {
    id: 1,
    name: "Admin",
    permissions: ALL_PERMISSION_KEYS,
    color: "#FF843E",
    defaultVacationDays: 20,
    isAdmin: true,
    staffCount: 1,
    assignedStaff: [1]
  }
]

// Default Lead Sources
export const DEFAULT_LEAD_SOURCES = [
  { id: 1, name: "Website", color: "#3B82F6" },
  { id: 2, name: "Referral", color: "#10B981" },
  { id: 3, name: "Social Media", color: "#8B5CF6" },
  { id: 4, name: "Walk-in", color: "#F59E0B" },
]

// Default VAT Rates
export const DEFAULT_VAT_RATES = [
  { name: "Standard", percentage: 19, description: "Standard VAT rate" },
  { name: "Reduced", percentage: 7, description: "Reduced VAT rate" },
]

// Default Contract Pause Reasons
export const DEFAULT_CONTRACT_PAUSE_REASONS = [
  { name: "Vacation", maxDays: 30 },
  { name: "Medical", maxDays: 90 },
  { name: "Parental Leave", maxDays: 180 },
]

// Default Opening Hours
export const DEFAULT_OPENING_HOURS = [
  { day: 'Monday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Tuesday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Wednesday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Thursday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Friday', startTime: '09:00', endTime: '21:00', closed: false },
  { day: 'Saturday', startTime: '10:00', endTime: '18:00', closed: false },
  { day: 'Sunday', startTime: null, endTime: null, closed: true },
]

// Default Communication Settings
export const DEFAULT_COMMUNICATION_SETTINGS = {
  autoArchiveDuration: 30,
  emailNotificationEnabled: false,
  birthdayMessageEnabled: false,
  birthdayMessageTemplate: "",
  birthdaySendTime: "09:00",
  appointmentNotificationEnabled: false,
  appNotificationEnabled: false,
  birthdayAppNotificationEnabled: false,
  appointmentAppNotificationEnabled: false,
  notificationSubTab: "email",
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  senderName: "",
  emailSignature: "Best regards,\n{Studio_Name} Team",
  einvoiceSubject: "",
  einvoiceTemplate: "",
}

// Default Appearance Settings
export const DEFAULT_APPEARANCE_SETTINGS = {
  theme: "dark",
  primaryColor: "#FF843E",
  secondaryColor: "#3B82F6",
  allowStaffThemeToggle: true,
  allowMemberThemeToggle: true
}

// Default Staff Members (for role assignment demo)
export const DEFAULT_STAFF_MEMBERS = [
  { id: 1, name: "John Doe", email: "john@studio.com", avatar: null },
  { id: 2, name: "Jane Smith", email: "jane@studio.com", avatar: null },
  { id: 3, name: "Mike Johnson", email: "mike@studio.com", avatar: null },
]

