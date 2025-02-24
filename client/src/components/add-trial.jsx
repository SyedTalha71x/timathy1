/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { AddLeadModal } from '../components/add-lead-modal';

const TrialTrainingModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    trialType: '',
    dateTime: '',
    slot: ''
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
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [searchQuery, leads]);

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
          trialDetails: {
            type: formData.trialType,
            dateTime: formData.dateTime,
            slot: formData.slot
          }
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
      setFormData({
        trialType: '',
        dateTime: '',
        slot: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Book Trial Training</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Search Lead</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-[#101010] text-sm rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-500"
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
          </div>

          {(!searchQuery || filteredLeads.length === 0) && (
            <button
              type="button"
              onClick={() => setIsAddLeadModalOpen(true)}
              className="w-full flex items-center justify-center text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90"
            >
              <Plus size={18} />
              <span>Create New Lead</span>
            </button>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Trial Type</label>
            <select
              value={formData.trialType}
              onChange={(e) => setFormData({ ...formData, trialType: e.target.value })}
              className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white"
            >
              <option value="">Select type</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedLead || !formData.trialType || !formData.dateTime}
            className="w-full px-4 py-2.5 text-sm bg-[#3F74FF] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Trial Training
          </button>
        </form>
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