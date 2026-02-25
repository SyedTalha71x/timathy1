// Central Sidebar - Widget Panel
// Displays the same widgets as MyArea (except Analytics) in a sidebar format

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import {
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Check,
  Plus,
  Eye,
  Bell,
  Settings,
  Clock,
  User,
  Building2,
  Activity,
  Reply,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  CalendarCheck,
  FileText,
  MailWarning,
  PauseCircle,
  CreditCard,
  UserCog,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { CiMonitor } from "react-icons/ci"

// ============================================
// Initials Avatar Component for Notifications
// ============================================
const InitialsAvatar = ({ firstName, lastName, size = 32, className = "", context = "member" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  // Staff uses blue, members use orange
  const bgColor = context === "staff" ? "bg-secondary" : "bg-primary"

  return (
    <div
      className={`${bgColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  )
}

// ============================================
// Widget Component Imports
// ============================================
import ExpiringContractsWidget from "../../../components/shared/widgets/ExpiringContractsWidget"
import UpcomingAppointmentsWidget from "../../../components/shared/widgets/UpcomingAppointmentsWidget"
import StaffCheckInWidget from "../../../components/shared/widgets/StaffWidgetCheckIn"
import WebsiteLinksWidget from "../../../components/shared/widgets/WebsiteLinksWidget"
import ToDoWidget from "../../../components/shared/widgets/ToDoWidget"
import UpcomingBirthdaysWidget from "../../../components/shared/widgets/UpcomingBirthdaysWidget"
import BulletinBoardWidget from "../../../components/shared/widgets/BulletinBoardWidget"
import NotesWidget from "../../../components/shared/widgets/NotesWidget"
import ShiftScheduleWidget from "../../../components/shared/widgets/ShiftScheduleWidget"
import UpcomingClassesWidget from "../../../components/shared/widgets/UpcomingClassesWidget"

// ============================================
// Sidebar Component Imports
// ============================================
import DraggableWidget from "../../../components/shared/widgets/components/DraggableWidget"
import ViewManagementModal from "../../../components/shared/widgets/components/ViewManagementModal"
import { WidgetSelectionModal } from "../../../components/shared/widgets/components/widget-selection-modal"
import ChatPopup from "../../../components/shared/communication/ChatPopup"

// ============================================
// Modal Component Imports
// ============================================
import AppointmentActionModal from "../../../components/studio-components/appointments-components/AppointmentActionModal"
import EditMemberModalMain from "../../../components/studio-components/members-components/EditMemberModal"
import EditLeadModal from "../../../components/studio-components/lead-studio-components/edit-lead-modal"
import TrainingPlansModalMain from "../../../components/shared/training/TrainingPlanModal"
import EditAppointmentModal from "../../../components/shared/appointments/EditAppointmentModal"

// ============================================
// Data Imports
// ============================================
import {
  memberRelationsData,
  availableMembersLeadsNew,
  customLinksData,
} from "../../../utils/studio-states/myarea-states"

import {
  generateSidebarActivityItems,
  getTotalPendingCount,
  activityMonitorTabs,
} from "../../../utils/studio-states/activity-monitor-states"

import {
  appointmentsData,
  membersData,
  leadsData,
  leadRelationsData,
  freeAppointmentsData,
  appointmentTypesData,
  staffData,
  memberChatListNew,
  staffChatListNew,
} from "../../../utils/studio-states"

// ============================================
// Constants
// ============================================
const WIDGET_DISPLAY_NAMES = {
  todo: "To-Do",
  birthday: "Birthdays",
  websiteLinks: "Website Links",
  appointments: "Upcoming Appointments",
  expiringContracts: "Expiring Contracts",
  bulletinBoard: "Bulletin Board",
  notes: "Notes",
  staffCheckIn: "Staff Check-In",
  shiftSchedule: "Shift Schedule",
  upcomingClasses: "Upcoming Classes",
}

const RELATION_OPTIONS = {
  family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
  friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
  relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
  work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
  other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
}

const LEAD_COLUMNS = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "qualified", title: "Qualified" },
  { id: "negotiation", title: "Negotiation" },
  { id: "won", title: "Won" },
  { id: "lost", title: "Lost" },
]

const TRAINING_PLANS_DATA = {
  1: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-15" }],
  3: [{ id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced", assignedDate: "2025-01-10" }],
  4: [
    { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate", assignedDate: "2025-01-05" },
    { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate", assignedDate: "2025-01-20" },
  ],
  6: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-18" }],
}

const AVAILABLE_TRAINING_PLANS = [
  { id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner" },
  { id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced" },
  { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate" },
  { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate" },
]

// Activity types and tabs are imported from activity-monitor-states.jsx

// ============================================
// Main Sidebar Component
// ============================================
const Sidebar = ({
  isRightSidebarOpen,
  isSidebarEditing,
  toggleSidebarEditing,
  rightSidebarWidgets: propWidgets,
  setRightSidebarWidgets: propSetWidgets,
  moveRightSidebarWidget: propMoveWidget,
  removeRightSidebarWidget: propRemoveWidget,
  setIsRightWidgetModalOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Close sidebar when navigating to pages with their own full layout
  useEffect(() => {
    const closePaths = ["/dashboard/leads", "/dashboard/selling", "/dashboard/my-area"]
    if (isRightSidebarOpen && onClose && closePaths.some(p => pathname.startsWith(p))) {
      onClose()
    }
  }, [pathname])
  
  // Local widgets state - initialized from localStorage or props
  const [localWidgets, setLocalWidgets] = useState(() => {
    const saved = localStorage.getItem("sidebarWidgetsState")
    if (saved) {
      return JSON.parse(saved)
    }
    return propWidgets || []
  })
  
  // Use local state if no setter is provided, otherwise use props
  const rightSidebarWidgets = propSetWidgets ? propWidgets : localWidgets
  const setRightSidebarWidgets = propSetWidgets || setLocalWidgets
  
  // Local move widget function
  const moveWidget = (fromIndex, toIndex) => {
    if (propMoveWidget && propSetWidgets) {
      // Use prop function if available
      propMoveWidget(fromIndex, toIndex)
    } else {
      // Use local state
      if (toIndex < 0 || toIndex >= localWidgets.length) return
      const newWidgets = [...localWidgets]
      const [movedWidget] = newWidgets.splice(fromIndex, 1)
      newWidgets.splice(toIndex, 0, movedWidget)
      const updatedWidgets = newWidgets.map((widget, index) => ({
        ...widget,
        position: index,
      }))
      setLocalWidgets(updatedWidgets)
    }
  }
  
  // Local remove widget function
  const removeWidget = (id) => {
    if (propRemoveWidget && propSetWidgets) {
      // Use prop function if available
      propRemoveWidget(id)
    } else {
      // Use local state
      setLocalWidgets((currentWidgets) => {
        const filtered = currentWidgets.filter((w) => w.id !== id)
        return filtered.map((widget, index) => ({
          ...widget,
          position: index,
        }))
      })
    }
  }
  
  // Persist local widgets to localStorage
  useEffect(() => {
    if (!propSetWidgets) {
      localStorage.setItem("sidebarWidgetsState", JSON.stringify(localWidgets))
    }
  }, [localWidgets, propSetWidgets])

  // ============================================
  // UI State
  // ============================================
  const [activeTab, setActiveTab] = useState("widgets")
  const [collapsedWidgets, setCollapsedWidgets] = useState({})
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)

  // ============================================
  // Widget Add Logic (local to sidebar)
  // ============================================
  const getWidgetStatusForSidebar = (widgetType) => {
    const existsInSidebar = rightSidebarWidgets.some((widget) => widget.type === widgetType)
    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }
    return { canAdd: true, location: null }
  }

  const handleAddSidebarWidget = (widgetType) => {
    const { canAdd } = getWidgetStatusForSidebar(widgetType)
    if (!canAdd) {
      toast.error("This widget is already added to your sidebar.")
      return
    }
    const newWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      position: rightSidebarWidgets.length,
    }
    setRightSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`Widget has been added successfully`)
  }
  // ============================================
  // View Management State
  // ============================================
  // Default view that cannot be deleted
  const DEFAULT_SIDEBAR_VIEW = {
    id: "default_sidebar_view",
    name: "Default",
    widgets: propWidgets || [],
    widgetSettings: {},
    isStandard: true,
    isDefault: true,
    createdBy: { id: "system", name: "System" },
    createdAt: new Date().toISOString(),
  }

  const [savedViews, setSavedViews] = useState(() => {
    const saved = localStorage.getItem("sidebarViews")
    if (saved) {
      const parsed = JSON.parse(saved)
      // Ensure default view always exists
      const hasDefault = parsed.some((v) => v.isDefault)
      if (!hasDefault) return [DEFAULT_SIDEBAR_VIEW, ...parsed]
      return parsed
    }
    return [DEFAULT_SIDEBAR_VIEW]
  })
  const [currentView, setCurrentView] = useState(() => {
    // Load current view from localStorage
    const saved = localStorage.getItem("sidebarCurrentView")
    return saved ? JSON.parse(saved) : null
  })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // ============================================
  // Widget Settings State (visibleItems per widget - controls visible height)
  // ============================================
  const [widgetSettings, setWidgetSettings] = useState(() => {
    // Load widget settings from localStorage
    const saved = localStorage.getItem("sidebarWidgetSettings")
    return saved ? JSON.parse(saved) : {}
  })
  const [openSettingsDropdown, setOpenSettingsDropdown] = useState(null)
  const [tempInputValue, setTempInputValue] = useState("")
  
  // Persist views to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarViews", JSON.stringify(savedViews))
  }, [savedViews])
  
  useEffect(() => {
    if (currentView) {
      localStorage.setItem("sidebarCurrentView", JSON.stringify(currentView))
    }
  }, [currentView])
  
  useEffect(() => {
    localStorage.setItem("sidebarWidgetSettings", JSON.stringify(widgetSettings))
  }, [widgetSettings])
  
  // Load pinned view on mount
  useEffect(() => {
    const pinnedView = savedViews.find(view => view.isStandard)
    if (pinnedView && setRightSidebarWidgets) {
      // Load the pinned view's widgets
      setRightSidebarWidgets([...pinnedView.widgets])
      // Load widget settings if available
      if (pinnedView.widgetSettings) {
        setWidgetSettings({ ...pinnedView.widgetSettings })
      }
      setCurrentView(pinnedView)
    }
  }, []) // Only run on mount
  
  // Maximum visible items
  const MAX_VISIBLE_ITEMS = 10
  
  // Default visible items per widget type
  const getDefaultVisibleItems = (widgetType) => {
    const defaults = {
      todo: 2,
      notes: 2,
      bulletinBoard: 2,
      appointments: 3,
      expiringContracts: 3,
      websiteLinks: 3,
      birthday: 3,
      shiftSchedule: 3,
      upcomingClasses: 5,
    }
    return defaults[widgetType] || 3
  }
  
  // Get visibleItems for a widget - this limits how many items are shown
  const getWidgetVisibleItems = (widgetId, widgetType) => {
    return widgetSettings[widgetId]?.visibleItems || getDefaultVisibleItems(widgetType)
  }
  
  // Update visibleItems for a widget
  const updateWidgetVisibleItems = (widgetId, visibleItems) => {
    const clampedValue = Math.max(1, Math.min(MAX_VISIBLE_ITEMS, visibleItems))
    setWidgetSettings(prev => ({
      ...prev,
      [widgetId]: { ...prev[widgetId], visibleItems: clampedValue }
    }))
    setOpenSettingsDropdown(null)
    setTempInputValue("")
  }
  
  // Widgets that support visibleItems setting (exclude staffCheckIn and chart)
  const WIDGETS_WITH_SETTINGS = [
    "appointments", "expiringContracts", "todo", "birthday", 
    "websiteLinks", "bulletinBoard", "notes", "shiftSchedule", "upcomingClasses"
  ]

  // ============================================
  // Widget Data State
  // ============================================
  const [customLinks, setCustomLinks] = useState(customLinksData)
  const [appointments, setAppointments] = useState(appointmentsData)
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)

  // ============================================
  // Appointment Modal State
  // ============================================
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointmentForAction, setSelectedAppointmentForAction] = useState(null)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)

  // ============================================
  // Edit Member Modal State
  // ============================================
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
  const [editMemberActiveTab, setEditMemberActiveTab] = useState("note")
  const [editingRelationsMain, setEditingRelationsMain] = useState(false)
  const [newRelationMain, setNewRelationMain] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [editFormMain, setEditFormMain] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    notes: [],
  })

  // ============================================
  // Edit Lead Modal State
  // ============================================
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null)
  const [editLeadActiveTab, setEditLeadActiveTab] = useState("note")

  // ============================================
  // Training Plan Modal State
  // ============================================
  const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)
  const [memberTrainingPlans, setMemberTrainingPlans] = useState(TRAINING_PLANS_DATA)
  const [availableTrainingPlans] = useState(AVAILABLE_TRAINING_PLANS)

  // ============================================
  // Notification State - generated from chat lists
  // ============================================
  const [notificationData, setNotificationData] = useState(() => {
    // Generate initial notifications from chat lists
    const memberNotifications = (memberChatListNew || []).map(chat => {
      const lastMessage = chat.messages?.[chat.messages.length - 1]
      const member = membersData.find(m => m.id === chat.memberId)
      const isUnread = lastMessage && lastMessage.sender !== "You" && lastMessage.status !== "read"
      
      return {
        id: `mc_${chat.id}`,
        chatId: chat.id,
        memberId: chat.memberId,
        senderId: chat.memberId,
        senderName: member ? `${member.firstName} ${member.lastName}` : chat.name,
        senderAvatar: member?.image || chat.logo || null,
        message: lastMessage?.content || "No messages",
        time: lastMessage?.time || "",
        isRead: !isUnread,
        type: "member_chat",
        dateOfBirth: member?.dateOfBirth
      }
    }).filter(n => n.memberId)
    
    const staffNotifications = (staffChatListNew || []).map(chat => {
      const lastMessage = chat.messages?.[chat.messages.length - 1]
      const staff = staffData.find(s => s.id === chat.staffId)
      const isUnread = lastMessage && lastMessage.sender !== "You" && lastMessage.status !== "read"
      
      return {
        id: `sc_${chat.id}`,
        chatId: chat.id,
        staffId: chat.staffId,
        senderId: chat.staffId,
        senderName: staff ? `${staff.firstName} ${staff.lastName}` : chat.name,
        senderAvatar: staff?.img || staff?.image || chat.logo || null,
        message: lastMessage?.content || "No messages",
        time: lastMessage?.time || "",
        isRead: !isUnread,
        type: "studio_chat"
      }
    }).filter(n => n.staffId)
    
    return {
      memberChat: memberNotifications,
      studioChat: staffNotifications,
    }
  })
  
  // Activity Monitor State - separate from chat notifications
  const [activityCategories, setActivityCategories] = useState(() => generateSidebarActivityItems())
  
  // ChatPopup state for notifications
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false)
  const [selectedChatMember, setSelectedChatMember] = useState(null)
  const [chatContext, setChatContext] = useState("member") // "member" or "staff"
  
  const [collapsedSections, setCollapsedSections] = useState({
    memberChat: false,
    studioChat: false,
    activityMonitor: false,
  })
  const [showActionConfirm, setShowActionConfirm] = useState(false)
  const [pendingActivityAction, setPendingActivityAction] = useState(null)

  // ============================================
  // Helper Functions
  // ============================================
  const getWidgetDisplayName = (widgetType) => WIDGET_DISPLAY_NAMES[widgetType] || widgetType

  // Generate notifications from chat lists
  const generateNotificationsFromChats = () => {
    const memberNotifications = (memberChatListNew || []).map(chat => {
      const lastMessage = chat.messages?.[chat.messages.length - 1]
      const member = membersData.find(m => m.id === chat.memberId)
      const isUnread = lastMessage && lastMessage.sender !== "You" && lastMessage.status !== "read"
      
      return {
        id: `mc_${chat.id}`,
        chatId: chat.id,
        memberId: chat.memberId,
        senderId: chat.memberId,
        senderName: member ? `${member.firstName} ${member.lastName}` : chat.name,
        senderAvatar: member?.image || chat.logo || null,
        message: lastMessage?.content || "No messages",
        time: lastMessage?.time || "",
        isRead: !isUnread,
        type: "member_chat",
        dateOfBirth: member?.dateOfBirth
      }
    }).filter(n => n.memberId) // Only include chats with valid memberId
    
    const staffNotifications = (staffChatListNew || []).map(chat => {
      const lastMessage = chat.messages?.[chat.messages.length - 1]
      const staff = staffData.find(s => s.id === chat.staffId)
      const isUnread = lastMessage && lastMessage.sender !== "You" && lastMessage.status !== "read"
      
      return {
        id: `sc_${chat.id}`,
        chatId: chat.id,
        staffId: chat.staffId,
        senderId: chat.staffId,
        senderName: staff ? `${staff.firstName} ${staff.lastName}` : chat.name,
        senderAvatar: staff?.img || staff?.image || chat.logo || null,
        message: lastMessage?.content || "No messages",
        time: lastMessage?.time || "",
        isRead: !isUnread,
        type: "studio_chat"
      }
    }).filter(n => n.staffId) // Only include chats with valid staffId
    
    return {
      memberChat: memberNotifications,
      studioChat: staffNotifications,
      activityMonitor: demoNotifications?.activityMonitor || []
    }
  }

  const getMemberById = (memberId) => {
    if (!memberId) return null
    return membersData.find((m) => m.id === memberId) || null
  }

  const getStaffById = (staffId) => {
    if (!staffId) return null
    return staffData.find((s) => s.id === staffId) || null
  }

  const getUnreadCount = (section) => {
    if (section === "activityMonitor") {
      // Activity Monitor count comes from categories
      return Object.values(activityCategories).reduce((sum, cat) => sum + cat.count, 0)
    }
    return notificationData[section]?.filter((msg) => !msg.isRead).length || 0
  }

  const getTotalUnreadCount = () => {
    const chatCount = getUnreadCount("memberChat") + getUnreadCount("studioChat")
    const activityCount = Object.values(activityCategories).reduce((sum, cat) => sum + cat.count, 0)
    return chatCount + activityCount
  }

  // ============================================
  // Widget Control Handlers
  // ============================================
  const toggleWidgetCollapse = (widgetId) => {
    setCollapsedWidgets((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }))
  }

  // ============================================
  // Appointment Handlers
  // ============================================
  const handleCheckIn = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, isCheckedIn: !appointment.isCheckedIn }
          : appointment
      )
    )
    const appointment = appointments.find((app) => app.id === appointmentId)
    toast.success(appointment?.isCheckedIn ? "Member checked out successfully" : "Member checked in successfully")
  }

  const handleAppointmentOptionsModal = (appointment) => {
    if (appointment.isBlocked || appointment.type === "Blocked Time") return
    setSelectedAppointmentForAction(appointment)
    setIsAppointmentActionModalOpen(true)
  }

  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    setIsEditAppointmentModalOpen(true)
  }

  const handleCancelAppointment = () => {
    if (selectedAppointmentForAction) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === selectedAppointmentForAction.id ? { ...app, isCancelled: true } : app
        )
      )
    }
    setIsAppointmentActionModalOpen(false)
    setSelectedAppointmentForAction(null)
  }

  const handleDeleteAppointment = () => {
    setAppointments((prev) => prev.filter((a) => a.id !== selectedAppointmentForAction?.id))
    setIsAppointmentActionModalOpen(false)
    setSelectedAppointmentForAction(null)
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false)
    if (!selectedAppointmentForAction) return

    const { memberId, leadId, name, lastName } = selectedAppointmentForAction

    if (memberId) {
      const memberName = lastName ? `${name} ${lastName}` : name
      navigate("/dashboard/members", {
        state: { filterMemberId: memberId, filterMemberName: memberName },
      })
    } else if (leadId) {
      navigate("/dashboard/leads", {
        state: { filterLeadId: leadId },
      })
    }
  }

  // ============================================
  // Edit Member Modal Handlers
  // ============================================
  const handleOpenEditMemberModal = (member, tab = "note") => {
    if (!member) return

    setSelectedMemberForEdit({
      ...member,
      note: member.note || "",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteImportance: member.noteImportance || "unimportant",
    })

    setEditFormMain({
      firstName: member.firstName || member.name?.split(" ")[0] || "",
      lastName: member.lastName || member.name?.split(" ").slice(1).join(" ") || "",
      email: member.email || "",
      phone: member.phone || "",
      street: member.street || "",
      zipCode: member.zipCode || "",
      city: member.city || "",
      dateOfBirth: member.dateOfBirth || "",
      about: member.about || "",
      note: member.note || "",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteImportance: member.noteImportance || "unimportant",
      notes: member.notes || [],
    })

    setEditMemberActiveTab(tab)
    setIsEditMemberModalOpen(true)
  }

  const handleInputChangeMain = (e) => {
    const { name, value } = e.target
    setEditFormMain((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmitMain = (e, localRelations = null) => {
    e?.preventDefault()

    if (localRelations && selectedMemberForEdit?.id) {
      setMemberRelations((prev) => ({
        ...prev,
        [selectedMemberForEdit.id]: localRelations,
      }))
    }

    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    setEditingRelationsMain(false)
    toast.success("Member details have been updated successfully")
  }

  const handleAddRelationMain = () => {
    if (!selectedMemberForEdit || !newRelationMain.name || !newRelationMain.relation) return

    const { id: memberId } = selectedMemberForEdit
    const { category } = newRelationMain

    const newRelation = {
      id: Date.now(),
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
      memberId: newRelationMain.selectedMemberId,
    }

    setMemberRelations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: [...(prev[memberId]?.[category] || []), newRelation],
      },
    }))

    setNewRelationMain({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
    })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelationMain = (memberId, category, relationId) => {
    setMemberRelations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: prev[memberId]?.[category]?.filter((r) => r.id !== relationId) || [],
      },
    }))
    toast.success("Relation deleted successfully")
  }

  const handleCloseEditMemberModal = () => {
    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    setEditingRelationsMain(false)
  }

  // ============================================
  // Edit Lead Modal Handlers
  // ============================================
  const handleOpenEditLeadModal = (leadId, tab = "note") => {
    const lead = leadsData.find((l) => l.id === leadId)
    if (!lead) return

    setSelectedLeadForEdit({
      ...lead,
      note: lead.note || "",
      noteStartDate: lead.noteStartDate || "",
      noteEndDate: lead.noteEndDate || "",
      noteImportance: lead.noteImportance || "unimportant",
    })
    setEditLeadActiveTab(tab)
    setIsEditLeadModalOpen(true)
  }

  const handleSaveEditLead = () => {
    setIsEditLeadModalOpen(false)
    setSelectedLeadForEdit(null)
    toast.success("Lead details have been updated successfully")
  }

  const handleCloseEditLeadModal = () => {
    setIsEditLeadModalOpen(false)
    setSelectedLeadForEdit(null)
  }

  // ============================================
  // Training Plan Handlers
  // ============================================
  const handleDumbbellClick = (appointment, e) => {
    if (e) e.stopPropagation()

    const memberData = {
      id: appointment.memberId,
      firstName: appointment.name,
      lastName: appointment.lastName || "",
      email: appointment.email || "",
    }

    setSelectedUserForTrainingPlan(memberData)
    setIsTrainingPlanModalOpen(true)
  }

  const handleAssignTrainingPlan = (memberId, planId) => {
    const plan = availableTrainingPlans.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = {
        ...plan,
        assignedDate: new Date().toLocaleDateString(),
      }

      setMemberTrainingPlans((prev) => ({
        ...prev,
        [memberId]: [...(prev[memberId] || []), assignedPlan],
      }))

      toast.success(`Training plan "${plan.name}" assigned successfully!`)
    }
  }

  const handleRemoveTrainingPlan = (memberId, planId) => {
    setMemberTrainingPlans((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId),
    }))
    toast.success("Training plan removed successfully!")
  }

  const handleCloseTrainingPlanModal = () => {
    setIsTrainingPlanModalOpen(false)
    setSelectedUserForTrainingPlan(null)
  }

  // ============================================
  // Website Links Handlers
  // ============================================
  const handleAddLink = (newLink) => setCustomLinks((prev) => [...prev, newLink])

  const handleEditLink = (updatedLink) => {
    setCustomLinks((currentLinks) =>
      currentLinks.map((link) => (link.id === updatedLink.id ? { ...link, ...updatedLink } : link))
    )
  }

  const handleRemoveLink = (linkId) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== linkId))
  }

  // ============================================
  // Notification Handlers
  // ============================================
  const toggleNotificationSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const markMessageAsRead = (messageId, messageType) => {
    const sectionKey = messageType === "member_chat" ? "memberChat" : "studioChat"
    setNotificationData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ),
    }))
  }

  const handleMessageClick = (message) => {
    // Determine context based on message type
    const isStudioChat = message.type === "studio_chat"
    
    let personId = null
    let personData = null
    
    if (isStudioChat) {
      // Get staffId from notification or find in chat list
      personId = message.staffId || message.senderId
      
      // If no direct staffId, try to find in chat list
      if (!personId && message.chatId) {
        const chatData = staffChatListNew?.find(c => c.id === message.chatId)
        personId = chatData?.staffId
      }
      
      // Get the REAL staff object from staffData
      if (personId) {
        const staff = staffData.find(s => s.id === personId)
        if (staff) {
          personData = {
            id: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            name: `${staff.firstName} ${staff.lastName}`,
            image: staff.img || staff.image,
            email: staff.email,
            dateOfBirth: staff.dateOfBirth
          }
        }
      }
    } else {
      // Get memberId from notification or find in chat list
      personId = message.memberId || message.senderId
      
      // If no direct memberId, try to find in chat list
      if (!personId && message.chatId) {
        const chatData = memberChatListNew?.find(c => c.id === message.chatId)
        personId = chatData?.memberId
      }
      
      // Get the REAL member object from membersData
      if (personId) {
        const member = membersData.find(m => m.id === personId)
        if (member) {
          personData = {
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            name: `${member.firstName} ${member.lastName}`,
            image: member.image,
            email: member.email,
            dateOfBirth: member.dateOfBirth
          }
        }
      }
    }
    
    // If we found the person, open chat
    if (personData) {
      setSelectedChatMember(personData)
      setChatContext(isStudioChat ? "staff" : "member")
      setIsChatPopupOpen(true)
      markMessageAsRead(message.id, message.type)
    } else {
      // Fallback: Use notification data directly (not ideal but prevents crash)
      console.warn("Could not find person data for notification:", message)
      toast.error("Chat konnte nicht geöffnet werden")
    }
  }
  
  const handleCloseChatPopup = () => {
    setIsChatPopupOpen(false)
    setSelectedChatMember(null)
  }

  const handleSendReply = (chatId, replyText) => {
    console.log(`Sending reply to chat ${chatId}: ${replyText}`)
    setNotificationData((prev) => ({
      ...prev,
      memberChat: prev.memberChat.map((msg) => (msg.chatId === chatId ? { ...msg, isRead: true } : msg)),
      studioChat: prev.studioChat.map((msg) => (msg.chatId === chatId ? { ...msg, isRead: true } : msg)),
    }))
  }

  const handleOpenFullMessenger = (member, context) => {
    // Navigate to communication page with the chat pre-selected
    if (member && member.id) {
      const chatType = context === "staff" ? "company" : "member"
      navigate("/dashboard/communication", {
        state: {
          openChatId: member.id,
          openChatType: chatType
        }
      })
    } else {
      navigate("/dashboard/communication")
    }
  }

  // ============================================
  // Activity Monitor Handlers
  // ============================================
  const handleActivityAction = (categoryId, itemId, action) => {
    // Update the activity categories state
    setActivityCategories((prev) => {
      const updated = { ...prev }
      if (updated[categoryId]) {
        updated[categoryId] = {
          ...updated[categoryId],
          items: updated[categoryId].items.filter(item => item.id !== itemId),
          count: updated[categoryId].count - 1,
        }
        // Remove category if empty
        if (updated[categoryId].count <= 0) {
          delete updated[categoryId]
        }
      }
      return updated
    })

    // Activity-type specific messages
    const getActionMessage = (categoryId, action) => {
      const messages = {
        vacation: {
          approve: "Vacation request approved",
          reject: "Vacation request rejected",
        },
        appointments: {
          approve: "Appointment confirmed",
          reject: "Appointment rejected",
        },
        contracts: {
          view: "Opening contract details",
        },
        contractPause: {
          approve: "Contract pause approved",
          reject: "Contract pause rejected",
        },
        memberData: {
          approve: "Data change approved",
          reject: "Data change rejected",
        },
        bankData: {
          approve: "Bank data change approved",
          reject: "Bank data change rejected",
        },
        emails: {
          retry: "Email retry initiated",
        },
      }
      return messages[categoryId]?.[action] || "Action completed"
    }

    toast.success(getActionMessage(categoryId, action))
  }

  const handleJumpToActivityMonitor = (tabId) => {
    // Navigate to activity monitor with the specific tab
    navigate(`/dashboard/activity-monitor?tab=${tabId || "appointments"}`)
  }

  const handleConfirmAction = () => {
    if (pendingActivityAction) {
      const { categoryId, itemId, action } = pendingActivityAction
      handleActivityAction(categoryId, itemId, action)
      setShowActionConfirm(false)
      setPendingActivityAction(null)
    }
  }

  // ============================================
  // Render Widget Content - Widgets have their own headers, but we hide them in sidebar
  // ============================================
  const renderWidgetContent = (widget) => {
    // Pass showHeader={false} to widgets so they don't show their internal headers
    // The sidebar shows its own header with the collapse chevron
    // maxItems limits how many items are displayed
    const visibleItems = getWidgetVisibleItems(widget.id, widget.type)
    const commonProps = { 
      showHeader: false,
      maxItems: visibleItems
    }
    
    switch (widget.type) {
      case "expiringContracts":
        return <ExpiringContractsWidget isSidebarEditing={isSidebarEditing} {...commonProps} />

      case "appointments":
        return (
          <UpcomingAppointmentsWidget
            isSidebarEditing={isSidebarEditing}
            appointments={appointments}
            onAppointmentClick={handleAppointmentOptionsModal}
            onCheckIn={handleCheckIn}
            onOpenEditMemberModal={handleOpenEditMemberModal}
            onOpenEditLeadModal={handleOpenEditLeadModal}
            onOpenTrainingPlansModal={handleDumbbellClick}
            getMemberById={getMemberById}
            showCollapseButton={false}
            useFixedHeight={false}
            backgroundColor="bg-surface-button"
            showDatePicker={true}
            initialDate={new Date()}
            {...commonProps}
          />
        )

      case "staffCheckIn":
        return <StaffCheckInWidget compact={true} showHeader={false} />

      case "websiteLinks":
        return (
          <WebsiteLinksWidget
            isEditing={isSidebarEditing}
            onRemove={() => removeWidget(widget.id)}
            customLinks={customLinks}
            onAddLink={handleAddLink}
            onEditLink={handleEditLink}
            onRemoveLink={handleRemoveLink}
            {...commonProps}
          />
        )

      case "todo":
        return <ToDoWidget isSidebarEditing={isSidebarEditing} compactMode={true} {...commonProps} />

      case "birthday":
        return <UpcomingBirthdaysWidget isSidebarEditing={isSidebarEditing} {...commonProps} />

      case "bulletinBoard":
        return <BulletinBoardWidget isSidebarEditing={isSidebarEditing} {...commonProps} />

      case "notes":
        return <NotesWidget isSidebarEditing={isSidebarEditing} {...commonProps} />

      case "shiftSchedule":
        return (
          <ShiftScheduleWidget
            isEditing={isSidebarEditing}
            onRemove={() => removeWidget(widget.id)}
            {...commonProps}
          />
        )

      case "upcomingClasses":
        return <UpcomingClassesWidget isSidebarEditing={isSidebarEditing} {...commonProps} />

      default:
        return null
    }
  }

  // ============================================
  // Render Notifications Tab
  // ============================================
  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold">Notifications</h2>

      {/* Member Chat Section */}
      <NotificationSection
        title="Member Chat"
        icon={<User size={16} className="inline mr-2 text-content-primary" />}
        isCollapsed={collapsedSections.memberChat}
        onToggle={() => toggleNotificationSection("memberChat")}
        unreadCount={getUnreadCount("memberChat")}
        messages={notificationData.memberChat}
        onMessageClick={(msg) => {
          handleMessageClick(msg)
          markMessageAsRead(msg.id, msg.type)
        }}
        emptyMessage="No member messages"
        highlightClass="bg-primary/20"
        context="member"
        onNavigate={() => navigate("/dashboard/communication", { state: { openChatType: "member" } })}
      />

      {/* Studio Chat Section */}
      <NotificationSection
        title="Studio Chat"
        icon={<Building2 size={16} className="inline mr-2 text-secondary" />}
        isCollapsed={collapsedSections.studioChat}
        onToggle={() => toggleNotificationSection("studioChat")}
        unreadCount={getUnreadCount("studioChat")}
        messages={notificationData.studioChat}
        onMessageClick={(msg) => {
          handleMessageClick(msg)
          markMessageAsRead(msg.id, msg.type)
        }}
        emptyMessage="No studio messages"
        highlightClass="bg-secondary/20"
        context="staff"
        onNavigate={() => navigate("/dashboard/communication", { state: { openChatType: "company" } })}
      />

      {/* Activity Monitor Section */}
      <ActivityMonitorSection
        isCollapsed={collapsedSections.activityMonitor}
        onToggle={() => toggleNotificationSection("activityMonitor")}
        totalCount={getUnreadCount("activityMonitor")}
        categories={activityCategories}
        onAction={(categoryId, itemId, action) => {
          setPendingActivityAction({ categoryId, itemId, action })
          setShowActionConfirm(true)
        }}
        onJumpTo={handleJumpToActivityMonitor}
      />
    </div>
  )

  // ============================================
  // Render Modals via Portal (centered on screen)
  // ============================================
  const renderModals = () => {
    if (typeof document === 'undefined') return null

    return createPortal(
      <>
        {/* Chat Popup for Notifications */}
        {isChatPopupOpen && selectedChatMember && (
          <ChatPopup
            member={selectedChatMember}
            isOpen={isChatPopupOpen}
            onClose={handleCloseChatPopup}
            onNavigateToChat={() => {
              const member = selectedChatMember
              const context = chatContext
              handleCloseChatPopup()
              handleOpenFullMessenger(member, context)
            }}
            context={chatContext}
            communicationsPath="/dashboard/communication"
          />
        )}

        {/* View Management Modal */}
        {isViewModalOpen && (
          <ViewManagementModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            savedViews={savedViews}
            setSavedViews={setSavedViews}
            currentView={currentView}
            setCurrentView={setCurrentView}
            sidebarWidgets={rightSidebarWidgets}
            setSidebarWidgets={setRightSidebarWidgets}
            widgetSettings={widgetSettings}
            setWidgetSettings={setWidgetSettings}
            variant="sidebar"
          />
        )}

        {/* Appointment Action Modal */}
        {isAppointmentActionModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsAppointmentActionModalOpen(false)} />
            <div className="relative z-10 w-full max-w-lg">
              <AppointmentActionModal
                isOpen={isAppointmentActionModalOpen}
                onClose={() => {
                  setIsAppointmentActionModalOpen(false)
                  setSelectedAppointmentForAction(null)
                }}
                appointmentMain={selectedAppointmentForAction}
                onEdit={handleEditAppointment}
                onCancel={handleCancelAppointment}
                onDelete={handleDeleteAppointment}
                onViewMember={handleViewMemberDetails}
                onEditMemberNote={handleOpenEditMemberModal}
                onOpenEditLeadModal={handleOpenEditLeadModal}
                memberRelations={memberRelationsData}
                leadRelations={leadRelationsData}
                appointmentsMain={appointments}
                setAppointmentsMain={setAppointments}
              />
            </div>
          </div>
        )}

        {/* Edit Appointment Modal */}
        {isEditAppointmentModalOpen && selectedAppointmentForAction && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsEditAppointmentModalOpen(false)} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto">
              <EditAppointmentModal
                selectedAppointmentMain={selectedAppointmentForAction}
                setSelectedAppointmentMain={setSelectedAppointmentForAction}
                appointmentTypesMain={appointmentTypesData}
                freeAppointmentsMain={freeAppointmentsData}
                handleAppointmentChange={(changes) =>
                  setSelectedAppointmentForAction((prev) => ({ ...prev, ...changes }))
                }
                appointmentsMain={appointments}
                setAppointmentsMain={setAppointments}
                setIsNotifyMemberOpenMain={() => {}}
                setNotifyActionMain={() => {}}
                onDelete={() => {
                  setAppointments((prev) => prev.filter((a) => a.id !== selectedAppointmentForAction?.id))
                  setIsEditAppointmentModalOpen(false)
                  setSelectedAppointmentForAction(null)
                }}
                onClose={() => {
                  setIsEditAppointmentModalOpen(false)
                  setSelectedAppointmentForAction(null)
                }}
                onOpenEditMemberModal={handleOpenEditMemberModal}
                onOpenEditLeadModal={handleOpenEditLeadModal}
                memberRelations={memberRelationsData}
                leadRelations={leadRelationsData}
              />
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {isEditMemberModalOpen && selectedMemberForEdit && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={handleCloseEditMemberModal} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-auto">
              <EditMemberModalMain
                isOpen={isEditMemberModalOpen}
                onClose={handleCloseEditMemberModal}
                selectedMemberMain={selectedMemberForEdit}
                editModalTabMain={editMemberActiveTab}
                setEditModalTabMain={setEditMemberActiveTab}
                editFormMain={editFormMain}
                handleInputChangeMain={handleInputChangeMain}
                handleEditSubmitMain={handleEditSubmitMain}
                editingRelationsMain={editingRelationsMain}
                setEditingRelationsMain={setEditingRelationsMain}
                newRelationMain={newRelationMain}
                setNewRelationMain={setNewRelationMain}
                availableMembersLeadsMain={availableMembersLeadsNew}
                relationOptionsMain={RELATION_OPTIONS}
                handleAddRelationMain={handleAddRelationMain}
                memberRelationsMain={memberRelations}
                handleDeleteRelationMain={handleDeleteRelationMain}
              />
            </div>
          </div>
        )}

        {/* Edit Lead Modal */}
        {isEditLeadModalOpen && selectedLeadForEdit && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={handleCloseEditLeadModal} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-auto">
              <EditLeadModal
                isVisible={isEditLeadModalOpen}
                onClose={handleCloseEditLeadModal}
                onSave={handleSaveEditLead}
                leadData={selectedLeadForEdit}
                memberRelationsLead={leadRelationsData[selectedLeadForEdit?.id] || {}}
                setMemberRelationsLead={() => {}}
                availableMembersLeads={availableMembersLeadsNew}
                columns={LEAD_COLUMNS}
                initialTab={editLeadActiveTab}
              />
            </div>
          </div>
        )}

        {/* Training Plans Modal */}
        {isTrainingPlanModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={handleCloseTrainingPlanModal} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto">
              <TrainingPlansModalMain
                isOpen={isTrainingPlanModalOpen}
                onClose={handleCloseTrainingPlanModal}
                selectedMember={selectedUserForTrainingPlan}
                memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
                availableTrainingPlans={availableTrainingPlans}
                onAssignPlan={handleAssignTrainingPlan}
                onRemovePlan={handleRemoveTrainingPlan}
              />
            </div>
          </div>
        )}

        {/* Action Confirmation Modal */}
        {showActionConfirm && pendingActivityAction && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowActionConfirm(false)} />
            <div className="relative z-10 w-full max-w-md">
              <ActionConfirmModal
                action={pendingActivityAction.action}
                onCancel={() => {
                  setShowActionConfirm(false)
                  setPendingActivityAction(null)
                }}
                onConfirm={handleConfirmAction}
              />
            </div>
          </div>
        )}
      </>,
      document.body
    )
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <>
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[400px] lg:w-[400px] bg-surface-card border-l border-border z-[50]
          transform transition-transform duration-500 ease-in-out flex flex-col
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Sticky Header + Tabs */}
        <div className="flex-shrink-0 p-4 md:p-5 pb-0">
          {/* Header */}
          <SidebarHeader
            activeTab={activeTab}
            isSidebarEditing={isSidebarEditing}
            currentView={currentView}
            onOpenViewModal={() => setIsViewModalOpen(true)}
            onAddWidget={() => setIsWidgetModalOpen(true)}
            onToggleEditing={toggleSidebarEditing}
            onClose={onClose}
          />

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={getTotalUnreadCount()}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-5 pb-4 md:pb-5">
          {/* Tab Content */}
          {activeTab === "notifications" && renderNotificationsTab()}

          {activeTab === "widgets" && (
            <div className="space-y-3">
              {rightSidebarWidgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    isEditing={isSidebarEditing}
                    moveWidget={moveWidget}
                    removeWidget={removeWidget}
                    variant="sidebar"
                  >
                    {collapsedWidgets[widget.id] ? (
                      /* Collapsed State - nur Chevron + Titel */
                      <button
                        onClick={() => toggleWidgetCollapse(widget.id)}
                        className="flex items-center gap-2 p-3 rounded-xl bg-surface-button hover:bg-surface-button-hover transition-colors w-full text-left"
                      >
                        <ChevronRight size={14} className="text-content-muted flex-shrink-0" />
                        <span className="font-semibold text-base text-content-primary">{getWidgetDisplayName(widget.type)}</span>
                      </button>
                    ) : (
                      /* Expanded State - Chevron-Header + Widget */
                      <div>
                        {/* Clickable Header mit Chevron vor dem Titel */}
                        <div className="flex items-center justify-between mb-1 px-1">
                          <button
                            onClick={() => !isSidebarEditing && toggleWidgetCollapse(widget.id)}
                            className={`flex items-center gap-2 py-1 rounded-lg transition-colors text-left ${
                              isSidebarEditing ? 'cursor-default' : 'hover:bg-surface-hover cursor-pointer'
                            }`}
                            disabled={isSidebarEditing}
                          >
                            {!isSidebarEditing && (
                              <ChevronDown size={14} className="text-content-muted flex-shrink-0" />
                            )}
                            <span className="font-semibold text-base text-content-primary">{getWidgetDisplayName(widget.type)}</span>
                          </button>
                          
                          {/* Settings Icon - only for widgets that support maxItems, not during editing */}
                          {!isSidebarEditing && WIDGETS_WITH_SETTINGS.includes(widget.type) && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (openSettingsDropdown === widget.id) {
                                    setOpenSettingsDropdown(null)
                                    setTempInputValue("")
                                  } else {
                                    setOpenSettingsDropdown(widget.id)
                                    setTempInputValue(String(getWidgetVisibleItems(widget.id, widget.type)))
                                  }
                                }}
                                className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-content-muted hover:text-content-primary"
                                title="Widget Settings"
                              >
                                <SlidersHorizontal size={14} />
                              </button>
                              
                              {/* Settings Dropdown with Custom Input */}
                              {openSettingsDropdown === widget.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => {
                                      setOpenSettingsDropdown(null)
                                      setTempInputValue("")
                                    }}
                                  />
                                  <div className="absolute right-0 top-full mt-1 bg-surface-dark border border-border rounded-xl shadow-lg z-50 min-w-[140px] p-3">
                                    <div className="text-[10px] text-content-faint uppercase tracking-wide mb-2">
                                      Visible items (1-{MAX_VISIBLE_ITEMS})
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={tempInputValue}
                                        onChange={(e) => {
                                          const val = e.target.value
                                          if (val === '' || (/^\d{1,2}$/.test(val) && parseInt(val) <= MAX_VISIBLE_ITEMS)) {
                                            setTempInputValue(val)
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const value = parseInt(tempInputValue)
                                            if (!isNaN(value) && value >= 1 && value <= MAX_VISIBLE_ITEMS) {
                                              updateWidgetVisibleItems(widget.id, value)
                                            }
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-14 px-2 py-1.5 bg-surface-dark border border-border rounded-lg text-content-primary text-sm text-center focus:border-primary focus:outline-none"
                                        placeholder={String(getWidgetVisibleItems(widget.id, widget.type))}
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const value = parseInt(tempInputValue)
                                          if (!isNaN(value) && value >= 1 && value <= MAX_VISIBLE_ITEMS) {
                                            updateWidgetVisibleItems(widget.id, value)
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg transition-colors"
                                      >
                                        OK
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Widget Content - mit showHeader=false um doppelte Titel zu vermeiden */}
                        {renderWidgetContent(widget)}
                      </div>
                    )}
                  </DraggableWidget>
                ))}
            </div>
          )}
        </div>
      </aside>

      {/* Render all modals via portal */}
      {renderModals()}

      {/* Widget Selection Modal for Sidebar */}
      <WidgetSelectionModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getWidgetStatusForSidebar}
        widgetArea="sidebar"
      />
    </>
  )
}

// ============================================
// Sub-Components
// ============================================

const SidebarHeader = ({
  activeTab,
  isSidebarEditing,
  currentView,
  onOpenViewModal,
  onAddWidget,
  onToggleEditing,
  onClose,
}) => (
  <div className="flex items-center justify-between w-full mb-4">
    <h2 className="text-base sm:text-lg font-semibold text-content-primary">Sidebar</h2>
    <div className="flex items-center gap-1 sm:gap-2">
      {!isSidebarEditing && activeTab !== "notifications" && (
        <button
          onClick={onOpenViewModal}
          className="p-1.5 sm:p-2 flex items-center text-sm gap-2 bg-surface-button text-content-primary hover:bg-surface-hover rounded-lg cursor-pointer"
          title="Manage Sidebar Views"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">{currentView ? currentView.name : "Standard View"}</span>
        </button>
      )}
      {activeTab === "widgets" && isSidebarEditing && (
        <button
          onClick={onAddWidget}
          className="p-1.5 sm:p-2 bg-surface-dark text-content-primary hover:bg-surface-hover rounded-lg cursor-pointer"
          title="Add Widget"
        >
          <Plus size={20} />
        </button>
      )}
      {activeTab === "widgets" && (
        <button
          onClick={onToggleEditing}
          className={`p-1.5 sm:p-2 ${
            isSidebarEditing ? "bg-primary text-white" : "text-content-muted hover:bg-surface-hover"
          } rounded-lg flex items-center gap-1`}
          title="Toggle Edit Mode"
        >
          {isSidebarEditing ? <Check size={18} /> : <Edit size={18} />}
        </button>
      )}
      <button
        onClick={onClose}
        className="p-1.5 sm:p-2 text-content-muted hover:bg-surface-hover rounded-xl"
        aria-label="Close sidebar"
      >
        <X size={16} />
      </button>
    </div>
  </div>
)

const TabNavigation = ({ activeTab, onTabChange, unreadCount }) => {
  const isNotificationsActive = activeTab === "notifications"
  
  return (
    <div className="flex mb-4 bg-surface-card rounded-xl border border-border p-1">
      <button
        onClick={() => onTabChange("widgets")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
          activeTab === "widgets" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
        }`}
      >
        <Settings size={14} className="inline mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Widgets</span>
      </button>
      <button
        onClick={() => onTabChange("notifications")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
          isNotificationsActive ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
        }`}
      >
        <Bell size={14} className="inline mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Notifications</span>
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
            isNotificationsActive 
              ? "bg-white text-primary" 
              : "bg-primary text-white"
          }`}>
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}

const NotificationSection = ({
  title,
  icon,
  isCollapsed,
  onToggle,
  unreadCount,
  messages,
  onMessageClick,
  emptyMessage,
  highlightClass,
  context = "member", // "member" or "staff"
  onNavigate, // optional: navigate to full chat view
}) => {
  // Helper to get first/last name from senderName
  const getNameParts = (senderName) => {
    const parts = (senderName || "").split(" ")
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || ""
    }
  }

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden border border-border">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-content-primary font-medium text-sm">{title}</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate()
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onNavigate() } }}
              className="p-1 hover:bg-surface-button rounded-lg transition-colors text-content-faint hover:text-primary"
              title={`Open ${title}`}
            >
              <ExternalLink size={14} />
            </span>
          )}
          {isCollapsed ? <ChevronDown size={16} className="text-content-muted" /> : <ChevronUp size={16} className="text-content-muted" />}
        </div>
      </button>

      {!isCollapsed && (
        <div className="border-t border-border">
          {messages.length > 0 ? (
            messages.map((message) => {
              const { firstName, lastName } = getNameParts(message.senderName)
              
              return (
                <div
                  key={message.id}
                  className={`p-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-hover transition-colors ${
                    !message.isRead ? highlightClass : ""
                  }`}
                  onClick={() => onMessageClick(message)}
                >
                  <div className="flex items-start gap-3">
                    {message.senderAvatar ? (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-xl flex-shrink-0 object-cover"
                      />
                    ) : (
                      <InitialsAvatar
                        firstName={firstName}
                        lastName={lastName}
                        size={32}
                        context={context}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-content-primary font-medium text-sm truncate">{message.senderName}</h4>
                        {!message.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-content-secondary text-sm line-clamp-2 mb-1">{message.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-content-faint text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {message.time}
                        </p>
                        <Reply size={14} className="text-content-muted" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center text-content-muted">
              <Reply size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ActivityMonitorSection = ({
  isCollapsed,
  onToggle,
  totalCount,
  categories,
  onAction,
  onJumpTo,
}) => {
  const categoryOrder = ["appointments", "contracts", "contractPause", "memberData", "bankData", "vacation", "emails"]
  const sortedCategories = categoryOrder
    .filter(id => categories[id])
    .map(id => ({ id, ...categories[id] }))

  // Override vacation color to use secondary (staff-related)
  const getCategoryColor = (category) => {
    if (category.id === "vacation") return "bg-secondary"
    return category.color
  }

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden border border-border">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <CiMonitor size={20} className="text-content-primary" />
          <h3 className="text-content-primary font-medium text-sm">Activity Monitor</h3>
          {totalCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
        </div>
        {isCollapsed ? <ChevronDown size={18} className="text-content-muted" /> : <ChevronUp size={18} className="text-content-muted" />}
      </button>

      {!isCollapsed && (
        <div className="border-t border-border max-h-[500px] overflow-y-auto custom-scrollbar">
          {sortedCategories.length > 0 ? (
            <div className="divide-y divide-border">
              {sortedCategories.map((category) => {
                const Icon = category.icon
                
                return (
                  <div key={category.id} className="p-3">
                    {/* Category Header */}
                    <div 
                      className="flex items-center justify-between mb-2 cursor-pointer hover:opacity-80"
                      onClick={() => onJumpTo(category.tabId)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`${getCategoryColor(category)} p-1.5 rounded-lg`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <span className="text-content-primary text-sm font-medium">{category.label}</span>
                        <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                          {category.count}
                        </span>
                      </div>
                      <ExternalLink size={14} className="text-content-faint" />
                    </div>
                    
                    {/* Category Items (show max 2) */}
                    <div className="space-y-2 ml-8">
                      {category.items.slice(0, 2).map((item) => (
                        <div 
                          key={item.id}
                          className="bg-surface-dark rounded-lg p-2 hover:bg-surface-hover transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-content-primary text-xs font-medium truncate">{item.title}</p>
                              <p className="text-content-faint text-[10px] truncate">{item.subtitle}</p>
                              <p className="text-content-muted text-[10px] truncate">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {/* Action buttons based on category */}
                              {item.status === "pending" && (
                                <>
                                  {/* Approve/Reject for most categories */}
                                  {(category.id === "appointments" || category.id === "contractPause" || 
                                    category.id === "memberData" || category.id === "bankData") && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onAction(category.id, item.id, "approve")
                                        }}
                                        className="p-1 bg-primary hover:bg-primary-hover rounded transition-colors"
                                        title="Approve"
                                      >
                                        <Check size={10} className="text-white" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onAction(category.id, item.id, "reject")
                                        }}
                                        className="p-1 bg-accent-red hover:bg-accent-red rounded transition-colors"
                                        title="Reject"
                                      >
                                        <X size={10} className="text-white" />
                                      </button>
                                    </>
                                  )}
                                  {/* Vacation */}
                                  {category.id === "vacation" && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onAction(category.id, item.id, "approve")
                                        }}
                                        className="p-1 bg-primary hover:bg-primary-hover rounded transition-colors"
                                        title="Approve"
                                      >
                                        <Check size={10} className="text-white" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onAction(category.id, item.id, "reject")
                                        }}
                                        className="p-1 bg-accent-red hover:bg-accent-red rounded transition-colors"
                                        title="Reject"
                                      >
                                        <X size={10} className="text-white" />
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                              {/* Contracts - just show days left */}
                              {category.id === "contracts" && (
                                <span className={`text-[10px] ${category.textColor}`}>
                                  {item.time}
                                </span>
                              )}
                              {/* Emails - retry button */}
                              {category.id === "emails" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAction(category.id, item.id, "retry")
                                  }}
                                  className="p-1 bg-surface-button hover:bg-surface-hover rounded transition-colors"
                                  title="Retry"
                                >
                                  <Reply size={10} className="text-content-primary" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Show more link if more items */}
                      {category.items.length > 2 && (
                        <button
                          onClick={() => onJumpTo(category.tabId)}
                          className={`text-[10px] ${category.textColor} hover:underline`}
                        >
                          +{category.items.length - 2} more...
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-content-faint">
              <CiMonitor size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pending activities</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ActionConfirmModal = ({ action, onCancel, onConfirm }) => (
  <div className="bg-surface-card rounded-xl w-full p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-content-primary">Confirm Action</h2>
      <button onClick={onCancel} className="p-2 hover:bg-surface-hover rounded-lg text-content-muted">
        <X size={16} />
      </button>
    </div>
    <p className="text-content-secondary mb-6">
      Are you sure you want to <span className="font-semibold text-content-primary">{action}</span> this activity?
    </p>
    <div className="flex gap-3 justify-end">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-surface-button hover:bg-surface-button-hover rounded-lg font-medium text-content-primary"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 ${
          action === "reject" ? "bg-accent-red hover:bg-accent-red" : "bg-primary hover:bg-primary-hover"
        } rounded-lg font-medium text-white`}
      >
        Confirm
      </button>
    </div>
  </div>
)

export default Sidebar
