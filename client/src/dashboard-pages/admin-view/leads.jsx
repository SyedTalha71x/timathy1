/* eslint-disable no-unused-vars */
import React from "react"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Plus, X, ChevronLeft, ChevronRight, File, ClipboardList } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"

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
import AddLeadModal from "../../components/admin-dashboard-components/lead-components/add-lead-modal"
import EditLeadModal from "../../components/admin-dashboard-components/lead-components/edit-lead-modal"
import ViewLeadDetailsModal from "../../components/admin-dashboard-components/lead-components/view-lead-details-modal"
import EditColumnModal from "../../components/admin-dashboard-components/lead-components/edit-column-modal"
import LeadHistoryModal from "../../components/admin-dashboard-components/lead-components/lead-history-modal"
import DeleteConfirmationModal from "../../components/admin-dashboard-components/lead-components/delete-confirmation-modal"
import { LeadSpecialNoteModal } from '../../components/admin-dashboard-components/shared/special-note/shared-special-note-modal'

// New DnD components
import SortableColumn from "../../components/admin-dashboard-components/lead-components/sortable-column"
import SortableLeadCard from "../../components/admin-dashboard-components/lead-components/sortable-lead-card"

// Data and hooks
import { 
  hardcodedLeads, 
  availableTimeSlots,
  DEFAULT_LEAD_SOURCES,
} from "../../utils/admin-panel-states/leads-states"
import { trainingVideosData } from "../../utils/studio-states/training-states"
import { availableMembersLeadsMain as availableMembersLeads, appointmentTypesData, freeAppointmentsData, leadsData as leadsDataMain } from "../../utils/studio-states"

export default function LeadManagement() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showHistoryModalLead, setShowHistoryModalLead] = useState(false)

  const [columns, setColumns] = useState([
    { id: "active", title: "Active prospect", color: "#10b981" },
    { id: "passive", title: "Passive prospect", color: "#f59e0b" },
    { id: "uninterested", title: "Uninterested", color: "#ef4444" },
    { id: "missed", title: "Missed Call", color: "#8b5cf6" },
    { id: "trial", title: "Demo Access", color: "#3b82f6", isFixed: true },
  ])

  // ============================================
  // Sorting State
  // ============================================
  const [columnSortSettings, setColumnSortSettings] = useState(() => {
    const initialSettings = {}
    columns.forEach(col => {
      initialSettings[col.id] = {
        sortBy: 'custom',
        sortOrder: 'asc'
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
  const [leadFilters, setLeadFilters] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const [leads, setLeads] = useState([])
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [selectedEditTab, setSelectedEditTab] = useState("details")
  const [selectedViewTab, setSelectedViewTab] = useState("details")
  const [isCompactView, setIsCompactView] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  const [expandedLeadId, setExpandedLeadId] = useState(null)
  const [collapsedColumns, setCollapsedColumns] = useState([])

  // Toggle column collapse
  const toggleColumnCollapse = (columnId) => {
    setCollapsedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  // Lead Special Note Modal states
  const [isLeadSpecialNoteModalOpen, setIsLeadSpecialNoteModalOpen] = useState(false)
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null)
  const [targetColumnForNote, setTargetColumnForNote] = useState(null)

  const [memberRelationsLead, setMemberRelationsLead] = useState({})

  // Demo access confirmation (when dragging to trial column)
  const [showDemoAccessConfirm, setShowDemoAccessConfirm] = useState(false)
  const [pendingDemoLead, setPendingDemoLead] = useState(null)
  const [pendingDemoMoveData, setPendingDemoMoveData] = useState(null)


  // ============================================
  // @dnd-kit State and Logic
  // ============================================
  const [activeId, setActiveId] = useState(null)
  const [activeLead, setActiveLead] = useState(null)

  // Configure sensors for drag detection with mobile optimizations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection that prefers columns
  const collisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    return rectIntersection(args)
  }, [])

  // Get column ID from a droppable ID
  const getColumnId = (id) => {
    if (!id) return null
    if (typeof id === "string" && id.startsWith("column-")) {
      return id.replace("column-", "")
    }
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

    if (activeColumnId && overColumnId && activeColumnId !== overColumnId) {
      // Visual feedback only
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

    const draggedLead = leads.find((l) => l.id === activeId)
    if (!draggedLead) return

    const sourceColumnId = draggedLead.columnId
    let targetColumnId = getColumnId(overId)

    const overLead = leads.find((l) => l.id === overId)
    if (overLead) {
      targetColumnId = overLead.columnId
    }

    if (typeof overId === "string" && overId.startsWith("column-")) {
      targetColumnId = overId.replace("column-", "")
    }

    if (!targetColumnId) return

    // Same column - reorder
    if (sourceColumnId === targetColumnId) {
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
        const otherLeads = leads.filter((l) => l.columnId !== sourceColumnId)
        const newLeads = [...otherLeads, ...reorderedColumnLeads]
        
        setLeads(newLeads)
        updateLocalStorage(newLeads)
        toast.success("Lead reordered")
      }
      return
    }

    // Different column - move directly
    moveLeadToColumn(draggedLead, sourceColumnId, targetColumnId, overId)
  }

  // Move lead to a new column (with trial column interception)
  const moveLeadToColumn = (lead, sourceColumnId, targetColumnId, overId = null) => {
    // Intercept moves to the trial/demo-access column â†’ ask user
    if (targetColumnId === "trial" && sourceColumnId !== "trial") {
      setPendingDemoLead(lead)
      setPendingDemoMoveData({ sourceColumnId, targetColumnId, overId })
      setShowDemoAccessConfirm(true)
      return
    }
    executeLeadMove(lead, sourceColumnId, targetColumnId, overId)
  }

  // Actual move logic (no interception)
  const executeLeadMove = (lead, sourceColumnId, targetColumnId, overId = null) => {
    const targetColumnLeads = leads.filter((l) => l.columnId === targetColumnId)
    
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
      hasDemoAccess: targetColumnId === "trial" ? true : lead.hasDemoAccess,
    }

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

  // Demo access confirmation handlers (drag to trial column)
  const handleDemoConfirmCreate = () => {
    if (pendingDemoLead && pendingDemoMoveData) {
      executeLeadMove(pendingDemoLead, pendingDemoMoveData.sourceColumnId, "trial", pendingDemoMoveData.overId)
      // Navigate to demo access page with lead pre-selected
      navigate('/admin-dashboard/demo-access', {
        state: {
          preSelectedLead: {
            id: pendingDemoLead.id,
            name: `${pendingDemoLead.firstName} ${pendingDemoLead.surname}`.trim(),
            email: pendingDemoLead.email,
            company: pendingDemoLead.studioName || pendingDemoLead.company || '',
          }
        }
      })
    }
    setShowDemoAccessConfirm(false)
    setPendingDemoLead(null)
    setPendingDemoMoveData(null)
  }

  const handleDemoConfirmNoCreate = () => {
    if (pendingDemoLead && pendingDemoMoveData) {
      executeLeadMove(pendingDemoLead, pendingDemoMoveData.sourceColumnId, "trial", pendingDemoMoveData.overId)
    }
    setShowDemoAccessConfirm(false)
    setPendingDemoLead(null)
    setPendingDemoMoveData(null)
  }

  const handleDemoConfirmCancel = () => {
    setShowDemoAccessConfirm(false)
    setPendingDemoLead(null)
    setPendingDemoMoveData(null)
  }

  // Update localStorage helper
  const updateLocalStorage = (updatedLeads) => {
    const localStorageLeads = updatedLeads.filter((l) => l.source === "localStorage")
    localStorage.setItem("leads", JSON.stringify(localStorageLeads))
  }

  // ============================================
  // Sorting Functions
  // ============================================

  const sortLeads = (leadsToSort, columnId) => {
    const settings = columnSortSettings[columnId]
    if (!settings || settings.sortBy === 'custom') {
      return leadsToSort
    }

    const sorted = [...leadsToSort].sort((a, b) => {
      let comparison = 0

      switch (settings.sortBy) {
        case 'name':
          const nameA = `${a.firstName || ''} ${a.surname || ''}`.toLowerCase()
          const nameB = `${b.firstName || ''} ${b.surname || ''}`.toLowerCase()
          comparison = nameA.localeCompare(nameB)
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
  // Existing Logic
  // ============================================

  const trainingVideos = trainingVideosData

  useEffect(() => {
    const storedLeads = localStorage.getItem("leads")
    let combinedLeads = [...hardcodedLeads]
    if (storedLeads) {
      const parsedStoredLeads = JSON.parse(storedLeads).map((lead) => ({
        ...lead,
        source: "localStorage",
        columnId: lead.columnId || (lead.hasDemoAccess ? "trial" : lead.status || "passive"),
      }))
      combinedLeads = [...hardcodedLeads, ...parsedStoredLeads]
    }
    setLeads(combinedLeads)
  }, [])

  // Handle navigation state for filtering (from AppointmentActionModal)
  useEffect(() => {
    if (location.state?.filterLeadId) {
      const lead = leads.find(l => l.id === location.state.filterLeadId)
      const leadName = location.state.filterLeadName || (lead ? (lead.studioName || `${lead.firstName} ${lead.lastName}`) : 'Lead')
      
      setLeadFilters([{
        leadId: location.state.filterLeadId,
        leadName: leadName
      }])
      
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, leads, navigate, location.pathname])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.metaKey) return;
      
      const anyModalOpen = 
        isModalOpen ||
        isEditModalOpenLead ||
        isViewDetailsModalOpen ||
        isEditColumnModalOpen ||
        isDeleteConfirmationModalOpen ||
        isLeadSpecialNoteModalOpen ||
        showHistoryModalLead ||
        showDemoAccessConfirm;
      
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
                              document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]');
      
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showDemoAccessConfirm) handleDemoConfirmCancel();
        else if (isViewDetailsModalOpen) setIsViewDetailsModalOpen(false);
        else if (isEditModalOpenLead) setIsEditModalOpenLead(false);
        else if (isModalOpen) setIsModalOpen(false);
        else if (isDeleteConfirmationModalOpen) { setIsDeleteConfirmationModalOpen(false); setLeadToDelete(null); }
        else if (isLeadSpecialNoteModalOpen) setIsLeadSpecialNoteModalOpen(false);
        else if (showHistoryModalLead) setShowHistoryModalLead(false);
        return;
      }
      
      if (anyModalOpen || hasVisibleModal) return;
      
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    isModalOpen,
    isEditModalOpenLead,
    isViewDetailsModalOpen,
    isEditColumnModalOpen,
    isDeleteConfirmationModalOpen,
    isLeadSpecialNoteModalOpen,
    showHistoryModalLead,
    showDemoAccessConfirm,
  ]);

  // Enforce compact view on mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
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
    // Move lead to demo access column if not already there
    if (lead.columnId !== "trial") {
      const newLeads = leads.map((l) => {
        if (l.id === lead.id) {
          return { ...l, columnId: "trial", hasDemoAccess: true }
        }
        return l
      })
      setLeads(newLeads)
      updateLocalStorage(newLeads)
    }
    // Navigate to demo access page with lead pre-selected and wizard open
    navigate('/admin-dashboard/demo-access', {
      state: {
        preSelectedLead: {
          id: lead.id,
          name: `${lead.firstName} ${lead.surname}`.trim(),
          email: lead.email,
          company: lead.studioName || lead.company || '',
        }
      }
    })
  }



  const handleEditLead = (lead, tab = "details") => {
    setSelectedLead(lead)
    setSelectedEditTab(tab)
    setIsEditModalOpenLead(true)
  }

  const handleDeleteLead = (id) => {
    const lead = leads.find(l => l.id === id)
    if (!lead) return
    setLeadToDelete(lead)
    setIsDeleteConfirmationModalOpen(true)
  }

  const confirmDeleteLead = () => {
    if (!leadToDelete) return
    const updatedLeads = leads.filter((l) => l.id !== leadToDelete.id)
    setLeads(updatedLeads)
    if (leadToDelete.source === "localStorage") {
      updateLocalStorage(updatedLeads)
    }
    setIsDeleteConfirmationModalOpen(false)
    setLeadToDelete(null)
    toast.success("Lead has been deleted")
  }

  const handleEditLeadNote = (lead, targetColumnId = null) => {
    setSelectedLeadForNote(lead)
    setTargetColumnForNote(targetColumnId)
    setIsLeadSpecialNoteModalOpen(true)
  }

  const handleSaveLeadSpecialNote = (leadId, newNote, targetColumnId) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        const existingNotes = lead.notes || []
        const updatedNotes = [newNote, ...existingNotes]
        
        const importantNote = updatedNotes.find(n => n.isImportant)
        const primaryNote = importantNote || updatedNotes[0]
        
        return {
          ...lead,
          notes: updatedNotes,
          specialNote: primaryNote ? {
            text: primaryNote.text,
            isImportant: primaryNote.isImportant,
            startDate: primaryNote.startDate || null,
            endDate: primaryNote.endDate || null,
          } : null,
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

  const handleOpenDocuments = (lead) => {
    setSelectedLeadForDocuments(lead)
    setIsDocumentModalOpen(true)
  }

  const handleSaveLead = (data) => {
    const now = new Date().toISOString()
    const defaultStatus = columns.find(col => col.id !== "trial")?.id || "active"
    
    const newLead = {
      id: `l${Date.now()}`,
      studioName: data.studioName || "",
      firstName: data.firstName,
      surname: data.lastName,
      email: data.email,
      websiteLink: data.websiteLink || "",
      phoneNumber: data.phone,
      telephoneNumber: data.telephoneNumber || "",
      gender: data.gender || "",
      birthday: data.birthday || null,
      street: data.street || "",
      zipCode: data.zipCode || "",
      city: data.city || "",
      country: data.country || "",
      leadSource: data.source || "",
      details: data.details || "",
      numberOfMembers: data.numberOfMembers || "",
      trialPeriod: data.trialPeriod,
      hasDemoAccess: data.hasDemoAccess,
      avatar: data.avatar,
      source: "localStorage",
      status: data.status || defaultStatus,
      columnId: data.hasDemoAccess ? "trial" : data.status || defaultStatus,
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
            studioName: data.studioName || lead.studioName || "",
            firstName: data.firstName,
            surname: data.surname,
            websiteLink: data.websiteLink || lead.websiteLink || "",
            email: data.email,
            phoneNumber: data.phoneNumber,
            telephoneNumber: data.telephoneNumber !== undefined ? data.telephoneNumber : (lead.telephoneNumber || ""),
            gender: data.gender || lead.gender || "",
            street: data.street || lead.street || "",
            zipCode: data.zipCode || lead.zipCode || "",
            city: data.city || lead.city || "",
            country: data.country || lead.country || "",
            leadSource: data.source || lead.leadSource || "",
            details: data.details || lead.details || "",
            numberOfMembers: data.numberOfMembers || lead.numberOfMembers || "",
            trialPeriod: data.trialPeriod,
            hasDemoAccess: pendingMove && pendingMove.leadId === lead.id ? false : data.hasDemoAccess,
            avatar: data.avatar,
            status: pendingMove && pendingMove.leadId === lead.id ? pendingMove.targetColumnId : data.status || lead.status,
            columnId: pendingMove && pendingMove.leadId === lead.id ? pendingMove.targetColumnId : (data.hasDemoAccess ? "trial" : data.status || lead.columnId),
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

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    if (leadFilters.length > 0) {
      const filterIds = leadFilters.map(f => f.leadId);
      return leads.filter((lead) => filterIds.includes(lead.id));
    }
    return leads;
  }, [leads, leadFilters])

  // Get search suggestions for autocomplete
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    return leads.filter((lead) => {
      const isAlreadyFiltered = leadFilters.some(f => f.leadId === lead.id);
      if (isAlreadyFiltered) return false;
      
      const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase();
      const studio = (lead.studioName || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return studio.includes(query) ||
        fullName.includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phoneNumber?.includes(searchQuery) ||
        lead.telephoneNumber?.includes(searchQuery);
    }).slice(0, 6);
  };

  const handleSelectLead = (lead) => {
    setLeadFilters([...leadFilters, {
      leadId: lead.id,
      leadName: lead.studioName || `${lead.firstName} ${lead.surname}`.trim()
    }]);
    setSearchQuery("");
    setShowSearchDropdown(false);
    searchInputRef.current?.focus();
  };

  const handleRemoveLeadFilter = (leadId) => {
    setLeadFilters(leadFilters.filter(f => f.leadId !== leadId));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && leadFilters.length > 0) {
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
  const getColumnLeads = useCallback(
    (columnId) => {
      const columnLeads = filteredLeads.filter((lead) => lead.columnId === columnId)
      return sortLeads(columnLeads, columnId)
    },
    [filteredLeads, columnSortSettings, memberRelationsLead]
  )


  return (
    <div className="min-h-screen rounded-3xl p-6 bg-[#1C1C1C] transition-all duration-300 ease-in-out flex-1 overflow-x-hidden md:overflow-x-visible">
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl text-white font-bold">Leads</h1>
          
          {/* Compact/Detailed View Toggle - Desktop only */}
          <div className="hidden md:flex items-center gap-2 bg-black rounded-xl p-1">
            <span className="text-xs text-gray-400 px-2 hidden sm:inline">View</span>
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
          
              </span>
            </button>
          </div>
        </div>
        
        {/* Create Lead + Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block relative group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create Lead</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="font-medium">Create Lead</span>
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                C
              </span>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar with Inline Filter Chips */}
      <div className="mb-4 sm:mb-6" ref={searchDropdownRef}>
        <div className="relative">
          <div 
            className="bg-[#141414] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-[#333333] focus-within:border-[#3F74FF] transition-colors cursor-text"
            onClick={() => searchInputRef.current?.focus()}
          >
            <Search className="text-gray-400 flex-shrink-0" size={16} />
            
            {/* Filter Chips */}
            {leadFilters.map((filter) => (
              <div 
                key={filter.leadId}
                className="flex items-center gap-1.5 bg-[#3F74FF]/20 border border-[#3F74FF]/40 rounded-lg px-2 py-1 text-sm"
              >
                <span className="text-white text-xs whitespace-nowrap">{filter.leadName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLeadFilter(filter.leadId);
                  }}
                  className="p-0.5 hover:bg-[#3F74FF]/30 rounded transition-colors"
                >
                  <X size={12} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            ))}
            
            {/* Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder={leadFilters.length > 0 ? "Add more..." : "Search leads..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder-gray-500 [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
            />
            
            {/* Clear All Button */}
            {leadFilters.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLeadFilters([]);
                }}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                title="Clear all filters"
              >
                <X size={14} className="text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          
          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden">
              {getSearchSuggestions().map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-bold">{lead.studioName || `${lead.firstName} ${lead.surname}`}</p>
                    {lead.studioName && <p className="text-xs text-gray-400 truncate">{lead.firstName} {lead.surname}</p>}
                    <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No results message */}
          {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
              <p className="text-sm text-gray-500 text-center">No leads found</p>
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
        autoScroll={false}
      >
        <div 
          className="
            grid grid-cols-1 gap-4 pb-4
            md:flex md:flex-row md:flex-nowrap md:h-[calc(100vh-220px)] md:min-h-[400px] md:overflow-y-visible
          "
        >
          {columns.map((column) => {
            const isCollapsed = collapsedColumns.includes(column.id)
            const expandedCount = columns.length - collapsedColumns.length
            const columnLeads = getColumnLeads(column.id)
            
            // Collapsed state
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
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0 md:hidden"
                      style={{ backgroundColor: column.color }}
                    />
                    
                    <span className="font-medium text-white text-xs sm:text-sm whitespace-nowrap ml-2 md:hidden">
                      {column.title}
                    </span>
                    
                    <span 
                      className="ml-2 shrink-0 text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full md:hidden"
                    >
                      {columnLeads.length}
                    </span>
                    
                    <div className="relative group flex-shrink-0 hover:z-[100] ml-auto md:hidden">
                      <button 
                        className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                        onClick={() => toggleColumnCollapse(column.id)}
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
                          className="text-gray-400"
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </div>

                    {/* === DESKTOP LAYOUT === */}
                    <div className="relative group flex-shrink-0 hover:z-[100] hidden md:block">
                      <button 
                        className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                        onClick={() => toggleColumnCollapse(column.id)}
                      >
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      <div className="absolute left-0 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] shadow-lg pointer-events-none">
                        <span className="font-medium">Expand column</span>
                        <div className="absolute -top-1 left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                      </div>
                    </div>
                    
                    <span 
                      className="hidden md:block mt-2 shrink-0 text-xs text-black font-medium bg-white px-2 py-0.5 rounded-full"
                    >
                      {columnLeads.length}
                    </span>
                    
                    <div 
                      className="hidden md:flex flex-1 items-center justify-center py-4"
                    >
                      <div 
                        className="flex items-center gap-2"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                      >
                        <span className="font-medium text-white text-xs sm:text-sm whitespace-nowrap transform rotate-180">
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
            
            // Expanded state
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
                  onEditLead={handleEditLead}
                  onDeleteLead={handleDeleteLead}
                  isEditable={!column.isFixed}
                  onEditColumn={handleEditColumn}
                  memberRelationsLead={memberRelationsLead}
                  setShowHistoryModalLead={setShowHistoryModalLead}
                  setSelectedLead={setSelectedLead}
                  onManageTrialAppointments={() => {}}
                  onEditNote={() => {}}
                  onOpenDocuments={handleOpenDocuments}
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

        {/* Drag Overlay */}
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
              onViewDetails={() => {}}
              onEditLead={() => {}}
              onDeleteLead={() => {}}
              setShowHistoryModalLead={() => {}}
              setSelectedLead={() => {}}
              onManageTrialAppointments={() => {}}
              onEditNote={() => {}}
              onOpenDocuments={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <AddLeadModal 
        isVisible={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLead}
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
          sessionStorage.removeItem('pendingLeadMove')
        }}
        onSave={handleSaveEdit}
        leadData={selectedLead}
        columns={columns}
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
        columns={columns}
        onEditLead={handleEditLead}
        initialTab={selectedViewTab}
      />

      
            
         

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

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
          setLeadToDelete(null)
        }}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        message={leadToDelete ? (
          <>
            Are you sure you want to delete <span className="font-semibold">{leadToDelete.studioName || `${leadToDelete.firstName} ${leadToDelete.surname}`}</span>? This action cannot be undone.
          </>
        ) : ''}
      />

      {/* Demo Access Confirmation Modal (shown when dragging lead to trial column) */}
      {showDemoAccessConfirm && pendingDemoLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-xl max-w-md w-full border border-gray-800">
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <ClipboardList size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Demo Access?</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {pendingDemoLead.studioName || `${pendingDemoLead.firstName} ${pendingDemoLead.surname}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDemoConfirmCancel}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-sm mb-6">
                Would you like to create a demo access for this lead? You will be redirected to configure the demo setup.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDemoConfirmNoCreate}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  No, just move
                </button>
                <button
                  onClick={handleDemoConfirmCreate}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                >
                  Yes, create demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label="Create Lead"
      >
        <Plus size={22} />
      </button>
    </div>
  )
}
