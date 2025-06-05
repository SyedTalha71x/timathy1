/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';

const AssignStudioModal = ({
  isOpen,
  onClose,
  franchises,
  selectedFranchiseForAssignment,
  onFranchiseSelect,
  unassignedStudios,
  onAssignStudio,
  toast
}) => {
  const [franchiseSearchTerm, setFranchiseSearchTerm] = useState('');
  const [studioSearchTerm, setStudioSearchTerm] = useState('');

  // Filter franchises based on search term
  const filteredFranchises = useMemo(() => {
    if (!franchiseSearchTerm) return franchises || [];
    return (franchises || []).filter(franchise =>
      franchise.name.toLowerCase().includes(franchiseSearchTerm.toLowerCase())
    );
  }, [franchises, franchiseSearchTerm]);

  // Filter unassigned studios based on search term
  const filteredUnassignedStudios = useMemo(() => {
    if (!studioSearchTerm) return unassignedStudios || [];
    return (unassignedStudios || []).filter(studio =>
      studio.name.toLowerCase().includes(studioSearchTerm.toLowerCase()) ||
      studio.city.toLowerCase().includes(studioSearchTerm.toLowerCase()) ||
      studio.zipCode.toLowerCase().includes(studioSearchTerm.toLowerCase())
    );
  }, [unassignedStudios, studioSearchTerm]);

  if (!isOpen) return null;



  const handleFranchiseChange = (e) => {
    const franchise = franchises.find((f) => f.id === Number.parseInt(e.target.value));
    onFranchiseSelect(franchise);
  };

  const handleAssignClick = (studioId) => {
    if (selectedFranchiseForAssignment) {
      onAssignStudio(selectedFranchiseForAssignment.id, studioId);
    } else {
      toast.error("Please select a franchise first");
    }
  };

  const clearSearch = () => {
    setFranchiseSearchTerm('');
    setStudioSearchTerm('');
  };

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Assign Studios to Franchise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-200 block mb-2">Select Franchise</label>
              
              {/* Franchise Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search franchises..."
                  value={franchiseSearchTerm}
                  onChange={(e) => setFranchiseSearchTerm(e.target.value)}
                  className="w-full bg-[#101010] rounded-xl pl-10 pr-4 py-2 text-white outline-none text-sm placeholder-gray-500"
                />
              </div>

              <select
                value={selectedFranchiseForAssignment?.id || ""}
                onChange={handleFranchiseChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              >
                <option value="">Select a franchise...</option>
                {filteredFranchises.map((franchise) => (
                  <option key={franchise.id} value={franchise.id}>
                    {franchise.name}
                  </option>
                ))}
              </select>
              
              {franchiseSearchTerm && filteredFranchises.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No franchises found matching "{franchiseSearchTerm}"</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium">Unassigned Studios</h3>
                {(franchiseSearchTerm || studioSearchTerm) && (
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Studio Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search studios by name, city, or zip code..."
                  value={studioSearchTerm}
                  onChange={(e) => setStudioSearchTerm(e.target.value)}
                  className="w-full bg-[#101010] rounded-xl pl-10 pr-4 py-2 text-white outline-none text-sm placeholder-gray-500"
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredUnassignedStudios.length > 0 ? (
                  filteredUnassignedStudios.map((studio) => (
                    <div key={studio.id} className="bg-[#161616] rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{studio.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {studio.city}, {studio.zipCode}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignClick(studio.id)}
                        disabled={!selectedFranchiseForAssignment}
                        className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                ) : unassignedStudios.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">All studios are already assigned to franchises</p>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No studios found matching "{studioSearchTerm}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStudioModal;