/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export function ViewLeadDetailsModal({ isVisible, onClose, leadData }) {
  if (!isVisible || !leadData) return null

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format birthday to be more readable (without time)
  const formatBirthday = (dateString) => {
    if (!dateString) return "Not provided"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-lg">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile section */}
        <div className="flex items-center md:flex-row flex-col mb-6 border-b border-gray-700 pb-6">
          <img
            src={leadData.avatar || "/placeholder.svg"}
            alt={`${leadData.firstName} ${leadData.surname}'s avatar`}
            className="w-20 h-20 rounded-full bg-zinc-800 object-cover"
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-white">{`${leadData.firstName} ${leadData.surname}`}</h3>
          </div>
        </div>

        {/* Details grid - two fields per row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Email</p>
            <p className="text-white break-words text-sm">{leadData.email}</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Phone Number</p>
            <p className="text-white text-sm">{leadData.phoneNumber}</p>
          </div>

          {/* Birthday - NEW */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Birthday</p>
            <p className="text-white text-sm">
              {leadData.birthday ? formatBirthday(leadData.birthday) : "Not provided"}
            </p>
          </div>

          {/* Trial Training Status */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Trial Training</p>
            <p className={leadData.hasTrialTraining ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
              {leadData.hasTrialTraining ? "Arranged" : "Not Arranged"}
            </p>
          </div>

          {/* Address - NEW */}
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium text-gray-400">Address</p>
            <p className="text-white text-sm">{leadData.address ? leadData.address : "Not provided"}</p>
          </div>

          {/* Created Date */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Created At</p>
            <p className="text-white text-sm">{formatDate(leadData.createdAt)}</p>
          </div>

          {/* ID */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Lead ID</p>
            <p className="text-white font-mono text-sm">{leadData.id}</p>
          </div>
        </div>

        <div className="space-y-1 col-span-2 mt-3">
          <p className="text-sm font-medium text-gray-400">About</p>
          <p className="text-white text-sm">
            {leadData.about ? leadData.about : "No additional information provided."}
          </p>
        </div>
      </div>
    </div>
  )
}
