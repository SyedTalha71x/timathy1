
/* eslint-disable no-unused-vars */
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Plus } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { AddContractModal } from "../../components/lead-components/add-contract-modal"
import AddLeadModal from "../../components/lead-user-panel-components/add-lead-modal"
import EditLeadModal from "../../components/lead-user-panel-components/edit-lead-modal"
import ViewLeadDetailsModal from "../../components/lead-user-panel-components/view-lead-details-modal"
import ConfirmationModal from "../../components/lead-user-panel-components/confirmation-modal"
import EditColumnModal from "../../components/lead-user-panel-components/edit-column-modal"
import TrialTrainingModal from "../../components/lead-user-panel-components/add-trial-planning"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import LeadHistoryModal from "../../components/lead-user-panel-components/lead-history-modal"
import TrialAppointmentModal from "../../components/lead-user-panel-components/trial-appointment-modal"
import EditTrialModal from "../../components/lead-user-panel-components/edit-trial-modal"
import DeleteConfirmationModal from "../../components/lead-user-panel-components/delete-confirmation-modal"
import Column from "../../components/lead-user-panel-components/column"
import { hardcodedLeads, memberRelationsLeadNew } from "../../utils/user-panel-states/lead-states"

// sidebar related imports
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import EditTaskModal from "../../components/task-components/edit-task-modal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import Sidebar from "../../components/central-sidebar"
import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

export default function LeadManagement() {
  const sidebarSystem = useSidebarSystem()
  const navigate = useNavigate()
  const [showHistoryModalLead, setShowHistoryModalLead] = useState(false)

  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Trial Training Arranged", color: "#3b82f6", isFixed: true },
  ])
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
  const [selectedEditTab, setSelectedEditTab] = useState("details") // New state for EditLeadModal tab

  const [isTrialAppointmentModalOpen, setIsTrialAppointmentModalOpen] = useState(false)
  const [isEditTrialModalOpen, setIsEditTrialModalOpen] = useState(false)
  const [isDeleteTrialConfirmationModalOpen, setIsDeleteTrialConfirmationModalOpen] = useState(false)
  const [selectedTrialAppointment, setSelectedTrialAppointment] = useState(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  const [memberRelationsLead, setMemberRelationsLead] = useState(memberRelationsLeadNew)

  const [editingRelationsLead, setEditingRelationsLead] = useState(false)
  const [newRelationLead, setNewRelationLead] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  const columnRefs = useRef({})
  const trainingVideos = trainingVideosData

  // Main Lead related Relations functions
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
      (rel) => rel.id !== relationId,
    )
    setMemberRelationsLead(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  useEffect(() => {
    columns.forEach((column) => {
      if (!columnRefs.current[column.id]) {
        columnRefs.current[column.id] = React.createRef()
      }
    })
  }, [columns])

  useEffect(() => {
    const storedLeads = localStorage.getItem("leads")
    let combinedLeads = [...hardcodedLeads]
    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map((lead) => ({
        ...lead,
        source: "localStorage",
        columnId: lead.columnId || (lead.hasTrialTraining ? "trial" : lead.status || "passive"),
        dragVersion: 0, // Initialize dragVersion
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
      dragVersion: 0, // Initialize dragVersion
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
  const [specialNoteText, setSpecialNoteText] = useState("") // State for the textarea value

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

    if (!targetColumnId || targetColumnId === sourceColumnId) {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === lead.id ? { ...l, dragVersion: (l.dragVersion || 0) + 1 } : l)),
      )
      return
    }

    // If we found a target column and it's different from source
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
          setLeads((prevLeads) =>
            prevLeads.map((l) => (l.id === lead.id ? { ...l, dragVersion: (l.dragVersion || 0) + 1 } : l)),
          )
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
          setLeads((prevLeads) =>
            prevLeads.map((l) => (l.id === lead.id ? { ...l, dragVersion: (l.dragVersion || 0) + 1 } : l)),
          )
        },
      })
      return
    }

    // Normal drag and drop for other columns
    moveLeadToColumn(lead, sourceColumnId, targetColumnId, targetIndex)
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
      dragVersion: 0,
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
      dragVersion: 0,
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
    if (dragConfirmation.lead) {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === dragConfirmation.lead.id ? { ...l, dragVersion: (l.dragVersion || 0) + 1 } : l)),
      )
    }
  }

  const handleSpecialNoteCancel = () => {
    setSpecialNoteModal((prev) => ({ ...prev, isOpen: false }))
    // Reset lead position when special note modal is canceled
    if (specialNoteModal.lead) {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === specialNoteModal.lead.id ? { ...l, dragVersion: (l.dragVersion || 0) + 1 } : l)),
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

  // sidebar related logic and all things
  const {
    // States
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
    isBirthdayMessageModalOpen,
    selectedBirthdayPerson,
    birthdayMessage,
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
    selectedMember,
    isMemberOverviewModalOpen,
    isMemberDetailsModalOpen,
    activeMemberDetailsTab,
    isEditModalOpen,
    editModalTab,
    isNotifyMemberOpen,
    notifyAction,
    showHistoryModal,
    historyTab,
    memberHistory,
    currentBillingPeriod,
    tempContingent,
    selectedBillingPeriod,
    showAddBillingPeriodModal,
    newBillingPeriod,
    showContingentModal,
    editingRelations,
    newRelation,
    editForm,
    widgets,
    rightSidebarWidgets,
    notePopoverRef,

    // Setters
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
    setIsBirthdayMessageModalOpen,
    setSelectedBirthdayPerson,
    setBirthdayMessage,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setShowAppointmentModal,
    setFreeAppointments,
    setSelectedMember,
    setIsMemberOverviewModalOpen,
    setIsMemberDetailsModalOpen,
    setActiveMemberDetailsTab,
    setIsEditModalOpen,
    setEditModalTab,
    setIsNotifyMemberOpen,
    setNotifyAction,
    setShowHistoryModal,
    setHistoryTab,
    setMemberHistory,
    setCurrentBillingPeriod,
    setTempContingent,
    setSelectedBillingPeriod,
    setShowAddBillingPeriodModal,
    setNewBillingPeriod,
    setShowContingentModal,
    setEditingRelations,
    setNewRelation,
    setEditForm,
    setWidgets,
    setRightSidebarWidgets,

    // Functions
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
    handleEditAppointment,
    handleCreateNewAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    calculateAge,
    isContractExpiringSoon,
    redirectToContract,
    handleCalendarFromOverview,
    handleHistoryFromOverview,
    handleCommunicationFromOverview,
    handleViewDetailedInfo,
    handleEditFromOverview,
    getMemberAppointments,
    handleManageContingent,
    getBillingPeriods,
    handleAddBillingPeriod,
    handleSaveContingent,
    handleInputChange,
    handleEditSubmit,
    handleAddRelation,
    handleDeleteRelation,
    handleArchiveMember,
    handleUnarchiveMember,
    truncateUrl,
    renderSpecialNoteIcon,

    // new states
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
    memberContingentData,
    setMemberContingentData,
    memberRelations,
    setMemberRelations,

    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,

    todoFilterOptions,
    relationOptions,
    appointmentTypes,
  } = sidebarSystem

  // more sidebar related functions

  // Chart configuration
  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ]

  const chartOptions = {
    chart: {
      type: "line",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 4, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -30,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
    },
    title: {
      text: memberTypes[selectedMemberType].title,
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
      align: "left",
      style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
        '<span style="color: black;">' +
        series[seriesIndex][dataPointIndex] +
        "</span></div>",
    },
  }

  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos)
  }

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos)
  }

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos)
  }

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos)
  }

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments)
  }

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments)
  }

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  }

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  }

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments)
  }

  const getMemberAppointmentsWrapper = (memberId) => {
    return getMemberAppointments(memberId, appointments)
  }

  const handleAddBillingPeriodWrapper = () => {
    handleAddBillingPeriod(memberContingentData, setMemberContingentData)
  }

  const handleSaveContingentWrapper = () => {
    handleSaveContingent(memberContingentData, setMemberContingentData)
  }

  const handleEditSubmitWrapper = (e) => {
    handleEditSubmit(e, appointments, setAppointments)
  }

  const handleAddRelationWrapper = () => {
    handleAddRelation(memberRelations, setMemberRelations)
  }

  const handleDeleteRelationWrapper = (category, relationId) => {
    handleDeleteRelation(category, relationId, memberRelations, setMemberRelations)
  }

  const handleArchiveMemberWrapper = (memberId) => {
    handleArchiveMember(memberId, appointments, setAppointments)
  }

  const handleUnarchiveMemberWrapper = (memberId) => {
    handleUnarchiveMember(memberId, appointments, setAppointments)
  }

  const getBillingPeriodsWrapper = (memberId) => {
    return getBillingPeriods(memberId, memberContingentData)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVideoById = (id) => {
    return trainingVideos.find((video) => video.id === id)
  }

  return (
    <div
      className={`
      min-h-screen rounded-3xl p-6 bg-[#1C1C1C]
      transition-all duration-300 ease-in-out flex-1

    `}
    >
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
      </style>
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
            memberRelationsLead={memberRelationsLead}
            setShowHistoryModalLead={setShowHistoryModalLead}
            setSelectedLead={setSelectedLead} // ADD THIS LINE - this was missing!
            onManageTrialAppointments={handleManageTrialAppointments}
          />
        ))}
      </div>
      <AddLeadModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />

      <EditLeadModal
        isVisible={isEditModalOpenLead}
        onClose={() => {
          setIsEditModalOpenLead(false)
          setSelectedLead(null)
          setSelectedEditTab("details") // Reset tab on close
        }}
        onSave={handleSaveEdit}
        leadData={selectedLead}
        memberRelationsLead={memberRelationsLead}
        setMemberRelationsLead={setMemberRelationsLead}
        // Relations props
        editingRelationsLead={editingRelationsLead}
        setEditingRelationsLead={setEditingRelationsLead}
        newRelationLead={newRelationLead}
        setNewRelationLead={setNewRelationLead}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelationLead={handleAddRelationLead}
        handleDeleteRelationLead={handleDeleteRelationLead}
        initialTab={selectedEditTab} // Pass the initial tab
      />
      <ViewLeadDetailsModal
        isVisible={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedLead(null)
        }}
        leadData={selectedLead}
        memberRelationsLead={memberRelationsLead}
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
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Please add a special note for {specialNoteModal.lead?.firstName} {specialNoteModal.lead?.surname}:
            </p>
            <textarea
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
              placeholder="Enter special note..."
              onChange={(e) => setSpecialNoteText(e.target.value)}
              value={specialNoteText}
            />
            <div className="flex gap-2 sm:gap-3 mt-4">
              <button
                onClick={handleSpecialNoteCancel}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (specialNoteText.trim()) {
                    specialNoteModal.onSave(specialNoteText)
                    setSpecialNoteText("")
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

      {/* Sidebar related modals and logic  */}
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
        chartOptions={chartOptions}
        chartSeries={chartSeries}
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
      />

      {isRightSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={toggleRightSidebar} aria-hidden="true"></div>
      )}

      <TrainingPlanModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => setIsTrainingPlanModalOpen(false)}
        user={selectedUserForTrainingPlan}
        trainingPlans={mockTrainingPlans}
        getDifficultyColor={getDifficultyColor}
        getVideoById={getVideoById}
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

      <MemberOverviewModal
        isOpen={isMemberOverviewModalOpen}
        onClose={() => {
          setIsMemberOverviewModalOpen(false)
          setSelectedMember(null)
        }}
        selectedMember={selectedMember}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        handleCalendarFromOverview={handleCalendarFromOverview}
        handleHistoryFromOverview={handleHistoryFromOverview}
        handleCommunicationFromOverview={handleCommunicationFromOverview}
        handleViewDetailedInfo={handleViewDetailedInfo}
        handleEditFromOverview={handleEditFromOverview}
      />

      <AppointmentModal
        show={showAppointmentModal}
        member={selectedMember}
        onClose={() => {
          setShowAppointmentModal(false)
          setSelectedMember(null)
        }}
        getMemberAppointments={getMemberAppointmentsWrapper}
        appointmentTypes={appointmentTypes}
        handleEditAppointment={handleEditAppointment}
        handleCancelAppointment={handleCancelAppointment}
        currentBillingPeriod={currentBillingPeriod}
        memberContingentData={memberContingentData}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedMember(null)
        }}
        selectedMember={selectedMember}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        memberHistory={memberHistory}
      />

      <MemberDetailsModal
        isOpen={isMemberDetailsModalOpen}
        onClose={() => {
          setIsMemberDetailsModalOpen(false)
          setSelectedMember(null)
        }}
        selectedMember={selectedMember}
        memberRelations={memberRelations}
        DefaultAvatar={DefaultAvatar}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        redirectToContract={redirectToContract}
      />

      <ContingentModal
        show={showContingentModal}
        setShow={setShowContingentModal}
        selectedMember={selectedMember}
        getBillingPeriods={getBillingPeriodsWrapper}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={setSelectedBillingPeriod}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleSaveContingent={handleSaveContingentWrapper}
      />

      <AddBillingPeriodModal
        show={showAddBillingPeriodModal}
        setShow={setShowAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        handleAddBillingPeriod={handleAddBillingPeriodWrapper}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedMember(null)
        }}
        selectedMember={selectedMember}
        editModalTab={editModalTab}
        setEditModalTab={setEditModalTab}
        editForm={editForm}
        handleInputChange={handleInputChange}
        handleEditSubmit={handleEditSubmitWrapper}
        editingRelations={editingRelations}
        setEditingRelations={setEditingRelations}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelation={handleAddRelationWrapper}
        memberRelations={memberRelations}
        handleDeleteRelation={handleDeleteRelationWrapper}
        handleArchiveMember={handleArchiveMemberWrapper}
        handleUnarchiveMember={handleUnarchiveMemberWrapper}
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
