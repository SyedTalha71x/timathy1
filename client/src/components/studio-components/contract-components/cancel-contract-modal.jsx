/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

export function CancelContractModal({ contract, onClose, onSubmit }) {
  const [cancelData, setCancelData] = useState({
    reason: "",
    cancelDate: "",
    cancelToDate: "",
    extraordinaryCancellation: false,
    cancellationThroughStudio: false,
    notificationRule: true,
  })

  const cancellationReasons = [
    "Financial Reasons",
    "Dissatisfied with Service",
    "Moving Away",
    "Health Issues",
    "Pregnancy",
    "Parental Leave",
    "Personal Reasons",
    "No Fun in Fitness Training",
    "Studio Change",
    "Officially Ordered Studio Closure",
    "Replaced by Flat Rate",
    "Voucher Withdrawn",
    "House Ban",
    "Customer was Archived",
    "Mass Cancellation",
    "Open Claims",
    "Other",
  ]

  // Today as YYYY-MM-DD for min date validation
  const today = new Date().toISOString().split("T")[0]

  // Contract end date as YYYY-MM-DD for max date validation
  const contractEndDateISO = contract?.endDate
    ? new Date(contract.endDate).toISOString().split("T")[0]
    : ""

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCancelData({
      ...cancelData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(cancelData)
  }

  // Calculate cancellation information
  const calculateCancellationDates = () => {
    if (!contract?.endDate) return null

    const contractEndDate = new Date(contract.endDate)
    const oneMonthBefore = new Date(contractEndDate)
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    return {
      cancellationPeriod: "1 Month",
      latestCancellationDate: oneMonthBefore.toLocaleDateString("en-GB"),
      contractEndDate: contractEndDate.toLocaleDateString("en-GB"),
    }
  }

  const cancellationInfo = calculateCancellationDates()

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
          <X size={20} />
        </button>

        <h3 className="text-content-primary text-lg font-semibold mb-4">Cancel Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {cancellationInfo && (
            <div className="bg-surface-dark p-4 rounded-xl border border-border">
              <h4 className="text-content-primary text-sm font-medium mb-3">Cancellation Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-muted">Cancellation Period:</span>
                  <span className="text-content-primary">{cancellationInfo.cancellationPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Latest Possible Cancellation:</span>
                  <span className="text-content-primary">{cancellationInfo.latestCancellationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Contract End Date:</span>
                  <span className="text-content-primary">{cancellationInfo.contractEndDate}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm text-content-muted">
              Cancellation Reason
            </label>
            <CustomSelect
              name="reason"
              value={cancelData.reason}
              onChange={handleInputChange}
              options={cancellationReasons.map((reason) => ({ value: reason, label: reason }))}
              placeholder="Select cancellation reason..."
              searchable
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cancelDate" className="text-sm text-content-muted">
              Cancellation Entry Date
            </label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelDate ? new Date(cancelData.cancelDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelDate: val })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="extraordinaryCancellation"
                checked={cancelData.extraordinaryCancellation}
                onChange={handleInputChange}
                className="primary-check"
              />
              <span className="text-content-primary text-sm">Extraordinary Cancellation</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="cancellationThroughStudio"
                checked={cancelData.cancellationThroughStudio}
                onChange={handleInputChange}
                className="primary-check"
              />
              <span className="text-content-primary text-sm">Cancellation through Studio</span>
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="cancelToDate" className="text-sm text-content-muted">
              Cancel to Date
            </label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelToDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelToDate ? new Date(cancelData.cancelToDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelToDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelToDate: val })}
              />
            </div>
            {contractEndDateISO && (
              <p className="text-xs text-content-faint">
                Must be between today and {new Date(contractEndDateISO).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>

          <div className="bg-surface-dark p-4 rounded-xl border border-border">
            <h4 className="text-content-primary text-sm font-medium mb-2">Notification Rule</h4>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="notificationRule"
                checked={cancelData.notificationRule}
                onChange={handleInputChange}
                className="primary-check"
              />
              <span className="text-content-secondary text-sm">
                Send "Regular Cancellation" notification via email immediately
              </span>
            </label>
          </div>

          <p className="text-sm text-content-muted">
            Note: The cancellation will be effective according to the contract terms and selected date.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
