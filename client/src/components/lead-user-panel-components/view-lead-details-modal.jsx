/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"
import Avatar from '../../../public/default-avatar.avif'
import toast from "react-hot-toast"

const ViewLeadDetailsModal = ({ isVisible, onClose, leadData, memberRelations, onEditLead }) => {
    const [activeTab, setActiveTab] = useState("details")
  
    if (!isVisible || !leadData) return null

    const handleEditRelations = () => {
      // Close the view modal and open the edit modal
      onClose()
      onEditLead(leadData)
    }
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
      <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
        <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-4xl my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Lead Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
  
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "relations" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Relations
            </button>
          </div>
  
          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-4">
                {/* <img src={leadData.avatar || Avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" /> */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {leadData.firstName} {leadData.surname}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-900 text-blue-300 capitalize">
                      {leadData.status || "Lead"}
                    </span>
                    {/* {leadData.hasTrialTraining && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-900 text-green-300">
                        Trial Training Arranged
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{leadData.email}</p>
                </div>
                <div>
                  <p>Lead Source</p>
                <p className={`px-2 py-1 text-xs w-38 text-center mt-1 rounded-full ${getSourceColor(leadData.source)}`}>
                {leadData.source || "N/A"}
              </p>
                </div>
               
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p>{leadData.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Street & ZIP Code</p>
                  <p>{leadData.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Country</p>
                  <p>{leadData.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lead ID</p>
                  <p>{leadData.leadId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p>{leadData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">About</p>
                  <p>{leadData.about}</p>
                </div>
              
              </div>
              <div>
                <p className="text-sm text-gray-400">Created Date</p>
                <p>{leadData.createdAt ? new Date(leadData.createdAt).toLocaleDateString() : "Unknown"}</p>
              </div>
              {leadData.specialNote && leadData.specialNote.text && (
                <div>
                  <p className="text-sm text-gray-400">Special Note</p>
                  <p>{leadData.specialNote.text}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Importance: {leadData.specialNote.isImportant ? "Important" : "Unimportant"}
                  </p>
                  {leadData.specialNote.startDate && leadData.specialNote.endDate && (
                    <p className="text-sm text-gray-400">
                      Valid from: {leadData.specialNote.startDate} to {leadData.specialNote.endDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
  
          {activeTab === "relations" && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="">
                <button 
                  onClick={handleEditRelations}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md cursor-pointer text-sm transition-colors"
                >
                  Edit Relations
                </button>
              </div>
              {/* Relations Tree Visualization */}
              <div className="bg-[#161616] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                <div className="flex flex-col items-center space-y-8">
                  {/* Central Lead */}
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                    {leadData.firstName} {leadData.surname}
                  </div>
                  {/* Connection Lines and Categories */}
                  <div className="relative w-full">
                    {/* Horizontal line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                    {/* Category sections */}
                    <div className="grid grid-cols-5 gap-4 pt-8">
                      {Object.entries(memberRelations[leadData.id] || {}).map(([category, relations]) => (
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
                                    toast.info(`Clicked on ${relation.name} (${relation.type})`)
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
                  {Object.entries(memberRelations[leadData.id] || {}).map(([category, relations]) => (
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
                                  toast.info(`Clicked on ${relation.name} (${relation.type})`)
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
    )
  }

  export default ViewLeadDetailsModal