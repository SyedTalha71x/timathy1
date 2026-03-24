/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from './components/admin-sidebar'
import AdminDashboardHeader from './components/AdminDashboardHeader'

const AdminDashboardLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const toggleLeftSidebarCollapse = useCallback(() => setIsLeftSidebarCollapsed(prev => !prev), [])

  // Scroll main content to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [location.pathname])

  // Pages with their own scroll handling
  const isCommunicationPage = location.pathname.includes("/communication")
  const isConfigurationPage = location.pathname.includes("/configuration")
  const hasOwnScroll = isCommunicationPage || isConfigurationPage

  return (
    <div className="admin-root bg-[#111111] h-dvh overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">

        {/* ========== SIDEBAR ========== */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebarCollapse}
        />

        {/* ========== MAIN CONTENT ========== */}
        <main
          ref={mainRef}
          className={`flex-1 md:h-dvh h-[calc(100dvh-3.5rem)] ${hasOwnScroll ? 'overflow-hidden' : 'overflow-y-auto'}
            lg:!pt-0
            pb-10 p-2
            transition-all duration-500 ease-in-out`}
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 3.5rem)",
          }}
        >
          {/* Header - handles both mobile + desktop views */}
          <AdminDashboardHeader
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

export default AdminDashboardLayout;
