/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react"
import { Tag, X, Paperclip } from "lucide-react"
import Modal from "./Modal"

function EditNoteModal({ isOpen, onClose, note, onSave, availableTags = [] }) {
  const [editedNote, setEditedNote] = useState({
    title: note?.title || "",
    content: note?.content || "",
    tags: note?.tags || [],
    attachments: note?.attachments || [],
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (note) {
      setEditedNote({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        attachments: note.attachments || [],
      })
    }
  }, [note])

  const handleSave = () => {
    if (editedNote.title.trim() || editedNote.content.trim()) {
      onSave({
        title: editedNote.title || "Untitled",
        content: editedNote.content,
        tags: editedNote.tags,
        attachments: editedNote.attachments,
      })
      onClose()
    }
  }

  const toggleTag = (tagId) => {
    setEditedNote(prev => ({
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
    setEditedNote(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (index) => {
    setEditedNote(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
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
                    editedNote.tags.includes(tag.id)
                      ? "text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                  style={{
                    backgroundColor: editedNote.tags.includes(tag.id) ? tag.color : undefined
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
          
          {editedNote.attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {editedNote.attachments.map((attachment, index) => (
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
            onClick={onClose}
            className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-sm cursor-pointer text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditNoteModal
