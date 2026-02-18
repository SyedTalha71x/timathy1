/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";
import { Clock, Bell, Repeat, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ConfirmationModal from "./confirmation-modal";
import CustomSelect from "../CustomSelect";
import DatePickerField from "../DatePickerField";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

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
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  
  // Calendar view mode: "days" | "months" | "years"
  const [calendarView, setCalendarView] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = new Date().getFullYear();
    return y - (y % 20);
  });
  
  // Mobile collapsible sections
  const [isReminderExpanded, setIsReminderExpanded] = useState(false);
  const [isRepeatExpanded, setIsRepeatExpanded] = useState(false);

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempDate(initialDate || "");
      setTempTime(initialTime || "");
      setTempReminder(initialReminder || "");
      setTempRepeat(initialRepeat || "");

      if (initialReminder === "Custom") {
        setShowCustomReminder(true);
        setCustomValue(initialCustomReminder?.value || "");
        setCustomUnit(initialCustomReminder?.unit || "Minutes");
      } else {
        setShowCustomReminder(false);
      }

      if (initialRepeatEnd) {
        setRepeatEndType(initialRepeatEnd.type || "never");
        setRepeatEndDate(initialRepeatEnd.date || "");
        setRepeatOccurrences(initialRepeatEnd.occurrences || "");
      } else {
        setRepeatEndType("never");
        setRepeatEndDate("");
        setRepeatOccurrences("");
      }

      if (initialDate) {
        const dateParts = initialDate.split('-');
        if (dateParts.length === 3) {
          setCurrentDate(new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
        }
      }

      setCalendarView("days");
      setIsReminderExpanded(!!initialReminder && initialReminder !== "");
      setIsRepeatExpanded(!!initialRepeat && initialRepeat !== "");
    } else {
      setIsReminderExpanded(false);
      setIsRepeatExpanded(false);
    }
  }, [isOpen, initialDate, initialTime, initialReminder, initialRepeat, initialCustomReminder, initialRepeatEnd]);

  // Calendar computations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const todayStr = new Date().toISOString().split('T')[0];
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth();

  const selectedYear = tempDate ? +tempDate.split('-')[0] : null;
  const selectedMonth = tempDate ? +tempDate.split('-')[1] - 1 : null;

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setTempDate(dateStr);
  };

  const handleMonthSelect = (m) => {
    setCurrentDate(new Date(year, m, 1));
    setCalendarView("days");
  };

  const handleYearSelect = (y) => {
    setCurrentDate(new Date(y, month, 1));
    setCalendarView("months");
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Time options
  const timeOptions = useMemo(() => {
    const opts = [{ value: "", label: "Select time" }];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        opts.push({ value: timeString, label: `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}` });
      }
    }
    return opts;
  }, []);

  // Reminder options
  const reminderOptions = [
    { value: "", label: "None" },
    { value: "On time", label: "On time" },
    { value: "5 minutes before", label: "5 minutes before" },
    { value: "15 minutes before", label: "15 minutes before" },
    { value: "30 minutes before", label: "30 minutes before" },
    { value: "1 hour before", label: "1 hour before" },
    { value: "1 day before", label: "1 day before" },
    { value: "Custom", label: "Custom" },
  ];

  // Repeat options
  const repeatOptions = [
    { value: "", label: "Never" },
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];

  // Custom unit options
  const customUnitOptions = [
    { value: "Minutes", label: "Minutes" },
    { value: "Hours", label: "Hours" },
    { value: "Days", label: "Days" },
    { value: "Weeks", label: "Weeks" },
  ];

  const handleTimeChange = (time) => {
    setTempTime(time);
    if (time && !tempReminder) {
      setTempReminder("On time");
    }
  };

  const handleReminderChange = (reminder) => {
    setTempReminder(reminder);
    setShowCustomReminder(reminder === "Custom");
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
    setShowClearConfirmation(true);
  };

  const confirmClear = () => {
    setTempDate("");
    setTempTime("");
    setTempReminder("");
    setTempRepeat("");
    setCustomValue("");
    setShowCustomReminder(false);
    setRepeatEndType("never");
    setRepeatEndDate("");
    setRepeatOccurrences("");
    setShowClearConfirmation(false);
    setCurrentDate(new Date());
    setCalendarView("days");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-2 md:p-4 pt-8 md:pt-4">
      <div className="bg-surface-card rounded-xl shadow-lg w-full max-w-md max-h-[95vh] md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 pb-4 md:pb-5 flex-shrink-0 border-b border-border">
          <h2 className="text-content-primary text-lg font-semibold">Date & Time</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-4">
          {/* Calendar Section */}
          <div className="mb-5 bg-surface-dark rounded-xl p-4">

            {/* DAYS VIEW */}
            {calendarView === "days" && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarView("months")}
                    className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors"
                  >
                    {MONTH_NAMES[month]} {year}
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAY_HEADERS.map(d => (
                    <div key={d} className="text-center text-content-faint text-xs font-medium py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} className="w-8 h-8" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = tempDate === dateStr;
                    const isToday = dateStr === todayStr;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isSelected ? "bg-primary text-white font-medium"
                            : isToday ? "bg-primary/20 text-primary font-medium"
                            : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Today / Clear footer */}
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setCurrentDate(now);
                      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                      setTempDate(dateStr);
                    }}
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    Today
                  </button>
                  {tempDate && (
                    <button
                      type="button"
                      onClick={() => setTempDate("")}
                      className="text-xs text-content-faint hover:text-red-400 transition-colors"
                    >
                      Clear date
                    </button>
                  )}
                </div>
              </>
            )}

            {/* MONTHS VIEW */}
            {calendarView === "months" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setCurrentDate(new Date(year - 1, month, 1))}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setYearRangeStart(year - (year % 20)); setCalendarView("years"); }}
                    className="text-content-primary font-medium text-sm hover:bg-surface-button px-2 py-1 rounded-lg transition-colors"
                  >
                    {year}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentDate(new Date(year + 1, month, 1))}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_SHORT.map((name, i) => {
                    const isCurrent = year === todayYear && i === todayMonth;
                    const isSelected = year === selectedYear && i === selectedMonth;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleMonthSelect(i)}
                        className={`py-2.5 text-sm rounded-lg transition-all duration-200 ${
                          isSelected ? "bg-primary text-white font-medium"
                            : isCurrent ? "bg-primary/20 text-primary font-medium"
                            : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* YEARS VIEW */}
            {calendarView === "years" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setYearRangeStart(yearRangeStart - 20)}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-content-primary font-medium text-sm">
                    {yearRangeStart} – {yearRangeStart + 19}
                  </span>
                  <button
                    type="button"
                    onClick={() => setYearRangeStart(yearRangeStart + 20)}
                    className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const y = yearRangeStart + i;
                    const isCurrent = y === todayYear;
                    const isSelected = y === selectedYear;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => handleYearSelect(y)}
                        className={`py-2 text-sm rounded-lg transition-all duration-200 ${
                          isSelected ? "bg-primary text-white font-medium"
                            : isCurrent ? "bg-primary/20 text-primary font-medium"
                            : "text-content-secondary hover:bg-surface-button"
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Time, Reminder, and Repeat Sections */}
          <div className="space-y-4">
            {/* Time */}
            <div>
              <label className="text-sm text-content-secondary flex items-center gap-2 mb-2">
                <Clock size={16} className="text-content-muted" />
                Time
              </label>
              <CustomSelect
                name="time"
                value={tempTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                options={timeOptions}
                placeholder="Select time"
                searchable
              />
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
                    <span className="text-xs text-primary bg-primary/20 px-2 py-0.5 rounded-full">
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
              
              {/* Content */}
              <div className={`${isReminderExpanded ? 'block' : 'hidden'} md:block`}>
                <CustomSelect
                  name="reminder"
                  value={tempReminder}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  options={reminderOptions}
                  placeholder="None"
                />

                {showCustomReminder && (
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <input
                      type="number"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="bg-surface-dark text-content-primary px-3 py-2 rounded-xl text-sm w-20 outline-none border border-transparent focus:border-primary"
                      placeholder="30"
                      min="1"
                    />
                    <div className="w-28">
                      <CustomSelect
                        name="customUnit"
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        options={customUnitOptions}
                      />
                    </div>
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
                    <span className="text-xs text-primary bg-primary/20 px-2 py-0.5 rounded-full">
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
              
              {/* Content */}
              <div className={`${isRepeatExpanded ? 'block' : 'hidden'} md:block`}>
                <CustomSelect
                  name="repeat"
                  value={tempRepeat}
                  onChange={(e) => setTempRepeat(e.target.value)}
                  options={repeatOptions}
                  placeholder="Never"
                />

                {tempRepeat && tempRepeat !== "" && (
                  <div className="mt-3 space-y-1">
                    <div className="text-sm text-content-muted mb-2">Ends:</div>
                    
                    {/* Never */}
                    <label 
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        repeatEndType === "never" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                      }`}
                      onClick={() => setRepeatEndType("never")}
                    >
                      <input
                        type="radio"
                        name="repeatEnd"
                        value="never"
                        checked={repeatEndType === "never"}
                        onChange={() => setRepeatEndType("never")}
                        className="primary-radio"
                      />
                      <span className="text-sm text-content-secondary">Never</span>
                    </label>
                    
                    {/* On date */}
                    <div 
                      className={`rounded-xl transition-colors ${
                        repeatEndType === "onDate" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                      }`}
                    >
                      <label 
                        className="flex items-center gap-3 p-2.5 cursor-pointer"
                        onClick={() => setRepeatEndType("onDate")}
                      >
                        <input
                          type="radio"
                          name="repeatEnd"
                          value="onDate"
                          checked={repeatEndType === "onDate"}
                          onChange={() => setRepeatEndType("onDate")}
                          className="primary-radio"
                        />
                        <span className="text-sm text-content-secondary">On date</span>
                      </label>
                      {repeatEndType === "onDate" && (
                        <div className="flex items-center gap-2 px-2.5 pb-2.5 ml-7">
                          <div className="flex items-center gap-2 bg-surface-button rounded-xl px-3 py-2 border border-border flex-1">
                            <span className={`text-sm flex-1 ${repeatEndDate ? 'text-content-primary' : 'text-content-muted'}`}>
                              {repeatEndDate || "Pick a date"}
                            </span>
                            <DatePickerField
                              value={repeatEndDate}
                              onChange={(val) => {
                                setRepeatEndDate(val);
                                setRepeatEndType("onDate");
                              }}
                              iconSize={14}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* After X occurrences */}
                    <div 
                      className={`rounded-xl transition-colors ${
                        repeatEndType === "after" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                      }`}
                    >
                      <label 
                        className="flex items-center gap-3 p-2.5 cursor-pointer"
                        onClick={() => setRepeatEndType("after")}
                      >
                        <input
                          type="radio"
                          name="repeatEnd"
                          value="after"
                          checked={repeatEndType === "after"}
                          onChange={() => setRepeatEndType("after")}
                          className="primary-radio"
                        />
                        <span className="text-sm text-content-secondary">After occurrences</span>
                      </label>
                      {repeatEndType === "after" && (
                        <div className="flex items-center gap-2 px-2.5 pb-2.5 ml-7">
                          <input
                            type="number"
                            value={repeatOccurrences}
                            onChange={(e) => setRepeatOccurrences(e.target.value)}
                            min="1"
                            placeholder="5"
                            className="w-20 bg-surface-button text-sm rounded-xl px-3 py-2 text-content-primary outline-none border border-border focus:border-primary"
                          />
                          <span className="text-sm text-content-muted">times</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex-shrink-0 p-4 md:p-6 pt-4 border-t border-border bg-surface-card rounded-b-xl">
          {/* Clear All - mobile */}
          <div className="flex justify-center mb-3 md:hidden">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-red-400 hover:text-red-300 text-xs hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear all date/time settings"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            {/* Clear All - Desktop */}
            <button
              onClick={handleClear}
              className="hidden md:block px-4 py-2 text-red-400 hover:text-red-300 text-sm hover:bg-red-500/10 rounded-xl transition-colors"
              title="Clear all date/time settings"
            >
              Clear All
            </button>
            
            <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-4 py-2 bg-surface-button text-sm text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOK}
                className="flex-1 md:flex-none px-4 py-2 bg-primary text-sm text-white rounded-xl hover:bg-primary-hover transition-colors whitespace-nowrap"
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
        .primary-radio {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          border: 2px solid var(--color-border, #444);
          background: var(--color-surface-card, #1a1a1a);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
          position: relative;
        }
        .primary-radio:checked {
          border-color: var(--color-primary, #f97316);
          background: var(--color-primary, #f97316);
        }
        .primary-radio:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: white;
        }
        .primary-radio:focus {
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary, #f97316) 40%, transparent);
        }
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
