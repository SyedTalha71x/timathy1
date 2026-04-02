/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react"
import { Search, Plus, X, GripVertical, Edit, Copy, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Tag, Pin, PinOff } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import TagManagerModal from "../../components/shared/TagManagerModal"
import DeleteModal from "../../components/shared/DeleteModal"
import { demoNotes, notesTagsData } from "../../utils/admin-panel-states/notes-states"

import { useTranslation } from "react-i18next"
import PullToRefresh from "../../components/shared/PullToRefresh"
import KeyboardSpacer from "../../components/shared/KeyboardSpacer"

// Helper function to strip HTML tags and normalize whitespace for preview
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\s+/g, ' ').trim()
}

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

// WysiwygEditor component
const WysiwygEditor = ({ value, initialValue, onChange, placeholder, className = "", noteId, isMobile = false }) => {
  const quillRef = useRef(null)
  const [internalValue, setInternalValue] = useState(initialValue ?? value)
  const currentNoteIdRef = useRef(noteId)
  
  useEffect(() => {
    if (noteId !== currentNoteIdRef.current) {
      setInternalValue(initialValue ?? value)
      currentNoteIdRef.current = noteId
    }
  }, [noteId, value, initialValue])
  
  const handleChange = (newValue) => {
    setInternalValue(newValue)
    onChange(newValue)
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
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
      .notes-editor-wrapper .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-options {
        background-color: #1f1f1f !important;
        border-color: #404040 !important;
        z-index: 100 !important;
      }
      .notes-editor-wrapper .ql-snow .ql-picker-item {
        color: #e5e7eb !important;
      }
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
      .notes-editor-wrapper .ql-snow .ql-tooltip a.ql-action,
      .notes-editor-wrapper .ql-snow .ql-tooltip a.ql-remove {
        color: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
      .notes-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
        stroke: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
      .notes-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill {
        fill: #f97316 !important;
      }
      .notes-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,
      .notes-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active {
        color: #f97316 !important;
      }
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
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker.ql-expanded {
          overflow: visible !important;
          z-index: 999999 !important;
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
        .mobile-editor-container .notes-editor-wrapper .ql-toolbar.ql-snow button {
          width: 28px !important;
          height: 28px !important;
          padding: 4px !important;
          flex-shrink: 0;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
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
        .mobile-editor-container .notes-editor-wrapper .ql-container.ql-snow {
          border: none !important;
          border-radius: 0 !important;
        }
        .mobile-editor-container .notes-editor-wrapper .ql-editor {
          padding: 16px !important;
          min-height: 200px !important;
        }
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
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
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
        .mobile-editor-container .notes-editor-wrapper .ql-snow .ql-picker {
          position: relative !important;
          overflow: visible !important;
        }
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
const NoteOverlayItem = ({ note, availableTags }) => {
  const { t } = useTranslation()
  const stripText = stripHtmlTags(note.content)
  return (
    <div
      className="bg-gray-800/95 rounded-xl border border-primary/50 shadow-2xl"
      style={{ boxShadow: '0 12px 32px rgba(249, 115, 22, 0.25)', width: 'var(--note-list-width, 300px)' }}
    >
      <div className="flex items-start gap-2 p-3 overflow-hidden">
        <div className="text-primary mt-0.5 flex-shrink-0 p-1">
          <GripVertical className="w-5 h-5 md:w-3.5 md:h-3.5" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className={`text-sm font-medium truncate ${note.title ? 'text-white' : 'text-content-faint italic'}`}>
            {note.title || t("admin.notes.untitled")}
          </h4>
          <p className="text-xs text-content-muted mt-1 truncate">{stripText || t("admin.notes.noContent")}</p>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {note.tags.slice(0, 3).map(tagId => {
                const tag = availableTags.find(t => t.id === tagId)
                return tag ? (
                  <span key={tagId} className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SortableNoteItem = React.memo(({ note, isSelected, onClick, availableTags, wasDraggingRef }) => {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: transform ? `translate3d(0, ${Math.round(transform.y)}px, 0)` : undefined,
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  const stripText = stripHtmlTags(note.content)

  const handleClick = (e) => {
    // Prevent note selection if we just finished dragging
    if (wasDraggingRef?.current) return
    // Prevent click if the drag handle was clicked
    if (e.target.closest('[data-drag-handle]')) return
    onClick?.()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-pointer select-none border-b border-border ${
        isSelected 
          ? 'bg-gray-800/80' 
          : 'hover:bg-surface-hover/50 active:bg-gray-800/70'
      } ${isDragging ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2 p-3 overflow-hidden">
        {/* Drag Handle */}
        <div
          data-drag-handle
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-content-muted hover:text-content-primary active:text-primary mt-0.5 flex-shrink-0 touch-none p-2 -m-2 md:p-1 md:-m-1 rounded-lg active:bg-primary/30"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-5 h-5 md:w-3.5 md:h-3.5" />
        </div>

        {/* Note Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium truncate ${note.title ? 'text-white' : 'text-content-faint italic'}`}>
              {note.title || t("admin.notes.untitled")}
            </h4>
            {note.isPinned && (
              <Pin size={12} className="text-primary fill-primary flex-shrink-0 mt-0.5" />
            )}
          </div>
          
          <p 
            className="text-xs text-content-muted mb-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
          >
            {stripText || t("admin.notes.noContent")}
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
                <span className="text-[10px] text-content-faint">+{note.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default function NotesApp() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState(demoNotes)
  const [selectedNote, setSelectedNote] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [availableTags, setAvailableTags] = useState(notesTagsData)
  const [showTagsModal, setShowTagsModal] = useState(false)
  
  // Editing state
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [editedTags, setEditedTags] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)
  
  const sortDropdownRef = useRef(null)
  const desktopSortDropdownRef = useRef(null)
  const mobileActionsMenuRef = useRef(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Track actively dragged note for DragOverlay
  const [activeId, setActiveId] = useState(null)
  const wasDraggingRef = useRef(false)

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideMobileSort = sortDropdownRef.current && sortDropdownRef.current.contains(event.target)
      const isInsideDesktopSort = desktopSortDropdownRef.current && desktopSortDropdownRef.current.contains(event.target)
      if (!isInsideMobileSort && !isInsideDesktopSort) {
        setShowSortDropdown(false)
      }
      if (mobileActionsMenuRef.current && !mobileActionsMenuRef.current.contains(event.target)) {
        setShowMobileActionsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadedNoteIdRef = useRef(null)

  // Load selected note data into editing state
  useEffect(() => {
    if (selectedNote) {
      if (loadedNoteIdRef.current !== selectedNote.id) {
        setEditedTitle(selectedNote.title || '')
        setEditedContent(selectedNote.content || '')
        setEditedTags(selectedNote.tags || [])
        setHasUnsavedChanges(false)
        setShowAllTags(false)
        loadedNoteIdRef.current = selectedNote.id
      }
    } else {
      setEditedTitle('')
      setEditedContent('')
      setEditedTags([])
      setHasUnsavedChanges(false)
      setShowAllTags(false)
      loadedNoteIdRef.current = null
    }
  }, [selectedNote])

  // Auto-save functionality
  useEffect(() => {
    if (!selectedNote || !hasUnsavedChanges) return
    saveCurrentNote()
  }, [editedTitle, editedContent, editedTags, hasUnsavedChanges])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') return
      
      const target = e.target
      const activeEl = document.activeElement
      
      const isTargetEditable = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable === true ||
        target.closest?.('.ql-editor') ||
        target.closest?.('.notes-editor-wrapper')
      
      const isActiveElementEditable =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable === true ||
        activeEl?.closest?.('.ql-editor') ||
        activeEl?.closest?.('.notes-editor-wrapper')
      
      const isInEditableArea = isTargetEditable || isActiveElementEditable
      
      if (isInEditableArea) {
        if (e.key === 'Escape') activeEl?.blur?.()
        return
      }

      if (e.key === 'Escape') {
        if (deleteConfirm) setDeleteConfirm(null)
        else if (showTagsModal) setShowTagsModal(false)
        else if (selectedNote) setSelectedNote(null)
        return
      }
      
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const anyModalOpen = deleteConfirm || showTagsModal || selectedNote
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]')
      
      if (anyModalOpen || hasVisibleModal) return

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        handleCreateNote()
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setShowTagsModal(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [deleteConfirm, selectedNote, showTagsModal])

  // Save current note
  const saveCurrentNote = () => {
    if (!selectedNote) return

    const updatedNote = {
      ...selectedNote,
      title: editedTitle,
      content: editedContent,
      tags: editedTags,
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => prev.map(note =>
      note.id === selectedNote.id ? updatedNote : note
    ))

    setSelectedNote(updatedNote)
    setHasUnsavedChanges(false)
  }

  // Sort options
  const sortOptions = [
    { value: 'date', label: t("admin.notes.sort.date") },
    { value: 'title', label: t("admin.notes.sort.title") },
    { value: 'custom', label: t("admin.notes.sort.custom") },
  ]
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || t("admin.notes.sort.date")

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-content-muted" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom')
      setShowSortDropdown(false)
    } else if (sortBy === newSortBy) {
      toggleSortDirection()
    } else {
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  // Tag Management
  const handleAddTag = (newTag) => {
    setAvailableTags([...availableTags, newTag])
  }

  const handleDeleteTag = (tagId) => {
    setNotes(prev => prev.map(note => ({
      ...note,
      tags: note.tags?.filter(t => t !== tagId) || []
    })))
    setAvailableTags(availableTags.filter(tag => tag.id !== tagId))
  }

  // Create new note
  const handleCreateNote = () => {
    const note = {
      id: Date.now(),
      title: '',
      content: '',
      tags: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => [note, ...prev])
    setSelectedNote(note)
    
    const focusTitleInput = () => {
      const titleInputs = document.querySelectorAll('[data-title-input]')
      const visibleInput = Array.from(titleInputs).find(input => {
        const rect = input.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
      if (visibleInput) {
        visibleInput.focus()
        visibleInput.setSelectionRange(0, 0)
      }
    }
    
    setTimeout(focusTitleInput, 100)
    setTimeout(focusTitleInput, 300)
  }

  // Delete note
  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) setSelectedNote(null)
  }

  // Duplicate note
  const duplicateNote = () => {
    if (!selectedNote) return

    const duplicated = {
      ...selectedNote,
      id: Date.now(),
      title: `${selectedNote.title} (${t("common.duplicate")})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => [duplicated, ...prev])
    const isMobile = window.innerWidth < 768
    setSelectedNote(isMobile ? null : duplicated)
  }

  // Toggle pin
  const togglePin = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ))
    if (selectedNote?.id === noteId) {
      setSelectedNote(prev => ({ ...prev, isPinned: !prev.isPinned }))
    }
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
  const handleDragStart = (event) => {
    wasDraggingRef.current = true
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    const { active, over } = event
    
    // Reset drag flag after a short delay so onClick doesn't fire
    setTimeout(() => { wasDraggingRef.current = false }, 50)

    if (!over || active.id === over.id) return

    setSortBy('custom')
    setNotes(prev => {
      // Build the new order based on displayed currentNotes order
      const displayedIds = getCurrentNotes().map(n => n.id)
      const oldIndex = displayedIds.indexOf(active.id)
      const newIndex = displayedIds.indexOf(over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      
      const reorderedIds = arrayMove(displayedIds, oldIndex, newIndex)
      
      // Rebuild full notes array: reordered visible notes first, then hidden notes
      const reorderedVisible = reorderedIds.map(id => prev.find(n => n.id === id)).filter(Boolean)
      const hiddenNotes = prev.filter(n => !displayedIds.includes(n.id))
      return [...reorderedVisible, ...hiddenNotes]
    })
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setTimeout(() => { wasDraggingRef.current = false }, 50)
  }

  // Get current notes (filtered, sorted)
  const getCurrentNotes = () => {
    let currentNotes = notes || []

    if (searchQuery) {
      currentNotes = currentNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtmlTags(note.content).toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    currentNotes = [...currentNotes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1

      let comparison = 0
      switch (sortBy) {
        case 'date':
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

  return (
    <>
      <div className="min-h-screen rounded-3xl bg-surface-base text-white p-3 md:p-6 flex flex-col transition-all duration-500 ease-in-out flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">{t("admin.notes.title")}</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-[22rem] flex flex-col bg-surface-card rounded-xl border border-border h-[calc(100vh-140px)] md:max-h-[calc(100vh-200px)]">
            {/* Desktop Buttons */}
            <div className="hidden md:flex p-3 gap-2">
              <div className="relative group">
                <button
                  onClick={handleCreateNote}
                  className="bg-primary hover:bg-primary-hover text-sm text-white px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Plus size={16} />
                  <span>{t("admin.notes.newNote")}</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{t("admin.notes.newNote")}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative flex-1 max-w-[180px]" ref={desktopSortDropdownRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                  className="w-full px-3 py-2.5 bg-surface-button text-content-secondary rounded-xl text-sm hover:bg-surface-button-hover transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSortIcon()}
                    <span className="truncate text-xs sm:text-sm">{currentSortLabel}</span>
                  </div>
                </button>
                {showSortDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-full w-max">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-content-secondary'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-content-muted ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tags Button */}
              <div className="relative group">
                <button
                  onClick={() => setShowTagsModal(true)}
                  className="bg-surface-button hover:bg-surface-button-hover text-content-secondary text-sm px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Tag size={16} />
                  <span className="hidden sm:inline">{t("admin.notes.tags")}</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{t("admin.notes.manageTags")}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">T</span>
                </div>
              </div>
            </div>

            {/* Search + Mobile Buttons */}
            <div className="p-2 md:px-3 md:py-3 border-b md:border-b-0 border-border flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={14} />
                <input
                  type="text"
                  placeholder={t("admin.notes.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-dark outline-none text-sm text-white rounded-lg px-3 py-2 pl-8 border border-border focus:border-primary transition-colors"
                />
              </div>
              
              {/* Mobile Sort */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                  className="w-10 h-10 flex items-center justify-center bg-surface-button text-content-secondary rounded-lg hover:bg-surface-button-hover transition-colors"
                >
                  <ArrowUpDown size={14} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-content-secondary'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-content-muted ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Tags */}
              <button
                onClick={() => setShowTagsModal(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-lg transition-colors"
              >
                <Tag size={16} />
              </button>
            </div>

            {/* Notes List */}
            <PullToRefresh onRefresh={async () => {}} className="flex-1 overflow-y-auto">
              {currentNotes.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-content-faint">
                  <p className="text-sm">{t("admin.notes.empty.title")}</p>
                  <p className="text-xs mt-2">{t("admin.notes.empty.description")}</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
                  <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
                    {currentNotes.map(note => (
                      <SortableNoteItem
                        key={note.id}
                        note={note}
                        isSelected={selectedNote?.id === note.id}
                        onClick={() => setSelectedNote(note)}
                        availableTags={availableTags}
                        wasDraggingRef={wasDraggingRef}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
                    {activeId ? (
                      <NoteOverlayItem
                        note={currentNotes.find(n => n.id === activeId)}
                        availableTags={availableTags}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </PullToRefresh>
          </div>

          {/* Desktop Editor */}
          <div className="hidden md:flex flex-1 flex-col bg-surface-card rounded-xl border border-border min-w-0 max-h-[calc(100vh-200px)]">
            {selectedNote ? (
              <>
                {/* Note Header */}
                <div className="p-4 md:p-6 border-b border-border flex-shrink-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        data-title-input
                        value={editedTitle}
                        onChange={(e) => { setEditedTitle(e.target.value); setHasUnsavedChanges(true) }}
                        placeholder={t("admin.notes.untitled")}
                        className="w-full bg-transparent text-xl md:text-2xl font-bold text-white outline-none border-b-2 border-transparent hover:border-border focus:border-primary transition-all pb-1 truncate"
                      />
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] md:text-xs text-content-faint">
                        <span>{t("common.created")}: {formatDateTime(selectedNote.createdAt)}</span>
                        {selectedNote.updatedAt !== selectedNote.createdAt && (
                          <span>{t("common.updated")}: {formatDateTime(selectedNote.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePin(selectedNote.id)}
                        className={`p-2 rounded-lg hover:bg-surface-hover transition-colors ${selectedNote.isPinned ? 'text-primary' : 'text-content-muted hover:text-content-primary'}`}
                        title={selectedNote.isPinned ? t("common.unpin") : t("common.pin")}
                      >
                        {selectedNote.isPinned ? <Pin size={18} className="fill-current" /> : <PinOff size={18} />}
                      </button>
                      <button
                        onClick={duplicateNote}
                        className="text-content-muted hover:text-content-primary p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        title={t("common.duplicate")}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(selectedNote)}
                        className="text-content-muted hover:text-red-500 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        title={t("common.delete")}
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${editedTags.includes(tag.id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
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
                        className="mt-2 text-sm text-primary hover:text-primary transition-colors"
                      >
                        {showAllTags ? t("admin.notes.showLess") : t("admin.notes.showMore", { count: availableTags.length - 6 })}
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-hidden p-6 flex flex-col">
                  <WysiwygEditor
                    key={`editor-${selectedNote.id}`}
                    noteId={selectedNote.id}
                    initialValue={selectedNote.content}
                    value={editedContent}
                    onChange={(value) => { setEditedContent(value); setHasUnsavedChanges(true) }}
                    placeholder={t("admin.notes.startWriting")}
                    className="full-height"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 md:p-8 text-center">
                <div>
                  <div className="text-content-faint mb-4">
                    <Edit size={40} className="mx-auto md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-content-muted mb-2">{t("admin.notes.noNoteSelected")}</h3>
                  <p className="text-xs md:text-sm text-content-faint mb-6">{t("admin.notes.selectNoteHint")}</p>
                  <button
                    onClick={handleCreateNote}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    {t("admin.notes.newNote")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { deleteNote(deleteConfirm.id); setDeleteConfirm(null) }}
        title={t("admin.notes.deleteModal.title")}
        message={t("admin.notes.deleteModal.message", { title: deleteConfirm?.title || t("admin.notes.untitled") })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
      />

      {/* Mobile Editor Overlay */}
      {selectedNote && (
        <div className="md:hidden fixed inset-0 bg-surface-base z-[9999] flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <button
              onClick={() => setSelectedNote(null)}
              className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              {selectedNote.isPinned && (
                <button onClick={() => togglePin(selectedNote.id)} className="text-primary p-1 hover:bg-surface-hover rounded-lg transition-colors">
                  <Pin size={20} className="fill-primary" />
                </button>
              )}
              
              <div className="relative" ref={mobileActionsMenuRef}>
                <button
                  onClick={() => setShowMobileActionsMenu(!showMobileActionsMenu)}
                  className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>

                {showMobileActionsMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-surface-hover border border-border rounded-lg shadow-lg min-w-[180px] z-50">
                    <div className="py-1">
                      <button
                        onClick={() => { togglePin(selectedNote.id); setShowMobileActionsMenu(false) }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                      >
                        {selectedNote.isPinned ? <><PinOff size={16} /><span>{t("admin.notes.unpinNote")}</span></> : <><Pin size={16} /><span>{t("admin.notes.pinNote")}</span></>}
                      </button>
                      <button
                        onClick={() => { duplicateNote(); setShowMobileActionsMenu(false) }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                      >
                        <Copy size={16} /><span>{t("common.duplicate")}</span>
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => { setDeleteConfirm(selectedNote); setShowMobileActionsMenu(false) }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-red-500"
                      >
                        <Trash2 size={16} /><span>{t("common.delete")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto mobile-note-scroll">
            <div className="p-4 border-b border-border">
              <input
                type="text"
                data-title-input
                value={editedTitle}
                onChange={(e) => { setEditedTitle(e.target.value); setHasUnsavedChanges(true) }}
                placeholder={t("admin.notes.untitled")}
                className="w-full bg-transparent text-xl font-bold text-white outline-none border-b-2 border-transparent hover:border-border focus:border-primary transition-all pb-1"
              />
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-content-faint">
                <span>{t("common.created")}: {formatDateTime(selectedNote.createdAt)}</span>
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <span>{t("common.updated")}: {formatDateTime(selectedNote.updatedAt)}</span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-content-secondary">{t("admin.notes.tags")}</label>
                <button onClick={() => setShowTagsModal(true)} className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  {t("admin.notes.manageTags")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? availableTags : availableTags.slice(0, 4)).map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${editedTags.includes(tag.id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
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
                  className="mt-2 text-sm text-primary hover:text-primary transition-colors"
                >
                  {showAllTags ? t("admin.notes.showLess") : t("admin.notes.showMore", { count: availableTags.length - 4 })}
                </button>
              )}
            </div>

            {/* Mobile Editor */}
            <div className="mobile-editor-container">
              <WysiwygEditor
                key={`editor-mobile-${selectedNote.id}`}
                noteId={selectedNote.id}
                initialValue={selectedNote.content}
                value={editedContent}
                onChange={(value) => { setEditedContent(value); setHasUnsavedChanges(true) }}
                placeholder={t("admin.notes.startWriting")}
                isMobile={true}
              />
            </div>
            <KeyboardSpacer />
          </div>
        </div>
      )}

      {/* Tags Modal */}
      <TagManagerModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={availableTags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Mobile FAB */}
      <button
        onClick={handleCreateNote}
        className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
      >
        <Plus size={22} />
      </button>
    </>
  )
}
