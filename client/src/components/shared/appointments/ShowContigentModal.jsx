/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Plus, Minus, Calendar } from "lucide-react";
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

  // Calculate remaining (this is what users care about!)
  const remaining = tempData.total - tempData.used;
  const isCurrentPeriod = selectedBillingPeriodMain === "current";

  // Adjust remaining credits directly (inverted logic!)
  // When user adds remaining, we decrease used
  // When user removes remaining, we increase used
  const adjustRemaining = (amount) => {
    const newRemaining = Math.max(0, remaining + amount);
    const newUsed = tempData.total - newRemaining;
    
    // Can't have negative used
    if (newUsed < 0) return;
    
    setTempData({ ...tempData, used: newUsed });
  };

  // Get billing periods
  const billingPeriods = selectedMemberForAppointmentsMain 
    ? getBillingPeriodsMain(selectedMemberForAppointmentsMain.id) 
    : [];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-surface-card rounded-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-medium text-content-primary">{t("studioCalendar.credits.title")}</h2>
            <p className="text-content-faint text-sm">
              {selectedMemberForAppointmentsMain?.name || t("studioCalendar.member")}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-surface-button-hover text-content-muted hover:text-content-primary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Display */}
          <div className="text-center">
            <div className="flex items-end justify-center gap-2">
              <span className="text-5xl font-bold text-content-primary">{remaining}</span>
              <span className="text-2xl text-content-faint mb-1">/ {tempData.total}</span>
            </div>
            <div className="text-content-muted text-sm mt-1">
              {t("studioCalendar.credits.remaining")}
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustRemaining(-1)}
              disabled={remaining <= 0}
              className="w-16 h-16 flex items-center justify-center bg-surface-dark hover:bg-surface-button-hover disabled:opacity-30 disabled:cursor-not-allowed text-content-primary rounded-xl transition-colors"
            >
              <Minus size={28} />
            </button>

            <button
              onClick={() => adjustRemaining(1)}
              disabled={remaining >= tempData.total}
              className="w-16 h-16 flex items-center justify-center bg-surface-dark hover:bg-surface-button-hover disabled:opacity-30 disabled:cursor-not-allowed text-content-primary rounded-xl transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>

          {/* Visual Progress */}
          <div className="bg-surface-dark rounded-xl p-3">
            <div className="flex justify-between text-xs text-content-faint mb-2">
              <span>{t("studioCalendar.credits.used")}: {tempData.used}</span>
              <span>{t("studioCalendar.credits.total")}: {tempData.total}</span>
            </div>
            <div className="h-2 bg-surface-button rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 bg-primary"
                style={{ width: `${(remaining / tempData.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Billing Period - Compact */}
          <div className="bg-surface-dark rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-content-faint flex items-center gap-1">
                <Calendar size={12} />
                Period
              </span>
              <button
                onClick={() => setShowAddBillingPeriodModalMain(true)}
                className="text-xs text-primary hover:text-primary/80"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1 max-h-[100px] overflow-y-auto">
              {billingPeriods.map((period) => {
                const isSelected = selectedBillingPeriodMain === period.id;
                const periodRemaining = period.data.total - period.data.used;
                return (
                  <button
                    key={period.id}
                    onClick={() => handleBillingPeriodChange(period.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-sm ${
                      isSelected
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-surface-button-hover text-content-secondary"
                    }`}
                  >
                    <span>{period.label}</span>
                    <span className={isSelected ? "text-primary" : "text-content-faint"}>
                      {periodRemaining} {t("studioCalendar.credits.left")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 text-sm text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Legacy export for backwards compatibility
export { CreditsModalMain as ContingentModalMain };
