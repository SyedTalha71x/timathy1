/* eslint-disable react/prop-types */

import { X } from "lucide-react"

export function ViewLeadModal({ isVisible, onClose, leadData }) {
  if (!isVisible || !leadData) return null

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "converted":
        return "bg-blue-600"
      case "trial":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (leadData) => {
    if (leadData.hasTrialTraining) return "Trial Training arranged"
    return leadData.status?.charAt(0).toUpperCase() + leadData.status?.slice(1) || "Passive"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center p-3 items-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Lead Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Studio Name */}
            {leadData.studioName && (
              <div>
                <label className="text-sm text-gray-400 block mb-1">Studio Name</label>
                <div className="text-white text-sm font-medium">{leadData.studioName}</div>
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">First Name</label>
                <div className="text-white text-sm">{leadData.firstName || "Not provided"}</div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Last Name</label>
                <div className="text-white text-sm">{leadData.surname || "Not provided"}</div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <div className="text-white text-sm">{leadData.email || "Not provided"}</div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Phone</label>
              <div className="text-white text-sm">{leadData.phoneNumber || "Not provided"}</div>
            </div>

            {/* Source */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Source</label>
              <div className="text-white text-sm">{leadData.source || "Not specified"}</div>
            </div>

            {/* Address */}
            {(leadData.street || leadData.city || leadData.zipCode || leadData.country) && (
              <div className="border border-slate-700 rounded-xl p-4">
                <label className="text-sm text-gray-400 font-medium block mb-3">Address</label>
                
                {leadData.street && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-400">Street: </span>
                    <span className="text-white text-sm">{leadData.street}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {leadData.zipCode && (
                    <div>
                      <span className="text-xs text-gray-400">ZIP: </span>
                      <span className="text-white text-sm">{leadData.zipCode}</span>
                    </div>
                  )}
                  {leadData.city && (
                    <div>
                      <span className="text-xs text-gray-400">City: </span>
                      <span className="text-white text-sm">{leadData.city}</span>
                    </div>
                  )}
                </div>

                {leadData.country && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">Country: </span>
                    <span className="text-white text-sm">{leadData.country}</span>
                  </div>
                )}
              </div>
            )}

            {/* Website */}
            {leadData.website && (
              <div>
                <label className="text-sm text-gray-400 block mb-1">Website</label>
                <a 
                  href={leadData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:text-blue-300 underline"
                >
                  {leadData.website}
                </a>
              </div>
            )}

            {/* Lead Status */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Lead Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs text-white ${getStatusColor(leadData.status)}`}>
                {getStatusText(leadData)}
              </span>
            </div>

            {/* Special Note */}
            {(leadData.specialNote?.text || leadData.specialNote?.startDate || leadData.specialNote?.endDate) && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-400 font-medium">Special Note</label>
                  {leadData.specialNote?.isImportant && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Important</span>
                  )}
                </div>

                {leadData.specialNote?.text && (
                  <div className="text-white text-sm mb-3 bg-[#141414] rounded-xl p-3">
                    {leadData.specialNote.text}
                  </div>
                )}

                {(leadData.specialNote?.startDate || leadData.specialNote?.endDate) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-400">Start Date: </span>
                      <span className="text-white">{formatDate(leadData.specialNote?.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">End Date: </span>
                      <span className="text-white">{formatDate(leadData.specialNote?.endDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* About */}
            {leadData.about && (
              <div>
                <label className="text-sm text-gray-400 block mb-1">About</label>
                <div className="text-white text-sm  rounded-xl ">
                  {leadData.about}
                </div>
              </div>
            )}

            {/* Created Date */}
            {leadData.createdAt && (
              <div>
                <label className="text-sm text-gray-400 block mb-1">Created</label>
                <div className="text-white text-sm">{formatDate(leadData.createdAt)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}