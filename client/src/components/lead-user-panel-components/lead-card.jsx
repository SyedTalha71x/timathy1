"use client"

/* eslint-disable react/prop-types */
import { AlertTriangle, Calendar, CalendarIcon, Edit, Info, MoreVertical, Trash2, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { MdHistory } from "react-icons/md"
import Draggable from "react-draggable"

const LeadCard = ({
  lead,
  onViewDetails,
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  columnId,
  onDragStop,
  index,
  memberRelationsLead,
  setShowHistoryModalLead,
  setSelectedLead,
  onManageTrialAppointments,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const noteRef = useRef(null)
  const menuRef = useRef(null)
  const nodeRef = useRef(null) // Ref for the draggable node

  // Handle clicking outside the note popover
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

  // Format date helper function
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const hasValidNote = lead.specialNote && lead.specialNote.text && lead.specialNote.text.trim() !== ""

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragStop = (e, data) => {
    setIsDragging(false)
    onDragStop(e, data, lead, columnId, index)
  }

  // Calculate relations count
  const hasRelationsCount = Object.values(memberRelationsLead[lead.id] || {}).flat().length

  // Determine button based on column
  const isInTrialColumn = columnId === "trial"

  return (
    <Draggable
      key={`${lead.id}-${lead.dragVersion || 0}`}
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onStop={handleDragStop}
      defaultPosition={{ x: 0, y: 0 }}
      cancel=".no-drag"
    >
      <div
        ref={nodeRef}
        className={`bg-[#1C1C1C] rounded-xl p-3 sm:p-4 mb-3 cursor-grab min-h-[120px] sm:min-h-[140px] ${
          isDragging ? "opacity-70 z-[9999] relative" : "opacity-100"
        }`}
        style={{
          zIndex: isDragging ? 9999 : "auto",
          position: isDragging ? "absolute" : "static",
        
        }}
        data-lead-id={lead.id}
      >
        <div className="flex items-center mb-2 sm:mb-3 relative">
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${
                lead.specialNote.isImportant ? "bg-red-500 " : "bg-blue-500 "
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] z-10 cursor-pointer no-drag`} // Added no-drag to prevent drag initiation
              onClick={(e) => {
                e.stopPropagation()
                setIsNoteOpen(!isNoteOpen)
              }}
            >
              {lead.specialNote.isImportant ? (
                <AlertTriangle size={18} className="text-white" />
              ) : (
                <Info size={18} className="text-white" />
              )}
            </div>
          )}
          {isNoteOpen && hasValidNote && (
            <div
              ref={noteRef}
              className="absolute left-0 top-6 w-64 sm:w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[200] no-drag"
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
                    {lead.specialNote.isImportant ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsNoteOpen(false)
                  }}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{lead.specialNote.text}</p>
                {lead.specialNote.startDate && lead.specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <Calendar size={12} /> Valid from {new Date(lead.specialNote.startDate).toLocaleDateString()} to{" "}
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
            </div>
          )}
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
            {/* Always display relations line, even if count is 0, and make it clickable to edit */}
            <div className="mt-2">
              <div
                className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer no-drag" // Added no-drag here to allow clicks without triggering drag
                onClick={() => onEditLead(lead, "relations")} // Changed to onEditLead and added 'relations' tab
              >
                <Users size={12} /> Relations ({hasRelationsCount})
              </div>
            </div>
          </div>
          {/* Three-dot menu */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md cursor-pointer bg-black text-white no-drag"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-8 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-lg shadow-lg z-50 w-40 no-drag"
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
                  onClick={() => {
                    setSelectedLead(lead) // Add this line to set the selected lead
                    setShowHistoryModalLead(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <MdHistory size={18} /> View History
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${lead.firstName} ${lead.surname}?`)) {
                      onDeleteLead(lead.id)
                    }
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
        <div className="flex justify-center">
          {isInTrialColumn ? (
            <div className="flex items-center w-full gap-2">
              <button
                onClick={() => onCreateContract(lead)}
                className="bg-[#FF843E] hover:bg-[#E64D2E] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
              >
                Create Contract
              </button>
              <button
                onClick={() => onManageTrialAppointments(lead)}
                className="text-white bg-black cursor-pointer rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors no-drag text-sm flex items-center justify-center"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddTrial(lead)}
              className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
            >
              Add Trial Training
            </button>
          )}
        </div>
      </div>
    </Draggable>
  )
}

export default LeadCard
