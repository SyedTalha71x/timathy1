"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ClipboardList, X, ChevronRight } from "lucide-react"
import { FaCartPlus, FaPeopleLine, FaUsers } from "react-icons/fa6"
import { RiContractLine } from "react-icons/ri"
import { CgGym } from "react-icons/cg"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { MdOutlineHelpCenter } from "react-icons/md"
import {
  Home,
  Calendar,
  MessageCircle,
  CheckSquare,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  Settings,
} from "lucide-react"

const SidebarMenu = ({ showSidebar, setShowSidebar }) => {
  const menuRef = useRef(null)
  const sidebarRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)
  const [isProductivityHubOpen, setIsProductivityHubOpen] = useState(false)
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false)
  const [unreadMessages] = useState(2)

  const toggleCommunication = () => setIsCommunicationOpen(!isCommunicationOpen)
  const toggleProductivityHub = () => setIsProductivityHubOpen(!isProductivityHubOpen)
  const toggleManageMembers = () => setIsManageMembersOpen(!isManageMembersOpen)

  const handleNavigation = (to) => {
    navigate(to)
    setShowSidebar(false)
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
        { label: "Messages", to: "/dashboard/communication" },
        { label: "Bulletin Board", to: "/dashboard/bulletin-board" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Productivity Hub",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Activity Monitor", to: "/dashboard/activity-monitor" },
        { label: "To-Do", to: "/dashboard/to-do" },
        { label: "Notes", to: "/dashboard/notes" },
      ],
    },
    {
      icon: Users,
      label: "Manage Members",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Members", to: "/dashboard/members" },
        { label: "Check In", to: "/dashboard/members-checkin" },
      ],
    },
    { icon: FaUsers, label: "Staff", to: "/dashboard/staff" },
    { icon: FaPeopleLine, label: "Leads", to: "/dashboard/leads" },
    { icon: RiContractLine, label: "Contracts", to: "/dashboard/contract" },
    { icon: CheckSquare, label: "Marketing", to: "/dashboard/marketing" },
    { icon: ShoppingCart, label: "Selling", to: "/dashboard/selling" },
    { icon: FaCartPlus, label: "Marketplace", to: "/dashboard/market-place" },

    { icon: BadgeDollarSign, label: "Finances", to: "/dashboard/finances" },
    {
      icon: CgGym,
      label: "Training",
      to: "/dashboard/training",
    },

    {
      icon: TbBrandGoogleAnalytics,
      label: "Analytics",
      to: "/dashboard/analytics",
    },
    // Divider between Analytics and Help Center
    { type: "divider" },
    {
      icon: MdOutlineHelpCenter,
      label: "Help Center",
      to: "/dashboard/help-center",
    },
    { icon: Settings, label: "Configuration", to: "/dashboard/configuration" },
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowSidebar(false)
      }
    }

    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSidebar, setShowSidebar])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showSidebar])

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-500 ${
          showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSidebar(false)}
      />

      <div
        ref={menuRef}
        className={`fixed left-0 top-0 h-full w-full sm:w-80 bg-[#111111] shadow-xl z-50 transition-transform duration-500 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-2">
          <nav aria-label="Main navigation">
            <ul className="space-y-2 text-sm custom-scrollbar max-h-[83vh] overflow-y-auto list-none m-0 p-0">
              {menuItems.map((item, index) => {
                if (item.type === "divider") {
                  return (
                    <li key={`divider-${index}`} className="my-4 list-none p-0 m-0" role="separator" aria-hidden="true">
                      <hr className="border-zinc-700" />
                    </li>
                  )
                }

                if (item.hasSubmenu) {
                  const isOpen =
                    (item.label === "Communication" && isCommunicationOpen) ||
                    (item.label === "Productivity Hub" && isProductivityHubOpen) ||
                    (item.label === "Manage Members" && isManageMembersOpen)

                  const toggle = () => {
                    if (item.label === "Communication") toggleCommunication()
                    if (item.label === "Productivity Hub") toggleProductivityHub()
                    if (item.label === "Manage Members") toggleManageMembers()
                  }

                  const submenuId = `submenu-${item.label.replace(/\s+/g, "-").toLowerCase()}`
                  return (
                    <li key={item.label} className="list-none m-0 p-0">
                      <button
                        onClick={toggle}
                        aria-expanded={isOpen}
                        aria-controls={submenuId}
                        className={`
                          flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full
                          group transition-all duration-500 
                          ${
                            location.pathname.startsWith(item.to) && item.to !== "#"
                              ? "text-white border-l-2 border-white pl-3"
                              : "hover:text-white hover:border-l-2 hover:border-white hover:pl-3"
                          }
                        `}
                      >
                        <div className="relative">
                          <item.icon
                            size={24}
                            className={`cursor-pointer ${
                              location.pathname.startsWith(item.to) && item.to !== "#"
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
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{item.label}</span>
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                            aria-hidden="true"
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <ul id={submenuId} className="mt-1 space-y-2 list-none m-0 p-0 w-full pl-0 sm:pl-6">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.label} className="list-none m-0 p-0">
                              <button
                                onClick={() => handleNavigation(subItem.to)}
                                className={`
                                  flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full text-left
                                  group transition-all duration-500 
                                  ${
                                    location.pathname === subItem.to
                                      ? "text-white border-l-2 border-white pl-3"
                                      : "hover:text-white hover:border-l-2 hover:border-white hover:pl-3"
                                  }
                                `}
                              >
                                <span className="w-full truncate">{subItem.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                }

                return (
                  <li key={index} className="list-none m-0 p-0">
                    <button
                      onClick={() => handleNavigation(item.to)}
                      className={`
                        flex items-center gap-3 px-4 py-2 text-sm open_sans_font text-zinc-200 relative w-full
                        group transition-all duration-500 
                        ${
                          location.pathname === item.to
                            ? "text-white border-l-2 border-white pl-3"
                            : "hover:text-white hover:border-l-2 hover:border-white hover:pl-3"
                        }
                      `}
                    >
                      <div className="relative">
                        <item.icon
                          size={24}
                          className={`cursor-pointer ${
                            location.pathname === item.to ? "text-white" : "text-zinc-400 group-hover:text-white"
                          }`}
                        />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default SidebarMenu
