/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { X } from 'lucide-react';

const FilterModal = ({
  isOpen,
  onClose,
  filterOptions,
  filterStatus,
  setFilterStatus,
  memberTypeFilter,
  setMemberTypeFilter
}) => {
  if (!isOpen) return null;

  const handleApplyFilters = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Filter Members</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Primary Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Member Status</label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilterStatus(option.id)}
                    className={`w-full px-4 py-2 text-left text-sm rounded-xl border transition-colors ${
                      option.id === filterStatus
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-[#101010] border-slate-300/30 text-white hover:bg-[#2F2F2F]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Advanced Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Member Type</label>
                  <select
                    value={memberTypeFilter}
                    onChange={(e) => setMemberTypeFilter(e.target.value)}
                    className="w-full bg-[#101010] text-white rounded-xl px-4 py-2 text-sm border border-slate-300/30 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="full">Full Members (with contract)</option>
                    <option value="temporary">Temporary Members (without contract)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;