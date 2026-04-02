/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { logout } from "../../../features/auth/authSlice"
import { MdOutlineHelpCenter, MdOutlineSupportAgent, MdOutlineLocalActivity } from "react-icons/md"
import { FaNotesMedical } from "react-icons/fa6"
import { FaPersonRays } from "react-icons/fa6"
import { FaCartPlus } from "react-icons/fa"
import { BsPersonWorkspace } from "react-icons/bs"
import { FaTasks } from "react-icons/fa"
import { TbMessage } from "react-icons/tb"
import { BsFillClipboard2HeartFill } from "react-icons/bs"


import {
  Calendar,
  Home,
  MessageCircle,
  LogOut,
  Image,
  Users,
  CheckSquare,
  Settings,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquarePlus,
  Timer,
} from "lucide-react"
import { HiOutlineUsers } from "react-icons/hi2"
import { IoFitnessOutline } from "react-icons/io5"
import { RiContractLine } from "react-icons/ri"
import { CiMonitor } from "react-icons/ci"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { BadgeDollarSign } from "lucide-react"
import { CgGym } from "react-icons/cg"

import OrgaGymLogoWihoutText from '../../../../public/OrgaGym Logo.svg'
import FeedbackModal from '../../../dashboard-pages/studio-view/FeedbackModal'

/**
 * Sidebar Component
 * 
 * Pure navigation sidebar - no header, no modals.
 * Header functionality moved to DashboardHeader component.
 * 
 * Props:
 * - isOpen: Boolean for mobile sidebar visibility
 * - onClose: Function to close mobile sidebar
 * - isCollapsed: Boolean for collapsed state (optional, controlled externally)
 * - onToggleCollapse: Function to toggle collapse (optional, controlled externally)
 */
const Sidebar = ({ isOpen = false, onClose, isCollapsed: externalIsCollapsed, onToggleCollapse }) => {
  // Use external state if provided, otherwise use internal state
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed
  const [unreadMessages, setUnreadMessages] = useState(2)
  
  // Submenu states
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)
  const [isProductivityHubOpen, setIsProductivityHubOpen] = useState(false)
  const [isMemberAreaOpen, setIsMemberAreaOpen] = useState(false)
  const [isFitnessHubOpen, setIsFitnessHubOpen] = useState(false)
  const [isSupportAreaOpen, setIsSupportAreaOpen] = useState(false)
  
  // Feedback Modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
    rating: 0
  })

  // Block all hotkeys when feedback modal is open
  useEffect(() => {
    if (!isFeedbackModalOpen) return
    
    const blockHotkeys = (e) => {
      // Allow Escape to close the modal
      if (e.key === 'Escape') {
        setIsFeedbackModalOpen(false)
        setFeedbackSubmitted(false)
        setFeedbackData({ type: 'suggestion', subject: '', message: '', rating: 0 })
        e.stopImmediatePropagation()
        return
      }
      
      // Check if target is an input field
      const target = e.target
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // Always stop propagation to prevent hotkeys
      e.stopImmediatePropagation()
      
      // Only preventDefault if NOT in an input field (to allow typing)
      if (!isInputField) {
        e.preventDefault()
      }
    }
    
    // Capture phase to catch events before they reach other listeners
    document.addEventListener('keydown', blockHotkeys, true)
    
    return () => {
      document.removeEventListener('keydown', blockHotkeys, true)
    }
  }, [isFeedbackModalOpen])

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const toggleCollapse = onToggleCollapse || (() => setInternalIsCollapsed(!internalIsCollapsed))

  // Close sidebar on window resize (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && onClose) {
        onClose()
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [onClose])

  const handleNavigation = (to) => {
    if (to === '#feedback') {
      setIsFeedbackModalOpen(true)
      return
    }
    navigate(to)
    if (onClose) onClose()
  }

const handleLogout = () => {
  dispatch(logout())
  window.location.href = "/login"
}

  // ============================================
  // Menu Items Configuration
  // ============================================
  const menuItems = [
    { icon: Home, label: t("studio.sidebar.myArea"), to: "/dashboard/my-area" },
    { icon: Calendar, label: t("studio.sidebar.appointments"), to: "/dashboard/appointments" },
    { icon: Timer, label: t("studio.sidebar.classes"), to: "/dashboard/classes" },
    {
      icon: MessageCircle,
      label: t("studio.sidebar.communication"),
      id: "communication",
      to: "/dashboard/communication",
      hasSubmenu: true,
      submenu: [
        { label: t("studio.sidebar.messenger"), to: "/dashboard/communication", icon: TbMessage, id: "messenger" },
        { label: t("studio.sidebar.bulletinBoard"), to: "/dashboard/bulletin-board", icon: ClipboardList },
        { label: t("studio.sidebar.activityMonitor"), to: "/dashboard/activity-monitor", icon: CiMonitor, id: "activity-monitor" },
      ],
    },
    {
      icon: FaTasks,
      label: t("studio.sidebar.productivityArea"),
      id: "productivity",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: t("studio.sidebar.todo"), to: "/dashboard/to-do", icon: CheckSquare },
        { label: t("studio.sidebar.notes"), to: "/dashboard/notes", icon: FaNotesMedical },
        { label: t("studio.sidebar.mediaLibrary"), to: "/dashboard/media-library", icon: Image },
      ],
    },
    {
      icon: Users,
      label: t("studio.sidebar.memberArea"),
      id: "members",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: t("studio.sidebar.members"), to: "/dashboard/members", icon: HiOutlineUsers },
        { label: t("studio.sidebar.checkIn"), to: "/dashboard/members-checkin", icon: IoIosCheckmarkCircleOutline },
        { label: t("studio.sidebar.contracts"), to: "/dashboard/contract", icon: RiContractLine },
      ],
    },
    { icon: FaPersonRays, label: t("studio.sidebar.leads"), to: "/dashboard/leads" },
    { icon: BsPersonWorkspace, label: t("studio.sidebar.staff"), to: "/dashboard/staff" },
    { icon: ShoppingCart, label: t("studio.sidebar.selling"), to: "/dashboard/selling" },
    {
      icon: IoFitnessOutline,
      label: t("studio.sidebar.fitnessArea"),
      id: "fitness",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: t("studio.sidebar.training"), to: "/dashboard/training", icon: CgGym },
        { label: t("studio.sidebar.medicalHistory"), to: "/dashboard/medical-history", icon: BsFillClipboard2HeartFill },
      ],
    },
    { icon: BadgeDollarSign, label: t("studio.sidebar.finances"), to: "/dashboard/finances" },
    { icon: TbBrandGoogleAnalytics, label: t("studio.sidebar.analytics"), to: "/dashboard/analytics" },
    { icon: Settings, label: t("studio.sidebar.configuration"), to: "/dashboard/configuration" },
    { icon: FaCartPlus, label: t("studio.sidebar.marketplace"), to: "/dashboard/market-place" },
    {
      icon: MdOutlineSupportAgent,
      label: t("studio.sidebar.supportArea"),
      id: "support",
      to: "#",
      hasSubmenu: true,
      hasNotification: true,
      notificationCount: 3,
      submenu: [
        { label: t("studio.sidebar.helpCenter"), to: "/dashboard/help-center", icon: MdOutlineHelpCenter },
        { label: t("studio.sidebar.tickets"), to: "/dashboard/tickets", icon: MdOutlineLocalActivity, hasNotification: true, notificationCount: 3 },
        { label: t("studio.sidebar.feedback"), to: "#feedback", icon: MessageSquarePlus },
      ],
    },
  ]

  // Helper function to check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu?.some(subItem => location.pathname === subItem.to)
  }

  // Toggle submenu handlers
  const toggleSubmenu = (id) => {
    switch (id) {
      case "communication":
        setIsCommunicationOpen(!isCommunicationOpen)
        break
      case "members":
        setIsMemberAreaOpen(!isMemberAreaOpen)
        break
      case "productivity":
        setIsProductivityHubOpen(!isProductivityHubOpen)
        break
      case "fitness":
        setIsFitnessHubOpen(!isFitnessHubOpen)
        break
      case "support":
        setIsSupportAreaOpen(!isSupportAreaOpen)
        break
    }
  }

  const isSubmenuOpen = (id) => {
    switch (id) {
      case "communication":
        return isCommunicationOpen
      case "members":
        return isMemberAreaOpen
      case "productivity":
        return isProductivityHubOpen
      case "fitness":
        return isFitnessHubOpen
      case "support":
        return isSupportAreaOpen
      default:
        return false
    }
  }

  // Feedback handlers
  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedbackData)
    // Hier würde normalerweise ein API-Call erfolgen
    setFeedbackSubmitted(true)
    
    // Nach 4 Sekunden Modal schließen
    setTimeout(() => {
      setIsFeedbackModalOpen(false)
      setFeedbackSubmitted(false)
      setFeedbackData({ type: 'suggestion', subject: '', message: '', rating: 0 })
    }, 4000)
  }

  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false)
    setFeedbackSubmitted(false)
    setFeedbackData({ type: 'suggestion', subject: '', message: '', rating: 0 })
  }

  return (
    <>
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        isSubmitted={feedbackSubmitted}
        feedbackData={feedbackData}
        onFeedbackDataChange={setFeedbackData}
        onSubmit={handleFeedbackSubmit}
        onClose={handleFeedbackClose}
      />
      
      <aside
        className={`
          fixed top-0 left-0 z-[50] h-screen bg-[#111111] transition-all duration-500 overflow-hidden 
          lg:relative lg:block
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}
      `}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="hidden lg:block">
          <div className="flex justify-center items-center w-full">
            {isCollapsed ? (
              <div className="w-full bg-primary flex items-center justify-center p-2">
                <img src={OrgaGymLogoWihoutText} className="h-auto w-auto max-w-[70%] select-none pointer-events-none" alt="Orgagym Logo" draggable="false" />
              </div>
            ) : (
              <div className="w-full bg-primary flex items-center justify-center p-2.5">
                <img src="/OrgaGym Logo with Text.svg" className="h-18 w-auto max-w-full select-none pointer-events-none" alt="Orgagym Logo" draggable="false" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
          <ul className="space-y-2 px-4 pt-1 pb-4">
            {menuItems.map((item) => {
              const hasActiveSubmenu = isSubmenuActive(item.submenu)

              if (item.hasSubmenu) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font relative w-full ${
                        isCollapsed ? "justify-center" : "text-left"
                      } group transition-all duration-300 ${
                        hasActiveSubmenu
                          ? `text-white border-l-2 border-primary ${isCollapsed ? "pl-[14px]" : "pl-3"}`
                          : `text-zinc-200 hover:text-white hover:border-l-2 hover:border-white ${isCollapsed ? "hover:pl-[14px]" : "hover:pl-3"}`
                      }`}
                    >
                      <div className="relative">
                        <item.icon
                          size={24}
                          className={`cursor-pointer ${hasActiveSubmenu ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
                        />
                        {item.id === "communication" && unreadMessages > 0 && !isCommunicationOpen && (
                          <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {unreadMessages}
                          </span>
                        )}
                        {item.id === "support" && item.notificationCount > 0 && !isSupportAreaOpen && (
                          <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {item.notificationCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.label}</span>
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${isSubmenuOpen(item.id) ? "rotate-90" : ""}`}
                          />
                        </div>
                      )}
                    </button>

                    {/* Submenu */}
                    {isSubmenuOpen(item.id) && (
                      <ul className={`${isCollapsed ? 'ml-0 mt-1 relative' : 'ml-3 mt-1 relative'} space-y-0`}>
                        {/* Vertical line connector for expanded */}
                        {!isCollapsed && (
                          <div className="absolute left-2 top-0 bottom-4 w-px bg-zinc-600"></div>
                        )}
                        
                        {/* Vertical line connector for collapsed */}
                        {isCollapsed && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-2 bg-zinc-600"></div>
                        )}
                        
                        {item.submenu.map((subItem, index) => {
                          const isActive = location.pathname === subItem.to
                          const isLastItem = index === item.submenu.length - 1

                          return (
                            <li key={subItem.label} className="relative">
                              {/* Collapsed: Show connecting line between submenu items */}
                              {isCollapsed && index > 0 && (
                                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-px h-2 bg-zinc-700"></div>
                              )}
                              
                              <button
                                onClick={() => handleNavigation(subItem.to)}
                                className={`flex items-center gap-3 text-[13px] open_sans_font relative w-full group transition-all duration-300 ${
                                  isCollapsed 
                                    ? "justify-center px-2 py-1.5" 
                                    : "text-left px-4 py-2"
                                } ${isActive 
                                  ? `text-white ${isCollapsed && "border-l-2 border-primary pl-[6px]"}` 
                                  : `text-zinc-200 hover:text-white ${isCollapsed && "hover:border-l-2 hover:border-white hover:pl-[6px]"}`
                                }`}
                              >
                                {/* Expanded view with tree branch */}
                                {!isCollapsed && (
                                  <div className="relative flex items-center gap-3">
                                    <div className="relative w-4 h-5 flex items-center">
                                      <div className={`absolute left-0 top-1/2 w-4 h-px ${isActive ? "bg-primary" : "bg-zinc-600 group-hover:bg-zinc-400"} transition-colors`}></div>
                                      <div className={`absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-zinc-600 group-hover:bg-zinc-400"} transition-colors`}></div>
                                    </div>
                                    
                                    <subItem.icon
                                      size={18}
                                      className={`cursor-pointer transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
                                    />
                                    
                                    {subItem.id === "messenger" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 left-10 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.id === "activity-monitor" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 left-10 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.hasNotification && subItem.notificationCount > 0 && (
                                      <span className="absolute -top-1 left-10 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {subItem.notificationCount}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Collapsed view - smaller icon */}
                                {isCollapsed && (
                                  <div className="relative">
                                    <subItem.icon
                                      size={18}
                                      className={`cursor-pointer ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}
                                    />
                                    {subItem.id === "messenger" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.id === "activity-monitor" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.hasNotification && subItem.notificationCount > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {subItem.notificationCount}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {!isCollapsed && <span className="transition-colors truncate">{subItem.label}</span>}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              }

              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item.to)}
                    className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font relative w-full ${
                      isCollapsed ? "justify-center" : "text-left"
                    } group transition-all duration-300 ${
                      location.pathname === item.to
                        ? `text-white border-l-2 border-primary ${isCollapsed ? "pl-[14px]" : "pl-3"}`
                        : `text-zinc-200 hover:text-white hover:border-l-2 hover:border-white ${isCollapsed ? "hover:pl-[14px]" : "hover:pl-3"}`
                    }`}
                  >
                    <div className="relative">
                      <item.icon
                        size={24}
                        className={`cursor-pointer ${location.pathname === item.to ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
                      />
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>

                  {/* Divider after Configuration */}
                  {item.to === "/dashboard/configuration" && <hr className="border-zinc-700 my-2" />}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
           onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full ${
              isCollapsed ? "justify-center hover:border-l-2 hover:border-white hover:pl-[14px]" : "text-left hover:border-l-2 hover:border-white hover:pl-3"
            } transition-all duration-300`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t("common.logout")}</span>}
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}

export default Sidebar