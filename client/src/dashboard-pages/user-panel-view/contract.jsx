/* eslint-disable no-unused-vars */
import {
  MoreVertical,
  Plus,
  ChevronDown,
  FileText,
  History,
  Search,
  Grid3X3,
  List,
  Eye,
  Trash2,
  AlertTriangle,
  ChevronUp,
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

import { useNavigate } from "react-router-dom"
import { AiOutlineExclamation } from "react-icons/ai"

import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { contractHistory, initialContracts, sampleLeads } from "../../utils/user-panel-states/contract-states"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import { DeleteContractModal } from "../../components/user-panel-components/contract-components/delete-contract-modal"

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
  const [isCompactView, setIsCompactView] = useState(false)
  const [expandedCompactId, setExpandedCompactId] = useState(null)

  const [showContractPromptModal, setShowContractPromptModal] = useState(false);


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState(null)

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false)
  const [isEditModalOpenContract, setIsEditModalOpenContract] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const contractsPerPage = 40
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isBonusTimeModalOpen, setIsBonusTimeModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const [sortBy, setSortBy] = useState("alphabetical-asc");

  // Replace the sortOptions array with this:
  const sortOptions = [
    { value: "alphabetical-asc", label: "Alphabetical (A-Z)" },
    { value: "alphabetical-desc", label: "Alphabetical (Z-A)" },
    { value: "contractType-asc", label: "Contract Type (A-Z)" },
    { value: "contractType-desc", label: "Contract Type (Z-A)" },
    { value: "status-asc", label: "Status (A-Z)" },
    { value: "status-desc", label: "Status (Z-A)" },
    { value: "expiring-asc", label: "Expiring Soon" },
    { value: "expiring-desc", label: "Expiring Last" },
    { value: "recentlyAdded-asc", label: "Recently Added" },
    { value: "recentlyAdded-desc", label: "Oldest First" },
  ];
  const handleRenewContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsRenewModalOpen(true)
  }


  useEffect(() => {
    let filtered = contracts;

    // Apply status filter
    if (selectedFilter !== "All Contracts") {
      filtered = filtered.filter((contract) => contract.status === selectedFilter);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((contract) =>
        contract.memberName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting based on sortBy value
    const [field, direction] = sortBy.split("-");

    switch (field) {
      case "alphabetical":
        filtered = [...filtered].sort((a, b) => {
          const comparison = a.memberName.localeCompare(b.memberName);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
      case "contractType":
        filtered = [...filtered].sort((a, b) => {
          const comparison = a.contractType.localeCompare(b.contractType);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
      case "status":
        filtered = [...filtered].sort((a, b) => {
          const comparison = a.status.localeCompare(b.status);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
      case "expiring":
        filtered = [...filtered].sort((a, b) => {
          const comparison = new Date(a.endDate) - new Date(b.endDate);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
      case "recentlyAdded":
        filtered = [...filtered].sort((a, b) => {
          const comparison = new Date(b.startDate) - new Date(a.startDate);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
      default:
        // Default alphabetical sorting
        filtered = [...filtered].sort((a, b) => {
          const comparison = a.memberName.localeCompare(b.memberName);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
    }

    setFilteredContracts(filtered);
    setCurrentPage(1); // Reset to the first page when filter or sort changes
  }, [selectedFilter, contracts, searchTerm, sortBy]); // Added sortDirection to dependencies

  const isContractExpired = (endDate) => {
    const today = new Date()
    const contractEndDate = new Date(endDate)
    return today > contractEndDate
  }

  const handleDeleteOngoingContract = (contractId) => {
    const contract = contracts.find((c) => c.id === contractId)
    setContractToDelete(contract)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteContract = () => {
    if (contractToDelete) {
      const updatedContracts = contracts.filter((contract) => contract.id !== contractToDelete.id)
      setContracts(updatedContracts)
      toast.success("Ongoing contract deleted successfully")
      setIsDeleteModalOpen(false)
      setContractToDelete(null)
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

  const {
    // States
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
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

    handleViewMemberDetails,
    handleNotifyMember,

    truncateUrl,
    renderSpecialNoteIcon,

    // new states
    customLinks,
    setCustomLinks,
    communications,
    setCommunications,
    todos,
    setTodos,
    expiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,


    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,

    todoFilterOptions,
    relationOptions,
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem


  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos)
  }

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos)
  }

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos)
  }

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos)
  }

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments)
  }

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments)
  }

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  }

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  }

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments)
  }

  const getFirstAndLastName = (fullName) => {
    const parts = fullName.trim().split(" ")
    const firstName = parts[0] || ""
    const lastName = parts[parts.length - 1] || ""
    return { firstName, lastName }
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
            </div>
            {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="md:hidden">
              <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            ) : (<div onClick={toggleRightSidebar} className="md:hidden ">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            )}
          </div>

          {/* Controls Row - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex gap-2 items-center">
              {/* Combined View and Display Controls */}
              <div className="flex items-center gap-2 bg-black rounded-xl p-1">
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

                {/* Three Dots Display Mode Toggle */}
                <div className="h-6 w-px bg-gray-700 mx-1"></div>
                <button
                  onClick={() => setIsCompactView(!isCompactView)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isCompactView ? "text-[#F27A30]" : "text-[#F27A30]"}`}
                  title={isCompactView ? "Compact View (Click for Detailed)" : "Detailed View (Click for Compact)"}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                    </div>
                  </div>
                  <span className="text-xs ml-1 hidden sm:inline">
                    {isCompactView ? "Compact" : "Detailed"}
                  </span>
                </button>
              </div>
            </div>

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
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center text-white justify-end gap-2 w-full">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-black min-w-[200px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
          // List View
          isCompactView ? (
            <div className="space-y-2">
              {paginatedContracts.map((contract) => (
                <div key={contract.id}>
                  {expandedCompactId === contract.id ? (
                    // Expanded compact view shows full details
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4">
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

                        {/* First and Last Name in one line */}
                        <span className="text-white font-medium">
                          {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                        </span>

                        {/* Status displayed fully underneath */}
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
                              <AiOutlineExclamation className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
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

                        <button
                          onClick={() => setExpandedCompactId(null)}
                          className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
                          title="Collapse"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Collapsed compact view - minimal info WITHOUT profile picture
                    <div className="flex items-center justify-between bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Profile picture removed */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* First and Last Name in one line */}
                            <span className="text-white font-medium text-sm">
                              {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                            </span>
                            {/* Status displayed fully */}
                            <span
                              className={`px-1.5 py-0.5 text-xs font-medium rounded flex-shrink-0 ${contract.status === "Active"
                                ? "bg-green-600 text-white"
                                : contract.status === "Ongoing"
                                  ? "bg-gray-600 text-white"
                                  : contract.status === "Paused"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                            >
                              {contract.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedCompactId(contract.id)}
                        className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors flex-shrink-0"
                        title="Expand"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Detailed List View (Original Layout) WITHOUT profile picture
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

                    {/* First and Last Name in one line */}
                    <span className="text-white font-medium">
                      {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                    </span>

                    {/* Status displayed fully underneath */}
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
                          <AiOutlineExclamation className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
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
          )
        ) : // Grid View
          isCompactView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {paginatedContracts.map((contract) => (
                <div key={contract.id}>
                  {expandedCompactId === contract.id ? (
                    // Expanded view within grid WITHOUT profile picture
                    <div className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col h-full col-span-2 md:col-span-2 lg:col-span-2">
                      {/* Header section */}
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

                      {/* Content section WITHOUT profile picture */}
                      <div className="flex-1 mb-4 flex flex-col gap-1.5">
                        {/* First and Last Name in one line */}
                        <h3 className="text-white font-medium text-lg leading-tight">
                          {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                        </h3>

                        {/* Status displayed fully underneath */}
                        <p className="text-gray-400 text-sm leading-snug">{contract.contractType}</p>

                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-sm leading-snug">
                            {contract.startDate} - {contract.endDate}
                          </p>
                          {isContractExpired(contract.endDate) && contract.status === "Active" && (
                            <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm leading-snug">{contract.isDigital ? "Digital" : "Analog"}</p>
                      </div>

                      {/* Button section - always at the bottom */}
                      <div className="flex flex-col gap-2 mt-auto">
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
                              <AiOutlineExclamation className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
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
                        <button
                          onClick={() => setExpandedCompactId(null)}
                          className="px-3 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                          title="Collapse"
                        >
                          <ChevronUp size={16} />
                          Collapse
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Compact tile view WITHOUT profile picture
                    <div className="bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col items-center justify-center gap-2 h-full">
                      {/* Profile picture removed */}
                      <div className="text-center w-full min-w-0">
                        {/* First and Last Name in one line */}
                        <p className="text-white font-medium text-xs">
                          {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                        </p>

                        {/* Status displayed fully */}
                        <span
                          className={`px-1.5 py-0.5 text-xs font-medium rounded mt-1 inline-block ${contract.status === "Active"
                            ? "bg-green-600 text-white"
                            : contract.status === "Ongoing"
                              ? "bg-gray-600 text-white"
                              : contract.status === "Paused"
                                ? "bg-yellow-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                        >
                          {contract.status}
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedCompactId(contract.id)}
                        className="p-1.5 bg-black rounded-lg border border-slate-600 hover:border-slate-400 transition-colors w-full flex items-center justify-center"
                        title="Expand"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Detailed Grid View WITHOUT profile picture
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col h-full"
                >
                  {/* Header section */}
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

                  {/* Content section WITHOUT profile picture */}
                  <div className="flex-1 mb-4 flex flex-col gap-1.5">
                    {/* First and Last Name in one line */}
                    <h3 className="text-white font-medium text-lg leading-tight">
                      {getFirstAndLastName(contract.memberName).firstName} {getFirstAndLastName(contract.memberName).lastName}
                    </h3>

                    {/* Status displayed fully underneath */}
                    <p className="text-gray-400 text-sm leading-snug">{contract.contractType}</p>

                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-sm leading-snug">
                        {contract.startDate} - {contract.endDate}
                      </p>
                      {isContractExpired(contract.endDate) && contract.status === "Active" && (
                        <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm leading-snug">{contract.isDigital ? "Digital" : "Analog"}</p>
                  </div>

                  {/* Button section - always at the bottom */}
                  <div className="flex flex-col gap-2 mt-auto">
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
                          <AiOutlineExclamation className="w-4 h-4 text-white rounded-full bg-red-600 absolute -top-2 -right-2" />
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

        {isPauseModalOpen && (
          <PauseContractModal onClose={() => setIsPauseModalOpen(false)} onSubmit={handlePauseReasonSubmit} />
        )}

        {isCancelModalOpen && (
          <CancelContractModal onClose={() => setIsCancelModalOpen(false)} onSubmit={handleCancelSubmit} />
        )}

        {isEditModalOpenContract && selectedContract && (
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpenContract(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {isDocumentModalOpen && selectedContract && (
          <DocumentManagementModal
            contract={selectedContract}
            onClose={() => {
              setIsDocumentModalOpen(false)
              setSelectedContract(null)
            }}
          />
        )}

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

        {isDeleteModalOpen && (
          <DeleteContractModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setContractToDelete(null)
            }}
            onDelete={confirmDeleteContract}
            contract={contractToDelete}
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

      {/* ... existing sidebar modals ... */}
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

      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

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
