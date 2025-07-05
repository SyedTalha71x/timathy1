""

/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

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

export function ChangeContractModal({ contract, onClose, onSubmit }) {
  const [changeData, setChangeData] = useState({
    newContractType: contract?.contractType || "Basic",
    startDate: "",
  })

  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: "1",
    isPermanent: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
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
    onSubmit({
      ...changeData,
      discount: discount.percentage > 0 ? discount : null,
    })
  }

  const selectedContractType = contractTypes.find((type) => type.name === changeData.newContractType)
  const currentContractType = contractTypes.find((type) => type.name === contract?.contractType)

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
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h3 className="text-white text-lg font-semibold mb-4">Change Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Current Contract</label>
            <div className="bg-[#141414] p-3 rounded-xl border border-gray-800">
              <p className="text-white text-sm">Type: {contract?.contractType}</p>
              <p className="text-gray-400 text-xs">
                Cost: {currentContractType?.cost} / {currentContractType?.billingPeriod}
              </p>
              <p className="text-gray-400 text-xs">Expires: {contract?.endDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="newContractType" className="text-sm text-gray-400">
              New Contract Type
            </label>
            <select
              id="newContractType"
              name="newContractType"
              value={changeData.newContractType}
              onChange={handleInputChange}
              className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none"
            >
              {contractTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name} - {type.cost}
                </option>
              ))}
            </select>
          </div>

          {selectedContractType && (
            <div className="bg-[#141414]/60 p-4 rounded-xl border border-gray-800">
              <h4 className="text-white text-sm font-medium mb-2">New Contract Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400 text-xs">Cost</span>
                  <span className="text-white">{selectedContractType.cost}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs">Billing Period</span>
                  <span className="text-white">{selectedContractType.billingPeriod}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm text-gray-400">
              Change Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={changeData.startDate}
              onChange={handleInputChange}
              className="w-full bg-[#141414] text-white white-calendar-icon text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800"
              required
            />
          </div>

          <div className="bg-[#141414]/60 p-4 rounded-xl border border-gray-800">
            <h4 className="text-white text-sm font-medium mb-2">Discount</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Percentage (%)</label>
                <input
                  type="number"
                  name="percentage"
                  min="0"
                  max="100"
                  value={discount.percentage}
                  onChange={handleDiscountChange}
                  className="w-full bg-[#141414] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none border border-gray-800"
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
                  className="w-full bg-[#141414] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none border border-gray-800"
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
                  className="form-checkbox h-4 w-4 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
                />
                <span className="text-gray-400 text-xs">Till End of Contract</span>
              </label>
            </div>

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
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Change Contract
          </button>
        </form>
      </div>
    </div>
  )
}
