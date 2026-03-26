/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { ImageIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { X } from "react-feather"
import { WysiwygEditor } from "../../shared/WysiwygEditor"
import OrgaGymLogo from '../../../../public/OrgaGym Logo.svg'

const TicketView = ({ ticket, onClose, onUpdateTicket, onCloseTicket }) => {
    const [replyText, setReplyText] = useState("")
    const [uploadedImages, setUploadedImages] = useState([]) // Store File objects for upload
    const [uploadedImagePreviews, setUploadedImagePreviews] = useState([]) // Store preview URLs for display
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const [viewingImage, setViewingImage] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const messagesContainerRef = useRef(null)
  
    const isTicketClosed = ticket?.isClosed === true || ticket?.status === "close" || ticket?.status === "Closed"

    // Build messages array from ticket data - Now supports new conversation structure
    const buildMessagesArray = () => {
        // ✅ Priority: Use messages array if it exists (new conversation structure)
        if (ticket?.messages && Array.isArray(ticket.messages) && ticket.messages.length > 0) {
            return ticket.messages.map(msg => ({
                ...msg,
                // Ensure consistent format
                sender: msg.sender,
                content: msg.content,
                timestamp: msg.timestamp,
                createdAt: msg.timestamp,
                uploadedImages: msg.uploadedImages,
                createdBy: msg.senderId || msg.createdBy,
                repliedBy: msg.senderId
            }))
        }
        
        // Fallback for old data structure
        const messages = []
        
        // Original ticket creation message (user's initial message)
        if (ticket?.additionalDescription || ticket?.subject) {
            messages.push({
                id: 'original',
                sender: "user",
                content: ticket.additionalDescription || ticket.subject,
                timestamp: ticket.createdAt,
                createdAt: ticket.createdAt,
                createdBy: ticket.createdBy,
                uploadedImages: ticket.uploadedImages,
            })
        }
        
        // Check for replies (support replies)
        if (ticket?.replyText && ticket.replyText.trim()) {
            messages.push({
                id: 'reply',
                sender: "support",
                content: ticket.replyText,
                timestamp: ticket.updatedAt,
                createdAt: ticket.updatedAt,
                repliedBy: ticket.repliedBy,
                uploadedImages: ticket.uploadedImagesBySupport,
            })
        }
        
        return messages
    }
    
    const messages = buildMessagesArray()

    // Lightbox keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!viewingImage) return
            
            if (event.key === 'Escape') {
                setViewingImage(null)
            } else if (event.key === 'ArrowLeft') {
                const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
                setViewingImage({
                    ...viewingImage,
                    image: viewingImage.images[newIndex],
                    index: newIndex
                })
            } else if (event.key === 'ArrowRight') {
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

    useEffect(() => {
        // Scroll to bottom after messages load
        setTimeout(scrollToBottom, 100)
    }, [messages])

    // Helper function to format timestamp
    const formatTimestamp = (date) => {
        if (!date) return ""
        const d = new Date(date)
        const dateStr = d.toLocaleDateString("en-GB")
        const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        return `${dateStr}, ${timeStr}`
    }

    const handleAddReply = async () => {
        if (!replyText.trim() && uploadedImages.length === 0) return
        if (isTicketClosed) return
        
        setIsSubmitting(true)
        
        try {
            // Call the parent's onUpdateTicket with reply data and images
            await onUpdateTicket(ticket, replyText, uploadedImages)
            
            // Clear form after successful submission
            setReplyText("")
            setUploadedImages([])
            setUploadedImagePreviews([])
            
        } catch (error) {
            console.error('Failed to add reply:', error)
        } finally {
            setIsSubmitting(false)
        }
    }
  
    const handleCloseTicket = () => {
        setShowCloseConfirm(true)
    }
  
    const confirmCloseTicket = async () => {
        try {
            await onCloseTicket(ticket)
            setShowCloseConfirm(false)
            onClose()
        } catch (error) {
            console.error('Failed to close ticket:', error)
        }
    }
  
    const cancelCloseTicket = () => {
        setShowCloseConfirm(false)
    }
  
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        
        // Limit to single file (backend only accepts one)
        if (files.length > 1) {
            alert('Only one image can be uploaded at a time')
            return
        }
        
        const file = files[0]
        
        if (file) {
            // Store actual File object for upload
            setUploadedImages([file])
            
            // Create preview URL for display
            const reader = new FileReader()
            reader.onload = (event) => {
                setUploadedImagePreviews([event.target.result])
            }
            reader.readAsDataURL(file)
        }
    }
  
    const removeImage = () => {
        setUploadedImages([])
        setUploadedImagePreviews([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }
  
    // Render message content
    const renderMessageContent = (message) => {
        const content = message.content || message.replyText || ""
        return (
            <div
                className="text-content-primary text-sm sm:text-base leading-relaxed break-words rich-text-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        )
    }

    // Render attachments from backend
    const renderAttachments = (message) => {
        // Check for uploadedImages from backend (could be single object or array)
        let images = []
        
        if (message.uploadedImages) {
            if (Array.isArray(message.uploadedImages)) {
                images = message.uploadedImages
            } else if (message.uploadedImages.url) {
                images = [message.uploadedImages]
            }
        }
        
        if (images.length === 0) return null

        return (
            <div className="mt-3 grid grid-cols-4 gap-2 max-w-md">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="block group relative cursor-pointer"
                        onClick={() => setViewingImage({
                            image: { url: img.url || img, name: `Attachment ${idx + 1}` },
                            images: images.map((img2, i) => ({ 
                                url: img2.url || img2, 
                                name: `Attachment ${i + 1}` 
                            })),
                            index: idx
                        })}
                    >
                        <img 
                            src={img.url || img || "/placeholder.svg"} 
                            alt={`Attachment ${idx + 1}`} 
                            className="w-full h-16 object-cover rounded-lg border border-border group-hover:border-primary transition-colors" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium">View</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Get sender display name
    const getSenderName = (message) => {
        if (message.sender === 'user') {
            if (message.createdBy?.firstName || message.senderId?.firstName) {
                const sender = message.createdBy || message.senderId
                return `${sender.firstName} ${sender.lastName || ''}`.trim()
            }
            return "You"
        }
        return "OrgaGym Support"
    }

    // Get sender initial for avatar
    const getSenderInitial = (message) => {
        if (message.sender === 'user') {
            if (message.createdBy?.firstName || message.senderId?.firstName) {
                const sender = message.createdBy || message.senderId
                return sender.firstName.charAt(0).toUpperCase()
            }
            return "U"
        }
        return "S"
    }

    // Close Confirmation Modal Component
    const CloseConfirmationModal = () => {
        if (!showCloseConfirm) return null

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
                <div className="bg-surface-base rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-content-primary">Close Ticket</h3>
                        <button
                            onClick={cancelCloseTicket}
                            className="text-content-muted hover:text-content-primary transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <p className="text-content-secondary mb-6 text-sm leading-relaxed">
                        Are you sure you want to close this ticket? <span className="font-bold">You won't be able to send replies anymore.</span>
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={cancelCloseTicket}
                            className="px-4 py-2.5 text-sm rounded-xl font-medium text-content-secondary bg-surface-button hover:bg-surface-button-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmCloseTicket}
                            className="px-4 py-2.5 text-sm rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            Close Ticket
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // If no ticket data, return null
    if (!ticket) return null
  
    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-surface-button rounded-lg sm:rounded-xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col max-h-screen">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <h2 className="text-base sm:text-lg font-semibold text-content-primary truncate">
                                {ticket.subject} <span className="text-primary">#{ticket._id?.slice(-6) || ticket.id}</span>
                            </h2>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                ticket.isClosed || ticket.status === "close" || ticket.status === "Closed" 
                                    ? "bg-gray-600 text-white" 
                                    : ticket.status === "open" || ticket.status === "Open"
                                        ? "bg-green-600 text-white"
                                        : ticket.status === "in-progress" || ticket.status === "In Progress"
                                            ? "bg-blue-600 text-white"
                                            : "bg-yellow-600 text-white"
                            }`}>
                                {ticket.isClosed ? "Closed" : (ticket.status === 'in-progress' ? "In Progress" : (ticket.status || "Open"))}
                            </span>
                        </div>
                        <button onClick={onClose} className="text-content-muted hover:text-content-secondary p-1 flex-shrink-0">
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>
    
                    {/* Messages Container */}
                    <div 
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 bg-surface-base"
                    >
                        <div className="space-y-4 sm:space-y-6">
                            {messages && messages.length > 0 ? (
                                messages.map((message, idx) => (
                                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                                        {/* Avatar */}
                                        {message.sender === "user" ? (
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-xs sm:text-sm">
                                                    {getSenderInitial(message)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <img src={OrgaGymLogo} className="h-8 w-8 rounded-xl" alt="" />
                                            </div>
                                        )}
                                        
                                        {/* Message Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                                                <span className="font-medium text-content-primary text-sm sm:text-base">
                                                    {getSenderName(message)}
                                                </span>
                                                <span className="text-content-muted text-xs sm:text-sm">
                                                    {formatTimestamp(message.timestamp || message.createdAt)}
                                                </span>
                                            </div>
                                            {renderMessageContent(message)}
                                            {renderAttachments(message)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-content-secondary">
                                    <p>No messages yet. Add a reply to start the conversation.</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
    
                    {/* Reply Section */}
                    <div className="border-t border-border p-3 sm:p-4 flex-shrink-0 bg-surface-button">
                        {isTicketClosed ? (
                            <div className="text-center text-content-muted py-4 bg-surface-base rounded-lg">
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
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg text-content-secondary hover:bg-surface-hover hover:text-content-primary transition-colors"
                                        >
                                            <ImageIcon size={16} />
                                            Attach Image {uploadedImages.length > 0 ? '(1 attached)' : ''}
                                        </button>
                                        
                                        {uploadedImagePreviews.length > 0 && (
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {uploadedImagePreviews.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div 
                                                            className="cursor-pointer"
                                                            onClick={() => setViewingImage({
                                                                image: { url: img, name: uploadedImages[idx]?.name || `Preview` },
                                                                images: uploadedImagePreviews.map((url, i) => ({ 
                                                                    url, 
                                                                    name: uploadedImages[i]?.name || `Preview ${i + 1}` 
                                                                })),
                                                                index: idx
                                                            })}
                                                        >
                                                            <img 
                                                                src={img || "/placeholder.svg"} 
                                                                alt="Preview"
                                                                className="w-full h-20 object-cover rounded-lg border border-border"
                                                            />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded">View</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* WYSIWYG Editor */}
                                    <WysiwygEditor
                                        value={replyText}
                                        onChange={setReplyText}
                                        placeholder="Type your reply here..."
                                        minHeight={180}
                                        maxHeight={220}
                                        showImages={false}
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                    <button
                                        onClick={handleCloseTicket}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 text-content-secondary text-sm rounded-lg bg-surface-button hover:bg-surface-button-hover font-medium transition-colors order-2 sm:order-1"
                                    >
                                        Close Ticket
                                    </button>
                                    <button
                                        onClick={handleAddReply}
                                        disabled={(!replyText.trim() && uploadedImages.length === 0) || isSubmitting}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-primary text-white rounded-md sm:rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            'Add Reply'
                                        )}
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
                    <button
                        onClick={() => setViewingImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-content-secondary p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
                        aria-label="Close image"
                    >
                        <X size={32} />
                    </button>

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
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-content-secondary p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
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
                                setViewingImage({
                                    ...viewingImage,
                                    image: viewingImage.images[newIndex],
                                    index: newIndex
                                })
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-content-secondary p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
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
                                    <span className="text-content-muted ml-2">
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

            {/* Close Confirmation Modal */}
            <CloseConfirmationModal />
        </>
    )
}

export default TicketView