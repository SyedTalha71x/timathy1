/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Info, AlertTriangle } from "lucide-react"
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
    cancelToDate: "",
    cancellationType: "regular", // "regular" | "extraordinary" | "throughStudio"
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

    const contractEndDate = new Date(contract.endDate + 'T00:00')
    const oneMonthBefore = new Date(contractEndDate)
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    return {
      cancellationPeriod: "1 Month",
      latestCancellationDate: oneMonthBefore.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      contractEndDate: contractEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      contractEndDateISO: contract.endDate,
    }
  }

  const cancellationInfo = getCancellationInfo()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCancelData({ ...cancelData, [name]: value })
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

  // Info text based on cancellation type and dates
  const getInfoText = () => {
    if (!cancelData.cancelToDate && !cancellationInfo) return null

    const effectiveEndDate = cancelData.cancelToDate
      ? new Date(cancelData.cancelToDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : cancellationInfo?.contractEndDate

    if (cancelData.cancellationType === "extraordinary") {
      return `This is an extraordinary cancellation. The contract will end on ${effectiveEndDate || 'the selected date'}.`
    }
    if (cancelData.cancellationType === "throughStudio") {
      return `This cancellation is initiated by the studio. The contract will end on ${effectiveEndDate || 'the selected date'}.`
    }
    if (cancelData.cancelToDate) {
      return `The contract will be cancelled and end on ${effectiveEndDate}. The member retains access until this date.`
    }
    return null
  }

  const isFormValid = cancelData.reason && cancelData.cancelDate

  const cancellationTypeOptions = [
    { id: "regular", label: "Regular Cancellation", description: "Standard cancellation following contract terms" },
    { id: "extraordinary", label: "Extraordinary Cancellation", description: "Special circumstances (e.g. relocation, health)" },
    { id: "throughStudio", label: "Cancellation through Studio", description: "Initiated by the studio (e.g. house ban, claims)" },
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
      <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
          <X size={20} />
        </button>

        <h3 className="text-content-primary text-lg font-semibold mb-4">Cancel Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract Information */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Contract Information</label>
            <div className="bg-surface-dark p-3 rounded-xl border border-border">
              <p className="text-content-primary text-sm">{contract?.contractType}</p>
              <p className="text-xs text-content-muted">
                {contract?.startDate
                  ? new Date(contract.startDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'N/A'}
                {' — '}
                {contract?.endDate
                  ? new Date(contract.endDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'N/A'}
              </p>
              {cancellationInfo && (
                <p className="text-xs text-content-faint mt-1">
                  Cancellation period: {cancellationInfo.cancellationPeriod} (latest: {cancellationInfo.latestCancellationDate})
                </p>
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
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
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
                    className="primary-radio mt-0.5"
                  />
                  <div>
                    <span className="text-content-primary text-sm font-medium">{option.label}</span>
                    <p className="text-content-faint text-xs mt-0.5">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Reason</label>
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
            <label className="text-sm text-content-muted">Cancellation Entry Date</label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelDate
                  ? new Date(cancelData.cancelDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelDate: val })}
              />
            </div>
          </div>

          {/* Cancel To Date */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">
              Contract End Date <span className="text-content-faint">(optional)</span>
            </label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelToDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelToDate
                  ? new Date(cancelData.cancelToDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : contract?.endDate
                    ? `Default: ${new Date(contract.endDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : 'Select date'}
              </span>
              <DatePickerField
                value={cancelData.cancelToDate}
                onChange={(val) => setCancelData({ ...cancelData, cancelToDate: val })}
                minDate={today}
              />
            </div>
            <p className="text-xs text-content-faint">
              Leave empty to use the regular contract end date{cancellationInfo ? ` (${cancellationInfo.contractEndDate})` : ''}.
            </p>
          </div>

          {/* Info Box */}
          {getInfoText() && (
            <div className={`flex items-start gap-2.5 rounded-xl p-3 ${
              cancelData.cancellationType === "extraordinary"
                ? "bg-orange-500/10 border border-orange-500/20"
                : cancelData.cancellationType === "throughStudio"
                  ? "bg-accent-red/10 border border-accent-red/20"
                  : "bg-primary/10 border border-primary/20"
            }`}>
              <Info size={16} className={`flex-shrink-0 mt-0.5 ${
                cancelData.cancellationType === "extraordinary"
                  ? "text-orange-400"
                  : cancelData.cancellationType === "throughStudio"
                    ? "text-accent-red"
                    : "text-primary"
              }`} />
              <div className="text-xs text-content-secondary leading-relaxed">
                {getInfoText()}
              </div>
            </div>
          )}

          {/* Notification Rule */}
          <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="notificationRule"
                checked={cancelData.notificationRule}
                onChange={(e) => setCancelData({ ...cancelData, notificationRule: e.target.checked })}
                className="primary-check"
              />
              <span className="text-content-secondary text-sm">
                Send cancellation notification via email
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
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
                  ? "bg-accent-red hover:bg-accent-red/80"
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
