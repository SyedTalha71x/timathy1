/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const IdlePeriodFormPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 max-w-md w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Apply for Idle Period</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Reason for idle period*</label>
            <select className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base">
              <option>Select reason...</option>
              <option>Vacation</option>
              <option>Medical</option>
              <option>Business Travel</option>
              <option>Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Start Date*</label>
            <input type="date" className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
          </div>

          <div className="relative">
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Duration*</label>
            <select className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base">
              <option>Select duration...</option>
              <option>1 week</option>
              <option>2 weeks</option>
              <option>1 month</option>
              <option>2 months</option>
              <option>3 months</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Document</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-3 sm:p-4 text-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-400 text-xs sm:text-sm">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-[10px] sm:text-xs">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
            Apply for Idle Period
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdlePeriodFormPopup;
