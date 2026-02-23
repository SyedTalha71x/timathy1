/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Archive, X, RotateCcw, Clock, MessageCircle } from "lucide-react";

// InitialsAvatar Component (matching communications.jsx)
const InitialsAvatar = ({ firstName, lastName, size = "md", isStaff = false }) => {
  const getInitials = () => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "?";
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const bgColor = "bg-primary";

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {getInitials()}
    </div>
  );
};

const ArchiveModal = ({ 
  showArchive, 
  setShowArchive, 
  archivedChats, 
  handleRestoreChat,
  chatType = "member" // Pass chatType to determine avatar color
}) => {
  if (!showArchive) return null;

  // Helper to parse name
  const parseName = (name) => {
    const parts = name?.split(" ") || [];
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || ""
    };
  };

  // Determine if we should show image or InitialsAvatar
  const shouldShowImage = (chat) => {
    const defaultAvatar = "/gray-avatar-fotor-20250912192528.png";
    return chat.logo && 
           chat.logo !== defaultAvatar && 
           !chat.logo?.includes('placeholder') &&
           (chat.id === 100 || chat.logo.startsWith('http') || chat.logo.startsWith('/uploads'));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowArchive(false)}
    >
      <div 
        className="bg-surface-card rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden border border-border shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Archive className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-content-primary">Archived Chats</h2>
              <p className="text-content-faint text-xs">{archivedChats.length} conversation{archivedChats.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowArchive(false)}
            className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {archivedChats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-content-muted font-medium">No archived chats</p>
              <p className="text-content-faint text-sm mt-1">Archived conversations will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedChats.map((chat) => {
                const { firstName, lastName } = parseName(chat.name);
                const showImage = shouldShowImage(chat);
                const isStaffChat = chatType === "company" && chat.id !== 100;
                
                return (
                  <div
                    key={chat.id}
                    className="flex items-center gap-3 p-3 bg-surface-base rounded-xl hover:bg-surface-hover transition-all group border border-border"
                  >
                    {/* Avatar */}
                    {showImage ? (
                      <img
                        src={chat.logo}
                        alt={chat.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <InitialsAvatar 
                        firstName={firstName}
                        lastName={lastName}
                        size="lg"
                        isStaff={isStaffChat}
                      />
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-content-primary text-sm truncate">{chat.name}</p>
                      <p className="text-xs text-content-faint truncate mt-0.5 flex items-center gap-1">
                        <MessageCircle size={10} />
                        {chat.message?.length > 40
                          ? chat.message.substring(0, 40) + "..."
                          : chat.message || "No messages"}
                      </p>
                      <p className="text-[10px] text-content-faint mt-1 flex items-center gap-1">
                        <Clock size={9} />
                        {chat.time}
                      </p>
                    </div>
                    
                    {/* Restore Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreChat(chat.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-medium transition-colors opacity-80 group-hover:opacity-100"
                    >
                      <RotateCcw size={12} />
                      Restore
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {archivedChats.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-surface-dark">
            <p className="text-xs text-content-faint text-center">
              Click "Restore" to move a chat back to your inbox
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveModal;
