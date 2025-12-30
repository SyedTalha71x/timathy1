/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, X, Download, Users, Calendar, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import VacationCalendarModal from "./vacation-calendar-modal"
import { exportToExcel } from "../../../utils/excelExport"

// helper to format date to YYYY-MM-DD using local time (avoids timezone off-by-one)
function localDateStr(date) {
  if (!date) return ""
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function StaffPlanningModal({ staffMembers, onClose }) {
  // Core state
  const [activeMenuItem, setActiveMenuItem] = useState("attendance") // Default to shifts
  const [showVacationCalendar, setShowVacationCalendar] = useState(false)

  // Staff picking / views - REMOVED showStaffPicker state
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [viewAllShifts, setViewAllShifts] = useState(true) // Set to true by default

  // Calendar + shift form (per-staff) - SET TO DECEMBER 2024
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)) // December 2024 (month is 0-indexed, so 11 = December)
  const [shifts, setShifts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [showShiftForm, setShowShiftForm] = useState(false)
  const [isRangeBooking, setIsRangeBooking] = useState(false)
  const [rangeStartDate, setRangeStartDate] = useState(null)
  const [rangeEndDate, setRangeEndDate] = useState(null)

  // Absence state
  const [showAbsenceForm, setShowAbsenceForm] = useState(false)
  const [absenceStartDate, setAbsenceStartDate] = useState("")
  const [absenceEndDate, setAbsenceEndDate] = useState("")
  const [absenceStartTime, setAbsenceStartTime] = useState("09:00")
  const [absenceEndTime, setAbsenceEndTime] = useState("17:00")
  const [absenceReason, setAbsenceReason] = useState("")
  const [absences, setAbsences] = useState({})

  // Attendance Overview states
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentOverviewMonth, setCurrentOverviewMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Staff members with unique colors
  const staffMembersWithColors = [
    { id: 1, firstName: "John", lastName: "Doe", color: "#3b82f6" }, // Blue
    { id: 2, firstName: "Natalia", lastName: "Brown", color: "#10b981" }, // Green
    { id: 3, firstName: "Micheal", lastName: "John", color: "#ef4444" }, // Red
    { id: 4, firstName: "Emma", lastName: "Johnson", color: "#8b5cf6" }, // Purple
    { id: 5, firstName: "David", lastName: "Smith", color: "#f59e0b" }, // Orange
    { id: 6, firstName: "Sarah", lastName: "Wilson", color: "#ec4899" }, // Pink
    { id: 7, firstName: "Robert", lastName: "Davis", color: "#06b6d4" }, // Cyan
  ]

  // Updated dummy data with MULTIPLE shifts for December 2024
  const dummyShiftsData = useMemo(() => {
    return staffMembersWithColors.map((staff) => {
      let shifts = []
      
      // John Doe - Blue
      if (staff.firstName === "John" && staff.lastName === "Doe") {
        shifts = [
          { date: "2024-12-02", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-04", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-06", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-11", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-13", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-18", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-20", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-30", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
        ]
      } 
      // Natalia Brown - Green
      else if (staff.firstName === "Natalia" && staff.lastName === "Brown") {
        shifts = [
          { date: "2024-12-02", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-03", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-05", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-06", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-10", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-12", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-13", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-17", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-19", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-20", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-24", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-26", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-30", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-31", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
        ]
      } 
      // Micheal John - Red
      else if (staff.firstName === "Micheal" && staff.lastName === "John") {
        shifts = [
          { date: "2024-12-03", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-04", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-05", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-06", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-10", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-11", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-12", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-13", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-17", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-18", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-19", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-20", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-24", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-26", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-30", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-31", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
        ]
      }
      // Emma Johnson - Purple
      else if (staff.firstName === "Emma" && staff.lastName === "Johnson") {
        shifts = [
          { date: "2024-12-02", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-05", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-06", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-10", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-12", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-13", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-17", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-19", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-20", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-24", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-30", startTime: "12:00", endTime: "20:00", hoursWorked: 8, status: "scheduled" },
        ]
      }
      // David Smith - Orange
      else if (staff.firstName === "David" && staff.lastName === "Smith") {
        shifts = [
          { date: "2024-12-02", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-03", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-04", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-05", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-10", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-11", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-12", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-17", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-18", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-19", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-24", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-26", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "14:00", endTime: "22:00", hoursWorked: 8, status: "scheduled" },
        ]
      }
      // Default shifts for other staff
      else {
        shifts = [
          { date: "2024-12-02", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-03", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-04", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-05", startTime: "09:30", endTime: "17:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-06", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-09", startTime: "08:30", endTime: "16:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-10", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-11", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-12", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-13", startTime: "09:30", endTime: "17:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-16", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-17", startTime: "08:30", endTime: "16:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-18", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-19", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-20", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-23", startTime: "09:30", endTime: "17:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-24", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-26", startTime: "08:30", endTime: "16:30", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-27", startTime: "09:00", endTime: "17:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-30", startTime: "10:00", endTime: "18:00", hoursWorked: 8, status: "scheduled" },
          { date: "2024-12-31", startTime: "08:00", endTime: "16:00", hoursWorked: 8, status: "scheduled" },
        ]
      }
      
      return {
        ...staff,
        shifts
      }
    })
  }, [])

  // Initialize with some sample absences
  useState(() => {
    const sampleAbsences = {}
    staffMembersWithColors.forEach((staff, index) => {
      if (index < 2) { // Add absences for first 2 staff members
        const absenceId = `absence-${staff.id}-1`
        sampleAbsences[absenceId] = {
          id: absenceId,
          staffId: staff.id,
          startDate: "2024-12-25",
          endDate: "2024-12-25",
          startTime: "09:00",
          endTime: "17:00",
          reason: index === 0 ? "Christmas Holiday" : "Christmas Holiday"
        }
      }
    })
    setAbsences(sampleAbsences)
  })

  // ============ Navigation helpers ============
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToPreviousOverviewMonth = () => {
    setCurrentOverviewMonth(new Date(currentOverviewMonth.getFullYear(), currentOverviewMonth.getMonth() - 1, 1))
  }

  const goToNextOverviewMonth = () => {
    setCurrentOverviewMonth(new Date(currentOverviewMonth.getFullYear(), currentOverviewMonth.getMonth() + 1, 1))
  }

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  }

  const getWeekDateRange = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return { start: startOfWeek, end: endOfWeek }
  }

  const isCurrentWeek = (date) => {
    const now = new Date()
    const currentWeekRange = getWeekDateRange(now)
    const selectedWeekRange = getWeekDateRange(date)
    return (
      currentWeekRange.start.getTime() === selectedWeekRange.start.getTime() &&
      currentWeekRange.end.getTime() === selectedWeekRange.end.getTime()
    )
  }

  // ============ Attendance Overview helpers ============
  const calculateTotalHours = (shifts) => {
    return shifts.reduce((total, shift) => total + shift.hoursWorked, 0)
  }

  const filteredStaff =
    selectedStaffId === "all"
      ? dummyShiftsData.map((staff) => ({
          ...staff,
          shifts: statusFilter === "all" ? staff.shifts : staff.shifts.filter((shift) => shift.status === statusFilter),
        }))
      : dummyShiftsData
          .filter((staff) => staff.id === Number.parseInt(selectedStaffId))
          .map((staff) => ({
            ...staff,
            shifts:
              statusFilter === "all" ? staff.shifts : staff.shifts.filter((shift) => shift.status === statusFilter),
          }))

  const exportToExcelFile = () => {
    const headers = ["Staff Name", "Date", "Start Time", "End Time", "Hours Worked", "Status"]
    const data = [
      headers,
      ...filteredStaff.flatMap((staff) =>
        staff.shifts.map((shift) => [
          `${staff.firstName} ${staff.lastName}`,
          shift.date,
          shift.startTime,
          shift.endTime,
          shift.hoursWorked,
          shift.status,
        ]),
      ),
    ]
    exportToExcel(data, `shifts_overview_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.xlsx`)
    toast.success("Excel file downloaded successfully")
  }

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    if (period === "month") {
      setCurrentDate(new Date())
    } else if (period === "week") {
      setCurrentDate(new Date())
    }
  }

  const renderPeriodDisplay = () => {
    if (selectedPeriod === "month") {
      return (
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousOverviewMonth} className="p-1 bg-[#1C1C1C] rounded hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base min-w-[120px] text-center">
            {currentOverviewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <button onClick={goToNextOverviewMonth} className="p-1 bg-[#1C1C1C] rounded hover:bg-gray-700">
            <ChevronRight size={16} />
          </button>
        </div>
      )
    } else if (selectedPeriod === "week") {
      const weekRange = getWeekDateRange(currentWeek)
      const weekNumber = getWeekNumber(currentWeek)
      const showThisWeek = isCurrentWeek(currentWeek)
      return (
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousWeek} className="p-1 bg-[#1C1C1C] rounded hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base min-w-[200px] text-center">
            <div>{showThisWeek ? "This Week" : `Week ${weekNumber}`}</div>
            <div className="text-xs text-gray-400">
              {weekRange.start.toLocaleDateString()} - {weekRange.end.toLocaleDateString()}
            </div>
          </div>
          <button onClick={goToNextWeek} className="p-1 bg-[#1C1C1C] rounded hover:bg-gray-700">
            <ChevronRight size={16} />
          </button>
        </div>
      )
    } else {
      return (
        <input
          type="date"
          value={currentDate.toISOString().split("T")[0]}
          onChange={(e) => setCurrentDate(new Date(e.target.value))}
          className="bg-[#1C1C1C] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
        />
      )
    }
  }

  // ============ Calendar helpers (per-month grid) ============
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const days = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }
  const calendarDays = generateCalendarDays()

  // ============ Staff selection + shift setup ============
  const initStaffShifts = (staff) => {
    const staffShifts = {}
    const today = new Date()
    const dateStr1 = localDateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    const dateStr2 = localDateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))
    staffShifts[dateStr1] = "9:00-17:00"
    staffShifts[dateStr2] = "10:00-18:00"
    setShifts(staffShifts)
    setRangeStartDate(null)
    setRangeEndDate(null)
    setIsRangeBooking(false)
  }

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff)
    setViewAllShifts(false)
    initStaffShifts(staff)
    setShowShiftForm(false)
  }

  const handlePickAll = () => {
    setSelectedStaff(null)
    setViewAllShifts(true)
    setShowShiftForm(false)
  }

  const toggleRangeBooking = () => {
    setIsRangeBooking(!isRangeBooking)
    setRangeStartDate(null)
    setRangeEndDate(null)
  }

  const isInSelectedRange = (date) => {
    if (!isRangeBooking) return false
    if (!rangeStartDate || !date) return false
    if (!rangeEndDate) return date.getTime() === rangeStartDate.getTime()
    return date >= rangeStartDate && date <= rangeEndDate
  }

  const hasShift = (date) => {
    if (!date) return false
    const dateStr = localDateStr(date)
    return shifts[dateStr] !== undefined
  }

  const handleDateClick = (date) => {
    if (!date) return
    if (viewAllShifts) {
      setSelectedDate(date)
      setShowShiftForm(false)
      return
    }

    if (isRangeBooking) {
      if (!rangeStartDate) {
        setRangeStartDate(date)
      } else if (!rangeEndDate && date >= rangeStartDate) {
        setRangeEndDate(date)
        setSelectedDate(rangeStartDate)
        const dateStr = localDateStr(rangeStartDate)
        const existingShift = shifts[dateStr]
        if (existingShift) {
          const [start, end] = existingShift.split("-")
          setStartTime(start)
          setEndTime(end)
        } else {
          setStartTime("")
          setEndTime("")
        }
        setShowShiftForm(true)
      } else {
        setRangeStartDate(date)
        setRangeEndDate(null)
      }
    } else {
      const dateStr = localDateStr(date)
      setSelectedDate(date)
      const existingShift = shifts[dateStr]
      if (existingShift) {
        const [start, end] = existingShift.split("-")
        setStartTime(start)
        setEndTime(end)
      } else {
        setStartTime("")
        setEndTime("")
      }
      setShowShiftForm(true)
    }
  }

  const handleSaveShift = () => {
    if (!startTime || !endTime) {
      toast.error("Please enter both Start Time and End Time")
      return
    }
    const shiftPeriod = `${startTime}-${endTime}`

    if (isRangeBooking && rangeStartDate && rangeEndDate) {
      const newShifts = { ...shifts }
      const currentDate = new Date(rangeStartDate)
      const endDateObj = new Date(rangeEndDate)

      while (currentDate <= endDateObj) {
        const dateStr = localDateStr(currentDate)
        newShifts[dateStr] = shiftPeriod
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shifts saved from ${rangeStartDate.toLocaleDateString()} to ${rangeEndDate.toLocaleDateString()}`)
      setRangeStartDate(null)
      setRangeEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      const dateStr = localDateStr(selectedDate)
      setShifts((prev) => ({ ...prev, [dateStr]: shiftPeriod }))
      setShowShiftForm(false)
      toast.success(`Shift saved for ${selectedDate.toLocaleDateString()}`)
    }
  }

  const handleDeleteShift = () => {
    if (isRangeBooking && rangeStartDate && rangeEndDate) {
      const newShifts = { ...shifts }
      const currentDate = new Date(rangeStartDate)
      const endDateObj = new Date(rangeEndDate)
      while (currentDate <= endDateObj) {
        const dateStr = localDateStr(currentDate)
        delete newShifts[dateStr]
        currentDate.setDate(currentDate.getDate() + 1)
      }
      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(
        `Shifts deleted from ${rangeStartDate.toLocaleDateString()} to ${rangeEndDate.toLocaleDateString()}`,
      )
      setRangeStartDate(null)
      setRangeEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      const dateStr = localDateStr(selectedDate)
      const newShifts = { ...shifts }
      delete newShifts[dateStr]
      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shift deleted for ${selectedDate.toLocaleDateString()}`)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleVacationRequest = (staffId, startDate, endDate) => {
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  // ============ Absence functionality ============
  const handleAddAbsence = () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member first")
      return
    }
    setShowAbsenceForm(true)
  }

  const handleSaveAbsence = () => {
    if (!absenceStartDate || !absenceEndDate || !absenceReason) {
      toast.error("Please fill all required fields")
      return
    }

    const absenceId = `absence-${selectedStaff.id}-${Date.now()}`
    const newAbsence = {
      id: absenceId,
      staffId: selectedStaff.id,
      startDate: absenceStartDate,
      endDate: absenceEndDate,
      startTime: absenceStartTime,
      endTime: absenceEndTime,
      reason: absenceReason
    }

    setAbsences(prev => ({ ...prev, [absenceId]: newAbsence }))
    setShowAbsenceForm(false)
    setAbsenceStartDate("")
    setAbsenceEndDate("")
    setAbsenceStartTime("09:00")
    setAbsenceEndTime("17:00")
    setAbsenceReason("")
    toast.success("Absence added successfully")
  }

  const isDateInAbsence = (date, staffId) => {
    const dateStr = localDateStr(date)
    return Object.values(absences).some(absence => 
      absence.staffId === staffId && 
      dateStr >= absence.startDate && 
      dateStr <= absence.endDate
    )
  }

  const getAbsenceForDate = (date, staffId) => {
    const dateStr = localDateStr(date)
    return Object.values(absences).find(absence => 
      absence.staffId === staffId && 
      dateStr >= absence.startDate && 
      dateStr <= absence.endDate
    )
  }

  // ============ Aggregated "All" shifts (calendar) ============
  const allShiftsMap = useMemo(() => {
    const map = {}
    dummyShiftsData.forEach((s) => {
      s.shifts.forEach((shift) => {
        if (!map[shift.date]) map[shift.date] = []
        map[shift.date].push({
          staffId: s.id,
          staffName: `${s.firstName} ${s.lastName}`,
          startTime: shift.startTime,
          endTime: shift.endTime,
          status: shift.status,
          color: s.color // Use the actual staff color from data
        })
      })
    })
    return map
  }, [dummyShiftsData])

  // ============ Left Menu ============
  const renderLeftMenu = () => (
    <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
      <h3 className="text-lg font-semibold mb-2">Menu</h3>
      <div className="bg-[#141414] rounded-xl p-2 space-y-1">
        <button
          onClick={() => {
            setActiveMenuItem("attendance")
            setSelectedStaff(null)
            setViewAllShifts(true)
            setShowVacationCalendar(false)
            setShowShiftForm(false)
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            activeMenuItem === "attendance" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          <Users size={16} />
          Attendance Overview
        </button>

        <button
          onClick={() => {
            setActiveMenuItem("shifts")
            setShowVacationCalendar(false)
            setViewAllShifts(true) // Always show all staff schedule when clicking Shift Schedule
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            activeMenuItem === "shifts" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          <Calendar size={16} />
          Shift Schedule
        </button>

        <button
          onClick={() => {
            setActiveMenuItem("vacation")
            setSelectedStaff(null)
            setViewAllShifts(true)
            setShowVacationCalendar(true)
            setShowShiftForm(false)
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            activeMenuItem === "vacation" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          <Calendar size={16} />
          Vacation Calendar
        </button>
      </div>
    </div>
  )

  // ============ Main Content Renderers ============
  const renderAttendanceOverview = () => (
    <div className="bg-[#141414] rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Attendance Overview</h3>
        <button
          onClick={exportToExcelFile}
          className="bg-gray-700 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center"
        >
          <Download className="h-4 w-4" />
          Export Excel
        </button>
      </div>

      <div className="mb-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4 items-stretch lg:items-center">
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full lg:w-auto"
        >
          <option value="all">All Staff Members</option>
          {staffMembersWithColors.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.firstName} {staff.lastName}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full lg:w-auto flex items-center gap-2"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full lg:w-auto"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <div className="flex-shrink-0">{renderPeriodDisplay()}</div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full lg:w-auto"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      <div className=" overflow-y-auto custom-scrollbar max-h-[50vh]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-sm md:text-base border-b border-gray-700">
              <th className="text-left py-3">Staff Name</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Check in</th>
              <th className="text-left py-3">Check out</th>
              <th className="text-left py-3">Hours</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) =>
              staff.shifts.map((shift, index) => (
                <tr key={`${staff.id}-${index}`} className="text-sm md:text-base border-b border-gray-800">
                  <td className="py-3">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-3">{new Date(shift.date).toLocaleDateString()}</td>
                  <td className="py-3">{shift.startTime}</td>
                  <td className="py-3">{shift.endTime}</td>
                  <td className="py-3">{shift.hoursWorked}h</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        shift.status === "completed"
                          ? "bg-blue-600 text-white"
                          : shift.status === "scheduled"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-600 text-white"
                      }`}
                    >
                      {shift.status}
                    </span>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-[#1C1C1C] rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-2">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-300">Total Staff:</p>
            <p className="font-bold text-white">{filteredStaff.length}</p>
          </div>
          <div>
            <p className="text-gray-300">Total Shifts:</p>
            <p className="font-bold text-white">
              {filteredStaff.reduce((total, staff) => total + staff.shifts.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-300">Total Hours:</p>
            <p className="font-bold text-white">
              {filteredStaff.reduce((total, staff) => total + calculateTotalHours(staff.shifts), 0)}h
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">Use "Shift Schedule" to manage individual or all-staff schedules.</p>
      </div>
    </div>
  )

  const renderAllShiftsCalendar = () => {
    const selectedDateStr = selectedDate ? localDateStr(selectedDate) : null
    const dayEntries = selectedDateStr ? allShiftsMap[selectedDateStr] || [] : []

    // Function to generate gradient for multiple staff
    const generateGradientForDay = (entries) => {
      if (entries.length === 0) return null
      
      const uniqueStaff = entries.reduce((acc, entry) => {
        if (!acc.some(item => item.staffId === entry.staffId)) {
          acc.push(entry)
        }
        return acc
      }, [])
      
      if (uniqueStaff.length === 1) {
        return { backgroundColor: `${uniqueStaff[0].color}40` }
      }
      
      // Create gradient for multiple staff
      const colors = uniqueStaff.map(staff => staff.color)
      const gradientStops = []
      const step = 100 / colors.length
      
      colors.forEach((color, index) => {
        const start = index * step
        const end = (index + 1) * step
        gradientStops.push(`${color}40 ${start}%`)
        gradientStops.push(`${color}40 ${end}%`)
      })
      
      return {
        background: `linear-gradient(135deg, ${gradientStops.join(', ')})`
      }
    }

    return (
      <>
        <div className="bg-[#141414] rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-center sm:text-left">All Staff Schedule - December 2024</h3>
            <div className="flex items-center justify-center space-x-2">
              <button onClick={goToPreviousMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button onClick={goToNextMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="opacity-0 h-14 sm:h-16" />
              const dateStr = localDateStr(day)
              const entries = allShiftsMap[dateStr] || []
              const isWeekend = day.getDay() === 0 || day.getDay() === 6
              const isSelected = selectedDateStr === dateStr
              const dayStyle = generateGradientForDay(entries)
              
              return (
                <div
                  key={dateStr}
                  className={`
                    relative text-center p-1 sm:p-2 rounded-md text-xs sm:text-sm cursor-pointer h-14 sm:h-16 flex flex-col items-center justify-center
                    ${isSelected ? "outline outline-blue-500 outline-2" : ""}
                    ${isWeekend ? "text-gray-400" : "text-white"}
                    ${!dayStyle ? "hover:bg-gray-700" : "hover:opacity-90"}
                  `}
                  style={dayStyle}
                  onClick={() => handleDateClick(day)}
                  title={entries.length > 0 ? `${entries.length} staff scheduled` : "No shifts"}
                >
                  <span className="font-bold">{day.getDate()}</span>
                  {entries.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 p-1">
                      {entries.slice(0, 3).map((entry, idx) => (
                        <div 
                          key={idx} 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                          title={`${entry.staffName}: ${entry.startTime}-${entry.endTime}`}
                        />
                      ))}
                      {entries.length > 3 && (
                        <div className="text-[8px] text-gray-300">+{entries.length - 3}</div>
                      )}
                    </div>
                  )}
                  {entries.length > 0 && (
                    <div className="text-[10px] mt-1 text-gray-300">
                      {entries.length} staff
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Day Details Section */}
        <div className="mt-4 bg-[#141414] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Day Details</h3>
          {selectedDate ? (
            dayEntries.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="text-sm text-gray-400 mb-2">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </div>
                {dayEntries.map((entry, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#1C1C1C] rounded-lg hover:bg-[#242424] transition-colors"
                    style={{ borderLeft: `4px solid ${entry.color}` }}
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div>
                        <span className="font-medium text-gray-300">{entry.staffName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            entry.status === "completed" ? "bg-blue-600 text-white" :
                            entry.status === "scheduled" ? "bg-orange-500 text-white" :
                            "bg-gray-600 text-white"
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{entry.startTime}-{entry.endTime}</span>
                      <div className="text-xs text-gray-400 mt-1">8 hours</div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Staff:</span>
                    <span className="font-bold">{dayEntries.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Total Hours:</span>
                    <span className="font-bold">{dayEntries.length * 8} hours</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">📅</div>
                <p className="text-gray-400 text-sm">No shifts scheduled for {selectedDate.toLocaleDateString()}.</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">👆</div>
              <p className="text-gray-400 text-sm">Click on any date to see detailed schedule.</p>
              <p className="text-gray-500 text-xs mt-1">Colored days have scheduled staff shifts</p>
            </div>
          )}
        </div>
      </>
    )
  }

  const renderIndividualSchedule = () => (
    <>
      {showShiftForm ? (
        <div className="bg-[#141414] rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Book Shift</h3>
            <button onClick={() => setShowShiftForm(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {isRangeBooking ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Start Date</label>
                  <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">
                    {rangeStartDate ? rangeStartDate.toLocaleDateString() : "Select start date"}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">End Date</label>
                  <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">
                    {rangeEndDate ? rangeEndDate.toLocaleDateString() : "Select end date"}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm text-gray-300 block mb-2">Date</label>
                <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">
                  {selectedDate ? formatDate(selectedDate) : "No date selected"}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setShowShiftForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveShift}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              {isRangeBooking ? "Save Shifts for Range" : "Save Shift"}
            </button>
            {(isRangeBooking ? rangeStartDate && rangeEndDate : hasShift(selectedDate)) && (
              <button
                onClick={handleDeleteShift}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {isRangeBooking ? "Delete Shifts for Range" : "Delete Shift"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-[#141414] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-center sm:text-left">
                Schedule for {selectedStaff.firstName} {selectedStaff.lastName}
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <button onClick={goToPreviousMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={goToNextMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-2">
              <button
                onClick={toggleRangeBooking}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  isRangeBooking ? "bg-blue-600" : "bg-[#1C1C1C] hover:bg-gray-700"
                }`}
              >
                {isRangeBooking ? "Range Booking: ON" : "Range Booking: OFF"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} className="opacity-0 h-10 sm:h-12" />
                const dateStr = localDateStr(day)
                const hasShiftBooked = shifts[dateStr] !== undefined
                const isWeekend = day.getDay() === 0 || day.getDay() === 6
                const isSelected = isInSelectedRange(day)
                const isAbsent = isDateInAbsence(day, selectedStaff.id)
                const absence = getAbsenceForDate(day, selectedStaff.id)

                return (
                  <div
                    key={dateStr}
                    className={`
                      relative text-center p-1 sm:p-2 rounded-md text-xs sm:text-sm cursor-pointer h-10 sm:h-12 flex flex-col items-center justify-center
                      ${isAbsent ? "bg-red-600/40 border border-red-500" : hasShiftBooked ? "bg-opacity-40" : ""}
                      ${isSelected ? "bg-blue-600/40 border border-blue-500" : ""}
                      ${isWeekend ? "text-gray-500" : ""}
                      ${
                        !hasShiftBooked && !isSelected && !isAbsent
                          ? "hover:bg-gray-700"
                          : hasShiftBooked
                            ? "hover:opacity-80"
                            : ""
                      }
                    `}
                    style={hasShiftBooked && !isAbsent ? { 
                      backgroundColor: `${selectedStaff.color}40` 
                    } : {}}
                    onClick={() => handleDateClick(day)}
                    title={isAbsent ? `Absent: ${absence?.reason}` : hasShiftBooked ? `${selectedStaff.firstName} ${selectedStaff.lastName}: ${shifts[dateStr]}` : ""}
                  >
                    <span>{day.getDate()}</span>
                    {hasShiftBooked && !isAbsent && (
                      <div className="absolute bottom-0 left-0 right-0 text-[8px] sm:text-[10px] text-center pb-0.5 px-0.5 truncate">
                        {shifts[dateStr]}
                      </div>
                    )}
                    {isAbsent && (
                      <div className="absolute bottom-0 left-0 right-0 text-[8px] sm:text-[10px] text-center pb-0.5 px-0.5 truncate text-red-300">
                        Absent
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 bg-[#141414] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Scheduled Shifts</h3>
              <button
                onClick={handleAddAbsence}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add Absence
              </button>
            </div>
            {Object.keys(shifts).length > 0 ? (
              <div className="space-y-2 max-h-[200px] custom-scrollbar overflow-y-auto">
                {Object.entries(shifts).map(([dateStr, period]) => {
                  const date = new Date(dateStr)
                  const isAbsent = isDateInAbsence(date, selectedStaff.id)
                  return (
                    <div
                      key={dateStr}
                      className={`flex justify-between text-sm items-center p-2 rounded-lg hover:bg-[#242424] cursor-pointer ${
                        isAbsent ? "bg-red-600/20 border border-red-500" : "bg-[#1C1C1C]"
                      }`}
                      onClick={() => {
                        setSelectedDate(date)
                        const [start, end] = period.split("-")
                        setStartTime(start)
                        setEndTime(end)
                        setIsRangeBooking(false)
                        setShowShiftForm(true)
                      }}
                      title={isAbsent ? `Absent: ${getAbsenceForDate(date, selectedStaff.id)?.reason}` : ""}
                    >
                      <span>
                        {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <span className={`font-medium ${isAbsent ? "text-red-300" : ""}`}>
                        {period} {isAbsent && "(Absent)"}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No shifts scheduled yet. Click on a date to add a shift.</p>
            )}
          </div>
        </>
      )}
    </>
  )

  // ============ Top tabs for "Shift Schedule" ============
  const ShiftTabs = () => (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <button
        className={`px-3 py-1.5 rounded-lg text-sm ${
          viewAllShifts ? "bg-blue-600 text-white" : "bg-[#1C1C1C] text-gray-300 hover:bg-gray-700"
        }`}
        onClick={handlePickAll}
      >
        All Staff Schedule
      </button>
      {staffMembersWithColors.map((staff) => (
        <button
          key={staff.id}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
            selectedStaff?.id === staff.id && !viewAllShifts 
              ? "bg-blue-600 text-white" 
              : "bg-[#1C1C1C] text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => handleStaffSelect(staff)}
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: staff.color || '#3b82f6' }}
          ></div>
          {staff.firstName} {staff.lastName}
        </button>
      ))}
    </div>
  )

  // ============ Absence Form ============
  const AbsenceForm = () => {
    if (!showAbsenceForm) return null
    return (
      <div
        className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
        onClick={() => setShowAbsenceForm(false)}
      >
        <div className="bg-[#181818] text-white rounded-xl w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold">Add Absence</h4>
            <button className="text-gray-400 hover:text-white" onClick={() => setShowAbsenceForm(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-2">Staff Member</label>
              <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">
                {selectedStaff.firstName} {selectedStaff.lastName}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Start Date *</label>
                <input
                  type="date"
                  value={absenceStartDate}
                  onChange={(e) => setAbsenceStartDate(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">End Date *</label>
                <input
                  type="date"
                  value={absenceEndDate}
                  onChange={(e) => setAbsenceEndDate(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Start Time</label>
                <input
                  type="time"
                  value={absenceStartTime}
                  onChange={(e) => setAbsenceStartTime(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">End Time</label>
                <input
                  type="time"
                  value={absenceEndTime}
                  onChange={(e) => setAbsenceEndTime(e.target.value)}
                  className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Reason *</label>
              <input
                type="text"
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                placeholder="Enter reason for absence"
                className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowAbsenceForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAbsence}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex-1"
            >
              Save Absence
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ Legend Component ============
  const Legend = () => (
    <div className="mt-4 bg-[#141414] rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Schedule Legend</h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Staff Colors:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {staffMembersWithColors.map((staff) => (
              <div key={staff.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: staff.color }}
                ></div>
                <span className="text-sm text-gray-300">
                  {staff.firstName} {staff.lastName}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Calendar Guide:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3b82f640' }}></div>
              <span className="text-sm text-gray-300">Single staff working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ 
                background: 'linear-gradient(135deg, #3b82f640 0%, #10b98140 100%)'
              }}></div>
              <span className="text-sm text-gray-300">Multiple staff working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800 border border-gray-600"></div>
              <span className="text-sm text-gray-300">No shifts scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600/40 border border-red-500"></div>
              <span className="text-sm text-gray-300">Absent staff</span>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> December 2024 calendar shows all staff shifts at once. 
            Click on any colored date to see detailed schedule for that day.
          </p>
        </div>
      </div>
    </div>
  )

  // ============ Main Modal ============
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#181818] text-white rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-7xl custom-scrollbar max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Staff Planning</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {renderLeftMenu()}

          <div className="w-full lg:w-3/4">
            {showVacationCalendar ? (
              <div className="bg-[#141414] rounded-xl p-4">
                <VacationCalendarModal
                  staffMember={staffMembersWithColors[0]}
                  onClose={() => {}}
                  onSubmit={handleVacationRequest}
                  isEmbedded={true}
                  staffMembers={staffMembersWithColors}
                  isStaffPlanning={true}
                />
              </div>
            ) : activeMenuItem === "attendance" ? (
              renderAttendanceOverview()
            ) : (
              <div className="bg-transparent">
                <ShiftTabs />
                <div className="bg-transparent">
                  {viewAllShifts ? (
                    <>
                      {renderAllShiftsCalendar()}
                      <Legend />
                    </>
                  ) : selectedStaff ? (
                    renderIndividualSchedule()
                  ) : (
                    <div className="bg-[#141414] rounded-xl p-6 text-center">
                      <p className="text-gray-300 mb-3">Choose a staff to manage their schedule</p>
                      <p className="text-gray-400 text-sm">Select a staff member from the tabs above</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
      <AbsenceForm />
    </div>
  )
}

export default StaffPlanningModal