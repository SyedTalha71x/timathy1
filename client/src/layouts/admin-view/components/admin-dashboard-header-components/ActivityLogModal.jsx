/* eslint-disable react/prop-types */
import { useState, useMemo } from "react"
import { X, Clock, ChevronDown, ChevronRight, CalendarDays, User } from "lucide-react"
import { useTranslation } from "react-i18next"

// ============================================
// Category filters — matches admin sidebar menu items
// ============================================
const CATEGORIES = (t) => [
  { key: "all", label: t("admin.activityLog.categories.all") },
  { key: "customers", label: t("admin.activityLog.categories.customers") },
  { key: "contracts", label: t("admin.activityLog.categories.contracts") },
  { key: "leads", label: t("admin.activityLog.categories.leads") },
  { key: "demo-access", label: t("admin.activityLog.categories.demoAccess") },
  { key: "support", label: t("admin.activityLog.categories.support") },
  { key: "email", label: t("admin.activityLog.categories.email") },
  { key: "finances", label: t("admin.activityLog.categories.finances") },
  { key: "notes", label: t("admin.activityLog.categories.notes") },
  { key: "exercises", label: t("admin.activityLog.categories.exercises") },
  { key: "marketplace", label: t("admin.activityLog.categories.marketplace") },
  { key: "configuration", label: t("admin.activityLog.categories.configuration") },
]

// ============================================
// Staff members (replace with real data later)
// ============================================
const STAFF_MEMBERS = [
  { id: "all", name: "All Staff" },
  { id: "justin", name: "Justin M" },
  { id: "anna", name: "Anna K" },
  { id: "system", name: "System" },
]

// ============================================
// Sample activity log data (replace with API call later)
// ============================================
const ACTIVITY_LOGS = [
  {
    id: 1,
    actionType: "appointment_created",
    descKey: "appointment_created", descParams: { name: "John Doe" },
    timestamp: "2024-12-15T14:30:00",
    category: "customers",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "service", to: "Personal Training" },
      { fieldKey: "date", to: "Dec 20, 2024 at 10:00 AM" },
      { fieldKey: "duration", to: "60 min" },
      { fieldKey: "trainer", to: "Justin M" },
    ],
  },
  {
    id: 2,
    actionType: "member_updated",
    descKey: "member_updated", descParams: { name: "Sarah Smith" },
    timestamp: "2024-12-15T13:15:00",
    category: "customers",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "email", from: "sarah.old@mail.com", to: "sarah.smith@mail.com" },
      { fieldKey: "phone", from: "+49 170 1234567", to: "+49 170 9876543" },
    ],
  },
  {
    id: 3,
    actionType: "contract_created",
    descKey: "contract_created", descParams: { name: "Mike Johnson" },
    timestamp: "2024-12-15T11:45:00",
    category: "contracts",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "type", to: "Premium Membership" },
      { fieldKey: "duration", to: "12 months" },
      { fieldKey: "monthlyFee", to: "49.90 EUR" },
      { fieldKey: "startDate", to: "Jan 01, 2025" },
    ],
  },
  {
    id: 4,
    actionType: "lead_converted",
    descKey: "lead_converted", descParams: { name: "Lisa Garcia" },
    timestamp: "2024-12-15T10:20:00",
    category: "leads",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "status", from: "Lead", to: "Active Member" },
      { fieldKey: "contract", to: "Basic Membership - 6 months" },
      { fieldKey: "source", to: "Instagram" },
    ],
  },
  {
    id: 5,
    actionType: "payment_processed",
    descKey: "payment_processed", descParams: { name: "Emily Brown" },
    timestamp: "2024-12-15T09:30:00",
    category: "finances",
    user: { id: "system", name: "System" },
    changes: [
      { fieldKey: "amount", to: "39.90 EUR" },
      { fieldKey: "method", to: "SEPA Direct Debit" },
      { fieldKey: "invoice", to: "#INV-2024-1582" },
    ],
  },
  {
    id: 6,
    actionType: "demo_access_granted",
    descKey: "demo_access_granted", descParams: { name: "Studio Fit Berlin" },
    timestamp: "2024-12-14T16:45:00",
    category: "demo-access",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "studio", to: "Studio Fit Berlin" },
      { fieldKey: "template", to: "Full Access" },
      { fieldKey: "expires", to: "Dec 28, 2024" },
    ],
  },
  {
    id: 7,
    actionType: "exercise_uploaded",
    descKey: "exercise_uploaded", descParams: { name: "HIIT Power Burpees" },
    timestamp: "2024-12-14T15:20:00",
    category: "exercises",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "name", to: "HIIT Power Burpees" },
      { fieldKey: "difficulty", to: "Advanced" },
      { fieldKey: "muscles", to: "Full Body, Core" },
    ],
  },
  {
    id: 8,
    actionType: "contract_renewed",
    descKey: "contract_renewed", descParams: { name: "Lisa Garcia" },
    timestamp: "2024-12-14T14:10:00",
    category: "contracts",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "duration", from: "6 months", to: "12 months" },
      { fieldKey: "monthlyFee", from: "39.90 EUR", to: "34.90 EUR" },
      { fieldKey: "endDate", from: "Mar 01, 2025", to: "Sep 01, 2025" },
    ],
  },
  {
    id: 9,
    actionType: "ticket_resolved",
    descKey: "ticket_resolved", descParams: { ticket: "#1042", name: "Studio Fit Berlin" },
    timestamp: "2024-12-14T12:00:00",
    category: "support",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "status", from: "Open", to: "Resolved" },
      { fieldKey: "resolution", to: "Bug fixed in booking calendar" },
    ],
  },
  {
    id: 10,
    actionType: "product_added",
    descKey: "product_added", descParams: { name: "Premium Yoga Mat" },
    timestamp: "2024-12-14T10:30:00",
    category: "marketplace",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "name", to: "Premium Yoga Mat" },
      { fieldKey: "price", to: "29.90 EUR" },
      { fieldKey: "brand", to: "YogaPro" },
      { fieldKey: "status", to: "Active" },
    ],
  },
  {
    id: 11,
    actionType: "email_campaign_sent",
    descKey: "email_campaign_sent", descParams: { count: "342" },
    timestamp: "2024-12-13T16:00:00",
    category: "email",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "subject", to: "December Promotions" },
      { fieldKey: "recipients", to: "342" },
      { fieldKey: "template", to: "Monthly Newsletter" },
    ],
  },
  {
    id: 12,
    actionType: "configuration_updated",
    descKey: "configuration_updated", descParams: { setting: "SMTP", purpose: "email delivery" },
    timestamp: "2024-12-13T11:00:00",
    category: "configuration",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "smtpServer", from: "smtp.old-provider.com", to: "smtp.new-provider.com" },
      { fieldKey: "port", from: "465", to: "587" },
      { fieldKey: "encryption", from: "SSL", to: "TLS" },
    ],
  },
  {
    id: 13,
    actionType: "payment_failed",
    descKey: "payment_failed", descParams: { name: "Chris Evans" },
    timestamp: "2024-12-13T09:15:00",
    category: "finances",
    user: { id: "system", name: "System" },
    changes: [
      { fieldKey: "amount", to: "49.90 EUR" },
      { fieldKey: "error", to: "Card declined" },
      { fieldKey: "retry", to: "Scheduled Dec 16, 2024" },
    ],
  },
  {
    id: 14,
    actionType: "note_created",
    descKey: "note_created", descParams: { topic: "Q1 strategy" },
    timestamp: "2024-12-13T08:30:00",
    category: "notes",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "title", to: "Q1 2025 Strategy" },
      { fieldKey: "tags", to: "Strategy, Planning" },
    ],
  },
]


// ============================================
// Helpers
// ============================================
const LOCALE_MAP = { en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT" }
const getLocale = (lang) => LOCALE_MAP[lang] || LOCALE_MAP.en

const formatTime = (timestamp, locale) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
}

const formatDateLabel = (dateStr, t, locale) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return t("admin.activityLog.today")
  if (date.toDateString() === yesterday.toDateString()) return t("admin.activityLog.yesterday")
  return date.toLocaleDateString(locale, { weekday: "long", month: "short", day: "numeric", year: "numeric" })
}

const formatInputDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const groupByDate = (logs, t, locale) => {
  const groups = {}
  logs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(log)
  })
  return Object.entries(groups)
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatDateLabel(dateKey, t, locale),
      items: items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    }))
    .sort((a, b) => new Date(b.items[0].timestamp) - new Date(a.items[0].timestamp))
}

const getUserInitials = (name) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

// ============================================
// ActivityLogModal Component
// ============================================
const ActivityLogModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation()
  const locale = getLocale(i18n.language)
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeStaff, setActiveStaff] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return ACTIVITY_LOGS.filter((log) => {
      if (activeCategory !== "all" && log.category !== activeCategory) return false
      if (activeStaff !== "all" && log.user.id !== activeStaff) return false
      if (dateFrom) {
        const logDate = new Date(log.timestamp).toDateString()
        const fromDate = new Date(dateFrom).toDateString()
        if (new Date(logDate) < new Date(fromDate)) return false
      }
      if (dateTo) {
        const logDate = new Date(log.timestamp).toDateString()
        const toDate = new Date(dateTo).toDateString()
        if (new Date(logDate) > new Date(toDate)) return false
      }
      return true
    })
  }, [activeCategory, activeStaff, dateFrom, dateTo])

  if (!isOpen) return null

  const grouped = groupByDate(filtered, t, locale)

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearFilters = () => {
    setActiveCategory("all")
    setActiveStaff("all")
    setDateFrom("")
    setDateTo("")
  }

  const hasActiveFilters = activeCategory !== "all" || activeStaff !== "all" || dateFrom || dateTo

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center sm:p-4 z-[9999]">
      <div className="bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[85vh] overflow-hidden border-t sm:border border-[#333333] shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#333333] flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{t("admin.activityLog.title")}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{t("admin.activityLog.activitiesCount", { count: filtered.length, total: ACTIVITY_LOGS.length })}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="border-b border-[#333333] flex-shrink-0">
          {/* Toggle + Quick Filters */}
          <div className="px-5 sm:px-6 py-3 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                showFilters || hasActiveFilters
                  ? "bg-orange-500 text-white"
                  : "bg-[#2F2F2F] text-zinc-400 hover:text-white hover:bg-[#3F3F3F]"
              }`}
            >
              <CalendarDays size={13} />
              {t("admin.activityLog.filters")}
              {hasActiveFilters && !showFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-white transition-colors"
              >
                {t("admin.activityLog.clearAll")}
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="px-5 sm:px-6 pb-3 space-y-3">
              {/* Category pills */}
              <div className="overflow-x-auto">
                <div className="flex gap-1.5">
                  {CATEGORIES(t).map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                        activeCategory === cat.key
                          ? "bg-orange-500 text-white"
                          : "bg-[#2F2F2F] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date + Staff */}
              <div className="flex flex-col sm:flex-row gap-3">
              {/* Date From */}
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 mb-1 block">{t("admin.activityLog.from")}</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-[#222222] text-white text-xs rounded-lg px-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Date To */}
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 mb-1 block">{t("admin.activityLog.to")}</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-[#222222] text-white text-xs rounded-lg px-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Staff Filter */}
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 mb-1 block">{t("admin.activityLog.staff")}</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={activeStaff}
                    onChange={(e) => setActiveStaff(e.target.value)}
                    className="w-full bg-[#222222] text-white text-xs rounded-lg pl-8 pr-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                  >
                    {STAFF_MEMBERS.map((s) => (
                      <option key={s.id} value={s.id}>{s.id === "all" ? t("admin.activityLog.allStaff") : s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <CalendarDays size={32} className="mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">{t("admin.activityLog.noActivities")}</p>
              <p className="text-xs text-zinc-600">{t("admin.activityLog.noActivitiesHint")}</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.dateKey}>
                {/* Date Header */}
                <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm px-5 sm:px-6 py-2.5 border-b border-[#252525]">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{group.label}</span>
                </div>

                {/* Timeline */}
                <div className="px-5 sm:px-6">
                  {group.items.map((activity, idx) => {
                    const isLast = idx === group.items.length - 1
                    const isExpanded = expandedIds.has(activity.id)
                    const hasChanges = activity.changes && activity.changes.length > 0
                    const categoryLabel = CATEGORIES(t).find((c) => c.key === activity.category)?.label || activity.category

                    return (
                      <div key={activity.id} className="flex gap-3 sm:gap-4">
                        {/* Timeline Line + Dot */}
                        <div className="flex flex-col items-center pt-5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-orange-500 ring-4 ring-[#1a1a1a]" />
                          {!isLast && <div className="w-px flex-1 bg-[#333333]" />}
                        </div>

                        {/* Entry */}
                        <div className="flex-1 pb-3">
                          <button
                            onClick={() => hasChanges && toggleExpanded(activity.id)}
                            className={`w-full text-left bg-[#222222] rounded-xl p-3.5 sm:p-4 transition-colors ${hasChanges ? "hover:bg-[#282828] cursor-pointer" : ""}`}
                          >
                            {/* Top Row */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="text-sm font-medium text-white">{t(`shared.activityLog.actionTypes.${activity.actionType}`, activity.actionType)}</span>
                              <div className="flex items-center gap-1.5 text-zinc-500 flex-shrink-0">
                                <Clock size={12} />
                                <span className="text-xs">{formatTime(activity.timestamp, locale)}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-zinc-400 mb-2.5">{t(`shared.activityLog.descriptions.${activity.descKey}`, activity.descParams)}</p>

                            {/* Bottom: Category + User + Expand */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Category Tag */}
                                <span className="text-[11px] text-zinc-500 bg-[#2F2F2F] px-2 py-0.5 rounded">{categoryLabel}</span>

                                {/* User */}
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4.5 h-4.5 rounded-full bg-[#3F3F3F] flex items-center justify-center" style={{ width: 18, height: 18 }}>
                                    <span className="text-[8px] font-bold text-zinc-400">{getUserInitials(activity.user.name)}</span>
                                  </div>
                                  <span className="text-xs text-zinc-500">{activity.user.name}</span>
                                </div>
                              </div>

                              {hasChanges && (
                                <div className="flex items-center gap-1 text-zinc-500">
                                  <span className="text-[11px]">{activity.changes.length === 1 ? t("admin.activityLog.change", { count: 1 }) : t("admin.activityLog.changes", { count: activity.changes.length })}</span>
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Expanded Changes */}
                          {isExpanded && hasChanges && (
                            <div className="mt-1 ml-1 border-l-2 border-[#333333] pl-3 py-2 space-y-2">
                              {activity.changes.map((change, cIdx) => (
                                <div key={cIdx} className="text-xs">
                                  <span className="text-zinc-500">{t(`shared.activityLog.fields.${change.fieldKey}`, change.fieldKey)}</span>
                                  {change.from ? (
                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                      <span className="text-zinc-500 line-through">{change.from}</span>
                                      <span className="text-zinc-600">&rarr;</span>
                                      <span className="text-white">{change.to}</span>
                                    </div>
                                  ) : (
                                    <div className="mt-0.5">
                                      <span className="text-white">{change.to}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-t border-[#333333] flex-shrink-0">
          <p className="text-xs text-zinc-500">
            {t("admin.activityLog.showingOf", { count: filtered.length, total: ACTIVITY_LOGS.length })}
          </p>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors text-xs font-medium">
            {t("admin.activityLog.loadMore")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogModal
