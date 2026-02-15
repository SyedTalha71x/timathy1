""

/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

const contractTypes = [
  {
    id: "basic",
    name: "Basic",
    duration: "12 months",
    cost: "$29.99",
    billingPeriod: "Monthly",
  },
  {
    id: "premium",
    name: "Premium",
    duration: "12 months",
    cost: "$49.99",
    billingPeriod: "Monthly",
  },
  {
    id: "bronze",
    name: "Bronze",
    duration: "6 months",
    cost: "$19.99",
    billingPeriod: "Monthly",
  },
]

export function RenewContractModal({ contract, onClose, onSubmit }) {
  const [renewalData, setRenewalData] = useState({
    startAfterCurrent: true,
    customStartDate: "",
    duration: "12",
    contractType: contract?.contractType || "Basic",
  })

  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: "1",
    isPermanent: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setRenewalData({
      ...renewalData,
      [name]: type === "checkbox" ? checked : value,
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
    onSubmit({
      ...renewalData,
      discount: discount.percentage > 0 ? discount : null,
    })
  }

  const selectedContractType = contractTypes.find((type) => type.name === renewalData.contractType)

  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) {
      return null
    }

    const originalPrice = Number.parseFloat(selectedContractType.cost.replace("$", ""))
    const discountAmount = (originalPrice * discount.percentage) / 100
    const finalPrice = originalPrice - discountAmount

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      currency: selectedContractType.cost.charAt(0),
    }
  }

  const priceCalculation = calculateFinalPrice()

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

        <h3 className="text-content-primary text-lg font-semibold mb-4">Renew Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-content-muted">Contract Information</label>
            <div className="bg-surface-dark p-3 rounded-xl border border-border">
              <p className="text-content-primary text-sm">Current Contract: {contract?.contractType}</p>
              <p className="text-content-muted text-xs">Expires: {contract?.endDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-content-muted">Start Date</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="startAfterCurrent"
                  checked={renewalData.startAfterCurrent}
                  onChange={handleInputChange}
                  className="primary-check"
                />
                <span className="text-content-primary text-sm">Start after current contract period</span>
              </label>

              {!renewalData.startAfterCurrent && (
                <div>
                  <label className="text-xs text-content-muted block mb-1">Custom Start Date</label>
                  <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2.5 border border-border">
                    <span className={`flex-1 text-sm ${renewalData.customStartDate ? 'text-content-primary' : 'text-content-muted'}`}>
                      {renewalData.customStartDate ? new Date(renewalData.customStartDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                    </span>
                    <DatePickerField
                      value={renewalData.customStartDate}
                      onChange={(val) => setRenewalData({ ...renewalData, customStartDate: val })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm text-content-muted">
              Duration (months)
            </label>
            <CustomSelect
              name="duration"
              value={renewalData.duration}
              onChange={handleInputChange}
              options={[
                { value: "6", label: "6 months" },
                { value: "12", label: "12 months" },
                { value: "24", label: "24 months" },
              ]}
              placeholder="Select duration"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contractType" className="text-sm text-content-muted">
              Contract Type
            </label>
            <CustomSelect
              name="contractType"
              value={renewalData.contractType}
              onChange={handleInputChange}
              options={contractTypes.map((type) => ({ value: type.name, label: `${type.name} - ${type.cost}` }))}
              placeholder="Select contract type"
            />
          </div>

          {selectedContractType && (
            <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
              <h4 className="text-content-primary text-sm font-medium mb-2">Contract Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-content-muted text-xs">Cost</span>
                  <span className="text-content-primary">{selectedContractType.cost}</span>
                </div>
                <div>
                  <span className="block text-content-muted text-xs">Billing Period</span>
                  <span className="text-content-primary">{selectedContractType.billingPeriod}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface-dark/60 p-4 rounded-xl border border-border">
            <h4 className="text-content-primary text-sm font-medium mb-2">Discount</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-content-muted text-xs mb-1">Percentage (%)</label>
                <input
                  type="number"
                  name="percentage"
                  min="0"
                  max="100"
                  value={discount.percentage}
                  onChange={handleDiscountChange}
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none border border-border"
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
                  className="w-full bg-surface-dark text-sm rounded-xl px-3 py-2 text-content-primary placeholder-content-faint outline-none border border-border"
                />
              </div>
            </div>
            <div className="mt-3">
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
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
          >
            Renew Contract
          </button>
        </form>
      </div>
    </div>
  )
}
