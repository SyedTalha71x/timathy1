"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react"
import { Plus, Calendar, Tag, ChevronDown, Filter } from "lucide-react"
import AddTaskModal from "../components/task-components/add-task-modal"
import EditTaskModal from "../components/task-components/edit-task-modal" // Import EditTaskModal
import TaskItem from "../components/task-components/task-item"
import { IoIosMenu } from "react-icons/io"
import { SidebarArea } from "../components/custom-sidebar"
import Draggable from "react-draggable"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/avatar.png" // Original import preserved
import Rectangle1 from "../../public/Rectangle 1.png" // Original import preserved

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [sortOption, setSortOption] = useState("dueDate-asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

  // State for modals that were previously in TaskItem
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null) // To hold the task being edited/deleted

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "This is a short description for Task 1",
      assignees: ["Jack"],
      roles: "Trainer",
      tags: ["Important", "Urgent"],
      status: "ongoing",
      category: "member",
      dueDate: "2023-06-20",
      isPinned: false,
      dueTime: "10:00 AM",
      dragVersion: 0, // Added for drag & drop reset
    },
    {
      id: 2,
      title: "Task 2",
      description: "This is a short description for Task 2",
      assignees: ["Jane"],
      roles: "Manager",
      tags: ["Meeting"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-25",
      isPinned: false,
      dueTime: "02:00 PM",
      dragVersion: 0, // Added for drag & drop reset
    },
    {
      id: 3,
      title: "Reply to client inquiry",
      description: "Send response to client about pricing",
      assignees: ["Sarah"],
      roles: "Support",
      tags: ["Client", "Important"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-22",
      isPinned: false,
      dueTime: "11:30 AM",
      dragVersion: 0, // Added for drag & drop reset
    },
    {
      id: 4,
      title: "Schedule member onboarding",
      description: "Set up onboarding session for new member",
      assignees: ["Mike"],
      roles: "Trainer",
      tags: ["Onboarding"],
      status: "completed",
      category: "member",
      dueDate: "2023-06-18",
      isPinned: false,
      dueTime: "09:00 AM",
      dragVersion: 0, // Added for drag & drop reset
    },
    {
      id: 5,
      title: "Staff meeting preparation",
      description: "Prepare agenda for weekly staff meeting",
      assignees: ["Alex"],
      roles: "Manager",
      tags: ["Meeting"],
      status: "ongoing",
      category: "staff",
      dueDate: "2023-06-24",
      isPinned: false,
      dueTime: "03:00 PM",
      dragVersion: 0, // Added for drag & drop reset
    },
    {
      id: 6,
      title: "Cancelled Task Example",
      description: "This task was cancelled due to unforeseen circumstances.",
      assignees: ["John"],
      roles: "Admin",
      tags: ["Urgent"],
      status: "canceled",
      category: "staff",
      dueDate: "2023-06-28",
      isPinned: false,
      dueTime: "01:00 PM",
      dragVersion: 0, // Added for drag & drop reset
    },
  ])

  const [columns, setColumns] = useState([
    { id: "ongoing", title: "Ongoing", color: "#3b82f6" }, // Blue
    { id: "completed", title: "Completed", color: "#10b981" }, // Green
    { id: "canceled", title: "Canceled", color: "#ef4444" }, // Red
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

  const handleTaskPinToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isPinned: !task.isPinned, dragVersion: 0 } : task)),
    )
    const taskName = tasks.find((t) => t.id === taskId)?.title || "Task"
    toast.success(`${taskName} pin status updated!`)
  }

  // Handlers for opening/closing modals from TaskItem
  const handleEditRequest = (task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const handleDeleteRequest = (taskId) => {
    setSelectedTask(tasks.find((t) => t.id === taskId)) // Set selected task for delete confirmation
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteTask = () => {
    if (selectedTask) {
      handleTaskRemove(selectedTask.id)
      setIsDeleteModalOpen(false)
      setSelectedTask(null)
    }
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
            // Successfully moved to a new column
            toast.success(`Task moved to ${columns.find((c) => c.id === targetColumnId).title}`)
            return { ...t, status: targetColumnId, isPinned: false, dragVersion: 0 } // Reset dragVersion on successful move
          } else {
            // Not moved to a new column, or dropped back in same column
            // Increment dragVersion to force Draggable to remount and reset position
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
      // Pinned tasks first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // Then by existing sort option
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

  // Column component (merged back into TodoApp.jsx)
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
  }) => {
    const taskItemRefs = useRef({}) // Use useRef for task item refs
    const [draggingTaskId, setDraggingTaskId] = useState(null) // State to track which task is being dragged
  
    return (
      <div
        ref={columnRef}
        id={`column-${id}`}
        className="bg-[#141414] rounded-xl overflow-visible h-full flex flex-col relative"
        data-column-id={id}
        style={{
          // Ensure columns don't interfere with dragging
          zIndex: draggingTaskId ? 1 : 'auto'
        }}
      >
        <div className="p-3 flex justify-between items-center" style={{ backgroundColor: `${color}20` }}>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
            <h3 className="font-medium text-white text-sm">{title}</h3>
          </div>
        </div>
        <div className="p-3 flex-1 min-h-[400px] relative">
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
              // Create a ref for each task item
              if (!taskItemRefs.current[task.id]) {
                taskItemRefs.current[task.id] = React.createRef()
              }
              return (
                <Draggable
                  key={`${task.id}-${task.dragVersion}`} // Use dragVersion in key to force remount on revert
                  nodeRef={taskItemRefs.current[task.id]} // Attach the ref to the Draggable's child
                  onStart={() => setDraggingTaskId(task.id)} // Set dragging task ID
                  onStop={(e, data) => {
                    setDraggingTaskId(null) // Clear dragging task ID
                    onDragStop(e, data, task, id)
                  }}
                  cancel=".no-drag" // Elements with this class won't initiate drag
                  // Remove bounds to allow free dragging across the entire screen
                  defaultPosition={{ x: 0, y: 0 }}
                >
                  <div 
                    ref={taskItemRefs.current[task.id]} 
                    className={`cursor-grab mb-3 ${draggingTaskId === task.id ? 'z-[9999] relative' : ''}`}
                    style={{
                      // Ensure dragged item is above everything
                      zIndex: draggingTaskId === task.id ? 9999 : 'auto',
                      position: draggingTaskId === task.id ? 'relative' : 'static'
                    }}
                  >
                    <TaskItem
                      task={task}
                      onStatusChange={onTaskStatusChange}
                      onUpdate={onTaskUpdate}
                      onPinToggle={onTaskPinToggle}
                      onRemove={onTaskRemove}
                      onEditRequest={onEditRequest} // Pass the new prop
                      onDeleteRequest={onDeleteRequest} // Pass the new prop
                      isDragging={draggingTaskId === task.id} // Pass isDragging prop
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
      avatar: Rectangle1, // Original import used
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1, // Original import used
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar, // Original import used
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar, // Original import used
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
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
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
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">To-Do</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#FF843E] cursor-pointer text-white px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="open_sans_font">Add task</span>
                </button>
                <div className="">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
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
            {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}></div>}
            {/* Sort Dropdown */}
            <div className="relative sort-dropdown self-end">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2F2F2F] rounded-xl text-sm"
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
                onEditRequest={handleEditRequest} // Pass down the new prop
                onDeleteRequest={handleDeleteRequest} // Pass down the new prop
              />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />}
      {/* Edit Task Modal (now controlled by TodoApp) */}
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          onUpdateTask={handleTaskUpdate}
        />
      )}
      {/* Delete Confirmation Modal (now controlled by TodoApp) */}
      {isDeleteModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-medium mb-2">Confirm Delete</h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete the task &quot;{selectedTask.title}&quot;? This action cannot be undone.
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
    </div>
  )
}
