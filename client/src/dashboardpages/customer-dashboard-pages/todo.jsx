/* eslint-disable no-unused-vars */
import { useState } from "react"
import { X, Plus, Calendar, Tag, ChevronDown, Filter, Tags } from "lucide-react"
import AddTaskModal from "../../components/customer-dashboard/add-task-model"
import TaskItem from "../../components/customer-dashboard/task-item"
import Notification from "../../components/notification"
import { ColorPicker } from "antd"

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ongoing")
  const [sortOption, setSortOption] = useState("dueDate-asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF5252")
  const [allTags, setAllTags] = useState([
    { id: 1, name: "Important", color: "#FF5252" },
    { id: 2, name: "Urgent", color: "#FFD740" },
    { id: 3, name: "Meeting", color: "#64FFDA" },
    { id: 4, name: "Client", color: "#448AFF" },
    { id: 5, name: "Onboarding", color: "#B388FF" },
  ])
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
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "completed",
      message: "Task 'Prepare weekly report' has been completed",
    },
    {
      id: 2,
      type: "ongoing",
      message: "New task 'Client meeting' has been assigned to you",
    },
    {
      id: 3,
      type: "canceled",
      message: "Task 'Review project proposal' has been canceled",
    },
  ])

  // Function to get tag color by name
  const getTagColor = (tagName) => {
    const tag = allTags.find((t) => t.name === tagName)
    return tag ? tag.color : "#FFFFFF" // Default to white if tag not found
  }

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest(".status-dropdown")) {
  //       setIsStatusDropdownOpen(false)
  //     }
  //     if (!event.target.closest(".sort-dropdown")) {
  //       setIsSortDropdownOpen(false)
  //     }
  //     if (!event.target.closest(".tag-manager")) {
  //       setIsTagManagerOpen(false)
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside)
  //   return () => document.removeEventListener("mousedown", handleClickOutside)
  // }, [])

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskRemove = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask])
  }

  // Tag management functions
  const addTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: newTagColor,
      }
      setAllTags([...allTags, newTag])
      setNewTagName("")
      setNewTagColor("#FF5252") // Reset to default color
    }
  }

  const deleteTag = (tagId) => {
    setAllTags(allTags.filter((tag) => tag.id !== tagId))
    // Remove this tag from all tasks
    setTasks(
      tasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => {
          // Handle both string tags (for old format) and object tags
          if (typeof tag === "string") {
            const tagToDelete = allTags.find((t) => t.id === tagId)
            return tag !== tagToDelete?.name
          }
          return tag.id !== tagId
        }),
      })),
    )
  }

  // Filter tasks by status
  const filteredTasks = tasks.filter((task) => task.status === activeFilter)

  // Sort tasks based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [criteria, direction] = sortOption.split("-")

    if (criteria === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return direction === "asc" ? dateA - dateB : dateB - dateA
    } else if (criteria === "tag") {
      // Sort by first tag alphabetically
      const tagA = a.tags && a.tags.length > 0 ? a.tags[0].toLowerCase() : ""
      const tagB = b.tags && b.tags.length > 0 ? b.tags[0].toLowerCase() : ""
      return direction === "asc" ? tagA.localeCompare(tagB) : tagB.localeCompare(tagA)
    }
    return 0
  })

  return (
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white text-base relative min-h-screen overflow-hidden">
      <div className="flex-1 p-4 sm:p-6">
        <div className="pb-16 sm:pb-24 lg:pb-36">
          {/* Header with title, filter tabs, and add button */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex md:justify-between md:flex-row flex-col justify-start  md:items-center items-start  gap-2">
              <h1 className="text-2xl font-bold text-white">To-Do</h1>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsTagManagerOpen(true)}
                  className="bg-[#2F2F2F] cursor-pointer text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  <Tags size={18} />
                  <span className="open_sans_font">Manage Tags</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#FF843E] cursor-pointer text-white px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="open_sans_font">Add task</span>
                </button>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              {/* Status Tabs */}
              <div className="flex gap-1 items-center">
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${
                    activeFilter === "ongoing"
                      ? "bg-white text-black"
                      : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                  } rounded-xl`}
                  onClick={() => setActiveFilter("ongoing")}
                >
                  Ongoing
                </button>
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${
                    activeFilter === "completed"
                      ? "bg-white text-black"
                      : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                  } rounded-xl`}
                  onClick={() => setActiveFilter("completed")}
                >
                  Completed
                </button>
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${
                    activeFilter === "canceled"
                      ? "bg-white text-black"
                      : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                  } rounded-xl`}
                  onClick={() => setActiveFilter("canceled")}
                >
                  Canceled
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative sort-dropdown">
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
          </div>

          <div className="bg-black rounded-xl open_sans_font p-3 mt-4">
            {sortedTasks.length > 0 ? (
              <div className="space-y-4">
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleTaskStatusChange}
                    onUpdate={handleTaskUpdate}
                    onRemove={handleTaskRemove}
                    getTagColor={getTagColor}
                    allTags={allTags}
                    onAddTag={(taskId, tagName) => {
                      const updatedTasks = tasks.map((task) =>
                        task.id === taskId ? { ...task, tags: [...(task.tags || []), tagName] } : task,
                      )
                      setTasks(updatedTasks)
                    }}
                    onRemoveTag={(taskId, tagToRemove) => {
                      const updatedTasks = tasks.map((task) =>
                        task.id === taskId ? { ...task, tags: task.tags.filter((tag) => tag !== tagToRemove) } : task,
                      )
                      setTasks(updatedTasks)
                    }}
                    onUpdateDueDate={(taskId, newDate, newTime) => {
                      const updatedTasks = tasks.map((task) =>
                        task.id === taskId ? { ...task, dueDate: newDate, dueTime: newTime } : task,
                      )
                      setTasks(updatedTasks)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">No {activeFilter} tasks found</div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed lg:static inset-y-0 right-0 w-[320px] bg-[#181818] p-6 transform transition-transform duration-500 ease-in-out ${
          isNotificationOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } z-40`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl oxanium_font text-white">Notification</h2>
          <button onClick={() => setIsNotificationOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} onRemove={removeNotification} />
          ))}
        </div>
      </div>

      {/* Tag Manager Modal */}
      {isTagManagerOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 p-2 flex items-center justify-center z-50">
          <div className="tag-manager bg-[#181818] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Tags</h2>
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
                  className="w-full bg-[#1C1C1C] text-sm text-white px-4 py-2 rounded-lg"
                />
                <div className="flex text-sm items-center gap-3">
                  <span>Color:</span>
                  <ColorPicker
                    value={newTagColor}
                    onChange={(color) => setNewTagColor(color.toHexString())}
                    showText
                    className="custom-color-picker white-text"
                    presets={[
                      {                        
                        colors: [
                          "#FF5252",
                          "#FFD740",
                          "#64FFDA",
                          "#448AFF",
                          "#B388FF",
                          "#FF80AB",
                          "#000000",
                          "#FFFFFF",
                        ],
                      },
                    ]}
                  />
                </div>
                <button
                  onClick={addTag}
                  className="bg-[#FF843E] text-white text-sm px-4 py-2 rounded-lg mt-2"
                  disabled={!newTagName.trim()}
                >
                  Add Tag
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto text-sm">
                {allTags.length > 0 ? (
                  <div className="space-y-2">
                    {allTags.map((tag) => (
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
                className="bg-[#FF843E] text-white px-6 py-2 text-sm rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddTaskModal onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} allTags={allTags} />
      )}
    </div>
  )
}
