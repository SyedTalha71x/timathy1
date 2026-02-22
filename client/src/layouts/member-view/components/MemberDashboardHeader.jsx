/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Globe, X, Sun, Moon } from "lucide-react"
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png'

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
  // Dropdown state
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  // Theme state - defaults to dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved ? saved === 'dark' : true
    if (!dark) document.documentElement.classList.add('light')
    return dark
  })
  
  // Refs
  const languageDropdownRef = useRef(null)
  
  // Languages
  const languages = [
    { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/1024px-Flag_of_the_United_States.png" },
    { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
    { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
    { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
  ]
  
  const [selectedLanguage, setSelectedLanguage] = useState("English")

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
  
  // Close dropdown on scroll (mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setIsLanguageDropdownOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ============================================
  // Handlers
  // ============================================
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
  }

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsLanguageDropdownOpen(false)
  }

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

  const LanguageDropdown = ({ isMobile = false }) => (
    <div className="relative" ref={languageDropdownRef}>
      <button
        onClick={toggleLanguageDropdown}
        className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${
          isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
        }`}
        aria-label="Language Selection"
      >
        <Globe size={18} />
      </button>
      {isLanguageDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-[99]" 
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
          <div 
            className={`absolute ${
              isMobile 
                ? "right-0 top-11 w-36" 
                : "right-0 top-10 w-40"
            } bg-surface-hover/95 backdrop-blur-3xl rounded-lg shadow-lg z-[100]`}
          >
            <div className="py-2" role="menu">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`block w-full ${isMobile ? "px-3 py-1.5" : "px-4 py-2"} text-content-primary hover:bg-surface-button text-left flex items-center gap-2`}
                >
                  <img 
                    draggable="false"
                    src={language.flag} 
                    alt={`${language.name} flag`} 
                    className={`${isMobile ? "w-4 h-3" : "w-5 h-3"} rounded`}
                  />
                  <span className={isMobile ? "text-xs" : "text-sm"}>{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
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
      <div className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border py-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none">
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
