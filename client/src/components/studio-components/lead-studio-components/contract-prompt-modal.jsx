/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Plus } from 'lucide-react';

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
            Medical History Completed Successfully!
          </h3>
          <p className="text-gray-300">
            Would you like to proceed with creating a contract for {leadName}?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={16} />
            Yes, Create Contract
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-white bg-black rounded-xl border border-slate-600 hover:border-slate-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Back to Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPromptModal;