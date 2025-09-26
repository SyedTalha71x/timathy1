// reference code of activity monitor that how i used hook and central sidebar for widgets 

/* eslint-disable no-unused-vars */
import { useState } from "react"
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X,
  Search,
  RefreshCw,
  Archive,
  AlertCircle,
  Activity,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { activitiesData, activityTypes } from "../../utils/user-panel-states/activity-monitor-states"
import { IoIosMenu } from "react-icons/io"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"


// sidebar related import
import EditTaskModal from "../../components/task-components/edit-task-modal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditAppointmentModal from "../../components/user-panel-components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModal from "../../components/user-panel-components/appointments-components/appointment-action-modal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import Sidebar from "../../components/central-sidebar"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

export default function ActivityMonitor() {
  const sidebarSystem = useSidebarSystem();
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [showArchived, setShowArchived] = useState(false)
  const [activities, setActivities] = useState(activitiesData)

  const trainingVideos = trainingVideosData


  const getActivityCounts = () => {
    const activeActivities = activities.filter((a) => !a.isArchived)
    const counts = {
      total: activeActivities.length,
      pending: activeActivities.filter((a) => a.actionRequired && a.status === "pending").length,
      failed: activeActivities.filter((a) => a.status === "failed").length,
      archived: activities.filter((a) => a.isArchived).length,
    }
    const typeCounts = {}
    Object.keys(activityTypes).forEach((type) => {
      typeCounts[type] = activeActivities.filter((a) => a.type === type).length
    })
    return { ...counts, ...typeCounts }
  }
  const counts = getActivityCounts()

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesArchivedStatus = showArchived ? activity.isArchived : !activity.isArchived
    const matchesFilter = selectedFilter === "all" || activity.type === selectedFilter
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesArchivedStatus && matchesFilter && matchesSearch
  })

  // Sort activities by timestamp
  const sortedActivities = filteredActivities.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-400" size={16} />
      case "failed":
        return <XCircle className="text-red-400" size={16} />
      case "pending":
        return <Clock className="text-yellow-400" size={16} />
      case "warning":
        return <AlertTriangle className="text-orange-400" size={16} />
      case "cancelled":
        return <XCircle className="text-gray-400" size={16} />
      case "investigating":
        return <AlertCircle className="text-blue-400" size={16} />
      case "approved":
        return <CheckCircle className="text-green-400" size={16} />
      case "rejected":
        return <XCircle className="text-red-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleActivityAction = (activity, action) => {
    setActivities((prevActivities) =>
      prevActivities.map((a) => {
        if (a.id === activity.id) {
          if (action === "approve") {
            toast.success("Request approved successfully")
            return { ...a, status: "approved", actionRequired: false }
          } else if (action === "reject") {
            toast.success("Request rejected and archived")
            return { ...a, status: "rejected", actionRequired: false, isArchived: true }
          } else if (action === "resolve") {
            toast.success("Issue resolved")
            return { ...a, status: "resolved", actionRequired: false }
          } else if (action === "archive") {
            toast.success("Activity archived")
            return { ...a, isArchived: true }
          }
        }
        return a
      }),
    )
  }

  const handleRefresh = () => {
    setLastRefresh(new Date())
    toast.success("Activity feed refreshed")
  }

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity)
    setIsDetailModalOpen(true)
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
      <div className={`
          min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
          : 'mr-0' 
        }
        `}>
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Activity Monitor</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">


                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#161616] hover:bg-[#2F2F2F] rounded-xl transition-colors text-sm"
                >
                  <RefreshCw size={16} />
                  <span className="sm:inline">Refresh</span>
                </button>
                <div className="block">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Activities</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{counts.total}</p>
                </div>
                <div className="bg-blue-600 p-2 sm:p-3 rounded-xl">
                  <Activity size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Archived Activities</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-400">{counts.archived}</p>
                </div>
                <div className="bg-gray-600 p-2 sm:p-3 rounded-xl">
                  <Archive size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search - Mobile Optimized */}
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-3">
              {/* Primary Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedFilter("all")
                    setShowArchived(false)
                  }}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${selectedFilter === "all" && !showArchived
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                >
                  All Active ({counts.total})
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter("all")
                    setShowArchived(true)
                  }}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${showArchived ? "bg-gray-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                >
                  <Archive size={12} />
                  Archived ({counts.archived})
                </button>
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(activityTypes).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedFilter(type)
                      setShowArchived(false)
                    }}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${selectedFilter === type && !showArchived
                        ? `${config.color} text-white`
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                  >
                    <config.icon size={12} />
                    <span className="hidden sm:inline">{config.name}</span>
                    <span className="sm:hidden">{config.name.split(" ")[0]}</span>({counts[type] || 0})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed - Mobile Optimized */}
          <div className="bg-[#161616] rounded-xl">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                {showArchived ? "Archived Activities" : "Activity Feed"}
              </h2>
            </div>
            <div className="divide-y divide-gray-700">
              {sortedActivities.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <Bell size={40} className="mx-auto mb-4 text-gray-400 sm:w-12 sm:h-12" />
                  <p className="text-gray-400">No activities found</p>
                </div>
              ) : (
                sortedActivities.map((activity) => {
                  const config = activityTypes[activity.type]
                  const Icon = config ? config.icon : Bell
                  return (
                    <div key={activity.id} className="p-4 sm:p-6 hover:bg-[#1F1F1F] transition-colors">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Activity Icon */}
                        <div className={`${config ? config.color : "bg-gray-600"} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
                          <Icon size={16} className="text-white sm:w-5 sm:h-5" />
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-white mb-1 text-sm sm:text-base leading-tight">
                                {activity.title}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{activity.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                              {getStatusIcon(activity.status)}
                              <span>{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {activity.actionRequired && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-600 text-white">
                                  ACTION REQUIRED
                                </span>
                              )}
                            </div>

                            {/* Action Buttons - Mobile Optimized */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewDetails(activity)}
                                className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={14} className="text-gray-400" />
                              </button>

                              {!activity.isArchived && activity.actionRequired && activity.status === "pending" && (
                                <>
                                  {activity.type === "vacation" && (
                                    <>
                                      <button
                                        onClick={() => handleActivityAction(activity, "approve")}
                                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                        title="Approve"
                                      >
                                        <Check size={14} className="text-white" />
                                      </button>
                                      <button
                                        onClick={() => handleActivityAction(activity, "reject")}
                                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                        title="Reject"
                                      >
                                        <X size={14} className="text-white" />
                                      </button>
                                    </>
                                  )}
                                  {(activity.type === "email" ||
                                    activity.type === "contract" ||
                                    activity.type === "appointment") && (
                                      <button
                                        onClick={() => handleActivityAction(activity, "resolve")}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        title="Mark as Resolved"
                                      >
                                        <Check size={14} className="text-white" />
                                      </button>
                                    )}
                                </>
                              )}

                              {!activity.isArchived && (
                                <button
                                  onClick={() => handleActivityAction(activity, "archive")}
                                  className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                  title="Archive"
                                >
                                  <Archive size={14} className="text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal - Mobile Optimized */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Modal Header - Mobile Optimized */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div
                    className={`${activityTypes[selectedActivity.type] ? activityTypes[selectedActivity.type].color : "bg-gray-600"} p-2 sm:p-3 rounded-xl flex-shrink-0`}
                  >
                    {(() => {
                      const Icon = activityTypes[selectedActivity.type]
                        ? activityTypes[selectedActivity.type].icon
                        : Bell
                      return <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                      {selectedActivity.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{selectedActivity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info - Mobile Optimized */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Activity Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="text-white text-sm sm:text-base">
                        {activityTypes[selectedActivity.type] ? activityTypes[selectedActivity.type].name : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedActivity.status)}
                        <span className="text-white capitalize text-sm sm:text-base">{selectedActivity.status}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-sm">Timestamp</p>
                      <p className="text-white text-sm sm:text-base">
                        {new Date(selectedActivity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {selectedActivity.isArchived && (
                      <div>
                        <p className="text-gray-400 text-sm">Archived</p>
                        <p className="text-white text-sm sm:text-base">Yes</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Information - Mobile Optimized */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Details</h3>

                  {selectedActivity.type === "vacation" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Employee</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.employee}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Department</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Dates</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.dates}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Days</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.days} days</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Reason</p>
                        <p className="text-white text-sm sm:text-base">{selectedActivity.details.reason}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Coverage</p>
                        <p className="text-white text-sm sm:text-base">{selectedActivity.details.coverage}</p>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "email" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-3">
                          Failed Emails ({selectedActivity.details.failedEmails.length})
                        </p>
                        <div className="space-y-3">
                          {selectedActivity.details.failedEmails.map((email, index) => (
                            <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-white font-medium text-sm sm:text-base">{email.member}</p>
                                  <p className="text-gray-400 text-xs sm:text-sm break-all">{email.email}</p>
                                </div>
                                <span className="text-red-400 text-xs flex-shrink-0">{email.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "contract" && (
                    <div className="space-y-4">
                      <p className="text-gray-400 text-sm mb-3">
                        Expiring Contracts ({selectedActivity.details.expiringContracts.length})
                      </p>
                      <div className="space-y-3">
                        {selectedActivity.details.expiringContracts.map((contract, index) => (
                          <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium text-sm sm:text-base">{contract.member}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Expires: {contract.expiryDate}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${contract.daysLeft <= 7
                                    ? "bg-red-600"
                                    : contract.daysLeft <= 14
                                      ? "bg-yellow-600"
                                      : "bg-orange-600"
                                  } text-white`}
                              >
                                {contract.daysLeft} days left
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "appointment" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Request Type</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.requestType}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white text-sm sm:text-base break-all">{selectedActivity.details.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Date</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.preferredDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Time</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.preferredTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedActivity.details.interests.map((interest, index) => (
                            <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "communication" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <p className="text-gray-400 text-sm">Campaign</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.campaign}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Total Recipients</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.totalRecipients}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Delivered</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.delivered}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Opened</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.opened}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Clicked</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.clicked}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Bounced</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.bounced}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Mobile Optimized */}
                {!selectedActivity.isArchived &&
                  selectedActivity.actionRequired &&
                  selectedActivity.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {selectedActivity.type === "vacation" && (
                        <>
                          <button
                            onClick={() => {
                              handleActivityAction(selectedActivity, "approve")
                              setIsDetailModalOpen(false)
                            }}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Approve Request
                          </button>
                          <button
                            onClick={() => {
                              handleActivityAction(selectedActivity, "reject")
                              setIsDetailModalOpen(false)
                            }}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={16} />
                            Reject Request
                          </button>
                        </>
                      )}
                      {(selectedActivity.type === "email" ||
                        selectedActivity.type === "contract" ||
                        selectedActivity.type === "appointment") && (
                          <button
                            onClick={() => {
                              handleActivityAction(selectedActivity, "resolve")
                              setIsDetailModalOpen(false)
                            }}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Mark as Resolved
                          </button>
                        )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

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
