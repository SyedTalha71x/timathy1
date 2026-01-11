/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function BonusTimeModal({ contract, onClose, onSubmit }) {
  const [bonusAmount, setBonusAmount] = useState(1)
  const [bonusUnit, setBonusUnit] = useState("days")
  const [withExtension, setWithExtension] = useState("Without Contract extension")
  const [reason, setReason] = useState("")
  const [startOption, setStartOption] = useState("current_contract_period")
  const [startDate, setStartDate] = useState("")
  const [bonusPeriod, setBonusPeriod] = useState("")

  // Calculate and update bonus period whenever relevant values change
  useEffect(() => {
    setBonusPeriod(calculateBonusPeriod())
  }, [startOption, startDate, bonusAmount, bonusUnit])

  // Calculate bonus period end date
  const calculateBonusPeriod = () => {
    if (startOption === "fixed_time" && startDate) {
      // For fixed time option
      const start = new Date(startDate)
      const end = new Date(start)

      // Add bonus duration based on amount and unit
      applyDurationToDate(end, bonusAmount, bonusUnit)

      // Format dates to local date string
      return `${formatDate(start)} - ${formatDate(end)}`
    } else if (startOption === "current_contract_period" && contract?.endDate) {
      // For end of contract period option
      const start = new Date(contract.endDate)
      const end = new Date(start)

      // Add bonus duration based on amount and unit
      applyDurationToDate(end, bonusAmount, bonusUnit)

      // Format dates to local date string
      return `${formatDate(start)} - ${formatDate(end)}`
    }

    return ""
  }

  // Helper function to apply duration to a date
  const applyDurationToDate = (date, amount, unit) => {
    switch (unit) {
      case "days":
        date.setDate(date.getDate() + amount)
        break
      case "weeks":
        date.setDate(date.getDate() + amount * 7)
        break
      case "months":
        date.setMonth(date.getMonth() + amount)
        break
    }
    return date
  }

  // Format date helper
  const formatDate = (date) =>
    date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      contractId: contract.id,
      bonusAmount,
      bonusUnit,
      withExtension: withExtension === "With Contract extension",
      reason,
      startOption,
      startDate: startOption === "fixed_time" ? startDate : null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md relative overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white font-semibold">Add Bonus Time</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Reason for Bonus Time</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for bonus time"
                className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Start of Bonus Time</label>
              <select
                value={startOption}
                onChange={(e) => setStartOption(e.target.value)}
                className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30] mb-2"
              >
                <option value="current_contract_period">End of the current Contract period</option>
                <option value="fixed_time">Fixed time</option>
              </select>

              {startOption === "fixed_time" && (
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-black white-calendar-icon text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30] pl-10"
                    />
                  </div>
                  <div className="flex gap-2 w-1/2">
                    <input
                      type="number"
                      min="1"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number.parseInt(e.target.value))}
                      className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-1/3 focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
                    />
                    <select
                      value={bonusUnit}
                      onChange={(e) => setBonusUnit(e.target.value)}
                      className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-2/3 focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Duration selection for "End of the current Contract period" */}
              {startOption === "current_contract_period" && (
                <div className="flex gap-2 mt-2">
                  <div className="flex gap-2 w-full">
                    <input
                      type="number"
                      min="1"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number.parseInt(e.target.value))}
                      className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-1/3 focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
                    />
                    <select
                      value={bonusUnit}
                      onChange={(e) => setBonusUnit(e.target.value)}
                      className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-2/3 focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Show bonus period for both options when available */}
              {bonusPeriod && <div className="mt-2 text-sm text-gray-400">Bonus Period: {bonusPeriod}</div>}
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Contract Extension</label>
              <select
                value={withExtension}
                onChange={(e) => setWithExtension(e.target.value)}
                className="bg-black text-white text-sm px-3 py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
              >
                <option value="Without Contract extension">Without Contract extension</option>
                <option value="With Contract extension">With Contract extension</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-black text-sm text-white rounded-xl border border-gray-800 hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F27A30] text-sm text-white rounded-xl hover:bg-[#e06b21] transition-colors"
              >
                Add Bonus Time
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
