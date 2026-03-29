/* eslint-disable react/prop-types */
import { X, ChevronDown, ChevronUp, Info } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { DEFAULT_ADMIN_CONTRACT_TYPES, DEFAULT_ADMIN_CONTRACT_CHANGE_REASONS, adminPlatformData } from "../../../utils/admin-panel-states/admin-contract-states"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

export function AdminChangeContractModal({ contract, onClose, onSubmit, initialData = null }) {
  const { t, i18n } = useTranslation()
  const currency = adminPlatformData?.currency || "€"

  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const contractTypes = (DEFAULT_ADMIN_CONTRACT_TYPES || []).filter((type) => type.name !== contract?.contractType)

  const [changeData, setChangeData] = useState({
    newContractType: initialData?.newContractType || "",
    startDate: initialData?.startDate || getTodayDate(),
  })

  const [discount, setDiscount] = useState(
    initialData?.discount
      ? { percentage: initialData.discount.percentage || 0, duration: initialData.discount.duration || "1", isPermanent: initialData.discount.isPermanent || false }
      : { percentage: 0, duration: "1", isPermanent: false }
  )

  const [isDiscountExpanded, setIsDiscountExpanded] = useState(initialData?.discount?.percentage > 0 || false)
  const [dateError, setDateError] = useState("")

  const reasonPresets = DEFAULT_ADMIN_CONTRACT_CHANGE_REASONS.map(r => r.name)
  const initReason = initialData?.changeReason || ""
  const isPresetReason = reasonPresets.includes(initReason)
  const [changeReason, setChangeReason] = useState(isPresetReason ? initReason : (initReason ? "other" : ""))
  const [customReason, setCustomReason] = useState(isPresetReason ? "" : initReason)

  const selectedContractType = contractTypes.find((type) => type.name === changeData.newContractType)
  const currentContractType = (DEFAULT_ADMIN_CONTRACT_TYPES || []).find((type) => type.name === contract?.contractType)

  const calculateEndDate = () => {
    if (!changeData.startDate || !selectedContractType?.duration) return ""
    const start = new Date(changeData.startDate)
    start.setMonth(start.getMonth() + parseInt(selectedContractType.duration))
    return start.toISOString().split("T")[0]
  }
  const contractEndDate = calculateEndDate()

  const getDurationDisplay = () => {
    if (!selectedContractType?.duration) return ""
    const months = parseInt(selectedContractType.duration)
    return months === 1 ? t("admin.contract.modal.month", { count: 1 }) : t("admin.contract.modal.months", { count: months })
  }

  const formatDateDisplay = (dateStr) => new Date(dateStr + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "startDate") {
      const selected = new Date(value)
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      setDateError(selected < todayDate ? t("admin.contract.changeModal.errStartDateFuture") : "")
    }
    setChangeData({ ...changeData, [name]: value })
  }

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target
    setDiscount({ ...discount, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selected = new Date(changeData.startDate)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    if (selected < todayDate) { setDateError(t("admin.contract.changeModal.errStartDateFuture")); return }
    const selectedType = contractTypes.find((type) => type.name === changeData.newContractType)
    onSubmit({
      ...changeData, endDate: contractEndDate, discount: discount.percentage > 0 ? discount : null, selectedContractType: selectedType,
      changeReason: changeReason === "other" ? (customReason.trim() || t("admin.contract.modal.other")) : (changeReason || null),
    })
  }

  const formatCost = (type) => !type ? "" : `${currency}${type.cost != null ? type.cost : ""}`

  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) return null
    const originalPrice = Number.parseFloat(String(selectedContractType.cost).replace(/[^0-9.,]/g, "").replace(",", "."))
    if (isNaN(originalPrice)) return null
    const discountAmount = (originalPrice * discount.percentage) / 100
    return { originalPrice, discountAmount, finalPrice: originalPrice - discountAmount, currency }
  }

  const priceCalculation = calculateFinalPrice()
  const isFormValid = selectedContractType && changeData.startDate && !dateError && changeReason && (changeReason !== "other" || customReason.trim())

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-muted hover:text-content-primary"><X size={20} /></button>
        <h3 className="text-content-primary text-lg font-semibold mb-4">{t("admin.contract.changeModal.title")}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Contract Info */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">{t("admin.contract.changeModal.currentContract")}</label>
            <div className="bg-surface-dark/60 p-3 rounded-xl border border-border">
              <p className="text-content-primary text-sm font-medium">{contract?.studioName}</p>
              <p className="text-content-primary text-sm">{t("admin.contract.changeModal.type")} {contract?.contractType}</p>
              <p className="text-content-muted text-xs">
                {t("admin.contract.changeModal.costLabel")} {currentContractType ? formatCost(currentContractType) : (contract?.cost ? `${currency}${contract.cost}` : "N/A")} / {currentContractType?.billingPeriod || contract?.billingPeriod || "Monthly"}
              </p>
              <p className="text-content-muted text-xs">{t("admin.contract.changeModal.expiresLabel")} {contract?.endDate}</p>
            </div>
          </div>

          {/* New Contract Type */}
          <div className="space-y-1.5">
            <label htmlFor="newContractType" className="text-xs text-content-secondary block pl-1">{t("admin.contract.changeModal.newContractType")}</label>
            <CustomSelect name="newContractType" value={changeData.newContractType} onChange={handleInputChange}
              options={contractTypes.map((type) => ({ value: type.name, label: type.name }))}
              placeholder={t("admin.contract.modal.selectContractType")} searchable />
          </div>

          {/* Date Fields */}
          {selectedContractType && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="startDate" className="text-xs text-content-secondary block pl-1">{t("admin.contract.changeModal.changeStartDate")}</label>
                <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 transition-shadow duration-200 ${dateError ? "ring-2 ring-accent-red" : ""}`}>
                  <span className={`flex-1 text-sm ${changeData.startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                    {changeData.startDate ? formatDateDisplay(changeData.startDate) : t("admin.contract.modal.selectDate")}
                  </span>
                  <DatePickerField value={changeData.startDate} onChange={(val) => handleInputChange({ target: { name: 'startDate', value: val } })} minDate={getTodayDate()} />
                </div>
                {dateError && <p className="text-accent-red text-xs pl-1">{dateError}</p>}
              </div>
              {contractEndDate && (
                <div className="space-y-1.5">
                  <label className="text-xs text-content-secondary block pl-1">{t("admin.contract.changeModal.contractEndDateLabel", { duration: getDurationDisplay() })}</label>
                  <input type="text" value={contractEndDate} readOnly disabled className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-muted outline-none cursor-not-allowed pointer-events-none" />
                </div>
              )}
              {changeData.startDate && (
                <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3">
                  <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-content-secondary leading-relaxed">
                    {t("admin.contract.changeModal.changeInfo", {
                      contractType: contract?.contractType,
                      studioName: contract?.studioName,
                      date: formatDateDisplay(changeData.startDate)
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contract Details */}
          {selectedContractType && (
            <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
              <h4 className="text-content-primary text-sm font-medium mb-2">{t("admin.contract.changeModal.newContractDetails")}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.duration")}</span><span className="text-content-primary">{getDurationDisplay()}</span></div>
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.cost")}</span><span className="text-content-primary">{formatCost(selectedContractType)}</span></div>
                <div><span className="block text-content-muted text-xs">{t("admin.contract.modal.billingPeriod")}</span><span className="text-content-primary">{selectedContractType.billingPeriod || "Monthly"}</span></div>
              </div>
            </div>
          )}

          {/* Discount */}
          {selectedContractType && (
            <div className="bg-surface-dark/60 rounded-xl border border-border overflow-hidden">
              <button type="button" onClick={() => setIsDiscountExpanded(!isDiscountExpanded)} className="w-full p-4 flex items-center justify-between text-content-primary hover:bg-surface-card transition-colors">
                <h4 className="text-sm font-medium">{t("admin.contract.modal.discount")}</h4>
                {isDiscountExpanded ? <ChevronUp size={16} className="text-content-muted" /> : <ChevronDown size={16} className="text-content-muted" />}
              </button>
              {isDiscountExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-content-muted text-xs mb-1">{t("admin.contract.modal.percentage")}</label>
                      <input type="number" name="percentage" min="0" max="100" value={discount.percentage} onChange={handleDiscountChange}
                        className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
                    </div>
                    <div className={discount.isPermanent ? "opacity-50" : ""}>
                      <label className="block text-content-muted text-xs mb-1">{t("admin.contract.modal.billingPeriods")}</label>
                      <input type="number" name="duration" min="1" value={discount.duration} onChange={handleDiscountChange} disabled={discount.isPermanent}
                        className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
                    </div>
                    <div>
                      <label className="block text-content-muted mt-7 text-xs mb-1"></label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" name="isPermanent" checked={discount.isPermanent} onChange={handleDiscountChange} className="primary-check" />
                        <span className="text-content-muted text-xs">{t("admin.contract.modal.tillEndOfContract")}</span>
                      </label>
                    </div>
                  </div>
                  {priceCalculation && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h5 className="text-content-primary text-sm font-medium mb-2">{t("admin.contract.modal.priceCalc")}</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-content-muted">{t("admin.contract.modal.originalPrice")}</span><span className="text-content-primary">{priceCalculation.currency}{priceCalculation.originalPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-content-muted">{t("admin.contract.modal.discountAmount", { pct: discount.percentage })}</span><span className="text-accent-red">-{priceCalculation.currency}{priceCalculation.discountAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between border-t border-border pt-2"><span className="text-content-primary font-medium">{t("admin.contract.modal.finalPrice")}</span><span className="text-accent-green font-medium">{priceCalculation.currency}{priceCalculation.finalPrice.toFixed(2)}</span></div>
                        <div className="text-xs text-content-faint">
                          {discount.isPermanent ? t("admin.contract.modal.discountEntireDuration") : t("admin.contract.modal.discountForPeriods", { count: discount.duration })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          {selectedContractType && (
            <div className="space-y-1.5">
              <label className="text-xs text-content-secondary block pl-1">{t("admin.contract.changeModal.reasonForChange")} <span className="text-accent-red">*</span></label>
              <CustomSelect name="changeReason" value={changeReason} onChange={(e) => setChangeReason(e.target.value)}
                options={[
                  ...DEFAULT_ADMIN_CONTRACT_CHANGE_REASONS.map(r => ({ value: r.name, label: r.name })),
                  { divider: true },
                  { value: "other", label: t("admin.contract.modal.other") },
                ]}
                placeholder={t("admin.contract.modal.selectReason")} />
              {changeReason === "other" && (
                <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t("admin.contract.modal.pleaseSpecify")}
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200" />
              )}
            </div>
          )}

          <button type="submit" disabled={!isFormValid}
            className={`w-full py-2 px-4 text-white text-sm rounded-xl transition-colors ${isFormValid ? "bg-orange-500 hover:bg-orange-600" : "bg-surface-button text-content-muted cursor-not-allowed"}`}>
            {t("admin.contract.changeModal.changeBtn")}
          </button>
        </form>
      </div>
    </div>
  )
}
