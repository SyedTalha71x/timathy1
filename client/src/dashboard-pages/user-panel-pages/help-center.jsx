"use client"

/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, List, ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { MdOutlineHelpCenter } from "react-icons/md"

const sampleTickets = [
  {
    id: 1,
    subject: "Account is not premium",
    status: "Open",
    date: "28/1/2025",
    messages: [
      {
        id: 1,
        sender: "user",
        content: "Account is not premium.",
        timestamp: "28/1/2025",
      },
    ],
  },
  {
    id: 2,
    subject: "Subscription renewal issue",
    status: "Awaiting your reply",
    date: "27/1/2025",
    messages: [
      {
        id: 1,
        sender: "support",
        content:
          "We are very sorry, the current subscription cannot be maintained due to official technical problems of Disney+. We must replace you with a more stable subscription. Thank you for your understanding.",
        timestamp: "27/1/2025",
      },
      {
        id: 2,
        sender: "support",
        content:
          'We have updated your subscription information. Please log in to GamsGo using your personal email and click on "Subscription" to view the latest details of your current subscription. If you have any other questions, feel free to contact us anytime. We will do our best to provide you with a satisfactory solution!',
        timestamp: "28/1/2025",
      },
    ],
  },
  {
    id: 3,
    subject: "Payment processing error",
    status: "Closed",
    date: "25/1/2025",
    messages: [
      {
        id: 1,
        sender: "user",
        content: "Having trouble with payment processing",
        timestamp: "25/1/2025",
      },
      {
        id: 2,
        sender: "support",
        content: "Issue has been resolved. Your payment has been processed successfully.",
        timestamp: "25/1/2025",
      },
    ],
  },
]

const TicketView = ({ ticket, onClose }) => {
  const [replyText, setReplyText] = useState("")
  const textareaRef = useRef(null)

  const handleAddReply = () => {
    if (replyText.trim()) {
      console.log("Adding reply:", replyText)
      setReplyText("")
    }
  }

  const handleCloseTicket = () => {
    console.log("Closing ticket:", ticket.id)
  }

  const applyFormatting = (command, value = null) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col max-h-screen">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{ticket.subject}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
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
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {message.sender === "user" ? "You" : "GamsGo"}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">{message.timestamp}</span>
                  </div>
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
          <div className="mb-3 sm:mb-4">
            <div className="border border-gray-300 rounded-md sm:rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border-b border-gray-300">
                <button
                  onClick={() => applyFormatting("image")}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600"
                  title="Add image"
                >
                  <ImageIcon size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => applyFormatting("bold")}
                  className="px-1.5 py-1 hover:bg-gray-200 rounded font-bold text-gray-700 text-xs sm:text-sm"
                  title="Bold"
                >
                  B
                </button>
                <button
                  onClick={() => applyFormatting("italic")}
                  className="px-1.5 py-1 hover:bg-gray-200 rounded italic text-gray-700 text-xs sm:text-sm"
                  title="Italic"
                >
                  I
                </button>
                <button
                  onClick={() => applyFormatting("list")}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600"
                  title="Add list"
                >
                  <List size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Additional description"
                className="w-full p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] resize-none border-none outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <button
              onClick={handleCloseTicket}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm sm:text-base order-2 sm:order-1"
            >
              Close ticket
            </button>
            <button
              onClick={handleAddReply}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-md sm:rounded-lg hover:bg-blue-600 font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              ADD REPLY
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState("")
  const [reason, setReason] = useState("")
  const [additionalDescription, setAdditionalDescription] = useState("")

  const subjects = [
    { value: "", label: "Select a Subject" },
    { value: "appointments", label: "Appointments" },
    { value: "widgets", label: "Widgets" },
    { value: "activity_monitor", label: "Activity Monitor" },
    { value: "finances", label: "Finances" },
    { value: "communication", label: "Communication" },
    { value: "members", label: "Members" },
    { value: "staff", label: "Staff" },
    { value: "training", label: "Training" },
    { value: "leads", label: "Leads" },
    { value: "selling", label: "Selling" },
    { value: "analytics", label: "Analytics" },
    { value: "configuration", label: "Configuration" },
  ]

  const reasons = {
    appointments: [
      { value: "", label: "Select a Reason" },
      { value: "booking_issue", label: "Booking Issue" },
      { value: "cancellation_problem", label: "Cancellation Problem" },
      { value: "rescheduling_request", label: "Rescheduling Request" },
      { value: "calendar_sync", label: "Calendar Sync Issue" },
    ],
    widgets: [
      { value: "", label: "Select a Reason" },
      { value: "widget_not_loading", label: "Widget Not Loading" },
      { value: "customization_help", label: "Customization Help" },
      { value: "widget_placement", label: "Widget Placement Issue" },
      { value: "widget_functionality", label: "Widget Functionality Problem" },
    ],
    activity_monitor: [
      { value: "", label: "Select a Reason" },
      { value: "tracking_not_working", label: "Tracking Not Working" },
      { value: "data_accuracy", label: "Data Accuracy Issue" },
      { value: "report_generation", label: "Report Generation Problem" },
      { value: "activity_alerts", label: "Activity Alerts Issue" },
    ],
    finances: [
      { value: "", label: "Select a Reason" },
      { value: "billing_discrepancy", label: "Billing Discrepancy" },
      { value: "payment_processing", label: "Payment Processing Issue" },
      { value: "invoice_problem", label: "Invoice Problem" },
      { value: "refund_request", label: "Refund Request" },
    ],
    communication: [
      { value: "", label: "Select a Reason" },
      { value: "email_delivery", label: "Email Delivery Issue" },
      { value: "notification_problem", label: "Notification Problem" },
      { value: "messaging_error", label: "Messaging Error" },
      { value: "communication_setup", label: "Communication Setup Help" },
    ],
    members: [
      { value: "", label: "Select a Reason" },
      { value: "member_registration", label: "Member Registration Issue" },
      { value: "profile_management", label: "Profile Management Problem" },
      { value: "membership_status", label: "Membership Status Question" },
      { value: "member_permissions", label: "Member Permissions Issue" },
    ],
    staff: [
      { value: "", label: "Select a Reason" },
      { value: "staff_access", label: "Staff Access Problem" },
      { value: "role_assignment", label: "Role Assignment Issue" },
      { value: "staff_scheduling", label: "Staff Scheduling Problem" },
      { value: "staff_permissions", label: "Staff Permissions Question" },
    ],
    training: [
      { value: "", label: "Select a Reason" },
      { value: "course_access", label: "Course Access Issue" },
      { value: "training_materials", label: "Training Materials Problem" },
      { value: "progress_tracking", label: "Progress Tracking Issue" },
      { value: "certification_problem", label: "Certification Problem" },
    ],
    leads: [
      { value: "", label: "Select a Reason" },
      { value: "lead_capture", label: "Lead Capture Issue" },
      { value: "lead_assignment", label: "Lead Assignment Problem" },
      { value: "lead_tracking", label: "Lead Tracking Issue" },
      { value: "lead_conversion", label: "Lead Conversion Problem" },
    ],
    selling: [
      { value: "", label: "Select a Reason" },
      { value: "sales_process", label: "Sales Process Issue" },
      { value: "product_catalog", label: "Product Catalog Problem" },
      { value: "pricing_issue", label: "Pricing Issue" },
      { value: "sales_reporting", label: "Sales Reporting Problem" },
    ],
    analytics: [
      { value: "", label: "Select a Reason" },
      { value: "data_visualization", label: "Data Visualization Issue" },
      { value: "report_accuracy", label: "Report Accuracy Problem" },
      { value: "dashboard_problem", label: "Dashboard Problem" },
      { value: "analytics_setup", label: "Analytics Setup Help" },
    ],
    configuration: [
      { value: "", label: "Select a Reason" },
      { value: "system_settings", label: "System Settings Issue" },
      { value: "integration_problem", label: "Integration Problem" },
      { value: "configuration_error", label: "Configuration Error" },
      { value: "setup_assistance", label: "Setup Assistance" },
    ],
  }

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
    setReason("")
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value)
  }

  const handleSubmit = () => {
    if (subject && reason) {
      onSubmit(subject, reason, additionalDescription)
      setSubject("")
      setReason("")
      setAdditionalDescription("")
    } else {
      alert("Please select both a subject and a reason.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center pr-6">Create New Ticket</h2>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Subject</label>
            <select
              value={subject}
              onChange={handleSubjectChange}
              className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white outline-none"
            >
              {subjects.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Reason</label>
            <select
              value={reason}
              onChange={handleReasonChange}
              disabled={!subject}
              className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {subject ? (
                reasons[subject].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              ) : (
                <option value="">Select a Subject first</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Additional description</label>
            <textarea
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
              placeholder="Provide additional details about your issue..."
              className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none min-h-[60px] sm:min-h-[80px] resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-md sm:rounded-lg font-medium text-gray-700 bg-slate-200 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 text-sm rounded-md sm:rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              disabled={!subject || !reason}
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const HelpCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState(sampleTickets)

  const handleNewTicketClick = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleSubmitTicket = (subject, reason, additionalDescription) => {
    const newTicket = {
      id: tickets.length + 1,
      subject: `${subject} - ${reason}`,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB"),
      messages: [
        {
          id: 1,
          sender: "user",
          content: additionalDescription || `Issue with ${subject}: ${reason}`,
          timestamp: new Date().toLocaleDateString("en-GB"),
        },
      ],
    }
    setTickets([newTicket, ...tickets])
    console.log("New ticket submitted:", { subject, reason, additionalDescription })
    setIsModalOpen(false)
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleCloseTicketView = () => {
    setSelectedTicket(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Awaiting your reply":
        return "bg-yellow-100 text-yellow-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col min-h-screen rounded-3xl bg-[#1C1C1C] text-white">
      {/* Header Section */}
      <div className="flex-shrink-0 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16">
          Contact us for a fast Response
        </h1>

        {/* Help Center Card */}
        <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 text-center w-full max-w-xs sm:max-w-sm border border-gray-200">
            <div className="flex justify-center items-center mb-3 sm:mb-4">
              <MdOutlineHelpCenter className="text-black" size={32} />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-1">Help Center</h2>
            <p className="text-gray-600 text-sm sm:text-base">View Help Articles</p>
          </div>
        </div>

        {/* Search and New Ticket Section */}
        <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Search for ticket"
              className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border text-sm sm:text-base border-gray-300 rounded-full text-black"
            />
            <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-5 sm:h-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <button
            onClick={handleNewTicketClick}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-full hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
          >
            New ticket
          </button>
        </div>
      </div>

      {/* Tickets Section - Takes remaining space */}
      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 px-2 min-h-0">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="bg-white rounded-lg p-3 sm:p-4 lg:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 font-medium text-sm sm:text-base lg:text-lg truncate pr-2">
                    {ticket.subject}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{ticket.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewTicketModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitTicket} />

      {selectedTicket && <TicketView ticket={selectedTicket} onClose={handleCloseTicketView} />}
    </div>
  )
}

export default HelpCenter
