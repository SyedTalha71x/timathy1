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
    firstName: "John",
    lastName: "Smith",
    surname: "Smith", // Legacy alias
    email: "john.smith@example.com",
    phoneNumber: "+1234567890",
    telephoneNumber: "+1234567890",
    trialPeriod: "Trial Period",
    hasTrialTraining: true,
    avatar: null,
    source: "Social Media Ads",
    leadSource: "Social Media Ads",
    status: "active",
    gender: "male",
    birthday: "1990-05-20",
    about: "Software Engineer",
    details: "Software Engineer interested in strength training and cardio workouts.",
    createdAt: "2025-01-15T10:30:00Z",
    notes: [
      { id: 1001, status: "interest", text: "Interested in personal training sessions, 2x per week would be ideal.", isImportant: true, startDate: "2025-01-15", endDate: "2025-03-15", createdAt: "2025-01-15T10:30:00Z" },
      { id: 1002, status: "contact_attempt", text: "Reached by phone, trial training appointment scheduled.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-16T14:20:00Z" },
      { id: 1003, status: "personal_info", text: "Works as a software engineer, flexible working hours. Prefers morning training.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-17T09:15:00Z" },
    ],
    specialNote: { text: "Interested in personal training sessions twice a week.", isImportant: false, startDate: "2025-01-15", endDate: "2025-03-15" },
    columnId: "active",
    company: "Fitness Pro",
    interestedIn: "Premium",
    street: "123 Main St",
    zipCode: "12345",
    city: "Anytown",
    country: "USA",
    leadId: "LEAD-001",
  },
  {
    id: "h2",
    firstName: "Sarah",
    lastName: "Wilson",
    surname: "Wilson",
    email: "sarah.wilson@example.com",
    phoneNumber: "+1987654321",
    telephoneNumber: "+1987654321",
    trialPeriod: "Trial Period",
    hasTrialTraining: false,
    avatar: null,
    gender: "female",
    source: "Google Ads",
    leadSource: "Google Ads",
    status: "passive",
    birthday: "1988-11-10",
    details: "Interested in group fitness classes and nutrition guidance.",
    createdAt: "2025-01-20T14:45:00Z",
    notes: [
      { id: 2001, status: "health", text: "Has dietary restrictions - needs specialized nutrition plan. Lactose intolerant.", isImportant: true, startDate: "2025-01-20", endDate: "2025-04-20", createdAt: "2025-01-20T14:45:00Z" },
      { id: 2002, status: "callback_requested", text: "Wants to be called back next week, currently on vacation.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-21T10:00:00Z" },
    ],
    specialNote: { text: "Has dietary restrictions - needs specialized nutrition plan.", isImportant: false, startDate: "2025-01-20", endDate: "2025-04-20" },
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
    firstName: "Michael",
    lastName: "Brown",
    surname: "Brown",
    email: "michael.brown@example.com",
    phoneNumber: "+1122334455",
    telephoneNumber: "+1122334455",
    trialPeriod: "Trial Period",
    hasTrialTraining: true,
    avatar: null,
    source: "Email Campaign",
    leadSource: "Email Campaign",
    status: "trial",
    gender: "male",
    birthday: "1995-03-01",
    details: "Former athlete looking for high-intensity workouts and strength training.",
    createdAt: "2025-01-25T09:15:00Z",
    notes: [
      { id: 3001, status: "personal_info", text: "Former athlete (track and field), looking for high-intensity workouts and strength training.", isImportant: false, startDate: "2025-01-25", endDate: "2025-02-25", createdAt: "2025-01-25T09:15:00Z" },
      { id: 3002, status: "follow_up", text: "Call after trial training to get feedback.", isImportant: true, startDate: "", endDate: "", createdAt: "2025-01-26T16:30:00Z" },
      { id: 3003, status: "interest", text: "Interested in the premium package with personal trainer.", isImportant: false, startDate: "", endDate: "", createdAt: "2025-01-27T11:00:00Z" },
    ],
    specialNote: { text: "Former athlete, looking for high-intensity workouts.", isImportant: false, startDate: "2025-01-25", endDate: "2025-02-25" },
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
    firstName: "Emma",
    lastName: "Davis",
    surname: "Davis",
    email: "emma.davis@example.com",
    phoneNumber: "+1555666777",
    telephoneNumber: "+1555666777",
    trialPeriod: "Trial Period",
    hasTrialTraining: false,
    avatar: null,
    source: "Website",
    leadSource: "Website",
    status: "uninterested",
    gender: "female",
    birthday: "1992-07-18",
    details: "Interested but not ready to commit. Follow up in 3 months.",
    createdAt: "2025-02-01T11:20:00Z",
    notes: [
      { id: 4001, status: "objection", text: "Price concerns - finds membership too expensive. Maybe offer discount?", isImportant: true, startDate: "", endDate: "", createdAt: "2025-02-01T11:20:00Z" },
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
    firstName: "Justin",
    lastName: "Test",
    surname: "Test",
    email: "justintest@beispiel.com",
    phoneNumber: "+4915512345678",
    telephoneNumber: "+4915512345678",
    trialPeriod: "Trial Period",
    hasTrialTraining: false,
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
// LEAD RELATIONS
// =============================================================================
export const leadRelationsData = {
  h1: {
    family: [
      { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
      { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
    ],
    friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }],
    relationship: [],
    work: [{ name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" }],
    other: [],
  },
  h2: {
    family: [],
    friendship: [],
    relationship: [{ name: "Marie Smith", relation: "Partner", id: 301, type: "member" }],
    work: [],
    other: [],
  },
  h3: {
    family: [{ name: "Lisa Brown", relation: "Sister", id: 103, type: "member" }],
    friendship: [{ name: "David Chen", relation: "Close Friend", id: 202, type: "member" }],
    relationship: [],
    work: [],
    other: [],
  },
  h4: {
    family: [],
    friendship: [],
    relationship: [],
    work: [{ name: "Robert Johnson", relation: "Business Partner", id: 402, type: "lead" }],
    other: [],
  },
  h5: {
    family: [],
    friendship: [],
    relationship: [],
    work: [],
    other: [],
  },
};

// =============================================================================
// TRIAL APPOINTMENTS
// =============================================================================
export const trialAppointmentsData = [
  {
    id: 1001,
    leadId: "h1",
    leadName: "John Smith",
    leadEmail: "john.smith@example.com",
    date: "2025-02-15",
    timeSlot: "09:00 - 09:45",
    trialType: "Strength",
    status: "scheduled",
    isTrial: true,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 1002,
    leadId: "h3",
    leadName: "Michael Brown",
    leadEmail: "michael.brown@example.com",
    date: "2025-02-07",
    timeSlot: "09:00 - 09:30",
    trialType: "Cardio",
    status: "scheduled",
    isTrial: true,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 1003,
    leadId: "h3",
    leadName: "Michael Brown",
    leadEmail: "michael.brown@example.com",
    date: "2025-02-08",
    timeSlot: "10:00 - 10:45",
    trialType: "Flexibility",
    status: "scheduled",
    isTrial: true,
    isCancelled: false,
    isPast: false,
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
  { id: "trial", title: "Trial Training Arranged", color: "#3b82f6", isFixed: true },
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

export const getLeadRelations = (leadId) => 
  leadRelationsData[leadId] || { family: [], friendship: [], relationship: [], work: [], other: [] };

export const getLeadTrialAppointments = (leadId) => 
  trialAppointmentsData.filter(a => a.leadId === leadId);

export const getActiveLeads = () => leadsData.filter(l => l.status === "active");
export const getLeadsWithTrial = () => leadsData.filter(l => l.hasTrialTraining);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformLeadFromBackend = (backendLead) => ({
  id: backendLead.id,
  firstName: backendLead.first_name || backendLead.firstName,
  lastName: backendLead.last_name || backendLead.lastName,
  surname: backendLead.last_name || backendLead.lastName, // Legacy alias
  email: backendLead.email,
  phoneNumber: backendLead.phone_number || backendLead.phoneNumber,
  telephoneNumber: backendLead.telephone_number || backendLead.telephoneNumber,
  trialPeriod: backendLead.trial_period || backendLead.trialPeriod || "Trial Period",
  hasTrialTraining: backendLead.has_trial_training ?? backendLead.hasTrialTraining ?? false,
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
  first_name: frontendLead.firstName,
  last_name: frontendLead.lastName,
  email: frontendLead.email,
  phone_number: frontendLead.phoneNumber,
  telephone_number: frontendLead.telephoneNumber,
  trial_period: frontendLead.trialPeriod,
  has_trial_training: frontendLead.hasTrialTraining,
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
// LEGACY EXPORTS (für Rückwärtskompatibilität mit lead-states.jsx)
// =============================================================================

// Alias für alte Imports
export const hardcodedLeads = leadsData;
export const memberRelationsLeadNew = leadRelationsData;
export const availableTimeSlots = availableTimeSlotsData;
export const sampleTrialAppointments = trialAppointmentsData;

export default {
  // Lead Sources (from configuration-states - Single Source of Truth)
  DEFAULT_LEAD_SOURCES,
  getLeadSourceNames,
  getLeadSourceByName,
  getLeadSourceColor,
  // Leads Data
  leadsData,
  leadRelationsData,
  trialAppointmentsData,
  availableTimeSlotsData,
  leadColumnsData,
  // Helper Functions
  getLeadById,
  getLeadFullName,
  getLeadsByColumn,
  getLeadRelations,
  getLeadTrialAppointments,
  getActiveLeads,
  getLeadsWithTrial,
  // Backend Transformation
  transformLeadFromBackend,
  transformLeadToBackend,
  leadsApi,
  // Legacy
  hardcodedLeads,
  memberRelationsLeadNew,
  availableTimeSlots,
  sampleTrialAppointments,
};
