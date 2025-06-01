"use client"

/* eslint-disable react/prop-types */

const ViewLeadDetailsModal = ({ leadData, onClose }) => {
  if (!leadData) {
    return null
  }

  // Format date helper function
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Lead Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center md:flex-row flex-col mb-6 border-b border-gray-700 pb-6">
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-white mb-2">{leadData.studioName}</h3>
            <p className="text-lg text-gray-300">{`${leadData.firstName} ${leadData.surname}`}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Email:</p>
            <p className="text-white">{leadData.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone:</p>
            <p className="text-white">{leadData.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Street & ZIP Code:</p>
            <p className="text-white">{`${leadData.street || ""} ${leadData.zipCode || ""}`.trim() || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">City:</p>
            <p className="text-white">{leadData.city || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Country:</p>
            <p className="text-white">{leadData.country || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Lead ID:</p>
            <p className="text-white">{leadData.leadId || leadData.id || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Created at:</p>
            <p className="text-white">{formatDate(leadData.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400">Status:</p>
            <p className="text-white">{leadData.status || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400">About:</p>
            <p className="text-white">{leadData.about || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400">Website:</p>
            <p className="text-white">
              {leadData.website ? (
                <a
                  href={leadData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {leadData.website}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewLeadDetailsModal
