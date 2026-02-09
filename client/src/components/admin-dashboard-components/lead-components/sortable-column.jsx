/* eslint-disable react/prop-types */
import { Lock, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
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
  isCompactView = false,
  expandedLeadId = null,
  setExpandedLeadId = () => {},
  sortSettings = { sortBy: 'custom', sortOrder: 'asc' },
  onSortChange = () => {},
  onToggleSortOrder = () => {},
  onToggleCollapse = null,
}) => {
  const isTrialColumn = id === "trial"
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  
  // Make the column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    data: {
      type: "column",
      columnId: id,
    },
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }
    
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortDropdown])

  // Get lead IDs for SortableContext
  const leadIds = leads.map((lead) => lead.id)

  // Sort options (removed Relations)
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date Created' },
    { value: 'custom', label: 'Custom Order' }
  ]

  const handleSortOptionClick = (sortBy) => {
    onSortChange(sortBy)
  }

  // Get current sort label
  const currentSortLabel = sortOptions.find(opt => opt.value === sortSettings.sortBy)?.label || 'Custom Order'

  // Determine which arrow icon to show
  const getSortIcon = () => {
    if (sortSettings.sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }
    return sortSettings.sortOrder === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  return (
    <div
      ref={setNodeRef}
      id={`column-${id}`}
      className={`bg-[#141414] rounded-xl h-full flex flex-col min-h-[300px] sm:min-h-[400px] transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-500/50 bg-[#1a1a2e]" : ""
      }`}
      data-column-id={id}
    >
      {/* Column Header */}
      <div 
        className="p-2 sm:p-3 flex justify-between items-center rounded-t-xl overflow-visible" 
        style={{ backgroundColor: `${color}20` }}
      >
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

        {/* Sort, Lock, Edit and Collapse Buttons */}
        <div className="flex items-center gap-1 ml-2">
          {/* Sort Button with Tooltip */}
          <div className="relative group hover:z-[100]" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg flex items-center gap-1"
            >
              {getSortIcon()}
            </button>
            {/* Tooltip - only show when dropdown is closed */}
            {!showSortDropdown && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                <span className="font-medium">Sort by: {currentSortLabel}</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            )}

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                    Sort by
                  </div>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortOptionClick(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                        sortSettings.sortBy === option.value 
                          ? 'text-white bg-gray-800/50' 
                          : 'text-gray-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortSettings.sortBy === option.value && option.value !== 'custom' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleSortOrder()
                          }}
                          className="p-1 hover:bg-gray-700 rounded text-gray-400"
                          title={`Change to ${sortSettings.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                        >
                          {sortSettings.sortOrder === 'asc' 
                            ? <ArrowUp size={14} /> 
                            : <ArrowDown size={14} />
                          }
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lock Icon Button (for demo access column) with Tooltip */}
          {isTrialColumn && (
            <div className="relative group hover:z-[100]">
              <button
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg"
              >
                <Lock size={14} className="sm:w-3.5 sm:h-3.5 shrink-0" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                <span className="font-medium">This column cannot be edited</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
          )}

          {/* Edit Column Button with Tooltip */}
          {isEditable && (
            <div className="relative group hover:z-[100]">
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
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                <span className="font-medium">Edit column</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
          )}

          {/* Collapse Button with Tooltip */}
          {onToggleCollapse && (
            <div className="relative group hover:z-[100]">
              <button
                onClick={onToggleCollapse}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg ml-1"
              >
                <ChevronLeft size={14} className="hidden md:block" />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="md:hidden"
                >
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                <span className="font-medium">Collapse column</span>
                <div className="absolute -top-1 right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column Content with Sortable Leads */}
      <div
        className="
          p-2 sm:p-3 flex-1 custom-scrollbar
          overflow-y-auto 
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
              isCompactView={isCompactView}
              expandedLeadId={expandedLeadId}
              setExpandedLeadId={setExpandedLeadId}
            />
          ))}
        </SortableContext>

        {/* Empty State / Drop Zone Indicator */}
        {leads.length === 0 && (
          <div 
            className={`
              h-full min-h-[200px]
              border-2 border-dashed rounded-xl 
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
