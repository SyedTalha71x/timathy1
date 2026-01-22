/* eslint-disable react/prop-types */
import { useState, useMemo, useRef, useEffect } from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Copy, 
  Calendar,
  Clock,
  Users,
  Download,
  Filter,
  Maximize2,
  Minimize2,
  LayoutGrid,
  List
} from "lucide-react"
import toast from "react-hot-toast"

// Helper to format date to YYYY-MM-DD
const formatDateStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Helper to parse time string to minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper to format minutes to time string
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, color, size = "sm" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  }

  return (
    <div 
      className={`rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}
      style={{ backgroundColor: color || "#3F74FF" }}
    >
      {getInitials()}
    </div>
  )
}

// Shift Block Component
const ShiftBlock = ({ shift, staff, onClick, onDelete, isCompact }) => {
  const startMinutes = timeToMinutes(shift.startTime)
  const endMinutes = timeToMinutes(shift.endTime)
  const duration = endMinutes - startMinutes
  
  // Calculate position (6:00 = 0%, 22:00 = 100%)
  const startPercent = ((startMinutes - 360) / (1320 - 360)) * 100
  const widthPercent = (duration / (1320 - 360)) * 100

  return (
    <div
      className="absolute top-1 bottom-1 rounded-lg cursor-pointer group transition-all hover:z-10 hover:shadow-lg"
      style={{
        left: `${Math.max(0, startPercent)}%`,
        width: `${Math.min(100 - startPercent, widthPercent)}%`,
        backgroundColor: staff.color || "#3F74FF",
        minWidth: "40px"
      }}
      onClick={onClick}
    >
      <div className="h-full px-2 flex items-center justify-between overflow-hidden">
        <span className="text-white text-xs font-medium truncate">
          {shift.startTime} - {shift.endTime}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded transition-opacity"
        >
          <Trash2 size={12} className="text-white" />
        </button>
      </div>
    </div>
  )
}

// Time Grid Header
const TimeGridHeader = () => {
  const hours = []
  for (let h = 6; h <= 22; h += 2) {
    hours.push(h)
  }

  return (
    <div className="flex border-b border-gray-700/50 ml-[200px]">
      {hours.map((hour) => (
        <div 
          key={hour} 
          className="flex-1 text-center text-xs text-gray-500 py-2 border-l border-gray-700/30 first:border-l-0"
        >
          {String(hour).padStart(2, "0")}:00
        </div>
      ))}
    </div>
  )
}

// Staff Row Component
const StaffRow = ({ 
  staff, 
  shifts, 
  date, 
  onAddShift, 
  onEditShift, 
  onDeleteShift,
  isSelected,
  onSelect
}) => {
  const rowRef = useRef(null)
  const dayShifts = shifts.filter(s => s.date === formatDateStr(date) && s.staffId === staff.id)

  const handleRowClick = (e) => {
    if (e.target === rowRef.current || e.target.classList.contains('time-grid')) {
      const rect = rowRef.current.getBoundingClientRect()
      const staffLabelWidth = 200
      const clickX = e.clientX - rect.left - staffLabelWidth
      const gridWidth = rect.width - staffLabelWidth
      
      if (clickX > 0) {
        const clickPercent = clickX / gridWidth
        const totalMinutes = 360 + (clickPercent * (1320 - 360)) // 6:00 to 22:00
        const roundedMinutes = Math.round(totalMinutes / 30) * 30
        const startTime = minutesToTime(roundedMinutes)
        const endMinutes = Math.min(roundedMinutes + 480, 1320) // 8 hours or until 22:00
        const endTime = minutesToTime(endMinutes)
        
        onAddShift(staff, formatDateStr(date), startTime, endTime)
      }
    }
  }

  return (
    <div 
      ref={rowRef}
      className={`flex items-stretch border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer group min-h-[48px] ${
        isSelected ? 'bg-gray-800/50' : ''
      }`}
      onClick={handleRowClick}
    >
      {/* Staff Info */}
      <div 
        className="w-[200px] flex-shrink-0 flex items-center gap-3 px-4 py-2 border-r border-gray-700/50 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          onSelect(staff)
        }}
      >
        <InitialsAvatar 
          firstName={staff.firstName} 
          lastName={staff.lastName} 
          color={staff.color}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium truncate">
            {staff.firstName} {staff.lastName}
          </p>
          <p className="text-gray-500 text-xs truncate">{staff.role}</p>
        </div>
      </div>

      {/* Time Grid */}
      <div className="flex-1 relative time-grid">
        {/* Grid lines */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 border-l border-gray-700/20 first:border-l-0"
            />
          ))}
        </div>

        {/* Shifts */}
        {dayShifts.map((shift) => (
          <ShiftBlock
            key={shift.id}
            shift={shift}
            staff={staff}
            onClick={(e) => {
              e.stopPropagation()
              onEditShift(shift)
            }}
            onDelete={() => onDeleteShift(shift.id)}
          />
        ))}

        {/* Add hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {dayShifts.length === 0 && (
            <span className="text-gray-600 text-xs flex items-center gap-1">
              <Plus size={12} /> Click to add shift
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Shift Form Modal
const ShiftFormModal = ({ 
  isOpen, 
  onClose, 
  shift, 
  staff, 
  date, 
  onSave, 
  onDelete,
  allStaff,
  shifts
}) => {
  const [formData, setFormData] = useState({
    staffId: shift?.staffId || staff?.id || "",
    date: shift?.date || formatDateStr(date) || "",
    startTime: shift?.startTime || "09:00",
    endTime: shift?.endTime || "17:00",
    note: shift?.note || ""
  })
  const [copyToStaff, setCopyToStaff] = useState([])
  const [copyToWeek, setCopyToWeek] = useState(false)

  useEffect(() => {
    if (shift) {
      setFormData({
        staffId: shift.staffId,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        note: shift.note || ""
      })
    } else if (staff && date) {
      setFormData(prev => ({
        ...prev,
        staffId: staff.id,
        date: formatDateStr(date)
      }))
    }
  }, [shift, staff, date])

  if (!isOpen) return null

  const selectedStaff = allStaff.find(s => s.id === formData.staffId)

  const handleSave = () => {
    const shiftData = {
      id: shift?.id || `shift-${Date.now()}`,
      ...formData,
      staffId: Number(formData.staffId)
    }

    onSave(shiftData, copyToStaff, copyToWeek)
    onClose()
  }

  const handleCopyToggle = (staffId) => {
    setCopyToStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {shift ? "Edit Shift" : "Add Shift"}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Staff Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Staff Member</label>
            <select
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              className="w-full bg-[#141414] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Select staff...</option>
              {allStaff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#141414] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-[#141414] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-[#141414] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Duration Display */}
          {formData.startTime && formData.endTime && (
            <div className="bg-[#141414] rounded-xl p-4 flex items-center gap-3">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-white text-sm font-medium">
                  {(() => {
                    const start = timeToMinutes(formData.startTime)
                    const end = timeToMinutes(formData.endTime)
                    const diff = end - start
                    const hours = Math.floor(diff / 60)
                    const mins = diff % 60
                    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
                  })()}
                </p>
                <p className="text-gray-500 text-xs">Duration</p>
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Note (optional)</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="e.g., Training, Meeting..."
              className="w-full bg-[#141414] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Copy Options */}
          {!shift && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-400">Copy to other staff</label>
              <div className="max-h-32 overflow-y-auto space-y-2 bg-[#141414] rounded-xl p-3">
                {allStaff.filter(s => s.id !== Number(formData.staffId)).map(s => (
                  <label 
                    key={s.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={copyToStaff.includes(s.id)}
                      onChange={() => handleCopyToggle(s.id)}
                      className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700"
                    />
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-sm text-gray-300">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <label className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={copyToWeek}
                  onChange={(e) => setCopyToWeek(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700"
                />
                <div>
                  <span className="text-sm text-gray-300">Copy to entire week</span>
                  <p className="text-xs text-gray-500">Repeat this shift Mon-Fri</p>
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          {shift && (
            <button
              onClick={() => {
                onDelete(shift.id)
                onClose()
              }}
              className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            {shift ? "Save Changes" : "Add Shift"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Component
function StaffPlanningModal({ staffMembers, onClose }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })
  
  const [viewMode, setViewMode] = useState("week") // "week" | "day" | "month"
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [shifts, setShifts] = useState([])
  const [isShiftFormOpen, setIsShiftFormOpen] = useState(false)
  const [editingShift, setEditingShift] = useState(null)
  const [selectedStaffForForm, setSelectedStaffForForm] = useState(null)
  const [selectedDateForForm, setSelectedDateForForm] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [filterRole, setFilterRole] = useState("all")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Generate sample shifts on mount
  useEffect(() => {
    const sampleShifts = []
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1)

    staffMembers.forEach((staff, index) => {
      // Add some shifts for each staff member
      for (let i = 0; i < 5; i++) {
        const shiftDate = new Date(weekStart)
        shiftDate.setDate(weekStart.getDate() + i)
        
        // Vary the shift times based on staff index
        const startHour = 7 + (index % 4) * 2
        const endHour = startHour + 8

        sampleShifts.push({
          id: `shift-${staff.id}-${i}`,
          staffId: staff.id,
          date: formatDateStr(shiftDate),
          startTime: `${String(startHour).padStart(2, "0")}:00`,
          endTime: `${String(endHour).padStart(2, "0")}:00`,
          note: ""
        })
      }
    })

    setShifts(sampleShifts)
  }, [staffMembers])

  // Get days for current week
  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [currentWeekStart])

  // Filter staff
  const filteredStaff = useMemo(() => {
    if (filterRole === "all") return staffMembers
    return staffMembers.filter(s => s.role === filterRole)
  }, [staffMembers, filterRole])

  // Get unique roles
  const roles = useMemo(() => {
    return [...new Set(staffMembers.map(s => s.role))]
  }, [staffMembers])

  // Navigation
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const goToToday = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    setCurrentWeekStart(new Date(today.setDate(diff)))
    setSelectedDay(new Date())
  }

  // Shift handlers
  const handleAddShift = (staff, date, startTime, endTime) => {
    setSelectedStaffForForm(staff)
    setSelectedDateForForm(new Date(date + "T00:00:00"))
    setEditingShift({
      staffId: staff.id,
      date,
      startTime,
      endTime,
      note: ""
    })
    setIsShiftFormOpen(true)
  }

  const handleEditShift = (shift) => {
    setEditingShift(shift)
    setSelectedStaffForForm(staffMembers.find(s => s.id === shift.staffId))
    setSelectedDateForForm(new Date(shift.date + "T00:00:00"))
    setIsShiftFormOpen(true)
  }

  const handleDeleteShift = (shiftId) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId))
    toast.success("Shift deleted")
  }

  const handleSaveShift = (shiftData, copyToStaff, copyToWeek) => {
    const newShifts = []
    
    // Main shift
    newShifts.push(shiftData)

    // Copy to other staff
    if (copyToStaff.length > 0) {
      copyToStaff.forEach(staffId => {
        newShifts.push({
          ...shiftData,
          id: `shift-${staffId}-${Date.now()}-${Math.random()}`,
          staffId
        })
      })
    }

    // Copy to week
    if (copyToWeek) {
      const baseDate = new Date(shiftData.date + "T00:00:00")
      const dayOfWeek = baseDate.getDay()
      const monday = new Date(baseDate)
      monday.setDate(baseDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

      for (let i = 0; i < 5; i++) {
        const weekDay = new Date(monday)
        weekDay.setDate(monday.getDate() + i)
        const weekDayStr = formatDateStr(weekDay)
        
        if (weekDayStr !== shiftData.date) {
          const allStaffIds = [shiftData.staffId, ...copyToStaff]
          allStaffIds.forEach(staffId => {
            newShifts.push({
              ...shiftData,
              id: `shift-${staffId}-${weekDayStr}-${Date.now()}-${Math.random()}`,
              staffId,
              date: weekDayStr
            })
          })
        }
      }
    }

    // Update shifts - replace existing or add new
    setShifts(prev => {
      const updated = prev.filter(s => s.id !== shiftData.id)
      return [...updated, ...newShifts]
    })

    toast.success(editingShift?.id ? "Shift updated" : `${newShifts.length} shift(s) added`)
    setEditingShift(null)
  }

  // Stats
  const stats = useMemo(() => {
    const weekShifts = shifts.filter(s => {
      const shiftDate = new Date(s.date + "T00:00:00")
      return shiftDate >= weekDays[0] && shiftDate <= weekDays[6]
    })

    const totalHours = weekShifts.reduce((sum, shift) => {
      const start = timeToMinutes(shift.startTime)
      const end = timeToMinutes(shift.endTime)
      return sum + (end - start) / 60
    }, 0)

    const staffWithShifts = new Set(weekShifts.map(s => s.staffId)).size

    return {
      totalShifts: weekShifts.length,
      totalHours: Math.round(totalHours),
      staffWithShifts
    }
  }, [shifts, weekDays])

  // Export
  const handleExport = () => {
    const weekShifts = shifts.filter(s => {
      const shiftDate = new Date(s.date + "T00:00:00")
      return shiftDate >= weekDays[0] && shiftDate <= weekDays[6]
    })

    const csvContent = [
      ["Staff", "Date", "Start", "End", "Hours", "Note"].join(","),
      ...weekShifts.map(shift => {
        const staff = staffMembers.find(s => s.id === shift.staffId)
        const hours = (timeToMinutes(shift.endTime) - timeToMinutes(shift.startTime)) / 60
        return [
          `"${staff?.firstName} ${staff?.lastName}"`,
          shift.date,
          shift.startTime,
          shift.endTime,
          hours.toFixed(1),
          `"${shift.note || ""}"`
        ].join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `shifts-${formatDateStr(weekDays[0])}-to-${formatDateStr(weekDays[6])}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Schedule exported")
  }

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-[#0f0f0f]"
    : "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"

  const modalClass = isFullscreen
    ? "w-full h-full flex flex-col"
    : "bg-[#141414] rounded-2xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-gray-800 shadow-2xl overflow-hidden"

  return (
    <div className={containerClass}>
      <div className={modalClass}>
        {/* Header */}
        <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Shift Schedule</h2>
                <p className="text-sm text-gray-500">
                  {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Stats Pills */}
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg">
                  <span className="text-gray-400 text-xs">Shifts</span>
                  <span className="text-white text-sm font-medium ml-2">{stats.totalShifts}</span>
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg">
                  <span className="text-gray-400 text-xs">Hours</span>
                  <span className="text-white text-sm font-medium ml-2">{stats.totalHours}h</span>
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg">
                  <span className="text-gray-400 text-xs">Staff</span>
                  <span className="text-white text-sm font-medium ml-2">{stats.staffWithShifts}/{filteredStaff.length}</span>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
                title="Export"
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation & Filters */}
          <div className="flex items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              {/* Add Shift Button */}
              <button
                onClick={() => {
                  setEditingShift(null)
                  setSelectedStaffForForm(null)
                  setSelectedDateForForm(selectedDay)
                  setIsShiftFormOpen(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Shift</span>
              </button>
            </div>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex-shrink-0 flex border-b border-gray-800 bg-[#1a1a1a] px-6">
          <div className="w-[200px] flex-shrink-0" /> {/* Spacer for staff column */}
          {weekDays.map((day, index) => {
            const isToday = formatDateStr(day) === formatDateStr(new Date())
            const isSelected = formatDateStr(day) === formatDateStr(selectedDay)
            const dayShifts = shifts.filter(s => s.date === formatDateStr(day))
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-3 text-center transition-colors relative ${
                  isSelected 
                    ? 'bg-gray-800/50' 
                    : 'hover:bg-gray-800/30'
                }`}
              >
                <div className={`text-xs uppercase tracking-wider ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                  {day.getDate()}
                </div>
                {dayShifts.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayShifts.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                    ))}
                    {dayShifts.length > 3 && (
                      <span className="text-[10px] text-gray-500">+{dayShifts.length - 3}</span>
                    )}
                  </div>
                )}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            )
          })}
        </div>

        {/* Time Header */}
        <TimeGridHeader />

        {/* Staff Rows */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredStaff.map(staff => (
            <StaffRow
              key={staff.id}
              staff={staff}
              shifts={shifts}
              date={selectedDay}
              onAddShift={handleAddShift}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              isSelected={selectedStaff?.id === staff.id}
              onSelect={setSelectedStaff}
            />
          ))}

          {filteredStaff.length === 0 && (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No staff members found</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-shrink-0 border-t border-gray-800 bg-[#1a1a1a] px-6 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="text-xs text-gray-500 uppercase tracking-wider flex-shrink-0">Staff Colors:</span>
            {staffMembers.slice(0, 8).map(staff => (
              <div key={staff.id} className="flex items-center gap-2 flex-shrink-0">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: staff.color }}
                />
                <span className="text-xs text-gray-400">{staff.firstName}</span>
              </div>
            ))}
            {staffMembers.length > 8 && (
              <span className="text-xs text-gray-500">+{staffMembers.length - 8} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Shift Form Modal */}
      <ShiftFormModal
        isOpen={isShiftFormOpen}
        onClose={() => {
          setIsShiftFormOpen(false)
          setEditingShift(null)
        }}
        shift={editingShift}
        staff={selectedStaffForForm}
        date={selectedDateForForm}
        onSave={handleSaveShift}
        onDelete={handleDeleteShift}
        allStaff={staffMembers}
        shifts={shifts}
      />
    </div>
  )
}

export default StaffPlanningModal
