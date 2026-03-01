/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Search, X, Plus, Users, Calendar, Clock, ChevronDown, AlertTriangle, Check, Info, SkipForward, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MemberSpecialNoteIcon } from '../special-note/shared-special-note-icon';
import DatePickerField from '../DatePickerField';
import NotifyModalMain from '../NotifyModal';
import { useDispatch, useSelector } from "react-redux";
import { fetchStudioServices } from "../../../features/services/servicesSlice";
import { createAppointmentByStaff } from "../../../features/appointments/AppointmentSlice"
import { createAppointment } from "../../../features/appointments/AppointmentApi";
const MAX_PARTICIPANTS = 5;

// Helper function to extract hex color from various formats
const getColorHex = (type) => {
  if (!type) return "#808080";
  // If colorHex exists, use it directly
  if (type.colorHex) return type.colorHex;
  // If color is a hex value, use it
  if (type.color?.startsWith("#")) return type.color;
  // If color is a Tailwind class like bg-[#FF843E], extract the hex
  const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
  if (match) return match[0];
  // Default fallback
  return "#808080";
};

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = 32, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  return (
    <div
      className={`bg-primary rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  );
};

// Member Tag Component - Larger with Special Note Icon and Relations
const MemberTag = ({ member, onRemove, onEditMemberNote, relationsCount = 0 }) => {
  const handleEditNote = (memberData, tab) => {
    if (onEditMemberNote) {
      onEditMemberNote(memberData, tab || "note");
    }
  };

  const handleRelationsClick = (e) => {
    e.stopPropagation();
    if (onEditMemberNote) {
      onEditMemberNote(member, "relations");
    }
  };

  return (
    <div className="flex items-center gap-2 bg-surface-hover border border-border rounded-xl px-2.5 py-1.5">
      <MemberSpecialNoteIcon
        member={member}
        onEditMember={handleEditNote}
        size="sm"
        position="relative"
      />
      {member.image ? (
        <img src={member.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
      ) : (
        <InitialsAvatar
          firstName={member.firstName || member.name?.split(" ")[0]}
          lastName={member.lastName || member.name?.split(" ")[1]}
          size={28}
        />
      )}
      <span className="text-content-primary text-sm font-medium">
        {member.name || `${member.firstName} ${member.lastName}`}
      </span>
      <button
        onClick={handleRelationsClick}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded transition-colors"
        title="View Relations"
      >
        <Users size={12} />
        <span>{relationsCount}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-0.5 hover:bg-surface-button-hover rounded transition-colors ml-0.5"
      >
        <X className="w-3.5 h-3.5 text-content-muted hover:text-content-primary" />
      </button>
    </div>
  );
};

// Member Tag Input Component
const MemberTagInput = ({
  members, setMembers, searchMembers, placeholder = "Search members...",
  maxMembers = MAX_PARTICIPANTS, onEditMemberNote, memberRelations = {}
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const isFull = members.length >= maxMembers;

  const getRelationsCount = (memberId) => {
    const relations = memberRelations[memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  useEffect(() => {
    if (inputValue.length > 0 && searchMembers) {
      const results = searchMembers(inputValue);
      const filtered = results.filter(member => !members.some(m => m.id === member.id));
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(inputValue.length > 0);
    }
  }, [inputValue, searchMembers, members]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectMember = (member) => {
    if (isFull) return;
    setMembers([...members, {
      id: member._id,
      name: member.name || `${member.firstName} ${member.lastName}`,
      firstName: member.firstName, lastName: member.lastName, image: member.image,
      notes: member.notes || [], note: member.note || "",
      noteImportance: member.noteImportance || "unimportant",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteStatus: member.noteStatus || "general",
    }]);
    setInputValue("");
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`bg-surface-dark rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2 cursor-text ${isFull ? 'opacity-75' : ''}`}
        onClick={() => !isFull && inputRef.current?.focus()}>
        {members.map((member, index) => (
          <MemberTag
            key={member._id}
            member={member}
            onRemove={() => setMembers(members.filter((_, i) => i !== index))}
            onEditMemberNote={onEditMemberNote}
            relationsCount={getRelationsCount(member.id)}
          />
        ))}
        {!isFull && (
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            placeholder={members.length === 0 ? placeholder : "Add more..."} className="flex-1 min-w-[120px] bg-transparent text-sm text-content-primary placeholder-content-faint outline-none" />
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <div className={`text-xs ${isFull ? 'text-primary' : 'text-content-faint'}`}>{members.length} / {maxMembers} participants</div>
      </div>
      {showDropdown && !isFull && (
        <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-[1000] max-h-48 overflow-y-auto">
          {searchResults.length > 0 ? searchResults.map((member) => (
            <button key={member.id} onClick={() => selectMember(member)} className="w-full text-left p-3 hover:bg-surface-hover flex items-center gap-3">
              {member.image ? <img src={member.image} alt="" className="w-8 h-8 rounded-lg object-cover" /> :
                <InitialsAvatar firstName={member.firstName} lastName={member.lastName} size={32} />}
              <div><div className="text-sm text-content-primary">{member.name || `${member.firstName} ${member.lastName}`}</div></div>
            </button>
          )) : <div className="p-3 text-sm text-content-faint text-center">No members found</div>}
        </div>
      )}
    </div>
  );
};

// Appointment Type Dropdown
const AppointmentTypeDropdown = ({ value, onChange, appointmentTypes = [], showTrialTypes = false }) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter out trial types unless explicitly requested
  const filteredTypes = showTrialTypes
    ? appointmentTypes
    : appointmentTypes.filter(t => !t.isTrialType);

  const selectedType = filteredTypes.find(t => t.name === value);



  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-content-primary">{selectedType.name}</span>
            <span className="text-content-faint text-xs">({selectedType.duration} min)</span>
          </div>
        ) : <span className="text-content-faint">Select type...</span>}
        <ChevronDown size={14} className={`text-content-faint transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-[1000] max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button key={type.name} onClick={() => { onChange(type.name); setIsOpen(false); }}
              className={`w-full text-left p-3 flex items-center gap-3 ${value === type.name ? 'bg-surface-hover' : 'hover:bg-surface-hover'}`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColorHex(type) }} />
              <div className="flex-1"><div className="text-sm text-content-primary">{type.name}</div><div className="text-xs text-content-faint">{type.duration} min</div></div>
              {value === type.name && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AddAppointmentModal = ({
  isOpen, onClose, appointmentTypesMain = [], onSubmit,
  setIsNotifyMemberOpenMain, setNotifyActionMain,
  // Also accept alternative prop names from calendar.jsx
  setIsNotifyMemberOpen, setNotifyAction,
  freeAppointmentsMain = [], availableMembersLeads = [], searchMembersMain, selectedMemberMain = null,
  memberCredits = null, currentBillingPeriod = "March 2025",
  onOpenEditMemberModal, // Callback to open EditMemberModal with specific tab
  memberRelations = {}, // Relations data for members
  selectedDate = null, // Pre-selected date from MiniCalendar or Calendar click
  selectedTime = null, // Pre-selected time slot from Calendar click (e.g., "09:00")
}) => {
  const { services } = useSelector((state) => state.services || {});
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchStudioServices());
  }, [dispatch]);

  // Convert 24-hour time to AM/PM format
  const formatAMPM = (time24) => {
    const [hour, min] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${ampm}`;
  };



  // generate slots randomly
  // Generate time slots for a day based on studio hours and appointment duration
  // Generate time slots for multiple blocks with AM/PM display
  const generateSlots = (blocks) => {
    if (!Array.isArray(blocks)) {
      blocks = [
        { start: "09:00", end: "12:00", duration: 60 },  // morning
        { start: "13:00", end: "16:00", duration: 60 },  // afternoon
        { start: "17:00", end: "20:00", duration: 60 }   // evening
      ];
    }

    const allSlots = [];

    blocks.forEach(({ start, end, duration }) => {
      let [hour, min] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);

      while (hour < endHour || (hour === endHour && min < endMin)) {
        const startTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

        let tempMin = min + duration;
        let tempHour = hour;
        if (tempMin >= 60) {
          tempHour += Math.floor(tempMin / 60);
          tempMin = tempMin % 60;
        }

        if (tempHour > endHour || (tempHour === endHour && tempMin > endMin)) break;

        const endTime = `${String(tempHour).padStart(2, "0")}:${String(tempMin).padStart(2, "0")}`;

        allSlots.push({
          start: startTime,
          end: endTime,
          time: `${formatAMPM(startTime)} - ${formatAMPM(endTime)}` // for dropdown display
        });

        hour = tempHour;
        min = tempMin;
      }
    });

    return allSlots;
  };


  // Format selectedDate to YYYY-MM-DD string
  const getFormattedDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Extract time from selectedTime (handles formats like "09:00" or "09:00 - 09:30")
  const getInitialTime = (time) => {
    if (!time) return "";
    // If it's a range, take the start time
    if (time.includes("-")) {
      return time.split("-")[0].trim();
    }
    return time.trim();
  };

  const initialDate = getFormattedDate(selectedDate);
  const initialTime = getInitialTime(selectedTime);

  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState(null);

  // Recurring options state
  const [recurringOptions, setRecurringOptions] = useState({
    frequency: "weekly",
    dayOfWeek: initialDate ? String(new Date(initialDate).getDay()) : "1",
    startDate: initialDate,
    occurrences: 5,
  });

  const [appointmentData, setAppointmentData] = useState({
    date: initialDate,
    timeSlot: { start: initialTime, end: "" }, // store object instead of string
    type: "",
    members: selectedMemberMain ? [{
      id: selectedMemberMain._id,
      name: selectedMemberMain.name || selectedMemberMain.title,
      firstName: selectedMemberMain.firstName,
      lastName: selectedMemberMain.lastName,
      image: selectedMemberMain.image,
      notes: selectedMemberMain.notes || [],
      note: selectedMemberMain.note || "",
      noteImportance: selectedMemberMain.noteImportance || "unimportant",
      noteStartDate: selectedMemberMain.noteStartDate || "",
      noteEndDate: selectedMemberMain.noteEndDate || "",
    }] : []
  });
  // Update appointmentData when modal opens with new selectedDate or selectedTime
  useEffect(() => {
    if (!isOpen) return;

    const newDate = getFormattedDate(selectedDate);
    const newTime = getInitialTime(selectedTime);

    // Reset and set new values when modal opens
    setAppointmentData(prev => ({
      ...prev,
      date: newDate || prev.date,
      timeSlot: { start: newTime || "", end: "" },
      type: "",
      members: selectedMemberMain ? [{
        id: selectedMemberMain._id, name: selectedMemberMain.name || selectedMemberMain.title,
        firstName: selectedMemberMain.firstName, lastName: selectedMemberMain.lastName, image: selectedMemberMain.image,
        notes: selectedMemberMain.notes || [], note: selectedMemberMain.note || "",
        noteImportance: selectedMemberMain.noteImportance || "unimportant",
        noteStartDate: selectedMemberMain.noteStartDate || "",
        noteEndDate: selectedMemberMain.noteEndDate || "",
      }] : prev.members,
    }));

    if (newDate) {
      setRecurringOptions(prev => ({
        ...prev,
        startDate: newDate,
        dayOfWeek: String(new Date(newDate).getDay()),
      }));
    }
  }, [isOpen, selectedDate, selectedTime]);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const updateAppointment = (field, value) => setAppointmentData({ ...appointmentData, [field]: value });

  const updateRecurringOptions = (field, value) => {
    setRecurringOptions(prev => {
      const next = { ...prev, [field]: value };
      // Auto-sync dayOfWeek from startDate when switching to weekly
      if (field === "frequency" && value === "weekly" && prev.startDate) {
        next.dayOfWeek = String(new Date(prev.startDate).getDay());
      }
      return next;
    });
  };

  const handleEditMemberNote = (member, tab) => {
    if (onOpenEditMemberModal) { onOpenEditMemberModal(member, tab || "note"); }
  };

  const handleSearchMembers = (query) => {
    if (searchMembersMain) return searchMembersMain(query);
    return availableMembersLeads.filter(m => m.name?.toLowerCase().includes(query.toLowerCase()) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase()));
  };

  // const getAvailableSlots = (date) => freeAppointmentsMain.filter(app => app?.date === date);
  const availableSlots = generateSlots("09:00", "17:00", 30);

  // Helper: generate all recurring dates based on frequency, startDate, and occurrences
  const generateRecurringDates = (options) => {
    const dates = [];
    const { frequency, startDate, dayOfWeek, occurrences } = options;
    if (!startDate || !occurrences) return [startDate];

    const start = new Date(startDate + "T12:00:00"); // noon to avoid timezone issues

    for (let i = 0; i < occurrences; i++) {
      const current = new Date(start);

      if (frequency === "daily") {
        current.setDate(start.getDate() + i);
      } else if (frequency === "weekly") {
        current.setDate(start.getDate() + (i * 7));
        // Adjust to the correct day of week if needed
        if (i === 0 && dayOfWeek !== undefined) {
          const targetDay = parseInt(dayOfWeek);
          const currentDay = current.getDay();
          const diff = targetDay - currentDay;
          if (diff !== 0) {
            current.setDate(current.getDate() + diff);
          }
        } else if (i > 0 && dayOfWeek !== undefined) {
          // For subsequent weeks, calculate from the first adjusted date
          const targetDay = parseInt(dayOfWeek);
          const firstDate = new Date(start);
          const firstDayDiff = targetDay - firstDate.getDay();
          firstDate.setDate(firstDate.getDate() + firstDayDiff);
          current.setTime(firstDate.getTime());
          current.setDate(firstDate.getDate() + (i * 7));
        }
      } else if (frequency === "monthly") {
        current.setMonth(start.getMonth() + i);
      }

      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  // Prepare appointment data but don't submit yet - show notify modal first
  const handleBook = () => {
    // Basic validation
    if (!appointmentData.type || appointmentData.members.length === 0 || !appointmentData.timeSlot.start) {
      alert("Please complete all fields");
      return;
    }

    const selectedType = appointmentTypesMain.find(t => t.name === appointmentData.type);
    if (!selectedType) {
      alert("Invalid appointment type selected");
      return;
    }


    let { start, end } = appointmentData.timeSlot;

    // Always calculate end if missing
    if (!end) {
      const [hours, minutes] = start.split(":").map(Number);
      const endDate = new Date(2000, 0, 1, hours, minutes + (selectedType.duration || 30));
      end = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    }

    const dates = showRecurringOptions ? generateRecurringDates(recurringOptions) : [appointmentData.date];

    // Prepare appointments array
    const appointmentsToCreate = [];
    dates.forEach(date => {
      appointmentData.members.forEach(() => {
        // if (!member._id) return; // skip invalid members
        appointmentsToCreate.push({
          memberId: selectedMemberMain?._id,
          service: selectedType._id,
          date,
          timeSlot: {
            start, end
          },
          view: selectedType.view || "upcoming"
        });
      });
    });

    // Set for notification modal
    setPendingAppointmentData(appointmentsToCreate);
    setShowNotifyModal(true);
  };

  // Confirm booking after optional notification
  const handleConfirmBooking = (shouldNotify, notificationOptions) => {
    if (pendingAppointmentData) {
      pendingAppointmentData.forEach(apt => {
        dispatch(createAppointmentByStaff({ memberId: apt.memberId, appointmentData: apt }));
      });
    }

    setShowNotifyModal(false);
    setPendingAppointmentData(null);
    onClose();

    if (shouldNotify) console.log("Notify members:", notificationOptions);
  };

  // Cancel booking from notify modal - go back to form
  const handleCancelNotify = () => {
    setShowNotifyModal(false);
    setPendingAppointmentData(null);
    // Don't close the main modal - let user continue editing
  };

  // Get member names for notify modal display
  const getMemberNames = () => {
    if (!pendingAppointmentData || pendingAppointmentData.length === 0) return "";
    return pendingAppointmentData.map(apt =>
      apt.lastName ? `${apt.name} ${apt.lastName}` : apt.name
    ).join(", ");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content-primary">New Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 flex items-center gap-2"><Users size={14} className="text-content-faint" />Participants</label>
            <MemberTagInput members={appointmentData.members} setMembers={(m) => updateAppointment("members", m)}
              searchMembers={handleSearchMembers} onEditMemberNote={handleEditMemberNote} memberRelations={memberRelations} />
          </div>
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Appointment Type</label>
            <AppointmentTypeDropdown value={appointmentData.type} onChange={(t) => updateAppointment("type", t)} appointmentTypes={services} />
          </div>

          {/* Booking Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Booking Type</label>
            <div className="flex bg-surface-dark p-1 rounded-xl">
              <button type="button" onClick={() => setShowRecurringOptions(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!showRecurringOptions ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>
                Single
              </button>
              <button type="button" onClick={() => setShowRecurringOptions(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${showRecurringOptions ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>
                Recurring
              </button>
            </div>
          </div>

          {/* Single Booking Options */}
          {!showRecurringOptions && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Date</label>
                <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                  <span className={appointmentData.date ? "text-content-primary" : "text-content-faint"}>{appointmentData.date ? (() => { const [y, m, d] = appointmentData.date.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                  <DatePickerField value={appointmentData.date} onChange={(val) => updateAppointment("date", val)} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-content-faint mb-2">Time Slot</label>
                {/* // Time dropdown */}
                <select
                  value={appointmentData.timeSlot.start}
                  onChange={(e) => {
                    const start = e.target.value;
                    const slot = availableSlots.find(s => s.start === start);
                    const endTime = slot?.end || appointmentData.timeSlot.end;
                    setAppointmentData(prev => ({
                      ...prev,
                      timeSlot: { start, end: endTime }
                    }));
                  }}
                  className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5"
                >
                  <option value="">Select time...</option>
                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot.start}>{slot.time}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Recurring Options */}
          {showRecurringOptions && (
            <div className="space-y-4 bg-surface-dark rounded-xl p-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-1 bg-surface-card p-1 rounded-xl">
                  {[{ v: "daily", l: "Daily" }, { v: "weekly", l: "Weekly" }, { v: "monthly", l: "Monthly" }].map(f => (
                    <button key={f.v} type="button" onClick={() => updateRecurringOptions("frequency", f.v)}
                      className={`py-2 text-xs font-medium rounded-lg transition-colors ${recurringOptions.frequency === f.v ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>{f.l}</button>
                  ))}
                </div>
              </div>

              <div className={`grid gap-4 ${recurringOptions.frequency === "weekly" ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Start Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5">
                    <span className={recurringOptions.startDate ? "text-content-primary" : "text-content-faint"}>{recurringOptions.startDate ? (() => { const [y, m, d] = recurringOptions.startDate.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                    <DatePickerField value={recurringOptions.startDate} onChange={(val) => {
                      setRecurringOptions(prev => {
                        const next = { ...prev, startDate: val };
                        if (val && prev.frequency === "weekly") {
                          next.dayOfWeek = String(new Date(val).getDay());
                        }
                        return next;
                      });
                    }} />
                  </div>
                </div>
                {recurringOptions.frequency === "weekly" && (
                  <div>
                    <label className="block text-xs text-content-faint mb-2">Day of Week</label>
                    <select value={recurringOptions.dayOfWeek} onChange={(e) => updateRecurringOptions("dayOfWeek", e.target.value)}
                      className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary">
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-content-faint mb-2">Time Slot</label>
                  <select
                    value={appointmentData.timeSlot.start}
                    onChange={(e) => {
                      const start = e.target.value;
                      const slot = availableSlots.find(s => s.start === start);
                      const endTime = slot?.end || appointmentData.timeSlot.end;
                      setAppointmentData(prev => ({
                        ...prev,
                        timeSlot: { start, end: endTime }
                      }));
                    }}
                    className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5"
                  >
                    <option value="">Select time...</option>
                    {availableSlots.map((slot, idx) => (
                      <option key={idx} value={slot.start}>{slot.time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Occurrences</label>
                  <input type="number" min={1} max={52} value={recurringOptions.occurrences}
                    onChange={(e) => updateRecurringOptions("occurrences", parseInt(e.target.value) || 1)}
                    className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary focus:outline-none focus:border-primary" />
                </div>
              </div>

              {/* Frequency description */}
              <div className="text-xs text-content-faint">
                {recurringOptions.frequency === "daily" && "Creates an appointment every day starting from the selected date."}
                {recurringOptions.frequency === "weekly" && "Creates an appointment every week on the selected day."}
                {recurringOptions.frequency === "monthly" && recurringOptions.startDate && (() => {
                  const day = new Date(recurringOptions.startDate).getDate();
                  const s = ["th", "st", "nd", "rd"];
                  const v = day % 100;
                  const suffix = s[(v - 20) % 10] || s[v] || s[0];
                  return `Creates an appointment on the ${day}${suffix} of each month.`;
                })()}
                {recurringOptions.frequency === "monthly" && !recurringOptions.startDate && "Creates an appointment on the same day each month. Select a start date."}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Cancel</button>
          <button disabled={!appointmentData.type || !appointmentData.members.length || (!showRecurringOptions ? (!appointmentData.date || !appointmentData.timeSlot) : (!recurringOptions.startDate || !appointmentData.timeSlot))}
            onClick={handleBook} className="flex-1 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-surface-button rounded-xl">
            {showRecurringOptions ? "Book Series" : "Book Appointment"}
          </button>
        </div>
      </div>

      {/* Notify Member Modal (shared component) */}
      <NotifyModalMain
        isOpen={showNotifyModal}
        onClose={handleCancelNotify}
        onConfirm={handleConfirmBooking}
        action="book"
        entityType="member"
        entityName={getMemberNames()}
        date={
          showRecurringOptions
            ? recurringOptions.startDate && new Date(recurringOptions.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            : pendingAppointmentData?.[0]?.date && new Date(pendingAppointmentData[0].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        }
        time={pendingAppointmentData?.[0]?.time || ""}
        isRecurring={showRecurringOptions}
        recurringInfo={showRecurringOptions ? recurringOptions : null}
      />
    </div>
  );
};

export default AddAppointmentModal;
