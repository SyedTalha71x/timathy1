/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"

import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"

import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
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
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

const BulletinBoard = () => {
  const sidebarSystem = useSidebarSystem();
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
    },
  ])

  const trainingVideos = trainingVideosData
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [filterVisibility, setFilterVisibility] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "Members",
    status: "Active",
  })

  const handleCreatePost = () => {
    if (formData.title.trim() && formData.content.trim()) {
      const newPost = {
        id: Date.now(),
        ...formData,
        author: "Current User",
        createdAt: new Date().toLocaleDateString(),
        createdBy: "current-user",
      }
      setPosts([newPost, ...posts])
      setFormData({ title: "", content: "", visibility: "Members", status: "Active" })
      setShowCreateModal(false)
    }
  }

  const handleEditPost = () => {
    if (formData.title.trim() && formData.content.trim()) {
      setPosts(posts.map((post) => (post.id === selectedPost.id ? { ...post, ...formData } : post)))
      setShowEditModal(false)
      setSelectedPost(null)
    }
  }

  const handleDeletePost = () => {
    setPosts(posts.filter((post) => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
  }

  const openEditModal = (post) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      visibility: post.visibility,
      status: post.status,
    })
    setShowEditModal(true)
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

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1C1C1C] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }

  // Extract all states and functions from the hook
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
    appointmentTypes
  } = sidebarSystem;

  // more sidebar related functions

  // Chart configuration
  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ];

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
  };


  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };

  const getMemberAppointmentsWrapper = (memberId) => {
    return getMemberAppointments(memberId, appointments);
  };

  const handleAddBillingPeriodWrapper = () => {
    handleAddBillingPeriod(memberContingentData, setMemberContingentData);
  };

  const handleSaveContingentWrapper = () => {
    handleSaveContingent(memberContingentData, setMemberContingentData);
  };

  const handleEditSubmitWrapper = (e) => {
    handleEditSubmit(e, appointments, setAppointments);
  };

  const handleAddRelationWrapper = () => {
    handleAddRelation(memberRelations, setMemberRelations);
  };

  const handleDeleteRelationWrapper = (category, relationId) => {
    handleDeleteRelation(category, relationId, memberRelations, setMemberRelations);
  };

  const handleArchiveMemberWrapper = (memberId) => {
    handleArchiveMember(memberId, appointments, setAppointments);
  };

  const handleUnarchiveMemberWrapper = (memberId) => {
    handleUnarchiveMember(memberId, appointments, setAppointments);
  };

  const getBillingPeriodsWrapper = (memberId) => {
    return getBillingPeriods(memberId, memberContingentData);
  };

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
          min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
          : 'mr-0' // No margin when closed
        }
        `}>
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Create Post</span>
                </button>
                <div>
                  <div className="block">
                    <IoIosMenu
                      onClick={toggleRightSidebar}
                      size={26}
                      className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md sm:text-[20px] md:text-[22px]"
                    />
                  </div>
                </div>
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

          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-3"
              } gap-6`}
          >

            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:shadow-xl hover:border-gray-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 text-balance">{post.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                          }`}
                      >
                        {post.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                        {post.visibility}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4 text-sm text-pretty leading-relaxed">{post.content}</p>

                {/* Post Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500">
                    <p className="font-medium text-gray-400">By {post.author}</p>
                    <p>{post.createdAt}</p>
                  </div>
                  {post.createdBy === "current-user" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-gray-800"
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
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-gray-800"
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-3">No posts found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or create a new post</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Post
              </button>
            </div>
          )}
        </div>

        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Post">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                placeholder="Enter post title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
                placeholder="Write your post content here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="Members">Members</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">

              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="flex-1 bg-blue-600 text-sm cursor-pointer  text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Create Post
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Post">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="Members">Members</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">

              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="flex-1 bg-blue-600 text-sm cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Post">
          <div className="space-y-4">
            <div className="text-center">

              <p className="text-gray-300 mb-4">
                Do you really want to delete "{selectedPost?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 text-sm cursor-pointer bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 text-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Delete Post
              </button>
            </div>
          </div>
        </Modal>

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

        {/* Sidebar related modals */}
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
            setShowAppointmentOptionsModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setShowAppointmentOptionsModal(false);
            setIsEditAppointmentModalOpen(true);
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
              setSelectedAppointment({ ...selectedAppointment, ...changes });
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointmentWrapper}
            onClose={() => {
              setIsEditAppointmentModalOpen(false);
              setSelectedAppointment(null);
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
            setIsMemberOverviewModalOpen(false);
            setSelectedMember(null);
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
            setShowAppointmentModal(false);
            setSelectedMember(null);
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
            setShowHistoryModal(false);
            setSelectedMember(null);
          }}
          selectedMember={selectedMember}
          historyTab={historyTab}
          setHistoryTab={setHistoryTab}
          memberHistory={memberHistory}
        />

        <MemberDetailsModal
          isOpen={isMemberDetailsModalOpen}
          onClose={() => {
            setIsMemberDetailsModalOpen(false);
            setSelectedMember(null);
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
            setIsEditModalOpen(false);
            setSelectedMember(null);
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
              setIsEditTaskModalOpen(false);
              setEditingTask(null);
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
    </>
  )
}

export default BulletinBoard
