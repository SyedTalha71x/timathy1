/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"

const FolderModal = ({ 
  isOpen, 
  onClose, 
  folder = null, 
  onSave,
  title = "Create New Folder"
}) => {
  const [folderName, setFolderName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name)
    } else {
      setFolderName("")
    }
    setError("")
  }, [folder, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!folderName.trim()) {
      setError("Please enter a folder name")
      return
    }
    
    onSave(folderName.trim())
    setFolderName("")
    onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              {title}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-zinc-700 rounded-lg text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value)
                    setError("")
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm ${
                    error ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter folder name"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  {folder ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FolderModal