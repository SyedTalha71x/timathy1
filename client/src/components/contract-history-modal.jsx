/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X, Calendar, User, ArrowRight } from "lucide-react"

export const ContractHistoryModal = ({ contract, history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:p-4 p-2">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between md:p-6 p-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Contract Changes History</h2>
            <p className="text-gray-400 text-sm mt-1">
              {contract.memberName} - {contract.id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="md:p-6 p-3 overflow-y-auto max-h-[60vh]">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No history available for this contract</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="bg-[#141414] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#F27A30] rounded-full mt-2"></div>
                      <div>
                        <h3 className="text-white font-medium">{entry.action}</h3>
                        <p className="text-gray-400 text-sm">{entry.details}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>

                  {entry.oldValue && entry.newValue && (
                    <div className="flex items-center gap-3 mt-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">From</p>
                        <p className="text-sm text-gray-300">{entry.oldValue}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">To</p>
                        <p className="text-sm text-white">{entry.newValue}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Performed by: {entry.performedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
