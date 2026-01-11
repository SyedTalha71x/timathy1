/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Info } from "lucide-react";

const ContingentModalMain = ({
  showContingentModal,
  setShowContingentModal,
  currentBillingPeriod,
  tempContingent,
  setTempContingent,
  handleSaveContingent,
}) => {
  if (!showContingentModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Manage Appointment Contingent</h2>
            <button
              onClick={() => setShowContingentModal(false)}
              className="p-2 hover:bg-zinc-700 text-white rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Billing Period: {currentBillingPeriod}
              </label>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Used Appointments</label>
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
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Total Appointments</label>
                  <input
                    type="number"
                    min={tempContingent.used}
                    value={tempContingent.total}
                    onChange={(e) =>
                      setTempContingent({
                        ...tempContingent,
                        total: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Remaining: {tempContingent.total - tempContingent.used} appointments
              </p>

              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                  <Info className="inline mr-1" size={14} /> You can edit the contingent for future billing periods here.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowContingentModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContingent}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContingentModalMain;
