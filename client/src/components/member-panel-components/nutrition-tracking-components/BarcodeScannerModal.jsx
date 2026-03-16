import { useState, useEffect } from "react"
import { X, ScanBarcode, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { SettingsCard, mealIcons, mealLabels } from "./nutritionConstants"
import { Capacitor } from "@capacitor/core"

// ── Animated scan line ──────────────────────────────────────
const ScanLine = ({ paused }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
    {!paused && (
      <div className="absolute left-[12%] right-[12%] h-[2px] rounded-full animate-scanline"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--color-primary, #f97316) 20%, var(--color-primary, #f97316) 80%, transparent 100%)",
          boxShadow: "0 0 12px 3px var(--color-primary, #f97316), 0 0 30px 6px rgba(249,115,22,0.15)",
        }}
      />
    )}
  </div>
)

// ── Corner bracket overlay ──────────────────────────────────
const ScanFrame = ({ status }) => {
  // status: "idle" | "scanning" | "found" | "error"
  const color = status === "found"
    ? "rgba(34,197,94,0.9)"
    : status === "error"
    ? "rgba(239,68,68,0.7)"
    : "var(--color-primary, #f97316)"

  const cornerSize = 28
  const thickness = 3
  const radius = 10
  const cornerStyle = (top, right, bottom, left, br) => ({
    position: "absolute", top, right, bottom, left, width: cornerSize, height: cornerSize,
    borderColor: color, borderStyle: "solid", borderWidth: 0,
    ...(br && { borderRadius: br }),
    transition: "border-color 0.3s ease",
  })

  return (
    <div className={`absolute inset-[12%] z-10 pointer-events-none ${status === "found" ? "animate-pulse-once" : ""}`}>
      {/* Top-left */}
      <div style={{ ...cornerStyle(0, undefined, undefined, 0, `${radius}px 0 0 0`), borderTopWidth: thickness, borderLeftWidth: thickness }} />
      {/* Top-right */}
      <div style={{ ...cornerStyle(0, 0, undefined, undefined, `0 ${radius}px 0 0`), borderTopWidth: thickness, borderRightWidth: thickness }} />
      {/* Bottom-left */}
      <div style={{ ...cornerStyle(undefined, undefined, 0, 0, `0 0 0 ${radius}px`), borderBottomWidth: thickness, borderLeftWidth: thickness }} />
      {/* Bottom-right */}
      <div style={{ ...cornerStyle(undefined, 0, 0, undefined, `0 0 ${radius}px 0`), borderBottomWidth: thickness, borderRightWidth: thickness }} />
    </div>
  )
}

// ── Status pill ─────────────────────────────────────────────
const StatusPill = ({ status, code, loading }) => {
  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-surface-hover rounded-xl">
      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
      <span className="text-xs text-content-secondary">Looking up barcode…</span>
    </div>
  )
  if (status === "found") return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500/10 rounded-xl">
      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
      <span className="text-xs text-green-400 font-medium">Product found!</span>
    </div>
  )
  if (status === "error") return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 rounded-xl">
      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
      <span className="text-xs text-red-400">Not found — try again</span>
    </div>
  )
  if (code) return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-surface-hover rounded-xl">
      <ScanBarcode className="w-3.5 h-3.5 text-content-faint" />
      <span className="text-xs text-content-secondary font-mono">{code}</span>
    </div>
  )
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4">
      <span className="text-xs text-content-faint">Align barcode within the frame</span>
    </div>
  )
}

// ── Inline keyframes (injected once) ────────────────────────
const ScannerStyles = () => (
  <style>{`
    @keyframes scanline {
      0%   { top: 15%; opacity: 0; }
      5%   { opacity: 1; }
      45%  { top: 80%; opacity: 1; }
      50%  { top: 80%; opacity: 0; }
      55%  { top: 80%; opacity: 0; }
      60%  { top: 80%; opacity: 1; }
      95%  { top: 15%; opacity: 1; }
      100% { top: 15%; opacity: 0; }
    }
    .animate-scanline {
      animation: scanline 2.8s ease-in-out infinite;
    }
    @keyframes pulse-once {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    .animate-pulse-once {
      animation: pulse-once 0.4s ease-out;
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.3s ease-out;
    }
    .scanner-video-wrapper {
      position: absolute;
      inset: 0;
    }
    .scanner-video-wrapper video {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
  `}</style>
)

// ── Main Modal ──────────────────────────────────────────────
const BarcodeScannerModal = ({
  show, onClose, barcodeActive, setBarcodeActive,
  barcodeLoading, barcodeFood, barcodeError,
  lastScanned, dispatch, barcodeScanAction,
  preselectedMeal, onAddFood,
}) => {
  const [scanStatus, setScanStatus] = useState("idle") // idle | scanning | found | error
  const [selectedMeal, setSelectedMeal] = useState(preselectedMeal || "breakfast")
  const [showMealPicker, setShowMealPicker] = useState(false)
  const [cameraBlocked, setCameraBlocked] = useState(false)

  // Check camera permission before activating scanner
  useEffect(() => {
    if (!show || !barcodeActive) return
    let cancelled = false

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        // Permission granted — stop the test stream immediately
        stream.getTracks().forEach(t => t.stop())
        if (!cancelled) setCameraBlocked(false)
      })
      .catch((err) => {
        if (cancelled) return
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraBlocked(true)
          setBarcodeActive(false)
          if (Capacitor.isNativePlatform()) {
            const goToSettings = window.confirm(
              "Camera access is required for barcode scanning.\n\nWould you like to open Settings to enable it?"
            )
            if (goToSettings) window.open("app-settings:", "_self")
          }
        }
      })

    return () => { cancelled = true }
  }, [show, barcodeActive])

  // Sync preselectedMeal when modal opens
  useEffect(() => {
    if (show && preselectedMeal) {
      setSelectedMeal(preselectedMeal)
      setShowMealPicker(false)
      setCameraBlocked(false)
    }
  }, [show, preselectedMeal])

  // Derive status from props
  useEffect(() => {
    if (barcodeLoading) setScanStatus("scanning")
    else if (barcodeFood) setScanStatus("found")
    else if (barcodeError) setScanStatus("error")
    else if (lastScanned?.current) setScanStatus("idle")
    else setScanStatus("idle")
  }, [barcodeLoading, barcodeFood, barcodeError])

  // Auto-reset error status after 3s
  useEffect(() => {
    if (scanStatus === "error") {
      const t = setTimeout(() => setScanStatus("idle"), 3000)
      return () => clearTimeout(t)
    }
  }, [scanStatus])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
      <ScannerStyles />
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2">
            <ScanBarcode className="w-4 h-4 text-primary" /> Scan Barcode
          </h3>
          <button onClick={onClose}
            className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── Camera viewport ── */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 z-[5] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />

            {/* Corner frame */}
            <ScanFrame status={scanStatus} />

            {/* Animated scan line */}
            <ScanLine paused={!barcodeActive || scanStatus === "found"} />

            {/* Camera feed */}
            {barcodeActive ? (
              <div className="absolute inset-0 scanner-video-wrapper">
                <BarcodeScannerComponent
                  width="100%"
                  height="100%"
                  delay={200}
                  facingMode="environment"
                  constraints={{
                    video: {
                      facingMode: "environment",
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                      focusMode: "continuous",
                    }
                  }}
                  onUpdate={(err, result) => {
                    if (err) {
                      const name = err?.name || ""
                      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
                        setCameraBlocked(true)
                        setBarcodeActive(false)
                        if (Capacitor.isNativePlatform()) {
                          const goToSettings = window.confirm(
                            "Camera access is required for barcode scanning.\n\nWould you like to open Settings to enable it?"
                          )
                          if (goToSettings) window.open("app-settings:", "_self")
                        }
                        return
                      }
                    }
                    if (result?.text) {
                      const code = result.text.trim()
                      if (code !== lastScanned.current) {
                        lastScanned.current = code
                        dispatch(barcodeScanAction(code))
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-20">
                <ScanBarcode className="w-10 h-10 text-content-faint/30 mb-3" />
                {cameraBlocked ? (
                  <>
                    <p className="text-sm text-red-400 mb-1">Camera access denied</p>
                    <p className="text-xs text-content-muted mb-3">Enable camera in your device settings</p>
                    {Capacitor.isNativePlatform() && (
                      <button onClick={() => window.open("app-settings:", "_self")}
                        className="px-4 py-2 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm transition-colors">
                        Open Settings
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-content-muted">Scanner paused</p>
                    <button onClick={() => setBarcodeActive(true)}
                      className="mt-3 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors">
                      Resume Scanner
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Status indicator ── */}
          <StatusPill status={scanStatus} code={lastScanned?.current} loading={barcodeLoading} />

          {/* ── Found product card with confirmation ── */}
          {barcodeFood && (
            <div className="animate-fade-in-up">
              <SettingsCard className="!p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-content-primary leading-tight">{barcodeFood.name}</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-content-faint">
                      {barcodeFood.serving && <span>{barcodeFood.serving}</span>}
                      {barcodeFood.servingSize && <span>{barcodeFood.servingSize}g</span>}
                    </div>
                  </div>
                </div>

                {/* Macro badges */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Calories", value: `${barcodeFood.calories}`, unit: "kcal", color: "text-primary" },
                    { label: "Protein", value: `${barcodeFood.protein}`, unit: "g", color: "text-blue-400" },
                    { label: "Carbs", value: `${barcodeFood.carbs}`, unit: "g", color: "text-orange-400" },
                    { label: "Fat", value: `${barcodeFood.fats}`, unit: "g", color: "text-yellow-400" },
                  ].map((m) => (
                    <div key={m.label} className="text-center bg-surface-dark rounded-xl py-2 px-1">
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}<span className="text-[10px] font-normal text-content-faint ml-0.5">{m.unit}</span></p>
                      <p className="text-[10px] text-content-faint mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Confirm add — shows preselected meal with option to change */}
                {!showMealPicker ? (
                  <div className="space-y-2">
                    <button onClick={() => onAddFood(selectedMeal, barcodeFood)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]">
                      {(() => { const MIcon = mealIcons[selectedMeal]; return <MIcon className="w-4 h-4" /> })()}
                      Add to {mealLabels[selectedMeal]}
                    </button>
                    <button onClick={() => setShowMealPicker(true)}
                      className="w-full py-2 text-xs text-content-faint hover:text-content-secondary transition-colors">
                      Change meal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1">Choose meal</p>
                    <div className="grid grid-cols-4 gap-2">
                      {["breakfast", "lunch", "dinner", "snacks"].map((m) => {
                        const MealIcon = mealIcons[m]
                        const isActive = m === selectedMeal
                        return (
                          <button key={m} onClick={() => { setSelectedMeal(m); setShowMealPicker(false) }}
                            className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs transition-all duration-200 active:scale-95 ${
                              isActive
                                ? "bg-primary text-white"
                                : "bg-surface-button text-content-primary hover:bg-surface-button-hover"
                            }`}>
                            <MealIcon className="w-4 h-4" />
                            <span className="capitalize text-[10px] font-medium">{m}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </SettingsCard>
            </div>
          )}

          {/* ── Error message ── */}
          {barcodeError && !barcodeFood && (
            <div className="animate-fade-in-up">
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400 font-medium mb-1">Product not found</p>
                <p className="text-xs text-content-faint">{barcodeError}</p>
              </div>
            </div>
          )}

          {/* ── Pause button (only when camera is active) ── */}
          {barcodeActive && (
            <button onClick={() => setBarcodeActive(false)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors bg-surface-hover text-content-secondary hover:bg-surface-button">
              Pause Scanner
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BarcodeScannerModal
