/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown, Pin } from 'lucide-react'
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableTaskCard from "./sortable-task-card"

const SortableTaskColumn = ({
  id,
  title,
  color,
  tasks,
  onTaskStatusChange,
  onTaskUpdate,
  onTaskPinToggle,
  onTaskRemove,
  onEditRequest,
  onDeleteRequest,
  onDuplicateRequest,
  onRepeatRequest,
  configuredTags,
  availableAssignees,
  onOpenAssignModal,
  onOpenTagsModal,
  onOpenCalendarModal,
  repeatConfigs,
  isCollapsed = false,
  onToggleCollapse,
  sortSettings = { sortBy: 'custom', sortOrder: 'asc' },
  onSortChange = () => {},
  onToggleSortOrder = () => {},
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const sortDropdownRef = useRef(null)
  const sortButtonRef = useRef(null)
  
  // Separate pinned and unpinned tasks
  const pinnedTasks = tasks.filter(task => task.isPinned)
  const unpinnedTasks = tasks.filter(task => !task.isPinned)
  
  // Make the column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    data: {
      type: "column",
      columnId: id,
    },
  })

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left
      })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target) &&
          sortButtonRef.current && !sortButtonRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }
    
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortDropdown])

  // Update position on scroll/resize when dropdown is open - close on scroll
  useEffect(() => {
    if (showSortDropdown) {
      updateDropdownPosition()
      
      const handleScroll = () => {
        setShowSortDropdown(false)
      }
      
      const handleResize = () => {
        updateDropdownPosition()
      }
      
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [showSortDropdown])

  // Get task IDs for SortableContext
  const taskIds = tasks.map((task) => task.id)

  // Sort options
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'tag', label: 'Tag' },
    { value: 'recentlyAdded', label: 'Recently Added' },
    { value: 'custom', label: 'Custom Order' }
  ]

  const handleSortOptionClick = (sortBy) => {
    onSortChange(sortBy)
    // Only close for 'custom' option which has no direction toggle
    if (sortBy === 'custom') {
      setShowSortDropdown(false)
    }
  }

  const handleToggleDropdown = (e) => {
    e.stopPropagation()
    if (!showSortDropdown) {
      updateDropdownPosition()
    }
    setShowSortDropdown(!showSortDropdown)
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
      className={`bg-[#141414] flex flex-col relative transition-all duration-300 w-full ${
        isCollapsed ? 'rounded-2xl' : 'rounded-2xl'
      } ${
        isOver ? "ring-2 ring-blue-500/50 bg-[#1a1a2e]" : ""
      }`}
      data-column-id={id}
      style={{
        overflow: 'visible'
      }}
    >
      {/* Section Header - Touch Optimized */}
      <div 
        className={`px-3 py-3 md:py-2 flex items-center w-full text-left transition-all ${
          isCollapsed ? 'rounded-2xl' : 'rounded-t-2xl'
        }`}
        style={{ backgroundColor: `${color}20` }}
      >
        {/* Left side: Collapse + Sort + Color dot + Title + Count */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Collapse/Expand Button */}
          <button
            onClick={() => onToggleCollapse(id)}
            className="text-gray-400 hover:text-white p-1 flex-shrink-0 transition-colors active:opacity-80"
            title={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>

          {/* Sort Button - Desktop only in header */}
          {!isCollapsed && (
            <button
              ref={sortButtonRef}
              onClick={handleToggleDropdown}
              className="hidden md:flex text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg items-center gap-1 transition-colors"
              title={`Sort by: ${currentSortLabel}`}
            >
              {getSortIcon()}
            </button>
          )}

          {/* Color dot */}
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
          
          {/* Title - clickable to collapse/expand */}
          <button
            onClick={() => onToggleCollapse(id)}
            className="font-medium text-white text-sm truncate hover:text-gray-200 transition-colors text-left"
          >
            {title}
          </button>
          
          {/* Count badge */}
          <span className="text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full flex-shrink-0">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Sort Dropdown - Portal-like positioning */}
      {showSortDropdown && (
        <div 
          ref={sortDropdownRef}
          className="fixed bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-2xl min-w-[180px] overflow-hidden"
          style={{ 
            zIndex: 99999,
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-700">
              Sort by
            </div>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  sortSettings.sortBy === option.value 
                    ? 'text-white bg-gray-800/50' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSortOptionClick(option.value)
                  }}
                  className="flex-1 text-left"
                >
                  {option.label}
                </button>
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
              </div>
            ))}
            <div className="border-t border-gray-700 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSortDropdown(false)
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Content - Tasks */}
      {!isCollapsed && (
        <div 
          className="px-2 py-2 rounded-b-2xl"
          style={{ minHeight: tasks.length === 0 ? '60px' : 'auto' }}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {/* Pinned Tasks Section */}
                {pinnedTasks.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Pin size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs text-amber-500 font-medium">Pinned</span>
                      <div className="flex-1 h-px bg-amber-500/30"></div>
                    </div>
                    {pinnedTasks.map((task, index) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onTaskStatusChange}
                        onUpdate={onTaskUpdate}
                        onPinToggle={onTaskPinToggle}
                        onRemove={onTaskRemove}
                        onEditRequest={onEditRequest}
                        onDeleteRequest={onDeleteRequest}
                        onDuplicateRequest={onDuplicateRequest}
                        onRepeatRequest={onRepeatRequest}
                        configuredTags={configuredTags}
                        availableAssignees={availableAssignees}
                        onOpenAssignModal={onOpenAssignModal}
                        onOpenTagsModal={onOpenTagsModal}
                        onOpenCalendarModal={onOpenCalendarModal}
                        repeatConfigs={repeatConfigs}
                        columnId={id}
                        index={index}
                      />
                    ))}
                  </>
                )}
                
                {/* Unpinned Tasks Section */}
                {unpinnedTasks.length > 0 && (
                  <>
                    {pinnedTasks.length > 0 && (
                      <div className="flex items-center px-2 py-1 mt-2">
                        <div className="flex-1 h-px bg-gray-700"></div>
                      </div>
                    )}
                    {unpinnedTasks.map((task, index) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onTaskStatusChange}
                        onUpdate={onTaskUpdate}
                        onPinToggle={onTaskPinToggle}
                        onRemove={onTaskRemove}
                        onEditRequest={onEditRequest}
                        onDeleteRequest={onDeleteRequest}
                        onDuplicateRequest={onDuplicateRequest}
                        onRepeatRequest={onRepeatRequest}
                        configuredTags={configuredTags}
                        availableAssignees={availableAssignees}
                        onOpenAssignModal={onOpenAssignModal}
                        onOpenTagsModal={onOpenTagsModal}
                        onOpenCalendarModal={onOpenCalendarModal}
                        repeatConfigs={repeatConfigs}
                        columnId={id}
                        index={pinnedTasks.length + index}
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div 
                className={`
                  min-h-[50px]
                  border-2 border-dashed rounded-xl 
                  flex items-center justify-center text-gray-500 text-sm
                  transition-colors duration-200
                  ${isOver ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-700"}
                `}
              >
                {isOver ? "Drop here" : `No ${title.toLowerCase()} tasks`}
              </div>
            )}
          </SortableContext>
        </div>
      )}
    </div>
  )
}

export default SortableTaskColumn
