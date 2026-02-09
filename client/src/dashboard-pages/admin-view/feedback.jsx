/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  MessageCircle,
  Calendar,
  Building2,
  User,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import {
  FEEDBACK_TYPES,
  FEEDBACK_STATUSES,
  DUMMY_FEEDBACK,
  formatFeedbackDate,
  formatFeedbackTime,
  formatFeedbackDateTime,
} from "../../utils/admin-panel-states/feedback-states"

// ============================================
// Detail Modal Component
// ============================================
const FeedbackDetailModal = ({ feedback, onClose, onStatusChange }) => {
  if (!feedback) return null

  const typeConfig = FEEDBACK_TYPES[feedback.type]
  const TypeIcon = typeConfig.icon
  const statusConfig = FEEDBACK_STATUSES[feedback.status]

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
                <span className="text-xs text-gray-400">{formatFeedbackDateTime(feedback.createdAt)}</span>
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
  const [filterTypes, setFilterTypes] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [sortBy, setSortBy] = useState("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)

  // Expand filters on desktop, keep collapsed on mobile
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768
    setFiltersExpanded(isDesktop)
  }, [])

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter & sort
  const filteredFeedback = feedbackList
    .filter((fb) => {
      const matchesSearch =
        fb.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterTypes.length === 0 || filterTypes.includes(fb.type)
      const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(fb.status)
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

  // Stats
  const stats = {
    total: feedbackList.length,
    new: feedbackList.filter((fb) => fb.status === "new").length,
    inReview: feedbackList.filter((fb) => fb.status === "in_review").length,
    resolved: feedbackList.filter((fb) => fb.status === "resolved").length,
  }

  const activeFilterCount = filterTypes.length + filterStatuses.length

  // Toggle helpers for multi-select
  const toggleStatus = (key) => {
    setFilterStatuses((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    )
  }

  const toggleType = (key) => {
    setFilterTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    )
  }

  const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "rating", label: "Highest rating" },
  ]
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Newest first"

  return (
    <div className="min-h-screen rounded-3xl p-4 md:p-6 bg-[#1C1C1C] transition-all duration-300 ease-in-out flex-1">
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
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
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

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, studio, or person..."
            className="w-full bg-[#141414] border border-[#333333] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Filters Section - Collapsible */}
      <div className="mb-4 sm:mb-6">
        {/* Filters Header Row - Always visible */}
        <div className="flex items-center justify-between mb-2">
          {/* Filters Toggle - Clickable to expand/collapse */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Filter size={14} />
            <span className="text-xs sm:text-sm font-medium">Filters</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`} 
            />
            {/* Show active filter count when collapsed */}
            {!filtersExpanded && activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Controls - Always visible */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowSortDropdown(!showSortDropdown)
              }}
              className="px-3 sm:px-4 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
            >
              {sortBy === "newest" || sortBy === "oldest" ? (
                sortBy === "newest" ? <ArrowDown size={14} className="text-white" /> : <ArrowUp size={14} className="text-white" />
              ) : (
                <ArrowDown size={14} className="text-white" />
              )}
              <span>{currentSortLabel}</span>
            </button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                    Sort by
                  </div>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                        sortBy === option.value
                          ? "text-white bg-gray-800/50"
                          : "text-gray-300"
                      }`}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills - Collapsible */}
        <div className={`overflow-hidden transition-all duration-300 ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-wrap gap-1.5 sm:gap-3">
            {/* Status: All */}
            <button
              onClick={() => setFilterStatuses([])}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                filterStatuses.length === 0
                  ? "bg-orange-500 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              All ({feedbackList.length})
            </button>
            {/* Status Filter Pills */}
            {Object.entries(FEEDBACK_STATUSES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleStatus(key)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                  filterStatuses.includes(key)
                    ? "bg-orange-500 text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
              >
                {config.label} ({feedbackList.filter((fb) => fb.status === key).length})
              </button>
            ))}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-700 mx-1 hidden sm:block self-center"></div>

            {/* Type: All */}
            <button
              onClick={() => setFilterTypes([])}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                filterTypes.length === 0
                  ? "bg-orange-500 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              All Types
            </button>
            {/* Type Filter Pills */}
            {Object.entries(FEEDBACK_TYPES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleType(key)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filterTypes.includes(key)
                    ? "bg-orange-500 text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
              >
                {config.label} ({feedbackList.filter((fb) => fb.type === key).length})
              </button>
            ))}
          </div>
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
                        <span>{formatFeedbackDate(fb.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{formatFeedbackTime(fb.createdAt)}</span>
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
