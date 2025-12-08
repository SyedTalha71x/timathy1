/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { X } from "lucide-react"

const BirthdayMessageModal = ({
  isOpen,
  onClose,
  selectedBirthdayPerson,
  birthdayMessage,
  setBirthdayMessage,
  handleSendCustomBirthdayMessage,
}) => {
  if (!isOpen || !selectedBirthdayPerson) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Send Birthday Message</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* Person Info */}
          <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
            <img
              src={selectedBirthdayPerson.avatar || "/placeholder.svg"}
              className="h-10 w-10 rounded-xl"
              alt={selectedBirthdayPerson.name}
            />
            <div>
              <h3 className="font-semibold text-sm">{selectedBirthdayPerson.name}</h3>
              <p className="text-xs text-zinc-400">Birthday: {selectedBirthdayPerson.date}</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">Your Message</label>
            <textarea
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full p-3 bg-black rounded-xl text-sm outline-none resize-none"
              rows={4}
              placeholder="Write your birthday message..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSendCustomBirthdayMessage}
              disabled={!birthdayMessage.trim()}
              className={`px-4 py-2 text-sm rounded-xl ${
                !birthdayMessage.trim()
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BirthdayMessageModal
