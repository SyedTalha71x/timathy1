/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Archive, X } from "lucide-react";

const ArchiveModal = ({ showArchive, setShowArchive, archivedChats, handleRestoreChat }) => {
  if (!showArchive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#181818] rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-[#181818] z-10 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Chats
          </h2>
          <button
            onClick={() => setShowArchive(false)}
            className="p-2 hover:bg-zinc-700 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {archivedChats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Archive className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No archived chats</p>
            </div>
          ) : (
            archivedChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer transition-colors"
                onClick={() => handleRestoreChat(chat.id)}
              >
                <img
                  src={chat.logo || "/placeholder.svg?height=32&width=32"}
                  alt={`${chat.name}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{chat.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.message.length > 50
                      ? chat.message.substring(0, 50) + "..."
                      : chat.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestoreChat(chat.id);
                  }}
                  className="px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                >
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
