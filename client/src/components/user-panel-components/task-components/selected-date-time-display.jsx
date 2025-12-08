import { X } from "lucide-react";

/* eslint-disable react/prop-types */
export const SelectedDateTimeDisplay = ({ date, time, reminder, onClear }) => {
    if (!date && !time) return null;
  
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
  
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    };
  
    // Format reminder text for display
    const getReminderText = () => {
      if (!reminder) return 'No reminder set';
      return `Reminder: ${reminder}`;
    };
  
    return (
      <div 
        className="flex items-center gap-2 bg-[#2F2F2F] rounded-lg px-3 py-1 text-sm mr-2 group relative"
        title={getReminderText()} // Fallback title
      >
        <span className="text-white whitespace-nowrap">
          {date && formatDate(date)}
          {date && time && ' • '}
          {time && formatTime(time)}
        </span>
        
        {/* Hover tooltip */}
        {reminder && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-50">
            <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {getReminderText()}
            </div>
            <div className="w-3 h-3 bg-black transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        )}
        
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-white ml-1"
          title="Clear date and time"
        >
          <X size={14} />
        </button>
      </div>
    );
  };