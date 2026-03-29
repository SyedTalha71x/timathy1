/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { DEFAULT_ADMIN_CONTRACT_PAUSE_REASONS } from "../../../utils/admin-panel-states/admin-contract-states"

export function AdminPauseContractModal({ onClose, onSubmit }) {
  const { t, i18n } = useTranslation()

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

  const isFormValid = reason && (reason !== "other" || customReason.trim()) && startDate && startDate >= getTodayDate() && endDate && endDate > startDate

  const validateForm = () => {
    const newErrors = {}
    const today = getTodayDate()
    
    if (!reason) newErrors.reason = t("admin.contract.pauseModal.errReason")
    if (!startDate) newErrors.startDate = t("admin.contract.pauseModal.errStartDate")
    else if (startDate < today) newErrors.startDate = t("admin.contract.pauseModal.errStartDatePast")
    if (!endDate) newErrors.endDate = t("admin.contract.pauseModal.errEndDate")
    else if (endDate < today) newErrors.endDate = t("admin.contract.pauseModal.errEndDatePast")
    if (startDate && endDate && endDate <= startDate) newErrors.endDate = t("admin.contract.pauseModal.errEndDateBeforeStart")
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit({ reason: reason === "other" ? (customReason.trim() || t("admin.contract.modal.other")) : reason, startDate, endDate })
  }

  const formatDateDisplay = (dateStr) => {
    return new Date(dateStr + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-surface-base rounded-xl w-full max-w-md relative max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.pauseModal.title")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-content-muted">
                {t("admin.contract.modal.reason")} <span className="text-accent-red">*</span>
              </label>
              <CustomSelect
                name="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  if (errors.reason) setErrors({ ...errors, reason: null })
                }}
                options={[
                  ...DEFAULT_ADMIN_CONTRACT_PAUSE_REASONS.map(r => ({ value: r.name, label: r.name })),
                  { divider: true },
                  { value: "other", label: t("admin.contract.modal.other") },
                ]}
                placeholder={t("admin.contract.modal.selectReason")}
              />
              {errors.reason && <p className="text-accent-red text-xs">{errors.reason}</p>}
              {reason === "other" && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t("admin.contract.modal.pleaseSpecify")}
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-content-muted">
                {t("admin.contract.modal.startDate")} <span className="text-accent-red">*</span>
              </label>
              <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border ${errors.startDate ? 'border-accent-red' : 'border-border'}`}>
                <span className={`flex-1 text-sm ${startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                  {startDate ? formatDateDisplay(startDate) : t("admin.contract.pauseModal.selectStartDate")}
                </span>
                <DatePickerField
                  value={startDate}
                  onChange={(val) => {
                    setStartDate(val)
                    if (errors.startDate) setErrors({ ...errors, startDate: null })
                    if (endDate && val > endDate) setEndDate("")
                  }}
                  minDate={getTodayDate()}
                />
              </div>
              {errors.startDate && <p className="text-accent-red text-xs">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-content-muted">
                {t("admin.contract.modal.endDate")} <span className="text-accent-red">*</span>
              </label>
              <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border ${errors.endDate ? 'border-accent-red' : 'border-border'}`}>
                <span className={`flex-1 text-sm ${endDate ? 'text-content-primary' : 'text-content-muted'}`}>
                  {endDate ? formatDateDisplay(endDate) : t("admin.contract.pauseModal.selectEndDate")}
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
          </div>

          {/* Fixed Footer */}
          <div className="flex gap-3 p-6 pt-4 flex-shrink-0 border-t border-border">
            <button type="button" onClick={onClose} className="flex-1 py-2 px-4 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors">
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-2 px-4 text-sm rounded-xl transition-colors ${
                isFormValid ? "bg-primary text-white hover:bg-primary-hover" : "bg-surface-button text-content-muted cursor-not-allowed"
              }`}
            >
              {t("admin.contract.pauseModal.pauseBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
