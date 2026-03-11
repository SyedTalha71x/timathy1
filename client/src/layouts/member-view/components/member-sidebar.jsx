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
  ChevronRight,
  Apple,
  Timer,
  BarChart3,
  Target,
  BookOpen,
  CloudOff,
} from "lucide-react";
import { SiYoutubestudio } from "react-icons/si";
import { CgGym } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../features/auth/authSlice";

const MemberViewSidebar = ({ isOpen = false, onClose, isCollapsed: externalIsCollapsed, onToggleCollapse }) => {
  // Use external collapse state if provided, otherwise internal
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalIsCollapsed(!internalIsCollapsed));

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && onClose) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  const handleNavigation = (to) => {
    navigate(to);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      console.log("Logout successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ============================================
  // Menu Items Configuration
  // ============================================
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
      badgeCount: unreadMessagesCount,
    },
    {
      icon: Calendar,
      label: "Appointments",
      to: "/member-view/appointment",
    },
    {
      icon: Timer,
      label: "Classes",
      to: "/member-view/classes",
    },
    {
      icon: CgGym,
      label: "Training",
      to: "/member-view/training",
    },
    {
      icon: Apple,
      label: "Nutrition",
      to: "/member-view/nutrition",
    },
    {
      icon: Settings,
      label: "Settings",
      to: "/member-view/settings",
    },
  ];

  // Helper: check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu?.some((subItem) => location.pathname === subItem.to);
  };

  // Toggle submenu (currently no submenus)
  const toggleSubmenu = () => {}
  const isSubmenuOpenFn = () => false

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-[50] h-screen bg-[#111111] transition-all duration-500 overflow-hidden 
          lg:relative lg:block
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Close Button */}
          <div className="absolute top-4 right-4 lg:hidden z-10">
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-zinc-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
            <ul className="space-y-2 px-4 pt-1 pb-4">
              {menuItems.map((item) => {
                const hasActiveSubmenu = isSubmenuActive(item.submenu);

                // Items with submenu
                if (item.hasSubmenu) {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
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
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            <ChevronRight
                              size={16}
                              className={`transition-transform ${isSubmenuOpenFn(item.label) ? "rotate-90" : ""}`}
                            />
                          </div>
                        )}
                      </button>

                      {/* Submenu - tree branch style matching studio */}
                      {isSubmenuOpenFn(item.label) && (
                        <ul className={`${isCollapsed ? "ml-0 mt-1 relative" : "ml-3 mt-1 relative"} space-y-0`}>
                          {/* Vertical line connector for expanded */}
                          {!isCollapsed && (
                            <div className="absolute left-2 top-0 bottom-4 w-px bg-zinc-600"></div>
                          )}

                          {/* Vertical line connector for collapsed */}
                          {isCollapsed && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-2 bg-zinc-600"></div>
                          )}

                          {item.submenu.map((subItem, index) => {
                            const isActive = location.pathname === subItem.to;

                            return (
                              <li key={subItem.label} className="relative">
                                {/* Collapsed: connecting line between items */}
                                {isCollapsed && index > 0 && (
                                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-px h-2 bg-zinc-700"></div>
                                )}

                                <button
                                  onClick={() => handleNavigation(subItem.to)}
                                  className={`flex items-center gap-3 text-sm open_sans_font relative w-full group transition-all duration-300 ${
                                    isCollapsed
                                      ? "justify-center px-2 py-1.5"
                                      : "text-left px-4 py-2"
                                  } ${
                                    isActive
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
                                    </div>
                                  )}

                                  {/* Collapsed view */}
                                  {isCollapsed && (
                                    <div className="relative">
                                      <subItem.icon
                                        size={18}
                                        className={`cursor-pointer ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}
                                      />
                                    </div>
                                  )}

                                  {!isCollapsed && <span className="transition-colors">{subItem.label}</span>}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Regular items (no submenu)
                return (
                  <li key={item.label}>
                    {/* Divider before Settings */}
                    {item.label === "Settings" && <hr className="border-zinc-700 my-2" />}

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
                          className={`cursor-pointer ${
                            location.pathname === item.to
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-white"
                          }`}
                        />
                        {/* Badge for Communication */}
                        {item.badgeCount > 0 && (
                          <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                            {item.badgeCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout - at bottom matching studio */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full ${
                isCollapsed
                  ? "justify-center hover:border-l-2 hover:border-white hover:pl-[14px]"
                  : "text-left hover:border-l-2 hover:border-white hover:pl-3"
              } transition-all duration-300`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MemberViewSidebar;
