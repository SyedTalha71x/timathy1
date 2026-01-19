/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AlertTriangle, Calendar, Edit, Info, StickyNote, X } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// Note Status Options - Shared constant
export const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

export const getStatusLabel = (statusId) => {
  const status = NOTE_STATUSES.find(s => s.id === statusId)
  return status ? status.label : "General"
}

/**
 * Helper function to extract notes from different entity structures
 * Supports both Lead and Member data structures
 */
export const extractNotes = (entity, entityType = "member") => {
  if (!entity) return []
  
  // Check for notes array first (new format)
  if (entity.notes && Array.isArray(entity.notes) && entity.notes.length > 0) {
    return entity.notes
  }
  
  // Lead legacy format - specialNote object
  if (entityType === "lead" && entity.specialNote?.text?.trim()) {
    return [{
      id: 1,
      status: "general",
      text: entity.specialNote.text,
      isImportant: entity.specialNote.isImportant || false,
      startDate: entity.specialNote.startDate || "",
      endDate: entity.specialNote.endDate || "",
      createdAt: entity.createdAt || "",
    }]
  }
  
  // Member legacy format - note string
  if (entityType === "member" && entity.note?.trim()) {
    return [{
      id: 1,
      status: entity.noteStatus || "general",
      text: entity.note,
      isImportant: entity.noteImportance === "important",
      startDate: entity.noteStartDate || "",
      endDate: entity.noteEndDate || "",
    }]
  }
  
  return []
}

/**
 * SharedSpecialNoteIcon - Works for both Leads and Members
 * 
 * Props:
 * - entity: The lead or member object
 * - entityType: "lead" or "member"
 * - onEdit: Function to open edit modal (entity, "note")
 * - size: Icon size ("sm" | "md") - default "md"
 * - position: Position style ("absolute" | "relative") - default "absolute"
 * - maxVisibleNotes: Maximum notes to show in popover - default 5
 */
const SharedSpecialNoteIcon = ({
  entity,
  entityType = "member",
  onEdit,
  size = "md",
  position = "absolute",
  maxVisibleNotes = 5,
}) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })
  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const [leaveTimeout, setLeaveTimeout] = useState(null)
  
  const noteRef = useRef(null)
  const iconRef = useRef(null)

  // Get notes array using the helper
  const entityNotes = extractNotes(entity, entityType)
  const hasValidNote = entityNotes.length > 0
  const hasImportantNote = entityNotes.some(n => n.isImportant)

  // Icon sizes
  const iconSize = size === "sm" ? 12 : 14
  const containerSize = size === "sm" ? "p-1" : "p-1"
  const borderWidth = size === "sm" ? "border-[2.5px]" : "border-[2.5px]"

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
      if (leaveTimeout) clearTimeout(leaveTimeout)
    }
  }, [hoverTimeout, leaveTimeout])

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setIsNoteOpen(false)
      }
    }
    if (isNoteOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isNoteOpen])

  // Close popup on scroll
  useEffect(() => {
    if (!isNoteOpen && hoveredNoteId !== entity?.id) {
      return
    }

    const handleScroll = (event) => {
      if (noteRef.current && noteRef.current.contains(event.target)) {
        return
      }
      
      setIsNoteOpen(false)
      setHoveredNoteId(null)
      if (hoverTimeout) clearTimeout(hoverTimeout)
      if (leaveTimeout) clearTimeout(leaveTimeout)
    }

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true, passive: true })
    }
  }, [isNoteOpen, hoveredNoteId, entity?.id, hoverTimeout, leaveTimeout])

  const calculatePosition = (rect) => {
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom - 16
    
    return {
      top: rect.bottom + 8,
      left: rect.left,
      maxHeight: Math.min(spaceBelow, viewportHeight * 0.6),
    }
  }

  const handleNoteClick = (e) => {
    e.stopPropagation()
    
    if (!hasValidNote) {
      // No notes - open edit modal to add note
      if (onEdit) {
        onEdit(entity, "note")
      }
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    setNotePosition(calculatePosition(rect))
    setIsNoteOpen(!isNoteOpen)
  }

  const handleNoteMouseEnter = (e) => {
    e.stopPropagation()
    
    if (!hasValidNote) return // Don't show popup for empty notes
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    if (leaveTimeout) {
      clearTimeout(leaveTimeout)
      setLeaveTimeout(null)
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    setNotePosition(calculatePosition(rect))
    
    const timeout = setTimeout(() => {
      setHoveredNoteId(entity.id)
    }, 300)
    setHoverTimeout(timeout)
  }

  const handleNoteMouseLeave = (e) => {
    e.stopPropagation()
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    const timeout = setTimeout(() => {
      if (!noteRef.current || !noteRef.current.matches(':hover')) {
        setHoveredNoteId(null)
      }
    }, 300)
    setLeaveTimeout(timeout)
  }

  const handlePopupMouseEnter = (e) => {
    e.stopPropagation()
    if (leaveTimeout) {
      clearTimeout(leaveTimeout)
      setLeaveTimeout(null)
    }
  }

  const handlePopupMouseLeave = (e) => {
    e.stopPropagation()
    const timeout = setTimeout(() => {
      setHoveredNoteId(null)
    }, 100)
    setLeaveTimeout(timeout)
  }

  const handleEditNote = (e) => {
    e.stopPropagation()
    if (hoverTimeout) clearTimeout(hoverTimeout)
    if (leaveTimeout) clearTimeout(leaveTimeout)
    if (onEdit) {
      onEdit(entity, "note")
    }
    setIsNoteOpen(false)
    setHoveredNoteId(null)
  }

  const closePopover = (e) => {
    e.stopPropagation()
    if (hoverTimeout) clearTimeout(hoverTimeout)
    if (leaveTimeout) clearTimeout(leaveTimeout)
    setIsNoteOpen(false)
    setHoveredNoteId(null)
  }

  const shouldShowNotePopover = isNoteOpen || hoveredNoteId === entity?.id

  // Position classes
  const positionClasses = position === "absolute" 
    ? "absolute -top-2 -left-2 z-10" 
    : "flex-shrink-0"

  if (!entity) return null

  return (
    <>
      {/* Icon - Always visible */}
      {hasValidNote ? (
        <div
          ref={iconRef}
          className={`${positionClasses} ${
            hasImportantNote 
              ? "bg-red-500 hover:bg-red-400" 
              : "bg-blue-500 hover:bg-blue-400"
          } rounded-full ${containerSize} ${borderWidth} border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95`}
          onClick={handleNoteClick}
          onMouseEnter={handleNoteMouseEnter}
          onMouseLeave={handleNoteMouseLeave}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {hasImportantNote ? (
            <AlertTriangle size={iconSize} className="text-white" />
          ) : (
            <Info size={iconSize} className="text-white" />
          )}
        </div>
      ) : (
        <div
          ref={iconRef}
          className={`${positionClasses} bg-transparent border ${borderWidth} border-dashed border-gray-400 hover:border-gray-300 rounded-full ${containerSize} shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95`}
          onClick={handleNoteClick}
          onPointerDown={(e) => e.stopPropagation()}
          title="Add special note"
        >
          <StickyNote size={iconSize} className="text-gray-400" />
        </div>
      )}
      
      {/* Note Popover - Portal */}
      {shouldShowNotePopover && hasValidNote &&
        createPortal(
          <div
            ref={noteRef}
            className="fixed w-72 sm:w-80 bg-black/95 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999] flex flex-col"
            style={{
              top: notePosition.top,
              left: notePosition.left,
              maxHeight: notePosition.maxHeight || '60vh',
            }}
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            {/* Header */}
            <div className="bg-gray-800 p-2 sm:p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2 flex-shrink-0">
              <h4 className="text-white flex gap-2 items-center font-medium text-sm">
                <span>Special Notes</span>
                <span className="text-xs text-gray-500">({entityNotes.length})</span>
              </h4>
              <button
                onClick={handleEditNote}
                className="ml-auto text-gray-400 p-1 hover:text-white"
                title="Edit notes"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={closePopover}
                className="text-gray-400 p-1 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Scrollable Content - Notes List */}
            <style>{`
              .special-note-scrollable::-webkit-scrollbar {
                width: 6px;
              }
              .special-note-scrollable::-webkit-scrollbar-track {
                background: #1F2937;
                border-radius: 4px;
              }
              .special-note-scrollable::-webkit-scrollbar-thumb {
                background: #4B5563;
                border-radius: 4px;
              }
            `}</style>
            <div 
              className="p-2 overflow-y-auto flex-1 min-h-0 special-note-scrollable space-y-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 #1F2937'
              }}
            >
              {[...entityNotes]
                .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                .slice(0, maxVisibleNotes)
                .map((note, index) => (
                <div key={note.id || index} className="bg-gray-800/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                      {getStatusLabel(note.status)}
                    </span>
                    {note.isImportant && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-red-500">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-white text-xs leading-relaxed whitespace-pre-wrap">
                    {note.text}
                  </p>
                  {(note.startDate || note.endDate) && (
                    <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
                      <Calendar size={10} />
                      {note.startDate && note.endDate ? (
                        <>Valid: {note.startDate} - {note.endDate}</>
                      ) : note.startDate ? (
                        <>Valid from: {note.startDate}</>
                      ) : (
                        <>Valid until: {note.endDate}</>
                      )}
                    </p>
                  )}
                </div>
              ))}
              {entityNotes.length > maxVisibleNotes && (
                <button
                  onClick={handleEditNote}
                  className="w-full text-center text-xs text-blue-400 py-1"
                >
                  +{entityNotes.length - maxVisibleNotes} more notes...
                </button>
              )}
            </div>
          </div>,
          document.body
        )
      }
    </>
  )
}

// Backward compatible wrapper components
export const LeadSpecialNoteIcon = ({ lead, onEditLead, ...props }) => (
  <SharedSpecialNoteIcon
    entity={lead}
    entityType="lead"
    onEdit={onEditLead}
    {...props}
  />
)

export const MemberSpecialNoteIcon = ({ member, onEditMember, ...props }) => (
  <SharedSpecialNoteIcon
    entity={member}
    entityType="member"
    onEdit={onEditMember}
    {...props}
  />
)

export default SharedSpecialNoteIcon
