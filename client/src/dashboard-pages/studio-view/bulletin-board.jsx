/* eslint-disable no-unused-vars */
import { useCallback, useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Toaster } from "react-hot-toast"
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Tag, Info, Eye, Edit, Copy, Trash2, GripVertical, Calendar, Clock } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import toast from "react-hot-toast"

import { trainingVideosData } from "../../utils/studio-states/training-states"

import DeleteBulletinModal from "../../components/shared/bulletin-board/DeleteBulletinBoard"
import ViewBulletinModal from "../../components/shared/bulletin-board/ViewBulletinBoard"
import TagManagerModal from "../../components/shared/TagManagerModal";
import OptimizedEditBulletinModal from "../../components/shared/bulletin-board/EditBulletinBoard"
import OptimizedCreateBulletinModal from "../../components/shared/bulletin-board/CreateBulletinBoard"

import {
  getAllPostThunk,
  createPostThunk,
  activePostThunk,
  deActivatedPostThunk,
  deletePostThunk,
  updatePostThunk,
  clearError,
  clearPosts,
  setSelectedPost,
  setPagination
} from '../../features/bulletinBoard/bulletinSlice'

import {
  getTagsThunk,
  createTagsThunk,
  updateTagThunk,
  deleteTagThunk
} from '../../features/todos/todosSlice'

// Helper function to strip HTML tags for preview/search, preserving line breaks
const stripHtmlTags = (html) => {
  if (!html) return ''
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
  const tmp = document.createElement('div')
  tmp.innerHTML = text
  text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

// Format schedule date for display
const formatScheduleDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Format schedule time for display
const formatScheduleTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minutes} ${ampm}`
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
    id: post._id || post.id,
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
    <div ref={setNodeRef} style={style} className={`relative h-full ${isDragging ? 'rounded-xl ring-1 ring-primary/30' : ''}`}>
      {!isDragDisabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 left-3 md:top-4 md:left-4 cursor-grab active:cursor-grabbing text-white hover:text-content-primary active:text-primary p-1 rounded active:bg-primary/30 z-20 touch-none bg-surface-dark/60 shadow"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      {children}
    </div>
  )
}

const BulletinBoard = () => {
  const dispatch = useDispatch()

  // Redux state
  const { posts: reduxPosts, loading, error, pagination } = useSelector((state) => state.post || { posts: [], loading: false, error: null, pagination: {} })
  const { tags: reduxTags, loading: tagsLoading } = useSelector((state) => state.todos || { tags: [], loading: false })

  // Use tags from Redux
  const [tags, setTags] = useState([])
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)

  // Tab state - "member" or "staff"
  const [activeTab, setActiveTab] = useState("member")

  const [localPosts, setLocalPosts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPostState] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  const [schedulePopupPostId, setSchedulePopupPostId] = useState(null)

  const sortDropdownRef = useRef(null)
  const infoTooltipRef = useRef(null)

  // Load posts and tags from API on mount
  useEffect(() => {
    dispatch(getAllPostThunk())
    dispatch(getTagsThunk())
  }, [dispatch])

  // Update local posts when redux posts change
  useEffect(() => {
    if (reduxPosts && reduxPosts.length > 0) {
      const transformedPosts = reduxPosts.map(post => ({
        id: post._id,
        _id: post._id,
        title: post.title,
        content: post.content,
        status: post.status === 'active' ? 'Active' : post.status === 'scheduled' ? 'Scheduled' : 'Inactive',
        tags: post.tags || [],
        image: post.img?.url || null,
        visibility: post.postType === 'public' ? 'Members' : 'Staff',
        author: post.createdBy?.firstName + ' ' + post.createdBy?.lastName || 'Unknown',
        createdAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        schedule: post.scheduleDate ? {
          type: 'scheduled',
          startDate: post.scheduleDate,
          startTime: post.scheduleTime,
          hasEndDate: !!post.scheduleEndTime,
          endDate: post.scheduleEndTime,
          endTime: post.scheduleEndTime
        } : null,
        createdBy: post.createdBy?._id
      }))
      setLocalPosts(transformedPosts)
    }
  }, [reduxPosts])

  // Update local tags when redux tags change
  useEffect(() => {
    if (reduxTags && reduxTags.length > 0) {
      // Transform API tags to match component format
      const transformedTags = reduxTags.map(tag => ({
        id: tag._id,
        _id: tag._id,
        name: tag.name,
        color: tag.color || '#3B82F6',
        description: tag.description || ''
      }))
      setTags(transformedTags)
    }
  }, [reduxTags])

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
      if (schedulePopupPostId && !event.target.closest('[data-schedule-popup]')) {
        setSchedulePopupPostId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [schedulePopupPostId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.closest('.ql-editor')) return
      if (e.ctrlKey || e.metaKey) return
      if (showCreateModal || showEditModal || showDeleteModal || viewingPost || isTagManagerOpen) return

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        setShowCreateModal(true)
      }
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
        const oldIndex = currentOrder.findIndex((item) => (item._id || item.id) === active.id)
        const newIndex = currentOrder.findIndex((item) => (item._id || item.id) === over.id)
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
        const filteredOutPosts = localPosts.filter(p => !currentOrder.find(cp => (cp._id || cp.id) === (p._id || p.id)))
        setLocalPosts([...newOrder, ...filteredOutPosts])
        setSortBy('custom')
      } else {
        setLocalPosts((items) => {
          const oldIndex = items.findIndex((item) => (item._id || item.id) === active.id)
          const newIndex = items.findIndex((item) => (item._id || item.id) === over.id)
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
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-content-muted" />
    }
    return sortDirection === 'asc'
      ? <ArrowUp size={14} className="text-content-primary" />
      : <ArrowDown size={14} className="text-content-primary" />
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

  // Tag CRUD operations with API
  const handleAddTag = async (newTag) => {
    try {
      const tagData = {
        name: newTag.name,
        color: newTag.color || '#3B82F6',
        description: newTag.description || ''
      }
      const result = await dispatch(createTagsThunk(tagData)).unwrap()
      toast.success('Tag created successfully')
      await dispatch(getTagsThunk()) // Refresh tags list
      return result
    } catch (error) {
      toast.error(error.message || 'Failed to create tag')
      throw error
    }
  }

  const handleUpdateTag = async (tagId, updatedData) => {
    try {
      await dispatch(updateTagThunk({ tagId, updateData: updatedData })).unwrap()
      toast.success('Tag updated successfully')
      await dispatch(getTagsThunk()) // Refresh tags list
    } catch (error) {
      toast.error(error.message || 'Failed to update tag')
      throw error
    }
  }

  const handleDeleteTag = async (tagId) => {
    try {
      await dispatch(deleteTagThunk(tagId)).unwrap()
      toast.success('Tag deleted successfully')
      await dispatch(getTagsThunk()) // Refresh tags list

      // Also remove tag from all posts that have it
      setLocalPosts(prevPosts =>
        prevPosts.map(post => ({
          ...post,
          tags: post.tags.filter(id => id !== tagId)
        }))
      )
    } catch (error) {
      toast.error(error.message || 'Failed to delete tag')
      throw error
    }
  }

  const handleCreatePost = useCallback(async (formValues) => {
    if (formValues.title?.trim() && stripHtmlTags(formValues.content)?.trim()) {
      try {
        const postData = new FormData();
        postData.append('title', formValues.title);
        postData.append('content', formValues.content);
        postData.append('postType', activeTab === "member" ? "public" : "staff");
        postData.append('schedule', formValues.schedule?.type === 'scheduled' ? 'scheduled' : 'immediate');

        if (formValues.schedule?.type === 'scheduled') {
          postData.append('scheduleDate', formValues.schedule?.startDate || '');
          postData.append('scheduleTime', formValues.schedule?.startTime || '');
          if (formValues.schedule?.hasEndDate) {
            postData.append('scheduleEndTime', formValues.schedule?.endDate || '');
          }
        }

        postData.append('status', formValues.schedule?.type === 'scheduled' ? 'scheduled' : 'active');

        // Handle tags (send as JSON string)
        if (formValues.tags && formValues.tags.length > 0) {
          postData.append('tagsId', JSON.stringify(formValues.tags));
        } else {
          postData.append('tagsId', JSON.stringify([]));
        }

        // Handle image if present
        if (formValues.image && formValues.image instanceof File) {
          postData.append('img', formValues.image);
        }

        await dispatch(createPostThunk(postData)).unwrap();
        toast.success('Post created successfully');
        await dispatch(getAllPostThunk()); // Refresh list
        setShowCreateModal(false);
      } catch (error) {
        console.error('Create post error:', error);
        toast.error(error.message || 'Failed to create post');
      }
    } else {
      toast.error('Please fill in title and content');
    }
  }, [dispatch, activeTab]);

  const handleEditPost = useCallback(async (formValues) => {
    if (formValues.title?.trim() && stripHtmlTags(formValues.content)?.trim() && selectedPost) {
      try {
        const updateData = new FormData();
        updateData.append('title', formValues.title);
        updateData.append('content', formValues.content);
        updateData.append('postType', formValues.visibility === 'Members' ? 'public' : 'staff');
        updateData.append('schedule', formValues.schedule?.type === 'scheduled' ? 'scheduled' : 'immediate');

        if (formValues.schedule?.type === 'scheduled') {
          updateData.append('scheduleDate', formValues.schedule?.startDate || '');
          updateData.append('scheduleTime', formValues.schedule?.startTime || '');
          if (formValues.schedule?.hasEndDate) {
            updateData.append('scheduleEndTime', formValues.schedule?.endDate || '');
          }
        }

        if (formValues.tags && formValues.tags.length > 0) {
          updateData.append('tagsId', JSON.stringify(formValues.tags));
        }

        // Handle new image if uploaded
        if (formValues.image && formValues.image instanceof File) {
          updateData.append('img', formValues.image);
        }

        await dispatch(updatePostThunk({
          postId: selectedPost._id || selectedPost.id,
          updateData
        })).unwrap();

        toast.success('Post updated successfully');
        await dispatch(getAllPostThunk());
        setShowEditModal(false);
        setSelectedPostState(null);
      } catch (error) {
        toast.error(error.message || 'Failed to update post');
      }
    }
  }, [dispatch, selectedPost]);
  const openEditModal = useCallback((post) => {
    setSelectedPostState(post)
    setShowEditModal(true)
    setDropdownOpen(null)
  }, [])

  const handleDeletePost = async () => {
    if (selectedPost) {
      try {
        await dispatch(deletePostThunk(selectedPost._id || selectedPost.id)).unwrap()
        toast.success('Post deleted successfully')
        await dispatch(getAllPostThunk()) // Refresh list
        setShowDeleteModal(false)
        setSelectedPostState(null)
      } catch (error) {
        toast.error(error.message || 'Failed to delete post')
      }
    }
  }

  const handleStatusToggle = async (postId, e) => {
    if (e) e.stopPropagation()
    const post = localPosts.find(p => (p._id || p.id) === postId)
    if (post) {
      try {
        if (post.status === 'Active') {
          await dispatch(deActivatedPostThunk(postId)).unwrap()
          toast.success('Post deactivated')
        } else if (post.status === 'Inactive') {
          await dispatch(activePostThunk(postId)).unwrap()
          toast.success('Post activated')
        }
        await dispatch(getAllPostThunk()) // Refresh list
      } catch (error) {
        toast.error(error.message || 'Failed to update post status')
      }
    }
  }

  const openDeleteModal = (post) => {
    setSelectedPostState(post)
    setShowDeleteModal(true)
    setDropdownOpen(null)
  }

  const toggleDropdown = (postId, e) => {
    if (e) e.stopPropagation()
    setDropdownOpen(dropdownOpen === postId ? null : postId)
  }

  const handleDuplicatePost = async (post) => {
    try {
      const postData = {
        title: `${post.title} (Copy)`,
        content: post.content,
        postType: post.visibility === 'Members' ? 'public' : 'staff',
        schedule: post.schedule?.type === 'scheduled' ? 'scheduled' : 'immediately',
        scheduleDate: post.schedule?.startDate,
        scheduleTime: post.schedule?.startTime,
        scheduleEndTime: post.schedule?.hasEndDate ? post.schedule?.endDate : null,
        tagsId: post.tags,
        status: 'active'
      }

      await dispatch(createPostThunk(postData)).unwrap()
      toast.success('Post duplicated successfully')
      await dispatch(getAllPostThunk()) // Refresh list
      setDropdownOpen(null)
    } catch (error) {
      toast.error(error.message || 'Failed to duplicate post')
    }
  }

  // Filter and sort posts
  const getFilteredAndSortedPosts = () => {
    let filtered = localPosts.filter((post) => {
      const tabVisibility = activeTab === "member" ? "Members" : "Staff"
      if (post.visibility !== tabVisibility) return false

      if (filterStatus !== "all") {
        if (filterStatus === "active" && post.status !== "Active") return false
        if (filterStatus === "inactive" && post.status !== "Inactive") return false
        if (filterStatus === "scheduled" && post.status !== "Scheduled") return false
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
  const postIds = filteredPosts.map(post => post._id || post.id)
  const isDragDisabled = searchQuery !== '' || filterStatus !== 'all'

  if (loading && localPosts.length === 0) {
    return (
      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary md:p-6 p-3 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-muted">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>
        {`
          .post-inactive { opacity: 0.35; }
          .post-inactive:hover { opacity: 0.55; }
          .post-scheduled { opacity: 0.85; }
          .post-scheduled:hover { opacity: 1; }
          .post-scheduled > div { border-color: var(--color-primary) !important; }
          .rich-text-content p { margin: 0; }
          .rich-text-content ul, .rich-text-content ol { margin: 0; padding-left: 1.5em; }
          .rich-text-content li { margin: 0; }
          .rich-text-content strong { font-weight: 600; }
          .rich-text-content em { font-style: italic; }
        `}
      </style>

      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
        {/* Header */}
        <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Bulletin Board</h1>

            {/* Info Tooltip */}
            <div className="relative" ref={infoTooltipRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfoTooltip(!showInfoTooltip) }}
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                className="text-content-muted hover:text-content-secondary transition-colors p-1"
              >
                <Info size={16} />
              </button>
              {showInfoTooltip && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-surface-hover border border-border rounded-lg shadow-xl p-4 z-50">
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="text-primary font-medium mb-1">Member Posts</p>
                      <p className="text-content-secondary text-xs leading-relaxed">Visible to all members.</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-primary font-medium mb-1">Staff Posts</p>
                      <p className="text-content-secondary text-xs leading-relaxed">Visible only to staff members.</p>
                    </div>
                  </div>
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-surface-hover border-l border-t border-border transform rotate-45"></div>
                </div>
              )}
            </div>

            {/* Sort Button - Mobile */}
            <div className="md:hidden relative" ref={sortDropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                className="px-3 py-2 bg-surface-button text-content-secondary rounded-xl text-xs hover:bg-surface-button-hover transition-colors flex items-center gap-2"
              >
                {getSortIcon()}
                <span>{sortBy === 'custom' ? 'Custom' : currentSortLabel}</span>
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[160px]">
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">Sort by</div>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover' : 'text-content-secondary'}`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && option.value !== 'custom' && (
                          <span className="text-content-muted">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
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
              <button onClick={() => setIsTagManagerOpen(true)} className="bg-surface-button hover:bg-surface-button-hover text-content-secondary text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium">
                <Tag size={16} />
                <span className="hidden sm:inline">Tags</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Manage Tags</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">T</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-surface-dark" />
              </div>
            </div>

            {/* Create Post Button - Desktop */}
            <div className="hidden md:block relative group">
              <button onClick={() => setShowCreateModal(true)} className="flex bg-primary hover:bg-primary-hover text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors">
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className='hidden sm:inline'>Create Post</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Create Post</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-surface-dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          <button onClick={() => setFilterStatus('all')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'all' ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>All</button>
          <button onClick={() => setFilterStatus('active')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'active' ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>Active</button>
          <button onClick={() => setFilterStatus('scheduled')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'scheduled' ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>Scheduled</button>
          <button onClick={() => setFilterStatus('inactive')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'inactive' ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>Inactive</button>
          <button onClick={() => setIsTagManagerOpen(true)} className="md:hidden px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors bg-surface-button text-content-secondary hover:bg-surface-button-hover flex items-center gap-1.5"><Tag size={14} />Tags</button>

          {/* Sort - Desktop */}
          <div className="hidden md:block ml-auto relative" ref={sortDropdownRef}>
            <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }} className="px-3 sm:px-4 py-2 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2">
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">Sort by</div>
                  {sortOptions.map((option) => (
                    <button key={option.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover' : 'text-content-secondary'}`}>
                      <span>{option.label}</span>
                      {sortBy === option.value && option.value !== 'custom' && (<span className="text-content-muted">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button onClick={() => setActiveTab("member")} className={`flex-1 sm:flex-none px-6 py-4 text-base font-medium transition-colors ${activeTab === "member" ? "text-content-primary border-b-2 border-primary" : "text-content-muted hover:text-content-primary"}`}>Member</button>
          <button onClick={() => setActiveTab("staff")} className={`flex-1 sm:flex-none px-6 py-4 text-base font-medium transition-colors ${activeTab === "staff" ? "text-content-primary border-b-2 border-primary" : "text-content-muted hover:text-content-primary"}`}>Staff</button>
        </div>

        {/* Posts Grid with Drag and Drop */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={postIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {filteredPosts.map((post) => {
                const isInactive = post.status === "Inactive"
                const isScheduled = post.status === "Scheduled"
                return (
                  <SortablePostCard key={post._id || post.id} post={post} isDragDisabled={isDragDisabled}>
                    <div className={`flex flex-col select-none h-full ${isInactive ? 'post-inactive' : ''} ${isScheduled ? 'post-scheduled' : ''}`}>
                      <div
                        className="bg-surface-hover rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-border hover:border-border p-4 md:p-6 relative h-full flex flex-col"
                        onClick={() => dropdownOpen === (post._id || post.id) && setDropdownOpen(null)}
                      >

                        {/* Cover Image */}
                        {post.image && (
                          <div className="relative mb-4 rounded-lg overflow-hidden border border-border -mx-4 -mt-4 md:-mx-6 md:-mt-6 rounded-t-xl rounded-b-none aspect-video bg-surface-dark">
                            <img src={post.image} alt="Post cover" className="w-full h-full object-contain pointer-events-none" draggable="false" />
                          </div>
                        )}

                        {/* Spacer when no image and drag enabled - to avoid grip icon overlap */}
                        {!post.image && !isDragDisabled && (
                          <div className="h-6 md:h-5" />
                        )}

                        {/* Title */}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base md:text-lg font-semibold line-clamp-2 leading-snug break-words" title={post.title}>{post.title}</h3>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {post.tags.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId || t._id === tagId)
                              return tag ? (
                                <span key={tag.id || tag._id} className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: tag.color }}>
                                  {tag.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        )}

                        {/* Content Preview */}
                        <p className={`text-xs md:text-sm text-content-muted break-words whitespace-pre-line ${post.image ? 'line-clamp-3' : 'line-clamp-[8]'}`}>
                          {stripHtmlTags(post.content)}
                        </p>

                        {/* Created and Author */}
                        <p className="text-[11px] text-content-faint mt-auto pt-3">
                          Created: {formatDateTime(post.createdAt)} • By {post.author}
                        </p>

                        {/* Status Bar */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-content-muted">Status:</span>
                            {post.status === "Scheduled" ? (
                              <div
                                className="relative flex items-center gap-2"
                                data-schedule-popup
                                onMouseEnter={() => setSchedulePopupPostId(post._id || post.id)}
                                onMouseLeave={() => setSchedulePopupPostId(null)}
                              >
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSchedulePopupPostId(schedulePopupPostId === (post._id || post.id) ? null : (post._id || post.id))
                                  }}
                                  className="text-xs font-medium text-primary cursor-pointer hover:text-primary-hover transition-colors"
                                >
                                  Scheduled
                                </button>
                                {post.schedule && schedulePopupPostId === (post._id || post.id) && (
                                  <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-surface-hover border border-border rounded-lg shadow-xl z-50 whitespace-nowrap">
                                    <div className="text-xs space-y-1">
                                      {post.schedule.startDate && (
                                        <div className="flex items-center gap-2 text-primary">
                                          <Calendar size={10} />
                                          <span>Starts: {formatScheduleDate(post.schedule.startDate)}{post.schedule.startTime && ` at ${formatScheduleTime(post.schedule.startTime)}`}</span>
                                        </div>
                                      )}
                                      {post.schedule.hasEndDate && post.schedule.endDate && (
                                        <div className="flex items-center gap-2 text-content-muted">
                                          <Clock size={10} />
                                          <span>Ends: {formatScheduleDate(post.schedule.endDate)}{post.schedule.endTime && ` at ${formatScheduleTime(post.schedule.endTime)}`}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-surface-hover border-r border-b border-border transform rotate-45" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <button onClick={(e) => handleStatusToggle(post._id || post.id, e)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${post.status === "Active" ? 'bg-primary' : 'bg-surface-button'}`}>
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${post.status === "Active" ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-xs font-medium text-content-secondary min-w-[50px]">{post.status}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewingPost(post)} className="text-content-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors" title="Preview Post">
                              <Eye size={16} />
                            </button>

                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleDropdown(post._id || post.id, e)
                                }}
                                className="text-content-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                              {dropdownOpen === (post._id || post.id) && (
                                <div className="absolute right-0 bottom-full mb-2 bg-surface-card border border-border rounded-lg shadow-lg py-1 z-30 min-w-[140px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      openEditModal(post)
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-surface-hover text-content-secondary text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Edit size={14} /> Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      handleDuplicatePost(post)
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-surface-hover text-content-secondary text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Copy size={14} /> Duplicate
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDropdownOpen(null)
                                      openDeleteModal(post)
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-surface-hover text-red-500 text-sm flex items-center gap-2 transition-colors"
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
            <div className="text-content-faint mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m4-6v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-content-secondary mb-3">No posts found</h3>
            <p className="text-content-faint mb-6">{searchQuery ? "Try adjusting your search or filters" : "Create a new post to get started"}</p>
            <button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2">
              <Plus size={18} />Create Post
            </button>
          </div>
        )}

        {/* Modals */}
        <OptimizedCreateBulletinModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePost}
          availableTags={tags}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
        />
        <OptimizedEditBulletinModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedPostState(null) }}
          post={selectedPost}
          onSave={handleEditPost}
          availableTags={tags}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
        />
        <DeleteBulletinModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          post={selectedPost}
          onDelete={handleDeletePost}
        />
        <ViewBulletinModal
          isOpen={!!viewingPost}
          onClose={() => setViewingPost(null)}
          post={viewingPost}
          allTags={tags}
        />
        <TagManagerModal
          isOpen={isTagManagerOpen}
          onClose={() => setIsTagManagerOpen(false)}
          tags={reduxTags}
          onAddTag={handleAddTag}
          onUpdateTag={handleUpdateTag}
          onDeleteTag={handleDeleteTag}
        />
      </div>

      {/* Floating Action Button - Mobile */}
      <button onClick={() => setShowCreateModal(true)} className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label="Create Post">
        <Plus size={22} />
      </button>
    </>
  )
}

export default BulletinBoard