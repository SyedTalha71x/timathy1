/* eslint-disable react/prop-types */


import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { toast } from "react-hot-toast"
import { createPortal } from "react-dom"

export const SpecialNoteEditModal = ({ isOpen, onClose, appointment, onSave }) => {
  const [formData, setFormData] = useState({
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
  })

  useEffect(() => {
    if (isOpen && appointment) {
      setFormData({
        note: appointment.specialNote?.text || "",
        noteImportance: appointment.specialNote?.isImportant ? "important" : "unimportant",
        noteStartDate: appointment.specialNote?.startDate || "",
        noteEndDate: appointment.specialNote?.endDate || "",
      })
    }
  }, [isOpen, appointment])

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (formData.noteStartDate && formData.noteEndDate) {
      const startDate = new Date(formData.noteStartDate)
      const endDate = new Date(formData.noteEndDate)

      if (endDate < startDate) {
        toast.error("End date cannot be before start date")
        return
      }
    }

    const updatedNote = {
      text: formData.note,
      isImportant: formData.noteImportance === "important",
      startDate: formData.noteStartDate || null,
      endDate: formData.noteEndDate || null,
    }

    onSave(appointment.id, updatedNote)
    onClose()
  }

  const handleClose = () => {
    setFormData({
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
            <h2 className="text-lg font-semibold text-white">Edit Special Note</h2>
            <button onClick={handleClose} className="p-2 hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* Appointment Info */}
          {appointment && (
            <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
               <img src="/gray-avatar-fotor-20250912192528.png" alt="" className="rounded-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{appointment.name} {appointment.lastName}</h3>
              </div>
            </div>
          )}

          {/* Special Note Form */}
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
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">End Date</label>
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
            <button onClick={handleClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700 text-gray-300">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
