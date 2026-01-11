/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"

const MessageModal = ({
  isOpen,
  onClose,
  message = null,
  onSave,
  folders = [],
  title = "Create New Message"
}) => {
  const [messageData, setMessageData] = useState({
    title: "",
    message: "",
    folderId: folders[0]?.id || ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (message) {
      setMessageData({
        title: message.title || "",
        message: message.message || "",
        folderId: message.folderId || folders[0]?.id || ""
      })
    } else {
      setMessageData({
        title: "",
        message: "",
        folderId: folders[0]?.id || ""
      })
    }
    setErrors({})
  }, [message, isOpen, folders])

  const validate = () => {
    const newErrors = {}
    
    if (!messageData.title.trim()) {
      newErrors.title = "Please enter a title"
    }
    
    if (!messageData.message.trim()) {
      newErrors.message = "Please enter a message"
    }
    
    if (!messageData.folderId) {
      newErrors.folderId = "Please select a folder"
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    onSave({
      id: message?.id || Date.now(),
      ...messageData
    })
    
    setMessageData({ title: "", message: "", folderId: folders[0]?.id || "" })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
                  Title
                </label>
                <input
                  type="text"
                  value={messageData.title}
                  onChange={(e) => {
                    setMessageData(prev => ({ ...prev, title: e.target.value }))
                    setErrors(prev => ({ ...prev, title: "" }))
                  }}
                  className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm ${
                    errors.title ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter message title"
                  autoFocus
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Folder
                </label>
                <select
                  value={messageData.folderId}
                  onChange={(e) => {
                    setMessageData(prev => ({ ...prev, folderId: Number(e.target.value) }))
                    setErrors(prev => ({ ...prev, folderId: "" }))
                  }}
                  className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm ${
                    errors.folderId ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Select folder...</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                {errors.folderId && (
                  <p className="text-red-500 text-xs mt-1">{errors.folderId}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  value={messageData.message}
                  onChange={(e) => {
                    setMessageData(prev => ({ ...prev, message: e.target.value }))
                    setErrors(prev => ({ ...prev, message: "" }))
                  }}
                  className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm h-32 ${
                    errors.message ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter message content"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
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
                  {message ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MessageModal