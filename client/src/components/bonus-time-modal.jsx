/* eslint-disable react/prop-types */

import { useState } from "react"
import { X } from "lucide-react"

export function BonusTimeModal({ contract, onClose, onSubmit }) {
  const [bonusAmount, setBonusAmount] = useState(1)
  const [bonusUnit, setBonusUnit] = useState("days")
  const [withExtension, setWithExtension] = useState("Without Contract extension")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      contractId: contract.id,
      bonusAmount,
      bonusUnit, 
      withExtension: withExtension === "With Contract extension",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
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
              <label className="block text-gray-300 text-sm mb-2">Bonus Time Duration</label>
              <div className="flex gap-2">
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

