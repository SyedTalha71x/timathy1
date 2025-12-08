

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
      <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Tags</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 text-sm mb-4">Select tags for: "{task.title}"</p>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {configuredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name)
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-colors ${
                    isSelected ? "bg-[#FF843E]/20 border border-[#FF843E]" : "bg-[#1C1C1C] hover:bg-[#2F2F2F]"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {isSelected && <Check size={14} className="text-[#FF843E]" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-[#2F2F2F] text-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default TagsModal
