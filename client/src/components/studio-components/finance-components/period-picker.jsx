/* eslint-disable react/prop-types */
import { Calendar, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import DatePickerField from "../../shared/DatePickerField"

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
        className={`bg-surface-dark text-content-primary px-4 py-2.5 rounded-xl border border-border hover:border-primary flex items-center gap-3 text-sm transition-colors ${className}`}
      >
        <Calendar className="w-4 h-4 text-content-muted flex-shrink-0" />
        <span className="text-sm flex-1 text-left truncate">{selectedPeriod}</span>
        <ChevronDown className={`w-4 h-4 text-content-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 mt-2 min-w-[320px] bg-surface-hover border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Preset Periods */}
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">
              Select Period
            </div>
            {periods.map((period) => (
              <button
                key={period}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors ${
                  selectedPeriod === period && !isCustomPeriod
                    ? 'text-content-primary bg-surface-hover/50' 
                    : 'text-content-secondary'
                }`}
                onClick={() => handleSelectPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Custom Period Section */}
          <div className="border-t border-border">
            <button
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors flex items-center gap-2 ${
                isCustomExpanded || isCustomPeriod ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'
              }`}
              onClick={handleCustomClick}
            >
              <Calendar className="w-4 h-4" />
              Custom Period
            </button>
            
            {/* Date Inputs - Show when custom period is selected */}
            {isCustomExpanded && (
              <div className="px-4 py-3 bg-surface-dark border-t border-border">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-content-faint mb-1">Start Date</label>
                      <div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border">
                        <span className={customDates.startDate ? "text-content-primary" : "text-content-faint"}>{customDates.startDate ? formatDateForDisplay(customDates.startDate) : "Select"}</span>
                        <DatePickerField value={customDates.startDate} onChange={(val) => setCustomDates((prev) => ({ ...prev, startDate: val }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-content-faint mb-1">End Date</label>
                      <div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border">
                        <span className={customDates.endDate ? "text-content-primary" : "text-content-faint"}>{customDates.endDate ? formatDateForDisplay(customDates.endDate) : "Select"}</span>
                        <DatePickerField value={customDates.endDate} onChange={(val) => setCustomDates((prev) => ({ ...prev, endDate: val }))} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleApplyCustom}
                    disabled={!customDates.startDate || !customDates.endDate}
                    className="w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
