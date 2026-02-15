
/* eslint-disable react/prop-types */
import { X } from "lucide-react"

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "Cancel", isDestructive = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        className="bg-surface-base rounded-xl p-6 max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-content-primary">{title}</h3>
        )}
        <div className="text-content-secondary mb-6">{message}</div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-xl ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
