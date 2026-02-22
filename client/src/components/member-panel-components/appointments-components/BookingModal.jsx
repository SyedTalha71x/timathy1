/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

const BookingModal = ({
  show,
  onClose,
  onConfirm,
  selectedService,
  selectedMonth,
  selectedDate,
  selectedYear,
  selectedTimeSlot,
  months,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">Confirm Booking</h3>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-hover rounded-xl p-4">
            <p className="text-content-primary font-medium text-sm">{selectedService?.name}</p>
            <p className="text-content-muted text-xs mt-1">
              {months[selectedMonth]} {selectedDate}, {selectedYear} at{" "}
              {selectedTimeSlot?.start} - {selectedTimeSlot?.end}
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-blue-400 font-medium mb-2 text-sm">Contingent Information</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-content-muted">Current Contingent:</span>
                <span className="text-content-primary">{selectedService?.contingentUsage} sessions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">After Booking:</span>
                <span className="text-content-primary">{selectedService?.contingentUsage - 1} sessions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
