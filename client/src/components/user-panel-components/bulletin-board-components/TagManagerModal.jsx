
/* eslint-disable react/prop-types */
import { useState } from "react"

export default function TagManagerModal({ isOpen, onClose, tags, onAddTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF843E")

  if (!isOpen) return null

  const handleAddTag = () => {
    if (newTagName && newTagName.trim()) {
      onAddTag({
        id: Date.now(),
        name: newTagName,
        color: newTagColor || "#FF843E",
      })
      setNewTagName("")
      setNewTagColor("#FF843E")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Manage Tags</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full bg-[#1C1C1C] text-sm text-white px-4 py-2 rounded-lg outline-none border border-gray-700"
            />
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Color:</span>
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
              <span className="text-gray-300 text-sm">{newTagColor}</span>
            </div>
            <button
              onClick={handleAddTag}
              className="bg-[#FF843E] text-white text-sm px-4 py-2 rounded-lg mt-2 hover:bg-[#FF843E]/90 transition-colors disabled:opacity-50"
              disabled={!newTagName || !newTagName.trim()}
            >
              Add Tag
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto text-sm">
            {tags && tags.length > 0 ? (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex justify-between items-center bg-[#1C1C1C] px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteTag(tag.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">No tags created yet</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#FF843E] text-white px-6 py-2 text-sm rounded-lg hover:bg-[#FF843E]/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
