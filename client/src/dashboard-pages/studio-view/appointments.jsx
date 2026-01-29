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
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

import { appointmentsData as initialAppointmentsData, memberRelationsData, availableMembersLeadsMain, freeAppointmentsData, relationOptionsData as relationOptionsMain, appointmentTypesData } from "../../utils/studio-states"

import TrialTrainingModal from "../../components/studio-components/appointments-components/add-trial-training"
import CreateAppointmentModal from "../../components/shared/appointments/CreateAppointmentModal"
import MiniCalendar from "../../components/studio-components/appointments-components/mini-calender"
import BlockAppointmentModal from "../../components/studio-components/appointments-components/block-appointment-modal"
import Calendar from "../../components/studio-components/appointments-components/calendar"
import AppointmentActionModal from "../../components/studio-components/appointments-components/AppointmentActionModal"

import EditAppointmentModal from "../../components/shared/appointments/EditAppointmentModal"
import { createPortal } from "react-dom"
import TrainingPlansModalMain from "../../components/shared/training/TrainingPlanModal"
import { SpecialNoteEditModal } from "../../components/myarea-components/SpecialNoteEditModal"
import { useNavigate } from "react-router-dom"
import EditMemberModalMain from "../../components/studio-components/members-components/EditMemberModal"
import { MemberSpecialNoteIcon } from "../../components/shared/shared-special-note-icon"

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

  // Handler wenn im Hauptkalender navigiert wird (nur durch Pfeile, nicht durch datesSet beim Laden)
  const handleCalendarNavigate = useCallback((date, isUserNavigation = false) => {
    setMiniCalendarDate(date);
    // Nur bei echter User-Navigation das selectedDate ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤ndern
    if (isUserNavigation) {
      setSelectedDate(new Date(date));
    }
  }, []);

  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const [selectedAppointmentMain, setSelectedAppointmentMain] = useState(null)
  const [activeNoteIdMain, setActiveNoteIdMain] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMemberMain, setSelectedMemberMain] = useState(null)
  
  // Member filter states (like members.jsx)
  const [memberFilters, setMemberFilters] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  
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

  // EditMemberModal state for special notes and relations from appointment modals
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
  const [editMemberActiveTab, setEditMemberActiveTab] = useState("note")
  const [editingRelationsMain, setEditingRelationsMain] = useState(false)
  const [newRelationMain, setNewRelationMain] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [memberRelationsMain, setMemberRelationsMain] = useState(memberRelationsData)
  const [editFormMain, setEditFormMain] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    notes: [],
  })

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

  const [freeAppointmentsMain, setFreeAppointmentsMain] = useState(freeAppointmentsData)

  const [appointmentTypesMain, setAppointmentTypesMain] = useState(appointmentTypesData)

  const [filteredAppointments, setFilteredAppointments] = useState(appointmentsMain)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)

  const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
    { id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner" },
    { id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced" },
    { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate" },
    { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate" },
  ])

  useEffect(() => { applyFilters() }, [appointmentsMain, selectedDate, memberFilters, appointmentFilters])

  // Sync editFormMain with selectedMemberForEdit data
  useEffect(() => {
    if (selectedMemberForEdit) {
      setEditFormMain({
        firstName: selectedMemberForEdit.firstName || selectedMemberForEdit.name?.split(' ')[0] || '',
        lastName: selectedMemberForEdit.lastName || selectedMemberForEdit.name?.split(' ').slice(1).join(' ') || '',
        email: selectedMemberForEdit.email || '',
        phone: selectedMemberForEdit.phone || '',
        street: selectedMemberForEdit.street || '',
        zipCode: selectedMemberForEdit.zipCode || '',
        city: selectedMemberForEdit.city || '',
        dateOfBirth: selectedMemberForEdit.dateOfBirth || '',
        about: selectedMemberForEdit.about || '',
        note: selectedMemberForEdit.note || '',
        noteStartDate: selectedMemberForEdit.noteStartDate || '',
        noteEndDate: selectedMemberForEdit.noteEndDate || '',
        noteImportance: selectedMemberForEdit.noteImportance || 'unimportant',
        notes: selectedMemberForEdit.notes || [],
      });
    }
  }, [selectedMemberForEdit])

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
    
    // Member filter tags - filter by member name (not appointment ID!)
    if (memberFilters.length > 0) {
      const filterNames = memberFilters.map(f => f.memberName.toLowerCase());
      filtered = filtered.filter((appointment) => {
        const appointmentFullName = `${appointment.name || ''} ${appointment.lastName || ''}`.trim().toLowerCase();
        return filterNames.includes(appointmentFullName);
      });
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

  // =========================================================================
  // MEMBER SEARCH WITH TAGS (like members.jsx)
  // =========================================================================
  
  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get unique members from appointments for search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    // Get unique members from appointments (by full name, not appointment ID!)
    const uniqueMembers = [];
    const seenNames = new Set();
    
    appointmentsMain.forEach((appointment) => {
      // Skip blocked time slots
      if (appointment.isBlocked || appointment.type === "Blocked Time") return;
      
      const fullName = `${appointment.name || ''} ${appointment.lastName || ''}`.trim();
      const fullNameLower = fullName.toLowerCase();
      
      // Skip if already seen or already filtered
      if (seenNames.has(fullNameLower)) return;
      if (memberFilters.some(f => f.memberName.toLowerCase() === fullNameLower)) return;
      
      // Check if matches search query
      if (fullNameLower.includes(searchQuery.toLowerCase())) {
        seenNames.add(fullNameLower);
        uniqueMembers.push({
          id: fullName, // Use fullName as ID for consistency
          firstName: appointment.name || '',
          lastName: appointment.lastName || '',
          email: appointment.email || '',
          image: appointment.image || null,
        });
      }
    });
    
    return uniqueMembers.slice(0, 6);
  };

  // Handle selecting a member from search suggestions
  const handleSelectMember = (member) => {
    const memberName = `${member.firstName} ${member.lastName}`.trim();
    setMemberFilters([...memberFilters, {
      memberId: memberName, // Use name as ID
      memberName: memberName
    }]);
    setSearchQuery("");
    setShowSearchDropdown(false);
    searchInputRef.current?.focus();
  };

  // Handle removing a member filter
  const handleRemoveFilter = (memberId) => {
    setMemberFilters(memberFilters.filter(f => f.memberId !== memberId));
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && memberFilters.length > 0) {
      // Remove last filter when backspace is pressed with empty input
      setMemberFilters(memberFilters.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  // =========================================================================

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
    if (!selectedAppointmentMain) return;
    
    // Get member info from appointment
    const memberId = selectedAppointmentMain.memberId;
    const memberName = selectedAppointmentMain.lastName 
      ? `${selectedAppointmentMain.name} ${selectedAppointmentMain.lastName}`
      : selectedAppointmentMain.name;
    
    if (memberId) {
      // Navigate to Members page with filter state (like communications.jsx)
      navigate('/dashboard/members', {
        state: {
          filterMemberId: memberId,
          filterMemberName: memberName
        }
      });
    }
  };

  // Handler to open EditMemberModal from appointment modals (for special notes and relations)
  const handleOpenEditMemberModal = (member, tab = "note") => {
    // Set the selected member and initialize the form
    setSelectedMemberForEdit(member);
    setEditMemberActiveTab(tab);
    
    // Initialize the edit form with member data
    setEditFormMain({
      firstName: member.firstName || member.name?.split(" ")[0] || "",
      lastName: member.lastName || member.name?.split(" ").slice(1).join(" ") || "",
      email: member.email || "",
      phone: member.phone || "",
      street: member.street || "",
      zipCode: member.zipCode || "",
      city: member.city || "",
      dateOfBirth: member.dateOfBirth || "",
      about: member.about || "",
      note: member.note || "",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteImportance: member.noteImportance || "unimportant",
      notes: member.notes || [],
    });
    
    setIsEditMemberModalOpen(true);
  };

  // Handler for input changes in EditMemberModal
  const handleInputChangeMain = (e) => {
    const { name, value } = e.target;
    setEditFormMain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler to save changes from EditMemberModal
  const handleEditSubmitMain = (e, localRelations = null, localNotes = null) => {
    e?.preventDefault();
    
    // Update relations if provided
    if (localRelations && selectedMemberForEdit?.id) {
      setMemberRelationsMain((prev) => ({
        ...prev,
        [selectedMemberForEdit.id]: localRelations,
      }));
    }
    
    setIsEditMemberModalOpen(false);
    setSelectedMemberForEdit(null);
    toast.success("Member details have been updated successfully");
  };

  // Handler to add a new relation
  const handleAddRelationMain = () => {
    if (!selectedMemberForEdit || !newRelationMain.name || !newRelationMain.relation) return;
    
    const memberId = selectedMemberForEdit.id;
    const category = newRelationMain.category;
    
    const newRelation = {
      id: Date.now(),
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
      memberId: newRelationMain.selectedMemberId,
    };
    
    setMemberRelationsMain((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: [...(prev[memberId]?.[category] || []), newRelation],
      },
    }));
    
    // Reset new relation form
    setNewRelationMain({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
    });
  };

  // Handler to delete a relation
  const handleDeleteRelationMain = (memberId, category, relationId) => {
    setMemberRelationsMain((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: prev[memberId]?.[category]?.filter((r) => r.id !== relationId) || [],
      },
    }));
  };

  // Relation options
  const relationOptionsMain = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner"],
    work: ["Colleague", "Boss", "Employee", "Business Partner"],
    other: ["Neighbor", "Doctor", "Trainer", "Other"],
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointmentsMain.length + 1, ...appointmentData, status: "pending", isTrial: false, isCancelled: false, isPast: false,
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(appointmentData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointmentsMain.length + 1, ...trialData, status: "pending", isTrial: true, isCancelled: false, isPast: false,
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    
  }

  const handleCheckInMain = (appointmentId) => {
    setAppointmentsMain((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment
      )
    )
    
  }

  const handleNotifyMemberMain = (shouldNotify) => {
    setIsNotifyMemberOpenMain(false)
    if (shouldNotify) { }
    else { }
  }

  // Legacy handler - kept for compatibility but now handled via tag system
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSearchDropdown(true)
  }

  const handleCancelAppointmentMain = (appointmentId) => {
    const idToCancel = appointmentId || selectedAppointmentMain?.id
    if (!idToCancel) return
    const updatedAppointments = appointmentsMain.map((app) =>
      app.id === idToCancel ? { ...app, status: "cancelled", isCancelled: true } : app
    )
    setAppointmentsMain(updatedAppointments)
    setSelectedAppointmentMain(null)
    setshowAppointmentOptionsModalMain(false)
    setIsNotifyMemberOpenMain(true)
    setNotifyActionMain("cancel")
  }

  // Delete appointment permanently (for already cancelled appointments)
  const handleDeleteAppointmentMain = () => {
    if (!selectedAppointmentMain) return
    setAppointmentsMain(appointmentsMain.filter((a) => a.id !== selectedAppointmentMain.id))
    setSelectedAppointmentMain(null)
    setshowAppointmentOptionsModalMain(false)
    // No notify modal - just delete directly
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

  const handleDumbbellClickMain = (appointment, e) => { 
    e.stopPropagation(); 
    // Konvertiere Appointment zu einheitlichem Member-Format fÃ¼r TrainingPlanModal
    const memberData = {
      id: appointment.id,
      firstName: appointment.name, // appointment.name ist der Vorname
      lastName: appointment.lastName || '',
      email: appointment.email || '',
    };
    setSelectedUserForTrainingPlanMain(memberData); 
    setIsTrainingPlanModalOpenMain(true) 
  }

  const handleAssignTrainingPlanMain = (memberId, planId) => {
    const plan = availableTrainingPlansMain.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = { ...plan, assignedDate: new Date().toLocaleDateString() }
      setMemberTrainingPlansMain((prev) => ({ ...prev, [memberId]: [...(prev[memberId] || []), assignedPlan] }))
      
    }
  }

  const handleRemoveTrainingPlanMain = (memberId, planId) => {
    setMemberTrainingPlansMain((prev) => ({ ...prev, [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId) }))
    
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
        .upcoming-apt-tile {
          transition: filter 0.15s ease, box-shadow 0.15s ease;
        }
        .upcoming-apt-tile:hover {
          filter: brightness(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .cancelled-appointment-bg { 
          background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent); 
          background-size: 10px 10px; 
        }
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
                  onClick={() => { calendarRef.current?.changeView("timeGridDay"); setCurrentView("timeGridDay"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "timeGridDay" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Day
                </button>
                <button 
                  onClick={() => { calendarRef.current?.changeView("timeGridWeek"); setCurrentView("timeGridWeek"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "timeGridWeek" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => { calendarRef.current?.changeView("dayGridMonth"); setCurrentView("dayGridMonth"); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView === "dayGridMonth" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Month
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
                {/* Search with Member Tags */}
                <div className="flex items-center gap-2 w-full flex-shrink-0">
                  <div className="relative w-full" ref={searchDropdownRef}>
                    <div 
                      className="bg-[#000000] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-transparent focus-within:border-[#3F74FF] transition-colors cursor-text"
                      onClick={() => searchInputRef.current?.focus()}
                    >
                      <Search className="text-gray-400 flex-shrink-0" size={16} />
                      
                      {/* Filter Chips */}
                      {memberFilters.map((filter) => (
                        <div 
                          key={filter.memberId}
                          className="flex items-center gap-1.5 bg-[#3F74FF]/20 border border-[#3F74FF]/40 rounded-lg px-2 py-1 text-sm"
                        >
                          <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                            {filter.memberName.split(' ')[0]?.charAt(0)}{filter.memberName.split(' ')[1]?.charAt(0) || ''}
                          </div>
                          <span className="text-white text-xs whitespace-nowrap">{filter.memberName}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFilter(filter.memberId);
                            }}
                            className="p-0.5 hover:bg-[#3F74FF]/30 rounded transition-colors"
                          >
                            <X size={12} className="text-gray-400 hover:text-white" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Search Input */}
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={memberFilters.length > 0 ? "Add more..." : "Search members..."}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSearchDropdown(true);
                        }}
                        onFocus={() => searchQuery && setShowSearchDropdown(true)}
                        onKeyDown={handleSearchKeyDown}
                        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-white placeholder-gray-500"
                      />
                      
                      {/* Clear All Button */}
                      {memberFilters.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMemberFilters([]);
                          }}
                          className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                          title="Clear all filters"
                        >
                          <X size={14} className="text-gray-400 hover:text-white" />
                        </button>
                      )}
                    </div>
                    
                    {/* Autocomplete Dropdown */}
                    {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden">
                        {getSearchSuggestions().map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleSelectMember(member)}
                            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                          >
                            {member.image ? (
                              <img 
                                src={member.image} 
                                alt={`${member.firstName} ${member.lastName}`} 
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                                {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{member.firstName} {member.lastName}</p>
                              {member.email && <p className="text-xs text-gray-500 truncate">{member.email}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* No results message */}
                    {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
                        <p className="text-sm text-gray-500 text-center">No members found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filters - feste GrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¶ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¸e */}
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
                      {filteredAppointments.filter(app => !app.isCancelled).length > 0 ? (
                        filteredAppointments.filter(app => !app.isCancelled).map((appointment) => {
                          const firstName = appointment.name || "";
                          const lastName = appointment.lastName || "";
                          const isBlocked = appointment.isBlocked || appointment.type === "Blocked Time";
                          
                          return (
                            <div key={appointment.id}
                              className={`${appointment.isCancelled ? "bg-gray-700 cancelled-appointment-bg" : appointment.isPast && !appointment.isCancelled ? "bg-gray-800 opacity-50" : appointment.color} rounded-xl cursor-pointer p-3 relative w-full upcoming-apt-tile`}
                              onClick={() => handleAppointmentOptionsModalMain(appointment)}>
                              {/* Icons row at top */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  {!isBlocked && (
                                    <MemberSpecialNoteIcon
                                      member={{
                                        ...appointment,
                                        firstName,
                                        lastName,
                                      }}
                                      onEditMember={(memberData, tab) => handleOpenEditMemberModal(memberData, tab || "note")}
                                      size="sm"
                                      position="relative"
                                    />
                                  )}
                                  <div 
                                    className="cursor-pointer rounded p-0.5 transition-all duration-200 hover:scale-110 active:scale-95" 
                                    onClick={(e) => handleDumbbellClickMain(appointment, e)}
                                    title="Training Plans"
                                  >
                                    <Dumbbell className="text-white/80" size={14} />
                                  </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleCheckInMain(appointment.id) }}
                                  className={`min-w-[85px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${appointment.isCheckedIn ? "bg-white/20 hover:bg-white/30 text-white/80 border-white/30" : "bg-black hover:bg-black/80 text-white border-transparent"}`}>
                                  {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                </button>
                              </div>
                              {/* Content */}
                              <div className="text-white">
                                <p className="font-semibold text-[15px] truncate">{appointment.name} {appointment.lastName}</p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <p className="text-xs flex gap-1.5 items-center opacity-80">
                                    <Clock size={12} />
                                    {appointment.startTime} - {appointment.endTime}
                                  </p>
                                  <p className="text-[11px] opacity-70">
                                    {appointment.date?.split("|")[0]?.trim()}
                                  </p>
                                </div>
                                <p className="text-xs mt-1 opacity-70">
                                  {appointment.isTrial ? "Trial Session" : appointment.isCancelled ? <span className="text-red-400">Cancelled</span> : appointment.type}
                                </p>
                              </div>
                            </div>
                          );
                        })
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
                memberFilters={memberFilters}
                selectedDate={selectedDate}
                setAppointmentsMain={setAppointmentsMain}
                appointmentFilters={appointmentFilters}
                setSelectedAppointmentMain={setSelectedAppointmentMain}
                onOpenSelectedAppointmentModal={setIsAppointmentActionModalOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                onDateDisplayChange={setCalendarDateDisplay}
                onViewModeChange={setCalendarViewMode}
                onCurrentDateChange={handleCalendarNavigate}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <CreateAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAppointmentSubmit} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} freeAppointmentsMain={freeAppointmentsMain} availableMembersLeads={availableMembersLeadsMain} onOpenEditMemberModal={handleOpenEditMemberModal} memberRelations={memberRelationsData} />
        <TrialTrainingModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} freeAppointmentsMain={freeAppointmentsMain} onSubmit={handleTrialSubmit} />
        <AppointmentActionModal isOpen={showAppointmentOptionsModalMain} onClose={() => { setshowAppointmentOptionsModalMain(false); setSelectedAppointmentMain(null) }} appointmentMain={selectedAppointmentMain} onEdit={() => { setshowAppointmentOptionsModalMain(false); setisEditAppointmentModalOpenMain(true) }} onCancel={handleCancelAppointmentMain} onDelete={handleDeleteAppointmentMain} onViewMember={handleViewMemberDetailsMain} onEditMemberNote={handleOpenEditMemberModal} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} />
        {isEditAppointmentModalOpenMain && selectedAppointmentMain && (
          <EditAppointmentModal selectedAppointmentMain={selectedAppointmentMain} setSelectedAppointmentMain={setSelectedAppointmentMain} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointmentsMain}
            handleAppointmentChange={(changes) => setSelectedAppointmentMain((prev) => ({ ...prev, ...changes }))} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} onDelete={handleDeleteAppointmentMain} onClose={() => { setisEditAppointmentModalOpenMain(false); setSelectedAppointmentMain(null) }} onOpenEditMemberModal={handleOpenEditMemberModal} memberRelations={memberRelationsData} />
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
          setAppointmentsMain([...appointmentsMain, newBlock]); setIsBlockModalOpen(false)
        }} />
        <TrainingPlansModalMain isOpen={isTrainingPlanModalOpenMain} onClose={() => { setIsTrainingPlanModalOpenMain(false); setSelectedUserForTrainingPlanMain(null) }} selectedMember={selectedUserForTrainingPlanMain} memberTrainingPlans={memberTrainingPlansMain[selectedUserForTrainingPlanMain?.id] || []} availableTrainingPlans={availableTrainingPlansMain} onAssignPlan={handleAssignTrainingPlanMain} onRemovePlan={handleRemoveTrainingPlanMain} />
        {showEditNoteModalMain && selectedAppointmentForNoteMain && (
          <SpecialNoteEditModal isOpen={showEditNoteModalMain} onClose={() => { setShowEditNoteModalMain(false); setSelectedAppointmentForNoteMain(null) }} appointment={selectedAppointmentForNoteMain} onSave={handleSaveSpecialNoteMain} />
        )}
        {/* EditMemberModal for special notes and relations from appointment modals */}
        {isEditMemberModalOpen && selectedMemberForEdit && (
          <EditMemberModalMain
            isOpen={isEditMemberModalOpen}
            onClose={() => { 
              setIsEditMemberModalOpen(false); 
              setSelectedMemberForEdit(null);
              setEditingRelationsMain(false);
            }}
            selectedMemberMain={selectedMemberForEdit}
            editModalTabMain={editMemberActiveTab}
            setEditModalTabMain={setEditMemberActiveTab}
            editFormMain={editFormMain}
            handleInputChangeMain={handleInputChangeMain}
            handleEditSubmitMain={handleEditSubmitMain}
            editingRelationsMain={editingRelationsMain}
            setEditingRelationsMain={setEditingRelationsMain}
            newRelationMain={newRelationMain}
            setNewRelationMain={setNewRelationMain}
            availableMembersLeadsMain={availableMembersLeadsMain}
            relationOptionsMain={relationOptionsMain}
            handleAddRelationMain={handleAddRelationMain}
            memberRelationsMain={memberRelationsMain}
            handleDeleteRelationMain={handleDeleteRelationMain}
          />
        )}
      </div>
    </>
  )
}
