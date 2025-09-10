/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from "react"
import { X } from "lucide-react"

const NotifyMemberModal = ({
  isOpen,
  onClose,
  notifyAction,
  actuallyHandleCancelAppointment,
  handleNotifyMember,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Notify Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-white text-sm">
            Do you want to notify the member about this{" "}
            {notifyAction === "change"
              ? "change"
              : notifyAction === "cancel"
              ? "cancellation"
              : notifyAction === "delete"
              ? "deletion"
              : "booking"}
            ?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={() => {
              if (notifyAction === "cancel") {
                actuallyHandleCancelAppointment(true)
              } else {
                handleNotifyMember(true)
              }
              onClose()
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Yes, Notify Member
          </button>
          <button
            onClick={() => {
              if (notifyAction === "cancel") {
                actuallyHandleCancelAppointment(false)
              } else {
                handleNotifyMember(false)
              }
              onClose()
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

export default NotifyMemberModal
