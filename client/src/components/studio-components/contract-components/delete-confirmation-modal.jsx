/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
// Create a new file: delete-confirmation-modal.jsx
import { AlertTriangle } from "lucide-react"

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  documentName 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-70 p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-white text-lg font-medium">Delete Document</h3>
        </div>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{documentName}"</span>? 
          This action cannot be undone.
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete Document
          </button>
        </div>
      </div>
    </div>
  )
}