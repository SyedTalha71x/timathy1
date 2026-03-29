/* eslint-disable react/prop-types */
import { X, Info } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { DEFAULT_ADMIN_CONTRACT_TYPES, DEFAULT_ADMIN_CONTRACT_RENEW_REASONS, adminPlatformData } from "../../../utils/admin-panel-states/admin-contract-states"

export function AdminRenewContractModal({ contract, onClose, onSubmit }) {
  const { t, i18n } = useTranslation()
  const currency = adminPlatformData?.currency || "€"
  const contractTypes = DEFAULT_ADMIN_CONTRACT_TYPES || []

  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const today = getTodayDate()
  const isExpired = contract?.endDate ? contract.endDate < today : false

  const [renewalData, setRenewalData] = useState({
    startAfterCurrent: !isExpired,
    customStartDate: isExpired ? today : "",
    contractType: contract?.contractType || "",
  })

  const [discount, setDiscount] = useState({ percentage: 0, duration: "1", isPermanent: false })
  const [renewReason, setRenewReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  const selectedContractType = contractTypes.find((type) => type.name === renewalData.contractType)

  const formatCost = (type) => !type ? "N/A" : `${currency}${type.cost || 0}`
  const formatDateDisplay = (dateStr) => new Date(dateStr + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })

  const getDurationDisplay = () => {
    if (!selectedContractType?.duration) return ""
    const months = parseInt(selectedContractType.duration)
    return months === 1 ? t("admin.contract.modal.month", { count: 1 }) : t("admin.contract.modal.months", { count: months })
  }

  const getGapDays = () => {
    if (renewalData.startAfterCurrent || !renewalData.customStartDate || !contract?.endDate) return 0
    const endDate = new Date(contract.endDate + 'T00:00')
    const startDate = new Date(renewalData.customStartDate + 'T00:00')
    const diffDays = Math.ceil((startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setRenewalData({ ...renewalData, [name]: type === "checkbox" ? checked : value })
  }

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target
    setDiscount({ ...discount, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return
    let startDate
    if (renewalData.startAfterCurrent && contract?.endDate) {
      const end = new Date(contract.endDate + 'T00:00')
      end.setDate(end.getDate() + 1)
      startDate = end.toISOString().split('T')[0]
    } else {
      startDate = renewalData.customStartDate || today
    }
    let endDate = ""
    if (selectedContractType?.duration) {
      const start = new Date(startDate)
      start.setMonth(start.getMonth() + parseInt(selectedContractType.duration))
      endDate = start.toISOString().split('T')[0]
    }
    onSubmit({
      ...renewalData, startDate, endDate, newContractType: renewalData.contractType, selectedContractType,
      renewReason: renewReason === "other" ? (customReason.trim() || t("admin.contract.modal.other")) : (renewReason || null),
      discount: discount.percentage > 0 ? discount : null,
    })
  }

  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) return null
    const originalPrice = selectedContractType.cost || 0
    const discountAmount = (originalPrice * discount.percentage) / 100
    return { originalPrice, discountAmount, finalPrice: originalPrice - discountAmount, currency }
  }

  const priceCalculation = calculateFinalPrice()
  const isFormValid = renewReason && (renewReason !== "other" || customReason.trim()) && (renewalData.startAfterCurrent || renewalData.customStartDate)

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-muted hover:text-content-primary"><X size={20} /></button>
        <h3 className="text-content-primary text-lg font-semibold mb-4">{t("admin.contract.renewModal.title")}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.modal.contractInfo")}</label>
            <div className="bg-surface-dark p-3 rounded-xl border border-border">
              <p className="text-content-primary text-sm font-medium">{contract?.studioName}</p>
              <p className="text-content-primary text-sm">{t("admin.contract.renewModal.currentContract")}: {contract?.contractType}</p>
              <p className={`text-xs ${isExpired ? 'text-accent-red' : 'text-content-muted'}`}>
                {isExpired ? t("admin.contract.renewModal.expired") : t("admin.contract.renewModal.expires")}: {contract?.endDate ? formatDateDisplay(contract.endDate) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.modal.startDate")}</label>
            <div className="space-y-2">
              {!isExpired && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="startAfterCurrent" checked={renewalData.startAfterCurrent} onChange={handleInputChange} className="primary-check" />
                  <span className="text-content-primary text-sm">{t("admin.contract.renewModal.startAfterCurrent")}</span>
                </label>
              )}
              {!renewalData.startAfterCurrent && (
                <div>
                  {!isExpired && <label className="text-xs text-content-muted block mb-1">{t("admin.contract.renewModal.customStartDate")}</label>}
                  <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
                    <span className={`flex-1 text-sm ${renewalData.customStartDate ? 'text-content-primary' : 'text-content-muted'}`}>
                      {renewalData.customStartDate ? formatDateDisplay(renewalData.customStartDate) : t("admin.contract.modal.selectDate")}
                    </span>
                    <DatePickerField value={renewalData.customStartDate} onChange={(val) => setRenewalData({ ...renewalData, customStartDate: val })} minDate={today} />
                  </div>
                  {!isExpired && getGapDays() > 0 && (
                    <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3 mt-2">
                      <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-content-secondary leading-relaxed">
                        {t("admin.contract.renewModal.gapWarning", { days: getGapDays(), unit: getGapDays() === 1 ? t("admin.contract.renewModal.day") : t("admin.contract.renewModal.days") })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contractType" className="text-sm text-content-muted">{t("admin.contract.modal.contractType")}</label>
            <CustomSelect name="contractType" value={renewalData.contractType} onChange={handleInputChange}
              options={contractTypes.map((type) => ({ value: type.name, label: type.name }))}
              placeholder={t("admin.contract.modal.selectContractType")} searchable />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.modal.reason")} <span className="text-accent-red">*</span></label>
            <CustomSelect name="renewReason" value={renewReason} onChange={(e) => setRenewReason(e.target.value)}
              options={[
                ...DEFAULT_ADMIN_CONTRACT_RENEW_REASONS.map(r => ({ value: r.name, label: r.name })),
                { divider: true },
                { value: "other", label: t("admin.contract.modal.other") },
              ]}
              placeholder={t("admin.contract.modal.selectReason")} />
            {renewReason === "other" && (
              <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)}
                placeholder={t("admin.contract.modal.pleaseSpecify")}
                className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
            )}
          </div>

          {selectedContractType && (
            <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
              <h4 className="text-content-primary text-sm font-medium mb-2">{t("admin.contract.modal.contractDetails")}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.duration")}</span><span className="text-content-primary">{getDurationDisplay()}</span></div>
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.cost")}</span><span className="text-content-primary">{formatCost(selectedContractType)}</span></div>
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.billingPeriod")}</span><span className="text-content-primary capitalize">{selectedContractType.billingPeriod}</span></div>
              </div>
            </div>
          )}

          <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
            <h4 className="text-content-primary text-sm font-medium mb-2">{t("admin.contract.modal.discount")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-content-muted text-xs mb-1">{t("admin.contract.modal.percentage")}</label>
                <input type="number" name="percentage" min="0" max="100" value={discount.percentage} onChange={handleDiscountChange}
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none border border-border" />
              </div>
              <div className={discount.isPermanent ? "opacity-50" : ""}>
                <label className="block text-content-muted text-xs mb-1">{t("admin.contract.modal.billingPeriods")}</label>
                <input type="number" name="duration" min="1" value={discount.duration} onChange={handleDiscountChange} disabled={discount.isPermanent}
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none border border-border" />
              </div>
            </div>
            <div className="mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="isPermanent" checked={discount.isPermanent} onChange={handleDiscountChange} className="primary-check" />
                <span className="text-content-muted text-xs">{t("admin.contract.modal.tillEndOfContract")}</span>
              </label>
            </div>
            {priceCalculation && (
              <div className="mt-4 pt-4 border-t border-border">
                <h5 className="text-content-primary text-sm font-medium mb-2">{t("admin.contract.modal.priceCalc")}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-content-muted">{t("admin.contract.modal.originalPrice")}</span><span className="text-content-primary">{priceCalculation.currency}{priceCalculation.originalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-content-muted">{t("admin.contract.modal.discountAmount", { pct: discount.percentage })}</span><span className="text-accent-red">-{priceCalculation.currency}{priceCalculation.discountAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2"><span className="text-content-primary font-medium">{t("admin.contract.modal.finalPrice")}</span><span className="text-accent-green font-medium">{priceCalculation.currency}{priceCalculation.finalPrice.toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={!isFormValid}
            className={`w-full py-2 px-4 text-sm rounded-xl transition-colors ${isFormValid ? "bg-primary text-white hover:bg-primary-hover" : "bg-surface-button text-content-muted cursor-not-allowed"}`}>
            {t("admin.contract.renewModal.renewBtn")}
          </button>
        </form>
      </div>
    </div>
  )
}
