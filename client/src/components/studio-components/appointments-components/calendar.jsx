/* eslint-disable no-unused-vars */ /* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react"
import toast, { Toaster } from "react-hot-toast"
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { X } from "lucide-react"

import CreateAppointmentModal from "../../shared/appointments/CreateAppointmentModal"
import BlockAppointmentModal from "./block-appointment-modal"
import TrialTrainingModal from "../../shared/appointments/CreateTrialTrainingModal"
import EditAppointmentModalMain from "../../shared/appointments/EditAppointmentModal"

import AppointmentActionModal from "./AppointmentActionModal"
import NotifyMemberModal from "../../shared/appointments/NotifyMemberModal"
import TypeSelectionModalMain from "./TypeSelectionModalMain"
import EditBlockedSlotModalMain from "./EditBlockedSlotModalMain"
import EditMemberModalMain from "../../studio-components/members-components/EditMemberModal"
import EditLeadModal from "../../studio-components/lead-studio-components/edit-lead-modal"
import { memberRelationsData, availableMembersLeadsMain, freeAppointmentsData, relationOptionsData as relationOptionsMain, appointmentTypesData, studioData, germanHolidaysData, isStudioClosedOnDate, getHolidayForDate, DEFAULT_CALENDAR_SETTINGS, leadsData } from "../../../utils/studio-states"


import { useNavigate } from "react-router-dom"

// Helper function to format date as YYYY-MM-DD in local timezone (avoiding UTC shift issues)
const formatDateLocal = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Calendar = forwardRef(({
  appointmentsMain,
  onEventClick,
  onDateSelect,
  memberFilters = [],
  selectedDate,
  setAppointmentsMain,
  appointmentFilters = {},
  onDateDisplayChange,
  onViewModeChange,
  onCurrentDateChange,
  calendarSettings = DEFAULT_CALENDAR_SETTINGS,
}, ref) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [freeAppointments, setFreeAppointments] = useState(freeAppointmentsData)
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
  const hideTooltipTimeoutRef = useRef(null)
  const showTooltipTimeoutRef = useRef(null)
  const [currentDate, setCurrentDate] = useState(selectedDate || formatDateLocal(new Date()))

  const [appointmentTypesMain] = useState(appointmentTypesData)

  const [memberAppointments, setMemberAppointments] = useState([])
  const [isEditBlockedModalOpen, setIsEditBlockedModalOpen] = useState(false)
  const [blockedEditData, setBlockedEditData] = useState(null)

  // Calculate hidden days based on studioData.openingHours (closed days won't show as columns)
  // Only hide days if calendarSettings.hideClosedDays is true
  const hiddenDays = useMemo(() => {
    // If hideClosedDays is disabled, don't hide any days
    if (!calendarSettings.hideClosedDays) {
      return [];
    }
    
    const dayNameToIndex = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
    };
    
    const days = [];
    
    // Safety check for studioData and openingHours
    if (studioData?.openingHours && Array.isArray(studioData.openingHours)) {
      studioData.openingHours.forEach(dayConfig => {
        if (dayConfig?.closed) {
          const dayIndex = dayNameToIndex[dayConfig.day];
          if (dayIndex !== undefined) {
            days.push(dayIndex);
          }
        }
      });
    }
    
    return days;
  }, [calendarSettings.hideClosedDays]);

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
  const [originalEventData, setOriginalEventData] = useState(null)
  const [pendingEventData, setPendingEventData] = useState(null)
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false)
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null)
  const [prefilledSlotDate, setPrefilledSlotDate] = useState(null)
  const [prefilledSlotTime, setPrefilledSlotTime] = useState(null)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

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
  const [localMemberRelations, setLocalMemberRelations] = useState(memberRelationsData)
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
  const [leadRelationsMain, setLeadRelationsMain] = useState({})
  const [leadColumnsData] = useState([
    { id: "new", title: "New" },
    { id: "contacted", title: "Contacted" },
    { id: "qualified", title: "Qualified" },
    { id: "negotiation", title: "Negotiation" },
    { id: "won", title: "Won" },
    { id: "lost", title: "Lost" },
  ])

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
  }, [selectedMemberForEdit]);

  // Handler for input changes in edit form
  const handleInputChangeMain = (e) => {
    const { name, value } = e.target;
    setEditFormMain((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for form submit
  const handleEditSubmitMain = (e, localRelations = null, localNotes = null) => {
    e.preventDefault();
    // Update member relations if provided
    if (localRelations && selectedMemberForEdit?.id) {
      setLocalMemberRelations(prev => ({
        ...prev,
        [selectedMemberForEdit.id]: localRelations
      }));
    }
    setIsEditMemberModalOpen(false);
    setSelectedMemberForEdit(null);
    toast.success("Member details updated");
  };

  // Handler for adding a relation
  const handleAddRelationMain = () => {
    if (!selectedMemberForEdit || !newRelationMain.name || !newRelationMain.relation) return;
    const memberId = selectedMemberForEdit.id;
    const category = newRelationMain.category;
    const currentRelations = localMemberRelations[memberId] || { family: [], friendship: [], relationship: [], work: [], other: [] };
    const newRelation = {
      id: Date.now(),
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
      memberId: newRelationMain.selectedMemberId,
    };
    setLocalMemberRelations(prev => ({
      ...prev,
      [memberId]: {
        ...currentRelations,
        [category]: [...(currentRelations[category] || []), newRelation]
      }
    }));
    setNewRelationMain({
      name: "", relation: "", category: "family", type: "manual", selectedMemberId: null,
    });
    toast.success("Relation added");
  };

  // Handler for deleting a relation
  const handleDeleteRelationMain = (memberId, category, relationId) => {
    setLocalMemberRelations(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: prev[memberId][category].filter(r => r.id !== relationId)
      }
    }));
    toast.success("Relation deleted");
  };

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

  // Helper function to get the appropriate date for selection
  // If today is within the view range, return today, otherwise return the view start
  const getDateForSelection = (view) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const viewStart = new Date(view.currentStart);
    viewStart.setHours(0, 0, 0, 0);
    const viewEnd = new Date(view.currentEnd);
    viewEnd.setHours(0, 0, 0, 0);
    
    // Check if today is within the view range
    if (today >= viewStart && today < viewEnd) {
      return today;
    }
    
    // Otherwise return the first day of the view
    if (view.type === "dayGridMonth") {
      // For month view, return the first day of the actual month (not the view start which might be from prev month)
      const midDate = new Date(view.currentStart);
      midDate.setDate(midDate.getDate() + 15);
      return new Date(midDate.getFullYear(), midDate.getMonth(), 1);
    }
    
    return viewStart;
  };

  // Expose calendar API methods via ref
  useImperativeHandle(ref, () => ({
    prev: () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.prev();
        setCurrentDate(formatDateLocal(calendarApi.getDate()));
        
        const view = calendarApi.view;
        const dateForSelection = getDateForSelection(view);
        onCurrentDateChange?.(dateForSelection, true);
        
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
        setCurrentDate(formatDateLocal(calendarApi.getDate()));
        
        const view = calendarApi.view;
        const dateForSelection = getDateForSelection(view);
        onCurrentDateChange?.(dateForSelection, true);
        
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
        
        // Nach View-Wechsel zum ausgewaehlten Datum navigieren
        if (selectedDate) {
          calendarApi.gotoDate(selectedDate);
        }
        
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
    // If it's a blocked slot, open EditBlockedSlotModal directly
    if (appointment.isBlocked || appointment.type === "Blocked Time") {
      setBlockedEditData({ ...appointment })
      setIsEditBlockedModalOpen(true)
      return
    }
    setSelectedAppointment(appointment)
    setIsAppointmentActionModalOpen(true)
  }

  // Kalender navigiert zu selectedDate wenn es ausserhalb der aktuellen Ansicht liegt
  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const view = calendarApi.view
      const viewStart = new Date(view.currentStart)
      const viewEnd = new Date(view.currentEnd)
      const selected = new Date(selectedDate)
      
      // Nur navigieren wenn selectedDate ausserhalb der aktuellen Ansicht liegt
      if (selected < viewStart || selected >= viewEnd) {
        calendarApi.gotoDate(selectedDate)
      }
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

  const showTooltip = (event, mouseEvent, eventElement = null) => {
    // Cancel any pending hide timeout
    if (hideTooltipTimeoutRef.current) {
      clearTimeout(hideTooltipTimeoutRef.current);
      hideTooltipTimeoutRef.current = null;
    }
    
    // Cancel any pending show timeout
    if (showTooltipTimeoutRef.current) {
      clearTimeout(showTooltipTimeoutRef.current);
      showTooltipTimeoutRef.current = null;
    }
    
    // Nicht anzeigen wenn ein Modal offen ist
    if (isNotifyMemberOpen || isAppointmentActionModalOpen || isTypeSelectionOpen) return;
    
    const appointment = event.extendedProps?.appointment
    if (!appointment) return
    
    // Try to get event element - use passed element or find from mouseEvent
    let element = eventElement;
    if (!element && mouseEvent?.target) {
      element = mouseEvent.target.closest(".fc-event");
    }
    if (!element) return;
    
    // Delay showing tooltip - user needs to hover for a moment
    showTooltipTimeoutRef.current = setTimeout(() => {
      const rect = element.getBoundingClientRect()
      const tooltipX = rect.left + rect.width / 2
      const tooltipY = rect.top - 4

      const dateParts = appointment.date?.split("|")
      let formattedDate = "N/A"
      if (dateParts && dateParts.length > 1) {
        const datePart = dateParts[1].trim()
        const [day, month, year] = datePart.split("-")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        formattedDate = `${day} ${monthNames[Number.parseInt(month) - 1]} ${year}`
      }

      const fullName = appointment.lastName 
        ? `${appointment.name} ${appointment.lastName}` 
        : (appointment.name || event.title)

      setTooltip({
        show: true, x: tooltipX, y: tooltipY,
        content: {
          name: fullName,
          date: formattedDate,
          time: `${appointment.startTime || "N/A"} - ${appointment.endTime || "N/A"}`,
          type: appointment.isTrial && appointment.trialType 
            ? `Trial Training • ${appointment.trialType}` 
            : (appointment.type || event.extendedProps?.type || "N/A"),
          // Include note for blocked slots
          note: (appointment.isBlocked || appointment.type === "Blocked Time") 
            ? (appointment.specialNote?.text || "") 
            : null,
          isBlocked: appointment.isBlocked || appointment.type === "Blocked Time",
        },
      })
    }, 150); // 150ms delay - prevents tooltip when quickly moving across screen
  }

  const hideTooltip = (immediate = false) => {
    // Cancel any existing hide timeout
    if (hideTooltipTimeoutRef.current) {
      clearTimeout(hideTooltipTimeoutRef.current);
      hideTooltipTimeoutRef.current = null;
    }
    
    // Cancel any pending show timeout
    if (showTooltipTimeoutRef.current) {
      clearTimeout(showTooltipTimeoutRef.current);
      showTooltipTimeoutRef.current = null;
    }
    
    const doHide = () => {
      setTooltip({ show: false, x: 0, y: 0, content: null });
      const tooltips = document.querySelectorAll('.tooltip-container');
      tooltips.forEach(t => { t.style.display = 'none'; t.style.visibility = 'hidden'; });
    };
    
    if (immediate) {
      doHide();
    } else {
      // Small delay to allow hovering to next element
      hideTooltipTimeoutRef.current = setTimeout(doHide, 50);
    }
  };

  // Verstecke Tooltip wenn ein Modal geoeffnet wird
  useEffect(() => {
    if (isNotifyMemberOpen || isAppointmentActionModalOpen || isTypeSelectionOpen) {
      hideTooltip(true);
    }
  }, [isNotifyMemberOpen, isAppointmentActionModalOpen, isTypeSelectionOpen]);

  // Cleanup tooltip timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }
      if (showTooltipTimeoutRef.current) {
        clearTimeout(showTooltipTimeoutRef.current);
      }
    };
  }, []);

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
      id: Math.max(0, ...appointmentsMain.map(a => a.id)) + 1, ...appointmentData,
      status: "pending", isTrial: false, isCancelled: false, isPast: false,
      date: `${new Date(appointmentData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(appointmentData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    
  }

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: Math.max(0, ...appointmentsMain.map(a => a.id)) + 1, ...trialData,
      status: "pending", isTrial: true, isCancelled: false, isPast: false,
      date: `${new Date(trialData.date).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(trialData.date))}`,
    }
    setAppointmentsMain([...appointmentsMain, newTrial])
    
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
  }

  const handleEventDrop = (info) => { 
    hideTooltip(true);
    const { event } = info;
    const appointmentId = Number(event.id);
    const duration = event.end - event.start;
    
    // Store original data for potential revert
    const originalAppointment = appointmentsMain.find(app => app.id === appointmentId);
    if (originalAppointment) {
      setOriginalEventData({
        ...originalAppointment, // Store full appointment data including isTrial, leadId, trialType
        id: appointmentId,
        startTime: originalAppointment.startTime,
        endTime: originalAppointment.endTime,
        date: originalAppointment.date
      });
    }
    
    // Update state immediately (so the event stays at new position visually in calendar)
    const updatedAppointments = appointmentsMain.map((appointment) => {
      if (appointment.id === appointmentId) {
        return { 
          ...appointment,
          startTime: event.start.toTimeString().split(" ")[0].substring(0, 5),
          endTime: new Date(event.start.getTime() + duration).toTimeString().split(" ")[0].substring(0, 5),
          date: `${event.start.toLocaleString("en-US", { weekday: "short" })} | ${formatDate(event.start)}`,
          // Store original time for Upcoming list sorting - it should keep showing at original position
          _pendingMove: {
            originalStartTime: originalAppointment?.startTime,
            originalDate: originalAppointment?.date,
          },
        };
      }
      return appointment;
    });
    setAppointmentsMain(updatedAppointments);
    
    setPendingEventInfo(info); 
    setNotifyAction("change"); 
    setIsNotifyMemberOpen(true); 
  }

  const handleDateSelect = (selectInfo) => {
    const clickedElement = selectInfo.jsEvent?.target;
    // Ignoriere Klicks auf more-links und appointment tiles in der Monatsansicht
    if (clickedElement) {
      if (clickedElement.classList?.contains('fc-daygrid-more-link') || clickedElement.closest('.fc-daygrid-more-link')) return;
      if (clickedElement.classList?.contains('month-apt-tile') || clickedElement.closest('.month-apt-tile')) return;
      if (clickedElement.classList?.contains('month-more-link') || clickedElement.closest('.month-more-link')) return;
    }
    
    // Check if we're in month view
    const calendarApi = calendarRef.current?.getApi();
    const viewType = calendarApi?.view?.type;
    
    if (viewType === "dayGridMonth") {
      // In month view, set default time slot (9:00 - 10:00)
      const startDate = new Date(selectInfo.start);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(selectInfo.start);
      endDate.setHours(10, 0, 0, 0);
      
      setSelectedSlotInfo({ start: startDate, end: endDate });
    } else {
      setSelectedSlotInfo(selectInfo);
    }
    setIsTypeSelectionOpen(true)
  }

  const handleTypeSelection = (type, slotData) => {
    setIsTypeSelectionOpen(false)
    
    // Store the prefilled date and time from the slot click
    if (slotData?.date) {
      setPrefilledSlotDate(slotData.date)
    }
    if (slotData?.time) {
      setPrefilledSlotTime(slotData.time)
    }
    
    if (type === "trial") setIsTrialModalOpen(true)
    else if (type === "appointment") setIsAppointmentModalOpen(true)
    else if (type === "block") setIsBlockModalOpen(true)
    else if (selectedSlotInfo && onDateSelect) onDateSelect({ ...selectedSlotInfo, eventType: type })
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    if (pendingEventInfo && notifyAction === "change") {
      // User confirmed - remove the _pendingMove flag
      const appointmentId = Number(pendingEventInfo.event.id);
      const updatedAppointments = appointmentsMain.map((appointment) => {
        if (appointment.id === appointmentId) {
          const { _pendingMove, ...rest } = appointment;
          return rest; // Remove _pendingMove flag
        }
        return appointment;
      });
      setAppointmentsMain(updatedAppointments);
      
      // Clear pending data
      setPendingEventInfo(null);
      setOriginalEventData(null);
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
    if (appointment) { 
      // If it's a blocked slot, open EditBlockedSlotModal directly
      if (appointment.isBlocked || appointment.type === "Blocked Time") {
        setBlockedEditData({ ...appointment })
        setIsEditBlockedModalOpen(true)
        return
      }
      setSelectedAppointment(appointment)
      setIsAppointmentActionModalOpen(true) 
    }
    if (onEventClick) onEventClick(clickInfo)
  }

  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") {
      setBlockedEditData({ ...selectedAppointment }); setIsEditBlockedModalOpen(true); return
    }
    // Pass all appointment data to EditAppointmentModal - don't create a new object with missing fields
    const appointmentForModal = {
      ...selectedAppointment,
      // Convert date format from "Wed | 28-01-2025" to "2025-01-28" for the date input
      date: selectedAppointment.date,
      time: selectedAppointment.startTime,
    }
    setSelectedAppointmentData(appointmentForModal)
    setShowSelectedAppointmentModal(true)
  }

  const handleDeleteBlockedSlot = () => {
    if (!selectedAppointment) return
    if (!window.confirm("Are you sure you want to delete this blocked time slot?")) return
    setAppointmentsMain(appointmentsMain.filter((a) => a.id !== selectedAppointment.id))
    setSelectedAppointment(null); setIsAppointmentActionModalOpen(false)
    
  }

  const handleCancelAppointment = () => {
    if (selectedAppointment?.isBlocked || selectedAppointment?.type === "Blocked Time") { handleDeleteBlockedSlot(); return }
    setIsAppointmentActionModalOpen(false); setNotifyAction("cancel")
    if (selectedAppointment) {
      setSelectedAppointment({ ...selectedAppointment, status: "cancelled", isCancelled: true })
      setIsNotifyMemberOpen(true)
    }
  }

  // Delete appointment permanently (for already cancelled appointments)
  const handleDeleteCancelledAppointment = () => {
    if (!selectedAppointment) return
    setAppointmentsMain(appointmentsMain.filter((a) => a.id !== selectedAppointment.id))
    setSelectedAppointment(null)
    setIsAppointmentActionModalOpen(false)
    // No notify modal - just delete directly
  }

  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointmentsMain || !setAppointmentsMain || !selectedAppointment) return
    setAppointmentsMain(appointmentsMain.map((app) => app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app))
    
    setSelectedAppointment(null)
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false);
    if (!selectedAppointment) return;
    
    // Get member info from appointment
    const memberId = selectedAppointment.memberId;
    const memberName = selectedAppointment.lastName 
      ? `${selectedAppointment.name} ${selectedAppointment.lastName}`
      : selectedAppointment.name;
    
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
    setSelectedMemberForEdit(member);
    setEditMemberActiveTab(tab);
    setIsEditMemberModalOpen(true);
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

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = { id: Math.max(0, ...memberAppointments.map((a) => a.id)) + 1, ...data, memberId: selectedMemberForAppointments?.id }
    setMemberAppointments([...memberAppointments, newAppointment])
    setShowCreateAppointmentModal(false)
    
  }

  const handleDeleteAppointment = (id) => {
    setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null); setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true); setNotifyAction("delete")
    
  }

  const isEventInPast = (eventStart) => new Date(eventStart) < new Date()

  const safeAppointments = appointmentsMain || []
  const safeMemberFilters = memberFilters || []

  // Fuer den Kalender: ALLE Termine anzeigen (kein Datumsfilter!)
  const filteredAppointments = safeAppointments.filter((appointment) => {
    // Member-Filter (nur wenn Tags ausgewaehlt wurden)
    let memberMatch = true
    if (safeMemberFilters.length > 0) {
      const filterNames = safeMemberFilters.map(f => f.memberName.toLowerCase());
      const appointmentFullName = `${appointment.name || ''} ${appointment.lastName || ''}`.trim().toLowerCase();
      memberMatch = filterNames.includes(appointmentFullName);
    }
    
    // Typ-Filter anwenden
    let typeMatch = true
    if (appointmentFilters && Object.keys(appointmentFilters).length > 0) {
      // Erst pruefen ob der Termin-Typ erlaubt ist
      if (appointment.isTrial) {
        typeMatch = appointmentFilters["Trial Training"] !== false
      } else if (appointment.isBlocked || appointment.type === "Blocked Time") {
        typeMatch = appointmentFilters["Blocked Time Slots"] !== false
      } else {
        // Normaler Termin - pruefe den Typ
        typeMatch = appointmentFilters[appointment.type] !== false
      }
      
      // Zusaetzlich: Abgesagte Termine filtern
      if (appointment.isCancelled && appointmentFilters["Cancelled Appointments"] === false) {
        typeMatch = false
      }
      
      // Zusaetzlich: Vergangene Termine filtern (nur wenn nicht abgesagt)
      if (appointment.isPast && !appointment.isCancelled && appointmentFilters["Past Appointments"] === false) {
        typeMatch = false
      }
    }
    return memberMatch && typeMatch
  })

  // Get studio capacity from configuration (fallback to 3 if not set)
  const studioCapacity = studioData?.capacity || 3;

  // Calculate free slots dynamically based on existing appointments
  const calculateFreeSlots = () => {
    if (!calendarRef.current) return [];
    
    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;
    const viewStart = new Date(view.currentStart);
    const viewEnd = new Date(view.currentEnd);
    
    const freeSlots = [];
    let slotId = 10000; // Start with high ID to avoid conflicts
    
    // Get current time for comparison
    const now = new Date();
    const todayStr = formatDateLocal(now);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMins = currentHour * 60 + currentMinute;
    
    // Iterate through each day in the view
    const currentDay = new Date(viewStart);
    while (currentDay < viewEnd) {
      const dayStr = formatDateLocal(currentDay);
      const formattedDate = formatDate(currentDay);
      
      // Skip past days entirely
      if (dayStr < todayStr) {
        currentDay.setDate(currentDay.getDate() + 1);
        continue;
      }
      
      // Skip closed days (weekends, holidays, custom closing days)
      const closedInfo = isStudioClosedOnDate(dayStr);
      if (closedInfo.closed) {
        currentDay.setDate(currentDay.getDate() + 1);
        continue;
      }
      
      const isToday = dayStr === todayStr;
      
      // Get appointments for this day (excluding cancelled)
      const dayAppointments = filteredAppointments.filter(apt => {
        if (apt.isCancelled) return false;
        const aptDateParts = apt.date?.split("|") || [];
        if (aptDateParts.length < 2) return false;
        return aptDateParts[1].trim() === formattedDate;
      });
      
      // Check each 30-minute slot from 06:00 to 23:00
      for (let hour = 6; hour < 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStartMins = hour * 60 + minute;
          const slotEndMins = slotStartMins + 30;
          
          // Skip past slots for today
          if (isToday && slotStartMins <= currentTimeMins) {
            continue;
          }
          
          // Count overlapping appointments for this slot
          let totalOverlapping = 0;
          let isBlocked = false;
          
          // Track per-type counts for maxParallel check
          const typeCountMap = {};
          
          dayAppointments.forEach(apt => {
            const aptStart = apt.startTime?.split(':').map(Number) || [0, 0];
            const aptEnd = apt.endTime?.split(':').map(Number) || [0, 0];
            const aptStartMins = aptStart[0] * 60 + aptStart[1];
            const aptEndMins = aptEnd[0] * 60 + aptEnd[1];
            
            // Check if appointment overlaps with this slot
            if (aptStartMins < slotEndMins && aptEndMins > slotStartMins) {
              if (apt.isBlocked || apt.type === "Blocked Time") {
                isBlocked = true;
              } else {
                totalOverlapping++;
                // Track per-type count
                const aptType = apt.type || 'Unknown';
                typeCountMap[aptType] = (typeCountMap[aptType] || 0) + 1;
              }
            }
          });
          
          // Skip if blocked
          if (isBlocked) continue;
          
          // Calculate available slots based on studio capacity
          const availableByCapacity = studioCapacity - totalOverlapping;
          
          // Check if any appointment type has reached its maxParallel limit
          // This affects overall availability since some types might be fully booked
          let typeConstraintInfo = [];
          appointmentTypesData.forEach(type => {
            const currentCount = typeCountMap[type.name] || 0;
            const maxAllowed = type.maxParallel || studioCapacity;
            const availableForType = maxAllowed - currentCount;
            if (availableForType <= 0) {
              typeConstraintInfo.push(type.name);
            }
          });
          
          if (availableByCapacity > 0) {
            const slotEnd = new Date(currentDay);
            slotEnd.setHours(hour, minute + 30, 0, 0);
            
            // Create one free slot entry (we'll display how many are available)
            freeSlots.push({
              id: `free-${slotId++}`,
              date: dayStr,
              startTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
              endTime: `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`,
              availableCount: availableByCapacity,
              fullyBookedTypes: typeConstraintInfo, // Types that reached maxParallel
            });
          }
        }
      }
      
      // Move to next day
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return freeSlots;
  };

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

      const isBlockedEvent = appointment.isBlocked || appointment.type === "Blocked Time";
      
      return {
        id: appointment.id, title: appointment.name, start: startDateTimeStr, end: endDateTimeStr,
        backgroundColor, borderColor, textColor, isPast: isPastEvent, isCancelled: isCancelledEvent,
        editable: !isBlockedEvent, // Blocked events cannot be dragged
        extendedProps: { 
          type: appointment.type || "Unknown", 
          isPast: isPastEvent, 
          isCancelled: isCancelledEvent,
          isBlocked: isBlockedEvent,
          originalColor: appointment.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1", 
          viewMode, 
          appointment 
        },
      }
    }).filter(Boolean),
    // Only show free slots when viewMode is "free"
    ...(viewMode === "free" ? calculateFreeSlots().map((freeSlot) => {
      const startDateTimeStr = `${freeSlot.date}T${freeSlot.startTime}`
      const endDateTimeStr = `${freeSlot.date}T${freeSlot.endTime}`
      
      return {
        id: freeSlot.id, 
        title: "Available", 
        start: startDateTimeStr,
        end: endDateTimeStr,
        backgroundColor: "#f97316", // Orange color
        borderColor: "#ea580c",
        textColor: "#FFFFFF",
        extendedProps: { 
          isFree: true, 
          viewMode,
          availableCount: freeSlot.availableCount,
          startTime: freeSlot.startTime,
          endTime: freeSlot.endTime,
        },
      }
    }) : []),
  ]

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
          user-select: none !important;
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
          user-select: none !important;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 11px !important;
          font-weight: 500 !important;
          padding: 4px 0 !important;
          user-select: none !important;
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
          background-color: rgba(249, 115, 22, 0.14) !important;
        }
        .fc-dayGridMonth-view td.fc-day-today {
          background-color: rgba(249, 115, 22, 0.14) !important;
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
        /* Prevent text selection in calendar cells */
        .fc .fc-daygrid-day,
        .fc .fc-daygrid-day-frame,
        .fc .fc-daygrid-day-top,
        .fc .fc-daygrid-day-number,
        .fc .fc-daygrid-day-events {
          user-select: none !important;
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
        /* Vergangene Termine - abgeschwaecht */
       .past-event {
  filter: brightness(0.55) saturate(0.8);
}
        /* Blocked time slots - like cancelled events but in red */
        .blocked-event {
          position: relative;
          opacity: 0.65;
          background-color: #dc2626 !important;
          border-color: #b91c1c !important;
        }
        .blocked-event::after {
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
        /* Closed days (weekends, holidays, and custom closing days) - unified intense styling */
        .fc-day-closed {
          background: repeating-linear-gradient(
            -45deg,
            rgba(75, 85, 99, 0.35),
            rgba(75, 85, 99, 0.35) 5px,
            rgba(55, 65, 81, 0.2) 5px,
            rgba(55, 65, 81, 0.2) 10px
          ) !important;
          cursor: not-allowed !important;
        }
        .fc-day-closed .fc-timegrid-col-frame {
          cursor: not-allowed !important;
          background: rgba(75, 85, 99, 0.15) !important;
        }
        .fc-day-closed .fc-timegrid-slot {
          cursor: not-allowed !important;
          background: rgba(75, 85, 99, 0.08) !important;
        }
        /* Header styling for closed days */
        .fc th.fc-day-closed {
          background: rgba(75, 85, 99, 0.2) !important;
        }
        .fc th.fc-day-closed .fc-col-header-cell-cushion {
          color: #9ca3af !important;
        }
        .fc-col-header-cell .closed-label {
          display: block;
          font-size: 9px !important;
          font-weight: 500 !important;
          color: #ffffff !important;
          line-height: 1.1 !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          padding: 0 2px;
          opacity: 0.7;
          user-select: none;
        }
        /* Month view closed day styling */
        .fc-dayGridMonth-view .fc-day-closed {
          cursor: not-allowed !important;
          background: repeating-linear-gradient(
            -45deg,
            rgba(75, 85, 99, 0.4),
            rgba(75, 85, 99, 0.4) 5px,
            rgba(55, 65, 81, 0.25) 5px,
            rgba(55, 65, 81, 0.25) 10px
          ) !important;
        }
        .fc-dayGridMonth-view .fc-day-closed .fc-daygrid-day-frame {
          background: rgba(75, 85, 99, 0.1) !important;
        }
        .fc-dayGridMonth-view .fc-day-closed .fc-daygrid-day-number {
          color: #6b7280 !important;
        }
        /* Modern event styling */
        .fc-timegrid-event {
          border-radius: 4px !important;
          border-width: 0 !important;
          border-left-width: 3px !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
          overflow: hidden !important;
          cursor: move !important;
          pointer-events: auto !important;
          user-select: none !important;
        }
        .fc-timegrid-event:hover:not(.fc-event-dragging) {
          transform: scale(1.04) !important;
          box-shadow: 0 6px 12px rgba(0,0,0,0.35) !important;
          z-index: 100 !important;
          cursor: move !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
        }
        .fc-timegrid-event.fc-event-dragging {
          opacity: 0.8 !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4) !important;
          z-index: 1000 !important;
          cursor: grabbing !important;
        }
        body.dragging-active .fc-timegrid-event:not(.fc-event-dragging) {
          pointer-events: none !important;
        }
        .fc-timegrid-event .fc-event-main {
          padding: 2px 4px !important;
          height: 100% !important;
          display: flex !important;
          align-items: flex-start !important;
        }
        /* Rand links/rechts fuer Klick-Bereich zum Buchen */
        .fc-timegrid-col-events {
          margin: 0 3px !important;
        }
        /* Parallele Events nebeneinander */
        .fc-timegrid-event-harness {
          margin-right: 2px !important;
          pointer-events: auto !important;
        }
        .fc-timegrid-event-harness-inset {
          pointer-events: auto !important;
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
          padding: 0 !important;
        }
        .fc-dayGridMonth-view .fc-daygrid-day-frame {
          min-height: 120px !important;
          max-height: 120px !important;
          height: 120px !important;
          padding: 0 !important;
          overflow: hidden !important;
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
        .fc-dayGridMonth-view .fc-daygrid-day-top {
          padding: 2px 4px !important;
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
        /* Force white text color for appointment tiles in other months */
        .fc-dayGridMonth-view .fc-day-other div,
        .fc-dayGridMonth-view .fc-day-other span {
          color: inherit !important;
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
        /* Force white text on all month appointment tiles */
        .fc-dayGridMonth-view .month-apt-tile,
        .fc-dayGridMonth-view .month-apt-tile * {
          color: #ffffff !important;
        }
        .fc-dayGridMonth-view .fc-day-other .month-apt-tile,
        .fc-dayGridMonth-view .fc-day-other .month-apt-tile * {
          color: #ffffff !important;
        }
        /* Month appointment tile hover effect */
        .month-apt-tile {
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
          will-change: transform !important;
          backface-visibility: hidden !important;
          transform: translateZ(0) !important;
          user-select: none !important;
        }
        .month-apt-tile:hover {
          transform: translateZ(0) scale(1.06) !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35) !important;
          z-index: 10 !important;
          position: relative !important;
        }
        .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-number {
          color: #e5e7eb !important;
          font-weight: 700 !important;
        }
        .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-top span {
          color: #e5e7eb !important;
          font-weight: 700 !important;
        }
        /* More link hover styling */
        .month-more-link {
          transition: opacity 0.15s ease !important;
          user-select: none !important;
        }
        .month-more-link:hover {
          opacity: 0.7 !important;
        }
      `}</style>
      {tooltip.show && tooltip.content && (
        <div className="fixed z-[9999] pointer-events-none tooltip-container"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translate(-50%, -100%)" }}>
          <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600 max-w-xs">
            <div className="text-sm font-semibold mb-1">{tooltip.content.name}</div>
            <div className="text-xs text-gray-300 mb-0.5">{tooltip.content.time}</div>
            <div className="text-xs text-gray-300 mb-1">{tooltip.content.date}</div>
            {/* Don't show type for blocked slots - it's redundant */}
            {!tooltip.content.isBlocked && (
              <div className="text-xs text-white">{tooltip.content.type}</div>
            )}
            {/* Show note for blocked slots - with overflow protection */}
            {tooltip.content.note && (
              <div className="text-xs text-white/80 mt-2 pt-2 border-t border-gray-600 italic overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', maxHeight: '4.5em' }}>
                {tooltip.content.note}
              </div>
            )}
          </div>
          {/* Pfeil nach unten */}
          <div className="w-full flex justify-center -mt-[1px]">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
          </div>
        </div>
      )}

      <div className="h-full w-full flex flex-col">
        <div className="w-full bg-black flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-auto pt-0">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || formatDateLocal(new Date())}
              events={calendarEvents}
              height="auto"
              contentHeight="auto"
              locale="en"
              selectable={true}
              headerToolbar={false}
              editable={true}
              eventDurationEditable={false}
              eventDrop={handleEventDrop}
              hiddenDays={hiddenDays}
              slotMinTime={`${calendarSettings.calendarStartTime}:00`}
              slotMaxTime={`${calendarSettings.calendarEndTime}:00`}
              allDaySlot={false}
              nowIndicator={true}
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              slotHeight={32}
              slotEventOverlap={false}
              firstDay={1}
              eventClick={handleEventClick}
              select={handleDateSelect}
              selectAllow={(selectInfo) => {
                const calendarApi = calendarRef.current?.getApi();
                const viewType = calendarApi?.view?.type;
                
                // Check if the selected date is a closed day
                const dateStr = formatDateLocal(selectInfo.start);
                const closedInfo = isStudioClosedOnDate(dateStr);
                if (closedInfo.closed) {
                  return false;
                }
                
                // In month view, check if clicking on more-link or appointment tile
                if (viewType === "dayGridMonth") {
                  const clickedElement = selectInfo.jsEvent?.target;
                  if (clickedElement) {
                    // Don't allow selection when clicking on more-link or appointment tiles
                    if (clickedElement.classList?.contains('month-more-link') || clickedElement.closest('.month-more-link')) return false;
                    if (clickedElement.classList?.contains('month-apt-tile') || clickedElement.closest('.month-apt-tile')) return false;
                  }
                  return true;
                }
                
                // In week/day view, only allow 30-minute slots
                const duration = selectInfo.end - selectInfo.start;
                const thirtyMinutes = 30 * 60 * 1000;
                return duration <= thirtyMinutes;
              }}
              eventOverlap={true}
              eventMinHeight={28}
              views={{
                timeGridWeek: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const dateStr = formatDateLocal(date);
                    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const weekday = weekdays[date.getDay()];
                    const day = date.getDate();
                    
                    // Check for holidays (weekends are hidden via hiddenDays)
                    const closedInfo = isStudioClosedOnDate(dateStr);
                    const isHoliday = closedInfo.closed && !closedInfo.isWeekend;
                    
                    return (
                      <div style={{ textAlign: 'center', lineHeight: '1.1', userSelect: 'none' }}>
                        <div style={{ fontSize: '11px' }}>{weekday} {day}</div>
                        {isHoliday && (
                          <div className="closed-label">{closedInfo.reason}</div>
                        )}
                      </div>
                    );
                  }
                },
                timeGridDay: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const dateStr = formatDateLocal(date);
                    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const weekday = weekdays[date.getDay()];
                    const day = date.getDate();
                    
                    // Check for holidays (weekends are hidden via hiddenDays)
                    const closedInfo = isStudioClosedOnDate(dateStr);
                    const isHoliday = closedInfo.closed && !closedInfo.isWeekend;
                    
                    return (
                      <div style={{ textAlign: 'center', lineHeight: '1.1', userSelect: 'none' }}>
                        <div style={{ fontSize: '11px' }}>{weekday} {day}</div>
                        {isHoliday && (
                          <div className="closed-label">{closedInfo.reason}</div>
                        )}
                      </div>
                    );
                  }
                },
                dayGridMonth: {
                  dayHeaderContent: (args) => {
                    const date = new Date(args.date);
                    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const dayIndex = date.getDay();
                    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                    return <span style={{ userSelect: 'none' }}>{weekdays[adjustedIndex]}</span>;
                  }
                }
              }}
              eventDragStart={(info) => { hideTooltip(true); document.body.classList.add('dragging-active'); info.el.classList.add('fc-event-dragging'); }}
              eventDragStop={(info) => { document.body.classList.remove('dragging-active'); info.el.classList.remove('fc-event-dragging'); hideTooltip(true); }}
              dayMaxEvents={false}
              eventMaxStack={10}
              eventDisplay={(args) => { const viewType = calendarRef.current?.getApi()?.view?.type; return viewType === "dayGridMonth" ? 'none' : 'auto'; }}
              eventDidMount={(info) => { if (info.view.type === "dayGridMonth") info.el.style.display = 'none'; }}
              dayCellDidMount={(info) => {
                const dateStr = formatDateLocal(info.date);
                const closedInfo = isStudioClosedOnDate(dateStr);
                
                if (closedInfo.closed) {
                  info.el.classList.add('fc-day-closed');
                  info.el.style.cursor = 'not-allowed';
                } else if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  info.el.style.cursor = 'pointer';
                }
              }}
              datesSet={(info) => {
                setTimeout(() => {
                  const display = formatDateRange(info.view.currentStart);
                  setCurrentDateDisplay(display);
                  onDateDisplayChange?.(display);
                  document.body.classList.remove('dragging-active');
                  hideTooltip(true);
                }, 100);
              }}
              dayCellContent={(args) => {
                if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  const date = new Date(args.date)
                  const formattedDate = formatDate(date)
                  const dateString = formatDateLocal(date)
                  
                  // Check if this day is closed
                  const closedInfo = isStudioClosedOnDate(dateString)
                  const isClosed = closedInfo.closed
                  
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
                  
                  // Only show appointments for current month and non-closed days
                  const dayAppointments = (isCurrentMonth && !isClosed) ? filteredAppointments.filter(apt => {
                    const dateParts = apt.date?.split("|") || []
                    if (dateParts.length < 2) return false
                    return dateParts[1].trim() === formattedDate
                  }) : []
                  const displayAppointments = dayAppointments.slice(0, 3)
                  const moreCount = dayAppointments.length - 3

                  // Click handler for booking
                  const handleCellClick = (e) => {
                    // Don't trigger if clicking on an appointment tile
                    if (e.target.closest('.month-apt-tile')) return
                    
                    // Block booking on closed days
                    if (isClosed) {
                      const toastMessage = closedInfo.isWeekend ? 'Closed' : closedInfo.reason;
                      toast.error(`${toastMessage} - Studio closed`)
                      return
                    }
                    
                    const startDate = new Date(date)
                    startDate.setHours(9, 0, 0, 0)
                    const endDate = new Date(date)
                    endDate.setHours(10, 0, 0, 0)
                    
                    setSelectedSlotInfo({ start: startDate, end: endDate })
                    setIsTypeSelectionOpen(true)
                  }

                  // Show "Closed" for weekends, holiday name for holidays
                  const closedLabel = closedInfo.isWeekend ? 'Closed' : closedInfo.reason;

                  return (
                    <div 
                      style={{ height: '100%', width: '100%', padding: 0, margin: 0, overflow: 'hidden', cursor: isClosed ? 'not-allowed' : 'pointer', userSelect: 'none' }}
                      onClick={handleCellClick}
                    >
                      <div style={{ padding: '2px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Closed day label on the left */}
                        {isClosed && (
                          <span style={{ 
                            fontSize: '8px', 
                            color: '#ffffff', 
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '60%',
                            opacity: 0.7
                          }}>
                            {closedLabel}
                          </span>
                        )}
                        {!isClosed && <span></span>}
                        {/* Day number on the right */}
                        <span 
                          style={{ 
                            color: isClosed ? '#6b7280' : (isCurrentMonth ? '#e5e7eb' : '#888888'),
                            fontWeight: isToday ? '700' : (isCurrentMonth ? '500' : '400'),
                            fontSize: '13px'
                          }}
                        >
                          {args.dayNumberText}
                        </span>
                      </div>
                      <div style={{ overflow: 'hidden', padding: '0 4px', margin: 0, maxHeight: '82px' }}>
                        {displayAppointments.map((apt) => {
                          const fullName = apt.lastName ? `${apt.name} ${apt.lastName}` : apt.name;
                          let bg = apt.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1"
                          let opacity = 1
                          let extraStyle = {}
                          
                          if (apt.isCancelled) { 
                            bg = "#6B7280"
                            opacity = 0.6
                            extraStyle = {
                              backgroundImage: 'linear-gradient(-45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                              backgroundSize: '8px 8px'
                            }
                          } else if (apt.isPast && calendarSettings.fadePastAppointments) { 
                            opacity = 0.45
                          } else if (apt.isBlocked || apt.type === "Blocked Time") { 
                            bg = "#dc2626"
                            opacity = 0.65
                            // Add diagonal stripes for blocked slots (like cancelled but red)
                            extraStyle = {
                              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                              backgroundSize: '8px 8px'
                            }
                          }
                          
                          return (
                            <div 
                              key={apt.id}
                              className="month-apt-tile"
                              style={{ 
                                backgroundColor: bg, 
                                marginBottom: "1px",
                                padding: "3px 6px", 
                                borderRadius: "3px", 
                                height: "20px", 
                                width: "100%",
                                overflow: "hidden", 
                                opacity: opacity, 
                                color: "#fff", 
                                cursor: "pointer",
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxSizing: 'border-box',
                                ...extraStyle
                              }}
                              onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleMonthViewAppointmentClick(apt, e) }}
                              onMouseEnter={(e) => { 
                                e.stopPropagation(); 
                                const rect = e.currentTarget.getBoundingClientRect(); 
                                const isBlockedSlot = apt.isBlocked || apt.type === "Blocked Time";
                                setTooltip({ 
                                  show: true, 
                                  x: rect.left + rect.width / 2, 
                                  y: rect.top - 4, 
                                  content: { 
                                    name: fullName, 
                                    date: formattedDate.split('-').join(' '), 
                                    time: `${apt.startTime || "N/A"} - ${apt.endTime || "N/A"}`, 
                                    type: apt.isTrial && apt.trialType 
                                      ? `Trial Training • ${apt.trialType}` 
                                      : (apt.type || "N/A"),
                                    // Include note for blocked slots
                                    note: isBlockedSlot ? (apt.specialNote?.text || "") : null,
                                    isBlocked: isBlockedSlot,
                                  } 
                                }) 
                              }}
                              onMouseLeave={(e) => { e.stopPropagation(); hideTooltip() }}
                            >
                              <span style={{ fontSize: '10px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: '#ffffff' }}>
                                {fullName}
                              </span>
                              <span style={{ fontSize: '9px', opacity: 0.8, flexShrink: 0, color: '#ffffff' }}>
                                {apt.startTime}-{apt.endTime}
                              </span>
                            </div>
                          )
                        })}
                        {moreCount > 0 && (
                          <div 
                            className="month-more-link"
                            style={{ 
                              fontSize: "10px", 
                              color: "#9ca3af", 
                              cursor: "pointer", 
                              padding: "2px 6px", 
                              height: "18px", 
                              fontWeight: "500", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center"
                            }}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              e.preventDefault(); 
                              // Remove any selection highlight
                              calendarRef.current?.getApi()?.unselect();
                              handleShowAllAppointments(dateString, dayAppointments, e); 
                            }}>
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
                  return <div style={{ textAlign: "center", lineHeight: "1", padding: "8px 0", fontSize: "12px", fontWeight: "600", userSelect: "none" }}><span>{weekdays[adjustedIndex]}</span></div>
                }
                
                const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
                const day = date.getDate()
                return <div style={{ textAlign: "center", lineHeight: "1", padding: "2px 0", fontSize: "11px", userSelect: "none" }}><span>{weekday} {day}</span></div>
              }}
              dayCellClassNames={(date) => new Date(date.date).toDateString() === new Date().toDateString() ? ["fc-day-today-custom"] : []}
              eventMouseEnter={(info) => { 
                if (!document.body.classList.contains('dragging-active') && !info.el.classList.contains('fc-event-dragging')) {
                  showTooltip(info.event, info.jsEvent, info.el);
                }
              }}
              eventMouseLeave={() => { hideTooltip(); }}
              eventContent={(eventInfo) => {
                const isFree = eventInfo.event.extendedProps.isFree;
                
                if (isFree) {
                  const startTime = eventInfo.event.extendedProps.startTime || '';
                  const endTime = eventInfo.event.extendedProps.endTime || '';
                  const availableCount = eventInfo.event.extendedProps.availableCount || 1;
                  
                  return (
                    <div className="px-1 pt-[2px] overflow-hidden">
                      <div className="text-[10px] leading-tight overflow-hidden whitespace-nowrap text-white font-medium">
                        {availableCount}x Available
                      </div>
                      <div className="text-[9px] text-white/80">
                        {startTime}{endTime ? ` - ${endTime}` : ''}
                      </div>
                    </div>
                  );
                }
                
                const appointment = eventInfo.event.extendedProps.appointment;
                const startTime = appointment?.startTime || '';
                const endTime = appointment?.endTime || '';
                const name = appointment?.name || eventInfo.event.title || '';
                const lastName = appointment?.lastName || '';
                const fullName = lastName ? `${name} ${lastName}` : name;
                const isBlocked = appointment?.isBlocked || appointment?.type === "Blocked Time";
                const blockNote = isBlocked ? (appointment?.specialNote?.text || "") : "";
                
                return (
                  <div className="px-1 pt-[2px] overflow-hidden">
                    {/* Name hat Prioritaet */}
                    <div className="text-[10px] leading-tight overflow-hidden whitespace-nowrap text-white font-medium">
                      {fullName}
                    </div>
                    {/* Start- und Endzeit */}
                    <div className="text-[9px] text-white/80">
                      {startTime}{endTime ? ` - ${endTime}` : ''}
                    </div>
                    {/* Show note for blocked slots */}
                    {isBlocked && blockNote && (
                      <div className="text-[10px] text-white/90 mt-0.5 leading-tight overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {blockNote}
                      </div>
                    )}
                  </div>
                );
              }}
              eventClassNames={(eventInfo) => {
                const classes = []
                if (eventInfo.event.extendedProps.isPast && calendarSettings.fadePastAppointments) classes.push("past-event")
                if (eventInfo.event.extendedProps.isCancelled) classes.push("cancelled-event")
                if (eventInfo.event.extendedProps.isBlocked || eventInfo.event.extendedProps.appointment?.isBlocked) classes.push("blocked-event")
                if (eventInfo.event.extendedProps.isFree) { classes.push("free-slot-event cursor-pointer"); if (eventInfo.event.extendedProps.viewMode === "free") classes.push("prominent-free-slot") }
                return classes.join(" ")
              }}
            />
          </div>
        </div>
      </div>

      {showCreateAppointmentModal && <CreateAppointmentModal isOpen={showCreateAppointmentModal} onClose={() => setShowCreateAppointmentModal(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAddAppointmentSubmit} setIsNotifyMemberOpen={setIsNotifyMemberOpen} setNotifyAction={setNotifyAction} freeAppointmentsMain={freeAppointments} availableMembersLeads={availableMembersLeadsMain} onOpenEditMemberModal={handleOpenEditMemberModal} memberRelations={memberRelationsData} selectedDate={selectedDate} />}
      {isAppointmentModalOpen && <CreateAppointmentModal isOpen={isAppointmentModalOpen} onClose={() => { setIsAppointmentModalOpen(false); setPrefilledSlotDate(null); setPrefilledSlotTime(null); }} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAppointmentSubmit} setIsNotifyMemberOpen={setIsNotifyMemberOpen} setNotifyAction={setNotifyAction} freeAppointmentsMain={freeAppointments} availableMembersLeads={availableMembersLeadsMain} onOpenEditMemberModal={handleOpenEditMemberModal} memberRelations={memberRelationsData} selectedDate={prefilledSlotDate || selectedDate} selectedTime={prefilledSlotTime} />}
      <TrialTrainingModal isOpen={isTrialModalOpen} onClose={() => { setIsTrialModalOpen(false); setPrefilledSlotDate(null); setPrefilledSlotTime(null); }} freeAppointments={freeAppointments} onSubmit={handleTrialSubmit} selectedDate={prefilledSlotDate || selectedDate} selectedTime={prefilledSlotTime} />
      <BlockAppointmentModal isOpen={isBlockModalOpen} onClose={() => { setIsBlockModalOpen(false); setPrefilledSlotDate(null); setPrefilledSlotTime(null); }} selectedDate={prefilledSlotDate || selectedDate || new Date()} selectedTime={prefilledSlotTime} onSubmit={(blockData) => {
        // Use formatDate (with dashes) - Calendar expects format: "Wed | 29-01-2025"
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
        setAppointmentsMain([...appointmentsMain, newBlock]); setIsBlockModalOpen(false)
      }} />
      <TypeSelectionModalMain 
        isOpen={isTypeSelectionOpen} 
        onClose={() => setIsTypeSelectionOpen(false)} 
        onSelect={handleTypeSelection}
        selectedDate={selectedSlotInfo?.start || selectedSlotInfo?.date || null}
        selectedTime={selectedSlotInfo?.start ? `${String(selectedSlotInfo.start.getHours()).padStart(2, '0')}:${String(selectedSlotInfo.start.getMinutes()).padStart(2, '0')}` : null}
      />
      <AppointmentActionModal isOpen={isAppointmentActionModalOpen} appointment={selectedAppointment} onClose={() => setIsAppointmentActionModalOpen(false)} onEdit={handleEditAppointment} onCancel={handleCancelAppointment} onDelete={handleDeleteCancelledAppointment} onViewMember={handleViewMemberDetails} onEditMemberNote={handleOpenEditMemberModal} onOpenEditLeadModal={handleOpenEditLeadModal} memberRelations={localMemberRelations} leadRelations={leadRelationsMain} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} />
      <NotifyMemberModal isOpen={isNotifyMemberOpen} onClose={() => { 
        setIsNotifyMemberOpen(false); 
        if (pendingEventInfo && originalEventData && notifyAction === "change") { 
          // User cancelled - revert the state to original data
          const restoredAppointments = appointmentsMain.map((appointment) => {
            if (appointment.id === originalEventData.id) {
              // Restore original values and remove _pendingMove flag
              const { _pendingMove, ...rest } = appointment;
              return { 
                ...rest,
                startTime: originalEventData.startTime,
                endTime: originalEventData.endTime,
                date: originalEventData.date,
              };
            }
            return appointment;
          });
          setAppointmentsMain(restoredAppointments);
          setPendingEventInfo(null);
          setOriginalEventData(null);
        } 
      }} notifyAction={notifyAction} pendingEventInfo={pendingEventInfo} appointment={originalEventData} actuallyHandleCancelAppointment={actuallyHandleCancelAppointment} handleNotifyMember={handleNotifyMember} setPendingEventInfo={setPendingEventInfo} />
      {isEditBlockedModalOpen && blockedEditData && <EditBlockedSlotModalMain isOpen={isEditBlockedModalOpen} onClose={() => { setIsEditBlockedModalOpen(false); setBlockedEditData(null); }} initialBlock={blockedEditData} onDelete={(id) => {
        setAppointmentsMain(appointmentsMain.filter((apt) => apt.id !== id));
        setIsEditBlockedModalOpen(false);
        setBlockedEditData(null);
      }} onSubmit={(blockData) => {
        // Use formatDate (with dashes) for calendar compatibility
        const newDateString = `${new Date(blockData.startDate).toLocaleString("en-US", { weekday: "short" })} | ${formatDate(new Date(blockData.startDate))}`
        setAppointmentsMain(appointmentsMain.map((apt) => apt.id === blockedEditData.id ? { 
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
        } : apt))
        setIsEditBlockedModalOpen(false); setBlockedEditData(null); 
      }} />}
      {showSelectedAppointmentModal && selectedAppointmentData && <EditAppointmentModalMain selectedAppointmentMain={selectedAppointmentData} setSelectedAppointmentMain={setSelectedAppointmentData} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointments} handleAppointmentChange={(changes) => setSelectedAppointmentData({ ...selectedAppointmentData, ...changes })} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpen} setNotifyActionMain={setNotifyAction} onDelete={handleDeleteAppointment} onOpenEditMemberModal={handleOpenEditMemberModal} onOpenEditLeadModal={handleOpenEditLeadModal} memberRelations={memberRelationsData} leadRelations={leadRelationsMain} />}
      {showAllAppointmentsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseAllAppointmentsModal}>
          <div className="bg-[#181818] rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">{new Date(selectedDayDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              <button onClick={handleCloseAllAppointmentsModal} className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {allAppointmentsForDay.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-[#222222] rounded-xl">No appointments for this day</div>
              ) : (
                <div className="space-y-3">
                  {allAppointmentsForDay.map((apt) => {
                    const fullName = apt.lastName ? `${apt.name} ${apt.lastName}` : apt.name;
                    let bgColor = apt.color?.split("bg-[")[1]?.slice(0, -1) || "#4169E1";
                    let opacity = 1;
                    let extraStyle = {};
                    
                    if (apt.isCancelled) {
                      bgColor = "#6B7280";
                      extraStyle = {
                        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                        backgroundSize: '10px 10px'
                      };
                    } else if (apt.isPast && calendarSettings.fadePastAppointments) {
                      opacity = 0.6;
                    } else if (apt.isBlocked || apt.type === "Blocked Time") {
                      bgColor = "#dc2626";
                      opacity = 0.65;
                      // Add diagonal stripes like cancelled but red
                      extraStyle = {
                        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                        backgroundSize: '10px 10px'
                      };
                    }
                    
                    return (
                      <div 
                        key={apt.id} 
                        className="rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer"
                        style={{ backgroundColor: bgColor, opacity: opacity, ...extraStyle }}
                        onClick={() => { 
                          // If blocked slot, open EditBlockedSlotModal directly
                          if (apt.isBlocked || apt.type === "Blocked Time") {
                            setBlockedEditData({ ...apt });
                            setIsEditBlockedModalOpen(true);
                          } else {
                            setSelectedAppointment(apt); 
                            setIsAppointmentActionModalOpen(true); 
                          }
                          handleCloseAllAppointmentsModal() 
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{fullName}</p>
                            <p className="text-xs text-white/70 mt-1">
                              {apt.isTrial && apt.trialType 
                                ? `Trial Training • ${apt.trialType}` 
                                : apt.type}
                              {apt.isCancelled && " (Cancelled)"}
                              {(apt.isBlocked || apt.type === "Blocked Time") && " (Blocked)"}
                            </p>
                          </div>
                          <div className="text-sm text-white/80 font-medium">
                            {apt.startTime} - {apt.endTime}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700">
              <button onClick={handleCloseAllAppointmentsModal} className="w-full py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors">Close</button>
            </div>
          </div>
        </div>
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
          memberRelationsMain={localMemberRelations}
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
      <Toaster position="top-right" />
    </>
  )
})

Calendar.displayName = 'Calendar'
export default Calendar
