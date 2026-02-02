/* eslint-disable react/prop-types */
import { X, Calendar, FileText } from "lucide-react"

export default function ExportConfirmationModal  ({ isOpen, onClose, onConfirm, selectedPeriod, recordCount = 0 }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-medium">Confirm Export</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-gray-300 mb-4">Are you sure you want to export the transaction data as Excel?</p>
            
            {/* Export Details */}
            <div className="space-y-2">
              {/* Selected Period Display */}
              <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-xs">Export Period</p>
                  <p className="text-white text-sm font-medium">{selectedPeriod || "This Month"}</p>
                </div>
              </div>
              
              {/* Record Count Display */}
              <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-xs">Records</p>
                  <p className="text-white text-sm font-medium">{recordCount} {recordCount === 1 ? 'transaction' : 'transactions'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#2F2F2F] text-white px-4 py-2.5 rounded-xl hover:bg-[#3F3F3F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="flex-1 bg-gray-600 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    )
  }
