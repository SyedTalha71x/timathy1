/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, FolderPlus, Search } from "lucide-react"

export default function BroadcastModal({
  onClose,
  broadcastFolders,
  preConfiguredMessages,
  chatList,
  archivedChats,
  settings,
  setShowFolderModal,
  onBroadcast,
  onCreateMessage,
}) {
  const [activeMainTab, setActiveMainTab] = useState("push") // 'push' | 'email'
  const [audienceTab, setAudienceTab] = useState("member") // 'member' | 'staff'

  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [searchMember, setSearchMember] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const recipientDropdownRef = useRef(null)

  const [selectedPushFolder, setSelectedPushFolder] = useState(
    broadcastFolders && broadcastFolders.length ? broadcastFolders[0] : null,
  )
  const [selectedPushMessage, setSelectedPushMessage] = useState(null)

  const [emailFolders, setEmailFolders] = useState([
    { id: 1001, name: "General", messages: [] },
    { id: 1002, name: "Marketing", messages: [] },
    { id: 1003, name: "Announcements", messages: [] },
  ])
  const [selectedEmailFolder, setSelectedEmailFolder] = useState(null)

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 5001,
      folderId: 1001,
      subject: "Welcome to Our Community",
      body: "<p>Hello,</p><p>We’re excited to have you with us. Here’s everything you need to know to get started.</p><p>Warm regards,<br/>Team</p>",
    },
    {
      id: 5002,
      folderId: 1002,
      subject: "Special Offer Just for You",
      body: "<p>Hi,</p><p>Enjoy an exclusive offer available for a limited time.</p><p>Cheers,<br/>Sales Team</p>",
    },
  ])
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)

  const [showEmailBuilder, setShowEmailBuilder] = useState(false)
  const [builderSubject, setBuilderSubject] = useState("")
  const [builderFolderId, setBuilderFolderId] = useState(1001)
  const [builderHtml, setBuilderHtml] = useState("")
  const [includeSignatureOnSend, setIncludeSignatureOnSend] = useState(true)
  const builderRef = useRef(null)

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
    setSelectedRecipients((prev) => (prev.includes(chat) ? prev.filter((c) => c !== chat) : [...prev, chat]))
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
    if (!selectedPushFolder && broadcastFolders && broadcastFolders.length) {
      setSelectedPushFolder(broadcastFolders[0])
    }
  }, [broadcastFolders, selectedPushFolder])

  // Email folder default
  useEffect(() => {
    if (!selectedEmailFolder && emailFolders && emailFolders.length) {
      setSelectedEmailFolder(emailFolders[0])
      setBuilderFolderId(emailFolders[0].id)
    }
  }, [emailFolders, selectedEmailFolder])

  // Rich text formatting using execCommand (simple, widely supported)
  const execFormat = (cmd, val = null) => {
    if (!builderRef.current) return
    builderRef.current.focus()
    document.execCommand(cmd, false, val)
    // sync HTML back
    setBuilderHtml(builderRef.current.innerHTML)
  }

  const handleInsertLink = () => {
    const url = prompt("Enter URL")
    if (url) execFormat("createLink", url)
  }

  const handleInsertSignature = () => {
    const sig = settings?.emailSignature || ""
    if (!builderRef.current) return
    builderRef.current.focus()
    const signatureHtml = `<p><br/>${sig}</p>`
    // Insert as HTML at caret
    document.execCommand("insertHTML", false, signatureHtml)
    setBuilderHtml(builderRef.current.innerHTML)
  }

  const handleSaveEmailTemplate = () => {
    if (!builderSubject.trim() || !builderHtml.trim()) {
      alert("Please provide both Subject and Body for the email template.")
      return
    }
    const newId = Math.max(0, ...emailTemplates.map((t) => t.id)) + 1
    const saved = {
      id: newId,
      folderId: builderFolderId,
      subject: builderSubject.trim(),
      body: builderHtml,
    }
    setEmailTemplates([saved, ...emailTemplates])
    setSelectedEmailTemplate(saved)
    // Reset builder
    setShowEmailBuilder(false)
    setBuilderSubject("")
    setBuilderHtml("")
  }

  const handleCreateEmailFolder = () => {
    const name = prompt("Folder name")
    if (!name || !name.trim()) return
    const newId = Math.max(0, ...emailFolders.map((f) => f.id)) + 1
    const newFolder = { id: newId, name: name.trim(), messages: [] }
    setEmailFolders((prev) => [...prev, newFolder])
    setSelectedEmailFolder(newFolder)
    setBuilderFolderId(newFolder.id)
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
    let emailSubject = ""
    let emailBody = ""
    if (selectedEmailTemplate) {
      emailSubject = selectedEmailTemplate.subject || ""
      emailBody = selectedEmailTemplate.body || ""
    } else {
      // Use builder content if no template selected
      emailSubject = builderSubject
      emailBody = builderHtml
    }

    if (!emailSubject || !emailBody) {
      alert("Please select or create an email template with Subject and Body.")
      return
    }

    // Append signature if checked
    if (includeSignatureOnSend && settings?.emailSignature) {
      emailBody = `${emailBody}<p><br/>${settings.emailSignature}</p>`
    }

    const emailMessageObj = {
      id: Date.now(),
      title: emailSubject,
      message: emailBody, // using "message" key to align with onBroadcast consumer
      folderId: selectedEmailFolder?.id,
      channel: "email",
    }

    onBroadcast({ message: emailMessageObj, recipients, settings: sendSettings })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">New Broadcast</h2>
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
           
              <div className="mb-2">
                <button
                  onClick={() => onCreateMessage && onCreateMessage()}
                  className="w-full py-2 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  Create New Push Template
                </button>
              </div>
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
                  <label className="block text-sm font-medium text-gray-400">Push Message Folder</label>
                  <button
                    onClick={() => setShowFolderModal && setShowFolderModal(true)}
                    className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                  >
                    <FolderPlus className="w-4 h-4" />
                    New Folder
                  </button>
                </div>
                <select
                  value={selectedPushFolder?.id || (broadcastFolders?.length ? broadcastFolders[0]?.id : "")}
                  onChange={(e) =>
                    setSelectedPushFolder(
                      broadcastFolders?.find((f) => f.id === Number.parseInt(e.target.value, 10)) || null,
                    )
                  }
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="">Select folder...</option>
                  {broadcastFolders?.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name} ({folder.messages?.length || 0} messages)
                    </option>
                  ))}
                </select>
              </div>

              {/* Pre-configured push messages */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Pre-configured Message</label>
                <div className="bg-[#222222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {preConfiguredMessages
                    ?.filter((msg) => !selectedPushFolder || msg.folderId === selectedPushFolder.id)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedPushMessage(msg)}
                        className={`p-3 cursor-pointer hover:bg-[#2F2F2F] ${
                          selectedPushMessage?.id === msg.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <p className="font-medium text-sm">{msg.title}</p>
                        <p className="text-xs text-gray-400 truncate">{msg.message}</p>
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
                    onClick={handleCreateEmailFolder}
                    className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                  >
                    <FolderPlus className="w-4 h-4" />
                    New Folder
                  </button>
                </div>
                <select
                  value={selectedEmailFolder?.id || emailFolders[0]?.id || ""}
                  onChange={(e) => {
                    const id = Number.parseInt(e.target.value, 10)
                    const folder = emailFolders.find((f) => f.id === id)
                    setSelectedEmailFolder(folder || null)
                  }}
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="">Select folder...</option>
                  {emailFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email templates list */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Pre-configured Email</label>
                <div className="bg-[#222222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {emailTemplates
                    .filter((t) => !selectedEmailFolder || t.folderId === selectedEmailFolder.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedEmailTemplate(t)
                          setShowEmailBuilder(false)
                        }}
                        className={`p-3 cursor-pointer hover:bg-[#2F2F2F] ${
                          selectedEmailTemplate?.id === t.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <p className="font-medium text-sm">{t.subject}</p>
                        <p className="text-xs text-gray-400 truncate" dangerouslySetInnerHTML={{ __html: t.body }} />
                      </div>
                    ))}
                </div>
              </div>

              {/* Create/Edit email template */}
              {!showEmailBuilder && (
                <button
                  onClick={() => {
                    setSelectedEmailTemplate(null)
                    setShowEmailBuilder(true)
                    setBuilderSubject("")
                    setBuilderHtml("")
                    if (selectedEmailFolder) setBuilderFolderId(selectedEmailFolder.id)
                  }}
                  className="w-full py-2 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl"
                >
                  Create Email Template
                </button>
              )}

              {showEmailBuilder && (
                <div className="border border-gray-800 rounded-xl p-3 space-y-3 bg-[#111111]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Subject</label>
                      <input
                        value={builderSubject}
                        onChange={(e) => setBuilderSubject(e.target.value)}
                        placeholder="Email subject"
                        className="w-full bg-[#222222] text-white rounded-xl px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Folder</label>
                      <select
                        value={builderFolderId}
                        onChange={(e) => setBuilderFolderId(Number.parseInt(e.target.value, 10))}
                        className="w-full bg-[#222222] text-white rounded-xl px-3 py-2 text-sm"
                      >
                        {emailFolders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Formatting toolbar */}
                  <div className="flex flex-wrap gap-2 bg-[#0E0E0E] border border-gray-800 rounded-lg p-2">
                    <button className="px-2 py-1 text-sm bg-[#222222] rounded" onClick={() => execFormat("bold")}>
                      Bold
                    </button>
                    <button className="px-2 py-1 text-sm bg-[#222222] rounded" onClick={() => execFormat("italic")}>
                      Italic
                    </button>
                    <button className="px-2 py-1 text-sm bg-[#222222] rounded" onClick={() => execFormat("underline")}>
                      Underline
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("insertUnorderedList")}
                    >
                      Bullets
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("insertOrderedList")}
                    >
                      Numbered
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("justifyLeft")}
                    >
                      Left
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("justifyCenter")}
                    >
                      Center
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("justifyRight")}
                    >
                      Right
                    </button>
                    <button className="px-2 py-1 text-sm bg-[#222222] rounded" onClick={handleInsertLink}>
                      Link
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#222222] rounded"
                      onClick={() => execFormat("formatBlock", "blockquote")}
                    >
                      Quote
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-[#3F74FF] text-white rounded"
                      onClick={handleInsertSignature}
                    >
                      Insert Signature
                    </button>
                  </div>

                  {/* Editor */}
                  <div
                    ref={builderRef}
                    contentEditable
                    className="min-h-[160px] bg-[#222222] text-white rounded-xl p-3 text-sm outline-none"
                    onInput={() => setBuilderHtml(builderRef.current.innerHTML)}
                    suppressContentEditableWarning
                  >
                    {/* Empty initial content */}
                  </div>

                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600"
                        onClick={() => {
                          setShowEmailBuilder(false)
                          setBuilderSubject("")
                          setBuilderHtml("")
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                        onClick={handleSaveEmailTemplate}
                      >
                        Save Template
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-5">
            <button
              onClick={handleBroadcastClick}
              className={`w-full py-3 ${
                selectedRecipients.length > 0 &&
                (
                  (activeMainTab === "push" && selectedPushMessage) ||
                    (activeMainTab === "email" && (selectedEmailTemplate || (builderSubject && builderHtml)))
                )
                  ? "bg-[#FF843E] hover:bg-orange-600"
                  : "bg-gray-600"
              } text-white text-sm rounded-xl`}
              disabled={
                !selectedRecipients.length ||
                !(
                  (activeMainTab === "push" && selectedPushMessage) ||
                  (activeMainTab === "email" && (selectedEmailTemplate || (builderSubject && builderHtml)))
                )
              }
            >
              Send Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
