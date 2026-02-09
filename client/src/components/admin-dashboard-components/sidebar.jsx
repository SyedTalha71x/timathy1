/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MdOutlineHelpCenter, MdOutlineSupportAgent, MdOutlineLocalActivity } from "react-icons/md"
import { FaNotesMedical } from "react-icons/fa6"
import { FaPersonRays } from "react-icons/fa6"
import { FaCartPlus } from "react-icons/fa"
import { RiContractLine } from "react-icons/ri"
import { RiAccountPinCircleLine } from "react-icons/ri"
import { MdEmail } from "react-icons/md"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { CgGym } from "react-icons/cg"

import {
  Home,
  MessageCircle,
  LogOut,
  Users,
  CheckSquare,
  Settings,
  ChevronRight,
  MessageSquarePlus,
  Lightbulb,
  Bug,
  Star,
  CheckCircle,
  BadgeDollarSign,
} from "lucide-react"

import OrgaGymLogoWihoutText from '../../../public/Orgagym white without text.svg'
import { DUMMY_FEEDBACK } from "../../utils/admin-panel-states/feedback-states"

// ============================================
// Feedback Modal Component (same as main sidebar)
// ============================================
const feedbackTypes = [
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'praise', label: 'Praise', icon: Star },
  { id: 'other', label: 'Other', icon: MessageCircle },
]

const FeedbackModal = ({ 
  isOpen, 
  isSubmitted, 
  feedbackData, 
  onFeedbackDataChange, 
  onSubmit, 
  onClose 
}) => {
  if (!isOpen) return null
  
  // Success State
  if (isSubmitted) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden border border-zinc-700 p-8 text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Thank You!</h2>
          <p className="text-zinc-400">
            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve OrgaGym.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <MessageSquarePlus size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Send Feedback</h2>
              <p className="text-sm text-zinc-400">Help us improve OrgaGym</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <span className="text-zinc-400 hover:text-white text-xl">×</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Feedback Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => onFeedbackDataChange({ ...feedbackData, type: type.id })}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      feedbackData.type === type.id
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <IconComponent size={20} className={`mx-auto mb-1 ${feedbackData.type === type.id ? 'text-orange-500' : ''}`} />
                    <span className="text-xs">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
            <input
              type="text"
              value={feedbackData.subject}
              onChange={(e) => onFeedbackDataChange({ ...feedbackData, subject: e.target.value })}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Brief summary of your feedback"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
            <textarea
              value={feedbackData.message}
              onChange={(e) => onFeedbackDataChange({ ...feedbackData, message: e.target.value })}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Tell us more about your feedback..."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </div>
          
          {/* Rating (optional) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              How would you rate your experience? <span className="text-zinc-500">(optional)</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onFeedbackDataChange({ ...feedbackData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={24} 
                    className={feedbackData.rating >= star ? 'text-orange-500 fill-orange-500' : 'text-zinc-600'} 
                  />
                </button>
              ))}
              {feedbackData.rating > 0 && (
                <button
                  onClick={() => onFeedbackDataChange({ ...feedbackData, rating: 0 })}
                  className="text-xs text-zinc-500 hover:text-zinc-400 ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 p-4 sm:p-5 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!feedbackData.subject.trim() || !feedbackData.message.trim()}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Admin Sidebar Component
 * 
 * Matches the style and architecture of the main dashboard sidebar.
 * Pure navigation sidebar - no header, no modals (except feedback).
 * Header functionality handled by DashboardHeader component.
 * 
 * Props:
 * - isOpen: Boolean for mobile sidebar visibility
 * - onClose: Function to close mobile sidebar
 * - isCollapsed: Boolean for collapsed state (optional, controlled externally)
 * - onToggleCollapse: Function to toggle collapse (optional, controlled externally)
 */
const CustomerSidebar = ({ isOpen = false, onClose, isCollapsed: externalIsCollapsed, onToggleCollapse }) => {
  // Use external state if provided, otherwise use internal state
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed

  // Submenu states
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
      if (e.key === 'Escape') {
        setIsFeedbackModalOpen(false)
        setFeedbackSubmitted(false)
        setFeedbackData({ type: 'suggestion', subject: '', message: '', rating: 0 })
        e.stopImmediatePropagation()
        return
      }
      
      const target = e.target
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      e.stopImmediatePropagation()
      
      if (!isInputField) {
        e.preventDefault()
      }
    }
    
    document.addEventListener('keydown', blockHotkeys, true)
    
    return () => {
      document.removeEventListener('keydown', blockHotkeys, true)
    }
  }, [isFeedbackModalOpen])

  const location = useLocation()
  const navigate = useNavigate()

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

  const redirectToHome = () => (window.location.href = "/")

  // ============================================
  // Menu Items Configuration
  // Icons matched to the main dashboard sidebar
  // ============================================
  const newFeedbackCount = DUMMY_FEEDBACK.filter((fb) => fb.status === "new").length

  const menuItems = [
    { icon: Users, label: "Customers", to: "/admin-dashboard/customers" },
    { icon: RiContractLine, label: "Contract", to: "/admin-dashboard/contract" },
    { icon: FaPersonRays, label: "Leads", to: "/admin-dashboard/leads" },
    { icon: RiAccountPinCircleLine, label: "Demo Access", to: "/admin-dashboard/demo-access" },
    {
      icon: MdOutlineSupportAgent,
      label: "Support Area",
      to: "#",
      hasSubmenu: true,
      hasNotification: newFeedbackCount > 0,
      notificationCount: newFeedbackCount,
      submenu: [
        { label: "Tickets", to: "/admin-dashboard/tickets", icon: MdOutlineLocalActivity },
        { label: "Feedback", to: "/admin-dashboard/feedback", icon: MessageSquarePlus, hasNotification: newFeedbackCount > 0, notificationCount: newFeedbackCount },
      ],
    },
    { icon: MdEmail, label: "Email", to: "/admin-dashboard/email", indicatorCount: 3 },
    { icon: BadgeDollarSign, label: "Finances", to: "/admin-dashboard/finances" },
    { icon: CheckSquare, label: "To-Do", to: "/admin-dashboard/to-do" },
    { icon: FaNotesMedical, label: "Notes", to: "/admin-dashboard/notes" },
    { icon: CgGym, label: "Training", to: "/admin-dashboard/training-management" },
    { icon: FaCartPlus, label: "Marketplace", to: "/admin-dashboard/marketplace" },
    { icon: TbBrandGoogleAnalytics, label: "Analytics", to: "/admin-dashboard/analytics" },
    { icon: Settings, label: "Configuration", to: "/admin-dashboard/configuration" },
  ]

  // Helper function to check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu?.some(subItem => location.pathname === subItem.to)
  }

  // Toggle submenu handlers
  const toggleSubmenu = (label) => {
    switch (label) {
      case "Support Area":
        setIsSupportAreaOpen(!isSupportAreaOpen)
        break
    }
  }

  const isSubmenuOpen = (label) => {
    switch (label) {
      case "Support Area":
        return isSupportAreaOpen
      default:
        return false
    }
  }

  // Feedback handlers
  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedbackData)
    setFeedbackSubmitted(true)
    
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
                <div className="w-full bg-orange-500 flex items-center justify-center p-2">
                  <img src={OrgaGymLogoWihoutText} className="h-auto w-auto max-w-[70%] select-none pointer-events-none" alt="Orgagym Logo" draggable="false" />
                </div>
              ) : (
                <div className="w-full bg-orange-500 flex items-center justify-center p-2.5">
                  <img src="/Orgagym white.svg" className="h-16 w-auto max-w-full select-none pointer-events-none" alt="Orgagym Logo" draggable="false" />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2 px-4 pt-1 pb-4">
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
                          {item.notificationCount > 0 && !isSubmenuOpen(item.label) && (
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
                                      
                                      {subItem.notificationCount > 0 && (
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
                                      {subItem.notificationCount > 0 && (
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
                        {/* Orange indicator with count */}
                        {item.indicatorCount && (
                          <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {item.indicatorCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
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
    </>
  )
}

export default CustomerSidebar
