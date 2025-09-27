"use client"

import { Lock } from "lucide-react"
import LeadCard from "./lead-card"
import { useState } from "react"

/* eslint-disable react/prop-types */
const Column = ({
  id,
  title,
  color,
  leads,
  onViewDetails,
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  onDragStop,
  isEditable,
  onEditColumn,
  columnRef,
  memberRelationsLead,
  setShowHistoryModalLead, // Add this to the props
  setSelectedLead, // Add this to the props - THIS WAS MISSING
  onManageTrialAppointments,
}) => {
  const isTrialColumn = id === "trial"
  const [draggingLeadId, setDraggingLeadId] = useState(null)

  return (
    <div
      ref={columnRef}
      id={`column-${id}`}
      className="bg-[#141414] rounded-xl overflow-hidden h-full flex flex-col min-h-[300px] sm:min-h-[400px]"
      data-column-id={id}
      style={{
        zIndex: draggingLeadId ? 1 : "auto",
      }}
    >
      <div className="p-2 sm:p-3 flex justify-between items-center" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
            <h3 className="font-medium text-white text-xs sm:text-sm">{title}</h3>
          </div>

          {isTrialColumn && <Lock size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />}
        </div>

        {isEditable && (
          <button
            onClick={() => onEditColumn(id, title, color)}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        )}
      </div>
      <div className="p-2 sm:p-3 flex-1 min-h-[250px] sm:min-h-[400px] overflow-y-auto max-h-[60vh]">
  {leads.map((lead, index) => (
    <LeadCard
      key={lead.id}
      lead={lead}
      onViewDetails={onViewDetails}
      onAddTrial={onAddTrial}
      onCreateContract={onCreateContract}
      onEditLead={onEditLead}
      onDeleteLead={onDeleteLead}
      columnId={id}
      onDragStop={(e, data, leadData, sourceColumnId, leadIndex) => {
        setDraggingLeadId(null)
        onDragStop(e, data, leadData, sourceColumnId, leadIndex)
      }}
      index={index}
      memberRelationsLead={memberRelationsLead}
      setShowHistoryModalLead={setShowHistoryModalLead}
      setSelectedLead={setSelectedLead}
      onManageTrialAppointments={onManageTrialAppointments}
    />
  ))}
</div>

    </div>
  )
}

export default Column
