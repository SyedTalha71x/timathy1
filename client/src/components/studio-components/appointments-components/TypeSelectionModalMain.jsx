/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Calendar, Users, Clock } from "lucide-react";

const TypeSelectionModalMain = ({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedDate,  // Date object or string
  selectedTime   // Time string like "09:00" or "09:00 - 09:30"
}) => {
  if (!isOpen) return null;

  const handleClick = (type) => {
    // Pass the type along with the selected date and time
    onSelect(type, { date: selectedDate, time: selectedTime });
    onClose();
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    
    const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
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
  const timeDisplay = formatTimeDisplay(selectedTime);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[400px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Date and Time Display */}
        {(dateDisplay || timeDisplay) && (
          <div className="px-6 py-3 bg-[#1a1a1a] border-b border-gray-800">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} />
                <span className="text-white">{dateDisplay || "No date selected"}</span>
              </div>
              {timeDisplay && (
                <>
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={14} />
                    <span className="text-white">{timeDisplay}</span>
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
            className="w-full px-4 py-3.5 bg-[#1F1F1F] hover:bg-[#2a2a2a] text-left text-white rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <Calendar size={20} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Book Appointment</p>
              <p className="text-xs text-gray-500">Schedule a session with a member</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </button>

          {/* Book Trial Training */}
          <button
            onClick={() => handleClick("trial")}
            className="w-full px-4 py-3.5 bg-[#1F1F1F] hover:bg-[#2a2a2a] text-left text-white rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3F74FF]/20 flex items-center justify-center group-hover:bg-[#3F74FF]/30 transition-colors">
              <Users size={20} className="text-[#3F74FF]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Book Trial Training</p>
              <p className="text-xs text-gray-500">Schedule a trial for a lead</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#3F74FF]"></div>
          </button>

          {/* Block Time Slot */}
          <button
            onClick={() => handleClick("block")}
            className="w-full px-4 py-3.5 bg-[#1F1F1F] hover:bg-[#2a2a2a] text-left text-white rounded-xl transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center group-hover:bg-gray-500/30 transition-colors">
              <Clock size={20} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Block Time Slot</p>
              <p className="text-xs text-gray-500">Block a time slot on the calendar</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeSelectionModalMain;
