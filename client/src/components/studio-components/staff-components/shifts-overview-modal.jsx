/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useRef } from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Clock,
  Trash2,
  Maximize2,
  Minimize2,
  Users,
  User,
  AlertCircle,
  MousePointer2
} from "lucide-react"
import toast from "react-hot-toast"
import DatePickerField from "../../shared/DatePickerField"

// Helper to format date
const formatDateStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Helper to parse date string safely
const parseDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

// Check if date is weekend
const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// Check if date is in the past
const isPastDate = (dateStr) => {
  const today = formatDateStr(new Date())
  return dateStr < today
}

// Get day name abbreviation
const getDayName = (date) => {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  return days[date.getDay()]
}

// Calculate hours between two times
const calculateHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0
  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  return Math.max(0, (endMinutes - startMinutes) / 60)
}

// Format time short
const formatTimeShort = (time) => {
  if (!time) return ""
  return time.slice(0, 5)
}

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, img, size = "sm" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  if (img) {
    return (
      <img 
        src={img} 
        alt={`${firstName} ${lastName}`}
        className={`rounded-xl flex-shrink-0 object-cover ${sizeClasses[size]}`}
      />
    )
  }

  return (
    <div 
      className={`rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 bg-secondary ${sizeClasses[size]}`}
    >
      {getInitials()}
    </div>
  )
}

// CSS for patterns
const ShiftStyles = () => (
  <style>{`
    .tile-text { text-shadow: 0 0 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3); }
    .hatched-absence {
      background: repeating-linear-gradient(
        45deg,
        rgba(239, 68, 68, 0.3),
        rgba(239, 68, 68, 0.3) 3px,
        rgba(239, 68, 68, 0.5) 3px,
        rgba(239, 68, 68, 0.5) 6px
      );
    }
    .hatched-closing {
      background: repeating-linear-gradient(
        -45deg,
        rgba(107, 114, 128, 0.15),
        rgba(107, 114, 128, 0.15) 2px,
        rgba(107, 114, 128, 0.25) 2px,
        rgba(107, 114, 128, 0.25) 4px
      );
    }
    .shift-modal-wrapper {
      isolation: isolate;
    }
  `}</style>
)

// Tooltip Component - Fixed position portal-style
const Tooltip = ({ children, text, className = "", style = {} }) => {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2
      })
    }
  }

  const handleMouseEnter = () => {
    updatePosition()
    setShow(true)
  }

  const handleMouseLeave = () => {
    setShow(false)
  }

  // Update position on scroll while tooltip is shown
  useEffect(() => {
    if (show) {
      const handleScroll = () => updatePosition()
      window.addEventListener('scroll', handleScroll, true)
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [show])

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {show && (
        <div
          className="fixed z-[99999] pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
            transform: "translate(-50%, -100%)"
          }}
        >
          <div className="bg-surface-dark text-content-primary px-3 py-2 rounded-lg text-xs whitespace-pre-line max-w-[200px] text-center border border-border shadow-xl">
            {text}
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid var(--color-surface-dark)"
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, shiftDate }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
      <div className="bg-surface-card rounded-xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Delete Shift</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors"><X size={24} /></button>
        </div>
        <p className="text-sm text-content-secondary mb-4">
          Are you sure you want to delete this shift{shiftDate ? ` on ${shiftDate}` : ""}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// Shift Bar Component with Tooltip
const ShiftBar = ({ shift, staffColor, onClick, style = {}, className = "", showTime = true, compactTime = false }) => {
  const isPast = isPastDate(shift.endDate)
  const isAbsence = shift.status === "absence"
  const hasNotes = shift.notes && shift.notes.trim().length > 0
  const timeDisplay = `${formatTimeShort(shift.startTime)} - ${formatTimeShort(shift.endTime)}`
  const compactTimeDisplay = `${shift.startTime.split(":")[0]}-${shift.endTime.split(":")[0]}`
  const tooltipText = hasNotes ? `${timeDisplay}\n${shift.notes}` : timeDisplay

  // Separate positioning styles (for tooltip wrapper) from visual styles (for inner div)
  const { left, top, width, height, position, zIndex, padding, ...visualStyles } = style
  const positionStyles = { left, top, width, height, position, zIndex }
  
  // Clean up undefined values
  Object.keys(positionStyles).forEach(key => {
    if (positionStyles[key] === undefined) delete positionStyles[key]
  })

  return (
    <Tooltip 
      text={tooltipText} 
      className={className}
      style={positionStyles}
    >
      <div
        className={`w-full h-full rounded cursor-pointer transition-all hover:brightness-110 hover:scale-[1.02] ${isAbsence ? "hatched-absence border border-red-500/50" : ""} ${isPast ? "opacity-50" : ""}`}
        style={{
          backgroundColor: isAbsence ? undefined : staffColor,
          padding: padding,
          ...visualStyles
        }}
        onClick={(e) => { e.stopPropagation(); onClick(shift) }}
      >
        {showTime && (
          <div className={`h-full flex items-center overflow-hidden ${compactTime ? "px-1 justify-center" : "px-3"}`}>
            <span className={`font-medium truncate text-white tile-text ${compactTime ? "text-[10px]" : "text-sm"}`}>
              {compactTime ? compactTimeDisplay : timeDisplay}
            </span>
          </div>
        )}
      </div>
    </Tooltip>
  )
}

// Individual Calendar View
const IndividualCalendarView = ({ 
  staff, 
  shifts, 
  currentMonth, 
  onViewShift,
  closingDays,
  viewPeriod
}) => {
  const staffShifts = shifts.filter(s => s.staffId === staff.id)
  const staffColor = staff.color || "var(--color-secondary)"

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const isClosingDay = (dateStr) => closingDays.includes(dateStr) || isWeekend(parseDate(dateStr))
  const getShiftsForDate = (dateStr) => staffShifts.filter(s => dateStr >= s.startDate && dateStr <= s.endDate)

  // Day View
  if (viewPeriod === "day") {
    const dateStr = formatDateStr(currentMonth)
    const dayShifts = getShiftsForDate(dateStr)
    const isClosed = isClosingDay(dateStr)

    return (
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <div className={`text-center mb-6 ${isClosed ? "text-content-faint" : "text-content-primary"}`}>
          <div className="text-3xl font-bold">{currentMonth.getDate()}</div>
          <div className="text-base text-content-muted mt-1">
            {currentMonth.toLocaleDateString("en-US", { weekday: "long", month: "long", year: "numeric" })}
          </div>
        </div>
        
        {isClosed ? (
          <div className="text-center py-12 text-content-faint">
            <div className="hatched-closing w-20 h-20 rounded-xl mx-auto mb-4" />
            <p className="text-lg">Closing Day</p>
          </div>
        ) : dayShifts.length > 0 ? (
          <div className="space-y-2 max-w-sm mx-auto">
            {dayShifts.map((shift, idx) => {
              const isPast = isPastDate(shift.endDate)
              const isAbsence = shift.status === "absence"
              return (
                <div
                  key={shift.id || idx}
                  className={`rounded-xl px-4 py-3 cursor-pointer ${isAbsence ? "hatched-absence border border-red-500/50" : ""} ${isPast ? "opacity-50" : ""}`}
                  style={{ backgroundColor: isAbsence ? undefined : staffColor }}
                  onClick={() => onViewShift(shift)}
                >
                  <span className="font-medium text-sm text-white tile-text">
                    {formatTimeShort(shift.startTime)} - {formatTimeShort(shift.endTime)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-content-faint"><p className="text-lg">No shift scheduled</p></div>
        )}
      </div>
    )
  }

  // Week View
  if (viewPeriod === "week") {
    const startOfWeek = new Date(currentMonth)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })

    return (
      <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[600px]">
            {weekDays.map((date, i) => {
              const dateStr = formatDateStr(date)
              const dayShifts = getShiftsForDate(dateStr)
              const isClosed = isClosingDay(dateStr)
              const isToday = dateStr === formatDateStr(new Date())

              return (
                <div key={i} className={`border-r border-border last:border-r-0 min-h-[280px] ${isClosed ? "hatched-closing" : ""}`}>
                  <div className={`p-3 text-center border-b border-border ${isToday ? "bg-secondary/20" : ""}`}>
                    <div className={`text-sm ${isClosed ? "text-content-faint" : "text-content-muted"}`}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</div>
                    <div className={`text-2xl font-semibold mt-1 ${isToday ? "text-secondary" : isClosed ? "text-content-faint" : "text-content-primary"}`}>{date.getDate()}</div>
                  </div>
                  <div className="p-2 space-y-1">
                    {dayShifts.map((shift, idx) => {
                      const isPast = isPastDate(shift.endDate)
                      const isAbsence = shift.status === "absence"
                      return (
                        <div
                          key={shift.id || idx}
                          className={`rounded-lg p-2 cursor-pointer ${isAbsence ? "hatched-absence border border-red-500/50" : ""} ${isPast ? "opacity-50" : ""}`}
                          style={{ backgroundColor: isAbsence ? undefined : staffColor }}
                          onClick={() => onViewShift(shift)}
                        >
                          <div className="text-xs font-medium text-white tile-text">
                            {formatTimeShort(shift.startTime)} - {formatTimeShort(shift.endTime)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Month View
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  return (
    <div className="flex flex-col h-full overflow-x-auto">
      <div className="min-w-[500px]">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <div key={d} className={`py-4 text-center text-base font-medium ${i === 0 || i === 6 ? "text-content-faint" : "text-content-muted"}`}>{d}</div>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-7 bg-surface-card border border-t-0 border-border">
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-border/30 bg-surface-dark/30" />
            ))}
            {Array.from({ length: daysInMonth }, (_, dayIdx) => {
              const day = dayIdx + 1
              const date = new Date(year, month, day)
              const dateStr = formatDateStr(date)
              const isClosed = isClosingDay(dateStr)
              const dayShifts = getShiftsForDate(dateStr)
              const isToday = dateStr === formatDateStr(new Date())

              return (
                <div key={day} className={`min-h-[120px] border-b border-r border-border/30 p-2 ${isClosed ? "hatched-closing" : ""} ${isToday ? "ring-2 ring-inset ring-secondary/50" : ""}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-secondary" : isClosed ? "text-content-faint" : "text-content-muted"}`}>{day}</div>
                  <div className="space-y-1">
                    {dayShifts.slice(0, 2).map((shift, idx) => {
                      const isPast = isPastDate(shift.endDate)
                      const isAbsence = shift.status === "absence"
                      return (
                        <div
                          key={shift.id || idx}
                          className={`rounded px-1 py-0.5 cursor-pointer ${isAbsence ? "hatched-absence border border-red-500/50" : ""} ${isPast ? "opacity-50" : ""}`}
                          style={{ backgroundColor: isAbsence ? undefined : staffColor }}
                          onClick={() => onViewShift(shift)}
                        >
                          <span className="text-[9px] font-medium text-white tile-text">
                            {formatTimeShort(shift.startTime)} - {formatTimeShort(shift.endTime)}
                          </span>
                        </div>
                      )
                    })}
                    {dayShifts.length > 2 && <div className="text-[10px] text-content-faint text-center">+{dayShifts.length - 2}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Group Calendar View with proper absolute positioning
const GroupCalendarView = ({ 
  staffMembers, 
  shifts, 
  currentMonth,
  onEditShift,
  onAddShift,
  closingDays,
  viewPeriod,
  isMultiSelectMode,
  selectedDates,
  selectionStart,
  selectionStaffId,
  onCellClick,
  onCellHover
}) => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const isClosingDay = (dateStr) => closingDays.includes(dateStr) || isWeekend(parseDate(dateStr))
  const getShiftsForDate = (staffId, dateStr) => shifts.filter(s => s.staffId === staffId && dateStr >= s.startDate && dateStr <= s.endDate)

  // Day View
  if (viewPeriod === "day") {
    const dateStr = formatDateStr(currentMonth)
    const isClosed = isClosingDay(dateStr)

    return (
      <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-border ${isClosed ? "hatched-closing" : ""}`}>
          <div className="text-content-primary font-semibold text-base sm:text-xl">
            {currentMonth.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
          {isClosed && <span className="text-xs sm:text-sm text-content-faint">Closing Day</span>}
        </div>
        <div className="divide-y divide-border">
          {staffMembers.map(staff => {
            const dayShifts = getShiftsForDate(staff.id, dateStr)
            const staffColor = staff.color || "var(--color-secondary)"

            return (
              <div 
                key={staff.id}
                className={`flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 gap-2 sm:gap-4 ${!isClosed ? "cursor-pointer hover:bg-white/5" : ""} ${isClosed ? "hatched-closing" : ""}`}
                onClick={() => !isClosed && onAddShift({ staffId: staff.id, date: dateStr })}
              >
                <div className="flex items-center gap-2 sm:gap-3 sm:w-48 flex-shrink-0">
                  <InitialsAvatar firstName={staff.firstName} lastName={staff.lastName} img={staff.img} size="sm" />
                  <span className="text-sm sm:text-base text-content-secondary">{staff.firstName} {staff.lastName}</span>
                </div>
                <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3 ml-8 sm:ml-0">
                  {dayShifts.map((shift, idx) => {
                    const isPast = isPastDate(shift.endDate)
                    const isAbsence = shift.status === "absence"
                    const hasNotes = shift.notes && shift.notes.trim().length > 0
                    const timeDisplay = `${formatTimeShort(shift.startTime)} - ${formatTimeShort(shift.endTime)}`
                    const tooltipText = hasNotes ? `${timeDisplay}\n${shift.notes}` : timeDisplay

                    return (
                      <Tooltip key={shift.id || idx} text={tooltipText}>
                        <div
                          className={`rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 cursor-pointer transition-all hover:brightness-110 hover:scale-[1.02] ${isAbsence ? "hatched-absence border border-red-500/50" : ""} ${isPast ? "opacity-50" : ""}`}
                          style={{ backgroundColor: isAbsence ? undefined : staffColor }}
                          onClick={(e) => { e.stopPropagation(); onEditShift(shift) }}
                        >
                          <span className="text-xs sm:text-sm font-medium text-white tile-text">
                            {timeDisplay}
                          </span>
                        </div>
                      </Tooltip>
                    )
                  })}
                  {!isClosed && dayShifts.length === 0 && <span className="text-content-faint text-xs sm:text-sm">Tap to add shift</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Week View
  if (viewPeriod === "week") {
    const startOfWeek = new Date(currentMonth)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      weekDays.push({ date: d, dateStr: formatDateStr(d) })
    }

    const CELL_WIDTH = 150
    const STAFF_COL_WIDTH = 200
    const BAR_HEIGHT = 32
    const BAR_GAP = 8
    const MIN_ROW_HEIGHT = 100
    const PADDING_TOP = 12
    const PADDING_BOTTOM = 12

    const weekStart = weekDays[0].dateStr
    const weekEnd = weekDays[6].dateStr
    
    // Split shifts into segments that skip closing days
    const splitShiftIntoSegments = (shift) => {
      const segments = []
      let segmentStart = null
      
      for (let i = 0; i < 7; i++) {
        const { dateStr } = weekDays[i]
        const isInShift = dateStr >= shift.startDate && dateStr <= shift.endDate
        const isClosed = isClosingDay(dateStr)
        
        if (isInShift && !isClosed) {
          if (segmentStart === null) {
            segmentStart = i
          }
        } else {
          if (segmentStart !== null) {
            segments.push({ startIdx: segmentStart, endIdx: i - 1, shift })
            segmentStart = null
          }
        }
      }
      
      // Don't forget the last segment - end at the last active day
      if (segmentStart !== null) {
        // Find the actual last day within the shift
        let lastIdx = segmentStart
        for (let i = segmentStart; i < 7; i++) {
          const { dateStr } = weekDays[i]
          if (dateStr >= shift.startDate && dateStr <= shift.endDate && !isClosingDay(dateStr)) {
            lastIdx = i
          }
        }
        segments.push({ startIdx: segmentStart, endIdx: lastIdx, shift })
      }
      
      return segments
    }
    
    // Pre-calculate segments with lanes for each staff member
    const staffShiftsData = staffMembers.map(staff => {
      const staffShifts = shifts.filter(s => 
        s.staffId === staff.id && 
        s.startDate <= weekEnd && 
        s.endDate >= weekStart
      )
      
      // Get all segments from all shifts
      const allSegments = staffShifts.flatMap(shift => splitShiftIntoSegments(shift))
      
      // Sort segments by startIdx, then by shift id for consistent ordering
      allSegments.sort((a, b) => {
        if (a.startIdx !== b.startIdx) return a.startIdx - b.startIdx
        return (a.shift.id || "").localeCompare(b.shift.id || "")
      })
      
      // Assign lanes to segments (not shifts)
      const segmentsWithLanes = []
      const lanes = []
      
      for (const segment of allSegments) {
        let assignedLane = -1
        for (let i = 0; i < lanes.length; i++) {
          const laneSegments = lanes[i]
          const overlaps = laneSegments.some(s => 
            !(segment.endIdx < s.startIdx || segment.startIdx > s.endIdx)
          )
          if (!overlaps) {
            assignedLane = i
            break
          }
        }
        if (assignedLane === -1) {
          assignedLane = lanes.length
          lanes.push([])
        }
        lanes[assignedLane].push(segment)
        segmentsWithLanes.push({ ...segment, lane: assignedLane })
      }
      
      const maxLane = segmentsWithLanes.length > 0 ? Math.max(...segmentsWithLanes.map(s => s.lane)) : -1
      const rowHeight = Math.max(MIN_ROW_HEIGHT, PADDING_TOP + (maxLane + 1) * (BAR_HEIGHT + BAR_GAP) + PADDING_BOTTOM)
      return { staff, segmentsWithLanes, rowHeight }
    })

    return (
      <div className="bg-surface-card rounded-xl border border-border overflow-auto">
        <div style={{ minWidth: STAFF_COL_WIDTH + 7 * CELL_WIDTH }}>
          {/* Header */}
          <div className="flex border-b border-border sticky top-0 bg-surface-card z-10">
            <div style={{ width: STAFF_COL_WIDTH }} className="flex-shrink-0 p-4 border-r border-border text-content-faint text-sm font-medium">Staff</div>
            {weekDays.map(({ date, dateStr }, i) => {
              const isClosed = isClosingDay(dateStr)
              const isToday = dateStr === formatDateStr(new Date())
              return (
                <div 
                  key={i}
                  style={{ width: CELL_WIDTH }}
                  className={`flex-shrink-0 text-center py-4 border-r border-border last:border-r-0 ${isClosed ? "hatched-closing" : ""} ${isToday ? "bg-secondary/10" : ""}`}
                >
                  <div className={`text-sm ${isClosed ? "text-content-faint" : "text-content-faint"}`}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</div>
                  <div className={`text-2xl font-semibold mt-1 ${isToday ? "text-secondary" : isClosed ? "text-content-faint" : "text-content-primary"}`}>{date.getDate()}</div>
                </div>
              )
            })}
          </div>

          {/* Staff Rows */}
          {staffShiftsData.map(({ staff, segmentsWithLanes, rowHeight }) => {
            const staffColor = staff.color || "var(--color-secondary)"

            return (
              <div key={staff.id} className="flex border-b border-border last:border-b-0">
                {/* Staff Name */}
                <div style={{ width: STAFF_COL_WIDTH, height: rowHeight }} className="flex-shrink-0 flex items-center gap-3 px-4 border-r border-border">
                  <InitialsAvatar firstName={staff.firstName} lastName={staff.lastName} img={staff.img} size="md" />
                  <span className="text-sm text-content-secondary truncate">{staff.firstName} {staff.lastName}</span>
                </div>

                {/* Timeline Container - NO overflow hidden! */}
                <div style={{ width: 7 * CELL_WIDTH, height: rowHeight }} className="relative flex-shrink-0">
                  {/* Background Cells */}
                  <div className="absolute inset-0 flex">
                    {weekDays.map(({ dateStr }, i) => {
                      const isClosed = isClosingDay(dateStr)
                      const isToday = dateStr === formatDateStr(new Date())
                      const isSelected = selectionStaffId === staff.id && selectedDates.includes(dateStr)
                      const isSelectionStart = selectionStaffId === staff.id && selectionStart === dateStr

                      return (
                        <div 
                          key={i}
                          style={{ width: CELL_WIDTH }}
                          className={`h-full border-r border-border last:border-r-0 ${!isClosed ? "cursor-pointer hover:bg-white/5" : ""} ${isClosed ? "hatched-closing" : ""} ${isToday ? "bg-secondary/5" : ""} ${isSelectionStart ? "!bg-secondary/30" : ""} ${isSelected && !isSelectionStart ? "!bg-secondary/20" : ""}`}
                          onClick={() => !isClosed && onCellClick(staff.id, dateStr)}
                          onMouseEnter={() => onCellHover(staff.id, dateStr)}
                        />
                      )
                    })}
                  </div>

                  {/* Shift Segments - Absolutely Positioned */}
                  {segmentsWithLanes.map((segment, idx) => {
                    const { startIdx, endIdx, shift, lane } = segment
                    
                    const leftPx = startIdx * CELL_WIDTH + 4
                    const widthPx = (endIdx - startIdx + 1) * CELL_WIDTH - 8

                    return (
                      <ShiftBar
                        key={`${shift.id}-${idx}`}
                        shift={shift}
                        staffColor={staffColor}
                        onClick={onEditShift}
                        className="absolute"
                        style={{
                          left: leftPx,
                          width: widthPx,
                          top: PADDING_TOP + lane * (BAR_HEIGHT + BAR_GAP),
                          height: BAR_HEIGHT,
                          zIndex: 5
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Month View - With spanning bars like Week View
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthDays = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    monthDays.push({ date, dateStr: formatDateStr(date), day: d, dayIndex: d - 1 })
  }

  const CELL_WIDTH = 42
  const STAFF_COL_WIDTH = 160
  const BAR_HEIGHT = 20
  const BAR_GAP = 4
  const MIN_ROW_HEIGHT = 56
  const PADDING_TOP = 6
  const PADDING_BOTTOM = 6

  const monthStart = monthDays[0].dateStr
  const monthEnd = monthDays[monthDays.length - 1].dateStr

  // Split shifts into segments that skip closing days (same logic as week view)
  const splitShiftIntoSegments = (shift) => {
    const segments = []
    let segmentStart = null
    
    for (let i = 0; i < daysInMonth; i++) {
      const { dateStr } = monthDays[i]
      const isInShift = dateStr >= shift.startDate && dateStr <= shift.endDate
      const isClosed = isClosingDay(dateStr)
      
      if (isInShift && !isClosed) {
        if (segmentStart === null) {
          segmentStart = i
        }
      } else {
        if (segmentStart !== null) {
          segments.push({ startIdx: segmentStart, endIdx: i - 1, shift })
          segmentStart = null
        }
      }
    }
    
    if (segmentStart !== null) {
      let lastIdx = segmentStart
      for (let i = segmentStart; i < daysInMonth; i++) {
        const { dateStr } = monthDays[i]
        if (dateStr >= shift.startDate && dateStr <= shift.endDate && !isClosingDay(dateStr)) {
          lastIdx = i
        }
      }
      segments.push({ startIdx: segmentStart, endIdx: lastIdx, shift })
    }
    
    return segments
  }

  // Pre-calculate segments with lanes for each staff member
  const staffShiftsData = staffMembers.map(staff => {
    const staffShifts = shifts.filter(s => 
      s.staffId === staff.id && 
      s.startDate <= monthEnd && 
      s.endDate >= monthStart
    )
    
    const allSegments = staffShifts.flatMap(shift => splitShiftIntoSegments(shift))
    
    allSegments.sort((a, b) => {
      if (a.startIdx !== b.startIdx) return a.startIdx - b.startIdx
      return (a.shift.id || "").localeCompare(b.shift.id || "")
    })
    
    const segmentsWithLanes = []
    const lanes = []
    
    for (const segment of allSegments) {
      let assignedLane = -1
      for (let i = 0; i < lanes.length; i++) {
        const laneSegments = lanes[i]
        const overlaps = laneSegments.some(s => 
          !(segment.endIdx < s.startIdx || segment.startIdx > s.endIdx)
        )
        if (!overlaps) {
          assignedLane = i
          break
        }
      }
      if (assignedLane === -1) {
        assignedLane = lanes.length
        lanes.push([])
      }
      lanes[assignedLane].push(segment)
      segmentsWithLanes.push({ ...segment, lane: assignedLane })
    }
    
    const maxLane = segmentsWithLanes.length > 0 ? Math.max(...segmentsWithLanes.map(s => s.lane)) : -1
    const rowHeight = Math.max(MIN_ROW_HEIGHT, PADDING_TOP + (maxLane + 1) * (BAR_HEIGHT + BAR_GAP) + PADDING_BOTTOM)
    return { staff, segmentsWithLanes, rowHeight }
  })

  return (
    <div className="bg-surface-card rounded-xl border border-border overflow-auto max-h-full">
      <div style={{ minWidth: STAFF_COL_WIDTH + daysInMonth * CELL_WIDTH }}>
        {/* Header */}
        <div className="flex border-b border-border sticky top-0 bg-surface-card z-10">
          <div style={{ width: STAFF_COL_WIDTH }} className="flex-shrink-0 p-2 border-r border-border text-content-faint text-xs font-medium">Staff</div>
          {monthDays.map(({ date, dateStr, day }) => {
            const isClosed = isClosingDay(dateStr)
            const isToday = dateStr === formatDateStr(new Date())
            return (
              <div 
                key={day}
                style={{ width: CELL_WIDTH }}
                className={`flex-shrink-0 text-center py-1.5 border-r border-border/50 last:border-r-0 ${isClosed ? "hatched-closing" : ""} ${isToday ? "bg-secondary/10" : ""}`}
              >
                <div className={`text-[9px] ${isClosed ? "text-content-faint" : "text-content-faint"}`}>{getDayName(date)}</div>
                <div className={`text-sm font-semibold ${isToday ? "text-secondary" : isClosed ? "text-content-faint" : "text-content-primary"}`}>{day}</div>
              </div>
            )
          })}
        </div>

        {/* Staff Rows */}
        {staffShiftsData.map(({ staff, segmentsWithLanes, rowHeight }) => {
          const staffColor = staff.color || "var(--color-secondary)"

          return (
            <div key={staff.id} className="flex border-b border-border/50 last:border-b-0">
              {/* Staff Name */}
              <div style={{ width: STAFF_COL_WIDTH, height: rowHeight }} className="flex-shrink-0 flex items-center gap-2 px-2 border-r border-border">
                <InitialsAvatar firstName={staff.firstName} lastName={staff.lastName} img={staff.img} size="sm" />
                <span className="text-xs text-content-secondary truncate">{staff.firstName} {staff.lastName}</span>
              </div>

              {/* Timeline Container */}
              <div style={{ width: daysInMonth * CELL_WIDTH, height: rowHeight }} className="relative flex-shrink-0">
                {/* Background Cells */}
                <div className="absolute inset-0 flex">
                  {monthDays.map(({ dateStr, day }) => {
                    const isClosed = isClosingDay(dateStr)
                    const isToday = dateStr === formatDateStr(new Date())
                    const isSelected = selectionStaffId === staff.id && selectedDates.includes(dateStr)
                    const isSelectionStart = selectionStaffId === staff.id && selectionStart === dateStr

                    return (
                      <div 
                        key={day}
                        style={{ width: CELL_WIDTH }}
                        className={`h-full border-r border-border/50 last:border-r-0 ${!isClosed ? "cursor-pointer hover:bg-white/5" : ""} ${isClosed ? "hatched-closing" : ""} ${isToday ? "bg-secondary/5" : ""} ${isSelectionStart ? "!bg-secondary/30" : ""} ${isSelected && !isSelectionStart ? "!bg-secondary/20" : ""}`}
                        onClick={() => !isClosed && onCellClick(staff.id, dateStr)}
                        onMouseEnter={() => onCellHover(staff.id, dateStr)}
                      />
                    )
                  })}
                </div>

                {/* Shift Segments - Absolutely Positioned */}
                {segmentsWithLanes.map((segment, idx) => {
                  const { startIdx, endIdx, shift, lane } = segment
                  
                  const leftPx = startIdx * CELL_WIDTH + 2
                  const widthPx = (endIdx - startIdx + 1) * CELL_WIDTH - 4

                  return (
                    <ShiftBar
                      key={`${shift.id}-${idx}`}
                      shift={shift}
                      staffColor={staffColor}
                      onClick={onEditShift}
                      showTime={true}
                      compactTime={true}
                      className="absolute"
                      style={{
                        left: leftPx,
                        width: widthPx,
                        top: PADDING_TOP + lane * (BAR_HEIGHT + BAR_GAP),
                        height: BAR_HEIGHT,
                        zIndex: 5
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Shift Form Modal
const ShiftFormModal = ({ 
  isOpen, 
  onClose, 
  shift, 
  staffMembers, 
  onSave, 
  onDelete,
  fixedStaffId,
  initialStartDate,
  initialEndDate,
  readOnly = false,
  closingDays = []
}) => {
  const [formData, setFormData] = useState({
    staffId: "", startDate: "", endDate: "", startTime: "", endTime: "", status: "scheduled", notes: ""
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (shift) {
      setFormData({
        staffId: shift.staffId || fixedStaffId || "",
        startDate: shift.startDate || initialStartDate || "",
        endDate: shift.endDate || initialEndDate || initialStartDate || "",
        startTime: shift.startTime || "",
        endTime: shift.endTime || "",
        status: shift.status || "scheduled",
        notes: shift.notes || ""
      })
    } else {
      setFormData({
        staffId: fixedStaffId || "",
        startDate: initialStartDate || "",
        endDate: initialEndDate || initialStartDate || "",
        startTime: "",
        endTime: "",
        status: "scheduled",
        notes: ""
      })
    }
    setShowDeleteModal(false)
  }, [shift, fixedStaffId, initialStartDate, initialEndDate])

  if (!isOpen) return null

  const selectedStaff = staffMembers.find(s => s.id === Number(formData.staffId))
  const hours = formData.startTime && formData.endTime ? calculateHours(formData.startTime, formData.endTime) : 0
  const isClosingDayFn = (dateStr) => closingDays.includes(dateStr) || isWeekend(parseDate(dateStr))
  const isFormValid = formData.staffId && formData.startDate && formData.startTime && formData.endTime

  const handleSave = () => {
    if (!isFormValid) { toast.error("Please fill all required fields"); return }
    const endDate = formData.endDate || formData.startDate
    onSave({
      id: shift?.id || `shift-${Date.now()}`,
      staffId: Number(formData.staffId),
      startDate: formData.startDate,
      endDate: endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status,
      notes: formData.notes
    })
    if (!shift) toast.success("Shift added")
    onClose()
  }

  const handleDeleteConfirm = () => {
    if (shift) { onDelete(shift.id); toast.success("Shift deleted"); setShowDeleteModal(false); onClose() }
  }

  const getDaysCount = () => {
    if (!formData.startDate) return 0
    const endDate = formData.endDate || formData.startDate
    const start = parseDate(formData.startDate)
    const end = parseDate(endDate)
    let count = 0
    const current = new Date(start)
    while (current <= end) { if (!isClosingDayFn(formatDateStr(current))) count++; current.setDate(current.getDate() + 1) }
    return count
  }

  const daysCount = getDaysCount()

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1001] overflow-y-auto">
        <div className="bg-surface-card p-6 rounded-xl w-full max-w-md my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-content-primary font-bold">{readOnly ? "View Shift" : shift ? "Edit Shift" : "New Shift"}</h2>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors"><X size={24} /></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
            {!fixedStaffId && !readOnly && (
              <div>
                <label className="text-sm text-content-secondary block mb-2">Staff Member <span className="text-accent-red">*</span></label>
                <select value={formData.staffId} onChange={(e) => setFormData({ ...formData, staffId: e.target.value })} className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors">
                  <option value="">Select staff...</option>
                  {staffMembers.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
            )}

            {selectedStaff && (
              <div className="bg-surface-dark rounded-xl p-3 flex items-center gap-3">
                <InitialsAvatar firstName={selectedStaff.firstName} lastName={selectedStaff.lastName} img={selectedStaff.img} size="sm" />
                <div className="flex-1">
                  <p className="text-content-primary font-medium text-sm">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                  <p className="text-xs text-content-faint">{selectedStaff.role}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2 border-t border-border">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Schedule</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-content-secondary block mb-2">Start Date <span className="text-accent-red">*</span></label>
                  <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                    <span className={formData.startDate ? "text-content-primary" : "text-content-faint"}>{formData.startDate ? (() => { const [y,m,d] = formData.startDate.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                    {!readOnly && <DatePickerField value={formData.startDate} onChange={(val) => setFormData({ ...formData, startDate: val, endDate: formData.endDate || val })} />}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-content-secondary block mb-2">End Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                    <span className={formData.endDate ? "text-content-primary" : "text-content-faint"}>{formData.endDate ? (() => { const [y,m,d] = formData.endDate.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                    {!readOnly && <DatePickerField value={formData.endDate} onChange={(val) => setFormData({ ...formData, endDate: val })} />}
                  </div>
                </div>
              </div>

              {!readOnly && (
                <div>
                  <label className="text-sm text-content-secondary block mb-2">Type</label>
                  <div className="flex gap-3">
                    <button onClick={() => setFormData({ ...formData, status: "scheduled" })} className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border transition-all ${formData.status === "scheduled" ? "bg-primary/20 text-primary border-primary/50" : "bg-surface-dark text-content-muted border-transparent hover:border-border"}`}>
                      <Clock size={16} />Shift
                    </button>
                    <button onClick={() => setFormData({ ...formData, status: "absence" })} className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border transition-all ${formData.status === "absence" ? "bg-primary/20 text-primary border-primary/50" : "bg-surface-dark text-content-muted border-transparent hover:border-border"}`}>
                      <AlertCircle size={16} />Absence
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-content-secondary block mb-2">{formData.status === "absence" ? "From" : "Start Time"} <span className="text-accent-red">*</span></label>
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors [color-scheme:dark]" disabled={readOnly} />
                </div>
                <div>
                  <label className="text-sm text-content-secondary block mb-2">{formData.status === "absence" ? "To" : "End Time"} <span className="text-accent-red">*</span></label>
                  <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors [color-scheme:dark]" disabled={readOnly} />
                </div>
              </div>
            </div>

            {hours > 0 && (
              <div className="rounded-xl p-4 flex items-center gap-3 bg-primary/10 border border-primary/30">
                <Clock size={20} className="text-primary" />
                <div>
                  <p className="text-primary font-medium text-sm">{hours.toFixed(1)} hours {formData.status === "absence" ? "absent" : ""} {daysCount > 1 ? `× ${daysCount} days` : ""}</p>
                  <p className="text-xs text-content-faint">{formData.startTime} - {formData.endTime}</p>
                </div>
              </div>
            )}

            {!readOnly && (
              <div>
                <label className="text-sm text-content-secondary block mb-2">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes..." rows={2} className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm resize-none border border-transparent focus:border-primary transition-colors" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {shift && !readOnly && <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors flex items-center gap-1"><Trash2 size={16} />Delete</button>}
            <button onClick={onClose} className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">{readOnly ? "Close" : "Cancel"}</button>
            {!readOnly && (
              <button onClick={handleSave} disabled={!isFormValid} className={`px-4 py-2 text-sm rounded-xl transition-colors ${isFormValid ? "bg-primary text-white hover:bg-primary-hover" : "bg-primary/50 text-white/50 cursor-not-allowed"}`}>{shift ? "Save Changes" : "Add Shift"}</button>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteConfirm} shiftDate={shift?.startDate} />
    </>
  )
}

// Main Component
function ShiftsOverviewModal({ staffMembers, onClose, currentStaffId = 1, isEmbedded = false }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState("team")
  const [viewPeriod, setViewPeriod] = useState("week")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState(null)
  const [modalInitialStartDate, setModalInitialStartDate] = useState("")
  const [modalInitialEndDate, setModalInitialEndDate] = useState("")
  const [modalFixedStaffId, setModalFixedStaffId] = useState(null)
  const [staffFilter, setStaffFilter] = useState("all")
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false)
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [selectedDates, setSelectedDates] = useState([])
  const [selectionStart, setSelectionStart] = useState(null)
  const [selectionStaffId, setSelectionStaffId] = useState(null)

  const closingDays = useMemo(() => {
    const days = []
    const year = currentMonth.getFullYear()
    for (let y = year - 1; y <= year + 1; y++) days.push(`${y}-01-01`, `${y}-12-25`, `${y}-12-26`)
    return days
  }, [currentMonth])

  const isClosingDay = (dateStr) => closingDays.includes(dateStr) || isWeekend(parseDate(dateStr))

  const [shifts, setShifts] = useState(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    
    return staffMembers.flatMap(staff => {
      const staffShifts = []
      let day = 1
      while (day <= 28) {
        const date = new Date(year, month, day)
        const dateStr = formatDateStr(date)
        if (!isWeekend(date) && Math.random() > 0.4) {
          const notes = Math.random() > 0.75 ? ["Meeting", "Remote", "Training", "Client"][Math.floor(Math.random() * 4)] : ""
          const isMultiDay = Math.random() > 0.88
          let endDay = day
          let endDateStr = dateStr
          
          if (isMultiDay && day <= 25) {
            const addDays = Math.floor(Math.random() * 2) + 1
            let tempDay = day
            for (let i = 0; i < addDays; i++) {
              tempDay++
              while (tempDay <= 28 && isWeekend(new Date(year, month, tempDay))) tempDay++
            }
            if (tempDay <= 28) {
              endDay = tempDay
              endDateStr = formatDateStr(new Date(year, month, endDay))
            }
          }
          
          staffShifts.push({
            id: `shift-${staff.id}-${day}`,
            staffId: staff.id,
            startDate: dateStr,
            endDate: endDateStr,
            startTime: `0${7 + Math.floor(Math.random() * 2)}:00`,
            endTime: `${14 + Math.floor(Math.random() * 4)}:00`,
            status: Math.random() > 0.95 ? "absence" : "scheduled",
            notes
          })
          
          // Skip to the day after this shift ends
          day = endDay + 1
        } else {
          day++
        }
      }
      return staffShifts
    })
  })

  const currentStaff = staffMembers.find(s => s.id === currentStaffId) || staffMembers[0]
  const filteredStaffMembers = useMemo(() => staffFilter === "all" ? staffMembers : staffMembers.filter(s => s.id === Number(staffFilter)), [staffMembers, staffFilter])

  const goToPrevious = () => {
    if (viewPeriod === "day") setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() - 1))
    else if (viewPeriod === "week") setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() - 7))
    else setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNext = () => {
    if (viewPeriod === "day") setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() + 1))
    else if (viewPeriod === "week") setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() + 7))
    else setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getNavigationLabel = () => {
    if (viewPeriod === "day") return currentMonth.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    if (viewPeriod === "week") {
      const start = new Date(currentMonth); start.setDate(start.getDate() - start.getDay() + 1)
      const end = new Date(start); end.setDate(start.getDate() + 6)
      return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`
    }
    return currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const cancelSelection = () => { setSelectionStart(null); setSelectionStaffId(null); setSelectedDates([]) }

  const handleCellClick = (staffId, dateStr) => {
    if (isClosingDay(dateStr)) return
    if (isMultiSelectMode) {
      if (!selectionStart || selectionStaffId !== staffId) {
        setSelectionStart(dateStr); setSelectionStaffId(staffId); setSelectedDates([dateStr])
      } else {
        const startDate = selectionStart < dateStr ? selectionStart : dateStr
        const endDate = selectionStart < dateStr ? dateStr : selectionStart
        setModalFixedStaffId(staffId); setModalInitialStartDate(startDate); setModalInitialEndDate(endDate)
        setEditingShift(null); setIsReadOnlyModal(false); setIsFormModalOpen(true); cancelSelection()
      }
    } else {
      setModalFixedStaffId(staffId); setModalInitialStartDate(dateStr); setModalInitialEndDate(dateStr)
      setEditingShift(null); setIsReadOnlyModal(false); setIsFormModalOpen(true)
    }
  }

  const handleCellHover = (staffId, dateStr) => {
    if (!isMultiSelectMode || !selectionStart || selectionStaffId !== staffId || isClosingDay(dateStr)) return
    const startDate = selectionStart < dateStr ? selectionStart : dateStr
    const endDate = selectionStart < dateStr ? dateStr : selectionStart
    const range = []
    const current = parseDate(startDate); const end = parseDate(endDate)
    while (current <= end) { const ds = formatDateStr(current); if (!isClosingDay(ds)) range.push(ds); current.setDate(current.getDate() + 1) }
    setSelectedDates(range)
  }

  const handleAddShift = (params) => {
    setModalFixedStaffId(params?.staffId || null); setModalInitialStartDate(params?.date || ""); setModalInitialEndDate(params?.date || "")
    setEditingShift(null); setIsReadOnlyModal(false); setIsFormModalOpen(true)
  }

  const handleEditShift = (shift) => {
    setEditingShift(shift); setModalFixedStaffId(null); setModalInitialStartDate(""); setModalInitialEndDate("")
    setIsReadOnlyModal(false); setIsFormModalOpen(true)
  }

  const handleViewShift = (shift) => { setEditingShift(shift); setModalFixedStaffId(shift.staffId); setIsReadOnlyModal(true); setIsFormModalOpen(true) }

  const handleSaveShift = (shiftData) => {
    if (editingShift) setShifts(prev => prev.map(s => s.id === shiftData.id ? shiftData : s))
    else setShifts(prev => [...prev, shiftData])
  }

  const closeModal = () => {
    setIsFormModalOpen(false); setEditingShift(null); setModalInitialStartDate(""); setModalInitialEndDate("")
    setModalFixedStaffId(null); setIsReadOnlyModal(false); cancelSelection()
  }

  const containerClass = isEmbedded ? "w-full h-full" : isFullscreen ? "fixed inset-0 z-[1000] bg-surface-base" : "fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-0 sm:p-2"
  const modalClass = isEmbedded ? "w-full h-full flex flex-col" : isFullscreen ? "w-full h-full flex flex-col" : "w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-[1400px] sm:max-h-[95vh] flex flex-col sm:border border-border shadow-2xl overflow-hidden"

  return (
    <div className={`${containerClass} shift-modal-wrapper`}>
      <ShiftStyles />
      <div className={`bg-surface-card text-content-primary ${modalClass}`}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border px-4 sm:px-6 py-3 sm:py-4">
          {/* Row 1: Title + Filter + Close */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0"><Calendar className="text-primary w-4 h-4 sm:w-5 sm:h-5" /></div>
              <h2 className="font-semibold text-content-primary text-lg sm:text-xl truncate">Shift Schedule</h2>
              {/* Filter - Mobile: next to title */}
              {viewMode === "team" && (
                <select 
                  value={staffFilter} 
                  onChange={(e) => setStaffFilter(e.target.value)} 
                  className="sm:hidden bg-surface-dark border border-border rounded-lg text-content-primary px-2 py-1.5 text-xs ml-auto flex-shrink-0"
                >
                  <option value="all">All</option>
                  {staffMembers.map(s => <option key={s.id} value={s.id}>{s.firstName}</option>)}
                </select>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {!isEmbedded && <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 bg-surface-dark hover:bg-surface-hover text-content-secondary rounded-lg hidden sm:block">{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>}
              {!isEmbedded && <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-surface-dark text-content-muted hover:text-content-primary rounded-lg"><X size={18} className="sm:hidden" /><X size={20} className="hidden sm:block" /></button>}
            </div>
          </div>

          {/* Row 2: Navigation + Controls */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* Navigation + Period Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button onClick={goToPrevious} className="p-1.5 sm:p-2 bg-surface-dark hover:bg-surface-hover rounded-lg flex-shrink-0"><ChevronLeft size={16} className="sm:hidden text-content-muted" /><ChevronLeft size={18} className="hidden sm:block text-content-muted" /></button>
              <button onClick={() => setCurrentMonth(new Date())} className="bg-surface-dark hover:bg-surface-hover rounded-lg font-medium text-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none sm:min-w-[200px] truncate">{getNavigationLabel()}</button>
              <button onClick={goToNext} className="p-1.5 sm:p-2 bg-surface-dark hover:bg-surface-hover rounded-lg flex-shrink-0"><ChevronRight size={16} className="sm:hidden text-content-muted" /><ChevronRight size={18} className="hidden sm:block text-content-muted" /></button>

              {/* Period Toggle - right next to date */}
              <div className="flex bg-surface-dark rounded-lg p-0.5">
                {["day", "week", "month"].map(p => (
                  <button key={p} onClick={() => setViewPeriod(p)} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm capitalize ${viewPeriod === p ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>{p.charAt(0).toUpperCase()}<span className="hidden sm:inline">{p.slice(1)}</span></button>
                ))}
              </div>
            </div>

            {/* Desktop only: Filter + Multi-Select */}
            {viewMode === "team" && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-px h-6 bg-surface-button mx-1" />
                <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="bg-surface-dark border border-border rounded-xl text-content-primary px-3 py-2 text-sm">
                  <option value="all">All ({staffMembers.length})</option>
                  {staffMembers.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
                <div className="w-px h-6 bg-surface-button mx-1" />
                <button onClick={() => { setIsMultiSelectMode(!isMultiSelectMode); cancelSelection() }} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors ${isMultiSelectMode ? "bg-primary text-white" : "bg-surface-dark text-content-muted hover:text-content-primary hover:bg-surface-hover"}`}>
                  <MousePointer2 size={14} />Multi-Select {isMultiSelectMode ? "ON" : "OFF"}
                </button>
                {isMultiSelectMode && selectionStart && <button onClick={cancelSelection} className="text-content-muted hover:text-content-primary text-xs">Cancel</button>}
              </div>
            )}

            <div className="flex-1 hidden sm:block" />

            {/* New Shift + View Mode */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Desktop: New Shift Button - left of view mode */}
              {viewMode === "team" && (
                <button onClick={() => handleAddShift(null)} className="hidden sm:flex bg-primary hover:bg-primary-hover text-white rounded-xl items-center gap-2 px-4 py-2 text-sm">
                  <Plus size={16} />New Shift
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="flex bg-surface-dark rounded-lg p-0.5">
                <button onClick={() => setViewMode("team")} className={`rounded-md flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm ${viewMode === "team" ? "bg-secondary text-white" : "text-content-muted hover:text-content-primary"}`}><Users size={12} className="sm:hidden" /><Users size={14} className="hidden sm:block" />Team</button>
                <button onClick={() => setViewMode("individual")} className={`rounded-md flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm ${viewMode === "individual" ? "bg-secondary text-white" : "text-content-muted hover:text-content-primary"}`}><User size={12} className="sm:hidden" /><User size={14} className="hidden sm:block" />My</button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto p-2 sm:p-4 bg-surface-card">
          {viewMode === "individual" && currentStaff ? (
            <IndividualCalendarView staff={currentStaff} shifts={shifts} currentMonth={currentMonth} onViewShift={handleViewShift} closingDays={closingDays} viewPeriod={viewPeriod} />
          ) : (
            <GroupCalendarView 
              staffMembers={filteredStaffMembers} shifts={shifts} currentMonth={currentMonth} 
              onEditShift={handleEditShift} onAddShift={handleAddShift} closingDays={closingDays} viewPeriod={viewPeriod} 
              isMultiSelectMode={isMultiSelectMode} selectedDates={selectedDates} selectionStart={selectionStart} 
              selectionStaffId={selectionStaffId} onCellClick={handleCellClick} onCellHover={handleCellHover}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border bg-surface-card px-4 sm:px-6 py-2 sm:py-3 overflow-x-auto">
          <div className="flex items-center gap-4 sm:gap-6 h-5 sm:h-6 min-w-max">
            <span className="text-content-faint uppercase tracking-wider text-[10px] sm:text-xs flex-shrink-0">LEGEND:</span>
            {viewMode === "team" ? (
              <div className="flex items-center gap-3 sm:gap-6">
                {filteredStaffMembers.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"><div className="w-3 sm:w-4 h-2 sm:h-3 rounded" style={{ backgroundColor: s.color || "var(--color-secondary)" }} /><span className="text-content-muted text-[10px] sm:text-xs">{s.firstName}</span></div>
                ))}
                {filteredStaffMembers.length > 4 && <span className="text-content-faint text-[10px] sm:text-xs hidden sm:inline">+{filteredStaffMembers.length - 4}</span>}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"><div className="w-4 sm:w-5 h-2 sm:h-3 rounded" style={{ backgroundColor: currentStaff?.color || "var(--color-secondary)" }} /><span className="text-content-muted text-[10px] sm:text-xs">Scheduled</span></div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"><div className="w-4 sm:w-5 h-2 sm:h-3 rounded hatched-absence border border-red-500/30" /><span className="text-content-muted text-[10px] sm:text-xs">Absence</span></div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 hidden sm:flex"><div className="w-5 h-3 rounded hatched-closing" /><span className="text-content-muted text-xs">Closing Days</span></div>
          </div>
        </div>

        {/* Floating Action Button - Mobile Only */}
        {viewMode === "team" && (
          <button
            onClick={() => handleAddShift(null)}
            className="sm:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-[1001]"
            aria-label="Add New Shift"
          >
            <Plus size={22} />
          </button>
        )}
      </div>

      <ShiftFormModal 
        isOpen={isFormModalOpen} onClose={closeModal} shift={editingShift} staffMembers={staffMembers} 
        onSave={handleSaveShift} onDelete={(id) => setShifts(prev => prev.filter(s => s.id !== id))} 
        fixedStaffId={modalFixedStaffId} initialStartDate={modalInitialStartDate} initialEndDate={modalInitialEndDate}
        readOnly={isReadOnlyModal} closingDays={closingDays}
      />
    </div>
  )
}

export default ShiftsOverviewModal
