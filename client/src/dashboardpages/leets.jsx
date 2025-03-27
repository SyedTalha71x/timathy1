"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Search, Tag, Circle, AlertTriangle, Info, Calendar, CalendarIcon } from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react"
import Avatar from "../../public/avatar.png"
import { AddLeadModal } from "../components/add-lead-modal"
import { EditLeadModal } from "../components/edit-lead-modal"
import { ViewLeadDetailsModal } from "../components/view-lead-details"
import toast, { Toaster } from "react-hot-toast"
import TrialTrainingModal from "../components/add-trial"

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg bg-[#141414] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#242424] transition-colors"
      >
        Previous
      </button>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              currentPage === page ? "bg-[#FF5733] text-white" : "bg-[#141414] text-white hover:bg-[#242424]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg bg-[#141414] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#242424] transition-colors"
      >
        Next
      </button>
    </div>
  )
}

const ConfirmationModal = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">{message}</h3>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

// Lead Status Badge component
const StatusBadge = ({ status }) => {
  let circleColor

  switch (status) {
    case "active":
      circleColor = "text-green-500"
      break
    case "passive":
      circleColor = "text-yellow-500"
      break
    case "uninterested":
      circleColor = "text-red-500"
      break
    default:
      circleColor = "text-gray-500"
  }

  return (
    <div className="flex items-center mt-1 text-white">
      <Circle className={`${circleColor} mr-1 h-3 w-3 fill-current`} />
      <span className="text-xs">
        {status === "active"
          ? "Active prospect"
          : status === "passive"
            ? "Passive prospect"
            : status === "uninterested"
              ? "Uninterested"
              : "Unknown"}
      </span>
    </div>
  )
}

// Format date helper function
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function LeadOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [leads, setLeads] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const leadsPerPage = 5
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDeleteId, setLeadToDeleteId] = useState(null)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)


    const notePopoverRef = useRef(null)
  
    // Effect to handle clicking outside of note popover
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
          setActiveNoteId(null)
        }
      }
  
      // Add event listener when popover is open
      if (activeNoteId !== null) {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
          document.removeEventListener("mousedown", handleClickOutside)
        }
      }
    }, [activeNoteId])
  

  // Hardcoded initial leads with status, createdAt fields, and special notes
  const hardcodedLeads = [
    {
      id: "h1",
      firstName: "John",
      surname: "Smith",
      email: "john.smith@example.com",
      phoneNumber: "+1234567890",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "hardcoded",
      status: "active",
      about: "Software Engineer",
      createdAt: "2025-01-15T10:30:00Z",
      specialNote: {
        text: "Interested in personal training sessions twice a week.",
        isImportant: false,
        startDate: "2025-01-15",
        endDate: "2025-03-15",
      },
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
      source: "hardcoded",
      status: "passive",
      createdAt: "2025-01-20T14:45:00Z",
      specialNote: {
        text: "Has dietary restrictions - needs specialized nutrition plan.",
        isImportant: false,
        startDate: "2025-01-20",
        endDate: "2025-04-20",
      },
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
      source: "hardcoded",
      status: "active",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
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
      source: "hardcoded",
      status: "uninterested",
      createdAt: "2025-02-01T11:20:00Z",
      specialNote: {
        text: "Requested follow-up in 3 months - not ready to commit now.",
        isImportant: true,
        startDate: "2025-02-01",
        endDate: "2025-05-01",
      },
    },
  ]

  // Load and combine leads on component mount
  useState(() => {
    const storedLeads = localStorage.getItem("leads")
    let combinedLeads = [...hardcodedLeads]

    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map((lead) => ({
        ...lead,
        source: "localStorage",
      }))
      combinedLeads = [...hardcodedLeads, ...parsedStoredLeads]
    }

    setLeads(combinedLeads)
  })

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
            status: data.status || lead.status,
            specialNote: {
              text: data.note || "",
              isImportant: data.noteImportance === "important",
              startDate: data.noteStartDate || null,
              endDate: data.noteEndDate || null,
            },
          }
        : lead,
    )
    setLeads(updatedLeads)

    // Only update localStorage with non-hardcoded leads
    const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))

    toast.success("Lead has been updated")
  }

  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((lead) => lead.id === id)
    const updatedLeads = leads.filter((lead) => lead.id !== id)
    setLeads(updatedLeads)

    // Only update localStorage if the deleted lead was from localStorage
    if (leadToDelete?.source === "localStorage") {
      const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
      localStorage.setItem("leads", JSON.stringify(localStorageLeads))
    }

    toast.success("Lead has been deleted")
  }

  const handleSaveLead = (data) => {
    const now = new Date().toISOString()
    const newLead = {
      id: `l${Date.now()}`,
      firstName: data.firstName,
      surname: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      trialPeriod: data.trialPeriod,
      hasTrialTraining: data.hasTrialTraining,
      avatar: data.avatar,
      source: "localStorage",
      status: data.status || "passive", // Default status
      createdAt: now,
      specialNote: {
        text: data.note || "",
        isImportant: data.noteImportance === "important",
        startDate: data.noteStartDate || null,
        endDate: data.noteEndDate || null,
      },
    }
    const updatedLeads = [...leads, newLead]
    setLeads(updatedLeads)

    // Store only localStorage leads
    const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))

    toast.success("Lead has been added")
  }

  // Special Note Icon Renderer
  const renderSpecialNoteIcon = useCallback(
    (specialNote, leadId) => {
      // If no note text, return null
      if (!specialNote.text) return null

      // Check note validity
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))

      // If note is not active, return null
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(activeNoteId === leadId ? null : leadId)
      }

      return (
        <div className="relative">
          <div
            className={`${
              specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {activeNoteId === leadId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
            >
              {/* Header section with icon and title */}
              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {specialNote.isImportant === "important" ? (
                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex gap-1 items-center font-medium">
                    <div>Special Note</div>
                    <div className="text-sm text-gray-400 ">
                      {specialNote.isImportant === "important" ? "(Important)" : "(Unimportant)"}
                    </div>
                  </h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveNoteId(null)
                    }}
                    className="ml-auto text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

              {/* Note content */}
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>

                {/* Date validity section */}
                {specialNote.startDate && specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Always valid
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [activeNoteId, setActiveNoteId],
  )

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by trial training status
    const matchesTrialFilter =
      filterOption === "all" ||
      (filterOption === "trial" && lead.hasTrialTraining) ||
      (filterOption === "notrial" && !lead.hasTrialTraining)

    // Filter by lead status
    const matchesStatusFilter = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesTrialFilter && matchesStatusFilter
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)
  const startIndex = (currentPage - 1) * leadsPerPage
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + leadsPerPage)

  // Reset to first page when filter or search changes
  useState(() => {
    setCurrentPage(1)
  }, [searchQuery, filterOption, statusFilter])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the leads list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

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

            {/* Trial Training Filter */}
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="bg-[#141414] text-sm outline-none text-white rounded-xl px-4 py-2"
            >
              <option value="all" className="text-sm">
                All Training Status
              </option>
              <option value="trial" className="text-sm">
                Trial Training Arranged
              </option>
              <option value="notrial" className="text-sm">
                Trial Training Not Agreed
              </option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141414] text-sm outline-none text-white rounded-xl px-4 py-2"
            >
              <option value="all" className="text-sm">
                All Prospects
              </option>
              <option value="active" className="text-sm">
                Active Prospects
              </option>
              <option value="passive" className="text-sm">
                Passive Prospects
              </option>
              <option value="uninterested" className="text-sm">
                Uninterested
              </option>
            </select>
          </div>

          <div className="space-y-4 bg-[#000000] p-4 rounded-xl max-w-4xl mx-auto">
            {paginatedLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-[#141414] rounded-lg p-5 flex md:flex-row flex-col items-center justify-between relative"
              >
                {/* Special Note positioned at top left */}
                {lead.specialNote && lead.specialNote.text && (
                  <div className="absolute top-2 left-2 z-10">{renderSpecialNoteIcon(lead.specialNote, lead.id)}</div>
                )}

                <div className="flex md:flex-row flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={lead.avatar || Avatar}
                      alt={`${lead.firstName} ${lead.surname}'s avatar`}
                      className="w-14 h-14 rounded-full bg-zinc-800"
                    />
                    {/* Removed the special note icon from here */}
                  </div>
                  <div className="flex flex-col md:text-left text-center">
                    <span className="font-bold text-md">{`${lead.firstName} ${lead.surname}`}</span>
                    <div className="text-gray-400 text-sm">{lead.phoneNumber}</div>

                    {/* Added date information */}
                    <div className="text-gray-500 text-xs mt-1">
                      Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
                    </div>

                    {/* Status badge */}
                    <StatusBadge status={lead.status} />

                    {/* Trial training tag */}
                    {lead.hasTrialTraining ? (
                      <div className="flex items-center mt-1">
                        <Tag size={14} className="text-green-500 mr-1" />
                        <span className="text-green-500 text-xs">Trial Training Arranged</span>
                      </div>
                    ) : (
                      <div className="flex items-center mt-1">
                        <Tag size={14} className="text-yellow-500 mr-1" />
                        <span className="text-yellow-500 text-xs">Trial Training Not Agreed</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-2 md:mt-0 mt-3">
                <button
  onClick={() => {
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
  }}
  className="text-gray-300 px-4 py-2 text-sm border border-slate-400/30 transition-colors duration-500 cursor-pointer bg-[#3F74FF] rounded-xl"
>
  Add Trial Training
</button>
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
                    onClick={() => {
                      setLeadToDeleteId(lead.id)
                      setIsDeleteConfirmationModalOpen(true)
                    }}
                    className="text-red-500 px-4 py-2 text-sm border border-slate-400/30 transition-colors duration-500 cursor-pointer bg-black rounded-xl hover:bg-gray-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <TrialTrainingModal
              isOpen={isTrialModalOpen}
              onClose={() => {
                setIsTrialModalOpen(false)
                setSelectedLead(null)
              }}
              selectedLead={selectedLead}
              trialTypes={[
                { name: "Cardio", duration: 30 },
                { name: "Strength", duration: 45 },
                { name: "Flexibility", duration: 60 },
              ]}
              freeTimeSlots={[
                { id: "slot1", date: "2023-10-01", time: "10:00" },
                { id: "slot2", date: "2023-10-01", time: "11:00" },
                { id: "slot3", date: "2023-10-02", time: "14:00" },
              ]}
            />

            {filteredLeads.length > 0 ? (
              <>
                {filteredLeads.length > leadsPerPage ? (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                ) : null}
              </>
            ) : (
              <div className="text-red-600 text-center text-sm cursor-pointer">Sorry, No Lead found</div>
            )}
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

        <ConfirmationModal
          isVisible={isDeleteConfirmationModalOpen}
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          onConfirm={() => {
            handleDeleteLead(leadToDeleteId)
            setIsDeleteConfirmationModalOpen(false)
          }}
          message="Are you sure you want to delete this lead?"
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
                <button className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200">
                  <X size={16} />
                </button>
                <h3 className="mb-2">{notification.heading}</h3>
                <p className="text-sm text-zinc-400">{notification.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

