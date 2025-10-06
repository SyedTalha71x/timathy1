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
import { categoriesData, membersData, staffMembersData, trainingPlansData, trainingVideosData } from "../../utils/user-panel-states/training-states"
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

export default function Training() {
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedCategory, setSelectedCategory] = useState("all")
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

  const staffMembers = staffMembersData
  const members =membersData
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
      customLinks,setCustomLinks, communications, setCommunications,
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
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

  const handleAssignPlan = (memberIds) => {
    // In a real app, this would make an API call to assign the plan
    toast.success(`Training plan assigned to ${memberIds.length} member(s)!`)
    setIsAssignPlanModalOpen(false)
    setPlanToAssign(null)
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
            <div className="block">
              <IoIosMenu
                onClick={toggleRightSidebar}
                size={25}
                className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
              />
            </div>
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
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategory === category.id
                        ? `bg-blue-600 text-white`
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                  >
                    {category.name}
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
      {isVideoModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white pr-4 truncate">{selectedVideo.title}</h2>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false)
                    setSelectedVideo(null)
                    setIsPlaying(false)
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-4 sm:mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-48 sm:h-64 md:h-96"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <div className="flex-1 flex items-center gap-2 text-xs sm:text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <button className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">About This Exercise</h3>
                  <p className="text-gray-400 mb-4 text-sm sm:text-base">{selectedVideo.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Duration:</span>
                      <span className="text-white text-sm">{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Difficulty:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                          selectedVideo.difficulty,
                        )}`}
                      >
                        {selectedVideo.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Exercise Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Target Muscles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.targetMuscles.map((muscle, index) => (
                          <span
                            key={index}
                            className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Equipment Needed</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="bg-[#2F2F2F] text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setVideoToAdd(selectedVideo)
                      setIsAddToPlanModalOpen(true)
                    }}
                    className="w-full mt-4 sm:mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Plus size={16} />
                    Add to Training Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Plan Modal */}
      {isAddToPlanModalOpen && videoToAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Add to Training Plan</h2>
                <button
                  onClick={() => {
                    setIsAddToPlanModalOpen(false)
                    setVideoToAdd(null)
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Select Existing Plan</h3>
                <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto">
                  {trainingPlans
                    .filter((plan) => plan.createdBy === "Current User")
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-[#161616] rounded-xl p-3 sm:p-4 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                        onClick={() => handleAddToExistingPlan(plan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{plan.name}</h4>
                            <p className="text-gray-400 text-sm">{plan.exercises.length} exercises</p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs text-white ml-2 flex-shrink-0 ${getDifficultyColor(plan.difficulty)}`}
                          >
                            {plan.difficulty}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Or Create New Plan</h3>
                <button
                  onClick={() => {
                    setIsAddToPlanModalOpen(false)
                    setVideoToAdd(null)
                    handleAddExercise(videoToAdd)
                    setIsCreatePlanModalOpen(true)
                  }}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Create New Plan with This Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Create Training Plan</h2>
                <button
                  onClick={() => {
                    setIsCreatePlanModalOpen(false)
                    resetPlanForm()
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Plan Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="Enter plan name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
                      rows={3}
                      placeholder="Describe your training plan..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (optional)</label>
                    <input
                      type="text"
                      value={planForm.duration}
                      onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="e.g., 4 weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Workouts/Week (optional)</label>
                    <select
                      value={planForm.workoutsPerWeek}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          workoutsPerWeek: e.target.value ? Number.parseInt(e.target.value) : "",
                        })
                      }
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">Select workouts per week</option>
                      <option value="1">1x per week</option>
                      <option value="2">2x per week</option>
                      <option value="3">3x per week</option>
                      <option value="4">4x per week</option>
                      <option value="5">5x per week</option>
                      <option value="6">6x per week</option>
                      <option value="7">7x per week</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                      <select
                        value={planForm.difficulty}
                        onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                      <select
                        value={planForm.category}
                        onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      >
                        <option value="Full Body">Full Body</option>
                        <option value="Upper Body">Upper Body</option>
                        <option value="Lower Body">Lower Body</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Exercise Library */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    Exercise Library ({getAvailableVideos().length})
                  </h3>
                  <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {getAvailableVideos().map((video) => (
                      <div key={video.id} className="bg-[#161616] rounded-xl p-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-10 sm:w-12 h-8 sm:h-9 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">{video.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                              >
                                {video.difficulty}
                              </span>
                              <span className="text-gray-500 text-xs">{video.duration}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddExercise(video)}
                            className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Exercises */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    Selected Exercises ({selectedExercises.length})
                  </h3>
                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Target size={48} className="mx-auto mb-4" />
                      <p>No exercises selected yet</p>
                      <p className="text-sm">Add exercises from the library</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                      {selectedExercises.map((exercise, index) => {
                        const video = getVideoById(exercise.videoId)
                        return (
                          <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <img
                                src={video?.thumbnail || "/placeholder.svg"}
                                alt={video?.title}
                                className="w-12 sm:w-16 h-9 sm:h-12 object-cover rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white mb-1 text-sm truncate">{video?.title}</h4>

                                <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                                  >
                                    {video.difficulty}
                                  </span>
                                  <span className="text-gray-500 text-xs">{video.duration}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveExercise(index)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <button
                      onClick={() => {
                        setIsCreatePlanModalOpen(false)
                        resetPlanForm()
                      }}
                      className="flex-1 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePlan}
                      disabled={!planForm.name || selectedExercises.length === 0}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Create Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {isEditPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Edit Training Plan</h2>
                <button
                  onClick={() => {
                    setIsEditPlanModalOpen(false)
                    setEditingPlan(null)
                    resetPlanForm()
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Plan Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="Enter plan name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
                      rows={3}
                      placeholder="Describe your training plan..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (optional)</label>
                    <input
                      type="text"
                      value={planForm.duration}
                      onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      placeholder="e.g., 4 weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Workouts/Week (optional)</label>
                    <select
                      value={planForm.workoutsPerWeek}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          workoutsPerWeek: e.target.value ? Number.parseInt(e.target.value) : "",
                        })
                      }
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">Select workouts per week</option>
                      <option value="1">1x per week</option>
                      <option value="2">2x per week</option>
                      <option value="3">3x per week</option>
                      <option value="4">4x per week</option>
                      <option value="5">5x per week</option>
                      <option value="6">6x per week</option>
                      <option value="7">7x per week</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                      <select
                        value={planForm.difficulty}
                        onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                      <select
                        value={planForm.category}
                        onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                      >
                        <option value="Full Body">Full Body</option>
                        <option value="Upper Body">Upper Body</option>
                        <option value="Lower Body">Lower Body</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Exercise Library */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    Exercise Library ({getAvailableVideos().length})
                  </h3>
                  <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {getAvailableVideos().map((video) => (
                      <div key={video.id} className="bg-[#161616] rounded-xl p-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-10 sm:w-12 h-8 sm:h-9 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">{video.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                              >
                                {video.difficulty}
                              </span>
                              <span className="text-gray-500 text-xs">{video.duration}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddExercise(video)}
                            className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Exercises */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    Selected Exercises ({selectedExercises.length})
                  </h3>
                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Target size={48} className="mx-auto mb-4" />
                      <p>No exercises selected yet</p>
                      <p className="text-sm">Add exercises from the library</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                      {selectedExercises.map((exercise, index) => {
                        const video = getVideoById(exercise.videoId)
                        return (
                          <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <img
                                src={video?.thumbnail || "/placeholder.svg"}
                                alt={video?.title}
                                className="w-12 sm:w-16 h-9 sm:h-12 object-cover rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white mb-1 text-sm truncate">{video?.title}</h4>
                                <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                                  >
                                    {video.difficulty}
                                  </span>
                                  <span className="text-gray-500 text-xs">{video.duration}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveExercise(index)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <button
                      onClick={() => {
                        setIsEditPlanModalOpen(false)
                        setEditingPlan(null)
                        resetPlanForm()
                      }}
                      className="flex-1 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditPlan}
                      disabled={!planForm.name || selectedExercises.length === 0}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Update Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAssignPlanModalOpen && planToAssign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Assign Training Plan</h2>
                <button
                  onClick={() => {
                    setIsAssignPlanModalOpen(false)
                    setPlanToAssign(null)
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-[#161616] rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-white mb-2">{planToAssign.name}</h3>
                  <p className="text-gray-400 text-sm">{planToAssign.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(planToAssign.difficulty)}`}
                    >
                      {planToAssign.difficulty}
                    </span>
                    <span className="text-gray-400 text-sm">{planToAssign.exercises.length} exercises</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Select Members</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {members.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-[#161616] rounded-xl hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600"
                        onChange={(e) => {
                          // Handle member selection logic here
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{member.name}</h4>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setIsAssignPlanModalOpen(false)
                    setPlanToAssign(null)
                  }}
                  className="flex-1 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssignPlan([1, 2, 3])} // Example member IDs
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={16} />
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        </div>


      )}

      {isViewPlanModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">{selectedPlan.name}</h2>
                  <p className="text-gray-400 text-sm sm:text-base">{selectedPlan.description}</p>
                </div>
                <button
                  onClick={() => setIsViewPlanModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Plan Info */}
                <div className="lg:col-span-1">
                  <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Plan Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Created by</span>
                        <span className="text-white text-sm truncate ml-2">{selectedPlan.createdBy}</span>
                      </div>
                      {selectedPlan.duration && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Duration</span>
                          <span className="text-white text-sm">{selectedPlan.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Difficulty</span>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(selectedPlan.difficulty)}`}
                        >
                          {selectedPlan.difficulty}
                        </span>
                      </div>
                      {selectedPlan.workoutsPerWeek && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Workouts/Week</span>
                          <span className="text-white text-sm">{selectedPlan.workoutsPerWeek}x</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Category</span>
                        <span className="text-white text-sm truncate ml-2">{selectedPlan.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                <div className="lg:col-span-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    Exercises ({selectedPlan.exercises.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedPlan.exercises.map((exercise, index) => {
                      const video = getVideoById(exercise.videoId)
                      return (
                        <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <img
                              src={video?.thumbnail || "/placeholder.svg"}
                              alt={video?.title}
                              className="w-16 sm:w-20 h-12 sm:h-15 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white mb-1 text-sm sm:text-base truncate">
                                {video?.title}
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {video?.targetMuscles.map((muscle, muscleIndex) => (
                                  <span
                                    key={muscleIndex}
                                    className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs"
                                  >
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => handleVideoClick(video)}
                              className="p-1.5 sm:p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors flex-shrink-0"
                            >
                              <Play size={14} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
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
