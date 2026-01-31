/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, Tag, Paperclip, ChevronDown, Pin, PinOff, Copy, ArrowRightLeft, Trash2 } from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import TagManagerModal from "../TagManagerModal"
import ImageSourceModal from "../image-handler/ImageSourceModal"
import MediaLibraryPickerModal from "../image-handler/MediaLibraryPickerModal"

// Quill editor configuration
const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
}

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link'
]

// ============================================
// Unified Note Modal - Handles both Add & Edit
// ============================================
const NoteModal = ({ 
  mode = "add", // "add" or "edit"
  note = null, // For edit mode
  onClose, 
  onSave, // Generic save handler for both add and edit
  availableTags = [],
  onAddTag,
  onDeleteTag,
  category = "personal", // Current tab (personal or studio)
  // Mobile action handlers (only used in edit mode)
  onDelete,
  onDuplicate,
  onPinToggle,
  onMoveToOtherTab
}) => {
  const isEditMode = mode === "edit" && note
  
  const [noteTitle, setNoteTitle] = useState(note?.title || "")
  const [noteContent, setNoteContent] = useState(note?.content || "")
  const [selectedTags, setSelectedTags] = useState(note?.tags || [])
  const [attachments, setAttachments] = useState(note?.attachments || [])
  
  const [showTagsModal, setShowTagsModal] = useState(false)
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false)
  
  const titleInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const mobileActionsMenuRef = useRef(null)

  // Sync data when note prop changes (important for edit mode)
  useEffect(() => {
    if (note) {
      setNoteTitle(note.title || "")
      setNoteContent(note.content || "")
      setSelectedTags(note.tags || [])
      setAttachments(note.attachments || [])
    }
  }, [note])

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100)
    }
  }, [])

  // Close mobile actions menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileActionsMenuRef.current && !mobileActionsMenuRef.current.contains(event.target)) {
        setShowMobileActionsMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Editor styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .note-modal-editor {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #404040;
      }
      .note-modal-editor:focus-within {
        border-color: #3b82f6;
      }
      .note-modal-editor .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #404040 !important;
        background-color: #1F1F1F !important;
        padding: 8px !important;
      }
      .note-modal-editor .ql-container.ql-snow {
        border: none !important;
      }
      .note-modal-editor .ql-editor {
        color: #e5e7eb !important;
        background-color: #181818 !important;
        min-height: 200px;
        max-height: 300px;
        font-size: 14px;
        line-height: 1.6;
        overflow-y: auto;
      }
      .note-modal-editor .ql-editor.ql-blank::before {
        color: #6b7280 !important;
        font-style: normal !important;
      }
      .note-modal-editor .ql-snow .ql-stroke { stroke: #9ca3af !important; }
      .note-modal-editor .ql-snow .ql-fill { fill: #9ca3af !important; }
      .note-modal-editor .ql-snow .ql-picker-label { color: #9ca3af !important; }
      .note-modal-editor .ql-snow .ql-picker-options { background-color: #1f1f1f !important; border-color: #404040 !important; }
      .note-modal-editor .ql-snow .ql-picker-item { color: #e5e7eb !important; }
      .note-modal-editor .ql-snow .ql-picker-item:hover { color: #3b82f6 !important; }
      .note-modal-editor .ql-snow button:hover .ql-stroke { stroke: #3b82f6 !important; }
      .note-modal-editor .ql-snow button:hover .ql-fill { fill: #3b82f6 !important; }
      .note-modal-editor .ql-snow button.ql-active .ql-stroke { stroke: #3b82f6 !important; }
      .note-modal-editor .ql-snow button.ql-active .ql-fill { fill: #3b82f6 !important; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleSave = () => {
    if (!noteTitle.trim() && !noteContent.trim()) return

    if (isEditMode) {
      // Edit mode - update existing note
      const updatedNote = {
        ...note,
        title: noteTitle.trim() || "Untitled",
        content: noteContent,
        tags: selectedTags,
        attachments: attachments,
        updatedAt: new Date().toISOString(),
      }
      onSave(updatedNote)
    } else {
      // Add mode - create new note
      const newNote = {
        id: Date.now(),
        title: noteTitle.trim() || "Untitled",
        content: noteContent,
        tags: selectedTags,
        attachments: attachments,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onSave(newNote, category)
    }
    
    onClose()
  }

  const getTagColor = (tagId) => {
    const tag = availableTags.find((t) => t.id === tagId)
    return tag ? tag.color : "#3b82f6"
  }

  const getTagName = (tagId) => {
    const tag = availableTags.find((t) => t.id === tagId)
    return tag ? tag.name : tagId
  }

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }))
    setAttachments([...attachments, ...newAttachments])
  }

  const handleMediaLibrarySelect = (imageUrl) => {
    const filename = imageUrl.split('/').pop() || `media-${Date.now()}.jpg`
    const newAttachment = {
      name: filename,
      url: imageUrl,
      file: null
    }
    setAttachments([...attachments, newAttachment])
    setShowMediaLibraryModal(false)
    setShowImageSourceModal(false)
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#181818] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">
              {isEditMode ? "Edit Note" : "New Note"}
            </h2>
            <div className="flex items-center gap-2">
              {/* 3-Dot Actions Menu - Edit mode only */}
              {isEditMode && (
                <div className="relative" ref={mobileActionsMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMobileActionsMenu(!showMobileActionsMenu)
                    }}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="More actions"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>

                  {showMobileActionsMenu && (
                    <>
                      {/* Overlay to close menu */}
                      <div 
                        className="fixed inset-0 z-[9998]" 
                        onClick={() => setShowMobileActionsMenu(false)}
                      />
                      <div 
                        className="fixed bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-xl min-w-[180px] z-[9999]"
                        style={{
                          top: mobileActionsMenuRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                          right: (window.innerWidth - mobileActionsMenuRef.current?.getBoundingClientRect().right) + 'px'
                        }}
                      >
                        <div className="py-1">
                          {/* Pin/Unpin */}
                          {onPinToggle && (
                            <button
                              onClick={() => {
                                onPinToggle(note.id)
                                setShowMobileActionsMenu(false)
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                            >
                              {note?.isPinned ? (
                                <>
                                  <PinOff size={16} />
                                  <span>Unpin Note</span>
                                </>
                              ) : (
                                <>
                                  <Pin size={16} />
                                  <span>Pin Note</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          {/* Duplicate */}
                          {onDuplicate && (
                            <button
                              onClick={() => {
                                onDuplicate(note)
                                setShowMobileActionsMenu(false)
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                            >
                              <Copy size={16} />
                              <span>Duplicate</span>
                            </button>
                          )}
                          
                          {/* Move to Other Tab */}
                          {onMoveToOtherTab && (
                            <button
                              onClick={() => {
                                onMoveToOtherTab(note)
                                setShowMobileActionsMenu(false)
                                onClose()
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                            >
                              <ArrowRightLeft size={16} />
                              <span>Move to {category === 'personal' ? 'Studio' : 'Personal'}</span>
                            </button>
                          )}
                          
                          <div className="border-t border-gray-700 my-1"></div>
                          
                          {/* Delete */}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(note.id)
                                setShowMobileActionsMenu(false)
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-red-500"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Note Title */}
            <div className="p-4 border-b border-gray-700">
              <input
                ref={titleInputRef}
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder-gray-500"
              />
              {isEditMode && note?.createdAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Created: {formatDateTime(note.createdAt)}
                  {note.updatedAt !== note.createdAt && (
                    <span className="ml-3">Updated: {formatDateTime(note.updatedAt)}</span>
                  )}
                </p>
              )}
            </div>

            {/* Tags Section */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Tags</p>
                </div>
                <button 
                  onClick={() => setShowTagsModal(true)} 
                  className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Manage Tags
                </button>
              </div>
              
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        selectedTags.includes(tag.id) ? "text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                      style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined }}
                    >
                      <Tag size={10} />
                      {tag.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags available. Create tags in Tag Manager.</p>
              )}
            </div>

            {/* Note Content - WYSIWYG Editor */}
            <div className="p-4 border-b border-gray-700">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-300">Content</p>
              </div>
              <div className="note-modal-editor">
                <ReactQuill
                  value={noteContent}
                  onChange={setNoteContent}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Start writing..."
                  theme="snow"
                />
              </div>
            </div>

            {/* Attachments Section */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Paperclip size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">
                    Attachments {attachments.length > 0 && `(${attachments.length})`}
                  </p>
                </div>
                <button
                  onClick={() => setShowImageSourceModal(true)}
                  className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Add Images
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-20 object-cover rounded-lg border border-gray-700"
                      />
                      <button
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
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2F2F2F] text-sm text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!noteTitle.trim() && !noteContent.trim()}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                noteTitle.trim() || noteContent.trim()
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isEditMode ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Tags Management Modal */}
      <TagManagerModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={availableTags}
        onAddTag={onAddTag}
        onDeleteTag={onDeleteTag}
      />

      {/* Image Source Modal */}
      <ImageSourceModal
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
        onSelectFile={() => fileInputRef.current?.click()}
        onSelectMediaLibrary={() => setShowMediaLibraryModal(true)}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        onSelectImage={handleMediaLibrarySelect}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </>
  )
}

export default NoteModal
