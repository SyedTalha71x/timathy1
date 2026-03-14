/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Sun, Moon } from "lucide-react"
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png'
import LanguageDropdown from '../../LanguageDropdown'

/**
 * MemberDashboardHeader Component
 * 
 * Header for member view — handles sidebar open/close exactly like studio DashboardHeader.
 * Contains: Sidebar toggle (mobile + desktop), Studio logo & name (from Redux), Language dropdown, Theme toggle.
 * 
 * Studio data (name, logo) is pulled directly from Redux (state.studios.studio) — no props needed.
 * 
 * Props:
 * - onToggleSidebar: Function to toggle mobile sidebar
 * - isSidebarOpen: Boolean for sidebar state (mobile) — controls overlay + icon
 * - isLeftSidebarCollapsed: Boolean for left sidebar collapsed state (desktop)
 * - toggleLeftSidebarCollapse: Function to toggle left sidebar collapse (desktop)
 */
const MemberDashboardHeader = ({ 
  onToggleSidebar,
  isSidebarOpen,
  isLeftSidebarCollapsed,
  toggleLeftSidebarCollapse,
}) => {
  // Redux — studio data from backend
  const { studio } = useSelector((state) => state.studios)
  const studioName = studio?.studioName || "Studio"
  const studioLogo = studio?.logo?.url || studio?.logo || null

  // Theme state - defaults to dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved ? saved === 'dark' : true
    if (!dark) document.documentElement.classList.add('light')
    return dark
  })

  // ============================================
  // Theme Toggle Effect
  // ============================================
  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // ============================================
  // Handlers
  // ============================================
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // ============================================
  // Sub-Components
  // ============================================
  const ThemeToggle = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${
        isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
      }`}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun size={18} className="text-content-muted" />
      ) : (
        <Moon size={18} className="text-content-muted" />
      )}
    </button>
  )

  const StudioBadge = ({ isMobile = false }) => (
    <div className={`flex items-center gap-2 ${isMobile ? "bg-surface-dark px-2 py-1.5 rounded-xl" : "bg-surface-dark gap-1 p-1.5 px-2.5 rounded-xl"}`}>
      <img 
        draggable="false"
        src={studioLogo || DefaultAvatar} 
        alt={studioName}
        className={`${isMobile ? "w-6 h-6" : "w-6 h-6"} rounded-lg object-cover`}
        onError={(e) => {
          e.target.src = DefaultAvatar
        }}
      />
      <p className={`font-bold text-content-primary truncate ${isMobile ? "text-xs max-w-[120px]" : "text-sm max-w-[180px]"}`}>
        {studioName}
      </p>
    </div>
  )

  // ============================================
  // Render
  // ============================================
  return (
    <>
      {/* ===== MOBILE OVERLAY - MUST be outside header for proper z-index stacking ===== */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onToggleSidebar} 
        />
      )}

      {/* ===== MOBILE HEADER (lg:hidden) ===== */}
      <div className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border py-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.375rem)' }}>
        {/* Left - Sidebar Toggle + Studio */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 px-3 rounded-xl bg-surface-card text-content-primary"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <img draggable="false" key="open" src="/icon.svg" className="theme-icon h-[18px] w-[18px]" alt="Close sidebar" />
            ) : (
              <img draggable="false" key="closed" src="/expand-sidebar mirrored.svg" className="theme-icon h-[18px] w-[18px]" alt="Open sidebar" />
            )}
          </button>
          <StudioBadge isMobile={true} />
        </div>
        
        {/* Right - Controls */}
        <div className="flex gap-1 items-center">
          <ThemeToggle isMobile={true} />
          <LanguageDropdown isMobile={true} />
        </div>
      </div>
      
      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden rounded-md justify-between bg-surface-hover z-20 py-1 px-2 mb-2 items-center gap-2 select-none sticky top-0">
        {/* Left - Collapse Toggle + Studio Info */}
        <div className="flex items-center gap-2">
          {toggleLeftSidebarCollapse && (
            <div
              onClick={toggleLeftSidebarCollapse}
              className="p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer"
            >
              {isLeftSidebarCollapsed ? (
                <img draggable="false" key="collapsed" src="/expand-sidebar mirrored.svg" className="theme-icon h-5 w-5" alt="Expand sidebar" />
              ) : (
                <img draggable="false" key="expanded" src="/icon.svg" className="theme-icon h-5 w-5" alt="Collapse sidebar" />
              )}
            </div>
          )}
          <StudioBadge isMobile={false} />
        </div>

        {/* Right - Controls */}
        <div className="flex gap-1 items-center">
          <ThemeToggle isMobile={false} />
          <LanguageDropdown isMobile={false} />
        </div>
      </div>
    </>
  )
}

export default MemberDashboardHeader
