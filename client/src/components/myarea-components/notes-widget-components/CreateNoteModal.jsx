/* eslint-disable react/prop-types */
// CreateNoteModal.jsx
import { useState } from "react"
import Modal from "./Modal"

function CreateNoteModal({ isOpen, onClose, onSave }) {
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "personal" })

  const handleSave = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      onSave({
        title: newNote.title || "Untitled",
        content: newNote.content,
        category: newNote.category,
      })
      setNewNote({ title: "", content: "", category: "personal" })
      onClose()
    }
  }

  const handleClose = () => {
    setNewNote({ title: "", content: "", category: "personal" })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Note">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
            placeholder="Enter note title..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={newNote.category}
            onChange={(e) => setNewNote((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
          >
            <option value="personal">Personal</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
            rows={8}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
            placeholder="Write your note here..."
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-600 cursor-pointer text-sm hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 cursor-pointer text-sm text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Create Note
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateNoteModal