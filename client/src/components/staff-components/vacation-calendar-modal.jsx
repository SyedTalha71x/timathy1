"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Calendar, ChevronLeft, ChevronRight, X, History, Eye } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

function VacationCalendarModal({ staffMember, onClose, onSubmit, isEmbedded = false }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [vacationRequests, setVacationRequests] = useState([])
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showVacationJournal, setShowVacationJournal] = useState(false)

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
    const start = new Date(startDate)
    const end = new Date(endDate)
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
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "pending",
      requestDate: new Date(),
      reason: "Vacation request",
    }
    setBookedVacations([...bookedVacations, newVacation])
    onSubmit(staffMember.id, startDate, endDate)
    setShowRequestForm(false)
    setShowConfirmDialog(false)
    toast.success("Vacation request submitted successfully")
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    if (!startDate) {
      setStartDate(date.toISOString().split("T")[0])
    } else if (!endDate && date >= new Date(startDate)) {
      setEndDate(date.toISOString().split("T")[0])
      setShowRequestForm(true)
    } else {
      setStartDate(date.toISOString().split("T")[0])
      setEndDate("")
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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

  const formatDateName = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
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
                  <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">Pending</span>
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

  const containerClass = isEmbedded
    ? "w-full h-full"
    : "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"

  const modalClass = isEmbedded
    ? "bg-transparent text-white p-0 w-full h-full overflow-y-auto"
    : "bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"

  return (
    <div className={containerClass}>
      <div className={modalClass}>
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
            </div>
            <div className="flex gap-4 justify-center">
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
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full"
                />
                {startDate && <p className="text-xs text-gray-400 mt-1">{formatDateName(startDate)}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full"
                />
                {endDate && <p className="text-xs text-gray-400 mt-1">{formatDateName(endDate)}</p>}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Vacation Calendar</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVacationJournal(true)}
                  className="text-gray-300 hover:text-white p-2 bg-[#1C1C1C] rounded-lg"
                  title="View Vacation Journal"
                >
                  <History size={16} />
                </button>
                {!isEmbedded && (
                  <button onClick={onClose} className="text-gray-300 hover:text-white">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousMonth} className="text-gray-300 hover:text-white p-2">
                  <ChevronLeft size={20} />
                </button>
                <h3 className="font-medium text-lg">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <button onClick={goToNextMonth} className="text-gray-300 hover:text-white p-2">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) return <div key={index} className="opacity-0 h-10 sm:h-12"></div>

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
                  const isSelected =
                    (startDate && day.toISOString().split("T")[0] === startDate) ||
                    (endDate && day.toISOString().split("T")[0] === endDate)

                  return (
                    <div
                      key={index}
                      className={`
                        relative text-center p-1 sm:p-2 rounded-md text-xs sm:text-sm h-10 sm:h-12 flex items-center justify-center
                        ${isClosing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "cursor-pointer"}
                        ${hasMyPending && !isClosing ? "bg-orange-500/30" : ""}
                        ${hasMyApproved && !isClosing ? "bg-green-500/30" : ""}
                        ${isSelected && !isClosing ? "bg-blue-500/50 border border-blue-400" : ""}
                        ${!hasMyPending && !hasMyApproved && !isSelected && !isClosing ? "hover:bg-blue-600/20" : ""}
                      `}
                      onClick={() => !isClosing && handleDateClick(day)}
                    >
                      <span>{day.getDate()}</span>
                      {(hasMyPending || hasMyApproved || hasColleagueBookings) && !isClosing && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
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
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500/30 rounded-sm mr-2"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500/30 rounded-sm mr-2"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500/30 rounded-sm mr-2"></div>
                  <span>Colleagues</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm mr-2"></div>
                  <span>Closed</span>
                </div>
              </div>
              <div className="mt-4 bg-[#141414] rounded-lg p-3">
                <p className="text-sm text-gray-300">
                  Vacation Days: <span className="font-bold text-white">{remainingVacationDays}</span> remaining
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VacationCalendarModal
