/* eslint-disable react/prop-types */
import { X, AlertTriangle, Info } from "lucide-react"
import { useState, useEffect } from "react"

export function ViewLeadModal({
  isVisible,
  onClose,
  leadData,
  onEditLead,
  memberRelationsLead,
  initialTab = "details"
}) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (!isVisible) {
      setActiveTab("details")
    }
  }, [isVisible])

  if (!isVisible || !leadData) return null

  const handleEditLeadFromView = () => {
    onClose()
    onEditLead(leadData)
  }

  const handleEditNote = () => {
    onClose()
    onEditLead(leadData, "note")
  }

  const handleEditRelations = () => {
    onClose()
    onEditLead(leadData, "relations")
  }

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

  const getStatusText = (leadData) => {
    if (leadData.hasTrialTraining) return "Trial Training arranged"
    return leadData.status?.charAt(0).toUpperCase() + leadData.status?.slice(1) || "Passive"
  }

  // Get relations safely
  const getLeadRelationsData = () => {
    if (!memberRelationsLead || !leadData || !leadData.id) {
      return {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      };
    }
    return memberRelationsLead[leadData.id] || {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    };
  };

  const leadRelationsData = getLeadRelationsData();

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl overflow-y-auto custom-scrollbar max-h-[80vh] my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">Lead Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "note" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
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

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{`${leadData.firstName || ""} ${leadData.surname || ""}`.trim() || "No Name Provided"}</h3>
                  {/* <p className="text-md text-gray-300">{`${leadData.firstName || ""} ${leadData.surname || ""}`.trim() || "No Name Provided"}</p> */}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email:</p>
                  <p className="text-white">{leadData.email || "N/A"}</p>
                </div>


                <div>
                  <p className="text-sm text-gray-400 mb-1">Lead ID:</p>
                  <p className="text-white">{leadData.leadId || leadData.id || "N/A"}</p>
                </div>


                {/* Lead Source */}
                {/* Phone */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone:</p>
                  <p className="text-white">{leadData.phoneNumber || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Gender:</p>
                  <p className="text-white">{leadData.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Street & ZIP Code:</p>
                  <p className="text-white">{`${leadData.street || ""} ${leadData.zipCode || ""}`.trim() || "N/A"}</p>
                </div>

                {/* Country */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">Country:</p>
                  <p className="text-white">{leadData.country || "N/A"}</p>
                </div>


                <div>
                  <p className="text-sm text-gray-400 mb-1">Lead Source:</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSourceColor(leadData.source)}`}>
                      {leadData.source || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Status:</p>
                  <p className="text-white">{getStatusText(leadData)}</p>
                </div>









                {/* Lead ID */}

                {/* Created at */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created at:</p>
                  <p className="text-white">{formatDate(leadData.createdAt)}</p>
                </div>


                {/* About - Full Width */}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">About:</p>
                  <p className="text-white">{leadData.about || "N/A"}</p>
                </div>


              </div>

              {/* Action Button */}
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleEditLeadFromView}
                  className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                >
                  Edit Lead
                </button>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="space-y-4 text-white">
              <h3 className="text-lg font-semibold mb-4">Special Note</h3>
              {(leadData.specialNote?.text || leadData.specialNote?.startDate || leadData.specialNote?.endDate) ? (
                <div className="border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {leadData.specialNote?.isImportant ? (
                      <AlertTriangle className="text-yellow-500" size={20} />
                    ) : (
                      <Info className="text-blue-500" size={20} />
                    )}
                    <p className="font-medium">
                      {leadData.specialNote?.isImportant ? "Important Note" : "Unimportant Note"}
                    </p>
                  </div>

                  {leadData.specialNote?.text && (
                    <div className="text-sm leading-relaxed mb-4">{leadData.specialNote.text}</div>
                  )}

                  {(leadData.specialNote?.startDate || leadData.specialNote?.endDate) && (
                    <div className="mt-3 bg-gray-800/50 p-3 rounded-md border-l-2 border-blue-500">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Start Date: </span>
                          <span className="text-white">{formatDate(leadData.specialNote?.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">End Date: </span>
                          <span className="text-white">{formatDate(leadData.specialNote?.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">No special note for this lead.</div>
              )}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleEditNote}
                  className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                >
                  Edit Note
                </button>
              </div>
            </div>
          )}

          {activeTab === "relations" && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
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
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                    <div className="grid grid-cols-5 gap-4 pt-8">
                      {Object.entries(leadRelationsData).map(([category, relations]) => (
                        <div key={category} className="flex flex-col items-center space-y-4">
                          <div className="w-0.5 h-8 bg-gray-600"></div>
                          <div
                            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${category === "family"
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
                          <div className="space-y-2">
                            {relations.map((relation) => (
                              <div
                                key={relation.id}
                                className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${relation.type === "member" || relation.type === "lead"
                                  ? "border border-blue-500/30"
                                  : ""
                                  }`}
                              >
                                <div className="text-white text-sm font-medium">{relation.name}</div>
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
              <div className="bg-[#161616] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                <div className="space-y-4">
                  {Object.entries(leadRelationsData).map(([category, relations]) => (
                    <div key={category}>
                      <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {relations.length > 0 ? (
                          relations.map((relation) => (
                            <div
                              key={relation.id}
                              className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${relation.type === "member" || relation.type === "lead"
                                ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                : ""
                                }`}
                            >
                              <div>
                                <span className="text-white font-medium">{relation.name}</span>
                                <span className="text-gray-400 ml-2">- {relation.relation}</span>
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

          {activeTab === "relations" && (
            <div className="flex-shrink-0 bg-[#1C1C1C] p-4 md:p-6 border-t border-gray-700 mt-6">
              <button
                onClick={handleEditRelations}
                className="w-full bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
              >
                Edit Relations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}