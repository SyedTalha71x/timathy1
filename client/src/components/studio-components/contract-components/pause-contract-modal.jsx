/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { DEFAULT_CONTRACT_PAUSE_REASONS } from "../../../utils/studio-states/configuration-states"

export function PauseContractModal({ onClose, onSubmit }) {
  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const getNextDay = (dateStr) => {
    const d = new Date(dateStr + 'T00:00')
    d.setDate(d.getDate() + 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    const today = getTodayDate()
    
    if (!reason) {
      newErrors.reason = "Please select a reason"
    }
    if (!startDate) {
      newErrors.startDate = "Please select a start date"
    } else if (startDate < today) {
      newErrors.startDate = "Start date cannot be in the past"
    }
    if (!endDate) {
      newErrors.endDate = "Please select an end date"
    } else if (endDate < today) {
      newErrors.endDate = "End date cannot be in the past"
    }
    if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = "End date must be after start date"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit({ reason: reason === "other" ? (customReason.trim() || "Other") : reason, startDate, endDate })
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-surface-base rounded-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
          <X size={20} />
        </button>
        <h3 className="text-content-primary text-lg font-semibold mb-4">Pause Contract</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm text-content-muted">
              Reason <span className="text-accent-red">*</span>
            </label>
            <CustomSelect
              name="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (errors.reason) setErrors({ ...errors, reason: null })
              }}
              options={[
                ...DEFAULT_CONTRACT_PAUSE_REASONS.map(r => ({ value: r.name, label: r.name })),
                { divider: true },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select a reason"
              className={errors.reason ? '!border-accent-red' : ''}
            />
            {errors.reason && <p className="text-accent-red text-xs">{errors.reason}</p>}
            {reason === "other" && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify..."
                className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
              />
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm text-content-muted">
              Start Date <span className="text-accent-red">*</span>
            </label>
            <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border ${errors.startDate ? 'border-accent-red' : 'border-border'}`}>
              <span className={`flex-1 text-sm ${startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {startDate ? new Date(startDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select start date'}
              </span>
              <DatePickerField
                value={startDate}
                onChange={(val) => {
                  setStartDate(val)
                  if (errors.startDate) setErrors({ ...errors, startDate: null })
                  // Clear end date if it's now before the new start date
                  if (endDate && val > endDate) setEndDate("")
                }}
                minDate={getTodayDate()}
              />
            </div>
            {errors.startDate && <p className="text-accent-red text-xs">{errors.startDate}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm text-content-muted">
              End Date <span className="text-accent-red">*</span>
            </label>
            <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border ${errors.endDate ? 'border-accent-red' : 'border-border'}`}>
              <span className={`flex-1 text-sm ${endDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {endDate ? new Date(endDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select end date'}
              </span>
              <DatePickerField
                value={endDate}
                onChange={(val) => {
                  setEndDate(val)
                  if (errors.endDate) setErrors({ ...errors, endDate: null })
                }}
                minDate={startDate ? getNextDay(startDate) : getTodayDate()}
              />
            </div>
            {errors.endDate && <p className="text-accent-red text-xs">{errors.endDate}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
          >
            Pause Contract
          </button>
        </form>
      </div>
    </div>
  )
}
