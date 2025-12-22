/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { User, X } from 'lucide-react';

export default function ViewMemberConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  memberName 
}) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60  z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-[#1C1C1C] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
             
              <h3 className="text-lg font-semibold text-white">View Member Details</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-300 text-center text-sm mb-2">
              Do you want to view the profile details of
            </p>
            <p className="text-white font-semibold text-center text-lg mb-3">
              {memberName}?
            </p>
            <p className="text-sm text-gray-500 text-center">
              You will be redirected to their member details page.
            </p>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}