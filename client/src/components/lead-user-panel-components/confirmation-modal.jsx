/* eslint-disable react/prop-types */
const ConfirmationModal = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 text-white">{message}</h3>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}


export default ConfirmationModal