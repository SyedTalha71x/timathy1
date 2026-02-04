// ============================================
// Admin Panel Configuration States
// Single Source of Truth for all configuration data
// used across the admin panel (email signature, SMTP, etc.)
// ============================================

// Default Communication Settings (Email Signature, etc.)
export const DEFAULT_COMMUNICATION_SETTINGS = {
  emailSignature: `<p>Best regards,<br>{Studio_Name} Team</p>`,
  autoAppendSignature: true,
  includeSignatureInReplies: false,
  useHtmlSignature: true,
};

// SMTP Configuration Defaults
export const DEFAULT_SMTP_CONFIG = {
  smtpServer: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  useSSL: false,
  senderName: "",
};

// Demo Email Defaults
export const DEFAULT_DEMO_EMAIL = {
  subject: "",
  content: "",
  expiryDays: 7,
};

// Registration Email Defaults
export const DEFAULT_REGISTRATION_EMAIL = {
  subject: "",
  content: "",
  expiryHours: 24,
};

// Contact Data Defaults
export const DEFAULT_CONTACT_DATA = {
  companyName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

// Legal Information Defaults
export const DEFAULT_LEGAL_INFO = {
  imprint: "",
  privacyPolicy: "",
  termsAndConditions: "",
};

// Appearance Defaults
export const DEFAULT_APPEARANCE = {
  theme: "dark",
  primaryColor: "#FF843E",
  secondaryColor: "#1890ff",
  allowUserThemeToggle: true,
};

// Currency Options
export const CURRENCY_OPTIONS = [
  { value: "€", label: "€ (Euro)" },
  { value: "$", label: "$ (US Dollar)" },
  { value: "£", label: "£ (British Pound)" },
  { value: "¥", label: "¥ (Japanese Yen)" },
  { value: "Fr", label: "Fr (Swiss Franc)" },
  { value: "A$", label: "A$ (Australian Dollar)" },
  { value: "C$", label: "C$ (Canadian Dollar)" },
  { value: "kr", label: "kr (Swedish Krona)" },
];

// Default Contract Pause Reasons
export const DEFAULT_CONTRACT_PAUSE_REASONS = [
  { name: "Vacation", maxDays: 30 },
  { name: "Medical", maxDays: 90 },
];

// Default Lead Sources
export const DEFAULT_LEAD_SOURCES = [
  { id: 1, name: "Website", color: "#3B82F6" },
  { id: 2, name: "Social Media", color: "#10B981" },
  { id: 3, name: "Referral", color: "#F59E0B" },
];

// Lead Source Helper Functions
export const getLeadSourceNames = (sources = DEFAULT_LEAD_SOURCES) =>
  sources.map((s) => s.name);

export const getLeadSourceByName = (name, sources = DEFAULT_LEAD_SOURCES) =>
  sources.find((s) => s.name === name) || null;

export const getLeadSourceColor = (name, sources = DEFAULT_LEAD_SOURCES) => {
  const source = sources.find((s) => s.name === name);
  return source ? source.color : "#6B7280";
};

// Navigation Items Configuration for the Configuration Page
export const CONFIGURATION_NAV_ITEMS = [
  {
    id: "account",
    label: "Account",
    iconName: "User",
    sections: [
      { id: "account-details", label: "Personal Details" },
      { id: "account-access", label: "Access Data" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    iconName: "Building2",
    sections: [
      { id: "contact-info", label: "Contact Information" },
      { id: "legal-info", label: "Legal Information" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    iconName: "BadgeDollarSign",
    sections: [
      { id: "currency-settings", label: "Currency Settings" },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    iconName: "Palette",
    sections: [
      { id: "theme-settings", label: "Theme Settings" },
    ],
  },
  {
    id: "contracts",
    label: "Contracts",
    iconName: "RiContractLine",
    sections: [
      { id: "contract-types", label: "Contract Types" },
      { id: "pause-reasons", label: "Pause Reasons" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    iconName: "UserPlus",
    sections: [
      { id: "lead-sources", label: "Lead Sources" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    iconName: "Mail",
    sections: [
      { id: "demo-email", label: "Demo Access Email" },
      { id: "registration-email", label: "Registration Email" },
      { id: "email-signature", label: "Email Signature" },
      { id: "smtp-setup", label: "SMTP Setup" },
    ],
  },
  {
    id: "changelog",
    label: "Changelog",
    iconName: "History",
    sections: [
      { id: "version-history", label: "Version History" },
    ],
  },
];
