/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Search, Plus, X } from "lucide-react"
import TicketView from "../../components/studio-components/tickets-components/TicketView"
import NewTicketModal from "../../components/studio-components/tickets-components/NewTicketModal"
import { useSelector, useDispatch } from "react-redux"
import {
  createTicketThunk,
  fetchTicketThunk,
  updateTicketThunk,
  isClosedTicketThunk
} from '../../features/supportCenter/supportSlice'

const Tickets = () => {
  // ✅ Fix: Properly handle the ticket data structure
  const supportState = useSelector((state) => state.support) || {}
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // ✅ Ensure tickets is always an array
  const tickets = Array.isArray(supportState.ticket) ? supportState.ticket : []
  const loading = supportState.loading || false
  const error = supportState.error || null

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [closeConfirmModal, setCloseConfirmModal] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState(["All"])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  useEffect(() => {
    dispatch(fetchTicketThunk())
  }, [dispatch])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.metaKey) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (closeConfirmModal) {
          setCloseConfirmModal(null);
        } else if (selectedTicket) {
          setSelectedTicket(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
        return;
      }

      const anyModalOpen = isModalOpen || selectedTicket || closeConfirmModal;
      if (anyModalOpen) return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleNewTicketClick();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, selectedTicket, closeConfirmModal]);

  const handleNewTicketClick = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  // ✅ Fixed handleSubmitTicket - Accepts FormData
  const handleSubmitTicket = async (formData) => {
    try {
      // Debug: Log FormData contents
      console.log('Submitting ticket with FormData:')
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      }

      await dispatch(createTicketThunk(formData)).unwrap()
      await dispatch(fetchTicketThunk()).unwrap()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create ticket:', error)
      alert(error.message || 'Failed to create ticket. Please try again.')
    }
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleCloseTicketView = () => {
    setSelectedTicket(null)
  }

  // ✅ Fixed handleUpdateTicket - Accepts reply data
  const handleUpdateTicket = async (ticket, replyText, uploadedImagesBySupport) => {
    try {
      const ticketId = ticket._id

      // Create FormData for update
      const formData = new FormData()
      formData.append('replyText', replyText)

      // Append image if uploaded
      if (uploadedImagesBySupport && uploadedImagesBySupport.length > 0 && uploadedImagesBySupport[0]) {
        formData.append('uploadedImagesBySupport', uploadedImagesBySupport[0])
      }

      // Dispatch update thunk
      await dispatch(updateTicketThunk({ id: ticketId, updateData: formData })).unwrap()

      // Refresh tickets list
      await dispatch(fetchTicketThunk()).unwrap()

    } catch (error) {
      console.error('Failed to update ticket:', error)
      throw error
    }
  }

  // Handle close ticket
  const handleCloseTicket = (ticket) => {
    setCloseConfirmModal(ticket)
  }

  // ✅ Fixed confirmCloseTicket
  const confirmCloseTicket = async () => {
    if (closeConfirmModal) {
      try {
        const ticketId = closeConfirmModal._id

        await dispatch(isClosedTicketThunk(ticketId)).unwrap()
        await dispatch(fetchTicketThunk()).unwrap()

        setCloseConfirmModal(null)

        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(null)
        }
      } catch (error) {
        console.error('Failed to close ticket:', error)
        alert(error.message || 'Failed to close ticket')
      }
    }
  }

  const getStatusColor = (status) => {
    // Handle both string and boolean status
    const statusLower = String(status).toLowerCase()

    if (status === true || statusLower === "close" || statusLower === "closed") {
      return "bg-gray-600 text-white"
    }

    switch (statusLower) {
      case "open":
        return "bg-green-600 text-white"
      case "in-progress":
      case "in progress":
        return "bg-blue-600 text-white"
      case "awaiting":
      case "awaiting your reply":
        return "bg-yellow-600 text-white"
      case "resolved":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-600 text-white"
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

  // ✅ Fixed filteredTickets - Now includes "In-Progress" filter
  const filteredTickets = tickets && tickets.length > 0 ? tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.createdBy?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.createdBy?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())

    // Get display status for filter matching
    let ticketDisplayStatus = "Open"
    
    if (ticket.isClosed) {
      ticketDisplayStatus = "Closed"
    } else if (ticket.status === "in-progress" || ticket.status === "in progress" || ticket.status === "In Progress") {
      ticketDisplayStatus = "In-Progress"
    } else if (ticket.status === "awaiting" || ticket.status === "awaiting your reply") {
      ticketDisplayStatus = "Awaiting your reply"
    } else if (ticket.status === "open" || ticket.status === "Open") {
      ticketDisplayStatus = "Open"
    } else if (ticket.status === "resolved") {
      ticketDisplayStatus = "Resolved"
    }

    // Check if filter matches
    const matchesFilter = selectedFilters.includes("All") ||
      selectedFilters.includes(ticketDisplayStatus)

    return matchesSearch && matchesFilter
  }) : []

  const ConfirmCloseModal = ({ isOpen, onClose, onConfirm, ticket }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-card text-content-primary rounded-xl p-6 w-full max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-content-primary">Close Ticket</h3>
          <p className="text-content-secondary mb-6">
            Are you sure you want to close ticket "{ticket?.subject}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Close Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen rounded-3xl bg-surface-base text-content-primary overflow-hidden">
      {/* Loading State */}
      {loading && tickets.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-content-secondary">Loading tickets...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load tickets: {error}</p>
            <button
              onClick={() => dispatch(fetchTicketThunk())}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          <div className="flex-shrink-0 pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-8">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-content-primary text-center mb-4 sm:mb-6 oxanium_font">
              Tickets
            </h1>
            <p className="text-lg sm:text-xl text-content-secondary text-center mb-6 sm:mb-8 open_sans_font">
              Contact us for a fast Response
            </p>

            {/* Search Bar with Create Button */}
            <div className="w-full max-w-7xl mx-auto mb-4 sm:mb-6 px-2">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-faint" size={16} />
                  <input
                    type="text"
                    placeholder="Search Tickets..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors placeholder-content-faint"
                  />
                </div>

                <div className="hidden md:block relative group flex-shrink-0">
                  <button
                    onClick={handleNewTicketClick}
                    className="flex bg-primary hover:bg-primary-hover text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Create Ticket</span>
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">Create Ticket</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                      C
                    </span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters - Added In-Progress */}
            <div className="w-full max-w-7xl mx-auto px-2">
              <div className="flex flex-wrap gap-1.5 sm:gap-3">
                {["All", "Open", "In-Progress", "Awaiting your reply", "Closed"].map((filter) => {
                  const isSelected = selectedFilters.includes(filter);
                  const buttonClasses = isSelected
                    ? "bg-primary text-white"
                    : "bg-surface-button text-content-secondary hover:bg-surface-button-hover";

                  return (
                    <button
                      key={filter}
                      onClick={() => handleFilterClick(filter)}
                      className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${buttonClasses}`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-8 pb-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 sm:space-y-2 px-2 overscroll-contain pb-4">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    // Determine display status for the ticket
                    let displayStatus = "Open"
                    let statusValue = ticket.status || "open"
                    
                    if (ticket.isClosed) {
                      displayStatus = "Closed"
                    } else if (statusValue === "in-progress" || statusValue === "in progress") {
                      displayStatus = "In-Progress"
                    } else if (statusValue === "awaiting" || statusValue === "awaiting your reply") {
                      displayStatus = "Awaiting your reply"
                    } else if (statusValue === "resolved") {
                      displayStatus = "Resolved"
                    } else if (statusValue === "open") {
                      displayStatus = "Open"
                    }
                    
                    return (
                      <div
                        key={ticket._id}
                        onClick={() => handleTicketClick(ticket)}
                        className="bg-surface-card rounded-lg p-3 sm:p-4 lg:p-5 cursor-pointer transition-colors hover:bg-surface-hover border border-border-subtle hover:border-border"
                      >
                        <div className="flex justify-between items-start mb-2 min-w-0">
                          <h3 className="text-content-primary font-medium text-sm md:text-base flex-1 min-w-0 line-clamp-2 pr-2 open_sans_font">
                            {ticket.subject} <span className="text-primary font-semibold">#{ticket._id?.slice(-6)}</span>
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-content-faint flex-wrap mb-2 open_sans_font">
                          <div className="flex items-center gap-1">
                            <span>Created:</span>
                            <span className="text-content-secondary">
                              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-GB") : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Updated:</span>
                            <span className="text-content-secondary">
                              {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString("en-GB") : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>By:</span>
                            <span className="text-content-secondary">
                              {ticket.createdBy?.firstName || ticket.createdBy?.email || "System"}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.isClosed || ticket.status)}`}>
                          {displayStatus}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-content-faint open_sans_font">
                    <p>No tickets found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <NewTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTicket}
      />

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

      <button
        onClick={handleNewTicketClick}
        className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label="Create Ticket"
      >
        <Plus size={22} />
      </button>
    </div>
  )
}

export default Tickets