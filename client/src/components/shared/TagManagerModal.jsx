/* eslint-disable react/prop-types */
import { useState } from 'react'
import { X, Plus, Trash2, Tag } from 'lucide-react'
import ColorPickerModal from './ColorPickerModal'

export default function TagManagerModal({ isOpen, onClose, tags, onAddTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(() => {
    try {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--color-primary').trim() || '#f97316'
    } catch { return '#f97316' }
  })
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  const primaryColor = (() => {
    try {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--color-primary').trim() || '#f97316'
    } catch { return '#f97316' }
  })()

  if (!isOpen) return null

  const handleAddTag = () => {
    if (newTagName && newTagName.trim()) {
      onAddTag({
        id: Date.now(),
        name: newTagName.trim(),
        color: newTagColor || primaryColor,
      })
      setNewTagName("")
      setNewTagColor(primaryColor)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTagName.trim()) {
      handleAddTag()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-content-primary">Manage Tags</h2>
          <button 
            onClick={onClose} 
            className="text-content-muted hover:text-content-primary transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add New Tag */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-content-secondary mb-3">Create New Tag</label>
            <div className="flex gap-2 mb-3 items-center">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tag name"
                className="flex-1 bg-surface-button text-content-primary rounded-lg px-3 py-2.5 text-sm border border-border focus:border-primary outline-none"
              />
              <button
                onClick={() => setIsColorPickerOpen(true)}
                className="relative w-10 h-10 rounded-lg flex-shrink-0 border-2 border-border hover:border-content-muted transition-colors shadow-sm"
                style={{ backgroundColor: newTagColor }}
                title="Choose color"
              />
            </div>
            <button
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              className="w-full py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-surface-button disabled:text-content-faint disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Tag
            </button>
          </div>

          {/* Existing Tags */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-3">
              Existing Tags ({tags?.length || 0})
            </label>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {tags && tags.length > 0 ? (
                <div className="space-y-2">
                  {[...tags].reverse().map((tag) => (
                    <div 
                      key={tag.id} 
                      className="flex justify-between items-center bg-surface-button p-3 rounded-lg"
                    >
                      <span 
                        className="px-3 py-1.5 rounded-md text-sm text-white flex items-center gap-2"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Tag size={14} />
                        {tag.name}
                      </span>
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2"
                        title="Delete tag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-content-faint">
                  <p className="text-sm">No tags created yet</p>
                  <p className="text-xs mt-1">Add a tag above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        onSelectColor={(color) => setNewTagColor(color)}
        currentColor={newTagColor}
        title="Tag Color"
      />
    </div>
  )
}
