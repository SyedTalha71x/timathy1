/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import MemberDashboardHeader from "./components/MemberDashboardHeader";

const MemberDashboardLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  // Scroll main content to top on route change
useEffect(() => {
  if (mainRef.current) {
    mainRef.current.scrollTop = 0
  }
}, [location.pathname])

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleLeftSidebarCollapse = useCallback(() => setIsLeftSidebarCollapsed((prev) => !prev), []);

  // Communication page needs no main scroll — chat handles its own scroll
  const isCommunicationPage = location.pathname.includes("/communication");

  return (
    <div className="member-root bg-surface-dark h-dvh overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebarCollapse}
        />

        {/* Main Content Area */}
        <main
          ref={mainRef}
         className={`flex-1 md:h-dvh h-[calc(100dvh-3.5rem)] 
  lg:pt-0 md:pt-14 sm:pt-14 pt-14
  p-2
  transition-all duration-500 ease-in-out
  ${isCommunicationPage ? "overflow-hidden pb-0" : "overflow-y-auto pb-10"}`}
        >
          {/* Header - handles sidebar open/close/collapse */}
          <MemberDashboardHeader
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            isLeftSidebarCollapsed={isLeftSidebarCollapsed}
            toggleLeftSidebarCollapse={toggleLeftSidebarCollapse}
          />

          {/* Page Content */}
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MemberDashboardLayout;
