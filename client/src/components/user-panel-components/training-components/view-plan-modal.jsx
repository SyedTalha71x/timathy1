/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X, Play } from 'lucide-react';

const ViewPlanModal = ({
  isOpen,
  selectedPlan,
  onClose,
  onVideoClick,
  getVideoById,
  getDifficultyColor
}) => {
  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">{selectedPlan.name}</h2>
              <p className="text-gray-400 text-sm sm:text-base">{selectedPlan.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Plan Info */}
            <div className="lg:col-span-1">
              <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Plan Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Created by</span>
                    <span className="text-white text-sm truncate ml-2">{selectedPlan.createdBy}</span>
                  </div>
                  {selectedPlan.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Duration</span>
                      <span className="text-white text-sm">{selectedPlan.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Difficulty</span>
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(selectedPlan.difficulty)}`}
                    >
                      {selectedPlan.difficulty}
                    </span>
                  </div>
                  {selectedPlan.workoutsPerWeek && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Workouts/Week</span>
                      <span className="text-white text-sm">{selectedPlan.workoutsPerWeek}x</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Category</span>
                    <span className="text-white text-sm truncate ml-2">{selectedPlan.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="lg:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                Exercises ({selectedPlan.exercises.length})
              </h3>
              <div className="space-y-4">
                {selectedPlan.exercises.map((exercise, index) => {
                  const video = getVideoById(exercise.videoId);
                  return (
                    <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <img
                          src={video?.thumbnail || "/placeholder.svg"}
                          alt={video?.title}
                          className="w-16 sm:w-20 h-12 sm:h-15 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white mb-1 text-sm sm:text-base truncate">
                            {video?.title}
                          </h4>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {video?.targetMuscles.map((muscle, muscleIndex) => (
                              <span
                                key={muscleIndex}
                                className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => onVideoClick(video)}
                          className="p-1.5 sm:p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors flex-shrink-0"
                        >
                          <Play size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlanModal;