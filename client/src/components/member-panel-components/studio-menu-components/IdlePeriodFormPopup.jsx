/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";
import KeyboardSpacer from "../../../components/shared/KeyboardSpacer";

const IdlePeriodFormPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-surface-card rounded-xl max-w-md w-full max-h-[85dvh] sm:max-h-[80dvh] border border-border shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-content-primary">Apply for Idle Period</h3>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <label className="block text-content-muted text-xs sm:text-sm mb-1">Reason for idle period*</label>
              <select className="w-full bg-surface-button text-content-primary rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                <option>Select reason...</option>
                <option>Vacation</option>
                <option>Medical</option>
                <option>Business Travel</option>
                <option>Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-content-muted text-xs sm:text-sm mb-1">Start Date*</label>
              <input type="date" className="w-full bg-surface-button text-content-primary rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
            </div>

            <div className="relative">
              <label className="block text-content-muted text-xs sm:text-sm mb-1">Duration*</label>
              <select className="w-full bg-surface-button text-content-primary rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                <option>Select duration...</option>
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>2 months</option>
                <option>3 months</option>
              </select>
            </div>

            <div>
              <label className="block text-content-muted text-xs sm:text-sm mb-1">Document</label>
              <div className="border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-content-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-content-muted text-xs sm:text-sm">Click to upload or drag and drop</p>
                <p className="text-content-faint text-[10px] sm:text-xs">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <button onClick={() => { haptic.success(); }}
              className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
              Apply for Idle Period
            </button>
          </div>
          <KeyboardSpacer />
        </div>
      </div>
    </div>
  );
};

export default IdlePeriodFormPopup;
