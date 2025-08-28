"use client"

// refernce trial modal
import { Search, X, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
/* eslint-disable react/prop-types */
const TrialTrainingModal = ({
  isOpen,
  onClose,
  trialTypes = [],
  freeTimeSlots = [],
  selectedLead: initialSelectedLead,
  availableMembersLeads = [], // For relations
  relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Boyfriend", "Girlfriend", "Ex-Partner"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Roommate", "Mentor", "Student", "Other"],
  },
}) => {
  const [activeTab, setActiveTab] = useState("details")
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(initialSelectedLead || null)
  const [editingRelations, setEditingRelations] = useState(false)

  const [trialData, setTrialData] = useState({
    date: "",
    timeSlot: "",
    trialType: "",
    relations: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
    specialNote: {
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    },
  })

  // New relation state
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  // Load leads from localStorage on mount
  useEffect(() => {
    const storedLeads = localStorage.getItem("leads")
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads))
    }
  }, [])

  // Filter leads based on search query
  useEffect(() => {
    const filtered = leads.filter(
      (lead) =>
        `${lead.firstName} ${lead.lastName || lead.surname || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredLeads(filtered)
  }, [searchQuery, leads])

  // Update trial data
  const updateTrialData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setTrialData({
        ...trialData,
        [parent]: {
          ...trialData[parent],
          [child]: value,
        },
      })
    } else {
      setTrialData({
        ...trialData,
        [field]: value,
      })
    }
  }

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate || !Array.isArray(freeTimeSlots)) return []
    return freeTimeSlots.filter((slot) => slot && slot.date === selectedDate)
  }

  // Add relation
  const addRelation = () => {
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

    setTrialData((prev) => ({
      ...prev,
      relations: {
        ...prev.relations,
        [newRelation.category]: [...prev.relations[newRelation.category], newRel],
      },
    }))

    setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
  }

  // Remove relation
  const removeRelation = (category, relationId) => {
    setTrialData((prev) => ({
      ...prev,
      relations: {
        ...prev.relations,
        [category]: prev.relations[category].filter((rel) => rel.id !== relationId),
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedLead) return

    // Update lead with trial training info
    const updatedLeads = leads.map((lead) => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          hasTrialTraining: true,
          trialDetails: {
            date: trialData.date,
            timeSlot: trialData.timeSlot,
            trialType: trialData.trialType,
            relations: trialData.relations,
            specialNote: trialData.specialNote,
          },
        }
      }
      return lead
    })

    localStorage.setItem("leads", JSON.stringify(updatedLeads))
    onClose()
  }

  // Set search query and filtered leads when a lead is pre-selected
  useEffect(() => {
    if (initialSelectedLead) {
      setSelectedLead(initialSelectedLead)
      setSearchQuery(
        `${initialSelectedLead.firstName} ${initialSelectedLead.lastName || initialSelectedLead.surname || ""}`,
      )

      // Make sure the filtered leads include the selected lead
      if (leads.length > 0) {
        const matchingLeads = leads.filter((lead) => lead.id === initialSelectedLead.id)
        if (matchingLeads.length > 0) {
          setFilteredLeads([matchingLeads[0]])
        }
      }
    }
  }, [initialSelectedLead, leads])

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("details")
      setSearchQuery("")
      setSelectedLead(null)
      setTrialData({
        date: "",
        timeSlot: "",
        trialType: "",
        relations: {
          family: [],
          friendship: [],
          relationship: [],
          work: [],
          other: [],
        },
        specialNote: {
          text: "",
          isImportant: false,
          startDate: "",
          endDate: "",
        },
      })
    } else if (initialSelectedLead) {
      // When modal opens with a pre-selected lead
      setSelectedLead(initialSelectedLead)
      setSearchQuery(
        `${initialSelectedLead.firstName} ${initialSelectedLead.lastName || initialSelectedLead.surname || ""}`,
      )
    }
  }, [isOpen, initialSelectedLead])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        className="bg-[#1C1C1C] w-[90%] sm:w-[520px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white open_sans_font_700">Book Trial Training</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-7">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>

            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "note" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Special Note
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "relations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Relations
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]">
            {/* Details Tab */}
            {activeTab === "details" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Lead</label>
                  {initialSelectedLead ? (
                    <div className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white border border-gray-700">
                      <div className="font-medium">{`${initialSelectedLead.firstName} ${initialSelectedLead.lastName || initialSelectedLead.surname || ""}`}</div>
                      <div className="text-xs text-gray-400">{initialSelectedLead.email}</div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search lead..."
                          className="w-full bg-[#101010] text-sm rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                        />
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>

                      {searchQuery && filteredLeads.length > 0 && (
                        <div className="mt-2 bg-[#101010] rounded-xl max-h-40 overflow-y-auto">
                          {filteredLeads.map((lead) => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-2 cursor-pointer hover:bg-[#252525] ${selectedLead?.id === lead.id ? "bg-[#252525]" : ""}`}
                            >
                              <div className="font-medium text-white">{`${lead.firstName} ${lead.lastName || lead.surname || ""}`}</div>
                              <div className="text-sm text-white">{lead.email}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Trial Type</label>
                  <select
                    value={trialData.trialType}
                    onChange={(e) => updateTrialData("trialType", e.target.value)}
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    <option value="">Select type</option>
                    {trialTypes.length > 0 ? (
                      trialTypes.map((type) => (
                        <option key={type.name} value={type.name}>
                          {type.name} ({type.duration} minutes)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="cardio">Cardio (30 minutes)</option>
                        <option value="strength">Strength (45 minutes)</option>
                        <option value="flexibility">Flexibility (60 minutes)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Trial date and time section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-200">Trial Date & Time</label>
                  </div>

                  <div className="p-3 bg-[#101010] rounded-xl space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Date</label>
                        <input
                          type="date"
                          value={trialData.date}
                          onChange={(e) => updateTrialData("date", e.target.value)}
                          className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400">Available Time Slots</label>
                        <select
                          value={trialData.timeSlot}
                          onChange={(e) => updateTrialData("timeSlot", e.target.value)}
                          className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                          disabled={!trialData.date}
                        >
                          <option value="">Select time slot</option>
                          {getAvailableSlots(trialData.date).map((slot) => (
                            <option key={slot.id || `slot-${slot.time}`} value={slot.time}>
                              {slot.time}
                            </option>
                          ))}
                          {/* Show message if no time slots available */}
                          {trialData.date && getAvailableSlots(trialData.date).length === 0 && (
                            <option value="" disabled>
                              No available slots for this date
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Relations Tab */}
            {activeTab === "relations" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={() => setEditingRelations(!editingRelations)}
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
                          setNewRelation({ ...newRelation, type, name: "", selectedMemberId: null })
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
                            const selectedPerson = availableMembersLeads.find((p) => p.id.toString() === selectedId)
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
                        onChange={(e) => setNewRelation({ ...newRelation, category: e.target.value, relation: "" })}
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
                  {Object.entries(trialData.relations).map(([category, relations]) =>
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
                            onClick={() => removeRelation(category, relation.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )),
                  )}
                  {Object.values(trialData.relations).every((arr) => arr.length === 0) && (
                    <div className="text-gray-500 text-sm text-center py-4">No relations added yet</div>
                  )}
                </div>
              </div>
            )}

            {/* Special Note Tab */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isImportant"
                      checked={trialData.specialNote.isImportant}
                      onChange={(e) => updateTrialData("specialNote.isImportant", e.target.checked)}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="isImportant" className="text-sm text-gray-200">
                      Important
                    </label>
                  </div>
                </div>

                <textarea
                  value={trialData.specialNote.text}
                  onChange={(e) => updateTrialData("specialNote.text", e.target.value)}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      value={trialData.specialNote.startDate}
                      onChange={(e) => updateTrialData("specialNote.startDate", e.target.value)}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      value={trialData.specialNote.endDate}
                      onChange={(e) => updateTrialData("specialNote.endDate", e.target.value)}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-600 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedLead || !trialData.date || !trialData.timeSlot || !trialData.trialType}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Trial Training
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrialTrainingModal
