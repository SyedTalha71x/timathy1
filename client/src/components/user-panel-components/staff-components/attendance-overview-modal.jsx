/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

function AttendanceOverviewModal({ staffMembers, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const dummyAttendanceData = staffMembers.map((staff) => ({
    ...staff,
    checkIn: "09:00",
    checkOut: "17:00",
    hoursWorked: 8,
    checkInDate: "2024-01-15", // Added check-in date
  }))

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    if (period === "month") {
      setCurrentDate(new Date())
    } else if (period === "week") {
      setCurrentDate(new Date())
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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

  const calculateTotalHours = (staff) => {
    const daysInPeriod = selectedPeriod === "month" ? 30 : selectedPeriod === "week" ? 7 : 1
    return staff.hoursWorked * daysInPeriod
  }

  const filteredStaff =
    selectedStaffId === "all"
      ? dummyAttendanceData
      : dummyAttendanceData.filter((staff) => staff.id === Number.parseInt(selectedStaffId))

  const exportToCSV = () => {
    const headers = ["Name", "Check In Date", "Check In", "Check Out", "Hours Worked", "Total Hours (Period)"]
    const csvContent = [
      headers.join(","),
      ...filteredStaff.map((staff) =>
        [
          `"${staff.firstName} ${staff.lastName}"`,
          staff.checkInDate,
          staff.checkIn,
          staff.checkOut,
          staff.hoursWorked,
          calculateTotalHours(staff),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_overview_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV file downloaded successfully")
  }

  const renderPeriodDisplay = () => {
    if (selectedPeriod === "month") {
      return (
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousMonth} className="p-1 bg-[#141414] rounded hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base min-w-[120px] text-center">
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <button onClick={goToNextMonth} className="p-1 bg-[#141414] rounded hover:bg-gray-700">
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
          <button onClick={goToPreviousWeek} className="p-1 bg-[#141414] rounded hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base min-w-[200px] text-center">
            <div>{showThisWeek ? "This Week" : `Week ${weekNumber}`}</div>
            <div className="text-xs text-gray-400">
              {weekRange.start.toLocaleDateString()} - {weekRange.end.toLocaleDateString()}
            </div>
          </div>
          <button onClick={goToNextWeek} className="p-1 bg-[#141414] rounded hover:bg-gray-700">
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
          className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
        />
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attendance Overview</h2>
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
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
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
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          {renderPeriodDisplay()}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-sm md:text-base">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Check In Date</th>
                <th className="text-left py-2">Check In</th>
                <th className="text-left py-2">Check Out</th>
                <th className="text-left py-2">Hours Worked</th>
                <th className="text-left py-2">Total Hours (Period)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="text-sm md:text-base">
                  <td className="py-2">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-2">{new Date(staff.checkInDate).toLocaleDateString()}</td>
                  <td className="py-2">{staff.checkIn}</td>
                  <td className="py-2">{staff.checkOut}</td>
                  <td className="py-2">{staff.hoursWorked}</td>
                  <td className="py-2">{calculateTotalHours(staff)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 cursor-pointer text-white px-8 py-2 rounded-xl text-sm w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AttendanceOverviewModal
