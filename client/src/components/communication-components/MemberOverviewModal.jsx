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
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-6xl mx-4 my-8 relative">
        <div className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#161616] rounded-xl p-4 md:p-6 mb-6">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
              <img
                src={selectedMember.image || DefaultAvatar}
                alt="Profile"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">
                    {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      selectedMember.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}
                  >
                    {selectedMember.isActive ? "Active" : "Inactive"}
                  </span>
                  {selectedMember.isBirthday && <Cake size={16} className="text-yellow-500" />}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Contract: {selectedMember.contractStart} -{" "}
                  <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                    {selectedMember.contractEnd}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              <button onClick={handleCalendarFromOverview} className="btn-icon text-blue-500 hover:text-blue-400">
                <CalendarIcon size={18} />
              </button>
              <button onClick={handleHistoryFromOverview} className="btn-icon text-purple-500 hover:text-purple-400">
                <History size={18} />
              </button>
              <button
                onClick={handleCommunicationFromOverview}
                className="btn-icon text-green-500 hover:text-green-400"
              >
                <MessageCircle size={18} />
              </button>
              <button onClick={handleViewDetailedInfo} className="btn-default">
                <Eye size={14} /> View Details
              </button>
              <button onClick={handleEditFromOverview} className="btn-default">
                Edit
              </button>
              <button onClick={onClose} className="p-2 md:p-3 text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
