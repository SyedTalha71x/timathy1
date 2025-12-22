/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, createContext } from "react"
import { X, Calendar, Users, History, MessageCircle, Grid3X3, List, FileText, Eye, ChevronUp, ChevronDown } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import AddStaffModal from "../../components/user-panel-components/staff-components/add-staff-modal"
import EditStaffModal from "../../components/user-panel-components/staff-components/edit-staff-modal"
import StaffPlanningModal from "../../components/user-panel-components/staff-components/staff-panning-modal"
import AttendanceOverviewModal from "../../components/user-panel-components/staff-components/attendance-overview-modal"
import VacationCalendarModal from "../../components/user-panel-components/staff-components/vacation-calendar-modal"
import StaffHistoryModal from "../../components/user-panel-components/staff-components/staff-history-modal"
import { staffMemberDataNew } from "../../utils/user-panel-states/staff-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Sidebar from "../../components/central-sidebar"
import { TbPlusMinus } from "react-icons/tb";


import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import { StafffDocumentManagementModal } from "../../components/user-panel-components/staff-components/document-management-modal"
import ChatPopup from "../../components/user-panel-components/staff-components/chat-popup"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import { Briefcase } from 'lucide-react';
import VacationContingentModal from "../../components/user-panel-components/staff-components/vacation-contigent"


const StaffContext = createContext(null)

const RoleTag = ({ role, compact = false }) => {
  const getDynamicRoleColor = (role) => {
    const roleColors = {
      'Telephone operator': 'bg-purple-600',
      'Software Engineer': 'bg-blue-600', 
      'System Engineer': 'bg-green-600',
      'Manager': 'bg-red-600',
      'Trainer': 'bg-indigo-600',
      'Reception': 'bg-yellow-600',
      'Cleaner': 'bg-orange-600',
      'Admin': 'bg-pink-600',
      'Therapist': 'bg-teal-600'
    };

    return roleColors[role] || 'bg-gray-600';
  };

  const bgColor = getDynamicRoleColor(role);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
        <Briefcase size={12} />
        <span className="truncate max-w-[80px]">{role}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-xs font-medium`}>
      <Briefcase size={14} />
      <span>{role}</span>
    </div>
  );
};

export default function StaffManagement() {
  const sidebarSystem = useSidebarSystem();
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [staffToRemove, setStaffToRemove] = useState(null)
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isVacationRequestModalOpen, setIsVacationRequestModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState(null)
  const [viewMode, setViewMode] = useState("grid")

  const [isCompactView, setIsCompactView] = useState(false);
  const [expandedStaffId, setExpandedStaffId] = useState(null);

  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedMemberForDocuments, setSelectedMemberForDocuments] = useState(null)

  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    staff: null
  });

  const [isVacationContingentModalOpen, setIsVacationContingentModalOpen] = useState(false)
  const [selectedStaffForContingent, setSelectedStaffForContingent] = useState(null)

  const handleVacationContingentClick = (staff) => {
    setSelectedStaffForContingent(staff)
    setIsVacationContingentModalOpen(true)
  }
  const handleUpdateVacationContingent = (staffId, newContingent, notes) => {
    setStaffMembers(prev => prev.map(staff =>
      staff.id === staffId
        ? {
          ...staff,
          vacationDays: newContingent,
          vacationNotes: notes
        }
        : staff
    ))
    toast.success("Vacation contingent updated successfully")
  }


  const trainingVideos = trainingVideosData
  const [staffMembers, setStaffMembers] = useState(staffMemberDataNew)

  const handleEdit = (staff) => {
    setSelectedStaff(staff)
    setIsShowDetails(true)
  }

  const handleRemovalStaff = (staff) => {
    setStaffToRemove(staff)
    setIsRemoveModalOpen(true)
  }

  const handleDocumentClick = (member) => {
    setSelectedMemberForDocuments(member)
    setShowDocumentModal(true)
  }


  const confirmRemoveStaff = () => {
    setStaffMembers(staffMembers.filter((member) => member.id !== staffToRemove.id))
    setIsRemoveModalOpen(false)
    setStaffToRemove(null)
    setIsShowDetails(false)
    toast.success("Staff member deleted successfully")
  }

  const handleVacationRequest = (staffId, startDate, endDate) => {
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  const handleHistoryClick = (staff) => {
    setSelectedStaffForHistory(staff)
    setIsHistoryModalOpen(true)
  }

  const handleChatClick = (staff) => {
    setChatPopup({
      isOpen: true,
      staff: staff
    });
  };

  const handleOpenFullMessenger = (staff) => {
    setChatPopup({ isOpen: false, staff: null });
    window.location.href = `/dashboard/communication`;
  };


  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
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


  return (
    <StaffContext.Provider value={{ staffMembers, setStaffMembers }}>
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
          className={`flex relative rounded-3xl transition-all duration-500 cursor-pointer bg-[#1C1C1C] text-white ${isRightSidebarOpen ? "lg:mr-89 mr-0" : "mr-0"
            }`}
        >
          <div className="flex-1 min-w-0 p-4 sm:p-6">
            <div
              className={`flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 transition-all duration-500`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl lg:text-2xl oxanium_font text-white">
                    Staff
                  </h1>

                  <div className="md:flex gap-2 items-center hidden">
                    {/* Combined View and Display Controls */}
                    <div className="flex items-center gap-2 bg-black rounded-xl p-1">
                      <span className="text-xs text-gray-400 px-2">View</span>
                      <button
                        onClick={toggleViewMode}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                          ? "bg-[#FF843E] text-white"
                          : "text-gray-400 hover:text-white"
                          }`}
                        title={viewMode === "grid" ? "Grid View (Active)" : "Switch to Grid View"}
                      >
                        <Grid3X3 size={16} />
                      </button>
                      <button
                        onClick={toggleViewMode}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                          ? "bg-[#FF843E] text-white"
                          : "text-gray-400 hover:text-white"
                          }`}
                        title={viewMode === "list" ? "List View (Active)" : "Switch to List View"}
                      >
                        <List size={16} />
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
                </div>

                {isRightSidebarOpen ? (
                  <div onClick={toggleRightSidebar} className="lg:hidden block ">
                    <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                ) : (
                  <div onClick={toggleRightSidebar} className="lg:hidden block ">
                    <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                )}
              </div>

              <div className="md:hidden flex items-center gap-2">
                {/* Mobile View Controls */}
                <div className="flex items-center gap-2 bg-black rounded-xl p-1">
                  <span className="text-xs text-gray-400 px-1">View</span>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                      ? "bg-[#FF843E] text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <Grid3X3 size={14} />
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                      ? "bg-[#FF843E] text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <List size={14} />
                  </button>
                  
                  <div className="h-5 w-px bg-gray-700 mx-1"></div>
                  <button
                    onClick={() => setIsCompactView(!isCompactView)}
                    className={`p-2 rounded-lg transition-colors ${isCompactView ? "text-[#F27A30]" : "text-[#F27A30]"}`}
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
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:justify-end">
                <button
                  onClick={() => setIsPlanningModalOpen(true)}
                  className="bg-black py-2.5 px-4 lg:px-6 text-sm rounded-xl flex items-center justify-center gap-2 w-full lg:w-auto"
                >
                  <Users className="h-4 w-4" />
                  {!isRightSidebarOpen && <span className="hidden sm:inline">Staff planning</span>}
                  <span className="sm:hidden">Planning</span>
                </button>

                <button
                  onClick={() => setIsVacationRequestModalOpen(true)}
                  className="bg-black py-2.5 px-4 lg:px-6 text-sm rounded-xl flex items-center justify-center gap-2 w-full lg:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  {!isRightSidebarOpen && <span className="hidden sm:inline">Vacation Calendar</span>}
                  <span className="sm:hidden">Vacation</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-orange-500 text-white px-4 lg:px-10 py-2.5 rounded-xl text-sm whitespace-nowrap w-full lg:w-auto"
                >
                  + Create Staff
                </button>

                {isRightSidebarOpen ? (
                  <div onClick={toggleRightSidebar} className="lg:block hidden ">
                    <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                ) : (
                  <div onClick={toggleRightSidebar} className="lg:block hidden ">
                    <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                )}
              </div>
            </div>

            {/* Staff List/Grid View with Compact/Detailed modes */}
            <div className="open_sans_font">
              {viewMode === "list" ? (
                // LIST VIEW
                isCompactView ? (
                  // COMPACT LIST VIEW
                  <div className="space-y-2">
                    {staffMembers.map((staff) => (
                      <div key={staff.id}>
                        {expandedStaffId === staff.id ? (
                          // Expanded compact view
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <img
                                src={staff.img || "/placeholder.svg?height=80&width=80"}
                                className="h-12 w-12 rounded-xl flex-shrink-0 object-cover"
                                alt={`${staff.firstName} ${staff.lastName}`}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-base sm:text-lg">
                                  {staff.firstName} {staff.lastName}
                                </h3>
                                <div className="mb-2">
                                  <RoleTag role={staff.role} />
                                </div>
                                <p className="text-gray-400 text-sm">
                                  {staff.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(staff)}
                                  className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleHistoryClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <History size={16} />
                                </button>
                                <button
                                  onClick={() => handleChatClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <MessageCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleVacationContingentClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <TbPlusMinus size={16} />
                                </button>
                                <button
                                  onClick={() => handleDocumentClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <FileText size={16} />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => setExpandedStaffId(null)}
                              className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
                            >
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          // Collapsed compact view
                          <div className="flex items-center justify-between bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img
                                src={staff.img || "/placeholder.svg?height=80&width=80"}
                                alt={`${staff.firstName} ${staff.lastName}`}
                                className="w-10 h-10 rounded-xl flex-shrink-0 object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium text-sm">
                                    {staff.firstName} {staff.lastName}
                                  </span>
                                  <RoleTag role={staff.role} compact={true} />
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedStaffId(staff.id)}
                              className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors flex-shrink-0"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // DETAILED LIST VIEW
                  <div className="flex flex-col gap-3">
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center text-left gap-4"
                      >
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <img
                            src={staff.img || "/placeholder.svg?height=80&width=80"}
                            width={80}
                            height={80}
                            className="rounded-xl h-12 w-12 sm:h-16 sm:w-16 object-cover"
                            alt={`${staff.firstName} ${staff.lastName}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-base sm:text-lg mb-1 text-center sm:text-left">
                            {staff.firstName} {staff.lastName}
                          </h3>
                          <div className="mb-2 text-center sm:text-left">
                            <RoleTag role={staff.role} />
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm mb-3 text-center sm:text-left">
                            {staff.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-shrink-0 w-full sm:w-auto gap-2">
                          <button
                            onClick={() => handleEdit(staff)}
                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 sm:px-6 hover:text-white hover:border-slate-400 transition-colors text-sm flex-1 sm:flex-none"
                          >
                            Edit
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleHistoryClick(staff)}
                              className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                            >
                              <History size={16} />
                            </button>
                            <button
                              onClick={() => handleChatClick(staff)}
                              className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleVacationContingentClick(staff)}
                              className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                              title="Manage Vacation Contingent"
                            >
                              <TbPlusMinus size={16} />
                            </button>
                            <button
                              onClick={() => handleDocumentClick(staff)}
                              className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                              title="Document Management"
                            >
                              <FileText size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : // GRID VIEW
                isCompactView ? (
                  // COMPACT GRID VIEW
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {staffMembers.map((staff) => (
                      <div key={staff.id}>
                        {expandedStaffId === staff.id ? (
                          // Expanded grid view
                          <div className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col h-full col-span-2 md:col-span-2 lg:col-span-2">
                            <div className="flex-1  mb-4 flex flex-col gap-1.5">
                              <div className="flex flex-col justify-center items-center gap-3 mb-3">
                                <img
                                  src={staff.img || "/placeholder.svg?height=80&width=80"}
                                  className="h-16 w-16 rounded-xl flex-shrink-0 object-cover"
                                  alt={`${staff.firstName} ${staff.lastName}`}
                                />
                                <div>
                                  <h3 className="text-white text-center font-medium text-lg leading-tight">
                                    {staff.firstName} {staff.lastName}
                                  </h3>
                                  <div className="mt-2">
                                    <RoleTag role={staff.role} />
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-400 text-center text-sm leading-snug">
                                {staff.description}
                              </p>
                            </div>

                            <div className="flex  flex-col gap-2 mt-auto">
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  onClick={() => handleEdit(staff)}
                                  className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-3 hover:text-white hover:border-slate-400 transition-colors text-sm flex-1"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleHistoryClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <History size={16} />
                                </button>
                                <button
                                  onClick={() => handleChatClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <MessageCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleVacationContingentClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <TbPlusMinus size={16} />
                                </button>
                                <button
                                  onClick={() => handleDocumentClick(staff)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                >
                                  <FileText size={16} />
                                </button>
                              </div>

                              <button
                                onClick={() => setExpandedStaffId(null)}
                                className="px-3 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                              >
                                <ChevronUp size={16} />
                                Collapse
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Compact tile view
                          <div className="bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col items-center justify-center gap-2 h-full">
                            <div className="relative w-full flex justify-center">
                              <img
                                src={staff.img || "/placeholder.svg?height=80&width=80"}
                                alt={`${staff.firstName} ${staff.lastName}`}
                                className="w-14 h-14 rounded-xl object-cover"
                              />
                            </div>

                            <div className="text-center w-full min-w-0">
                              <p className="text-white font-medium text-sm leading-tight mb-2">
                                {staff.firstName} {staff.lastName}
                              </p>
                              <div className="flex justify-center">
                                <RoleTag role={staff.role} compact={true} />
                              </div>
                            </div>

                            <button
                              onClick={() => setExpandedStaffId(staff.id)}
                              className="p-1.5 bg-black rounded-lg border border-slate-600 hover:border-slate-400 transition-colors w-full flex items-center justify-center"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // DETAILED GRID VIEW
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? "xl:grid-cols-2" : "xl:grid-cols-3"
                      } gap-3 sm:gap-4`}
                  >
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center"
                      >
                        <div className="relative w-full mb-4">
                          <img
                            src={staff.img || "/placeholder.svg?height=80&width=80"}
                            width={80}
                            height={80}
                            className="rounded-xl h-16 w-16 sm:h-20 sm:w-20 mx-auto object-cover"
                            alt={`${staff.firstName} ${staff.lastName}`}
                          />
                        </div>

                        <div className="w-full">
                          <h3 className="text-white font-medium text-base sm:text-lg mb-2 text-center leading-tight">
                            {staff.firstName} {staff.lastName}
                          </h3>
                          <div className="mb-3 text-center">
                            <RoleTag role={staff.role} />
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm mb-4 text-center">
                            {staff.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center w-full gap-2">
                          <button
                            onClick={() => handleEdit(staff)}
                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 sm:px-6 hover:text-white hover:border-slate-400 transition-colors text-sm flex-1 sm:flex-none"
                          >
                            Edit
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleHistoryClick(staff)}
                              className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                            >
                              <History size={16} />
                            </button>
                            <button
                              onClick={() => handleChatClick(staff)}
                              className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleVacationContingentClick(staff)}
                              className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                              title="Manage Vacation Contingent"
                            >
                              <TbPlusMinus size={16} />
                            </button>
                            <button
                              onClick={() => handleDocumentClick(staff)}
                              className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                              title="Document Management"
                            >
                              <FileText size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>


        {isModalOpen && (
          <AddStaffModal
            setIsModalOpen={setIsModalOpen}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
          />
        )}

        {isShowDetails && selectedStaff && (
          <EditStaffModal
            staff={selectedStaff}
            setIsShowDetails={setIsShowDetails}
            setSelectedStaff={setSelectedStaff}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
            handleRemovalStaff={handleRemovalStaff}
          />
        )}

        {isRemoveModalOpen && (
          <div
            className="fixed inset-0 open_sans_font cursor-pointer bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6"
            onClick={() => setIsRemoveModalOpen(false)}
          >
            <div
              className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl sm:rounded-xl overflow-hidden animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">
                  Confirm Removal
                </h2>
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="px-4 sm:px-6 py-4">
                <p className="text-white text-sm">
                  Are you sure you want to remove this staff member?
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={confirmRemoveStaff}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isPlanningModalOpen && (
          <StaffPlanningModal
            staffMembers={staffMembers}
            onClose={() => setIsPlanningModalOpen(false)}
          />
        )}

        {isAttendanceModalOpen && (
          <AttendanceOverviewModal
            staffMembers={staffMembers}
            onClose={() => setIsAttendanceModalOpen(false)}
          />
        )}

        {isVacationRequestModalOpen && (
          <VacationCalendarModal
            staffMember={staffMembers[0]}
            onClose={() => setIsVacationRequestModalOpen(false)}
            onSubmit={handleVacationRequest}
          />
        )}

        {isHistoryModalOpen && selectedStaffForHistory && (
          <StaffHistoryModal
            staff={selectedStaffForHistory}
            onClose={() => setIsHistoryModalOpen(false)}
          />
        )}

        <StafffDocumentManagementModal
          member={selectedMemberForDocuments}
          isOpen={showDocumentModal}
          onClose={() => {
            setShowDocumentModal(false)
            setSelectedMemberForDocuments(null)
          }}



        />

        {chatPopup.isOpen && chatPopup.staff && (
          <ChatPopup
            staff={chatPopup.staff}
            isOpen={chatPopup.isOpen}
            onClose={() => setChatPopup({ isOpen: false, staff: null })}
            onOpenFullMessenger={() => handleOpenFullMessenger(chatPopup.staff)}
          />
        )}

        {isVacationContingentModalOpen && selectedStaffForContingent && (
          <VacationContingentModal
            isOpen={isVacationContingentModalOpen}
            onClose={() => {
              setIsVacationContingentModalOpen(false)
              setSelectedStaffForContingent(null)
            }}
            staff={selectedStaffForContingent}
            onUpdateContingent={handleUpdateVacationContingent}
          />
        )}


        {/* sidebar related stuff */}

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

      </>
    </StaffContext.Provider>
  );
}