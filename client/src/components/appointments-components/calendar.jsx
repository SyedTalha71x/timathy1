/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import FullCalendar from "@fullcalendar/react"
import { Edit, User, X, FileText, CalendarIcon, History, MessageCircle, Eye } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import DefaultAvatar from "../../../public/default-avatar.avif"

function Calendar({ appointments = [], onEventClick, onDateSelect, searchQuery = "", selectedDate, setAppointments }) {
  const [calendarSize, setCalendarSize] = useState(100)
  const [calendarHeight, setCalendarHeight] = useState("auto")
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [freeAppointments, setFreeAppointments] = useState([])
  const [viewMode, setViewMode] = useState("all")
  const [activeTab, setActiveTab] = useState("details")

  // Sample member data - in real app, this would come from props or API
  const [members] = useState([
    {
      id: 1,
      firstName: "Yolanda",
      lastName: "Martinez",
      title: "Yolanda",
      email: "yolanda@example.com",
      phone: "+1234567890",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      image: null,
      isActive: true,
      note: "Prefers morning sessions",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1990-05-15",
      about: "Fitness enthusiast with a passion for strength training.",
      joinDate: "2022-03-01",
      contractStart: "2022-03-01",
      contractEnd: "2025-03-01",
    },
    {
      id: 2,
      firstName: "Denis",
      lastName: "Johnson",
      title: "Denis",
      email: "denis@example.com",
      phone: "+1234567891",
      street: "456 Oak St",
      zipCode: "67890",
      city: "Los Angeles",
      image: null,
      isActive: true,
      note: "Loves cardio workouts",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1985-08-22",
      about: "Marathon runner and cardio specialist.",
      joinDate: "2021-11-15",
      contractStart: "2021-11-15",
      contractEnd: "2025-04-15",
    },
    {
      id: 3,
      firstName: "Nicole",
      lastName: "Smith",
      title: "Nicole",
      email: "nicole@example.com",
      phone: "+1234567892",
      street: "789 Pine St",
      zipCode: "54321",
      city: "Chicago",
      image: null,
      isActive: true,
      note: "Yoga instructor background",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1992-03-10",
      about: "Certified yoga instructor with 5 years experience.",
      joinDate: "2022-01-01",
      contractStart: "2022-01-01",
      contractEnd: "2025-01-01",
    },
    {
      id: 4,
      firstName: "Melanie",
      lastName: "Brown",
      title: "Melanie",
      email: "melanie@example.com",
      phone: "+1234567893",
      street: "321 Elm St",
      zipCode: "98765",
      city: "Miami",
      image: null,
      isActive: true,
      note: "Personal training focused",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1988-07-25",
      about: "Dedicated to personal fitness goals.",
      joinDate: "2022-06-01",
      contractStart: "2022-06-01",
      contractEnd: "2025-06-01",
    },
    {
      id: 5,
      firstName: "Angela",
      lastName: "Davis",
      title: "Angela",
      email: "angela@example.com",
      phone: "+1234567894",
      street: "654 Maple Ave",
      zipCode: "13579",
      city: "Seattle",
      image: null,
      isActive: true,
      note: "Strength training enthusiast",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1991-12-05",
      about: "Powerlifter and strength training coach.",
      joinDate: "2022-02-15",
      contractStart: "2022-02-15",
      contractEnd: "2025-02-15",
    },
    {
      id: 6,
      firstName: "Kristina",
      lastName: "Wilson",
      title: "Kristina",
      email: "kristina@example.com",
      phone: "+1234567895",
      street: "987 Cedar Rd",
      zipCode: "24680",
      city: "Denver",
      image: null,
      isActive: true,
      note: "Cardio specialist",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1989-04-18",
      about: "Cardio enthusiast and fitness model.",
      joinDate: "2022-04-01",
      contractStart: "2022-04-01",
      contractEnd: "2025-04-01",
    },
    {
      id: 7,
      firstName: "Annett",
      lastName: "Taylor",
      title: "Annett",
      email: "annett@example.com",
      phone: "+1234567896",
      street: "147 Birch St",
      zipCode: "36912",
      city: "Boston",
      image: null,
      isActive: true,
      note: "Personal training focused",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1987-09-30",
      about: "Personal trainer with nutrition background.",
      joinDate: "2022-05-01",
      contractStart: "2022-05-01",
      contractEnd: "2025-05-01",
    },
    {
      id: 8,
      firstName: "Justin",
      lastName: "Miller",
      title: "Justin",
      email: "justin@example.com",
      phone: "+1234567897",
      street: "258 Spruce Ave",
      zipCode: "47103",
      city: "Phoenix",
      image: null,
      isActive: true,
      note: "Strength training focus",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1993-11-12",
      about: "Bodybuilder and strength athlete.",
      joinDate: "2022-07-01",
      contractStart: "2022-07-01",
      contractEnd: "2025-07-01",
    },
    {
      id: 9,
      firstName: "Michel",
      lastName: "Garcia",
      title: "Michel",
      email: "michel@example.com",
      phone: "+1234567898",
      street: "369 Willow Dr",
      zipCode: "58214",
      city: "Portland",
      image: null,
      isActive: true,
      note: "Cardio and endurance",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1986-02-28",
      about: "Endurance athlete and triathlete.",
      joinDate: "2022-08-01",
      contractStart: "2022-08-01",
      contractEnd: "2025-08-01",
    },
    {
      id: 10,
      firstName: "Colin",
      lastName: "Anderson",
      title: "Colin",
      email: "colin@example.com",
      phone: "+1234567899",
      street: "741 Poplar St",
      zipCode: "69325",
      city: "Austin",
      image: null,
      isActive: true,
      note: "Strength training specialist",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1990-06-14",
      about: "Powerlifting competitor and coach.",
      joinDate: "2022-09-01",
      contractStart: "2022-09-01",
      contractEnd: "2025-09-01",
    },
    {
      id: 11,
      firstName: "Yvonne",
      lastName: "Thomas",
      title: "Yvonne",
      email: "yvonne@example.com",
      phone: "+1234567800",
      street: "852 Ash Ave",
      zipCode: "70436",
      city: "Nashville",
      image: null,
      isActive: true,
      note: "Yoga and flexibility",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1984-10-07",
      about: "Yoga instructor and flexibility coach.",
      joinDate: "2022-10-01",
      contractStart: "2022-10-01",
      contractEnd: "2025-10-01",
    },
    {
      id: 12,
      firstName: "Jennifer",
      lastName: "Jackson",
      title: "Jennifer",
      email: "jennifer@example.com",
      phone: "+1234567801",
      street: "963 Hickory Rd",
      zipCode: "81547",
      city: "San Diego",
      image: null,
      isActive: true,
      note: "Personal training focus",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1991-01-20",
      about: "Certified personal trainer and nutritionist.",
      joinDate: "2022-11-01",
      contractStart: "2022-11-01",
      contractEnd: "2025-11-01",
    },
    {
      id: 13,
      firstName: "Michael",
      lastName: "White",
      title: "Michael",
      email: "michael@example.com",
      phone: "+1234567802",
      street: "174 Walnut St",
      zipCode: "92658",
      city: "Las Vegas",
      image: null,
      isActive: true,
      note: "Cardio enthusiast",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1987-05-03",
      about: "Marathon runner and cardio specialist.",
      joinDate: "2022-12-01",
      contractStart: "2022-12-01",
      contractEnd: "2025-12-01",
    },
    {
      id: 14,
      firstName: "Furkan",
      lastName: "Ozkan",
      title: "Furkan",
      email: "furkan@example.com",
      phone: "+1234567803",
      street: "285 Cherry Ave",
      zipCode: "03769",
      city: "Salt Lake City",
      image: null,
      isActive: true,
      note: "Strength training focus",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1994-08-16",
      about: "Bodybuilder and fitness enthusiast.",
      joinDate: "2023-01-01",
      contractStart: "2023-01-01",
      contractEnd: "2026-01-01",
    },
    {
      id: 15,
      firstName: "Heike",
      lastName: "Mueller",
      title: "Heike",
      email: "heike@example.com",
      phone: "+1234567804",
      street: "396 Peach Dr",
      zipCode: "14870",
      city: "Minneapolis",
      image: null,
      isActive: true,
      note: "Yoga specialist",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1983-12-29",
      about: "Advanced yoga practitioner and teacher.",
      joinDate: "2023-02-01",
      contractStart: "2023-02-01",
      contractEnd: "2026-02-01",
    },
    // Add more members as needed for other appointment names
    {
      id: 16,
      firstName: "Sandy",
      lastName: "Rodriguez",
      title: "Sandy",
      email: "sandy@example.com",
      phone: "+1234567805",
      street: "507 Orange St",
      zipCode: "25981",
      city: "Tampa",
      image: null,
      isActive: true,
      note: "Personal training specialist",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1989-03-22",
      about: "Certified personal trainer with sports background.",
      joinDate: "2023-03-01",
      contractStart: "2023-03-01",
      contractEnd: "2026-03-01",
    },
    {
      id: 17,
      firstName: "Ann-Kathrin",
      lastName: "Schmidt",
      title: "Ann-Kathrin",
      email: "ann-kathrin@example.com",
      phone: "+1234567806",
      street: "618 Lemon Ave",
      zipCode: "36092",
      city: "Orlando",
      image: null,
      isActive: true,
      note: "Cardio and fitness",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1992-07-08",
      about: "Fitness instructor and cardio specialist.",
      joinDate: "2023-04-01",
      contractStart: "2023-04-01",
      contractEnd: "2026-04-01",
    },
    {
      id: 18,
      firstName: "Katharina",
      lastName: "Weber",
      title: "Katharina",
      email: "katharina@example.com",
      phone: "+1234567807",
      street: "729 Grape Dr",
      zipCode: "47103",
      city: "Jacksonville",
      image: null,
      isActive: true,
      note: "Trial training participant",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1995-11-15",
      about: "New member interested in comprehensive fitness program.",
      joinDate: "2023-05-01",
      contractStart: "2023-05-01",
      contractEnd: "2026-05-01",
    },
  ])

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
  const [eventInfo, setEventInfo] = useState(null)
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

  // New function to handle edit from overview
  const handleEditFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // You can add edit functionality here
    toast.success("Edit functionality would be implemented here")
  }

  // New function to handle calendar from overview
  const handleCalendarFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // You can add calendar functionality here
    toast.success("Calendar functionality would be implemented here")
  }

  // New function to handle history from overview
  const handleHistoryFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // You can add history functionality here
    toast.success("History functionality would be implemented here")
  }

  // New function to handle communication from overview
  const handleCommunicationFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // You can add communication functionality here
    toast.success("Communication functionality would be implemented here")
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

      {/* Member Overview Modal - NEW */}
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
                    `${selectedAppointment.date.split("|")[1]?.trim()?.split("-")?.reverse()?.join("-")}T${
                      selectedAppointment.startTime
                    }`,
                  ) && <p className="text-yellow-500 text-sm mt-2">This is a past appointment</p>}
              </div>

              <button
                onClick={handleEditAppointment}
                className={`w-full px-5 py-3 ${
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date.split("|")[1]?.trim()?.split("-")?.reverse()?.join("-")}T${
                      selectedAppointment.startTime
                    }`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#3F74FF] hover:bg-[#3F74FF]/90 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date.split("|")[1]?.trim()?.split("-")?.reverse()?.join("-")}T${
                      selectedAppointment.startTime
                    }`,
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
                    `${selectedAppointment.date.split("|")[1]?.trim()?.split("-")?.reverse()?.join("-")}T${
                      selectedAppointment.startTime
                    }`,
                  )
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                } text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center`}
                disabled={
                  selectedAppointment.date &&
                  isEventInPast(
                    `${selectedAppointment.date.split("|")[1]?.trim()?.split("-")?.reverse()?.join("-")}T${
                      selectedAppointment.startTime
                    }`,
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

export default Calendar
