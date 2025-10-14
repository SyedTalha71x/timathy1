/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, ImageIcon, List, MessageSquare, User, X, XCircle } from "lucide-react"
import { useRef, useState } from "react"

/* eslint-disable no-unused-vars */
const AdminTicketView = ({ ticket, onClose, onUpdateTicket }) => {
    const [replyText, setReplyText] = useState("")
    const [ticketStatus, setTicketStatus] = useState(ticket.status)
    const [ticketPriority, setTicketPriority] = useState(ticket.priority)
    const [assignedTo, setAssignedTo] = useState(ticket.assignedTo)
    const [internalNote, setInternalNote] = useState("")
    const [showSidebar, setShowSidebar] = useState(false)
    const textareaRef = useRef(null)
  
    const staffMembers = [
      "Unassigned",
      "Sarah Wilson",
      "Mike Johnson", 
      "Lisa Chen",
      "David Rodriguez",
      "Emma Thompson"
    ]
  
    const handleAddReply = () => {
      if (replyText.trim()) {
        const newMessage = {
          id: ticket.messages.length + 1,
          sender: "support",
          senderName: "Admin User",
          content: replyText,
          timestamp: new Date().toLocaleDateString("en-GB") + " " + new Date().toLocaleTimeString(),
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
  
    const applyFormatting = (command) => {
      const textarea = textareaRef.current
      if (!textarea) return
  
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      let newText = textarea.value
  
      switch (command) {
        case "bold":
          if (selectedText) {
            newText = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end)
          } else {
            newText = textarea.value.substring(0, start) + "**bold text**" + textarea.value.substring(end)
          }
          break
        case "italic":
          if (selectedText) {
            newText = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end)
          } else {
            newText = textarea.value.substring(0, start) + "*italic text*" + textarea.value.substring(end)
          }
          break
        case "list":
          const lines = textarea.value.split("\n")
          const currentLineIndex = textarea.value.substring(0, start).split("\n").length - 1
          lines[currentLineIndex] = "• " + lines[currentLineIndex]
          newText = lines.join("\n")
          break
      }
  
      setReplyText(newText)
      setTimeout(() => {
        textarea.focus()
        if (command === "bold" || command === "italic") {
          const newCursorPos = command === "bold" ? start + 2 : start + 1
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
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
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#1C1C1C] rounded-lg sm:rounded-xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col lg:flex-row max-h-screen border border-gray-700">
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticketStatus)}
                  <span className="text-sm font-medium text-gray-400">#{ticket.id}</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">{ticket.subject}</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Sidebar Toggle for Mobile/Tablet */}
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
                  <User size={14} />
                  <span className="font-medium">{ticket.customer.name}</span>
                  <span className="text-gray-500">({ticket.customer.email})</span>
                </div>
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
  
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
              <div className="space-y-4 sm:space-y-6">
                {ticket.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "customer" ? "bg-blue-500" : "bg-green-500"
                    }`}>
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {message.sender === "customer" ? "C" : "S"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                        <span className="font-medium text-white text-sm">
                          {message.senderName}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          message.sender === "customer" ? "bg-blue-900/30 text-blue-400" : "bg-green-900/30 text-green-400"
                        }`}>
                          {message.sender === "customer" ? "Customer" : "Support"}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">{message.timestamp}</span>
                      </div>
                      <div className="text-gray-200 text-sm leading-relaxed break-words bg-[#161616] rounded-lg p-3 border border-gray-700">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Reply Section */}
            <div className="border-t border-gray-700 p-3 sm:p-4 flex-shrink-0">
              <div className="mb-3 sm:mb-4">
                <div className="border border-gray-600 rounded-md sm:rounded-lg overflow-hidden">
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#161616] border-b border-gray-600">
                    <button
                      onClick={() => applyFormatting("image")}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400"
                      title="Add image"
                    >
                      <ImageIcon size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting("bold")}
                      className="px-1.5 py-1 hover:bg-gray-700 rounded font-bold text-gray-300 text-xs sm:text-sm"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      onClick={() => applyFormatting("italic")}
                      className="px-1.5 py-1 hover:bg-gray-700 rounded italic text-gray-300 text-xs sm:text-sm"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      onClick={() => applyFormatting("list")}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400"
                      title="Add list"
                    >
                      <List size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply to the customer..."
                    className="w-full p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] resize-none border-none outline-none text-sm text-gray-200 placeholder-gray-500 bg-[#1C1C1C]"
                  />
                </div>
              </div>
  
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                <button
                  onClick={handleAddReply}
                  className="w-full sm:w-auto px-4 text-sm sm:px-6 py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  disabled={!replyText.trim()}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
  
          {/* Sidebar - Always visible on desktop, toggleable on mobile/tablet */}
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
  
                {/* Assigned To */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                  >
                    {staffMembers.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div> */}
  
                <button
                  onClick={handleUpdateTicket}
                  className="w-full px-4 py-2 bg-orange-500 cursor-pointer text-white rounded-md font-medium text-sm"
                >
                  Update Ticket
                </button>
              </div>
            </div>
  
            {/* Customer Details */}
            <div className="p-4 border-b border-gray-700 text-sm">
              <h4 className="font-semibold text-white mb-3">Customer Details</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div><strong className="text-gray-200">Name:</strong> {ticket.customer.name}</div>
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
    )
  }

  export default AdminTicketView