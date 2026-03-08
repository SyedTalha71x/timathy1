// ============================================
// Admin Panel — Contract States & Configuration
// Used by admin contract components for studio/customer contracts
// ============================================

// ============================================
// CONTRACT TYPES (Admin ↔ Studio contracts)
// ============================================
export const DEFAULT_ADMIN_CONTRACT_TYPES = [
  { name: "Basic License 12 Months", duration: "12", cost: 199, billingPeriod: "monthly", description: "Basic platform access" },
  { name: "Standard License 12 Months", duration: "12", cost: 349, billingPeriod: "monthly", description: "Standard platform access with analytics" },
  { name: "Standard License 24 Months", duration: "24", cost: 299, billingPeriod: "monthly", description: "Standard access with 2-year discount" },
  { name: "Premium License 12 Months", duration: "12", cost: 599, billingPeriod: "monthly", description: "Full platform access with all features" },
  { name: "Premium License 24 Months", duration: "24", cost: 499, billingPeriod: "monthly", description: "Full access with 2-year discount" },
  { name: "Enterprise License 36 Months", duration: "36", cost: 899, billingPeriod: "monthly", description: "Enterprise-grade with priority support" },
  { name: "Trial License 1 Month", duration: "1", cost: 0, billingPeriod: "monthly", description: "Free trial period" },
  { name: "Trial License 3 Months", duration: "3", cost: 49, billingPeriod: "monthly", description: "Extended trial period" },
]

// ============================================
// PAUSE REASONS
// ============================================
export const DEFAULT_ADMIN_CONTRACT_PAUSE_REASONS = [
  { name: "Studio Renovation" },
  { name: "Seasonal Closure" },
  { name: "Financial Difficulties" },
  { name: "Owner Change" },
  { name: "Technical Issues" },
  { name: "Legal Review" },
  { name: "Temporary Closure" },
]

// ============================================
// BONUS TIME REASONS
// ============================================
export const DEFAULT_ADMIN_CONTRACT_BONUS_TIME_REASONS = [
  { name: "System Downtime Compensation" },
  { name: "Loyalty Reward" },
  { name: "Promotional Offer" },
  { name: "Partnership Extension" },
  { name: "Service Issue Compensation" },
  { name: "Migration Support" },
  { name: "Onboarding Extension" },
]

// ============================================
// RENEW REASONS
// ============================================
export const DEFAULT_ADMIN_CONTRACT_RENEW_REASONS = [
  { name: "Contract Expiring" },
  { name: "Upgrade Request" },
  { name: "Satisfied with Service" },
  { name: "New Terms Agreement" },
  { name: "Renegotiated Pricing" },
  { name: "Franchise Expansion" },
]

// ============================================
// CHANGE REASONS
// ============================================
export const DEFAULT_ADMIN_CONTRACT_CHANGE_REASONS = [
  { name: "Plan Upgrade" },
  { name: "Plan Downgrade" },
  { name: "Studio Growth" },
  { name: "Budget Adjustment" },
  { name: "Feature Requirements Change" },
  { name: "Franchise Restructuring" },
  { name: "Negotiated Terms" },
]

// ============================================
// CANCELLATION REASONS (Admin-specific)
// ============================================
export const DEFAULT_ADMIN_CANCELLATION_REASONS = [
  "Contract Violation",
  "Non-Payment",
  "Studio Closure",
  "Business Dissolution",
  "Mutual Agreement",
  "Service Dissatisfaction",
  "Competitor Switch",
  "Franchise Reorganization",
  "Owner Change",
  "Financial Difficulties",
  "Regulatory Issues",
  "Quality Standards Not Met",
]

// ============================================
// ADMIN PLATFORM DATA (currency, etc.)
// ============================================
export const adminPlatformData = {
  currency: "€",
  companyName: "FitPlatform GmbH",
  vatRate: 19,
}

// ============================================
// CONTRACT FORM TEMPLATES (for contract builder)
// ============================================
export const DEFAULT_ADMIN_CONTRACT_FORMS = [
  {
    id: "admin-standard",
    name: "Standard Studio License Agreement",
    pages: [
      {
        elements: [
          { type: "heading", content: "Studio License Agreement", style: { fontSize: 24, fontWeight: "bold", textAlign: "center" } },
          { type: "paragraph", content: "This agreement is entered into between FitPlatform GmbH and the Studio identified below." },
          { type: "variable", variableType: "system", variableName: "Contract Type" },
          { type: "variable", variableType: "user", variableName: "Studio Name" },
          { type: "variable", variableType: "user", variableName: "Owner Name" },
          { type: "variable", variableType: "system", variableName: "Contract Start Date" },
          { type: "variable", variableType: "system", variableName: "Contract End Date" },
          { type: "paragraph", content: "The studio agrees to the terms and conditions of the selected license plan." },
          { type: "signature", label: "Studio Representative Signature" },
        ]
      }
    ]
  }
]

// ============================================
// SYSTEM VARIABLES (for contract forms)
// ============================================
export const ADMIN_SYSTEM_VARIABLES = [
  "Studio ID",
  "Contract Start Date",
  "Contract End Date",
  "Minimum Term",
  "Contract Type",
  "Contract Cost",
  "Termination Notice Period",
  "Contract Renewal Duration",
]

// ============================================
// USER VARIABLES (for contract forms)
// ============================================
export const ADMIN_USER_VARIABLES = [
  "Studio Name",
  "Owner Name",
  "Street & Number",
  "ZIP Code",
  "City",
  "Country",
  "Telephone Number",
  "Email Address",
  "Tax ID",
  "IBAN",
  "BIC",
  "Bank Name",
  "Creditor ID",
]

// ============================================
// SYSTEM VARIABLE TO CONTRACT DATA MAPPING
// ============================================
export const ADMIN_SYSTEM_VARIABLE_MAPPING = {
  'Studio ID': 'studioId',
  'Contract Start Date': 'startDate',
  'Contract End Date': 'endDate',
  'Minimum Term': 'minimumTerm',
  'Contract Type': 'contractType',
  'Contract Cost': 'contractCost',
  'Termination Notice Period': 'terminationNoticePeriod',
  'Contract Renewal Duration': 'renewalDuration',
}

// ============================================
// USER VARIABLE TO FIELD NAME MAPPING
// ============================================
export const ADMIN_USER_VARIABLE_MAPPING = {
  'Studio Name': 'studioName',
  'Owner Name': 'ownerName',
  'Street & Number': 'street',
  'ZIP Code': 'zipCode',
  'City': 'city',
  'Country': 'country',
  'Telephone Number': 'telephone',
  'Email Address': 'email',
  'Tax ID': 'taxId',
  'IBAN': 'iban',
  'BIC': 'bic',
  'Bank Name': 'bankName',
  'Creditor ID': 'creditorId',
}

// ============================================
// ENHANCED CONTRACT DATA (per studio ID)
// Replaces the simple studioContractsData with
// full contract objects matching studio-view structure
// ============================================
export const adminContractsData = {
  1: [
    {
      id: "ADM-1001",
      contractNumber: "ADM-1001",
      studioId: 1,
      studioName: "FitZone München",
      contractType: "Premium License 24 Months",
      status: "Active",
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      cost: 499,
      billingPeriod: "monthly",
      autoRenewal: true,
      renewalIndefinite: false,
      autoRenewalEndDate: "2027-12-31",
      iban: "DE89370400440532013000",
      sepaMandate: "SEPA-ADM-1001",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2023-01-01",
    },
  ],
  2: [
    {
      id: "ADM-1002",
      contractNumber: "ADM-1002",
      studioId: 2,
      studioName: "PowerHouse Berlin",
      contractType: "Premium License 24 Months",
      status: "Active",
      startDate: "2023-06-01",
      endDate: "2026-05-31",
      cost: 499,
      billingPeriod: "monthly",
      autoRenewal: true,
      renewalIndefinite: true,
      autoRenewalEndDate: null,
      iban: "DE27100777770209299700",
      sepaMandate: "SEPA-ADM-1002",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2023-06-01",
    },
  ],
  3: [
    {
      id: "ADM-1003",
      contractNumber: "ADM-1003",
      studioId: 3,
      studioName: "VitalFit Hamburg",
      contractType: "Standard License 24 Months",
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2026-12-31",
      cost: 299,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE75512108001245126199",
      sepaMandate: "SEPA-ADM-1003",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2024-01-01",
    },
  ],
  4: [
    {
      id: "ADM-1004",
      contractNumber: "ADM-1004",
      studioId: 4,
      studioName: "IronWorks Köln",
      contractType: "Standard License 12 Months",
      status: "Active",
      startDate: "2024-03-01",
      endDate: "2027-02-28",
      cost: 349,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE68210501700012345678",
      sepaMandate: "SEPA-ADM-1004",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2024-03-01",
    },
  ],
  5: [
    {
      id: "ADM-1005",
      contractNumber: "ADM-1005",
      studioId: 5,
      studioName: "ZenFit Frankfurt",
      contractType: "Basic License 12 Months",
      status: "Active",
      startDate: "2024-06-01",
      endDate: "2026-05-31",
      cost: 199,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE44500105175407324931",
      sepaMandate: "SEPA-ADM-1005",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2024-06-01",
    },
  ],
  6: [
    {
      id: "ADM-1006",
      contractNumber: "ADM-1006",
      studioId: 6,
      studioName: "SprintGym Stuttgart",
      contractType: "Standard License 12 Months",
      status: "Cancelled",
      startDate: "2022-01-01",
      endDate: "2024-12-31",
      cost: 349,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE89370400440532013000",
      sepaMandate: "SEPA-ADM-1006",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: "Contract expired",
      cancelDate: "2024-12-31",
      cancelToDate: "2024-12-31",
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2022-01-01",
    },
  ],
  7: [
    {
      id: "ADM-1007",
      contractNumber: "ADM-1007",
      studioId: 7,
      studioName: "BodyCraft Düsseldorf",
      contractType: "Premium License 24 Months",
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2027-08-31",
      cost: 499,
      billingPeriod: "monthly",
      autoRenewal: true,
      renewalIndefinite: true,
      autoRenewalEndDate: null,
      iban: "DE27100777770209299700",
      sepaMandate: "SEPA-ADM-1007",
      bonusTime: { bonusAmount: 2, bonusUnit: "months", reason: "Loyalty Reward", withExtension: true },
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2024-09-01",
    },
  ],
  8: [
    {
      id: "ADM-1008",
      contractNumber: "ADM-1008",
      studioId: 8,
      studioName: "FlexArena Leipzig",
      contractType: "Basic License 12 Months",
      status: "Active",
      startDate: "2025-01-01",
      endDate: "2027-12-31",
      cost: 199,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE75512108001245126199",
      sepaMandate: "SEPA-ADM-1008",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2025-01-01",
    },
  ],
  9: [
    {
      id: "ADM-1009",
      contractNumber: "ADM-1009",
      studioId: 9,
      studioName: "AlpinFit Innsbruck",
      contractType: "Premium License 12 Months",
      status: "Active",
      startDate: "2024-10-01",
      endDate: "2027-09-30",
      cost: 599,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "AT611904300234573201",
      sepaMandate: "SEPA-ADM-1009",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2024-10-01",
    },
  ],
  10: [
    {
      id: "ADM-1010",
      contractNumber: "ADM-1010",
      studioId: 10,
      studioName: "FitFactory Nürnberg",
      contractType: "Standard License 12 Months",
      status: "Paused",
      startDate: "2025-01-15",
      endDate: "2027-01-14",
      cost: 349,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE35760300800500123456",
      sepaMandate: "SEPA-ADM-1010",
      bonusTime: null,
      pauseReason: "Studio Renovation",
      pauseStartDate: "2025-02-01",
      pauseEndDate: "2025-04-01",
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2025-01-15",
    },
  ],
  11: [
    {
      id: "ADM-1011",
      contractNumber: "ADM-1011",
      studioId: 11,
      studioName: "WaveGym Rostock",
      contractType: "Basic License 12 Months",
      status: "Cancelled",
      startDate: "2023-04-01",
      endDate: "2025-03-31",
      cost: 199,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalIndefinite: false,
      autoRenewalEndDate: null,
      iban: "DE12130000000012345678",
      sepaMandate: "SEPA-ADM-1011",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: "Studio Closure",
      cancelDate: "2025-03-01",
      cancelToDate: "2025-03-31",
      contractFormSnapshot: null,
      formData: null,
      discount: null,
      createdAt: "2023-04-01",
    },
  ],
  12: [
    {
      id: "ADM-1012",
      contractNumber: "ADM-1012",
      studioId: 12,
      studioName: "EnergyHub Hannover",
      contractType: "Premium License 24 Months",
      status: "Active",
      startDate: "2024-05-01",
      endDate: "2027-04-30",
      cost: 499,
      billingPeriod: "monthly",
      autoRenewal: true,
      renewalIndefinite: false,
      autoRenewalEndDate: "2029-04-30",
      iban: "DE50250500000123456789",
      sepaMandate: "SEPA-ADM-1012",
      bonusTime: null,
      pauseReason: null,
      pauseStartDate: null,
      pauseEndDate: null,
      cancelReason: null,
      cancelDate: null,
      cancelToDate: null,
      contractFormSnapshot: null,
      formData: null,
      discount: { percentage: 10, duration: "6", isPermanent: false },
      createdAt: "2024-05-01",
    },
  ],
}

// ============================================
// FLAT LIST of all admin contracts (for list view)
// ============================================
export const adminContractsFlatList = Object.values(adminContractsData).flat()

// ============================================
// CONTRACT HISTORY (per studio ID)
// ============================================
export const adminContractHistoryData = {
  1: [
    { id: 1, contractId: "ADM-1001", date: "2023-01-01", action: "Contract Created", details: "Premium License 24 Months – FitZone München" },
  ],
  2: [
    { id: 2, contractId: "ADM-1002", date: "2023-06-01", action: "Contract Created", details: "Premium License 24 Months – PowerHouse Berlin" },
  ],
  6: [
    { id: 3, contractId: "ADM-1006", date: "2022-01-01", action: "Contract Created", details: "Standard License 12 Months – SprintGym Stuttgart" },
    { id: 4, contractId: "ADM-1006", date: "2024-12-31", action: "Contract Expired", details: "Standard License 12 Months – SprintGym Stuttgart" },
  ],
}
