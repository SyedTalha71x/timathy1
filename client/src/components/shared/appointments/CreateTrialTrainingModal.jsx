/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Search, X, Clock, ChevronDown, Check, Users } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import AddLeadModal from "../../studio-components/lead-studio-components/add-lead-modal"
import { MemberSpecialNoteIcon } from '../../shared/special-note/shared-special-note-icon';
import DatePickerField from '../../shared/DatePickerField';
import NotifyModalMain from '../NotifyModal';

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
    <div className="flex items-center gap-2 bg-surface-hover border border-border rounded-xl px-2.5 py-1.5">
      {/* Special Note Icon */}
      <MemberSpecialNoteIcon
        member={memberData}
        onEditMember={handleEditNote}
        size="sm"
        position="relative"
      />
      
      {/* Name */}
      <span className="text-content-primary text-sm font-medium">{fullName}</span>
      
      {/* Relations Button - always show, even when locked (for viewing) */}
      <button
        onClick={handleRelationsClick}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded transition-colors"
        title="View Relations"
      >
        <Users size={12} />
        <span>{relationsCount}</span>
      </button>
      
      {/* Remove Button - only show if not locked */}
      {!isLocked && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-0.5 hover:bg-surface-button-hover rounded transition-colors ml-0.5"
        >
          <X className="w-3.5 h-3.5 text-content-muted hover:text-content-primary" />
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
        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover">
        {selectedType ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(selectedType) }} />
            <span className="text-content-primary">{selectedType.name}</span>
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
              <div className="flex-1">
                <div className="text-sm text-content-primary">{type.name}</div>
              </div>
              {value === type.name && <Check size={16} className="text-accent-green" />}
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
  
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [pendingTrialData, setPendingTrialData] = useState(null);

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
      color: "bg-primary", // Blue for trial training
      colorHex: "#3F74FF",
      isTrial: true,
    };

    // Store pending data and show notify modal
    setPendingTrialData(bookingData);
    setShowNotifyModal(true);
  };

  // Actually create the booking after notify decision
  const handleConfirmBooking = (shouldNotify, notificationOptions) => {
    if (pendingTrialData && onSubmit) {
      onSubmit(pendingTrialData);
    }
    
    // Close everything
    setShowNotifyModal(false);
    setPendingTrialData(null);
    onClose();
    
    if (shouldNotify) {
      console.log("Notification requested:", notificationOptions);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content-primary">Book Trial Training</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {/* Lead Selection */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Lead</label>
            <div ref={containerRef} className="relative">
              <div 
                className="bg-surface-dark rounded-xl px-3 py-2.5 min-h-[52px] flex flex-wrap items-center gap-2 cursor-text"
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
                    <Search className="text-content-muted flex-shrink-0" size={16} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="Search leads"
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-content-primary placeholder-content-faint outline-none"
                    />
                  </>
                ) : (
                  <span className="text-content-faint text-sm">No lead selected</span>
                )}
              </div>

              {/* Lead Suggestions Dropdown - only show if not locked */}
              {!isLeadLocked && showLeadSuggestions && filteredLeads.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-[1000] max-h-60 overflow-y-auto">
                  {filteredLeads.map((lead) => {
                    const fullName = `${lead.firstName} ${lead.lastName || lead.surname || ""}`.trim();
                    return (
                      <button
                        key={lead.id}
                        onClick={() => selectLead(lead)}
                        className="w-full text-left p-3 hover:bg-surface-hover flex items-center gap-3 border-b border-border last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-content-primary font-medium">{fullName}</span>
                          {lead.phone && <div className="text-xs text-content-faint mt-0.5">{lead.phone}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* No results / Create new lead - only show if not locked */}
              {!isLeadLocked && isSearchFocused && searchQuery.trim() && filteredLeads.length === 0 && !selectedLead && (
                <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-[1000] p-3">
                  <p className="text-sm text-content-faint text-center mb-2">No leads found</p>
                </div>
              )}
            </div>

            {/* Create New Lead Button - only show if not locked and no lead selected */}
            {!isLeadLocked && !selectedLead && (
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(true)}
                className="mt-2 w-full flex items-center justify-center text-sm gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors"
              >
                <span>+</span> Create New Lead
              </button>
            )}
          </div>

          {/* Trial Training Info */}
          <div className="bg-trial/10 border border-trial/30 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-trial flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-trial">Trial Training</p>
              <p className="text-xs text-content-muted">Duration: {getTrialDuration()} minutes</p>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Appointment Type</label>
            <AppointmentTypeDropdown 
              value={trialData.appointmentType} 
              onChange={(type) => updateTrialData("appointmentType", type)} 
              appointmentTypes={appointmentTypesMain} 
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-content-faint mb-2">Date</label>
              <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                <span className={trialData.date ? "text-content-primary" : "text-content-faint"}>{trialData.date ? (() => { const [y,m,d] = trialData.date.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                <DatePickerField value={trialData.date} onChange={(val) => updateTrialData("date", val)} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-content-faint mb-2">Time Slot</label>
              <div className="relative">
                <select 
                  value={trialData.timeSlot} 
                  onChange={(e) => updateTrialData("timeSlot", e.target.value)}
                  disabled={!trialData.date}
                  className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary appearance-none disabled:opacity-50 focus:outline-none focus:border-primary"
                >
                  <option value="">Select time...</option>
                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot.time}>{slot.time}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none" />
              </div>
              {trialData.date && availableSlots.length === 0 && (
                <p className="text-xs text-accent-yellow mt-1">No available slots for this date</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedLead || !trialData.date || !trialData.timeSlot || !trialData.appointmentType}
            onClick={handleBook} 
            className="flex-1 py-2.5 text-sm font-medium text-white bg-trial hover:bg-trial/80 disabled:bg-surface-button disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Book Trial Training
          </button>
        </div>

        {/* Notify Lead Modal (shared component) */}
        <NotifyModalMain
          isOpen={showNotifyModal && !!pendingTrialData}
          onClose={handleCancelNotify}
          onConfirm={handleConfirmBooking}
          action="book"
          entityType="lead"
          entityName={leadFullName}
          isTrial={true}
          date={pendingTrialData?.date && new Date(pendingTrialData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          time={pendingTrialData?.time || ""}
        />
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
