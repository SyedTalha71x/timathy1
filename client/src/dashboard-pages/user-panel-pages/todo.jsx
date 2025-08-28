/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react"
import { Plus, Calendar, Tag, ChevronDown, Filter, X, Users } from "lucide-react"
import AddTaskModal from "../../components/task-components/add-task-modal"
import EditTaskModal from "../../components/task-components/edit-task-modal"
import TaskItem from "../../components/task-components/task-item"
import RepeatTaskModal from "../../components/task-components/repeat-task-modal"
import { IoIosMenu } from "react-icons/io"
import { SidebarArea } from "../../components/custom-sidebar"
import Draggable from "react-draggable"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/avatar.png"
import Rectangle1 from "../../../public/Rectangle 1.png"


export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [sortOption, setSortOption] = useState("dueDate-asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState(null)

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false)
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)

  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF5252")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const [newTaskInput, setNewTaskInput] = useState("")
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false)
  const [selectedTaskForRepeat, setSelectedTaskForRepeat] = useState(null)

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      assignees: ["Jack"],
      roles: "Trainer",
      tags: ["Important", "Urgent"],
      status: "ongoing",
      category: "member",
      dueDate: "2023-06-20",
      isPinned: false,
      dueTime: "10:00 AM",
      dragVersion: 0,
    },
    {
      id: 2,
      title: "Task 2",
      assignees: ["Jane"],
      roles: "Manager",
      tags: ["Meeting"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-25",
      isPinned: false,
      dueTime: "02:00 PM",
      dragVersion: 0,
    },
    {
      id: 3,
      title: "Reply to client inquiry",
      assignees: ["Sarah"],
      roles: "Support",
      tags: ["Client", "Important"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-22",
      isPinned: false,
      dueTime: "11:30 AM",
      dragVersion: 0,
    },
    {
      id: 4,
      title: "Schedule member onboarding",
      assignees: ["Mike"],
      roles: "Trainer",
      tags: ["Onboarding"],
      status: "completed",
      category: "member",
      dueDate: "2023-06-18",
      isPinned: false,
      dueTime: "09:00 AM",
      dragVersion: 0,
    },
    {
      id: 5,
      title: "Staff meeting preparation",
      assignees: ["Alex"],
      roles: "Manager",
      tags: ["Meeting"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-24",
      isPinned: false,
      dueTime: "03:00 PM",
      dragVersion: 0,
    },
    {
      id: 6,
      title: "Cancelled Task Example",
      assignees: ["John"],
      roles: "Admin",
      tags: ["Urgent"],
      status: "canceled",
      category: "staff",
      dueDate: "2023-06-28",
      isPinned: false,
      dueTime: "01:00 PM",
      dragVersion: 0,
    },
  ])

  const [configuredTags, setConfiguredTags] = useState([
    { id: 1, name: "Important", color: "#FF5252" },
    { id: 2, name: "Urgent", color: "#FFD740" },
    { id: 3, name: "Meeting", color: "#64FFDA" },
    { id: 4, name: "Client", color: "#448AFF" },
    { id: 5, name: "Onboarding", color: "#B388FF" },
    { id: 6, name: "Personal", color: "#FF80AB" },
    { id: 7, name: "Work", color: "#4CAF50" },
    { id: 8, name: "Study", color: "#FFC107" },
  ])

  const [availableAssignees] = useState(["Jack", "Jane", "John", "Jessica", "Mike", "Sarah", "Alex"])
  const [availableRoles] = useState(["Trainer", "Manager", "Developer", "Designer", "Admin", "Support"])

  const [columns, setColumns] = useState([
    { id: "ongoing", title: "Ongoing", color: "#f59e0b" },
    { id: "completed", title: "Completed", color: "#10b981" },
    { id: "canceled", title: "Canceled", color: "#ef4444" },
  ])

  const columnRefs = useRef({})

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

  const handleAddTask = (newTask) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTask, id: newId, status: "ongoing", isPinned: false, dragVersion: 0 },
    ])
    toast.success("Task added successfully!")
  }

  const handleAddTaskFromInput = () => {
    if (newTaskInput.trim() !== "") {
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
      const newTask = {
        id: newId,
        title: newTaskInput,
        assignees: [],
        roles: [],
        tags: [],
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
    setIsEditModalOpen(true)
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
      const generated = []
      const currentIterationDate = new Date(taskToRepeat.dueDate)
      let count = 0

      while (count < 100) {
        if (repeatOptions.endDate && currentIterationDate > new Date(repeatOptions.endDate)) {
          break
        }
        if (repeatOptions.occurrences && count >= repeatOptions.occurrences) {
          break
        }

        let shouldAdd = false
        if (repeatOptions.frequency === "daily") {
          shouldAdd = true
        } else if (repeatOptions.frequency === "weekly") {
          if (repeatOptions.repeatDays.includes(currentIterationDate.getDay())) {
            shouldAdd = true
          }
        }

        if (shouldAdd) {
          const newId =
            tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 + generated.length : 1 + generated.length
          generated.push({
            ...taskToRepeat,
            id: newId,
            dueDate: currentIterationDate.toISOString().split("T")[0],
            isPinned: false,
            dragVersion: 0,
            status: "ongoing",
          })
          count++
        }

        if (repeatOptions.frequency === "daily") {
          currentIterationDate.setDate(currentIterationDate.getDate() + 1)
        } else if (repeatOptions.frequency === "weekly") {
          currentIterationDate.setDate(currentIterationDate.getDate() + 1)
        } else if (repeatOptions.frequency === "monthly") {
          currentIterationDate.setMonth(currentIterationDate.getMonth() + 1)
        } else {
          currentIterationDate.setDate(currentIterationDate.getDate() + 1)
        }
      }

      if (generated.length > 0) {
        setTasks((prevTasks) => [...prevTasks, ...generated])
        toast.success(`${generated.length} new tasks generated based on repeat settings!`)
      } else {
        toast.error("No tasks generated. Check repeat settings.")
      }
    } catch (error) {
      toast.error("Error generating repeated tasks. Please try again.")
      console.error("Repeat task error:", error)
    }

    setIsRepeatModalOpen(false)
    setSelectedTaskForRepeat(null)
  }

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

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const handleDateClick = (day) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      setTempDate(dateStr)
    }

    const handleOK = () => {
      setSelectedDate(tempDate)
      setSelectedTime(tempTime)
      setIsCalendarOpen(false)
    }

    const handleClear = () => {
      setTempDate("")
      setTempTime("")
      setSelectedDate("")
      setSelectedTime("")
      setIsCalendarOpen(false)
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-4 w-80">
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
                className={`p-2 text-sm rounded hover:bg-gray-600 ${
                  isSelected ? "bg-blue-600 text-white" : "text-white"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">Time:</span>
            <input
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">Reminder:</span>
            <select className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm">
              <option>None</option>
              <option>5 minutes before</option>
              <option>15 minutes before</option>
              <option>1 hour before</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">Repeat:</span>
            <select className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm">
              <option>Never</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
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

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    console.log("Redirecting to communication page")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  return (
    <div
      className={`flex flex-col lg:flex-row rounded-3xl transition-all duration-500 bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden  ${
        isRightSidebarOpen
          ? "lg:mr-96 md:mr-96 sm:mr-96" // Adjust right margin when sidebar is open on larger screens
          : "mr-0" // No margin when closed
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-white">To-Do</h1>
              <div className="flex items-center justify-end">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={28}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md p-1"
                />
              </div>
            </div>

            <SidebarArea
              isOpen={isRightSidebarOpen}
              onClose={closeSidebar}
              communications={communications}
              todos={todos}
              birthdays={birthdays}
              customLinks={customLinks}
              setCustomLinks={setCustomLinks}
              redirectToCommunication={redirectToCommunication}
              redirectToTodos={redirectToTodos}
              toggleDropdown={toggleDropdown}
              openDropdownIndex={openDropdownIndex}
              setEditingLink={setEditingLink}
            />

            {/* Overlay for mobile screens only */}
            {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

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
                  {/* <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                    className="text-gray-400 hover:text-white ml-2 no-drag p-1"
                    title="Add tags"
                  >
                    <Tag size={18} />
                  </button> */}
                  {isTagDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-3 w-48">
                      <h4 className="text-white text-sm font-medium mb-2">Add Tags</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {configuredTags.map((tag) => (
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
                        ))}
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
                    <div className="absolute top-full right-0 mt-2 bg-[#2F2F2F] rounded-xl shadow-lg z-50 p-3 w-48">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-white text-sm font-medium mb-2">Assign Task</h4>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {availableAssignees.map((assignee) => (
                              <button
                                key={assignee}
                                className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
                                onClick={() => {
                                  setIsAssignDropdownOpen(false)
                                }}
                              >
                                <Users size={14} />
                                {assignee}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-medium mb-2">Add Tags</h4>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {configuredTags.slice(0, 3).map((tag) => (
                              <button
                                key={tag.id}
                                className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-600 rounded"
                                onClick={() => {
                                  setIsAssignDropdownOpen(false)
                                }}
                              >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
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
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${
                            sortOption === "dueDate-asc" ? "bg-[#3F3F3F]" : ""
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
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${
                            sortOption === "dueDate-desc" ? "bg-[#3F3F3F]" : ""
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
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${
                            sortOption === "tag-asc" ? "bg-[#3F3F3F]" : ""
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
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#3F3F3F] rounded-lg ${
                            sortOption === "tag-desc" ? "bg-[#3F3F3F]" : ""
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

      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
          configuredTags={configuredTags}
          initialTask={selectedTask}
        />
      )}

      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          onUpdateTask={handleTaskUpdate}
          configuredTags={configuredTags}
        />
      )}

      {isDeleteModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-medium mb-2">Confirm Delete</h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete the task "{selectedTask.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedTask(null)
                }}
                className="bg-[#2F2F2F] text-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="bg-red-600 text-sm text-white px-4 py-2 rounded-xl hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
}
