/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { X, AlertCircle } from "lucide-react"

// Get variables based on audience type
const getInsertVariables = (audienceType) => {
  if (audienceType === "staff") {
    return [
      { id: 'first_name', label: 'Staff First Name', value: '{Staff_First_Name}' },
      { id: 'last_name', label: 'Staff Last Name', value: '{Staff_Last_Name}' },
      { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
    ]
  }
  return [
    { id: 'first_name', label: 'Member First Name', value: '{Member_First_Name}' },
    { id: 'last_name', label: 'Member Last Name', value: '{Member_Last_Name}' },
    { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
  ]
}

const MessageModal = ({
  isOpen,
  onClose,
  message = null,
  onSave,
  folders = [],
  title = "Create New Message",
  audienceType = "member"
}) => {
  const [messageData, setMessageData] = useState({
    title: "",
    message: "",
    folderId: ""
  })
  const [errors, setErrors] = useState({})
  const textareaRef = useRef(null)

  // Get variables for current audience
  const insertVariables = getInsertVariables(audienceType)

  // Insert variable into textarea
  const insertVariable = (variable) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = messageData.message
      const newText = text.substring(0, start) + variable.value + text.substring(end)
      setMessageData(prev => ({ ...prev, message: newText }))
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.value.length
        textarea.focus()
      }, 0)
    }
  }

  useEffect(() => {
    if (isOpen) {
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
    }
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
      ...messageData,
      folderId: Number(messageData.folderId)
    })

    setMessageData({ title: "", message: "", folderId: folders[0]?.id || "" })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] border border-gray-800/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-white">
            {message ? "Edit Push Template" : "Create Push Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                value={messageData.title}
                onChange={(e) => {
                  setMessageData(prev => ({ ...prev, title: e.target.value }))
                  setErrors(prev => ({ ...prev, title: "" }))
                }}
                className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.title ? "ring-2 ring-red-500/50" : ""
                }`}
                placeholder="Enter notification title..."
                autoFocus
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Folder
              </label>
              <select
                value={messageData.folderId}
                onChange={(e) => {
                  setMessageData(prev => ({ ...prev, folderId: e.target.value }))
                  setErrors(prev => ({ ...prev, folderId: "" }))
                }}
                className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.folderId ? "ring-2 ring-red-500/50" : ""
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
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.folderId}
                </p>
              )}
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message Content
              </label>

              {/* Variables Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-gray-500">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {variable.label}
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                value={messageData.message}
                onChange={(e) => {
                  setMessageData(prev => ({ ...prev, message: e.target.value }))
                  setErrors(prev => ({ ...prev, message: "" }))
                }}
                className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                  errors.message ? "ring-2 ring-red-500/50" : ""
                }`}
                placeholder="Enter your push notification message..."
                rows={10}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all"
            >
              {message ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageModal
