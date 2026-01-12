/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { Search, Plus, X, GripVertical, Edit, Copy, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Grid3x3, List, Paperclip, Tag, Pin, PinOff, ArrowRightLeft, Info } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CreateNoteModal from "../../components/user-panel-components/notes-components/CreateNoteModal"
import EditNoteModal from "../../components/user-panel-components/notes-components/EditNoteModal"
import DeleteConfirmModal from "../../components/user-panel-components/notes-components/DeleteConfirmModal"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

// Available tags
const AVAILABLE_TAGS = [
  { id: 'urgent', label: 'Urgent', color: '#ef4444' },
  { id: 'meeting', label: 'Meeting', color: '#3b82f6' },
  { id: 'ideas', label: 'Ideas', color: '#8b5cf6' },
  { id: 'todo', label: 'Todo', color: '#f59e0b' },
  { id: 'training', label: 'Training', color: '#10b981' },
  { id: 'member', label: 'Member', color: '#ec4899' },
]

// Demo notes with tags and dates before 2026
const DEMO_NOTES = {
  personal: [
    {
      id: 1,
      title: "Quarterly Review Meeting Notes",
      content: "Discussed Q4 goals and performance metrics. Team showed 15% improvement in customer satisfaction. Need to focus on reducing response time in support tickets.",
      tags: ['meeting', 'urgent'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-12-15T10:30:00",
      updatedAt: "2025-12-20T14:45:00"
    },
    {
      id: 2,
      title: "New Member Orientation Checklist",
      content: "1. Welcome package preparation\n2. Training schedule setup\n3. Facility tour arrangement\n4. Equipment assignment\n5. Introduction to team members",
      tags: ['member', 'todo'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-11-28T09:15:00",
      updatedAt: "2025-11-28T09:15:00"
    },
    {
      id: 3,
      title: "Innovative Class Ideas for Spring",
      content: "Brainstorming session results:\n- Morning yoga fusion classes\n- High-intensity interval training bootcamp\n- Mindfulness and meditation sessions\n- Outdoor training programs\n- Virtual reality fitness experiences",
      tags: ['ideas', 'training'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-10-05T16:20:00",
      updatedAt: "2025-12-10T11:30:00"
    },
    {
      id: 4,
      title: "Equipment Maintenance Schedule",
      content: "Monthly maintenance tasks completed. All treadmills serviced, weights checked, and cardio machines calibrated. Next maintenance due in 4 weeks.",
      tags: ['todo'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-09-18T13:00:00",
      updatedAt: "2025-09-18T13:00:00"
    },
    {
      id: 5,
      title: "Staff Training Workshop - Customer Service Excellence",
      content: "Workshop covered conflict resolution, communication techniques, and member retention strategies. Very productive session with excellent team engagement and feedback.",
      tags: ['training', 'meeting'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-08-22T14:30:00",
      updatedAt: "2025-08-25T10:00:00"
    },
    {
      id: 6,
      title: "Budget Planning for Next Year",
      content: "Review financial projections, allocate resources for equipment upgrades, marketing campaigns, and staff development programs. Priority areas identified.",
      tags: ['urgent', 'meeting'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-07-30T15:45:00",
      updatedAt: "2025-07-30T15:45:00"
    },
  ],
  studio: [
    {
      id: 201,
      title: "Studio Class Schedule Update",
      content: "New yoga and pilates classes added for morning sessions. Updated schedule starts next Monday. Need to notify all members via email and app notifications.",
      tags: ['meeting', 'urgent'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-12-10T08:30:00",
      updatedAt: "2025-12-18T16:20:00"
    },
    {
      id: 202,
      title: "Studio Equipment Order",
      content: "Ordered new yoga mats (50), resistance bands (30), and foam rollers (25). Expected delivery in 2 weeks. Total budget: $2,500. Store in equipment room upon arrival.",
      tags: ['todo'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-11-15T14:00:00",
      updatedAt: "2025-11-15T14:00:00"
    },
    {
      id: 203,
      title: "Instructor Training - New Techniques",
      content: "All studio instructors completed advanced training in functional movement and injury prevention. Certificates issued. Next training session scheduled for Q2 2026.",
      tags: ['training'],
      attachments: [],
      isPinned: true,
      createdAt: "2025-10-28T10:15:00",
      updatedAt: "2025-10-30T09:00:00"
    },
    {
      id: 204,
      title: "Studio Cleaning Protocol",
      content: "Enhanced cleaning procedures implemented. Deep clean every evening, equipment sanitization after each class, air filtration system upgraded. Member feedback very positive.",
      tags: ['todo'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-09-05T11:45:00",
      updatedAt: "2025-09-05T11:45:00"
    },
    {
      id: 205,
      title: "Member Feedback - Studio Classes",
      content: "Collected feedback from 150+ members. 92% satisfaction rate. Top requests: more evening classes, longer weekend sessions, and specialized workshops. Action plan created.",
      tags: ['member', 'ideas'],
      attachments: [],
      isPinned: false,
      createdAt: "2025-08-12T15:30:00",
      updatedAt: "2025-08-20T10:00:00"
    },
  ]
}

// Sortable Note Card Component
const SortableNoteCard = ({ note, children, isDragDisabled, viewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: note.id,
    disabled: isDragDisabled 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!isDragDisabled && (
        <div 
          {...attributes} 
          {...listeners}
          className={`absolute ${viewMode === 'grid' ? 'top-3 left-3' : 'top-1/2 -translate-y-1/2 left-2'} cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1 rounded transition-colors z-10 w-6 flex items-center justify-center`}
        >
          <GripVertical size={16} />
        </div>
      )}
      {!isDragDisabled && note.isPinned && viewMode === 'grid' && (
        <div className="absolute top-10 left-3 z-10 w-6 flex items-center justify-center">
          <Pin
            size={14}
            className="text-orange-400 fill-orange-400"
            aria-label="Note is pinned"
          />
        </div>
      )}
      {children}
    </div>
  )
}

export default function NotesApp() {
  const sidebarSystem = useSidebarSystem()
  const [activeTab, setActiveTab] = useState("personal")
  const [notes, setNotes] = useState(DEMO_NOTES)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewingNote, setViewingNote] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  // New feature states
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("list") // 'grid' or 'list' - default is list
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'custom'
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' = Pfeil nach oben, aber neueste zuerst
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedTags, setSelectedTags] = useState([]) // Filter by tags
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState(AVAILABLE_TAGS)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF843E")
  const [viewingImage, setViewingImage] = useState(null) // { image, images, index }
  const [showTagInfoTooltip, setShowTagInfoTooltip] = useState(false)
  const [showPersonalTooltip, setShowPersonalTooltip] = useState(false)
  const [showStudioTooltip, setShowStudioTooltip] = useState(false)
  const sortDropdownRef = useRef(null)
  const tagInfoTooltipRef = useRef(null)
  const personalTooltipRef = useRef(null)
  const studioTooltipRef = useRef(null)

  const trainingVideos = trainingVideosData

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      setDropdownOpen(null)
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (tagInfoTooltipRef.current && !tagInfoTooltipRef.current.contains(event.target)) {
        setShowTagInfoTooltip(false)
      }
      if (personalTooltipRef.current && !personalTooltipRef.current.contains(event.target)) {
        setShowPersonalTooltip(false)
      }
      if (studioTooltipRef.current && !studioTooltipRef.current.contains(event.target)) {
        setShowStudioTooltip(false)
      }
    }
    
    const handleScroll = () => {
      setShowTagInfoTooltip(false)
      setShowPersonalTooltip(false)
      setShowStudioTooltip(false)
    }
    
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('scroll', handleScroll, true) // true = capture phase (catches all scrolls)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

  // Close lightbox with ESC key and navigate with arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!viewingImage) return
      
      if (event.key === 'Escape') {
        setViewingImage(null)
      } else if (event.key === 'ArrowLeft') {
        // Previous image
        const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
        setViewingImage({
          ...viewingImage,
          image: viewingImage.images[newIndex],
          index: newIndex
        })
      } else if (event.key === 'ArrowRight') {
        // Next image
        const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
        setViewingImage({
          ...viewingImage,
          image: viewingImage.images[newIndex],
          index: newIndex
        })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [viewingImage])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyboard = (event) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const isTyping = event.target.tagName === 'INPUT' || 
                       event.target.tagName === 'TEXTAREA' || 
                       event.target.isContentEditable

      // Esc - Close modals and dropdowns
      if (event.key === 'Escape') {
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false)
        } else if (editingNote) {
          setEditingNote(null)
        } else if (viewingNote) {
          setViewingNote(null)
        } else if (deleteConfirm) {
          setDeleteConfirm(null)
        } else if (isTagManagerOpen) {
          setIsTagManagerOpen(false)
        } else if (dropdownOpen) {
          setDropdownOpen(null)
        } else if (showSortDropdown) {
          setShowSortDropdown(false)
        }
        return
      }

      // Don't trigger other shortcuts when typing
      if (isTyping) return

      // C - Create new note
      if (event.key === 'c' || event.key === 'C') {
        event.preventDefault()
        setIsCreateModalOpen(true)
      }

      // T - Open Tag Manager
      if (event.key === 't' || event.key === 'T') {
        event.preventDefault()
        setIsTagManagerOpen(true)
      }

      // Cmd/Ctrl + F - Focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault()
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]')
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyboard)
    return () => document.removeEventListener('keydown', handleGlobalKeyboard)
  }, [isCreateModalOpen, editingNote, viewingNote, deleteConfirm, isTagManagerOpen, dropdownOpen, showSortDropdown])

  const createNote = (noteData) => {
    const note = {
      id: Date.now(),
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags || [],
      attachments: noteData.attachments || [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], note],
    }))
    toast.success("Note created successfully!")
  }

  const updateNote = (id, updatedNote) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((note) =>
        note.id === id ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } : note,
      ),
    }))
    toast.success("Note updated successfully!")
  }

  const deleteNote = (id) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((note) => note.id !== id),
    }))
    setDeleteConfirm(null)
    toast.success("Note deleted successfully!")
  }

  const duplicateNote = (note) => {
    const duplicatedNote = {
      ...note,
      id: Date.now(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], duplicatedNote],
    }))
    setDropdownOpen(null)
    toast.success("Note duplicated successfully!")
  }

  const togglePinNote = (id) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      ),
    }))
  }

  const moveNoteToTab = (note) => {
    const targetTab = activeTab === 'personal' ? 'studio' : 'personal'
    
    // Remove from current tab
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((n) => n.id !== note.id),
    }))
    
    // Add to target tab
    setNotes((prev) => ({
      ...prev,
      [targetTab]: [...prev[targetTab], note],
    }))
    
    setDropdownOpen(null)
    toast.success(`Note moved to ${targetTab === 'personal' ? 'Personal' : 'Studio'} Notes!`)
  }

  const addTag = () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name")
      return
    }
    
    const newTag = {
      id: `tag-${Date.now()}`,
      label: newTagName.trim(),
      color: newTagColor
    }
    
    setAvailableTags([...availableTags, newTag])
    setNewTagName("")
    setNewTagColor("#FF843E")
    toast.success("Tag created successfully")
  }

  const deleteTag = (tagId) => {
    // Remove tag from all notes
    setNotes((prev) => ({
      personal: prev.personal.map(note => ({
        ...note,
        tags: note.tags?.filter(t => t !== tagId) || []
      })),
      studio: prev.studio.map(note => ({
        ...note,
        tags: note.tags?.filter(t => t !== tagId) || []
      }))
    }))
    
    // Remove from available tags
    setAvailableTags(availableTags.filter(tag => tag.id !== tagId))
    
    // Remove from selected tags filter
    setSelectedTags(selectedTags.filter(t => t !== tagId))
    
    toast.success("Tag deleted successfully")
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleDropdown = (noteId, e) => {
    if (e) e.stopPropagation()
    setDropdownOpen(dropdownOpen === noteId ? null : noteId)
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      // If currently sorted by something other than custom, 
      // we need to first apply that sort order to the notes array
      if (sortBy !== 'custom') {
        // Get the currently displayed order (filtered and sorted)
        const currentOrder = getFilteredAndSortedNotes()
        
        // Find indices in the current displayed order
        const oldIndex = currentOrder.findIndex((item) => item.id === active.id)
        const newIndex = currentOrder.findIndex((item) => item.id === over.id)
        
        // Create new order based on displayed order with the drag applied
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
        
        // Update notes to match this new order (keeping any filtered-out items at the end)
        const currentNotes = notes[activeTab]
        const filteredOutNotes = currentNotes.filter(n => !currentOrder.find(cn => cn.id === n.id))
        
        setNotes((prev) => ({
          ...prev,
          [activeTab]: [...newOrder, ...filteredOutNotes],
        }))
        setSortBy('custom')
      } else {
        const currentNotes = notes[activeTab]
        const oldIndex = currentNotes.findIndex((note) => note.id === active.id)
        const newIndex = currentNotes.findIndex((note) => note.id === over.id)
        
        setNotes((prev) => ({
          ...prev,
          [activeTab]: arrayMove(currentNotes, oldIndex, newIndex),
        }))
      }
    }
  }

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'custom', label: 'Custom Order' }
  ]

  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom')
      setShowSortDropdown(false)
    } else if (sortBy === newSortBy) {
      toggleSortDirection()
    } else {
      setSortBy(newSortBy)
      setSortDirection('asc') // asc = newest first for dates
    }
  }

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Date'

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  // Filter and sort notes
  const getFilteredAndSortedNotes = () => {
    let filtered = notes[activeTab].filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => note.tags?.includes(tag))
      
      return matchesSearch && matchesTags
    })

    // Separate pinned and unpinned notes
    const pinnedNotes = filtered.filter(note => note.isPinned)
    const unpinnedNotes = filtered.filter(note => !note.isPinned)

    // Sort unpinned notes
    if (sortBy !== 'custom') {
      unpinnedNotes.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'date':
            // Use the maximum of createdAt and updatedAt for each note
            // This ensures both new notes AND edited notes appear first
            const aDate = Math.max(new Date(a.createdAt), new Date(a.updatedAt))
            const bDate = Math.max(new Date(b.createdAt), new Date(b.updatedAt))
            comparison = aDate - bDate
            // For dates: 'asc' means newest first (inverted logic)
            return sortDirection === 'asc' ? -comparison : comparison
          case 'name':
            comparison = a.title.localeCompare(b.title)
            // For names: 'asc' means A-Z (normal logic)
            return sortDirection === 'asc' ? comparison : -comparison
          default:
            return 0
        }
      })
    }

    // Return pinned notes first, then sorted unpinned notes
    return [...pinnedNotes, ...unpinnedNotes]
  }

  const currentNotes = getFilteredAndSortedNotes()
  const noteIds = currentNotes.map(note => note.id)
  const isDragDisabled = searchQuery !== '' || selectedTags.length > 0

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
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown: sidebarToggleDropdown,
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
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,
    memberContingentData, setMemberContingentData,
    memberRelations, setMemberRelations,
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
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem

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

  return (
    <>
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
      <div className={`
    min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
    transition-all duration-500 ease-in-out flex-1
    ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0'
          : 'mr-0'
        }
  `}>
        <div className=" ">
          {/* Header */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Notes</h1>
              
              {/* Sort Button - Mobile Only */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>
                
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSortOptionClick(option.value)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                          sortBy === option.value 
                            ? 'text-white bg-gray-800/50' 
                            : 'text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && option.value !== 'custom' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' 
                              ? <ArrowUp size={14} /> 
                              : <ArrowDown size={14} />
                            }
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* View Toggle - Desktop Only */}
              <div className="hidden md:flex items-center gap-2 bg-black rounded-xl p-1">
                <span className="text-xs text-gray-400 px-2">View</span>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#FF843E] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#FF843E] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 justify-center border border-gray-700 transition-colors"
              >
                <Tag size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Tags</span>
              </button>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Note</span>
              </button>
              
              {isRightSidebarOpen ? (
                <div onClick={toggleRightSidebar}>
                  <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                </div>
              ) : (
                <div onClick={toggleRightSidebar}>
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            {/* Personal Notes Tab */}
            <div className="relative" ref={personalTooltipRef}>
              <button
                onClick={() => setActiveTab("personal")}
                onMouseEnter={() => setShowPersonalTooltip(true)}
                onMouseLeave={() => setShowPersonalTooltip(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === "personal" ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-white"
                  }`}
              >
                Personal Notes
                <Info size={16} className="opacity-60" />
              </button>
              
              {/* Personal Tooltip */}
              {showPersonalTooltip && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-3 z-50">
                  <div className="text-sm">
                    <p className="text-white font-medium mb-1.5">Private to you</p>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Only you can see and edit these notes. Perfect for personal tasks and private information.
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-6 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>

            {/* Studio Notes Tab */}
            <div className="relative" ref={studioTooltipRef}>
              <button
                onClick={() => setActiveTab("studio")}
                onMouseEnter={() => setShowStudioTooltip(true)}
                onMouseLeave={() => setShowStudioTooltip(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === "studio" ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-white"
                  }`}
              >
                Studio Notes
                <Info size={16} className="opacity-60" />
              </button>
              
              {/* Studio Tooltip */}
              {showStudioTooltip && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-3 z-50">
                  <div className="text-sm">
                    <p className="text-white font-medium mb-1.5">Shared with everyone</p>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      All team members can see and edit these notes. Great for collaboration and shared information.
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-6 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          {/* Filter Pills and Sort */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 items-center">
            {/* Tag Filter Pills */}
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag.id) 
                      ? prev.filter(t => t !== tag.id)
                      : [...prev, tag.id]
                  )
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  selectedTags.includes(tag.id)
                    ? "text-white"
                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                }`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined
                }}
              >
                <Tag size={12} />
                {tag.label}
              </button>
            ))}

            {/* Sort Controls - Desktop Only */}
            <div className="hidden md:block ml-auto relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSortDropdown(!showSortDropdown)
                }}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
              >
                {getSortIcon()}
                <span>{currentSortLabel}</span>
              </button>

              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                      Sort by
                    </div>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSortOptionClick(option.value)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                          sortBy === option.value 
                            ? 'text-white bg-gray-800/50' 
                            : 'text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && option.value !== 'custom' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' 
                              ? <ArrowUp size={14} /> 
                              : <ArrowDown size={14} />
                            }
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes Grid/List */}
          {currentNotes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-600 mb-6">
                {searchQuery || selectedTags.length > 0 ? (
                  <Search className="w-16 h-16 mx-auto" strokeWidth={1.5} />
                ) : (
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || selectedTags.length > 0 ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-gray-400 mb-8 text-sm">
                {searchQuery || selectedTags.length > 0 
                  ? "Try adjusting your search or filters"
                  : `Create your first ${activeTab === 'personal' ? 'personal' : 'studio'} note to get started`
                }
              </p>
              {!searchQuery && selectedTags.length === 0 && (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-sm cursor-pointer text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Create Note
                  </button>
                  <p className="text-gray-500 text-xs">
                    or press <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 font-mono text-xs">C</kbd> to create a note
                  </p>
                </div>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={noteIds} strategy={rectSortingStrategy}>
                <div className={
                  viewMode === 'grid'
                    ? `grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`
                    : `grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6 md:!grid-cols-1 md:!gap-3`
                }>
                  {currentNotes.map((note) => (
                    <SortableNoteCard 
                      key={note.id} 
                      note={note} 
                      isDragDisabled={isDragDisabled}
                      viewMode={viewMode}
                    >
                      <div>
                        {/* Grid Card - Always on Mobile, on Desktop only if viewMode is grid */}
                        <div className={`bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 h-64 relative select-none ${!isDragDisabled ? 'pl-10' : ''} ${viewMode === 'list' ? 'flex md:hidden' : 'flex'} flex-col`}>
                          {/* Pin Icon - Top Left (below Grip when drag enabled) */}
                          {note.isPinned && (
                            <div className={`absolute z-10 ${!isDragDisabled ? 'top-10 left-3' : 'top-3 left-3'}`}>
                              <Pin
                                size={14}
                                className="text-orange-400 fill-orange-400"
                                aria-label="Note is pinned"
                              />
                            </div>
                          )}
                          
                          <div className="p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1 mr-2">
                                {note.title}
                              </h3>
                              
                              {/* Dropdown Menu */}
                              <div className="relative flex-shrink-0">
                                <button
                                  onClick={(e) => toggleDropdown(note.id, e)}
                                  className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>

                                {dropdownOpen === note.id && (
                                  <div className="absolute right-0 top-8 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                                    <button
                                      onClick={() => {
                                        setEditingNote(note)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Edit size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={() => duplicateNote(note)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Copy size={14} /> Duplicate
                                    </button>
                                    <button
                                      onClick={() => {
                                        togglePinNote(note.id)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      {note.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                                      {note.isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                      onClick={() => moveNoteToTab(note)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <ArrowRightLeft size={14} />
                                      Move to {activeTab === 'personal' ? 'Studio' : 'Personal'} Notes
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDeleteConfirm(note)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed mb-3 overflow-hidden break-words" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              wordBreak: 'break-word'
                            }}>
                              {note.content}
                            </p>

                            {/* Spacer to push tags and footer down */}
                            <div className="flex-1 min-h-0"></div>

                            {/* Tags - moved before footer, max 2 lines */}
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2 overflow-hidden" style={{
                                maxHeight: '3.5rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'horizontal'
                              }}>
                                {note.tags.map(tagId => {
                                  const tag = availableTags.find(t => t.id === tagId)
                                  return tag ? (
                                    <span
                                      key={tagId}
                                      className="text-xs px-2 py-1 rounded-md flex items-center gap-1 text-white flex-shrink-0"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      <Tag size={10} />
                                      {tag.label}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}

                            <div className="flex items-end justify-between pt-2 border-t border-gray-800/50">
                              <div className="flex items-end gap-3">
                                <div className="flex flex-col">
                                  <p className="text-[11px] text-gray-500">
                                    Created: {formatDateTime(note.createdAt)}
                                  </p>
                                  {note.updatedAt !== note.createdAt && (
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                      Updated: {formatDateTime(note.updatedAt)}
                                    </p>
                                  )}
                                </div>
                                {note.attachments && note.attachments.length > 0 && (
                                  <div className="flex items-center gap-1 text-[11px] text-gray-400 pb-0.5">
                                    <Paperclip size={12} />
                                    <span>{note.attachments.length}</span>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => setViewingNote(note)}
                                className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                                title="View note"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      
                      {/* List View Card - Hidden on Mobile, Desktop only in List Mode */}
                      <div className={`bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 p-4 h-32 gap-4 select-none ${!isDragDisabled ? 'pl-10' : ''} ${viewMode === 'list' ? 'hidden md:flex' : 'hidden'} items-start`}>
                          {/* Pin Icon Container - always rendered for consistent spacing */}
                          <div className="flex-shrink-0 pt-1 w-[14px]">
                            {note.isPinned && (
                              <Pin
                                size={14}
                                className="text-orange-400 fill-orange-400"
                                aria-label="Note is pinned"
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-white mb-1 line-clamp-2">
                              {note.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                              {note.content}
                            </p>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {note.tags.map(tagId => {
                                  const tag = availableTags.find(t => t.id === tagId)
                                  return tag ? (
                                    <span
                                      key={tagId}
                                      className="text-xs px-2 py-1 rounded-md flex items-center gap-1 text-white"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      <Tag size={10} />
                                      {tag.label}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                          </div>

                          <div className="flex items-start gap-3 flex-shrink-0">
                            <div className="text-right pt-1 min-h-[44px] flex flex-col justify-end">
                              <p className="text-[11px] text-gray-500 whitespace-nowrap">
                                Created: {formatDateTime(note.createdAt)}
                              </p>
                              {note.updatedAt !== note.createdAt && (
                                <p className="text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">
                                  Updated: {formatDateTime(note.updatedAt)}
                                </p>
                              )}
                              {note.attachments && note.attachments.length > 0 && (
                                <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 justify-end">
                                  <Paperclip size={12} />
                                  <span>{note.attachments.length}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-start gap-1 pt-1">
                              <button
                                onClick={() => setViewingNote(note)}
                                className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                title="View note"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>

                              {/* Dropdown Menu */}
                              <div className="relative">
                                <button
                                  onClick={(e) => toggleDropdown(note.id, e)}
                                  className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>

                                {dropdownOpen === note.id && (
                                  <div className="absolute right-0 bottom-full mb-1 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                                    <button
                                      onClick={() => {
                                        setEditingNote(note)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Edit size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={() => duplicateNote(note)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Copy size={14} /> Duplicate
                                    </button>
                                    <button
                                      onClick={() => {
                                        togglePinNote(note.id)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      {note.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                                      {note.isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                      onClick={() => moveNoteToTab(note)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <ArrowRightLeft size={14} />
                                      Move to {activeTab === 'personal' ? 'Studio' : 'Personal'} Notes
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDeleteConfirm(note)
                                        setDropdownOpen(null)
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SortableNoteCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Tag Manager Modal */}
        {isTagManagerOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4">
            <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 p-6 pb-0 overflow-visible">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-lg font-semibold">Manage Tags</h3>
                  {/* Info Tooltip */}
                  <div className="relative" ref={tagInfoTooltipRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowTagInfoTooltip(!showTagInfoTooltip)
                      }}
                      onMouseEnter={() => setShowTagInfoTooltip(true)}
                      onMouseLeave={() => setShowTagInfoTooltip(false)}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label="Tag information"
                    >
                      <Info size={16} />
                    </button>
                    
                    {/* Tooltip */}
                    {showTagInfoTooltip && (
                      <div className="absolute -left-20 md:left-0 top-8 w-56 md:w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-3 z-[100]">
                        <div className="text-sm">
                          <p className="text-blue-300 font-medium mb-2">Tags are shared across all notes</p>
                          <p className="text-gray-300 text-xs leading-relaxed">
                            All tags are visible to everyone and can be used in both Personal and Studio Notes. When you move a note between tabs, its tags stay intact.
                          </p>
                        </div>
                        {/* Arrow - responsive position */}
                        <div className="absolute -top-1 left-[5.5rem] md:left-4 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsTagManagerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-6 pb-6">
                <div className="mb-6">
                  <h4 className="text-white text-sm font-medium mb-3">Create New Tag</h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Tag name"
                      className="flex-1 bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-12 h-10 bg-[#2a2a2a] rounded-lg border border-gray-700 cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={addTag}
                    className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Tag
                  </button>
                </div>

                <div>
                  <h4 className="text-white text-sm font-medium mb-3">Existing Tags</h4>
                  <div className="space-y-2">
                    {availableTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg"
                      >
                        <div 
                          className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          <Tag size={14} />
                          {tag.label}
                        </div>
                        <button
                          onClick={() => deleteTag(tag.id)}
                          className="text-red-500 hover:text-red-400 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {availableTags.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">
                        No tags created yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <CreateNoteModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={createNote}
          availableTags={availableTags}
        />

        <EditNoteModal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          note={editingNote}
          onSave={(updatedNote) => updateNote(editingNote.id, updatedNote)}
          availableTags={availableTags}
        />

        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteNote(deleteConfirm.id)}
          noteTitle={deleteConfirm?.title}
        />
      </div>

      {/* View Note Modal */}
      {viewingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-800">
            {/* Header - Fixed */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start flex-shrink-0">
              <h2 className="text-2xl font-bold text-white pr-8 break-words">{viewingNote.title}</h2>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingNote(viewingNote)
                    setViewingNote(null)
                  }}
                  className="text-gray-400 hover:text-orange-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Edit note"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setViewingNote(null)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Tags in scrollable area */}
              {viewingNote.tags && viewingNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {viewingNote.tags.map(tagId => {
                    const tag = availableTags.find(t => t.id === tagId)
                    return tag ? (
                      <span
                        key={tagId}
                        className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Tag size={12} />
                        {tag.label}
                      </span>
                    ) : null
                  })}
                </div>
              )}

              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {viewingNote.content}
              </p>
              
              {/* Attachments in View Modal */}
              {viewingNote.attachments && viewingNote.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Attachments</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {viewingNote.attachments.map((attachment, index) => (
                      <div 
                        key={index} 
                        className="relative group cursor-pointer"
                        onClick={() => setViewingImage({
                          image: attachment,
                          images: viewingNote.attachments,
                          index: index
                        })}
                      >
                        <img 
                          src={attachment.url} 
                          alt={attachment.name}
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="text-white text-xs bg-gray-800 px-3 py-1 rounded">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed (always visible) */}
            <div className="p-6 border-t border-gray-800 text-[11px] text-gray-500 space-y-1 flex-shrink-0">
              <p>Created: {formatDateTime(viewingNote.createdAt)}</p>
              {viewingNote.updatedAt !== viewingNote.createdAt && (
                <p>Updated: {formatDateTime(viewingNote.updatedAt)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {viewingImage && viewingImage.image && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setViewingImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Close image"
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          {viewingImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1
                setViewingImage({
                  ...viewingImage,
                  image: viewingImage.images[newIndex],
                  index: newIndex
                })
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {viewingImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0
                setViewingImage({
                  ...viewingImage,
                  image: viewingImage.images[newIndex],
                  index: newIndex
                })
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-lg hover:bg-white/10 transition-colors z-10"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div 
            className="max-w-[90vw] max-h-[90vh] flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Filename above image */}
            <div className="bg-black/60 rounded-lg px-4 py-3 backdrop-blur-sm">
              <p className="text-white text-sm font-medium text-center">
                {viewingImage.image.name}
                {viewingImage.images.length > 1 && (
                  <span className="text-gray-400 ml-2">
                    ({viewingImage.index + 1}/{viewingImage.images.length})
                  </span>
                )}
              </p>
            </div>
            
            {/* Image */}
            <img 
              src={viewingImage.image.url} 
              alt={viewingImage.image.name}
              className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Sidebar and related modals */}
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
        toggleDropdown={sidebarToggleDropdown}
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

      {/* Sidebar related modals */}
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

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

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

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-40"
        aria-label="Create Note"
      >
        <Plus size={22} />
      </button>
    </>
  )
}
