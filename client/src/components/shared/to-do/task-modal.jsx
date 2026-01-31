/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, Calendar, Tag, Users, Bell, ChevronDown } from "lucide-react"
import CalendarModal from "./calendar-modal"
import AssignModal from "./assign-modal"
import TagsModal from "./edit-tags"

// ============================================
// Unified Task Modal - Handles both Add & Edit
// ============================================
const TaskModal = ({ 
  mode = "add", // "add" or "edit"
  task = null, // For edit mode
  onClose, 
  onSave, // Generic save handler for both add and edit
  configuredTags = [],
  availableAssignees = [] // Pass from parent component
}) => {
  const isEditMode = mode === "edit" && task
  
  const [taskTitle, setTaskTitle] = useState(task?.title || "")
  const [taskData, setTaskData] = useState({
    assignees: task?.assignees || [],
    tags: task?.tags || [],
    dueDate: task?.dueDate || "",
    dueTime: task?.dueTime || "",
    reminder: task?.reminder || "",
    repeat: task?.repeat || "",
  })
  
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showTagsModal, setShowTagsModal] = useState(false)
  
  const titleInputRef = useRef(null)

  // Sync taskData when task prop changes (important for edit mode)
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "")
      setTaskData({
        assignees: task.assignees || [],
        tags: task.tags || [],
        dueDate: task.dueDate || "",
        dueTime: task.dueTime || "",
        reminder: task.reminder || "",
        repeat: task.repeat || "",
      })
    }
  }, [task])

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100)
    }
  }, [])

  // Auto-resize textarea for edit mode
  useEffect(() => {
    if (isEditMode && titleInputRef.current) {
      titleInputRef.current.style.height = "auto"
      titleInputRef.current.style.height = titleInputRef.current.scrollHeight + "px"
    }
  }, [taskTitle, isEditMode])

  const handleSave = () => {
    if (!taskTitle.trim()) return

    if (isEditMode) {
      // Edit mode - update existing task
      const updatedTask = {
        ...task,
        title: taskTitle.trim(),
        assignees: taskData.assignees,
        tags: taskData.tags,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        reminder: taskData.reminder,
        repeat: taskData.repeat,
        updatedAt: new Date().toISOString(),
      }
      onSave(updatedTask)
    } else {
      // Add mode - create new task
      const newTask = {
        id: Date.now(),
        title: taskTitle.trim(),
        assignees: taskData.assignees,
        roles: [],
        tags: taskData.tags,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        status: "ongoing",
        category: "general",
        isPinned: false,
        reminder: taskData.reminder,
        repeat: taskData.repeat,
        createdAt: new Date().toISOString(),
      }
      onSave(newTask)
    }
    
    onClose()
  }

  const formatDateTime = () => {
    if (!taskData.dueDate) return "No due date"
    const date = new Date(taskData.dueDate)
    let display = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    if (taskData.dueTime) {
      const [hours, minutes] = taskData.dueTime.split(":")
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 || 12
      display += ` at ${formattedHour}:${minutes} ${ampm}`
    }
    return display
  }

  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#3F74FF"
  }

  // Handle CalendarModal save
  const handleCalendarSave = (calendarData) => {
    setTaskData(prev => ({
      ...prev,
      dueDate: calendarData.date,
      dueTime: calendarData.time,
      reminder: calendarData.reminder,
      repeat: calendarData.repeat,
    }))
  }

  // Handle AssignModal update
  const handleAssignUpdate = (updatedTask) => {
    setTaskData(prev => ({
      ...prev,
      assignees: updatedTask.assignees || [],
    }))
    setShowAssignModal(false)
  }

  // Handle TagsModal update
  const handleTagsUpdate = (updatedTask) => {
    setTaskData(prev => ({
      ...prev,
      tags: updatedTask.tags || [],
    }))
    setShowTagsModal(false)
  }

  const isCompleted = task?.status === "completed"
  const isCanceled = task?.status === "canceled"
  const isDisabled = isEditMode && (isCompleted || isCanceled)

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#181818] rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">
              {isEditMode ? "Edit Task" : "New Task"}
            </h2>
            <div className="flex items-center gap-2">
              {/* Status Badge (only in edit mode) */}
              {isEditMode && task?.status && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  isCompleted ? "bg-green-500/20 text-green-400" :
                  isCanceled ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Task Title */}
            <div className="p-4 border-b border-gray-700">
              <textarea
                ref={titleInputRef}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder={isEditMode ? "Task title..." : "What needs to be done?"}
                className={`w-full bg-transparent text-lg font-medium outline-none resize-none min-h-[60px] ${
                  isCompleted ? "text-gray-500" :
                  isCanceled ? "text-gray-600 line-through italic" :
                  "text-white placeholder-gray-500"
                }`}
                rows={isEditMode ? 1 : 2}
                style={isEditMode ? { height: "auto", overflow: "hidden" } : {}}
                onInput={isEditMode ? (e) => {
                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
                } : undefined}
                disabled={isDisabled}
              />
              {isEditMode && task?.createdAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(task.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>

            {/* Date & Time Section */}
            <button
              onClick={() => !isDisabled && setShowCalendarModal(true)}
              className={`w-full p-4 border-b border-gray-700 flex items-center justify-between transition-colors ${
                !isDisabled ? "hover:bg-[#1F1F1F]" : "opacity-60"
              }`}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-300">Due Date & Time</p>
                  <p className={`text-sm ${taskData.dueDate ? "text-white" : "text-gray-500"}`}>
                    {formatDateTime()}
                  </p>
                </div>
              </div>
              {!isDisabled && <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {/* Reminder Section (shown if set) */}
            {taskData.reminder && taskData.reminder !== "" && taskData.reminder !== "None" && (
              <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Bell size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Reminder</p>
                  <p className="text-sm text-white">{taskData.reminder}</p>
                </div>
              </div>
            )}

            {/* Assignees Section */}
            <button
              onClick={() => !isDisabled && setShowAssignModal(true)}
              className={`w-full p-4 border-b border-gray-700 text-left transition-colors ${
                !isDisabled ? "hover:bg-[#1F1F1F]" : "opacity-60"
              }`}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Users size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Assigned To</p>
                  {taskData.assignees.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {taskData.assignees.map((assignee, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#2F2F2F] text-gray-300 rounded-lg text-xs"
                        >
                          {assignee}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No one assigned</p>
                  )}
                </div>
                {!isDisabled && (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>

            {/* Tags Section */}
            <button
              onClick={() => !isDisabled && setShowTagsModal(true)}
              className={`w-full p-4 border-b border-gray-700 text-left transition-colors ${
                !isDisabled ? "hover:bg-[#1F1F1F]" : "opacity-60"
              }`}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#2F2F2F]">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Tags</p>
                  {taskData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {taskData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs text-white"
                          style={{ backgroundColor: getTagColor(tag) }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tags</p>
                  )}
                </div>
                {!isDisabled && (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2F2F2F] text-sm text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!taskTitle.trim()}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                taskTitle.trim()
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isEditMode ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onSave={handleCalendarSave}
        initialDate={taskData.dueDate}
        initialTime={taskData.dueTime}
        initialReminder={taskData.reminder}
        initialRepeat={taskData.repeat}
      />

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignModal
          task={{ 
            id: task?.id || 'new-task', 
            title: taskTitle || (isEditMode ? 'Task' : 'New Task'), 
            assignees: taskData.assignees 
          }}
          availableAssignees={availableAssignees}
          onClose={() => setShowAssignModal(false)}
          onUpdate={handleAssignUpdate}
        />
      )}

      {/* Tags Modal */}
      {showTagsModal && (
        <TagsModal
          task={{ 
            id: task?.id || 'new-task', 
            title: taskTitle || (isEditMode ? 'Task' : 'New Task'), 
            tags: taskData.tags 
          }}
          configuredTags={configuredTags}
          onClose={() => setShowTagsModal(false)}
          onUpdate={handleTagsUpdate}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </>
  )
}

export default TaskModal
