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

  const staffMembers = [
    "Unassigned",
    "Sarah Wilson",
    "Mike Johnson",
    "Lisa Chen",
    "David Rodriguez",
    "Emma Thompson"
  ]

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

  // ── Rich text message rendering (matching TicketView) ─────
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <AlertCircle size={16} className="text-green-400" />
      case "In Progress": return <Clock size={16} className="text-blue-400" />
      case "Pending Customer": return <MessageSquare size={16} className="text-yellow-400" />
      case "Resolved": return <CheckCircle size={16} className="text-green-400" />
      case "Closed": return <XCircle size={16} className="text-gray-400" />
      default: return <AlertCircle size={16} className="text-gray-400" />
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
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticketStatus)}
                  <span className="text-sm font-medium text-gray-400">#{ticket.id}</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">{ticket.subject}</h2>
                <span className="font-bold text-white">({ticket.studioName})</span>
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

            {/* Customer Info Bar */}
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

            {/* ── Messages (matching TicketView layout) ──── */}
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
                      {/* Avatar — consistent sizing with TicketView (w-8/w-10, rounded-xl) */}
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

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <span className="font-medium text-white text-sm sm:text-base">
                            {message.senderName}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {message.timestamp}
                          </span>
                        </div>
                        {/* Rich text content */}
                        {renderMessageContent(message)}
                        {/* Attachments */}
                        {renderAttachments(message)}
                      </div>
                    </div>
                  )
                })}
                {/* Invisible element for auto-scroll */}
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
                    {/* Image upload section */}
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
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeImage(idx)
                                }}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* WYSIWYG Editor (matching TicketView) */}
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

          {/* ── Sidebar — Admin-only (status, priority, customer details) ── */}
          <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-t lg:border-l border-gray-700 text-sm flex-shrink-0 lg:max-h-full overflow-y-auto`}>
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white mb-4">Ticket Details</h3>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                    className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Customer">Pending Customer</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdateTicket}
                  className="w-full px-4 py-2 bg-orange-500 cursor-pointer text-white rounded-md font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Update Ticket
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 border-b border-gray-700 text-sm">
              <h4 className="font-semibold text-white mb-3">Customer Details</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div><strong className="text-gray-200">Studio Name:</strong> {ticket.studioName}</div>
                <div><strong className="text-gray-200">Email:</strong> {ticket.customer.email}</div>
                <div><strong className="text-gray-200">Customer ID:</strong> {ticket.customer.id}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="p-4">
              <h4 className="font-semibold text-white mb-3 text-sm">Subject</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs border border-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Lightbox (matching TicketView) ──────────── */}
      {viewingImage && viewingImage.image && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setViewingImage(null)}
        >
          {/* Close */}
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Close image"
          >
            <X size={32} />
          </button>

          {/* Previous */}
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

          {/* Next */}
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

          {/* Image Container */}
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
