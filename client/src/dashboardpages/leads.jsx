/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, AlertTriangle, Info, Calendar, MoreVertical, Edit, Trash2, Plus, Users } from "lucide-react"
import Draggable from "react-draggable"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/avatar.png"
import { AddContractModal } from "../components/contract-components/add-contract-modal"
import TrialTrainingModal from "../components/lead-components/add-trial"

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

const ConfirmationModal = ({ isVisible, onClose, onConfirm, message }) => {
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

const AddLeadModal = ({ isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "passive",
    hasTrialTraining: false,
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "passive",
      hasTrialTraining: false,
      note: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
    })
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
            >
              <option value="active">Active prospect</option>
              <option value="passive">Passive prospect</option>
              <option value="uninterested">Uninterested</option>
              <option value="missed">Missed Call</option>
            </select>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-200 font-medium">Special Note</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noteImportance"
                  checked={formData.noteImportance === "important"}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      noteImportance: e.target.checked ? "important" : "unimportant",
                    })
                  }}
                  className="mr-2 h-4 w-4 accent-[#FF843E]"
                />
                <label htmlFor="noteImportance" className="text-sm text-gray-200">
                  Important
                </label>
              </div>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
              placeholder="Enter special note..."
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.noteStartDate}
                  onChange={(e) => setFormData({ ...formData, noteStartDate: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.noteEndDate}
                  onChange={(e) => setFormData({ ...formData, noteEndDate: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
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
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditLeadModal = ({ isVisible, onClose, onSave, leadData, memberRelations, setMemberRelations }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "passive",
    hasTrialTraining: false,
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
  })

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

  useEffect(() => {
    if (leadData) {
      setFormData({
        firstName: leadData.firstName || "",
        lastName: leadData.surname || "",
        email: leadData.email || "",
        phone: leadData.phoneNumber || "",
        status: leadData.status || "passive",
        hasTrialTraining: leadData.hasTrialTraining || false,
        note: leadData.specialNote?.text || "",
        noteImportance: leadData.specialNote?.isImportant ? "important" : "unimportant",
        noteStartDate: leadData.specialNote?.startDate || "",
        noteEndDate: leadData.specialNote?.endDate || "",
      })
    }
  }, [leadData])

  const handleAddRelation = () => {
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    const updatedRelations = { ...memberRelations }
    if (!updatedRelations[leadData.id]) {
      updatedRelations[leadData.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }

    updatedRelations[leadData.id][newRelation.category].push({
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
    updatedRelations[leadData.id][category] = updatedRelations[leadData.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: leadData.id,
      surname: formData.lastName,
      phoneNumber: formData.phone,
      specialNote: {
        text: formData.note,
        isImportant: formData.noteImportance === "important",
        startDate: formData.noteStartDate,
        endDate: formData.noteEndDate,
      },
    })
    onClose()
  }

  if (!isVisible || !leadData) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
            >
              <option value="active">Active prospect</option>
              <option value="passive">Passive prospect</option>
              <option value="uninterested">Uninterested</option>
              <option value="missed">Missed Call</option>
            </select>
          </div>

          {/* Relations Section */}
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-200 font-medium">Relations</label>
              <button
                type="button"
                onClick={() => setEditingRelations(!editingRelations)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {editingRelations ? "Done" : "Edit"}
              </button>
            </div>
            {editingRelations && (
              <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <select
                    value={newRelation.type}
                    onChange={(e) => {
                      const type = e.target.value
                      setNewRelation({ ...newRelation, type, name: "", selectedMemberId: null })
                    }}
                    className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="member">Select Member</option>
                    <option value="lead">Select Lead</option>
                  </select>
                  {newRelation.type === "manual" ? (
                    <input
                      type="text"
                      placeholder="Name"
                      value={newRelation.name}
                      onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                      className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                    />
                  ) : (
                    <select
                      value={newRelation.selectedMemberId || ""}
                      onChange={(e) => {
                        const selectedId = e.target.value
                        const selectedPerson = availableMembersLeads.find((p) => p.id.toString() === selectedId)
                        setNewRelation({
                          ...newRelation,
                          selectedMemberId: selectedId,
                          name: selectedPerson ? selectedPerson.name : "",
                        })
                      }}
                      className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select {newRelation.type}</option>
                      {availableMembersLeads
                        .filter((p) => p.type === newRelation.type)
                        .map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.name} ({person.type})
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={newRelation.category}
                    onChange={(e) => setNewRelation({ ...newRelation, category: e.target.value, relation: "" })}
                    className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="family">Family</option>
                    <option value="friendship">Friendship</option>
                    <option value="relationship">Relationship</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={newRelation.relation}
                    onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
                    className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Relation</option>
                    {relationOptions[newRelation.category]?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddRelation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                >
                  Add Relation
                </button>
              </div>
            )}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {leadData &&
                memberRelations[leadData.id] &&
                Object.entries(memberRelations[leadData.id]).map(([category, relations]) =>
                  relations.map((relation) => (
                    <div key={relation.id} className="flex items-center justify-between bg-[#101010] rounded px-3 py-2">
                      <div className="text-sm">
                        <span className="text-white">{relation.name}</span>
                        <span className="text-gray-400 ml-2">({relation.relation})</span>
                        <span className="text-blue-400 ml-2 capitalize">- {category}</span>
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded ${
                            relation.type === "member"
                              ? "bg-green-600 text-green-100"
                              : relation.type === "lead"
                                ? "bg-blue-600 text-blue-100"
                                : "bg-gray-600 text-gray-100"
                          }`}
                        >
                          {relation.type}
                        </span>
                      </div>
                      {editingRelations && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRelation(category, relation.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )),
                )}
            </div>
          </div>

          <div className="border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-200 font-medium">Special Note</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noteImportance"
                  checked={formData.noteImportance === "important"}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      noteImportance: e.target.checked ? "important" : "unimportant",
                    })
                  }}
                  className="mr-2 h-4 w-4 accent-[#FF843E]"
                />
                <label htmlFor="noteImportance" className="text-sm text-gray-200">
                  Important
                </label>
              </div>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
              placeholder="Enter special note..."
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.noteStartDate}
                  onChange={(e) => setFormData({ ...formData, noteStartDate: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.noteEndDate}
                  onChange={(e) => setFormData({ ...formData, noteEndDate: e.target.value })}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
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

const ViewLeadDetailsModal = ({ isVisible, onClose, leadData, memberRelations }) => {
  const [activeTab, setActiveTab] = useState("details")

  if (!isVisible || !leadData) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Lead Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("relations")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "relations" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Relations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="space-y-4 text-white">
            <div className="flex items-center gap-4">
              <img src={leadData.avatar || Avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-semibold">
                  {leadData.firstName} {leadData.surname}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-900 text-blue-300 capitalize">
                    {leadData.status || "Lead"}
                  </span>
                  {leadData.hasTrialTraining && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-900 text-green-300">
                      Trial Training Arranged
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{leadData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p>{leadData.phoneNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Created Date</p>
              <p>{leadData.createdAt ? new Date(leadData.createdAt).toLocaleDateString() : "Unknown"}</p>
            </div>
            {leadData.specialNote && leadData.specialNote.text && (
              <div>
                <p className="text-sm text-gray-400">Special Note</p>
                <p>{leadData.specialNote.text}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Importance: {leadData.specialNote.isImportant ? "Important" : "Unimportant"}
                </p>
                {leadData.specialNote.startDate && leadData.specialNote.endDate && (
                  <p className="text-sm text-gray-400">
                    Valid from: {leadData.specialNote.startDate} to {leadData.specialNote.endDate}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "relations" && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Relations Tree Visualization */}
            <div className="bg-[#161616] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
              <div className="flex flex-col items-center space-y-8">
                {/* Central Lead */}
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                  {leadData.firstName} {leadData.surname}
                </div>
                {/* Connection Lines and Categories */}
                <div className="relative w-full">
                  {/* Horizontal line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                  {/* Category sections */}
                  <div className="grid grid-cols-5 gap-4 pt-8">
                    {Object.entries(memberRelations[leadData.id] || {}).map(([category, relations]) => (
                      <div key={category} className="flex flex-col items-center space-y-4">
                        {/* Vertical line */}
                        <div className="w-0.5 h-8 bg-gray-600"></div>
                        {/* Category header */}
                        <div
                          className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                            category === "family"
                              ? "bg-yellow-600 text-yellow-100"
                              : category === "friendship"
                                ? "bg-green-600 text-green-100"
                                : category === "relationship"
                                  ? "bg-red-600 text-red-100"
                                  : category === "work"
                                    ? "bg-blue-600 text-blue-100"
                                    : "bg-gray-600 text-gray-100"
                          }`}
                        >
                          {category}
                        </div>
                        {/* Relations in this category */}
                        <div className="space-y-2">
                          {relations.map((relation) => (
                            <div
                              key={relation.id}
                              className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${
                                relation.type === "member" || relation.type === "lead"
                                  ? "border border-blue-500/30"
                                  : ""
                              }`}
                              onClick={() => {
                                if (relation.type === "member" || relation.type === "lead") {
                                  toast.info(`Clicked on ${relation.name} (${relation.type})`)
                                }
                              }}
                            >
                              <div className="text-white text-sm font-medium">{relation.name}</div>
                              <div className="text-gray-400 text-xs">({relation.relation})</div>
                              <div
                                className={`text-xs mt-1 px-1 py-0.5 rounded ${
                                  relation.type === "member"
                                    ? "bg-green-600 text-green-100"
                                    : relation.type === "lead"
                                      ? "bg-blue-600 text-blue-100"
                                      : "bg-gray-600 text-gray-100"
                                }`}
                              >
                                {relation.type}
                              </div>
                            </div>
                          ))}
                          {relations.length === 0 && (
                            <div className="text-gray-500 text-xs text-center">No relations</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Relations List */}
            <div className="bg-[#161616] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
              <div className="space-y-4">
                {Object.entries(memberRelations[leadData.id] || {}).map(([category, relations]) => (
                  <div key={category}>
                    <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {relations.length > 0 ? (
                        relations.map((relation) => (
                          <div
                            key={relation.id}
                            className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${
                              relation.type === "member" || relation.type === "lead"
                                ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                : ""
                            }`}
                            onClick={() => {
                              if (relation.type === "member" || relation.type === "lead") {
                                toast.info(`Clicked on ${relation.name} (${relation.type})`)
                              }
                            }}
                          >
                            <div>
                              <span className="text-white font-medium">{relation.name}</span>
                              <span className="text-gray-400 ml-2">- {relation.relation}</span>
                              <span
                                className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                  relation.type === "member"
                                    ? "bg-green-600 text-green-100"
                                    : relation.type === "lead"
                                      ? "bg-blue-600 text-blue-100"
                                      : "bg-gray-600 text-gray-100"
                                }`}
                              >
                                {relation.type}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No {category} relations</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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

  // Relations states - copied from Members component
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
        <h1 className="text-2xl text-white font-bold">Leads</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5733] hover:bg-[#E64D2E] text-sm text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} />
          Create Lead
        </button>
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
        memberRelations={memberRelations}
        setMemberRelations={setMemberRelations}
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
