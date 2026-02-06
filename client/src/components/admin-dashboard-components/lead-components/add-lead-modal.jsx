/* eslint-disable no-unused-vars */
import { X, Users, Trash2, Plus, Search, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"

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

const AddLeadModal = ({ 
  isVisible, 
  onClose, 
  onSave, 
  availableMembersLeads = [],
  columns = [], // Added columns prop

}) => {
  const [activeTab, setActiveTab] = useState("details")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)
  const {countries, loading} = useCountries();
  
  // Note management state
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
  
  // Get first non-trial column as default status
  const defaultStatus = columns.find(col => col.id !== "trial")?.id || ""
  
  const initialFormData = {
    studioName: "",
    firstName: "",
    lastName: "",
    websiteLink: "",
    email: "",
    phone: "",
    telephoneNumber: "",
    status: defaultStatus,
    hasDemoAccess: false,
    gender: "",
    birthday: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    details: "",
    numberOfMembers: "",

  }
  
  const [formData, setFormData] = useState(initialFormData)



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
    
    // Build specialNote from first important note or first note for backwards compatibility
    const importantNote = localNotes.find(n => n.isImportant)
    const firstNote = localNotes[0]
    const primaryNote = importantNote || firstNote
    
    onSave({
      ...formData,
      notes: localNotes,
      // Keep specialNote for backwards compatibility
      specialNote: primaryNote ? {
        text: primaryNote.text,
        isImportant: primaryNote.isImportant,
        startDate: primaryNote.startDate,
        endDate: primaryNote.endDate,
      } : null,
    })
    
    // Reset form
    setFormData({
      studioName: "",
      firstName: "",
      lastName: "",
      websiteLink: "",
      email: "",
      phone: "",
      telephoneNumber: "",
      status: defaultStatus,
      hasDemoAccess: false,
      gender: "",
      birthday: "",
      source: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      details: "",
    numberOfMembers: "",
    })
    setLocalNotes([])
    setActiveTab("details")
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

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Reset form data when closing
    setFormData({
      studioName: "",
      firstName: "",
      lastName: "",
      websiteLink: "",
      email: "",
      phone: "",
      telephoneNumber: "",
      status: defaultStatus,
      hasDemoAccess: false,
      gender: "",
      birthday: "",
      source: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      details: "",
    numberOfMembers: "",

    })
    setLocalNotes([])
    setActiveTab("details")
    setIsAddingNote(false)
    setEditingNoteId(null)
    setNewNote({
      status: "general",
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    })

    onClose()
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1001]"
    >
      <div 
        className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Create Lead</h2>
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

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">
            {/* Details Tab */}
            {activeTab === "details" && (
              <>
                {/* Studio Information */}
                <div className="space-y-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Studio Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Studio Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.studioName}
                      onChange={(e) => updateFormData("studioName", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      placeholder="Enter studio name..."
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Website Link</label>
                    <input
                      type="url"
                      value={formData.websiteLink}
                      onChange={(e) => updateFormData("websiteLink", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Number of Members</label>
                    <select
                      value={formData.numberOfMembers}
                      onChange={(e) => updateFormData("numberOfMembers", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    >
                      <option value="">Select Number of Members</option>
                      <option value="1-50">1-50 Members</option>
                      <option value="51-200">51-200 Members</option>
                      <option value="201-500">201-500 Members</option>
                      <option value="500+">More than 500 Members</option>
                    </select>
                  </div>
                </div>

                {/* Studio Owner Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Studio Owner</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        Studio Owner First Name<span className="text-red-500 ml-1">*</span>
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
                        Studio Owner Last Name<span className="text-red-500 ml-1">*</span>
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
                    <p className="text-white font-bold">
                      {formData.studioName || (formData.firstName || formData.lastName 
                        ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim() 
                        : <span className="text-gray-500 italic">New Lead</span>)}
                    </p>
                    {formData.studioName && (formData.firstName || formData.lastName) && (
                      <p className="text-gray-400 text-sm">{formData.firstName} {formData.lastName}</p>
                    )}
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
              className={`px-4 py-2 text-sm text-white rounded-xl flex items-center gap-2 transition-colors ${
                !formData.firstName?.trim() || !formData.lastName?.trim() || !isValidEmail(formData.email)
                  ? "bg-orange-500/50 cursor-not-allowed opacity-50"
                  : "bg-orange-500 hover:bg-orange-600"
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
