/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export default function ExportConfirmationModal  ({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-medium">Confirm Export</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-gray-300">Are you sure you want to export the transaction data as CSV?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="flex-1 bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    )
  }