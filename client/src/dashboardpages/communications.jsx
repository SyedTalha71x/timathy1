/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import {
  Menu,
  X,
  Search,
  ThumbsUp,
  MoreVertical,
  Star,
  Mic,
  Smile,
  Clock,
  PlusCircle,
  Send,
  Gift,
  Calendar,
  Plus,
} from "lucide-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { IoIosMegaphone } from "react-icons/io";


// Assume these imgs are in the public folder
const img1 = "/Rectangle 1.png"
const img2 = "/avatar3.png"

export default function Communications() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [chatType, setChatType] = useState("employee")
  const [activeScreen, setActiveScreen] = useState("chat")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Jennifer",
      content: "Oh, hello! All perfectly. I will check it and get back to you soon.",
      time: "04:45 PM",
    },
    {
      id: 2,
      sender: "You",
      content: "Yes, hello! All perfectly. I will check it and get back to you soon.",
      time: "04:45 PM",
    },
  ])

  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)

  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const chatDropdownRef = useRef(null)
  const groupDropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const recipientDropdownRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setActiveDropdownId(null)
      }

      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setShowChatDropdown(false)
      }

      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setShowGroupDropdown(false)
      }

      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target)) {
        setShowRecipientDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleNewChat = () => {
    setShowChatDropdown(true)
    setShowGroupDropdown(false)
    setActiveDropdownId(null)
  }

  const handleNewGroup = () => {
    setShowGroupDropdown(true)
    setShowChatDropdown(false)
    setActiveDropdownId(null)
  }

  const employeeChatList = [
    {
      name: "Jennifer Markus",
      time: "Today | 05:30 PM",
      active: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isBirthday: true,
    },
    {
      name: "Jerry Haffer",
      time: "Today | 05:30 PM",
      verified: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isBirthday: false,
    },
  ]

  const memberChatList = [
    {
      name: "Group 1",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
    },
    {
      name: "David Eison",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
      isBirthday: true,
    },
    {
      name: "Mary Freund",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
    },
  ]

  const chatList = chatType === "employee" ? employeeChatList : memberChatList

  const predefinedMessages = ["Hi all tomorrow is off", "Hi all tomorrow is off", "Hi all tomorrow is off"]

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([...messages, newMessage])
    setMessageText("")
    setActiveScreen("chat")
  }

  const redirectToAppointment = () => {
    window.location.href = "/dashboard/appointments"
  }

  const handleMemberSelect = (member) => {
    setSelectedMembers((prev) => (prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]))
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    setSelectedRecipients(selectAll ? [] : chatList)
  }

  const handleEmojiSelect = (emoji) => {
    setMessageText((prevText) => prevText + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file.name)
      setShowMediaUpload(false)
    }
  }

  return (
    <div className="relative flex h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[380px] w-full rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${
          isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-black z-40`}
      >
        <div className="p-4 h-full flex flex-col relative">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Communications</h1>
            <button
              onClick={() => setIsMessagesOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-300"
              aria-label="Close messages"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                className={`px-5 py-2 text-sm ${
                  chatType === "employee"
                    ? "bg-white text-black"
                    : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                } rounded-xl`}
                onClick={() => setChatType("employee")}
              >
                Employee
              </button>
              <button
                className={`px-5 py-2 text-sm ${
                  chatType === "member"
                    ? "bg-white text-black"
                    : "text-gray-200 border border-slate-300 hover:bg-gray-800"
                } rounded-xl`}
                onClick={() => setChatType("member")}
              >
                Member
              </button>
              <button
                className={`px-4 py-2 text-sm border border-slate-300  rounded-xl`}
              >
                Email
              </button>
            </div>

            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setActiveDropdownId(activeDropdownId ? null : "main")}
                className="p-2 hover:bg-gray-800 rounded-full"
                aria-label="More options"
              >
                <MoreVertical className="w-6 h-6 cursor-pointer text-gray-200" />
              </button>

              {activeDropdownId === "main" && (
                <div
                  ref={dropdownRef}
                  className="absolute right-5 top-5 cursor-pointer mt-1 w-32 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg overflow-hidden z-10"
                >
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                    onClick={handleNewChat}
                  >
                    New Chat
                  </button>
                  <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto" />
                  <button className="w-full px-4 py-2 text-sm hover:bg-gray-800 text-left" onClick={handleNewGroup}>
                    New Group
                  </button>
                  <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto" />
                  <button
                    className="w-full px-4 py-2 text-sm hover:bg-gray-800 text-left"
                    onClick={() => setActiveDropdownId(null)}
                  >
                    Unread
                  </button>
                </div>
              )}

              {showChatDropdown && (
                <div
                  ref={chatDropdownRef}
                  className="absolute right-5 top-5 w-64 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-xl shadow-lg z-20 mt-2"
                >
                  <div className="p-3">
                    {chatList.map((chat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-xl cursor-pointer"
                      >
                        <img
                          src={chat.logo || "/placeholder.svg"}
                          alt={`${chat.name}'s avatar`}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-sm">{chat.name}</span>
                        <input type="checkbox" className="ml-auto" />
                      </div>
                    ))}
                    <button
                      className="w-full mt-2 py-1.5 text-sm px-4 cursor-pointer bg-[#FF843E] text-white rounded-full hover:bg-orange-600"
                      onClick={() => setShowChatDropdown(false)}
                    >
                      Start chat
                    </button>
                  </div>
                </div>
              )}

              {showGroupDropdown && (
                <div
                  ref={groupDropdownRef}
                  className="absolute right-5 top-5 w-64 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-xl shadow-lg z-20 mt-2"
                >
                  <div className="p-3">
                    {chatList.map((chat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-xl cursor-pointer"
                      >
                        <img
                          src={chat.logo || "/placeholder.svg"}
                          alt={`${chat.name}'s avatar`}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-sm">{chat.name}</span>
                        <input type="checkbox" className="ml-auto" />
                      </div>
                    ))}
                    <button
                      className="w-full mt-2 py-1.5 text-sm px-4 cursor-pointer bg-[#FF843E] text-white rounded-full hover:bg-orange-600"
                      onClick={() => setShowGroupDropdown(false)}
                    >
                      Create Group
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 pl-10 border border-slate-200 bg-black rounded-xl text-sm outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {chatList.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${
                  chat.active ? "bg-[#181818]" : "hover:bg-[#181818]"
                } cursor-pointer`}
                onClick={() => setActiveScreen("chat")}
              >
                <div className="relative">
                  <img
                    src={chat.logo || "/placeholder.svg"}
                    alt={`${chat.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {chat.isBirthday && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                      <Gift className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate">{chat.name}</span>
                      {chat.verified && (
                        <div className="text-blue-500">
                          <Star className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <button className="text-blue-500 hover:text-blue-400">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <p className="truncate">{chat.message}</p>
                  </div>
                  <div className="flex mt-1 text-gray-400 items-center gap-1">
                    <Clock size={15} />
                    <span className="text-sm text-gray-400">{chat.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveScreen("send-message")}
            className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
          >
            <IoIosMegaphone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {activeScreen === "chat" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMessagesOpen(true)}
                  className="md:hidden text-gray-400 hover:text-gray-300"
                  aria-label="Open messages"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img
                    src={img1 || "/placeholder.svg"}
                    alt="Current chat avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {employeeChatList[0].isBirthday && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                      <Gift className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="font-medium">Jennifer Markus</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-500 hover:text-blue-400" aria-label="Star conversation">
                  <Star className="w-6 h-6" />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-400"
                  aria-label="Book appointment"
                  onClick={redirectToAppointment}
                >
                  <Calendar className="w-6 h-6" />
                </button>
                <div className="relative flex items-center">
                  <button
                    className="hover:text-gray-300 z-10"
                    aria-label="Search conversation"
                    onClick={handleSearchClick}
                  >
                    <Search className="w-6 h-6" />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="absolute right-0 bg-gray-800 text-white rounded-md py-1 px-2 text-sm focus:outline-none search-input-animation"
                    style={{
                      width: isSearchOpen ? 200 : 0,
                      opacity: isSearchOpen ? 1 : 0,
                      visibility: isSearchOpen ? "visible" : "hidden",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === "You" ? "justify-end" : ""}`}>
                  <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""}`}>
                    <div
                      className={`rounded-xl p-4 text-sm max-w-md ${message.sender === "You" ? "bg-[#3F74FF]" : "bg-black"}`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <span className="text-sm text-gray-400">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-2 bg-black rounded-xl p-2">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full"
                  aria-label="Add emoji"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-5 h-5 text-gray-200" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-0"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowMediaUpload(!showMediaUpload)}>
                    <IoIosMegaphone size={20} className="cursor-pointer" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full" aria-label="Voice message">
                    <Mic className="w-5 h-5 text-gray-200" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full" aria-label="Send thumbs up">
                    <ThumbsUp className="w-5 h-5 text-gray-200" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-700 rounded-full"
                    aria-label="Send message"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-5 h-5 text-gray-200" />
                  </button>
                </div>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4">
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
              {showMediaUpload && (
                <div className="absolute bottom-14 right-22  bg-gray-800 p-2 rounded-md">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md"
                  >
                    Upload Media
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeScreen === "send-message" && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">New message</h2>
                  <button onClick={() => setActiveScreen("chat")} className="p-2 hover:bg-zinc-700 rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Message Preview */}
                  <div className="bg-black rounded-xl p-4 text-white text-sm">
                    <p>Oh, hello! All perfectly.</p>
                    <p>I will check it and get back to you soon.</p>
                  </div>

                  {/* Suggested Messages */}
                  <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                    {predefinedMessages.map((msg, i) => (
                      <button
                        key={i}
                        className="w-full text-left text-sm py-2 px-4 bg-[#222222] hover:bg-[#2a2a2a] text-gray-300 rounded-xl"
                        onClick={() => setMessageText(msg)}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>

                  {/* Add Recipient Button and Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                      Add recipient
                    </button>

                    {showRecipientDropdown && (
                      <div
                        ref={recipientDropdownRef}
                        className="absolute left-0 right-0 mt-2 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-50 max-h-[250px] overflow-y-auto custom-scrollbar"
                      >
                        <div className="p-2 border-b border-gray-800 flex items-center justify-between">
                          <span className="text-sm text-gray-300">Select all</span>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="rounded border-gray-600 bg-transparent"
                          />
                        </div>
                        {chatList.map((chat, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-[#2F2F2F] cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={chat.logo || "/placeholder.svg"}
                                alt={chat.name}
                                className="h-8 w-8 rounded-full"
                              />
                              <span className="text-sm text-gray-300">{chat.name}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedRecipients.includes(chat)}
                              onChange={() => {
                                const isSelected = selectedRecipients.includes(chat)
                                setSelectedRecipients(
                                  isSelected
                                    ? selectedRecipients.filter((r) => r !== chat)
                                    : [...selectedRecipients, chat],
                                )
                                setSelectAll(false)
                              }}
                              className="rounded border-gray-600 bg-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Recipients */}
                  <div className="space-y-2">
                    {selectedRecipients.map((recipient, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#222222] rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={recipient.logo || "/placeholder.svg"}
                            alt={recipient.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-sm text-gray-300">{recipient.name}</span>
                        </div>
                        <button
                          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                          onClick={() => setSelectedRecipients(selectedRecipients.filter((r) => r !== recipient))}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeScreen === "book-appointment" && (
          <div className="flex-1 flex flex-col p-4">
            <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Date and Time:</h3>
              <input type="datetime-local" className="w-full p-2 bg-gray-800 text-white rounded-md" />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Appointment Type:</h3>
              <select className="w-full p-2 bg-gray-800 text-white rounded-md">
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>General Checkup</option>
              </select>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Notes:</h3>
              <textarea
                className="w-full h-32 p-2 bg-gray-800 text-white rounded-md"
                placeholder="Add any additional notes or comments..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveScreen("chat")}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle appointment booking logic here
                  alert("Appointment booked successfully!")
                  setActiveScreen("chat")
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

