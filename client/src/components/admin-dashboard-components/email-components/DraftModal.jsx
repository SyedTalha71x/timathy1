/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FileText } from "lucide-react";

const DraftModal = ({ show, onClose, onDiscard, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Save as Draft?</h3>
            <p className="text-sm text-gray-500">Your changes will be saved</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          You have unsent content. Would you like to save it as a draft?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onDiscard}
            className="px-5 py-2.5 bg-[#333333] hover:bg-[#444444] text-white rounded-xl text-sm font-medium transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
