import { Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

/* eslint-disable react/prop-types */
const EditLeadModal = ({ isVisible, onClose, onSave, leadData, memberRelations, setMemberRelations }) => {
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
  })
  
  
    const [editingRelations, setEditingRelations] = useState(false)
    const [newRelation, setNewRelation] = useState({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
    })
  
    // Available members/leads for relations
    const availableMembersLeads = [
      { id: 101, name: "Anna Doe", type: "member" },
      { id: 102, name: "Peter Doe", type: "lead" },
      { id: 103, name: "Lisa Doe", type: "member" },
      { id: 201, name: "Max Miller", type: "member" },
      { id: 301, name: "Marie Smith", type: "member" },
      { id: 401, name: "Tom Wilson", type: "lead" },
    ]
  
    // Relation options by category
    const relationOptions = {
      family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
      friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
      relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
      work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
      other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
    }
  
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
          street: leadData.street || "",
          zipCode: leadData.zipCode || "",
          city: leadData.city || "",
          country: leadData.country || "",
        })
        
      }
    }, [leadData])
  
    const handleAddRelation = () => {
      if (!newRelation.name || !newRelation.relation) {
        toast.error("Please fill in all fields")
        return
      }
  
      const relationId = Date.now()
      const updatedRelations = { ...memberRelations }
      if (!updatedRelations[leadData.id]) {
        updatedRelations[leadData.id] = {
          family: [],
          friendship: [],
          relationship: [],
          work: [],
          other: [],
        }
      }
  
      updatedRelations[leadData.id][newRelation.category].push({
        id: relationId,
        name: newRelation.name,
        relation: newRelation.relation,
        type: newRelation.type,
      })
  
      setMemberRelations(updatedRelations)
      setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
      toast.success("Relation added successfully")
    }
  
    const handleDeleteRelation = (category, relationId) => {
      const updatedRelations = { ...memberRelations }
      updatedRelations[leadData.id][category] = updatedRelations[leadData.id][category].filter(
        (rel) => rel.id !== relationId,
      )
      setMemberRelations(updatedRelations)
      toast.success("Relation deleted successfully")
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onSave({
        ...formData,
        id: leadData.id,
        surname: formData.lastName,
        phoneNumber: formData.phone,
        specialNote: {
          text: formData.note,
          isImportant: formData.noteImportance === "important",
          startDate: formData.noteStartDate,
          endDate: formData.noteEndDate,
        },
      })
      onClose()
    }
  
    if (!isVisible || !leadData) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
        <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Edit Lead</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              >
                <option value="active">Active prospect</option>
                <option value="passive">Passive prospect</option>
                <option value="uninterested">Uninterested</option>
                <option value="missed">Missed Call</option>
              </select>
            </div>
  
            {/* Relations Section */}
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
                    onClick={handleAddRelation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                  >
                    Add Relation
                  </button>
                </div>
              )}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {leadData &&
                  memberRelations[leadData.id] &&
                  Object.entries(memberRelations[leadData.id]).map(([category, relations]) =>
                    relations.map((relation) => (
                      <div key={relation.id} className="flex items-center justify-between bg-[#101010] rounded px-3 py-2">
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
                            onClick={() => handleDeleteRelation(category, relation.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )),
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-sm text-gray-200 block mb-2">Source</label>
    <input
      type="text"
      value={formData.source}
      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">Street</label>
    <input
      type="text"
      value={formData.street}
      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
    <input
      type="text"
      value={formData.zipCode}
      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">City</label>
    <input
      type="text"
      value={formData.city}
      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">Country</label>
    <input
      type="text"
      value={formData.country}
      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
</div>

  
            <div className="border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-200 font-medium">Special Note</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noteImportance"
                    checked={formData.noteImportance === "important"}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        noteImportance: e.target.checked ? "important" : "unimportant",
                      })
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
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note..."
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.noteStartDate}
                    onChange={(e) => setFormData({ ...formData, noteStartDate: e.target.value })}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.noteEndDate}
                    onChange={(e) => setFormData({ ...formData, noteEndDate: e.target.value })}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  export default EditLeadModal