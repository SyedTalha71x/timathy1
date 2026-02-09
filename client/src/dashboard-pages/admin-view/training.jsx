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
import toast from "react-hot-toast";

import ManageOptionsModal from "../../components/admin-dashboard-components/training-components/ManageOptionsModal";
import ExerciseFormModal from "../../components/admin-dashboard-components/training-components/ExerciseFormModal";
import ViewExerciseModal from "../../components/admin-dashboard-components/training-components/ViewExerciseModal";
import DeleteExerciseModal from "../../components/admin-dashboard-components/training-components/DeleteExerciseModal";
import { getTranslation, getOptionName, emptyTranslations } from '../../components/admin-dashboard-components/shared/LanguageTabs';

import {
  initialTrainingVideos,
  initialMuscleOptions,
  initialEquipmentOptions,
  difficultyOptions,
} from "../../utils/admin-panel-states/training-states";

// ─── Component ───────────────────────────────────────────────────────────────

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
    name: emptyTranslations(),
    description: emptyTranslations(),
    targetMuscles: [],
    equipment: [],
    difficulty: "Beginner",
    videoFile: null,
    thumbnailFile: null,
  })

  // Muscle & Equipment options (multilingual)
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
  // ─── Display helpers ────────────────────────────────────────────────────────

  const getMuscleDisplayName = (muscleId, lang = "en") => {
    const muscle = muscleOptions.find(m => m.id === muscleId)
    return muscle ? getOptionName(muscle, lang) : muscleId
  }

  const getEquipmentDisplayName = (equipId, lang = "en") => {
    const equip = equipmentOptions.find(e => e.id === equipId)
    return equip ? getOptionName(equip, lang) : equipId
  }

  // ─── Search filter (searches across all languages) ──────────────────────────

  const filteredVideos = trainingVideos.filter((video) => {
    const query = searchQuery.toLowerCase()
    const nameMatch = typeof video.name === "string"
      ? video.name.toLowerCase().includes(query)
      : Object.values(video.name || {}).some(v => v?.toLowerCase().includes(query))
    const descMatch = typeof video.description === "string"
      ? video.description.toLowerCase().includes(query)
      : Object.values(video.description || {}).some(v => v?.toLowerCase().includes(query))
    const muscleMatch = video.targetMuscles.some(muscleId => {
      const muscle = muscleOptions.find(m => m.id === muscleId)
      if (!muscle) return muscleId.toLowerCase().includes(query)
      return Object.values(muscle.translations || {}).some(v => v?.toLowerCase().includes(query))
    })
    const matchesSearch = nameMatch || descMatch || muscleMatch
    const matchesDifficulty = selectedDifficulty === "all" || video.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  // ─── Form handlers ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      name: emptyTranslations(),
      description: emptyTranslations(),
      targetMuscles: [],
      equipment: [],
      difficulty: "Beginner",
      videoFile: null,
      thumbnailFile: null,
    })
  }

  const handleCreate = () => {
    if (!formData.name?.en || !formData.description?.en || formData.targetMuscles.length === 0) {
      alert("Please fill in all required fields (English name and description are required)")
      return
    }

    const newVideo = {
      id: Date.now(),
      name: { ...formData.name },
      description: { ...formData.description },
      targetMuscles: formData.targetMuscles,
      equipment: formData.equipment.length > 0 ? formData.equipment : ["none"],
      difficulty: formData.difficulty,
      duration: "0:00",
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
    if (!selectedVideo || !formData.name?.en || !formData.description?.en || formData.targetMuscles.length === 0) {
      alert("Please fill in all required fields (English name and description are required)")
      return
    }

    const updatedVideos = trainingVideos.map((video) =>
      video.id === selectedVideo.id
        ? {
            ...video,
            name: { ...formData.name },
            description: { ...formData.description },
            targetMuscles: formData.targetMuscles,
            equipment: formData.equipment.length > 0 ? formData.equipment : ["none"],
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
      name: typeof video.name === "string"
        ? { en: video.name, de: "", fr: "", it: "", es: "" }
        : { ...emptyTranslations(), ...video.name },
      description: typeof video.description === "string"
        ? { en: video.description, de: "", fr: "", it: "", es: "" }
        : { ...emptyTranslations(), ...video.description },
      targetMuscles: [...video.targetMuscles],
      equipment: [...video.equipment],
      difficulty: video.difficulty,
      videoFile: null,
      thumbnailFile: null,
    })
    setIsEditModalOpen(true)
  }

  const handleMuscleToggle = (muscleId) => {
    setFormData(prev => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscleId)
        ? prev.targetMuscles.filter(m => m !== muscleId)
        : [...prev.targetMuscles, muscleId]
    }))
  }

  const handleEquipmentToggle = (equipmentId) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(e => e !== equipmentId)
        : [...prev.equipment, equipmentId]
    }))
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-600"
      case "Intermediate": return "bg-yellow-600"
      case "Advanced": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  // ─── Video player ───────────────────────────────────────────────────────────

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause() } else { videoRef.current.play() }
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
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // ─── Manage Options – Muscles ───────────────────────────────────────────────

  const addMuscleGroup = (lang = "en") => {
    if (newMuscleGroup.trim()) {
      const duplicate = muscleOptions.some(m =>
        m.translations[lang]?.toLowerCase() === newMuscleGroup.trim().toLowerCase()
      )
      if (duplicate) {
        toast.error("This muscle group already exists")
        return
      }
      const newOption = {
        id: `muscle_${Date.now()}`,
        translations: { ...emptyTranslations(), [lang]: newMuscleGroup.trim() }
      }
      setMuscleOptions([...muscleOptions, newOption])
      setNewMuscleGroup("")
      toast.success("Muscle group added successfully")
    }
  }

  const removeMuscleGroup = (index) => {
    const removed = muscleOptions[index]
    const updatedMuscles = muscleOptions.filter((_, i) => i !== index)
    setMuscleOptions(updatedMuscles)
    if (removed) {
      setTrainingVideos(prev => prev.map(v => ({
        ...v,
        targetMuscles: v.targetMuscles.filter(id => id !== removed.id)
      })))
    }
    toast.success("Muscle group removed successfully")
  }

  const startEditingMuscle = (index, value) => {
    setEditingMuscleIndex(index)
    setEditingMuscleValue(value)
  }

  const saveEditedMuscle = (lang = "en") => {
    if (editingMuscleValue.trim()) {
      const updated = [...muscleOptions]
      updated[editingMuscleIndex] = {
        ...updated[editingMuscleIndex],
        translations: {
          ...updated[editingMuscleIndex].translations,
          [lang]: editingMuscleValue.trim()
        }
      }
      setMuscleOptions(updated)
      setEditingMuscleIndex(null)
      setEditingMuscleValue("")
      toast.success("Muscle group updated successfully")
    }
  }

  // ─── Manage Options – Equipment ─────────────────────────────────────────────

  const addEquipment = (lang = "en") => {
    if (newEquipment.trim()) {
      const duplicate = equipmentOptions.some(e =>
        e.translations[lang]?.toLowerCase() === newEquipment.trim().toLowerCase()
      )
      if (duplicate) {
        toast.error("This equipment already exists")
        return
      }
      const newOption = {
        id: `equip_${Date.now()}`,
        translations: { ...emptyTranslations(), [lang]: newEquipment.trim() }
      }
      setEquipmentOptions([...equipmentOptions, newOption])
      setNewEquipment("")
      toast.success("Equipment added successfully")
    }
  }

  const removeEquipment = (index) => {
    const removed = equipmentOptions[index]
    const updatedEquipment = equipmentOptions.filter((_, i) => i !== index)
    setEquipmentOptions(updatedEquipment)
    if (removed) {
      setTrainingVideos(prev => prev.map(v => ({
        ...v,
        equipment: v.equipment.filter(id => id !== removed.id)
      })))
    }
    toast.success("Equipment removed successfully")
  }

  const startEditingEquipment = (index, value) => {
    setEditingEquipmentIndex(index)
    setEditingEquipmentValue(value)
  }

  const saveEditedEquipment = (lang = "en") => {
    if (editingEquipmentValue.trim()) {
      const updated = [...equipmentOptions]
      updated[editingEquipmentIndex] = {
        ...updated[editingEquipmentIndex],
        translations: {
          ...updated[editingEquipmentIndex].translations,
          [lang]: editingEquipmentValue.trim()
        }
      }
      setEquipmentOptions(updated)
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

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      
    `}>
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex justify-between items-center gap-2 w-full md:w-auto">
            <h1 className="text-white text-xl md:text-2xl font-bold mb-2">Training Exercises</h1>
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
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 text-sm top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search exercises (all languages)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] pl-10 pr-4 py-2.5 sm:py-2 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
              className="md:w-auto w-full text-white flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]"
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
                  onClick={() => { setSelectedDifficulty("all"); setIsDifficultyDropdownOpen(false) }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors ${selectedDifficulty === "all" ? "bg-[#3F3F3F]" : ""}`}
                >
                  <span className="text-white">All Levels</span>
                </button>
                {difficultyOptions.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => { setSelectedDifficulty(difficulty); setIsDifficultyDropdownOpen(false) }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#3F3F3F] transition-colors ${selectedDifficulty === difficulty ? "bg-[#3F3F3F]" : ""}`}
                  >
                    <span className="text-white">{difficulty}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#161616] rounded-xl overflow-hidden hover:bg-[#1F1F1F] transition-colors"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={getTranslation(video.name, "en")}
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
                  {getTranslation(video.name, "en")}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                  {getTranslation(video.description, "en")}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.targetMuscles.slice(0, 2).map((muscleId, index) => (
                    <span key={index} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                      {getMuscleDisplayName(muscleId)}
                    </span>
                  ))}
                  {video.targetMuscles.length > 2 && (
                    <span className="text-gray-500 text-xs">+{video.targetMuscles.length - 2}</span>
                  )}
                </div>

                {/* Translation status indicator */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-gray-600 text-xs mr-1">Translations:</span>
                  {["en", "de", "fr", "it", "es"].map((lang) => (
                    <span
                      key={lang}
                      title={`${lang.toUpperCase()}: ${video.name?.[lang]?.trim() ? "✓" : "—"}`}
                      className={`w-2 h-2 rounded-full ${
                        typeof video.name === "object" && video.name[lang]?.trim()
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-gray-500 text-xs">
                    {video.uploadedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedVideo(video); setIsViewModalOpen(true) }}
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
                      onClick={() => { setVideoToDelete(video); setIsDeleteModalOpen(true) }}
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
        onClose={() => { setIsViewModalOpen(false); setSelectedVideo(null) }}
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
        muscleOptions={muscleOptions}
        equipmentOptions={equipmentOptions}
      />

      <DeleteExerciseModal
        isOpen={isDeleteModalOpen}
        videoToDelete={videoToDelete}
        onClose={() => { setIsDeleteModalOpen(false); setVideoToDelete(null) }}
        onConfirmDelete={handleDelete}
      />
    </div>
  )
}
