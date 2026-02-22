/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

const CancelModal = ({ show, onClose, onConfirm, appointmentToCancel }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">
          {appointmentToCancel?.status === "pending" ? "Cancel Request" : "Cancel Booking"}
        </h3>

        <p className="text-content-secondary mb-4 text-sm">
          Are you sure you want to cancel this{" "}
          {appointmentToCancel?.status === "pending" ? "request" : "booking"}?
        </p>

        <div className="bg-surface-hover rounded-xl p-4 mb-6">
          <p className="text-content-primary font-medium text-sm">{appointmentToCancel?.service?.name}</p>
          <p className="text-content-muted text-xs mt-1">
            {new Date(appointmentToCancel?.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }).replace(",", "")}
            {" at "}
            {appointmentToCancel?.timeSlot?.start} - {appointmentToCancel?.timeSlot?.end}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelModal
