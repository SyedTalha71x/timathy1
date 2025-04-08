/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Search, X, AlertTriangle, Info, Calendar } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { AddLeadModal } from "../components/add-lead-modal"
import { EditLeadModal } from "../components/edit-lead-modal"
import { ViewLeadDetailsModal } from "../components/view-lead-details"
import TrialTrainingModal from "../components/add-trial"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/avatar.png"

// Lead Card Component
const LeadCard = ({ lead, onViewDetails, onAddTrial, onEditLead, onDeleteLead, columnId, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "LEAD",
    item: { id: lead.id, sourceColumnId: columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const noteRef = useRef(null)

  // Handle clicking outside the note popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setIsNoteOpen(false)
      }
    }

    if (isNoteOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isNoteOpen])

  // Format date helper function
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Check if note is valid (within date range)
  const isNoteValid = (note) => {
    if (!note || !note.text) return false

    if (!note.startDate || !note.endDate) return true

    const now = new Date()
    const startDate = new Date(note.startDate)
    const endDate = new Date(note.endDate)

    return now >= startDate && now <= endDate
  }

  const hasValidNote = lead.specialNote && isNoteValid(lead.specialNote)

  return (
    <div ref={drag} className={`bg-[#1C1C1C] rounded-xl p-4 mb-3 ${isDragging ? "opacity-50" : "opacity-100"}`}>
      <div className="flex items-center mb-3 relative">
        {hasValidNote && (
          <div
            className={`absolute -top-2 -left-2 ${lead.specialNote.isImportant ? "bg-red-500" : "bg-blue-500"} rounded-full p-0.5 shadow-[0_0_0_1.5px_#1C1C1C] cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation()
              setIsNoteOpen(!isNoteOpen)
            }}
          >
            {lead.specialNote.isImportant ? (
              <AlertTriangle size={14} className="text-white" />
            ) : (
              <Info size={14} className="text-white" />
            )}
          </div>
        )}

        {isNoteOpen && hasValidNote && (
          <div
            ref={noteRef}
            className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-50"
          >
            {/* Header section with icon and title */}
            <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
              {lead.specialNote.isImportant ? (
                <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
              ) : (
                <Info className="text-blue-500 shrink-0" size={18} />
              )}
              <h4 className="text-white flex gap-1 items-center font-medium">
                <div>Special Note</div>
                <div className="text-sm text-gray-400">
                  {lead.specialNote.isImportant ? "(Important)" : "(Unimportant)"}
                </div>
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsNoteOpen(false)
                }}
                className="ml-auto text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Note content */}
            <div className="p-3">
              <p className="text-white text-sm leading-relaxed">{lead.specialNote.text}</p>

              {/* Date validity section */}
              {lead.specialNote.startDate && lead.specialNote.endDate ? (
                <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                  <p className="text-xs text-gray-300 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Valid from {new Date(lead.specialNote.startDate).toLocaleDateString()} to{" "}
                    {new Date(lead.specialNote.endDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                  <p className="text-xs text-gray-300 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Always valid
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <img
          src={lead.avatar || Avatar}
          alt={`${lead.firstName} ${lead.surname}'s avatar`}
          className="w-12 h-12 rounded-full mr-3 object-cover"
        />
        <div>
          <h4 className="font-medium text-white">{`${lead.firstName} ${lead.surname}`}</h4>
          <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
          <p className="text-gray-500 text-xs">
            Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          onClick={() => onAddTrial(lead)}
          className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full"
        >
          Add Trial Training
        </button>
        <button
          onClick={() => onViewDetails(lead)}
          className="text-xs rounded-xl bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 w-full"
        >
          View Details
        </button>
        <button
          onClick={() => onEditLead(lead)}
          className="text-xs rounded-xl bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 w-full"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteLead(lead.id)}
          className="text-xs rounded-xl bg-transparent border border-gray-700 text-red-500 hover:bg-gray-800 px-4 py-2 w-full"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// Column Component
const Column = ({
  id,
  title,
  color,
  leads,
  onViewDetails,
  onAddTrial,
  onEditLead,
  onDeleteLead,
  onDrop,
  isEditable,
  onEditColumn,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "LEAD",
    drop: (item) => onDrop(item.id, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div className={`bg-[#141414] rounded-xl overflow-hidden ${isOver ? "ring-2 ring-white/20" : ""}`}>
      <div className="p-3 flex justify-between items-center" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          <h3 className="font-medium text-white text-sm">{title}</h3>
        </div>
        {isEditable && (
          <button
            onClick={() => onEditColumn(id, title, color)}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg"
          >
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
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        )}
      </div>

      <div ref={drop} className="p-3 min-h-[400px]">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onViewDetails={onViewDetails}
            onAddTrial={onAddTrial}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
            columnId={id}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  )
}

// Edit Column Modal
const EditColumnModal = ({ isVisible, onClose, column, onSave }) => {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("")

  useEffect(() => {
    if (column) {
      setTitle(column.title)
      setColor(column.color)
    }
  }, [column])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ id: column.id, title, color })
  }

  if (!isVisible || !column) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Column</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-200 block mb-2">Column Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Column Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 p-1 bg-[#141414] border-gray-700 rounded"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Confirmation Modal
const ConfirmationModal = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
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

// Main Lead Management Component
export default function LeadManagement() {
  // Initial columns
  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "#3b82f6", isFixed: true },
  ])

  // States from original component
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState([])
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDeleteId, setLeadToDeleteId] = useState(null)

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
      columnId: "active",
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
      columnId: "passive",
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
      columnId: "active",
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
      columnId: "uninterested",
    },
  ]

  // Load and combine leads on component mount
  useEffect(() => {
    const storedLeads = localStorage.getItem("leads")
    let combinedLeads = [...hardcodedLeads]

    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map((lead) => ({
        ...lead,
        source: "localStorage",
        columnId: lead.columnId || (lead.hasTrialTraining ? "trial" : lead.status || "passive"),
      }))
      combinedLeads = [...hardcodedLeads, ...parsedStoredLeads]
    }

    setLeads(combinedLeads)
  }, [])

  // Handle lead actions
  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead)
    setIsViewDetailsModalOpen(true)
  }

  const handleAddTrialTraining = (lead) => {
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
  }

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setIsEditModalOpen(true)
  }

  const handleDeleteLead = (id) => {
    setLeadToDeleteId(id)
    setIsDeleteConfirmationModalOpen(true)
  }

  const confirmDeleteLead = () => {
    const leadToDelete = leads.find((lead) => lead.id === leadToDeleteId)
    const updatedLeads = leads.filter((lead) => lead.id !== leadToDeleteId)
    setLeads(updatedLeads)

    // Only update localStorage if the deleted lead was from localStorage
    if (leadToDelete?.source === "localStorage") {
      const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
      localStorage.setItem("leads", JSON.stringify(localStorageLeads))
    }

    setIsDeleteConfirmationModalOpen(false)
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
      status: data.status || "passive",
      columnId: data.hasTrialTraining ? "trial" : data.status || "passive",
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
            columnId: data.hasTrialTraining ? "trial" : data.status || lead.columnId,
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

  // Handle drag and drop
  const handleDrop = (leadId, targetColumnId) => {
    // Don't allow dropping into the same column
    const lead = leads.find((l) => l.id === leadId)
    if (lead.columnId === targetColumnId) return

    // If dropping into trial column, set hasTrialTraining to true
    const hasTrialTraining = targetColumnId === "trial"

    // Update lead's column
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          columnId: targetColumnId,
          hasTrialTraining: hasTrialTraining || lead.hasTrialTraining,
          status: targetColumnId !== "trial" ? targetColumnId : lead.status,
        }
      }
      return lead
    })

    setLeads(updatedLeads)

    // Update localStorage
    const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))

    toast.success(`Lead moved to ${columns.find((c) => c.id === targetColumnId).title}`)
  }

  // Handle column edit
  const handleEditColumn = (columnId, title, color) => {
    setSelectedColumn({ id: columnId, title, color })
    setIsEditColumnModalOpen(true)
  }

  const handleSaveColumn = (updatedColumn) => {
    setColumns(
      columns.map((col) =>
        col.id === updatedColumn.id ? { ...col, title: updatedColumn.title, color: updatedColumn.color } : col,
      ),
    )
    setIsEditColumnModalOpen(false)
    setSelectedColumn(null)
  }

  // Filter leads based on search query
  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phoneNumber?.includes(searchQuery)
    )
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto md:p-4 p-1">
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

        <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center items-start mb-6">
          <h1 className="text-2xl text-white font-bold">Interested parties</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF5733] hover:bg-[#E64D2E] text-sm text-white px-4 py-2 rounded-xl"
          >
            Add Lead
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              leads={filteredLeads.filter((lead) => lead.columnId === column.id)}
              onViewDetails={handleViewLeadDetails}
              onAddTrial={handleAddTrialTraining}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              onDrop={handleDrop}
              isEditable={!column.isFixed}
              onEditColumn={handleEditColumn}
            />
          ))}
        </div>

        {/* Modals */}
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

        <EditColumnModal
          isVisible={isEditColumnModalOpen}
          onClose={() => {
            setIsEditColumnModalOpen(false)
            setSelectedColumn(null)
          }}
          column={selectedColumn}
          onSave={handleSaveColumn}
        />

        <ConfirmationModal
          isVisible={isDeleteConfirmationModalOpen}
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          onConfirm={confirmDeleteLead}
          message="Are you sure you want to delete this lead?"
        />
      </div>
    </DndProvider>
  )
}
