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

import { appointmentsData as initialAppointmentsData, memberRelationsData, availableMembersLeadsMain, freeAppointmentsData, relationOptionsData as relationOptionsMain, appointmentTypesData, membersData, DEFAULT_CALENDAR_SETTINGS, leadsData, leadRelationsData, studioData, isStudioClosedOnDate } from "../../utils/studio-states"

import TrialTrainingModal from "../../components/shared/appointments/CreateTrialTrainingModal"
import CreateAppointmentModal from "../../components/shared/appointments/CreateAppointmentModal"
import MiniCalendar from "../../components/studio-components/appointments-components/mini-calender"
import BlockAppointmentModal from "../../components/studio-components/appointments-components/block-appointment-modal"
import Calendar from "../../components/studio-components/appointments-components/calendar"
import AppointmentActionModal from "../../components/studio-components/appointments-components/AppointmentActionModal"
import UpcomingAppointmentsWidget from "../../components/shared/widgets/UpcomingAppointmentsWidget"

import EditAppointmentModal from "../../components/shared/appointments/EditAppointmentModal"
import { createPortal } from "react-dom"
import TrainingPlansModalMain from "../../components/shared/training/TrainingPlanModal"
import { useNavigate } from "react-router-dom"
import EditMemberModalMain from "../../components/studio-components/members-components/EditMemberModal"
import EditLeadModal from "../../components/studio-components/lead-studio-components/edit-lead-modal"
import { MemberSpecialNoteIcon } from "../../components/shared/special-note/shared-special-note-icon"
import EditBlockedSlotModalMain from "../../components/studio-components/appointments-components/EditBlockedSlotModalMain"

export default function Appointments() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // Helper function to get member data by ID (for special notes)
  const getMemberById = (memberId) => {
    if (!memberId) return null;
    return membersData.find(m => m.id === memberId) || null;
  };

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
  
  // Calendar settings (from configuration)
  const [calendarSettings, setCalendarSettings] = useState(DEFAULT_CALENDAR_SETTINGS)

  // Mobile-specific states
  const [isMobileFiltersExpanded, setIsMobileFiltersExpanded] = useState(false) // Collapsed by default on mobile
  const [isMobileFabOpen, setIsMobileFabOpen] = useState(false) // FAB menu state
  
  // Check if we're on mobile (for initial calendar view)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Set day view on mobile by default
      if (mobile && calendarRef.current) {
        calendarRef.current.changeView("timeGridDay")
        setCurrentView("timeGridDay")
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileFabOpen) {
        setIsMobileFabOpen(false)
      }
    }
    
    if (isMobileFabOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileFabOpen])

  // Handler wenn im Hauptkalender navigiert wird (nur durch Pfeile, nicht durch datesSet beim Laden)
  const handleCalendarNavigate = useCallback((date, isUserNavigation = false) => {
    setMiniCalendarDate(date);
    // Nur bei echter User-Navigation das selectedDate aendern
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

  const [isTrainingPlanModalOpenMain, setIsTrainingPlanModalOpenMain] = useState(false)
  const [selectedUserForTrainingPlanMain, setSelectedUserForTrainingPlanMain] = useState(null)
  // Initialize with some assigned training plans for members
  const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({
    1: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-15" }],
    3: [{ id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced", assignedDate: "2025-01-10" }],
    4: [
      { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate", assignedDate: "2025-01-05" },
      { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate", assignedDate: "2025-01-20" }
    ],
    6: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-18" }],
  })
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

  // EditLeadModal state for special notes and relations from appointment modals
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null)
  const [editLeadActiveTab, setEditLeadActiveTab] = useState("note")
  const [leadRelationsMain, setLeadRelationsMain] = useState(leadRelationsData || {})
  const [leadColumnsData] = useState([
    { id: "new", title: "New" },
    { id: "contacted", title: "Contacted" },
    { id: "qualified", title: "Qualified" },
    { id: "negotiation", title: "Negotiation" },
    { id: "won", title: "Won" },
    { id: "lost", title: "Lost" },
  ])

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

  const appointmentTypesMain = appointmentTypesData
  const freeAppointmentsMain = freeAppointmentsData

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isEditBlockedModalOpen, setIsEditBlockedModalOpen] = useState(false)
  const [blockedEditData, setBlockedEditData] = useState(null)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)

  // Available training plans that can be assigned
  const [availableTrainingPlansMain] = useState([
    { id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner" },
    { id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced" },
    { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate" },
    { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate" },
    { id: 5, name: "Flexibility & Mobility", description: "Improve range of motion and reduce injury risk", duration: "4 weeks", difficulty: "Beginner" },
  ])

  // Filter appointments based on selected filters AND member filters
  const filteredAppointments = appointmentsMain.filter((appointment) => {
    // First check appointment type filters
    let passesTypeFilter = false;
    
    if (appointment.isBlocked || appointment.type === "Blocked Time") {
      passesTypeFilter = appointmentFilters["Blocked Time Slots"];
    } else if (appointment.isCancelled) {
      passesTypeFilter = appointmentFilters["Cancelled Appointments"];
    } else if (appointment.isPast) {
      passesTypeFilter = appointmentFilters["Past Appointments"];
    } else if (appointment.isTrial) {
      passesTypeFilter = appointmentFilters["Trial Training"];
    } else {
      // For regular appointments, check against the appointment type name
      passesTypeFilter = appointmentFilters[appointment.type] !== false;
    }
    
    // If no member filters, just return the type filter result
    if (memberFilters.length === 0) {
      return passesTypeFilter;
    }
    
    // Check if appointment matches any of the member/lead filters
    const appointmentName = `${appointment.name || ""} ${appointment.lastName || ""}`.trim().toLowerCase();
    const passesMemberFilter = memberFilters.some(filter => {
      const filterName = filter.memberName.toLowerCase();
      return appointmentName.includes(filterName) || filterName.includes(appointmentName);
    });
    
    return passesTypeFilter && passesMemberFilter;
  });

  const handleFilterChange = (filterName) => {
    setAppointmentFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const toggleAllFilters = () => {
    const allEnabled = Object.values(appointmentFilters).every((value) => value)
    const newState = {}
    Object.keys(appointmentFilters).forEach((key) => {
      newState[key] = !allEnabled
    })
    setAppointmentFilters(newState)
  }

  // Handler for dumbbell click in Upcoming Appointments (from calendar page)
  const handleDumbbellClickMain = (member) => {
    setSelectedUserForTrainingPlanMain(member)
    setIsTrainingPlanModalOpenMain(true)
  }

  // Handler to assign a training plan to a member
  const handleAssignTrainingPlanMain = (planId) => {
    if (!selectedUserForTrainingPlanMain) return
    const memberId = selectedUserForTrainingPlanMain.id
    const plan = availableTrainingPlansMain.find((p) => p.id === planId)
    if (!plan) return
    const assignedPlan = {
      ...plan,
      assignedDate: new Date().toISOString().split("T")[0],
    }
    setMemberTrainingPlansMain((prev) => ({
      ...prev,
      [memberId]: [...(prev[memberId] || []), assignedPlan],
    }))
  }

  // Handler to remove a training plan from a member
  const handleRemoveTrainingPlanMain = (planId) => {
    if (!selectedUserForTrainingPlanMain) return
    const memberId = selectedUserForTrainingPlanMain.id
    setMemberTrainingPlansMain((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).filter((p) => p.id !== planId),
    }))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close book dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsBookDropdownOpen(false);
    };
    
    if (isBookDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isBookDropdownOpen]);

  // Get search suggestions from members and leads
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    // Get members
    const memberSuggestions = membersData
      .filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const alreadyFiltered = memberFilters.some(f => 
          f.memberName.toLowerCase() === fullName
        );
        return !alreadyFiltered && (
          member.firstName?.toLowerCase().includes(query) ||
          member.lastName?.toLowerCase().includes(query) ||
          fullName.includes(query)
        );
      })
      .map(member => ({
        ...member,
        type: 'member'
      }));

    // Get leads
    const leadSuggestions = leadsData
      .filter(lead => {
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const alreadyFiltered = memberFilters.some(f => 
          f.memberName.toLowerCase() === fullName
        );
        return !alreadyFiltered && (
          lead.firstName?.toLowerCase().includes(query) ||
          lead.lastName?.toLowerCase().includes(query) ||
          fullName.includes(query)
        );
      })
      .map(lead => ({
        ...lead,
        type: 'lead'
      }));

    return [...memberSuggestions, ...leadSuggestions].slice(0, 8);
  };

  // Handle selecting a member/lead from search suggestions
  const handleSelectMember = (person) => {
    const personName = `${person.firstName} ${person.lastName}`.trim();
    setMemberFilters([...memberFilters, {
      memberId: personName, // Use name as ID
      memberName: personName,
      type: person.type // Store type (member or lead)
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

  // Handler to open Edit Lead Modal from appointment modals (for special notes and relations)
  const handleOpenEditLeadModal = (leadId, tab = "note") => {
    // Find the lead data by ID
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) {
      console.warn("Lead not found:", leadId);
      return;
    }
    
    // Set the selected lead and active tab
    setSelectedLeadForEdit(lead);
    setEditLeadActiveTab(tab);
    setIsEditLeadModalOpen(true);
  };

  // Handler to save changes from EditLeadModal
  const handleEditLeadSubmit = (updatedLeadData) => {
    // Here you would update the lead data in your state/backend
    console.log("Lead updated:", updatedLeadData);
    setIsEditLeadModalOpen(false);
    setSelectedLeadForEdit(null);
    toast.success("Lead details have been updated successfully");
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
  const relationOptionsMainLocal = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner"],
    work: ["Colleague", "Boss", "Employee", "Business Partner"],
    other: ["Neighbor", "Doctor", "Trainer", "Other"],
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: Math.max(0, ...appointmentsMain.map(a => a.id)) + 1, ...appointmentData, status: "pending", isTrial: false, isCancelled: false, isPast: false,
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(appointmentData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: Math.max(0, ...appointmentsMain.map(a => a.id)) + 1, ...trialData, status: "pending", isTrial: true, isCancelled: false, isPast: false,
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    
  }

  const handleCheckInMain = (appointmentId) => {
    // Don't allow check-in changes for past appointments
    const appointment = appointmentsMain.find(app => app.id === appointmentId);
    if (appointment?.isPast) return;
    
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
    // If it's a blocked slot, open EditBlockedSlotModal directly
    if (appointment.isBlocked || appointment.type === "Blocked Time") {
      setBlockedEditData({ ...appointment })
      setIsEditBlockedModalOpen(true)
      return
    }
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
    if (!specialNote || !specialNote.text) return null
    const isActive = activeNoteIdMain === memberId
    const isHovered = hoveredNoteId === memberId
    const handleClick = (e) => {
      e.stopPropagation()
      setActiveNoteIdMain(isActive ? null : memberId)
    }
    const handleMouseEnter = () => {
      const timeout = setTimeout(() => setHoveredNoteId(memberId), 500)
      setHoverTimeout(timeout)
    }
    const handleMouseLeave = () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
      setHoveredNoteId(null)
    }
    return (
      <div className="relative inline-block">
        <button onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
          className={`p-1 rounded transition-colors ${specialNote.isImportant ? "text-orange-500 hover:text-orange-400" : "text-gray-400 hover:text-gray-300"} ${isActive ? "ring-1 ring-orange-500" : ""}`}>
          {specialNote.isImportant ? <AlertTriangle size={14} /> : <Info size={14} />}
        </button>
        {(isActive || isHovered) && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700 z-50 p-2">
            <p className={`text-xs ${specialNote.isImportant ? "text-orange-400" : "text-gray-300"}`}>{specialNote.text}</p>
            {specialNote.startDate && specialNote.endDate && (
              <p className="text-[10px] text-gray-500 mt-1">{specialNote.startDate} - {specialNote.endDate}</p>
            )}
          </div>
        )}
      </div>
    )
  }, [activeNoteIdMain, hoveredNoteId, hoverTimeout])

  // Special Note Edit Modal Component
  const SpecialNoteEditModal = ({ isOpen, onClose, appointment, onSave }) => {
    const [noteText, setNoteText] = useState(appointment?.specialNote?.text || "")
    const [isImportant, setIsImportant] = useState(appointment?.specialNote?.isImportant || false)
    const [startDate, setStartDate] = useState(appointment?.specialNote?.startDate || "")
    const [endDate, setEndDate] = useState(appointment?.specialNote?.endDate || "")

    useEffect(() => {
      if (appointment) {
        setNoteText(appointment.specialNote?.text || "")
        setIsImportant(appointment.specialNote?.isImportant || false)
        setStartDate(appointment.specialNote?.startDate || "")
        setEndDate(appointment.specialNote?.endDate || "")
      }
    }, [appointment])

    if (!isOpen) return null

    const handleSave = () => {
      onSave(appointment.id, {
        text: noteText,
        isImportant,
        startDate,
        endDate,
      })
    }

    return createPortal(
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
        <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Edit Special Note</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Note</label>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4}
                className="w-full bg-[#141414] text-white text-sm rounded-xl px-4 py-3 border border-gray-700 focus:border-[#3F74FF] focus:outline-none resize-none" placeholder="Enter special note..." />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500" />
              <span className="text-sm text-white">Mark as important</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#141414] text-white text-sm rounded-xl px-4 py-3 border border-gray-700 focus:border-[#3F74FF] focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#141414] text-white text-sm rounded-xl px-4 py-3 border border-gray-700 focus:border-[#3F74FF] focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-800 flex gap-2">
            <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors">Save Note</button>
            <button onClick={onClose} className="px-4 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // Mobile date navigation helpers
  const navigateMobileDay = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction)
    setSelectedDate(newDate)
    setMiniCalendarDate(newDate)
    // Use setTimeout to ensure state is updated before calendar navigation
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.gotoDate(newDate)
      }
    }, 0)
  }

  const formatMobileDateDisplay = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' }
    return date.toLocaleDateString('de-DE', options)
  }
  
  // Check if current selected date is a closed day
  const isClosedDay = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const closedInfo = isStudioClosedOnDate(dateStr)
    return closedInfo.closed
  }
  
  // Get closed day label
  const getClosedDayLabel = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const closedInfo = isStudioClosedOnDate(dateStr)
    return closedInfo.isWeekend ? 'Closed' : closedInfo.reason
  }

  return (
    <>
      <style>{`
        .fc-event { cursor: pointer !important; }
        .fc-timegrid-slot { height: 2.5em !important; }
        .fc-timegrid-slot-lane { height: 2.5em !important; }
        .fc-timegrid-axis { width: 45px !important; }
        .fc-timegrid-axis-frame { justify-content: center !important; }
        .fc-timegrid-event { font-size: 11px !important; }
        .fc .fc-daygrid-day-number { font-size: 12px; }
        .fc .fc-col-header-cell-cushion { font-size: 11px; }
        .upcoming-apt-tile {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .upcoming-apt-tile:hover {
          filter: brightness(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .cancelled-appointment-bg { 
          background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent); 
          background-size: 10px 10px; 
        }
        .blocked-appointment-bg { 
          background-color: #dc2626 !important;
          background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); 
          background-size: 10px 10px; 
          opacity: 0.65;
        }
        
        /* Closed Day Styling */
        .fc-day-closed {
          background-color: rgba(255, 255, 255, 0.03) !important;
          position: relative;
        }
        .fc-day-closed::after {
          content: 'Closed';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(255, 255, 255, 0.2);
          font-size: 14px;
          font-weight: 500;
          pointer-events: none;
        }
        .fc-day-closed .fc-timegrid-col-bg {
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.02) 10px,
            rgba(255, 255, 255, 0.02) 20px
          );
        }
        
        /* Mobile Calendar Styles */
        @media (max-width: 1023px) {
          .fc .fc-toolbar {
            display: none !important;
          }
          .fc .fc-timegrid-slot {
            height: 2.5em !important;
          }
          .fc-timegrid-event {
            font-size: 10px !important;
          }
          .fc .fc-col-header-cell-cushion {
            padding: 8px 4px !important;
          }
          .fc-timegrid-axis {
            width: 40px !important;
          }
          .fc .fc-timegrid-slot-label {
            font-size: 10px !important;
          }
          /* Better touch targets on mobile */
          .fc-event {
            min-height: 30px !important;
          }
        }
      `}</style>
      <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

      <div className="relative h-[92vh] max-h-[92vh] flex flex-col rounded-3xl bg-[#1C1C1C] transition-all duration-500 ease-in-out overflow-hidden">
        <main className="flex-1 min-w-0 flex flex-col min-h-0 pt-4 pb-4 pl-4 pr-0">
          {/* Header with navigation controls */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 relative pr-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl oxanium_font font-bold text-white">Appointments</h1>
            </div>

            {/* Calendar Navigation - Centered over calendar days (offset for sidebar + time column) - Desktop */}
            <div className={`hidden lg:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 ${isSidebarCollapsed ? 'left-[calc(50%+18px)] -translate-x-1/2' : 'left-[calc(50%+168px)] -translate-x-1/2'}`}>
              {/* Free Slots Toggle */}
              <button onClick={() => calendarRef.current?.toggleFreeSlots()}
                className={`text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-medium whitespace-nowrap ${calendarViewMode === "free" ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300"}`}>
                <CalendarCheck size={16} />
                {calendarViewMode === "all" ? "Free Slots" : "All Slots"}
              </button>

              {/* Navigation Arrows */}
              <button onClick={() => calendarRef.current?.prev()} className="p-2 bg-black rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                <GoArrowLeft className="w-4 h-4" />
              </button>

              {/* Date Display */}
              <span className="text-white text-sm font-medium min-w-[140px] text-center select-none">{calendarDateDisplay}</span>

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
            <div className="flex items-center gap-2">
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

          {/* Mobile Action Buttons - REMOVED, using FAB instead */}

          {/* Mobile Day Navigation - Dezent */}
          <div className="lg:hidden flex items-center justify-between mb-3 pr-4">
            <button 
              onClick={() => navigateMobileDay(-1)} 
              className="p-2 text-gray-400 active:text-white transition-colors"
            >
              <GoArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-white text-sm font-medium">{formatMobileDateDisplay(selectedDate)}</span>
              {isClosedDay(selectedDate) && (
                <span className="text-orange-400 text-[10px] font-medium">{getClosedDayLabel(selectedDate)}</span>
              )}
            </div>
            
            <button 
              onClick={() => navigateMobileDay(1)} 
              className="p-2 text-gray-400 active:text-white transition-colors"
            >
              <GoArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Free Slots Toggle - Compact */}
          <div className="lg:hidden flex items-center gap-2 mb-3 pr-4">
            <button 
              onClick={() => calendarRef.current?.toggleFreeSlots()} 
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap ${calendarViewMode === "free" ? "bg-orange-500 text-white" : "bg-[#2F2F2F] text-gray-400"}`}
            >
              <CalendarCheck size={12} />
              {calendarViewMode === "all" ? "Free" : "All"}
            </button>
            
            {/* Mobile Filters Toggle */}
            <button 
              onClick={() => setIsMobileFiltersExpanded(!isMobileFiltersExpanded)}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${isMobileFiltersExpanded ? "bg-[#3F3F3F] text-white" : "bg-[#2F2F2F] text-gray-400"}`}
            >
              <ChevronDown size={12} className={`transition-transform ${isMobileFiltersExpanded ? 'rotate-180' : ''}`} />
              Filters
            </button>
          </div>
          
          {/* Mobile Filters Dropdown */}
          <div className={`lg:hidden overflow-hidden transition-all duration-200 pr-4 ${isMobileFiltersExpanded ? 'max-h-[300px] opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
            <div className="bg-black rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-xs font-medium">Filter by type</span>
                <button 
                  onClick={toggleAllFilters} 
                  className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {Object.values(appointmentFilters).every((value) => value) ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {appointmentTypesMain.filter(type => !type.isTrialType).map((type) => (
                  <label key={type.name} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={appointmentFilters[type.name]} onChange={() => handleFilterChange(type.name)}
                      className="w-3 h-3 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                    <div className={`w-1.5 h-1.5 rounded-full ${type.color}`}></div>
                    <span className="text-white text-[11px] truncate">{type.name}</span>
                  </label>
                ))}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={appointmentFilters["Trial Training"]} onChange={() => handleFilterChange("Trial Training")}
                    className="w-3 h-3 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3F74FF]"></div>
                  <span className="text-white text-[11px]">Trial</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={appointmentFilters["Blocked Time Slots"]} onChange={() => handleFilterChange("Blocked Time Slots")}
                    className="w-3 h-3 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                  <span className="text-white text-[11px]">Blocked</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={appointmentFilters["Cancelled Appointments"]} onChange={() => handleFilterChange("Cancelled Appointments")}
                    className="w-3 h-3 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                  <span className="text-white text-[11px]">Cancelled</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={appointmentFilters["Past Appointments"]} onChange={() => handleFilterChange("Past Appointments")}
                    className="w-3 h-3 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                  <span className="text-white text-[11px]">Past</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex lg:flex-row flex-col gap-4 flex-1 min-h-0 pr-4 lg:pr-0 relative overflow-y-auto lg:overflow-hidden">
            {/* Sidebar Toggle Button - Overlay */}
            <button 
              onClick={toggleSidebar} 
              className={`hidden lg:flex absolute z-20 bg-orange-500 text-white p-1.5 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-500 items-center justify-center ${isSidebarCollapsed ? 'left-0' : 'left-[296px]'}`}
              style={{ top: '8px' }}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Left Sidebar - Desktop only */}
            <div className={`hidden lg:block transition-all duration-500 ease-in-out ${isSidebarCollapsed ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0" : "lg:w-[300px] lg:min-w-[300px] lg:opacity-100"} flex-shrink-0 lg:h-full lg:overflow-hidden`}>
              <div className="flex flex-col gap-3 lg:pb-2 h-full">
                
                {/* Mini Calendar - Desktop only */}
                <div className="w-full lg:max-w-[300px] flex-shrink-0">
                  <MiniCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} externalDate={miniCalendarDate} />
                </div>

                {/* Search with Member Tags */}
                <div className="w-full lg:max-w-[300px] flex flex-col gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 w-full">
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
                            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm ${filter.type === 'lead' ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-orange-500/20 border border-orange-500/40'}`}
                          >
                            {/* Members: Show initials avatar */}
                            {filter.type !== 'lead' && (
                              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                {filter.memberName.split(' ')[0]?.charAt(0)}{filter.memberName.split(' ')[1]?.charAt(0) || ''}
                              </div>
                            )}
                            {/* Leads: Show "Lead" tag instead of avatar */}
                            {filter.type === 'lead' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-medium flex-shrink-0">
                                Lead
                              </span>
                            )}
                            <span className="text-white text-xs whitespace-nowrap">{filter.memberName}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFilter(filter.memberId);
                              }}
                              className={`p-0.5 rounded transition-colors ${filter.type === 'lead' ? 'hover:bg-blue-500/30' : 'hover:bg-orange-500/30'}`}
                            >
                              <X size={12} className="text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Search Input */}
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder={memberFilters.length > 0 ? "Add more..." : "Search members or leads..."}
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
                          {getSearchSuggestions().map((person) => (
                            <button
                              key={person.id}
                              onClick={() => handleSelectMember(person)}
                              className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                            >
                              {/* Members: Show profile image or initials avatar */}
                              {person.type === 'member' && (
                                person.image ? (
                                  <img 
                                    src={person.image} 
                                    alt={`${person.firstName} ${person.lastName}`} 
                                    className="w-8 h-8 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold bg-orange-500">
                                    {person.firstName?.charAt(0)}{person.lastName?.charAt(0)}
                                  </div>
                                )
                              )}
                              {/* Leads: Show "Lead" badge */}
                              {person.type === 'lead' && (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-500/40">
                                  <span className="text-[9px] text-blue-300 font-bold">LEAD</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-white truncate">{person.firstName} {person.lastName}</p>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${person.type === 'lead' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                                    {person.type === 'lead' ? 'Lead' : 'Member'}
                                  </span>
                                </div>
                                {person.type === 'member' && person.email && <p className="text-xs text-gray-500 truncate">{person.email}</p>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* No results message */}
                      {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
                          <p className="text-sm text-gray-500 text-center">No members or leads found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filters - Desktop */}
                <div className="w-full lg:max-w-[300px] flex-shrink-0">
                  <div className="bg-[#000000] rounded-xl p-3 w-full">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                    >
                      <h3 className="text-white font-semibold text-sm">Filters</h3>
                      <div className="flex items-center gap-2">
                        {!isFiltersCollapsed && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleAllFilters()
                            }} 
                            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {Object.values(appointmentFilters).every((value) => value) ? "Deselect All" : "Select All"}
                          </button>
                        )}
                        <button className="p-1 bg-[#2F2F2F] hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-white">
                          {isFiltersCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      </div>
                    </div>
                    
                    {!isFiltersCollapsed && (
                      <div className="space-y-1.5 mt-3 w-full">
                        {appointmentTypesMain.filter(type => !type.isTrialType).map((type) => (
                          <label key={type.name} className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                            <input type="checkbox" checked={appointmentFilters[type.name]} onChange={() => handleFilterChange(type.name)}
                              className="w-3.5 h-3.5 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                            <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                            <span className="text-white text-xs">{type.name}</span>
                          </label>
                        ))}
                        <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                          <input type="checkbox" checked={appointmentFilters["Trial Training"]} onChange={() => handleFilterChange("Trial Training")}
                            className="w-3.5 h-3.5 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                          <div className="w-2 h-2 rounded-full bg-[#3F74FF]"></div>
                          <span className="text-white text-xs">Trial Training</span>
                        </label>
                        <div className="border-t border-gray-700 my-2"></div>
                        <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                          <input type="checkbox" checked={appointmentFilters["Blocked Time Slots"]} onChange={() => handleFilterChange("Blocked Time Slots")}
                            className="w-3.5 h-3.5 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                          <span className="text-white text-xs">Blocked</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                          <input type="checkbox" checked={appointmentFilters["Cancelled Appointments"]} onChange={() => handleFilterChange("Cancelled Appointments")}
                            className="w-3.5 h-3.5 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                          <span className="text-white text-xs">Cancelled</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                          <input type="checkbox" checked={appointmentFilters["Past Appointments"]} onChange={() => handleFilterChange("Past Appointments")}
                            className="w-3.5 h-3.5 accent-orange-500 bg-gray-700 border-gray-600 rounded cursor-pointer" />
                          <span className="text-white text-xs">Past</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Appointments Widget - Desktop only */}
                <div className="w-full lg:max-w-[300px] flex-1 flex flex-col min-h-0 overflow-hidden">
                  <UpcomingAppointmentsWidget
                    isSidebarEditing={false}
                    appointments={filteredAppointments}
                    onAppointmentClick={handleAppointmentOptionsModalMain}
                    onCheckIn={handleCheckInMain}
                    onOpenEditMemberModal={handleOpenEditMemberModal}
                    onOpenEditLeadModal={handleOpenEditLeadModal}
                    onOpenTrainingPlansModal={handleDumbbellClickMain}
                    getMemberById={getMemberById}
                    filterDate={selectedDate}
                  />
                </div>
              </div>
            </div>

            {/* Calendar Container - Full width on mobile */}
            <div className={`flex-1 bg-[#000000] lg:rounded-l-xl rounded-xl lg:rounded-none overflow-hidden transition-all duration-500 lg:h-full min-h-[500px] lg:min-h-0 ${isSidebarCollapsed ? "lg:w-full" : ""}`}>
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
                calendarSettings={calendarSettings}
                initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <CreateAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAppointmentSubmit} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} freeAppointmentsMain={freeAppointmentsMain} availableMembersLeads={availableMembersLeadsMain} onOpenEditMemberModal={handleOpenEditMemberModal} memberRelations={memberRelationsData} selectedDate={selectedDate} />
        <TrialTrainingModal 
          isOpen={isTrialModalOpen} 
          onClose={() => setIsTrialModalOpen(false)} 
          appointmentTypesMain={appointmentTypesMain}
          freeAppointmentsMain={freeAppointmentsMain}
          leadsData={leadsData}
          leadRelations={leadRelationsMain}
          onOpenEditLeadModal={handleOpenEditLeadModal}
          onSubmit={handleTrialSubmit}
          selectedDate={selectedDate}
          selectedTime={null}
        />
        <AppointmentActionModal isOpen={showAppointmentOptionsModalMain} onClose={() => { setshowAppointmentOptionsModalMain(false); setSelectedAppointmentMain(null) }} appointmentMain={selectedAppointmentMain} onEdit={() => { setshowAppointmentOptionsModalMain(false); setisEditAppointmentModalOpenMain(true) }} onCancel={handleCancelAppointmentMain} onDelete={handleDeleteAppointmentMain} onViewMember={handleViewMemberDetailsMain} onEditMemberNote={handleOpenEditMemberModal} onOpenEditLeadModal={handleOpenEditLeadModal} memberRelations={memberRelationsMain} leadRelations={leadRelationsMain} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} />
        {isEditAppointmentModalOpenMain && selectedAppointmentMain && (
          <EditAppointmentModal selectedAppointmentMain={selectedAppointmentMain} setSelectedAppointmentMain={setSelectedAppointmentMain} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointmentsMain}
            handleAppointmentChange={(changes) => setSelectedAppointmentMain((prev) => ({ ...prev, ...changes }))} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} onDelete={handleDeleteAppointmentMain} onClose={() => { setisEditAppointmentModalOpenMain(false); setSelectedAppointmentMain(null) }} onOpenEditMemberModal={handleOpenEditMemberModal} onOpenEditLeadModal={handleOpenEditLeadModal} memberRelations={memberRelationsData} leadRelations={leadRelationsMain} />
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
        <BlockAppointmentModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} selectedDate={selectedDate || new Date()} onSubmit={(blockData) => {
          // Use formatDate (with dashes) instead of formatDateForDisplay (with slashes)
          // Calendar expects format: "Wed | 29-01-2025"
          const newBlock = { 
            id: Math.max(0, ...appointmentsMain.map(a => a.id)) + 1, 
            name: "BLOCKED", 
            time: `${blockData.startTime} - ${blockData.endTime}`,
            date: `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(blockData.startDate))}`,
            color: "bg-[#dc2626]", 
            startTime: blockData.startTime, 
            endTime: blockData.endTime, 
            type: "Blocked Time",
            specialNote: { 
              text: blockData.note || "", 
              startDate: blockData.startDate, 
              endDate: blockData.endDate, 
              isImportant: true 
            },
            status: "blocked", 
            isBlocked: true, 
            isCancelled: false, 
            isPast: false 
          }
          setAppointmentsMain([...appointmentsMain, newBlock]); 
          setIsBlockModalOpen(false)
        }} />
        {/* EditBlockedSlotModal for editing blocked time slots */}
        {isEditBlockedModalOpen && blockedEditData && (
          <EditBlockedSlotModalMain 
            isOpen={isEditBlockedModalOpen} 
            onClose={() => { setIsEditBlockedModalOpen(false); setBlockedEditData(null); }} 
            initialBlock={blockedEditData} 
            onDelete={(id) => {
              setAppointmentsMain(appointmentsMain.filter((apt) => apt.id !== id));
              setIsEditBlockedModalOpen(false);
              setBlockedEditData(null);
              toast.success("Blocked time slot deleted");
            }}
            onSubmit={(blockData) => {
              // Update the blocked slot with new data
              const formatDateLocal = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
              const newDateString = `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDateLocal(new Date(blockData.startDate))}`;
              setAppointmentsMain(appointmentsMain.map((apt) => 
                apt.id === blockedEditData.id 
                  ? { 
                      ...apt, 
                      startTime: blockData.startTime, 
                      endTime: blockData.endTime, 
                      date: newDateString, 
                      time: `${blockData.startTime} - ${blockData.endTime}`,
                      specialNote: { 
                        ...(apt.specialNote || {}), 
                        text: blockData.note || apt.specialNote?.text || "", 
                        isImportant: apt.specialNote?.isImportant ?? true 
                      },
                    } 
                  : apt
              ));
              setIsEditBlockedModalOpen(false); 
              setBlockedEditData(null);
              toast.success("Blocked time slot updated");
            }} 
          />
        )}
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
            relationOptionsMain={relationOptionsMainLocal}
            handleAddRelationMain={handleAddRelationMain}
            memberRelationsMain={memberRelationsMain}
            handleDeleteRelationMain={handleDeleteRelationMain}
          />
        )}
        {/* EditLeadModal for special notes and relations from appointment modals */}
        {isEditLeadModalOpen && selectedLeadForEdit && (
          <EditLeadModal
            isVisible={isEditLeadModalOpen}
            onClose={() => { 
              setIsEditLeadModalOpen(false); 
              setSelectedLeadForEdit(null);
            }}
            onSave={handleEditLeadSubmit}
            leadData={selectedLeadForEdit}
            memberRelationsLead={leadRelationsMain[selectedLeadForEdit?.id] || {}}
            setMemberRelationsLead={(relations) => setLeadRelationsMain(prev => ({ ...prev, [selectedLeadForEdit?.id]: relations }))}
            availableMembersLeads={availableMembersLeadsMain}
            columns={leadColumnsData}
            initialTab={editLeadActiveTab}
          />
        )}
      </div>
      
      {/* Floating Action Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        {/* FAB Menu Items - Appear when FAB is open */}
        <div className={`absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-200 ${isMobileFabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsBlockModalOpen(true)
              setIsMobileFabOpen(false)
            }}
            className="flex items-center gap-2 bg-[#1C1C1C] text-white pl-3 pr-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-sm">Block Time</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsTrialModalOpen(true)
              setIsMobileFabOpen(false)
            }}
            className="flex items-center gap-2 bg-[#1C1C1C] text-white pl-3 pr-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-[#3F74FF]"></div>
            <span className="text-sm">Trial Training</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
              setIsMobileFabOpen(false)
            }}
            className="flex items-center gap-2 bg-[#1C1C1C] text-white pl-3 pr-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-sm">Appointment</span>
          </button>
        </div>
        
        {/* Main FAB Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsMobileFabOpen(!isMobileFabOpen)
          }}
          className={`bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 ${isMobileFabOpen ? 'rotate-45' : ''}`}
          aria-label="Book appointment"
        >
          <Plus size={22} />
        </button>
      </div>
    </>
  )
}
