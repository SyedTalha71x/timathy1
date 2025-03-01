/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

function MiniCalendar({ onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateSelect(clickedDate);
  };

  // Format date to dd-mm-yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format: dd-mm-yyyy
  };
  const isSameDay = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };

  return (
    <div className="bg-[#000000] rounded-xl p-3 w-64">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="text-white hover:text-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-white text-sm font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-white hover:text-gray-300"
        >
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
          const day = i + 1;
          const currentDateObj = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const isToday = isSameDay(currentDateObj, today);
          const isSelected =
            selectedDate && isSameDay(currentDateObj, selectedDate);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center rounded-full text-xs
              ${
                isToday && !isSelected
                  ? "bg-orange-400 text-white"
                  : isSelected
                  ? "bg-[#3F74FF] text-white"
                  : "text-white hover:bg-gray-700"
              }
              transition-all duration-200
            `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;

