/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Home,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  CheckSquare,
} from "lucide-react";
import girl from "../../public/girl.png";
import { MdOutlinePayment } from "react-icons/md";
import { RiContractLine } from "react-icons/ri";



const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <div className="flex items-center gap-2">
          <img src={girl} alt="Profile" className="w-8 h-8 rounded-full" />
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

        <div className="flex flex-col h-full overflow-hidden mt-8">
          <div className="p-4 hidden md:block">
            <div className="flex flex-col text-center justify-center items-center gap-3">
              <div className="relative">
                <img
                  src={girl}
                  alt="Profile"
                  className="rounded-2xl h-full w-full"
                />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-800 rounded-full"></span>
              </div>
              <div>
                <h2 className="font-semibold text-white">Samantha</h2>
                <p className="text-sm text-zinc-400">samantha@gmail.com</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 p-4">
              {[
                {
                  icon: Home,
                  label: "Dashboard",
                  to: "/dashboard/main-dashboard",
                },
                { icon: Users, label: "Profile", to: "/dashboard/profile" },
                {
                  icon: Calendar,
                  label: "Appointments",
                  to: "/dashboard/appointments",
                },
                { icon: MessageCircle, label: "Messages", to: "/dashboard/messages" },
                { icon: CheckSquare, label: "To-Do", to: "/dashboard/to-do" },
                { icon: Users, label: "Members", to: "/dashboard/members" },
                { icon: Users, label: "Staff", to: "/dashboard/staff" },
                { icon: RiContractLine, label: "Contract", to: "/dashboard/contract" },
                {
                  icon: CheckSquare,
                  label: "Marketing",
                  to: "/dashboard/marketing",
                },
                {
                  icon: MdOutlinePayment,
                  label: "Payment",
                  to: "/dashboard/payment",
                },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 text-sm px-4 py-2 text-zinc-200 relative
                    group transition-all duration-300 
                    ${location.pathname === item.to 
                      ? 'text-white font-bold border-l-2 border-white pl-3' 
                      : 'hover:text-white hover:border-l-2 hover:border-white hover:pl-3'
                    }`}
                  >
                    <item.icon size={20} className={`
                      ${location.pathname === item.to 
                        ? 'text-white' 
                        : 'text-zinc-400 group-hover:text-white'
                      }`} 
                    />
                    <span className="text-md">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white hover:border-l-2 hover:border-white hover:pl-3 transition-all duration-300"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;