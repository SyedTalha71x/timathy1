/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Trash } from 'lucide-react';
import { AddLeadModal } from '../components/add-lead-modal';

const TrialTrainingModal = ({ isOpen, onClose, trialTypes = [], freeTimeSlots = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [recurringTrials, setRecurringTrials] = useState([{ 
    date: "", 
    timeSlot: "" 
  }]);
  const [specialNote, setSpecialNote] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [noteDuration, setNoteDuration] = useState({
    startDate: '',
    endDate: ''
  });

  // Load leads from localStorage on mount
  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }
  }, []);

  // Filter leads based on search query
  useEffect(() => {
    const filtered = leads.filter(lead => 
      `${lead.firstName} ${lead.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [searchQuery, leads]);

  // Add another recurring trial slot
  const addRecurring = () => {
    setRecurringTrials([
      ...recurringTrials,
      { date: "", timeSlot: "" }
    ]);
  };

  // Remove a recurring trial slot
  const removeRecurring = (index) => {
    const updated = [...recurringTrials];
    updated.splice(index, 1);
    setRecurringTrials(updated);
  };

  // Update a specific recurring trial
  const updateRecurring = (index, field, value) => {
    const updated = [...recurringTrials];
    updated[index][field] = value;
    setRecurringTrials(updated);
  };

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate || !Array.isArray(freeTimeSlots)) return [];
    return freeTimeSlots.filter(slot => slot && slot.date === selectedDate);
  };

  const handleSaveLead = (newLead) => {
    const newLeadWithId = { ...newLead, id: Date.now() };
    const updatedLeads = [...leads, newLeadWithId];
    
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setIsAddLeadModalOpen(false);
    
    // Automatically set the search query and select the new lead
    setSearchQuery(`${newLead.firstName} ${newLead.surname}`);
    setSelectedLead(newLeadWithId);
    
    // Ensure the filtered leads include the new lead
    setFilteredLeads([newLeadWithId]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    // Update lead with trial training info
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          hasTrialTraining: true,
          trialDetails: recurringTrials.map(trial => ({
            date: trial.date,
            timeSlot: trial.timeSlot,
            specialNote: specialNote,
            isImportant: isImportant,
            noteDuration: noteDuration
          }))
        };
      }
      return lead;
    });

    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    onClose();
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedLead(null);
      setRecurringTrials([{ date: "", timeSlot: "" }]);
      setSpecialNote('');
      setIsImportant(false);
      setNoteDuration({ startDate: '', endDate: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Book Trial Training</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Lead</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lead..."
                  className="w-full bg-[#101010] text-sm rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              {searchQuery && filteredLeads.length > 0 && (
                <div className="mt-2 bg-[#101010] rounded-xl max-h-40 overflow-y-auto">
                  {filteredLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-2 cursor-pointer hover:bg-[#252525] ${selectedLead?.id === lead.id ? 'bg-[#252525]' : ''}`}
                    >
                      <div className="font-medium text-white">{`${lead.firstName} ${lead.surname}`}</div>
                      <div className="text-sm text-white">{lead.email}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {(!searchQuery || filteredLeads.length === 0) && (
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="mt-2 w-full flex items-center justify-center text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90"
                >
                  <Plus size={18} />
                  <span>Create New Lead</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Trial Type</label>
              <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                <option value="">Select type</option>
                {trialTypes.length > 0 ? (
                  trialTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name} ({type.duration} minutes)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="cardio">Cardio (30 minutes)</option>
                    <option value="strength">Strength (45 minutes)</option>
                    <option value="flexibility">Flexibility (60 minutes)</option>
                  </>
                )}
              </select>
            </div>

            {/* Recurring trials section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-200">Trial Dates & Times</label>
                <button 
                  type="button"
                  onClick={addRecurring}
                  className="text-[#3F74FF] hover:text-[#5a8aff] text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Add another date
                </button>
              </div>
              
              {recurringTrials.map((trial, index) => (
                <div key={index} className="p-3 bg-[#101010] rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-200">Trial {index + 1}</span>
                    {recurringTrials.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeRecurring(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Date</label>
                      <input
                        type="date"
                        value={trial.date}
                        onChange={(e) => updateRecurring(index, "date", e.target.value)}
                        className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">Available Time Slots</label>
                      <select 
                        value={trial.timeSlot}
                        onChange={(e) => updateRecurring(index, "timeSlot", e.target.value)}
                        className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                        disabled={!trial.date}
                      >
                        <option value="">Select time slot</option>
                        {getAvailableSlots(trial.date).map((slot) => (
                          <option key={slot.id || `slot-${slot.time}`} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                        {/* Show message if no time slots available */}
                        {trial.date && getAvailableSlots(trial.date).length === 0 && (
                          <option value="" disabled>No available slots for this date</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Special Note</label>
              <textarea
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Enter special note..."
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="rounded text-[#3F74FF] focus:ring-[#3F74FF]"
              />
              <label htmlFor="isImportant" className="text-sm text-gray-200">
                Mark as important
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Note Duration</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={noteDuration.startDate}
                  onChange={(e) => setNoteDuration({...noteDuration, startDate: e.target.value})}
                  placeholder="Start Date"
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <input
                  type="date"
                  value={noteDuration.endDate}
                  onChange={(e) => setNoteDuration({...noteDuration, endDate: e.target.value})}
                  placeholder="End Date"
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedLead || recurringTrials.some(trial => !trial.date || !trial.timeSlot)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Trial{recurringTrials.length > 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <AddLeadModal
        isVisible={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSave={handleSaveLead}
      />
    </div>
  );
};

export default TrialTrainingModal;