/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

function EmployeePlanningModal({ staffMembers, onClose }) {
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

  // Overview states
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentOverviewMonth, setCurrentOverviewMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Dummy shifts data for overview
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
      ? dummyShiftsData
      : dummyShiftsData.filter((staff) => staff.id === Number.parseInt(selectedStaffId))

  const exportToCSV = () => {
    const headers = ["Staff Name", "Date", "Start Time", "End Time", "Hours Worked", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredStaff.flatMap((staff) =>
        staff.shifts.map((shift) =>
          [
            `"${staff.firstName} ${staff.lastName}"`,
            shift.date,
            shift.startTime,
            shift.endTime,
            shift.hoursWorked,
            shift.status,
          ].join(","),
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `shifts_overview_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV file downloaded successfully")
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
      toast.error("Please enter both start and end times")
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

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] text-white rounded-xl p-4 md:p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Employee Planning</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
            <h3 className="text-lg font-semibold mb-2">Staff</h3>
            <div className="bg-[#141414] rounded-xl p-2 max-h-[500px] overflow-y-auto">
              <ul className="space-y-1">
                {staffMembers.map((staff) => (
                  <li
                    key={staff.id}
                    className={`cursor-pointer p-2 rounded-lg text-sm ${
                      selectedStaff?.id === staff.id ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleStaffSelect(staff)}
                  >
                    {staff.firstName} {staff.lastName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            {selectedStaff ? (
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
                      <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                    <button
                      onClick={() => setShowShiftForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm ml-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#141414] rounded-xl p-4">
                    <div className="flex md:justify-between md:flex-row gap-3 justify-center flex-col items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Schedule for {selectedStaff.firstName} {selectedStaff.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
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
                        className={`text-xs px-3 py-1 rounded-lg ${
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
                        if (!day) return <div key={`empty-${index}`} className="opacity-0"></div>
                        const dateStr = day.toISOString().split("T")[0]
                        const hasShiftBooked = shifts[dateStr] !== undefined
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6
                        const isSelected = isInSelectedRange(day)

                        return (
                          <div
                            key={dateStr}
                            className={`
                              relative text-center p-2 rounded-md text-sm cursor-pointer
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
                              <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center pb-0.5 px-0.5 truncate">
                                {shifts[dateStr]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSaveAllShifts}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Save All Shifts
                      </button>
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
              // Shifts Overview when no staff is selected
              <div className="bg-[#141414] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Shifts Overview</h3>
                  <button
                    onClick={exportToCSV}
                    className="bg-gray-700 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </button>
                </div>

                <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
                  >
                    <option value="all">All Staff Members</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.firstName} {staff.lastName}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                  {renderPeriodDisplay()}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-[#1C1C1C] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="text-sm md:text-base border-b border-gray-700">
                        <th className="text-left py-3">Staff Name</th>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Start Time</th>
                        <th className="text-left py-3">End Time</th>
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
                                className={`px-2 py-1 rounded text-xs ${
                                  shift.status === "completed"
                                    ? "bg-green-600 text-white"
                                    : shift.status === "scheduled"
                                      ? "bg-blue-600 text-white"
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
                    Select a staff member from the left to manage their individual schedule.
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

export default EmployeePlanningModal
