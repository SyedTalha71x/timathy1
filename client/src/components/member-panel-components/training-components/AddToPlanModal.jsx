/* eslint-disable react/prop-types */
import { X, Plus } from 'lucide-react';

const AddToPlanModal = ({ 
  isOpen, 
  onClose, 
  videoToAdd, 
  trainingPlans, 
  onAddToExistingPlan, 
  onCreateNewPlan,
  getDifficultyColor 
}) => {
  if (!isOpen || !videoToAdd) return null;

  const userPlans = trainingPlans.filter((plan) => plan.createdBy === "Current User");

  const handleCreateNew = () => {
    onClose();
    onCreateNewPlan(videoToAdd);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Add to Training Plan</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
              Select Existing Plan
            </h3>
            <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto">
              {userPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#161616] rounded-xl p-3 sm:p-4 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                  onClick={() => onAddToExistingPlan(plan.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{plan.name}</h4>
                      <p className="text-gray-400 text-sm">{plan.exercises.length} exercises</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs text-white ml-2 flex-shrink-0 ${getDifficultyColor(plan.difficulty)}`}
                    >
                      {plan.difficulty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
              Or Create New Plan
            </h3>
            <button
              onClick={handleCreateNew}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Create New Plan with This Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToPlanModal;