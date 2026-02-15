/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X, Calendar, User, ArrowRight } from "lucide-react"


export const ContractHistoryModal = ({ contract, history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-[100000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-xl text-content-primary p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Contract History - {contract.memberName}
          </h2>
          <button onClick={onClose} className="text-content-secondary hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <div className="bg-surface-dark rounded-xl p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contract Changes History</h3>
            <div className="space-y-3">
              {history.map((change) => (
                <div key={change.id} className="bg-surface-base rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-content-primary">{change.action}</p>
                      <p className="text-sm text-content-muted">
                        {change.date} by {change.performedBy}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-content-secondary">{change.details}</p>
                    {change.oldValue && change.newValue && (
                      <div className="flex gap-4 mt-2">
                        <div>
                          <span className="text-accent-red text-xs">From: </span>
                          <span className="text-content-secondary text-xs">{change.oldValue}</span>
                        </div>
                        <div>
                          <span className="text-accent-green text-xs">To: </span>
                          <span className="text-content-secondary text-xs">{change.newValue}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-content-muted">No contract history recorded</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-surface-button hover:bg-surface-button text-content-primary px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}