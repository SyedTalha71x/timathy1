/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { X, Upload, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react"
import toast from "react-hot-toast"

// Note Status Options (franchise-context)
const NOTE_STATUSES = [
  { id: "general", label: "General" },
  { id: "contract_issue", label: "Contract Issue" },
  { id: "onboarding", label: "Onboarding" },
  { id: "follow_up", label: "Follow-up" },
  { id: "compliance", label: "Compliance" },
  { id: "escalation", label: "Escalation" },
]

const FranchiseModal = ({
  isCreateModalOpen,
  isEditModalOpen,
  onClose,
  franchiseForm,
  onInputChange,
  onSave,
  onLogoUpload,
  onArchive,
  selectedFranchise,
}) => {
  const isOpen = isCreateModalOpen || isEditModalOpen
  const isEdit = isEditModalOpen

  // Tab state
  const [activeTab, setActiveTab] = useState("details")

  // Notes state (matching EditAdminConfigModal)
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
  const specialNoteTextareaRef = useRef(null)

  // Initialize notes when modal opens / franchise changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("details")
      setIsAddingNote(false)
      setEditingNoteId(null)
      setExpandedNoteId(null)
      setNewNote({ status: "general", text: "", isImportant: false, startDate: "", endDate: "" })

      if (isEdit && selectedFranchise) {
        // Load notes array or convert legacy single note
        if (selectedFranchise.notes && Array.isArray(selectedFranchise.notes)) {
          setLocalNotes(JSON.parse(JSON.stringify(selectedFranchise.notes)))
        } else if (selectedFranchise.specialNote && selectedFranchise.specialNote.trim()) {
          setLocalNotes([{
            id: 1,
            status: "general",
            text: selectedFranchise.specialNote,
            isImportant: selectedFranchise.noteImportance === "important" || selectedFranchise.noteImportance === "critical",
            startDate: selectedFranchise.noteStartDate || "",
            endDate: selectedFranchise.noteEndDate || "",
            createdAt: new Date().toISOString(),
          }])
        } else {
          setLocalNotes([])
        }
      } else {
        setLocalNotes([])
      }
    }
  }, [isOpen, isEdit, selectedFranchise])

  // Auto-focus note textarea
  useEffect(() => {
    if (isOpen && activeTab === "notes" && isAddingNote && specialNoteTextareaRef.current) {
      setTimeout(() => specialNoteTextareaRef.current?.focus(), 100)
    }
  }, [isOpen, activeTab, isAddingNote])

  if (!isOpen) return null

  // ── Note CRUD (matching EditAdminConfigModal) ──
  const handleAddNote = () => {
    if (!newNote.text.trim()) { toast.error("Please enter note text"); return }
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
    setNewNote({ status: "general", text: "", isImportant: false, startDate: "", endDate: "" })
    setIsAddingNote(false)
    toast.success("Note added")
  }

  const handleDeleteNote = (noteId) => {
    setLocalNotes(prev => prev.filter(n => n.id !== noteId))
    toast.success("Note removed")
  }

  const handleEditNoteClick = (note) => {
    setEditingNoteId(note.id)
    setNewNote({ status: note.status, text: note.text, isImportant: note.isImportant, startDate: note.startDate || "", endDate: note.endDate || "" })
    setIsAddingNote(true)
  }

  const handleUpdateNote = () => {
    if (!newNote.text.trim()) { toast.error("Please enter note text"); return }
    setLocalNotes(prev => prev.map(n =>
      n.id === editingNoteId
        ? { ...n, status: newNote.status, text: newNote.text.trim(), isImportant: newNote.isImportant, startDate: newNote.startDate || "", endDate: newNote.endDate || "" }
        : n
    ))
    setNewNote({ status: "general", text: "", isImportant: false, startDate: "", endDate: "" })
    setEditingNoteId(null)
    setIsAddingNote(false)
    toast.success("Note updated")
  }

  const getStatusInfo = (statusId) => {
    return NOTE_STATUSES.find(s => s.id === statusId) || NOTE_STATUSES[0]
  }

  // ── Save handler ──
  const handleSave = () => {
    // Derive backwards-compatible single-note fields from array
    const importantNote = localNotes.find(n => n.isImportant)
    const firstNote = localNotes[0]
    const primaryNote = importantNote || firstNote

    const formData = {
      ...franchiseForm,
      notes: localNotes,
      specialNote: primaryNote ? primaryNote.text : "",
      noteImportance: primaryNote?.isImportant ? "important" : "unimportant",
      noteStartDate: primaryNote?.startDate || "",
      noteEndDate: primaryNote?.endDate || "",
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[10000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">

        {/* ── Sticky Header ── */}
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              {isEdit ? "Edit Franchise" : "Create New Franchise"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tab Navigation (matching EditAdminConfigModal) */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "notes" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Special Notes{localNotes.length > 0 ? ` (${localNotes.length})` : ""}
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">

          {/* ═══════════ Details Tab ═══════════ */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="bg-[#161616] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Franchise Logo</h3>
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    {franchiseForm.logo ? (
                      <img src={franchiseForm.logo || "/placeholder.svg"} alt="Franchise Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={24} className="text-white" />
                    )}
                  </div>
                  <input type="file" id="franchiseLogo" className="hidden" accept="image/*" onChange={onLogoUpload} />
                  <label htmlFor="franchiseLogo" className="bg-[#2F2F2F] hover:bg-[#3F3F3F] px-6 py-2 rounded-xl text-sm cursor-pointer text-white transition-colors">
                    {franchiseForm.logo ? "Change Logo" : "Upload Logo"}
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-[#161616] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Franchise Name</label>
                    <input type="text" name="name" value={franchiseForm.name} onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
                    <input
                      type="text" name="ownerFirstName"
                      value={`${franchiseForm.ownerFirstName} ${franchiseForm.ownerLastName}`.trim()}
                      onChange={(e) => {
                        const fullName = e.target.value.trim()
                        const nameParts = fullName.split(" ")
                        onInputChange({ target: { name: "ownerFirstName", value: nameParts[0] || "" } })
                        onInputChange({ target: { name: "ownerLastName", value: nameParts.slice(1).join(" ") || "" } })
                      }}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Email</label>
                      <input type="email" name="email" value={franchiseForm.email} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Phone</label>
                      <input type="tel" name="phone" value={franchiseForm.phone} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Website</label>
                      <input type="text" name="website" value={franchiseForm.website} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Country</label>
                      <select name="country" value={franchiseForm.country} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50">
                        <option value="">Select Country</option>
                        <option value="Germany">Germany</option>
                        <option value="Austria">Austria</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Street Address</label>
                    <input type="text" name="street" value={franchiseForm.street} onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                      <input type="text" name="zipCode" value={franchiseForm.zipCode} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">City</label>
                      <input type="text" name="city" value={franchiseForm.city} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-[#161616] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">About Franchise</h3>
                <textarea name="about" value={franchiseForm.about} onChange={onInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2.5 text-white outline-none text-sm min-h-[120px] border border-[#333333] focus:border-orange-500/50"
                  placeholder="Describe your franchise, mission, values, services offered, etc..." />
              </div>

              {/* Login Credentials */}
              <div className="bg-[#161616] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Login Credentials</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Login Email</label>
                    <input type="email" name="loginEmail" value={franchiseForm.loginEmail} onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Password</label>
                      <input type="password" name="loginPassword" value={franchiseForm.loginPassword} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Confirm Password</label>
                      <input type="password" name="confirmPassword" value={franchiseForm.confirmPassword} onChange={onInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2.5 text-white outline-none text-sm border border-[#333333] focus:border-orange-500/50" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ Special Notes Tab (matching EditAdminConfigModal) ═══════════ */}
          {activeTab === "notes" && (
            <div className="border border-slate-700 rounded-xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                  <p className="text-white font-medium">{isEdit ? selectedFranchise?.name || "Franchise" : franchiseForm.name || "New Franchise"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isAddingNote) {
                      setEditingNoteId(null)
                      setNewNote({ status: "general", text: "", isImportant: false, startDate: "", endDate: "" })
                    }
                    setIsAddingNote(!isAddingNote)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isAddingNote ? "bg-gray-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {isAddingNote ? "Cancel" : <><Plus size={14} /> Add Note</>}
                </button>
              </div>

              {/* Add / Edit Note Form */}
              {isAddingNote && (
                <div className="mb-4 p-4 bg-[#101010] rounded-xl space-y-3">
                  {/* Status */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Status</label>
                    <select
                      value={newNote.status}
                      onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
                      className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {NOTE_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Text */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Note</label>
                    <textarea
                      ref={specialNoteTextareaRef}
                      value={newNote.text}
                      onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                      className="w-full bg-[#222] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[80px]"
                      placeholder="Enter note..."
                    />
                  </div>

                  {/* Important */}
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

                  {/* Date Range */}
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

              {/* Notes List */}
              {!isAddingNote && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {localNotes.length > 0 ? (
                    [...localNotes]
                      .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                      .map((note) => {
                        const statusInfo = getStatusInfo(note.status)
                        const isExpanded = expandedNoteId === note.id

                        return (
                          <div key={note.id} className="bg-[#101010] rounded-lg overflow-hidden">
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
                                  onClick={(e) => { e.stopPropagation(); handleEditNoteClick(note) }}
                                  className="text-gray-500 hover:text-blue-400 p-1"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id) }}
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

                            {/* Preview (collapsed) */}
                            {!isExpanded && (
                              <div className="px-3 pb-2">
                                <p className="text-gray-400 text-sm truncate">{note.text}</p>
                                {(note.startDate || note.endDate) && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {note.startDate && note.endDate ? (
                                      <>Valid: {note.startDate} – {note.endDate}</>
                                    ) : note.startDate ? (
                                      <>Valid from: {note.startDate}</>
                                    ) : (
                                      <>Valid until: {note.endDate}</>
                                    )}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Full Content (expanded) */}
                            {isExpanded && (
                              <div className="px-3 pb-3 border-t border-gray-800">
                                <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">{note.text}</p>
                                {(note.startDate || note.endDate) && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    {note.startDate && note.endDate ? (
                                      <>Valid: {note.startDate} – {note.endDate}</>
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
                      No special notes yet. Click &quot;Add Note&quot; to create one.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky Footer ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-700">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl py-2.5 text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={() => {
                  const isArchived = selectedFranchise?.isArchived
                  const action = isArchived ? "unarchive" : "archive"
                  if (window.confirm(`Are you sure you want to ${action} "${selectedFranchise?.name}"?`)) {
                    onArchive(selectedFranchise.id, !isArchived)
                    onClose()
                  }
                }}
                className={`flex-1 ${selectedFranchise?.isArchived ? "bg-[#2F2F2F] hover:bg-[#3F3F3F]" : "bg-red-600 hover:bg-red-700"} text-white rounded-xl py-2.5 text-sm cursor-pointer transition-colors`}
              >
                {selectedFranchise?.isArchived ? "Unarchive" : "Archive"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm cursor-pointer transition-colors"
            >
              {isEdit ? "Save Changes" : "Create Franchise"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FranchiseModal
