/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

/**
 * Custom date picker with calendar dropdown + year/month drill-down.
 * Renders dropdown as a full-screen portal overlay (like a mini-modal)
 * to guarantee it appears above modals with overflow:hidden and high z-index.
 */
const DatePickerField = ({ label, value, onChange, placeholder = "Select date", className = "" }) => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState("days")
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length === 3) return new Date(+parts[0], +parts[1] - 1, +parts[2])
    }
    return new Date()
  })
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = viewDate.getFullYear()
    return y - (y % 20)
  })
  const [pos, setPos] = useState({ top: 0, left: 0, openAbove: false })

  const triggerRef = useRef(null)
  const calRef = useRef(null)

  // Calculate position from trigger button
  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const calHeight = calRef.current?.offsetHeight || 360
    const calWidth = 288
    const pad = 8

    let top = rect.bottom + 4
    let openAbove = false

    // Flip above if no room below
    if (top + calHeight > window.innerHeight - pad && rect.top > calHeight + pad) {
      top = rect.top - calHeight - 4
      openAbove = true
    }

    let left = rect.left
    if (left + calWidth > window.innerWidth - pad) {
      left = window.innerWidth - calWidth - pad
    }
    if (left < pad) left = pad

    setPos({ top, left, openAbove })
  }, [])

  // Recalculate on open / view change / scroll / resize
  useEffect(() => {
    if (!open) return
    // Small delay to let the DOM render so calRef is available
    requestAnimationFrame(calcPosition)

    window.addEventListener("scroll", calcPosition, true)
    window.addEventListener("resize", calcPosition)
    return () => {
      window.removeEventListener("scroll", calcPosition, true)
      window.removeEventListener("resize", calcPosition)
    }
  }, [open, view, calcPosition])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

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
    setOpen(false)
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

  const selectedYear = value ? +value.split('-')[0] : null
  const selectedMonth = value ? +value.split('-')[1] - 1 : null

  // ── Portal overlay (full-screen, above everything) ──
  const overlay = open ? createPortal(
    // Full-screen invisible backdrop - click to close
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }}
      onClick={(e) => {
        // Close only if clicking the backdrop, not the calendar
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      {/* Calendar panel - positioned near trigger */}
      <div
        ref={calRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: 288
        }}
        className="bg-[#141414] border border-[#333] rounded-xl shadow-2xl p-4"
      >

        {/* ===== DAYS VIEW ===== */}
        {view === "days" && (
          <>
            <div className="flex justify-between items-center mb-3">
              <button type="button" onClick={prevMonth}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setView("months")}
                className="text-white font-medium text-sm hover:bg-[#2f2f2f] px-2 py-1 rounded-lg transition-colors">
                {MONTH_NAMES[month]} {year}
              </button>
              <button type="button" onClick={nextMonth}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_HEADERS.map(d => (
                <div key={d} className="text-center text-gray-500 text-xs font-medium py-1">{d}</div>
              ))}
            </div>

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
                  <button key={day} type="button" onClick={() => handleSelect(day)}
                    className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-orange-500 text-white font-medium"
                        : isToday
                          ? "bg-orange-500/30 text-orange-400 font-medium"
                          : "text-gray-300 hover:bg-[#2f2f2f]"
                    }`}>
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
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={() => setViewDate(new Date(year - 1, month, 1))}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => { setYearRangeStart(year - (year % 20)); setView("years") }}
                className="text-white font-medium text-sm hover:bg-[#2f2f2f] px-2 py-1 rounded-lg transition-colors">
                {year}
              </button>
              <button type="button" onClick={() => setViewDate(new Date(year + 1, month, 1))}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MONTH_SHORT.map((name, i) => {
                const isCurrent = year === todayYear && i === todayMonth
                const isSelected = year === selectedYear && i === selectedMonth
                return (
                  <button key={name} type="button" onClick={() => handleMonthSelect(i)}
                    className={`py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isSelected ? "bg-orange-500 text-white font-medium"
                        : isCurrent ? "bg-orange-500/30 text-orange-400 font-medium"
                        : "text-gray-300 hover:bg-[#2f2f2f]"
                    }`}>
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
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={() => setYearRangeStart(yearRangeStart - 20)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white font-medium text-sm">
                {yearRangeStart} – {yearRangeStart + 19}
              </span>
              <button type="button" onClick={() => setYearRangeStart(yearRangeStart + 20)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 20 }).map((_, i) => {
                const y = yearRangeStart + i
                const isCurrent = y === todayYear
                const isSelected = y === selectedYear
                return (
                  <button key={y} type="button" onClick={() => handleYearSelect(y)}
                    className={`py-2 text-sm rounded-lg transition-all duration-200 ${
                      isSelected ? "bg-orange-500 text-white font-medium"
                        : isCurrent ? "bg-orange-500/30 text-orange-400 font-medium"
                        : "text-gray-300 hover:bg-[#2f2f2f]"
                    }`}>
                    {y}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#333] flex justify-between items-center">
          <button type="button"
            onClick={() => { const now = new Date(); setViewDate(now); setView("days"); onChange(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`); setOpen(false) }}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            Today
          </button>
          {value && (
            <button type="button" onClick={() => { onChange(""); setOpen(false) }}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-content-secondary">{label}</label>}
      <div ref={triggerRef}>
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
      </div>
      {overlay}
    </div>
  )
}

export default DatePickerField
