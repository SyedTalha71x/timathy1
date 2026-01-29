// ============================================================================
// INDEX.JS - Zentrale Export-Datei für Studio States
// ============================================================================
// Diese Datei re-exportiert alle States für einfache Imports:
//
// USAGE:
// import { membersData, staffData, appointmentsMainData } from '../../utils/studio-states';
// import { getMemberById, getStaffById } from '../../utils/studio-states';
//
// STRUKTUR:
// - members-states.js         → Members, History, Relations, Contingent
// - staff-states.js           → Staff/Employees
// - leads-states.js           → Leads/Prospects
// - appointments-states.js    → Appointments, Types, Free Slots
// - communication-states.js   → Chats, Emails, Templates
// - configuration-states.jsx  → Studio, Config, Permissions, Defaults
// - training-states.jsx       → Training Videos, Plans
//
// HINWEIS: Legacy-Namen werden für Abwärtskompatibilität beibehalten!
// ============================================================================

// =============================================================================
// MEMBERS
// =============================================================================
export {
  membersData,
  memberHistoryData,
  memberRelationsData,
  memberContingentData,
  billingPeriodsData,
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
  // Legacy Aliase
  memberHistoryData as memberHistoryMainData,
  memberRelationsData as memberRelationsMainData,
  membersData as membersNew,
  memberHistoryData as memberHistoryNew,
  memberRelationsData as memberRelationsNew,
  memberContingentData as memberContingentDataNew,
} from './members-states';

// =============================================================================
// STAFF
// =============================================================================
export {
  staffData,
  getStaffById,
  getStaffFullName,
  getActiveStaff,
  getArchivedStaff,
  getStaffByRole,
  getStaffByDepartment,
  getTrainers,
  transformStaffFromBackend,
  transformStaffToBackend,
  staffApi,
  StaffColorIndicator,
  // Legacy Aliase
  staffData as staffMemberDataNew,
} from './staff-states';

// =============================================================================
// LEADS
// =============================================================================
export {
  // Lead Sources (from configuration-states via leads-states)
  DEFAULT_LEAD_SOURCES as LEAD_SOURCES_FROM_LEADS,
  getLeadSourceNames as getLeadSourceNamesFromLeads,
  getLeadSourceByName as getLeadSourceByNameFromLeads,
  getLeadSourceColor as getLeadSourceColorFromLeads,
  // Leads Data
  leadsData,
  leadRelationsData,
  trialAppointmentsData,
  availableTimeSlotsData,
  leadColumnsData,
  getLeadById,
  getLeadFullName,
  getLeadsByColumn,
  getLeadRelations,
  getLeadTrialAppointments,
  getActiveLeads,
  getLeadsWithTrial,
  transformLeadFromBackend,
  transformLeadToBackend,
  leadsApi,
  // Legacy exports
  hardcodedLeads,
  memberRelationsLeadNew,
  availableTimeSlots,
  sampleTrialAppointments,
} from './leads-states';

// =============================================================================
// APPOINTMENTS
// =============================================================================
export {
  appointmentTypesData,
  regularAppointmentTypesData,
  trialAppointmentTypesData,
  appointmentsData,
  freeAppointmentsData,
  getAppointmentTypeById,
  getAppointmentTypeByName,
  getRegularAppointmentTypes,
  getTrialAppointmentTypes,
  isTrialAppointmentType,
  getAppointmentColor,
  getAppointmentColorHex,
  hexToTailwindBg,
  tailwindBgToHex,
  getMemberAppointments,
  getUpcomingAppointments,
  getTodaysAppointments,
  getAppointmentsByDate,
  getAppointmentsByStaff,
  transformAppointmentFromBackend,
  transformAppointmentToBackend,
  appointmentsApi,
  appointmentTypesApi,
  // Legacy Aliase
  appointmentsData as appointmentsMainData,
  appointmentTypesData as appointmentTypeMainData,
  freeAppointmentsData as freeAppointmentsMainData,
  appointmentsData as appointmentsNew,
} from './appointments-states';

// =============================================================================
// COMMUNICATION
// =============================================================================
export {
  memberChatListData,
  staffChatListData,
  companyChatListData,
  emailListData,
  emailTemplatesData,
  preConfiguredMessagesData,
  communicationSettingsData,
  appointmentNotificationTypesData,
  getLastMessage,
  getLastMessageContent,
  getLastMessageTime,
  getUnreadCount,
  isChatRead,
  getChatByMemberId,
  getChatByStaffId,
  chatsApi,
  emailsApi,
  // Legacy Aliase
  memberChatListData as memberChatListNew,
  staffChatListData as staffChatListNew,
  companyChatListData as companyChatListNew,
  emailListData as emailListNew,
  emailTemplatesData as emailTemplatesNew,
  preConfiguredMessagesData as preConfiguredMessagesNew,
  communicationSettingsData as settingsNew,
  appointmentNotificationTypesData as appointmentNotificationTypesNew,
  getLastMessage as getLastMessageStatus,
} from './communication-states';

// =============================================================================
// CONFIGURATION (Studio, Config, Permissions, Defaults)
// =============================================================================
export {
  // Countries
  COUNTRIES,
  COUNTRIES_SIMPLE,
  
  // Studio Data
  studioData,
  getStudioData,
  getStudioName,
  getStudioShortName,
  getOpeningHoursForDay,
  isStudioOpenOnDay,
  getStudioAddress,
  getStudioContactInfo,
  transformStudioFromBackend,
  transformStudioToBackend,
  studioApi,
  
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
  getLeadSourceNames,
  getLeadSourceByName,
  getLeadSourceColor,
  
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
  
  // Config API
  configApi,
} from './configuration-states';

// =============================================================================
// DEFAULT EXPORT (All modules combined)
// =============================================================================
import membersModule from './members-states';
import staffModule from './staff-states';
import leadsModule from './leads-states';
import appointmentsModule from './appointments-states';
import communicationModule from './communication-states';
import configurationModule from './configuration-states';

export default {
  ...membersModule,
  ...staffModule,
  ...leadsModule,
  ...appointmentsModule,
  ...communicationModule,
  ...configurationModule,
};
