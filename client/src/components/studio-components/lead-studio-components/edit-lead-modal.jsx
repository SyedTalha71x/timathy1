/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Trash2, X, Search, Plus, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"

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

const EditLeadModal = ({
  isVisible,
  onClose,
  onSave,
  leadData,
  memberRelationsLead,
  setMemberRelationsLead,
  availableMembersLeads = [],
  columns = [], // Added columns prop
  relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother", "Nephew", "Niece", "Stepfather", "Stepmother", "Father-in-law", "Mother-in-law", "Brother-in-law", "Sister-in-law"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance", "Childhood Friend"],
    relationship: ["Partner", "Spouse", "Fiancé/Fiancée", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Manager", "Employee", "Business Partner", "Client", "Mentor", "Cofounder"],
    other: ["Neighbor", "Doctor", "Trainer", "Coach", "Teacher", "Therapist", "Roommate"],
  },
  initialTab = "details"
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [editingRelationsLead, setEditingRelationsLead] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)
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
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telephoneNumber: "",
    status: "",
    hasTrialTraining: false,
    gender: "",
    birthday: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    details: "",
  })

  const [newRelationLead, setNewRelationLead] = useState({
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

  const sourceOptions = [
    "Website",
    "Google Ads",
    "Social Media Ads",
    "Email Campaign",
    "Cold Call (Outbound)",
    "Inbound Call",
    "Event",
    "Offline Advertising",
    "Other",
  ]

  const getSourceColor = (source) => {
    const sourceColors = {
      Website: "bg-blue-600 text-blue-100",
      "Google Ads": "bg-green-600 text-green-100",
      "Social Media Ads": "bg-purple-600 text-purple-100",
      "Email Campaign": "bg-orange-600 text-orange-100",
      "Cold Call (Outbound)": "bg-red-600 text-red-100",
      "Inbound Call": "bg-emerald-600 text-emerald-100",
      Event: "bg-yellow-600 text-yellow-100",
      "Offline Advertising": "bg-pink-600 text-pink-100",
      Other: "bg-gray-600 text-gray-100",
    }
    return sourceColors[source] || "bg-gray-600 text-gray-100"
  }

  // Get status options from columns (exclude trial column)
  const statusOptions = columns.filter(col => col.id !== "trial")

  // Default available members/leads if not provided
  const defaultAvailableMembers = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  const membersLeads = availableMembersLeads.length > 0 ? availableMembersLeads : defaultAvailableMembers

  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialTab)
    }
  }, [initialTab, isVisible])

  useEffect(() => {
    if (leadData) {
      setFormData({
        firstName: leadData.firstName || "",
        lastName: leadData.surname || "",
        email: leadData.email || "",
        phone: leadData.phoneNumber || "",
        telephoneNumber: leadData.telephoneNumber || "",
        status: leadData.status || "",
        hasTrialTraining: leadData.hasTrialTraining || false,
        source: leadData.leadSource || "",
        gender: leadData.gender || "",
        birthday: leadData.birthday || "",
        street: leadData.street || "",
        zipCode: leadData.zipCode || "",
        city: leadData.city || "",
        country: leadData.country || "",
        details: leadData.details || "",
      })
      
      // Initialize local notes copy (deep clone)
      // Support both old single note format and new array format
      if (leadData.notes && Array.isArray(leadData.notes)) {
        setLocalNotes(JSON.parse(JSON.stringify(leadData.notes)))
      } else if (leadData.specialNote && leadData.specialNote.text) {
        // Convert old single note to new format
        setLocalNotes([{
          id: Date.now(),
          status: "general",
          text: leadData.specialNote.text,
          isImportant: leadData.specialNote.isImportant || false,
          startDate: leadData.specialNote.startDate || "",
          endDate: leadData.specialNote.endDate || "",
          createdAt: leadData.createdAt || new Date().toISOString(),
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
      if (memberRelationsLead[leadData.id]) {
        setLocalRelations(JSON.parse(JSON.stringify(memberRelationsLead[leadData.id])))
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
  }, [leadData, memberRelationsLead])

  // Auto-focus special note textarea when note tab is active
  useEffect(() => {
    if (isVisible && activeTab === "note" && specialNoteTextareaRef.current) {
      // Small delay to ensure the modal and tab content are rendered
      setTimeout(() => {
        specialNoteTextareaRef.current?.focus()
      }, 100)
    }
  }, [isVisible, activeTab])

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
  
  const formatNoteDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleAddRelationLead = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Determine the final relation value
    const finalRelation = newRelationLead.relation === "custom" 
      ? newRelationLead.customRelation 
      : newRelationLead.relation
    
    if (!newRelationLead.name || !finalRelation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    
    // Update local relations copy (not global state)
    setLocalRelations(prev => {
      const updated = { ...prev }
      if (!updated[newRelationLead.category]) {
        updated[newRelationLead.category] = []
      }
      updated[newRelationLead.category] = [
        ...updated[newRelationLead.category],
        {
          id: relationId,
          name: newRelationLead.name,
          relation: finalRelation,
          type: newRelationLead.type,
        }
      ]
      return updated
    })

    setNewRelationLead({
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

  const handleDeleteRelationLead = (category, relationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Update local relations copy (not global state)
    setLocalRelations(prev => ({
      ...prev,
      [category]: prev[category].filter((rel) => rel.id !== relationId)
    }))
    toast.success("Relation removed")
  }

  // Email validation function
  const isValidEmail = (email) => {
    if (!email || !email.trim()) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate required fields
    if (!formData.firstName?.trim()) {
      toast.error("Please enter a first name")
      return
    }
    if (!formData.lastName?.trim()) {
      toast.error("Please enter a last name")
      return
    }
    if (!formData.email?.trim()) {
      toast.error("Please enter an email address")
      return
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }
    
    // Validate birthday (must be at least 10 years old)
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()
      
      // Calculate exact age
      const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
      
      if (exactAge < 10) {
        toast.error("Invalid birth date")
        return
      }
      
      // Check if birthdate is in the future
      if (birthDate > today) {
        toast.error("Invalid birth date")
        return
      }
    }
    
    // Commit local relations to global state on save
    if (localRelations && leadData?.id) {
      const updatedRelations = { ...memberRelationsLead }
      updatedRelations[leadData.id] = localRelations
      setMemberRelationsLead(updatedRelations)
    }
    
    // Build specialNote from first important note or first note for backwards compatibility
    const importantNote = localNotes.find(n => n.isImportant)
    const firstNote = localNotes[0]
    const primaryNote = importantNote || firstNote
    
    onSave({
      ...formData,
      id: leadData.id,
      surname: formData.lastName,
      phoneNumber: formData.phone,
      telephoneNumber: formData.telephoneNumber,
      notes: localNotes,
      // Keep specialNote for backwards compatibility
      specialNote: primaryNote ? {
        text: primaryNote.text,
        isImportant: primaryNote.isImportant,
        startDate: primaryNote.startDate,
        endDate: primaryNote.endDate,
      } : null,
    })
    onClose()
  }

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  // Handle tab clicks with event stopping
  const handleTabClick = (tabName, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveTab(tabName)
  }

  // Handle editing relations toggle
  const handleEditingRelationsToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingRelationsLead(!editingRelationsLead)
  }

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  if (!isVisible || !leadData) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000002] overflow-y-auto"
    >
      <div 
        className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Lead</h2>
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
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
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
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
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
                        value={formData.gender || ""}
                        onChange={(e) => updateFormData("gender", e.target.value)}
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
                        value={formData.birthday}
                        onChange={(e) => updateFormData("birthday", e.target.value)}
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
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          updateFormData("phone", sanitized)
                        }}
                        placeholder="+49 123 456789"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Telephone Number</label>
                      <input
                        type="tel"
                        value={formData.telephoneNumber}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          updateFormData("telephoneNumber", sanitized)
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
                      value={formData.street}
                      onChange={(e) => updateFormData("street", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
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

                {/* Lead Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Lead Information</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Source</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                          className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white text-sm flex items-center justify-between"
                        >
                          {formData.source ? (
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getSourceColor(formData.source)}`}>
                              {formData.source}
                            </span>
                          ) : (
                            <span>Select Source</span>
                          )}
                          <svg
                            className={`w-4 h-4 transition-transform ${isSourceDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isSourceDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsSourceDropdownOpen(false)}
                            />
                            <div className="absolute z-20 w-full mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
                              {sourceOptions.map(option => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    updateFormData("source", option)
                                    setIsSourceDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-800 text-white text-sm transition-colors"
                                >
                                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getSourceColor(option)}`}>
                                    {option}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Status</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                          className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white text-sm flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {formData.status && statusOptions.find(col => col.id === formData.status) && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: statusOptions.find(col => col.id === formData.status).color }}
                              />
                            )}
                            <span>{statusOptions.find(col => col.id === formData.status)?.title || 'Select Status'}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isStatusDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsStatusDropdownOpen(false)}
                            />
                            <div className="absolute z-20 w-full mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
                              {statusOptions.map(column => (
                                <button
                                  key={column.id}
                                  type="button"
                                  onClick={() => {
                                    updateFormData("status", column.id)
                                    setIsStatusDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-800 text-white text-sm flex items-center gap-3 transition-colors"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: column.color }}
                                  />
                                  <span>{column.title}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">About</label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => updateFormData("details", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                      placeholder="Enter more details..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Notes Tab */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                {/* Lead Name Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                    <p className="text-white font-medium">{leadData?.firstName} {leadData?.surname}</p>
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
                {/* Lead Name Header */}
                <div className="mb-4 pb-3 border-b border-slate-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Relations for</p>
                  <p className="text-white font-medium">{leadData?.firstName} {leadData?.surname}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={handleEditingRelationsToggle}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {editingRelationsLead ? "Done" : "Add New"}
                  </button>
                </div>

                {editingRelationsLead && (
                  <div className="mb-4 p-4 bg-[#101010] rounded-xl space-y-3">
                    {/* Step 1: Person Selection */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Person</label>
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelationLead({ ...newRelationLead, type: "manual", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelationLead.type === "manual" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Manual Entry
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelationLead({ ...newRelationLead, type: "member", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelationLead.type === "member" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Member
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelationLead({ ...newRelationLead, type: "lead", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            newRelationLead.type === "lead" 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#222] text-gray-400 hover:text-white"
                          }`}
                        >
                          Lead
                        </button>
                      </div>

                      {newRelationLead.type === "manual" ? (
                        <input
                          type="text"
                          placeholder="Enter name..."
                          value={newRelationLead.name}
                          onChange={(e) => setNewRelationLead({ ...newRelationLead, name: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="relative" ref={personSearchRef}>
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={`Search ${newRelationLead.type}s...`}
                              value={personSearchQuery}
                              onChange={(e) => {
                                setPersonSearchQuery(e.target.value)
                                setShowPersonDropdown(true)
                              }}
                              onFocus={() => setShowPersonDropdown(true)}
                              className="w-full bg-[#222] text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          {newRelationLead.name && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-gray-400">Selected:</span>
                              <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                {newRelationLead.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRelationLead({ ...newRelationLead, name: "", selectedMemberId: null })
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
                                  p.type === newRelationLead.type && 
                                  p.name.toLowerCase().includes(personSearchQuery.toLowerCase())
                                )
                                .map((person) => (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => {
                                      setNewRelationLead({
                                        ...newRelationLead,
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
                                p.type === newRelationLead.type && 
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
                          value={newRelationLead.category}
                          onChange={(e) => setNewRelationLead({
                            ...newRelationLead,
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
                          value={newRelationLead.relation}
                          onChange={(e) => setNewRelationLead({ 
                            ...newRelationLead, 
                            relation: e.target.value,
                            customRelation: e.target.value === "custom" ? newRelationLead.customRelation : ""
                          })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {relationOptions[newRelationLead.category]?.map((option) => (
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
                    {newRelationLead.relation === "custom" && (
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Custom Relation</label>
                        <input
                          type="text"
                          placeholder="Enter custom relation..."
                          value={newRelationLead.customRelation}
                          onChange={(e) => setNewRelationLead({ ...newRelationLead, customRelation: e.target.value })}
                          className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddRelationLead}
                      disabled={!newRelationLead.name || (!newRelationLead.relation || (newRelationLead.relation === "custom" && !newRelationLead.customRelation))}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        !newRelationLead.name || (!newRelationLead.relation || (newRelationLead.relation === "custom" && !newRelationLead.customRelation))
                          ? "bg-blue-600/50 text-white/50 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Add Relation
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {leadData && localRelations && 
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
                          {editingRelationsLead && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteRelationLead(category, relation.id, e)}
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
            <button
              type="submit"
              disabled={!formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)}
              className={`px-4 py-2 text-sm text-white rounded-xl transition-colors ${
                !formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)
                  ? "bg-orange-500/50 cursor-not-allowed opacity-50"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLeadModal
