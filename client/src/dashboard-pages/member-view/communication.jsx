import { useState, useRef, useEffect } from "react"
import { Send, Smile } from "lucide-react"

const studioInfo = {
  name: "FitZone Studio",
  avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
  status: "online",
  lastSeen: "Active now",
  description: "Your Personal Fitness Hub"
}

const initialMessages = [
  { id: 1, text: "Welcome to FitZone Studio! 🎉", sender: "other", timestamp: "9:00 AM", senderName: "FitZone Team" },
  { id: 2, text: "We're here to support your fitness journey. How can we help you today?", sender: "other", timestamp: "9:01 AM", senderName: "FitZone Team" },
  { id: 3, text: "Hi! I'm excited to start my fitness journey with you all 💪", sender: "me", timestamp: "9:05 AM" },
  { id: 4, text: "That's fantastic! Our team of trainers, nutritionists, and wellness coaches are ready to guide you.", sender: "other", timestamp: "9:07 AM", senderName: "Sarah - Trainer" },
  { id: 5, text: "What are your main fitness goals? Weight loss, muscle building, or general wellness?", sender: "other", timestamp: "9:08 AM", senderName: "Mike - Physiotherapist" },
  { id: 6, text: "I'm mainly looking to build muscle and improve my overall strength", sender: "me", timestamp: "9:10 AM" },
  { id: 7, text: "Perfect! I'll create a personalized strength training program for you. When would you like to start?", sender: "other", timestamp: "9:12 AM", senderName: "Sarah - Trainer" },
  { id: 8, text: "Can we start this week? I'm really motivated!", sender: "me", timestamp: "9:15 AM" },
  { id: 9, text: "Absolutely! I'll also prepare a nutrition plan to support your muscle-building goals 🥗", sender: "other", timestamp: "9:17 AM", senderName: "Emma - Nutritionist" }
]

export default function StudioChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    // Simulate a response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our team will get back to you shortly.",
        "That's great to hear! Keep up the excellent work! 💪",
        "We're here to support you every step of the way!",
        "Perfect! Let us know if you need any adjustments to your program.",
        "Your dedication is inspiring! Keep pushing forward! 🔥"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const responseMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        senderName: "FitZone Team"
      }
      
      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col relative  h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
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
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg md:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {studioInfo.name}
            </h3>
          </div>
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-md lg:max-w-lg">
              {message.sender === "other" && (
                <img 
                  src={studioInfo.avatar} 
                  alt={studioInfo.name}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0 border-2 border-blue-500/30"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studioInfo.name)}&background=4f46e5&color=ffffff&size=150`
                  }}
                />
              )}
              <div className="flex flex-col">
                {message.sender === "other" && message.senderName && (
                  <p className="text-xs text-blue-300 mb-1 ml-2 font-medium">{message.senderName}</p>
                )}
                <div
                  className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    message.sender === "me" 
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-br-md border-blue-400/20" 
                      : "bg-gray-800/80 text-white border-gray-600/30 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "me" ? "text-blue-100/80" : "text-gray-400"
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

      {/* Message Input */}
      <div className="p-4 md:p-6 border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 bg-gray-800/50 rounded-2xl p-3 md:p-4 border border-gray-600/30 backdrop-blur-sm">
          {/* <button className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0">
            <Paperclip className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
          </button> */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message to FitZone Studio..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm md:text-base py-1"
          />
          <button className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0">
            <Smile className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110 disabled:hover:scale-100 shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Studio Info Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            🏋️‍♀️ Connected to FitZone Studio • Your fitness journey starts here
          </p>
        </div>
      </div>
    </div>
  )
}