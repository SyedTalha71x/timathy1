/* eslint-disable react/prop-types */
import { useState, useMemo } from "react"
import { X, Clock, ChevronDown, ChevronRight, CalendarDays, User } from "lucide-react"
import { useTranslation } from "react-i18next"

// ============================================
// Category filters — matches studio sidebar menu items
// ============================================
const CATEGORIES = (t) => [
  { key: "all", label: t("studio.activityLog.categories.all") },
  { key: "appointments", label: t("studio.activityLog.categories.appointments") },
  { key: "classes", label: t("studio.activityLog.categories.classes") },
  { key: "members", label: t("studio.activityLog.categories.members") },
  { key: "contracts", label: t("studio.activityLog.categories.contracts") },
  { key: "leads", label: t("studio.activityLog.categories.leads") },
  { key: "staff", label: t("studio.activityLog.categories.staff") },
  { key: "selling", label: t("studio.activityLog.categories.selling") },
  { key: "finances", label: t("studio.activityLog.categories.finances") },
  { key: "communication", label: t("studio.activityLog.categories.communication") },
  { key: "notes", label: t("studio.activityLog.categories.notes") },
  { key: "training", label: t("studio.activityLog.categories.training") },
  { key: "marketplace", label: t("studio.activityLog.categories.marketplace") },
  { key: "configuration", label: t("studio.activityLog.categories.configuration") },
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
    category: "appointments",
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
    category: "members",
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
    actionType: "class_rescheduled",
    descKey: "class_rescheduled", descParams: { name: "HIIT class", group: "Monday group" },
    timestamp: "2024-12-15T10:20:00",
    category: "classes",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "time", from: "3:00 PM", to: "4:00 PM" },
      { fieldKey: "room", from: "Studio A", to: "Studio B" },
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
    actionType: "lead_converted",
    descKey: "lead_converted", descParams: { name: "Robert Wilson" },
    timestamp: "2024-12-14T16:45:00",
    category: "leads",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "status", from: "Lead", to: "Active Member" },
      { fieldKey: "contract", to: "Basic Membership - 6 months" },
      { fieldKey: "source", to: "Walk-in" },
    ],
  },
  {
    id: 7,
    actionType: "staff_schedule_updated",
    descKey: "staff_schedule_updated", descParams: { role: "trainer", name: "Max B" },
    timestamp: "2024-12-14T15:20:00",
    category: "staff",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "date", from: "09:00-17:00", to: "10:00-18:00" },
      { fieldKey: "date", from: "Off", to: "14:00-20:00" },
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
    actionType: "product_sold",
    descKey: "product_sold", descParams: { product: "Premium Yoga Mat", name: "Chris Evans" },
    timestamp: "2024-12-14T12:00:00",
    category: "selling",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "product", to: "Premium Yoga Mat" },
      { fieldKey: "price", to: "29.90 EUR" },
      { fieldKey: "payment", to: "Cash" },
    ],
  },
  {
    id: 10,
    actionType: "training_plan_created",
    descKey: "training_plan_created", descParams: { name: "Sarah Smith" },
    timestamp: "2024-12-13T16:00:00",
    category: "training",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "plan", to: "Strength Building - 8 weeks" },
      { fieldKey: "sessionsPerWeek", to: "3" },
      { fieldKey: "focus", to: "Upper Body, Core" },
    ],
  },
  {
    id: 11,
    actionType: "message_sent",
    descKey: "message_sent", descParams: { recipients: "all Premium members" },
    timestamp: "2024-12-13T14:30:00",
    category: "communication",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "recipients", to: "48 members" },
      { fieldKey: "subject", to: "Holiday Schedule Changes" },
    ],
  },
  {
    id: 12,
    actionType: "note_created",
    descKey: "note_created", descParams: { topic: "equipment maintenance" },
    timestamp: "2024-12-13T11:00:00",
    category: "notes",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "title", to: "Equipment Maintenance Q1" },
      { fieldKey: "tags", to: "Maintenance, Equipment" },
    ],
  },
  {
    id: 13,
    actionType: "opening_hours_updated",
    descKey: "opening_hours_updated", descParams: { type: "holiday" },
    timestamp: "2024-12-13T09:15:00",
    category: "configuration",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { fieldKey: "date", from: "06:00-22:00", to: "08:00-14:00" },
      { fieldKey: "date", from: "06:00-22:00", to: "Closed" },
      { fieldKey: "date", from: "06:00-22:00", to: "08:00-16:00" },
    ],
  },
  {
    id: 14,
    actionType: "product_added",
    descKey: "product_added", descParams: { name: "Resistance Bands Set" },
    timestamp: "2024-12-13T08:30:00",
    category: "marketplace",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { fieldKey: "name", to: "Resistance Bands Set" },
      { fieldKey: "price", to: "19.90 EUR" },
      { fieldKey: "status", to: "Active" },
    ],
  },
]

// ============================================
// Helpers
// ============================================
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
}

const formatDateLabel = (dateStr, t) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return t("admin.activityLog.today")
  if (date.toDateString() === yesterday.toDateString()) return t("admin.activityLog.yesterday")
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
}

const groupByDate = (logs, t) => {
  const groups = {}
  logs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(log)
  })
  return Object.entries(groups)
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatDateLabel(dateKey, t),
      items: items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    }))
    .sort((a, b) => new Date(b.items[0].timestamp) - new Date(a.items[0].timestamp))
}

const getUserInitials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

// ============================================
// StudioActivityLogModal Component
// ============================================
const StudioActivityLogModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
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
        if (new Date(logDate) < new Date(dateFrom)) return false
      }
      if (dateTo) {
        const logDate = new Date(log.timestamp).toDateString()
        if (new Date(logDate) > new Date(dateTo)) return false
      }
      return true
    })
  }, [activeCategory, activeStaff, dateFrom, dateTo])

  if (!isOpen) return null

  const grouped = groupByDate(filtered, t)

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
      <div className="bg-surface-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[85vh] overflow-hidden border-t sm:border border-border shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-content-primary">{t("admin.activityLog.title")}</h2>
            <p className="text-xs text-content-faint mt-0.5">{t("admin.activityLog.activitiesCount", { count: filtered.length, total: ACTIVITY_LOGS.length })}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-muted" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="border-b border-border flex-shrink-0">
          <div className="px-5 sm:px-6 py-3 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                showFilters || hasActiveFilters
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-muted hover:text-content-primary hover:bg-surface-button-hover"
              }`}
            >
              <CalendarDays size={13} />
              {t("admin.activityLog.filters")}
              {hasActiveFilters && !showFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="px-3 py-1.5 rounded-lg text-xs font-medium text-content-faint hover:text-content-primary transition-colors">
                {t("admin.activityLog.clearAll")}
              </button>
            )}
          </div>

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
                          ? "bg-primary text-white"
                          : "bg-surface-button text-content-faint hover:text-content-primary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date + Staff */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-content-faint mb-1 block">{t("admin.activityLog.from")}</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-surface-base text-content-primary text-xs rounded-lg px-3 py-2 border border-border outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-content-faint mb-1 block">{t("admin.activityLog.to")}</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-surface-base text-content-primary text-xs rounded-lg px-3 py-2 border border-border outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-content-faint mb-1 block">{t("admin.activityLog.staff")}</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-faint" />
                    <select value={activeStaff} onChange={(e) => setActiveStaff(e.target.value)}
                      className="w-full bg-surface-base text-content-primary text-xs rounded-lg pl-8 pr-3 py-2 border border-border outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
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
            <div className="flex flex-col items-center justify-center py-16 text-content-faint">
              <CalendarDays size={32} className="mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">{t("admin.activityLog.noActivities")}</p>
              <p className="text-xs text-content-faint">{t("admin.activityLog.noActivitiesHint")}</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.dateKey}>
                <div className="sticky top-0 bg-surface-card/95 backdrop-blur-sm px-5 sm:px-6 py-2.5 border-b border-border-subtle">
                  <span className="text-xs font-semibold text-content-faint uppercase tracking-wider">{group.label}</span>
                </div>
                <div className="px-5 sm:px-6">
                  {group.items.map((activity, idx) => {
                    const isLast = idx === group.items.length - 1
                    const isExpanded = expandedIds.has(activity.id)
                    const hasChanges = activity.changes && activity.changes.length > 0
                    const categoryLabel = CATEGORIES(t).find((c) => c.key === activity.category)?.label || activity.category

                    return (
                      <div key={activity.id} className="flex gap-3 sm:gap-4">
                        <div className="flex flex-col items-center pt-5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-surface-card" />
                          {!isLast && <div className="w-px flex-1 bg-border" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <button
                            onClick={() => hasChanges && toggleExpanded(activity.id)}
                            className={`w-full text-left bg-surface-hover rounded-xl p-3.5 sm:p-4 transition-colors ${hasChanges ? "hover:bg-surface-button cursor-pointer" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="text-sm font-medium text-content-primary">{t(`shared.activityLog.actionTypes.${activity.actionType}`, activity.actionType)}</span>
                              <div className="flex items-center gap-1.5 text-content-faint flex-shrink-0">
                                <Clock size={12} />
                                <span className="text-xs">{formatTime(activity.timestamp)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-content-muted mb-2.5">{t(`shared.activityLog.descriptions.${activity.descKey}`, activity.descParams)}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-content-faint bg-surface-button px-2 py-0.5 rounded">{categoryLabel}</span>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-[18px] h-[18px] rounded-full bg-surface-button flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-content-faint">{getUserInitials(activity.user.name)}</span>
                                  </div>
                                  <span className="text-xs text-content-faint">{activity.user.name}</span>
                                </div>
                              </div>
                              {hasChanges && (
                                <div className="flex items-center gap-1 text-content-faint">
                                  <span className="text-[11px]">{activity.changes.length === 1 ? t("admin.activityLog.change", { count: 1 }) : t("admin.activityLog.changes", { count: activity.changes.length })}</span>
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </div>
                              )}
                            </div>
                          </button>
                          {isExpanded && hasChanges && (
                            <div className="mt-1 ml-1 border-l-2 border-border pl-3 py-2 space-y-2">
                              {activity.changes.map((change, cIdx) => (
                                <div key={cIdx} className="text-xs">
                                  <span className="text-content-faint">{t(`shared.activityLog.fields.${change.fieldKey}`, change.fieldKey)}</span>
                                  {change.from ? (
                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                      <span className="text-content-faint line-through">{change.from}</span>
                                      <span className="text-content-faint">&rarr;</span>
                                      <span className="text-content-primary">{change.to}</span>
                                    </div>
                                  ) : (
                                    <div className="mt-0.5">
                                      <span className="text-content-primary">{change.to}</span>
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
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-t border-border flex-shrink-0">
          <p className="text-xs text-content-faint">{t("admin.activityLog.showingOf", { count: filtered.length, total: ACTIVITY_LOGS.length })}</p>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors text-xs font-medium">
            {t("admin.activityLog.loadMore")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudioActivityLogModal
