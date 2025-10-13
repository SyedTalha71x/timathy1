/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const BookingModal = ({
  show,
  onClose,
  onConfirm,
  selectedService,
  selectedMonth,
  selectedDate,
  selectedYear,
  selectedTimeSlot,
  timeSlots,
  months,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Confirm Booking</h3>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-white font-medium text-sm sm:text-base">{selectedService?.name}</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {months[selectedMonth]} {selectedDate}, {selectedYear} at{" "}
              {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">Contingent Information</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Contingent:</span>
                <span className="text-white">8 sessions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">After Booking:</span>
                <span className="text-white">7 sessions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-colors text-sm sm:text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
