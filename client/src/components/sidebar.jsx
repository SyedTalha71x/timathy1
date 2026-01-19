/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { HiOutlineUsers } from "react-icons/hi2"
import { IoFitnessOutline } from "react-icons/io5"
import { RiContractLine } from "react-icons/ri"
import { CiMonitor } from "react-icons/ci"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { BadgeDollarSign } from "lucide-react"
import { CgGym } from "react-icons/cg"

import OrgaGymLogoWihoutText from '../../public/Orgagym white without text.svg'

/**
 * Sidebar Component
 * 
 * Pure navigation sidebar - no header, no modals.
 * Header functionality moved to DashboardHeader component.
 * 
 * Props:
 * - isOpen: Boolean for mobile sidebar visibility
 * - onClose: Function to close mobile sidebar
 */
const Sidebar = ({ isOpen = false, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(2)
  
  // Submenu states
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)
  const [isProductivityHubOpen, setIsProductivityHubOpen] = useState(false)
  const [isMemberAreaOpen, setIsMemberAreaOpen] = useState(false)
  const [isFitnessHubOpen, setIsFitnessHubOpen] = useState(false)
  const [isSupportAreaOpen, setIsSupportAreaOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

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
    navigate(to)
    if (onClose) onClose()
  }

  const redirectToHome = () => (window.location.href = "/")

  // ============================================
  // Menu Items Configuration
  // ============================================
  const menuItems = [
    { icon: Home, label: "My Area", to: "/dashboard/my-area" },
    { icon: Calendar, label: "Appointments", to: "/dashboard/appointments" },
    {
      icon: MessageCircle,
      label: "Communication",
      to: "/dashboard/communication",
      hasSubmenu: true,
      submenu: [
        { label: "Messenger", to: "/dashboard/communication", icon: TbMessage },
        { label: "Bulletin Board", to: "/dashboard/bulletin-board", icon: ClipboardList },
      ],
    },
    {
      icon: FaTasks,
      label: "Productivity Area",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Activity Monitor", to: "/dashboard/activity-monitor", icon: CiMonitor },
        { label: "To-Do", to: "/dashboard/to-do", icon: CheckSquare },
        { label: "Notes", to: "/dashboard/notes", icon: FaNotesMedical },
        { label: "Media Library", to: "/dashboard/media-library", icon: Image },
      ],
    },
    {
      icon: Users,
      label: "Member Area",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Members", to: "/dashboard/members", icon: HiOutlineUsers },
        { label: "Check-In", to: "/dashboard/members-checkin", icon: IoIosCheckmarkCircleOutline },
        { label: "Contracts", to: "/dashboard/contract", icon: RiContractLine },
      ],
    },
    { icon: FaPersonRays, label: "Leads", to: "/dashboard/leads" },
    { icon: BsPersonWorkspace, label: "Staff", to: "/dashboard/staff" },
    { icon: ShoppingCart, label: "Selling", to: "/dashboard/selling" },
    { icon: FaCartPlus, label: "Marketplace", to: "/dashboard/market-place" },
    { icon: BadgeDollarSign, label: "Finances", to: "/dashboard/finances" },
    {
      icon: IoFitnessOutline,
      label: "Fitness Area",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Training", to: "/dashboard/training", icon: CgGym },
        { label: "Medical History", to: "/dashboard/assessment", icon: BsFillClipboard2HeartFill },
      ],
    },
    { icon: TbBrandGoogleAnalytics, label: "Analytics", to: "/dashboard/analytics" },
    {
      icon: MdOutlineSupportAgent,
      label: "Support Area",
      to: "#",
      hasSubmenu: true,
      hasNotification: true,
      notificationCount: 3,
      submenu: [
        { label: "Help Center", to: "/dashboard/help-center", icon: MdOutlineHelpCenter },
        { label: "Tickets", to: "/dashboard/tickets", icon: MdOutlineLocalActivity, hasNotification: true, notificationCount: 3 },
      ],
    },
    { icon: Settings, label: "Configuration", to: "/dashboard/configuration" },
  ]

  // Helper function to check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu?.some(subItem => location.pathname === subItem.to)
  }

  // Toggle submenu handlers
  const toggleSubmenu = (label) => {
    switch (label) {
      case "Communication":
        setIsCommunicationOpen(!isCommunicationOpen)
        break
      case "Member Area":
        setIsMemberAreaOpen(!isMemberAreaOpen)
        break
      case "Productivity Area":
        setIsProductivityHubOpen(!isProductivityHubOpen)
        break
      case "Fitness Area":
        setIsFitnessHubOpen(!isFitnessHubOpen)
        break
      case "Support Area":
        setIsSupportAreaOpen(!isSupportAreaOpen)
        break
    }
  }

  const isSubmenuOpen = (label) => {
    switch (label) {
      case "Communication":
        return isCommunicationOpen
      case "Member Area":
        return isMemberAreaOpen
      case "Productivity Area":
        return isProductivityHubOpen
      case "Fitness Area":
        return isFitnessHubOpen
      case "Support Area":
        return isSupportAreaOpen
      default:
        return false
    }
  }

  return (
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
              <div className="w-full bg-orange-500 flex items-center justify-center p-4">
                <img src={OrgaGymLogoWihoutText} className="h-auto w-auto max-w-full" alt="Orgagym Logo" />
              </div>
            ) : (
              <div className="w-full bg-orange-500 flex items-center justify-center p-4">
                <img src="/Orgagym white.svg" className="h-20 w-auto max-w-full" alt="Orgagym Logo" />
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button Section */}
        <div className="p-4 hidden lg:block relative">
          <div className={`flex ${isCollapsed ? "justify-center" : "items-center"} gap-4`}>
            {!isCollapsed && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-[#222222] rounded-full p-2 cursor-pointer z-50">
                <ChevronLeft size={20} className="text-white" onClick={toggleCollapse} />
              </div>
            )}
            {isCollapsed && (
              <div className="absolute -right-2 top-1/3 transform -translate-y-1/2 bg-[#222222] rounded-full p-2 cursor-pointer z-50">
                <ChevronRight size={20} className="text-white" onClick={toggleCollapse} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2 p-4">
            {menuItems.map((item) => {
              const hasActiveSubmenu = isSubmenuActive(item.submenu)

              if (item.hasSubmenu) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font relative w-full ${
                        isCollapsed ? "justify-center" : "text-left"
                      } group transition-all duration-300 ${
                        hasActiveSubmenu
                          ? `text-white border-l-2 border-orange-500 ${isCollapsed ? "pl-[14px]" : "pl-3"}`
                          : `text-zinc-200 hover:text-white hover:border-l-2 hover:border-white ${isCollapsed ? "hover:pl-[14px]" : "hover:pl-3"}`
                      }`}
                    >
                      <div className="relative">
                        <item.icon
                          size={24}
                          className={`cursor-pointer ${hasActiveSubmenu ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
                        />
                        {item.label === "Communication" && unreadMessages > 0 && !isCommunicationOpen && (
                          <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {unreadMessages}
                          </span>
                        )}
                        {item.label === "Productivity Area" && unreadMessages > 0 && !isProductivityHubOpen && (
                          <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {unreadMessages}
                          </span>
                        )}
                        {item.label === "Support Area" && item.notificationCount > 0 && !isSupportAreaOpen && (
                          <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {item.notificationCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.label}</span>
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${isSubmenuOpen(item.label) ? "rotate-90" : ""}`}
                          />
                        </div>
                      )}
                    </button>

                    {/* Submenu */}
                    {isSubmenuOpen(item.label) && (
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
                                className={`flex items-center gap-3 text-sm open_sans_font relative w-full group transition-all duration-300 ${
                                  isCollapsed 
                                    ? "justify-center px-2 py-1.5" 
                                    : "text-left px-4 py-2"
                                } ${isActive 
                                  ? `text-white ${isCollapsed && "border-l-2 border-orange-500 pl-[6px]"}` 
                                  : `text-zinc-200 hover:text-white ${isCollapsed && "hover:border-l-2 hover:border-white hover:pl-[6px]"}`
                                }`}
                              >
                                {/* Expanded view with tree branch */}
                                {!isCollapsed && (
                                  <div className="relative flex items-center gap-3">
                                    <div className="relative w-4 h-5 flex items-center">
                                      <div className={`absolute left-0 top-1/2 w-4 h-px ${isActive ? "bg-orange-500" : "bg-zinc-600 group-hover:bg-zinc-400"} transition-colors`}></div>
                                      <div className={`absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isActive ? "bg-orange-500" : "bg-zinc-600 group-hover:bg-zinc-400"} transition-colors`}></div>
                                    </div>
                                    
                                    <subItem.icon
                                      size={18}
                                      className={`cursor-pointer transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
                                    />
                                    
                                    {subItem.label === "Messenger" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 left-10 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.label === "Activity Monitor" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 left-10 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.label === "Tickets" && subItem.notificationCount > 0 && (
                                      <span className="absolute -top-1 left-10 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
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
                                    {subItem.label === "Messenger" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.label === "Activity Monitor" && unreadMessages > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {unreadMessages}
                                      </span>
                                    )}
                                    {subItem.label === "Tickets" && subItem.notificationCount > 0 && (
                                      <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[8px] px-1 py-0.5 rounded-full z-10 min-w-[14px] text-center">
                                        {subItem.notificationCount}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {!isCollapsed && <span className="transition-colors">{subItem.label}</span>}
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
                        ? `text-white border-l-2 border-orange-500 ${isCollapsed ? "pl-[14px]" : "pl-3"}`
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

                  {/* Divider after Analytics */}
                  {item.label === "Analytics" && <hr className="border-zinc-700 my-2" />}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={redirectToHome}
            className={`flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full ${
              isCollapsed ? "justify-center hover:border-l-2 hover:border-white hover:pl-[14px]" : "text-left hover:border-l-2 hover:border-white hover:pl-3"
            } transition-all duration-300`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
