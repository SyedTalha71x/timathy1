/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Building2, History, ShoppingCart, Sun, Moon } from "lucide-react"
import { useTranslation } from "react-i18next"
import OrgaGymLogoWihoutText from '../../../../public/OrgaGym Logo.svg'
import { useSelector, useDispatch } from 'react-redux'
import { me } from '../../../features/auth/authSlice'
import LanguageDropdown from '../../LanguageDropdown'
import { Capacitor } from "@capacitor/core"
import { StatusBar, Style } from "@capacitor/status-bar"
import StudioProfileDropdown from './studio-dashboard-header-components/StudioProfileDropdown'
import StudioActivityLogModal from './studio-dashboard-header-components/StudioActivityLogModal'
import TermsModal from './studio-dashboard-header-components/TermsModal'
import PrivacyModal from './studio-dashboard-header-components/PrivacyModal'
import ChangelogModal from './studio-dashboard-header-components/ChangelogModal'

/**
 * DashboardHeader Component
 * 
 * Unified header for studio view — mobile + desktop.
 * All dropdowns and modals are separate components in the same folder.
 */
const DashboardHeader = ({
  onToggleSidebar,
  isSidebarOpen,
  isRightSidebarOpen,
  toggleRightSidebar,
  isLeftSidebarCollapsed,
  toggleLeftSidebarCollapse,
  hideRightSidebarToggle = false,
  showShoppingCartToggle = false,
  cartItemCount = 0
}) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // Fetch user data on mount
  useEffect(() => {
    dispatch(me())
  }, [dispatch])

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved ? saved === 'dark' : true
    if (!dark) document.documentElement.classList.add('light')
    return dark
  })

  // Modal states
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false)

  // User data
  const studioName = user?.studio?.studioName || ""
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""} `
  const profile = user?.img?.url
  // ============================================
  // Theme Toggle
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
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light }).catch(() => { })
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // ============================================
  // Inline Sub-Components (stateless, safe here)
  // ============================================
  const ThemeToggle = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${isMobile ? "p-2 px-3" : "p-1.5 px-2.5"}`}
      aria-label={isDarkMode ? t("studio.header.switchToLight") : t("studio.header.switchToDark")}
    >
      {isDarkMode ? <Sun size={18} className="text-content-muted" /> : <Moon size={18} className="text-content-muted" />}
    </button>
  )

  const SidebarToggleButton = ({ isMobile = false }) => (
    <div
      onClick={toggleRightSidebar}
      className={`cursor-pointer relative ${isMobile ? "p-2 px-3 rounded-xl bg-surface-card" : "p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-button-hover transition-colors"}`}
    >
      {showShoppingCartToggle ? (
        <>
          <ShoppingCart className={`${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"} text-content-primary`} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-surface-card">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </>
      ) : isRightSidebarOpen ? (
        <img draggable="false" key="open" src='/expand-sidebar mirrored.svg' className={`theme-icon ${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"}`} alt="Close sidebar" />
      ) : (
        <img draggable="false" key="closed" src="/icon.svg" className={`theme-icon ${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"}`} alt="Open sidebar" />
      )}
    </div>
  )

  // ============================================
  // Render
  // ============================================
  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggleSidebar} />
      )}

      {/* ===== MOBILE HEADER (lg:hidden) ===== */}
      <div
        className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border pb-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none"
        style={{ touchAction: "manipulation", paddingTop: "calc(env(safe-area-inset-top, 0px) + 6px)" }}
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <img draggable="false" src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
          </div>
          <button onClick={onToggleSidebar} className="p-2 px-3 rounded-xl bg-surface-card text-content-primary" aria-label={t("studio.header.toggleSidebar")}>
            {isSidebarOpen ? (
              <img draggable="false" key="open" src="/icon.svg" className="theme-icon h-[18px] w-[18px]" alt="Close sidebar" />
            ) : (
              <img draggable="false" key="closed" src='/expand-sidebar mirrored.svg' className="theme-icon h-[18px] w-[18px]" alt="Open sidebar" />
            )}
          </button>
        </div>

        <div className="flex gap-1 items-center relative">
          <ThemeToggle isMobile />
          <button onClick={() => setIsActivityLogOpen(true)} className="p-2 px-3 rounded-xl text-content-muted bg-surface-card cursor-pointer flex items-center gap-1" aria-label={t("studio.header.activityLog")}>
            <History size={18} />
          </button>
          <div className="mr-1">
            <LanguageDropdown isMobile />
          </div>
          <StudioProfileDropdown
            isMobile
            fullName={fullName}
            studioName={studioName}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenChangelog={() => setIsChangelogOpen(true)}
          />
          <SidebarToggleButton isMobile />
        </div>
      </div>

      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden rounded-md justify-between bg-surface-hover z-20 py-1 px-2 mb-2 items-center gap-2 select-none sticky top-0">
        {/* Left - Menu Toggle */}
        <div className="flex items-center">
          {toggleLeftSidebarCollapse && (
            <div onClick={toggleLeftSidebarCollapse} className="p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer">
              {isLeftSidebarCollapsed ? (
                <img draggable="false" key="collapsed" src='/expand-sidebar mirrored.svg' className="theme-icon h-5 w-5" alt="Open sidebar" />
              ) : (
                <img draggable="false" key="expanded" src="/icon.svg" className="theme-icon h-5 w-5" alt="Close sidebar" />
              )}
            </div>
          )}
        </div>

        {/* Right - All controls */}
        <div className="flex gap-1 items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-card gap-1 p-1.5 px-2.5 rounded-xl w-fit">
              <Building2 size={14} className="text-content-primary" />
              <p className="text-sm font-bold text-content-primary">{studioName}</p>
            </div>
            <ThemeToggle />
            <button onClick={() => setIsActivityLogOpen(true)} className="p-1.5 px-2.5 rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1" aria-label={t("studio.header.activityLog")}>
              <History size={18} />
            </button>
          </div>
          <div className="mr-2">
            <LanguageDropdown />
          </div>
          <StudioProfileDropdown
            fullName={fullName}
            studioName={studioName}
            userImage={profile}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenChangelog={() => setIsChangelogOpen(true)}
          />
          {(!hideRightSidebarToggle || showShoppingCartToggle) && <SidebarToggleButton />}
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <StudioActivityLogModal isOpen={isActivityLogOpen} onClose={() => setIsActivityLogOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
    </>
  )
}

export default DashboardHeader
