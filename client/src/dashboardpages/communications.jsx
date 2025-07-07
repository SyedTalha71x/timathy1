/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
""
import { useState, useEffect, useRef } from "react"
import {
  Menu,
  X,
  Search,
  MoreVertical,
  Smile,
  Clock,
  Send,
  Gift,
  Calendar,
  XCircle,
  Mail,
  Archive,
  Eye,
  EyeOff,
  User,
  Building2,
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"
import CommuncationBg from "../../public/communication-bg.svg"
import AddAppointmentModal from "../components/appointments-components/add-appointment-modal"
import SelectedAppointmentModal from "../components/appointments-components/selected-appointment-modal"

const img1 = "/Rectangle 1.png"
const img2 = "/avatar3.png"

export default function Communications() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(true)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [chatType, setChatType] = useState("member")
  const [activeScreen, setActiveScreen] = useState("chat")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [messageText, setMessageText] = useState("")
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [chatList, setChatList] = useState([])
  const [archivedChats, setArchivedChats] = useState([])
  const [searchMember, setSearchMember] = useState("")
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [messageReactions, setMessageReactions] = useState({})
  const [unreadMessages, setUnreadMessages] = useState(new Set())
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  })
  const [preConfiguredMessages, setPreConfiguredMessages] = useState([
    {
      id: 1,
      title: "Meeting Reminder",
      message: "This is a reminder about our upcoming meeting.",
    },
    {
      id: 2,
      title: "Event Announcement",
      message: "We're excited to announce our upcoming event!",
    },
    {
      id: 3,
      title: "Important Update",
      message: "There has been an important update to our policies.",
    },
    {
      id: 4,
      title: "Welcome Message",
      message: "Welcome to our platform! We're glad to have you here.",
    },
  ])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      date: "2025-03-15T10:00",
      status: "upcoming",
      type: "Consultation",
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      date: "2025-03-20T14:30",
      status: "upcoming",
      type: "Follow-up",
    },
    {
      id: 3,
      title: "Annual Review",
      date: "2025-04-05T11:00",
      status: "upcoming",
      type: "Annual Review",
    },
  ])
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    date: "",
    status: "upcoming",
  })
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Consultation", duration: 30, color: "bg-blue-700" },
    { name: "Follow-up", duration: 45, color: "bg-green-700" },
    { name: "Annual Review", duration: 60, color: "bg-purple-600" },
  ])
  const [freeAppointments, setFreeAppointments] = useState([
    { id: 1, date: "2025-03-15", time: "9:00 AM" },
    { id: 2, date: "2025-03-15", time: "11:00 AM" },
    { id: 3, date: "2025-03-15", time: "2:00 PM" },
    { id: 4, date: "2025-03-20", time: "10:00 AM" },
    { id: 5, date: "2025-03-20", time: "1:30 PM" },
    { id: 6, date: "2025-04-05", time: "9:30 AM" },
    { id: 7, date: "2025-04-05", time: "3:00 PM" },
  ])
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [newMessage, setNewMessage] = useState({ title: "", message: "" })
  const [contingent, setContingent] = useState({ used: 1, total: 7 })
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")
  const [tempContingent, setTempContingent] = useState(1)
  const [showArchive, setShowArchive] = useState(false)

  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const chatDropdownRef = useRef(null)
  const groupDropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const recipientDropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

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

  // Staff chat list (renamed from employee)
  const staffChatList = [
    {
      id: 1,
      name: "Jennifer Markus",
      time: "Today | 05:30 PM",
      active: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isBirthday: true,
      messages: [
        {
          id: 1,
          sender: "Jennifer",
          content: "Oh, hello! All perfectly. I will check it and get back to you soon.",
          time: "04:45 PM",
          isUnread: false,
        },
        {
          id: 2,
          sender: "You",
          content: "Yes, hello! All perfectly. I will check it and get back to you soon.",
          time: "04:45 PM",
          isUnread: false,
        },
      ],
    },
    {
      id: 2,
      name: "Jerry Haffer",
      time: "Today | 05:30 PM",
      verified: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      messages: [
        {
          id: 1,
          sender: "Jerry",
          content: "Have you seen the latest design updates?",
          time: "03:30 PM",
          isUnread: false,
        },
        {
          id: 2,
          sender: "You",
          content: "Not yet, I'll take a look right away.",
          time: "03:32 PM",
          isUnread: false,
        },
      ],
    },
  ]

  const memberChatList = [
    {
      id: 3,
      name: "Group 1",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
      messages: [
        {
          id: 1,
          sender: "Alex",
          content: "When is our next meeting scheduled?",
          time: "02:15 PM",
          isUnread: false,
        },
        {
          id: 2,
          sender: "You",
          content: "Tomorrow at 10 AM.",
          time: "02:17 PM",
          isUnread: false,
        },
      ],
    },
    {
      id: 4,
      name: "David Eison",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
      isBirthday: true,
      messages: [
        {
          id: 1,
          sender: "David",
          content: "Can we discuss the project timeline?",
          time: "01:45 PM",
          isUnread: false,
        },
        {
          id: 2,
          sender: "You",
          content: "Sure, I'm available this afternoon.",
          time: "01:50 PM",
          isUnread: false,
        },
      ],
    },
    {
      id: 5,
      name: "Mary Freund",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      messages: [
        {
          id: 1,
          sender: "Mary",
          content: "Did you review the latest feedback?",
          time: "11:20 AM",
          isUnread: false,
        },
        {
          id: 2,
          sender: "You",
          content: "Yes, I've incorporated the changes.",
          time: "11:25 AM",
          isUnread: false,
        },
      ],
    },
  ]

  // Company chat - single chat with studio name
  const companyChatList = [
    {
      id: 100,
      name: "Fit Chain GmbH",
      time: "Today | 05:30 PM",
      message: "Welcome to Fit Chain GmbH communications",
      logo: img1,
      messages: [
        {
          id: 1,
          sender: "System",
          content: "Welcome to Fit Chain GmbH internal communications.",
          time: "09:00 AM",
          isUnread: false,
        },
      ],
    },
  ]

  useEffect(() => {
    if (chatType === "staff") {
      setChatList(staffChatList)
    } else if (chatType === "member") {
      setChatList(memberChatList)
    } else if (chatType === "company") {
      setChatList(companyChatList)
    }
  }, [chatType])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleCloseChat = (chatId, e) => {
    e.stopPropagation()
    const chatToArchive = chatList.find((chat) => chat.id === chatId)
    if (chatToArchive) {
      setArchivedChats((prev) => [...prev, chatToArchive])
    }
    setChatList((prevList) => prevList.filter((chat) => chat.id !== chatId))
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null)
    }
  }

  const handleRestoreChat = (chatId) => {
    const chatToRestore = archivedChats.find((chat) => chat.id === chatId)
    if (chatToRestore) {
      setChatList((prev) => [...prev, chatToRestore])
      setArchivedChats((prev) => prev.filter((chat) => chat.id !== chatId))
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUnread: false,
    }

    setMessages([...messages, newMessage])

    setChatList((prevList) =>
      prevList.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...(chat.messages || []), newMessage],
              message: messageText,
            }
          : chat,
      ),
    )

    setMessageText("")
  }

  const handleReaction = (messageId, reaction) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [reaction]: (prev[messageId]?.[reaction] || 0) + 1,
      },
    }))
    setShowReactionPicker(null)
  }

  const handleMarkAsUnread = (messageId) => {
    setUnreadMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  const handleEmailClick = () => {
    setShowEmailModal(true)
  }

  const handleSendEmail = () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      alert("Please fill in all email fields")
      return
    }

    // In a real application, you would send this to your backend
    console.log("Sending email:", emailData)
    alert("Email sent successfully!")

    setEmailData({ to: "", subject: "", body: "" })
    setShowEmailModal(false)
  }

  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentData) {
      setSelectedAppointmentData({
        ...selectedAppointmentData,
        ...changes,
      })
    }
  }

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null)
    setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointments.map((a) => a.id)) + 1,
      ...data,
    }
    setAppointments([...appointments, newAppointment])
    setShowAddAppointmentModal(false)
  }

  const handleCalendarClick = () => {
    setShowAppointmentModal(true)
  }

  const handleEditAppointment = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedChat?.name || "Member",
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentData(fullAppointment)
    setShowSelectedAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleCreateNewAppointment = () => {
    setShowAddAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleMemberSelect = (member) => {
    setSelectedRecipients((prev) => (prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]))
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const filteredList = chatList.filter(
        (chat) => searchMember === "" || chat.name.toLowerCase().includes(searchMember.toLowerCase()),
      )
      setSelectedRecipients(filteredList)
    } else {
      setSelectedRecipients([])
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessageText((prevText) => prevText + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File uploaded:", file.name)
      setShowMediaUpload(false)
    }
  }

  const handleBroadcast = () => {
    if (!selectedMessage) {
      alert("Please select a message to broadcast")
      return
    }

    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient")
      return
    }

    console.log("Broadcasting message to recipients:", selectedRecipients)
    console.log("Broadcast title:", selectedMessage.title)
    console.log("Broadcast message:", selectedMessage.message)

    alert(`Broadcast sent to ${selectedRecipients.length} recipients`)

    setSelectedMessage(null)
    setSelectedRecipients([])
    setActiveScreen("chat")
  }

  const handleCreateMessage = () => {
    setShowCreateMessageModal(true)
  }

  const handleSaveNewMessage = () => {
    if (!newMessage.title.trim() || !newMessage.message.trim()) {
      alert("Please enter both title and message")
      return
    }

    const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1
    const messageToAdd = {
      id: newId,
      title: newMessage.title,
      message: newMessage.message,
    }

    setPreConfiguredMessages([...preConfiguredMessages, messageToAdd])
    setSelectedMessage(messageToAdd)
    setShowCreateMessageModal(false)
    setNewMessage({ title: "", message: "" })
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    setMessages(chat.messages || [])
    setIsMessagesOpen(false)
  }

  const handleCancelAppointment = (id) => {
    setSelectedAppointmentData(appointments.find((app) => app.id === id))
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }

  const handleSaveAppointment = () => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((app) => (app.id === editingAppointment.id ? { ...app, ...newAppointment } : app)),
      )
      setEditingAppointment(null)
    } else {
      const id = Math.max(0, ...appointments.map((a) => a.id)) + 1
      setAppointments([...appointments, { id, ...newAppointment }])
    }
    setNewAppointment({ title: "", date: "", status: "upcoming" })
  }

  const handleManageContingent = () => {
    setTempContingent(contingent.used)
    setShowContingentModal(true)
  }

  const handleSaveContingent = () => {
    if (tempContingent >= contingent.used && tempContingent <= contingent.total) {
      setContingent({ ...contingent, used: tempContingent })
    }
    setShowContingentModal(false)
  }

  const reactions = [
    { emoji: "❤️", name: "heart" },
    { emoji: "😂", name: "laugh" },
    { emoji: "😮", name: "wow" },
    { emoji: "😢", name: "sad" },
    { emoji: "😡", name: "angry" },
  ]

  return (
    <div className="relative flex h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
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
          <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
  <button
    className={`px-4 py-2 flex items-center rounded-lg text-sm transition-colors ${
      chatType === "member" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
    }`}
    onClick={() => setChatType("member")}
  >
    <User size={16} className="inline mr-2" />
    Member
  </button>
  <button
    className={`px-4 flex items-center py-2 rounded-lg text-sm transition-colors ${
      chatType === "company" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
    }`}
    onClick={() => setChatType("company")}
  >
    <Building2 size={16} className="inline mr-2" />
    Studio
  </button>
  <button
    className="px-4 py-2 flex items-center rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
    onClick={handleEmailClick}
  >
    <Mail size={16} className="inline mr-2" />
    Email
  </button>
</div>

            {chatType !== "company" && (
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
                      onClick={() => setShowArchive(true)}
                    >
                      Archive
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
                            src={chat.logo || "/placeholder.svg?height=32&width=32"}
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
                            src={chat.logo || "/placeholder.svg?height=32&width=32"}
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
            )}
          </div>

          {chatType !== "company" && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 border border-slate-200 bg-black rounded-xl text-sm outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {chatList.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${
                  selectedChat?.id === chat.id ? "bg-[#181818]" : "hover:bg-[#181818]"
                } cursor-pointer relative group`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="relative">
                  <img
                    src={chat.logo || "/placeholder.svg?height=40&width=40"}
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <p className="truncate">{chat.message}</p>
                  </div>
                  <div className="flex mt-1 text-gray-400 items-center gap-1">
                    <Clock size={15} />
                    <span className="text-sm text-gray-400">{chat.time}</span>
                  </div>
                </div>
                {chatType !== "company" && (
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                    onClick={(e) => handleCloseChat(chat.id, e)}
                    aria-label="Archive chat"
                  >
                    <XCircle className="w-4 h-4 text-gray-300" />
                  </button>
                )}
              </div>
            ))}
            {chatList.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="mb-2">No chats available</p>
                {chatType !== "company" && (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
                    onClick={handleNewChat}
                  >
                    Start a new chat
                  </button>
                )}
              </div>
            )}
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
        {!selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="md:hidden absolute top-4 left-4 text-gray-400 hover:text-gray-300"
              aria-label="Open messages"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="mb-5">
              <img
                src={CommuncationBg || "/placeholder.svg"}
                alt="Welcome to Communications"
                className="w-64 h-64 mx-auto"
              />
            </div>
            <p className="md:w-[50%] text-gray-400 text-sm mx-auto w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam odio quaerat aliquam magnam omnis
              inventore deserunt unde ut explicabo corporis.
            </p>
          </div>
        )}

        {selectedChat && activeScreen === "chat" && (
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
                    src={selectedChat.logo || "/placeholder.svg"}
                    alt="Current chat avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {selectedChat.isBirthday && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                      <Gift className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="font-medium">{selectedChat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-400"
                  aria-label="View appointments"
                  onClick={handleCalendarClick}
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
                <button
                  className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-800"
                  onClick={() => setSelectedChat(null)}
                  aria-label="Close current chat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === "You" ? "justify-end" : ""} group`}>
                  <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""}`}>
                    <div
                      className={`rounded-xl p-4 text-sm max-w-md relative ${
                        message.sender === "You" ? "bg-[#3F74FF]" : "bg-black"
                      } ${unreadMessages.has(message.id) ? "border-2 border-yellow-500" : ""}`}
                    >
                      <p>{message.content}</p>

                      {/* Message actions */}
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                          className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                          title="Add reaction"
                        >
                          <Smile className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMarkAsUnread(message.id)}
                          className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                          title={unreadMessages.has(message.id) ? "Mark as read" : "Mark as unread"}
                        >
                          {unreadMessages.has(message.id) ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Reaction picker */}
                      {showReactionPicker === message.id && (
                        <div className="absolute -top-12 left-0 bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.name}
                              onClick={() => handleReaction(message.id, reaction.name)}
                              className="p-1 hover:bg-gray-700 rounded"
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Display reactions */}
                      {messageReactions[message.id] && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(messageReactions[message.id]).map(([reactionName, count]) => {
                            const reaction = reactions.find((r) => r.name === reactionName)
                            return (
                              <span
                                key={reactionName}
                                className="bg-gray-700 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                              >
                                {reaction?.emoji} {count}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{message.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex items-center gap-1">
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
                  <div className="bg-gray-800 rounded-lg shadow-lg p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {["😀", "😂", "😊", "❤️", "👍", "🎉", "🔥", "⭐", "🙏", "👏"].map((emoji, i) => (
                        <button
                          key={i}
                          className="p-2 hover:bg-gray-700 rounded-md"
                          onClick={() => handleEmojiSelect({ native: emoji })}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
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
                  <h2 className="text-lg font-medium">New Broadcast</h2>
                  <button onClick={() => setActiveScreen("chat")} className="p-2 hover:bg-zinc-700 rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Select Pre-configured Message
                    </label>
                    <div className="bg-[#222222] rounded-xl overflow-hidden">
                      {preConfiguredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-3 cursor-pointer hover:bg-[#2F2F2F] ${
                            selectedMessage?.id === msg.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                          }`}
                        >
                          <p className="font-medium text-sm">{msg.title}</p>
                          <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={handleCreateMessage}
                      className="w-full py-2 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      Create New Message
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowRecipientDropdown(!showRecipientDropdown)
                        if (!showRecipientDropdown) {
                          setSearchMember("")
                        }
                      }}
                      className="w-full py-3 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl"
                    >
                      Select Recipients
                    </button>

                    {showRecipientDropdown && (
                      <div
                        ref={recipientDropdownRef}
                        className="absolute left-0 right-0 mt-2 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-50 max-h-[250px] overflow-y-auto custom-scrollbar"
                      >
                        <div className="p-2 border-b border-gray-800">
                          <div className="relative mb-2">
                            <input
                              type="text"
                              value={searchMember}
                              onChange={(e) => setSearchMember(e.target.value)}
                              className="w-full bg-[#222222] text-white rounded-xl pl-10 pr-4 py-2 text-sm"
                              placeholder="Search members..."
                              autoFocus
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-300">Select all</span>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="rounded border-gray-600 bg-transparent"
                            />
                          </div>
                        </div>
                        {chatList
                          .filter(
                            (chat) =>
                              searchMember === "" || chat.name.toLowerCase().includes(searchMember.toLowerCase()),
                          )
                          .map((chat, index) => (
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
                                onChange={() => handleMemberSelect(chat)}
                                className="rounded border-gray-600 bg-transparent"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

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
                          onClick={() => handleMemberSelect(recipient)}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBroadcast}
                    className={`w-full py-3 ${
                      selectedMessage && selectedRecipients.length > 0
                        ? "bg-[#FF843E] text-sm hover:bg-orange-600"
                        : "bg-gray-600"
                    } text-white text-sm rounded-xl`}
                    disabled={!selectedMessage || selectedRecipients.length === 0}
                  >
                    Send Broadcast
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Email
                </h2>
                <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                    className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-32 resize-none"
                    placeholder="Type your email message here..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchive && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archived Chats
                </h2>
                <button onClick={() => setShowArchive(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                {archivedChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Archive className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No archived chats</p>
                  </div>
                ) : (
                  archivedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F]"
                    >
                      <img
                        src={chat.logo || "/placeholder.svg?height=32&width=32"}
                        alt={`${chat.name}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{chat.name}</p>
                        <p className="text-xs text-gray-400 truncate">{chat.message}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreChat(chat.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                      >
                        Restore
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{selectedChat?.name}'s Appointments</h2>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false)
                    setEditingAppointment(null)
                    setNewAppointment({
                      title: "",
                      date: "",
                      status: "upcoming",
                    })
                  }}
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                    const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"

                    return (
                      <div
                        key={appointment.id}
                        className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{appointment.title}</p>
                            <div>
                              <p className="text-sm text-white/70">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-white/70">
                                {new Date(appointment.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAppointment(appointment)
                              }}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelAppointment(appointment.id)
                              }}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                    No appointments scheduled
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
                <div className="text-sm text-gray-300">
                  Contingent ({currentBillingPeriod}): {contingent.used} / {contingent.total}
                </div>
                <button
                  onClick={handleManageContingent}
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Manage
                </button>
              </div>

              <button
                onClick={handleCreateNewAppointment}
                className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
              >
                Create New Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModal}
          onClose={() => setShowAddAppointmentModal(false)}
          appointmentTypes={appointmentTypes}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          freeAppointments={freeAppointments}
        />
      )}

      {/* Edit Appointment Modal */}
      {showSelectedAppointmentModal && selectedAppointmentData && (
        <SelectedAppointmentModal
          selectedAppointment={selectedAppointmentData}
          setSelectedAppointment={setSelectedAppointmentData}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={handleAppointmentChange}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointment}
        />
      )}

      {/* Create Message Modal */}
      {showCreateMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Create New Message</h2>
                <button onClick={() => setShowCreateMessageModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Enter message title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-32 resize-none"
                    placeholder="Enter your message content"
                  />
                </div>

                <button
                  onClick={handleSaveNewMessage}
                  className="w-full py-3 bg-[#FF843E] text-sm hover:bg-orange-600 text-white rounded-xl"
                  disabled={!newMessage.title.trim() || !newMessage.message.trim()}
                >
                  Save Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contingent Management Modal */}
      {showContingentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Manage Appointment Contingent</h2>
                <button onClick={() => setShowContingentModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Billing Period: {currentBillingPeriod}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Current Usage</label>
                      <input
                        type="number"
                        min={contingent.used}
                        max={contingent.total}
                        value={tempContingent}
                        onChange={(e) => setTempContingent(Number.parseInt(e.target.value))}
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Maximum (Fixed)</label>
                      <input
                        type="number"
                        value={contingent.total}
                        disabled
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: You can only increase the current usage, not the maximum value.
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowContingentModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContingent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNotifyMemberOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Notify and Delete Member</h2>
                <button onClick={() => setIsNotifyMemberOpen(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                {notifyAction === "book" && "Would you like to notify the member about their new appointment?"}
                {notifyAction === "change" && "Would you like to notify the member about changes to their appointment?"}
                {notifyAction === "delete" &&
                  "Would you like to notify the member that their appointment has been cancelled?"}
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsNotifyMemberOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    alert("Member has been notified and appointment is deleted")
                    setIsNotifyMemberOpen(false)
                  }}
                  className="px-4 py-1.5 bg-red-600 text-sm  text-white rounded-xl"
                >
                  Yes, Notify and delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
