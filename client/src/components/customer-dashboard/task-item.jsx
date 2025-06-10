/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { MoreHorizontal, Tag, Calendar, Plus, X } from "lucide-react"
import EditTaskModal from "./edit-task-modal"
import { Toaster, toast } from "react-hot-toast"

export default function TaskItem({
  task,
  onStatusChange,
  onUpdate,
  onRemove,
  getTagColor,
  allTags,
  onAddTag,
  onRemoveTag,
  onUpdateDueDate,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [tempDate, setTempDate] = useState(task.dueDate || "")
  const [tempTime, setTempTime] = useState(task.dueTime || "")
  const checkboxRef = useRef(null)

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleStatusChange = (newStatus) => {
    // Add animation class
    if (checkboxRef.current) {
      checkboxRef.current.style.transform = "scale(1.2)"
      checkboxRef.current.style.transition = "transform 0.2s ease-in-out"

      setTimeout(() => {
        if (checkboxRef.current) {
          checkboxRef.current.style.transform = "scale(1)"
        }
      }, 200)
    }

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

  const handleDateTimeClick = () => {
    setTempDate(task.dueDate || "")
    setTempTime(task.dueTime || "")
    setIsDateTimeModalOpen(true)
  }

  const handleDateTimeUpdate = () => {
    onUpdateDueDate(task.id, tempDate, tempTime)
    setIsDateTimeModalOpen(false)
  }

  const handleAddTag = () => {
    if (newTagName.trim() && !task.tags.includes(newTagName.trim())) {
      onAddTag(task.id, newTagName.trim())
      setNewTagName("")
      setIsAddingTag(false)
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    onRemoveTag(task.id, tagToRemove)
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
                <div className="relative mt-1">
                  <input
                    ref={checkboxRef}
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleStatusChange(task.status === "completed" ? "ongoing" : "completed")}
                    className="form-checkbox h-5 w-5 cursor-pointer text-[#FF843E] rounded border-2 border-gray-400 focus:ring-[#FF843E] transition-all duration-200 ease-in-out hover:border-[#FF843E]"
                    style={{
                      accentColor: "#FF843E",
                    }}
                  />
                  {task.status === "completed" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-white text-xs animate-pulse">✓</div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium text-lg">{task.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
              </div>
            </div>
            <div className="flex relative">
              <div className="lg:flex flex-col hidden md:flex-row gap-2">
                <button
                  onClick={handleDateTimeClick}
                  className="bg-[#2F2F2F] text-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 w-full justify-center hover:bg-[#3F3F3F] transition-colors cursor-pointer"
                >
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
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={handleEditTask}
                    >
                      Edit Task
                    </button>
                    {task.status !== "canceled" && (
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => handleStatusChange("canceled")}
                      >
                        Cancel Task
                      </button>
                    )}
                    {task.status === "canceled" && (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => handleStatusChange("ongoing")}
                        >
                          Move to Ongoing
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => handleStatusChange("completed")}
                        >
                          Mark as Completed
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-700 rounded-b-xl"
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

          <div className="flex flex-wrap ml-7 gap-1.5 items-center">
            {task.tags &&
              task.tags.map((tag, index) => {
                if (!tag) return null

                const tagColor = getTagColor ? getTagColor(tag) : "#FFFFFF"

                return (
                  <div
                    key={index}
                    className="bg-[#2F2F2F] px-2 py-1 rounded-md text-sm flex items-center gap-1 group hover:bg-red-600 transition-colors cursor-pointer relative"
                    onClick={() => handleRemoveTag(tag)}
                    title="Click to remove tag"
                  >
                    <Tag size={10} style={{ color: tagColor }} />
                    <span style={{ color: tagColor }} className="group-hover:text-white">
                      {tag}
                    </span>
                    <X size={10} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
                  </div>
                )
              })}

            {isAddingTag ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  onBlur={() => {
                    if (!newTagName.trim()) setIsAddingTag(false)
                  }}
                  className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm w-20"
                  placeholder="Tag name"
                  autoFocus
                />
                <button onClick={handleAddTag} className="text-green-500 hover:text-green-400">
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="bg-[#2F2F2F] hover:bg-[#3F3F3F] px-2 py-1 rounded-md text-sm flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                title="Add new tag"
              >
                <Plus size={10} />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile buttons - shown below description on small screens */}
        <div className="lg:hidden mt-4 flex flex-col gap-2 ml-7">
          <button
            onClick={handleDateTimeClick}
            className="bg-[#2F2F2F] text-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 justify-center w-full hover:bg-[#3F3F3F] transition-colors cursor-pointer"
          >
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

        {isDateTimeModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-white text-lg font-medium mb-4">Update Due Date & Time</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Due Date</label>
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="w-full white-calendar-icon bg-[#2F2F2F] text-white px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Due Time (Optional)</label>
                  <input
                    type="time"
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    className="w-full white-calendar-icon bg-[#2F2F2F] text-white px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setIsDateTimeModalOpen(false)}
                  className="bg-[#2F2F2F] text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateTimeUpdate}
                  className="bg-[#FF843E] text-white px-4 py-2 rounded-xl hover:bg-[#E6753A] text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
