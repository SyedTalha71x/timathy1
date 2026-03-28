/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { getTranslation } from '../../shared/LanguageTabs';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productToDelete }) => {
  if (!isOpen) return null;

  const productName = getTranslation(productToDelete?.productName, "en");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-auto border-t sm:border border-[#333333] shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-500/15 p-2.5 rounded-xl mr-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Confirm Deletion</h2>
          </div>

          <p className="text-sm sm:text-base text-gray-300 mb-6">
            Are you sure you want to delete <strong>"{productName}"</strong>? All translations will be permanently removed. This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#2F2F2F] text-sm hover:bg-[#3F3F3F] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-sm hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
