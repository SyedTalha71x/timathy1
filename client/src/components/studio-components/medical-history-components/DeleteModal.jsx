/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const DeleteModal = ({ showDeleteModal, setShowDeleteModal, formToDelete, handleDeleteConfirm, handleDeleteCancel }) => {
    if (!showDeleteModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface-base rounded-lg p-6 w-full max-w-md border border-border mx-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
            <p className="text-content-secondary text-sm">
              Are you sure you want to delete the form "{formToDelete?.title}"? This action cannot be undone.
            </p>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-content-secondary text-sm hover:text-content-primary transition-colors border border-border rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-sm text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteModal;
