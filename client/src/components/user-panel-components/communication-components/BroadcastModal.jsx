/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, FolderPlus, Search, Send, Plus, Edit, Trash2 } from "lucide-react"
import { WysiwygEditor } from "../../shared/WysiwygEditor"
import DeleteConfirmationModal from "./broadcast-modal-components/DeleteConfirmationModal"
import MessageModal from "./broadcast-modal-components/MessageModal"
import FolderModal from "./broadcast-modal-components/FolderModal"

export default function BroadcastModal({
  onClose,
  broadcastFolders = [],
  preConfiguredMessages = [],
  chatList = [],
  archivedChats = [],
  settings = {},
  onBroadcast,
  onCreateMessage,
  onUpdateMessage,
  onDeleteMessage,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onUpdateEmailTemplate,
  onDeleteEmailTemplate,
}) {
  const [activeMainTab, setActiveMainTab] = useState("push") // 'push' | 'email'
  const [audienceTab, setAudienceTab] = useState("member") // 'member' | 'staff'

  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [searchMember, setSearchMember] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const recipientDropdownRef = useRef(null)

  const [selectedPushFolder, setSelectedPushFolder] = useState(
    broadcastFolders.length ? broadcastFolders[0] : null,
  )
  const [selectedPushMessage, setSelectedPushMessage] = useState(null)

  const [emailFolders, setEmailFolders] = useState([
    { id: 1001, name: "General", messages: [] },
    { id: 1002, name: "media-library", messages: [] },
    { id: 1003, name: "Announcements", messages: [] },
  ])
  const [selectedEmailFolder, setSelectedEmailFolder] = useState(null)

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 5001,
      folderId: 1001,
      subject: "Welcome to Our Community",
      body: "<p>Hello,</p><p>We're excited to have you with us. Here's everything you need to know to get started.</p><p>Warm regards,<br/>Team</p>",
    },
    {
      id: 5002,
      folderId: 1002,
      subject: "Special Offer Just for You",
      body: "<p>Hi,</p><p>Enjoy an exclusive offer available for a limited time.</p><p>Cheers,<br/>Sales Team</p>",
    },
  ])
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)

  const [includeSignatureOnSend, setIncludeSignatureOnSend] = useState(true)
  
  // State for modals
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState(null)
  
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [editingMessage, setEditingMessage] = useState(null)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState("") // 'pushFolder', 'emailFolder', 'pushMessage', 'emailTemplate'

  // Handle outside clicks for recipients dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target)) {
        setShowRecipientDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Helper: return combined list of chats
  const combinedChats = [...(chatList || []), ...(archivedChats || [])]

  // Helper: attempt to filter by audience if items have a role property
  const filteredChatsByAudience = combinedChats.filter((c) => {
    if (!c) return false
    if (!c.role) return true // if no role metadata, show all
    return audienceTab === "staff" ? c.role === "staff" : c.role !== "staff"
  })

  const visibleRecipientList = filteredChatsByAudience.filter(
    (chat) => searchMember === "" || chat?.name?.toLowerCase().includes(searchMember.toLowerCase()),
  )

  const handleMemberSelect = (chat) => {
    setSelectedRecipients((prev) => 
      prev.includes(chat) ? prev.filter((c) => c !== chat) : [...prev, chat]
    )
  }

  const handleSelectAll = (e) => {
    const checked = e.target.checked
    setSelectAll(checked)
    if (checked) {
      setSelectedRecipients(visibleRecipientList)
    } else {
      setSelectedRecipients([])
    }
  }

  // Push folder/message selection
  useEffect(() => {
    if (!selectedPushFolder && broadcastFolders.length) {
      setSelectedPushFolder(broadcastFolders[0])
    }
  }, [broadcastFolders, selectedPushFolder])

  // Email folder default
  useEffect(() => {
    if (!selectedEmailFolder && emailFolders.length) {
      setSelectedEmailFolder(emailFolders[0])
    }
  }, [emailFolders, selectedEmailFolder])

  // Folder management
  const handleOpenFolderModal = (folder = null) => {
    setEditingFolder(folder)
    setShowFolderModal(true)
  }

  const handleSaveFolder = (folderName) => {
    if (activeMainTab === "push") {
      if (editingFolder) {
        onUpdateFolder?.(editingFolder.id, folderName)
      } else {
        onCreateFolder?.(folderName)
      }
    } else {
      // Email folder
      if (editingFolder) {
        setEmailFolders(prev => 
          prev.map(folder => 
            folder.id === editingFolder.id 
              ? { ...folder, name: folderName }
              : folder
          )
        )
      } else {
        const newId = Math.max(0, ...emailFolders.map((f) => f.id)) + 1
        const newFolder = { id: newId, name: folderName, messages: [] }
        setEmailFolders((prev) => [...prev, newFolder])
        setSelectedEmailFolder(newFolder)
      }
    }
  }

  const handleDeleteFolder = (folder) => {
    setItemToDelete(folder)
    setDeleteType(activeMainTab === "push" ? "pushFolder" : "emailFolder")
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return

    switch (deleteType) {
      case "pushFolder":
        onDeleteFolder?.(itemToDelete.id)
        break
      
      case "emailFolder":
        setEmailFolders(prev => prev.filter(f => f.id !== itemToDelete.id))
        setEmailTemplates(prev => prev.filter(t => t.folderId !== itemToDelete.id))
        
        if (selectedEmailFolder?.id === itemToDelete.id && emailFolders.length > 1) {
          const newSelection = emailFolders.find(f => f.id !== itemToDelete.id)
          setSelectedEmailFolder(newSelection)
        }
        break
      
      case "pushMessage":
        onDeleteMessage?.(itemToDelete.id)
        if (selectedPushMessage?.id === itemToDelete.id) {
          setSelectedPushMessage(null)
        }
        break
      
      case "emailTemplate":
        setEmailTemplates(prev => prev.filter(t => t.id !== itemToDelete.id))
        if (selectedEmailTemplate?.id === itemToDelete.id) {
          setSelectedEmailTemplate(null)
        }
        break
    }
  }

  // Message management - UPDATED: This now handles both push and email templates
  const handleOpenMessageModal = (message = null) => {
    setEditingMessage(message)
    setShowMessageModal(true)
  }

  const handleSaveMessage = (messageData) => {
    if (activeMainTab === "push") {
      // Save push message
      if (editingMessage) {
        onUpdateMessage?.(messageData)
      } else {
        onCreateMessage?.(messageData)
      }
    } else {
      // Save email template
      if (editingMessage) {
        // Update existing email template
        setEmailTemplates(prev =>
          prev.map(template =>
            template.id === editingMessage.id
              ? messageData
              : template
          )
        )
        
        if (selectedEmailTemplate?.id === editingMessage.id) {
          setSelectedEmailTemplate(messageData)
        }
        
        onUpdateEmailTemplate?.(messageData)
      } else {
        // Create new email template
        const newId = Math.max(0, ...emailTemplates.map((t) => t.id)) + 1
        const newTemplate = { 
          ...messageData, 
          id: newId,
          // Ensure email templates have the right structure
          subject: messageData.title || "Untitled Email",
          body: messageData.message || "",
          folderId: messageData.folderId || selectedEmailFolder?.id || emailFolders[0]?.id
        }
        
        setEmailTemplates([newTemplate, ...emailTemplates])
        setSelectedEmailTemplate(newTemplate)
      }
    }
  }

  const handleDeleteMessage = (message) => {
    setItemToDelete(message)
    setDeleteType(activeMainTab === "push" ? "pushMessage" : "emailTemplate")
    setShowDeleteModal(true)
  }

  const handleBroadcastClick = () => {
    const recipients = selectedRecipients
    if (!recipients.length) {
      alert("Please select at least one recipient")
      return
    }

    // Construct settings to reflect chosen channel for the downstream onBroadcast
    const sendSettings = {
      ...settings,
      broadcastEmail: activeMainTab === "email",
      broadcastChat: activeMainTab === "push",
    }

    if (activeMainTab === "push") {
      if (!selectedPushMessage) {
        alert("Please select a push message template")
        return
      }
      onBroadcast({ message: selectedPushMessage, recipients, settings: sendSettings })
      onClose()
      return
    }

    // Email branch
    if (!selectedEmailTemplate) {
      alert("Please select an email template.")
      return
    }

    const emailSubject = selectedEmailTemplate.subject || ""
    const emailBody = selectedEmailTemplate.body || ""

    if (!emailSubject || !emailBody) {
      alert("Please provide both Subject and Body.")
      return
    }

    // Append signature if checked
    let finalEmailBody = emailBody
    if (includeSignatureOnSend && settings?.emailSignature) {
      finalEmailBody = `${emailBody}<p><br/>${settings.emailSignature}</p>`
    }

    const emailMessageObj = {
      id: Date.now(),
      title: emailSubject,
      message: finalEmailBody,
      folderId: selectedEmailFolder?.id,
      channel: "email",
    }

    onBroadcast({ message: emailMessageObj, recipients, settings: sendSettings })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 overflow-y-auto">
        <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Broadcast</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-1 mb-6 border-b border-gray-700">
              <button
                onClick={() => setActiveMainTab("push")}
                className={`px-4 py-2 text-sm rounded-t-lg ${
                  activeMainTab === "push" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Push Notifications
              </button>
              <button
                onClick={() => setActiveMainTab("email")}
                className={`px-4 py-2 text-sm rounded-t-lg ${
                  activeMainTab === "email" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Email Notification
              </button>
            </div>

            <div className="flex bg-[#0E0E0E] border border-gray-800 rounded-xl p-1 mb-4">
              <button
                className={`flex-1 py-2 text-sm rounded-lg ${
                  audienceTab === "member" ? "bg-[#2B2B2B] text-white" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setAudienceTab("member")}
              >
                Member
              </button>
              <button
                className={`flex-1 py-2 text-sm rounded-lg ${
                  audienceTab === "staff" ? "bg-[#2B2B2B] text-white" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setAudienceTab("staff")}
              >
                Staff
              </button>
            </div>

            {/* Recipient selector */}
            <div className="mb-4">
              <div className="relative">
                {/* Create Template Button - SAME for both tabs */}
                <div className="mb-2">
                  <button
                    onClick={() => handleOpenMessageModal()}
                    className="w-full py-2 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    {activeMainTab === "push" ? "Create New Push Template" : "Create Email Template"}
                  </button>
                </div>
                
                {/* Recipients dropdown */}
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
                          placeholder={`Search ${audienceTab === "staff" ? "staff" : "members"}...`}
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

                    {visibleRecipientList.map((chat, index) => (
                      <div
                        key={`${chat?.id || "idx"}-${index}`}
                        className="flex items-center justify-between p-2 hover:bg-[#2F2F2F] cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={chat?.logo || "/placeholder.svg"}
                            alt={chat?.name || "recipient"}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-sm text-gray-300">{chat?.name || "Unknown"}</span>
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

              {/* Selected recipients list */}
              <div className="space-y-2 mt-2">
                {selectedRecipients.map((recipient, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#222222] rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={recipient?.logo || "/placeholder.svg"}
                        alt={recipient?.name || "recipient"}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="text-sm text-gray-300">{recipient?.name || "Unknown"}</span>
                    </div>
                    <button
                      className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                      onClick={() => handleMemberSelect(recipient)}
                      aria-label="Remove recipient"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Tab Content */}
            {activeMainTab === "push" && (
              <div className="space-y-4">
                {/* Folder selection (Push) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-400">Push Broadcast</label>
                    <button
                      onClick={() => handleOpenFolderModal()}
                      className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                    >
                      <FolderPlus className="w-4 h-4" />
                      New Folder
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedPushFolder?.id || ""}
                      onChange={(e) =>
                        setSelectedPushFolder(
                          broadcastFolders.find((f) => f.id === Number.parseInt(e.target.value, 10)) || null,
                        )
                      }
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-20"
                    >
                      <option value="">Select folder...</option>
                      {broadcastFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name} ({folder.messages?.length || 0} messages)
                        </option>
                      ))}
                    </select>
                    {selectedPushFolder && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() => handleOpenFolderModal(selectedPushFolder)}
                          className="p-1 text-blue-500 hover:text-blue-400"
                          aria-label="Edit folder"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(selectedPushFolder)}
                          className="p-1 text-red-500 hover:text-red-400"
                          aria-label="Delete folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pre-configured push messages */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-400">Select Pre-configured Message</label>
                    <div className="flex items-center gap-1">
                      {selectedPushMessage && (
                        <>
                          <button
                            onClick={() => handleDeleteMessage(selectedPushMessage)}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenMessageModal(selectedPushMessage)}
                            className="text-blue-500 hover:text-blue-400 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#222222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {preConfiguredMessages
                      ?.filter((msg) => !selectedPushFolder || msg.folderId === selectedPushFolder.id)
                      .map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedPushMessage(msg)}
                          className={`p-3 cursor-pointer hover:bg-[#2F2F2F] group relative ${
                            selectedPushMessage?.id === msg.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                          }`}
                        >
                          <p className="font-medium text-sm">{msg.title}</p>
                          <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                          <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenMessageModal(msg)
                              }}
                              className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteMessage(msg)
                              }}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowRecipientDropdown(!showRecipientDropdown)
                    if (!showRecipientDropdown) setSearchMember("")
                  }}
                  className="w-full py-3 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl"
                >
                  Select Recipients
                </button>
              </div>
            )}

            {/* Email Tab Content */}
            {activeMainTab === "email" && (
              <div className="space-y-4">
                {/* Email folders */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-400">Email Broadcast Folder</label>
                    <button
                      onClick={() => handleOpenFolderModal()}
                      className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                    >
                      <FolderPlus className="w-4 h-4" />
                      New Folder
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedEmailFolder?.id || emailFolders[0]?.id || ""}
                      onChange={(e) => {
                        const id = Number.parseInt(e.target.value, 10)
                        const folder = emailFolders.find((f) => f.id === id)
                        setSelectedEmailFolder(folder || null)
                      }}
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-20"
                    >
                      <option value="">Select folder...</option>
                      {emailFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    {selectedEmailFolder && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() => handleOpenFolderModal(selectedEmailFolder)}
                          className="p-1 text-blue-500 hover:text-blue-400"
                          aria-label="Edit folder"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(selectedEmailFolder)}
                          className="p-1 text-red-500 hover:text-red-400"
                          aria-label="Delete folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email templates list */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-400">Select Pre-configured Email</label>
                    <div className="flex items-center gap-1">
                      {selectedEmailTemplate && (
                        <>
                          <button
                            onClick={() => handleDeleteMessage(selectedEmailTemplate)}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenMessageModal(selectedEmailTemplate)}
                            className="text-blue-500 hover:text-blue-400 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#222222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {emailTemplates
                      .filter((t) => !selectedEmailFolder || t.folderId === selectedEmailFolder.id)
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedEmailTemplate(t)
                          }}
                          className={`p-3 cursor-pointer hover:bg-[#2F2F2F] group relative ${
                            selectedEmailTemplate?.id === t.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                          }`}
                        >
                          <p className="font-medium text-sm">{t.subject}</p>
                          <div className="text-xs text-gray-400 truncate" dangerouslySetInnerHTML={{ __html: t.body }} />
                          <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenMessageModal({
                                  ...t,
                                  title: t.subject, // Map subject to title for MessageModal
                                  message: t.body,
                                  folderId: t.folderId
                                })
                              }}
                              className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteMessage(t)
                              }}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Include Signature Checkbox - Only for Email Tab */}
                <div className="flex items-center gap-2">
                  <input
                    id="includeSignature"
                    type="checkbox"
                    checked={includeSignatureOnSend}
                    onChange={(e) => setIncludeSignatureOnSend(e.target.checked)}
                    className="rounded border-gray-600 bg-transparent"
                  />
                  <label htmlFor="includeSignature" className="text-sm text-gray-300">
                    Append signature on send
                  </label>
                </div>

                <button
                  onClick={() => {
                    setShowRecipientDropdown(!showRecipientDropdown)
                    if (!showRecipientDropdown) setSearchMember("")
                  }}
                  className="w-full py-3 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl"
                >
                  Select Recipients
                </button>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-5">
              <button
                onClick={handleBroadcastClick}
                className={`w-full py-3 flex items-center gap-2 justify-center ${
                  selectedRecipients.length > 0 &&
                  (
                    (activeMainTab === "push" && selectedPushMessage) ||
                    (activeMainTab === "email" && selectedEmailTemplate)
                  )
                    ? "bg-[#FF843E] hover:bg-orange-600"
                    : "bg-gray-600"
                } text-white text-sm rounded-xl`}
                disabled={
                  !selectedRecipients.length ||
                  !(
                    (activeMainTab === "push" && selectedPushMessage) ||
                    (activeMainTab === "email" && selectedEmailTemplate)
                  )
                }
              >
                <Send size={16} />
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <FolderModal
        isOpen={showFolderModal}
        onClose={() => {
          setShowFolderModal(false)
          setEditingFolder(null)
        }}
        folder={editingFolder}
        onSave={handleSaveFolder}
        title={editingFolder ? `Edit "${editingFolder.name}"` : "Create New Folder"}
      />

      {/* SAME MODAL for both Push and Email Templates */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false)
          setEditingMessage(null)
        }}
        message={editingMessage}
        onSave={handleSaveMessage}
        folders={activeMainTab === "push" ? broadcastFolders : emailFolders}
        title={editingMessage ? 
          (activeMainTab === "push" ? "Edit Push Template" : "Edit Email Template") : 
          (activeMainTab === "push" ? "Create New Push Template" : "Create Email Template")
        }
        isEmailTemplate={activeMainTab === "email"}
        includeSignature={includeSignatureOnSend}
        onIncludeSignatureChange={setIncludeSignatureOnSend}
        emailSignature={settings?.emailSignature}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setItemToDelete(null)
          setDeleteType("")
        }}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || itemToDelete?.title || itemToDelete?.subject || ""}
        itemType={
          deleteType === "pushFolder" || deleteType === "emailFolder" ? "folder" :
          deleteType === "pushMessage" ? "message" : "template"
        }
      />
    </>
  )
}