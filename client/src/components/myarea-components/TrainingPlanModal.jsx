/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"
import { X, Plus, Trash2, Dumbbell, Eye, Play } from "lucide-react"

export default function TrainingPlansModal({
  isOpen,
  onClose,
  selectedMember,
  memberTrainingPlans = [],
  availableTrainingPlans = [],
  onAssignPlan,
  onRemovePlan,
}) {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPlanToAssign, setSelectedPlanToAssign] = useState("")
  const [viewingPlan, setViewingPlan] = useState(null)

  // Mock data for plan details - you can replace this with actual data
  const mockPlanDetails = {
    id: 1,
    name: "Beginner Full Body",
    description: "Complete full body workout for beginners focusing on fundamental movements",
    createdBy: "Coach John Smith",
    duration: "4 weeks",
    difficulty: "Beginner",
    workoutsPerWeek: 3,
    category: "Full Body Strength",
    exercises: [
      {
        id: 1,
        videoId: 1,
        name: "Squat Fundamentals",
        sets: 3,
        reps: "10-12",
        rest: "60s"
      },
      {
        id: 2,
        videoId: 2,
        name: "Push-up Progression",
        sets: 3,
        reps: "8-12",
        rest: "45s"
      },
      {
        id: 3,
        videoId: 3,
        name: "Bent-over Rows",
        sets: 3,
        reps: "10-12",
        rest: "60s"
      },
    
    ]
  }

  // Mock videos data
  const mockVideos = [
    {
      id: 1,
      title: "Squat Fundamentals",
      instructor: "Coach Sarah",
      thumbnail: "https://i.ytimg.com/vi/c0IAQC-seG8/maxresdefault.jpg",
      targetMuscles: ["Quads", "Glutes", "Core"]
    },
    {
      id: 2,
      title: "Push-up Progression",
      instructor: "Trainer Mike",
      thumbnail:"https://cdn.prod.website-files.com/674732398a7cbc934e4c2f56/67f2538f3b071e2e85b1752b_11%20Push%20ups%20Variations%20to%20try%20out%20.jpg",
      targetMuscles: ["Chest", "Shoulders", "Triceps"]
    },
    {
      id: 3,
      title: "Bent-over Rows",
      instructor: "Coach John",
      thumbnail:
      "https://cdn.prod.website-files.com/611abd833ca7af7702667729/641df9609f209750c235ed87_Screenshot%202023-03-24%20at%202.15.08%20PM.png",
      targetMuscles: ["Back", "Biceps", "Rear Delts"]
    },
  ]

  if (!isOpen) return null

  const handleAssignPlan = () => {
    if (selectedPlanToAssign && onAssignPlan) {
      onAssignPlan(selectedMember.id, selectedPlanToAssign)
      setSelectedPlanToAssign("")
      setShowAssignModal(false)
    }
  }

  const handleRemovePlan = (planId) => {
    if (onRemovePlan) {
      onRemovePlan(selectedMember.id, planId)
    }
  }

  const handleViewPlan = (plan) => {
    // For demo purposes, using mock data. Replace with actual plan data
    const planWithDetails = {
      ...plan,
      ...mockPlanDetails,
      exercises: mockPlanDetails.exercises.map(exercise => ({
        ...exercise,
        ...mockVideos.find(v => v.id === exercise.videoId)
      }))
    }
    setViewingPlan(planWithDetails)
  }

  const getVideoById = (videoId) => {
    return mockVideos.find(video => video.id === videoId)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-600"
      case "intermediate":
        return "bg-yellow-600"
      case "advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const handleVideoClick = (video) => {
    // Handle video play - you can implement this based on your needs
    console.log("Play video:", video)
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-blue-400" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-white">Training Plans</h2>
              <p className="text-gray-400 text-sm">{selectedMember?.name || "Member"}</p>
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

            {memberTrainingPlans.length > 0 ? (
              <div className="space-y-3">
                {memberTrainingPlans.map((plan) => (
                  <div key={plan.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{plan.name}</h4>
                        <p className="text-gray-400 text-sm">{plan.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {plan.duration}</span>
                          <span>Difficulty: {plan.difficulty}</span>
                          <span>Assigned: {plan.assignedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewPlan(plan)}
                          className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/20 transition-colors"
                          title="View Plan Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleRemovePlan(plan.id)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                          title="Remove Plan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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
                  {availableTrainingPlans.map((plan) => (
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

        {/* View Plan Details Modal */}
        {viewingPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0 pr-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">{viewingPlan.name}</h2>
                    <p className="text-gray-400 text-sm sm:text-base">{viewingPlan.description}</p>
                  </div>
                  <button
                    onClick={() => setViewingPlan(null)}
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
                          <span className="text-white text-sm truncate ml-2">{viewingPlan.createdBy}</span>
                        </div>
                        {viewingPlan.duration && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Duration</span>
                            <span className="text-white text-sm">{viewingPlan.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Difficulty</span>
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(viewingPlan.difficulty)}`}
                          >
                            {viewingPlan.difficulty}
                          </span>
                        </div>
                        {viewingPlan.workoutsPerWeek && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Workouts/Week</span>
                            <span className="text-white text-sm">{viewingPlan.workoutsPerWeek}x</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Category</span>
                          <span className="text-white text-sm truncate ml-2">{viewingPlan.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exercises */}
                  <div className="lg:col-span-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                      Exercises ({viewingPlan.exercises?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {viewingPlan.exercises?.map((exercise, index) => {
                        const video = getVideoById(exercise.videoId)
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
                                  {video?.targetMuscles?.map((muscle, muscleIndex) => (
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
                                onClick={() => handleVideoClick(video)}
                                className="p-1.5 sm:p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors flex-shrink-0"
                              >
                                <Play size={14} className="text-gray-400" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}