/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Info } from "lucide-react";

export default function AddBillingPeriodModalMain({
  open,
  newBillingPeriodMain,
  setNewBillingPeriodMain,
  onClose,
  onAdd,
  availableBillingPeriods = [] // Add this prop to receive available periods
}) {
  if (!open) return null;

  // Sample future billing periods - in real app, these would come from your database
  const defaultBillingPeriods = [
    "07.14.25 - 07.18.2025",
    "08.14.25 - 08.18.2025", 
    "09.14.25 - 09.18.2025",
    "10.14.25 - 10.18.2025",
    "11.14.25 - 11.18.2025",
    "12.14.25 - 12.18.2025"
  ];

  const periods = availableBillingPeriods.length > 0 ? availableBillingPeriods : defaultBillingPeriods;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Add Future Billing Period</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 text-white rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* Selection Field */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Select Billing Period
              </label>
              <select
                value={newBillingPeriodMain}
                onChange={(e) => setNewBillingPeriodMain(e.target.value)}
                className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose a billing period...</option>
                {periods.map((period, index) => (
                  <option key={index} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Only future billing periods are available for selection
              </p>
            </div>

            <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
              <p className="text-blue-200 text-sm">
                <Info className="inline mr-1" size={14} />
                New billing periods will start with 0 used appointments and 0 total appointments. 
                You can edit these values after creation.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={!newBillingPeriodMain.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm"
            >
              Add Period
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}