/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { History, Menu } from "lucide-react"
import OrgaGymLogoWihoutText from '../../../../public/OrgaGym Logo.svg'
import ActivityLogModal from './admin-dashboard-header-components/ActivityLogModal'
import LanguageDropdown from '../../LanguageDropdown'
import ProfileDropdown from './admin-dashboard-header-components/ProfileDropdown'

/**
 * AdminDashboardHeader Component
 *
 * Header for admin view — handles sidebar open/close exactly like studio DashboardHeader.
 * Language, Profile, and ActivityLog are separate components in the same folder.
 *
 * Props:
 * - onToggleSidebar: Function to toggle mobile sidebar
 * - isSidebarOpen: Boolean for sidebar state (mobile)
 * - isLeftSidebarCollapsed: Boolean for left sidebar collapsed state (desktop)
 * - toggleLeftSidebarCollapse: Function to toggle left sidebar collapse (desktop)
 */
const AdminDashboardHeader = ({
  onToggleSidebar,
  isSidebarOpen,
  isLeftSidebarCollapsed,
  toggleLeftSidebarCollapse,
}) => {
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false)

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* ===== MOBILE HEADER (lg:hidden) ===== */}
      <div
        className="fixed top-0 left-0 w-full bg-[#111111] border-b border-zinc-800 pb-2 px-2 flex items-center justify-between lg:hidden z-40 select-none"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
      >
        {/* Left: Logo + Hamburger */}
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-md">
            <img draggable="false" src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
          </div>
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-white hover:bg-zinc-700"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right: Activity Log + Language + Profile */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setIsActivityLogModalOpen(true)}
            className="p-2 px-3 rounded-xl text-gray-500 bg-[#1C1C1C] cursor-pointer flex items-center gap-1 hover:text-white transition-colors"
            aria-label="Activity Log"
          >
            <History size={20} />
          </button>
          <LanguageDropdown isMobile />
          <ProfileDropdown isMobile />
        </div>
      </div>

      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden rounded-md bg-[#1f1e1e] z-20 p-2 mb-2 items-center justify-between select-none sticky top-0">
        {/* Left: Collapse Toggle + Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLeftSidebarCollapse}
            className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] cursor-pointer hover:text-white transition-colors"
            aria-label="Toggle Sidebar Collapse"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-semibold text-white text-md leading-tight">Admin Panel</h2>
        </div>

        {/* Right: Activity Log + Language + Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActivityLogModalOpen(true)}
            className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] cursor-pointer flex items-center gap-1 hover:text-white transition-colors"
            aria-label="Activity Log"
          >
            <History size={20} />
          </button>
          <LanguageDropdown />
          <ProfileDropdown />
        </div>
      </div>

      {/* ===== ACTIVITY LOG MODAL ===== */}
      <ActivityLogModal
        isOpen={isActivityLogModalOpen}
        onClose={() => setIsActivityLogModalOpen(false)}
      />
    </>
  )
}

export default AdminDashboardHeader
