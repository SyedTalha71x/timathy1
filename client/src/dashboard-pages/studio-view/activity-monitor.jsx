/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X,
  Search,
  RefreshCw,
  Archive,
  AlertTriangle,
  CalendarCheck,
  FileText,
  Mail,
  MailWarning,
  User,
  ChevronDown,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Bell,
  PauseCircle,
  CreditCard,
  UserCog,
  ArrowRight,
  MapPin,
  Phone,
  AtSign,
  Paperclip,
  Building,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

// Communication imports
import ChatPopup from "../../components/shared/ChatPopup"
import MessageTypeSelectionModal from "../../components/shared/MessageTypeSelectionModal"
import SendEmailModal from "../../components/shared/SendEmailModal"
import DraftModal from "../../components/shared/DraftModal"
import { membersData, staffData } from "../../utils/studio-states"

// ============================================
// Sample Data for Activity Monitor
// Using REAL IDs from app-states.jsx
// ============================================
const initialVacationRequests = [
  {
    id: "vac-1",
    staffId: 2, // John Trainer from staffData
    employeeFirstName: "John",
    employeeLastName: "Trainer",
    department: "Training",
    startDate: "2026-02-15",
    endDate: "2026-02-22",
    days: 6,
    reason: "Family vacation",
    status: "pending",
    submittedAt: "2026-01-18T10:30:00",
  },
  {
    id: "vac-2",
    staffId: 5, // Lisa Reception from staffData
    employeeFirstName: "Lisa",
    employeeLastName: "Reception",
    department: "Reception",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    days: 5,
    reason: "Personal matters",
    status: "pending",
    submittedAt: "2026-01-19T14:15:00",
  },
  {
    id: "vac-3",
    staffId: 3, // Sarah Coach from staffData
    employeeFirstName: "Sarah",
    employeeLastName: "Coach",
    department: "Training",
    startDate: "2026-01-25",
    endDate: "2026-01-26",
    days: 2,
    reason: "Medical appointment",
    status: "approved",
    submittedAt: "2026-01-15T09:00:00",
  },
]

const initialAppointmentRequests = [
  {
    id: "app-1",
    memberId: 1, // John Doe from membersData
    memberFirstName: "John",
    memberLastName: "Doe",
    appointmentType: "Trial Training",
    requestedDate: "2026-01-22",
    requestedTimeStart: "14:00",
    requestedTimeEnd: "15:00",
    trainer: "John Trainer",
    status: "pending",
    submittedAt: "2026-01-19T16:45:00",
  },
  {
    id: "app-2",
    memberId: 3, // Michael Johnson from membersData
    memberFirstName: "Michael",
    memberLastName: "Johnson",
    appointmentType: "Nutrition Consultation",
    requestedDate: "2026-01-23",
    requestedTimeStart: "10:00",
    requestedTimeEnd: "10:30",
    trainer: "Sarah Coach",
    status: "pending",
    submittedAt: "2026-01-18T11:20:00",
  },
  {
    id: "app-3",
    memberId: 4, // Sarah Williams from membersData
    memberFirstName: "Sarah",
    memberLastName: "Williams",
    appointmentType: "Personal Training",
    requestedDate: "2026-01-21",
    requestedTimeStart: "09:00",
    requestedTimeEnd: "10:00",
    trainer: "John Trainer",
    status: "approved",
    submittedAt: "2026-01-17T08:30:00",
  },
]

const initialExpiringContracts = [
  {
    id: "con-1",
    memberId: 10, // Jennifer Martinez from membersData
    memberFirstName: "Jennifer",
    memberLastName: "Martinez",
    membershipType: "Premium",
    contractStart: "2025-02-01",
    contractEnd: "2026-01-31",
    daysRemaining: 4,
    monthlyFee: 79.99,
    autoRenewal: false,
  },
  {
    id: "con-2",
    memberId: 8, // Lisa Garcia from membersData
    memberFirstName: "Lisa",
    memberLastName: "Garcia",
    membershipType: "Standard",
    contractStart: "2024-08-15",
    contractEnd: "2026-02-01",
    daysRemaining: 5,
    monthlyFee: 49.99,
    autoRenewal: true,
  },
  {
    id: "con-3",
    memberId: 4, // Sarah Williams from membersData
    memberFirstName: "Sarah",
    memberLastName: "Williams",
    membershipType: "Premium Plus",
    contractStart: "2025-03-01",
    contractEnd: "2026-02-09",
    daysRemaining: 13,
    monthlyFee: 99.99,
    autoRenewal: false,
  },
]

const initialFailedEmails = [
  {
    id: "mail-1",
    memberId: 5, // David Brown from membersData
    recipient: "david.brown@example.com",
    recipientFirstName: "David",
    recipientLastName: "Brown",
    subject: "Your Membership Confirmation",
    sentAt: "2026-01-19T08:00:00",
    errorType: "bounced",
    errorMessage: "Mailbox not found",
    retryCount: 2,
    recipientType: "member",
  },
  {
    id: "mail-2",
    memberId: 6, // Emily Davis from membersData
    recipient: "emily.davis@example.com",
    recipientFirstName: "Emily",
    recipientLastName: "Davis",
    subject: "Invoice January 2026",
    sentAt: "2026-01-18T14:30:00",
    errorType: "rejected",
    errorMessage: "Blocked by spam filter",
    retryCount: 1,
    recipientType: "member",
  },
  {
    id: "mail-3",
    staffId: 2, // John Trainer from staffData
    recipient: "john.trainer@studio.de",
    recipientFirstName: "John",
    recipientLastName: "Trainer",
    subject: "Shift Schedule Update",
    sentAt: "2026-01-19T09:15:00",
    errorType: "bounced",
    errorMessage: "Invalid email address",
    retryCount: 1,
    recipientType: "staff",
  },
  {
    id: "mail-4",
    staffId: 3, // Sarah Coach from staffData
    recipient: "sarah.coach@studio.de",
    recipientFirstName: "Sarah",
    recipientLastName: "Coach",
    subject: "Vacation Request Approved",
    sentAt: "2026-01-18T11:00:00",
    errorType: "rejected",
    errorMessage: "Mailbox full",
    retryCount: 3,
    recipientType: "staff",
  },
]

// NEW: Contract Pause Requests
const initialContractPauseRequests = [
  {
    id: "pause-1",
    memberId: 2, // Jane Smith from membersData
    memberFirstName: "Jane",
    memberLastName: "Smith",
    membershipType: "Premium",
    pauseStart: "2026-02-01",
    pauseEnd: "2026-03-15",
    pauseDuration: 6,
    reason: "Extended travel abroad",
    status: "pending",
    submittedAt: "2026-01-19T09:30:00",
    monthlyFee: 79.99,
    attachments: [],
  },
  {
    id: "pause-2",
    memberId: 6, // Emily Davis from membersData
    memberFirstName: "Emily",
    memberLastName: "Davis",
    membershipType: "Standard",
    pauseStart: "2026-02-15",
    pauseEnd: "2026-03-31",
    pauseDuration: 6,
    reason: "Medical recovery after surgery",
    status: "pending",
    submittedAt: "2026-01-18T16:00:00",
    monthlyFee: 49.99,
    attachments: [{ name: "medical_certificate.pdf", type: "pdf" }],
  },
  {
    id: "pause-3",
    memberId: 7, // Robert Miller from membersData
    memberFirstName: "Robert",
    memberLastName: "Miller",
    membershipType: "Premium Plus",
    pauseStart: "2026-01-20",
    pauseEnd: "2026-02-20",
    pauseDuration: 4,
    reason: "Work relocation",
    status: "approved",
    submittedAt: "2026-01-10T11:00:00",
    monthlyFee: 99.99,
    attachments: [{ name: "relocation_confirmation.pdf", type: "pdf" }],
  },
]

// NEW: Bank Data Change Requests
const initialBankDataRequests = [
  {
    id: "bank-1",
    memberId: 3, // Michael Johnson from membersData
    memberFirstName: "Michael",
    memberLastName: "Johnson",
    membershipType: "Premium",
    changeType: "fullBankChange",
    oldBankName: "Deutsche Bank",
    newBankName: "Commerzbank",
    oldIban: "DE89 3704 0044 0532 0130 00",
    newIban: "DE91 1000 0000 0123 4567 89",
    oldBic: "DEUTDEDB",
    newBic: "COBADEFF",
    status: "pending",
    submittedAt: "2026-01-19T14:20:00",
  },
  {
    id: "bank-2",
    memberId: 1, // John Doe from membersData
    memberFirstName: "John",
    memberLastName: "Doe",
    membershipType: "Standard",
    changeType: "accountHolder",
    oldValue: "John Doe",
    newValue: "John M. Doe",
    status: "pending",
    submittedAt: "2026-01-18T10:45:00",
  },
  {
    id: "bank-3",
    memberId: 9, // Thomas Anderson from membersData
    memberFirstName: "Thomas",
    memberLastName: "Anderson",
    membershipType: "Premium Plus",
    changeType: "fullBankChange",
    oldBankName: "Sparkasse Berlin",
    newBankName: "Deutsche Bank",
    oldIban: "DE12 5001 0517 0648 4898 90",
    newIban: "DE89 3704 0044 0532 0130 00",
    oldBic: "BELADEBE",
    newBic: "DEUTDEDB",
    status: "approved",
    submittedAt: "2026-01-15T09:00:00",
  },
]

// NEW: Member Data Change Requests
const initialMemberDataRequests = [
  {
    id: "member-1",
    memberId: 4, // Sarah Williams from membersData
    memberFirstName: "Sarah",
    memberLastName: "Williams",
    membershipType: "Premium",
    changeType: "address",
    fieldLabel: "Address",
    oldValue: "Hauptstraße 15, 10115 Berlin",
    newValue: "Parkweg 42, 10178 Berlin",
    status: "pending",
    submittedAt: "2026-01-19T11:30:00",
  },
  {
    id: "member-2",
    memberId: 8, // Lisa Garcia from membersData
    memberFirstName: "Lisa",
    memberLastName: "Garcia",
    membershipType: "Standard",
    changeType: "lastName",
    fieldLabel: "Last Name",
    oldValue: "Garcia",
    newValue: "Garcia-Rodriguez",
    status: "pending",
    submittedAt: "2026-01-18T15:00:00",
  },
  {
    id: "member-3",
    memberId: 9, // Thomas Anderson from membersData
    memberFirstName: "Thomas",
    memberLastName: "Anderson",
    membershipType: "Premium Plus",
    changeType: "email",
    fieldLabel: "Email",
    oldValue: "t.anderson@oldmail.de",
    newValue: "thomas.anderson@newmail.de",
    status: "pending",
    submittedAt: "2026-01-17T13:15:00",
  },
  {
    id: "member-4",
    memberId: 5, // David Brown from membersData
    memberFirstName: "David",
    memberLastName: "Brown",
    membershipType: "Standard",
    changeType: "phone",
    fieldLabel: "Phone",
    oldValue: "+49 170 1234567",
    newValue: "+49 151 9876543",
    status: "approved",
    submittedAt: "2026-01-14T10:00:00",
  },
]

// Helper: Get change type icon
const getChangeTypeIcon = (changeType) => {
  switch (changeType) {
    case "address": return MapPin
    case "phone": return Phone
    case "email": return AtSign
    case "lastName":
    case "firstName": return User
    case "iban":
    case "accountHolder": return CreditCard
    default: return FileText
  }
}

// ============================================
// Tab Configuration - Only Orange and Blue
// ============================================
const tabs = [
  { 
    id: "appointments", 
    label: "Appointment Requests", 
    icon: CalendarCheck,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  { 
    id: "contracts", 
    label: "Expiring Contracts", 
    icon: FileText,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  { 
    id: "contractPause", 
    label: "Contract Pauses", 
    icon: PauseCircle,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  { 
    id: "memberData", 
    label: "Member Data Changes", 
    icon: UserCog,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  { 
    id: "bankData", 
    label: "Bank Data Changes", 
    icon: CreditCard,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  { 
    id: "vacation", 
    label: "Vacation Requests", 
    icon: Calendar,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  { 
    id: "emails", 
    label: "Email Errors", 
    icon: MailWarning,
    color: "bg-gray-500",
    lightColor: "bg-gray-500/10",
    textColor: "text-gray-400"
  },
]

// ============================================
// Status Filter Options
// ============================================
const statusFilters = {
  vacation: [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ],
  appointments: [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Confirmed" },
    { id: "rejected", label: "Rejected" },
  ],
  contractPause: [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ],
  bankData: [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ],
  memberData: [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ],
  contracts: [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical (< 14 days)" },
    { id: "soon", label: "Soon (14-30 days)" },
    { id: "upcoming", label: "Upcoming (> 30 days)" },
  ],
  emails: [
    { id: "all", label: "All" },
    { id: "bounced", label: "Bounced" },
    { id: "rejected", label: "Rejected" },
  ],
}

export default function ActivityMonitor() {
  // Tab & Filter States
  const [activeTab, setActiveTab] = useState("appointments")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showArchived, setShowArchived] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  
  // Sort States
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  
  // Data States
  const [vacationRequests, setVacationRequests] = useState(initialVacationRequests)
  const [appointmentRequests, setAppointmentRequests] = useState(initialAppointmentRequests)
  const [expiringContracts, setExpiringContracts] = useState(initialExpiringContracts)
  const [failedEmails, setFailedEmails] = useState(initialFailedEmails)
  const [contractPauseRequests, setContractPauseRequests] = useState(initialContractPauseRequests)
  const [bankDataRequests, setBankDataRequests] = useState(initialBankDataRequests)
  const [memberDataRequests, setMemberDataRequests] = useState(initialMemberDataRequests)
  
  // Modal States
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const filterDropdownRef = useRef(null)

  // Communication Modal States (like members.jsx pattern)
  const [selectedMemberForContact, setSelectedMemberForContact] = useState(null)
  const [selectedMemberForEmail, setSelectedMemberForEmail] = useState(null)
  const [showMessageTypeModal, setShowMessageTypeModal] = useState(false)
  const [chatPopup, setChatPopup] = useState({ isOpen: false, member: null })
  const [showSendEmailModal, setShowSendEmailModal] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "", recipientName: "" })

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Reset filter when tab changes
  useEffect(() => {
    setStatusFilter("all")
    setSearchQuery("")
  }, [activeTab])

  // ============================================
  // Count Functions
  // ============================================
  const getCounts = () => {
    return {
      vacation: {
        total: vacationRequests.length,
        pending: vacationRequests.filter(r => r.status === "pending").length,
      },
      appointments: {
        total: appointmentRequests.length,
        pending: appointmentRequests.filter(r => r.status === "pending").length,
      },
      contractPause: {
        total: contractPauseRequests.length,
        pending: contractPauseRequests.filter(r => r.status === "pending").length,
      },
      bankData: {
        total: bankDataRequests.length,
        pending: bankDataRequests.filter(r => r.status === "pending").length,
      },
      memberData: {
        total: memberDataRequests.length,
        pending: memberDataRequests.filter(r => r.status === "pending").length,
      },
      contracts: {
        total: expiringContracts.length,
        critical: expiringContracts.filter(c => c.daysRemaining <= 14).length,
      },
      emails: {
        total: failedEmails.length,
      },
    }
  }
  const counts = getCounts()

  // ============================================
  // Filter & Sort Functions
  // ============================================
  const getFilteredData = () => {
    let data = []
    
    switch (activeTab) {
      case "vacation":
        data = [...vacationRequests]
        if (statusFilter !== "all") {
          data = data.filter(r => r.status === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(r => 
            `${r.employeeFirstName} ${r.employeeLastName}`.toLowerCase().includes(query) ||
            r.department.toLowerCase().includes(query)
          )
        }
        break
        
      case "appointments":
        data = [...appointmentRequests]
        if (statusFilter !== "all") {
          data = data.filter(r => r.status === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(r => 
            `${r.memberFirstName} ${r.memberLastName}`.toLowerCase().includes(query) ||
            r.appointmentType.toLowerCase().includes(query) ||
            r.trainer.toLowerCase().includes(query)
          )
        }
        break
        
      case "contractPause":
        data = [...contractPauseRequests]
        if (statusFilter !== "all") {
          data = data.filter(r => r.status === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(r => 
            `${r.memberFirstName} ${r.memberLastName}`.toLowerCase().includes(query) ||
            r.reason.toLowerCase().includes(query) ||
            r.membershipType.toLowerCase().includes(query)
          )
        }
        break
        
      case "bankData":
        data = [...bankDataRequests]
        if (statusFilter !== "all") {
          data = data.filter(r => r.status === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(r => 
            `${r.memberFirstName} ${r.memberLastName}`.toLowerCase().includes(query) ||
            r.changeType.toLowerCase().includes(query)
          )
        }
        break
        
      case "memberData":
        data = [...memberDataRequests]
        if (statusFilter !== "all") {
          data = data.filter(r => r.status === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(r => 
            `${r.memberFirstName} ${r.memberLastName}`.toLowerCase().includes(query) ||
            r.changeType.toLowerCase().includes(query) ||
            r.fieldLabel.toLowerCase().includes(query)
          )
        }
        break
        
      case "contracts":
        data = [...expiringContracts]
        if (statusFilter === "critical") {
          data = data.filter(c => c.daysRemaining <= 14)
        } else if (statusFilter === "soon") {
          data = data.filter(c => c.daysRemaining > 14 && c.daysRemaining <= 30)
        } else if (statusFilter === "upcoming") {
          data = data.filter(c => c.daysRemaining > 30)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(c => 
            `${c.memberFirstName} ${c.memberLastName}`.toLowerCase().includes(query) ||
            c.membershipType.toLowerCase().includes(query)
          )
        }
        break
        
      case "emails":
        data = [...failedEmails]
        if (statusFilter !== "all") {
          data = data.filter(e => e.errorType === statusFilter)
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          data = data.filter(e => 
            e.recipient.toLowerCase().includes(query) ||
            `${e.recipientFirstName} ${e.recipientLastName}`.toLowerCase().includes(query) ||
            e.subject.toLowerCase().includes(query)
          )
        }
        break
    }
    
    // Sort
    data.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          const dateA = a.submittedAt || a.sentAt || a.contractEnd
          const dateB = b.submittedAt || b.sentAt || b.contractEnd
          comparison = new Date(dateA) - new Date(dateB)
          break
        case "name":
          const nameA = `${a.employeeFirstName || a.memberFirstName || a.recipientFirstName} ${a.employeeLastName || a.memberLastName || a.recipientLastName}`
          const nameB = `${b.employeeFirstName || b.memberFirstName || b.recipientFirstName} ${b.employeeLastName || b.memberLastName || b.recipientLastName}`
          comparison = nameA.localeCompare(nameB)
          break
        case "urgency":
          if (activeTab === "contracts") {
            comparison = a.daysRemaining - b.daysRemaining
          }
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    return data
  }

  // ============================================
  // Action Handlers
  // ============================================
  const handleApprove = (id, type) => {
    if (type === "vacation") {
      setVacationRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
      )
      toast.success("Vacation request approved")
    } else if (type === "appointment") {
      setAppointmentRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
      )
      toast.success("Appointment request confirmed")
    } else if (type === "contractPause") {
      setContractPauseRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
      )
      toast.success("Contract pause approved")
    } else if (type === "bankData") {
      setBankDataRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
      )
      toast.success("Bank data change approved")
    } else if (type === "memberData") {
      setMemberDataRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
      )
      toast.success("Member data change approved")
    }
  }

  const handleReject = (id, type) => {
    if (type === "vacation") {
      setVacationRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
      )
      toast.success("Vacation request rejected")
    } else if (type === "appointment") {
      setAppointmentRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
      )
      toast.success("Appointment request rejected")
    } else if (type === "contractPause") {
      setContractPauseRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
      )
      toast.success("Contract pause rejected")
    } else if (type === "bankData") {
      setBankDataRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
      )
      toast.success("Bank data change rejected")
    } else if (type === "memberData") {
      setMemberDataRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
      )
      toast.success("Member data change rejected")
    }
  }

  const handleRetryEmail = (id) => {
    toast.success("Resending email...")
    // In production: trigger email resend
  }

  // ============================================
  // Communication Handlers
  // ============================================
  const handleContactMember = (item) => {
    // Find the real member data from membersData based on memberId
    const memberId = item.memberId
    const realMember = memberId ? membersData.find(m => m.id === memberId) : null
    
    const memberData = realMember ? {
      id: realMember.id,
      firstName: realMember.firstName,
      lastName: realMember.lastName,
      email: realMember.email,
      image: realMember.image,
      type: 'member'
    } : {
      // Fallback if no real member found
      id: item.id,
      firstName: item.memberFirstName,
      lastName: item.memberLastName,
      email: item.email || `${item.memberFirstName?.toLowerCase()}.${item.memberLastName?.toLowerCase()}@example.com`,
      image: null,
      type: 'member'
    }
    
    setSelectedMemberForContact(memberData)
    setShowMessageTypeModal(true)
  }

  const handleSelectAppChat = () => {
    // Copy member to chatPopup state (like members.jsx pattern)
    if (selectedMemberForContact) {
      setChatPopup({
        isOpen: true,
        member: selectedMemberForContact
      })
    }
  }

  const handleSelectEmail = () => {
    // Copy member to separate email state (like members.jsx pattern)
    if (selectedMemberForContact) {
      setSelectedMemberForEmail(selectedMemberForContact)
      setEmailData({
        to: selectedMemberForContact.email || "",
        subject: "",
        body: "",
        recipientName: `${selectedMemberForContact.firstName || ""} ${selectedMemberForContact.lastName || ""}`.trim()
      })
      setShowSendEmailModal(true)
    }
  }

  const handleCloseChatPopup = () => {
    setChatPopup({ isOpen: false, member: null })
  }

  const handleCloseEmailModal = () => {
    // Check if there's unsaved content
    if (emailData.subject || emailData.body) {
      setShowDraftModal(true)
    } else {
      setShowSendEmailModal(false)
      setSelectedMemberForEmail(null)
      setEmailData({ to: "", subject: "", body: "", recipientName: "" })
    }
  }

  const handleSendEmail = (data) => {
    toast.success(`Email sent to ${data.to}`)
    setShowSendEmailModal(false)
    setSelectedMemberForEmail(null)
    setEmailData({ to: "", subject: "", body: "", recipientName: "" })
  }

  const handleSaveAsDraft = () => {
    toast.success("Email saved as draft")
    setShowDraftModal(false)
    setShowSendEmailModal(false)
    setSelectedMemberForEmail(null)
    setEmailData({ to: "", subject: "", body: "", recipientName: "" })
  }

  const handleDiscardDraft = () => {
    setShowDraftModal(false)
    setShowSendEmailModal(false)
    setSelectedMemberForEmail(null)
    setEmailData({ to: "", subject: "", body: "", recipientName: "" })
  }

  const handleSearchMemberForEmail = (query) => {
    if (!query) return []
    const q = query.toLowerCase()
    return membersData.filter(m => 
      m.firstName?.toLowerCase().includes(q) ||
      m.lastName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    ).map(m => ({
      id: m.id,
      email: m.email,
      name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      firstName: m.firstName,
      lastName: m.lastName,
      image: m.image,
      type: 'member'
    })).slice(0, 10)
  }

  const handleRefresh = () => {
    setLastRefresh(new Date())
    toast.success("Data refreshed")
  }

  // ============================================
  // Format Helpers
  // ============================================
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatTimeAgo = (dateStr) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      bounced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    }
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      bounced: "Bounced",
    }
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getUrgencyBadge = (days) => {
    if (days <= 7) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">Critical</span>
    }
    if (days <= 14) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">Urgent</span>
    }
    if (days <= 30) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Soon</span>
    }
    return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">Upcoming</span>
  }

  const maskIban = (iban) => {
    if (!iban) return "N/A"
    const cleaned = iban.replace(/\s/g, '')
    if (cleaned.length < 8) return iban
    return `${cleaned.slice(0, 4)} **** **** ${cleaned.slice(-4)}`
  }

  // Sort options based on active tab
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "name", label: "Name" },
    ...(activeTab === "contracts" ? [{ value: "urgency", label: "Urgency" }] : []),
  ]

  const filteredData = getFilteredData()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: "#333", color: "#fff" },
        }}
      />
      
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
        {/* ============================================ */}
        {/* Header */}
        {/* ============================================ */}
        <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-white oxanium_font text-xl md:text-2xl">Activity Monitor</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              Updated: {lastRefresh.toLocaleTimeString("en-GB")}
            </span>
            
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-[#161616] hover:bg-[#2F2F2F] rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* Stats Overview Cards - Scrollable on smaller screens */}
        {/* ============================================ */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-4 lg:grid-cols-7 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const count = counts[tab.id]
            const pendingCount = count.pending || count.critical || 0
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative p-4 rounded-2xl transition-all duration-200 text-left min-w-[140px] md:min-w-0
                  ${isActive 
                    ? `${tab.color} shadow-lg` 
                    : 'bg-[#161616] hover:bg-[#1F1F1F]'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'} truncate`}>
                      {tab.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${isActive ? 'text-white' : 'text-white'}`}>
                      {count.total}
                    </p>
                    {pendingCount > 0 && (
                      <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : tab.textColor}`}>
                        {pendingCount} {tab.id === "contracts" ? "critical" : "pending"}
                      </p>
                    )}
                  </div>
                  <div className={`
                    p-2 rounded-xl flex-shrink-0
                    ${isActive ? 'bg-white/20' : tab.lightColor}
                  `}>
                    <tab.icon size={18} className={isActive ? 'text-white' : tab.textColor} />
                  </div>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
        </div>

        {/* ============================================ */}
        {/* Search & Filter Bar */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label || ''}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700/50 outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-[#161616] border border-gray-700/50 rounded-xl text-sm hover:bg-[#1F1F1F] transition-colors min-w-[140px]"
            >
              <Filter size={16} className="text-gray-400" />
              <span className="text-gray-300">
                {statusFilters[activeTab]?.find(f => f.id === statusFilter)?.label || "All"}
              </span>
              <ChevronDown size={14} className="text-gray-400 ml-auto" />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-700">
                    Filter by Status
                  </div>
                  {statusFilters[activeTab]?.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setStatusFilter(filter.id)
                        setShowFilterDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                        statusFilter === filter.id ? 'text-white bg-gray-800/50' : 'text-gray-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-[#161616] border border-gray-700/50 rounded-xl text-sm hover:bg-[#1F1F1F] transition-colors min-w-[130px]"
            >
              {sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span className="text-gray-300">
                {sortOptions.find(s => s.value === sortBy)?.label || "Date"}
              </span>
              <ChevronDown size={14} className="text-gray-400 ml-auto" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-700">
                    Sort by
                  </div>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (sortBy === option.value) {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                        } else {
                          setSortBy(option.value)
                          setSortDirection("desc")
                        }
                        setShowSortDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                        sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* Content Area */}
        {/* ============================================ */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="bg-[#161616] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {activeTab === "vacation" && <Calendar size={28} className="text-gray-500" />}
                {activeTab === "appointments" && <CalendarCheck size={28} className="text-gray-500" />}
                {activeTab === "contractPause" && <PauseCircle size={28} className="text-gray-500" />}
                {activeTab === "bankData" && <CreditCard size={28} className="text-gray-500" />}
                {activeTab === "memberData" && <UserCog size={28} className="text-gray-500" />}
                {activeTab === "contracts" && <FileText size={28} className="text-gray-500" />}
                {activeTab === "emails" && <MailWarning size={28} className="text-gray-500" />}
              </div>
              <p className="text-gray-400 text-lg">No entries found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery ? "Try a different search term" : "No open requests at the moment"}
              </p>
            </div>
          ) : (
            <>
              {/* ============================================ */}
              {/* Vacation Requests */}
              {/* ============================================ */}
              {activeTab === "vacation" && filteredData.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Grid Layout für perfektes Alignment */}
                  <div className="hidden md:grid md:grid-cols-[280px_240px_100px_1fr] gap-4 items-center">
                    {/* Col 1: Employee Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(request.employeeFirstName, request.employeeLastName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{request.employeeFirstName} {request.employeeLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 truncate">{request.department}</p>
                      </div>
                    </div>
                    
                    {/* Col 2: Date Range */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                    </div>
                    
                    {/* Col 3: Days */}
                    <div className="flex items-center justify-center">
                      <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg">
                        <span className="text-blue-400 font-medium text-sm">{request.days} days</span>
                      </div>
                    </div>
                    
                    {/* Col 4: Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(request.id, "vacation")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-sm font-medium transition-colors"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id, "vacation")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(request.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(request.employeeFirstName, request.employeeLastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{request.employeeFirstName} {request.employeeLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5">{request.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-300">{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                      </div>
                      <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg">
                        <span className="text-blue-400 font-medium">{request.days} days</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(request.id, "vacation")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-sm font-medium transition-colors"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id, "vacation")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Reason */}
                  {request.reason && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-gray-400 text-sm">
                        <span className="text-gray-500">Reason:</span> {request.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* ============================================ */}
              {/* Appointment Requests */}
              {/* ============================================ */}
              {activeTab === "appointments" && filteredData.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Grid Layout für perfektes Alignment */}
                  <div className="hidden md:grid md:grid-cols-[280px_130px_150px_160px_1fr] gap-4 items-center">
                    {/* Col 1: Member Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(request.memberFirstName, request.memberLastName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 truncate">
                          {request.appointmentType}
                        </p>
                      </div>
                    </div>
                    
                    {/* Col 2: Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300">{formatDate(request.requestedDate)}</span>
                    </div>
                    
                    {/* Col 3: Time */}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300">{request.requestedTimeStart} - {request.requestedTimeEnd}</span>
                    </div>
                    
                    {/* Col 4: Trainer */}
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300 truncate">{request.trainer}</span>
                    </div>
                    
                    {/* Col 5: Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(request.id, "appointment")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                          >
                            <Check size={16} />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id, "appointment")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(request.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(request.memberFirstName, request.memberLastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5">{request.appointmentType}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-300">{formatDate(request.requestedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-gray-300">{request.requestedTimeStart} - {request.requestedTimeEnd}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="text-gray-300">{request.trainer}</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(request.id, "appointment")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                        >
                          <Check size={16} />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id, "appointment")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* ============================================ */}
              {/* Contract Pause Requests (NEW) */}
              {/* ============================================ */}
              {activeTab === "contractPause" && filteredData.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[280px_200px_120px_1fr] gap-4 items-center">
                    {/* Col 1: Member Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <PauseCircle size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 truncate">{request.membershipType}</p>
                      </div>
                    </div>
                    
                    {/* Col 2: Pause Period */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        {formatDate(request.pauseStart)} - {formatDate(request.pauseEnd)}
                      </span>
                    </div>
                    
                    {/* Col 3: Duration */}
                    <div className="flex items-center justify-center">
                      <div className="px-3 py-1.5 bg-orange-500/10 rounded-lg">
                        <span className="text-orange-400 font-medium text-sm">{request.pauseDuration} weeks</span>
                      </div>
                    </div>
                    
                    {/* Col 4: Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(request.id, "contractPause")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id, "contractPause")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(request.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <PauseCircle size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5">{request.membershipType}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-300">{formatDate(request.pauseStart)} - {formatDate(request.pauseEnd)}</span>
                      </div>
                      <div className="px-3 py-1.5 bg-orange-500/10 rounded-lg">
                        <span className="text-orange-400 font-medium">{request.pauseDuration} weeks</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(request.id, "contractPause")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id, "contractPause")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Reason & Attachments */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-gray-400 text-sm">
                      <span className="text-gray-500">Reason:</span> {request.reason}
                    </p>
                    {request.attachments && request.attachments.length > 0 && (
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg text-sm text-gray-300 transition-colors">
                        <Paperclip size={14} />
                        <span>{request.attachments.length} Attachment{request.attachments.length > 1 ? 's' : ''}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* ============================================ */}
              {/* Bank Data Change Requests (NEW) */}
              {/* ============================================ */}
              {activeTab === "bankData" && filteredData.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[260px_1fr_1fr] gap-4 items-start">
                    {/* Col 1: Member Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <CreditCard size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 truncate">
                          {request.changeType === "fullBankChange" ? "Bank Account Change" : "Account Holder Change"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Col 2: Old/New Values */}
                    <div className="bg-[#1A1A1A] rounded-xl p-4">
                      {request.changeType === "fullBankChange" ? (
                        <div className="space-y-3">
                          {/* Bank Name */}
                          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Bank</p>
                              <p className="text-gray-400 text-sm">{request.oldBankName}</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-600" />
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Bank</p>
                              <p className="text-white text-sm">{request.newBankName}</p>
                            </div>
                          </div>
                          {/* IBAN */}
                          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center pt-2 border-t border-gray-800">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">IBAN</p>
                              <p className="text-gray-400 text-xs font-mono">{maskIban(request.oldIban)}</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-600" />
                            <div>
                              <p className="text-gray-500 text-xs mb-1">IBAN</p>
                              <p className="text-white text-xs font-mono">{maskIban(request.newIban)}</p>
                            </div>
                          </div>
                          {/* BIC */}
                          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center pt-2 border-t border-gray-800">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">BIC</p>
                              <p className="text-gray-400 text-xs font-mono">{request.oldBic}</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-600" />
                            <div>
                              <p className="text-gray-500 text-xs mb-1">BIC</p>
                              <p className="text-white text-xs font-mono">{request.newBic}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Previous</p>
                            <p className="text-gray-400 text-sm">{request.oldValue}</p>
                          </div>
                          <ArrowRight size={16} className="text-gray-600" />
                          <div>
                            <p className="text-gray-500 text-xs mb-1">New</p>
                            <p className="text-white text-sm">{request.newValue}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Col 3: Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(request.id, "bankData")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id, "bankData")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(request.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <CreditCard size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{request.memberFirstName} {request.memberLastName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5">
                          {request.changeType === "fullBankChange" ? "Bank Account Change" : "Account Holder Change"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Old/New Values */}
                    <div className="bg-[#1A1A1A] rounded-xl p-4">
                      {request.changeType === "fullBankChange" ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Bank</p>
                            <p className="text-gray-400 text-sm">{request.oldBankName} <ArrowRight size={12} className="inline text-gray-600 mx-1" /> <span className="text-white">{request.newBankName}</span></p>
                          </div>
                          <div className="pt-2 border-t border-gray-800">
                            <p className="text-gray-500 text-xs mb-1">IBAN</p>
                            <p className="text-gray-400 text-xs font-mono">{maskIban(request.oldIban)}</p>
                            <p className="text-white text-xs font-mono mt-1">{maskIban(request.newIban)}</p>
                          </div>
                          <div className="pt-2 border-t border-gray-800">
                            <p className="text-gray-500 text-xs mb-1">BIC</p>
                            <p className="text-gray-400 text-xs font-mono">{request.oldBic} <ArrowRight size={12} className="inline text-gray-600 mx-1" /> <span className="text-white">{request.newBic}</span></p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Previous</p>
                            <p className="text-gray-400 text-sm">{request.oldValue}</p>
                          </div>
                          <div className="flex justify-center">
                            <ArrowDown size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">New</p>
                            <p className="text-white text-sm">{request.newValue}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(request.id, "bankData")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id, "bankData")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* ============================================ */}
              {/* Member Data Change Requests (NEW) */}
              {/* ============================================ */}
              {activeTab === "memberData" && filteredData.map((request) => {
                const ChangeIcon = getChangeTypeIcon(request.changeType)
                return (
                  <div
                    key={request.id}
                    className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-[260px_1fr_1fr] gap-4 items-start">
                      {/* Col 1: Member Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <ChangeIcon size={22} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{request.memberFirstName} {request.memberLastName}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5 truncate">
                            {request.fieldLabel} Change
                          </p>
                        </div>
                      </div>
                      
                      {/* Col 2: Old/New Values */}
                      <div className="bg-[#1A1A1A] rounded-xl p-4">
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                          <div className="min-w-0">
                            <p className="text-gray-500 text-xs mb-1">Previous</p>
                            <p className="text-gray-400 text-sm truncate" title={request.oldValue}>
                              {request.oldValue}
                            </p>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowRight size={16} className="text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 text-xs mb-1">New</p>
                            <p className="text-white text-sm truncate" title={request.newValue}>
                              {request.newValue}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Col 3: Actions */}
                      <div className="flex items-center gap-2 justify-end">
                        {request.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleApprove(request.id, "memberData")}
                              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                            >
                              <Check size={16} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(request.id, "memberData")}
                              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                            >
                              <X size={16} />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(request.submittedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <ChangeIcon size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{request.memberFirstName} {request.memberLastName}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5">{request.fieldLabel} Change</p>
                        </div>
                      </div>
                      
                      {/* Old/New Values */}
                      <div className="bg-[#1A1A1A] rounded-xl p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Previous</p>
                            <p className="text-gray-400 text-sm">{request.oldValue}</p>
                          </div>
                          <div className="flex justify-center">
                            <ArrowDown size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">New</p>
                            <p className="text-white text-sm">{request.newValue}</p>
                          </div>
                        </div>
                      </div>
                      
                      {request.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(request.id, "memberData")}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id, "memberData")}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* ============================================ */}
              {/* Expiring Contracts */}
              {/* ============================================ */}
              {activeTab === "contracts" && filteredData.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Grid Layout für perfektes Alignment */}
                  <div className="hidden md:grid md:grid-cols-[280px_120px_100px_90px_140px_1fr] gap-4 items-center">
                    {/* Col 1: Member Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(contract.memberFirstName, contract.memberLastName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{contract.memberFirstName} {contract.memberLastName}</h3>
                          {getUrgencyBadge(contract.daysRemaining)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 truncate">{contract.membershipType}</p>
                      </div>
                    </div>
                    
                    {/* Col 2: Contract End */}
                    <div className="text-sm">
                      <p className="text-gray-500 text-xs">Contract End</p>
                      <p className="text-gray-300">{formatDate(contract.contractEnd)}</p>
                    </div>
                    
                    {/* Col 3: Remaining */}
                    <div className="text-sm">
                      <p className="text-gray-500 text-xs">Remaining</p>
                      <p className={`font-medium ${
                        contract.daysRemaining <= 7 ? 'text-red-400' :
                        contract.daysRemaining <= 14 ? 'text-orange-400' :
                        'text-white'
                      }`}>
                        {contract.daysRemaining} days
                      </p>
                    </div>
                    
                    {/* Col 4: Monthly */}
                    <div className="text-sm">
                      <p className="text-gray-500 text-xs">Monthly</p>
                      <p className="text-white font-medium">€{contract.monthlyFee.toFixed(2)}</p>
                    </div>
                    
                    {/* Col 5: Auto-Renewal */}
                    <div className="text-sm">
                      {contract.autoRenewal ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle size={14} />
                          Auto-Renewal
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <XCircle size={14} />
                          No Auto-Renewal
                        </span>
                      )}
                    </div>
                    
                    {/* Col 6: Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleContactMember(contract)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        <Mail size={16} />
                        <span>Contact</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(contract)
                          setIsDetailModalOpen(true)
                        }}
                        className="p-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getInitials(contract.memberFirstName, contract.memberLastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{contract.memberFirstName} {contract.memberLastName}</h3>
                          {getUrgencyBadge(contract.daysRemaining)}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5">{contract.membershipType}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Contract End</p>
                        <p className="text-gray-300">{formatDate(contract.contractEnd)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Remaining</p>
                        <p className={`font-medium ${contract.daysRemaining <= 14 ? 'text-orange-400' : 'text-white'}`}>
                          {contract.daysRemaining} days
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Monthly</p>
                        <p className="text-white font-medium">€{contract.monthlyFee.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContactMember(contract)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        <Mail size={16} />
                        <span>Contact</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(contract)
                          setIsDetailModalOpen(true)
                        }}
                        className="p-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* ============================================ */}
              {/* Failed Emails */}
              {/* ============================================ */}
              {activeTab === "emails" && filteredData.map((email) => {
                const isStaff = email.recipientType === "staff"
                return (
                  <div
                    key={email.id}
                    className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Grid Layout - Fixed alignment with items-start */}
                    <div className="hidden md:grid md:grid-cols-[280px_1fr_80px_1fr] gap-4 items-start">
                      {/* Col 1: Recipient Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                          isStaff 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-br from-orange-500 to-orange-600'
                        }`}>
                          <MailWarning size={22} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{email.recipientFirstName} {email.recipientLastName}</h3>
                            {getStatusBadge(email.errorType)}
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5 truncate">{email.recipient}</p>
                        </div>
                      </div>
                      
                      {/* Col 2: Subject & Error - aligned to top */}
                      <div className="min-w-0 pt-1">
                        <p className="text-gray-300 text-sm truncate">{email.subject}</p>
                        <p className="text-red-400 text-xs mt-1">{email.errorMessage}</p>
                      </div>
                      
                      {/* Col 3: Retry Count - aligned to center of first row */}
                      <div className="text-center pt-2">
                        <span className="text-xs text-gray-500">{email.retryCount}x tried</span>
                      </div>
                      
                      {/* Col 4: Actions - aligned to center of first row */}
                      <div className="flex items-start justify-end pt-0.5">
                        <button
                          onClick={() => handleRetryEmail(email.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
                            isStaff 
                              ? 'bg-blue-500 hover:bg-blue-600' 
                              : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                        >
                          <RefreshCw size={16} />
                          <span>Resend</span>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                          isStaff 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-br from-orange-500 to-orange-600'
                        }`}>
                          <MailWarning size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{email.recipientFirstName} {email.recipientLastName}</h3>
                            {getStatusBadge(email.errorType)}
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5 truncate">{email.recipient}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">{email.subject}</p>
                        <p className="text-red-400 text-xs mt-1">{email.errorMessage}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{email.retryCount}x tried</span>
                        <button
                          onClick={() => handleRetryEmail(email.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
                            isStaff 
                              ? 'bg-blue-500 hover:bg-blue-600' 
                              : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                        >
                          <RefreshCw size={16} />
                          <span>Resend</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Communication Modals */}
      <MessageTypeSelectionModal
        isOpen={showMessageTypeModal}
        onClose={() => {
          setShowMessageTypeModal(false)
          setSelectedMemberForContact(null)
        }}
        member={selectedMemberForContact}
        onSelectAppChat={handleSelectAppChat}
        onSelectEmail={handleSelectEmail}
        context="member"
      />

      {chatPopup.isOpen && chatPopup.member && (
        <ChatPopup
          member={chatPopup.member}
          isOpen={chatPopup.isOpen}
          onClose={handleCloseChatPopup}
          context="member"
        />
      )}

      <SendEmailModal
        showEmailModal={showSendEmailModal}
        handleCloseEmailModal={handleCloseEmailModal}
        handleSendEmail={handleSendEmail}
        emailData={emailData}
        setEmailData={setEmailData}
        handleSearchMemberForEmail={handleSearchMemberForEmail}
        preselectedMember={selectedMemberForEmail}
      />

      <DraftModal
        show={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onDiscard={handleDiscardDraft}
        onSave={handleSaveAsDraft}
      />
    </>
  )
}
