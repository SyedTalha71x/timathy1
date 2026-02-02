/* eslint-disable react/prop-types */
import { X, MessageCircle, Mail } from "lucide-react";

// Initials Avatar Component - supports context for different colors
const InitialsAvatar = ({ firstName, lastName, size = 48, className = "", context = "member" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  // Staff uses blue, members use orange
  const bgColor = context === "staff" ? "bg-blue-600" : "bg-orange-500";

  return (
    <div
      className={`${bgColor} rounded-xl flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  );
};

const MessageTypeSelectionModal = ({
  isOpen,
  onClose,
  member,
  onSelectAppChat,
  onSelectEmail,
  context = "member", // "member" | "staff"
}) => {
  if (!isOpen || !member) return null;

  // Support both image and img properties
  const avatarImage = member.image || member.img;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-11 h-11 rounded-xl object-cover"
                />
              ) : (
                <InitialsAvatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  size={44}
                  context={context}
                />
              )}
              <div>
                <h3 className="text-white font-medium">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-gray-400 text-sm">Send Message</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          <p className="text-gray-400 text-sm mb-4 text-center">
            How would you like to send the message?
          </p>

          {/* App Chat Option */}
          <button
            onClick={() => {
              onSelectAppChat();
              onClose();
            }}
            className="w-full bg-[#222222] hover:bg-[#2a2a2a] border border-gray-800 hover:border-blue-500/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-white font-medium text-sm">App Chat</h4>
                <p className="text-gray-500 text-xs mt-0.5">
                  Send a direct message in the app
                </p>
              </div>
            </div>
          </button>

          {/* Email Option */}
          <button
            onClick={() => {
              onSelectEmail();
              onClose();
            }}
            className="w-full bg-[#222222] hover:bg-[#2a2a2a] border border-gray-800 hover:border-orange-500/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-white font-medium text-sm">Email</h4>
                <p className="text-gray-500 text-xs mt-0.5">
                  Send an email to {member.email || "member"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageTypeSelectionModal;
