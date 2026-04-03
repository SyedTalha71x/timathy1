/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Palette } from "lucide-react"
import { useTranslation } from "react-i18next"
import ColorPickerModal from "./ColorPickerModal"

// Read the primary color from the global CSS variable --color-primary
const getPrimaryColor = () => {
  if (typeof document === 'undefined') return '#f97316'
  const value = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
  return value || '#f97316'
}

// Default folder colors - same as media library
export const folderColors = [
  '#FF843E', // Orange
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange variant
]

const SharedFolderModal = ({
  isOpen,
  onClose,
  folder = null,
  onSave,
  defaultColor = null,
  showColorPicker = true,
  showDefaultCheckbox = false,
  title
}) => {
  const { t } = useTranslation()
  const resolvedDefault = defaultColor || getPrimaryColor()

  const [folderName, setFolderName] = useState("")
  const [folderColor, setFolderColor] = useState(resolvedDefault)
  const [isDefault, setIsDefault] = useState(false)
  const [error, setError] = useState("")
  const [showColorPickerModal, setShowColorPickerModal] = useState(false)

  const isEditMode = !!folder

  useEffect(() => {
    if (isOpen) {
      if (folder) {
        setFolderName(folder.name || "")
        setFolderColor(folder.color || resolvedDefault)
        setIsDefault(folder.isDefault || false)
      } else {
        setFolderName("")
        setFolderColor(resolvedDefault)
        setIsDefault(false)
      }
      setError("")
    }
  }, [folder, isOpen, resolvedDefault])

  const handleSubmit = (e) => {
    e?.preventDefault()

    if (!folderName.trim()) {
      setError(t("common.folderModal.errorEmpty"))
      return
    }

    if (folderName.trim().length < 2) {
      setError(t("common.folderModal.errorMinLength"))
      return
    }

    onSave({
      name: folderName.trim(),
      color: folderColor,
      isDefault: isDefault
    })
    
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose()
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!isOpen) return null

  const modalTitle = title || (isEditMode ? t("common.folderModal.editTitle") : t("common.folderModal.createTitle"))

  return (
    <>
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-surface-card rounded-2xl w-full max-w-md mx-4 border border-border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-content-primary">{modalTitle}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-hover rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-content-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Folder Name */}
            <div>
              <label className="block text-sm text-content-muted mb-1.5">{t("common.folderModal.folderName")}</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value)
                  setError("")
                }}
                className={`w-full bg-surface-dark border rounded-xl py-2.5 px-4 text-content-primary focus:outline-none transition-colors ${
                  error ? "border-red-500" : "border-border focus:border-primary"
                }`}
                placeholder={t("common.folderModal.folderNamePlaceholder")}
                autoFocus
                maxLength={50}
              />
              {error && (
                <p className="text-red-400 text-xs mt-1.5">{error}</p>
              )}
            </div>

            {/* Color Picker */}
            {showColorPicker && (
              <div>
                <label className="block text-sm text-content-muted mb-1.5">{t("common.folderModal.color")}</label>
                <button
                  type="button"
                  onClick={() => setShowColorPickerModal(true)}
                  className="flex items-center gap-3 w-full p-3 bg-surface-dark border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div 
                    className="w-9 h-9 rounded-xl flex-shrink-0 border-2 border-border"
                    style={{ backgroundColor: folderColor }}
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-content-primary font-mono uppercase">{folderColor}</p>
                    <p className="text-xs text-content-faint">{t("common.folderModal.clickToChangeColor")}</p>
                  </div>
                  <Palette size={18} className="text-content-muted" />
                </button>
              </div>
            )}

            {/* Default Checkbox */}
            {showDefaultCheckbox && isEditMode && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="primary-check"
                />
                <span className="text-content-secondary text-sm">{t("common.folderModal.setAsDefault")}</span>
              </label>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors"
              >
                {isEditMode ? t("common.folderModal.save") : t("common.folderModal.create")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={showColorPickerModal}
        onClose={() => setShowColorPickerModal(false)}
        onSelectColor={(color) => setFolderColor(color)}
        currentColor={folderColor}
        title={t("common.folderModal.folderColor")}
      />
    </>
  )
}

export default SharedFolderModal
