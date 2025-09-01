/* eslint-disable react/prop-types */
"use client"
import { X, Info, Trash2 } from "lucide-react"
import Avatar from "../../../public/default-avatar.avif"
import { toast } from "react-hot-toast"

const CreateTempMemberModal = ({
  show,
  onClose,
  tempMemberForm,
  setTempMemberForm,
  tempMemberModalTab,
  setTempMemberModalTab,
  handleCreateTempMember,
  handleTempMemberInputChange,
  handleImgUpload,
  editingRelations,
  setEditingRelations,
  newRelation,
  setNewRelation,
  availableMembersLeads,
  relationOptions,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Create Temporary Member</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-yellow-500 " size={50} />
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-1">Temporary Member Information</p>
                <p className="text-yellow-300/80 text-xs">
                  Temporary members are members without a contract and are not included in payment runs. They will be
                  automatically archived after the specified period.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setTempMemberModalTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                tempMemberModalTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setTempMemberModalTab("note")}
              className={`px-4 py-2 text-sm font-medium ${
                tempMemberModalTab === "note"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Special Note
            </button>
            <button
              onClick={() => setTempMemberModalTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${
                tempMemberModalTab === "relations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Relations
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateTempMember} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]">
            {/* ---- Tab: DETAILS ---- */}
            {tempMemberModalTab === "details" && (
              <>
                {/* Avatar Upload */}
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={tempMemberForm.img || Avatar}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImgUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
                  >
                    Upload picture
                  </label>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={tempMemberForm.firstName}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={tempMemberForm.lastName}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={tempMemberForm.email}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempMemberForm.phone}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={tempMemberForm.country}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={tempMemberForm.street}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                {/* Zip + City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={tempMemberForm.zipCode}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={tempMemberForm.city}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={tempMemberForm.dateOfBirth}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={tempMemberForm.about}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  />
                </div>

                {/* Auto Archive */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Auto-Archive Period (weeks)</label>
                  <input
                    type="number"
                    name="autoArchivePeriod"
                    value={tempMemberForm.autoArchivePeriod}
                    onChange={handleTempMemberInputChange}
                    min="1"
                    max="52"
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Member will be automatically archived after this period</p>
                </div>
              </>
            )}

            {/* ---- Tab: NOTE ---- */}
            {tempMemberModalTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tempNoteImportance"
                      checked={tempMemberForm.noteImportance === "important"}
                      onChange={(e) => {
                        setTempMemberForm({
                          ...tempMemberForm,
                          noteImportance: e.target.checked ? "important" : "unimportant",
                        })
                      }}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="tempNoteImportance" className="text-sm text-gray-200">
                      Important
                    </label>
                  </div>
                </div>
                <textarea
                  name="note"
                  value={tempMemberForm.note}
                  onChange={handleTempMemberInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={tempMemberForm.noteStartDate}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={tempMemberForm.noteEndDate}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---- Tab: RELATIONS ---- */}
            {tempMemberModalTab === "relations" && (
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
                      onClick={() => {
                        if (!newRelation.name || !newRelation.relation) {
                          toast.error("Please fill in all fields")
                          return
                        }
                        // Add relation to tempMemberForm instead of memberRelations
                        const relationId = Date.now()
                        const newRel = {
                          id: relationId,
                          name: newRelation.name,
                          relation: newRelation.relation,
                          type: newRelation.type,
                        }

                        // Initialize relations if not exists
                        if (!tempMemberForm.relations) {
                          setTempMemberForm((prev) => ({
                            ...prev,
                            relations: {
                              family: [],
                              friendship: [],
                              relationship: [],
                              work: [],
                              other: [],
                            },
                          }))
                        }

                        // Add the new relation
                        setTempMemberForm((prev) => ({
                          ...prev,
                          relations: {
                            ...prev.relations,
                            [newRelation.category]: [...(prev.relations?.[newRelation.category] || []), newRel],
                          },
                        }))

                        setNewRelation({
                          name: "",
                          relation: "",
                          category: "family",
                          type: "manual",
                          selectedMemberId: null,
                        })
                        toast.success("Relation added successfully")
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      Add Relation
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tempMemberForm.relations &&
                    Object.entries(tempMemberForm.relations).map(([category, relations]) =>
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
                              onClick={() => {
                                // Remove relation from tempMemberForm
                                setTempMemberForm((prev) => ({
                                  ...prev,
                                  relations: {
                                    ...prev.relations,
                                    [category]: prev.relations[category].filter((rel) => rel.id !== relation.id),
                                  },
                                }))
                                toast.success("Relation deleted successfully")
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )),
                    )}
                  {(!tempMemberForm.relations ||
                    Object.values(tempMemberForm.relations).every((arr) => arr.length === 0)) && (
                    <div className="text-gray-500 text-sm text-center py-4">No relations added yet</div>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="w-full bg-gray-700 text-white rounded-xl py-2 text-sm cursor-pointer">
              Create Temporary Member
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTempMemberModal
