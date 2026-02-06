/* eslint-disable react/prop-types */
import { X, Copy, Check, ChevronDown, ChevronUp, Globe } from "lucide-react"
import { useEffect, useState } from "react"

// Note Status Options
const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

const ViewLeadDetailsModal = ({
  isVisible,
  onClose,
  leadData,
  onEditLead,
  columns = [],
  initialTab = "details",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [expandedNoteId, setExpandedNoteId] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedTelephone, setCopiedTelephone] = useState(false)
  const [copiedStreet, setCopiedStreet] = useState(false)
  const [copiedZipCity, setCopiedZipCity] = useState(false)
  const [copiedFirstName, setCopiedFirstName] = useState(false)
  const [copiedLastName, setCopiedLastName] = useState(false)
  const [copiedGender, setCopiedGender] = useState(false)
  const [copiedLeadId, setCopiedLeadId] = useState(false)
  const [copiedCountry, setCopiedCountry] = useState(false)
  const [copiedDetails, setCopiedDetails] = useState(false)
  const [copiedBirthday, setCopiedBirthday] = useState(false)
  const [copiedStudioName, setCopiedStudioName] = useState(false)
  const [copiedWebsite, setCopiedWebsite] = useState(false)

  const getStatusInfo = (statusId) => {
    return NOTE_STATUSES.find(s => s.id === statusId) || NOTE_STATUSES.find(s => s.id === "general")
  }
  
  const formatNoteDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  
  // Get notes array (support both old and new format)
  const getNotes = () => {
    if (!leadData) return []
    if (leadData.notes && Array.isArray(leadData.notes)) {
      return leadData.notes
    }
    if (leadData.specialNote && leadData.specialNote.text) {
      return [{
        id: 1,
        status: "general",
        text: leadData.specialNote.text,
        isImportant: leadData.specialNote.isImportant || false,
        startDate: leadData.specialNote.startDate || "",
        endDate: leadData.specialNote.endDate || "",
        createdAt: leadData.createdAt || "",
      }]
    }
    return []
  }

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (!isVisible) {
      setActiveTab("details")
    }
  }, [isVisible])

  if (!isVisible || !leadData) return null

  const handleEditNote = () => {
    onClose()
    onEditLead(leadData, "note")
  }

  const handleCopy = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text || "")
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getColumnWithColor = (columnId) => {
    return columns.find(col => col.id === columnId)
  }

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

  const CopyButton = ({ value, copied, onCopy }) => (
    value ? (
      <button
        onClick={() => onCopy()}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Copy"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} className="text-gray-400 hover:text-white" />
        )}
      </button>
    ) : null
  )

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">
        {/* Sticky Header */}
        <div className="p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-white text-lg font-semibold">Lead Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
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
              Special Notes
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 pt-4 md:pt-6 overflow-y-auto flex-1">
          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4 text-white">
              {/* Studio Information */}
              <div className="space-y-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Studio Information</div>
                
                <div>
                  <p className="text-sm text-gray-400">Studio Name</p>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">{leadData.studioName || "-"}</p>
                    <CopyButton value={leadData.studioName} copied={copiedStudioName} onCopy={() => handleCopy(leadData.studioName, setCopiedStudioName)} />
                  </div>
                </div>

                {leadData.websiteLink && (
                  <div>
                    <p className="text-sm text-gray-400">Website</p>
                    <div className="flex items-center gap-3">
                      <a 
                        href={leadData.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Globe size={14} />
                        {leadData.websiteLink.replace(/^https?:\/\//, '')}
                      </a>
                      <CopyButton value={leadData.websiteLink} copied={copiedWebsite} onCopy={() => handleCopy(leadData.websiteLink, setCopiedWebsite)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Operator Information */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Studio Owner</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Studio Owner First Name</p>
                    <div className="flex items-center gap-3">
                      <p>{leadData.firstName || "-"}</p>
                      <CopyButton value={leadData.firstName} copied={copiedFirstName} onCopy={() => handleCopy(leadData.firstName, setCopiedFirstName)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Studio Owner Last Name</p>
                    <div className="flex items-center gap-3">
                      <p>{leadData.surname || "-"}</p>
                      <CopyButton value={leadData.surname} copied={copiedLastName} onCopy={() => handleCopy(leadData.surname, setCopiedLastName)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Gender</p>
                    <p className="capitalize">{leadData.gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Birthday</p>
                    <div className="flex items-center gap-3">
                      <p>
                        {leadData.birthday 
                          ? (() => {
                              const birthDate = new Date(leadData.birthday)
                              const today = new Date()
                              let age = today.getFullYear() - birthDate.getFullYear()
                              const monthDiff = today.getMonth() - birthDate.getMonth()
                              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                age--
                              }
                              return `${birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (Age: ${age})`
                            })()
                          : "-"}
                      </p>
                      <CopyButton value={leadData.birthday} copied={copiedBirthday} onCopy={() => handleCopy(leadData.birthday, setCopiedBirthday)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact Information</div>
                
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <div className="flex items-center gap-3">
                    <p>{leadData.email || "-"}</p>
                    <CopyButton value={leadData.email} copied={copiedEmail} onCopy={() => handleCopy(leadData.email, setCopiedEmail)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Mobile Number</p>
                    <div className="flex items-center gap-3">
                      <p>{leadData.phoneNumber || "-"}</p>
                      <CopyButton value={leadData.phoneNumber} copied={copiedPhone} onCopy={() => handleCopy(leadData.phoneNumber, setCopiedPhone)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Telephone Number</p>
                    <div className="flex items-center gap-3">
                      <p>{leadData.telephoneNumber || "-"}</p>
                      <CopyButton value={leadData.telephoneNumber} copied={copiedTelephone} onCopy={() => handleCopy(leadData.telephoneNumber, setCopiedTelephone)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Address</div>
                
                <div>
                  <p className="text-sm text-gray-400">Street & Number</p>
                  <div className="flex items-center gap-3">
                    <p>{leadData.street || "-"}</p>
                    <CopyButton value={leadData.street} copied={copiedStreet} onCopy={() => handleCopy(leadData.street, setCopiedStreet)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">ZIP Code & City</p>
                    <div className="flex items-center gap-3">
                      <p>{`${leadData.zipCode || ""} ${leadData.city || ""}`.trim() || "-"}</p>
                      <CopyButton value={`${leadData.zipCode || ""} ${leadData.city || ""}`.trim()} copied={copiedZipCity} onCopy={() => handleCopy(`${leadData.zipCode || ""} ${leadData.city || ""}`.trim(), setCopiedZipCity)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <div className="flex items-center gap-3">
                      <p>{leadData.country || "-"}</p>
                      <CopyButton value={leadData.country} copied={copiedCountry} onCopy={() => handleCopy(leadData.country, setCopiedCountry)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Information */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Lead Information</div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Lead Source</p>
                    {leadData.leadSource ? (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getSourceColor(leadData.leadSource)}`}>
                        {leadData.leadSource}
                      </span>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    {(() => {
                      const column = getColumnWithColor(leadData.columnId)
                      return column ? (
                        <span 
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: column.color + '20', 
                            color: column.color 
                          }}
                        >
                          {column.title}
                        </span>
                      ) : (
                        <p className="capitalize">{leadData.status || "-"}</p>
                      )
                    })()}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Details / Notes</p>
                  <div className="flex items-start gap-3">
                    <p className="text-gray-200 whitespace-pre-wrap">{leadData.details || "-"}</p>
                    <CopyButton value={leadData.details} copied={copiedDetails} onCopy={() => handleCopy(leadData.details, setCopiedDetails)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Lead ID</p>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-400 text-sm">{leadData.id || "-"}</p>
                      <CopyButton value={leadData.id} copied={copiedLeadId} onCopy={() => handleCopy(leadData.id, setCopiedLeadId)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created Date</p>
                    <p>
                      {leadData.createdAt 
                        ? new Date(leadData.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="space-y-4 text-white pb-16">
              {/* Lead Name Header */}
              <div className="mb-2 pb-3 border-b border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                <p className="text-white font-bold">{leadData.studioName || `${leadData.firstName} ${leadData.surname}`}</p>
                {leadData.studioName && (
                  <p className="text-gray-400 text-sm">{leadData.firstName} {leadData.surname}</p>
                )}
              </div>
              
              {/* Notes List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getNotes().length > 0 ? (
                  [...getNotes()]
                    .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                    .map((note) => {
                    const statusInfo = getStatusInfo(note.status)
                    const isExpanded = expandedNoteId === note.id
                    
                    return (
                      <div
                        key={note.id}
                        className="bg-[#1a1a1a] rounded-lg overflow-hidden"
                      >
                        <div 
                          className="flex items-center justify-between p-3 cursor-pointer"
                          onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                              {statusInfo.label}
                            </span>
                            {note.isImportant && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-red-500">
                                Important
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {!isExpanded && (
                          <div className="px-3 pb-2">
                            <p className="text-gray-400 text-sm truncate">
                              {note.text}
                            </p>
                            {(note.startDate || note.endDate) && (
                              <p className="text-xs text-gray-600 mt-1">
                                {note.startDate && note.endDate ? (
                                  <>Valid: {note.startDate} - {note.endDate}</>
                                ) : note.startDate ? (
                                  <>Valid from: {note.startDate}</>
                                ) : (
                                  <>Valid until: {note.endDate}</>
                                )}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-gray-800">
                            <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">
                              {note.text}
                            </p>
                            {(note.startDate || note.endDate) && (
                              <div className="mt-2 text-xs text-gray-500">
                                {note.startDate && note.endDate ? (
                                  <>Valid: {note.startDate} - {note.endDate}</>
                                ) : note.startDate ? (
                                  <>Valid from: {note.startDate}</>
                                ) : (
                                  <>Valid until: {note.endDate}</>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-gray-400 text-center py-8">No special notes for this lead.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer with Edit Buttons */}
        <div className="flex-shrink-0 bg-[#1C1C1C] px-4 md:px-6 py-4 border-t border-gray-700">
          <div className="flex justify-end">
            {activeTab === "details" && (
              <button
                onClick={() => {
                  onClose()
                  onEditLead(leadData)
                }}
                className="bg-orange-500 text-sm text-white px-4 py-2 rounded-xl hover:bg-orange-600"
              >
                Edit Lead
              </button>
            )}
            {activeTab === "note" && (
              <button
                onClick={handleEditNote}
                className="bg-orange-500 text-sm text-white px-4 py-2 rounded-xl"
              >
                Edit Special Notes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewLeadDetailsModal
