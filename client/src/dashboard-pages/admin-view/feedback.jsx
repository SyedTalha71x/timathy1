/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Lightbulb,
  Bug,
  MessageCircle,
  Calendar,
  Building2,
  User,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react"

// ============================================
// Feedback Status & Type Configs
// ============================================
const FEEDBACK_TYPES = {
  suggestion: { label: "Suggestion", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  bug: { label: "Bug Report", icon: Bug, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  praise: { label: "Praise", icon: Star, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  other: { label: "Other", icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
}

const FEEDBACK_STATUSES = {
  new: { label: "New", color: "bg-blue-500", textColor: "text-blue-400" },
  in_review: { label: "In Review", color: "bg-yellow-500", textColor: "text-yellow-400" },
  resolved: { label: "Resolved", color: "bg-green-500", textColor: "text-green-400" },
  dismissed: { label: "Dismissed", color: "bg-gray-500", textColor: "text-gray-400" },
}

// ============================================
// Dummy Feedback Data
// ============================================
const DUMMY_FEEDBACK = [
  {
    id: 1,
    type: "bug",
    subject: "Calendar sync not working properly",
    message: "When I try to sync the calendar with Google Calendar, it shows duplicate entries for recurring appointments. This started happening after the last update. Multiple trainers have reported this issue.",
    rating: 2,
    status: "in_review",
    studioName: "FitZone Premium",
    studioId: "studio_001",
    submittedBy: "Max Müller",
    role: "Studio Owner",
    createdAt: "2025-02-01T14:30:00Z",
  },
  {
    id: 2,
    type: "suggestion",
    subject: "Add bulk member import via CSV",
    message: "It would be very helpful to have a CSV import feature for adding multiple members at once. We are onboarding 50+ members from an old system and adding them one by one is very time-consuming.",
    rating: 4,
    status: "new",
    studioName: "Iron Paradise Gym",
    studioId: "studio_002",
    submittedBy: "Laura Schmidt",
    role: "Manager",
    createdAt: "2025-02-02T09:15:00Z",
  },
  {
    id: 3,
    type: "praise",
    subject: "Love the new dashboard design!",
    message: "Just wanted to say the new dashboard redesign looks amazing! Our staff finds it much easier to navigate now. The dark theme is also very easy on the eyes during late shifts. Great work!",
    rating: 5,
    status: "resolved",
    studioName: "PowerHouse Fitness",
    studioId: "studio_003",
    submittedBy: "Thomas Weber",
    role: "Studio Owner",
    createdAt: "2025-01-28T16:45:00Z",
  },
  {
    id: 4,
    type: "bug",
    subject: "Contract PDF generation fails",
    message: "When generating a contract PDF with special characters (ä, ö, ü) in the member name, the PDF generation fails with an error. We need this fixed urgently as many of our members have umlauts in their names.",
    rating: 1,
    status: "new",
    studioName: "FitZone Premium",
    studioId: "studio_001",
    submittedBy: "Max Müller",
    role: "Studio Owner",
    createdAt: "2025-02-03T08:00:00Z",
  },
  {
    id: 5,
    type: "suggestion",
    subject: "Automated birthday emails for members",
    message: "Would be nice if the system could automatically send birthday greetings to members. Maybe with a customizable email template per studio.",
    rating: 3,
    status: "in_review",
    studioName: "Flex & Fit Studio",
    studioId: "studio_004",
    submittedBy: "Anna Becker",
    role: "Manager",
    createdAt: "2025-01-30T11:20:00Z",
  },
  {
    id: 6,
    type: "other",
    subject: "Question about API access",
    message: "Is there an API available for integrating OrgaGym with our existing booking system? We use a custom-built website and would like to sync member bookings.",
    rating: 0,
    status: "resolved",
    studioName: "Urban Athletics",
    studioId: "studio_005",
    submittedBy: "Kai Fischer",
    role: "Studio Owner",
    createdAt: "2025-01-25T13:00:00Z",
  },
  {
    id: 7,
    type: "praise",
    subject: "Check-in feature is fantastic",
    message: "The QR code check-in feature has been a game changer for us. Members love it and it saves our front desk staff so much time. The analytics on check-in times are also really useful for planning.",
    rating: 5,
    status: "resolved",
    studioName: "Iron Paradise Gym",
    studioId: "studio_002",
    submittedBy: "Laura Schmidt",
    role: "Manager",
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    id: 8,
    type: "bug",
    subject: "Lead card drag and drop glitch on mobile",
    message: "On iPad, dragging lead cards between columns sometimes drops them in the wrong column. It seems to happen more often when scrolling horizontally at the same time.",
    rating: 3,
    status: "new",
    studioName: "Flex & Fit Studio",
    studioId: "studio_004",
    submittedBy: "Anna Becker",
    role: "Manager",
    createdAt: "2025-02-02T17:45:00Z",
  },
]

// ============================================
// Detail Modal Component
// ============================================
const FeedbackDetailModal = ({ feedback, onClose, onStatusChange }) => {
  if (!feedback) return null

  const typeConfig = FEEDBACK_TYPES[feedback.type]
  const TypeIcon = typeConfig.icon
  const statusConfig = FEEDBACK_STATUSES[feedback.status]

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-4">
      <div className="bg-[#1C1C1C] w-full max-w-2xl rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg border ${typeConfig.bg} mt-0.5`}>
              <TypeIcon size={18} className={typeConfig.color} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-white">{feedback.subject}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-400">{formatDate(feedback.createdAt)}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg ml-2">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
          {/* Studio Info */}
          <div className="bg-[#141414] rounded-xl p-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Submitted by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Building2 size={18} className="text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">{feedback.studioName}</p>
                <p className="text-gray-400 text-sm">{feedback.submittedBy} · {feedback.role}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Message</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{feedback.message}</p>
          </div>

          {/* Rating */}
          {feedback.rating > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={feedback.rating >= star ? "text-orange-500 fill-orange-500" : "text-zinc-700"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Change */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FEEDBACK_STATUSES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => onStatusChange(feedback.id, key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    feedback.status === key
                      ? `${config.color} text-white border-transparent`
                      : "bg-[#141414] text-gray-400 border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Feedback Page Component
// ============================================
const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState(DUMMY_FEEDBACK)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [sortBy, setSortBy] = useState("newest")
  const filterRef = useRef(null)

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  // Filter & sort
  const filteredFeedback = feedbackList
    .filter((fb) => {
      const matchesSearch =
        fb.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || fb.type === filterType
      const matchesStatus = filterStatus === "all" || fb.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      return 0
    })

  const handleStatusChange = (feedbackId, newStatus) => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === feedbackId ? { ...fb, status: newStatus } : fb))
    )
    setSelectedFeedback((prev) => (prev?.id === feedbackId ? { ...prev, status: newStatus } : prev))
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Stats
  const stats = {
    total: feedbackList.length,
    new: feedbackList.filter((fb) => fb.status === "new").length,
    inReview: feedbackList.filter((fb) => fb.status === "in_review").length,
    resolved: feedbackList.filter((fb) => fb.status === "resolved").length,
  }

  const activeFilterCount = [filterType !== "all", filterStatus !== "all"].filter(Boolean).length

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Feedback</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage feedback from all studios</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1C1C1C] rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1C1C1C] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">New</p>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{stats.new}</p>
        </div>
        <div className="bg-[#1C1C1C] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">In Review</p>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{stats.inReview}</p>
        </div>
        <div className="bg-[#1C1C1C] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Resolved</p>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{stats.resolved}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, studio, or person..."
            className="w-full bg-[#1C1C1C] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Filter Button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              activeFilterCount > 0
                ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                : "bg-[#1C1C1C] border-gray-800 text-gray-300 hover:border-gray-600"
            }`}
          >
            <Filter size={16} />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-lg z-50 w-64 p-4 space-y-4">
              {/* Type Filter */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filterType === "all" ? "bg-orange-500 text-white" : "bg-[#141414] text-gray-400 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(FEEDBACK_TYPES).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setFilterType(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterType === key ? "bg-orange-500 text-white" : "bg-[#141414] text-gray-400 hover:text-white"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filterStatus === "all" ? "bg-orange-500 text-white" : "bg-[#141414] text-gray-400 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(FEEDBACK_STATUSES).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === key ? "bg-orange-500 text-white" : "bg-[#141414] text-gray-400 hover:text-white"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="rating">Highest rating</option>
                </select>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setFilterType("all")
                    setFilterStatus("all")
                    setSortBy("newest")
                  }}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Reset all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filteredFeedback.length === 0 ? (
          <div className="bg-[#1C1C1C] rounded-xl p-12 text-center">
            <MessageCircle size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No feedback found</p>
            <p className="text-gray-600 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredFeedback.map((fb) => {
            const typeConfig = FEEDBACK_TYPES[fb.type]
            const TypeIcon = typeConfig.icon
            const statusConfig = FEEDBACK_STATUSES[fb.status]

            return (
              <div
                key={fb.id}
                onClick={() => setSelectedFeedback(fb)}
                className="bg-[#1C1C1C] rounded-xl p-4 hover:bg-[#222222] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  {/* Type Icon */}
                  <div className={`p-2 rounded-lg border ${typeConfig.bg} shrink-0 mt-0.5`}>
                    <TypeIcon size={16} className={typeConfig.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-medium text-sm truncate">{fb.subject}</h3>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{fb.message}</p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${statusConfig.color} text-white`}>
                          {statusConfig.label}
                        </span>
                        <Eye size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors hidden sm:block" />
                      </div>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Building2 size={12} className="text-orange-400" />
                        <span>{fb.studioName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <User size={12} />
                        <span>{fb.submittedBy}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDate(fb.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{formatTime(fb.createdAt)}</span>
                      </div>
                      {fb.rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={10}
                              className={fb.rating >= star ? "text-orange-500 fill-orange-500" : "text-zinc-700"}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Results Count */}
      {filteredFeedback.length > 0 && (
        <p className="text-gray-600 text-xs text-center mt-4">
          {filteredFeedback.length} of {feedbackList.length} entries
        </p>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

export default Feedback
