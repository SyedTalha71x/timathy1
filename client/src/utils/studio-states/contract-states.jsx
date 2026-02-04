// ============================================================================
// CONTRACT-STATES.JS - Vertrags-Daten
// ============================================================================
// Alle Contract-bezogenen Daten
// Member IDs entsprechen members-states.jsx
// 
// AUTO-RENEWAL SYSTEM:
// Contract-Type Felder (in configuration-states.jsx):
// - autoRenewal: boolean - Ob der Vertrag automatisch erneuert wird
// - renewalIndefinite: boolean - Ob unbegrenzte Erneuerung (true = kein Expiring)
// - renewalPeriod: number|null - Verlängerungsdauer in Monaten (null bei indefinite)
//
// Contract Felder (hier):
// - autoRenewal: boolean - Vom Contract-Type übernommen
// - renewalIndefinite: boolean - Vom Contract-Type übernommen
// - autoRenewalEndDate: string|null - Berechnetes maximales Enddatum
//   - null = unbegrenzte Auto-Erneuerung (kein "Expiring")
//   - "YYYY-MM-DD" = begrenzte Auto-Erneuerung (zeigt "Expiring" wenn Datum nähert)
//
// BEISPIEL CONTRACT TYPES:
// - Basic/Standard Monthly: autoRenewal=true, renewalIndefinite=true (unbegrenzt)
// - Annual Premium: autoRenewal=true, renewalIndefinite=false, renewalPeriod=12
// - Flex 10er Card: autoRenewal=false (keine Auto-Erneuerung)
// ============================================================================

// Helper function to get date relative to today
const getRelativeDate = (daysFromNow) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split("T")[0]
}

// Today's date for reference
const today = new Date().toISOString().split("T")[0]

export const initialContracts = [
  // ===== ACTIVE CONTRACTS =====
  {
    id: "contract-1",
    contractNumber: "2024-001",
    memberId: 1, // John Doe
    memberName: "John Doe",
    contractType: "Premium Unlimited",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    status: "Active",
    autoRenewal: true,
    renewalIndefinite: true, // Premium = unlimited renewal
    autoRenewalEndDate: null,
    changeReason: "upgrade", // Upgraded from Basic
    previousContractId: "contract-10",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "john@example.com",
    phone: "+1234567890",
    iban: "DE89370400440532013000",
    sepaMandate: "SEPA-2024-001",
  },
  {
    id: "contract-2",
    contractNumber: "2024-003",
    memberId: 3, // Michael Johnson
    memberName: "Michael Johnson",
    contractType: "Premium Unlimited",
    startDate: "2024-03-01",
    endDate: "2026-02-28",
    status: "Active",
    autoRenewal: true,
    renewalIndefinite: true, // Premium = unlimited renewal
    autoRenewalEndDate: null,
    changeReason: "upgrade",
    previousContractId: "contract-11",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "michael@example.com",
    phone: "+1234567892",
    iban: "DE89370400440532013002",
    sepaMandate: "SEPA-2024-003",
  },
  {
    id: "contract-3",
    contractNumber: "2024-004",
    memberId: 4, // Sarah Williams
    memberName: "Sarah Williams",
    contractType: "Annual Premium",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    status: "Active",
    autoRenewal: false,
    changeReason: "upgrade",
    previousContractId: "contract-13",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "sarah.w@example.com",
    phone: "+1234567893",
    iban: "DE89370400440532013003",
    sepaMandate: "SEPA-2024-004",
  },
  {
    id: "contract-4",
    contractNumber: "2024-005",
    memberId: 5, // David Brown
    memberName: "David Brown",
    contractType: "Basic Monthly",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    status: "Active",
    autoRenewal: true,
    renewalIndefinite: false, // Basic with limited renewal
    autoRenewalEndDate: "2026-08-31", // Max 12 months renewal
    changeReason: "renewal",
    previousContractId: "contract-14",
    pauseReason: null,
    cancelReason: null,
    isDigital: false,
    email: "david.brown@example.com",
    phone: "+1234567894",
    iban: "DE89370400440532013004",
    sepaMandate: "SEPA-2024-005",
  },
  {
    id: "contract-5",
    contractNumber: "2024-006",
    memberId: 6, // Emily Davis
    memberName: "Emily Davis",
    contractType: "Basic Monthly",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    status: "Active",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "emily.d@example.com",
    phone: "+1234567895",
    iban: "DE89370400440532013005",
    sepaMandate: "SEPA-2024-006",
  },
  
  // ===== EXPIRING SOON CONTRACTS (within 30 days) =====
  {
    id: "contract-6",
    contractNumber: "2024-008",
    memberId: 8, // Lisa Garcia
    memberName: "Lisa Garcia",
    contractType: "Premium Unlimited",
    startDate: "2024-02-01",
    endDate: getRelativeDate(2), // Expires in 2 days!
    status: "Active",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "lisa.g@example.com",
    phone: "+1234567897",
    iban: "DE89370400440532013007",
    sepaMandate: "SEPA-2024-008",
  },
  {
    id: "contract-7",
    contractNumber: "2024-009",
    memberId: 9, // Thomas Anderson
    memberName: "Thomas Anderson",
    contractType: "Basic Monthly",
    startDate: "2024-03-15",
    endDate: getRelativeDate(5), // Expires in 5 days!
    status: "Active",
    autoRenewal: true,
    renewalIndefinite: false, // Limited renewal
    autoRenewalEndDate: getRelativeDate(5), // Auto-renewal limit reached - will show expiring!
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "thomas.a@example.com",
    phone: "+1234567898",
    iban: "DE89370400440532013008",
    sepaMandate: "SEPA-2024-009",
  },
  {
    id: "contract-8",
    contractNumber: "2024-010",
    memberId: 10, // Jennifer Martinez
    memberName: "Jennifer Martinez",
    contractType: "Premium Unlimited",
    startDate: "2024-01-01",
    endDate: getRelativeDate(14), // Expires in 2 weeks!
    status: "Active",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "jennifer.m@example.com",
    phone: "+1234567899",
    iban: "DE89370400440532013009",
    sepaMandate: "SEPA-2024-010",
  },
  
  // ===== PAUSED CONTRACTS =====
  {
    id: "contract-9",
    contractNumber: "2023-002",
    memberId: 2, // Jane Smith
    memberName: "Jane Smith",
    contractType: "Basic Monthly",
    startDate: "2023-11-15",
    endDate: "2025-11-14",
    status: "Paused",
    autoRenewal: true,
    renewalIndefinite: false, // Limited renewal
    autoRenewalEndDate: "2026-11-14", // Max 12 months renewal
    changeReason: "new",
    previousContractId: null,
    pauseReason: "Vacation Leave",
    pauseStartDate: "2025-01-01",
    pauseEndDate: "2025-02-28",
    cancelReason: null,
    isDigital: false,
    email: "jane@example.com",
    phone: "+1234567891",
    iban: "DE89370400440532013001",
    sepaMandate: "SEPA-2023-002",
  },
  
  // ===== CANCELLED CONTRACTS (Previous contracts of members with Active ones) =====
  {
    id: "contract-10",
    contractNumber: "2022-001",
    memberId: 1, // John Doe (previous contract)
    memberName: "John Doe",
    contractType: "Basic Monthly",
    startDate: "2022-03-01",
    endDate: "2023-12-31",
    status: "Cancelled",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: "Upgraded to Premium",
    isDigital: true,
    email: "john@example.com",
    phone: "+1234567890",
    iban: "DE89370400440532013000",
    sepaMandate: "SEPA-2022-001",
  },
  {
    id: "contract-11",
    contractNumber: "2022-003",
    memberId: 3, // Michael Johnson (previous contract)
    memberName: "Michael Johnson",
    contractType: "Flex 10er Card",
    startDate: "2022-06-15",
    endDate: "2024-02-28",
    status: "Cancelled",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: "Upgraded to Premium",
    isDigital: false,
    email: "michael@example.com",
    phone: "+1234567892",
    iban: "DE89370400440532013002",
    sepaMandate: "SEPA-2022-003",
  },
  
  // ===== ONGOING CONTRACTS (not yet signed) =====
  {
    id: "contract-12",
    contractNumber: "2025-007",
    memberId: 7, // Robert Miller
    memberName: "Robert Miller",
    contractType: "Basic Monthly",
    startDate: getRelativeDate(7), // Starts in 1 week
    endDate: getRelativeDate(372), // 1 year from start
    status: "Ongoing",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "robert.m@example.com",
    phone: "+1234567896",
    iban: null,
    sepaMandate: null,
    signatureRequired: true,
  },
  
  // ===== CANCELLED/EXPIRED OLD CONTRACTS =====
  {
    id: "contract-13",
    contractNumber: "2022-004",
    memberId: 4, // Sarah Williams (old contract)
    memberName: "Sarah Williams",
    contractType: "Basic Monthly",
    startDate: "2022-01-10",
    endDate: "2024-01-09",
    status: "Cancelled",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: "Upgraded to Premium Plus",
    isDigital: false,
    email: "sarah.w@example.com",
    phone: "+1234567893",
    iban: "DE89370400440532013003",
    sepaMandate: "SEPA-2022-004",
  },
  {
    id: "contract-14",
    contractNumber: "2023-005",
    memberId: 5, // David Brown (old contract)
    memberName: "David Brown",
    contractType: "Flex 10er Card",
    startDate: "2023-01-01",
    endDate: "2024-06-30",
    status: "Cancelled",
    autoRenewal: false,
    changeReason: "new",
    previousContractId: null,
    pauseReason: null,
    cancelReason: "Renewed with Basic",
    isDigital: true,
    email: "david.brown@example.com",
    phone: "+1234567894",
    iban: "DE89370400440532013004",
    sepaMandate: "SEPA-2023-005",
  },
]

export const contractHistory = {
  "contract-1": [
    {
      id: "hist-1",
      date: "2024-01-01",
      action: "Contract Created",
      details: "New Premium contract signed (upgrade from Basic)",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Premium - 24 months",
    },
    {
      id: "hist-2",
      date: "2024-06-15",
      action: "Auto-Renewal Enabled",
      details: "Member enabled automatic renewal",
      performedBy: "John Doe",
      oldValue: "Disabled",
      newValue: "Enabled",
    },
  ],
  "contract-2": [
    {
      id: "hist-3",
      date: "2024-03-01",
      action: "Contract Created",
      details: "New Premium contract signed (upgrade from Bronze)",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Premium - 24 months",
    },
  ],
  "contract-6": [
    {
      id: "hist-4",
      date: "2024-02-01",
      action: "Contract Created",
      details: "New Premium contract signed",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Premium - 12 months",
    },
    {
      id: "hist-5",
      date: getRelativeDate(-30),
      action: "Renewal Reminder Sent",
      details: "30-day renewal reminder email sent",
      performedBy: "System",
      oldValue: null,
      newValue: "Email sent",
    },
  ],
  "contract-9": [
    {
      id: "hist-6",
      date: "2023-11-15",
      action: "Contract Created",
      details: "New Basic contract signed",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Basic - 24 months",
    },
    {
      id: "hist-7",
      date: "2025-01-01",
      action: "Contract Paused",
      details: "Paused due to Vacation Leave",
      performedBy: "Admin User",
      oldValue: "Active",
      newValue: "Paused until 2025-02-28",
    },
  ],
  "contract-10": [
    {
      id: "hist-8",
      date: "2022-03-01",
      action: "Contract Created",
      details: "New Basic contract signed",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Basic - 21 months",
    },
    {
      id: "hist-9",
      date: "2023-12-15",
      action: "Contract Cancelled",
      details: "Cancelled - Upgraded to Premium",
      performedBy: "Admin User",
      oldValue: "Active",
      newValue: "Cancelled",
    },
  ],
  "contract-12": [
    {
      id: "hist-10",
      date: today,
      action: "Contract Created",
      details: "New contract pending signature",
      performedBy: "Admin User",
      oldValue: null,
      newValue: "Basic - Pending Signature",
    },
  ],
}

export const sampleLeads = [
  {
    id: "lead-1",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+4915112345678",
    interestedIn: "Premium",
  },
  {
    id: "lead-2",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    phone: "+4915198765432",
    interestedIn: "Basic",
  },
  {
    id: "lead-3",
    name: "Tom Schmidt",
    email: "tom.schmidt@example.com",
    phone: "+4915111223344",
    interestedIn: "Premium Plus",
  },
  {
    id: "lead-4",
    name: "Anna Müller",
    email: "anna.mueller@example.com",
    phone: "+4915155667788",
    interestedIn: "Basic",
  },
]

// DEPRECATED: Use DEFAULT_CONTRACT_TYPES from configuration-states.jsx instead
// This array is kept for backwards compatibility but should not be used for new code
// Import from: import { DEFAULT_CONTRACT_TYPES } from './configuration-states'
export const contractTypes = [
  // Contract types are now defined in configuration-states.jsx
  // See DEFAULT_CONTRACT_TYPES for the current list:
  // - Basic Monthly
  // - Standard Monthly  
  // - Premium Unlimited
  // - Flex 10er Card
  // - Annual Premium
  // - Trial Week
]

export const mediaTemplates = [
  {
    id: "template-1",
    name: "Basic Introduction",
    description: "Standard introductory materials for new members",
    pages: [
      {
        id: "page-1",
        title: "Welcome to Our Studio",
        content: "Welcome message and overview of facilities",
        media: ["image1.jpg", "video1.mp4"]
      },
      {
        id: "page-2",
        title: "Studio Rules",
        content: "Important guidelines and policies",
        media: ["image2.jpg"]
      },
      {
        id: "page-3",
        title: "Getting Started",
        content: "How to begin your fitness journey",
        media: ["image3.jpg", "pdf-guide.pdf"]
      }
    ]
  },
  {
    id: "template-2",
    name: "Premium Package",
    description: "Comprehensive materials for premium members",
    pages: [
      {
        id: "page-1",
        title: "Premium Benefits",
        content: "Exclusive features for premium members",
        media: ["premium1.jpg", "video2.mp4"]
      },
      {
        id: "page-2",
        title: "Advanced Training",
        content: "Specialized workout programs",
        media: ["premium2.jpg"]
      }
    ]
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getContractById = (id) => initialContracts.find(c => c.id === id) || null

export const getContractsByMemberId = (memberId) => 
  initialContracts.filter(c => c.memberId === memberId)

export const getActiveContracts = () => 
  initialContracts.filter(c => c.status === "Active")

export const getPausedContracts = () => 
  initialContracts.filter(c => c.status === "Paused")

export const getCancelledContracts = () => 
  initialContracts.filter(c => c.status === "Cancelled")

export const getOngoingContracts = () => 
  initialContracts.filter(c => c.status === "Ongoing")

export const getExpiringContracts = (daysAhead = 30) => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysAhead)
  const today = new Date()
  
  return initialContracts.filter(c => {
    const endDate = new Date(c.endDate)
    return endDate <= futureDate && endDate > today && c.status === "Active"
  })
}

export const getExpiredContracts = () => {
  const today = new Date()
  return initialContracts.filter(c => {
    const endDate = new Date(c.endDate)
    return endDate < today
  })
}

export const getContractHistory = (contractId) => 
  contractHistory[contractId] || []

// Get the "display" contract for a member (Active > Paused > Ongoing > most recent Cancelled)
export const getDisplayContractForMember = (memberId) => {
  const memberContracts = getContractsByMemberId(memberId)
  if (memberContracts.length === 0) return null
  
  // Priority: Active > Paused > Ongoing > Cancelled (by end date)
  const active = memberContracts.find(c => c.status === 'Active')
  if (active) return active
  
  const paused = memberContracts.find(c => c.status === 'Paused')
  if (paused) return paused
  
  const ongoing = memberContracts.find(c => c.status === 'Ongoing')
  if (ongoing) return ongoing
  
  // Return most recent cancelled
  const cancelled = memberContracts
    .filter(c => c.status === 'Cancelled')
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
  
  return cancelled[0] || null
}

export default {
  initialContracts,
  contractHistory,
  sampleLeads,
  contractTypes,
  mediaTemplates,
  getContractById,
  getContractsByMemberId,
  getActiveContracts,
  getPausedContracts,
  getCancelledContracts,
  getOngoingContracts,
  getExpiringContracts,
  getExpiredContracts,
  getContractHistory,
  getDisplayContractForMember,
}
