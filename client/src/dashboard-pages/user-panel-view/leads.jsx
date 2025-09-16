"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Search,
  X,
  AlertTriangle,
  Info,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Users,
  Lock,
  CalendarIcon,
} from "lucide-react"
import Draggable from "react-draggable"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { AddContractModal } from "../../components/lead-components/add-contract-modal"
import AddLeadModal from "../../components/lead-user-panel-components/add-lead-modal"
import EditLeadModal from "../../components/lead-user-panel-components/edit-lead-modal"
import ViewLeadDetailsModal from "../../components/lead-user-panel-components/view-lead-details-modal"
import ConfirmationModal from "../../components/lead-user-panel-components/confirmation-modal"
import EditColumnModal from "../../components/lead-user-panel-components/edit-column-modal"
import TrialTrainingModal from "../../components/lead-user-panel-components/add-trial-planning"
import { IoIosMenu } from "react-icons/io"
import { SidebarArea } from "../../components/lead-user-panel-components/leads-custom-sidebar"
import { useNavigate } from "react-router-dom"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { MdHistory } from "react-icons/md"
import LeadHistoryModal from "../../components/lead-user-panel-components/lead-history-modal"
import TrialAppointmentModal from "../../components/lead-user-panel-components/trial-appointment-modal"
import EditTrialModal from "../../components/lead-user-panel-components/edit-trial-modal"
import DeleteConfirmationModal from "../../components/lead-user-panel-components/delete-confirmation-modal"



const LeadCard = ({
  lead,
  onViewDetails,
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  columnId,
  onDragStop,
  index,
  memberRelations,
  setShowHistoryModal,
  setSelectedLead,
  onManageTrialAppointments,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const noteRef = useRef(null)
  const menuRef = useRef(null)
  const nodeRef = useRef(null) // Ref for the draggable node

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

  // Calculate relations count
  const hasRelationsCount = Object.values(memberRelations[lead.id] || {}).flat().length

  // Determine button based on column
  const isInTrialColumn = columnId === "trial"

  return (
    <Draggable
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onStop={handleDragStop}
      // Removed position={{ x: 0, y: 0 }} to allow react-draggable to manage its own position
      cancel=".no-drag"
    >
      <div
        ref={nodeRef}
        className={`bg-[#1C1C1C] rounded-xl p-3 sm:p-4 mb-3 cursor-grab min-h-[120px] sm:min-h-[140px] ${
          isDragging ? "opacity-70 z-50 shadow-lg absolute" : "opacity-100"
        }`}
        data-lead-id={lead.id}
      >
        <div className="flex items-center mb-2 sm:mb-3 relative">
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${
                lead.specialNote.isImportant ? "bg-red-500 " : "bg-blue-500 "
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] z-10 cursor-pointer no-drag`} // Added no-drag to prevent drag initiation
              onClick={(e) => {
                e.stopPropagation()
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
          {isNoteOpen && hasValidNote && (
            <div
              ref={noteRef}
              className="absolute left-0 top-6 w-64 sm:w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[200] no-drag"
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
                      <Calendar size={12} /> Valid from {new Date(lead.specialNote.startDate).toLocaleDateString()} to{" "}
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
            </div>
          )}
          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
            {/* Always display relations line, even if count is 0, and make it clickable to edit */}
            <div className="mt-2">
              <div
                className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer no-drag" // Added no-drag here to allow clicks without triggering drag
                onClick={() => onEditLead(lead, "relations")} // Changed to onEditLead and added 'relations' tab
              >
                <Users size={12} /> Relations ({hasRelationsCount})
              </div>
            </div>
          </div>
          {/* Three-dot menu */}
          <div className="absolute top-0 right-0">
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
                    setSelectedLead(lead) // Add this line to set the selected lead
                    setShowHistoryModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <MdHistory size={18} /> View History
                </button>
                <button
                  onClick={() => {
                    onDeleteLead(lead.id)
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
        <div className="flex justify-center">
          {isInTrialColumn ? (
            <div className="flex items-center w-full gap-2">
              <button
                onClick={() => onCreateContract(lead)}
                className="bg-[#FF843E] hover:bg-[#E64D2E] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
              >
                Create Contract
              </button>
              <button
                onClick={() => onManageTrialAppointments(lead)}
                className="text-white bg-black cursor-pointer rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors no-drag text-sm flex items-center justify-center"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddTrial(lead)}
              className="bg-[#3F74FF] hover:bg-[#3A6AE6] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
            >
              Add Trial Training
            </button>
          )}
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
  onAddTrial,
  onCreateContract,
  onEditLead,
  onDeleteLead,
  onDragStop,
  isEditable,
  onEditColumn,
  columnRef,
  memberRelations,
  setShowHistoryModal, // Add this to the props
  setSelectedLead, // Add this to the props - THIS WAS MISSING
  onManageTrialAppointments,
}) => {
  const isTrialColumn = id === "trial"

  return (
    <div
      ref={columnRef}
      id={`column-${id}`}
      className="bg-[#141414] rounded-xl overflow-hidden h-full flex flex-col min-h-[300px] sm:min-h-[400px]"
      data-column-id={id}
    >
      <div className="p-2 sm:p-3 flex justify-between items-center" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
            <h3 className="font-medium text-white text-xs sm:text-sm">{title}</h3>
          </div>

          {isTrialColumn && <Lock size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />}
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
      <div className="p-2 sm:p-3 flex-1 min-h-[250px] sm:min-h-[400px]">
        {leads.map((lead, index) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onViewDetails={onViewDetails}
            onAddTrial={onAddTrial}
            onCreateContract={onCreateContract}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
            columnId={id}
            onDragStop={onDragStop}
            index={index}
            memberRelations={memberRelations}
            setShowHistoryModal={setShowHistoryModal}
            setSelectedLead={setSelectedLead} // NOW PASSING setSelectedLead TO LeadCard
            onManageTrialAppointments={onManageTrialAppointments}
          />
        ))}
      </div>
    </div>
  )
}

export default function LeadManagement() {
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "#3b82f6", isFixed: true },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState([])
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false)
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDeleteId, setLeadToDeleteId] = useState(null)
  const navigate = useNavigate()
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [selectedEditTab, setSelectedEditTab] = useState("details") // New state for EditLeadModal tab

  const [isTrialAppointmentModalOpen, setIsTrialAppointmentModalOpen] = useState(false)
  const [isEditTrialModalOpen, setIsEditTrialModalOpen] = useState(false)
  const [isDeleteTrialConfirmationModalOpen, setIsDeleteTrialConfirmationModalOpen] = useState(false)
  const [selectedTrialAppointment, setSelectedTrialAppointment] = useState(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  // Relations states - enhanced for leads
  const [memberRelations, setMemberRelations] = useState({
    h1: {
      family: [
        { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
        { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
      ],
      friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }],
      relationship: [],
      work: [{ name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" }],
      other: [],
    },
    h2: {
      family: [],
      friendship: [],
      relationship: [{ name: "Marie Smith", relation: "Partner", id: 301, type: "member" }],
      work: [],
      other: [],
    },
  })

  // Relations functionality
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  // Available members/leads for relations
  const availableMembersLeads = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  // Relation options by category
  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  // Relations functions
  const handleAddRelation = () => {
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all fields")
      return
    }
    const relationId = Date.now()
    const updatedRelations = { ...memberRelations }
    if (!updatedRelations[selectedLead.id]) {
      updatedRelations[selectedLead.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }
    updatedRelations[selectedLead.id][newRelation.category].push({
      id: relationId,
      name: newRelation.name,
      relation: newRelation.relation,
      type: newRelation.type,
    })
    setMemberRelations(updatedRelations)
    setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelation = (category, relationId) => {
    const updatedRelations = { ...memberRelations }
    updatedRelations[selectedLead.id][category] = updatedRelations[selectedLead.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  const columnRefs = useRef({})
  useEffect(() => {
    columns.forEach((column) => {
      if (!columnRefs.current[column.id]) {
        columnRefs.current[column.id] = React.createRef()
      }
    })
  }, [columns])

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
      source: "Social Media Ads",
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
      company: "Fitness Pro", // Added for contract pre-selection
      interestedIn: "Premium", // Added for contract pre-selection
      birthday: "1990-05-20", // Added for ViewLeadDetailsModal
      address: "123 Main St, Anytown, USA", // Added for ViewLeadDetailsModal
      country: "USA",
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
      company: "Wellness Hub", // Added for contract pre-selection
      interestedIn: "Basic", // Added for contract pre-selection
      birthday: "1988-11-10", // Added for ViewLeadDetailsModal
      address: "456 Oak Ave, Otherville, USA", // Added for ViewLeadDetailsModal
      country: "USA",
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
      source: "Email Campaign",
      status: "trial",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
      columnId: "trial",
      company: "Gym Central", // Added for contract pre-selection
      interestedIn: "Bronze", // Added for contract pre-selection
      birthday: "1995-03-01", // Added for ViewLeadDetailsModal
      address: "789 Pine Ln, Anycity, USA", // Added for ViewLeadDetailsModal
      country: "USA",
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
      source: "Website",
      status: "uninterested",
      createdAt: "2025-02-01T11:20:00Z",
      specialNote: {
        text: "Requested follow-up in 3 months - not ready to commit now.",
        isImportant: true,
        startDate: "2025-02-01",
        endDate: "2025-05-01",
      },
      columnId: "uninterested",
      company: "Active Life", // Added for contract pre-selection
      interestedIn: "Basic", // Added for contract pre-selection
      birthday: "1992-07-18", // Added for ViewLeadDetailsModal
      address: "101 Elm St, Smalltown, USA", // Added for ViewLeadDetailsModal
      country: "USA",
      leadId: "LEAD-004",
    },
  ]
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

  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead)
    setIsViewDetailsModalOpen(true)
  }

  const handleAddTrialTraining = (lead) => {
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
  }

  const handleCreateContract = (lead) => {
    setSelectedLead(lead)
    setIsCreateContractModalOpen(true)
  }

  const handleEditLead = (lead, tab = "details") => {
    setSelectedLead(lead)
    setSelectedEditTab(tab) // Set the tab
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
      company: data.company || "", // Added
      interestedIn: data.interestedIn || "", // Added
      birthday: data.birthday || null, // Added
      address: data.address || "", // Added
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
              text: data.specialNote?.text || "",
              isImportant: data.specialNote?.isImportant || false,
              startDate: data.specialNote?.startDate || null,
              endDate: data.specialNote?.endDate || null,
            },
            company: data.company || lead.company, // Added
            interestedIn: data.interestedIn || lead.interestedIn, // Added
            birthday: data.birthday || lead.birthday, // Added
            address: data.address || lead.address, // Added
          }
        : lead,
    )
    setLeads(updatedLeads)
    // Only update localStorage with non-hardcoded leads
    const localStorageLeads = updatedLeads.filter((lead) => lead.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))
    toast.success("Lead has been updated")
  }

  const handleEditColumn = (id, title, color) => {
    setSelectedColumn({ id, title, color })
    setIsEditColumnModalOpen(true)
  }

  const handleSaveColumn = (data) => {
    const updatedColumns = columns.map((column) =>
      column.id === data.id ? { ...column, title: data.title, color: data.color } : column,
    )
    setColumns(updatedColumns)

    setIsEditColumnModalOpen(false)
    setSelectedColumn(null)

    toast.success("Column saved successfully")
  }

  const [dragConfirmation, setDragConfirmation] = useState({
    isOpen: false,
    type: "", // 'toTrial' or 'fromTrial'
    lead: null,
    sourceColumnId: "",
    targetColumnId: "",
    targetIndex: -1,
    onConfirm: null,
    onCancel: null,
  })

  const [specialNoteModal, setSpecialNoteModal] = useState({
    isOpen: false,
    lead: null,
    targetColumnId: "",
    onSave: null,
  })

  const handleDragStop = (e, data, lead, sourceColumnId, index) => {
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

    // If we found a target column and it's different from source
    if (targetColumnId && targetColumnId !== sourceColumnId) {
      const leadCards = targetColumnElement.querySelectorAll('[data-column-id="' + targetColumnId + '"] > div > div')
      let targetIndex = -1
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

      // Check if dragging TO trial column
      if (targetColumnId === "trial") {
        setDragConfirmation({
          isOpen: true,
          type: "toTrial",
          lead,
          sourceColumnId,
          targetColumnId,
          targetIndex,
          onConfirm: () => {
            setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
            // Open trial training modal
            setSelectedLead(lead)
            setIsTrialModalOpen(true)
          },
          onCancel: () => {
            setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
            // Lead stays in original position - no action needed
          },
        })
        return
      }

      // Check if dragging FROM trial column
      if (sourceColumnId === "trial") {
        setDragConfirmation({
          isOpen: true,
          type: "fromTrial",
          lead,
          sourceColumnId,
          targetColumnId,
          targetIndex,
          onConfirm: () => {
            setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
            // Open special note modal
            setSpecialNoteModal({
              isOpen: true,
              lead,
              targetColumnId,
              onSave: (specialNote) => {
                // Move the lead with special note
                moveLeadWithNote(lead, sourceColumnId, targetColumnId, targetIndex, specialNote)
                setSpecialNoteModal((prev) => ({ ...prev, isOpen: false }))
              },
            })
          },
          onCancel: () => {
            setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
            // Lead stays in original position - no action needed
          },
        })
        return
      }

      // Normal drag and drop for other columns
      moveLeadToColumn(lead, sourceColumnId, targetColumnId, targetIndex)
    }
  }

  const moveLeadToColumn = (lead, sourceColumnId, targetColumnId, targetIndex) => {
    const updatedLeads = [...leads]
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

  const moveLeadWithNote = (lead, sourceColumnId, targetColumnId, targetIndex, specialNote) => {
    const updatedLeads = [...leads]

    // Find the lead to move
    const leadToMove = updatedLeads.find((l) => l.id === lead.id)

    // Remove the lead from its current position
    const filteredLeads = updatedLeads.filter((l) => l.id !== lead.id)

    // Update the lead's properties
    const updatedLead = {
      ...leadToMove,
      columnId: targetColumnId,
      hasTrialTraining: false, // Remove trial training when moving from trial column
      status: targetColumnId,
      specialNote: {
        ...leadToMove.specialNote,
        text: specialNote,
        isImportant: true,
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
      },
    }

    // Insert the lead at the target position
    filteredLeads.splice(targetIndex, 0, updatedLead)

    // Update the leads state
    setLeads(filteredLeads)

    // Update localStorage
    const localStorageLeads = filteredLeads.filter((l) => l.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))
    toast.success(`Lead moved to ${columns.find((c) => c.id === targetColumnId).title} with note`)
  }

  const handleTrialModalClose = () => {
    setIsTrialModalOpen(false)
    // If there was a pending drag operation, complete it
    if (dragConfirmation.lead && dragConfirmation.targetColumnId === "trial") {
      moveLeadToColumn(
        dragConfirmation.lead,
        dragConfirmation.sourceColumnId,
        dragConfirmation.targetColumnId,
        dragConfirmation.targetIndex,
      )
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phoneNumber?.includes(searchQuery)
    )
  })

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  const handleManageTrialAppointments = (lead) => {
    setSelectedLead(lead)
    setIsTrialAppointmentModalOpen(true)
  }

  const handleEditTrialAppointment = (appointment) => {
    setSelectedTrialAppointment(appointment)
    setIsTrialAppointmentModalOpen(false)
    setIsEditTrialModalOpen(true)
  }

  const handleDeleteTrialAppointment = (appointmentId) => {
    setAppointmentToDelete(appointmentId)
    setIsTrialAppointmentModalOpen(false)
    setIsDeleteTrialConfirmationModalOpen(true)
  }

  const handleSaveEditedTrial = (updatedAppointment) => {
    // Update the appointment in localStorage
    const storedAppointments = localStorage.getItem("trialAppointments")
    let appointments = storedAppointments ? JSON.parse(storedAppointments) : []

    appointments = appointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))

    localStorage.setItem("trialAppointments", JSON.stringify(appointments))

    // Show success message
    toast.success("Trial appointment updated successfully!")

    // Close modal and refresh
    setIsEditTrialModalOpen(false)
    setSelectedTrialAppointment(null)
  }

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      // Remove appointment from localStorage
      const storedAppointments = localStorage.getItem("trialAppointments")
      let appointments = storedAppointments ? JSON.parse(storedAppointments) : []

      appointments = appointments.filter((apt) => apt.id !== appointmentToDelete)
      localStorage.setItem("trialAppointments", JSON.stringify(appointments))

      // Show success message
      toast.success("Trial appointment deleted successfully!")

      // Close modals and reset state
      setIsDeleteTrialConfirmationModalOpen(false)
      setAppointmentToDelete(null)
    }
  }

  const getLeadsForColumn = (columnId) => {
    return filteredLeads.filter((lead) => lead.columnId === columnId)
  }

  return (
    <div
      className={`
      min-h-screen rounded-3xl p-6 bg-[#1C1C1C]
      transition-all duration-300 ease-in-out flex-1
     
    `}
    >
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
      <div className="flex md:flex-row flex-col gap-2 justify-between sm:items-center items-start mb-4 sm:mb-6">
        <div className="gap-2 w-full sm:w-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl text-white font-bold">Leads</h1>
          <div></div>
          <div className="sm:hidden block">
            <IoIosMenu
              onClick={toggleRightSidebar}
              size={25}
              className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-[#E64D2E] text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="md:inline hidden">Create Lead</span>
            {/* <span className="xs:hidden">Add</span> */}
          </button>
          <div className="sm:block hidden">
            <IoIosMenu
              onClick={toggleRightSidebar}
              size={25}
              className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="mb-4 sm:mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-h-[600px]">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            leads={filteredLeads.filter((lead) => lead.columnId === column.id)}
            onViewDetails={handleViewLeadDetails}
            onAddTrial={handleAddTrialTraining}
            onCreateContract={handleCreateContract}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
            onDragStop={handleDragStop}
            isEditable={!column.isFixed}
            onEditColumn={handleEditColumn}
            columnRef={columnRefs.current[column.id]}
            memberRelations={memberRelations}
            setShowHistoryModal={setShowHistoryModal}
            setSelectedLead={setSelectedLead} // ADD THIS LINE - this was missing!
            onManageTrialAppointments={handleManageTrialAppointments}
          />
        ))}
      </div>
      <AddLeadModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
      <SidebarArea
        isOpen={isRightSidebarOpen}
        onClose={closeSidebar}
        communications={communications}
        todos={todos}
        birthdays={birthdays}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        redirectToCommunication={redirectToCommunication}
        redirectToTodos={redirectToTodos}
        toggleDropdown={toggleDropdown}
        openDropdownIndex={openDropdownIndex}
        setEditingLink={setEditingLink}
      />

      {/* Overlay for mobile screens only */}
      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 " onClick={closeSidebar} />}
      <EditLeadModal
        isVisible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedLead(null)
          setSelectedEditTab("details") // Reset tab on close
        }}
        onSave={handleSaveEdit}
        leadData={selectedLead}
        memberRelations={memberRelations}
        setMemberRelations={setMemberRelations}
        // Relations props
        editingRelations={editingRelations}
        setEditingRelations={setEditingRelations}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelation={handleAddRelation}
        handleDeleteRelation={handleDeleteRelation}
        initialTab={selectedEditTab} // Pass the initial tab
      />
      <ViewLeadDetailsModal
        isVisible={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedLead(null)
        }}
        leadData={selectedLead}
        memberRelations={memberRelations}
        onEditLead={handleEditLead} // Pass onEditLead
      />
      <TrialTrainingModal
        isOpen={isTrialModalOpen}
        onClose={handleTrialModalClose}
        selectedLead={selectedLead}
        trialTypes={[
          { name: "Cardio", duration: 30 },
          { name: "Strength", duration: 45 },
          { name: "Flexibility", duration: 60 },
        ]}
        freeTimeSlots={[
          // Monday
          { id: "slot1", date: "2025-09-08", time: "09:00" },
          { id: "slot2", date: "2025-09-08", time: "10:30" },
          { id: "slot3", date: "2025-09-08", time: "14:00" },
          { id: "slot4", date: "2025-09-08", time: "16:00" },

          // Tuesday
          { id: "slot5", date: "2025-09-09", time: "08:00" },
          { id: "slot6", date: "2025-09-09", time: "11:00" },
          { id: "slot7", date: "2025-09-09", time: "15:30" },
          { id: "slot8", date: "2025-09-09", time: "17:00" },

          // Wednesday
          { id: "slot9", date: "2025-09-10", time: "09:30" },
          { id: "slot10", date: "2025-09-10", time: "12:00" },
          { id: "slot11", date: "2025-09-10", time: "14:30" },

          // Thursday
          { id: "slot12", date: "2025-09-11", time: "10:00" },
          { id: "slot13", date: "2025-09-11", time: "13:00" },
          { id: "slot14", date: "2025-09-11", time: "16:30" },

          // Friday
          { id: "slot15", date: "2025-09-12", time: "08:30" },
          { id: "slot16", date: "2025-09-12", time: "11:30" },
          { id: "slot17", date: "2025-09-12", time: "15:00" },

          // Saturday
          { id: "slot18", date: "2025-09-13", time: "09:00" },
          { id: "slot19", date: "2025-09-13", time: "12:30" },
          { id: "slot20", date: "2025-09-13", time: "14:00" },
        ]}
        availableMembersLeads={availableMembersLeads}
        relationOptions={{
          family: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse"],
          friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
          relationship: ["Partner", "Boyfriend", "Girlfriend", "Ex-Partner"],
          work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
          other: ["Neighbor", "Roommate", "Mentor", "Student", "Other"],
        }}
      />

      {isCreateContractModalOpen && (
        <AddContractModal
          onClose={() => {
            setIsCreateContractModalOpen(false)
            setSelectedLead(null)
          }}
          onSave={(contractData) => {
            toast.success("Contract created successfully!")
            setIsCreateContractModalOpen(false)
            setSelectedLead(null)
          }}
          leadData={
            selectedLead
              ? {
                  id: selectedLead.id,
                  name: `${selectedLead.firstName} ${selectedLead.surname}`,
                  email: selectedLead.email,
                  phone: selectedLead.phoneNumber,
                  company: selectedLead.company, // Ensure company is passed
                  interestedIn: selectedLead.interestedIn, // Ensure interestedIn is passed
                }
              : null
          }
        />
      )}

      {showHistoryModal && <LeadHistoryModal lead={selectedLead} onClose={() => setShowHistoryModal(false)} />}

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

      {/* Confirmation dialog for drag operations */}
      {dragConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1C1C1C] w-[95%] sm:w-[90%] md:w-[400px] max-w-md rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              {dragConfirmation.type === "toTrial" ? "Book Trial Training?" : "Move Lead from Trial Training?"}
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              {dragConfirmation.type === "toTrial"
                ? `Do you want to book a trial training for ${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""}?`
                : `Are you sure you want to move ${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""} from Trial Training Arranged?`}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={dragConfirmation.onCancel}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={dragConfirmation.onConfirm}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special note modal for moving from trial column */}
      {specialNoteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1C1C1C] w-[95%] sm:w-[90%] md:w-[500px] max-w-lg rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Add Special Note</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Please enter the reason for moving {specialNoteModal.lead?.firstName}{" "}
              {specialNoteModal.lead?.surname || ""} from Trial Training Arranged:
            </p>
            <textarea
              id="specialNoteText"
              className="w-full bg-[#101010] text-white rounded-lg p-3 mb-3 sm:mb-4 min-h-[80px] sm:min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter reason for moving from trial training..."
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setSpecialNoteModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const noteText = document.getElementById("specialNoteText").value
                  if (noteText.trim()) {
                    specialNoteModal.onSave(noteText.trim())
                  } else {
                    toast.error("Please enter a reason for moving the lead")
                  }
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save & Move
              </button>
            </div>
          </div>
        </div>
      )}

      <TrialAppointmentModal
        isOpen={isTrialAppointmentModalOpen}
        onClose={() => {
          setIsTrialAppointmentModalOpen(false)
          setSelectedLead(null)
        }}
        lead={selectedLead}
        onEditTrial={handleEditTrialAppointment}
        onDeleteTrial={handleDeleteTrialAppointment}
      />

      <EditTrialModal
        isOpen={isEditTrialModalOpen}
        onClose={() => {
          setIsEditTrialModalOpen(false)
          setSelectedTrialAppointment(null)
        }}
        appointment={selectedTrialAppointment}
        trialTypes={[]} // You can pass your trial types here
        freeTimeSlots={[]} // You can pass your time slots here
        availableMembersLeads={[]} // You can pass your members/leads here
        onSave={handleSaveEditedTrial}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteTrialConfirmationModalOpen}
        onClose={() => {
          setIsDeleteTrialConfirmationModalOpen(false)
          setAppointmentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Trial Appointment"
        message="Are you sure you want to delete this trial appointment? This action cannot be undone."
      />
    </div>
  )
}
