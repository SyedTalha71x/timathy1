/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { toast } from "react-toastify"

export default function NotifyMemberModal({ isOpen, onClose, notifyAction }) {
  if (!isOpen) return null

  const getMessage = () => {
    switch (notifyAction) {
      case "book":
        return "Would you like to notify the member about their new appointment?"
      case "change":
        return "Would you like to notify the member about changes to their appointment?"
      case "delete":
        return "Would you like to notify the member that their appointment has been cancelled?"
      default:
        return ""
    }
  }

  const handleConfirm = () => {
    toast.success("Member notified and appointment deleted successfully")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              Notify and Delete Member
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-4">{getMessage()}</p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
            >
              No
            </button>

            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 bg-red-600 text-sm text-white rounded-xl"
            >
              Yes, Notify and delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
