/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Globe, X, Building2, History, Menu, ShoppingCart, Sun, Moon } from "lucide-react"
import OrgaGymLogoWihoutText from '../../../../public/Orgagym white without text.svg'

/**
 * DashboardHeader Component
 * 
 * Unified header component that handles both mobile and desktop views.
 * Contains: Language dropdown, Profile dropdown, Activity Log, Right Sidebar toggle, Theme toggle, and all modals.
 * 
 * Props:
 * - onToggleSidebar: Function to toggle mobile sidebar
 * - isSidebarOpen: Boolean for sidebar state (mobile)
 * - isRightSidebarOpen: Boolean for right sidebar state
 * - toggleRightSidebar: Function to toggle right sidebar
 * - isLeftSidebarCollapsed: Boolean for left sidebar collapsed state (desktop)
 * - toggleLeftSidebarCollapse: Function to toggle left sidebar collapse (desktop)
 * - hideRightSidebarToggle: Boolean to hide the right sidebar toggle (for pages with custom sidebars like Selling)
 * - showShoppingCartToggle: Boolean to show shopping cart icon instead of sidebar icon
 * - cartItemCount: Number of items in cart (for badge display)
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
  const navigate = useNavigate()
  
  // Dropdown states
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  
  // Theme state - defaults to dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved ? saved === 'dark' : true
    // Apply on initial load so the class is set before first paint
    if (!dark) document.documentElement.classList.add('light')
    return dark
  })
  
  // Modal states
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false)
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false)
  
  // Refs for dropdowns
  const languageDropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)
  
  // User data (spÃ¤ter aus Context/API)
  const studioName = "Studio One"
  const fullName = "Samantha Jerry"
  const role = "Trainer"
  
  // Languages configuration
  const languages = [
    { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/1024px-Flag_of_the_United_States.png" },
    { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
    { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
    { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
  ]
  
  // Activity log data (spÃ¤ter aus API)
  const activityLogs = [
    { id: 1, action: "Appointment Created", description: "Created new appointment for John Doe - Personal Training", timestamp: "2024-12-15 14:30", type: "appointment" },
    { id: 2, action: "Member Updated", description: "Updated profile information for Sarah Smith", timestamp: "2024-12-15 13:15", type: "member" },
    { id: 3, action: "Contract Created", description: "Created new 12-month contract for Mike Johnson", timestamp: "2024-12-15 11:45", type: "contract" },
    { id: 4, action: "Appointment Rescheduled", description: "Rescheduled yoga class from 3 PM to 4 PM", timestamp: "2024-12-15 10:20", type: "appointment" },
    { id: 5, action: "Payment Processed", description: "Processed monthly payment for Emily Brown", timestamp: "2024-12-15 09:30", type: "payment" },
    { id: 6, action: "Member Added", description: "Added new member: Robert Wilson", timestamp: "2024-12-14 16:45", type: "member" },
    { id: 7, action: "Class Created", description: "Created new HIIT class schedule", timestamp: "2024-12-14 15:20", type: "class" },
    { id: 8, action: "Contract Renewed", description: "Renewed contract for Lisa Garcia", timestamp: "2024-12-14 14:10", type: "contract" },
  ]

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
  
  // Close dropdowns on scroll (mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setIsLanguageDropdownOpen(false)
        setIsDropdownOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // ============================================
  // Toggle Handlers
  // ============================================
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
    if (!isLanguageDropdownOpen && isDropdownOpen) {
      setIsDropdownOpen(false)
    }
  }
  
  const toggleProfileDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen && isLanguageDropdownOpen) {
      setIsLanguageDropdownOpen(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }
  
  // ============================================
  // Action Handlers
  // ============================================
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsLanguageDropdownOpen(false)
    console.log("Language selected:", language)
  }
  
  const handleActivityLogClick = () => {
    setIsActivityLogModalOpen(true)
  }
  
  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    navigate("/dashboard/configuration?section=profile-details")
  }
  
  const handlePrivacyPolicy = () => {
    setIsDropdownOpen(false)
    setIsPrivacyModalOpen(true)
  }
  
  const handleTermsOfUse = () => {
    setIsDropdownOpen(false)
    setIsTermsModalOpen(true)
  }
  
  const handleChangelog = () => {
    setIsDropdownOpen(false)
    setIsChangelogModalOpen(true)
  }
  
  const handleLogout = () => {
    setIsDropdownOpen(false)
    window.location.href = "/login"
  }
  
  // ============================================
  // Modal Component
  // ============================================
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] md:p-4 p-2">
        <div className="bg-surface-hover rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border-subtle">
            <h2 className="text-xl font-bold text-content-primary">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
              <X size={20} className="text-content-primary" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
        </div>
      </div>
    )
  }

  // ============================================
  // Theme Toggle Component
  // ============================================
  const ThemeToggle = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer flex items-center gap-1 ${
        isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
      }`}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun size={isMobile ? 18 : 18} className="text-yellow-500" />
      ) : (
        <Moon size={isMobile ? 18 : 18} className="text-blue-500" />
      )}
    </button>
  )
  
  // ============================================
  // Dropdown Components
  // ============================================
  const LanguageDropdown = ({ isMobile = false }) => (
    <div className="relative" ref={languageDropdownRef}>
      <button
        onClick={toggleLanguageDropdown}
        className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer flex items-center gap-1 ${
          isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
        }`}
        aria-label="Language Selection"
      >
        <Globe size={isMobile ? 18 : 18} />
      </button>
      {isLanguageDropdownOpen && (
        <>
          {/* Invisible overlay to catch outside clicks */}
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
  
  const ProfileDropdown = ({ isMobile = false }) => (
    <div className="relative" ref={profileDropdownRef}>
      <div 
        onClick={toggleProfileDropdown} 
        className={`flex items-center cursor-pointer ${
          isMobile ? "" : "gap-2 p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-hover transition-colors"
        }`}
      >
        <img draggable="false" src="/gray-avatar-fotor-20250912192528.png" alt="Profile" className={`rounded-${isMobile ? "md" : "lg"} ${isMobile ? "w-7 h-7" : "w-6 h-6"}`} />
        {!isMobile && <h2 className="font-semibold text-content-primary text-sm leading-tight">{fullName}</h2>}
      </div>
      
      {isDropdownOpen && (
        <>
          {/* Invisible overlay to catch outside clicks */}
          <div 
            className="fixed inset-0 z-[99]" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div 
            className={`absolute right-0 ${isMobile ? "top-11 w-40" : "top-10 w-48"} bg-surface-hover/50 backdrop-blur-3xl rounded-lg shadow-lg z-[100]`}
          >
            {/* Mobile shows user info in dropdown */}
            {isMobile && (
              <div className="p-1.5">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-content-primary text-xs leading-tight">{fullName}</h2>
                  <div className="flex items-center mt-2 gap-1 bg-surface-dark py-1 px-2 rounded w-fit">
                    <Building2 size={12} className="text-content-primary" />
                    <p className="text-xs font-medium text-content-primary">{studioName}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className={isMobile ? "py-1" : "py-2"} role="menu">
              <button
                onClick={handleEditProfile}
                className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}
              >
                Edit Profile
              </button>
              <hr className="border-border-subtle my-1" />
              <button
                onClick={handlePrivacyPolicy}
                className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}
              >
                Privacy Policy
              </button>
              <button
                onClick={handleTermsOfUse}
                className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}
              >
                Terms & Conditions
              </button>
              <button
                onClick={handleChangelog}
                className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}
              >
                Changelog
              </button>
              <hr className="border-border-subtle my-1" />
              <button
                onClick={handleLogout}
                className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs"} text-content-primary hover:bg-surface-button text-left`}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  // ============================================
  // Right Sidebar Toggle Button Component
  // ============================================
  const SidebarToggleButton = ({ isMobile = false }) => (
    <div 
      onClick={toggleRightSidebar} 
      className={`cursor-pointer relative ${isMobile ? "p-2 px-3 rounded-xl bg-surface-card" : "p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-hover transition-colors"}`}
    >
      {showShoppingCartToggle ? (
        // Shopping Cart Mode (Selling page)
        <>
          <ShoppingCart className={`${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"} text-content-primary`} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-surface-card">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </>
      ) : (
        // Normal Sidebar Mode
        isRightSidebarOpen ? (
          <img draggable="false" key="open" src='/expand-sidebar mirrored.svg' className={`theme-icon ${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"}`} alt="Close sidebar" />
        ) : (
          <img draggable="false" key="closed" src="/icon.svg" className={`theme-icon ${isMobile ? "h-[18px] w-[18px]" : "h-5 w-5"}`} alt="Open sidebar" />
        )
      )}
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
      <div className="fixed top-0 left-0 w-full bg-surface-dark border-b border-border-default py-1.5 px-2 flex items-center justify-between lg:hidden z-40 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <img draggable="false" src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
          </div>
          <button
            onClick={onToggleSidebar}
            className="p-1.5 px-2.5 rounded-xl bg-surface-card text-content-primary"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <img draggable="false" key="open" src="/icon.svg" className="theme-icon h-[18px] w-[18px]" alt="Close sidebar" />
            ) : (
              <img draggable="false" key="closed" src='/expand-sidebar mirrored.svg' className="theme-icon h-[18px] w-[18px]" alt="Open sidebar" />
            )}
          </button>
        </div>
        
        <div className="flex gap-1 items-center relative">
          {/* Theme Toggle */}
          <ThemeToggle isMobile={true} />
          
          {/* Activity Log */}
          <button
            onClick={handleActivityLogClick}
            className="p-2 px-3 rounded-xl text-content-muted bg-surface-card cursor-pointer flex items-center gap-1"
            aria-label="Activity Log"
          >
            <History size={18} />
          </button>
          
          {/* Language Dropdown */}
          <div className="mr-1">
            <LanguageDropdown isMobile={true} />
          </div>
          
          {/* Profile Dropdown */}
          <ProfileDropdown isMobile={true} />

          {/* Right Sidebar Toggle - Shows cart icon on Selling page, sidebar icon elsewhere */}
          {(!hideRightSidebarToggle || showShoppingCartToggle) && <SidebarToggleButton isMobile={true} />}
        </div>
      </div>
      
      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden rounded-md justify-between bg-surface-hover z-20 py-1 px-2 mb-2 items-center gap-2 select-none sticky top-0">
        {/* Left - Menu Toggle */}
        <div className="flex items-center">
          {toggleLeftSidebarCollapse && (
            <div
              onClick={toggleLeftSidebarCollapse}
              className="p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer"
            >
              {isLeftSidebarCollapsed ? (
                <img draggable="false" key="collapsed" src='/expand-sidebar mirrored.svg' className="theme-icon h-5 w-5" alt="Open sidebar" />
              ) : (
                <img draggable="false" key="expanded" src="/icon.svg" className="theme-icon h-5 w-5" alt="Close sidebar" />
              )}
            </div>
          )}
        </div>

        {/* Right - All other controls */}
        <div className="flex gap-1 items-center">
          <div className="flex items-center gap-2">
            {/* Studio Name */}
            <div className="flex items-center bg-surface-card gap-1 p-1.5 px-2.5 rounded-xl w-fit">
              <Building2 size={14} className="text-content-primary" />
              <p className="text-sm font-bold text-content-primary">{studioName}</p>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle isMobile={false} />
            
            {/* Activity Log */}
            <button
              onClick={handleActivityLogClick}
              className="p-1.5 px-2.5 rounded-xl text-content-muted bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer flex items-center gap-1"
              aria-label="Activity Log"
            >
              <History size={18} />
            </button>
          </div>
          
          {/* Language Dropdown */}
          <div className="mr-2">
            <LanguageDropdown isMobile={false} />
          </div>
          
          {/* Profile Dropdown */}
          <ProfileDropdown isMobile={false} />

          {/* Right Sidebar Toggle - Desktop - Shows cart icon on Selling page, sidebar icon elsewhere */}
          {(!hideRightSidebarToggle || showShoppingCartToggle) && <SidebarToggleButton isMobile={false} />}
        </div>
      </div>
      
      {/* ===== MODALS ===== */}
      
      {/* Activity Log Modal */}
      <Modal isOpen={isActivityLogModalOpen} onClose={() => setIsActivityLogModalOpen(false)} title="Activity Log">
        <div className="text-content-secondary">
          <div className="mb-4 md:mb-6">
            <p className="text-content-muted mb-3 md:mb-4 text-sm md:text-base px-2 md:px-0 text-center md:text-left">
              Recent activities and actions performed on the platform
            </p>
            <div className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto px-1">
              {activityLogs.map((activity) => (
                <div key={activity.id} className="pl-3 md:pl-4 py-2 md:py-3 bg-surface-hover rounded-r-lg mx-1 md:mx-0">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                        <h4 className="font-semibold text-content-primary text-sm md:text-base truncate">{activity.action}</h4>
                        <span className="text-xs text-content-muted bg-surface-button px-2 py-1 rounded flex-shrink-0">{activity.timestamp}</span>
                      </div>
                      <p className="text-xs md:text-sm text-content-secondary mt-1 break-words">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Terms & Conditions Modal */}
      <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} title="Terms & Conditions">
        <div className="text-content-secondary space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">1. Acceptance of Terms</h3>
            <p className="leading-relaxed">
              By accessing and using the Studio Management Platform ("Service"), you acknowledge that you have read,
              understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these
              terms, you may not use our Service.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">2. Use of Service</h3>
            <p className="leading-relaxed mb-3">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Share your account credentials with third parties</li>
              <li>Use the Service to transmit harmful or malicious content</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">3. Account Responsibilities</h3>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account information and for all activities
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account
              or any other breach of security.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">4. Intellectual Property</h3>
            <p className="leading-relaxed">
              The Service and its original content, features, and functionality are owned by Studio Management Platform
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">5. Limitation of Liability</h3>
            <p className="leading-relaxed">
              In no event shall Studio Management Platform be liable for any indirect, incidental, special, consequential,
              or punitive damages, including without limitation, loss of profits, data, or other intangible losses.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">6. Changes to Terms</h3>
            <p className="leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>
          </div>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="text-content-secondary space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">Information We Collect</h3>
            <p className="leading-relaxed mb-3">
              We collect information you provide directly to us, such as when you create an account, update your
              profile, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Profile information and preferences</li>
              <li>Fitness goals and health information</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">How We Use Your Information</h3>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Personalize your experience</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">Information Sharing</h3>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share your information with trusted third parties who
              assist us in operating our platform, conducting our business, or serving our users.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">Data Security</h3>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet or
              electronic storage is 100% secure.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">Your Rights</h3>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content-primary mb-3">Contact Us</h3>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@studioone.com or through
              our support channels.
            </p>
          </div>
        </div>
      </Modal>
      
      {/* Changelog Modal */}
      <Modal isOpen={isChangelogModalOpen} onClose={() => setIsChangelogModalOpen(false)} title="Changelog">
        <div className="text-content-secondary space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-content-primary">Version 2.1.0</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Latest</span>
            </div>
            <p className="text-sm text-content-muted mb-3">Released on December 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸŽ‰ New Features</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced member analytics dashboard</li>
                  <li>Real-time class capacity tracking</li>
                  <li>Automated membership renewal notifications</li>
                  <li>Mobile app push notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ”§ Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Faster loading times for member profiles</li>
                  <li>Improved search functionality</li>
                  <li>Better mobile responsiveness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ› Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed calendar sync issues</li>
                  <li>Resolved payment processing errors</li>
                  <li>Fixed member check-in duplicates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-content-primary mb-3">Version 2.0.5</h3>
            <p className="text-sm text-content-muted mb-3">Released on November 28, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ”§ Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced security measures</li>
                  <li>Improved data backup system</li>
                  <li>Updated user interface elements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ› Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed trainer schedule conflicts</li>
                  <li>Resolved email notification delays</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold text-content-primary mb-3">Version 2.0.0</h3>
            <p className="text-sm text-content-muted mb-3">Released on October 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸŽ‰ Major Release</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Complete UI/UX redesign</li>
                  <li>New member management system</li>
                  <li>Advanced reporting and analytics</li>
                  <li>Integration with popular fitness apps</li>
                  <li>Multi-language support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ”§ Performance</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>50% faster page load times</li>
                  <li>Improved database optimization</li>
                  <li>Enhanced mobile performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-lg font-semibold text-content-primary mb-3">Version 1.9.2</h3>
            <p className="text-sm text-content-muted mb-3">Released on September 20, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-content-primary mb-2">ðŸ› Critical Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed critical security vulnerability</li>
                  <li>Resolved data synchronization issues</li>
                  <li>Fixed membership expiration notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DashboardHeader
