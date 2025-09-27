/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import {
  Mail,
  Send,
  Settings,
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
import { IoIosMenu } from "react-icons/io"
import toast from "react-hot-toast"

import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import Sidebar from "../../components/admin-dashboard-components/central-sidebar"

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
      sender: "marketing@example.com",
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
    body: "Hi {{name}},\n\nI would like to schedule a meeting to discuss {{topic}}. Please let me know your availability.\n\nBest regards,\n{{sender_name}}"
  },
  {
    id: 2,
    name: "Follow Up",
    subject: "Following up on {{topic}}",
    body: "Hi {{name}},\n\nI wanted to follow up on our previous conversation about {{topic}}. Do you have any updates?\n\nThanks,\n{{sender_name}}"
  },
  {
    id: 3,
    name: "Thank You",
    subject: "Thank you for {{reason}}",
    body: "Hi {{name}},\n\nThank you for {{reason}}. It was a pleasure working with you.\n\nBest regards,\n{{sender_name}}"
  }
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
  const [replyData, setReplyData] = useState({
    to: "",
    subject: "",
    body: "",
  })

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
      subject: email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.sender}\nDate: ${new Date(email.time).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`,
    })
    setShowReplyModal(true)
  }

  const sendReply = () => {
    const newReply = {
      id: Date.now().toString(),
      sender: "You",
      recipient: replyData.to,
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
    setReplyData({ to: "", subject: "", body: "" })
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
    setReplyData({ to: "", subject: "", body: "" })
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
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEmailData({ to: "", subject: "", body: "" })
    setSelectedEmailTemplate(null)
  }

  const onRefresh = () => {
    // Simulate refresh - in real app this would fetch from server
    console.log("Refreshing emails...")
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
    <div className={`
        min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
        transition-all duration-500 ease-in-out flex-1
       ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0'
          : 'mr-0'
        }
      `}>
      <div className="">
        <div className="">
          <div className=" border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                Email 
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSendEmailModal(true)}
                  className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send Email</span>
                  <span className="sm:hidden">Send</span>
                </button>
                   <div onClick={toggleRightSidebar} className="cursor-pointer  text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
                              <IoIosMenu size={26} />
                            </div>
                
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 md:gap-2 border-b border-gray-700 overflow-x-auto">
              <button
                onClick={() => handleEmailTabClick("inbox")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "inbox" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
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
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "sent" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Send size={16} />
                <span className="hidden sm:inline">Sent</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("draft")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "draft" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Draft</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("archive")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "archive" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Archive size={16} />
                <span className="hidden sm:inline">Archive</span>
              </button>
              <button
                onClick={() => handleEmailTabClick("trash")}
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "trash" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
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
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg flex items-center gap-2 whitespace-nowrap ${
                  emailTab === "error" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
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
                        className={`relative flex items-center justify-between p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer ${
                          !email.isRead ? "border-l-4 border-blue-500" : ""
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
                            className={`text-xs px-2 py-1 rounded hidden sm:inline ${
                              email.status === "Read"
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
      </div>

      {/* Backdrop for dropdown */}
      {activeDropdown && <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Reply to Email</h3>
              <button onClick={handleCloseReplyModal} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm text-gray-200 mb-1">To</label>
                <input
                  type="email"
                  value={replyData.to}
                  onChange={(e) => setReplyData((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-full bg-[#181818] text-white border border-gray-600/60 rounded-lg outline-none p-2 text-sm"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Subject</label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-[#181818] text-white border border-gray-600/60 rounded-lg outline-none p-2 text-sm"
                  placeholder="Email Subject"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea
                  value={replyData.body}
                  onChange={(e) => setReplyData((prev) => ({ ...prev, body: e.target.value }))}
                  className="w-full bg-[#181818] text-white border border-gray-600/60 rounded-lg p-2 text-sm outline-none h-64"
                  placeholder="Type your reply here..."
                />
              </div>
            </div>

            <div className="p-4 flex justify-end gap-2">
              <button
                onClick={handleCloseReplyModal}
                className="px-4 py-2 bg-gray-600 cursor-pointer text-sm hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-sm text-white rounded-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showSendEmailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Email
                </h2>
                <button onClick={() => setShowSendEmailModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Template</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between"
                    >
                      <span>{selectedEmailTemplate ? selectedEmailTemplate.name : "Select a template (optional)"}</span>
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                    {showTemplateDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => {
                            setEmailData({ ...emailData, subject: "", body: "" });
                            handleTemplateSelect(null);
                            setShowTemplateDropdown(false);
                          }}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-400 border-b border-gray-700"
                        >
                          No template (blank email)
                        </button>
                        {emailTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className="w-full text-left p-3 hover:bg-[#2F2F2F]"
                          >
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-gray-400 truncate">{template.subject}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* To Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailData.to}
                      onChange={(e) => {
                        setEmailData({ ...emailData, to: e.target.value });
                        setShowRecipientDropdown(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowRecipientDropdown(emailData.to.length > 0)}
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-10"
                      placeholder="Search members or type email"
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    {showRecipientDropdown && emailData.to.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                        {handleSearchMemberForEmail(emailData.to).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleSelectEmailRecipient(member)}
                            className="w-full text-left p-2 hover:bg-[#2F2F2F] flex items-center gap-2"
                          >
                            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                              {member.name.charAt(0)}
                            </div>
                            <span className="text-sm">
                              {member.name} ({member.email})
                            </span>
                          </button>
                        ))}
                        {handleSearchMemberForEmail(emailData.to).length === 0 && (
                          <p className="p-2 text-sm text-gray-400">No members found. Type full email to send.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
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

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <div className="bg-[#222222] rounded-xl">
                    {/* Email Toolbar */}
                    <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                      <button className="p-1 hover:bg-gray-600 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm underline">U</button>
                      <div className="w-px h-4 bg-gray-600 mx-1" />
                      <button className="p-1 hover:bg-gray-600 rounded text-sm" title="Attach file">📎</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm" title="Insert link">🔗</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm" title="Insert table">📊</button>
                    </div>
                    <textarea
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full bg-transparent text-white px-4 py-2 text-sm h-48 resize-none focus:outline-none"
                      placeholder="Type your email message here..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowSendEmailModal(false)}
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
    </div>
  )
}

export default EmailManagementPage