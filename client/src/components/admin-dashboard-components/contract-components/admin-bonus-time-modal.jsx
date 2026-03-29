/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { DEFAULT_ADMIN_CONTRACT_BONUS_TIME_REASONS } from "../../../utils/admin-panel-states/admin-contract-states"

export function AdminBonusTimeModal({ contract, onClose, onSubmit, onDelete }) {
  const { t, i18n } = useTranslation()

  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const existingBonus = contract?.bonusTime
  const isEditMode = !!existingBonus

  const [bonusAmount, setBonusAmount] = useState(existingBonus?.bonusAmount || 1)
  const [bonusUnit, setBonusUnit] = useState(existingBonus?.bonusUnit || "days")
  const reasonPresets = DEFAULT_ADMIN_CONTRACT_BONUS_TIME_REASONS.map(r => r.name)
  const initReason = existingBonus?.reason || ""
  const isPresetReason = reasonPresets.includes(initReason)
  const [reason, setReason] = useState(isPresetReason ? initReason : (initReason ? "other" : ""))
  const [customReason, setCustomReason] = useState(isPresetReason ? "" : initReason)
  const [startOption, setStartOption] = useState(existingBonus?.startOption || "current_contract_period")
  const [startDate, setStartDate] = useState(existingBonus?.startDate || "")
  const [bonusPeriod, setBonusPeriod] = useState(existingBonus?.bonusPeriod || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setBonusPeriod(calculateBonusPeriod())
  }, [startOption, startDate, bonusAmount, bonusUnit])

  const calculateBonusPeriod = () => {
    if (startOption === "fixed_time" && startDate) {
      const start = new Date(startDate)
      const end = new Date(start)
      applyDurationToDate(end, bonusAmount, bonusUnit)
      return `${formatDate(start)} - ${formatDate(end)}`
    } else if (startOption === "current_contract_period" && contract?.endDate) {
      const start = new Date(contract.endDate)
      const end = new Date(start)
      applyDurationToDate(end, bonusAmount, bonusUnit)
      return `${formatDate(start)} - ${formatDate(end)}`
    }
    return ""
  }

  const applyDurationToDate = (date, amount, unit) => {
    switch (unit) {
      case "days": date.setDate(date.getDate() + amount); break
      case "weeks": date.setDate(date.getDate() + amount * 7); break
      case "months": date.setMonth(date.getMonth() + amount); break
    }
    return date
  }

  const formatDate = (date) =>
    date.toLocaleDateString(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" })

  const formatDateDisplay = (dateStr) =>
    new Date(dateStr + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })

  const isFormValid = reason && (reason !== "other" || customReason.trim())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return
    onSubmit({
      id: existingBonus?.id || `bt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      contractId: contract.id,
      bonusAmount,
      bonusUnit,
      reason: reason === "other" ? (customReason.trim() || t("admin.contract.modal.other")) : (reason || null),
      startOption,
      startDate: startOption === "fixed_time" ? startDate : null,
      bonusPeriod: bonusPeriod || "",
      createdAt: existingBonus?.createdAt || new Date().toISOString().split("T")[0],
    })
  }

  const handleDelete = () => { if (onDelete) onDelete() }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4">
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-surface-card rounded-2xl w-full max-w-sm p-6 mx-4 shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-red/20 rounded-xl flex items-center justify-center">
                <Trash2 className="text-accent-red" size={20} />
              </div>
              <div>
                <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.bonusModal.removeTitle")}</h3>
              </div>
            </div>
            <p className="text-content-secondary mb-6 text-sm">{t("admin.contract.bonusModal.removeConfirm")}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-dark transition-colors">
                {t("common.cancel")}
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-accent-red text-sm text-white rounded-xl hover:bg-accent-red/80 transition-colors">
                {t("common.remove")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-base rounded-xl w-full max-w-md relative overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-content-primary font-semibold">
              {isEditMode ? t("admin.contract.bonusModal.editTitle") : t("admin.contract.bonusModal.addTitle")}
            </h3>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-content-muted">{t("admin.contract.bonusModal.reasonLabel")} <span className="text-accent-red">*</span></label>
              <CustomSelect name="reason" value={reason} onChange={(e) => setReason(e.target.value)}
                options={[
                  ...DEFAULT_ADMIN_CONTRACT_BONUS_TIME_REASONS.map(r => ({ value: r.name, label: r.name })),
                  { divider: true },
                  { value: "other", label: t("admin.contract.modal.other") },
                ]}
                placeholder={t("admin.contract.modal.selectReason")} />
              {reason === "other" && (
                <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t("admin.contract.modal.pleaseSpecify")}
                  className="w-full mt-2 bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-content-muted">{t("admin.contract.bonusModal.startOfBonus")}</label>
              <CustomSelect name="startOption" value={startOption} onChange={(e) => setStartOption(e.target.value)}
                options={[
                  { value: "current_contract_period", label: t("admin.contract.bonusModal.endOfContractPeriod") },
                  { value: "fixed_time", label: t("admin.contract.bonusModal.fixedTime") },
                ]} />
            </div>

            {startOption === "fixed_time" && (
              <div className="space-y-2">
                <label className="text-sm text-content-muted">{t("admin.contract.modal.startDate")}</label>
                <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
                  <span className={`flex-1 text-sm ${startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                    {startDate ? formatDateDisplay(startDate) : t("admin.contract.modal.selectDate")}
                  </span>
                  <DatePickerField value={startDate} onChange={(val) => setStartDate(val)} minDate={getTodayDate()} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-content-muted">{t("admin.contract.bonusModal.durationLabel")}</label>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <input type="number" min="1" value={bonusAmount} onChange={(e) => setBonusAmount(Number.parseInt(e.target.value))}
                    className="w-full bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex-1">
                  <CustomSelect name="bonusUnit" value={bonusUnit} onChange={(e) => setBonusUnit(e.target.value)}
                    options={[
                      { value: "days", label: t("admin.contract.bonusModal.unitDays") },
                      { value: "weeks", label: t("admin.contract.bonusModal.unitWeeks") },
                      { value: "months", label: t("admin.contract.bonusModal.unitMonths") },
                    ]} />
                </div>
              </div>
              {bonusPeriod && <div className="text-sm text-content-muted">{t("admin.contract.bonusModal.bonusPeriod")} {bonusPeriod}</div>}
            </div>
            <div className="flex justify-between items-center gap-2 mt-8 pt-4 border-t border-border">
              {isEditMode ? (
                <button type="button" onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-surface-dark text-sm text-accent-red rounded-xl border border-border hover:bg-accent-red/10 hover:border-accent-red/50 transition-colors flex items-center gap-2">
                  <Trash2 size={14} /> {t("common.remove")}
                </button>
              ) : (<div />)}
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-dark transition-colors">
                  {t("common.cancel")}
                </button>
                <button type="submit" disabled={!isFormValid}
                  className={`px-4 py-2 text-sm rounded-xl transition-colors ${isFormValid ? "bg-primary text-white hover:bg-primary-hover" : "bg-surface-button text-content-muted cursor-not-allowed"}`}>
                  {isEditMode ? t("admin.contract.bonusModal.updateBtn") : t("admin.contract.bonusModal.addBtn")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
