/* eslint-disable react/prop-types */
import { Plus, Save, Target, Trash2, X } from "lucide-react";

export const EditPlanModal = ({
    isOpen,
    editingPlan,
    onClose,
    planForm,
    setPlanForm,
    selectedExercises,
    availableVideos,
    onAddExercise,
    onRemoveExercise,
    onEditPlan,
    getVideoById,
    getDifficultyColor
  }) => {
    if (!isOpen || !editingPlan) return null;
  
    const handleClose = () => {
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">Edit Training Plan</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Plan Details */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    placeholder="Enter plan name..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Describe your training plan..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Duration (optional)</label>
                  <input
                    type="text"
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    placeholder="e.g., 4 weeks"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Workouts/Week (optional)</label>
                  <select
                    value={planForm.workoutsPerWeek}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        workoutsPerWeek: e.target.value ? Number.parseInt(e.target.value) : "",
                      })
                    }
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                  >
                    <option value="">Select workouts per week</option>
                    <option value="1">1x per week</option>
                    <option value="2">2x per week</option>
                    <option value="3">3x per week</option>
                    <option value="4">4x per week</option>
                    <option value="5">5x per week</option>
                    <option value="6">6x per week</option>
                    <option value="7">7x per week</option>
                  </select>
                </div>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                    <select
                      value={planForm.difficulty}
                      onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                      value={planForm.category}
                      onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
                      className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="Full Body">Full Body</option>
                      <option value="Upper Body">Upper Body</option>
                      <option value="Lower Body">Lower Body</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Strength">Strength</option>
                      <option value="Flexibility">Flexibility</option>
                    </select>
                  </div>
                </div>
              </div>
  
              {/* Exercise Library */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Exercise Library</h3>
                <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                  {availableVideos.map((video) => (
                    <div key={video.id} className="bg-[#161616] rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-10 sm:w-12 h-8 sm:h-9 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm truncate">{video.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video.difficulty)}`}
                            >
                              {video.difficulty}
                            </span>
                            <span className="text-gray-500 text-xs">{video.duration}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onAddExercise(video)}
                          className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
                        >
                          <Plus size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {availableVideos.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No exercises available</p>
                      <p className="text-sm">All exercises are already selected</p>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Selected Exercises */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Selected Exercises ({selectedExercises.length})
                </h3>
                {selectedExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Target size={48} className="mx-auto mb-4" />
                    <p>No exercises selected yet</p>
                    <p className="text-sm">Add exercises from the library</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                    {selectedExercises.map((exercise, index) => {
                      const video = getVideoById(exercise.videoId);
                      return (
                        <div key={index} className="bg-[#161616] rounded-xl p-3 sm:p-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <img
                              src={video?.thumbnail || "/placeholder.svg"}
                              alt={video?.title}
                              className="w-12 sm:w-16 h-9 sm:h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white mb-1 text-sm truncate">{video?.title}</h4>
                              <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`px-1 py-0.5 rounded text-xs text-white ${getDifficultyColor(video?.difficulty)}`}
                                >
                                  {video?.difficulty}
                                </span>
                                <span className="text-gray-500 text-xs">{video?.duration}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveExercise(index)}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
  
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onEditPlan}
                    disabled={!planForm.name || selectedExercises.length === 0}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Update Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };