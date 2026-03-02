
/* eslint-disable react/prop-types */
import { X, ChevronDown, ChevronUp, Info } from "lucide-react"
import { useState } from "react"
import { DEFAULT_CONTRACT_TYPES, DEFAULT_CONTRACT_CHANGE_REASONS, studioData } from "../../../utils/studio-states/configuration-states"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

export function ChangeContractModal({ contract, onClose, onSubmit, initialData = null }) {
  const currency = studioData?.currency || "â‚¬"

  // Today's date string (local timezone) for min attribute and default value
  const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Use DEFAULT_CONTRACT_TYPES, excluding the current contract type
  const contractTypes = (DEFAULT_CONTRACT_TYPES || []).filter(
    (type) => type.name !== contract?.contractType
  )

  // If initialData is provided (coming back from FormFillModal discard), restore previous selections
  // Otherwise start with empty selection ("Select contract type")
  const [changeData, setChangeData] = useState({
    newContractType: initialData?.newContractType || "",
    startDate: initialData?.startDate || getTodayDate(),
  })

  const [discount, setDiscount] = useState(
    initialData?.discount
      ? {
          percentage: initialData.discount.percentage || 0,
          duration: initialData.discount.duration || "1",
          isPermanent: initialData.discount.isPermanent || false,
        }
      : {
          percentage: 0,
          duration: "1",
          isPermanent: false,
        }
  )

  // Discount collapsed by default, but expanded if restoring with active discount
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(
    initialData?.discount?.percentage > 0 || false
  )

  // Date validation error
  const [dateError, setDateError] = useState("")

  // Reason for change
  const reasonPresets = DEFAULT_CONTRACT_CHANGE_REASONS.map(r => r.name)
  const initReason = initialData?.changeReason || ""
  const isPresetReason = reasonPresets.includes(initReason)
  const [changeReason, setChangeReason] = useState(isPresetReason ? initReason : (initReason ? "other" : ""))
  const [customReason, setCustomReason] = useState(isPresetReason ? "" : initReason)

  const selectedContractType = contractTypes.find((type) => type.name === changeData.newContractType)
  const currentContractType = (DEFAULT_CONTRACT_TYPES || []).find((type) => type.name === contract?.contractType)

  // Calculate end date based on start date + duration
  const calculateEndDate = () => {
    if (!changeData.startDate || !selectedContractType?.duration) return ""
    const start = new Date(changeData.startDate)
    start.setMonth(start.getMonth() + parseInt(selectedContractType.duration))
    return start.toISOString().split("T")[0]
  }

  const contractEndDate = calculateEndDate()

  // Duration display helper
  const getDurationDisplay = () => {
    if (!selectedContractType?.duration) return ""
    const months = parseInt(selectedContractType.duration)
    if (months === 1) return "1 Month"
    return `${months} Months`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Validate start date is today or in the future
    if (name === "startDate") {
      const selected = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selected < today) {
        setDateError("Start date must be today or in the future")
      } else {
        setDateError("")
      }
    }
    
    setChangeData({
      ...changeData,
      [name]: value,
    })
  }

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target
    setDiscount({
      ...discount,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Final validation: start date must be today or in the future
    const selected = new Date(changeData.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selected < today) {
      setDateError("Start date must be today or in the future")
      return
    }

    // Find the full selected contract type object to pass back
    const selectedType = contractTypes.find((type) => type.name === changeData.newContractType)

    onSubmit({
      ...changeData,
      endDate: contractEndDate,
      discount: discount.percentage > 0 ? discount : null,
      selectedContractType: selectedType,
      changeReason: changeReason === "other" ? (customReason.trim() || "Other") : (changeReason || null),
    })
  }

  // Helper to format cost display
  const formatCost = (type) => {
    if (!type) return ""
    const cost = type.cost != null ? type.cost : ""
    return `${currency}${cost}`
  }

  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) {
      return null
    }

    const originalPrice = Number.parseFloat(
      String(selectedContractType.cost).replace(/[^0-9.,]/g, "").replace(",", ".")
    )
    if (isNaN(originalPrice)) return null

    const discountAmount = (originalPrice * discount.percentage) / 100
    const finalPrice = originalPrice - discountAmount

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      currency,
    }
  }

  const priceCalculation = calculateFinalPrice()
  const isFormValid = selectedContractType && changeData.startDate && !dateError

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

        <h3 className="text-content-primary text-lg font-semibold mb-4">Change Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Contract Info */}
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Current Contract</label>
            <div className="bg-surface-dark/60 p-3 rounded-xl border border-border">
              <p className="text-content-primary text-sm">Type: {contract?.contractType}</p>
              <p className="text-content-muted text-xs">
                Cost: {currentContractType ? formatCost(currentContractType) : (contract?.cost ? `${currency}${contract.cost}` : "N/A")} / {currentContractType?.billingPeriod || contract?.billingPeriod || "Monthly"}
              </p>
              <p className="text-content-muted text-xs">Expires: {contract?.endDate}</p>
            </div>
          </div>

          {/* New Contract Type Dropdown - excludes current contract type */}
          <div className="space-y-1.5">
            <label htmlFor="newContractType" className="text-xs text-content-secondary block pl-1">
              New Contract Type
            </label>
            <CustomSelect
              name="newContractType"
              value={changeData.newContractType}
              onChange={handleInputChange}
              options={contractTypes.map((type) => ({ value: type.name, label: type.name }))}
              placeholder="Select contract type"
              searchable
            />
          </div>

          {/* Date Fields - only show when contract type is selected */}
          {selectedContractType && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="startDate" className="text-xs text-content-secondary block pl-1">
                  Change Start Date
                </label>
                <div className={`flex items-center bg-surface-dark rounded-xl px-3 py-2.5 transition-shadow duration-200 ${
                    dateError 
                      ? "ring-2 ring-accent-red" 
                      : ""
                  }`}>
                  <span className={`flex-1 text-sm ${changeData.startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                    {changeData.startDate ? new Date(changeData.startDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                  </span>
                  <DatePickerField
                    value={changeData.startDate}
                    onChange={(val) => handleInputChange({ target: { name: 'startDate', value: val } })}
                    minDate={getTodayDate()}
                  />
                </div>
                {dateError && (
                  <p className="text-accent-red text-xs pl-1">{dateError}</p>
                )}
              </div>

              {/* Contract End Date - calculated, read-only */}
              {contractEndDate && (
                <div className="space-y-1.5">
                  <label className="text-xs text-content-secondary block pl-1">
                    Contract End Date ({getDurationDisplay()})
                  </label>
                  <input
                    type="text"
                    value={contractEndDate}
                    readOnly
                    disabled
                    className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-muted outline-none cursor-not-allowed pointer-events-none"
                  />
                </div>
              )}

              {/* Info: What happens to the current contract */}
              {changeData.startDate && (
                <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3">
                  <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-content-secondary leading-relaxed">
                    The current <span className="text-content-primary font-medium">{contract?.contractType}</span> contract will be automatically cancelled on <span className="text-content-primary font-medium">{new Date(changeData.startDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span> when the new contract takes effect.
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Contract Details Box */}
          {selectedContractType && (
            <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
              <h4 className="text-content-primary text-sm font-medium mb-2">New Contract Details</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-content-muted text-xs">Duration</span>
                  <span className="text-content-primary">{getDurationDisplay()}</span>
                </div>
                <div>
                  <span className="block text-content-muted text-xs">Cost</span>
                  <span className="text-content-primary">{formatCost(selectedContractType)}</span>
                </div>
                <div>
                  <span className="block text-content-muted text-xs">Billing Period</span>
                  <span className="text-content-primary">{selectedContractType.billingPeriod || "Monthly"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Discount Section - Collapsible, collapsed by default */}
          {selectedContractType && (
            <div className="bg-surface-dark/60 rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
                className="w-full p-4 flex items-center justify-between text-content-primary hover:bg-surface-card transition-colors"
              >
                <h4 className="text-sm font-medium">Discount</h4>
                {isDiscountExpanded ? (
                  <ChevronUp size={16} className="text-content-muted" />
                ) : (
                  <ChevronDown size={16} className="text-content-muted" />
                )}
              </button>

              {isDiscountExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-content-muted text-xs mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        name="percentage"
                        min="0"
                        max="100"
                        value={discount.percentage}
                        onChange={handleDiscountChange}
                        className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
                      />
                    </div>
                    <div className={discount.isPermanent ? "opacity-50" : ""}>
                      <label className="block text-content-muted text-xs mb-1">Billing Periods</label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        value={discount.duration}
                        onChange={handleDiscountChange}
                        disabled={discount.isPermanent}
                        className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-content-muted mt-7 text-xs mb-1"></label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPermanent"
                          checked={discount.isPermanent}
                          onChange={handleDiscountChange}
                          className="primary-check"
                        />
                        <span className="text-content-muted text-xs">Till End of Contract</span>
                      </label>
                    </div>
                  </div>

                  {/* Final Price Display */}
                  {priceCalculation && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h5 className="text-content-primary text-sm font-medium mb-2">Price Calculation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-content-muted">Original Price:</span>
                          <span className="text-content-primary">
                            {priceCalculation.currency}
                            {priceCalculation.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-content-muted">Discount ({discount.percentage}%):</span>
                          <span className="text-accent-red">
                            -{priceCalculation.currency}
                            {priceCalculation.discountAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2">
                          <span className="text-content-primary font-medium">Final Price:</span>
                          <span className="text-accent-green font-medium">
                            {priceCalculation.currency}
                            {priceCalculation.finalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-content-faint">
                          {discount.isPermanent
                            ? "Discount applies for the entire contract duration"
                            : `Discount applies for ${discount.duration} billing period${Number(discount.duration) > 1 ? "s" : ""}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reason for Change */}
          {selectedContractType && (
            <div className="space-y-1.5">
              <label className="text-xs text-content-secondary block pl-1">
                Reason for Change <span className="text-content-faint">(optional)</span>
              </label>
              <CustomSelect
                name="changeReason"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                options={[
                  ...DEFAULT_CONTRACT_CHANGE_REASONS.map(r => ({ value: r.name, label: r.name })),
                  { divider: true },
                  { value: "other", label: "Other" },
                ]}
                placeholder="Select a reason"
              />
              {changeReason === "other" && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify..."
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2.5 text-content-primary placeholder-content-faint outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 text-white text-sm rounded-xl transition-colors ${
              isFormValid
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-surface-button text-content-muted cursor-not-allowed"
            }`}
          >
            Change Contract
          </button>
        </form>
      </div>
    </div>
  )
}
