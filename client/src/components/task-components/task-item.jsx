/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { MoreHorizontal, Tag, Calendar, Pin, PinOff, X } from "lucide-react"
import Avatar from "../../../public/image10.png"

export default function TaskItem({
  task,
  onStatusChange,
  onUpdate,
  onRemove,
  onPinToggle,
  onEditRequest,
  onDeleteRequest,
  isDragging,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus)
    setIsDropdownOpen(false)
  }

  const handleEditTask = () => {
    onEditRequest(task)
    setIsDropdownOpen(false)
  }

  const openDeleteConfirmation = () => {
    onDeleteRequest(task.id)
    setIsDropdownOpen(false)
  }

  const handlePinToggle = () => {
    onPinToggle(task.id)
    setIsDropdownOpen(false)
  }

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

  const isCompleted = task.status === "completed"
  const isCanceled = task.status === "canceled"

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-300 ease-in-out ${
        isDragging ? "opacity-90 z-[9999]  shadow-2xl" : "opacity-100"
      } ${
        isCompleted
          ? "bg-[#1c1c1c] text-gray-500"
          : isCanceled
            ? "bg-[#1a1a1a] text-gray-600 italic line-through"
            : "bg-[#161616] text-white"
      }`}
      style={{
        // Force the dragged element to be on top of everything
        position: isDragging ? 'relative' : 'static',
        zIndex: isDragging ? 9999 : 'auto',
        pointerEvents: isDragging ? 'none' : 'auto'
      }}
    >
      <div className="flex flex-col gap-3 min-h-[160px]">
        {/* Top: checkbox/cancel + title + dropdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {isCanceled ? (
              <button
                onClick={() => handleStatusChange("ongoing")}
                className="mt-1 h-4 w-4 flex items-center justify-center text-gray-400 bg-[#3a3a3a] rounded-sm cursor-pointer no-drag border border-gray-500"
                title="Canceled"
              >
                <X size={14} />
              </button>
            ) : (
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => handleStatusChange(isCompleted ? "ongoing" : "completed")}
                className="mt-1 form-checkbox h-4 w-4 cursor-pointer text-[#FF843E] rounded-full border-gray-300 focus:ring-[#FF843E] no-drag"
              />
            )}
            <div className="flex-grow">
              <h3 className="font-medium text-sm">
                {task.title}
                {task.isPinned && (
                  <Pin
                    size={14}
                    className="inline-block ml-2 text-gray-500 fill-gray-500"
                    aria-label="Task is pinned"
                  />
                )}
              </h3>
              <p className="text-xs mt-1 text-gray-400">{task.description}</p>
            </div>
          </div>
          {/* Dropdown */}
          <div className="relative flex items-center gap-1">
            <button onClick={toggleDropdown} className="hover:text-white p-1 no-drag">
              <MoreHorizontal size={18} className="cursor-pointer" />
            </button>
            {isDropdownOpen && !isDragging && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg z-[10000] border border-gray-700 no-drag">
                <button
                  onClick={handleEditTask}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left"
                >
                  Edit Task
                </button>
                <button
                  onClick={handlePinToggle}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left flex items-center gap-2"
                >
                  {task.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                  {task.isPinned ? "Unpin Task" : "Pin Task"}
                </button>
                {!isCanceled && (
                  <button
                    onClick={() => handleStatusChange("canceled")}
                    className="w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-700 text-left"
                  >
                    Cancel Task
                  </button>
                )}
                {isCanceled && (
                  <>
                    <button
                      onClick={() => handleStatusChange("ongoing")}
                      className="w-full px-4 py-2 text-xs text-yellow-500 hover:bg-gray-700 text-left"
                    >
                      Move to Ongoing
                    </button>
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="w-full px-4 py-2 text-xs text-green-500 hover:bg-gray-700 text-left"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
                <button
                  onClick={openDeleteConfirmation}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-700 text-left rounded-b-xl"
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap ml-7 gap-1.5">
          {task.tags?.map(
            (tag, index) =>
              tag && (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 ${
                    isCompleted || isCanceled ? "bg-[#2b2b2b] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
                  }`}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ),
          )}
        </div>
        {/* Assignees and Date */}
        <div className="flex flex-col items-center justify-center gap-2 mt-2 lg:flex-row lg:justify-center">
          {(task.assignees?.length > 0 || task.roles?.length > 0) && (
            <div
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
                isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#3F74FF] text-white"
              }`}
            >
              <img src={Avatar || "/placeholder.svg"} alt="avatar" className="w-4 h-4 rounded-full" />
              <span className="truncate">{task.assignees?.join(", ") || task.roles?.join(", ")}</span>
            </div>
          )}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
              isCompleted || isCanceled ? "bg-[#2d2d2d] text-gray-500" : "bg-[#2F2F2F] text-gray-300"
            }`}
          >
            <Calendar size={12} />
            <span>{formatDateTime()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}