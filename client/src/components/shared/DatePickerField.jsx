/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

/**
 * Custom date picker with calendar dropdown + year/month drill-down.
 *
 * Click "January 2026" → month grid → click year → year grid.
 * 
 * Props:
 *   value       - Date string in "YYYY-MM-DD" format (or "")
 *   onChange     - Callback receiving "YYYY-MM-DD" string (or "" on clear)
 *   label       - Optional label text above the input
 *   placeholder - Optional placeholder text (default: "Select date")
 *   className   - Optional wrapper className
 */
const DatePickerField = ({ label, value, onChange, placeholder = "Select date", className = "" }) => {
  const [open, setOpen] = useState(false)
  // "days" | "months" | "years"
  const [view, setView] = useState("days")
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length === 3) return new Date(+parts[0], +parts[1] - 1, +parts[2])
    }
    return new Date()
  })
  // For year grid: start of the current 20-year range
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = viewDate.getFullYear()
    return y - (y % 20)
  })
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Position dropdown above if not enough space below
  useEffect(() => {
    if (!open || !dropdownRef.current || !containerRef.current) return
    const trigger = containerRef.current.getBoundingClientRect()
    const dropdown = dropdownRef.current
    const spaceBelow = window.innerHeight - trigger.bottom
    const spaceAbove = trigger.top
    const dropdownHeight = dropdown.offsetHeight || 340

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      dropdown.style.bottom = '100%'
      dropdown.style.top = 'auto'
      dropdown.style.marginBottom = '4px'
      dropdown.style.marginTop = '0'
    } else {
      dropdown.style.top = '100%'
      dropdown.style.bottom = 'auto'
      dropdown.style.marginTop = '4px'
      dropdown.style.marginBottom = '0'
    }
  }, [open, view])

  // Sync viewDate when value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length === 3) setViewDate(new Date(+parts[0], +parts[1] - 1, +parts[2]))
    }
  }, [value])

  // Reset view when opening
  useEffect(() => {
    if (open) {
      setView("days")
      const y = viewDate.getFullYear()
      setYearRangeStart(y - (y % 20))
    }
  }, [open])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7

  const todayStr = new Date().toISOString().split('T')[0]
  const todayYear = new Date().getFullYear()
  const todayMonth = new Date().getMonth()

  const handleSelect = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(dateStr)
  }

  const handleMonthSelect = (m) => {
    setViewDate(new Date(year, m, 1))
    setView("days")
  }

  const handleYearSelect = (y) => {
    setViewDate(new Date(y, month, 1))
    setView("months")
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const displayValue = value
    ? (() => {
        const [y, m, d] = value.split('-')
        return `${d}.${m}.${y}`
      })()
    : ""

  // Parse selected value for highlighting in month/year grids
  const selectedYear = value ? +value.split('-')[0] : null
  const selectedMonth = value ? +value.split('-')[1] - 1 : null

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-content-secondary">{label}</label>}
      <div ref={containerRef} className="relative">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-surface-card text-sm rounded-xl px-3 py-2.5 border border-border hover:border-content-faint focus:border-accent-blue outline-none transition-colors text-left"
        >
          <span className={displayValue ? "text-content-primary" : "text-content-faint"}>
            {displayValue || placeholder}
          </span>
          <Calendar className="w-4 h-4 text-content-muted flex-shrink-0" />
        </button>

        {/* Calendar dropdown */}
        {open && (
          <div
            ref={dropdownRef}
            className="absolute left-0 z-50 w-72 bg-surface-card border border-border rounded-xl shadow-2xl p-4"
          >

            {/* ===== DAYS VIEW ===== */}
            {view === "days" && (
              <>
                {/* Header: click month/year text → months view */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("months")}
                    className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors"
                  >
                    {MONTH_NAMES[month]} {year}
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAY_HEADERS.map(d => (
                    <div key={d} className="text-center text-content-faint text-xs font-medium py-1">{d}</div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} className="w-8 h-8" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isSelected = value === dateStr
                    const isToday = dateStr === todayStr

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSelect(day)}
                        className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-primary text-white font-medium"
                            : isToday
                              ? "bg-primary/30 text-primary font-medium"
                              : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* ===== MONTHS VIEW ===== */}
            {view === "months" && (
              <>
                {/* Header: arrows change year, click year text → years view */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setViewDate(new Date(year - 1, month, 1))}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setYearRangeStart(year - (year % 20))
                      setView("years")
                    }}
                    className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors"
                  >
                    {year}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewDate(new Date(year + 1, month, 1))}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Month grid 4×3 */}
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_SHORT.map((name, i) => {
                    const isCurrent = year === todayYear && i === todayMonth
                    const isSelected = year === selectedYear && i === selectedMonth

                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleMonthSelect(i)}
                        className={`py-2.5 text-sm rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-primary text-white font-medium"
                            : isCurrent
                              ? "bg-primary/30 text-primary font-medium"
                              : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* ===== YEARS VIEW ===== */}
            {view === "years" && (
              <>
                {/* Header: arrows shift 20-year range */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setYearRangeStart(yearRangeStart - 20)}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-content-primary font-medium text-sm">
                    {yearRangeStart} – {yearRangeStart + 19}
                  </span>
                  <button
                    type="button"
                    onClick={() => setYearRangeStart(yearRangeStart + 20)}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Year grid 5×4 */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const y = yearRangeStart + i
                    const isCurrent = y === todayYear
                    const isSelected = y === selectedYear

                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => handleYearSelect(y)}
                        className={`py-2 text-sm rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-primary text-white font-medium"
                            : isCurrent
                              ? "bg-primary/30 text-primary font-medium"
                              : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {y}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Footer – always visible */}
            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  const now = new Date()
                  setViewDate(now)
                  setView("days")
                  handleSelect(now.getDate())
                }}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(""); setOpen(false) }}
                  className="text-xs text-content-faint hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-content-primary bg-surface-button hover:bg-surface-button-hover px-3 py-1 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DatePickerField
