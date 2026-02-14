/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react"
import { AlertTriangle } from "lucide-react"
import { formatCurrency } from "../../../utils/studio-states/selling-states"

const CancelSaleConfirmationModal = ({ sale, onConfirm, onClose }) => {
  const isCreditCard = sale.paymentMethod === "Credit Card"
  
  return (
    <div 
      className="fixed inset-0 open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[10000003] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface-base rounded-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex flex-col items-center mb-5">
            <div className="bg-red-500/20 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-content-primary text-lg open_sans_font_700 text-center">
              Cancel Sale
            </h2>
            <p className="text-content-muted text-center text-sm mt-2">
              Are you sure you want to cancel this sale? A reversal entry will be created in the sales journal.
            </p>
          </div>

          {/* Sale Details */}
          <div className="bg-surface-dark rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-content-muted text-sm">Member</span>
              <span className="text-content-primary text-sm font-medium">{sale.member}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-muted text-sm">Total</span>
              <span className="text-content-primary text-sm font-medium">{formatCurrency(sale.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-muted text-sm">Payment</span>
              <span className="text-content-primary text-sm font-medium">{sale.paymentMethod}</span>
            </div>
          </div>
          
          {/* Credit card warning */}
          {isCreditCard && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm">
                Credit card payments already processed cannot be reversed via this cancellation. A cancellation entry will be added for accounting purposes.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-row justify-center items-center gap-3 pt-2">
            <button 
              onClick={onConfirm} 
              className="flex-1 sm:flex-none sm:w-auto px-8 py-2.5 bg-red-500 text-sm text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Confirm Cancellation
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 sm:flex-none sm:w-auto px-8 py-2.5 bg-transparent text-sm text-content-secondary rounded-xl border border-border hover:bg-surface-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelSaleConfirmationModal
