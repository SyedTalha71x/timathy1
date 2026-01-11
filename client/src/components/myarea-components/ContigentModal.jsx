/* eslint-disable react/prop-types */
import { X, Plus, Lock, Info } from "lucide-react"

export default function ContingentModal({
  show,
  setShow,
  selectedMember,
  getBillingPeriods,
  selectedBillingPeriod,
  handleBillingPeriodChange,
  setShowAddBillingPeriodModal,
  tempContingent,
  setTempContingent,
  currentBillingPeriod,
  handleSaveContingent,
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              Manage Appointment Contingent
            </h2>
            <button
              onClick={() => setShow(false)}
              className="p-2 hover:bg-zinc-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* Billing Periods */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Select Billing Period
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {selectedMember &&
                getBillingPeriods(selectedMember.id).map((period) => (
                  <button
                    key={period.id}
                    onClick={() => handleBillingPeriodChange(period.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedBillingPeriod === period.id
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
                ))}
            </div>

            {/* Add New Billing Period */}
            <button
              onClick={() => setShowAddBillingPeriodModal(true)}
              className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Future Billing Period
            </button>
          </div>

          {/* Contingent Management */}
          <div className="space-y-4">
            <div className="bg-[#222222] rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">
                {selectedBillingPeriod === "current"
                  ? `Current Period (${currentBillingPeriod})`
                  : `Future Period (${selectedBillingPeriod})`}
              </h3>

              <div className="flex items-center gap-4">
                {/* Used */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">
                    Used Appointments
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={tempContingent.total}
                    value={tempContingent.used}
                    onChange={(e) =>
                      setTempContingent({
                        ...tempContingent,
                        used: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#333333] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                {/* Total */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    Total Appointments
                    {selectedBillingPeriod === "current" && (
                      <Lock
                        size={14}
                        className="text-gray-500"
                        title="Locked for current period"
                      />
                    )}
                  </label>
                  <input
                    type="number"
                    min={selectedBillingPeriod === "current" ? tempContingent.used : 0}
                    value={tempContingent.total}
                    onChange={(e) =>
                      setTempContingent({
                        ...tempContingent,
                        total: Number.parseInt(e.target.value),
                      })
                    }
                    disabled={selectedBillingPeriod === "current"}
                    className={`w-full rounded-xl px-4 py-2 text-sm ${
                      selectedBillingPeriod === "current"
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#333333] text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-gray-400">Remaining:</span>
                <span className="text-white font-medium">
                  {tempContingent.total - tempContingent.used} appointments
                </span>
              </div>
            </div>

            {/* Info messages */}
            {selectedBillingPeriod === "current" && (
              <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
                <p className="text-yellow-200 text-sm flex items-center gap-2">
                  <Lock size={14} /> Total appointments are locked for the current
                  billing period. You can only edit used appointments.
                </p>
              </div>
            )}

            {selectedBillingPeriod !== "current" && (
              <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                <p className="text-blue-200 text-sm flex items-center gap-2">
                  <Info size={14} /> You can edit both used and total appointments
                  for future billing periods.
                </p>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContingent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
