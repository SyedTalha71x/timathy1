/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Calendar,
  MessageCircle,
  Timer,
  Apple,
  MoreHorizontal,
  X,
} from "lucide-react"
import { SiYoutubestudio } from "react-icons/si"
import { CgGym } from "react-icons/cg"
import { haptic } from "../../../utils/haptic"

// ============================================
// Bottom Tab Bar — Mobile Only (lg:hidden)
// ============================================

// Primary tabs (always visible)
const BAR_ITEMS = [
  { icon: SiYoutubestudio, label: "Studio", to: "/member-view/studio-menu" },
  { icon: Calendar, label: "Appointments", to: "/member-view/appointment" },
  { icon: Timer, label: "Classes", to: "/member-view/classes" },
  { icon: CgGym, label: "Training", to: "/member-view/training" },
]

// Overflow items (inside "More" sheet)
const MORE_ITEMS = [
  { icon: MessageCircle, label: "Communication", to: "/member-view/communication" },
  { icon: Apple, label: "Nutrition", to: "/member-view/nutrition" },
]

const MemberBottomBar = ({ unreadMessagesCount = 0 }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const moreRef = useRef(null)

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
  const hasMoreBadge = unreadMessagesCount > 0

  const handleNavigate = (to) => {
    haptic.light()
    navigate(to)
    setShowMore(false)
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50" ref={moreRef}>

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
            const isCommunication = item.to.includes("communication")
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
                  {item.label}
                </span>
                {isCommunication && unreadMessagesCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ Tab bar ═══ */}
      <div
        className="bg-[#111111]/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
          touchAction: "manipulation",
        }}
      >
        {BAR_ITEMS.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon
          return (
            <button
              key={item.to}
              onClick={() => handleNavigate(item.to)}
              className={`flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-1.5 transition-colors ${
                active ? "text-primary" : "text-zinc-500 active:text-zinc-300"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          )
        })}

        {/* More button */}
        <button
          onClick={() => {
            haptic.light()
            setShowMore((prev) => !prev)
          }}
          className={`flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-1.5 transition-colors relative ${
            isMoreActive
              ? "text-primary"
              : showMore
              ? "text-zinc-300"
              : "text-zinc-500 active:text-zinc-300"
          }`}
        >
          <div className="relative">
            {showMore ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <MoreHorizontal size={22} strokeWidth={1.8} />
            )}
            {hasMoreBadge && !showMore && (
              <div className="absolute -top-0.5 -right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[#111111]" />
            )}
          </div>
          <span className={`text-[10px] leading-tight ${isMoreActive ? "font-semibold" : "font-medium"}`}>
            More
          </span>
        </button>
      </div>
    </div>
  )
}

export default MemberBottomBar
