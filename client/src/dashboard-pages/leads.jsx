"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, AlertTriangle, Info, Calendar, MoreVertical, Edit, Trash2, Plus, Users } from "lucide-react"
import Draggable from "react-draggable"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/avatar.png"
import { AddContractModal } from "../components/contract-components/add-contract-modal"
import AddLeadModal from "../components/lead-user-panel-components/add-lead-modal"
import EditLeadModal from "../components/lead-user-panel-components/edit-lead-modal"
import ViewLeadDetailsModal from "../components/lead-user-panel-components/view-lead-details-modal"
import ConfirmationModal from "../components/lead-user-panel-components/confirmation-modal"
import EditColumnModal from "../components/lead-user-panel-components/edit-column-modal"
import TrialTrainingModal from "../components/lead-user-panel-components/add-trial-planning"
import { IoIosMenu } from "react-icons/io"
import { SidebarArea } from "../components/custom-sidebar"
import { useNavigate } from "react-router-dom"
import Rectangle1 from "../../public/Rectangle 1.png"

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
}) => {
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

  const isNoteValid = (note) => {
    if (!note || !note.text) return false
    if (!note.startDate || !note.endDate) return true
    const now = new Date()
    const startDate = new Date(note.startDate)
    const endDate = new Date(note.endDate)
    return now >= startDate && now <= endDate
  }

  const hasValidNote = lead.specialNote && lead.specialNote.text && lead.specialNote.text.trim() !== ""

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragStop = (e, data) => {
    setIsDragging(false)
    onDragStop(e, data, lead, columnId, index)
  }

  // Check if lead has relations
  const hasRelations =
    memberRelations[lead.id] && Object.values(memberRelations[lead.id]).some((relations) => relations.length > 0)

  // Determine button based on column
  const isInTrialColumn = columnId === "trial"

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
        className={`bg-[#1C1C1C] rounded-xl p-4 mb-3 cursor-grab min-h-[140px] ${
          isDragging ? "opacity-70 z-[9999] shadow-lg fixed" : "opacity-100"
        }`}
      >
        <div className="flex items-center mb-3 relative">
          {hasValidNote && (
            <div
              className={`absolute -top-2 -left-2 ${
                lead.specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-1 shadow-[0_0_0_1.5px_#1C1C1C] cursor-pointer no-drag z-10`}
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
              className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[200] no-drag"
            >
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
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{lead.specialNote.text}</p>
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

          <div className="flex-1 mt-6">
            <h4 className="font-medium text-white text-lg mb-1">{`${lead.firstName} ${lead.surname}`}</h4>
            <p className="text-gray-400 text-sm">{lead.phoneNumber}</p>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            <p className="text-gray-500 text-xs">
              Created: {lead.createdAt ? formatDate(lead.createdAt) : "Unknown date"}
            </p>
            {hasRelations && (
              <div className="mt-2">
                <div className="text-xs text-blue-400 flex items-center gap-1">
                  <Users size={12} />
                  Relations ({Object.values(memberRelations[lead.id]).flat().length})
                </div>
              </div>
            )}
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
                  <Info size={14} />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEditLead(lead)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDeleteLead(lead.id)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          {isInTrialColumn ? (
            <button
              onClick={() => onCreateContract(lead)}
              className="bg-[#FF843E] hover:bg-[#E6753A] text-white text-xs rounded-xl px-4 py-2 w-full no-drag"
            >
              Create Contract
            </button>
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
      <div className="p-3 flex-1 min-h-[400px]">
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
          />
        ))}
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
      status: "trial",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
      columnId: "trial",
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
              text: data.specialNote?.text || "",
              isImportant: data.specialNote?.isImportant || false,
              startDate: data.specialNote?.startDate || null,
              endDate: data.specialNote?.endDate || null,
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

    // If we found a target column
    if (targetColumnId) {
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

      <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center items-start mb-6">
        <div className="gap-2 w-full md:w-auto flex justify-between items-center ">
          <h1 className="text-2xl text-white font-bold">Leads</h1>
          <div></div>
          <div className="md:hidden block">
            <IoIosMenu
              onClick={toggleRightSidebar}
              size={25}
              className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF5733] hover:bg-[#E64D2E] text-sm text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={16} />
            Create Lead
          </button>
          <div className="md:block hidden">
            <IoIosMenu
              onClick={toggleRightSidebar}
              size={25}
              className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search leads by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}></div>}

      <EditLeadModal
        isVisible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedLead(null)
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
      />

      <ViewLeadDetailsModal
        isVisible={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedLead(null)
        }}
        leadData={selectedLead}
        memberRelations={memberRelations}
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
                }
              : null
          }
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

      <ConfirmationModal
        isVisible={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={confirmDeleteLead}
        message="Are you sure you want to delete this lead?"
      />
    </div>
  )
}
