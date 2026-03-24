/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
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
import toast from "../../components/shared/SharedToast"
import { useNavigate } from "react-router-dom"

// ============================================================================
// NEUE IMPORTS - Verwendet die vereinheitlichte State-Struktur
// ============================================================================
import {
  // Core Data
  trainingVideosData,
  trainingPlansData,
  trainingCategoriesData,
  memberTrainingPlansData,

  // Legacy Compatibility
  membersData,
  categoriesData,

  // Helper Functions
  getVideoById,
  getPlanById,
  getMemberTrainingPlans,
  getMembersWithPlan,
  getAvailablePlansForMember,
  getDifficultyColor,
  getPlanCreatorName,
  canEditPlan as checkCanEditPlan,
  getVideoInstructor,

  // APIs (für spätere Backend-Integration)
  trainingPlansApi,
  memberTrainingPlansApi,
} from "../../utils/studio-states/training-states"

// ============================================================================
// COMPONENT IMPORTS
// ============================================================================
import AssignPlanModal from "../../components/studio-components/training-components/assign-plan-modal"
import ViewPlanModal from "../../components/shared/training/view-plan-modal"
import CreatePlanModal from "../../components/studio-components/training-components/create-plan-modal"
import EditPlanModal from "../../components/studio-components/training-components/edit-plan-modal"
import VideoModal from "../../components/shared/training/video-modal"
import AddToPlanModal from "../../components/studio-components/training-components/add-to-plan-modal"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlans, fetchMyPlans, fetchTrainingVideos } from "../../features/training/TrainingSlice"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"

// ============================================================================
// RESPONSIVE TAG LIST COMPONENT
// ============================================================================
const ResponsiveTagList = ({ tags }) => {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  const calculateVisibleTags = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;

    const getTagWidth = (text) => {
      return text.length * 7 + 16 + 4;
    };

    const badgeWidth = 32;
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < tags.length; i++) {
      const tagWidth = getTagWidth(tags[i]);
      const remainingTags = tags.length - (i + 1);
      const needsBadge = remainingTags > 0;
      const requiredWidth = tagWidth + (needsBadge ? badgeWidth : 0);

      if (totalWidth + requiredWidth <= containerWidth) {
        totalWidth += tagWidth;
        count++;
      } else {
        if (remainingTags === 0 && totalWidth + tagWidth <= containerWidth) {
          count++;
        }
        break;
      }
    }

    setVisibleCount(Math.max(1, count));
  }, [tags]);

  useEffect(() => {
    calculateVisibleTags();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleTags();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateVisibleTags]);

  const visibleTags = tags.slice(0, visibleCount);
  const remainingCount = tags.length - visibleCount;

  return (
    <div ref={containerRef} className="flex flex-wrap gap-1 mt-2">
      {visibleTags.map((muscle, index) => (
        <span key={index} className="bg-surface-button text-content-secondary px-2 py-1 rounded text-xs whitespace-nowrap">
          {muscle}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-content-faint text-xs flex items-center">+{remainingCount}</span>
      )}
    </div>
  );
};

// ============================================================================
// MAIN TRAINING COMPONENT
// ============================================================================
export default function Training() {
  const { t } = useTranslation()

  // -------------------------------------------------------------------------
  // STATE - Tab & Filter
  // -------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStaffIds, setSelectedStaffIds] = useState([])
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false)

  // -------------------------------------------------------------------------
  // STATE - Modals
  // -------------------------------------------------------------------------
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false)
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false)
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false)
  const [isAddToPlanModalOpen, setIsAddToPlanModalOpen] = useState(false)
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planToAssign, setPlanToAssign] = useState(null)
  const [videoToAdd, setVideoToAdd] = useState(null)
  const [editingPlan, setEditingPlan] = useState(null)

  // -------------------------------------------------------------------------
  // STATE - Video Player
  // -------------------------------------------------------------------------
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Panel swipe refs
  const swipeRef = useRef(null)
  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // -------------------------------------------------------------------------
  // REDUX STATE
  // -------------------------------------------------------------------------
  const { trainings: trainingVideos = [], myPlans } = useSelector((state) => state.trainings || {})
  const { staff = [] } = useSelector((state) => state.staff)
  const { user } = useSelector((state) => state.auth)
  const currentUserId = user?._id

  // Transform staff data for consistent usage
  const transformedStaff = useMemo(() => {
    if (!Array.isArray(staff) || staff.length === 0) return []

    return staff.map(member => ({
      id: member._id,
      name: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      ...member
    }))
  }, [staff])

  // Update your trainingPlans state initialization
  const [trainingPlans, setTrainingPlans] = useState(
    (myPlans || []).map(plan => ({
      ...plan,
      creatorId: plan.createdBy?._id?.toString(),
      creatorName: plan.createdBy
        ? `${plan.createdBy.firstName || ''} ${plan.createdBy.lastName || ''}`.trim()
        : 'Unknown',
      ...plan
    }))
  )
  const [memberTrainingPlans, setMemberTrainingPlans] = useState(memberTrainingPlansData)

  // -------------------------------------------------------------------------
  // STATE - Member Assignment
  // -------------------------------------------------------------------------
  const [assignedMembers, setAssignedMembers] = useState([])
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])

  // -------------------------------------------------------------------------
  // STATE - Plan Form
  // -------------------------------------------------------------------------
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    category: "Full Body",
    workoutsPerWeek: "",
    exercises: [],
  })
  const [selectedExercises, setSelectedExercises] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ========
  // UseEffect
  // =========
  useEffect(() => {
    dispatch(fetchTrainingVideos())
    dispatch(fetchAllPlans());
  }, [dispatch])

  // -------------------------------------------------------------------------
  // COMPUTED - Filtered Data
  // -------------------------------------------------------------------------

  const filteredVideos = trainingVideos.filter((video) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(video.categoryId || video.category)

    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.instructorName || video.instructor || "").toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const filteredPlans = trainingPlans.filter((plan) => {
    const matchesSearch =
      (plan.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStaff = selectedStaffIds.length === 0 ||
      selectedStaffIds.some(staffId => {
        if (staffId === "own") {
          return plan.createdBy?._id === currentUserId
        }
        const planCreatorId = plan.createdBy?._id?.toString()
        return planCreatorId === staffId
      })

    return matchesSearch && matchesStaff
  })

  // -------------------------------------------------------------------------
  // COMPUTED - Available Videos for Plan
  // -------------------------------------------------------------------------
  const getAvailableVideos = () => {
    const selectedVideoIds = selectedExercises.map((exercise) => exercise.videoId)
    return trainingVideos.filter((video) => !selectedVideoIds.includes(video.id))
  }

  // -------------------------------------------------------------------------
  // HANDLERS - Member Assignment
  // -------------------------------------------------------------------------

  const handleAssignPlan = (memberIds) => {
    if (memberIds.length === 0) return

    const newMembers = memberIds.filter(id =>
      !assignedMembers.some(assigned => assigned.id === id)
    )

    if (newMembers.length === 0) {
      haptic.warning()
      toast.error(t("training.toast.alreadyAssigned"))
      return
    }

    const membersToAssign = membersData
      .filter(member => newMembers.includes(member.id))
      .map(member => ({
        ...member,
        assignedPlan: planToAssign?.name || t("training.tabs.plans"),
        assignedDate: new Date().toISOString().split('T')[0],
        progress: t("training.plans.notStarted")
      }))

    const newAssignments = newMembers.map(memberId => ({
      id: Math.max(...memberTrainingPlans.map(m => m.id), 0) + 1,
      memberId,
      planId: planToAssign?.id,
      assignedByStaffId: null,
      assignedAt: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'not_started',
      progress: 0,
      completedWorkouts: 0,
      totalWorkouts: planToAssign?.exercises?.length * (planToAssign?.workoutsPerWeek || 1) || 0,
      notes: null,
      lastWorkoutDate: null,
    }))

    setMemberTrainingPlans([...memberTrainingPlans, ...newAssignments])
    setAssignedMembers([...assignedMembers, ...membersToAssign])
    setSelectedMembers([])
    setMemberSearchQuery("")

    toast.success(t("training.toast.planAssigned", { count: newMembers.length }))
  }

  const handleRemovePlanFromMember = (memberId) => {
    setAssignedMembers(assignedMembers.filter(member => member.id !== memberId))
    setMemberTrainingPlans(memberTrainingPlans.filter(
      mtp => !(mtp.memberId === memberId && mtp.planId === planToAssign?.id)
    ))
    toast.success(t("training.toast.planRemoved"))
  }

  // -------------------------------------------------------------------------
  // HANDLERS - Video Player
  // -------------------------------------------------------------------------

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
    haptic.light()
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // -------------------------------------------------------------------------
  // HANDLERS - Plan CRUD
  // -------------------------------------------------------------------------

  const handleCreatePlan = async () => {
    try {
      const apiPlanData = {
        name: planForm.name,
        description: planForm.description,
        duration: planForm.duration,
        difficulty: planForm.difficulty,
        category: planForm.category,
        workoutsPerWeek: planForm.workoutsPerWeek,
        exercises: selectedExercises.map((ex, index) => ({
          video: ex.videoId,
          sets: ex.sets || 3,
          reps: ex.reps || "10-12",
          rest: ex.rest || "60s",
          order: index + 1
        }))
      };

      const result = await dispatch(createPlan(apiPlanData)).unwrap();

      const newLocalPlan = {
        ...apiPlanData,
        _id: result.plan._id,
        id: result.plan._id,
        createdByStaffId: null,
        createdByName: "Current User",
        createdBy: "Current User",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        isPublic: true,
        isActive: true,
        likes: 0,
        uses: 0,
        creatorName: "Current User",
        exercises: selectedExercises
      };

      setTrainingPlans(prev => [...prev, newLocalPlan]);

      setIsCreatePlanModalOpen(false);
      resetPlanForm();

      toast.success(t("training.toast.planCreated"));

    } catch (error) {
      console.error('Create plan error:', error);
      toast.error(error.message || t("training.toast.planCreateFailed"));
    }
  };


  const handleEditPlan = () => {
    const updatedPlans = trainingPlans.map((plan) =>
      plan.id === editingPlan.id
        ? {
          ...plan,
          ...planForm,
          id: editingPlan.id,
          createdByStaffId: plan.createdByStaffId,
          createdByName: plan.createdByName,
          createdBy: plan.createdBy,
          createdAt: plan.createdAt,
          updatedAt: new Date().toISOString().split("T")[0],
          likes: plan.likes,
          uses: plan.uses,
          isPublic: plan.isPublic,
          isActive: plan.isActive,
        }
        : plan,
    )
    setTrainingPlans(updatedPlans)
    setIsEditPlanModalOpen(false)
    setEditingPlan(null)
    resetPlanForm()
    toast.success(t("training.toast.planUpdated"))
    haptic.success()
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
      order: trainingPlans.find(p => p.id === planId)?.exercises.length + 1 || 1,
    }

    const updatedPlans = trainingPlans.map((plan) =>
      plan.id === planId
        ? { ...plan, exercises: [...plan.exercises, exercise] }
        : plan,
    )

    setTrainingPlans(updatedPlans)
    setIsAddToPlanModalOpen(false)
    setVideoToAdd(null)
    toast.success(t("training.toast.exerciseAdded"))
    haptic.success()
  }

  const handleAddExercise = (video) => {
    const exercise = {
      videoId: video.id,
      sets: 3,
      reps: "10-12",
      rest: "60s",
      order: selectedExercises.length + 1,
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
    haptic.light()
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

  // -------------------------------------------------------------------------
  // HANDLERS - Helper Functions
  // -------------------------------------------------------------------------

  const canEditPlan = (plan) => {
    return plan.createdBy === "Current User" || plan.createdByStaffId === null
  }

  const getStaffDisplayName = (staffId) => {
    if (staffId === "all") return t("training.filters.allStaffPlans")
    const member = transformedStaff.find((s) => s.id === staffId)
    return member?.name || staffId
  }

  const toggleStaffSelection = (staffId) => {
    haptic.light()
    setSelectedStaffIds(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId)
      } else {
        return [...prev, staffId]
      }
    })
  }

  const clearStaffFilters = () => {
    haptic.light()
    setSelectedStaffIds([])
  }

  useEffect(() => {
    if (isAssignPlanModalOpen && planToAssign) {
      const members = getMembersWithPlan(planToAssign.id)
      setAssignedMembers(members)
    }
  }, [isAssignPlanModalOpen, planToAssign])

  // -------------------------------------------------------------------------
  // PANEL SWIPE
  // -------------------------------------------------------------------------
  const tabKeys = ["videos", "plans"]

  const animateToTab = useCallback((key) => {
    const el = swipeRef.current
    if (!el) return
    const idx = tabKeys.indexOf(key)
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.transform = `translateX(-${idx * 50}%)`
    setActiveTab(key)
  }, [])

  useEffect(() => {
    const el = swipeRef.current
    if (!el) return
    let startX, startY, startT, dx, locked, isH

    const onStart = (e) => {
      const t = e.touches[0]
      startX = t.clientX; startY = t.clientY; startT = Date.now()
      dx = 0; locked = false; isH = false
      el.style.transition = 'none'
    }
    const onMove = (e) => {
      const t = e.touches[0]
      const rawDx = t.clientX - startX
      const dy = t.clientY - startY
      if (!locked && (Math.abs(rawDx) > 8 || Math.abs(dy) > 8)) {
        locked = true
        isH = Math.abs(rawDx) > Math.abs(dy) * 1.3
      }
      if (!isH) return
      e.preventDefault()
      const i = tabKeys.indexOf(activeTabRef.current)
      dx = rawDx
      if ((i === 0 && dx > 0) || (i === tabKeys.length - 1 && dx < 0)) dx = rawDx * 0.15
      el.style.transform = `translateX(calc(-${i * 50}% + ${dx}px))`
    }
    const onEnd = () => {
      if (!isH) return
      const i = tabKeys.indexOf(activeTabRef.current)
      const velocity = Math.abs(dx) / Math.max(Date.now() - startT, 1)
      const panelW = el.parentElement?.offsetWidth || window.innerWidth
      const threshold = panelW * 0.15
      let target = i
      if (dx < -threshold || (dx < -20 && velocity > 0.25)) target = Math.min(i + 1, tabKeys.length - 1)
      else if (dx > threshold || (dx > 20 && velocity > 0.25)) target = Math.max(i - 1, 0)
      el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.transform = `translateX(-${target * 50}%)`
      if (target !== i) setActiveTab(tabKeys[target])
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [])

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
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

      <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden rounded-t-2xl lg:rounded-3xl transition-all duration-500 ease-in-out flex-1">

        {/* Sticky Header + Tabs */}
        <div className="flex-shrink-0 md:px-6 md:pt-6 px-3 pt-3">
          {/* Header */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">{t("training.title")}</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border-subtle">
            <button
              onClick={() => animateToTab("videos")}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              className={`flex-1 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium transition-colors duration-150 whitespace-nowrap ${activeTab === "videos"
                ? "text-content-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-primary"
                }`}
            >
              <Play size={16} className="inline mr-1 sm:mr-2" />
              {t("training.tabs.videos")}
            </button>
            <button
              onClick={() => animateToTab("plans")}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              className={`flex-1 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium transition-colors duration-150 whitespace-nowrap ${activeTab === "plans"
                ? "text-content-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-primary"
                }`}
            >
              <Target size={16} className="inline mr-1 sm:mr-2" />
              {t("training.tabs.plans")}
            </button>
          </div>
        </div>

        {/* Panel container — both tabs side by side */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={swipeRef}
            className="flex h-full"
            style={{ width: '200%', willChange: 'transform', touchAction: 'pan-y pinch-zoom' }}
          >

            {/* ---- Panel 1: VIDEOS ---- */}
            <div className="w-1/2 h-full">
              <PullToRefresh
                onRefresh={async () => { await dispatch(fetchTrainingVideos()).catch(() => {}) }}
                className="h-full overflow-y-auto md:px-6 md:pb-6 px-3 pb-3 pt-6"
              >
              <div>
                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={16} />
                    <input
                      type="text"
                      placeholder={t("training.search.videosPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={() => { haptic.light(); setSelectedCategories([]) }}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategories.length === 0
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                  >
                    {t("common.all")}
                  </button>
                  {categoriesData.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        haptic.light()
                        if (selectedCategories.includes(category.id)) {
                          setSelectedCategories(selectedCategories.filter(cat => cat !== category.id))
                        } else {
                          setSelectedCategories([...selectedCategories, category.id])
                        }
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedCategories.includes(category.id)
                        ? `bg-primary text-white`
                        : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-surface-card rounded-xl overflow-hidden hover:bg-surface-hover transition-colors cursor-pointer group"
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail?.url || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-36 sm:h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-primary rounded-full p-2 sm:p-3">
                            <Play className="text-white" size={20} />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                          {video.duration}
                        </div>
                        <div
                          className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                        >
                          {video.difficulty}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-content-primary mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                        <p className="text-content-muted text-xs sm:text-sm mb-3 line-clamp-2">{video.description}</p>
                        <ResponsiveTagList tags={video.targetMuscles} />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredVideos.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-content-muted mb-4">
                      <Search size={48} className="mx-auto mb-4" />
                      <p>{t("training.empty.noVideos")}</p>
                    </div>
                  </div>
                )}
              </div>
              </PullToRefresh>
            </div>

            {/* ---- Panel 2: PLANS ---- */}
            <div className="w-1/2 h-full">
              <PullToRefresh
                onRefresh={async () => { await dispatch(fetchAllPlans()).catch(() => {}) }}
                className="h-full overflow-y-auto md:px-6 md:pb-6 px-3 pb-3 pt-6"
              >
              <div>
                {/* Search and Create Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={16} />
                    <input
                      type="text"
                      placeholder={t("training.search.plansPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
                    />
                  </div>
                  <button
                    onClick={() => { haptic.light(); setIsCreatePlanModalOpen(true) }}
                    className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-2 cursor-pointer text-sm bg-primary hover:bg-primary-hover rounded-xl text-white font-medium transition-colors justify-center sm:justify-start"
                  >
                    <Plus size={18} />
                    {t("training.plans.createPlan")}
                  </button>
                </div>

                {/* Staff Member Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={clearStaffFilters}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedStaffIds.length === 0
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                  >
                    {t("common.all")}
                  </button>
                  {/* "My Plans" option */}
                  <button
                    onClick={() => toggleStaffSelection("own")}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedStaffIds.includes("own")
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                  >
                    {t("training.filters.myPlans")}
                  </button>
                  {/* Staff members */}
                  {transformedStaff.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => toggleStaffSelection(member.id)}
                      className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${selectedStaffIds.includes(member.id)
                        ? "bg-primary text-white"
                        : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                        }`}
                    >
                      {member.name}
                    </button>
                  ))}
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-surface-card rounded-xl p-4 sm:p-6 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-content-primary mb-2 truncate">{plan.name}</h3>
                          <p className="text-content-muted text-sm mb-3 line-clamp-2">{plan.description}</p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs text-white ml-2 flex-shrink-0 ${getDifficultyColor(plan.difficulty)}`}
                        >
                          {plan.difficulty}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plan.duration && (
                          <div className="flex items-center gap-2 text-sm text-content-muted">
                            <Clock size={14} />
                            <span>{plan.duration}</span>
                          </div>
                        )}
                        {plan.workoutsPerWeek && (
                          <div className="flex items-center gap-2 text-sm text-content-muted">
                            <Calendar size={14} />
                            <span>{t("common.perWeek", { count: plan.workoutsPerWeek })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-content-muted">
                          <User size={14} />
                          <span className="truncate">{t("common.by", { name: plan.creatorName })}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            haptic.light()
                            setSelectedPlan(plan)
                            setIsViewPlanModalOpen(true)
                          }}
                          className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg transition-colors"
                        >
                          <Eye size={16} className="text-content-muted" />
                        </button>
                        <button
                          onClick={() => {
                            haptic.light()
                            setPlanToAssign(plan)
                            setIsAssignPlanModalOpen(true)
                          }}
                          className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg transition-colors"
                        >
                          <Users size={16} className="text-content-muted" />
                        </button>
                        {canEditPlan(plan) && (
                          <button
                            onClick={() => openEditPlan(plan)}
                            className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg transition-colors"
                          >
                            <Edit size={16} className="text-content-muted" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPlans.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-content-muted mb-4">
                      <Target size={48} className="mx-auto mb-4" />
                      <p>{t("training.empty.noPlans")}</p>
                    </div>
                  </div>
                )}
              </div>
              </PullToRefresh>
            </div>

          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* MODALS */}
      {/* =============================================================== */}

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

      {/* Create Plan Modal */}
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

      {/* Edit Plan Modal */}
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

      {/* Assign Plan Modal */}
      <AssignPlanModal
        isOpen={isAssignPlanModalOpen}
        planToAssign={planToAssign}
        memberSearchQuery={memberSearchQuery}
        selectedMembers={selectedMembers}
        assignedMembers={assignedMembers}
        members={membersData}
        onClose={() => { setIsAssignPlanModalOpen(false) }}
        onMemberSearchChange={setMemberSearchQuery}
        onSelectedMembersChange={setSelectedMembers}
        onRemovePlanFromMember={handleRemovePlanFromMember}
        onAssignPlan={handleAssignPlan}
        getDifficultyColor={getDifficultyColor}
      />

      {/* View Plan Modal */}
      <ViewPlanModal
        isOpen={isViewPlanModalOpen}
        selectedPlan={selectedPlan}
        onClose={() => setIsViewPlanModalOpen(false)}
        onVideoClick={handleVideoClick}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
      />

      {/* Floating Action Button - Mobile Only (Plans Tab) */}
      {activeTab === "plans" && (
        <button
          onClick={() => { haptic.light(); setIsCreatePlanModalOpen(true) }}
          className="md:hidden fixed right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
          aria-label={t("training.aria.createPlan")}
        >
          <Plus size={22} />
        </button>
      )}
    </>
  )
}
