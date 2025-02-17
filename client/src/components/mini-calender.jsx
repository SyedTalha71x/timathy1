/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MiniCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect(selectedDate)
  }

  return (
    <div className="bg-[#000000] rounded-xl p-3 w-64">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="text-white hover:text-gray-300">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-white text-sm font-semibold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth} className="text-white hover:text-gray-300">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => (
          <div key={day} className="text-gray-400 font-medium">
            {day.charAt(0)}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday =
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center rounded-full text-xs
                ${isToday ? "bg-blue-500 text-white" : "text-white hover:bg-gray-700"}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MiniCalendar

