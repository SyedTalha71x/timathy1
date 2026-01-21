/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"
import { X, Plus, Trash2, Dumbbell, ChevronRight, Calendar, Clock, Search } from "lucide-react"

export default function TrainingPlansModalMain({
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
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmRemove, setConfirmRemove] = useState(null)

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
      setConfirmRemove(null)
    }
  }

  // Filter available plans based on search
  const filteredAvailablePlans = availableTrainingPlansMain.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#181818] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Dumbbell className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Training Plans</h2>
              <p className="text-gray-400 text-sm">{selectedMemberMain?.name || "Member"}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          {/* Assigned Plans Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-white">Assigned Plans</h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Assign Plan
              </button>
            </div>

            {memberTrainingPlansMain.length > 0 ? (
              <div className="space-y-3">
                {memberTrainingPlansMain.map((plan) => {
                  // Only show difficulty badge if it's a valid difficulty level
                  const validDifficulties = ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'];
                  const showDifficulty = plan.difficulty && validDifficulties.includes(plan.difficulty?.toLowerCase());
                  
                  return (
                  <div 
                    key={plan.id} 
                    className="bg-[#222222] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{plan.name}</h4>
                          {showDifficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                              {plan.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                        
                        {/* Plan Details */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {plan.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {plan.assignedDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setConfirmRemove(plan.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Plan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Confirm Remove */}
                    {confirmRemove === plan.id && (
                      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Remove this plan?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmRemove(null)}
                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRemovePlan(plan.id)}
                            className="px-3 py-1.5 text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#222222] rounded-xl">
                <Dumbbell size={48} className="mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 font-medium">No training plans assigned</p>
                <p className="text-sm text-gray-500 mt-1">Click "Assign Plan" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-white bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

        {/* Assign Plan Modal */}
        {showAssignModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowAssignModal(false)}
          >
            <div 
              className="bg-[#181818] rounded-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Assign Training Plan</h3>
                <button 
                  onClick={() => setShowAssignModal(false)} 
                  className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#222222] border border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Plan List */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredAvailablePlans.length > 0 ? (
                  <div className="space-y-1">
                    {filteredAvailablePlans.map((plan) => {
                      const validDifficulties = ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'];
                      const showDifficulty = plan.difficulty && validDifficulties.includes(plan.difficulty?.toLowerCase());
                      
                      return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanToAssign(plan.id)}
                        className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between group ${
                          selectedPlanToAssign === plan.id
                            ? 'bg-orange-500/20 border border-orange-500/50'
                            : 'hover:bg-[#222222] border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm">{plan.name}</span>
                            {showDifficulty && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                                {plan.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{plan.duration}</p>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className={`text-gray-500 transition-colors ${
                            selectedPlanToAssign === plan.id ? 'text-orange-400' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No plans found
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-700">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignPlan}
                  disabled={!selectedPlanToAssign}
                  className="flex-1 py-2.5 text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
