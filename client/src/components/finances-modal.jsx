/* eslint-disable react/prop-types */
import { X, Download } from "lucide-react"
import { useState } from "react"

export function FinancesModal({ onClose }) {
  const [selectedMonth, setSelectedMonth] = useState("")

  const handlePaymentRun = () => {
    // Logic for initiating payment run and generating SEPA XML
    console.log("Initiating payment run for", selectedMonth)
    // You would typically make an API call here to generate the SEPA XML
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <h3 className="text-white text-lg font-semibold mb-4">Finances</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="month" className="text-sm text-gray-400">
              Select Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none"
            >
              <option value="">Select a month</option>
              <option value="2023-05">May 2023</option>
              <option value="2023-06">June 2023</option>
              <option value="2023-07">July 2023</option>
            </select>
          </div>
          <button
            onClick={handlePaymentRun}
            className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Generate SEPA XML
          </button>
          <div className="bg-[#141414] rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">Income Summary</h4>
            <p className="text-sm text-gray-400">Total Active Contracts: 150</p>
            <p className="text-sm text-gray-400">Total Monthly Income: €15,000</p>
          </div>
        </div>
      </div>
    </div>
  )
}

