
/* eslint-disable no-unused-vars */
import { useState } from "react"
import {
  Mail,
  Send,
  Inbox,
  FileText,
  MoreVertical,
  Archive,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  RefreshCw,
  Reply,
  Trash2,
  Search,
  X,
} from "lucide-react"
import { ChevronUp, ChevronDown, Type, Paperclip } from "lucide-react"

import { IoIosMegaphone, IoIosMenu } from "react-icons/io"
import toast from "react-hot-toast"

import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import Sidebar from "../../components/admin-dashboard-components/central-sidebar"
import BroadcastModal from "../../components/admin-dashboard-components/email-components/BroadcastModal"
import SendEmailModal from "../../components/admin-dashboard-components/email-components/SendEmail"
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"

const emailListNew = {
  inbox: [
    {
      id: 1,
      sender: "support@example.com",
      subject: "Your recent inquiry",
      body: "Dear user, thank you for contacting us. We have received your inquiry and will get back to you within 24 hours. Best regards, Support Team",
      time: "2025-07-18T10:00:00Z",
      status: "Delivered",
      isRead: false,
      isPinned: false,
      isArchived: false,
    },
    {
      id: 2,
      sender: "media-library@example.com",
      subject: "New product launch!",
      body: "Exciting news! Our new product is now available. Check it out here: [link]. Don't miss out on our early bird discount!",
      time: "2025-07-17T15:30:00Z",
      status: "Read",
      isRead: true,
      isPinned: true,
      isArchived: false,
    },
    {
      id: 6,
      sender: "newsletter@techblog.com",
      subject: "Weekly Tech News",
      body: "This week in tech: AI breakthroughs, new smartphone releases, and cybersecurity updates. Stay informed with our weekly digest.",
      time: "2025-07-16T08:00:00Z",
      status: "Delivered",
      isRead: false,
      isPinned: false,
      isArchived: false,
    },
  ],
  sent: [
    {
      id: 3,
      recipient: "jennifer@example.com",
      subject: "Meeting Reminder",
      body: "Hi Jennifer, just a friendly reminder about our meeting tomorrow at 10 AM. Please be prepared to discuss the project milestones. Thanks!",
      status: "Delivered",
      time: "2025-07-16T09:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
    },
    {
      id: 4,
      recipient: "jerry@example.com",
      subject: "Event Announcement",
      body: "Hi Jerry, We're excited to announce our upcoming event! It will be held on August 1st at the community center. More details to follow soon.",
      status: "Read",
      time: "2025-07-15T14:30:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
    },
  ],
  draft: [
    {
      id: 5,
      recipient: "draft@example.com",
      subject: "Draft Email Subject",
      body: "This is a draft email. I'll finish it later.",
      status: "Draft",
      time: "2025-07-19T11:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
    },
  ],
  outbox: [],
  archive: [],
  error: [],
  trash: [],
}

const emailTemplates = [
  {
    id: 1,
    name: "Meeting Request",
    subject: "Meeting Request - {{topic}}",
    body: "Hi {{name}},\n\nI would like to schedule a meeting to discuss {{topic}}. Please let me know your availability.\n\nBest regards,\n{{sender_name}}",
  },
  {
    id: 2,
    name: "Follow Up",
    subject: "Following up on {{topic}}",
    body: "Hi {{name}},\n\nI wanted to follow up on our previous conversation about {{topic}}. Do you have any updates?\n\nThanks,\n{{sender_name}}",
  },
  {
    id: 3,
    name: "Thank You",
    subject: "Thank you for {{reason}}",
    body: "Hi {{name}},\n\nThank you for {{reason}}. It was a pleasure working with you.\n\nBest regards,\n{{sender_name}}",
  },
]

const members = [
  { id: 1, name: "John Doe", email: "john@example.com", logo: null },
  { id: 2, name: "Jane Smith", email: "jane@example.com", logo: null },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", logo: null },
  { id: 4, name: "Alice Brown", email: "alice@example.com", logo: null },
]

const EmailManagementPage = () => {
  const [emailTab, setEmailTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showSendEmailModal, setShowSendEmailModal] = useState(false)
  const [showOriginalMessage, setShowOriginalMessage] = useState(false)

  const [replyData, setReplyData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  })

  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  const [emailList, setEmailList] = useState(() => {
    const defaultList = {
      inbox: [],
      sent: [],
      draft: [],
      outbox: [],
      archive: [],
      error: [],
      trash: [],
    }

    const mergedList = { ...defaultList }
    if (emailListNew) {
      Object.keys(defaultList).forEach((key) => {
        if (emailListNew[key] && Array.isArray(emailListNew[key])) {
          mergedList[key] = emailListNew[key]
        }
      })
    }

    return mergedList
  })

  const [selectedEmails, setSelectedEmails] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Email Modal States
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "", // Add CC field
    subject: "",
    body: "",
  })


  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)

  //sidebar related logic and states
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    { id: "sidebar-notes", type: "notes", position: 4 },
  ])
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic

  const updateEmailStatus = (emailId, updates) => {
    setEmailList((prev) => {
      const newEmailList = { ...prev }
      Object.keys(newEmailList).forEach((folder) => {
        if (newEmailList[folder] && Array.isArray(newEmailList[folder])) {
          newEmailList[folder] = newEmailList[folder].map((email) =>
            email.id === emailId ? { ...email, ...updates } : email,
          )
        }
      })
      return newEmailList
    })
  }

  const moveEmailToTrash = (emailId) => {
    setEmailList((prev) => {
      const newEmailList = { ...prev }
      let emailToMove = null

      Object.keys(newEmailList).forEach((folder) => {
        if (folder !== "trash" && newEmailList[folder] && Array.isArray(newEmailList[folder])) {
          const emailIndex = newEmailList[folder].findIndex((email) => email.id === emailId)
          if (emailIndex !== -1) {
            emailToMove = newEmailList[folder][emailIndex]
            newEmailList[folder].splice(emailIndex, 1)
          }
        }
      })

      if (emailToMove && newEmailList.trash) {
        newEmailList.trash.push({ ...emailToMove, deletedAt: new Date().toISOString() })
      }

      return newEmailList
    })
  }
  const handleReply = (email) => {
    setReplyData({
      to: email.sender,
      cc: "",
      bcc: "",
      subject: email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`,
      body: "",
    })
    setShowOriginalMessage(true) // Show original message by default
    setShowReplyModal(true)
  }



  const sendReply = () => {
    const newReply = {
      id: Date.now().toString(),
      sender: "You",
      recipient: replyData.to,
      cc: replyData.cc || null,
      bcc: replyData.bcc || null,
      subject: replyData.subject,
      body: replyData.body,
      time: new Date().toISOString(),
      status: "Sent",
      isRead: true,
      isPinned: false,
      isArchived: false,
    }

    setEmailList((prev) => ({
      ...prev,
      sent: [newReply, ...prev.sent],
    }))

    setShowReplyModal(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setShowOriginalMessage(false)
  }


  const bulkAction = (action) => {
    selectedEmails.forEach((emailId) => {
      switch (action) {
        case "archive":
          updateEmailStatus(emailId, { isArchived: true })
          break
        case "delete":
          moveEmailToTrash(emailId)
          break
        case "markRead":
          updateEmailStatus(emailId, { isRead: true, status: "Read" })
          break
        case "markUnread":
          updateEmailStatus(emailId, { isRead: false, status: "Delivered" })
          break
      }
    })
    setSelectedEmails([])
    setSelectAll(false)
  }

  const toggleDropdown = (emailId, e) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === emailId ? null : emailId)
  }

  const handleMenuAction = (action, email, e) => {
    e.stopPropagation()

    switch (action) {
      case "toggleRead":
        updateEmailStatus(email.id, {
          isRead: !email.isRead,
          status: email.isRead ? "Delivered" : "Read",
        })
        break
      case "togglePin":
        updateEmailStatus(email.id, { isPinned: !email.isPinned })
        break
      case "toggleArchive":
        updateEmailStatus(email.id, { isArchived: !email.isArchived })
        break
      case "delete":
        moveEmailToTrash(email.id)
        break
      default:
        break
    }
    setActiveDropdown(null)
  }

  const handleEmailTabClick = (tab) => {
    setEmailTab(tab)
    setSelectedEmail(null)
    setActiveDropdown(null)
    setSelectedEmails([])
    setSelectAll(false)
  }

  const handleEmailItemClick = (email) => {
    if (!email.isRead && emailTab === "inbox") {
      updateEmailStatus(email.id, { isRead: true, status: "Read" })
    }
    setSelectedEmail(email)
    setActiveDropdown(null)
  }

  const handleCheckboxChange = (emailId, e) => {
    e.stopPropagation()
    setSelectedEmails((prev) => (prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]))
  }

  const handleSelectAll = (e) => {
    const filteredEmails = getFilteredEmails()
    if (e.target.checked) {
      setSelectedEmails(filteredEmails.map((email) => email.id))
      setSelectAll(true)
    } else {
      setSelectedEmails([])
      setSelectAll(false)
    }
  }

  const getFilteredEmails = () => {
    let emails = emailList[emailTab] || []

    if (!Array.isArray(emails)) {
      emails = []
    }

    if (emailTab === "archive") {
      return Object.values(emailList)
        .filter((arr) => Array.isArray(arr))
        .flat()
        .filter((email) => email && email.isArchived)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
    }

    if (emailTab === "error" || emailTab === "trash") {
      return emails.sort((a, b) => new Date(b.time) - new Date(a.time))
    }

    return emails
      .filter((email) => email && !email.isArchived)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.time) - new Date(a.time)
      })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString()
  }

  const truncateText = (text, maxLength = 60) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const getUnreadCount = () => {
    if (!emailList.inbox || !Array.isArray(emailList.inbox)) {
      return 0
    }
    return emailList.inbox.filter((e) => e && !e.isRead && !e.isArchived).length
  }

  const getTrashCount = () => {
    if (!emailList.trash || !Array.isArray(emailList.trash)) {
      return 0
    }
    return emailList.trash.length
  }

  const getErrorCount = () => {
    if (!emailList.error || !Array.isArray(emailList.error)) {
      return 0
    }
    return emailList.error.length
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
    setActiveDropdown(null)
    setShowReplyModal(false)
  }
  const handleCloseReplyModal = () => {
    setShowReplyModal(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setShowOriginalMessage(false)
  }


  // Email Modal Functions
  const handleTemplateSelect = (template) => {
    setSelectedEmailTemplate(template)
    if (template) {
      setEmailData({
        ...emailData,
        subject: template.subject,
        body: template.body,
      })
    }
    setShowTemplateDropdown(false)
  }

  const handleSearchMemberForEmail = (searchTerm) => {
    if (!searchTerm) return []
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const handleSelectEmailRecipient = (member) => {
    setEmailData({ ...emailData, to: member.email })
    setShowRecipientDropdown(false)
  }

  const handleSendEmail = () => {
    const newEmail = {
      id: Date.now().toString(),
      sender: "You",
      recipient: emailData.to,
      cc: emailData.cc || null, // Include CC
      subject: emailData.subject,
      body: emailData.body,
      time: new Date().toISOString(),
      status: "Sent",
      isRead: true,
      isPinned: false,
      isArchived: false,
    }

    setEmailList((prev) => ({
      ...prev,
      sent: [newEmail, ...prev.sent],
    }))

    setShowSendEmailModal(false)
    setEmailData({ to: "", cc: "", subject: "", body: "" }) // Reset CC too
    setSelectedEmailTemplate(null)
  }


  const onRefresh = () => {
    // Simulate refresh - in real app this would fetch from server
    console.log("Refreshing emails...")
  }

  const handleBroadcast = ({ message, recipients, settings }) => {
    const nowIso = new Date().toISOString()
    const newEmails = (recipients || []).map((rec) => ({
      id: `${Date.now()}-${rec?.id || Math.random()}`,
      sender: "You",
      recipient: rec?.email || rec?.name || "Recipient",
      subject: message?.title || "Broadcast",
      body: message?.message || "",
      time: nowIso,
      status: "Sent",
      isRead: true,
      isPinned: false,
      isArchived: false,
    }))

    setEmailList((prev) => ({
      ...prev,
      sent: [...newEmails, ...(prev.sent || [])],
    }))
  }

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div
      className={`
        min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
        transition-all duration-500 ease-in-out flex-1
       ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"}
      `}
    >
      <div className="">
        <div className="">
          <div className=" border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">Email</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSendEmailModal(true)}
                  className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send Email</span>
                  <span className="sm:hidden">Send</span>
                </button>
                {/* <div
                  onClick={toggleRightSidebar}
                  className="cursor-pointer  text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md "
                >
                  <IoIosMenu size={26} />
                </div> */}
                <img
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="h-5 w-5 mr-5    cursor-pointer"
                  src="/icon.svg"
                  alt=""
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 md:gap-2 border-b border-gray-700 overflow-x-auto">
              <button
                onClick={() => handleEmailTabClick("inbox")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "inbox" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Inbox size={16} />
                Inbox
                {getUnreadCount() > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getUnreadCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleEmailTabClick("sent")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "sent" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Send size={16} />
                <span className="hidden sm:inline">Sent</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("draft")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "draft" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Draft</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("archive")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "archive" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Archive size={16} />
                <span className="hidden sm:inline">Archive</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("trash")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "trash" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Trash</span>
                {getTrashCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTrashCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleEmailTabClick("error")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${emailTab === "error" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                Error
                {getErrorCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getErrorCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 md:p-4 min-h-[600px]">
            {selectedEmail ? (
              <div className="bg-[#222222] rounded-xl p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-medium mb-2">{selectedEmail.subject}</h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="text-sm text-gray-400">
                        <p>From: {selectedEmail.sender || "You"}</p>
                        {selectedEmail.recipient && <p>To: {selectedEmail.recipient}</p>}
                        <p>Date: {new Date(selectedEmail.time).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {emailTab === "inbox" && (
                          <button
                            onClick={() => handleReply(selectedEmail)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        )}
                        <button onClick={handleBackToList} className="p-2 hover:bg-zinc-700 rounded-lg">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="prose prose-invert text-white text-sm leading-relaxed">
                  <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {emailTab === "inbox" && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#222222] rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-400">Select All</span>
                    </div>
                    <button
                      onClick={onRefresh}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                )}

                {selectedEmails.length > 1 && (
                  <div className="flex flex-wrap gap-2 bg-[#222222] rounded-xl p-3">
                    <button
                      onClick={() => bulkAction("archive")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                    >
                      <Archive className="w-3 h-3" />
                      Archive
                    </button>
                    <button
                      onClick={() => bulkAction("delete")}
                      className="flex items-center gap-1 px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                    <button
                      onClick={() => bulkAction("markRead")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                    >
                      <Eye className="w-3 h-3" />
                      Mark Read
                    </button>
                    <button
                      onClick={() => bulkAction("markUnread")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                    >
                      <EyeOff className="w-3 h-3" />
                      Mark Unread
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {getFilteredEmails().length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No emails in this folder.</div>
                  ) : (
                    getFilteredEmails().map((email) => (
                      <div
                        key={email.id}
                        className={`relative flex items-center justify-between p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer ${!email.isRead ? "border-l-4 border-blue-500" : ""
                          } ${email.isPinned ? "ring-1 ring-yellow-500" : ""}`}
                        onClick={() => handleEmailItemClick(email)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedEmails.includes(email.id)}
                            onChange={(e) => handleCheckboxChange(email.id, e)}
                            className="rounded border-gray-600 bg-transparent flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {email.isPinned && <Pin className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm text-gray-300 flex-shrink-0">
                                  {email.sender || email.recipient}
                                </p>
                                {!email.isRead && <span className="text-blue-400 text-xs flex-shrink-0">(Unread)</span>}
                              </div>
                              <div className="text-xs text-gray-400">
                                <span className="font-bold">{email.subject}</span>
                                <span className="ml-2">{truncateText(email.body || "")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
                          <span
                            className={`text-xs px-2 py-1 rounded hidden sm:inline ${email.status === "Read"
                              ? "bg-blue-600"
                              : email.status === "Delivered"
                                ? "bg-green-600"
                                : "bg-gray-600"
                              }`}
                          >
                            {email.status}
                          </span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(email.time)}</span>
                          <div className="relative">
                            <button
                              className="p-1 hover:bg-gray-600 rounded"
                              onClick={(e) => toggleDropdown(email.id, e)}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeDropdown === email.id && (
                              <div className="absolute right-0 top-8 bg-[#2F2F2F] border border-gray-600 rounded-lg shadow-lg z-10 min-w-[160px]">
                                <button
                                  onClick={(e) => handleMenuAction("toggleRead", email, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600 first:rounded-t-lg"
                                >
                                  {email.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  Mark as {email.isRead ? "Unread" : "Read"}
                                </button>
                                <button
                                  onClick={(e) => handleMenuAction("togglePin", email, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600"
                                >
                                  {email.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                  {email.isPinned ? "Unpin" : "Pin"}
                                </button>
                                <button
                                  onClick={(e) => handleMenuAction("toggleArchive", email, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600"
                                >
                                  <Archive className="w-4 h-4" />
                                  {email.isArchived ? "Unarchive" : "Archive"}
                                </button>
                                <button
                                  onClick={(e) => handleMenuAction("delete", email, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600 text-red-400 last:rounded-b-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="absolute bottom-4 md:bottom-6 right-4 md:right-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg z-10"
          title="Create Broadcast (Email Only)"
        >
          <IoIosMegaphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Backdrop for dropdown */}
      {activeDropdown && <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />}

      {/* Reply Modal */}
      {showReplyModal && selectedEmail && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">Reply</h3>
                <p className="text-sm text-gray-400">Replying to: {selectedEmail.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOriginalMessage(!showOriginalMessage)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2"
                  title={showOriginalMessage ? "Hide original message" : "Show original message"}
                >
                  {showOriginalMessage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {showOriginalMessage ? "Hide Original" : "Show Original"}
                  </span>
                </button>
                <button onClick={handleCloseReplyModal} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* To Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                  <input
                    type="email"
                    value={replyData.to}
                    onChange={(e) => setReplyData((prev) => ({ ...prev, to: e.target.value }))}
                    className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="recipient@example.com"
                  />
                </div>

                {/* CC Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CC</label>
                  <input
                    type="text"
                    value={replyData.cc}
                    onChange={(e) => setReplyData((prev) => ({ ...prev, cc: e.target.value }))}
                    className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray500 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="carbon copy (optional)"
                  />
                </div>

                {/* BCC Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">BCC</label>
                  <input
                    type="text"
                    value={replyData.bcc}
                    onChange={(e) => setReplyData((prev) => ({ ...prev, bcc: e.target.value }))}
                    className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="blind carbon copy (optional)"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={replyData.subject}
                    onChange={(e) => setReplyData((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Email Subject"
                  />
                </div>

                {/* Message with Wysiwyg Editor and Insert Button */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <button
                      onClick={() => {
                        // Handle signature insertion
                        const signature = "\n\nBest regards,\n[Your Name]";
                        setReplyData(prev => ({
                          ...prev,
                          body: prev.body + signature
                        }));
                      }}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                      <Type className="w-4 h-4" />
                      Insert Signature
                    </button>
                  </div>

                  <div className="border border-gray-700 rounded-xl overflow-hidden mb-4">
                    <WysiwygEditor
                      value={replyData.body}
                      onChange={(value) => setReplyData((prev) => ({ ...prev, body: value }))}
                      placeholder="Type your reply here..."
                    />
                  </div>
                </div>

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Attachments
                    </label>
                    <button
                      onClick={() => {
                        // Create a file input element
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => {
                          const files = Array.from(e.target.files);
                          // Handle file upload logic here
                          console.log('Files selected:', files);
                        };
                        fileInput.click();
                      }}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      Add Attachment
                    </button>
                  </div>

                  {/* You can add attachment preview here if needed */}
                </div>

                {/* Original Message (Outlook style) */}
                {showOriginalMessage && (
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-300">Original Message</h4>
                      <button
                        onClick={() => setShowOriginalMessage(false)}
                        className="p-1 hover:bg-gray-800 rounded"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex">
                          <span className="w-16 flex-shrink-0 font-medium">From:</span>
                          <span>{selectedEmail.sender}</span>
                        </div>
                        <div className="flex">
                          <span className="w-16 flex-shrink-0 font-medium">Date:</span>
                          <span>{new Date(selectedEmail.time).toLocaleString()}</span>
                        </div>
                        <div className="flex">
                          <span className="w-16 flex-shrink-0 font-medium">To:</span>
                          <span>{selectedEmail.recipient || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="w-16 flex-shrink-0 font-medium">Subject:</span>
                          <span className="font-medium">{selectedEmail.subject}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="prose prose-invert text-sm">
                          <pre className="whitespace-pre-wrap font-sans text-gray-300">
                            {selectedEmail.body}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={handleCloseReplyModal}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Send Email Modal */}
      <SendEmailModal
        show={showSendEmailModal}
        onClose={() => setShowSendEmailModal(false)}
        emailData={emailData}
        setEmailData={setEmailData}
        selectedEmailTemplate={selectedEmailTemplate}
        showTemplateDropdown={showTemplateDropdown}
        setShowTemplateDropdown={setShowTemplateDropdown}
        emailTemplates={emailTemplates}
        handleTemplateSelect={handleTemplateSelect}
        showRecipientDropdown={showRecipientDropdown}
        setShowRecipientDropdown={setShowRecipientDropdown}
        handleSearchMemberForEmail={handleSearchMemberForEmail}
        handleSelectEmailRecipient={handleSelectEmailRecipient}
        handleSendEmail={handleSendEmail}
      />

      {/* sidebar related modals */}

      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={() => {
          setIsEditing(!isEditing)
        }} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}

      {showBroadcastModal && (
        <BroadcastModal
          emailOnly={true}
          onClose={() => setShowBroadcastModal(false)}
          broadcastFolders={[]} // not used in email-only mode
          preConfiguredMessages={[]} // not used in email-only mode
          chatList={members} // use members as recipients source
          archivedChats={[]}
          settings={{ emailSignature: "Best regards,<br/>Team" }}
          setShowFolderModal={() => { }}
          onBroadcast={(payload) => {
            handleBroadcast(payload)
            setShowBroadcastModal(false)
          }}
          onCreateMessage={() => { }}
        />
      )}
    </div>
  )
}

export default EmailManagementPage
