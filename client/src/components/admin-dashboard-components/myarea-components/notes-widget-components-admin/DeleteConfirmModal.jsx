/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
// DeleteConfirmModal.jsx
import Modal from "./Modal"

function DeleteConfirmModal({ isOpen, onClose, onConfirm, noteTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Note">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-300 mb-4">
            Do you really want to delete "{noteTitle}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal