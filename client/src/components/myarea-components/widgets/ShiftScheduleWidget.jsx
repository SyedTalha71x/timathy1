/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { Calendar, Clock, Users, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

const mockShiftData = [
  {
    id: 1,
    staffName: "John Smith",
    position: "Trainer",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "17:00",
    duration: "8h",
    color: "bg-blue-500",
    status: "working", // working, off, break
    isClockedIn: true,
    currentStatus: "With Client"
  },
  {
    id: 2,
    staffName: "Sarah Johnson",
    position: "Reception",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "16:00",
    duration: "8h",
    color: "bg-green-500",
    status: "working",
    isClockedIn: true,
    currentStatus: "At Front Desk"
  },
  {
    id: 3,
    staffName: "Mike Wilson",
    position: "Manager",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "18:00",
    duration: "8h",
    color: "bg-purple-500",
    status: "break",
    isClockedIn: false,
    currentStatus: "On Break"
  },
  {
    id: 4,
    staffName: "Emily Brown",
    position: "Trainer",
    date: "2024-01-15",
    startTime: "12:00",
    endTime: "20:00",
    duration: "8h",
    color: "bg-orange-500",
    status: "off",
    isClockedIn: false,
    currentStatus: "Starts at 12:00"
  }
];

const ShiftScheduleWidget = ({ 
  isEditing = false,
  onRemove,
  className = "",
  showHeader = true 
}) => {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [viewType, setViewType] = useState("daily");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getShiftsForDate = useCallback((date) => {
    return mockShiftData.filter(shift => shift.date === date);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return 'text-green-400 bg-green-500/20';
      case 'break':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'off':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status, isClockedIn) => {
    if (status === 'working' && isClockedIn) {
      return <CheckCircle size={14} className="text-green-400" />;
    } else if (status === 'working' && !isClockedIn) {
      return <Clock size={14} className="text-yellow-400" />;
    } else {
      return <XCircle size={14} className="text-gray-400" />;
    }
  };

  const getStatusText = (status, isClockedIn) => {
    if (status === 'working' && isClockedIn) {
      return 'Clocked In';
    } else if (status === 'working' && !isClockedIn) {
      return 'Scheduled';
    } else if (status === 'break') {
      return 'On Break';
    } else {
      return 'Off Duty';
    }
  };

  const currentShifts = getShiftsForDate(selectedDate);

  return (
    <div className={`space-y-4 p-4 rounded-xl bg-[#2F2F2F] ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Staff Shifts</h2>
          </div>
          
        </div>
      )}

      <div className="flex items-center justify-between bg-black rounded-lg p-3">
        <button 
          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          onClick={() => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - (viewType === 'daily' ? 1 : 7));
            setSelectedDate(date.toISOString().split('T')[0]);
          }}
        >
          ←
        </button>
        
        <div className="text-center">
          <div className="font-medium">{formatDate(selectedDate)}</div>
          <div className="text-xs text-zinc-400">
            {currentShifts.filter(shift => shift.status === 'working').length} staff working
          </div>
        </div>

        <button 
          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          onClick={() => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() + (viewType === 'daily' ? 1 : 7));
            setSelectedDate(date.toISOString().split('T')[0]);
          }}
        >
          →
        </button>
      </div>

      <div className="space-y-3 max-h-[185px] overflow-y-auto custom-scrollbar pr-1">
        {currentShifts.length > 0 ? (
          currentShifts.map((shift) => (
            <div
              key={shift.id}
              className="p-3 rounded-xl bg-black/50 border-l-4"
              style={{ borderLeftColor: shift.color.replace('bg-', '').split('-')[0] }}
            >
              {/* Staff Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: shift.color.replace('bg-', '').split('-')[0] === 'blue' ? '#3b82f6' :
                                        shift.color.replace('bg-', '').split('-')[0] === 'green' ? '#10b981' :
                                        shift.color.replace('bg-', '').split('-')[0] === 'purple' ? '#8b5cf6' : '#f97316'
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm">{shift.staffName}</h3>
                      <p className="text-xs text-zinc-400">{shift.position}</p>
                    </div>
                  </div>
                  
                  {/* Shift Time */}
                  <div className="flex items-center gap-2 text-xs text-zinc-300 mb-2">
                    <Clock size={12} />
                    <span>{shift.startTime} - {shift.endTime}</span>
                    <span className="text-zinc-500">({shift.duration})</span>
                  </div>

                  {/* Current Status */}
                  <div className="text-xs text-zinc-300">
                    {shift.currentStatus}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(shift.status)}`}>
                    {getStatusIcon(shift.status, shift.isClockedIn)}
                    <span>{getStatusText(shift.status, shift.isClockedIn)}</span>
                  </div>
                  
                  {shift.status === 'working' && shift.isClockedIn && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-400">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p>No shifts scheduled</p>
            <p className="text-xs mt-1">All staff are off today</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ShiftScheduleWidget;