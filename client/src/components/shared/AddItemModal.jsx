/* eslint-disable react/prop-types */
import { X, Plus, Palette } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import ColorPickerModal from "./ColorPickerModal"

// =============================================================================
// SHARED ADD/EDIT ITEM MODAL
// =============================================================================

const getPrimaryColor = () => {
  try {
    const style = getComputedStyle(document.documentElement)
    return style.getPropertyValue('--color-primary').trim() || '#f97316'
  } catch { return '#f97316' }
}

const AddItemModal = ({
  isOpen,
  onClose,
  onSave,
  title = "Add Item",
  saveText = "Add",
  fields = [{ key: "name", label: "Name", type: "text", placeholder: "Enter name", required: true }],
  initialData = null,
}) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [colorPickerKey, setColorPickerKey] = useState(null)
  const firstInputRef = useRef(null)

  // Initialize / reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const primaryColor = getPrimaryColor()
      const initial = {}
      fields.forEach((f) => {
        if (initialData && initialData[f.key] !== undefined) {
          initial[f.key] = initialData[f.key]
        } else if (f.type === "color") {
          initial[f.key] = f.defaultValue || primaryColor
        } else if (f.type === "number") {
          initial[f.key] = f.defaultValue ?? 0
        } else {
          initial[f.key] = f.defaultValue ?? ""
        }
      })
      setFormData(initial)
      setErrors({})
      setColorPickerOpen(false)
      setColorPickerKey(null)

      // Auto-focus first text input
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const handleSave = () => {
    // Validate required fields
    const newErrors = {}
    fields.forEach((f) => {
      if (f.required) {
        const val = formData[f.key]
        if (f.type === "text" && (!val || !val.trim())) {
          newErrors[f.key] = `${f.label} is required`
        }
        if (f.type === "number" && (val === undefined || val === null || val === "")) {
          newErrors[f.key] = `${f.label} is required`
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clean text fields
    const cleaned = { ...formData }
    fields.forEach((f) => {
      if (f.type === "text" && cleaned[f.key]) {
        cleaned[f.key] = cleaned[f.key].trim()
      }
    })

    onSave?.(cleaned)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
  }

  const handleClose = () => {
    onClose?.()
  }

  // Track if first text input ref has been assigned
  let firstTextInputAssigned = false

  const renderField = (field) => {
    const value = formData[field.key]
    const error = errors[field.key]

    if (field.type === "color") {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-content-secondary">
            {field.label}
          </label>
          <button
            type="button"
            onClick={() => {
              setColorPickerKey(field.key)
              setColorPickerOpen(true)
            }}
            className="flex items-center gap-3 px-3 py-2.5 bg-surface-card rounded-xl border border-border hover:border-primary transition-colors w-full cursor-pointer group"
          >
            <div
              className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
              style={{ backgroundColor: value || getPrimaryColor() }}
            />
            <span className="text-sm text-content-muted group-hover:text-content-primary transition-colors flex-1 text-left font-mono uppercase">
              {value || getPrimaryColor()}
            </span>
            <Palette className="w-4 h-4 text-content-faint group-hover:text-content-primary transition-colors" />
          </button>
        </div>
      )
    }

    if (field.type === "number") {
      return (
        <div key={field.key} className="space-y-1.5">
          <label className="text-sm font-medium text-content-secondary">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value ?? ""}
              onChange={(e) => updateField(field.key, e.target.value === "" ? "" : Number(e.target.value))}
              onKeyDown={handleKeyDown}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              placeholder={field.placeholder || ""}
              className={`w-28 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${
                error ? "border-red-500" : "border-border focus:border-primary"
              }`}
            />
            {field.suffix && (
              <span className="text-sm text-content-muted">{field.suffix}</span>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )
    }

    // Default: text input
    // Assign ref to first text input
    const refProp = {}
    if (!firstTextInputAssigned) {
      refProp.ref = firstInputRef
      firstTextInputAssigned = true
    }

    return (
      <div key={field.key} className="space-y-1.5">
        <label className="text-sm font-medium text-content-secondary">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          {...refProp}
          type="text"
          value={value || ""}
          onChange={(e) => updateField(field.key, e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={field.placeholder || ""}
          maxLength={field.maxLength}
          className={`w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${
            error ? "border-red-500" : "border-border focus:border-primary"
          }`}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4"
        onClick={handleClose}
      >
        <div
          className="bg-surface-card w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-content-primary">{title}</h2>
            <button
              onClick={handleClose}
              className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-dark rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {fields.map(renderField)}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-sm font-medium text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {saveText}
            </button>
          </div>
        </div>
      </div>

      {/* ColorPickerModal — rendered outside the overlay so z-index stacks correctly */}
      <ColorPickerModal
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        onSelectColor={(color) => {
          if (colorPickerKey) updateField(colorPickerKey, color)
        }}
        currentColor={colorPickerKey ? (formData[colorPickerKey] || getPrimaryColor()) : getPrimaryColor()}
        title="Choose Color"
      />
    </>
  )
}

export default AddItemModal
