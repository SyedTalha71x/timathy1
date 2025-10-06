import { useState } from "react"
import { Search } from "react-feather"
import TicketView from "../../components/user-panel-components/help-center-components/TicketView"
import NewTicketModal from "../../components/user-panel-components/help-center-components/NewTicketModal"
import { sampleTickets } from "../../utils/user-panel-states/help-center-states"



const HelpCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState(sampleTickets)
  const [searchQuery, setSearchQuery] = useState("")

  const handleNewTicketClick = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleSubmitTicket = (subject, reason, additionalDescription, images, isBold, isItalic) => {
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
          images: images,
          isBold: isBold,
          isItalic: isItalic,
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
    setTickets((prevTickets) => prevTickets.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket)))
    setSelectedTicket(updatedTicket)
  }

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "Open":
  //       return "bg-green-100 text-green-800"
  //     case "Awaiting your reply":
  //       return "bg-yellow-100 text-yellow-800"
  //     case "Closed":
  //       return "bg-gray-100 text-gray-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  const filteredTickets = tickets.filter((ticket) => ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col min-h-screen rounded-3xl bg-[#1C1C1C] text-white">
      <div className="flex-shrink-0 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16">
          Contact us for a fast Response
        </h1>

        {/* <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 text-center w-full max-w-xs sm:max-w-sm border border-gray-200">
            <div className="flex justify-center items-center mb-3 sm:mb-4">
              <MdOutlineHelpCenter className="text-black" size={32} />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-1">Help Center</h2>
            <p className="text-gray-600 text-sm sm:text-base">View Help Articles</p>
          </div>
        </div> */}

        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
        <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    <input
      type="search"
      placeholder="Search Tickets...."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="h-11 bg-[#181818] text-white rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF] leading-none"
    />
  </div>

          <button
            onClick={handleNewTicketClick}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm  rounded-xl hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
          >
            New ticket
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          <div className="overflow-y-auto custom-scrollbar space-y-2 sm:space-y-3 px-2" style={{ maxHeight: "calc(3 * 120px)" }}>
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="bg-[#161616] rounded-lg p-3 sm:p-4 lg:p-5 cursor-pointer  transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium text-sm md:text-base truncate pr-2">
                    {ticket.subject}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">{ticket.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center bg-blue-600 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium `}
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

      {selectedTicket && (
        <TicketView ticket={selectedTicket} onClose={handleCloseTicketView} onUpdateTicket={handleUpdateTicket} />
      )}
    </div>
  )
}

export default HelpCenter
