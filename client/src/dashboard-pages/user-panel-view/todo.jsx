/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Plus, X, Calendar, Tag, Repeat, Check, ChevronDown, Clock, Bell, Users } from "lucide-react"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import toast, { Toaster } from "react-hot-toast"
import RepeatTaskModal from "../../components/user-panel-components/task-components/repeat-task-modal"
import AssignModal from "../../components/user-panel-components/task-components/assign-modal"
import TagsModal from "../../components/user-panel-components/task-components/edit-tags"
import CalendarModal from "../../components/user-panel-components/task-components/calendar-modal"
import { UserCheck } from "lucide-react"
import { todosTaskData, configuredTagsData, availableAssigneesData } from "../../utils/user-panel-states/todo-states"
import DeleteModal from "../../components/user-panel-components/task-components/delete-task"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Sidebar from "../../components/central-sidebar"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import { OptimizedTextarea } from "../../components/user-panel-components/task-components/optimized-text-area"
import TagManagerModal from "../../components/TagManagerModal"

// @dnd-kit imports
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

// New sortable components
import SortableTaskColumn from "../../components/user-panel-components/task-components/sortable-task-column"
import SortableTaskCard from "../../components/user-panel-components/task-components/sortable-task-card"

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
  
  const [collapsedColumns, setCollapsedColumns] = useState({})

  // ============================================
  // Per-Column Sorting State
  // ============================================
  const [columnSortSettings, setColumnSortSettings] = useState(() => {
    const initialSettings = {}
    columns.forEach(col => {
      initialSettings[col.id] = {
        sortBy: 'custom', // 'title', 'dueDate', 'tag', 'recentlyAdded', 'custom'
        sortOrder: 'asc' // 'asc' or 'desc'
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
  // Staff Filter State (like training tab)
  // ============================================
  const [selectedStaffFilter, setSelectedStaffFilter] = useState([]) // Empty = show all

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
  // @dnd-kit State and Logic
  // ============================================
  const [activeId, setActiveId] = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  // Configure sensors for drag detection with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection that prefers columns
  const collisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    return rectIntersection(args)
  }, [])

  // Get column ID from a droppable ID
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
    if (task) {
      setActiveTask(task)
    }
  }

  // Handle drag over (for visual feedback during drag)
  const handleDragOver = (event) => {
    // Visual feedback is handled by the isOver state in columns
  }

  // Handle drag end - the main logic
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    setActiveId(null)
    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id
    const overId = over.id

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === activeTaskId)
    if (!draggedTask) return

    const sourceColumnId = draggedTask.status
    let targetColumnId = getColumnId(overId)

    // If dropped on a task, get that task's column
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) {
      targetColumnId = overTask.status
    }

    // If dropped on a column droppable
    if (typeof overId === "string" && overId.startsWith("column-")) {
      targetColumnId = overId.replace("column-", "")
    }

    if (!targetColumnId) return

    // Same column - reorder
    if (sourceColumnId === targetColumnId) {
      // Switch to custom sorting when manually reordering
      setColumnSortSettings(prev => ({
        ...prev,
        [sourceColumnId]: {
          ...prev[sourceColumnId],
          sortBy: 'custom'
        }
      }))

      const columnTasks = tasks.filter((t) => t.status === sourceColumnId)
      const oldIndex = columnTasks.findIndex((t) => t.id === activeTaskId)
      const newIndex = overTask 
        ? columnTasks.findIndex((t) => t.id === overId)
        : columnTasks.length - 1

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex)
        
        // Rebuild full tasks array with new order
        const otherTasks = tasks.filter((t) => t.status !== sourceColumnId)
        const newTasks = [...otherTasks, ...reorderedColumnTasks]
        
        setTasks(newTasks)
        toast.success("Task reordered")
      }
      return
    }

    // Different column - move task
    moveTaskToColumn(draggedTask, sourceColumnId, targetColumnId, overId)
  }

  // Move task to a new column
  const moveTaskToColumn = (task, sourceColumnId, targetColumnId, overId = null) => {
    const targetColumnTasks = tasks.filter((t) => t.status === targetColumnId)
    
    // Find insertion index
    let insertIndex = targetColumnTasks.length
    if (overId && typeof overId !== "string") {
      const overIndex = targetColumnTasks.findIndex((t) => t.id === overId)
      if (overIndex !== -1) {
        insertIndex = overIndex
      }
    }

    const updatedTask = {
      ...task,
      status: targetColumnId,
      isPinned: false,
      updatedAt: new Date().toISOString(),
    }

    // Remove from old position and insert at new position
    const otherTasks = tasks.filter((t) => t.id !== task.id)
    const beforeTarget = otherTasks.filter((t) => t.status !== targetColumnId)
    const targetTasks = otherTasks.filter((t) => t.status === targetColumnId)
    
    targetTasks.splice(insertIndex, 0, updatedTask)
    const newTasks = [...beforeTarget, ...targetTasks]

    setTasks(newTasks)
    
    const targetColumn = columns.find((c) => c.id === targetColumnId)
    toast.success(`Task moved to ${targetColumn?.title || targetColumnId}`)
  }

  // ============================================
  // Sorting Functions
  // ============================================
  
  // Function to sort tasks based on column settings
  const sortTasks = useCallback((tasksToSort, columnId) => {
    const settings = columnSortSettings[columnId]
    if (!settings || settings.sortBy === 'custom') {
      // For custom sorting, respect pinned items
      return [...tasksToSort].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return 0
      })
    }

    const sorted = [...tasksToSort].sort((a, b) => {
      // Always keep pinned items at top
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      let comparison = 0

      switch (settings.sortBy) {
        case 'title':
          const titleA = (a.title || '').toLowerCase()
          const titleB = (b.title || '').toLowerCase()
          comparison = titleA.localeCompare(titleB)
          break
        
        case 'dueDate':
          const dateA = new Date(a.dueDate || '9999-12-31')
          const dateB = new Date(b.dueDate || '9999-12-31')
          comparison = dateA - dateB
          break
        
        case 'tag':
          const tagA = a.tags && a.tags.length > 0 ? a.tags[0].toLowerCase() : 'zzz'
          const tagB = b.tags && b.tags.length > 0 ? b.tags[0].toLowerCase() : 'zzz'
          comparison = tagA.localeCompare(tagB)
          break
        
        case 'recentlyAdded':
          const createdA = new Date(a.createdAt || a.updatedAt || '1970-01-01')
          const createdB = new Date(b.createdAt || b.updatedAt || '1970-01-01')
          comparison = createdB - createdA // Default to desc for recently added
          break
        
        default:
          return 0
      }

      return settings.sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [columnSortSettings])

  // Function to handle sort change
  const handleSortChange = useCallback((columnId, sortBy) => {
    setColumnSortSettings(prev => {
      const currentSettings = prev[columnId]
      const newSortOrder = currentSettings.sortBy === sortBy && currentSettings.sortOrder === 'asc' ? 'desc' : 'asc'
      
      return {
        ...prev,
        [columnId]: {
          sortBy,
          sortOrder: sortBy === currentSettings.sortBy ? newSortOrder : 'asc'
        }
      }
    })
  }, [])

  // Function to toggle sort order
  const handleToggleSortOrder = useCallback((columnId) => {
    setColumnSortSettings(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        sortOrder: prev[columnId].sortOrder === 'asc' ? 'desc' : 'asc'
      }
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
          // Check if any selected staff member matches
          return selectedStaffFilter.some(staffId => {
            const staff = availableAssignees.find(a => a.id === staffId)
            if (!staff) return false
            const fullName = `${staff.firstName} ${staff.lastName}`
            return assignee === fullName
          })
        })
      })
    }
    
    return sortTasks(columnTasks, columnId)
  }, [tasks, sortTasks, selectedStaffFilter, availableAssignees])

  // ============================================
  // Column collapse
  // ============================================
  const toggleColumnCollapse = (columnId) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  // ============================================
  // Calendar Modal Handlers
  // ============================================
  const handleOpenCalendarModal = (
    taskId,
    currentDate = "",
    currentTime = "",
    currentReminder = "",
    currentRepeat = "",
  ) => {
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
      toast.success("Task date/time updated successfully!")
    } else {
      setSelectedDate(calendarData.date)
      setSelectedTime(calendarData.time)
      setSelectedReminder(calendarData.reminder)
      setSelectedRepeat(calendarData.repeat)
    }
    setCalendarModal({
      isOpen: false,
      taskId: null,
      initialDate: "",
      initialTime: "",
      initialReminder: "",
      initialRepeat: "",
    })
  }

  const handleCalendarClose = () => {
    setCalendarModal({
      isOpen: false,
      taskId: null,
      initialDate: "",
      initialTime: "",
      initialReminder: "",
      initialRepeat: "",
    })
  }

  // ============================================
  // Modal Handlers
  // ============================================
  const handleOpenAssignModal = (task) => {
    setAssignModalTask(task)
  }

  const handleOpenTagsModal = (task) => {
    setTagsModalTask(task)
  }

  // ============================================
  // Task CRUD Operations
  // ============================================
  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            status: newStatus,
            isPinned: false,
            updatedAt: new Date().toISOString(),
          }
          : task,
      ),
    )
    toast.success(`Task status changed to ${newStatus}!`)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    )
    toast.success("Task updated successfully!")
  }

  const handleTaskRemove = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    toast.success("Task deleted successfully!")
  }

  const handleTaskPinToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isPinned: !task.isPinned } : task)),
    )
    const taskName = tasks.find((t) => t.id === taskId)?.title || "Task"
    toast.success(`${taskName} pin status updated!`)
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
    toast.success("Task duplicated successfully!")
  }

  const handleRepeatRequest = (task) => {
    setSelectedTaskForRepeat(task)
    setIsRepeatModalOpen(true)
  }

  const handleRepeatTask = (taskToRepeat, repeatOptions) => {
    try {
      setRepeatConfigs((prev) => ({
        ...prev,
        [taskToRepeat.id]: {
          originalTask: { ...taskToRepeat },
          repeatOptions: repeatOptions,
          lastCompletedDate: null,
          occurrencesCreated: 0,
        },
      }))
      toast.success(
        `Repeat settings saved! Task will repeat ${repeatOptions.occurrences || "until"} ${repeatOptions.endDate || "indefinitely"}.`,
      )
    } catch (error) {
      toast.error("Error setting up repeat task. Please try again.")
      console.error("Repeat task error:", error)
    }
    setIsRepeatModalOpen(false)
    setSelectedTaskForRepeat(null)
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
      })),
    )
    toast.success("Tag deleted successfully!")
  }

  // ============================================
  // Assignment Helpers (Staff only - no roles)
  // ============================================
  const toggleAssignee = (assignee) => {
    setSelectedAssignees((prev) => {
      const isSelected = prev.find((a) => a.id === assignee.id)
      if (isSelected) {
        return prev.filter((a) => a.id !== assignee.id)
      } else {
        return [...prev, assignee]
      }
    })
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.find((t) => t.id === tag.id)
      if (isSelected) {
        return prev.filter((t) => t.id !== tag.id)
      } else {
        return [...prev, tag]
      }
    })
  }

  // ============================================
  // Staff Filter Toggle
  // ============================================
  const toggleStaffFilter = (staffId) => {
    setSelectedStaffFilter(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId)
      } else {
        return [...prev, staffId]
      }
    })
  }

  // ============================================
  // Add Task Handler
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
      // Clear all input fields
      setNewTaskInput("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedAssignees([])
      setSelectedTags([])
      toast.success("Task added successfully!")
    }
  }, [newTaskInput, tasks, selectedAssignees, selectedTags, selectedDate, selectedTime])

  const handleTextareaChange = useCallback((newValue) => {
    setNewTaskInput(newValue)
  }, [])

  // ============================================
  // Close dropdowns on outside click
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
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
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ============================================
  // Repeat task effect
  // ============================================
  useEffect(() => {
    const now = new Date()
    const updatedRepeatConfigs = { ...repeatConfigs }
    let tasksUpdated = false
    Object.entries(repeatConfigs).forEach(([taskId, config]) => {
      const task = tasks.find((t) => t.id === Number.parseInt(taskId))
      if (!task || task.status !== "completed") return
      const lastCompleted = config.lastCompletedDate ? new Date(config.lastCompletedDate) : null
      const taskCompletedDate = new Date(task.updatedAt || now)
      if (!lastCompleted || lastCompleted < taskCompletedDate) {
        const createdTasks = createNextRepeatTasks(config, task)
        if (createdTasks > 0) {
          updatedRepeatConfigs[taskId] = {
            ...config,
            lastCompletedDate: taskCompletedDate.toISOString(),
            occurrencesCreated: (config.occurrencesCreated || 0) + createdTasks,
          }
          tasksUpdated = true
        }
      }
    })
    if (tasksUpdated) {
      setRepeatConfigs(updatedRepeatConfigs)
    }
  }, [tasks])

  const createNextRepeatTasks = (config, completedTask) => {
    const { originalTask, repeatOptions } = config
    let tasksCreated = 0
    try {
      const allRepeatTasks = tasks.filter((t) => t.title === originalTask.title && t.id !== originalTask.id)
      const currentOccurrences = allRepeatTasks.length
      const maxOccurrences = repeatOptions.occurrences || Number.POSITIVE_INFINITY
      if (currentOccurrences < maxOccurrences - 1) {
        const lastTaskDate = new Date(completedTask.dueDate)
        const nextDate = new Date(lastTaskDate)
        if (repeatOptions.frequency === "daily") {
          nextDate.setDate(nextDate.getDate() + 1)
        } else if (repeatOptions.frequency === "weekly") {
          nextDate.setDate(nextDate.getDate() + 7)
        } else if (repeatOptions.frequency === "monthly") {
          nextDate.setMonth(nextDate.getMonth() + 1)
        }
        if (repeatOptions.endDate && nextDate > new Date(repeatOptions.endDate)) {
          return tasksCreated
        }
        const newDueDate = nextDate.toISOString().split("T")[0]
        const taskAlreadyExists = tasks.some(
          (t) => t.title === originalTask.title && t.dueDate === newDueDate && t.status === "ongoing",
        )
        if (!taskAlreadyExists) {
          const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
          const newTask = {
            ...originalTask,
            id: newId,
            dueDate: newDueDate,
            isPinned: false,
            status: "ongoing",
            createdAt: new Date().toISOString(),
          }
          setTasks((prevTasks) => [...prevTasks, newTask])
          tasksCreated = 1
          toast.success(`New repeat task created for ${originalTask.title}`)
        }
      }
    } catch (error) {
      console.error("Error creating repeat task:", error)
      toast.error("Error creating repeat task")
    }
    return tasksCreated
  }

  // ============================================
  // Calendar Popup Component
  // ============================================
  const CalendarPopup = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [tempDate, setTempDate] = useState(selectedDate)
    const [tempTime, setTempTime] = useState(selectedTime)
    const [tempReminder, setTempReminder] = useState(selectedReminder)
    const [tempRepeat, setTempRepeat] = useState(selectedRepeat)
    const [showCustomReminder, setShowCustomReminder] = useState(false)
    const [customValue, setCustomValue] = useState(customReminderValue)
    const [customUnit, setCustomUnit] = useState(customReminderUnit)
    const [repeatEndType, setRepeatEndType] = useState("never")
    const [repeatEndDate, setRepeatEndDate] = useState("")
    const [repeatOccurrences, setRepeatOccurrences] = useState("")
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    const generateTimeOptions = () => {
      const options = []
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          options.push(timeString)
        }
      }
      return options
    }
    
    const handleDateClick = (day) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      setTempDate(dateStr)
    }
    
    const handleTimeChange = (time) => {
      setTempTime(time)
      if (time && !tempReminder) {
        setTempReminder("On time")
      }
    }
    
    const handleReminderChange = (reminder) => {
      setTempReminder(reminder)
      if (reminder === "Custom") {
        setShowCustomReminder(true)
      } else {
        setShowCustomReminder(false)
      }
    }
    
    const handleOK = () => {
      setSelectedDate(tempDate)
      setSelectedTime(tempTime)
      setSelectedReminder(tempReminder)
      setSelectedRepeat(tempRepeat)
      if (showCustomReminder) {
        setCustomReminderValue(customValue)
        setCustomReminderUnit(customUnit)
      }
      setIsCalendarOpen(false)
    }
    
    const handleClear = () => {
      setTempDate("")
      setTempTime("")
      setTempReminder("")
      setTempRepeat("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedReminder("")
      setSelectedRepeat("")
      setCustomReminderValue("")
      setIsCalendarOpen(false)
    }
    
    return (
      <div className="absolute top-full lg:-left-70 -left-55 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-90 p-4 lg:w-84 w-70">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-white hover:text-gray-300"
          >
            ←
          </button>
          <span className="text-white font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-white hover:text-gray-300"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={`${day}-${i}`} className="text-center text-gray-400 text-sm p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isSelected = tempDate === dateStr
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 text-sm rounded hover:bg-gray-600 ${isSelected ? "bg-blue-600 text-white" : "text-white"}`}
              >
                {day}
              </button>
            )
          })}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm w-16">Time:</span>
            <select
              value={tempTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">Select time</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Bell size={16} className="text-gray-400" />
            <span className="text-sm w-16">Reminder:</span>
            <select
              value={tempReminder}
              onChange={(e) => handleReminderChange(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">None</option>
              <option value="On time">On time</option>
              <option value="5 minutes before">5 minutes before</option>
              <option value="15 minutes before">15 minutes before</option>
              <option value="30 minutes before">30 minutes before</option>
              <option value="1 hour before">1 hour before</option>
              <option value="1 day before">1 day before</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          {showCustomReminder && (
            <div className="flex items-center gap-2 text-white ml-6">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm w-16"
                placeholder="30"
                min="1"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm"
              >
                <option value="Minutes">Minutes</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
              </select>
              <span className="text-sm text-gray-400">ahead</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white">
            <Repeat size={16} className="text-gray-400" />
            <span className="text-sm w-16">Repeat:</span>
            <select
              value={tempRepeat}
              onChange={(e) => setTempRepeat(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">Never</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          {tempRepeat && tempRepeat !== "" && (
            <div className="ml-6 space-y-2">
              <div className="text-sm text-gray-200">Ends:</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="never"
                    checked={repeatEndType === "never"}
                    onChange={() => setRepeatEndType("never")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  Never
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="onDate"
                    checked={repeatEndType === "onDate"}
                    onChange={() => setRepeatEndType("onDate")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  On date:
                  <input
                    type="date"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                    onClick={() => setRepeatEndType("onDate")}
                    className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-xs ml-1"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="after"
                    checked={repeatEndType === "after"}
                    onChange={() => setRepeatEndType("after")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  After
                  <input
                    type="number"
                    value={repeatOccurrences}
                    onChange={(e) => setRepeatOccurrences(e.target.value)}
                    onClick={() => setRepeatEndType("after")}
                    min="1"
                    className="w-16 bg-[#1C1C1C] text-white px-2 py-1 rounded text-xs ml-1"
                  />
                  occurrences
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={handleClear} className="px-4 py-2 text-gray-300 hover:text-white text-sm">
            Clear
          </button>
          <button onClick={handleOK} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            OK
          </button>
        </div>
      </div>
    )
  }

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

  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos)
  }

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos)
  }

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos)
  }

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos)
  }

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments)
  }

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments)
  }

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  }

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  }

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments)
  }

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
        `}
      </style>
      <div
        className={`flex flex-col lg:flex-row rounded-3xl transition-all duration-500 bg-[#1C1C1C] text-white relative md:h-[105vh] h-auto overflow-visible ${
          isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"
        }`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <div className="flex-1 p-4 sm:p-6">
          <div className="pb-16 sm:pb-24 lg:pb-36">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">To-Do</h1>
                {isRightSidebarOpen ? (
                  <div onClick={toggleRightSidebar}>
                    <img src="/expand-sidebar mirrored.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                ) : (
                  <div onClick={toggleRightSidebar}>
                    <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                )}
              </div>

              {/* Task Input Area */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
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
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="text-gray-400 hover:text-white p-1"
                      title="Set due date"
                    >
                      <Calendar size={18} />
                    </button>
                    {isCalendarOpen && <CalendarPopup />}
                  </div>

                  {/* Assignment dropdown (Staff only) */}
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
                          {/* Staff Assignment */}
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
                                    <span className="flex-1">
                                      {assignee.firstName} {assignee.lastName}
                                    </span>
                                    {isSelected && <Check size={14} className="text-green-400" />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                          
                          {/* Tags */}
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
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                                        style={{ backgroundColor: tag.color }}
                                      >
                                        <Tag size={10} />
                                        {tag.name}
                                      </span>
                                    </div>
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

                {/* Tags Button - Opens Tag Manager */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTagManagerOpen(true)}
                    className="bg-[#2F2F2F] text-white px-4 py-3.5 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-600 whitespace-nowrap"
                    title="Manage Tags"
                  >
                    <Tag size={16} />
                    <span>Tags</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Staff Member Filter Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              <button
                onClick={() => setSelectedStaffFilter([])}
                className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                  selectedStaffFilter.length === 0
                    ? "bg-blue-600 text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
              >
                All Tasks
              </button>
              {availableAssignees.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => toggleStaffFilter(staff.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedStaffFilter.includes(staff.id)
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  <UserCheck size={14} />
                  {staff.firstName} {staff.lastName}
                </button>
              ))}
            </div>

            {/* Task Sections with DnD Context - Vertical Stacked Layout */}
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-3 open_sans_font">
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

              {/* Drag Overlay - shows the dragged item */}
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}>
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
        </div>

        {/* Tag Manager Modal */}
        <TagManagerModal
          isOpen={isTagManagerOpen}
          onClose={() => setIsTagManagerOpen(false)}
          tags={configuredTags}
          onAddTag={(newTag) => {
            setConfiguredTags([...configuredTags, newTag])
            toast.success("Tag added successfully!")
          }}
          onDeleteTag={(tagId) => {
            deleteTag(tagId)
          }}
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

        {/* Assign Modal (Staff only) */}
        {assignModalTask && (
          <AssignModal
            task={assignModalTask}
            availableAssignees={availableAssignees}
            availableRoles={[]}
            onClose={() => setAssignModalTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}

        {/* Tags Modal - for editing tags on a specific task */}
        {tagsModalTask && (
          <TagsModal
            task={tagsModalTask}
            configuredTags={configuredTags}
            onClose={() => setTagsModalTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={calendarModal.isOpen}
          onClose={handleCalendarClose}
          onSave={handleCalendarSave}
          initialDate={calendarModal.initialDate}
          initialTime={calendarModal.initialTime}
          initialReminder={calendarModal.initialReminder}
          initialRepeat={calendarModal.initialRepeat}
        />

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
          <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
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
          <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
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
