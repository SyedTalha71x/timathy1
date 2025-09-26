import React from "react"
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Search, X, AlertTriangle, Info, Calendar, MoreVertical, Edit, Trash2, Settings, Plus } from 'lucide-react'
import Draggable from "react-draggable"
import { AddLeadModal } from "../../components/customer-dashboard/lead-components/add-lead-modal"
import ViewLeadDetailsModal from "../../components/customer-dashboard/lead-components/view-lead-details"
import { AddLeadContractModal } from "../../components/customer-dashboard/lead-components/add-lead-contract-modal"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { EditLeadModal } from "../../components/customer-dashboard/lead-components/edit-lead-modal"
import { createPortal } from "react-dom"
import WebsiteLinkModal from "../../components/customer-dashboard/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/customer-dashboard/myarea-components/widgets"
import Sidebar from "../../components/customer-dashboard/central-sidebar"
import ConfirmationModal from "../../components/customer-dashboard/myarea-components/confirmation-modal"
import { IoIosMenu } from "react-icons/io"

const LeadCard = ({ lead, onViewDetails, onCreateContract, onEditLead, onDeleteLead, columnId, onDragStop, index }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const noteRef = useRef(null)
  const menuRef = useRef(null)
  const nodeRef = useRef(null)

  // Handle clicking outside the note popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setIsNoteOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isNoteOpen || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isNoteOpen, isMenuOpen])

  // Format date helper function
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const hasValidNote = lead.specialNote && lead.specialNote.text && lead.specialNote.text.trim() !== ""

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragStop = (e, data) => {
    setIsDragging(false)
    onDragStop(e, data, lead, columnId, index)
  }
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })


  return (
    <Draggable
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onStop={handleDragStop}
      position={{ x: 0, y: 0 }}
      cancel=".no-drag"
    >
      <div
        ref={nodeRef}
        className={`bg-[#1C1C1C] rounded-xl p-3 sm:p-4 mb-3 cursor-grab min-h-[120px] sm:min-h-[140px] ${isDragging ? "opacity-70 z-[9999] relative" : "opacity-100"
          }`}
        style={{
          zIndex: isDragging ? 9999 : "auto",
          position: isDragging ? "absolute" : "static",

        }}
        data-lead-id={lead.id}
      >
        <div className="flex items-center mb-3 relative">
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${lead.specialNote.isImportant ? "bg-red-500 " : "bg-blue-500 "
                } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] z-10 cursor-pointer no-drag`} // Added no-drag to prevent drag initiation
              onClick={(e) => {
                e.stopPropagation()
                const rect = e.currentTarget.getBoundingClientRect()
                setNotePosition({
                  top: rect.bottom + window.scrollY + 8, // thora neeche kholna
                  left: rect.left + window.scrollX,      // same column ke left se align
                })
                setIsNoteOpen(!isNoteOpen)
              }}

            >
              {lead.specialNote.isImportant ? (
                <AlertTriangle size={18} className="text-white" />
              ) : (
                <Info size={18} className="text-white" />
              )}
            </div>
          )}
          {isNoteOpen && hasValidNote &&
            createPortal(
              <div
                ref={noteRef}
                className="fixed w-64 sm:w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999] no-drag"
                style={{
                  top: notePosition.top,
                  left: notePosition.left,
                  position: "absolute",
                }}
              >
                <div className="bg-gray-800 p-2 sm:p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
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
                <div className="p-3">
                  <p className="text-white text-sm leading-relaxed">{lead.specialNote.text}</p>
                  {lead.specialNote.startDate && lead.specialNote.endDate ? (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <Calendar size={12} /> Valid from{" "}
                        {new Date(lead.specialNote.startDate).toLocaleDateString()} to{" "}
                        {new Date(lead.specialNote.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <Calendar size={12} /> Always valid
                      </p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )
          }


          <div className="flex-1 mt-6">
            <h5 className="font-bold text-lg mb-1 text-white min-h-[28px]">{lead.studioName || "No Studio Name"}</h5>
            <h4 className="font-medium text-gray-200">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCreateContract(lead)}
            className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
          >
            Create Contract
          </button>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md cursor-pointer bg-black text-white no-drag"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-8 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-lg shadow-lg z-50 w-40 no-drag"
              >
                <button
                  onClick={() => {
                    onViewDetails(lead)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <Info size={14} /> View Details
                </button>
                <button
                  onClick={() => {
                    onEditLead(lead)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${lead.firstName} ${lead.surname}?`)) {
                      onDeleteLead(lead.id)
                    }
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

const Column = ({
  id,
  title,
  color,
  leads,
  onViewDetails,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  onDragStop,
  isEditable,
  onEditColumn,
  columnRef,
}) => {
  return (
    <div
      ref={columnRef}
      id={`column-${id}`}
      className="bg-[#141414] rounded-xl overflow-hidden h-full flex flex-col"
      data-column-id={id}
    >
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

      <div className="p-3 flex-1 min-h-[400px] overflow-y-auto">
        {leads.map((lead, index) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onViewDetails={onViewDetails}
            onCreateContract={onCreateContract}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
            columnId={id}
            onDragStop={onDragStop}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

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

const ConfirmationModalLeads = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 text-white">{message}</h3>
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

export default function LeadManagement() {
  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "#3b82f6" },
  ])

  // Default lead sources
  const defaultSources = [
    "Website",
    "Google Ads",
    "Social Media Ads",
    "Email Campaign",
    "Cold Call (Outbound)",
    "Inbound Call",
    "Event",
    "Offline Advertising",
    "Other",
  ]

  // States from original component
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState([])
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDeleteId, setLeadToDeleteId] = useState(null)
  const [isSourceConfigModalOpen, setIsSourceConfigModalOpen] = useState(false)
  const [leadSources, setLeadSources] = useState(defaultSources)

  //sidebar related logic and states 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic



  const columnRefs = useRef({})

  useEffect(() => {
    columns.forEach((column) => {
      if (!columnRefs.current[column.id]) {
        columnRefs.current[column.id] = React.createRef()
      }
    })
  }, [columns])

  // Load lead sources from localStorage
  useEffect(() => {
    const storedSources = localStorage.getItem("leadSources")
    if (storedSources) {
      setLeadSources(JSON.parse(storedSources))
    }
  }, [])

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
      source: "Website",
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
      studioName: "Studio Name XYZ..",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      country: "USA",
      website: "https://example.com",
      leadId: "LEAD-001",
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
      source: "Google Ads",
      status: "passive",
      createdAt: "2025-01-20T14:45:00Z",
      specialNote: {
        text: "Has dietary restrictions - needs specialized nutrition plan.",
        isImportant: false,
        startDate: "2025-01-20",
        endDate: "2025-04-20",
      },
      columnId: "passive",
      studioName: "Studio Name XYZ..",
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "Los Angeles",
      country: "USA",
      website: "https://sarahwilson.com",
      leadId: "LEAD-002",
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
      source: "Social Media Ads",
      status: "active",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
      columnId: "active",
      studioName: "Studio Name XYZ..",
      street: "789 Pine Rd",
      zipCode: "54321",
      city: "Chicago",
      country: "USA",
      website: "https://michaelbrown.fitness",
      leadId: "LEAD-003",
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
      source: "Email Campaign",
      status: "uninterested",
      createdAt: "2025-02-01T11:20:00Z",
      specialNote: {
        text: "Requested follow-up in 3 months - not ready to commit now.",
        isImportant: true,
        startDate: "2025-02-01",
        endDate: "2025-05-01",
      },
      columnId: "uninterested",
      studioName: "",
      street: "321 Elm St",
      zipCode: "98765",
      city: "Miami",
      country: "USA",
      website: "https://emmadavis.com",
      leadId: "LEAD-004",
    },
  ]

  // Load and combine leads on component mount
  useEffect(() => {
    const storedLeads = localStorage.getItem("leads")
    let combinedLeads = [...hardcodedLeads]

    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map((lead) => ({
        ...lead,
        source: lead.source || "Other",
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

  const handleCreateContract = (lead) => {
    setSelectedLead(lead)
    setIsContractModalOpen(true)
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
      source: data.source || "Other",
      status: data.status || "passive",
      columnId: data.hasTrialTraining ? "trial" : data.status || "passive",
      createdAt: now,
      studioName: data.studioName,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city,
      country: data.country,
      website: data.website,
      about: data.about,
      leadId: `LEAD-${Date.now()}`,
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
          source: data.source || lead.source || "Other",
          status: data.status || lead.status,
          columnId: data.hasTrialTraining ? "trial" : data.status || lead.columnId,
          studioName: data.studioName,
          street: data.street,
          zipCode: data.zipCode,
          city: data.city,
          country: data.country,
          website: data.website,
          about: data.about,
          specialNote: data.specialNote && data.specialNote.text ? {
            text: data.specialNote.text,
            isImportant: data.specialNote.isImportant,
            startDate: data.specialNote.startDate || null,
            endDate: data.specialNote.endDate || null,
          } : null,
        }
        : lead,
    )

    setLeads(updatedLeads)

    // Only update localStorage with non-hardcoded leads
    const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))

    toast.success("Lead has been updated")
  }

  const handleSaveContract = (contractData) => {
    // Handle contract saving logic here
    toast.success("Contract has been created")
    setIsContractModalOpen(false)
    setSelectedLead(null)
  }

  // Handle drag and drop
  const handleDragStop = (e, data, lead, sourceColumnId, index) => {
    // Get the position of the dragged element
    const draggedElem = e.target
    const draggedRect = draggedElem.getBoundingClientRect()
    const draggedCenterX = draggedRect.left + draggedRect.width / 2
    const draggedCenterY = draggedRect.top + draggedRect.height / 2

    // Find which column the element is over
    let targetColumnId = null
    let targetColumnElement = null

    for (const [columnId, columnRef] of Object.entries(columnRefs.current)) {
      if (columnRef.current) {
        const columnRect = columnRef.current.getBoundingClientRect()

        if (
          draggedCenterX >= columnRect.left &&
          draggedCenterX <= columnRect.right &&
          draggedCenterY >= columnRect.top &&
          draggedCenterY <= columnRect.bottom
        ) {
          targetColumnId = columnId
          targetColumnElement = columnRef.current
          break
        }
      }
    }

    // If we found a target column
    if (targetColumnId) {
      // Get all lead cards in the target column
      const leadCards = targetColumnElement.querySelectorAll('[data-column-id="' + targetColumnId + '"] > div > div')
      let targetIndex = -1

      // Find the target index based on position
      for (let i = 0; i < leadCards.length; i++) {
        const cardRect = leadCards[i].getBoundingClientRect()
        const cardCenterY = cardRect.top + cardRect.height / 2

        if (draggedCenterY < cardCenterY) {
          targetIndex = i
          break
        }
      }

      // If no target index found, append to the end
      if (targetIndex === -1) {
        targetIndex = leadCards.length
      }

      // Create a copy of the leads array
      const updatedLeads = [...leads]

      // If moving to a different column
      if (targetColumnId !== sourceColumnId) {
        // If dropping into trial column, set hasTrialTraining to true
        const hasTrialTraining = targetColumnId === "trial"

        // Find the lead to move
        const leadToMove = updatedLeads.find((l) => l.id === lead.id)

        // Remove the lead from its current position
        const filteredLeads = updatedLeads.filter((l) => l.id !== lead.id)

        // Update the lead's properties
        const updatedLead = {
          ...leadToMove,
          columnId: targetColumnId,
          hasTrialTraining: hasTrialTraining || leadToMove.hasTrialTraining,
          status: targetColumnId !== "trial" ? targetColumnId : leadToMove.status,
        }

        // Insert the lead at the target position
        filteredLeads.splice(targetIndex, 0, updatedLead)

        // Update the leads state
        setLeads(filteredLeads)

        // Update localStorage
        const localStorageLeads = filteredLeads.filter((l) => l.source === "localStorage")
        localStorage.setItem("leads", JSON.stringify(localStorageLeads))

        toast.success(`Lead moved to ${columns.find((c) => c.id === targetColumnId).title}`)
      }
    }
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

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
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

      {isRightSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { setIsRightSidebarOpen(false) }} />
      )}

      <div className="flex gap-2 justify-between md:items-center items-start mb-6">
        <div className="flex justify-between items-center md:w-auto w-full">

          <h1 className="text-2xl text-white font-bold">Leads</h1>
          <div onClick={toggleRightSidebar} className="cursor-pointer lg:hidden md:hidden block text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
            <IoIosMenu size={26} />
          </div>
        </div>
        <div className="flex gap-2">

          <div className="flex items-center gap-2">


            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF843E] cursor-pointer text-white px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="open_sans_font">Create Lead</span>
            </button>
            <div onClick={toggleRightSidebar} className="cursor-pointer lg:block md:block hidden text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
              <IoIosMenu size={26} />
            </div>
          </div>

        </div>

      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search leads by name, email, phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
        />
      </div>

      {/* All columns in one line as requested */}
      <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 gap-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            leads={filteredLeads.filter((lead) => lead.columnId === column.id)}
            onViewDetails={handleViewLeadDetails}
            onCreateContract={handleCreateContract}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
            onDragStop={handleDragStop}
            isEditable={true}
            onEditColumn={handleEditColumn}
            columnRef={columnRefs.current[column.id]}
          />
        ))}
      </div>

      {/* Modals */}
      <AddLeadModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        leadSources={leadSources}
      />

      {isEditModalOpen && (
        <EditLeadModal
          isVisible={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedLead(null)
          }}
          onSave={handleSaveEdit}
          leadData={selectedLead}
          leadSources={leadSources}
        />
      )}

      {isViewDetailsModalOpen && (
        <ViewLeadDetailsModal
          leadData={selectedLead}
          onClose={() => {
            setIsViewDetailsModalOpen(false)
            setSelectedLead(null)
          }}
        />
      )}

      {isContractModalOpen && (
        <AddLeadContractModal
          onClose={() => {
            setIsContractModalOpen(false)
            setSelectedLead(null)
          }}
          onSave={handleSaveContract}
          leadData={selectedLead}
        />
      )}

      <EditColumnModal
        isVisible={isEditColumnModalOpen}
        onClose={() => {
          setIsEditColumnModalOpen(false)
          setSelectedColumn(null)
        }}
        column={selectedColumn}
        onSave={handleSaveColumn}
      />


      <ConfirmationModalLeads
        isVisible={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={confirmDeleteLead}
        message="Are you sure you want to delete this lead?"
      />
      {/* sidebar related modals */}

      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}
    </div>
  )
}