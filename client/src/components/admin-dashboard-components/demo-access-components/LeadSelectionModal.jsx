/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdPerson, MdSearch, MdBusiness } from "react-icons/md";

const LeadSelectionModal = ({ isOpen, onClose, onSelectLead, leads, onSkip }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-3xl w-full max-h-[70vh] custom-scrollbar overflow-y-auto border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Select a Lead</h2>
          <p className="text-gray-400 text-sm mt-1">Choose from your existing leads or proceed without one</p>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-800">
          <div className="relative">
            <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leads by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Leads List */}
        <div className="overflow-y-auto custom-scrollbar max-h-96">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
              <p>No leads found matching your search</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="flex items-center p-4 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <MdPerson size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{lead.name}</h3>
                    <p className="text-gray-400 text-sm">{lead.email}</p>
                    <p className="text-gray-500 text-sm">{lead.company}</p>
                  </div>
                  <div className="text-blue-400 text-sm font-medium">
                    Select
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#1A1A1A]">
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <MdBusiness />
              Proceed Without Lead
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSelectionModal;