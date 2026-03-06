/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

export function CancelContractModal({ contract, onClose, onSubmit }) {
  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const today = getTodayDate()

  const [cancelData, setCancelData] = useState({
    reason: "",
    customReason: "",
    cancelDate: today,
    cancelToDate: contract?.endDate || "",
    cancellationType: "extraordinary", // "extraordinary" | "throughStudio"
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
  ]

  // Calculate cancellation information
  const getCancellationInfo = () => {
    if (!contract?.endDate) return null

    const contractStartDate = contract.startDate ? new Date(contract.startDate + 'T00:00') : null
    const contractEndDate = new Date(contract.endDate + 'T00:00')
    const oneMonthBefore = new Date(contractEndDate)
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    return {
      cancellationPeriod: "1 Month",
      latestCancellationDate: oneMonthBefore.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      contractEndDate: contractEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      contractStartDate: contractStartDate ? contractStartDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      contractEndDateISO: contract.endDate,
    }
  }

  const cancellationInfo = getCancellationInfo()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updates = { ...cancelData, [name]: value }
    if (name === 'cancellationType' && value === 'throughStudio') {
      updates.notificationRule = true
    }
    setCancelData(updates)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      reason: cancelData.reason === "other" ? (cancelData.customReason.trim() || "Other") : cancelData.reason,
      cancelDate: cancelData.cancelDate || null,
      cancelToDate: cancelData.cancelToDate || null,
      cancellationType: cancelData.cancellationType,
      extraordinaryCancellation: cancelData.cancellationType === "extraordinary",
      cancellationThroughStudio: cancelData.cancellationType === "throughStudio",
      notificationRule: cancelData.notificationRule,
    })
  }

  const isFormValid = cancelData.reason && (cancelData.reason !== "other" || cancelData.customReason.trim()) && cancelData.cancelDate && cancelData.cancelToDate

  const cancellationTypeOptions = [
    { id: "extraordinary", label: "Extraordinary Cancellation" },
    { id: "throughStudio", label: "Cancellation through Studio" },
  ]

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <style>{`
        .primary-radio { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; transition: all 0.15s ease; }
        .primary-radio:checked { border-color: var(--color-primary); border-width: 5px; }
        .primary-radio:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="bg-surface-base rounded-xl w-full max-w-md relative max-h-[80vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h3 className="text-content-primary text-lg font-semibold">Cancel Contract</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {/* Contract Information */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Contract Information</label>
            <div className="bg-surface-dark p-3 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted">Contract Type</span>
                <span className="text-xs text-content-primary font-medium">{contract?.contractType || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted">Contract Period</span>
                <span className="text-xs text-content-primary">
                  {cancellationInfo ? `${cancellationInfo.contractStartDate} — ${cancellationInfo.contractEndDate}` : 'N/A'}
                </span>
              </div>
              {cancellationInfo && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-muted">Cancellation Period</span>
                    <span className="text-xs text-content-primary">{cancellationInfo.cancellationPeriod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-muted">Latest Cancellation Date</span>
                    <span className="text-xs text-content-primary">{cancellationInfo.latestCancellationDate}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cancellation Type — mutually exclusive radio buttons */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Cancellation Type</label>
            <div className="space-y-1.5">
              {cancellationTypeOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    cancelData.cancellationType === option.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-surface-dark/40 hover:bg-surface-dark/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationType"
                    value={option.id}
                    checked={cancelData.cancellationType === option.id}
                    onChange={handleInputChange}
                    className="primary-radio"
                  />
                  <span className="text-content-primary text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Reason <span className="text-accent-red">*</span></label>
            <CustomSelect
              name="reason"
              value={cancelData.reason}
              onChange={handleInputChange}
              options={[
                ...cancellationReasons.map((reason) => ({ value: reason, label: reason })),
                { divider: true },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select cancellation reason"
              searchable
            />
            {cancelData.reason === "other" && (
              <input
                type="text"
                value={cancelData.customReason}
                onChange={(e) => setCancelData({ ...cancelData, customReason: e.target.value })}
                placeholder="Please specify..."
                className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
              />
            )}
          </div>

          {/* Cancellation Entry Date */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Cancellation Entry Date <span className="text-accent-red">*</span></label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelDate
                  ? new Date(cancelData.cancelDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelDate: val })}
                minDate={today}
                maxDate={contract?.endDate || undefined}
              />
            </div>
          </div>

          {/* Contract End Date */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">
              Contract End Date <span className="text-accent-red">*</span>
            </label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelToDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelToDate
                  ? new Date(cancelData.cancelToDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelToDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelToDate: val })}
                minDate={today}
                maxDate={contract?.endDate || undefined}
              />
            </div>
          </div>

          {/* Notification Rule */}
          <div className={`bg-surface-dark/60 p-4 rounded-xl border border-border ${cancelData.cancellationType === 'throughStudio' ? 'opacity-60' : ''}`}>
            <label className={`flex items-center space-x-2 ${cancelData.cancellationType === 'throughStudio' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="notificationRule"
                checked={cancelData.cancellationType === 'throughStudio' ? true : cancelData.notificationRule}
                onChange={(e) => {
                  if (cancelData.cancellationType !== 'throughStudio') {
                    setCancelData({ ...cancelData, notificationRule: e.target.checked })
                  }
                }}
                disabled={cancelData.cancellationType === 'throughStudio'}
                className="primary-check"
              />
              <span className="text-content-secondary text-sm">
                Send cancellation notification via email
              </span>
            </label>
          </div>

          </div>

          {/* Fixed Footer */}
          <div className="flex gap-3 p-6 pt-4 flex-shrink-0 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-2 px-4 text-white text-sm rounded-xl transition-colors ${
                isFormValid
                  ? "bg-primary hover:bg-primary-hover"
                  : "bg-surface-button text-content-muted cursor-not-allowed"
              }`}
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
