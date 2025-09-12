/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHelpCenter } from "react-icons/md";
import { FaPeopleLine } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";

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
} from "lucide-react";
import { RiContractLine, RiStockFill } from "react-icons/ri";
import { CiMonitor } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";

import { IoIosPeople } from "react-icons/io";

import { TbBrandGoogleAnalytics } from "react-icons/tb";

import { BadgeDollarSign } from 'lucide-react';
import { CgGym } from "react-icons/cg";

import { MdOutlineLeaderboard } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "it", name: "Italian" },
  ];

  // Replace with real data
  const studioName = "Studio One";
  const fullName = "Samantha";
  const role = "Trainer";

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setIsLanguageDropdownOpen(false);
    // Here you would typically implement the language change logic
    console.log("Language selected:", language);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false); // lg breakpoint
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
  const handlePrivacyPolicy = () => {
    setIsDropdownOpen(false);
    window.location.href = "/";
  };
  const handleTermsOfUse = () => {
    setIsDropdownOpen(false);
    window.location.href = "/";
  };
  const handleChangelog = () => {
    setIsDropdownOpen(false);
    window.location.href = "/";
  };
  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  const menuItems = [
    { icon: Home, label: "My Area", to: "/dashboard/my-area" },
    {
      icon: CiMonitor
      , label: "Activity Monitor", to: "/dashboard/activity-monitor"
    },
    { icon: Calendar, label: "Appointments", to: "/dashboard/appointments" },
    { icon: MessageCircle, label: "Communication", to: "/dashboard/communication" },
    { icon: CheckSquare, label: "To-Do", to: "/dashboard/to-do" },
    { icon: Users, label: "Members", to: "/dashboard/members" },
    { icon: FaUsers, label: "Staff", to: "/dashboard/staff" },
    { icon: FaPeopleLine, label: "Leads", to: "/dashboard/leads" },
    { icon: RiContractLine, label: "Contracts", to: "/dashboard/contract" },
    { icon: CheckSquare, label: "Marketing", to: "/dashboard/marketing" },
    { icon: ShoppingCart, label: "Selling", to: "/dashboard/selling" },
    { icon: FaCartPlus, label: "Marketplace", to: "/dashboard/market-place" },

    { icon: BadgeDollarSign, label: "Finances", to: "/dashboard/finances" },
    {
      icon: CgGym
      , label: "Training", to: "/dashboard/training"
    },

    {
      icon: TbBrandGoogleAnalytics
      , label: "Analytics", to: "/dashboard/analytics"
    },  
    {
      icon: MdOutlineHelpCenter
      , label: "Help Center", to: "/dashboard/help-center"
    },
    { icon: Settings, label: "Configuration", to: "/dashboard/configuration" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-[#111111] p-4 flex items-center justify-between lg:hidden z-40">
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
        <div className="flex gap-1 items-center">
          {/* Language Selection */}
          <div className="relative mr-2">
            <button
              onClick={toggleLanguageDropdown}
              className="p-2 rounded-lg text-white hover:bg-zinc-700 flex items-center gap-1"
              aria-label="Language Selection"
            >
              <Globe size={20} />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-12 w-32 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
                <div className="py-2" role="menu">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 ${
                        selectedLanguage === language.name ? "text-white bg-zinc-600" : "text-zinc-300"
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/girl.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-5 top-13 w-40 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div className="py-2" role="menu">
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Edit Profile
                </button>
                <hr className="border-zinc-600 my-1" />
                <button
                  onClick={handlePrivacyPolicy}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={handleTermsOfUse}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Terms of Use
                </button>
                <button
                  onClick={handleChangelog}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                >
                  Changelog
                </button>
                <hr className="border-zinc-600 my-1" />
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

      <aside
         className={`
          fixed top-0 left-0 z-50 h-screen bg-[#111111] transition-all duration-500 overflow-hidden 
          lg:relative lg:block
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-56 w-56"}
        `}
      >
        {/* Collapse Toggle */}
        <div className="hidden lg:block absolute right-0 top-20 bg-[#222222] rounded-full p-2 cursor-pointer z-50"
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
          <div className="p-4 hidden lg:block">
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
                <div className="absolute right-8 top-30 w-40 bg-[#222222]/40 backdrop-blur-3xl rounded-lg shadow-lg z-50">
                  <div className="py-2" role="menu">
                    <button
                      onClick={handleEditProfile}
                      className="block w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-zinc-700 text-left"
                    >
                      Edit Profile
                    </button>
                    <hr className="border-zinc-600 my-1" />
                    <button
                      onClick={handlePrivacyPolicy}
                      className="block w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-zinc-700 text-left"
                    >
                      Privacy Policy
                    </button>
                    <button
                      onClick={handleTermsOfUse}
                      className="block w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-zinc-700 text-left"
                    >
                      Terms of Use
                    </button>
                    <button
                      onClick={handleChangelog}
                      className="block w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-zinc-700 text-left"
                    >
                      Changelog
                    </button>
                    <hr className="border-zinc-600 my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-zinc-700 text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

{!isCollapsed && (
  <div className="flex flex-col gap-0.5 text-center">
    <p className="text-md  open_sans_font_700 text-white">{studioName}</p>
    <h2 className="font-bold text-white flex items-center justify-center gap-1">
  {fullName}
  <span className="font-bold text-zinc-400">•</span>
  <span className="text-zinc-400">{role}</span>
</h2>
  </div>
)}
            </div>
          </div>

          {/* Navigation Menu */}
<nav className="flex-1 overflow-y-auto custom-scrollbar">
  <ul className="space-y-2 p-4">
    {menuItems.slice(0, menuItems.findIndex(item => item.label === "Analytics") + 1).map((item) => (
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
          <div className="relative">
            <item.icon
              size={24}
              className={`cursor-pointer ${location.pathname === item.to ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
            />
            {item.label === "Communication" && unreadMessages > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                {unreadMessages}
              </span>
            )}
          </div>
          {!isCollapsed && <span>{item.label}</span>}
        </button>
      </li>
    ))}

    {/* Divider */}
    <li>
      <hr className="border-t border-zinc-700 my-3" />
    </li>

    {menuItems.slice(menuItems.findIndex(item => item.label === "Help Center")).map((item) => (
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
          <div className="relative">
            <item.icon
              size={24}
              className={`cursor-pointer ${location.pathname === item.to ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
            />
          </div>
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
    </>
  );
};

export default Sidebar;