    /* eslint-disable react/no-unescaped-entities */
    /* eslint-disable no-unused-vars */
    /* eslint-disable react/prop-types */
    import React from "react";
    import { X, Info } from "lucide-react";

    export default function AddBillingPeriodModalStaff({
    open,
    newBillingPeriodStaff,
    setNewBillingPeriodStaff,
    onClose,
    onAdd
    }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000000]">
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

            {/* Input Field */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm text-gray-400 mb-2">
                    Billing Period (e.g., "07.14.25 - 07.18.2025")
                </label>
                <input
                    type="text"
                    value={newBillingPeriodStaff}
                    onChange={(e) => setNewBillingPeriodStaff(e.target.value)}
                    placeholder="MM.DD.YY - MM.DD.YYYY"
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                />
                </div>

                {/* Info Box */}
                <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                    <Info className="inline mr-1" size={14} />
                    New billing periods will start with 0 used appointments and 0 total appointments. 
                    You can edit these values after creation.
                </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-6">
                <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                Cancel
                </button>
                <button
                onClick={onAdd}
                disabled={!newBillingPeriodStaff.trim()}
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
