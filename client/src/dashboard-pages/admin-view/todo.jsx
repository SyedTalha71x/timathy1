/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react"
import { Plus, Filter, X, Calendar, Tag, Users, Repeat, Check, ChevronDown, Clock, Bell } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Draggable from "react-draggable"
import { IoIosMenu } from "react-icons/io"

import {
  todosTaskData,
  configuredTagsData,
  availableAssigneesData,
} from "../../utils/studio-states/todo-states"

import RepeatTaskModal from '../../components/admin-dashboard-components/todo-components/repeat-task-modal'
import DeleteModal from '../../components/admin-dashboard-components/todo-components/delete-task'
import AssignModal from '../../components/admin-dashboard-components/todo-components/assign-modal'
import TagsModal from '../../components/admin-dashboard-components/todo-components/edit-tags'
import TaskItem from '../../components/admin-dashboard-components/todo-components/task-item'
import EditTaskModal from "../../components/admin-dashboard-components/todo-components/edit-task-modal"
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import Sidebar from "../../components/admin-dashboard-components/central-sidebar"
import CalendarModal from "../../components/admin-dashboard-components/todo-components/calendar-modal"



export default function TodoApp() {
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

  const [repeatConfigs, setRepeatConfigs] = useState({});

    const [calendarModal, setCalendarModal] = useState({
      isOpen: false,
      taskId: null,
      initialDate: "",
      initialTime: "",
      initialReminder: "",
      initialRepeat: ""
    });

  const [tasks, setTasks] = useState(todosTaskData)
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)
  const [availableAssignees] = useState(availableAssigneesData)

  const [availableRoles] = useState(["Trainer", "Manager", "Developer", "Designer", "Admin", "Support"])

  const [columns, setColumns] = useState([
    { id: "ongoing", title: "Ongoing", color: "#f59e0b" },
    { id: "completed", title: "Completed", color: "#10b981" },
    { id: "canceled", title: "Canceled", color: "#ef4444" },
  ])

  const [assignModalTask, setAssignModalTask] = useState(null)
  const [tagsModalTask, setTagsModalTask] = useState(null)


  const columnRefs = useRef({})

    //sidebar related logic and states 
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
    const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
    const [editingLink, setEditingLink] = useState(null)
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  
    const [sidebarWidgets, setSidebarWidgets] = useState([
      { id: "sidebar-chart", type: "chart", position: 0 },
      { id: "sidebar-todo", type: "todo", position: 1 },
      { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
      { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
      { id: "sidebar-notes", type: "notes", position: 4 },
    ])
  
    const [todos, setTodos] = useState([
      {
        id: 1,
        title: "Review Design",
        description: "Review the new dashboard design",
        assignee: "Jack",
        dueDate: "2024-12-15",
        dueTime: "14:30",
      },
      {
        id: 2,
        title: "Team Meeting",
        description: "Weekly team sync",
        assignee: "Jack",
        dueDate: "2024-12-16",
        dueTime: "10:00",
      },
    ])
  
    const memberTypes = {
      "Studios Acquired": {
        data: [
          [30, 45, 60, 75, 90, 105, 120, 135, 150],
          [25, 40, 55, 70, 85, 100, 115, 130, 145],
        ],
        growth: "12%",
        title: "Studios Acquired",
      },
      Finance: {
        data: [
          [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
          [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
        ],
        growth: "8%",
        title: "Finance Statistics",
      },
      Leads: {
        data: [
          [120, 150, 180, 210, 240, 270, 300, 330, 360],
          [100, 130, 160, 190, 220, 250, 280, 310, 340],
        ],
        growth: "15%",
        title: "Leads Statistics",
      },
      Franchises: {
        data: [
          [120, 150, 180, 210, 240, 270, 300, 330, 360],
          [100, 130, 160, 190, 220, 250, 280, 310, 340],
        ],
        growth: "10%",
        title: "Franchises Acquired",
      },
    }
  
    const [customLinks, setCustomLinks] = useState([
      {
        id: "link1",
        url: "https://fitness-web-kappa.vercel.app/",
        title: "Timathy Fitness Town",
      },
      { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
      { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
    ])
  
    const [expiringContracts, setExpiringContracts] = useState([
      {
        id: 1,
        title: "Oxygen Gym Membership",
        expiryDate: "June 30, 2025",
        status: "Expiring Soon",
      },
      {
        id: 2,
        title: "Timathy Fitness Equipment Lease",
        expiryDate: "July 15, 2025",
        status: "Expiring Soon",
      },
      {
        id: 3,
        title: "Studio Space Rental",
        expiryDate: "August 5, 2025",
        status: "Expiring Soon",
      },
      {
        id: 4,
        title: "Insurance Policy",
        expiryDate: "September 10, 2025",
        status: "Expiring Soon",
      },
      {
        id: 5,
        title: "Software License",
        expiryDate: "October 20, 2025",
        status: "Expiring Soon",
      },
    ])
  
    // -------------- end of sidebar logic
  

  const handleOpenTagsModal = (task) => {
    setTagsModalTask(task)
  }
  const handleOpenCalendarModal = (taskId, currentDate = "", currentTime = "", currentReminder = "", currentRepeat = "") => {
    setCalendarModal({
      isOpen: true,
      taskId,
      initialDate: currentDate,
      initialTime: currentTime,
      initialReminder: currentReminder,
      initialRepeat: currentRepeat
    });
  };

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

  const createNextRepeatTasks = (config, completedTask) => {
    const { originalTask, repeatOptions } = config;
    let tasksCreated = 0;

    try {
      // Calculate how many occurrences should exist based on the original task
      const allRepeatTasks = tasks.filter(t =>
        t.title === originalTask.title &&
        t.id !== originalTask.id
      );

      const currentOccurrences = allRepeatTasks.length;
      const maxOccurrences = repeatOptions.occurrences || Infinity;

      // If we haven't reached the occurrence limit, create the next task
      if (currentOccurrences < maxOccurrences - 1) { // -1 because original task counts as first occurrence
        const lastTaskDate = new Date(completedTask.dueDate);
        let nextDate = new Date(lastTaskDate);

        // Calculate next occurrence based on repeat frequency
        if (repeatOptions.frequency === "daily") {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (repeatOptions.frequency === "weekly") {
          nextDate.setDate(nextDate.getDate() + 7);

          // For weekly repeats with specific days, find the next selected day
          if (repeatOptions.repeatDays && repeatOptions.repeatDays.length > 0) {
            const currentDay = nextDate.getDay();
            const nextDays = repeatOptions.repeatDays.filter(day => day > currentDay);
            const daysToAdd = nextDays.length > 0
              ? nextDays[0] - currentDay
              : 7 - currentDay + repeatOptions.repeatDays[0];
            nextDate.setDate(nextDate.getDate() + daysToAdd);
          }
        } else if (repeatOptions.frequency === "monthly") {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }

        // Check end date condition
        if (repeatOptions.endDate && nextDate > new Date(repeatOptions.endDate)) {
          return tasksCreated;
        }

        // Check if this repeat task already exists
        const newDueDate = nextDate.toISOString().split('T')[0];
        const taskAlreadyExists = tasks.some(t =>
          t.title === originalTask.title &&
          t.dueDate === newDueDate &&
          t.status === "ongoing"
        );

        if (!taskAlreadyExists) {
          const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
          const newTask = {
            ...originalTask,
            id: newId,
            dueDate: newDueDate,
            isPinned: false,
            dragVersion: 0,
            status: "ongoing",
            createdAt: new Date().toISOString()
          };

          setTasks(prevTasks => [...prevTasks, newTask]);
          tasksCreated = 1;
          toast.success(`New repeat task created for ${originalTask.title}`);
        }
      }
    } catch (error) {
      console.error("Error creating repeat task:", error);
      toast.error("Error creating repeat task");
    }

    return tasksCreated;
  };

    // Add this useEffect to handle task completion and create repeat tasks
    useEffect(() => {
      const now = new Date();
      const updatedRepeatConfigs = { ...repeatConfigs };
      let tasksUpdated = false;
  
      Object.entries(repeatConfigs).forEach(([taskId, config]) => {
        const task = tasks.find(t => t.id === parseInt(taskId));
  
        // Skip if task doesn't exist or isn't completed
        if (!task || task.status !== "completed") return;
  
        // Check if we need to create repeat tasks
        const lastCompleted = config.lastCompletedDate ? new Date(config.lastCompletedDate) : null;
        const taskCompletedDate = new Date(task.updatedAt || now);
  
        // Only process if this completion is newer than our last processing
        if (!lastCompleted || lastCompleted < taskCompletedDate) {
          const createdTasks = createNextRepeatTasks(config, task);
  
          if (createdTasks > 0) {
            // Update the last completed date
            updatedRepeatConfigs[taskId] = {
              ...config,
              lastCompletedDate: taskCompletedDate.toISOString(),
              occurrencesCreated: (config.occurrencesCreated || 0) + createdTasks
            };
            tasksUpdated = true;
          }
        }
      });
  
      if (tasksUpdated) {
        setRepeatConfigs(updatedRepeatConfigs);
      }
    }, [tasks]);

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, isPinned: false, dragVersion: 0 } : task,
      ),
    )
    toast.success(`Task status changed to ${newStatus}!`)
  }

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
        title: newTaskInput,
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
      setSelectedTags([])
      toast.success("Task added successfully!")
    }
  }

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
          originalTask: { ...taskToRepeat },
          repeatOptions: repeatOptions,
          lastCompletedDate: null,
          occurrencesCreated: 0
        }
      }));

      toast.success(`Repeat settings saved! Task will repeat ${repeatOptions.occurrences || 'until'} ${repeatOptions.endDate || 'indefinitely'}.`);
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

  const handleCalendarSave = (calendarData) => {
    if (calendarModal.taskId) {
      // Update existing task
      const taskToUpdate = tasks.find(t => t.id === calendarModal.taskId);
      const updatedTask = {
        ...taskToUpdate,
        dueDate: calendarData.date,
        dueTime: calendarData.time,
        reminder: calendarData.reminder,
        repeat: calendarData.repeat
      };

      handleTaskUpdate(updatedTask);
      toast.success("Task date/time updated successfully!");
    }

    setCalendarModal({
      isOpen: false,
      taskId: null,
      initialDate: "",
      initialTime: "",
      initialReminder: "",
      initialRepeat: ""
    });
  };

  const handleCalendarClose = () => {
    setCalendarModal({
      isOpen: false,
      taskId: null,
      initialDate: "",
      initialTime: "",
      initialReminder: "",
      initialRepeat: ""
    });
  };

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
                      onOpenTagsModal={handleOpenTagsModal}
                      onOpenCalendarModal={handleOpenCalendarModal}
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

  const [selectedTags, setSelectedTags] = useState([])



  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
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
                 {/* <div onClick={toggleRightSidebar} className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
                            <IoIosMenu size={26}/>
                          </div> */}
                            <img
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="h-5 w-5  cursor-pointer"
                  src="/icon.svg"
                  alt=""
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="relative flex items-center flex-grow bg-[#101010] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none">
                  <Plus size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTaskFromInput()
                      }
                    }}
                    className="flex-grow bg-transparent text-sm outline-none placeholder-gray-500"
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
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                            <span style={{ color: tag.color }}>{tag.name}</span>
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

<CalendarModal
          isOpen={calendarModal.isOpen}
          onClose={handleCalendarClose}
          onSave={handleCalendarSave}
          initialDate={calendarModal.initialDate}
          initialTime={calendarModal.initialTime}
          initialReminder={calendarModal.initialReminder}
          initialRepeat={calendarModal.initialRepeat}
        />

          {/* sidebar related modals */}

          <Sidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          widgets={sidebarWidgets}
          setWidgets={setSidebarWidgets}
          isEditing={isEditing}
          todos={todos}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
          expiringContracts={expiringContracts}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          onAddWidget={() => setIsRightWidgetModalOpen(true)}
          updateCustomLink={updateCustomLink}
          removeCustomLink={removeCustomLink}
          editingLink={editingLink}
          setEditingLink={setEditingLink}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
          onToggleEditing={()=>{ setIsEditing(!isEditing);}} // Add this line
          setTodos={setTodos}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
          onConfirm={confirmRemoveLink}
          title="Delete Website Link"
          message="Are you sure you want to delete this website link? This action cannot be undone."
        />

        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddSidebarWidget}
          getWidgetStatus={getSidebarWidgetStatus}
          widgetArea="sidebar"
        />

        {editingLink && (
          <WebsiteLinkModal
            link={editingLink}
            onClose={() => setEditingLink(null)}
            updateCustomLink={updateCustomLink}
            setCustomLinks={setCustomLinks}
          />
        )}
      </div>
    </>
  )
}
