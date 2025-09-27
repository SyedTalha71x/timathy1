

/* eslint-disable react/no-unknown-property */

/* eslint-disable react/prop-types */
import { X, ChevronDown, Users, Tag } from "lucide-react"
import { useState } from "react"
import { toast, Toaster } from "react-hot-toast"

const EditTaskModal = ({ onClose, onUpdateTask, configuredTags = [], taskToEdit }) => {
  const [editedTask, setEditedTask] = useState({
    title: taskToEdit?.title || "",
    assignees: taskToEdit?.assignees || [],
    roles: taskToEdit?.roles || [],
    tags: taskToEdit?.tags || [],
    dueDate: taskToEdit?.dueDate || "",
    dueTime: taskToEdit?.dueTime || "",
  })

  const [assignmentType, setAssignmentType] = useState(
    taskToEdit?.assignees?.length > 0 || taskToEdit?.assignee ? "staff" : "roles",
  )

  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false)
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)

  // Sample data - replace with your actual data
  const staff = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Jack", lastName: "Wilson" },
    { id: 4, firstName: "Sarah", lastName: "Johnson" },
    { id: 5, firstName: "Mike", lastName: "Brown" },
    { id: 6, firstName: "Lisa", lastName: "Davis" },
  ]

  const roles = ["Developer", "Designer", "Manager", "QA Tester", "Product Owner"]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editedTask.dueDate) {
      toast.error("Task not updated. You must add a due date.")
      return
    }
    if (onUpdateTask) {
      const updatedTask = {
        ...taskToEdit,
        ...editedTask,
        assignee: assignmentType === "staff" ? editedTask.assignees[0] || "" : "",
        role: assignmentType === "roles" ? editedTask.roles[0] || "" : "",
      }
      onUpdateTask(updatedTask)
      toast.success("Task has been updated successfully!")
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }

  const handleAssignmentTypeChange = (type) => {
    setAssignmentType(type)
    setEditedTask((prev) => ({
      ...prev,
      assignees: [],
      roles: [],
    }))
  }

  const handleStaffToggle = (staffMember) => {
    const fullName = `${staffMember.firstName} ${staffMember.lastName}`
    setEditedTask((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(fullName)
        ? prev.assignees.filter((name) => name !== fullName)
        : [...prev.assignees, fullName],
    }))
  }

  const handleRoleToggle = (role) => {
    setEditedTask((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
    }))
  }

  const handleTagToggle = (tagName) => {
    setEditedTask((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName) ? prev.tags.filter((tag) => tag !== tagName) : [...prev.tags, tagName],
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
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-[#181818] rounded-xl w-[500px] max-h-[90vh] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-lg font-semibold">Edit Task</h2>
            <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar pr-2"
          >
            <div>
              <label className="text-sm text-gray-200">Task Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 mb-2">Assignment Type</label>
              <div className="flex gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("staff")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "staff" ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  to Staff
                </button>
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("roles")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "roles" ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  to Roles
                </button>
              </div>
            </div>

            {assignmentType === "staff" && (
              <div>
                <label className="text-sm text-gray-200">Assign to Staff</label>
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        {editedTask.assignees.length > 0
                          ? `${editedTask.assignees.length} staff selected`
                          : "Select staff members"}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isAssignDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isAssignDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-50 max-h-48 overflow-y-auto">
                      {staff.map((staffMember) => {
                        const fullName = `${staffMember.firstName} ${staffMember.lastName}`
                        const isSelected = editedTask.assignees.includes(fullName)
                        return (
                          <button
                            key={staffMember.id}
                            type="button"
                            onClick={() => handleStaffToggle(staffMember)}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span className="text-gray-200">{fullName}</span>
                            </div>
                            {isSelected && <span className="text-green-400">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {editedTask.assignees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editedTask.assignees.map((assignee) => (
                      <span
                        key={assignee}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {assignee}
                        <button
                          type="button"
                          onClick={() =>
                            handleStaffToggle({ firstName: assignee.split(" ")[0], lastName: assignee.split(" ")[1] })
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

            {assignmentType === "roles" && (
              <div>
                <label className="text-sm text-gray-200">Assign to Roles</label>
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        {editedTask.roles.length > 0 ? `${editedTask.roles.length} roles selected` : "Select roles"}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isAssignDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isAssignDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-50 max-h-48 overflow-y-auto">
                      {roles.map((role) => {
                        const isSelected = editedTask.roles.includes(role)
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleToggle(role)}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span className="text-gray-200">{role}</span>
                            </div>
                            {isSelected && <span className="text-green-400">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {editedTask.roles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editedTask.roles.map((role) => (
                      <span
                        key={role}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {role}
                        <button type="button" onClick={() => handleRoleToggle(role)} className="hover:text-gray-200">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-200">Add Tags</label>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>
                      {editedTask.tags.length > 0 ? `${editedTask.tags.length} tags selected` : "Select tags"}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isTagDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isTagDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-50 max-h-48 overflow-y-auto">
                    {configuredTags.map((tag) => {
                      const isSelected = editedTask.tags.includes(tag.name)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                            <span className="text-gray-200">{tag.name}</span>
                          </div>
                          {isSelected && <span className="text-green-400">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {editedTask.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {editedTask.tags.map((tagName) => {
                    const tag = configuredTags.find((t) => t.name === tagName)
                    return (
                      <span
                        key={tagName}
                        className="text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                        style={{ backgroundColor: tag?.color || "#3F74FF" }}
                      >
                        {tagName}
                        <button type="button" onClick={() => handleTagToggle(tagName)} className="hover:text-gray-200">
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200">Due Date</label>
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-200">Due Time (Optional)</label>
                <input
                  type="time"
                  value={editedTask.dueTime}
                  onChange={(e) => setEditedTask({ ...editedTask, dueTime: e.target.value })}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
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
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </>
  )
}

export default EditTaskModal
