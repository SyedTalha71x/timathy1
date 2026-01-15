
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  X,
  Clock,
  ChevronDown,
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
  ChevronUp,
  Reply,
  Users,
  User,
  Building2,
  ChevronRight,
  Minimize2,
  Maximize2,
  Activity,
} from "lucide-react"
import { toast } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import StaffCheckInWidget from "./widgets/StaffWidgetCheckIn"
import { SpecialNoteEditModal } from "./SpecialNoteEditModal"
import RightSidebarWidget from "./sidebar-components/RightSidebarWidget"
import ViewManagementModal from "./sidebar-components/ViewManagementModal"
import { demoNotifications, memberTypesData } from "../../utils/user-panel-states/myarea-states"
import BulletinBoardWidget from "./widgets/BulletinBoardWidget"
import NotesWidget from "./widgets/NotesWidjets"
import { configuredTagsData } from "../../utils/user-panel-states/todo-states"
import AddTaskModal from "../user-panel-components/todo-components/add-task-modal"
import ShiftScheduleWidget from "./widgets/ShiftScheduleWidget"
import { createPortal } from "react-dom"
import ReplyModal from "./sidebar-components/ReplyModal"


const Sidebar = ({
  isRightSidebarOpen,
  toggleRightSidebar,
  isSidebarEditing,
  toggleSidebarEditing,
  rightSidebarWidgets,
  moveRightSidebarWidget,
  removeRightSidebarWidget,
  setIsRightWidgetModalOpen,
  todos,
  setTodos,
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
  onSaveSpecialNote,
}) => {
  const todoFilterDropdownRef = useRef(null);
  const notePopoverRef = useRef(null);

  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [pendingActivityAction, setPendingActivityAction] = useState(null);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData);
  const [sidebarCustomLinks, setSidebarCustomLinks] = useState(customLinks || []);
  const [sidebarOpenDropdownIndex, setSidebarOpenDropdownIndex] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [isWebsiteLinkModalOpen, setIsWebsiteLinkModalOpen] = useState(false);
  const [savedViews, setSavedViews] = useState([]);
  const [currentView, setCurrentView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("widgets");
  const [sidebarActiveNoteId, setSidebarActiveNoteId] = useState(null);
  const [isSidebarSpecialNoteModalOpen, setIsSidebarSpecialNoteModalOpen] = useState(false);
  const [selectedSidebarAppointmentForNote, setSelectedSidebarAppointmentForNote] = useState(null);
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 });
  const [hoveredNoteId, setHoveredNoteId] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [notificationData, setNotificationData] = useState(demoNotifications);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    memberChat: false,
    studioChat: false,
    activityMonitor: false,
  });

  // Local state for todo filtering
  const [todoFilter, setTodoFilter] = useState("all");
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false);

  // New states for widget collapse and expand
  const [collapsedWidgets, setCollapsedWidgets] = useState({});
  const [expandedWidgetSizes, setExpandedWidgetSizes] = useState({});

  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "canceled", label: "Canceled", color: "#ef4444" },
  ];

  const activityTypes = {
    vacation: { icon: Users, color: "bg-blue-600" },
    contract: { icon: Building2, color: "bg-orange-600" },
    appointment: { icon: CalendarIcon, color: "bg-green-600" },
    email: { icon: MessageCircle, color: "bg-purple-600" },
  };

  // New functions for widget controls
  const toggleWidgetCollapse = (widgetId) => {
    setCollapsedWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  const toggleWidgetSize = (widgetId) => {
    setExpandedWidgetSizes(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };


  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getWidgetHeightClass = (widgetId, defaultHeight = "h-auto") => {
    const widget = rightSidebarWidgets.find(w => w.id === widgetId);
    if (widget && widget.type === "staffCheckIn") {
      return "h-auto"; 
    }
    
    if (expandedWidgetSizes[widgetId]) {
      return "min-h-[500px] max-h-[600px] h-auto";
    }
    return defaultHeight;
  };

  const getWidgetDisplayName = (widgetType) => {
    const names = {
      todo: "To-Do",
      birthday: "Birthdays",
      websiteLinks: "Website Links",
      appointments: "Upcoming Appointments",
      chart: "Analytics Chart",
      expiringContracts: "Expiring Contracts",
      bulletinBoard: "Bulletin Board",
      notes: "Notes",
      staffCheckIn: "Staff Login",
      shiftSchedule: "Shift Schedule"
    };
    return names[widgetType] || widgetType;
  };

  const handleAddTask = (newTask) => {
    setTodos((prevTodos) => [...prevTodos, newTask]);
    toast.success("Task added successfully!");
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const handleSendReply = (chatId, replyText) => {
    console.log(`Sending reply to chat ${chatId}: ${replyText}`);
    setNotificationData((prev) => ({
      ...prev,
      memberChat: prev.memberChat.map((msg) => (msg.chatId === chatId ? { ...msg, isRead: true } : msg)),
      studioChat: prev.studioChat.map((msg) => (msg.chatId === chatId ? { ...msg, isRead: true } : msg)),
    }));
  };

  const handleOpenFullMessenger = (message) => {
    setIsReplyModalOpen(false);
    window.location.href = `/dashboard/communication`;
    toast.success(`Redirecting to ${message.type === "member_chat" ? "Member" : "Studio"} Messenger`);
  };

  const toggleNotificationSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const markMessageAsRead = (messageId, messageType) => {
    const sectionKey = messageType === "member_chat" ? "memberChat" : "studioChat";
    setNotificationData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)),
    }));
  };

  const getUnreadCount = (section) => {
    return notificationData[section].filter((msg) => !msg.isRead).length;
  };

  const handleActivityAction = (activity, action) => {
    console.log(`Performing ${action} on activity:`, activity.id);
    setNotificationData((prev) => ({
      ...prev,
      activityMonitor: prev.activityMonitor.map((item) =>
        item.id === activity.id
          ? {
            ...item,
            status:
              action === "approve" || action === "resolve"
                ? "completed"
                : action === "reject"
                  ? "rejected"
                  : item.status,
            isRead: true,
            actionRequired: false,
          }
          : item,
      ),
    }));

    const actionMessages = {
      approve: "Vacation request approved",
      reject: "Vacation request rejected",
      resolve: "Activity marked as resolved",
      archive: "Activity archived",
    };

    toast.success(actionMessages[action] || "Action completed");
  };

  const handleActivityClick = (activity) => {
    markMessageAsRead(activity.id, activity.type);
    console.log("Activity clicked:", activity);
  };

  const handleJumpToActivityMonitor = (activity) => {
    window.location.href = "/dashboard/activity-monitor";
  };

  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing");
      case "canceled":
        return todos.filter((todo) => todo.status === "canceled");
      case "completed":
        return todos.filter((todo) => todo.status === "completed");
      default:
        return todos;
    }
  };

  const handleSidebarEditNote = (appointmentId, currentNote) => {
    const appointment = appointments.find((app) => app.id === appointmentId);
    if (appointment) {
      setIsSidebarSpecialNoteModalOpen(false);
      setSelectedSidebarAppointmentForNote(null);

      setTimeout(() => {
        setSelectedSidebarAppointmentForNote(appointment);
        setIsSidebarSpecialNoteModalOpen(true);
      }, 10);
    }
  };

  const handleSaveSidebarSpecialNote = (appointmentId, updatedNote) => {
    if (typeof onSaveSpecialNote === "function") {
      onSaveSpecialNote(appointmentId, updatedNote);
    }
    toast.success("Special note updated successfully");
  };

  const renderSidebarSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote?.text) return null;
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate));
      if (!isActive) return null;

      const handleNoteClick = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setNotePosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
        setSidebarActiveNoteId(sidebarActiveNoteId === memberId ? null : memberId);
      };

      const handleMouseEnter = (e) => {
        e.stopPropagation();
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          setHoverTimeout(null);
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setNotePosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });

        const timeout = setTimeout(() => {
          setHoveredNoteId(memberId);
        }, 300);
        setHoverTimeout(timeout);
      };

      const handleMouseLeave = (e) => {
        e.stopPropagation();
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          setHoverTimeout(null);
        }
        setHoveredNoteId(null);
      };

      const handleEditClick = (e) => {
        e.stopPropagation();
        setSidebarActiveNoteId(null);
        setHoveredNoteId(null);
        handleSidebarEditNote(memberId, specialNote);
      };

      const shouldShowPopover = sidebarActiveNoteId === memberId || hoveredNoteId === memberId;

      return (
        <div className="relative">
          <div
            className={`${specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer transition-all duration-200 hover:scale-110`}
            onClick={handleNoteClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {shouldShowPopover &&
            createPortal(
              <div
                ref={notePopoverRef}
                className="fixed w-64 sm:w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999]"
                style={{
                  top: notePosition.top,
                  left: notePosition.left,
                }}
                onMouseEnter={() => {
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(memberId);
                  }
                }}
                onMouseLeave={() => {
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(null);
                  }
                }}
              >
                <div className="bg-gray-800 p-2 sm:p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {specialNote.isImportant ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex gap-1 items-center font-medium">
                    <div>Special Note</div>
                    <div className="text-sm text-gray-400">{specialNote.isImportant ? "(Important)" : ""}</div>
                  </h4>
                  <button
                    onClick={handleEditClick}
                    className="ml-auto text-gray-400 hover:text-white mr-2 transition-colors"
                    title="Edit Note"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSidebarActiveNoteId(null);
                      setHoveredNoteId(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Close"
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
              </div>,
              document.body,
            )}
        </div>
      );
    },
    [sidebarActiveNoteId, notePosition, hoveredNoteId, hoverTimeout],
  );

  const addCustomLink = () => {
    setEditingLink({});
    setIsWebsiteLinkModalOpen(true);
  };

  const updateCustomLink = (id, field, value) => {
    setSidebarCustomLinks((currentLinks) =>
      currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  };

  const removeCustomLink = (id) => {
    setSidebarCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
    setSidebarOpenDropdownIndex(null);
  };

  const WebsiteLinkModal = ({ link, onClose }) => {
    const [title, setTitle] = useState(link?.title?.trim() || "");
    const [url, setUrl] = useState(link?.url?.trim() || "");

    const handleSave = () => {
      if (!title.trim() || !url.trim()) return;
      if (link?.id) {
        updateCustomLink(link.id, "title", title);
        updateCustomLink(link.id, "url", url);
      } else {
        const newLink = {
          id: `link${Date.now()}`,
          url: url.trim(),
          title: title.trim(),
        };
        setSidebarCustomLinks((prev) => [...prev, newLink]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Website link</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter URL"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const handleConfirmAction = () => {
    if (pendingActivityAction) {
      handleActivityAction(pendingActivityAction.activity, pendingActivityAction.action);
      setShowActionConfirm(false);
      setPendingActivityAction(null);
    }
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-[85vw] md:h-[220vh] h-full sm:w-80 lg:w-84 bg-[#181818]
          transform transition-transform duration-500 ease-in-out
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:relative lg:translate-x-0
          flex flex-col
        `}
      >
        <div className="flex-1 p-4 md:p-5 custom-scrollbar overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate">Sidebar</h2>
                </div>
              </div>
              <div></div>
              <div className="flex items-center gap-1 sm:gap-2">
                {!isSidebarEditing && activeTab !== "notifications" && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="p-1.5 sm:p-2 flex items-center text-sm gap-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                    title="Manage Sidebar Views"
                  >
                    <Eye size={16} />
                    {currentView ? currentView.name : "Standard View"}
                  </button>
                )}
                {activeTab === "widgets" && isSidebarEditing && (
                  <button
                    onClick={() => setIsRightWidgetModalOpen(true)}
                    className="p-1.5 sm:p-2 bg-black text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
                    title="Add Widget"
                  >
                    <Plus size={20} />
                  </button>
                )}
                {activeTab === "widgets" && (
                  <button
                    onClick={toggleSidebarEditing}
                    className={`p-1.5 sm:p-2 ${isSidebarEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                      } rounded-lg flex items-center gap-1`}
                    title="Toggle Edit Mode"
                  >
                    {isSidebarEditing ? <Check size={18} /> : <Edit size={18} />}
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
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeTab === "widgets" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
            >
              <Settings size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Widgets</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${activeTab === "notifications" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
            >
              <Bell size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>

              {getUnreadCount("memberChat") + getUnreadCount("studioChat") + getUnreadCount("activityMonitor") > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                  {getUnreadCount("memberChat") + getUnreadCount("studioChat") + getUnreadCount("activityMonitor")}
                </span>
              )}
            </button>
          </div>

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl open_sans_font_700">Notifications</h2>

              {/* Member Chat Section */}
              <div className="bg-black rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleNotificationSection("memberChat")}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="inline mr-2" />
                    <h3 className="text-white font-medium text-sm">Member Chat</h3>
                    {getUnreadCount("memberChat") > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {getUnreadCount("memberChat")}
                      </span>
                    )}
                  </div>
                  {collapsedSections.memberChat ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronUp size={16} className="text-gray-400" />
                  )}
                </button>

                {!collapsedSections.memberChat && (
                  <div className="border-t border-gray-700">
                    {notificationData.memberChat.length > 0 ? (
                      notificationData.memberChat.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 border-b border-gray-800 last:border-b-0 cursor-pointer hover:bg-gray-800 transition-colors ${!message.isRead ? "bg-blue-900/20" : ""
                            }`}
                          onClick={() => {
                            handleMessageClick(message);
                            markMessageAsRead(message.id, message.type);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={message.senderAvatar || "/placeholder.svg"}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-xl flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium text-sm truncate">{message.senderName}</h4>
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-xl flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm line-clamp-2 mb-1">{message.message}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                  <Clock size={12} />
                                  {message.time}
                                </p>
                                <Reply size={14} className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No member messages</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Studio Chat Section */}
              <div className="bg-black rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleNotificationSection("studioChat")}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="inline mr-2" />
                    <h3 className="text-white font-medium text-sm">Studio Chat</h3>
                    {getUnreadCount("studioChat") > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {getUnreadCount("studioChat")}
                      </span>
                    )}
                  </div>
                  {collapsedSections.studioChat ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronUp size={16} className="text-gray-400" />
                  )}
                </button>

                {!collapsedSections.studioChat && (
                  <div className="border-t border-gray-700">
                    {notificationData.studioChat.length > 0 ? (
                      notificationData.studioChat.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 border-b border-gray-800 last:border-b-0 cursor-pointer hover:bg-gray-800 transition-colors ${!message.isRead ? "bg-green-900/20" : ""
                            }`}
                          onClick={() => {
                            handleMessageClick(message);
                            markMessageAsRead(message.id, message.type);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={message.senderAvatar || "/placeholder.svg"}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-xl flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium text-sm truncate">{message.senderName}</h4>
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-xl flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm line-clamp-2 mb-1">{message.message}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                  <Clock size={12} />
                                  {message.time}
                                </p>
                                <Reply size={14} className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No studio messages</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* activity monitor  */}
              {/* Activity Monitor Section */}
              <div className="bg-black rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleNotificationSection("activityMonitor")}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bell size={18} />
                    <h3 className="text-white font-medium text-sm">Activity Monitor</h3>

                    {getUnreadCount("activityMonitor") > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                        {getUnreadCount("activityMonitor")}
                      </span>
                    )}
                  </div>

                  {collapsedSections.activityMonitor ? (
                    <ChevronDown size={18} className="text-gray-400" />
                  ) : (
                    <ChevronUp size={18} className="text-gray-400" />
                  )}
                </button>

                {/* Content Section */}
                {!collapsedSections.activityMonitor && (
                  <div className="border-t border-gray-800">
                    {notificationData.activityMonitor.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        {notificationData.activityMonitor.map((activity) => {
                          const config = activityTypes[activity.activityType];
                          const Icon = config ? config.icon : Bell;

                          return (
                            <div
                              key={activity.id}
                              className={`p-4 sm:p-5 hover:bg-gray-900 transition-colors cursor-pointer ${!activity.isRead ? "bg-purple-900/20" : ""
                                }`}
                              onClick={() => {
                                handleActivityClick(activity);
                                markMessageAsRead(activity.id, activity.type);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`${config ? config.color : "bg-gray-700"
                                    } p-2.5 rounded-xl flex-shrink-0`}
                                >
                                  <Icon size={18} className="text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-white font-medium text-sm sm:text-base truncate">
                                      {activity.title}
                                    </h4>
                                    {!activity.isRead && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>

                                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
                                    {activity.description}
                                  </p>

                                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                                    {/* Time & Status */}
                                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                                      {activity.actionRequired && (
                                        <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-yellow-600 text-white">
                                          ACTION REQUIRED
                                        </span>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      {activity.actionRequired && activity.status === "pending" && (
                                        <>
                                          {activity.activityType === "vacation" && (
                                            <>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingActivityAction({ activity, action: "approve" });
                                                  setShowActionConfirm(true);
                                                }}
                                                className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                title="Approve"
                                              >
                                                <Check size={12} className="text-white" />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingActivityAction({ activity, action: "reject" });
                                                  setShowActionConfirm(true);
                                                }}
                                                className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                title="Reject"
                                              >
                                                <X size={12} className="text-white" />
                                              </button>
                                            </>
                                          )}

                                          {(activity.activityType === "email" ||
                                            activity.activityType === "contract" ||
                                            activity.activityType === "appointment") && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingActivityAction({ activity, action: "resolve" });
                                                  setShowActionConfirm(true);
                                                }}
                                                className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                title="Mark as Resolved"
                                              >
                                                <Check size={12} className="text-white" />
                                              </button>
                                            )}
                                        </>
                                      )}

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleJumpToActivityMonitor(activity);
                                        }}
                                        className="p-1.5 sm:p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                                        title="Open in Activity Monitor"
                                      >
                                        <ExternalLink size={12} className="text-gray-400" />
                                      </button>
                                      <div className="text-xs flex items-center gap-2">
                                        {/* Replaced Clock with Activity (Monitor) icon */}
                                        <Activity size={12} className="text-gray-400" />
                                        <span>{activity.time}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activity notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                    {/* Collapsed State */}
                    {collapsedWidgets[widget.id] ? (
                      <div
                        className="p-4 rounded-xl bg-[#2F2F2F] flex items-center justify-between cursor-pointer hover:bg-[#3A3A3A] transition-colors"
                        onClick={() => toggleWidgetCollapse(widget.id)}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight size={16} />
                          <span className="font-medium">{getWidgetDisplayName(widget.type)}</span>
                        </div>
                        {/* <span className="text-xs text-gray-400">Click to expand</span> */}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Widget Header with Controls */}
                        {!isSidebarEditing && widget.type !== "staffCheckIn" && (
                          <div className="flex items-center justify-between px-1">
                            <button
                              onClick={() => toggleWidgetCollapse(widget.id)}
                              className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                              title="Collapse widget"
                            >
                              <ChevronDown size={16} />
                            </button>
                            <button
                              onClick={() => toggleWidgetSize(widget.id)}
                              className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                              title={expandedWidgetSizes[widget.id] ? "Reduce size" : "Expand size"}
                            >
                              {expandedWidgetSizes[widget.id] ? (
                                <Minimize2 size={16} />
                              ) : (
                                <Maximize2 size={16} />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Widget Content */}
                        {widget.type === "todo" && (
                          <div className={`space-y-3 p-4 rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-semibold open_sans_font cursor-pointer">To-Do</h2>
                              {!isSidebarEditing && (
                                <button
                                  onClick={() => setIsAddTaskModalOpen(true)}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                  <Plus size={18} />
                                </button>
                              )}
                            </div>

                            <div className="relative mb-3 w-full" ref={todoFilterDropdownRef}>
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
                                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                      onClick={() => {
                                        setTodoFilter(option.value);
                                        setIsTodoFilterDropdownOpen(false);
                                      }}
                                    >
                                      {option.color && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />
                                      )}
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Todo Items with Scroll */}
                            <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 ${expandedWidgetSizes[widget.id] ? 'max-h-[400px]' : ''}`}>
                              <div className="space-y-2">
                                {getFilteredTodos().length > 0 ? (
                                  <>
                                    {getFilteredTodos()
                                      .slice(0, expandedWidgetSizes[widget.id] ? 10 : 3)
                                      .map((todo) => (
                                        <div
                                          key={todo.id}
                                          className="p-3 bg-black rounded-xl flex items-center justify-between"
                                        >
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
                                                e.stopPropagation();
                                                toggleDropdown(`todo-${todo.id}`);
                                              }}
                                              className="p-1 hover:bg-zinc-700 rounded"
                                            >
                                              <MoreVertical size={16} />
                                            </button>
                                            {openDropdownIndex === `todo-${todo.id}` && (
                                              <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                                <button
                                                  onClick={() => {
                                                    handleEditTask(todo);
                                                  }}
                                                  className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                                >
                                                  Edit Task
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setTaskToCancel(todo.id);
                                                  }}
                                                  className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                                >
                                                  Cancel Task
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setTaskToDelete(todo.id);
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
                                  </>
                                ) : (
                                  <div className="text-center py-4 text-gray-400">
                                    <p className="text-sm">No tasks in this category</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {!expandedWidgetSizes[widget.id] && getFilteredTodos().length > 3 && (
                              <div className="flex justify-center">
                                <Link
                                  to={"/dashboard/to-do"}
                                  className="text-sm open_sans_font text-white hover:underline"
                                >
                                  See all ({getFilteredTodos().length})
                                </Link>
                              </div>
                            )}
                          </div>
                        )}

                        {widget.type === "birthday" && (
                          <div className={`space-y-3 p-4 rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-semibold">Upcoming Birthday</h2>
                            </div>

                            {/* Scrollable area */}
                            <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 ${expandedWidgetSizes[widget.id] ? 'max-h-[450px]' : ''}`}>
                              <div className="space-y-2">
                                {birthdays
                                  .slice(0, expandedWidgetSizes[widget.id] ? 10 : 5)
                                  .map((birthday) => (
                                    <div
                                      key={birthday.id}
                                      className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 justify-between ${isBirthdayToday(birthday.date)
                                        ? "bg-yellow-900/30 border border-yellow-600"
                                        : "bg-black"
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl overflow-hidden">
                                          <img
                                            src={birthday.avatar || "/placeholder.svg"}
                                            className="h-full w-full object-cover"
                                            alt=""
                                          />
                                        </div>

                                        <div>
                                      <h3 className="font-semibold text-sm flex items-center gap-1">
                                        {birthday.name}
                                        {/* Check if dateOfBirth exists and calculate age */}
                                        {birthday.dateOfBirth && (
                                          <span className="text-zinc-400 font-normal">
                                            ({calculateAge(birthday.dateOfBirth)})
                                          </span>
                                        )}
                                        {isBirthdayToday(birthday.date) && (
                                          <span className="text-yellow-500">🎂</span>
                                        )}
                                      </h3>
                                      <p className="text-xs text-zinc-400">
                                        {birthday.date} {/* This displays the birthdate */}
                                        {/* If you want to show next birthday date instead, you might need different logic */}
                                      </p>
                                    </div>
                                      </div>

                                      {isBirthdayToday(birthday.date) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSendBirthdayMessage(birthday);
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

                            {!expandedWidgetSizes[widget.id] && birthdays.length > 5 && (
                              <div className="flex justify-center">
                                <Link to="/dashboard/birthdays" className="text-sm text-white hover:underline">
                                  See all ({birthdays.length})
                                </Link>
                              </div>
                            )}
                          </div>
                        )}

                        {widget.type === "websiteLinks" && (
                          <div className={`space-y-3 p-4 rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-semibold">Website Links</h2>
                              {!isSidebarEditing && (
                                <button
                                  onClick={addCustomLink}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Plus size={18} />
                                </button>
                              )}
                            </div>

                            {/* Scrollable List */}
                            <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 ${expandedWidgetSizes[widget.id] ? 'max-h-[450px]' : ''}`}>
                              <div className="grid grid-cols-1 gap-3">
                                {sidebarCustomLinks
                                  .slice(0, expandedWidgetSizes[widget.id] ? 15 : 5)
                                  .map((link) => (
                                    <div
                                      key={link.id}
                                      className="p-5 bg-black rounded-xl flex items-center justify-between"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium truncate">{link.title}</h3>
                                        <p className="text-xs mt-1 text-zinc-400 truncate max-w-[200px]">
                                          {truncateUrl(link.url)}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => window.open(link.url, "_blank")}
                                          className="p-2 hover:bg-zinc-700 rounded-lg"
                                        >
                                          <ExternalLink size={16} />
                                        </button>

                                        <div className="relative">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSidebarOpenDropdownIndex(
                                                sidebarOpenDropdownIndex === `link-${link.id}` ? null : `link-${link.id}`
                                              );
                                            }}
                                            className="p-2 hover:bg-zinc-700 rounded-lg"
                                          >
                                            <MoreVertical size={16} />
                                          </button>

                                          {sidebarOpenDropdownIndex === `link-${link.id}` && (
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingLink(link);
                                                  setIsWebsiteLinkModalOpen(true);
                                                  setSidebarOpenDropdownIndex(null);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  removeCustomLink(link.id);
                                                  setSidebarOpenDropdownIndex(null);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {!expandedWidgetSizes[widget.id] && sidebarCustomLinks.length > 5 && (
                              <div className="flex justify-center">
                                <Link to="/dashboard/links" className="text-sm text-white hover:underline">
                                  See all ({sidebarCustomLinks.length})
                                </Link>
                              </div>
                            )}
                          </div>
                        )}

                        {widget.type === "appointments" && (
                          <div className={`space-y-3 p-4 rounded-xl ${getWidgetHeightClass(widget.id, "md:h-[340px]")} bg-[#2F2F2F]`}>
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                            </div>
                            <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 ${expandedWidgetSizes[widget.id] ? 'max-h-[450px]' : 'max-h-[25vh]'}`}>
                              {appointments.length > 0 ? (
                                appointments
                                  .slice(0, expandedWidgetSizes[widget.id] ? 8 : 3)
                                  .map((appointment, index) => (
                                    <div
                                      key={appointment.id}
                                      className={`${appointment.color} rounded-xl cursor-pointer p-3 relative`}
                                    >
                                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                        {renderSidebarSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                        <div
                                          className="cursor-pointer rounded mt-3 ml-1 transition-colors"
                                          onClick={(e) => handleDumbbellClick(appointment, e)}
                                        >
                                          <Dumbbell size={16} />
                                        </div>
                                      </div>

                                      <div
                                        className="flex flex-col items-center justify-between gap-2 cursor-pointer pl-8"
                                        onClick={() => {
                                          handleAppointmentOptionsModal(appointment);
                                        }}
                                      >
                                        <div className="flex items-center gap-2 relative w-full justify-center">
                                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center relative">
                                            <img
                                              src={"/gray-avatar-fotor-20250912192528.png"}
                                              alt=""
                                              className="w-full h-full rounded-xl"
                                            />
                                          </div>
                                          <div className="text-white text-left flex-1">
                                            <p className="font-semibold text-sm">
                                              {appointment.name} {appointment.lastName || ""}
                                            </p>
                                            <p className="text-xs flex gap-1 items-center opacity-80">
                                              <Clock size={14} />
                                              {appointment.time} | {appointment.date.split("|")[0]}
                                            </p>
                                            <p className="text-xs opacity-80 mt-1">
                                              {appointment.isTrial ? "Trial Session" : appointment.type}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-center">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCheckIn(appointment.id);
                                            }}
                                            className={`px-3 py-1 text-xs font-medium rounded-lg ${appointment.isCheckedIn
                                              ? "border border-white/50 text-white bg-transparent"
                                              : "bg-black text-white"
                                              }`}
                                          >
                                            {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-white text-center">No appointments scheduled for this date.</p>
                              )}
                            </div>
                            {!expandedWidgetSizes[widget.id] && appointments.length > 3 && (
                              <div className="flex justify-center">
                                <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                                  See all ({appointments.length})
                                </Link>
                              </div>
                            )}
                          </div>
                        )}

                        {isSidebarSpecialNoteModalOpen && selectedSidebarAppointmentForNote && (
                          <SpecialNoteEditModal
                            isOpen={isSidebarSpecialNoteModalOpen}
                            onClose={() => {
                              setIsSidebarSpecialNoteModalOpen(false);
                              setSelectedSidebarAppointmentForNote(null);
                            }}
                            appointment={selectedSidebarAppointmentForNote}
                            onSave={handleSaveSidebarSpecialNote}
                          />
                        )}



                        {widget.type === "expiringContracts" && (
                          <div className={`space-y-3 p-4 rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-semibold">Expiring Contracts</h2>
                            </div>
                            <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 ${expandedWidgetSizes[widget.id] ? 'max-h-[450px]' : ''}`}>
                              <div className="grid grid-cols-1 gap-3">
                                {expiringContracts
                                  .slice(0, expandedWidgetSizes[widget.id] ? 10 : 5)
                                  .map((contract) => (
                                    <Link to={"/dashboard/contract"} key={contract.id}>
                                      <div className="p-4 bg-black rounded-xl hover:bg-zinc-900 transition-colors">
                                        <div className="flex justify-between items-start gap-3">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium break-words line-clamp-2">
                                              {contract.title}
                                            </h3>
                                            <p className="text-xs mt-1 text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis">
                                              Expires: {contract.expiryDate}
                                            </p>
                                          </div>
                                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap flex-shrink-0">
                                            {contract.status}
                                          </span>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                            {!expandedWidgetSizes[widget.id] && expiringContracts.length > 5 && (
                              <div className="flex justify-center">
                                <Link to="/dashboard/contracts" className="text-sm text-white hover:underline">
                                  See all ({expiringContracts.length})
                                </Link>
                              </div>
                            )}
                          </div>
                        )}

                        {widget.type === "bulletinBoard" && (
                          <div className={`${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <BulletinBoardWidget isSidebarEditing={isSidebarEditing} expanded={expandedWidgetSizes[widget.id]} />
                          </div>
                        )}

                        {widget.type === "notes" && (
                          <div className={`space-y-3  rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <NotesWidget isSidebarEditing={isSidebarEditing} expanded={expandedWidgetSizes[widget.id]} />
                          </div>
                        )}

                        {widget.type === "staffCheckIn" && (
                          <div className={`space-y-3 p-4 rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Staff login</h2>
                              {/* Remove the expand button for this widget */}
                              {!isSidebarEditing && widget.type !== "staffCheckIn" && (
                                <button
                                  onClick={() => toggleWidgetSize(widget.id)}
                                  className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                                  title={expandedWidgetSizes[widget.id] ? "Reduce size" : "Expand size"}
                                >
                                  {expandedWidgetSizes[widget.id] ? (
                                    <Minimize2 size={16} />
                                  ) : (
                                    <Maximize2 size={16} />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex-1 bg-black rounded-xl p-4">
                              <StaffCheckInWidget  />
                            </div>
                          </div>
                        )}

                        {widget.type === "shiftSchedule" && (
                          <div className={`space-y-3  rounded-xl bg-[#2F2F2F] ${getWidgetHeightClass(widget.id)} h-auto flex flex-col`}>
                            <ShiftScheduleWidget
                              isEditing={isSidebarEditing}
                              onRemove={() => removeRightSidebarWidget(widget.id)}
                              className="h-full"
                              expanded={expandedWidgetSizes[widget.id]}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </RightSidebarWidget>
                ))}
            </>
          )}
        </div>
      </aside>

      <ViewManagementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarWidgets={rightSidebarWidgets}
        setSidebarWidgets={() => { }}
      />

      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
          configuredTags={configuredTags}
        />
      )}

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        onSendReply={handleSendReply}
        onOpenFullMessenger={handleOpenFullMessenger}
      />

      {isWebsiteLinkModalOpen && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => {
            setIsWebsiteLinkModalOpen(false);
            setEditingLink(null);
          }}
        />
      )}

      {/* Action Confirmation Modal */}
      {showActionConfirm && pendingActivityAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Confirm Action</h2>
                <button
                  onClick={() => {
                    setShowActionConfirm(false);
                    setPendingActivityAction(null);
                  }}
                  className="p-2 hover:bg-zinc-700 rounded-lg text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Are you sure you want to <span className="font-semibold text-white">{pendingActivityAction.action}</span> this activity?
                </p>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setShowActionConfirm(false);
                      setPendingActivityAction(null);
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 px-4 py-2 ${pendingActivityAction.action === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                      } rounded-lg font-medium text-white`}
                  >
                    Confirm {pendingActivityAction.action}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;