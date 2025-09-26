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
    <div className="bg-[#000000] rounded-xl p-4 w-full md:w-78 max-w-xs mx-auto">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handlePrevMonth}
          className="text-white hover:text-gray-300 p-1"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-white text-sm font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-white hover:text-gray-300 p-1"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => (
          <div key={day} className="text-gray-400 font-medium text-xs py-1">
            {day.charAt(0)}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-8" />
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
              className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200 hover:bg-gray-800 ${
                isToday && !isSelected
                  ? "bg-white text-blue-600 font-semibold"
                  : isSelected
                  ? "bg-[#3F74FF] text-white"
                  : "text-white"
              }`}
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