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
 * Icon-only date picker. Renders a calendar icon button that opens a
 * portal-based calendar popup. The parent controls the surrounding field
 * styling and display value — this component only provides the icon trigger
 * and the calendar dropdown.
 *
 * Props:
 * - value        YYYY-MM-DD string (or "")
 * - onChange(str) callback with YYYY-MM-DD or ""
 * - iconSize     optional, default 16
 * - className    optional extra classes on the icon button
 */
const DatePickerField = ({ value, onChange, iconSize = 16, className = "" }) => {
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
  const [pos, setPos] = useState({ top: -9999, left: -9999 })
  const [positioned, setPositioned] = useState(false)

  const triggerRef = useRef(null)
  const calRef = useRef(null)

  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const calHeight = calRef.current?.offsetHeight || 360
    const calWidth = 288
    const pad = 8

    let top = rect.bottom + 4
    if (top + calHeight > window.innerHeight - pad && rect.top > calHeight + pad) {
      top = rect.top - calHeight - 4
    }

    let left = rect.right - calWidth
    if (left < pad) left = pad
    if (left + calWidth > window.innerWidth - pad) left = window.innerWidth - calWidth - pad

    setPos({ top, left })
    setPositioned(true)
  }, [])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(calcPosition)
    window.addEventListener("scroll", calcPosition, true)
    window.addEventListener("resize", calcPosition)
    return () => {
      window.removeEventListener("scroll", calcPosition, true)
      window.removeEventListener("resize", calcPosition)
    }
  }, [open, view, calcPosition])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  useEffect(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length === 3) setViewDate(new Date(+parts[0], +parts[1] - 1, +parts[2]))
    }
  }, [value])

  useEffect(() => {
    if (open) {
      setPositioned(false)
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

  const handleMonthSelect = (m) => { setViewDate(new Date(year, m, 1)); setView("days") }
  const handleYearSelect = (y) => { setViewDate(new Date(y, month, 1)); setView("months") }
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const selectedYear = value ? +value.split('-')[0] : null
  const selectedMonth = value ? +value.split('-')[1] - 1 : null

  const overlay = open ? createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }}
      onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div
        ref={calRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', top: pos.top, left: pos.left, width: 288,
          opacity: positioned ? 1 : 0, transition: 'opacity 0.05s ease-out'
        }}
        className="bg-surface-base border border-border rounded-xl shadow-2xl p-4"
      >
        {/* DAYS */}
        {view === "days" && (
          <>
            <div className="flex justify-between items-center mb-3">
              <button type="button" onClick={prevMonth} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button type="button" onClick={() => setView("months")} className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors">{MONTH_NAMES[month]} {year}</button>
              <button type="button" onClick={nextMonth} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_HEADERS.map(d => (<div key={d} className="text-center text-content-faint text-xs font-medium py-1">{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (<div key={`e-${i}`} className="w-8 h-8" />))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isSelected = value === dateStr
                const isToday = dateStr === todayStr
                return (
                  <button key={day} type="button" onClick={() => handleSelect(day)}
                    className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected ? "bg-primary text-white font-medium"
                        : isToday ? "bg-primary/20 text-primary font-medium"
                        : "text-content-secondary hover:bg-surface-button"
                    }`}>{day}</button>
                )
              })}
            </div>
          </>
        )}

        {/* MONTHS */}
        {view === "months" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={() => setViewDate(new Date(year - 1, month, 1))} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button type="button" onClick={() => { setYearRangeStart(year - (year % 20)); setView("years") }} className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors">{year}</button>
              <button type="button" onClick={() => setViewDate(new Date(year + 1, month, 1))} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTH_SHORT.map((name, i) => {
                const isCurrent = year === todayYear && i === todayMonth
                const isSelected = year === selectedYear && i === selectedMonth
                return (
                  <button key={name} type="button" onClick={() => handleMonthSelect(i)}
                    className={`py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isSelected ? "bg-primary text-white font-medium"
                        : isCurrent ? "bg-primary/20 text-primary font-medium"
                        : "text-content-secondary hover:bg-surface-button"
                    }`}>{name}</button>
                )
              })}
            </div>
          </>
        )}

        {/* YEARS */}
        {view === "years" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={() => setYearRangeStart(yearRangeStart - 20)} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-content-primary font-medium text-sm">{yearRangeStart} – {yearRangeStart + 19}</span>
              <button type="button" onClick={() => setYearRangeStart(yearRangeStart + 20)} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 20 }).map((_, i) => {
                const y = yearRangeStart + i
                const isCurrent = y === todayYear
                const isSelected = y === selectedYear
                return (
                  <button key={y} type="button" onClick={() => handleYearSelect(y)}
                    className={`py-2 text-sm rounded-lg transition-all duration-200 ${
                      isSelected ? "bg-primary text-white font-medium"
                        : isCurrent ? "bg-primary/20 text-primary font-medium"
                        : "text-content-secondary hover:bg-surface-button"
                    }`}>{y}</button>
                )
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
          <button type="button"
            onClick={() => { const now = new Date(); setViewDate(now); setView("days"); onChange(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`); setOpen(false) }}
            className="text-xs text-primary hover:text-primary-hover transition-colors">Today</button>
          {value && (
            <button type="button" onClick={() => { onChange(""); setOpen(false) }}
              className="text-xs text-content-faint hover:text-red-400 transition-colors">Clear</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`text-content-muted hover:text-content-primary transition-colors flex-shrink-0 ${className}`}
      >
        <Calendar style={{ width: iconSize, height: iconSize }} />
      </button>
      {overlay}
    </>
  )
}

export default DatePickerField
