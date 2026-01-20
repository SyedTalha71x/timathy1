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
  Palmtree,
  UserCheck,
  Bell,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

// Sidebar imports
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

// ============================================
// Sample Data for Activity Monitor
// ============================================
const initialVacationRequests = [
  {
    id: "vac-1",
    employeeFirstName: "Max",
    employeeLastName: "Mustermann",
    department: "Fitness",
    startDate: "2026-02-15",
    endDate: "2026-02-22",
    days: 6,
    reason: "Family vacation",
    status: "pending",
    submittedAt: "2026-01-18T10:30:00",
  },
  {
    id: "vac-2",
    employeeFirstName: "Anna",
    employeeLastName: "Schmidt",
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
    employeeFirstName: "Thomas",
    employeeLastName: "Weber",
    department: "Personal Training",
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
    memberFirstName: "Lisa",
    memberLastName: "Müller",
    appointmentType: "Trial Training",
    requestedDate: "2026-01-22",
    requestedTimeStart: "14:00",
    requestedTimeEnd: "15:00",
    trainer: "Max Mustermann",
    status: "pending",
    submittedAt: "2026-01-19T16:45:00",
  },
  {
    id: "app-2",
    memberFirstName: "Peter",
    memberLastName: "Klein",
    appointmentType: "Nutrition Consultation",
    requestedDate: "2026-01-23",
    requestedTimeStart: "10:00",
    requestedTimeEnd: "10:30",
    trainer: "Anna Schmidt",
    status: "pending",
    submittedAt: "2026-01-18T11:20:00",
  },
  {
    id: "app-3",
    memberFirstName: "Sarah",
    memberLastName: "Wagner",
    appointmentType: "Personal Training",
    requestedDate: "2026-01-21",
    requestedTimeStart: "09:00",
    requestedTimeEnd: "10:00",
    trainer: "Thomas Weber",
    status: "approved",
    submittedAt: "2026-01-17T08:30:00",
  },
]

const initialExpiringContracts = [
  {
    id: "con-1",
    memberFirstName: "Julia",
    memberLastName: "Hoffmann",
    membershipType: "Premium",
    contractStart: "2025-02-01",
    contractEnd: "2026-01-31",
    daysRemaining: 11,
    monthlyFee: 79.99,
    autoRenewal: false,
  },
  {
    id: "con-2",
    memberFirstName: "Michael",
    memberLastName: "Braun",
    membershipType: "Standard",
    contractStart: "2024-08-15",
    contractEnd: "2026-02-14",
    daysRemaining: 25,
    monthlyFee: 49.99,
    autoRenewal: true,
  },
  {
    id: "con-3",
    memberFirstName: "Elena",
    memberLastName: "Fischer",
    membershipType: "Premium Plus",
    contractStart: "2025-03-01",
    contractEnd: "2026-02-28",
    daysRemaining: 39,
    monthlyFee: 99.99,
    autoRenewal: false,
  },
]

const initialFailedEmails = [
  {
    id: "mail-1",
    recipient: "customer@example.com",
    recipientFirstName: "Martin",
    recipientLastName: "Schulz",
    subject: "Your Membership Confirmation",
    sentAt: "2026-01-19T08:00:00",
    errorType: "bounced",
    errorMessage: "Mailbox not found",
    retryCount: 2,
  },
  {
    id: "mail-2",
    recipient: "info@company.de",
    recipientFirstName: "Corporate",
    recipientLastName: "Client",
    subject: "Invoice January 2026",
    sentAt: "2026-01-18T14:30:00",
    errorType: "rejected",
    errorMessage: "Blocked by spam filter",
    retryCount: 1,
  },
]

// ============================================
// Tab Configuration - Only Orange and Blue
// ============================================
const tabs = [
  { 
    id: "vacation", 
    label: "Vacation Requests", 
    icon: Palmtree,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
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
    id: "emails", 
    label: "Email Errors", 
    icon: MailWarning,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400"
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
  const sidebarSystem = useSidebarSystem()
  
  // Tab & Filter States
  const [activeTab, setActiveTab] = useState("vacation")
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
  
  // Modal States
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const filterDropdownRef = useRef(null)

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
    }
  }

  const handleRetryEmail = (id) => {
    toast.success("Resending email...")
    // In production: trigger email resend
  }

  const handleContactMember = (contract) => {
    toast.success(`Contacting ${contract.memberFirstName} ${contract.memberLastName}...`)
    // In production: open communication modal or redirect
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

  // Sort options based on active tab
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "name", label: "Name" },
    ...(activeTab === "contracts" ? [{ value: "urgency", label: "Urgency" }] : []),
  ]

  const filteredData = getFilteredData()

  // ============================================
  // Extract sidebar system values
  // ============================================
  const {
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    freeAppointments,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    setIsRightWidgetModalOpen,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setIsNotifyMemberOpen,
    setNotifyAction,
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    truncateUrl,
    renderSpecialNoteIcon,
    customLinks,
    communications,
    todos,
    setTodos,
    expiringContracts: sidebarExpiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,
    memberTypes,
    todoFilterOptions,
    appointmentTypes,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem

  // Wrapper functions
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: "#333", color: "#fff" },
        }}
      />
      
      <div className={`
        min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
        transition-all duration-500 ease-in-out flex-1
        ${isRightSidebarOpen ? 'lg:mr-86 mr-0' : 'mr-0'}
      `}>
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
            
            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar} className="cursor-pointer">
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5" alt="" />
              </div>
            ) : (
              <div onClick={toggleRightSidebar} className="cursor-pointer">
                <img src="/icon.svg" className="h-5 w-5" alt="" />
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* Stats Overview Cards */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {tabs.map((tab) => {
            const count = counts[tab.id]
            const pendingCount = count.pending || count.critical || 0
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative p-4 md:p-5 rounded-2xl transition-all duration-200 text-left
                  ${isActive 
                    ? `${tab.color} shadow-lg` 
                    : 'bg-[#161616] hover:bg-[#1F1F1F]'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs md:text-sm ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-2xl md:text-3xl font-bold mt-1 ${isActive ? 'text-white' : 'text-white'}`}>
                      {count.total}
                    </p>
                    {pendingCount > 0 && (
                      <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : tab.textColor}`}>
                        {pendingCount} {tab.id === "contracts" ? "critical" : "pending"}
                      </p>
                    )}
                  </div>
                  <div className={`
                    p-2.5 rounded-xl
                    ${isActive ? 'bg-white/20' : tab.lightColor}
                  `}>
                    <tab.icon size={20} className={isActive ? 'text-white' : tab.textColor} />
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
                {activeTab === "vacation" && <Palmtree size={28} className="text-gray-500" />}
                {activeTab === "appointments" && <CalendarCheck size={28} className="text-gray-500" />}
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
              {activeTab === "emails" && filteredData.map((email) => (
                <div
                  key={email.id}
                  className="bg-[#161616] rounded-2xl p-4 md:p-5 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Grid Layout für perfektes Alignment */}
                  <div className="hidden md:grid md:grid-cols-[280px_1fr_80px_120px] gap-4 items-center">
                    {/* Col 1: Recipient Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
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
                    
                    {/* Col 2: Subject & Error */}
                    <div className="min-w-0">
                      <p className="text-gray-300 text-sm truncate">{email.subject}</p>
                      <p className="text-red-400 text-xs mt-1">{email.errorMessage}</p>
                    </div>
                    
                    {/* Col 3: Retry Count */}
                    <div className="text-center">
                      <span className="text-xs text-gray-500">{email.retryCount}x tried</span>
                    </div>
                    
                    {/* Col 4: Actions */}
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleRetryEmail(email.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        <RefreshCw size={16} />
                        <span>Resend</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
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
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        <RefreshCw size={16} />
                        <span>Resend</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* Sidebar */}
      {/* ============================================ */}
      <Sidebar
        isRightSidebarOpen={isRightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
        isSidebarEditing={isSidebarEditing}
        toggleSidebarEditing={toggleSidebarEditing}
        rightSidebarWidgets={rightSidebarWidgets}
        moveRightSidebarWidget={moveRightSidebarWidget}
        removeRightSidebarWidget={removeRightSidebarWidget}
        setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
        communications={communications}
        redirectToCommunication={redirectToCommunication}
        todos={todos}
        handleTaskComplete={handleTaskCompleteWrapper}
        todoFilter={todoFilter}
        setTodoFilter={setTodoFilter}
        todoFilterOptions={todoFilterOptions}
        isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
        setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
        openDropdownIndex={openDropdownIndex}
        toggleDropdown={toggleDropdown}
        handleEditTask={handleEditTask}
        setTaskToCancel={setTaskToCancel}
        setTaskToDelete={setTaskToDelete}
        birthdays={birthdays}
        isBirthdayToday={isBirthdayToday}
        handleSendBirthdayMessage={handleSendBirthdayMessage}
        customLinks={customLinks}
        truncateUrl={truncateUrl}
        appointments={appointments}
        renderSpecialNoteIcon={renderSpecialNoteIcon}
        handleDumbbellClick={handleDumbbellClick}
        handleCheckIn={handleCheckInWrapper}
        handleAppointmentOptionsModal={handleAppointmentOptionsModal}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        isChartDropdownOpen={isChartDropdownOpen}
        setIsChartDropdownOpen={setIsChartDropdownOpen}
        expiringContracts={sidebarExpiringContracts}
        getWidgetPlacementStatus={getWidgetPlacementStatus}
        onClose={toggleRightSidebar}
        hasUnreadNotifications={counts.vacation.pending + counts.appointments.pending}
        setIsWidgetModalOpen={setIsWidgetModalOpen}
        handleEditNote={handleEditNoteWrapper}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        isSpecialNoteModalOpen={isSpecialNoteModalOpen}
        setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
        selectedAppointmentForNote={selectedAppointmentForNote}
        setSelectedAppointmentForNote={setSelectedAppointmentForNote}
        handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
        onSaveSpecialNote={handleSaveSpecialNoteWrapper}
        notifications={notifications}
        setTodos={setTodos}
      />

      {/* ============================================ */}
      {/* Sidebar Modals */}
      {/* ============================================ */}
      <TrainingPlansModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => {
          setIsTrainingPlanModalOpen(false)
          setSelectedUserForTrainingPlan(null)
        }}
        selectedMember={selectedUserForTrainingPlan}
        memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
        availableTrainingPlans={availableTrainingPlans}
        onAssignPlan={handleAssignTrainingPlan}
        onRemovePlan={handleRemoveTrainingPlan}
      />

      <AppointmentActionModalV2
        isOpen={showAppointmentOptionsModal}
        onClose={() => {
          setShowAppointmentOptionsModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
        isEventInPast={isEventInPast}
        onEdit={() => {
          setShowAppointmentOptionsModal(false)
          setIsEditAppointmentModalOpen(true)
        }}
        onCancel={handleCancelAppointment}
        onViewMember={() => handleViewMemberDetails(selectedAppointment)}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
        handleNotifyMember={handleNotifyMember}
      />

      {isEditAppointmentModalOpen && selectedAppointment && (
        <EditAppointmentModalV2
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointment({ ...selectedAppointment, ...changes })
          }}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointmentWrapper}
          onClose={() => {
            setIsEditAppointmentModalOpen(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddRightSidebarWidget}
        getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
        widgetArea="sidebar"
      />

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {isEditTaskModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditTaskModalOpen(false)
            setEditingTask(null)
          }}
          onUpdateTask={handleUpdateTaskWrapper}
        />
      )}

      {taskToDelete && (
        <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToCancel && (
        <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                No
              </button>
              <button
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
