/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

function MiniCalendar({ onDateSelect, selectedDate, externalDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  // Sync with external date (from main calendar)
  useEffect(() => {
    if (externalDate) {
      const extDate = new Date(externalDate);
      // Only update if month or year changed
      if (extDate.getMonth() !== currentDate.getMonth() || 
          extDate.getFullYear() !== currentDate.getFullYear()) {
        setCurrentDate(new Date(extDate.getFullYear(), extDate.getMonth(), 1));
      }
    }
  }, [externalDate]);
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const daysInPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();
  
  // Get the first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonthRaw = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  
  // Convert to Monday-based (Monday = 0, Tuesday = 1, ..., Sunday = 6)
  const firstDayOfMonth = firstDayOfMonthRaw === 0 ? 6 : firstDayOfMonthRaw - 1;
  
  // Days starting from Monday
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
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
  
  const handleDateClick = (day, monthOffset = 0) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );
    onDateSelect(clickedDate);
  };
  
  // Format date to dd-mm-yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const isSameDay = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };
  
  // Generate calendar days including prev/next month days
  const generateCalendarDays = () => {
    const calendarDays = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      calendarDays.push({
        day,
        monthOffset: -1,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        monthOffset: 0,
        isCurrentMonth: true
      });
    }
    
    // Next month days (fill to 42 total = 6 rows)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        monthOffset: 1,
        isCurrentMonth: false
      });
    }
    
    return calendarDays;
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="bg-[#000000] rounded-xl lg:block md:block hidden p-3 w-full">
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        <button
          onClick={handlePrevMonth}
          className="text-white hover:text-gray-300 p-0.5 flex items-center justify-center"
        >
          <ChevronLeft size={14} />
        </button>
        <h2 className="text-white text-xs font-semibold col-span-5 text-center">
          {currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-white hover:text-gray-300 p-0.5 flex items-center justify-center"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((day) => (
          <div key={day} className="text-gray-400 font-medium text-[10px] py-0.5">
            {day.charAt(0)}
          </div>
        ))}
        
        {calendarDays.map((dateInfo, index) => {
          const dateObj = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + dateInfo.monthOffset,
            dateInfo.day
          );
          const isToday = isSameDay(dateObj, today);
          const isSelected = selectedDate && isSameDay(dateObj, selectedDate);
          
          return (
            <button
              key={`${dateInfo.monthOffset}-${dateInfo.day}-${index}`}
              onClick={() => handleDateClick(dateInfo.day, dateInfo.monthOffset)}
              className={`h-6 w-6 flex items-center justify-center rounded-lg text-[11px] font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-orange-500 text-white"
                  : isToday
                  ? "bg-orange-500/30 text-orange-400"
                  : dateInfo.isCurrentMonth
                  ? "text-gray-300 hover:bg-[#2F2F2F]"
                  : "text-gray-600 hover:bg-[#2F2F2F]"
              }`}
            >
              {dateInfo.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;
