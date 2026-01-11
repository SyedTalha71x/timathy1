/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

const MemberDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedMember, 
  memberRelations = {},
  DefaultAvatar,
  calculateAge,
  isContractExpiringSoon,
  redirectToContract 
}) => {
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details");

  if (!isOpen || !selectedMember) return null;

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveMemberDetailsTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                activeMemberDetailsTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveMemberDetailsTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${
                activeMemberDetailsTab === "relations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Relations
            </button>
          </div>

          {/* Tab Content */}
          {activeMemberDetailsTab === "details" && (
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMember.image || DefaultAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        selectedMember.memberType === "full"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-purple-900 text-purple-300"
                      }`}
                    >
                      {selectedMember.memberType === "full"
                        ? "Full Member (with contract)"
                        : "Temporary Member (without contract)"}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">
                    {selectedMember.memberType === "full" ? (
                      <>
                        Contract: {selectedMember.contractStart} -{" "}
                        <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                          {selectedMember.contractEnd}
                        </span>
                      </>
                    ) : (
                      <>Auto-archive date: {selectedMember.autoArchiveDate}</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p>{selectedMember.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p>{`${selectedMember.street}, ${selectedMember.zipCode} ${selectedMember.city}`}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Date of Birth</p>
                  <p>
                    {selectedMember.dateOfBirth} (Age: {calculateAge(selectedMember.dateOfBirth)})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p>{selectedMember.joinDate}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">About</p>
                <p>{selectedMember.about}</p>
              </div>
              
              {selectedMember.note && (
                <div>
                  <p className="text-sm text-gray-400">Special Note</p>
                  <p>{selectedMember.note}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Note Period: {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                  </p>
                  <p className="text-sm text-gray-400">Importance: {selectedMember.noteImportance}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-4 mt-6">
                {selectedMember.memberType === "full" && (
                  <button
                    onClick={redirectToContract}
                    className="flex items-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                  >
                    <FileText size={16} />
                    View Contract
                  </button>
                )}
              </div>
            </div>
          )}

          {activeMemberDetailsTab === "relations" && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Relations Tree Visualization */}
              <div className="bg-[#161616] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                <div className="flex flex-col items-center space-y-8">
                  {/* Central Member */}
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                    {selectedMember.title}
                  </div>
                  
                  {/* Connection Lines and Categories */}
                  <div className="relative w-full">
                    {/* Horizontal line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                    
                    {/* Category sections */}
                    <div className="grid grid-cols-5 gap-4 pt-8">
                      {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                        <div key={category} className="flex flex-col items-center space-y-4">
                          {/* Vertical line */}
                          <div className="w-0.5 h-8 bg-gray-600"></div>
                          
                          {/* Category header */}
                          <div
                            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                              category === "family"
                                ? "bg-yellow-600 text-yellow-100"
                                : category === "friendship"
                                ? "bg-green-600 text-green-100"
                                : category === "relationship"
                                ? "bg-red-600 text-red-100"
                                : category === "work"
                                ? "bg-blue-600 text-blue-100"
                                : "bg-gray-600 text-gray-100"
                            }`}
                          >
                            {category}
                          </div>
                          
                          {/* Relations in this category */}
                          <div className="space-y-2">
                            {relations.map((relation) => (
                              <div
                                key={relation.id}
                                className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${
                                  relation.type === "member" || relation.type === "lead"
                                    ? "border border-blue-500/30"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (relation.type === "member" || relation.type === "lead") {
                                    alert(`Clicked on ${relation.name} (${relation.type})`);
                                  }
                                }}
                              >
                                <div className="text-white text-sm font-medium">{relation.name}</div>
                                <div className="text-gray-400 text-xs">({relation.relation})</div>
                                <div
                                  className={`text-xs mt-1 px-1 py-0.5 rounded ${
                                    relation.type === "member"
                                      ? "bg-green-600 text-green-100"
                                      : relation.type === "lead"
                                      ? "bg-blue-600 text-blue-100"
                                      : "bg-gray-600 text-gray-100"
                                  }`}
                                >
                                  {relation.type}
                                </div>
                              </div>
                            ))}
                            {relations.length === 0 && (
                              <div className="text-gray-500 text-xs text-center">No relations</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Relations List */}
              <div className="bg-[#161616] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                <div className="space-y-4">
                  {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                    <div key={category}>
                      <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {relations.length > 0 ? (
                          relations.map((relation) => (
                            <div
                              key={relation.id}
                              className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${
                                relation.type === "member" || relation.type === "lead"
                                  ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                  : ""
                              }`}
                              onClick={() => {
                                if (relation.type === "member" || relation.type === "lead") {
                                  alert(`Clicked on ${relation.name} (${relation.type})`);
                                }
                              }}
                            >
                              <div>
                                <span className="text-white font-medium">{relation.name}</span>
                                <span className="text-gray-400 ml-2">- {relation.relation}</span>
                                <span
                                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                    relation.type === "member"
                                      ? "bg-green-600 text-green-100"
                                      : relation.type === "lead"
                                      ? "bg-blue-600 text-blue-100"
                                      : "bg-gray-600 text-gray-100"
                                  }`}
                                >
                                  {relation.type}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No {category} relations</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;