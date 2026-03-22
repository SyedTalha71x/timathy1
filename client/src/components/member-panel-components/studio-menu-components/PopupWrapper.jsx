/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";
import useKeyboardHeight from "../../../hooks/useKeyboardHeight";

const PopupWrapper = ({ title, onClose, children }) => {
  const viewportHeight = useKeyboardHeight();

  return (
    <div
      className="absolute inset-x-0 top-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50"
      style={{ height: viewportHeight ?? "100%" }}
    >
      <div className="bg-surface-card rounded-xl p-4 sm:p-5 md:p-6 max-w-md w-full max-h-[85%] overflow-y-auto border border-border shadow-2xl">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
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
        <div className="text-content-secondary space-y-2 text-sm sm:text-base">{children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
