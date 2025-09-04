/* eslint-disable react/prop-types */
import { X, Cake, Calendar as CalendarIcon, History, MessageCircle, Eye } from "lucide-react"
import DefaultAvatar from "../../../public/default-avatar.avif"
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
}) {
  if (!isOpen || !selectedMember) return null

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl mx-4 my-8 relative">
        <div className="p-6">
        <div className="flex flex-col gap-4 bg-[#161616] rounded-xl p-4 md:p-6 mb-6 relative">
  {/* Close Button */}
  <button
    onClick={onClose}
    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white"
  >
    <X size={20} />
  </button>

  {/* Profile Section */}
  <div className="flex flex-col items-center gap-4">
    <img
      src={selectedMember.image || DefaultAvatar}
      alt="Profile"
      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
    />
<div className="text-center">
  <div className="flex flex-wrap items-center justify-center gap-2">
    <h2 className="text-white text-lg md:text-xl font-semibold">
      {selectedMember.title}
      {selectedMember.dateOfBirth && (
        <> ({calculateAge(selectedMember.dateOfBirth)})</>
      )}
    </h2>
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        selectedMember.isActive
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {selectedMember.isActive ? "Active" : "Inactive"}
    </span>
    {selectedMember.isBirthday && (
      <Cake size={16} className="text-yellow-500" />
    )}
  </div>

  <p className="text-gray-400 text-sm mt-1">
    {selectedMember.contractStart && selectedMember.contractEnd ? (
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
      </>
    ) : (
      "No Contract period"
    )}
  </p>
</div>

  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap justify-center gap-2 mt-4">
    <button className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
      onClick={handleCalendarFromOverview}>
      <CalendarIcon size={16} /> 
    </button>
    <button className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
      onClick={handleHistoryFromOverview}>
      <History size={16} />
    </button>
    <button className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
      onClick={handleCommunicationFromOverview}>
      <MessageCircle size={16} /> 
    </button>
    <button className="text-gray-200 gap-2 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-3 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-"
      onClick={handleViewDetailedInfo}>
      <Eye size={16} /> View Details
    </button>
    <button className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-3 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-"
      onClick={handleEditFromOverview}>
      Edit
    </button>
  </div>
</div>


        </div>
      </div>
    </div>
  )
}
