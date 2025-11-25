/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MdOutlineHelpCenter, MdOutlineMessage } from "react-icons/md"
import { FaNotesMedical, FaPeopleLine } from "react-icons/fa6"
import { FaCartPlus } from "react-icons/fa"

import {
  Calendar,
  Home,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Users,
  CheckSquare,
  Settings,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Globe,
  ClipboardList,
  Building2,
  History,
} from "lucide-react"
import { HiOutlineUsers } from "react-icons/hi2";
import { IoFitnessOutline } from "react-icons/io5";


import { RiContractLine } from "react-icons/ri"
import { CiMonitor } from "react-icons/ci"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { FaUsers } from "react-icons/fa6"

import { TbBrandGoogleAnalytics } from "react-icons/tb"

import { BadgeDollarSign } from "lucide-react"
import { CgGym } from "react-icons/cg"

import OrgaGymLogoWihoutText from '../../public/Orgagym white without text.svg'

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(2)
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false)
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false)

  const [isProductivityHubOpen, setIsProductivityHubOpen] = useState(false)
  const [isMemberAreaOpen, setIsMemberAreaOpen] = useState(false)
  const [isFitnessHubOpen, setIsFitnessHubOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/1024px-Flag_of_the_United_States.png" },
    { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
    { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
    { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
  ]

  // Sample activity log data
  const activityLogs = [
    {
      id: 1,
      action: "Appointment Created",
      description: "Created new appointment for John Doe - Personal Training",
      timestamp: "2024-12-15 14:30",
      type: "appointment"
    },
    {
      id: 2,
      action: "Member Updated",
      description: "Updated profile information for Sarah Smith",
      timestamp: "2024-12-15 13:15",
      type: "member"
    },
    {
      id: 3,
      action: "Contract Created",
      description: "Created new 12-month contract for Mike Johnson",
      timestamp: "2024-12-15 11:45",
      type: "contract"
    },
    {
      id: 4,
      action: "Appointment Rescheduled",
      description: "Rescheduled yoga class from 3 PM to 4 PM",
      timestamp: "2024-12-15 10:20",
      type: "appointment"
    },
    {
      id: 5,
      action: "Payment Processed",
      description: "Processed monthly payment for Emily Brown",
      timestamp: "2024-12-15 09:30",
      type: "payment"
    },
    {
      id: 6,
      action: "Member Added",
      description: "Added new member: Robert Wilson",
      timestamp: "2024-12-14 16:45",
      type: "member"
    },
    {
      id: 7,
      action: "Class Created",
      description: "Created new HIIT class schedule",
      timestamp: "2024-12-14 15:20",
      type: "class"
    },
    {
      id: 8,
      action: "Contract Renewed",
      description: "Renewed contract for Lisa Garcia",
      timestamp: "2024-12-14 14:10",
      type: "contract"
    }
  ]

  const studioName = "Studio One"
  const fullName = "Samantha Jerry"
  const role = "Trainer"

  const location = useLocation()
  const navigate = useNavigate()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
  const toggleCommunication = () => setIsCommunicationOpen(!isCommunicationOpen)
  const toggleProductivityHub = () => setIsProductivityHubOpen(!isProductivityHubOpen)
  const toggleMemberArea = () => setIsMemberAreaOpen(!isMemberAreaOpen)
  const toggleFitnessHub = () => setIsFitnessHubOpen(!isFitnessHubOpen)

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsLanguageDropdownOpen(false)
    console.log("Language selected:", language)
  }

  const handleActivityLogClick = () => {
    setIsActivityLogModalOpen(true)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [])

  const handleNavigation = (to) => {
    navigate(to)
    setIsSidebarOpen(false)
  }

  const redirectToHome = () => (window.location.href = "/")
  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    window.location.href = "/dashboard/edit-profile"
  }

  const handlePrivacyPolicy = () => {
    setIsDropdownOpen(false)
    setIsPrivacyModalOpen(true)
  }
  const handleTermsOfUse = () => {
    setIsDropdownOpen(false)
    setIsTermsModalOpen(true)
  }
  const handleChangelog = () => {
    setIsDropdownOpen(false)
    setIsChangelogModalOpen(true)
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    window.location.href = "/login"
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'member':
        return '👤'
      case 'contract':
        return '📝'
      case 'payment':
        return '💳'
      case 'class':
        return '🏋️'
      default:
        return '📋'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'border-blue-500'
      case 'member':
        return 'border-green-500'
      case 'contract':
        return 'border-purple-500'
      case 'payment':
        return 'border-yellow-500'
      case 'class':
        return 'border-orange-500'
      default:
        return 'border-gray-500'
    }
  }


  const menuItems = [
    { icon: Home, label: "My Area", to: "/dashboard/my-area" },
    {
      icon: Calendar,
      label: "Appointments",
      to: "/dashboard/appointments",
    },
    {
      icon: MessageCircle,
      label: "Communication",
      to: "/dashboard/communication",
      hasSubmenu: true,
      submenu: [
        {
          label: "Messenger", to: "/dashboard/communication", icon: MdOutlineMessage
        },
        { label: "Bulletin Board", to: "/dashboard/bulletin-board", icon: ClipboardList },
      ],
    },
    {
      icon: ClipboardList,
      label: "Productivity Hub",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Activity Monitor", to: "/dashboard/activity-monitor", icon: CiMonitor },
        { label: "To-Do", to: "/dashboard/to-do", icon: CheckSquare },
        { label: "Notes", to: "/dashboard/notes", icon: FaNotesMedical },
      ],
    },
    {
      icon: Users, label: "Member Area", to: "#", hasSubmenu: true,
      submenu: [
        { label: "Members", to: "/dashboard/members", icon: HiOutlineUsers },
        { label: "Check In", to: "/dashboard/members-checkin", icon: IoIosCheckmarkCircleOutline },
        { label: "Contracts", to: "/dashboard/contract", icon: RiContractLine },
      ],
    },
    { icon: FaUsers, label: "Staff", to: "/dashboard/staff" },
    { icon: FaPeopleLine, label: "Leads", to: "/dashboard/leads" },
    { icon: CheckSquare, label: "Marketing", to: "/dashboard/marketing" },
    { icon: ShoppingCart, label: "Selling", to: "/dashboard/selling" },
    { icon: FaCartPlus, label: "Marketplace", to: "/dashboard/market-place" },

    { icon: BadgeDollarSign, label: "Finances", to: "/dashboard/finances" },
    {
      icon: IoFitnessOutline,
      label: "Fitness Hub",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Training", to: "/dashboard/training", icon: CgGym },
        { label: "Assessment", to: "/dashboard/assessment", icon: CheckSquare },
      ],
    },

    {
      icon: TbBrandGoogleAnalytics,
      label: "Analytics",
      to: "/dashboard/analytics",
    },
    {
      icon: MdOutlineHelpCenter,
      label: "Help Center",
      to: "/dashboard/help-center",
    },
    { icon: Settings, label: "Configuration", to: "/dashboard/configuration" },
  ]

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] md:p-4 p-2">
        <div className="bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
              <X size={20} className="text-white" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-[#111111] border-b border-zinc-800 p-2 flex items-center justify-between lg:hidden z-40">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-md">
            <img src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-white hover:bg-zinc-700"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex gap-1 items-center">
          {/* Activity Log Icon for Mobile */}
          <button
            onClick={handleActivityLogClick}
            className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] cursor-pointer flex items-center gap-1"
            aria-label="Activity Log"
          >
            <History size={18} />
          </button>

          <div className="relative mr-1">
            <button
              onClick={toggleLanguageDropdown}
              className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] cursor-pointer flex items-center gap-1"
              aria-label="Language Selection"
            >
              <Globe size={18} />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-10 w-36 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
                <div className="py-1" role="menu">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className={`w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-700 flex items-center gap-2 ${selectedLanguage === language.name ? "text-white bg-zinc-600" : "text-zinc-300"}`}
                    >
                      <img src={language.flag} className="h-5 rounded-sm w-6" />
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
            <img src="/gray-avatar-fotor-20250912192528.png" alt="Profile" className="w-7 h-7 rounded-md" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-3 top-11 w-40 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div className="p-1.5">
                <div className="flex flex-col">
                  {/* Trainer Name and Role */}
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-white text-xs leading-tight">{fullName}</h2>
                  </div>

                  {/* Studio Name */}
                  <div className="flex items-center mt-2 gap-1 bg-black py-1 px-2 rounded w-fit">
                    <Building2 size={12} className="text-white" />
                    <p className="text-xs font-medium text-white">{studioName}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1" role="menu">
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-3 py-1.5 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Edit Profile
                </button>
                <hr className="border-zinc-600 my-1" />
                <button
                  onClick={handlePrivacyPolicy}
                  className="block w-full px-3 py-1.5 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={handleTermsOfUse}
                  className="block w-full px-3 py-1.5 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={handleChangelog}
                  className="block w-full px-3 py-1.5 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Changelog
                </button>
                <hr className="border-zinc-600 my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-1.5 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside
        className={`
    fixed top-0 left-0 z-50 h-screen   bg-[#111111] transition-all duration-500 overflow-hidden 
    lg:relative lg:block
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}
  `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <div className="hidden lg:block">
            <div className={`flex ${isCollapsed ? "justify-center" : "justify-center"} items-center w-full`}>
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

          {/* Profile Section with Collapse Button */}
          <div className="p-4 hidden lg:block relative">
            <div
              className={`flex ${isCollapsed ? "justify-center" : "items-center"
                } gap-4`}
            >
              {/* Collapse Button */}
              {!isCollapsed && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-[#222222] rounded-full p-2 cursor-pointer z-50">
                  <ChevronLeft size={20} className="text-white" onClick={toggleCollapse} />
                </div>
              )}


              {/* Right arrow if collapsed */}
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
                if (item.hasSubmenu) {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => {
                          if (item.label === "Communication") toggleCommunication();
                          if (item.label === "Member Area") toggleMemberArea();
                          if (item.label === "Productivity Hub") toggleProductivityHub();
                          if (item.label === "Fitness Hub") toggleFitnessHub();
                        }}
                        className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full ${isCollapsed ? "justify-center" : "text-left"
                          } group transition-all duration-500 ${location.pathname.startsWith(item.to) && item.to !== "#"
                            ? `text-white ${!isCollapsed &&
                            "border-l-2 border-white pl-3"
                            }`
                            : `hover:text-white ${!isCollapsed &&
                            "hover:border-l-2 hover:border-white hover:pl-3"
                            }`
                          }`}
                      >
                        <div className="relative">
                          <item.icon
                            size={24}
                            className={`cursor-pointer ${location.pathname.startsWith(item.to) && item.to !== "#"
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-white"
                              }`}
                          />
                          {item.label === "Communication" && unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                              {unreadMessages}
                            </span>
                          )}
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            <ChevronRight
                              size={16}
                              className={`transition-transform ${(item.label === "Communication" && isCommunicationOpen) ||
                                (item.label === "Member Area" && isMemberAreaOpen) ||
                                (item.label === "Productivity Hub" && isProductivityHubOpen) ||
                                (item.label === "Fitness Hub" && isFitnessHubOpen)
                                ? "rotate-90"
                                : ""
                                }`}
                            />
                          </div>
                        )}
                      </button>

                      {/* Submenu */}
                      {((item.label === "Communication" && isCommunicationOpen) ||
                        (item.label === "Member Area" && isMemberAreaOpen) ||
                        (item.label === "Productivity Hub" && isProductivityHubOpen) ||
                        (item.label === "Fitness Hub" && isFitnessHubOpen)) && (
                          <ul className={`${isCollapsed ? 'ml-0' : 'ml-2'} mt-1 space-y-2`}>
                            {item.submenu.map((subItem) => (
                              <li key={subItem.label}>
                                <button
                                  onClick={() => handleNavigation(subItem.to)}
                                  className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full group transition-all duration-500 ${isCollapsed ? "justify-center" : "text-left"
                                    } ${location.pathname === subItem.to
                                      ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
                                      : `hover:text-white ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"}`
                                    }`}
                                >
                                  <div className="relative flex items-center gap-3">
                                    {/* L-shaped indicator */}
                                    <div className="relative">
                                      <div className={`w-4 h-4 flex items-center justify-center ${location.pathname === subItem.to ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>
                                        <div className={`absolute left-0 top-0 w-0.5 h-2.5 ${location.pathname === subItem.to ? "bg-white" : "bg-zinc-400 group-hover:bg-white"} rounded-full`}></div>
                                        <div className={`absolute left-0 top-0 w-2.5 h-0.5 ${location.pathname === subItem.to ? "bg-white" : "bg-zinc-400 group-hover:bg-white"} rounded-full`}></div>
                                      </div>
                                    </div>
                                    <subItem.icon
                                      size={20}
                                      className={`cursor-pointer ${location.pathname === subItem.to
                                        ? "text-white"
                                        : "text-zinc-400 group-hover:text-white"
                                        }`}
                                    />
                                    {subItem.label === "Messenger" && (
                                      <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                        {unreadMessages}
                                      </span>
                                    )}
                                  </div>
                                  {!isCollapsed && <span>{subItem.label}</span>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <button
                      onClick={() => handleNavigation(item.to)}
                      className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full ${isCollapsed ? "justify-center" : "text-left"
                        } group transition-all duration-500 ${location.pathname === item.to
                          ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
                          : `hover:text-white ${!isCollapsed &&
                          "hover:border-l-2 hover:border-white hover:pl-3"
                          }`
                        }`}
                    >
                      <div className="relative">
                        <item.icon
                          size={24}
                          className={`cursor-pointer ${location.pathname === item.to
                            ? "text-white"
                            : "text-zinc-400 group-hover:text-white"
                            }`}
                        />
                      </div>
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>

                    {/* Divider after Analytics */}
                    {item.label === "Analytics" && (
                      <hr className="border-zinc-700 my-2" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <button
              onClick={redirectToHome}
              className={`flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full ${isCollapsed ? "justify-center" : "text-left"
                } ${!isCollapsed &&
                "hover:border-l-2 hover:border-white hover:pl-3"
                } transition-all duration-300`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Activity Log Modal */}
      <Modal isOpen={isActivityLogModalOpen} onClose={() => setIsActivityLogModalOpen(false)} title="Activity Log">
        <div className="text-zinc-300">
          <div className="mb-4 md:mb-6">
            <p className="text-zinc-400 mb-3 md:mb-4 text-sm md:text-base px-2 md:px-0 text-center md:text-left">
              Recent activities and actions performed on the platform
            </p>

            <div className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto px-1">
              {activityLogs.map((activity) => (
                <div
                  key={activity.id}
                  className={`border-l-4 ${getActivityColor(activity.type)} pl-3 md:pl-4 py-2 md:py-3 bg-[#222222] rounded-r-lg mx-1 md:mx-0`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-base md:text-lg mt-0.5 flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex overflow */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                        <h4 className="font-semibold text-white text-sm md:text-base truncate">
                          {activity.action}
                        </h4>
                        <span className="text-xs text-zinc-400 bg-[#2a2a2a] px-2 py-1 rounded flex-shrink-0">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-zinc-300 mt-1 break-words">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-0 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-zinc-700">
            <p className="text-xs md:text-sm text-zinc-400 text-center sm:text-left order-2 sm:order-1">
              Showing {activityLogs.length} recent activities
            </p>
            <button className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm w-full sm:w-auto order-1 sm:order-2">
              Load More
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} title="Terms & Conditions">
        <div className="text-zinc-300 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="leading-relaxed">
              By accessing and using this fitness studio management platform, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Use License</h3>
            <p className="leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials on Studio One's platform for
              personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the platform</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">3. Disclaimer</h3>
            <p className="leading-relaxed">
              The materials on Studio One's platform are provided on an 'as is' basis. Studio One makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">4. Limitations</h3>
            <p className="leading-relaxed">
              In no event shall Studio One or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on Studio One's platform, even if Studio One or a Studio One authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">5. Privacy Policy</h3>
            <p className="leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
              information when you use our service. By using our service, you agree to the collection and use of
              information in accordance with our Privacy Policy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">6. Governing Law</h3>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
              submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="text-zinc-300 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
            <p className="leading-relaxed mb-3">
              We collect information you provide directly to us, such as when you create an account, update your
              profile, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Profile information and preferences</li>
              <li>Fitness goals and health information</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Personalize your experience</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Information Sharing</h3>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share your information with trusted third parties who
              assist us in operating our platform, conducting our business, or serving our users.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet or
              electronic storage is 100% secure.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@studioone.com or through
              our support channels.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChangelogModalOpen} onClose={() => setIsChangelogModalOpen(false)} title="Changelog">
        <div className="text-zinc-300 space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-white">Version 2.1.0</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Latest</span>
            </div>
            <p className="text-sm text-zinc-400 mb-3">Released on December 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🎉 New Features</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced member analytics dashboard</li>
                  <li>Real-time class capacity tracking</li>
                  <li>Automated membership renewal notifications</li>
                  <li>Mobile app push notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Faster loading times for member profiles</li>
                  <li>Improved search functionality</li>
                  <li>Better mobile responsiveness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed calendar sync issues</li>
                  <li>Resolved payment processing errors</li>
                  <li>Fixed member check-in duplicates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 2.0.5</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on November 28, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced security measures</li>
                  <li>Improved data backup system</li>
                  <li>Updated user interface elements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed trainer schedule conflicts</li>
                  <li>Resolved email notification delays</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 2.0.0</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on October 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🎉 Major Release</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Complete UI/UX redesign</li>
                  <li>New member management system</li>
                  <li>Advanced reporting and analytics</li>
                  <li>Integration with popular fitness apps</li>
                  <li>Multi-language support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Performance</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>50% faster page load times</li>
                  <li>Improved database optimization</li>
                  <li>Enhanced mobile performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 1.9.2</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on September 20, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Critical Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed critical security vulnerability</li>
                  <li>Resolved data synchronization issues</li>
                  <li>Fixed membership expiration notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Sidebar