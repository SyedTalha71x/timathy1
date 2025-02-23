/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import AddPartiesModal from './add-lead-modal'
import toast, { Toaster } from 'react-hot-toast';

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
      setFilteredLeads(JSON.parse(storedLeads));
    }
  }, []);

  // Filter leads based on search query
  useEffect(() => {
    if (leads.length) {
      const filtered = leads.filter(lead => 
        `${lead.firstName} ${lead.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  const handleSaveLead = (newLead) => {
    const leadWithId = { ...newLead, id: Date.now(), hasTrialTraining: false };
    const updatedLeads = [...leads, leadWithId];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setSelectedLead(leadWithId);
    setIsAddLeadModalOpen(false);
    toast.success('Lead has been created');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLead || !formData.trialType || !formData.dateTime) {
      toast.error('Please fill in all required fields');
      return;
    }

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
    toast.success('Trial training has been booked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <div className="fixed inset-0 z-[100]">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md bg-[#1C1C1C] rounded-xl shadow-xl p-6">
            <h1 className="font-bold text-lg">Book Trial Training</h1>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-200 hover:text-white"
            >
              <X className="h-8 w-8" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4 custom-scrollbar mt-10 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <label className="block text-sm text-gray-200 mb-1">Search Lead</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full px-3 py-2 pl-10 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {searchQuery && filteredLeads.length > 0 && (
                  <div className="mt-2 bg-[#101010] rounded-lg border border-gray-800 max-h-40 overflow-y-auto">
                    {filteredLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-3 cursor-pointer hover:bg-[#252525] ${
                          selectedLead?.id === lead.id ? 'bg-[#252525]' : ''
                        }`}
                      >
                        <div className="font-medium">{`${lead.firstName} ${lead.surname}`}</div>
                        <div className="text-sm text-gray-400">{lead.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(!searchQuery || filteredLeads.length === 0) && (
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-lg hover:bg-[#3F74FF]/90 transition-colors"
                >
                  <Plus size={18} />
                  <span>Create New Lead</span>
                </button>
              )}

              <div>
                <label className="block text-sm text-gray-200 mb-1">Trial Type</label>
                <select
                  value={formData.trialType}
                  onChange={(e) => setFormData({ ...formData, trialType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                >
                  <option value="">Select type</option>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={!selectedLead || !formData.trialType || !formData.dateTime}
                  className="flex-1 px-2 py-2 bg-[#3B82F6] text-white cursor-pointer text-sm rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Trial
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-2 py-2 bg-black text-red-600 cursor-pointer text-sm rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AddPartiesModal
        isVisible={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSave={handleSaveLead}
      />
    </>
  );
};

export default TrialTrainingModal;