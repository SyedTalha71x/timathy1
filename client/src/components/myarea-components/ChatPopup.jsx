import { X, Smile, Send, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

/* eslint-disable react/prop-types */
const ChatPopup = ({ member, isOpen, onClose, onOpenFullMessenger }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${member.name}! How can I help you today?`,
      sender: 'member',
      timestamp: new Date()
    }
  ]);
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

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
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
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={member.img || "/placeholder.svg?height=40&width=40"}
              width={40}
              height={40}
              className="rounded-lg"
              alt={`${member.name} ${member.lastName}`}
            />
            <div>
              <h3 className="text-white font-semibold">
                {member.name} {member.lastName}
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
        <div className="flex-1 overflow-y-auto max-h-[70vh] custom-scrollbar p-4 space-y-4">
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
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
                  
                  {/* Reaction picker - positioned properly */}
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

        {/* Input */}
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
              placeholder="Type your message..."
              className="flex-1 bg-transparent focus:outline-none text-sm resize-none overflow-hidden leading-relaxed text-white placeholder-gray-400 max-h-[120px] py-2"
              rows={1}
              value={message}
              onInput={(e) => {
                // auto-grow textarea
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Send button */}
            <button
              className="p-2 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!message.trim()}
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

export default ChatPopup;