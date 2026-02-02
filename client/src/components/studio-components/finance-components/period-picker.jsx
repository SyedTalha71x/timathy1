/* eslint-disable react/prop-types */
import { Calendar, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

/**
 * PeriodPicker Component
 * A dropdown component for selecting time periods with integrated custom date range
 * Styling matches the medical-history.jsx design pattern
 * 
 * Props:
 * - selectedPeriod: Current selected period string
 * - onPeriodChange: Callback when period changes (period, customRange?)
 * - periods: Array of period strings to show in dropdown
 * - className: Additional classes for the button
 */
const PeriodPicker = ({ 
  selectedPeriod, 
  onPeriodChange, 
  periods = [],
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCustomExpanded, setIsCustomExpanded] = useState(false)
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: ""
  })
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsCustomExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const handleSelectPeriod = (period) => {
    onPeriodChange(period, null)
    setIsCustomExpanded(false)
    setIsOpen(false)
  }

  const handleCustomClick = () => {
    // Initialize with today's date if empty
    const today = new Date().toISOString().split("T")[0]
    setCustomDates((prev) => ({
      startDate: prev.startDate || today,
      endDate: prev.endDate || today,
    }))
    setIsCustomExpanded(true)
  }

  const handleApplyCustom = () => {
    if (customDates.startDate && customDates.endDate) {
      const formattedStart = formatDateForDisplay(customDates.startDate)
      const formattedEnd = formatDateForDisplay(customDates.endDate)
      const customPeriod = `Custom: ${formattedStart} – ${formattedEnd}`
      onPeriodChange(customPeriod, {
        start: customDates.startDate,
        end: customDates.endDate
      })
      setIsOpen(false)
      setIsCustomExpanded(false)
    }
  }

  const isCustomPeriod = selectedPeriod?.startsWith("Custom:")

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[#141414] text-white px-4 py-2.5 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-3 text-sm transition-colors ${className}`}
      >
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm flex-1 text-left truncate">{selectedPeriod}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 mt-2 min-w-[320px] bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {/* Preset Periods */}
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
              Select Period
            </div>
            {periods.map((period) => (
              <button
                key={period}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                  selectedPeriod === period && !isCustomPeriod
                    ? 'text-white bg-gray-800/50' 
                    : 'text-gray-300'
                }`}
                onClick={() => handleSelectPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Custom Period Section */}
          <div className="border-t border-gray-700">
            <button
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                isCustomExpanded || isCustomPeriod ? 'text-white bg-gray-800/50' : 'text-gray-300'
              }`}
              onClick={handleCustomClick}
            >
              <Calendar className="w-4 h-4" />
              Custom Period
            </button>
            
            {/* Date Inputs - Show when custom period is selected */}
            {isCustomExpanded && (
              <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customDates.startDate}
                        onChange={(e) => setCustomDates((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customDates.endDate}
                        onChange={(e) => setCustomDates((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyCustom}
                    disabled={!customDates.startDate || !customDates.endDate}
                    className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PeriodPicker
