/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Plus, MoreVertical, Edit, Trash2, Eye, Tag, Pin, PinOff, Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { Link } from "react-router-dom"
import NoteModal from "../../shared/notes/NoteModal"
import DeleteConfirmModal from "../../shared/notes/DeleteConfirmModal"
import { useDispatch, useSelector } from "react-redux"
import { 
  createPersonalNotesThunk, 
  createStudioNotesThunk, 
  getPersonalNotesThunk, 
  getStudioNotesThunk,
  deleteNoteThunk,
  updateNoteThunk
} from "../../../features/notes/noteSlice"

// Helper function to strip HTML tags for preview
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\s+/g, ' ').trim()
}

// Tab Configuration
const TAB_CONFIG = {
  personal: {
    label: "Personal",
  },
  studio: {
    label: "Studio",
  },
}

const NotesWidget = ({ isSidebarEditing, showHeader = true, maxItems = null }) => {

  const { personalNotes = [], studioNotes = [] } = useSelector((state) => state.notes || {})
  const dispatch = useDispatch()

  // Tab state
  const [activeTab, setActiveTab] = useState("personal")

  // Sort state
  const [sortBy, setSortBy] = useState("recentlyUpdated")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteModalMode, setNoteModalMode] = useState("add")
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})

  const dropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)
  // Measure actual item heights for maxItems constraint
  const listRef = useRef(null)
  const [computedMaxHeight, setComputedMaxHeight] = useState(null)

  // Fetch notes on mount
  useEffect(() => {
    dispatch(getPersonalNotesThunk())
    dispatch(getStudioNotesThunk())
  }, [dispatch])

  // Get notes based on active tab
  const getCurrentNotes = () => {
    let currentNotes = activeTab === "personal" ? personalNotes : studioNotes

    // Sort notes
    if (sortBy !== "custom" && currentNotes && currentNotes.length) {
      currentNotes = [...currentNotes].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case "title":
            comparison = (a.title || "").localeCompare(b.title || "")
            break
          case "recentlyUpdated":
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
            comparison = dateA - dateB
            break
          case "recentlyCreated":
            const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            comparison = createdA - createdB
            break
          default:
            comparison = 0
            break
        }

        return sortOrder === "asc" ? comparison : -comparison
      })
    }

    return currentNotes || []
  }

  // Calculate counts for each tab
  const tabCounts = {
    personal: personalNotes?.length || 0,
    studio: studioNotes?.length || 0,
  }

  useEffect(() => {
    if (!maxItems || !listRef.current) {
      setComputedMaxHeight(null)
      return
    }
    const frame = requestAnimationFrame(() => {
      const el = listRef.current
      if (!el) return
      const children = el.children
      if (children.length === 0) { setComputedMaxHeight(null); return }
      const count = Math.min(maxItems, children.length)
      const firstRect = children[0].getBoundingClientRect()
      const lastRect = children[count - 1].getBoundingClientRect()
      setComputedMaxHeight(lastRect.bottom - firstRect.top + 4)
    })
    return () => cancelAnimationFrame(frame)
  }, [maxItems, personalNotes, studioNotes, activeTab])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle create note
  const handleCreateNote = async (newNote, category) => {
    setIsLoading(true)
    try {
      if (category === 'studio') {
        await dispatch(createStudioNotesThunk(newNote)).unwrap()
      } else {
        await dispatch(createPersonalNotesThunk(newNote)).unwrap()
      }
      
      // Refetch notes after creation
      await dispatch(getPersonalNotesThunk())
      await dispatch(getStudioNotesThunk())
      
      console.log("Note created successfully:", newNote)
      setShowNoteModal(false)
    } catch (error) {
      console.error("Error creating note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle update note
  const handleUpdateNote = async (updatedNote) => {
    setIsLoading(true)
    try {
      await dispatch(updateNoteThunk({
        noteId: updatedNote._id,
        noteData: updatedNote
      })).unwrap()
      
      // Refetch notes after update
      await dispatch(getPersonalNotesThunk())
      await dispatch(getStudioNotesThunk())
      
      console.log("Note updated successfully:", updatedNote)
      setShowNoteModal(false)
      setSelectedNote(null)
    } catch (error) {
      console.error("Error updating note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete note
  const handleDeleteNote = async () => {
    if (noteToDelete) {
      setIsLoading(true)
      try {
        await dispatch(deleteNoteThunk(noteToDelete._id)).unwrap()
        
        // Refetch notes after deletion
        await dispatch(getPersonalNotesThunk())
        await dispatch(getStudioNotesThunk())
        
        console.log("Note deleted successfully:", noteToDelete)
        setNoteToDelete(null)
        setShowDeleteModal(false)
      } catch (error) {
        console.error("Error deleting note:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle edit click
  const handleEditClick = (note) => {
    setSelectedNote(note)
    setNoteModalMode("edit")
    setShowNoteModal(true)
    setOpenDropdownId(null)
  }

  // Handle delete click
  const handleDeleteClick = (note) => {
    setNoteToDelete(note)
    setShowDeleteModal(true)
    setOpenDropdownId(null)
  }

  // Handle create click
  const handleCreateClick = () => {
    setSelectedNote(null)
    setNoteModalMode("add")
    setShowNoteModal(true)
  }

  // Toggle dropdown
  const handleDropdownToggle = (noteId, event) => {
    if (openDropdownId === noteId) {
      setOpenDropdownId(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 80
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    setDropdownPosition({
      [noteId]: openUpwards ? 'top' : 'bottom'
    })
    setOpenDropdownId(noteId)
  }

  // Get tag by ID - handles both string IDs and tag objects
  const getTagById = (tagId) => {
    // If tagId is an object with name and color, return it directly
    if (typeof tagId === 'object' && tagId.name && tagId.color) {
      return tagId
    }
    // For now, return a default tag since we don't have the actual tags from backend
    // You should fetch tags from your backend and use them here
    return {
      id: tagId,
      name: typeof tagId === 'string' ? tagId : 'Tag',
      color: '#6b7280' // Default gray color
    }
  }

  // Handle tag management
  const handleAddTag = (newTag) => {
    // This would be implemented when you have tag management
    console.log("Add tag:", newTag)
  }

  const handleDeleteTag = (tagId) => {
    // This would be implemented when you have tag management
    console.log("Delete tag:", tagId)
  }

  // Handle pin toggle
  const handlePinToggle = async (noteId) => {
    const note = currentNotes.find(n => n._id === noteId)
    if (note) {
      const updatedNote = { ...note, isPinned: !note.isPinned }
      await handleUpdateNote(updatedNote)
    }
  }

  // Handle duplicate note
  const handleDuplicateNote = async (note) => {
    const duplicatedNote = {
      ...note,
      title: `${note.title} (Copy)`,
      _id: undefined, // Remove ID so it creates a new one
    }
    await handleCreateNote(duplicatedNote, activeTab)
  }

  // Handle move note to other tab
  const handleMoveNote = async (note) => {
    const targetTab = activeTab === 'personal' ? 'studio' : 'personal'
    // Here you would update the note's category
    console.log("Move note to:", targetTab, note)
  }

  // Handle delete from modal
  const handleDeleteFromModal = async (noteId) => {
    setIsLoading(true)
    try {
      await dispatch(deleteNoteThunk(noteId)).unwrap()
      await dispatch(getPersonalNotesThunk())
      await dispatch(getStudioNotesThunk())
      setShowNoteModal(false)
      setSelectedNote(null)
    } catch (error) {
      console.error("Error deleting note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  const truncateText = (text, maxLength = 80) => {
    const plainText = stripHtmlTags(text)
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength - 3) + "..."
  }

  const currentNotes = getCurrentNotes()

  return (
    <div className={`p-4 rounded-xl bg-surface-button flex flex-col space-y-3 ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
      {/* Header - Full version with title (My Area) */}
      {showHeader && (
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => !isSidebarEditing && setIsSortDropdownOpen(!isSortDropdownOpen)}
                disabled={isSidebarEditing}
                className={`p-1.5 bg-surface-base rounded-lg text-content-muted hover:text-content-primary transition-colors ${isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                title="Sort notes"
              >
                {sortOrder === "asc" ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                )}
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 top-8 bg-surface-dark border border-border rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-content-faint font-medium">Sort by</p>
                  </div>
                  {[
                    { value: "custom", label: "Custom" },
                    { value: "title", label: "Title" },
                    { value: "recentlyUpdated", label: "Updated" },
                    { value: "recentlyCreated", label: "Created" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${sortBy === option.value ? "bg-surface-dark text-content-primary" : "text-content-secondary hover:bg-surface-dark"
                        }`}
                    >
                      <button
                        onClick={() => {
                          handleSortChange(option.value)
                          if (option.value === "custom") setIsSortDropdownOpen(false)
                        }}
                        className="flex-1 text-left"
                      >
                        {option.label}
                      </button>
                      {sortBy === option.value && option.value !== "custom" && (
                        <button
                          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                          className="ml-2"
                        >
                          {sortOrder === "asc" ? (
                            <ArrowUp size={12} className="text-content-muted" />
                          ) : (
                            <ArrowDown size={12} className="text-content-muted" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isSidebarEditing && (
              <button
                onClick={handleCreateClick}
                className="p-2 bg-primary hover:bg-primary-hover rounded-lg cursor-pointer transition-colors text-white"
                title="Add New Note"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Compact Header for Sidebar - Tabs and Icons in one row */}
      {!showHeader && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Compact Tabs */}
          <div className="flex gap-0.5 p-0.5 bg-surface-base rounded-lg flex-1 min-w-0">
            {Object.entries(TAB_CONFIG).map(([tab, config]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[10px] font-medium transition-all ${activeTab === tab
                  ? "bg-surface-dark text-content-primary"
                  : "text-content-muted hover:text-content-primary"
                  }`}
              >
                <span>{config.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${activeTab === tab ? "bg-primary/15 text-primary" : "bg-surface-button text-content-faint"
                    }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => !isSidebarEditing && setIsSortDropdownOpen(!isSortDropdownOpen)}
                disabled={isSidebarEditing}
                className={`p-1.5 bg-surface-base rounded-md text-content-muted hover:text-content-primary transition-colors ${isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                title="Sort notes"
              >
                {sortOrder === "asc" ? (
                  <ArrowUp size={12} />
                ) : (
                  <ArrowDown size={12} />
                )}
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 top-7 bg-surface-dark border border-border rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-content-faint font-medium">Sort by</p>
                  </div>
                  {[
                    { value: "custom", label: "Custom" },
                    { value: "title", label: "Title" },
                    { value: "recentlyUpdated", label: "Updated" },
                    { value: "recentlyCreated", label: "Created" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${sortBy === option.value ? "bg-surface-dark text-content-primary" : "text-content-secondary hover:bg-surface-dark"
                        }`}
                    >
                      <button
                        onClick={() => {
                          handleSortChange(option.value)
                          if (option.value === "custom") setIsSortDropdownOpen(false)
                        }}
                        className="flex-1 text-left"
                      >
                        {option.label}
                      </button>
                      {sortBy === option.value && option.value !== "custom" && (
                        <button
                          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                          className="ml-2"
                        >
                          {sortOrder === "asc" ? (
                            <ArrowUp size={12} className="text-content-muted" />
                          ) : (
                            <ArrowDown size={12} className="text-content-muted" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isSidebarEditing && (
              <button
                onClick={handleCreateClick}
                className="p-1.5 bg-primary hover:bg-primary-hover rounded-md cursor-pointer transition-colors text-white"
                title="Add New Note"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs - Only shown when showHeader is true (My Area) */}
      {showHeader && (
        <div className="flex gap-1 p-1 bg-surface-base rounded-xl flex-shrink-0">
          {Object.entries(TAB_CONFIG).map(([tab, config]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab
                ? "bg-surface-dark text-content-primary"
                : "text-content-muted hover:text-content-primary"
                }`}
            >
              <span>{config.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${activeTab === tab ? "bg-primary/15 text-primary" : "bg-surface-button text-content-faint"
                  }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Notes List */}
      <div
        ref={listRef}
        className={`overflow-y-auto custom-scrollbar pr-1 space-y-1.5 ${showHeader ? 'flex-1' : ''}`}
        style={computedMaxHeight ? { maxHeight: `${computedMaxHeight}px` } : undefined}
      >
        {!isLoading && currentNotes.map((note) => (
          <div
            key={note._id || note.id}
            className="p-3 rounded-xl bg-surface-card hover:bg-surface-hover transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Note Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-content-primary truncate flex-1">
                    {note.title || "Untitled"}
                  </h3>
                  {note.isPinned && (
                    <Pin size={12} className="text-primary fill-primary flex-shrink-0" />
                  )}
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-1">
                    {note.tags.slice(0, 2).map((tag, idx) => {
                      // Handle both populated tag objects and tag IDs
                      const tagObj = typeof tag === 'object' ? tag : { id: tag, name: 'Tag', color: '#6b7280' }
                      return (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: tagObj.color || '#6b7280' }}
                        >
                          {tagObj.name || 'Tag'}
                        </span>
                      )
                    })}
                    {note.tags.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-button text-content-secondary">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-content-muted line-clamp-2">
                  {truncateText(note.content)}
                </p>

                {/* Date and Time */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-content-faint">
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(note.updatedAt || note.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="flex-shrink-0 relative" ref={openDropdownId === (note._id || note.id) ? dropdownRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDropdownToggle(note._id || note.id, e)
                  }}
                  className="p-1 hover:bg-surface-hover rounded text-content-muted hover:text-content-primary transition-colors"
                >
                  <MoreVertical size={14} />
                </button>

                {openDropdownId === (note._id || note.id) && (
                  <div
                    className={`absolute right-0 bg-surface-button border border-border rounded-lg shadow-lg z-50 min-w-[120px] py-1 ${dropdownPosition[note._id || note.id] === 'top' ? 'bottom-full mb-1' : 'top-6'
                      }`}
                  >
                    <button
                      onClick={() => handleEditClick(note)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-surface-hover flex items-center gap-2 text-content-primary transition-colors"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-surface-hover text-accent-red flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!isLoading && currentNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-content-faint">
            <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mb-3">
              <Edit size={20} className="text-content-faint" />
            </div>
            <p className="text-sm">No {activeTab} notes</p>
            <p className="text-xs mt-1">Click + to create a note</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-center pt-2 border-t border-border flex-shrink-0">
        <Link to="/dashboard/notes" className="text-xs text-content-muted hover:text-content-primary transition-colors">
          View all notes →
        </Link>
      </div>

      {/* Note Modal (Add/Edit) - rendered via portal */}
      {showNoteModal && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto">
            <NoteModal
              mode={noteModalMode}
              note={noteModalMode === "edit" ? selectedNote : null}
              onClose={() => {
                setShowNoteModal(false)
                setSelectedNote(null)
              }}
              onSave={noteModalMode === "add" ? handleCreateNote : handleUpdateNote}
              availableTags={[]} // Pass empty array for now, or fetch tags from Redux
              onAddTag={handleAddTag}
              onDeleteTag={handleDeleteTag}
              category={activeTab}
              onDelete={handleDeleteFromModal}
              onDuplicate={handleDuplicateNote}
              onPinToggle={handlePinToggle}
              onMoveToOtherTab={handleMoveNote}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal - rendered via portal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4">
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false)
              setNoteToDelete(null)
            }}
            onConfirm={handleDeleteNote}
            noteTitle={noteToDelete?.title || ""}
          />
        </div>,
        document.body
      )}
    </div>
  )
}

export default NotesWidget