/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";

const CancelMembershipPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-surface-card rounded-xl p-4 sm:p-5 md:p-6 max-w-md w-full max-h-[85dvh] sm:max-h-[80dvh] overflow-y-auto border border-border shadow-2xl">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-content-primary">Cancel Membership</h3>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 sm:p-4">
            <h4 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">Cancellation Information</h4>
            <p className="text-content-secondary text-xs sm:text-sm mb-2"><strong className="text-content-primary">Notice Period:</strong> 1 month</p>
            <p className="text-content-secondary text-xs sm:text-sm mb-2"><strong className="text-content-primary">Last Cancellation Date:</strong> December 15, 2025</p>
            <p className="text-content-secondary text-xs sm:text-sm"><strong className="text-content-primary">Cancellation Effective:</strong> January 15, 2026</p>
          </div>

          <p className="text-content-secondary text-xs sm:text-sm">
            If you cancel now, your membership will remain active until January 15, 2026. You will continue to have
            access to all facilities and services until that date.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => { haptic.light(); onClose(); }}
              className="flex-1 bg-surface-button hover:bg-surface-button-hover text-content-primary py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Keep Membership
            </button>
            <button
              onClick={() => { haptic.warning(); }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelMembershipPopup;
