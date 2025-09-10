/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"

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

  const handleClose = () => {
    // Reset all internal state before closing
    setSelectedEmail(null)
    setActiveDropdown(null)
    setShowReplyModal(false)
    setSelectedEmails([])
    setSelectAll(false)
    setReplyData({ to: "", subject: "", body: "" })

    // Call the parent close handler
    if (onClose) {
      onClose()
    }
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
    setActiveDropdown(null)
    setShowReplyModal(false)
  }

  const handleCloseReplyModal = () => {
    setShowReplyModal(false)
    setReplyData({ to: "", subject: "", body: "" })
    // Don't reset selectedEmail - stay in email view
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

      {showReplyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
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
    </>
  )
}

export default EmailManagement
