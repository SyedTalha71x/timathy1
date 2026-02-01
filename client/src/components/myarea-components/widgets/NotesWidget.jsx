/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Plus, MoreVertical, Edit, Trash2, Eye, Tag, Pin, PinOff, Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { Link } from "react-router-dom"
import NoteModal from "../../shared/notes/NoteModal"
import DeleteConfirmModal from "../../shared/notes/DeleteConfirmModal"

// Available tags - from notes.jsx
const AVAILABLE_TAGS = [
  { id: 'urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'meeting', name: 'Meeting', color: '#3b82f6' },
  { id: 'ideas', name: 'Ideas', color: '#8b5cf6' },
  { id: 'todo', name: 'Todo', color: '#f59e0b' },
  { id: 'training', name: 'Training', color: '#10b981' },
  { id: 'member', name: 'Member', color: '#ec4899' },
]

// Demo notes - from notes.jsx
const DEMO_NOTES = {
  personal: [
    {
      id: 1,
      title: "Quarterly Review Meeting Notes",
      content: "<p>Discussed Q4 goals and performance metrics. Team showed 15% improvement in customer satisfaction.</p><p><strong>Action items:</strong></p><ul><li>Reduce response time in support tickets</li><li>Schedule follow-up meeting</li></ul>",
      tags: ['meeting', 'urgent'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-12-15T10:30:00",
      updatedAt: "2025-12-20T14:45:00"
    },
    {
      id: 2,
      title: "New Member Orientation Checklist",
      content: "<ol><li>Welcome package preparation</li><li>Training schedule setup</li><li>Facility tour arrangement</li><li>Equipment assignment</li><li>Introduction to team members</li></ol>",
      tags: ['member', 'todo'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-12-10T09:15:00",
      updatedAt: "2025-12-10T09:15:00"
    },
  ],
  studio: [
    {
      id: 3,
      title: "Equipment Maintenance Schedule",
      content: "<h3>Weekly Maintenance</h3><ul><li>Check treadmill belts</li><li>Clean all surfaces</li><li>Test emergency stop buttons</li></ul><h3>Monthly Maintenance</h3><ul><li>Deep clean all equipment</li><li>Inspect cables and pulleys</li><li>Update maintenance log</li></ul>",
      tags: ['training'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-12-01T08:00:00",
      updatedAt: "2025-12-18T16:30:00"
    },
  ],
}

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

const NotesWidget = ({ isSidebarEditing, showHeader = true }) => {
  const [notes, setNotes] = useState(DEMO_NOTES)
  const [availableTags, setAvailableTags] = useState(AVAILABLE_TAGS)
  
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
  
  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})
  
  const dropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)

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

  // Calculate counts for each tab
  const tabCounts = {
    personal: notes.personal?.length || 0,
    studio: notes.studio?.length || 0,
  }

  // Get notes for active tab with sorting
  const getCurrentNotes = () => {
    let currentNotes = notes[activeTab] || []
    
    // Sort notes
    if (sortBy !== "custom") {
      currentNotes = [...currentNotes].sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case "title":
            comparison = (a.title || "").localeCompare(b.title || "")
            break
          case "recentlyUpdated":
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            break
          case "recentlyCreated":
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          default:
            comparison = 0
            break
        }
        
        return sortOrder === "asc" ? comparison : -comparison
      })
    }
    
    return currentNotes
  }

  // Handle create note
  const handleCreateNote = (newNote, category) => {
    setNotes(prev => ({
      ...prev,
      [category]: [newNote, ...(prev[category] || [])],
    }))
    setShowNoteModal(false)
  }

  // Handle update note
  const handleUpdateNote = (updatedNote) => {
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(note =>
        note.id === updatedNote.id ? updatedNote : note
      ),
    }))
    setShowNoteModal(false)
    setSelectedNote(null)
  }

  // Handle delete note
  const handleDeleteNote = () => {
    if (noteToDelete) {
      setNotes(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(note => note.id !== noteToDelete.id),
      }))
      setNoteToDelete(null)
      setShowDeleteModal(false)
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

  // Get tag by ID
  const getTagById = (tagId) => {
    return availableTags.find((tag) => tag.id === tagId)
  }

  // Handle tag management
  const handleAddTag = (newTag) => {
    setAvailableTags([...availableTags, newTag])
  }

  const handleDeleteTag = (tagId) => {
    // Remove tag from all notes
    setNotes((prev) => {
      const updatedNotes = {}
      Object.keys(prev).forEach(tab => {
        updatedNotes[tab] = prev[tab].map(note => ({
          ...note,
          tags: note.tags?.filter(t => t !== tagId) || []
        }))
      })
      return updatedNotes
    })
    
    // Remove from available tags
    setAvailableTags(availableTags.filter(tag => tag.id !== tagId))
  }

  // Handle pin toggle
  const handlePinToggle = (noteId) => {
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(note =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      ),
    }))
  }

  // Handle duplicate note
  const handleDuplicateNote = (note) => {
    const duplicatedNote = {
      ...note,
      id: Date.now(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => ({
      ...prev,
      [activeTab]: [duplicatedNote, ...(prev[activeTab] || [])],
    }))
  }

  // Handle move note to other tab
  const handleMoveNote = (note) => {
    const targetTab = activeTab === 'personal' ? 'studio' : 'personal'
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(n => n.id !== note.id),
      [targetTab]: [note, ...(prev[targetTab] || [])],
    }))
  }

  // Handle delete from modal
  const handleDeleteFromModal = (noteId) => {
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(note => note.id !== noteId),
    }))
    setShowNoteModal(false)
    setSelectedNote(null)
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
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        {showHeader && <h2 className="text-lg font-semibold">Notes</h2>}
        <div className={`flex items-center gap-2 ${!showHeader ? 'ml-auto' : ''}`}>
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => !isSidebarEditing && setIsSortDropdownOpen(!isSortDropdownOpen)}
              disabled={isSidebarEditing}
              className={`p-1.5 bg-black rounded-lg text-gray-400 hover:text-white transition-colors ${
                isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""
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
              <div className="absolute right-0 top-8 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-500 font-medium">Sort by</p>
                </div>
                {[
                  { value: "custom", label: "Custom" },
                  { value: "title", label: "Title" },
                  { value: "recentlyUpdated", label: "Updated" },
                  { value: "recentlyCreated", label: "Created" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      sortBy === option.value ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
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
                          <ArrowUp size={12} className="text-gray-400" />
                        ) : (
                          <ArrowDown size={12} className="text-gray-400" />
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
              className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer transition-colors"
              title="Add New Note"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-black rounded-xl flex-shrink-0">
        {Object.entries(TAB_CONFIG).map(([tab, config]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>{config.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === tab ? "bg-white/10 text-white" : "bg-gray-900 text-gray-500"
              }`}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
        {currentNotes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-gray-800 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Note Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate flex-1">
                    {note.title || "Untitled"}
                  </h3>
                  {note.isPinned && (
                    <Pin size={12} className="text-orange-400 fill-orange-400 flex-shrink-0" />
                  )}
                </div>
                
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-1">
                    {note.tags.slice(0, 2).map((tagId) => {
                      const tag = getTagById(tagId)
                      return tag ? (
                        <span
                          key={tag.id}
                          className="text-[10px] px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null
                    })}
                    {note.tags.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-600 text-gray-300">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400 line-clamp-2">
                  {truncateText(note.content)}
                </p>

                {/* Date and Time */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(note.updatedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="flex-shrink-0 relative" ref={openDropdownId === note.id ? dropdownRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDropdownToggle(note.id, e)
                  }}
                  className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={14} />
                </button>

                {openDropdownId === note.id && (
                  <div 
                    className={`absolute right-0 bg-[#2F2F2F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px] py-1 ${
                      dropdownPosition[note.id] === 'top' ? 'bottom-full mb-1' : 'top-6'
                    }`}
                  >
                    <button
                      onClick={() => handleEditClick(note)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2 text-white transition-colors"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 text-red-400 flex items-center gap-2 transition-colors"
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
        {currentNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Edit size={20} className="text-gray-600" />
            </div>
            <p className="text-sm">No {activeTab} notes</p>
            <p className="text-xs mt-1">Click + to create a note</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-center pt-2 border-t border-gray-700 flex-shrink-0">
        <Link to="/dashboard/notes" className="text-xs text-gray-400 hover:text-white transition-colors">
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
              availableTags={availableTags}
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
