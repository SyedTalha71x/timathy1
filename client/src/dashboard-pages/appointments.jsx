"use client"

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { X, Clock, Info, Search, AlertTriangle, CalendarIcon, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import toast, { Toaster } from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"
import TrialPlanningModal from "../components/lead-components/add-trial"
import AddAppointmentModal from "../components/appointments-components/add-appointment-modal"
import SelectedAppointmentModal from "../components/appointments-components/selected-appointment-modal"
import MiniCalendar from "../components/appointments-components/mini-calender"
import BlockAppointmentModal from "../components/appointments-components/block-appointment-modal"
import { appointmentsData as initialAppointmentsData } from "../utils/states" // Renamed to avoid conflict
import Calendar from "../components/appointments-components/calendar"
import { useNavigate } from "react-router-dom"
import { SidebarArea } from "../components/custom-sidebar"
import Avatar from "../../public/avatar.png"
import Rectangle1 from "../../public/Rectangle 1.png"

export default function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(initialAppointmentsData) // Use initial data
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
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Filter state - Added Cancelled Appointments and Past Appointments
  const [appointmentFilters, setAppointmentFilters] = useState({
    "Strength Training": true,
    Cardio: true,
    Yoga: true,
    "Trial Training": true,
    "Blocked Time Slots": true,
    "Cancelled Appointments": true, // New filter
    "Past Appointments": true, // New filter
  })

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
  }, [appointments, selectedDate, searchQuery, appointmentFilters])

  const notePopoverRef = useRef(null)
  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])
  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])
  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }
  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }
  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }
  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }
  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }
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

  // Updated applyFilters function to include type filtering
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

    // Apply appointment type filters
    filtered = filtered.filter((appointment) => {
      if (appointment.isTrial) {
        return appointmentFilters["Trial Training"]
      } else if (appointment.isBlocked || appointment.type === "Blocked Time") {
        return appointmentFilters["Blocked Time Slots"]
      } else if (appointment.isCancelled) {
        return appointmentFilters["Cancelled Appointments"] // Filter for cancelled
      } else if (appointment.isPast && !appointment.isCancelled) {
        // Past but not cancelled
        return appointmentFilters["Past Appointments"] // Filter for past
      } else {
        // Check if the appointment type is in the selected filters
        return appointmentFilters[appointment.type] || false
      }
    })
    setFilteredAppointments(filtered)
  }

  // Function to handle filter changes
  const handleFilterChange = (filterName) => {
    setAppointmentFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  // Function to toggle all filters
  const toggleAllFilters = () => {
    const allSelected = Object.values(appointmentFilters).every((value) => value)
    const newState = !allSelected
    setAppointmentFilters({
      "Strength Training": newState,
      Cardio: newState,
      Yoga: newState,
      "Trial Training": newState,
      "Blocked Time Slots": newState,
      "Cancelled Appointments": newState, // Include new filter
      "Past Appointments": newState, // Include new filter
    })
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
      isCancelled: false, // Default for new appointments
      isPast: false, // Default for new appointments
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
      isCancelled: false, // Default for new trials
      isPast: false, // Default for new trials
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

  // Modified confirmRemoveAppointment to change status instead of delete
  const confirmRemoveAppointment = () => {
    setIsConfirmCancelOpen(false)
    if (appointmentToRemove) {
      const updatedAppointments = appointments.map((app) =>
        app.id === appointmentToRemove.id ? { ...app, status: "cancelled", isCancelled: true } : app,
      )
      setAppointments(updatedAppointments)
      toast.success("Appointment cancelled successfully")
      setIsNotifyMemberOpen(true)
      setNotifyAction("cancel")
      setAppointmentToRemove(null)
    }
  }

  const handleNotifyMember = (shouldNotify) => {
    // This function is now primarily for the notification modal after an action
    // The actual state update for cancellation happens in confirmRemoveAppointment or Calendar.jsx's actuallyHandleCancelAppointment
    setIsNotifyMemberOpen(false)
    if (shouldNotify) {
      toast.success("Member notified successfully")
    }
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
    // This function is for actual deletion, not cancellation
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
                      <CalendarIcon size={12} /> Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} /> Always valid
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
            <div className="flex justify-between items-center gap-2">
              <div></div>
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
              <div className="md:hidden block">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center md:flex-row flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <span>+</span> Add appointment
              </button>
              <button
                onClick={() => setIsTrialModalOpen(true)}
                className="w-full sm:w-auto bg-[#3F74FF] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <span>+</span> Add trial training
              </button>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-gray-700/90 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9h12M6 13h12M6 17h6" />
                </svg>
                Block time slot
              </button>
              <div className="md:block hidden">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
            </div>
          </div>
          <SidebarArea
            isOpen={isRightSidebarOpen}
            onClose={closeSidebar}
            communications={communications}
            todos={todos}
            birthdays={birthdays}
            customLinks={customLinks}
            setCustomLinks={setCustomLinks}
            redirectToCommunication={redirectToCommunication}
            redirectToTodos={redirectToTodos}
            toggleDropdown={toggleDropdown}
            openDropdownIndex={openDropdownIndex}
            setEditingLink={setEditingLink}
          />
          {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}></div>}
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
                {/* Filter Section */}
                <div className="bg-[#000000] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm">Appointment Filters</h3>
                    <button
                      onClick={toggleAllFilters}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {Object.values(appointmentFilters).every((value) => value) ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {/* Appointment Types */}
                    {appointmentTypes.map((type) => (
                      <label key={type.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appointmentFilters[type.name]}
                          onChange={() => handleFilterChange(type.name)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                        <span className="text-white text-sm">{type.name}</span>
                      </label>
                    ))}
                    {/* Trial Training */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appointmentFilters["Trial Training"]}
                        onChange={() => handleFilterChange("Trial Training")}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="w-3 h-3 rounded-full bg-[#3F74FF]"></div>
                      <span className="text-white text-sm">Trial Training</span>
                    </label>
                    {/* Blocked Time Slots - No circle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appointmentFilters["Blocked Time Slots"]}
                        onChange={() => handleFilterChange("Blocked Time Slots")}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      {/* Removed the color circle div */}
                      <span className="text-white text-sm">Blocked Time Slots</span>
                    </label>
                    {/* Cancelled Appointments - No circle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appointmentFilters["Cancelled Appointments"]}
                        onChange={() => handleFilterChange("Cancelled Appointments")}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      {/* Removed the color circle div */}
                      <span className="text-white text-sm">Cancelled Appointments</span>
                    </label>
                    {/* Past Appointments - No circle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appointmentFilters["Past Appointments"]}
                        onChange={() => handleFilterChange("Past Appointments")}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      {/* Removed the color circle div */}
                      <span className="text-white text-sm">Past Appointments</span>
                    </label>
                  </div>
                </div>
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
                          className={`${
                            appointment.isCancelled
                              ? "bg-gray-700 cancelled-appointment-bg" // Apply cancelled style
                              : appointment.isPast && !appointment.isCancelled
                                ? "bg-gray-800 opacity-50" // Apply past style
                                : appointment.color
                          } rounded-xl cursor-pointer p-5 relative`}
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
                                  ) : appointment.isCancelled ? (
                                    <span className="font-medium text-red-400">Cancelled</span>
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
                appointmentFilters={appointmentFilters}
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
        onDelete={handleDeleteAppointment} // Keep for actual deletion
        onCancelAppointment={(appointmentId) => {
          // New prop for cancellation (status change)
          const updatedAppointments = appointments.map((app) =>
            app.id === appointmentId ? { ...app, status: "cancelled", isCancelled: true } : app,
          )
          setAppointments(updatedAppointments)
          toast.success("Appointment cancelled successfully")
          setSelectedAppointment(null)
          setIsNotifyMemberOpen(true)
          setNotifyAction("cancel")
        }}
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
                  // This part handles the notification, the actual state change for cancel is done before this modal
                  handleNotifyMember(true)
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Notify Member
              </button>
              <button
                onClick={() => {
                  handleNotifyMember(false)
                }}
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
            isCancelled: false, // Default for new blocks
            isPast: false, // Default for new blocks
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

