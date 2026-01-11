/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { toast } from "react-hot-toast"

const NotifyMemberModalMain = ({
  isOpen,
  onClose,
  notifyAction,
  pendingEventInfo,
  actuallyHandleCancelAppointment,
  handleNotifyMember,
  setPendingEventInfo,
}) => {
  if (!isOpen) return null

  const handleClose = () => {
    // Cancel action and revert drag/resize if any (for non-cancel flows)
    if (notifyAction === "cancel") {
      // no revert needed for explicit cancellation confirmation
    } else if (pendingEventInfo) {
      pendingEventInfo.revert()
      toast.error("Action cancelled.")
    }
    onClose()
    setPendingEventInfo(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Notify Member</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-white text-sm">Do you want to notify the member about this {notifyAction}?</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          {/* Yes should APPLY the change and set shouldNotify = true */}
          <button
            onClick={() => {
              handleNotifyMember(true)
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Yes, Notify Member
          </button>

          {/* No should NOTIFY = false and revert for drag/resize */}
          <button
            onClick={() => {
              handleNotifyMember(false)
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            No, Don't Notify
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotifyMemberModalMain
