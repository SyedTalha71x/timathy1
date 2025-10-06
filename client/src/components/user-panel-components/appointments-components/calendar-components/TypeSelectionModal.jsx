/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";

const TypeSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const handleClick = (type) => {
    onSelect(type);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Select Event Type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => handleClick("trial")}
            className="w-full px-5 py-3 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Trial Planning
          </button>
          <button
            onClick={() => handleClick("appointment")}
            className="w-full px-5 py-3 bg-[#FF843E] text-sm font-medium text-white rounded-xl hover:bg-orange-700 transition-colors"
          >
            Appointment
          </button>
          <button
            onClick={() => handleClick("block")}
            className="w-full px-5 py-3 bg-[#FF4D4F] text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Block Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeSelectionModal;
