/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Eye,
  Filter,
  ChevronDown,
  Target,
  Dumbbell,
  Settings,
} from "lucide-react"
import { IoIosMenu } from "react-icons/io";
import toast from "react-hot-toast";

import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal";
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets";
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal";
import Sidebar from "../../components/admin-dashboard-components/central-sidebar";
import ManageOptionsModal from "../../components/admin-dashboard-components/training-components/ManageOptionsModal";
import ExerciseFormModal from "../../components/admin-dashboard-components/training-components/ExerciseFormModal";
import ViewExerciseModal from "../../components/admin-dashboard-components/training-components/ViewExerciseModal";
import DeleteExerciseModal from "../../components/admin-dashboard-components/training-components/DeleteExerciseModal";

const initialTrainingVideos = [
  {
    id: 1,
    name: "Push-Up Variations",
    description: "Learn different push-up techniques for building upper body strength",
    targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    equipment: ["None"],
    difficulty: "Beginner",
    duration: "8:45",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    uploadedAt: "2024-03-15",
    uploadedBy: "Admin",
  },
  {
    id: 2,
    name: "Squat Progressions",
    description: "Progressive squat exercises from bodyweight to weighted variations",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    equipment: ["None", "Dumbbells", "Barbell"],
    difficulty: "Beginner",
    duration: "10:15",
    thumbnail: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
    uploadedAt: "2024-03-13",
    uploadedBy: "Admin",
  },

];

const initialMuscleOptions = [
  "Chest", "Shoulders", "Triceps", "Biceps", "Back", "Lats", "Traps",
  "Core", "Abs", "Obliques", "Quadriceps", "Hamstrings", "Glutes",
  "Calves", "Forearms", "Lower Back"
]

const initialEquipmentOptions = [
  "None", "Dumbbells", "Barbell", "Resistance Bands", "Pull-up Bar",
  "Kettlebell", "Medicine Ball", "Cable Machine", "Bench", "Squat Rack",
  "Weight Plates", "Foam Roller", "Yoga Mat", "TRX Straps"
]

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"]

export default function AdminTrainingManagement() {
  const [trainingVideos, setTrainingVideos] = useState(initialTrainingVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(null)
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetMuscles: [],
    equipment: [],
    difficulty: "Beginner",
    videoFile: null,
    thumbnailFile: null,
  })

  // New state for managing options
  const [muscleOptions, setMuscleOptions] = useState(initialMuscleOptions)
  const [equipmentOptions, setEquipmentOptions] = useState(initialEquipmentOptions)
  const [isManageOptionsModalOpen, setIsManageOptionsModalOpen] = useState(false)
  const [newMuscleGroup, setNewMuscleGroup] = useState("")
  const [newEquipment, setNewEquipment] = useState("")
  const [editingMuscleIndex, setEditingMuscleIndex] = useState(null)
  const [editingEquipmentIndex, setEditingEquipmentIndex] = useState(null)
  const [editingMuscleValue, setEditingMuscleValue] = useState("")
  const [editingEquipmentValue, setEditingEquipmentValue] = useState("")

  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  //sidebar related logic and states 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    { id: "sidebar-notes", type: "notes", position: 4 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic

  // Filter videos based on search and difficulty
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesSearch =
      video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.targetMuscles.some(muscle =>
        muscle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesDifficulty = selectedDifficulty === "all" || video.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      targetMuscles: [],
      equipment: [],
      difficulty: "Beginner",
      videoFile: null,
      thumbnailFile: null,
    })
  }

  const handleCreate = () => {
    if (!formData.name || !formData.description || formData.targetMuscles.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const newVideo = {
      id: trainingVideos.length + 1,
      name: formData.name,
      description: formData.description,
      targetMuscles: formData.targetMuscles,
      equipment: formData.equipment.length > 0 ? formData.equipment : ["None"],
      difficulty: formData.difficulty,
      duration: "0:00", // Would be calculated from actual video
      thumbnail: formData.thumbnailFile ? URL.createObjectURL(formData.thumbnailFile) : "/api/placeholder/400/300",
      videoUrl: formData.videoFile ? URL.createObjectURL(formData.videoFile) : "",
      uploadedAt: new Date().toISOString().split("T")[0],
      uploadedBy: "Admin",
    }

    setTrainingVideos([...trainingVideos, newVideo])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedVideo || !formData.name || !formData.description || formData.targetMuscles.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const updatedVideos = trainingVideos.map((video) =>
      video.id === selectedVideo.id
        ? {
          ...video,
          name: formData.name,
          description: formData.description,
          targetMuscles: formData.targetMuscles,
          equipment: formData.equipment.length > 0 ? formData.equipment : ["None"],
          difficulty: formData.difficulty,
          thumbnail: formData.thumbnailFile ? URL.createObjectURL(formData.thumbnailFile) : video.thumbnail,
          videoUrl: formData.videoFile ? URL.createObjectURL(formData.videoFile) : video.videoUrl,
        }
        : video
    )

    setTrainingVideos(updatedVideos)
    setIsEditModalOpen(false)
    setSelectedVideo(null)
    resetForm()
  }

  const handleDelete = () => {
    setTrainingVideos(trainingVideos.filter((video) => video.id !== videoToDelete.id))
    setIsDeleteModalOpen(false)
    setVideoToDelete(null)
  }

  const openEditModal = (video) => {
    setSelectedVideo(video)
    setFormData({
      name: video.name,
      description: video.description,
      targetMuscles: video.targetMuscles,
      equipment: video.equipment,
      difficulty: video.difficulty,
      videoFile: null,
      thumbnailFile: null,
    })
    setIsEditModalOpen(true)
  }

  const handleMuscleToggle = (muscle) => {
    setFormData(prev => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscle)
        ? prev.targetMuscles.filter(m => m !== muscle)
        : [...prev.targetMuscles, muscle]
    }))
  }

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }))
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

  // Manage Options Functions
  const addMuscleGroup = () => {
    if (newMuscleGroup.trim() && !muscleOptions.includes(newMuscleGroup.trim())) {
      setMuscleOptions([...muscleOptions, newMuscleGroup.trim()])
      setNewMuscleGroup("")
      toast.success("Muscle group added successfully")
    }
  }

  const addEquipment = () => {
    if (newEquipment.trim() && !equipmentOptions.includes(newEquipment.trim())) {
      setEquipmentOptions([...equipmentOptions, newEquipment.trim()])
      setNewEquipment("")
      toast.success("Equipment added successfully")
    }
  }

  const removeMuscleGroup = (index) => {
    const updatedMuscles = muscleOptions.filter((_, i) => i !== index)
    setMuscleOptions(updatedMuscles)
    toast.success("Muscle group removed successfully")
  }

  const removeEquipment = (index) => {
    const updatedEquipment = equipmentOptions.filter((_, i) => i !== index)
    setEquipmentOptions(updatedEquipment)
    toast.success("Equipment removed successfully")
  }

  const startEditingMuscle = (index, value) => {
    setEditingMuscleIndex(index)
    setEditingMuscleValue(value)
  }

  const startEditingEquipment = (index, value) => {
    setEditingEquipmentIndex(index)
    setEditingEquipmentValue(value)
  }

  const saveEditedMuscle = () => {
    if (editingMuscleValue.trim()) {
      const updatedMuscles = [...muscleOptions]
      updatedMuscles[editingMuscleIndex] = editingMuscleValue.trim()
      setMuscleOptions(updatedMuscles)
      setEditingMuscleIndex(null)
      setEditingMuscleValue("")
      toast.success("Muscle group updated successfully")
    }
  }

  const saveEditedEquipment = () => {
    if (editingEquipmentValue.trim()) {
      const updatedEquipment = [...equipmentOptions]
      updatedEquipment[editingEquipmentIndex] = editingEquipmentValue.trim()
      setEquipmentOptions(updatedEquipment)
      setEditingEquipmentIndex(null)
      setEditingEquipmentValue("")
      toast.success("Equipment updated successfully")
    }
  }

  const cancelEditing = () => {
    setEditingMuscleIndex(null)
    setEditingEquipmentIndex(null)
    setEditingMuscleValue("")
    setEditingEquipmentValue("")
  }

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
        ? 'lg:mr-86 mr-0'
        : 'mr-0'
      }
    `}>
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex justify-between items-center gap-2 w-full md:w-auto">
            <h1 className="text-white text-xl md:text-2xl font-bold mb-2">Training Exercises</h1>
           
            <img
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="h-5 w-5 mr-5 lg:hidden md:hidden block  cursor-pointer"
              src="/icon.svg"
              alt=""
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManageOptionsModalOpen(true)}
              className="flex items-center gap-2 text-sm px-4 cursor-pointer py-2 bg-gray-600 hover:bg-gray-700 rounded-xl text-white font-medium transition-colors justify-center sm:justify-start"
            >
              <Settings size={18} />
              Manage Options
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 text-sm px-4 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors justify-center sm:justify-start"
            >
              <Plus size={18} />
              Upload Exercise
            </button>
           
            <img
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="h-5 w-5 mr-5 lg:block md:block hidden  cursor-pointer"
              src="/icon.svg"
              alt=""
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 text-sm top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] pl-10 pr-4 py-2.5 sm:py-2 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
              className="md:w-auto w-full  text-white flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]"
            >
              <Filter size={16} />
              <span className="truncate">
                {selectedDifficulty === "all" ? "All Levels" : selectedDifficulty}
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${isDifficultyDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDifficultyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full text-sm sm:w-48 bg-[#2F2F2F] rounded-xl shadow-lg z-50 border border-gray-700">
                <button
                  onClick={() => {
                    setSelectedDifficulty("all")
                    setIsDifficultyDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors ${selectedDifficulty === "all" ? "bg-[#3F3F3F]" : ""}`}
                >
                  <span className="text-white">All Levels</span>
                </button>
                {difficultyOptions.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty)
                      setIsDifficultyDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors ${selectedDifficulty === difficulty ? "bg-[#3F3F3F]" : ""}`}
                  >
                    <span className="text-white">{difficulty}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#161616] rounded-xl overflow-hidden hover:bg-[#1F1F1F] transition-colors"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.name}
                  className="w-full h-36 sm:h-48 object-cover"
                />
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
                <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm sm:text-base">
                  {video.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.targetMuscles.slice(0, 2).map((muscle, index) => (
                    <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                      {muscle}
                    </span>
                  ))}
                  {video.targetMuscles.length > 2 && (
                    <span className="text-gray-500 text-xs">+{video.targetMuscles.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-gray-500 text-xs">
                    {video.uploadedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedVideo(video)
                        setIsViewModalOpen(true)
                      }}
                      className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={14} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        setVideoToDelete(video)
                        setIsDeleteModalOpen(true)
                      }}
                      className="p-2 bg-[#2F2F2F] hover:bg-red-600/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Dumbbell size={48} className="mx-auto mb-4" />
              <p>No exercises found matching your criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Manage Options Modal */}
      <ManageOptionsModal
        isOpen={isManageOptionsModalOpen}
        onClose={() => setIsManageOptionsModalOpen(false)}

        muscleOptions={muscleOptions}
        newMuscleGroup={newMuscleGroup}
        setNewMuscleGroup={setNewMuscleGroup}
        addMuscleGroup={addMuscleGroup}
        removeMuscleGroup={removeMuscleGroup}
        editingMuscleIndex={editingMuscleIndex}
        editingMuscleValue={editingMuscleValue}
        setEditingMuscleValue={setEditingMuscleValue}
        startEditingMuscle={startEditingMuscle}
        saveEditedMuscle={saveEditedMuscle}

        equipmentOptions={equipmentOptions}
        newEquipment={newEquipment}
        setNewEquipment={setNewEquipment}
        addEquipment={addEquipment}
        removeEquipment={removeEquipment}
        editingEquipmentIndex={editingEquipmentIndex}
        editingEquipmentValue={editingEquipmentValue}
        setEditingEquipmentValue={setEditingEquipmentValue}
        startEditingEquipment={startEditingEquipment}
        saveEditedEquipment={saveEditedEquipment}

        cancelEditing={cancelEditing}
      />

      {/* Create/Edit Modal */}
      <ExerciseFormModal
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        formData={formData}
        setFormData={setFormData}
        muscleOptions={muscleOptions}
        equipmentOptions={equipmentOptions}
        handleMuscleToggle={handleMuscleToggle}
        handleEquipmentToggle={handleEquipmentToggle}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedVideo={setSelectedVideo}
        resetForm={resetForm}
      />

      <ViewExerciseModal
        isOpen={isViewModalOpen}
        selectedVideo={selectedVideo}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedVideo(null);
        }}
        videoRef={videoRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        handleTimeUpdate={handleTimeUpdate}
        handleLoadedMetadata={handleLoadedMetadata}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColor}
        openEditModal={openEditModal}
        setVideoToDelete={setVideoToDelete}
        openDeleteModal={() => setIsDeleteModalOpen(true)}
        setIsPlaying={setIsPlaying}
      />

      <DeleteExerciseModal
        isOpen={isDeleteModalOpen}
        videoToDelete={videoToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirmDelete={handleDelete}
      />



      {/* sidebar related modals */}
      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={() => { setIsEditing(!isEditing); }} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}
    </div>
  )
}