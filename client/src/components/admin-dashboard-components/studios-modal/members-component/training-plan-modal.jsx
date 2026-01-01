/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */


import { useState } from "react"
import { X, Plus, Trash2, Dumbbell } from "lucide-react"

export default function TrainingPlansModal({
  isOpen,
  onClose,
  selectedMemberMain,
  memberTrainingPlansMain = [],
  availableTrainingPlansMain = [],
  onAssignPlanMain,
  onRemovePlanMain,
}) {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPlanToAssign, setSelectedPlanToAssign] = useState("")

  if (!isOpen) return null

  const handleAssignPlan = () => {
    if (selectedPlanToAssign && onAssignPlanMain) {
      onAssignPlanMain(selectedMemberMain.id, selectedPlanToAssign)
      setSelectedPlanToAssign("")
      setShowAssignModal(false)
    }
  }

  const handleRemovePlan = (planId) => {
    if (onRemovePlanMain) {
      onRemovePlanMain(selectedMemberMain.id, planId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1C1C1C] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-blue-400" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-white">Training Plans</h2>
              <p className="text-gray-400 text-sm">{selectedMemberMain?.name || "Member"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Assigned Plans */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Assigned Training Plans</h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Assign Plan
              </button>
            </div>

            {memberTrainingPlansMain.length > 0 ? (
              <div className="space-y-3">
                {memberTrainingPlansMain.map((plan) => (
                  <div key={plan.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{plan.name}</h4>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Duration: {plan.duration}</span>
                        <span>Difficulty: {plan.difficulty}</span>
                        <span>Assigned: {plan.assignedDate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePlan(plan.id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                      title="Remove Plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Dumbbell size={48} className="mx-auto mb-3 opacity-50" />
                <p>No training plans assigned yet</p>
                <p className="text-sm">Click "Assign Plan" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Assign Plan Modal */}
        {showAssignModal && (
          <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Assign Training Plan</h3>
                <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Training Plan</label>
                <select
                  value={selectedPlanToAssign}
                  onChange={(e) => setSelectedPlanToAssign(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose a plan...</option>
                  {availableTrainingPlansMain.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.difficulty}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignPlan}
                    disabled={!selectedPlanToAssign}
                    className="flex-1 bg-blue-600 text-sm hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
