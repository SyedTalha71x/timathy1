/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Plus, Lock, Info } from "lucide-react";

export default function ContingentModalStaff({
  showContingentModalStaff,
  setShowContingentModalStaff,
  selectedStaffForAppointmentsStaff,
  getBillingPeriodsStaff,
  selectedBillingPeriodStaff,
  handleBillingPeriodChangeStaff,
  setShowAddBillingPeriodModalStaff,
  currentBillingPeriodStaff,
  tempContingentStaff,
  setTempContingentStaff,
  handleSaveContingentStaff,
}) {
  if (!showContingentModalStaff) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              Manage Appointment Contingent
            </h2>
            <button
              onClick={() => setShowContingentModalStaff(false)}
              className="p-2 hover:bg-zinc-700 text-white rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* Billing Period Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Select Billing Period
            </label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {selectedStaffForAppointmentsStaff &&
                getBillingPeriodsStaff(selectedStaffForAppointmentsStaff.id).map(
                  (period) => (
                    <button
                      key={period.id}
                      onClick={() => handleBillingPeriodChangeStaff(period.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        selectedBillingPeriodStaff === period.id
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-[#222222] border-gray-600 text-gray-300 hover:bg-[#2A2A2A]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{period.label}</span>
                        <span className="text-sm">
                          {period.data.used}/{period.data.total}
                        </span>
                      </div>
                    </button>
                  )
                )}
            </div>
            {/* Add New Billing Period */}
            <button
              onClick={() => setShowAddBillingPeriodModalStaff(true)}
              className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Future Billing Period
            </button>
          </div>

          {/* Contingent Management */}
          <div className="space-y-4">
            <div className="bg-[#222222] rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">
                {selectedBillingPeriodStaff === "current"
                  ? `Current Period (${currentBillingPeriodStaff})`
                  : `Future Period (${selectedBillingPeriodStaff})`}
              </h3>
              <div className="flex items-center gap-4">
                {/* Used Appointments */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">
                    Used Appointments
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={tempContingentStaff.total}
                    value={tempContingentStaff.used}
                    onChange={(e) =>
                      setTempContingentStaff({
                        ...tempContingentStaff,
                        used: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#333333] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                {/* Total Appointments */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    Total Appointments
                    {selectedBillingPeriodStaff === "current" && (
                      <Lock
                        size={14}
                        className="text-gray-500"
                        title="Locked for current period"
                      />
                    )}
                  </label>
                  <input
                    type="number"
                    min={
                      selectedBillingPeriodStaff === "current"
                        ? tempContingentStaff.used
                        : 0
                    }
                    value={tempContingentStaff.total}
                    onChange={(e) =>
                      setTempContingentStaff({
                        ...tempContingentStaff,
                        total: Number.parseInt(e.target.value),
                      })
                    }
                    disabled={selectedBillingPeriodStaff === "current"}
                    className={`w-full rounded-xl px-4 py-2 text-sm ${
                      selectedBillingPeriodStaff === "current"
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#333333] text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Remaining */}
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-gray-400">Remaining:</span>
                <span className="text-white font-medium">
                  {tempContingentStaff.total - tempContingentStaff.used} appointments
                </span>
              </div>
            </div>

           
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => setShowContingentModalStaff(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContingentStaff}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}