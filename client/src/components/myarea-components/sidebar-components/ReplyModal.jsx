/* eslint-disable react/prop-types */
import { X, Smile, Send, MoreVertical, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png';

const ReplyModal = ({ 
  isOpen, 
  onClose, 
  message, 
  onSendReply,
  onOpenFullMessenger 
}) => {
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageMenuRef = useRef(null);

  const reactions = [
    { name: 'like', emoji: '👍' },
    { name: 'love', emoji: '❤️' },
    { name: 'laugh', emoji: '😂' },
    { name: 'wow', emoji: '😮' },
    { name: 'sad', emoji: '😢' },
    { name: 'angry', emoji: '😠' }
  ];

  // Initialize chat history when message changes
  useEffect(() => {
    if (message) {
      // Simulate chat history - in real app, you'd fetch this from your API
      const chatHistory = [
        {
          id: 1,
          text: "Hello! I have a question about my membership.",
          sender: 'member',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: 'read'
        },
        {
          id: 2,
          text: `Hi ${message.senderName}! How can I help you today?`,
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000),
          status: 'read'
        },
        {
          id: 3,
          text: message.message,
          sender: 'member',
          timestamp: new Date(Date.now() - 10000), // 10 seconds ago
          status: 'read'
        }
      ];
      setMessages(chatHistory);
    }
  }, [message]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
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

  const handleSendReply = () => {
    if (replyText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: replyText,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMessage]);
      onSendReply(message.chatId, replyText);
      setReplyText('');
      setShowEmojiPicker(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setReplyText(prev => prev + emoji.native);
  };

  const handleReaction = (messageId, reactionName) => {
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      if (!newReactions[messageId]) {
        newReactions[messageId] = {};
      }
      if (!newReactions[messageId][reactionName]) {
        newReactions[messageId][reactionName] = 0;
      }
      newReactions[messageId][reactionName] += 1;
      return newReactions;
    });
    setShowReactionPicker(null);
  };

  const removeReaction = (messageId, reactionName, e) => {
    e.stopPropagation();
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      if (newReactions[messageId] && newReactions[messageId][reactionName]) {
        newReactions[messageId][reactionName] -= 1;
        if (newReactions[messageId][reactionName] <= 0) {
          delete newReactions[messageId][reactionName];
        }
        if (Object.keys(newReactions[messageId]).length === 0) {
          delete newReactions[messageId];
        }
      }
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
        return <span className="text-blue-400 text-xs">✓✓</span>;
      default:
        return null;
    }
  };

  const handleOpenFullMessenger = () => {
    if (onOpenFullMessenger) {
      onOpenFullMessenger(message);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center rounded-xl gap-3">
            <img
              src={message.senderAvatar || DefaultAvatar}
              className="rounded-xl h-12 w-12"
              alt={message.senderName}
            />
            <div>
              <h3 className="text-white font-semibold">
                {message.senderName}
              </h3>
              <p className="text-gray-400 text-sm capitalize">
                {message.type === "member_chat" ? "Member Chat" : "Studio Chat"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFullMessenger}
              className="text-gray-400 hover:text-white p-2 transition-colors"
              title="Open in full messenger"
            >
              <ExternalLink size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages - Chat History */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? "justify-end" : "justify-start"} group`}>
              <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? "items-end" : "items-start"} max-w-[85%]`}>
              <div
                  className={`rounded-xl p-3 text-sm relative ${
                    msg.sender === 'user' 
                      ? "bg-blue-500 text-white rounded-br-none"  // Changed from #005c4b to blue-500
                      : "bg-black text-white rounded-bl-none"  // Changed from #202c33 to gray-200 and text to black
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <p style={{ whiteSpace: 'pre-wrap' }} className="flex-1">{msg.text}</p>
                    
                    {/* Message menu button */}
                    <button
                      onClick={() => setActiveMessageMenu(activeMessageMenu === msg.id ? null : msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  {/* Message menu */}
                  {activeMessageMenu === msg.id && (
                    <div 
                      ref={messageMenuRef}
                      className={`absolute top-8 ${msg.sender === 'user' ? 'left-0' : 'right-0'} bg-gray-800 rounded-lg shadow-lg p-1 min-w-[120px] z-20`}
                    >
                      <button
                        onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-md text-white"
                      >
                        Add Reaction
                      </button>
                    </div>
                  )}
                  
                  {/* Reaction picker */}
                  {showReactionPicker === msg.id && (
                    <div 
                      className={`absolute ${msg.sender === 'user' ? 'left-0 -translate-x-40' : 'right-0 translate-x-4'} top-[-10px] bg-gray-800 rounded-full shadow-lg p-2 flex gap-1 z-30 border border-gray-600`}
                    >
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.name}
                          onClick={() => handleReaction(msg.id, reaction.name)}
                          className="p-1 hover:scale-125 transition-transform text-xl"
                        >
                          {reaction.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Display reactions */}
                  {messageReactions[msg.id] && (
                    <div className={`flex gap-1 mt-2 flex-wrap ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(messageReactions[msg.id]).map(([reactionName, count]) => {
                        const reaction = reactions.find((r) => r.name === reactionName);
                        return (
                          <button
                            key={reactionName}
                            onClick={(e) => removeReaction(msg.id, reactionName, e)}
                            className="bg-gray-700 rounded-full px-2 py-1 text-xs flex items-center gap-1 hover:bg-gray-600 transition-colors group/reaction"
                            title="Click to remove"
                          >
                            <span className="text-lg">{reaction?.emoji}</span> 
                            <span>{count}</span>
                            <span className="opacity-0 group-hover/reaction:opacity-100 text-xs">×</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-400 px-1">
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sender === 'user' && getMessageStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0 relative">
          <div className="flex items-end gap-2 bg-black rounded-lg p-2">
            {/* Emoji button */}
            <button
              className="p-2 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              aria-label="Add emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5 text-gray-300" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder="Type your reply..."
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none overflow-hidden leading-relaxed text-white placeholder-gray-400 max-h-[120px] py-2"
              rows={1}
              value={replyText}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              onChange={(e) => setReplyText(e.target.value)}
            />

            {/* Send button */}
            <button
              className="p-2 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Send className="w-5 h-5 text-white" />  {/* White icon, no background */}
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-16 left-0 z-50"
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

export default ReplyModal;