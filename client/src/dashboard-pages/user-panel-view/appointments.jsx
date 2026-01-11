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
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"

import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { appointmentsData as initialAppointmentsData } from "../../utils/user-panel-states/appointment-states"

import TrialTrainingModal from "../../components/user-panel-components/appointments-components/add-trial-training"
import AddAppointmentModal from "../../components/user-panel-components/appointments-components/add-appointment-modal"
import MiniCalendar from "../../components/user-panel-components/appointments-components/mini-calender"
import BlockAppointmentModal from "../../components/user-panel-components/appointments-components/block-appointment-modal"
import Calendar from "../../components/user-panel-components/appointments-components/calendar"
import AppointmentActionModal from "../../components/user-panel-components/appointments-components/appointment-action-modal"


// sidebar related import
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditAppointmentModal from "../../components/user-panel-components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import { createPortal } from "react-dom"
import TrainingPlansModalMain from "../../components/user-panel-components/appointments-components/training-plan-modal"
import { SpecialNoteEditModal } from "../../components/myarea-components/SpecialNoteEditModal"
import { useNavigate } from "react-router-dom"

export default function Appointments() {
  const navigate = useNavigate();
  const sidebarSystem = useSidebarSystem();

  const [appointmentsMain, setAppointmentsMain] = useState(initialAppointmentsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)



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

  // FIXED: Added collapsible states for filters and upcoming appointments
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true)
  const [isUpcomingCollapsed, setIsUpcomingCollapsed] = useState(false)

  // new stats for fumbell and member overview modals

  const [isTrainingPlanModalOpenMain, setIsTrainingPlanModalOpenMain] = useState(false)
  const [selectedUserForTrainingPlanMain, setSelectedUserForTrainingPlanMain] = useState(null)
  const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({})
  const [showEditNoteModalMain, setShowEditNoteModalMain] = useState(false)
  const [selectedAppointmentForNoteMain, setSelectedAppointmentForNoteMain] = useState(null)

  // Filter state - Added Cancelled Appointments and Past Appointments
  const [appointmentFilters, setAppointmentFilters] = useState({
    "Strength Training": true,
    Cardio: true,
    Yoga: true,
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
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
  ])

  const [filteredAppointments, setFilteredAppointments] = useState(appointmentsMain)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)


  const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
    {
      id: 1,
      name: "Beginner Full Body",
      description: "Complete full body workout for beginners",
      duration: "4 weeks",
      difficulty: "Beginner",
    },
    {
      id: 2,
      name: "Advanced Strength Training",
      description: "High intensity strength building program",
      duration: "8 weeks",
      difficulty: "Advanced",
    },
    {
      id: 3,
      name: "Weight Loss Circuit",
      description: "Fat burning circuit training program",
      duration: "6 weeks",
      difficulty: "Intermediate",
    },
    {
      id: 4,
      name: "Muscle Building Split",
      description: "Targeted muscle building program",
      duration: "12 weeks",
      difficulty: "Intermediate",
    },
  ])

  useEffect(() => {
    applyFilters()
  }, [appointmentsMain, selectedDate, searchQuery, appointmentFilters])


  const notePopoverRefMain = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRefMain.current && !notePopoverRefMain.current.contains(event.target)) {
        setActiveNoteIdMain(null)
      }
    }
    if (activeNoteIdMain !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeNoteIdMain])

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null)
      setIsViewDropdownOpen(false)
      setActiveNoteIdMain(null)
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
  const handleFilterChange = (filterName) => {
    setAppointmentFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }
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

  const handleViewMemberDetailsMain = () => {
    setIsAppointmentActionModalOpen(false);
    setshowAppointmentOptionsModalMain(false);

    if (!selectedAppointmentMain) {
      toast.error("No appointment selected");
      return;
    }

    console.log("Selected appointment for member details:", selectedAppointmentMain);

    const memberIdToNavigate = selectedAppointmentMain.memberId || selectedAppointmentMain.id;

    if (memberIdToNavigate) {
      navigate(`/dashboard/member-details/${memberIdToNavigate}`);
    } else {
      toast.error("Member ID not found for this appointment");
    }
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointmentsMain.length + 1,
      ...appointmentData,
      status: "pending",
      isTrial: false,
      isCancelled: false, // Default for new appointments
      isPast: false, // Default for new appointments
      date: `${new Date(appointmentData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
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
      date: `${new Date(trialData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    toast.success("Trial training booked successfully")
  }

  const handleCheckInMain = (appointmentId) => {
    setAppointmentsMain((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment,
      ),
    )
    toast.success(
      appointmentsMain.find((app) => app.id === appointmentId)?.isCheckedIn
        ? "Member checked In successfully"
        : "Member check in successfully",
    )
  }

  const handleNotifyMemberMain = (shouldNotify) => {
    setIsNotifyMemberOpenMain(false)
    if (shouldNotify) {
      toast.success("Appointment cancelled successfully")
      toast.success("Member notified successfully")
    }
    else {
      toast.success("Appointment cancelled successfully")
      toast.success("Member not notified")
    }
  }
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    if (query === "") {
      setSelectedMemberMain(null)
    } else {
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
    // New function to handle cancellation (status change)
    const updatedAppointments = appointmentsMain.map((app) =>
      app.id === appointmentId ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointmentsMain(updatedAppointments)
    setSelectedAppointmentMain(null) // Close the modal
    setIsNotifyMemberOpenMain(true)
    setNotifyActionMain("cancel")
  }
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleAppointmentOptionsModalMain = (appointment) => {
    setSelectedAppointmentMain(appointment)
    setshowAppointmentOptionsModalMain(true)
    setisEditAppointmentModalOpenMain(false) // Ensure edit modal is closed
  }

  // Add this function to handle note editing
  const handleEditNoteMain = (appointmentId, currentNote) => {
    const appointment = appointmentsMain.find(app => app.id === appointmentId)
    if (appointment) {
      setSelectedAppointmentForNoteMain(appointment)
      setShowEditNoteModalMain(true)
      setActiveNoteIdMain(null)
      setHoveredNoteId(null)
    }
  }

  // Add this function to handle saving the edited note
  const handleSaveSpecialNoteMain = (appointmentId, updatedNote) => {
    setAppointmentsMain(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, specialNote: updatedNote }
          : appointment
      )
    )
    toast.success("Special note updated successfully")
    setShowEditNoteModalMain(false)
    setSelectedAppointmentForNoteMain(null)
  }

  const renderSpecialNoteIconMain = useCallback(
    (specialNote, memberId) => {
      if (!specialNote?.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setActiveNoteIdMain(activeNoteIdMain === memberId ? null : memberId)
      }

      const handleMouseEnter = (e) => {
        e.stopPropagation()
        // Clear any existing timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }

        // Set a small delay before showing to prevent flickering
        const timeout = setTimeout(() => {
          setHoveredNoteId(memberId)
        }, 300)
        setHoverTimeout(timeout)
      }

      const handleMouseLeave = (e) => {
        e.stopPropagation()
        // Clear the timeout if mouse leaves before delay
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }
        setHoveredNoteId(null)
      }

      // Determine if we should show the popover (either clicked or hovered)
      const shouldShowPopover = activeNoteIdMain === memberId || hoveredNoteId === memberId

      return (
        <div className="relative">
          <div
            id={`note-trigger-${memberId}`}
            className={`${specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer transition-all duration-200 hover:scale-110`}
            onClick={handleNoteClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {shouldShowPopover && (
            createPortal(
              <div
                ref={notePopoverRefMain}
                className="fixed w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[9999]"
                style={{
                  top: (() => {
                    const trigger = document.getElementById(`note-trigger-${memberId}`);
                    if (!trigger) return '50%';
                    const rect = trigger.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const popoverHeight = 200; // approximate height

                    // If not enough space below, show above
                    if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
                      return `${rect.top - popoverHeight - 8}px`;
                    }
                    return `${rect.bottom + 8}px`;
                  })(),
                  left: (() => {
                    const trigger = document.getElementById(`note-trigger-${memberId}`);
                    if (!trigger) return '50%';
                    const rect = trigger.getBoundingClientRect();
                    const popoverWidth = 288; // w-72 = 288px

                    // Keep within viewport
                    let left = rect.left;
                    if (left + popoverWidth > window.innerWidth) {
                      left = window.innerWidth - popoverWidth - 16;
                    }
                    if (left < 16) left = 16;

                    return `${left}px`;
                  })(),
                }}
                onMouseEnter={() => {
                  // Keep open when hovering over popover
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(memberId)
                  }
                }}
                onMouseLeave={() => {
                  // Only close if it was opened via hover (not click)
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(null)
                  }
                }}
              >
                <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {specialNote.isImportant ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex gap-1 items-center font-medium">
                    <div>Special Note</div>
                    <div className="text-sm text-gray-400">
                      {specialNote.isImportant ? "(Important)" : ""}
                    </div>
                  </h4>

                  {/* Edit Note Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditNoteMain(memberId, specialNote)
                    }}
                    className="ml-auto text-gray-400 hover:text-blue-400 transition-colors p-1"
                    title="Edit note"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveNoteIdMain(null)
                      setHoveredNoteId(null)
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1"
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
              </div>,
              document.body
            )
          )}
        </div>
      )
    },
    [activeNoteIdMain, setActiveNoteIdMain, hoveredNoteId, hoverTimeout],
  )

  const handleDumbbellClickMain = (appointment, e) => {
    e.stopPropagation()
    setSelectedUserForTrainingPlanMain(appointment)
    setIsTrainingPlanModalOpenMain(true)
  }

  const handleAssignTrainingPlanMain = (memberId, planId) => {
    const plan = availableTrainingPlansMain.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = {
        ...plan,
        assignedDate: new Date().toLocaleDateString(),
      }

      setMemberTrainingPlansMain((prev) => ({
        ...prev,
        [memberId]: [...(prev[memberId] || []), assignedPlan],
      }))

      toast.success(`Training plan "${plan.name}" assigned successfully!`)
    }
  }

  const handleRemoveTrainingPlanMain = (memberId, planId) => {
    setMemberTrainingPlansMain((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId),
    }))

    toast.success("Training plan removed successfully!")
  }


  // Extract all states and functions from the hook
  const {
    // States
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,

    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    freeAppointments,
    selectedMember,

    isNotifyMemberOpen,
    notifyAction,

    rightSidebarWidgets,
    notePopoverRef,

    // Setters
    setIsRightWidgetModalOpen,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setIsBirthdayMessageModalOpen,
    setSelectedBirthdayPerson,
    setBirthdayMessage,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setShowAppointmentModal,
    setIsEditModalOpen,
    setIsNotifyMemberOpen,
    setNotifyAction,
    setShowHistoryModal,

    setEditForm,

    // Functions
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,

    handleViewMemberDetails,
    handleNotifyMember,

    truncateUrl,
    renderSpecialNoteIcon,

    // new states 
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,


    memberTypes,
    availableMembersLeads,

    todoFilterOptions,
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem;

  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };


  return (
    <>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
      </style>
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

      <div
        className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] md:p-4 p-4
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen ? "lg:mr-84 mr-0" : "mr-0"}
    `}
      >
        <main className="flex-1 min-w-0">
          <div className="">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div className="flex w-full md:w-auto justify-between items-center gap-2">
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
                <div></div>
                <div onClick={toggleRightSidebar} className="lg:hidden md:hidden block">
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
              </div>
              <div className="flex items-center md:flex-row flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <span>+</span> Book Appointment
                </button>
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="w-full sm:w-auto bg-[#3F74FF] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <span>+</span> Book Trial Training
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
                  </svg>{" "}
                  Block Time Slot
                </button>

                {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="md:block hidden">
                  <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                ) : (<div onClick={toggleRightSidebar} className="md:block hidden">
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                )}


              </div>
            </div>


            <div className="flex lg:flex-row flex-col gap-6 relative">
            <div
    className={`transition-all duration-500 ease-in-out ${isSidebarCollapsed
      ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0"
      : "lg:w-[320px] lg:opacity-100" // Fixed width for large screens only
      } w-full md:w-full flex flex-col gap-6`} // Full width on tablet and mobile
  >
                <div className="w-full">
                  <div className="w-full lg:max-w-[320px]">
                    <MiniCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
                  </div>
                </div>

                <div className="w-full lg:max-w-[320px] flex flex-col gap-3">
                  <div className="flex items-center gap-4 w-full">
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

                  <div className="bg-[#000000] rounded-xl p-3  w-full">
                    <div className="flex items-center justify-between ">
                      <h3 className="text-white font-semibold text-sm">Appointment Filters</h3>
                      <div className="flex items-center gap-2">
                        {!isFiltersCollapsed && (
                          <button
                            onClick={toggleAllFilters}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {Object.values(appointmentFilters).every((value) => value) ? "Deselect All" : "Select All"}
                          </button>
                        )}

                        <button
                          onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {isFiltersCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      </div>
                    </div>
                    {!isFiltersCollapsed && (
                      <div className="space-y-1.5 mt-3 w-full">
                        {/* Appointment Types */}
                        {appointmentTypesMain.map((type) => (
                          <label key={type.name} className="flex items-center gap-2 cursor-pointer w-full">
                            <input
                              type="checkbox"
                              checked={appointmentFilters[type.name]}
                              onChange={() => handleFilterChange(type.name)}
                              className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div className={`w-2.5 h-2.5 rounded-full ${type.color}`}></div>
                            <span className="text-white text-xs">{type.name}</span>
                          </label>
                        ))}
                        {/* Trial Training */}
                        <label className="flex items-center gap-2 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={appointmentFilters["Trial Training"]}
                            onChange={() => handleFilterChange("Trial Training")}
                            className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3F74FF]"></div>
                          <span className="text-white text-xs">Trial Training</span>
                        </label>

                        <div className="border-t border-gray-600 my-2"></div>

                        <label className="flex items-center gap-2 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={appointmentFilters["Blocked Time Slots"]}
                            onChange={() => handleFilterChange("Blocked Time Slots")}
                            className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-xs">Blocked Time Slots</span>
                        </label>


                        <label className="flex items-center gap-2 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={appointmentFilters["Cancelled Appointments"]}
                            onChange={() => handleFilterChange("Cancelled Appointments")}
                            className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-xs">Cancelled Appointments</span>
                        </label>


                        <label className="flex items-center gap-2 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={appointmentFilters["Past Appointments"]}
                            onChange={() => handleFilterChange("Past Appointments")}
                            className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-xs">Past Appointments</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-white font-bold text-sm">Upcoming Appointments</h2>
                      <button
                        onClick={() => setIsUpcomingCollapsed(!isUpcomingCollapsed)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {isUpcomingCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </button>
                    </div>
                    {!isUpcomingCollapsed && (
                      <div className="space-y-2 custom-scrollbar overflow-y-auto  max-h-[335px] w-full">
                        {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((appointment, index) => (
                            <div
                              key={appointment.id}
                              className={`${appointment.isCancelled
                                ? "bg-gray-700 cancelled-appointment-bg"
                                : appointment.isPast && !appointment.isCancelled
                                  ? "bg-gray-800 opacity-50"
                                  : appointment.color
                                } rounded-xl cursor-pointer p-2 relative w-full`}
                              onClick={() => {
                                handleAppointmentOptionsModalMain(appointment)
                              }}
                            >
                              <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                {renderSpecialNoteIconMain(appointment.specialNote, appointment.id)}
                                <div
                                  className="cursor-pointer rounded transition-colors"
                                  onClick={(e) => handleDumbbellClickMain(appointment, e)}
                                >
                                  <Dumbbell className="text-white" size={16} />
                                </div>
                              </div>

                              <div className="flex flex-col mr-16 items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2 ml-4 relative w-full justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                                    <img
                                      src={Avatar || "/placeholder.svg"}
                                      alt=""
                                      className="w-full h-full rounded-full"
                                    />
                                  </div>
                                  <div className="text-white text-left">
                                    <p className="font-semibold text-sm">{appointment.name} {appointment.lastName}</p>
                                    <p className="text-xs flex gap-1 items-center opacity-80">
                                      <Clock size={12} />
                                      {appointment.time} | {appointment.date?.split("|")[0]}
                                    </p>
                                    <p className="text-xs opacity-80 mt-1">
                                      {appointment.isTrial ? (
                                        "Trial Session"
                                      ) : appointment.isCancelled ? (
                                        <span className="text-red-400">Cancelled</span>
                                      ) : (
                                        appointment.type
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCheckInMain(appointment.id)
                                  }}
                                  className={`px-2 py-1 ml-12 text-xs font-medium rounded-lg ${appointment.isCheckedIn
                                    ? "border border-white/50 text-white bg-transparent"
                                    : "bg-black text-white"
                                    }`}
                                >
                                  {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-white text-center text-sm">No appointments scheduled for this date.</p>
                        )}
                      </div>
                    )}
                  </div>


                </div>
              </div>
              <div
    className={`w-full bg-[#000000] rounded-xl p-4 overflow-hidden transition-all duration-500 ${isSidebarCollapsed ? "lg:w-full" : "lg:w-[calc(100%-320px-0.3rem)]" // Keep large screen behavior unchanged
      }`}
  >
                <Calendar
                  appointmentsMain={appointmentsMain}
                  onDateSelect={handleDateSelect}
                  searchQuery={searchQuery}
                  selectedDate={selectedDate}
                  setAppointments={setAppointmentsMain}
                  appointmentFilters={appointmentFilters}
                  setSelectedAppointmentMain={setSelectedAppointmentMain}
                  onOpenSelectedAppointmentModal={setIsAppointmentActionModalOpen}
                  isSidebarCollapsed={isSidebarCollapsed} // Pass sidebar state to calendar
                />
              </div>
            </div>
          </div>
        </main>
        <AddAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAppointmentSubmit}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          availableMembersLeads={availableMembersLeads}
        />
        <TrialTrainingModal
          isOpen={isTrialModalOpen}
          onClose={() => setIsTrialModalOpen(false)}
          freeAppointmentsMain={freeAppointmentsMain}
          onSubmit={handleTrialSubmit}
        />

        <AppointmentActionModal
          isOpen={showAppointmentOptionsModalMain}
          onClose={() => {
            setshowAppointmentOptionsModalMain(false)
            setSelectedAppointmentMain(null)
          }}
          appointmentMain={selectedAppointmentMain}
          onEdit={() => {
            setshowAppointmentOptionsModalMain(false)
            setisEditAppointmentModalOpenMain(true)
          }}
          onCancel={handleCancelAppointmentMain}
          onViewMember={handleViewMemberDetailsMain}
        />

        {isEditAppointmentModalOpenMain && selectedAppointmentMain && (
          <EditAppointmentModal
            selectedAppointmentMain={selectedAppointmentMain}
            setSelectedAppointmentMain={setSelectedAppointmentMain}
            appointmentTypesMain={appointmentTypesMain}
            freeAppointmentsMain={freeAppointmentsMain}
            handleAppointmentChange={(changes) => {
              setSelectedAppointmentMain((prev) => ({ ...prev, ...changes }))
            }}
            appointmentsMain={appointmentsMain}
            setAppointmentsMain={setAppointmentsMain}
            setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
            setNotifyActionMain={setNotifyActionMain}
            onDelete={handleDeleteAppointmentMain}
            onClose={() => {
              setisEditAppointmentModalOpenMain(false)
              setSelectedAppointmentMain(null)
            }}
          />
        )}

        {isNotifyMemberOpenMain && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
            onClick={() => setIsNotifyMemberOpenMain(false)}
          >
            <div
              className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify Member</h2>
                <button
                  onClick={() => setIsNotifyMemberOpenMain(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-white text-sm">
                  Do you want to notify the member about this{" "}
                  {notifyActionMain === "change"
                    ? "change"
                    : notifyActionMain === "cancel"
                      ? "cancellation"
                      : notifyActionMain === "delete"
                        ? "deletion"
                        : "booking"}{" "}
                  ?
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => {
                    handleNotifyMemberMain(true)
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                >
                  Yes, Notify Member
                </button>
                <button
                  onClick={() => {
                    handleNotifyMemberMain(false)
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
          appointmentTypesMain={appointmentTypesMain}
          selectedDate={selectedDate || new Date()}
          onSubmit={(blockData) => {
            const newBlock = {
              id: appointmentsMain.length + 1,
              name: "BLOCKED",
              time: `${blockData.startTime} - ${blockData.endTime}`,
              date: `${new Date(blockData.startDate).toLocaleString("en-US", {
                weekday: "short",
              })} | ${formatDateForDisplay(new Date(blockData.startDate))} → ${formatDateForDisplay(new Date(blockData.endDate))}`,
              color: "bg-[#FF4D4F]",
              startTime: blockData.startTime,
              endTime: blockData.endTime,
              type: "Blocked Time",
              specialNote: {
                text: blockData.note || "This time slot is blocked",
                startDate: blockData.startDate,
                endDate: blockData.endDate,
                isImportant: true,
              },
              status: "blocked",
              isBlocked: true,
              isCancelled: false,
              isPast: false,
            }

            setAppointmentsMain([...appointmentsMain, newBlock])
            toast.success("Time slot blocked successfully")
            setIsBlockModalOpen(false)
          }}
        />



        <TrainingPlansModalMain
          isOpen={isTrainingPlanModalOpenMain}
          onClose={() => {
            setIsTrainingPlanModalOpenMain(false)
            setSelectedUserForTrainingPlanMain(null)
          }}
          selectedMember={selectedUserForTrainingPlanMain}
          memberTrainingPlans={memberTrainingPlansMain[selectedUserForTrainingPlanMain?.id] || []}
          availableTrainingPlans={availableTrainingPlansMain}
          onAssignPlan={handleAssignTrainingPlanMain}
          onRemovePlan={handleRemoveTrainingPlanMain}
        />



        {showEditNoteModalMain && selectedAppointmentForNoteMain && (
          <SpecialNoteEditModal
            isOpen={showEditNoteModalMain}
            onClose={() => {
              setShowEditNoteModalMain(false)
              setSelectedAppointmentForNoteMain(null)
            }}
            appointment={selectedAppointmentForNoteMain}
            onSave={handleSaveSpecialNoteMain}
          />
        )}


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
        <style jsx>{`
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
      `}</style>




        {/* sidebar related modal */}

        <Sidebar
          isRightSidebarOpen={isRightSidebarOpen}
          toggleRightSidebar={toggleRightSidebar}
          isSidebarEditing={isSidebarEditing}
          toggleSidebarEditing={toggleSidebarEditing}
          rightSidebarWidgets={rightSidebarWidgets}
          moveRightSidebarWidget={moveRightSidebarWidget}
          removeRightSidebarWidget={removeRightSidebarWidget}
          setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
          redirectToCommunication={redirectToCommunication}
          todos={todos}
          handleTaskComplete={handleTaskCompleteWrapper}
          todoFilter={todoFilter}
          setTodoFilter={setTodoFilter}
          todoFilterOptions={todoFilterOptions}
          isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
          setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
          openDropdownIndex={openDropdownIndex}
          toggleDropdown={toggleDropdown}
          handleEditTask={handleEditTask}
          setTaskToCancel={setTaskToCancel}
          setTaskToDelete={setTaskToDelete}
          birthdays={birthdays}
          isBirthdayToday={isBirthdayToday}
          handleSendBirthdayMessage={handleSendBirthdayMessage}
          customLinks={customLinks}
          truncateUrl={truncateUrl}
          appointments={appointments}
          renderSpecialNoteIcon={renderSpecialNoteIcon}
          handleDumbbellClick={handleDumbbellClick}
          handleCheckIn={handleCheckInWrapper}
          handleAppointmentOptionsModal={handleAppointmentOptionsModal}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          isChartDropdownOpen={isChartDropdownOpen}
          setIsChartDropdownOpen={setIsChartDropdownOpen}
          expiringContracts={expiringContracts}
          getWidgetPlacementStatus={getWidgetPlacementStatus}
          onClose={toggleRightSidebar}
          hasUnreadNotifications={2}
          setIsWidgetModalOpen={setIsWidgetModalOpen}
          handleEditNote={handleEditNoteWrapper}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          isSpecialNoteModalOpen={isSpecialNoteModalOpen}
          setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
          selectedAppointmentForNote={selectedAppointmentForNote}
          setSelectedAppointmentForNote={setSelectedAppointmentForNote}
          handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
          onSaveSpecialNote={handleSaveSpecialNoteWrapper}
          notifications={notifications}
          setTodos={setTodos}
        />

        {/* Sidebar related modals */}
        <TrainingPlansModal
          isOpen={isTrainingPlanModalOpen}
          onClose={() => {
            setIsTrainingPlanModalOpen(false)
            setSelectedUserForTrainingPlan(null)
          }}
          selectedMember={selectedUserForTrainingPlan} // Make sure this is passed correctly
          memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
          availableTrainingPlans={availableTrainingPlans}
          onAssignPlan={handleAssignTrainingPlan} // Make sure this function is passed
          onRemovePlan={handleRemoveTrainingPlan} // Make sure this function is passed
        />

        <AppointmentActionModalV2
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setShowAppointmentOptionsModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setShowAppointmentOptionsModal(false);
            setIsEditAppointmentModalOpen(true);
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
        />

        <NotifyMemberModal
          isOpen={isNotifyMemberOpen}
          onClose={() => setIsNotifyMemberOpen(false)}
          notifyAction={notifyAction}
          actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
          handleNotifyMember={handleNotifyMember}
        />

        {isEditAppointmentModalOpen && selectedAppointment && (
          <EditAppointmentModalV2
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            appointmentTypes={appointmentTypes}
            freeAppointments={freeAppointments}
            handleAppointmentChange={(changes) => {
              setSelectedAppointment({ ...selectedAppointment, ...changes });
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointmentWrapper}
            onClose={() => {
              setIsEditAppointmentModalOpen(false);
              setSelectedAppointment(null);
            }}
          />
        )}

        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
          widgetArea="sidebar"
        />

        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {isEditTaskModalOpen && editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => {
              setIsEditTaskModalOpen(false);
              setEditingTask(null);
            }}
            onUpdateTask={handleUpdateTaskWrapper}
          />
        )}

        {taskToDelete && (
          <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {taskToCancel && (
          <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToCancel(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  No
                </button>
                <button
                  onClick={() => handleCancelTaskWrapper(taskToCancel)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Cancel Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
