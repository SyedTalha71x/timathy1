/* eslint-disable no-unused-vars */ /* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react"
import toast, { Toaster } from "react-hot-toast"
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import CreateAppointmentModal from "./add-appointment-modal"
import BlockAppointmentModal from "./block-appointment-modal"
import TrialTrainingModal from "./add-trial-training"
import EditAppointmentModalMain from "./selected-appointment-modal"

import AppointmentActionModalMain from "./calendar-components/AppointmentActionModalMain"
import NotifyMemberModalMain from "./calendar-components/NotifyMemberModalMain"
import TypeSelectionModalMain from "./calendar-components/TypeSelectionModalMain"
import EditBlockedSlotModalMain from "./calendar-components/EditBlockedSlotModalMain"

import "../../../custom-css/calendar-fixes.css"
import { useNavigate } from "react-router-dom"

const Calendar = forwardRef(({
  appointmentsMain,
  onEventClick,
  onDateSelect,
  searchQuery = "",
  selectedDate,
  setAppointmentsMain,
  appointmentFilters = {},
  onDateDisplayChange,
  onViewModeChange,
  onCurrentDateChange,
}, ref) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [freeAppointments, setFreeAppointments] = useState([])
  const [currentDateDisplay, setCurrentDateDisplay] = useState("")
  const [viewMode, setViewMode] = useState("all")

  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [showListView, setShowListView] = useState(false)
  const [showAllAppointmentsModal, setShowAllAppointmentsModal] = useState(false)
  const [allAppointmentsForDay, setAllAppointmentsForDay] = useState([])
  const [selectedDayDate, setSelectedDayDate] = useState("")

  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null })
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0])

  const [appointmentTypesMain] = useState([
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
    { name: "Consultation", color: "bg-blue-700", duration: 30 },
    { name: "Follow-up", color: "bg-green-700", duration: 45 },
    { name: "Annual Review", color: "bg-purple-600", duration: 60 },
    { name: "Training", color: "bg-orange-600", duration: 60 },
    { name: "Assessment", color: "bg-red-600", duration: 90 },
  ])

  const [memberAppointments, setMemberAppointments] = useState([])
  const [isEditBlockedModalOpen, setIsEditBlockedModalOpen] = useState(false)
  const [blockedEditData, setBlockedEditData] = useState(null)

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const calendarRef = useRef(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")
  const [pendingEventInfo, setPendingEventInfo] = useState(null)
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false)
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  const formatDateRange = (date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return currentDateDisplay
    const view = calendarApi.view
    const viewType = view.type

    if (viewType === "timeGridWeek") {
      const start = new Date(view.currentStart)
      const end = new Date(view.currentEnd)
      end.setDate(end.getDate() - 1)
      const startMonth = start.toLocaleDateString("en-US", { month: "short" })
      const endMonth = end.toLocaleDateString("en-US", { month: "short" })
      const year = start.getFullYear()
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`
      } else {
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`
      }
    } else if (viewType === "timeGridDay") {
      const currentDate = new Date(view.currentStart)
      return currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } else if (viewType === "dayGridMonth") {
      const currentDate = new Date(view.currentStart)
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    return currentDateDisplay
  }

  // Expose calendar API methods via ref
  useImperativeHandle(ref, () => ({
    prev: () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.prev();
        const newDate = calendarApi.getDate();
        setCurrentDate(newDate.toISOString().split("T")[0]);
        onCurrentDateChange?.(newDate);
        setTimeout(() => {
          const display = formatDateRange(calendarApi.getDate());
          setCurrentDateDisplay(display);
          onDateDisplayChange?.(display);
        }, 100);
      }
    },
    next: () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.next();
        const newDate = calendarApi.getDate();
        setCurrentDate(newDate.toISOString().split("T")[0]);
        onCurrentDateChange?.(newDate);
        setTimeout(() => {
          const display = formatDateRange(calendarApi.getDate());
          setCurrentDateDisplay(display);
          onDateDisplayChange?.(display);
        }, 100);
      }
    },
    changeView: (viewType) => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.changeView(viewType);
        const newDate = calendarApi.getDate();
        onCurrentDateChange?.(newDate);
        setTimeout(() => {
          const display = formatDateRange(calendarApi.getDate());
          setCurrentDateDisplay(display);
          onDateDisplayChange?.(display);
        }, 100);
      }
    },
    getCurrentView: () => calendarRef.current?.getApi()?.view?.type,
    getDateDisplay: () => currentDateDisplay,
    toggleFreeSlots: () => generateFreeDates(),
    getViewMode: () => viewMode,
  }));

  const handleMonthViewAppointmentClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedAppointment(appointment)
    setIsAppointmentActionModalOpen(true)
  }

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.gotoDate(selectedDate)
    }
  }, [selectedDate])

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      if (width < 480) {
        setScreenSize("mobile")
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi()
          if (calendarApi.view.type !== "timeGridDay") {
            calendarApi.changeView("timeGridDay")
          }
        }
      } else if (width < 640) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const showTooltip = (event, mouseEvent) => {
    const appointment = event.extendedProps?.appointment
    if (!appointment) return
    const eventElement = mouseEvent.target.closest(".fc-event")
    if (!eventElement) return
    const rect = eventElement.getBoundingClientRect()
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    const scrollY = window.scrollY || document.documentElement.scrollTop
    const tooltipX = rect.left + scrollX + rect.width / 2
    const tooltipY = rect.top + scrollY - 10

    const dateParts = appointment.date?.split("|")
    let formattedDate = "N/A"
    if (dateParts && dateParts.length > 1) {
      const datePart = dateParts[1].trim()
      const [day, month, year] = datePart.split("-")
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      formattedDate = `${day} ${monthNames[Number.parseInt(month) - 1]} ${year}`
    }

    setTooltip({
      show: true, x: tooltipX, y: tooltipY,
      content: {
        name: appointment.name || event.title,
        date: formattedDate,
        time: `${appointment.startTime || "N/A"} - ${appointment.endTime || "N/A"}`,
        type: appointment.type || event.extendedProps?.type || "N/A",
      },
    })
  }

  const hideTooltip = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null });
    const tooltips = document.querySelectorAll('.tooltip-container');
    tooltips.forEach(t => { t.style.display = 'none'; t.style.visibility = 'hidden'; });
  };

  useEffect(() => {
    let resizeObserver
    if (calendarRef.current) {
      const calendarElement = calendarRef.current.elRef.current
      resizeObserver = new ResizeObserver(() => {
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi()
          setTimeout(() => calendarApi.updateSize(), 100)
        }
      })
      if (calendarElement) resizeObserver.observe(calendarElement)
    }
    return () => { if (resizeObserver) resizeObserver.disconnect() }
  }, [])

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointmentsMain.length + 1, ...appointmentData,
      status: "pending", isTrial: false, isCancelled: false, isPast: false,
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    toast.success("Appointment booked successfully")
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointmentsMain.length + 1, ...trialData,
      status: "pending", isTrial: true, isCancelled: false, isPast: false,
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    toast.success("Trial training booked successfully")
  }

  const handleShowAllAppointments = (dateString, appointments, e) => {
    e.stopPropagation(); e.preventDefault()
    setSelectedDayDate(dateString)
    setAllAppointmentsForDay(appointments)
    setShowAllAppointmentsModal(true)
  }

  const handleCloseAllAppointmentsModal = () => {
    setShowAllAppointmentsModal(false)
    setAllAppointmentsForDay([])
    setSelectedDayDate("")
  }

  const generateFreeDates = () => {
    const newViewMode = viewMode === "all" ? "free" : "all"
    setViewMode(newViewMode)
    onViewModeChange?.(newViewMode)

    if (newViewMode === "free") {
      const slots = []
      const today = new Date()
      const dayOfWeek = today.getDay()
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      const weekStart = new Date(new Date().setDate(diff))
      const totalSlots = 12 + Math.floor(Math.random() * 4)

      for (let i = 0; i < totalSlots; i++) {
        const randomDay = Math.floor(Math.random() * 7)
        const randomHour = 8 + Math.floor(Math.random() * 10)
        const randomMinute = Math.floor(Math.random() * 4) * 15
        const freeDate = new Date(weekStart)
        freeDate.setDate(freeDate.getDate() + randomDay)
        freeDate.setHours(randomHour, randomMinute, 0)
        slots.push({ id: `free-${i}`, date: formatDate(freeDate), time: freeDate.toTimeString().split(" ")[0].substring(0, 5) })
      }
      setFreeAppointments(slots)
      toast.success("Free slots mode activated!")
    } else {
      setFreeAppointments([])
      toast.success("Showing all appointments.")
    }
  }

  const handleEventDrop = (info) => { setPendingEventInfo(info); setNotifyAction("change"); setIsNotifyMemberOpen(true) }

  const handleDateSelect = (selectInfo) => {
    const clickedElement = selectInfo.jsEvent?.target;
    if (clickedElement && clickedElement.classList && (clickedElement.classList.contains('fc-daygrid-more-link') || clickedElement.closest('.fc-daygrid-more-link'))) return;
    setSelectedSlotInfo(selectInfo)
    setIsTypeSelectionOpen(true)
  }

  const handleTypeSelection = (type) => {
    setIsTypeSelectionOpen(false)
    if (type === "trial") setIsTrialModalOpen(true)
    else if (type === "appointment") setIsAppointmentModalOpen(true)
    else if (type === "block") setIsBlockModalOpen(true)
    else if (selectedSlotInfo && onDateSelect) onDateSelect({ ...selectedSlotInfo, eventType: type })
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    if (pendingEventInfo) {
      if (shouldNotify) {
        const { event } = pendingEventInfo
        const duration = event.end - event.start
        const updatedAppointments = appointmentsMain.map((appointment) => {
          if (appointment.id === Number(event.id)) {
            return { ...appointment,
              startTime: event.start.toTimeString().split(" ")[0].substring(0, 5),
              endTime: new Date(event.start.getTime() + duration).toTimeString().split(" ")[0].substring(0, 5),
              date: `${event.start.toLocaleString("en-US", { weekday: "short" })} | ${formatDate(event.start)}`,
            }
          }
          return appointment
        })
        setAppointmentsMain(updatedAppointments)
        toast.success("Appointment updated!")
      } else {
        pendingEventInfo.revert()
        toast.success("Appointment change cancelled")
      }
      setPendingEventInfo(null)
    } else if (notifyAction === "cancel" && selectedAppointment) {
      if (shouldNotify !== null) actuallyHandleCancelAppointment(shouldNotify)
    }
  }

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.isFree) {
      setSelectedSlotInfo({ start: clickInfo.event.start, end: clickInfo.event.end })
      setIsTypeSelectionOpen(true)
      return
    }
    const appointmentId = Number.parseInt(clickInfo.event.id)
    const appointment = appointmentsMain?.find((app) => app.id === appointmentId)
    if (appointment) { setSelectedAppointment(appointment); setIsAppointmentActionModalOpen(true) }
    if (onEventClick) onEventClick(clickInfo)
  }

  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") {
      setBlockedEditData({ ...selectedAppointment }); setIsEditBlockedModalOpen(true); return
    }
    const appointmentForModal = {
      id: selectedAppointment.id, name: selectedAppointment.name, type: selectedAppointment.type,
      date: selectedAppointment.date ? selectedAppointment.date.split("|")[1]?.trim().split("-").reverse().join("-") : "",
      time: selectedAppointment.startTime, startTime: selectedAppointment.startTime, endTime: selectedAppointment.endTime,
      specialNote: selectedAppointment.specialNote || { text: "", isImportant: false, startDate: "", endDate: "" },
    }
    setSelectedAppointmentData(appointmentForModal)
    setShowSelectedAppointmentModal(true)
  }

  const handleDeleteBlockedSlot = () => {
    if (!selectedAppointment) return
    if (!window.confirm("Are you sure you want to delete this blocked time slot?")) return
    setAppointmentsMain(appointmentsMain.filter((a) => a.id !== selectedAppointment.id))
    setSelectedAppointment(null); setIsAppointmentActionModalOpen(false)
    toast.success("Blocked time slot deleted")
  }

  const handleCancelAppointment = () => {
    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") { handleDeleteBlockedSlot(); return }
    setIsAppointmentActionModalOpen(false); setNotifyAction("cancel")
    if (selectedAppointment) {
      setSelectedAppointment({ ...selectedAppointment, status: "cancelled", isCancelled: true })
      setIsNotifyMemberOpen(true)
    }
  }

  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointmentsMain || !setAppointmentsMain || !selectedAppointment) return
    setAppointmentsMain(appointmentsMain.map((app) => app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app))
    toast.success("Appointment cancelled successfully")
    setSelectedAppointment(null)
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false);
    if (!selectedAppointment) { toast.error("No appointment selected"); return }
    const memberIdToNavigate = selectedAppointment.memberId || selectedAppointment.id;
    if (memberIdToNavigate) navigate(`/dashboard/member-details/${memberIdToNavigate}`);
    else toast.error("Member ID not found for this appointment");
  };

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = { id: Math.max(0, ...memberAppointments.map((a) => a.id)) + 1, ...data, memberId: selectedMemberForAppointments?.id }
    setMemberAppointments([...memberAppointments, newAppointment])
    setShowCreateAppointmentModal(false)
    toast.success("Appointment created successfully")
  }

  const handleDeleteAppointment = (id) => {
    setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null); setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true); setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
  }

  const isEventInPast = (eventStart) => new Date(eventStart) < new Date()

  const safeAppointments = appointmentsMain || []
  const safeSearchQuery = searchQuery || ""

  // Für den Kalender: ALLE Termine anzeigen (kein Datumsfilter!)
  const filteredAppointments = safeAppointments.filter((appointment) => {
    // Suchfilter
    const nameMatch = !safeSearchQuery || appointment.name?.toLowerCase().includes(safeSearchQuery.toLowerCase())
    
    // Typ-Filter anwenden
    let typeMatch = true
    if (appointmentFilters && Object.keys(appointmentFilters).length > 0) {
      // Erst prüfen ob der Termin-Typ erlaubt ist
      if (appointment.isTrial) {
        typeMatch = appointmentFilters["Trial Training"] !== false
      } else if (appointment.isBlocked || appointment.type === "Blocked Time") {
        typeMatch = appointmentFilters["Blocked Time Slots"] !== false
      } else {
        // Normaler Termin - prüfe den Typ
        typeMatch = appointmentFilters[appointment.type] !== false
      }
      
      // Zusätzlich: Abgesagte Termine filtern
      if (appointment.isCancelled && appointmentFilters["Cancelled Appointments"] === false) {
        typeMatch = false
      }
      
      // Zusätzlich: Vergangene Termine filtern (nur wenn nicht abgesagt)
      if (appointment.isPast && !appointment.isCancelled && appointmentFilters["Past Appointments"] === false) {
        typeMatch = false
      }
    }
    return nameMatch && typeMatch
  })

  const calendarEvents = [
    ...filteredAppointments.map((appointment) => {
      const dateParts = appointment.date?.split("|") || []
      if (dateParts.length < 2) return null
      const datePart = dateParts[1].trim()
      const dateComponents = datePart.split("-")
      if (dateComponents.length !== 3) return null
      const [day, month, year] = dateComponents
      const dateStr = `${year}-${month}-${day}`
      const startDateTimeStr = `${dateStr}T${appointment.startTime || "00:00"}`
      const endDateTimeStr = `${dateStr}T${appointment.endTime || "01:00"}`
      const isPastEvent = appointment.isPast || false
      const isCancelledEvent = appointment.isCancelled || false

      let backgroundColor = appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"
      let borderColor = backgroundColor, textColor = "#FFFFFF"

      if (isCancelledEvent) { 
        backgroundColor = "#6B7280"
        borderColor = "#6B7280"
        textColor = "#FFFFFF"
      } else if (viewMode === "free") { 
        backgroundColor = "#2a2a2a"
        borderColor = "#333333"
        textColor = "#666666"
      }

      return {
        id: appointment.id, title: appointment.name, start: startDateTimeStr, end: endDateTimeStr,
        backgroundColor, borderColor, textColor, isPast: isPastEvent, isCancelled: isCancelledEvent,
        extendedProps: { type: appointment.type || "Unknown", isPast: isPastEvent, isCancelled: isCancelledEvent,
          originalColor: appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1", viewMode, appointment },
      }
    }).filter(Boolean),
    ...freeAppointments.map((freeSlot) => {
      const [day, month, year] = freeSlot.date.split("-")
      const dateStr = `${year}-${month}-${day}`
      const startDateTimeStr = `${dateStr}T${freeSlot.time}`
      return {
        id: freeSlot.id, title: "Available", start: startDateTimeStr,
        end: new Date(new Date(startDateTimeStr).getTime() + 60 * 60 * 1000).toISOString(),
        backgroundColor: viewMode === "free" ? "#10B981" : "#4a4a4a",
        borderColor: viewMode === "free" ? "#059669" : "#555555",
        textColor: "#FFFFFF",
        extendedProps: { isFree: true, viewMode },
      }
    }),
  ]

  const handleEventResize = (info) => {
    const { event } = info
    if (isEventInPast(event.start)) { info.revert(); toast.error("Cannot resize past appointments"); return }
    if (!appointmentsMain || !setAppointmentsMain) return
    setAppointmentsMain(appointmentsMain.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return { ...appointment, startTime: event.start.toTimeString().split(" ")[0], endTime: event.end.toTimeString().split(" ")[0] }
      }
      return appointment
    }))
    setNotifyAction("change"); setPendingEventInfo(info); setIsNotifyMemberOpen(true)
  }

  useEffect(() => {
    setTimeout(() => {
      if (calendarRef.current) {
        const display = formatDateRange(calendarRef.current.getApi().getDate());
        setCurrentDateDisplay(display);
        onDateDisplayChange?.(display);
      }
    }, 200);
  }, []);

  return (
    <>
      <style>{`
        .fc .fc-timegrid-slot-label {
          vertical-align: top !important;
          padding: 0 !important;
          border: none !important;
          position: relative !important;
          overflow: visible !important;
        }
        .fc .fc-timegrid-slot-label-cushion {
          font-size: 11px !important;
          padding: 0 4px !important;
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          transform: translateY(-50%) !important;
          z-index: 10 !important;
          background: #000 !important;
        }
        .fc .fc-timegrid-slots tbody tr:first-child .fc-timegrid-slot-label-cushion {
          display: none !important;
        }
        .fc .fc-timegrid-slot {
          height: 32px !important;
        }
        .fc .fc-timegrid-axis {
          border: none !important;
          overflow: visible !important;
        }
        .fc .fc-timegrid-axis-frame {
          border: none !important;
          overflow: visible !important;
        }
        .fc .fc-col-header-cell {
          padding: 0 !important;
          height: 24px !important;
          position: relative !important;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 11px !important;
          font-weight: 500 !important;
          padding: 4px 0 !important;
        }
        .fc .fc-scrollgrid {
          border: none !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #333 !important;
        }
        .fc th.fc-day-today {
          background: linear-gradient(to bottom, #f97316 0%, #f97316 3px, transparent 3px) !important;
        }
        .fc th.fc-day-today .fc-col-header-cell-cushion {
          font-weight: 700 !important;
          color: #ffffff !important;
          font-size: 12px !important;
        }
        .fc td.fc-day-today {
          background-color: rgba(249, 115, 22, 0.08) !important;
        }
        .fc-dayGridMonth-view td.fc-day-today {
          background-color: rgba(249, 115, 22, 0.1) !important;
        }
        .fc .fc-timegrid-slots {
          overflow: visible !important;
        }
        .fc .fc-timegrid-now-indicator-arrow {
          display: none !important;
        }
        .fc .fc-timegrid-now-indicator-line {
          border-color: #f97316 !important;
          border-width: 1px !important;
          position: relative !important;
        }
        .fc .fc-timegrid-now-indicator-line::before {
          content: '' !important;
          position: absolute !important;
          left: 0 !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 0 !important;
          height: 0 !important;
          border-top: 5px solid transparent !important;
          border-bottom: 5px solid transparent !important;
          border-left: 6px solid #f97316 !important;
        }
        .fc .fc-timegrid-col {
          cursor: pointer !important;
        }
        .fc .fc-timegrid-slot {
          height: 32px !important;
          cursor: pointer !important;
        }
        /* Abgesagte Termine - diagonale Streifen + grau */
        .cancelled-event {
          position: relative;
          background-color: #6B7280 !important;
          border-color: #6B7280 !important;
        }
        .cancelled-event::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            135deg,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.15) 3px,
            rgba(255, 255, 255, 0.15) 6px
          );
          pointer-events: none;
          border-radius: inherit;
        }
        /* Vergangene Termine - abgeschwächt */
        .past-event {
          opacity: 0.45;
        }
        /* Time container - zeigt Endzeit nur wenn genug Platz */
        .fc-event-time-container {
          container-type: inline-size;
          width: 100%;
        }
        .fc-event-time-end {
          display: none;
        }
        @container (min-width: 70px) {
          .fc-event-time-end {
            display: inline;
          }
        }
        /* Modern event styling */
        .fc-timegrid-event {
          border-radius: 4px !important;
          border-width: 0 !important;
          border-left-width: 3px !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
          overflow: hidden !important;
        }
        .fc-timegrid-event .fc-event-main {
          padding: 1px 3px !important;
        }
        /* Rand links/rechts für Klick-Bereich zum Buchen */
        .fc-timegrid-col-events {
          margin: 0 3px !important;
        }
        /* Parallele Events nebeneinander */
        .fc-timegrid-event-harness {
          margin-right: 2px !important;
        }
        .fc .fc-not-allowed,
        .fc .fc-not-allowed .fc-timegrid-col,
        .fc .fc-not-allowed .fc-timegrid-slot,
        .fc *[style*="not-allowed"] {
          cursor: pointer !important;
        }
        .fc-timegrid-col-frame {
          cursor: pointer !important;
        }
        body.fc-not-allowed,
        body.fc-not-allowed * {
          cursor: pointer !important;
        }
        /* Month view specific styles */
        .fc-dayGridMonth-view .fc-daygrid-day {
          min-height: 120px !important;
          max-height: 120px !important;
          height: 120px !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-day-frame {
          min-height: 120px !important;
          max-height: 120px !important;
          height: 120px !important;
        }
        .fc-dayGridMonth-view .fc-scrollgrid-sync-table {
          height: auto !important;
        }
        .fc-dayGridMonth-view .fc-scrollgrid-sync-table tbody tr {
          height: 120px !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-body {
          height: auto !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-body-balanced .fc-daygrid-day-events {
          position: relative !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-day-top {
          padding: 4px 6px !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-day-number {
          font-size: 13px !important;
          padding: 2px !important;
        }
        .fc-dayGridMonth-view .fc-col-header-cell-cushion {
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 8px 0 !important;
        }
        .fc-dayGridMonth-view .fc-day-other {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .fc-dayGridMonth-view .fc-day-other .fc-daygrid-day-top {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .fc-dayGridMonth-view .fc-day-other .fc-daygrid-day-number {
          color: #888888 !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        .fc-dayGridMonth-view .fc-day-other .fc-daygrid-day-top span {
          color: #888888 !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: inline !important;
        }
        .fc-dayGridMonth-view .fc-day-other .fc-daygrid-day-frame {
          opacity: 1 !important;
        }
        .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-number {
          color: #e5e7eb !important;
          font-weight: 700 !important;
        }
        .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-top span {
          color: #e5e7eb !important;
          font-weight: 700 !important;
        }
      `}</style>
      {tooltip.show && tooltip.content && (
        <div className="fixed z-[9999] bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600 max-w-xs pointer-events-none tooltip-container"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translate(-50%, -100%)", marginTop: "10px" }}>
          <div className="text-sm font-semibold mb-1">{tooltip.content.name}</div>
          <div className="text-xs text-gray-300 mb-1">{tooltip.content.date}</div>
          <div className="text-xs text-gray-300 mb-1">{tooltip.content.time}</div>
          <div className="text-xs text-blue-300">{tooltip.content.type}</div>
        </div>
      )}

      <div className="h-full w-full flex flex-col">
        <div className="w-full bg-black flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-auto pt-0">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || new Date().toISOString().split('T')[0]}
              events={calendarEvents}
              height="auto"
              contentHeight="auto"
              locale="en"
              selectable={true}
              headerToolbar={false}
              editable={true}
              eventDrop={handleEventDrop}
              slotMinTime="06:00:00"
              slotMaxTime="23:00:00"
              allDaySlot={false}
              nowIndicator={true}
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              slotHeight={32}
              slotEventOverlap={false}
              firstDay={1}
              eventClick={handleEventClick}
              eventResize={handleEventResize}
              select={handleDateSelect}
              selectAllow={(selectInfo) => {
                const duration = selectInfo.end - selectInfo.start;
                const thirtyMinutes = 30 * 60 * 1000;
                return duration <= thirtyMinutes;
              }}
              eventOverlap={false}
              eventMinHeight={28}
              views={{
                timeGridWeek: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const weekday = weekdays[date.getDay()];
                    const day = date.getDate();
                    return `${weekday} ${day}`;
                  }
                },
                timeGridDay: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const weekday = weekdays[date.getDay()];
                    const day = date.getDate();
                    return `${weekday} ${day}`;
                  }
                },
                dayGridMonth: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const dayIndex = date.getDay();
                    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                    return weekdays[adjustedIndex];
                  }
                }
              }}
              eventDragStart={(info) => { hideTooltip(); document.body.classList.add('dragging-active'); info.el.classList.add('fc-event-dragging'); }}
              eventDragStop={(info) => { document.body.classList.remove('dragging-active'); info.el.classList.remove('fc-event-dragging'); hideTooltip(); }}
              eventResizeStart={(info) => { hideTooltip(); document.body.classList.add('dragging-active'); info.el.classList.add('fc-event-resizing'); }}
              eventResizeStop={(info) => { document.body.classList.remove('dragging-active'); info.el.classList.remove('fc-event-resizing'); hideTooltip(); }}
              dayMaxEvents={false}
              eventMaxStack={10}
              eventDisplay={(args) => { const viewType = calendarRef.current?.getApi()?.view?.type; return viewType === "dayGridMonth" ? 'none' : 'auto'; }}
              eventDidMount={(info) => { if (info.view.type === "dayGridMonth") info.el.style.display = 'none'; }}
              dayCellDidMount={(info) => { if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") info.el.style.cursor = 'pointer'; }}
              datesSet={(info) => {
                setTimeout(() => {
                  const display = formatDateRange(info.view.currentStart);
                  setCurrentDateDisplay(display);
                  onDateDisplayChange?.(display);
                  onCurrentDateChange?.(info.view.currentStart);
                  document.body.classList.remove('dragging-active');
                  hideTooltip();
                }, 100);
              }}
              dayCellContent={(args) => {
                if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  const date = new Date(args.date)
                  const formattedDate = formatDate(date)
                  const dateString = date.toISOString().split('T')[0]
                  
                  // Check if this day is from the current month or a neighboring month
                  const calendarApi = calendarRef.current?.getApi()
                  const currentViewStart = calendarApi?.view?.currentStart
                  const currentMonth = currentViewStart ? new Date(currentViewStart).getMonth() : new Date().getMonth()
                  const isCurrentMonth = date.getMonth() === currentMonth
                  
                  // Check if this is today
                  const today = new Date()
                  const isToday = date.getDate() === today.getDate() && 
                                  date.getMonth() === today.getMonth() && 
                                  date.getFullYear() === today.getFullYear()
                  
                  const dayAppointments = filteredAppointments.filter(apt => {
                    const dateParts = apt.date?.split("|") || []
                    if (dateParts.length < 2) return false
                    return dateParts[1].trim() === formattedDate
                  })
                  const displayAppointments = dayAppointments.slice(0, 3)
                  const moreCount = dayAppointments.length - 3

                  return (
                    <div className="fc-daygrid-day-frame" style={{ height: '100%', minHeight: '120px' }}>
                      <div className="fc-daygrid-day-top">
                        <span 
                          className="fc-daygrid-day-number" 
                          style={{ 
                            color: isCurrentMonth ? '#e5e7eb' : '#888888',
                            fontWeight: isToday ? '700' : (isCurrentMonth ? '500' : '400')
                          }}
                        >
                          {args.dayNumberText}
                        </span>
                      </div>
                      <div className="fc-daygrid-day-events" style={{ minHeight: '95px', maxHeight: '95px', overflow: 'hidden' }}>
                        {displayAppointments.map((apt) => {
                          let bg = apt.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1", op = 1
                          if (apt.isCancelled) { bg = "#4a4a4a"; op = 0.6 }
                          else if (apt.isPast) { bg = "#1a1a1a"; op = 0.4 }
                          else if (apt.isBlocked || apt.type === "Blocked Time") { bg = "#dc2626"; op = 0.8 }
                          return (
                            <div key={apt.id} style={{ backgroundColor: bg, marginBottom: "2px", padding: "2px 4px", borderRadius: "3px", fontSize: "10px", lineHeight: "1.1", height: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: op, color: "#fff", cursor: "pointer" }}
                              onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleMonthViewAppointmentClick(apt, e) }}
                              onMouseEnter={(e) => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); setTooltip({ show: true, x: rect.left + rect.width / 2, y: rect.top - 10, content: { name: apt.name, date: formattedDate.split('-').join(' '), time: `${apt.startTime || "N/A"} - ${apt.endTime || "N/A"}`, type: apt.type || "N/A" } }) }}
                              onMouseLeave={(e) => { e.stopPropagation(); hideTooltip() }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '9px', fontWeight: '500' }}>{apt.name}</div>
                            </div>
                          )
                        })}
                        {moreCount > 0 && (
                          <div style={{ fontSize: "10px", color: "#3b82f6", marginTop: "2px", cursor: "pointer", padding: "2px 4px", height: "16px", textAlign: "center", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleShowAllAppointments(dateString, dayAppointments, e); }}>
                            +{moreCount} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                return null
              }}
              dayHeaderContent={(args) => {
                const date = new Date(args.date)
                const viewType = calendarRef.current?.getApi()?.view?.type
                
                if (viewType === "dayGridMonth") {
                  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                  const dayIndex = date.getDay();
                  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                  return <div style={{ textAlign: "center", lineHeight: "1", padding: "8px 0", fontSize: "12px", fontWeight: "600" }}><span>{weekdays[adjustedIndex]}</span></div>
                }
                
                const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
                const day = date.getDate()
                return <div style={{ textAlign: "center", lineHeight: "1", padding: "2px 0", fontSize: "11px" }}><span>{weekday} {day}</span></div>
              }}
              dayCellClassNames={(date) => new Date(date.date).toDateString() === new Date().toDateString() ? ["fc-day-today-custom"] : []}
              eventMouseEnter={(info) => { if (!document.body.classList.contains('dragging-active') && !info.el.classList.contains('fc-event-dragging') && !info.el.classList.contains('fc-event-resizing')) showTooltip(info.event, info.jsEvent); }}
              eventMouseLeave={() => { if (!document.body.classList.contains('dragging-active')) hideTooltip(); }}
              eventContent={(eventInfo) => {
                const appointment = eventInfo.event.extendedProps.appointment;
                const startTime = appointment?.startTime || '';
                const endTime = appointment?.endTime || '';
                const name = appointment?.name || eventInfo.event.title || '';
                const lastName = appointment?.lastName || '';
                const fullName = lastName ? `${name} ${lastName}` : name;
                
                return (
                  <div className="px-1 py-0.5 h-full overflow-hidden flex flex-col justify-start">
                    {/* Name hat Priorität */}
                    <div className="text-[10px] leading-tight overflow-hidden whitespace-nowrap text-white font-medium">
                      {fullName}
                    </div>
                    {/* Zeit: Volle Zeit wenn Platz, sonst nur Startzeit */}
                    <div className="fc-event-time-container overflow-hidden">
                      <span className="whitespace-nowrap text-[9px] text-white/80">
                        {startTime}<span className="fc-event-time-end"> - {endTime}</span>
                      </span>
                    </div>
                  </div>
                );
              }}
              eventClassNames={(eventInfo) => {
                const classes = []
                if (eventInfo.event.extendedProps.isPast) classes.push("past-event")
                if (eventInfo.event.extendedProps.isCancelled) classes.push("cancelled-event")
                if (eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked) classes.push("blocked-event")
                if (eventInfo.event.extendedProps.isFree) { classes.push("free-slot-event cursor-pointer"); if (eventInfo.event.extendedProps.viewMode === "free") classes.push("prominent-free-slot") }
                return classes.join(" ")
              }}
            />
          </div>
        </div>
      </div>

      {showCreateAppointmentModal && <CreateAppointmentModal isOpen={showCreateAppointmentModal} onClose={() => setShowCreateAppointmentModal(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAddAppointmentSubmit} setIsNotifyMemberOpen={setIsNotifyMemberOpen} setNotifyAction={setNotifyAction} freeAppointments={freeAppointments} />}
      {isAppointmentModalOpen && <CreateAppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAppointmentSubmit} setIsNotifyMemberOpen={setIsNotifyMemberOpen} setNotifyAction={setNotifyAction} />}
      <TrialTrainingModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} freeAppointments={freeAppointments} onSubmit={handleTrialSubmit} />
      <BlockAppointmentModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} appointmentTypesMain={appointmentTypesMain} selectedDate={selectedDate || new Date()} onSubmit={(blockData) => {
        const newBlock = { id: appointmentsMain.length + 1, name: "BLOCKED", time: `${blockData.startTime} - ${blockData.endTime}`, date: `${new Date(blockData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(blockData.date))}`, color: "bg-[#FF4D4F]", startTime: blockData.startTime, endTime: blockData.endTime, type: "Blocked Time", specialNote: { text: blockData.note || "This time slot is blocked", startDate: null, endDate: null, isImportant: true }, status: "blocked", isBlocked: true, isCancelled: false, isPast: false }
        setAppointmentsMain([...appointmentsMain, newBlock]); toast.success("Time slot blocked successfully"); setIsBlockModalOpen(false)
      }} />
      <TypeSelectionModalMain isOpen={isTypeSelectionOpen} onClose={() => setIsTypeSelectionOpen(false)} onSelect={handleTypeSelection} />
      <AppointmentActionModalMain isOpen={isAppointmentActionModalOpen} appointment={selectedAppointment} onClose={() => setIsAppointmentActionModalOpen(false)} onEdit={handleEditAppointment} onCancel={handleCancelAppointment} onViewMember={handleViewMemberDetails} />
      <NotifyMemberModalMain isOpen={isNotifyMemberOpen} onClose={() => setIsNotifyMemberOpen(false)} notifyAction={notifyAction} pendingEventInfo={pendingEventInfo} actuallyHandleCancelAppointment={actuallyHandleCancelAppointment} handleNotifyMember={handleNotifyMember} setPendingEventInfo={setPendingEventInfo} />
      {isEditBlockedModalOpen && blockedEditData && <EditBlockedSlotModalMain isOpen={isEditBlockedModalOpen} onClose={() => setIsEditBlockedModalOpen(false)} initialBlock={blockedEditData} appointmentTypesMain={appointmentTypesMain} onSubmit={(blockData) => {
        const newDateString = `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(blockData.startDate))}`
        setAppointmentsMain(appointmentsMain.map((apt) => apt.id === blockedEditData.id ? { ...apt, startTime: blockData.startTime, endTime: blockData.endTime, date: newDateString, specialNote: { ...(apt.specialNote || {}), text: blockData.note || apt.specialNote?.text || "", isImportant: apt.specialNote?.isImportant ?? true } } : apt))
        setIsEditBlockedModalOpen(false); setBlockedEditData(null); toast.success("Blocked time slot updated")
      }} />}
      {showSelectedAppointmentModal && selectedAppointmentData && <EditAppointmentModalMain selectedAppointmentMain={selectedAppointmentData} setSelectedAppointmentMain={setSelectedAppointmentData} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointments} handleAppointmentChange={(changes) => setSelectedAppointmentData({ ...selectedAppointmentData, ...changes })} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpen} setNotifyActionMain={setNotifyAction} onDelete={handleDeleteAppointment} />}
      {showAllAppointmentsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{new Date(selectedDayDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <button onClick={handleCloseAllAppointmentsModal} className="text-gray-400 hover:text-white">Ã—</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {allAppointmentsForDay.length === 0 ? <div className="text-center text-gray-400 py-4">No appointments for this day</div> : (
                <div className="space-y-2">
                  {allAppointmentsForDay.map((apt) => (
                    <div key={apt.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-700 ${apt.isCancelled ? 'border-gray-600' : 'border-gray-700'}`} style={{ borderLeft: `4px solid ${apt.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"}`, opacity: apt.isPast ? 0.7 : 1 }}
                      onClick={() => { setSelectedAppointment(apt); setIsAppointmentActionModalOpen(true); handleCloseAllAppointmentsModal() }}>
                      <div className="flex justify-between items-start">
                        <div><div className="font-semibold text-white text-sm">{apt.name}</div><div className="text-xs text-gray-300">{apt.type}{apt.isCancelled && " (Cancelled)"}{(apt.isBlocked || apt.type === "Blocked Time") && " (Blocked)"}</div></div>
                        <div className="text-xs text-gray-400">{apt.startTime} - {apt.endTime}</div>
                      </div>
                      {apt.specialNote?.text && <div className="mt-2 text-xs text-gray-400 italic">{apt.specialNote.text}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700"><button onClick={handleCloseAllAppointmentsModal} className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md">Close</button></div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  )
})

Calendar.displayName = 'Calendar'
export default Calendar
