/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { X, Search, Users, Trash2 } from 'lucide-react';

const AssignPlanModal = ({
  isOpen,
  planToAssign,
  memberSearchQuery,
  selectedMembers,
  assignedMembers,
  members,
  onClose,
  onMemberSearchChange,
  onSelectedMembersChange,
  onRemovePlanFromMember,
  onAssignPlan,
  getDifficultyColor
}) => {
  const [isAssignedMembersCollapsed, setIsAssignedMembersCollapsed] = useState(true);
  const [memberToRemove, setMemberToRemove] = useState(null);

  if (!isOpen || !planToAssign) return null;

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const handleMemberSelect = (memberId) => {
    // Assign the plan immediately when a member is selected from search results
    onAssignPlan([memberId]);
    // Clear the search query after assignment
    onMemberSearchChange('');
  };

  const handleRemoveClick = (memberId) => {
    setMemberToRemove(memberId);
  };

  const confirmRemove = () => {
    if (memberToRemove) {
      onRemovePlanFromMember(memberToRemove);
      setMemberToRemove(null);
    }
  };

  const cancelRemove = () => {
    setMemberToRemove(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Assign Training Plan</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-[#161616] rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-white mb-2">{planToAssign.name}</h3>
              <p className="text-gray-400 text-sm">{planToAssign.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span
                  className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(planToAssign.difficulty)}`}
                >
                  {planToAssign.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{planToAssign.exercises.length} exercises</span>
              </div>
            </div>

            {/* Search for Members */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Search Members to Assign</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={memberSearchQuery}
                  onChange={(e) => onMemberSearchChange(e.target.value)}
                  className="w-full bg-[#161616] pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none"
                />
              </div>

              {/* Search Results */}
              {memberSearchQuery && (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                      <p>No members found</p>
                    </div>
                  ) : (
                    filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 bg-[#161616] rounded-xl hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                        onClick={() => handleMemberSelect(member.id)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{member.name}</h4>
                          <p className="text-gray-400 text-sm">{member.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Assigned Members List - Collapsible */}
            <div>
              <button
                onClick={() => setIsAssignedMembersCollapsed(!isAssignedMembersCollapsed)}
                className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white mb-4 hover:text-gray-300 transition-colors"
              >
                <Users size={18} />
                Currently Assigned Members ({assignedMembers.length})
                <span className={`transform transition-transform ${isAssignedMembersCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                  <ChevronDown size={16} />
                </span>
              </button>
              
              {!isAssignedMembersCollapsed && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {assignedMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Users size={48} className="mx-auto mb-4" />
                      <p>No members have been assigned this plan yet</p>
                    </div>
                  ) : (
                    assignedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-[#161616] rounded-xl p-4 hover:bg-[#1F1F1F] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{member.name}</h4>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-blue-400 text-xs">{member.assignedPlan}</span>
                              <span className="text-gray-500 text-xs">Assigned: {member.assignedDate}</span>
                              {/* Only show progress tags for "In Progress" and "Completed" */}
                              {member.progress !== "Not Started" && (
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    member.progress === "Completed" ? "bg-green-600 text-white" :
                                    member.progress === "In Progress" ? "bg-yellow-600 text-white" :
                                    "bg-gray-600 text-white"
                                  }`}
                                >
                                  {member.progress}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveClick(member.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors ml-4"
                            title="Remove plan from member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Removing Member */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Remove Training Plan</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove this training plan from the member? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Remove Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add ChevronDown icon component
const ChevronDown = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default AssignPlanModal;
