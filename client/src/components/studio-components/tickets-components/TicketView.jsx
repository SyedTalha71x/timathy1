/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { ImageIcon, Paperclip } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { X } from "react-feather"
import ReactQuill from "react-quill"
import OrgaGymLogo from '../../../../public/Orgagym white without text.svg'

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

  // Add custom CSS for placeholder and fix toolbar visibility
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

    return () => {
      document.head.removeChild(style)
    }
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


const TicketView = ({ ticket, onClose, onUpdateTicket }) => {
    const [replyText, setReplyText] = useState("")
    const [uploadedImages, setUploadedImages] = useState([])
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const [viewingImage, setViewingImage] = useState(null) // { image, images, index }
    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const messagesContainerRef = useRef(null)
  
    const isTicketClosed = ticket.status === "Closed"

    // Lightbox keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (!viewingImage) return
        
        if (event.key === 'Escape') {
          setViewingImage(null)
        } else if (event.key === 'ArrowLeft') {
          // Previous image
          const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
          setViewingImage({
            ...viewingImage,
            image: viewingImage.images[newIndex],
            index: newIndex
          })
        } else if (event.key === 'ArrowRight') {
          // Next image
          const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
          setViewingImage({
            ...viewingImage,
            image: viewingImage.images[newIndex],
            index: newIndex
          })
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [viewingImage])

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }

    // Scroll to bottom when messages update
    useEffect(() => {
      scrollToBottom()
    }, [ticket.messages])

    // Helper function to format timestamp with date and time
    const formatTimestamp = () => {
      const now = new Date()
      const date = now.toLocaleDateString("en-GB")
      const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      return `${date}, ${time}`
    }
  
    const handleAddReply = () => {
      if (replyText.trim() && !isTicketClosed) {
        const newMessage = {
          id: ticket.messages.length + 1,
          sender: "user",
          content: replyText,
          timestamp: formatTimestamp(),
          images: uploadedImages,
        }
  
        const updatedTicket = {
          ...ticket,
          messages: [...ticket.messages, newMessage],
        }
  
        onUpdateTicket(updatedTicket)
        setReplyText("")
        setUploadedImages([])
        
        // Scroll happens automatically via useEffect when messages change
      }
    }
  
    const handleCloseTicket = () => {
      setShowCloseConfirm(true)
    }
  
    const confirmCloseTicket = () => {
      const updatedTicket = {
        ...ticket,
        status: "Closed",
      }
      onUpdateTicket(updatedTicket)
      setShowCloseConfirm(false)
    }
  
    const cancelCloseTicket = () => {
      setShowCloseConfirm(false)
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
  
    // Render message content (text only)
    const renderMessageContent = (message) => {
      return (
        <div
          className="text-gray-100 text-sm sm:text-base leading-relaxed break-words rich-text-content"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      )
    }

    // Render attachments separately
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

    // Close Confirmation Modal Component
    const CloseConfirmationModal = () => {
      if (!showCloseConfirm) return null

      return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#2A2A2A] rounded-xl p-6 w-full max-w-md mx-auto border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Close Ticket</h3>
              <button
                onClick={cancelCloseTicket}
                className="text-gray-400 hover:text-gray-200 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Are you sure you want to close this ticket? <span className="text-yellow-400 font-medium">You won't be able to send replies anymore.</span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelCloseTicket}
                className="px-4 py-2 text-sm border border-gray-600 rounded-lg font-medium text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseTicket}
                className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#2A2A2A] rounded-lg sm:rounded-xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col max-h-screen">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-600 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                  {ticket.subject} <span className="text-blue-400">#{ticket.id}</span>
                </h2>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  ticket.status === "Open" ? "bg-green-500 text-white" :
                  ticket.status === "In Progress" ? "bg-blue-500 text-white" :
                  ticket.status === "Awaiting your reply" ? "bg-yellow-500 text-white" :
                  ticket.status === "Resolved" ? "bg-purple-500 text-white" :
                  ticket.status === "Closed" ? "bg-gray-500 text-white" :
                  ticket.status === "Urgent" ? "bg-red-500 text-white" :
                  "bg-gray-400 text-white"
                }`}>
                  {ticket.status}
                </span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-1 flex-shrink-0">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
    
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 bg-[#1C1C1C]"
            >
              <div className="space-y-4 sm:space-y-6">
                {ticket.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2 sm:gap-3">
                    {message.sender === "user" ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">U</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <img src={OrgaGymLogo} className="h-8 w-8 rounded-xl" alt="" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <span className="font-medium text-white text-sm sm:text-base">
                          {message.sender === "user" ? "You" : "OrgaGym"}
                        </span>
                        {/* Timestamp with date AND time */}
                        <span className="text-gray-400 text-xs sm:text-sm">{message.timestamp}</span>
                      </div>
                      {/* Message content */}
                      {renderMessageContent(message)}
                      {/* Attachments shown separately */}
                      {renderAttachments(message)}
                    </div>
                  </div>
                ))}
                {/* Invisible element for scroll-to-bottom */}
                <div ref={messagesEndRef} />
              </div>
            </div>
    
            <div className="border-t border-gray-600 p-3 sm:p-4 flex-shrink-0 bg-[#2A2A2A]">
              {isTicketClosed ? (
                <div className="text-center text-gray-400 py-4 bg-[#1C1C1C] rounded-lg">
                  <div className="text-sm font-medium mb-1">This ticket is closed</div>
                  <div className="text-xs">You cannot send replies anymore.</div>
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

                    {/* WYSIWYG Editor with fixed height and scrollable content */}
                    <div className="border border-gray-600 rounded-lg overflow-hidden bg-[#101010] h-64 flex flex-col">
                      <WysiwygEditor
                        value={replyText}
                        onChange={setReplyText}
                        placeholder="Type your reply here..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <button
                      onClick={handleCloseTicket}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 text-white text-sm rounded-lg bg-gray-600 hover:bg-gray-700 font-medium transition-colors order-2 sm:order-1"
                    >
                      Close Ticket
                    </button>
                    <button
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors order-1 sm:order-2"
                    >
                      Add Reply
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Image Lightbox Modal */}
        {viewingImage && viewingImage.image && (
          <div 
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
            onClick={() => setViewingImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
              aria-label="Close image"
            >
              <X size={32} />
            </button>

            {/* Previous Button */}
            {viewingImage.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
                  setViewingImage({
                    ...viewingImage,
                    image: viewingImage.images[newIndex],
                    index: newIndex
                  })
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
                aria-label="Previous image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {viewingImage.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
                  setViewingImage({
                    ...viewingImage,
                    image: viewingImage.images[newIndex],
                    index: newIndex
                  })
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
              {/* Filename above image */}
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
              
              {/* Image */}
              <img 
                src={viewingImage.image.url} 
                alt={viewingImage.image.name}
                className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Close Confirmation Modal */}
        <CloseConfirmationModal />
      </>
    )
  }

export default TicketView
