/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { Tag, Calendar, X, Pin, PinOff, MoreHorizontal, Copy, Repeat, Edit, Check, Users } from "lucide-react"

export default function TaskItem({
  task,
  onStatusChange,
  onUpdate,
  onRemove,
  onPinToggle,
  onEditRequest,
  onDeleteRequest,
  onDuplicateRequest,
  onRepeatRequest,
  isDragging,
  configuredTags,
  availableAssignees = [],
  availableRoles = [],
  onOpenAssignModal,
  onOpenTagsModal,
  onOpenCalendarModal,
  repeatConfigs = {} // Add this line
}) {
  const [isAnimatingCompletion, setIsAnimatingCompletion] = useState(false)
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [assignmentMode, setAssignmentMode] = useState("staff")

  const tagMenuRef = useRef(null)
  const assigneeMenuRef = useRef(null)
  const calendarRef = useRef(null)
  const editButtonsRef = useRef(null)

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

  const handleEditTask = (e) => {
    e.stopPropagation()
    onEditRequest(task)
    // Don't close edit mode - let user manually close it
    setShowTagMenu(false)
    setShowAssigneeMenu(false)
    setShowCalendar(false)
  }

  const openDeleteConfirmation = (e) => {
    e.stopPropagation()
    onDeleteRequest(task.id)
    // Don't close edit mode - let user manually close it
  }

  const handlePinToggle = (e) => {
    e.stopPropagation()
    onPinToggle(task.id)
    // Don't close edit mode - let user manually close it
  }

  const handleDuplicate = (e) => {
    e.stopPropagation()
    onDuplicateRequest(task)
    // Don't close edit mode - let user manually close it
  }

  const handleRepeat = (e) => {
    e.stopPropagation()
    onRepeatRequest(task)
    // Don't close edit mode - let user manually close it
  }

  const toggleEditMode = (e) => {
    e.stopPropagation()
    setIsEditMode(!isEditMode)
  }


  const formatDateTime = () => {
    let display = ""
    if (task.dueDate) {
      display += task.dueDate
    }
    if (task.dueTime) {
      display += task.dueDate ? ` @ ${task.dueTime}` : task.dueTime
    }
    return display || "No due date"
  }

  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#FFFFFF"
  }

  const handleAssignClick = (e) => {
    e.stopPropagation()
    if (onOpenAssignModal) {
      onOpenAssignModal(task)
    }
    // Don't close edit mode - let user manually close it
  }

  const handleTagsClick = (e) => {
    e.stopPropagation()
    if (onOpenTagsModal) {
      onOpenTagsModal(task)
    }
    // Don't close edit mode - let user manually close it
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"
  const hasRepeat = (task.repeatSettings && task.repeatSettings.frequency) || repeatConfigs[task.id]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) {
        setShowTagMenu(false)
      }
      if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target)) {
        setShowAssigneeMenu(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
      // Only close edit mode if clicking outside the entire task item
      if (editButtonsRef.current &&
        !editButtonsRef.current.contains(event.target) &&
        !event.target.closest('.edit-mode-toggle')) {
        setIsEditMode(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 ease-in-out relative ${isDragging ? "opacity-90 z-[9999] shadow-2xl" : "opacity-100"
        } ${isCompleted
          ? "bg-[#1c1c1c] text-gray-500"
          : isCanceled
            ? "bg-[#1a1a1a] text-gray-600 italic line-through"
            : "bg-[#1a1a1a] text-white"
        } ${isAnimatingCompletion ? "animate-pulse scale-[0.98]" : ""}`}
      style={{
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? 9999 : "auto",
        pointerEvents: isDragging ? "none" : "auto",  
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Top: checkbox/cancel + title + edit icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {isCanceled ? (
              <button
                onClick={() => handleStatusChange("ongoing")}
                className="mt-1 h-4 w-4 flex items-center justify-center text-gray-400 bg-[#3a3a3a] rounded-sm cursor-pointer no-drag border border-gray-500"
                title="Canceled"
              >
                <X size={14} />
              </button>
            ) : (
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleStatusChange(isCompleted ? "ongoing" : "completed")}
                  className={`form-checkbox h-4 w-4 cursor-pointer text-[#FF843E] rounded-full border-gray-300 focus:ring-[#FF843E] no-drag transition-all duration-200 ${isCheckboxAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
                    }`}
                />
                {isCheckboxAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={14}
                      className="text-[#FF843E] animate-tick"
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
            <div className="flex-grow min-w-0">
              <h3
                className={`font-medium text-sm break-words whitespace-normal word-wrap-break-word no-drag ${isCompleted || isCanceled ? "" : "cursor-pointer hover:text-gray-300 transition-colors"
                  } ${!isDragging && !isCompleted && !isCanceled
                    ? "hover:bg-gray-800 hover:bg-opacity-30 rounded px-1 py-0.5 -mx-1 -my-0.5"
                    : ""
                  }`}
                onClick={!isCompleted && !isCanceled ? handleEditTask : undefined}
                title={!isCompleted && !isCanceled ? "Click to edit task" : ""}
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {task.title}
                {task.isPinned && (
                  <Pin
                    size={14}
                    className="inline-block ml-2 text-gray-500 fill-gray-500"
                    aria-label="Task is pinned"
                  />
                )}
              </h3>
            </div>
          </div>

          {/* Edit/Close button */}
          {!isDragging && (
            <button
              onClick={toggleEditMode}
              className="p-1 no-drag text-gray-400 hover:text-white transition-colors edit-mode-toggle"
            >
              {isEditMode ? <X size={18} /> : <Edit size={18} />}
            </button>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="relative ml-7">
            <div className="flex flex-wrap gap-1.5">
              {task.tags?.map(
                (tag, index) =>
                  tag && (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer no-drag ${isCompleted || isCanceled
                          ? "bg-[#2b2b2b] text-gray-500"
                          : "text-white"
                        }`}
                      style={{
                        backgroundColor: isCompleted || isCanceled ? "#2b2b2b" : getTagColor(tag),
                      }}
                      onClick={handleTagsClick}
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ),
              )}
            </div>
          </div>
        )}

        {/* Assignees and Date */}
        <div className="flex flex-col items-center flex-wrap justify-center gap-2 mt-2 lg:flex-row lg:justify-center">
          {(task.assignees?.length > 0 || task.roles?.length > 0) && (
            <div className="relative">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer no-drag ${isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
                  }`}
                onClick={handleAssignClick}
              >
                <Users size={12} />
                <span className="truncate max-w-[120px]">{task.assignees?.join(", ") || task.roles?.join(", ")}</span>
              </div>
            </div>
          )}

<div className="relative">
  <div
    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 no-drag cursor-pointer ${isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300 hover:bg-gray-700"
      }`}
    onClick={(e) => {
      e.stopPropagation();
      if (!isCompleted && !isCanceled) {
        // This will open the modal for editing task date/time
        onOpenCalendarModal?.(task.id, task.dueDate, task.dueTime, task.reminder, task.repeat);
      }
    }}
    title={!isCompleted && !isCanceled ? "Click to edit date/time" : ""}
  >
    <Calendar size={12} />
    <span className="whitespace-nowrap">{formatDateTime()}</span>
    {(hasRepeat || (task.repeatConfig && task.repeatConfig.repeatOptions)) && (
      <Repeat size={20} className="text-blue-400 ml-1" title="Repeating task" />
    )}
  </div>
 
</div>
        </div>

        {/* Edit buttons panel - shown when in edit mode */}
        {isEditMode && !isDragging && (
          <div
            ref={editButtonsRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-3 mt-2 border-t border-gray-700 no-drag"
          >
            <button
              onClick={handleEditTask}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              <Edit size={12} /> Edit
            </button>

            <button
              onClick={handleAssignClick}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              <Users size={12} /> Assign
            </button>

            <button
              onClick={handleTagsClick}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              <Tag size={12} /> Tags
            </button>

            <button
              onClick={handlePinToggle}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              {task.isPinned ? <PinOff size={12} /> : <Pin size={12} />}
              {task.isPinned ? "Unpin" : "Pin"}
            </button>

            <button
              onClick={handleDuplicate}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              <Copy size={12} /> Duplicate
            </button>

            <button
              onClick={handleRepeat}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-gray-300 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 no-drag"
            >
              <Repeat size={12} /> Repeat
            </button>

            {!isCanceled ? (
              <button
                onClick={() => handleStatusChange("canceled")}
                className="px-3 py-2 text-xs bg-[#2F2F2F] text-red-500 hover:bg-gray-700 rounded-lg no-drag"
              >
                Cancel
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleStatusChange("ongoing")}
                  className="px-3 py-2 text-xs bg-[#2F2F2F] text-yellow-500 hover:bg-gray-700 rounded-lg no-drag"
                >
                  Ongoing
                </button>
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="px-3 py-2 text-xs bg-[#2F2F2F] text-green-500 hover:bg-gray-700 rounded-lg no-drag"
                >
                  Complete
                </button>
              </>
            )}

            <button
              onClick={openDeleteConfirmation}
              className="px-3 py-2 text-xs bg-[#2F2F2F] text-red-500 hover:bg-gray-700 rounded-lg no-drag"
            >
              Delete
            </button>
          </div>
        )}
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
      `}</style>
    </div>
  )
}