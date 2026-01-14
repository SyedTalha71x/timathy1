/* eslint-disable no-unused-vars */
import { useCallback, useState, useRef, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Tag, Info, Eye, Edit, Copy, Trash2, GripVertical } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"

import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import DeleteBulletinModal from "../../components/user-panel-components/bulletin-board-components/DeleteBulletinBoard"
import ViewBulletinModal from "../../components/user-panel-components/bulletin-board-components/ViewBulletinBoard"
import TagManagerModal from "../../components/user-panel-components/bulletin-board-components/TagManagerModal"
import OptimizedEditBulletinModal from "../../components/user-panel-components/bulletin-board-components/EditBulletinBoard"
import OptimizedCreateBulletinModal from "../../components/user-panel-components/bulletin-board-components/CreateBulletinBoard"

// Helper function to strip HTML tags for preview/search, preserving line breaks
const stripHtmlTags = (html) => {
  if (!html) return ''
  // Replace block-level elements and br with newlines
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
  // Remove remaining HTML tags
  const tmp = document.createElement('div')
  tmp.innerHTML = text
  text = tmp.textContent || tmp.innerText || ''
  // Clean up multiple newlines and trim
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

// Sortable Post Card Component
const SortablePostCard = ({ post, children, isDragDisabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: post.id,
    disabled: isDragDisabled 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(249, 115, 22, 0.15)' : 'none',
    willChange: isDragging ? 'transform' : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative h-full ${isDragging ? 'rounded-xl ring-1 ring-orange-500/30' : ''}`}>
      {!isDragDisabled && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-3 left-3 md:top-4 md:left-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-white active:text-orange-400 p-2 -m-1 md:p-1 md:-m-0 rounded-lg active:bg-orange-500/30 z-20 touch-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical className="w-5 h-5 md:w-4 md:h-4" />
        </div>
      )}
      {children}
    </div>
  )
}

const BulletinBoard = () => {
  const sidebarSystem = useSidebarSystem()

  const [tags, setTags] = useState([
    { id: 1, name: "Important", color: "#FF6B6B" },
    { id: 2, name: "Update", color: "#4ECDC4" },
    { id: 3, name: "Announcement", color: "#FFE66D" },
  ])
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)

  // Tab state - "member" or "staff"
  const [activeTab, setActiveTab] = useState("member")

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome to the Bulletin Board",
      content: "<p>This is where important announcements and information will be shared with team members and staff.</p><p><strong>Key updates:</strong></p><ul><li>New scheduling system rolling out next week</li><li>Updated safety protocols</li></ul>",
      visibility: "Members",
      status: "Active",
      author: "Admin",
      createdAt: Date.now() - 86400000 * 2,
      createdBy: "current-user",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
      tags: [],
    },
    {
      id: 2,
      title: "Quick Update",
      content: "<p>Meeting at 3 PM today.</p>",
      visibility: "Staff",
      status: "Active",
      author: "Manager",
      createdAt: Date.now() - 86400000,
      createdBy: "current-user",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
      tags: [1],
    },
    {
      id: 3,
      title: "Reminder",
      content: "<p>Don't forget to submit your reports by Friday.</p><p>This is a longer post with more content to show the difference in tile sizes.</p>",
      visibility: "Members",
      status: "Active",
      author: "Supervisor",
      createdAt: Date.now() - 86400000 * 3,
      createdBy: "other-user",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=450&fit=crop",
      tags: [2],
    },
    {
      id: 4,
      title: "Holiday Schedule Update",
      content: "<p>Please note the updated holiday schedule for the upcoming season.</p>",
      visibility: "Members",
      status: "Inactive",
      author: "HR",
      createdAt: Date.now() - 86400000 * 5,
      createdBy: "current-user",
      image: "",
      tags: [3],
    },
    {
      id: 5,
      title: "Staff Training Session",
      content: "<p>Mandatory training session scheduled for all staff members next Monday.</p><p>Topics covered:</p><ol><li>New software training</li><li>Safety procedures</li><li>Customer service excellence</li></ol>",
      visibility: "Staff",
      status: "Inactive",
      author: "Training Dept",
      createdAt: Date.now() - 86400000 * 7,
      createdBy: "other-user",
      image: "",
      tags: [1, 2],
    },
  ])

  const trainingVideos = trainingVideosData
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)

  const sortDropdownRef = useRef(null)
  const infoTooltipRef = useRef(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'custom', label: 'Custom Order' }
  ]

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (infoTooltipRef.current && !infoTooltipRef.current.contains(event.target)) {
        setShowInfoTooltip(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.closest('.ql-editor')) return
      
      // Ignore if Ctrl/Cmd is pressed (for Ctrl+C copy, etc.)
      if (e.ctrlKey || e.metaKey) return
      
      // Ignore if any modal is open
      if (showCreateModal || showEditModal || showDeleteModal || viewingPost || isTagManagerOpen) return
      
      // C key - Create Post
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        setShowCreateModal(true)
      }
      
      // T key - Open Tag Manager
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setIsTagManagerOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [showCreateModal, showEditModal, showDeleteModal, viewingPost, isTagManagerOpen])

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      if (sortBy !== 'custom') {
        const currentOrder = getFilteredAndSortedPosts()
        const oldIndex = currentOrder.findIndex((item) => item.id === active.id)
        const newIndex = currentOrder.findIndex((item) => item.id === over.id)
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
        const filteredOutPosts = posts.filter(p => !currentOrder.find(cp => cp.id === p.id))
        setPosts([...newOrder, ...filteredOutPosts])
        setSortBy('custom')
      } else {
        setPosts((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          return arrayMove(items, oldIndex, newIndex)
        })
      }
    }
  }

  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom')
      setShowSortDropdown(false)
    } else if (sortBy === newSortBy) {
      // If same option clicked, toggle direction but keep dropdown open
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Date'

  // Format date helper
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `${dateStr} ${timeStr}`
  }

  const handleAddTag = (newTag) => {
    setTags([...tags, newTag])
  }

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter((tag) => tag.id !== tagId))
    setPosts(
      posts.map((post) => ({
        ...post,
        tags: post.tags.filter((id) => id !== tagId),
      })),
    )
  }

  const handleCreatePost = useCallback((formData) => {
    if (formData.title.trim() && stripHtmlTags(formData.content).trim()) {
      const newPost = {
        id: Date.now(),
        ...formData,
        visibility: activeTab === "member" ? "Members" : "Staff",
        author: "Current User",
        createdAt: Date.now(),
        createdBy: "current-user",
      }
      setPosts(prev => [newPost, ...prev])
    }
  }, [activeTab])

  const handleEditPost = useCallback((formData) => {
    if (formData.title.trim() && stripHtmlTags(formData.content).trim() && selectedPost) {
      setPosts(prev => prev.map((post) =>
        post.id === selectedPost.id ? { ...post, ...formData, updatedAt: Date.now() } : post
      ))
      setSelectedPost(null)
    }
  }, [selectedPost])

  const openEditModal = useCallback((post) => {
    setSelectedPost(post)
    setShowEditModal(true)
    setDropdownOpen(null)
  }, [])

  const handleDeletePost = () => {
    setPosts(posts.filter((post) => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
  }

  const handleStatusToggle = (postId, e) => {
    if (e) e.stopPropagation()
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, status: post.status === "Active" ? "Inactive" : "Active" }
        : post
    ))
  }

  const openDeleteModal = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
    setDropdownOpen(null)
  }

  const toggleDropdown = (postId, e) => {
    if (e) e.stopPropagation()
    setDropdownOpen(dropdownOpen === postId ? null : postId)
  }

  const handleDuplicatePost = (post) => {
    const duplicatedPost = {
      ...post,
      id: Date.now(),
      title: `${post.title} (Copy)`,
      createdAt: Date.now(),
      createdBy: "current-user",
    }
    setPosts([duplicatedPost, ...posts])
    setDropdownOpen(null)
  }

  // Filter and sort posts
  const getFilteredAndSortedPosts = () => {
    let filtered = posts.filter((post) => {
      const tabVisibility = activeTab === "member" ? "Members" : "Staff"
      if (post.visibility !== tabVisibility) return false

      if (filterStatus !== "all") {
        const isActive = post.status === "Active"
        if (filterStatus === "active" && !isActive) return false
        if (filterStatus === "inactive" && isActive) return false
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = post.title.toLowerCase().includes(query)
        const contentMatch = stripHtmlTags(post.content).toLowerCase().includes(query)
        const authorMatch = post.author.toLowerCase().includes(query)
        if (!titleMatch && !contentMatch && !authorMatch) return false
      }

      return true
    })

    if (sortBy !== 'custom') {
      filtered.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'author':
            comparison = a.author.localeCompare(b.author)
            break
          case 'date':
          default:
            comparison = (a.createdAt || 0) - (b.createdAt || 0)
            break
        }
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }

  const filteredPosts = getFilteredAndSortedPosts()
  const postIds = filteredPosts.map(post => post.id)
  const isDragDisabled = searchQuery !== '' || filterStatus !== 'all'

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
    freeAppointments,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    setIsRightWidgetModalOpen,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setTodoFilter,
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
    toggleDropdown: toggleSidebarDropdown,
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
    communications,
    todos,
    setTodos,
    expiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,
    memberTypes,
    todoFilterOptions,
    appointmentTypes,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem

  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  return (
    <>
      <style>
        {`
          .post-inactive { opacity: 0.35; }
          .post-inactive:hover { opacity: 0.55; }
          .rich-text-content p { margin: 0; }
          .rich-text-content ul, .rich-text-content ol { margin: 0; padding-left: 1.5em; }
          .rich-text-content li { margin: 0; }
          .rich-text-content strong { font-weight: 600; }
          .rich-text-content em { font-style: italic; }
        `}
      </style>
      <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

      <div className={`min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1 ${isRightSidebarOpen ? 'lg:mr-86 mr-0' : 'mr-0'}`}>
        {/* Header */}
        <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-white oxanium_font text-xl md:text-2xl">Bulletin Board</h1>
            
            {/* Info Tooltip */}
            <div className="relative" ref={infoTooltipRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfoTooltip(!showInfoTooltip) }}
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors p-1"
              >
                <Info size={16} />
              </button>
              {showInfoTooltip && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-4 z-50">
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="text-orange-400 font-medium mb-1">Member Posts</p>
                      <p className="text-gray-300 text-xs leading-relaxed">Visible to all members.</p>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-blue-400 font-medium mb-1">Staff Posts</p>
                      <p className="text-gray-300 text-xs leading-relaxed">Visible only to staff members.</p>
                    </div>
                  </div>
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>

            {/* Sort Button - Mobile */}
            <div className="md:hidden relative" ref={sortDropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
              >
                {getSortIcon()}
                <span>{sortBy === 'custom' ? 'Custom' : currentSortLabel}</span>
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]">
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && option.value !== 'custom' && (
                          <span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tags Button - Desktop */}
            <div className="hidden md:block relative group">
              <button onClick={() => setIsTagManagerOpen(true)} className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium">
                <Tag size={16} />
                <span className="hidden sm:inline">Tags</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Manage Tags</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">T</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>

            {/* Create Post Button - Desktop */}
            <div className="hidden md:block relative group">
              <button onClick={() => setShowCreateModal(true)} className="flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors">
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className='hidden sm:inline'>Create Post</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Create Post</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>

            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar}><img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" /></div>
            ) : (
              <div onClick={toggleRightSidebar}><img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" /></div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          <button onClick={() => setFilterStatus('all')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'all' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>All</button>
          <button onClick={() => setFilterStatus('active')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'active' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>Active</button>
          <button onClick={() => setFilterStatus('inactive')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'inactive' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>Inactive</button>
          <button onClick={() => setIsTagManagerOpen(true)} className="md:hidden px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] flex items-center gap-1.5"><Tag size={14} />Tags</button>
          
          {/* Sort - Desktop */}
          <div className="hidden md:block ml-auto relative" ref={sortDropdownRef}>
            <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }} className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                  {sortOptions.map((option) => (
                    <button key={option.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}>
                      <span>{option.label}</span>
                      {sortBy === option.value && option.value !== 'custom' && (<span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button onClick={() => setActiveTab("member")} className={`flex-1 sm:flex-none px-6 py-4 text-base font-medium transition-colors ${activeTab === "member" ? "text-white border-b-2 border-orange-400" : "text-gray-400 hover:text-white"}`}>Member</button>
          <button onClick={() => setActiveTab("staff")} className={`flex-1 sm:flex-none px-6 py-4 text-base font-medium transition-colors ${activeTab === "staff" ? "text-white border-b-2 border-orange-400" : "text-gray-400 hover:text-white"}`}>Staff</button>
        </div>

        {/* Posts Grid with Drag and Drop */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={postIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {filteredPosts.map((post) => {
                const isInactive = post.status === "Inactive"
                return (
                  <SortablePostCard key={post.id} post={post} isDragDisabled={isDragDisabled}>
                    <div className={`flex flex-col select-none h-full ${isInactive ? 'post-inactive' : ''}`}>
                      <div 
                        className="bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 p-4 md:p-6 relative h-full flex flex-col"
                        onClick={() => dropdownOpen === post.id && setDropdownOpen(null)}
                      >

                        {/* Cover Image */}
                        {post.image && (
                          <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-700 -mx-4 -mt-4 md:-mx-6 md:-mt-6 rounded-t-xl rounded-b-none aspect-video bg-black">
                            <img src={post.image} alt="Post cover" className="w-full h-full object-contain" />
                          </div>
                        )}

                        {/* Spacer when no image and drag enabled - to avoid grip icon overlap */}
                        {!post.image && !isDragDisabled && (
                          <div className="h-4 md:h-3" />
                        )}

                        {/* Title */}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base md:text-lg font-semibold line-clamp-2 leading-snug break-words" title={post.title}>{post.title}</h3>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {post.tags.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId)
                              return tag ? (<span key={tag.id} className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>) : null
                            })}
                          </div>
                        )}

                        {/* Content Preview - Plain text with line breaks preserved */}
                        <p className={`text-xs md:text-sm text-gray-400 break-words whitespace-pre-line ${post.image ? 'line-clamp-3' : 'line-clamp-[8]'}`}>
                          {stripHtmlTags(post.content)}
                        </p>

                        {/* Created and Author - single line, above separator */}
                        <p className="text-[11px] text-gray-500 mt-auto pt-3">
                          Created: {formatDateTime(post.createdAt)} • By {post.author}
                        </p>

                        {/* Status Bar with Toggle, Eye and Menu */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                          {/* Left: Status Toggle */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Status:</span>
                            <button onClick={(e) => handleStatusToggle(post.id, e)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${post.status === "Active" ? 'bg-blue-600' : 'bg-gray-600'}`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${post.status === "Active" ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-xs font-medium text-gray-300 min-w-[50px]">{post.status}</span>
                          </div>

                          {/* Right: Eye and 3-dot menu */}
                          <div className="flex items-center gap-1">
                            {/* Eye icon for preview */}
                            <button onClick={() => setViewingPost(post)} className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors" title="Preview Post">
                              <Eye size={16} />
                            </button>

                            {/* Three dots dropdown */}
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleDropdown(post.id, e)
                                }} 
                                className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                              {dropdownOpen === post.id && (
                                <div className="absolute right-0 bottom-full mb-2 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-30 min-w-[140px]">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      setSelectedPost(post)
                                      setShowEditModal(true)
                                    }} 
                                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Edit size={14} /> Edit
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      const duplicatedPost = {
                                        ...post,
                                        id: Date.now(),
                                        title: `${post.title} (Copy)`,
                                        createdAt: Date.now(),
                                        createdBy: "current-user",
                                      }
                                      setPosts(prev => [duplicatedPost, ...prev])
                                    }} 
                                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Copy size={14} /> Duplicate
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      setSelectedPost(post)
                                      setShowDeleteModal(true)
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
                  </SortablePostCard>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m4-6v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-3">No posts found</h3>
            <p className="text-gray-500 mb-6">{searchQuery ? "Try adjusting your search or filters" : "Create a new post to get started"}</p>
            <button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2">
              <Plus size={18} />Create Post
            </button>
          </div>
        )}

        {/* Modals */}
        <OptimizedCreateBulletinModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreatePost} availableTags={tags} onOpenTagManager={() => setIsTagManagerOpen(true)} />
        <OptimizedEditBulletinModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedPost(null) }} post={selectedPost} onSave={handleEditPost} availableTags={tags} onOpenTagManager={() => setIsTagManagerOpen(true)} />
        <DeleteBulletinModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} post={selectedPost} onDelete={handleDeletePost} />
        <ViewBulletinModal isOpen={!!viewingPost} onClose={() => setViewingPost(null)} post={viewingPost} allTags={tags} />
        <TagManagerModal isOpen={isTagManagerOpen} onClose={() => setIsTagManagerOpen(false)} tags={tags} onAddTag={handleAddTag} onDeleteTag={handleDeleteTag} />

        <Sidebar isRightSidebarOpen={isRightSidebarOpen} toggleRightSidebar={toggleRightSidebar} isSidebarEditing={isSidebarEditing} toggleSidebarEditing={toggleSidebarEditing} rightSidebarWidgets={rightSidebarWidgets} moveRightSidebarWidget={moveRightSidebarWidget} removeRightSidebarWidget={removeRightSidebarWidget} setIsRightWidgetModalOpen={setIsRightWidgetModalOpen} communications={communications} redirectToCommunication={redirectToCommunication} todos={todos} handleTaskComplete={handleTaskCompleteWrapper} todoFilter={todoFilter} setTodoFilter={setTodoFilter} todoFilterOptions={todoFilterOptions} isTodoFilterDropdownOpen={isTodoFilterDropdownOpen} setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen} openDropdownIndex={openDropdownIndex} toggleDropdown={toggleSidebarDropdown} handleEditTask={handleEditTask} setTaskToCancel={setTaskToCancel} setTaskToDelete={setTaskToDelete} birthdays={birthdays} isBirthdayToday={isBirthdayToday} handleSendBirthdayMessage={handleSendBirthdayMessage} customLinks={customLinks} truncateUrl={truncateUrl} appointments={appointments} renderSpecialNoteIcon={renderSpecialNoteIcon} handleDumbbellClick={handleDumbbellClick} handleCheckIn={handleCheckInWrapper} handleAppointmentOptionsModal={handleAppointmentOptionsModal} selectedMemberType={selectedMemberType} setSelectedMemberType={setSelectedMemberType} memberTypes={memberTypes} isChartDropdownOpen={isChartDropdownOpen} setIsChartDropdownOpen={setIsChartDropdownOpen} expiringContracts={expiringContracts} getWidgetPlacementStatus={getWidgetPlacementStatus} onClose={toggleRightSidebar} hasUnreadNotifications={2} setIsWidgetModalOpen={setIsWidgetModalOpen} handleEditNote={handleEditNoteWrapper} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} isSpecialNoteModalOpen={isSpecialNoteModalOpen} setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen} selectedAppointmentForNote={selectedAppointmentForNote} setSelectedAppointmentForNote={setSelectedAppointmentForNote} handleSaveSpecialNote={handleSaveSpecialNoteWrapper} onSaveSpecialNote={handleSaveSpecialNoteWrapper} notifications={notifications} setTodos={setTodos} />
        <TrainingPlansModal isOpen={isTrainingPlanModalOpen} onClose={() => { setIsTrainingPlanModalOpen(false); setSelectedUserForTrainingPlan(null) }} selectedMember={selectedUserForTrainingPlan} memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []} availableTrainingPlans={availableTrainingPlans} onAssignPlan={handleAssignTrainingPlan} onRemovePlan={handleRemoveTrainingPlan} />
        <AppointmentActionModalV2 isOpen={showAppointmentOptionsModal} onClose={() => { setShowAppointmentOptionsModal(false); setSelectedAppointment(null) }} appointment={selectedAppointment} isEventInPast={isEventInPast} onEdit={() => { setShowAppointmentOptionsModal(false); setIsEditAppointmentModalOpen(true) }} onCancel={handleCancelAppointment} onViewMember={handleViewMemberDetails} />
        <NotifyMemberModal isOpen={isNotifyMemberOpen} onClose={() => setIsNotifyMemberOpen(false)} notifyAction={notifyAction} actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper} handleNotifyMember={handleNotifyMember} />
        {isEditAppointmentModalOpen && selectedAppointment && (<EditAppointmentModalV2 selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment} appointmentTypes={appointmentTypes} freeAppointments={freeAppointments} handleAppointmentChange={(changes) => { setSelectedAppointment({ ...selectedAppointment, ...changes }) }} appointments={appointments} setAppointments={setAppointments} setIsNotifyMemberOpen={setIsNotifyMemberOpen} setNotifyAction={setNotifyAction} onDelete={handleDeleteAppointmentWrapper} onClose={() => { setIsEditAppointmentModalOpen(false); setSelectedAppointment(null) }} />)}
        <WidgetSelectionModal isOpen={isRightWidgetModalOpen} onClose={() => setIsRightWidgetModalOpen(false)} onSelectWidget={handleAddRightSidebarWidget} getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")} widgetArea="sidebar" />
        {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}
        {taskToDelete && (<div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50"><div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4"><h3 className="text-lg font-semibold mb-4">Delete Task</h3><p className="text-gray-300 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p><div className="flex gap-3 justify-end"><button onClick={() => setTaskToDelete(null)} className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90">Cancel</button><button onClick={() => handleDeleteTaskWrapper(taskToDelete)} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Delete</button></div></div></div>)}
        {taskToCancel && (<div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50"><div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4"><h3 className="text-lg font-semibold mb-4">Cancel Task</h3><p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p><div className="flex gap-3 justify-end"><button onClick={() => setTaskToCancel(null)} className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90">No</button><button onClick={() => handleCancelTaskWrapper(taskToCancel)} className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700">Cancel Task</button></div></div></div>)}
      </div>

      {/* Floating Action Button - Mobile */}
      <button onClick={() => setShowCreateModal(true)} className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label="Create Post">
        <Plus size={22} />
      </button>
    </>
  )
}

export default BulletinBoard
