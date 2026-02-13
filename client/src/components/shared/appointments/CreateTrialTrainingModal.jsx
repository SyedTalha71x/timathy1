/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Search, X, Clock, ChevronDown, Check, Users } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import AddLeadModal from "../../studio-components/lead-studio-components/add-lead-modal"
import { MemberSpecialNoteIcon } from '../../shared/special-note/shared-special-note-icon';
import DatePickerField from '../../shared/DatePickerField';

// Helper function to extract hex color from various formats
const getColorHex = (type) => {
  if (!type) return "#808080";
  if (type.colorHex) return type.colorHex;
  if (type.color?.startsWith("#")) return type.color;
  const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
  if (match) return match[0];
  return "#808080";
};

// Lead Tag Component - Shows selected lead with special note icon and relations
const LeadTag = ({ lead, onRemove, onOpenEditLeadModal, relationsCount = 0, isLocked = false }) => {
  const handleEditNote = (memberData, tab) => {
    // For leads, pass the lead ID to onOpenEditLeadModal
    if (onOpenEditLeadModal) {
      onOpenEditLeadModal(lead.id, tab || "note");
    }
  };

  const handleRelationsClick = (e) => {
    e.stopPropagation();
    if (onOpenEditLeadModal) {
      onOpenEditLeadModal(lead.id, "relations");
    }
  };

  // Create member-compatible object for MemberSpecialNoteIcon
  const memberData = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName || lead.surname || "",
    name: `${lead.firstName} ${lead.lastName || lead.surname || ""}`.trim(),
    note: lead.note || "",
    noteImportance: lead.noteImportance || "unimportant",
    noteStartDate: lead.noteStartDate || "",
    noteEndDate: lead.noteEndDate || "",
  };

  const fullName = `${lead.firstName} ${lead.lastName || lead.surname || ""}`.trim();

  return (
    <div className="flex items-center gap-2 bg-[#2a2a2a] border border-gray-700 rounded-xl px-2.5 py-1.5">
      {/* Special Note Icon */}
      <MemberSpecialNoteIcon
        member={memberData}
        onEditMember={handleEditNote}
        size="sm"
        position="relative"
      />
      
      {/* Name */}
      <span className="text-white text-sm font-medium">{fullName}</span>
      
      {/* Relations Button - always show, even when locked (for viewing) */}
      <button
        onClick={handleRelationsClick}
        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-1.5 py-0.5 rounded transition-colors"
        title="View Relations"
      >
        <Users size={12} />
        <span>{relationsCount}</span>
      </button>
      
      {/* Remove Button - only show if not locked */}
      {!isLocked && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-0.5 hover:bg-gray-600 rounded transition-colors ml-0.5"
        >
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  );
};

// Appointment Type Dropdown (same as CreateAppointmentModal/EditAppointmentModal)
const AppointmentTypeDropdown = ({ value, onChange, appointmentTypes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Filter out trial types - only show regular appointment types
  const filteredTypes = appointmentTypes.filter(t => !t.isTrialType);
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
        className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#2a2a2a]">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-white">{selectedType.name}</span>
          </div>
        ) : <span className="text-gray-500">Select type...</span>}
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[1000] max-h-64 overflow-y-auto">
          {filteredTypes.map((type) => (
            <button key={type.name} onClick={() => { onChange(type.name); setIsOpen(false); }}
              className={`w-full text-left p-3 flex items-center gap-3 ${value === type.name ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColorHex(type) }} />
              <div className="flex-1">
                <div className="text-sm text-white">{type.name}</div>
              </div>
              {value === type.name && <Check size={16} className="text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TrialTrainingModal = ({
  isOpen,
  onClose,
  // Props from appointments.jsx - same pattern as CreateAppointmentModal/EditAppointmentModal
  appointmentTypesMain = [],
  freeAppointmentsMain = [],
  leadsData = [],
  leadRelations = {},
  onOpenEditLeadModal,
  onSubmit,
  selectedDate = null,
  selectedTime = null,
  // NEW: Locked lead prop - when provided, the lead cannot be changed and no create lead button is shown
  lockedLead = null,
}) => {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(lockedLead || null);
  const [showLeadSuggestions, setShowLeadSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  
  // Internal NotifyModal state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingTrialData, setPendingTrialData] = useState(null);
  const [emailNotification, setEmailNotification] = useState(true);

  const [trialData, setTrialData] = useState({
    date: initialDate,
    timeSlot: initialTime,
    appointmentType: "",
  });

  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  // Determine if lead selection is locked
  const isLeadLocked = !!lockedLead;

  // Update trialData when modal opens with new selectedDate or selectedTime
  useEffect(() => {
    if (!isOpen) return;
    
    const newDate = getFormattedDate(selectedDate);
    const newTime = getInitialTime(selectedTime);
    
    setTrialData(prev => ({
      ...prev,
      date: newDate || prev.date,
      timeSlot: newTime || "",
      appointmentType: "",
    }));
    
    // Set locked lead when modal opens
    if (lockedLead) {
      setSelectedLead(lockedLead);
    } else {
      // Reset selection when modal opens (only if not locked)
      setSelectedLead(null);
    }
    setSearchQuery("");
  }, [isOpen, selectedDate, selectedTime, lockedLead]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowLeadSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter leads based on search query - same pattern as appointments.jsx
  const getFilteredLeads = () => {
    if (!searchQuery.trim() || isLeadLocked) return [];
    
    return leadsData.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName || lead.surname || ""}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query);
    }).slice(0, 8); // Limit to 8 results
  };

  // Show suggestions when there's a query and input is focused
  useEffect(() => {
    if (isLeadLocked) {
      setShowLeadSuggestions(false);
      return;
    }
    const filtered = getFilteredLeads();
    if (isSearchFocused && searchQuery.trim() && filtered.length > 0 && !selectedLead) {
      setShowLeadSuggestions(true);
    } else {
      setShowLeadSuggestions(false);
    }
  }, [searchQuery, isSearchFocused, selectedLead, isLeadLocked]);

  const updateTrialData = (field, value) => {
    setTrialData(prev => ({ ...prev, [field]: value }));
  };

  const selectLead = (lead) => {
    if (isLeadLocked) return; // Cannot change lead if locked
    setSelectedLead(lead);
    setSearchQuery("");
    setShowLeadSuggestions(false);
  };

  const removeLead = () => {
    if (isLeadLocked) return; // Cannot remove lead if locked
    setSelectedLead(null);
    setSearchQuery("");
  };

  // Get available time slots - same pattern as CreateAppointmentModal/EditAppointmentModal
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate || !Array.isArray(freeAppointmentsMain)) return [];
    return freeAppointmentsMain.filter((slot) => slot && slot.date === selectedDate);
  };

  // Get relations count for a lead
  const getRelationsCount = (leadId) => {
    const relations = leadRelations[leadId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => 
      total + (Array.isArray(categoryRelations) ? categoryRelations.length : 0), 0);
  };

  // Handle new lead creation
  const handleSaveLead = (newLead) => {
    const newLeadWithId = { ...newLead, id: Date.now() };
    setIsAddLeadModalOpen(false);
    // Select the new lead
    setSelectedLead(newLeadWithId);
    setSearchQuery("");
  };

  // Prepare booking but show notify modal first
  const handleBook = () => {
    if (!selectedLead) {
      alert("Please select a lead.");
      return;
    }

    // Get trial training duration from appointmentTypesMain
    const trialType = appointmentTypesMain.find(t => t.isTrialType || t.name === "Trial Training");
    const duration = trialType?.duration || 60;

    // Calculate end time
    const [hours, minutes] = trialData.timeSlot.split(':').map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + duration);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    // Get selected appointment type details
    const selectedType = appointmentTypesMain.find(t => t.name === trialData.appointmentType);

    const bookingData = {
      leadId: selectedLead.id,
      name: selectedLead.firstName,
      lastName: selectedLead.lastName || selectedLead.surname || "",
      type: "Trial Training",
      trialType: trialData.appointmentType, // The selected appointment type (EMS Strength, etc.)
      date: trialData.date,
      startTime: trialData.timeSlot,
      endTime: endTime,
      time: `${trialData.timeSlot} - ${endTime}`,
      color: "bg-[#3F74FF]", // Blue for trial training
      colorHex: "#3F74FF",
      isTrial: true,
    };

    // Store pending data and show notify modal
    setPendingTrialData(bookingData);
    setShowNotifyModal(true);
  };

  // Actually create the booking after notify decision
  const handleConfirmBooking = (shouldNotify) => {
    if (pendingTrialData && onSubmit) {
      onSubmit(pendingTrialData);
    }
    
    // Close everything
    setShowNotifyModal(false);
    setPendingTrialData(null);
    onClose();
    
    if (shouldNotify) {
      console.log("Notification requested:", { email: emailNotification });
    }
  };

  // Cancel from notify modal - go back to form
  const handleCancelNotify = () => {
    setShowNotifyModal(false);
    setPendingTrialData(null);
  };

  // Get trial duration for display
  const getTrialDuration = () => {
    const trialType = appointmentTypesMain.find(t => t.isTrialType || t.name === "Trial Training");
    return trialType?.duration || 60;
  };

  if (!isOpen) return null;

  const availableSlots = getAvailableSlots(trialData.date);
  const filteredLeads = getFilteredLeads();
  const leadFullName = selectedLead 
    ? `${selectedLead.firstName} ${selectedLead.lastName || selectedLead.surname || ""}`.trim()
    : "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000] p-4" onClick={onClose}>
      <div className="bg-[#181818] w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Book Trial Training</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {/* Lead Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lead</label>
            <div ref={containerRef} className="relative">
              <div 
                className="bg-[#222222] rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2 cursor-text"
                onClick={() => !selectedLead && !isLeadLocked && searchInputRef.current?.focus()}
              >
                {selectedLead ? (
                  <LeadTag 
                    lead={selectedLead} 
                    onRemove={removeLead}
                    onOpenEditLeadModal={onOpenEditLeadModal}
                    relationsCount={getRelationsCount(selectedLead.id)}
                    isLocked={isLeadLocked}
                  />
                ) : !isLeadLocked ? (
                  <>
                    <Search className="text-gray-400 flex-shrink-0" size={16} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="Search leads"
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                    />
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">No lead selected</span>
                )}
              </div>

              {/* Lead Suggestions Dropdown - only show if not locked */}
              {!isLeadLocked && showLeadSuggestions && filteredLeads.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[1000] max-h-60 overflow-y-auto">
                  {filteredLeads.map((lead) => {
                    const fullName = `${lead.firstName} ${lead.lastName || lead.surname || ""}`.trim();
                    return (
                      <button
                        key={lead.id}
                        onClick={() => selectLead(lead)}
                        className="w-full text-left p-3 hover:bg-[#2a2a2a] flex items-center gap-3 border-b border-gray-800 last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-white font-medium">{fullName}</span>
                          {lead.phone && <div className="text-xs text-gray-500 mt-0.5">{lead.phone}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* No results / Create new lead - only show if not locked */}
              {!isLeadLocked && isSearchFocused && searchQuery.trim() && filteredLeads.length === 0 && !selectedLead && (
                <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-[1000] p-3">
                  <p className="text-sm text-gray-500 text-center mb-2">No leads found</p>
                </div>
              )}
            </div>

            {/* Create New Lead Button - only show if not locked and no lead selected */}
            {!isLeadLocked && !selectedLead && (
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(true)}
                className="mt-2 w-full flex items-center justify-center text-sm gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
              >
                <span>+</span> Create New Lead
              </button>
            )}
          </div>

          {/* Trial Training Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3F74FF] flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Trial Training</p>
              <p className="text-xs text-gray-400">Duration: {getTrialDuration()} minutes</p>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Type</label>
            <AppointmentTypeDropdown 
              value={trialData.appointmentType} 
              onChange={(type) => updateTrialData("appointmentType", type)} 
              appointmentTypes={appointmentTypesMain} 
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Date</label>
              <div className="w-full flex items-center justify-between bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5">
                <span className={trialData.date ? "text-white" : "text-gray-500"}>{trialData.date ? (() => { const [y,m,d] = trialData.date.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                <DatePickerField value={trialData.date} onChange={(val) => updateTrialData("date", val)} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Time Slot</label>
              <div className="relative">
                <select 
                  value={trialData.timeSlot} 
                  onChange={(e) => updateTrialData("timeSlot", e.target.value)}
                  disabled={!trialData.date}
                  className="w-full bg-[#222222] border border-gray-700 text-sm rounded-xl px-4 py-2.5 text-white appearance-none disabled:opacity-50 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">Select time...</option>
                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot.time}>{slot.time}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              {trialData.date && availableSlots.length === 0 && (
                <p className="text-xs text-amber-400 mt-1">No available slots for this date</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedLead || !trialData.date || !trialData.timeSlot || !trialData.appointmentType}
            onClick={handleBook} 
            className="flex-1 py-2.5 text-sm font-medium text-white bg-[#3F74FF] hover:bg-[#3F74FF]/90 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Book Trial Training
          </button>
        </div>

        {/* Integrated Notify Lead Modal */}
        {showNotifyModal && pendingTrialData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000001] p-4" onClick={handleCancelNotify}>
            <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify Lead</h2>
                <button onClick={handleCancelNotify} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-white text-sm">
                  New <span className="font-semibold text-blue-400">Trial Training</span> for{" "}
                  <span className="font-semibold text-blue-400">{leadFullName}</span> on{" "}
                  <span className="font-semibold text-blue-400">
                    {pendingTrialData.date && new Date(pendingTrialData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                    })}
                  </span> at{" "}
                  <span className="font-semibold text-blue-400">{pendingTrialData.time}</span>.
                  <br /><br />
                  Do you want to notify the lead about this booking?
                </p>

                {/* Notification Options - Only Email for Leads */}
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotification}
                      onChange={(e) => setEmailNotification(e.target.checked)}
                      className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-white text-sm">Email Notification</span>
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
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                  >
                    Yes, Notify Lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal - only render if not locked */}
      {!isLeadLocked && (
        <AddLeadModal
          isVisible={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
};

export default TrialTrainingModal;
