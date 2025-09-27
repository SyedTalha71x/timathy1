

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, X, Download, Users, Calendar } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import VacationCalendarModal from "./vacation-calendar-modal"
import { exportToExcel } from "../../../utils/excelExport"

function StaffPlanningModal({ staffMembers, onClose }) {
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [shifts, setShifts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [showShiftForm, setShowShiftForm] = useState(false)
  const [isRangeBooking, setIsRangeBooking] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [rangeStartDate, setRangeStartDate] = useState(null)
  const [rangeEndDate, setRangeEndDate] = useState(null)

  const [activeMenuItem, setActiveMenuItem] = useState("attendance")
  const [showVacationCalendar, setShowVacationCalendar] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  // Overview states
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentOverviewMonth, setCurrentOverviewMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const dummyShiftsData = staffMembers.map((staff) => ({
    ...staff,
    shifts: [
      {
        date: "2024-01-15",
        startTime: "09:00",
        endTime: "17:00",
        hoursWorked: 8,
        status: "completed",
      },
      {
        date: "2024-01-16",
        startTime: "10:00",
        endTime: "18:00",
        hoursWorked: 8,
        status: "completed",
      },
      {
        date: "2024-01-17",
        startTime: "08:00",
        endTime: "16:00",
        hoursWorked: 8,
        status: "scheduled",
      },
      {
        date: "2024-01-18",
        startTime: "09:30",
        endTime: "17:30",
        hoursWorked: 8,
        status: "scheduled",
      },
    ],
  }))

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
    return {
      start: startOfWeek,
      end: endOfWeek,
    }
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

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff)
    const staffShifts = {}
    const today = new Date()
    const dateStr1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split("T")[0]
    const dateStr2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split("T")[0]
    staffShifts[dateStr1] = "9:00-17:00"
    staffShifts[dateStr2] = "10:00-18:00"
    setShifts(staffShifts)
    setStartDate("")
    setEndDate("")
    setRangeStartDate(null)
    setRangeEndDate(null)
    setIsRangeBooking(false)
  }

  const handleDateClick = (date) => {
    if (isRangeBooking) {
      if (!rangeStartDate) {
        setRangeStartDate(date)
        setStartDate(date.toISOString().split("T")[0])
      } else if (!rangeEndDate && date >= rangeStartDate) {
        setRangeEndDate(date)
        setEndDate(date.toISOString().split("T")[0])
        setSelectedDate(rangeStartDate)
        const dateStr = rangeStartDate.toISOString().split("T")[0]
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
        setStartDate(date.toISOString().split("T")[0])
        setEndDate("")
      }
    } else {
      const dateStr = date.toISOString().split("T")[0]
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
      toast.error("Please enter both Check in and Check out time")
      return
    }

    const shiftPeriod = `${startTime}-${endTime}`

    if (isRangeBooking && rangeStartDate && rangeEndDate) {
      const newShifts = { ...shifts }
      const currentDate = new Date(rangeStartDate)
      const endDateObj = new Date(rangeEndDate)

      while (currentDate <= endDateObj) {
        const dateStr = currentDate.toISOString().split("T")[0]
        newShifts[dateStr] = shiftPeriod
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shifts saved from ${rangeStartDate.toLocaleDateString()} to ${rangeEndDate.toLocaleDateString()}`)
      setStartDate("")
      setEndDate("")
      setRangeStartDate(null)
      setRangeEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      if (!selectedDate) return
      const dateStr = selectedDate.toISOString().split("T")[0]
      setShifts((prev) => ({
        ...prev,
        [dateStr]: shiftPeriod,
      }))
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
        const dateStr = currentDate.toISOString().split("T")[0]
        delete newShifts[dateStr]
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(
        `Shifts deleted from ${rangeStartDate.toLocaleDateString()} to ${rangeEndDate.toLocaleDateString()}`,
      )
      setStartDate("")
      setEndDate("")
      setRangeStartDate(null)
      setRangeEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      if (!selectedDate) return
      const dateStr = selectedDate.toISOString().split("T")[0]
      const newShifts = { ...shifts }
      delete newShifts[dateStr]
      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shift deleted for ${selectedDate.toLocaleDateString()}`)
    }
  }

  const handleSaveAllShifts = () => {
    if (!selectedStaff) return
    console.log("Saving all shifts for", selectedStaff.firstName, shifts)
    toast.success("All shifts saved successfully")
    onClose()
  }

  const toggleRangeBooking = () => {
    setIsRangeBooking(!isRangeBooking)
    setStartDate("")
    setEndDate("")
    setRangeStartDate(null)
    setRangeEndDate(null)
  }

  const hasShift = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts[dateStr] !== undefined
  }

  const isInSelectedRange = (date) => {
    if (!rangeStartDate || !date) return false
    if (!rangeEndDate) return date.getTime() === rangeStartDate.getTime()
    return date >= rangeStartDate && date <= rangeEndDate
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

  const renderLeftMenu = () => (
    <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
      <h3 className="text-lg font-semibold mb-2">Menu</h3>
      <div className="bg-[#141414] rounded-xl p-2 space-y-1">
        <button
          onClick={() => {
            setActiveMenuItem("attendance")
            setSelectedStaff(null)
            setShowVacationCalendar(false)
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
            setActiveMenuItem("vacation")
            setSelectedStaff(null)
            setShowVacationCalendar(true)
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            activeMenuItem === "vacation" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          <Calendar size={16} />
          Vacation Calendar
        </button>
      </div>

      {activeMenuItem === "attendance" && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Staff</h4>
          <div className="bg-[#141414] rounded-xl p-2 max-h-[400px] overflow-y-auto">
            <ul className="space-y-1">
              {staffMembers.map((staff) => (
                <li
                  key={staff.id}
                  className={`cursor-pointer p-2 rounded-lg text-sm transition-colors ${
                    selectedStaff?.id === staff.id ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  {staff.firstName} {staff.lastName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#181818] text-white rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-7xl max-h-[95vh] overflow-y-auto">
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
                  staffMember={staffMembers[0]}
                  onClose={() => {}}
                  onSubmit={handleVacationRequest}
                  isEmbedded={true}
                />
              </div>
            ) : selectedStaff ? (
              // Individual Staff Schedule View
              showShiftForm ? (
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
                        <label className="text-sm text-gray-300 block mb-2">Check in</label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 block mb-2">Check out</label>
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
                    {isRangeBooking && (
                      <div className="mb-2 text-xs text-gray-300 bg-[#1C1C1C] p-2 rounded-lg">
                        {!rangeStartDate
                          ? "Select a start date"
                          : !rangeEndDate
                            ? `From ${rangeStartDate.toLocaleDateString()} - Now select an end date`
                            : `Selected range: ${rangeStartDate.toLocaleDateString()} - ${rangeEndDate.toLocaleDateString()}`}
                      </div>
                    )}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`} className="opacity-0 h-10 sm:h-12"></div>
                        const dateStr = day.toISOString().split("T")[0]
                        const hasShiftBooked = shifts[dateStr] !== undefined
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6
                        const isSelected = isInSelectedRange(day)

                        return (
                          <div
                            key={dateStr}
                            className={`
                              relative text-center p-1 sm:p-2 rounded-md text-xs sm:text-sm cursor-pointer h-10 sm:h-12 flex flex-col items-center justify-center
                              ${hasShiftBooked ? "bg-blue-600/40" : ""}
                              ${isSelected ? "bg-green-600/40 border border-green-500" : ""}
                              ${isWeekend ? "text-gray-500" : ""}
                              ${
                                !hasShiftBooked && !isSelected
                                  ? "hover:bg-gray-700"
                                  : hasShiftBooked
                                    ? "hover:bg-blue-600/60"
                                    : ""
                              }
                            `}
                            onClick={() => handleDateClick(day)}
                          >
                            <span>{day.getDate()}</span>
                            {hasShiftBooked && (
                              <div className="absolute bottom-0 left-0 right-0 text-[8px] sm:text-[10px] text-center pb-0.5 px-0.5 truncate">
                                {shifts[dateStr]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-4 bg-[#141414] rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">Scheduled Shifts</h3>
                    {Object.keys(shifts).length > 0 ? (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {Object.entries(shifts).map(([dateStr, period]) => {
                          const date = new Date(dateStr)
                          return (
                            <div
                              key={dateStr}
                              className="flex justify-between text-sm items-center p-2 bg-[#1C1C1C] rounded-lg hover:bg-[#242424] cursor-pointer"
                              onClick={() => {
                                setSelectedDate(date)
                                const [start, end] = period.split("-")
                                setStartTime(start)
                                setEndTime(end)
                                setIsRangeBooking(false)
                                setShowShiftForm(true)
                              }}
                            >
                              <span>
                                {date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="font-medium">{period}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No shifts scheduled yet. Click on a date to add a shift.</p>
                    )}
                  </div>
                </>
              )
            ) : (
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
                    {staffMembers.map((staff) => (
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
                    <thead >
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
                  <p className="text-gray-400 text-sm">
                    Select a staff member from the left menu to manage their individual schedule.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffPlanningModal
