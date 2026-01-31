/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  X,
  ChevronDown,
  Check,
  MoreVertical,
  Users,
  Calendar,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Filter,
} from "lucide-react"
import { toast } from "react-hot-toast"
// Import from correct files - using todosTaskData for consistency with main todo page
import { todosTaskData, configuredTagsData, availableAssigneesData } from "../../../utils/studio-states/todo-states"
import TaskModal from "../../shared/to-do/task-modal"

// ============================================
// Status Configuration
// ============================================
const STATUS_CONFIG = {
  ongoing: {
    label: "Ongoing",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    textColor: "text-amber-400",
    dotColor: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    textColor: "text-green-400",
    dotColor: "bg-green-500",
  },
  canceled: {
    label: "Canceled",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    textColor: "text-red-400",
    dotColor: "bg-red-500",
  },
}

// ============================================
// Task Card Component
// ============================================
const TaskCard = ({
  task,
  configuredTags,
  onStatusChange,
  onEdit,
  onDelete,
  openDropdownId,
  setOpenDropdownId,
}) => {
  const dropdownRef = useRef(null)

  const getTagColor = (tagName) => {
    const tag = configuredTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#3F74FF"
  }

  // Format date and time together like main todo page
  const formatDateTime = () => {
    if (!task.dueDate) return null
    const date = new Date(task.dueDate)
    let display = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      display += ` • ${formattedHour}:${minutes} ${ampm}`
    }
    return display
  }

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (openDropdownId === task.id) {
          setOpenDropdownId(null)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdownId, task.id, setOpenDropdownId])

  return (
    <div
      className={`p-3 rounded-xl transition-all select-none ${
        isCompleted
          ? "bg-gray-800/50"
          : isCanceled
          ? "bg-gray-800/30"
          : "bg-[#1a1a1a] hover:bg-gray-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox / Status Indicator - matching main todo page */}
        {isCanceled ? (
          <button
            onClick={() => onStatusChange(task.id, "ongoing")}
            className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600 border border-gray-500"
            title="Canceled - Click to restore"
          >
            <X size={12} className="text-gray-400" />
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(task.id, isCompleted ? "ongoing" : "completed")}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted
                ? "bg-gray-500 border-gray-500"
                : "border-gray-500 hover:border-blue-400"
            }`}
          >
            {isCompleted && <Check size={12} className="text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Title - not selectable */}
            <p
              className={`text-sm font-medium select-none ${
                isCompleted
                  ? "text-gray-500"
                  : isCanceled
                  ? "text-gray-600 line-through italic"
                  : "text-white"
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              {task.title}
            </p>

            {/* Dropdown Menu - always visible */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdownId(openDropdownId === task.id ? null : task.id)
                }}
                className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white"
              >
                <MoreVertical size={14} />
              </button>

              {openDropdownId === task.id && (
                <div className="absolute right-0 top-6 bg-[#2F2F2F] rounded-lg shadow-lg z-50 min-w-[120px] py-1 border border-gray-700">
                  <button
                    onClick={() => {
                      onEdit(task)
                      setOpenDropdownId(null)
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  {!isCanceled && !isCompleted && (
                    <button
                      onClick={() => {
                        onStatusChange(task.id, "canceled")
                        setOpenDropdownId(null)
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDelete(task.id)
                      setOpenDropdownId(null)
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 text-red-400 flex items-center gap-2"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Meta Row: Date+Time combined, Assignees, Tags */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Date + Time combined */}
            {formatDateTime() && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  isCompleted || isCanceled
                    ? "bg-gray-800 text-gray-500"
                    : "bg-blue-900/30 text-blue-300"
                }`}
              >
                <Calendar size={10} />
                {formatDateTime()}
              </span>
            )}

            {/* Assignees Count */}
            {task.assignees && task.assignees.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  isCompleted || isCanceled
                    ? "bg-gray-800 text-gray-500"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <Users size={10} />
                {task.assignees.length}
              </span>
            )}

            {/* Tags (max 2) */}
            {task.tags &&
              task.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-0.5 rounded-md ${
                    isCompleted || isCanceled ? "bg-gray-800 text-gray-500" : "text-white"
                  }`}
                  style={{
                    backgroundColor:
                      isCompleted || isCanceled ? undefined : getTagColor(tag),
                  }}
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
// Main To-Do Widget Component
// ============================================
export default function ToDoWidget({ isSidebarEditing = false }) {
  // Use todosTaskData for consistency with main todo page
  const [todos, setTodos] = useState(todosTaskData)
  const [configuredTags] = useState(configuredTagsData)
  const [availableAssignees] = useState(availableAssigneesData)

  // UI State
  const [activeTab, setActiveTab] = useState("ongoing")
  const [selectedStaffFilter, setSelectedStaffFilter] = useState([])
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [sortBy, setSortBy] = useState("custom")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState("add") // "add" or "edit"
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // Refs
  const filterDropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Toggle staff filter
  const toggleStaffFilter = (staffId) => {
    setSelectedStaffFilter((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    )
  }

  // Sort tasks
  const sortTasks = useCallback(
    (tasksToSort) => {
      if (sortBy === "custom") {
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
        switch (sortBy) {
          case "title":
            comparison = (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase())
            break
          case "dueDate":
            comparison =
              new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31")
            break
          case "recentlyAdded":
            comparison =
              new Date(b.createdAt || "1970-01-01") - new Date(a.createdAt || "1970-01-01")
            break
          default:
            return 0
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
      return sorted
    },
    [sortBy, sortOrder]
  )

  // Get filtered and sorted tasks
  const getFilteredTasks = useCallback(
    (status) => {
      let filtered = todos.filter((task) => task.status === status)

      // Apply staff filter
      if (selectedStaffFilter.length > 0) {
        filtered = filtered.filter((task) => {
          if (!task.assignees || task.assignees.length === 0) return false
          return task.assignees.some((assignee) => {
            return selectedStaffFilter.some((staffId) => {
              const staff = availableAssignees.find((a) => a.id === staffId)
              if (!staff) return false
              const fullName = `${staff.firstName} ${staff.lastName}`
              return assignee === fullName || assignee === staff.firstName
            })
          })
        })
      }

      return sortTasks(filtered)
    },
    [todos, selectedStaffFilter, availableAssignees, sortTasks]
  )

  // Task counts
  const taskCounts = useMemo(() => {
    const applyFilter = (tasks) => {
      if (selectedStaffFilter.length === 0) return tasks
      return tasks.filter((task) => {
        if (!task.assignees || task.assignees.length === 0) return false
        return task.assignees.some((assignee) => {
          return selectedStaffFilter.some((staffId) => {
            const staff = availableAssignees.find((a) => a.id === staffId)
            if (!staff) return false
            const fullName = `${staff.firstName} ${staff.lastName}`
            return assignee === fullName || assignee === staff.firstName
          })
        })
      })
    }

    return {
      ongoing: applyFilter(todos.filter((t) => t.status === "ongoing")).length,
      completed: applyFilter(todos.filter((t) => t.status === "completed")).length,
      canceled: applyFilter(todos.filter((t) => t.status === "canceled")).length,
    }
  }, [todos, selectedStaffFilter, availableAssignees])

  // Handlers
  const handleStatusChange = (taskId, newStatus) => {
    setTodos((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, isPinned: false, updatedAt: new Date().toISOString() }
          : task
      )
    )
    toast.success(
      newStatus === "completed"
        ? "Task completed!"
        : newStatus === "canceled"
        ? "Task canceled"
        : "Task restored"
    )
  }

  const handleAddTask = (newTask) => {
    setTodos((prev) => [...prev, { ...newTask, id: Date.now(), createdAt: new Date().toISOString() }])
    toast.success("Task added successfully!")
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskModalMode("edit")
    setIsTaskModalOpen(true)
  }

  const handleUpdateTask = (updatedTask) => {
    setTodos((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast.success("Task updated!")
  }

  const handleTaskModalSave = (taskData) => {
    if (taskModalMode === "add") {
      handleAddTask(taskData)
    } else {
      handleUpdateTask(taskData)
    }
  }

  const handleDeleteTask = (taskId) => {
    setTodos((prev) => prev.filter((task) => task.id !== taskId))
    setTaskToDelete(null)
    toast.success("Task deleted!")
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  const currentTasks = getFilteredTasks(activeTab)

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold">To-Do</h2>
        <div className="flex items-center gap-2">
          {/* Staff Filter */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => !isSidebarEditing && setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              disabled={isSidebarEditing}
              className={`p-1.5 rounded-lg transition-colors ${
                selectedStaffFilter.length > 0
                  ? "bg-blue-600 text-white"
                  : "bg-black text-gray-400 hover:text-white"
              } ${isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Filter by staff"
            >
              <Filter size={14} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-8 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[180px] py-1">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-500 font-medium">Filter by Staff</p>
                </div>
                <button
                  onClick={() => setSelectedStaffFilter([])}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    selectedStaffFilter.length === 0
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  All Tasks
                </button>
                {availableAssignees.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => toggleStaffFilter(staff.id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                      selectedStaffFilter.includes(staff.id)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <UserCheck size={12} />
                    {staff.firstName} {staff.lastName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => !isSidebarEditing && setIsSortDropdownOpen(!isSortDropdownOpen)}
              disabled={isSidebarEditing}
              className={`p-1.5 bg-black rounded-lg text-gray-400 hover:text-white transition-colors ${
                isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Sort tasks"
            >
              <ArrowUpDown size={14} />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 top-8 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-500 font-medium">Sort by</p>
                </div>
                {[
                  { value: "custom", label: "Custom" },
                  { value: "title", label: "Title" },
                  { value: "dueDate", label: "Due Date" },
                  { value: "recentlyAdded", label: "Recent" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      sortBy === option.value ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <button
                      onClick={() => {
                        handleSortChange(option.value)
                        if (option.value === "custom") setIsSortDropdownOpen(false)
                      }}
                      className="flex-1 text-left"
                    >
                      {option.label}
                    </button>
                    {sortBy === option.value && option.value !== "custom" && (
                      <button
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        {sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Task Button - Orange and bigger */}
          {!isSidebarEditing && (
            <button
              onClick={() => {
                setTaskModalMode("add")
                setEditingTask(null)
                setIsTaskModalOpen(true)
              }}
              className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              title="Add task"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 p-1 bg-black rounded-xl flex-shrink-0">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === status
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
            style={{
              backgroundColor: activeTab === status ? config.bgColor : "transparent",
            }}
          >
            <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
            <span className="hidden sm:inline">{config.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === status ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              {taskCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Active Staff Filter Indicator */}
      {selectedStaffFilter.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-blue-400 flex-shrink-0">
          <UserCheck size={12} />
          <span>
            Filtered by {selectedStaffFilter.length} staff member
            {selectedStaffFilter.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelectedStaffFilter([])}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
        {currentTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            configuredTags={configuredTags}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTask}
            onDelete={(id) => setTaskToDelete(id)}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
          />
        ))}

        {/* Empty State */}
        {currentTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Check size={20} className="text-gray-600" />
            </div>
            <p className="text-sm">No {activeTab} tasks</p>
            {selectedStaffFilter.length > 0 && (
              <p className="text-xs mt-1">Try adjusting your filter</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-center pt-2 border-t border-gray-700 flex-shrink-0">
        <Link to="/dashboard/to-do" className="text-xs text-gray-400 hover:text-white transition-colors">
          View all tasks →
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (Add/Edit) */}
      {isTaskModalOpen && (
        <TaskModal
          mode={taskModalMode}
          task={taskModalMode === "edit" ? editingTask : null}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(null)
          }}
          onSave={handleTaskModalSave}
          configuredTags={configuredTags}
          availableAssignees={availableAssignees}
        />
      )}
    </div>
  )
}
