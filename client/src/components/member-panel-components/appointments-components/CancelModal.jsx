/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const CancelModal = ({ show, onClose, onConfirm, appointmentToCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
          {appointmentToCancel?.status === "pending" ? "Cancel Request" : "Cancel Booking"}
        </h3>

        <p className="text-gray-300 mb-4 text-sm sm:text-base">
          Are you sure you want to cancel this{" "}
          {appointmentToCancel?.status === "pending" ? "request" : "booking"}?
        </p>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-white font-medium text-sm sm:text-base">{appointmentToCancel?.service}</p>
          <p className="text-gray-400 text-xs sm:text-sm">
            {appointmentToCancel?.date} at {appointmentToCancel?.time}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors text-sm sm:text-base"
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
