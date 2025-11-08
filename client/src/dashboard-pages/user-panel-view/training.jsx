/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Filter,
  Search,
  Plus,
  Eye,
  Trash2,
  X,
  Clock,
  Target,
  Calendar,
  ChevronDown,
  Save,
  User,
  Edit,
  Users,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { useNavigate } from "react-router-dom"
import { IoIosMenu } from "react-icons/io"
import { assignedMembersData, categoriesData, membersData, staffMembersData, trainingPlansData, trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import Sidebar from "../../components/central-sidebar"

import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import MemberOverviewModal from "../../components/user-panel-components/communication-components/MemberOverviewModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import AssignPlanModal from "../../components/user-panel-components/training-components/assign-plan-modal"
import ViewPlanModal from "../../components/user-panel-components/training-components/view-plan-modal"
import CreatePlanModal from "../../components/user-panel-components/training-components/create-plan-modal"
import EditPlanModal from "../../components/user-panel-components/training-components/edit-plan-modal"
import VideoModal from "../../components/user-panel-components/training-components/video-modal"
import AddToPlanModal from "../../components/user-panel-components/training-components/add-to-plan-modal"

export default function Training() {
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false)
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false)
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false)
  const [isAddToPlanModalOpen, setIsAddToPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedStaffMember, setSelectedStaffMember] = useState("own")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false)
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false)
  const [planToAssign, setPlanToAssign] = useState(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const navigate = useNavigate()

  const [assignedMembers, setAssignedMembers] = useState([])
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])

  const staffMembers = staffMembersData
  const members = membersData
  const categories = categoriesData

  const [trainingVideos] = useState(trainingVideosData)
  const [trainingPlans, setTrainingPlans] = useState(trainingPlansData)

  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    category: "Full Body",
    workoutsPerWeek: "",
    exercises: [],
  })

  const [editingPlan, setEditingPlan] = useState(null)
  const [selectedExercises, setSelectedExercises] = useState([])
  const [videoToAdd, setVideoToAdd] = useState(null)

  // Use the sidebar system hook
  const sidebarSystem = useSidebarSystem();

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

  // Filter videos based on category and search
  // Filter videos based on multiple categories and search
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(video.category)

    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })
  // Add these functions to your component

  const handleAssignPlan = (memberIds) => {
    if (memberIds.length === 0) return

    // Filter out already assigned members to avoid duplicates
    const newMembers = memberIds.filter(id =>
      !assignedMembers.some(assigned => assigned.id === id)
    )

    if (newMembers.length === 0) {
      toast.error("Selected members already have this plan assigned!")
      return
    }

    // Create assigned member objects
    const membersToAssign = members
      .filter(member => newMembers.includes(member.id))
      .map(member => ({
        ...member,
        assignedPlan: planToAssign?.name || "Training Plan",
        assignedDate: new Date().toISOString().split('T')[0],
        progress: "Not Started"
      }))

    // Update state
    setAssignedMembers([...assignedMembers, ...membersToAssign])
    setSelectedMembers([])
    setMemberSearchQuery("")

    toast.success(`Training plan assigned to ${newMembers.length} member${newMembers.length !== 1 ? 's' : ''}!`)
  }

  const handleRemovePlanFromMember = (memberId) => {
    setAssignedMembers(assignedMembers.filter(member => member.id !== memberId))
    toast.success("Training plan removed from member!")
  }



  // Filter plans based on selected staff member
  const filteredPlans = trainingPlans.filter((plan) => {
    if (selectedStaffMember === "own") {
      return plan.createdBy === "Current User"
    } else if (selectedStaffMember === "all") {
      return true
    } else {
      const staffMember = staffMembers.find((s) => s.id === selectedStaffMember)
      return plan.createdBy === staffMember?.name
    }
  })

  const getAvailableVideos = () => {
    const selectedVideoIds = selectedExercises.map((exercise) => exercise.videoId)
    return trainingVideos.filter((video) => !selectedVideoIds.includes(video.id))
  }

  // Video player functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleVideoClick = (video) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleCreatePlan = () => {
    const newPlan = {
      id: trainingPlans.length + 1,
      ...planForm,
      createdBy: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      uses: 0,
    }
    setTrainingPlans([...trainingPlans, newPlan])
    setIsCreatePlanModalOpen(false)
    resetPlanForm()
    toast.success("Training plan created successfully!")
  }

  const handleEditPlan = () => {
    const updatedPlans = trainingPlans.map((plan) =>
      plan.id === editingPlan.id
        ? {
          ...plan,
          ...planForm,
          id: editingPlan.id,
          createdBy: plan.createdBy,
          createdAt: plan.createdAt,
          likes: plan.likes,
          uses: plan.uses,
          isPublic: plan.isPublic,
        }
        : plan,
    )
    setTrainingPlans(updatedPlans)
    setIsEditPlanModalOpen(false)
    setEditingPlan(null)
    resetPlanForm()
    toast.success("Training plan updated successfully!")
  }

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      description: "",
      duration: "",
      difficulty: "Beginner",
      category: "Full Body",
      workoutsPerWeek: "",
      exercises: [],
    })
    setSelectedExercises([])
  }

  const handleAddToExistingPlan = (planId) => {
    if (!videoToAdd) return

    const exercise = {
      videoId: videoToAdd.id,
      sets: 3,
      reps: "10-12",
      rest: "60s",
    }

    const updatedPlans = trainingPlans.map((plan) =>
      plan.id === planId ? { ...plan, exercises: [...plan.exercises, exercise] } : plan,
    )

    setTrainingPlans(updatedPlans)
    setIsAddToPlanModalOpen(false)
    setVideoToAdd(null)
    toast.success("Exercise added to training plan!")
  }

  const handleAddExercise = (video) => {
    const exercise = {
      videoId: video.id,
      sets: 3,
      reps: "10-12",
      rest: "60s",
    }
    setSelectedExercises([...selectedExercises, exercise])
    setPlanForm({
      ...planForm,
      exercises: [...planForm.exercises, exercise],
    })
  }

  const handleRemoveExercise = (index) => {
    const updatedExercises = selectedExercises.filter((_, i) => i !== index)
    setSelectedExercises(updatedExercises)
    setPlanForm({
      ...planForm,
      exercises: updatedExercises,
    })
  }

  const openEditPlan = (plan) => {
    setEditingPlan(plan)
    setPlanForm({
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      difficulty: plan.difficulty,
      category: plan.category,
      workoutsPerWeek: plan.workoutsPerWeek || "",
      exercises: plan.exercises,
    })
    setSelectedExercises(plan.exercises)
    setIsEditPlanModalOpen(true)
  }


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

  const canEditPlan = (plan) => {
    return plan.createdBy === "Current User"
  }

  const [editingLink, setEditingLink] = useState(null)

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
          min-h-screen rounded-3xl bg-[#1C1C1C] text--white md:p-6 p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
          : 'mr-0' // No margin when closed
        }
        `}>
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Training</h1>
            </div>

            {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className=" ">
              <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            ) : (<div onClick={toggleRightSidebar} className=" ">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="w-full sm:max-w-sm mb-6">
            <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${activeTab === "videos" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Play size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Videos ({trainingVideos.length})
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${activeTab === "plans" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Target size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Plans ({trainingPlans.length})
              </button>
            </div>
          </div>

          {activeTab === "videos" && (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search training videos"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161616] pl-10 pr-4 py-2.5 sm:py-2 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none"
                  />
                </div>

              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategories.length === 0
                    ? "bg-blue-600 text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (selectedCategories.includes(category.id)) {
                        // Remove category if already selected
                        setSelectedCategories(selectedCategories.filter(cat => cat !== category.id))
                      } else {
                        // Add category if not selected
                        setSelectedCategories([...selectedCategories, category.id])
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategories.includes(category.id)
                      ? `bg-blue-600 text-white`
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                  >
                    {category.name}
                    {/* {selectedCategories.includes(category.id) && (
                      <span className="ml-1">✓</span>
                    )} */}
                  </button>
                ))}
              </div>

              {/* Videos Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>                {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#161616] rounded-xl overflow-hidden hover:bg-[#1F1F1F] transition-colors cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-36 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-blue-600 rounded-full p-2 sm:p-3">
                        <Play className="text-white" size={20} />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {video.duration}
                    </div>
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                        video.difficulty,
                      )}`}
                    >
                      {video.difficulty}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.targetMuscles.slice(0, 2).map((muscle, index) => (
                        <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                          {muscle}
                        </span>
                      ))}
                      {video.targetMuscles.length > 2 && (
                        <span className="text-gray-500 text-xs">+{video.targetMuscles.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto mb-4" />
                    <p>No videos found matching your criteria</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "plans" && (
            <div>
              {/* Plans Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Training Plans</h2>
                  <div className="relative">
                    <button
                      onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
                      className="flex text-white items-center gap-2 px-3 sm:px-4 py-2 text-sm bg-[#161616] rounded-xl border border-gray-700 hover:border-gray-600 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                    >
                      <Users size={16} />
                      <span className="truncate">{staffMembers.find((s) => s.id === selectedStaffMember)?.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${isStaffDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isStaffDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-full sm:w-64 bg-[#2F2F2F] rounded-xl shadow-lg z-50 border border-gray-700">
                        {staffMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setSelectedStaffMember(member.id)
                              setIsStaffDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors flex items-center gap-3 ${selectedStaffMember === member.id ? "bg-[#3F3F3F]" : ""
                              }`}
                          >
                            <span className="text-white">{member.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsCreatePlanModalOpen(true)}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors justify-center sm:justify-start"
                >
                  <Plus size={18} />
                  Create Plan
                </button>
              </div>

              {/* Plans Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-[#161616] rounded-xl p-4 sm:p-6 hover:bg-[#1F1F1F] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-2 truncate">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{plan.description}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs text-white ml-2 flex-shrink-0 ${getDifficultyColor(plan.difficulty)}`}
                      >
                        {plan.difficulty}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {plan.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={14} />
                          <span>{plan.duration}</span>
                        </div>
                      )}
                      {plan.workoutsPerWeek && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} />
                          <span>{plan.workoutsPerWeek}x per week</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User size={14} />
                        <span className="truncate">by {plan.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedPlan(plan)
                          setIsViewPlanModalOpen(true)
                        }}
                        className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => {
                          setPlanToAssign(plan)
                          setIsAssignPlanModalOpen(true)
                        }}
                        className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      >
                        <Users size={16} className="text-gray-400" />
                      </button>
                      {canEditPlan(plan) && (
                        <button
                          onClick={() => openEditPlan(plan)}
                          className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                        >
                          <Edit size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target size={48} className="mx-auto mb-4" />
                    <p>No training plans found</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isVideoModalOpen={isVideoModalOpen}
        selectedVideo={selectedVideo}
        setIsVideoModalOpen={setIsVideoModalOpen}
        setSelectedVideo={setSelectedVideo}
        setIsPlaying={setIsPlaying}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        toggleMute={toggleMute}
        isMuted={isMuted}
        videoRef={videoRef}
        handleTimeUpdate={handleTimeUpdate}
        handleLoadedMetadata={handleLoadedMetadata}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColor}
        setVideoToAdd={setVideoToAdd}
        setIsAddToPlanModalOpen={setIsAddToPlanModalOpen}
      />

      {/* Add to Plan Modal */}

      <AddToPlanModal
        isAddToPlanModalOpen={isAddToPlanModalOpen}
        videoToAdd={videoToAdd}
        setIsAddToPlanModalOpen={setIsAddToPlanModalOpen}
        setVideoToAdd={setVideoToAdd}
        trainingPlans={trainingPlans}
        handleAddToExistingPlan={handleAddToExistingPlan}
        getDifficultyColor={getDifficultyColor}
        handleAddExercise={handleAddExercise}
        setIsCreatePlanModalOpen={setIsCreatePlanModalOpen}
      />

      <CreatePlanModal
        isOpen={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        planForm={planForm}
        onPlanFormChange={setPlanForm}
        selectedExercises={selectedExercises}
        availableVideosCount={getAvailableVideos().length}
        availableVideos={getAvailableVideos()}
        onAddExercise={handleAddExercise}
        onRemoveExercise={handleRemoveExercise}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
        onSubmit={handleCreatePlan}
        resetPlanForm={resetPlanForm}
      />

      <EditPlanModal
        isOpen={isEditPlanModalOpen}
        onClose={() => {
          setIsEditPlanModalOpen(false);
          setEditingPlan(null);
        }}
        planForm={planForm}
        onPlanFormChange={setPlanForm}
        selectedExercises={selectedExercises}
        availableVideosCount={getAvailableVideos().length}
        availableVideos={getAvailableVideos()}
        onAddExercise={handleAddExercise}
        onRemoveExercise={handleRemoveExercise}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
        onSubmit={handleEditPlan}
        resetPlanForm={resetPlanForm}
        editingPlan={editingPlan}
      />

      <AssignPlanModal
        isOpen={isAssignPlanModalOpen}
        planToAssign={planToAssign}
        memberSearchQuery={memberSearchQuery}
        selectedMembers={selectedMembers}
        assignedMembers={assignedMembers}
        members={members}
        onClose={() => { setIsAssignPlanModalOpen(false) }}
        onMemberSearchChange={setMemberSearchQuery}
        onSelectedMembersChange={setSelectedMembers}
        onRemovePlanFromMember={handleRemovePlanFromMember}
        onAssignPlan={handleAssignPlan}
        getDifficultyColor={getDifficultyColor}
      />

      <ViewPlanModal
        isOpen={isViewPlanModalOpen}
        selectedPlan={selectedPlan}
        onClose={() => setIsViewPlanModalOpen(false)}
        onVideoClick={handleVideoClick}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
      />

      {/* sidebar related modals */}

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
