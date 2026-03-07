/* eslint-disable no-unused-vars */
import { X, Users, Trash2, Plus, Search, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { useDispatch, useSelector } from "react-redux"
import { createLeadThunk } from "../../../features/lead/leadSlice"
import { createNoteThunk } from "../../../features/specialNotes/specialNoteSlice"
import { fetchMyStudio } from "../../../features/studio/studioSlice"

/* eslint-disable react/prop-types */

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

// Training Goal Options
const TRAINING_GOALS = [
  { id: "strength", label: "Muscle Building" },
  { id: "cardio", label: "Endurance" },
  { id: "weight_loss", label: "Weight Loss" },
  { id: "back_pain", label: "Back & Posture" },
  { id: "fitness", label: "General Fitness" },
  { id: "energy", label: "More Energy" },
]

const AddLeadModal = ({
  isVisible,
  onClose,
  // onSave,
  availableMembersLeads = [],
  columns = [], // Added columns prop
  relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother", "Nephew", "Niece", "Stepfather", "Stepmother", "Father-in-law", "Mother-in-law", "Brother-in-law", "Sister-in-law"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance", "Childhood Friend"],
    relationship: ["Partner", "Spouse", "Fiancé/Fiancée", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Manager", "Employee", "Business Partner", "Client", "Mentor", "Cofounder"],
    other: ["Neighbor", "Doctor", "Trainer", "Coach", "Teacher", "Therapist", "Roommate"],
  }
}) => {
  const dispatch = useDispatch()
  const { studio } = useSelector((state) => state.studios)

  const [activeTab, setActiveTab] = useState("details")
  const [editingRelations, setEditingRelations] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)
  const [isTrainingGoalDropdownOpen, setIsTrainingGoalDropdownOpen] = useState(false)
  const { countries, loading } = useCountries();

  // Note management state
  const [localNotes, setLocalNotes] = useState([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [expandedNoteId, setExpandedNoteId] = useState(null)
  const [newNote, setNewNote] = useState({
    status: "general",
    note: "",
    isImportant: false,
    valid: { from: null, until: null },
  })

  // Get first non-trial column as default status
  const defaultStatus = columns.find(col => col.id !== "trial")?.id || ""

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telephoneNumber: "",
    column: defaultStatus,
    hasTrialTraining: false,
    gender: "",
    birthday: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    details: "",
    trainingGoal: "",
    relations: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
  }

  const [formData, setFormData] = useState(initialFormData)

  // New relation state
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
      "Email Campaign": "bg-primary-hover text-orange-100",
      "Cold Call (Outbound)": "bg-red-600 text-red-100",
      "Inbound Call": "bg-emerald-600 text-emerald-100",
      Event: "bg-yellow-600 text-yellow-100",
      "Offline Advertising": "bg-pink-600 text-pink-100",
      Other: "bg-surface-button text-content-secondary",
    }
    return sourceColors[source] || "bg-surface-button text-content-secondary"
  }

  // Get status options from columns (exclude trial column)
  const statusOptions = columns.filter(col => col.id !== "trial")

  useEffect(() => {
    dispatch(fetchMyStudio())
  }, [dispatch])



  // add note local
  const handleAddNote = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!newNote.note || !newNote.note.trim()) {
      toast.error("Please enter note text")
      return
    }

    const note = {
      id: Date.now(),
      status: newNote.status,
      note: newNote.note.trim(),
      isImportant: newNote.isImportant,
      valid: {
        from: newNote.valid.from,
        until: newNote.valid.until,
      },
      createdAt: new Date().toISOString(),
    }

    setLocalNotes(prev => [note, ...prev])

    // reset form
    setNewNote({
      status: "general",
      note: "", // reset matches state property
      isImportant: false,
      valid: { from: null, until: null },
    })
    setIsAddingNote(false)
    toast.success("Note added")
  }


  // delete note from local
  const handleDeleteNote = (noteId, e) => {
    e.stopPropagation()

    // Filter out the note using either id or _id
    setLocalNotes(prev => prev.filter(note =>
      (note.id || note._id) !== noteId
    ))

    toast.success("Note deleted")
  }

  const handleEditNoteClick = (note, e) => {
    e.stopPropagation()

    // Handle both id and _id from API
    setEditingNoteId(note.id || note._id)

    // Convert date strings to Date objects if needed
    setNewNote({
      status: note.status || "general",
      note: note.note || "",
      isImportant: note.isImportant || false,
      valid: {
        from: note.valid?.from ? new Date(note.valid.from) : null,
        until: note.valid?.until ? new Date(note.valid.until) : null,
      }
    })

    setIsAddingNote(true)
    setExpandedNoteId(null)
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
          note: newNote.text.trim(),
          isImportant: newNote.isImportant,
          startDate: newNote.startDate || "",
          endDate: newNote.endDate || "",
        }
        : n
    ))

    setNewNote({
      status: "general",
      note: "",
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

  // Email validation function
  const isValidEmail = (email) => {
    if (!email || !email.trim()) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.firstName?.trim()) {
      toast.error("Please enter a first name")
      return
    }

    try {
      const formattedNotes = localNotes.map(note => ({
        status: note.status || "general",
        note: note.note,
        isImportant: note.isImportant || false,
        valid: note.valid?.from || note.valid?.until ? {
          from: note.valid?.from ? new Date(note.valid.from).toISOString() : null,
          until: note.valid?.until ? new Date(note.valid.until).toISOString() : null
        } : null,
      }))

      const leadPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? Number(formData.phone) : undefined,
        telephone: formData.telephoneNumber ? Number(formData.telephoneNumber) : undefined,
        gender: formData.gender || "male",
        dateOfBirth: formData.birthday ? new Date(formData.birthday).toISOString() : undefined,
        city: formData.city,
        street: formData.street,
        zipCode: Number(formData.zipCode),
        country: formData.country,
        source: formData.source || "",
        trainingGoal: formData.trainingGoal || "",
        about: formData.details || "",
        studioId: studio._id,
        notes: formattedNotes,
        column: formData.column
      }

      const createdLead = await dispatch(createLeadThunk(leadPayload)).unwrap()

      // TRANSFORM THE API RESPONSE to match your component's expected structure
      const transformedLead = {
        ...createdLead,
        specialsNotes: createdLead.specialsNotes?.map(note => ({
          id: note._id,  // Map _id to id
          status: note.status,
          note: note.note,
          isImportant: note.isImportant,
          valid: note.valid ? {
            from: note.valid.from ? new Date(note.valid.from) : null,  // Convert string to Date
            until: note.valid.until ? new Date(note.valid.until) : null,  // Convert string to Date
          } : { from: null, until: null },
          createdAt: note.createdAt || new Date().toISOString(),
        })) || []
      }

      // Update your local state with the transformed data
      setLocalNotes(transformedLead.specialsNotes)

      toast.success("Lead created")
      onClose()

    } catch (err) {
      console.error('Failed to create lead:', err)
      toast.error("Failed to create lead")
    }
  }

  // Add relation
  const addRelation = (e) => {
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
    const newRel = {
      id: relationId,
      name: newRelation.name,
      relation: finalRelation,
      type: newRelation.type,
    }

    setFormData(prev => ({
      ...prev,
      relations: {
        ...prev.relations,
        [newRelation.category]: [...prev.relations[newRelation.category], newRel]
      }
    }))

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

  // Remove relation
  const removeRelation = (category, relationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFormData(prev => ({
      ...prev,
      relations: {
        ...prev.relations,
        [category]: prev.relations[category].filter(rel => rel.id !== relationId)
      }
    }))
    toast.success("Relation removed")
  }

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
    setEditingRelations(!editingRelations)
  }

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Reset form data when closing
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      telephoneNumber: "",
      column: defaultStatus,
      hasTrialTraining: false,
      gender: "",
      birthday: "",
      source: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      details: "",
      trainingGoal: "",
      relations: {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      },
    })
    setLocalNotes([])
    setActiveTab("details")
    setEditingRelations(false)
    setIsAddingNote(false)
    setEditingNoteId(null)
    setNewNote({
      status: "general",
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    })
    setNewRelation({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
    })
    onClose()
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1001]"
    >
      <div
        className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md relative max-h-[95vh] md:max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Create Lead</h2>
          <button onClick={handleCloseClick} className="text-content-muted hover:text-content-primary">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={(e) => handleTabClick("details", e)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "details"
              ? "text-primary border-b-2 border-primary"
              : "text-content-muted hover:text-content-primary"
              }`}
          >
            Details
          </button>
          <button
            onClick={(e) => handleTabClick("note", e)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "note"
              ? "text-primary border-b-2 border-primary"
              : "text-content-muted hover:text-content-primary"
              }`}
          >
            Special Notes
          </button>
          <button
            onClick={(e) => handleTabClick("relations", e)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "relations"
              ? "text-primary border-b-2 border-primary"
              : "text-content-muted hover:text-content-primary"
              }`}
          >
            Relations
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {/* Details Tab */}
            {activeTab === "details" && (
              <>
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">
                        First Name<span className="text-accent-red ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">
                        Last Name<span className="text-accent-red ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Gender</label>
                      <CustomSelect
                        name="gender"
                        value={formData.gender || ""}
                        onChange={(e) => updateFormData("gender", e.target.value)}
                        placeholder="Select gender"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Birthday</label>
                      <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                        <span className={formData.birthday ? "text-content-primary" : "text-content-faint"}>{formData.birthday ? (() => { const [y, m, d] = (formData.birthday || "").split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                        <DatePickerField value={formData.birthday || ""} onChange={(val) => updateFormData("birthday", val)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Contact Information</div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">
                      Email<span className="text-accent-red ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          updateFormData("phone", sanitized)
                        }}
                        placeholder="+49 123 456789"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Telephone Number</label>
                      <input
                        type="tel"
                        value={formData.telephoneNumber}
                        onChange={(e) => {
                          // Only allow numbers and + sign
                          const sanitized = e.target.value.replace(/[^0-9+]/g, '')
                          updateFormData("telephoneNumber", sanitized)
                        }}
                        placeholder="030 12345678"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Address</div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">Street & Number</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => updateFormData("street", e.target.value)}
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">Country</label>
                    <CustomSelect
                      name="country"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                      placeholder={loading ? "Loading countries..." : "Select a country"}
                      searchable
                      options={countries.map((country) => ({
                        value: country.name,
                        label: country.name,
                      }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Lead Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Lead Information</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Source</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                          className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary text-sm flex items-center justify-between border border-transparent"
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
                            <div className="absolute z-20 w-full mt-1 bg-surface-card border border-border rounded-xl shadow-lg max-h-60 overflow-auto">
                              {sourceOptions.map(option => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    updateFormData("source", option)
                                    setIsSourceDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-surface-hover text-content-primary text-sm transition-colors"
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
                      <label className="text-sm text-content-secondary block mb-2">Status</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                          className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary text-sm flex items-center justify-between border border-transparent"
                        >
                          <div className="flex items-center gap-2">
                            {formData.column && statusOptions.find(col => col.id === formData.column) && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: statusOptions.find(col => col.id === formData.column).color }}
                              />
                            )}
                            <span>{statusOptions.find(col => col.id === formData.column)?.title || 'Select Status'}</span>
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
                            <div className="absolute z-20 w-full mt-1 bg-surface-card border border-border rounded-xl shadow-lg max-h-60 overflow-auto">
                              {statusOptions.map(column => (
                                <button
                                  key={column.id}
                                  type="button"
                                  onClick={() => {
                                    updateFormData("status", column.id)
                                    setIsStatusDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-surface-hover text-content-primary text-sm flex items-center gap-3 transition-colors"
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
                    <label className="text-sm text-content-secondary block mb-2">Training Goal</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsTrainingGoalDropdownOpen(!isTrainingGoalDropdownOpen)}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary text-sm flex items-center justify-between border border-transparent"
                      >
                        <span>{TRAINING_GOALS.find(g => g.id === formData.trainingGoal)?.label || 'Select Training Goal'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${isTrainingGoalDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isTrainingGoalDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsTrainingGoalDropdownOpen(false)}
                          />
                          <div className="absolute z-20 w-full mt-1 bg-surface-card border border-border rounded-xl shadow-lg max-h-60 overflow-auto">
                            <button
                              type="button"
                              onClick={() => {
                                updateFormData("trainingGoal", "")
                                setIsTrainingGoalDropdownOpen(false)
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-surface-hover text-content-faint text-sm transition-colors"
                            >
                              No Goal Selected
                            </button>
                            {TRAINING_GOALS.map(goal => (
                              <button
                                key={goal.id}
                                type="button"
                                onClick={() => {
                                  updateFormData("trainingGoal", goal.id)
                                  setIsTrainingGoalDropdownOpen(false)
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-surface-hover text-content-primary text-sm transition-colors"
                              >
                                {goal.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">About</label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => updateFormData("details", e.target.value)}
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm resize-none min-h-[100px] border border-transparent focus:border-primary transition-colors"
                      placeholder="Enter more details..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Notes Tab */}
            {/* Notes List - hidden when adding/editing */}
            {/* Notes Tab */}

            {activeTab === "note" && (
              <div className="border border-border rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div>
                    <p className="text-xs text-content-muted uppercase tracking-wider">Special Notes for</p>
                    <p className="text-content-primary font-medium">
                      {formData.firstName || "New"} {formData.lastName || "Member"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isAddingNote) {
                        setEditingNoteId(null)
                        setNewNote({
                          status: "general",
                          note: "",
                          isImportant: false,
                          valid: {
                            start: null,
                            end: null
                          }
                        })
                      }
                      setIsAddingNote(!isAddingNote)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${isAddingNote ? "bg-surface-button text-content-primary" : "bg-primary text-white"
                      }`}
                  >
                    {isAddingNote ? <>Cancel</> : <><Plus size={14} /> Add Note</>}
                  </button>
                </div>

                {/* Add/Edit Note Form */}
                {isAddingNote && (
                  <div className="mb-4 p-4 border border-border rounded-xl space-y-3">
                    {/* Status Selection */}
                    <div>
                      <label className="text-xs text-content-muted block mb-1.5">Status</label>
                      <select
                        name="noteStatus"
                        value={newNote.status}
                        onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
                        className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
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
                      <label className="text-xs text-content-muted block mb-1.5">Note</label>
                      <textarea
                        // ref={specialNoteTextareaRef}
                        value={newNote.note}
                        onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                        className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none resize-none min-h-[80px] border border-transparent focus:border-primary transition-colors"
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
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="text-sm text-content-secondary">Important</span>
                      </label>
                    </div>

                    {/* Optional Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Valid From (optional)</label>
                        <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                          <span className={newNote.startDate ? "text-content-primary" : "text-content-faint"}>{newNote.startDate ? (() => { const [y, m, d] = newNote.startDate.split('-'); return `${d}.${m}.${y}` })() : "Select"}</span>
                          <DatePickerField value={newNote.startDate} onChange={(val) => setNewNote({ ...newNote, startDate: val })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Valid Until (optional)</label>
                        <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                          <span className={newNote.endDate ? "text-content-primary" : "text-content-faint"}>{newNote.endDate ? (() => { const [y, m, d] = newNote.endDate.split('-'); return `${d}.${m}.${y}` })() : "Select"}</span>
                          <DatePickerField value={newNote.endDate} onChange={(val) => setNewNote({ ...newNote, endDate: val })} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={editingNoteId ? handleUpdateNote : handleAddNote}
                      disabled={!newNote.note.trim()}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${!newNote.note.trim()
                        ? "bg-primary/50 text-white/50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover text-white"
                        }`}
                    >
                      {editingNoteId ? "Update Note" : "Add Note"}
                    </button>
                  </div>
                )}

                {/* Notes List */}
                {/* Notes Tab */}
                {!isAddingNote && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {localNotes.length > 0 ? (
                      [...localNotes]
                        .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                        .map((note) => {
                          const statusInfo = getStatusInfo(note.status)
                          const isExpanded = expandedNoteId === (note.id || note._id)

                          // SAFELY handle dates - convert to Date objects only once
                          const fromDate = note.valid?.from ? new Date(note.valid.from) : null
                          const untilDate = note.valid?.until ? new Date(note.valid.until) : null

                          // Check if dates are valid
                          const isValidFrom = fromDate && !isNaN(fromDate.getTime())
                          const isValidUntil = untilDate && !isNaN(untilDate.getTime())

                          return (
                            <div
                              key={note.id || note._id}
                              className="bg-surface-dark rounded-lg overflow-hidden"
                            >
                              {/* Note Header */}
                              <div
                                className="flex items-center justify-between p-3 cursor-pointer"
                                onClick={() => setExpandedNoteId(isExpanded ? null : (note.id || note._id))}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-xs font-medium px-2 py-0.5 rounded border border-border text-content-secondary">
                                    {statusInfo.label}
                                  </span>
                                  {note.isImportant && (
                                    <span className="text-xs font-medium px-2 py-0.5 rounded border border-accent-red/30 text-accent-red">
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
                                    className="text-content-faint hover:text-primary p-1"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteNote(note.id || note._id, e)}
                                    className="text-content-faint hover:text-red-400 p-1"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  {isExpanded ? (
                                    <ChevronUp size={16} className="text-content-muted" />
                                  ) : (
                                    <ChevronDown size={16} className="text-content-muted" />
                                  )}
                                </div>
                              </div>

                              {/* Preview & Valid Date (always visible when collapsed) */}
                              {!isExpanded && (
                                <div className="px-3 pb-2">
                                  <p className="text-content-muted text-sm truncate">
                                    {note.note}
                                  </p>
                                  {(isValidFrom || isValidUntil) && (
                                    <p className="text-xs text-content-faint mt-1">
                                      {isValidFrom && isValidUntil ? (
                                        <>Valid: {fromDate.toLocaleDateString()} - {untilDate.toLocaleDateString()}</>
                                      ) : isValidFrom ? (
                                        <>Valid from: {fromDate.toLocaleDateString()}</>
                                      ) : isValidUntil ? (
                                        <>Valid until: {untilDate.toLocaleDateString()}</>
                                      ) : null}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Note Content (expandable) */}
                              {isExpanded && (
                                <div className="px-3 pb-3 border-t border-border-subtle">
                                  <p className="text-content-primary text-sm mt-2 whitespace-pre-wrap break-words">
                                    {note.note}
                                  </p>
                                  {(isValidFrom || isValidUntil) && (
                                    <p className="text-xs text-content-faint mt-1">
                                      {isValidFrom && isValidUntil ? (
                                        <>Valid: {fromDate.toLocaleDateString()} - {untilDate.toLocaleDateString()}</>
                                      ) : isValidFrom ? (
                                        <>Valid from: {fromDate.toLocaleDateString()}</>
                                      ) : isValidUntil ? (
                                        <>Valid until: {untilDate.toLocaleDateString()}</>
                                      ) : null}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })
                    ) : (
                      <div className="text-content-faint text-sm text-center py-8">
                        No special notes yet. Click "Add Note" to create one.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Relations Tab */}
            {activeTab === "relations" && (
              <div className="border border-border rounded-xl p-4">
                {/* Lead Name Header */}
                <div className="mb-4 pb-3 border-b border-border">
                  <p className="text-xs text-content-muted uppercase tracking-wider">Relations for</p>
                  <p className="text-content-primary font-medium">
                    {formData.firstName || formData.lastName
                      ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
                      : <span className="text-content-faint italic">New Lead</span>}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-content-secondary font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={handleEditingRelationsToggle}
                    className="text-sm text-primary hover:text-blue-300"
                  >
                    {editingRelations ? "Done" : "Add New"}
                  </button>
                </div>

                {editingRelations && (
                  <div className="mb-4 p-4 border border-border rounded-xl space-y-3">
                    {/* Step 1: Person Selection */}
                    <div>
                      <label className="text-xs text-content-muted block mb-1.5">Person</label>
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelation({ ...newRelation, type: "manual", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelation.type === "manual"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelation.type === "member"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelation.type === "lead"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                        />
                      ) : (
                        <div className="relative" ref={personSearchRef}>
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                            <input
                              type="text"
                              placeholder={`Search ${newRelation.type}s...`}
                              value={personSearchQuery}
                              onChange={(e) => {
                                setPersonSearchQuery(e.target.value)
                                setShowPersonDropdown(true)
                              }}
                              onFocus={() => setShowPersonDropdown(true)}
                              className="w-full bg-surface-dark text-content-primary rounded-xl pl-9 pr-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                            />
                          </div>
                          {newRelation.name && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-content-muted">Selected:</span>
                              <span className="bg-blue-600/20 text-primary text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                {newRelation.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRelation({ ...newRelation, name: "", selectedMemberId: null })
                                    setPersonSearchQuery("")
                                  }}
                                  className="hover:text-content-primary"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            </div>
                          )}
                          {showPersonDropdown && personSearchQuery && (
                            <div className="absolute z-20 w-full mt-1 bg-surface-hover border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {availableMembersLeads
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
                                    className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-hover transition-colors"
                                  >
                                    {person.name}
                                  </button>
                                ))}
                              {availableMembersLeads.filter((p) =>
                                p.type === newRelation.type &&
                                p.name.toLowerCase().includes(personSearchQuery.toLowerCase())
                              ).length === 0 && (
                                  <div className="px-3 py-2 text-sm text-content-faint">No results found</div>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step 2: Category & Relation */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Category</label>
                        <CustomSelect
                          name="category"
                          value={newRelation.category}
                          onChange={(e) => setNewRelation({
                            ...newRelation,
                            category: e.target.value,
                            relation: "",
                            customRelation: ""
                          })}
                          options={[
                            { value: "family", label: "Family" },
                            { value: "friendship", label: "Friendship" },
                            { value: "relationship", label: "Relationship" },
                            { value: "work", label: "Work" },
                            { value: "other", label: "Other" },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Relation Type</label>
                        <CustomSelect
                          name="relationType"
                          value={newRelation.relation}
                          onChange={(e) => setNewRelation({
                            ...newRelation,
                            relation: e.target.value,
                            customRelation: e.target.value === "custom" ? newRelation.customRelation : ""
                          })}
                          placeholder="Select..."
                          options={[
                            ...(relationOptions[newRelation.category]?.map((option) => ({
                              value: option, label: option
                            })) || []),
                            { value: "custom", label: "Custom..." },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Custom Relation Input */}
                    {newRelation.relation === "custom" && (
                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Custom Relation</label>
                        <input
                          type="text"
                          placeholder="Enter custom relation..."
                          value={newRelation.customRelation}
                          onChange={(e) => setNewRelation({ ...newRelation, customRelation: e.target.value })}
                          className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addRelation}
                      disabled={!newRelation.name || (!newRelation.relation || (newRelation.relation === "custom" && !newRelation.customRelation))}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${!newRelation.name || (!newRelation.relation || (newRelation.relation === "custom" && !newRelation.customRelation))
                        ? "bg-primary/50 text-white/50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover text-white"
                        }`}
                    >
                      Add Relation
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(formData.relations).map(([category, relations]) =>
                    relations.map((relation) => (
                      <div
                        key={relation.id}
                        className="flex items-center justify-between bg-surface-dark rounded-lg px-3 py-2"
                      >
                        <div className="text-sm flex items-center flex-wrap gap-1.5">
                          <span className="text-content-primary font-medium">{relation.name}</span>
                          <span className="text-content-muted">({relation.relation})</span>
                          <span className="text-content-faint">•</span>
                          <span className="text-content-muted capitalize">{category}</span>
                          <span className="bg-surface-button text-content-secondary text-xs px-2 py-0.5 rounded capitalize">
                            {relation.type}
                          </span>
                        </div>
                        {editingRelations && (
                          <button
                            type="button"
                            onClick={(e) => removeRelation(category, relation.id, e)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )),
                  )}

                  {Object.values(formData.relations).every(arr => arr.length === 0) && (
                    <div className="text-content-faint text-sm text-center py-4">
                      No relations added yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with action buttons */}
          <div className="flex justify-end gap-2 pt-4 mt-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleCloseClick}
              className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)}
              className={`px-4 py-2 text-sm text-white rounded-xl flex items-center gap-2 transition-colors ${!formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)
                ? "bg-primary/50 cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary-hover"
                }`}
            >
              <Plus size={16} />
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLeadModal
