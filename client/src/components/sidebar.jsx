/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Home,
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  CheckSquare,
} from "lucide-react";
import girl from "../../public/girl.png";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111111] text-white md:hidden hover:bg-zinc-700"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 z-50 w-64 h-screen bg-[#111111] transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg md:hidden"
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>

        <div className="flex mt-[15%]  flex-col h-full">
          <div className="p-4 ">
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

          <nav className="flex-1 p-4 mt-10">
            <ul className="space-y-2">
              {[
                {
                  icon: Home,
                  label: "Dashboard",
                  to: "/dashboard/main-dashboard",
                  active: true,
                },
                { icon: Users, label: "Profile", to: '/dashboard/profile' },
                { icon: Calendar, label: "Appointments", to: '/dashboard/appointments' },
                { icon: Settings, label: "Tools" },
                { icon: CheckSquare, label: "To-Do", to: '/dashboard/to-do'},
                { icon: Users, label: "Members", to: '/dashboard/members' },
                { icon: Users, label: "Staff", to: '/dashboard/staff' },
                { icon: CheckSquare, label: "Marketing", to: '/dashboard/marketing' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-2xl ${
                      item.active
                        ? "bg-[#3F74FF] text-white"
                        : "text-white  hover:bg-[#3F74FF]"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-md">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 ">
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:bg-zinc-700 rounded-lg"
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
