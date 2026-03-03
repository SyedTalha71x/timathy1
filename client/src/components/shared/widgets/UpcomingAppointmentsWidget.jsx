/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { Clock, Dumbbell, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { MemberSpecialNoteIcon } from "../../shared/special-note/shared-special-note-icon"
import DatePickerField from "../DatePickerField"

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
  backgroundColor = "bg-surface-base", // Background color - can be customized per context
  showDatePicker = false,     // Show date picker in header (for my-area)
  initialDate = null,         // Initial date to show (defaults to today)
  filterDate = null,          // External date to filter by (from parent component)
  showHeader = true,          // Show widget header
  showDateIndicator = false,  // Show date indicator next to title (for sidebar)
  maxItems = null             // Maximum items to display (for sidebar)
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date())
  // Measure actual item heights for maxItems constraint
  const listRef = useRef(null)
  const [computedMaxHeight, setComputedMaxHeight] = useState(null)

  useEffect(() => {
    if (!maxItems || !listRef.current) {
      setComputedMaxHeight(null)
      return
    }
    const frame = requestAnimationFrame(() => {
      const el = listRef.current
      if (!el) return
      const children = el.children
      if (children.length === 0) { setComputedMaxHeight(null); return }
      const count = Math.min(maxItems, children.length)
      const firstRect = children[0].getBoundingClientRect()
      const lastRect = children[count - 1].getBoundingClientRect()
      setComputedMaxHeight(lastRect.bottom - firstRect.top + 4)
    })
    return () => cancelAnimationFrame(frame)
  }, [maxItems, appointments, selectedDate])


  // Sync with filterDate from parent (e.g., mini calendar selection)
  useEffect(() => {
    if (filterDate) {
      setSelectedDate(filterDate)
    }
  }, [filterDate])

  // Helper: convert Date to YYYY-MM-DD string for DatePickerField
  const dateToString = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Handle date change from DatePickerField (YYYY-MM-DD string)
  const handleDatePickerChange = (val) => {
    if (val) {
      const [y, m, d] = val.split('-')
      setSelectedDate(new Date(+y, +m - 1, +d))
    } else {
      setSelectedDate(new Date()) // Reset to today when cleared
    }
  }

  // lets normalize backend api
  // 🔁 Normalize backend appointment structure to match widget expectations
  const normalizedAppointments = appointments.map(item => {
  const appointmentDate = new Date(item.date);
  const [hours, minutes] = (item.timeSlot?.start || "00:00").split(":");
  const startDateTime = new Date(item.date);
  startDateTime.setUTCHours(+hours, +minutes, 0, 0);

  return {
    ...item,
    id: item._id,
    memberId: item.member?._id,
    name: item.member?.firstName || "",
    lastName: item.member?.lastName || "",
    startTime: item.timeSlot?.start || "",
    endTime: item.timeSlot?.end || "",
    type: item.serviceId?.name || "",
    isCancelled: item.status === "canceled",
    isBlocked: item.timeSlot?.isBlocked || false,
    isPast: startDateTime < new Date(),
    isTrial: item.isTrial || false,
    color: "bg-primary",
    originalISODate: item.date
  };
});




  // Filter appointments by selected date (when showDatePicker is true OR filterDate is provided)
  const getFilteredAppointments = () => {
    if (!showDatePicker && !filterDate) {
      return normalizedAppointments
    }

    return normalizedAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.originalISODate)
      const selected = new Date(selectedDate)

      return (
        appointmentDate.getFullYear() === selected.getFullYear() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getDate() === selected.getDate()
      )
    })
  }

  // Filter for upcoming appointments (not cancelled, not blocked)
  const upcomingAppointments = normalizedAppointments
  .filter(app => !app.isCancelled && !app.isBlocked && !app.isTrial);
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
    <div
      className={`rounded-xl ${backgroundColor} flex flex-col ${isCollapsed
        ? 'h-auto'
        : useFixedHeight
          ? 'h-[320px] md:h-[340px]'
          : 'flex-1 min-h-0'
        }`}
    >
      {/* Full Header with title */}
      {showHeader && (
        <div className="flex justify-between items-center flex-shrink-0 px-3 pt-2.5 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-content-primary">Upcoming Appointments</h2>

            {/* Show selected date indicator when explicitly enabled */}
            {showDateIndicator && filterDate && !showDatePicker && (
              <span className="text-xs text-content-muted bg-surface-button px-2 py-0.5 rounded-lg">
                {formatDisplayDate(selectedDate)}
              </span>
            )}

            {/* Date Picker Button (only in my-area) */}
            {showDatePicker && (
              <div
                className="flex items-center gap-1.5 px-2 py-1 bg-surface-base hover:bg-surface-dark rounded-lg text-xs text-content-secondary hover:text-content-primary cursor-pointer transition-colors"
                onClick={(e) => {
                  const btn = e.currentTarget.querySelector('button')
                  if (btn && e.target !== btn && !btn.contains(e.target)) btn.click()
                }}
              >
                <span>{formatDisplayDate(selectedDate)}</span>
                <DatePickerField
                  value={dateToString(selectedDate)}
                  onChange={handleDatePickerChange}
                  iconSize={12}
                />
              </div>
            )}
          </div>

          {!isSidebarEditing && showCollapseButton && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 bg-surface-button hover:bg-surface-button-hover rounded-lg cursor-pointer transition-colors text-content-primary"
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
          <div
            className="flex items-center gap-1.5 px-2 py-1 bg-surface-base hover:bg-surface-dark rounded-lg text-xs text-content-secondary hover:text-content-primary cursor-pointer transition-colors"
            onClick={(e) => {
              const btn = e.currentTarget.querySelector('button')
              if (btn && e.target !== btn && !btn.contains(e.target)) btn.click()
            }}
          >
            <span>{formatDisplayDate(selectedDate)}</span>
            <DatePickerField
              value={dateToString(selectedDate)}
              onChange={handleDatePickerChange}
              iconSize={12}
            />
          </div>
        </div>
      )}

      {/* Appointments List */}
      {!isCollapsed && (
        <div
          ref={listRef}
          className="overflow-y-auto custom-scrollbar px-3 pb-2 space-y-2 flex-1 min-h-0"
          style={computedMaxHeight ? { maxHeight: `${computedMaxHeight}px` } : undefined}
        >
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => {
              const name = appointment.name || ""
              const isBlocked = appointment.timeSlot?.isBlocked 

              // Get member data to access their special notes
              const memberData = getMemberById ? getMemberById(appointment.memberId) : null
              const memberWithNotes = {
                ...appointment,
                id: appointment.memberId || appointment._id,
                name,
                note: memberData?.note || "",
                noteStartDate: memberData?.noteStartDate || "",
                noteEndDate: memberData?.noteEndDate || "",
                noteImportance: memberData?.noteImportance || "unimportant",
                notes: memberData?.notes || [],
              }

              return (
                <div
                  key={appointment.id}
                  className={`${appointment.color} ${appointment.isCancelled ? "bg-surface-button" : ""
                    } ${appointment.isPast && !appointment.isCancelled ? "opacity-45" : ""
                    } ${isBlocked ? "bg-surface-dark" : ""
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
                          onColoredBackground
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
                        className={`min-w-[80px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${appointment.isPast
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
                        {new Date(appointment.originalISODate).toLocaleDateString("en-US", {
                          weekday: "short"
                        })?.split("|")[0]?.trim()}
                      </p>
                    </div>
                    <p className="text-[11px] mt-1 opacity-70">
                      {appointment.isTrial
                        ? (appointment.trialType
                          ? `Trial Training • ${appointment.trialType}`
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
            <div className="flex flex-col items-center justify-center py-8 text-content-faint">
              <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mb-3">
                <Calendar size={20} className="text-content-faint" />
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
