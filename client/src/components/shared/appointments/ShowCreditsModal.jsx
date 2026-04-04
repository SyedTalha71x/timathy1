/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Plus, Lock, Info, CreditCard, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next"

export default function CreditsModalMain({
  // New prop names
  showCreditsModalMain,
  setShowCreditsModalMain,
  tempCreditsMain,
  setTempCreditsMain,
  handleSaveCreditsMain,
  // Legacy prop names for backwards compatibility
  showContingentModalMain,
  setShowContingentModalMain,
  tempContingentMain,
  setTempContingentMain,
  handleSaveContingentMain,
  // Shared props
  selectedMemberForAppointmentsMain,
  getBillingPeriodsMain,
  selectedBillingPeriodMain,
  handleBillingPeriodChange,
  setShowAddBillingPeriodModalMain,
  currentBillingPeriodMain,
}) {
  // Support both old and new prop names
  const isOpen = showCreditsModalMain ?? showContingentModalMain;
  const setIsOpen = setShowCreditsModalMain || setShowContingentModalMain;
  const tempData = tempCreditsMain || tempContingentMain || { used: 0, total: 0 };
  const setTempData = setTempCreditsMain || setTempContingentMain;
  const handleSave = handleSaveCreditsMain || handleSaveContingentMain;

  const { t } = useTranslation()
  if (!isOpen) return null;

  const usedPercentage = tempData.total > 0 
    ? Math.round((tempData.used / tempData.total) * 100) 
    : 0;
  
  const remaining = tempData.total - tempData.used;
  const isLowCredits = remaining <= 2 && remaining >= 0;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-surface-card rounded-2xl w-full max-w-lg border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-dark">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <CreditCard className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-content-primary">{t("studioCalendar.credits.manage")}</h2>
              <p className="text-content-muted text-sm mt-0.5">
                {selectedMemberForAppointmentsMain?.name || t("studioCalendar.member")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-surface-button-hover text-content-muted hover:text-content-primary rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Credits Overview Card */}
          <div className="bg-surface-dark rounded-xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-content-muted">{t("studioCalendar.credits.currentBalance")}</span>
              {isLowCredits && (
                <span className="flex items-center gap-1.5 text-xs text-accent-yellow bg-accent-yellow/10 px-2.5 py-1 rounded-full border border-accent-yellow/20">
                  <Sparkles size={12} />
                  Low Credits
                </span>
              )}
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-content-primary">{remaining}</span>
              <span className="text-content-faint text-lg mb-1">/ {tempData.total}</span>
              <span className="text-content-faint text-sm mb-1.5 ml-1">{t("studioCalendar.credits.remaining")}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2.5 bg-surface-button rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usedPercentage > 80 
                      ? 'bg-accent-red' 
                      : usedPercentage > 50 
                        ? 'bg-accent-yellow'
                        : 'bg-primary'
                  }`}
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-content-faint">
                <span>{tempData.used} {t("studioCalendar.credits.used")}</span>
                <span>{usedPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Billing Period Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-content-secondary mb-3">
              <Calendar size={14} className="text-content-faint" />
              Billing Period
            </label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              {selectedMemberForAppointmentsMain &&
                getBillingPeriodsMain(selectedMemberForAppointmentsMain.id).map((period) => {
                  const isSelected = selectedBillingPeriodMain === period.id;
                  const periodUsedPercent = period.data.total > 0 
                    ? Math.round((period.data.used / period.data.total) * 100) 
                    : 0;
                  
                  return (
                    <button
                      key={period.id}
                      onClick={() => handleBillingPeriodChange(period.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary/30"
                          : "bg-surface-dark border-border hover:border-content-faint"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-content-primary'}`}>
                          {period.label}
                        </span>
                        <span className={`text-sm ${isSelected ? 'text-primary' : 'text-content-muted'}`}>
                          {period.data.used} / {period.data.total}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-button rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isSelected ? 'bg-primary' : 'bg-content-faint'
                          }`}
                          style={{ width: `${periodUsedPercent}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Add New Billing Period */}
            <button
              onClick={() => setShowAddBillingPeriodModalMain(true)}
              className="w-full mt-3 p-4 border-2 border-dashed border-border rounded-xl text-content-faint hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Add Future Billing Period
            </button>
          </div>

          {/* Credits Management */}
          <div className="bg-surface-dark rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-content-faint" />
              <h3 className="text-content-primary font-medium text-sm">
                {selectedBillingPeriodMain === "current"
                  ? t("studioCalendar.credits.currentPeriod", { period: currentBillingPeriodMain })
                  : t("studioCalendar.credits.futurePeriod", { period: selectedBillingPeriodMain })}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Used Credits */}
              <div>
                <label className="block text-xs text-content-faint mb-2">
                  Used Credits
                </label>
                <input
                  type="number"
                  min={0}
                  max={tempData.total}
                  value={tempData.used}
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      used: Math.max(0, Number.parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-3 text-sm border border-border focus:border-primary focus:outline-none transition-all"
                />
              </div>

              {/* Total Credits */}
              <div>
                <label className="flex items-center gap-2 text-xs text-content-faint mb-2">
                  Total Credits
                  {selectedBillingPeriodMain === "current" && (
                    <span className="flex items-center gap-1 text-accent-yellow">
                      <Lock size={10} />
                      <span className="text-[10px]">{t("studioCalendar.credits.locked")}</span>
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min={selectedBillingPeriodMain === "current" ? tempData.used : 0}
                  value={tempData.total}
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      total: Math.max(0, Number.parseInt(e.target.value) || 0),
                    })
                  }
                  disabled={selectedBillingPeriodMain === "current"}
                  className={`w-full rounded-xl px-4 py-3 text-sm border transition-all focus:outline-none ${
                    selectedBillingPeriodMain === "current"
                      ? "bg-surface-card text-content-faint cursor-not-allowed border-border/50"
                      : "bg-surface-card text-content-primary border-border focus:border-primary"
                  }`}
                />
              </div>
            </div>

            {/* Remaining Summary */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-content-muted">{t("studioCalendar.credits.remainingCredits")}</span>
              <span className={`text-lg font-semibold ${
                remaining <= 0 ? 'text-accent-red' : remaining <= 2 ? 'text-accent-yellow' : 'text-accent-green'
              }`}>
                {remaining} {t("studioCalendar.credits.creditsUnit")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-surface-dark">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 text-sm text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm text-white bg-primary hover:bg-primary-hover rounded-xl transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Legacy export for backwards compatibility
export { CreditsModalMain as ContingentModalMain };
