/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Clock, Bell, Repeat, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ConfirmationModal from "./confirmation-modal";

const CalendarModal = ({
  isOpen,
  onClose,
  onSave,
  initialDate = "",
  initialTime = "",
  initialReminder = "",
  initialRepeat = "",
  initialCustomReminder = null,
  initialRepeatEnd = null
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showClearConfirmation, setShowClearConfirmation] = useState(false)
  
  // Mobile collapsible sections - collapsed by default
  const [isReminderExpanded, setIsReminderExpanded] = useState(false)
  const [isRepeatExpanded, setIsRepeatExpanded] = useState(false)

  const [tempDate, setTempDate] = useState(initialDate);
  const [tempTime, setTempTime] = useState(initialTime);
  const [tempReminder, setTempReminder] = useState(initialReminder);
  const [tempRepeat, setTempRepeat] = useState(initialRepeat);
  const [showCustomReminder, setShowCustomReminder] = useState(false);
  const [customValue, setCustomValue] = useState(initialCustomReminder?.value || "");
  const [customUnit, setCustomUnit] = useState(initialCustomReminder?.unit || "Minutes");
  const [repeatEndType, setRepeatEndType] = useState(initialRepeatEnd?.type || "never");
  const [repeatEndDate, setRepeatEndDate] = useState(initialRepeatEnd?.date || "");
  const [repeatOccurrences, setRepeatOccurrences] = useState(initialRepeatEnd?.occurrences || "");

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setTempDate(initialDate || "");
      setTempTime(initialTime || "");
      setTempReminder(initialReminder || "");
      setTempRepeat(initialRepeat || "");

      // Handle custom reminder
      if (initialReminder === "Custom") {
        setShowCustomReminder(true);
        setCustomValue(initialCustomReminder?.value || "");
        setCustomUnit(initialCustomReminder?.unit || "Minutes");
      } else {
        setShowCustomReminder(false);
      }

      // Handle repeat end settings
      if (initialRepeatEnd) {
        setRepeatEndType(initialRepeatEnd.type || "never");
        setRepeatEndDate(initialRepeatEnd.date || "");
        setRepeatOccurrences(initialRepeatEnd.occurrences || "");
      } else {
        setRepeatEndType("never");
        setRepeatEndDate("");
        setRepeatOccurrences("");
      }

      // Set current date to selected date if it exists
      if (initialDate) {
        const dateParts = initialDate.split('-');
        if (dateParts.length === 3) {
          setCurrentDate(new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          ));
        }
      }
      
      // Expand sections if they have values, otherwise collapse on mobile
      setIsReminderExpanded(!!initialReminder && initialReminder !== "")
      setIsRepeatExpanded(!!initialRepeat && initialRepeat !== "")
    } else {
      // Reset collapsed state when modal closes
      setIsReminderExpanded(false)
      setIsRepeatExpanded(false)
    }
  }, [isOpen, initialDate, initialTime, initialReminder, initialRepeat, initialCustomReminder, initialRepeatEnd]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Highlight the selected date on the calendar
  const getDayClassName = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isSelected = tempDate === dateStr;
    const isToday = dateStr === new Date().toISOString().split('T')[0];

    let className = "w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 ";

    if (isSelected) {
      className += "bg-orange-500 text-white font-medium";
    } else if (isToday) {
      className += "bg-orange-500/30 text-orange-400 font-medium";
    } else {
      className += "text-content-secondary hover:bg-surface-button";
    }

    return className;
  };

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


  if (!isOpen) return null;


  const handleClear = () => {
    setShowClearConfirmation(true)
  }


  const confirmClear = () => {
    setTempDate("")
    setTempTime("")
    setTempReminder("")
    setTempRepeat("")
    setCustomValue("")
    setShowCustomReminder(false)
    setRepeatEndType("never")
    setRepeatEndDate("")
    setRepeatOccurrences("")
    setShowClearConfirmation(false)
    // Reset calendar view to current month
    setCurrentDate(new Date())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-2 md:p-4 pt-8 md:pt-4">
      {/* Modal Container - Flex column with fixed footer */}
      <div className="bg-surface-card rounded-xl shadow-lg w-full max-w-md max-h-[95vh] md:max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-4 md:p-6 pb-4 md:pb-5 flex-shrink-0 border-b border-border">
          <h2 className="text-content-primary text-lg font-semibold">Date & Time</h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-4">
          {/* Calendar Section */}
          <div className="mb-5 bg-surface-dark rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="text-content-muted hover:text-content-primary p-1.5 hover:bg-surface-button rounded-lg transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-content-primary font-medium text-sm">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="text-content-muted hover:text-content-primary p-1.5 hover:bg-surface-button rounded-lg transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                <div key={idx} className="text-center text-content-faint text-xs font-medium py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="w-8 h-8"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={getDayClassName(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time, Reminder, and Repeat Sections */}
          <div className="space-y-4">
            {/* Time */}
            <div>
              <label className="text-sm text-content-secondary flex items-center gap-2 mb-2">
                <Clock size={16} className="text-content-muted" />
                Time
              </label>
              <select
                value={tempTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full bg-surface-dark text-sm rounded-xl px-4 py-2.5 text-content-primary outline-none border border-transparent focus:border-orange-500 transition-colors"
              >
                <option value="">Select time</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {(() => {
                      const [hours, minutes] = time.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const formattedHour = hour % 12 || 12;
                      return `${formattedHour}:${minutes} ${ampm}`;
                    })()}
                  </option>
                ))}
              </select>
            </div>

            {/* Reminder - Collapsible on mobile */}
            <div>
              {/* Mobile: Collapsible header */}
              <button
                onClick={() => setIsReminderExpanded(!isReminderExpanded)}
                className="md:hidden w-full flex items-center justify-between text-sm text-content-secondary py-2"
              >
                <span className="flex items-center gap-2">
                  <Bell size={16} className="text-content-muted" />
                  Reminder
                  {tempReminder && tempReminder !== "" && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      {tempReminder}
                    </span>
                  )}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-content-muted transition-transform ${isReminderExpanded ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Desktop: Always visible label */}
              <label className="hidden md:flex text-sm text-content-secondary items-center gap-2 mb-2">
                <Bell size={16} className="text-content-muted" />
                Reminder
              </label>
              
              {/* Content - Always visible on desktop, collapsible on mobile */}
              <div className={`${isReminderExpanded ? 'block' : 'hidden'} md:block`}>
                <select
                  value={tempReminder}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  className="w-full bg-surface-dark text-sm rounded-xl px-4 py-2.5 text-content-primary outline-none border border-transparent focus:border-orange-500 transition-colors"
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

                {showCustomReminder && (
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <input
                      type="number"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="bg-surface-dark text-content-primary px-3 py-2 rounded-xl text-sm w-20 outline-none border border-transparent focus:border-orange-500"
                      placeholder="30"
                      min="1"
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="bg-surface-dark text-content-primary px-3 py-2 rounded-xl text-sm outline-none"
                    >
                      <option value="Minutes">Minutes</option>
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                    </select>
                    <span className="text-sm text-content-muted">before</span>
                  </div>
                )}
              </div>
            </div>

            {/* Repeat - Collapsible on mobile */}
            <div>
              {/* Mobile: Collapsible header */}
              <button
                onClick={() => setIsRepeatExpanded(!isRepeatExpanded)}
                className="md:hidden w-full flex items-center justify-between text-sm text-content-secondary py-2"
              >
                <span className="flex items-center gap-2">
                  <Repeat size={16} className="text-content-muted" />
                  Repeat
                  {tempRepeat && tempRepeat !== "" && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      {tempRepeat}
                    </span>
                  )}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-content-muted transition-transform ${isRepeatExpanded ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Desktop: Always visible label */}
              <label className="hidden md:flex text-sm text-content-secondary items-center gap-2 mb-2">
                <Repeat size={16} className="text-content-muted" />
                Repeat
              </label>
              
              {/* Content - Always visible on desktop, collapsible on mobile */}
              <div className={`${isRepeatExpanded ? 'block' : 'hidden'} md:block`}>
                <select
                  value={tempRepeat}
                  onChange={(e) => setTempRepeat(e.target.value)}
                  className="w-full bg-surface-dark text-sm rounded-xl px-4 py-2.5 text-content-primary outline-none border border-transparent focus:border-orange-500 transition-colors"
                >
                  <option value="">Never</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>

                {tempRepeat && tempRepeat !== "" && (
                  <div className="mt-3 ml-1 space-y-2">
                    <div className="text-sm text-content-muted mb-2">Ends:</div>
                    <label className="flex items-center gap-2 text-sm text-content-secondary cursor-pointer">
                      <input
                        type="radio"
                        name="repeatEnd"
                        value="never"
                        checked={repeatEndType === "never"}
                        onChange={() => setRepeatEndType("never")}
                        className="w-4 h-4 text-orange-500 bg-surface-dark border-border focus:ring-orange-500"
                      />
                      Never
                    </label>
                    <label className="flex items-center gap-2 text-sm text-content-secondary cursor-pointer">
                      <input
                        type="radio"
                        name="repeatEnd"
                        value="onDate"
                        checked={repeatEndType === "onDate"}
                        onChange={() => setRepeatEndType("onDate")}
                        className="w-4 h-4 text-orange-500 bg-surface-dark border-border focus:ring-orange-500"
                      />
                      On date:
                      <input
                        type="date"
                        value={repeatEndDate}
                        onChange={(e) => setRepeatEndDate(e.target.value)}
                        onClick={() => setRepeatEndType("onDate")}
                        className="bg-surface-dark text-sm rounded-xl px-3 py-1.5 text-content-primary outline-none border border-border focus:border-orange-500 ml-1"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-content-secondary cursor-pointer">
                      <input
                        type="radio"
                        name="repeatEnd"
                        value="after"
                        checked={repeatEndType === "after"}
                        onChange={() => setRepeatEndType("after")}
                        className="w-4 h-4 text-orange-500 bg-surface-dark border-border focus:ring-orange-500"
                      />
                      After
                      <input
                        type="number"
                        value={repeatOccurrences}
                        onChange={(e) => setRepeatOccurrences(e.target.value)}
                        onClick={() => setRepeatEndType("after")}
                        min="1"
                        placeholder="5"
                        className="w-16 bg-surface-dark text-sm rounded-xl px-3 py-1.5 text-content-primary outline-none border border-border focus:border-orange-500 ml-1"
                      />
                      <span className="text-content-muted">occurrences</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 md:p-6 pt-4 border-t border-border bg-surface-card rounded-b-xl">
          {/* Clear All - small on mobile */}
          <div className="flex justify-center mb-3 md:hidden">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-red-400 hover:text-red-300 text-xs hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear all date/time settings"
            >
              Clear All
            </button>
          </div>
          
          {/* Main buttons row */}
          <div className="flex justify-between items-center">
            {/* Clear All - Desktop only */}
            <button
              onClick={handleClear}
              className="hidden md:block px-4 py-2 text-red-400 hover:text-red-300 text-sm hover:bg-red-500/10 rounded-xl transition-colors"
              title="Clear all date/time settings"
            >
              Clear All
            </button>
            
            {/* Cancel and Save */}
            <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-4 py-2 bg-surface-button text-sm text-content-secondary rounded-xl hover:bg-surface-button transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOK}
                className="flex-1 md:flex-none px-4 py-2 bg-orange-500 text-sm text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={confirmClear}
        title="Clear All Settings"
        message="Are you sure you want to reset all date, time, reminder, and repeat settings in this form?"
        confirmText="Clear All"
        cancelText="Cancel"
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-surface-button, #2F2F2F);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-content-faint, #555);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-content-muted, #777);
        }
      `}</style>
    </div>
  );
};

export default CalendarModal;
