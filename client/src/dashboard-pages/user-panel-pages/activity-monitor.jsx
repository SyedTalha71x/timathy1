import { useState } from "react"
import {
  Bell,
  Clock,
  MailX,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X,
  Search,
  RefreshCw,
  Archive,
  AlertCircle,
  MessageSquare,
  Activity,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { MdOutlineHolidayVillage } from "react-icons/md"

export default function ActivityMonitor() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [showArchived, setShowArchived] = useState(false)

  // Activity types configuration
  const activityTypes = {
    vacation: {
      name: "Vacation Requests",
      icon: MdOutlineHolidayVillage,
      color: "bg-blue-600",
      textColor: "text-blue-400",
    },
    email: { name: "Email Issues", icon: MailX, color: "bg-red-600", textColor: "text-red-400" },
    contract: { name: "Contract Expiring", icon: FileText, color: "bg-yellow-600", textColor: "text-yellow-400" },
    appointment: { name: "Appointment Requests", icon: Calendar, color: "bg-green-600", textColor: "text-green-400" },
    communication: {
      name: "Communications",
      icon: MessageSquare,
      color: "bg-indigo-600",
      textColor: "text-indigo-400",
    },
  }

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "vacation",
      title: "Vacation Request - Sarah Wilson",
      description: "Requesting 5 days off from March 15-19, 2025 for family vacation",
      timestamp: "2025-01-09T14:30:00",
      status: "pending",
      actionRequired: true,
      isArchived: false,
      details: {
        employee: "Sarah Wilson",
        department: "Training",
        dates: "March 15-19, 2025",
        days: 5,
        reason: "Family vacation",
        coverage: "Mike Johnson (confirmed)",
        submittedAt: "2025-01-09T14:30:00",
      },
    },
    {
      id: 2,
      type: "email",
      title: "Failed Email Delivery - Member Notifications",
      description: "5 appointment reminder emails failed to send due to invalid email addresses",
      timestamp: "2025-01-09T13:45:00",
      status: "failed",
      actionRequired: true,
      isArchived: false,
      details: {
        failedEmails: [
          { email: "old.email@example.com", member: "John Doe", reason: "Invalid email address" },
          { email: "bounced@domain.com", member: "Jane Smith", reason: "Mailbox full" },
          { email: "invalid@test", member: "Bob Wilson", reason: "Invalid format" },
        ],
        emailType: "Appointment Reminders",
        attemptedAt: "2025-01-09T13:45:00",
      },
    },
    {
      id: 3,
      type: "contract",
      title: "Contract Expiring Soon - 3 Members",
      description: "3 member contracts are expiring within the next 30 days",
      timestamp: "2025-01-09T12:00:00",
      status: "warning",
      actionRequired: true,
      isArchived: false,
      details: {
        expiringContracts: [
          { member: "Yolanda Martinez", expiryDate: "2025-02-01", daysLeft: 23 },
          { member: "Denis Johnson", expiryDate: "2025-02-05", daysLeft: 27 },
          { member: "Nicole Smith", expiryDate: "2025-02-08", daysLeft: 30 },
        ],
      },
    },
    {
      id: 4,
      type: "appointment",
      title: "New Appointment Request - Trial Training",
      description: "New trial training request from potential member Lisa Anderson",
      timestamp: "2025-01-09T11:15:00",
      status: "pending",
      actionRequired: true,
      isArchived: false,
      details: {
        requestType: "Trial Training",
        name: "Lisa Anderson",
        email: "lisa.anderson@email.com",
        phone: "+1234567890",
        preferredDate: "2025-01-15",
        preferredTime: "10:00 AM",
        interests: ["Strength Training", "Cardio"],
        source: "Website Contact Form",
      },
    },
    {
      id: 6,
      type: "system",
      title: "System Backup Completed",
      description: "Daily system backup completed successfully at 3:00 AM",
      timestamp: "2025-01-09T03:00:00",
      status: "completed",
      actionRequired: false,
      isArchived: false,
      details: {
        backupSize: "2.4 GB",
        duration: "45 minutes",
        location: "Cloud Storage",
        nextBackup: "2025-01-10T03:00:00",
      },
    },
    {
      id: 8,
      type: "communication",
      title: "Newsletter Campaign Sent",
      description: "Monthly newsletter sent to 1,247 subscribers with 94% delivery rate",
      timestamp: "2025-01-09T08:00:00",
      status: "completed",
      actionRequired: false,
      isArchived: false,
      details: {
        campaign: "January 2025 Newsletter",
        totalRecipients: 1247,
        delivered: 1172,
        opened: 456,
        clicked: 89,
        bounced: 75,
      },
    },
    {
      id: 9,
      type: "vacation",
      title: "Vacation Request - Mike Johnson",
      description: "Requesting 3 days off for medical appointment",
      timestamp: "2025-01-08T16:20:00",
      status: "pending",
      actionRequired: true,
      isArchived: false,
      details: {
        employee: "Mike Johnson",
        department: "Personal Training",
        dates: "January 20-22, 2025",
        days: 3,
        reason: "Medical appointment",
        coverage: "Sarah Wilson (pending confirmation)",
        submittedAt: "2025-01-08T16:20:00",
      },
    },
    {
      id: 10,
      type: "appointment",
      title: "Appointment Cancellation - Last Minute",
      description: "Member cancelled appointment 30 minutes before scheduled time",
      timestamp: "2025-01-08T14:30:00",
      status: "cancelled",
      actionRequired: true,
      isArchived: false,
      details: {
        member: "Jennifer Wilson",
        appointmentType: "Personal Training",
        scheduledTime: "2025-01-08T15:00:00",
        cancelledAt: "2025-01-08T14:30:00",
        reason: "Emergency",
        trainer: "Alex Rodriguez",
        rescheduleRequested: true,
      },
    },
  ])

  const getActivityCounts = () => {
    const activeActivities = activities.filter((a) => !a.isArchived)
    const counts = {
      total: activeActivities.length,
      pending: activeActivities.filter((a) => a.actionRequired && a.status === "pending").length,
      failed: activeActivities.filter((a) => a.status === "failed").length,
      archived: activities.filter((a) => a.isArchived).length,
    }
    const typeCounts = {}
    Object.keys(activityTypes).forEach((type) => {
      typeCounts[type] = activeActivities.filter((a) => a.type === type).length
    })
    return { ...counts, ...typeCounts }
  }
  const counts = getActivityCounts()

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesArchivedStatus = showArchived ? activity.isArchived : !activity.isArchived
    const matchesFilter = selectedFilter === "all" || activity.type === selectedFilter
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesArchivedStatus && matchesFilter && matchesSearch
  })

  // Sort activities by timestamp
  const sortedActivities = filteredActivities.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-400" size={16} />
      case "failed":
        return <XCircle className="text-red-400" size={16} />
      case "pending":
        return <Clock className="text-yellow-400" size={16} />
      case "warning":
        return <AlertTriangle className="text-orange-400" size={16} />
      case "cancelled":
        return <XCircle className="text-gray-400" size={16} />
      case "investigating":
        return <AlertCircle className="text-blue-400" size={16} />
      case "approved":
        return <CheckCircle className="text-green-400" size={16} />
      case "rejected":
        return <XCircle className="text-red-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleActivityAction = (activity, action) => {
    setActivities((prevActivities) =>
      prevActivities.map((a) => {
        if (a.id === activity.id) {
          if (action === "approve") {
            toast.success("Request approved successfully")
            return { ...a, status: "approved", actionRequired: false }
          } else if (action === "reject") {
            toast.success("Request rejected and archived")
            return { ...a, status: "rejected", actionRequired: false, isArchived: true }
          } else if (action === "resolve") {
            toast.success("Issue resolved")
            return { ...a, status: "resolved", actionRequired: false }
          } else if (action === "archive") {
            toast.success("Activity archived")
            return { ...a, isArchived: true }
          }
        }
        return a
      }),
    )
  }

  const handleRefresh = () => {
    setLastRefresh(new Date())
    toast.success("Activity feed refreshed")
  }

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity)
    setIsDetailModalOpen(true)
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-3 sm:p-6">
        <div className="w-full mx-auto">
          {/* Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Activity Monitor</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#161616] hover:bg-[#2F2F2F] rounded-xl transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span className="sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Summary Cards - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Activities</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{counts.total}</p>
                </div>
                <div className="bg-blue-600 p-2 sm:p-3 rounded-xl">
                  <Activity size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Archived Activities</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-400">{counts.archived}</p>
                </div>
                <div className="bg-gray-600 p-2 sm:p-3 rounded-xl">
                  <Archive size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search - Mobile Optimized */}
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-3">
              {/* Primary Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedFilter("all")
                    setShowArchived(false)
                  }}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                    selectedFilter === "all" && !showArchived
                      ? "bg-blue-600 text-white"
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  All Active ({counts.total})
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter("all")
                    setShowArchived(true)
                  }}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                    showArchived ? "bg-gray-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  <Archive size={12} />
                  Archived ({counts.archived})
                </button>
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(activityTypes).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedFilter(type)
                      setShowArchived(false)
                    }}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                      selectedFilter === type && !showArchived
                        ? `${config.color} text-white`
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                  >
                    <config.icon size={12} />
                    <span className="hidden sm:inline">{config.name}</span>
                    <span className="sm:hidden">{config.name.split(" ")[0]}</span>({counts[type] || 0})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed - Mobile Optimized */}
          <div className="bg-[#161616] rounded-xl">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                {showArchived ? "Archived Activities" : "Activity Feed"}
              </h2>
            </div>
            <div className="divide-y divide-gray-700">
              {sortedActivities.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <Bell size={40} className="mx-auto mb-4 text-gray-400 sm:w-12 sm:h-12" />
                  <p className="text-gray-400">No activities found</p>
                </div>
              ) : (
                sortedActivities.map((activity) => {
                  const config = activityTypes[activity.type]
                  const Icon = config ? config.icon : Bell
                  return (
                    <div key={activity.id} className="p-4 sm:p-6 hover:bg-[#1F1F1F] transition-colors">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Activity Icon */}
                        <div className={`${config ? config.color : "bg-gray-600"} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
                          <Icon size={16} className="text-white sm:w-5 sm:h-5" />
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-white mb-1 text-sm sm:text-base leading-tight">
                                {activity.title}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{activity.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                              {getStatusIcon(activity.status)}
                              <span>{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {activity.actionRequired && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-600 text-white">
                                  ACTION REQUIRED
                                </span>
                              )}
                            </div>

                            {/* Action Buttons - Mobile Optimized */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewDetails(activity)}
                                className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={14} className="text-gray-400" />
                              </button>

                              {!activity.isArchived && activity.actionRequired && activity.status === "pending" && (
                                <>
                                  {activity.type === "vacation" && (
                                    <>
                                      <button
                                        onClick={() => handleActivityAction(activity, "approve")}
                                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                        title="Approve"
                                      >
                                        <Check size={14} className="text-white" />
                                      </button>
                                      <button
                                        onClick={() => handleActivityAction(activity, "reject")}
                                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                        title="Reject"
                                      >
                                        <X size={14} className="text-white" />
                                      </button>
                                    </>
                                  )}
                                  {(activity.type === "email" ||
                                    activity.type === "contract" ||
                                    activity.type === "appointment") && (
                                    <button
                                      onClick={() => handleActivityAction(activity, "resolve")}
                                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                      title="Mark as Resolved"
                                    >
                                      <Check size={14} className="text-white" />
                                    </button>
                                  )}
                                </>
                              )}

                              {!activity.isArchived && (
                                <button
                                  onClick={() => handleActivityAction(activity, "archive")}
                                  className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                  title="Archive"
                                >
                                  <Archive size={14} className="text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal - Mobile Optimized */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Modal Header - Mobile Optimized */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div
                    className={`${activityTypes[selectedActivity.type] ? activityTypes[selectedActivity.type].color : "bg-gray-600"} p-2 sm:p-3 rounded-xl flex-shrink-0`}
                  >
                    {(() => {
                      const Icon = activityTypes[selectedActivity.type]
                        ? activityTypes[selectedActivity.type].icon
                        : Bell
                      return <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                      {selectedActivity.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{selectedActivity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info - Mobile Optimized */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Activity Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="text-white text-sm sm:text-base">
                        {activityTypes[selectedActivity.type] ? activityTypes[selectedActivity.type].name : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedActivity.status)}
                        <span className="text-white capitalize text-sm sm:text-base">{selectedActivity.status}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-sm">Timestamp</p>
                      <p className="text-white text-sm sm:text-base">
                        {new Date(selectedActivity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {selectedActivity.isArchived && (
                      <div>
                        <p className="text-gray-400 text-sm">Archived</p>
                        <p className="text-white text-sm sm:text-base">Yes</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Information - Mobile Optimized */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Details</h3>

                  {selectedActivity.type === "vacation" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Employee</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.employee}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Department</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Dates</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.dates}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Days</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.days} days</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Reason</p>
                        <p className="text-white text-sm sm:text-base">{selectedActivity.details.reason}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Coverage</p>
                        <p className="text-white text-sm sm:text-base">{selectedActivity.details.coverage}</p>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "email" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-3">
                          Failed Emails ({selectedActivity.details.failedEmails.length})
                        </p>
                        <div className="space-y-3">
                          {selectedActivity.details.failedEmails.map((email, index) => (
                            <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-white font-medium text-sm sm:text-base">{email.member}</p>
                                  <p className="text-gray-400 text-xs sm:text-sm break-all">{email.email}</p>
                                </div>
                                <span className="text-red-400 text-xs flex-shrink-0">{email.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "contract" && (
                    <div className="space-y-4">
                      <p className="text-gray-400 text-sm mb-3">
                        Expiring Contracts ({selectedActivity.details.expiringContracts.length})
                      </p>
                      <div className="space-y-3">
                        {selectedActivity.details.expiringContracts.map((contract, index) => (
                          <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium text-sm sm:text-base">{contract.member}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Expires: {contract.expiryDate}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                                  contract.daysLeft <= 7
                                    ? "bg-red-600"
                                    : contract.daysLeft <= 14
                                      ? "bg-yellow-600"
                                      : "bg-orange-600"
                                } text-white`}
                              >
                                {contract.daysLeft} days left
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "appointment" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Request Type</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.requestType}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white text-sm sm:text-base break-all">{selectedActivity.details.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Date</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.preferredDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Time</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.preferredTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedActivity.details.interests.map((interest, index) => (
                            <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "communication" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <p className="text-gray-400 text-sm">Campaign</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.campaign}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Total Recipients</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.totalRecipients}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Delivered</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.delivered}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Opened</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.opened}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Clicked</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.clicked}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Bounced</p>
                          <p className="text-white text-sm sm:text-base">{selectedActivity.details.bounced}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Mobile Optimized */}
                {!selectedActivity.isArchived &&
                  selectedActivity.actionRequired &&
                  selectedActivity.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {selectedActivity.type === "vacation" && (
                        <>
                          <button
                            onClick={() => {
                              handleActivityAction(selectedActivity, "approve")
                              setIsDetailModalOpen(false)
                            }}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Approve Request
                          </button>
                          <button
                            onClick={() => {
                              handleActivityAction(selectedActivity, "reject")
                              setIsDetailModalOpen(false)
                            }}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={16} />
                            Reject Request
                          </button>
                        </>
                      )}
                      {(selectedActivity.type === "email" ||
                        selectedActivity.type === "contract" ||
                        selectedActivity.type === "appointment") && (
                        <button
                          onClick={() => {
                            handleActivityAction(selectedActivity, "resolve")
                            setIsDetailModalOpen(false)
                          }}
                          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={16} />
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
