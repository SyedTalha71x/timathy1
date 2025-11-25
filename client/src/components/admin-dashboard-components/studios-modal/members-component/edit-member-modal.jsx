/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Trash2, Archive, ArchiveRestore } from "lucide-react"
import toast from "react-hot-toast"
import DefaultAvatar from "../../../../../public/gray-avatar-fotor-20250912192528.png"

const EditMemberModal = ({
  isOpen,
  onClose,
  selectedMember,
  onSave,
  memberRelations, // Add relations data prop
  availableMembersLeads, // Add available members/leads for relations
  onArchiveMember, // Add archive functionality
  onUnarchiveMember, // Add unarchive functionality
}) => {
  const [editModalTab, setEditModalTab] = useState("details")
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    contractStart: "",
    contractEnd: "",
    gender: "",
    memberType: "full",
    autoArchiveDate: "",
    image: "",
  })

  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    type: "manual",
    category: "family",
    relation: "",
    name: "",
    selectedMemberId: null,
  })

  // Relation options
  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  useEffect(() => {
    if (selectedMember) {
      setEditForm({
        firstName: selectedMember.firstName || "",
        lastName: selectedMember.lastName || "",
        email: selectedMember.email || "",
        phone: selectedMember.phone || "",
        street: selectedMember.street || "",
        zipCode: selectedMember.zipCode || "",
        city: selectedMember.city || "",
        country: selectedMember.country || "",
        dateOfBirth: selectedMember.dateOfBirth || "",
        about: selectedMember.about || "",
        note: selectedMember.note || "",
        noteStartDate: selectedMember.noteStartDate || "",
        noteEndDate: selectedMember.noteEndDate || "",
        noteImportance: selectedMember.noteImportance || "unimportant",
        contractStart: selectedMember.contractStart || "",
        contractEnd: selectedMember.contractEnd || "",
        gender: selectedMember.gender || "",
        memberType: selectedMember.memberType || "full",
        autoArchiveDate: selectedMember.autoArchiveDate || "",
        image: selectedMember.image || "",
      })
    }
  }, [selectedMember])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(e, editForm); 
    onClose();
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          image: reader.result
        }))
        toast.success("Avatar selected successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  // Relation management functions
  const handleAddRelation = () => {
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all relation fields")
      return
    }

    const relationData = {
      id: Date.now(),
      name: newRelation.name,
      relation: newRelation.relation,
      type: newRelation.type,
      category: newRelation.category,
    }

    // Here you would typically update the relations state
    // For now, we'll just show a toast
    toast.success(`Relation added: ${newRelation.name} (${newRelation.relation})`)
    
    // Reset form
    setNewRelation({
      type: "manual",
      category: "family",
      relation: "",
      name: "",
      selectedMemberId: null,
    })
  }

  const handleDeleteRelation = (category, relationId) => {
    // Here you would typically delete the relation from state
    toast.success("Relation deleted")
  }

  const handleArchiveMember = () => {
    if (onArchiveMember && selectedMember) {
      onArchiveMember(selectedMember.id)
      onClose()
    }
  }

  const handleUnarchiveMember = () => {
    if (onUnarchiveMember && selectedMember) {
      onUnarchiveMember(selectedMember.id)
      onClose()
    }
  }

  if (!isOpen || !selectedMember) return null

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Member</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            {["details", "note", "relations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setEditModalTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  editModalTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "details" && "Details"}
                {tab === "note" && "Special Note"}
                {tab === "relations" && "Relations"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {/* ---------- DETAILS TAB ---------- */}
            {editModalTab === "details" && (
              <>
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={editForm.image || DefaultAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  <label
                    htmlFor="avatar"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                  >
                    Update picture
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Gender</label>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={editForm.street}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editForm.zipCode}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editForm.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Member Type</label>
                  <select
                    name="memberType"
                    value={editForm.memberType}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  >
                    <option value="full">Full Member (with contract)</option>
                    <option value="temporary">Temporary Member (without contract)</option>
                  </select>
                </div>

                {editForm.memberType === "temporary" && (
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Auto-Archive Due Date</label>
                    <input
                      type="date"
                      name="autoArchiveDate"
                      value={editForm.autoArchiveDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={editForm.about}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  />
                </div>
              </>
            )}

            {/* ---------- NOTE TAB ---------- */}
            {editModalTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="noteImportance"
                      checked={editForm.noteImportance === "important"}
                      onChange={(e) => {
                        setEditForm({
                          ...editForm,
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
                  name="note"
                  value={editForm.note}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={editForm.noteStartDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={editForm.noteEndDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---------- RELATIONS TAB ---------- */}
            {editModalTab === "relations" && (
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
                            // This would be populated from availableMembersLeads prop
                            setNewRelation({
                              ...newRelation,
                              selectedMemberId: selectedId,
                              name: `Selected ${newRelation.type}`,
                            })
                          }}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="">Select {newRelation.type}</option>
                          {/* Options would come from availableMembersLeads prop */}
                        </select>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <select
                        value={newRelation.category}
                        onChange={(e) =>
                          setNewRelation({ ...newRelation, category: e.target.value, relation: "" })
                        }
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
                  {/* Display existing relations */}
                  {selectedMember && memberRelations && memberRelations[selectedMember.id] ? (
                    Object.entries(memberRelations[selectedMember.id]).map(([category, relations]) =>
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
                              onClick={() => handleDeleteRelation(category, relation.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    )
                  ) : (
                    <div className="text-gray-500 text-sm text-center py-4">
                      No relations added yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------- FOOTER ---------- */}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
                Save Changes
              </button>

              {editForm.memberType === "temporary" && (
                <button
                  type="button"
                  onClick={selectedMember.isArchived ? handleUnarchiveMember : handleArchiveMember}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    selectedMember.isArchived
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-white"
                  }`}
                >
                  {selectedMember.isArchived ? (
                    <>
                      <ArchiveRestore size={16} className="inline mr-1" />
                      Unarchive
                    </>
                  ) : (
                    <>
                      <Archive size={16} className="inline mr-1" />
                      Archive
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMemberModal