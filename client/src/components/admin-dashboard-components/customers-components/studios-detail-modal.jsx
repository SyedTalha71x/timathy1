/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { X, Copy, Check, ChevronDown, ChevronUp, Shield } from "lucide-react"
import { HiOutlineUsers } from "react-icons/hi2"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { FaPersonRays } from "react-icons/fa6"

// Note Status Options (studio-context)
const NOTE_STATUSES = [
  { id: "general", label: "General" },
  { id: "contract_issue", label: "Contract Issue" },
  { id: "onboarding", label: "Onboarding" },
  { id: "follow_up", label: "Follow-up" },
  { id: "compliance", label: "Compliance" },
  { id: "maintenance", label: "Maintenance" },
  { id: "escalation", label: "Escalation" },
]

// Access Role badge colors
const ACCESS_ROLE_STYLES = {
  Premium: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  Standard: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  Basic: { bg: "bg-gray-500/15", text: "text-gray-400", border: "border-gray-500/30" },
}

// Source pill colors
const getSourceColor = (source) => {
  const c = {
    Website: "bg-blue-600 text-blue-100",
    "Google Ads": "bg-green-600 text-green-100",
    "Social Media Ads": "bg-purple-600 text-purple-100",
    "Email Campaign": "bg-orange-600 text-orange-100",
    "Cold Call (Outbound)": "bg-red-600 text-red-100",
    "Inbound Call": "bg-emerald-600 text-emerald-100",
    Referral: "bg-teal-600 text-teal-100",
    "Social Media": "bg-purple-600 text-purple-100",
    "Walk-in": "bg-amber-600 text-amber-100",
    "Phone Call": "bg-cyan-600 text-cyan-100",
    Email: "bg-orange-600 text-orange-100",
    Event: "bg-yellow-600 text-yellow-100",
    "Offline Advertising": "bg-pink-600 text-pink-100",
    Other: "bg-gray-600 text-gray-100",
  }
  return c[source] || "bg-gray-600 text-gray-100"
}

// Days of the week (same order as configuration)
const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

// ── Inline InitialsAvatar (matches customers.jsx) ──
const InitialsAvatar = ({ name, className = "" }) => {
  const getInitials = (n) => {
    if (!n) return "?"
    const parts = n.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return n.substring(0, 2).toUpperCase()
  }
  return (
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className="text-white font-bold text-sm">{getInitials(name)}</span>
    </div>
  )
}

// ── Helper: check for real custom image ──
const hasCustomImage = (url) => {
  if (!url) return false
  if (url.includes("gray-avatar") || url.includes("default")) return false
  return true
}

// ── Reusable CopyField ──
const CopyField = ({ label, value, children }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { console.error("Copy failed:", err) }
  }
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <div className="flex items-center gap-3">
        {children || <p className="text-white">{value || "-"}</p>}
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
// Main Modal
// ════════════════════════════════════════════
const StudioDetailsModal = ({
  isOpen,
  onClose,
  studio,
  franchises = [],
  studioStats = {},
  DefaultStudioImage,
  isContractExpiringSoon,
  onEditStudio,
  onViewFranchiseDetails,
  initialTab = "details",
}) => {
  const { t, i18n } = useTranslation()

  // Translation helpers
  const dayLabels = {
    "Monday": t("admin.customers.studioDetails.days.monday"),
    "Tuesday": t("admin.customers.studioDetails.days.tuesday"),
    "Wednesday": t("admin.customers.studioDetails.days.wednesday"),
    "Thursday": t("admin.customers.studioDetails.days.thursday"),
    "Friday": t("admin.customers.studioDetails.days.friday"),
    "Saturday": t("admin.customers.studioDetails.days.saturday"),
    "Sunday": t("admin.customers.studioDetails.days.sunday"),
  }
  const tDay = (d) => dayLabels[d] || d

  const sourceLabels = {
    "Website": t("admin.customers.shared.sources.website"),
    "Google Ads": t("admin.customers.shared.sources.googleAds"),
    "Social Media Ads": t("admin.customers.shared.sources.socialMediaAds"),
    "Email Campaign": t("admin.customers.shared.sources.emailCampaign"),
    "Cold Call (Outbound)": t("admin.customers.shared.sources.coldCall"),
    "Inbound Call": t("admin.customers.shared.sources.inboundCall"),
    "Referral": t("admin.customers.shared.sources.referral"),
    "Social Media": t("admin.customers.shared.sources.socialMedia"),
    "Walk-in": t("admin.customers.shared.sources.walkin"),
    "Phone Call": t("admin.customers.shared.sources.phoneCall"),
    "Email": t("admin.customers.shared.email"),
    "Event": t("admin.customers.shared.sources.event"),
    "Offline Advertising": t("admin.customers.shared.sources.offlineAd"),
    "Other": t("admin.customers.shared.sources.other"),
  }
  const tSource = (s) => sourceLabels[s] || s

  const [activeTab, setActiveTab] = useState("details")
  const [expandedNoteId, setExpandedNoteId] = useState(null)

  const getStatusInfo = (statusId) =>
    NOTE_STATUSES.find((s) => s.id === statusId) || NOTE_STATUSES.find((s) => s.id === "general")

  // Notes array (old + new format)
  const getNotes = () => {
    if (!studio) return []
    if (studio.notes && Array.isArray(studio.notes)) return studio.notes
    if (studio.note && studio.note.trim()) {
      return [{
        id: 1, status: "general", text: studio.note,
        isImportant: studio.noteImportance === "important" || studio.noteImportance === "critical",
        startDate: studio.noteStartDate || "", endDate: studio.noteEndDate || "",
        createdAt: studio.contractStart || new Date().toISOString(),
      }]
    }
    return []
  }

  useEffect(() => { setActiveTab(initialTab) }, [initialTab])
  useEffect(() => { if (!isOpen) { setActiveTab("details"); setExpandedNoteId(null) } }, [isOpen])

  if (!isOpen || !studio) return null

  const franchise = franchises.find((f) => f.id === studio.franchiseId)
  const role = studio.accessRole || "Standard"
  const roleStyle = ACCESS_ROLE_STYLES[role] || ACCESS_ROLE_STYLES.Standard
  const stats = studioStats[studio.id] || {}

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">

        {/* ── Sticky Header ── */}
        <div className="p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-white text-lg font-semibold">{t("admin.customers.studioDetails.title")}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: "details", label: t("admin.customers.shared.details") },
              { id: "payment", label: t("admin.customers.studioDetails.payment") },
              { id: "note", label: t("admin.customers.shared.specialNotes") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium ${
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

          {/* ═══════════ DETAILS TAB ═══════════ */}
          {activeTab === "details" && (
            <div className="space-y-4 text-white">

              {/* Studio Identity */}
              <div className="space-y-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t("admin.customers.studioDetails.info")}</div>

                <div className="flex items-center gap-4">
                  {hasCustomImage(studio.image) ? (
                    <img src={studio.image} alt="Studio" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <InitialsAvatar name={studio.name} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{studio.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                        <Shield size={10} />
                        {role}
                      </span>
                    </div>
                    {franchise && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-purple-400 text-sm">{t("admin.customers.tabs.franchise")}: {franchise.name}</span>
                        {onViewFranchiseDetails && (
                          <button onClick={() => onViewFranchiseDetails(franchise)} className="text-blue-400 hover:text-blue-300 text-xs underline">{t("admin.customers.studioDetails.view")}</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CopyField label={t("admin.customers.studioDetails.name")} value={studio.name} />
                  <CopyField label={t("admin.customers.studioDetails.number")} value={studio.studioNumber} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CopyField label={t("admin.customers.shared.owner")} value={studio.ownerName} />
                  <div>
                    <p className="text-sm text-gray-400">{t("admin.customers.shared.status")}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                      studio.isActive ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${studio.isActive ? "bg-green-400" : "bg-red-400"}`} />
                      {studio.isActive ? t("admin.customers.shared.active") : t("admin.customers.shared.inactive")}
                    </span>
                  </div>
                </div>

                {/* Access Role & Source */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">{t("admin.customers.shared.accessRole")}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium mt-0.5 border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                      <Shield size={12} />{role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t("admin.customers.shared.source")}</p>
                    {studio.leadSource ? (
                      <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium mt-0.5 ${getSourceColor(studio.leadSource)}`}>{tSource(studio.leadSource)}</span>
                    ) : (
                      <p className="text-white mt-0.5">-</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t("admin.customers.shared.contactInfo")}</div>
                <CopyField label={t("admin.customers.shared.email")} value={studio.email} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label={t("admin.customers.shared.phone")} value={studio.phone} />
                  <CopyField label={t("admin.customers.shared.website")} value={studio.website} />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t("admin.customers.shared.address")}</div>
                <CopyField label={t("admin.customers.shared.street")} value={studio.street} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label={t("admin.customers.shared.zipCodeCity")} value={studio.zipCode && studio.city ? `${studio.zipCode} ${studio.city}` : studio.zipCode || studio.city || ""} />
                  <CopyField label={t("admin.customers.shared.country")} value={studio.country} />
                </div>
              </div>

              {/* Contract */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t("admin.customers.studioDetails.contract")}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">{t("admin.customers.studioDetails.contractStart")}</p>
                    <p className="text-white">{studio.contractStart ? new Date(studio.contractStart).toLocaleDateString(i18n.language, { month: "short", day: "numeric", year: "numeric" }) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t("admin.customers.studioDetails.contractEnd")}</p>
                    <p className={isContractExpiringSoon?.(studio.contractEnd) ? "text-red-400" : "text-white"}>{studio.contractEnd ? new Date(studio.contractEnd).toLocaleDateString(i18n.language, { month: "short", day: "numeric", year: "numeric" }) : "-"}</p>
                  </div>
                </div>
              </div>

              {/* Statistics – white icons matching customers menu */}
              <div className="pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">{t("admin.customers.studioDetails.statistics")}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#141414] rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <HiOutlineUsers size={15} className="text-white" />
                      <p className="text-lg font-semibold">{stats.members || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t("admin.customers.studioDetails.members")}</p>
                  </div>
                  <div className="bg-[#141414] rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <FaPersonRays size={15} className="text-white" />
                      <p className="text-lg font-semibold">{stats.leads || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t("admin.customers.permissionModal.leads")}</p>
                  </div>
                  <div className="bg-[#141414] rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <BsPersonWorkspace size={15} className="text-white" />
                      <p className="text-lg font-semibold">{stats.trainers || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t("admin.customers.permissionModal.staff")}</p>
                  </div>
                  <div className="bg-[#141414] rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <RiContractLine size={15} className="text-white" />
                      <p className="text-lg font-semibold">{stats.contracts || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t("admin.customers.studioDetails.contracts")}</p>
                  </div>
                </div>
              </div>

              {/* Opening Hours – clean block */}
              <div className="pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">{t("admin.customers.studioDetails.openingHours")}</div>
                {studio.openingHours && typeof studio.openingHours === "object" ? (
                  <div className="bg-[#141414] rounded-xl overflow-hidden divide-y divide-[#222]">
                    {DAYS_OF_WEEK.map(({ key, label }) => {
                      const value = studio.openingHours[key]
                      const isClosed = !value || value.toLowerCase() === "closed"
                      return (
                        <div key={key} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-sm font-medium text-white">{tDay(label)}</span>
                          <span className={`text-sm ${isClosed ? "text-gray-500" : "text-white"}`}>
                            {isClosed ? t("admin.customers.studioDetails.closed") : value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">{t("admin.customers.studioDetails.noHours")}</p>
                )}
              </div>

              {/* About */}
              {studio.about && (
                <div className="pt-4 border-t border-gray-700">
                  <CopyField label={t("admin.customers.shared.about")} value={studio.about}>
                    <div className="bg-[#141414] rounded-xl px-4 py-3 text-sm break-words flex-1">
                      <p className="whitespace-pre-wrap text-white">{studio.about}</p>
                    </div>
                  </CopyField>
                </div>
              )}
            </div>
          )}

          {/* ═══════════ PAYMENT TAB ═══════════ */}
          {activeTab === "payment" && (
            <div className="space-y-4 text-white">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t("admin.customers.studioDetails.paymentSettings")}</div>

              <div className="bg-[#141414] rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CopyField label={t("admin.customers.studioDetails.creditorName")} value={studio.creditorName} />
                  <CopyField label={t("admin.customers.studioDetails.creditorId")} value={studio.creditorId}>
                    <div>
                      <p className="text-white">{studio.creditorId || "-"}</p>
                      {studio.creditorId && <p className="text-xs text-gray-500 mt-0.5">{t("admin.customers.studioDetails.sepaCreditor")}</p>}
                    </div>
                  </CopyField>
                  <CopyField label={t("admin.customers.studioDetails.vatNumber")} value={studio.vatNumber} />
                  <CopyField label={t("admin.customers.payment.bankName")} value={studio.bankName} />
                  <CopyField label={t("admin.customers.payment.iban")} value={studio.iban}>
                    <div>
                      <p className="text-white">{studio.iban || "-"}</p>
                      {studio.iban && <p className="text-xs text-gray-500 mt-0.5">{t("admin.customers.studioDetails.ibanFull")}</p>}
                    </div>
                  </CopyField>
                  <CopyField label={t("admin.customers.payment.bic")} value={studio.bic}>
                    <div>
                      <p className="text-white">{studio.bic || "-"}</p>
                      {studio.bic && <p className="text-xs text-gray-500 mt-0.5">{t("admin.customers.studioDetails.bicFull")}</p>}
                    </div>
                  </CopyField>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ SPECIAL NOTES TAB ═══════════ */}
          {activeTab === "note" && (
            <div className="space-y-4 text-white pb-16">
              <div className="mb-2 pb-3 border-b border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t("admin.customers.shared.specialNotesFor")}</p>
                <p className="text-white font-medium">{studio.name}</p>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getNotes().length > 0 ? (
                  [...getNotes()]
                    .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                    .map((note) => {
                      const statusInfo = getStatusInfo(note.status)
                      const isExpanded = expandedNoteId === note.id
                      return (
                        <div key={note.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">{statusInfo.label}</span>
                              {note.isImportant && <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-red-500">{t("admin.customers.shared.important")}</span>}
                            </div>
                            <div className="flex items-center">
                              {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </div>
                          </div>
                          {!isExpanded && (
                            <div className="px-3 pb-2">
                              <p className="text-gray-400 text-sm truncate">{note.text}</p>
                              {(note.startDate || note.endDate) && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {note.startDate && note.endDate ? t("admin.customers.shared.validRange", { start: note.startDate, end: note.endDate }) : note.startDate ? t("admin.customers.shared.validFromDate", { date: note.startDate }) : t("admin.customers.shared.validUntilDate", { date: note.endDate })}
                                </p>
                              )}
                            </div>
                          )}
                          {isExpanded && (
                            <div className="px-3 pb-3 border-t border-gray-800">
                              <p className="text-white text-sm mt-2 whitespace-pre-wrap break-words">{note.text}</p>
                              {(note.startDate || note.endDate) && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {note.startDate && note.endDate ? t("admin.customers.shared.validRange", { start: note.startDate, end: note.endDate }) : note.startDate ? t("admin.customers.shared.validFromDate", { date: note.startDate }) : t("admin.customers.shared.validUntilDate", { date: note.endDate })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                ) : (
                  <div className="text-gray-400 text-center py-8">{t("admin.customers.studioDetails.noNotes")}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky Footer ── */}
        <div className="flex-shrink-0 bg-[#1C1C1C] px-4 md:px-6 py-4 border-t border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={() => { onClose(); if (onEditStudio) onEditStudio(studio) }}
              className="bg-orange-500 text-sm text-white px-4 py-2 rounded-xl hover:bg-orange-600"
            >
              {t("common.edit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioDetailsModal
