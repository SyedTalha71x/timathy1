/* eslint-disable react/no-unescaped-entities */
// central sidebar reference code for widgets 
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import { useState, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit,
  Check,
  Plus,
  MessageCircle,
  ExternalLink,
  MoreVertical,
  Dumbbell,
  Eye,
  Bell,
  Settings,
  AlertTriangle,
  Info,
  CalendarIcon,
  Send,
  Users,
  Camera,
} from "lucide-react"
import { toast } from "react-hot-toast"
import Avatar from "../../public/gray-avatar-fotor-20250912192528.png"
import RightSidebarWidget from "./myarea-components/sidebar-components/RightSidebarWidget"
import { SpecialNoteEditModal } from "./myarea-components/SpecialNoteEditModal"
import StaffCheckInWidget from "./myarea-components/StaffWidgetCheckIn"
import ViewManagementModal from "./myarea-components/sidebar-components/ViewManagementModal"
import { bulletinBoardData, memberTypesData } from "../utils/user-panel-states/myarea-states"

const ChartWithLocalState = () => {
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const chartDropdownRef = useRef(null)

  const memberTypeKeys = Object.keys(memberTypesData)

  const chartOptions = {
    chart: {
      type: "line",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 4, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -30,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
    },
    title: {
      text: memberTypesData[selectedMemberType]?.title || "Chart Title",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypesData[selectedMemberType]?.growth || "0"} more in 2024`,
      align: "left",
      style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
        '<span style="color: black;">' +
        series[seriesIndex][dataPointIndex] +
        "</span></div>",
    },
  }

  const chartSeries = [
    {
      name: "Comp1",
      data: memberTypesData[selectedMemberType]?.data?.[0] || [],
    },
    {
      name: "Comp2",
      data: memberTypesData[selectedMemberType]?.data?.[1] || [],
    },
  ]

  return (
    <>
      <div className="relative mb-3" ref={chartDropdownRef}>
        <button
          onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#2F2F2F] rounded-xl text-white text-sm w-full justify-between"
        >
          {selectedMemberType}
          <ChevronDown className="w-4 h-4" />
        </button>
        {isChartDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
            {memberTypeKeys.map((typeKey) => (
              <button
                key={typeKey}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  setSelectedMemberType(typeKey)
                  setIsChartDropdownOpen(false)
                }}
              >
                {typeKey}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-full">
        <Chart options={chartOptions} series={chartSeries} type="line" height={250} />
      </div>
    </>
  )
}

const ReplyModal = ({ isOpen, onClose, message, onSendReply }) => {
  const [replyText, setReplyText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendReply = async () => {
    if (!replyText.trim()) return

    setIsLoading(true)
    try {
      await onSendReply(message.id, replyText)
      setReplyText("")
      toast.success("Reply sent successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to send reply")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] rounded-xl border border-gray-700 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src={message?.avatar || Avatar} alt="User" className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="text-white font-medium text-sm">Reply to {message?.name}</h3>
              <p className="text-xs text-zinc-400">{message?.type === "member" ? "Member Chat" : "Studio Chat"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Original Message */}
        <div className="p-4 bg-black/30 border-b border-gray-700">
          <p className="text-sm text-zinc-300 italic">"{message?.message}"</p>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
            <Clock size={12} />
            {message?.time}
          </p>
        </div>

        {/* Reply Input */}
        <div className="p-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="w-full bg-black rounded-lg p-3 text-white text-sm resize-none border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows={4}
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white" disabled={isLoading}>
              Cancel
            </button>
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const CollapsibleNotificationSection = ({
  title,
  icon,
  notifications,
  isCollapsed,
  onToggle,
  onMessageClick,
  unreadCount = 0,
}) => {
  return (
    <div className="mb-4">
      {/* Section Header - Collapsible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-white">{title}</span>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Section Content - Collapsible */}
      {!isCollapsed && (
        <div className="mt-2 space-y-2">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 bg-black rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                onClick={() => onMessageClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <img src={notification.avatar || Avatar} alt="User" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white truncate">
                        {notification.name || notification.title}
                      </h3>
                      {!notification.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock size={12} />
                        {notification.time}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMessageClick(notification)
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                      >
                        <MessageCircle size={12} />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-zinc-400">
              <p className="text-sm">No {title.toLowerCase()} messages</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Sidebar = ({
  isRightSidebarOpen,
  toggleRightSidebar,
  isSidebarEditing,
  toggleSidebarEditing,
  rightSidebarWidgets,
  moveRightSidebarWidget,
  removeRightSidebarWidget,
  setIsRightWidgetModalOpen,
  communications,
  redirectToCommunication,
  todos,
  handleTaskComplete,
  openDropdownIndex,
  toggleDropdown,
  handleEditTask,
  setTaskToCancel,
  setTaskToDelete,
  birthdays,
  isBirthdayToday,
  handleSendBirthdayMessage,
  customLinks,
  truncateUrl,
  appointments,
  handleDumbbellClick,
  handleCheckIn,
  handleAppointmentOptionsModal,
  expiringContracts,
  onClose,
  hasUnreadNotifications,
  notifications,
  markMessageAsRead, // Added markMessageAsRead prop
  onSaveSpecialNote, // Added onSaveSpecialNote prop
}) => {
  const todoFilterDropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const notePopoverRef = useRef(null)

  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("widgets")

  const [sidebarActiveNoteId, setSidebarActiveNoteId] = useState(null)
  const [isSidebarSpecialNoteModalOpen, setIsSidebarSpecialNoteModalOpen] = useState(false)
  const [selectedSidebarAppointmentForNote, setSelectedSidebarAppointmentForNote] = useState(null)

  const [sidebarBulletinFilter, setSidebarBulletinFilter] = useState("all")

  // Local state for todo filtering
  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [memberChatCollapsed, setMemberChatCollapsed] = useState(false)
  const [studioChatCollapsed, setStudioChatCollapsed] = useState(false)

  // Todo filter options
  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]

  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing")
      case "pending":
        return todos.filter((todo) => todo.status === "pending")
      case "completed":
        return todos.filter((todo) => todo.status === "completed")
      default:
        return todos
    }
  }

  const getMemberChatNotifications = () => {
    return (
      notifications?.filter(
        (notification) => notification.type === "member" || notification.category === "member_chat",
      ) || []
    )
  }

  const getStudioChatNotifications = () => {
    return (
      notifications?.filter(
        (notification) => notification.type === "studio" || notification.category === "studio_chat",
      ) || []
    )
  }

  const getMemberChatUnreadCount = () => {
    return getMemberChatNotifications().filter((n) => !n.isRead).length
  }

  const getStudioChatUnreadCount = () => {
    return getStudioChatNotifications().filter((n) => !n.isRead).length
  }

  const handleMessageClick = (message) => {
    setSelectedMessage(message)
    setIsReplyModalOpen(true)

    // Mark message as read when clicked
    if (!message.isRead && typeof markMessageAsRead === "function") {
      markMessageAsRead(message.id)
    }
  }

  const handleSendReply = async (messageId, replyText) => {
    // This is where you would integrate with your backend API
    // Example implementation:
    try {
      // await sendReplyToMessage(messageId, replyText);
      console.log("Sending reply to message:", messageId, "Reply:", replyText)

      // You can add your API call here
      // const response = await fetch('/api/messages/reply', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ messageId, reply: replyText })
      // });

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to send reply:", error)
      throw error
    }
  }

  const handleSidebarBulletinFilterChange = (filter) => {
    setSidebarBulletinFilter(filter)
  }

  const getSidebarFilteredBulletinPosts = () => {
    if (sidebarBulletinFilter === "all") {
      return bulletinBoardData
    }
    return bulletinBoardData.filter((post) => post.category === sidebarBulletinFilter)
  }

  const handleSidebarEditNote = (appointmentId, currentNote) => {
    const appointment = appointments.find((app) => app.id === appointmentId)
    if (appointment) {
      setIsSidebarSpecialNoteModalOpen(false)
      setSelectedSidebarAppointmentForNote(null)

      setTimeout(() => {
        setSelectedSidebarAppointmentForNote(appointment)
        setIsSidebarSpecialNoteModalOpen(true)
      }, 10)
    }
  }

  const handleSaveSidebarSpecialNote = (appointmentId, updatedNote) => {
    if (typeof onSaveSpecialNote === "function") {
      onSaveSpecialNote(appointmentId, updatedNote)
    }
    toast.success("Special note updated successfully")
  }

  const renderSidebarSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setSidebarActiveNoteId(sidebarActiveNoteId === memberId ? null : memberId)
      }

      return (
        <div className="relative">
          <div
            className={`${
              specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {sidebarActiveNoteId === memberId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
            >
              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                {specialNote.isImportant ? (
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                ) : (
                  <Info className="text-blue-500 shrink-0" size={18} />
                )}
                <h4 className="text-white flex text-sm gap-1 items-center font-medium">
                  <div>Special Note</div>
                  <div className="text-sm text-gray-400">
                    {specialNote.isImportant ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={() => handleSidebarEditNote(memberId, specialNote)}
                  className="ml-auto text-gray-400 hover:text-white mr-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSidebarActiveNoteId(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
                {specialNote.startDate && specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Always valid
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [sidebarActiveNoteId, appointments],
  )

  return (
    <>
      <aside
        className={`
            fixed top-0 right-0 h-full text-white w-full sm:w-96 lg:w-88 bg-[#181818] border-l border-gray-700 z-50
            transform transition-transform duration-500 ease-in-out
            ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
          `}
      >
        <div className="p-4 md:p-5 custom-scrollbar overflow-y-auto h-full">
          {/* Header with close button and add widget button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate">Sidebar</h2>
                  {currentView && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                      {currentView.name}
                    </span>
                  )}
                </div>
              </div>
              <div></div>
              <div className="flex items-center gap-1 sm:gap-2">
                {!isSidebarEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="p-1.5 sm:p-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                    title="Manage Sidebar Views"
                  >
                    <Eye size={14} />
                  </button>
                )}
                {activeTab === "widgets" && isSidebarEditing && (
                  <button
                    onClick={() => setIsRightWidgetModalOpen(true)}
                    className="p-1.5 sm:p-2 bg-black text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
                    title="Add Widget"
                  >
                    <Plus size={14} />
                  </button>
                )}
                {activeTab === "widgets" && (
                  <button
                    onClick={toggleSidebarEditing}
                    className={`p-1.5 sm:p-2 ${
                      isSidebarEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                    } rounded-lg flex items-center gap-1`}
                    title="Toggle Edit Mode"
                  >
                    {isSidebarEditing ? <Check size={14} /> : <Edit size={14} />}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex mb-3 sm:mb-4 bg-black rounded-xl p-1">
            <button
              onClick={() => setActiveTab("widgets")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "widgets" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Widgets</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === "notifications" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bell size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>

              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                  {getMemberChatUnreadCount() + getStudioChatUnreadCount()}
                </span>
              )}
            </button>
          </div>

          {activeTab === "notifications" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl open_sans_font_700">Notifications</h2>
                {/* Optional: Add a "Mark all as read" button */}
                <button
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    // Add logic to mark all notifications as read
                    console.log("Mark all as read")
                  }}
                >
                  Mark all read
                </button>
              </div>

              {/* Member Chat Section - Collapsible */}
              <CollapsibleNotificationSection
                title="Member Chat"
                icon={<Users size={16} className="text-green-400" />}
                notifications={getMemberChatNotifications()}
                isCollapsed={memberChatCollapsed}
                onToggle={() => setMemberChatCollapsed(!memberChatCollapsed)}
                onMessageClick={handleMessageClick}
                unreadCount={getMemberChatUnreadCount()}
              />

              {/* Studio Chat Section - Collapsible */}
              <CollapsibleNotificationSection
                title="Studio Chat"
                icon={<Camera size={16} className="text-purple-400" />}
                notifications={getStudioChatNotifications()}
                isCollapsed={studioChatCollapsed}
                onToggle={() => setStudioChatCollapsed(!studioChatCollapsed)}
                onMessageClick={handleMessageClick}
                unreadCount={getStudioChatUnreadCount()}
              />

              {/* Show empty state if no notifications */}
              {(!notifications || notifications.length === 0) && (
                <div className="text-center py-8 text-zinc-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notifications</p>
                  <p className="text-xs mt-1">New messages will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Widgets Tab Content */}
          {activeTab === "widgets" && (
            <>
              {rightSidebarWidgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <RightSidebarWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    isEditing={isSidebarEditing}
                    moveRightSidebarWidget={moveRightSidebarWidget}
                    removeRightSidebarWidget={removeRightSidebarWidget}
                  >
                    {/* ... existing widget code remains the same ... */}
                    {widget.type === "communications" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Communications</h2>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {communications.slice(0, 2).map((comm) => (
                              <div
                                onClick={redirectToCommunication}
                                key={comm.id}
                                className="p-2 cursor-pointer bg-black rounded-xl"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <img
                                    src={comm.avatar || "/placeholder.svg"}
                                    alt="User"
                                    className="rounded-full h-8 w-8"
                                  />
                                  <div>
                                    <h3 className="open_sans_font text-sm">{comm.name}</h3>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs open_sans_font text-zinc-400">{comm.message}</p>
                                  <p className="text-xs mt-1 flex gap-1 items-center open_sans_font text-zinc-400">
                                    <Clock size={12} />
                                    {comm.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <Link
                              to={"/dashboard/communication"}
                              className="text-sm open_sans_font text-white flex justify-center items-center text-center hover:underline"
                            >
                              See all
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ... rest of the existing widget code remains unchanged ... */}
                    {widget.type === "todo" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">To-Do</h2>
                        </div>
                        <div className="relative mb-3" ref={todoFilterDropdownRef}>
                          <button
                            onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm w-full justify-between"
                          >
                            {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {isTodoFilterDropdownOpen && (
                            <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
                              {todoFilterOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                  onClick={() => {
                                    setTodoFilter(option.value)
                                    setIsTodoFilterDropdownOpen(false)
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3 open_sans_font">
                          {getFilteredTodos()
                            .slice(0, 3)
                            .map((todo) => (
                              <div key={todo.id} className="p-2 bg-black rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleTaskComplete(todo.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <h3
                                      className={`font-semibold open_sans_font text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}
                                    >
                                      {todo.title}
                                    </h3>
                                    <p className="text-xs open_sans_font text-zinc-400">
                                      Due: {todo.dueDate} {todo.dueTime && `at ${todo.dueTime}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleDropdown(`todo-${todo.id}`)
                                    }}
                                    className="p-1 hover:bg-zinc-700 rounded"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {openDropdownIndex === `todo-${todo.id}` && (
                                    <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                      <button
                                        onClick={() => {
                                          handleEditTask(todo)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                      >
                                        Edit Task
                                      </button>
                                      <button
                                        onClick={() => {
                                          setTaskToCancel(todo.id)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                      >
                                        Cancel Task
                                      </button>
                                      <button
                                        onClick={() => {
                                          setTaskToDelete(todo.id)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                      >
                                        Delete Task
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          <Link
                            to={"/dashboard/to-do"}
                            className="text-sm open_sans_font text-white flex justify-center items-center text-center hover:underline"
                          >
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* ... rest of existing widgets remain the same ... */}
                    {widget.type === "birthday" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Upcoming Birthday</h2>
                        </div>
                        <div className="space-y-2 open_sans_font">
                          {birthdays.slice(0, 3).map((birthday) => (
                            <div
                              key={birthday.id}
                              className={`p-2 cursor-pointer rounded-xl flex items-center gap-2 justify-between ${
                                isBirthdayToday(birthday.date)
                                  ? "bg-yellow-900/30 border border-yellow-600"
                                  : "bg-black"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div>
                                  <img
                                    src={birthday.avatar || "/placeholder.svg"}
                                    className="h-8 w-8 rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold open_sans_font text-sm flex items-center gap-1">
                                    {birthday.name}
                                    {isBirthdayToday(birthday.date) && <span className="text-yellow-500">🎂</span>}
                                  </h3>
                                  <p className="text-xs open_sans_font text-zinc-400">{birthday.date}</p>
                                </div>
                              </div>
                              {isBirthdayToday(birthday.date) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSendBirthdayMessage(birthday)
                                  }}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                  title="Send Birthday Message"
                                >
                                  <MessageCircle size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "websiteLinks" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Website Links</h2>
                        </div>
                        <div className="space-y-2 open_sans_font">
                          {customLinks.map((link) => (
                            <div
                              key={link.id}
                              className="p-2 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                            >
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold open_sans_font text-sm truncate">{link.title}</h3>
                                <p className="text-xs open_sans_font text-zinc-400 truncate max-w-[150px]">
                                  {truncateUrl(link.url, 30)}
                                </p>
                              </div>
                              <button
                                onClick={() => window.open(link.url, "_blank")}
                                className="p-2 hover:bg-zinc-700 rounded-lg"
                              >
                                <ExternalLink size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "appointments" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">
                            Upcoming Appointments
                          </h2>
                        </div>
                        <div className="space-y-2 max-h-[25vh] overflow-y-auto custom-scrollbar pr-1">
                          {appointments.length > 0 ? (
                            appointments.slice(0, 2).map((appointment, index) => (
                              <div
                                key={appointment.id}
                                className={`${appointment.color} rounded-xl cursor-pointer p-3 relative`}
                              >
                                <div className="absolute p-2 top-0 left-0 z-10 flex flex-col gap-1">
                                  {renderSidebarSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                </div>
                                <div
                                  className="flex flex-col items-center justify-between gap-2 cursor-pointer"
                                  onClick={() => {
                                    handleAppointmentOptionsModal(appointment)
                                  }}
                                >
                                  <div className="flex items-center gap-2 ml-5 relative w-full justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                                      <img
                                        src={Avatar || "/placeholder.svg"}
                                        alt=""
                                        className="w-full h-full rounded-full"
                                      />
                                    </div>
                                    <div className="text-white text-left">
                                      <p className="font-semibold text-sm">{appointment.name}</p>
                                      <p className="text-xs flex gap-1 items-center opacity-80">
                                        <Clock size={14} />
                                        {appointment.time} | {appointment.date.split("|")[0]}
                                      </p>
                                      <p className="text-xs opacity-80 mt-1">
                                        {appointment.isTrial ? "Trial Session" : appointment.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCheckIn(appointment.id)
                                      }}
                                      className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                        appointment.isCheckedIn
                                          ? " border border-white/50 text-white bg-transparent"
                                          : "bg-black text-white"
                                      }`}
                                    >
                                      {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                    </button>
                                    <div
                                      className="cursor-pointer rounded transition-colors"
                                      onClick={(e) => handleDumbbellClick(appointment, e)}
                                    >
                                      <Dumbbell size={16} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-white text-center text-sm">No appointments scheduled.</p>
                          )}
                        </div>
                        <div className="flex justify-center mt-2">
                          <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {isSidebarSpecialNoteModalOpen && selectedSidebarAppointmentForNote && (
                      <SpecialNoteEditModal
                        isOpen={isSidebarSpecialNoteModalOpen}
                        onClose={() => {
                          setIsSidebarSpecialNoteModalOpen(false)
                          setSelectedSidebarAppointmentForNote(null)
                        }}
                        appointment={selectedSidebarAppointmentForNote}
                        onSave={handleSaveSidebarSpecialNote}
                      />
                    )}

                    {widget.type === "chart" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Chart</h2>
                        </div>
                        <div className="p-4 bg-black rounded-xl">
                          <ChartWithLocalState />
                        </div>
                      </div>
                    )}
                    {widget.type === "expiringContracts" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Expiring Contracts</h2>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {expiringContracts.slice(0, 3).map((contract) => (
                            <Link to="/dashboard/contract" key={contract.id}>
                              <div className="p-3 bg-black rounded-lg hover:bg-zinc-900 mt-2 transition-colors">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0">
                                    <h3 className="text-sm font-medium truncate">{contract.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400">Expires: {contract.expiryDate}</p>
                                  </div>
                                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap">
                                    {contract.status}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="flex justify-center mt-3">
                          <Link to="/dashboard/contract" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {widget.type === "bulletinBoard" && (
                      <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] h-auto flex flex-col">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Bulletin Board</h2>
                        </div>
                        <div className="relative">
                          <select
                            value={sidebarBulletinFilter}
                            onChange={(e) => handleSidebarBulletinFilterChange(e.target.value)}
                            className="w-full p-2 bg-black rounded-xl text-white text-sm"
                          >
                            <option value="all">All Posts</option>
                            <option value="staff">Staff Only</option>
                            <option value="members">Members Only</option>
                          </select>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mt-2">
                          <div className="space-y-2">
                            {getSidebarFilteredBulletinPosts()
                              .slice(0, 2)
                              .map((post) => (
                                <div key={post.id} className="p-3 bg-black rounded-xl">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-sm">{post.title}</h3>
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{post.content}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-zinc-500 capitalize">{post.category}</span>
                                    <span className="text-xs text-zinc-500">{post.date}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {widget.type === "staffCheckIn" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Staff login</h2>
                        </div>
                        <div className="bg-black rounded-xl p-4">
                          <StaffCheckInWidget />
                        </div>
                      </div>
                    )}
                  </RightSidebarWidget>
                ))}
            </>
          )}
        </div>
      </aside>

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false)
          setSelectedMessage(null)
        }}
        message={selectedMessage}
        onSendReply={handleSendReply}
      />

      <ViewManagementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarWidgets={rightSidebarWidgets}
        setSidebarWidgets={() => {}}
      />
    </>
  )
}

export default Sidebar
