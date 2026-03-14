/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { X, Plus, Trash2, Tag } from 'lucide-react'
import ColorPickerModal from './ColorPickerModal'
import toast from './SharedToast'
import { useDispatch, useSelector } from 'react-redux'
import { getTagsThunk } from '../../features/todos/todosSlice'

export default function TagManagerModal({ isOpen, onClose, onAddTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(() => {
    try {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--color-primary').trim() || '#f97316'
    } catch {
      return '#f97316'
    }
  })
  const dispatch = useDispatch()
  const { tags = [] } = useSelector((state) => state.todos || {})
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  useEffect(() => {
    dispatch(getTagsThunk())
    // console.log('all Tags', tags)
  }, [dispatch])

  // Reset form when modal opens/closes
  const handleClose = () => {
    setNewTagName("")
    setNewTagColor(primaryColor)
    onClose()
  }

  const primaryColor = (() => {
    try {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--color-primary').trim() || '#f97316'
    } catch {
      return '#f97316'
    }
  })()

  if (!isOpen) return null

  const handleAddTag = () => {
    if (newTagName && newTagName.trim()) {
      onAddTag({
        name: newTagName.trim(),
        color: newTagColor || primaryColor,
      })
      setNewTagName("")
      setNewTagColor(primaryColor)
      toast.success("Tag created")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTagName.trim()) {
      handleAddTag()
    }
  }

  const handleDeleteTag = (tagId, tagName) => {
    onDeleteTag(tagId)
    toast.success(`Tag "${tagName}" deleted`)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-content-primary">Manage Tags</h2>
          <button
            onClick={handleClose}
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
                autoFocus
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
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-surface-button disabled:text-content-faint disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Tag
            </button>
          </div>

          {/* Existing Tags */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-content-secondary">
                Existing Tags
              </label>
              <span className="text-xs text-content-faint bg-surface-button px-2 py-1 rounded-full">
                {tags?.length || 0} {tags?.length === 1 ? 'tag' : 'tags'}
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {tags && tags.length > 0 ? (
                <div className="space-y-2">
                  {[...tags].reverse().map((tag) => (
                    <div
                      key={tag.id}
                      className="flex justify-between items-center bg-surface-button p-2 rounded-lg group hover:bg-surface-hover transition-colors"
                    >
                      <span
                        className="px-3 py-1.5 rounded-md text-sm text-white flex items-center gap-2"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Tag size={14} />
                        <span className="max-w-[150px] truncate">{tag.name}</span>
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        className="text-red-500/70 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title={`Delete tag "${tag.name}"`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-content-faint bg-surface-button/30 rounded-lg">
                  <Tag size={24} className="mx-auto mb-2 opacity-30" />
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
            onClick={handleClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors"
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