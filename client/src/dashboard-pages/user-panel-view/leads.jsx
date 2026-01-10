/* eslint-disable no-unused-vars */
import React from "react"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Plus, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

// @dnd-kit imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

// Components
import { AddContractModal } from "../../components/user-panel-components/lead-user-panel-components/add-contract-modal"
import AddLeadModal from "../../components/user-panel-components/lead-user-panel-components/add-lead-modal"
import EditLeadModal from "../../components/user-panel-components/lead-user-panel-components/edit-lead-modal"
import ViewLeadDetailsModal from "../../components/user-panel-components/lead-user-panel-components/view-lead-details-modal"
import ConfirmationModal from "../../components/user-panel-components/lead-user-panel-components/confirmation-modal"
import EditColumnModal from "../../components/user-panel-components/lead-user-panel-components/edit-column-modal"
import TrialTrainingModal from "../../components/user-panel-components/lead-user-panel-components/add-trial-planning"
import LeadHistoryModal from "../../components/user-panel-components/lead-user-panel-components/lead-history-modal"
import TrialAppointmentModal from "../../components/user-panel-components/lead-user-panel-components/trial-appointment-modal"
import EditTrialModal from "../../components/user-panel-components/lead-user-panel-components/edit-trial-modal"
import DeleteConfirmationModal from "../../components/user-panel-components/lead-user-panel-components/delete-confirmation-modal"
import { LeadDocumentModal } from "../../components/user-panel-components/lead-user-panel-components/document-management-modal"
import AssessmentFormModal from "../../components/user-panel-components/lead-user-panel-components/assessment-form-modal"
import AssessmentSelectionModal from "../../components/user-panel-components/lead-user-panel-components/assessment-selection-modal"
import ContractPromptModal from "../../components/user-panel-components/lead-user-panel-components/contract-prompt-modal"
import { LeadSpecialNoteModal } from "../../components/user-panel-components/lead-user-panel-components/special-note-modal"

// New DnD components
import SortableColumn from "../../components/user-panel-components/lead-user-panel-components/sortable-column"
import SortableLeadCard from "../../components/user-panel-components/lead-user-panel-components/sortable-lead-card"

// Data and hooks
import { hardcodedLeads, memberRelationsLeadNew, availableTimeSlots } from "../../utils/user-panel-states/lead-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"

// Sidebar components (keeping all existing imports)
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

export default function LeadManagement() {
  const sidebarSystem = useSidebarSystem()
  const [showHistoryModalLead, setShowHistoryModalLead] = useState(false)

  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "#3b82f6", isFixed: true },
  ])

  // ============================================
  // Sorting State
  // ============================================
  const [columnSortSettings, setColumnSortSettings] = useState(() => {
    // Initialize sort settings for each column
    const initialSettings = {}
    columns.forEach(col => {
      initialSettings[col.id] = {
        sortBy: 'custom', // 'name', 'relations', 'date', 'custom'
        sortOrder: 'asc' // 'asc' or 'desc'
      }
    })
    return initialSettings
  })

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [selectedLeadForDocuments, setSelectedLeadForDocuments] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpenLead, setIsEditModalOpenLead] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState([])
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false)
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [selectedEditTab, setSelectedEditTab] = useState("details")
  const [selectedViewTab, setSelectedViewTab] = useState("details")
  const [isCompactView, setIsCompactView] = useState(false)
  const [expandedLeadId, setExpandedLeadId] = useState(null)

  // Assessment states
  const [isAssessmentSelectionModalOpen, setIsAssessmentSelectionModalOpen] = useState(false)
  const [isAssessmentFormModalOpen, setIsAssessmentFormModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentFromDocumentManagement, setAssessmentFromDocumentManagement] = useState(false)
  const [editingAssessmentDocument, setEditingAssessmentDocument] = useState(null) // Das document object beim Edit
  const [isEditingAssessment, setIsEditingAssessment] = useState(false)
  const [isViewingAssessment, setIsViewingAssessment] = useState(false)

  // Trial states
  const [isTrialAppointmentModalOpen, setIsTrialAppointmentModalOpen] = useState(false)
  const [trialAppointmentsRefreshKey, setTrialAppointmentsRefreshKey] = useState(0)
  const [isEditTrialModalOpen, setIsEditTrialModalOpen] = useState(false)
  const [isDeleteTrialConfirmationModalOpen, setIsDeleteTrialConfirmationModalOpen] = useState(false)
  const [selectedTrialAppointment, setSelectedTrialAppointment] = useState(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)
  const [showContractPromptModal, setShowContractPromptModal] = useState(false)
  const [shouldMoveToTrialAfterBooking, setShouldMoveToTrialAfterBooking] = useState(false)
  
  // Lead Special Note Modal states
  const [isLeadSpecialNoteModalOpen, setIsLeadSpecialNoteModalOpen] = useState(false)
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null)
  const [targetColumnForNote, setTargetColumnForNote] = useState(null)

  const [memberRelationsLead, setMemberRelationsLead] = useState(memberRelationsLeadNew)
  const [editingRelationsLead, setEditingRelationsLead] = useState(false)
  const [newRelationLead, setNewRelationLead] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  // ============================================
  // @dnd-kit State and Logic
  // ============================================
  const [activeId, setActiveId] = useState(null)
  const [activeLead, setActiveLead] = useState(null)

  // Drag confirmation state (for trial column transitions)
  const [pendingDrag, setPendingDrag] = useState(null)
  const [dragConfirmation, setDragConfirmation] = useState({
    isOpen: false,
    type: "",
    lead: null,
    sourceColumnId: "",
    targetColumnId: "",
  })

  // Configure sensors for drag detection with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // For mouse: require 10px movement
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300, // For touch: require 300ms hold before drag starts
        tolerance: 8, // Allow 8px movement during delay (for scrolling)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection that prefers columns
  const collisionDetection = useCallback((args) => {
    // First check for intersections with columns
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    // Fallback to rect intersection
    return rectIntersection(args)
  }, [])

  // Get column ID from a droppable ID
  const getColumnId = (id) => {
    if (!id) return null
    if (typeof id === "string" && id.startsWith("column-")) {
      return id.replace("column-", "")
    }
    // Check if it's a lead ID - find which column it belongs to
    const lead = leads.find((l) => l.id === id)
    return lead?.columnId || null
  }

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    
    const lead = leads.find((l) => l.id === active.id)
    if (lead) {
      setActiveLead(lead)
    }
  }

  // Handle drag over (for visual feedback during drag)
  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeColumnId = getColumnId(active.id)
    const overColumnId = getColumnId(over.id)

    // If hovering over a different column, update the lead's position for preview
    if (activeColumnId && overColumnId && activeColumnId !== overColumnId) {
      // This provides visual feedback but doesn't commit the change
    }
  }

  // Handle drag end - the main logic
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    setActiveId(null)
    setActiveLead(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the lead being dragged
    const draggedLead = leads.find((l) => l.id === activeId)
    if (!draggedLead) return

    const sourceColumnId = draggedLead.columnId
    let targetColumnId = getColumnId(overId)

    // If dropped on a lead, get that lead's column
    const overLead = leads.find((l) => l.id === overId)
    if (overLead) {
      targetColumnId = overLead.columnId
    }

    // If dropped on a column droppable
    if (typeof overId === "string" && overId.startsWith("column-")) {
      targetColumnId = overId.replace("column-", "")
    }

    if (!targetColumnId) return

    // Same column - reorder
    if (sourceColumnId === targetColumnId) {
      // Switch to custom sorting when manually reordering
      setColumnSortSettings(prev => ({
        ...prev,
        [sourceColumnId]: {
          ...prev[sourceColumnId],
          sortBy: 'custom'
        }
      }))

      const columnLeads = leads.filter((l) => l.columnId === sourceColumnId)
      const oldIndex = columnLeads.findIndex((l) => l.id === activeId)
      const newIndex = overLead 
        ? columnLeads.findIndex((l) => l.id === overId)
        : columnLeads.length - 1

      if (oldIndex !== newIndex) {
        const reorderedColumnLeads = arrayMove(columnLeads, oldIndex, newIndex)
        
        // Rebuild full leads array with new order
        const otherLeads = leads.filter((l) => l.columnId !== sourceColumnId)
        const newLeads = [...otherLeads, ...reorderedColumnLeads]
        
        setLeads(newLeads)
        updateLocalStorage(newLeads)
        toast.success("Lead reordered")
      }
      return
    }

    // Different column - check for special cases
    
    // Moving TO trial column
    if (targetColumnId === "trial") {
      setDragConfirmation({
        isOpen: true,
        type: "toTrial",
        lead: draggedLead,
        sourceColumnId,
        targetColumnId,
      })
      return
    }

    // Moving FROM trial column
    if (sourceColumnId === "trial") {
      setDragConfirmation({
        isOpen: true,
        type: "fromTrial",
        lead: draggedLead,
        sourceColumnId,
        targetColumnId,
      })
      return
    }

    // Normal move between columns
    moveLeadToColumn(draggedLead, sourceColumnId, targetColumnId, overId)
  }

  // Move lead to a new column
  const moveLeadToColumn = (lead, sourceColumnId, targetColumnId, overId = null) => {
    const targetColumnLeads = leads.filter((l) => l.columnId === targetColumnId)
    
    // Find insertion index
    let insertIndex = targetColumnLeads.length
    if (overId) {
      const overIndex = targetColumnLeads.findIndex((l) => l.id === overId)
      if (overIndex !== -1) {
        insertIndex = overIndex
      }
    }

    const updatedLead = {
      ...lead,
      columnId: targetColumnId,
      status: targetColumnId !== "trial" ? targetColumnId : lead.status,
      hasTrialTraining: targetColumnId === "trial" ? true : lead.hasTrialTraining,
    }

    // Remove from old position and insert at new position
    const otherLeads = leads.filter((l) => l.id !== lead.id)
    const beforeTarget = otherLeads.filter((l) => l.columnId !== targetColumnId)
    const targetLeads = otherLeads.filter((l) => l.columnId === targetColumnId)
    
    targetLeads.splice(insertIndex, 0, updatedLead)
    const newLeads = [...beforeTarget, ...targetLeads]

    setLeads(newLeads)
    updateLocalStorage(newLeads)
    
    const targetColumn = columns.find((c) => c.id === targetColumnId)
    toast.success(`Lead moved to ${targetColumn?.title || targetColumnId}`)
  }

  // Update localStorage helper
  const updateLocalStorage = (updatedLeads) => {
    const localStorageLeads = updatedLeads.filter((l) => l.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))
  }

  // Handle drag confirmation (to trial)
  const handleConfirmToTrial = () => {
    const { lead } = dragConfirmation
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
  }

  // New handlers for trial drag with options
  const handleConfirmToTrialWithBooking = () => {
    const { lead } = dragConfirmation
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
    
    // Mark that we should move to trial after successful booking
    setShouldMoveToTrialAfterBooking(true)
    
    // Open trial booking modal (don't move yet - move after successful booking)
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
  }

  const handleConfirmToTrialWithoutBooking = () => {
    const { lead } = dragConfirmation
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
    
    // Just move to trial column without booking
    const newLeads = leads.map((l) => {
      if (l.id === lead.id) {
        return { ...l, columnId: "trial" }
      }
      return l
    })
    setLeads(newLeads)
    
    // Update localStorage
    if (lead.source === "localStorage") {
      updateLocalStorage(newLeads)
    }
    
    toast.success(`${lead.firstName} moved to Trial Training Arranged`)
  }

  // Handle drag confirmation (from trial)
  const handleConfirmFromTrial = () => {
    const { lead, targetColumnId } = dragConfirmation
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
    
    // Open the special note modal for moving from trial
    handleEditLeadNote(lead, targetColumnId)
  }

  // Cancel drag confirmation
  const handleCancelDragConfirmation = () => {
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
  }

  // ============================================
  // Sorting Functions
  // ============================================
  
  // Function to get relation count for a lead
  const getRelationCount = (leadId) => {
    const relations = memberRelationsLead[leadId]
    if (!relations) return 0
    
    // Count all relations across all categories
    let count = 0
    Object.values(relations).forEach(categoryArray => {
      if (Array.isArray(categoryArray)) {
        count += categoryArray.length
      }
    })
    return count
  }

  // Function to sort leads based on column settings
  const sortLeads = (leadsToSort, columnId) => {
    const settings = columnSortSettings[columnId]
    if (!settings || settings.sortBy === 'custom') {
      return leadsToSort // Return original order for custom sorting
    }

    const sorted = [...leadsToSort].sort((a, b) => {
      let comparison = 0

      switch (settings.sortBy) {
        case 'name':
          const nameA = `${a.firstName || ''} ${a.surname || ''}`.toLowerCase()
          const nameB = `${b.firstName || ''} ${b.surname || ''}`.toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        
        case 'relations':
          const relCountA = getRelationCount(a.id)
          const relCountB = getRelationCount(b.id)
          comparison = relCountA - relCountB
          break
        
        case 'date':
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          comparison = dateA - dateB
          break
        
        default:
          return 0
      }

      return settings.sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  // Function to handle sort change
  const handleSortChange = (columnId, sortBy) => {
    setColumnSortSettings(prev => {
      const currentSettings = prev[columnId]
      const newSortOrder = currentSettings.sortBy === sortBy && currentSettings.sortOrder === 'asc' ? 'desc' : 'asc'
      
      return {
        ...prev,
        [columnId]: {
          sortBy,
          sortOrder: newSortOrder
        }
      }
    })
  }

  // Function to toggle sort order
  const handleToggleSortOrder = (columnId) => {
    setColumnSortSettings(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        sortOrder: prev[columnId].sortOrder === 'asc' ? 'desc' : 'asc'
      }
    }))
  }

  // ============================================
  // Existing Logic (keeping all your original code)
  // ============================================

  const trainingVideos = trainingVideosData

  const handleCreateNewTrial = (lead) => {
    setSelectedLead(lead)
    setIsTrialAppointmentModalOpen(false) // Close the appointment overview modal
    setIsTrialModalOpen(true) // Open the trial booking modal
  }

  const handleAddRelationLead = () => {
    if (!newRelationLead.name || !newRelationLead.relation) {
      toast.error("Please fill in all fields")
      return
    }
    const relationId = Date.now()
    const updatedRelations = { ...memberRelationsLead }
    if (!updatedRelations[selectedLead.id]) {
      updatedRelations[selectedLead.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }
    updatedRelations[selectedLead.id][newRelationLead.category].push({
      id: relationId,
      name: newRelationLead.name,
      relation: newRelationLead.relation,
      type: newRelationLead.type,
    })
    setMemberRelationsLead(updatedRelations)
    setNewRelationLead({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelationLead = (category, relationId) => {
    const updatedRelations = { ...memberRelationsLead }
    updatedRelations[selectedLead.id][category] = updatedRelations[selectedLead.id][category].filter(
      (rel) => rel.id !== relationId
    )
    setMemberRelationsLead(updatedRelations)
    toast.success("Relation deleted successfully")
  }

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

  const handleViewLeadDetails = (lead, tab = "details") => {
    setSelectedLead(lead)
    setSelectedViewTab(tab)
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
    setSelectedEditTab(tab)
    setIsEditModalOpenLead(true)
  }

  const handleDeleteLead = (id) => {
    const lead = leads.find(l => l.id === id)
    setLeadToDelete(lead)
    setIsDeleteConfirmationModalOpen(true)
  }

  const handleEditLeadNote = (lead, targetColumnId = null) => {
    setSelectedLeadForNote(lead)
    setTargetColumnForNote(targetColumnId)
    setIsLeadSpecialNoteModalOpen(true)
  }

  const handleSaveLeadSpecialNote = (leadId, newNote, targetColumnId) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        // Add new note to existing notes array
        const existingNotes = lead.notes || []
        const updatedNotes = [newNote, ...existingNotes]
        
        // Find the first important note or first note for backwards compatibility
        const importantNote = updatedNotes.find(n => n.isImportant)
        const primaryNote = importantNote || updatedNotes[0]
        
        return {
          ...lead,
          notes: updatedNotes,
          // Keep specialNote for backwards compatibility
          specialNote: primaryNote ? {
            text: primaryNote.text,
            isImportant: primaryNote.isImportant,
            startDate: primaryNote.startDate || null,
            endDate: primaryNote.endDate || null,
          } : null,
          // If targetColumnId is provided, also update the column
          ...(targetColumnId ? { columnId: targetColumnId, status: targetColumnId } : {}),
        }
      }
      return lead
    })
    setLeads(updatedLeads)
    updateLocalStorage(updatedLeads)
    setIsLeadSpecialNoteModalOpen(false)
    setSelectedLeadForNote(null)
    setTargetColumnForNote(null)
    
    if (targetColumnId) {
      const targetColumn = columns.find((c) => c.id === targetColumnId)
      toast.success(`Special note added and lead moved to ${targetColumn?.title || targetColumnId}`)
    } else {
      toast.success("Special note added successfully")
    }
  }

  const confirmDeleteLead = () => {
    const updatedLeads = leads.filter((lead) => lead.id !== leadToDelete.id)
    setLeads(updatedLeads)
    if (leadToDelete?.source === "localStorage") {
      updateLocalStorage(updatedLeads)
    }
    setIsDeleteConfirmationModalOpen(false)
    setLeadToDelete(null)
    toast.success("Lead has been deleted")
  }

  const handleOpenDocuments = (lead) => {
    setSelectedLeadForDocuments(lead)
    setIsDocumentModalOpen(true)
  }

  const handleSaveLead = (data) => {
    const now = new Date().toISOString()
    // Get first non-trial column as default status
    const defaultStatus = columns.find(col => col.id !== "trial")?.id || "active"
    
    const newLead = {
      id: `l${Date.now()}`,
      firstName: data.firstName,
      surname: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      telephoneNumber: data.telephoneNumber || "",
      gender: data.gender || "",
      birthday: data.birthday || null,
      street: data.street || "",
      zipCode: data.zipCode || "",
      city: data.city || "",
      country: data.country || "",
      leadSource: data.source || "", // Lead source from form (Website, Google Ads, etc.)
      details: data.details || "",
      trialPeriod: data.trialPeriod,
      hasTrialTraining: data.hasTrialTraining,
      avatar: data.avatar,
      source: "localStorage", // Internal source marker
      status: data.status || defaultStatus,
      columnId: data.hasTrialTraining ? "trial" : data.status || defaultStatus,
      createdAt: now,
      specialNote: {
        text: data.note || "",
        isImportant: data.noteImportance === "important",
        startDate: data.noteStartDate || null,
        endDate: data.noteEndDate || null,
      },
      company: data.company || "",
      interestedIn: data.interestedIn || "",
      address: data.address || "",
    }
    const updatedLeads = [...leads, newLead]
    setLeads(updatedLeads)
    updateLocalStorage(updatedLeads)
    toast.success("Lead has been added")
  }

  const handleSaveEdit = (data) => {
    // Check if there's a pending move from trial column
    const pendingMoveStr = sessionStorage.getItem('pendingLeadMove')
    let pendingMove = null
    if (pendingMoveStr) {
      try {
        pendingMove = JSON.parse(pendingMoveStr)
      } catch (e) {
        console.error('Failed to parse pending move:', e)
      }
    }

    const updatedLeads = leads.map((lead) =>
      lead.id === data.id
        ? {
            ...lead,
            firstName: data.firstName,
            surname: data.surname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            telephoneNumber: data.telephoneNumber !== undefined ? data.telephoneNumber : (lead.telephoneNumber || ""),
            gender: data.gender || lead.gender || "",
            street: data.street || lead.street || "",
            zipCode: data.zipCode || lead.zipCode || "",
            city: data.city || lead.city || "",
            country: data.country || lead.country || "",
            leadSource: data.source || lead.leadSource || "", // Lead source from form
            details: data.details || lead.details || "",
            trialPeriod: data.trialPeriod,
            hasTrialTraining: pendingMove && pendingMove.leadId === lead.id ? false : data.hasTrialTraining,
            avatar: data.avatar,
            status: pendingMove && pendingMove.leadId === lead.id ? pendingMove.targetColumnId : data.status || lead.status,
            columnId: pendingMove && pendingMove.leadId === lead.id ? pendingMove.targetColumnId : (data.hasTrialTraining ? "trial" : data.status || lead.columnId),
            notes: data.notes || lead.notes || [],
            specialNote: {
              text: data.specialNote?.text || "",
              isImportant: data.specialNote?.isImportant || false,
              startDate: data.specialNote?.startDate || null,
              endDate: data.specialNote?.endDate || null,
            },
            company: data.company || lead.company,
            interestedIn: data.interestedIn || lead.interestedIn,
            birthday: data.birthday || lead.birthday,
            address: data.address || lead.address,
          }
        : lead
    )
    setLeads(updatedLeads)
    updateLocalStorage(updatedLeads)
    
    // Clear pending move and show appropriate toast
    if (pendingMove && pendingMove.leadId === data.id) {
      sessionStorage.removeItem('pendingLeadMove')
      const targetColumn = columns.find((c) => c.id === pendingMove.targetColumnId)
      toast.success(`Lead moved to ${targetColumn?.title || pendingMove.targetColumnId} with note`)
    } else {
      toast.success("Lead has been updated")
    }
  }

  const handleEditColumn = (id, title, color) => {
    setSelectedColumn({ id, title, color })
    setIsEditColumnModalOpen(true)
  }

  const handleSaveColumn = (data) => {
    const updatedColumns = columns.map((column) =>
      column.id === data.id ? { ...column, title: data.title, color: data.color } : column
    )
    setColumns(updatedColumns)
    setIsEditColumnModalOpen(false)
    setSelectedColumn(null)
    toast.success("Column saved successfully")
  }

  const handleTrialModalClose = () => {
    setIsTrialModalOpen(false)
    // Reset the flag if user closes without booking
    setShouldMoveToTrialAfterBooking(false)
  }

  const handleSaveNewTrialTraining = (trialData) => {
    // Save new trial appointment to localStorage
    const storedAppointments = localStorage.getItem("trialAppointments")
    let appointments = storedAppointments ? JSON.parse(storedAppointments) : []
    
    // Create new appointment with unique ID
    const newAppointment = {
      ...trialData,
      id: Date.now(),
      status: "scheduled",
      isTrial: true,
      isCancelled: false,
      isPast: false,
    }
    
    appointments.push(newAppointment)
    localStorage.setItem("trialAppointments", JSON.stringify(appointments))
    
    // Always move lead to trial column when booking trial training (if not already there)
    if (selectedLead && selectedLead.columnId !== "trial") {
      const newLeads = leads.map((l) => {
        if (l.id === selectedLead.id) {
          return { ...l, columnId: "trial" }
        }
        return l
      })
      setLeads(newLeads)
      
      // Update localStorage
      if (selectedLead.source === "localStorage") {
        updateLocalStorage(newLeads)
      }
      
      toast.success("Trial training booked and lead moved to Trial Training Arranged!")
    } else {
      toast.success("Trial training booked successfully!")
    }
    
    // Reset flag if it was set
    setShouldMoveToTrialAfterBooking(false)
    setIsTrialModalOpen(false)
    
    // Trigger refresh of trial appointments list
    setTrialAppointmentsRefreshKey(prev => prev + 1)
  }

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phoneNumber?.includes(searchQuery) ||
        lead.telephoneNumber?.includes(searchQuery)
      )
    })
  }, [leads, searchQuery])

  // Get leads for each column
  const getColumnLeads = useCallback(
    (columnId) => {
      const columnLeads = filteredLeads.filter((lead) => lead.columnId === columnId)
      // Apply sorting
      return sortLeads(columnLeads, columnId)
    },
    [filteredLeads, columnSortSettings, memberRelationsLead]
  )

  const handleManageTrialAppointments = (lead) => {
    setSelectedLead(lead)
    setIsTrialAppointmentModalOpen(true)
  }

  const handleEditTrialAppointment = (appointment) => {
    setSelectedTrialAppointment(appointment)
    setIsEditTrialModalOpen(true)
  }

  const handleDeleteTrialAppointment = (appointmentId) => {
    setAppointmentToDelete(appointmentId)
    setIsDeleteTrialConfirmationModalOpen(true)
  }

  const handleSaveEditedTrial = (updatedAppointment) => {
    const storedAppointments = localStorage.getItem("trialAppointments")
    let appointments = storedAppointments ? JSON.parse(storedAppointments) : []
    appointments = appointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
    localStorage.setItem("trialAppointments", JSON.stringify(appointments))
    toast.success("Trial appointment updated successfully!")
    setIsEditTrialModalOpen(false)
    setSelectedTrialAppointment(null)
    
    // Trigger refresh of trial appointments list
    setTrialAppointmentsRefreshKey(prev => prev + 1)
  }

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      const storedAppointments = localStorage.getItem("trialAppointments")
      let appointments = storedAppointments ? JSON.parse(storedAppointments) : []
      appointments = appointments.filter((apt) => apt.id !== appointmentToDelete)
      localStorage.setItem("trialAppointments", JSON.stringify(appointments))
      toast.success("Trial appointment deleted successfully!")
      setIsDeleteTrialConfirmationModalOpen(false)
      setAppointmentToDelete(null)
      
      // Trigger refresh of trial appointments list
      setTrialAppointmentsRefreshKey(prev => prev + 1)
    }
  }

  const handleCreateAssessmentClick = (lead, fromDocManagement = false) => {
    setSelectedLead(lead)
    setAssessmentFromDocumentManagement(fromDocManagement)
    setIsAssessmentSelectionModalOpen(true)
  }

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentSelectionModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleAssessmentComplete = (documentData) => {
    // FÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼ge das document direkt zum lead.documents hinzu oder update es
    setLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === selectedLead.id) {
          const existingDocuments = lead.documents || []
          
          if (documentData.isEdit) {
            // Update bestehendes document
            return {
              ...lead,
              documents: existingDocuments.map(doc => 
                doc.id === documentData.id ? documentData : doc
              ),
              hasAssessment: true
            }
          } else {
            // Neues document hinzufÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼gen
            return {
              ...lead,
              documents: [...existingDocuments, documentData],
              hasAssessment: true
            }
          }
        }
        return lead
      })
    )
    
    setIsAssessmentFormModalOpen(false)
    setSelectedAssessment(null)
    setIsEditingAssessment(false)
    setEditingAssessmentDocument(null)
    setIsViewingAssessment(false)
    
    // Only show contract prompt if NOT from document management
    if (assessmentFromDocumentManagement) {
      // Reopen document management modal
      setIsDocumentModalOpen(true)
      setAssessmentFromDocumentManagement(false)
    } else {
      setShowContractPromptModal(true)
    }
  }

  const handleEditAssessmentClick = (lead, doc) => {
    setSelectedLead(lead)
    setIsEditingAssessment(true)
    setEditingAssessmentDocument(doc)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setIsDocumentModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleViewAssessmentClick = (lead, doc) => {
    setSelectedLead(lead)
    setEditingAssessmentDocument(doc)
    setIsViewingAssessment(true)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setIsDocumentModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleDocumentsUpdate = (leadId, documents) => {
    // Update lead documents in state
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, documents } : lead
      )
    )
  }

  const handleContractPromptConfirm = () => {
    setShowContractPromptModal(false)
    handleCreateContract(selectedLead)
  }

  const handleContractPromptCancel = () => {
    setShowContractPromptModal(false)
  }

  const handleProceedToContract = () => {
    setIsAssessmentSelectionModalOpen(false)
    handleCreateContract(selectedLead)
  }

  // Sidebar system (keeping all existing sidebar logic)
  const {
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    showAppointmentModal,
    freeAppointments,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    notePopoverRef,
    setIsRightSidebarOpen,
    setIsSidebarEditing,
    setIsRightWidgetModalOpen,
    setOpenDropdownIndex,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setIsNotifyMemberOpen,
    setNotifyAction,
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    truncateUrl,
    renderSpecialNoteIcon,
    customLinks,
    setCustomLinks,
    communications,
    setCommunications,
    todos,
    setTodos,
    expiringContracts,
    setExpiringContracts,
    birthdays,
    setBirthdays,
    notifications,
    setNotifications,
    appointments,
    setAppointments,
    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,
    todoFilterOptions,
    relationOptions,
    appointmentTypes,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans,
    availableTrainingPlans,
    setAvailableTrainingPlans,
  } = sidebarSystem

  // Wrapper functions for sidebar
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  return (
    <div className="min-h-screen rounded-3xl p-6 bg-[#1C1C1C] transition-all duration-300 ease-in-out flex-1">
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

      {/* Header */}
      <div className="flex md:flex-row flex-col gap-2 justify-between sm:items-center items-start mb-4 sm:mb-6">
        <div className="gap-2 w-full sm:w-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl text-white font-bold">Leads</h1>
            
            {/* Compact/Detailed View Toggle */}
            <div className="flex items-center gap-2 bg-black rounded-xl p-1">
              <span className="text-xs text-gray-400 px-2">View</span>
              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className="p-2 rounded-lg transition-colors flex items-center gap-1 text-[#FF843E]"
                title={isCompactView ? "Compact View (Click for Detailed)" : "Detailed View (Click for Compact)"}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                  </div>
                  <div className="flex gap-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
                <span className="text-xs ml-1 hidden sm:inline">
                  {isCompactView ? "Compact" : "Detailed"}
                </span>
              </button>
            </div>
          </div>
          
          {isRightSidebarOpen ? (
            <div onClick={toggleRightSidebar} className="md:hidden block">
              <img src="/expand-sidebar mirrored.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
          ) : (
            <div onClick={toggleRightSidebar} className="md:hidden block">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="inline">Create Lead</span>
          </button>
          {isRightSidebarOpen ? (
            <div onClick={toggleRightSidebar} className="md:block hidden">
              <img src="/expand-sidebar mirrored.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
          ) : (
            <div onClick={toggleRightSidebar} className="md:block hidden">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search leads by name, email, mobile or telephone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
        />
      </div>

      {/* Kanban Board with DnD Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-[calc(100vh-220px)] min-h-[400px]">
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              leads={getColumnLeads(column.id)}
              onViewDetails={handleViewLeadDetails}
              onAddTrial={handleAddTrialTraining}
              onCreateContract={handleCreateContract}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              isEditable={!column.isFixed}
              onEditColumn={handleEditColumn}
              memberRelationsLead={memberRelationsLead}
              setShowHistoryModalLead={setShowHistoryModalLead}
              setSelectedLead={setSelectedLead}
              onManageTrialAppointments={handleManageTrialAppointments}
              onEditNote={handleEditNote}
              onOpenDocuments={handleOpenDocuments}
              onCreateAssessment={handleCreateAssessmentClick}
              isCompactView={isCompactView}
              expandedLeadId={expandedLeadId}
              setExpandedLeadId={setExpandedLeadId}
              sortSettings={columnSortSettings[column.id]}
              onSortChange={(sortBy) => handleSortChange(column.id, sortBy)}
              onToggleSortOrder={() => handleToggleSortOrder(column.id)}
            />
          ))}
        </div>

        {/* Drag Overlay - shows the dragged item */}
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeLead ? (
            <SortableLeadCard
              lead={activeLead}
              columnId={activeLead.columnId}
              index={0}
              memberRelationsLead={memberRelationsLead}
              isDraggingOverlay={true}
              isCompactView={isCompactView}
              expandedLeadId={expandedLeadId}
              setExpandedLeadId={setExpandedLeadId}
              onViewDetails={() => {}}
              onAddTrial={() => {}}
              onCreateContract={() => {}}
              onEditLead={() => {}}
              onDeleteLead={() => {}}
              setShowHistoryModalLead={() => {}}
              setSelectedLead={() => {}}
              onManageTrialAppointments={() => {}}
              onEditNote={() => {}}
              onOpenDocuments={() => {}}
              onCreateAssessment={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* All Modals (keeping existing) */}
      <AddLeadModal 
        isVisible={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLead}
        columns={columns}
        availableMembersLeads={availableMembersLeads}
      />

      <EditLeadModal
        isVisible={isEditModalOpenLead}
        onClose={() => {
          setIsEditModalOpenLead(false)
          setSelectedLead(null)
          setSelectedEditTab("details")
          // Clear any pending move if user closes without saving
          sessionStorage.removeItem('pendingLeadMove')
        }}
        onSave={handleSaveEdit}
        leadData={selectedLead}
        memberRelationsLead={memberRelationsLead}
        setMemberRelationsLead={setMemberRelationsLead}
        editingRelationsLead={editingRelationsLead}
        setEditingRelationsLead={setEditingRelationsLead}
        newRelationLead={newRelationLead}
        setNewRelationLead={setNewRelationLead}
        availableMembersLeads={availableMembersLeads}
        columns={columns}
        handleAddRelationLead={handleAddRelationLead}
        handleDeleteRelationLead={handleDeleteRelationLead}
        initialTab={selectedEditTab}
      />

      <ViewLeadDetailsModal
        isVisible={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedLead(null)
          setSelectedViewTab("details")
        }}
        leadData={selectedLead}
        memberRelationsLead={memberRelationsLead}
        columns={columns}
        onEditLead={handleEditLead}
        initialTab={selectedViewTab}
      />

      <TrialTrainingModal
        isOpen={isTrialModalOpen}
        onClose={handleTrialModalClose}
        selectedLead={selectedLead}
        handleSaveTrialTraining={handleSaveNewTrialTraining}
        trialTypes={[
          { name: "Cardio", duration: 30 },
          { name: "Strength", duration: 45 },
          { name: "Flexibility", duration: 60 },
        ]}
        freeTimeSlots={availableTimeSlots}
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
            // Delete the lead after contract creation (lead becomes a member in backend)
            const updatedLeads = leads.filter((lead) => lead.id !== selectedLead?.id)
            setLeads(updatedLeads)
            if (selectedLead?.source === "localStorage") {
              updateLocalStorage(updatedLeads)
            }
            
            toast.success("Contract created successfully! Lead has been converted to member.")
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
                  company: selectedLead.company,
                  interestedIn: selectedLead.interestedIn,
                }
              : null
          }
        />
      )}

      {showHistoryModalLead && <LeadHistoryModal lead={selectedLead} onClose={() => setShowHistoryModalLead(false)} />}

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
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
          setLeadToDelete(null)
        }}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        message={leadToDelete ? (
          <>
            Are you sure you want to delete <span className="font-semibold">{leadToDelete.firstName} {leadToDelete.surname}</span>? This action cannot be undone.
          </>
        ) : ''}
        confirmText="Delete"
        isDestructive={true}
      />

      {/* Drag Confirmation Dialog */}
      {dragConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1C1C1C] w-[95%] sm:w-[90%] md:w-[400px] max-w-md rounded-xl overflow-hidden">
            {/* Header with X button */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {dragConfirmation.type === "toTrial" ? "Move to Trial Training?" : "Move Lead from Trial Training?"}
              </h3>
              <button 
                onClick={handleCancelDragConfirmation}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                {dragConfirmation.type === "toTrial"
                  ? `Moving ${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""} to Trial Training Arranged.`
                  : `Are you sure you want to move ${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""} from Trial Training Arranged?`}
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col gap-2 sm:gap-3">
                {dragConfirmation.type === "toTrial" ? (
                  <>
                    <button
                      onClick={handleConfirmToTrialWithBooking}
                      className="w-full px-3 sm:px-4 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Yes, and Book Trial Training
                    </button>
                    <button
                      onClick={handleConfirmToTrialWithoutBooking}
                      className="w-full px-3 sm:px-4 py-2.5 bg-gray-600 text-white text-sm sm:text-base rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Yes, Without Booking
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConfirmFromTrial}
                    className="w-full px-3 sm:px-4 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Yes, Move Lead
                  </button>
                )}
              </div>
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
        onCreateNewTrial={handleCreateNewTrial}
        refreshKey={trialAppointmentsRefreshKey}
      />

      <EditTrialModal
        isOpen={isEditTrialModalOpen}
        onClose={() => {
          setIsEditTrialModalOpen(false)
          setSelectedTrialAppointment(null)
        }}
        appointment={selectedTrialAppointment}
        trialTypes={[
          { name: "Cardio", duration: 30 },
          { name: "Strength", duration: 45 },
          { name: "Flexibility", duration: 60 },
        ]}
        freeTimeSlots={availableTimeSlots}
        handleSaveTrialTraining={handleSaveEditedTrial}
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

      <LeadDocumentModal
        lead={selectedLeadForDocuments}
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false)
          setSelectedLeadForDocuments(null)
        }}
        onCreateAssessment={(lead) => handleCreateAssessmentClick(lead, true)}
        onEditAssessment={handleEditAssessmentClick}
        onViewAssessment={handleViewAssessmentClick}
        onDocumentsUpdate={handleDocumentsUpdate}
      />

      <AssessmentSelectionModal
        isOpen={isAssessmentSelectionModalOpen}
        onClose={() => {
          setIsAssessmentSelectionModalOpen(false)
          // Reopen document management if it was from there
          if (assessmentFromDocumentManagement) {
            setIsDocumentModalOpen(true)
          }
        }}
        onSelectAssessment={handleAssessmentSelect}
        onProceedToContract={handleProceedToContract}
        selectedLead={selectedLead}
        fromDocumentManagement={assessmentFromDocumentManagement}
      />

      <AssessmentFormModal
        isOpen={isAssessmentFormModalOpen}
        onClose={() => {
          setIsAssessmentFormModalOpen(false)
          setSelectedAssessment(null)
          setIsEditingAssessment(false)
          setEditingAssessmentDocument(null)
          setIsViewingAssessment(false)
          // Reopen document management if it was from there
          if (assessmentFromDocumentManagement) {
            setIsDocumentModalOpen(true)
            setAssessmentFromDocumentManagement(false)
          }
        }}
        assessment={selectedAssessment}
        selectedLead={selectedLead}
        onComplete={handleAssessmentComplete}
        onProceedToContract={handleProceedToContract}
        fromDocumentManagement={assessmentFromDocumentManagement}
        existingDocument={editingAssessmentDocument}
        isEditMode={isEditingAssessment}
        isViewMode={isViewingAssessment}
      />

      <ContractPromptModal
        isOpen={showContractPromptModal}
        onClose={handleContractPromptCancel}
        onConfirm={handleContractPromptConfirm}
        leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.surname}` : ""}
      />

      <LeadSpecialNoteModal
        isOpen={isLeadSpecialNoteModalOpen}
        onClose={() => {
          setIsLeadSpecialNoteModalOpen(false)
          setSelectedLeadForNote(null)
          setTargetColumnForNote(null)
        }}
        lead={selectedLeadForNote}
        onSave={handleSaveLeadSpecialNote}
        targetColumnId={targetColumnForNote}
      />

      {/* Sidebar (keeping all existing sidebar code) */}
      <Sidebar
        isRightSidebarOpen={isRightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
        isSidebarEditing={isSidebarEditing}
        toggleSidebarEditing={toggleSidebarEditing}
        rightSidebarWidgets={rightSidebarWidgets}
        moveRightSidebarWidget={moveRightSidebarWidget}
        removeRightSidebarWidget={removeRightSidebarWidget}
        setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
        communications={communications}
        redirectToCommunication={redirectToCommunication}
        todos={todos}
        handleTaskComplete={handleTaskCompleteWrapper}
        todoFilter={todoFilter}
        setTodoFilter={setTodoFilter}
        todoFilterOptions={todoFilterOptions}
        isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
        setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
        openDropdownIndex={openDropdownIndex}
        toggleDropdown={toggleDropdown}
        handleEditTask={handleEditTask}
        setTaskToCancel={setTaskToCancel}
        setTaskToDelete={setTaskToDelete}
        birthdays={birthdays}
        isBirthdayToday={isBirthdayToday}
        handleSendBirthdayMessage={handleSendBirthdayMessage}
        customLinks={customLinks}
        truncateUrl={truncateUrl}
        appointments={appointments}
        renderSpecialNoteIcon={renderSpecialNoteIcon}
        handleDumbbellClick={handleDumbbellClick}
        handleCheckIn={handleCheckInWrapper}
        handleAppointmentOptionsModal={handleAppointmentOptionsModal}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        isChartDropdownOpen={isChartDropdownOpen}
        setIsChartDropdownOpen={setIsChartDropdownOpen}
        expiringContracts={expiringContracts}
        getWidgetPlacementStatus={getWidgetPlacementStatus}
        onClose={toggleRightSidebar}
        hasUnreadNotifications={2}
        setIsWidgetModalOpen={setIsWidgetModalOpen}
        handleEditNote={handleEditNoteWrapper}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        isSpecialNoteModalOpen={isSpecialNoteModalOpen}
        setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
        selectedAppointmentForNote={selectedAppointmentForNote}
        setSelectedAppointmentForNote={setSelectedAppointmentForNote}
        handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
        onSaveSpecialNote={handleSaveSpecialNoteWrapper}
        notifications={notifications}
        setTodos={setTodos}
      />

      {isRightSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={toggleRightSidebar} aria-hidden="true" />
      )}

      <TrainingPlansModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => {
          setIsTrainingPlanModalOpen(false)
          setSelectedUserForTrainingPlan(null)
        }}
        selectedMember={selectedUserForTrainingPlan}
        memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
        availableTrainingPlans={availableTrainingPlans}
        onAssignPlan={handleAssignTrainingPlan}
        onRemovePlan={handleRemoveTrainingPlan}
      />

      <AppointmentActionModalV2
        isOpen={showAppointmentOptionsModal}
        onClose={() => {
          setShowAppointmentOptionsModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
        isEventInPast={isEventInPast}
        onEdit={() => {
          setShowAppointmentOptionsModal(false)
          setIsEditAppointmentModalOpen(true)
        }}
        onCancel={handleCancelAppointment}
        onViewMember={handleViewMemberDetails}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
        handleNotifyMember={handleNotifyMember}
      />

      {isEditAppointmentModalOpen && selectedAppointment && (
        <EditAppointmentModalV2
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointment({ ...selectedAppointment, ...changes })
          }}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointmentWrapper}
          onClose={() => {
            setIsEditAppointmentModalOpen(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddRightSidebarWidget}
        getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
        widgetArea="sidebar"
      />

      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

      {isEditTaskModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditTaskModalOpen(false)
            setEditingTask(null)
          }}
          onUpdateTask={handleUpdateTaskWrapper}
        />
      )}

      {taskToDelete && (
        <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToCancel && (
        <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                No
              </button>
              <button
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
