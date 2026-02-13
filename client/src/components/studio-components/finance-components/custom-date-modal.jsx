import { X } from "lucide-react"
import { useState } from "react"
import DatePickerField from "../../../components/shared/DatePickerField"

/* eslint-disable react/prop-types */
const CustomDateModal = ({ isOpen, onClose, onApply }) => {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
  
    if (!isOpen) return null

    const formatDateDisplay = (dateString) => { if (!dateString) return ""; const [y, m, d] = dateString.split('-'); return `${d}.${m}.${y}` }
  
    const handleApply = () => {
      if (startDate && endDate) {
        onApply(startDate, endDate)
        onClose()
      }
    }
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-base rounded-xl w-full max-w-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-content-primary text-base md:text-lg font-medium">Custom Date Range</h2>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-content-muted text-xs md:text-sm mb-2">Start Date</label>
              <div className="w-full flex items-center justify-between bg-surface-dark text-sm rounded-xl px-3 md:px-4 py-2.5 border border-border">
                <span className={startDate ? "text-content-primary" : "text-content-faint"}>{startDate ? formatDateDisplay(startDate) : "Select start date"}</span>
                <DatePickerField value={startDate} onChange={setStartDate} />
              </div>
            </div>
            <div>
              <label className="block text-content-muted text-xs md:text-sm mb-2">End Date</label>
              <div className="w-full flex items-center justify-between bg-surface-dark text-sm rounded-xl px-3 md:px-4 py-2.5 border border-border">
                <span className={endDate ? "text-content-primary" : "text-content-faint"}>{endDate ? formatDateDisplay(endDate) : "Select end date"}</span>
                <DatePickerField value={endDate} onChange={setEndDate} />
              </div>
            </div>
            <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-surface-button text-content-secondary px-3 md:px-4 py-2.5 rounded-xl hover:bg-surface-button-hover transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="flex-1 bg-primary text-white px-3 md:px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
