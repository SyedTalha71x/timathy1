/* eslint-disable no-unused-vars */
import { X, Search, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import Avatar from "../../public/avatar.png"
import { AddLeadModal } from "../components/add-lead-modal"
import { EditLeadModal } from "../components/edit-lead-modal"
import { ViewLeadDetailsModal } from "../components/view-lead-details"

export default function Leets() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [leads, setLeads] = useState([])

  // Hardcoded initial leads
  const hardcodedLeads = [
    {
      id: "h1", // Adding 'h' prefix to distinguish hardcoded leads
      firstName: "John",
      surname: "Smith",
      email: "john.smith@example.com",
      phoneNumber: "+1234567890",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "hardcoded"
    },
    {
      id: "h2",
      firstName: "Sarah",
      surname: "Wilson",
      email: "sarah.wilson@example.com",
      phoneNumber: "+1987654321",
      trialPeriod: "Trial Period",
      hasTrialTraining: false,
      avatar: Avatar,
      source: "hardcoded"
    },
    {
      id: "h3",
      firstName: "Michael",
      surname: "Brown",
      email: "michael.brown@example.com",
      phoneNumber: "+1122334455",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "hardcoded"
    },
    {
      id: "h4",
      firstName: "Emma",
      surname: "Davis",
      email: "emma.davis@example.com",
      phoneNumber: "+1555666777",
      trialPeriod: "Trial Period",
      hasTrialTraining: false,
      avatar: Avatar,
      source: "hardcoded"
    },
  ]

  // Load and combine leads on component mount
  useEffect(() => {
    const storedLeads = localStorage.getItem('leads')
    let combinedLeads = [...hardcodedLeads]
    
    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map(lead => ({
        ...lead,
        source: "localStorage"
      }))
      combinedLeads = [...hardcodedLeads, ...parsedStoredLeads]
    }
    
    setLeads(combinedLeads)
  }, [])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 2,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ])

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setIsEditModalOpen(true)
  }

  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead)
    setIsViewDetailsModalOpen(true)
  }

  const handleSaveEdit = (data) => {
    const updatedLeads = leads.map((lead) =>
      lead.id === data.id
        ? {
            ...lead,
            firstName: data.firstName,
            surname: data.surname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            trialPeriod: data.trialPeriod,
            hasTrialTraining: data.hasTrialTraining,
            avatar: data.avatar,
          }
        : lead
    )
    setLeads(updatedLeads)
    
    // Only update localStorage with non-hardcoded leads
    const localStorageLeads = updatedLeads.filter(lead => lead.source === "localStorage")
    localStorage.setItem('leads', JSON.stringify(localStorageLeads))
  }

  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find(lead => lead.id === id)
    const updatedLeads = leads.filter((lead) => lead.id !== id)
    setLeads(updatedLeads)
    
    // Only update localStorage if the deleted lead was from localStorage
    if (leadToDelete?.source === "localStorage") {
      const localStorageLeads = updatedLeads.filter(lead => lead.source === "localStorage")
      localStorage.setItem('leads', JSON.stringify(localStorageLeads))
    }
  }

  const handleSaveLead = (data) => {
    const newLead = {
      id: `l${Date.now()}`, // 'l' prefix for localStorage leads
      firstName: data.firstName,
      surname: data.surname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      trialPeriod: data.trialPeriod,
      hasTrialTraining: data.hasTrialTraining,
      avatar: data.avatar,
      source: "localStorage"
    }
    const updatedLeads = [...leads, newLead]
    setLeads(updatedLeads)
    
    // Store only localStorage leads
    const localStorageLeads = updatedLeads.filter(lead => lead.source === "localStorage")
    localStorage.setItem('leads', JSON.stringify(localStorageLeads))
  }

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterOption === "all" || (filterOption === "trial" && lead.hasTrialTraining)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen relative">
      <main className="flex-1 min-w-0 p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-0 mb-6">
          <h2 className="text-xl md:text-2xl oxanium_font font-bold">Interested parties</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF5733] lg:text-sm text-xs w-full text-center hover:bg-[#E64D2E] text-white px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200 flex justify-center items-center gap-1"
            >
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="bg-[#141414] text-sm outline-none text-white rounded-xl px-4 py-2"
          >
            <option value="all" className="text-sm">All Leads</option>
            <option value="trial" className="text-sm">Trial Training Arranged</option>
          </select>
        </div>

        <div className="space-y-4 bg-[#000000] p-4 rounded-xl max-w-4xl mx-auto">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-[#141414] rounded-lg p-5 flex md:flex-row flex-col items-center justify-between"
            >
              <div className="flex md:flex-row flex-col items-center gap-3">
                <img
                  src={lead.avatar || "/placeholder.svg"}
                  alt={`${lead.firstName} ${lead.surname}'s avatar`}
                  className="w-14 h-14 rounded-full bg-zinc-800"
                />
                <div className="flex flex-col md:text-left text-center">
                  <span className="font-bold text-md">{`${lead.firstName} ${lead.surname}`}</span>
                  <div className="text-gray-400 text-sm">{lead.email}</div>
                  <div className="text-gray-400 text-sm">{lead.phoneNumber}</div>
                  {lead.hasTrialTraining && (
                    <div className="flex items-center mt-1">
                      <Tag size={14} className="text-green-500 mr-1" />
                      <span className="text-green-500 text-xs">Trial Training Arranged</span>
                    </div>
                  )}
                  {/* <div className="text-xs text-gray-500 mt-1">
                    Source: {lead.source === "hardcoded" ? "Default" : "Added"}
                  </div> */}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-2 md:mt-0 mt-3">
                <button
                  onClick={() => handleViewLeadDetails(lead)}
                  className="text-gray-300 px-4 py-2 text-sm border border-slate-400/30 transition-colors duration-500 cursor-pointer bg-black rounded-xl hover:bg-gray-800"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEditLead(lead)}
                  className="text-gray-300 px-4 py-2 text-sm border border-slate-400/30 transition-colors duration-500 cursor-pointer bg-black rounded-xl hover:bg-gray-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="text-red-500 px-4 py-2 text-sm border border-slate-400/30 transition-colors duration-500 cursor-pointer bg-black rounded-xl hover:bg-gray-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AddLeadModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />

      <EditLeadModal
        isVisible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedLead(null)
        }}
        onSave={handleSaveEdit}
        leadData={selectedLead}
      />

      <ViewLeadDetailsModal
        isVisible={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedLead(null)
        }}
        leadData={selectedLead}
      />

      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:block lg:rounded-3xl
          transform ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
          <button onClick={() => setIsRightSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative transform transition-all duration-200 hover:scale-[1.02]"
            >
              <button
                // onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2">{notification.heading}</h3>
              <p className="text-sm text-zinc-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}