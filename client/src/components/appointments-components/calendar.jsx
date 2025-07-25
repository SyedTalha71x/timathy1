/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import FullCalendar from "@fullcalendar/react"
import { Edit, User, X, FileText, CalendarIcon, History, MessageCircle, Eye, Info, Edit3, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import DefaultAvatar from "../../../public/default-avatar.avif"
import AddAppointmentModal from "./add-appointment-modal"
import BlockAppointmentModal from "./block-appointment-modal"
import TrialPlanningModal from "../lead-components/add-trial"
import { membersData } from "../../utils/states"

export default function Calendar({
  appointments = [],
  onEventClick,
  onDateSelect,
  searchQuery = "",
  selectedDate,
  setAppointments,
  appointmentFilters = {},
}) {
  const [calendarSize, setCalendarSize] = useState(100)
  const [calendarHeight, setCalendarHeight] = useState("auto")
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [freeAppointments, setFreeAppointments] = useState([])
  const [viewMode, setViewMode] = useState("all") // "all" or "free"
  const [activeTab, setActiveTab] = useState("details")
  // Enhanced states for member functionality
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [showRelationsModal, setShowRelationsModal] = useState(false)
  const [showRelationsTile, setShowRelationsTile] = useState(false)
  const [selectedRelationMember, setSelectedRelationMember] = useState(null)
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
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
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
    { name: "Consultation", color: "bg-blue-700", duration: 30 },
    { name: "Follow-up", color: "bg-green-700", duration: 45 },
    { name: "Annual Review", color: "bg-purple-600", duration: 60 },
    { name: "Training", color: "bg-orange-600", duration: 60 },
    { name: "Assessment", color: "bg-red-600", duration: 90 },
  ])
  // Enhanced appointments data for members
  const [memberAppointments, setMemberAppointments] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      date: "2025-03-15T10:00",
      status: "upcoming",
      type: "Consultation",
      memberId: 1,
      specialNote: {
        text: "First time client, needs introduction to equipment",
        isImportant: true,
        startDate: "2025-03-15",
        endDate: "2025-03-20",
      },
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      date: "2025-03-20T14:30",
      status: "upcoming",
      type: "Follow-up",
      memberId: 1,
    },
    {
      id: 3,
      title: "Annual Review",
      date: "2025-04-05T11:00",
      status: "upcoming",
      type: "Annual Review",
      memberId: 2,
    },
    {
      id: 4,
      title: "Strength Training",
      date: "2025-03-18T09:00",
      status: "upcoming",
      type: "Strength Training",
      memberId: 3,
    },
    {
      id: 5,
      title: "Yoga Session",
      date: "2025-03-22T16:00",
      status: "upcoming",
      type: "Yoga",
      memberId: 4,
    },
  ])
  // History data for members
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
        {
          id: 1,
          date: "2021-11-15",
          action: "Contract signed",
          details: "Initial membership contract",
          user: "Admin",
        },
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
  // Available members/leads for relations
  const availableMembersLeads = [
    { id: 101, name: "Anna Martinez", type: "member" },
    { id: 102, name: "Peter Martinez", type: "lead" },
    { id: 103, name: "Lisa Martinez", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]
  // Relation options by category
  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }
  // Sample member data - in real app, this would come from props or API
  const [members] = useState(membersData)
  // Also update the memberRelations to include data for these new members
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
      id: appointments.length + 1,
      ...appointmentData,
      status: "pending",
      isTrial: false,
      isCancelled: false, // Default for new appointments
      isPast: false, // Default for new appointments
      date: `${new Date(appointmentData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
    }
    setAppointments([...appointments, newAppointment])
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
      id: appointments.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
      isCancelled: false, // Default for new trials
      isPast: false, // Default for new trials
      date: `${new Date(trialData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    }
    setAppointments([...appointments, newTrial])
    toast.success("Trial training booked successfully")
  }
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
        freeDate.setDate(freeDate.getDate() + randomDay) // Use freeDate directly
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
  const handleViewChange = (viewInfo) => {
    if (viewInfo.view.type === "dayGridMonth") {
      setCalendarHeight("auto")
    } else {
      setCalendarHeight("650px")
    }
  }

  // Modified handleEventDrop to store info for potential rollback
  const handleEventDrop = (info) => {
    setPendingEventInfo(info) // Store the info object
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

  // Modified handleNotifyMember to handle rollback for drag/drop
  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    if (pendingEventInfo) {
      if (shouldNotify) {
        // User confirmed, apply the change
        const { event } = pendingEventInfo
        const duration = event.end - event.start
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
        toast.success("Appointment updated successfully and member notified!")
      } else {
        // User cancelled, revert the event visually
        pendingEventInfo.revert()
        toast.error("Appointment move cancelled.")
      }
      setPendingEventInfo(null) // Clear pending info
    } else {
      // This part handles notifications for other actions (e.g., cancellation from modal)
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

  // Modified handleCancelAppointment to update status instead of setting eventInfo for deletion
  const handleCancelAppointment = () => {
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
    if (!appointments || !setAppointments || !selectedAppointment) return
    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointments(updatedAppointments)
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
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentData(fullAppointment)
    setShowSelectedAppointmentModal(true)
    setShowAppointmentModal(false)
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
  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentData) {
      setSelectedAppointmentData({
        ...selectedAppointmentData,
        ...changes,
      })
    }
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

  const safeAppointments = appointments || []
  const safeSearchQuery = searchQuery || ""
  // Updated filteredAppointments to include appointment type filtering
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

        const isPastEvent = isEventInPast(startDateTimeStr)
        const isCancelledEvent = appointment.isCancelled // Use the new flag

        let backgroundColor = appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"
        let borderColor = backgroundColor
        let textColor = "#FFFFFF"
        let opacity = 1

        if (isCancelledEvent) {
          // Specific styling for cancelled appointments (diagonal stripes)
          backgroundColor = "#4a4a4a" // Muted background for cancelled
          borderColor = "#777777"
          textColor = "#bbbbbb"
          opacity = 0.6
        } else if (isPastEvent) {
          // Styling for past appointments (transparent/grayed out)
          backgroundColor = "#4a4a4a"
          borderColor = "#4a4a4a"
          textColor = "#999999"
          opacity = 0.4
        } else if (viewMode === "free") {
          // When showing free slots, other appointments are grayed out
          backgroundColor = "#555555"
          borderColor = "#555555"
          textColor = "#999999"
          opacity = 0.3
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
          isCancelled: isCancelledEvent, // Pass the cancelled flag
          extendedProps: {
            type: appointment.type || "Unknown",
            isPast: isPastEvent,
            isCancelled: isCancelledEvent, // Pass the cancelled flag
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
        backgroundColor: viewMode === "free" ? "#22c55e" : "#444444", // Gray for "all" mode
        borderColor: viewMode === "free" ? "#16a34a" : "#555555", // Gray for "all" mode
        textColor: "#FFFFFF",
        opacity: viewMode === "free" ? 1 : 0.6, // Reduced opacity for grayed out free slots
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
    setPendingEventInfo(info) // Store info for resize notification
    setIsNotifyMemberOpen(true)
  }
  return (
    <>
      <div className="h-full w-full">
        <div className="flex items-center justify-end mb-2 gap-2">
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
                    eventInfo.event.extendedProps.isCancelled
                      ? "cancelled-event-content" // Apply content styling for cancelled
                      : ""
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
                        : eventInfo.event.extendedProps.isCancelled
                          ? "text-gray-300" // Muted text for cancelled
                          : eventInfo.event.extendedProps.viewMode === "free" && !eventInfo.event.extendedProps.isFree
                            ? "text-gray-500"
                            : eventInfo.event.extendedProps.isFree && eventInfo.event.extendedProps.viewMode === "free"
                              ? "text-white font-bold"
                              : ""
                    }`}
                  >
                    {eventInfo.event.extendedProps.isCancelled
                      ? `${eventInfo.event.title}`
                      : eventInfo.event.extendedProps.isPast
                        ? `${eventInfo.event.title}`
                        : eventInfo.event.title}
                  </div>
                  <div
                    className={`text-xs opacity-90 truncate ${
                      eventInfo.event.extendedProps.isPast
                        ? "text-gray-500"
                        : eventInfo.event.extendedProps.isCancelled
                          ? "text-gray-400" // Muted text for cancelled
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
                if (eventInfo.event.extendedProps.isCancelled) {
                  classes.push("cancelled-event") // Add class for cancelled events
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
        :global(.cancelled-event) {
          background-image: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 75%,
            transparent
          ) !important;
          background-size: 10px 10px !important;
          opacity: 0.6 !important;
          filter: grayscale(0.5);
          border-color: #777777 !important;
        }
        :global(.cancelled-event-content) {
          color: #bbbbbb !important; /* Ensure text color is muted */
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
      {/* Member Overview Modal - ENHANCED */}
      {isMemberOverviewModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-6xl mx-4 my-8 relative">
            <div className="p-6">
              {/* Header matching the image design */}
              <div className="flex items-center justify-between bg-[#161616] rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <img
                    src={selectedMember.image || DefaultAvatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {/* Member Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-white text-xl font-semibold">
                        {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                      </h2>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          selectedMember.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                        }`}
                      >
                        {selectedMember.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Contract: {selectedMember.contractStart} -
                      <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                        {selectedMember.contractEnd}
                      </span>
                    </p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Calendar Button */}
                  <button
                    onClick={handleCalendarFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-blue-500 hover:text-blue-400"
                    title="View Calendar"
                  >
                    <CalendarIcon size={20} />
                  </button>
                  {/* History Button */}
                  <button
                    onClick={handleHistoryFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-purple-500 hover:text-purple-400"
                    title="View History"
                  >
                    <History size={20} />
                  </button>
                  {/* Communication Button */}
                  <button
                    onClick={handleCommunicationFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-green-500 hover:text-green-400"
                    title="Communication"
                  >
                    <MessageCircle size={20} />
                  </button>
                  {/* View Details Button */}
                  <button
                    onClick={handleViewDetailedInfo}
                    className="flex items-center gap-2 px-4 py-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-gray-200 hover:text-white"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={handleEditFromOverview}
                    className="px-4 py-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-gray-200 hover:text-white"
                  >
                    Edit
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsMemberOverviewModalOpen(false)
                      setSelectedMember(null)
                    }}
                    className="p-3 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Member Details Modal with Tabs - EXISTING */}
      {isMemberDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
                <button
                  onClick={() => {
                    setIsMemberDetailsModalOpen(false)
                    setSelectedMember(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "details"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("relations")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "relations"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Relations
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === "details" && (
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.image || DefaultAvatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                      </h3>
                      <p className="text-gray-400">
                        Contract: {selectedMember.contractStart} -
                        <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                          {selectedMember.contractEnd}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{selectedMember.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p>{`${selectedMember.street}, ${selectedMember.zipCode} ${selectedMember.city}`}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Date of Birth</p>
                      <p>
                        {selectedMember.dateOfBirth} (Age: {calculateAge(selectedMember.dateOfBirth)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Join Date</p>
                      <p>{selectedMember.joinDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">About</p>
                    <p>{selectedMember.about}</p>
                  </div>
                  {selectedMember.note && (
                    <div>
                      <p className="text-sm text-gray-400">Special Note</p>
                      <p>{selectedMember.note}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Note Period: {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                      </p>
                      <p className="text-sm text-gray-400">Importance: {selectedMember.noteImportance}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={redirectToContract}
                      className="flex items-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                    >
                      <FileText size={16} />
                      View Contract
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "relations" && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Relations Tree Visualization */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                    <div className="flex flex-col items-center space-y-8">
                      {/* Central Member */}
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                        {selectedMember.title}
                      </div>
                      {/* Connection Lines and Categories */}
                      <div className="relative w-full">
                        {/* Horizontal line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                        {/* Category sections */}
                        <div className="grid grid-cols-5 gap-4 pt-8">
                          {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                            <div key={category} className="flex flex-col items-center space-y-4">
                              {/* Vertical line */}
                              <div className="w-0.5 h-8 bg-gray-600"></div>
                              {/* Category header */}
                              <div
                                className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                                  category === "family"
                                    ? "bg-yellow-600 text-yellow-100"
                                    : category === "friendship"
                                      ? "bg-green-600 text-green-100"
                                      : category === "relationship"
                                        ? "bg-red-600 text-red-100"
                                        : category === "work"
                                          ? "bg-blue-600 text-blue-100"
                                          : "bg-gray-600 text-gray-100"
                                }`}
                              >
                                {category}
                              </div>
                              {/* Relations in this category */}
                              <div className="space-y-2">
                                {relations.map((relation) => (
                                  <div
                                    key={relation.id}
                                    className="bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px]"
                                  >
                                    <div className="text-white text-sm font-medium">{relation.name}</div>
                                    <div className="text-gray-400 text-xs">({relation.relation})</div>
                                  </div>
                                ))}
                                {relations.length === 0 && (
                                  <div className="text-gray-500 text-xs text-center">No relations</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Relations List */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                    <div className="space-y-4">
                      {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                        <div key={category}>
                          <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {relations.length > 0 ? (
                              relations.map((relation) => (
                                <div
                                  key={relation.id}
                                  className="flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3"
                                >
                                  <div>
                                    <span className="text-white font-medium">{relation.name}</span>
                                    <span className="text-gray-400 ml-2">- {relation.relation}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No {category} relations</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Appointment Modal from Members Component */}
      {showAppointmentModal && selectedMemberForAppointments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">{selectedMemberForAppointments.title}'s Appointments</h2>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false)
                    setSelectedMemberForAppointments(null)
                  }}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                {getMemberAppointments(selectedMemberForAppointments.id).length > 0 ? (
                  getMemberAppointments(selectedMemberForAppointments.id).map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                    const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"
                    return (
                      <div
                        key={appointment.id}
                        className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                        onClick={() => handleEditAppointmentFromModal(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{appointment.title}</p>
                            <div>
                              <p className="text-sm text-white/70">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-white/70">
                                {new Date(appointment.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAppointmentFromModal(appointment)
                              }}
                              className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAppointment(appointment.id)
                              }}
                              className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                    No appointments scheduled
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
                <div className="text-sm text-gray-300">
                  Contingent ({currentBillingPeriod}): {memberContingent[selectedMemberForAppointments.id]?.used || 0} /{" "}
                  {memberContingent[selectedMemberForAppointments.id]?.total || 0}
                </div>
                <button
                  onClick={() => handleManageContingent(selectedMemberForAppointments.id)}
                  className="flex items-center gap-1 bg-gray-700 text-white hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                >
                  <Edit3 size={16} />
                  Manage
                </button>
              </div>
              <button
                onClick={handleCreateNewAppointment}
                className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
              >
                Create New Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Contingent Management Modal */}
      {showContingentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Manage Appointment Contingent</h2>
                <button
                  onClick={() => setShowContingentModal(false)}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Billing Period: {currentBillingPeriod}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Used Appointments</label>
                      <input
                        type="number"
                        min={0}
                        max={tempContingent.total}
                        value={tempContingent.used}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, used: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Total Appointments</label>
                      <input
                        type="number"
                        min={tempContingent.used}
                        value={tempContingent.total}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, total: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Remaining: {tempContingent.total - tempContingent.used} appointments
                  </p>
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                    <p className="text-blue-200 text-sm">
                      <Info className="inline mr-1" size={14} />
                      You can edit the contingent for future billing periods here.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowContingentModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContingent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* History Modal */}
      {showHistoryModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex text-white justify-between items-center mb-6">
                <h2 className="text-lg font-medium">{selectedMember.title} - History & Changelog</h2>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              {/* History Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
                {[
                  { id: "general", label: "General Changes" },
                  { id: "checkins", label: "Check-ins & Check-outs" },
                  { id: "appointments", label: "Past Appointments" },
                  { id: "finance", label: "Finance Transactions" },
                  { id: "contracts", label: "Contract Changes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      historyTab === tab.id
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* History Content */}
              <div className="space-y-4">
                {historyTab === "general" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">General Changes</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.general?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.action}</p>
                              <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">{item.date}</p>
                              <p className="text-gray-500 text-xs">by {item.user}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No general changes recorded</p>}
                    </div>
                  </div>
                )}
                {historyTab === "checkins" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Check-ins & Check-outs History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.checkins?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${item.type === "Check-in" ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              <div>
                                <p className="text-white font-medium">{item.type}</p>
                                <p className="text-gray-400 text-sm">{item.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No check-in/check-out history</p>}
                    </div>
                  </div>
                )}
                {historyTab === "appointments" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Past Appointments History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.appointments?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.title}</p>
                              <p className="text-gray-400 text-sm">with {item.trainer}</p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                                  item.status === "completed"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No past appointments</p>}
                    </div>
                  </div>
                )}
                {historyTab === "finance" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Finance Transactions History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.finance?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.type}</p>
                              <p className="text-gray-400 text-sm">{item.description}</p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                                  item.status === "completed"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-semibold">{item.amount}</p>
                              <p className="text-gray-400 text-sm">{item.date}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No financial transactions</p>}
                    </div>
                  </div>
                )}
                {historyTab === "contracts" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Contract Changes History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.contracts?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.action}</p>
                              <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">{item.date}</p>
                              <p className="text-gray-500 text-xs">by {item.user}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No contract changes</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModal}
          onClose={() => setShowAddAppointmentModal(false)}
          appointmentTypes={appointmentTypes}
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
          appointmentTypes={appointmentTypes}
          onSubmit={handleAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
        />
      )}
      <TrialPlanningModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
      />
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
            isCancelled: false, // Default for new blocks
            isPast: false, // Default for new blocks
          }
          setAppointments([...appointments, newBlock])
          toast.success("Time slot blocked successfully")
          setIsBlockModalOpen(false)
        }}
      />
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
                onClick={handleCancelAppointment} // Calls the modified cancel handler
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
                <User className="mr-2" size={16} /> View Member
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
                onClick={() => {
                  // If user closes modal with X, it's a "No, Don't Notify" action
                  if (notifyAction === "cancel") {
                    // If it was a cancellation, the status is already updated. No rollback needed here.
                    // This is just for the notification prompt.
                  } else if (pendingEventInfo) {
                    // For drag/drop or resize, revert if not confirmed
                    pendingEventInfo.revert()
                    toast.error("Action cancelled.")
                  }
                  setIsNotifyMemberOpen(false)
                  setPendingEventInfo(null) // Clear pending info
                }}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-white text-sm">
                Do you want to notify the member about this{" "}
                {notifyAction === "change"
                  ? "change"
                  : notifyAction === "cancel"
                    ? "cancellation"
                    : notifyAction === "delete"
                      ? "deletion"
                      : "booking"}
                ?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => {
                  if (notifyAction === "cancel") {
                    actuallyHandleCancelAppointment(true) // Confirm cancellation and notify
                  } else {
                    handleNotifyMember(true) // Confirm other changes and notify
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
                    actuallyHandleCancelAppointment(false) // Confirm cancellation without notifying
                  } else {
                    handleNotifyMember(false) // Cancel other changes and don't notify (triggers revert)
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
