/* eslint-disable react/prop-types */
import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

export default function TagManagerModal({ isOpen, onClose, tags, onAddTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF843E")

  if (!isOpen) return null

  const handleAddTag = () => {
    if (newTagName && newTagName.trim()) {
      onAddTag({
        id: Date.now(),
        name: newTagName.trim(),
        color: newTagColor || "#FF843E",
      })
      setNewTagName("")
      setNewTagColor("#FF843E")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTagName.trim()) {
      handleAddTag()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Manage Tags</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add New Tag */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Add New Tag</label>
            <div className="space-y-3">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter tag name..."
                className="w-full bg-[#181818] border border-gray-700 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-blue-600 transition-colors placeholder-gray-500"
              />
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">Color:</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm font-mono">{newTagColor}</span>
                </div>
                <button
                  onClick={handleAddTag}
                  disabled={!newTagName.trim()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Existing Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Existing Tags ({tags?.length || 0})
            </label>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {tags && tags.length > 0 ? (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div 
                      key={tag.id} 
                      className="flex justify-between items-center bg-[#181818] border border-gray-700 px-4 py-3 rounded-xl group hover:border-gray-600 transition-colors"
                    >
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        title="Delete tag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No tags created yet</p>
                  <p className="text-xs mt-1">Add a tag above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
