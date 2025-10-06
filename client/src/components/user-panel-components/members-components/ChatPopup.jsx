import { X } from "lucide-react";
import { useState } from "react";
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png'

/* eslint-disable react/prop-types */
const ChatPopup = ({ member, isOpen, onClose, onOpenFullMessenger }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
      {
        id: 1,
        text: `Hello ${member.firstName}! How can I help you today?`,
        sender: 'member',
        timestamp: new Date()
      }
    ]);
  
    const handleSendMessage = () => {
      if (message.trim()) {
        const newMessage = {
          id: messages.length + 1,
          text: message,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
        setMessage('');
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
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
                src={member.image || DefaultAvatar}
                width={40}
                height={40}
                className="rounded-lg"
                alt={`${member.firstName} ${member.lastName}`}
              />
              <div>
                <h3 className="text-white font-semibold">
                  {member.firstName} {member.lastName}
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-[#161616] text-white rounded-lg px-3 py-2 text-sm resize-none outline-none"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-orange-600 text-white text-sm cursor-pointer px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ChatPopup