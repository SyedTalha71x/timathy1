/* eslint-disable react/prop-types */
import { X, MessageCircle, Mail } from "lucide-react";

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = 48, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  return (
    <div
      className={`bg-secondary rounded-xl flex items-center justify-center text-white font-semibold ${className}`}
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
  context = "member",
}) => {
  if (!isOpen || !member) return null;

  const avatarImage = member.image || member.img;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
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
              />
            )}
            <div>
              <h3 className="text-content-primary font-medium">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-content-muted text-sm">Send Message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="text-content-muted text-sm mb-4 text-center">
            How would you like to send the message?
          </p>

          {/* App Chat Option */}
          <button
            onClick={() => {
              onSelectAppChat();
              onClose();
            }}
            className="w-full bg-surface-dark hover:bg-surface-button border border-transparent hover:border-primary/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-secondary/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-content-primary font-medium text-sm">App Chat</h4>
                <p className="text-content-faint text-xs mt-0.5">
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
            className="w-full bg-surface-dark hover:bg-surface-button border border-transparent hover:border-primary/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-content-primary font-medium text-sm">Email</h4>
                <p className="text-content-faint text-xs mt-0.5">
                  Send an email to {member.email || "member"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageTypeSelectionModal;
