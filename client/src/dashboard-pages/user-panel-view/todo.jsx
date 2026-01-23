/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Plus, X, Calendar, Tag, Repeat, Check, ChevronDown, Clock, Bell, Users, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, Pin, PinOff, Copy, Trash2, Edit, GripVertical } from "lucide-react"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
// toast removed
import RepeatTaskModal from "../../components/user-panel-components/todo-components/repeat-task-modal"
import AssignModal from "../../components/user-panel-components/todo-components/assign-modal"
import TagsModal from "../../components/user-panel-components/todo-components/edit-tags"
import CalendarModal from "../../components/user-panel-components/todo-components/calendar-modal"
import { UserCheck } from "lucide-react"
import { todosTaskData, configuredTagsData, availableAssigneesData } from "../../utils/user-panel-states/todo-states"
import DeleteModal from "../../components/user-panel-components/todo-components/delete-task"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Sidebar from "../../components/central-sidebar"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import { OptimizedTextarea } from "../../components/user-panel-components/todo-components/optimized-text-area"
import TagManagerModal from "../../components/shared/TagManagerModal"

// @dnd-kit imports
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

// New sortable components
import SortableTaskColumn from "../../components/user-panel-components/todo-components/sortable-task-column"
import SortableTaskCard from "../../components/user-panel-components/todo-components/sortable-task-card"

// ============================================
// Mobile Create Task Modal Component (Redesigned)
// ============================================
const MobileCreateTaskModal = ({
  isOpen,
  onClose,
  onCreateTask,
  configuredTags,
  availableAssignees,
  onOpenCalendarModal,
  onOpenAssignModal,
  onOpenTagsModal,
  newTaskData,
  setNewTaskData,
}) => {
  const [taskTitle, setTaskTitle] = useState("")
  const titleInputRef = useRef(null)

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTaskTitle("")
    }
  }, [isOpen])

  // Sync title with newTaskData
  useEffect(() => {
    if (isOpen) {
      setTaskTitle(newTaskData.title || "")
    }
  }, [isOpen, newTaskData.title])

  const handleCreate = () => {
    if (!taskTitle.trim()) {
      return
    }

    onCreateTask({
      ...newTaskData,
      title: taskTitle.trim(),
    })

    onClose()
  }

  const getTagColor = (tagName) => {
    const tag = configuredTags.find(t => t.name === tagName)
    return tag ? tag.color : "#3F74FF"
  }

  const formatDateTime = () => {
    let display = ""
    if (newTaskData.dueDate) {
      const date = new Date(newTaskData.dueDate)
      display = date.toLocaleDateString("en-US", { 
        weekday: 'short',
        month: "short", 
        day: "numeric",
        year: 'numeric'
      })
    }
    if (newTaskData.dueTime) {
      const [hours, minutes] = newTaskData.dueTime.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      display += display ? ` at ${formattedHour}:${minutes} ${ampm}` : `${formattedHour}:${minutes} ${ampm}`
    }
    return display || "No due date"
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[70] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0 safe-area-top">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-xl transition-colors active:scale-95"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold text-white">New Task</h2>
        <button
          onClick={handleCreate}
          disabled={!taskTitle.trim()}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
            taskTitle.trim()
              ? "bg-orange-500 text-white active:scale-95"
              : "bg-gray-700 text-gray-500"
          }`}
        >
          Create
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Task Title */}
        <div className="p-4 border-b border-gray-800">
          <textarea
            ref={titleInputRef}
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value)
              setNewTaskData(prev => ({ ...prev, title: e.target.value }))
            }}
            placeholder="What needs to be done?"
            className="w-full bg-transparent text-xl font-semibold text-white placeholder-gray-500 outline-none resize-none min-h-[80px]"
            rows={3}
          />
        </div>

        {/* Date & Time Section - Clickable (opens CalendarModal) */}
        <button
          onClick={() => onOpenCalendarModal()}
          className="w-full p-4 border-b border-gray-800 flex items-center justify-between active:bg-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-300">Due Date & Time</p>
              <p className={`text-sm ${newTaskData.dueDate ? 'text-white' : 'text-gray-500'}`}>
                {formatDateTime()}
              </p>
            </div>
          </div>
          <ChevronDown size={18} className="text-gray-400" />
        </button>

        {/* Reminder Section (shown if set) */}
        {newTaskData.reminder && newTaskData.reminder !== "" && (
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Bell size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Reminder</p>
              <p className="text-sm text-white">{newTaskData.reminder}</p>
            </div>
          </div>
        )}

        {/* Assignees Section - Clickable (opens AssignModal) */}
        <button
          onClick={() => onOpenAssignModal()}
          className="w-full p-4 border-b border-gray-800 text-left active:bg-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Users size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">Assigned To</p>
              {newTaskData.assignees && newTaskData.assignees.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTaskData.assignees.map((assignee, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-lg text-sm"
                    >
                      {assignee}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No one assigned</p>
              )}
            </div>
            <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
          </div>
        </button>

        {/* Tags Section - Clickable (opens TagsModal) */}
        <button
          onClick={() => onOpenTagsModal()}
          className="w-full p-4 border-b border-gray-800 text-left active:bg-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Tag size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">Tags</p>
              {newTaskData.tags && newTaskData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTaskData.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-sm text-white"
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
            <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
          </div>
        </button>
      </div>
    </div>
  )
}

// ============================================
// Mobile Task Detail Component
// ============================================
const MobileTaskDetail = ({ 
  task, 
  onClose, 
  onStatusChange, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onPinToggle,
  onRepeat,
  configuredTags,
  availableAssignees,
  onOpenCalendarModal,
  onOpenAssignModal,
  onOpenTagsModal,
  repeatConfigs
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title || "")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const actionsMenuRef = useRef(null)
  const titleTextareaRef = useRef(null)

  useEffect(() => {
    setEditedTitle(task.title || "")
  }, [task])

  // Auto-resize textarea on mount and when editedTitle changes
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto'
      titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px'
    }
  }, [editedTitle])

  // Close actions menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle.trim() !== task.title) {
      onUpdate({ ...task, title: editedTitle.trim() })
      setHasUnsavedChanges(false)
    }
  }

  const formatDateTime = () => {
    let display = ""
    if (task.dueDate) {
      const date = new Date(task.dueDate)
      display = date.toLocaleDateString("en-US", { 
        weekday: 'short',
        month: "short", 
        day: "numeric",
        year: 'numeric'
      })
    }
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      display += display ? ` at ${formattedHour}:${minutes} ${ampm}` : `${formattedHour}:${minutes} ${ampm}`
    }
    return display || "No due date"
  }

  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#3F74FF"
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"
  const hasRepeat = (task.repeatSettings && task.repeatSettings.frequency) || repeatConfigs[task.id] || task.repeat

  return (
    <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[60] flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0 safe-area-top">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-xl transition-colors active:scale-95"
          aria-label="Back to tasks"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCompleted ? 'bg-green-500/20 text-green-400' :
            isCanceled ? 'bg-red-500/20 text-red-400' :
            'bg-amber-500/20 text-amber-400'
          }`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          
          {/* 3-Dot Actions Menu */}
          <div className="relative" ref={actionsMenuRef}>
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-xl transition-colors active:scale-95"
              aria-label="More actions"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            {showActionsMenu && (
              <div className="absolute top-full right-0 mt-2 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg min-w-[200px] z-[100] overflow-hidden">
                <div className="py-1">
                  {/* Mark Complete / Set Ongoing */}
                  {!isCompleted && !isCanceled && (
                    <button
                      onClick={() => {
                        onStatusChange(task.id, "completed")
                        setShowActionsMenu(false)
                        onClose()
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                    >
                      <Check size={16} />
                      <span>Mark Complete</span>
                    </button>
                  )}
                  
                  {isCompleted && (
                    <button
                      onClick={() => {
                        onStatusChange(task.id, "ongoing")
                        setShowActionsMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                    >
                      <Edit size={16} />
                      <span>Set Ongoing</span>
                    </button>
                  )}

                  {/* Cancel Task / Set Ongoing for canceled */}
                  {!isCompleted && !isCanceled && (
                    <button
                      onClick={() => {
                        onStatusChange(task.id, "canceled")
                        setShowActionsMenu(false)
                        onClose()
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                    >
                      <X size={16} />
                      <span>Cancel Task</span>
                    </button>
                  )}
                  
                  {isCanceled && (
                    <>
                      <button
                        onClick={() => {
                          onStatusChange(task.id, "ongoing")
                          setShowActionsMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                      >
                        <Edit size={16} />
                        <span>Set Ongoing</span>
                      </button>
                      <button
                        onClick={() => {
                          onStatusChange(task.id, "completed")
                          setShowActionsMenu(false)
                          onClose()
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                      >
                        <Check size={16} />
                        <span>Mark Complete</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-700 my-1"></div>

                  {/* Pin/Unpin */}
                  <button
                    onClick={() => {
                      onPinToggle(task.id)
                      setShowActionsMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                  >
                    {task.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    <span>{task.isPinned ? 'Unpin Task' : 'Pin Task'}</span>
                  </button>
                  
                  {/* Duplicate */}
                  <button
                    onClick={() => {
                      onDuplicate(task)
                      setShowActionsMenu(false)
                      onClose()
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                  >
                    <Copy size={16} />
                    <span>Duplicate</span>
                  </button>
                  
                  {/* Repeat */}
                  <button
                    onClick={() => {
                      onRepeat(task)
                      setShowActionsMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-white active:bg-gray-700"
                  >
                    <Repeat size={16} />
                    <span>Set Repeat</span>
                  </button>

                  <div className="border-t border-gray-700 my-1"></div>
                  
                  {/* Delete */}
                  <button
                    onClick={() => {
                      onDelete(task.id)
                      setShowActionsMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center gap-3 text-red-500 active:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Title Section */}
        <div className="p-4 border-b border-gray-800">
          <textarea
            ref={titleTextareaRef}
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value)
              setHasUnsavedChanges(true)
            }}
            onBlur={handleSaveTitle}
            placeholder="Task title..."
            className={`w-full bg-transparent text-xl font-semibold outline-none border-b-2 border-transparent focus:border-blue-500 transition-all pb-2 resize-none ${
              isCompleted ? 'text-gray-500' : 
              isCanceled ? 'text-gray-600 line-through italic' : 
              'text-white'
            }`}
            style={{ minHeight: '60px', height: 'auto', overflow: 'hidden' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
          {task.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        {/* Date & Time Section - Clickable */}
        <button
          onClick={() => {
            if (!isCompleted && !isCanceled) {
              onOpenCalendarModal(task.id, task.dueDate, task.dueTime, task.reminder, task.repeat)
            }
          }}
          className={`w-full p-4 border-b border-gray-800 flex items-center justify-between ${
            !isCompleted && !isCanceled ? 'active:bg-gray-800/50' : ''
          }`}
          disabled={isCompleted || isCanceled}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-300">Due Date & Time</p>
              <p className={`text-sm ${task.dueDate ? 'text-white' : 'text-gray-500'}`}>
                {formatDateTime()}
                {hasRepeat && (
                  <span className="ml-2 text-gray-400">
                    <Repeat size={12} className="inline" /> Repeating
                  </span>
                )}
              </p>
            </div>
          </div>
          {!isCompleted && !isCanceled && (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </button>

        {/* Reminder Section */}
        {task.reminder && task.reminder !== "None" && (
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Bell size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Reminder</p>
              <p className="text-sm text-white">{task.reminder}</p>
            </div>
          </div>
        )}

        {/* Assignees Section - Clickable */}
        <button
          onClick={() => {
            if (!isCompleted && !isCanceled) {
              onOpenAssignModal(task)
            }
          }}
          className={`w-full p-4 border-b border-gray-800 text-left ${
            !isCompleted && !isCanceled ? 'active:bg-gray-800/50' : ''
          }`}
          disabled={isCompleted || isCanceled}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Users size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">Assigned To</p>
              {task.assignees && task.assignees.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.assignees.map((assignee, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-lg text-sm"
                    >
                      {assignee}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No one assigned</p>
              )}
            </div>
            {!isCompleted && !isCanceled && (
              <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
            )}
          </div>
        </button>

        {/* Tags Section - Clickable */}
        <button
          onClick={() => {
            if (!isCompleted && !isCanceled) {
              onOpenTagsModal(task)
            }
          }}
          className={`w-full p-4 border-b border-gray-800 text-left ${
            !isCompleted && !isCanceled ? 'active:bg-gray-800/50' : ''
          }`}
          disabled={isCompleted || isCanceled}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gray-800">
              <Tag size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">Tags</p>
              {task.tags && task.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-sm text-white"
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
            {!isCompleted && !isCanceled && (
              <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

// ============================================
// Mobile Task Card Component (Simplified)
// ============================================
const MobileTaskCard = ({
  task,
  onSelect,
  onStatusChange,
  configuredTags,
}) => {
  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#3F74FF"
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"

  const formatDate = () => {
    if (!task.dueDate) return null
    const date = new Date(task.dueDate)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer select-none ${
        isCompleted ? 'bg-gray-800/50' :
        isCanceled ? 'bg-gray-800/30' :
        'bg-[#1a1a1a] active:bg-gray-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox / X for canceled */}
        {isCanceled ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange(task.id, "ongoing")
            }}
            className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600 border border-gray-500"
            title="Canceled - Click to restore"
          >
            <X size={12} className="text-gray-400" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange(task.id, isCompleted ? "ongoing" : "completed")
            }}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted ? 'bg-gray-500 border-gray-500' :
              'border-gray-500 hover:border-blue-400'
            }`}
          >
            {isCompleted && <Check size={12} className="text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium ${
              isCompleted ? 'text-gray-500' :
              isCanceled ? 'text-gray-600 line-through italic' :
              'text-white'
            }`} style={{ wordBreak: 'break-word' }}>
              {task.title}
            </p>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Date */}
            {formatDate() && (
              <span className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                isCompleted || isCanceled ? 'bg-gray-800 text-gray-500' : 'bg-blue-900/30 text-blue-300'
              }`}>
                <Calendar size={10} />
                {formatDate()}
              </span>
            )}
            
            {/* Assignees Count */}
            {task.assignees && task.assignees.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                isCompleted || isCanceled ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 text-gray-300'
              }`}>
                <Users size={10} />
                {task.assignees.length}
              </span>
            )}

            {/* Tags (max 2) */}
            {task.tags && task.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded-md ${
                  isCompleted || isCanceled ? 'bg-gray-800 text-gray-500' : 'text-white'
                }`}
                style={{ backgroundColor: isCompleted || isCanceled ? undefined : getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
            {task.tags && task.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Selected Date Time Display
// ============================================
const SelectedDateTimeDisplay = ({ date, time, onClear }) => {
  if (!date && !time) return null
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }
  const formatTime = (timeStr) => {
    if (!timeStr) return ""
    const [hours, minutes] = timeStr.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }
  return (
    <div className="flex items-center gap-2 bg-[#2F2F2F] rounded-lg px-3 py-1 text-sm mr-2">
      <span className="text-white whitespace-nowrap">
        {date && formatDate(date)}
        {date && time && " • "}
        {time && formatTime(time)}
      </span>
      <button onClick={onClear} className="text-gray-400 hover:text-white ml-1" title="Clear date and time">
        <X size={14} />
      </button>
    </div>
  )
}

export default function TodoApp() {
  const sidebarSystem = useSidebarSystem()
  
  // ============================================
  // Column Configuration
  // ============================================
  const [columns] = useState([
    { id: "ongoing", title: "Ongoing", color: "#f59e0b" },
    { id: "completed", title: "Completed", color: "#10b981" },
    { id: "canceled", title: "Canceled", color: "#ef4444" },
  ])
  
  const [collapsedColumns, setCollapsedColumns] = useState({
    completed: true,
    canceled: true,
  })

  // ============================================
  // Per-Column Sorting State
  // ============================================
  const [columnSortSettings, setColumnSortSettings] = useState(() => {
    const initialSettings = {}
    columns.forEach(col => {
      initialSettings[col.id] = {
        sortBy: 'custom',
        sortOrder: 'asc'
      }
    })
    return initialSettings
  })

  // ============================================
  // Task State
  // ============================================
  const [tasks, setTasks] = useState(todosTaskData)
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)
  const [availableAssignees] = useState(availableAssigneesData)
  const [repeatConfigs, setRepeatConfigs] = useState({})

  // ============================================
  // Staff Filter State
  // ============================================
  const [selectedStaffFilter, setSelectedStaffFilter] = useState([])

  // ============================================
  // Mobile State
  // ============================================
  const [selectedMobileTask, setSelectedMobileTask] = useState(null)
  const [showMobileCreateModal, setShowMobileCreateModal] = useState(false)
  const [mobileSortMenuOpen, setMobileSortMenuOpen] = useState(null) // null or columnId
  const [showMobileFilterMenu, setShowMobileFilterMenu] = useState(false)
  const mobileFilterRef = useRef(null)

  // ============================================
  // New Task Data for Create Modal
  // ============================================
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    tags: [],
    assignees: [],
    dueDate: "",
    dueTime: "",
    reminder: "",
    repeat: "",
  })

  // Reset newTaskData when create modal closes
  useEffect(() => {
    if (!showMobileCreateModal) {
      setNewTaskData({
        title: "",
        tags: [],
        assignees: [],
        dueDate: "",
        dueTime: "",
        reminder: "",
        repeat: "",
      })
    }
  }, [showMobileCreateModal])

  // ============================================
  // UI State
  // ============================================
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedReminder, setSelectedReminder] = useState("")
  const [selectedRepeat, setSelectedRepeat] = useState("")
  const [customReminderValue, setCustomReminderValue] = useState("")
  const [customReminderUnit, setCustomReminderUnit] = useState("Minutes")
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false)
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [isEditModalOpenTask, setIsEditModalOpenTask] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTaskInput, setNewTaskInput] = useState("")
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false)
  const [selectedTaskForRepeat, setSelectedTaskForRepeat] = useState(null)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [assignModalTask, setAssignModalTask] = useState(null)
  const [tagsModalTask, setTagsModalTask] = useState(null)
  const [calendarModal, setCalendarModal] = useState({
    isOpen: false,
    taskId: null,
    initialDate: "",
    initialTime: "",
    initialReminder: "",
    initialRepeat: "",
  })

  // ============================================
  // Create Modal - Modal States
  // ============================================
  const [createModeAssignModal, setCreateModeAssignModal] = useState(false)
  const [createModeTagsModal, setCreateModeTagsModal] = useState(false)
  const [createModeCalendarModal, setCreateModeCalendarModal] = useState(false)

  // ============================================
  // @dnd-kit State and Logic
  // ============================================
  const [activeId, setActiveId] = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  // Configure sensors with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection
  const collisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    return rectIntersection(args)
  }, [])

  // Close mobile menus on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".mobile-sort-dropdown")) {
        setMobileSortMenuOpen(null)
      }
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(event.target)) {
        setShowMobileFilterMenu(false)
      }
      if (!event.target.closest(".calendar-dropdown")) {
        setIsCalendarOpen(false)
      }
      if (!event.target.closest(".assign-dropdown")) {
        setIsAssignDropdownOpen(false)
      }
      if (!event.target.closest(".tag-dropdown")) {
        setIsTagDropdownOpen(false)
      }
    }
    
    const handleScroll = () => {
      setMobileSortMenuOpen(null)
      setShowMobileFilterMenu(false)
      setIsCalendarOpen(false)
      setIsAssignDropdownOpen(false)
      setIsTagDropdownOpen(false)
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll, true) // true for capture phase to catch all scroll events
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  // Keyboard shortcuts: T for Tags, C for Create, ESC for closing modals
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if user is typing in an input field
      const target = e.target
      const activeEl = document.activeElement
      
      const isInEditableArea = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable === true ||
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable === true

      // If in editable area, only handle Escape
      if (isInEditableArea) {
        if (e.key === 'Escape') {
          activeEl?.blur?.()
        }
        return
      }

      // Handle Escape for modals (priority order)
      if (e.key === 'Escape') {
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false)
          setSelectedTask(null)
        } else if (isRepeatModalOpen) {
          setIsRepeatModalOpen(false)
          setSelectedTaskForRepeat(null)
        } else if (assignModalTask) {
          if (createModeAssignModal) setCreateModeAssignModal(false)
          setAssignModalTask(null)
        } else if (tagsModalTask) {
          if (createModeTagsModal) setCreateModeTagsModal(false)
          setTagsModalTask(null)
        } else if (calendarModal.isOpen) {
          setCreateModeCalendarModal(false)
          setCalendarModal({ isOpen: false, taskId: null, initialDate: "", initialTime: "", initialReminder: "", initialRepeat: "" })
        } else if (isTagManagerOpen) {
          setIsTagManagerOpen(false)
        } else if (isEditModalOpenTask) {
          setIsEditModalOpenTask(false)
          setSelectedTask(null)
        } else if (showMobileCreateModal) {
          setShowMobileCreateModal(false)
        } else if (selectedMobileTask) {
          setSelectedMobileTask(null)
        } else if (mobileSortMenuOpen) {
          setMobileSortMenuOpen(null)
        } else if (showMobileFilterMenu) {
          setShowMobileFilterMenu(false)
        }
        return
      }

      // Don't handle other shortcuts if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return

      // Check if ANY modal is open - if so, don't trigger other hotkeys
      const anyModalOpen = 
        isDeleteModalOpen ||
        isRepeatModalOpen ||
        assignModalTask ||
        tagsModalTask ||
        calendarModal.isOpen ||
        isTagManagerOpen ||
        isEditModalOpenTask ||
        showMobileCreateModal ||
        selectedMobileTask ||
        mobileSortMenuOpen ||
        showMobileFilterMenu
      
      // Also check if any modal overlay is visible in the DOM
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
                              document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]')
      
      if (anyModalOpen || hasVisibleModal) return

      // T - Open Tag Manager
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setIsTagManagerOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [
    isDeleteModalOpen, 
    isRepeatModalOpen, 
    assignModalTask, 
    tagsModalTask, 
    calendarModal.isOpen, 
    isTagManagerOpen, 
    isEditModalOpenTask, 
    showMobileCreateModal, 
    selectedMobileTask,
    mobileSortMenuOpen,
    showMobileFilterMenu,
    createModeAssignModal,
    createModeTagsModal
  ])

  // Get column ID from droppable ID
  const getColumnId = (id) => {
    if (!id) return null
    if (typeof id === "string" && id.startsWith("column-")) {
      return id.replace("column-", "")
    }
    const task = tasks.find((t) => t.id === id)
    return task?.status || null
  }

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  // Handle drag over
  const handleDragOver = (event) => {}

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id
    const overId = over.id
    const draggedTask = tasks.find((t) => t.id === activeTaskId)
    if (!draggedTask) return

    const sourceColumnId = draggedTask.status
    let targetColumnId = getColumnId(overId)

    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) targetColumnId = overTask.status
    if (typeof overId === "string" && overId.startsWith("column-")) {
      targetColumnId = overId.replace("column-", "")
    }

    if (!targetColumnId) return

    // Same column - reorder
    if (sourceColumnId === targetColumnId) {
      setColumnSortSettings(prev => ({
        ...prev,
        [sourceColumnId]: { ...prev[sourceColumnId], sortBy: 'custom' }
      }))

      const columnTasks = tasks.filter((t) => t.status === sourceColumnId)
      const oldIndex = columnTasks.findIndex((t) => t.id === activeTaskId)
      const newIndex = overTask 
        ? columnTasks.findIndex((t) => t.id === overId)
        : columnTasks.length - 1

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex)
        const otherTasks = tasks.filter((t) => t.status !== sourceColumnId)
        setTasks([...otherTasks, ...reorderedColumnTasks])
        
      }
      return
    }

    // Different column - move task
    moveTaskToColumn(draggedTask, sourceColumnId, targetColumnId, overId)
  }

  // Move task to new column
  const moveTaskToColumn = (task, sourceColumnId, targetColumnId, overId = null) => {
    const targetColumnTasks = tasks.filter((t) => t.status === targetColumnId)
    let insertIndex = targetColumnTasks.length
    if (overId && typeof overId !== "string") {
      const overIndex = targetColumnTasks.findIndex((t) => t.id === overId)
      if (overIndex !== -1) insertIndex = overIndex
    }

    const updatedTask = {
      ...task,
      status: targetColumnId,
      isPinned: false,
      updatedAt: new Date().toISOString(),
    }

    const otherTasks = tasks.filter((t) => t.id !== task.id)
    const beforeTarget = otherTasks.filter((t) => t.status !== targetColumnId)
    const targetTasks = otherTasks.filter((t) => t.status === targetColumnId)
    targetTasks.splice(insertIndex, 0, updatedTask)

    setTasks([...beforeTarget, ...targetTasks])
  }

  // ============================================
  // Sorting Functions
  // ============================================
  const sortTasks = useCallback((tasksToSort, columnId) => {
    const settings = columnSortSettings[columnId]
    if (!settings || settings.sortBy === 'custom') {
      return [...tasksToSort].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return 0
      })
    }

    const sorted = [...tasksToSort].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      let comparison = 0
      switch (settings.sortBy) {
        case 'title':
          comparison = (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase())
          break
        case 'dueDate':
          comparison = new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31')
          break
        case 'tag':
          const tagA = a.tags && a.tags.length > 0 ? a.tags[0].toLowerCase() : 'zzz'
          const tagB = b.tags && b.tags.length > 0 ? b.tags[0].toLowerCase() : 'zzz'
          comparison = tagA.localeCompare(tagB)
          break
        case 'recentlyAdded':
          comparison = new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01')
          break
        default:
          return 0
      }
      return settings.sortOrder === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [columnSortSettings])

  // Handle sort change
  const handleSortChange = useCallback((columnId, sortBy) => {
    setColumnSortSettings(prev => {
      const currentSettings = prev[columnId]
      const newSortOrder = currentSettings.sortBy === sortBy && currentSettings.sortOrder === 'asc' ? 'desc' : 'asc'
      return {
        ...prev,
        [columnId]: { sortBy, sortOrder: sortBy === currentSettings.sortBy ? newSortOrder : 'asc' }
      }
    })
  }, [])

  // Toggle sort order
  const handleToggleSortOrder = useCallback((columnId) => {
    setColumnSortSettings(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], sortOrder: prev[columnId].sortOrder === 'asc' ? 'desc' : 'asc' }
    }))
  }, [])

  // Get filtered and sorted tasks for column
  const getColumnTasks = useCallback((columnId) => {
    let columnTasks = tasks.filter((task) => task.status === columnId)
    
    // Apply staff filter
    if (selectedStaffFilter.length > 0) {
      columnTasks = columnTasks.filter(task => {
        if (!task.assignees || task.assignees.length === 0) return false
        return task.assignees.some(assignee => {
          return selectedStaffFilter.some(staffId => {
            const staff = availableAssignees.find(a => a.id === staffId)
            if (!staff) return false
            return assignee === `${staff.firstName} ${staff.lastName}`
          })
        })
      })
    }
    
    return sortTasks(columnTasks, columnId)
  }, [tasks, sortTasks, selectedStaffFilter, availableAssignees])

  // Get all tasks for mobile view - NOW WITH SORTING
  const getAllFilteredTasks = useCallback(() => {
    let allTasks = [...tasks]
    
    if (selectedStaffFilter.length > 0) {
      allTasks = allTasks.filter(task => {
        if (!task.assignees || task.assignees.length === 0) return false
        return task.assignees.some(assignee => {
          return selectedStaffFilter.some(staffId => {
            const staff = availableAssignees.find(a => a.id === staffId)
            if (!staff) return false
            return assignee === `${staff.firstName} ${staff.lastName}`
          })
        })
      })
    }

    // Group by status AND apply sorting for each status
    const ongoing = sortTasks(allTasks.filter(t => t.status === 'ongoing'), 'ongoing')
    const completed = sortTasks(allTasks.filter(t => t.status === 'completed'), 'completed')
    const canceled = sortTasks(allTasks.filter(t => t.status === 'canceled'), 'canceled')

    return { ongoing, completed, canceled, total: allTasks.length }
  }, [tasks, selectedStaffFilter, availableAssignees, sortTasks])

  // ============================================
  // Column collapse
  // ============================================
  const toggleColumnCollapse = (columnId) => {
    setCollapsedColumns((prev) => ({ ...prev, [columnId]: !prev[columnId] }))
  }

  // ============================================
  // Calendar Modal Handlers
  // ============================================
  const handleOpenCalendarModal = (taskId, currentDate = "", currentTime = "", currentReminder = "", currentRepeat = "") => {
    setCalendarModal({
      isOpen: true,
      taskId,
      initialDate: currentDate,
      initialTime: currentTime,
      initialReminder: currentReminder || "",
      initialRepeat: currentRepeat || "",
    })
  }

  const handleClearDateTime = () => {
    setSelectedDate("")
    setSelectedTime("")
    setSelectedReminder("")
    setSelectedRepeat("")
  }

  const handleCalendarSave = (calendarData) => {
    // Check if this is for create mode
    if (createModeCalendarModal) {
      setNewTaskData(prev => ({
        ...prev,
        dueDate: calendarData.date,
        dueTime: calendarData.time,
        reminder: calendarData.reminder,
        repeat: calendarData.repeat,
      }))
      setCreateModeCalendarModal(false)
      setCalendarModal({ isOpen: false, taskId: null, initialDate: "", initialTime: "", initialReminder: "", initialRepeat: "" })
      return
    }

    if (calendarModal.taskId) {
      const taskToUpdate = tasks.find((t) => t.id === calendarModal.taskId)
      const updatedTask = {
        ...taskToUpdate,
        dueDate: calendarData.date,
        dueTime: calendarData.time,
        reminder: calendarData.reminder,
        repeat: calendarData.repeat,
        customReminder: calendarData.customReminder,
        repeatEnd: calendarData.repeatEnd,
      }
      handleTaskUpdate(updatedTask)
      
      // Update mobile task if viewing
      if (selectedMobileTask && selectedMobileTask.id === calendarModal.taskId) {
        setSelectedMobileTask(updatedTask)
      }
      
      
    } else {
      setSelectedDate(calendarData.date)
      setSelectedTime(calendarData.time)
      setSelectedReminder(calendarData.reminder)
      setSelectedRepeat(calendarData.repeat)
    }
    setCalendarModal({ isOpen: false, taskId: null, initialDate: "", initialTime: "", initialReminder: "", initialRepeat: "" })
  }

  const handleCalendarClose = () => {
    setCreateModeCalendarModal(false)
    setCalendarModal({ isOpen: false, taskId: null, initialDate: "", initialTime: "", initialReminder: "", initialRepeat: "" })
  }

  // ============================================
  // Modal Handlers
  // ============================================
  const handleOpenAssignModal = (task) => setAssignModalTask(task)
  const handleOpenTagsModal = (task) => setTagsModalTask(task)

  // ============================================
  // Create Mode Modal Handlers
  // ============================================
  const handleOpenCreateCalendarModal = () => {
    setCreateModeCalendarModal(true)
    setCalendarModal({
      isOpen: true,
      taskId: null,
      initialDate: newTaskData.dueDate || "",
      initialTime: newTaskData.dueTime,
      initialReminder: newTaskData.reminder,
      initialRepeat: newTaskData.repeat,
    })
  }

  const handleOpenCreateAssignModal = () => {
    setCreateModeAssignModal(true)
    // Create a temporary task object for the assign modal
    setAssignModalTask({
      id: 'new-task',
      title: newTaskData.title || 'New Task',
      assignees: newTaskData.assignees || [],
    })
  }

  const handleOpenCreateTagsModal = () => {
    setCreateModeTagsModal(true)
    // Create a temporary task object for the tags modal
    setTagsModalTask({
      id: 'new-task',
      title: newTaskData.title || 'New Task',
      tags: newTaskData.tags || [],
    })
  }

  // ============================================
  // Task CRUD Operations
  // ============================================
  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, isPinned: false, updatedAt: new Date().toISOString() }
          : task
      )
    )
  }

  const handleTaskUpdate = (updatedTask) => {
    // Check if this is for create mode
    if (createModeAssignModal && updatedTask.id === 'new-task') {
      setNewTaskData(prev => ({
        ...prev,
        assignees: updatedTask.assignees || [],
      }))
      setCreateModeAssignModal(false)
      setAssignModalTask(null)
      return
    }
    
    if (createModeTagsModal && updatedTask.id === 'new-task') {
      setNewTaskData(prev => ({
        ...prev,
        tags: updatedTask.tags || [],
      }))
      setCreateModeTagsModal(false)
      setTagsModalTask(null)
      return
    }

    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    if (selectedMobileTask && selectedMobileTask.id === updatedTask.id) {
      setSelectedMobileTask(updatedTask)
    }
    
  }

  const handleTaskRemove = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    if (selectedMobileTask && selectedMobileTask.id === taskId) {
      setSelectedMobileTask(null)
    }
    
  }

  const handleTaskPinToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isPinned: !task.isPinned } : task))
    )
    if (selectedMobileTask && selectedMobileTask.id === taskId) {
      setSelectedMobileTask({ ...selectedMobileTask, isPinned: !selectedMobileTask.isPinned })
    }
  }

  const handleEditRequest = (task) => {
    setSelectedTask(task)
    setIsEditModalOpenTask(true)
  }

  const handleDeleteRequest = (taskId) => {
    setSelectedTask(tasks.find((t) => t.id === taskId))
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteTask = () => {
    if (selectedTask) {
      handleTaskRemove(selectedTask.id)
      setIsDeleteModalOpen(false)
      setSelectedTask(null)
    }
  }

  const handleDuplicateTask = (taskToDuplicate) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...taskToDuplicate,
        id: newId,
        title: `${taskToDuplicate.title} (Copy)`,
        isPinned: false,
        status: "ongoing",
        createdAt: new Date().toISOString(),
      },
    ])
    
  }

  const handleRepeatRequest = (task) => {
    setSelectedTaskForRepeat(task)
    setIsRepeatModalOpen(true)
  }

  const handleRepeatTask = (taskToRepeat, repeatOptions) => {
    setRepeatConfigs((prev) => ({
      ...prev,
      [taskToRepeat.id]: {
        originalTask: { ...taskToRepeat },
        repeatOptions: repeatOptions,
        lastCompletedDate: null,
        occurrencesCreated: 0,
      },
    }))
    
    setIsRepeatModalOpen(false)
    setSelectedTaskForRepeat(null)
  }

  // ============================================
  // Mobile Task Creation
  // ============================================
  const handleMobileCreateTask = (taskData) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    const newTask = {
      id: newId,
      title: taskData.title,
      assignees: taskData.assignees || [],
      roles: [],
      tags: taskData.tags || [],
      status: "ongoing",
      category: "general",
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      reminder: taskData.reminder,
      repeat: taskData.repeat,
      isPinned: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
    
  }

  // ============================================
  // Tag Management
  // ============================================
  const deleteTag = (tagId) => {
    setConfiguredTags(configuredTags.filter((tag) => tag.id !== tagId))
    setTasks(
      tasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => {
          const tagToDelete = configuredTags.find((t) => t.id === tagId)
          return tag !== tagToDelete?.name
        }),
      }))
    )
    
  }

  // ============================================
  // Assignment Helpers
  // ============================================
  const toggleAssignee = (assignee) => {
    setSelectedAssignees((prev) => {
      const isSelected = prev.find((a) => a.id === assignee.id)
      return isSelected ? prev.filter((a) => a.id !== assignee.id) : [...prev, assignee]
    })
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.find((t) => t.id === tag.id)
      return isSelected ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
    })
  }

  // Staff Filter Toggle
  const toggleStaffFilter = (staffId) => {
    setSelectedStaffFilter(prev => prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId])
  }

  // ============================================
  // Add Task Handler (Desktop)
  // ============================================
  const handleAddTaskFromInputOptimized = useCallback(() => {
    if (newTaskInput.trim() !== "") {
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
      const newTask = {
        id: newId,
        title: newTaskInput.trim(),
        assignees: selectedAssignees.map((a) => `${a.firstName} ${a.lastName}`),
        roles: [],
        tags: selectedTags.map((t) => t.name),
        status: "ongoing",
        category: "general",
        dueDate: selectedDate,
        dueTime: selectedTime,
        isPinned: false,
        createdAt: new Date().toISOString(),
      }
      setTasks((prevTasks) => [...prevTasks, newTask])
      setNewTaskInput("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedAssignees([])
      setSelectedTags([])
      
    }
  }, [newTaskInput, tasks, selectedAssignees, selectedTags, selectedDate, selectedTime])

  const handleTextareaChange = useCallback((newValue) => {
    setNewTaskInput(newValue)
  }, [])

  // ============================================
  // Sidebar System Integration
  // ============================================
  const {
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    setIsRightSidebarOpen,
    setIsSidebarEditing,
    setIsRightWidgetModalOpen,
    setOpenDropdownIndex,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setIsNotifyMemberOpen,
    setNotifyAction,
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    truncateUrl,
    renderSpecialNoteIcon,
    customLinks,
    communications,
    todos,
    setTodos,
    expiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,
    memberTypes,
    todoFilterOptions,
    appointmentTypes,
    freeAppointments,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem

  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  // Get task counts
  const filteredTasks = getAllFilteredTasks()

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <style>
        {`
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
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .safe-area-top {
            padding-top: max(1rem, env(safe-area-inset-top));
          }
          .safe-area-bottom {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        `}
      </style>
      <div
        className={`flex flex-col lg:flex-row rounded-3xl transition-all duration-500 bg-[#1C1C1C] text-white relative min-h-screen md:min-h-0 md:h-[105vh] overflow-hidden ${
          isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"
        }`}
      >

        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ============================================ */}
          {/* HEADER */}
          {/* ============================================ */}
          <div className="flex-shrink-0 p-4 md:p-6 pb-0">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-white">To-Do</h1>
              
              <div className="flex items-center gap-2">
                {/* Mobile: Staff Filter - Now in header */}
                <div className="relative md:hidden" ref={mobileFilterRef}>
                  <button
                    onClick={() => setShowMobileFilterMenu(!showMobileFilterMenu)}
                    className={`p-2 rounded-lg transition-colors active:scale-95 ${
                      selectedStaffFilter.length > 0 ? 'bg-blue-600 text-white' : 'bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]'
                    }`}
                  >
                    <Users size={18} />
                  </button>
                  
                  {showMobileFilterMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[220px] overflow-hidden">
                      <div className="p-2 border-b border-gray-700">
                        <p className="text-xs text-gray-500 font-medium px-2">Filter by Staff</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStaffFilter([])
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                          selectedStaffFilter.length === 0 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        All Tasks
                      </button>
                      {availableAssignees.map((staff) => (
                        <button
                          key={staff.id}
                          onClick={() => {
                            toggleStaffFilter(staff.id)
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                            selectedStaffFilter.includes(staff.id) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <UserCheck size={14} />
                          {staff.firstName} {staff.lastName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile: Tags Button - Now in header */}
                <button
                  onClick={() => setIsTagManagerOpen(true)}
                  className="md:hidden bg-[#2F2F2F] text-gray-300 p-2 rounded-lg hover:bg-[#3F3F3F] transition-colors active:scale-95"
                  title="Manage Tags (T)"
                >
                  <Tag size={18} />
                </button>

                {/* Sidebar Toggle */}
                {isRightSidebarOpen ? (
                  <div onClick={toggleRightSidebar} className="cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <img src="/expand-sidebar mirrored.svg" className="h-5 w-5" alt="" />
                  </div>
                ) : (
                  <div onClick={toggleRightSidebar} className="cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <img src="/icon.svg" className="h-5 w-5" alt="" />
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Task Input Area */}
            <div className="hidden md:flex flex-col md:flex-row gap-4 items-stretch mb-4">
              <div className="relative flex items-start flex-grow bg-[#101010] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none min-h-[44px]">
                <Plus size={18} className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                <OptimizedTextarea
                  value={newTaskInput}
                  onChange={handleTextareaChange}
                  onEnter={handleAddTaskFromInputOptimized}
                  placeholder="New task… (Press Enter to add)"
                  maxLines={4}
                />
                <SelectedDateTimeDisplay date={selectedDate} time={selectedTime} onClear={handleClearDateTime} />
                
                {/* Calendar icon */}
                <div className="relative calendar-dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0]
                      setCalendarModal({
                        isOpen: true,
                        taskId: null,
                        initialDate: selectedDate || today,
                        initialTime: selectedTime,
                        initialReminder: selectedReminder,
                        initialRepeat: selectedRepeat,
                      })
                    }}
                    className="text-gray-400 hover:text-white p-1"
                    title="Set due date"
                  >
                    <Calendar size={18} />
                  </button>
                </div>

                {/* Assignment dropdown */}
                <div className="relative assign-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                    className="text-gray-400 hover:text-white ml-2 p-1"
                    title="Assign task"
                  >
                    <ChevronDown size={18} />
                  </button>
                  {isAssignDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-3 w-64 max-h-80 overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                            <Users size={14} />
                            Assign to Staff
                          </h4>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {availableAssignees.map((assignee) => {
                              const isSelected = selectedAssignees.find((a) => a.id === assignee.id)
                              return (
                                <button
                                  key={assignee.id}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-white hover:bg-gray-600 rounded"
                                  onClick={() => toggleAssignee(assignee)}
                                >
                                  <UserCheck size={14} />
                                  <span className="flex-1">{assignee.firstName} {assignee.lastName}</span>
                                  {isSelected && <Check size={14} className="text-green-400" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                            <Tag size={14} />
                            Add Tags
                          </h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {configuredTags.map((tag) => {
                              const isSelected = selectedTags.find((t) => t.id === tag.id)
                              return (
                                <button
                                  key={tag.id}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
                                  onClick={() => toggleTag(tag)}
                                >
                                  <span
                                    className="px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                                    style={{ backgroundColor: tag.color }}
                                  >
                                    <Tag size={10} />
                                    {tag.name}
                                  </span>
                                  {isSelected && <Check size={14} className="text-green-400" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setIsAssignDropdownOpen(false)}
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Desktop: Tags Button */}
              <div className="relative group">
                <button
                  onClick={() => setIsTagManagerOpen(true)}
                  className="bg-[#2F2F2F] text-white px-4 py-3 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-600 whitespace-nowrap transition-colors"
                >
                  <Tag size={16} />
                  <span>Tags</span>
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Manage Tags</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    T
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>
            </div>

            {/* Desktop: Staff Filter Pills */}
            <div className="hidden md:flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedStaffFilter([])}
                className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                  selectedStaffFilter.length === 0 ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
              >
                All Tasks
              </button>
              {availableAssignees.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => toggleStaffFilter(staff.id)}
                  className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedStaffFilter.includes(staff.id) ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  <UserCheck size={14} />
                  {staff.firstName} {staff.lastName}
                </button>
              ))}
            </div>
          </div>

          {/* ============================================ */}
          {/* MAIN CONTENT - Desktop: DnD Columns */}
          {/* ============================================ */}
          <div className="hidden md:block flex-1 overflow-y-auto p-4 md:p-6 pt-0">
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-3 open_sans_font pb-24">
                {columns.map((column) => (
                  <SortableTaskColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    color={column.color}
                    tasks={getColumnTasks(column.id)}
                    onTaskStatusChange={handleTaskStatusChange}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskPinToggle={handleTaskPinToggle}
                    onTaskRemove={handleTaskRemove}
                    onEditRequest={handleEditRequest}
                    onDeleteRequest={handleDeleteRequest}
                    onDuplicateRequest={handleDuplicateTask}
                    onRepeatRequest={handleRepeatRequest}
                    configuredTags={configuredTags}
                    availableAssignees={availableAssignees}
                    onOpenAssignModal={handleOpenAssignModal}
                    onOpenTagsModal={handleOpenTagsModal}
                    onOpenCalendarModal={handleOpenCalendarModal}
                    repeatConfigs={repeatConfigs}
                    isCollapsed={collapsedColumns[column.id] || false}
                    onToggleCollapse={toggleColumnCollapse}
                    sortSettings={columnSortSettings[column.id]}
                    onSortChange={(sortBy) => handleSortChange(column.id, sortBy)}
                    onToggleSortOrder={() => handleToggleSortOrder(column.id)}
                  />
                ))}
              </div>

              <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
                {activeTask ? (
                  <SortableTaskCard
                    task={activeTask}
                    columnId={activeTask.status}
                    index={0}
                    isDraggingOverlay={true}
                    configuredTags={configuredTags}
                    availableAssignees={availableAssignees}
                    repeatConfigs={repeatConfigs}
                    onStatusChange={() => {}}
                    onUpdate={() => {}}
                    onPinToggle={() => {}}
                    onRemove={() => {}}
                    onEditRequest={() => {}}
                    onDeleteRequest={() => {}}
                    onDuplicateRequest={() => {}}
                    onRepeatRequest={() => {}}
                    onOpenAssignModal={() => {}}
                    onOpenTagsModal={() => {}}
                    onOpenCalendarModal={() => {}}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* ============================================ */}
          {/* MAIN CONTENT - Mobile: Task List */}
          {/* ============================================ */}
          <div className="md:hidden flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 pt-0 pb-24 space-y-4">
              {/* Ongoing Tasks */}
              <div className="bg-[#141414] rounded-2xl overflow-hidden">
                <div 
                  className="px-3 py-2 flex items-center w-full text-left"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.125)' }}
                >
                  <button
                    onClick={() => toggleColumnCollapse('ongoing')}
                    className="flex items-center gap-1.5 flex-1"
                  >
                    <ChevronDown 
                      size={14} 
                      className={`text-gray-400 transition-transform ${collapsedColumns.ongoing ? '-rotate-90' : ''}`} 
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="font-medium text-white text-xs">Ongoing</span>
                    <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded-full font-medium">
                      {filteredTasks.ongoing.length}
                    </span>
                  </button>
                  {/* Sort Button */}
                  <div className="relative mobile-sort-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMobileSortMenuOpen(mobileSortMenuOpen === 'ongoing' ? null : 'ongoing')
                      }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                    >
                      <ArrowUpDown size={16} />
                    </button>
                    {mobileSortMenuOpen === 'ongoing' && (
                      <div className="absolute right-0 top-full mt-1 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden">
                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">Sort by</div>
                        {[
                          { value: 'custom', label: 'Custom' },
                          { value: 'title', label: 'Title' },
                          { value: 'dueDate', label: 'Due Date' },
                          { value: 'recentlyAdded', label: 'Recent' },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                              columnSortSettings.ongoing?.sortBy === option.value 
                                ? 'bg-gray-800 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSortChange('ongoing', option.value)
                                // Only close for 'custom' option which has no direction toggle
                                if (option.value === 'custom') {
                                  setMobileSortMenuOpen(null)
                                }
                              }}
                              className="flex-1 text-left"
                            >
                              {option.label}
                            </button>
                            {columnSortSettings.ongoing?.sortBy === option.value && option.value !== 'custom' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleSortOrder('ongoing')
                                }}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400"
                              >
                                {columnSortSettings.ongoing?.sortOrder === 'asc' 
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
                              setMobileSortMenuOpen(null)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!collapsedColumns.ongoing && (
                  <div className="px-2 py-2 space-y-1.5">
                    {(() => {
                      const pinnedOngoing = filteredTasks.ongoing.filter(t => t.isPinned)
                      const unpinnedOngoing = filteredTasks.ongoing.filter(t => !t.isPinned)
                      return (
                        <>
                          {pinnedOngoing.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 px-2 py-1">
                                <Pin size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs text-amber-500 font-medium">Pinned</span>
                                <div className="flex-1 h-px bg-amber-500/30"></div>
                              </div>
                              {pinnedOngoing.map((task) => (
                                <MobileTaskCard
                                  key={task.id}
                                  task={task}
                                  onSelect={() => setSelectedMobileTask(task)}
                                  onStatusChange={handleTaskStatusChange}
                                  configuredTags={configuredTags}
                                />
                              ))}
                            </>
                          )}
                          {unpinnedOngoing.length > 0 && (
                            <>
                              {pinnedOngoing.length > 0 && (
                                <div className="flex items-center px-2 py-1 mt-2">
                                  <div className="flex-1 h-px bg-gray-700"></div>
                                </div>
                              )}
                              {unpinnedOngoing.map((task) => (
                                <MobileTaskCard
                                  key={task.id}
                                  task={task}
                                  onSelect={() => setSelectedMobileTask(task)}
                                  onStatusChange={handleTaskStatusChange}
                                  configuredTags={configuredTags}
                                />
                              ))}
                            </>
                          )}
                          {filteredTasks.ongoing.length === 0 && (
                            <p className="text-center text-gray-500 py-4 text-sm">No ongoing tasks</p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              <div className="bg-[#141414] rounded-2xl overflow-hidden">
                <div 
                  className="px-3 py-2 flex items-center w-full text-left"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.125)' }}
                >
                  <button
                    onClick={() => toggleColumnCollapse('completed')}
                    className="flex items-center gap-1.5 flex-1"
                  >
                    <ChevronDown 
                      size={14} 
                      className={`text-gray-400 transition-transform ${collapsedColumns.completed ? '-rotate-90' : ''}`} 
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="font-medium text-white text-xs">Completed</span>
                    <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded-full font-medium">
                      {filteredTasks.completed.length}
                    </span>
                  </button>
                  {/* Sort Button */}
                  <div className="relative mobile-sort-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMobileSortMenuOpen(mobileSortMenuOpen === 'completed' ? null : 'completed')
                      }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                    >
                      <ArrowUpDown size={16} />
                    </button>
                    {mobileSortMenuOpen === 'completed' && (
                      <div className="absolute right-0 top-full mt-1 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden">
                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">Sort by</div>
                        {[
                          { value: 'custom', label: 'Custom' },
                          { value: 'title', label: 'Title' },
                          { value: 'dueDate', label: 'Due Date' },
                          { value: 'recentlyAdded', label: 'Recent' },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                              columnSortSettings.completed?.sortBy === option.value 
                                ? 'bg-gray-800 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSortChange('completed', option.value)
                                // Only close for 'custom' option which has no direction toggle
                                if (option.value === 'custom') {
                                  setMobileSortMenuOpen(null)
                                }
                              }}
                              className="flex-1 text-left"
                            >
                              {option.label}
                            </button>
                            {columnSortSettings.completed?.sortBy === option.value && option.value !== 'custom' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleSortOrder('completed')
                                }}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400"
                              >
                                {columnSortSettings.completed?.sortOrder === 'asc' 
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
                              setMobileSortMenuOpen(null)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!collapsedColumns.completed && (
                  <div className="px-2 py-2 space-y-1.5">
                    {filteredTasks.completed.length > 0 ? (
                      filteredTasks.completed.map((task) => (
                        <MobileTaskCard
                          key={task.id}
                          task={task}
                          onSelect={() => setSelectedMobileTask(task)}
                          onStatusChange={handleTaskStatusChange}
                          configuredTags={configuredTags}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4 text-sm">No completed tasks</p>
                    )}
                  </div>
                )}
              </div>

              {/* Canceled Tasks */}
              <div className="bg-[#141414] rounded-2xl overflow-hidden">
                <div 
                  className="px-3 py-2 flex items-center w-full text-left"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.125)' }}
                >
                  <button
                    onClick={() => toggleColumnCollapse('canceled')}
                    className="flex items-center gap-1.5 flex-1"
                  >
                    <ChevronDown 
                      size={14} 
                      className={`text-gray-400 transition-transform ${collapsedColumns.canceled ? '-rotate-90' : ''}`} 
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="font-medium text-white text-xs">Canceled</span>
                    <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded-full font-medium">
                      {filteredTasks.canceled.length}
                    </span>
                  </button>
                  {/* Sort Button */}
                  <div className="relative mobile-sort-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMobileSortMenuOpen(mobileSortMenuOpen === 'canceled' ? null : 'canceled')
                      }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                    >
                      <ArrowUpDown size={16} />
                    </button>
                    {mobileSortMenuOpen === 'canceled' && (
                      <div className="absolute right-0 top-full mt-1 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden">
                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">Sort by</div>
                        {[
                          { value: 'custom', label: 'Custom' },
                          { value: 'title', label: 'Title' },
                          { value: 'dueDate', label: 'Due Date' },
                          { value: 'recentlyAdded', label: 'Recent' },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                              columnSortSettings.canceled?.sortBy === option.value 
                                ? 'bg-gray-800 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSortChange('canceled', option.value)
                                // Only close for 'custom' option which has no direction toggle
                                if (option.value === 'custom') {
                                  setMobileSortMenuOpen(null)
                                }
                              }}
                              className="flex-1 text-left"
                            >
                              {option.label}
                            </button>
                            {columnSortSettings.canceled?.sortBy === option.value && option.value !== 'custom' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleSortOrder('canceled')
                                }}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400"
                              >
                                {columnSortSettings.canceled?.sortOrder === 'asc' 
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
                              setMobileSortMenuOpen(null)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!collapsedColumns.canceled && (
                  <div className="px-2 py-2 space-y-1.5">
                    {filteredTasks.canceled.length > 0 ? (
                      filteredTasks.canceled.map((task) => (
                        <MobileTaskCard
                          key={task.id}
                          task={task}
                          onSelect={() => setSelectedMobileTask(task)}
                          onStatusChange={handleTaskStatusChange}
                          configuredTags={configuredTags}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4 text-sm">No canceled tasks</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Mobile Task Detail View */}
        {/* ============================================ */}
        {selectedMobileTask && (
          <MobileTaskDetail
            task={selectedMobileTask}
            onClose={() => setSelectedMobileTask(null)}
            onStatusChange={(taskId, status) => {
              handleTaskStatusChange(taskId, status)
              if (status !== 'ongoing') {
                setSelectedMobileTask(prev => prev ? { ...prev, status } : null)
              }
            }}
            onUpdate={handleTaskUpdate}
            onDelete={handleDeleteRequest}
            onDuplicate={handleDuplicateTask}
            onPinToggle={handleTaskPinToggle}
            onRepeat={handleRepeatRequest}
            configuredTags={configuredTags}
            availableAssignees={availableAssignees}
            onOpenCalendarModal={handleOpenCalendarModal}
            onOpenAssignModal={handleOpenAssignModal}
            onOpenTagsModal={handleOpenTagsModal}
            repeatConfigs={repeatConfigs}
          />
        )}

        {/* ============================================ */}
        {/* Mobile Create Task Modal */}
        {/* ============================================ */}
        <MobileCreateTaskModal
          isOpen={showMobileCreateModal}
          onClose={() => setShowMobileCreateModal(false)}
          onCreateTask={handleMobileCreateTask}
          configuredTags={configuredTags}
          availableAssignees={availableAssignees}
          onOpenCalendarModal={handleOpenCreateCalendarModal}
          onOpenAssignModal={handleOpenCreateAssignModal}
          onOpenTagsModal={handleOpenCreateTagsModal}
          newTaskData={newTaskData}
          setNewTaskData={setNewTaskData}
        />

        {/* ============================================ */}
        {/* Floating Action Button - Mobile Only (Orange) */}
        {/* ============================================ */}
        <button
          onClick={() => setShowMobileCreateModal(true)}
          className="md:hidden fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-95 z-30"
          aria-label="Add Task"
        >
          <Plus size={24} />
        </button>

        {/* ============================================ */}
        {/* MODALS */}
        {/* ============================================ */}
        
        {/* Tag Manager Modal */}
        <TagManagerModal
          isOpen={isTagManagerOpen}
          onClose={() => setIsTagManagerOpen(false)}
          tags={configuredTags}
          onAddTag={(newTag) => {
            setConfiguredTags([...configuredTags, newTag])
            
          }}
          onDeleteTag={deleteTag}
        />

        {/* Edit Task Modal */}
        {isEditModalOpenTask && selectedTask && (
          <EditTaskModal
            taskToEdit={selectedTask}
            onClose={() => {
              setIsEditModalOpenTask(false)
              setSelectedTask(null)
            }}
            onUpdateTask={handleTaskUpdate}
            configuredTags={configuredTags}
          />
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          task={selectedTask}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setSelectedTask(null)
          }}
          onConfirm={confirmDeleteTask}
        />

        {/* Repeat Task Modal */}
        {isRepeatModalOpen && selectedTaskForRepeat && (
          <RepeatTaskModal
            task={selectedTaskForRepeat}
            onClose={() => {
              setIsRepeatModalOpen(false)
              setSelectedTaskForRepeat(null)
            }}
            onRepeatTask={handleRepeatTask}
          />
        )}

        {/* Assign Modal - Higher z-index for mobile */}
        {assignModalTask && (
          <div className="fixed inset-0 z-[80]">
            <AssignModal
              task={assignModalTask}
              availableAssignees={availableAssignees}
              availableRoles={[]}
              onClose={() => {
                if (createModeAssignModal) {
                  setCreateModeAssignModal(false)
                }
                setAssignModalTask(null)
              }}
              onUpdate={(updatedTask) => {
                handleTaskUpdate(updatedTask)
                // Update mobile task view immediately
                if (selectedMobileTask && selectedMobileTask.id === updatedTask.id) {
                  setSelectedMobileTask(updatedTask)
                }
                if (createModeAssignModal) {
                  setCreateModeAssignModal(false)
                }
                setAssignModalTask(null)
              }}
            />
          </div>
        )}

        {/* Tags Modal - Higher z-index for mobile */}
        {tagsModalTask && (
          <div className="fixed inset-0 z-[80]">
            <TagsModal
              task={tagsModalTask}
              configuredTags={configuredTags}
              onClose={() => {
                if (createModeTagsModal) {
                  setCreateModeTagsModal(false)
                }
                setTagsModalTask(null)
              }}
              onUpdate={(updatedTask) => {
                handleTaskUpdate(updatedTask)
                // Update mobile task view immediately
                if (selectedMobileTask && selectedMobileTask.id === updatedTask.id) {
                  setSelectedMobileTask(updatedTask)
                }
                if (createModeTagsModal) {
                  setCreateModeTagsModal(false)
                }
                setTagsModalTask(null)
              }}
            />
          </div>
        )}

        {/* Calendar Modal - Higher z-index for mobile */}
        <div className={calendarModal.isOpen ? "fixed inset-0 z-[80]" : ""}>
          <CalendarModal
            isOpen={calendarModal.isOpen}
            onClose={handleCalendarClose}
            onSave={handleCalendarSave}
            initialDate={calendarModal.initialDate}
            initialTime={calendarModal.initialTime}
            initialReminder={calendarModal.initialReminder}
            initialRepeat={calendarModal.initialRepeat}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          isRightSidebarOpen={isRightSidebarOpen}
          toggleRightSidebar={toggleRightSidebar}
          isSidebarEditing={isSidebarEditing}
          toggleSidebarEditing={toggleSidebarEditing}
          rightSidebarWidgets={rightSidebarWidgets}
          moveRightSidebarWidget={moveRightSidebarWidget}
          removeRightSidebarWidget={removeRightSidebarWidget}
          setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
          communications={communications}
          redirectToCommunication={redirectToCommunication}
          todos={todos}
          handleTaskComplete={handleTaskCompleteWrapper}
          todoFilter={todoFilter}
          setTodoFilter={setTodoFilter}
          todoFilterOptions={todoFilterOptions}
          isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
          setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
          openDropdownIndex={openDropdownIndex}
          toggleDropdown={toggleDropdown}
          handleEditTask={handleEditTask}
          setTaskToCancel={setTaskToCancel}
          setTaskToDelete={setTaskToDelete}
          birthdays={birthdays}
          isBirthdayToday={isBirthdayToday}
          handleSendBirthdayMessage={handleSendBirthdayMessage}
          customLinks={customLinks}
          truncateUrl={truncateUrl}
          appointments={appointments}
          renderSpecialNoteIcon={renderSpecialNoteIcon}
          handleDumbbellClick={handleDumbbellClick}
          handleCheckIn={handleCheckInWrapper}
          handleAppointmentOptionsModal={handleAppointmentOptionsModal}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          isChartDropdownOpen={isChartDropdownOpen}
          setIsChartDropdownOpen={setIsChartDropdownOpen}
          expiringContracts={expiringContracts}
          getWidgetPlacementStatus={getWidgetPlacementStatus}
          onClose={toggleRightSidebar}
          hasUnreadNotifications={2}
          setIsWidgetModalOpen={setIsWidgetModalOpen}
          handleEditNote={handleEditNoteWrapper}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          isSpecialNoteModalOpen={isSpecialNoteModalOpen}
          setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
          selectedAppointmentForNote={selectedAppointmentForNote}
          setSelectedAppointmentForNote={setSelectedAppointmentForNote}
          handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
          onSaveSpecialNote={handleSaveSpecialNoteWrapper}
          notifications={notifications}
          setTodos={setTodos}
        />

        {/* Training Plans Modal */}
        <TrainingPlansModal
          isOpen={isTrainingPlanModalOpen}
          onClose={() => {
            setIsTrainingPlanModalOpen(false)
            setSelectedUserForTrainingPlan(null)
          }}
          selectedMember={selectedUserForTrainingPlan}
          memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
          availableTrainingPlans={availableTrainingPlans}
          onAssignPlan={handleAssignTrainingPlan}
          onRemovePlan={handleRemoveTrainingPlan}
        />

        {/* Appointment Action Modal */}
        <AppointmentActionModalV2
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setShowAppointmentOptionsModal(false)
            setSelectedAppointment(null)
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setShowAppointmentOptionsModal(false)
            setIsEditAppointmentModalOpen(true)
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
        />

        {/* Notify Member Modal */}
        <NotifyMemberModal
          isOpen={isNotifyMemberOpen}
          onClose={() => setIsNotifyMemberOpen(false)}
          notifyAction={notifyAction}
          actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
          handleNotifyMember={handleNotifyMember}
        />

        {/* Edit Appointment Modal */}
        {isEditAppointmentModalOpen && selectedAppointment && (
          <EditAppointmentModalV2
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            appointmentTypes={appointmentTypes}
            freeAppointments={freeAppointments}
            handleAppointmentChange={(changes) => {
              setSelectedAppointment({ ...selectedAppointment, ...changes })
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointmentWrapper}
            onClose={() => {
              setIsEditAppointmentModalOpen(false)
              setSelectedAppointment(null)
            }}
          />
        )}

        {/* Widget Selection Modal */}
        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
          widgetArea="sidebar"
        />

        {/* Mobile sidebar overlay */}
        {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

        {/* Edit Task Modal from Sidebar */}
        {isEditTaskModalOpen && editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => {
              setIsEditTaskModalOpen(false)
              setEditingTask(null)
            }}
            onUpdateTask={handleUpdateTaskWrapper}
          />
        )}

        {/* Task Delete Confirmation */}
        {taskToDelete && (
          <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Cancel Confirmation */}
        {taskToCancel && (
          <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50 p-4">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToCancel(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  No
                </button>
                <button
                  onClick={() => handleCancelTaskWrapper(taskToCancel)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Cancel Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
