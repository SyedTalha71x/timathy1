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
    interval: 30,
    slotsRequired: 1,
    maxParallel: 2,
    contingentUsage: 1,
    color: "#FF843E",
    category: "Personal Training",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    id: 2,
    name: "EMS Cardio",
    description: "Cardiovascular training enhanced with EMS",
    duration: 30,
    interval: 30,
    slotsRequired: 1,
    maxParallel: 2,
    contingentUsage: 1,
    color: "#10B981",
    category: "Personal Training",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
  },
  {
    id: 3,
    name: "EMP Chair",
    description: "Relaxing electromagnetic pulse therapy session",
    duration: 30,
    interval: 30,
    slotsRequired: 0,
    maxParallel: 1,
    contingentUsage: 0, // Free add-on, no credit deduction
    color: "#8B5CF6",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  },
  {
    id: 4,
    name: "Body Check",
    description: "Comprehensive body analysis and measurements",
    duration: 30,
    interval: 30,
    slotsRequired: 2,
    maxParallel: 1,
    contingentUsage: 1,
    color: "#3B82F6",
    category: "Health Check",
    image: null,
  },
]

// Default Trial Training
export const DEFAULT_TRIAL_TRAINING = {
  name: "Trial Training",
  duration: 60,
  interval: 30,
  slotsRequired: 3,
  maxParallel: 1,
  contingentUsage: 0, // Trial sessions are free
  color: "#3B82F6",
}

// Default Staff Roles
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
]

// Default Vacation Days
export const DEFAULT_VACATION_DAYS = 30

// Default Staff Role ID (Trainer)
export const DEFAULT_STAFF_ROLE_ID = 2

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
  { id: 1, name: "Vacation", maxDays: 30, requiresProof: false },
  { id: 2, name: "Medical / Illness", maxDays: 90, requiresProof: true },
  { id: 3, name: "Injury / Rehabilitation", maxDays: 120, requiresProof: true },
  { id: 4, name: "Pregnancy", maxDays: 180, requiresProof: true },
  { id: 5, name: "Parental Leave", maxDays: 365, requiresProof: true },
  { id: 6, name: "Work Relocation", maxDays: 90, requiresProof: true },
  { id: 7, name: "Military / Civil Service", maxDays: 365, requiresProof: true },
  { id: 8, name: "Personal Reasons", maxDays: 30, requiresProof: false },
]

// Default Contract Forms
export const DEFAULT_CONTRACT_FORMS = [
  {
    id: 1,
    name: "Standard Membership Agreement",
    description: "General membership contract for all regular memberships",
    pages: [
      {
        id: 1,
        title: "Terms & Conditions",
        elements: [
          { id: 1, type: "heading", content: "Membership Agreement" },
          { id: 2, type: "paragraph", content: "This agreement is entered into between {Studio_Name} and the member." },
          { id: 3, type: "field", fieldType: "signature", label: "Member Signature", required: true },
          { id: 4, type: "field", fieldType: "date", label: "Date", required: true },
        ]
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Premium Membership Contract",
    description: "Extended contract for premium memberships with additional clauses",
    pages: [
      {
        id: 1,
        title: "Premium Terms",
        elements: [
          { id: 1, type: "heading", content: "Premium Membership Agreement" },
          { id: 2, type: "paragraph", content: "Welcome to our Premium Membership program at {Studio_Name}." },
          { id: 3, type: "paragraph", content: "As a premium member, you are entitled to unlimited training sessions and exclusive benefits." },
        ]
      },
      {
        id: 2,
        title: "Signatures",
        elements: [
          { id: 1, type: "field", fieldType: "signature", label: "Member Signature", required: true },
          { id: 2, type: "field", fieldType: "signature", label: "Studio Representative", required: true },
          { id: 3, type: "field", fieldType: "date", label: "Contract Date", required: true },
        ]
      }
    ],
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
  },
  {
    id: 3,
    name: "Trial Membership Form",
    description: "Short-term trial membership agreement",
    pages: [
      {
        id: 1,
        title: "Trial Agreement",
        elements: [
          { id: 1, type: "heading", content: "Trial Membership" },
          { id: 2, type: "paragraph", content: "This trial membership allows you to experience our studio for a limited time." },
          { id: 3, type: "field", fieldType: "checkbox", label: "I agree to the trial terms", required: true },
          { id: 4, type: "field", fieldType: "signature", label: "Signature", required: true },
        ]
      }
    ],
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-03-01T08:00:00Z",
  },
]

// Default Contract Types
export const DEFAULT_CONTRACT_TYPES = [
  {
    id: 1,
    name: "Basic Monthly",
    description: "Entry-level membership with essential features",
    duration: 12, // months (minimum commitment)
    cost: 79,
    billingPeriod: "monthly",
    userCapacity: 4, // 4 credits per month
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 79,
    cancellationPeriod: 30, // days
    contractFormId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Standard Monthly",
    description: "Our most popular membership option",
    duration: 12,
    cost: 99,
    billingPeriod: "monthly",
    userCapacity: 8, // 8 credits per month
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 99,
    cancellationPeriod: 30,
    contractFormId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Premium Unlimited",
    description: "Full access with unlimited training sessions",
    duration: 12,
    cost: 149,
    billingPeriod: "monthly",
    userCapacity: 0, // Unlimited (0 = no limit)
    autoRenewal: true,
    renewalIndefinite: true,
    renewalPeriod: null,
    renewalPrice: 149,
    cancellationPeriod: 30,
    contractFormId: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Flex 10er Card",
    description: "10 training credits, use anytime within 6 months",
    duration: 6,
    cost: 199,
    billingPeriod: "monthly", // One-time payment displayed as monthly equivalent
    userCapacity: 10, // 10 total credits
    autoRenewal: false,
    renewalIndefinite: false,
    renewalPeriod: null,
    renewalPrice: 0,
    cancellationPeriod: 0,
    contractFormId: 1,
    isActive: true,
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: 5,
    name: "Annual Premium",
    description: "Best value - pay annually, save 2 months",
    duration: 12,
    cost: 1490, // 10 months worth
    billingPeriod: "annually",
    userCapacity: 0, // Unlimited
    autoRenewal: true,
    renewalIndefinite: false,
    renewalPeriod: 12,
    renewalPrice: 1490,
    cancellationPeriod: 60,
    contractFormId: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Trial Week",
    description: "7-day trial membership to experience our studio",
    duration: 1, // 1 month max
    cost: 29,
    billingPeriod: "weekly",
    userCapacity: 3, // 3 sessions during trial
    autoRenewal: false,
    renewalIndefinite: false,
    renewalPeriod: null,
    renewalPrice: 0,
    cancellationPeriod: 0,
    contractFormId: 3,
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

// Default Contract Settings
export const DEFAULT_CONTRACT_SETTINGS = {
  allowMemberSelfCancellation: true,
  defaultNoticePeriod: 30, // days
  defaultBillingPeriod: "monthly",
  defaultContingent: 8, // credits per billing period
  defaultAutoRenewal: true,
  defaultRenewalIndefinite: true,
  defaultRenewalPeriod: 1, // months (if not indefinite)
}

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
  { id: 1, name: "John Doe", email: "john@studio.com", avatar: null, roleId: 1 },
  { id: 2, name: "Jane Smith", email: "jane@studio.com", avatar: null, roleId: 2 },
  { id: 3, name: "Mike Johnson", email: "mike@studio.com", avatar: null, roleId: 3 },
]

// Default Introductory Materials
export const DEFAULT_INTRODUCTORY_MATERIALS = [
  {
    id: 1,
    name: "Welcome Guide",
    description: "Introduction to our studio for new members",
    pages: [
      {
        id: 1,
        title: "Welcome",
        content: "<h1>Welcome to Our Studio!</h1><p>We're excited to have you join us.</p>",
        elements: []
      }
    ],
    createdAt: "2024-01-01T00:00:00Z",
  }
]

// ============================================
// Helper Functions for Backend Integration
// ============================================

/**
 * Generate a unique ID (for demo purposes, backend should use UUID/DB IDs)
 */
export const generateId = () => Date.now()

/**
 * Format currency based on locale and currency symbol
 */
export const formatCurrency = (amount, currency = "€", locale = "de-DE") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency === "€" ? "EUR" : currency === "$" ? "USD" : currency === "£" ? "GBP" : "EUR",
  }).format(amount)
}

/**
 * Calculate contract end date based on start date and duration
 */
export const calculateContractEndDate = (startDate, durationMonths) => {
  const date = new Date(startDate)
  date.setMonth(date.getMonth() + durationMonths)
  return date.toISOString()
}

/**
 * Check if a member has enough contingent for an appointment
 */
export const hasEnoughContingent = (memberContingent, appointmentContingentUsage) => {
  if (memberContingent === 0) return true // Unlimited
  return memberContingent >= appointmentContingentUsage
}

/**
 * Deduct contingent from member's available credits
 */
export const deductContingent = (currentContingent, usage) => {
  if (currentContingent === 0) return 0 // Unlimited stays unlimited
  return Math.max(0, currentContingent - usage)
}
