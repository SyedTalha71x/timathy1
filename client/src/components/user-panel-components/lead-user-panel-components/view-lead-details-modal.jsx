/* eslint-disable react/prop-types */
import { X, AlertTriangle, Info } from "lucide-react"
import { useEffect, useState } from "react"

const ViewLeadDetailsModal = ({
  isVisible,
  onClose,
  leadData,
  memberRelationsLead,
  onEditLead,
  columns = [], // Add columns prop
  initialTab = "details",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  // IMPORTANT: Update tab whenever initialTab changes
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Reset to details when modal closes
  useEffect(() => {
    if (!isVisible) {
      setActiveTab("details")
    }
  }, [isVisible])

  if (!isVisible || !leadData) return null

  const handleEditRelations = () => {
    onClose()
    onEditLead(leadData, "relations")
  }

  const handleEditNote = () => {
    onClose()
    onEditLead(leadData, "note")
  }

  // Get column title from columnId
  const getColumnTitle = (columnId) => {
    const column = columns.find(col => col.id === columnId)
    return column ? column.title : columnId
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
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
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
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "note" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Special Note
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "relations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Relations
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Name</p>
                  <p>{leadData.firstName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Name</p>
                  <p>{leadData.surname || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{leadData.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p>{leadData.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  <p className="capitalize">{leadData.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lead ID</p>
                  <p>{leadData.id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Street</p>
                  <p>{leadData.street || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ZIP Code</p>
                  <p>{leadData.zipCode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">City</p>
                  <p>{leadData.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Country</p>
                  <p>{leadData.country || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lead Source</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getSourceColor(leadData.leadSource)}`}>
                    {leadData.leadSource || "N/A"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p>{getColumnTitle(leadData.columnId || leadData.status) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created Date</p>
                  <p>{leadData.createdAt ? new Date(leadData.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
              {leadData.details && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">About</p>
                  <div className="bg-[#141414] rounded-xl px-4 py-3 text-sm break-words overflow-wrap-anywhere">
                    <p className="whitespace-pre-wrap">{leadData.details}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    onClose()
                    onEditLead(leadData)
                  }}
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
              {leadData.specialNote && leadData.specialNote.text ? (
                <div className="border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {leadData.specialNote.isImportant ? (
                      <AlertTriangle className="text-yellow-500" size={20} />
                    ) : (
                      <Info className="text-blue-500" size={20} />
                    )}
                    <p className="font-medium">
                      {leadData.specialNote.isImportant ? "Important Note" : "Note"}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{leadData.specialNote.text}</p>
                  {leadData.specialNote.startDate && leadData.specialNote.endDate && (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300">
                        Valid from {leadData.specialNote.startDate} to {leadData.specialNote.endDate}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">No special note for this lead.</div>
              )}
              <div className="flex justify-end mt-6">
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
                      {Object.entries(memberRelationsLead[leadData.id] || {}).map(([category, relations]) => (
                        <div key={category} className="flex flex-col items-center space-y-4">
                          <div className="w-0.5 h-8 bg-gray-600"></div>
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
                          <div className="space-y-2">
                            {relations.map((relation) => (
                              <div
                                key={relation.id}
                                className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${
                                  relation.type === "member" || relation.type === "lead"
                                    ? "border border-blue-500/30"
                                    : ""
                                }`}
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
                  {Object.entries(memberRelationsLead[leadData.id] || {}).map(([category, relations]) => (
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

export default ViewLeadDetailsModal
