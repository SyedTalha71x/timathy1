/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react"
import { Plus, Filter, X, Calendar, Tag, Users, Repeat, Check, ChevronDown, Clock, Bell } from "lucide-react"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { IoIosMenu } from "react-icons/io"
import toast, { Toaster } from "react-hot-toast"
import RepeatTaskModal from "../../components/user-panel-components/task-components/repeat-task-modal"
import TaskItem from "../../components/user-panel-components/task-components/task-item"
import AssignModal from "../../components/user-panel-components/task-components/assign-modal"
import TagsModal from "../../components/user-panel-components/task-components/edit-tags"
import Draggable from "react-draggable"

import { UserCheck, Briefcase } from "lucide-react"


import {
  todosTaskData,
  configuredTagsData,
  availableAssigneesData,
} from "../../utils/user-panel-states/todo-states"
import DeleteModal from "../../components/user-panel-components/task-components/delete-task"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Sidebar from "../../components/central-sidebar"

import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"


export default function TodoApp() {
  const sidebarSystem = useSidebarSystem();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [sortOption, setSortOption] = useState("dueDate-asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState(null)

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
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FFFFFF")

  const [isEditModalOpenTask, setIsEditModalOpenTask] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const [newTaskInput, setNewTaskInput] = useState("")
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false)
  const [selectedTaskForRepeat, setSelectedTaskForRepeat] = useState(null)

  const [tasks, setTasks] = useState(todosTaskData)
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)
  const [availableAssignees] = useState(availableAssigneesData)

  const [availableRoles] = useState(["Trainer", "Manager", "Developer", "Designer", "Admin", "Support"])

  const [repeatConfigs, setRepeatConfigs] = useState({});


  const trainingVideos = trainingVideosData

  const [columns, setColumns] = useState([
    { id: "ongoing", title: "Ongoing", color: "#f59e0b" },
    { id: "completed", title: "Completed", color: "#10b981" },
    { id: "canceled", title: "Canceled", color: "#ef4444" },
  ])

  const [assignModalTask, setAssignModalTask] = useState(null)
  const [tagsModalTask, setTagsModalTask] = useState(null)

  const columnRefs = useRef({})

  const handleOpenAssignModal = (task) => {
    setAssignModalTask(task)
  }

  const handleOpenTagsModal = (task) => {
    setTagsModalTask(task)
  }

  useEffect(() => {
    columns.forEach((column) => {
      if (!columnRefs.current[column.id]) {
        columnRefs.current[column.id] = React.createRef()
      }
    })
  }, [columns])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setIsStatusDropdownOpen(false)
      }
      if (!event.target.closest(".sort-dropdown")) {
        setIsSortDropdownOpen(false)
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
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Add this useEffect to handle task completion and create repeat tasks
useEffect(() => {
  const now = new Date();
  let shouldUpdateRepeatConfigs = false;
  const updatedRepeatConfigs = { ...repeatConfigs };

  Object.entries(repeatConfigs).forEach(([taskId, config]) => {
    const task = tasks.find(t => t.id === parseInt(taskId));
    
    // Skip if task doesn't exist or isn't completed
    if (!task || task.status !== "completed") return;
    
    // Check if we need to create a repeat task
    const lastCompleted = config.lastCompletedDate ? new Date(config.lastCompletedDate) : null;
    const taskCompletedDate = new Date(task.updatedAt || now); // Use task update time or current time
    
    // Only create repeat if:
    // 1. We haven't created one for this completion yet, AND
    // 2. The task was completed after the last repeat creation
    if (!lastCompleted || lastCompleted < taskCompletedDate) {
      createNextRepeatTask(config, task);
      
      // Update the last completed date to prevent infinite loops
      updatedRepeatConfigs[taskId] = {
        ...config,
        lastCompletedDate: taskCompletedDate.toISOString()
      };
      shouldUpdateRepeatConfigs = true;
    }
  });

  if (shouldUpdateRepeatConfigs) {
    setRepeatConfigs(updatedRepeatConfigs);
  }
}, [tasks]); // Only depend on tasks, not repeatConfigs

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { 
          ...task, 
          status: newStatus, 
          isPinned: false, 
          dragVersion: 0,
          updatedAt: new Date().toISOString() // Add this line
        } : task,
      ),
    );
    
    toast.success(`Task status changed to ${newStatus}!`);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? { ...updatedTask, dragVersion: 0 } : task)),
    )
    toast.success("Task updated successfully!")
  }

  const handleTaskRemove = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    toast.success("Task deleted successfully!")
  }

  const handleAddTaskFromInput = () => {
    if (newTaskInput.trim() !== "") {
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
      const newTask = {
        id: newId,
        title: newTaskInput.trim(), // This will preserve line breaks
        assignees: selectedAssignees.map((a) => `${a.firstName} ${a.lastName}`),
        roles: selectedRoles,
        tags: selectedTags.map((t) => t.name),
        status: "ongoing",
        category: "general",
        dueDate: selectedDate,
        dueTime: selectedTime,
        isPinned: false,
        dragVersion: 0,
      }
      setTasks((prevTasks) => [...prevTasks, newTask])
      setNewTaskInput("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedAssignees([])
      setSelectedRoles([])
      setSelectedTags([])
      toast.success("Task added successfully!")
    }
  }

  const createNextRepeatTask = (config, completedTask) => {
    const { originalTask, repeatOptions } = config;
  
    try {
      const currentIterationDate = new Date(completedTask.dueDate);
  
      // Calculate next occurrence based on repeat frequency
      if (repeatOptions.frequency === "daily") {
        currentIterationDate.setDate(currentIterationDate.getDate() + 1);
      } else if (repeatOptions.frequency === "weekly") {
        currentIterationDate.setDate(currentIterationDate.getDate() + 7);
      } else if (repeatOptions.frequency === "monthly") {
        currentIterationDate.setMonth(currentIterationDate.getMonth() + 1);
      }
  
      // Check if we should create the task based on end conditions
      let shouldCreate = true;
  
      if (repeatOptions.endDate && currentIterationDate > new Date(repeatOptions.endDate)) {
        shouldCreate = false;
      }
  
      if (repeatOptions.occurrences) {
        const occurrencesCount = Object.values(repeatConfigs).filter(
          config => config.originalTask.id === originalTask.id
        ).length;
        if (occurrencesCount >= repeatOptions.occurrences) {
          shouldCreate = false;
        }
      }
  
      // Check if this repeat task already exists to prevent duplicates
      const newDueDate = currentIterationDate.toISOString().split('T')[0];
      const taskAlreadyExists = tasks.some(t => 
        t.title === originalTask.title && 
        t.dueDate === newDueDate &&
        t.status === "ongoing"
      );
  
      if (shouldCreate && !taskAlreadyExists) {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const newTask = {
          ...originalTask,
          id: newId,
          dueDate: newDueDate,
          isPinned: false,
          dragVersion: 0,
          status: "ongoing",
          title: originalTask.title, // Remove "(Copy)" from title
          createdAt: new Date().toISOString()
        };
  
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success(`New repeat task created for ${originalTask.title}`);
      }
    } catch (error) {
      console.error("Error creating repeat task:", error);
      toast.error("Error creating repeat task");
    }
  };

  const handleTaskPinToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isPinned: !task.isPinned, dragVersion: 0 } : task)),
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
        dragVersion: 0,
        status: "ongoing",
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
      setRepeatConfigs(prev => ({
        ...prev,
        [taskToRepeat.id]: {
          originalTask: taskToRepeat,
          repeatOptions: repeatOptions,
          lastCompletedDate: null
        }
      }));

      toast.success("Repeat settings saved! New tasks will be created when this task is completed.");
    } catch (error) {
      toast.error("Error setting up repeat task. Please try again.");
      console.error("Repeat task error:", error);
    }

    setIsRepeatModalOpen(false);
    setSelectedTaskForRepeat(null);
  };

  const handleDragStop = (e, data, task, sourceColumnId) => {
    const draggedElem = e.target
    const draggedRect = draggedElem.getBoundingClientRect()
    const draggedCenterX = draggedRect.left + draggedRect.width / 2
    const draggedCenterY = draggedRect.top + draggedRect.height / 2

    let targetColumnId = null
    for (const [columnId, columnRef] of Object.entries(columnRefs.current)) {
      if (columnRef.current) {
        const columnRect = columnRef.current.getBoundingClientRect()
        if (
          draggedCenterX >= columnRect.left &&
          draggedCenterX <= columnRect.right &&
          draggedCenterY >= columnRect.top &&
          draggedCenterY <= columnRect.bottom
        ) {
          targetColumnId = columnId
          break
        }
      }
    }

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) => {
        if (t.id === task.id) {
          if (targetColumnId && targetColumnId !== sourceColumnId) {
            toast.success(`Task moved to ${columns.find((c) => c.id === targetColumnId).title}`)
            return { ...t, status: targetColumnId, isPinned: false, dragVersion: 0 }
          } else {
            return { ...t, dragVersion: t.dragVersion + 1 }
          }
        }
        return t
      })
      return updatedTasks
    })
  }

  const getSortedTasksForColumn = (columnId) => {
    const columnTasks = tasks.filter((task) => task.status === columnId)
    return [...columnTasks].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      const [criteria, direction] = sortOption.split("-")
      if (criteria === "dueDate") {
        const dateA = new Date(a.dueDate)
        const dateB = new Date(b.dueDate)
        return direction === "asc" ? dateA - dateB : dateB - dateA
      } else if (criteria === "tag") {
        const tagA = a.tags && a.tags.length > 0 ? a.tags[0].toLowerCase() : ""
        const tagB = b.tags && b.tags.length > 0 ? b.tags[0].toLowerCase() : ""
        return direction === "asc" ? tagA.localeCompare(tagB) : tagB.localeCompare(tagA)
      }
      return 0
    })
  }

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: newTagColor,
      }
      setConfiguredTags([...configuredTags, newTag])
      setNewTagName("")
      setNewTagColor("#FF5252")
      toast.success("Tag added successfully!")
    }
  }

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
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-center text-gray-400 text-sm p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={index} className="p-2"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isSelected = tempDate === dateStr
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 text-sm rounded hover:bg-gray-600 ${isSelected ? "bg-blue-600 text-white" : "text-white"
                  }`}
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
                <option key={time} value={time}>
                  {time}
                </option>
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

  const Column = ({
    id,
    title,
    color,
    tasks,
    onDragStop,
    onTaskStatusChange,
    onTaskUpdate,
    onTaskPinToggle,
    onTaskRemove,
    columnRef,
    onEditRequest,
    onDeleteRequest,
    onDuplicateRequest,
    onRepeatRequest,
  }) => {
    const taskItemRefs = useRef({})
    const [draggingTaskId, setDraggingTaskId] = useState(null)

    return (
      <div
        ref={columnRef}
        id={`column-${id}`}
        className="bg-[#141414] rounded-2xl overflow-visible h-full flex flex-col relative"
        data-column-id={id}
        style={{
          zIndex: draggingTaskId ? 1 : "auto",
        }}
      >
        <div className="p-3 flex justify-between items-center rounded-t-2xl" style={{ backgroundColor: `${color}20` }}>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
            <h3 className="font-medium text-white text-sm">{title}</h3>
          </div>
        </div>
        <div className="p-3 flex-1 min-h-[400px] relative">
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
              if (!taskItemRefs.current[task.id]) {
                taskItemRefs.current[task.id] = React.createRef()
              }
              return (
                <Draggable
                  key={`${task.id}-${task.dragVersion}`}
                  nodeRef={taskItemRefs.current[task.id]}
                  onStart={() => setDraggingTaskId(task.id)}
                  onStop={(e, data) => {
                    setDraggingTaskId(null)
                    onDragStop(e, data, task, id)
                  }}
                  cancel=".no-drag"
                  defaultPosition={{ x: 0, y: 0 }}
                >
                  <div
                    ref={taskItemRefs.current[task.id]}
                    className={`cursor-grab mb-3 ${draggingTaskId === task.id ? "z-[9999] relative" : ""}`}
                    style={{
                      zIndex: draggingTaskId === task.id ? 9999 : "auto",
                      position: draggingTaskId === task.id ? "relative" : "static",
                    }}
                  >
                    <TaskItem
                      task={task}
                      onStatusChange={onTaskStatusChange}
                      onUpdate={onTaskUpdate}
                      onPinToggle={onTaskPinToggle}
                      onRemove={onTaskRemove}
                      onEditRequest={onEditRequest}
                      onDeleteRequest={onDeleteRequest}
                      onDuplicateRequest={onDuplicateRequest}
                      onRepeatRequest={onRepeatRequest}
                      isDragging={draggingTaskId === task.id}
                      openDropdownTaskId={openDropdownTaskId}
                      setOpenDropdownTaskId={setOpenDropdownTaskId}
                      configuredTags={configuredTags}
                      availableAssignees={availableAssignees}
                      availableRoles={availableRoles}
                      onOpenAssignModal={handleOpenAssignModal}
                      onOpenTagsModal={handleOpenTagsModal}
                    />
                  </div>
                </Draggable>
              )
            })
          ) : (
            <div className="text-gray-400 text-center py-8">No {title.toLowerCase()} tasks found</div>
          )}
        </div>
      </div>
    )
  }

  const [assignmentMode, setAssignmentMode] = useState("staff")
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

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

  const toggleRole = (role) => {
    setSelectedRoles((prev) => {
      const isSelected = prev.includes(role)
      if (isSelected) {
        return prev.filter((r) => r !== role)
      } else {
        return [...prev, role]
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

  // Extract all states and functions from the hook
  const {
    // States
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
    isBirthdayMessageModalOpen,
    selectedBirthdayPerson,
    birthdayMessage,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    showAppointmentModal,
    freeAppointments,
    selectedMember,
    isMemberOverviewModalOpen,
    isMemberDetailsModalOpen,
    activeMemberDetailsTab,
    isEditModalOpen,
    editModalTab,
    isNotifyMemberOpen,
    notifyAction,
    showHistoryModal,
    historyTab,
    memberHistory,
    currentBillingPeriod,
    tempContingent,
    selectedBillingPeriod,
    showAddBillingPeriodModal,
    newBillingPeriod,
    showContingentModal,
    editingRelations,
    newRelation,
    editForm,
    widgets,
    rightSidebarWidgets,
    notePopoverRef,

    // Setters
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
    setIsBirthdayMessageModalOpen,
    setSelectedBirthdayPerson,
    setBirthdayMessage,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setShowAppointmentModal,
    setFreeAppointments,
    setSelectedMember,
    setIsMemberOverviewModalOpen,
    setIsMemberDetailsModalOpen,
    setActiveMemberDetailsTab,
    setIsEditModalOpen,
    setEditModalTab,
    setIsNotifyMemberOpen,
    setNotifyAction,
    setShowHistoryModal,
    setHistoryTab,
    setMemberHistory,
    setCurrentBillingPeriod,
    setTempContingent,
    setSelectedBillingPeriod,
    setShowAddBillingPeriodModal,
    setNewBillingPeriod,
    setShowContingentModal,
    setEditingRelations,
    setNewRelation,
    setEditForm,
    setWidgets,
    setRightSidebarWidgets,

    // Functions
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
    handleEditAppointment,
    handleCreateNewAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    calculateAge,
    isContractExpiringSoon,
    redirectToContract,
    handleCalendarFromOverview,
    handleHistoryFromOverview,
    handleCommunicationFromOverview,
    handleViewDetailedInfo,
    handleEditFromOverview,
    getMemberAppointments,
    handleManageContingent,
    getBillingPeriods,
    handleAddBillingPeriod,
    handleSaveContingent,
    handleInputChange,
    handleEditSubmit,
    handleAddRelation,
    handleDeleteRelation,
    handleArchiveMember,
    handleUnarchiveMember,
    truncateUrl,
    renderSpecialNoteIcon,

    // new states 
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,
    memberContingentData, setMemberContingentData,
    memberRelations, setMemberRelations,

    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,

    todoFilterOptions,
    relationOptions,
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem;

  // more sidebar related functions

  // Chart configuration
  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ];

  const chartOptions = {
    chart: {
      type: "line",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 4, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -30,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
    },
    title: {
      text: memberTypes[selectedMemberType].title,
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
      align: "left",
      style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
        '<span style="color: black;">' +
        series[seriesIndex][dataPointIndex] +
        "</span></div>",
    },
  };


  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };

  const getMemberAppointmentsWrapper = (memberId) => {
    return getMemberAppointments(memberId, appointments);
  };

  const handleAddBillingPeriodWrapper = () => {
    handleAddBillingPeriod(memberContingentData, setMemberContingentData);
  };

  const handleSaveContingentWrapper = () => {
    handleSaveContingent(memberContingentData, setMemberContingentData);
  };

  const handleEditSubmitWrapper = (e) => {
    handleEditSubmit(e, appointments, setAppointments);
  };

  const handleAddRelationWrapper = () => {
    handleAddRelation(memberRelations, setMemberRelations);
  };

  const handleDeleteRelationWrapper = (category, relationId) => {
    handleDeleteRelation(category, relationId, memberRelations, setMemberRelations);
  };

  const handleArchiveMemberWrapper = (memberId) => {
    handleArchiveMember(memberId, appointments, setAppointments);
  };

  const handleUnarchiveMemberWrapper = (memberId) => {
    handleUnarchiveMember(memberId, appointments, setAppointments);
  };

  const getBillingPeriodsWrapper = (memberId) => {
    return getBillingPeriods(memberId, memberContingentData);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVideoById = (id) => {
    return trainingVideos.find((video) => video.id === id)
  }

  return (
    <>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
      </style>
      <div
        className={`flex flex-col lg:flex-row rounded-3xl transition-all duration-500 bg-[#1C1C1C] text-white relative min-h-screen overflow-visible ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"
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
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">To-Do</h1>
                <div className="flex items-center justify-end">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={28}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md p-1"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="relative flex items-start flex-grow bg-[#101010] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none min-h-[44px]">
                  <Plus size={18} className="text-gray-400 mr-2 mt-1  flex-shrink-0" />
                  <textarea
                    placeholder="Add new task"
                    value={newTaskInput}
                    onChange={(e) => {
                      // Limit to 4 lines maximum
                      const lines = e.target.value.split('\n');
                      if (lines.length <= 4) {
                        setNewTaskInput(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (e.shiftKey) {
                          // Allow new line with Shift+Enter
                          e.preventDefault();
                          const cursorPosition = e.target.selectionStart;
                          const newValue = newTaskInput.substring(0, cursorPosition) + '\n' + newTaskInput.substring(cursorPosition);
                          const lines = newValue.split('\n');
                          if (lines.length <= 4) {
                            setNewTaskInput(newValue);
                          }
                        } else {
                          // Submit task with Enter alone
                          e.preventDefault();
                          handleAddTaskFromInput();
                        }
                      }
                    }}
                    className="flex-grow bg-transparent mt-0.5 text-sm outline-none placeholder-gray-500 resize-none overflow-hidden"
                    rows={1}
                    style={{
                      minHeight: '20px',
                      maxHeight: '80px', // Approximately 4 lines
                      height: 'auto',
                    }}
                    ref={(textarea) => {
                      if (textarea) {
                        // Auto-resize textarea
                        textarea.style.height = 'auto';
                        textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
                      }
                    }}
                  />

                  <div className="relative calendar-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="text-gray-400 hover:text-white ml-2 no-drag p-1"
                      title="Set due date"
                    >
                      <Calendar size={18} />
                    </button>
                    {isCalendarOpen && <CalendarPopup />}
                  </div>

                  <div className="relative tag-dropdown">
                    {isTagDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-3 w-48">
                        <h4 className="text-white text-sm font-medium mb-2">Add Tags</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {configuredTags.map((tag) => {
                            const isSelected = selectedTags.find((t) => t.id === tag.id)
                            return (
                              <button
                                key={tag.id}
                                className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
                                onClick={() => {
                                  setIsTagDropdownOpen(false)
                                }}
                              >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                                {tag.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative assign-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                      className="text-gray-400 hover:text-white ml-2 no-drag p-1"
                      title="Assign task"
                    >
                      <ChevronDown size={18} />
                    </button>
                    {isAssignDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-3 w-64 max-h-80 overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAssignmentMode("staff")}
                              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${assignmentMode === "staff"
                                ? "bg-[#FF843E] text-white"
                                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                                }`}
                            >
                              to Staff
                            </button>
                            <button
                              onClick={() => setAssignmentMode("roles")}
                              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${assignmentMode === "roles"
                                ? "bg-[#FF843E] text-white"
                                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                                }`}
                            >
                              to Roles
                            </button>
                          </div>

                          {assignmentMode === "staff" && (
                            <div>
                              <h4 className="text-white text-sm font-medium mb-2">Assign to Staff</h4>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {availableAssignees.map((assignee) => {
                                  const isSelected = selectedAssignees.find((a) => a.id === assignee.id)
                                  return (
                                    <button
                                      key={assignee.id}
                                      className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
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
                          )}

                          {assignmentMode === "roles" && (
                            <div>
                              <h4 className="text-white text-sm font-medium mb-2">Assign to Roles</h4>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {availableRoles.map((role) => {
                                  const isSelected = selectedRoles.includes(role)
                                  return (
                                    <button
                                      key={role}
                                      className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
                                      onClick={() => toggleRole(role)}
                                    >
                                      <Briefcase size={14} />
                                      <span className="flex-1">{role}</span>
                                      {isSelected && <Check size={14} className="text-green-400" />}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="text-white text-sm font-medium mb-2">Add Tags</h4>
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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTagManagerOpen(true)}
                    className="bg-[#2F2F2F] text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-600 whitespace-nowrap"
                    title="Manage Tags"
                  >
                    <Tag size={16} />
                  </button>

                  <div className="relative sort-dropdown">
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="md:w-auto w-full flex cursor-pointer items-center justify-center  gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]"
                    >
                      <Filter size={16} />
                      <span>
                        {sortOption === "dueDate-asc" && "Due Date (Earliest)"}
                        {sortOption === "dueDate-desc" && "Due Date (Latest)"}
                        {sortOption === "tag-asc" && "Tag (A-Z)"}
                        {sortOption === "tag-desc" && "Tag (Z-A)"}
                      </span>
                      <ChevronDown size={16} />
                    </button>
                    {isSortDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-[#2F2F2F] rounded-xl shadow-lg z-10 w-48">
                        <div className="p-2">
                          <h3 className="text-xs text-gray-400 px-3 py-1">Sort by Due Date</h3>
                          <button
                            onClick={() => {
                              setSortOption("dueDate-asc")
                              setIsSortDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${sortOption === "dueDate-asc" ? "bg-[#3F3F3F]" : ""
                              }`}
                          >
                            <Calendar size={14} />
                            <span>Earliest First</span>
                          </button>
                          <button
                            onClick={() => {
                              setSortOption("dueDate-desc")
                              setIsSortDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${sortOption === "dueDate-desc" ? "bg-[#3F3F3F]" : ""
                              }`}
                          >
                            <Calendar size={14} />
                            <span>Latest First</span>
                          </button>
                          <h3 className="text-xs text-gray-400 px-3 py-1 mt-2">Sort by Tag</h3>
                          <button
                            onClick={() => {
                              setSortOption("tag-asc")
                              setIsSortDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${sortOption === "tag-asc" ? "bg-[#3F3F3F]" : ""
                              }`}
                          >
                            <Tag size={14} />
                            <span>A to Z</span>
                          </button>
                          <button
                            onClick={() => {
                              setSortOption("tag-desc")
                              setIsSortDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${sortOption === "tag-desc" ? "bg-[#3F3F3F]" : ""
                              }`}
                          >
                            <Tag size={14} />
                            <span>Z to A</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 open_sans_font mt-4">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={getSortedTasksForColumn(column.id)}
                  onDragStop={handleDragStop}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskPinToggle={handleTaskPinToggle}
                  onTaskRemove={handleTaskRemove}
                  columnRef={columnRefs.current[column.id]}
                  onEditRequest={handleEditRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onDuplicateRequest={handleDuplicateTask}
                  onRepeatRequest={handleRepeatRequest}
                  availableAssignees={availableAssignees}
                  availableRoles={availableRoles}
                  configuredTags={configuredTags}
                  openDropdownTaskId={openDropdownTaskId}
                  setOpenDropdownTaskId={setOpenDropdownTaskId}
                />
              ))}
            </div>
          </div>
        </div>

        {isTagManagerOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Manage Tags</h2>
                <button onClick={() => setIsTagManagerOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-6">
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    className="w-full bg-[#1C1C1C] text-sm text-white px-4 py-2 rounded-lg outline-none"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm">Color:</span>
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-gray-300 text-sm">{newTagColor}</span>
                  </div>
                  <button
                    onClick={addTag}
                    className="bg-[#FF843E] text-white text-sm px-4 py-2 rounded-lg mt-2 hover:bg-[#FF843E]/90"
                    disabled={!newTagName.trim()}
                  >
                    Add Tag
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto text-sm">
                  {configuredTags.length > 0 ? (
                    <div className="space-y-2">
                      {configuredTags.map((tag) => (
                        <div key={tag.id} className="flex justify-between items-center bg-[#1C1C1C] px-4 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              <Tag size={10} />
                              {tag.name}
                            </span>
                          </div>
                          <button onClick={() => deleteTag(tag.id)} className="text-red-400 hover:text-red-300">
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4 text-sm">No tags created yet</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsTagManagerOpen(false)}
                  className="bg-[#FF843E] text-white px-6 py-2 text-sm rounded-lg hover:bg-[#FF843E]/90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

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

        <DeleteModal
          isOpen={isDeleteModalOpen}
          task={selectedTask}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setSelectedTask(null)
          }}
          onConfirm={confirmDeleteTask}
        />

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

        {assignModalTask && (
          <AssignModal
            task={assignModalTask}
            availableAssignees={availableAssignees}
            availableRoles={availableRoles}
            onClose={() => setAssignModalTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}

        {tagsModalTask && (
          <TagsModal
            task={tagsModalTask}
            configuredTags={configuredTags}
            onClose={() => setTagsModalTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}


        {/* sidebar related modals */}
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
          chartOptions={chartOptions}
          chartSeries={chartSeries}
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
        />

        {/* Sidebar related modals */}
       <TrainingPlansModal
                                                isOpen={isTrainingPlanModalOpen}
                                                onClose={() => {
                                                  setIsTrainingPlanModalOpen(false)
                                                  setSelectedUserForTrainingPlan(null)
                                                }}
                                                selectedMember={selectedUserForTrainingPlan} // Make sure this is passed correctly
                                                memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
                                                availableTrainingPlans={availableTrainingPlans}
                                                onAssignPlan={handleAssignTrainingPlan} // Make sure this function is passed
                                                onRemovePlan={handleRemoveTrainingPlan} // Make sure this function is passed
                                              />
      

        <AppointmentActionModalV2
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setShowAppointmentOptionsModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setShowAppointmentOptionsModal(false);
            setIsEditAppointmentModalOpen(true);
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
        />

        <NotifyMemberModal
          isOpen={isNotifyMemberOpen}
          onClose={() => setIsNotifyMemberOpen(false)}
          notifyAction={notifyAction}
          actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
          handleNotifyMember={handleNotifyMember}
        />

        {isEditAppointmentModalOpen && selectedAppointment && (
          <EditAppointmentModalV2
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            appointmentTypes={appointmentTypes}
            freeAppointments={freeAppointments}
            handleAppointmentChange={(changes) => {
              setSelectedAppointment({ ...selectedAppointment, ...changes });
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointmentWrapper}
            onClose={() => {
              setIsEditAppointmentModalOpen(false);
              setSelectedAppointment(null);
            }}
          />
        )}

        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
          widgetArea="sidebar"
        />

        <MemberOverviewModal
          isOpen={isMemberOverviewModalOpen}
          onClose={() => {
            setIsMemberOverviewModalOpen(false);
            setSelectedMember(null);
          }}
          selectedMember={selectedMember}
          calculateAge={calculateAge}
          isContractExpiringSoon={isContractExpiringSoon}
          handleCalendarFromOverview={handleCalendarFromOverview}
          handleHistoryFromOverview={handleHistoryFromOverview}
          handleCommunicationFromOverview={handleCommunicationFromOverview}
          handleViewDetailedInfo={handleViewDetailedInfo}
          handleEditFromOverview={handleEditFromOverview}
        />

        <AppointmentModal
          show={showAppointmentModal}
          member={selectedMember}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedMember(null);
          }}
          getMemberAppointments={getMemberAppointmentsWrapper}
          appointmentTypes={appointmentTypes}
          handleEditAppointment={handleEditAppointment}
          handleCancelAppointment={handleCancelAppointment}
          currentBillingPeriod={currentBillingPeriod}
          memberContingentData={memberContingentData}
          handleManageContingent={handleManageContingent}
          handleCreateNewAppointment={handleCreateNewAppointment}
        />

        <HistoryModal
          show={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedMember(null);
          }}
          selectedMember={selectedMember}
          historyTab={historyTab}
          setHistoryTab={setHistoryTab}
          memberHistory={memberHistory}
        />

        <MemberDetailsModal
          isOpen={isMemberDetailsModalOpen}
          onClose={() => {
            setIsMemberDetailsModalOpen(false);
            setSelectedMember(null);
          }}
          selectedMember={selectedMember}
          memberRelations={memberRelations}
          DefaultAvatar={DefaultAvatar}
          calculateAge={calculateAge}
          isContractExpiringSoon={isContractExpiringSoon}
          redirectToContract={redirectToContract}
        />

        <ContingentModal
          show={showContingentModal}
          setShow={setShowContingentModal}
          selectedMember={selectedMember}
          getBillingPeriods={getBillingPeriodsWrapper}
          selectedBillingPeriod={selectedBillingPeriod}
          handleBillingPeriodChange={setSelectedBillingPeriod}
          setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
          tempContingent={tempContingent}
          setTempContingent={setTempContingent}
          currentBillingPeriod={currentBillingPeriod}
          handleSaveContingent={handleSaveContingentWrapper}
        />

        <AddBillingPeriodModal
          show={showAddBillingPeriodModal}
          setShow={setShowAddBillingPeriodModal}
          newBillingPeriod={newBillingPeriod}
          setNewBillingPeriod={setNewBillingPeriod}
          handleAddBillingPeriod={handleAddBillingPeriodWrapper}
        />

        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMember(null);
          }}
          selectedMember={selectedMember}
          editModalTab={editModalTab}
          setEditModalTab={setEditModalTab}
          editForm={editForm}
          handleInputChange={handleInputChange}
          handleEditSubmit={handleEditSubmitWrapper}
          editingRelations={editingRelations}
          setEditingRelations={setEditingRelations}
          newRelation={newRelation}
          setNewRelation={setNewRelation}
          availableMembersLeads={availableMembersLeads}
          relationOptions={relationOptions}
          handleAddRelation={handleAddRelationWrapper}
          memberRelations={memberRelations}
          handleDeleteRelation={handleDeleteRelationWrapper}
          handleArchiveMember={handleArchiveMemberWrapper}
          handleUnarchiveMember={handleUnarchiveMemberWrapper}
        />

        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {isEditTaskModalOpen && editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => {
              setIsEditTaskModalOpen(false);
              setEditingTask(null);
            }}
            onUpdateTask={handleUpdateTaskWrapper}
          />
        )}

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
