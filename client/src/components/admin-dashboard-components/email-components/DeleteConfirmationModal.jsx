/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item"
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              Confirm Delete
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-zinc-700 rounded-lg text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to delete "{itemName}"? This action cannot be undone.
            </p>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm"
              >
                Delete {itemType}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal