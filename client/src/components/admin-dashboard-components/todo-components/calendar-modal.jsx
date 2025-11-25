/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Clock, Bell, Repeat, X } from "lucide-react";

const CalendarModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDate = "", 
  initialTime = "",
  initialReminder = "",
  initialRepeat = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(initialDate);
  const [tempTime, setTempTime] = useState(initialTime);
  const [tempReminder, setTempReminder] = useState(initialReminder);
  const [tempRepeat, setTempRepeat] = useState(initialRepeat);
  const [showCustomReminder, setShowCustomReminder] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customUnit, setCustomUnit] = useState("Minutes");
  const [repeatEndType, setRepeatEndType] = useState("never");
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [repeatOccurrences, setRepeatOccurrences] = useState("");

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setTempDate(initialDate);
      setTempTime(initialTime);
      setTempReminder(initialReminder);
      setTempRepeat(initialRepeat);
    }
  }, [isOpen, initialDate, initialTime, initialReminder, initialRepeat]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setTempDate(dateStr);
  };

  const handleTimeChange = (time) => {
    setTempTime(time);
    if (time && !tempReminder) {
      setTempReminder("On time");
    }
  };

  const handleReminderChange = (reminder) => {
    setTempReminder(reminder);
    if (reminder === "Custom") {
      setShowCustomReminder(true);
    } else {
      setShowCustomReminder(false);
    }
  };

  const handleOK = () => {
    const result = {
      date: tempDate,
      time: tempTime,
      reminder: tempReminder,
      repeat: tempRepeat,
      customReminder: showCustomReminder ? { value: customValue, unit: customUnit } : null,
      repeatEnd: tempRepeat ? {
        type: repeatEndType,
        date: repeatEndDate,
        occurrences: repeatOccurrences
      } : null
    };
    
    onSave(result);
    onClose();
  };

  const handleClear = () => {
    setTempDate("");
    setTempTime("");
    setTempReminder("");
    setTempRepeat("");
    setCustomValue("");
    
    const result = {
      date: "",
      time: "",
      reminder: "",
      repeat: "",
      customReminder: null,
      repeatEnd: null
    };
    
    onSave(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2F2F2F] rounded-xl shadow-lg z-90 p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">Set Date & Time</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Calendar Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="text-white hover:text-gray-300 p-1"
            >
              ←
            </button>
            <span className="text-white font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="text-white hover:text-gray-300 p-1"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="text-center text-gray-400 text-sm p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={index} className="p-1"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = tempDate === dateStr;
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`p-1 text-sm rounded hover:bg-gray-600 ${
                    isSelected ? "bg-blue-600 text-white" : "text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time, Reminder, and Repeat Sections */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm w-16">Time:</span>
            <select
              value={tempTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">Select time</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Bell size={16} className="text-gray-400" />
            <span className="text-sm w-16">Reminder:</span>
            <select
              value={tempReminder}
              onChange={(e) => handleReminderChange(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">None</option>
              <option value="On time">On time</option>
              <option value="5 minutes before">5 minutes before</option>
              <option value="15 minutes before">15 minutes before</option>
              <option value="30 minutes before">30 minutes before</option>
              <option value="1 hour before">1 hour before</option>
              <option value="1 day before">1 day before</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {showCustomReminder && (
            <div className="flex items-center gap-2 text-white ml-6">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm w-16"
                placeholder="30"
                min="1"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm"
              >
                <option value="Minutes">Minutes</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
              </select>
              <span className="text-sm text-gray-400">ahead</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-white">
            <Repeat size={16} className="text-gray-400" />
            <span className="text-sm w-16">Repeat:</span>
            <select
              value={tempRepeat}
              onChange={(e) => setTempRepeat(e.target.value)}
              className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-sm flex-1"
            >
              <option value="">Never</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {tempRepeat && tempRepeat !== "" && (
            <div className="ml-6 space-y-2">
              <div className="text-sm text-gray-200">Ends:</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="never"
                    checked={repeatEndType === "never"}
                    onChange={() => setRepeatEndType("never")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  Never
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="onDate"
                    checked={repeatEndType === "onDate"}
                    onChange={() => setRepeatEndType("onDate")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  On date:
                  <input
                    type="date"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                    onClick={() => setRepeatEndType("onDate")}
                    className="bg-[#1C1C1C] text-white px-2 py-1 rounded text-xs ml-1"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="after"
                    checked={repeatEndType === "after"}
                    onChange={() => setRepeatEndType("after")}
                    className="form-radio h-3 w-3 text-[#FF843E]"
                  />
                  After
                  <input
                    type="number"
                    value={repeatOccurrences}
                    onChange={(e) => setRepeatOccurrences(e.target.value)}
                    onClick={() => setRepeatEndType("after")}
                    min="1"
                    className="w-16 bg-[#1C1C1C] text-white px-2 py-1 rounded text-xs ml-1"
                  />
                  occurrences
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button 
            onClick={handleClear} 
            className="px-4 py-2 text-gray-300 hover:text-white text-sm"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleOK} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;