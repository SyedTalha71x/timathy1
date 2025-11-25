/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { Clock, Users, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

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
  const [selectedStaff, setSelectedStaff] = useState("All Staff");
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getShiftsForDate = useCallback((date) => {
    let filteredShifts = mockShiftData.filter(shift => shift.date === date);

    // Filter by selected staff if not "All Staff"
    if (selectedStaff !== "All Staff") {
      filteredShifts = filteredShifts.filter(shift => shift.staffName === selectedStaff);
    }

    return filteredShifts;
  }, [selectedStaff]);

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

  // Get unique staff names for dropdown
  const staffNames = ["All Staff", ...new Set(mockShiftData.map(shift => shift.staffName))];

  const currentShifts = getShiftsForDate(selectedDate);

  return (
    <div className={`space-y-4 p-4 rounded-xl bg-[#2F2F2F] ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Staff Shifts</h2>

          {/* Staff Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg text-sm hover:bg-zinc-800 transition-colors"
              onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
            >
              <span>{selectedStaff}</span>
              <ChevronDown size={16} className={`transition-transform ${isStaffDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStaffDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-black rounded-lg shadow-lg border border-zinc-700 z-10">
                {staffNames.map((staff) => (
                  <button
                    key={staff}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedStaff === staff ? 'bg-blue-500/20 text-blue-400' : ''
                      }`}
                    onClick={() => {
                      setSelectedStaff(staff);
                      setIsStaffDropdownOpen(false);
                    }}
                  >
                    {staff}
                  </button>
                ))}
              </div>
            )}
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
              className="p-3 rounded-xl bg-black/50 "
            // style={{ borderLeftColor: shift.color.replace('bg-', '').split('-')[0] }}
            >
              {/* Staff Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">

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

      {/* Close dropdown when clicking outside */}
      {(isStaffDropdownOpen || isViewDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsStaffDropdownOpen(false);
            setIsViewDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ShiftScheduleWidget;