/* eslint-disable react/prop-types */
import { useState, useMemo } from "react"
import { X, Clock, ChevronDown, ChevronRight, CalendarDays, User } from "lucide-react"

// ============================================
// Category filters — matches studio sidebar menu items
// ============================================
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "classes", label: "Classes" },
  { key: "members", label: "Members" },
  { key: "contracts", label: "Contracts" },
  { key: "leads", label: "Leads" },
  { key: "staff", label: "Staff" },
  { key: "selling", label: "Selling" },
  { key: "finances", label: "Finances" },
  { key: "communication", label: "Communication" },
  { key: "notes", label: "Notes" },
  { key: "training", label: "Training" },
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
    category: "appointments",
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
    category: "members",
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
    action: "Class Rescheduled",
    description: "Rescheduled HIIT class for Monday group",
    timestamp: "2024-12-15T10:20:00",
    category: "classes",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Time", from: "3:00 PM", to: "4:00 PM" },
      { field: "Room", from: "Studio A", to: "Studio B" },
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
    action: "Lead Converted",
    description: "Converted lead Robert Wilson to full member",
    timestamp: "2024-12-14T16:45:00",
    category: "leads",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Status", from: "Lead", to: "Active Member" },
      { field: "Contract", to: "Basic Membership - 6 months" },
      { field: "Source", to: "Walk-in" },
    ],
  },
  {
    id: 7,
    action: "Staff Schedule Updated",
    description: "Updated work schedule for trainer Max B",
    timestamp: "2024-12-14T15:20:00",
    category: "staff",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Monday", from: "09:00-17:00", to: "10:00-18:00" },
      { field: "Wednesday", from: "Off", to: "14:00-20:00" },
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
    action: "Product Sold",
    description: "Sold Premium Yoga Mat to Chris Evans",
    timestamp: "2024-12-14T12:00:00",
    category: "selling",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Product", to: "Premium Yoga Mat" },
      { field: "Price", to: "29.90 EUR" },
      { field: "Payment", to: "Cash" },
    ],
  },
  {
    id: 10,
    action: "Training Plan Created",
    description: "Created new training plan for Sarah Smith",
    timestamp: "2024-12-13T16:00:00",
    category: "training",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Plan", to: "Strength Building - 8 weeks" },
      { field: "Sessions/Week", to: "3" },
      { field: "Focus", to: "Upper Body, Core" },
    ],
  },
  {
    id: 11,
    action: "Message Sent",
    description: "Sent group message to all Premium members",
    timestamp: "2024-12-13T14:30:00",
    category: "communication",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Recipients", to: "48 members" },
      { field: "Subject", to: "Holiday Schedule Changes" },
    ],
  },
  {
    id: 12,
    action: "Note Created",
    description: "Created internal note about equipment maintenance",
    timestamp: "2024-12-13T11:00:00",
    category: "notes",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Title", to: "Equipment Maintenance Q1" },
      { field: "Tags", to: "Maintenance, Equipment" },
    ],
  },
  {
    id: 13,
    action: "Opening Hours Updated",
    description: "Updated holiday opening hours",
    timestamp: "2024-12-13T09:15:00",
    category: "configuration",
    user: { id: "justin", name: "Justin M" },
    changes: [
      { field: "Dec 24", from: "06:00-22:00", to: "08:00-14:00" },
      { field: "Dec 25", from: "06:00-22:00", to: "Closed" },
      { field: "Dec 31", from: "06:00-22:00", to: "08:00-16:00" },
    ],
  },
  {
    id: 14,
    action: "Product Added",
    description: "Added new product to marketplace",
    timestamp: "2024-12-13T08:30:00",
    category: "marketplace",
    user: { id: "anna", name: "Anna K" },
    changes: [
      { field: "Name", to: "Resistance Bands Set" },
      { field: "Price", to: "19.90 EUR" },
      { field: "Status", to: "Active" },
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

const getUserInitials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

// ============================================
// StudioActivityLogModal Component
// ============================================
const StudioActivityLogModal = ({ isOpen, onClose }) => {
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
      <div className="bg-surface-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[85vh] overflow-hidden border-t sm:border border-border shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-content-primary">Activity Log</h2>
            <p className="text-xs text-content-faint mt-0.5">{filtered.length} of {ACTIVITY_LOGS.length} activities</p>
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
              Filters
              {hasActiveFilters && !showFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="px-3 py-1.5 rounded-lg text-xs font-medium text-content-faint hover:text-content-primary transition-colors">
                Clear all
              </button>
            )}
          </div>

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
                  <label className="text-[11px] text-content-faint mb-1 block">From</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-surface-base text-content-primary text-xs rounded-lg px-3 py-2 border border-border outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-content-faint mb-1 block">To</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-surface-base text-content-primary text-xs rounded-lg px-3 py-2 border border-border outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-content-faint mb-1 block">Staff</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-faint" />
                    <select value={activeStaff} onChange={(e) => setActiveStaff(e.target.value)}
                      className="w-full bg-surface-base text-content-primary text-xs rounded-lg pl-8 pr-3 py-2 border border-border outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
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
            <div className="flex flex-col items-center justify-center py-16 text-content-faint">
              <CalendarDays size={32} className="mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">No activities found</p>
              <p className="text-xs text-content-faint">Try adjusting your filters</p>
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
                    const categoryLabel = CATEGORIES.find((c) => c.key === activity.category)?.label || activity.category

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
                              <span className="text-sm font-medium text-content-primary">{activity.action}</span>
                              <div className="flex items-center gap-1.5 text-content-faint flex-shrink-0">
                                <Clock size={12} />
                                <span className="text-xs">{formatTime(activity.timestamp)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-content-muted mb-2.5">{activity.description}</p>
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
                                  <span className="text-[11px]">{activity.changes.length} {activity.changes.length === 1 ? "change" : "changes"}</span>
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </div>
                              )}
                            </div>
                          </button>
                          {isExpanded && hasChanges && (
                            <div className="mt-1 ml-1 border-l-2 border-border pl-3 py-2 space-y-2">
                              {activity.changes.map((change, cIdx) => (
                                <div key={cIdx} className="text-xs">
                                  <span className="text-content-faint">{change.field}</span>
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
          <p className="text-xs text-content-faint">Showing {filtered.length} of {ACTIVITY_LOGS.length}</p>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors text-xs font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudioActivityLogModal
