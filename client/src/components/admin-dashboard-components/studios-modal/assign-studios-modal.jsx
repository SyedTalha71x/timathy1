/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Plus, ChevronDown } from 'lucide-react';

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
  const [showFranchiseDropdown, setShowFranchiseDropdown] = useState(false);
  const franchiseDropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (franchiseDropdownRef.current && !franchiseDropdownRef.current.contains(event.target)) {
        setShowFranchiseDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleFranchiseSelect = (franchise) => {
    onFranchiseSelect(franchise);
    setFranchiseSearchTerm(franchise.name);
    setShowFranchiseDropdown(false);
  };

  const handleFranchiseInputChange = (e) => {
    setFranchiseSearchTerm(e.target.value);
    setShowFranchiseDropdown(true);
    
    // If input is cleared, clear selection
    if (e.target.value === '') {
      onFranchiseSelect(null);
    }
  };

  const handleFranchiseInputClick = () => {
    setShowFranchiseDropdown(true);
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
    onFranchiseSelect(null);
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
              
              {/* Combined Franchise Search & Select */}
              <div className="relative" ref={franchiseDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search and select a franchise..."
                    value={franchiseSearchTerm}
                    onChange={handleFranchiseInputChange}
                    onClick={handleFranchiseInputClick}
                    className="w-full bg-[#101010] rounded-xl pl-10 pr-10 py-2 text-white outline-none text-sm placeholder-gray-500"
                  />
                  <ChevronDown 
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${showFranchiseDropdown ? 'rotate-180' : ''}`} 
                    size={16} 
                  />
                </div>

                {/* Dropdown */}
                {showFranchiseDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#101010] rounded-xl border border-gray-700 z-10 max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredFranchises.length > 0 ? (
                      filteredFranchises.map((franchise) => (
                        <div
                          key={franchise.id}
                          onClick={() => handleFranchiseSelect(franchise)}
                          className="px-4 py-2 text-white hover:bg-[#1C1C1C] cursor-pointer text-sm border-b border-gray-700 last:border-b-0"
                        >
                          {franchise.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-sm">
                        No franchises found matching "{franchiseSearchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected franchise indicator */}
              {selectedFranchiseForAssignment && (
                <div className="mt-2 text-sm text-green-400">
                  ✓ Selected: {selectedFranchiseForAssignment.name}
                </div>
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
                        className="bg-[#FF843E] hover:bg-[#FF843E]/90 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Plus size={14} className="inline mr-1" />
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