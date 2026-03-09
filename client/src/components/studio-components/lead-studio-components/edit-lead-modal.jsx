/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Trash2, X, Search, Plus, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllMember } from "../../../features/member/memberSlice"
import { fetchAllLeadsThunk, updateLeadByStaffThunk } from "../../../features/lead/leadSlice"

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

const EditLeadModal = ({
  isVisible,
  onClose,
  onSave,
  leadData,
  memberRelationsLead,
  setMemberRelationsLead,
  // availableMembersLeads = [],
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
  const dispatch = useDispatch()
  // useSelector 
  const { members } = useSelector((state) => state.member)
  const { leads } = useSelector((state) => state.leads)

  // ==============================
  //  dispatch all member and leads
  // ==============================
  useEffect(() => {
    dispatch(fetchAllMember())
    dispatch(fetchAllLeadsThunk())
  }, [dispatch])





  const [activeTab, setActiveTab] = useState(initialTab)
  const [editingRelationsLead, setEditingRelationsLead] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)
  const [isTrainingGoalDropdownOpen, setIsTrainingGoalDropdownOpen] = useState(false)
  const { countries, loading } = useCountries();
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
    trainingGoal: "",
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

  // Default available members/leads if not provided
  const defaultAvailableMembers = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  // const membersLeads = availableMembersLeads.length > 0 ? availableMembersLeads : defaultAvailableMembers

  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialTab)
    }
  }, [initialTab, isVisible])

  useEffect(() => {
    if (leadData) {
      setFormData({
        firstName: leadData.firstName || "",
        lastName: leadData.lastName || "",
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
        trainingGoal: leadData.trainingGoal || "",

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
          note: leadData.specialNote.text,
          isImportant: leadData.specialNote.isImportant || false,
          startDate: leadData.specialNote.startDate || "",
          endDate: leadData.specialNote.endDate || "",
          createdAt: leadData.createdAt || new Date().toISOString(),
        }])
      } else {
        setLocalNotes([])
      }
      if (leadData.relations && Array.isArray(leadData.relations)) {
        setLocalRelations(JSON.parse(JSON.stringify(leadData.relations)))
      } else if (leadData.relations && leadData.relations.category) {
        // Convert old single note to new format
        setLocalRelations([{
          id: Date.now(),
          status: "general",
          note: leadData.specialNote.text,
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
  const handleAddNote = () => {
    if (!newNote.note?.trim()) {
      toast.error("Please enter note text")
      return
    }

    const note = {
      id: Date.now(),
      status: newNote.status || "general",
      note: newNote.note.trim(),
      isImportant: newNote.isImportant,
      valid: {
        from: newNote.startDate ? new Date(newNote.startDate) : null,
        until: newNote.endDate ? new Date(newNote.endDate) : null,
      },
      createdAt: new Date().toISOString(),
    }

    setLocalNotes(prev => [note, ...prev])

    setNewNote({
      status: "general",
      note: "",
      isImportant: false,
      startDate: null,
      endDate: null,
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
      note: note.text,
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

  // const handleAddRelationLead = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   // Determine the final relation value
  //   const finalRelation = newRelationLead.relation === "custom" 
  //     ? newRelationLead.customRelation 
  //     : newRelationLead.relation

  //   if (!newRelationLead.name || !finalRelation) {
  //     toast.error("Please fill in all fields")
  //     return
  //   }

  //   const relationId = Date.now()

  //   // Update local relations copy (not global state)
  //   setLocalRelations(prev => {
  //     const updated = { ...prev }
  //     if (!updated[newRelationLead.category]) {
  //       updated[newRelationLead.category] = []
  //     }
  //     updated[newRelationLead.category] = [
  //       ...updated[newRelationLead.category],
  //       {
  //         id: relationId,
  //         name: newRelationLead.name,
  //         relation: finalRelation,
  //         type: newRelationLead.type,
  //       }
  //     ]
  //     return updated
  //   })

  //   setNewRelationLead({
  //     name: "",
  //     relation: "",
  //     customRelation: "",
  //     category: "family",
  //     type: "manual",
  //     selectedMemberId: null
  //   })
  //   setPersonSearchQuery("")
  //   toast.success("Relation added")
  // }

  const handleAddRelationLead = async (e) => {
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

    const relation = {
      id: Date.now(),
      entryType: newRelationLead.type || "manual",
      name: newRelationLead.name,
      // Store both formats - one for display, one for backend
      relation: finalRelation, // For display in UI
      relationType: finalRelation, // For backend
      customRelation: newRelationLead.relation === "custom" ? newRelationLead.customRelation : null,
      category: newRelationLead.category,
      memberId: newRelationLead.selectedMemberId?._id || newRelationLead.selectedMemberId || null,
      leadId: null,
    }

    console.log('Adding relation:', relation)

    // Update the object structure
    setLocalRelations(prev => ({
      ...prev,
      [newRelationLead.category]: [...(prev[newRelationLead.category] || []), relation]
    }))

    setNewRelationLead({
      name: "",
      relation: "",
      customRelation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
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

    // Validate birthday
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()

      const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

      if (exactAge < 10) {
        toast.error("Invalid birth date")
        return
      }

      if (birthDate > today) {
        toast.error("Invalid birth date")
        return
      }
    }

    // Get the correct lead ID
    const leadId = leadData?._id || leadData?.id

    // ===== FIXED: Prepare relations for backend =====
    // Convert the categorized relations object to an array format expected by backend
    let relationsArray = []

    if (localRelations) {
      Object.entries(localRelations).forEach(([category, relations]) => {
        if (Array.isArray(relations)) {
          relations.forEach(rel => {
            relationsArray.push({
              entryType: rel.entryType || rel.type || "manual",
              name: rel.name || "",
              leadId: rel.leadId || null,
              memberId: rel.memberId || null,
              category: category,
              relationType: rel.relationType || rel.relation || "", // Use relationType for backend
              customRelation: rel.customRelation || null
            })
          })
        }
      })
    }

    // console.log('Relations array for backend:', relationsArray)

    // Prepare notes for backend
    const specialsNotes = localNotes.map(note => ({
      status: note.status || "general",
      note: note.note,
      isImportant: note.isImportant || false,
      valid: note.valid?.from || note.valid?.until
        ? {
          from: note.valid.from ? new Date(note.valid.from).toISOString() : null,
          until: note.valid.until ? new Date(note.valid.until).toISOString() : null,
        }
        : null,
    }))

    // Prepare data for onSave (frontend format with both display and backend formats)
    const saveData = {
      ...formData,
      id: leadId,
      _id: leadId,
      surname: formData.lastName,
      phoneNumber: formData.phone,
      telephoneNumber: formData.telephoneNumber,
      // Keep original format for UI state updates
      relations: localRelations,
      // Add converted format for backend
      relationsArray: relationsArray,
      // notes: localNotes,
      specialsNotes: specialsNotes,
    }

    // console.log('Saving data:', saveData)

    // Call the onSave prop
    onSave(saveData)



    // Update local relations in parent state
    if (localRelations && leadId) {
      const updatedRelations = { ...memberRelationsLead }
      updatedRelations[leadId] = localRelations
      setMemberRelationsLead(updatedRelations)
    }

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


// Member filter and Led Filter for search query
  const filteredMembers = members && Array.isArray(members)
    ? members.filter((p) => {
      if (!p) return false
      const firstName = p.firstName || ''
      const lastName = p.lastName || ''
      const fullName = `${firstName} ${lastName}`.toLowerCase().trim()
      return fullName.includes(personSearchQuery.toLowerCase())
    })
    : []

  const filteredLeads = leads && Array.isArray(leads)
    ? leads.filter((p) => {
      if (!p) return false
      const firstName = p.firstName || ''
      const lastName = p.lastName || ''
      const fullName = `${firstName} ${lastName}`.toLowerCase().trim()
      return fullName.includes(personSearchQuery.toLowerCase())
    })
    : []

  if (!isVisible || !leadData) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1001]"
    >
      <div
        className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Edit Lead</h2>
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
            {activeTab === "note" && (
              <div className="border border-border rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div>
                    <p className="text-xs text-content-muted uppercase tracking-wider">Special Notes for</p>
                    <p className="text-content-primary font-medium">
                      {leadData.firstName || "New"} {leadData.lastName || "Member"}
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
                            from: null,
                            until: null
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
                        ref={specialNoteTextareaRef}
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
                      disabled={!newNote.note}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${!newNote.note}
                        ? "bg-surface-button text-content-primary text-white/50 cursor-not-allowed"
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
                                  {(note.valid.from || note.valid.until) && (
                                    <p className="text-xs text-content-faint mt-1">
                                      {note.valid.from && note.valid.until ? (
                                        <>Valid: {new Date(note.valid.from).toLocaleDateString()} - {new Date(note.valid.until).toLocaleDateString()}</>
                                      ) : note.valid.from ? (
                                        <>Valid from: {new Date(note.valid.from).toLocaleDateString()}</>
                                      ) : note.valid.until ? (
                                        <>Valid until: {new Date(note.valid.until).toLocaleDateString()}</>
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
                                  {(note.valid.from || note.valid.until) && (
                                    <p className="text-xs text-content-faint mt-1">
                                      {note.valid.from && note.valid.until ? (
                                        <>Valid: {new Date(note.valid.from).toLocaleDateString()} - {new Date(note.valid.until).toLocaleDateString()}</>
                                      ) : note.valid.from ? (
                                        <>Valid from: {new Date(note.valid.from).toLocaleDateString()}</>
                                      ) : note.valid.until ? (
                                        <>Valid until: {new Date(note.valid.until).toLocaleDateString()}</>
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
                  <p className="text-content-primary font-medium">{leadData?.firstName} {leadData?.surname}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-content-secondary font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={handleEditingRelationsToggle}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    {editingRelationsLead ? "Done" : "Add New"}
                  </button>
                </div>

                {editingRelationsLead && (
                  <div className="mb-4 p-4 border border-border rounded-xl space-y-3">
                    {/* Step 1: Person Selection */}
                    <div>
                      <label className="text-xs text-content-muted block mb-1.5">Person</label>
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewRelationLead({ ...newRelationLead, type: "manual", name: "", selectedMemberId: null })
                            setPersonSearchQuery("")
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelationLead.type === "manual"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelationLead.type === "member"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${newRelationLead.type === "lead"
                            ? "bg-primary text-white"
                            : "bg-surface-button text-content-muted hover:text-content-primary"
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
                          className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                        />
                      ) : (
                        <div className="relative" ref={personSearchRef}>
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                            <input
                              type="text"
                              placeholder={`Search ${newRelationLead.type}s...`}
                              value={personSearchQuery}
                              onChange={(e) => {
                                setPersonSearchQuery(e.target.value)
                                setShowPersonDropdown(true)
                              }}
                              onFocus={() => setShowPersonDropdown(true)}
                              className="w-full bg-surface-dark text-content-primary rounded-xl pl-9 pr-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                            />
                          </div>
                          {newRelationLead.name && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-content-muted">Selected:</span>
                              <span className="bg-blue-600/20 text-primary text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                {newRelationLead.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRelationLead({ ...newRelationLead, name: "", selectedMemberId: null })
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
                              {/* Show members when type is 'member' */}
                              {newRelationLead.type === "member" && (
                                <>
                                  {filteredMembers.length > 0 ? (
                                    filteredMembers.map((person) => (
                                      <button
                                        key={person._id}
                                        type="button"
                                        onClick={() => {
                                          setNewRelationLead({
                                            ...newRelationLead,
                                            selectedMemberId: person,
                                            name: `${person.firstName} ${person.lastName}`,
                                          })
                                          setPersonSearchQuery("")
                                          setShowPersonDropdown(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-hover transition-colors"
                                      >
                                        {person.firstName} {person.lastName}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-2 text-sm text-content-faint">No members found</div>
                                  )}
                                </>
                              )}

                              {/* Show leads when type is 'lead' */}
                              {newRelationLead.type === "lead" && (
                                <>
                                  {filteredLeads.length > 0 ? (
                                    filteredLeads.map((person) => (
                                      <button
                                        key={person._id}
                                        type="button"
                                        onClick={() => {
                                          setNewRelationLead({
                                            ...newRelationLead,
                                            selectedMemberId: person,
                                            name: `${person.firstName} ${person.lastName}`,
                                          })
                                          setPersonSearchQuery("")
                                          setShowPersonDropdown(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-hover transition-colors"
                                      >
                                        {person.firstName} {person.lastName}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-2 text-sm text-content-faint">No leads found</div>
                                  )}
                                </>
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
                          value={newRelationLead.category}
                          onChange={(e) => setNewRelationLead({
                            ...newRelationLead,
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
                          value={newRelationLead.relation}
                          onChange={(e) => setNewRelationLead({
                            ...newRelationLead,
                            relation: e.target.value,
                            customRelation: e.target.value === "custom" ? newRelationLead.customRelation : ""
                          })}
                          placeholder="Select..."
                          options={[
                            ...(relationOptions[newRelationLead.category]?.map((option) => ({
                              value: option, label: option
                            })) || []),
                            { value: "custom", label: "Custom..." },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Custom Relation Input */}
                    {newRelationLead.relation === "custom" && (
                      <div>
                        <label className="text-xs text-content-muted block mb-1.5">Custom Relation</label>
                        <input
                          type="text"
                          placeholder="Enter custom relation..."
                          value={newRelationLead.customRelation}
                          onChange={(e) => setNewRelationLead({ ...newRelationLead, customRelation: e.target.value })}
                          className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddRelationLead}
                      disabled={!newRelationLead.name || (!newRelationLead.relation || (newRelationLead.relation === "custom" && !newRelationLead.customRelation))}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${!newRelationLead.name || (!newRelationLead.relation || (newRelationLead.relation === "custom" && !newRelationLead.customRelation))
                        ? "bg-primary/50 text-white/50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover text-white"
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
              className={`px-4 py-2 text-sm text-white rounded-xl transition-colors ${!formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)
                ? "bg-primary/50 cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary-hover"
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
