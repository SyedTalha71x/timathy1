/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

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
import {appointmentsData} from "../states/states"

function Calendar({ appointments = [], onEventClick, onDateSelect, searchQuery = "", selectedDate, setAppointments }) {
  const [calendarSize, setCalendarSize] = useState(100)
  const [calendarHeight, setCalendarHeight] = useState("auto")
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [freeAppointments, setFreeAppointments] = useState([])
  const [viewMode, setViewMode] = useState("all")

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
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView("timeGridDay", selectedDate)
    }
  }, [selectedDate])

  const generateFreeDates = () => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const freeDates = new Set()
    const slots = []

    setViewMode(viewMode === "all" ? "free" : "all")

    for (let week = 0; week < 3; week++) {
      const weekStart = new Date(startOfWeek)
      weekStart.setDate(weekStart.getDate() + week * 7)
      const slotsPerWeek = 3 + Math.floor(Math.random() * 2)

      for (let i = 0; i < slotsPerWeek; i++) {
        const randomDay = Math.floor(Math.random() * 7)
        const randomHour = 8 + Math.floor(Math.random() * 10)
        const randomMinute = Math.floor(Math.random() * 4) * 15

        const freeDate = new Date(weekStart)
        freeDate.setDate(weekStart.getDate() + randomDay)
        freeDate.setHours(randomHour, randomMinute, 0)

        if (freeDate < new Date()) continue

        const formattedDate = formatDate(freeDate)
        const formattedTime = freeDate.toTimeString().split(" ")[0].substring(0, 5)

        freeDates.add(freeDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }))

        slots.push({
          id: `free-${week}-${i}`,
          date: formattedDate,
          time: formattedTime,
        })
      }
    }

    setFreeAppointments(slots)

    if (slots.length > 0 && viewMode === "all") {
      toast.success(
        `Free slots generated for ${Array.from(freeDates).join(", ")}. Available slots are now highlighted.`,
      )
    } else {
      toast.success(viewMode === "all" ? "Showing all appointments" : "Showing free slots only.")
    }
  }

  const zoomIn = () => {
    setCalendarSize((prev) => Math.min(prev + 10, 150))
  }

  const zoomOut = () => {
    setCalendarSize((prev) => Math.max(prev - 10, 70))
  }

  const resetZoom = () => {
    setCalendarSize(100)
  }

  const handleViewChange = (viewInfo) => {
    if (viewInfo.view.type === "dayGridMonth") {
      setCalendarHeight("auto")
    } else {
      setCalendarHeight("650px")
    }
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: (appointments?.length || 0) + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
    }

    if (setAppointments) {
      setAppointments([...(appointments || []), newTrial])
    }
    toast.success("Trial training booked successfully")
    setIsTrialModalOpen(false)
  }

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: (appointments?.length || 0) + 1,
      ...appointmentData,
      status: "scheduled",
    }

    if (setAppointments) {
      setAppointments([...(appointments || []), newAppointment])
    }
    toast.success("Appointment booked successfully")
    setIsAppointmentModalOpen(false)
  }

  const handleEventDrop = (info) => {
    const { event } = info
    const duration = event.end - event.start

    if (!appointments || !setAppointments) return

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return {
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0],
          endTime: new Date(event.start.getTime() + duration).toTimeString().split(" ")[0],
          date: `${event.start.toLocaleString("en-US", {
            weekday: "short",
          })} | ${formatDate(event.start)}`,
        }
      }
      return appointment
    })

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
      setIsBlockModalOpen(true)
    } else if (selectedSlotInfo && onDateSelect) {
      onDateSelect({ ...selectedSlotInfo, eventType: type })
    }
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    if (shouldNotify) {
      console.log("Notify member about the new time:", eventInfo?.event?.start)
      toast.success("Member notified successfully!")
      if (appointments && setAppointments && eventInfo?.event) {
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

        setAppointments(updatedAppointments)
      }
    }
  }

  const handleFreeSlotClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.isFree) {
      setSelectedSlotInfo({
        start: clickInfo.event.start,
        end: clickInfo.event.end,
      })
      setIsTypeSelectionOpen(true)
    }
  }

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.isFree) {
      handleFreeSlotClick(clickInfo)
      return
    }

    const appointmentId = Number.parseInt(clickInfo.event.id)
    const appointment = appointments?.find((app) => app.id === appointmentId)

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
    setEventInfo({
      event: {
        id: selectedAppointment?.id,
        start: new Date(),
        end: new Date(),
      },
    })
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false)
    setIsMemberDetailsModalOpen(true)
  }

  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointments || !setAppointments || !selectedAppointment) return

    const updatedAppointments = appointments.filter((app) => app.id !== selectedAppointment.id)
    setAppointments(updatedAppointments)
    toast.success("Appointment cancelled successfully")

    if (shouldNotify) {
      console.log("Notifying member about cancellation")
    }
  }

  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

  const safeAppointments = appointments || []
  const safeSearchQuery = searchQuery || ""

  const filteredAppointments = safeAppointments.filter((appointment) => {
    const nameMatch = appointment.name?.toLowerCase().includes(safeSearchQuery.toLowerCase()) || false
    let dateMatch = true

    if (selectedDate && appointment.date) {
      const dateParts = appointment.date.split("|")
      if (dateParts.length > 1) {
        const appointmentDate = dateParts[1].trim()
        const formattedSelectedDate = formatDate(new Date(selectedDate))
        dateMatch = appointmentDate === formattedSelectedDate
      }
    }

    return nameMatch && dateMatch
  })

  const calendarEvents = [
    ...filteredAppointments
      .map((appointment) => {
        const dateParts = appointment.date?.split("|") || []
        if (dateParts.length < 2) return null

        const datePart = dateParts[1].trim()
        const dateComponents = datePart.split("-")
        if (dateComponents.length !== 3) return null

        const [day, month, year] = dateComponents
        const dateStr = `${year}-${month}-${day}`
        const startDateTimeStr = `${dateStr}T${appointment.startTime || "00:00"}`
        const endDateTimeStr = `${dateStr}T${appointment.endTime || "01:00"}`

        const isPastEvent = isEventInPast(startDateTimeStr)

        const backgroundColor = isPastEvent
          ? "#4a4a4a"
          : viewMode === "free"
            ? "#555555"
            : appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"

        return {
          id: appointment.id,
          title: appointment.name,
          start: startDateTimeStr,
          end: endDateTimeStr,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          textColor: isPastEvent ? "#999999" : viewMode === "free" ? "#999999" : "#FFFFFF",
          opacity: isPastEvent ? 0.4 : viewMode === "free" ? 0.3 : 1,
          isPast: isPastEvent,
          extendedProps: {
            type: appointment.type || "Unknown",
            isPast: isPastEvent,
            originalColor: backgroundColor,
            viewMode: viewMode,
            appointment: appointment,
          },
        }
      })
      .filter(Boolean),

    ...freeAppointments.map((freeSlot) => {
      const [day, month, year] = freeSlot.date.split("-")
      const dateStr = `${year}-${month}-${day}`
      const startDateTimeStr = `${dateStr}T${freeSlot.time}`

      return {
        id: freeSlot.id,
        title: "Available Slot",
        start: startDateTimeStr,
        end: new Date(new Date(startDateTimeStr).getTime() + 60 * 60 * 1000).toISOString(),
        backgroundColor: viewMode === "free" ? "#22c55e" : "#15803d",
        borderColor: viewMode === "free" ? "#16a34a" : "#15803d",
        textColor: "#FFFFFF",
        opacity: viewMode === "free" ? 1 : 0.8,
        extendedProps: {
          isFree: true,
          viewMode: viewMode,
        },
      }
    }),
  ]

  const handleEventResize = (info) => {
    const { event } = info

    if (!appointments || !setAppointments) return

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return {
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0],
          endTime: event.end.toTimeString().split(" ")[0],
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    setNotifyAction("change")
    setEventInfo(info)
    setIsNotifyMemberOpen(true)
  }

  return (
    <>
      <div className="h-full w-full">
        <div className="flex items-center justify-end mb-2 gap-2">
          <div className="flex items-center gap-2">
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
          </div>

          <button
            onClick={generateFreeDates}
            className={`p-1.5 rounded-md lg:block cursor-pointer text-white px-3 py-2 font-medium text-sm transition-colors ${
              viewMode === "all" ? "bg-gray-600 hover:bg-green-600" : "bg-green-600 hover:bg-gray-600"
            }`}
            aria-label={viewMode === "all" ? "Show Free Slots" : "Show All Slots"}
          >
            {viewMode === "all" ? "Free Slots" : "All Slots"}
          </button>
        </div>

        <div className="max-w-full overflow-x-auto bg-black" style={{ WebkitOverflowScrolling: "touch" }}>
          <div
            className="min-w-[1200px] transition-all duration-300 ease-in-out"
            style={{
              transform: `scale(${calendarSize / 100})`,
              transformOrigin: "top left",
              width: `${12000 / calendarSize}%`,
            }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || "2025-02-03"}
              headerToolbar={{
                left: "prev,next dayGridMonth,timeGridWeek,timeGridDay",
                center: "title",
                right: "",
                end: "today",
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
              slotDuration="00:30:00"
              firstDay={1}
              eventClick={handleEventClick}
              eventResize={handleEventResize}
              select={handleDateSelect}
              viewDidMount={handleViewChange}
              datesSet={handleViewChange}
              dayMaxEvents={false}
              eventMaxStack={10}
              eventContent={(eventInfo) => (
                <div
                  className={`p-1 h-full overflow-hidden transition-all duration-200 ${
                    eventInfo.event.extendedProps.isPast ? "opacity-40" : ""
                  } ${
                    eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                      ? "opacity-30"
                      : ""
                  } ${
                    eventInfo.event.extendedProps.isFree && eventInfo.event.extendedProps.viewMode === "free"
                      ? "ring-2 ring-green-400 ring-opacity-75 shadow-lg transform scale-105"
                      : ""
                  }`}
                >
                  <div
                    className={`font-semibold text-xs sm:text-sm truncate ${
                      eventInfo.event.extendedProps.isPast
                        ? "text-gray-400"
                        : eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                          ? "text-gray-500"
                          : eventInfo.event.extendedProps.isFree && eventInfo.event.extendedProps.viewMode === "free"
                            ? "text-white font-bold"
                            : ""
                    }`}
                  >
                    {eventInfo.event.extendedProps.isPast ? `${eventInfo.event.title}` : eventInfo.event.title}
                  </div>
                  <div
                    className={`text-xs opacity-90 truncate ${
                      eventInfo.event.extendedProps.isPast
                        ? "text-gray-500"
                        : eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                          ? "text-gray-500"
                          : ""
                    }`}
                  >
                    {eventInfo.event.extendedProps.type || "Available"}
                  </div>
                  <div className="text-xs mt-1">{eventInfo.timeText}</div>
                </div>
              )}
              eventClassNames={(eventInfo) => {
                const classes = []
                if (eventInfo.event.extendedProps.isPast) {
                  classes.push("past-event")
                }
                if (eventInfo.event.extendedProps.isFree) {
                  classes.push("free-slot-event cursor-pointer")
                  if (eventInfo.event.extendedProps.viewMode === "free") {
                    classes.push("prominent-free-slot")
                  }
                }
                return classes.join(" ")
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.past-event) {
          cursor: default !important;
          opacity: 0.4 !important;
          filter: grayscale(0.7);
        }

        :global(.free-slot-event) {
          cursor: pointer !important;
          border-left: 3px solid #15803d !important;
          transition: all 0.3s ease;
        }

        :global(.prominent-free-slot) {
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.5) !important;
          border: 2px solid #22c55e !important;
          transform: scale(1.02);
          z-index: 10;
        }

        :global(.fc-event-main) {
          transition: all 0.3s ease;
        }

        :global(.fc-theme-standard) {
          background-color: #000000;
          color: #ffffff;
        }

        :global(.fc-theme-standard .fc-scrollgrid) {
          border-color: #333333;
        }

        :global(.fc-theme-standard td, .fc-theme-standard th) {
          border-color: #333333;
        }

        :global(.fc-col-header-cell) {
          background-color: #1a1a1a;
          color: #ffffff;
          min-width: 180px !important;
          width: 180px !important;
        }

        :global(.fc-timegrid-col) {
          min-width: 180px !important;
          width: 180px !important;
        }

        :global(.fc-timegrid-slot) {
          background-color: #000000;
          border-color: #333333;
        }

        :global(.fc-timegrid-slot-lane) {
          background-color: #000000;
        }

        :global(.fc-timegrid-slot-minor) {
          border-color: #222222;
        }

        :global(.fc-toolbar-title) {
          color: #ffffff;
        }

        :global(.fc-button) {
          background-color: #333333 !important;
          border-color: #444444 !important;
          color: #ffffff !important;
        }

        :global(.fc-button-active) {
          background-color: #555555 !important;
        }

        :global(.fc-toolbar) {
          margin-bottom: 0 !important;
          padding: 0 !important;
          align-items: center !important;
          height: 40px !important;
        }

        :global(.fc-toolbar-chunk) {
          display: flex !important;
          align-items: center !important;
          height: 40px !important;
        }

        :global(.fc-button-group) {
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
        }

        :global(.fc-button) {
          height: 36px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          line-height: 1 !important;
        }

        :global(.fc-toolbar-title) {
          color: #ffffff;
          margin: 0 !important;
          line-height: 40px !important;
        }

        :global(.fc-event) {
          margin: 1px !important;
          border-radius: 4px !important;
        }

        :global(.fc-timegrid-event) {
          margin: 1px 2px !important;
        }
      `}</style>

      {isTrialModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Trial Planning</h2>
            <p>Trial planning modal content goes here...</p>
            <button
              onClick={() => setIsTrialModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isAppointmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Appointment</h2>
            <p>Add appointment modal content goes here...</p>
            <button
              onClick={() => setIsAppointmentModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
                {selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      ?.trim()
                      ?.split("-")
                      ?.reverse()
                      ?.join("-")}T${selectedAppointment.startTime}`,
                  ) && <p className="text-yellow-500 text-sm mt-2">This is a past appointment</p>}
              </div>

              <button
                onClick={handleEditAppointment}
                className={`w-full px-5 py-3 ${
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      ?.trim()
                      ?.split("-")
                      ?.reverse()
                      ?.join("-")}T${selectedAppointment.startTime}`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#3F74FF] hover:bg-[#3F74FF]/90 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      ?.trim()
                      ?.split("-")
                      ?.reverse()
                      ?.join("-")}T${selectedAppointment.startTime}`,
                  )
                }
              >
                <Edit className="mr-2" size={16} /> Edit Appointment
              </button>

              <button
                onClick={handleCancelAppointment}
                className={`w-full px-5 py-3 ${
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      ?.trim()
                      ?.split("-")
                      ?.reverse()
                      ?.join("-")}T${selectedAppointment.startTime}`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date
                      .split("|")[1]
                      ?.trim()
                      ?.split("-")
                      ?.reverse()
                      ?.join("-")}T${selectedAppointment.startTime}`,
                  )
                }
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
  const [appointments, setAppointments] = useState(appointmentsData)
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

  const [filteredAppointments, setFilteredAppointments] = useState(appointments)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
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

  const applyFilters = () => {
    let filtered = [...appointments]

    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate)
      filtered = filtered.filter((appointment) => {
        const appointmentDate = appointment.date?.split("|")[1]?.trim()
        return appointmentDate === formattedSelectedDate
      })
    }

    if (searchQuery) {
      filtered = filtered.filter((appointment) => appointment.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredAppointments(filtered)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
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

  const confirmRemoveAppointment = () => {
    setIsConfirmCancelOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("cancel")
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
      toast.success("Member notified successfully")
    }

    setIsNotifyMemberOpen(false)
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === "") {
      setSelectedMember(null)
    } else {
      const foundMember = appointments.find((app) => app.name?.toLowerCase().includes(query))
      setSelectedMember(foundMember ? foundMember.name : null)
    }
  }

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId))
    setSelectedAppointment(null)
    toast.success("Appointment deleted successfully")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote?.text) return null

      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))

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
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
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
        <div className="">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl oxanium_font sm:text-2xl font-bold text-white">Appointments</h1>
              <button
                onClick={toggleSidebar}
                className="bg-[#3F74FF] text-white p-1.5 rounded-full z-10 shadow-lg hover:bg-[#3F74FF]/90 transition-colors lg:flex hidden"
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
                                  {appointment.time} | {appointment.date?.split("|")[0]}
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
