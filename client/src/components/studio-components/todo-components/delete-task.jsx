/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// DeleteModal.jsx
import React from "react";

const DeleteModal = ({ isOpen, task, onCancel, onConfirm }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-surface-card rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-content-primary text-lg font-medium mb-2">Confirm Delete</h3>
        <p className="text-content-secondary text-sm mb-6">
          Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="bg-surface-button text-sm text-content-secondary px-4 py-2 rounded-xl hover:bg-surface-button"
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
