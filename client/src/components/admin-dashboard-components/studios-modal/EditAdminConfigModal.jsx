/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Trash2, X, Plus, ChevronDown, ChevronUp, Pencil, Shield, Check } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"

// Note Status Options (studio-context)
const NOTE_STATUSES = [
  { id: "general", label: "General" },
  { id: "contract_issue", label: "Contract Issue" },
  { id: "onboarding", label: "Onboarding" },
  { id: "follow_up", label: "Follow-up" },
  { id: "compliance", label: "Compliance" },
  { id: "maintenance", label: "Maintenance" },
  { id: "escalation", label: "Escalation" },
]

// Access Roles matching configuration.jsx template card style
const ACCESS_ROLES = [
  { value: "Premium", label: "Premium", desc: "Full platform access with all features", color: "#f97316", bgClass: "bg-orange-500/10", textClass: "text-orange-400", borderClass: "border-orange-500/40", ringClass: "ring-orange-500/50" },
  { value: "Standard", label: "Standard", desc: "Standard access with core features", color: "#3b82f6", bgClass: "bg-blue-500/10", textClass: "text-blue-400", borderClass: "border-blue-500/40", ringClass: "ring-blue-500/50" },
  { value: "Basic", label: "Basic", desc: "Limited access with essential features only", color: "#6b7280", bgClass: "bg-gray-500/10", textClass: "text-gray-400", borderClass: "border-gray-500/40", ringClass: "ring-gray-500/50" },
]

// Source options & colors (matching edit-lead-modal)
const SOURCE_OPTIONS = [
  "Website",
  "Google Ads",
  "Social Media Ads",
  "Email Campaign",
  "Cold Call (Outbound)",
  "Inbound Call",
  "Referral",
  "Social Media",
  "Walk-in",
  "Phone Call",
  "Email",
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
    Referral: "bg-teal-600 text-teal-100",
    "Social Media": "bg-purple-600 text-purple-100",
    "Walk-in": "bg-amber-600 text-amber-100",
    "Phone Call": "bg-cyan-600 text-cyan-100",
    Email: "bg-orange-600 text-orange-100",
    Event: "bg-yellow-600 text-yellow-100",
    "Offline Advertising": "bg-pink-600 text-pink-100",
    Other: "bg-gray-600 text-gray-100",
  }
  return sourceColors[source] || "bg-gray-600 text-gray-100"
}

const EditAdminConfigModal = ({ isOpen, onClose, studio, onSave, initialTab = "details" }) => {
  const [activeTab, setActiveTab] = useState("details")
  const specialNoteTextareaRef = useRef(null)

  // Local form state
  const [about, setAbout] = useState("")
  const [accessRole, setAccessRole] = useState("Standard")
  const [leadSource, setLeadSource] = useState("")
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false)

  // Notes state (array-based, matching EditMemberModal)
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

  // Initialize form when studio changes
  useEffect(() => {
    if (isOpen && studio) {
      setAbout(studio.about || "")
      setAccessRole(studio.accessRole || "Standard")
      setLeadSource(studio.leadSource || "")
      setActiveTab(initialTab || "details")
      setIsSourceDropdownOpen(false)

      // Convert studio note format to array format
      if (studio.notes && Array.isArray(studio.notes)) {
        setLocalNotes(JSON.parse(JSON.stringify(studio.notes)))
      } else if (studio.note && studio.note.trim()) {
        setLocalNotes([{
          id: 1,
          status: "general",
          text: studio.note,
          isImportant: studio.noteImportance === "important" || studio.noteImportance === "critical",
          startDate: studio.noteStartDate || "",
          endDate: studio.noteEndDate || "",
          createdAt: new Date().toISOString(),
        }])
      } else {
        setLocalNotes([])
      }

      // Reset note form
      setIsAddingNote(false)
      setEditingNoteId(null)
      setExpandedNoteId(null)
      setNewNote({ status: "general", text: "", isImportant: false, startDate: "", endDate: "" })
    }
  }, [isOpen, studio, initialTab])

  // Auto-focus special note textarea
  useEffect(() => {
    if (isOpen && activeTab === "note" && specialNoteTextareaRef.current) {
      setTimeout(() => specialNoteTextareaRef.current?.focus(), 100)
    }
  }, [isOpen, activeTab])

  // ── Note CRUD ──────────────────────────────────────────
  const handleAddNote = (e) => {
    e.preventDefault()
    e.stopPropagation()
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
    setNewNote({ status: note.status, text: note.text, isImportant: note.isImportant, startDate: note.startDate || "", endDate: note.endDate || "" })
    setIsAddingNote(true)
  }

  const handleUpdateNote = (e) => {
    e.preventDefault()
    e.stopPropagation()
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
    return NOTE_STATUSES.find(s => s.id === statusId) || NOTE_STATUSES.find(s => s.id === "general")
  }

  // ── Save ───────────────────────────────────────────────
  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Derive backwards-compatible single-note fields from array
    const importantNote = localNotes.find(n => n.isImportant)
    const firstNote = localNotes[0]
    const primaryNote = importantNote || firstNote

    onSave({
      ...studio,
      about,
      accessRole,
      leadSource,
      notes: localNotes,
      note: primaryNote ? primaryNote.text : "",
      noteImportance: primaryNote?.isImportant ? "important" : "unimportant",
      noteStartDate: primaryNote?.startDate || "",
      noteEndDate: primaryNote?.endDate || "",
    })
    onClose()
    toast.success("Admin configuration saved")
  }

  const handleTabClick = (tabName, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveTab(tabName)
  }

  if (!isOpen || !studio) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000010] overflow-y-auto">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl text-white font-bold">Edit Admin Configuration</h2>
            <p className="text-sm text-gray-500 mt-0.5">{studio.name}</p>
          </div>
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
            Special Notes
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">

            {/* ═══════════ Details Tab ═══════════ */}
            {activeTab === "details" && (
              <>
                {/* Access Role – configuration.jsx template card style */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Access Role</label>
                  <div className="space-y-2">
                    {ACCESS_ROLES.map((role) => {
                      const isSelected = accessRole === role.value
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setAccessRole(role.value)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            isSelected
                              ? `${role.bgClass} ${role.borderClass} ring-1 ${role.ringClass}`
                              : "bg-[#141414] border-[#2F2F2F] hover:border-[#444]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Colored Shield icon – matches configuration.jsx template cards */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${role.color}20` }}
                            >
                              <Shield className="w-4 h-4" style={{ color: role.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium text-sm ${isSelected ? role.textClass : "text-white"}`}>{role.label}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                            </div>
                            {isSelected && (
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${role.color}30`, color: role.color }}
                              >
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Source – colored pill dropdown matching edit-lead-modal */}
                <div className="pt-4 border-t border-gray-700">
                  <label className="text-sm text-gray-200 block mb-2">Source</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white text-sm flex items-center justify-between"
                    >
                      {leadSource ? (
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getSourceColor(leadSource)}`}>
                          {leadSource}
                        </span>
                      ) : (
                        <span className="text-gray-500">Select Source</span>
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
                          {SOURCE_OPTIONS.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setLeadSource(option)
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

                {/* About */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Additional Information</div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">About</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                      placeholder="Enter studio details, focus areas, special features..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* ═══════════ Notes Tab ═══════════ */}
            {activeTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                {/* Studio Name Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                    <p className="text-white font-medium">{studio.name}</p>
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
                    {isAddingNote ? <>Cancel</> : <><Plus size={14} /> Add Note</>}
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
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
                                    onClick={(e) => { e.stopPropagation(); handleEditNoteClick(note, e) }}
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

                              {/* Preview (collapsed) */}
                              {!isExpanded && (
                                <div className="px-3 pb-2">
                                  <p className="text-gray-400 text-sm truncate">{note.text}</p>
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

                              {/* Full Content (expanded) */}
                              {isExpanded && (
                                <div className="px-3 pb-3 border-t border-gray-800">
                                  <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">{note.text}</p>
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
                        No special notes yet. Click &quot;Add Note&quot; to create one.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
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
              className="px-4 py-2 text-sm text-white rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAdminConfigModal
