/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Calendar, ChevronLeft, ChevronRight, X, History, Eye, Trash2 } from 'lucide-react'
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

// helper to format date to YYYY-MM-DD using local time (avoids timezone off-by-one)
function formatLocalYMD(date) {
  if (!date) return ""
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Helper function to create striped background
const createStripedBackground = (color) => {
  return {
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, ${color}40 5px, ${color}40 10px)`,
    backgroundColor: `${color}20`
  }
}

function VacationCalendarModal({ staffMember, onClose, onSubmit, isEmbedded = false, staffMembers = [], isStaffPlanning = false, isStandalone = false }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [showCalendar, setShowCalendar] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showVacationJournal, setShowVacationJournal] = useState(false)
  // Simplified view state - only monthly or yearly
  const [calendarView, setCalendarView] = useState((isStaffPlanning || isStandalone) ? "yearly" : "monthly")
  const [calendarSize, setCalendarSize] = useState(0)

  // Reset calendar size when embedded to prevent zoom issues
  useEffect(() => {
    if (isEmbedded) {
      setCalendarSize(0)
    }
  }, [isEmbedded])

  const [bookedVacations, setBookedVacations] = useState([
    {
      id: 1,
      staffId: 1,
      startDate: new Date(2024, 0, 5),
      endDate: new Date(2024, 0, 10),
      status: "approved",
      requestDate: new Date(2023, 11, 15),
      approvedBy: "Manager",
      reason: "Family vacation",
    },
    {
      id: 2,
      staffId: 1,
      startDate: new Date(2024, 1, 15),
      endDate: new Date(2024, 1, 20),
      status: "pending",
      requestDate: new Date(2024, 1, 1),
      reason: "Personal time",
    },
    {
      id: 3,
      staffId: 2,
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 3, 5),
      status: "pending",
      requestDate: new Date(2024, 2, 15),
      reason: "Medical appointment",
    },
    {
      id: 4,
      staffId: 2,
      startDate: new Date(2023, 11, 20),
      endDate: new Date(2023, 11, 25),
      status: "approved",
      requestDate: new Date(2023, 10, 20),
      approvedBy: "HR Manager",
      reason: "Holiday break",
    },
  ])

  // Closing days and public holidays (example dates)
  const closingDays = [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 0, 1), // New Year
    new Date(2024, 6, 4), // Independence Day
  ]

  const usedVacationDays = 5 // Dummy calculation
  const remainingVacationDays = (staffMember?.vacationEntitlement || 30) - usedVacationDays

  const calculateVacationDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate + "T00:00:00")
    const end = new Date(endDate + "T00:00:00")
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const vacationDaysToBook = calculateVacationDays()
  const remainingAfterBooking = remainingVacationDays - vacationDaysToBook

  const handleSubmit = () => {
    setShowConfirmDialog(true)
  }

  const confirmSubmit = () => {
    const newVacation = {
      id: bookedVacations.length + 1,
      staffId: staffMember.id,
      startDate: new Date(startDate + "T00:00:00"),
      endDate: new Date(endDate + "T00:00:00"),
      status: "pending",
      requestDate: new Date(),
      reason: reason || "Vacation request",
    }
    setBookedVacations([...bookedVacations, newVacation])
    onSubmit(staffMember.id, startDate, endDate)
    setShowRequestForm(false)
    setShowConfirmDialog(false)
    setReason("")
    toast.success("Vacation request submitted successfully")
  }

  const handleDateClick = (date) => {
    // Don't allow date selection in staff planning mode or yearly view
    if (isStaffPlanning || calendarView === "yearly") return
    
    setSelectedDate(date)
    const ymd = formatLocalYMD(date)
    if (!startDate) {
      setStartDate(ymd)
    } else if (!endDate && new Date(ymd + "T00:00:00") >= new Date(startDate + "T00:00:00")) {
      setEndDate(ymd)
      setShowRequestForm(true)
    } else {
      setStartDate(ymd)
      setEndDate("")
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToPreviousYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))
  }

  const goToNextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))
  }

  const isClosingDay = (date) => {
    return closingDays.some(
      (closingDay) =>
        closingDay.getDate() === date.getDate() &&
        closingDay.getMonth() === date.getMonth() &&
        closingDay.getFullYear() === date.getFullYear(),
    )
  }

  const getDateBookings = (date) => {
    return bookedVacations.filter((vacation) => {
      const vacationStart = new Date(vacation.startDate)
      const vacationEnd = new Date(vacation.endDate)
      return date >= vacationStart && date <= vacationEnd
    })
  }

  // Fixed calendar generation functions
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.
    const days = []

    // Add empty days for the beginning of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  // Generate yearly table view with one month per line
  const generateYearlyTableView = () => {
    const year = currentMonth.getFullYear()
    const months = []
    
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)
      const daysInMonth = lastDayOfMonth.getDate()
      const firstDayOfWeek = firstDayOfMonth.getDay()
      const monthDays = []

      // Add empty days for the beginning of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        monthDays.push(null)
      }

      // Add all days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        monthDays.push(new Date(year, month, i))
      }

      months.push({
        name: firstDayOfMonth.toLocaleDateString("en-US", { month: "long" }),
        days: monthDays,
        monthIndex: month
      })
    }
    
    return months
  }

  const calendarDays = generateCalendarDays()
  const yearlyTableMonths = generateYearlyTableView()

  const formatDateName = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPastVacations = () => {
    const now = new Date()
    return bookedVacations.filter((vacation) => new Date(vacation.endDate) < now && vacation.status === "approved")
  }

  const getOngoingVacations = () => {
    const now = new Date()
    return bookedVacations.filter((vacation) => {
      const start = new Date(vacation.startDate)
      const end = new Date(vacation.endDate)
      return start <= now && end >= now && vacation.status === "approved"
    })
  }

  const getPendingVacations = () => {
    return bookedVacations.filter((vacation) => vacation.status === "pending")
  }

  const handleCancelPending = (vacationId) => {
    setBookedVacations(bookedVacations.filter((v) => v.id !== vacationId))
    toast.success("Pending request cancelled")
  }

  const getColleagueColors = () => {
    return staffMembers
      .filter((s) => s.id !== staffMember.id)
      .map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        color: s.indicatorColor || "#666666",
      }))
  }

  const renderVacationJournal = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vacation Journal</h3>
        <button onClick={() => setShowVacationJournal(false)} className="text-gray-400 hover:text-white">
          <Calendar size={20} />
        </button>
      </div>

      {/* Ongoing Vacations */}
      <div className="bg-[#1C1C1C] rounded-lg p-4">
        <h4 className="text-md font-semibold mb-3 text-green-400 flex items-center gap-2">
          <Eye size={16} />
          Ongoing Vacations
        </h4>
        {getOngoingVacations().length > 0 ? (
          <div className="space-y-2">
            {getOngoingVacations().map((vacation) => (
              <div key={vacation.id} className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-green-300">
                      {vacation.startDate.toLocaleDateString()} - {vacation.endDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300">{vacation.reason}</p>
                  </div>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No ongoing vacations</p>
        )}
      </div>

      {/* Pending Requests */}
      <div className="bg-[#1C1C1C] rounded-lg p-4">
        <h4 className="text-md font-semibold mb-3 text-orange-400 flex items-center gap-2">
          <Calendar size={16} />
          Pending Requests
        </h4>
        {getPendingVacations().length > 0 ? (
          <div className="space-y-2">
            {getPendingVacations().map((vacation) => (
              <div key={vacation.id} className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-orange-300">
                      {vacation.startDate.toLocaleDateString()} - {vacation.endDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300">{vacation.reason}</p>
                    <p className="text-xs text-gray-400">Requested: {vacation.requestDate.toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">Pending</span>
                    <button
                      onClick={() => handleCancelPending(vacation.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No pending requests</p>
        )}
      </div>

      {/* Past Vacations */}
      <div className="bg-[#1C1C1C] rounded-lg p-4">
        <h4 className="text-md font-semibold mb-3 text-blue-400 flex items-center gap-2">
          <History size={16} />
          Past Vacations
        </h4>
        {getPastVacations().length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getPastVacations().map((vacation) => (
              <div key={vacation.id} className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-blue-300">
                      {vacation.startDate.toLocaleDateString()} - {vacation.endDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300">{vacation.reason}</p>
                    <p className="text-xs text-gray-400">Approved by: {vacation.approvedBy}</p>
                  </div>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Completed</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No past vacations</p>
        )}
      </div>
    </div>
  )

  // Render yearly table view
  const renderYearlyTableView = () => {
    return (
      <div className="space-y-2">
        {yearlyTableMonths.map((monthData) => {
          const monthName = monthData.name
          const monthIndex = monthData.monthIndex
          
          return (
            <div key={`month-${monthIndex}`} className="flex items-start gap-4 bg-[#1C1C1C] rounded-lg p-3">
              {/* Month name - fixed width */}
              <div className="w-24 flex-shrink-0">
                <h4 className="text-sm font-semibold text-gray-300">{monthName}</h4>
              </div>
              
              {/* Calendar days */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                    // use a stable unique key per-month to avoid any potential reconciliation oddities
                    <div key={`weekday-${monthIndex}-${idx}`} className="text-center text-[10px] font-medium py-0.5 text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {monthData.days.map((day, index) => {
                    if (!day)
                      return <div key={`empty-${monthIndex}-${index}`} className="opacity-0 h-4"></div>

                    const bookings = getDateBookings(day)
                    const myPendingBookings = bookings.filter(
                      (b) => b.staffId === staffMember.id && b.status === "pending",
                    )
                    const myApprovedBookings = bookings.filter(
                      (b) => b.staffId === staffMember.id && b.status === "approved",
                    )
                    const colleagueBookings = bookings.filter((b) => b.staffId !== staffMember.id)
                    const hasMyPending = myPendingBookings.length > 0
                    const hasMyApproved = myApprovedBookings.length > 0
                    const hasColleagueBookings = colleagueBookings.length > 0
                    const isClosing = isClosingDay(day)

                    const dayStr = formatLocalYMD(day)
                    const isSelected = (startDate && dayStr === startDate) || (endDate && dayStr === endDate)

                    // Get staff color for this day's bookings
                    const getDayColor = () => {
                      if (hasMyPending) return "bg-orange-500/50"
                      if (hasMyApproved) return "bg-green-500/50"
                      if (hasColleagueBookings) {
                        // If multiple colleagues, use a generic color, otherwise use their specific color
                        const uniqueColleagues = [...new Set(colleagueBookings.map(b => b.staffId))]
                        if (uniqueColleagues.length === 1) {
                          const colleague = staffMembers.find(s => s.id === uniqueColleagues[0])
                          return colleague ? { backgroundColor: `${colleague.indicatorColor || '#666666'}50` } : "bg-gray-500/50"
                        }
                        return "bg-gray-500/50"
                      }
                      if (isClosing) return "bg-gray-600 text-gray-400"
                      return "bg-transparent"
                    }

                    const dayColor = getDayColor()

                    return (
                      <div
                        key={`day-${monthIndex}-${index}`}
                        className={`
                          relative text-center p-0.5 rounded text-[10px] h-4 flex items-center justify-center
                          ${isClosing ? "cursor-not-allowed" : isStaffPlanning ? "" : "cursor-pointer"}
                          ${typeof dayColor === 'string' ? dayColor : ''}
                          ${isSelected && !isClosing && !isStaffPlanning ? "bg-blue-500/50 border border-blue-400" : ""}
                        `}
                        style={typeof dayColor !== 'string' ? dayColor : {}}
                        onClick={() => !isClosing && !isStaffPlanning && calendarView !== "yearly" && handleDateClick(day)}
                        title={
                          hasMyPending ? "Your pending vacation" : 
                          hasMyApproved ? "Your approved vacation" :
                          hasColleagueBookings ? `${colleagueBookings.length} colleague(s) on vacation` :
                          isClosing ? "Closing day" : ""
                        }
                      >
                        <span className={`text-[8px] leading-none ${isClosing ? "text-gray-400" : "text-white"}`}>
                          {day.getDate()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const containerClass = isEmbedded
    ? "w-full h-full"
    : "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"

  // Responsive modal class with better scaling for embedded mode
  const modalClass = isEmbedded
    ? "bg-transparent text-white p-0 w-full h-full overflow-y-auto"
    : "bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"

  // Calculate scale - disable scaling in embedded mode to prevent overflow
  const scaleValue = isEmbedded ? 1 : (1 + calendarSize * 0.1)

  // Get staff indicator color
  const staffIndicatorColor = staffMember?.indicatorColor || "#3b82f6"

  return (
    <div className={containerClass}>
      <div 
        className={modalClass} 
        style={{ 
          transform: `scale(${scaleValue})`, 
          transformOrigin: "top center",
          // Prevent scaling from causing overflow in embedded mode
          maxWidth: isEmbedded ? '100%' : undefined,
          maxHeight: isEmbedded ? '100%' : undefined
        }}
      >
        {showConfirmDialog ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Vacation Request</h2>
            <p className="mb-4">Are you sure you want to submit your vacation request?</p>
            <div className="bg-[#141414] rounded-lg p-4 mb-4">
              <p>
                <strong>From:</strong> {formatDateName(startDate)}
              </p>
              <p>
                <strong>To:</strong> {formatDateName(endDate)}
              </p>
              <p>
                <strong>Days:</strong> {vacationDaysToBook}
              </p>
              <p>
                <strong>Remaining after booking:</strong> {remainingAfterBooking}
              </p>
              {reason && (
                <p>
                  <strong>Reason:</strong> {reason}
                </p>
              )}
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={confirmSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm">
                Yes, Submit
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showRequestForm ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request Vacation</h2>
              <button onClick={() => setShowRequestForm(false)} className="text-gray-300 hover:text-white">
                <Calendar className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 bg-[#141414] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-300">Current vacation days:</p>
                  <p className="font-bold text-white">{remainingVacationDays}</p>
                </div>
                <div>
                  <p className="text-gray-300">Days to book:</p>
                  <p className="font-bold text-white">{vacationDaysToBook}</p>
                </div>
                <div>
                  <p className="text-gray-300">Remaining after booking:</p>
                  <p className={`font-bold ${remainingAfterBooking >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {remainingAfterBooking}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm w-full"
                />
                {startDate && <p className="text-xs text-gray-400 mt-1">{formatDateName(startDate)}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm w-full"
                />
                {endDate && <p className="text-xs text-gray-400 mt-1">{formatDateName(endDate)}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Family Holiday, Medical Appointment"
                  className="bg-[#141414] text-sm rounded px-3 py-2 w-full"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm w-full"
                disabled={!startDate || !endDate || remainingAfterBooking < 0}
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowRequestForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl text-sm w-full"
              >
                Back to Calendar
              </button>
            </div>
          </>
        ) : showVacationJournal ? (
          renderVacationJournal()
        ) : (
          <>
            {/* Responsive Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">Vacation Calendar</h2>
                {staffMember && (
                  <p className="text-sm text-gray-400 truncate">
                    {staffMember.firstName} {staffMember.lastName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* Calendar view toggle - simplified to only monthly and yearly */}
                {!isStaffPlanning && (
                  <div className="flex gap-1 bg-[#1C1C1C] rounded-lg p-1 order-1 sm:order-none">
                    <button
                      onClick={() => setCalendarView("monthly")}
                      className={`px-3 py-1 rounded text-xs ${
                        calendarView === "monthly" ? "bg-blue-600 text-white" : "text-gray-300"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setCalendarView("yearly")}
                      className={`px-3 py-1 rounded text-xs ${
                        calendarView === "yearly" ? "bg-blue-600 text-white" : "text-gray-300"
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                )}

                {/* Calendar resize controls - hide in embedded mode and staff planning */}
                {!isEmbedded && !isStaffPlanning && calendarView === "monthly" && (
                  <div className="flex gap-1 bg-[#1C1C1C] rounded-lg p-1 order-2 sm:order-none">
                    <button
                      onClick={() => setCalendarSize(Math.max(0, calendarSize - 1))}
                      className="px-2 py-1 rounded text-xs hover:bg-gray-700"
                    >
                      −
                    </button>
                    <span className="px-2 py-1 text-xs text-gray-300">{Math.round((1 + calendarSize * 0.1) * 100)}%</span>
                    <button
                      onClick={() => setCalendarSize(Math.min(5, calendarSize + 1))}
                      className="px-2 py-1 rounded text-xs hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* History button - hide in staff planning mode */}
                {!isStaffPlanning && (
                  <button
                    onClick={() => setShowVacationJournal(true)}
                    className="text-gray-300 hover:text-white p-2 bg-[#1C1C1C] rounded-lg order-3 sm:order-none"
                    title="View Vacation Journal"
                  >
                    <History size={16} />
                  </button>
                )}

                {!isEmbedded && (
                  <button onClick={onClose} className="text-gray-300 hover:text-white order-4 sm:order-none">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              {/* key the calendar view container so React fully remounts it when the view changes.
                  This prevents DOM reconciliation edge-cases where repeated toggles could cause
                  duplicate header nodes to appear in some environments. */}
              <div key={calendarView}>
                {calendarView === "yearly" ? (
                  // Yearly Table View
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={goToPreviousYear} className="text-gray-300 hover:text-white p-2">
                        <ChevronLeft size={20} />
                      </button>
                      <h3 className="font-medium text-lg text-center px-2">{currentMonth.getFullYear()}</h3>
                      <button onClick={goToNextYear} className="text-gray-300 hover:text-white p-2">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    
                    {renderYearlyTableView()}
                    
                    {/* Legend for yearly view */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2 bg-orange-500/50"></div>
                        <span>Pending Vacation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2 bg-green-500/50"></div>
                        <span>Approved Vacation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2 bg-gray-500/50"></div>
                        <span>Colleagues</span>
                      </div>
                      {isStaffPlanning && staffMembers.map((staff) => (
                        <div key={staff.id} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-sm mr-2" 
                            style={{ backgroundColor: `${staff.indicatorColor || '#666666'}50` }}
                          ></div>
                          <span>{staff.firstName} {staff.lastName}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Monthly view
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={goToPreviousMonth} className="text-gray-300 hover:text-white p-2">
                        <ChevronLeft size={20} />
                      </button>
                      <h3 className="font-medium text-lg text-center px-2">
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </h3>
                      <button onClick={goToNextMonth} className="text-gray-300 hover:text-white p-2">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    
                    {/* Responsive calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                        <div key={`month-weekday-${day}`} className="text-center text-xs font-medium py-2 text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (!day) return <div key={`month-empty-${index}`} className="opacity-0 h-8 sm:h-10 md:h-12"></div>

                        const bookings = getDateBookings(day)
                        const myPendingBookings = bookings.filter(
                          (b) => b.staffId === staffMember.id && b.status === "pending",
                        )
                        const myApprovedBookings = bookings.filter(
                          (b) => b.staffId === staffMember.id && b.status === "approved",
                        )
                        const colleagueBookings = bookings.filter((b) => b.staffId !== staffMember.id)
                        const hasMyPending = myPendingBookings.length > 0
                        const hasMyApproved = myApprovedBookings.length > 0
                        const hasColleagueBookings = colleagueBookings.length > 0
                        const isClosing = isClosingDay(day)

                        const dayStr = formatLocalYMD(day)
                        const isSelected = (startDate && dayStr === startDate) || (endDate && dayStr === endDate)

                        return (
                          <div
                            key={`month-day-${index}`}
                            className={`
                              relative text-center p-1 rounded-md text-xs h-8 sm:h-10 md:h-12 flex items-center justify-center
                              ${isClosing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "cursor-pointer"}
                              ${hasMyPending && !isClosing ? "bg-orange-500/30" : ""}
                              ${hasMyApproved && !isClosing ? "bg-green-500/30" : ""}
                              ${isSelected && !isClosing ? "bg-blue-500/50 border border-blue-400" : ""}
                              ${!hasMyPending && !hasMyApproved && !isSelected && !isClosing ? "hover:bg-blue-600/20" : ""}
                            `}
                            onClick={() => !isClosing && handleDateClick(day)}
                            title={hasMyPending ? "Pending vacation" : ""}
                          >
                            <span className="text-xs sm:text-sm">{day.getDate()}</span>
                            {(hasMyPending || hasMyApproved || hasColleagueBookings) && !isClosing && (
                              <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-0.5">
                                {hasMyPending && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500"></div>}
                                {hasMyApproved && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500"></div>}
                                {hasColleagueBookings && (
                                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-500"></div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Responsive legend - only show when not in staff planning mode */}
              {!isStaffPlanning && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2" 
                      style={createStripedBackground(staffIndicatorColor)}
                    ></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2" 
                      style={{ backgroundColor: staffIndicatorColor }}
                    ></div>
                    <span>Approved</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm mr-2 bg-gray-500"></div>
                    <span>Colleagues</span>
                  </div>
                </div>
              )}

              {/* Colleague colors - responsive */}
              {getColleagueColors().length > 0 && (
                <div className="mt-4 bg-[#141414] rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-300 mb-2">Colleagues</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {getColleagueColors().map((colleague) => (
                      <div key={colleague.id} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: colleague.color }}
                        ></div>
                        {isStaffPlanning && (
                          <span className="text-gray-300 truncate">{colleague.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isStaffPlanning && (
                <div className="mt-4 bg-[#141414] rounded-lg p-3">
                  <p className="text-sm text-gray-300">
                    Vacation Days: <span className="font-bold text-white">{remainingVacationDays}</span> remaining
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VacationCalendarModal