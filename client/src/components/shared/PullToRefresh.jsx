/* eslint-disable react/prop-types */
import { useRef, useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { haptic } from "../../utils/haptic"

/**
 * PullToRefresh — wraps a scroll container and adds native-feeling pull-to-refresh.
 *
 * Usage:
 *   <PullToRefresh onRefresh={async () => { await fetchData() }} className="flex-1 overflow-y-auto p-4">
 *     {children}
 *   </PullToRefresh>
 *
 * Props:
 *   onRefresh  — async function called on pull-release. Spinner stays until it resolves.
 *   className  — applied to the scroll container
 *   style      — applied to the scroll container
 *   threshold  — px to pull before triggering (default: 70)
 *   children   — page content
 */

const THRESHOLD = 70
const MAX_PULL = 120

/**
 * Walk up the DOM to check if this element or any scrollable ancestor
 * has scrollTop > 0. Returns true if everything is scrolled to the top.
 */
const isAtScrollTop = (el) => {
  let node = el
  while (node && node !== document.documentElement) {
    // Only check elements that are actually scrollable
    if (node.scrollHeight > node.clientHeight) {
      const style = window.getComputedStyle(node)
      const overflowY = style.overflowY
      if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
        if (node.scrollTop > 1) return false
      }
    }
    node = node.parentElement
  }
  return true
}

const PullToRefresh = ({ onRefresh, className = "", style = {}, threshold = THRESHOLD, children }) => {
  const containerRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const touchRef = useRef({ startY: 0, active: false, didActivate: false })
  const hapticFiredRef = useRef(false)

  const onTouchStart = useCallback((e) => {
    if (refreshing) return
    // Only record start position — don't activate yet.
    // Activation happens in onTouchMove after confirming scrollTop === 0.
    touchRef.current = { startY: e.touches[0].clientY, active: false, didActivate: false }
  }, [refreshing])

  const onTouchMove = useCallback((e) => {
    if (refreshing) return
    const touch = touchRef.current
    const dy = e.touches[0].clientY - touch.startY

    // Not pulling down → deactivate and bail
    if (dy <= 0) {
      if (touch.didActivate) {
        touch.active = false
        touch.didActivate = false
        setPullDistance(0)
        hapticFiredRef.current = false
      }
      return
    }

    // Pulling down — but are we actually at the scroll top?
    if (!touch.didActivate) {
      const el = containerRef.current
      if (!el || !isAtScrollTop(el)) return

      // Now activate the pull gesture
      touch.active = true
      touch.didActivate = true
      touch.startY = e.touches[0].clientY // Reset startY to current position for smooth pull
      hapticFiredRef.current = false
      return
    }

    // Active pull — update distance
    if (touch.active) {
      const pullDy = e.touches[0].clientY - touch.startY
      if (pullDy <= 0) {
        touch.active = false
        touch.didActivate = false
        setPullDistance(0)
        hapticFiredRef.current = false
        return
      }

      const distance = Math.min(MAX_PULL, pullDy * 0.5)
      setPullDistance(distance)

      // Haptic feedback once when crossing threshold
      if (distance >= threshold && !hapticFiredRef.current) {
        haptic.light()
        hapticFiredRef.current = true
      }
    }
  }, [refreshing, threshold])

  const onTouchEnd = useCallback(async () => {
    const touch = touchRef.current
    if (!touch.active || refreshing) {
      touch.active = false
      touch.didActivate = false
      setPullDistance(0)
      hapticFiredRef.current = false
      return
    }

    touch.active = false
    touch.didActivate = false
    hapticFiredRef.current = false

    if (pullDistance >= threshold && onRefresh) {
      setRefreshing(true)
      haptic.success()
      try {
        await onRefresh()
      } catch (err) {
        console.error("[PullToRefresh]", err)
      }
      setRefreshing(false)
    }
    setPullDistance(0)
  }, [pullDistance, threshold, onRefresh, refreshing])

  const showIndicator = pullDistance > 10 || refreshing
  const progress = Math.min(1, pullDistance / threshold)
  const indicatorY = refreshing ? 40 : pullDistance * 0.6

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className={`relative ${className}`}
      style={{ ...style, overscrollBehavior: "contain" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull indicator */}
      {showIndicator && (
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none z-10"
          style={{
            top: 0,
            transform: `translateY(${indicatorY}px)`,
            transition: refreshing ? "transform 0.3s ease-out" : pullDistance === 0 ? "transform 0.2s ease-out" : "none",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-border bg-surface-card"
            style={{
              opacity: refreshing ? 1 : progress,
              transform: `scale(${refreshing ? 1 : 0.5 + progress * 0.5})`,
              transition: refreshing ? "none" : pullDistance === 0 ? "all 0.2s ease-out" : "none",
            }}
          >
            <Loader2
              className={`w-[18px] h-[18px] text-primary ${refreshing ? "animate-spin" : ""}`}
              style={{
                transform: refreshing ? "none" : `rotate(${progress * 360}deg)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Content — shifts down during pull */}
      <div
        style={{
          transform: pullDistance > 0 || refreshing ? `translateY(${refreshing ? 48 : pullDistance * 0.4}px)` : "none",
          transition: pullDistance === 0 ? "transform 0.3s ease-out" : "none",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh
