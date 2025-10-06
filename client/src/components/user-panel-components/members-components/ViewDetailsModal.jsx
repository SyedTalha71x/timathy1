/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle, Info, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewDetailsModal = ({
  isOpen,
  onClose,
  selectedMemberMain,
  memberRelationsMain,
  calculateAgeMain,
  isContractExpiringSoonMain,
  redirectToContract,
  handleEditMember,
  setEditModalTabMain,
  DefaultAvatar1,
  initialTab = "details"
}) => {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen || !selectedMemberMain) return null;

  const handleEditAndOpenTab = (tab) => {
    onClose();
    handleEditMember(selectedMemberMain);
    setEditModalTabMain(tab);
  };

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-4 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] relative flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mt-4 -mb-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "note"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Special Note
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "relations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Relations
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {/* Tab Content */}
            {activeTab === "details" && (
              <div className="space-y-4 text-white">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <img
                    src={selectedMemberMain.image || DefaultAvatar1}
                    alt="Profile"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {selectedMemberMain.title} ({calculateAgeMain(selectedMemberMain.dateOfBirth)})
                    </h3>
                    <p className="text-gray-400 mt-1 text-sm">
                      {selectedMemberMain.memberType === "full" ? (
                        <>
                          Contract: {selectedMemberMain.contractStart} -
                          <span className={isContractExpiringSoonMain(selectedMemberMain.contractEnd) ? "text-red-500" : ""}>
                            {selectedMemberMain.contractEnd}
                          </span>
                        </>
                      ) : (
                        <>Auto-archive date: {selectedMemberMain.autoArchiveDate}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Member Type</p>
                    <p className="text-sm">{selectedMemberMain.memberType === "full" ? "Full Member (with contract)" : "Temporary Member (without contract)"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Number</p>
                    <p className="text-sm">{selectedMemberMain.memberNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-sm break-all">{selectedMemberMain.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-sm">{selectedMemberMain.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-sm">{selectedMemberMain.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Join Date</p>
                    <p className="text-sm">{selectedMemberMain.joinDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                
                  <div>

                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-sm">{`${selectedMemberMain.street}, ${selectedMemberMain.zipCode} ${selectedMemberMain.city}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Gender</p>
                    <p className="text-sm">{selectedMemberMain?.gender || ""}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Date of Birth</p>
                    <p className="text-sm">
                      {selectedMemberMain.dateOfBirth} (Age: {calculateAgeMain(selectedMemberMain.dateOfBirth)})
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">About</p>
                  <p className="text-sm">{selectedMemberMain.about}</p>
                  {selectedMemberMain.memberType === "temporary" && selectedMemberMain.autoArchiveDate && (
                    <div className="mt-2 p-2 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                      <p className="text-orange-200 text-sm">
                        <Clock size={14} className="inline mr-1" />
                        Auto-archive due date: {selectedMemberMain.autoArchiveDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "note" && (
              <div className="space-y-4 text-white">
                <h3 className="text-lg font-semibold mb-4">Special Note</h3>
                {selectedMemberMain.note ? (
                  <div className="border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      {selectedMemberMain.noteImportance === "important" ? (
                        <AlertTriangle className="text-yellow-500" size={20} />
                      ) : (
                        <Info className="text-blue-500" size={20} />
                      )}
                      <p className="font-medium">
                        {selectedMemberMain.noteImportance === "important" ? "Important Note" : "Unimportant Note"}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed">{selectedMemberMain.note}</p>
                    {selectedMemberMain.noteStartDate && selectedMemberMain.noteEndDate && (
                      <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                        <p className="text-xs text-gray-300">
                          Valid from {selectedMemberMain.noteStartDate} to {selectedMemberMain.noteEndDate}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No special note for this member.</div>
                )}
              </div>
            )}

            {activeTab === "relations" && (
              <div className="space-y-6">
                {/* Relations Tree Visualization */}
                <div className="bg-[#161616] rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                  <div className="flex flex-col items-center space-y-6 md:space-y-8">
                    {/* Central Member */}
                    <div className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg border-2 border-blue-400 font-semibold text-sm md:text-base">
                      {selectedMemberMain.title}
                    </div>
                    {/* Connection Lines and Categories */}
                    <div className="relative w-full">
                      {/* Horizontal line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                      {/* Category sections */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 pt-6 md:pt-8">
                        {Object.entries(memberRelationsMain[selectedMemberMain.id] || {}).map(([category, relations]) => (
                          <div key={category} className="flex flex-col items-center space-y-3 md:space-y-4">
                            {/* Vertical line */}
                            <div className="w-0.5 h-6 md:h-8 bg-gray-600"></div>
                            {/* Category header */}
                            <div
                              className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium capitalize ${category === "family"
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
                                  className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[100px] md:min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${relation.type === "member" || relation.type === "lead"
                                      ? "border border-blue-500/30"
                                      : ""
                                    }`}
                                  onClick={() => {
                                    if (relation.type === "member" || relation.type === "lead") {
                                      toast.info(`Clicked on ${relation.name} (${relation.type})`);
                                    }
                                  }}
                                >
                                  <div className="text-white text-xs md:text-sm font-medium">{relation.name}</div>
                                  <div className="text-gray-400 text-xs">({relation.relation})</div>
                                  <div
                                    className={`text-xs mt-1 px-1 py-0.5 rounded ${relation.type === "member"
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
                <div className="bg-[#161616] rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                  <div className="space-y-4">
                    {Object.entries(memberRelationsMain[selectedMemberMain.id] || {}).map(([category, relations]) => (
                      <div key={category}>
                        <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                        <div className="space-y-2 ml-2 md:ml-4">
                          {relations.length > 0 ? (
                            relations.map((relation) => (
                              <div
                                key={relation.id}
                                className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${relation.type === "member" || relation.type === "lead"
                                    ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                    : ""
                                  }`}
                                onClick={() => {
                                  if (relation.type === "member" || relation.type === "lead") {
                                    toast.info(`Clicked on ${relation.name} (${relation.type})`);
                                  }
                                }}
                              >
                                <div>
                                  <span className="text-white font-medium text-sm md:text-base">{relation.name}</span>
                                  <span className="text-gray-400 ml-2 text-sm">- {relation.relation}</span>
                                  <span
                                    className={`ml-2 text-xs px-2 py-0.5 rounded ${relation.type === "member"
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

        {/* Footer - Fixed for relations tab only */}
        {activeTab === "relations" && (
          <div className="flex-shrink-0 bg-[#1C1C1C] p-4 md:p-6 border-t border-gray-700">
            <button
              onClick={() => handleEditAndOpenTab("relations")}
              className="w-full bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
            >
              Edit Relations
            </button>
          </div>
        )}

        {/* Footer for details tab */}
        {activeTab === "details" && (
          <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-end gap-4">
              {selectedMemberMain.memberType === "full" && (
                <button
                  onClick={redirectToContract}
                  className="flex items-center justify-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                >
                  <FileText size={16} />
                  View Contract
                </button>
              )}
              <button
                onClick={() => handleEditAndOpenTab("details")}
                className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
              >
                Edit Member
              </button>
            </div>
          </div>
        )}

        {/* Footer for note tab */}
        {activeTab === "note" && (
          <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-700">
            <div className="flex justify-end">
              <button
                onClick={() => handleEditAndOpenTab("note")}
                className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
              >
                Edit Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetailsModal;