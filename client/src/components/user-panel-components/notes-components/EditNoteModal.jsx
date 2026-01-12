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
  const [viewingImage, setViewingImage] = useState(null) // { image, images, index }
  const fileInputRef = useRef(null)

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!viewingImage) return
      
      if (event.key === 'Escape') {
        setViewingImage(null)
      } else if (event.key === 'ArrowLeft') {
        const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
        setViewingImage({
          ...viewingImage,
          image: viewingImage.images[newIndex],
          index: newIndex
        })
      } else if (event.key === 'ArrowRight') {
        const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
        setViewingImage({
          ...viewingImage,
          image: viewingImage.images[newIndex],
          index: newIndex
        })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [viewingImage])

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
    <>
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Note"
      footer={
        <div className="flex gap-3">
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
      }
    >
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
                  <div
                    className="cursor-pointer"
                    onClick={() => setViewingImage({
                      image: attachment,
                      images: editedNote.attachments,
                      index: index
                    })}
                  >
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-full h-20 object-cover rounded-lg border border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-gray-800 px-3 py-1 rounded">View</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeAttachment(index)
                    }}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>

    {/* Image Lightbox Modal */}
    {viewingImage && viewingImage.image && (
      <div 
        className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
        onClick={() => setViewingImage(null)}
      >
        {/* Close Button */}
        <button
          onClick={() => setViewingImage(null)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
          aria-label="Close image"
        >
          <X size={32} />
        </button>

        {/* Previous Button */}
        {viewingImage.images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
              setViewingImage({
                ...viewingImage,
                image: viewingImage.images[newIndex],
                index: newIndex
              })
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {viewingImage.images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
              setViewingImage({
                ...viewingImage,
                image: viewingImage.images[newIndex],
                index: newIndex
              })
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image Container */}
        <div 
          className="max-w-[90vw] max-h-[90vh] flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Filename above image */}
          <div className="bg-black/60 rounded-lg px-4 py-3 backdrop-blur-sm">
            <p className="text-white text-sm font-medium text-center">
              {viewingImage.image.name}
              {viewingImage.images.length > 1 && (
                <span className="text-gray-400 ml-2">
                  ({viewingImage.index + 1}/{viewingImage.images.length})
                </span>
              )}
            </p>
          </div>
          
          {/* Image */}
          <img 
            src={viewingImage.image.url} 
            alt={viewingImage.image.name}
            className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
          />
        </div>
      </div>
    )}
  </>
  )
}

export default EditNoteModal
