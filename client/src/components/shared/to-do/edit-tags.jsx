

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Check } from "lucide-react"

const TagsModal = ({ task, configuredTags, onClose, onUpdate }) => {
  const [selectedTags, setSelectedTags] = useState([...task.tags])

  const toggleTag = (tagName) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const handleSave = () => {
    onUpdate({ ...task, tags: selectedTags })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-content-primary">Edit Tags</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-content-secondary text-sm mb-4">Select tags for: "{task.title}"</p>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {configuredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name)
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-colors ${
                    isSelected ? "bg-primary/20 border border-primary" : "bg-surface-base hover:bg-surface-button"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {isSelected && <Check size={14} className="text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-surface-button text-sm text-content-secondary px-4 py-2 rounded-xl hover:bg-surface-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-orange-500 text-sm text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default TagsModal
