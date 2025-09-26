

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Check, Users } from "lucide-react"

const AssignModal = ({ task, availableAssignees, availableRoles, onClose, onUpdate }) => {
  const [assignmentMode, setAssignmentMode] = useState("staff")
  const [selectedAssignees, setSelectedAssignees] = useState([...task.assignees])
  const [selectedRoles, setSelectedRoles] = useState([...task.roles])

  const toggleAssignee = (assigneeName) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeName) ? prev.filter((a) => a !== assigneeName) : [...prev, assigneeName],
    )
  }

  const toggleRole = (role) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleSave = () => {
    onUpdate({
      ...task,
      assignees: selectedAssignees,
      roles: selectedRoles,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Assign Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 text-sm mb-4">Assign: "{task.title}"</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAssignmentMode("staff")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                assignmentMode === "staff" ? "bg-[#FF843E] text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              to Staff
            </button>
            <button
              onClick={() => setAssignmentMode("roles")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                assignmentMode === "roles" ? "bg-[#FF843E] text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              to Roles
            </button>
          </div>

          {assignmentMode === "staff" && (
            <div>
              <h4 className="text-white text-sm font-medium mb-2">Assign to Staff</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableAssignees.map((assignee) => {
                  const fullName = `${assignee.firstName} ${assignee.lastName}`
                  const isSelected = selectedAssignees.includes(fullName)
                  return (
                    <button
                      key={assignee.id}
                      onClick={() => toggleAssignee(fullName)}
                      className={`flex items-center gap-2 w-full text-left p-2 text-sm rounded-lg transition-colors ${
                        isSelected ? "bg-[#FF843E]/20 border border-[#FF843E]" : "bg-[#1C1C1C] hover:bg-[#2F2F2F]"
                      }`}
                    >
                      <Users size={14} />
                      <span className="flex-1">{fullName}</span>
                      {isSelected && <Check size={14} className="text-[#FF843E]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {assignmentMode === "roles" && (
            <div>
              <h4 className="text-white text-sm font-medium mb-2">Assign to Roles</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role)
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`flex items-center gap-2 w-full text-left p-2 text-sm rounded-lg transition-colors ${
                        isSelected ? "bg-[#FF843E]/20 border border-[#FF843E]" : "bg-[#1C1C1C] hover:bg-[#2F2F2F]"
                      }`}
                    >
                      <Users size={14} />
                      <span className="flex-1">{role}</span>
                      {isSelected && <Check size={14} className="text-[#FF843E]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-[#2F2F2F] text-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignModal
