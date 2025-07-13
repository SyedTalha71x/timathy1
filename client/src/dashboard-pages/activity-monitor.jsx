import { useState } from "react"
import {
  Bell,
  Clock,
  MailX,
  Calendar,
  Users,
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
  Plane,
  CreditCard,
  MessageSquare,
  Settings,
  Activity,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function ActivityMonitor() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Activity types configuration
  const activityTypes = {
    vacation: { name: "Vacation Requests", icon: Plane, color: "bg-blue-600", textColor: "text-blue-400" },
    email: { name: "Email Issues", icon: MailX, color: "bg-red-600", textColor: "text-red-400" },
    contract: { name: "Contract Expiring", icon: FileText, color: "bg-yellow-600", textColor: "text-yellow-400" },
    appointment: { name: "Appointment Requests", icon: Calendar, color: "bg-green-600", textColor: "text-green-400" },
    payment: { name: "Payment Issues", icon: CreditCard, color: "bg-purple-600", textColor: "text-purple-400" },
    system: { name: "System Alerts", icon: Settings, color: "bg-gray-600", textColor: "text-gray-400" },
    member: { name: "Member Issues", icon: Users, color: "bg-orange-600", textColor: "text-orange-400" },
    communication: {
      name: "Communications",
      icon: MessageSquare,
      color: "bg-indigo-600",
      textColor: "text-indigo-400",
    },
  }

  // Sample activities data
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "vacation",
      priority: "high",
      title: "Vacation Request - Sarah Wilson",
      description: "Requesting 5 days off from March 15-19, 2025 for family vacation",
      timestamp: "2025-01-09T14:30:00",
      status: "pending",
      actionRequired: true,
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
      priority: "urgent",
      title: "Failed Email Delivery - Member Notifications",
      description: "5 appointment reminder emails failed to send due to invalid email addresses",
      timestamp: "2025-01-09T13:45:00",
      status: "failed",
      actionRequired: true,
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
      priority: "high",
      title: "Contract Expiring Soon - 3 Members",
      description: "3 member contracts are expiring within the next 30 days",
      timestamp: "2025-01-09T12:00:00",
      status: "warning",
      actionRequired: true,
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
      priority: "normal",
      title: "New Appointment Request - Trial Training",
      description: "New trial training request from potential member Lisa Anderson",
      timestamp: "2025-01-09T11:15:00",
      status: "pending",
      actionRequired: true,
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
      id: 5,
      type: "payment",
      priority: "high",
      title: "Payment Failed - Monthly Subscriptions",
      description: "2 monthly subscription payments failed due to expired credit cards",
      timestamp: "2025-01-09T10:30:00",
      status: "failed",
      actionRequired: true,
      details: {
        failedPayments: [
          { member: "Michael Brown", amount: "$99.99", reason: "Card expired", lastAttempt: "2025-01-09T10:30:00" },
          { member: "Emma Davis", amount: "$89.99", reason: "Insufficient funds", lastAttempt: "2025-01-09T10:25:00" },
        ],
      },
    },
    {
      id: 6,
      type: "system",
      priority: "normal",
      title: "System Backup Completed",
      description: "Daily system backup completed successfully at 3:00 AM",
      timestamp: "2025-01-09T03:00:00",
      status: "completed",
      actionRequired: false,
      details: {
        backupSize: "2.4 GB",
        duration: "45 minutes",
        location: "Cloud Storage",
        nextBackup: "2025-01-10T03:00:00",
      },
    },
    {
      id: 7,
      type: "member",
      priority: "normal",
      title: "Member Check-in Issue",
      description: "Member Tom Wilson reported issues with check-in system",
      timestamp: "2025-01-09T09:45:00",
      status: "investigating",
      actionRequired: true,
      details: {
        member: "Tom Wilson",
        issue: "Unable to check-in using membership card",
        reportedAt: "2025-01-09T09:45:00",
        attempts: 3,
        lastSuccessfulCheckIn: "2025-01-08T18:30:00",
      },
    },
    {
      id: 8,
      type: "communication",
      priority: "low",
      title: "Newsletter Campaign Sent",
      description: "Monthly newsletter sent to 1,247 subscribers with 94% delivery rate",
      timestamp: "2025-01-09T08:00:00",
      status: "completed",
      actionRequired: false,
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
      priority: "normal",
      title: "Vacation Request - Mike Johnson",
      description: "Requesting 3 days off for medical appointment",
      timestamp: "2025-01-08T16:20:00",
      status: "pending",
      actionRequired: true,
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
      priority: "urgent",
      title: "Appointment Cancellation - Last Minute",
      description: "Member cancelled appointment 30 minutes before scheduled time",
      timestamp: "2025-01-08T14:30:00",
      status: "cancelled",
      actionRequired: true,
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

  // Get activity counts by type and priority
  const getActivityCounts = () => {
    const counts = {
      total: activities.length,
      pending: activities.filter((a) => a.actionRequired && a.status === "pending").length,
      urgent: activities.filter((a) => a.priority === "urgent").length,
      failed: activities.filter((a) => a.status === "failed").length,
    }

    const typeCounts = {}
    Object.keys(activityTypes).forEach((type) => {
      typeCounts[type] = activities.filter((a) => a.type === type).length
    })

    return { ...counts, ...typeCounts }
  }

  const counts = getActivityCounts()

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = selectedFilter === "all" || activity.type === selectedFilter
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Sort activities by priority and timestamp
  const sortedActivities = filteredActivities.sort((a, b) => {
    const priorityOrder = { urgent: 3, high: 2, normal: 1, low: 0 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600"
      case "high":
        return "bg-orange-600"
      case "normal":
        return "bg-blue-600"
      case "low":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

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
    if (action === "approve") {
      setActivities(activities.map((a) => (a.id === activity.id ? { ...a, status: "approved" } : a)))
      toast.success("Request approved successfully")
    } else if (action === "reject") {
      setActivities(activities.map((a) => (a.id === activity.id ? { ...a, status: "rejected" } : a)))
      toast.success("Request rejected")
    } else if (action === "resolve") {
      setActivities(activities.map((a) => (a.id === activity.id ? { ...a, status: "resolved" } : a)))
      toast.success("Issue resolved")
    } else if (action === "archive") {
      setActivities(activities.filter((a) => a.id !== activity.id))
      toast.success("Activity archived")
    }
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
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Activity Monitor</h1>
              <p className="text-gray-400">Monitor system activities and notifications requiring attention</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">Last updated: {lastRefresh.toLocaleTimeString()}</div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#161616] hover:bg-[#2F2F2F] rounded-xl transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#161616] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Activities</p>
                  <p className="text-2xl font-bold text-white">{counts.total}</p>
                </div>
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Activity size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#161616] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Actions</p>
                  <p className="text-2xl font-bold text-yellow-400">{counts.pending}</p>
                </div>
                <div className="bg-yellow-600 p-3 rounded-xl">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#161616] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Urgent Items</p>
                  <p className="text-2xl font-bold text-red-400">{counts.urgent}</p>
                </div>
                <div className="bg-red-600 p-3 rounded-xl">
                  <AlertTriangle size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#161616] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Failed Items</p>
                  <p className="text-2xl font-bold text-red-400">{counts.failed}</p>
                </div>
                <div className="bg-red-600 p-3 rounded-xl">
                  <XCircle size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] pl-10 pr-4 py-2 text-sm  rounded-xl text-white placeholder-gray-500 border border-gray-700 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
              >
                All ({counts.total})
              </button>
              {Object.entries(activityTypes).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedFilter === type
                      ? `${config.color} text-white`
                      : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
                >
                  <config.icon size={14} />
                  {config.name} ({counts[type] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#161616] rounded-xl">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
            </div>

            <div className="divide-y divide-gray-700">
              {sortedActivities.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No activities found</p>
                </div>
              ) : (
                sortedActivities.map((activity) => {
                  const config = activityTypes[activity.type]
                  const Icon = config.icon

                  return (
                    <div key={activity.id} className="p-6 hover:bg-[#1F1F1F] transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Priority Indicator */}
                        <div className={`w-1 h-16 rounded-full ${getPriorityColor(activity.priority)}`} />

                        {/* Activity Icon */}
                        <div className={`${config.color} p-3 rounded-xl flex-shrink-0`}>
                          <Icon size={20} className="text-white" />
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white mb-1">{activity.title}</h3>
                              <p className="text-gray-400 text-sm">{activity.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {getStatusIcon(activity.status)}
                              <span>{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${config.textColor} bg-opacity-20 ${config.color}`}
                              >
                                {config.name}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(activity.priority)} text-white`}
                              >
                                {activity.priority.toUpperCase()}
                              </span>
                              {activity.actionRequired && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-600 text-white">
                                  ACTION REQUIRED
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(activity)}
                                className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={14} className="text-gray-400" />
                              </button>

                              {activity.actionRequired && activity.status === "pending" && (
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
                                    activity.type === "member" ||
                                    activity.type === "payment") && (
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

                              <button
                                onClick={() => handleActivityAction(activity, "archive")}
                                className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                title="Archive"
                              >
                                <Archive size={14} className="text-gray-400" />
                              </button>
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

      {/* Activity Detail Modal */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`${activityTypes[selectedActivity.type].color} p-3 rounded-xl`}>
                    {(() => {
                      const Icon = activityTypes[selectedActivity.type].icon
                      return <Icon size={24} className="text-white" />
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedActivity.title}</h2>
                    <p className="text-gray-400">{selectedActivity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Activity Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="text-white">{activityTypes[selectedActivity.type].name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Priority</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedActivity.priority)} text-white`}
                      >
                        {selectedActivity.priority.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedActivity.status)}
                        <span className="text-white capitalize">{selectedActivity.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Timestamp</p>
                      <p className="text-white">{new Date(selectedActivity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="bg-[#161616] rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Details</h3>

                  {selectedActivity.type === "vacation" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Employee</p>
                          <p className="text-white">{selectedActivity.details.employee}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Department</p>
                          <p className="text-white">{selectedActivity.details.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Dates</p>
                          <p className="text-white">{selectedActivity.details.dates}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Days</p>
                          <p className="text-white">{selectedActivity.details.days} days</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Reason</p>
                        <p className="text-white">{selectedActivity.details.reason}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Coverage</p>
                        <p className="text-white">{selectedActivity.details.coverage}</p>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "email" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">
                          Failed Emails ({selectedActivity.details.failedEmails.length})
                        </p>
                        <div className="space-y-2">
                          {selectedActivity.details.failedEmails.map((email, index) => (
                            <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-white font-medium">{email.member}</p>
                                  <p className="text-gray-400 text-sm">{email.email}</p>
                                </div>
                                <span className="text-red-400 text-xs">{email.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "contract" && (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm mb-2">
                        Expiring Contracts ({selectedActivity.details.expiringContracts.length})
                      </p>
                      <div className="space-y-2">
                        {selectedActivity.details.expiringContracts.map((contract, index) => (
                          <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">{contract.member}</p>
                                <p className="text-gray-400 text-sm">Expires: {contract.expiryDate}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
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
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white">{selectedActivity.details.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Request Type</p>
                          <p className="text-white">{selectedActivity.details.requestType}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{selectedActivity.details.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white">{selectedActivity.details.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Date</p>
                          <p className="text-white">{selectedActivity.details.preferredDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Preferred Time</p>
                          <p className="text-white">{selectedActivity.details.preferredTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Interests</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedActivity.details.interests.map((interest, index) => (
                            <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.type === "payment" && (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm mb-2">
                        Failed Payments ({selectedActivity.details.failedPayments.length})
                      </p>
                      <div className="space-y-2">
                        {selectedActivity.details.failedPayments.map((payment, index) => (
                          <div key={index} className="bg-[#2F2F2F] rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{payment.member}</p>
                                <p className="text-gray-400 text-sm">Amount: {payment.amount}</p>
                                <p className="text-gray-400 text-sm">
                                  Last attempt: {new Date(payment.lastAttempt).toLocaleString()}
                                </p>
                              </div>
                              <span className="text-red-400 text-xs">{payment.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedActivity.actionRequired && selectedActivity.status === "pending" && (
                  <div className="flex gap-4">
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
                      selectedActivity.type === "member" ||
                      selectedActivity.type === "payment") && (
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
