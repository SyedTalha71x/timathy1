/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { Clock, Dumbbell, ChevronDown, ChevronUp, Calendar, X } from "lucide-react"
import { MemberSpecialNoteIcon } from "../../shared/special-note/shared-special-note-icon"

const UpcomingAppointmentsWidget = ({ 
  isSidebarEditing,
  appointments = [],
  onAppointmentClick,
  onCheckIn,
  onOpenEditMemberModal,
  onOpenEditLeadModal,
  onOpenTrainingPlansModal,
  getMemberById,
  showCollapseButton = true,  // Control collapse button visibility
  useFixedHeight = false,     // Use fixed height (340px) vs full height
  backgroundColor = "bg-[#000000]", // Background color - can be customized per context
  showDatePicker = false,     // Show date picker in header (for my-area)
  initialDate = null,         // Initial date to show (defaults to today)
  filterDate = null,          // External date to filter by (from parent component)
  showHeader = true,          // Show widget header
  showDateIndicator = false   // Show date indicator next to title (for sidebar)
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date())
  const [showDatePickerInput, setShowDatePickerInput] = useState(false)
  const datePickerRef = useRef(null)

  // Sync with filterDate from parent (e.g., mini calendar selection)
  useEffect(() => {
    if (filterDate) {
      setSelectedDate(filterDate)
    }
  }, [filterDate])

  // Close date picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePickerInput(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter appointments by selected date (when showDatePicker is true OR filterDate is provided)
  const getFilteredAppointments = () => {
    // Only filter if date picker is shown OR an external filterDate is provided
    if (!showDatePicker && !filterDate) {
      return appointments // No filtering if neither is active
    }

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    const formattedSelectedDate = formatDate(selectedDate)
    
    return appointments.filter((appointment) => {
      const appointmentDate = appointment.date?.split("|")[1]?.trim()
      return appointmentDate === formattedSelectedDate
    })
  }

  // Filter for upcoming appointments (not cancelled, not blocked)
  const upcomingAppointments = getFilteredAppointments()
    .filter(app => !app.isCancelled && !app.isBlocked && app.type !== "Blocked Time")
    .slice(0, 10) // Show max 10 appointments in widget

  // Format date for display
  const formatDisplayDate = (date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Handle date change from input
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)
    setSelectedDate(newDate)
    setShowDatePickerInput(false)
  }

  // Reset to today
  const handleResetToToday = () => {
    setSelectedDate(new Date())
    setShowDatePickerInput(false)
  }

  const handleAppointmentClick = (appointment) => {
    if (!isSidebarEditing && onAppointmentClick) {
      onAppointmentClick(appointment)
    }
  }

  const handleCheckIn = (e, appointmentId) => {
    e.stopPropagation()
    if (!isSidebarEditing && onCheckIn) {
      onCheckIn(appointmentId)
    }
  }

  const handleDumbbellClick = (appointment, e) => {
    e.stopPropagation() // Prevent appointment click from firing
    if (!isSidebarEditing && onOpenTrainingPlansModal) {
      onOpenTrainingPlansModal(appointment, e)
    }
  }

  return (
    <div className={`rounded-xl ${backgroundColor} flex flex-col ${
      isCollapsed 
        ? 'h-auto' 
        : useFixedHeight 
          ? 'md:h-[340px] h-auto' 
          : 'h-full'
    }`}>
      {/* Full Header with title */}
      {showHeader && (
        <div className="flex justify-between items-center flex-shrink-0 px-3 pt-2.5 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Upcoming Appointments</h2>
            
            {/* Show selected date indicator when explicitly enabled */}
            {showDateIndicator && filterDate && !showDatePicker && (
              <span className="text-xs text-gray-400 bg-[#2F2F2F] px-2 py-0.5 rounded-lg">
                {formatDisplayDate(selectedDate)}
              </span>
            )}
            
            {/* Date Picker Button (only in my-area) */}
            {showDatePicker && (
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePickerInput(!showDatePickerInput)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-black hover:bg-gray-900 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                  title="Select Date"
                >
                  <Calendar size={12} />
                  <span>{formatDisplayDate(selectedDate)}</span>
                </button>
                
                {/* Date Picker Dropdown */}
                {showDatePickerInput && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 p-3 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">Select Date</span>
                      <button
                        onClick={() => setShowDatePickerInput(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      className="w-full bg-[#2F2F2F] text-white text-xs rounded-lg px-2 py-1.5 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleResetToToday}
                      className="w-full mt-2 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                    >
                      Today
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!isSidebarEditing && showCollapseButton && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 bg-[#2F2F2F] hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-white"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>
      )}

      {/* Compact Header for Sidebar - only DatePicker, no title */}
      {!showHeader && showDatePicker && (
        <div className="flex justify-end items-center flex-shrink-0 px-3 pt-2 pb-1.5">
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePickerInput(!showDatePickerInput)}
              className="flex items-center gap-1.5 px-2 py-1 bg-black hover:bg-gray-900 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
              title="Select Date"
            >
              <Calendar size={12} />
              <span>{formatDisplayDate(selectedDate)}</span>
            </button>
            
            {/* Date Picker Dropdown */}
            {showDatePickerInput && (
              <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 p-3 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Select Date</span>
                  <button
                    onClick={() => setShowDatePickerInput(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full bg-[#2F2F2F] text-white text-xs rounded-lg px-2 py-1.5 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleResetToToday}
                  className="w-full mt-2 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointments List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2 space-y-2">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => {
              const firstName = appointment.name || ""
              const lastName = appointment.lastName || ""
              const isBlocked = appointment.isBlocked || appointment.type === "Blocked Time"
              
              // Get member data to access their special notes
              const memberData = getMemberById ? getMemberById(appointment.memberId) : null
              const memberWithNotes = {
                ...appointment,
                id: appointment.memberId || appointment.id,
                firstName,
                lastName,
                note: memberData?.note || "",
                noteStartDate: memberData?.noteStartDate || "",
                noteEndDate: memberData?.noteEndDate || "",
                noteImportance: memberData?.noteImportance || "unimportant",
                notes: memberData?.notes || [],
              }
              
              return (
                <div
                  key={appointment.id}
                  className={`${appointment.color} ${
                    appointment.isCancelled ? "bg-gray-700" : ""
                  } ${
                    appointment.isPast && !appointment.isCancelled ? "opacity-45" : ""
                  } ${
                    isBlocked ? "bg-gray-800" : ""
                  } rounded-xl cursor-pointer p-2.5 relative w-full transition-all hover:brightness-110`}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  {/* Icons row at top */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {!isBlocked && onOpenEditMemberModal && (
                        <MemberSpecialNoteIcon
                          member={memberWithNotes}
                          onEditMember={(_, tab) => {
                            if (appointment.isTrial && appointment.leadId && onOpenEditLeadModal) {
                              onOpenEditLeadModal(appointment.leadId, tab || "note")
                            } else {
                              onOpenEditMemberModal(memberWithNotes, tab || "note")
                            }
                          }}
                          size="sm"
                          position="relative"
                        />
                      )}
                      {!isBlocked && !appointment.isTrial && onOpenTrainingPlansModal && (
                        <div 
                          className="cursor-pointer rounded p-0.5 transition-all duration-200 hover:scale-110 active:scale-95" 
                          onClick={(e) => handleDumbbellClick(appointment, e)}
                          title="Training Plans"
                        >
                          <Dumbbell className="text-white/80" size={14} />
                        </div>
                      )}
                    </div>
                    {!isBlocked && onCheckIn && (
                      <button 
                        onClick={(e) => handleCheckIn(e, appointment.id)}
                        disabled={appointment.isPast}
                        className={`min-w-[80px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                          appointment.isPast 
                            ? "bg-white/10 text-white/50 border-white/20 cursor-not-allowed" 
                            : appointment.isCheckedIn 
                              ? "bg-white/20 hover:bg-white/30 text-white/80 border-white/30" 
                              : "bg-black hover:bg-black/80 text-white border-transparent"
                        }`}
                      >
                        {appointment.isCheckedIn ? "Checked In" : "Check In"}
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-white">
                    <p className="font-semibold text-sm truncate">
                      {appointment.name} {appointment.lastName}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[11px] flex gap-1.5 items-center opacity-80">
                        <Clock size={10} />
                        {appointment._pendingMove?.originalStartTime || appointment.startTime} - {appointment.endTime}
                      </p>
                      <p className="text-[10px] opacity-70">
                        {(appointment._pendingMove?.originalDate || appointment.date)?.split("|")[0]?.trim()}
                      </p>
                    </div>
                    <p className="text-[11px] mt-1 opacity-70">
                      {appointment.isTrial 
                        ? (appointment.trialType 
                            ? `Trial Training â€¢ ${appointment.trialType}` 
                            : "Trial Training") 
                        : appointment.isCancelled 
                          ? <span className="text-red-400">Cancelled</span> 
                          : appointment.type}
                    </p>
                    {/* Show note for blocked appointments */}
                    {isBlocked && appointment.specialNote?.text && (
                      <p className="text-[10px] mt-1 text-yellow-200/90 italic truncate">
                        {appointment.specialNote.text}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Calendar size={20} className="text-gray-600" />
              </div>
              <p className="text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>
      )}

      {/* Footer - removed as we're already on appointments page */}
    </div>
  )
}

export default UpcomingAppointmentsWidget
