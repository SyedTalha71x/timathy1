/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// DeleteModal.jsx
import React from "react";

const DeleteModal = ({ isOpen, task, onCancel, onConfirm }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-white text-lg font-medium mb-2">Confirm Delete</h3>
        <p className="text-gray-300 text-sm mb-6">
          Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="bg-[#2F2F2F] text-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-sm text-white px-4 py-2 rounded-xl hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
