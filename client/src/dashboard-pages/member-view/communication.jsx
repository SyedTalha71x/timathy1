import { useState, useRef, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import { accessStudioChatThunk, fetchMessagesThunk, sendMessageThunk, receiveSocketMessage, setActiveChat } from '../../features/communication/chatSlice'
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
  MessageCircle,
} from "lucide-react"
import EmojiPicker from '../../components/shared/EmojiPicker'
import { haptic } from '../../utils/haptic'

// ==========================================
// HIGHLIGHTED TEXT COMPONENT
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

const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function StudioChat() {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)
  const { studio } = useSelector((state) => state.studios)
  const chatState = useSelector((state) => state.chats) || {}
  const { messages: rawMessages = [], activeChat } = chatState
  
  // Ensure messages is always an array
  const messages = Array.isArray(rawMessages) ? rawMessages : []
  
  const [messageText, setMessageText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

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
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  // Refs
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const mobileMessagesContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const mobileTextareaRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const messageMenuRef = useRef(null)
  const reactionPickerRef = useRef(null)

  // ==========================================
  // INITIALIZE STUDIO CHAT
  // ==========================================
  useEffect(() => {
    dispatch(accessStudioChatThunk());
  }, [dispatch]);

  // ==========================================
  // SOCKET.IO SETUP - REAL-TIME
  // ==========================================
  useEffect(() => {
    if (!socket || !user?._id) return;

    console.log('🔌 Setting up socket connection');
    
    socket.emit("setup", user._id);

    socket.on("connected", () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      console.log('📨 New message received:', newMessage);
      dispatch(receiveSocketMessage(newMessage));
    };

    socket.on("new message", handleNewMessage);

    return () => {
      socket.off("connected");
      socket.off("disconnect");
      socket.off("new message", handleNewMessage);
    };
  }, [user, dispatch]);

  // ==========================================
  // JOIN CHAT ROOM & LOAD MESSAGES
  // ==========================================
  useEffect(() => {
    if (!socket || !activeChat?._id) return;

    console.log('🎯 Joining chat room:', activeChat._id);
    socket.emit("join chat", activeChat._id);
    
    // Load messages only when chat changes
    if (messages.length === 0) {
      dispatch(fetchMessagesThunk(activeChat._id));
    }

    return () => {
      if (socket) {
        socket.emit("leave chat", activeChat._id);
      }
    };
  }, [activeChat?._id, dispatch]);

  // ==========================================
  // AUTO-SCROLL TO BOTTOM
  // ==========================================
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      if (mobileMessagesContainerRef.current) {
        mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
      }
    };
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // ==========================================
  // DETECT KEYBOARD (MOBILE)
  // ==========================================
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
        setKeyboardOpen(true)
      }
    }
    const onFocusOut = () => {
      setTimeout(() => {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea" && !document.activeElement?.isContentEditable) {
          setKeyboardOpen(false)
        }
      }, 100)
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Transform messages for display
  const transformedMessages = messages.map(msg => ({
    _id: msg._id || msg.id,
    id: msg._id || msg.id,
    text: msg.content || msg.text,
    content: msg.content || msg.text,
    sender: msg.sender?._id === user?._id ? 'me' : (msg.sender === 'me' ? 'me' : 'other'),
    senderId: msg.sender?._id,
    senderName: msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : (msg.senderName || 'Unknown'),
    timestamp: msg.createdAt || msg.timestamp,
    createdAt: msg.createdAt || msg.timestamp,
    isDeleted: msg.isDeleted || false,
    status: msg.status || 'sent',
    replyTo: msg.replyTo || null
  }));

  // ==========================================
  // SEND MESSAGE - REAL-TIME + BACKEND SAVE
  // ==========================================
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat?._id || isSending) return;
    
    haptic.medium();
    setIsSending(true);

    const messageContent = messageText.trim();
    
    // Create temporary message for optimistic UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      id: `temp-${Date.now()}`,
      content: messageContent,
      text: messageContent,
      sender: { _id: user?._id, firstName: user?.firstName, lastName: user?.lastName },
      senderId: user?._id,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      status: 'sending',
      isDeleted: false,
      replyTo: replyingTo ? {
        _id: replyingTo._id,
        text: replyingTo.text,
        sender: replyingTo.sender
      } : null
    };

    // Add to UI immediately
    dispatch(receiveSocketMessage(tempMessage));

    const messageData = {
      chatId: activeChat._id,
      content: messageContent,
      replyTo: replyingTo?._id || null,
      tempId: tempMessage._id
    };

    console.log("📤 Sending message:", messageData);

    try {
      // Emit via socket for real-time
      if (socket && isConnected) {
        socket.emit("new message", messageData);
      }
      
      // Save to backend
      await dispatch(sendMessageThunk(messageData)).unwrap();
      await dispatch(fetchMessagesThunk(activeChat._id))
      // Clear input
      setMessageText("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
      
      // Reset textarea heights
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = "40px";
        textareaRef.current.focus();
      }
      if (mobileTextareaRef.current) {
        mobileTextareaRef.current.style.height = "auto";
        mobileTextareaRef.current.style.height = "36px";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ==========================================
  // EMOJI HANDLER
  // ==========================================
  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji.native);
    setTimeout(() => {
      textareaRef.current?.focus();
      mobileTextareaRef.current?.focus();
    }, 0);
  };

  const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);

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
    // In a real app, you'd dispatch a delete action here
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
    setTimeout(() => {
      textareaRef.current?.focus();
      mobileTextareaRef.current?.focus();
    }, 100);
  };

  const cancelReply = () => setReplyingTo(null);

  // ==========================================
  // COPY MESSAGE
  // ==========================================
  const handleCopyMessage = (msg) => {
    if (msg.isDeleted) return;
    navigator.clipboard.writeText(msg.text).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
    setActiveMessageMenu(null);
    setMenuPosition(null);
    setMobileContextMenu(null);
  };

  // ==========================================
  // MESSAGE MENU
  // ==========================================
  const openMessageMenu = useCallback((messageId, buttonElement, isOwn) => {
    if (activeMessageMenu === messageId) {
      setActiveMessageMenu(null);
      setMenuPosition(null);
      return;
    }

    const rect = buttonElement.getBoundingClientRect();
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

  const getMessageById = (messageId) => {
    return transformedMessages.find(m => m._id === messageId || m.id === messageId);
  };

  return (
    <div className="flex flex-col h-[92vh] bg-surface-base text-content-primary overflow-hidden rounded-t-2xl lg:rounded-3xl select-none">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-500/20 text-yellow-500 text-xs text-center py-1 flex-shrink-0">
          Connecting to server...
        </div>
      )}

      {/* ==========================================
          DESKTOP VIEW
          ========================================== */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
          style={{ minHeight: 0 }}
        >
          {transformedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-content-faint" />
              </div>
              <p className="text-content-faint">No messages yet</p>
              <p className="text-xs text-content-faint mt-1">Send a message to start the conversation</p>
            </div>
          ) : (
            transformedMessages.map((message) => (
              <div
                key={message._id}
                className={`flex items-start gap-2 ${message.sender === "me" ? "justify-end" : ""} group`}
              >
                {/* Menu for own messages */}
                {message.sender === "me" && !message.isDeleted && (
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => openMessageMenu(message._id, e.currentTarget, true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                    >
                      <MoreVertical size={18} className="text-content-muted" />
                    </button>
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${message.sender === "me" ? "items-end" : ""} max-w-[70%]`}>
                  {/* Reply Preview */}
                  {message.replyTo && !message.isDeleted && (
                    <div className={`mb-1 p-2 rounded-lg text-xs border-l-2 ${message.sender === "me" ? "bg-primary/30 border-l-white" : "bg-surface-button border-l-primary"}`}>
                      <p className={`font-semibold mb-0.5 text-xs ${message.sender === "me" ? 'text-white/80' : 'text-content-primary'}`}>
                        {message.replyTo.sender === 'me' ? t("chat.you") : studio?.studioName || "Studio"}
                      </p>
                      <p className={`${message.sender === 'me' ? 'text-white/60' : 'text-content-muted'} text-xs`}>
                        {truncateText(message.replyTo.text, 50)}
                      </p>
                    </div>
                  )}

                  <div className={`rounded-xl px-4 py-2 ${message.isDeleted ? "bg-surface-hover text-content-faint italic" : message.sender === "me" ? "bg-primary text-white" : "bg-surface-dark text-content-primary"}`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {message.isDeleted ? (
                        <span className="flex items-center gap-1.5">
                          <Trash2 size={14} />
                          Message deleted
                        </span>
                      ) : (
                        <HighlightedText text={message.text} isUserMessage={message.sender === 'me'} />
                      )}
                    </p>

                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${message.sender === "me" ? "text-white/60 justify-end" : "text-content-faint"}`}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.sender === "me" && !message.isDeleted && (
                        <span>
                          {message.status === "read" ? <CheckCheck className="w-3 h-3" /> :
                           message.status === "delivered" ? <CheckCheck className="w-3 h-3" /> :
                           message.status === "sending" ? <div className="animate-pulse w-3 h-3 rounded-full bg-white/50" /> :
                           <Check className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reactions */}
                  {messageReactions[message._id] && !message.isDeleted && (
                    <div className={`flex gap-1 mt-0.5 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <button onClick={(e) => removeReaction(message._id, e)} className="bg-surface-button/80 rounded-full px-2 py-0.5 text-sm flex items-center gap-1 hover:bg-surface-button">
                        <span>{messageReactions[message._id]}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Menu for received messages */}
                {message.sender !== "me" && !message.isDeleted && (
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => openMessageMenu(message._id, e.currentTarget, false)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                    >
                      <MoreVertical size={18} className="text-content-muted" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Preview Bar */}
        {replyingTo && (
          <div className="px-4 py-2 bg-surface-hover border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-surface-button rounded-xl p-2">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-primary text-xs font-semibold">
                  Replying to {replyingTo.sender === 'me' ? 'yourself' : studio?.studioName || "Studio"}
                </p>
                <p className="text-content-secondary text-xs truncate">{truncateText(replyingTo.text, 50)}</p>
              </div>
              <button onClick={cancelReply} className="p-1 text-content-muted hover:text-content-primary">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 pt-3 pb-4 border-t border-border flex-shrink-0 bg-surface-base relative">
          <EmojiPicker
            isOpen={showEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            className="absolute bottom-full mb-2 left-4 z-[1020]"
            pickerRef={emojiPickerRef}
          />

          <div className="flex items-end gap-2 bg-surface-dark rounded-xl p-2">
            <button
              onClick={toggleEmojiPicker}
              className="p-2 hover:bg-surface-button rounded-full flex-shrink-0 transition-colors"
            >
              <Smile className="w-5 h-5 text-content-secondary" />
            </button>

            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none overflow-y-auto leading-5 text-content-secondary placeholder-content-faint max-h-[120px] py-2"
              rows={1}
              style={{ height: '40px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending}
              className={`p-2 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                messageText.trim() && !isSending
                  ? 'bg-primary hover:bg-primary-hover text-white'
                  : 'bg-surface-button text-content-faint cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          MOBILE VIEW
          ========================================== */}
      <div className="md:hidden fixed top-[3.5rem] inset-x-0 bottom-0 z-[30] flex flex-col bg-surface-base">
        {/* Mobile Messages Area */}
        <div
          ref={mobileMessagesContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3"
          style={{ minHeight: 0 }}
        >
          {transformedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-content-faint">
              <p>No messages yet</p>
            </div>
          ) : (
            transformedMessages.map((message) => (
              <div key={message._id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${message.sender === "me" ? "items-end" : "items-start"} max-w-[85%]`}>
                  <div
                    className={`rounded-xl px-3 py-2 ${message.isDeleted ? "bg-surface-hover" : message.sender === "me" ? "bg-primary" : "bg-surface-dark"}`}
                    onTouchStart={(e) => handleTouchStart(message, e)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                  >
                    {/* Reply preview */}
                    {message.replyTo && !message.isDeleted && (
                      <div className={`mb-1 pl-2 border-l-2 ${message.sender === "me" ? "border-white/40" : "border-border"}`}>
                        <p className={`text-[10px] font-medium ${message.sender === "me" ? "text-white/70" : "text-content-muted"}`}>
                          {message.replyTo.sender === 'me' ? 'You' : studio?.studioName || "Studio"}
                        </p>
                        <p className={`text-[10px] truncate max-w-[180px] ${message.sender === "me" ? "text-white/50" : "text-content-faint"}`}>
                          {truncateText(message.replyTo.text, 40)}
                        </p>
                      </div>
                    )}
                    <p className={`text-sm ${message.isDeleted ? "text-content-faint italic" : message.sender === "me" ? "text-white" : "text-content-primary"}`}>
                      {message.isDeleted ? "Message deleted" : message.text}
                    </p>
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${message.sender === "me" ? "text-white/60 justify-end" : "text-content-faint"}`}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.sender === "me" && !message.isDeleted && (
                        <span>
                          {message.status === "read" ? <CheckCheck className="w-3 h-3" /> :
                           message.status === "sending" ? <div className="animate-pulse w-3 h-3 rounded-full bg-white/50" /> :
                           <Check className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </div>
                  {messageReactions[message._id] && !message.isDeleted && (
                    <div className={`flex gap-1 mt-1 ${message.sender === "me" ? "justify-end" : ""}`}>
                      <button onClick={(e) => removeReaction(message._id, e)} className="bg-surface-button/80 rounded-full px-2 py-0.5 text-sm">
                        <span>{messageReactions[message._id]}</span>
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
          <div className="px-3 py-2 bg-surface-hover border-t border-border flex items-center gap-2 flex-shrink-0">
            <div className="flex-1 pl-2 border-l-2 border-primary">
              <p className="text-xs font-medium text-primary">
                Replying to {replyingTo.sender === 'me' ? 'You' : studio?.studioName}
              </p>
              <p className="text-xs text-content-muted truncate">{truncateText(replyingTo.text, 40)}</p>
            </div>
            <button onClick={cancelReply} className="p-1"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Mobile Input Area */}
        <div className="px-3 pt-2 pb-3 bg-surface-base border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2 bg-surface-dark rounded-xl px-3 py-2">
            <button onClick={toggleEmojiPicker} className="p-1">
              <Smile className="w-5 h-5 text-content-secondary" />
            </button>
            <textarea
              ref={mobileTextareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={handleKeyPress}
              placeholder={t("chat.placeholderMobile")}
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none max-h-[100px] leading-5 py-1"
              rows={1}
              style={{ height: '36px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending}
              className={`p-2 rounded-xl flex-shrink-0 ${
                messageText.trim() && !isSending
                  ? 'bg-primary text-white'
                  : 'bg-surface-button text-content-faint cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {!keyboardOpen && <div className="flex-shrink-0" style={{ height: "calc(3rem + env(safe-area-inset-bottom, 0px))" }} />}
      </div>

      {/* Message Menu Modal */}
      {activeMessageMenu && menuPosition && (
        <>
          <div className="fixed inset-0 z-[1099]" onClick={() => { setActiveMessageMenu(null); setMenuPosition(null); }} />
          <div className="fixed z-[1100] bg-surface-button rounded-xl shadow-xl p-1 min-w-[140px] border border-border" style={{ top: `${menuPosition.top}px`, ...(menuPosition.isOwn ? { right: `${menuPosition.right}px` } : { left: `${menuPosition.left}px` }) }}>
            <button onClick={() => { const msg = getMessageById(activeMessageMenu); if (msg) handleReplyToMessage(msg); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg flex items-center gap-2">
              <Reply size={14} /> {t("chat.menu.reply")}
            </button>
            <button onClick={() => { setShowReactionPicker(activeMessageMenu); setActiveMessageMenu(null); setMenuPosition(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg flex items-center gap-2">
              <Smile size={14} /> {t("chat.menu.react")}
            </button>
            <button onClick={() => { const msg = getMessageById(activeMessageMenu); if (msg) handleCopyMessage(msg); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg flex items-center gap-2">
              <Copy size={14} /> {t("chat.menu.copy")}
            </button>
            {menuPosition.isOwn && (
              <button onClick={() => setShowDeleteConfirm(activeMessageMenu)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover rounded-lg text-red-400 flex items-center gap-2">
                <Trash2 size={14} /> {t("chat.menu.delete")}
              </button>
            )}
          </div>
        </>
      )}

      {/* Mobile Context Menu */}
      {mobileContextMenu && (
        <div className="md:hidden fixed inset-0 z-[9998] flex items-end justify-center" onClick={() => setMobileContextMenu(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-surface-button rounded-t-2xl w-full max-w-lg p-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-surface-hover rounded-full mx-auto mb-4" />
            <button onClick={() => { handleReplyToMessage(mobileContextMenu.message); setMobileContextMenu(null); }} className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl flex items-center gap-3">
              <Reply size={20} /> Reply
            </button>
            <button onClick={() => { setShowReactionPicker(mobileContextMenu.messageId); setMobileContextMenu(null); }} className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl flex items-center gap-3">
              <Smile size={20} /> React
            </button>
            <button onClick={() => handleCopyMessage(mobileContextMenu.message)} className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl flex items-center gap-3">
              <Copy size={20} /> Copy
            </button>
            {mobileContextMenu.message?.sender === 'me' && (
              <button onClick={() => setShowDeleteConfirm(mobileContextMenu.messageId)} className="w-full text-left px-4 py-3 text-base hover:bg-surface-hover rounded-xl text-red-400 flex items-center gap-3">
                <Trash2 size={20} /> Delete
              </button>
            )}
            <button onClick={() => setMobileContextMenu(null)} className="w-full mt-4 px-4 py-3 text-base bg-surface-hover hover:bg-surface-button-hover rounded-xl font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-surface-button rounded-xl p-5 mx-4 max-w-sm w-full">
            <h4 className="text-content-primary font-medium mb-2">Delete Message?</h4>
            <p className="text-content-muted text-sm mb-4">This message will be marked as deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-surface-hover text-content-primary text-sm rounded-xl">Cancel</button>
              <button onClick={() => handleDeleteMessage(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reaction Picker */}
      {showReactionPicker && (
        <>
          <div className="fixed inset-0 z-[9998] bg-black/50" onClick={() => setShowReactionPicker(null)} />
          <div className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <EmojiPicker isOpen={true} onEmojiSelect={(emoji) => handleReaction(showReactionPicker, emoji.native)} onClose={() => setShowReactionPicker(null)} pickerRef={reactionPickerRef} />
          </div>
        </>
      )}

      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-surface-hover text-content-primary px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Copied!
        </div>
      )}
    </div>
  )
}