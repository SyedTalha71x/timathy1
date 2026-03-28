/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Building2 } from "lucide-react"

/**
 * StudioProfileDropdown Component
 *
 * Self-contained profile menu for studio view with theme variables.
 * Includes: Edit Profile, Privacy Policy, Terms, Changelog, Logout.
 *
 * Props:
 * - isMobile: Boolean — adjusts sizing, shows user info on mobile
 * - fullName: String — user display name
 * - studioName: String — studio name for mobile badge
 * - onOpenPrivacy: Function — opens privacy policy modal
 * - onOpenTerms: Function — opens terms modal
 * - onOpenChangelog: Function — opens changelog modal
 */
const StudioProfileDropdown = ({ isMobile = false, fullName, studioName, onOpenPrivacy, onOpenTerms, onOpenChangelog }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = () => setIsOpen(prev => !prev)

  const handleEditProfile = () => {
    setIsOpen(false)
    navigate("/dashboard/configuration?section=profile-details")
  }

  const handlePrivacyPolicy = () => {
    setIsOpen(false)
    if (onOpenPrivacy) onOpenPrivacy()
  }

  const handleTermsOfUse = () => {
    setIsOpen(false)
    if (onOpenTerms) onOpenTerms()
  }

  const handleChangelog = () => {
    setIsOpen(false)
    if (onOpenChangelog) onOpenChangelog()
  }

  const handleLogout = () => {
    setIsOpen(false)
    window.location.href = "/login"
  }

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={toggle}
        className={`flex items-center cursor-pointer ${
          isMobile ? "" : "gap-2 p-1.5 px-2.5 rounded-xl bg-surface-card hover:bg-surface-button-hover transition-colors"
        }`}
      >
        <img draggable="false" src="/gray-avatar-fotor-20250912192528.png" alt="Profile" className={`rounded-${isMobile ? "md" : "lg"} ${isMobile ? "w-7 h-7" : "w-6 h-6"}`} />
        {!isMobile && <h2 className="font-semibold text-content-primary text-sm leading-tight">{fullName}</h2>}
      </div>

      {isOpen && (
        <div className={`absolute right-0 ${isMobile ? "top-11 w-40" : "top-10 w-48"} bg-surface-hover/50 backdrop-blur-3xl rounded-lg shadow-lg z-[9999]`}>
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
            <button onClick={handleEditProfile} className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}>
              {t("studio.profile.editProfile")}
            </button>
            <hr className="border-border-subtle my-1" />
            <button onClick={handlePrivacyPolicy} className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}>
              {t("studio.profile.privacyPolicy")}
            </button>
            <button onClick={handleTermsOfUse} className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}>
              {t("studio.profile.termsConditions")}
            </button>
            <button onClick={handleChangelog} className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} text-content-primary hover:bg-surface-button text-left`}>
              {t("studio.profile.changelog")}
            </button>
            <hr className="border-border-subtle my-1" />
            <button onClick={handleLogout} className={`block w-full ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs"} text-content-primary hover:bg-surface-button text-left`}>
              {t("common.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioProfileDropdown
