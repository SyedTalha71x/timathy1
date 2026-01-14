/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Check, Users, UserCheck } from "lucide-react"

const AssignModal = ({ task, availableAssignees, onClose, onUpdate }) => {
  const [selectedAssignees, setSelectedAssignees] = useState([...(task.assignees || [])])

  const toggleAssignee = (assigneeName) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeName) ? prev.filter((a) => a !== assigneeName) : [...prev, assigneeName],
    )
  }

  const handleSave = () => {
    onUpdate({
      ...task,
      assignees: selectedAssignees,
      roles: [], // Clear any existing roles
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

          <div>
            <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Users size={16} />
              Assign to Staff Members
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {availableAssignees.map((assignee) => {
                const fullName = `${assignee.firstName} ${assignee.lastName}`
                const isSelected = selectedAssignees.includes(fullName)
                return (
                  <button
                    key={assignee.id}
                    onClick={() => toggleAssignee(fullName)}
                    className={`flex items-center gap-3 w-full text-left p-3 text-sm rounded-lg transition-colors ${
                      isSelected ? "bg-[#FF843E]/20 border border-[#FF843E]" : "bg-[#1C1C1C] hover:bg-[#2F2F2F]"
                    }`}
                  >
                    <UserCheck size={16} className={isSelected ? "text-[#FF843E]" : "text-gray-400"} />
                    <span className="flex-1 text-white">{fullName}</span>
                    {isSelected && <Check size={16} className="text-[#FF843E]" />}
                  </button>
                )
              })}
            </div>
            
            {/* Selected count indicator */}
            {selectedAssignees.length > 0 && (
              <div className="mt-3 px-3 py-2 bg-[#1C1C1C] rounded-lg">
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">{selectedAssignees.length}</span> staff member{selectedAssignees.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
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
    </div>
  )
}

export default AssignModal
