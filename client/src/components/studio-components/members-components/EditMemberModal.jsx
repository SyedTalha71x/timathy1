/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Trash2, X, Search, Plus, ChevronDown, ChevronUp, Pencil, Archive, ArchiveRestore, Camera, Upload } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"

// Initials Avatar Component - Orange background with initials
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-3xl",
  }

  return (
    <div 
      className={`bg-orange-500 rounded-xl flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
    >
      {getInitials()}
    </div>
  )
}

// Camera Modal Component
const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState("user")

  useEffect(() => {
    if (isOpen) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please ensure you have granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      onCapture(imageData)
      stopCamera()
      onClose()
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000020] p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Take Photo</h3>
          <button onClick={() => { stopCamera(); onClose(); }} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button 
                onClick={startCamera}
                className="px-4 py-2 bg-[#3F74FF] text-white rounded-xl text-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-xl overflow-hidden aspect-square mb-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Camera size={16} />
                  Flip
                </button>
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex-[2] py-2.5 bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white rounded-xl text-sm font-medium"
                >
                  Capture Photo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Note Status Options
const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

const EditMemberModalMain = ({
  isOpen,
  onClose,
  selectedMemberMain,
  editModalTabMain,
  setEditModalTabMain,
  editFormMain,
  handleInputChangeMain,
  handleEditSubmitMain,
  editingRelationsMain,
  setEditingRelationsMain,
  newRelationMain,
  setNewRelationMain,
  availableMembersLeadsMain,
  relationOptionsMain = {
    family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother", "Nephew", "Niece", "Stepfather", "Stepmother", "Father-in-law", "Mother-in-law", "Brother-in-law", "Sister-in-law"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance", "Childhood Friend"],
    relationship: ["Partner", "Spouse", "FiancÃ©/FiancÃ©e", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Manager", "Employee", "Business Partner", "Client", "Mentor", "Cofounder"],
    other: ["Neighbor", "Doctor", "Trainer", "Coach", "Teacher", "Therapist", "Roommate"],
  },
  handleAddRelationMain,
  memberRelationsMain,
  handleDeleteRelationMain,
  handleArchiveMemberMain,
  handleUnarchiveMemberMain,
}) => {
  const [activeTab, setActiveTab] = useState(editModalTabMain || "details")
  const [editingRelations, setEditingRelations] = useState(false)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const {countries, loading} = useCountries();
  const specialNoteTextareaRef = useRef(null)
  
  // Local copy of relations for editing (only committed on save)
  const [localRelations, setLocalRelations] = useState(null)
  
  // Local copy of notes for editing (only committed on save)
  const [localNotes, setLocalNotes] = useState([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [expandedNoteId, setExpandedNoteId] = useState(null)
  const [newNote, setNewNote] = useState({
    status: "general",
    text: "",
    isImportant: false,
    startDate: "",
    endDate: "",
  })

  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    customRelation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  // Search state for member/lead search
  const [personSearchQuery, setPersonSearchQuery] = useState("")
  const [showPersonDropdown, setShowPersonDropdown] = useState(false)
  const personSearchRef = useRef(null)

  // Default available members/leads if not provided
  const defaultAvailableMembers = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  const membersLeads = availableMembersLeadsMain?.length > 0 ? availableMembersLeadsMain : defaultAvailableMembers

  useEffect(() => {
    if (isOpen) {
      setActiveTab(editModalTabMain || "details")
    }
  }, [editModalTabMain, isOpen])

  useEffect(() => {
    if (selectedMemberMain && isOpen) {
      // Initialize local notes copy (deep clone)
      // Support both old single note format and new array format
      if (selectedMemberMain.notes && Array.isArray(selectedMemberMain.notes)) {
        setLocalNotes(JSON.parse(JSON.stringify(selectedMemberMain.notes)))
      } else if (selectedMemberMain.note && selectedMemberMain.note.trim()) {
        // Convert old single note to new format
        setLocalNotes([{
          id: Date.now(),
          status: "general",
          text: selectedMemberMain.note,
          isImportant: selectedMemberMain.noteImportance === "important",
          startDate: selectedMemberMain.noteStartDate || "",
          endDate: selectedMemberMain.noteEndDate || "",
          createdAt: selectedMemberMain.joinDate || new Date().toISOString(),
        }])
      } else {
        setLocalNotes([])
      }
      
      // Reset note form
      setIsAddingNote(false)
      setNewNote({
        status: "general",
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      })
      
      // Initialize local relations copy (deep clone)
      if (memberRelationsMain[selectedMemberMain.id]) {
        setLocalRelations(JSON.parse(JSON.stringify(memberRelationsMain[selectedMemberMain.id])))
      } else {
        setLocalRelations({
          family: [],
          friendship: [],
          relationship: [],
          work: [],
          other: [],
        })
      }
    }
  }, [selectedMemberMain, memberRelationsMain, isOpen])

  // Auto-focus special note textarea when note tab is active
  useEffect(() => {
    if (isOpen && activeTab === "note" && specialNoteTextareaRef.current) {
      // Small delay to ensure the modal and tab content are rendered
      setTimeout(() => {
        specialNoteTextareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen, activeTab])

  // Close person dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (personSearchRef.current && !personSearchRef.current.contains(event.target)) {
        setShowPersonDropdown(false)
      }
    }
    
    if (showPersonDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPersonDropdown])

  // Note functions
  const handleAddNote = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newNote.text.trim()) {
      toast.error("Please enter note text")
      return
    }
    
    const note = {
      id: Date.now(),
      status: newNote.status,
      text: newNote.text.trim(),
      isImportant: newNote.isImportant,
      startDate: newNote.startDate || "",
      endDate: newNote.endDate || "",
      createdAt: new Date().toISOString(),
    }
    
    setLocalNotes(prev => [note, ...prev])
    setNewNote({
      status: "general",
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    })
    setIsAddingNote(false)
    toast.success("Note added")
  }
  
  const handleDeleteNote = (noteId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setLocalNotes(prev => prev.filter(n => n.id !== noteId))
    toast.success("Note removed")
  }
  
  const handleEditNoteClick = (note, e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingNoteId(note.id)
    setNewNote({
      status: note.status,
      text: note.text,
      isImportant: note.isImportant,
      startDate: note.startDate || "",
      endDate: note.endDate || "",
    })
    setIsAddingNote(true)
  }
  
  const handleUpdateNote = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newNote.text.trim()) {
      toast.error("Please enter note text")
      return
    }
    
    setLocalNotes(prev => prev.map(n => 
      n.id === editingNoteId 
        ? {
            ...n,
            status: newNote.status,
            text: newNote.text.trim(),
            isImportant: newNote.isImportant,
            startDate: newNote.startDate || "",
            endDate: newNote.endDate || "",
          }
        : n
    ))
    
    setNewNote({
      status: "general",
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    })
    setEditingNoteId(null)
    setIsAddingNote(false)
    toast.success("Note updated")
  }
  
  const getStatusInfo = (statusId) => {
    return NOTE_STATUSES.find(s => s.id === statusId) || NOTE_STATUSES.find(s => s.id === "general")
  }

  const handleAddRelation = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Determine the final relation value
    const finalRelation = newRelation.relation === "custom" 
      ? newRelation.customRelation 
      : newRelation.relation
    
    if (!newRelation.name || !finalRelation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    
    // Update local relations copy (not global state)
    setLocalRelations(prev => {
      const updated = { ...prev }
      if (!updated[newRelation.category]) {
        updated[newRelation.category] = []
      }
      updated[newRelation.category] = [
        ...updated[newRelation.category],
        {
          id: relationId,
          name: newRelation.name,
          relation: finalRelation,
          type: newRelation.type,
        }
      ]
      return updated
    })

    setNewRelation({
      name: "",
      relation: "",
      customRelation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null
    })
    setPersonSearchQuery("")
    toast.success("Relation added")
  }

  const handleDeleteRelation = (category, relationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Update local relations copy (not global state)
    setLocalRelations(prev => ({
      ...prev,
      [category]: prev[category].filter((rel) => rel.id !== relationId)
    }))
    toast.success("Relation removed")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Build notes for the form
    const importantNote = localNotes.find(n => n.isImportant)
    const firstNote = localNotes[0]
    const primaryNote = importantNote || firstNote
    
    // Update form with notes data
    handleInputChangeMain({ target: { name: "notes", value: localNotes } })
    handleInputChangeMain({ target: { name: "note", value: primaryNote ? primaryNote.text : "" } })
    handleInputChangeMain({ target: { name: "noteImportance", value: primaryNote?.isImportant ? "important" : "unimportant" } })
    handleInputChangeMain({ target: { name: "noteStartDate", value: primaryNote?.startDate || "" } })
    handleInputChangeMain({ target: { name: "noteEndDate", value: primaryNote?.endDate || "" } })
    
    // Update relations if they were edited
    if (localRelations && selectedMemberMain?.id && handleAddRelationMain) {
      // This will need to be handled by the parent component
      // For now, we pass the local relations through
    }
    
    handleEditSubmitMain(e, localRelations, localNotes)
  }

  // Handle tab clicks with event stopping
  const handleTabClick = (tabName, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveTab(tabName)
    setEditModalTabMain(tabName)
  }

  // Handle editing relations toggle
  const handleEditingRelationsToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingRelations(!editingRelations)
  }

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  // Image upload handler
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChangeMain({ target: { name: "image", value: reader.result } })
        toast.success("Avatar selected successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  // Camera capture handler
  const handleCameraCapture = (imageData) => {
    handleInputChangeMain({ target: { name: "image", value: imageData } })
    toast.success("Photo captured successfully")
  }

  // Remove image handler
  const handleRemoveImage = () => {
    handleInputChangeMain({ target: { name: "image", value: null } })
  }

  if (!isOpen || !selectedMemberMain) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000010] overflow-y-auto"
    >
      <div 
        className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Member</h2>
          <button onClick={handleCloseClick} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={(e) => handleTabClick("details", e)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "details" 
                ? "text-blue-400 border-b-2 border-blue-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Details
          </button>
          <button 
            onClick={(e) => handleTabClick("note", e)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "note" 
                ? "text-blue-400 border-b-2 border-blue-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Special Notes
          </button>
          <button 
            onClick={(e) => handleTabClick("relations", e)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "relations" 
                ? "text-blue-400 border-b-2 border-blue-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Relations
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">
            {/* Details Tab */}
            {activeTab === "details" && (
              <>
                {/* Avatar Upload */}
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 relative">
                    {editFormMain.image ? (
                      <>
                        <img
                          src={editFormMain.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {/* Remove button on image */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <InitialsAvatar 
                        firstName={editFormMain.firstName} 
                        lastName={editFormMain.lastName} 
                        size="lg"
                      />
                    )}
                  </div>
                  
                  {/* Image action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <label
                      htmlFor="avatar"
                      className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm cursor-pointer text-white flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCameraModal(true)}
                      className="bg-[#2F2F2F] hover:bg-[#3F3F3F] px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2"
                    >
                      <Camera size={16} />
                      Camera
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Personal Information</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        First Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormMain.firstName}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        Last Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormMain.lastName}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Gender</label>
                      <select
                        name="gender"
                        value={editFormMain.gender || ""}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Birthday</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormMain.dateOfBirth || ""}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Email<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormMain.email}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormMain.phone}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          handleInputChangeMain({ target: { name: "phone", value: sanitized } })
                        }}
                        placeholder="+49 123 456789"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Telephone Number</label>
                      <input
                        type="tel"
                        name="telephoneNumber"
                        value={editFormMain.telephoneNumber || ""}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          handleInputChangeMain({ target: { name: "telephoneNumber", value: sanitized } })
                        }}
                        placeholder="030 12345678"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Address</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Street & Number</label>
                    <input
                      type="text"
                      name="street"
                      value={editFormMain.street}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      placeholder="Main Street 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editFormMain.zipCode}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormMain.city}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        placeholder="Berlin"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={editFormMain.country}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2 text-white outline-none"
                    >
                      <option value="">Select a country</option>
                      {loading ? (
                        <option value="" disabled>Loading countries...</option>
                      ) : (
                        countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Additional Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">About</label>
                    <textarea
                      name="about"
                      value={editFormMain.about}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                      placeholder="Enter more details..."
                    />
                  </div>

                  {selectedMemberMain && selectedMemberMain.memberType === "temporary" && (
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Auto-Archive Due Date</label>
                      <input
                        type="date"
                        name="autoArchiveDate"
                        value={editFormMain.autoArchiveDate || ""}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Notes Tab */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                {/* Member Name Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                    <p className="text-white font-medium">{selectedMemberMain?.firstName} {selectedMemberMain?.lastName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isAddingNote) {
                        setEditingNoteId(null)
                        setNewNote({
                          status: "general",
                          text: "",
                          isImportant: false,
                          startDate: "",
                          endDate: "",
                        })
                      }
                      setIsAddingNote(!isAddingNote)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      isAddingNote 
                        ? "bg-gray-600 text-white" 
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {isAddingNote ? (
                      <>Cancel</>
                    ) : (
                      <><Plus size={14} /> Add Note</>
                    )}
                  </button>
                </div>
                
                {/* Add/Edit Note Form */}
                {isAddingNote && (
                  <div className="mb-4 p-4 bg-[#101010] rounded-xl space-y-3">
                    {/* Status Selection */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Status</label>
                      <select
                        value={newNote.status}
                        onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
                        className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {NOTE_STATUSES.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Note Text */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Note</label>
                      <textarea
                        ref={specialNoteTextareaRef}
                        value={newNote.text}
                        onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                        className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[80px]"
                        placeholder="Enter note..."
                      />
                    </div>
                    
                    {/* Important Checkbox */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNote.isImportant}
                          onChange={(e) => setNewNote({ ...newNote, isImportant: e.target.checked })}
                          className="h-4 w-4 accent-blue-500"
                        />
                        <span className="text-sm text-gray-300">Important</span>
                      </label>
                    </div>
                    
                    {/* Optional Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Valid From (optional)</label>
                        <input
                          type="date"
                          value={newNote.startDate}
                          onChange={(e) => setNewNote({ ...newNote, startDate: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 white-calendar-icon"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Valid Until (optional)</label>
                        <input
                          type="date"
                          value={newNote.endDate}
                          onChange={(e) => setNewNote({ ...newNote, endDate: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 white-calendar-icon"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={editingNoteId ? handleUpdateNote : handleAddNote}
                      disabled={!newNote.text.trim()}
                      className={`w-full py-2 rounded-lg text-sm font-medium ${
                        !newNote.text.trim()
                          ? "bg-blue-600/50 text-white/50 cursor-not-allowed"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {editingNoteId ? "Update Note" : "Add Note"}
                    </button>
                  </div>
                )}
                
                {/* Notes List - hidden when adding/editing */}
                {!isAddingNote && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {localNotes.length > 0 ? (
                    [...localNotes]
                      .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                      .map((note) => {
                      const statusInfo = getStatusInfo(note.status)
                      const isExpanded = expandedNoteId === note.id
                      
                      return (
                        <div
                          key={note.id}
                          className="bg-[#101010] rounded-lg overflow-hidden"
                        >
                          {/* Note Header */}
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer"
                            onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                                {statusInfo.label}
                              </span>
                              {note.isImportant && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-red-500">
                                  Important
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditNoteClick(note, e)
                                }}
                                className="text-gray-500 hover:text-blue-400 p-1"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteNote(note.id, e)}
                                className="text-gray-500 hover:text-red-400 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                              {isExpanded ? (
                                <ChevronUp size={16} className="text-gray-400" />
                              ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {/* Preview & Valid Date (always visible when collapsed) */}
                          {!isExpanded && (
                            <div className="px-3 pb-2">
                              <p className="text-gray-400 text-sm truncate">
                                {note.text}
                              </p>
                              {(note.startDate || note.endDate) && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {note.startDate && note.endDate ? (
                                    <>Valid: {note.startDate} - {note.endDate}</>
                                  ) : note.startDate ? (
                                    <>Valid from: {note.startDate}</>
                                  ) : (
                                    <>Valid until: {note.endDate}</>
                                  )}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Note Content (expandable) */}
                          {isExpanded && (
                            <div className="px-3 pb-3 border-t border-gray-800">
                              <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">
                                {note.text}
                              </p>
                              {(note.startDate || note.endDate) && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {note.startDate && note.endDate ? (
                                    <>Valid: {note.startDate} - {note.endDate}</>
                                  ) : note.startDate ? (
                                    <>Valid from: {note.startDate}</>
                                  ) : (
                                    <>Valid until: {note.endDate}</>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-gray-500 text-sm text-center py-8">
                      No special notes yet. Click "Add Note" to create one.
                    </div>
                  )}
                </div>
                )}
              </div>
            )}

            {/* Relations Tab */}
            {activeTab === "relations" && (
              <div className="border border-slate-700 rounded-xl p-4">
                {/* Member Name Header */}
                <div className="mb-4 pb-3 border-b border-slate-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Relations for</p>
                  <p className="text-white font-medium">{selectedMemberMain?.firstName} {selectedMemberMain?.lastName}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={handleEditingRelationsToggle}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {editingRelations ? "Done" : "Add New"}
                  </button>
                </div>

                {editingRelations && (
                  <div className="mb-4 p-4 bg-[#101010] rounded-xl space-y-3">
                    {/* Step 1: Person Selection */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Person</label>
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelation({ ...newRelation, type: "manual", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelation.type === "manual" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Manual Entry
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelation({ ...newRelation, type: "member", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelation.type === "member" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Member
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelation({ ...newRelation, type: "lead", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelation.type === "lead" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Lead
                        </button>
                      </div>

                      {newRelation.type === "manual" ? (
                        <input
                          type="text"
                          placeholder="Enter name..."
                          value={newRelation.name}
                          onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="relative" ref={personSearchRef}>
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={`Search ${newRelation.type}s...`}
                              value={personSearchQuery}
                              onChange={(e) => {
                                setPersonSearchQuery(e.target.value)
                                setShowPersonDropdown(true)
                              }}
                              onFocus={() => setShowPersonDropdown(true)}
                              className="w-full bg-[#222] text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          {newRelation.name && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-gray-400">Selected:</span>
                              <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                {newRelation.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRelation({ ...newRelation, name: "", selectedMemberId: null })
                                    setPersonSearchQuery("")
                                  }}
                                  className="hover:text-white"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            </div>
                          )}
                          {showPersonDropdown && personSearchQuery && (
                            <div className="absolute z-20 w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {membersLeads
                                .filter((p) => 
                                  p.type === newRelation.type && 
                                  p.name.toLowerCase().includes(personSearchQuery.toLowerCase())
                                )
                                .map((person) => (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => {
                                      setNewRelation({
                                        ...newRelation,
                                        selectedMemberId: person.id,
                                        name: person.name,
                                      })
                                      setPersonSearchQuery("")
                                      setShowPersonDropdown(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#222] transition-colors"
                                  >
                                    {person.name}
                                  </button>
                                ))}
                              {membersLeads.filter((p) => 
                                p.type === newRelation.type && 
                                p.name.toLowerCase().includes(personSearchQuery.toLowerCase())
                              ).length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step 2: Category & Relation */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Category</label>
                        <select
                          value={newRelation.category}
                          onChange={(e) => setNewRelation({
                            ...newRelation,
                            category: e.target.value,
                            relation: "",
                            customRelation: ""
                          })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="family">Family</option>
                          <option value="friendship">Friendship</option>
                          <option value="relationship">Relationship</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Relation Type</label>
                        <select
                          value={newRelation.relation}
                          onChange={(e) => setNewRelation({ 
                            ...newRelation, 
                            relation: e.target.value,
                            customRelation: e.target.value === "custom" ? newRelation.customRelation : ""
                          })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {relationOptionsMain[newRelation.category]?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          <option disabled>────────────</option>
                          <option value="custom">Custom...</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom Relation Input */}
                    {newRelation.relation === "custom" && (
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Custom Relation</label>
                        <input
                          type="text"
                          placeholder="Enter custom relation..."
                          value={newRelation.customRelation}
                          onChange={(e) => setNewRelation({ ...newRelation, customRelation: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddRelation}
                      disabled={!newRelation.name || (!newRelation.relation || (newRelation.relation === "custom" && !newRelation.customRelation))}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        !newRelation.name || (!newRelation.relation || (newRelation.relation === "custom" && !newRelation.customRelation))
                          ? "bg-blue-600/50 text-white/50 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Add Relation
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMemberMain && localRelations && 
                    Object.entries(localRelations).map(([category, relations]) =>
                      relations.map((relation) => (
                        <div 
                          key={relation.id} 
                          className="flex items-center justify-between bg-[#101010] rounded-lg px-3 py-2"
                        >
                          <div className="text-sm flex items-center flex-wrap gap-1.5">
                            <span className="text-white font-medium">{relation.name}</span>
                            <span className="text-gray-400">({relation.relation})</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 capitalize">{category}</span>
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded capitalize">
                              {relation.type}
                            </span>
                          </div>
                          {editingRelations && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteRelation(category, relation.id, e)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )),
                    )}

                  {(!localRelations || 
                    Object.values(localRelations || {}).every(arr => arr.length === 0)) && (
                    <div className="text-gray-500 text-sm text-center py-4">
                      No relations added yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with action buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleCloseClick}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>

            {selectedMemberMain && selectedMemberMain.memberType === "temporary" && (
              <button
                type="button"
                onClick={() => {
                  if (selectedMemberMain.isArchived) {
                    handleUnarchiveMemberMain && handleUnarchiveMemberMain(selectedMemberMain.id)
                  } else {
                    handleArchiveMemberMain && handleArchiveMemberMain(selectedMemberMain.id)
                  }
                  onClose()
                }}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-1"
              >
                {selectedMemberMain.isArchived ? (
                  <>
                    <ArchiveRestore size={16} />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={16} />
                    Archive
                  </>
                )}
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 text-sm text-white rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}

export default EditMemberModalMain
