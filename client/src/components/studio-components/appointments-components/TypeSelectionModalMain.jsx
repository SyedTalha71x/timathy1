/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Calendar, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next"

const TypeSelectionModalMain = ({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedDate,  // Date object or string
  selectedTime   // Time string like "09:00" or "09:00 - 09:30"
}) => {
  const { t, i18n } = useTranslation();
  if (!isOpen) return null;

  // Calculate time from selectedDate if selectedTime is not provided
  const getTimeFromDate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    // Don't return "00:00" as it's likely an unset time
    if (hours === "00" && minutes === "00") return null;
    return `${hours}:${minutes}`;
  };

  // Use provided selectedTime, or calculate from selectedDate
  const effectiveTime = selectedTime || getTimeFromDate(selectedDate);

  const handleClick = (type) => {
    // Pass the type along with the selected date and time
    onSelect(type, { date: selectedDate, time: effectiveTime });
    onClose();
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    
    const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
    return d.toLocaleDateString(i18n.language, options);
  };

  // Format time for display
  const formatTimeDisplay = (time) => {
    if (!time) return "";
    // If it's already a range like "09:00 - 09:30", return as is
    if (time.includes("-")) return time;
    // Otherwise just return the time
    return time;
  };

  const dateDisplay = formatDateDisplay(selectedDate);
  const timeDisplay = formatTimeDisplay(effectiveTime);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-dark w-[90%] sm:w-[400px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">{t("studioCalendar.typeModal.title")}</h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-dark rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Date and Time Display */}
        {(dateDisplay || timeDisplay) && (
          <div className="px-6 py-3 bg-surface-dark border-b border-border">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-content-muted">
                <Calendar size={14} />
                <span className="text-content-primary">{dateDisplay || "No date selected"}</span>
              </div>
              {timeDisplay && (
                <>
                  <div className="w-1 h-1 rounded-full bg-surface-button"></div>
                  <div className="flex items-center gap-2 text-content-muted">
                    <Clock size={14} />
                    <span className="text-content-primary">{timeDisplay}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-2">
          {/* Book Appointment */}
          <button
            onClick={() => handleClick("appointment")}
            className="w-full px-4 py-3.5 bg-surface-card hover:bg-surface-hover text-left text-content-primary rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Calendar size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{t("studioCalendar.bookAppointment")}</p>
              <p className="text-xs text-content-faint">{t("studioCalendar.typeModal.appointmentDesc")}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </button>

          {/* Book Trial Training */}
          <button
            onClick={() => handleClick("trial")}
            className="w-full px-4 py-3.5 bg-surface-card hover:bg-surface-hover text-left text-content-primary rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-trial/20 flex items-center justify-center group-hover:bg-trial/30 transition-colors">
              <Users size={20} className="text-trial" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{t("studioCalendar.bookTrialTraining")}</p>
              <p className="text-xs text-content-faint">{t("studioCalendar.typeModal.trialDesc")}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-trial"></div>
          </button>

          {/* Block Time Slot */}
          <button
            onClick={() => handleClick("block")}
            className="w-full px-4 py-3.5 bg-surface-card hover:bg-surface-hover text-left text-content-primary rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-content-faint/20 flex items-center justify-center group-hover:bg-content-faint/30 transition-colors">
              <Clock size={20} className="text-content-muted" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{t("studioCalendar.blockTimeSlot")}</p>
              <p className="text-xs text-content-faint">{t("studioCalendar.typeModal.blockDesc")}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-content-faint"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeSelectionModalMain;
