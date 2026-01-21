import { X, Smile, Send, MoreVertical, Trash2, Reply, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// Initials Avatar Component - supports context for different colors
const InitialsAvatar = ({ firstName, lastName, size = 40, className = "", context = "member" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  // Staff uses blue, members use orange
  const bgColor = context === "staff" ? "bg-blue-600" : "bg-orange-500";

  return (
    <div 
      className={`${bgColor} rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  )
}

// Component to render text with highlighted dates and times
const HighlightedText = ({ text, isUserMessage }) => {
  // Regex patterns for dates and times
  const dateTimeRegex = /(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}:\d{2}(?:\s*(?:Uhr|AM|PM|am|pm))?|(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|(?:heute|morgen|gestern|übermorgen|today|tomorrow|yesterday))/gi;

  const parts = text.split(dateTimeRegex);
  const matches = text.match(dateTimeRegex) || [];

  if (matches.length === 0) {
    return <span>{text}</span>;
  }

  const result = [];

  parts.forEach((part, index) => {
    if (part) {
      // Check if this part is a match
      const isMatch = matches.some(match => match.toLowerCase() === part.toLowerCase());
      
      if (isMatch) {
        result.push(
          <span 
            key={`match-${index}`}
            className={`border-b ${isUserMessage ? 'border-white/60' : 'border-gray-400'}`}
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

/* eslint-disable react/prop-types */
const ChatPopup = ({ member, isOpen, onClose, onOpenFullMessenger, context = "member" }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${member.firstName}! How can I help you today? Let's meet tomorrow at 14:30 Uhr or on 15.01.2025.`,
      sender: 'member',
      timestamp: new Date()
    }
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const reactionPickerRef = useRef(null);
  const messageMenuRef = useRef(null);

  // Get full name
  const memberFullName = `${member.firstName} ${member.lastName}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        setShowReactionPicker(null);
      }
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target)) {
        setActiveMessageMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
        replyTo: replyingTo ? {
          id: replyingTo.id,
          text: replyingTo.text,
          sender: replyingTo.sender
        } : null
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setReplyingTo(null);
      setShowEmojiPicker(false);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    // Also remove any reactions for this message
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
    setShowDeleteConfirm(null);
    setActiveMessageMenu(null);
  };

  const handleReplyToMessage = (msg) => {
    setReplyingTo(msg);
    setActiveMessageMenu(null);
    // Focus the textarea
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

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  // Handle reaction - only one reaction per message (toggle on/off)
  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      
      // If this message already has this exact emoji, remove it (toggle off)
      if (newReactions[messageId] === emoji) {
        delete newReactions[messageId];
      } else {
        // Otherwise set this emoji as the reaction (replacing any previous)
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

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <span className="text-xs">✓</span>;
      case 'delivered':
        return <span className="text-xs">✓✓</span>;
      case 'read':
        return <span className="text-orange-400 text-xs">✓✓</span>;
      default:
        return null;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Truncate text for reply preview
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!isOpen) return null;

  // Support both image and img properties
  const avatarImage = member.image || member.img;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md max-h-[600px] flex flex-col relative overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {avatarImage ? (
              <img
                src={avatarImage}
                width={40}
                height={40}
                className="rounded-lg"
                alt={memberFullName}
              />
            ) : (
              <InitialsAvatar 
                firstName={member.firstName} 
                lastName={member.lastName} 
                size={40}
                context={context}
              />
            )}
            <div>
              <h3 className="text-white font-semibold">
                {memberFullName}
              </h3>
              <p className="text-gray-400 text-sm">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFullMessenger}
              className="text-gray-400 hover:text-white p-2 transition-colors"
              title="Open in full messenger"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-visible max-h-[70vh] custom-scrollbar p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? "justify-end" : "justify-start"} group`}>
              <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? "items-end" : "items-start"} max-w-[85%]`}>
                <div
                  className={`rounded-xl p-3 text-sm relative ${
                    msg.sender === 'user' 
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-black text-white rounded-bl-none"
                  }`}
                >
                  {/* Reply/Quote Preview */}
                  {msg.replyTo && (
                    <div 
                      className={`mb-2 p-2.5 rounded-lg text-xs border-l-4 ${
                        msg.sender === 'user'
                          ? "bg-orange-400/30 border-white/70"
                          : "bg-gray-700 border-orange-500"
                      }`}
                    >
                      <p className="font-bold mb-1 text-white">
                        {msg.replyTo.sender === 'user' ? 'You' : memberFullName}
                      </p>
                      <p className={`${msg.sender === 'user' ? 'text-orange-100/80' : 'text-gray-300'}`}>
                        {truncateText(msg.replyTo.text, 60)}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <p style={{ whiteSpace: 'pre-wrap' }} className="flex-1">
                      <HighlightedText text={msg.text} isUserMessage={msg.sender === 'user'} />
                    </p>
                    
                    {/* Menu button */}
                    <button
                      onClick={() => setActiveMessageMenu(activeMessageMenu === msg.id ? null : msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded flex-shrink-0"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  {/* Message Menu - higher z-index */}
                  {activeMessageMenu === msg.id && (
                    <div 
                      ref={messageMenuRef}
                      className={`absolute top-8 ${msg.sender === 'user' ? 'left-0' : 'right-0'} bg-gray-800 rounded-lg shadow-xl p-1 min-w-[140px] z-[1100] border border-gray-700`}
                    >
                      {/* Reply option - available for all messages */}
                      <button
                        onClick={() => handleReplyToMessage(msg)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-md text-white flex items-center gap-2"
                      >
                        <Reply size={14} />
                        Reply
                      </button>
                      
                      {/* Only show "Add Reaction" for member messages (not own messages) */}
                      {msg.sender !== 'user' && (
                        <button
                          onClick={() => {
                            setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id);
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-md text-white flex items-center gap-2"
                        >
                          <Smile size={14} />
                          Add Reaction
                        </button>
                      )}
                      
                      {/* Only show "Delete" for own messages */}
                      {msg.sender === 'user' && (
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(msg.id);
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-md text-red-400 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Emoji Picker for Reactions - opens ABOVE the message, higher z-index */}
                  {showReactionPicker === msg.id && msg.sender !== 'user' && (
                    <div 
                      ref={reactionPickerRef}
                      className="fixed z-[9999]"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji) => handleReaction(msg.id, emoji.native)}
                        theme="dark"
                        previewPosition="none"
                        skinTonePosition="none"
                        perLine={8}
                        maxFrequentRows={2}
                      />
                    </div>
                  )}
                  
                  {/* Single Reaction Display */}
                  {messageReactions[msg.id] && (
                    <div className={`flex gap-1 mt-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <button
                        onClick={(e) => removeReaction(msg.id, e)}
                        className="bg-gray-700 rounded-full px-2 py-1 text-lg flex items-center gap-1 hover:bg-gray-600 transition-colors group/reaction"
                        title="Click to remove"
                      >
                        <span>{messageReactions[msg.id]}</span>
                        <span className="opacity-0 group-hover/reaction:opacity-100 text-xs text-gray-400">×</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-gray-400 px-1">
                  <span>{formatTimestamp(msg.timestamp)}</span>
                  {msg.sender === 'user' && getMessageStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Overlay for Emoji Picker */}
        {showReactionPicker && (
          <div 
            className="fixed inset-0 bg-black/30 z-[9998]"
            onClick={() => setShowReactionPicker(null)}
          />
        )}

        {/* Delete Confirmation Modal - highest z-index */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[1030] rounded-xl">
            <div className="bg-[#2a2a2a] rounded-xl p-4 mx-4 max-w-sm w-full shadow-xl border border-gray-700">
              <h4 className="text-white font-medium mb-2">Delete Message?</h4>
              <p className="text-gray-400 text-sm mb-4">This message will be deleted permanently.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMessage(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply Preview Bar */}
        {replyingTo && (
          <div className="px-4 pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 bg-gray-800/80 rounded-lg p-2.5">
              <div className="w-1 h-10 bg-orange-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-orange-400 text-xs font-semibold">
                  Replying to {replyingTo.sender === 'user' ? 'yourself' : memberFullName}
                </p>
                <p className="text-gray-300 text-sm truncate">{truncateText(replyingTo.text, 40)}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0 relative">
          <div className="flex items-end gap-2 bg-black rounded-lg p-2">
            <button
              className="p-2 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              aria-label="Add emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5 text-gray-300" />
            </button>

            <textarea
              ref={textareaRef}
              placeholder="Type your message..."
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none overflow-hidden leading-relaxed text-white placeholder-gray-400 max-h-[120px] py-2"
              rows={1}
              value={message}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className="p-2 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-16 left-0 z-[1020]"
            >
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="dark"
                previewPosition="none"
                skinTonePosition="none"
                perLine={8}
                maxFrequentRows={2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
