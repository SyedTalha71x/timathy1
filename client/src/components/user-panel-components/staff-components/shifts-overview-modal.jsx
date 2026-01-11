/* eslint-disable react/prop-types */

import { ChevronLeft, ChevronRight, Download, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

function ShiftsOverviewModal({ staffMembers, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Dummy shifts data
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
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shifts Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-gray-700 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <X size={20} />
            </button>
          </div>
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

        <div className="mt-6 bg-[#141414] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
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
      </div>
    </div>
  )
}

export default ShiftsOverviewModal
