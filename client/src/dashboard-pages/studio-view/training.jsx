/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback } from "react"
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
  staffMembersData,
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
        <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs whitespace-nowrap">
          {muscle}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-gray-500 text-xs flex items-center">+{remainingCount}</span>
      )}
    </div>
  );
};

// ============================================================================
// MAIN TRAINING COMPONENT
// ============================================================================
export default function Training() {
  // -------------------------------------------------------------------------
  // STATE - Tab & Filter
  // -------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStaffMembers, setSelectedStaffMembers] = useState([])
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
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // -------------------------------------------------------------------------
  // STATE - Data (wird später durch API-Calls ersetzt)
  // -------------------------------------------------------------------------
  const [trainingVideos] = useState(trainingVideosData)
  const [trainingPlans, setTrainingPlans] = useState(
    trainingPlansData.map(plan => ({
      ...plan,
      createdBy: getPlanCreatorName(plan), // Legacy-Kompatibilität
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

  // -------------------------------------------------------------------------
  // COMPUTED - Filtered Data
  // -------------------------------------------------------------------------
  
  // Filter videos based on categories and search
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

  // Filter plans based on staff members and search
  const filteredPlans = trainingPlans.filter((plan) => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStaff = selectedStaffMembers.length === 0 || 
      selectedStaffMembers.some(staffId => {
        if (staffId === "own") {
          return plan.createdByStaffId === null
        }
        const staffMember = staffMembersData.find((s) => s.id === staffId)
        return plan.createdBy === staffMember?.name || 
               plan.createdByStaffId?.toString() === staffId
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
      toast.error("Selected members already have this plan assigned!")
      return
    }

    const membersToAssign = membersData
      .filter(member => newMembers.includes(member.id))
      .map(member => ({
        ...member,
        assignedPlan: planToAssign?.name || "Training Plan",
        assignedDate: new Date().toISOString().split('T')[0],
        progress: "Not Started"
      }))

    // Update member training plans (für Backend: API-Call)
    const newAssignments = newMembers.map(memberId => ({
      id: Math.max(...memberTrainingPlans.map(m => m.id), 0) + 1,
      memberId,
      planId: planToAssign?.id,
      assignedByStaffId: null, // Current user
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

    toast.success(`Training plan assigned to ${newMembers.length} member${newMembers.length !== 1 ? 's' : ''}!`)
  }

  const handleRemovePlanFromMember = (memberId) => {
    setAssignedMembers(assignedMembers.filter(member => member.id !== memberId))
    setMemberTrainingPlans(memberTrainingPlans.filter(
      mtp => !(mtp.memberId === memberId && mtp.planId === planToAssign?.id)
    ))
    toast.success("Training plan removed from member!")
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
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // -------------------------------------------------------------------------
  // HANDLERS - Plan CRUD
  // -------------------------------------------------------------------------
  
  const handleCreatePlan = () => {
    const newPlan = {
      id: Math.max(...trainingPlans.map(p => p.id), 0) + 1,
      ...planForm,
      createdByStaffId: null, // Current user
      createdByName: "Current User",
      createdBy: "Current User", // Legacy
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      isPublic: true,
      isActive: true,
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
    toast.success("Exercise added to training plan!")
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
    // Verwende die Helper-Funktion oder Legacy-Check
    return plan.createdBy === "Current User" || plan.createdByStaffId === null
  }

  const getStaffDisplayName = (staffId) => {
    if (staffId === "all") return "All Staff Plans"
    const member = staffMembersData.find((s) => s.id === staffId)
    return member?.name || staffId
  }

  // Load assigned members when opening assign modal
  useEffect(() => {
    if (isAssignPlanModalOpen && planToAssign) {
      const members = getMembersWithPlan(planToAssign.id)
      setAssignedMembers(members)
    }
  }, [isAssignPlanModalOpen, planToAssign])

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
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text--white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Training</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === "videos"
                  ? "text-white border-b-2 border-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Play size={16} className="inline mr-1 sm:mr-2" />
              Training Videos
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={`flex-1 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === "plans"
                  ? "text-white border-b-2 border-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Target size={16} className="inline mr-1 sm:mr-2" />
              Training Plans
            </button>
          </div>

          {/* =============================================================== */}
          {/* VIDEOS TAB */}
          {/* =============================================================== */}
          {activeTab === "videos" && (
            <div>
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search training videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategories.length === 0
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  All
                </button>
                {categoriesData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (selectedCategories.includes(category.id)) {
                        setSelectedCategories(selectedCategories.filter(cat => cat !== category.id))
                      } else {
                        setSelectedCategories([...selectedCategories, category.id])
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategories.includes(category.id)
                        ? `bg-blue-600 text-white`
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
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
                        className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                      >
                        {video.difficulty}
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{video.description}</p>
                      <ResponsiveTagList tags={video.targetMuscles} />
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

          {/* =============================================================== */}
          {/* PLANS TAB */}
          {/* =============================================================== */}
          {activeTab === "plans" && (
            <div>
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search training plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
                  />
                </div>
                <button
                  onClick={() => setIsCreatePlanModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-2 cursor-pointer text-sm bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-medium transition-colors justify-center sm:justify-start"
                >
                  <Plus size={18} />
                  Create Plan
                </button>
              </div>

              {/* Staff Member Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedStaffMembers([])}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                    selectedStaffMembers.length === 0
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  All
                </button>
                {staffMembersData.filter(member => member.id !== "all").map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      if (selectedStaffMembers.includes(member.id)) {
                        setSelectedStaffMembers(selectedStaffMembers.filter(id => id !== member.id))
                      } else {
                        setSelectedStaffMembers([...selectedStaffMembers, member.id])
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                      selectedStaffMembers.includes(member.id)
                        ? "bg-blue-600 text-white"
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
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
                        <span className="truncate">by {plan.createdBy || getPlanCreatorName(plan)}</span>
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
          onClick={() => setIsCreatePlanModalOpen(true)}
          className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label="Create Training Plan"
        >
          <Plus size={22} />
        </button>
      )}
    </>
  )
}
