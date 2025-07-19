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
  Copy,
  Share2,
  BookOpen,
  Dumbbell,
  User,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function Training() {
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false)
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

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
      createdBy: "Mike Johnson",
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
      tags: ["beginner", "full-body", "strength"],
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
      tags: ["intermediate", "upper-body", "strength", "muscle-building"],
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
      duration: "8 weeks",
      difficulty: "Advanced",
      category: "Cardio",
      workoutsPerWeek: 5,
      exercises: [
        { videoId: 7, sets: 1, reps: "20 min", rest: "0s" },
        { videoId: 6, sets: 3, reps: "45s", rest: "15s" },
        { videoId: 8, sets: 1, reps: "25 min", rest: "0s" },
      ],
      tags: ["advanced", "cardio", "fat-loss", "conditioning"],
      isPublic: true,
      likes: 92,
      uses: 156,
    },
  ])

  // Create plan form state
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    category: "Full Body",
    workoutsPerWeek: 3,
    exercises: [],
    tags: [],
    isPublic: true,
  })

  const [selectedExercises, setSelectedExercises] = useState([])

  // Filter videos based on category and search
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
      createdBy: "Current User", // In real app, this would be the logged-in user
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      uses: 0,
    }
    setTrainingPlans([...trainingPlans, newPlan])
    setIsCreatePlanModalOpen(false)
    setPlanForm({
      name: "",
      description: "",
      duration: "",
      difficulty: "Beginner",
      category: "Full Body",
      workoutsPerWeek: 3,
      exercises: [],
      tags: [],
      isPublic: true,
    })
    setSelectedExercises([])
    toast.success("Training plan created successfully!")
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
      <Toaster position="top-right" />
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-white mb-2">Training</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#161616] rounded-xl px-4 py-2">
                <Dumbbell className="text-blue-500" size={20} />
                <span className="text-sm text-gray-300">{trainingVideos.length} Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-[#161616] rounded-xl px-4 py-2">
                <BookOpen className="text-green-500" size={20} />
                <span className="text-sm text-gray-300">{trainingPlans.length} Plans</span>
              </div>
            </div>
          </div>

          <div className="max-w-xs mr-auto w-full">

        
          
          <div className="flex bg-[#000000] mb-3 rounded-xl border border-slate-300/30 p-1">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === "videos" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Play size={16} className="inline mr-2" />
                  Training Videos
                </button>
                <button
                  onClick={() => setActiveTab("plans")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === "plans" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Target size={16} className="inline mr-2" />
                  Training Plans
                </button>
              </div>
              </div>

          {activeTab === "videos" && (
            <div>
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search videos, instructors, or exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161616] pl-10 pr-4 py-2 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700  outline-none"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#161616] rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <Filter size={16} />
                    <span>{categories.find((cat) => cat.id === selectedCategory)?.name || "All Exercises"}</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#2F2F2F] rounded-xl shadow-lg z-50 border border-gray-700">
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
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-white">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? `${category.color} text-white`
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-blue-600 rounded-full p-3">
                          <Play className="text-white" size={24} />
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
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                    
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Training Plans</h2>
                </div>
                <button
                  onClick={() => setIsCreatePlanModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors"
                >
                  <Plus size={20} />
                  Create Plan
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingPlans.map((plan) => (
                  <div key={plan.id} className="bg-[#161616] rounded-xl p-6 hover:bg-[#1F1F1F] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{plan.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{plan.workoutsPerWeek}x per week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User size={14} />
                        <span>by {plan.createdBy}</span>
                      </div>
                    </div>


                    <div className="flex items-center justify-end">
          
                      <div className="flex items-center cursor-pointer justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan)
                            setIsViewPlanModalOpen(true)
                          }}
                          className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                        >
                          <Eye size={16} className="text-gray-400" />
                        </button>
                      
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false)
                    setSelectedVideo(null)
                    setIsPlaying(false)
                  }}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-64 md:h-96"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="flex-1 flex items-center gap-2 text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About This Exercise</h3>
                  <p className="text-gray-400 mb-4">{selectedVideo.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white">{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Difficulty:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(selectedVideo.difficulty)}`}
                      >
                        {selectedVideo.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Exercise Details</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Target Muscles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.targetMuscles.map((muscle, index) => (
                          <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Equipment Needed</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.equipment.map((item, index) => (
                          <span key={index} className="bg-[#2F2F2F] text-gray-300 px-3 py-1 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddExercise(selectedVideo)
                      toast.success("Exercise added to your current plan!")
                    }}
                    className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
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

      {/* Create Plan Modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Create Training Plan</h2>
                <button
                  onClick={() => setIsCreatePlanModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plan Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
                      placeholder="Enter plan name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none resize-none"
                      rows={3}
                      placeholder="Describe your training plan..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                      <input
                        type="text"
                        value={planForm.duration}
                        onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
                        placeholder="e.g., 4 weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Workouts/Week</label>
                      <input
                        type="number"
                        value={planForm.workoutsPerWeek}
                        onChange={(e) => setPlanForm({ ...planForm, workoutsPerWeek: Number.parseInt(e.target.value) })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
                        min="1"
                        max="7"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                      <select
                        value={planForm.difficulty}
                        onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
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
                        className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
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

                {/* Exercise Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Selected Exercises</h3>

                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Target size={48} className="mx-auto mb-4" />
                      <p>No exercises selected yet</p>
                      <p className="text-sm">Browse videos and add exercises to your plan</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedExercises.map((exercise, index) => {
                        const video = getVideoById(exercise.videoId)
                        return (
                          <div key={index} className="bg-[#161616] rounded-xl p-4">
                            <div className="flex items-start gap-4">
                              <img
                                src={video?.thumbnail || "/placeholder.svg"}
                                alt={video?.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-white mb-1">{video?.title}</h4>
                                <p className="text-gray-400 text-sm mb-2">{video?.instructor}</p>
                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => {
                                      const updated = [...selectedExercises]
                                      updated[index].sets = Number.parseInt(e.target.value)
                                      setSelectedExercises(updated)
                                    }}
                                    className="bg-[#2F2F2F] rounded px-2 py-1 text-white text-sm"
                                    placeholder="Sets"
                                    min="1"
                                  />
                                  <input
                                    type="text"
                                    value={exercise.reps}
                                    onChange={(e) => {
                                      const updated = [...selectedExercises]
                                      updated[index].reps = e.target.value
                                      setSelectedExercises(updated)
                                    }}
                                    className="bg-[#2F2F2F] rounded px-2 py-1 text-white text-sm"
                                    placeholder="Reps"
                                  />
                                  <input
                                    type="text"
                                    value={exercise.rest}
                                    onChange={(e) => {
                                      const updated = [...selectedExercises]
                                      updated[index].rest = e.target.value
                                      setSelectedExercises(updated)
                                    }}
                                    className="bg-[#2F2F2F] rounded px-2 py-1 text-white text-sm"
                                    placeholder="Rest"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveExercise(index)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setIsCreatePlanModalOpen(false)}
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

      {/* View Plan Modal */}
      {isViewPlanModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedPlan.name}</h2>
                  <p className="text-gray-400">{selectedPlan.description}</p>
                </div>
                <button
                  onClick={() => setIsViewPlanModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Info */}
                <div className="lg:col-span-1">
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Plan Details</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Created by</span>
                        <span className="text-white">{selectedPlan.createdBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">{selectedPlan.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Difficulty</span>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(selectedPlan.difficulty)}`}
                        >
                          {selectedPlan.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Workouts/Week</span>
                        <span className="text-white">{selectedPlan.workoutsPerWeek}x</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className="text-white">{selectedPlan.category}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.tags.map((tag, index) => (
                          <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => toast.success("Plan copied to your library!")}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy size={14} />
                        Copy Plan
                      </button>
                      <button
                        onClick={() => toast.success("Plan shared successfully!")}
                        className="px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4">Exercises ({selectedPlan.exercises.length})</h3>

                  <div className="space-y-4">
                    {selectedPlan.exercises.map((exercise, index) => {
                      const video = getVideoById(exercise.videoId)
                      return (
                        <div key={index} className="bg-[#161616] rounded-xl p-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <img
                              src={video?.thumbnail || "/placeholder.svg"}
                              alt={video?.title}
                              className="w-20 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-white mb-1">{video?.title}</h4>
                              <p className="text-gray-400 text-sm mb-2">{video?.instructor}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400">
                                  <strong className="text-white">{exercise.sets}</strong> sets
                                </span>
                                <span className="text-gray-400">
                                  <strong className="text-white">{exercise.reps}</strong> reps
                                </span>
                                <span className="text-gray-400">
                                  <strong className="text-white">{exercise.rest}</strong> rest
                                </span>
                              </div>
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
                              className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                            >
                              <Play size={16} className="text-gray-400" />
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
