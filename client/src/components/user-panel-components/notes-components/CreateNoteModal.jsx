/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { Tag, X, Paperclip, Plus } from "lucide-react"
import Modal from "./Modal"

function CreateNoteModal({ isOpen, onClose, onSave, availableTags = [] }) {
  const [newNote, setNewNote] = useState({ 
    title: "", 
    content: "",
    tags: [],
    attachments: []
  })
  const fileInputRef = useRef(null)

  const handleSave = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      onSave({
        title: newNote.title || "Untitled",
        content: newNote.content,
        tags: newNote.tags,
        attachments: newNote.attachments,
      })
      setNewNote({ title: "", content: "", tags: [], attachments: [] })
      onClose()
    }
  }

  const handleClose = () => {
    setNewNote({ title: "", content: "", tags: [], attachments: [] })
    onClose()
  }

  const toggleTag = (tagId) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId]
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }))
    setNewNote(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (index) => {
    setNewNote(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Note">
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
            rows={8}
            className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
            placeholder="Write your note here..."
          />
        </div>

        {/* Tags Section */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={14} />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    newNote.tags.includes(tag.id)
                      ? "text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                  style={{
                    backgroundColor: newNote.tags.includes(tag.id) ? tag.color : undefined
                  }}
                >
                  <Tag size={10} />
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachments Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Paperclip size={14} />
            Attachments
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Paperclip size={14} />
            Add Images
          </button>
          
          {newNote.attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {newNote.attachments.map((attachment, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-full h-20 object-cover rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            disabled={!newNote.content.trim()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed cursor-pointer text-sm text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={16} />
            Create Note
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateNoteModal
