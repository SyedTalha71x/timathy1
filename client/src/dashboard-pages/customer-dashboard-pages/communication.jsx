import { useState, useRef, useEffect } from "react"
import { Send, Menu, User, Smile, Paperclip, MoreVertical, ArrowLeft } from "lucide-react"

const studioMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=150&h=150&fit=crop&crop=face",
    status: "online",
    lastSeen: "Active now",
    role: "Fitness Trainer"
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "online",
    lastSeen: "Active 5 min ago",
    role: "Physiotherapist"
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "offline",
    lastSeen: "Last seen 2 hours ago",
    role: "Nutritionist"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "online",
    lastSeen: "Active now",
    role: "Yoga Instructor"
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    status: "offline",
    lastSeen: "Last seen 1 hour ago",
    role: "Wellness Coach"
  },
]

const initialMessages = {
  1: [
    { id: 1, text: "Hey! How's your training session going?", sender: "other", timestamp: "10:30 AM" },
    { id: 2, text: "Going great! Just finished my cardio routine 💪", sender: "me", timestamp: "10:32 AM" },
    { id: 3, text: "Awesome! Don't forget to stretch properly afterwards", sender: "other", timestamp: "10:35 AM" },
    { id: 4, text: "Will do! Thanks for the reminder 😊", sender: "me", timestamp: "10:36 AM" },
  ],
  2: [
    { id: 1, text: "Did you get a chance to review the new exercise plan?", sender: "other", timestamp: "9:15 AM" },
    { id: 2, text: "Yes! It looks challenging but exciting. When do we start?", sender: "me", timestamp: "9:20 AM" },
    { id: 3, text: "We can start tomorrow. Make sure to get proper rest tonight", sender: "other", timestamp: "9:22 AM" },
  ],
  3: [
    { id: 1, text: "Welcome to FitZone Studio! 🎉", sender: "other", timestamp: "Yesterday" },
    { id: 2, text: "I've prepared a custom nutrition plan for you. Check your email!", sender: "other", timestamp: "Yesterday" },
  ],
  4: [
    { id: 1, text: "Ready for today's yoga session?", sender: "other", timestamp: "8:45 AM" },
    { id: 2, text: "Absolutely! Looking forward to it 🧘‍♀️", sender: "me", timestamp: "8:47 AM" },
  ],
  5: [
    { id: 1, text: "How are you feeling after this week's wellness program?", sender: "other", timestamp: "2 hours ago" },
  ],
}

export default function Communications() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState(initialMessages)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }))

    setMessageText("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChatSelect = (member) => {
    setSelectedChat(member)
    setIsMessagesOpen(false) // Close sidebar on mobile when chat is selected
  }

  const handleBackToList = () => {
    setSelectedChat(null)
    setIsMessagesOpen(true)
  }

  return (
    <div className="flex min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      {/* Mobile Overlay */}
      {isMessagesOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMessagesOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMessagesOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-30 w-80 md:w-80 bg-[#1C1C1C] border-r border-gray-700/50 transition-transform duration-300 overflow-hidden flex flex-col h-full`}
      >
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-700/50 bg-[#1C1C1C]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Studio Team</h2>
            <button 
              onClick={() => setIsMessagesOpen(false)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Connect with your trainers</p>
        </div>

        {/* Online Status */}
        <div className="px-4 md:px-6 py-3 bg-[#1C1C1C]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">
              {studioMembers.filter(m => m.status === 'online').length} members online
            </span>
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          {studioMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleChatSelect(member)}
              className={`p-4 md:p-6 border-b border-gray-700/30 cursor-pointer hover:bg-gray-700/50 transition-all duration-200 ${
                selectedChat?.id === member.id ? "bg-gray-700/50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-600"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4f46e5&color=ffffff&size=150`
                    }}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                      member.status === "online" ? "bg-green-400" : "bg-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate text-sm md:text-base">{member.name}</h3>
                    {messages[member.id] && messages[member.id].length > 0 && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-blue-400 font-medium mb-1">{member.role}</p>
                  <p className="text-xs text-gray-400 truncate">{member.lastSeen}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 md:p-6 border-t border-gray-700/50 bg-[#1C1C1C]">
          <div className="text-center text-xs text-gray-500">
            FitZone Studio Communication
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {!selectedChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="md:hidden absolute top-4 left-4 p-3 bg-[#1C1C1C] rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <div className="mb-8 p-8 bg-[#1C1C1C] rounded-full">
              <User className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Studio Communication Hub
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
              Connect with your personal trainers, nutritionists, and wellness coaches. 
              Get real-time support and guidance for your fitness journey.
            </p>
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="mt-8 md:hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700/50 bg-[#1C1C1C] backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={handleBackToList}
                  className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => setIsMessagesOpen(true)} 
                  className="hidden md:block lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-400" />
                </button>
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name)}&background=4f46e5&color=ffffff&size=150`
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm md:text-base truncate">{selectedChat.name}</h3>
                  <p className="text-xs md:text-sm text-blue-400">{selectedChat.role}</p>
                  <p className="text-xs text-gray-400">{selectedChat.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">

                <button className="p-2 md:p-3 hover:bg-gray-700 rounded-xl transition-colors">
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-b from-gray-900/20 to-black/20">
              {(messages[selectedChat.id] || []).map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-2 max-w-[85%] md:max-w-md lg:max-w-lg">
                    {message.sender === "other" && (
                      <img 
                        src={selectedChat.avatar} 
                        alt={selectedChat.name}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name)}&background=4f46e5&color=ffffff&size=150`
                        }}
                      />
                    )}
                    <div
                      className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-lg ${
                        message.sender === "me" 
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md" 
                          : "bg-gray-800 text-white border border-gray-700/50 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "me" ? "text-blue-100" : "text-gray-400"
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-6 border-t border-gray-700/50 bg-[#1C1C1C] backdrop-blur-sm">
              <div className="flex items-center gap-2 md:gap-3 bg-gray-800 rounded-2xl p-2 md:p-3 border border-gray-700/50">
                <button className="p-2 hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0">
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm md:text-base"
                />
                <button className="p-2 hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0">
                  <Smile className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 md:p-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl transition-all duration-300 flex-shrink-0"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}