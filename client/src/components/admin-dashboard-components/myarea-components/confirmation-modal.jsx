/* eslint-disable react/prop-types */
import { X } from "lucide-react"

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <p className="text-zinc-400">{message}</p>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700">
                Cancel
              </button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default ConfirmationModal