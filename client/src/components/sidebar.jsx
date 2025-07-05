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
} from "lucide-react";
import { RiContractLine, RiStockFill } from "react-icons/ri";
import { BadgeDollarSign } from 'lucide-react';

import { MdOutlineLeaderboard } from "react-icons/md";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

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

  // Replace with real data
  const studioName = "Studio One";
  const fullName = "Samantha Johnson";

  const location = useLocation();
  const navigate = useNavigate();

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
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

  const redirectToHome = () => (window.location.href = "/");
  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    window.location.href = "/dashboard/edit-profile";
  };
  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  const menuItems = [
    { icon: Home, label: "My Area", to: "/dashboard/my-area" },
    { icon: Calendar, label: "Appointments", to: "/dashboard/appointments" },
    { icon: MessageCircle, label: "Communication", to: "/dashboard/communication" },
    { icon: CheckSquare, label: "To-Do", to: "/dashboard/to-do" },
    { icon: Users, label: "Members", to: "/dashboard/members" },
    { icon: Users, label: "Staff", to: "/dashboard/staff" },
    { icon: RiContractLine, label: "Contract", to: "/dashboard/contract" },
    { icon: CheckSquare, label: "Marketing", to: "/dashboard/marketing" },
    { icon: MdOutlineLeaderboard, label: "Leads", to: "/dashboard/leads" },
    { icon: ShoppingCart, label: "Selling", to: "/dashboard/selling" },
    { icon: BadgeDollarSign, label: "Finances", to: "/dashboard/finances" },
    { icon: Settings, label: "Configuration", to: "/dashboard/configuration" },
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
        </div>
        <div className="flex gap-2 items-center">
          <div className="mr-1">
            <Bell
              onClick={toggleRightSidebar}
              className="text-white cursor-pointer"
            />
          </div>
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/girl.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-5 top-8 w-36 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div className="py-2" role="menu">
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-[#111111] transition-all duration-500 overflow-hidden 
          md:relative md:block
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64 w-64"}
        `}
      >
        {/* Collapse Toggle */}
        <div className="hidden md:block absolute right-0 top-20 bg-[#222222] rounded-full p-2 cursor-pointer z-50"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-white" />
          ) : (
            <ChevronLeft size={20} className="text-white" />
          )}
        </div>

        {/* Profile Section */}
        <div className="flex flex-col h-full overflow-hidden mt-5">
          <div className="p-4 hidden md:block">
            <div className={`flex ${isCollapsed ? "justify-center" : "flex-col text-center"} items-center gap-3`}>
              <div className="cursor-pointer">
                <img
                  onClick={isCollapsed ? null : toggleDropdown}
                  src="/girl.png"
                  alt="Profile"
                  className={`rounded-2xl ${isCollapsed ? "w-10 h-10" : "h-full w-full"}`}
                />
              </div>

              {isDropdownOpen && !isCollapsed && (
                <div className="absolute right-14 top-34 w-36 bg-[#222222]/40 backdrop-blur-3xl rounded-lg shadow-lg z-50">
                  <div className="py-2" role="menu">
                    <button
                      onClick={handleEditProfile}
                      className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {!isCollapsed && (
                <div className="flex flex-col gap-0.5 text-center">
                  <p className="text-sm open_sans_font text-white">{studioName}</p>
                  <h2 className="open_sans_font_700 text-white">{fullName}</h2>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 p-4">
              {menuItems.map((item) => (
                <li key={item.label}> 
                  <button
                    onClick={() => handleNavigation(item.to)}
                    className={`
                      flex items-center gap-3 text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full
                      ${isCollapsed ? "justify-center" : "text-left"}
                      group transition-all duration-500 
                      ${location.pathname === item.to
                        ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
                        : `hover:text-white ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"}`}
                    `}
                  >
                    <item.icon size={20} className={`${location.pathname === item.to ? "text-white" : "text-zinc-400 group-hover:text-white"}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={redirectToHome}
              className={`
                flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full
                ${isCollapsed ? "justify-center" : "text-left"}
                ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"} 
                transition-all duration-300
              `}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
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
          transform ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl text-white font-bold">Notification</h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 text-white rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative hover:scale-[1.02] transition-all"
            >
              <button
                onClick={() => removeNotification(n.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2 text-white">{n.heading}</h3>
              <p className="text-sm text-zinc-400">{n.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
