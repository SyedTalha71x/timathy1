/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";

const PopupWrapper = ({ title, onClose, children }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-surface-card rounded-xl max-w-md w-full max-h-[85dvh] sm:max-h-[80dvh] border border-border shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-content-primary">{title}</h3>
          <button
            onClick={() => { haptic.light(); onClose(); }}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
          <div className="text-content-secondary space-y-2 text-sm sm:text-base">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PopupWrapper;
