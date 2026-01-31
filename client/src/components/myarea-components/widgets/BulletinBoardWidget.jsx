/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react"
import { Plus, MoreVertical, Edit, Trash2, Eye, Calendar, Clock, Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { Link } from "react-router-dom"
import OptimizedCreateBulletinModal from "../../shared/bulletin-board/CreateBulletinBoard"
import OptimizedEditBulletinModal from "../../shared/bulletin-board/EditBulletinBoard"
import DeleteBulletinModal from "../../shared/bulletin-board/DeleteBulletinBoard"
import ViewBulletinModal from "../../shared/bulletin-board/ViewBulletinBoard"
import TagManagerModal from "../../shared/TagManagerModal"
import { defaultTags, defaultPosts } from "../../../utils/studio-states/bulletin-board-states"

// Helper function to strip HTML tags for preview
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

// Visibility Configuration
const VISIBILITY_CONFIG = {
  members: {
    label: "Members",
  },
  staff: {
    label: "Staff",
  },
}

export const BulletinBoardWidget = ({ isSidebarEditing, expanded }) => {
  const [bulletinPosts, setBulletinPosts] = useState(defaultPosts)
  const [tags, setTags] = useState(defaultTags)

  // Tab state - "members" or "staff"
  const [activeTab, setActiveTab] = useState("members")
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState("all")
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)
  
  // Sort state
  const [sortBy, setSortBy] = useState("recentlyAdded")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})
  const [schedulePopupPostId, setSchedulePopupPostId] = useState(null)

  const dropdownRef = useRef(null)
  const statusFilterRef = useRef(null)
  const sortDropdownRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setIsStatusFilterOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false)
      }
      if (schedulePopupPostId && !event.target.closest('[data-schedule-popup]')) {
        setSchedulePopupPostId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [schedulePopupPostId])

  // Calculate counts for each tab
  const tabCounts = {
    members: bulletinPosts.filter(p => p.visibility === "Members").length,
    staff: bulletinPosts.filter(p => p.visibility === "Staff").length,
  }

  // Filter posts based on active tab and status filter
  const getFilteredPosts = () => {
    let filtered = bulletinPosts.filter(post => {
      // Filter by visibility (tab)
      if (activeTab === "members" && post.visibility !== "Members") return false
      if (activeTab === "staff" && post.visibility !== "Staff") return false

      // Filter by status
      if (statusFilter !== "all") {
        if (statusFilter === "active" && post.status !== "Active") return false
        if (statusFilter === "inactive" && post.status !== "Inactive") return false
        if (statusFilter === "scheduled" && post.status !== "Scheduled") return false
      }

      return true
    })

    // Sort posts
    if (sortBy !== "custom") {
      filtered.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case "title":
            comparison = a.title.localeCompare(b.title)
            break
          case "author":
            comparison = a.author.localeCompare(b.author)
            break
          case "recentlyAdded":
          default:
            comparison = (a.createdAt || 0) - (b.createdAt || 0)
            break
        }
        
        return sortOrder === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }

  // Handle create new post
  const handleCreatePost = (formData) => {
    if (formData.title.trim() && stripHtmlTags(formData.content).trim()) {
      let finalStatus = formData.status
      if (formData.schedule && formData.schedule.type === 'scheduled') {
        finalStatus = 'Scheduled'
      }

      const newPost = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        visibility: activeTab === "members" ? "Members" : "Staff",
        status: finalStatus,
        image: formData.image,
        tags: formData.tags || [],
        author: "Current User",
        createdAt: Date.now(),
        createdBy: "current-user",
        schedule: (formData.schedule && formData.schedule.type === 'scheduled') 
          ? formData.schedule 
          : null,
      }

      setBulletinPosts(prev => [newPost, ...prev])
      setShowCreateModal(false)
    }
  }

  // Handle edit post
  const handleEditPost = (formData) => {
    if (formData.title.trim() && stripHtmlTags(formData.content).trim() && selectedPost) {
      let finalStatus = formData.status
      if (formData.schedule && formData.schedule.type === 'scheduled') {
        finalStatus = 'Scheduled'
      } else if (selectedPost.status === 'Scheduled') {
        finalStatus = 'Active'
      }

      setBulletinPosts(prev =>
        prev.map(post =>
          post.id === selectedPost.id
            ? {
              ...post,
              title: formData.title,
              content: formData.content,
              visibility: formData.visibility,
              status: finalStatus,
              image: formData.image,
              tags: formData.tags || [],
              schedule: (formData.schedule && formData.schedule.type === 'scheduled') 
                ? formData.schedule 
                : null,
              updatedAt: Date.now()
            }
            : post
        )
      )

      setShowEditModal(false)
      setSelectedPost(null)
    }
  }

  // Handle delete post
  const handleDeletePost = () => {
    setBulletinPosts(prev => prev.filter(post => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
  }

  // Handle dropdown toggle
  const handleDropdownToggle = (postId, event) => {
    if (openDropdownId === postId) {
      setOpenDropdownId(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 120
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    setDropdownPosition({
      [postId]: openUpwards ? 'top' : 'bottom'
    })
    setOpenDropdownId(postId)
  }

  // Handle view post
  const handleViewClick = (post) => {
    setSelectedPost(post)
    setShowViewModal(true)
    setOpenDropdownId(null)
  }

  // Handle edit click
  const handleEditClick = (post) => {
    setSelectedPost(post)
    setShowEditModal(true)
    setOpenDropdownId(null)
  }

  // Handle delete click
  const handleDeleteClick = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
    setOpenDropdownId(null)
  }

  // Get tag by ID
  const getTagById = (tagId) => {
    return tags.find((tag) => tag.id === tagId)
  }

  const handleAddTag = (newTag) => {
    setTags([...tags, newTag])
  }

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter((tag) => tag.id !== tagId))
    setBulletinPosts(
      bulletinPosts.map((post) => ({
        ...post,
        tags: post.tags.filter((id) => id !== tagId),
      }))
    )
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  const truncateText = (text, maxLength = 80) => {
    const plainText = stripHtmlTags(text)
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength - 3) + "..."
  }

  const filteredPosts = getFilteredPosts()

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold">Bulletin Board</h2>
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="relative" ref={statusFilterRef}>
            <button
              onClick={() => !isSidebarEditing && setIsStatusFilterOpen(!isStatusFilterOpen)}
              disabled={isSidebarEditing}
              className={`p-1.5 rounded-lg transition-colors ${
                statusFilter !== "all"
                  ? "bg-blue-600 text-white"
                  : "bg-black text-gray-400 hover:text-white"
              } ${isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Filter by status"
            >
              <Filter size={14} />
            </button>

            {isStatusFilterOpen && (
              <div className="absolute right-0 top-8 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[140px] py-1">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-500 font-medium">Filter by Status</p>
                </div>
                <button
                  onClick={() => {
                    setStatusFilter("all")
                    setIsStatusFilterOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    statusFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("active")
                    setIsStatusFilterOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    statusFilter === "active"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("scheduled")
                    setIsStatusFilterOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    statusFilter === "scheduled"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("inactive")
                    setIsStatusFilterOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    statusFilter === "inactive"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => !isSidebarEditing && setIsSortDropdownOpen(!isSortDropdownOpen)}
              disabled={isSidebarEditing}
              className={`p-1.5 bg-black rounded-lg text-gray-400 hover:text-white transition-colors ${
                isSidebarEditing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Sort posts"
            >
              {sortOrder === "asc" ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 top-8 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-500 font-medium">Sort by</p>
                </div>
                {[
                  { value: "custom", label: "Custom" },
                  { value: "title", label: "Title" },
                  { value: "author", label: "Author" },
                  { value: "recentlyAdded", label: "Recent" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      sortBy === option.value ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <button
                      onClick={() => {
                        handleSortChange(option.value)
                        if (option.value === "custom") setIsSortDropdownOpen(false)
                      }}
                      className="flex-1 text-left"
                    >
                      {option.label}
                    </button>
                    {sortBy === option.value && option.value !== "custom" && (
                      <button
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className="ml-2"
                      >
                        {sortOrder === "asc" ? (
                          <ArrowUp size={12} className="text-gray-400" />
                        ) : (
                          <ArrowDown size={12} className="text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isSidebarEditing && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer transition-colors"
              title="Add New Post"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Visibility Tabs */}
      <div className="flex gap-1 p-1 bg-black rounded-xl flex-shrink-0">
        {Object.entries(VISIBILITY_CONFIG).map(([visibility, config]) => (
          <button
            key={visibility}
            onClick={() => setActiveTab(visibility)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === visibility
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>{config.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === visibility ? "bg-white/10 text-white" : "bg-gray-900 text-gray-500"
              }`}
            >
              {tabCounts[visibility]}
            </span>
          </button>
        ))}
      </div>

      {/* Active Status Filter Indicator */}
      {statusFilter !== "all" && (
        <div className="flex items-center gap-2 text-xs text-blue-400 flex-shrink-0">
          <Filter size={12} />
          <span>Showing {statusFilter} posts</span>
          <button
            onClick={() => setStatusFilter("all")}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-gray-800 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Post Image Thumbnail */}
              {post.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate mb-1">
                  {post.title}
                </h3>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-1">
                    {post.tags.slice(0, 2).map((tagId) => {
                      const tag = getTagById(tagId)
                      return tag ? (
                        <span
                          key={tag.id}
                          className="text-[10px] px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null
                    })}
                    {post.tags.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-600 text-gray-300">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400 line-clamp-2">
                  {truncateText(post.content)}
                </p>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mt-2">
                  {post.status === "Scheduled" ? (
                    <div 
                      className="relative flex items-center gap-1.5"
                      data-schedule-popup
                      onMouseEnter={() => setSchedulePopupPostId(post.id)}
                      onMouseLeave={() => setSchedulePopupPostId(null)}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] text-orange-400 font-medium">
                        Scheduled
                      </span>
                      
                      {/* Schedule Popup */}
                      {post.schedule && schedulePopupPostId === post.id && (
                        <div className="absolute bottom-full left-0 mb-2 px-2 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50 whitespace-nowrap">
                          <div className="text-[10px] space-y-0.5">
                            {post.schedule.startDate && (
                              <div className="flex items-center gap-1.5 text-orange-400">
                                <Calendar size={8} />
                                <span>{formatScheduleDate(post.schedule.startDate)}</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 left-3 w-1.5 h-1.5 bg-[#1a1a1a] border-r border-b border-gray-700 transform rotate-45" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full ${post.status === "Active" ? "bg-green-500" : "bg-gray-500"}`} />
                      <span className="text-[10px] text-gray-400 capitalize">
                        {post.status}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="flex-shrink-0 relative" ref={openDropdownId === post.id ? dropdownRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDropdownToggle(post.id, e)
                  }}
                  className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={14} />
                </button>

                {openDropdownId === post.id && (
                  <div 
                    className={`absolute right-0 bg-[#2F2F2F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px] py-1 ${
                      dropdownPosition[post.id] === 'top' ? 'bottom-full mb-1' : 'top-6'
                    }`}
                  >
                    <button
                      onClick={() => handleViewClick(post)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2 text-white transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>
                    {post.createdBy === "current-user" && (
                      <>
                        <button
                          onClick={() => handleEditClick(post)}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2 text-white transition-colors"
                        >
                          <Edit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 text-red-400 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Calendar size={20} className="text-gray-600" />
            </div>
            <p className="text-sm">No {activeTab} posts</p>
            {statusFilter !== "all" && (
              <p className="text-xs mt-1">Try adjusting your filter</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-center pt-2 border-t border-gray-700 flex-shrink-0">
        <Link to="/dashboard/bulletin-board" className="text-xs text-gray-400 hover:text-white transition-colors">
          View all posts →
        </Link>
      </div>

      {/* Modals */}
      <OptimizedCreateBulletinModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onCreate={handleCreatePost} 
        availableTags={tags} 
        onOpenTagManager={() => setShowTagManager(true)} 
      />

      <OptimizedEditBulletinModal 
        isOpen={showEditModal} 
        onClose={() => { 
          setShowEditModal(false)
          setSelectedPost(null) 
        }} 
        post={selectedPost} 
        onSave={handleEditPost} 
        availableTags={tags} 
        onOpenTagManager={() => setShowTagManager(true)} 
      />

      <DeleteBulletinModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        post={selectedPost} 
        onDelete={handleDeletePost} 
      />

      <ViewBulletinModal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false)
          setSelectedPost(null)
        }} 
        post={selectedPost} 
        allTags={tags} 
      />

      <TagManagerModal
        isOpen={showTagManager}
        onClose={() => setShowTagManager(false)}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  )
}

export default BulletinBoardWidget
