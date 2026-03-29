/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { DEFAULT_ADMIN_CANCELLATION_REASONS } from "../../../utils/admin-panel-states/admin-contract-states"

export function AdminCancelContractModal({ contract, onClose, onSubmit }) {
  const { t, i18n } = useTranslation()

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
    cancellationType: "extraordinary",
    notificationRule: true,
  })

  const formatDateDisplay = (dateStr) => {
    return new Date(dateStr + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getCancellationInfo = () => {
    if (!contract?.endDate) return null
    const contractStartDate = contract.startDate ? new Date(contract.startDate + 'T00:00') : null
    const contractEndDate = new Date(contract.endDate + 'T00:00')
    const oneMonthBefore = new Date(contractEndDate)
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    return {
      cancellationPeriod: t("admin.contract.cancelModal.oneMonth"),
      latestCancellationDate: oneMonthBefore.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }),
      contractEndDate: contractEndDate.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }),
      contractStartDate: contractStartDate ? contractStartDate.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      contractEndDateISO: contract.endDate,
    }
  }

  const cancellationInfo = getCancellationInfo()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updates = { ...cancelData, [name]: value }
    if (name === 'cancellationType' && value === 'throughAdmin') {
      updates.notificationRule = true
    }
    setCancelData(updates)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      reason: cancelData.reason === "other" ? (cancelData.customReason.trim() || t("admin.contract.modal.other")) : cancelData.reason,
      cancelDate: cancelData.cancelDate || null,
      cancelToDate: cancelData.cancelToDate || null,
      cancellationType: cancelData.cancellationType,
      extraordinaryCancellation: cancelData.cancellationType === "extraordinary",
      cancellationThroughAdmin: cancelData.cancellationType === "throughAdmin",
      notificationRule: cancelData.notificationRule,
    })
  }

  const isFormValid = cancelData.reason && (cancelData.reason !== "other" || cancelData.customReason.trim()) && cancelData.cancelDate && cancelData.cancelToDate

  const cancellationTypeOptions = [
    { id: "extraordinary", label: t("admin.contract.cancelModal.extraordinary") },
    { id: "throughAdmin", label: t("admin.contract.cancelModal.throughAdmin") },
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
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.cancelModal.title")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {/* Contract Information */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.modal.contractInfo")}</label>
            <div className="bg-surface-dark p-3 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted">{t("admin.contract.cancelModal.studio")}</span>
                <span className="text-xs text-content-primary font-medium">{contract?.studioName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted">{t("admin.contract.modal.contractType")}</span>
                <span className="text-xs text-content-primary font-medium">{contract?.contractType || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted">{t("admin.contract.cancelModal.contractPeriod")}</span>
                <span className="text-xs text-content-primary">
                  {cancellationInfo ? `${cancellationInfo.contractStartDate} — ${cancellationInfo.contractEndDate}` : 'N/A'}
                </span>
              </div>
              {cancellationInfo && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-muted">{t("admin.contract.cancelModal.cancellationPeriod")}</span>
                    <span className="text-xs text-content-primary">{cancellationInfo.cancellationPeriod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-muted">{t("admin.contract.cancelModal.latestCancelDate")}</span>
                    <span className="text-xs text-content-primary">{cancellationInfo.latestCancellationDate}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cancellation Type */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.cancelModal.cancellationType")}</label>
            <div className="space-y-1.5">
              {cancellationTypeOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    cancelData.cancellationType === option.id ? "border-primary/40 bg-primary/5" : "border-border bg-surface-dark/40 hover:bg-surface-dark/70"
                  }`}
                >
                  <input type="radio" name="cancellationType" value={option.id} checked={cancelData.cancellationType === option.id} onChange={handleInputChange} className="primary-radio" />
                  <span className="text-content-primary text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.modal.reason")} <span className="text-accent-red">*</span></label>
            <CustomSelect
              name="reason"
              value={cancelData.reason}
              onChange={handleInputChange}
              options={[
                ...DEFAULT_ADMIN_CANCELLATION_REASONS.map((reason) => ({ value: reason, label: reason })),
                { divider: true },
                { value: "other", label: t("admin.contract.modal.other") },
              ]}
              placeholder={t("admin.contract.cancelModal.selectCancelReason")}
              searchable
            />
            {cancelData.reason === "other" && (
              <input type="text" value={cancelData.customReason} onChange={(e) => setCancelData({ ...cancelData, customReason: e.target.value })}
                placeholder={t("admin.contract.modal.pleaseSpecify")}
                className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
            )}
          </div>

          {/* Cancellation Entry Date */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.cancelModal.entryDate")} <span className="text-accent-red">*</span></label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelDate ? formatDateDisplay(cancelData.cancelDate) : t("admin.contract.modal.selectDate")}
              </span>
              <DatePickerField value={cancelData.cancelDate} onChange={(val) => setCancelData({ ...cancelData, cancelDate: val })} minDate={today} maxDate={contract?.endDate || undefined} />
            </div>
          </div>

          {/* Contract End Date */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.cancelModal.contractEndDate")} <span className="text-accent-red">*</span></label>
            <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
              <span className={`flex-1 text-sm ${cancelData.cancelToDate ? 'text-content-primary' : 'text-content-muted'}`}>
                {cancelData.cancelToDate ? formatDateDisplay(cancelData.cancelToDate) : t("admin.contract.modal.selectDate")}
              </span>
              <DatePickerField value={cancelData.cancelToDate} onChange={(val) => setCancelData({ ...cancelData, cancelToDate: val })} minDate={today} maxDate={contract?.endDate || undefined} />
            </div>
          </div>

          {/* Notification Rule */}
          <div className={`bg-surface-dark/60 p-4 rounded-xl border border-border ${cancelData.cancellationType === 'throughAdmin' ? 'opacity-60' : ''}`}>
            <label className={`flex items-center space-x-2 ${cancelData.cancellationType === 'throughAdmin' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <input type="checkbox" name="notificationRule"
                checked={cancelData.cancellationType === 'throughAdmin' ? true : cancelData.notificationRule}
                onChange={(e) => { if (cancelData.cancellationType !== 'throughAdmin') setCancelData({ ...cancelData, notificationRule: e.target.checked }) }}
                disabled={cancelData.cancellationType === 'throughAdmin'} className="primary-check" />
              <span className="text-content-secondary text-sm">{t("admin.contract.cancelModal.notification")}</span>
            </label>
          </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 pt-4 flex-shrink-0 border-t border-border">
            <button type="button" onClick={onClose} className="flex-1 py-2 px-4 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors">
              {t("admin.contract.cancelModal.discard")}
            </button>
            <button type="submit" disabled={!isFormValid}
              className={`flex-1 py-2 px-4 text-white text-sm rounded-xl transition-colors ${isFormValid ? "bg-primary hover:bg-primary-hover" : "bg-surface-button text-content-muted cursor-not-allowed"}`}>
              {t("admin.contract.cancelModal.confirmBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
