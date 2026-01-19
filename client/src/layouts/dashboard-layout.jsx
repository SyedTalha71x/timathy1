/* eslint-disable no-unused-vars */
import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/DashboardHeader"

/**
 * Dashboard Layout Component
 * 
 * Main layout wrapper for the dashboard.
 * - Manages sidebar open/close state for mobile
 * - Renders DashboardHeader (handles both mobile + desktop header)
 * - Renders Sidebar (pure navigation)
 * - Renders page content via Outlet
 */
const Dashboardlayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="bg-[#111111] min-h-screen">
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar - Navigation only */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

        {/* Main Content Area */}
        <main
          className={`
            flex-1 md:h-screen h-[calc(100vh-4rem)] overflow-y-auto 
            lg:pt-5
            md:pt-16
            sm:pt-16
            pt-16
            pb-10 p-2
          `}
        >
          {/* Header - handles both mobile + desktop views */}
          <DashboardHeader 
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Page Content */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboardlayout
