/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { X, Clock, User, ChevronDown, Trash2, AlertTriangle, Check, Users } from "lucide-react";
import { MemberSpecialNoteIcon } from '../../shared/shared-special-note-icon';

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
const InitialsAvatar = ({ name, size = 32, className = "" }) => {
  const getInitials = () => {
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
const AppointmentTypeDropdown = ({ 
  value, 
  onChange, 
  appointmentTypes = [],
  showTrialTypes = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter out trial types unless explicitly requested
  const filteredTypes = showTrialTypes 
    ? appointmentTypes 
    : appointmentTypes.filter(t => !t.isTrialType);

  const selectedType = filteredTypes.find(t => t.name === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#2a2a2a] transition-colors"
      >
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getColorHex(selectedType) }}
            />
            <span className="text-white">{selectedType.name}</span>
            <span className="text-gray-500 text-xs">({selectedType.duration} min)</span>
          </div>
        ) : (
          <span className="text-gray-500">Select type...</span>
        )}
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => {
                onChange(type.name);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                value === type.name ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: getColorHex(type) }}
              />
              <div className="flex-1">
                <div className="text-sm text-white">{type.name}</div>
                <div className="text-xs text-gray-500">{type.duration} min</div>
              </div>
              {value === type.name && (
                <Check size={16} className="text-green-500" />
              )}
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
  onOpenEditMemberModal, // Callback to open EditMemberModal with specific tab
  memberRelations = {}, // Relations data for members
}) => {
  if (!selectedAppointmentMain) return null;

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  const [recurringOptions, setRecurringOptions] = useState({
    frequency: "weekly",
    dayOfWeek: "1",
    startDate: selectedAppointmentMain.date || "",
    occurrences: 5,
  });

  useEffect(() => {
    if (selectedAppointmentMain && selectedAppointmentMain.recurring) {
      setShowRecurringOptions(true);
      setRecurringOptions({
        ...recurringOptions,
        ...selectedAppointmentMain.recurring,
      });
    } else {
      setShowRecurringOptions(false);
    }
  }, [selectedAppointmentMain]);

  const updateRecurringOptions = (field, value) => {
    setRecurringOptions({ ...recurringOptions, [field]: value });
    handleAppointmentChange({
      recurring: { ...recurringOptions, [field]: value },
    });
  };

  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate) return [];
    const slots = freeAppointmentsMain.filter((app) => app.date === selectedDate);
    if (selectedDate === selectedAppointmentMain.date) {
      const existingTime = {
        id: "current",
        time: selectedAppointmentMain.time,
        date: selectedAppointmentMain.date,
      };
      const timeExists = slots.some((slot) => slot.time === existingTime.time);
      if (!timeExists) slots.push(existingTime);
    }
    return slots;
  };

  const toggleBookingType = (isRecurring) => {
    setShowRecurringOptions(isRecurring);
    handleAppointmentChange({ recurring: isRecurring ? recurringOptions : null });
  };

  const checkAvailability = () => {
    const isAvailable = Math.random() > 0.5;
    if (!isAvailable) {
      const alternatives = generateAlternativeSlots(
        selectedAppointmentMain.date,
        selectedAppointmentMain.time
      );
      setAlternativeSlots(alternatives);
      setShowAlternatives(true);
    } else {
      saveChanges();
    }
  };

  const generateAlternativeSlots = (date, time) => {
    const baseDate = new Date(date);
    const alternatives = [];
    const timeOptions = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
    timeOptions.forEach((t) => {
      if (t !== time) alternatives.push({ date, time: t, available: true });
    });
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);
      alternatives.push({
        date: nextDay.toISOString().split("T")[0],
        time,
        available: true,
      });
    }
    return alternatives;
  };

  const selectAlternative = (alt) => {
    handleAppointmentChange({ date: alt.date, time: alt.time });
    setShowAlternatives(false);
  };

  const saveChanges = () => {
    const updatedAppointments = appointmentsMain.map((app) =>
      app.id === selectedAppointmentMain.id ? selectedAppointmentMain : app
    );
    setAppointmentsMain(updatedAppointments);
    setIsNotifyMemberOpenMain(true);
    setNotifyActionMain("change");
    setSelectedAppointmentMain(null);
  };

  // Create a member object from the appointment for the special note icon
  const getMemberFromAppointment = () => {
    const nameParts = (selectedAppointmentMain.name || "").split(" ");
    return {
      id: selectedAppointmentMain.memberId || selectedAppointmentMain.id,
      name: selectedAppointmentMain.name,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      image: selectedAppointmentMain.memberImage || null,
      // Include notes data if available
      notes: selectedAppointmentMain.memberNotes || [],
      note: selectedAppointmentMain.memberNote || "",
      noteImportance: selectedAppointmentMain.memberNoteImportance || "unimportant",
      noteStartDate: selectedAppointmentMain.memberNoteStartDate || "",
      noteEndDate: selectedAppointmentMain.memberNoteEndDate || "",
      noteStatus: selectedAppointmentMain.memberNoteStatus || "general",
    };
  };

  // Get relations count for a member
  const getRelationsCount = (memberId) => {
    const relations = memberRelations[memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  // Handle opening Note Modal (without closing this modal)
  const handleEditMemberNote = (member, tab) => {
    if (onOpenEditMemberModal) {
      onOpenEditMemberModal(member, tab || "note");
    }
  };

  // Handle relations click - open EditMemberModal with relations tab
  const handleRelationsClick = (e) => {
    e.stopPropagation();
    if (onOpenEditMemberModal) {
      onOpenEditMemberModal(memberData, "relations");
    }
  };

  const memberData = getMemberFromAppointment();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000] p-4"
      onClick={() => setSelectedAppointmentMain(null)}
    >
      <div
        className="bg-[#181818] w-full max-w-lg rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit Appointment</h2>
            <button
              onClick={() => setSelectedAppointmentMain(null)}
              className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-5">
          {/* Member (as Tag) - Larger with Special Note Icon and Relations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              Member
            </label>
            <div className="bg-[#222222] rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-[#2a2a2a] border border-gray-700 rounded-xl px-2.5 py-1.5">
                {/* Special Note Icon - opens EditMemberModal with note tab */}
                <MemberSpecialNoteIcon
                  member={memberData}
                  onEditMember={handleEditMemberNote}
                  size="sm"
                  position="relative"
                />
                
                {/* Avatar */}
                {selectedAppointmentMain.memberImage ? (
                  <img 
                    src={selectedAppointmentMain.memberImage} 
                    alt="" 
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <InitialsAvatar name={selectedAppointmentMain.name} size={28} />
                )}
                
                {/* Name */}
                <span className="text-white text-sm font-medium">
                  {selectedAppointmentMain.name}
                </span>

                {/* Relations Button */}
                <button
                  onClick={handleRelationsClick}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-1.5 py-0.5 rounded transition-colors"
                  title="View Relations"
                >
                  <Users size={12} />
                  <span>{getRelationsCount(memberData.id)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appointment Type
            </label>
            <AppointmentTypeDropdown
              value={selectedAppointmentMain.type}
              onChange={(type) => handleAppointmentChange({ type })}
              appointmentTypes={appointmentTypesMain}
            />
          </div>

          {/* Booking Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Booking Type
            </label>
            <div className="flex bg-[#222222] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => toggleBookingType(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !showRecurringOptions
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Single
              </button>
              <button
                type="button"
                onClick={() => toggleBookingType(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showRecurringOptions
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Recurring
              </button>
            </div>
          </div>

          {/* Single Booking Options */}
          {!showRecurringOptions && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedAppointmentMain.date || ""}
                  onChange={(e) => handleAppointmentChange({ date: e.target.value })}
                  className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 transition-colors white-calendar-icon"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Time Slot</label>
                <div className="relative">
                  <select
                    value={selectedAppointmentMain.time || ""}
                    onChange={(e) => handleAppointmentChange({ time: e.target.value })}
                    className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-orange-500/50 transition-colors"
                  >
                    {getAvailableSlots(selectedAppointmentMain.date).map((slot, idx) => (
                      <option key={idx} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Recurring Options */}
          {showRecurringOptions && (
            <div className="space-y-4 bg-[#222222] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Frequency</label>
                  <select
                    value={recurringOptions.frequency}
                    onChange={(e) => updateRecurringOptions("frequency", e.target.value)}
                    className="w-full bg-[#181818] border border-gray-700 text-sm rounded-xl px-3 py-2.5 text-white appearance-none focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Day</label>
                  <select
                    value={recurringOptions.dayOfWeek}
                    onChange={(e) => updateRecurringOptions("dayOfWeek", e.target.value)}
                    className="w-full bg-[#181818] border border-gray-700 text-sm rounded-xl px-3 py-2.5 text-white appearance-none focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={recurringOptions.startDate}
                    onChange={(e) => updateRecurringOptions("startDate", e.target.value)}
                    className="w-full bg-[#181818] border border-gray-700 text-sm rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500/50 white-calendar-icon"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Occurrences</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={recurringOptions.occurrences}
                    onChange={(e) => updateRecurringOptions("occurrences", parseInt(e.target.value) || 1)}
                    className="w-full bg-[#181818] border border-gray-700 text-sm rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alternative Slots Warning */}
          {showAlternatives && alternativeSlots.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-400 mb-2">
                    Selected time unavailable
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Choose an alternative:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {alternativeSlots.slice(0, 4).map((alt, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectAlternative(alt)}
                        className="text-left px-3 py-2 bg-[#181818] hover:bg-[#222222] rounded-lg text-xs transition-colors"
                      >
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
          <button
            onClick={() => setIsDeleteConfirm(true)}
            className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 size={14} className="inline mr-2" />
            Delete
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setSelectedAppointmentMain(null)}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={checkAvailability}
            className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
          >
            {showRecurringOptions ? "Save Series" : "Save Changes"}
          </button>
        </div>

        {/* Delete Confirmation Modal - higher z-index than parent */}
        {isDeleteConfirm && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000002] p-4"
            onClick={() => setIsDeleteConfirm(false)}
          >
            <div 
              className="bg-[#181818] w-full max-w-sm rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white text-center mb-2">
                  Delete Appointment?
                </h3>
                <p className="text-sm text-gray-400 text-center mb-6">
                  This will permanently delete the appointment with{" "}
                  <span className="text-white">{selectedAppointmentMain.name}</span>.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteConfirm(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteConfirm(false);
                      setSelectedAppointmentMain(null);
                      if (onDelete) {
                        onDelete(selectedAppointmentMain.id);
                      }
                    }}
                    className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                  >
                    Delete
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
