/* eslint-disable no-unused-vars */ /* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react"
import toast, { Toaster } from "react-hot-toast"
import { useCallback, useEffect, useRef, useState } from "react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

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

export default function Calendar({
  appointmentsMain,
  onEventClick,
  onDateSelect,
  searchQuery = "",
  selectedDate,
  setAppointmentsMain,
  appointmentFilters = {},
}) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [freeAppointments, setFreeAppointments] = useState([])
  const [currentDateDisplay, setCurrentDateDisplay] = useState("Feb 3 – 9, 2025")

  const [viewMode, setViewMode] = useState("all") // "all" or "free"

  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false) // State for new modal
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null) // State for new modal data

  const [showListView, setShowListView] = useState(false)

  const [showAllAppointmentsModal, setShowAllAppointmentsModal] = useState(false)
  const [allAppointmentsForDay, setAllAppointmentsForDay] = useState([])
  const [selectedDayDate, setSelectedDayDate] = useState("")

  // Tooltip states
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: null,
  })

  const [currentDate, setCurrentDate] = useState(selectedDate || "2025-02-03")


  // Enhanced appointment types
  const [appointmentTypesMain, setAppointmentTypesMain] = useState([
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
    { name: "Consultation", color: "bg-blue-700", duration: 30 },
    { name: "Follow-up", color: "bg-green-700", duration: 45 },
    { name: "Annual Review", color: "bg-purple-600", duration: 60 },
    { name: "Training", color: "bg-orange-600", duration: 60 },
    { name: "Assessment", color: "bg-red-600", duration: 90 },
  ])

  const [memberAppointments, setMemberAppointments] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      date: "2025-02-05T10:00",
      status: "upcoming",
      type: "Consultation",
      memberId: 1,
      startTime: "10:00",
      endTime: "10:30",
      specialNote: {
        text: "First time client, needs introduction to equipment",
        isImportant: true,
        startDate: "2025-02-05",
        endDate: "2025-02-10",
      },
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      date: "2025-02-07T14:30",
      status: "upcoming",
      type: "Follow-up",
      memberId: 1,
      startTime: "14:30",
      endTime: "15:15",
    },
    {
      id: 3,
      title: "Annual Review",
      date: "2025-02-08T11:00",
      status: "upcoming",
      type: "Annual Review",
      memberId: 2,
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 4,
      title: "Strength Training",
      date: "2025-02-06T09:00",
      status: "upcoming",
      type: "Strength Training",
      memberId: 3,
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      id: 5,
      title: "Yoga Session",
      date: "2025-02-09T16:00",
      status: "upcoming",
      type: "Yoga",
      memberId: 4,
      startTime: "16:00",
      endTime: "17:30",
    },
    // Add some past appointments for demonstration
    {
      id: 6,
      title: "Past Training Session",
      date: "2025-01-15T10:00",
      status: "completed",
      type: "Strength Training",
      memberId: 1,
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 7,
      title: "Past Consultation",
      date: "2025-01-20T14:00",
      status: "completed",
      type: "Consultation",
      memberId: 2,
      startTime: "14:00",
      endTime: "14:30",
    },
  ])

  // </CHANGE> add state for editing blocked slot
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
  const [pendingEventInfo, setPendingEventInfo] = useState(null) // State to hold event info for drag/drop rollback
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false)
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)


  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  // Function to handle appointment click in month view
  const handleMonthViewAppointmentClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedAppointment(appointment)
    setIsAppointmentActionModalOpen(true)
  }

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView("timeGridDay", selectedDate)
    }
  }, [selectedDate])

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)

      if (width < 480) {
        setScreenSize("mobile")
        // Force daily view on mobile
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

  // Function to show tooltip
  const showTooltip = (event, mouseEvent) => {
    const appointment = event.extendedProps?.appointment
    if (!appointment) return

    // Get the event element's position instead of mouse position
    const eventElement = mouseEvent.target.closest(".fc-event")
    if (!eventElement) return

    const rect = eventElement.getBoundingClientRect()
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    const scrollY = window.scrollY || document.documentElement.scrollTop

    // Position tooltip above the event with some offset
    const tooltipX = rect.left + scrollX + rect.width / 2 // Center horizontally on event
    const tooltipY = rect.top + scrollY - 10 // Position above the event

    // Parse date from appointment format
    const dateParts = appointment.date?.split("|")
    let formattedDate = "N/A"
    if (dateParts && dateParts.length > 1) {
      const datePart = dateParts[1].trim()
      const [day, month, year] = datePart.split("-")
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      formattedDate = `${day} ${monthNames[Number.parseInt(month) - 1]} ${year}`
    }

    setTooltip({
      show: true,
      x: tooltipX,
      y: tooltipY,
      content: {
        name: appointment.name || event.title,
        date: formattedDate,
        time: `${appointment.startTime || "N/A"} - ${appointment.endTime || "N/A"}`,
        type: appointment.type || event.extendedProps?.type || "N/A",
      },
    })
  }

  useEffect(() => {
    let resizeObserver

    if (calendarRef.current) {
      const calendarElement = calendarRef.current.elRef.current

      resizeObserver = new ResizeObserver(() => {
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi()
          // Small delay to ensure DOM has updated
          setTimeout(() => {
            calendarApi.updateSize()
          }, 100)
        }
      })

      // Observe the calendar container
      if (calendarElement) {
        resizeObserver.observe(calendarElement)
      }
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  // Inside your Calendar component, add:
  const calendarContainerRef = useRef(null);

  // Add this function to prevent wheel event propagation
  const preventParentScroll = useCallback((e) => {
    if (calendarContainerRef.current) {
      const calendarElement = calendarContainerRef.current;
      const isScrollable = calendarElement.scrollHeight > calendarElement.clientHeight;

      if (isScrollable) {
        // Check if we're at the top or bottom of the calendar
        const atTop = calendarElement.scrollTop === 0;
        const atBottom = calendarElement.scrollTop + calendarElement.clientHeight >= calendarElement.scrollHeight;

        // If at top scrolling up, or at bottom scrolling down, allow parent scroll
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          return; // Allow event to bubble
        }

        // Otherwise, scroll the calendar and prevent parent scroll
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    const calendarElement = calendarContainerRef.current;
    if (!calendarElement) return;

    // Add wheel event listener with passive: false for preventDefault to work
    calendarElement.addEventListener('wheel', preventParentScroll, { passive: false });

    return () => {
      calendarElement.removeEventListener('wheel', preventParentScroll);
    };
  }, [preventParentScroll]);

  // Add touch event handlers for mobile
  useEffect(() => {
    const calendarElement = calendarContainerRef.current;
    if (!calendarElement) return;

    const preventTouch = (e) => {
      if (calendarElement.scrollHeight > calendarElement.clientHeight) {
        const atTop = calendarElement.scrollTop === 0;
        const atBottom = calendarElement.scrollTop + calendarElement.clientHeight >= calendarElement.scrollHeight;

        if ((atTop && e.touches[0].clientY > 0) || (atBottom && e.touches[0].clientY < 0)) {
          return;
        }

        e.stopPropagation();
      }
    };

    calendarElement.addEventListener('touchstart', preventTouch, { passive: false });
    calendarElement.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      calendarElement.removeEventListener('touchstart', preventTouch);
      calendarElement.removeEventListener('touchmove', preventTouch);
    };
  }, []);

  // Function to hide tooltip
  const hideTooltip = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null });
    // Also force hide any lingering tooltip
    const tooltips = document.querySelectorAll('.tooltip-container');
    tooltips.forEach(tooltip => {
      tooltip.style.display = 'none';
      tooltip.style.visibility = 'hidden';
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointmentsMain.length + 1,
      ...appointmentData,
      status: "pending",
      isTrial: false,
      isCancelled: false, // Default for new appointments
      isPast: false, // Default for new appointments
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(
        new Date(appointmentData.date),
      )}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    toast.success("Appointment booked successfully")
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointmentsMain.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
      isCancelled: false, // Default for new trials
      isPast: false, // Default for new trials
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(
        new Date(trialData.date),
      )}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    toast.success("Trial training booked successfully")
  }

  const handleShowAllAppointments = (dateString, appointments, e) => {
    e.stopPropagation()
    e.preventDefault()
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
    // Toggle view mode
    const newViewMode = viewMode === "all" ? "free" : "all"
    setViewMode(newViewMode)

    if (newViewMode === "free") {
      // Generate free slots specifically for Feb 3-9, 2025 (the default view week)
      const slots = []
      const weekStart = new Date("2025-02-03") // Monday, Feb 3, 2025

      // Generate 12-15 free slots throughout the week for better visibility
      const totalSlots = 12 + Math.floor(Math.random() * 4) // 12-15 slots

      for (let i = 0; i < totalSlots; i++) {
        const randomDay = Math.floor(Math.random() * 7) // 0-6 (Mon-Sun)
        const randomHour = 8 + Math.floor(Math.random() * 10) // 8 AM to 5 PM
        const randomMinute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45

        const freeDate = new Date(weekStart)
        freeDate.setDate(freeDate.getDate() + randomDay)
        freeDate.setHours(randomHour, randomMinute, 0)

        const formattedDate = formatDate(freeDate)
        const formattedTime = freeDate.toTimeString().split(" ")[0].substring(0, 5)

        slots.push({
          id: `free-${i}`,
          date: formattedDate,
          time: formattedTime,
        })
      }

      setFreeAppointments(slots)
      toast.success(
        "Free slots mode activated! Available slots are now highlighted and all appointments are grayed out.",
      )
    } else {
      setFreeAppointments([])
      toast.success("Showing all appointments in normal view.")
    }
  }

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)

      if (width < 480) {
        setScreenSize("mobile")
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

  const handleEventDrop = (info) => {
    setPendingEventInfo(info)
    setNotifyAction("change")
    setIsNotifyMemberOpen(true)
  }

  const handleDateSelect = (selectInfo) => {
    const clickedElement = selectInfo.jsEvent?.target;


    if (clickedElement && clickedElement.classList &&
      (clickedElement.classList.contains('fc-daygrid-more-link') ||
        clickedElement.closest('.fc-daygrid-more-link'))) {
      return;
    }

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

  // Around line 370-395, replace the handleNotifyMember function:
  // </CHANGE> replace handleNotifyMember to apply move on Yes and revert on No
  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)

    if (pendingEventInfo) {
      if (shouldNotify) {
        // Apply the change
        const { event } = pendingEventInfo
        const duration = event.end - event.start
        const updatedAppointments = appointmentsMain.map((appointment) => {
          if (appointment.id === Number(event.id)) {
            return {
              ...appointment,
              startTime: event.start.toTimeString().split(" ")[0].substring(0, 5),
              endTime: new Date(event.start.getTime() + duration).toTimeString().split(" ")[0].substring(0, 5),
              date: `${event.start.toLocaleString("en-US", { weekday: "short" })} | ${formatDate(event.start)}`,
            }
          }
          return appointment
        })
        setAppointmentsMain(updatedAppointments)
        toast.success(shouldNotify ? "Appointment updated and member notified!" : "Appointment updated")
      } else {
        // Revert
        pendingEventInfo.revert()
        toast.success("Appointment change cancelled")
      }
      setPendingEventInfo(null)
    } else if (notifyAction === "cancel" && selectedAppointment) {
      // Cancellation confirmation path
      if (shouldNotify !== null) {
        actuallyHandleCancelAppointment(shouldNotify)
      }
    } else {
      if (shouldNotify) {
        toast.success("Member notified successfully!")
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
    // Allow all appointments (including past ones) to open the action modal
    const appointmentId = Number.parseInt(clickInfo.event.id)
    const appointment = appointmentsMain?.find((app) => app.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setIsAppointmentActionModalOpen(true)
    }
    if (onEventClick) {
      onEventClick(clickInfo)
    }
  }
  // </CHANGE> branch edit flow for blocked vs normal
  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)

    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") {
      // Open blocked edit modal
      setBlockedEditData({ ...selectedAppointment })
      setIsEditBlockedModalOpen(true)
      return
    }

    // Convert for normal edit modal
    const appointmentForModal = {
      id: selectedAppointment.id,
      name: selectedAppointment.name,
      type: selectedAppointment.type,
      date: selectedAppointment.date
        ? selectedAppointment.date.split("|")[1]?.trim().split("-").reverse().join("-")
        : "",
      time: selectedAppointment.startTime,
      startTime: selectedAppointment.startTime,
      endTime: selectedAppointment.endTime,
      specialNote: selectedAppointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentData(appointmentForModal)
    setShowSelectedAppointmentModal(true)
  }

  // </CHANGE> add delete handler for blocked slots with confirmation
  const handleDeleteBlockedSlot = () => {
    if (!selectedAppointment) return
    const ok = window.confirm("Are you sure you want to delete this blocked time slot?")
    if (!ok) return
    const filtered = appointmentsMain.filter((a) => a.id !== selectedAppointment.id)
    setAppointmentsMain(filtered)
    setSelectedAppointment(null)
    setIsAppointmentActionModalOpen(false)
    toast.success("Blocked time slot deleted")
  }

  // </CHANGE> branch cancel flow for blocked vs normal
  const handleCancelAppointment = () => {
    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") {
      handleDeleteBlockedSlot()
      return
    }
    setIsAppointmentActionModalOpen(false)
    setNotifyAction("cancel")
    if (selectedAppointment) {
      // Update the selected appointment's status locally for the modal
      const updatedApp = { ...selectedAppointment, status: "cancelled", isCancelled: true }
      setSelectedAppointment(updatedApp)
      setIsNotifyMemberOpen(true) // Show notification modal
    }
  }

  // Modified actuallyHandleCancelAppointment to update status in main appointments array
  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointmentsMain || !setAppointmentsMain || !selectedAppointment) return
    const updatedAppointments = appointmentsMain.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointmentsMain(updatedAppointments)
    toast.success("Appointment cancelled successfully")
    if (shouldNotify) {
      console.log("Notifying member about cancellation")
    }
    setSelectedAppointment(null) // Clear selected appointment after action
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false);

    if (!selectedAppointment) {
      toast.error("No appointment selected");
      return;
    }

    console.log("Selected appointment for member details:", selectedAppointment);

    const memberIdToNavigate = selectedAppointment.memberId || selectedAppointment.id;

    if (memberIdToNavigate) {
      console.log("Navigating to member ID:", memberIdToNavigate);
      navigate(`/dashboard/member-details/${memberIdToNavigate}`);
    } else {
      toast.error("Member ID not found for this appointment");
    }
  };


  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...memberAppointments.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForAppointments?.id,
    }
    setMemberAppointments([...memberAppointments, newAppointment])
    setShowCreateAppointmentModal(false)
    toast.success("Appointment created successfully")
  }

  const handleDeleteAppointment = (id) => {
    setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null)
    setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
  }

  const formatDateRange = (date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return currentDateDisplay

    const view = calendarApi.view
    const viewType = view.type

    if (viewType === "timeGridWeek") {
      // Get start and end of week
      const start = new Date(view.currentStart)
      const end = new Date(view.currentEnd)
      end.setDate(end.getDate() - 1) // Adjust end date

      const startMonth = start.toLocaleDateString("en-US", { month: "short" })
      const endMonth = end.toLocaleDateString("en-US", { month: "short" })
      const year = start.getFullYear()

      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${year}`
      } else {
        return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`
      }
    } else if (viewType === "timeGridDay") {
      const currentDate = new Date(view.currentStart)
      return currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } else if (viewType === "dayGridMonth") {
      const currentDate = new Date(view.currentStart)
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    }

    return currentDateDisplay
  }


  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

  const safeAppointments = appointmentsMain || []
  const safeSearchQuery = searchQuery || ""

  // Filter appointments to show non-past by default, unless filters specify otherwise
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

    // Apply appointment type filters
    let typeMatch = true
    if (appointmentFilters && Object.keys(appointmentFilters).length > 0) {
      if (appointment.isTrial) {
        typeMatch = appointmentFilters["Trial Training"] || false
      } else if (appointment.isBlocked || appointment.type === "Blocked Time") {
        typeMatch = appointmentFilters["Blocked Time Slots"] || false
      } else if (appointment.isCancelled) {
        typeMatch = appointmentFilters["Cancelled Appointments"] || false
      } else if (appointment.isPast && !appointment.isCancelled) {
        typeMatch = appointmentFilters["Past Appointments"] || false
      } else {
        typeMatch = appointmentFilters[appointment.type] || false
      }
    } else {
      // By default, show non-past appointments prominently
      // Past appointments will be shown but with reduced opacity
      typeMatch = true
    }
    return nameMatch && dateMatch && typeMatch
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

        // Use data flags instead of calculating from date
        const isPastEvent = appointment.isPast || false
        const isCancelledEvent = appointment.isCancelled || false

        let backgroundColor = appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"
        let borderColor = backgroundColor
        let textColor = "#FFFFFF"
        let opacity = 1

        if (isCancelledEvent) {
          // Specific styling for cancelled appointments (diagonal stripes)
          backgroundColor = "#4a4a4a"
          borderColor = "#777777"
          textColor = "#bbbbbb"
          opacity = 0.6
        } else if (isPastEvent) {
          // Enhanced styling for past appointments (darker and more opaque)
          backgroundColor = "#1a1a1a"
          borderColor = "#2a2a2a"
          textColor = "#555555"
          opacity = 0.4 // More opaque/less transparent
        } else if (viewMode === "free") {
          // When showing free slots, other appointments are heavily grayed out
          backgroundColor = "#2a2a2a"
          borderColor = "#333333"
          textColor = "#666666"
          opacity = 0.15 // Even more transparent when in free mode
        }
        return {
          id: appointment.id,
          title: appointment.name,
          start: startDateTimeStr,
          end: endDateTimeStr,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: textColor,
          opacity: opacity,
          isPast: isPastEvent,
          isCancelled: isCancelledEvent,
          extendedProps: {
            type: appointment.type || "Unknown",
            isPast: isPastEvent,
            isCancelled: isCancelledEvent,
            originalColor: appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1",
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
        title: "Available", // Changed from "Available Slot"
        start: startDateTimeStr,
        end: new Date(new Date(startDateTimeStr).getTime() + 60 * 60 * 1000).toISOString(),
        backgroundColor: viewMode === "free" ? "#e5e7eb" : "#4a4a4a",
        borderColor: viewMode === "free" ? "#d1d5db" : "#555555",
        textColor: "#FFFFFF", // Always white text
        opacity: viewMode === "free" ? 1 : 0.4,
        extendedProps: {
          isFree: true,
          viewMode: viewMode,
        },
      }
    }),
  ]
  const handleEventResize = (info) => {
    const { event } = info
    // Check if it's a past event and prevent resize
    const isPastEvent = isEventInPast(event.start)
    if (isPastEvent) {
      info.revert()
      toast.error("Cannot resize past appointments")
      return
    }
    if (!appointmentsMain || !setAppointmentsMain) return
    const updatedAppointments = appointmentsMain.map((appointment) => {
      if (appointment.id === Number(event.id)) {
        return {
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0],
          endTime: event.end.toTimeString().split(" ")[0],
        }
      }
      return appointment
    })
    setAppointmentsMain(updatedAppointments)
    setNotifyAction("change")
    setPendingEventInfo(info) // Store info for resize notification
    setIsNotifyMemberOpen(true)
  }

  return (
    <>
      {tooltip.show && tooltip.content && (
        <div
          className="fixed z-[9999] bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600 max-w-xs pointer-events-none tooltip-container"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
            marginTop: "10px", // -8px se -15px ya -20px kar do
          }}
        >
          <div className="text-sm font-semibold mb-1">{tooltip.content.name}</div>
          <div className="text-xs text-gray-300 mb-1">{tooltip.content.date}</div>
          <div className="text-xs text-gray-300 mb-1">{tooltip.content.time}</div>
          <div className="text-xs text-blue-300">{tooltip.content.type}</div>
        </div>
      )}

      <div className="h-full w-full">
        <div className="w-full bg-black">
          <div className="flex items-center justify-between w-full mb-2 px-2" style={{ minHeight: "40px", flexShrink: 0 }}>
            {/* Always show left/right arrows */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.prev();
                    setCurrentDate(calendarApi.getDate().toISOString().split("T")[0]);
                    setTimeout(() => {
                      setCurrentDateDisplay(formatDateRange(calendarApi.getDate()));
                    }, 100);
                  }
                }}
                className="p-1.5 sm:p-2 rounded-md bg-gray-600 hover:bg-gray-700 cursor-pointer text-white transition-colors"
                aria-label="Previous"
              >
                <GoArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.next();
                    setCurrentDate(calendarApi.getDate().toISOString().split("T")[0]);
                    setTimeout(() => {
                      setCurrentDateDisplay(formatDateRange(calendarApi.getDate()));
                    }, 100);
                  }
                }}
                className="p-1.5 sm:p-2 rounded-md bg-gray-600 hover:bg-gray-700 cursor-pointer text-white transition-colors"
                aria-label="Next"
              >
                <GoArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Show month/week/day controls only on desktop */}
              {!isMobile && (
                <div className="flex bg-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi();
                      if (calendarApi) {
                        calendarApi.changeView("dayGridMonth");
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()));
                        }, 100);
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white border-r border-slate-200/20 cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${calendarRef.current?.getApi()?.view?.type === "dayGridMonth" ? "bg-gray-500" : "bg-gray-600"}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi();
                      if (calendarApi) {
                        calendarApi.changeView("timeGridWeek");
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()));
                        }, 100);
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white border-r border-slate-200/20 cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${calendarRef.current?.getApi()?.view?.type === "timeGridWeek" ? "bg-gray-500" : "bg-gray-600"}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi();
                      if (calendarApi) {
                        calendarApi.changeView("timeGridDay");
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()));
                        }, 100);
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${calendarRef.current?.getApi()?.view?.type === "timeGridDay" ? "bg-gray-500" : "bg-gray-600"}`}
                  >
                    Day
                  </button>
                </div>
              )}
            </div>

            {/* CENTER: Date Display */}
            <div className="flex-1 text-center px-2">
              <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {currentDateDisplay}
              </h2>
            </div>

            {/* RIGHT: Free Slots Button */}
            <div className="flex items-center gap-1 md:inline sm:gap-2 flex-shrink-0">
              <button
                onClick={generateFreeDates}
                className={`p-1.5 sm:p-1.5 rounded-md text-white px-2 py-1.5 sm:px-3 sm:py-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0 ${viewMode === "all" ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-500 hover:bg-gray-600"}`}
                aria-label={viewMode === "all" ? "Show Free Slots" : "Show All Slots"}
              >
                <span className="hidden sm:inline">{viewMode === "all" ? "Free Slots" : "All Slots"}</span>
                <span className="sm:hidden">{viewMode === "all" ? "Free" : "All"}</span>
              </button>
            </div>
          </div>

          {isMobile && showListView ? (
            <div className="bg-white p-4 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
              <h3 className="text-lg font-semibold mb-4">
                {new Date(currentDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <div className="space-y-2">
                {filteredAppointments
                  .filter((apt) => {
                    const dateParts = apt.date?.split("|") || []
                    if (dateParts.length < 2) return false
                    const datePart = dateParts[1].trim()
                    const formattedCurrentDate = formatDate(new Date(currentDate))
                    return datePart === formattedCurrentDate
                  })
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => {
                        setSelectedAppointment(apt)
                        setIsAppointmentActionModalOpen(true)
                      }}
                      className={`p-3 rounded-lg border cursor-pointer ${apt.isPast ? "bg-gray-100 opacity-60" : "bg-white"
                        } ${apt.isCancelled ? "border-red-300" : "border-gray-200"}`}
                      style={{
                        borderLeft: `4px solid ${apt.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"}`,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{apt.name}</div>
                          <div className="text-xs text-gray-600">{apt.type}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {apt.startTime} - {apt.endTime}
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredAppointments.filter((apt) => {
                  const dateParts = apt.date?.split("|") || []
                  if (dateParts.length < 2) return false
                  const datePart = dateParts[1].trim()
                  const formattedCurrentDate = formatDate(new Date(currentDate))
                  return datePart === formattedCurrentDate
                }).length === 0 && <div className="text-center text-gray-500 py-8">No appointments for this day</div>}
              </div>
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || "2025-02-03"}
              events={calendarEvents}
              height={isMobile ? "calc(100vh - 150px)" : "700px"} // Dynamic height for mobile
              selectable={true}
              headerToolbar={false}
              editable={true}
              eventDrop={handleEventDrop}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              nowIndicator={true}
              slotDuration="00:15:00"
              slotLabelInterval="00:30:00"
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                meridiem: 'short'
              }}
              // Add this for more compact slots
              slotHeight={35}
              slotEventOverlap={false}
              firstDay={1}
              eventClick={handleEventClick}
              eventResize={handleEventResize}
              select={handleDateSelect}
              eventOverlap={false}

              eventDragStart={(info) => {
                // Hide tooltip and add dragging class
                hideTooltip();
                document.body.classList.add('dragging-active');
                info.el.classList.add('fc-event-dragging');
              }}

              eventDragStop={(info) => {
                // Clean up dragging state
                document.body.classList.remove('dragging-active');
                info.el.classList.remove('fc-event-dragging');
                hideTooltip();
              }}

              eventResizeStart={(info) => {
                // Hide tooltip during resize
                hideTooltip();
                document.body.classList.add('dragging-active');
                info.el.classList.add('fc-event-resizing');
              }}

              eventResizeStop={(info) => {
                // Clean up resize state
                document.body.classList.remove('dragging-active');
                info.el.classList.remove('fc-event-resizing');
                hideTooltip();
              }}

              dayMaxEvents={false} // Remove the limit to show all appointments
              eventMaxStack={10}
              // Hide default events in month view since we're rendering them custom
              eventDisplay={(args) => {
                const viewType = calendarRef.current?.getApi()?.view?.type;
                if (viewType === "dayGridMonth") {
                  return 'none'; // Completely hide default events in month view
                }
                return 'auto';
              }}
              eventDidMount={(info) => {
                const viewType = info.view.type;
                if (viewType === "dayGridMonth") {
                  // Hide the event element completely in month view
                  info.el.style.display = 'none';
                }
              }}
              // Add day click handler for month view
              dayCellDidMount={(info) => {
                if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  info.el.style.cursor = 'pointer';
                }
              }}
              datesSet={(info) => {
                setTimeout(() => {
                  setCurrentDateDisplay(formatDateRange(info.view.currentStart));
                  // Clean up drag states
                  document.body.classList.remove('dragging-active');
                  hideTooltip();
                }, 100);
              }}
              // Update the dayCellContent function in your FullCalendar props:
              dayCellContent={(args) => {
                if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  const date = new Date(args.date)
                  const formattedDate = formatDate(date)
                  const dateString = date.toISOString().split('T')[0]

                  // Get appointments for this specific day
                  const dayAppointments = filteredAppointments.filter(appointment => {
                    const dateParts = appointment.date?.split("|") || []
                    if (dateParts.length < 2) return false
                    const appointmentDate = dateParts[1].trim()
                    return appointmentDate === formattedDate
                  })

                  // Show 3 appointments then "+ more"
                  const displayAppointments = dayAppointments.slice(0, 3)
                  const moreCount = dayAppointments.length - 3

                  return (
                    <div className="fc-daygrid-day-frame" style={{ height: '100%', minHeight: '120px' }}>
                      <div className="fc-daygrid-day-top">
                        <span className="fc-daygrid-day-number">{args.dayNumberText}</span>
                      </div>
                      <div className="fc-daygrid-day-events" style={{
                        minHeight: '85px',
                        maxHeight: '85px',
                        overflow: 'hidden'
                      }}>
                        {displayAppointments.map((appointment, index) => {
                          // Use the same styling logic as in other views
                          const isPastEvent = appointment.isPast || false
                          const isCancelledEvent = appointment.isCancelled || false
                          const isBlockedEvent = appointment.isBlocked || appointment.type === "Blocked Time"

                          let backgroundColor = appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"
                          let borderColor = backgroundColor
                          let textColor = "#FFFFFF"
                          let opacity = 1

                          if (isCancelledEvent) {
                            backgroundColor = "#4a4a4a"
                            borderColor = "#777777"
                            textColor = "#bbbbbb"
                            opacity = 0.6
                          } else if (isPastEvent) {
                            backgroundColor = "#1a1a1a"
                            borderColor = "#2a2a2a"
                            textColor = "#555555"
                            opacity = 0.4
                          } else if (isBlockedEvent) {
                            backgroundColor = "#dc2626"
                            borderColor = "#dc2626"
                            textColor = "#ffffff"
                            opacity = 0.8
                          }

                          return (
                            <div
                              key={appointment.id}
                              className={`fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end cursor-pointer ${isCancelledEvent ? "cancelled-event" : ""
                                } ${isPastEvent ? "past-event" : ""} ${isBlockedEvent ? "blocked-event" : ""}`}
                              style={{
                                backgroundColor: backgroundColor,
                                borderColor: borderColor,
                                color: textColor,
                                marginBottom: "2px",
                                padding: "2px 4px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                lineHeight: "1.1",
                                height: "20px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                opacity: opacity,
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleMonthViewAppointmentClick(appointment, e)
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation()
                                const rect = e.currentTarget.getBoundingClientRect()
                                const scrollX = window.scrollX || document.documentElement.scrollLeft
                                const scrollY = window.scrollY || document.documentElement.scrollTop

                                const tooltipX = rect.left + scrollX + rect.width / 2
                                const tooltipY = rect.top + scrollY - 10

                                setTooltip({
                                  show: true,
                                  x: tooltipX,
                                  y: tooltipY,
                                  content: {
                                    name: appointment.name,
                                    date: formattedDate.split('-').join(' '),
                                    time: `${appointment.startTime || "N/A"} - ${appointment.endTime || "N/A"}`,
                                    type: appointment.type || "N/A",
                                  },
                                })
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation()
                                hideTooltip()
                              }}
                            >
                              <div className="fc-event-main" style={{ overflow: 'hidden' }}>
                                <div className="fc-event-title-container">
                                  <div className="fc-event-title fc-sticky" style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '9px',
                                    fontWeight: '500',
                                    lineHeight: '1.1'
                                  }}>
                                    {appointment.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {moreCount > 0 && (
                          <div
                            className="fc-daygrid-more-link"
                            style={{
                              fontSize: "10px",
                              color: "#3b82f6",
                              marginTop: "2px",
                              cursor: "pointer",
                              padding: "2px 4px",
                              height: "18px",
                              lineHeight: "1.1",
                              // backgroundColor: "#f0f9ff",
                              // border: "1px solid #bfdbfe",
                              // borderRadius: "3px",
                              textAlign: "center",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleShowAllAppointments(dateString, dayAppointments, e);
                            }}
                          >
                            +{moreCount} more
                          </div>
                        )}

                      </div>
                    </div>
                  )
                }
                return null
              }}
              // Responsive day header format
              dayHeaderContent={(args) => {
                const date = new Date(args.date)
                const isSmallScreen = window.innerWidth < 1024
                const weekday = date.toLocaleDateString("en-US", {
                  weekday: isSmallScreen ? "short" : "long",
                })
                const day = date.getDate()

                // Modified: Place day number next to weekday name on the same line
                if (isSmallScreen) {
                  return (
                    <div style={{ textAlign: "center", lineHeight: "1.2", padding: "4px 0" }}>
                      <div>{weekday.substr(0, 3)} {day}</div>
                    </div>
                  )
                } else {
                  return (
                    <div style={{ textAlign: "center", lineHeight: "1.2", padding: "6px 0" }}>
                      <div>{weekday} {day}</div>
                    </div>
                  )
                }
              }}
              // CUSTOM STYLING for current day highlight
              dayCellClassNames={(date) => {
                const today = new Date()
                const cellDate = new Date(date.date)

                if (cellDate.toDateString() === today.toDateString()) {
                  return ["fc-day-today-custom"]
                }
                return []
              }}
              // EVENT MOUSE ENTER/LEAVE for tooltip
              eventMouseEnter={(info) => {
                // Don't show tooltip if dragging/resizing
                if (document.body.classList.contains('dragging-active') ||
                  info.el.classList.contains('fc-event-dragging') ||
                  info.el.classList.contains('fc-event-resizing')) {
                  return;
                }
                showTooltip(info.event, info.jsEvent);
              }}

              eventMouseLeave={() => {
                // Only hide if not dragging
                if (!document.body.classList.contains('dragging-active')) {
                  hideTooltip();
                }
              }}

              eventContent={(eventInfo) => (
                <div
                  className={`p-0.5 sm:p-1 h-full overflow-hidden transition-all duration-200 ${eventInfo.event.extendedProps.isPast ? "opacity-25" : ""
                    } ${eventInfo.event.extendedProps.isCancelled ? "cancelled-event-content cancelled-appointment-bg" : ""
                    } ${eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked
                      ? "blocked-event-content blocked-appointment-bg"
                      : ""
                    } ${eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                      ? "opacity-20"
                      : ""
                    } ${eventInfo.event.extendedProps.isFree && eventInfo.event.extendedProps.viewMode === "free"
                      ? " shadow-lg transform scale-105"
                      : ""
                    }`}
                >
                  <div
                    className={`font-semibold text-[10px] sm:text-xs md:text-sm truncate ${eventInfo.event.extendedProps.isPast
                      ? "text-gray-500"
                      : eventInfo.event.extendedProps.isCancelled
                        ? "text-gray-300"
                        : eventInfo.event.extendedProps.isBlocked ||
                          eventInfo.event.extendedProps.appointment?.isBlocked
                          ? "text-red-200" // Remove the emoji from here
                          : eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                            ? "text-gray-600"
                            : eventInfo.event.extendedProps.isFree &&
                              eventInfo.event.extendedProps.viewMode === "free"
                              ? "text-white font-bold"
                              : ""
                      }`}
                  >
                    {eventInfo.event.extendedProps.isCancelled
                      ? `${eventInfo.event.title}`
                      : eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked
                        ? `${eventInfo.event.title}` // Remove emoji from here
                        : eventInfo.event.extendedProps.isPast
                          ? `${eventInfo.event.title}`
                          : eventInfo.event.title}
                  </div>
                  <div
                    className={`text-[8px] sm:text-xs opacity-90 truncate ${eventInfo.event.extendedProps.isPast
                      ? "text-gray-600"
                      : eventInfo.event.extendedProps.isCancelled
                        ? "text-gray-400"
                        : eventInfo.event.extendedProps.isBlocked ||
                          eventInfo.event.extendedProps.appointment?.isBlocked
                          ? "text-red-300"
                          : eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                            ? "text-gray-600"
                            : ""
                      }`}
                  >
                    {eventInfo.event.extendedProps.type || ""}
                  </div>
                  <div className="text-[8px] sm:text-xs mt-0.5 sm:mt-1">{eventInfo.timeText}</div>
                </div>
              )}
              eventClassNames={(eventInfo) => {
                const classes = []
                if (eventInfo.event.extendedProps.isPast) {
                  classes.push("past-event")
                }
                if (eventInfo.event.extendedProps.isCancelled) {
                  classes.push("cancelled-event")
                }
                if (eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked) {
                  classes.push("blocked-event")
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
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showCreateAppointmentModal && (
        <CreateAppointmentModal
          isOpen={showCreateAppointmentModal}
          onClose={() => setShowCreateAppointmentModal(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          freeAppointments={freeAppointments}
        />
      )}
      {isAppointmentModalOpen && (
        <CreateAppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
        />
      )}
      <TrialTrainingModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
      />
      <BlockAppointmentModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        appointmentTypesMain={appointmentTypesMain}
        selectedDate={selectedDate || new Date()}
        onSubmit={(blockData) => {
          const newBlock = {
            id: appointmentsMain.length + 1,
            name: "BLOCKED",
            time: `${blockData.startTime} - ${blockData.endTime}`,
            date: `${new Date(blockData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(
              new Date(blockData.date),
            )}`,
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
            isCancelled: false, // Default for new blocks
            isPast: false, // Default for new blocks
          }
          setAppointmentsMain([...appointmentsMain, newBlock])
          toast.success("Time slot blocked successfully")
          setIsBlockModalOpen(false)
        }}
      />
      <TypeSelectionModalMain
        isOpen={isTypeSelectionOpen}
        onClose={() => setIsTypeSelectionOpen(false)}
        onSelect={handleTypeSelection}
      />
      <AppointmentActionModalMain
        isOpen={isAppointmentActionModalOpen}
        appointment={selectedAppointment}
        onClose={() => setIsAppointmentActionModalOpen(false)}
        onEdit={handleEditAppointment}
        onCancel={handleCancelAppointment}
        onViewMember={handleViewMemberDetails}
      />
      <NotifyMemberModalMain
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        pendingEventInfo={pendingEventInfo}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointment}
        handleNotifyMember={handleNotifyMember}
        setPendingEventInfo={setPendingEventInfo}
      />

      {isEditBlockedModalOpen && blockedEditData && (
        <EditBlockedSlotModalMain
          isOpen={isEditBlockedModalOpen}
          onClose={() => setIsEditBlockedModalOpen(false)}
          initialBlock={blockedEditData}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={(blockData) => {
            // Update selected blocked appointment in appointmentsMain
            const newDateString = `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(blockData.startDate))}`
            const updated = appointmentsMain.map((apt) => {
              if (apt.id === blockedEditData.id) {
                return {
                  ...apt,
                  // keep name/color/type markers
                  startTime: blockData.startTime,
                  endTime: blockData.endTime,
                  date: newDateString,
                  specialNote: {
                    ...(apt.specialNote || {}),
                    text: blockData.note || apt.specialNote?.text || "",
                    isImportant: apt.specialNote?.isImportant ?? true,
                  },
                }
              }
              return apt
            })
            setAppointmentsMain(updated)
            setIsEditBlockedModalOpen(false)
            setBlockedEditData(null)
            toast.success("Blocked time slot updated")
          }}
        />
      )}
      {showSelectedAppointmentModal && selectedAppointmentData && (
        <EditAppointmentModalMain
          selectedAppointmentMain={selectedAppointmentData}
          setSelectedAppointmentMain={setSelectedAppointmentData}
          appointmentTypesMain={appointmentTypesMain}
          freeAppointmentsMain={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointmentData({ ...selectedAppointmentData, ...changes })
          }}
          appointmentsMain={appointmentsMain}
          setAppointmentsMain={setAppointmentsMain}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpen}
          setNotifyActionMain={setNotifyAction}
          onDelete={handleDeleteAppointment}
        />
      )}

      {/* Add this modal after your other modals */}
      {showAllAppointmentsModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {new Date(selectedDayDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={handleCloseAllAppointmentsModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {allAppointmentsForDay.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No appointments for this day
                </div>
              ) : (
                <div className="space-y-2">
                  {allAppointmentsForDay.map((appointment) => {
                    const isPastEvent = appointment.isPast || false
                    const isCancelledEvent = appointment.isCancelled || false
                    const isBlockedEvent = appointment.isBlocked || appointment.type === "Blocked Time"

                    return (
                      <div
                        key={appointment.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-700 ${isCancelledEvent ? 'border-gray-600' : 'border-gray-700'
                          }`}
                        style={{
                          borderLeft: `4px solid ${appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"}`,
                          opacity: isPastEvent ? 0.7 : 1
                        }}
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsAppointmentActionModalOpen(true)
                          handleCloseAllAppointmentsModal()
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {appointment.name}
                            </div>
                            <div className="text-xs text-gray-300">
                              {appointment.type}
                              {isCancelledEvent && " (Cancelled)"}
                              {isBlockedEvent && " (Blocked)"}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                        </div>
                        {appointment.specialNote?.text && (
                          <div className="mt-2 text-xs text-gray-400 italic">
                            {appointment.specialNote.text}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleCloseAllAppointmentsModal}
                className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      <Toaster position="top-right" />


    </>
  )
}
