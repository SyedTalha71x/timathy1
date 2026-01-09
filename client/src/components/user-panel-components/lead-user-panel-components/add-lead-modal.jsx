/* eslint-disable no-unused-vars */
import { X, Users, Trash2, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries"

/* eslint-disable react/prop-types */

const AddLeadModal = ({ 
  isVisible, 
  onClose, 
  onSave, 
  availableMembersLeads = [],
  columns = [], // Added columns prop
  relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Boyfriend", "Girlfriend", "Ex-Partner"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Roommate", "Mentor", "Student", "Other"]
  }
}) => {
  const [activeTab, setActiveTab] = useState("details")
  const [editingRelations, setEditingRelations] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)
  const {countries, loading} = useCountries();
  
  // Get first non-trial column as default status
  const defaultStatus = columns.find(col => col.id !== "trial")?.id || ""
  
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telephoneNumber: "",
    status: defaultStatus,
    hasTrialTraining: false,
    gender: "",
    birthday: "",
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    details: "",
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
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

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
    
    // Validate special note dates
    if (formData.noteStartDate && formData.noteEndDate) {
      const startDate = new Date(formData.noteStartDate)
      const endDate = new Date(formData.noteEndDate)
      
      if (endDate < startDate) {
        toast.error("End date cannot be before start date")
        return
      }
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
    
    onSave(formData)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      telephoneNumber: "",
      status: "",
      hasTrialTraining: false,
      note: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
      gender: "",
      source: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      details: "",
      relations: {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      },
    })
    setActiveTab("details")
    setEditingRelations(false)
    setNewRelation({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null
    })
    onClose()
  }

  // Add relation
  const addRelation = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    const newRel = {
      id: relationId,
      name: newRelation.name,
      relation: newRelation.relation,
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
      category: "family",
      type: "manual",
      selectedMemberId: null
    })
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
      status: defaultStatus,
      hasTrialTraining: false,
      gender: "",
      birthday: "",
      note: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
      source: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      details: "",
      relations: {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      },
    })
    setActiveTab("details")
    setEditingRelations(false)
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
            Special Note
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

            {/* Special Note Tab */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                {/* Lead Name Header - shows dynamically from form fields */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Special Note for</p>
                    <p className="text-white font-semibold text-lg">
                      {formData.firstName || formData.lastName 
                        ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim() 
                        : <span className="text-gray-500 italic">New Lead</span>}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="noteImportance"
                      checked={formData.noteImportance === "important"}
                      onChange={(e) => {
                        updateFormData("noteImportance", e.target.checked ? "important" : "unimportant")
                      }}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="noteImportance" className="text-sm text-gray-200">
                      Important
                    </label>
                  </div>
                </div>
                <textarea
                  value={formData.note}
                  onChange={(e) => updateFormData("note", e.target.value)}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.noteStartDate}
                      onChange={(e) => updateFormData("noteStartDate", e.target.value)}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.noteEndDate}
                      onChange={(e) => updateFormData("noteEndDate", e.target.value)}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Relations Tab */}
            {activeTab === "relations" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={handleEditingRelationsToggle}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {editingRelations ? "Done" : "Edit"}
                  </button>
                </div>

                {editingRelations && (
                  <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <select
                        value={newRelation.type}
                        onChange={(e) => {
                          const type = e.target.value
                          setNewRelation({
                            ...newRelation,
                            type,
                            name: "",
                            selectedMemberId: null
                          })
                        }}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="manual">Manual Entry</option>
                        <option value="member">Select Member</option>
                        <option value="lead">Select Lead</option>
                      </select>

                      {newRelation.type === "manual" ? (
                        <input
                          type="text"
                          placeholder="Name"
                          value={newRelation.name}
                          onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <select
                          value={newRelation.selectedMemberId || ""}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            const selectedPerson = availableMembersLeads.find(
                              (p) => p.id.toString() === selectedId,
                            )
                            setNewRelation({
                              ...newRelation,
                              selectedMemberId: selectedId,
                              name: selectedPerson ? selectedPerson.name : "",
                            })
                          }}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="">Select {newRelation.type}</option>
                          {availableMembersLeads
                            .filter((p) => p.type === newRelation.type)
                            .map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name} ({person.type})
                              </option>
                            ))}
                        </select>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <select
                        value={newRelation.category}
                        onChange={(e) => setNewRelation({
                          ...newRelation,
                          category: e.target.value,
                          relation: ""
                        })}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="family">Family</option>
                        <option value="friendship">Friendship</option>
                        <option value="relationship">Relationship</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>

                      <select
                        value={newRelation.relation}
                        onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select Relation</option>
                        {relationOptions[newRelation.category]?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={addRelation}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      Add Relation
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(formData.relations).map(([category, relations]) =>
                    relations.map((relation) => (
                      <div
                        key={relation.id}
                        className="flex items-center justify-between bg-[#101010] rounded px-3 py-2"
                      >
                        <div className="text-sm">
                          <span className="text-white">{relation.name}</span>
                          <span className="text-gray-400 ml-2">({relation.relation})</span>
                          <span className="text-blue-400 ml-2 capitalize">- {category}</span>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              relation.type === "member"
                                ? "bg-green-600 text-green-100"
                                : relation.type === "lead"
                                ? "bg-blue-600 text-blue-100"
                                : "bg-gray-600 text-gray-100"
                            }`}
                          >
                            {relation.type}
                          </span>
                        </div>
                        {editingRelations && (
                          <button
                            type="button"
                            onClick={(e) => removeRelation(category, relation.id, e)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )),
                  )}

                  {Object.values(formData.relations).every(arr => arr.length === 0) && (
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
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 flex items-center gap-2"
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
