/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Sun, Moon, Settings } from "lucide-react"
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png'
import LanguageDropdown from '../../LanguageDropdown'
import { haptic } from "../../../utils/haptic"

/**
 * MemberDashboardHeader Component
 *
 * Header for member view.
 * - Mobile: Studio badge (left), Settings + Theme + Language (right). No hamburger — bottom bar handles nav.
 * - Desktop: Sidebar collapse toggle (left), Studio badge, Settings + Theme + Language (right).
 *
 * Props:
 * - isLeftSidebarCollapsed: Boolean for left sidebar collapsed state (desktop)
 * - toggleLeftSidebarCollapse: Function to toggle left sidebar collapse (desktop)
 */
const MemberDashboardHeader = ({
  isLeftSidebarCollapsed,
  toggleLeftSidebarCollapse,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Redux — studio data from backend
  const { studio } = useSelector((state) => state.studios)
  const studioName = studio?.studioName || "Studio"
  const studioLogo = studio?.logo?.url || studio?.logo || null

  const isSettingsActive = location.pathname.includes("/settings")

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
    haptic.light()
    setIsDarkMode(!isDarkMode)
  }

  const goToSettings = () => {
    haptic.light()
    navigate("/member-view/settings")
  }

  // ============================================
  // Sub-Components
  // ============================================
  const SettingsButton = ({ isMobile = false }) => (
    <button
      onClick={goToSettings}
      className={`rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
        isSettingsActive
          ? "bg-primary/15 text-primary"
          : "bg-surface-card text-content-muted hover:bg-surface-button-hover"
      } ${isMobile ? "p-2 px-3" : "p-1.5 px-2.5"}`}
      aria-label="Settings"
      title="Settings"
    >
      <Settings size={18} />
    </button>
  )

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
        className="w-6 h-6 rounded-lg object-cover"
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
      {/* ===== MOBILE HEADER (lg:hidden) ===== */}
      <div
        className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border py-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none"
        style={{ touchAction: "manipulation" }}
      >
        {/* Left - Studio badge */}
        <div className="flex items-center gap-2">
          <StudioBadge isMobile={true} />
        </div>

        {/* Right - Settings + Theme + Language */}
        <div className="flex gap-1 items-center">
          <SettingsButton isMobile={true} />
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
              onClick={() => { haptic.light(); toggleLeftSidebarCollapse() }}
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

        {/* Right - Settings + Theme + Language */}
        <div className="flex gap-1 items-center">
          <SettingsButton isMobile={false} />
          <ThemeToggle isMobile={false} />
          <LanguageDropdown isMobile={false} />
        </div>
      </div>
    </>
  )
}

export default MemberDashboardHeader
