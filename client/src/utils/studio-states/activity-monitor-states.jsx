// Activity Monitor States
// Shared data between Activity Monitor page and Sidebar
// Keep in sync with activity-monitor.jsx

import {
  Calendar,
  CalendarCheck,
  FileText,
  MailWarning,
  PauseCircle,
  CreditCard,
  UserCog,
} from "lucide-react"

// ============================================
// Tab Configuration - matches activity-monitor.jsx
// ============================================
export const activityMonitorTabs = [
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
// Sample Data - matches activity-monitor.jsx
// ============================================

// Vacation Requests (Staff) - Blue
export const initialVacationRequests = [
  {
    id: "vac-1",
    staffId: 2,
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
    staffId: 5,
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
    staffId: 3,
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

// Appointment Requests (Members) - Orange
export const initialAppointmentRequests = [
  {
    id: "app-1",
    memberId: 1,
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
    memberId: 3,
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
    memberId: 4,
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

// Expiring Contracts - Orange
export const initialExpiringContracts = [
  {
    id: "con-1",
    memberId: 10,
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
    memberId: 8,
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
    memberId: 4,
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

// Failed Emails - Gray
export const initialFailedEmails = [
  {
    id: "mail-1",
    memberId: 5,
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
    memberId: 6,
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
    staffId: 2,
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
    staffId: 3,
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

// Contract Pause Requests - Orange
export const initialContractPauseRequests = [
  {
    id: "pause-1",
    memberId: 2,
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
    memberId: 6,
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
    memberId: 7,
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

// Bank Data Change Requests - Orange
export const initialBankDataRequests = [
  {
    id: "bank-1",
    memberId: 3,
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
    memberId: 1,
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
    memberId: 9,
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

// Member Data Change Requests - Orange
export const initialMemberDataRequests = [
  {
    id: "member-1",
    memberId: 4,
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
    memberId: 8,
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
    memberId: 9,
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
    memberId: 5,
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

// ============================================
// Helper: Format time ago
// ============================================
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return "Just now"
}

// ============================================
// Generate categorized Activity Items for Sidebar
// Groups items by category with pending items only
// ============================================
export const generateSidebarActivityItems = () => {
  const categories = {}
  
  // Appointment Requests (pending only) - Orange
  const pendingAppointments = initialAppointmentRequests.filter(a => a.status === "pending")
  if (pendingAppointments.length > 0) {
    categories.appointments = {
      tabId: "appointments",
      label: "Appointment Requests",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      icon: CalendarCheck,
      count: pendingAppointments.length,
      items: pendingAppointments.map(item => ({
        id: item.id,
        tabId: "appointments",
        title: `${item.memberFirstName} ${item.memberLastName}`,
        subtitle: item.appointmentType,
        description: `${item.requestedDate} at ${item.requestedTimeStart}`,
        time: formatTimeAgo(item.submittedAt),
        status: item.status,
        data: item,
      }))
    }
  }
  
  // Expiring Contracts (critical < 14 days) - Orange
  const criticalContracts = initialExpiringContracts.filter(c => c.daysRemaining <= 14)
  if (criticalContracts.length > 0) {
    categories.contracts = {
      tabId: "contracts",
      label: "Expiring Contracts",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      icon: FileText,
      count: criticalContracts.length,
      items: criticalContracts.map(item => ({
        id: item.id,
        tabId: "contracts",
        title: `${item.memberFirstName} ${item.memberLastName}`,
        subtitle: item.membershipType,
        description: `Expires in ${item.daysRemaining} days`,
        time: `${item.daysRemaining}d left`,
        status: item.daysRemaining <= 7 ? "critical" : "warning",
        data: item,
      }))
    }
  }
  
  // Contract Pause Requests (pending only) - Orange
  const pendingPauses = initialContractPauseRequests.filter(p => p.status === "pending")
  if (pendingPauses.length > 0) {
    categories.contractPause = {
      tabId: "contractPause",
      label: "Contract Pauses",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      icon: PauseCircle,
      count: pendingPauses.length,
      items: pendingPauses.map(item => ({
        id: item.id,
        tabId: "contractPause",
        title: `${item.memberFirstName} ${item.memberLastName}`,
        subtitle: `${item.pauseDuration} weeks`,
        description: item.reason,
        time: formatTimeAgo(item.submittedAt),
        status: item.status,
        data: item,
      }))
    }
  }
  
  // Member Data Changes (pending only) - Orange
  const pendingMemberData = initialMemberDataRequests.filter(m => m.status === "pending")
  if (pendingMemberData.length > 0) {
    categories.memberData = {
      tabId: "memberData",
      label: "Member Data Changes",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      icon: UserCog,
      count: pendingMemberData.length,
      items: pendingMemberData.map(item => ({
        id: item.id,
        tabId: "memberData",
        title: `${item.memberFirstName} ${item.memberLastName}`,
        subtitle: item.fieldLabel,
        description: `${item.oldValue} → ${item.newValue}`,
        time: formatTimeAgo(item.submittedAt),
        status: item.status,
        data: item,
      }))
    }
  }
  
  // Bank Data Changes (pending only) - Orange
  const pendingBankData = initialBankDataRequests.filter(b => b.status === "pending")
  if (pendingBankData.length > 0) {
    categories.bankData = {
      tabId: "bankData",
      label: "Bank Data Changes",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      icon: CreditCard,
      count: pendingBankData.length,
      items: pendingBankData.map(item => ({
        id: item.id,
        tabId: "bankData",
        title: `${item.memberFirstName} ${item.memberLastName}`,
        subtitle: item.changeType === "fullBankChange" ? "Bank Change" : "Account Holder",
        description: item.changeType === "fullBankChange" 
          ? `${item.oldBankName} → ${item.newBankName}`
          : `${item.oldValue} → ${item.newValue}`,
        time: formatTimeAgo(item.submittedAt),
        status: item.status,
        data: item,
      }))
    }
  }
  
  // Vacation Requests (pending only) - Blue
  const pendingVacations = initialVacationRequests.filter(v => v.status === "pending")
  if (pendingVacations.length > 0) {
    categories.vacation = {
      tabId: "vacation",
      label: "Vacation Requests",
      color: "bg-blue-500",
      textColor: "text-blue-400",
      icon: Calendar,
      count: pendingVacations.length,
      items: pendingVacations.map(item => ({
        id: item.id,
        tabId: "vacation",
        title: `${item.employeeFirstName} ${item.employeeLastName}`,
        subtitle: `${item.days} days`,
        description: `${item.startDate} - ${item.endDate}`,
        time: formatTimeAgo(item.submittedAt),
        status: item.status,
        data: item,
      }))
    }
  }
  
  // Failed Emails - Gray
  if (initialFailedEmails.length > 0) {
    categories.emails = {
      tabId: "emails",
      label: "Email Errors",
      color: "bg-gray-500",
      textColor: "text-gray-400",
      icon: MailWarning,
      count: initialFailedEmails.length,
      items: initialFailedEmails.map(item => ({
        id: item.id,
        tabId: "emails",
        title: `${item.recipientFirstName} ${item.recipientLastName}`,
        subtitle: item.errorType,
        description: item.errorMessage,
        time: formatTimeAgo(item.sentAt),
        status: item.errorType,
        data: item,
      }))
    }
  }
  
  return categories
}

// ============================================
// Get total pending count for badge
// ============================================
export const getTotalPendingCount = () => {
  const categories = generateSidebarActivityItems()
  return Object.values(categories).reduce((sum, cat) => sum + cat.count, 0)
}
