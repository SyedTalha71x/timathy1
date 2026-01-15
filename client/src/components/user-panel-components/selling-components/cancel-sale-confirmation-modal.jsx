/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react"

const CancelSaleConfirmationModal = ({ sale, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#2F2F2F] rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Confirm Sale Cancellation</h3>
        </div>
        <div className="p-4">
          <p className="text-white mb-3">Are you sure you want to cancel this sale?</p>
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-4">
            <p className="text-yellow-200 text-sm font-medium mb-2">⚠️ Important Notice:</p>
            <p className="text-yellow-100 text-sm">
              Credit card payments that have already been processed cannot be cancelled. Only the journal entry will be
              removed.
            </p>
          </div>
          <div className="bg-black rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm">
              Member: <span className="text-white">{sale.member}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Total: <span className="text-white">${sale.totalAmount.toFixed(2)}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Payment: <span className="text-white">{sale.paymentMethod}</span>
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm">
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelSaleConfirmationModal
