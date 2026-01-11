/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react"
import { Toaster } from "react-hot-toast"
import { MdOutlineZoomOutMap } from "react-icons/md"

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

const BulletinBoard = () => {
  const sidebarSystem = useSidebarSystem()

  const [tags, setTags] = useState([
    { id: 1, name: "Important", color: "#FF6B6B" },
    { id: 2, name: "Update", color: "#4ECDC4" },
    { id: 3, name: "Announcement", color: "#FFE66D" },
  ])
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome to the Bulletin Board",
      content: "This is where important announcements and information will be shared with team members and staff.",
      visibility: "Members",
      status: "Active",
      author: "Admin",
      createdAt: new Date().toLocaleDateString(),
      createdBy: "current-user",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4jcHkW1crqIhywqcD_vgxDLzY22tXEYnDqA&s",
      tags: [],
    },
    // Add a sample post with little content and no image
    {
      id: 2,
      title: "Quick Update",
      content: "Meeting at 3 PM today.",
      visibility: "Staff",
      status: "Active",
      author: "Manager",
      createdAt: new Date().toLocaleDateString(),
      createdBy: "current-user",
      image: "",
      tags: [1],
    },
    {
      id: 3,
      title: "Reminder",
      content: "Don't forget to submit your reports by Friday. This is a longer post with more content to show the difference in tile sizes. It should take up more space in the layout.",
      visibility: "Members",
      status: "Active",
      author: "Supervisor",
      createdAt: new Date().toLocaleDateString(),
      createdBy: "other-user",
      image: "",
      tags: [2],
    },
  ])

  const trainingVideos = trainingVideosData
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [filterVisibility, setFilterVisibility] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [viewingPost, setViewingPost] = useState(null)


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
    if (formData.title.trim() && formData.content.trim()) {
      const newPost = {
        id: Date.now(),
        ...formData,
        author: "Current User",
        createdAt: new Date().toLocaleDateString(),
        createdBy: "current-user",
      }
      setPosts(prev => [newPost, ...prev])
    }
  }, [])

  // Update handleEditPost:
  const handleEditPost = useCallback((formData) => {
    if (formData.title.trim() && formData.content.trim() && selectedPost) {
      setPosts(prev => prev.map((post) =>
        post.id === selectedPost.id ? { ...post, ...formData } : post
      ))
      setSelectedPost(null)
    }
  }, [selectedPost])

  // Update openEditModal:
  const openEditModal = useCallback((post) => {
    setSelectedPost(post)
    setShowEditModal(true)
  }, [])

  const handleDeletePost = () => {
    setPosts(posts.filter((post) => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
  }

  const handleStatusToggle = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, status: post.status === "Active" ? "Inactive" : "Active" }
        : post
    ))
  }


  const openDeleteModal = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
  }

  const filteredPosts = posts.filter((post) => {
    const visibilityMatch = filterVisibility === "All" || post.visibility === filterVisibility
    const statusMatch = filterStatus === "All" || post.status === filterStatus
    return visibilityMatch && statusMatch
  })

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


  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos)
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

  // Helper function to determine if a post should be compact
  const getPostSizeClass = (post) => {
    const hasImage = !!post.image;
    const contentLength = post.content ? post.content.length : 0;
    const hasLittleContent = contentLength < 100;
    
    if (hasImage) {
      return "tile-large"; // Posts with images are always larger
    } else if (hasLittleContent) {
      return "tile-small"; // Posts with little text and no image
    } else {
      return "tile-medium"; // Posts with more text but no image
    }
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
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
          
          /* Masonry-like grid with variable heights */
          .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-auto-rows: auto;
            gap: 1.5rem;
          }
          
          /* Different tile sizes */
          .tile-small {
            grid-row: span 1;
            height: auto;
            min-height: 200px;
            max-height: 250px;
          }
          
          .tile-medium {
            grid-row: span 2;
            height: auto;
            min-height: 300px;
            max-height: 400px;
          }
          
          .tile-large {
            grid-row: span 3;
            height: auto;
            min-height: 400px;
            max-height: 500px;
          }
          
          /* Ensure content area fills available space */
          .post-tile {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .post-content {
            flex: 1;
            overflow: hidden;
            min-height: 0;
          }
          
          /* Compact content styling */
          .compact-content {
            max-height: 60px;
            overflow: hidden;
          }
          
          .medium-content {
            max-height: 150px;
            overflow: hidden;
          }
          
          .large-content {
            max-height: 200px;
            overflow: hidden;
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

      <div
        className={`
          min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"}
        `}
      >
        <div className="">
          <div className="">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Bulletin Board</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-500 text-sm cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Create Post</span>
                </button>
                {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="block ">
                  <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                ) : (<div onClick={toggleRightSidebar} className="block ">
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:p-5 p-3 mt-10">
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 text-sm">
              <label className="block text-sm font-medium text-gray-300 mb-2 ">Filter by Visibility</label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="All">All Visibility</option>
                <option value="Members">Members</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2 ">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Updated grid with variable tile sizes */}
          <div className="posts-grid">
            {filteredPosts.map((post) => {
              const tileSize = getPostSizeClass(post);
              const hasImage = !!post.image;
              const contentLength = post.content ? post.content.length : 0;
              const isCompactContent = contentLength < 100 && !hasImage;
              const isMediumContent = contentLength >= 100 && contentLength < 300 && !hasImage;
              
              let contentClass = "large-content";
              if (isCompactContent) contentClass = "compact-content";
              else if (isMediumContent) contentClass = "medium-content";
              
              return (
                <div
                  key={post.id}
                  className={`${tileSize} post-tile bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:shadow-xl hover:border-gray-700 transition-all duration-200`}
                >
                  {post.image && (
                    <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-700 h-48">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setViewingPost(post)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors"
                        title="Expand image"
                      >
                        <MdOutlineZoomOutMap />
                      </button>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 break-words whitespace-normal overflow-hidden">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}
                        >
                          {post.status}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                          {post.visibility}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {post.tags.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId)
                              return tag ? (
                                <span
                                  key={tag.id}
                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content area with variable height based on post size */}
                  <div className="post-content">
                    <div className={contentClass}>
                      <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-800 flex-shrink-0 gap-3 mt-4">
                    <div className="text-xs text-gray-500">
                      <p className="font-medium text-gray-400">By {post.author}</p>
                      <p>{post.createdAt}</p>
                    </div>

                    {/* Status Toggle in Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Status:</span>
                        <button
                          onClick={() => handleStatusToggle(post.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${post.status === "Active" ? "bg-emerald-500" : "bg-gray-600"
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${post.status === "Active" ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                        <span className="text-xs font-medium text-gray-300 min-w-[50px]">
                          {post.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {post.createdBy === "current-user" && (
                          <>
                            <button
                              onClick={() => openEditModal(post)}
                              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                              title="Edit post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(post)}
                              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                              title="Delete post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m4-6v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-3">No posts found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or create a new post</p>

            </div>
          )}
        </div>

        <OptimizedCreateBulletinModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePost}
          availableTags={tags}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
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
          tags={tags}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
        />

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
    </>
  )
}

export default BulletinBoard