/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const DraftModal = ({ show, onClose, onDiscard, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Save as Draft?</h3>
          <p className="text-gray-400 text-sm mb-6">
            You have unsaved changes. Would you like to save this email as a draft?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onDiscard}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
            >
              Discard
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
