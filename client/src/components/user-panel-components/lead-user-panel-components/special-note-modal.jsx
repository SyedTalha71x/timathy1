/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { toast } from "react-hot-toast"
import { createPortal } from "react-dom"

// Note Status Options
const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

export const LeadSpecialNoteModal = ({ isOpen, onClose, lead, onSave, targetColumnId }) => {
    const [formData, setFormData] = useState({
        status: "general",
        note: "",
        noteImportance: "unimportant",
        noteStartDate: "",
        noteEndDate: "",
    })

    useEffect(() => {
        if (isOpen && lead) {
            // Reset form for new note
            setFormData({
                status: "general",
                note: "",
                noteImportance: "unimportant",
                noteStartDate: "",
                noteEndDate: "",
            })
        }
    }, [isOpen, lead])

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

        onSave(lead.id, newNote, targetColumnId)
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

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-white">Add Special Note</h2>
                        <button onClick={handleClose} className="p-2 rounded-lg text-gray-400">
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
                                className="w-full bg-[#101010] text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                                className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
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
                                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-200 block mb-2">Valid Until (optional)</label>
                                <input
                                    type="date"
                                    value={formData.noteEndDate}
                                    onChange={(e) => updateFormData("noteEndDate", e.target.value)}
                                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button onClick={handleClose} className="px-4 py-2 text-sm rounded-xl text-gray-300">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white"
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