/* eslint-disable react/prop-types */
import { Lock } from 'lucide-react'
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableLeadCard from "./sortable-lead-card"

const SortableColumn = ({
  id,
  title,
  color,
  leads,
  onViewDetails,
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  isEditable,
  onEditColumn,
  memberRelationsLead,
  setShowHistoryModalLead,
  setSelectedLead,
  onManageTrialAppointments,
  onOpenDocuments,
  onCreateAssessment,
}) => {
  const isTrialColumn = id === "trial"
  
  // Make the column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    data: {
      type: "column",
      columnId: id,
    },
  })

  // Get lead IDs for SortableContext
  const leadIds = leads.map((lead) => lead.id)

  return (
    <div
      ref={setNodeRef}
      id={`column-${id}`}
      className={`bg-[#141414] rounded-xl overflow-hidden h-full flex flex-col min-h-[300px] sm:min-h-[400px] transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-500/50 bg-[#1a1a2e]" : ""
      }`}
      data-column-id={id}
    >
      {/* Column Header */}
      <div 
        className="p-2 sm:p-3 flex justify-between items-center" 
        style={{ backgroundColor: `${color}20` }}
      >
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="flex items-center min-w-0 flex-1 gap-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-medium text-white text-xs sm:text-sm truncate" title={title}>
              {title}
            </h3>
            <span className="shrink-0 text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full">
              {leads.length}
            </span>
          </div>

          {isTrialColumn && <Lock size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5 shrink-0 ml-2" />}
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

      {/* Column Content with Sortable Leads */}
      <div
        className="
          p-2 sm:p-3 flex-1 custom-scrollbar
          min-h-[250px] sm:min-h-[400px] 
          lg:min-h-[700px]
          overflow-y-auto 
          max-h-[75vh]
          overscroll-contain
        "
        style={{ touchAction: 'pan-y' }}
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map((lead, index) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              onViewDetails={onViewDetails}
              onAddTrial={onAddTrial}
              onCreateContract={onCreateContract}
              onEditLead={onEditLead}
              onDeleteLead={onDeleteLead}
              columnId={id}
              index={index}
              memberRelationsLead={memberRelationsLead}
              setShowHistoryModalLead={setShowHistoryModalLead}
              setSelectedLead={setSelectedLead}
              onManageTrialAppointments={onManageTrialAppointments}
              onOpenDocuments={onOpenDocuments}
              onCreateAssessment={onCreateAssessment}
              isTrialColumn={isTrialColumn}
            />
          ))}
        </SortableContext>

        {/* Empty State / Drop Zone Indicator */}
        {leads.length === 0 && (
          <div 
            className={`
              h-32 border-2 border-dashed rounded-xl 
              flex items-center justify-center text-gray-500 text-sm
              transition-colors duration-200
              ${isOver ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-700"}
            `}
          >
            {isOver ? "Drop here" : "No leads"}
          </div>
        )}
      </div>
    </div>
  )
}

export default SortableColumn
