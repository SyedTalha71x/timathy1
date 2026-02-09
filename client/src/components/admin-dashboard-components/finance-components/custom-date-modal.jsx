import { X } from "lucide-react"
import { useState } from "react"

/* eslint-disable react/prop-types */
const CustomDateModal = ({ isOpen, onClose, onApply }) => {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
  
    if (!isOpen) return null
  
    const handleApply = () => {
      if (startDate && endDate) {
        onApply(startDate, endDate)
        onClose()
      }
    }
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-white text-base md:text-lg font-medium">Custom Date Range</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-gray-400 text-xs md:text-sm mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#141414] text-white px-3 md:px-4 white-calendar-icon py-2.5 rounded-xl border border-gray-700 w-full focus:outline-none focus:border-[#3F74FF] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs md:text-sm mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#141414] text-white white-calendar-icon px-3 md:px-4 py-2.5 rounded-xl border border-gray-700 w-full focus:outline-none focus:border-[#3F74FF] text-sm transition-colors"
              />
            </div>
            <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-[#2F2F2F] text-white px-3 md:px-4 py-2.5 rounded-xl hover:bg-[#3F3F3F] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="flex-1 bg-[#3F74FF] text-white px-3 md:px-4 py-2.5 rounded-xl hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  
  export default CustomDateModal
