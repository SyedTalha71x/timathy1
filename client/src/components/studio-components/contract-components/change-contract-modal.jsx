
/* eslint-disable react/prop-types */
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { DEFAULT_CONTRACT_TYPES, studioData } from "../../../utils/studio-states/configuration-states"

export function ChangeContractModal({ contract, onClose, onSubmit, initialData = null }) {
  const currency = studioData?.currency || "€"

  // Use DEFAULT_CONTRACT_TYPES, excluding the current contract type
  const contractTypes = (DEFAULT_CONTRACT_TYPES || []).filter(
    (type) => type.name !== contract?.contractType
  )

  // If initialData is provided (coming back from FormFillModal discard), restore previous selections
  // Otherwise start with empty selection ("Select contract type")
  const [changeData, setChangeData] = useState({
    newContractType: initialData?.newContractType || "",
    startDate: initialData?.startDate || "",
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

  const selectedContractType = contractTypes.find((type) => type.name === changeData.newContractType)
  const currentContractType = (DEFAULT_CONTRACT_TYPES || []).find((type) => type.name === contract?.contractType)

  // Today's date string for min attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

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
    
    // Validate start date is in the future
    if (name === "startDate") {
      const selected = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selected <= today) {
        setDateError("Start date must be in the future")
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
    
    // Final validation: start date must be in the future
    const selected = new Date(changeData.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selected <= today) {
      setDateError("Start date must be in the future")
      return
    }

    // Find the full selected contract type object to pass back
    const selectedType = contractTypes.find((type) => type.name === changeData.newContractType)

    onSubmit({
      ...changeData,
      endDate: contractEndDate,
      discount: discount.percentage > 0 ? discount : null,
      selectedContractType: selectedType,
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
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h3 className="text-white text-lg font-semibold mb-4">Change Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Contract Info */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Current Contract</label>
            <div className="bg-[#101010]/60 p-3 rounded-xl border border-gray-800">
              <p className="text-white text-sm">Type: {contract?.contractType}</p>
              <p className="text-gray-400 text-xs">
                Cost: {currentContractType ? formatCost(currentContractType) : (contract?.cost ? `${currency}${contract.cost}` : "N/A")} / {currentContractType?.billingPeriod || contract?.billingPeriod || "Monthly"}
              </p>
              <p className="text-gray-400 text-xs">Expires: {contract?.endDate}</p>
            </div>
          </div>

          {/* New Contract Type Dropdown - excludes current contract type */}
          <div className="space-y-1.5">
            <label htmlFor="newContractType" className="text-xs text-gray-200 block pl-1">
              New Contract Type
            </label>
            <select
              id="newContractType"
              name="newContractType"
              value={changeData.newContractType}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
            >
              <option value="">Select contract type</option>
              {contractTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Fields - only show when contract type is selected */}
          {selectedContractType && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="startDate" className="text-xs text-gray-200 block pl-1">
                  Change Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={changeData.startDate}
                  min={getTomorrowDate()}
                  onChange={handleInputChange}
                  className={`w-full bg-[#101010] text-white white-calendar-icon text-sm rounded-xl px-3 py-2.5 outline-none transition-shadow duration-200 ${
                    dateError 
                      ? "ring-2 ring-red-500" 
                      : "focus:ring-2 focus:ring-[#3F74FF]"
                  }`}
                  required
                />
                {dateError && (
                  <p className="text-red-400 text-xs pl-1">{dateError}</p>
                )}
              </div>

              {/* Contract End Date - calculated, read-only */}
              {contractEndDate && (
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">
                    Contract End Date ({getDurationDisplay()})
                  </label>
                  <input
                    type="text"
                    value={contractEndDate}
                    readOnly
                    disabled
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-400 outline-none cursor-not-allowed pointer-events-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Contract Details Box */}
          {selectedContractType && (
            <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
              <h4 className="text-white text-sm font-medium mb-2">New Contract Details</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400 text-xs">Duration</span>
                  <span className="text-white">{getDurationDisplay()}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs">Cost</span>
                  <span className="text-white">{formatCost(selectedContractType)}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs">Billing Period</span>
                  <span className="text-white">{selectedContractType.billingPeriod || "Monthly"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Discount Section - Collapsible, collapsed by default */}
          {selectedContractType && (
            <div className="bg-[#101010]/60 rounded-xl border border-gray-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
                className="w-full p-4 flex items-center justify-between text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <h4 className="text-sm font-medium">Discount</h4>
                {isDiscountExpanded ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>

              {isDiscountExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        name="percentage"
                        min="0"
                        max="100"
                        value={discount.percentage}
                        onChange={handleDiscountChange}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className={discount.isPermanent ? "opacity-50" : ""}>
                      <label className="block text-gray-400 text-xs mb-1">Billing Periods</label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        value={discount.duration}
                        onChange={handleDiscountChange}
                        disabled={discount.isPermanent}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mt-7 text-xs mb-1"></label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPermanent"
                          checked={discount.isPermanent}
                          onChange={handleDiscountChange}
                          className="form-checkbox h-5 w-5 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
                        />
                        <span className="text-gray-400 text-xs">Till End of Contract</span>
                      </label>
                    </div>
                  </div>

                  {/* Final Price Display */}
                  {priceCalculation && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h5 className="text-white text-sm font-medium mb-2">Price Calculation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Original Price:</span>
                          <span className="text-white">
                            {priceCalculation.currency}
                            {priceCalculation.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Discount ({discount.percentage}%):</span>
                          <span className="text-red-400">
                            -{priceCalculation.currency}
                            {priceCalculation.discountAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-700 pt-2">
                          <span className="text-white font-medium">Final Price:</span>
                          <span className="text-green-400 font-medium">
                            {priceCalculation.currency}
                            {priceCalculation.finalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
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

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 text-white text-sm rounded-xl transition-colors ${
              isFormValid
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Change Contract
          </button>
        </form>
      </div>
    </div>
  )
}
