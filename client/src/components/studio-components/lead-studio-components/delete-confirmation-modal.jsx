/* eslint-disable react/prop-types */
import { X, AlertTriangle } from "lucide-react"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Trial Appointment",
  message = "Are you sure you want to delete this trial appointment? This action cannot be undone.",
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4">
      <div className="bg-surface-base w-full max-w-md rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-400" />
            {title}
          </h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-content-secondary text-sm leading-relaxed">{message}</p>
        </div>

        <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
