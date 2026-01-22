/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Check,
  Clock,
  Trash2,
  Maximize2,
  Minimize2,
  Users,
  User,
  Sun,
  MousePointer2
} from "lucide-react"
import toast from "react-hot-toast"

// Helper to format date
const formatDateStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Helper to parse date string
const parseDate = (dateStr) => new Date(dateStr + "T00:00:00")

// Calculate business days between dates (excluding weekends and closing days)
const getBusinessDays = (startDate, endDate, closingDays = []) => {
  let count = 0
  const current = new Date(startDate)
  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    const dateStr = formatDateStr(current)
    // Skip weekends and closing days
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !closingDays.includes(dateStr)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  return count
}

// Check if date is weekend
const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// Get day name abbreviation
const getDayName = (date) => {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  return days[date.getDay()]
}

// Initials Avatar Component - Blue background like staff.jsx
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
    xl: "w-16 h-16 text-xl",
  }

  // If staff has profile image, show it
  if (img) {
    return (
      <img 
        src={img} 
        alt={`${firstName} ${lastName}`}
        className={`rounded-xl flex-shrink-0 object-cover ${sizeClasses[size]}`}
      />
    )
  }

  // Otherwise show blue initials avatar (consistent with staff.jsx)
  return (
    <div 
      className={`bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}
    >
      {getInitials()}
    </div>
  )
}

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: Clock, label: "Pending" },
    approved: { bg: "bg-orange-500/20", text: "text-orange-400", icon: Check, label: "Approved" }
  }

  const { bg, text, icon: Icon, label } = config[status] || config.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={12} />
      {label}
    </span>
  )
}

// CSS for hatched/striped patterns
const HatchedStyles = () => (
  <style>{`
    .hatched-pending {
      background: repeating-linear-gradient(
        45deg,
        rgba(234, 179, 8, 0.3),
        rgba(234, 179, 8, 0.3) 3px,
        rgba(234, 179, 8, 0.6) 3px,
        rgba(234, 179, 8, 0.6) 6px
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
    .vacation-calendar-content {
      contain: layout style paint;
      will-change: contents;
    }
    .vacation-modal-wrapper {
      isolation: isolate;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .vacation-modal-wrapper * {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  `}</style>
)

// Vacation Bar Component for Timeline (Team View)
const VacationBar = ({ vacation, staff, startOfMonth, daysInMonth, onEdit, isFullscreen }) => {
  const vacationStart = parseDate(vacation.startDate)
  const vacationEnd = parseDate(vacation.endDate)
  const monthStart = new Date(startOfMonth)
  const monthEnd = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0)

  // Calculate visible portion
  const visibleStart = vacationStart < monthStart ? monthStart : vacationStart
  const visibleEnd = vacationEnd > monthEnd ? monthEnd : vacationEnd

  const startDay = visibleStart.getDate()
  const endDay = visibleEnd.getDate()

  const leftPercent = ((startDay - 1) / daysInMonth) * 100
  const widthPercent = ((endDay - startDay + 1) / daysInMonth) * 100

  const isPending = vacation.status === "pending"
  // Use staff identification color for approved vacations
  const staffColor = staff.color || "#3F74FF"

  return (
    <div
      className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:z-10 hover:shadow-lg hover:scale-[1.02] ${
        isPending ? "hatched-pending border border-yellow-500/50" : ""
      }`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        minWidth: "8px",
        backgroundColor: isPending ? undefined : staffColor
      }}
      onClick={() => onEdit(vacation)}
      title={`${staff.firstName} ${staff.lastName}: ${vacation.startDate} - ${vacation.endDate}${vacation.reason ? ` - ${vacation.reason}` : ""} (${vacation.status})`}
    >
      {widthPercent > 10 && (
        <div className="px-2 h-full flex items-center overflow-hidden">
          <span className={`${isPending ? "text-yellow-300" : "text-white"} ${isFullscreen ? "text-sm" : "text-[11px]"} font-medium truncate`}>
            {vacation.reason || "Vacation"}
          </span>
        </div>
      )}
    </div>
  )
}

// Individual Calendar View - Year table with months as rows
const IndividualCalendarView = ({ 
  staff, 
  vacations, 
  currentYear, 
  closingDays,
  onEditVacation,
  onCreateVacation,
  isFullscreen,
  isMultiSelectMode,
  setIsMultiSelectMode,
  selectedDates,
  setSelectedDates,
  selectionStart,
  setSelectionStart
}) => {
  const staffVacations = vacations.filter(v => v.staffId === staff.id)
  // Staff identification color for approved vacations
  const staffColor = staff.color || "#3F74FF"

  // Get vacation for a specific date
  const getVacationForDate = (dateStr) => {
    return staffVacations.find(v => dateStr >= v.startDate && dateStr <= v.endDate)
  }

  // Check if date is a closing day (includes weekends)
  const isClosingDay = (date) => {
    const dateStr = formatDateStr(date)
    return isWeekend(date) || closingDays.includes(dateStr)
  }

  // Handle cell click
  const handleCellClick = (date) => {
    if (isClosingDay(date)) return // Can't select closing days

    const dateStr = formatDateStr(date)
    const existingVacation = getVacationForDate(dateStr)

    if (existingVacation) {
      onEditVacation(existingVacation)
      return
    }

    if (isMultiSelectMode) {
      if (!selectionStart) {
        setSelectionStart(dateStr)
        setSelectedDates([dateStr])
      } else {
        // Create vacation from selection
        const startDate = selectionStart < dateStr ? selectionStart : dateStr
        const endDate = selectionStart < dateStr ? dateStr : selectionStart
        onCreateVacation(startDate, endDate)
        setSelectionStart(null)
        setSelectedDates([])
      }
    } else {
      // Single day selection
      onCreateVacation(dateStr, dateStr)
    }
  }

  // Handle mouse enter for selection preview
  const handleCellHover = (date) => {
    if (!isMultiSelectMode || !selectionStart || isClosingDay(date)) return
    
    const dateStr = formatDateStr(date)
    const startDate = selectionStart < dateStr ? selectionStart : dateStr
    const endDate = selectionStart < dateStr ? dateStr : selectionStart
    
    // Build selection range
    const range = []
    const current = parseDate(startDate)
    const end = parseDate(endDate)
    while (current <= end) {
      if (!isClosingDay(current)) {
        range.push(formatDateStr(current))
      }
      current.setDate(current.getDate() + 1)
    }
    setSelectedDates(range)
  }

  // Sizes based on fullscreen - responsive for mobile
  const cellSize = isFullscreen ? "min-w-[52px] h-[52px]" : "min-w-[28px] h-[28px] sm:min-w-[36px] sm:h-[36px] md:min-w-[40px] md:h-[40px]"
  const dayNumSize = isFullscreen ? "text-base" : "text-[9px] sm:text-xs md:text-sm"
  const dayNameSize = isFullscreen ? "text-xs" : "text-[7px] sm:text-[9px] md:text-[10px]"
  const monthLabelWidth = isFullscreen ? "w-28" : "w-12 sm:w-16 md:w-20"
  const monthLabelSize = isFullscreen ? "text-lg" : "text-[10px] sm:text-xs md:text-sm"

  return (
    <div className="flex flex-col h-full">
      {/* Year Calendar Table - Now takes full height */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const monthStart = new Date(currentYear, monthIndex, 1)
            const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
            const monthName = monthStart.toLocaleDateString("en-US", { month: "short" })

            return (
              <div key={monthIndex} className="flex border-b border-gray-800 last:border-b-0">
                {/* Month label */}
                <div className={`${monthLabelWidth} flex-shrink-0 flex items-center justify-center bg-gray-800/50 border-r border-gray-800`}>
                  <span className={`text-white font-semibold ${monthLabelSize}`}>
                    {monthName}
                  </span>
                </div>

                {/* Days */}
                <div className="flex-1 flex overflow-x-auto">
                  {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                    const date = new Date(currentYear, monthIndex, dayIndex + 1)
                    const dateStr = formatDateStr(date)
                    const dayName = getDayName(date)
                    const isClosing = isClosingDay(date)
                    const vacation = getVacationForDate(dateStr)
                    const isSelected = selectedDates.includes(dateStr)
                    const isSelectionStart = selectionStart === dateStr

                    let cellClass = `${cellSize} border-r border-gray-800/30 last:border-r-0 flex flex-col items-center justify-center transition-all `
                    let cellStyle = {}
                    
                    if (isClosing) {
                      cellClass += "hatched-closing cursor-not-allowed"
                    } else if (vacation) {
                      if (vacation.status === "pending") {
                        cellClass += "hatched-pending cursor-pointer"
                      } else {
                        // Approved - use staff identification color
                        cellClass += "cursor-pointer"
                        cellStyle.backgroundColor = staffColor
                      }
                    } else if (isSelectionStart) {
                      cellClass += "cursor-pointer"
                      cellStyle.backgroundColor = staffColor
                    } else if (isSelected) {
                      cellClass += "cursor-pointer"
                      cellStyle.backgroundColor = staffColor
                      cellStyle.opacity = 0.5
                    } else {
                      cellClass += "hover:bg-gray-800 cursor-pointer"
                    }

                    const textColor = isClosing 
                      ? "text-gray-600" 
                      : (vacation || isSelected || isSelectionStart) 
                        ? "text-white" 
                        : "text-gray-400"

                    return (
                      <div
                        key={dayIndex}
                        className={cellClass}
                        style={cellStyle}
                        onClick={() => handleCellClick(date)}
                        onMouseEnter={() => handleCellHover(date)}
                        title={isClosing ? "Closing Day" : (vacation ? `${vacation.reason || "Vacation"} (${vacation.status})` : "Click to book")}
                      >
                        <span className={`${dayNameSize} ${textColor} leading-none`}>
                          {dayName}
                        </span>
                        <span className={`${dayNumSize} font-medium ${textColor} leading-none mt-0.5`}>
                          {dayIndex + 1}
                        </span>
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

// Group Calendar View - Shows all staff members
const GroupCalendarView = ({ 
  staffMembers, 
  vacations, 
  currentYear,
  closingDays,
  onEditVacation,
  onAddVacation,
  isFullscreen
}) => {
  // Responsive sizes
  const cellHeight = isFullscreen ? "h-[52px]" : "h-[40px] sm:h-[44px]"
  const dayNumSize = isFullscreen ? "text-base" : "text-[10px] sm:text-sm"
  const dayNameSize = isFullscreen ? "text-xs" : "text-[8px] sm:text-[10px]"
  const staffWidth = isFullscreen ? "w-[240px]" : "w-[100px] sm:w-[160px] md:w-[200px]"
  const staffNameSize = isFullscreen ? "text-sm" : "text-[10px] sm:text-xs md:text-sm"
  const cellWidth = isFullscreen ? "w-[44px] min-w-[44px]" : "w-[24px] min-w-[24px] sm:w-[30px] sm:min-w-[30px] md:w-[36px] md:min-w-[36px]"

  // Check if date is a closing day
  const isClosingDay = (date) => {
    const dateStr = formatDateStr(date)
    return isWeekend(date) || closingDays.includes(dateStr)
  }

  // Get vacation segments (split by closing days)
  const getVacationSegments = (vacation, monthIndex) => {
    const segments = []
    const monthStart = new Date(currentYear, monthIndex, 1)
    const monthEnd = new Date(currentYear, monthIndex + 1, 0)
    const vacStart = parseDate(vacation.startDate)
    const vacEnd = parseDate(vacation.endDate)
    
    // Clamp to month
    const visibleStart = vacStart < monthStart ? monthStart : vacStart
    const visibleEnd = vacEnd > monthEnd ? monthEnd : vacEnd
    
    let segmentStart = null
    const current = new Date(visibleStart)
    
    while (current <= visibleEnd) {
      const closing = isClosingDay(current)
      
      if (!closing) {
        if (!segmentStart) {
          segmentStart = new Date(current)
        }
      } else {
        if (segmentStart) {
          // End current segment
          const prevDay = new Date(current)
          prevDay.setDate(prevDay.getDate() - 1)
          segments.push({
            start: segmentStart.getDate(),
            end: prevDay.getDate()
          })
          segmentStart = null
        }
      }
      current.setDate(current.getDate() + 1)
    }
    
    // Close last segment
    if (segmentStart) {
      segments.push({
        start: segmentStart.getDate(),
        end: visibleEnd.getDate()
      })
    }
    
    // Mark first segment
    if (segments.length > 0) {
      segments[0].isFirst = true
    }
    
    return segments
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: 12 }, (_, monthIndex) => {
        const monthStart = new Date(currentYear, monthIndex, 1)
        const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
        const monthVacations = vacations.filter(v => {
          const start = parseDate(v.startDate)
          const end = parseDate(v.endDate)
          const monthEnd = new Date(currentYear, monthIndex + 1, 0)
          return start <= monthEnd && end >= monthStart
        })

        // Skip months without vacations but keep structure stable
        if (monthVacations.length === 0) {
          return <div key={monthIndex} className="hidden" />
        }

        return (
          <div key={monthIndex} className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-2 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h3 className={`font-semibold text-white text-xs sm:text-sm ${isFullscreen ? "sm:text-lg" : ""}`}>
                {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <button
                onClick={() => onAddVacation(monthStart)}
                className={`text-orange-400 hover:text-orange-300 flex items-center gap-1 text-xs sm:text-sm ${isFullscreen ? "sm:text-base" : ""}`}
              >
                <Plus size={isFullscreen ? 18 : 14} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Day headers with day name and number */}
            <div 
              className={`flex border-b border-gray-800/50 overflow-x-auto`} 
              style={{ marginLeft: isFullscreen ? '240px' : 'var(--staff-width, 100px)' }}
            >
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(currentYear, monthIndex, i + 1)
                const dayName = getDayName(date)
                const isClosing = isWeekend(date) || closingDays.includes(formatDateStr(date))
                
                return (
                  <div 
                    key={i}
                    className={`${cellWidth} text-center py-1 sm:py-2 border-l border-gray-800/30 first:border-l-0 flex flex-col justify-center flex-shrink-0 ${
                      isClosing ? "hatched-closing" : ""
                    }`}
                  >
                    <span className={`${dayNameSize} ${isClosing ? "text-gray-600" : "text-gray-500"} leading-none`}>
                      {dayName}
                    </span>
                    <span className={`${dayNumSize} ${isClosing ? "text-gray-600" : "text-gray-400"} font-medium leading-none mt-0.5 sm:mt-1`}>
                      {i + 1}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Staff rows */}
            {staffMembers.map(staff => {
              const staffVacations = monthVacations.filter(v => v.staffId === staff.id)
              if (staffVacations.length === 0) return null
              
              return (
                <div key={staff.id} className={`flex items-stretch border-b border-gray-800/30 last:border-b-0 ${cellHeight}`}>
                  {/* Staff info */}
                  <div className={`${staffWidth} flex-shrink-0 flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 border-r border-gray-800/50`}>
                    <InitialsAvatar 
                      firstName={staff.firstName}
                      lastName={staff.lastName}
                      img={staff.img}
                      size={isFullscreen ? "sm" : "sm"}
                    />
                    <span className={`${staffNameSize} text-gray-300 truncate`}>
                      {staff.firstName} {staff.lastName}
                    </span>
                  </div>

                  {/* Timeline with cells */}
                  <div className="flex relative">
                    {/* Background cells for closing days */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const date = new Date(currentYear, monthIndex, i + 1)
                      const closing = isClosingDay(date)
                      return (
                        <div 
                          key={i}
                          className={`${cellWidth} flex-shrink-0 ${closing ? "hatched-closing" : ""}`}
                        />
                      )
                    })}
                    
                    {/* Vacation segments */}
                    {staffVacations.map(vacation => {
                      const segments = getVacationSegments(vacation, monthIndex)
                      return segments.map((segment, segIdx) => {
                        const leftPos = (segment.start - 1) * (isFullscreen ? 44 : 36)
                        const width = (segment.end - segment.start + 1) * (isFullscreen ? 44 : 36) - 4
                        
                        return (
                          <div
                            key={`${vacation.id}-${segIdx}`}
                            className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:z-10 hover:brightness-110 flex items-center overflow-hidden ${
                              vacation.status === "pending" 
                                ? "hatched-pending border border-yellow-500/50" 
                                : ""
                            }`}
                            style={{
                              left: `${leftPos + 2}px`,
                              width: `${width}px`,
                              backgroundColor: vacation.status === "pending" ? undefined : (staff.color || "#3F74FF")
                            }}
                            onClick={() => onEditVacation(vacation)}
                            title={`${staff.firstName} ${staff.lastName}: ${vacation.startDate} - ${vacation.endDate}${vacation.reason ? ` - ${vacation.reason}` : ""} (${vacation.status})`}
                          >
                            {segment.isFirst && width > 60 && (
                              <span className={`px-2 text-white text-xs font-medium truncate ${vacation.status === "pending" ? "text-yellow-300" : ""}`}>
                                {vacation.reason || "Vacation"}
                              </span>
                            )}
                          </div>
                        )
                      })
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Show message if no vacations for this year */}
      {(() => {
        const yearVacations = vacations.filter(v => {
          const start = parseDate(v.startDate)
          const end = parseDate(v.endDate)
          const yearStart = new Date(currentYear, 0, 1)
          const yearEnd = new Date(currentYear, 11, 31)
          return start <= yearEnd && end >= yearStart
        })
        
        if (yearVacations.length === 0) {
          return (
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-12 text-center">
              <Sun size={isFullscreen ? 64 : 48} className="mx-auto mb-4 text-gray-600" />
              <p className={`text-gray-500 ${isFullscreen ? "text-lg" : "text-base"}`}>No vacations scheduled for {currentYear}</p>
              <button
                onClick={() => onAddVacation(new Date(currentYear, 0, 1))}
                className={`mt-4 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl ${isFullscreen ? "text-base" : "text-sm"}`}
              >
                Create Vacation
              </button>
            </div>
          )
        }
        return null
      })()}
    </div>
  )
}

// Request Form Modal
const VacationRequestModal = ({ 
  isOpen, 
  onClose, 
  vacation, 
  staffMembers, 
  onSave, 
  onDelete,
  onApprove,
  fixedStaffId,
  initialStartDate,
  initialEndDate,
  closingDays = []
}) => {
  const [formData, setFormData] = useState({
    staffId: vacation?.staffId || fixedStaffId || "",
    startDate: vacation?.startDate || initialStartDate || "",
    endDate: vacation?.endDate || initialEndDate || "",
    reason: vacation?.reason || "",
    status: vacation?.status || "pending"
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (vacation) {
      setFormData({
        staffId: vacation.staffId || fixedStaffId || "",
        startDate: vacation.startDate || initialStartDate || "",
        endDate: vacation.endDate || initialEndDate || "",
        reason: vacation.reason || "",
        status: vacation.status || "pending"
      })
    } else {
      setFormData({
        staffId: fixedStaffId || "",
        startDate: initialStartDate || "",
        endDate: initialEndDate || "",
        reason: "",
        status: "pending"
      })
    }
  }, [vacation, fixedStaffId, initialStartDate, initialEndDate])

  if (!isOpen) return null

  const selectedStaff = staffMembers.find(s => s.id === Number(formData.staffId))
  const isFixedStaff = !!fixedStaffId
  
  const businessDays = formData.startDate && formData.endDate 
    ? getBusinessDays(parseDate(formData.startDate), parseDate(formData.endDate), closingDays)
    : 0

  const handleSave = () => {
    if (!formData.staffId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all required fields")
      return
    }

    const vacationData = {
      id: vacation?.id || `vacation-${Date.now()}`,
      ...formData,
      staffId: Number(formData.staffId),
      // If creating new (not editing) and not in individual/fixed staff mode, set as approved directly
      status: vacation ? formData.status : (isFixedStaff ? "pending" : "approved")
    }

    onSave(vacationData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[1001] p-0 sm:p-4">
      <div className="bg-[#1a1a1a] w-full h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl sm:max-w-md border-t sm:border border-gray-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg sm:rounded-xl">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {vacation ? "Edit Vacation" : "Request Vacation"}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-400 sm:hidden" />
              <X size={20} className="text-gray-400 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Staff Selection - Only show dropdown in team view (when not fixed) */}
          {!isFixedStaff && (
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Staff Member *</label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="w-full bg-[#141414] border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="">Select staff...</option>
                {staffMembers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Staff Info */}
          {selectedStaff && (
            <div className="bg-[#141414] rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <InitialsAvatar 
                firstName={selectedStaff.firstName}
                lastName={selectedStaff.lastName}
                img={selectedStaff.img}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm sm:text-base truncate">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{selectedStaff.role}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p 
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: selectedStaff.color || "#3F74FF" }}
                >
                  {selectedStaff.vacationDays || 30}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">days left</p>
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#141414] border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full bg-[#141414] border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Duration Display */}
          {businessDays > 0 && selectedStaff && (
            <div 
              className="rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between"
              style={{ 
                backgroundColor: `${selectedStaff.color || "#3F74FF"}15`,
                borderWidth: 1,
                borderColor: `${selectedStaff.color || "#3F74FF"}30`
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar size={16} className="sm:hidden" style={{ color: selectedStaff.color || "#3F74FF" }} />
                <Calendar size={20} className="hidden sm:block" style={{ color: selectedStaff.color || "#3F74FF" }} />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{businessDays} business days</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Excluding Closing Days</p>
                </div>
              </div>
              <div className="text-right">
                <p 
                  className="font-semibold text-sm sm:text-base"
                  style={{ 
                    color: (selectedStaff.vacationDays || 30) - businessDays >= 0 
                      ? (selectedStaff.color || "#3F74FF")
                      : "#f87171" 
                  }}
                >
                  {(selectedStaff.vacationDays || 30) - businessDays} days
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">remaining after</p>
              </div>
            </div>
          )}
          {businessDays > 0 && !selectedStaff && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <Calendar size={16} className="text-gray-400 sm:hidden" />
              <Calendar size={20} className="text-gray-400 hidden sm:block" />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{businessDays} business days</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Excluding Closing Days</p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Reason (optional)</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Family vacation, Personal time..."
              className="w-full bg-[#141414] border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Current Status (for editing) */}
          {vacation && (
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Status</label>
              <div className="flex items-center gap-2">
                <StatusBadge status={formData.status} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-800">
          {/* Action buttons for existing vacation */}
          {vacation && (
            <div className="flex gap-2 mb-3 sm:mb-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <Trash2 size={14} className="sm:hidden" />
                <Trash2 size={16} className="hidden sm:block" />
                Delete
              </button>
              
              {vacation.status === "pending" && (
                <button
                  onClick={() => {
                    onApprove(vacation.id)
                    onClose()
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-orange-400 hover:bg-orange-500/10 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                >
                  <Check size={14} className="sm:hidden" />
                  <Check size={16} className="hidden sm:block" />
                  Approve
                </button>
              )}
            </div>
          )}
          
          {/* Main action buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base"
            >
              {vacation ? "Save Changes" : "Submit Request"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1002] p-4">
          <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Delete Vacation</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
              Are you sure you want to delete this vacation? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 text-white rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(vacation.id)
                  setShowDeleteConfirm(false)
                  onClose()
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Component
function VacationCalendarModal({ 
  onClose, 
  staffMembers = [],
  currentStaffId = null, // The logged-in staff member's ID for individual view
  onSubmitRequest,
  isEmbedded = false,
  isStaffPlanning = false 
}) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [vacations, setVacations] = useState([])
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [editingVacation, setEditingVacation] = useState(null)
  const [viewMode, setViewMode] = useState("team") // "team" | "individual"
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modalStartDate, setModalStartDate] = useState("")
  const [modalEndDate, setModalEndDate] = useState("")
  const [staffFilter, setStaffFilter] = useState("all") // "all" or staff id
  
  // Multi-select state for individual calendar view
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [selectedDates, setSelectedDates] = useState([])
  const [selectionStart, setSelectionStart] = useState(null)

  // Cancel selection helper
  const cancelSelection = () => {
    setSelectionStart(null)
    setSelectedDates([])
  }

  // Current staff for individual view (simulated as first staff member if not provided)
  const currentStaff = currentStaffId 
    ? staffMembers.find(s => s.id === currentStaffId)
    : staffMembers[0]

  // Public holidays / closing days (weekends are handled separately)
  // Pre-calculate for a range of years to prevent flicker on year change
  const closingDays = useMemo(() => {
    const days = []
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
      days.push(`${year}-01-01`) // New Year
      days.push(`${year}-12-25`) // Christmas
      days.push(`${year}-12-26`) // Boxing Day
    }
    return days
  }, [currentYear])

  // Filter staff members based on selection
  const filteredStaffMembers = useMemo(() => {
    if (staffFilter === "all") return staffMembers
    return staffMembers.filter(s => s.id === Number(staffFilter))
  }, [staffMembers, staffFilter])

  // Generate sample vacations (once on mount, spanning multiple years)
  const initialVacations = useMemo(() => {
    const sampleVacations = []
    const baseYear = new Date().getFullYear()
    
    staffMembers.forEach((staff, index) => {
      // Past approved vacation (current year)
      sampleVacations.push({
        id: `vacation-${staff.id}-1`,
        staffId: staff.id,
        startDate: `${baseYear}-02-${String(10 + index).padStart(2, "0")}`,
        endDate: `${baseYear}-02-${String(14 + index).padStart(2, "0")}`,
        reason: "Winter break",
        status: "approved",
        requestDate: `${baseYear}-01-15`,
        approvedBy: "Manager"
      })

      // Upcoming pending vacation (current year)
      if (index % 2 === 0) {
        sampleVacations.push({
          id: `vacation-${staff.id}-2`,
          staffId: staff.id,
          startDate: `${baseYear}-07-${String(15 + index).padStart(2, "0")}`,
          endDate: `${baseYear}-07-${String(25 + index).padStart(2, "0")}`,
          reason: "Summer vacation",
          status: "pending",
          requestDate: `${baseYear}-06-01`
        })
      }

      // Next year vacation
      sampleVacations.push({
        id: `vacation-${staff.id}-3`,
        staffId: staff.id,
        startDate: `${baseYear + 1}-03-${String(5 + index).padStart(2, "0")}`,
        endDate: `${baseYear + 1}-03-${String(12 + index).padStart(2, "0")}`,
        reason: "Spring break",
        status: "approved",
        requestDate: `${baseYear}-12-01`,
        approvedBy: "Manager"
      })
    })

    return sampleVacations
  }, [staffMembers])

  // Initialize vacations state with sample data
  useEffect(() => {
    if (vacations.length === 0) {
      setVacations(initialVacations)
    }
  }, [initialVacations, vacations.length])

  // Handlers
  const handleSaveVacation = (vacationData) => {
    setVacations(prev => {
      const existing = prev.findIndex(v => v.id === vacationData.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], ...vacationData }
        return updated
      }
      return [...prev, { ...vacationData, requestDate: formatDateStr(new Date()) }]
    })
    toast.success(editingVacation ? "Vacation updated" : "Vacation request submitted")
    setEditingVacation(null)
    setModalStartDate("")
    setModalEndDate("")
  }

  const handleDeleteVacation = (id) => {
    setVacations(prev => prev.filter(v => v.id !== id))
    toast.success("Vacation deleted")
  }

  const handleApprove = (id) => {
    setVacations(prev => prev.map(v => 
      v.id === id ? { ...v, status: "approved", approvedBy: "You" } : v
    ))
    toast.success("Vacation approved")
  }

  const handleEditVacation = (vacation) => {
    setEditingVacation(vacation)
    setModalStartDate("")
    setModalEndDate("")
    setIsRequestModalOpen(true)
  }

  const handleAddVacation = (date) => {
    setEditingVacation(null)
    setModalStartDate(date ? formatDateStr(date) : "")
    setModalEndDate(date ? formatDateStr(date) : "")
    setIsRequestModalOpen(true)
  }

  const handleCreateVacationFromSelection = (startDate, endDate) => {
    setEditingVacation(null)
    setModalStartDate(startDate)
    setModalEndDate(endDate)
    setIsRequestModalOpen(true)
  }

  const containerClass = isEmbedded 
    ? "w-full h-full"
    : isFullscreen 
      ? "fixed inset-0 z-[1000] bg-[#0f0f0f]"
      : "fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-0 sm:p-2"

  const modalClass = isEmbedded
    ? "w-full h-full flex flex-col"
    : isFullscreen
      ? "w-full h-full flex flex-col"
      : "bg-[#141414] w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-[1400px] sm:max-h-[95vh] flex flex-col sm:border border-gray-800 shadow-2xl overflow-hidden"

  return (
    <div className={`${containerClass} vacation-modal-wrapper`}>
      <HatchedStyles />
      <div className={modalClass}>
        {/* Header */}
        <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-gray-800 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`hidden sm:flex bg-orange-500/10 rounded-xl ${isFullscreen ? "p-3" : "p-2"}`}>
                <Sun className={`text-orange-400 ${isFullscreen ? "w-8 h-8" : "w-6 h-6"}`} />
              </div>
              <div>
                <h2 className={`font-semibold text-white ${isFullscreen ? "text-2xl" : "text-lg sm:text-xl"}`}>
                  Vacation Calendar
                </h2>
              </div>
            </div>

            {/* Staff info for individual view - hidden on mobile */}
            {viewMode === "individual" && currentStaff && (
              <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
                <div className="flex items-center gap-3 bg-[#141414] rounded-xl px-4 py-2">
                  <InitialsAvatar 
                    firstName={currentStaff.firstName}
                    lastName={currentStaff.lastName}
                    img={currentStaff.img}
                    size={isFullscreen ? "md" : "sm"}
                  />
                  <div>
                    <p className={`text-white font-medium ${isFullscreen ? "text-base" : "text-sm"}`}>
                      {currentStaff.firstName} {currentStaff.lastName}
                    </p>
                    <p className={`text-gray-500 ${isFullscreen ? "text-sm" : "text-xs"}`}>{currentStaff.role}</p>
                  </div>
                </div>

                {/* Days remaining */}
                <div className="flex items-center gap-2 bg-[#141414] rounded-xl px-4 py-2">
                  <p 
                    className={`font-bold ${isFullscreen ? "text-2xl" : "text-xl"}`}
                    style={{ color: currentStaff.color || "#3F74FF" }}
                  >
                    {currentStaff.vacationDays || 30}
                  </p>
                  <p className={`text-gray-500 ${isFullscreen ? "text-sm" : "text-xs"}`}>days<br/>remaining</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Fullscreen button - hidden on mobile */}
              {!isEmbedded && (
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`hidden sm:flex hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white ${isFullscreen ? "p-3" : "p-2"}`}
                >
                  {isFullscreen ? <Minimize2 size={isFullscreen ? 24 : 20} /> : <Maximize2 size={isFullscreen ? 24 : 20} />}
                </button>
              )}

              {!isEmbedded && (
                <button
                  onClick={onClose}
                  className={`hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white p-2 ${isFullscreen ? "sm:p-3" : ""}`}
                >
                  <X size={20} className="sm:hidden" />
                  <X size={isFullscreen ? 24 : 20} className="hidden sm:block" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-3 sm:gap-4">
            {/* Year navigation row */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <button
                onClick={() => setCurrentYear(y => y - 1)}
                className={`hover:bg-gray-800 rounded-lg transition-colors p-1.5 sm:p-2 ${isFullscreen ? "sm:p-3" : ""}`}
              >
                <ChevronLeft size={18} className="text-gray-400 sm:hidden" />
                <ChevronLeft size={isFullscreen ? 28 : 20} className="text-gray-400 hidden sm:block" />
              </button>
              <button
                onClick={() => setCurrentYear(new Date().getFullYear())}
                className={`font-semibold text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors min-w-[80px] sm:min-w-[100px] px-3 py-1.5 text-sm ${isFullscreen ? "sm:px-6 sm:py-3 sm:text-xl" : "sm:px-4 sm:py-2"}`}
              >
                {currentYear}
              </button>
              <button
                onClick={() => setCurrentYear(y => y + 1)}
                className={`hover:bg-gray-800 rounded-lg transition-colors p-1.5 sm:p-2 ${isFullscreen ? "sm:p-3" : ""}`}
              >
                <ChevronRight size={18} className="text-gray-400 sm:hidden" />
                <ChevronRight size={isFullscreen ? 28 : 20} className="text-gray-400 hidden sm:block" />
              </button>

              {/* Staff Filter - only in team view */}
              {viewMode === "team" && (
                <>
                  <div className="hidden sm:block w-px h-6 bg-gray-700 mx-2" />
                  <select
                    value={staffFilter}
                    onChange={(e) => setStaffFilter(e.target.value)}
                    className={`bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs px-2 py-1.5 sm:text-sm sm:px-3 sm:py-2 max-w-[120px] sm:max-w-none ${isFullscreen ? "sm:px-4 sm:py-2.5 sm:text-base" : ""}`}
                  >
                    <option value="all">All ({staffMembers.length})</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.firstName} {staff.lastName}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Multi-select toggle - only in individual view */}
              {viewMode === "individual" && currentStaff && (
                <>
                  <div className="hidden sm:block w-px h-6 bg-gray-700 mx-2" />
                  <button
                    onClick={() => {
                      setIsMultiSelectMode(!isMultiSelectMode)
                      cancelSelection()
                    }}
                    style={isMultiSelectMode ? { backgroundColor: currentStaff.color || "#3F74FF" } : undefined}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-[11px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} ${
                      isMultiSelectMode 
                        ? "text-white" 
                        : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <MousePointer2 size={12} className="sm:hidden" />
                    <MousePointer2 size={isFullscreen ? 16 : 14} className="hidden sm:block" />
                    <span className="hidden sm:inline">Multi-Select</span>
                    <span className="sm:hidden">Select</span>
                    {isMultiSelectMode ? " ON" : " OFF"}
                  </button>
                  {isMultiSelectMode && selectionStart && (
                    <button
                      onClick={cancelSelection}
                      className={`text-gray-400 hover:text-white text-[11px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""}`}
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>

            {/* View toggle and add button row */}
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              {/* Add Vacation Button - Next to Team tab */}
              {viewMode === "team" && (
                <button
                  onClick={() => handleAddVacation(null)}
                  className={`bg-orange-600 hover:bg-orange-700 text-white rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors px-3 py-1.5 text-xs sm:text-sm ${isFullscreen ? "sm:px-5 sm:py-2.5 sm:text-base" : "sm:px-4 sm:py-2"}`}
                >
                  <Plus size={14} className="sm:hidden" />
                  <Plus size={isFullscreen ? 18 : 14} className="hidden sm:block" />
                  <span>New Request</span>
                </button>
              )}

              {/* View Mode Toggle - Blue color */}
              <div className="flex bg-gray-800 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={() => setViewMode("team")}
                  className={`rounded-md transition-colors flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 text-xs sm:text-sm ${isFullscreen ? "sm:px-4 sm:py-2 sm:text-base" : "sm:px-3 sm:py-1.5"} ${
                    viewMode === "team" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Users size={12} className="sm:hidden" />
                  <Users size={isFullscreen ? 20 : 14} className="hidden sm:block" />
                  Team
                </button>
                <button
                  onClick={() => setViewMode("individual")}
                  className={`rounded-md transition-colors flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 text-xs sm:text-sm ${isFullscreen ? "sm:px-4 sm:py-2 sm:text-base" : "sm:px-3 sm:py-1.5"} ${
                    viewMode === "individual" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <User size={12} className="sm:hidden" />
                  <User size={isFullscreen ? 20 : 14} className="hidden sm:block" />
                  <span className="hidden sm:inline">My Calendar</span>
                  <span className="sm:hidden">My</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#141414] vacation-calendar-content">
          {viewMode === "individual" && currentStaff ? (
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar p-2 sm:p-4 bg-[#141414]">
              <IndividualCalendarView
                staff={currentStaff}
                vacations={vacations}
                currentYear={currentYear}
                closingDays={closingDays}
                onEditVacation={handleEditVacation}
                onCreateVacation={handleCreateVacationFromSelection}
                isFullscreen={isFullscreen}
                isMultiSelectMode={isMultiSelectMode}
                setIsMultiSelectMode={setIsMultiSelectMode}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                selectionStart={selectionStart}
                setSelectionStart={setSelectionStart}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar p-2 sm:p-4 bg-[#141414]">
              <GroupCalendarView
                staffMembers={filteredStaffMembers}
                vacations={vacations}
                currentYear={currentYear}
                closingDays={closingDays}
                onEditVacation={handleEditVacation}
                onAddVacation={handleAddVacation}
                isFullscreen={isFullscreen}
              />
            </div>
          )}
        </div>

        {/* Fixed Footer Legend */}
        <div className="flex-shrink-0 border-t border-gray-800 bg-[#1a1a1a] px-3 sm:px-6 py-2 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-4 h-5 sm:h-6 overflow-x-auto">
            {viewMode === "team" ? (
              // Team view: Staff colors legend + status indicators
              <>
                <span className={`text-gray-500 uppercase tracking-wider flex-shrink-0 leading-5 sm:leading-6 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""}`}>LEGEND:</span>
                
                {/* Staff list with horizontal scroll - hidden on small mobile */}
                <div className="hidden sm:flex flex-1 overflow-x-auto custom-scrollbar h-6">
                  <div className="flex items-center gap-4 h-6">
                    {filteredStaffMembers.map(staff => (
                      <div key={staff.id} className="flex items-center gap-2 flex-shrink-0 h-6">
                        <div 
                          className={`${isFullscreen ? "w-3 h-3" : "w-2.5 h-2.5"} rounded-full flex-shrink-0`}
                          style={{ backgroundColor: staff.color || "#3F74FF" }}
                        />
                        <span className={`text-gray-400 ${isFullscreen ? "text-sm" : "text-xs"} whitespace-nowrap leading-6`}>{staff.firstName}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden sm:block w-px h-4 bg-gray-700 flex-shrink-0" />
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 h-5 sm:h-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 h-5 sm:h-6">
                    <div className={`w-4 h-2.5 sm:w-5 sm:h-3 ${isFullscreen ? "sm:w-6 sm:h-4" : ""} rounded hatched-pending border border-yellow-500/50`} />
                    <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6`}>Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 h-5 sm:h-6">
                    <div className={`w-4 h-2.5 sm:w-5 sm:h-3 ${isFullscreen ? "sm:w-6 sm:h-4" : ""} rounded hatched-closing`} />
                    <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6 hidden sm:inline`}>Closing Days</span>
                    <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6 sm:hidden`}>Closed</span>
                  </div>
                </div>
              </>
            ) : (
              // Individual view: Status legend
              <>
                <span className={`text-gray-500 uppercase tracking-wider flex-shrink-0 leading-5 sm:leading-6 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""}`}>LEGEND:</span>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 h-5 sm:h-6">
                  <div 
                    className={`w-5 h-3 sm:w-6 sm:h-4 ${isFullscreen ? "sm:w-8 sm:h-5" : ""} rounded`}
                    style={{ backgroundColor: currentStaff?.color || "#3F74FF" }}
                  />
                  <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6`}>Approved</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 h-5 sm:h-6">
                  <div className={`w-5 h-3 sm:w-6 sm:h-4 ${isFullscreen ? "sm:w-8 sm:h-5" : ""} rounded hatched-pending border border-yellow-500/50`} />
                  <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6`}>Pending</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 h-5 sm:h-6">
                  <div className={`w-5 h-3 sm:w-6 sm:h-4 ${isFullscreen ? "sm:w-8 sm:h-5" : ""} rounded hatched-closing`} />
                  <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6 hidden sm:inline`}>Closing Days</span>
                  <span className={`text-gray-400 text-[10px] sm:text-xs ${isFullscreen ? "sm:text-sm" : ""} leading-5 sm:leading-6 sm:hidden`}>Closed</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <VacationRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false)
          setEditingVacation(null)
          setModalStartDate("")
          setModalEndDate("")
        }}
        vacation={editingVacation}
        staffMembers={staffMembers}
        onSave={handleSaveVacation}
        onDelete={handleDeleteVacation}
        onApprove={handleApprove}
        fixedStaffId={viewMode === "individual" ? String(currentStaff?.id) : null}
        initialStartDate={modalStartDate}
        initialEndDate={modalEndDate}
        closingDays={closingDays}
      />
    </div>
  )
}

export default VacationCalendarModal
