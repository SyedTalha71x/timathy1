/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react"
import { X, Copy, Check, ChevronDown, ChevronUp, Building } from "lucide-react"

// ── InitialsAvatar (blue gradient for franchises) ──
const InitialsAvatar = ({ name, size = "lg", className = "" }) => {
  const getInitials = (n) => {
    if (!n) return "?"
    const parts = n.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return n.substring(0, 2).toUpperCase()
  }
  const sizeClasses = { sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-sm" }
  return (
    <div className={`rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 ${sizeClasses[size] || sizeClasses.lg} ${className}`}>
      <span className="text-white font-bold">{getInitials(name)}</span>
    </div>
  )
}

const hasCustomImage = (url) => {
  if (!url) return false
  if (typeof url !== "string") return false
  if (url.includes("gray-avatar") || url.includes("default") || url.includes("placeholder")) return false
  return url.trim().length > 0
}

// ── CopyField ──
const CopyField = ({ label, value, children }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { console.error(err) }
  }
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <div className="flex items-center gap-3">
        {children || <p className="text-white">{value || "–"}</p>}
        {value && (
          <button onClick={handleCopy} className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0" title={`Copy ${label.toLowerCase()}`}>
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400 hover:text-white" />}
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// FranchiseDetailsModal
// ════════════════════════════════════════════
const FranchiseDetailsModal = ({
  isOpen,
  onClose,
  franchise,
  onEditFranchise,
  onArchiveFranchise,
  assignedStudios = [],
}) => {
  const [activeTab, setActiveTab] = useState("details")
  const [expandedNote, setExpandedNote] = useState(false)

  useEffect(() => {
    if (!isOpen) { setActiveTab("details"); setExpandedNote(false) }
  }, [isOpen])

  if (!isOpen || !franchise) return null

  const handleArchive = () => {
    if (window.confirm(`Are you sure you want to ${franchise.isArchived ? "unarchive" : "archive"} "${franchise.name}"?`)) {
      onArchiveFranchise(franchise.id)
      onClose()
    }
  }

  const tabs = [
    { id: "details", label: "Details" },
    { id: "studios", label: `Studios (${assignedStudios.length})` },
    { id: "credentials", label: "Credentials" },
    { id: "note", label: "Special Notes" },
  ]

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[9999]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">

        {/* ── Sticky Header ── */}
        <div className="p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-white text-lg font-semibold">Franchise Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="p-4 md:p-6 pt-4 md:pt-6 overflow-y-auto flex-1">

          {/* ═══ DETAILS TAB ═══ */}
          {activeTab === "details" && (
            <div className="space-y-4 text-white">

              {/* Identity */}
              <div className="space-y-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Franchise Information</div>
                <div className="flex items-center gap-4">
                  {hasCustomImage(franchise.logo || franchise.img) ? (
                    <img src={franchise.logo || franchise.img} alt="Logo" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <InitialsAvatar name={franchise.name} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{franchise.name}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 font-medium">Franchise</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      !franchise.isArchived ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${!franchise.isArchived ? "bg-green-400" : "bg-red-400"}`} />
                      {franchise.isArchived ? "Archived" : "Active"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="Franchise Name" value={franchise.name} />
                  <CopyField label="Owner" value={`${franchise.ownerFirstName || ""} ${franchise.ownerLastName || ""}`.trim() || "–"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Studios</p>
                    <span className="inline-flex items-center gap-1.5 text-white">
                      <Building size={14} className="text-purple-400" />
                      {assignedStudios.length} assigned
                    </span>
                  </div>
                  {franchise.createdDate && (
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white">{new Date(franchise.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact Information</div>
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="Email" value={franchise.email} />
                  <CopyField label="Phone" value={franchise.phone} />
                </div>
                <CopyField label="Website" value={franchise.website} />
              </div>

              {/* Address */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Address</div>
                <CopyField label="Street" value={franchise.street} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="ZIP Code & City" value={franchise.zipCode && franchise.city ? `${franchise.zipCode} ${franchise.city}` : franchise.city || ""} />
                  <CopyField label="Country" value={franchise.country} />
                </div>
              </div>

              {/* About */}
              {franchise.about && (
                <div className="pt-4 border-t border-gray-700">
                  <CopyField label="About" value={franchise.about}>
                    <div className="bg-[#141414] rounded-xl px-4 py-3 text-sm break-words flex-1">
                      <p className="whitespace-pre-wrap text-white">{franchise.about}</p>
                    </div>
                  </CopyField>
                </div>
              )}
            </div>
          )}

          {/* ═══ STUDIOS TAB ═══ */}
          {activeTab === "studios" && (
            <div className="space-y-4 text-white">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Assigned Studios</div>
              {assignedStudios.length > 0 ? (
                <div className="space-y-2">
                  {assignedStudios.map((studio) => (
                    <div key={studio.id} className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {studio.name ? studio.name.substring(0, 2).toUpperCase() : "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{studio.name}</p>
                        <p className="text-xs text-gray-500">{studio.city}{studio.zipCode ? `, ${studio.zipCode}` : ""}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        studio.isActive !== false ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${studio.isActive !== false ? "bg-green-400" : "bg-red-400"}`} />
                        {studio.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Building size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No studios assigned to this franchise yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ CREDENTIALS TAB ═══ */}
          {activeTab === "credentials" && (
            <div className="space-y-4 text-white">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Login Credentials</div>
              <div className="bg-[#141414] rounded-xl p-4 space-y-4">
                <CopyField label="Login Email" value={franchise.loginEmail} />
                <div>
                  <p className="text-sm text-gray-400">Password</p>
                  <p className="text-white tracking-widest">••••••••</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SPECIAL NOTES TAB ═══ */}
          {activeTab === "note" && (
            <div className="space-y-4 text-white pb-16">
              <div className="mb-2 pb-3 border-b border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Special Notes for</p>
                <p className="text-white font-medium">{franchise.name}</p>
              </div>

              {franchise.specialNote ? (
                <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setExpandedNote(!expandedNote)}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">General</span>
                      {(franchise.noteImportance === "important" || franchise.noteImportance === "critical") && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-red-500">Important</span>
                      )}
                    </div>
                    {expandedNote ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                  {!expandedNote && (
                    <div className="px-3 pb-2">
                      <p className="text-gray-400 text-sm truncate">{franchise.specialNote}</p>
                      {(franchise.noteStartDate || franchise.noteEndDate) && (
                        <p className="text-xs text-gray-600 mt-1">
                          {franchise.noteStartDate && franchise.noteEndDate
                            ? <>Valid: {franchise.noteStartDate} – {franchise.noteEndDate}</>
                            : franchise.noteStartDate
                              ? <>Valid from: {franchise.noteStartDate}</>
                              : <>Valid until: {franchise.noteEndDate}</>}
                        </p>
                      )}
                    </div>
                  )}
                  {expandedNote && (
                    <div className="px-3 pb-3 border-t border-gray-800">
                      <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">{franchise.specialNote}</p>
                      {(franchise.noteStartDate || franchise.noteEndDate) && (
                        <div className="mt-2 text-xs text-gray-500">
                          {franchise.noteStartDate && franchise.noteEndDate
                            ? <>Valid: {franchise.noteStartDate} – {franchise.noteEndDate}</>
                            : franchise.noteStartDate
                              ? <>Valid from: {franchise.noteStartDate}</>
                              : <>Valid until: {franchise.noteEndDate}</>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">No special notes for this franchise.</div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky Footer ── */}
        <div className="flex-shrink-0 bg-[#1C1C1C] px-4 md:px-6 py-4 border-t border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleArchive}
              className={`text-sm px-4 py-2 rounded-xl transition-colors ${
                franchise.isArchived ? "bg-[#2F2F2F] text-white hover:bg-[#3F3F3F]" : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {franchise.isArchived ? "Unarchive" : "Archive"}
            </button>
            <button
              onClick={() => { onClose(); if (onEditFranchise) onEditFranchise(franchise) }}
              className="bg-orange-500 text-sm text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FranchiseDetailsModal
