/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react"
import { Download, Calendar, ChevronDown, RefreshCw, Filter, Info, X, FileText, Eye, Trash2, Search } from "lucide-react"
import CheckFundsModal from "../../components/user-panel-components/finance-components/check-funds-modal"
import SepaXmlModal from "../../components/user-panel-components/finance-components/sepa-xml-modal"
import { financialData } from "../../utils/user-panel-states/finance-states"
import { useNavigate } from "react-router-dom"

import { IoIosMenu } from "react-icons/io"

import ExportConfirmationModal from "../../components/user-panel-components/finance-components/export-confirmation-modal"
import DocumentsModal from "../../components/user-panel-components/finance-components/documents-modal"
import ServicesModal from "../../components/user-panel-components/finance-components/service-modal"
import CustomDateModal from "../../components/user-panel-components/finance-components/custom-date-modal"
import { financesData } from "../../utils/user-panel-states/finance-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"

import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import SepaXmlSuccessModal from "../../components/user-panel-components/finance-components/sepa-xml-success-modal"
import SuccessModal from "../../components/user-panel-components/finance-components/check-funds-success-modal"


export default function FinancesPage() {
  const navigate = useNavigate()
  const sidebarSystem = useSidebarSystem()
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod]?.transactions || [])
  const [currentPage, setCurrentPage] = useState(1)
  const [sepaModalOpen, setSepaModalOpen] = useState(false)
  const [financialState, setFinancialState] = useState(financialData)
  const [checkFundsModalOpen, setCheckFundsModalOpen] = useState(false)
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedMemberName, setSelectedMemberName] = useState("")
  const [customDateModalOpen, setCustomDateModalOpen] = useState(false)
  const [customDateRange, setCustomDateRange] = useState(null)
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [exportConfirmationOpen, setExportConfirmationOpen] = useState(false)

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")


  const [sepaSuccessModalOpen, setSepaSuccessModalOpen] = useState(false)
  const [generatedFileInfo, setGeneratedFileInfo] = useState({
    fileName: '',
    transactionCount: 0,
    totalAmount: 0
  })

  const [shouldAutoDownload, setShouldAutoDownload] = useState(true)

  const transactionsPerPage = 5

  // Get all possible status values
  const statusOptions = ["All", "Successful", "Pending", "Failed", "Check incoming funds"]

  useEffect(() => {
    // Filter transactions based on search term and selected status
    let currentTransactions = financialData[selectedPeriod]?.transactions || []

    // If custom date range is selected, filter by date
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialData).flatMap((period) => period.transactions)
      currentTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const startDate = new Date(customDateRange.start)
        const endDate = new Date(customDateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
      })
    }

    const filtered = currentTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus
      return matchesSearch && matchesStatus
    })

    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [searchTerm, selectedPeriod, selectedStatus, customDateRange])

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleShowServices = (services, memberName) => {
    setSelectedServices(services)
    setSelectedMemberName(memberName)
    setServicesModalOpen(true)
  }

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ start: startDate, end: endDate })
    setSelectedPeriod(`Custom (${startDate} to ${endDate})`)
  }

  const handleDeleteDocument = (documentId) => {
      setSepaDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setDocumentViewerOpen(true)
  }

  // CSV Export Function
  const exportToCSV = () => {
    const headers = ["Member Name", "Date", "Type", "Amount", "Status", "Services"]
    const csvData = filteredTransactions.map((transaction) => [
      transaction.memberName,
      formatDate(transaction.date),
      transaction.type,
      transaction.amount,
      transaction.status,
      transaction.services.map((service) => `${service.name}: $${service.cost}`).join("; "),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `financial_data_${selectedPeriod.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const [sepaDocuments, setSepaDocuments] = useState(financesData)

  const handleGenerateXml = (selectedTransactions, period, shouldDownload = true) => {

    // Update transaction statuses
    const updatedFinancialState = { ...financialState }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

    // Update transaction statuses to "Check incoming funds"
    periodData.transactions = periodData.transactions.map((tx) => {
      const selected = selectedTransactions.find((s) => s.id === tx.id)
      if (selected) {
        return {
          ...tx,
          status: "Check incoming funds",
          amount: selected.amount,
        }
      }
      return tx
    })

    // Recalculate summary data
    const successful = periodData.transactions
      .filter((tx) => tx.status === "Successful")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const pending = periodData.transactions
      .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const failed = periodData.transactions
      .filter((tx) => tx.status === "Failed")
      .reduce((sum, tx) => sum + tx.amount, 0)

    periodData.successfulPayments = successful
    periodData.pendingPayments = pending
    periodData.failedPayments = failed

    updatedFinancialState[selectedPeriod] = periodData
    setFinancialState(updatedFinancialState)

    // Calculate file info for the modal
    const totalAmount = selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const fileName = `sepa_payment_${period.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.xml`

    // Set auto-download preference and show success modal
    setShouldAutoDownload(shouldDownload)
    setGeneratedFileInfo({
      fileName,
      transactionCount: selectedTransactions.length,
      totalAmount
    })
    setSepaSuccessModalOpen(true)
  }

  const handleUpdateStatuses = (updatedTransactions) => {
    const updatedFinancialState = { ...financialState }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

    // Update transaction statuses
    periodData.transactions = periodData.transactions.map((tx) => {
      const updated = updatedTransactions.find((u) => u.id === tx.id)
      if (updated) {
        return {
          ...tx,
          status: updated.status,
        }
      }
      return tx
    })

    // Recalculate summary data
    const successful = periodData.transactions
      .filter((tx) => tx.status === "Successful")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const pending = periodData.transactions
      .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const failed = periodData.transactions
      .filter((tx) => tx.status === "Failed")
      .reduce((sum, tx) => sum + tx.amount, 0)

    periodData.successfulPayments = successful
    periodData.pendingPayments = pending
    periodData.failedPayments = failed

    updatedFinancialState[selectedPeriod] = periodData
    setFinancialState(updatedFinancialState)

    // Show success modal instead of alert
    setSuccessMessage("Transaction statuses updated successfully!")
    setSuccessModalOpen(true)
  }

  // Check if there are any transactions with "Check incoming funds" status
  const hasCheckingTransactions =
    financialState[selectedPeriod]?.transactions?.some((tx) => tx.status === "Check incoming funds") || false

  // Get status color class based on status value
  // const getStatusColorClass = (status) => {
  //   switch (status) {
  //     case "Successful":
  //       return "bg-green-900/30 text-green-500" // #10b981 - green
  //     case "Pending":
  //       return "bg-yellow-900/30 text-yellow-500" // #f59e0b - amber/yellow
  //     case "Check incoming funds":
  //       return "bg-blue-900/30 text-blue-500" // #3b82f6 - blue
  //     case "Failed":
  //       return "bg-red-900/30 text-red-500" // #ef4444 - red
  //     default:
  //       return "bg-gray-900/30 text-gray-500"
  //   }
  // }

  // Update the getStatusColorClass function for background colors
const getStatusColorClass = (status) => {
  switch (status) {
    case "Successful":
      return "bg-[#10b981]" // Active prospect green
    case "Pending":
      return "bg-[#f59e0b]" // Passive prospect amber
    case "Check incoming funds":
      return "bg-[#3b82f6]" // Trial Training blue
    case "Failed":
      return "bg-[#ef4444]" // Uninterested red
    default:
      return "bg-gray-500"
  }
}

  // Get current period data
  const getCurrentPeriodData = () => {
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      // Calculate custom period data
      const allTransactions = Object.values(financialData).flatMap((period) => period.transactions)
      const customTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const startDate = new Date(customDateRange.start)
        const endDate = new Date(customDateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
      })

      const successful = customTransactions
        .filter((tx) => tx.status === "Successful")
        .reduce((sum, tx) => sum + tx.amount, 0)
      const pending = customTransactions
        .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
        .reduce((sum, tx) => sum + tx.amount, 0)
      const failed = customTransactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)

      return {
        totalRevenue: successful + pending + failed,
        successfulPayments: successful,
        pendingPayments: pending,
        failedPayments: failed,
        transactions: customTransactions,
      }
    }
    return financialState[selectedPeriod] || financialData[selectedPeriod]
  }

  // Extract all states and functions from the hook
  const {
    // States
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
    isBirthdayMessageModalOpen,
    selectedBirthdayPerson,
    birthdayMessage,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    showAppointmentModal,
    freeAppointments,
    selectedMember,
    isMemberOverviewModalOpen,
    isMemberDetailsModalOpen,
    activeMemberDetailsTab,
    isEditModalOpen,
    editModalTab,
    isNotifyMemberOpen,
    notifyAction,
    showHistoryModal,
    historyTab,
    memberHistory,
    currentBillingPeriod,
    tempContingent,
    selectedBillingPeriod,
    showAddBillingPeriodModal,
    newBillingPeriod,
    showContingentModal,
    editingRelations,
    newRelation,
    editForm,
    widgets,
    rightSidebarWidgets,
    notePopoverRef,

    // Setters
    setIsRightSidebarOpen,
    setIsSidebarEditing,
    setIsRightWidgetModalOpen,
    setOpenDropdownIndex,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setIsBirthdayMessageModalOpen,
    setSelectedBirthdayPerson,
    setBirthdayMessage,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setShowAppointmentModal,
    setFreeAppointments,
    setSelectedMember,
    setIsMemberOverviewModalOpen,
    setIsMemberDetailsModalOpen,
    setActiveMemberDetailsTab,
    setIsEditModalOpen,
    setEditModalTab,
    setIsNotifyMemberOpen,
    setNotifyAction,
    setShowHistoryModal,
    setHistoryTab,
    setMemberHistory,
    setCurrentBillingPeriod,
    setTempContingent,
    setSelectedBillingPeriod,
    setShowAddBillingPeriodModal,
    setNewBillingPeriod,
    setShowContingentModal,
    setEditingRelations,
    setNewRelation,
    setEditForm,
    setWidgets,
    setRightSidebarWidgets,

    // Functions
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
    handleEditAppointment,
    handleCreateNewAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    calculateAge,
    isContractExpiringSoon,
    redirectToContract,
    handleCalendarFromOverview,
    handleHistoryFromOverview,
    handleCommunicationFromOverview,
    handleViewDetailedInfo,
    handleEditFromOverview,
    getMemberAppointments,
    handleManageContingent,
    getBillingPeriods,
    handleAddBillingPeriod,
    handleSaveContingent,
    handleInputChange,
    handleEditSubmit,
    handleAddRelation,
    handleDeleteRelation,
    handleArchiveMember,
    handleUnarchiveMember,
    truncateUrl,
    renderSpecialNoteIcon,

    // new states 
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,
    memberContingentData, setMemberContingentData,
    memberRelations, setMemberRelations,

    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,

    todoFilterOptions,
    relationOptions,
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem;

  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };

  const currentPeriodData = getCurrentPeriodData()

  return (
    <>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
      </style>
      <div
        className={`
      min-h-screen rounded-3xl p-3 sm:p-4 md:p-6 bg-[#1C1C1C]
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
            ? "lg:mr-86 mr-0" // Adjust right margin when sidebar is open on larger screens
            : "mr-0" // No margin when closed
          }
    `}
      >
        <div className="flex flex-col space-y-4 mb-4 md:mb-6">
          {/* Mobile/Tablet: Two rows layout */}
          <div className="flex flex-col lg:hidden space-y-4">
            {/* Top row - Title and Menu */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-white oxanium_font text-lg sm:text-xl md:text-2xl">Finances</h1>
                {/* Documents Icon */}
                <button
                  onClick={() => setDocumentsModalOpen(true)}
                  className="bg-black text-white p-1.5 sm:p-2 md:p-2 rounded-xl border border-gray-800 hover:bg-[#2F2F2F]/90 transition-colors relative"
                  title="View SEPA XML Documents"
                >
                  <FileText className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  {sepaDocuments.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] sm:text-[10px] md:text-xs">
                      {sepaDocuments.length}
                    </span>
                  )}
                </button>
              </div>

              <div onClick={toggleRightSidebar}>
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            </div>

            {/* Second row - Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              {/* Period Selector */}
              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  className="bg-black text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-2.5 rounded-xl border border-gray-800 flex items-center justify-between gap-1 sm:gap-2 md:gap-2 w-full sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm md:text-sm"
                >
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-xs md:text-sm truncate">{selectedPeriod}</span>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                </button>
                {periodDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg">
                    {Object.keys(financialState).map((period) => (
                      <button
                        key={period}
                        className="w-full px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-xs md:text-sm text-gray-300 hover:bg-black text-left"
                        onClick={() => {
                          setSelectedPeriod(period)
                          setPeriodDropdownOpen(false)
                        }}
                      >
                        {period}
                      </button>
                    ))}
                    <button
                      className="w-full px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-xs md:text-sm text-gray-300 hover:bg-black text-left border-t border-gray-700"
                      onClick={() => {
                        setCustomDateModalOpen(true)
                        setPeriodDropdownOpen(false)
                      }}
                    >
                      Custom Period
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 md:gap-3 flex-1 sm:flex-none">
                <div className="flex gap-2 sm:gap-2 md:gap-2">
                  <button
                    onClick={() => setExportConfirmationOpen(true)}
                    className="bg-gray-600 cursor-pointer text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-xs md:text-sm transition-colors flex-1 sm:flex-none"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline md:inline">Export CSV</span>
                    <span className="sm:hidden md:hidden">Export</span>
                  </button>
                  <button
                    onClick={() => setSepaModalOpen(true)}
                    className="bg-[#3F74FF] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-xs md:text-sm hover:bg-[#3F74FF]/90 transition-colors flex-1 sm:flex-none"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline md:inline">Run Payment</span>
                    <span className="sm:hidden md:hidden">Payment</span>
                  </button>
                </div>
                {hasCheckingTransactions && (
                  <button
                    onClick={() => setCheckFundsModalOpen(true)}
                    className="bg-[#2F2F2F] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-xs md:text-sm hover:bg-[#2F2F2F]/90 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:hidden md:inline">Check Incoming Funds</span>
                    <span className="sm:inline md:hidden">Check Funds</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Large screens: Conditional layout based on sidebar state */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className={`text-white oxanium_font ${isRightSidebarOpen ? 'text-xl' : 'text-2xl'}`}>Finances</h1>
              {/* Documents Icon */}
              <button
                onClick={() => setDocumentsModalOpen(true)}
                className="bg-black text-white p-2 rounded-xl border border-gray-800 hover:bg-[#2F2F2F]/90 transition-colors relative"
                title="View SEPA XML Documents"
              >
                <FileText className="w-5 h-5" />
                {sepaDocuments.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {sepaDocuments.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Period Selector - Responsive width when sidebar is open */}
              <div className="relative">
                <button
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  className={`bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 flex items-center justify-between gap-2 text-sm ${isRightSidebarOpen ? 'min-w-[120px]' : 'min-w-[180px]'
                    }`}
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{selectedPeriod}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </button>
                {periodDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg">
                    {Object.keys(financialState).map((period) => (
                      <button
                        key={period}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black text-left"
                        onClick={() => {
                          setSelectedPeriod(period)
                          setPeriodDropdownOpen(false)
                        }}
                      >
                        {period}
                      </button>
                    ))}
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black text-left border-t border-gray-700"
                      onClick={() => {
                        setCustomDateModalOpen(true)
                        setPeriodDropdownOpen(false)
                      }}
                    >
                      Custom Period
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons - More compact when sidebar is open */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExportConfirmationOpen(true)}
                  className={`bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors ${isRightSidebarOpen ? 'px-3' : 'px-4'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  <span className={isRightSidebarOpen ? 'hidden xl:inline' : ''}>Export Excel</span>
                </button>
                <button
                  onClick={() => setSepaModalOpen(true)}
                  className={`bg-[#3F74FF] text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#3F74FF]/90 transition-colors ${isRightSidebarOpen ? 'px-3' : 'px-4'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  <span className={isRightSidebarOpen ? 'hidden xl:inline' : ''}>Run Payment</span>
                </button>
                {hasCheckingTransactions && (
                  <button
                    onClick={() => setCheckFundsModalOpen(true)}
                    className={`bg-[#2F2F2F] text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#2F2F2F]/90 transition-colors ${isRightSidebarOpen ? 'px-3' : 'px-4'
                      }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className={isRightSidebarOpen ? 'hidden xl:inline' : ''}>Check Incoming Funds</span>
                  </button>
                )}
                {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="md:block hidden ">
                  <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                ) : (<div onClick={toggleRightSidebar} className="md:block hidden ">
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive layout for sidebar state */}
        <div className={`grid gap-3 md:gap-4 mb-4 md:mb-6 ${isRightSidebarOpen
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2' // 2 columns when sidebar open on large screens
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' // 4 columns when sidebar closed
          }`}>
          <div className="bg-[#141414] p-3 md:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs md:text-sm mb-1">Total Revenue</h3>
            <p className="text-white text-lg md:text-xl font-semibold">
              {formatCurrency(currentPeriodData.totalRevenue)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 md:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs md:text-sm mb-1">Successful Payments</h3>
            <p className="text-green-500 text-lg md:text-xl font-semibold">
              {formatCurrency(currentPeriodData.successfulPayments)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 md:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs md:text-sm mb-1">Pending Payments</h3>
            <p className="text-yellow-500 text-lg md:text-xl font-semibold">
              {formatCurrency(currentPeriodData.pendingPayments)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 md:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs md:text-sm mb-1">Failed Payments</h3>
            <p className="text-red-500 text-lg md:text-xl font-semibold">
              {formatCurrency(currentPeriodData.failedPayments)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-3 md:mb-4">

          {/* Search input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="search"
              placeholder="Search Transactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 bg-[#181818] text-white rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF] leading-none"
            />
          </div>

          {/* Status filter */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setStatusFilterOpen(!statusFilterOpen)}
              className={`h-11 bg-black text-white rounded-xl border border-gray-800 flex items-center justify-between gap-2 px-3 sm:px-4 w-full sm:w-auto text-sm leading-none 
        sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px]
      `}
            >
              <Filter className="w-4 h-4" />
              <span className="text-xs md:text-sm">Status: {selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {statusFilterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-[220px] bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg">
               {statusOptions.map((status) => (
  <button
    key={status}
    className={`w-full px-3 md:px-4 py-2 text-xs md:text-sm text-left flex items-center space-x-2 hover:bg-black ${selectedStatus === status ? "bg-black/50" : ""
      }`}
    onClick={() => {
      setSelectedStatus(status)
      setStatusFilterOpen(false)
    }}
  >
    {status !== "All" && (
      <span
        className={`inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${getStatusColorClass(status)}`}
      />
    )}
    <span className="text-gray-300">{status}</span>
  </button>
))}
              </div>
            )}
          </div>

        </div>




        <div className={`${isRightSidebarOpen ? 'overflow-x-auto' : 'overflow-x-auto'}`}>
          <div className={isRightSidebarOpen ? 'min-w-[700px]' : 'min-w-[600px]'}>
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                <tr>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3 rounded-tl-xl">
                    Member
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                    Date
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                    Type
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                    Services
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3 rounded-tr-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-800 ${index === paginatedTransactions.length - 1 ? "rounded-b-xl" : ""
                      }`}
                  >
                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm">{transaction.memberName}</td>
                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm">{formatDate(transaction.date)}</td>
                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm">{transaction.type}</td>
                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm">{formatCurrency(transaction.amount)}</td>
                    <td className="px-3 md:px-4 py-2 md:py-3">
                      <button
                        onClick={() => handleShowServices(transaction.services, transaction.memberName)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </td>
                    <td className="px-3 md:px-4 py-2 md:py-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${transaction.status === "Successful"
                          ? "bg-green-900/30 text-green-500"
                          : transaction.status === "Pending"
                            ? "bg-yellow-900/30 text-yellow-500"
                            : transaction.status === "Check incoming funds"
                              ? "bg-blue-900/30 text-blue-500"
                              : "bg-red-900/30 text-red-500"
                          }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No transactions message */}
        {filteredTransactions.length === 0 && (
          <div className="bg-[#141414] p-4 md:p-6 rounded-xl text-center mt-3 md:mt-4">
            <p className="text-gray-400 text-sm md:text-base">No transactions found matching your criteria.</p>
          </div>
        )}

        {filteredTransactions.length > transactionsPerPage && (
          <div className="flex justify-center items-center gap-1 md:gap-2 mt-4 md:mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 md:px-3 py-1 md:py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800 text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-xl transition-colors border text-xs md:text-sm ${currentPage === page
                    ? "bg-[#3F74FF] text-white border-transparent"
                    : "bg-black text-white border-gray-800 hover:bg-gray-900"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 md:px-3 py-1 md:py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800 text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </button>
          </div>
        )}

        <ExportConfirmationModal
          isOpen={exportConfirmationOpen}
          onClose={() => setExportConfirmationOpen(false)}
          onConfirm={exportToCSV}
        />

        <SepaXmlModal
          isOpen={sepaModalOpen}
          onClose={() => setSepaModalOpen(false)}
          selectedPeriod={selectedPeriod}
          transactions={currentPeriodData.transactions}
          onGenerateXml={handleGenerateXml}
        />

        <DocumentsModal
          isOpen={documentsModalOpen}
          onClose={() => setDocumentsModalOpen(false)}
          documents={sepaDocuments}
          onDeleteDocument={handleDeleteDocument}
          onViewDocument={handleViewDocument}
        />

        <CheckFundsModal
          isOpen={checkFundsModalOpen}
          onClose={() => setCheckFundsModalOpen(false)}
          transactions={currentPeriodData.transactions}
          onUpdateStatuses={handleUpdateStatuses}
        />
        <ServicesModal
          isOpen={servicesModalOpen}
          onClose={() => setServicesModalOpen(false)}
          services={selectedServices}
          memberName={selectedMemberName}
        />
        <CustomDateModal
          isOpen={customDateModalOpen}
          onClose={() => setCustomDateModalOpen(false)}
          onApply={handleCustomDateApply}
        />

        <SepaXmlSuccessModal
          isOpen={sepaSuccessModalOpen}
          onClose={() => setSepaSuccessModalOpen(false)}
          fileName={generatedFileInfo.fileName}
          transactionCount={generatedFileInfo.transactionCount}
          totalAmount={generatedFileInfo.totalAmount}
          shouldAutoDownload={shouldAutoDownload}
        />

        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          title="Success"
          message={successMessage}
          buttonText="Continue"
        />


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
     
          expiringContracts={expiringContracts}
          getWidgetPlacementStatus={getWidgetPlacementStatus}
          onClose={toggleRightSidebar}
          hasUnreadNotifications={2}
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

        {/* Sidebar related modals */}
        <TrainingPlansModal
          isOpen={isTrainingPlanModalOpen}
          onClose={() => {
            setIsTrainingPlanModalOpen(false)
            setSelectedUserForTrainingPlan(null)
          }}
          selectedMember={selectedUserForTrainingPlan} // Make sure this is passed correctly
          memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
          availableTrainingPlans={availableTrainingPlans}
          onAssignPlan={handleAssignTrainingPlan} // Make sure this function is passed
          onRemovePlan={handleRemoveTrainingPlan} // Make sure this function is passed
        />

        <AppointmentActionModalV2
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setShowAppointmentOptionsModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setShowAppointmentOptionsModal(false);
            setIsEditAppointmentModalOpen(true);
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
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
              setSelectedAppointment({ ...selectedAppointment, ...changes });
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointmentWrapper}
            onClose={() => {
              setIsEditAppointmentModalOpen(false);
              setSelectedAppointment(null);
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
              setIsEditTaskModalOpen(false);
              setEditingTask(null);
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
      </div>
    </>
  )
}