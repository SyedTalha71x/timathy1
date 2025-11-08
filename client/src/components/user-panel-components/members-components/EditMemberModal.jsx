
/* eslint-disable react/prop-types */
import { X, Trash2, Archive, ArchiveRestore } from "lucide-react"
import DefaultAvatar from "../../../../public/gray-avatar-fotor-20250912192528.png"
import { toast } from "react-hot-toast"
import { useState, useMemo } from "react"
import { COUNTRIES } from "../../../utils/user-panel-states/members-states"



const EditMemberModalMain = ({
  isOpen,
  onClose,
  selectedMemberMain,
  editModalTabMain,
  setEditModalTabMain,
  editFormMain,
  handleInputChangeMain,
  handleEditSubmitMain,
  editingRelationsMain,
  setEditingRelationsMain,
  newRelationMain,
  setNewRelationMain,
  availableMembersLeadsMain,
  relationOptionsMain,
  handleAddRelationMain,
  memberRelationsMain,
  handleDeleteRelationMain,
  handleArchiveMemberMain,
  handleUnarchiveMemberMain,
}) => {
  const [countryInput, setCountryInput] = useState(editFormMain.country || "")
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)

  const filteredCountries = useMemo(() => {
    if (!countryInput) return []
    return COUNTRIES.filter((country) => country.toLowerCase().startsWith(countryInput.toLowerCase())).slice(0, 5)
  }, [countryInput])

  const handleCountryChange = (e) => {
    const value = e.target.value
    setCountryInput(value)
    setShowCountrySuggestions(true)
    handleInputChangeMain({ target: { name: "country", value } })
  }

  const handleCountrySelect = (country) => {
    setCountryInput(country)
    setShowCountrySuggestions(false)
    handleInputChangeMain({ target: { name: "country", value: country } })
  }

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChangeMain({ target: { name: "image", value: reader.result } })
        toast.success("Avatar selected successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen || !selectedMemberMain) return null

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
                onClick={() => setEditModalTabMain(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  editModalTabMain === tab
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
          <form onSubmit={handleEditSubmitMain} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {/* ---------- DETAILS TAB ---------- */}
            {editModalTabMain === "details" && (
              <>
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={editFormMain.image || DefaultAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <label
                    htmlFor="avatar"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                  >
                    Update picture
                  </label>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editFormMain.firstName}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editFormMain.lastName}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                {/* More fields */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormMain.email}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormMain.phone}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Gender</label>
                  <select
                    name="gender"
                    value={editFormMain.gender || ""}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-200 block mb-2">Country</label>
                  <input
                    type="text"
                    value={countryInput}
                    onChange={handleCountryChange}
                    onFocus={() => setShowCountrySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
                    placeholder="Type country name..."
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                  {showCountrySuggestions && filteredCountries.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-[#222] border border-gray-600 rounded-xl mt-1 z-50 max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <div
                          key={country}
                          onClick={() => handleCountrySelect(country)}
                          className="px-4 py-2 text-white text-sm hover:bg-[#333] cursor-pointer"
                        >
                          {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={editFormMain.street}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editFormMain.zipCode}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormMain.city}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormMain.dateOfBirth}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={editFormMain.about}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  />
                  {selectedMemberMain && selectedMemberMain.memberType === "temporary" && (
                    <div className="mt-4">
                      <label className="text-sm text-gray-200 block mb-2">Auto-Archive Due Date</label>
                      <input
                        type="date"
                        name="autoArchiveDate"
                        value={editFormMain.autoArchiveDate}
                        onChange={handleInputChangeMain}
                        className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ---------- NOTE TAB ---------- */}
            {editModalTabMain === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editNoteImportance"
                      checked={editFormMain.noteImportance === "important"}
                      onChange={(e) =>
                        handleInputChangeMain({
                          target: { name: "noteImportance", value: e.target.checked ? "important" : "unimportant" },
                        })
                      }
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="editNoteImportance" className="text-sm text-gray-200">
                      Important
                    </label>
                  </div>
                </div>
                <textarea
                  name="note"
                  value={editFormMain.note}
                  onChange={handleInputChangeMain}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={editFormMain.noteStartDate}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={editFormMain.noteEndDate}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---------- RELATIONS TAB ---------- */}
            {editModalTabMain === "relations" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Relations</label>
                  <button
                    type="button"
                    onClick={() => setEditingRelationsMain(!editingRelationsMain)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {editingRelationsMain ? "Done" : "Edit"}
                  </button>
                </div>
                {editingRelationsMain && (
                  <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <select
                        value={newRelationMain.type}
                        onChange={(e) => {
                          const type = e.target.value
                          setNewRelationMain({ ...newRelationMain, type, name: "", selectedMemberId: null })
                        }}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="manual">Manual Entry</option>
                        <option value="member">Select Member</option>
                        <option value="lead">Select Lead</option>
                      </select>
                      {newRelationMain.type === "manual" ? (
                        <input
                          type="text"
                          placeholder="Name"
                          value={newRelationMain.name}
                          onChange={(e) => setNewRelationMain({ ...newRelationMain, name: e.target.value })}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <select
                          value={newRelationMain.selectedMemberId || ""}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            const selectedPerson = availableMembersLeadsMain.find((p) => p.id.toString() === selectedId)
                            setNewRelationMain({
                              ...newRelationMain,
                              selectedMemberId: selectedId,
                              name: selectedPerson ? selectedPerson.name : "",
                            })
                          }}
                          className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="">Select {newRelationMain.type}</option>
                          {availableMembersLeadsMain
                            .filter((p) => p.type === newRelationMain.type)
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
                        value={newRelationMain.category}
                        onChange={(e) =>
                          setNewRelationMain({ ...newRelationMain, category: e.target.value, relation: "" })
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
                        value={newRelationMain.relation}
                        onChange={(e) => setNewRelationMain({ ...newRelationMain, relation: e.target.value })}
                        className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select Relation</option>
                        {relationOptionsMain[newRelationMain.category]?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRelationMain}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      Add Relation
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedMemberMain &&
                    memberRelationsMain[selectedMemberMain.id] &&
                    Object.entries(memberRelationsMain[selectedMemberMain.id]).map(([category, relations]) =>
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
                          {editingRelationsMain && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRelationMain(category, relation.id)}
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
            )}

            {/* ---------- FOOTER ---------- */}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
                Save Changes
              </button>

              {selectedMemberMain && selectedMemberMain.memberType === "temporary" && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMemberMain.isArchived) {
                      handleUnarchiveMemberMain(selectedMemberMain.id)
                    } else {
                      handleArchiveMemberMain(selectedMemberMain.id)
                    }
                    onClose()
                  }}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    selectedMemberMain.isArchived
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-white"
                  }`}
                >
                  {selectedMemberMain.isArchived ? (
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

export default EditMemberModalMain
