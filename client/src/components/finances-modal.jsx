/* eslint-disable react/prop-types */
"use client"

import { X, Download, ChevronDown } from "lucide-react"
import { useState } from "react"

export function FinancesModal({ onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)

  const periods = [
    { value: "this-month", label: "This Month" },
    { value: "last-month", label: "Last Month" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "this-year", label: "This Year" },
    { value: "last-year", label: "Last Year" },
    { value: "all-time", label: "All Time" },
  ]

  const handlePaymentRun = () => {
    // Logic for initiating payment run and generating SEPA XML
    console.log("Initiating payment run for", selectedPeriod)
    // You would typically make an API call here to generate the SEPA XML
  }

  const getFinancialSummary = () => {
    // This function would typically fetch data based on the selected period
    // For now, we'll return placeholder data
    return {
      activeContracts: 150,
      totalIncome: 15000,
    }
  }

  const financialSummary = getFinancialSummary()

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <h3 className="text-white text-lg font-semibold mb-4">Finances</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="period" className="text-sm text-gray-400">
              Select Period
            </label>
            <div className="relative">
              <button
                id="period"
                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 flex items-center justify-between"
              >
                {selectedPeriod ? periods.find((p) => p.value === selectedPeriod)?.label : "Select a period"}
                <ChevronDown size={16} />
              </button>
              {isPeriodDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#141414] border border-gray-800 rounded-xl shadow-lg">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#2F2F2F]"
                      onClick={() => {
                        setSelectedPeriod(period.value)
                        setIsPeriodDropdownOpen(false)
                      }}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handlePaymentRun}
            disabled={!selectedPeriod}
            className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Generate SEPA XML
          </button>
          <div className="bg-[#141414] rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">Income Summary</h4>
            <p className="text-sm text-gray-400">Total Active Contracts: {financialSummary.activeContracts}</p>
            <p className="text-sm text-gray-400">Total Income: €{financialSummary.totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

