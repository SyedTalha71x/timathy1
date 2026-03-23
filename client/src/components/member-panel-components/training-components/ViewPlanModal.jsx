/* eslint-disable react/prop-types */
import { Play, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { haptic } from '../../../utils/haptic';

export const ViewPlanModal = ({
  isOpen,
  selectedPlan,
  onClose,
  // getVideoById,
  getDifficultyColor,
  onVideoClick
}) => {
  const { t } = useTranslation();
  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-surface-base rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg sm:text-xl font-bold text-content-primary mb-2 truncate">{selectedPlan.name}</h2>
              <p className="text-content-muted text-sm sm:text-base">{selectedPlan.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Plan Info */}
            <div className="lg:col-span-1">
              <div className="bg-surface-card rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-content-primary mb-4">{t("training.modal.planDetails")}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-content-muted text-sm">{t("training.modal.createdBy")}</span>
                    <span className="text-content-primary text-sm truncate ml-2">{selectedPlan.createdBy?.firstName}{selectedPlan.createdBy?.lastName}</span>
                  </div>
                  {selectedPlan.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-content-muted text-sm">{t("training.modal.duration")}</span>
                      <span className="text-content-primary text-sm">{selectedPlan.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-content-muted text-sm">{t("training.modal.difficulty")}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(selectedPlan.difficulty)}`}
                    >
                      {selectedPlan.difficulty}
                    </span>
                  </div>
                  {selectedPlan.workoutsPerWeek && (
                    <div className="flex items-center justify-between">
                      <span className="text-content-muted text-sm">{t("training.modal.workoutsPerWeek")}</span>
                      <span className="text-content-primary text-sm">{selectedPlan.workoutsPerWeek}x</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-content-muted text-sm">{t("training.modal.category")}</span>
                    <span className="text-content-primary text-sm truncate ml-2">{selectedPlan.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="lg:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold text-content-primary mb-4">
                {t("training.modal.exercises", { count: selectedPlan.exercises.length })}
              </h3>
              <div className="space-y-4">
                {selectedPlan.exercises.map((exercise, index) => {
                  const video =
                    typeof exercise.video === "string"
                      ? getVideoById(exercise.video)
                      : exercise.video;
                  // safely skip if video not found

                  return (
                    <div key={index} className="bg-surface-card rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="bg-primary text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <img
                          src={video.thumbnail?.url || "/placeholder.svg"}
                          alt={video.title}
                          className="w-16 sm:w-20 h-12 sm:h-15 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-content-primary mb-1 text-sm sm:text-base truncate">
                            {video?.title}
                          </h4>
                          <p className="text-content-muted text-xs sm:text-sm mb-2 truncate">{video?.instructor}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {video.targetMuscles?.map((muscle) => (
                              <span
                                key={muscle}
                                className="bg-surface-button text-content-secondary px-2 py-1 rounded text-xs"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => { haptic.light(); onVideoClick(video) }}
                          className="p-1.5 sm:p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg transition-colors flex-shrink-0"
                        >
                          <Play size={14} className="text-content-muted" />
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