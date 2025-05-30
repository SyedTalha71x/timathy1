/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X } from 'lucide-react';

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
              <select
                value={selectedFranchiseForAssignment?.id || ""}
                onChange={handleFranchiseChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              >
                <option value="">Select a franchise...</option>
                {franchises.map((franchise) => (
                  <option key={franchise.id} value={franchise.id}>
                    {franchise.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Unassigned Studios</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {unassignedStudios.length > 0 ? (
                  unassignedStudios.map((studio) => (
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
                ) : (
                  <p className="text-gray-400 text-center py-4">All studios are already assigned to franchises</p>
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