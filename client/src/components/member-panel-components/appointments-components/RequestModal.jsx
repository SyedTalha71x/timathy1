/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const RequestModal = ({
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
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Request Appointment</h3>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-white font-medium text-sm sm:text-base">{selectedService?.name}</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {months[selectedMonth]} {selectedDate}, {selectedYear} at{" "}
              {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
            </p>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2 text-sm sm:text-base">Request Information</h4>
            <p className="text-gray-300 text-xs sm:text-sm">
              This time slot is currently unavailable. Your request will be sent to the trainer for approval.
            </p>
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
            className="flex-1 px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white transition-colors text-sm sm:text-base"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
