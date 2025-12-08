/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import {
  Mail,
  Send,
  Settings,
  X,
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
  Paperclip,
  File,
  User,
  Building,
  Type,
  AtSign,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"
import { WysiwygEditor } from "../configuration-components/WysiwygEditor"

const EmailManagement = ({
  isOpen,
  onClose,
  onOpenSendEmail,
  onOpenSettings,
  onOpenBroadcast,
  onRefresh,
  initialEmailList = {
    inbox: [],
    sent: [],
    draft: [],
    outbox: [],
    archive: [],
    error: [],
    trash: [],
  },
}) => {
  const [emailTab, setEmailTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyData, setReplyData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  })
  const [replyAttachments, setReplyAttachments] = useState([])
  const [showOriginalMessage, setShowOriginalMessage] = useState(true)
  const [showInsertDropdown, setShowInsertDropdown] = useState(false)
  
  const insertDropdownRef = useRef(null)
  const fileInputRef = useRef(null)

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
    if (initialEmailList) {
      Object.keys(defaultList).forEach((key) => {
        if (initialEmailList[key] && Array.isArray(initialEmailList[key])) {
          mergedList[key] = initialEmailList[key]
        }
      })
    }

    return mergedList
  })

  const [selectedEmails, setSelectedEmails] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Studio details
  const studioName = "Your Studio Name";
  const signature = `<p>Best regards,<br/>
<strong>[Your Name]</strong><br/>
[Your Position]<br/>
${studioName}<br/>
[Contact Info]</p>`;

  useEffect(() => {
    if (initialEmailList) {
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
      Object.keys(defaultList).forEach((key) => {
        if (initialEmailList[key] && Array.isArray(initialEmailList[key])) {
          mergedList[key] = initialEmailList[key]
        }
      })

      setEmailList(mergedList)
    }
  }, [initialEmailList])

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (insertDropdownRef.current && !insertDropdownRef.current.contains(event.target)) {
        setShowInsertDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setReplyAttachments([])
    setShowOriginalMessage(true)
    setShowReplyModal(true)
  }

  const sendReply = () => {
    const newReply = {
      id: Date.now().toString(),
      sender: "You",
      recipient: replyData.to,
      cc: replyData.cc,
      bcc: replyData.bcc,
      subject: replyData.subject,
      body: replyData.body + (showOriginalMessage ? `<div class="original-message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px;">
        <strong>--- Original Message ---</strong><br/>
        <strong>From:</strong> ${selectedEmail.sender}<br/>
        <strong>Date:</strong> ${new Date(selectedEmail.time).toLocaleString()}<br/>
        <strong>Subject:</strong> ${selectedEmail.subject}<br/><br/>
        ${selectedEmail.body}
      </div>` : ''),
      time: new Date().toISOString(),
      status: "Sent",
      isRead: true,
      isPinned: false,
      isArchived: false,
      attachments: replyAttachments.map(att => ({
        name: att.name,
        size: att.size,
        url: URL.createObjectURL(att.file)
      }))
    }

    setEmailList((prev) => ({
      ...prev,
      sent: [newReply, ...prev.sent],
    }))

    setShowReplyModal(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setReplyAttachments([])
  }

  // Attachment handling for reply
  const handleAddAttachment = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));
    setReplyAttachments([...replyAttachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id) => {
    setReplyAttachments(replyAttachments.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Insert functions for reply
  const handleInsertSignature = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? '<br><br>' : '') + signature
    });
    setShowInsertDropdown(false);
  };

  const handleInsertFirstName = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + '<strong>[Member First Name]</strong>'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertLastName = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + '<strong>[Member Last Name]</strong>'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertStudioName = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + `<strong>[${studioName}]</strong>`
    });
    setShowInsertDropdown(false);
  };

  const handleInsertEmail = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + '[Member Email]'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertDate = () => {
    const today = new Date().toLocaleDateString();
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + today
    });
    setShowInsertDropdown(false);
  };

  const handleInsertMemberId = () => {
    setReplyData({
      ...replyData,
      body: replyData.body + (replyData.body ? ' ' : '') + '[Member ID]'
    });
    setShowInsertDropdown(false);
  };

  // Handle reply body changes with WysiwygEditor
  const handleBodyChange = (content) => {
    setReplyData(prev => ({ ...prev, body: content }));
  };

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

  const handleClose = () => {
    setSelectedEmail(null)
    setActiveDropdown(null)
    setShowReplyModal(false)
    setSelectedEmails([])
    setSelectAll(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setReplyAttachments([])

    if (onClose) {
      onClose()
    }
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
    setActiveDropdown(null)
    setShowReplyModal(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setReplyAttachments([])
  }

  const handleCloseReplyModal = () => {
    setShowReplyModal(false)
    setReplyData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setReplyAttachments([])
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
        <div className="bg-[#181818] flex-1 flex flex-col rounded-xl m-2 md:m-4 relative">
          <div className="p-3 md:p-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Email Management</span>
                <span className="sm:hidden">Email</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSendEmail}
                  className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send Email</span>
                  <span className="sm:hidden">Send</span>
                </button>
                <button onClick={onOpenSettings} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={handleClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-1 md:gap-2 mb-4 border-b border-gray-700 overflow-x-auto">
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

          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {selectedEmail ? (
              <div className="bg-[#222222] rounded-xl p-4 md:p-6">
                {/* Action Buttons Top Right */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-medium mb-2">{selectedEmail.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateEmailStatus(selectedEmail.id, { 
                        isRead: !selectedEmail.isRead,
                        status: selectedEmail.isRead ? "Delivered" : "Read"
                      })}
                      className="p-2 hover:bg-zinc-700 rounded-lg"
                      title={selectedEmail.isRead ? "Mark as Unread" : "Mark as Read"}
                    >
                      {selectedEmail.isRead ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived })}
                      className="p-2 hover:bg-zinc-700 rounded-lg"
                      title={selectedEmail.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => moveEmailToTrash(selectedEmail.id)}
                      className="p-2 hover:bg-red-700 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button onClick={handleBackToList} className="p-2 hover:bg-zinc-700 rounded-lg">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Email Content */}
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="text-sm text-gray-400">
                      <p>From: {selectedEmail.sender || "You"}</p>
                      {selectedEmail.recipient && <p>To: {selectedEmail.recipient}</p>}
                      {selectedEmail.cc && <p>CC: {selectedEmail.cc}</p>}
                      {selectedEmail.bcc && <p>BCC: {selectedEmail.bcc}</p>}
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
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">Attachments:</span>
                    </div>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-900/50 px-3 py-2 rounded">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-gray-500">
                              ({formatFileSize(attachment.size)})
                            </span>
                          </div>
                          <button
                            onClick={() => window.open(attachment.url, '_blank')}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Body */}
                <div className="prose prose-invert text-white text-sm leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
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

          {onOpenBroadcast && (
            <button
              onClick={onOpenBroadcast}
              className="absolute bottom-4 md:bottom-6 right-4 md:right-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg z-10"
              title="Create Broadcast"
            >
              <IoIosMegaphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {activeDropdown && <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />}

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
                    className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
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
                    <div className="relative" ref={insertDropdownRef}>
                      <button
                        onClick={() => setShowInsertDropdown(!showInsertDropdown)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <Type className="w-4 h-4" />
                        Insert
                      </button>
                      {showInsertDropdown && (
                        <div className="absolute right-0 mt-2 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 w-48 overflow-hidden">
                          <button
                            onClick={handleInsertSignature}
                            className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                          >
                            <Type className="w-4 h-4" />
                            Signature
                          </button>
                          <div className="border-t border-gray-700">
                            <button
                              onClick={handleInsertFirstName}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              First Name
                            </button>
                            <button
                              onClick={handleInsertLastName}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              Last Name
                            </button>
                            <button
                              onClick={handleInsertMemberId}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <Hash className="w-4 h-4" />
                              Member ID
                            </button>
                          </div>
                          <div className="border-t border-gray-700">
                            <button
                              onClick={handleInsertEmail}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <AtSign className="w-4 h-4" />
                              Email
                            </button>
                            <button
                              onClick={handleInsertDate}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Today's Date
                            </button>
                            <button
                              onClick={handleInsertStudioName}
                              className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                            >
                              <Building className="w-4 h-4" />
                              Studio Name
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-xl overflow-hidden mb-4">
                    <WysiwygEditor
                      value={replyData.body}
                      onChange={handleBodyChange}
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
                      onClick={handleAddAttachment}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      Add Attachment
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                    />
                  </div>
                  
                  {replyAttachments.length > 0 && (
                    <div className="bg-[#222222] border border-gray-700 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {replyAttachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between bg-gray-800/50 px-3 py-2.5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-700 rounded-lg">
                                <Paperclip className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {attachment.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatFileSize(attachment.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                          <span>{selectedEmail.recipient}</span>
                        </div>
                        <div className="flex">
                          <span className="w-16 flex-shrink-0 font-medium">Subject:</span>
                          <span className="font-medium">{selectedEmail.subject}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="prose prose-invert text-sm" dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
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
                disabled={!replyData.to || !replyData.subject || !replyData.body}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EmailManagement