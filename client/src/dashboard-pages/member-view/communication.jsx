import { useState, useRef, useEffect } from "react"
import { Send, Smile } from "lucide-react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const studioInfo = {
  name: "FitZone Studio",
  avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
  status: "online",
  lastSeen: "Active now",
  description: "Your Personal Fitness Hub"
}

const initialMessages = [
  { id: 1, text: "Welcome to FitZone Studio! 🎉", sender: "other", timestamp: "9:00 AM" },
  { id: 2, text: "We're here to support your fitness journey. How can we help you today?", sender: "other", timestamp: "9:01 AM" },
  { id: 3, text: "Hi! I'm excited to start my fitness journey with you all 💪", sender: "me", timestamp: "9:05 AM" },
  { id: 4, text: "That's fantastic! Our team of trainers, nutritionists, and wellness coaches are ready to guide you.", sender: "other", timestamp: "9:07 AM" },
  { id: 5, text: "What are your main fitness goals? Weight loss, muscle building, or general wellness?", sender: "other", timestamp: "9:08 AM" },
  { id: 6, text: "I'm mainly looking to build muscle and improve my overall strength", sender: "me", timestamp: "9:10 AM" },
  { id: 7, text: "Perfect! I'll create a personalized strength training program for you. When would you like to start?", sender: "other", timestamp: "9:12 AM" },
  { id: 8, text: "Can we start this week? I'm really motivated!", sender: "me", timestamp: "9:15 AM" },
  { id: 9, text: "Absolutely! I'll also prepare a nutrition plan to support your muscle-building goals 🥗", sender: "other", timestamp: "9:17 AM" }
]

export default function StudioChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [messageText, setMessageText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="emoji-picker-toggle"]')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageText("")
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // Instead of sending, add a new line (like WhatsApp)
      setMessageText(prev => prev + '\n')
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji.native)
    // Focus back on textarea after selecting emoji
    textareaRef.current?.focus()
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [messageText])

  return (
    <div className="flex flex-col h-[92vh] bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {/* Fixed Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-gray-700/50 bg-black/20 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <img
              src={studioInfo.avatar}
              alt={studioInfo.name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-3 border-blue-500/50 shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studioInfo.name)}&background=4f46e5&color=ffffff&size=150`
              }}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg md:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {studioInfo.name}
            </h3>
            <p className="text-green-400 text-sm">{studioInfo.lastSeen}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6"
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-md lg:max-w-lg">
              <div className="flex flex-col">
                <div
                  className={`px-4 py-2 md:px-5 md:py-2 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    message.sender === "me" 
                      ? "bg-blue-600  text-white rounded-br-md border-blue-400/20" 
                      : "bg-orange-500  text-white border-gray-600/30 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "me" ? "text-blue-100" : "text-orange-100"
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <div className="relative">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-full mb-2 left-0 z-50"
            >
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="dark"
                skinTonePosition="none"
                previewPosition="none"
                searchPosition="none"
                navPosition="none"
                perLine={8}
                maxFrequentRows={0}
                emojiSize={20}
                emojiButtonSize={32}
              />
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-2xl p-3 md:p-4 border border-gray-600/30 backdrop-blur-sm">
            {/* Emoji Button on Left */}
            <button 
              onClick={toggleEmojiPicker}
              aria-label="emoji-picker-toggle"
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0"
            >
              <Smile className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors" />
            </button>
            
            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message to FitZone Studio..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm md:text-base resize-none min-h-[20px] max-h-[120px] py-2"
              rows="1"
            />
            
            {/* Send Button - aligned properly */}
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110 disabled:hover:scale-100 shadow-lg flex items-center justify-center"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}