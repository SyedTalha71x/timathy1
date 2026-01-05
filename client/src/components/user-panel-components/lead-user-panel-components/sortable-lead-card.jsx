/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AlertTriangle, Calendar, CalendarIcon, Edit, FileText, Info, MoreVertical, Trash2, Users, X } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { MdHistory } from "react-icons/md"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"
import { SpecialNoteEditModal } from "../../myarea-components/SpecialNoteEditModal"

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
  onEditNote,
  onOpenDocuments,
  onCreateAssessment,
  isTrialColumn,
  isDraggingOverlay = false, // New prop for drag overlay
}) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const [showEditNoteModal, setShowEditNoteModal] = useState(false)

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const hasValidNote = lead.specialNote && lead.specialNote.text && lead.specialNote.text.trim() !== ""
  const hasRelationsCount = Object.values(memberRelationsLead[lead.id] || {}).flat().length
  const isInTrialColumn = columnId === "trial"
  const hasAssessment = lead.hasAssessment || lead.assessmentCompletedAt

  const handleNoteClick = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setNotePosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    })
    setIsNoteOpen(!isNoteOpen)
  }

  const handleNoteMouseEnter = (e) => {
    e.stopPropagation()
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    setNotePosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    })
    
    const timeout = setTimeout(() => {
      setHoveredNoteId(lead.id)
    }, 300)
    setHoverTimeout(timeout)
  }

  const handleNoteMouseLeave = (e) => {
    e.stopPropagation()
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setHoveredNoteId(null)
  }

  const handleEditNote = (e) => {
    e.stopPropagation()
    setShowEditNoteModal(true)
    setIsNoteOpen(false)
    setHoveredNoteId(null)
  }

  const handleSaveNote = (leadId, updatedNote) => {
    if (onEditNote) {
      onEditNote(leadId, updatedNote)
    }
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

  // If this is the drag overlay, render without sortable functionality
  if (isDraggingOverlay) {
    return (
      <div
        className="bg-[#1C1C1C] rounded-xl p-3 sm:p-4 min-h-[120px] sm:min-h-[140px] shadow-2xl border-2 border-blue-500/50 rotate-2"
        data-lead-id={lead.id}
      >
        <div className="flex items-center mb-2 sm:mb-3 relative">
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${
                lead.specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] z-10`}
            >
              {lead.specialNote.isImportant ? (
                <AlertTriangle size={18} className="text-white" />
              ) : (
                <Info size={18} className="text-white" />
              )}
            </div>
          )}
          
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-[#1C1C1C] rounded-xl p-3 sm:p-4 mb-3 min-h-[120px] sm:min-h-[140px] ${
          isDragging ? "ring-2 ring-blue-500/50" : ""
        }`}
        data-lead-id={lead.id}
      >
        {/* Drag Handle - the entire card header area */}
        <div 
          className="flex items-center mb-2 sm:mb-3 relative cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${
                lead.specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] z-10 cursor-pointer transition-all duration-200 hover:scale-110`}
              onClick={handleNoteClick}
              onMouseEnter={handleNoteMouseEnter}
              onMouseLeave={handleNoteMouseLeave}
            >
              {lead.specialNote.isImportant ? (
                <AlertTriangle size={18} className="text-white" />
              ) : (
                <Info size={18} className="text-white" />
              )}
            </div>
          )}
          
          {/* Note Popover */}
          {shouldShowNotePopover && hasValidNote &&
            createPortal(
              <div
                ref={noteRef}
                className="fixed w-64 sm:w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999]"
                style={{
                  top: notePosition.top,
                  left: notePosition.left,
                }}
                onMouseEnter={() => {
                  if (hoveredNoteId === lead.id) {
                    setHoveredNoteId(lead.id)
                  }
                }}
                onMouseLeave={() => {
                  if (hoveredNoteId === lead.id) {
                    setHoveredNoteId(null)
                  }
                }}
              >
                <div className="bg-gray-800 p-2 sm:p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {lead.specialNote.isImportant ? (
                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex gap-1 items-center font-medium">
                    <div>Special Note</div>
                    <div className="text-sm text-gray-400">
                      {lead.specialNote.isImportant ? "(Important)" : ""}
                    </div>
                  </h4>
                  <button
                    onClick={handleEditNote}
                    className="ml-auto text-gray-400 hover:text-blue-400 transition-colors p-1"
                    title="Edit note"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsNoteOpen(false)
                      setHoveredNoteId(null)
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm leading-relaxed">{lead.specialNote.text}</p>
                  {lead.specialNote.startDate && lead.specialNote.endDate ? (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <Calendar size={12} /> Valid from{" "}
                        {new Date(lead.specialNote.startDate).toLocaleDateString()} to{" "}
                        {new Date(lead.specialNote.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <Calendar size={12} /> Always valid
                      </p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )
          }
          
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
      
            <div className="mt-2">
              <div
                className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(lead, "relations")
                }}
              >
                <Users size={12} /> Relations ({hasRelationsCount})
              </div>
            </div>
          </div>
          
          {/* Menu Button - excluded from drag */}
          <div className="absolute top-0 right-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="p-1 rounded-md cursor-pointer bg-black text-white"
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
                    setLeadToDelete(lead)
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
        <div className="flex justify-center">
          {isInTrialColumn ? (
            <div className="flex items-center w-full gap-2">
              {!hasAssessment ? (
                <button
                  onClick={handleCreateAssessment}
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-xl px-4 py-2"
                >
                  Create Medical History
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateContract(lead)
                  }}
                  className="flex-1 bg-orange-500 text-white text-xs rounded-xl px-4 py-2"
                >
                  Create Contract
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onManageTrialAppointments(lead)
                }}
                className="text-white bg-black cursor-pointer rounded-xl border border-slate-600 py-2 px-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddTrial(lead)
              }}
              className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full"
            >
              Add Trial Training
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {leadToDelete && createPortal(
        <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-[99999]">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Lead</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold">{leadToDelete.firstName} {leadToDelete.surname}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLeadToDelete(null)
                }}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteLead(leadToDelete.id)
                  setLeadToDelete(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Note Modal */}
      {showEditNoteModal && (
        <SpecialNoteEditModal
          isOpen={showEditNoteModal}
          onClose={() => setShowEditNoteModal(false)}
          appointment={lead}
          onSave={handleSaveNote}
        />
      )}
    </>
  )
}

export default SortableLeadCard
