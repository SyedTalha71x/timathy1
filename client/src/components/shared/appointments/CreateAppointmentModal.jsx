/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Search, X, Plus, Users, Calendar, Clock, ChevronDown, AlertTriangle, Check, Info, SkipForward, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MemberSpecialNoteIcon } from '../shared-special-note-icon';

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
      className={`bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
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
    <div className="flex items-center gap-2 bg-[#2a2a2a] border border-gray-700 rounded-xl px-2.5 py-1.5">
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
      <span className="text-white text-sm font-medium">
        {member.name || `${member.firstName} ${member.lastName}`}
      </span>
      <button
        onClick={handleRelationsClick}
        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-1.5 py-0.5 rounded transition-colors"
        title="View Relations"
      >
        <Users size={12} />
        <span>{relationsCount}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-0.5 hover:bg-gray-600 rounded transition-colors ml-0.5"
      >
        <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
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
      id: member.id,
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
      <div className={`bg-[#222222] rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2 cursor-text ${isFull ? 'opacity-75' : ''}`}
        onClick={() => !isFull && inputRef.current?.focus()}>
        {members.map((member, index) => (
          <MemberTag 
            key={member.id} 
            member={member} 
            onRemove={() => setMembers(members.filter((_, i) => i !== index))} 
            onEditMemberNote={onEditMemberNote}
            relationsCount={getRelationsCount(member.id)}
          />
        ))}
        {!isFull && (
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            placeholder={members.length === 0 ? placeholder : "Add more..."} className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-gray-500 outline-none" />
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <div className={`text-xs ${isFull ? 'text-orange-400' : 'text-gray-500'}`}>{members.length} / {maxMembers} participants</div>
      </div>
      {showDropdown && !isFull && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[100] max-h-48 overflow-y-auto">
          {searchResults.length > 0 ? searchResults.map((member) => (
            <button key={member.id} onClick={() => selectMember(member)} className="w-full text-left p-3 hover:bg-[#2a2a2a] flex items-center gap-3">
              {member.image ? <img src={member.image} alt="" className="w-8 h-8 rounded-lg object-cover" /> : 
                <InitialsAvatar firstName={member.firstName} lastName={member.lastName} size={32} />}
              <div><div className="text-sm text-white">{member.name || `${member.firstName} ${member.lastName}`}</div></div>
            </button>
          )) : <div className="p-3 text-sm text-gray-500 text-center">No members found</div>}
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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#2a2a2a]">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-white">{selectedType.name}</span>
            <span className="text-gray-500 text-xs">({selectedType.duration} min)</span>
          </div>
        ) : <span className="text-gray-500">Select type...</span>}
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[100] max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button key={type.name} onClick={() => { onChange(type.name); setIsOpen(false); }}
              className={`w-full text-left p-3 flex items-center gap-3 ${value === type.name ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColorHex(type) }} />
              <div className="flex-1"><div className="text-sm text-white">{type.name}</div><div className="text-xs text-gray-500">{type.duration} min</div></div>
              {value === type.name && <Check size={16} className="text-orange-500" />}
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
  selectedDate = null, // Pre-selected date from MiniCalendar
}) => {
  if (!isOpen) return null;
  
  // Format selectedDate to YYYY-MM-DD string
  const getFormattedDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const initialDate = getFormattedDate(selectedDate);
  
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState(null);
  const [emailNotification, setEmailNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  
  const [appointmentData, setAppointmentData] = useState({ date: initialDate, timeSlot: "", type: "", members: selectedMemberMain ? [{
    id: selectedMemberMain.id, name: selectedMemberMain.name || selectedMemberMain.title,
    firstName: selectedMemberMain.firstName, lastName: selectedMemberMain.lastName, image: selectedMemberMain.image,
    notes: selectedMemberMain.notes || [], note: selectedMemberMain.note || "",
    noteImportance: selectedMemberMain.noteImportance || "unimportant",
    noteStartDate: selectedMemberMain.noteStartDate || "",
    noteEndDate: selectedMemberMain.noteEndDate || "",
  }] : [] });

  const updateAppointment = (field, value) => setAppointmentData({ ...appointmentData, [field]: value });

  const handleEditMemberNote = (member, tab) => {
    if (onOpenEditMemberModal) { onOpenEditMemberModal(member, tab || "note"); }
  };

  const handleSearchMembers = (query) => {
    if (searchMembersMain) return searchMembersMain(query);
    return availableMembersLeads.filter(m => m.name?.toLowerCase().includes(query.toLowerCase()) || 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase()));
  };

  const getAvailableSlots = (date) => freeAppointmentsMain.filter(app => app?.date === date);
  const availableSlots = getAvailableSlots(appointmentData.date);

  // Prepare appointment data but don't submit yet - show notify modal first
  const handleBook = () => {
    if (appointmentData.members.length === 0) { alert("Please add at least one member."); return; }
    
    // Get appointment type details
    const selectedType = appointmentTypesMain.find(t => t.name === appointmentData.type);
    const duration = selectedType?.duration || 30;
    
    // Calculate end time
    const [hours, minutes] = appointmentData.timeSlot.split(':').map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + duration);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    
    // Build appointment data for each member
    const appointmentsToCreate = appointmentData.members.map((member) => ({
      name: member.firstName || member.name?.split(" ")[0] || "",
      lastName: member.lastName || member.name?.split(" ").slice(1).join(" ") || "",
      memberId: member.id,
      type: appointmentData.type,
      date: appointmentData.date,
      startTime: appointmentData.timeSlot,
      endTime: endTime,
      time: `${appointmentData.timeSlot} - ${endTime}`,
      color: selectedType?.color || "bg-[#808080]",
      colorHex: getColorHex(selectedType),
      specialNote: member.note ? { text: member.note, isImportant: member.noteImportance === "important" } : null,
    }));
    
    // Store pending data and show notify modal
    setPendingAppointmentData(appointmentsToCreate);
    setShowNotifyModal(true);
  };

  // Actually create the appointments after notify decision
  const handleConfirmBooking = (shouldNotify) => {
    if (pendingAppointmentData && onSubmit) {
      pendingAppointmentData.forEach((aptData) => {
        onSubmit(aptData);
      });
    }
    
    // Close everything
    setShowNotifyModal(false);
    setPendingAppointmentData(null);
    onClose();
    
    // If notification was requested, you could handle it here or pass to parent
    if (shouldNotify) {
      console.log("Notification requested:", { email: emailNotification, push: pushNotification });
    }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000] p-4" onClick={onClose}>
      <div className="bg-[#181818] w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Users size={14} className="text-gray-500" />Participants</label>
            <MemberTagInput members={appointmentData.members} setMembers={(m) => updateAppointment("members", m)} 
              searchMembers={handleSearchMembers} onEditMemberNote={handleEditMemberNote} memberRelations={memberRelations} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Type</label>
            <AppointmentTypeDropdown value={appointmentData.type} onChange={(t) => updateAppointment("type", t)} appointmentTypes={appointmentTypesMain} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Date</label>
              <input type="date" value={appointmentData.date} onChange={(e) => updateAppointment("date", e.target.value)}
                className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white white-calendar-icon" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Time Slot</label>
              <select value={appointmentData.timeSlot} onChange={(e) => updateAppointment("timeSlot", e.target.value)}
                disabled={!appointmentData.date} className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white appearance-none disabled:opacity-50">
                <option value="">Select time...</option>
                {availableSlots.map((slot, idx) => <option key={idx} value={slot.time}>{slot.time}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-700 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-700 hover:bg-gray-600 rounded-xl">Cancel</button>
          <button disabled={!appointmentData.type || !appointmentData.members.length || !appointmentData.date || !appointmentData.timeSlot}
            onClick={handleBook} className="flex-1 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 rounded-xl">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Integrated Notify Member Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000001] p-4" onClick={handleCancelNotify}>
          <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Notify Member</h2>
              <button onClick={handleCancelNotify} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                New appointment for <span className="font-semibold text-orange-400">{getMemberNames()}</span> on{" "}
                <span className="font-semibold text-orange-400">
                  {pendingAppointmentData?.[0]?.date && new Date(pendingAppointmentData[0].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span> at{" "}
                <span className="font-semibold text-orange-400">{pendingAppointmentData?.[0]?.time}</span>.
                <br /><br />
                Do you want to notify the member about this booking?
              </p>

              {/* Notification Options */}
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">Email Notification</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotification}
                    onChange={(e) => setPushNotification(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">App Push Notification</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
              <button
                onClick={handleCancelNotify}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 text-sm font-medium text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Back
              </button>

              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => handleConfirmBooking(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  No, Don't Notify
                </button>

                <button
                  onClick={() => handleConfirmBooking(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Yes, Notify Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAppointmentModal;
