/* eslint-disable react/prop-types */
import { X, Trash2 } from "lucide-react"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item"
}) => {
  if (!isOpen) return null

  const getItemIcon = () => {
    switch (itemType) {
      case "folder":
        return "📁"
      case "template":
        return "📝"
      case "message":
        return "💬"
      default:
        return "📄"
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-surface-card rounded-xl w-full max-w-md mx-4 border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-content-primary">Delete {itemType}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-content-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Warning Box */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-content-secondary">
                  Are you sure you want to delete this {itemType}?
                </p>
                <p className="text-xs text-content-faint mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Item Preview */}
          <div className="bg-surface-dark rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getItemIcon()}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-content-muted mb-0.5">
                  {itemType.charAt(0).toUpperCase() + itemType.slice(1)} to delete:
                </p>
                <p className="text-content-primary font-medium truncate">
                  {itemName || `Untitled ${itemType}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-surface-dark">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-surface-dark hover:bg-surface-button-hover text-content-secondary text-sm font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
