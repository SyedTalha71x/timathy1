/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import DefaultAvatar from '../../../../../public/gray-avatar-fotor-20250912192528.png'

/**
 * ProfileDropdown Component
 *
 * Self-contained profile menu with its own state and click-outside handling.
 *
 * Props:
 * - isMobile: Boolean — adjusts sizing and shows "Admin Panel" label on mobile
 * - onOpen: Optional callback when dropdown opens (used to close other dropdowns)
 */
const ProfileDropdown = ({ isMobile = false, onOpen }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const fullName = "Justin M"

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = () => {
    const next = !isOpen
    setIsOpen(next)
    if (next && onOpen) onOpen()
  }

  const handleAccountManagement = () => {
    setIsOpen(false)
    navigate("/admin-dashboard/configuration?tab=account-management")
  }

  const handleLogout = () => {
    setIsOpen(false)
    window.location.href = "/login"
  }

  return (
    <div className="relative" ref={ref}>
      <div onClick={toggle} className="flex items-center gap-1 cursor-pointer">
        <img src={DefaultAvatar} alt="Profile" className="w-9 h-9 rounded-lg" />
      </div>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-46 bg-[#222222]/95 backdrop-blur-3xl rounded-lg shadow-lg z-[9999]">
          <div className="p-2">
            <h2 className="font-semibold text-white text-sm leading-tight">{fullName}</h2>
          </div>
          <div className="py-2" role="menu">
            <button onClick={handleAccountManagement} className={`block w-full px-4 py-2 ${isMobile ? "text-xs" : "text-sm"} text-white hover:bg-zinc-700 text-left`}>
              {t("admin.profile.accountManagement")}
            </button>
            <hr className="border-zinc-600 my-1" />
            <button onClick={handleLogout} className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left">
              {t("common.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
