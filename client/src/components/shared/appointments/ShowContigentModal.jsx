/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Plus, Minus, Calendar } from "lucide-react";

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
        className="bg-[#181818] rounded-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-medium text-white">Credits</h2>
            <p className="text-gray-500 text-sm">
              {selectedMemberForAppointmentsMain?.name || "Member"}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Display */}
          <div className="text-center">
            <div className="flex items-end justify-center gap-2">
              <span className="text-5xl font-bold text-white">{remaining}</span>
              <span className="text-2xl text-gray-500 mb-1">/ {tempData.total}</span>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              credits remaining
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustRemaining(-1)}
              disabled={remaining <= 0}
              className="w-16 h-16 flex items-center justify-center bg-[#222222] hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Minus size={28} />
            </button>

            <button
              onClick={() => adjustRemaining(1)}
              disabled={remaining >= tempData.total}
              className="w-16 h-16 flex items-center justify-center bg-[#222222] hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>

          {/* Visual Progress */}
          <div className="bg-[#222222] rounded-xl p-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Used: {tempData.used}</span>
              <span>Total: {tempData.total}</span>
            </div>
            <div className="h-2 bg-[#333333] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 bg-blue-500"
                style={{ width: `${(remaining / tempData.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Billing Period - Compact */}
          <div className="bg-[#222222] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                Period
              </span>
              <button
                onClick={() => setShowAddBillingPeriodModalMain(true)}
                className="text-xs text-blue-400 hover:text-blue-300"
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
                        ? "bg-blue-600/20 text-blue-400"
                        : "hover:bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    <span>{period.label}</span>
                    <span className={isSelected ? "text-blue-300" : "text-gray-500"}>
                      {periodRemaining} left
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
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
