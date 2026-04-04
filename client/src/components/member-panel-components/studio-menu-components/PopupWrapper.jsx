/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";

const PopupWrapper = ({ title, onClose, children }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)" }}>
      <div className="bg-surface-card rounded-xl w-full sm:max-w-lg max-h-full border border-border shadow-2xl flex flex-col">
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
        <div className="flex-1 min-h-0 overflow-y-auto mx-4 sm:mx-5 md:mx-6 mb-4 sm:mb-5 md:mb-6 rounded-xl bg-white">
          <div className="wysiwyg-content text-gray-700 text-sm sm:text-base p-4 sm:p-5 pb-8 sm:pb-10">{children}</div>
          <style>{`
            .wysiwyg-content h1 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; color: #1a1a1a; }
            .wysiwyg-content h2 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; color: #1a1a1a; }
            .wysiwyg-content h3 { font-size: 1.1em; font-weight: 600; margin: 0.5em 0; color: #1a1a1a; }
            .wysiwyg-content p { margin: 0.4em 0; line-height: 1.6; }
            .wysiwyg-content ul, .wysiwyg-content ol { padding-left: 1.5em; margin: 0.4em 0; }
            .wysiwyg-content li { margin: 0.2em 0; }
            .wysiwyg-content ul li { list-style-type: disc; }
            .wysiwyg-content ol li { list-style-type: decimal; }
            .wysiwyg-content a { color: #3b82f6; text-decoration: underline; }
            .wysiwyg-content strong { font-weight: 700; }
            .wysiwyg-content em { font-style: italic; }
            .wysiwyg-content u { text-decoration: underline; }
            .wysiwyg-content s { text-decoration: line-through; }
            .wysiwyg-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.5em 0; }
            .wysiwyg-content blockquote { border-left: 3px solid #d1d5db; padding-left: 1em; margin: 0.5em 0; color: #6b7280; }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default PopupWrapper;
