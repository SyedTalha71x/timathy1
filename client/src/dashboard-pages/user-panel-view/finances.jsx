/* eslint-disable no-unused-vars */

import { useState, useEffect, useMemo, useRef } from "react"
import { Download, Calendar, ChevronDown, RefreshCw, Info, X, FileText, Eye, Trash2, Search, Play, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
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
  const [isCustomPeriodExpanded, setIsCustomPeriodExpanded] = useState(false)
  const [inlineCustomDates, setInlineCustomDates] = useState({
    startDate: "",
    endDate: ""
  })
  const periodDropdownRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod]?.transactions || [])
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

  // Sorting state for main table
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  const [sepaSuccessModalOpen, setSepaSuccessModalOpen] = useState(false)
  const [generatedFileInfo, setGeneratedFileInfo] = useState({
    fileName: '',
    transactionCount: 0,
    totalAmount: 0
  })

  const [shouldAutoDownload, setShouldAutoDownload] = useState(true)
  
  // SEPA Documents state
  const [sepaDocuments, setSepaDocuments] = useState(financesData)

  // Status options with bright colors (consistent across platform)
  const statusOptions = [
    { id: "Successful", label: "Successful", color: "#10b981" },
    { id: "Pending", label: "Pending", color: "#f59e0b" },
    { id: "Failed", label: "Failed", color: "#ef4444" },
    { id: "Check incoming funds", label: "Check incoming funds", color: "#3b82f6" },
  ]

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={14} className="text-gray-500" />
    }
    return sortDirection === "asc" 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  useEffect(() => {
    let currentTransactions = financialState[selectedPeriod]?.transactions || []

    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialState).flatMap((period) => period.transactions)
      currentTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const startDate = new Date(customDateRange.start)
        const endDate = new Date(customDateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
      })
    }

    const filtered = currentTransactions.filter((transaction) => {
      const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(transaction.status)
      return matchesSearch && matchesStatus
    })

    setFilteredTransactions(filtered)
  }, [searchTerm, selectedPeriod, selectedStatuses, customDateRange, financialState])

  // Close period dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply on desktop (md breakpoint = 768px)
      if (window.innerWidth < 768) {
        return
      }
      
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
        setPeriodDropdownOpen(false)
        setIsCustomPeriodExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  // Sort filtered transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "member":
          comparison = a.memberName.localeCompare(b.memberName)
          break
        case "date":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        default:
          comparison = 0
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    return sorted
  }, [filteredTransactions, sortBy, sortDirection])

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

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const handleShowServices = (services, memberName) => {
    setSelectedServices(services)
    setSelectedMemberName(memberName)
    setServicesModalOpen(true)
  }

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ start: startDate, end: endDate })
    const formattedStart = formatDateForDisplay(startDate)
    const formattedEnd = formatDateForDisplay(endDate)
    setSelectedPeriod(`Custom: ${formattedStart} â€“ ${formattedEnd}`)
  }

  const handleApplyInlineCustomPeriod = () => {
    if (inlineCustomDates.startDate && inlineCustomDates.endDate) {
      const formattedStart = formatDateForDisplay(inlineCustomDates.startDate)
      const formattedEnd = formatDateForDisplay(inlineCustomDates.endDate)
      setSelectedPeriod(`Custom: ${formattedStart} – ${formattedEnd}`)
      setCustomDateRange({
        start: inlineCustomDates.startDate,
        end: inlineCustomDates.endDate
      })
      setPeriodDropdownOpen(false)
      setIsCustomPeriodExpanded(false)
    }
  }

  const handleCustomPeriodClick = () => {
    const today = new Date().toISOString().split("T")[0]
    setInlineCustomDates((prev) => ({
      startDate: prev.startDate || today,
      endDate: prev.endDate || today,
    }))
    setIsCustomPeriodExpanded(true)
  }

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period)
    setCustomDateRange(null)
    setIsCustomPeriodExpanded(false)
    setPeriodDropdownOpen(false)
  }

  const handleDeleteDocument = (documentId) => {
    setSepaDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setDocumentViewerOpen(true)
  }

  const exportToCSV = () => {
    const headers = ["Member Name", "Date", "Type", "Amount", "Status", "Services"]
    const csvData = sortedTransactions.map((transaction) => [
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

  const handleGenerateXml = (selectedTransactions, period, shouldDownload = true) => {
    const updatedFinancialState = { ...financialState }
    
    // Get the IDs of selected transactions
    const selectedIds = selectedTransactions.map(tx => tx.id)
    const selectedAmounts = {}
    selectedTransactions.forEach(tx => {
      selectedAmounts[tx.id] = tx.amount
    })

    // Update transactions across ALL periods (find by ID)
    Object.keys(updatedFinancialState).forEach(periodKey => {
      const periodData = { ...updatedFinancialState[periodKey] }
      let hasChanges = false
      
      periodData.transactions = periodData.transactions.map((tx) => {
        if (selectedIds.includes(tx.id)) {
          hasChanges = true
          return {
            ...tx,
            status: "Check incoming funds",
            amount: selectedAmounts[tx.id] || tx.amount,
          }
        }
        return tx
      })

      if (hasChanges) {
        // Recalculate totals for this period
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
        
        updatedFinancialState[periodKey] = periodData
      }
    })

    setFinancialState(updatedFinancialState)

    const totalAmount = selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const fileName = `sepa_payment_${period.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.xml`

    // Add to SEPA documents
    const newDocument = {
      id: Date.now(),
      name: fileName,
      date: new Date().toISOString(),
      transactionCount: selectedTransactions.length,
      totalAmount: totalAmount,
      period: period,
      status: "generated"
    }
    setSepaDocuments(prev => [newDocument, ...prev])

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
    
    // Get the IDs and statuses of updated transactions
    const updatedMap = {}
    updatedTransactions.forEach(tx => {
      updatedMap[tx.id] = tx.status
    })

    // Update transactions across ALL periods (find by ID)
    Object.keys(updatedFinancialState).forEach(periodKey => {
      const periodData = { ...updatedFinancialState[periodKey] }
      let hasChanges = false
      
      periodData.transactions = periodData.transactions.map((tx) => {
        if (updatedMap[tx.id]) {
          hasChanges = true
          return {
            ...tx,
            status: updatedMap[tx.id],
          }
        }
        return tx
      })

      if (hasChanges) {
        // Recalculate totals for this period
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
        
        updatedFinancialState[periodKey] = periodData
      }
    })

    setFinancialState(updatedFinancialState)

    setSuccessMessage("Transaction statuses updated successfully!")
    setSuccessModalOpen(true)
  }

  // Check if there are any transactions with "Check incoming funds" status across ALL periods
  const hasCheckingTransactionsAnyPeriod = useMemo(() => {
    return Object.values(financialState).some(periodData => 
      periodData?.transactions?.some((tx) => tx.status === "Check incoming funds")
    )
  }, [financialState])

  // Get status color class - BRIGHT colors (consistent across platform)
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Successful":
        return "bg-[#10b981] text-white"
      case "Pending":
        return "bg-[#f59e0b] text-white"
      case "Check incoming funds":
        return "bg-[#3b82f6] text-white"
      case "Failed":
        return "bg-[#ef4444] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Get current period data with fallback
  const getCurrentPeriodData = () => {
    const defaultData = {
      totalRevenue: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      transactions: [],
    }

    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialState).flatMap((period) => period?.transactions || [])
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
    
    return financialState[selectedPeriod] || defaultData
  }

  // Extract all states and functions from the hook
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

  const toggleStatusFilter = (statusId) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusId)) {
        return prev.filter(s => s !== statusId)
      } else {
        return [...prev, statusId]
      }
    })
  }

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
      min-h-screen rounded-3xl p-6 bg-[#1C1C1C]
      transition-all duration-300 ease-in-out flex-1
      ${isRightSidebarOpen
            ? "lg:mr-86 mr-0"
            : "mr-0"
          }
    `}
      >
        {/* Header - Matches Leads Pattern */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl text-white font-bold">Finances</h1>
            
            {/* Documents Button */}
            <button
              onClick={() => setDocumentsModalOpen(true)}
              className="bg-black text-white p-2 rounded-xl border border-gray-800 hover:bg-[#2F2F2F]/90 transition-colors relative"
              title="View SEPA XML Documents"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              {sepaDocuments.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {sepaDocuments.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Action Buttons + Sidebar Toggle */}
          <div className="flex items-center gap-2">
            {/* Period Selector */}
            <div className="relative" ref={periodDropdownRef}>
              <button
                onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                className="bg-[#141414] text-white px-3 sm:px-4 py-2 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-2 text-xs sm:text-sm transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={`hidden sm:inline ${selectedPeriod.startsWith("Custom:") ? '' : 'truncate max-w-[120px]'}`}>{selectedPeriod}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Desktop Period Dropdown - inside relative container */}
              {periodDropdownOpen && (
                <div className="hidden md:block absolute right-0 z-20 mt-2 min-w-[320px] bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg overflow-hidden top-full">
                  {/* Preset Periods */}
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                      Select Period
                    </div>
                    {Object.keys(financialState).map((period) => (
                      <button
                        key={period}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                          selectedPeriod === period && !selectedPeriod.startsWith("Custom:")
                            ? 'text-white bg-gray-800/50' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleSelectPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Period Section */}
                  <div className="border-t border-gray-700">
                    <button
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                        isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-white bg-gray-800/50' : 'text-gray-300'
                      }`}
                      onClick={handleCustomPeriodClick}
                    >
                      <Calendar className="w-4 h-4" />
                      Custom Period
                    </button>
                    
                    {/* Date Inputs */}
                    {isCustomPeriodExpanded && (
                      <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={inlineCustomDates.startDate}
                                onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, startDate: e.target.value }))}
                                className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">End Date</label>
                              <input
                                type="date"
                                value={inlineCustomDates.endDate}
                                onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, endDate: e.target.value }))}
                                className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                              />
                            </div>
                          </div>
                          <button
                            onClick={handleApplyInlineCustomPeriod}
                            disabled={!inlineCustomDates.startDate || !inlineCustomDates.endDate}
                            className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Export Button - Mobile (icon only) */}
            <button
              onClick={() => setExportConfirmationOpen(true)}
              className="md:hidden bg-gray-600 text-white p-2 rounded-xl transition-colors hover:bg-gray-700"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Export Button - Desktop */}
            <button
              onClick={() => setExportConfirmationOpen(true)}
              className="hidden md:flex bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 text-xs sm:text-sm transition-colors hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export CSV</span>
            </button>
            
            {/* Run Payment Button - Desktop only */}
            <button
              onClick={() => setSepaModalOpen(true)}
              className="hidden md:flex bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 text-xs sm:text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              <span className="hidden lg:inline">Run Payment</span>
            </button>
            
            {/* Check Incoming Funds - Desktop only, conditional */}
            {hasCheckingTransactionsAnyPeriod && (
              <button
                onClick={() => setCheckFundsModalOpen(true)}
                className="hidden md:flex bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 text-xs sm:text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">Check Funds</span>
              </button>
            )}
            
            {/* Sidebar Toggle */}
            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar}>
                <img src="/expand-sidebar mirrored.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            ) : (
              <div onClick={toggleRightSidebar}>
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Period Dropdown - Centered Modal */}
        {periodDropdownOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPeriodDropdownOpen(false)
                setIsCustomPeriodExpanded(false)
              }
            }}
          >
            <div 
              data-mobile-period-modal
              className="bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg w-[90%] max-w-[340px] max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <span className="text-white font-medium">Select Period</span>
                <button 
                  type="button"
                  onClick={() => {
                    setPeriodDropdownOpen(false)
                    setIsCustomPeriodExpanded(false)
                  }} 
                  className="text-gray-400 hover:text-white p-1 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Preset Periods */}
              <div className="py-1 max-h-[40vh] overflow-y-auto">
                {Object.keys(financialState).map((period) => (
                  <button
                    type="button"
                    key={period}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation ${
                      selectedPeriod === period && !selectedPeriod.startsWith("Custom:")
                        ? 'text-white bg-[#3F74FF]' 
                        : 'text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedPeriod(period)
                      setCustomDateRange(null)
                      setIsCustomPeriodExpanded(false)
                      setPeriodDropdownOpen(false)
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              {/* Custom Period Section */}
              <div className="border-t border-gray-700">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center gap-2 touch-manipulation ${
                    isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-white bg-[#3F74FF]' : 'text-gray-300'
                  }`}
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0]
                    setInlineCustomDates((prev) => ({
                      startDate: prev.startDate || today,
                      endDate: prev.endDate || today,
                    }))
                    setIsCustomPeriodExpanded(!isCustomPeriodExpanded)
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Custom Period
                </button>
                
                {/* Date Inputs */}
                {isCustomPeriodExpanded && (
                  <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={inlineCustomDates.startDate}
                            onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, startDate: e.target.value }))}
                            className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">End Date</label>
                          <input
                            type="date"
                            value={inlineCustomDates.endDate}
                            onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, endDate: e.target.value }))}
                            className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (inlineCustomDates.startDate && inlineCustomDates.endDate) {
                            const formattedStart = formatDateForDisplay(inlineCustomDates.startDate)
                            const formattedEnd = formatDateForDisplay(inlineCustomDates.endDate)
                            setCustomDateRange({ start: inlineCustomDates.startDate, end: inlineCustomDates.endDate })
                            setSelectedPeriod(`Custom: ${formattedStart} – ${formattedEnd}`)
                            setIsCustomPeriodExpanded(false)
                            setPeriodDropdownOpen(false)
                          }
                        }}
                        disabled={!inlineCustomDates.startDate || !inlineCustomDates.endDate}
                        className="w-full py-2.5 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 active:bg-[#3F74FF]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search - Matches Leads Pattern */}
        <div className="mb-4 sm:mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
          />
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-3 sm:gap-4 mb-4 sm:mb-6 grid-cols-2 lg:grid-cols-4`}>
          <div className="bg-[#141414] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1">Total Revenue</h3>
            <p className="text-white text-base sm:text-xl font-semibold">
              {formatCurrency(currentPeriodData.totalRevenue)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1">Successful</h3>
            <p className="text-green-500 text-base sm:text-xl font-semibold">
              {formatCurrency(currentPeriodData.successfulPayments)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1">Pending</h3>
            <p className="text-yellow-500 text-base sm:text-xl font-semibold">
              {formatCurrency(currentPeriodData.pendingPayments)}
            </p>
          </div>
          <div className="bg-[#141414] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1">Failed</h3>
            <p className="text-red-500 text-base sm:text-xl font-semibold">
              {formatCurrency(currentPeriodData.failedPayments)}
            </p>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 items-center">
          {statusOptions.map(status => (
            <button
              key={status.id}
              onClick={() => toggleStatusFilter(status.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedStatuses.includes(status.id)
                  ? "text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
              style={{
                backgroundColor: selectedStatuses.includes(status.id) ? status.color : undefined
              }}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: selectedStatuses.includes(status.id) ? 'white' : status.color }}
              />
              {status.label}
            </button>
          ))}
          
          {selectedStatuses.length > 0 && (
            <button
              onClick={() => setSelectedStatuses([])}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] flex items-center gap-1.5"
            >
              <X size={12} />
              Clear All
            </button>
          )}
        </div>

        <div className={`${isRightSidebarOpen ? 'overflow-x-auto' : 'overflow-x-auto'}`}>
          <div className={isRightSidebarOpen ? 'min-w-[700px]' : 'min-w-[600px]'}>
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                <tr>
                  <th 
                    scope="col" 
                    className="px-3 md:px-4 py-2 md:py-3 rounded-tl-xl cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("member")}
                  >
                    <div className="flex items-center gap-1">
                      Member {getSortIcon("member")}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 md:px-4 py-2 md:py-3 cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 md:px-4 py-2 md:py-3 cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-1">
                      Type {getSortIcon("type")}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 md:px-4 py-2 md:py-3 cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      Amount {getSortIcon("amount")}
                    </div>
                  </th>
                  <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                    Services
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 md:px-4 py-2 md:py-3 rounded-tr-xl cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status {getSortIcon("status")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-800 ${index === sortedTransactions.length - 1 ? "rounded-b-xl" : ""}`}
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
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColorClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sortedTransactions.length === 0 && (
          <div className="bg-[#141414] p-4 md:p-6 rounded-xl text-center mt-3 md:mt-4">
            <p className="text-gray-400 text-sm md:text-base">No transactions found matching your criteria.</p>
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
          financialData={financialState}
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
          financialState={financialState}
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

        {/* Floating Action Buttons - Mobile Only */}
        <div className="md:hidden fixed bottom-4 right-4 flex flex-col gap-3 z-30">
          {/* Check Funds Button - Only show when there are open funds */}
          {hasCheckingTransactionsAnyPeriod && (
            <button
              onClick={() => setCheckFundsModalOpen(true)}
              className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white p-4 rounded-xl shadow-lg transition-all active:scale-95"
              aria-label="Check Incoming Funds"
            >
              <RefreshCw size={22} />
            </button>
          )}
          
          {/* Run Payment Button */}
          <button
            onClick={() => setSepaModalOpen(true)}
            className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95"
            aria-label="Run Payment"
          >
            <Play size={22} />
          </button>
        </div>
      </div>
    </>
  )
}
