"use client"

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
  openDropdownTaskId,
  setOpenDropdownTaskId,
  configuredTags,
  availableAssignees = [],
  availableRoles = [],
  onOpenAssignModal,
  onOpenTagsModal,
}) {
  const [isAnimatingCompletion, setIsAnimatingCompletion] = useState(false)
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [assignmentMode, setAssignmentMode] = useState("staff")
  const dropdownRef = useRef(null)
  const tagMenuRef = useRef(null)
  const assigneeMenuRef = useRef(null)
  const calendarRef = useRef(null)
  const isDropdownOpen = openDropdownTaskId === task.id

  const toggleDropdown = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenDropdownTaskId(isDropdownOpen ? null : task.id)
  }

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
    setOpenDropdownTaskId(null)
  }

  const handleEditTask = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onEditRequest(task)
    setOpenDropdownTaskId(null)
    // Close all other menus
    setShowTagMenu(false)
    setShowAssigneeMenu(false)
    setShowCalendar(false)
  }

  const openDeleteConfirmation = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onDeleteRequest(task.id)
    setOpenDropdownTaskId(null)
  }

  const handlePinToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onPinToggle(task.id)
    setOpenDropdownTaskId(null)
  }

  const handleDuplicate = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onDuplicateRequest(task)
    setOpenDropdownTaskId(null)
  }

  const handleRepeat = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onRepeatRequest(task)
    setOpenDropdownTaskId(null)
  }

  // Tag management functions
  const toggleTag = (tagName) => {
    const currentTags = task.tags || []
    let updatedTags
    if (currentTags.includes(tagName)) {
      updatedTags = currentTags.filter((tag) => tag !== tagName)
    } else {
      updatedTags = [...currentTags, tagName]
    }
    onUpdate(task.id, { ...task, tags: updatedTags })
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = (task.tags || []).filter((tag) => tag !== tagToRemove)
    onUpdate(task.id, { ...task, tags: updatedTags })
  }

  // Assignment management functions
  const toggleAssignee = (assignee) => {
    const currentAssignees = task.assignees || []
    const assigneeName = `${assignee.firstName} ${assignee.lastName}`
    let updatedAssignees
    if (currentAssignees.includes(assigneeName)) {
      updatedAssignees = currentAssignees.filter((a) => a !== assigneeName)
    } else {
      updatedAssignees = [...currentAssignees, assigneeName]
    }
    onUpdate(task.id, { ...task, assignees: updatedAssignees })
  }

  const toggleRole = (role) => {
    const currentRoles = task.roles || []
    let updatedRoles
    if (currentRoles.includes(role)) {
      updatedRoles = currentRoles.filter((r) => r !== role)
    } else {
      updatedRoles = [...currentRoles, role]
    }
    onUpdate(task.id, { ...task, roles: updatedRoles })
  }

  const removeAssignment = () => {
    onUpdate(task.id, { ...task, assignees: [], roles: [] })
  }

  // Date/time management functions
  const handleDateTimeUpdate = (newDate, newTime) => {
    onUpdate(task.id, { ...task, dueDate: newDate, dueTime: newTime })
    setShowCalendar(false)
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
    e.preventDefault()
    if (onOpenAssignModal) {
      onOpenAssignModal(task)
    }
    setOpenDropdownTaskId(null)
  }

  const handleTagsClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (onOpenTagsModal) {
      onOpenTagsModal(task)
    }
    setOpenDropdownTaskId(null)
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"
  const hasRepeat = task.repeatSettings && task.repeatSettings.frequency

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownTaskId(null)
      }
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) {
        setShowTagMenu(false)
      }
      if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target)) {
        setShowAssigneeMenu(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }
    if (isDropdownOpen || showTagMenu || showAssigneeMenu || showCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isDropdownOpen, showTagMenu, showAssigneeMenu, showCalendar, setOpenDropdownTaskId])

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 ease-in-out relative ${
        isDragging ? "opacity-90 z-[9999] shadow-2xl" : "opacity-100"
      } ${
        isCompleted
          ? "bg-[#1c1c1c] text-gray-500"
          : isCanceled
            ? "bg-[#1a1a1a] text-gray-600 italic line-through"
            : "bg-[#161616] text-white"
      } ${isAnimatingCompletion ? "animate-pulse scale-[0.98]" : ""}`}
      style={{
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? 9999 : "auto",
        pointerEvents: isDragging ? "none" : "auto",
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Top: checkbox/cancel + title + dropdown */}
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
                  className={`form-checkbox h-4 w-4 cursor-pointer text-[#FF843E] rounded-full border-gray-300 focus:ring-[#FF843E] no-drag transition-all duration-200 ${
                    isCheckboxAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
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
            <div className="flex-grow">
              <h3
                className={`font-medium text-sm break-words whitespace-normal ${
                  isCompleted || isCanceled ? "" : "cursor-pointer hover:text-gray-300 transition-colors"
                } ${
                  !isDragging && !isCompleted && !isCanceled
                    ? "hover:bg-gray-800 hover:bg-opacity-30 rounded px-1 py-0.5 -mx-1 -my-0.5"
                    : ""
                }`}
                onClick={!isCompleted && !isCanceled ? handleEditTask : undefined}
                title={!isCompleted && !isCanceled ? "Click to edit task" : ""}
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
          <div className="relative flex items-center gap-1" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="hover:text-white p-1 no-drag relative z-[100000]">
              <MoreHorizontal size={18} className="cursor-pointer" />
            </button>
            {isDropdownOpen && !isDragging && (
              <div
                className="absolute right-5 bottom-1 w-48 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 no-drag z-[100000]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEditTask}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left rounded-t-xl flex items-center gap-2"
                >
                  <Edit size={14} />
                  Edit Task
                </button>

                {/* New Assign To option */}
                <button
                  onClick={handleAssignClick}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Users size={14} />
                  Assign To
                </button>

                {/* New Tags option */}
                <button
                  onClick={handleTagsClick}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Tag size={14} />
                  Tags
                </button>

                <button
                  onClick={handlePinToggle}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  {task.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                  {task.isPinned ? "Unpin Task" : "Pin Task"}
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Copy size={14} /> Duplicate Task
                </button>
                <button
                  onClick={handleRepeat}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Repeat size={14} /> Repeat Task
                </button>
                {!isCanceled && (
                  <button
                    onClick={() => handleStatusChange("canceled")}
                    className="w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-700 text-left"
                  >
                    Cancel Task
                  </button>
                )}
                {isCanceled && (
                  <>
                    <button
                      onClick={() => handleStatusChange("ongoing")}
                      className="w-full px-4 py-2 text-xs text-yellow-500 hover:bg-gray-700 text-left"
                    >
                      Move to Ongoing
                    </button>
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="w-full px-4 py-2 text-xs text-green-500 hover:bg-gray-700 text-left"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
                <button
                  onClick={openDeleteConfirmation}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-700 text-left rounded-b-xl"
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
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
                      className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer ${
                        isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "text-white"
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
        <div className="flex flex-col items-center justify-center gap-2 mt-2 lg:flex-row lg:justify-center">
          {(task.assignees?.length > 0 || task.roles?.length > 0) && (
            <div className="relative">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer ${
                  isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
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
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
                isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
              }`}
            >
              <Calendar size={12} />
              <span className="whitespace-nowrap">{formatDateTime()}</span>
              {hasRepeat && <Repeat size={10} className="text-blue-400 ml-1" title="Repeating task" />}
            </div>
          </div>
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
      `}</style>
    </div>
  )
}
