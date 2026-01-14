/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { Tag, Calendar, X, Pin, PinOff, Copy, Repeat, Edit, Check, Users, Save, GripVertical, Trash2 } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function SortableTaskCard({
  task,
  onStatusChange,
  onUpdate,
  onRemove,
  onPinToggle,
  onEditRequest,
  onDeleteRequest,
  onDuplicateRequest,
  onRepeatRequest,
  configuredTags,
  availableAssignees = [],
  onOpenAssignModal,
  onOpenTagsModal,
  onOpenCalendarModal,
  repeatConfigs = {},
  columnId,
  index,
  isDraggingOverlay = false,
}) {
  const [isAnimatingCompletion, setIsAnimatingCompletion] = useState(false)
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title || "")
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef(null)
  const titleInputRef = useRef(null)

  // @dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
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

  // Focus input when editing title - cursor at end
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      // Place cursor at the end, not select all
      const length = titleInputRef.current.value.length
      titleInputRef.current.setSelectionRange(length, length)
    }
  }, [isEditingTitle])

  // Sync editedTitle with task.title
  useEffect(() => {
    setEditedTitle(task.title || "")
  }, [task.title])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const handleStatusChange = (newStatus) => {
    if (newStatus === "completed" && task.status !== "completed") {
      setIsCheckboxAnimating(true)
      setTimeout(() => {
        setIsCheckboxAnimating(false)
        setIsAnimatingCompletion(true)
        setTimeout(() => {
          onStatusChange(task.id, newStatus)
          setIsAnimatingCompletion(false)
        }, 500)
      }, 300)
    } else {
      onStatusChange(task.id, newStatus)
    }
  }

  const handleTitleClick = (e) => {
    e.stopPropagation()
    if (!isCompleted && !isCanceled) {
      setIsEditingTitle(true)
      setEditedTitle(task.title || "")
    }
  }

  const handleSaveTitle = (e) => {
    if (e) e.stopPropagation()
    if (editedTitle.trim() && editedTitle.trim() !== task.title) {
      onUpdate({
        ...task,
        title: editedTitle.trim()
      })
    }
    setIsEditingTitle(false)
  }

  const handleCancelEditTitle = (e) => {
    if (e) e.stopPropagation()
    setEditedTitle(task.title || "")
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      handleCancelEditTitle()
    }
  }

  const handleTitleBlur = () => {
    // Save on blur
    handleSaveTitle()
  }

  const openDeleteConfirmation = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    onDeleteRequest(task.id)
  }

  const handlePinToggle = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    onPinToggle(task.id)
  }

  const handleDuplicate = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    onDuplicateRequest(task)
  }

  const handleRepeat = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    onRepeatRequest(task)
  }

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  const formatDateTime = () => {
    let display = ""
    if (task.dueDate) {
      const date = new Date(task.dueDate)
      display = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      const timeStr = `${formattedHour}:${minutes}`
      display += display ? ` ${timeStr}` : timeStr
    }
    return display || "No date"
  }

  const getDateTimeTooltip = () => {
    if (!task.dueDate && !task.dueTime) {
      return "No due date set"
    }

    let tooltip = ""

    if (task.dueDate) {
      const date = new Date(task.dueDate)
      tooltip += date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      tooltip += task.dueDate ? ` at ${formattedHour}:${minutes} ${ampm}` : `${formattedHour}:${minutes} ${ampm}`
    }

    if (task.reminder && task.reminder !== "None" && task.reminder !== "") {
      if (task.reminder === "Custom" && task.customReminder) {
        tooltip += `\nReminder: ${task.customReminder.value} ${task.customReminder.unit} before`
      } else {
        tooltip += `\nReminder: ${task.reminder}`
      }
    }

    if (hasRepeat) {
      const repeatConfig = repeatConfigs[task.id]
      let repeatText = `\nRepeats: ${task.repeat || task.repeatSettings?.frequency || 'Yes'}`

      if (repeatConfig?.repeatOptions) {
        const { repeatOptions } = repeatConfig
        if (repeatOptions.frequency === "weekly" && repeatOptions.repeatDays && repeatOptions.repeatDays.length > 0) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          const dayNames = repeatOptions.repeatDays.map(day => days[day]).join(', ')
          repeatText += ` (${dayNames})`
        }

        if (repeatOptions.endDate) {
          const endDate = new Date(repeatOptions.endDate).toLocaleDateString()
          repeatText += `\nEnds on: ${endDate}`
        } else if (repeatOptions.occurrences) {
          repeatText += `\nEnds after: ${repeatOptions.occurrences} occurrences`
        }
      }

      tooltip += repeatText
    }

    return tooltip
  }

  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#FFFFFF"
  }

  const handleAssignClick = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    if (onOpenAssignModal) {
      onOpenAssignModal(task)
    }
  }

  const handleTagsClick = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    if (onOpenTagsModal) {
      onOpenTagsModal(task)
    }
  }

  const handleCalendarClick = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    if (!isCompleted && !isCanceled) {
      onOpenCalendarModal?.(
        task.id,
        task.dueDate,
        task.dueTime,
        task.reminder,
        task.repeat,
        task.customReminder,
        task.repeatEnd
      )
    }
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"
  const hasRepeat = (task.repeatSettings && task.repeatSettings.frequency) || repeatConfigs[task.id] || task.repeat

  // For drag overlay, render without sortable functionality
  if (isDraggingOverlay) {
    return (
      <div
        className={`rounded-xl px-3 py-2 transition-all duration-300 ease-in-out relative shadow-2xl scale-105 select-none ${
          isCompleted
            ? "bg-[#1c1c1c] text-gray-500"
            : isCanceled
              ? "bg-[#1a1a1a] text-gray-600 italic line-through"
              : "bg-[#1a1a1a] text-white"
        }`}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-blue-400 flex-shrink-0" />
          <input
            type="checkbox"
            checked={isCompleted}
            readOnly
            className={`form-checkbox h-4 w-4 rounded-full border-gray-300 flex-shrink-0 ${
              isCompleted ? "text-gray-500 bg-gray-500 border-gray-500" : "text-blue-500"
            }`}
          />
          <span className="font-medium text-sm select-none truncate">
            {task.title}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl px-3 py-2 transition-all duration-300 ease-in-out relative select-none ${
        isDragging ? "opacity-50 shadow-2xl scale-[1.02]" : "opacity-100"
      } ${
        isCompleted
          ? "bg-[#1c1c1c] text-gray-500"
          : isCanceled
            ? "bg-[#1a1a1a] text-gray-600 italic"
            : "bg-[#1a1a1a] text-white"
      } ${isAnimatingCompletion ? "animate-pulse scale-[0.98]" : ""}`}
    >
      {/* Main Row: Drag Handle + Checkbox + Title + Tags + Meta + Menu */}
      <div className="flex items-center gap-2">
        {/* Drag Handle - Only this area enables dragging */}
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white active:text-blue-400 p-1 -ml-1 rounded-lg active:bg-blue-500/30 flex-shrink-0 touch-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical size={16} />
        </div>

        {/* Checkbox / Cancel indicator */}
        {isCanceled ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleStatusChange("ongoing")
            }}
            className="h-4 w-4 flex items-center justify-center text-gray-400 bg-[#3a3a3a] rounded-sm cursor-pointer border border-gray-500 flex-shrink-0"
            title="Canceled - Click to restore"
          >
            <X size={12} />
          </button>
        ) : (
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => handleStatusChange(isCompleted ? "ongoing" : "completed")}
              className={`form-checkbox h-4 w-4 cursor-pointer rounded-full border-gray-300 focus:ring-blue-500 transition-all duration-200 ${
                isCheckboxAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
              } ${
                isCompleted
                  ? "text-gray-500 bg-gray-500 border-gray-500"
                  : "text-blue-500"
              }`}
            />
            {isCheckboxAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  size={12}
                  className="text-blue-500 animate-tick"
                  style={{
                    animation: "tick 0.3s ease-out forwards",
                    strokeDasharray: 18,
                    strokeDashoffset: isCheckboxAnimating ? 0 : 18,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Title - Inline editable - Takes full width when editing */}
        {isEditingTitle ? (
          <div className="flex-1 min-w-0">
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              className="w-full bg-[#101010] text-white px-3 py-1.5 rounded-lg outline-none text-sm border-2 border-blue-500 focus:border-blue-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <>
            {/* Title text */}
            <span
              className={`font-medium text-sm flex-shrink min-w-0 truncate ${
                isCanceled ? "line-through" : ""
              } ${
                !isCompleted && !isCanceled 
                  ? "cursor-text hover:bg-gray-800/50 rounded px-1 -mx-1 transition-colors" 
                  : ""
              }`}
              onClick={handleTitleClick}
              title={!isCompleted && !isCanceled ? "Click to edit" : task.title}
            >
              {task.title}
            </span>

            {/* Tags - directly after title */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {task.tags.slice(0, 3).map((tag, idx) =>
                  tag && (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-all hover:brightness-110 hover:scale-105 whitespace-nowrap ${
                        isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "text-white"
                      }`}
                      style={{
                        backgroundColor: isCompleted || isCanceled ? "#2b2b2b" : getTagColor(tag),
                      }}
                      onClick={handleTagsClick}
                    >
                      {tag}
                    </span>
                  )
                )}
                {task.tags.length > 3 && (
                  <span 
                    className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
                    onClick={handleTagsClick}
                  >
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Spacer to push meta items to the right */}
            <div className="flex-1" />

            {/* Assignees - show full names when title is short */}
            {task.assignees?.length > 0 && (
              <div
                className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer flex-shrink-0 transition-all ${
                  isCompleted || isCanceled 
                    ? "bg-[#2d2d2d] text-gray-500" 
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 hover:scale-105 hover:brightness-110"
                }`}
                onClick={handleAssignClick}
              >
                <Users size={10} />
                {/* Show full names if title is short (< 40 chars), otherwise abbreviate */}
                {(task.title?.length || 0) < 40 ? (
                  <span className="whitespace-nowrap">
                    {task.assignees.join(", ")}
                  </span>
                ) : (
                  <>
                    <span className="truncate max-w-[80px]">
                      {task.assignees?.[0]}
                    </span>
                    {task.assignees?.length > 1 && (
                      <span>+{task.assignees.length - 1}</span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Date/Time - Always blue background with hover effect */}
            {(task.dueDate || task.dueTime) && (
              <div
                className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer group relative flex-shrink-0 transition-all ${
                  isCompleted || isCanceled 
                    ? "bg-[#2d2d2d] text-gray-500 border border-gray-600" 
                    : "bg-blue-900/30 text-blue-300 border border-blue-700/50 hover:bg-blue-800/40 hover:scale-105 hover:brightness-110"
                }`}
                onClick={handleCalendarClick}
              >
                <Calendar size={10} />
                <span className="whitespace-nowrap">{formatDateTime()}</span>
                {hasRepeat && (
                  <Repeat size={10} className={`${isCompleted || isCanceled ? 'text-gray-500' : 'text-blue-400'}`} title="Repeating task" />
                )}

                {/* Hover tooltip */}
                <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block z-50 min-w-[180px]">
                  <div className="bg-black text-white text-xs rounded-lg py-2 px-3 whitespace-pre-line shadow-xl border border-gray-600">
                    {getDateTimeTooltip()}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Three-dot Menu */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-gray-400 hover:text-blue-400 p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-8 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-[9999] min-w-[160px]">
              {/* Date/Time */}
              <button
                onClick={handleCalendarClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                <Calendar size={14} /> Date & Time
              </button>

              {/* Assign */}
              <button
                onClick={handleAssignClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                <Users size={14} /> Assign
              </button>

              {/* Tags */}
              <button
                onClick={handleTagsClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                <Tag size={14} /> Tags
              </button>

              {/* Divider */}
              <div className="border-t border-gray-700 my-1"></div>

              {/* Pin/Unpin */}
              <button
                onClick={handlePinToggle}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                {task.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                {task.isPinned ? "Unpin" : "Pin"}
              </button>

              {/* Duplicate */}
              <button
                onClick={handleDuplicate}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                <Copy size={14} /> Duplicate
              </button>

              {/* Repeat */}
              <button
                onClick={handleRepeat}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
              >
                <Repeat size={14} /> Repeat
              </button>

              {/* Divider */}
              <div className="border-t border-gray-700 my-1"></div>

              {/* Status changes */}
              {!isCanceled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(false)
                    handleStatusChange("canceled")
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                >
                  <X size={14} /> Cancel Task
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdown(false)
                      handleStatusChange("ongoing")
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-yellow-500 text-sm flex items-center gap-2 transition-colors"
                  >
                    <Edit size={14} /> Set Ongoing
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdown(false)
                      handleStatusChange("completed")
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-green-500 text-sm flex items-center gap-2 transition-colors"
                  >
                    <Check size={14} /> Complete
                  </button>
                </>
              )}

              {/* Delete */}
              <button
                onClick={openDeleteConfirmation}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes tick {
          from {
            stroke-dashoffset: 18;
            transform: scale(0.8);
          }
          to {
            stroke-dashoffset: 0;
            transform: scale(1);
          }
        }
        .animate-tick {
          animation: tick 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-out;
        }
        .cursor-grab {
          cursor: grab;
        }
        .cursor-grab:active {
          cursor: grabbing;
        }
        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </div>
  )
}
