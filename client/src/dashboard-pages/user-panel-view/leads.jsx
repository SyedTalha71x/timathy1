/* eslint-disable no-unused-vars */
import React from "react"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Plus } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

// @dnd-kit imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
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
import { LeadSpecialNoteModal } from "../../components/user-panel-components/lead-user-panel-components/special-note-modal"
import { LeadDocumentModal } from "../../components/user-panel-components/lead-user-panel-components/document-management-modal"
import AssessmentFormModal from "../../components/user-panel-components/lead-user-panel-components/assessment-form-modal"
import AssessmentSelectionModal from "../../components/user-panel-components/lead-user-panel-components/assessment-selection-modal"
import ContractPromptModal from "../../components/user-panel-components/lead-user-panel-components/contract-prompt-modal"

// New DnD components
import SortableColumn from "../../components/user-panel-components/lead-user-panel-components/sortable-column"
import SortableLeadCard from "../../components/user-panel-components/lead-user-panel-components/sortable-lead-card"

// Data and hooks
import { hardcodedLeads, memberRelationsLeadNew } from "../../utils/user-panel-states/lead-states"
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
  const [leadToDeleteId, setLeadToDeleteId] = useState(null)
  const [selectedEditTab, setSelectedEditTab] = useState("details")
  const [selectedViewTab, setSelectedViewTab] = useState("details")

  // Assessment states
  const [isAssessmentSelectionModalOpen, setIsAssessmentSelectionModalOpen] = useState(false)
  const [isAssessmentFormModalOpen, setIsAssessmentFormModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [completedAssessments, setCompletedAssessments] = useState({})

  // Trial states
  const [isTrialAppointmentModalOpen, setIsTrialAppointmentModalOpen] = useState(false)
  const [isEditTrialModalOpen, setIsEditTrialModalOpen] = useState(false)
  const [isDeleteTrialConfirmationModalOpen, setIsDeleteTrialConfirmationModalOpen] = useState(false)
  const [selectedTrialAppointment, setSelectedTrialAppointment] = useState(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)
  const [showContractPromptModal, setShowContractPromptModal] = useState(false)

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

  const [specialNoteModal, setSpecialNoteModal] = useState({
    isOpen: false,
    lead: null,
    targetColumnId: "",
    onSave: null,
  })

  // Configure sensors for drag detection with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15, // Increased from 8px to reduce accidental drags
        delay: 150, // Add 150ms delay for touch devices
        tolerance: 5, // Allow 5px movement during delay
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

  // Move lead with special note (from trial column)
  const moveLeadWithNote = (lead, sourceColumnId, targetColumnId, specialNote) => {
    const updatedLead = {
      ...lead,
      columnId: targetColumnId,
      hasTrialTraining: false,
      status: targetColumnId,
      specialNote: {
        text: specialNote.text || lead.specialNote?.text || "",
        isImportant: specialNote.isImportant ?? lead.specialNote?.isImportant ?? false,
        startDate: specialNote.startDate || lead.specialNote?.startDate || null,
        endDate: specialNote.endDate || lead.specialNote?.endDate || null,
      },
    }

    const newLeads = leads.map((l) => (l.id === lead.id ? updatedLead : l))
    setLeads(newLeads)
    updateLocalStorage(newLeads)

    const targetColumn = columns.find((c) => c.id === targetColumnId)
    toast.success(`Lead moved to ${targetColumn?.title || targetColumnId} with note`)
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

  // Handle drag confirmation (from trial)
  const handleConfirmFromTrial = () => {
    const { lead, targetColumnId } = dragConfirmation
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
    
    setSpecialNoteModal({
      isOpen: true,
      lead,
      targetColumnId,
      onSave: (specialNoteData) => {
        moveLeadWithNote(lead, "trial", targetColumnId, specialNoteData)
        setSpecialNoteModal((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  // Cancel drag confirmation
  const handleCancelDragConfirmation = () => {
    setDragConfirmation((prev) => ({ ...prev, isOpen: false }))
  }

  // Cancel special note modal
  const handleSpecialNoteCancel = () => {
    setSpecialNoteModal((prev) => ({ ...prev, isOpen: false }))
  }

  // ============================================
  // Existing Logic (keeping all your original code)
  // ============================================

  const trainingVideos = trainingVideosData

  const handleCreateNewTrial = (lead) => {
    setSelectedLead(lead)
    setIsTrialModalOpen(true)
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
    setLeadToDeleteId(id)
    setIsDeleteConfirmationModalOpen(true)
  }

  const confirmDeleteLead = () => {
    const leadToDelete = leads.find((lead) => lead.id === leadToDeleteId)
    const updatedLeads = leads.filter((lead) => lead.id !== leadToDeleteId)
    setLeads(updatedLeads)
    if (leadToDelete?.source === "localStorage") {
      updateLocalStorage(updatedLeads)
    }
    setIsDeleteConfirmationModalOpen(false)
    toast.success("Lead has been deleted")
  }

  const handleOpenDocuments = (lead) => {
    setSelectedLeadForDocuments(lead)
    setIsDocumentModalOpen(true)
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
      company: data.company || "",
      interestedIn: data.interestedIn || "",
      birthday: data.birthday || null,
      address: data.address || "",
    }
    const updatedLeads = [...leads, newLead]
    setLeads(updatedLeads)
    updateLocalStorage(updatedLeads)
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
            company: data.company || lead.company,
            interestedIn: data.interestedIn || lead.interestedIn,
            birthday: data.birthday || lead.birthday,
            address: data.address || lead.address,
          }
        : lead
    )
    setLeads(updatedLeads)
    updateLocalStorage(updatedLeads)
    toast.success("Lead has been updated")
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
  }

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phoneNumber?.includes(searchQuery)
      )
    })
  }, [leads, searchQuery])

  // Get leads for each column
  const getColumnLeads = useCallback(
    (columnId) => {
      return filteredLeads.filter((lead) => lead.columnId === columnId)
    },
    [filteredLeads]
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
    }
  }

  const handleCreateAssessmentClick = (lead) => {
    setSelectedLead(lead)
    setIsAssessmentSelectionModalOpen(true)
  }

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentSelectionModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleAssessmentComplete = (assessmentData) => {
    setCompletedAssessments((prev) => ({
      ...prev,
      [assessmentData.leadId]: assessmentData,
    }))

    const updatedLeads = leads.map((lead) =>
      lead.id === assessmentData.leadId
        ? { ...lead, hasAssessment: true, assessmentCompletedAt: assessmentData.completedAt }
        : lead
    )
    setLeads(updatedLeads)
    setIsAssessmentFormModalOpen(false)
    setSelectedAssessment(null)
    setShowContractPromptModal(true)
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
          <h1 className="text-xl sm:text-2xl text-white font-bold">Leads</h1>
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
            className="bg-orange-500 hover:bg-[#E64D2E] text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 flex-1 sm:flex-none justify-center"
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
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-h-[600px]">
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
      <AddLeadModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />

      <EditLeadModal
        isVisible={isEditModalOpenLead}
        onClose={() => {
          setIsEditModalOpenLead(false)
          setSelectedLead(null)
          setSelectedEditTab("details")
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
        relationOptions={relationOptions}
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
        onEditLead={handleEditLead}
        initialTab={selectedViewTab}
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
          { id: "slot1", date: "2025-09-08", time: "09:00" },
          { id: "slot2", date: "2025-09-08", time: "10:30" },
          { id: "slot3", date: "2025-09-08", time: "14:00" },
          { id: "slot4", date: "2025-09-08", time: "16:00" },
          { id: "slot5", date: "2025-09-09", time: "08:00" },
          { id: "slot6", date: "2025-09-09", time: "11:00" },
          { id: "slot7", date: "2025-09-09", time: "15:30" },
          { id: "slot8", date: "2025-09-09", time: "17:00" },
          { id: "slot9", date: "2025-09-10", time: "09:30" },
          { id: "slot10", date: "2025-09-10", time: "12:00" },
          { id: "slot11", date: "2025-09-10", time: "14:30" },
          { id: "slot12", date: "2025-09-11", time: "10:00" },
          { id: "slot13", date: "2025-09-11", time: "13:00" },
          { id: "slot14", date: "2025-09-11", time: "16:30" },
          { id: "slot15", date: "2025-09-12", time: "08:30" },
          { id: "slot16", date: "2025-09-12", time: "11:30" },
          { id: "slot17", date: "2025-09-12", time: "15:00" },
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
        isVisible={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={confirmDeleteLead}
        message="Are you sure you want to delete this lead?"
      />

      {/* Drag Confirmation Dialog */}
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
                onClick={handleCancelDragConfirmation}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={dragConfirmation.type === "toTrial" ? handleConfirmToTrial : handleConfirmFromTrial}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <LeadSpecialNoteModal
        isOpen={specialNoteModal.isOpen}
        onClose={handleSpecialNoteCancel}
        lead={specialNoteModal.lead}
        onSave={specialNoteModal.onSave}
        targetColumnId={specialNoteModal.targetColumnId}
      />

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
      />

      <EditTrialModal
        isOpen={isEditTrialModalOpen}
        onClose={() => {
          setIsEditTrialModalOpen(false)
          setSelectedTrialAppointment(null)
        }}
        appointment={selectedTrialAppointment}
        trialTypes={[]}
        freeTimeSlots={[]}
        availableMembersLeads={[]}
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

      <LeadDocumentModal
        lead={selectedLeadForDocuments}
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false)
          setSelectedLeadForDocuments(null)
        }}
      />

      <AssessmentSelectionModal
        isOpen={isAssessmentSelectionModalOpen}
        onClose={() => setIsAssessmentSelectionModalOpen(false)}
        onSelectAssessment={handleAssessmentSelect}
        onProceedToContract={handleProceedToContract}
        selectedLead={selectedLead}
      />

      <AssessmentFormModal
        isOpen={isAssessmentFormModalOpen}
        onClose={() => {
          setIsAssessmentFormModalOpen(false)
          setSelectedAssessment(null)
        }}
        assessment={selectedAssessment}
        selectedLead={selectedLead}
        onComplete={handleAssessmentComplete}
        onProceedToContract={handleProceedToContract}
      />

      <ContractPromptModal
        isOpen={showContractPromptModal}
        onClose={handleContractPromptCancel}
        onConfirm={handleContractPromptConfirm}
        leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.surname}` : ""}
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
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
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
