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
}) {
  const [isAnimatingCompletion, setIsAnimatingCompletion] = useState(false)
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [assignmentMode, setAssignmentMode] = useState("staff")
  const [isEditing, setIsEditing] = useState(false) // NEW: Track overall editing state
  const dropdownRef = useRef(null)
  const tagMenuRef = useRef(null)
  const assigneeMenuRef = useRef(null)
  const calendarRef = useRef(null)
  const titleInputRef = useRef(null)
  const isDropdownOpen = openDropdownTaskId === task.id

  // Update editedTitle when task.title changes
  useEffect(() => {
    setEditedTitle(task.title)
  }, [task.title])

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
    setIsEditingTitle(true)
    setIsEditing(true) // NEW: Set editing state
    setEditedTitle(task.title)
    setOpenDropdownTaskId(null)
    // Close all other menus
    setShowTagMenu(false)
    setShowAssigneeMenu(false)
    setShowCalendar(false)
    
    // Focus the input after state update
    setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 0)
  }

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate(task.id, { ...task, title: editedTitle.trim() })
    } else {
      // Revert to original title if no changes or empty
      setEditedTitle(task.title)
    }
    setIsEditingTitle(false)
    setIsEditing(false) // NEW: Reset editing state
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTitleSubmit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      setEditedTitle(task.title)
      setIsEditingTitle(false)
      setIsEditing(false) // NEW: Reset editing state
    }
  }

  const handleTitleClick = (e) => {
    // Only allow title click to edit if not already editing and not dragging
    if (!isEditingTitle && !isDragging) {
      e.stopPropagation()
      e.preventDefault()
      handleEditTask(e)
    }
  }

  // NEW: Unified click handler for all editable elements
  const handleEditableElementClick = (e, elementType) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (isDragging) return;
    
    switch(elementType) {
      case 'title':
        if (!isEditingTitle) {
          handleEditTask(e);
        }
        break;
      case 'assignee':
        setShowAssigneeMenu(true);
        setShowTagMenu(false);
        setShowCalendar(false);
        setOpenDropdownTaskId(null);
        break;
      case 'date':
        setShowCalendar(true);
        setShowTagMenu(false);
        setShowAssigneeMenu(false);
        setOpenDropdownTaskId(null);
        break;
      case 'tag':
        setShowTagMenu(true);
        setShowAssigneeMenu(false);
        setShowCalendar(false);
        setOpenDropdownTaskId(null);
        break;
      default:
        break;
    }
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
      updatedTags = currentTags.filter(tag => tag !== tagName)
    } else {
      updatedTags = [...currentTags, tagName]
    }
    onUpdate(task.id, { ...task, tags: updatedTags })
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = (task.tags || []).filter(tag => tag !== tagToRemove)
    onUpdate(task.id, { ...task, tags: updatedTags })
  }

  // Assignment management functions
  const toggleAssignee = (assignee) => {
    const currentAssignees = task.assignees || []
    const assigneeName = `${assignee.firstName} ${assignee.lastName}`
    let updatedAssignees
    if (currentAssignees.includes(assigneeName)) {
      updatedAssignees = currentAssignees.filter(a => a !== assigneeName)
    } else {
      updatedAssignees = [...currentAssignees, assigneeName]
    }
    onUpdate(task.id, { ...task, assignees: updatedAssignees })
  }

  const toggleRole = (role) => {
    const currentRoles = task.roles || []
    let updatedRoles
    if (currentRoles.includes(role)) {
      updatedRoles = currentRoles.filter(r => r !== role)
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
      // Handle clicking outside of title input
      if (isEditingTitle && titleInputRef.current && !titleInputRef.current.contains(event.target)) {
        handleTitleSubmit()
      }
    }
    if (isDropdownOpen || showTagMenu || showAssigneeMenu || showCalendar || isEditingTitle) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isDropdownOpen, showTagMenu, showAssigneeMenu, showCalendar, isEditingTitle, setOpenDropdownTaskId])

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
      {/* NEW: Editing indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-[#FF843E] text-white text-xs px-2 py-1 rounded-md z-10">
          You are editing this task
        </div>
      )}
      
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
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleTitleKeyDown}
                  className="font-medium text-sm break-words whitespace-normal bg-transparent border-b border-gray-500 focus:border-[#FF843E] outline-none w-full text-white placeholder-gray-400"
                  placeholder="Enter task title..."
                  autoFocus
                />
              ) : (
                <h3 
                  className={`font-medium text-sm break-words whitespace-normal cursor-pointer hover:text-gray-300 transition-colors ${
                    !isDragging ? 'hover:bg-gray-800 hover:bg-opacity-30 rounded px-1 py-0.5 -mx-1 -my-0.5' : ''
                  }`}
                  onClick={(e) => handleEditableElementClick(e, 'title')}
                  title="Click to edit"
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
              )}
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
                <button
                  onClick={(e) => handleEditableElementClick(e, 'assignee')}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Users size={14} /> Assign to
                </button>
                <button
                  onClick={(e) => handleEditableElementClick(e, 'tag')}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  <Tag size={14} /> Tags
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
                      onClick={(e) => handleEditableElementClick(e, 'tag')}
                      className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer hover:opacity-80 ${
                        isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "bg-[#2F2F2F]"
                      }`}
                      style={{
                        color: isCompleted || isCanceled ? "#9CA3AF" : getTagColor(tag),
                        backgroundColor: isCompleted || isCanceled ? "#2b2b2b" : `${getTagColor(tag)}20`,
                      }}
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
                onClick={(e) => handleEditableElementClick(e, 'assignee')}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:opacity-80 ${
                  isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
                }`}
              >
                <Users size={12} />
                <span className="truncate max-w-[120px]">{task.assignees?.join(", ") || task.roles?.join(", ")}</span>
              </div>
            </div>
          )}
          <div className="relative">
            <div
              onClick={(e) => handleEditableElementClick(e, 'date')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:opacity-80 ${
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

      {/* Tag Management Menu */}
      {showTagMenu && (
        <div
          ref={tagMenuRef}
          className="absolute top-full left-4 mt-2 w-64 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-[10000] p-4 max-h-80 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-white text-sm font-medium mb-3">Manage Tags</h4>
          
          {/* Current Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-4">
              <h5 className="text-gray-400 text-xs mb-2">Current Tags:</h5>
              <div className="space-y-1">
                {task.tags.map((tagName, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTagColor(tagName) }}></div>
                      <span className="text-white text-sm">{tagName}</span>
                    </div>
                    <button
                      onClick={() => removeTag(tagName)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Tags */}
          <div>
            <h5 className="text-gray-400 text-xs mb-2">Available Tags:</h5>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {configuredTags.map((tag) => {
                const isSelected = task.tags && task.tags.includes(tag.name)
                return (
                  <button
                    key={tag.id}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded"
                    onClick={() => toggleTag(tag.name)}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                    <span className="flex-1">{tag.name}</span>
                    {isSelected && <Check size={14} className="text-green-400" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Management Menu */}
      {showAssigneeMenu && (
        <div
          ref={assigneeMenuRef}
          className="absolute top-full left-4 mt-2 w-64 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-[10000] p-4 max-h-80 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-white text-sm font-medium mb-3">Manage Assignments</h4>
          
          {/* Current Assignments */}
          {((task.assignees && task.assignees.length > 0) || (task.roles && task.roles.length > 0)) && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-400 text-xs">Current Assignments:</h5>
                <button
                  onClick={removeAssignment}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Remove All
                </button>
              </div>
              <div className="space-y-1">
                {task.assignees?.map((assignee, index) => (
                  <div key={index} className="bg-[#1a1a1a] px-3 py-2 rounded-lg text-white text-sm">
                    Staff: {assignee}
                  </div>
                ))}
                {task.roles?.map((role, index) => (
                  <div key={index} className="bg-[#1a1a1a] px-3 py-2 rounded-lg text-white text-sm">
                    Role: {role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignment Mode Toggle */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setAssignmentMode("staff")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                assignmentMode === "staff"
                  ? "bg-[#FF843E] text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              to Staff
            </button>
            <button
              onClick={() => setAssignmentMode("roles")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                assignmentMode === "roles"
                  ? "bg-[#FF843E] text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              to Roles
            </button>
          </div>

          {/* Staff Assignment */}
          {assignmentMode === "staff" && (
            <div>
              <h5 className="text-gray-400 text-xs mb-2">Assign to Staff:</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {availableAssignees.map((assignee) => {
                  const assigneeName = `${assignee.firstName} ${assignee.lastName}`
                  const isSelected = task.assignees && task.assignees.includes(assigneeName)
                  return (
                    <button
                      key={assignee.id}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded"
                      onClick={() => toggleAssignee(assignee)}
                    >
                      <Users size={14} />
                      <span className="flex-1">{assigneeName}</span>
                      {isSelected && <Check size={14} className="text-green-400" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Role Assignment */}
          {assignmentMode === "roles" && (
            <div>
              <h5 className="text-gray-400 text-xs mb-2">Assign to Roles:</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {availableRoles.map((role) => {
                  const isSelected = task.roles && task.roles.includes(role)
                  return (
                    <button
                      key={role}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded"
                      onClick={() => toggleRole(role)}
                    >
                      <Users size={14} />
                      <span className="flex-1">{role}</span>
                      {isSelected && <Check size={14} className="text-green-400" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar Menu */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-full left-4 mt-2 w-64 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-[10000] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-white text-sm font-medium mb-3">Select Date & Time</h4>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-gray-600 text-sm"
              defaultValue={task.dueDate}
              onChange={(e) => handleDateTimeUpdate(e.target.value, task.dueTime)}
            />
            <input
              type="time"
              className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-gray-600 text-sm"
              defaultValue={task.dueTime}
              onChange={(e) => handleDateTimeUpdate(task.dueDate, e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCalendar(false)}
                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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