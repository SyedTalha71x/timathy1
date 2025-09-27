

/* eslint-disable no-unused-vars */
import {
  MoreVertical,
  Plus,
  ChevronDown,
  ArrowUpDown,
  FileText,
  History,
  Search,
  Grid3X3,
  List,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import AddContractModal from "../../components/user-panel-components/contract-components/add-contract-modal"
import { ContractDetailsModal } from "../../components/user-panel-components/contract-components/contract-details-modal"
import { PauseContractModal } from "../../components/user-panel-components/contract-components/pause-contract-modal"
import { CancelContractModal } from "../../components/user-panel-components/contract-components/cancel-contract-modal"
import { EditContractModal } from "../../components/user-panel-components/contract-components/edit-contract-modal"
import { DocumentManagementModal } from "../../components/user-panel-components/contract-components/document-management-modal"
import { BonusTimeModal } from "../../components/user-panel-components/contract-components/bonus-time-modal"
import { RenewContractModal } from "../../components/user-panel-components/contract-components/reniew-contract-modal"
import { ChangeContractModal } from "../../components/user-panel-components/contract-components/change-contract-modal"
import { ContractHistoryModal } from "../../components/user-panel-components/contract-components/contract-history-modal"

import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { useNavigate } from "react-router-dom"
import { IoIosMenu } from "react-icons/io"
import { AiOutlineExclamation } from "react-icons/ai";

import Sidebar from "../../components/central-sidebar"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import MemberOverviewModal from "../../components/user-panel-components/communication-components/MemberOverviewModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { contractHistory, initialContracts, sampleLeads } from "../../utils/user-panel-states/contract-states"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"



export default function ContractList() {
  const navigate = useNavigate()
  const sidebarSystem = useSidebarSystem()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All Contracts")
  const [contracts, setContracts] = useState(initialContracts)
  const [filteredContracts, setFilteredContracts] = useState(initialContracts)
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list") // Added view mode state for switching between grid and list views

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false)
  const [isEditModalOpenContract, setIsEditModalOpenContract] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const contractsPerPage = 40
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isBonusTimeModalOpen, setIsBonusTimeModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedSort, setSelectedSort] = useState("Alphabetical") // Changed from "Alphabetical (A-Z)" to "Alphabetical"


  const handleRenewContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsRenewModalOpen(true)
  }

  const sortOptions = [
    "Alphabetical",
    "Contract Type",
    "Status",
    "Expiring Soon",
    "Recently Added",
  ]

  useEffect(() => {
    let filtered = contracts

    // Apply status filter
    if (selectedFilter !== "All Contracts") {
      filtered = filtered.filter((contract) => contract.status === selectedFilter)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((contract) => contract.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply sorting based on selectedSort and sortDirection
    const sortMultiplier = sortDirection === "desc" ? -1 : 1;

    switch (selectedSort) {
      case "Alphabetical (A-Z)":
      case "Alphabetical (Z-A)":
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * a.memberName.localeCompare(b.memberName)
        )
        break
      case "Contract Type (A-Z)":
      case "Contract Type (Z-A)":
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * a.contractType.localeCompare(b.contractType)
        )
        break
      case "Status (A-Z)":
      case "Status (Z-A)":
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * a.status.localeCompare(b.status)
        )
        break
      case "Expiring Soon":
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * (new Date(a.endDate) - new Date(b.endDate))
        )
        break
      case "Recently Added":
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * (new Date(b.startDate) - new Date(a.startDate))
        )
        break
      default:
        // Default alphabetical sorting
        filtered = [...filtered].sort((a, b) =>
          sortMultiplier * a.memberName.localeCompare(b.memberName)
        )
        break
    }

    setFilteredContracts(filtered)
    setCurrentPage(1) // Reset to the first page when filter or sort changes
  }, [selectedFilter, contracts, searchTerm, selectedSort, sortDirection]) // Added sortDirection to dependencies

  const isContractExpired = (endDate) => {
    const today = new Date()
    const contractEndDate = new Date(endDate)
    return today > contractEndDate
  }

  const handleDeleteOngoingContract = (contractId) => {
    if (confirm("Are you sure you want to delete this ongoing contract?")) {
      const updatedContracts = contracts.filter((contract) => contract.id !== contractId)
      setContracts(updatedContracts)
      toast.success("Ongoing contract deleted successfully")
    }
  }

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage)
  const startIndex = (currentPage - 1) * contractsPerPage
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + contractsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the contracts list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-trigger") && !event.target.closest(".dropdown-menu")) {
        setActiveDropdownId(null)
      }
      if (!event.target.closest(".filter-dropdown")) {
        setFilterDropdownOpen(false)
      }
      if (!event.target.closest(".sort-dropdown")) {
        setSortDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleRenewSubmit = (renewalData) => {
    setIsRenewModalOpen(false)
    if (selectedContract) {
      // Calculate new end date based on renewal duration
      const startDate = renewalData.startAfterCurrent
        ? new Date(selectedContract.endDate)
        : new Date(renewalData.customStartDate)

      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + Number.parseInt(renewalData.duration))

      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id
          ? {
            ...contract,
            contractType: renewalData.contractType,
            endDate: endDate.toISOString().split("T")[0],
            status: "Active",
          }
          : contract,
      )
      setContracts(updatedContracts)
    }
    setSelectedContract(null)
    toast.success("Contract renewed successfully")
  }

  const handleChangeSubmit = (changeData) => {
    setIsChangeModalOpen(false)
    if (selectedContract) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id
          ? {
            ...contract,
            contractType: changeData.newContractType,
            // You might want to update other fields based on the change
          }
          : contract,
      )
      setContracts(updatedContracts)
    }
    setSelectedContract(null)
    toast.success("Contract changed successfully")
  }

  const handleChangeContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsChangeModalOpen(true)
  }

  const handleViewDetails = (contract) => {
    setSelectedContract(contract)
    setIsShowDetails(true)
  }

  const toggleDropdownContract = (contractId, event) => {
    event.stopPropagation()
    setActiveDropdownId(activeDropdownId === contractId ? null : contractId)
  }

  const handleCancelContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsCancelModalOpen(true)
  }

  const handlePauseContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsPauseModalOpen(true)
  }

  const handlePauseReasonSubmit = () => {
    setIsPauseModalOpen(false)
    setIsShowDetails(false)
    setSelectedContract(null)
    toast.success("Contract has been paused")
  }

  const handleCancelSubmit = ({ reason, cancelDate }) => {
    setIsCancelModalOpen(false)
    if (selectedContract) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id ? { ...contract, status: "Cancelled", cancelReason: reason } : contract,
      )
      setContracts(updatedContracts)
    }
    setIsShowDetails(false)
    setSelectedContract(null)
    toast.success("Contract has been cancelled")
  }

  const handleEditContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsEditModalOpenContract(true)
  }

  const handleSaveEditedContract = (updatedContract) => {
    const updatedContracts = contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c))
    setContracts(updatedContracts)
    setIsEditModalOpenContract(false)
    toast.success("Contract updated successfully")
  }

  const handleAddContract = () => {
    // Randomly select a lead for pre-filling (in a real app, this would be selected by the user)
    const randomLead = sampleLeads[Math.floor(Math.random() * sampleLeads.length)]
    setSelectedLead(randomLead)
    setIsModalOpen(true)
  }

  const handleSaveNewContract = (contractData) => {
    // Create a new contract with the provided data
    const newContract = {
      id: `12321-${contracts.length + 1}`,
      memberName: contractData.fullName,
      contractType: contractData.rateType || "Basic",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      status: "Active",
      pauseReason: null,
      cancelReason: null,
      isDigital: contractData.isDigital,
      email: contractData.email,
      phone: contractData.phone,
      iban: contractData.iban,
      sepaMandate: contractData.sepaMandate,
      files: contractData.signedFile ? [contractData.signedFile] : [],
    }

    setContracts([...contracts, newContract])
    setIsModalOpen(false)
    toast.success("Contract added successfully")
  }

  const handleManageDocuments = (contract) => {
    setSelectedContract(contract)
    setIsDocumentModalOpen(true)
  }

  const handleAddBonusTime = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsBonusTimeModalOpen(true)
  }

  const handleViewHistory = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsHistoryModalOpen(true)
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
    appointmentTypes
  } = sidebarSystem;

  // more sidebar related functions

  const trainingVideos = trainingVideosData

  // Chart configuration
  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ];

  const chartOptions = {
    chart: {
      type: "line",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 4, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -30,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
    },
    title: {
      text: memberTypes[selectedMemberType].title,
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
      align: "left",
      style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
        '<span style="color: black;">' +
        series[seriesIndex][dataPointIndex] +
        "</span></div>",
    },
  };


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

  const getMemberAppointmentsWrapper = (memberId) => {
    return getMemberAppointments(memberId, appointments);
  };

  const handleAddBillingPeriodWrapper = () => {
    handleAddBillingPeriod(memberContingentData, setMemberContingentData);
  };

  const handleSaveContingentWrapper = () => {
    handleSaveContingent(memberContingentData, setMemberContingentData);
  };

  const handleEditSubmitWrapper = (e) => {
    handleEditSubmit(e, appointments, setAppointments);
  };

  const handleAddRelationWrapper = () => {
    handleAddRelation(memberRelations, setMemberRelations);
  };

  const handleDeleteRelationWrapper = (category, relationId) => {
    handleDeleteRelation(category, relationId, memberRelations, setMemberRelations);
  };

  const handleArchiveMemberWrapper = (memberId) => {
    handleArchiveMember(memberId, appointments, setAppointments);
  };

  const handleUnarchiveMemberWrapper = (memberId) => {
    handleUnarchiveMember(memberId, appointments, setAppointments);
  };

  const getBillingPeriodsWrapper = (memberId) => {
    return getBillingPeriods(memberId, memberContingentData);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVideoById = (id) => {
    return trainingVideos.find((video) => video.id === id)
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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div
        className={`
          min-h-screen rounded-3xl bg-[#1C1C1C] p-4 sm:p-6
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
            ? "lg:mr-86 mr-0" // Adjust right margin when sidebar is open on larger screens
            : "mr-0" // No margin when closed
          }
        `}
      >
        <div className="flex flex-col lg:justify-between md:flex-col lg:flex-row gap-4 mb-6 sm:mb-8">
          {/* Title and Menu Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-white oxanium_font text-xl sm:text-2xl">Contracts</h2>

              <div className="flex bg-black items-center rounded-xl border border-gray-800 p-1 w-fit">
                <span className="text-xs text-gray-400 px-2">View</span>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="md:hidden text-white">
              <IoIosMenu size={23} />
            </button>
          </div>

          {/* Controls Row - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* View Mode Toggle */}

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Filter Dropdown */}
              <div className="relative filter-dropdown flex-1 sm:flex-none sm:min-w-[150px]">
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full"
                >
                  {selectedFilter}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {filterDropdownOpen && (
                  <div className="absolute left-0 right-0 sm:right-auto sm:w-full text-sm mt-2 bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                    {["All Contracts", "Active", "Ongoing", "Paused", "Cancelled"].map((filter) => (
                      <button
                        key={filter}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black cursor-pointer text-left"
                        onClick={() => {
                          setSelectedFilter(filter)
                          setFilterDropdownOpen(false)
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>


            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={handleAddContract}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-xl hover:bg-[#e06b21] transition-colors flex-1 sm:flex-none"
              >
                <Plus className="w-5 h-5" />
                <span>Create Contract</span>
              </button>

              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="hidden md:block text-sm hover:bg-gray-100 hover:text-black text-white rounded-md cursor-pointer"
              >
                <IoIosMenu size={23} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-1 flex-1 sm:flex-none sm:min-w-[200px]">
            {/* Sort Field Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-200  whitespace-nowrap">
                Sort:
              </label>              <select
                id="sort-field"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-black text-sm text-white px-4 py-2 rounded-xl border border-gray-800 w-full cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Direction Dropdown */}
            <div className="w-[140px]">
              <label htmlFor="sort-direction" className="sr-only">Sort Direction</label>
              <select
                id="sort-direction"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                className="bg-black text-sm text-white px-4 py-2 rounded-xl border border-gray-800 w-full cursor-pointer"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Contracts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
          />
        </div>

        {viewMode === "list" ? (
          // List View (Original Layout)
          <div className="space-y-3">
            {paginatedContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
              >
                <div className="flex flex-col items-start justify-start">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-lg mb-1 ${contract.status === "Active"
                      ? "bg-green-600 text-white"
                      : contract.status === "Ongoing"
                        ? "bg-gray-600 text-white"
                        : contract.status === "Paused"
                          ? "bg-yellow-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                  >
                    {contract.status}
                    {contract.pauseReason && ` (${contract.pauseReason})`}
                    {contract.cancelReason && ` (${contract.cancelReason})`}
                  </span>

                  {contract.status === "Ongoing" && contract.signatureRequired && (
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-red-500 text-xs font-medium">Signature required</span>
                    </div>
                  )}

                  <span className="text-white font-medium">{contract.memberName}</span>
                  <span className="text-sm text-gray-400">{contract.contractType}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {contract.startDate} - {contract.endDate}
                    </span>
                    {isContractExpired(contract.endDate) && contract.status === "Active" && (
                      <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleViewDetails(contract)}
                    className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-1.5 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManageDocuments(contract)}
                      className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                      title="Manage Documents"
                    >
                      <FileText size={16} />
                      {contract.status === "Ongoing" && contract.signatureRequired && (
                        <AiOutlineExclamation
                          className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
                      )}
                    </button>
                    <button
                      onClick={() => handleViewHistory(contract.id)}
                      className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      title="View Contract History"
                    >
                      <History size={16} />
                    </button>
                    {contract.status === "Ongoing" ? (
                      <button
                        onClick={() => handleDeleteOngoingContract(contract.id)}
                        className="p-2 bg-black rounded-xl border border-slate-600 hover:border-red-400 hover:text-red-400 transition-colors"
                        title="Delete Ongoing Contract"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 cursor-pointer" />
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdownContract(contract.id, e)}
                          className="dropdown-trigger p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </button>

                        {activeDropdownId === contract.id && (
                          <div className="dropdown-menu absolute right-0 top-10 w-46 bg-[#2F2F2F]/20 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                            <button
                              onClick={() => handleRenewContract(contract.id)}
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            >
                              Renew Contract{" "}
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handleChangeContract(contract.id)}
                            >
                              Change Contract
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handleAddBonusTime(contract.id)}
                            >
                              Add Bonustime
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handlePauseContract(contract.id)}
                            >
                              Pause Contract
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                              onClick={() => handleCancelContract(contract.id)}
                            >
                              Cancel Contract
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedContracts.map((contract) => (
              <div key={contract.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-lg ${contract.status === "Active"
                      ? "bg-green-600 text-white"
                      : contract.status === "Ongoing"
                        ? "bg-gray-600 text-white"
                        : contract.status === "Paused"
                          ? "bg-yellow-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                  >
                    {contract.status}
                    {contract.pauseReason && ` (${contract.pauseReason})`}
                    {contract.cancelReason && ` (${contract.cancelReason})`}
                  </span>

                  {contract.status === "Ongoing" ? (
                    <button
                      onClick={() => handleDeleteOngoingContract(contract.id)}
                      className="p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                      title="Delete Ongoing Contract"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 cursor-pointer" />
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdownContract(contract.id, e)}
                        className="dropdown-trigger p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                      </button>

                      {activeDropdownId === contract.id && (
                        <div className="dropdown-menu absolute right-0 top-6 w-46 bg-[#2F2F2F]/20 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                          <button
                            onClick={() => handleRenewContract(contract.id)}
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                          >
                            Renew Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handleChangeContract(contract.id)}
                          >
                            Change Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handleAddBonusTime(contract.id)}
                          >
                            Add Bonustime
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handlePauseContract(contract.id)}
                          >
                            Pause Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                            onClick={() => handleCancelContract(contract.id)}
                          >
                            Cancel Contract
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {contract.status === "Ongoing" && contract.signatureRequired && (
                  <div className="flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-red-500 text-xs font-medium">Signature required</span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <h3 className="text-white font-medium text-lg">{contract.memberName}</h3>
                  <p className="text-gray-400 text-sm">{contract.contractType}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-sm">
                      {contract.startDate} - {contract.endDate}
                    </p>
                    {isContractExpired(contract.endDate) && contract.status === "Active" && (
                      <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{contract.isDigital ? "Digital" : "Analog"}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewDetails(contract)}
                    className="px-3 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManageDocuments(contract)}
                      className="flex-1 p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center relative"
                      title="Manage Documents"
                    >
                      <FileText className="w-5 h-5" />
                      {contract.status === "Ongoing" && contract.signatureRequired && (
                        <AiOutlineExclamation
                          className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
                      )}
                    </button>
                    <button
                      onClick={() => handleViewHistory(contract.id)}
                      className="flex-1 p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center"
                      title="View Contract History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedContracts.length === 0 && (
          <div className="bg-[#141414] p-6 rounded-xl text-center">
            <p className="text-gray-400">No contracts found matching your criteria.</p>
          </div>
        )}

        {/* Add Contract Modal */}
        {isModalOpen && (
          <AddContractModal
            onClose={() => {
              setIsModalOpen(false)
              setSelectedLead(null)
            }}
            onSave={handleSaveNewContract}
            leadData={selectedLead}
          />
        )}

        {/* View Details Modal */}
        {isShowDetails && selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => {
              setIsShowDetails(false)
              setSelectedContract(null)
            }}
            onPause={() => handlePauseContract(selectedContract.id)}
            onCancel={() => handleCancelContract(selectedContract.id)}
            handleHistoryModal={handleViewHistory}
          />
        )}

        {/* Pause Contract Modal */}
        {isPauseModalOpen && (
          <PauseContractModal onClose={() => setIsPauseModalOpen(false)} onSubmit={handlePauseReasonSubmit} />
        )}

        {/* Cancel Contract Modal */}
        {isCancelModalOpen && (
          <CancelContractModal onClose={() => setIsCancelModalOpen(false)} onSubmit={handleCancelSubmit} />
        )}

        {/* Edit Contract Modal */}
        {isEditModalOpenContract && selectedContract && (
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpenContract(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {/* Document Management Modal */}
        {isDocumentModalOpen && selectedContract && (
          <DocumentManagementModal
            contract={selectedContract}
            onClose={() => {
              setIsDocumentModalOpen(false)
              setSelectedContract(null)
            }}
          />
        )}

        {/* Bonus Time Modal */}
        {isBonusTimeModalOpen && selectedContract && (
          <BonusTimeModal
            contract={selectedContract}
            onClose={() => setIsBonusTimeModalOpen(false)}
            onSubmit={(bonusData) => {
              setIsBonusTimeModalOpen(false)
              toast.success("Bonus time added successfully")
            }}
          />
        )}

        {/* Renew Contract Modal */}
        {isRenewModalOpen && selectedContract && (
          <RenewContractModal
            contract={selectedContract}
            onClose={() => setIsRenewModalOpen(false)}
            onSubmit={handleRenewSubmit}
          />
        )}

        {isChangeModalOpen && selectedContract && (
          <ChangeContractModal
            contract={selectedContract}
            onClose={() => setIsChangeModalOpen(false)}
            onSubmit={handleChangeSubmit}
          />
        )}
        {/* Contract History Modal */}
        {isHistoryModalOpen && selectedContract && (
          <ContractHistoryModal
            contract={selectedContract}
            history={contractHistory[selectedContract.id] || []}
            onClose={() => {
              setIsHistoryModalOpen(false)
              setSelectedContract(null)
            }}
          />
        )}
      </div>
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
        chartOptions={chartOptions}
        chartSeries={chartSeries}
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
      />

      {/* Sidebar related modals */}
      <TrainingPlanModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => setIsTrainingPlanModalOpen(false)}
        user={selectedUserForTrainingPlan}
        trainingPlans={mockTrainingPlans}
        getDifficultyColor={getDifficultyColor}
        getVideoById={getVideoById}
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

      <MemberOverviewModal
        isOpen={isMemberOverviewModalOpen}
        onClose={() => {
          setIsMemberOverviewModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        handleCalendarFromOverview={handleCalendarFromOverview}
        handleHistoryFromOverview={handleHistoryFromOverview}
        handleCommunicationFromOverview={handleCommunicationFromOverview}
        handleViewDetailedInfo={handleViewDetailedInfo}
        handleEditFromOverview={handleEditFromOverview}
      />

      <AppointmentModal
        show={showAppointmentModal}
        member={selectedMember}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedMember(null);
        }}
        getMemberAppointments={getMemberAppointmentsWrapper}
        appointmentTypes={appointmentTypes}
        handleEditAppointment={handleEditAppointment}
        handleCancelAppointment={handleCancelAppointment}
        currentBillingPeriod={currentBillingPeriod}
        memberContingentData={memberContingentData}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        memberHistory={memberHistory}
      />

      <MemberDetailsModal
        isOpen={isMemberDetailsModalOpen}
        onClose={() => {
          setIsMemberDetailsModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        memberRelations={memberRelations}
        DefaultAvatar={DefaultAvatar}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        redirectToContract={redirectToContract}
      />

      <ContingentModal
        show={showContingentModal}
        setShow={setShowContingentModal}
        selectedMember={selectedMember}
        getBillingPeriods={getBillingPeriodsWrapper}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={setSelectedBillingPeriod}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleSaveContingent={handleSaveContingentWrapper}
      />

      <AddBillingPeriodModal
        show={showAddBillingPeriodModal}
        setShow={setShowAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        handleAddBillingPeriod={handleAddBillingPeriodWrapper}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        editModalTab={editModalTab}
        setEditModalTab={setEditModalTab}
        editForm={editForm}
        handleInputChange={handleInputChange}
        handleEditSubmit={handleEditSubmitWrapper}
        editingRelations={editingRelations}
        setEditingRelations={setEditingRelations}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelation={handleAddRelationWrapper}
        memberRelations={memberRelations}
        handleDeleteRelation={handleDeleteRelationWrapper}
        handleArchiveMember={handleArchiveMemberWrapper}
        handleUnarchiveMember={handleUnarchiveMemberWrapper}
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
    </>
  )
}
