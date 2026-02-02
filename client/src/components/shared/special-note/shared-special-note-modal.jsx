/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, StickyNote } from "lucide-react"
import { toast } from "react-hot-toast"
import { createPortal } from "react-dom"

// Note Status Options - Shared between Leads and Members
export const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

// Helper function to get status label
export const getStatusLabel = (statusId) => {
  const status = NOTE_STATUSES.find(s => s.id === statusId)
  return status ? status.label : "General"
}

/**
 * Shared SpecialNoteModal - Works for both Leads and Members
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Close handler
 * @param {object} entity - The lead or member object
 * @param {function} onSave - Save handler: (entityId, newNote, extraData?) => void
 * @param {string} entityType - "lead" or "member" (for display purposes)
 * @param {any} extraData - Optional extra data to pass to onSave (e.g., targetColumnId for leads)
 */
export const SpecialNoteModal = ({ 
  isOpen, 
  onClose, 
  entity, 
  onSave, 
  entityType = "member",
  extraData = null 
}) => {
  const [formData, setFormData] = useState({
    status: "general",
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
  })

  useEffect(() => {
    if (isOpen && entity) {
      // Reset form for new note
      setFormData({
        status: "general",
        note: "",
        noteImportance: "unimportant",
        noteStartDate: "",
        noteEndDate: "",
      })
    }
  }, [isOpen, entity])

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!formData.note.trim()) {
      toast.error("Please enter a note")
      return
    }

    if (formData.noteStartDate && formData.noteEndDate) {
      const startDate = new Date(formData.noteStartDate)
      const endDate = new Date(formData.noteEndDate)

      if (endDate < startDate) {
        toast.error("End date cannot be before start date")
        return
      }
    }

    // Create new note object
    const newNote = {
      id: Date.now(),
      status: formData.status,
      text: formData.note.trim(),
      isImportant: formData.noteImportance === "important",
      startDate: formData.noteStartDate || "",
      endDate: formData.noteEndDate || "",
      createdAt: new Date().toISOString(),
    }

    // Call onSave with or without extraData based on entityType
    if (extraData !== null) {
      onSave(entity.id, newNote, extraData)
    } else {
      onSave(entity.id, newNote)
    }
    onClose()
  }

  const handleClose = () => {
    setFormData({
      status: "general",
      note: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
    })
    onClose()
  }

  if (!isOpen) return null

  // Get entity name for display
  const getEntityName = () => {
    if (!entity) return ""
    if (entity.firstName && entity.lastName) {
      return `${entity.firstName} ${entity.lastName}`
    }
    if (entity.name) return entity.name
    if (entity.title) return entity.title
    return ""
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 1000010 }}
    >
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <StickyNote size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Add Special Note</h2>
                {getEntityName() && (
                  <p className="text-sm text-gray-400">
                    {entityType === "lead" ? "Lead" : "Member"}: {getEntityName()}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Special Note Form */}
          <div className="border border-slate-700 rounded-xl p-4 space-y-4">
            {/* Status Selection */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => updateFormData("status", e.target.value)}
                className="w-full bg-[#101010] text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-blue-500"
              >
                {NOTE_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Note Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-200">Note</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noteImportance"
                    checked={formData.noteImportance === "important"}
                    onChange={(e) => {
                      updateFormData("noteImportance", e.target.checked ? "important" : "unimportant")
                    }}
                    className="mr-2 h-4 w-4 accent-blue-500"
                  />
                  <label htmlFor="noteImportance" className="text-sm text-gray-200">
                    Important
                  </label>
                </div>
              </div>
              <textarea
                value={formData.note}
                onChange={(e) => updateFormData("note", e.target.value)}
                className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter note..."
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Valid From (optional)</label>
                <input
                  type="date"
                  value={formData.noteStartDate}
                  onChange={(e) => updateFormData("noteStartDate", e.target.value)}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm [color-scheme:dark] border border-transparent focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Valid Until (optional)</label>
                <input
                  type="date"
                  value={formData.noteEndDate}
                  onChange={(e) => updateFormData("noteEndDate", e.target.value)}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm [color-scheme:dark] border border-transparent focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button 
              onClick={handleClose} 
              className="px-4 py-2 text-sm rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Backward compatible exports for existing code
export const LeadSpecialNoteModal = ({ isOpen, onClose, lead, onSave, targetColumnId }) => (
  <SpecialNoteModal
    isOpen={isOpen}
    onClose={onClose}
    entity={lead}
    onSave={onSave}
    entityType="lead"
    extraData={targetColumnId}
  />
)

export const MemberSpecialNoteModal = ({ isOpen, onClose, member, onSave }) => (
  <SpecialNoteModal
    isOpen={isOpen}
    onClose={onClose}
    entity={member}
    onSave={onSave}
    entityType="member"
  />
)

export default SpecialNoteModal
