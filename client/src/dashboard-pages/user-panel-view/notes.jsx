/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { Search, Plus, X, GripVertical, Edit, Copy, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Paperclip, Tag, Pin, PinOff, ArrowRightLeft, Info } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import DeleteConfirmModal from "../../components/user-panel-components/notes-components/DeleteConfirmModal"
import TagManagerModal from "../../components/shared/TagManagerModal"
import ImageSourceModal from "../../components/shared/ImageSourceModal"
import MediaLibraryPickerModal from "../../components/shared/MediaLibraryPickerModal"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

// Available tags
const AVAILABLE_TAGS = [
  { id: 'urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'meeting', name: 'Meeting', color: '#3b82f6' },
  { id: 'ideas', name: 'Ideas', color: '#8b5cf6' },
  { id: 'todo', name: 'Todo', color: '#f59e0b' },
  { id: 'training', name: 'Training', color: '#10b981' },
  { id: 'member', name: 'Member', color: '#ec4899' },
]

// Demo notes with tags and dates before 2026
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
// Helper function to strip HTML tags and normalize whitespace for preview
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  // Get text content and normalize whitespace (replace multiple spaces/newlines with single space)
  const text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\s+/g, ' ').trim()
}

// Quill editor configuration - defined OUTSIDE component to prevent re-creation on renders
// This is CRITICAL: ReactQuill compares modules/formats by reference, new objects cause reinitialization
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

// WysiwygEditor component - uses internal state to prevent cursor jumping
const WysiwygEditor = ({ value, initialValue, onChange, placeholder, className = "", noteId, isMobile = false }) => {
  const quillRef = useRef(null)
  // Use initialValue for first render (from selectedNote.content), fallback to value
  const [internalValue, setInternalValue] = useState(initialValue ?? value)
  const currentNoteIdRef = useRef(noteId)
  
  // Only sync when switching to a DIFFERENT note (handled by key prop remounting)
  // This effect handles edge cases where value might update after mount
  useEffect(() => {
    if (noteId !== currentNoteIdRef.current) {
      setInternalValue(initialValue ?? value)
      currentNoteIdRef.current = noteId
    }
  }, [noteId, value, initialValue])
  
  // Handle internal changes
  const handleChange = (newValue) => {
    setInternalValue(newValue)
    onChange(newValue)
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* Line clamp utility for sidebar */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .notes-editor-wrapper {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #404040;
        display: flex;
        flex-direction: column;
        transition: border-color 0.2s ease;
      }
      .notes-editor-wrapper:focus-within {
        border-color: #3b82f6;
      }
      .notes-editor-wrapper.full-height {
        height: 100%;
      }
      .notes-editor-wrapper.full-height .quill {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .notes-editor-wrapper.full-height .ql-container {
        flex: 1;
        overflow: auto;
      }
      .notes-editor-wrapper.full-height .ql-editor {
        min-height: 100% !important;
      }
      .notes-editor-wrapper .ql-editor.ql-blank::before {
        color: #9ca3af !important;
        opacity: 0.7 !important;
      }
      .notes-editor-wrapper .ql-editor {
        color: #e5e7eb !important;
        background-color: #1f1f1f !important;
        min-height: 300px;
        font-size: 15px;
        line-height: 1.4;
        padding-bottom: 100px !important;
      }
      .notes-editor-wrapper .ql-editor p,
      .notes-editor-wrapper .ql-editor div {
        margin: 0 !important;
        padding: 0 !important;
      }
      .notes-editor-wrapper .ql-editor p + p,
      .notes-editor-wrapper .ql-editor div + div {
        margin: 0 !important;
      }
      .notes-editor-wrapper .ql-editor br {
        line-height: inherit;
      }
      .notes-editor-wrapper .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #404040 !important;
        background-color: #161616 !important;
        flex-shrink: 0;
      }
      .notes-editor-wrapper .ql-container.ql-snow {
        border: none !important;
        background-color: #1f1f1f !important;
      }
      /* White icons for toolbar */
      .notes-editor-wrapper .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-label .ql-stroke {
        stroke: #ffffff !important;
      }
      /* Dropdown styles */
      .notes-editor-wrapper .ql-snow .ql-picker-options {
        background-color: #1f1f1f !important;
        border-color: #404040 !important;
        z-index: 100 !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-item {
        color: #e5e7eb !important;
      }
      /* Tooltip/popup styles with high z-index */
      .notes-editor-wrapper .ql-snow .ql-tooltip {
        background-color: #1f1f1f !important;
        border-color: #404040 !important;
        color: #e5e7eb !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        z-index: 100 !important;
      }
      .notes-editor-wrapper .ql-snow .ql-tooltip input[type="text"] {
        color: #e5e7eb !important;
        background-color: #161616 !important;
        border: 1px solid #404040 !important;
        padding: 6px 10px !important;
        border-radius: 6px !important;
      }
      .notes-editor-wrapper .ql-snow .ql-tooltip input[type="text"]::placeholder {
        color: #6b7280 !important;
      }
      .notes-editor-wrapper .ql-snow .ql-tooltip a.ql-action,
      .notes-editor-wrapper .ql-snow .ql-tooltip a.ql-remove {
        color: #f97316 !important;
      }
      /* Hover/active states - orange accent */
      .notes-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
      .notes-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
      .notes-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
      .notes-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke {
        stroke: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
      .notes-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
      .notes-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
      .notes-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill {
        fill: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,
      .notes-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label:hover,
      .notes-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active,
      .notes-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label.ql-active {
        color: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
      .notes-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke {
        stroke: #f97316 !important;
      }
      /* Color picker popup fix */
      .notes-editor-wrapper .ql-snow .ql-color-picker .ql-picker-options,
      .notes-editor-wrapper .ql-snow .ql-background .ql-picker-options {
        padding: 3px 5px !important;
        width: 152px !important;
      }
      @media (max-width: 767px) {
        .mobile-note-scroll {
          scroll-behavior: auto;
        }
        .mobile-editor-container {
          position: relative;
          z-index: 9999;
        }
        .mobile-editor-container .notes-editor-wrapper {
          border: none !important;
          border-radius: 0 !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow {
          display: flex;
          flex-wrap: wrap !important;
          padding: 8px 12px !important;
          gap: 4px;
          background-color: #161616 !important;
          border-bottom: 1px solid #404040 !important;
          border-radius: 0 !important;
          overflow: visible !important;
          position: relative;
          z-index: 99999;
          align-items: center;
        }
        /* When picker is expanded, ensure it's visible */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker.ql-expanded {
          overflow: visible !important;
          z-index: 999999 !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow::-webkit-scrollbar {
          display: none;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-formats {
          display: flex;
          flex-wrap: wrap;
          margin-right: 8px !important;
          margin-bottom: 4px !important;
          align-items: center;
          gap: 2px;
          overflow: visible !important;
          position: relative;
        }
        /* Uniform button size */
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow button {
          width: 28px !important;
          height: 28px !important;
          padding: 4px !important;
          flex-shrink: 0;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow button svg {
          width: 14px !important;
          height: 14px !important;
        }
        /* Uniform picker size */
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-picker {
          height: 28px !important;
          flex-shrink: 0;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-picker-label {
          padding: 4px 6px !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-picker-label svg {
          width: 14px !important;
          height: 14px !important;
        }
        /* Color picker buttons uniform */
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-color-picker .ql-picker-label,
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow .ql-background .ql-picker-label {
          width: 28px !important;
          padding: 4px !important;
          justify-content: center !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-container.ql-snow {
          border: none !important;
          border-radius: 0 !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-editor {
          padding: 16px !important;
          min-height: 200px !important;
        }
        /* Dropdown styling - ABSOLUTE position relative to picker */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker-options {
          position: absolute !important;
          background-color: #1f1f1f !important;
          border: 1px solid #404040 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
          z-index: 9999999 !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          min-width: 120px !important;
          left: 0 !important;
          right: auto !important;
          top: 100% !important;
          margin-top: 4px !important;
          width: auto !important;
        }
        /* Ensure expanded picker is visible on iOS */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Color picker specific */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-color-picker .ql-picker-options,
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-background .ql-picker-options {
          min-width: 152px !important;
          width: 152px !important;
          padding: 5px !important;
          left: auto !important;
          right: 0 !important;
          top: 100% !important;
          margin-top: 4px !important;
        }
        /* Ensure picker parent has relative positioning */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker {
          position: relative !important;
          overflow: visible !important;
        }
        /* Link tooltip styling */
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-tooltip {
          background-color: #1f1f1f !important;
          border: 1px solid #404040 !important;
          z-index: 9999999 !important;
          position: fixed !important;
          left: 16px !important;
          right: 16px !important;
          top: 50% !important;
          margin-top: -50px !important;
          width: auto !important;
          padding: 12px !important;
          border-radius: 8px !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-tooltip input[type="text"] {
          width: 100% !important;
          background-color: #161616 !important;
          border: 1px solid #404040 !important;
          border-radius: 6px !important;
          padding: 8px !important;
          color: white !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-tooltip a {
          color: #f97316 !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className={`notes-editor-wrapper ${className}`}>
      <ReactQuill
        ref={quillRef}
        value={internalValue}
        onChange={handleChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        placeholder={placeholder}
        theme="snow"
      />
    </div>
  )
}

// Sortable Note Item in Sidebar
const SortableNoteItem = ({ note, isSelected, onClick, availableTags, onPin }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : 'auto',
    boxShadow: isDragging ? '0 8px 24px rgba(249, 115, 22, 0.3)' : 'none',
    willChange: isDragging ? 'transform' : 'auto',
  }

  const stripText = stripHtmlTags(note.content)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-pointer select-none border-b border-gray-800 ${
        isSelected 
          ? 'bg-gray-800/80' 
          : 'hover:bg-gray-800/50 active:bg-gray-800/70'
      } ${isDragging ? 'rounded-xl border border-orange-500/50 bg-gray-800/90' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 p-3 overflow-hidden">
        {/* Drag Handle - larger on mobile, instant feedback */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white active:text-orange-400 mt-0.5 flex-shrink-0 touch-none p-2 -m-2 md:p-1 md:-m-1 rounded-lg active:bg-orange-500/30"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical className="w-5 h-5 md:w-3.5 md:h-3.5" />
        </div>

        {/* Note Content - constrained width */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium truncate ${note.title ? 'text-white' : 'text-gray-500 italic'}`}>
              {note.title || 'Untitled'}
            </h4>
            {note.isPinned && (
              <Pin size={12} className="text-orange-400 fill-orange-400 flex-shrink-0 mt-0.5" />
            )}
          </div>
          
          <p 
            className="text-xs text-gray-400 mb-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
          >
            {stripText || 'No content'}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 4).map(tagId => {
                const tag = availableTags.find(t => t.id === tagId)
                return tag ? (
                  <span
                    key={tagId}
                    className="text-[10px] px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ) : null
              })}
              {note.tags.length > 4 && (
                <span className="text-[10px] text-gray-500">+{note.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NotesApp() {
  const sidebarSystem = useSidebarSystem()
  const [activeTab, setActiveTab] = useState("studio")
  const [notes, setNotes] = useState(DEMO_NOTES)
  const [selectedNote, setSelectedNote] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState('date') // Changed from 'updated' to 'date'
  const [sortDirection, setSortDirection] = useState('desc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [availableTags, setAvailableTags] = useState(AVAILABLE_TAGS) // Now has setter
  const [showTagsModal, setShowTagsModal] = useState(false)
  
  // Editing state
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [editedTags, setEditedTags] = useState([])
  const [editedAttachments, setEditedAttachments] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false)
  const [showAllAttachments, setShowAllAttachments] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)
  
  // Image source modal states
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  
  const sortDropdownRef = useRef(null)
  const desktopSortDropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const autoSaveTimeoutRef = useRef(null)
  const mobileActionsMenuRef = useRef(null)

  // Sidebar tooltip ref (combined info tooltip uses studioTooltipRef)
  const [showStudioTooltip, setShowStudioTooltip] = useState(false)
  const studioTooltipRef = useRef(null)

  const trainingVideos = trainingVideosData

  // DnD sensors - optimized for responsive mobile dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close sort dropdown if click is outside BOTH mobile and desktop refs
      const isInsideMobileSort = sortDropdownRef.current && sortDropdownRef.current.contains(event.target)
      const isInsideDesktopSort = desktopSortDropdownRef.current && desktopSortDropdownRef.current.contains(event.target)
      if (!isInsideMobileSort && !isInsideDesktopSort) {
        setShowSortDropdown(false)
      }
      if (studioTooltipRef.current && !studioTooltipRef.current.contains(event.target)) {
        setShowStudioTooltip(false)
      }
      if (mobileActionsMenuRef.current && !mobileActionsMenuRef.current.contains(event.target)) {
        setShowMobileActionsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Track the currently loaded note ID to prevent unnecessary resets
  const loadedNoteIdRef = useRef(null)

  // Load selected note data into editing state - only when selecting a DIFFERENT note
  useEffect(() => {
    if (selectedNote) {
      // Only reset content if we're loading a different note
      if (loadedNoteIdRef.current !== selectedNote.id) {
        setEditedTitle(selectedNote.title || '')
        setEditedContent(selectedNote.content || '')
        setEditedTags(selectedNote.tags || [])
        setEditedAttachments(selectedNote.attachments || [])
        setHasUnsavedChanges(false)
        setShowAllAttachments(false) // Reset attachments view
        setShowAllTags(false) // Reset tags view
        loadedNoteIdRef.current = selectedNote.id
      }
    } else {
      setEditedTitle('')
      setEditedContent('')
      setEditedTags([])
      setEditedAttachments([])
      setHasUnsavedChanges(false)
      setShowAllAttachments(false)
      setShowAllTags(false)
      loadedNoteIdRef.current = null
    }
  }, [selectedNote])

  // Auto-save functionality - Instant updates for responsive sidebar
  useEffect(() => {
    if (!selectedNote || !hasUnsavedChanges) return

    // Save immediately for instant sidebar updates
    saveCurrentNote()
  }, [editedTitle, editedContent, editedTags, editedAttachments, hasUnsavedChanges])

  // Keyboard shortcuts - only active when NOT in any editable area
  useEffect(() => {
    const handleKeyPress = (e) => {
      // NEVER intercept Enter key - always let it through for editors
      if (e.key === 'Enter') {
        return
      }
      
      // Use both event.target AND document.activeElement for reliable detection
      const target = e.target
      const activeEl = document.activeElement
      
      // Check if user is typing in ANY editable area
      // Check both target and activeElement to catch all cases
      const isTargetEditable = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable === true ||
        target.closest?.('[contenteditable="true"]') ||
        target.closest?.('.ql-editor') ||
        target.closest?.('.ql-container') ||
        target.closest?.('.notes-editor-wrapper')
      
      const isActiveElementEditable =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable === true ||
        activeEl?.closest?.('[contenteditable="true"]') ||
        activeEl?.closest?.('.ql-editor') ||
        activeEl?.closest?.('.ql-container') ||
        activeEl?.closest?.('.notes-editor-wrapper')
      
      const isInEditableArea = isTargetEditable || isActiveElementEditable
      
      // If in editable area, only handle Escape, let everything else through
      if (isInEditableArea) {
        if (e.key === 'Escape') {
          // Blur the editor on Escape
          activeEl?.blur?.()
        }
        // Don't handle any other keys
        return
      }

      // From here on, we're NOT in an editable area
      
      // Handle Escape for modals
      if (e.key === 'Escape') {
        if (showImageSourceModal) setShowImageSourceModal(false)
        else if (showMediaLibraryModal) setShowMediaLibraryModal(false)
        else if (deleteConfirm) setDeleteConfirm(null)
        else if (showTagsModal) setShowTagsModal(false)
        else if (selectedNote) setSelectedNote(null)
        return
      }
      
      // Don't handle if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return

      // Check if ANY modal is open - if so, don't trigger other hotkeys
      const anyModalOpen = 
        deleteConfirm ||
        showTagsModal ||
        showImageSourceModal ||
        showMediaLibraryModal ||
        selectedNote // Note being edited counts as "modal open"
      
      // Also check if any modal overlay is visible in the DOM
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
                              document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]')
      
      if (anyModalOpen || hasVisibleModal) return

      // C - Create new note (only when not typing and no modal open)
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        handleCreateNote()
      }

      // T - Manage tags (only when not typing and no modal open)
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setShowTagsModal(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [deleteConfirm, selectedNote, showTagsModal, showImageSourceModal, showMediaLibraryModal])

  // Save current note (silently in background)
  const saveCurrentNote = () => {
    if (!selectedNote) return

    const updatedNote = {
      ...selectedNote,
      title: editedTitle,
      content: editedContent,
      tags: editedTags,
      attachments: editedAttachments,
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ),
    }))

    setSelectedNote(updatedNote)
    setHasUnsavedChanges(false)
    // No toast notification - silent auto-save
  }

  // Get current sort label
  const sortOptions = [
    { value: 'date', label: 'Date' }, // Merged: uses most recent of created/updated
    { value: 'title', label: 'Title' },
    { value: 'custom', label: 'Custom' },
  ]
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Date'

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  // Get sort icon based on current state
  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  // Handle sort option click (dropdown stays open for direction toggle)
  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom')
      setShowSortDropdown(false)
    } else if (sortBy === newSortBy) {
      // If same option clicked, toggle direction
      toggleSortDirection()
    } else {
      setSortBy(newSortBy)
      setSortDirection('desc') // Default to descending for new sort
    }
  }

  // Tag Management Functions
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

  // Create new note directly
  const handleCreateNote = () => {
    const note = {
      id: Date.now(),
      title: '',
      content: '',
      tags: [],
      attachments: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => ({
      ...prev,
      [activeTab]: [note, ...prev[activeTab]],
    }))
    
    setSelectedNote(note)
    
    // Focus title input after render - iOS needs longer delay and special handling
    const focusTitleInput = () => {
      const titleInputs = document.querySelectorAll('[data-title-input]')
      // Focus the visible one (last one in the DOM for mobile overlay)
      const visibleInput = Array.from(titleInputs).find(input => {
        const rect = input.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
      if (visibleInput) {
        visibleInput.focus()
        // iOS sometimes needs selection to trigger keyboard
        visibleInput.setSelectionRange(0, 0)
      }
    }
    
    // Use multiple attempts for iOS reliability
    setTimeout(focusTitleInput, 100)
    setTimeout(focusTitleInput, 300)
    setTimeout(focusTitleInput, 500)
  }

  // Delete note
  const deleteNote = (noteId) => {
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(note => note.id !== noteId),
    }))
    
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }

  // Duplicate note
  const duplicateNote = () => {
    if (!selectedNote) return

    const duplicated = {
      ...selectedNote,
      id: Date.now(),
      title: `${selectedNote.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => ({
      ...prev,
      [activeTab]: [duplicated, ...prev[activeTab]],
    }))

    // On mobile: go back to list; on desktop: select the duplicate
    const isMobile = window.innerWidth < 768
    setSelectedNote(isMobile ? null : duplicated)
  }

  // Toggle pin
  const togglePin = (noteId) => {
    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(note =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      ),
    }))

    if (selectedNote?.id === noteId) {
      setSelectedNote(prev => ({ ...prev, isPinned: !prev.isPinned }))
    }
  }

  // Move note to other tab
  const moveNoteToOtherTab = () => {
    if (!selectedNote) return

    const targetTab = activeTab === 'personal' ? 'studio' : 'personal'
    const noteToMove = { ...selectedNote }

    setNotes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(note => note.id !== selectedNote.id),
      [targetTab]: [noteToMove, ...prev[targetTab]],
    }))

    setActiveTab(targetTab)
    
    // On mobile: go back to list; on desktop: keep the note selected in new tab
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      setSelectedNote(null)
    }
    // On desktop: selectedNote stays the same (note is still selected in new tab)
  }

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }))
    
    setEditedAttachments(prev => [...prev, ...newAttachments])
    setHasUnsavedChanges(true)
  }

  // Handle media library selection
  const handleMediaLibrarySelect = (imageUrl) => {
    const filename = imageUrl.split('/').pop() || `media-${Date.now()}.jpg`
    const newAttachment = {
      name: filename,
      url: imageUrl,
      file: null
    }
    setEditedAttachments(prev => [...prev, newAttachment])
    setHasUnsavedChanges(true)
  }

  // Remove attachment
  const removeAttachment = (index) => {
    setEditedAttachments(prev => prev.filter((_, i) => i !== index))
    setHasUnsavedChanges(true)
  }

  // Toggle tag
  const toggleTag = (tagId) => {
    setEditedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
    setHasUnsavedChanges(true)
  }

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Switch to custom sorting when manually reordering
    setSortBy('custom')

    setNotes(prev => {
      const oldIndex = prev[activeTab].findIndex(note => note.id === active.id)
      const newIndex = prev[activeTab].findIndex(note => note.id === over.id)
      
      return {
        ...prev,
        [activeTab]: arrayMove(prev[activeTab], oldIndex, newIndex),
      }
    })
  }

  // Get current notes (filtered, sorted)
  const getCurrentNotes = () => {
    let currentNotes = notes[activeTab] || []

    // Filter by search
    if (searchQuery) {
      currentNotes = currentNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtmlTags(note.content).toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    currentNotes = [...currentNotes].sort((a, b) => {
      // Pinned notes always first
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1
      }

      let comparison = 0
      switch (sortBy) {
        case 'date':
          // Use the most recent date (either updated or created)
          const aDate = new Date(a.updatedAt || a.createdAt)
          const bDate = new Date(b.updatedAt || b.createdAt)
          comparison = bDate - aDate
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'custom':
          return 0
        default:
          comparison = 0
      }

      return sortDirection === 'asc' ? -comparison : comparison
    })

    return currentNotes
  }

  const currentNotes = getCurrentNotes()
  const noteIds = currentNotes.map(note => note.id)

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Sidebar system destructuring
  const {
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    freeAppointments,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    setIsRightWidgetModalOpen,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setIsNotifyMemberOpen,
    setNotifyAction,
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown: toggleSidebarDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    truncateUrl,
    renderSpecialNoteIcon,
    customLinks,
    communications,
    todos,
    setTodos,
    expiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,
    memberTypes,
    todoFilterOptions,
    appointmentTypes,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem

  // Wrapper functions for sidebar
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  return (
    <>
      <div className={`min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-3 md:p-6 flex flex-col transition-all duration-500 ease-in-out flex-1 ${isRightSidebarOpen ? 'lg:mr-86 mr-0' : 'mr-0'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white">Notes</h1>
            {/* Combined Info Tooltip */}
            <div className="relative" ref={studioTooltipRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowStudioTooltip(!showStudioTooltip)
                }}
                onMouseEnter={() => setShowStudioTooltip(true)}
                onMouseLeave={() => setShowStudioTooltip(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors p-1"
                aria-label="Notes Information"
              >
                <Info size={16} />
              </button>
              
              {showStudioTooltip && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-4 z-50">
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="text-orange-400 font-medium mb-1">Studio Notes</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Shared with everyone. All team members can see and edit these notes.
                      </p>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-blue-400 font-medium mb-1">Personal Notes</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Private to you. Only you can see and edit these notes.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle */}
            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar}>
                <img src="/expand-sidebar mirrored.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            ) : (
              <div onClick={toggleRightSidebar}>
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 overflow-hidden">
          {/* Left Sidebar - Notes List */}
          <div className="w-full md:w-[22rem] flex flex-col bg-[#161616] rounded-xl border border-gray-800 h-[calc(100vh-140px)] md:max-h-[calc(100vh-200px)]">
            {/* Desktop: Buttons Row + Search Row */}
            {/* Mobile: Single Row with Search + Icon Buttons */}
            
            {/* Desktop Only: Create + Sort + Tags Buttons Row */}
            <div className="hidden md:flex p-3 gap-2">
              <div className="relative group">
                <button
                  onClick={handleCreateNote}
                  className="bg-orange-500 hover:bg-orange-600 text-sm text-white px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                >
                  <Plus size={16} />
                  <span className="hidden min-[400px]:inline">Create Note</span>
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Create Note</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    C
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>
              
              {/* Sort Dropdown - Desktop */}
              <div className="relative flex-1 max-w-[180px]" ref={desktopSortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="w-full px-3 py-2.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-sm hover:bg-[#3F3F3F] transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSortIcon()}
                    <span className="truncate text-xs sm:text-sm">{currentSortLabel}</span>
                  </div>
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-full w-max">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                            sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-gray-400 ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tags Button - Desktop */}
              <div className="relative group">
                <button
                  onClick={() => setShowTagsModal(true)}
                  className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium flex-shrink-0"
                >
                  <Tag size={16} />
                  <span className="hidden sm:inline">Tags</span>
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Manage Tags</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    T
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>
            </div>

            {/* Search Bar + Icon Buttons */}
            <div className="p-2 md:px-3 md:py-3 border-b md:border-b-0 border-gray-800 flex gap-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] outline-none text-sm text-white rounded-lg px-3 py-2 pl-8 border border-[#333333] focus:border-blue-500 transition-colors selection:bg-blue-500 selection:text-white"
                />
              </div>
              
              {/* Mobile Only: Sort Icon Button */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-[#2F2F2F] text-gray-300 rounded-lg hover:bg-[#3F3F3F] transition-colors"
                  title="Sort"
                >
                  <ArrowUpDown size={14} />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                            sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-gray-400 ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Only: Tags Icon Button */}
              <button
                onClick={() => setShowTagsModal(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 rounded-lg transition-colors"
                title="Manage Tags (T)"
              >
                <Tag size={16} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mt-1">
              {/* Studio Notes Tab */}
              <button
                onClick={() => {
                  setActiveTab("studio")
                  setSelectedNote(null)
                }}
                className={`flex-1 px-4 py-4 text-base font-medium transition-colors ${
                  activeTab === "studio"
                    ? "text-white border-b-2 border-orange-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Studio Notes
              </button>

              {/* Personal Notes Tab */}
              <button
                onClick={() => {
                  setActiveTab("personal")
                  setSelectedNote(null)
                }}
                className={`flex-1 px-4 py-4 text-base font-medium transition-colors ${
                  activeTab === "personal"
                    ? "text-white border-b-2 border-orange-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Personal Notes
              </button>
            </div>

            {/* Notes List with DnD */}
            <div className="flex-1 overflow-y-auto">
              {currentNotes.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-gray-500">
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs mt-2">Create your first note to get started</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
                    {currentNotes.map(note => (
                      <SortableNoteItem
                        key={note.id}
                        note={note}
                        isSelected={selectedNote?.id === note.id}
                        onClick={() => setSelectedNote(note)}
                        availableTags={availableTags}
                        onPin={togglePin}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* Right Content Area - Note Editor (Desktop only) */}
          <div className="hidden md:flex flex-1 flex-col bg-[#161616] rounded-xl border border-gray-800 min-w-0 max-h-[calc(100vh-200px)]">
            {selectedNote ? (
              <>
                {/* Note Header */}
                <div className="p-4 md:p-6 border-b border-gray-800 flex-shrink-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        data-title-input
                        value={editedTitle}
                        onChange={(e) => {
                          setEditedTitle(e.target.value)
                          setHasUnsavedChanges(true)
                        }}
                        placeholder="Untitled"
                        className="w-full bg-transparent text-xl md:text-2xl font-bold text-white outline-none border-b-2 border-transparent hover:border-gray-600 focus:border-blue-500 transition-all pb-1 truncate"
                      />
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] md:text-xs text-gray-500">
                        <span>Created: {formatDateTime(selectedNote.createdAt)}</span>
                        {selectedNote.updatedAt !== selectedNote.createdAt && (
                          <span>Updated: {formatDateTime(selectedNote.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePin(selectedNote.id)}
                        className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${
                          selectedNote.isPinned ? 'text-orange-400' : 'text-gray-400 hover:text-white'
                        }`}
                        title={selectedNote.isPinned ? 'Unpin' : 'Pin'}
                      >
                        {selectedNote.isPinned ? <Pin size={18} className="fill-current" /> : <PinOff size={18} />}
                      </button>
                      <button
                        onClick={duplicateNote}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors hidden md:block"
                        title="Duplicate"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={moveNoteToOtherTab}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors hidden md:block"
                        title={`Move to ${activeTab === 'personal' ? 'Studio' : 'Personal'} Notes`}
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(selectedNote)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllTags ? availableTags : availableTags.slice(0, 6)).map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                            editedTags.includes(tag.id) ? "text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                          }`}
                          style={{ backgroundColor: editedTags.includes(tag.id) ? tag.color : undefined }}
                        >
                          <Tag size={10} />
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    {availableTags.length > 6 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {showAllTags 
                          ? 'Show less' 
                          : `Show ${availableTags.length - 6} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Note Content - Fills available space */}
                <div className="flex-1 overflow-hidden p-6 flex flex-col">
                  <WysiwygEditor
                    key={`editor-${selectedNote.id}`}
                    noteId={selectedNote.id}
                    initialValue={selectedNote.content}
                    value={editedContent}
                    onChange={(value) => {
                      setEditedContent(value)
                      setHasUnsavedChanges(true)
                    }}
                    placeholder="Start writing..."
                    className="full-height"
                  />
                </div>

                {/* Attachments Section - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-800 p-4 md:p-6 bg-[#161616]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Paperclip size={14} />
                      Attachments
                    </label>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => setShowImageSourceModal(true)}
                        className="text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Images
                      </button>
                    </div>
                  </div>

                  {editedAttachments.length > 0 && (
                    <div>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {(showAllAttachments ? editedAttachments : editedAttachments.slice(0, 5)).map((attachment, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="cursor-pointer"
                              onClick={() => setViewingImage({ image: attachment, images: editedAttachments, index })}
                            >
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-14 md:h-16 object-cover rounded-lg border border-gray-700"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-medium bg-gray-800 px-3 py-1 rounded">View</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {editedAttachments.length > 5 && (
                        <button
                          onClick={() => setShowAllAttachments(!showAllAttachments)}
                          className="mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          {showAllAttachments 
                            ? 'Show less' 
                            : `Show ${editedAttachments.length - 5} more`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-4 md:p-8 text-center">
                <div>
                  <div className="text-gray-600 mb-4">
                    <Edit size={40} className="mx-auto md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-400 mb-2">No note selected</h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-6">
                    Select a note from the list or create a new one
                  </p>
                  <button
                    onClick={handleCreateNote}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Create Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deleteNote(deleteConfirm.id)
          setDeleteConfirm(null)
        }}
        noteTitle={deleteConfirm?.title || ''}
      />

      {/* Image Lightbox */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={32} />
          </button>

          {viewingImage.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
                  setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg hover:bg-white/10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
                  setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg hover:bg-white/10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="max-w-[90vw] max-h-[90vh] flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
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
            <img
              src={viewingImage.image.url}
              alt={viewingImage.image.name}
              className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Note Editor Overlay */}
      {selectedNote && (
        <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[60] flex flex-col">
          {/* Mobile Header with Back Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <button
              onClick={() => setSelectedNote(null)}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Back to notes list"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Right side: Pin + 3-Dot Menu */}
            <div className="flex items-center gap-3">
              {selectedNote.isPinned && (
                <button
                  onClick={() => togglePin(selectedNote.id)}
                  className="text-orange-400 p-1 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Unpin note"
                >
                  <Pin size={20} className="fill-orange-400" />
                </button>
              )}
              
              {/* 3-Dot Actions Menu */}
              <div className="relative" ref={mobileActionsMenuRef}>
                <button
                  onClick={() => setShowMobileActionsMenu(!showMobileActionsMenu)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="More actions"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMobileActionsMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg min-w-[180px] z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          togglePin(selectedNote.id)
                          setShowMobileActionsMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                      >
                        {selectedNote.isPinned ? (
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
                      
                      <button
                        onClick={() => {
                          duplicateNote()
                          setShowMobileActionsMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                      >
                        <Copy size={16} />
                        <span>Duplicate</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          moveNoteToOtherTab()
                          setShowMobileActionsMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-gray-300"
                      >
                        <ArrowRightLeft size={16} />
                        <span>Move to {activeTab === 'personal' ? 'Studio' : 'Personal'}</span>
                      </button>
                      
                      <div className="border-t border-gray-700 my-1"></div>
                      
                      <button
                        onClick={() => {
                          setDeleteConfirm(selectedNote)
                          setShowMobileActionsMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-red-500"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note Content - Scrollable */}
          <div className="flex-1 overflow-y-auto mobile-note-scroll">
            {/* Title Input */}
            <div className="p-4 border-b border-gray-800">
              <input
                type="text"
                data-title-input
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value)
                  setHasUnsavedChanges(true)
                }}
                placeholder="Untitled"
                className="w-full bg-transparent text-xl font-bold text-white outline-none border-b-2 border-transparent hover:border-gray-600 focus:border-blue-500 transition-all pb-1"
              />
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                <span>Created: {formatDateTime(selectedNote.createdAt)}</span>
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <span>Updated: {formatDateTime(selectedNote.updatedAt)}</span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Tags</label>
                <button 
                  onClick={() => setShowTagsModal(true)} 
                  className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Manage Tags
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? availableTags : availableTags.slice(0, 4)).map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      editedTags.includes(tag.id) ? "text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                    style={{ backgroundColor: editedTags.includes(tag.id) ? tag.color : undefined }}
                  >
                    <Tag size={10} />
                    {tag.name}
                  </button>
                ))}
              </div>
              {availableTags.length > 4 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {showAllTags 
                    ? 'Show less' 
                    : `Show ${availableTags.length - 4} more`}
                </button>
              )}
            </div>

            {/* Editor */}
            <div className="mobile-editor-container">
              <WysiwygEditor
                key={`editor-mobile-${selectedNote.id}`}
                noteId={selectedNote.id}
                initialValue={selectedNote.content}
                value={editedContent}
                onChange={(value) => {
                  setEditedContent(value)
                  setHasUnsavedChanges(true)
                }}
                placeholder="Start writing..."
                isMobile={true}
              />
            </div>

            {/* Attachments */}
            {editedAttachments.length > 0 && (
              <div className="p-4 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Paperclip size={14} />
                  Attachments ({editedAttachments.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(showAllAttachments ? editedAttachments : editedAttachments.slice(0, 3)).map((attachment, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="cursor-pointer"
                        onClick={() => setViewingImage({ image: attachment, images: editedAttachments, index })}
                      >
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full h-20 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">View</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAttachment(index)
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                {editedAttachments.length > 3 && (
                  <button
                    onClick={() => setShowAllAttachments(!showAllAttachments)}
                    className="mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {showAllAttachments 
                      ? 'Show less' 
                      : `Show ${editedAttachments.length - 3} more`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Action Bar */}
          <div className="border-t border-gray-800 p-4 flex gap-2 flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => setShowImageSourceModal(true)}
              className="w-full bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Paperclip size={16} />
              Add Images
            </button>
          </div>
        </div>
      )}

      {/* Tags Management Modal */}
      <TagManagerModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={availableTags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
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

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={handleCreateNote}
        className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label="Create Note"
      >
        <Plus size={22} />
      </button>

      {/* Right Sidebar */}
      <Sidebar
        isRightSidebarOpen={isRightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
        isSidebarEditing={isSidebarEditing}
        toggleSidebarEditing={toggleSidebarEditing}
        rightSidebarWidgets={rightSidebarWidgets}
        moveRightSidebarWidget={moveRightSidebarWidget}
        removeRightSidebarWidget={removeRightSidebarWidget}
        setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
        communications={communications}
        redirectToCommunication={redirectToCommunication}
        todos={todos}
        handleTaskComplete={handleTaskCompleteWrapper}
        todoFilter={todoFilter}
        setTodoFilter={setTodoFilter}
        todoFilterOptions={todoFilterOptions}
        isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
        setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
        openDropdownIndex={openDropdownIndex}
        toggleDropdown={toggleSidebarDropdown}
        handleEditTask={handleEditTask}
        setTaskToCancel={setTaskToCancel}
        setTaskToDelete={setTaskToDelete}
        birthdays={birthdays}
        isBirthdayToday={isBirthdayToday}
        handleSendBirthdayMessage={handleSendBirthdayMessage}
        customLinks={customLinks}
        truncateUrl={truncateUrl}
        appointments={appointments}
        renderSpecialNoteIcon={renderSpecialNoteIcon}
        handleDumbbellClick={handleDumbbellClick}
        handleCheckIn={handleCheckInWrapper}
        handleAppointmentOptionsModal={handleAppointmentOptionsModal}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        isChartDropdownOpen={isChartDropdownOpen}
        setIsChartDropdownOpen={setIsChartDropdownOpen}
        expiringContracts={expiringContracts}
        getWidgetPlacementStatus={getWidgetPlacementStatus}
        onClose={toggleRightSidebar}
        hasUnreadNotifications={2}
        setIsWidgetModalOpen={setIsWidgetModalOpen}
        handleEditNote={handleEditNoteWrapper}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        isSpecialNoteModalOpen={isSpecialNoteModalOpen}
        setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
        selectedAppointmentForNote={selectedAppointmentForNote}
        setSelectedAppointmentForNote={setSelectedAppointmentForNote}
        handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
        onSaveSpecialNote={handleSaveSpecialNoteWrapper}
        notifications={notifications}
        setTodos={setTodos}
      />

      {/* Sidebar Modals */}
      <TrainingPlansModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => {
          setIsTrainingPlanModalOpen(false)
          setSelectedUserForTrainingPlan(null)
        }}
        selectedMember={selectedUserForTrainingPlan}
        memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
        availableTrainingPlans={availableTrainingPlans}
        onAssignPlan={handleAssignTrainingPlan}
        onRemovePlan={handleRemoveTrainingPlan}
      />

      <AppointmentActionModalV2
        isOpen={showAppointmentOptionsModal}
        onClose={() => {
          setShowAppointmentOptionsModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
        isEventInPast={isEventInPast}
        onEdit={() => {
          setShowAppointmentOptionsModal(false)
          setIsEditAppointmentModalOpen(true)
        }}
        onCancel={handleCancelAppointment}
        onViewMember={handleViewMemberDetails}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
        handleNotifyMember={handleNotifyMember}
      />

      {isEditAppointmentModalOpen && selectedAppointment && (
        <EditAppointmentModalV2
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointment({ ...selectedAppointment, ...changes })
          }}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointmentWrapper}
          onClose={() => {
            setIsEditAppointmentModalOpen(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddRightSidebarWidget}
        getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
        widgetArea="sidebar"
      />

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {isEditTaskModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditTaskModalOpen(false)
            setEditingTask(null)
          }}
          onUpdateTask={handleUpdateTaskWrapper}
        />
      )}

      {taskToDelete && (
        <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToCancel && (
        <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                No
              </button>
              <button
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
