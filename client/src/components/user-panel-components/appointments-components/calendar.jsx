"use client"

/* eslint-disable react/no-unknown-property */ /* eslint-disable no-unused-vars */ /* eslint-disable react/prop-types */ /* eslint-disable react/no-unescaped-entities */
import FullCalendar from "@fullcalendar/react"
import toast, { Toaster } from "react-hot-toast"
import { useEffect, useRef, useState } from "react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

import { membersData } from "../../../utils/user-panel-states/appointment-states"

import AddAppointmentModal from "./add-appointment-modal"
import BlockAppointmentModal from "./block-appointment-modal"
import TrialTrainingModal from "./add-trial-training"
import EditAppointmentModalMain from "./selected-appointment-modal"
import HistoryModalMain from "./calendar-components/HistoryModalMain"


import MemberOverviewModalMain from "./calendar-components/MemberOverviewModalMain"
import MemberDetailsModalMain from "./calendar-components/MemberDetailsModalMain"
import AppointmentActionModalMain from "./calendar-components/AppointmentActionModalMain"
import NotifyMemberModalMain from "./calendar-components/NotifyMemberModalMain"
import TypeSelectionModalMain from "./calendar-components/TypeSelectionModalMain"
import ContingentModalMain from "./calendar-components/ContingentModalMain"
import AppointmentModalMain from "./calendar-components/AppointmentModalMain"
import EditBlockedSlotModalMain from "./calendar-components/EditBlockedSlotModalMain"


export default function Calendar({
  appointmentsMain = [],
  onEventClick,
  onDateSelect,
  searchQuery = "",
  selectedDate,
  setAppointmentsMain,
  appointmentFilters = {},
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [freeAppointments, setFreeAppointments] = useState([])
  const [currentDateDisplay, setCurrentDateDisplay] = useState("Feb 3 – 9, 2025")

  const [viewMode, setViewMode] = useState("all") // "all" or "free"
  const [activeTab, setActiveTab] = useState("details") // Enhanced states for member functionality
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false) // State for new modal
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null) // State for new modal data
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showListView, setShowListView] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")

  // Tooltip states
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: null,
  })

  const [currentDate, setCurrentDate] = useState(selectedDate || "2025-02-03")

  // Member contingent data
  const [memberContingent, setMemberContingent] = useState({
    1: { used: 2, total: 7 },
    2: { used: 1, total: 8 },
    3: { used: 0, total: 5 },
    4: { used: 3, total: 6 },
    5: { used: 1, total: 8 },
    6: { used: 4, total: 7 },
    7: { used: 2, total: 5 },
    8: { used: 0, total: 6 },
    9: { used: 1, total: 7 },
    10: { used: 3, total: 8 },
    11: { used: 2, total: 6 },
    12: { used: 1, total: 5 },
    13: { used: 0, total: 7 },
    14: { used: 2, total: 6 },
    15: { used: 1, total: 8 },
    16: { used: 3, total: 7 },
    17: { used: 0, total: 5 },
    18: { used: 2, total: 6 },
  })

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

  const [memberHistory, setMemberHistory] = useState({
    1: {
      general: [
        {
          id: 1,
          date: "2025-01-15",
          action: "Email updated",
          details: "Changed from old@email.com to yolanda@example.com",
          user: "Admin",
        },
        { id: 2, date: "2025-01-10", action: "Phone updated", details: "Updated phone number", user: "Admin" },
      ],
      checkins: [
        { id: 1, date: "2025-01-20T09:30", type: "Check-in", location: "Main Entrance", user: "Yolanda Martinez" },
        { id: 2, date: "2025-01-20T11:45", type: "Check-out", location: "Main Entrance", user: "Yolanda Martinez" },
      ],
      appointments: [
        { id: 1, date: "2025-01-18T10:00", title: "Personal Training", status: "completed", trainer: "Mike Johnson" },
        { id: 2, date: "2025-01-15T14:30", title: "Consultation", status: "completed", trainer: "Sarah Wilson" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
        {
          id: 2,
          date: "2024-12-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        {
          id: 1,
          date: "2024-03-01",
          action: "Contract signed",
          details: "Initial 12-month membership contract",
          user: "Admin",
        },
        { id: 2, date: "2024-02-28", action: "Contract updated", details: "Extended contract duration", user: "Admin" },
      ],
    },
    2: {
      general: [
        {
          id: 1,
          date: "2025-01-12",
          action: "Profile updated",
          details: "Updated personal information",
          user: "Admin",
        },
      ],
      checkins: [
        { id: 1, date: "2025-01-19T08:00", type: "Check-in", location: "Main Entrance", user: "Denis Johnson" },
        { id: 2, date: "2025-01-19T10:30", type: "Check-out", location: "Main Entrance", user: "Denis Johnson" },
      ],
      appointments: [
        { id: 1, date: "2025-01-17T14:00", title: "Cardio Session", status: "completed", trainer: "Lisa Davis" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$89.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        { id: 1, date: "2021-11-15", action: "Contract signed", details: "Initial membership contract", user: "Admin" },
      ],
    },
    // Add default empty history for other members
    3: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    4: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    5: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    6: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    7: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    8: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    9: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    10: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    11: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    12: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    13: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    14: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    15: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    16: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    17: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
    18: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  })

  const [members] = useState(membersData)

  const [memberRelations] = useState({
    1: {
      family: [
        { name: "Maria Martinez", relation: "Mother", id: 101 },
        { name: "Carlos Martinez", relation: "Father", id: 102 },
      ],
      friendship: [{ name: "Sofia Garcia", relation: "Best Friend", id: 201 }],
      relationship: [{ name: "David Lopez", relation: "Partner", id: 301 }],
      work: [{ name: "Lisa Johnson", relation: "Colleague", id: 401 }],
      other: [],
    },
    2: {
      family: [{ name: "Robert Johnson", relation: "Brother", id: 103 }],
      friendship: [{ name: "Mike Wilson", relation: "Friend", id: 202 }],
      relationship: [],
      work: [{ name: "Sarah Davis", relation: "Manager", id: 402 }],
      other: [],
    },
    3: {
      family: [
        { name: "Emma Smith", relation: "Sister", id: 104 },
        { name: "John Smith", relation: "Father", id: 105 },
      ],
      friendship: [{ name: "Ashley Brown", relation: "Best Friend", id: 203 }],
      relationship: [{ name: "Ryan Taylor", relation: "Boyfriend", id: 302 }],
      work: [],
      other: [],
    },
    // Add default empty relations for other members
    4: { family: [], friendship: [], relationship: [], work: [], other: [] },
    5: { family: [], friendship: [], relationship: [], work: [], other: [] },
    6: { family: [], friendship: [], relationship: [], work: [], other: [] },
    7: { family: [], friendship: [], relationship: [], work: [], other: [] },
    8: { family: [], friendship: [], relationship: [], work: [], other: [] },
    9: { family: [], friendship: [], relationship: [], work: [], other: [] },
    10: { family: [], friendship: [], relationship: [], work: [], other: [] },
    11: { family: [], friendship: [], relationship: [], work: [], other: [] },
    12: { family: [], friendship: [], relationship: [], work: [], other: [] },
    13: { family: [], friendship: [], relationship: [], work: [], other: [] },
    14: { family: [], friendship: [], relationship: [], work: [], other: [] },
    15: { family: [], friendship: [], relationship: [], work: [], other: [] },
    16: { family: [], friendship: [], relationship: [], work: [], other: [] },
    17: { family: [], friendship: [], relationship: [], work: [], other: [] },
    18: { family: [], friendship: [], relationship: [], work: [], other: [] },
  })

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
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [isMemberOverviewModalOpen, setIsMemberOverviewModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

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

  // Function to hide tooltip
  const hideTooltip = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null })
  }

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

  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false
    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)
    return endDate <= oneMonthFromNow && endDate >= today
  }

  const redirectToContract = () => {
    window.location.href = "/dashboard/contract"
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
    // // Check if it's a past or cancelled event and prevent drag/drop
    // const appointmentId = Number.parseInt(info.event.id)
    // const appointment = appointments?.find((app) => app.id === appointmentId)

    // if (appointment && (appointment.isPast || appointment.isCancelled)) {
    //   info.revert()
    //   const reason = appointment.isPast ? "past" : "cancelled"
    //   toast.error(`Cannot move ${reason} appointments`)
    //   return
    // }

    setPendingEventInfo(info)
    setNotifyAction("change")
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
    setIsAppointmentActionModalOpen(false)
    // Find member by name from the appointment
    const member = members.find((m) => m.title === selectedAppointment?.name)
    if (member) {
      setSelectedMember(member)
      setIsMemberOverviewModalOpen(true) // Show overview first instead of details
    } else {
      toast.error("Member details not found")
    }
  }

  // New function to handle going from overview to detailed view
  const handleViewDetailedInfo = () => {
    setIsMemberOverviewModalOpen(false)
    setActiveTab("details")
    setIsMemberDetailsModalOpen(true)
  }

  // Enhanced Calendar functions from members component
  const handleCalendarFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    setSelectedMemberForAppointments(selectedMember)
    setShowAppointmentModal(true)
  }

  // Enhanced History functions from members component
  const handleHistoryFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    setShowHistoryModal(true)
  }

  // Enhanced Communication functions from members component
  const handleCommunicationFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // Redirect to communications with member selected
    window.location.href = `/dashboard/communication`
  }

  // New function to handle edit from overview
  const handleEditFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // You can add edit functionality here
    toast.success("Edit functionality would be implemented here")
  }

  // Enhanced appointment functions from members component
  const handleEditAppointmentFromModal = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedMemberForAppointments?.title || "Member",
      specialNote: appointment.specialNote || { text: "", isImportant: false, startDate: "", endDate: "" },
    }
    setSelectedAppointmentData(fullAppointment)
    setShowSelectedAppointmentModal(true) // Open the new modal
    setShowAppointmentModal(false)
  }

  // New function to handle saving edited appointment from SelectedAppointmentModal
  const handleSaveEditedAppointment = (updatedAppointment) => {
    setMemberAppointments((prevAppointments) =>
      prevAppointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app)),
    )
    setShowSelectedAppointmentModal(false)
    toast.success("Appointment updated successfully!")
    // Optionally, prompt to notify member
    setNotifyAction("change")
    // Reconstruct a minimal eventInfo for notification if needed, or just trigger notification directly
    setIsNotifyMemberOpen(true)
  }

  const handleCreateNewAppointment = () => {
    setShowAddAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...memberAppointments.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForAppointments?.id,
    }
    setMemberAppointments([...memberAppointments, newAppointment])
    setShowAddAppointmentModal(false)
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

  const handleManageContingent = (memberId) => {
    const contingent = memberContingent[memberId] || { used: 0, total: 0 }
    setTempContingent(contingent)
    setShowContingentModal(true)
  }

  const handleSaveContingent = () => {
    if (selectedMemberForAppointments) {
      setMemberContingent((prev) => ({
        ...prev,
        [selectedMemberForAppointments.id]: tempContingent,
      }))
      toast.success("Contingent updated successfully")
    }
    setShowContingentModal(false)
  }

  // Get member appointments
  const getMemberAppointments = (memberId) => {
    return memberAppointments.filter((app) => app.memberId === memberId)
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
        title: "Available Slot",
        start: startDateTimeStr,
        end: new Date(new Date(startDateTimeStr).getTime() + 60 * 60 * 1000).toISOString(),
        backgroundColor: viewMode === "free" ? "#e5e7eb" : "#4a4a4a", // gray-200
        borderColor: viewMode === "free" ? "#d1d5db" : "#555555", // gray-300
        textColor: viewMode === "free" ? "#1f2937" : "#888888", // dark gray text
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
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 px-2"
            style={{ minHeight: "40px", flexShrink: 0 }}
          >
            <div
              className="flex items-center justify-between md:flex-row flex-col w-full mb-2 gap-2 px-2"
              style={{ minHeight: "40px", flexShrink: 0 }}
            >
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    const calendarApi = calendarRef.current?.getApi()
                    if (calendarApi) {
                      calendarApi.prev()
                      setCurrentDate(calendarApi.getDate().toISOString().split("T")[0])
                      setTimeout(() => {
                        setCurrentDateDisplay(formatDateRange(calendarApi.getDate()))
                      }, 100)
                    }
                  }}
                  className="p-1.5 sm:p-2 rounded-md bg-gray-600 hover:bg-gray-700 cursor-pointer text-white transition-colors"
                  aria-label="Previous"
                >
                  <GoArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => {
                    const calendarApi = calendarRef.current?.getApi()
                    if (calendarApi) {
                      calendarApi.next()
                      setCurrentDate(calendarApi.getDate().toISOString().split("T")[0])
                      setTimeout(() => {
                        setCurrentDateDisplay(formatDateRange(calendarApi.getDate()))
                      }, 100)
                    }
                  }}
                  className="p-1.5 sm:p-2 rounded-md bg-gray-600 hover:bg-gray-700 cursor-pointer text-white transition-colors"
                  aria-label="Next"
                >
                  <GoArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <div className="flex bg-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi()
                      if (calendarApi) {
                        calendarApi.changeView("dayGridMonth")
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()))
                        }, 100)
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white border-r border-slate-200/20 cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${
                      calendarRef.current?.getApi()?.view?.type === "dayGridMonth" ? "bg-gray-500" : "bg-gray-600"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi()
                      if (calendarApi) {
                        calendarApi.changeView("timeGridWeek")
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()))
                        }, 100)
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white border-r border-slate-200/20 cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${
                      calendarRef.current?.getApi()?.view?.type === "timeGridWeek" ? "bg-gray-500" : "bg-gray-600"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      const calendarApi = calendarRef.current?.getApi()
                      if (calendarApi) {
                        calendarApi.changeView("timeGridDay")
                        setTimeout(() => {
                          setCurrentDateDisplay(formatDateRange(calendarApi.getDate()))
                        }, 100)
                      }
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white cursor-pointer hover:bg-gray-600 transition-colors text-xs sm:text-sm ${
                      calendarRef.current?.getApi()?.view?.type === "timeGridDay" ? "bg-gray-500" : "bg-gray-600"
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>

              {/* CENTER: Custom Date Display */}
              <div className="flex-1 text-center px-2">
                <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {currentDateDisplay}
                </h2>
              </div>

              {/* RIGHT: View toggle and Free Slots */}
              <div className=" items-center gap-1 md:inline  sm:gap-2 flex-shrink-0">
                <button
                  onClick={generateFreeDates}
                  className={`p-1.5 sm:p-1.5 rounded-md text-white px-2 py-1.5 sm:px-3 sm:py-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0 ${
                    viewMode === "all" ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-500 hover:bg-gray-600"
                  }`}
                  aria-label={viewMode === "all" ? "Show Free Slots" : "Show All Slots"}
                >
                  <span className="hidden sm:inline">{viewMode === "all" ? "Free Slots" : "All Slots"}</span>
                  <span className="sm:hidden">{viewMode === "all" ? "Free Slots" : "All Slots"}</span>
                </button>
                {/* {isMobile && (
                  <button
                    onClick={() => setShowListView(!showListView)}
                    className="p-1.5 sm:p-1.5 rounded-md text-white px-2 py-1.5 sm:px-3 sm:py-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0 bg-gray-600 hover:bg-gray-500"
                  >
                    {showListView ? "Calendar" : "List"}
                  </button>
                )} */}
              </div>
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
                      className={`p-3 rounded-lg border cursor-pointer ${
                        apt.isPast ? "bg-gray-100 opacity-60" : "bg-white"
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
              height={isMobile ? "calc(100vh - 200px)" : "930px"} // Dynamic height for mobile
              selectable={true}
              headerToolbar={false}
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
              slotEventOverlap={false}
              eventOverlap={false}
              eventDragStart={(info) => {
                // Hide tooltip when drag starts
                hideTooltip()
              }}
              eventDragStop={(info) => {
                hideTooltip()
                // Tooltip will be shown again on mouse enter if needed
              }}
              eventResizeStart={(info) => {
                // Hide tooltip when resize starts
                hideTooltip()
              }}
              dayMaxEvents={false}
              eventMaxStack={10}
              // Responsive day header format
              dayHeaderContent={(args) => {
                const date = new Date(args.date)
                const isSmallScreen = window.innerWidth < 1024 // Changed to include tablets
                const weekday = date.toLocaleDateString("en-US", {
                  weekday: isSmallScreen ? "short" : "long",
                })
                const day = date.getDate()

                // Remove comma and show date below day name
                if (isSmallScreen) {
                  return (
                    <div style={{ textAlign: "center", lineHeight: "1.2" }}>
                      <div>{weekday.substr(0, 3)}</div>
                      <div>{day}</div>
                    </div>
                  )
                } else {
                  return (
                    <div style={{ textAlign: "center", lineHeight: "1.2" }}>
                      <div>{weekday}</div>
                      <div>{day}</div>
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
                showTooltip(info.event, info.jsEvent)
              }}
              eventMouseLeave={() => {
                hideTooltip()
              }}
              eventContent={(eventInfo) => (
                <div
                  className={`p-0.5 sm:p-1 h-full overflow-hidden transition-all duration-200 ${
                    eventInfo.event.extendedProps.isPast ? "opacity-25" : ""
                  } ${
                    eventInfo.event.extendedProps.isCancelled ? "cancelled-event-content cancelled-appointment-bg" : ""
                  } ${
                    eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked
                      ? "blocked-event-content blocked-appointment-bg"
                      : ""
                  } ${
                    eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                      ? "opacity-20"
                      : ""
                  } ${
                    eventInfo.event.extendedProps.isFree && eventInfo.event.extendedProps.viewMode === "free"
                      ? " shadow-lg transform scale-105"
                      : ""
                  }`}
                >
                  <div
                    className={`font-semibold text-[10px] sm:text-xs md:text-sm truncate ${
                      eventInfo.event.extendedProps.isPast
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
                    className={`text-[8px] sm:text-xs opacity-90 truncate ${
                      eventInfo.event.extendedProps.isPast
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
                    {eventInfo.event.extendedProps.type || "Available"}
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

      <MemberOverviewModalMain
        isOpen={isMemberOverviewModalOpen}
        selectedMember={selectedMember}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        handleCalendarFromOverview={handleCalendarFromOverview}
        handleHistoryFromOverview={handleHistoryFromOverview}
        handleCommunicationFromOverview={handleCommunicationFromOverview}
        handleViewDetailedInfo={handleViewDetailedInfo}
        handleEditFromOverview={handleEditFromOverview}
        setIsMemberOverviewModalOpen={setIsMemberOverviewModalOpen}
        setSelectedMember={setSelectedMember}
      />
      <MemberDetailsModalMain
        isOpen={isMemberDetailsModalOpen}
        selectedMember={selectedMember}
        setIsOpen={setIsMemberDetailsModalOpen}
        setSelectedMember={setSelectedMember}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        redirectToContract={redirectToContract}
        memberRelations={memberRelations}
      />
      <AppointmentModalMain
        showModal={showAppointmentModal}
        selectedMember={selectedMemberForAppointments}
        setShowModal={setShowAppointmentModal}
        setSelectedMember={setSelectedMemberForAppointments}
        getMemberAppointments={getMemberAppointments}
        appointmentTypesMain={appointmentTypesMain}
        handleEditAppointmentFromModal={handleEditAppointmentFromModal}
        handleDeleteAppointment={handleDeleteAppointment}
        currentBillingPeriod={currentBillingPeriod}
        memberContingent={memberContingent}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
      />
      <ContingentModalMain
        showContingentModal={showContingentModal}
        setShowContingentModal={setShowContingentModal}
        currentBillingPeriod={currentBillingPeriod}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        handleSaveContingent={handleSaveContingent}
      />
      <HistoryModalMain
        showHistoryModal={showHistoryModal}
        setShowHistoryModal={setShowHistoryModal}
        selectedMember={selectedMember}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        memberHistory={memberHistory}
      />
      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModal}
          onClose={() => setShowAddAppointmentModal(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          freeAppointments={freeAppointments}
        />
      )}
      {isAppointmentModalOpen && (
        <AddAppointmentModal
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

      
      <Toaster position="top-right" />

      <style jsx>{`

      /* RESET AND BASE STYLES */
:global(.fc) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Desktop styles - keep all columns visible */
@media (min-width: 1024px) {
  :global(.fc) {
    font-size: 14px;
    width: 100%;
    overflow: visible;
  }
  
  :global(.fc-view-harness) {
    overflow: visible;
    width: 100%;
  }
  
  :global(.fc-scroller-harness) {
    overflow: visible;
  }
  
  :global(.fc-scroller) {
    overflow: visible;
  }
  
  /* Dynamic column widths based on day name length */
  :global(.fc-col-header-cell) {
    font-size: 14px !important;
    padding: 8px 2px !important;
    text-align: center;
    border-right: 1px solid #e5e7eb;
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }
  
  /* Specific width adjustments for different days */
  :global(.fc-col-header-cell:nth-child(1)) { /* Monday */
    width: 13% !important;
    min-width: 90px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(2)) { /* Tuesday */
    width: 14% !important;
    min-width: 95px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(3)) { /* Wednesday */
    width: 16% !important;
    min-width: 110px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(4)) { /* Thursday */
    width: 15% !important;
    min-width: 100px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(5)) { /* Friday */
    width: 13% !important;
    min-width: 90px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(6)) { /* Saturday */
    width: 15% !important;
    min-width: 100px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(7)) { /* Sunday */
    width: 14% !important;
    min-width: 95px !important;
  }
  
  /* Match body columns to header columns */
  :global(.fc-timegrid-col:nth-child(1)) {
    width: 13% !important;
    min-width: 90px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(2)) {
    width: 14% !important;
    min-width: 95px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(3)) {
    width: 16% !important;
    min-width: 110px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(4)) {
    width: 15% !important;
    min-width: 100px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(5)) {
    width: 13% !important;
    min-width: 90px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(6)) {
    width: 15% !important;
    min-width: 100px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(7)) {
    width: 14% !important;
    min-width: 95px !important;
  }
  
  :global(.fc-timegrid-axis) {
    width: 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
  }
  
  :global(.fc-timegrid-axis-cushion) {
    font-size: 12px !important;
    padding: 4px !important;
  }
  
  :global(.fc-event-title) {
    font-size: 13px !important;
  }
  
  :global(.fc-event-time) {
    font-size: 11px !important;
  }
}

/* Tablet and mobile styles - horizontally scrollable with stretched columns */
@media (max-width: 1023px) {
  :global(.fc) {
    font-size: 12px;
    width: 150% !important;
    min-width: 900px !important;
    overflow-x: auto !important;
  }
  
  :global(.fc-view-harness) {
    overflow-x: auto !important;
    width: 100% !important;
  }
  
  :global(.fc-scroller-harness) {
    overflow-x: auto !important;
  }
  
  :global(.fc-scroller) {
    overflow-x: auto !important;
  }
  
  :global(.fc-view) {
    overflow-x: auto !important;
    width: 100% !important;
  }
  
  :global(.fc-timegrid) {
    overflow-x: auto !important;
    min-width: 900px !important;
  }
  
  /* Wider columns for better text visibility on mobile */
  :global(.fc-col-header-cell) {
    font-size: 12px !important;
    padding: 8px 4px !important;
    text-align: center;
    border-right: 1px solid #e5e7eb;
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }
  
  /* Specific width adjustments for mobile days */
  :global(.fc-col-header-cell:nth-child(1)) { /* Monday */
    width: 120px !important;
    min-width: 120px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(2)) { /* Tuesday */
    width: 125px !important;
    min-width: 125px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(3)) { /* Wednesday */
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(4)) { /* Thursday */
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(5)) { /* Friday */
    width: 120px !important;
    min-width: 120px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(6)) { /* Saturday */
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(7)) { /* Sunday */
    width: 125px !important;
    min-width: 125px !important;
  }
  
  /* Match body columns to header columns */
  :global(.fc-timegrid-col:nth-child(1)) {
    width: 120px !important;
    min-width: 120px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(2)) {
    width: 125px !important;
    min-width: 125px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(3)) {
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(4)) {
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(5)) {
    width: 120px !important;
    min-width: 120px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(6)) {
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(7)) {
    width: 125px !important;
    min-width: 125px !important;
  }
  
  :global(.fc-timegrid-axis) {
    width: 70px !important;
    min-width: 70px !important;
    max-width: 70px !important;
  }
  
  :global(.fc-timegrid-axis-cushion) {
    font-size: 11px !important;
    padding: 4px !important;
  }
  
  :global(.fc-event-title) {
    font-size: 11px !important;
  }
  
  :global(.fc-event-time) {
    font-size: 10px !important;
  }
}

/* Mobile specific adjustments */
@media (max-width: 640px) {
  :global(.fc) {
    font-size: 11px;
    width: 220% !important;
    min-width: 1000px !important;
  }
  
  :global(.fc-col-header-cell) {
    font-size: 11px !important;
    padding: 6px 3px !important;
    white-space: nowrap !important;
    overflow: visible !important;
  }
  
  /* Mobile day widths - extra width for Wednesday */
  :global(.fc-col-header-cell:nth-child(1)) { /* Monday */
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(2)) { /* Tuesday */
    width: 135px !important;
    min-width: 135px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(3)) { /* Wednesday */
    width: 155px !important;
    min-width: 155px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(4)) { /* Thursday */
    width: 145px !important;
    min-width: 145px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(5)) { /* Friday */
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(6)) { /* Saturday */
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(7)) { /* Sunday */
    width: 135px !important;
    min-width: 135px !important;
  }
  
  /* Match body columns */
  :global(.fc-timegrid-col:nth-child(1)) {
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(2)) {
    width: 135px !important;
    min-width: 135px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(3)) {
    width: 155px !important;
    min-width: 155px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(4)) {
    width: 145px !important;
    min-width: 145px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(5)) {
    width: 130px !important;
    min-width: 130px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(6)) {
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(7)) {
    width: 135px !important;
    min-width: 135px !important;
  }
  
  :global(.fc-timegrid-axis) {
    width: 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
  }
  
  :global(.fc-timegrid-axis-cushion) {
    font-size: 10px !important;
    padding: 3px !important;
  }
  
  :global(.fc-event-title) {
    font-size: 10px !important;
  }
  
  :global(.fc-event-time) {
    font-size: 9px !important;
  }
}

/* Very small mobile screens */
@media (max-width: 480px) {
  :global(.fc) {
    font-size: 10px;
    width: 280% !important;
    min-width: 1100px !important;
  }
  
  :global(.fc-col-header-cell) {
    font-size: 10px !important;
    padding: 5px 2px !important;
    white-space: nowrap !important;
    overflow: visible !important;
  }
  
  /* Very small mobile day widths */
  :global(.fc-col-header-cell:nth-child(1)) { /* Monday */
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(2)) { /* Tuesday */
    width: 145px !important;
    min-width: 145px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(3)) { /* Wednesday */
    width: 165px !important;
    min-width: 165px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(4)) { /* Thursday */
    width: 155px !important;
    min-width: 155px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(5)) { /* Friday */
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(6)) { /* Saturday */
    width: 150px !important;
    min-width: 150px !important;
  }
  
  :global(.fc-col-header-cell:nth-child(7)) { /* Sunday */
    width: 145px !important;
    min-width: 145px !important;
  }
  
  /* Match body columns */
  :global(.fc-timegrid-col:nth-child(1)) {
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(2)) {
    width: 145px !important;
    min-width: 145px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(3)) {
    width: 165px !important;
    min-width: 165px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(4)) {
    width: 155px !important;
    min-width: 155px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(5)) {
    width: 140px !important;
    min-width: 140px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(6)) {
    width: 150px !important;
    min-width: 150px !important;
  }
  
  :global(.fc-timegrid-col:nth-child(7)) {
    width: 145px !important;
    min-width: 145px !important;
  }
  
  :global(.fc-timegrid-axis) {
    width: 55px !important;
    min-width: 55px !important;
    max-width: 55px !important;
  }
  
  :global(.fc-timegrid-axis-cushion) {
    font-size: 9px !important;
    padding: 2px !important;
  }
  
  :global(.fc-event-title) {
    font-size: 9px !important;
  }
  
  :global(.fc-event-time) {
    font-size: 8px !important;
  }
}

/* Common styles for all screen sizes */
:global(.fc-col-header-cell-cushion) {
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: nowrap !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Force proper table layout */
:global(.fc-timegrid-header-table),
:global(.fc-timegrid-body-table) {
  width: 100% !important;
  table-layout: fixed !important;
}

/* Ensure table cells respect the width settings */
:global(.fc-timegrid-header-table td),
:global(.fc-timegrid-body-table td) {
  box-sizing: border-box !important;
  padding: 0 !important;
}

/* Event styling remains consistent */
:global(.fc-event) {
  border: none !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  margin: 1px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:global(.fc-event-title) {
  font-weight: 600 !important;
  line-height: 1.3 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

:global(.fc-event.past-event) {
  opacity: 0.4 !important;
  filter: brightness(0.6) !important;
}

:global(.fc-event.past-event .fc-event-title),
:global(.fc-event.past-event .fc-event-time) {
  color: #555555 !important;
}

:global(.fc-event-time) {
  font-weight: 400 !important;
  opacity: 0.9 !important;
  line-height: 1.2 !important;
}

/* Time axis styling */
:global(.fc-timegrid-axis) {
  border-right: 2px solid #e5e7eb !important;
  background: #f9fafb !important;
}

:global(.fc-timegrid-axis-cushion) {
  color: #6b7280 !important;
  font-weight: 500 !important;
  text-align: center !important;
}

/* Grid lines */
:global(.fc-timegrid-slot) {
  border-top: 1px solid #f3f4f6 !important;
}

:global(.fc-timegrid-slot-minor) {
  border-top: 1px solid #f9fafb !important;
}

/* Column separators */
:global(.fc-timegrid-col) {
  border-right: 1px solid #e5e7eb !important;
}

/* Header styling */
:global(.fc-col-header) {
  background: #f9fafb !important;
  border-bottom: 2px solid #e5e7eb !important;
}

/* Today highlight */
:global(.fc-day-today) {
  background-color: rgba(59, 130, 246, 0.05) !important;
}

:global(.fc-col-header-cell.fc-day-today) {
  background-color: rgba(59, 130, 246, 0.1) !important;
  color: #1d4ed8 !important;
  font-weight: 700 !important;
}

/* Free slot styling */
:global(.free-slot-event) {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
  color: #15803d !important;
  border-left: 3px solid #15803d !important;
  font-weight: 600 !important;
}

:global(.prominent-free-slot) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4) !important;
  border: none !important;
  transform: scale(1.02) !important;
  animation: pulse-green 2s infinite !important;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.6);
  }
}

/* Tooltip styling */
:global(.tooltip-container) {
  background: rgba(0, 0, 0, 0.9) !important;
  color: white !important;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  max-width: 250px !important;
  word-wrap: break-word !important;
  z-index: 1000 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

/* Scrollbar styling for horizontal scroll */
@media (max-width: 1023px) {
  :global(.fc-view-harness)::-webkit-scrollbar {
    height: 8px;
  }
  
  :global(.fc-view-harness)::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  :global(.fc-view-harness)::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  :global(.fc-view-harness)::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}

        .cancelled-appointment-bg {
          background-image: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 75%,
            transparent
          );
          background-size: 10px 10px;
        }

        .blocked-appointment-bg {
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
  background-color: #dc2626; // red-600
}
      `}</style>
    </>
  )
}
