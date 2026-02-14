/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FileText } from "lucide-react";

const DraftModal = ({ show, onClose, onDiscard, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-content-primary">Save as Draft?</h3>
            <p className="text-sm text-content-faint">Your changes will be saved</p>
          </div>
        </div>
        <p className="text-content-muted text-sm mb-6">
          You have unsent content. Would you like to save it as a draft?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
