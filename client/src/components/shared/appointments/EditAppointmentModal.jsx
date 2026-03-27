/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { X, Clock, User, ChevronDown, AlertTriangle, Check, Users } from "lucide-react";
import { MemberSpecialNoteIcon } from '../special-note/shared-special-note-icon';
import DatePickerField from '../DatePickerField';
import NotifyModalMain from '../NotifyModal';
import { updateAppointmentThunk } from "../../../features/appointments/AppointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { canceledAppointment } from "../../../features/appointments/AppointmentApi";
import { fetchAllMember } from "../../../features/member/memberSlice";

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
      className={`bg-primary rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
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
        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover transition-colors">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-content-primary">{selectedType.name}</span>
            {!hideDuration && <span className="text-content-faint text-xs">({selectedType.duration} min)</span>}
          </div>
        ) : <span className="text-content-faint">Select type...</span>}
        <ChevronDown size={14} className={`text-content-faint transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-[1000] max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button key={type.name} onClick={() => { onChange(type.name); setIsOpen(false); }}
              className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${value === type.name ? 'bg-surface-hover' : 'hover:bg-surface-hover'}`}>
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: getColorHex(type) }} />
              <div className="flex-1">
                <div className="text-sm text-content-primary">{type.name}</div>
                {!hideDuration && <div className="text-xs text-content-faint">{type.duration} min</div>}
              </div>
              {value === type.name && <Check size={16} className="text-accent-green" />}
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
  const dispatch = useDispatch()
  const { members } = useSelector((state) => state.member || [])

  useEffect(() => {
    dispatch(fetchAllMember())
  }, [dispatch])

  // Parse date from appointment format to YYYY-MM-DD for date input
  const parsedDate = parseDateFromAppointment(selectedAppointmentMain.date);

  // FIX: Safely get timeSlot with proper defaults
  const currentTimeSlot = selectedAppointmentMain.timeSlot?.start
    ? {
      start: selectedAppointmentMain.timeSlot.start,
      end: selectedAppointmentMain.timeSlot.end || ''
    }
    : { start: '09:00', end: '' };

  // Check if this is a lead for initial state setup
  const isLeadInit = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;

  // Store original values for change detection
  const originalType = isLeadInit
    ? (selectedAppointmentMain.trialType || selectedAppointmentMain.type)
    : selectedAppointmentMain.type;

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);

  // Internal NotifyModal state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [notifyAction, setNotifyAction] = useState("change");

  // Local state for editing
  const [editDate, setEditDate] = useState(parsedDate);
  const [editTime, setEditTime] = useState(currentTimeSlot);
  const [editType, setEditType] = useState(originalType);

  // Track original values for change detection
  const [originalDate, setOriginalDate] = useState(parsedDate);
  const [originalTime, setOriginalTime] = useState(currentTimeSlot);

  // Update local state when appointment changes
  useEffect(() => {
    const newParsedDate = parseDateFromAppointment(selectedAppointmentMain.date);

    // FIX: Handle both object and string for timeSlot
    let newTime;
    if (selectedAppointmentMain.timeSlot && typeof selectedAppointmentMain.timeSlot === 'object') {
      newTime = {
        start: selectedAppointmentMain.timeSlot.start || '09:00',
        end: selectedAppointmentMain.timeSlot.end || ''
      };
    } else {
      newTime = { start: selectedAppointmentMain.startTime || selectedAppointmentMain.time || '09:00', end: '' };
    }

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
    JSON.stringify(editTime) !== JSON.stringify(originalTime) ||
    editType !== originalType;

  // Convert 24h -> AM/PM
  const formatAMPM = (time24) => {
    if (!time24) return '';
    const [hour, min] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${ampm}`;
  };

  // Generate slots
  const generateSlots = (blocks) => {
    if (!Array.isArray(blocks)) {
      blocks = [
        { start: "09:00", end: "12:00", duration: 60 },
        { start: "13:00", end: "16:00", duration: 60 },
        { start: "17:00", end: "20:00", duration: 60 }
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
          time: `${formatAMPM(startTime)} - ${formatAMPM(endTime)}`
        });

        hour = tempHour;
        min = tempMin;
      }
    });

    return allSlots;
  };

  const availableSlots = generateSlots();

  const checkAvailability = () => {
    const isAvailable = Math.random() > 0.5;
    if (!isAvailable) {
      const timeString = typeof editTime === 'object' ? editTime.start : editTime;
      const alternatives = generateAlternativeSlots(editDate, timeString);
      setAlternativeSlots(alternatives);
      setShowAlternatives(true);
    } else {
      saveChanges();
    }
  };

  const generateAlternativeSlots = (date, time) => {
    const baseDate = new Date(date);
    const alternatives = [];
    const duration = 60;

    const timeOptions = ["09:00", "11:30", "14:00", "16:30"];
    timeOptions.forEach((startTime) => {
      if (startTime !== time) {
        const [hours, minutes] = startTime.split(":").map(Number);
        const endDate = new Date(2000, 0, 1, hours, minutes + duration);
        const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

        alternatives.push({
          date,
          timeSlot: {
            start: startTime,
            end: endTime
          },
          time: `${startTime} - ${endTime}`,
          available: true
        });
      }
    });

    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);

      alternatives.push({
        date: nextDay.toISOString().split("T")[0],
        timeSlot: {
          start: time,
          end: (() => {
            const [h, m] = time.split(":").map(Number);
            const d = new Date(2000, 0, 1, h, m + duration);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          })()
        },
        time: `${time} - ${(() => {
          const [h, m] = time.split(":").map(Number);
          const d = new Date(2000, 0, 1, h, m + duration);
          return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        })()}`,
        available: true
      });
    }

    return alternatives;
  };

  const selectAlternative = (alt) => {
    setEditDate(alt.date);
    setEditTime(alt.timeSlot);
    setShowAlternatives(false);
  };

  const saveChanges = () => {
    // Check if this is a lead (trial training with leadId)
    const isLeadAppointment = selectedAppointmentMain.isTrial && selectedAppointmentMain.leadId;

    // Calculate end time based on appointment type duration
    const selectedType = appointmentTypesMain.find(t => t.name === editType);
    const trialTrainingType = appointmentTypesMain.find(t => t.isTrialType || t.name === "Trial Training");
    const duration = isLeadAppointment
      ? (trialTrainingType?.duration || 60)
      : (selectedType?.duration || 30);

    // FIX: Get start time from editTime object properly
    let startTime = editTime.start;
    let endTime = editTime.end;

    // Calculate end time if not provided
    if (!endTime && startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endDate = new Date(2000, 0, 1, hours, minutes + duration);
      endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    }

    const updatedAppointment = {
      ...selectedAppointmentMain,
      type: isLeadAppointment ? selectedAppointmentMain.type : editType,
      trialType: isLeadAppointment ? editType : selectedAppointmentMain.trialType,
      color: isLeadAppointment ? selectedAppointmentMain.color : (selectedType?.color || selectedAppointmentMain.color),
      colorHex: isLeadAppointment ? selectedAppointmentMain.colorHex : (getColorHex(selectedType) || selectedAppointmentMain.colorHex),
      date: editDate,
      timeSlotId: {
        start: startTime,
        end: endTime,
        duration: duration,
        isBlocked: selectedAppointmentMain.timeSlot?.isBlocked || false
      }
    };

    // Store pending changes and show notify modal
    setPendingChanges(updatedAppointment);
    setShowNotifyModal(true);
  };

  // Actually apply the changes after notify decision
  const handleConfirmChanges = (shouldNotify, notificationOptions) => {
    if (notifyAction === "cancel") {
      // Cancel appointment - dispatch to backend
      dispatch(updateAppointmentThunk({
        appointmentId: selectedAppointmentMain._id,
        updateData: { status: "cancelled", isCancelled: true }
      }));
    } else if (pendingChanges) {
      // Update the single appointment
      dispatch(updateAppointmentThunk({
        appointmentId: pendingChanges._id,
        updateData: pendingChanges
      }));

      console.log("update Data", pendingChanges);
    }

    // Close modals and reset local state
    setShowNotifyModal(false);
    setPendingChanges(null);
    setNotifyAction("change");
    handleClose();

    if (shouldNotify) {
      console.log(`Notification requested for ${notifyAction}:`, notificationOptions);
    }
  };

  // Cancel from notify modal - go back to edit form
  const handleCancelNotify = () => {
    setShowNotifyModal(false);
    setPendingChanges(null);
    setNotifyAction("change");
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
        ? `${selectedAppointmentMain.firstName} ${selectedAppointmentMain.lastName}`
        : selectedAppointmentMain.firstName,
      firstName: firstName,
      lastName: lastName,
      image: selectedAppointmentMain.img || null,
      note: selectedAppointmentMain.specialNote?.text || "",
      noteImportance: selectedAppointmentMain.specialNote?.isImportant ? "important" : "unimportant",
      noteStartDate: selectedAppointmentMain.specialNote?.valid.from || "",
      noteEndDate: selectedAppointmentMain.specialNote?.valid.until || "",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4" onClick={handleClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-content-primary">Edit Appointment</h2>
            <button onClick={handleClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-5">
          {/* Member Tag with Special Note Icon and Relations */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 flex items-center gap-2">
              <User size={14} className="text-content-faint" />
              {isLead ? "Lead" : "Member"}
            </label>
            <div className="bg-surface-dark rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-surface-hover border border-border rounded-xl px-2.5 py-1.5">
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
                <span className="text-content-primary text-sm font-medium">{fullName}</span>

                {/* Relations Button - for both members and leads */}
                <button onClick={handleRelationsClick}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded transition-colors"
                  title="View Relations">
                  <Users size={12} />
                  <span>{getRelationsCount(memberData.id)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trial Training Info - only for leads */}
          {isLead && (
            <div className="bg-trial/10 border border-trial/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-trial flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-trial">Trial Training</p>
                <p className="text-xs text-content-muted">Duration: 60 minutes</p>
              </div>
            </div>
          )}

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Appointment Type</label>
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
              <label className="block text-xs text-content-faint mb-2">Date</label>
              <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                <span className={editDate ? "text-content-primary" : "text-content-faint"}>{editDate ? (() => { const [y, m, d] = editDate.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                <DatePickerField value={editDate} onChange={setEditDate} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-content-faint mb-2">Time Slot</label>
              <div className="relative">
                <select
                  value={editTime.start}
                  onChange={(e) => {
                    const start = e.target.value;
                    const slot = availableSlots.find(s => s.start === start);
                    setEditTime({ start, end: slot?.end || "" });
                  }}

                  className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5"
                >
                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot.start}>
                      {slot.time}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Alternative Slots Warning */}
          {showAlternatives && alternativeSlots.length > 0 && (
            <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-accent-yellow mb-2">Selected time unavailable</p>
                  <p className="text-xs text-content-muted mb-3">Choose an alternative:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {alternativeSlots.slice(0, 4).map((alt, idx) => (
                      <button key={idx} onClick={() => selectAlternative(alt)}
                        className="text-left px-3 py-2 bg-surface-card hover:bg-surface-dark rounded-lg text-xs transition-colors">
                        <div className="text-content-primary">{alt.time}</div>
                        <div className="text-content-faint">{alt.date}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={() => { setNotifyAction("cancel"); setShowNotifyModal(true); }}
            className="px-4 py-2.5 text-sm font-medium text-accent-red hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-colors">
            Cancel Appointment
          </button>
          <div className="flex-1" />
          <button onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors">
            Close
          </button>
          <button
            onClick={checkAvailability}
            disabled={!hasChanges}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${hasChanges
              ? "text-white bg-primary hover:bg-primary-hover"
              : "text-content-faint bg-surface-button cursor-not-allowed"
              }`}>
            Save Changes
          </button>
        </div>

        {/* Notify Member/Lead Modal (shared component) */}
        <NotifyModalMain
          isOpen={showNotifyModal && (notifyAction === "cancel" || !!pendingChanges)}
          onClose={handleCancelNotify}
          onConfirm={handleConfirmChanges}
          action={notifyAction}
          entityType={isLead ? "lead" : "member"}
          entityName={fullName}
          appointmentType={appointmentTypeDisplay}
          isTrial={!!isLead}
          date={
            notifyAction === "cancel"
              ? selectedAppointmentMain.date && new Date(parseDateFromAppointment(selectedAppointmentMain.date)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              : pendingChanges?.date && new Date(parseDateFromAppointment(pendingChanges.date)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          }
          time={
            notifyAction === "cancel"
              ? (selectedAppointmentMain.time || `${selectedAppointmentMain.startTime} - ${selectedAppointmentMain.endTime}`)
              : (pendingChanges?.time || "")
          }
        />
      </div>
    </div>
  );
};

export default EditAppointmentModalMain;
