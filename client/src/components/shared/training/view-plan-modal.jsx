/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X, Play } from 'lucide-react';

// ============================================================================
// IMPORTS AUS TRAINING-STATES für direkte Datenzugriff
// ============================================================================
// HINWEIS: Pfad anpassen je nach Position der Datei im Projekt
// Für shared/training/: "../../../utils/studio-states/training-states"
// Für studio-components/training-components/: "../../utils/studio-states/training-states"
import {
  getVideoById as getVideoByIdFromState,
  getDifficultyColor as getDifficultyColorFromState,
} from "../../../utils/studio-states/training-states"

const ViewPlanModal = ({
  isOpen,
  selectedPlan,
  onClose,
  onVideoClick,
  getVideoById,
  getDifficultyColor
}) => {
  if (!isOpen || !selectedPlan) return null;

  // -------------------------------------------------------------------------
  // FALLBACK FUNKTIONEN AUS TRAINING-STATES
  // -------------------------------------------------------------------------
  // Verwende Props wenn vorhanden, sonst Fallback aus training-states
  const getVideo = (videoId) => {
    if (getVideoById) {
      return getVideoById(videoId);
    }
    return getVideoByIdFromState(videoId);
  };

  const getDifficultyBadgeColor = (difficulty) => {
    if (getDifficultyColor) {
      return getDifficultyColor(difficulty);
    }
    return getDifficultyColorFromState(difficulty);
  };

  // Safety check for exercises
  const exercises = selectedPlan.exercises || [];

  // Handler für Video-Klick
  const handlePlayClick = (video) => {
    if (onVideoClick && video) {
      onVideoClick(video);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
                  {selectedPlan.createdBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Created by</span>
                      <span className="text-white text-sm truncate ml-2">{selectedPlan.createdBy}</span>
                    </div>
                  )}
                  {selectedPlan.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Duration</span>
                      <span className="text-white text-sm">{selectedPlan.duration}</span>
                    </div>
                  )}
                  {selectedPlan.difficulty && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Difficulty</span>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${getDifficultyBadgeColor(selectedPlan.difficulty)}`}
                      >
                        {selectedPlan.difficulty}
                      </span>
                    </div>
                  )}
                  {selectedPlan.workoutsPerWeek && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Workouts/Week</span>
                      <span className="text-white text-sm">{selectedPlan.workoutsPerWeek}x</span>
                    </div>
                  )}
                  {selectedPlan.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Category</span>
                      <span className="text-white text-sm truncate ml-2">{selectedPlan.category}</span>
                    </div>
                  )}
                  {selectedPlan.assignedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Assigned</span>
                      <span className="text-white text-sm">{selectedPlan.assignedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="lg:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                Exercises ({exercises.length})
              </h3>
              
              {exercises.length > 0 ? (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => {
                    const video = getVideo(exercise.videoId);
                    return (
                      <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          {video?.thumbnail && (
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video?.title}
                              className="w-16 sm:w-20 h-12 sm:h-15 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white mb-1 text-sm sm:text-base truncate">
                              {video?.title || exercise.name || `Exercise ${index + 1}`}
                            </h4>
                            {video?.instructor && (
                              <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video.instructor}</p>
                            )}
                            {video?.targetMuscles && video.targetMuscles.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {video.targetMuscles.map((muscle, muscleIndex) => (
                                  <span
                                    key={muscleIndex}
                                    className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs"
                                  >
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {video && (
                            <button
                              onClick={() => handlePlayClick(video)}
                              className="p-2 text-gray-400 hover:text-orange-400 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                              title="Play Video"
                            >
                              <Play size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#161616] rounded-xl p-8 text-center">
                  <p className="text-gray-400">No exercises in this plan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlanModal;
