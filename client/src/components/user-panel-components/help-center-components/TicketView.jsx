/* eslint-disable react/prop-types */
import { ImageIcon } from "lucide-react"
import { useRef, useState } from "react"
import { List, X } from "react-feather"

const TicketView = ({ ticket, onClose, onUpdateTicket }) => {
    const [replyText, setReplyText] = useState("")
    const [uploadedImages, setUploadedImages] = useState([])
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const textareaRef = useRef(null)
    const fileInputRef = useRef(null)
  
    const isTicketClosed = ticket.status === "Closed"
  
    const handleAddReply = () => {
      if (replyText.trim() && !isTicketClosed) {
        const newMessage = {
          id: ticket.messages.length + 1,
          sender: "user",
          content: replyText,
          timestamp: new Date().toLocaleDateString("en-GB"),
          images: uploadedImages,
          isBold: isBold,
          isItalic: isItalic,
        }
  
        const updatedTicket = {
          ...ticket,
          messages: [...ticket.messages, newMessage],
        }
  
        onUpdateTicket(updatedTicket)
        setReplyText("")
        setUploadedImages([])
        setIsBold(false)
        setIsItalic(false)
      }
    }
  
    const handleCloseTicket = () => {
      if (window.confirm("Are you sure you want to close this ticket? You won't be able to send replies anymore.")) {
        const updatedTicket = {
          ...ticket,
          status: "Closed",
        }
        onUpdateTicket(updatedTicket)
      }
    }
  
    const toggleBold = () => {
      setIsBold(!isBold)
    }
  
    const toggleItalic = () => {
      setIsItalic(!isItalic)
    }
  
    const addBulletPoint = () => {
      const textarea = textareaRef.current
      if (!textarea) return
  
      const start = textarea.selectionStart
      const text = textarea.value
      const lines = text.split("\n")
      const currentLineIndex = text.substring(0, start).split("\n").length - 1
  
      if (!lines[currentLineIndex].startsWith("• ")) {
        lines[currentLineIndex] = "• " + lines[currentLineIndex]
        setReplyText(lines.join("\n"))
      }
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
  
    const renderMessageContent = (message) => {
      const style = {}
      if (message.isBold) style.fontWeight = "bold"
      if (message.isItalic) style.fontStyle = "italic"
  
      return (
        <div>
          <div
            style={style}
            className="text-gray-100 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap"
          >
            {message.content}
          </div>
          {message.images && message.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.images.map((img, idx) => (
                <img key={idx} src={img || "/placeholder.svg"} alt="Uploaded" className="max-w-xs rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )
    }
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#2A2A2A] rounded-lg sm:rounded-xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col max-h-screen">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-600 flex-shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate pr-2">{ticket.subject}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-1 flex-shrink-0">
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
  
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 bg-[#1C1C1C]">
            <div className="space-y-4 sm:space-y-6">
              {ticket.messages.map((message) => (
                <div key={message.id} className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {message.sender === "user" ? "U" : "G"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <span className="font-medium text-white text-sm sm:text-base">
                        {message.sender === "user" ? "You" : "GamsGo"}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm">{message.timestamp}</span>
                    </div>
                    {renderMessageContent(message)}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="border-t border-gray-600 p-3 sm:p-4 flex-shrink-0 bg-[#2A2A2A]">
            {isTicketClosed ? (
              <div className="text-center text-gray-400 py-4">
                This ticket is closed. You cannot send replies anymore.
              </div>
            ) : (
              <>
                <div className="mb-3 sm:mb-4">
                  <div className="border border-gray-600 rounded-md sm:rounded-lg overflow-hidden bg-[#1C1C1C]">
                    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#2A2A2A] border-b border-gray-600">
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
                        className={`p-1 hover:bg-gray-700 rounded text-gray-300`}
                        title="Add image"
                      >
                        <ImageIcon size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={toggleBold}
                        className={`px-1.5 py-1 hover:bg-gray-700 rounded font-bold text-xs sm:text-sm ${
                          isBold ? "bg-gray-700 text-white" : "text-gray-300"
                        }`}
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        onClick={toggleItalic}
                        className={`px-1.5 py-1 hover:bg-gray-700 rounded italic text-xs sm:text-sm ${
                          isItalic ? "bg-gray-700 text-white" : "text-gray-300"
                        }`}
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        onClick={addBulletPoint}
                        className="p-1 hover:bg-gray-700 rounded text-gray-300"
                        title="Add list"
                      >
                        <List size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
  
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-[#1C1C1C]">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img || "/placeholder.svg"}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
  
                    <textarea
                      ref={textareaRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Additional description"
                      style={{
                        fontWeight: isBold ? "bold" : "normal",
                        fontStyle: isItalic ? "italic" : "normal",
                      }}
                      className="w-full p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] resize-none border-none outline-none text-sm sm:text-base text-white placeholder-gray-500 bg-[#1C1C1C]"
                    />
                  </div>
                </div>
  
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                  <button
                    onClick={handleCloseTicket}
                    className="text-white text-sm py-2 px-6 rounded-lg bg-gray-600 font-medium  order-2 sm:order-1"
                  >
                    Close ticket
                  </button>
                  <button
                    onClick={handleAddReply}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-600 font-medium text-sm order-1 sm:order-2"
                  >
                    Add Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  export default TicketView