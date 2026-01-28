/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {
  X,
  Clock,
  Info,
  Search,
  AlertTriangle,
  CalendarIcon,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Edit,
  Plus,
  CalendarCheck,
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

import { appointmentsData as initialAppointmentsData } from "../../utils/user-panel-states/app-states"

import TrialTrainingModal from "../../components/user-panel-components/appointments-components/add-trial-training"
import CreateAppointmentModal from "../../components/user-panel-components/appointments-components/add-appointment-modal"
import MiniCalendar from "../../components/user-panel-components/appointments-components/mini-calender"
import BlockAppointmentModal from "../../components/user-panel-components/appointments-components/block-appointment-modal"
import Calendar from "../../components/user-panel-components/appointments-components/calendar"
import AppointmentActionModal from "../../components/user-panel-components/appointments-components/appointment-action-modal"

import EditAppointmentModal from "../../components/user-panel-components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { createPortal } from "react-dom"
import TrainingPlansModalMain from "../../components/user-panel-components/appointments-components/training-plan-modal"
import { SpecialNoteEditModal } from "../../components/myarea-components/SpecialNoteEditModal"
import { useNavigate } from "react-router-dom"

export default function Appointments() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // Disable main container scrolling on mount
  useEffect(() => {
    // Reset scroll position to top immediately
    window.scrollTo(0, 0);
    
    // Find the main container element
    const mainContainer = document.querySelector('main');
    const originalOverflow = mainContainer?.style.overflow;
    
    if (mainContainer) {
      // Reset scroll position of main container
      mainContainer.scrollTop = 0;
      // Disable scrolling
      mainContainer.style.overflow = 'hidden';
    }
    
    // Also reset any parent scrollable containers
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      dashboardContent.scrollTop = 0;
    }
    
    // Reset body scroll as well
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Cleanup: restore overflow when component unmounts
    return () => {
      if (mainContainer) {
        mainContainer.style.overflow = originalOverflow || '';
      }
    };
  }, []);

  const [appointmentsMain, setAppointmentsMain] = useState(initialAppointmentsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false)

  // Calendar navigation state
  const [calendarDateDisplay, setCalendarDateDisplay] = useState("")
  const [calendarViewMode, setCalendarViewMode] = useState("all")
  const [currentView, setCurrentView] = useState("timeGridWeek")
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date())

  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const [selectedAppointmentMain, setSelectedAppointmentMain] = useState(null)
  const [activeNoteIdMain, setActiveNoteIdMain] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMemberMain, setSelectedMemberMain] = useState(null)
  const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false)
  const [notifyActionMain, setNotifyActionMain] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAppointmentOptionsModalMain, setshowAppointmentOptionsModalMain] = useState(false)
  const [isEditAppointmentModalOpenMain, setisEditAppointmentModalOpenMain] = useState(false)
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true)
  const [isUpcomingCollapsed, setIsUpcomingCollapsed] = useState(false)

  const [isTrainingPlanModalOpenMain, setIsTrainingPlanModalOpenMain] = useState(false)
  const [selectedUserForTrainingPlanMain, setSelectedUserForTrainingPlanMain] = useState(null)
  const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({})
  const [showEditNoteModalMain, setShowEditNoteModalMain] = useState(false)
  const [selectedAppointmentForNoteMain, setSelectedAppointmentForNoteMain] = useState(null)

  const [appointmentFilters, setAppointmentFilters] = useState({
    "EMS Strength": true,
    "EMS Cardio": true,
    "EMP Chair": true,
    "Body Check": true,
    "Trial Training": true,
    "Blocked Time Slots": true,
    "Cancelled Appointments": true,
    "Past Appointments": true,
  })

  const [freeAppointmentsMain, setFreeAppointmentsMain] = useState([
    { id: "free1", date: "2025-01-03", time: "10:00" },
    { id: "free2", date: "2025-01-03", time: "11:00" },
    { id: "free3", date: "2025-01-03", time: "14:00" },
  ])

  const [appointmentTypesMain, setAppointmentTypesMain] = useState([
    { name: "EMS Strength", color: "bg-[#EF4444]", duration: 30 },
    { name: "EMS Cardio", color: "bg-[#10B981]", duration: 30 },
    { name: "EMP Chair", color: "bg-[#8B5CF6]", duration: 30 },
    { name: "Body Check", color: "bg-[#06B6D4]", duration: 30 },
  ])

  const [filteredAppointments, setFilteredAppointments] = useState(appointmentsMain)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)

  const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
    { id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner" },
    { id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced" },
    { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate" },
    { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate" },
  ])

  useEffect(() => { applyFilters() }, [appointmentsMain, selectedDate, searchQuery, appointmentFilters])

  const notePopoverRefMain = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRefMain.current && !notePopoverRefMain.current.contains(event.target)) {
        setActiveNoteIdMain(null)
      }
    }
    if (activeNoteIdMain !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeNoteIdMain])

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null)
      setActiveNoteIdMain(null)
      setIsBookDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const applyFilters = () => {
    let filtered = [...appointmentsMain]
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
    filtered = filtered.filter((appointment) => {
      if (appointment.isTrial) return appointmentFilters["Trial Training"]
      else if (appointment.isBlocked || appointment.type === "Blocked Time") return appointmentFilters["Blocked Time Slots"]
      else if (appointment.isCancelled) return appointmentFilters["Cancelled Appointments"]
      else if (appointment.isPast && !appointment.isCancelled) return appointmentFilters["Past Appointments"]
      else return appointmentFilters[appointment.type] || false
    })
    setFilteredAppointments(filtered)
  }

  const handleFilterChange = (filterName) => {
    setAppointmentFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }))
  }

  const toggleAllFilters = () => {
    const allSelected = Object.values(appointmentFilters).every((value) => value)
    const newState = !allSelected
    setAppointmentFilters({
      "EMS Strength": newState, "EMS Cardio": newState, "EMP Chair": newState, "Body Check": newState,
      "Trial Training": newState, "Blocked Time Slots": newState, "Cancelled Appointments": newState, "Past Appointments": newState,
    })
  }

  const handleDateSelect = (date) => { setSelectedDate(date) }

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

  const handleViewMemberDetailsMain = () => {
    setIsAppointmentActionModalOpen(false);
    setshowAppointmentOptionsModalMain(false);
    if (!selectedAppointmentMain) { toast.error("No appointment selected"); return }
    const memberIdToNavigate = selectedAppointmentMain.memberId || selectedAppointmentMain.id;
    if (memberIdToNavigate) navigate(`/dashboard/member-details/${memberIdToNavigate}`);
    else toast.error("Member ID not found for this appointment");
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointmentsMain.length + 1, ...appointmentData, status: "pending", isTrial: false, isCancelled: false, isPast: false,
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    toast.success("Appointment booked successfully")
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointmentsMain.length + 1, ...trialData, status: "pending", isTrial: true, isCancelled: false, isPast: false,
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    toast.success("Trial training booked successfully")
  }

  const handleCheckInMain = (appointmentId) => {
    setAppointmentsMain((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment
      )
    )
    toast.success(appointmentsMain.find((app) => app.id === appointmentId)?.isCheckedIn ? "Member checked In successfully" : "Member check in successfully")
  }

  const handleNotifyMemberMain = (shouldNotify) => {
    setIsNotifyMemberOpenMain(false)
    if (shouldNotify) { toast.success("Appointment cancelled successfully"); toast.success("Member notified successfully") }
    else { toast.success("Appointment cancelled successfully"); toast.success("Member not notified") }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    if (query === "") setSelectedMemberMain(null)
    else {
      const foundMember = appointmentsMain.find((app) => app.name?.toLowerCase().includes(query))
      setSelectedMemberMain(foundMember ? foundMember.name : null)
    }
  }

  const handleDeleteAppointmentMain = (appointmentId) => {
    setAppointmentsMain((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId))
    setSelectedAppointmentMain(null)
    toast.success("Appointment deleted successfully")
  }

  const handleCancelAppointmentMain = (appointmentId) => {
    const updatedAppointments = appointmentsMain.map((app) =>
      app.id === appointmentId ? { ...app, status: "cancelled", isCancelled: true } : app
    )
    setAppointmentsMain(updatedAppointments)
    setSelectedAppointmentMain(null)
    setIsNotifyMemberOpenMain(true)
    setNotifyActionMain("cancel")
  }

  const toggleSidebar = () => { setIsSidebarCollapsed(!isSidebarCollapsed) }

  const handleAppointmentOptionsModalMain = (appointment) => {
    setSelectedAppointmentMain(appointment)
    setshowAppointmentOptionsModalMain(true)
    setisEditAppointmentModalOpenMain(false)
  }

  const handleEditNoteMain = (appointmentId, currentNote) => {
    const appointment = appointmentsMain.find(app => app.id === appointmentId)
    if (appointment) {
      setSelectedAppointmentForNoteMain(appointment)
      setShowEditNoteModalMain(true)
      setActiveNoteIdMain(null)
      setHoveredNoteId(null)
    }
  }

  const handleSaveSpecialNoteMain = (appointmentId, updatedNote) => {
    setAppointmentsMain(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId ? { ...appointment, specialNote: updatedNote } : appointment
      )
    )
    toast.success("Special note updated successfully")
    setShowEditNoteModalMain(false)
    setSelectedAppointmentForNoteMain(null)
  }

  const renderSpecialNoteIconMain = useCallback((specialNote, memberId) => {
    if (!specialNote?.text) return null
    const isActive = specialNote.startDate === null || (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
    if (!isActive) return null

    const handleNoteClick = (e) => { e.stopPropagation(); setActiveNoteIdMain(activeNoteIdMain === memberId ? null : memberId) }
    const handleMouseEnter = (e) => {
      e.stopPropagation()
      if (hoverTimeout) { clearTimeout(hoverTimeout); setHoverTimeout(null) }
      const timeout = setTimeout(() => setHoveredNoteId(memberId), 300)
      setHoverTimeout(timeout)
    }
    const handleMouseLeave = (e) => {
      e.stopPropagation()
      if (hoverTimeout) { clearTimeout(hoverTimeout); setHoverTimeout(null) }
      setHoveredNoteId(null)
    }

    const shouldShowPopover = activeNoteIdMain === memberId || hoveredNoteId === memberId

    return (
      <div className="relative">
        <div id={`note-trigger-${memberId}`} className={`${specialNote.isImportant ? "bg-red-500" : "bg-blue-500"} rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer transition-all duration-200 hover:scale-110`}
          onClick={handleNoteClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {specialNote.isImportant ? <AlertTriangle size={18} className="text-white" /> : <Info size={18} className="text-white" />}
        </div>
        {shouldShowPopover && createPortal(
          <div ref={notePopoverRefMain} className="fixed w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[9999]"
            style={{
              top: (() => { const trigger = document.getElementById(`note-trigger-${memberId}`); if (!trigger) return '50%'; const rect = trigger.getBoundingClientRect(); const spaceBelow = window.innerHeight - rect.bottom; const popoverHeight = 200; if (spaceBelow < popoverHeight && rect.top > popoverHeight) return `${rect.top - popoverHeight - 8}px`; return `${rect.bottom + 8}px` })(),
              left: (() => { const trigger = document.getElementById(`note-trigger-${memberId}`); if (!trigger) return '50%'; const rect = trigger.getBoundingClientRect(); const popoverWidth = 288; let left = rect.left; if (left + popoverWidth > window.innerWidth) left = window.innerWidth - popoverWidth - 16; if (left < 16) left = 16; return `${left}px` })(),
            }}
            onMouseEnter={() => { if (hoveredNoteId === memberId) setHoveredNoteId(memberId) }}
            onMouseLeave={() => { if (hoveredNoteId === memberId) setHoveredNoteId(null) }}>
            <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
              {specialNote.isImportant ? <AlertTriangle className="text-red-500 shrink-0" size={18} /> : <Info className="text-blue-500 shrink-0" size={18} />}
              <h4 className="text-white flex gap-1 items-center font-medium"><div>Special Note</div><div className="text-sm text-gray-400">{specialNote.isImportant ? "(Important)" : ""}</div></h4>
              <button onClick={(e) => { e.stopPropagation(); handleEditNoteMain(memberId, specialNote) }} className="ml-auto text-gray-400 hover:text-blue-400 transition-colors p-1" title="Edit note"><Edit size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); setActiveNoteIdMain(null); setHoveredNoteId(null) }} className="text-gray-400 hover:text-white transition-colors p-1"><X size={16} /></button>
            </div>
            <div className="p-3">
              <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
              {specialNote.startDate && specialNote.endDate ? (
                <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                  <p className="text-xs text-gray-300 flex items-center gap-1.5"><CalendarIcon size={12} /> Valid from {new Date(specialNote.startDate).toLocaleDateString()} to {new Date(specialNote.endDate).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                  <p className="text-xs text-gray-300 flex items-center gap-1.5"><CalendarIcon size={12} /> Always valid</p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    )
  }, [activeNoteIdMain, setActiveNoteIdMain, hoveredNoteId, hoverTimeout])

  const handleDumbbellClickMain = (appointment, e) => { e.stopPropagation(); setSelectedUserForTrainingPlanMain(appointment); setIsTrainingPlanModalOpenMain(true) }

  const handleAssignTrainingPlanMain = (memberId, planId) => {
    const plan = availableTrainingPlansMain.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = { ...plan, assignedDate: new Date().toLocaleDateString() }
      setMemberTrainingPlansMain((prev) => ({ ...prev, [memberId]: [...(prev[memberId] || []), assignedPlan] }))
      toast.success(`Training plan "${plan.name}" assigned successfully!`)
    }
  }

  const handleRemoveTrainingPlanMain = (memberId, planId) => {
    setMemberTrainingPlansMain((prev) => ({ ...prev, [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId) }))
    toast.success("Training plan removed successfully!")
  }

  return (
    <>
      <style>{`
        @keyframes wobble { 0%, 100% { transform: rotate(0deg); } 15% { transform: rotate(-1deg); } 30% { transform: rotate(1deg); } 45% { transform: rotate(-1deg); } 60% { transform: rotate(1deg); } 75% { transform: rotate(-1deg); } 90% { transform: rotate(1deg); } }
        .animate-wobble { animation: wobble 0.5s ease-in-out infinite; }
        .dragging { opacity: 0.5; border: 2px dashed #fff; }
        .drag-over { border: 2px dashed #888; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
      <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

      <div className="relative h-[92vh] max-h-[92vh] flex flex-col rounded-3xl bg-[#1C1C1C] transition-all duration-500 ease-in-out overflow-hidden">
        <main className="flex-1 min-w-0 flex flex-col min-h-0 pt-4 pb-4 pl-4 pr-0">
          {/* Header with navigation controls */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 relative">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl oxanium_font font-bold text-white">Appointments</h1>
            </div>

            {/* Calendar Navigation - Centered over calendar days (offset for sidebar + time column) - Desktop */}
            <div className={`hidden lg:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 ${isSidebarCollapsed ? 'left-[calc(50%+18px)] -translate-x-1/2' : 'left-[calc(50%+168px)] -translate-x-1/2'}`}>
              {/* Free Slots Toggle */}
              <button onClick={() => calendarRef.current?.toggleFreeSlots()}
                className={`text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-medium ${calendarViewMode === "free" ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300"}`}>
                <CalendarCheck size={16} />
                {calendarViewMode === "all" ? "Free Slots" : "All Slots"}
              </button>

              {/* Navigation Arrows */}
              <button onClick={() => calendarRef.current?.prev()} className="p-2 bg-black rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                <GoArrowLeft className="w-4 h-4" />
              </button>

              {/* Date Display */}
              <span className="text-white text-sm font-medium min-w-[140px] text-center">{calendarDateDisplay}</span>

              {/* Next Arrow */}
              <button onClick={() => calendarRef.current?.next()} className="p-2 bg-black rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                <GoArrowRight className="w-4 h-4" />
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-black rounded-xl p-1">
                <button 
                  onClick={() => { calendarRef.current?.changeView("dayGridMonth"); setCurrentView("dayGridMonth"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "dayGridMonth" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => { calendarRef.current?.changeView("timeGridWeek"); setCurrentView("timeGridWeek"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "timeGridWeek" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => { calendarRef.current?.changeView("timeGridDay"); setCurrentView("timeGridDay"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "timeGridDay" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Right side - Book Button */}
            <div className="flex items-center gap-2 pr-4">
              {/* Book Dropdown - Desktop */}
              <div className="hidden lg:block relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus size={14} />
                  Book
                  <ChevronDown size={14} className={`transition-transform ${isBookDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isBookDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50 min-w-[180px]">
                    <button 
                      onClick={() => { setIsModalOpen(true); setIsBookDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Book Appointment
                    </button>
                    <button 
                      onClick={() => { setIsTrialModalOpen(true); setIsBookDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#3F74FF]"></div>
                      Book Trial Training
                    </button>
                    <div className="border-t border-gray-700"></div>
                    <button 
                      onClick={() => { setIsBlockModalOpen(true); setIsBookDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Block Time Slot
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden flex gap-2 mb-4">
            <button onClick={() => setIsModalOpen(true)} className="flex-1 bg-orange-500 py-2.5 px-3 text-sm rounded-xl flex items-center justify-center gap-2 text-white">
              <Plus size={14} />
              Appointment
            </button>
            <button onClick={() => setIsTrialModalOpen(true)} className="flex-1 bg-black py-2.5 px-3 text-sm rounded-xl flex items-center justify-center gap-2 text-white">
              Trial
            </button>
            <button onClick={() => setIsBlockModalOpen(true)} className="flex-1 bg-black py-2.5 px-3 text-sm rounded-xl flex items-center justify-center gap-2 text-white">
              Block
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center justify-between gap-2 mb-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <button onClick={() => calendarRef.current?.prev()} className="p-2 bg-black rounded-lg text-white"><GoArrowLeft className="w-3 h-3" /></button>
              <button onClick={() => calendarRef.current?.next()} className="p-2 bg-black rounded-lg text-white"><GoArrowRight className="w-3 h-3" /></button>
            </div>
            <span className="text-white text-xs font-medium flex-1 text-center truncate">{calendarDateDisplay}</span>
            <button onClick={() => calendarRef.current?.toggleFreeSlots()} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${calendarViewMode === "free" ? "bg-orange-500 text-white" : "bg-[#2F2F2F] text-gray-300"}`}>
              <CalendarCheck size={12} />
              {calendarViewMode === "all" ? "Free" : "All"}
            </button>
          </div>

          {/* Main Content */}
          <div className="flex lg:flex-row flex-col gap-4 flex-1 min-h-0 pr-4 lg:pr-0 relative">
            {/* Sidebar Toggle Button - Overlay */}
            <button 
              onClick={toggleSidebar} 
              className={`hidden lg:flex absolute z-20 bg-orange-500 text-white p-1.5 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-500 items-center justify-center ${isSidebarCollapsed ? 'left-0' : 'left-[296px]'}`}
              style={{ top: '-4px' }}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Left Sidebar - flex container, nur Upcoming scrollt */}
            <div className={`transition-all duration-500 ease-in-out ${isSidebarCollapsed ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0" : "lg:w-[300px] lg:min-w-[300px] lg:opacity-100"} w-full md:w-full flex-shrink-0 lg:h-full lg:overflow-hidden`}>
              <div className="flex flex-col gap-3 lg:pb-2 h-full">
                <div className="w-full lg:max-w-[300px] flex-shrink-0">
                  <MiniCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} externalDate={miniCalendarDate} />
                </div>

                <div className="w-full lg:max-w-[300px] flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
                {/* Search - feste Größe */}
                <div className="flex items-center gap-2 w-full flex-shrink-0">
                  <div className="relative w-full">
                    <input type="text" placeholder="Search member..." value={searchQuery} onChange={handleSearch}
                      className="w-full bg-[#000000] text-white rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]" />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Filters - feste Größe */}
                <div className="bg-[#000000] rounded-xl p-3 w-full flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-sm">Filters</h3>
                    <div className="flex items-center gap-2">
                      {!isFiltersCollapsed && (
                        <button onClick={toggleAllFilters} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          {Object.values(appointmentFilters).every((value) => value) ? "Deselect All" : "Select All"}
                        </button>
                      )}
                      <button onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)} className="text-gray-400 hover:text-white transition-colors">
                        {isFiltersCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                    </div>
                  </div>
                  {!isFiltersCollapsed && (
                    <div className="space-y-1 mt-2 w-full">
                      {appointmentTypesMain.map((type) => (
                        <label key={type.name} className="flex items-center gap-2 cursor-pointer w-full">
                          <input type="checkbox" checked={appointmentFilters[type.name]} onChange={() => handleFilterChange(type.name)}
                            className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                          <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                          <span className="text-white text-xs">{type.name}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input type="checkbox" checked={appointmentFilters["Trial Training"]} onChange={() => handleFilterChange("Trial Training")}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                        <div className="w-2 h-2 rounded-full bg-[#3F74FF]"></div>
                        <span className="text-white text-xs">Trial Training</span>
                      </label>
                      <div className="border-t border-gray-600 my-1"></div>
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input type="checkbox" checked={appointmentFilters["Blocked Time Slots"]} onChange={() => handleFilterChange("Blocked Time Slots")}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                        <span className="text-white text-xs">Blocked</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input type="checkbox" checked={appointmentFilters["Cancelled Appointments"]} onChange={() => handleFilterChange("Cancelled Appointments")}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                        <span className="text-white text-xs">Cancelled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input type="checkbox" checked={appointmentFilters["Past Appointments"]} onChange={() => handleFilterChange("Past Appointments")}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                        <span className="text-white text-xs">Past</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="w-full flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white font-bold text-sm">Upcoming Appointments</h2>
                    <button onClick={() => setIsUpcomingCollapsed(!isUpcomingCollapsed)} className="text-gray-400 hover:text-white transition-colors">
                      {isUpcomingCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  </div>
                  {!isUpcomingCollapsed && (
                    <div className="space-y-2 custom-scrollbar overflow-y-auto flex-1 w-full">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <div key={appointment.id}
                            className={`${appointment.isCancelled ? "bg-gray-700 cancelled-appointment-bg" : appointment.isPast && !appointment.isCancelled ? "bg-gray-800 opacity-50" : appointment.color} rounded-xl cursor-pointer p-2 relative w-full`}
                            onClick={() => handleAppointmentOptionsModalMain(appointment)}>
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                              {renderSpecialNoteIconMain(appointment.specialNote, appointment.id)}
                              <div className="cursor-pointer rounded transition-colors" onClick={(e) => handleDumbbellClickMain(appointment, e)}>
                                <Dumbbell className="text-white" size={14} />
                              </div>
                            </div>
                            <div className="flex flex-col mr-12 items-center justify-between gap-1 cursor-pointer">
                              <div className="flex items-center gap-2 ml-4 relative w-full justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                                  <img src={Avatar || "/placeholder.svg"} alt="" className="w-full h-full rounded-full" />
                                </div>
                                <div className="text-white text-left">
                                  <p className="font-semibold text-xs">{appointment.name} {appointment.lastName}</p>
                                  <p className="text-[10px] flex gap-1 items-center opacity-80">
                                    <Clock size={10} />{appointment.time} | {appointment.date?.split("|")[0]}
                                  </p>
                                  <p className="text-[10px] opacity-80">
                                    {appointment.isTrial ? "Trial Session" : appointment.isCancelled ? <span className="text-red-400">Cancelled</span> : appointment.type}
                                  </p>
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleCheckInMain(appointment.id) }}
                                className={`px-2 py-0.5 ml-8 text-[10px] font-medium rounded-lg ${appointment.isCheckedIn ? "border border-white/50 text-white bg-transparent" : "bg-black text-white"}`}>
                                {appointment.isCheckedIn ? "Checked In" : "Check In"}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white text-center text-xs">No appointments scheduled.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>

            {/* Calendar Container */}
            <div className={`flex-1 bg-[#000000] rounded-l-xl overflow-hidden transition-all duration-500 lg:h-full min-h-[400px] lg:min-h-0 ${isSidebarCollapsed ? "lg:w-full" : ""}`}>
              <Calendar
                ref={calendarRef}
                appointmentsMain={appointmentsMain}
                onDateSelect={handleDateSelect}
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                setAppointmentsMain={setAppointmentsMain}
                appointmentFilters={appointmentFilters}
                setSelectedAppointmentMain={setSelectedAppointmentMain}
                onOpenSelectedAppointmentModal={setIsAppointmentActionModalOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                onDateDisplayChange={setCalendarDateDisplay}
                onViewModeChange={setCalendarViewMode}
                onCurrentDateChange={setMiniCalendarDate}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <CreateAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAppointmentSubmit} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} availableMembersLeads={[]} />
        <TrialTrainingModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} freeAppointmentsMain={freeAppointmentsMain} onSubmit={handleTrialSubmit} />
        <AppointmentActionModal isOpen={showAppointmentOptionsModalMain} onClose={() => { setshowAppointmentOptionsModalMain(false); setSelectedAppointmentMain(null) }} appointmentMain={selectedAppointmentMain} onEdit={() => { setshowAppointmentOptionsModalMain(false); setisEditAppointmentModalOpenMain(true) }} onCancel={handleCancelAppointmentMain} onViewMember={handleViewMemberDetailsMain} />
        {isEditAppointmentModalOpenMain && selectedAppointmentMain && (
          <EditAppointmentModal selectedAppointmentMain={selectedAppointmentMain} setSelectedAppointmentMain={setSelectedAppointmentMain} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointmentsMain}
            handleAppointmentChange={(changes) => setSelectedAppointmentMain((prev) => ({ ...prev, ...changes }))} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} onDelete={handleDeleteAppointmentMain} onClose={() => { setisEditAppointmentModalOpenMain(false); setSelectedAppointmentMain(null) }} />
        )}
        {isNotifyMemberOpenMain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={() => setIsNotifyMemberOpenMain(false)}>
            <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify Member</h2>
                <button onClick={() => setIsNotifyMemberOpenMain(false)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6"><p className="text-white text-sm">Do you want to notify the member about this {notifyActionMain === "change" ? "change" : notifyActionMain === "cancel" ? "cancellation" : notifyActionMain === "delete" ? "deletion" : "booking"}?</p></div>
              <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
                <button onClick={() => handleNotifyMemberMain(true)} className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors">Yes, Notify Member</button>
                <button onClick={() => handleNotifyMemberMain(false)} className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors">No, Don't Notify</button>
              </div>
            </div>
          </div>
        )}
        <BlockAppointmentModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} appointmentTypesMain={appointmentTypesMain} selectedDate={selectedDate || new Date()} onSubmit={(blockData) => {
          const newBlock = { id: appointmentsMain.length + 1, name: "BLOCKED", time: `${blockData.startTime} - ${blockData.endTime}`,
            date: `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDateForDisplay(new Date(blockData.startDate))} -> ${formatDateForDisplay(new Date(blockData.endDate))}`,
            color: "bg-[#FF4D4F]", startTime: blockData.startTime, endTime: blockData.endTime, type: "Blocked Time",
            specialNote: { text: blockData.note || "This time slot is blocked", startDate: blockData.startDate, endDate: blockData.endDate, isImportant: true },
            status: "blocked", isBlocked: true, isCancelled: false, isPast: false }
          setAppointmentsMain([...appointmentsMain, newBlock]); toast.success("Time slot blocked successfully"); setIsBlockModalOpen(false)
        }} />
        <TrainingPlansModalMain isOpen={isTrainingPlanModalOpenMain} onClose={() => { setIsTrainingPlanModalOpenMain(false); setSelectedUserForTrainingPlanMain(null) }} selectedMember={selectedUserForTrainingPlanMain} memberTrainingPlans={memberTrainingPlansMain[selectedUserForTrainingPlanMain?.id] || []} availableTrainingPlans={availableTrainingPlansMain} onAssignPlan={handleAssignTrainingPlanMain} onRemovePlan={handleRemoveTrainingPlanMain} />
        {showEditNoteModalMain && selectedAppointmentForNoteMain && (
          <SpecialNoteEditModal isOpen={showEditNoteModalMain} onClose={() => { setShowEditNoteModalMain(false); setSelectedAppointmentForNoteMain(null) }} appointment={selectedAppointmentForNoteMain} onSave={handleSaveSpecialNoteMain} />
        )}
        <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />
        <style jsx>{`.cancelled-appointment-bg { background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent); background-size: 10px 10px; }`}</style>
      </div>
    </>
  )
}
