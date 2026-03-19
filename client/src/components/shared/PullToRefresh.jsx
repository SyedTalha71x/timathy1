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

const PullToRefresh = ({ onRefresh, className = "", style = {}, threshold = THRESHOLD, children }) => {
  const containerRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const touchRef = useRef({ startY: 0, active: false })

  const onTouchStart = useCallback((e) => {
    if (refreshing) return
    const el = containerRef.current
    if (el && el.scrollTop <= 0) {
      touchRef.current = { startY: e.touches[0].clientY, active: true }
    }
  }, [refreshing])

  const onTouchMove = useCallback((e) => {
    if (!touchRef.current.active || refreshing) return
    const dy = e.touches[0].clientY - touchRef.current.startY
    if (dy > 0) {
      const distance = Math.min(MAX_PULL, dy * 0.5)
      setPullDistance(distance)
      if (distance >= threshold && dy * 0.5 < threshold + 2) {
        haptic.light()
      }
    } else {
      touchRef.current.active = false
      setPullDistance(0)
    }
  }, [refreshing, threshold])

  const onTouchEnd = useCallback(async () => {
    if (!touchRef.current.active || refreshing) return
    touchRef.current.active = false

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
