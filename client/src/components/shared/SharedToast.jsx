/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

// ─── Toast Context ───────────────────────────────────────────────────────────

const ToastContext = createContext(null)

let globalToast = null // allows toast() calls outside React tree

// ─── Toast Item ──────────────────────────────────────────────────────────────

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const ACCENT = {
  success: {
    icon: "text-primary",
    bar: "bg-primary",
    bg: "bg-primary/10",
  },
  error: {
    icon: "text-red-400",
    bar: "bg-red-400",
    bg: "bg-red-400/10",
  },
  info: {
    icon: "text-primary",
    bar: "bg-primary",
    bg: "bg-primary/10",
  },
}

const ToastItem = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef(null)
  const startRef = useRef(Date.now())

  const duration = toast.duration || 3000
  const Icon = ICONS[toast.type] || Info
  const accent = ACCENT[toast.type] || ACCENT.info

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [onDismiss, toast.id])

  // Auto-dismiss + progress bar
  useEffect(() => {
    startRef.current = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        handleDismiss()
      } else {
        timerRef.current = requestAnimationFrame(updateProgress)
      }
    }

    timerRef.current = requestAnimationFrame(updateProgress)
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }
  }, [duration, handleDismiss])

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-lg border border-border
        bg-surface-card backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isExiting ? "opacity-0 translate-x-8 scale-95" : "opacity-100 translate-x-0 scale-100"}
      `}
      style={{ 
        minWidth: "300px", 
        maxWidth: "420px",
        animation: !isExiting ? "toast-enter 0.3s ease-out" : undefined,
      }}
    >
      <div className="flex items-start gap-3 p-3.5">
        {/* Icon */}
        <div className={`flex-shrink-0 rounded-lg p-1.5 ${accent.bg}`}>
          <Icon size={16} className={accent.icon} />
        </div>

        {/* Message */}
        <p className="flex-1 text-sm text-content-primary leading-relaxed pt-0.5">
          {toast.message}
        </p>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-0.5 rounded-md text-content-faint hover:text-content-primary hover:bg-surface-hover transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border/30">
        <div
          className={`h-full ${accent.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ─── Toast Container ─────────────────────────────────────────────────────────

const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <>
      <style>{`
        @keyframes toast-enter {
          from {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[100000] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Provider ────────────────────────────────────────────────────────────────

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((type, message, duration = 3000) => {
    const id = ++idCounter
    setToasts((prev) => {
      // Max 5 toasts visible
      const limited = prev.length >= 5 ? prev.slice(1) : prev
      return [...limited, { id, type, message, duration }]
    })
    return id
  }, [])

  const toastAPI = useCallback(() => {}, [])
  toastAPI.success = useCallback((msg, duration) => addToast("success", msg, duration), [addToast])
  toastAPI.error = useCallback((msg, duration) => addToast("error", msg, duration), [addToast])
  toastAPI.info = useCallback((msg, duration) => addToast("info", msg, duration), [addToast])

  // Set global reference for non-hook usage
  useEffect(() => {
    globalToast = toastAPI
    return () => { globalToast = null }
  }, [toastAPI])

  return (
    <ToastContext.Provider value={toastAPI}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>")
  return ctx
}

// ─── Global toast (drop-in replacement for react-hot-toast) ──────────────────

const toast = {
  success: (msg, duration) => globalToast?.success(msg, duration),
  error: (msg, duration) => globalToast?.error(msg, duration),
  info: (msg, duration) => globalToast?.info(msg, duration),
}

export default toast
