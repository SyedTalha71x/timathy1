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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-md mx-4 border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-white">Delete {itemType}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
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
                <p className="text-sm text-gray-300">
                  Are you sure you want to delete this {itemType}?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Item Preview */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getItemIcon()}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-0.5">
                  {itemType.charAt(0).toUpperCase() + itemType.slice(1)} to delete:
                </p>
                <p className="text-white font-medium truncate">
                  {itemName || `Untitled ${itemType}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2"
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
