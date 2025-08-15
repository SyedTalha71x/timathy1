import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Filter, Search, Plus, Eye, Trash2, X, Clock, Target, Calendar, ChevronDown, Save, BookOpen, Dumbbell, User, Edit, Users } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast"

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
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Staff members
  const staffMembers = [
    { id: "own", name: "My Plans", isOwn: true },
    { id: "mike", name: "Mike Johnson" },
    { id: "sarah", name: "Sarah Wilson" },
    { id: "jessica", name: "Jessica Lee" },
    { id: "all", name: "All Staff Members" },
  ]

  // Training video categories
  const categories = [
    { id: "chest", name: "Chest", color: "bg-red-600" },
    { id: "back", name: "Back", color: "bg-blue-600" },
    { id: "shoulders", name: "Shoulders", color: "bg-yellow-600" },
    { id: "arms", name: "Arms", color: "bg-green-600" },
    { id: "legs", name: "Legs", color: "bg-purple-600" },
    { id: "glutes", name: "Glutes", color: "bg-purple-800" },
    { id: "core", name: "Core", color: "bg-orange-600" },
  ]

  // Sample training videos
  const [trainingVideos] = useState([
    {
      id: 1,
      title: "Push-Up Variations",
      description: "Learn different push-up techniques for chest development",
      category: "chest",
      duration: "8:45",
      difficulty: "Beginner",
      thumbnail: "https://cdn.prod.website-files.com/674732398a7cbc934e4c2f56/67f2538f3b071e2e85b1752b_11%20Push%20ups%20Variations%20to%20try%20out%20.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      instructor: "Mike Johnson",
      views: 1250,
      equipment: ["None"],
      targetMuscles: ["Chest", "Triceps", "Shoulders"],
    },
    {
      id: 2,
      title: "Deadlift Form Guide",
      description: "Master the deadlift with proper form and technique",
      category: "back",
      duration: "12:30",
      difficulty: "Intermediate",
      thumbnail: "https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F5ZN0GgcR2fSncFwnKuL1RP%2Fe603ba111e193d35510142c7eff9aae4%2Fdesktop-deadlift.jpg&w=3840&q=85",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      instructor: "Sarah Wilson",
      views: 2100,
      equipment: ["Barbell", "Plates"],
      targetMuscles: ["Back", "Glutes", "Hamstrings"],
    },
    {
      id: 3,
      title: "Shoulder Mobility Routine",
      description: "Improve shoulder flexibility and prevent injuries",
      category: "shoulders",
      duration: "15:20",
      difficulty: "Beginner",
      thumbnail: "https://i.ytimg.com/vi/TNU6umd0sNA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCpPN4NdKLe5ssqBHti4bbHb0LsqQ",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      instructor: "Lisa Davis",
      views: 890,
      equipment: ["Resistance Band"],
      targetMuscles: ["Shoulders", "Upper Back"],
    },
    {
      id: 4,
      title: "Bicep & Tricep Superset",
      description: "Effective arm workout combining bicep and tricep exercises",
      category: "arms",
      duration: "10:15",
      difficulty: "Intermediate",
      thumbnail: "https://fitnessprogramer.com/wp-content/uploads/2023/09/biceps-and-triceps-superset-workout.webp",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      instructor: "Tom Anderson",
      views: 1680,
      equipment: ["Dumbbells"],
      targetMuscles: ["Biceps", "Triceps"],
    },
    {
      id: 5,
      title: "Squat Progression",
      description: "From bodyweight to weighted squats progression guide",
      category: "legs",
      duration: "14:45",
      difficulty: "Beginner",
      thumbnail: "https://i.ytimg.com/vi/c0IAQC-seG8/maxresdefault.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      instructor: "Emma Thompson",
      views: 3200,
      equipment: ["None", "Barbell"],
      targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    },
    {
      id: 6,
      title: "Core Strengthening Circuit",
      description: "15-minute core workout for all fitness levels",
      category: "core",
      duration: "15:00",
      difficulty: "Intermediate",
      thumbnail: "https://media.hearstapps.com/loop/wh-loops-day-2-taylor-128-leglowers-v1-1665091082.mp4/poster.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      instructor: "Alex Rodriguez",
      views: 2450,
      equipment: ["Mat"],
      targetMuscles: ["Abs", "Obliques", "Lower Back"],
    },
    {
      id: 7,
      title: "HIIT Cardio Blast",
      description: "High-intensity interval training for fat burning",
      category: "cardio",
      duration: "20:30",
      difficulty: "Advanced",
      thumbnail: "https://hiitacademy.com/wp-content/uploads/2015/04/hiit_workout_20-791x1024.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      instructor: "Jessica Lee",
      views: 4100,
      equipment: ["None"],
      targetMuscles: ["Full Body"],
    },
    {
      id: 8,
      title: "Yoga Flow for Athletes",
      description: "Flexibility and recovery routine for athletes",
      category: "flexibility",
      duration: "25:15",
      difficulty: "Beginner",
      thumbnail: "https://i0.wp.com/skill-yoga.blog/wp-content/uploads/2021/05/skill-yoga-ultimate-guide-1.jpg?resize=1160%2C653&ssl=1",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      instructor: "Maya Patel",
      views: 1890,
      equipment: ["Yoga Mat"],
      targetMuscles: ["Full Body"],
    },
    {
      id: 9,
      title: "Bench Press Technique",
      description: "Perfect your bench press form for maximum gains",
      category: "chest",
      duration: "11:20",
      difficulty: "Intermediate",
      thumbnail: "https://cdn.prod.website-files.com/611abd833ca7af7702667729/641df9609f209750c235ed87_Screenshot%202023-03-24%20at%202.15.08%20PM.png",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      instructor: "David Kim",
      views: 2800,
      equipment: ["Barbell", "Bench"],
      targetMuscles: ["Chest", "Triceps", "Shoulders"],
    },
    {
      id: 10,
      title: "Pull-Up Progressions",
      description: "Build up to your first pull-up with these progressions",
      category: "back",
      duration: "13:45",
      difficulty: "Beginner",
      thumbnail: "https://i.ytimg.com/vi/toLLBqqzGqI/maxresdefault.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      instructor: "Rachel Green",
      views: 3500,
      equipment: ["Pull-up Bar", "Resistance Band"],
      targetMuscles: ["Lats", "Biceps", "Rhomboids"],
    },
  ])

  // Training plans state
  const [trainingPlans, setTrainingPlans] = useState([
    {
      id: 1,
      name: "Beginner Full Body",
      description: "A comprehensive full-body workout plan for beginners",
      createdBy: "Current User",
      createdAt: "2024-01-15",
      duration: "4 weeks",
      difficulty: "Beginner",
      category: "Full Body",
      workoutsPerWeek: 3,
      exercises: [
        { videoId: 1, sets: 3, reps: "10-12", rest: "60s" },
        { videoId: 5, sets: 3, reps: "12-15", rest: "90s" },
        { videoId: 6, sets: 2, reps: "30s", rest: "45s" },
      ],
      isPublic: true,
      likes: 45,
      uses: 120,
    },
    {
      id: 2,
      name: "Upper Body Strength",
      description: "Focus on building upper body strength and muscle mass",
      createdBy: "Sarah Wilson",
      createdAt: "2024-01-20",
      duration: "6 weeks",
      difficulty: "Intermediate",
      category: "Upper Body",
      workoutsPerWeek: 4,
      exercises: [
        { videoId: 1, sets: 4, reps: "8-10", rest: "90s" },
        { videoId: 2, sets: 4, reps: "6-8", rest: "120s" },
        { videoId: 4, sets: 3, reps: "10-12", rest: "75s" },
        { videoId: 9, sets: 4, reps: "8-10", rest: "90s" },
      ],
      isPublic: true,
      likes: 78,
      uses: 89,
    },
    {
      id: 3,
      name: "Cardio & Conditioning",
      description: "High-intensity cardio workouts for fat loss and conditioning",
      createdBy: "Jessica Lee",
      createdAt: "2024-02-01",
      duration: "",
      difficulty: "Advanced",
      category: "Cardio",
      workoutsPerWeek: null,
      exercises: [
        { videoId: 7, sets: 1, reps: "20 min", rest: "0s" },
        { videoId: 6, sets: 3, reps: "45s", rest: "15s" },
        { videoId: 8, sets: 1, reps: "25 min", rest: "0s" },
      ],
      isPublic: true,
      likes: 92,
      uses: 156,
    },
    {
      id: 4,
      name: "Quick Morning Routine",
      description: "Short and effective morning workout",
      createdBy: "Mike Johnson",
      createdAt: "2024-02-05",
      duration: "",
      difficulty: "Beginner",
      category: "Full Body",
      workoutsPerWeek: null,
      exercises: [
        { videoId: 1, sets: 2, reps: "8-10", rest: "30s" },
        { videoId: 5, sets: 2, reps: "10-12", rest: "45s" },
      ],
      isPublic: true,
      likes: 23,
      uses: 67,
    },
  ])

  // Create plan form state
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

  // Filter plans based on selected staff member
  const filteredPlans = trainingPlans.filter((plan) => {
    if (selectedStaffMember === "own") {
      return plan.createdBy === "Current User"
    } else if (selectedStaffMember === "all") {
      return true
    } else {
      const staffMember = staffMembers.find(s => s.id === selectedStaffMember)
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
    const updatedPlans = trainingPlans.map(plan => 
      plan.id === editingPlan.id ? { ...planForm, id: editingPlan.id } : plan
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
    
    const updatedPlans = trainingPlans.map(plan => 
      plan.id === planId 
        ? { ...plan, exercises: [...plan.exercises, exercise] }
        : plan
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
      isPublic: plan.isPublic,
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

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4 sm:p-4 md:p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
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

          {/* Tab Navigation */}
          <div className="w-full sm:max-w-xs mb-6">
            <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                  activeTab === "videos" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Play size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Videos
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                  activeTab === "plans" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Target size={14} className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Training </span>Plans
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
                <div className="relative">
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 text-sm bg-[#161616] rounded-xl border border-gray-700 hover:border-gray-600 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                  >
                    <Filter size={16} />
                    <span className="truncate">{categories.find((cat) => cat.id === selectedCategory)?.name || "All Exercises"}</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full sm:w-64 bg-[#2F2F2F] rounded-xl shadow-lg z-50 border border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedCategory("all")
                          setIsFilterDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors flex items-center gap-3 ${
                          selectedCategory === "all" ? "bg-[#3F3F3F]" : ""
                        }`}
                      >
                        <span className="text-white">All Exercises</span>
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setIsFilterDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors flex items-center gap-3 ${
                            selectedCategory === category.id ? "bg-[#3F3F3F]" : ""
                          }`}
                        >
                          <span className="text-white">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === "all"
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
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? `${category.color} text-white`
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
                        className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                          video.difficulty
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
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm bg-[#161616] rounded-xl border border-gray-700 hover:border-gray-600 transition-colors w-full sm:w-auto justify-between sm:justify-start"
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
                            className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors flex items-center gap-3 ${
                              selectedStaffMember === member.id ? "bg-[#3F3F3F]" : ""
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className="bg-[#161616] rounded-xl p-4 sm:p-6 hover:bg-[#1F1F1F] transition-colors">
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
                          selectedVideo.difficulty
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
                          <span key={index} className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Equipment Needed</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.equipment.map((item, index) => (
                          <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
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
                    .filter(plan => plan.createdBy === "Current User")
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
                      onChange={(e) => setPlanForm({ ...planForm, workoutsPerWeek: e.target.value ? parseInt(e.target.value) : "" })}
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
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={planForm.isPublic}
                      onChange={(e) => setPlanForm({ ...planForm, isPublic: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-400">
                      Make this plan public (visible to all staff members)
                    </label>
                  </div>
                </div>

                {/* Exercise Library */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Exercise Library</h3>
                  <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {trainingVideos.map((video) => (
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
                              <span className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}>
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Selected Exercises ({selectedExercises.length})</h3>
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
                              <span className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}>
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
                      onChange={(e) => setPlanForm({ ...planForm, workoutsPerWeek: e.target.value ? parseInt(e.target.value) : "" })}
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
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublicEdit"
                      checked={planForm.isPublic}
                      onChange={(e) => setPlanForm({ ...planForm, isPublic: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="isPublicEdit" className="text-sm text-gray-400">
                      Make this plan public (visible to all staff members)
                    </label>
                  </div>
                </div>

                {/* Exercise Library */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Exercise Library</h3>
                  <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {trainingVideos.map((video) => (
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
                              <span className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}>
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Selected Exercises ({selectedExercises.length})</h3>
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
                              <span className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}>
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

      {/* View Plan Modal */}
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Exercises ({selectedPlan.exercises.length})</h3>
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
                              <h4 className="font-medium text-white mb-1 text-sm sm:text-base truncate">{video?.title}</h4>
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
    </>
  )
}
