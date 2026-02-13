/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "No" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-90 p-4">
      <div className="bg-surface-button rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-content-primary mb-4">{title}</h3>
        <p className="text-content-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-base text-content-secondary hover:text-content-primary rounded-lg hover:bg-surface-button transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal