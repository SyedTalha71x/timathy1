/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export default function CreateMessageModal({
  show,
  setShow,
  broadcastFolders,
  newMessage,
  setNewMessage,
  handleSaveNewMessage,
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-lg mx-4">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Create New Template</h2>
            <button
              onClick={() => setShow(false)}
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

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Message
              </label>
              <textarea
                value={newMessage.message}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, message: e.target.value })
                }
                className="w-full bg-[#181818] border border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm h-32 resize-none"
                placeholder="Enter your message content"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveNewMessage}
              className="w-full py-3 bg-white text-blue-600 text-sm hover:bg-gray-100 rounded-xl"
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
