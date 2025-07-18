/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { X, Plus, Calendar, Tag, ChevronDown, Filter } from "lucide-react"
import AddTaskModal from "../components/task-components/add-task-modal"
import TaskItem from "../components/task-components/task-item"
import { IoIosMenu } from "react-icons/io"

import Avatar from "../../public/avatar.png"
import Rectangle1 from "../../public/Rectangle 1.png"
import { useNavigate } from "react-router-dom"
import { SidebarArea } from "../components/custom-sidebar"

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ongoing")
  const [sortOption, setSortOption] = useState("dueDate-asc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const navigate = useNavigate();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

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

  const filteredTasks = tasks.filter((task) => task.status === activeFilter)

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
      navigate("/dashboard/communication")
    }
  
    const redirectToTodos = () => {
      console.log("Redirecting to todos page")
      navigate("/dashboard/to-do")
    }
  
    const toggleDropdown = (index) => {
      setOpenDropdownIndex(openDropdownIndex === index ? null : index)
    }

  return (
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
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
            
                      {isRightSidebarOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}></div>
                      )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex gap-1 items-center">
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${activeFilter === "ongoing"
                      ? "bg-white text-black"
                      : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                    } rounded-xl`}
                  onClick={() => setActiveFilter("ongoing")}
                >
                  Ongoing
                </button>
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${activeFilter === "completed"
                      ? "bg-white text-black"
                      : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                    } rounded-xl`}
                  onClick={() => setActiveFilter("completed")}
                >
                  Completed
                </button>
                <button
                  className={`md:px-4 px-2.5 py-2 text-sm ${activeFilter === "canceled"
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">No {activeFilter} tasks found</div>
            )}
          </div>
        </div>
      </div>



      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />}
    </div>
  )
}
