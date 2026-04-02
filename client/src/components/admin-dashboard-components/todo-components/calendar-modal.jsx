/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Clock, Bell, Repeat, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./confirmation-modal";

// Map i18n language codes to full locale codes
const localeMap = { en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT" };
const getLocale = (lang) => localeMap[lang] || lang;

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
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

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
          setCurrentDate(new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          ));
        }
      }
      
      setIsReminderExpanded(!!initialReminder && initialReminder !== "")
      setIsRepeatExpanded(!!initialRepeat && initialRepeat !== "")
    } else {
      setIsReminderExpanded(false)
      setIsRepeatExpanded(false)
    }
  }, [isOpen, initialDate, initialTime, initialReminder, initialRepeat, initialCustomReminder, initialRepeatEnd]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Locale-aware month name
  const getMonthName = () => {
    return currentDate.toLocaleDateString(locale, { month: "long", year: "numeric" });
  };

  // Locale-aware day headers (short weekday names starting from Sunday)
  const getDayHeaders = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      // Jan 4 2026 is a Sunday
      const date = new Date(2026, 0, 4 + i);
      days.push(date.toLocaleDateString(locale, { weekday: "narrow" }));
    }
    return days;
  };

  const dayHeaders = getDayHeaders();

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
      className += "text-gray-300 hover:bg-[#2F2F2F]";
    }

    return className;
  };

  // Format time for display based on locale
  const formatTimeDisplay = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
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

  // Mobile: auto-save on close (no explicit save button)
  const handleMobileClose = () => {
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
    setCurrentDate(new Date())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-[80] md:p-4"
      onClick={handleMobileClose}
    >
      <div
        className="bg-[#181818] rounded-t-2xl md:rounded-xl shadow-lg w-full md:max-w-md max-h-[85dvh] md:max-h-[90vh] flex flex-col animate-slide-up md:animate-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          e.currentTarget._startY = e.touches[0].clientY
          e.currentTarget._currentY = e.touches[0].clientY
          e.currentTarget.style.transition = "none"
        }}
        onTouchMove={(e) => {
          const dy = e.touches[0].clientY - e.currentTarget._startY
          e.currentTarget._currentY = e.touches[0].clientY
          if (dy > 0) e.currentTarget.style.transform = `translateY(${dy}px)`
        }}
        onTouchEnd={(e) => {
          const dy = e.currentTarget._currentY - e.currentTarget._startY
          e.currentTarget.style.transition = "transform 0.2s ease-out"
          if (dy > 80) {
            e.currentTarget.style.transform = "translateY(100%)"
            setTimeout(() => handleMobileClose(), 200)
          } else {
            e.currentTarget.style.transform = "translateY(0)"
          }
        }}
      >
        {/* Drag handle - mobile */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-1 md:hidden" />

        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-4 pt-2 md:p-6 md:pb-5 flex-shrink-0 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">{t("todo.calendar.title")}</h2>
          <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-4"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Calendar Section */}
          <div className="mb-5 bg-[#101010] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-[#2F2F2F] rounded-lg transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-white font-medium text-sm capitalize">
                {getMonthName()}
              </span>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-[#2F2F2F] rounded-lg transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayHeaders.map((day, idx) => (
                <div key={idx} className="text-center text-gray-500 text-xs font-medium py-1">
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
                  <button key={day} onClick={() => handleDateClick(day)} className={getDayClassName(day)}>
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
              <label className="text-sm text-gray-200 flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                {t("todo.calendar.time")}
              </label>
              <select
                value={tempTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none border border-transparent focus:border-orange-500 transition-colors"
              >
                <option value="">{t("todo.calendar.selectTime")}</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
                  </option>
                ))}
              </select>
            </div>

            {/* Reminder - Collapsible on mobile */}
            <div>
              <button
                onClick={() => setIsReminderExpanded(!isReminderExpanded)}
                className="md:hidden w-full flex items-center justify-between text-sm text-gray-200 py-2"
              >
                <span className="flex items-center gap-2">
                  <Bell size={16} className="text-gray-400" />
                  {t("todo.calendar.reminder")}
                  {tempReminder && tempReminder !== "" && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      {tempReminder}
                    </span>
                  )}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isReminderExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              <label className="hidden md:flex text-sm text-gray-200 items-center gap-2 mb-2">
                <Bell size={16} className="text-gray-400" />
                {t("todo.calendar.reminder")}
              </label>
              
              <div className={`${isReminderExpanded ? 'block' : 'hidden'} md:block`}>
                <select
                  value={tempReminder}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none border border-transparent focus:border-orange-500 transition-colors"
                >
                  <option value="">{t("todo.calendar.none")}</option>
                  <option value="On time">{t("todo.calendar.onTime")}</option>
                  <option value="5 minutes before">{t("todo.calendar.5minBefore")}</option>
                  <option value="15 minutes before">{t("todo.calendar.15minBefore")}</option>
                  <option value="30 minutes before">{t("todo.calendar.30minBefore")}</option>
                  <option value="1 hour before">{t("todo.calendar.1hourBefore")}</option>
                  <option value="1 day before">{t("todo.calendar.1dayBefore")}</option>
                  <option value="Custom">{t("todo.calendar.custom")}</option>
                </select>

                {showCustomReminder && (
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <input
                      type="number"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="bg-[#101010] text-white px-3 py-2 rounded-xl text-sm w-20 outline-none border border-transparent focus:border-orange-500"
                      placeholder="30"
                      min="1"
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="bg-[#101010] text-white px-3 py-2 rounded-xl text-sm outline-none"
                    >
                      <option value="Minutes">{t("todo.calendar.minutes")}</option>
                      <option value="Hours">{t("todo.calendar.hours")}</option>
                      <option value="Days">{t("todo.calendar.days")}</option>
                      <option value="Weeks">{t("todo.calendar.weeks")}</option>
                    </select>
                    <span className="text-sm text-gray-400">{t("todo.calendar.before")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Repeat - Collapsible on mobile */}
            <div>
              <button
                onClick={() => setIsRepeatExpanded(!isRepeatExpanded)}
                className="md:hidden w-full flex items-center justify-between text-sm text-gray-200 py-2"
              >
                <span className="flex items-center gap-2">
                  <Repeat size={16} className="text-gray-400" />
                  {t("todo.calendar.repeatLabel")}
                  {tempRepeat && tempRepeat !== "" && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      {tempRepeat}
                    </span>
                  )}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isRepeatExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              <label className="hidden md:flex text-sm text-gray-200 items-center gap-2 mb-2">
                <Repeat size={16} className="text-gray-400" />
                {t("todo.calendar.repeatLabel")}
              </label>
              
              <div className={`${isRepeatExpanded ? 'block' : 'hidden'} md:block`}>
                <select
                  value={tempRepeat}
                  onChange={(e) => setTempRepeat(e.target.value)}
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none border border-transparent focus:border-orange-500 transition-colors"
                >
                  <option value="">{t("todo.calendar.neverEnd")}</option>
                  <option value="Daily">{t("todo.repeat.daily")}</option>
                  <option value="Weekly">{t("todo.repeat.weekly")}</option>
                  <option value="Monthly">{t("todo.repeat.monthly")}</option>
                </select>

                {tempRepeat && tempRepeat !== "" && (
                  <div className="mt-3 ml-1 space-y-2">
                    <div className="text-sm text-gray-400 mb-2">{t("todo.calendar.ends")}</div>
                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                      <input type="radio" name="repeatEnd" value="never" checked={repeatEndType === "never"} onChange={() => setRepeatEndType("never")} className="w-4 h-4 text-orange-500 bg-[#101010] border-gray-600 focus:ring-orange-500" />
                      {t("todo.calendar.neverEnd")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                      <input type="radio" name="repeatEnd" value="onDate" checked={repeatEndType === "onDate"} onChange={() => setRepeatEndType("onDate")} className="w-4 h-4 text-orange-500 bg-[#101010] border-gray-600 focus:ring-orange-500" />
                      {t("todo.calendar.onDateEnd")}
                      <input type="date" value={repeatEndDate} onChange={(e) => setRepeatEndDate(e.target.value)} onClick={() => setRepeatEndType("onDate")} className="bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none border border-gray-700 focus:border-orange-500 ml-1" />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                      <input type="radio" name="repeatEnd" value="after" checked={repeatEndType === "after"} onChange={() => setRepeatEndType("after")} className="w-4 h-4 text-orange-500 bg-[#101010] border-gray-600 focus:ring-orange-500" />
                      {t("todo.calendar.afterEnd")}
                      <input type="number" value={repeatOccurrences} onChange={(e) => setRepeatOccurrences(e.target.value)} onClick={() => setRepeatEndType("after")} min="1" placeholder="5" className="w-16 bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none border border-gray-700 focus:border-orange-500 ml-1" />
                      <span className="text-gray-400">{t("todo.calendar.occurrences")}</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons — desktop only, mobile auto-saves on close */}
        <div className="hidden md:block flex-shrink-0 p-6 pt-4 border-t border-gray-700 bg-[#181818] rounded-b-xl">
          <div className="flex justify-between items-center">
            <button onClick={handleClear} className="px-4 py-2 text-red-400 hover:text-red-300 text-sm hover:bg-red-500/10 rounded-xl transition-colors">
              {t("todo.calendar.clearAll")}
            </button>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-[#2F2F2F] text-sm text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
                {t("common.cancel")}
              </button>
              <button onClick={handleOK} className="px-4 py-2 bg-orange-500 text-sm text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap">
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={confirmClear}
        title={t("todo.calendar.clearTitle")}
        message={t("todo.calendar.clearMessage")}
        confirmText={t("todo.calendar.clearAll")}
        cancelText={t("common.cancel")}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #2F2F2F; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #777; }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CalendarModal;
