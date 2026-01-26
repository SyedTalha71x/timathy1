/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Pipette } from "lucide-react"

// Default folder colors - same as media library
export const folderColors = [
  '#FF843E', // Orange (default)
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
  defaultColor = '#FF843E',
  showColorPicker = true,
  showDefaultCheckbox = false,
  title
}) => {
  const [folderName, setFolderName] = useState("")
  const [folderColor, setFolderColor] = useState(defaultColor)
  const [isDefault, setIsDefault] = useState(false)
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false)
  const [error, setError] = useState("")

  const isEditMode = !!folder

  useEffect(() => {
    if (isOpen) {
      if (folder) {
        setFolderName(folder.name || "")
        setFolderColor(folder.color || defaultColor)
        setIsDefault(folder.isDefault || false)
      } else {
        setFolderName("")
        setFolderColor(defaultColor)
        setIsDefault(false)
      }
      setError("")
      setShowCustomColorPicker(false)
    }
  }, [folder, isOpen, defaultColor])

  const isPresetColor = folderColors.includes(folderColor)

  const handleSubmit = (e) => {
    e?.preventDefault()

    if (!folderName.trim()) {
      setError("Please enter a folder name")
      return
    }

    if (folderName.trim().length < 2) {
      setError("Folder name must be at least 2 characters")
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

  const modalTitle = title || (isEditMode ? "Edit Folder" : "Create Folder")

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md mx-4 border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Folder Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value)
                setError("")
              }}
              className={`w-full bg-[#0a0a0a] border rounded-xl py-2.5 px-4 text-white focus:outline-none transition-colors ${
                error ? "border-red-500" : "border-[#333333] focus:border-orange-500"
              }`}
              placeholder="Enter folder name"
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
              <label className="block text-sm text-gray-400 mb-1.5">Color</label>
              <div className="space-y-3">
                {/* Preset Colors */}
                <div className="flex gap-2 flex-wrap">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setFolderColor(color)
                        setShowCustomColorPicker(false)
                      }}
                      className={`w-9 h-9 rounded-xl transition-all ${
                        folderColor === color && !showCustomColorPicker
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1C] scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  
                  {/* Custom Color Button */}
                  <button
                    type="button"
                    onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                    className={`w-9 h-9 rounded-xl transition-all border-2 border-dashed flex items-center justify-center ${
                      showCustomColorPicker || (!isPresetColor && folderColor)
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-[#444444] hover:border-orange-500/50 bg-[#0a0a0a]'
                    }`}
                    title="Custom color"
                  >
                    <Pipette size={16} className={showCustomColorPicker || !isPresetColor ? 'text-orange-500' : 'text-gray-500'} />
                  </button>
                </div>

                {/* Custom Color Picker */}
                {showCustomColorPicker && (
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#333333]">
                    <div className="relative">
                      <input
                        type="color"
                        value={folderColor}
                        onChange={(e) => setFolderColor(e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[#333333] bg-transparent"
                        style={{ padding: 0 }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-500 text-xs mb-1 block">Hex Color</label>
                      <input
                        type="text"
                        value={folderColor}
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                            setFolderColor(value || '#')
                          }
                        }}
                        className="w-full bg-[#141414] border border-[#333333] rounded-lg py-2 px-3 text-white text-sm font-mono uppercase focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="#FF843E"
                      />
                    </div>
                  </div>
                )}

                {/* Show current custom color if not a preset */}
                {!isPresetColor && !showCustomColorPicker && folderColor && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div 
                      className="w-4 h-4 rounded border border-[#333333]"
                      style={{ backgroundColor: folderColor }}
                    />
                    <span>Custom: {folderColor}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Default Checkbox */}
          {showDefaultCheckbox && isEditMode && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0a0a0a] border-[#333333] text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-300 text-sm">Set as default folder</span>
            </label>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
            >
              {isEditMode ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedFolderModal
