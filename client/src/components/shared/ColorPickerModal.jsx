/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Check, Pipette } from 'lucide-react'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#78716c', '#6b7280', '#475569',
]

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

function hsvToHex(h, s, v) {
  const [r, g, b] = hsvToRgb(h, s, v)
  const toHex = (c) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hsvToRgb(h, s, v) {
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  let r, g, b
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
    default: r = 0; g = 0; b = 0
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000000' : '#ffffff'
}

function drawSvCanvas(canvas, hue) {
  if (!canvas) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const w = canvas.width
  const h = canvas.height
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = x / (w - 1)
      const v = 1 - y / (h - 1)
      const [r, g, b] = hsvToRgb(hue, s, v)
      const idx = (y * w + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

function drawHueCanvas(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const w = canvas.width
  const h = canvas.height
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data
  for (let x = 0; x < w; x++) {
    const hue = x / (w - 1)
    const [r, g, b] = hsvToRgb(hue, 1, 1)
    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

export default function ColorPickerModal({ isOpen, onClose, onSelectColor, currentColor = '#f97316', title = 'Choose Color' }) {
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [hexInput, setHexInput] = useState(currentColor)
  const [hsv, setHsv] = useState(() => hexToHsv(currentColor))
  const [activeTab, setActiveTab] = useState('presets')

  const svCanvasRef = useRef(null)
  const hueCanvasRef = useRef(null)
  const svContainerRef = useRef(null)
  const hueContainerRef = useRef(null)
  const isDraggingSv = useRef(false)
  const isDraggingHue = useRef(false)

  useEffect(() => {
    setSelectedColor(currentColor)
    setHexInput(currentColor)
    setHsv(hexToHsv(currentColor))
  }, [currentColor])

  useEffect(() => {
    if (activeTab === 'custom') drawSvCanvas(svCanvasRef.current, hsv.h)
  }, [hsv.h, activeTab])

  useEffect(() => {
    if (activeTab === 'custom') drawHueCanvas(hueCanvasRef.current)
  }, [activeTab])

  const updateFromHsv = useCallback((newHsv) => {
    setHsv(newHsv)
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v)
    setSelectedColor(hex)
    setHexInput(hex)
  }, [])

  const handleSvInteraction = useCallback((e) => {
    const rect = svContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height))
    updateFromHsv({ ...hsv, s, v })
  }, [hsv, updateFromHsv])

  const handleHueInteraction = useCallback((e) => {
    const rect = hueContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const h = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    updateFromHsv({ ...hsv, h })
  }, [hsv, updateFromHsv])

  useEffect(() => {
    const handleMove = (e) => {
      if (isDraggingSv.current) { e.preventDefault(); handleSvInteraction(e) }
      if (isDraggingHue.current) { e.preventDefault(); handleHueInteraction(e) }
    }
    const handleUp = () => { isDraggingSv.current = false; isDraggingHue.current = false }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [handleSvInteraction, handleHueInteraction])

  const handleHexChange = (value) => {
    setHexInput(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value)
      setHsv(hexToHsv(value))
    }
  }

  const handlePresetClick = (color) => {
    setSelectedColor(color)
    setHexInput(color)
    setHsv(hexToHsv(color))
  }

  const handleConfirm = () => {
    onSelectColor(selectedColor)
    onClose()
  }

  if (!isOpen) return null

  const hueColor = hsvToHex(hsv.h, 1, 1)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1002] p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-content-primary">{title}</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'text-content-primary border-b-2 border-primary'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'text-content-primary border-b-2 border-primary'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            <Pipette size={14} />
            Custom
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  className={`w-full aspect-square rounded-xl transition-all duration-150 hover:scale-110 ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-base scale-110'
                      : 'hover:shadow-lg'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor.toLowerCase() === color.toLowerCase() && (
                    <Check size={16} style={{ color: getContrastColor(color) }} className="mx-auto" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* SV Gradient — Canvas */}
              <div
                ref={svContainerRef}
                className="relative w-full rounded-xl overflow-hidden cursor-crosshair select-none"
                style={{ aspectRatio: '5 / 3' }}
                onMouseDown={(e) => { isDraggingSv.current = true; handleSvInteraction(e) }}
                onTouchStart={(e) => { isDraggingSv.current = true; handleSvInteraction(e) }}
              >
                <canvas
                  ref={svCanvasRef}
                  width={512}
                  height={308}
                  className="block w-full h-full"
                />
                <div
                  className="absolute w-4 h-4 rounded-full pointer-events-none"
                  style={{
                    left: `${hsv.s * 100}%`,
                    top: `${(1 - hsv.v) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: selectedColor,
                    border: '2.5px solid #fff',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              </div>

              {/* Hue Bar — Canvas */}
              <div
                ref={hueContainerRef}
                className="relative w-full rounded-lg overflow-hidden cursor-pointer select-none"
                style={{ height: '16px' }}
                onMouseDown={(e) => { isDraggingHue.current = true; handleHueInteraction(e) }}
                onTouchStart={(e) => { isDraggingHue.current = true; handleHueInteraction(e) }}
              >
                <canvas
                  ref={hueCanvasRef}
                  width={512}
                  height={16}
                  className="block w-full h-full"
                />
                <div
                  className="absolute top-1/2 w-5 h-5 rounded-full pointer-events-none"
                  style={{
                    left: `${hsv.h * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: hueColor,
                    border: '2.5px solid #fff',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Preview + Hex Input */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
            <div
              className="w-10 h-10 rounded-lg border-2 border-border flex-shrink-0 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1 flex items-center bg-surface-button rounded-lg border border-border overflow-hidden">
              <span className="text-content-faint text-sm pl-3 select-none">#</span>
              <input
                type="text"
                value={hexInput.replace('#', '')}
                onChange={(e) => handleHexChange('#' + e.target.value)}
                maxLength={6}
                className="flex-1 bg-transparent text-content-primary px-1.5 py-2.5 text-sm outline-none font-mono uppercase"
                placeholder="f97316"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-surface-button text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
