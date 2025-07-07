/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { ChevronLeft, ChevronRight, X } from "lucide-react"
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
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  
    const goToPreviousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }
  
    const goToNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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
      setIsRangeBooking(false)
    }
  
    const handleDateClick = (date) => {
      if (isRangeBooking) {
        if (!startDate) {
          setStartDate(date.toISOString().split("T")[0])
        } else if (!endDate && date >= new Date(startDate)) {
          setEndDate(date.toISOString().split("T")[0])
          setSelectedDate(new Date(startDate))
          const dateStr = startDate
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
      if (isRangeBooking && startDate && endDate) {
        const newShifts = { ...shifts }
        const currentDate = new Date(startDate)
        const endDateObj = new Date(endDate)
        while (currentDate <= endDateObj) {
          const dateStr = currentDate.toISOString().split("T")[0]
          newShifts[dateStr] = shiftPeriod
          currentDate.setDate(currentDate.getDate() + 1)
        }
        setShifts(newShifts)
        setShowShiftForm(false)
        toast.success(
          `Shifts saved from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
        )
        setStartDate("")
        setEndDate("")
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
      if (isRangeBooking && startDate && endDate) {
        const newShifts = { ...shifts }
        const currentDate = new Date(startDate)
        const endDateObj = new Date(endDate)
        while (currentDate <= endDateObj) {
          const dateStr = currentDate.toISOString().split("T")[0]
          delete newShifts[dateStr]
          currentDate.setDate(currentDate.getDate() + 1)
        }
        setShifts(newShifts)
        setShowShiftForm(false)
        toast.success(
          `Shifts deleted from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
        )
        setStartDate("")
        setEndDate("")
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
    }
  
    const hasShift = (date) => {
      const dateStr = date.toISOString().split("T")[0]
      return shifts[dateStr] !== undefined
    }
  
    const isInSelectedRange = (date) => {
      if (!startDate || !date) return false
      const startDateObj = new Date(startDate)
      if (!endDate) return date.getTime() === startDateObj.getTime()
      const endDateObj = new Date(endDate)
      return date >= startDateObj && date <= endDateObj
    }
  
    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  
    const formatDateRange = () => {
      if (!startDate) return "Select start date"
      if (!endDate) return `From ${new Date(startDate).toLocaleDateString()} - Select end date`
      return `From ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
    }
  
    return (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 ">
        <div className="bg-[#181818] text-white rounded-xl p-4 md:p-6 w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Employee Planning</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-h-[60vh] overflow-y-auto">
            <div className="w-full md:w-1/4 mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Staff</h3>
              <div className="bg-[#141414] rounded-xl p-2 max-h-[500px] overflow-y-auto">
                <ul className="space-y-1">
                  {staffMembers.map((staff) => (
                    <li
                      key={staff.id}
                      className={`cursor-pointer p-2 rounded-lg text-sm
                        ${selectedStaff?.id === staff.id ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
                      onClick={() => handleStaffSelect(staff)}
                    >
                      {staff.firstName} {staff.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full md:w-3/4">
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
                            <div className="relative">
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-300 block mb-2">End Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm text-gray-300 block mb-2">Date</label>
                          <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">{formatDate(selectedDate)}</div>
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
                      {(isRangeBooking ? startDate && endDate : hasShift(selectedDate)) && (
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
                          {!startDate
                            ? "Select a start date"
                            : !endDate
                              ? "Now select an end date"
                              : `Selected range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
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
                                ${!hasShiftBooked && !isSelected ? "hover:bg-gray-700" : hasShiftBooked ? "hover:bg-blue-600/60" : ""}
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
                                  {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
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
                <div className="bg-[#141414] rounded-xl p-6 flex items-center justify-center h-[400px]">
                  <p className="text-gray-400">Select a staff member to view and edit their schedule.</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  export default EmployeePlanningModal
  