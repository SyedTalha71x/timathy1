// Demo Access States - Dummy Data
// Location: client/src/utils/admin-panel-states/demo-access-states.js

import { DEFAULT_DEMO_TEMPLATES, DEMO_MENU_ITEMS } from "./configuration-states";

// Re-export templates from configuration-states (Single Source of Truth)
export const demoTemplates = DEFAULT_DEMO_TEMPLATES;

// Re-export menu items for convenience
export { DEMO_MENU_ITEMS } from "./configuration-states";

// ============================================
// Demo Access Accounts
// IMPORTANT: every demo MUST have a `config` sub-object because
// JournalModal reads demo.config.studioName,
// SendEmailModal reads demo.config.email / demo.config.studioName,
// DemoConfiguratorModal reads demo.config.* for its form fields.
// ============================================
export const demoAccessAccounts = [
  {
    id: 1,
    company: "FitZone GmbH",
    status: "active",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "premium"),
    demoDuration: 14,
    createdAt: "2025-01-15T10:30:00.000Z",
    expiryDate: "2025-01-29T10:30:00.000Z",
    lastLogin: "2025-01-28T14:20:00.000Z",
    loginCount: 23,
    config: {
      studioName: "FitZone Premium",
      studioOwner: "John Smith",
      studioLogo: null,
      demoDuration: 14,
      email: "john.smith@fitzone.com",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-15T10:30:00.000Z", user: "Admin", details: "Created premium demo for FitZone Premium" },
      { action: "Email Sent", timestamp: "2025-01-15T10:35:00.000Z", user: "System", details: "Access email sent to john.smith@fitzone.com" },
      { action: "Demo Accessed", timestamp: "2025-01-15T11:15:00.000Z", user: "John Smith", details: "User logged in for the first time" },
      { action: "Configuration Changed", timestamp: "2025-01-20T14:20:00.000Z", user: "Admin", details: "Changed demo duration from 7 to 14 days" },
    ],
  },
  {
    id: 2,
    company: "PowerGym Deutschland",
    status: "active",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "standard"),
    demoDuration: 7,
    createdAt: "2025-01-22T09:00:00.000Z",
    expiryDate: "2025-01-29T09:00:00.000Z",
    lastLogin: "2025-01-27T16:45:00.000Z",
    loginCount: 12,
    config: {
      studioName: "PowerGym Studio",
      studioOwner: "Sarah Johnson",
      studioLogo: null,
      demoDuration: 7,
      email: "sarah.j@powergym.de",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-22T09:00:00.000Z", user: "Admin", details: "Created standard demo for PowerGym Studio" },
      { action: "Email Sent", timestamp: "2025-01-22T09:05:00.000Z", user: "System", details: "Access email sent to sarah.j@powergym.de" },
    ],
  },
  {
    id: 3,
    company: "BodyFit International",
    status: "inactive",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "basic"),
    demoDuration: 7,
    createdAt: "2025-01-05T14:00:00.000Z",
    expiryDate: null,
    lastLogin: "2025-01-10T08:30:00.000Z",
    loginCount: 5,
    config: {
      studioName: "BodyFit Lounge",
      studioOwner: "Mike Wilson",
      studioLogo: null,
      demoDuration: 7,
      email: "mike.wilson@bodyfit.com",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-05T14:00:00.000Z", user: "Admin", details: "Created basic demo for BodyFit Lounge" },
      { action: "Demo Deactivated", timestamp: "2025-01-12T10:00:00.000Z", user: "Admin", details: "Demo status changed to inactive" },
    ],
  },
  {
    id: 4,
    company: "CrossFit Arena LLC",
    status: "active",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "premium"),
    demoDuration: 30,
    createdAt: "2025-01-25T08:00:00.000Z",
    expiryDate: "2025-02-24T08:00:00.000Z",
    lastLogin: "2025-01-28T19:15:00.000Z",
    loginCount: 8,
    config: {
      studioName: "CrossFit Arena",
      studioOwner: "Emily Davis",
      studioLogo: null,
      demoDuration: 30,
      email: "emily.davis@crossfitarena.com",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-25T08:00:00.000Z", user: "Admin", details: "Created premium demo for CrossFit Arena" },
      { action: "Email Sent", timestamp: "2025-01-25T08:05:00.000Z", user: "System", details: "Access email sent to emily.davis@crossfitarena.com" },
      { action: "Demo Accessed", timestamp: "2025-01-25T10:30:00.000Z", user: "Emily Davis", details: "User logged in for the first time" },
    ],
  },
  {
    id: 5,
    company: "Flex & Flow GmbH",
    status: "inactive",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "standard"),
    demoDuration: 7,
    createdAt: "2024-12-20T12:00:00.000Z",
    expiryDate: "2024-12-27T12:00:00.000Z",
    lastLogin: "2024-12-26T17:00:00.000Z",
    loginCount: 15,
    config: {
      studioName: "Flex & Flow Yoga",
      studioOwner: "Anna Müller",
      studioLogo: null,
      demoDuration: 7,
      email: "anna.mueller@flexflow.de",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2024-12-20T12:00:00.000Z", user: "Admin", details: "Created standard demo for Flex & Flow Yoga" },
      { action: "Email Sent", timestamp: "2024-12-20T12:05:00.000Z", user: "System", details: "Access email sent to anna.mueller@flexflow.de" },
      { action: "Demo Deactivated", timestamp: "2024-12-27T12:00:00.000Z", user: "System", details: "Demo expired after 7 days - status set to inactive" },
    ],
  },
  {
    id: 6,
    company: "Iron Paradise Fitness",
    status: "active",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "basic"),
    demoDuration: 14,
    createdAt: "2025-01-27T16:00:00.000Z",
    expiryDate: "2025-02-10T16:00:00.000Z",
    lastLogin: null,
    loginCount: 0,
    config: {
      studioName: "Iron Paradise",
      studioOwner: "Thomas Becker",
      studioLogo: null,
      demoDuration: 14,
      email: "t.becker@ironparadise.de",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-27T16:00:00.000Z", user: "Admin", details: "Created basic demo for Iron Paradise" },
      { action: "Email Sent", timestamp: "2025-01-27T16:05:00.000Z", user: "System", details: "Access email sent to t.becker@ironparadise.de" },
    ],
  },
  {
    id: 7,
    company: "Vitality Hub Inc.",
    status: "inactive",
    template: DEFAULT_DEMO_TEMPLATES.find(t => t.id === "premium"),
    demoDuration: 14,
    createdAt: "2025-01-10T11:00:00.000Z",
    expiryDate: null,
    lastLogin: "2025-01-18T09:00:00.000Z",
    loginCount: 18,
    config: {
      studioName: "Vitality Hub",
      studioOwner: "Laura Fischer",
      studioLogo: null,
      demoDuration: 14,
      email: "laura@vitalityhub.com",
      sendEmail: true,
    },
    journal: [
      { action: "Demo Created", timestamp: "2025-01-10T11:00:00.000Z", user: "Admin", details: "Created premium demo for Vitality Hub" },
      { action: "Demo Deactivated", timestamp: "2025-01-20T10:00:00.000Z", user: "Admin", details: "Demo manually deactivated - client decided not to proceed" },
    ],
  },
];

// ============================================
// Leads available for demo linking
// ============================================
export const demoLeads = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", company: "Tech Corp" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", company: "Fitness Plus" },
  { id: 3, name: "Mike Wilson", email: "mike.wilson@example.com", company: "Global Gym" },
  { id: 4, name: "Emily Davis", email: "emily.davis@example.com", company: "FitLife Studios" },
  { id: 5, name: "Anna Müller", email: "anna.mueller@flexflow.de", company: "Flex & Flow GmbH" },
  { id: 6, name: "Thomas Becker", email: "t.becker@ironparadise.de", company: "Iron Paradise Fitness" },
  { id: 7, name: "Laura Fischer", email: "laura@vitalityhub.com", company: "Vitality Hub Inc." },
];

// ============================================
// Helper Functions
// ============================================
export const getStatusColor = (status) => {
  switch (status) {
    case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "inactive": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getStatusDot = (status) => {
  switch (status) {
    case "active": return "bg-green-400";
    case "inactive": return "bg-red-400";
    default: return "bg-gray-400";
  }
};

export const getTemplateColor = (templateId) => {
  switch (templateId) {
    case "basic": return "#10b981";
    case "standard": return "#3b82f6";
    case "premium": return "#f59e0b";
    default: return "#6b7280";
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "–";
  return new Date(dateString).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "–";
  return new Date(dateString).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const getDaysRemaining = (expiryDate) => {
  if (!expiryDate) return null;
  const diffTime = new Date(expiryDate) - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getPermissionCount = (permissions) => {
  if (!permissions) return { enabled: 0, total: 0 };
  const entries = Object.entries(permissions);
  return { enabled: entries.filter(([, v]) => v).length, total: entries.length };
};
