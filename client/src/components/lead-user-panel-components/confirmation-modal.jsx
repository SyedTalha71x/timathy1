
/* eslint-disable react/prop-types */
import { X } from "lucide-react"

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "Cancel" }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        className="bg-[#181818] w-[90%] sm:w-[400px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-300 text-sm mb-6">{message}</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-600 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-sm font-medium text-white rounded-xl hover:bg-blue-600 cursor-pointer transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
