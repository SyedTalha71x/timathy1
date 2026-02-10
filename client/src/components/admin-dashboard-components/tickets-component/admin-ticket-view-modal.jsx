/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, ImageIcon, MessageSquare, X, XCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactQuill from "react-quill"
import Logo from '../../../../public/Orgagym white without text.svg'

// ── WYSIWYG Editor (same as TicketView) ──────────────────────
const WysiwygEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ]

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .ql-editor.ql-blank::before {
        color: #ffffff !important;
        opacity: 0.7 !important;
      }
      .ql-editor {
        color: #ffffff !important;
        min-height: 120px;
        max-height: 200px;
        overflow-y: auto;
      }
      .ql-toolbar {
        border-color: #303030 !important;
        background-color: #151515 !important;
        position: relative;
        z-index: 10;
      }
      .ql-container {
        border-color: #303030 !important;
        background-color: #101010 !important;
      }
      .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .ql-snow .ql-picker-options {
        background-color: #151515 !important;
        border-color: #303030 !important;
      }
      .ql-snow .ql-picker-item {
        color: #ffffff !important;
      }
      .ql-snow .ql-tooltip {
        background-color: #151515 !important;
        border-color: #303030 !important;
        color: #ffffff !important;
        z-index: 20;
      }
      .ql-snow .ql-tooltip input[type="text"] {
        color: #000000 !important;
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      theme="snow"
    />
  )
}

// ── Helper: parse "Subject – Reason" from ticket.subject ─────
const parseSubjectAndReason = (subject) => {
  if (!subject) return { subjectPart: "—", reasonPart: "—" }
  const emDashIdx = subject.indexOf(" – ")
  if (emDashIdx !== -1) {
    return {
      subjectPart: subject.substring(0, emDashIdx).trim(),
      reasonPart: subject.substring(emDashIdx + 3).trim(),
    }
  }
  const dashIdx = subject.indexOf(" - ")
  if (dashIdx !== -1) {
    return {
      subjectPart: subject.substring(0, dashIdx).trim(),
      reasonPart: subject.substring(dashIdx + 3).trim(),
    }
  }
  return { subjectPart: subject, reasonPart: "—" }
}

// ── Admin Ticket View ────────────────────────────────────────
const AdminTicketView = ({ ticket, onClose, onUpdateTicket }) => {
  const [replyText, setReplyText] = useState("")
  const [uploadedImages, setUploadedImages] = useState([])
  const [ticketStatus, setTicketStatus] = useState(ticket.status)
  const [ticketPriority, setTicketPriority] = useState(ticket.priority)
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo)
  const [showSidebar, setShowSidebar] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const isTicketClosed = ticket.status === "Closed"
  const { subjectPart, reasonPart } = parseSubjectAndReason(ticket.subject)

  // ── Auto-scroll to bottom on new messages ──────────────────
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [ticket.messages])

  // ── Lightbox keyboard navigation ───────────────────────────
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!viewingImage) return
      if (event.key === 'Escape') {
        setViewingImage(null)
      } else if (event.key === 'ArrowLeft') {
        const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
        setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
      } else if (event.key === 'ArrowRight') {
        const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
        setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [viewingImage])

  // ── Helpers ────────────────────────────────────────────────
  const formatTimestamp = () => {
    const now = new Date()
    const date = now.toLocaleDateString("en-GB")
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    return `${date}, ${time}`
  }

  // ── Handlers ──────────────────────────────────────────────
  const handleAddReply = () => {
    if (replyText.trim() && !isTicketClosed) {
      const newMessage = {
        id: ticket.messages.length + 1,
        sender: "support",
        senderName: "OrgaGym",
        content: replyText,
        timestamp: formatTimestamp(),
        images: uploadedImages,
        attachments: []
      }

      const updatedTicket = {
        ...ticket,
        messages: [...ticket.messages, newMessage],
        lastUpdated: new Date().toLocaleDateString("en-GB"),
        status: ticketStatus
      }

      onUpdateTicket(updatedTicket)
      setReplyText("")
      setUploadedImages([])
    }
  }

  const handleUpdateTicket = () => {
    const updatedTicket = {
      ...ticket,
      status: ticketStatus,
      priority: ticketPriority,
      assignedTo: assignedTo,
      lastUpdated: new Date().toLocaleDateString("en-GB")
    }
    onUpdateTicket(updatedTicket)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImages((prev) => [...prev, event.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Rich text message rendering ───────────────────────────
  const renderMessageContent = (message) => {
    return (
      <div
        className="text-gray-100 text-sm leading-relaxed break-words rich-text-content"
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    )
  }

  // ── Image attachments rendering ───────────────────────────
  const renderAttachments = (message) => {
    if (!message.images || message.images.length === 0) return null

    return (
      <div className="mt-3 grid grid-cols-4 gap-2 max-w-md">
        {message.images.map((img, idx) => (
          <div
            key={idx}
            className="block group relative cursor-pointer"
            onClick={() => setViewingImage({
              image: { url: img, name: `Attachment ${idx + 1}` },
              images: message.images.map((url, i) => ({ url, name: `Attachment ${i + 1}` })),
              index: idx
            })}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`Attachment ${idx + 1}`}
              className="w-full h-16 object-cover rounded-lg border border-gray-700 group-hover:border-blue-500 transition-colors"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">View</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Status badge color (only 3 statuses) ──────────────────
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Open": return "bg-green-500 text-white"
      case "Awaiting your reply": return "bg-yellow-500 text-white"
      case "Closed": return "bg-gray-500 text-white"
      default: return "bg-gray-400 text-white"
    }
  }

  // ── Priority — colored text ───────────────────────────────
  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-400"
      case "Medium": return "text-yellow-400"
      case "Low": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  // ── Status pill toggle colors (for sidebar) ───────────────
  const getStatusPillStyle = (status, isActive) => {
    if (!isActive) return "bg-[#1C1C1C] text-gray-400 border-gray-700 hover:border-gray-500"
    switch (status) {
      case "Open": return "bg-green-500/15 text-green-400 border-green-500"
      case "Awaiting your reply": return "bg-yellow-500/15 text-yellow-400 border-yellow-500"
      case "Closed": return "bg-gray-500/15 text-gray-300 border-gray-500"
      default: return "bg-gray-500/15 text-gray-300 border-gray-500"
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#1C1C1C] rounded-lg sm:rounded-xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col lg:flex-row max-h-screen border border-gray-700">

          {/* ── Main Content ──────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                  {ticket.subject} <span className="text-blue-400">#{ticket.id}</span>
                </h2>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${getStatusBadgeColor(ticketStatus)}`}>
                  {ticketStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-300 border border-gray-600 rounded-md"
                >
                  <Filter size={16} />
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-300 p-1 flex-shrink-0">
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Info Bar */}
            <div className="bg-[#161616] px-3 sm:px-4 py-2 border-b border-gray-700 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <Calendar size={14} />
                  <span>Created: {ticket.createdDate}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock size={14} />
                  <span>Updated: {ticket.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* ── Messages ───────────────────────────────── */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 bg-[#1C1C1C]"
            >
              <div className="space-y-4 sm:space-y-6">
                {ticket.messages.map((message) => {
                  const isOrgaGym = message.sender === "support"
                  const firstLetter = message.senderName?.charAt(0).toUpperCase()

                  return (
                    <div key={message.id} className="flex items-start gap-2 sm:gap-3">
                      {isOrgaGym ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img src={Logo} alt="OrgaGym" className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-contain" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm uppercase">
                            {firstLetter}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <span className="font-medium text-white text-sm sm:text-base">
                            {message.senderName}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {message.timestamp}
                          </span>
                        </div>
                        {renderMessageContent(message)}
                        {renderAttachments(message)}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Reply Section ───────────────────────────── */}
            <div className="border-t border-gray-700 p-3 sm:p-4 flex-shrink-0 bg-[#2A2A2A]">
              {isTicketClosed ? (
                <div className="text-center text-gray-400 py-4 bg-[#1C1C1C] rounded-lg">
                  <div className="text-sm font-medium mb-1">This ticket is closed</div>
                  <div className="text-xs">You can reopen it by changing the status in the sidebar.</div>
                </div>
              ) : (
                <>
                  <div className="mb-3 sm:mb-4">
                    <div className="mb-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <ImageIcon size={16} />
                        Attach Images
                      </button>

                      {uploadedImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <div
                                className="cursor-pointer"
                                onClick={() => setViewingImage({
                                  image: { url: img, name: `Preview ${idx + 1}` },
                                  images: uploadedImages.map((url, i) => ({ url, name: `Preview ${i + 1}` })),
                                  index: idx
                                })}
                              >
                                <img
                                  src={img || "/placeholder.svg"}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-medium bg-gray-800 px-3 py-1 rounded">View</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-600 rounded-lg overflow-hidden bg-[#101010] h-64 flex flex-col">
                      <WysiwygEditor
                        value={replyText}
                        onChange={setReplyText}
                        placeholder="Type your reply to the customer..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                    <button
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                    >
                      Send Reply
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              SIDEBAR — redesigned for clarity & intuition
              Flow: Studio → Topic → Manage → Update
             ══════════════════════════════════════════════════ */}
          <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-t lg:border-l border-gray-700 text-sm flex-shrink-0 lg:max-h-full overflow-y-auto`}>

            {/* 1) Studio Info — who sent this ticket */}
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Studio</h4>
              <div className="space-y-1.5">
                <p className="text-white font-medium text-sm">{ticket.studioName}</p>
                <p className="text-gray-400 text-xs">{ticket.customer.email}</p>
                <p className="text-gray-500 text-xs">ID: {ticket.customer.id}</p>
              </div>
            </div>

            {/* 2) Subject & Reason — what is this ticket about */}
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Topic</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-16 flex-shrink-0">Subject</span>
                  <span className="text-white text-sm font-medium">{subjectPart}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-16 flex-shrink-0">Reason</span>
                  <span className="text-gray-300 text-sm">{reasonPart}</span>
                </div>
              </div>
            </div>

            {/* 3) Manage — status & priority controls */}
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Manage</h4>

              <div className="space-y-4">
                {/* Status — pill toggle (3 options only) */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Status</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Open", "Awaiting your reply", "Closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setTicketStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${getStatusPillStyle(status, ticketStatus === status)}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority — pill toggle */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Priority</label>
                  <div className="flex gap-1.5">
                    {["Low", "Medium", "High"].map((priority) => {
                      const isActive = ticketPriority === priority
                      const activeColors = {
                        Low: "bg-green-500/15 text-green-400 border-green-500",
                        Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500",
                        High: "bg-red-500/15 text-red-400 border-red-500",
                      }
                      return (
                        <button
                          key={priority}
                          onClick={() => setTicketPriority(priority)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isActive
                              ? activeColors[priority]
                              : "bg-[#1C1C1C] text-gray-400 border-gray-700 hover:border-gray-500"
                          }`}
                        >
                          {priority}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateTicket}
                  className="w-full px-4 py-2.5 bg-orange-500 cursor-pointer text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Update Ticket
                </button>
              </div>
            </div>

            {/* 4) Timestamps */}
            <div className="p-4">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Timeline</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-300">{ticket.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last updated</span>
                  <span className="text-gray-300">{ticket.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Lightbox ───────────────────────────────── */}
      {viewingImage && viewingImage.image && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Close image"
          >
            <X size={32} />
          </button>

          {viewingImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
                setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {viewingImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
                setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex })
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/60 rounded-lg px-4 py-3 backdrop-blur-sm">
              <p className="text-white text-sm font-medium text-center">
                {viewingImage.image.name}
                {viewingImage.images.length > 1 && (
                  <span className="text-gray-400 ml-2">
                    ({viewingImage.index + 1}/{viewingImage.images.length})
                  </span>
                )}
              </p>
            </div>
            <img
              src={viewingImage.image.url}
              alt={viewingImage.image.name}
              className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AdminTicketView
