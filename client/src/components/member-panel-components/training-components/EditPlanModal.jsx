/* eslint-disable react/prop-types */
import { useState } from 'react';
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
  const [mobileTab, setMobileTab] = useState('details');

  if (!isOpen || !editingPlan) return null;

  const handleClose = () => {
    setMobileTab('details');
    onClose();
  };

  // ==========================================
  // Shared Sub-Components
  // ==========================================
  const PlanDetailsForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-muted mb-2">Plan Name</label>
        <input
          type="text"
          value={planForm.name}
          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
          className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          placeholder="Enter plan name..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-muted mb-2">Description</label>
        <textarea
          value={planForm.description}
          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
          className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none resize-none text-sm"
          rows={3}
          placeholder="Describe your training plan..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">Duration</label>
          <input
            type="text"
            value={planForm.duration}
            onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
            placeholder="e.g., 4 weeks"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">Workouts/Week</label>
          <select
            value={planForm.workoutsPerWeek}
            onChange={(e) => setPlanForm({ ...planForm, workoutsPerWeek: e.target.value ? Number.parseInt(e.target.value) : "" })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>{n}x per week</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">Difficulty</label>
          <select
            value={planForm.difficulty}
            onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">Category</label>
          <select
            value={planForm.category}
            onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
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
  );

  const ExerciseLibrary = () => (
    <div>
      <h3 className="hidden lg:block text-base font-semibold text-content-primary mb-4">Exercise Library</h3>
      <div className="space-y-2 lg:max-h-96 lg:overflow-y-auto">
        {availableVideos.map((video) => (
          <div key={video._id} className="bg-surface-card rounded-xl p-3 flex items-center gap-3">
            <img
              src={video.thumbnail?.url || "/placeholder.svg"}
              alt={video.title}
              className="w-12 h-9 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-content-primary text-sm truncate">{video.title}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getDifficultyColor(video.difficulty)}`}>
                  {video.difficulty}
                </span>
                <span className="text-content-faint text-xs">{video.duration}</span>
              </div>
            </div>
            <button
              onClick={() => onAddExercise(video)}
              className="p-1.5 bg-primary hover:bg-primary-hover rounded-lg transition-colors flex-shrink-0"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        ))}
        {availableVideos.length === 0 && (
          <div className="text-center py-8 text-content-muted text-sm">
            <p>No exercises available</p>
            <p className="text-xs mt-1">All exercises are already selected</p>
          </div>
        )}
      </div>
    </div>
  );

  const SelectedExercises = () => (
    <div>
      <h3 className="hidden lg:block text-base font-semibold text-content-primary mb-4">
        Selected Exercises ({selectedExercises.length})
      </h3>
      {selectedExercises.length === 0 ? (
        <div className="text-center py-8 text-content-muted">
          <Target size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No exercises selected yet</p>
          <p className="text-xs mt-1">Add exercises from the library</p>
        </div>
      ) : (
        <div className="space-y-2 lg:max-h-96 lg:overflow-y-auto">
          {selectedExercises.map((exercise, index) => {
            const video = typeof exercise.video === "string" ? getVideoById(exercise.video) : exercise.video;
            if (!video) return null;
            return (
              <div key={exercise.video?._id || index} className="bg-surface-card rounded-xl p-3 flex items-center gap-3">
                <img
                  src={video.thumbnail?.url || "/placeholder.svg"}
                  alt={video?.title || "Exercise"}
                  className="w-12 h-9 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-content-primary text-sm truncate">{video?.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getDifficultyColor(video?.difficulty)}`}>
                      {video?.difficulty}
                    </span>
                    <span className="text-content-faint text-xs">{video?.duration || video?.videoUrl?.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveExercise(index)}
                  className="p-1.5 text-content-muted hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const ActionButtons = ({ className = "" }) => (
    <div className={`flex gap-3 ${className}`}>
      <button
        onClick={handleClose}
        className="flex-1 px-4 py-3 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary text-sm transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onEditPlan}
        disabled={!planForm.name || selectedExercises.length === 0}
        className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white text-sm transition-colors flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Update Plan
      </button>
    </div>
  );

  // ==========================================
  // Mobile tab config
  // ==========================================
  const mobileTabs = [
    { key: 'details', label: 'Details' },
    { key: 'library', label: `Library (${availableVideos.length})` },
    { key: 'selected', label: `Selected (${selectedExercises.length})` },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-[1000]">

      {/* ===== MOBILE — bottom sheet with tabs ===== */}
      <div className="lg:hidden flex flex-col w-full h-[95dvh] bg-surface-base rounded-t-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-content-primary">Edit Training Plan</h2>
          <button onClick={handleClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-muted" />
          </button>
        </div>

        <div className="flex border-b border-border px-4 flex-shrink-0">
          {mobileTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors whitespace-nowrap ${
                mobileTab === tab.key
                  ? 'text-content-primary border-b-2 border-primary'
                  : 'text-content-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {mobileTab === 'details' && <PlanDetailsForm />}
          {mobileTab === 'library' && <ExerciseLibrary />}
          {mobileTab === 'selected' && <SelectedExercises />}
        </div>

        <div className="flex-shrink-0 px-4 pb-6">
          <ActionButtons />
        </div>
      </div>

      {/* ===== DESKTOP — centered modal with 3-col grid ===== */}
      <div className="hidden lg:block w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-surface-base rounded-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-content-primary">Edit Training Plan</h2>
          <button onClick={handleClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-muted" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <PlanDetailsForm />
          <ExerciseLibrary />
          <div>
            <SelectedExercises />
            <ActionButtons className="mt-6 pt-4 border-t border-border" />
          </div>
        </div>
      </div>
    </div>
  );
};
