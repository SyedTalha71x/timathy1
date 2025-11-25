/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Users, Building, Edit, FileText, Eye } from "lucide-react"
import { IoMdDocument } from "react-icons/io"
import { TbPaperBag } from "react-icons/tb"

const StudioDetailsModal = ({
  isOpen,
  onClose,
  studio,
  franchises = [],
  studioStats = {},
  DefaultStudioImage,
  isContractExpiringSoon,
  onEditStudio,
  onGoToContract,
  onViewFranchiseDetails,
}) => {
  if (!isOpen || !studio) return null

  const franchise = franchises.find((f) => f.id === studio.franchiseId)

  // Helper function to render opening hours from array format
  const renderOpeningHours = () => {
    if (!studio.openingHours || !Array.isArray(studio.openingHours)) {
      return <p>No opening hours set</p>
    }

    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {studio.openingHours.map((hour) => (
          <p key={hour.day}>
            {hour.day}: {hour.startTime?.format?.('HH:mm') || 'N/A'} - {hour.endTime?.format?.('HH:mm') || 'N/A'}
          </p>
        ))}
      </div>
    )
  }

  // Helper function to render closing days from array format
  const renderClosingDays = () => {
    if (!studio.closingDays || !Array.isArray(studio.closingDays) || studio.closingDays.length === 0) {
      return <p>No special closing days</p>
    }

    return (
      <div>
        {studio.closingDays.map((day, index) => (
          <p key={index}>
            {day.date?.format?.('YYYY-MM-DD') || 'N/A'}: {day.description}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="p-6 custom-scrollbar overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Studio Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 text-white">
            <div className="flex md:items-center flex-col md:flex-row justify-start items-start gap-4">
              <img
                src={studio.image || DefaultStudioImage}
                alt="Studio Logo"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{studio.name}</h3>
                <p className="text-gray-400">
                  Contract: {studio.contractStart} -
                  <span className={isContractExpiringSoon(studio.contractEnd) ? "text-red-500" : ""}>
                    {studio.contractEnd}
                  </span>
                </p>
                {studio.franchiseId && franchise && (
                  <div className="flex md:items-center mt-2 md:flex-row flex-col items-start gap-2">
                    <p className="text-purple-400 text-sm">Franchise: {franchise.name}</p>
                    <button
                      onClick={() => onViewFranchiseDetails(franchise)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Owner</p>
                <p>{studio.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tax ID</p>
                <p>{studio.taxId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{studio.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p>{studio.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Website</p>
              <p>{studio.website}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">IBAN</p>
              <p>{studio.iban || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Country</p>
              <p>{studio.country || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p>{`${studio.street}, ${studio.zipCode} ${studio.city}`}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Opening Hours</p>
              {renderOpeningHours()}
            </div>

            <div>
              <p className="text-sm text-gray-400">Closing Days</p>
              {renderClosingDays()}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.members || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Members</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.leads || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Leads</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} className="text-green-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.trainers || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Staff</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <IoMdDocument size={16} className="text-green-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.contracts || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Contracts</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">About</p>
              <p>{studio.about}</p>
            </div>

            {studio.note && (
              <div>
                <p className="text-sm text-gray-400">Special Note</p>
                <p>{studio.note}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Note Period: {studio.noteStartDate} to {studio.noteEndDate}
                </p>
                <p className="text-sm text-gray-400">Importance: {studio.noteImportance}</p>
              </div>
            )}

            <div className="flex gap-3 md:flex-row flex-col pt-4">
              <button
                onClick={() => onEditStudio(studio)}
                className="flex-1 bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit Studio
              </button>
              <button
                onClick={() => onGoToContract(studio)}
                className="flex-1 bg-[#FF843E] hover:bg-[#FF843E]/90 px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Go to Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioDetailsModal
