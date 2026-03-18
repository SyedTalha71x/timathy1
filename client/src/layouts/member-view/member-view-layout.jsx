/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/member-sidebar";
import MemberDashboardHeader from "./components/MemberDashboardHeader";
import MemberBottomBar from "./components/MemberBottomBar";
import { ToastProvider } from "../../components/shared/SharedToast";

const MemberDashboardLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  // Scroll main content to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const toggleLeftSidebarCollapse = useCallback(
    () => setIsLeftSidebarCollapsed((prev) => !prev),
    []
  );

  return (
    <ToastProvider>
    <div className="member-root bg-surface-dark h-dvh overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Desktop Sidebar — hidden on mobile, bottom bar takes over */}
        <Sidebar
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebarCollapse}
        />

        {/* Main Content Area */}
        <main
          ref={mainRef}
          style={{ overscrollBehavior: "contain" }}
          className="flex-1 md:h-dvh h-[calc(100dvh-3.5rem)] 
            lg:pt-0 md:pt-14 sm:pt-14 pt-14
            p-2 overflow-hidden pb-0
            transition-all duration-500 ease-in-out"
        >
          {/* Header */}
          <MemberDashboardHeader
            isLeftSidebarCollapsed={isLeftSidebarCollapsed}
            toggleLeftSidebarCollapse={toggleLeftSidebarCollapse}
          />

          {/* Page Content */}
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MemberBottomBar unreadMessagesCount={3} />
    </div>
    </ToastProvider>
  );
};

export default MemberDashboardLayout;
