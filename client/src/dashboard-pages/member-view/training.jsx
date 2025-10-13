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
  BookOpen,
  Dumbbell,
  User,
  Edit,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { newtrainingPlansState, newtrainingVideosState } from "../../utils/member-panel-states/training-states"
import VideoModal from "../../components/member-panel-components/training-components/VideoModal"
import AddToPlanModal from "../../components/member-panel-components/training-components/AddToPlanModal"
import CreatePlanModal from "../../components/member-panel-components/training-components/CreatePlanModal"
import { EditPlanModal } from "../../components/member-panel-components/training-components/EditPlanModal"
import { ViewPlanModal } from "../../components/member-panel-components/training-components/ViewPlanModal"

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
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const staffMembers = [
    { id: "own", name: "My Plans", isOwn: true },
    { id: "mike", name: "Mike Johnson" },
    { id: "sarah", name: "Sarah Wilson" },
    { id: "jessica", name: "Jessica Lee" },
    { id: "all", name: "All Staff Members" },
  ]
  const categories = [
    { id: "chest", name: "Chest", color: "bg-red-600" },
    { id: "back", name: "Back", color: "bg-blue-600" },
    { id: "shoulders", name: "Shoulders", color: "bg-yellow-600" },
    { id: "arms", name: "Arms", color: "bg-green-600" },
    { id: "legs", name: "Legs", color: "bg-purple-600" },
    { id: "glutes", name: "Glutes", color: "bg-purple-800" },
    { id: "core", name: "Core", color: "bg-orange-600" },
  ]
  const [trainingVideos] = useState(newtrainingVideosState)
  const [trainingPlans, setTrainingPlans] = useState(newtrainingPlansState)
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    category: "Full Body",
    workoutsPerWeek: "",
    exercises: [],
    isPublic: true,
  })

  const [editingPlan, setEditingPlan] = useState(null)
  const [selectedExercises, setSelectedExercises] = useState([])
  const [videoToAdd, setVideoToAdd] = useState(null)

  // Filter videos based on category and search
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const availableVideos = filteredVideos

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
          ...editingPlan, // Keep the original plan structure
          ...planForm, // Override with form data
          id: editingPlan.id, // Ensure ID is preserved
          exercises: selectedExercises, // Use selectedExercises instead of planForm.exercises
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
      isPublic: true,
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
    setPlanForm((prevForm) => ({
      ...prevForm,
      exercises: [...prevForm.exercises, exercise],
    }))
  }

  const handleRemoveExercise = (index) => {
    const updatedExercises = selectedExercises.filter((_, i) => i !== index)
    setSelectedExercises(updatedExercises)
    setPlanForm((prevForm) => ({
      ...prevForm,
      exercises: updatedExercises,
    }))
  }

  const openEditPlan = (plan) => {
    setEditingPlan(plan)
    setPlanForm({
      name: plan.name || "",
      description: plan.description || "",
      difficulty: plan.difficulty || "Beginner",
      duration: plan.duration || "",
      category: plan.category || "Full Body",
      workoutsPerWeek: plan.workoutsPerWeek || "",
      exercises: plan.exercises || [],
      isPublic: plan.isPublic !== undefined ? plan.isPublic : true,
    })
    setSelectedExercises(plan.exercises || [])
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

  const handleAddToPlan = (selectedVideo) => {
    setVideoToAdd(selectedVideo)
    setIsAddToPlanModalOpen(true)
  }

  const createNewPlan = (videoToAdd) => {

    setIsAddToPlanModalOpen(false)
    setVideoToAdd(null)
    handleAddExercise(videoToAdd)
    setIsCreatePlanModalOpen(true)

  }


  const handleCloseCreateModal = () => {
    setIsCreatePlanModalOpen(false);
    resetPlanForm();
    setSelectedExercises([]);
  };

  const handleCloseEditModal = () => {
    setIsEditPlanModalOpen(false);
    setEditingPlan(null);
    resetPlanForm();
    setSelectedExercises([]);
  };

  const handleCloseViewModal = () => {
    setIsViewPlanModalOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4 sm:p-4 md:p-6">
        <div className="w-full mx-auto">
          <div className="flex  sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Training</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-[#161616] rounded-xl px-3 sm:px-4 py-2">
                <Dumbbell className="text-blue-500" size={18} />
                <span className="text-xs sm:text-sm text-gray-300">{trainingVideos.length} Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-[#161616] rounded-xl px-3 sm:px-4 py-2">
                <BookOpen className="text-green-500" size={18} />
                <span className="text-xs sm:text-sm text-gray-300">{trainingPlans.length} Plans</span>
              </div>
            </div>
          </div>

          <div className="w-full sm:max-w-xs mb-6">
            <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${activeTab === "videos" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Play size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Videos
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${activeTab === "plans" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Target size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Plans
              </button>
            </div>
          </div>

          {activeTab === "videos" && (
            <div>
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
                      ? `${category.color} text-white`
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      <VideoModal
        isOpen={isVideoModalOpen}
        video={selectedVideo}
        onClose={() => setIsVideoModalOpen(false)}
        onAddToPlan={handleAddToPlan}
      />

      <AddToPlanModal
        isOpen={isAddToPlanModalOpen}
        onClose={() => { setIsAddToPlanModalOpen(false); setVideoToAdd(null); }}
        videoToAdd={videoToAdd}
        trainingPlans={trainingPlans}
        onAddToExistingPlan={handleAddToExistingPlan}
        onCreateNewPlan={createNewPlan}
        getDifficultyColor={getDifficultyColor}
      />

      <CreatePlanModal
        isOpen={isCreatePlanModalOpen}
        onClose={handleCloseCreateModal}
        planForm={planForm}
        setPlanForm={setPlanForm}
        selectedExercises={selectedExercises}
        availableVideos={availableVideos}
        onAddExercise={handleAddExercise}
        onRemoveExercise={handleRemoveExercise}
        onCreatePlan={handleCreatePlan}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
      />

      <EditPlanModal
        isOpen={isEditPlanModalOpen}
        editingPlan={editingPlan}
        onClose={handleCloseEditModal}
        planForm={planForm}
        setPlanForm={setPlanForm}
        selectedExercises={selectedExercises}
        availableVideos={availableVideos}
        onAddExercise={handleAddExercise}
        onRemoveExercise={handleRemoveExercise}
        onEditPlan={handleEditPlan}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
      />

      <ViewPlanModal
        isOpen={isViewPlanModalOpen}
        selectedPlan={selectedPlan}
        onClose={handleCloseViewModal}
        getVideoById={getVideoById}
        getDifficultyColor={getDifficultyColor}
        onVideoClick={handleVideoClick}
      />
    </>
  )
}
