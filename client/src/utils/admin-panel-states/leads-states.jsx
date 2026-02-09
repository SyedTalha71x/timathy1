// ============================================================================
// LEADS-STATES.JS - Lead/Interessenten-Daten
// ============================================================================
// Alle Lead-bezogenen Daten und Helper-Funktionen
// Backend-Endpoint: GET /api/leads
// ============================================================================

// =============================================================================
// IMPORTS FROM CONFIGURATION (Single Source of Truth)
// =============================================================================
import { 
  DEFAULT_LEAD_SOURCES,
  getLeadSourceNames,
  getLeadSourceByName,
  getLeadSourceColor,
} from './configuration-states';

// Re-export Lead Sources for convenience
export { 
  DEFAULT_LEAD_SOURCES,
  getLeadSourceNames,
  getLeadSourceByName,
  getLeadSourceColor,
};

// =============================================================================
// LEADS DATA
// =============================================================================
export const leadsData = [
  {
    id: "h1",
    studioName: "FitPro Studio",
    firstName: "John",
    lastName: "Smith",
    surname: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "+1234567890",
    telephoneNumber: "+1234567890",
    websiteLink: "https://fitpro-studio.com",
    hasDemoAccess: true,
    avatar: null,
    source: "Social Media Ads",
    leadSource: "Social Media Ads",
    status: "active",
    gender: "male",
    birthday: "1990-05-20",
    about: "Studio Operator",
    details: "Studio operator interested in gym management software.",
    createdAt: "2025-01-15T10:30:00Z",
    notes: [
      { id: 1001, status: "interest", text: "Interested in premium features, wants demo access for 2 weeks.", isImportant: true, startDate: "2025-01-15", endDate: "2025-03-15", createdAt: "2025-01-15T10:30:00Z" },
      { id: 1002, status: "contact_attempt", text: "Reached by phone, demo access scheduled.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-16T14:20:00Z" },
      { id: 1003, status: "personal_info", text: "Runs a mid-size fitness studio with 200+ members.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-17T09:15:00Z" },
    ],
    specialNote: { text: "Interested in premium features, wants demo access for 2 weeks.", isImportant: false, startDate: "2025-01-15", endDate: "2025-03-15" },
    columnId: "active",
    company: "FitPro Studio",
    interestedIn: "Premium",
    street: "123 Main St",
    zipCode: "12345",
    city: "Anytown",
    country: "USA",
    leadId: "LEAD-001",
  },
  {
    id: "h2",
    studioName: "Wellness Hub Berlin",
    firstName: "Sarah",
    lastName: "Wilson",
    surname: "Wilson",
    email: "sarah.wilson@example.com",
    phoneNumber: "+1987654321",
    telephoneNumber: "+1987654321",
    websiteLink: "https://wellness-hub-berlin.de",
    hasDemoAccess: false,
    avatar: null,
    gender: "female",
    source: "Google Ads",
    leadSource: "Google Ads",
    status: "passive",
    birthday: "1988-11-10",
    details: "Interested in group fitness management and nutrition tracking features.",
    createdAt: "2025-01-20T14:45:00Z",
    notes: [
      { id: 2001, status: "interest", text: "Needs specialized nutrition tracking. Multiple studio locations.", isImportant: true, startDate: "2025-01-20", endDate: "2025-04-20", createdAt: "2025-01-20T14:45:00Z" },
      { id: 2002, status: "callback_requested", text: "Wants to be called back next week, currently on vacation.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-21T10:00:00Z" },
    ],
    specialNote: { text: "Needs specialized nutrition tracking. Multiple studio locations.", isImportant: false, startDate: "2025-01-20", endDate: "2025-04-20" },
    columnId: "passive",
    company: "Wellness Hub",
    interestedIn: "Basic",
    street: "456 Oak Ave",
    zipCode: "54321",
    city: "Otherville",
    country: "USA",
    leadId: "LEAD-002",
  },
  {
    id: "h3",
    studioName: "Gym Central München",
    firstName: "Michael",
    lastName: "Brown",
    surname: "Brown",
    email: "michael.brown@example.com",
    phoneNumber: "+1122334455",
    telephoneNumber: "+1122334455",
    websiteLink: "https://gymcentral-muenchen.de",
    hasDemoAccess: true,
    avatar: null,
    source: "Email Campaign",
    leadSource: "Email Campaign",
    status: "trial",
    gender: "male",
    birthday: "1995-03-01",
    details: "Large gym chain operator looking for enterprise solution.",
    createdAt: "2025-01-25T09:15:00Z",
    notes: [
      { id: 3001, status: "personal_info", text: "Operates 3 gym locations, looking for centralized management.", isImportant: false, startDate: "2025-01-25", endDate: "2025-02-25", createdAt: "2025-01-25T09:15:00Z" },
      { id: 3002, status: "follow_up", text: "Follow up after demo access period ends.", isImportant: true, startDate: "", endDate: "", createdAt: "2025-01-26T16:30:00Z" },
      { id: 3003, status: "interest", text: "Interested in the premium package with API access.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-27T11:00:00Z" },
    ],
    specialNote: { text: "Operates 3 gym locations, looking for centralized management.", isImportant: false, startDate: "2025-01-25", endDate: "2025-02-25" },
    columnId: "trial",
    company: "Gym Central",
    interestedIn: "Bronze",
    street: "789 Pine Ln",
    zipCode: "67890",
    city: "Anycity",
    country: "USA",
    leadId: "LEAD-003",
  },
  {
    id: "h4",
    studioName: "Active Life Fitness",
    firstName: "Emma",
    lastName: "Davis",
    surname: "Davis",
    email: "emma.davis@example.com",
    phoneNumber: "+1555666777",
    telephoneNumber: "+1555666777",
    websiteLink: "",
    hasDemoAccess: false,
    avatar: null,
    source: "Website",
    leadSource: "Website",
    status: "uninterested",
    gender: "female",
    birthday: "1992-07-18",
    details: "Interested but not ready to commit. Follow up in 3 months.",
    createdAt: "2025-02-01T11:20:00Z",
    notes: [
      { id: 4001, status: "objection", text: "Price concerns - finds subscription too expensive. Maybe offer discount?", isImportant: true, startDate: "", endDate: "", createdAt: "2025-02-01T11:20:00Z" },
      { id: 4002, status: "follow_up", text: "Contact again in 3 months - not ready to commit right now.", isImportant: true, startDate: "2025-02-01", endDate: "2025-05-01", createdAt: "2025-02-01T15:00:00Z" },
      { id: 4003, status: "contact_attempt", text: "Tried calling 2x, not reached. SMS sent.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-02-03T09:30:00Z" },
    ],
    specialNote: { text: "Requested follow-up in 3 months - not ready to commit now.", isImportant: true, startDate: "2025-02-01", endDate: "2025-05-01" },
    columnId: "uninterested",
    company: "Active Life",
    interestedIn: "Basic",
    street: "101 Elm St",
    zipCode: "11111",
    city: "Smalltown",
    country: "USA",
    leadId: "LEAD-004",
  },
  {
    id: "h5",
    studioName: "Test Studio Berlin",
    firstName: "Justin",
    lastName: "Multerio",
    surname: "Multerio",
    email: "justintest@beispiel.com",
    phoneNumber: "+4915512345678",
    telephoneNumber: "+4915512345678",
    websiteLink: "https://teststudio-berlin.de",
    hasDemoAccess: false,
    avatar: null,
    source: "Website",
    leadSource: "Website",
    status: "missed",
    gender: "male",
    birthday: "1992-07-18",
    details: "Test lead for development purposes.",
    createdAt: "2025-02-01T11:20:00Z",
    columnId: "missed",
    company: "Test Studio",
    interestedIn: "Basic",
    street: "Teststraße 123",
    zipCode: "10115",
    city: "Berlin",
    country: "Germany",
    leadId: "LEAD-005",
  },
];

// =============================================================================
// AVAILABLE TIME SLOTS
// =============================================================================
export const availableTimeSlotsData = [
  { id: "slot1", date: "2025-09-27", time: "08:00", timeSlot: "08:00 - 08:30" },
  { id: "slot2", date: "2025-09-27", time: "08:30", timeSlot: "08:30 - 09:00" },
  { id: "slot3", date: "2025-09-27", time: "09:00", timeSlot: "09:00 - 09:30" },
  { id: "slot4", date: "2025-09-27", time: "09:30", timeSlot: "09:30 - 10:00" },
  { id: "slot5", date: "2025-09-27", time: "10:00", timeSlot: "10:00 - 10:30" },
  { id: "slot6", date: "2025-09-27", time: "10:30", timeSlot: "10:30 - 11:00" },
  { id: "slot7", date: "2025-09-27", time: "11:00", timeSlot: "11:00 - 11:30" },
  { id: "slot8", date: "2025-09-27", time: "11:30", timeSlot: "11:30 - 12:00" },
  { id: "slot9", date: "2025-09-27", time: "14:00", timeSlot: "14:00 - 14:30" },
  { id: "slot10", date: "2025-09-27", time: "14:30", timeSlot: "14:30 - 15:00" },
  { id: "slot11", date: "2025-09-27", time: "15:00", timeSlot: "15:00 - 15:30" },
  { id: "slot12", date: "2025-09-27", time: "15:30", timeSlot: "15:30 - 16:00" },
  { id: "slot13", date: "2025-09-27", time: "16:00", timeSlot: "16:00 - 16:30" },
  { id: "slot14", date: "2025-09-27", time: "16:30", timeSlot: "16:30 - 17:00" },
  { id: "slot15", date: "2025-09-27", time: "17:00", timeSlot: "17:00 - 17:30" },
  { id: "slot16", date: "2025-09-27", time: "17:30", timeSlot: "17:30 - 18:00" },
  { id: "slot17", date: "2025-09-27", time: "18:00", timeSlot: "18:00 - 18:30" },
  { id: "slot18", date: "2025-09-27", time: "18:30", timeSlot: "18:30 - 19:00" },
  { id: "slot19", date: "2025-09-27", time: "19:00", timeSlot: "19:00 - 19:30" },
  { id: "slot20", date: "2025-09-27", time: "19:30", timeSlot: "19:30 - 20:00" },
];

// =============================================================================
// LEAD COLUMNS (Kanban Board)
// =============================================================================
export const leadColumnsData = [
  { id: "active", title: "Active prospect", color: "#10b981" },
  { id: "passive", title: "Passive prospect", color: "#f59e0b" },
  { id: "uninterested", title: "Uninterested", color: "#ef4444" },
  { id: "missed", title: "Missed Call", color: "#8b5cf6" },
  { id: "trial", title: "Demo Access", color: "#3b82f6", isFixed: true },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getLeadById = (id) => leadsData.find(l => l.id === id) || null;

export const getLeadFullName = (leadId) => {
  const l = getLeadById(leadId);
  return l ? `${l.firstName} ${l.lastName}` : "Unknown";
};

export const getLeadsByColumn = (columnId) => leadsData.filter(l => l.columnId === columnId);

export const getActiveLeads = () => leadsData.filter(l => l.status === "active");
export const getLeadsWithDemoAccess = () => leadsData.filter(l => l.hasDemoAccess);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformLeadFromBackend = (backendLead) => ({
  id: backendLead.id,
  studioName: backendLead.studio_name || backendLead.studioName || "",
  firstName: backendLead.first_name || backendLead.firstName,
  lastName: backendLead.last_name || backendLead.lastName,
  surname: backendLead.last_name || backendLead.lastName,
  email: backendLead.email,
  phoneNumber: backendLead.phone_number || backendLead.phoneNumber,
  telephoneNumber: backendLead.telephone_number || backendLead.telephoneNumber,
  websiteLink: backendLead.website_link || backendLead.websiteLink || "",
  hasDemoAccess: backendLead.has_demo_access ?? backendLead.hasDemoAccess ?? false,
  avatar: backendLead.avatar || null,
  source: backendLead.source || "",
  leadSource: backendLead.lead_source || backendLead.leadSource || backendLead.source || "",
  status: backendLead.status || "active",
  gender: backendLead.gender || "",
  birthday: backendLead.birthday || backendLead.date_of_birth || "",
  about: backendLead.about || "",
  details: backendLead.details || "",
  createdAt: backendLead.created_at || backendLead.createdAt || "",
  notes: backendLead.notes || [],
  specialNote: backendLead.special_note || backendLead.specialNote || null,
  columnId: backendLead.column_id || backendLead.columnId || "active",
  company: backendLead.company || "",
  interestedIn: backendLead.interested_in || backendLead.interestedIn || "",
  street: backendLead.street || "",
  zipCode: backendLead.zip_code || backendLead.zipCode || "",
  city: backendLead.city || "",
  country: backendLead.country || "",
  leadId: backendLead.lead_id || backendLead.leadId || "",
});

export const transformLeadToBackend = (frontendLead) => ({
  id: frontendLead.id,
  studio_name: frontendLead.studioName,
  first_name: frontendLead.firstName,
  last_name: frontendLead.lastName,
  email: frontendLead.email,
  phone_number: frontendLead.phoneNumber,
  telephone_number: frontendLead.telephoneNumber,
  website_link: frontendLead.websiteLink,
  has_demo_access: frontendLead.hasDemoAccess,
  avatar: frontendLead.avatar,
  source: frontendLead.source,
  lead_source: frontendLead.leadSource,
  status: frontendLead.status,
  gender: frontendLead.gender,
  birthday: frontendLead.birthday,
  about: frontendLead.about,
  details: frontendLead.details,
  created_at: frontendLead.createdAt,
  notes: frontendLead.notes,
  special_note: frontendLead.specialNote,
  column_id: frontendLead.columnId,
  company: frontendLead.company,
  interested_in: frontendLead.interestedIn,
  street: frontendLead.street,
  zip_code: frontendLead.zipCode,
  city: frontendLead.city,
  country: frontendLead.country,
  lead_id: frontendLead.leadId,
});

// =============================================================================
// MOCK API (Replace with real API calls)
// =============================================================================

export const leadsApi = {
  getAll: async () => leadsData,
  getById: async (id) => getLeadById(id),
  getByColumn: async (columnId) => getLeadsByColumn(columnId),
  create: async (data) => ({ ...data, id: `h${leadsData.length + 1}` }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
  moveToColumn: async (leadId, columnId) => ({ success: true }),
};

// =============================================================================
// LEGACY EXPORTS (für Rückwärtskompatibilität)
// =============================================================================

export const hardcodedLeads = leadsData;
export const availableTimeSlots = availableTimeSlotsData;

export default {
  DEFAULT_LEAD_SOURCES,
  getLeadSourceNames,
  getLeadSourceByName,
  getLeadSourceColor,
  leadsData,
  availableTimeSlotsData,
  leadColumnsData,
  getLeadById,
  getLeadFullName,
  getLeadsByColumn,
  getActiveLeads,
  getLeadsWithDemoAccess,
  transformLeadFromBackend,
  transformLeadToBackend,
  leadsApi,
  hardcodedLeads,
  availableTimeSlots,
};
