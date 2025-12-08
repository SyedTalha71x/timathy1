/* eslint-disable react/prop-types */
import { X, Paperclip } from "lucide-react"
import { useState } from "react"
import { WysiwygEditor } from "../configuration-components/WysiwygEditor"

export default function CreateMessageModal({
  show,
  setShow,
  broadcastFolders,
  newMessage,
  setNewMessage,
  handleSaveNewMessage,
}) {
  const [attachments, setAttachments] = useState([])

  if (!show) return null

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleMessageChange = (content) => {
    setNewMessage({ ...newMessage, message: content })
  }

  const handleClose = () => {
    setShow(false)
    setAttachments([])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Create New Template</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-blue-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Folder */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Folder
              </label>
              <select
                value={newMessage.folderId}
                onChange={(e) =>
                  setNewMessage({
                    ...newMessage,
                    folderId: Number.parseInt(e.target.value),
                  })
                }
                className="w-full bg-[#181818] border border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                {broadcastFolders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newMessage.title}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, title: e.target.value })
                }
                className="w-full bg-[#181818] border border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                placeholder="Enter message title"
              />
            </div>

            {/* Message Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Message
              </label>
              <div className="border border-slate-300/10 rounded-xl overflow-y-auto max-h-[30vh]">
                <WysiwygEditor
                  value={newMessage.message}
                  onChange={handleMessageChange}
                  placeholder="Enter your message content..."
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Attachments
              </label>
              <div className="space-y-2">
                {/* File Upload Button */}
                <label className="flex items-center gap-2 w-full bg-[#181818] border border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm cursor-pointer hover:bg-[#222222] transition-colors">
                  <Paperclip size={16} />
                  <span>Add attachments</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#181818] border border-slate-300/10 rounded-xl px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip size={14} className="text-gray-400" />
                          <span className="text-sm text-white truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleSaveNewMessage(attachments)}
              className="w-full py-3 bg-white text-blue-600 text-sm hover:bg-gray-100 rounded-xl disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={
                !newMessage.title.trim() || !newMessage.message.trim()
              }
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}