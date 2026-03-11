/* eslint-disable react/prop-types */
import { useState, useMemo } from "react"
import { X, Clock, ChevronDown, ChevronRight, CalendarDays, User } from "lucide-react"

// ============================================
// Category filters — matches admin sidebar menu items
// ============================================
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "customers", label: "Customers" },
  { key: "contracts", label: "Contracts" },
  { key: "leads", label: "Leads" },
  { key: "demo-access", label: "Demo Access" },
  { key: "support", label: "Support" },
  { key: "email", label: "Email" },
  { key: "finances", label: "Finances" },
  { key: "notes", label: "Notes" },
  { key: "exercises", label: "Exercises" },
  { key: "marketplace", label: "Marketplace" },
  { key: "configuration", label: "Configuration" },
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
    action: "Appointment Created",
    description: "Created new appointment for John Doe",
    timestamp: "2024-12-15T14:30:00",
    category: "customers",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Service", to: "Personal Training" },
      { field: "Date", to: "Dec 20, 2024 at 10:00 AM" },
      { field: "Duration", to: "60 min" },
      { field: "Trainer", to: "Justin M" },
    ],
  },
  {
    id: 2,
    action: "Member Updated",
    description: "Updated profile information for Sarah Smith",
    timestamp: "2024-12-15T13:15:00",
    category: "customers",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Email", from: "sarah.old@mail.com", to: "sarah.smith@mail.com" },
      { field: "Phone", from: "+49 170 1234567", to: "+49 170 9876543" },
    ],
  },
  {
    id: 3,
    action: "Contract Created",
    description: "Created new contract for Mike Johnson",
    timestamp: "2024-12-15T11:45:00",
    category: "contracts",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Type", to: "Premium Membership" },
      { field: "Duration", to: "12 months" },
      { field: "Monthly Fee", to: "49.90 EUR" },
      { field: "Start Date", to: "Jan 01, 2025" },
    ],
  },
  {
    id: 4,
    action: "Lead Converted",
    description: "Converted lead Lisa Garcia to full member",
    timestamp: "2024-12-15T10:20:00",
    category: "leads",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Status", from: "Lead", to: "Active Member" },
      { field: "Contract", to: "Basic Membership - 6 months" },
      { field: "Source", to: "Instagram" },
    ],
  },
  {
    id: 5,
    action: "Payment Processed",
    description: "Monthly payment processed for Emily Brown",
    timestamp: "2024-12-15T09:30:00",
    category: "finances",
    user: { id: "system", name: "System" },
    changes: [
      { field: "Amount", to: "39.90 EUR" },
      { field: "Method", to: "SEPA Direct Debit" },
      { field: "Invoice", to: "#INV-2024-1582" },
    ],
  },
  {
    id: 6,
    action: "Demo Access Granted",
    description: "Granted demo access to Studio Fit Berlin",
    timestamp: "2024-12-14T16:45:00",
    category: "demo-access",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Studio", to: "Studio Fit Berlin" },
      { field: "Template", to: "Full Access" },
      { field: "Expires", to: "Dec 28, 2024" },
    ],
  },
  {
    id: 7,
    action: "Exercise Uploaded",
    description: "Uploaded new exercise: HIIT Power Burpees",
    timestamp: "2024-12-14T15:20:00",
    category: "exercises",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Name", to: "HIIT Power Burpees" },
      { field: "Difficulty", to: "Advanced" },
      { field: "Muscles", to: "Full Body, Core" },
    ],
  },
  {
    id: 8,
    action: "Contract Renewed",
    description: "Renewed contract for Lisa Garcia",
    timestamp: "2024-12-14T14:10:00",
    category: "contracts",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Duration", from: "6 months", to: "12 months" },
      { field: "Monthly Fee", from: "39.90 EUR", to: "34.90 EUR" },
      { field: "End Date", from: "Mar 01, 2025", to: "Sep 01, 2025" },
    ],
  },
  {
    id: 9,
    action: "Ticket Resolved",
    description: "Resolved support ticket #1042 for Studio Fit Berlin",
    timestamp: "2024-12-14T12:00:00",
    category: "support",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Status", from: "Open", to: "Resolved" },
      { field: "Resolution", to: "Bug fixed in booking calendar" },
    ],
  },
  {
    id: 10,
    action: "Product Added",
    description: "Added new product to marketplace: Premium Yoga Mat",
    timestamp: "2024-12-14T10:30:00",
    category: "marketplace",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Name", to: "Premium Yoga Mat" },
      { field: "Price", to: "29.90 EUR" },
      { field: "Brand", to: "YogaPro" },
      { field: "Status", to: "Active" },
    ],
  },
  {
    id: 11,
    action: "Email Campaign Sent",
    description: "Sent newsletter campaign to 342 recipients",
    timestamp: "2024-12-13T16:00:00",
    category: "email",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Subject", to: "December Promotions" },
      { field: "Recipients", to: "342" },
      { field: "Template", to: "Monthly Newsletter" },
    ],
  },
  {
    id: 12,
    action: "Configuration Updated",
    description: "Updated SMTP settings for email delivery",
    timestamp: "2024-12-13T11:00:00",
    category: "configuration",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "SMTP Server", from: "smtp.old-provider.com", to: "smtp.new-provider.com" },
      { field: "Port", from: "465", to: "587" },
      { field: "Encryption", from: "SSL", to: "TLS" },
    ],
  },
  {
    id: 13,
    action: "Payment Failed",
    description: "Monthly payment failed for Chris Evans",
    timestamp: "2024-12-13T09:15:00",
    category: "finances",
    user: { id: "system", name: "System" },
    changes: [
      { field: "Amount", to: "49.90 EUR" },
      { field: "Error", to: "Card declined" },
      { field: "Retry", to: "Scheduled Dec 16, 2024" },
    ],
  },
  {
    id: 14,
    action: "Note Created",
    description: "Created internal note about Q1 strategy",
    timestamp: "2024-12-13T08:30:00",
    category: "notes",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Title", to: "Q1 2025 Strategy" },
      { field: "Tags", to: "Strategy, Planning" },
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

const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
}

const formatInputDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const groupByDate = (logs) => {
  const groups = {}
  logs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(log)
  })
  return Object.entries(groups)
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatDateLabel(dateKey),
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

  const grouped = groupByDate(filtered)

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
            <h2 className="text-lg sm:text-xl font-bold text-white">Activity Log</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{filtered.length} of {ACTIVITY_LOGS.length} activities</p>
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
              Filters
              {hasActiveFilters && !showFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-white transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="px-5 sm:px-6 pb-3 space-y-3">
              {/* Category pills */}
              <div className="overflow-x-auto">
                <div className="flex gap-1.5">
                  {CATEGORIES.map((cat) => (
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
                <label className="text-[11px] text-zinc-500 mb-1 block">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-[#222222] text-white text-xs rounded-lg px-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Date To */}
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 mb-1 block">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-[#222222] text-white text-xs rounded-lg px-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Staff Filter */}
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 mb-1 block">Staff</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={activeStaff}
                    onChange={(e) => setActiveStaff(e.target.value)}
                    className="w-full bg-[#222222] text-white text-xs rounded-lg pl-8 pr-3 py-2 border border-[#333333] outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                  >
                    {STAFF_MEMBERS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
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
              <p className="text-sm font-medium mb-1">No activities found</p>
              <p className="text-xs text-zinc-600">Try adjusting your filters</p>
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
                    const categoryLabel = CATEGORIES.find((c) => c.key === activity.category)?.label || activity.category

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
                              <span className="text-sm font-medium text-white">{activity.action}</span>
                              <div className="flex items-center gap-1.5 text-zinc-500 flex-shrink-0">
                                <Clock size={12} />
                                <span className="text-xs">{formatTime(activity.timestamp)}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-zinc-400 mb-2.5">{activity.description}</p>

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
                                  <span className="text-[11px]">{activity.changes.length} {activity.changes.length === 1 ? "change" : "changes"}</span>
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
                                  <span className="text-zinc-500">{change.field}</span>
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
            Showing {filtered.length} of {ACTIVITY_LOGS.length}
          </p>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors text-xs font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogModal
