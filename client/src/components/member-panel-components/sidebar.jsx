/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Bell,
  ChevronLeft,
  ChevronRight,
  MenuIcon,
  Utensils,
  ClipboardList,
  BarChart3,
  Target,
  BookOpen,
  CloudOff,
} from "lucide-react";
import { RiContractLine, RiStockFill } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { CgGym } from "react-icons/cg";

const MemberViewSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 2,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleNutrition = () => {
    setIsNutritionOpen(!isNutritionOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleNavigation = (to) => {
    navigate(to);
    setIsSidebarOpen(false);
  };

  const redirectToHome = () => {
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    window.location.href = "/member-view/edit-profile";
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  const menuItems = [
    {
      icon: SiYoutubestudio,
      label: "Studio",
      to: "/member-view/studio-menu",
    },
    {
      icon: MessageCircle,
      label: "Communication",
      to: "/member-view/communication",
      badgeCount: unreadMessagesCount
    },
    {
      icon: Calendar,
      label: "Appointments",
      to: "/member-view/appointment",
    },
    {
      icon: CgGym,
      label: "Training",
      to: "/member-view/training"
    },
    {
      icon: Utensils,
      label: "Nutrition Tracking",
      to: "#",
      hasSubmenu: true,
      submenu: [
        { label: "Food Log", to: "/member-view/food-log", icon: BookOpen },
        { label: "Nutrition Breakdown", to: "/member-view/nutrition-breakdown", icon: BarChart3 },
        { label: "Daily Summary", to: "/member-view/daily-summary", icon: ClipboardList },
        { label: "Goal Settings", to: "/member-view/goal-settings", icon: Target },
        { label: "Notifications & Reminders", to: "/member-view/notifications-remainders", icon: Bell },
        { label: "Offline Mode", to: "/member-view/offline-mode", icon: CloudOff },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      to: "/member-view/settings",
    },
  ];

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="fixed top-0 left-0 w-full bg-[#111111] p-4 flex items-center justify-between md:hidden z-40">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-white hover:bg-zinc-700"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="text-white font-semibold"></span>
        </div>

      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0  left-0 z-[10000000] h-screen bg-[#111111] transition-all duration-500 ease-in-out overflow-hidden 
          md:relative md:block
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64 w-64"}
        `}
      >
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-white hover:bg-zinc-700 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="hidden md:block absolute right-0 top-10 bg-[#222222] rounded-full p-2 cursor-pointer z-50"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-white " />
          ) : (
            <ChevronLeft size={20} className="text-white" />
          )}
        </div>

        {/* Profile Section */}
        <div className="flex flex-col h-full overflow-y-auto mt-5">

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto mt-7 custom-scrollbar">
            <ul className="space-y-2 p-4">
              {menuItems.map((item) => {
                if (item.hasSubmenu) {
                  return (
                    <li key={item.label}>
                      {/* Nutrition Menu */}
                      <button
                        onClick={toggleNutrition}
                        className={`
                          flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full 
                          ${isCollapsed ? "justify-center" : "text-left"}
                          group transition-all duration-500 
                          ${location.pathname.startsWith(item.to) && item.to !== "#"
                            ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
                            : `hover:text-white ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"}`
                          }
                        `}
                      >
                        <div className="relative">
                          <item.icon
                            size={20}
                            className={`
                              cursor-pointer 
                              ${location.pathname.startsWith(item.to) && item.to !== "#"
                                ? "text-white"
                                : "text-zinc-400 group-hover:text-white"
                              }
                            `}
                          />
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-md">{item.label}</span>
                            <ChevronRight
                              size={16}
                              className={`transition-transform ${isNutritionOpen ? "rotate-90" : ""}`}
                            />
                          </div>
                        )}
                      </button>

                      {/* Nutrition Submenu */}
                      {isNutritionOpen && (
                        <ul className={`${isCollapsed ? "ml-0" : "ml-6"} mt-2 relative`}>
                          {/* Only show vertical line when NOT collapsed */}
                          {!isCollapsed && (
                            <span className="absolute left-2 top-0 bottom-0 w-[1px] bg-zinc-600" />
                          )}

                          {item.submenu.map((subItem) => {
                            const isActive = location.pathname === subItem.to;
                            const isDefaultActive = subItem.label === "Food Log" && 
                              !location.pathname.startsWith("/member-view/food-log") &&
                              !location.pathname.startsWith("/member-view/nutrition-breakdown") &&
                              !location.pathname.startsWith("/member-view/daily-summary") &&
                              !location.pathname.startsWith("/member-view/goal-settings") &&
                              !location.pathname.startsWith("/member-view/notifications-remainders") &&
                              !location.pathname.startsWith("/member-view/offline-mode");

                            const showActive = isActive || isDefaultActive;

                            return (
                              <li key={subItem.label} className="relative">
                                <button
                                  onClick={() => handleNavigation(subItem.to)}
                                  className={`
                                    flex items-center gap-3 text-sm px-4 py-2 w-full
                                    open_sans_font transition-all duration-300
                                    ${showActive ? "text-white" : "text-zinc-400 hover:text-white"}
                                    ${isCollapsed ? "justify-center" : ""}
                                  `}
                                >
                                  {/* Collapsed state - show icon with L-shaped indicator */}
                                  {isCollapsed ? (
                                    <div className="relative">
                                      {/* Icon with L-shaped indicator overlay */}
                                      <div className="relative">
                                        <subItem.icon
                                          size={20}
                                          className={`
                                            ${showActive ? "text-white" : "text-zinc-400 hover:text-white"}
                                          `}
                                        />
                                        {/* L-shaped indicator in top-left corner */}
                                        {showActive && (
                                          <div className="absolute -left-1 -top-1 w-2.5 h-2.5">
                                            <div className="absolute left-0 top-0 w-0.5 h-1.5 bg-white rounded-full"></div>
                                            <div className="absolute left-0 top-0 w-1.5 h-0.5 bg-white rounded-full"></div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    /* Expanded state - show blue ball and label */
                                    <>
                                      <span
                                        className={`
                                          absolute left-[3px] w-3 h-3 rounded-full
                                          ${showActive ? "bg-blue-500" : "bg-transparent"}
                                        `}
                                      />
                                      <span className="ml-4 text-left">{subItem.label}</span>
                                    </>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    {/* Add divider before Settings */}
                    {item.label === "Settings" && (
                      <hr className="border-zinc-700 my-2" />
                    )}

                    <button
                      onClick={() => handleNavigation(item.to)}
                      className={`
                        flex items-center gap-3 cursor-pointer text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full
                        ${isCollapsed ? "justify-center" : "text-left"}
                        group transition-all duration-500 
                        ${location.pathname === item.to
                          ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
                          : `hover:text-white ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"}`
                        }
                      `}
                    >
                      <div className="relative">
                        <item.icon
                          size={20}
                          className={`
                            ${location.pathname === item.to
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-white"
                            }
                          `}
                        />
                        {/* Orange badge indicator for Communication */}
                        {item.badgeCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {item.badgeCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span className="text-md">{item.label}</span>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}

              {/* Logout Button */}
              <li className="mt-6">
                <button
                  onClick={redirectToHome}
                  className={`
                    flex items-center cursor-pointer gap-3 open_sans_font px-4 py-2 text-zinc-400 hover:text-white
                    ${isCollapsed ? "justify-center" : "text-left"}
                    ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"} 
                    transition-all duration-300 w-full
                  `}
                >
                  <div className="relative">
                    <LogOut size={20} />
                    {isCollapsed && (
                      <span className="absolute left-full ml-2 whitespace-nowrap bg-[#222222] text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 pointer-events-none">
                        Logout
                      </span>
                    )}
                  </div>
                  {!isCollapsed && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </nav>

        </div>
      </aside>

      {/* Notifications Sidebar */}
      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:hidden block lg:rounded-3xl
          transform ${isRightSidebarOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
          }
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl text-white font-bold oxanium_font">
            Notification
          </h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 text-white rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative transform transition-all duration-200 hover:scale-[1.02]"
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2 text-white oxanium_font">{notification.heading}</h3>
              <p className="text-sm open_sans_font text-zinc-400">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default MemberViewSidebar;