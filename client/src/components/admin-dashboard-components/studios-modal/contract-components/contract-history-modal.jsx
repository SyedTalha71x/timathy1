/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X, Calendar, User, ArrowRight } from "lucide-react"

export const ContractHistoryModal = ({ contract, history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-[100000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Contract History - {contract.memberName}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Contract Changes Section */}
        <div className="bg-[#141414] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Contract Changes History</h3>
          <div className="space-y-3">
            {history.map((change) => (
              <div key={change.id} className="bg-[#1C1C1C] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">{change.action}</p>
                    <p className="text-sm text-gray-400">
                      {change.date} by {change.performedBy}
                    </p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-gray-300">{change.details}</p>

                  {change.oldValue && change.newValue && (
                    <div className="flex gap-4 mt-2">
                      <div>
                        <span className="text-red-400 text-xs">From: </span>
                        <span className="text-gray-300 text-xs">
                          {change.oldValue}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-400 text-xs">To: </span>
                        <span className="text-gray-300 text-xs">
                          {change.newValue}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-gray-400">No contract history recorded</p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}
