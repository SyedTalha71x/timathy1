/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AlertTriangle, Trash2, X } from "lucide-react"

export const DeleteContractModal = ({ isOpen, onClose, onDelete, contract }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 md:p-4 p-2">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
           
              <div>
                <h3 className="text-white font-semibold text-lg">Delete Ongoing Contract</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm font-medium">
              You are about to delete an ongoing contract.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              This contract has not been fully executed and may have legal implications if deleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex md:flex-row flex-col gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-800 text-sm hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-3 px-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
