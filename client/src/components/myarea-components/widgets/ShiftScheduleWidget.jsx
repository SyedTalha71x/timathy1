/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { Clock, Users, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staffData } from '../../../utils/studio-states/staff-states';

// ============================================
// Helper Functions
// ============================================
const formatDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  if (formatDateStr(date) === formatDateStr(today)) {
    return `Today, ${dateStr}`;
  } else if (formatDateStr(date) === formatDateStr(tomorrow)) {
    return `Tomorrow, ${dateStr}`;
  } else if (formatDateStr(date) === formatDateStr(yesterday)) {
    return `Yesterday, ${dateStr}`;
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// ============================================
// Generate Mock Shifts Based on Staff Data
// ============================================
const generateShiftsForDate = (dateStr, staffMembers) => {
  // Use date string to create deterministic but varied shifts
  const dateHash = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  
  // Weekend: fewer staff
  const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;
  
  return staffMembers
    .filter((staff) => {
      // Filter out some staff based on date hash for variety
      const staffHash = (staff.id + dateHash) % 10;
      if (isWeekendDay) {
        return staffHash < 4; // ~40% work on weekends
      }
      return staffHash < 8; // ~80% work on weekdays
    })
    .map((staff) => {
      const staffDateHash = (staff.id * 7 + dateHash) % 24;
      
      // Determine shift times based on hash
      let startHour, endHour;
      
      if (staffDateHash < 8) {
        // Morning shift
        startHour = 6 + (staffDateHash % 3);
        endHour = startHour + 8;
      } else if (staffDateHash < 16) {
        // Day shift
        startHour = 9 + (staffDateHash % 3);
        endHour = startHour + 8;
      } else {
        // Evening shift
        startHour = 14 + (staffDateHash % 4);
        endHour = Math.min(startHour + 8, 22);
      }
      
      const duration = endHour - startHour;
      
      return {
        id: `${staff.id}-${dateStr}`,
        staffId: staff.id,
        staffName: `${staff.firstName} ${staff.lastName}`,
        firstName: staff.firstName,
        lastName: staff.lastName,
        position: staff.role,
        img: staff.img,
        date: dateStr,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(endHour).padStart(2, '0')}:00`,
        duration: `${duration}h`,
      };
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// ============================================
// Initials Avatar Component
// ============================================
const InitialsAvatar = ({ firstName, lastName, img, size = "sm" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  };

  if (img) {
    return (
      <img 
        src={img} 
        alt={`${firstName} ${lastName}`}
        className={`rounded-lg flex-shrink-0 object-cover ${sizeClasses[size]}`}
      />
    );
  }

  return (
    <div 
      className={`rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 bg-blue-600 ${sizeClasses[size]}`}
    >
      {getInitials()}
    </div>
  );
};

// ============================================
// Shift Card Component
// ============================================
const ShiftCard = ({ shift }) => {
  return (
    <div className="p-3 rounded-xl bg-black/50 hover:bg-black/70 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <InitialsAvatar
          firstName={shift.firstName}
          lastName={shift.lastName}
          img={shift.img}
          size="sm"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-white truncate">
                {shift.staffName}
              </h3>
              <p className="text-xs text-gray-500">{shift.position}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
            <Clock size={11} />
            <span>{shift.startTime} - {shift.endTime}</span>
            <span className="text-gray-600">({shift.duration})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Widget Component
// ============================================
const ShiftScheduleWidget = ({
  isEditing = false,
  onRemove,
  className = "",
  showHeader = true,
  maxItems = null
}) => {
  const navigate = useNavigate();
  
  // Initialize with today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  // Get active staff members
  const activeStaff = useMemo(() => 
    staffData.filter(s => s.isActive && !s.isArchived),
    []
  );

  // Generate shifts for selected date
  const currentShifts = useMemo(() => {
    const dateStr = formatDateStr(selectedDate);
    let shifts = generateShiftsForDate(dateStr, activeStaff);
    
    // Filter by selected staff if not "all"
    if (selectedStaff !== "all") {
      shifts = shifts.filter(shift => shift.staffId === parseInt(selectedStaff));
    }
    
    return shifts;
  }, [selectedDate, selectedStaff, activeStaff]);

  // Navigation handlers
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className={`flex flex-col p-4 rounded-xl bg-[#2F2F2F] ${className} ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
      {showHeader && (
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Staff Shifts</h2>
          </div>

          {/* Staff Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black rounded-lg text-xs hover:bg-zinc-800 transition-colors"
              onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
            >
              <Users size={12} className="text-gray-400" />
              <span className="text-gray-300">
                {selectedStaff === "all" 
                  ? `All (${activeStaff.length})` 
                  : activeStaff.find(s => s.id === parseInt(selectedStaff))?.firstName || "Staff"
                }
              </span>
              <ChevronDown size={12} className={`text-gray-500 transition-transform ${isStaffDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStaffDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsStaffDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1 w-44 bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-700 z-20 py-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                  <button
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                      selectedStaff === "all" ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedStaff("all");
                      setIsStaffDropdownOpen(false);
                    }}
                  >
                    <Users size={12} />
                    All Staff ({activeStaff.length})
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  {activeStaff.map((staff) => (
                    <button
                      key={staff.id}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                        selectedStaff === String(staff.id) ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedStaff(String(staff.id));
                        setIsStaffDropdownOpen(false);
                      }}
                    >
                      {staff.firstName} {staff.lastName}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-black rounded-xl p-2.5 mb-3 flex-shrink-0">
        <button
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          onClick={goToPreviousDay}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-center">
          <div className="font-medium text-sm text-white">
            {formatDisplayDate(selectedDate)}
          </div>
          <div className="text-[10px] text-gray-500">
            {currentShifts.length} staff scheduled
          </div>
        </div>

        <button
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          onClick={goToNextDay}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Shifts List */}
      <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 ${showHeader ? 'flex-1' : ''}`}>
        {currentShifts.length > 0 ? (
          (maxItems ? currentShifts.slice(0, maxItems) : currentShifts).map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Calendar size={20} className="text-gray-600" />
            </div>
            <p className="text-sm">No shifts scheduled</p>
            <p className="text-xs mt-1 text-gray-600">
              {isWeekend(selectedDate) ? "Weekend" : "Check another date"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-center pt-3 border-t border-gray-700 mt-3 flex-shrink-0">
        <button 
          onClick={() => navigate('/dashboard/staff', { 
            state: { 
              openModal: 'shifts-overview',
              initialTab: 'shifts'
            } 
          })}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          View full schedule →
        </button>
      </div>
    </div>
  );
};

export default ShiftScheduleWidget;
