/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AlertTriangle, Trash2, X } from "lucide-react"

export const AdminDeleteContractModal = ({ isOpen, onClose, onDelete, contract }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 md:p-4 p-2">
      <div className="bg-surface-base rounded-2xl w-full max-w-3xl border border-border shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-content-primary font-semibold text-lg">Delete Ongoing Contract</h3>
                <p className="text-content-muted text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-button rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-content-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-accent-red/5 border border-accent-red/20 rounded-xl">
            <p className="text-accent-red text-sm font-medium">
              You are about to delete an ongoing contract{contract?.studioName ? ` for ${contract.studioName}` : ''}.
            </p>
            <p className="text-content-secondary text-sm mt-2">
              This contract has not been fully executed and may have legal implications if deleted.
              The studio will be notified about this change.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex md:flex-row flex-col gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-surface-button text-sm hover:bg-surface-button text-content-primary rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-3 px-4 text-sm bg-accent-red hover:bg-accent-red/80 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
