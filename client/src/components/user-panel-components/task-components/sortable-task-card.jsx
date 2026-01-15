/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { Tag, Calendar, X, Pin, PinOff, Copy, Repeat, Edit, Check, Users, GripVertical, Trash2 } from "lucide-react"
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

  // Focus input when editing title
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
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
        }, 400)
      }, 250)
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
      onUpdate({ ...task, title: editedTitle.trim() })
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
    if (!task.dueDate && !task.dueTime) return "No due date set"
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
      tooltip += `\nReminder: ${task.reminder}`
    }

    if (hasRepeat) {
      tooltip += `\nRepeats: Yes`
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
    onOpenAssignModal?.(task)
  }

  const handleTagsClick = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    onOpenTagsModal?.(task)
  }

  const handleCalendarClick = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    if (!isCompleted && !isCanceled) {
      onOpenCalendarModal?.(task.id, task.dueDate, task.dueTime, task.reminder, task.repeat)
    }
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"
  const hasRepeat = (task.repeatSettings && task.repeatSettings.frequency) || repeatConfigs[task.id] || task.repeat

  // For drag overlay
  if (isDraggingOverlay) {
    return (
      <div
        className={`rounded-xl px-3 py-3 transition-all duration-300 ease-in-out relative shadow-2xl scale-105 select-none ${
          isCompleted ? "bg-[#1c1c1c] text-gray-500" :
          isCanceled ? "bg-[#1a1a1a] text-gray-600 italic line-through" :
          "bg-[#1a1a1a] text-white"
        }`}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <div className="flex items-center gap-3">
          <GripVertical size={16} className="text-blue-400 flex-shrink-0" />
          {isCanceled ? (
            <div className="w-5 h-5 flex items-center justify-center text-gray-400 bg-[#3a3a3a] rounded-full border border-gray-500 flex-shrink-0">
              <X size={12} />
            </div>
          ) : (
            <input
              type="checkbox"
              checked={isCompleted}
              readOnly
              className="form-checkbox h-5 w-5 rounded-full border-gray-300 flex-shrink-0"
            />
          )}
          <span className={`font-medium text-sm select-none truncate ${isCanceled ? 'line-through' : ''}`}>{task.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl px-3 py-3 transition-all duration-300 ease-in-out relative select-none ${
        isDragging ? "opacity-50 shadow-2xl scale-[1.02]" : "opacity-100"
      } ${
        isCompleted ? "bg-[#1c1c1c] text-gray-500" :
        isCanceled ? "bg-[#1a1a1a] text-gray-600 italic" :
        "bg-[#1a1a1a] text-white"
      } ${isAnimatingCompletion ? "animate-pulse scale-[0.98]" : ""}`}
    >
      {/* Main Row */}
      <div className="flex items-start gap-2">
        {/* Drag Handle - Larger touch area */}
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white active:text-blue-400 p-2 -ml-1 -mt-1 rounded-xl active:bg-blue-500/30 flex-shrink-0 touch-none"
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
            className="mt-1 w-5 h-5 flex items-center justify-center text-gray-400 bg-[#3a3a3a] rounded-full cursor-pointer border border-gray-500 flex-shrink-0 active:scale-90"
            title="Canceled - Click to restore"
          >
            <X size={12} />
          </button>
        ) : (
          <div className="relative flex-shrink-0 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleStatusChange(isCompleted ? "ongoing" : "completed")
              }}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                isCheckboxAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
              } ${
                isCompleted 
                  ? "bg-gray-500 border-gray-500" 
                  : "border-gray-500 hover:border-blue-400"
              }`}
            >
              {isCompleted && <Check size={12} className="text-white" />}
            </button>
            {isCheckboxAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check size={12} className="text-blue-500 animate-tick" />
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Title - Inline editable */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              className="w-full bg-[#101010] text-white px-3 py-1.5 rounded-lg outline-none text-sm border-2 border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={`font-medium text-sm ${
                isCanceled ? "line-through" : ""
              } ${
                !isCompleted && !isCanceled 
                  ? "cursor-text hover:bg-gray-800/50 rounded px-1 -mx-1 transition-colors" 
                  : ""
              }`}
              onClick={handleTitleClick}
              title={!isCompleted && !isCanceled ? "Click to edit" : task.title}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.title}
            </div>
          )}

          {/* Meta Row - Tags, Assignees, Date */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {/* Left side: Tags, Assignees, Pin */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              {/* Tags - show 2 on mobile, up to 5 on desktop */}
              {task.tags && task.tags.length > 0 && (
                <>
                  {/* Mobile: show max 2 */}
                  <div className="flex items-center gap-1.5 flex-wrap md:hidden">
                    {task.tags.slice(0, 2).map((tag, idx) =>
                      tag && (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-all duration-200 hover:brightness-110 whitespace-nowrap ${
                            isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "text-white"
                          }`}
                          style={{ backgroundColor: isCompleted || isCanceled ? "#2b2b2b" : getTagColor(tag) }}
                          onClick={handleTagsClick}
                        >
                          {tag}
                        </span>
                      )
                    )}
                    {task.tags.length > 2 && (
                      <span className="text-xs text-gray-400 cursor-pointer" onClick={handleTagsClick}>
                        +{task.tags.length - 2}
                      </span>
                    )}
                  </div>
                  {/* Desktop: show max 5 */}
                  <div className="hidden md:flex items-center gap-1.5 flex-wrap">
                    {task.tags.slice(0, 5).map((tag, idx) =>
                      tag && (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105 whitespace-nowrap ${
                            isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "text-white"
                          }`}
                          style={{ backgroundColor: isCompleted || isCanceled ? "#2b2b2b" : getTagColor(tag) }}
                          onClick={handleTagsClick}
                        >
                          {tag}
                        </span>
                      )
                    )}
                    {task.tags.length > 5 && (
                      <span className="text-xs text-gray-400 cursor-pointer hover:scale-105 transition-transform" onClick={handleTagsClick}>
                        +{task.tags.length - 5}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Assignees - Show full names */}
              {task.assignees?.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {task.assignees.map((assignee, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap transition-transform duration-200 md:hover:scale-105 ${
                        isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
                      }`}
                      onClick={handleAssignClick}
                    >
                      <Users size={10} />
                      {assignee}
                    </span>
                  ))}
                </div>
              )}

              {/* Pin indicator removed - pins shown in section header only */}
            </div>

            {/* Right side: Date/Time - pushed to right on desktop */}
            {(task.dueDate || task.dueTime) && (
              <span
                className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer group relative transition-transform duration-200 md:hover:scale-105 md:ml-auto flex-shrink-0 ${
                  isCompleted || isCanceled 
                    ? "bg-[#2d2d2d] text-gray-500" 
                    : "bg-blue-900/30 text-blue-300 border border-blue-700/50"
                }`}
                onClick={handleCalendarClick}
              >
                <Calendar size={10} />
                <span className="whitespace-nowrap">{formatDateTime()}</span>
                {hasRepeat && <Repeat size={10} className={isCompleted || isCanceled ? 'text-gray-500' : 'text-blue-400'} />}
                
                {/* Tooltip - Desktop only */}
                <div className="hidden md:block absolute bottom-full mb-2 right-0 invisible group-hover:visible z-50 min-w-[180px]">
                  <div className="bg-black text-white text-xs rounded-lg py-2 px-3 whitespace-pre-line shadow-xl border border-gray-600">
                    {getDateTimeTooltip()}
                  </div>
                </div>
              </span>
            )}
          </div>
        </div>

        {/* Three-dot Menu - Larger touch target */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-gray-400 hover:text-blue-400 p-2 -mr-1 rounded-xl hover:bg-gray-800 transition-colors active:scale-90"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-10 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-lg py-1 z-[9999] min-w-[180px] overflow-hidden">
              {/* Date/Time */}
              <button
                onClick={handleCalendarClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Calendar size={16} /> Date & Time
              </button>

              {/* Assign */}
              <button
                onClick={handleAssignClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Users size={16} /> Assign
              </button>

              {/* Tags */}
              <button
                onClick={handleTagsClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Tag size={16} /> Tags
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              {/* Pin/Unpin */}
              <button
                onClick={handlePinToggle}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                {task.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                {task.isPinned ? "Unpin" : "Pin"}
              </button>

              {/* Duplicate */}
              <button
                onClick={handleDuplicate}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Copy size={16} /> Duplicate
              </button>

              {/* Repeat */}
              <button
                onClick={handleRepeat}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Repeat size={16} /> Repeat
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              {/* Status changes */}
              {!isCanceled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(false)
                    handleStatusChange("canceled")
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
                >
                  <X size={16} /> Cancel Task
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdown(false)
                      handleStatusChange("ongoing")
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
                  >
                    <Edit size={16} /> Set Ongoing
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdown(false)
                      handleStatusChange("completed")
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 text-green-400 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
                  >
                    <Check size={16} /> Complete
                  </button>
                </>
              )}

              {/* Delete */}
              <button
                onClick={openDeleteConfirmation}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-3 transition-colors active:bg-gray-700"
              >
                <Trash2 size={16} /> Delete
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
          animation: tick 0.4s ease-out forwards;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 0.4s ease-out;
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
