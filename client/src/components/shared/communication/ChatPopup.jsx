/* eslint-disable react/prop-types */
import { X, Smile, Send, MoreVertical, Trash2, Reply, XCircle, Copy, ExternalLink, Check, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "../EmojiPicker";
import BirthdayBadge from "../BirthdayBadge";
import { memberChatListNew, staffChatListNew } from "../../../utils/studio-states";

// Initials Avatar Component - supports context for different colors
const InitialsAvatar = ({ firstName, lastName, size = 40, className = "", context = "member" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  // Always use secondary color
  const bgColor = "bg-secondary";

  return (
    <div 
      className={`${bgColor} rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  )
}

// Component to render text with highlighted dates and times - identical to communications.jsx
const HighlightedText = ({ text, isUserMessage }) => {
  if (!text) return null;
  
  const dateTimeRegex = /(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}:\d{2}(?:\s*(?:Uhr|AM|PM|am|pm))?|(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|(?:heute|morgen|gestern|übermorgen|today|tomorrow|yesterday))/gi;

  const parts = text.split(dateTimeRegex);
  const matches = text.match(dateTimeRegex) || [];

  if (matches.length === 0) {
    return <span>{text}</span>;
  }

  const result = [];
  parts.forEach((part, index) => {
    if (part) {
      const isMatch = matches.some(match => match.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        result.push(
          <span 
            key={`match-${index}`}
            className={`border-b ${isUserMessage ? 'border-white/60' : 'border-border'}`}
            style={{ borderBottomStyle: 'dotted', paddingBottom: '1px' }}
          >
            {part}
          </span>
        );
      } else {
        result.push(<span key={`text-${index}`}>{part}</span>);
      }
    }
  });

  return <>{result}</>;
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Helper function to check if today is birthday
const checkIfBirthday = (dateOfBirth) => {
  if (!dateOfBirth) return false;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
};

// Helper to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * ChatPopup - A mini chat window that mirrors communications.jsx functionality
 * 
 * @param {Object} member - The member/staff data (id, firstName, lastName, image, dateOfBirth)
 * @param {boolean} isOpen - Whether the popup is open
 * @param {function} onClose - Close handler
 * @param {function} onNavigateToChat - Optional callback when user wants to open full chat (receives member and chatType)
 * @param {string} context - "member" or "staff" - determines avatar color and navigation type
 * @param {string} communicationsPath - Path to communications page (default: "/dashboard/communication")
 * @param {Array} externalMessages - Optional: Pass messages from parent for state sync (e.g., from app-states)
 * @param {function} setExternalMessages - Optional: Setter for external messages
 * @param {Object} externalReactions - Optional: Pass reactions from parent for state sync
 * @param {function} setExternalReactions - Optional: Setter for external reactions
 */
const ChatPopup = ({ 
  member, 
  isOpen, 
  onClose, 
  onNavigateToChat,
  context = "member",
  communicationsPath = "/dashboard/communication", // Configurable path
  // Optional: External state management for syncing with parent component
  externalMessages = null,
  setExternalMessages = null,
  externalReactions = null,
  setExternalReactions = null,
}) => {
  const navigate = useNavigate();
  
  // Use external state if provided, otherwise use local state
  const [localMessages, setLocalMessages] = useState([]);
  const [localReactions, setLocalReactions] = useState({});
  
  const messages = externalMessages !== null ? externalMessages : localMessages;
  const setMessages = setExternalMessages || setLocalMessages;
  const messageReactions = externalReactions !== null ? externalReactions : localReactions;
  const setMessageReactions = setExternalReactions || setLocalReactions;

  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, openLeft: false });
  
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageMenuRef = useRef(null);

  // Get full name and birthday info
  const memberFullName = member.name || `${member.firstName} ${member.lastName}`;
  const isBirthday = checkIfBirthday(member.dateOfBirth);
  
  // Track last loaded member to detect changes
  const lastLoadedMemberRef = useRef(null);

  // Initialize with messages from app-states if no external messages provided
  useEffect(() => {
    if (externalMessages !== null) return; // External messages provided, don't load from app-states
    if (!isOpen) return; // Not open, don't load
    
    // Check if we need to reload (new member or first load)
    const currentMemberId = member.id;
    if (lastLoadedMemberRef.current === currentMemberId && localMessages.length > 0) {
      return; // Same member, already loaded
    }
    
    // Find existing chat data from app-states
    let existingChat = null;
    
    if (context === "member") {
      existingChat = memberChatListNew.find(c => 
        c.memberId === member.id || c.id === member.id
      );
    } else if (context === "staff") {
      existingChat = staffChatListNew.find(c => 
        c.staffId === member.id || c.id === member.id
      );
    }
    
    if (existingChat && existingChat.messages && existingChat.messages.length > 0) {
      // Use existing messages from app-states
      setLocalMessages(existingChat.messages.map(msg => ({
        ...msg,
        isDeleted: msg.isDeleted || false,
      })));
    } else {
      // No existing chat - start with empty messages
      setLocalMessages([]);
    }
    
    lastLoadedMemberRef.current = currentMemberId;
  }, [member.id, context, externalMessages, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const now = new Date();
    const newMessage = {
      id: Date.now(),
      content: message,
      sender: 'You',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString(),
      status: 'sent',
      isDeleted: false,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender
      } : null
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '32px';
    }

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 3000);
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isDeleted: true, content: '' }
        : msg
    ));
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
    setShowDeleteConfirm(null);
    setActiveMessageMenu(null);
  };

  const handleCopyMessage = (msg) => {
    if (msg.isDeleted) return;
    const textToCopy = msg.content || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
    setActiveMessageMenu(null);
  };

  const handleReplyToMessage = (msg) => {
    if (msg.isDeleted) return;
    setReplyingTo(msg);
    setActiveMessageMenu(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Open message menu with calculated position
  const handleOpenMessageMenu = (msgId, event, isOwnMessage) => {
    if (activeMessageMenu === msgId) {
      setActiveMessageMenu(null);
      return;
    }
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const menuHeight = 180; // Approximate menu height
    const menuWidth = 150;
    
    // Calculate position - check if menu would go off screen
    let top = rect.top;
    let left = isOwnMessage ? rect.right + 4 : rect.left - menuWidth - 4;
    
    // If menu would go below viewport, position it above
    if (top + menuHeight > window.innerHeight - 20) {
      top = window.innerHeight - menuHeight - 20;
    }
    
    // If menu would go above viewport
    if (top < 20) {
      top = 20;
    }
    
    // If menu would go off left side
    if (left < 10) {
      left = rect.right + 4;
    }
    
    // If menu would go off right side
    if (left + menuWidth > window.innerWidth - 10) {
      left = rect.left - menuWidth - 4;
    }
    
    setMenuPosition({ top, left, openLeft: !isOwnMessage });
    setActiveMessageMenu(msgId);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      if (newReactions[messageId] === emoji) {
        delete newReactions[messageId];
      } else {
        newReactions[messageId] = emoji;
      }
      return newReactions;
    });
    setShowReactionPicker(null);
    setActiveMessageMenu(null);
  };

  const removeReaction = (messageId, e) => {
    e.stopPropagation();
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
  };

  // Navigate to full communications chat
  const handleOpenFullChat = () => {
    const chatType = context === "staff" ? "company" : "member";
    
    if (onNavigateToChat) {
      // Use custom handler if provided
      onNavigateToChat(member, chatType);
    } else {
      // Default: Navigate with state
      navigate(communicationsPath, { 
        state: { 
          openChatId: member.id,
          openChatType: chatType,
        },
        replace: false
      });
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface-card rounded-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              {member.image || member.logo ? (
                <img 
                  src={member.image || member.logo} 
                  alt={memberFullName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <InitialsAvatar 
                  firstName={member.firstName} 
                  lastName={member.lastName} 
                  size={40}
                  context={context}
                />
              )}
              <BirthdayBadge 
                show={isBirthday}
                dateOfBirth={member.dateOfBirth}
                size="ms"
                withTooltip={true}
              />
            </div>
            <div>
              <p className="text-content-primary font-medium">{memberFullName}</p>
              <p className="text-content-muted text-xs">
                {context === "staff" ? "Staff Member" : "Member"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Open Full Chat Button */}
            <button
              onClick={handleOpenFullChat}
              className="p-2 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary"
              title="Open in Communications"
            >
              <ExternalLink size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Copied Toast - identical to communications.jsx */}
        {showCopiedToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-surface-dark text-content-primary px-4 py-2 rounded-lg shadow-lg z-[1100] flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            Copied to clipboard
          </div>
        )}

        {/* Messages Area - identical structure to communications.jsx */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 ${msg.sender === 'You' ? 'justify-end' : ''} group`}
            >
              {/* Menu button - LEFT side for own messages */}
              {msg.sender === 'You' && !msg.isDeleted && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => handleOpenMessageMenu(msg.id, e, true)}
                    className="message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                  >
                    <MoreVertical size={18} className="text-content-muted" />
                  </button>
                </div>
              )}

              <div className={`flex flex-col gap-1 ${msg.sender === 'You' ? 'items-end' : ''} max-w-[75%]`}>
                <div
                  className={`rounded-xl p-3 ${
                    msg.isDeleted
                      ? "bg-surface-dark/50 text-content-faint italic"
                      : msg.sender === 'You'
                        ? "bg-primary"
                        : "bg-surface-dark"
                  }`}
                >
                  {/* Reply Preview - identical to communications.jsx */}
                  {msg.replyTo && !msg.isDeleted && (
                    <div
                      className={`mb-2 p-2 rounded-lg text-xs border-l-2 ${
                        msg.sender === 'You'
                          ? "bg-primary-hover/50 border-l-primary"
                          : "bg-surface-button border-l-primary"
                      }`}
                    >
                      <p className={`font-semibold mb-0.5 text-xs ${msg.sender === "You" ? "text-white" : "text-content-primary"}`}>
                        {msg.replyTo.sender === 'You' ? 'You' : msg.replyTo.sender}
                      </p>
                      <p className={`${msg.sender === 'You' ? 'text-white/80' : 'text-content-muted'} text-xs`}>
                        {truncateText(msg.replyTo.content, 50)}
                      </p>
                    </div>
                  )}

                  {/* Message Content - identical to communications.jsx */}
                  <p 
                    className={`text-sm ${msg.isDeleted ? "" : msg.sender === "You" ? "text-white" : "text-content-primary"}`}
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {msg.isDeleted ? (
                      <span className="flex items-center gap-1.5">
                        <Trash2 size={14} />
                        The message was deleted.
                      </span>
                    ) : (
                      <HighlightedText text={msg.content} isUserMessage={msg.sender === 'You'} />
                    )}
                  </p>

                  {/* Time and status - IDENTICAL to communications.jsx */}
                  <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                    msg.sender === "You" ? "text-white/70 justify-end" : "text-content-faint"
                  }`}>
                    <span>{msg.time || formatTimestamp(msg.timestamp)}</span>
                    {msg.sender === "You" && !msg.isDeleted && (
                      <span className="ml-1">
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/70" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reaction Display - identical to communications.jsx */}
                {messageReactions[msg.id] && !msg.isDeleted && (
                  <div className={`flex gap-1 ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <button
                      onClick={(e) => removeReaction(msg.id, e)}
                      className="bg-surface-button/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-surface-button-hover transition-colors group/reaction"
                      title="Click to remove"
                    >
                      <span>{messageReactions[msg.id]}</span>
                      <span className="opacity-0 group-hover/reaction:opacity-100 text-xs text-content-muted">✕</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Menu button - RIGHT side for received messages */}
              {msg.sender !== 'You' && !msg.isDeleted && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => handleOpenMessageMenu(msg.id, e, false)}
                    className="message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                  >
                    <MoreVertical size={18} className="text-content-muted" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Message Menu - positioned dynamically */}
        {activeMessageMenu && (
          <>
            <div 
              className="fixed inset-0 z-[1099]"
              onClick={() => setActiveMessageMenu(null)}
            />
            <div
              ref={messageMenuRef}
              className="fixed z-[1100] bg-surface-dark rounded-xl shadow-xl p-1 min-w-[140px] border border-border"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
            >
              {(() => {
                const activeMsg = messages.find(m => m.id === activeMessageMenu);
                if (!activeMsg) return null;
                const isOwnMessage = activeMsg.sender === 'You';
                
                return (
                  <>
                    <button
                      onClick={() => handleReplyToMessage(activeMsg)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2"
                    >
                      <Reply size={14} />
                      Reply
                    </button>
                    <button
                      onClick={() => {
                        setShowReactionPicker(activeMsg.id);
                        setActiveMessageMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2"
                    >
                      <Smile size={14} />
                      React
                    </button>
                    <button
                      onClick={() => handleCopyMessage(activeMsg)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                    {isOwnMessage && (
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(activeMsg.id);
                          setActiveMessageMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-red-400 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </>
        )}

        {/* Overlay for Reaction Picker */}
        {showReactionPicker && (
          <div 
            className="fixed inset-0 bg-black/30 z-[1098]"
            onClick={() => setShowReactionPicker(null)}
          />
        )}

        {/* Reaction Picker */}
        <EmojiPicker
          isOpen={!!showReactionPicker}
          onEmojiSelect={(emoji) => handleReaction(showReactionPicker, emoji.native)}
          onClose={() => setShowReactionPicker(null)}
          className="fixed z-[1099]"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[1100] rounded-xl">
            <div className="bg-surface-dark rounded-xl p-4 mx-4 max-w-sm w-full shadow-xl border border-border">
              <h4 className="text-content-primary font-medium mb-2">Delete Message?</h4>
              <p className="text-content-muted text-sm mb-4">This message will be deleted permanently.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMessage(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply Preview Bar - identical to communications.jsx */}
        {replyingTo && (
          <div className="px-4 pt-2 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-2 bg-surface-dark/80 rounded-lg p-2.5">
              <div className="w-1 h-10 bg-primary rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-primary text-xs font-semibold">
                  Replying to {replyingTo.sender === 'You' ? 'yourself' : replyingTo.sender}
                </p>
                <p className="text-content-secondary text-sm truncate">
                  {truncateText(replyingTo.content, 40)}
                </p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 text-content-muted hover:text-content-primary transition-colors flex-shrink-0"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Input - identical to communications.jsx */}
        <div className="p-4 border-t border-border flex-shrink-0 relative">
          <div className="flex items-end gap-2 bg-surface-dark rounded-xl p-2">
            <button
              className="p-2 hover:bg-surface-button rounded-lg flex items-center justify-center transition-colors"
              aria-label="Add emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5 text-content-muted" />
            </button>

            <textarea
              ref={textareaRef}
              placeholder="Type your message..."
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none overflow-hidden text-content-primary placeholder-content-faint max-h-[120px] leading-8"
              rows={1}
              style={{ height: '32px' }}
              value={message}
              onInput={(e) => {
                e.target.style.height = "32px";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                message.trim() 
                  ? 'bg-primary hover:bg-primary-hover text-white' 
                  : 'text-content-faint cursor-not-allowed'
              }`}
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <EmojiPicker
            isOpen={showEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            className="absolute bottom-20 left-4 z-[1020]"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
