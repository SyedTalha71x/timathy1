/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, Tag, Paperclip, ChevronDown, Pin, PinOff, Copy, ArrowRightLeft, Trash2 } from "lucide-react"
import { WysiwygEditor } from "../WysiwygEditor"
import TagManagerModal from "../TagManagerModal"
import ImageSourceModal from "../image-handler/ImageSourceModal"
import MediaLibraryPickerModal from "../image-handler/MediaLibraryPickerModal"

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
  const [isPinned, setIsPinned] = useState(note?.isPinned || false)
  
  const [showTagsModal, setShowTagsModal] = useState(false)
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false)
  
  const titleInputRef = useRef(null)
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)
  const mobileActionsMenuRef = useRef(null)

  // Sync data when note prop changes (important for edit mode)
  useEffect(() => {
    if (note) {
      setNoteTitle(note.title || "")
      setNoteContent(note.content || "")
      setSelectedTags(note.tags || [])
      setAttachments(note.attachments || [])
      setIsPinned(note.isPinned || false)
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
        isPinned: isPinned,
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
        isPinned: isPinned,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onSave(newNote, category)
    }
    
    onClose()
  }

  const getTagColor = (tagId) => {
    const tag = availableTags.find((t) => t.id === tagId)
    return tag ? tag.color : "var(--color-primary)"
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
        <div className="bg-surface-card rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-content-primary">
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
                    className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
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
                        className="fixed bg-surface-card border border-border rounded-xl shadow-xl min-w-[180px] z-[9999]"
                        style={{
                          top: mobileActionsMenuRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                          right: (window.innerWidth - mobileActionsMenuRef.current?.getBoundingClientRect().right) + 'px'
                        }}
                      >
                        <div className="py-1">
                          {/* Pin/Unpin - uses local state, saved with Save Changes */}
                          {isEditMode && (
                            <button
                              onClick={() => {
                                setIsPinned(!isPinned)
                                setShowMobileActionsMenu(false)
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                            >
                              {isPinned ? (
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
                                onClose()
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
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
                              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                            >
                              <ArrowRightLeft size={16} />
                              <span>Move to {category === 'personal' ? 'Studio' : 'Personal'}</span>
                            </button>
                          )}
                          
                          <div className="border-t border-border my-1"></div>
                          
                          {/* Delete */}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(note.id)
                                setShowMobileActionsMenu(false)
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-accent-red"
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
                className="text-content-muted hover:text-content-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Note Title */}
            <div className="p-4 border-b border-border">
              <input
                ref={titleInputRef}
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full bg-transparent text-xl font-bold text-content-primary outline-none placeholder-content-faint"
              />
              {isEditMode && note?.createdAt && (
                <p className="text-xs text-content-faint mt-2">
                  Created: {formatDateTime(note.createdAt)}
                  {note.updatedAt !== note.createdAt && (
                    <span className="ml-3">Updated: {formatDateTime(note.updatedAt)}</span>
                  )}
                </p>
              )}
            </div>

            {/* Tags Section */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-surface-button">
                  <Tag size={18} className="text-content-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-secondary">Tags</p>
                </div>
                <button 
                  onClick={() => setShowTagsModal(true)} 
                  className="text-xs text-primary hover:text-primary-hover transition-colors"
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
                        selectedTags.includes(tag.id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                      style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined }}
                    >
                      <Tag size={10} />
                      {tag.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-content-faint">No tags available. Create tags in Tag Manager.</p>
              )}
            </div>

            {/* Note Content - WYSIWYG Editor */}
            <div className="p-4 border-b border-border">
              <div className="mb-2">
                <p className="text-sm font-medium text-content-secondary">Content</p>
              </div>
              <div className="bg-surface-dark rounded-xl overflow-hidden">
                <WysiwygEditor
                  ref={editorRef}
                  value={noteContent}
                  onChange={setNoteContent}
                  placeholder="Start writing..."
                  minHeight={200}
                  maxHeight={300}
                />
              </div>
            </div>

            {/* Attachments Section */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-surface-button">
                  <Paperclip size={18} className="text-content-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-secondary">
                    Attachments {attachments.length > 0 && `(${attachments.length})`}
                  </p>
                </div>
                <button
                  onClick={() => setShowImageSourceModal(true)}
                  className="text-xs text-primary hover:text-primary-hover transition-colors"
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
                        className="w-full h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 bg-accent-red hover:bg-accent-red text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className="flex-shrink-0 p-4 border-t border-border flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-button text-sm text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!noteTitle.trim() && !noteContent.trim()}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                noteTitle.trim() || noteContent.trim()
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "bg-surface-dark text-content-faint cursor-not-allowed"
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

    </>
  )
}

export default NoteModal
