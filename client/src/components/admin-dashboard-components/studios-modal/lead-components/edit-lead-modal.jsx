/* eslint-disable react/prop-types */
import { Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"

export function EditLeadModal({
  isVisible,
  onClose,
  onSave,
  leadData,
  memberRelationsLead,
  setMemberRelationsLead,
  availableMembersLeads = [],
  relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  },
  initialTab = "details"
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [editingRelationsLead, setEditingRelationsLead] = useState(false)
  
  const [formData, setFormData] = useState({
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
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    about: "",
    studioName: "",
    website: "",
    gender: "",
  })

  const [newRelationLead, setNewRelationLead] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

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
        status: leadData.status || "passive",
        hasTrialTraining: leadData.hasTrialTraining || false,
        note: leadData.specialNote?.text || "",
        noteImportance: leadData.specialNote?.isImportant ? "important" : "unimportant",
        noteStartDate: leadData.specialNote?.startDate || "",
        noteEndDate: leadData.specialNote?.endDate || "",
        source: leadData.source || "",
        gender: leadData.gender || "",
        street: leadData.street || "",
        zipCode: leadData.zipCode || "",
        city: leadData.city || "",
        country: leadData.country || "",
        about: leadData.about || "",
        studioName: leadData.studioName || "",
        website: leadData.website || "",
      })
    }
  }, [leadData])

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

  // Get current lead relations safely
  const getCurrentLeadRelations = () => {
    if (!memberRelationsLead || !leadData || !leadData.id) {
      return {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      };
    }
    return memberRelationsLead[leadData.id] || {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    };
  };

  const handleAddRelationLead = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!newRelationLead.name || !newRelationLead.relation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    const updatedRelations = { ...memberRelationsLead }
    
    if (!updatedRelations[leadData.id]) {
      updatedRelations[leadData.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }

    updatedRelations[leadData.id][newRelationLead.category].push({
      id: relationId,
      name: newRelationLead.name,
      relation: newRelationLead.relation,
      type: newRelationLead.type,
    })

    setMemberRelationsLead(updatedRelations)
    setNewRelationLead({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null
    })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelationLead = (category, relationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    const updatedRelations = { ...memberRelationsLead }
    if (updatedRelations[leadData.id] && updatedRelations[leadData.id][category]) {
      updatedRelations[leadData.id][category] = updatedRelations[leadData.id][category].filter(
        (rel) => rel.id !== relationId,
      )
      setMemberRelationsLead(updatedRelations)
      toast.success("Relation deleted successfully")
    }
  }

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const mappedData = {
      ...leadData,
      firstName: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      status: formData.status,
      hasTrialTraining: formData.hasTrialTraining,
      source: formData.source,
      gender: formData.gender,
      street: formData.street,
      zipCode: formData.zipCode,
      city: formData.city,
      country: formData.country,
      about: formData.about,
      studioName: formData.studioName,
      website: formData.website,
      specialNote: {
        text: formData.note,
        isImportant: formData.noteImportance === "important",
        startDate: formData.noteStartDate,
        endDate: formData.noteEndDate,
      },
    }

    onSave(mappedData)
    toast.success("Lead updated successfully!")
    setTimeout(() => {
      onClose()
    }, 200)
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

  // Handle backdrop click (only close if clicking on the backdrop itself)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isVisible || !leadData) return null

  // Get current relations
  const currentLeadRelations = getCurrentLeadRelations();

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000] overflow-y-auto" 
      onClick={handleBackdropClick}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div 
        className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
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

                {/* <div>
                  <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
                  <input
                    type="text"
                    value={formData.studioName}
                    onChange={(e) => updateFormData("studioName", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div> */}

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
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
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
                      <option value="passive">Passive</option>
                      <option value="active">Active</option>
                      <option value="converted">Converted</option>
                      <option value="trial">Trial Training arranged</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => updateFormData("about", e.target.value)}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                    placeholder="Enter additional information about the lead..."
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
                    {editingRelationsLead ? "Done" : "Edit"}
                  </button>
                </div>

                {editingRelationsLead && (
                  <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <select
                        value={newRelationLead.type}
                        onChange={(e) => {
                          const type = e.target.value
                          setNewRelationLead({
                            ...newRelationLead,
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

                      {newRelationLead.type === "manual" ? (
                        <input
                          type="text"
                          placeholder="Name"
                          value={newRelationLead.name}
                          onChange={(e) => setNewRelationLead({ ...newRelationLead, name: e.target.value })}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <select
                          value={newRelationLead.selectedMemberId || ""}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            const selectedPerson = membersLeads.find((p) => p.id.toString() === selectedId)
                            setNewRelationLead({
                              ...newRelationLead,
                              selectedMemberId: selectedId,
                              name: selectedPerson ? selectedPerson.name : "",
                            })
                          }}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="">Select {newRelationLead.type}</option>
                          {membersLeads
                            .filter((p) => p.type === newRelationLead.type)
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
                        value={newRelationLead.category}
                        onChange={(e) => setNewRelationLead({
                          ...newRelationLead,
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
                        value={newRelationLead.relation}
                        onChange={(e) => setNewRelationLead({ ...newRelationLead, relation: e.target.value })}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select Relation</option>
                        {relationOptions[newRelationLead.category]?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddRelationLead}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      Add Relation
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(currentLeadRelations).map(([category, relations]) =>
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
                        {editingRelationsLead && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteRelationLead(category, relation.id, e)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}

                  {Object.values(currentLeadRelations).every(arr => arr.length === 0) && (
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
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}