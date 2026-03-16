import { useState, useRef, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { accessChatThunk, fetchMessagesThunk, sendMessageThunk, createGroupThunk, receiveSocketMessage, setActiveChat, clearMessages } from '../../features/communication/chatSlice'
import { socket } from '../../services/socket'
import {
  Send,
  Smile,
  MoreVertical,
  Reply,
  Copy,
  Trash2,
  X,
  Check,
  CheckCheck,
} from "lucide-react"
import EmojiPicker from '../../components/shared/EmojiPicker'
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { haptic } from '../../utils/haptic'

// ==========================================
// HIGHLIGHTED TEXT COMPONENT - for dates/times
// ==========================================
const HighlightedText = ({ text, isUserMessage }) => {
  if (!text) return null;

  const dateTimeRegex = /(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}:\d{2}(?:\s*(?:Uhr|AM|PM|am|pm))?|(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|(?:heute|morgen|gestern|übermorgen|today|tomorrow|yesterday))/gi;

  const parts = text.split(dateTimeRegex);
  const matches = text.match(dateTimeRegex) || [];

  if (matches.length === 0) {
    return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</span>;
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
            style={{ borderBottomStyle: 'dotted', paddingBottom: '1px', whiteSpace: 'pre-wrap' }}
          >
            {part}
          </span>
        );
      } else {
        result.push(<span key={`text-${index}`} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>);
      }
    }
  });

  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</span>;
};

// Truncate text for reply preview
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const studioInfo = {
  name: "FitZone Studio",
  avatar: DefaultAvatar,
  status: "online",
  lastSeen: "Active now",
  description: "Your Personal Fitness Hub"
}

const initialMessages = [
  { id: 1, text: "Welcome to FitZone Studio! 🎉", sender: "other", timestamp: "9:00 AM", isDeleted: false },
  { id: 2, text: "We're here to support your fitness journey. How can we help you today?", sender: "other", timestamp: "9:01 AM", isDeleted: false },
  { id: 3, text: "Hi! I'm excited to start my fitness journey with you all 💪", sender: "me", timestamp: "9:05 AM", status: "read", isDeleted: false },
  { id: 4, text: "That's fantastic! Our team of trainers, nutritionists, and wellness coaches are ready to guide you.", sender: "other", timestamp: "9:07 AM", isDeleted: false },
  { id: 5, text: "What are your main fitness goals? Weight loss, muscle building, or general wellness?", sender: "other", timestamp: "9:08 AM", isDeleted: false },
  { id: 6, text: "I'm mainly looking to build muscle and improve my overall strength", sender: "me", timestamp: "9:10 AM", status: "read", isDeleted: false },
  { id: 7, text: "Perfect! I'll create a personalized strength training program for you. When would you like to start?", sender: "other", timestamp: "9:12 AM", isDeleted: false },
  { id: 8, text: "Can we start this week? I'm really motivated!", sender: "me", timestamp: "9:15 AM", status: "read", isDeleted: false },
  { id: 9, text: "Absolutely! I'll also prepare a nutrition plan to support your muscle-building goals 🥗", sender: "other", timestamp: "9:17 AM", isDeleted: false }
]

export default function StudioChat() {
  const dispatch = useDispatch();
  const { studio, loading } = useSelector((state) => state.studios)
  const { messages, activeChat } = useSelector((state) => state.chats)
  // const [messages, setMessages] = useState(initialMessages)
  const [messageText, setMessageText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Message feature states
  const [activeMessageMenu, setActiveMessageMenu] = useState(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [messageReactions, setMessageReactions] = useState({})
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  // Mobile context menu
  const [mobileContextMenu, setMobileContextMenu] = useState(null)
  const [longPressTimer, setLongPressTimer] = useState(null)

  // Refs
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const mobileMessagesContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const mobileTextareaRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const messageMenuRef = useRef(null)
  const reactionPickerRef = useRef(null)

  // Auto-scroll to bottom when messages change (matching studio standard)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    if (mobileMessagesContainerRef.current) {
      mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
    }
  }, [messages])

  // Fallback scroll via messagesEndRef
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages])

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    if (typeof timestamp === 'string' && !timestamp.includes('T')) return timestamp;
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  // ==========================================
  // WHEN CHAT CHNAGES 
  //===========================================
  useEffect(() => {
    if (activeChat?._id) {
      dispatch(fetchMessagesThunk(activeChat._id))
      socket.emit("join chat", activeChat._id)
    }
  }, [activeChat, dispatch])


  // ==========================================
  // SEND MESSAGE (with reply support)
  // ==========================================
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat?._id) return
    haptic.medium()

    const messageData = {
      chatId: activeChat._id,
      content: messageText,
      replyTo: replyingTo?.id || null
    }

    dispatch(sendMessageThunk(messageData))
    socket.emit("new message", messageData)

    setMessageText("")
    setReplyingTo(null)
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // ==========================================
  // EMOJI
  // ==========================================
  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji.native)
    textareaRef.current?.focus()
    mobileTextareaRef.current?.focus()
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev)
  }

  // ==========================================
  // REACTIONS
  // ==========================================
  const handleReaction = (messageId, emoji) => {
    setMessageReactions((prev) => {
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
    setMessageReactions((prev) => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
  };

  // ==========================================
  // DELETE MESSAGE
  // ==========================================
  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, isDeleted: true, text: "" }
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

  // ==========================================
  // REPLY
  // ==========================================
  const handleReplyToMessage = (msg) => {
    if (msg.isDeleted) return;
    setReplyingTo(msg);
    setActiveMessageMenu(null);
    setMenuPosition(null);
    setMobileContextMenu(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    if (mobileTextareaRef.current) {
      mobileTextareaRef.current.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // ==========================================
  // COPY MESSAGE
  // ==========================================
  const handleCopyMessage = (msg) => {
    if (msg.isDeleted) return;
    const textToCopy = msg.text || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
    setActiveMessageMenu(null);
    setMenuPosition(null);
    setMobileContextMenu(null);
  };

  // ==========================================
  // DESKTOP MESSAGE MENU - Fixed positioning to prevent clipping
  // ==========================================
  const openMessageMenu = useCallback((messageId, buttonElement, isOwn) => {
    if (activeMessageMenu === messageId) {
      setActiveMessageMenu(null);
      setMenuPosition(null);
      return;
    }

    const rect = buttonElement.getBoundingClientRect();

    // Position menu: for own messages open to the left, for received open to the right
    const pos = {
      top: rect.top,
      ...(isOwn
        ? { right: window.innerWidth - rect.left + 4 }
        : { left: rect.right + 4 }
      ),
      isOwn
    };

    setMenuPosition(pos);
    setActiveMessageMenu(messageId);
  }, [activeMessageMenu]);

  // ==========================================
  // MOBILE LONG PRESS
  // ==========================================
  const handleTouchStart = (message, e) => {
    if (message.isDeleted) return;
    const timer = setTimeout(() => {
      haptic.medium();
      setMobileContextMenu({ messageId: message.id, message });
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div className="flex flex-col h-[92vh] bg-surface-base text-content-primary overflow-hidden select-none">
      {/* ==========================================
          DESKTOP VIEW - Hidden on mobile
          ========================================== */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
          style={{ minHeight: 0 }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${message.sender === "me" ? "justify-end" : ""} group`}
            >
              {/* Left menu for own messages */}
              {message.sender === "me" && !message.isDeleted && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => openMessageMenu(message.id, e.currentTarget, true)}
                    className="message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                  >
                    <MoreVertical size={18} className="text-content-muted" />
                  </button>
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex flex-col gap-1 ${message.sender === "me" ? "items-end" : ""} max-w-lg`}>
                {message.replyTo && !message.isDeleted && (
                  <div
                    className={`mb-2 p-2 rounded-lg text-xs border-l-2 ${message.sender === "me" ? "bg-primary/50 border-l-white" : "bg-surface-button border-l-primary"
                      }`}
                  >
                    <p className={`font-semibold mb-0.5 text-xs ${message.sender === "me" ? 'text-white' : 'text-content-primary'}`}>
                      {message.replyTo.sender === 'me' ? 'You' : studio.name}
                    </p>
                    <p className={`${message.sender === 'me' ? 'text-white/80' : 'text-content-muted'} text-xs`}>
                      {truncateText(message.replyTo.text, 50)}
                    </p>
                  </div>
                )}

                <p
                  className={`text-sm ${message.isDeleted ? "" : message.sender === "me" ? "text-white" : "text-content-primary"
                    }`}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {message.isDeleted ? (
                    <span className="flex items-center gap-1.5">
                      <Trash2 size={14} />
                      The message was deleted.
                    </span>
                  ) : (
                    <HighlightedText text={message.text} isUserMessage={message.sender === 'me'} />
                  )}
                </p>

                {/* Time and status */}
                <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${message.sender === "me" ? "text-white/70 justify-end" : "text-content-faint"
                  }`}>
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.sender === "me" && !message.isDeleted && (
                    <span className="ml-1">
                      {message.status === "read" ? <CheckCheck className="w-3.5 h-3.5 text-white" /> :
                        message.status === "delivered" ? <CheckCheck className="w-3.5 h-3.5" /> :
                          <Check className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              </div>

              {/* Right menu for received messages */}
              {message.sender !== "me" && !message.isDeleted && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => openMessageMenu(message.id, e.currentTarget, false)}
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

        {/* Reply Preview */}
        {replyingTo && (
          <div className="px-4 py-3 bg-surface-hover border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-surface-button rounded-xl p-3">
              <div className="w-1 h-10 bg-primary rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-primary text-xs font-semibold">
                  Replying to {replyingTo.sender === 'me' ? 'yourself' : studioInfo.name}
                </p>
                <p className="text-content-secondary text-sm truncate">{truncateText(replyingTo.text, 50)}</p>
              </div>
              <button
                onClick={cancelReply}
                className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 pt-4 pb-6 border-t border-border flex-shrink-0 bg-surface-base relative">
          <EmojiPicker
            isOpen={showEmojiPicker}
            onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji.native)}
            onClose={() => setShowEmojiPicker(false)}
            className="absolute bottom-full mb-2 left-4 z-[1020]"
            pickerRef={emojiPickerRef}
            ignoreCloseSelectors={['button[aria-label="emoji-picker-toggle"]']}
          />

          <div className="flex items-end gap-2 bg-surface-dark rounded-xl p-2">
            <button
              onClick={() => setShowEmojiPicker(prev => !prev)}
              aria-label="emoji-picker-toggle"
              className="p-2 hover:bg-surface-button rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Smile className="w-6 h-6 text-content-secondary" />
            </button>

            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent focus:outline-none text-sm min-w-0 resize-none overflow-y-auto leading-5 text-content-secondary placeholder-content-faint max-h-[150px]"
              style={{ height: '32px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className={`p-2 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${messageText.trim()
                ? 'bg-primary hover:bg-primary-hover text-white'
                : 'text-content-faint cursor-not-allowed'
                }`}
              aria-label="Send message"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          MOBILE VIEW - No own header, DashboardHeader handles it
          ========================================== */}
      <div className="md:hidden fixed top-[3.5rem] inset-x-0 bottom-[3.5rem] z-[30] flex flex-col bg-surface-base">
        {/* Mobile Messages Area */}
        <div
          ref={mobileMessagesContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3"
          style={{ minHeight: 0 }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-content-faint">
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${message.sender === "me" ? "items-end" : "items-start"} max-w-[80%] min-w-0`}>
                  {/* Message bubble with Long Press */}
                  <div
                    className={`rounded-xl px-3 py-2 max-w-full overflow-hidden select-none ${message.isDeleted
                      ? "bg-surface-hover"
                      : message.sender === "me"
                        ? "bg-primary"
                        : "bg-surface-button"
                      }`}
                    style={{ wordBreak: 'break-word', WebkitUserSelect: 'none', userSelect: 'none' }}
                    onTouchStart={(e) => handleTouchStart(message, e)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (!message.isDeleted) {
                        setMobileContextMenu({ messageId: message.id, message });
                      }
                    }}
                  >
                    {/* Reply preview */}
                    {message.replyTo && !message.isDeleted && (
                      <div
                        className={`mb-2 pl-2 border-l-2 ${message.sender === "me"
                          ? "border-white/40"
                          : "border-border"
                          }`}
                      >
                        <p className={`text-xs font-medium ${message.sender === "me" ? "text-white/80" : "text-content-muted"}`}>
                          {message.replyTo.sender === 'me' ? 'You' : studioInfo.name}
                        </p>
                        <p className={`text-xs truncate max-w-[200px] ${message.sender === "me" ? "text-white/60" : "text-content-faint"}`}>
                          {message.replyTo.text}
                        </p>
                      </div>
                    )}

                    {/* Message content */}
                    <p
                      className={`text-sm ${message.isDeleted
                        ? "text-content-faint italic"
                        : message.sender === "me" ? "text-white" : "text-content-primary"
                        }`}
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {message.isDeleted
                        ? "This message was deleted"
                        : (message.text || "")
                      }
                    </p>

                    {/* Time and status */}
                    <div className={`text-[11px] mt-1 flex items-center gap-1 ${message.sender === "me" ? "text-white/70 justify-end" : "text-content-faint"
                      }`}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.sender === "me" && !message.isDeleted && (
                        <span className="ml-1">
                          {message.status === "read" ? (
                            <CheckCheck className="w-3 h-3 text-white" />
                          ) : message.status === "delivered" ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reaction Display */}
                  {messageReactions[message.id] && !message.isDeleted && (
                    <div className={`flex gap-1 mt-1 ${message.sender === "me" ? "justify-end" : ""}`}>
                      <button
                        onClick={(e) => removeReaction(message.id, e)}
                        className="bg-surface-button/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-surface-button transition-colors"
                      >
                        <span>{messageReactions[message.id]}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Reply Preview */}
        {replyingTo && (
          <div className="px-3 py-2 bg-surface-hover border-t border-border flex items-center gap-3 flex-shrink-0">
            <div className="flex-1 pl-3 border-l-2 border-primary">
              <p className="text-xs font-medium text-primary">
                {replyingTo.sender === 'me' ? 'You' : studioInfo.name}
              </p>
              <p className="text-xs text-content-muted truncate">{truncateText(replyingTo.text, 50)}</p>
            </div>
            <button
              onClick={cancelReply}
              className="text-content-muted hover:text-content-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Input Area */}
        <div className="px-2 pt-1.5 pb-2.5 bg-surface-base border-t border-border flex-shrink-0 relative">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-surface-dark px-3 py-2 rounded-xl border border-border flex items-center">
              <textarea
                ref={mobileTextareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "20px";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-transparent text-content-primary outline-none text-xs resize-none max-h-[120px] leading-5 placeholder:text-content-faint"
                rows={1}
                style={{ height: '20px' }}
              />
            </div>
            <button
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${messageText.trim()
                ? 'bg-primary hover:bg-primary-hover text-white'
                : 'bg-surface-button text-content-faint'
                }`}
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              type="button"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          FIXED Desktop Message Menu (prevents overflow clipping)
          ========================================== */}
      {activeMessageMenu && menuPosition && (
        <>
          <div
            className="fixed inset-0 z-[1099]"
            onClick={() => {
              setActiveMessageMenu(null);
              setMenuPosition(null);
            }}
          />
          <div
            ref={messageMenuRef}
            className="fixed z-[1100] bg-surface-button rounded-xl shadow-xl p-1 min-w-[140px] border border-border"
            style={{
              top: `${menuPosition.top}px`,
              ...(menuPosition.isOwn
                ? { right: `${menuPosition.right}px` }
                : { left: `${menuPosition.left}px` }
              )
            }}
          >
            <button
              onClick={() => {
                const msg = messages.find(m => m.id === activeMessageMenu);
                if (msg) handleReplyToMessage(msg);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg text-content-primary flex items-center gap-2"
            >
              <Reply size={14} />
              Reply
            </button>

            <button
              onClick={() => {
                setShowReactionPicker(activeMessageMenu);
                setActiveMessageMenu(null);
                setMenuPosition(null);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg text-content-primary flex items-center gap-2"
            >
              <Smile size={14} />
              React
            </button>

            <button
              onClick={() => {
                const msg = messages.find(m => m.id === activeMessageMenu);
                if (msg) handleCopyMessage(msg);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg text-content-primary flex items-center gap-2"
            >
              <Copy size={14} />
              Copy
            </button>

            {menuPosition.isOwn && (
              <button
                onClick={() => {
                  setShowDeleteConfirm(activeMessageMenu);
                  setActiveMessageMenu(null);
                  setMenuPosition(null);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg text-red-400 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </>
      )}

      {/* ==========================================
          Mobile Context Menu (Bottom Sheet) - matching studio
          ========================================== */}
      {mobileContextMenu && (
        <div
          className="md:hidden fixed inset-0 z-[9998] flex items-end justify-center"
          onClick={() => setMobileContextMenu(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-surface-button rounded-t-2xl w-full max-w-lg p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-surface-hover rounded-full mx-auto mb-4" />

            <div className="space-y-1">
              <button
                onClick={() => {
                  handleReplyToMessage(mobileContextMenu.message);
                  setMobileContextMenu(null);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3"
              >
                <Reply size={20} />
                Reply
              </button>

              <button
                onClick={() => {
                  setShowReactionPicker(mobileContextMenu.messageId);
                  setMobileContextMenu(null);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3"
              >
                <Smile size={20} />
                React
              </button>

              <button
                onClick={() => {
                  handleCopyMessage(mobileContextMenu.message);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3"
              >
                <Copy size={20} />
                Copy
              </button>

              {mobileContextMenu.message?.sender === 'me' && (
                <button
                  onClick={() => {
                    setShowDeleteConfirm(mobileContextMenu.messageId);
                    setMobileContextMenu(null);
                  }}
                  className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl text-red-400 flex items-center gap-3"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileContextMenu(null)}
              className="w-full mt-4 px-4 py-3 text-base bg-surface-hover hover:bg-surface-button-hover rounded-xl text-content-primary font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          Delete Confirmation Modal
          ========================================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-surface-button rounded-xl p-5 mx-4 max-w-sm w-full shadow-xl border border-border">
            <h4 className="text-content-primary font-medium mb-2">Delete Message?</h4>
            <p className="text-content-muted text-sm mb-4">This message will be marked as deleted and cannot be recovered.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-surface-hover text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          Reaction Picker (Global, Desktop + Mobile)
          ========================================== */}
      {showReactionPicker && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/50"
            onClick={() => setShowReactionPicker(null)}
          />
          <div
            className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <EmojiPicker
              isOpen={true}
              onEmojiSelect={(emoji) => handleReaction(showReactionPicker, emoji.native)}
              onClose={() => setShowReactionPicker(null)}
              pickerRef={reactionPickerRef}
            />
          </div>
        </>
      )}

      {/* ==========================================
          Copied Toast
          ========================================== */}
      {showCopiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-surface-hover text-content-primary px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Copied!
        </div>
      )}
    </div>
  )
}
