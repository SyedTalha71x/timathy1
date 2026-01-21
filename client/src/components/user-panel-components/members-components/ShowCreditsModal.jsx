/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Plus, Lock, Info, CreditCard, TrendingUp, Calendar, Sparkles } from "lucide-react";

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

  const usedPercentage = tempData.total > 0 
    ? Math.round((tempData.used / tempData.total) * 100) 
    : 0;
  
  const remaining = tempData.total - tempData.used;
  const isLowCredits = remaining <= 2 && remaining >= 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-[#141414] rounded-2xl w-full max-w-lg border border-[#2a2a2a] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a] bg-gradient-to-r from-[#1a1a1a] to-[#141414]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CreditCard className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Manage Credits</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {selectedMemberForAppointmentsMain?.name || "Member"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[#2a2a2a] text-gray-400 hover:text-white rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Credits Overview Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-5 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Current Balance</span>
              {isLowCredits && (
                <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Sparkles size={12} />
                  Low Credits
                </span>
              )}
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-white">{remaining}</span>
              <span className="text-gray-500 text-lg mb-1">/ {tempData.total}</span>
              <span className="text-gray-500 text-sm mb-1.5 ml-1">credits remaining</span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usedPercentage > 80 
                      ? 'bg-gradient-to-r from-red-500 to-red-400' 
                      : usedPercentage > 50 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{tempData.used} used</span>
                <span>{usedPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Billing Period Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Calendar size={14} className="text-gray-500" />
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
                          ? "bg-blue-500/10 border-blue-500/30"
                          : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium text-sm ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                          {period.label}
                        </span>
                        <span className={`text-sm ${isSelected ? 'text-blue-300' : 'text-gray-400'}`}>
                          {period.data.used} / {period.data.total}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isSelected ? 'bg-blue-500' : 'bg-gray-600'
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
              className="w-full mt-3 p-4 border-2 border-dashed border-[#2a2a2a] rounded-xl text-gray-500 hover:border-blue-500/30 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Add Future Billing Period
            </button>
          </div>

          {/* Credits Management */}
          <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-gray-500" />
              <h3 className="text-white font-medium text-sm">
                {selectedBillingPeriodMain === "current"
                  ? `Current Period (${currentBillingPeriodMain})`
                  : `Future Period (${selectedBillingPeriodMain})`}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Used Credits */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
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
                  className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm border border-[#2a2a2a] focus:border-blue-500/50 focus:outline-none transition-all"
                />
              </div>

              {/* Total Credits */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  Total Credits
                  {selectedBillingPeriodMain === "current" && (
                    <span className="flex items-center gap-1 text-amber-500">
                      <Lock size={10} />
                      <span className="text-[10px]">Locked</span>
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
                      ? "bg-[#0a0a0a] text-gray-500 cursor-not-allowed border-[#1a1a1a]"
                      : "bg-[#141414] text-white border-[#2a2a2a] focus:border-blue-500/50"
                  }`}
                />
              </div>
            </div>

            {/* Remaining Summary */}
            <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
              <span className="text-sm text-gray-400">Remaining Credits</span>
              <span className={`text-lg font-semibold ${
                remaining <= 0 ? 'text-red-400' : remaining <= 2 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {remaining} credits
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#2a2a2a] bg-[#1a1a1a]">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/20"
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
