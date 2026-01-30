/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { X, Clock, User, ChevronDown, AlertTriangle, Check, Users } from "lucide-react";
import { MemberSpecialNoteIcon } from '../shared-special-note-icon';

// Helper function to extract hex color from various formats
const getColorHex = (type) => {
  if (!type) return "#808080";
  if (type.colorHex) return type.colorHex;
  if (type.color?.startsWith("#")) return type.color;
  const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
  if (match) return match[0];
  return "#808080";
};

// Helper to parse date from appointment format "Mon | 27-01-2025" to "2025-01-27"
const parseDateFromAppointment = (dateString) => {
  if (!dateString) return "";
  // If already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Parse "Mon | 27-01-2025" format
  const parts = dateString.split("|");
  if (parts.length < 2) return "";
  const datePart = parts[1].trim(); // "27-01-2025"
  const [day, month, year] = datePart.split("-");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`; // "2025-01-27"
};

// Helper to format date back to appointment format
const formatDateForAppointment = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${weekday} | ${day}-${month}-${year}`;
};

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, name, size = 32, className = "" }) => {
  const getInitials = () => {
    if (firstName || lastName) {
      const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
      const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
      return `${firstInitial}${lastInitial}` || "?";
    }
    const parts = name?.split(" ") || [];
    const firstInitial = parts[0]?.charAt(0)?.toUpperCase() || "";
    const lastInitial = parts[1]?.charAt(0)?.toUpperCase() || "";
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

// Custom Appointment Type Dropdown with Colors
const AppointmentTypeDropdown = ({ value, onChange, appointmentTypes = [], showTrialTypes = false, hideDuration = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredTypes = showTrialTypes 
    ? appointmentTypes 
    : appointmentTypes.filter(t => !t.isTrialType);

  const selectedType = filteredTypes.find(t => t.name === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#2a2a2a] transition-colors">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-white">{selectedType.name}</span>
            {!hideDuration && <span className="text-gray-500 text-xs">({selectedType.duration} min)</span>}
          </div>
        ) : <span className="text-gray-500">Select type...</span>}
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[1000] max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button key={type.name} onClick={() => { onChange(type.name); setIsOpen(false); }}
              className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${value === type.name ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}>
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: getColorHex(type) }} />
              <div className="flex-1">
                <div className="text-sm text-white">{type.name}</div>
                {!hideDuration && <div className="text-xs text-gray-500">{type.duration} min</div>}
              </div>
              {value === type.name && <Check size={16} className="text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const EditAppointmentModalMain = ({
  selectedAppointmentMain,
  setSelectedAppointmentMain,
  appointmentTypesMain,
  freeAppointmentsMain,
  handleAppointmentChange,
  appointmentsMain,
  setAppointmentsMain,
  setIsNotifyMemberOpenMain,
  setNotifyActionMain,
  onDelete,
  onClose,
  onOpenEditMemberModal,
  onOpenEditLeadModal,
  memberRelations = {},
  leadRelations = {},
}) => {
  if (!selectedAppointmentMain) return null;

  // Parse date from appointment format to YYYY-MM-DD for date input
  const parsedDate = parseDateFromAppointment(selectedAppointmentMain.date);
  
  // Use startTime instead of time
  const currentTime = selectedAppointmentMain.startTime || selectedAppointmentMain.time || "";
  
  // Check if this is a lead for initial state setup
  const isLeadInit = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
  
  // Store original values for change detection
  // For leads: use trialType, for members: use type
  const originalType = isLeadInit 
    ? (selectedAppointmentMain.trialType || selectedAppointmentMain.type)
    : selectedAppointmentMain.type;

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);
  
  // Internal NotifyModal state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [notifyAction, setNotifyAction] = useState("change"); // "change" or "cancel"
  const [emailNotification, setEmailNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);

  // Local state for editing
  const [editDate, setEditDate] = useState(parsedDate);
  const [editTime, setEditTime] = useState(currentTime);
  const [editType, setEditType] = useState(originalType);
  
  // Track original values for change detection
  const [originalDate, setOriginalDate] = useState(parsedDate);
  const [originalTime, setOriginalTime] = useState(currentTime);

  // Update local state when appointment changes
  useEffect(() => {
    const newParsedDate = parseDateFromAppointment(selectedAppointmentMain.date);
    const newTime = selectedAppointmentMain.startTime || selectedAppointmentMain.time || "";
    const isLead = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
    const newType = isLead 
      ? (selectedAppointmentMain.trialType || selectedAppointmentMain.type)
      : selectedAppointmentMain.type;
    setEditDate(newParsedDate);
    setEditTime(newTime);
    setEditType(newType);
    setOriginalDate(newParsedDate);
    setOriginalTime(newTime);
  }, [selectedAppointmentMain.id]);

  // Check if any changes were made
  const hasChanges = editDate !== originalDate || 
                     editTime !== originalTime || 
                     editType !== originalType;

  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate) return [];
    const slots = freeAppointmentsMain.filter((app) => app.date === selectedDate);
    // Add current time slot if it's not already in the list
    if (currentTime) {
      const timeExists = slots.some((slot) => slot.time === currentTime);
      if (!timeExists) {
        slots.unshift({ id: "current", time: currentTime, date: selectedDate });
      }
    }
    return slots;
  };

  const checkAvailability = () => {
    const isAvailable = Math.random() > 0.5;
    if (!isAvailable) {
      const alternatives = generateAlternativeSlots(editDate, editTime);
      setAlternativeSlots(alternatives);
      setShowAlternatives(true);
    } else {
      saveChanges();
    }
  };

  const generateAlternativeSlots = (date, time) => {
    const baseDate = new Date(date);
    const alternatives = [];
    const timeOptions = ["09:00", "11:30", "14:00", "16:30"];
    timeOptions.forEach((t) => {
      if (t !== time) alternatives.push({ date, time: t, available: true });
    });
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);
      alternatives.push({ date: nextDay.toISOString().split("T")[0], time, available: true });
    }
    return alternatives;
  };

  const selectAlternative = (alt) => {
    setEditDate(alt.date);
    setEditTime(alt.time);
    setShowAlternatives(false);
  };

  const saveChanges = () => {
    // Check if this is a lead (trial training with leadId)
    const isLeadAppointment = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
    
    // Calculate end time based on appointment type duration
    // For leads: use Trial Training duration (60 min), not the trialType duration
    const selectedType = appointmentTypesMain.find(t => t.name === editType);
    const trialTrainingType = appointmentTypesMain.find(t => t.isTrialType || t.name === "Trial Training");
    const duration = isLeadAppointment 
      ? (trialTrainingType?.duration || 60) 
      : (selectedType?.duration || 30);
    
    // Parse start time and calculate end time
    const [hours, minutes] = editTime.split(':').map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + duration);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const updatedAppointment = {
      ...selectedAppointmentMain,
      // For leads: keep type as original, update trialType. For members: update type
      type: isLeadAppointment ? selectedAppointmentMain.type : editType,
      trialType: isLeadAppointment ? editType : selectedAppointmentMain.trialType,
      // For leads: KEEP original Trial Training color (blue). For members: use selected type color
      color: isLeadAppointment ? selectedAppointmentMain.color : (selectedType?.color || selectedAppointmentMain.color),
      colorHex: isLeadAppointment ? selectedAppointmentMain.colorHex : (getColorHex(selectedType) || selectedAppointmentMain.colorHex),
      date: formatDateForAppointment(editDate),
      startTime: editTime,
      endTime: endTime,
      time: `${editTime} - ${endTime}`,
    };

    // Store pending changes and show notify modal
    setPendingChanges(updatedAppointment);
    setShowNotifyModal(true);
  };

  // Actually apply the changes after notify decision
  const handleConfirmChanges = (shouldNotify) => {
    if (notifyAction === "cancel") {
      // Cancel appointment - mark as cancelled
      const updatedAppointments = appointmentsMain.map((app) =>
        app.id === selectedAppointmentMain.id 
          ? { ...app, status: "cancelled", isCancelled: true } 
          : app
      );
      setAppointmentsMain(updatedAppointments);
    } else if (pendingChanges) {
      // Update appointment with changes
      const updatedAppointments = appointmentsMain.map((app) =>
        app.id === selectedAppointmentMain.id ? pendingChanges : app
      );
      setAppointmentsMain(updatedAppointments);
    }
    
    // Close everything
    setShowNotifyModal(false);
    setPendingChanges(null);
    setNotifyAction("change");
    handleClose();
    
    // If notification was requested, you could handle it here or pass to parent
    if (shouldNotify) {
      console.log(`Notification requested for ${notifyAction}:`, { email: emailNotification, push: !isLead && pushNotification });
    }
  };

  // Cancel from notify modal - go back to edit form
  const handleCancelNotify = () => {
    setShowNotifyModal(false);
    setPendingChanges(null);
    setNotifyAction("change");
    // Don't close the main modal - let user continue editing
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setSelectedAppointmentMain(null);
    }
  };

  // Create a member object from the appointment for the special note icon
  const getMemberFromAppointment = () => {
    const firstName = selectedAppointmentMain.firstName || selectedAppointmentMain.name?.split(" ")[0] || "";
    const lastName = selectedAppointmentMain.lastName || selectedAppointmentMain.name?.split(" ").slice(1).join(" ") || "";
    return {
      id: selectedAppointmentMain.memberId || selectedAppointmentMain.id,
      name: selectedAppointmentMain.lastName 
        ? `${selectedAppointmentMain.name} ${selectedAppointmentMain.lastName}` 
        : selectedAppointmentMain.name,
      firstName: firstName,
      lastName: lastName,
      image: selectedAppointmentMain.memberImage || selectedAppointmentMain.image || null,
      note: selectedAppointmentMain.specialNote?.text || "",
      noteImportance: selectedAppointmentMain.specialNote?.isImportant ? "important" : "unimportant",
      noteStartDate: selectedAppointmentMain.specialNote?.startDate || "",
      noteEndDate: selectedAppointmentMain.specialNote?.endDate || "",
    };
  };

  const getRelationsCount = (memberId) => {
    // Check if this is a lead
    const isLeadAppt = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
    const relations = isLeadAppt 
      ? leadRelations[selectedAppointmentMain.leadId] 
      : memberRelations[memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  const handleEditMemberNote = (member, tab) => {
    // Check if this is a lead
    const isLeadAppt = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
    if (isLeadAppt && onOpenEditLeadModal) {
      // For leads, pass leadId and open Edit Lead Modal
      onOpenEditLeadModal(selectedAppointmentMain.leadId, tab || "note");
    } else if (onOpenEditMemberModal) {
      onOpenEditMemberModal(member, tab || "note");
    }
  };

  const handleRelationsClick = (e) => {
    e.stopPropagation();
    // Check if this is a lead
    const isLeadAppt = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
    if (isLeadAppt && onOpenEditLeadModal) {
      // For leads, open Edit Lead Modal with relations tab
      onOpenEditLeadModal(selectedAppointmentMain.leadId, "relations");
    } else if (onOpenEditMemberModal) {
      onOpenEditMemberModal(memberData, "relations");
    }
  };

  const memberData = getMemberFromAppointment();
  const fullName = selectedAppointmentMain.lastName 
    ? `${selectedAppointmentMain.name} ${selectedAppointmentMain.lastName}` 
    : selectedAppointmentMain.name;

  // Check if this is a lead (trial training with leadId)
  const isLead = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;
  const entityLabel = isLead ? "lead" : "member";
  const EntityLabel = isLead ? "Lead" : "Member";

  // Get appointment type display with trialType
  const appointmentTypeDisplay = selectedAppointmentMain.isTrial && selectedAppointmentMain.trialType
    ? `Trial Training • ${selectedAppointmentMain.trialType}`
    : selectedAppointmentMain.type;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000001] p-4" onClick={handleClose}>
      <div className="bg-[#181818] w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit Appointment</h2>
            <button onClick={handleClose} className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-5">
          {/* Member Tag with Special Note Icon and Relations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              {isLead ? "Lead" : "Member"}
            </label>
            <div className="bg-[#222222] rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-[#2a2a2a] border border-gray-700 rounded-xl px-2.5 py-1.5">
                {/* Special Note Icon */}
                <MemberSpecialNoteIcon
                  member={memberData}
                  onEditMember={handleEditMemberNote}
                  size="sm"
                  position="relative"
                />
                
                {/* Avatar - only for members, not leads */}
                {!isLead && (
                  selectedAppointmentMain.memberImage || selectedAppointmentMain.image ? (
                    <img src={selectedAppointmentMain.memberImage || selectedAppointmentMain.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <InitialsAvatar 
                      firstName={memberData.firstName} 
                      lastName={memberData.lastName} 
                      size={28} 
                    />
                  )
                )}
                
                {/* Name */}
                <span className="text-white text-sm font-medium">{fullName}</span>

                {/* Relations Button - for both members and leads */}
                <button onClick={handleRelationsClick}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-1.5 py-0.5 rounded transition-colors"
                  title="View Relations">
                  <Users size={12} />
                  <span>{getRelationsCount(memberData.id)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trial Training Info - only for leads */}
          {isLead && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Trial Training</p>
                <p className="text-xs text-gray-400">Duration: 60 minutes</p>
              </div>
            </div>
          )}

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Type</label>
            <AppointmentTypeDropdown
              value={editType}
              onChange={(type) => setEditType(type)}
              appointmentTypes={appointmentTypesMain}
              hideDuration={isLead}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Date</label>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 transition-colors white-calendar-icon" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Time Slot</label>
              <div className="relative">
                <select value={editTime} onChange={(e) => setEditTime(e.target.value)}
                  className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-orange-500/50 transition-colors">
                  {getAvailableSlots(editDate).map((slot, idx) => (
                    <option key={idx} value={slot.time}>{slot.time}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Alternative Slots Warning */}
          {showAlternatives && alternativeSlots.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-400 mb-2">Selected time unavailable</p>
                  <p className="text-xs text-gray-400 mb-3">Choose an alternative:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {alternativeSlots.slice(0, 4).map((alt, idx) => (
                      <button key={idx} onClick={() => selectAlternative(alt)}
                        className="text-left px-3 py-2 bg-[#181818] hover:bg-[#222222] rounded-lg text-xs transition-colors">
                        <div className="text-white">{alt.time}</div>
                        <div className="text-gray-500">{alt.date}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex gap-3">
          <button onClick={() => { setNotifyAction("cancel"); setShowNotifyModal(true); }}
            className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
            Cancel Appointment
          </button>
          <div className="flex-1" />
          <button onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors">
            Close
          </button>
          <button 
            onClick={checkAvailability}
            disabled={!hasChanges}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              hasChanges 
                ? "text-white bg-orange-500 hover:bg-orange-600" 
                : "text-gray-500 bg-gray-600 cursor-not-allowed"
            }`}>
            Save Changes
          </button>
        </div>

        {/* Integrated Notify Member Modal */}
        {showNotifyModal && (notifyAction === "cancel" || pendingChanges) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000002] p-4" onClick={handleCancelNotify}>
            <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify {EntityLabel}</h2>
                <button onClick={handleCancelNotify} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {notifyAction === "cancel" ? (
                  <p className="text-white text-sm">
                    <span className="font-semibold text-orange-400">{fullName}'s</span>
                    <span className="text-gray-400"> ({appointmentTypeDisplay})</span> appointment on{" "}
                    <span className="font-semibold text-orange-400">
                      {selectedAppointmentMain.date && new Date(parseDateFromAppointment(selectedAppointmentMain.date)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span> at{" "}
                    <span className="font-semibold text-orange-400">{selectedAppointmentMain.time || `${selectedAppointmentMain.startTime} - ${selectedAppointmentMain.endTime}`}</span>{" "}
                    will be <span className="font-semibold text-red-400">cancelled</span>.
                    <br /><br />
                    Do you want to notify the {entityLabel} about this cancellation?
                  </p>
                ) : (
                  <p className="text-white text-sm">
                    <span className="font-semibold text-orange-400">{fullName}'s</span>
                    <span className="text-gray-400"> ({appointmentTypeDisplay})</span> appointment will be changed to{" "}
                    <span className="font-semibold text-orange-400">
                      {pendingChanges?.date && new Date(parseDateFromAppointment(pendingChanges.date)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span> at{" "}
                    <span className="font-semibold text-orange-400">{pendingChanges?.time}</span>.
                    <br /><br />
                    Do you want to notify the {entityLabel} about this change?
                  </p>
                )}

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
                  
                  {/* App Push Notification - only for members, not leads */}
                  {!isLead && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushNotification}
                        onChange={(e) => setPushNotification(e.target.checked)}
                        className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <span className="text-white text-sm">App Push Notification</span>
                    </label>
                  )}
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
                    onClick={() => handleConfirmChanges(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                  >
                    No, Don't Notify
                  </button>

                  <button
                    onClick={() => handleConfirmChanges(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Yes, Notify {EntityLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAppointmentModalMain;
