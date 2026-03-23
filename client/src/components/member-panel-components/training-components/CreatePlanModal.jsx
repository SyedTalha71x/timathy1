/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Target, Trash2, Save } from 'lucide-react';
import { haptic } from '../../../utils/haptic';

const CreatePlanModal = ({
  isOpen,
  onClose,
  planForm,
  setPlanForm,
  selectedExercises,
  availableVideos,
  onAddExercise,
  onRemoveExercise,
  onCreatePlan,
  getVideoById,
  getDifficultyColor
}) => {
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = useState('details');

  if (!isOpen) return null;

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
        <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.planName")}</label>
        <input
          type="text"
          value={planForm.name}
          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
          className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          placeholder={t("training.modal.planNamePlaceholder")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.description")}</label>
        <textarea
          value={planForm.description}
          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
          className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none resize-none text-sm"
          rows={3}
          placeholder={t("training.modal.descriptionPlaceholder")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.duration")}</label>
          <input
            type="text"
            value={planForm.duration}
            onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
            placeholder={t("training.modal.durationPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.workoutsPerWeek")}</label>
          <select
            value={planForm.workoutsPerWeek}
            onChange={(e) => setPlanForm({ ...planForm, workoutsPerWeek: e.target.value ? Number.parseInt(e.target.value) : "" })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          >
            <option value="">{t("training.modal.select")}</option>
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>{n}x per week</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.difficulty")}</label>
          <select
            value={planForm.difficulty}
            onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          >
            <option value="Beginner">{t("training.difficulty.beginner")}</option>
            <option value="Intermediate">{t("training.difficulty.intermediate")}</option>
            <option value="Advanced">{t("training.difficulty.advanced")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-muted mb-2">{t("training.modal.category")}</label>
          <select
            value={planForm.category}
            onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
            className="w-full bg-surface-card rounded-xl px-4 py-3 text-content-primary border border-border focus:border-primary outline-none text-sm"
          >
            <option value="Full Body">{t("training.categories.fullBody")}</option>
            <option value="Upper Body">{t("training.categories.upperBody")}</option>
            <option value="Lower Body">{t("training.categories.lowerBody")}</option>
            <option value="Cardio">{t("training.categories.cardio")}</option>
            <option value="Strength">{t("training.categories.strength")}</option>
            <option value="Flexibility">{t("training.categories.flexibility")}</option>
          </select>
        </div>
      </div>
    </div>
  );

  const ExerciseLibrary = () => (
    <div>
      <h3 className="hidden lg:block text-base font-semibold text-content-primary mb-4">{t("training.modal.exerciseLibrary")}</h3>
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
              onClick={() => { haptic.light(); onAddExercise(video) }}
              className="p-1.5 bg-primary hover:bg-primary-hover rounded-lg transition-colors flex-shrink-0"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        ))}
        {availableVideos.length === 0 && (
          <div className="text-center py-8 text-content-muted text-sm">
            <p>{t("training.modal.noExercises")}</p>
            <p className="text-xs mt-1">{t("training.modal.allSelected")}</p>
          </div>
        )}
      </div>
    </div>
  );

  const SelectedExercises = () => (
    <div>
      <h3 className="hidden lg:block text-base font-semibold text-content-primary mb-4">
        {t("training.modal.selectedExercises", { count: selectedExercises.length })}
      </h3>
      {selectedExercises.length === 0 ? (
        <div className="text-center py-8 text-content-muted">
          <Target size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("training.modal.noSelected")}</p>
          <p className="text-xs mt-1">{t("training.modal.addFromLibrary")}</p>
        </div>
      ) : (
        <div className="space-y-2 lg:max-h-96 lg:overflow-y-auto">
          {selectedExercises.map((exercise, index) => {
            const video = typeof exercise.video === "string" ? getVideoById(exercise.videoId) : exercise.video;
            return (
              <div key={index} className="bg-surface-card rounded-xl p-3 flex items-center gap-3">
                <img
                  src={video.thumbnail?.url || "/placeholder.svg"}
                  alt={video.title}
                  className="w-12 h-9 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-content-primary text-sm truncate">{video.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getDifficultyColor(video?.difficulty)}`}>
                      {video?.difficulty}
                    </span>
                    <span className="text-content-faint text-xs">{video?.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => { haptic.warning(); onRemoveExercise(index) }}
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
        onClick={onCreatePlan}
        disabled={!planForm.name || selectedExercises.length === 0}
        className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white text-sm transition-colors flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Create Plan
      </button>
    </div>
  );

  // ==========================================
  // Mobile tab config
  // ==========================================
  const mobileTabs = [
    { key: 'details', label: t("training.modal.tabDetails") },
    { key: 'library', label: t("training.modal.tabLibrary", { count: availableVideos.length }) },
    { key: 'selected', label: t("training.modal.tabSelected", { count: selectedExercises.length }) },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-[1000]">

      {/* ===== MOBILE — bottom sheet with tabs ===== */}
      <div className="lg:hidden flex flex-col w-full h-[95dvh] bg-surface-base rounded-t-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-content-primary">{t("training.modal.createTitle")}</h2>
          <button onClick={handleClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-muted" />
          </button>
        </div>

        <div className="flex border-b border-border px-4 flex-shrink-0">
          {mobileTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { haptic.light(); setMobileTab(tab.key) }}
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
          <h2 className="text-xl font-bold text-content-primary">{t("training.modal.createTitle")}</h2>
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

export default CreatePlanModal;
