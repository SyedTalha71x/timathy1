/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AlertTriangle, Calendar, CalendarIcon, Edit, FileText, Info, MoreVertical, Plus, Trash2, Users, X, StickyNote, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { MdHistory } from "react-icons/md"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"

// Note Status Options
const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

const getStatusLabel = (statusId) => {
  const status = NOTE_STATUSES.find(s => s.id === statusId)
  return status ? status.label : "General"
}

const SortableLeadCard = ({
  lead,
  onViewDetails,
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  columnId,
  index,
  memberRelationsLead,
  setShowHistoryModalLead,
  setSelectedLead,
  onManageTrialAppointments,
  onOpenDocuments,
  onCreateAssessment,
  isTrialColumn,
  isDraggingOverlay = false,
  isCompactView = false,
  expandedLeadId = null,
  setExpandedLeadId = () => {},
}) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const [leaveTimeout, setLeaveTimeout] = useState(null)

  const noteRef = useRef(null)
  const menuRef = useRef(null)

  // @dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "lead",
      lead,
      columnId,
      index,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setIsNoteOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isNoteOpen || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isNoteOpen, isMenuOpen])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
      if (leaveTimeout) clearTimeout(leaveTimeout)
    }
  }, [hoverTimeout, leaveTimeout])

  // Close popup on scroll
  useEffect(() => {
    const handleScroll = (event) => {
      // Don't close if scrolling inside the popup itself
      if (noteRef.current && noteRef.current.contains(event.target)) {
        return
      }
      
      if (isNoteOpen || hoveredNoteId === lead.id) {
        setIsNoteOpen(false)
        setHoveredNoteId(null)
        if (hoverTimeout) clearTimeout(hoverTimeout)
        if (leaveTimeout) clearTimeout(leaveTimeout)
      }
    }

    // Listen to scroll on window and any scrollable parent
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isNoteOpen, hoveredNoteId, lead.id, hoverTimeout, leaveTimeout])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPhoneNumbers = (phoneNumber, telephoneNumber) => {
    if (phoneNumber && telephoneNumber) {
      return `${phoneNumber} / ${telephoneNumber}`
    }
    return phoneNumber || telephoneNumber || "-"
  }

  // Get notes array (support both old specialNote and new notes array)
  const getNotes = () => {
    if (lead.notes && Array.isArray(lead.notes) && lead.notes.length > 0) {
      return lead.notes
    }
    if (lead.specialNote && lead.specialNote.text && lead.specialNote.text.trim() !== "") {
      return [{
        id: 1,
        status: "general",
        text: lead.specialNote.text,
        isImportant: lead.specialNote.isImportant || false,
        startDate: lead.specialNote.startDate || "",
        endDate: lead.specialNote.endDate || "",
        createdAt: lead.createdAt || "",
      }]
    }
    return []
  }
  
  const leadNotes = getNotes()
  const hasValidNote = leadNotes.length > 0
  const hasImportantNote = leadNotes.some(n => n.isImportant)
  const hasRelationsCount = Object.values(memberRelationsLead[lead.id] || {}).flat().length
  const isInTrialColumn = columnId === "trial"
  const hasAssessment = lead.hasAssessment || lead.assessmentCompletedAt
  
  // Check if lead has any trial appointments
  const hasTrialAppointments = (() => {
    const storedAppointments = localStorage.getItem("trialAppointments")
    if (storedAppointments) {
      const appointments = JSON.parse(storedAppointments)
      return appointments.some(apt => apt.leadId === lead.id)
    }
    return false
  })()
  
  // Show calendar icon if in trial column OR has trial appointments
  const shouldShowCalendarIcon = isInTrialColumn || hasTrialAppointments

  const handleNoteClick = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom - 16 // 16px margin from bottom
    
    setNotePosition({
      top: rect.bottom + 8,
      left: rect.left,
      maxHeight: Math.min(spaceBelow, viewportHeight * 0.6), // Use available space or 60vh, whichever is smaller
    })
    setIsNoteOpen(!isNoteOpen)
  }

  const handleNoteMouseEnter = (e) => {
    e.stopPropagation()
    
    // Clear any existing timeouts
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    if (leaveTimeout) {
      clearTimeout(leaveTimeout)
      setLeaveTimeout(null)
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom - 16 // 16px margin from bottom
    
    setNotePosition({
      top: rect.bottom + 8,
      left: rect.left,
      maxHeight: Math.min(spaceBelow, viewportHeight * 0.6), // Use available space or 60vh, whichever is smaller
    })
    
    const timeout = setTimeout(() => {
      setHoveredNoteId(lead.id)
    }, 300)
    setHoverTimeout(timeout)
  }

  const handleNoteMouseLeave = (e) => {
    e.stopPropagation()
    
    // Clear enter timeout if still pending
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    // Don't hide if mouse is moving to popup (increased delay for popups above icon)
    const timeout = setTimeout(() => {
      // Only hide if not hovering over popup
      if (!noteRef.current || !noteRef.current.matches(':hover')) {
        setHoveredNoteId(null)
      }
    }, 300) // Increased from 200 to 300ms
    setLeaveTimeout(timeout)
  }

  const handlePopupMouseEnter = (e) => {
    e.stopPropagation()
    // Cancel any pending leave timeout when hovering over popup
    if (leaveTimeout) {
      clearTimeout(leaveTimeout)
      setLeaveTimeout(null)
    }
  }

  const handlePopupMouseLeave = (e) => {
    e.stopPropagation()
    // Hide popup when leaving the popup area
    const timeout = setTimeout(() => {
      setHoveredNoteId(null)
    }, 100)
    setLeaveTimeout(timeout)
  }

  const handleEditNote = (e) => {
    e.stopPropagation()
    if (hoverTimeout) clearTimeout(hoverTimeout)
    if (leaveTimeout) clearTimeout(leaveTimeout)
    if (onEditLead) {
      onEditLead(lead, "note")
    }
    setIsNoteOpen(false)
    setHoveredNoteId(null)
  }

  const handleOpenDocuments = (e) => {
    e.stopPropagation()
    if (onOpenDocuments) {
      onOpenDocuments(lead)
    }
    setIsMenuOpen(false)
  }

  const handleCreateAssessment = (e) => {
    e.stopPropagation()
    if (onCreateAssessment) {
      onCreateAssessment(lead)
    }
  }

  const shouldShowNotePopover = isNoteOpen || hoveredNoteId === lead.id
  
  const isCompactCollapsed = isCompactView && expandedLeadId !== lead.id

  // If this is the drag overlay, render without sortable functionality
  if (isDraggingOverlay) {
    if (isCompactCollapsed) {
      return (
        <div
          className="bg-[#1C1C1C] rounded-xl p-3 shadow-2xl border-2 border-blue-500/50 rotate-2"
          data-lead-id={lead.id}
        >
          <div className="flex items-center gap-3">
            {/* Special Note Icon */}
            {hasValidNote ? (
              <div
                className={`${
                  hasImportantNote 
                    ? "bg-red-500" 
                    : "bg-blue-500"
                } rounded-full p-1 border-[2.5px] border-white shadow-lg flex-shrink-0`}
              >
                {hasImportantNote ? (
                  <AlertTriangle size={12} className="text-white" />
                ) : (
                  <Info size={12} className="text-white" />
                )}
              </div>
            ) : (
              <div className="bg-transparent border-[2.5px] border-dashed border-gray-400 rounded-full p-1 shadow-lg flex-shrink-0">
                <StickyNote size={12} className="text-gray-400" />
              </div>
            )}
            
            <span className="text-white font-medium text-sm truncate">
              {lead.firstName} {lead.surname}
            </span>
          </div>
        </div>
      )
    }
    
    return (
      <div
        className="bg-[#1C1C1C] rounded-xl p-3 sm:p-4 min-h-[120px] sm:min-h-[140px] shadow-2xl border-2 border-blue-500/50 rotate-2"
        data-lead-id={lead.id}
      >
        <div className="flex items-center mb-2 sm:mb-3 relative">
          {hasValidNote ? (
            <div
              className={`absolute -top-2 -left-2 ${
                hasImportantNote 
                  ? "bg-red-500" 
                  : "bg-blue-500"
              } rounded-full p-1 border-[2.5px] border-white shadow-lg z-10`}
            >
              {hasImportantNote ? (
                <AlertTriangle size={14} className="text-white" />
              ) : (
                <Info size={14} className="text-white" />
              )}
            </div>
          ) : (
            <div
              className="absolute -top-2 -left-2 bg-transparent border border-dashed border-gray-400 rounded-full p-1 shadow-lg z-10"
            >
              <StickyNote size={14} className="text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{formatPhoneNumbers(lead.phoneNumber, lead.telephoneNumber)}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isCompactCollapsed ? (
        // COMPACT COLLAPSED VIEW
        <div
          ref={setNodeRef}
          style={style}
          className="bg-[#1C1C1C] rounded-xl p-3 mb-3 hover:bg-[#242424] transition-colors"
          data-lead-id={lead.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div 
              className="flex items-center gap-3 flex-1 min-w-0 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
              style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}
            >
              {/* Special Note Icon - Inside card */}
              {hasValidNote ? (
                <div
                  className={`${
                    hasImportantNote 
                      ? "bg-red-500 hover:bg-red-400" 
                      : "bg-blue-500 hover:bg-blue-400"
                  } rounded-full p-1 border-[2.5px] border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNoteClick(e)
                  }}
                  onMouseEnter={handleNoteMouseEnter}
                  onMouseLeave={handleNoteMouseLeave}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {hasImportantNote ? (
                    <AlertTriangle size={12} className="text-white" />
                  ) : (
                    <Info size={12} className="text-white" />
                  )}
                </div>
              ) : (
                <div
                  className="bg-transparent border-[2.5px] border-dashed border-gray-400 hover:border-gray-300 rounded-full p-1 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onEditLead) {
                      onEditLead(lead, "note")
                    }
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Add special note"
                >
                  <StickyNote size={12} className="text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <span className="text-white font-medium text-sm truncate block">
                  {lead.firstName} {lead.surname}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedLeadId(lead.id)
              }}
              className="p-1 bg-black rounded-lg border border-slate-600 hover:border-slate-400 transition-colors flex-shrink-0"
              title="Expand"
            >
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      ) : (
        // DETAILED VIEW (normal full card)
        <div
          ref={setNodeRef}
          style={style}
          className={`bg-[#1C1C1C] rounded-xl p-3 sm:p-4 mb-3 min-h-[120px] sm:min-h-[140px] ${
            isDragging ? "ring-2 ring-blue-500/50 select-none" : ""
          }`}
          data-lead-id={lead.id}
        >
          {/* Collapse button for expanded compact view */}
          {isCompactView && expandedLeadId === lead.id && (
            <div className="flex justify-end mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedLeadId(null)
                }}
                className="p-1 bg-black rounded-lg border border-slate-600 hover:border-slate-400 transition-colors"
                title="Collapse"
              >
                <ChevronUp className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          )}
          
          {/* Drag Handle - the entire card header area */}
        <div 
          className="flex items-center mb-2 sm:mb-3 relative cursor-grab active:cursor-grabbing select-none touch-pan-y"
          {...attributes}
          {...listeners}
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
        >
          {hasValidNote ? (
            <div
              className={`absolute -top-2 -left-2 ${
                hasImportantNote 
                  ? "bg-red-500 hover:bg-red-400" 
                  : "bg-blue-500 hover:bg-blue-400"
              } rounded-full p-1 border-[2.5px] border-white shadow-lg z-10 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95`}
              onClick={handleNoteClick}
              onMouseEnter={handleNoteMouseEnter}
              onMouseLeave={handleNoteMouseLeave}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {hasImportantNote ? (
                <AlertTriangle size={14} className="text-white" />
              ) : (
                <Info size={14} className="text-white" />
              )}
            </div>
          ) : (
            <div
              className="absolute -top-2 -left-2 bg-transparent border border-dashed border-gray-400 hover:border-gray-300 rounded-full p-1 shadow-lg z-10 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation()
                if (onEditLead) {
                  onEditLead(lead, "note")
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Add special note"
            >
              <StickyNote size={14} className="text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{formatPhoneNumbers(lead.phoneNumber, lead.telephoneNumber)}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
      
            <div className="mt-2">
              <div
                className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer hover:text-blue-300 transition-colors active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(lead, "relations")
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Users size={12} /> Relations ({hasRelationsCount})
              </div>
            </div>
          </div>
          
          {/* Menu Button - excluded from drag */}
          <div className="absolute top-0 right-0" onPointerDown={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="p-1 rounded-md cursor-pointer bg-black text-white active:scale-95 transition-transform"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-4 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-lg shadow-lg z-50 w-48"
              >
                <button
                  onClick={() => {
                    onViewDetails(lead)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <Info size={14} /> View Details
                </button>
                <button
                  onClick={() => {
                    onEditLead(lead)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={handleOpenDocuments}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <FileText size={14} /> Documents
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(lead)
                    setShowHistoryModalLead(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <MdHistory size={18} /> View History
                </button>
                <button
                  onClick={() => {
                    onDeleteLead(lead.id)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons - excluded from drag */}
        <div className="flex justify-center" onPointerDown={(e) => e.stopPropagation()}>
          {isInTrialColumn ? (
            <div className="flex items-center w-full gap-2">
              {!hasAssessment ? (
                <button
                  onClick={handleCreateAssessment}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-xl px-4 py-2 active:scale-95 transition-transform flex items-center justify-center gap-1"
                >
                  <Pencil size={14} /> Fill Out Medical History
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateContract(lead)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-xl px-4 py-2 active:scale-95 transition-transform flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Create Contract
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onManageTrialAppointments(lead)
                }}
                className="text-white bg-black cursor-pointer rounded-xl border border-slate-600 py-2 px-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center active:scale-95"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
          ) : hasTrialAppointments ? (
            // Lead has trial appointments but is not in trial column - show both buttons
            <div className="flex items-center w-full gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddTrial(lead)
                }}
                className="flex-1 bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 active:scale-95 transition-transform flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Book Trial Training
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onManageTrialAppointments(lead)
                }}
                className="text-white bg-black cursor-pointer rounded-xl border border-slate-600 py-2 px-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center active:scale-95"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
          ) : (
            // No appointments and not in trial column - only show book button
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddTrial(lead)
              }}
              className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full active:scale-95 transition-transform flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Book Trial Training
            </button>
          )}
        </div>
      </div>
      )}
      
      {/* Note Popover - Available in both compact and detailed views */}
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
                <span className="text-xs text-gray-500">({leadNotes.length})</span>
              </h4>
              <button
                onClick={handleEditNote}
                className="ml-auto text-gray-400 p-1"
                title="Edit notes"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (hoverTimeout) clearTimeout(hoverTimeout)
                  if (leaveTimeout) clearTimeout(leaveTimeout)
                  setIsNoteOpen(false)
                  setHoveredNoteId(null)
                }}
                className="text-gray-400 p-1"
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
              {[...leadNotes]
                .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                .slice(0, 5)
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
              {leadNotes.length > 5 && (
                <button
                  onClick={handleEditNote}
                  className="w-full text-center text-xs text-blue-400 py-1"
                >
                  +{leadNotes.length - 5} more notes...
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

export default SortableLeadCard
