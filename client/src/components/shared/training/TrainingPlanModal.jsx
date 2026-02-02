/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState, useMemo, useEffect, useRef } from "react"
import { X, Plus, Minus, Dumbbell, Calendar, Clock, Search, Eye } from "lucide-react"
import ViewPlanModal from "./view-plan-modal"
import VideoModal from "./video-modal"

// ============================================================================
// IMPORTS AUS TRAINING-STATES für direkte Datenzugriff
// ============================================================================
// HINWEIS: Pfad anpassen je nach Position der Datei im Projekt
// Für shared/training/: "../../../utils/studio-states/training-states"
// Für studio-components/training-components/: "../../utils/studio-states/training-states"
import {
  trainingPlansData,
  getVideoById as getVideoByIdFromState,
  getDifficultyColor as getDifficultyColorFromState,
  getMemberTrainingPlans as getMemberTrainingPlansFromState,
} from "../../../utils/studio-states/training-states"

// ============================================================================
// TRAINING PLANS MODAL - For Member View
// ============================================================================
// This modal displays the training plans of a member and allows
// assigning/removing plans.
//
// PROPS:
// - isOpen: boolean - Modal visible?
// - onClose: function - Close handler
// - selectedMemberMain: object - The selected member { id, firstName, lastName, email, ... }
// - memberTrainingPlansMain: array - Assigned plans of the member (optional, uses training-states)
// - availableTrainingPlansMain: array - Available plans for assignment (optional, uses training-states)
// - onAssignPlanMain: function(memberId, planId) - Handler for assignment
// - onRemovePlanMain: function(memberId, planId) - Handler for removal
// - getVideoById: function(videoId) - Video lookup (optional, uses training-states)
// - onVideoClick: function(video) - Play video (optional, uses internal modal)
//
// MEMBER OBJECT STRUCTURE (from app-states.jsx):
// {
//   id: number,
//   firstName: string,
//   lastName: string,
//   email: string,
//   ...
// }
// ============================================================================

export default function TrainingPlansModalMain({
  isOpen,
  onClose,
  // Support both prop naming conventions
  selectedMemberMain,
  selectedMember, // Alternative prop name from appointments.jsx
  memberTrainingPlansMain,
  memberTrainingPlans, // Alternative prop name
  availableTrainingPlansMain,
  availableTrainingPlans, // Alternative prop name
  onAssignPlanMain,
  onAssignPlan, // Alternative prop name
  onRemovePlanMain,
  onRemovePlan, // Alternative prop name
  getVideoById,
  onVideoClick,
}) {
  // Normalize props - use whichever is provided
  const member = selectedMemberMain || selectedMember;
  const onAssign = onAssignPlanMain || onAssignPlan;
  const onRemove = onRemovePlanMain || onRemovePlan;

  // -------------------------------------------------------------------------
  // STATE - Plan Management
  // -------------------------------------------------------------------------
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmRemove, setConfirmRemove] = useState(null)
  const [viewingPlan, setViewingPlan] = useState(null)
  const [localAssignedPlanIds, setLocalAssignedPlanIds] = useState([])

  // -------------------------------------------------------------------------
  // STATE - Video Modal (matching VideoModal component props)
  // -------------------------------------------------------------------------
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef(null)

  // -------------------------------------------------------------------------
  // DATA FROM TRAINING-STATES
  // -------------------------------------------------------------------------
  // Get member's assigned plans from training-states
  const memberPlansFromState = useMemo(() => {
    if (member?.id) {
      return getMemberTrainingPlansFromState(member.id);
    }
    return [];
  }, [member?.id]);

  // Initialize local assigned plan IDs when modal opens or member changes
  useEffect(() => {
    const assignedIds = memberPlansFromState.map(mp => mp.planId || mp.plan?.id || mp.id);
    setLocalAssignedPlanIds(assignedIds);
  }, [memberPlansFromState]);

  // All plans from training-states
  const allPlans = useMemo(() => {
    return trainingPlansData.filter(p => p.isActive !== false);
  }, []);

  // Member's assigned plans (combining state data with local changes)
  const memberPlans = useMemo(() => {
    return allPlans.filter(plan => localAssignedPlanIds.includes(plan.id));
  }, [allPlans, localAssignedPlanIds]);

  // Available plans (not yet assigned)
  const availablePlans = useMemo(() => {
    return allPlans.filter(plan => !localAssignedPlanIds.includes(plan.id));
  }, [allPlans, localAssignedPlanIds]);

  // Video lookup - always use training-states
  const getVideo = (videoId) => {
    return getVideoByIdFromState(videoId);
  };

  // -------------------------------------------------------------------------
  // EARLY RETURN
  // -------------------------------------------------------------------------
  if (!isOpen) return null

  // -------------------------------------------------------------------------
  // HANDLERS - Plan Assignment
  // -------------------------------------------------------------------------
  const handleAssignPlan = (planId) => {
    setLocalAssignedPlanIds(prev => [...prev, planId]);
    if (onAssign) {
      onAssign(member.id, planId);
    }
  };

  const handleRemovePlan = (planId) => {
    setLocalAssignedPlanIds(prev => prev.filter(id => id !== planId));
    if (onRemove) {
      onRemove(member.id, planId);
    }
    setConfirmRemove(null);
  };

  // -------------------------------------------------------------------------
  // HANDLERS - Video Modal (matching VideoModal component interface)
  // -------------------------------------------------------------------------
  const handleVideoClick = (video) => {
    // If parent provides onVideoClick, use it
    if (onVideoClick) {
      onVideoClick(video);
      return;
    }
    // Otherwise use shared VideoModal
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // -------------------------------------------------------------------------
  // COMPUTED - Filtered Plans
  // -------------------------------------------------------------------------
  const filteredAvailablePlans = availablePlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // -------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // -------------------------------------------------------------------------
  
  // Get difficulty badge color (transparent background)
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Get difficulty badge color (solid background - for ViewPlanModal & VideoModal)
  const getDifficultyColorSolid = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-600'
      case 'intermediate': return 'bg-yellow-600'
      case 'advanced': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  // Check if difficulty is valid
  const isValidDifficulty = (difficulty) => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'];
    return difficulty && validDifficulties.includes(difficulty?.toLowerCase());
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#181818] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Dumbbell className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Training Plans</h2>
              <p className="text-gray-400 text-sm">
                {member?.firstName} {member?.lastName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================================= */}
        {/* CONTENT */}
        {/* ================================================================= */}
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

            {memberPlans.length > 0 ? (
              <div className="space-y-3">
                {memberPlans.map((plan) => {
                  const showDifficulty = isValidDifficulty(plan.difficulty);
                  
                  return (
                    <div 
                      key={plan.id} 
                      className="bg-[#222222] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-white font-medium">{plan.name}</h4>
                            {showDifficulty && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                                {plan.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                          
                          {/* Plan Details */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            {plan.duration && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={12} />
                                {plan.duration}
                              </span>
                            )}
                            {plan.workoutsPerWeek && (
                              <span className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {plan.workoutsPerWeek}x per week
                              </span>
                            )}
                            {plan.exercises?.length > 0 && (
                              <span className="flex items-center gap-1.5">
                                <Dumbbell size={12} />
                                {plan.exercises.length} exercises
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingPlan(plan)}
                            className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title="View Exercises"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmRemove(plan.id)}
                            className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title="Unassign Plan"
                          >
                            <Minus size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Confirm Unassign Dialog */}
                      {confirmRemove === plan.id && (
                        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                          <span className="text-sm text-gray-400">Unassign this plan?</span>
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
                              Unassign
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

        {/* ================================================================= */}
        {/* FOOTER */}
        {/* ================================================================= */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-white bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

        {/* ================================================================= */}
        {/* ASSIGN PLAN MODAL */}
        {/* ================================================================= */}
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
                      const showDifficulty = isValidDifficulty(plan.difficulty);
                      
                      return (
                        <div
                          key={plan.id}
                          className="p-3 rounded-xl hover:bg-[#222222] transition-colors flex items-center justify-between group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm">{plan.name}</span>
                              {showDifficulty && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                                  {plan.difficulty}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {plan.duration} - {plan.exercises?.length || 0} exercises
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewingPlan(plan)}
                              className="p-2 text-gray-400 hover:text-orange-400 rounded-lg hover:bg-gray-700 transition-colors"
                              title="View Plan"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleAssignPlan(plan.id)}
                              className="p-2 text-gray-400 hover:text-orange-400 rounded-lg hover:bg-gray-700 transition-colors"
                              title="Assign Plan"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery ? 'No plans found' : 'All plans are already assigned'}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-700">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* VIEW PLAN MODAL (Shared Component) */}
      {/* ================================================================= */}
      <ViewPlanModal
        isOpen={!!viewingPlan}
        selectedPlan={viewingPlan}
        onClose={() => setViewingPlan(null)}
        onVideoClick={handleVideoClick}
        getVideoById={getVideo}
        getDifficultyColor={getDifficultyColorSolid}
      />

      {/* ================================================================= */}
      {/* VIDEO MODAL (Shared Component - ohne "Add to Plan" Button) */}
      {/* ================================================================= */}
      <VideoModal
        isVideoModalOpen={isVideoModalOpen}
        selectedVideo={selectedVideo}
        setIsVideoModalOpen={setIsVideoModalOpen}
        setSelectedVideo={setSelectedVideo}
        setIsPlaying={setIsPlaying}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        toggleMute={toggleMute}
        isMuted={isMuted}
        videoRef={videoRef}
        handleTimeUpdate={handleTimeUpdate}
        handleLoadedMetadata={handleLoadedMetadata}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColorSolid}
        // NULL = "Add to Training Plan" Button wird NICHT angezeigt
        setVideoToAdd={null}
        setIsAddToPlanModalOpen={null}
      />
    </div>
  )
}
