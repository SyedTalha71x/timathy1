/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Check, Users, UserCheck } from "lucide-react"

const AssignModal = ({ task, availableAssignees, onClose, onUpdate }) => {
  // Initialize with existing assignees from task
  const [selectedAssignees, setSelectedAssignees] = useState([])

  // Initialize when task changes
  useEffect(() => {
    if (task && task.assignees) {
      // If assignees are objects with _id, use them directly
      // If they're strings, convert to objects (though unlikely)
      setSelectedAssignees(task.assignees || [])
    }
  }, [task])

  const toggleAssignee = (assignee) => {
    setSelectedAssignees((prev) => {
      // Check if this assignee is already selected by ID
      const exists = prev.find(a => a._id === assignee._id)
      
      if (exists) {
        return prev.filter(a => a._id !== assignee._id)
      } else {
        return [...prev, assignee] // Store the whole assignee object
      }
    })
  }

  const handleSave = () => {
    // Pass the full assignee objects to onUpdate
    onUpdate({
      ...task,
      assignees: selectedAssignees, // This is an array of objects with _id
    })
    onClose()
  }

  const isSelected = (assigneeId) => {
    return selectedAssignees.some(a => a._id === assigneeId)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-content-primary">Assign Task</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-content-secondary text-sm mb-4">Assign: "{task.title}"</p>

          <div>
            <h4 className="text-content-primary text-sm font-medium mb-3 flex items-center gap-2">
              <Users size={16} />
              Assign to Staff Members
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {availableAssignees.map((assignee) => {
                const fullName = `${assignee.firstName} ${assignee.lastName}`
                const selected = isSelected(assignee._id)
                
                return (
                  <button
                    key={assignee._id}
                    onClick={() => toggleAssignee(assignee)}
                    className={`flex items-center gap-3 w-full text-left p-3 text-sm rounded-lg transition-colors ${
                      selected ? "bg-primary/20 border border-primary" : "bg-surface-base hover:bg-surface-button"
                    }`}
                  >
                    <UserCheck size={16} className={selected ? "text-primary" : "text-content-muted"} />
                    <span className="flex-1 text-content-primary">{fullName}</span>
                    {selected && <Check size={16} className="text-primary" />}
                  </button>
                )
              })}
            </div>
            
            {/* Selected count indicator */}
            {selectedAssignees.length > 0 && (
              <div className="mt-3 px-3 py-2 bg-surface-base rounded-lg">
                <p className="text-sm text-content-muted">
                  <span className="text-content-primary font-medium">{selectedAssignees.length}</span> staff member{selectedAssignees.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-surface-button text-sm text-content-secondary px-4 py-2 rounded-xl hover:bg-surface-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-sm text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
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
          background: var(--color-surface-button, #2F2F2F);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-content-faint, #555);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-content-muted, #777);
        }
      `}</style>
    </div>
  )
}

export default AssignModal