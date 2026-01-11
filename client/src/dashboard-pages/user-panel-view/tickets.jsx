/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Search, Plus } from "lucide-react"
import TicketView from "../../components/user-panel-components/tickets-components/TicketView"
import NewTicketModal from "../../components/user-panel-components/tickets-components/NewTicketModal"
import { sampleTickets } from "../../utils/user-panel-states/help-center-states"

const Tickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState(sampleTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [closeConfirmModal, setCloseConfirmModal] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState(["All"])

  const handleNewTicketClick = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // FIXED: Now accepts ticketData object from NewTicketModal
  const handleSubmitTicket = (ticketData) => {
    const now = new Date()
    const currentDate = now.toLocaleDateString("en-GB")
    const currentTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    const timestamp = `${currentDate}, ${currentTime}`

    const newTicket = {
      id: tickets.length + 1,
      subject: ticketData.ticketName,
      status: "Open",
      date: currentDate,
      createdAt: timestamp,
      updatedAt: timestamp,
      studioName: ticketData.studioName,
      studioEmail: ticketData.studioEmail,
      requesterName: ticketData.requesterName,
      messages: [
        {
          id: 1,
          sender: "user",
          content: ticketData.additionalDescription,
          timestamp: timestamp,
          images: ticketData.uploadedImages,
        },
      ],
    }
    setTickets([newTicket, ...tickets])
    setIsModalOpen(false)
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleCloseTicketView = () => {
    setSelectedTicket(null)
  }

  const handleUpdateTicket = (updatedTicket) => {
    const now = new Date()
    const currentDate = now.toLocaleDateString("en-GB")
    const currentTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    const timestamp = `${currentDate}, ${currentTime}`

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === updatedTicket.id
        ? { ...updatedTicket, updatedAt: timestamp }
        : ticket
    )
    setTickets(updatedTickets)
    setSelectedTicket(updatedTicket)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-500 text-white"
      case "In Progress":
        return "bg-blue-500 text-white"
      case "Awaiting your reply":
        return "bg-yellow-500 text-white"
      case "Resolved":
        return "bg-purple-500 text-white"
      case "Closed":
        return "bg-gray-500 text-white"
      case "Urgent":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const handleFilterClick = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"])
    } else {
      const newFilters = selectedFilters.includes("All")
        ? [filter]
        : selectedFilters.includes(filter)
          ? selectedFilters.filter(f => f !== filter)
          : [...selectedFilters, filter]

      setSelectedFilters(newFilters.length === 0 ? ["All"] : newFilters)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.studioName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.studioEmail?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      selectedFilters.includes("All") ||
      selectedFilters.includes(ticket.status)

    return matchesSearch && matchesFilter
  })

  const ConfirmCloseModal = ({ isOpen, onClose, onConfirm, ticket }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">Close Ticket</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to close ticket "{ticket?.subject}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-600 rounded-lg font-medium text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Close Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleCloseTicket = (ticket) => {
    setCloseConfirmModal(ticket)
  }

  const confirmCloseTicket = () => {
    if (closeConfirmModal) {
      const now = new Date()
      const currentDate = now.toLocaleDateString("en-GB")
      const currentTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      const timestamp = `${currentDate}, ${currentTime}`

      const updatedTicket = {
        ...closeConfirmModal,
        status: "Closed",
        updatedAt: timestamp
      }
      handleUpdateTicket(updatedTicket)
      setCloseConfirmModal(null)
      if (selectedTicket?.id === closeConfirmModal.id) {
        setSelectedTicket(updatedTicket)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen rounded-3xl bg-[#1C1C1C] text-white overflow-hidden">
      <div className="flex-shrink-0 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16">
          Contact us for a fast Response
        </h1>

        {/* Search and New Ticket Button - Styled like leads.jsx */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
          {/* Search bar - Identical to leads.jsx */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search Tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
          </div>

          {/* Create Ticket Button - Styled like Create Lead button (orange) */}
          <button
            onClick={handleNewTicketClick}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 justify-center transition-colors"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span>Create Ticket</span>
          </button>
        </div>

        {/* Filters */}
        <div className="w-full max-w-7xl mx-auto px-2">
          <div className="flex flex-wrap gap-2">
            {["All", "Open", "Awaiting your reply", "Closed"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors ${selectedFilters.includes(filter)
                    ? "bg-blue-600 text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 min-h-0">
          <div 
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 sm:space-y-2 px-2 overscroll-contain pb-4"
          >
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="bg-[#161616] rounded-lg p-3 sm:p-4 lg:p-5 cursor-pointer transition-colors hover:bg-[#1F1F1F]"
              >
                <div className="flex justify-between items-start mb-2 min-w-0">
                  {/* Ticket Title */}
                  <h3 className="text-white font-medium text-sm md:text-base flex-1 min-w-0 line-clamp-2 pr-2">
                    {ticket.subject}
                  </h3>
                </div>

                {/* Timestamps with time */}
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap mb-2">
                  <div className="flex items-center gap-1">
                    <span>Created:</span>
                    <span className="text-gray-300">{ticket.createdAt || ticket.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Updated:</span>
                    <span className="text-gray-300">{ticket.updatedAt || ticket.date}</span>
                  </div>
                </div>

                {/* Status Badge - Below timestamps */}
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No tickets found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewTicketModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitTicket} />

      {selectedTicket && (
        <TicketView
          ticket={selectedTicket}
          onClose={handleCloseTicketView}
          onUpdateTicket={handleUpdateTicket}
          onCloseTicket={handleCloseTicket}
        />
      )}

      <ConfirmCloseModal
        isOpen={!!closeConfirmModal}
        onClose={() => setCloseConfirmModal(null)}
        onConfirm={confirmCloseTicket}
        ticket={closeConfirmModal}
      />
    </div>
  )
}

export default Tickets
