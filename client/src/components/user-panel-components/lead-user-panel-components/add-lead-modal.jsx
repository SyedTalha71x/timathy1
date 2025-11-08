/* eslint-disable no-unused-vars */
import { X, Users, Trash2, Plus } from "lucide-react"
import { useState } from "react"
/* eslint-disable react/prop-types */

const AddLeadModal = ({ 
  isVisible, 
  onClose, 
  onSave, 
  availableMembersLeads = [], 
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
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "passive",
    hasTrialTraining: false,
    gender: "",
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    relations: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
  })

  // Country options - you can expand this list
  const countryOptions = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Australia",
    "Japan",
    "China",
    "Brazil",
    "Mexico",
    "India",
    "South Korea",
    "Netherlands",
    "Switzerland",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Austria",
    "Belgium",
    "Portugal",
    "Ireland",
    "New Zealand",
    "Singapore",
    "United Arab Emirates",
    "South Africa",
    // Add more countries as needed
  ]

  // Filter countries based on input
  const filteredCountries = countryOptions.filter(country =>
    country.toLowerCase().includes(formData.country.toLowerCase())
  )

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

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSave(formData)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "passive",
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
      alert("Please fill in all fields")
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

  // Handle country selection
  const handleCountrySelect = (country) => {
    setFormData({
      ...formData,
      country: country
    })
    setShowCountryDropdown(false)
  }

  // Handle country input change
  const handleCountryChange = (value) => {
    setFormData({
      ...formData,
      country: value
    })
    setShowCountryDropdown(true)
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
    onClose()
  }

  // Handle backdrop click (only close if clicking on the backdrop itself)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // New relation state
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1001]" 
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Street</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => updateFormData("street", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData("zipCode", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      onFocus={() => setShowCountryDropdown(true)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      placeholder="Type or select country"
                    />
                    
                    {/* Country Dropdown */}
                    {showCountryDropdown && filteredCountries.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-[#141414] border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <div
                            key={country}
                            onClick={() => handleCountrySelect(country)}
                            className="px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                          >
                            {country}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => updateFormData("source", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    >
                      <option value="">Select Source</option>
                      {sourceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormData("status", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    >
                      <option value="active">Active prospect</option>
                      <option value="passive">Passive prospect</option>
                      <option value="uninterested">Uninterested</option>
                      <option value="missed">Missed Call</option>
                    </select>
                  </div>
                </div>

                {/* Textarea matching other fields */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => updateFormData("details", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                    placeholder="Enter more details..."
                  />
                </div>
              </>
            )}

            {/* Special Note Tab */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
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
              className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLeadModal