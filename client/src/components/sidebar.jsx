/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";

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
} from "lucide-react";
import { RiContractLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Bell } from "lucide-react";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (to) => {
    navigate(to);
    setIsSidebarOpen(false);
  };

  const redirectToHome = () => {
    window.location.href = "/";
  };
  const redirect = () => {
    window.location.href = "/dashboard/edit-profile";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    window.location.href = "/dashboard/edit-profile";
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
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
            <img
              src="/girl.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-5 top-8 w-36 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div
                className="py-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                  role="menuitem"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 z-50 w-64 h-screen bg-[#111111] transition-transform duration-500 overflow-y-auto ease-in-out md:relative md:translate-x-0 flex flex-col`}
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

        <div className="flex flex-col h-full overflow-y-auto mt-5">
          <div className="p-4 hidden md:block">
            <div className="flex flex-col text-center justify-center items-center gap-3">
              <div className="relative cursor-pointer" >
                <img
                onClick={toggleDropdown}
                  src="/girl.png"
                  alt="Profile"
                  className="rounded-2xl h-full w-full"
                />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-800 rounded-full"></span>
              </div>

              {isDropdownOpen && (
            <div className="absolute right-14 top-34 w-36 bg-[#222222]/40 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div
                className="py-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                  role="menuitem"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

              <div className="flex flex-col gap-0.5">
                <h2 className="open_sans_font_700 text-white">Samantha</h2>
                <p className="text-sm open_sans_font text-zinc-400">
                  Administrator
                </p>
                {/* <p className="text-xs open_sans_font text-zinc-400">samantha@gmail.com</p> */}
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto  ">
            <ul className="space-y-2 p-4">
              {[
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
                },
                { icon: CheckSquare, label: "To-Do", to: "/dashboard/to-do" },
                { icon: Users, label: "Members", to: "/dashboard/members" },
                { icon: Users, label: "Staff", to: "/dashboard/staff" },
                {
                  icon: RiContractLine,
                  label: "Contract",
                  to: "/dashboard/contract",
                },
                {
                  icon: CheckSquare,
                  label: "Marketing",
                  to: "/dashboard/marketing",
                },
                {
                  icon: MdOutlineLeaderboard,
                  label: "Leads",
                  to: "/dashboard/leads",
                },
                {
                  icon: ShoppingCart,
                  label: "Selling",
                  to: "/dashboard/selling",
                },
                {
                  icon: Settings,
                  label: "Configuration",
                  to: "/dashboard/configuration",
                },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item.to)}
                    className={`flex items-center gap-3 cursor-pointer text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full text-left
                    group transition-all duration-300 
                    ${
                      location.pathname === item.to
                        ? "text-white  border-l-2 border-white pl-3"
                        : "hover:text-white hover:border-l-2 hover:border-white hover:pl-3"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`
                      ${
                        location.pathname === item.to
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    />
                    <span className="text-md">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <button
              onClick={redirectToHome}
              className="flex items-center cursor-pointer gap-3 open_sans_font px-4 py-2 text-zinc-400 hover:text-white hover:border-l-2 hover:border-white hover:pl-3 transition-all duration-300 w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

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
            isRightSidebarOpen
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
              <h3 className=" mb-2 text-white oxanium_font">{notification.heading}</h3>
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

export default Sidebar;
