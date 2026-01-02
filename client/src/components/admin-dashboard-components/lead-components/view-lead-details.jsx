""

import { X } from "lucide-react"

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


  // Get source color based on type
  const getSourceColor = (source) => {
    const sourceColors = {
      Website: "bg-blue-900 text-blue-300",
      "Google Ads": "bg-green-900 text-green-300",
      "Social Media Ads": "bg-purple-900 text-purple-300",
      "Email Campaign": "bg-orange-900 text-orange-300",
      "Cold Call (Outbound)": "bg-red-900 text-red-300",
      "Inbound Call": "bg-emerald-900 text-emerald-300",
      Event: "bg-yellow-900 text-yellow-300",
      "Offline Advertising": "bg-pink-900 text-pink-300",
      Other: "bg-gray-900 text-gray-300",
    }
    return sourceColors[source] || "bg-gray-900 text-gray-300"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-[#1C1C1C] rounded-lg lg:p-8 p-5 max-w-2xl w-full mx-4 custom-scrollbar max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Lead Details</h2>
          <button onClick={onClose} className="cursor-pointer text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-start md:flex-row flex-col mb-6 border-b border-gray-700 pb-6">
          <div className="">
            <h3 className="text-xl font-semibold text-white mb-1">{leadData.studioName || "No Studio Name"}</h3>
            <p className="text-md text-gray-300">{`${leadData.firstName} ${leadData.surname}`}</p>
          </div>
        </div>

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
            <p className="text-gray-400">Lead Source:</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getSourceColor(leadData.source)}`}>
                {leadData.source || "N/A"}
              </span>
             
            </div>
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
