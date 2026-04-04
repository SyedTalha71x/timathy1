/* eslint-disable no-unused-vars */
import React from "react"
import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Plus, X, ChevronLeft, ChevronRight, File, ClipboardList } from "lucide-react"
import toast from "../../components/shared/SharedToast"
import { useNavigate, useLocation } from "react-router-dom"

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
import { ContractModal } from "../../components/shared/contracts/contract-modal"
import AddLeadModal from "../../components/studio-components/lead-studio-components/add-lead-modal"
import EditLeadModal from "../../components/studio-components/lead-studio-components/edit-lead-modal"
import ViewLeadDetailsModal from "../../components/studio-components/lead-studio-components/view-lead-details-modal"
import ConfirmationModal from "../../components/studio-components/lead-studio-components/confirmation-modal"
import EditColumnModal from "../../components/studio-components/lead-studio-components/edit-column-modal"
import TrialTrainingModal from "../../components/shared/appointments/CreateTrialTrainingModal"
import SharedHistoryModal from "../../components/shared/SharedHistoryModal"
import TrialAppointmentModal from "../../components/studio-components/lead-studio-components/trial-appointment-modal"
import EditAppointmentModal from "../../components/shared/appointments/EditAppointmentModal"
import DeleteConfirmationModal from "../../components/studio-components/lead-studio-components/delete-confirmation-modal"
import DocumentManagementModal from "../../components/shared/DocumentManagementModal"
import AssessmentFormModal from "../../components/shared/medical-history/medical-history-form-modal"
import AssessmentSelectionModal from "../../components/shared/medical-history/medical-history-selection-modal"
import ContractPromptModal from "../../components/studio-components/lead-studio-components/contract-prompt-modal"
import MedicalHistoryPromptModal from "../../components/studio-components/lead-studio-components/medical-history-prompt-modal"
import { LeadSpecialNoteModal } from '../../components/shared/special-note/shared-special-note-modal'

// New DnD components
import SortableColumn from "../../components/studio-components/lead-studio-components/sortable-column"
import SortableLeadCard from "../../components/studio-components/lead-studio-components/sortable-lead-card"

// Data and hooks
import {
  hardcodedLeads,
  memberRelationsLeadNew,
  DEFAULT_LEAD_SOURCES,
} from "../../utils/studio-states/leads-states"
import { trainingVideosData } from "../../utils/studio-states/training-states"
import { availableMembersLeadsMain as availableMembersLeads, appointmentTypesData, freeAppointmentsData, leadsData as leadsDataMain } from "../../utils/studio-states"
import { useStudioLeads } from "../../hooks/useStudioLeads"
import { useDispatch, useSelector } from "react-redux"
import { createLeadThunk, fetchAllLeadsThunk, updateLeadByStaffThunk } from "../../features/lead/leadSlice"
import { createNoteThunk } from "../../features/specialNotes/specialNoteSlice"


export default function LeadManagement({ studioId: studioIdProp = null, mode = "studio", studioName: studioNameProp = null }) {
  const { t } = useTranslation()

  const { leads, loading } = useSelector((state) => state.leads)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminMode = mode === "admin" && studioIdProp !== null

  // ============================================
  // Load leads data via shared hook
  // ============================================
  const { data: leadsHookData, isLoading: leadsLoading, error: leadsError } = useStudioLeads({
    studioId: studioIdProp,
    mode,
  })

  const [showHistoryModalLead, setShowHistoryModalLead] = useState(false)

  // Lead history data — replace with real API data later
  // Previously this was hardcoded inside LeadHistoryModal
  const [leadHistoryData] = useState({
    general: [
      { id: 1, date: "2024-01-15", time: "14:30", field: "Status", oldValue: "Active prospect", newValue: "Passive prospect", changedBy: "Admin" },
      { id: 2, date: "2024-01-10", time: "09:15", field: "Phone Number", oldValue: "+1234567890", newValue: "+1234567891", changedBy: "Self" },
      { id: 3, date: "2024-01-05", time: "16:45", field: "Email", oldValue: "old@email.com", newValue: "new@email.com", changedBy: "Admin" },
    ],
    communication: [],
    trial: [
      { id: 1, date: "2024-01-20", time: "10:00", action: "Trial Training Booked", trialType: "Cardio", trialDate: "2024-01-25", trialTime: "14:00", status: "Scheduled", bookedBy: "Admin" },
      { id: 2, date: "2024-01-18", time: "15:30", action: "Trial Training Completed", trialType: "Strength", trialDate: "2024-01-18", trialTime: "15:00", status: "Completed", bookedBy: "Admin" },
      { id: 3, date: "2024-01-15", time: "11:00", action: "Trial Training Cancelled", trialType: "Flexibility", trialDate: "2024-01-16", trialTime: "09:00", status: "Cancelled", bookedBy: "Admin" },
    ],
  })

  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "var(--color-trial)", isFixed: true },
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
  const [selectedLeadForTrial, setSelectedLeadForTrial] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leadFilters, setLeadFilters] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  // const [leads, setLeads] = useState([])
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false)
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [selectedEditTab, setSelectedEditTab] = useState("details")
  const [selectedViewTab, setSelectedViewTab] = useState("details")
  const [isCompactView, setIsCompactView] = useState(() => {
    // On mobile: start with compact view, on desktop: start with detailed view
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  const [expandedLeadId, setExpandedLeadId] = useState(null)
  const [collapsedColumns, setCollapsedColumns] = useState([])

  // Toggle column collapse
  const toggleColumnCollapse = (columnId) => {
    setCollapsedColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId); // Remove from collapsed
      } else {
        return [...prev, columnId]; // Add to collapsed
      }
    });
  }

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
  const [showMedicalHistoryPromptModal, setShowMedicalHistoryPromptModal] = useState(false)
  const [shouldMoveToTrialAfterBooking, setShouldMoveToTrialAfterBooking] = useState(false)

  // Trial appointments state (simple state like appointments.jsx)
  const [trialAppointmentsMain, setTrialAppointmentsMain] = useState([])

  // Lead Special Note Modal states
  const [isLeadSpecialNoteModalOpen, setIsLeadSpecialNoteModalOpen] = useState(false)
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null)
  const [targetColumnForNote, setTargetColumnForNote] = useState(null)

  const [memberRelationsLead, setMemberRelationsLead] = useState([])
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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

  // Track screen size for mobile-only autoScroll
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Drag confirmation state (for trial column transitions)
  const [pendingDrag, setPendingDrag] = useState(null)
  const [dragConfirmation, setDragConfirmation] = useState({
    isOpen: false,
    type: "",
    lead: null,
    sourceColumnId: "",
    targetColumnId: "",
  })

  // ===========================
  //  Lead Detail Loads
  // ===========================
  useEffect(() => {
    dispatch(fetchAllLeadsThunk())
  }, [dispatch])




  // Configure sensors for drag detection with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
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
    const lead = leads.find((l) => l._id === id)
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

        // setLeads(newLeads)
        updateLocalStorage(newLeads)
        toast.success(t("admin.leads.toast.reordered"))
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

    // setLeads(newLeads)
    updateLocalStorage(newLeads)

    const targetColumn = columns.find((c) => c.id === targetColumnId)
    toast.success(t("admin.leads.toast.movedTo", { column: targetColumn?.title || targetColumnId }))
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
    setSelectedLeadForTrial(lead)
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
    setSelectedLeadForTrial(lead)
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
    // setLeads(newLeads)

    // Update localStorage
    if (lead.source === "localStorage") {
      updateLocalStorage(newLeads)
    }

    toast.success(t("admin.leads.toast.movedTo", { column: "Trial Training Arranged" }))
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

    // Safety check
    if (!Array.isArray(leadsToSort)) {
      console.warn('sortLeads received non-array:', leadsToSort)
      return []
    }

    if (!settings || settings.sortBy === 'custom') {
      return leadsToSort // Return original order for custom sorting
    }

    const sorted = [...leadsToSort].sort((a, b) => {
      try {
        let comparison = 0

        switch (settings.sortBy) {
          case 'name':
            // Handle both surname and lastName
            const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase().trim()
            const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase().trim()
            comparison = nameA.localeCompare(nameB)
            break

          case 'relations':
            // Handle both id and _id
            const leadIdA = a.id || a._id
            const leadIdB = b.id || b._id

            if (!leadIdA || !leadIdB) {
              console.warn('Lead missing ID:', a, b)
              return 0
            }

            const relCountA = getRelationCount(leadIdA) || 0
            const relCountB = getRelationCount(leadIdB) || 0
            comparison = relCountA - relCountB
            break

          case 'date':
            // Try multiple date fields with fallbacks
            const getDateValue = (lead) => {
              if (lead.createdAt) return new Date(lead.createdAt).getTime()
              if (lead._id) {
                // MongoDB ObjectId contains timestamp
                const timestamp = parseInt(lead._id.toString().substring(0, 8), 16) * 1000
                if (!isNaN(timestamp)) return timestamp
              }
              if (lead.dateOfBirth) return new Date(lead.dateOfBirth).getTime()
              return 0
            }

            const dateA = getDateValue(a)
            const dateB = getDateValue(b)
            comparison = dateA - dateB
            break

          default:
            return 0
        }

        return settings.sortOrder === 'asc' ? comparison : -comparison
      } catch (error) {
        console.error('Error sorting leads:', error, { a, b, settings })
        return 0
      }
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
    setSelectedLeadForTrial(lead)
    setIsTrialAppointmentModalOpen(false) // Close the appointment overview modal
    setIsTrialModalOpen(true) // Open the trial booking modal
  }

  const handleAddRelationLead = () => {
    if (!newRelationLead.name || !newRelationLead.relation) {
      toast.error(t("admin.leads.toast.fillAllFields"))
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
    toast.success(t("admin.leads.toast.relationAdded"))
  }

  const handleDeleteRelationLead = (category, relationId) => {
    const updatedRelations = { ...memberRelationsLead }
    updatedRelations[selectedLead.id][category] = updatedRelations[selectedLead.id][category].filter(
      (rel) => rel.id !== relationId
    )
    setMemberRelationsLead(updatedRelations)
    toast.success(t("admin.leads.toast.relationDeleted"))
  }

  useEffect(() => {
    if (isAdminMode) {
      // Admin mode: Load from hook data
      if (leadsHookData) {
        // setLeads(leadsHookData.leads)
        setMemberRelationsLead(leadsHookData.memberRelations)
      }
      return
    }
    // Studio mode: Load from hardcoded + localStorage
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
    // setLeads(combinedLeads)
  }, [isAdminMode, leadsHookData])

  // Handle navigation state for filtering (from AppointmentActionModal)
  useEffect(() => {
    if (location.state?.filterLeadId) {
      // Find the lead
      const lead = leads.find(l => l.id === location.state.filterLeadId)
      const leadName = location.state.filterLeadName || (lead ? `${lead.firstName} ${lead.lastName}` : 'Lead')

      // Add to filter (same behavior as members page)
      setLeadFilters([{
        leadId: location.state.filterLeadId,
        leadName: leadName
      }])

      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, leads, navigate, location.pathname])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Ignore if Ctrl/Cmd is pressed (for Ctrl+C copy, etc.)
      if (e.ctrlKey || e.metaKey) return;

      // Check if ANY modal is open
      const anyModalOpen =
        isModalOpen ||
        isEditModalOpenLead ||
        isViewDetailsModalOpen ||
        isTrialModalOpen ||
        isCreateContractModalOpen ||
        isEditColumnModalOpen ||
        isDeleteConfirmationModalOpen ||
        isDocumentModalOpen ||
        isAssessmentSelectionModalOpen ||
        isAssessmentFormModalOpen ||
        isTrialAppointmentModalOpen ||
        isEditTrialModalOpen ||
        isDeleteTrialConfirmationModalOpen ||
        showContractPromptModal ||
        showMedicalHistoryPromptModal ||
        isLeadSpecialNoteModalOpen ||
        showHistoryModalLead ||
        dragConfirmation.isOpen;

      // Also check if any modal overlay is visible in the DOM
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
        document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]');

      // ESC key - Close modals (should work even when modals are open)
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isViewDetailsModalOpen) setIsViewDetailsModalOpen(false);
        else if (isEditModalOpenLead) setIsEditModalOpenLead(false);
        else if (isModalOpen) setIsModalOpen(false);
        else if (isTrialModalOpen) setIsTrialModalOpen(false);
        else if (isCreateContractModalOpen) setIsCreateContractModalOpen(false);
        else if (isDeleteConfirmationModalOpen) setIsDeleteConfirmationModalOpen(false);
        else if (isDocumentModalOpen) setIsDocumentModalOpen(false);
        else if (isAssessmentFormModalOpen) setIsAssessmentFormModalOpen(false);
        else if (isAssessmentSelectionModalOpen) setIsAssessmentSelectionModalOpen(false);
        else if (showContractPromptModal) setShowContractPromptModal(false);
        else if (showMedicalHistoryPromptModal) setShowMedicalHistoryPromptModal(false);
        else if (isLeadSpecialNoteModalOpen) setIsLeadSpecialNoteModalOpen(false);
        else if (showHistoryModalLead) setShowHistoryModalLead(false);
        return;
      }

      if (anyModalOpen || hasVisibleModal) return;

      // C key - Create Lead
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsModalOpen(true);
      }

      // V key - Toggle compact/detailed view
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsCompactView(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    isModalOpen,
    isEditModalOpenLead,
    isViewDetailsModalOpen,
    isTrialModalOpen,
    isCreateContractModalOpen,
    isEditColumnModalOpen,
    isDeleteConfirmationModalOpen,
    isDocumentModalOpen,
    isAssessmentSelectionModalOpen,
    isAssessmentFormModalOpen,
    isTrialAppointmentModalOpen,
    isEditTrialModalOpen,
    isDeleteTrialConfirmationModalOpen,
    showContractPromptModal,
    showMedicalHistoryPromptModal,
    isLeadSpecialNoteModalOpen,
    showHistoryModalLead,
    dragConfirmation.isOpen
  ]);

  // Enforce compact view on mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile && !isCompactView) {
        setIsCompactView(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isCompactView]);

  const handleViewLeadDetails = (lead, tab = "details") => {
    setSelectedLead(lead)
    setSelectedViewTab(tab)
    setIsViewDetailsModalOpen(true)
  }

  const handleAddTrialTraining = (lead) => {
    setSelectedLead(lead)
    setSelectedLeadForTrial(lead)
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

  // Handler for opening EditLeadModal from TrialTrainingModal (by leadId)
  const handleOpenEditLeadModal = (leadId, tab = "note") => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
      setSelectedEditTab(tab === "relations" ? "relations" : "note")
      setIsEditModalOpenLead(true)
    }
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
      if (lead._id === leadId) {
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
            note: primaryNote.text,
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
    // setLeads(updatedLeads)
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
    // setLeads(updatedLeads)
    if (leadToDelete?.source === "localStorage") {
      updateLocalStorage(updatedLeads)
    }
    setIsDeleteConfirmationModalOpen(false)
    setLeadToDelete(null)
    toast.success(t("admin.leads.toast.deleted"))
  }

  const handleOpenDocuments = (lead) => {
    setSelectedLeadForDocuments(lead)
    setIsDocumentModalOpen(true)
  }



  const handleSaveEdit = async (data) => {
    try {
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

      // CRITICAL: Use selectedLead which is already in scope from the parent component
      const leadId = selectedLead?._id || selectedLead?.id

      // console.log('selectedLead:', selectedLead)
      // console.log('leadId from selectedLead:', leadId)
      // console.log('data received from modal:', data)
      // console.log('data.relations:', data.relations)

      if (!leadId) {
        toast.error(t("common.error"))
        return
      }

      // Find the existing lead to get its current data
      const existingLead = leads.find(lead => lead._id === leadId || lead.id === leadId)
      if (!existingLead) {
        toast.error(t("common.error"))
        return
      }

      // ===== FIXED: Relations conversion to match backend schema =====
      let relationsArray = []

      if (data.relations) {
        // console.log('Processing relations:', data.relations)

        // Check if relations is an object with categories
        if (typeof data.relations === 'object' && !Array.isArray(data.relations)) {
          Object.entries(data.relations).forEach(([category, relations]) => {
            if (Array.isArray(relations)) {
              relations.forEach(rel => {
                // Log each relation to see its structure
                // console.log('Processing relation:', rel)

                relationsArray.push({
                  entryType: rel.entryType || rel.type || "manual",
                  name: rel.name || "",
                  leadId: rel.leadId || null,
                  memberId: rel.memberId || null,
                  category: category,
                  // Use relationType for backend, fallback to relation
                  relationType: rel.relationType || rel.relation || "",
                  customRelation: rel.customRelation || null
                })
              })
            }
          })
        }
        // If relations is already an array
        else if (Array.isArray(data.relations)) {
          relationsArray = data.relations.map(rel => ({
            entryType: rel.entryType || rel.type || "manual",
            name: rel.name || "",
            leadId: rel.leadId || null,
            memberId: rel.memberId || null,
            category: rel.category || "family",
            relationType: rel.relationType || rel.relation || "",
            customRelation: rel.customRelation || null
          }))
        }
      }

      // console.log('Converted relations array:', relationsArray)

      // ===== FIXED: SpecialsNotes conversion =====
      let specialsNotesArray = []

      if (data.specialsNotes && Array.isArray(data.specialsNotes)) {
        specialsNotesArray = data.specialsNotes.map(note => {
          // Ensure status is one of the valid enum values
          let validStatus = note.status || "general";
          const validStatuses = ['contract_attempt', 'callback-request', 'interest', 'objection', 'personal_info', 'health', 'follow_up', 'general'];

          if (!validStatuses.includes(validStatus)) {
            console.warn(`Invalid status "${validStatus}", defaulting to "general"`);
            validStatus = "general";
          }

          return {
            status: validStatus,
            note: note.note || note.text || "",
            isImportant: note.isImportant || false,
            valid: (note.startDate || note.endDate || note.valid?.from || note.valid?.until)
              ? {
                from: note.startDate || note.valid?.from || null,
                until: note.endDate || note.valid?.until || null
              }
              : null
          };
        });
      } else if (Array.isArray(data.notes) && data.notes.length > 0) {
        specialsNotesArray = data.notes.map(note => {
          let validStatus = note.status || "general";
          const validStatuses = ['contract_attempt', 'callback-request', 'interest', 'objection', 'personal_info', 'health', 'follow_up', 'general'];

          if (!validStatuses.includes(validStatus)) {
            validStatus = "general";
          }

          return {
            status: validStatus,
            note: note.note || note.text || "",
            isImportant: note.isImportant || false,
            valid: (note.startDate || note.endDate || note.valid?.from || note.valid?.until)
              ? {
                from: note.startDate || note.valid?.from || null,
                until: note.endDate || note.valid?.until || null
              }
              : null
          };
        });
      }

      // console.log('Converted specialsNotes array:', specialsNotesArray)
      // Prepare the update data matching backend schema
      const updateData = {
        firstName: data.firstName || existingLead.firstName,
        lastName: data.surname || data.lastName || existingLead.lastName,
        email: data.email || existingLead.email,
        phone: data.phoneNumber || existingLead.phone,
        telephone: data.telephoneNumber || existingLead.telephone,
        gender: data.gender || existingLead.gender,
        dateOfBirth: data.birthday || existingLead.dateOfBirth,
        city: data.city || existingLead.city,
        street: data.street || existingLead.street,
        country: data.country || existingLead.country,
        zipCode: data.zipCode || existingLead.zipCode,
        column: pendingMove && pendingMove.leadId === leadId ? pendingMove.targetColumnId : (data.status || existingLead.column),
        source: data.source || data.leadSource || existingLead.source,
        about: data.details || existingLead.about,
        trainingGoal: data.trainingGoal || existingLead.trainingGoal,
        specialsNotes: specialsNotesArray,
        relations: relationsArray  // Use the converted array
      }

      // ===== CRITICAL FIX: Create API-ready data with stringified arrays =====
      const apiReadyData = {
        ...updateData,
        specialsNotes: specialsNotesArray.length > 0 ? JSON.stringify(specialsNotesArray) : JSON.stringify([]),
        relations: relationsArray.length > 0 ? JSON.stringify(relationsArray) : JSON.stringify([])
      }

      // console.log('API-ready data (with stringified arrays):', apiReadyData)
      // console.log('specialsNotes as string:', apiReadyData.specialsNotes)
      // console.log('relations as string:', apiReadyData.relations)

      // Dispatch Redux action with the stringified data
      const result = await dispatch(updateLeadByStaffThunk({
        leadId: leadId,
        leadData: apiReadyData  // Use apiReadyData here, NOT updateData
      })).unwrap()

      // console.log('Update result:', result)

      await dispatch(fetchAllLeadsThunk())

      // Clear pending move and show appropriate toast
      if (pendingMove && pendingMove.leadId === leadId) {
        sessionStorage.removeItem('pendingLeadMove')
        const targetColumn = columns.find((c) => c.id === pendingMove.targetColumnId)
        toast.success(t("admin.leads.toast.movedTo", { column: targetColumn?.title || pendingMove.targetColumnId }))
      } else {
        toast.success(t("admin.leads.toast.updated"))
      }

    } catch (error) {
      console.error('Failed to update lead:', error)
      toast.error(error.message || t("admin.leads.toast.updated"))
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
    toast.success(t("admin.leads.toast.columnSaved"))
  }

  const handleTrialModalClose = () => {
    setIsTrialModalOpen(false)
    setSelectedLeadForTrial(null)
    // Reset the flag if user closes without booking
    setShouldMoveToTrialAfterBooking(false)
  }

  // Helper function to check if lead has medical history
  const leadHasMedicalHistory = (lead) => {
    if (!lead || !lead.documents) return false
    return lead.documents.some(doc =>
      doc.type === "medicalHistory" ||
      doc.category === "medicalHistory" ||
      doc.section === "medicalHistory"
    )
  }

  const handleSaveNewTrialTraining = (trialData) => {
    const trialLead = selectedLeadForTrial

    // Create new appointment with unique ID and lead name
    const newAppointment = {
      ...trialData,
      id: Math.max(0, ...trialAppointmentsMain.map(a => a.id), 0) + 1,
      name: trialLead ? trialLead.firstName : trialData.name || "",
      lastName: trialLead ? (trialLead.lastName || "") : trialData.lastName || "",
      leadId: trialLead?.id || null,
      status: "scheduled",
      isTrial: true,
      isCancelled: false,
      isPast: false,
    }

    setTrialAppointmentsMain(prev => [...prev, newAppointment])

    // Always move lead to trial column when booking trial training (if not already there)
    if (trialLead && trialLead.columnId !== "trial") {
      const newLeads = leads.map((l) => {
        if (l.id === trialLead.id) {
          return { ...l, columnId: "trial" }
        }
        return l
      })
      // setLeads(newLeads)

      // Update localStorage
      if (trialLead.source === "localStorage") {
        updateLocalStorage(newLeads)
      }

      toast.success(t("admin.leads.trialAppointments.trialBooked"))
    } else {
      toast.success(t("admin.leads.trialAppointments.trialBookedSuccess"))
    }

    // Reset flag if it was set
    setShouldMoveToTrialAfterBooking(false)
    setIsTrialModalOpen(false)
    setSelectedLeadForTrial(null)

    // Trigger refresh of trial appointments list
    setTrialAppointmentsRefreshKey(prev => prev + 1)

    // Open Medical History Prompt Modal after successful booking
    // BUT ONLY if the lead does NOT have Medical History yet
    if (trialLead && !leadHasMedicalHistory(trialLead)) {
      setShowMedicalHistoryPromptModal(true)
    }
  }

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    // Ensure leads is an array before processing
    const leadsArray = Array.isArray(leads) ? leads : []

    // If leadFilters are active, show only those leads
    if (leadFilters.length > 0) {
      const filterIds = leadFilters.map(f => f.leadId); // Fix: map over leadFilters, not leads
      return leadsArray.filter((lead) => filterIds.includes(lead._id));
    }

    // No live filtering while typing - list only changes when chips are selected
    return leadsArray;
  }, [leads, leadFilters])


  // Get search suggestions for autocomplete
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    return leads.filter((lead) => {
      // Exclude already filtered leads
      const isAlreadyFiltered = leadFilters.some(f => f.leadId === lead._id);
      if (isAlreadyFiltered) return false;

      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.telephoneNumber?.includes(searchQuery);
    }).slice(0, 6);
  };

  // Handle selecting a lead from search suggestions
  const handleSelectLead = (lead) => {
    setLeadFilters([...leadFilters, {
      leadId: lead._id,
      leadName: `${lead.firstName} ${lead.lastName}`.trim()
    }]);
    setSearchQuery("");
    setShowSearchDropdown(false);
    searchInputRef.current?.focus();
  };

  // Handle removing a lead filter
  const handleRemoveLeadFilter = (leadId) => {
    setLeadFilters(leadFilters.filter(f => f.leadId !== leadId));
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && leadFilters.length > 0) {
      // Remove last filter when backspace is pressed with empty input
      setLeadFilters(leadFilters.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get leads for each column
  // In your LeadsManagement component
  const getColumnLeads = useCallback(
    (columnId) => {
      return sortLeads(
        filteredLeads.filter((lead) => lead.column === columnId),  // ← Use column, not status
        columnId
      );
    },
    [filteredLeads, sortLeads]
  )

  const handleManageTrialAppointments = (lead) => {
    setSelectedLead(lead)
    setIsTrialAppointmentModalOpen(true)
  }

  const handleEditTrialAppointment = (appointment) => {
    // Enrich appointment with lead name if not already set
    const lead = selectedLead || leads.find(l => l.id === appointment.leadId)
    const enrichedAppointment = {
      ...appointment,
      name: appointment.name || lead?.firstName || "",
      lastName: appointment.lastName,
      leadId: appointment.leadId || lead?.id || null,
    }
    setSelectedTrialAppointment(enrichedAppointment)
    setIsEditTrialModalOpen(true)
  }

  const handleDeleteTrialAppointment = (appointmentId) => {
    setAppointmentToDelete(appointmentId)
    setIsDeleteTrialConfirmationModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      setTrialAppointmentsMain(prev => prev.filter((apt) => apt.id !== appointmentToDelete))
      toast.success(t("admin.leads.trialAppointments.trialDeleted"))
      setIsDeleteTrialConfirmationModalOpen(false)
      setAppointmentToDelete(null)
      setTrialAppointmentsRefreshKey(prev => prev + 1)
    }
  }

  const handleCreateAssessmentClick = (lead, fromDocManagement = false) => {
    setSelectedLead(lead)
    setAssessmentFromDocumentManagement(fromDocManagement)

    // Close document management modal if coming from there
    if (fromDocManagement) {
      setIsDocumentModalOpen(false)
    }

    setIsAssessmentSelectionModalOpen(true)
  }

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentSelectionModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleAssessmentComplete = (documentData) => {
    // Add the document directly to lead.documents or update it
    (prevLeads =>
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
            // Add new document
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
      // Update selectedLeadForDocuments with the new document
      if (selectedLeadForDocuments && selectedLeadForDocuments.id === selectedLead.id) {
        const existingDocuments = selectedLeadForDocuments.documents || []
        let updatedDocuments
        if (documentData.isEdit) {
          updatedDocuments = existingDocuments.map(doc =>
            doc.id === documentData.id ? documentData : doc
          )
        } else {
          updatedDocuments = [...existingDocuments, documentData]
        }
        setSelectedLeadForDocuments({
          ...selectedLeadForDocuments,
          documents: updatedDocuments,
          hasAssessment: true
        })
      }
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
    (prevLeads =>
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

  const handleMedicalHistoryPromptConfirm = () => {
    setShowMedicalHistoryPromptModal(false)
    // Set a default medical history assessment
    setSelectedAssessment({
      id: 'medical-history-default',
      title: 'Medical History Assessment'
    })
    setIsAssessmentFormModalOpen(true)
    // selectedLead ist bereits gesetzt vom Trial Booking
  }

  const handleMedicalHistoryPromptCancel = () => {
    setShowMedicalHistoryPromptModal(false)
    setSelectedLead(null)
  }

  const handleProceedToContract = () => {
    setIsAssessmentSelectionModalOpen(false)
    handleCreateContract(selectedLead)
  }


  return (
    <div className="min-h-screen rounded-3xl p-6 bg-surface-base transition-all duration-300 ease-in-out flex-1 overflow-x-hidden">


      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-300">{t("admin.leads.adminMode.banner", { studio: studioNameProp || `Studio #${studioIdProp}` })}</p>
            <p className="text-xs text-content-muted">{t("admin.leads.adminMode.description")}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAdminMode && leadsLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Error State */}
      {isAdminMode && leadsError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm">{t("admin.leads.adminMode.failedToLoad", { error: leadsError })}</p>
        </div>
      )}

      {/* Main Content - skip if admin mode and still loading/error */}
      {(!isAdminMode || (!leadsLoading && !leadsError)) && (<>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl text-content-primary font-bold">{t("admin.leads.title")}</h1>

            {/* Compact/Detailed View Toggle - Desktop only */}
            <div className="hidden md:flex items-center gap-2 bg-surface-dark rounded-xl p-1">
              <div className="relative group">
                <button
                  onClick={() => setIsCompactView(!isCompactView)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isCompactView ? "text-primary" : "text-primary"}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-content-faint'}`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-content-faint'}`}></div>
                    </div>
                    <div className="flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-content-faint'}`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-content-faint'}`}></div>
                    </div>
                  </div>
                </button>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{isCompactView ? t("admin.leads.compactView") : t("admin.leads.detailedView")}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">V</span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-surface-dark" />
                </div>
              </div>
            </div>
          </div>

          {/* Create Lead + Sidebar Toggle - always together on the right */}
          <div className="flex items-center gap-2">
            {/* Create Lead Button with Tooltip */}
            <div className="hidden md:block relative group">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex bg-primary hover:bg-primary-hover text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t("admin.leads.createLead")}</span>
              </button>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">{t("admin.leads.createLead")}</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  C
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-surface-dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar with Inline Filter Chips */}
        <div className="mb-4 sm:mb-6" ref={searchDropdownRef}>
          <div className="relative">
            <div
              className="bg-surface-card rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-border focus-within:border-primary transition-colors cursor-text"
              onClick={() => searchInputRef.current?.focus()}
            >
              <Search className="text-content-muted flex-shrink-0" size={16} />

              {/* Filter Chips */}
              {leadFilters.map((filter) => (
                <div
                  key={filter.leadId}
                  className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded-lg px-2 py-1 text-sm"
                >
                  <span className="text-content-primary text-xs whitespace-nowrap">{filter.leadName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLeadFilter(filter.leadId);
                    }}
                    className="p-0.5 hover:bg-primary/30 rounded transition-colors"
                  >
                    <X size={12} className="text-content-muted hover:text-content-primary" />
                  </button>
                </div>
              ))}

              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder={leadFilters.length > 0 ? t("admin.leads.search.addMore") : t("admin.leads.search.placeholder")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-content-primary placeholder-gray-500 [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
              />

              {/* Clear All Button */}
              {leadFilters.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLeadFilters([]);
                  }}
                  className="p-1 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
                  title="Clear all filters"
                >
                  <X size={14} className="text-content-muted hover:text-content-primary" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {getSearchSuggestions().map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() => handleSelectLead(lead)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-button transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-content-primary truncate">{lead.firstName} {lead.lastName}</p>
                      <p className="text-xs text-content-faint truncate">{lead.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3">
                <p className="text-sm text-content-faint text-center">{t("admin.leads.search.noResults")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board with DnD Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll={isMobileView ? {
            enabled: true,
            threshold: { x: 0.1, y: 0.15 },
            acceleration: 15,
            interval: 5,
          } : false}
        >
          {/* Mobile: CSS Grid (1 column), Desktop: Flexbox for equal width columns */}
          <div
            className="
            grid grid-cols-1 gap-4 pb-4
            md:flex md:flex-row md:flex-nowrap md:h-[calc(100vh-220px)] md:min-h-[400px] md:overflow-y-visible
          "
          >
            {columns.map((column) => {
              const isCollapsed = collapsedColumns.includes(column.id)
              const expandedCount = columns.length - collapsedColumns.length;
              const columnLeads = getColumnLeads(column.id)

              // Collapsed state - show minimal bar (horizontal on mobile, vertical on desktop)
              if (isCollapsed) {
                return (
                  <div
                    key={column.id}
                    className="w-full h-12 md:w-12 md:h-full md:flex-shrink-0 transition-all duration-300 ease-in-out overflow-visible hover:z-[100] relative"
                  >
                    <div
                      className="w-full h-full rounded-xl flex flex-row md:flex-col items-center px-3 py-2 md:px-0 md:py-3 transition-colors overflow-visible"
                      style={{ backgroundColor: column.color + '20' }}
                    >
                      {/* === MOBILE LAYOUT === */}
                      {/* Color indicator - first on mobile */}
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0 md:hidden"
                        style={{ backgroundColor: column.color }}
                      />

                      {/* Title - mobile only */}
                      <span className="font-medium text-content-primary text-xs sm:text-sm whitespace-nowrap ml-2 md:hidden">
                        {column.title}
                      </span>

                      {/* Lead count badge - mobile */}
                      <span
                        className="ml-2 shrink-0 text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full md:hidden"
                      >
                        {columnLeads.length}
                      </span>

                      {/* Expand button - right side on mobile */}
                      <div className="relative group flex-shrink-0 hover:z-[100] ml-auto md:hidden">
                        <button
                          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleColumnCollapse(column.id);
                          }}
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
                            className="text-content-muted"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </div>

                      {/* === DESKTOP LAYOUT === */}
                      {/* Expand button - top on desktop */}
                      <div className="relative group flex-shrink-0 hover:z-[100] hidden md:block">
                        <button
                          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleColumnCollapse(column.id);
                          }}
                        >
                          <ChevronRight size={16} className="text-content-muted" />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-0 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                          <span className="font-medium">Expand column</span>
                          <div className="absolute -top-1 left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-surface-dark" />
                        </div>
                      </div>

                      {/* Lead count badge - desktop */}
                      <span
                        className="hidden md:block mt-2 shrink-0 text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full"
                      >
                        {columnLeads.length}
                      </span>

                      {/* Vertical title with color indicator - desktop only */}
                      <div
                        className="hidden md:flex flex-1 items-center justify-center py-4"
                      >
                        <div
                          className="flex items-center gap-2"
                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                          <span className="font-medium text-content-primary text-xs sm:text-sm whitespace-nowrap transform rotate-180">
                            {column.title}
                          </span>
                          <div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0 transform rotate-180"
                            style={{ backgroundColor: column.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Expanded state - show full column
              // Mobile: Grid cell (full width), Desktop: Flex item with equal width
              return (
                <div
                  key={column.id}
                  className="w-full min-h-[300px] md:h-full md:flex-1 md:basis-0 md:min-w-0 transition-all duration-300 ease-in-out overflow-visible"
                >
                  <SortableColumn
                    id={column.id}
                    title={column.title}
                    color={column.color}
                    leads={columnLeads}
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
                    onEditNote={() => { }}
                    onOpenDocuments={handleOpenDocuments}
                    onCreateAssessment={handleCreateAssessmentClick}
                    isCompactView={isCompactView}
                    expandedLeadId={expandedLeadId}
                    setExpandedLeadId={setExpandedLeadId}
                    sortSettings={columnSortSettings[column.id]}
                    onSortChange={(sortBy) => handleSortChange(column.id, sortBy)}
                    onToggleSortOrder={() => handleToggleSortOrder(column.id)}
                    onToggleCollapse={() => toggleColumnCollapse(column.id)}
                  />
                </div>
              )
            })}
          </div>

          {/* Drag Overlay - shows the dragged item */}
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
            style={{ zIndex: 99999 }}
          >
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
                onViewDetails={() => { }}
                onAddTrial={() => { }}
                onCreateContract={() => { }}
                onEditLead={() => { }}
                onDeleteLead={() => { }}
                setShowHistoryModalLead={() => { }}
                setSelectedLead={() => { }}
                onManageTrialAppointments={() => { }}
                onEditNote={() => { }}
                onOpenDocuments={() => { }}
                onCreateAssessment={() => { }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* All Modals (keeping existing) */}
        <AddLeadModal
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onSave={handleSaveLead}
          columns={columns}
          availableMembersLeads={availableMembersLeads}
          leadSources={DEFAULT_LEAD_SOURCES}
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
          leadSources={DEFAULT_LEAD_SOURCES}
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
          lockedLead={selectedLeadForTrial}
          appointmentTypesMain={appointmentTypesData}
          freeAppointmentsMain={freeAppointmentsData}
          leadsData={leadsDataMain}
          leadRelations={memberRelationsLead}
          onOpenEditLeadModal={handleOpenEditLeadModal}
          onSubmit={(trialData) => {
            handleSaveNewTrialTraining(trialData);
          }}
        />

        {isCreateContractModalOpen && (
          <ContractModal
            onClose={() => {
              setIsCreateContractModalOpen(false)
              setSelectedLead(null)
            }}
            onSave={(contractData) => {
              // Check if contract is Active or Ongoing (Draft)
              const contractStatus = contractData.status || "Active"
              const isOngoing = contractStatus === "Ongoing" || contractData.isDraft === true

              // Get member info for filter
              const memberName = contractData.memberName || `${selectedLead?.firstName} ${selectedLead?.surname}`.trim()
              const memberId = contractData.memberId || selectedLead?.id

              if (isOngoing) {
                // Draft contract - keep the lead, don't convert yet
                toast.success(t("admin.leads.contractPrompt.contractDraft"))
              } else {
                // Active contract - delete the lead (lead becomes a member)
                const updatedLeads = leads.filter((lead) => lead.id !== selectedLead?.id)
                // setLeads(updatedLeads)
                if (selectedLead?.source === "localStorage") {
                  updateLocalStorage(updatedLeads)
                }
                toast.success(t("admin.leads.contractPrompt.contractCreated"))
              }

              setIsCreateContractModalOpen(false)
              setSelectedLead(null)

              // Navigate to contracts page with filter set
              navigate("/dashboard/contract", {
                state: {
                  filterMemberId: memberId,
                  filterMemberName: memberName,
                  fromLeads: true
                }
              })
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

        {showHistoryModalLead && selectedLead && (
          <SharedHistoryModal
            variant="lead"
            person={selectedLead}
            history={leadHistoryData}
            onClose={() => setShowHistoryModalLead(false)}
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
          isOpen={isDeleteConfirmationModalOpen}
          onClose={() => {
            setIsDeleteConfirmationModalOpen(false)
            setLeadToDelete(null)
          }}
          onConfirm={confirmDeleteLead}
          title={t("admin.leads.deleteModal.title")}
          message={leadToDelete ? (
            <>
              Are you sure you want to delete <span className="font-semibold">{leadToDelete.firstName} {leadToDelete.surname}</span>? This action cannot be undone.
            </>
          ) : ''}
          confirmText={t("common.delete")}
          isDestructive={true}
        />

        {/* Drag Confirmation Dialog */}
        {dragConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-surface-base w-[95%] sm:w-[90%] md:w-[400px] max-w-md rounded-xl overflow-hidden">
              {/* Header with X button */}
              <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-content-primary">
                  {dragConfirmation.type === "toTrial" ? t("admin.leads.dragConfirmation.toTrialTitle") : t("admin.leads.dragConfirmation.fromTrialTitle")}
                </h3>
                <button
                  onClick={handleCancelDragConfirmation}
                  className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <p className="text-content-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  {dragConfirmation.type === "toTrial"
                    ? t("admin.leads.dragConfirmation.toTrialDesc", { name: `${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""}`.trim() })
                    : t("admin.leads.dragConfirmation.fromTrialDesc", { name: `${dragConfirmation.lead?.firstName} ${dragConfirmation.lead?.surname || ""}`.trim() })}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {dragConfirmation.type === "toTrial" ? (
                    <>
                      <button
                        onClick={handleConfirmToTrialWithBooking}
                        className="w-full px-3 sm:px-4 py-2.5 bg-trial text-white text-sm sm:text-base rounded-xl hover:bg-trial/80 transition-colors"
                      >
                        {t("admin.leads.dragConfirmation.yesBookTrial")}
                      </button>
                      <button
                        onClick={handleConfirmToTrialWithoutBooking}
                        className="w-full px-3 sm:px-4 py-2.5 bg-surface-button-hover text-content-primary text-sm sm:text-base rounded-xl hover:bg-surface-button transition-colors"
                      >
                        {t("admin.leads.dragConfirmation.yesWithoutBooking")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleConfirmFromTrial}
                      className="w-full px-3 sm:px-4 py-2.5 bg-trial text-white text-sm sm:text-base rounded-xl hover:bg-trial/80 transition-colors"
                    >
                      {t("admin.leads.dragConfirmation.yesMoveLead")}
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

        {isEditTrialModalOpen && selectedTrialAppointment && (
          <EditAppointmentModal
            selectedAppointmentMain={selectedTrialAppointment}
            setSelectedAppointmentMain={setSelectedTrialAppointment}
            appointmentTypesMain={appointmentTypesData}
            freeAppointmentsMain={freeAppointmentsData}
            handleAppointmentChange={(changes) =>
              setSelectedTrialAppointment((prev) => ({ ...prev, ...changes }))
            }
            appointmentsMain={trialAppointmentsMain}
            setAppointmentsMain={setTrialAppointmentsMain}
            setIsNotifyMemberOpenMain={() => { }}
            setNotifyActionMain={() => { }}
            onDelete={(id) => {
              handleDeleteTrialAppointment(id)
              setIsEditTrialModalOpen(false)
              setSelectedTrialAppointment(null)
            }}
            onClose={() => {
              setIsEditTrialModalOpen(false)
              setSelectedTrialAppointment(null)
            }}
            onOpenEditMemberModal={() => { }}
            onOpenEditLeadModal={handleOpenEditLeadModal}
            memberRelations={{}}
            leadRelations={memberRelationsLead}
          />
        )}

        <DeleteConfirmationModal
          isOpen={isDeleteTrialConfirmationModalOpen}
          onClose={() => {
            setIsDeleteTrialConfirmationModalOpen(false)
            setAppointmentToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
          title={t("admin.leads.trialAppointments.deleteTitle")}
          message={t("admin.leads.trialAppointments.deleteMessage")}
        />

        <DocumentManagementModal
          entity={selectedLeadForDocuments}
          entityType="lead"
          isOpen={isDocumentModalOpen}
          onClose={() => {
            setIsDocumentModalOpen(false)
            setSelectedLeadForDocuments(null)
          }}
          onCreateAssessment={() => handleCreateAssessmentClick(selectedLeadForDocuments, true)}
          onEditAssessment={(doc) => handleEditAssessmentClick(selectedLeadForDocuments, doc)}
          onViewAssessment={(doc) => handleViewAssessmentClick(selectedLeadForDocuments, doc)}
          onDocumentsUpdate={handleDocumentsUpdate}
          sections={[
            { id: "general", label: t("admin.leads.documents.general"), icon: File },
            { id: "medicalHistory", label: t("admin.leads.documents.medicalHistory"), icon: ClipboardList },
          ]}
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

        <MedicalHistoryPromptModal
          isOpen={showMedicalHistoryPromptModal}
          onClose={handleMedicalHistoryPromptCancel}
          onConfirm={handleMedicalHistoryPromptConfirm}
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


        {/* Floating Action Button - Mobile Only */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label={t("admin.leads.createLead")}
        >
          <Plus size={22} />
        </button>

      </>)}
    </div>
  )
}
