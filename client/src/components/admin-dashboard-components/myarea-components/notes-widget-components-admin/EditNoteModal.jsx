/* eslint-disable react/prop-types */
// EditNoteModal.jsx
import { useEffect, useState } from "react"
import Modal from "./Modal"

function EditNoteModal({ isOpen, onClose, note, onSave }) {
  const [editedNote, setEditedNote] = useState({
    title: note?.title || "",
    content: note?.content || "",
  })

  useEffect(() => {
    if (note) {
      setEditedNote({
        title: note.title,
        content: note.content,
      })
    }
  }, [note])

  const handleSave = () => {
    if (editedNote.title.trim() || editedNote.content.trim()) {
      onSave({
        title: editedNote.title || "Untitled",
        content: editedNote.content,
      })
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Note">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
            placeholder="Enter note title..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote((prev) => ({ ...prev, content: e.target.value }))}
            rows={8}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
            placeholder="Write your note here..."
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditNoteModal