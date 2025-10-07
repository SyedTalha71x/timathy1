/* eslint-disable react/prop-types */
import {
  X,
  Cake,
  Calendar as CalendarIcon,
  History,
  MessageCircle,
  Eye,
  Dumbbell,
  FileText,
  Users,
  Info,
  Clock,
} from "lucide-react";
import DefaultAvatar from "../../../../public/gray-avatar-fotor-20250912192528.png";

export default function MemberOverviewModal({
  isOpen,
  onClose,
  selectedMember,
  calculateAge,
  isContractExpiringSoon,
  handleCalendarFromOverview,
  handleHistoryFromOverview,
  handleCommunicationFromOverview,
  handleViewDetailedInfo,
  handleEditFromOverview,
  handleTrainingPlansFromOverview,
  handleDocumentFromOverview,
  handleRelationFromOverview,
  memberRelations,
  isBirthday,
}) {
  if (!isOpen || !selectedMember) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl mx-4 my-8 relative">
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white z-10"
          >
            <X size={20} />
          </button>

          <div className="bg-[#161616] rounded-xl p-6">
            {/* Member Info Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={selectedMember.image || DefaultAvatar}
                alt="Profile"
                className="h-20 w-20 rounded-2xl object-cover mb-3"
              />
              <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h3 className="text-white font-medium text-lg">
                    {selectedMember.title}
                    {selectedMember.dateOfBirth &&
                      ` (${calculateAge(selectedMember.dateOfBirth)})`}
                  </h3>

                  <div className="flex items-center gap-2">
                    {selectedMember.isArchived ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">
                        Archived
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          selectedMember.isActive
                            ? "bg-green-900 text-green-300"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {selectedMember.isActive
                          ? "Active"
                          : `Paused${
                              selectedMember.reason
                                ? ` (${selectedMember.reason})`
                                : ""
                            }`}
                      </span>
                    )}

                    {isBirthday &&
                      isBirthday(selectedMember.dateOfBirth) && (
                        <Cake size={16} className="text-yellow-500" />
                      )}
                  </div>
                </div>

                <div className="text-sm mt-1 flex items-center gap-1">
                  <p className="text-gray-400">Member Type:</p>
                  <span className="text-gray-400">
                    {selectedMember.memberType === "full"
                      ? "Full Member"
                      : "Temporary Member"}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-1 text-center flex items-center">
                  {selectedMember.memberType === "full" ? (
                    <>
                      Contract: {selectedMember.contractStart} -{" "}
                      <span
                        className={
                          isContractExpiringSoon(selectedMember.contractEnd)
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {selectedMember.contractEnd}
                      </span>
                      {isContractExpiringSoon(selectedMember.contractEnd) && (
                        <Info size={16} className="text-red-500 ml-1" />
                      )}
                    </>
                  ) : (
                    <>
                      No Contract - Auto-archive:{" "}
                      {selectedMember.autoArchiveDate}
                      {selectedMember.autoArchiveDate &&
                        new Date(selectedMember.autoArchiveDate) <=
                          new Date() && (
                          <Clock size={16} className="text-orange-500 ml-1" />
                        )}
                    </>
                  )}
                </p>

                {handleRelationFromOverview && (
                  <div className="mt-2">
                    <button
                      onClick={handleRelationFromOverview}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Users size={12} />
                      Relations (
                      {memberRelations
                        ? Object.values(
                            memberRelations[selectedMember.id] || {}
                          ).flat().length
                        : 0}
                      )
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Row 1 (Icons Only) */}
            <div className="grid grid-cols-5 gap-2 mt-6">
              <button
                onClick={handleCalendarFromOverview}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="View Appointments"
              >
                <CalendarIcon size={16} />
              </button>

              <button
                onClick={
                  handleTrainingPlansFromOverview ||
                  (() => console.log("Training Plans - To be implemented"))
                }
                className="text-white bg-black rounded-xl border border-slate-600 py-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Training Plans"
              >
                <Dumbbell size={16} />
              </button>

              <button
                onClick={handleHistoryFromOverview}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="View History"
              >
                <History size={16} />
              </button>

              <button
                onClick={
                  handleDocumentFromOverview ||
                  (() => console.log("Documents - To be implemented"))
                }
                className="text-white bg-black rounded-xl border border-slate-600 py-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Document Management"
              >
                <FileText size={16} />
              </button>

              <button
                onClick={handleCommunicationFromOverview}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Start Chat"
              >
                <MessageCircle size={16} />
              </button>
            </div>

            {/* Action Buttons Row 2 (Text Buttons) */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleViewDetailedInfo}
                className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Eye size={14} />
                <span className="text-xs">View Details</span>
              </button>
              <button
                onClick={handleEditFromOverview}
                className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
              >
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
