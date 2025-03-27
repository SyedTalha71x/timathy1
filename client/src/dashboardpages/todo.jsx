/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { X, Plus } from "lucide-react"
import AddTaskModal from "../components/add-task-modal"
import TaskItem from "../components/task-item"
import Notification from "../components/notification"

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ongoing")
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setIsStatusDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return " text-white"
      case "completed":
        return " text-white"
      case "canceled":
        return " text-white"
      default:
        return ""
    }
  }

  // Filter tasks by status only
  const filteredTasks = tasks.filter((task) => task.status === activeFilter)

  return (
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
      <div className="flex-1 p-4 sm:p-6">
        <div className="pb-16 sm:pb-24 lg:pb-36">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-4">
  <h1 className="text-xl md:text-2xl font-bold text-white oxanium_font w-full text-left">To-Do</h1>
  <div className="flex flex-col justify-end items-center md:items-end gap-3 w-full">
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-[#FF843E] cursor-pointer text-white px-4 sm:px-10 py-2 rounded-xl text-sm flex items-center gap-2 w-full md:w-auto justify-center"
    >
      <Plus size={18} />
      <span className="open_sans_font">Add task</span>
    </button>
    {/* Status Tabs */}
    <div className="flex gap-2 items-end mb-4 w-full flex-col md:flex-row md:justify-center justify-end">
      <button
        className={`px-3 sm:px-5 py-2 md:w-auto w-full text-sm ${
          activeFilter === "ongoing"
            ? "bg-white text-black"
            : "text-gray-200 border border-slate-300 hover:bg-gray-800"
        } rounded-xl`}
        onClick={() => setActiveFilter("ongoing")}
      >
        Ongoing
      </button>
      <button
        className={`px-3 sm:px-5 py-2 md:w-auto w-full text-sm ${
          activeFilter === "completed"
            ? "bg-white text-black"
            : "text-gray-200 border border-slate-300 hover:bg-gray-800"
        } rounded-xl`}
        onClick={() => setActiveFilter("completed")}
      >
        Completed
      </button>
      <button
        className={`px-3 sm:px-5 py-2  md:w-auto w-full text-sm ${
          activeFilter === "canceled"
            ? "bg-white text-black"
            : "text-gray-200 border border-slate-300 hover:bg-gray-800"
        } rounded-xl`}
        onClick={() => setActiveFilter("canceled")}
      >
        Canceled
      </button>
    </div>
  </div>
</div>

          <div className="bg-black rounded-xl open_sans_font p-3 mt-4 sm:mt-8 lg:mt-16">
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
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
              <div className="text-red-500 text-center py-4">No {activeFilter} tasks found</div>
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

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />}
    </div>
  )
}

