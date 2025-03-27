"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { MoreHorizontal, Tag, Calendar } from "lucide-react"
import Avatar from "../../public/image10.png"
import EditTaskModal from "./edit-task-modal"
import { Toaster, toast } from "react-hot-toast"

export default function TaskItem({ task, onStatusChange, onUpdate, onRemove }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus)
    toast.success(`Task is now ${newStatus}!`)
    setIsDropdownOpen(false)
  }

  const handleEditTask = () => {
    setIsEditModalOpen(true)
    setIsDropdownOpen(false)
  }

  const handleUpdateTask = (updatedTask) => {
    const taskWithStatus = { ...updatedTask, status: task.status }
    onUpdate(taskWithStatus)
  }

  const openDeleteConfirmation = () => {
    setIsDeleteModalOpen(true)
    setIsDropdownOpen(false)
  }

  const handleDeleteTask = () => {
    onRemove(task.id)
    setIsDeleteModalOpen(false)
  }

  // Function to get color based on status for the MoreHorizontal dots
  const getStatusIconColor = (status) => {
    switch (status) {
      case "ongoing":
        return "text-yellow-500"
      case "completed":
        return "text-green-500"
      case "canceled":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }


  // Format datetime display
  const formatDateTime = () => {
    let display = ""
    if (task.dueDate) {
      display += task.dueDate
    }
    if (task.dueTime) {
      display += task.dueDate ? ` @ ${task.dueTime}` : task.dueTime
    }
    return display || "No due date"
  }

  return (
    <>
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
      <div className="bg-[#161616] rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {task.status !== "canceled" && (
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleStatusChange(task.status === "completed" ? "ongoing" : "completed")}
                  className="mt-1 form-checkbox h-4 w-4 cursor-pointer text-[#FF843E] rounded-full border-gray-300 focus:ring-[#FF843E]"
                />
              )}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium text-sm">{task.title}</h3>
                </div>
                <p className="text-gray-400 text-xs mt-1">{task.description}</p>
              </div>
            </div>
            <div className="flex relative">
              <div className="lg:flex flex-col hidden md:flex-row gap-2">
                {task.assignees && task.assignees.length > 0 ? (
                  <div className="bg-[#3F74FF] text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 w-full justify-center">
                    <img src={Avatar || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
                    <span className="truncate">{task.assignees.join(", ")}</span>
                  </div>
                ) : task.roles && task.roles.length > 0 ? (
                  <div className="bg-[#3F74FF] text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 w-full justify-center">
                    <img src={Avatar || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
                    <span className="truncate">{task.roles.join(", ")}</span>
                  </div>
                ) : null}

                {/* Date and time button */}
                <button className="bg-[#2F2F2F] text-gray-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 w-full justify-center">
                  <Calendar size={12} />
                  <span className="truncate">{formatDateTime()}</span>
                </button>
              </div>
              <div className="relative">
                <button onClick={toggleDropdown} className={`hover:text-white p-1`}>
                  <MoreHorizontal size={18} className="cursor-pointer" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-8 w-48 bg-[#2F2F2F] rounded-xl shadow-lg z-50 border border-gray-700">
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                      onClick={handleEditTask}
                    >
                      Edit Task
                    </button>
                    {task.status !== "canceled" && (
                      <button
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-700 rounded-b-xl"
                        onClick={() => handleStatusChange("canceled")}
                      >
                        Cancel Task
                      </button>
                    )}
                    {task.status === "canceled" && (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-xs text-yellow-500 hover:bg-gray-700"
                          onClick={() => handleStatusChange("ongoing")}
                        >
                          Move to Ongoing
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs text-green-500 hover:bg-gray-700"
                          onClick={() => handleStatusChange("completed")}
                        >
                          Mark as Completed
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-700 rounded-b-xl"
                          onClick={openDeleteConfirmation}
                        >
                          Delete Task
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap ml-7 gap-1.5">
            {task.tags &&
              task.tags.map((tag, index) =>
                tag ? (
                  <span
                    key={index}
                    className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ) : null,
              )}
          </div>
        </div>

        {/* Mobile buttons - shown below description on small screens */}
        <div className="lg:hidden mt-4 flex flex-col gap-2 ml-7">
          {/* Mobile Assignees display */}
          {task.assignees && task.assignees.length > 0 ? (
            <button className="bg-[#3F74FF] text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 justify-center w-full">
              <img src={Avatar || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
              <span className="truncate">{task.assignees.join(", ")}</span>
            </button>
          ) : task.roles && task.roles.length > 0 ? (
            <button className="bg-[#3F74FF] text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 justify-center w-full">
              <img src={Avatar || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
              <span className="truncate">{task.roles.join(", ")}</span>
            </button>
          ) : null}

          {/* Mobile date and time */}
          <button className="bg-[#2F2F2F] text-gray-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 justify-center w-full">
            <Calendar size={12} />
            <span className="truncate">{formatDateTime()}</span>
          </button>
        </div>

        {isEditModalOpen && (
          <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} onUpdateTask={handleUpdateTask} />
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-white text-lg font-medium mb-2">Confirm Delete</h3>
              <p className="text-gray-300 text-sm mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-[#2F2F2F] text-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="bg-red-600 text-sm text-white px-4 py-2 rounded-xl hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

