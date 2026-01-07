/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const ContractPromptModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  leadName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-6 h-6 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Assessment Completed Successfully!
          </h3>
          <p className="text-gray-300">
            Would you like to proceed with creating a contract for {leadName}?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 text-sm bg-[#FF5733] text-white rounded-lg hover:bg-[#E64D2E] transition-colors font-medium"
          >
            Yes, Create Contract
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm bg-[#2F2F2F] text-gray-300 border border-gray-600 rounded-lg hover:bg-[#3F3F3F] transition-colors"
          >
            No, Return to Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPromptModal;