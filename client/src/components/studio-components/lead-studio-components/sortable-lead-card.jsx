/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Calendar, CalendarIcon, Edit, FileText, Info, MoreVertical, Plus, Trash2, Users, X, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { MdHistory } from "react-icons/md"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Import shared special note icon component
import { LeadSpecialNoteIcon, extractNotes } from '../../shared/special-note/shared-special-note-icon'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMenuOpen])

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

  // Use shared extractNotes helper
  const leadNotes = extractNotes(lead, "lead")
  const hasValidNote = leadNotes.length > 0
  const hasImportantNote = leadNotes.some(n => n.isImportant)
  const hasRelationsCount = Object.values(memberRelationsLead[lead.id] || {}).flat().length
  const isInTrialColumn = columnId === "trial"
  
  // Check if lead has medical history/assessment
  const hasMedicalHistory = lead.documents?.some(doc => 
    doc.type === "medicalHistory" || 
    doc.category === "medicalHistory" ||
    doc.section === "medicalHistory"
  )
  const hasAssessment = lead.hasAssessment || lead.assessmentCompletedAt || hasMedicalHistory
  
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
            {/* Special Note Icon - Using shared component */}
            <LeadSpecialNoteIcon
              lead={lead}
              onEditLead={onEditLead}
              size="sm"
              position="relative"
            />
            
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
          {/* Special Note Icon - Using shared component */}
          <LeadSpecialNoteIcon
            lead={lead}
            onEditLead={onEditLead}
            size="md"
            position="absolute"
          />
          
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
              style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'none' }}
            >
              {/* Special Note Icon - Using shared component */}
              <LeadSpecialNoteIcon
                lead={lead}
                onEditLead={onEditLead}
                size="sm"
                position="relative"
              />
              
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
          className="flex items-center mb-2 sm:mb-3 relative cursor-grab active:cursor-grabbing select-none"
          {...attributes}
          {...listeners}
          style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'none' }}
        >
          {/* Special Note Icon - Using shared component */}
          <LeadSpecialNoteIcon
            lead={lead}
            onEditLead={onEditLead}
            size="md"
            position="absolute"
          />
          
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
              className="p-1 rounded-lg cursor-pointer text-gray-400 hover:text-orange-400 hover:bg-gray-800 active:scale-95 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
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
    </>
  )
}

export default SortableLeadCard
