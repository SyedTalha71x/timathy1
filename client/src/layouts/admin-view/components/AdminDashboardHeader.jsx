/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { History } from "lucide-react"
import { useTranslation } from "react-i18next"
import OrgaGymLogoWihoutText from '../../../../public/OrgaGym Logo.svg'
import ActivityLogModal from './admin-dashboard-header-components/ActivityLogModal'
import LanguageDropdown from '../../LanguageDropdown'
import ProfileDropdown from './admin-dashboard-header-components/ProfileDropdown'

/**
 * AdminDashboardHeader Component
 *
 * Header for admin view — mirrors StudioDashboardHeader design.
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
  const { t } = useTranslation()

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
        className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border pb-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none"
        style={{ touchAction: "manipulation", paddingTop: "calc(env(safe-area-inset-top, 0px) + 6px)" }}
      >
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <img draggable="false" src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
          </div>
          <button
            onClick={onToggleSidebar}
            className="p-2 px-3 rounded-xl bg-surface-card text-content-primary"
            aria-label={t("admin.header.toggleSidebar")}
          >
            {isSidebarOpen ? (
              <img draggable="false" key="open" src="/icon.svg" className="theme-icon h-[18px] w-[18px]" alt="Close sidebar" />
            ) : (
              <img draggable="false" key="closed" src='/expand-sidebar mirrored.svg' className="theme-icon h-[18px] w-[18px]" alt="Open sidebar" />
            )}
          </button>
        </div>

        {/* Right: Activity Log + Language + Profile */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setIsActivityLogModalOpen(true)}
            className="p-2 px-3 rounded-xl text-content-muted bg-surface-card cursor-pointer flex items-center gap-1"
            aria-label={t("admin.header.activityLog")}
          >
            <History size={18} />
          </button>
          <LanguageDropdown isMobile />
          <ProfileDropdown isMobile />
        </div>
      </div>

      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden rounded-md justify-between bg-surface-hover z-20 py-1 px-2 mb-2 items-center gap-2 select-none sticky top-0">
        {/* Left: Collapse Toggle */}
        <div className="flex items-center">
          {toggleLeftSidebarCollapse && (
            <div
              onClick={toggleLeftSidebarCollapse}
              className="p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer"
              aria-label={t("admin.header.toggleCollapse")}
            >
              {isLeftSidebarCollapsed ? (
                <img draggable="false" key="collapsed" src='/expand-sidebar mirrored.svg' className="theme-icon h-5 w-5" alt="Open sidebar" />
              ) : (
                <img draggable="false" key="expanded" src="/icon.svg" className="theme-icon h-5 w-5" alt="Close sidebar" />
              )}
            </div>
          )}
        </div>

        {/* Right: Activity Log + Language + Profile */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setIsActivityLogModalOpen(true)}
            className="p-1.5 px-2.5 rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1"
            aria-label={t("admin.header.activityLog")}
          >
            <History size={18} />
          </button>
          <div className="mr-2">
            <LanguageDropdown />
          </div>
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
