"use client"

/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const assignees = ["Jack", "Jane", "John", "Jessica"]
const roles = ["Trainer", "Manager", "Developer", "Designer"]

export default function AddTaskModal({ onClose, onAddTask, configuredTags = [], activeCategory }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignees: [], // Changed to array for multiple selections
    roles: [], // Changed to array for multiple selections
    tags: [],
    dueDate: "",
    dueTime: "",
  })

  const [assignmentType, setAssignmentType] = useState("assignee")

  const handleSubmit = (e) => {
    e.preventDefault()

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      status: "ongoing",
      category: activeCategory, // Add the category
      // Keep the arrays but clear the one not being used
      assignees: assignmentType === "assignee" ? newTask.assignees : [],
      roles: assignmentType === "role" ? newTask.roles : [],
    }

    onAddTask(taskToAdd)
    toast.success("Task has been added successfully!")

    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleAssignmentTypeChange = (type) => {
    setAssignmentType(type)
    setNewTask({
      ...newTask,
      assignees: [],
      roles: [],
    })
  }

  const handleTagChange = (e) => {
    const value = e.target.value
    setNewTask((prev) => ({
      ...prev,
      tags: prev.tags.includes(value)
        ? prev.tags.filter((tag) => tag !== value) // Remove if already selected
        : [...prev.tags, value], // Add if not selected
    }))
  }

  const handleAssigneeChange = (e) => {
    const value = e.target.value
    if (value === "") return // Skip empty selections

    setNewTask((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(value)
        ? prev.assignees.filter((assignee) => assignee !== value) // Remove if already selected
        : [...prev.assignees, value], // Add if not selected
    }))
  }

  const handleRoleChange = (e) => {
    const value = e.target.value
    if (value === "") return // Skip empty selections

    setNewTask((prev) => ({
      ...prev,
      roles: prev.roles.includes(value)
        ? prev.roles.filter((role) => role !== value) // Remove if already selected
        : [...prev.roles, value], // Add if not selected
    }))
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
      <div className="fixed inset-0 open_sans_font w-screen h-screen bg-black/50 flex items-center p-3 sm:p-4 md:p-6 justify-center z-[1000]">
        <div className="bg-[#181818] rounded-2xl w-full max-w-md p-4 sm:p-5 md:p-6 lg:p-6 relative">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-white text-lg open_sans_font_700 font-semibold">Add task</h2>
            <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 custom-scrollbar max-h-[calc(100vh-180px)] overflow-y-auto"
          >
            <div>
              <label className="text-sm text-gray-200">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-200">Task Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-gray-200">Category</label>
              <div className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white capitalize">
                {activeCategory}
              </div>
              <p className="text-xs text-gray-400 mt-1">Tasks are added to the currently active category</p>
            </div>

            <div>
              <label className="text-sm text-gray-200">Assignment Type</label>
              <div className="flex gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("assignee")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "assignee" ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  Assign to People
                </button>
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("role")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "role" ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  Assign to Roles
                </button>
              </div>
            </div>

            {assignmentType === "assignee" && (
              <div>
                <label className="text-sm text-gray-200">Assignees</label>
                <select
                  value=""
                  onChange={handleAssigneeChange}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required={newTask.assignees.length === 0}
                >
                  <option value="">Select Assignees</option>
                  {assignees.map((assignee) => (
                    <option
                      key={assignee}
                      value={assignee}
                      className={newTask.assignees.includes(assignee) ? "bg-[#3F74FF]" : ""}
                    >
                      {assignee} {newTask.assignees.includes(assignee) ? "✓" : ""}
                    </option>
                  ))}
                </select>
                {newTask.assignees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newTask.assignees.map((assignee) => (
                      <span
                        key={assignee}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {assignee}
                        <button
                          type="button"
                          onClick={() =>
                            setNewTask((prev) => ({
                              ...prev,
                              assignees: prev.assignees.filter((a) => a !== assignee),
                            }))
                          }
                          className="hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {assignmentType === "role" && (
              <div>
                <label className="text-sm text-gray-200">Roles</label>
                <select
                  value=""
                  onChange={handleRoleChange}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required={newTask.roles.length === 0}
                >
                  <option value="">Select Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role} className={newTask.roles.includes(role) ? "bg-[#3F74FF]" : ""}>
                      {role} {newTask.roles.includes(role) ? "✓" : ""}
                    </option>
                  ))}
                </select>
                {newTask.roles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newTask.roles.map((role) => (
                      <span
                        key={role}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() =>
                            setNewTask((prev) => ({
                              ...prev,
                              roles: prev.roles.filter((r) => r !== role),
                            }))
                          }
                          className="hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-200">Tags</label>
              <div className="relative">
                <select
                  value=""
                  onChange={handleTagChange}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                >
                  <option value="">Select Tags</option>
                  {configuredTags.map((tag) => (
                    <option key={tag} value={tag} className={newTask.tags.includes(tag) ? "bg-[#3F74FF]" : ""}>
                      {tag} {newTask.tags.includes(tag) ? "✓" : ""}
                    </option>
                  ))}
                </select>
                {newTask.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newTask.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setNewTask((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((t) => t !== tag),
                            }))
                          }
                          className="hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200">Due Time (Optional)</label>
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

