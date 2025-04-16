"use client"

/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {
  X,
  Clock,
  Info,
  Search,
  AlertTriangle,
  Edit,
  User,
  ZoomOut,
  ZoomIn,
  RotateCcw,
  CalendarIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import Avatar from "../../public/avatar.png"
import toast, { Toaster } from "react-hot-toast"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import TrialPlanningModal from "../components/add-trial"
import AddAppointmentModal from "../components/add-appointment-modal"
import SelectedAppointmentModal from "../components/selected-appointment-modal"
import MiniCalendar from "../components/mini-calender"
import BlockAppointmentModal from "../components/block-appointment-modal"

function Calendar({ appointments, onEventClick, onDateSelect, searchQuery, selectedDate, setAppointments }) {
  const [calendarSize, setCalendarSize] = useState(100)
  const [calendarHeight, setCalendarHeight] = useState("auto")
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [freeAppointments, setFreeAppointments] = useState([])
  const [viewMode, setViewMode] = useState("all") // "all" or "free"

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const calendarRef = useRef(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")
  const [eventInfo, setEventInfo] = useState(null)
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false)
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  // New state for the appointment action modal
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  // Sample appointment types - you can replace this with your actual data
  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()

      // Always change to day view when a date is selected from mini calendar
      calendarApi.changeView("timeGridDay", selectedDate)
    }
  }, [selectedDate])

  const generateFreeDates = () => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const freeDates = new Set() // Use a Set to store unique month-date pairs
    const slots = []

    // Toggle view mode
    setViewMode(viewMode === "all" ? "free" : "all")

    // Generate free slots for the next 3 weeks
    for (let week = 0; week < 3; week++) {
      const weekStart = new Date(startOfWeek)
      weekStart.setDate(weekStart.getDate() + week * 7)

      // Generate 3-4 random slots per week
      const slotsPerWeek = 3 + Math.floor(Math.random() * 2) // Either 3 or 4 slots

      for (let i = 0; i < slotsPerWeek; i++) {
        const randomDay = Math.floor(Math.random() * 7) // 0-6 (Sun-Sat)
        const randomHour = 8 + Math.floor(Math.random() * 10) // Between 8 AM and 6 PM
        const randomMinute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45 minutes

        const freeDate = new Date(weekStart)
        freeDate.setDate(weekStart.getDate() + randomDay)
        freeDate.setHours(randomHour, randomMinute, 0)

        // Skip dates in the past
        if (freeDate < new Date()) continue

        const formattedDate = formatDate(freeDate)
        const formattedTime = freeDate.toTimeString().split(" ")[0].substring(0, 5)

        // Store unique month-date pairs
        freeDates.add(freeDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }))

        slots.push({
          id: `free-${week}-${i}`,
          date: formattedDate,
          time: formattedTime,
        })
      }
    }

    setFreeAppointments(slots)

    if (slots.length > 0 && viewMode === "free") {
      toast.success(
        `Free slots generated for ${Array.from(freeDates).join(", ")}. Proceed to these months in the calendar below to see available slots.`,
      )
    } else {
      toast.success(viewMode === "all" ? "Showing all appointments" : "No free slots available.")
    }
  }

  const zoomIn = () => {
    setCalendarSize((prev) => Math.min(prev + 10, 150)) // Max 150%
  }

  const zoomOut = () => {
    setCalendarSize((prev) => Math.max(prev - 10, 70)) // Min 70%
  }

  const resetZoom = () => {
    setCalendarSize(100) // Reset to default
  }

  const handleViewChange = (viewInfo) => {
    if (viewInfo.view.type === "dayGridMonth") {
      setCalendarHeight("auto")
    } else {
      // For week and day views, set a fixed height that will scale with zoom
      setCalendarHeight("650px")
    }
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointments.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
    }
    setAppointments([...appointments, newTrial])
    toast.success("Trial training booked successfully")
    setIsTrialModalOpen(false)
  }

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: "scheduled",
    }
    setAppointments([...appointments, newAppointment])
    toast.success("Appointment booked successfully")
    setIsAppointmentModalOpen(false)
  }

  const handleEventDrop = (info) => {
    const { event } = info

    // Calculate the duration of the event in milliseconds
    const duration = event.end - event.start

    // Update the appointment in the state
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return {
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0], // New start time
          endTime: new Date(event.start.getTime() + duration).toTimeString().split(" ")[0], // New end time (same duration)
          date: `${event.start.toLocaleString("en-US", {
            weekday: "short",
          })} | ${formatDate(event.start)}`, // New date
        }
      }
      return appointment
    })

    // Update the state with the new appointments
    setAppointments(updatedAppointments)
    setIsNotifyMemberOpen(true)
  }

  const handleDateSelect = (selectInfo) => {
    setSelectedSlotInfo(selectInfo)
    setIsTypeSelectionOpen(true)
  }

  const handleTypeSelection = (type) => {
    setIsTypeSelectionOpen(false)
    if (type === "trial") {
      setIsTrialModalOpen(true)
    } else if (type === "appointment") {
      setIsAppointmentModalOpen(true)
    } else if (type === "block") {
      // Open the block modal with the selected date/time
      setIsBlockModalOpen(true)
    } else if (selectedSlotInfo && onDateSelect) {
      onDateSelect({ ...selectedSlotInfo, eventType: type })
    }
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    if (shouldNotify) {
      console.log("Notify member about the new time:", eventInfo.event.start)
      toast.success("Member notified successfully!")
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === eventInfo.event.id) {
          return {
            ...appointment,
            date: eventInfo.event.start.toISOString().split("T")[0],
            startTime: eventInfo.event.start.toTimeString().split(" ")[0],
            endTime: eventInfo.event.end.toTimeString().split(" ")[0],
          }
        }
        return appointment
      })
    }
  }

  // Handler for free slot click
  const handleFreeSlotClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.isFree) {
      setSelectedSlotInfo({
        start: clickInfo.event.start,
        end: clickInfo.event.end,
      })
      setIsTypeSelectionOpen(true)
    }
  }

  // New handler for event clicks
  const handleEventClick = (clickInfo) => {
    // Check if it's a free slot first
    if (clickInfo.event.extendedProps.isFree) {
      handleFreeSlotClick(clickInfo)
      return
    }

    // Otherwise, handle as regular appointment
    const appointmentId = Number.parseInt(clickInfo.event.id)
    const appointment = appointments.find((app) => app.id === appointmentId)

    if (appointment) {
      setSelectedAppointment(appointment)
      setIsAppointmentActionModalOpen(true)
    }

    if (onEventClick) {
      onEventClick(clickInfo)
    }
  }

  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    setIsEditAppointmentModalOpen(true)
  }

  const handleCancelAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    setNotifyAction("cancel")
    setIsNotifyMemberOpen(true)

    // We'll use the same notification handler but add additional logic for cancellation
    setEventInfo({
      event: {
        id: selectedAppointment.id,
        start: new Date(),
        end: new Date(),
      },
    })
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false)
    setIsMemberDetailsModalOpen(true)
  }

  // Actually cancel the appointment after notification decision
  const actuallyHandleCancelAppointment = (shouldNotify) => {
    const updatedAppointments = appointments.filter((app) => app.id !== selectedAppointment.id)
    setAppointments(updatedAppointments)
    toast.success("Appointment cancelled successfully")

    if (shouldNotify) {
      console.log("Notifying member about cancellation")
      // Additional notification logic would go here
    }
  }

  // Helper function to determine if an event is in the past
  const isEventInPast = (eventStart) => {
    const now = new Date()
    return new Date(eventStart) < now
  }

  const calendarEvents = [
    ...appointments
      .filter((appointment) => {
        // Filter by search query
        const nameMatch = appointment.name.toLowerCase().includes(searchQuery.toLowerCase())

        // Filter by selected date
        let dateMatch = true
        if (selectedDate) {
          const [_, datePart] = appointment.date.split("|")
          const appointmentDate = datePart.trim() // Format: dd-mm-yyyy
          const formattedSelectedDate = formatDate(new Date(selectedDate))
          dateMatch = appointmentDate === formattedSelectedDate
        }

        return nameMatch && dateMatch
      })
      .map((appointment) => {
        const [_, datePart] = appointment.date.split("|")
        const [day, month, year] = datePart.trim().split("-")
        const dateStr = `${year}-${month}-${day}` // Format: yyyy-mm-dd for FullCalendar

        // Create ISO date strings for event start and end
        const startDateTimeStr = `${dateStr}T${appointment.startTime}`

        // Determine if the event is in the past
        const isPastEvent = isEventInPast(startDateTimeStr)

        // Get the original color
        const backgroundColor = appointment.color.split("bg-[")[1].slice(0, -1)

        return {
          id: appointment.id,
          title: appointment.name,
          start: startDateTimeStr,
          end: `${dateStr}T${appointment.endTime}`,
          backgroundColor: viewMode === "free" ? "#555555" : backgroundColor, // Dim all appointments in free mode
          borderColor: viewMode === "free" ? "#555555" : backgroundColor,
          textColor: viewMode === "free" ? "#999999" : "#FFFFFF", // Dim text in free mode
          opacity: viewMode === "free" ? 0.5 : 1, // Make appointments semi-transparent in free mode
          isPast: isPastEvent, // Add this flag to use in eventContent
          extendedProps: {
            type: appointment.type,
            isPast: isPastEvent,
            originalColor: backgroundColor,
            viewMode: viewMode,
          },
        }
      }),
    // Add the free appointments to the events
    ...freeAppointments.map((freeSlot) => {
      const [day, month, year] = freeSlot.date.split("-")
      const dateStr = `${year}-${month}-${day}` // Format: yyyy-mm-dd for FullCalendar
      const startDateTimeStr = `${dateStr}T${freeSlot.time}`

      return {
        id: freeSlot.id,
        title: "Free Slot",
        start: startDateTimeStr,
        end: new Date(new Date(startDateTimeStr).getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1-hour duration
        backgroundColor: viewMode === "free" ? "#FFFFFF" : "#15803d", // White in free mode, green otherwise
        borderColor: viewMode === "free" ? "#15803d" : "#15803d",
        textColor: viewMode === "free" ? "#15803d" : "#FFFFFF", // Green text on white background in free mode
        extendedProps: {
          isFree: true, // Mark as free slot
          viewMode: viewMode,
        },
      }
    }),
  ]

  const handleEventResize = (info) => {
    const { event } = info

    // Update the appointment in the state
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return {
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0], // Start time stays the same
          endTime: event.end.toTimeString().split(" ")[0], // New end time after resize
          // Date format remains the same
        }
      }
      return appointment
    })

    // Update the state with the new appointments
    setAppointments(updatedAppointments)

    // Open notification modal to ask if user wants to notify member
    setNotifyAction("change")
    setEventInfo(info)
    setIsNotifyMemberOpen(true)
  }

  return (
    <>
      <div className="h-full w-full">
        {/* Zoom controls */}
        <div className="flex items-center justify-end mb-2 gap-2">
          <div className="text-sm text-gray-500">Size: {calendarSize}%</div>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Reset zoom"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={generateFreeDates}
            className="p-1.5 rounded-md lg:block hidden bg-gray-600 cursor-pointer hover:bg-green-600 text-white px-3 py-2 font-medium text-sm"
            aria-label={viewMode === "all" ? "Show Free Slots" : "Show All Slots"}
          >
            {viewMode === "all" ? "Free Slots" : "All Slots"}
          </button>
        </div>
        <button
          onClick={generateFreeDates}
          className="p-1.5 rounded-md w-full lg:hidden block bg-gray-600 cursor-pointer hover:bg-green-600 text-white px-3 py-2 font-medium text-sm"
          aria-label={viewMode === "all" ? "Show Free Slots" : "Show All Slots"}
        >
          {viewMode === "all" ? "Free Slots" : "All Slots"}
        </button>

        <div className="max-w-7xl overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <div
            className="min-w-[768px] transition-all duration-300 ease-in-out"
            style={{
              transform: `scale(${calendarSize / 100})`,
              transformOrigin: "top left",
              width: `${10000 / calendarSize}%`, // Adjust container width to maintain layout
            }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || "2025-02-03"}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              height={calendarHeight}
              selectable={true}
              editable={true}
              eventDrop={handleEventDrop}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              nowIndicator={true}
              slotDuration="01:00:00"
              firstDay={1}
              eventClick={handleEventClick}
              eventResize={handleEventResize}
              select={handleDateSelect}
              viewDidMount={handleViewChange}
              datesSet={handleViewChange}
              eventContent={(eventInfo) => (
                <div
                  className={`p-1 h-full overflow-hidden ${
                    eventInfo.event.extendedProps.isPast ? "opacity-50" : ""
                  } ${eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree ? "opacity-40" : ""}`}
                >
                  <div
                    className={`font-semibold text-xs sm:text-sm truncate ${
                      eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    {eventInfo.event.title}
                  </div>
                  <div
                    className={`text-xs opacity-90 truncate ${
                      eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    {eventInfo.event.extendedProps.isPast ? "Past: " : ""}
                    {eventInfo.event.extendedProps.type}
                  </div>
                  <div className="text-xs mt-1">{eventInfo.timeText}</div>
                </div>
              )}
              eventClassNames={(eventInfo) => {
                if (eventInfo.event.extendedProps.isPast) {
                  return "past-event"
                }
                if (eventInfo.event.extendedProps.isFree) {
                  return "free-slot-event cursor-pointer"
                }
                return ""
              }}
            />
          </div>
        </div>
      </div>

      {/* Add CSS for past events and free slots */}
      <style jsx>{`
        :global(.past-event) {
          cursor: default !important;
          opacity: 0.6 !important;
        }

        :global(.free-slot-event) {
          cursor: pointer !important;
          border-left: 3px solid #15803d !important;
        }
        
        :global(.fc-event-main) {
          transition: all 0.3s ease;
        }
      `}</style>

      <TrialPlanningModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
        selectedDate={selectedSlotInfo?.start}
      />

      <AddAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointmentTypes={appointmentTypes}
        onSubmit={handleAppointmentSubmit}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
        selectedDate={selectedSlotInfo?.start}
      />

      {/* Type Selection Modal */}
      {isTypeSelectionOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsTypeSelectionOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Select Event Type</h2>
              <button
                onClick={() => setIsTypeSelectionOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => handleTypeSelection("trial")}
                className="w-full px-5 py-3 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer transition-colors"
              >
                Trial Planning
              </button>
              <button
                onClick={() => handleTypeSelection("appointment")}
                className="w-full px-5 py-3 bg-[#FF843E] text-sm font-medium text-white rounded-xl hover:bg-orange-700 cursor-pointer transition-colors"
              >
                Appointment
              </button>
              <button
                onClick={() => handleTypeSelection("block")}
                className="w-full px-5 py-3 bg-[#FF4D4F] text-sm font-medium text-white rounded-xl hover:bg-red-700 cursor-pointer transition-colors"
              >
                Block Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Action Modal */}
      {isAppointmentActionModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsAppointmentActionModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Appointment Options</h2>
              <button
                onClick={() => setIsAppointmentActionModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <div className="mb-4">
                <h3 className="text-white font-medium">{selectedAppointment.name}</h3>
                <p className="text-gray-400 text-sm">{selectedAppointment.type}</p>
                <p className="text-gray-400 text-sm">
                  {selectedAppointment.date && selectedAppointment.date.split("|")[1]} •{selectedAppointment.startTime}{" "}
                  - {selectedAppointment.endTime}
                </p>
                {isEventInPast(
                  `${selectedAppointment.date
                    .split("|")[1]
                    .trim()
                    .split("-")
                    .reverse()
                    .join("-")}T${selectedAppointment.startTime}`,
                ) && <p className="text-yellow-500 text-sm mt-2">This is a past appointment</p>}
              </div>

              <button
                onClick={handleEditAppointment}
                className={`w-full px-5 py-3 ${
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      .trim()
                      .split("-")
                      .reverse()
                      .join("-")}T${selectedAppointment.startTime}`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#3F74FF] hover:bg-[#3F74FF]/90 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={isEventInPast(
                  `${selectedAppointment.date
                    .split("|")[1]
                    .trim()
                    .split("-")
                    .reverse()
                    .join("-")}T${selectedAppointment.startTime}`,
                )}
              >
                <Edit className="mr-2" size={16} /> Edit Appointment
              </button>

              <button
                onClick={handleCancelAppointment}
                className={`w-full px-5 py-3 ${
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      .trim()
                      .split("-")
                      .reverse()
                      .join("-")}T${selectedAppointment.startTime}`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={isEventInPast(
                  `${selectedAppointment.date
                    .split("|")[1]
                    .trim()
                    .split("-")
                    .reverse()
                    .join("-")}T${selectedAppointment.startTime}`,
                )}
              >
                <X className="mr-2" size={16} /> Cancel Appointment
              </button>

              <button
                onClick={handleViewMemberDetails}
                className="w-full px-5 py-3 bg-gray-700 text-sm font-medium text-white rounded-xl hover:bg-gray-600 cursor-pointer transition-colors flex items-center justify-center"
              >
                <User className="mr-2" size={16} /> View Member Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notify Member Modal */}
      {isNotifyMemberOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsNotifyMemberOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Notify Member</h2>
              <button
                onClick={() => setIsNotifyMemberOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Do you want to notify the member about this{" "}
                {notifyAction === "change" ? "change" : notifyAction === "cancel" ? "cancellation" : "booking"}?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => {
                  if (notifyAction === "cancel") {
                    actuallyHandleCancelAppointment(true)
                  } else {
                    handleNotifyMember(true)
                  }
                  setIsNotifyMemberOpen(false)
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Notify Member
              </button>
              <button
                onClick={() => {
                  if (notifyAction === "cancel") {
                    actuallyHandleCancelAppointment(false)
                  } else {
                    handleNotifyMember(false)
                  }
                  setIsNotifyMemberOpen(false)
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Don't Notify
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [view, setView] = useState("week")
  const [selectedDate, setSelectedDate] = useState(null)
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)
  const [checkedInMembers, setCheckedInMembers] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false)
  const [appointmentToRemove, setAppointmentToRemove] = useState(null)
  const [isShowDetails, setisShowDetails] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [checkedOutMembers, setCheckedOutMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [freeAppointments, setFreeAppointments] = useState([
    { id: "free1", date: "2025-01-03", time: "10:00" },
    { id: "free2", date: "2025-01-03", time: "11:00" },
    { id: "free3", date: "2025-01-03", time: "14:00" },
  ])
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
  ])
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Yolanda",
      time: "10:00 - 14:00",
      date: "Mon | 03-08-2025",
      color: "bg-[#4169E1]",
      startTime: "10:00",
      endTime: "14:00",
      type: "Strength Training",
      specialNote: {
        text: "Prefers morning sessions",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 2,
      name: "Alexandra",
      time: "10:00 - 18:00",
      date: "Tue | 04-02-2025",
      color: "bg-[#FF6B6B]",
      startTime: "10:00",
      endTime: "18:00",
      type: "Cardio",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: true,
    },
    {
      id: 3,
      name: "Marcus",
      time: "14:00 - 16:00",
      date: "Wed | 05-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 4,
      name: "John",
      time: "14:00 - 16:00",
      date: "Thu | 06-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
  ])

  const [filteredAppointments, setFilteredAppointments] = useState(appointments)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [appointments, selectedDate, searchQuery])

  const notePopoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
        setActiveNoteId(null)
      }
    }

    if (activeNoteId !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeNoteId])

  // Consolidated function to apply all filters (date and search)
  const applyFilters = () => {
    let filtered = [...appointments]

    // Apply date filter if a date is selected
    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate)
      filtered = filtered.filter((appointment) => {
        const appointmentDate = appointment.date.split("|")[1].trim()
        return appointmentDate === formattedSelectedDate
      })
    }

    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter((appointment) => appointment.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredAppointments(filtered)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    // No need to filter here, as it will be done by the useEffect
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null)
      setIsViewDropdownOpen(false)
      setActiveNoteId(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: "pending",
      isTrial: false,
      // Format date properly when adding new appointment
      date: `${new Date(appointmentData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
    }
    setAppointments([...appointments, newAppointment])
    toast.success("Appointment booked successfully")
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointments.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
      // Format date properly when adding new trial
      date: `${new Date(trialData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    }
    setAppointments([...appointments, newTrial])
    toast.success("Trial training booked successfully")
  }

  const handleCheckIn = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment,
      ),
    )
    toast.success(
      appointments.find((app) => app.id === appointmentId)?.isCheckedIn
        ? "Member checked In successfully"
        : "Member check in successfully",
    )
  }

  const handleAppointmentChange = (changes) => {
    setSelectedAppointment((prev) => {
      const updatedAppointment = { ...prev, ...changes }
      if (changes.specialNote) {
        updatedAppointment.specialNote = {
          ...prev.specialNote,
          ...changes.specialNote,
        }
      }
      return updatedAppointment
    })
  }

  const handleRemoveAppointment = (appointment) => {
    setAppointmentToRemove(appointment)
    setIsConfirmCancelOpen(true)
    setActiveDropdownId(null)
  }

  const confirmRemoveAppointment = () => {
    setIsConfirmCancelOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("cancel")
    // We'll handle the actual removal after user decides on notification
  }

  const handleNotifyMember = (shouldNotify) => {
    const changes = {}
    let updatedAppointment
    if (notifyAction === "change") {
      updatedAppointment = { ...selectedAppointment, ...changes }
      const updatedAppointments = appointments.map((app) =>
        app.id === updatedAppointment.id ? updatedAppointment : app,
      )
      setAppointments(updatedAppointments)
      setSelectedAppointment(null)
      toast.success("Appointment updated successfully")
    } else if (notifyAction === "cancel") {
      setAppointments(appointments.filter((app) => app.id !== appointmentToRemove.id))
      setAppointmentToRemove(null)
      toast.success("Appointment removed successfully")
    }

    if (shouldNotify) {
      // Here you would implement the actual notification logic
      toast.success("Member notified successfully")
    }

    setIsNotifyMemberOpen(false)
  }

  // Modified search handler to update the search query state
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === "") {
      setSelectedMember(null)
    } else {
      const foundMember = appointments.find((app) => app.name.toLowerCase().includes(query))
      setSelectedMember(foundMember ? foundMember.name : null)
    }

    // No need to filter here, as it will be done by the useEffect
  }

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId))
    setSelectedAppointment(null) // Clear the selected appointment
    toast.success("Appointment deleted successfully")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      // If no note text, return null
      if (!specialNote.text) return null

      // Check note validity
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))

      // If note is not active, return null
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(activeNoteId === memberId ? null : memberId)
      }

      return (
        <div className="relative">
          <div
            className={`${
              specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {activeNoteId === memberId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
            >
              {/* Header section with icon and title */}
              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                {specialNote.isImportant === "important" ? (
                  <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                ) : (
                  <Info className="text-blue-500 shrink-0" size={18} />
                )}
                <h4 className="text-white flex gap-1 items-center font-medium">
                  <div>Special Note</div>
                  <div className="text-sm text-gray-400 ">
                    {specialNote.isImportant === "important" ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveNoteId(null)
                  }}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Note content */}
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>

                {/* Date validity section */}
                {specialNote.startDate && specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Always valid
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [activeNoteId, setActiveNoteId],
  )

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl oxanium_font sm:text-2xl font-bold text-white">Appointments</h1>
              <button
                onClick={toggleSidebar}
                className="  bg-[#3F74FF] text-white p-1.5 rounded-full z-10 shadow-lg hover:bg-[#3F74FF]/90 transition-colors lg:flex hidden"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
            <div className="flex items-center md:flex-row flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
              >
                Add appointment
              </button>
              <button
                onClick={() => setIsTrialModalOpen(true)}
                className="w-full sm:w-auto bg-[#3F74FF] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                Add trial training
              </button>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-gray-700/90 transition-colors duration-200"
              >
                Block Appointment
              </button>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col gap-6 relative">
            <div
              className={`transition-all duration-500 ease-in-out ${
                isSidebarCollapsed
                  ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0"
                  : "lg:w-[40%] lg:opacity-100"
              } w-full flex flex-col gap-6`}
            >
              <div className="">
                <MiniCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>

              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search member..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full bg-[#000000] text-white rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div>
                  <h2 className="text-white font-bold mb-4">Upcoming Appointments</h2>
                  <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[200px]">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment, index) => (
                        <div
                          key={appointment.id}
                          className={`${appointment.color} rounded-xl cursor-pointer p-5 relative`}
                        >
                          <div className="absolute p-2 top-0 left-0 z-10">
                            {renderSpecialNoteIcon(appointment.specialNote, appointment.id)}
                          </div>
                          <div
                            className="flex flex-col sm:flex-row items-center justify-between gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setIsAppointmentActionModalOpen(true)
                            }}
                          >
                            <div className="flex items-center gap-2 ml-5 relative w-full sm:w-auto justify-center sm:justify-start">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                                <img src={Avatar || "/placeholder.svg"} alt="" className="w-full h-full rounded-full" />
                              </div>
                              <div className="text-white text-left">
                                <p className="font-semibold">{appointment.name}</p>
                                <p className="text-xs flex gap-1 items-center opacity-80 justify-center sm:justify-start">
                                  <Clock size={14} />
                                  {appointment.time} | {appointment.date.split("|")[0]}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                              <div className="text-white text-center sm:text-right w-full sm:w-auto">
                                <p className="text-xs">
                                  {appointment.isTrial ? (
                                    <span className="font-medium ">Trial Session</span>
                                  ) : (
                                    appointment.type
                                  )}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCheckIn(appointment.id)
                                  }}
                                  className={`mt-1 px-3 py-1 text-xs font-medium rounded-lg w-full sm:w-auto ${
                                    appointment.isCheckedIn
                                      ? "bg-gray-500 bg-opacity-50 text-white"
                                      : "bg-black text-white"
                                  }`}
                                >
                                  {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white text-center">No appointments scheduled for this date.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width calendar */}
            <div
              className={`w-full bg-[#000000] rounded-xl p-4 overflow-hidden transition-all duration-500 ${
                isSidebarCollapsed ? "lg:w-full" : ""
              }`}
            >
              <Calendar
                appointments={appointments}
                onDateSelect={handleDateSelect}
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                setAppointments={setAppointments}
              />
            </div>
          </div>
        </div>
      </main>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointmentTypes={appointmentTypes}
        onSubmit={handleAppointmentSubmit}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
      />

      <TrialPlanningModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
      />

      <SelectedAppointmentModal
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        appointmentTypes={appointmentTypes}
        freeAppointments={freeAppointments}
        handleAppointmentChange={handleAppointmentChange}
        appointments={appointments}
        setAppointments={setAppointments}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
        onDelete={handleDeleteAppointment}
      />

      {isConfirmCancelOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsConfirmCancelOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Confirm Cancellation</h2>
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Are you sure you want to cancel this appointment with {appointmentToRemove?.name} on{" "}
                {appointmentToRemove?.date} at {appointmentToRemove?.time}?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={confirmRemoveAppointment}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Appointment
              </button>
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {isNotifyMemberOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsNotifyMemberOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Notify Member</h2>
              <button
                onClick={() => setIsNotifyMemberOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Do you want to notify the member about this{" "}
                {notifyAction === "change" ? "change" : notifyAction === "cancel" ? "cancellation" : "booking"}?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => handleNotifyMember(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Notify Member
              </button>
              <button
                onClick={() => handleNotifyMember(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Don't Notify
              </button>
            </div>
          </div>
        </div>
      )}
      <BlockAppointmentModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        appointmentTypes={appointmentTypes}
        selectedDate={selectedDate || new Date()}
        onSubmit={(blockData) => {
          // Create a blocked time slot
          const newBlock = {
            id: appointments.length + 1,
            name: "BLOCKED",
            time: `${blockData.startTime} - ${blockData.endTime}`,
            date: `${new Date(blockData.date).toLocaleString("en-US", {
              weekday: "short",
            })} | ${formatDateForDisplay(new Date(blockData.date))}`,
            color: "bg-[#FF4D4F]",
            startTime: blockData.startTime,
            endTime: blockData.endTime,
            type: "Blocked Time",
            specialNote: {
              text: blockData.note || "This time slot is blocked",
              startDate: null,
              endDate: null,
              isImportant: true,
            },
            status: "blocked",
            isBlocked: true,
          }
          setAppointments([...appointments, newBlock])
          toast.success("Time slot blocked successfully")
          setIsBlockModalOpen(false)
        }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  )
}
