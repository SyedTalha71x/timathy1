/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Home,
  Calendar,
  MessageCircle,
  Timer,
  Apple,
  MoreHorizontal,
  X,
} from "lucide-react"
import { CgGym } from "react-icons/cg"
import { haptic } from "../../../utils/haptic"

// ============================================
// Bottom Tab Bar — Mobile Only (lg:hidden)
// ============================================

// Primary tabs (always visible) — labels are i18n keys
const BAR_ITEMS = [
  { icon: Home, labelKey: "nav.studio", to: "/member-view/studio-menu" },
  { icon: Calendar, labelKey: "nav.appointments", to: "/member-view/appointment" },
  { icon: MessageCircle, labelKey: "nav.messages", to: "/member-view/communication" },
  { icon: Apple, labelKey: "nav.nutrition", to: "/member-view/nutrition" },
]

// Overflow items (inside "More" sheet)
const MORE_ITEMS = [
  { icon: Timer, labelKey: "nav.classes", to: "/member-view/classes" },
  { icon: CgGym, labelKey: "nav.training", to: "/member-view/training" },
]

const MemberBottomBar = ({ unreadMessagesCount = 0 }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [tappedTab, setTappedTab] = useState(null)
  const moreRef = useRef(null)

  // Detect keyboard open/close via focus/blur on inputs
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
      const isEditable = (tag === "input" && !e.target.readOnly) || tag === "textarea" || e.target?.isContentEditable
      if (isEditable) {
        setKeyboardOpen(true)
      }
    }
    const onFocusOut = () => {
      setTimeout(() => {
        const el = document.activeElement
        const tag = el?.tagName?.toLowerCase()
        const isEditable = (tag === "input" && !el?.readOnly) || tag === "textarea" || el?.isContentEditable
        if (!isEditable) {
          setKeyboardOpen(false)
        }
      }, 100)
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  // Close More menu on route change
  useEffect(() => {
    setShowMore(false)
  }, [location.pathname])

  // Close More menu on outside click
  useEffect(() => {
    if (!showMore) return
    const handleClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("touchstart", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("touchstart", handleClick)
    }
  }, [showMore])

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/")
  const isMoreActive = MORE_ITEMS.some((item) => isActive(item.to))

  const handleNavigate = (to) => {
    haptic.light()
    setTappedTab(to)
    setTimeout(() => setTappedTab(null), 450)
    // Re-tap active tab → scroll to top (iOS pattern)
    if (isActive(to)) {
      const scrollable = document.querySelector("[data-scroll-container]")
      if (scrollable) scrollable.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    navigate(to)
    setShowMore(false)
  }

  if (keyboardOpen) return null

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50" ref={moreRef}>

      {/* Pulse glow keyframes */}
      <style>{`
        @keyframes tab-pulse {
          0%   { transform: scale(1); opacity: 0.7; filter: brightness(1); }
          40%  { transform: scale(1.1); opacity: 1; filter: brightness(1.4); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }
      `}</style>

      {/* ═══ More menu — slides up above the bar ═══ */}
      <div
        className={`absolute bottom-full left-0 right-0 px-3 pb-2 transition-all duration-200 ${
          showMore
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="bg-surface-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          {MORE_ITEMS.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon
            return (
              <button
                key={item.to}
                onClick={() => handleNavigate(item.to)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
                  active ? "bg-primary/10" : "hover:bg-surface-hover active:bg-surface-hover"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <Icon
                  size={20}
                  className={active ? "text-primary" : "text-content-muted"}
                />
                <span
                  className={`text-sm ${
                    active ? "text-primary font-medium" : "text-content-primary"
                  }`}
                >
                  {t(item.labelKey)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ Tab bar ═══ */}
      <div
        className="bg-surface-dark/95 backdrop-blur-xl border-t border-border flex items-center justify-around"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
          touchAction: "manipulation",
        }}
      >
        {BAR_ITEMS.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon
          const isCommunication = item.to.includes("communication")
          return (
            <button
              key={item.to}
              onClick={() => handleNavigate(item.to)}
              className={`flex-1 flex flex-col items-center gap-0 pt-1.5 pb-1 transition-colors ${
                active ? "text-primary" : "text-content-faint active:text-content-muted"
              }`}
            >
              <div
                className="relative"
                style={tappedTab === item.to ? { animation: "tab-pulse 0.45s ease-out" } : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {isCommunication && unreadMessagesCount > 0 && (
                  <div className="absolute -top-0.5 -right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-transparent" style={{ borderColor: "var(--color-surface-dark, #111)" }} />
                )}
              </div>
              <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                {t(item.labelKey)}
              </span>
            </button>
          )
        })}

        {/* More button */}
        <button
          onClick={() => {
            haptic.light()
            setTappedTab("__more__")
            setTimeout(() => setTappedTab(null), 450)
            setShowMore((prev) => !prev)
          }}
          className={`flex-1 flex flex-col items-center gap-0 pt-1.5 pb-1 transition-colors relative ${
            isMoreActive
              ? "text-primary"
              : showMore
              ? "text-content-muted"
              : "text-content-faint active:text-content-muted"
          }`}
        >
          <div
            className="relative"
            style={tappedTab === "__more__" ? { animation: "tab-pulse 0.45s ease-out" } : undefined}
          >
            {showMore ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <MoreHorizontal size={20} strokeWidth={1.8} />
            )}
          </div>
          <span className={`text-[10px] leading-tight ${isMoreActive ? "font-semibold" : "font-medium"}`}>
            {t("common.more")}
          </span>
        </button>
      </div>
    </div>
  )
}

export default MemberBottomBar
