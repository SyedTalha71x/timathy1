import { useState, useRef, useEffect } from "react"
import { Search, Calendar, Clock, CheckCircle, X, ArrowUp, ArrowDown, UserX } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

// Sidebar imports
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

export default function CheckIns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [checkInHistory, setCheckInHistory] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('time')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)

  // Sidebar system hook
  const sidebarSystem = useSidebarSystem()
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
    handleCheckIn: handleSidebarCheckIn,
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

  // Wrapper functions for sidebar
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleSidebarCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments)
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments)

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      memberId: 1,
      memberName: "John Doe",
      memberImage: DefaultAvatar,
      appointmentType: "Personal Training",
      scheduledTime: "10:00 AM - 10:30 AM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: false,
      duration: "60 min"
    },
    {
      id: 2,
      memberId: 2,
      memberName: "Jane Smith",
      memberImage: DefaultAvatar,
      appointmentType: "Group Class",
      scheduledTime: "11:30 AM - 12:30 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: false,
      duration: "45 min"
    },
    {
      id: 3,
      memberId: 3,
      memberName: "Mike Johnson",
      memberImage: DefaultAvatar,
      appointmentType: "Consultation",
      scheduledTime: "02:00 PM - 3:00 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: true,
      isNoShow: false,
      checkInTime: "01:55 PM",
      duration: "30 min"
    },
    {
      id: 4,
      memberId: 4,
      memberName: "Sarah Wilson",
      memberImage: DefaultAvatar,
      appointmentType: "Personal Training",
      scheduledTime: "09:00 AM - 10:00 AM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: true,
      duration: "60 min"
    }
  ])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCheckIn = (appointmentId) => {
    const appointment = upcomingAppointments.find(app => app.id === appointmentId)
    if (!appointment) return

    const now = new Date()
    const checkInTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })

    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: true, isNoShow: false, checkInTime }
          : app
      )
    )

    const historyEntry = {
      id: Date.now(),
      ...appointment,
      checkInTime,
      checkInDate: now.toISOString().split('T')[0]
    }
    setCheckInHistory(prev => [historyEntry, ...prev])
  }

  const handleUndoCheckIn = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: false, checkInTime: undefined }
          : app
      )
    )
  }

  const handleNoShow = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isNoShow: true, isCheckedIn: false }
          : app
      )
    )
  }

  const handleUndoNoShow = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isNoShow: false }
          : app
      )
    )
  }

  // Sort options
  const sortOptions = [
    { value: 'time', label: 'Time' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' }
  ]

  const handleSortOptionClick = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('asc')
    }
    setShowSortDropdown(false)
  }

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Time'

  const getSortIcon = () => {
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  const isDateInRange = (dateStr) => {
    const date = new Date(dateStr)
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    return date >= from && date <= to
  }

  const getFilteredAndSortedAppointments = () => {
    let filtered = upcomingAppointments.filter(app => {
      const matchesSearch = app.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.appointmentType.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDate = isDateInRange(app.date)
      const matchesStatus = filterStatus === 'all' ||
                           (filterStatus === 'checked' && app.isCheckedIn) ||
                           (filterStatus === 'pending' && !app.isCheckedIn && !app.isNoShow) ||
                           (filterStatus === 'noshow' && app.isNoShow)
      
      return matchesSearch && matchesDate && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'time':
          comparison = a.scheduledTime.localeCompare(b.scheduledTime)
          break
        case 'name':
          comparison = a.memberName.localeCompare(b.memberName)
          break
        case 'type':
          comparison = a.appointmentType.localeCompare(b.appointmentType)
          break
        default:
          comparison = 0
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }

  const filteredUpcomingAppointments = getFilteredAndSortedAppointments()

  const filteredPastCheckIns = checkInHistory.filter(checkin =>
    checkin.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTodayStats = () => {
    const rangeAppointments = upcomingAppointments.filter(app => isDateInRange(app.date))
    const checkedIn = rangeAppointments.filter(app => app.isCheckedIn).length
    const noShowCount = rangeAppointments.filter(app => app.isNoShow).length
    const total = rangeAppointments.length
    const pending = total - checkedIn - noShowCount
    return { checkedIn, total, pending, noShowCount }
  }

  const stats = getTodayStats()

  return (
    <>
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
      <div className={`min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1 ${isRightSidebarOpen ? 'lg:mr-86 mr-0' : 'mr-0'}`}>
        
        {/* Header */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Top Row: Title + Sidebar Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Check-In</h1>
              
              {/* Sort Button - Mobile */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="px-2.5 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-lg text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-1.5"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-[10px] text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex items-center justify-between ${
                            sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-gray-400">
                              {sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Toggle */}
            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar} className="cursor-pointer">
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5" alt="" />
              </div>
            ) : (
              <div onClick={toggleRightSidebar} className="cursor-pointer">
                <img src="/icon.svg" className="h-5 w-5" alt="" />
              </div>
            )}
          </div>

          {/* Date Range Picker - Second Row on Mobile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#2F2F2F] rounded-lg border border-gray-700 flex-1 sm:flex-none">
              <Calendar size={12} className="text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent text-white outline-none text-[11px] sm:text-xs cursor-pointer w-full sm:w-[95px]"
              />
            </div>
            <span className="text-gray-500 text-xs">to</span>
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#2F2F2F] rounded-lg border border-gray-700 flex-1 sm:flex-none">
              <Calendar size={12} className="text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent text-white outline-none text-[11px] sm:text-xs cursor-pointer w-full sm:w-[95px]"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards - 2x2 on mobile, 4 cols on larger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 sm:p-3 border border-gray-800">
            <p className="text-gray-400 text-[10px] sm:text-xs">Total</p>
            <p className="text-base sm:text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 sm:p-3 border border-gray-800">
            <p className="text-gray-400 text-[10px] sm:text-xs">Checked-In</p>
            <p className="text-base sm:text-xl font-bold text-white">{stats.checkedIn}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 sm:p-3 border border-gray-800">
            <p className="text-gray-400 text-[10px] sm:text-xs">Pending</p>
            <p className="text-base sm:text-xl font-bold text-white">{stats.pending}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 sm:p-3 border border-gray-800">
            <p className="text-gray-400 text-[10px] sm:text-xs">No Shows</p>
            <p className="text-base sm:text-xl font-bold text-white">{stats.noShowCount}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] outline-none text-xs sm:text-sm text-white rounded-xl px-3 py-2 pl-8 sm:pl-9 border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills - Scrollable on mobile */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filterStatus === 'all'
                ? "bg-blue-600 text-white"
                : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('checked')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filterStatus === 'checked'
                ? "bg-blue-600 text-white"
                : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
            }`}
          >
            Checked-In
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filterStatus === 'pending'
                ? "bg-blue-600 text-white"
                : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('noshow')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filterStatus === 'noshow'
                ? "bg-blue-600 text-white"
                : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
            }`}
          >
            No Shows
          </button>

          {/* Sort - Desktop */}
          <div className="hidden md:block ml-auto relative" ref={sortDropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowSortDropdown(!showSortDropdown)
              }}
              className="px-3 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-lg text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
            >
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[10px] text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSortOptionClick(option.value)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex items-center justify-between ${
                        sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <span className="text-gray-400">
                          {sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-4">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "upcoming"
                ? "text-white border-b-2 border-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Today ({filteredUpcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "past"
                ? "text-white border-b-2 border-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            History ({filteredPastCheckIns.length})
          </button>
        </div>

        {/* Content - Cards */}
        <div className="space-y-2">
          {activeTab === "upcoming" ? (
            filteredUpcomingAppointments.length > 0 ? (
              filteredUpcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`bg-[#1A1A1A] rounded-xl p-3 border transition-all ${
                    appointment.isNoShow 
                      ? 'border-blue-500/30 bg-blue-500/5' 
                      : appointment.isCheckedIn 
                        ? 'border-orange-500/30 bg-orange-500/5' 
                        : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {/* Mobile: Vertical layout, Desktop: Horizontal */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Top row on mobile: Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={appointment.memberImage || DefaultAvatar}
                        alt={appointment.memberName}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h3 className="text-white font-medium text-xs sm:text-sm truncate">{appointment.memberName}</h3>
                          <span className="text-gray-500 text-[10px] hidden xs:inline">•</span>
                          <span className="text-gray-400 text-[10px] sm:text-xs truncate hidden xs:inline">{appointment.appointmentType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-gray-400 text-[10px] sm:text-xs">{appointment.scheduledTime}</span>
                          {appointment.isCheckedIn && appointment.checkInTime && (
                            <>
                              <span className="text-gray-600 text-[10px]">•</span>
                              <span className="text-orange-400 text-[10px] sm:text-xs">Checked-In {appointment.checkInTime}</span>
                            </>
                          )}
                        </div>
                        {/* Show type below on very small screens */}
                        <span className="text-gray-400 text-[10px] xs:hidden">{appointment.appointmentType}</span>
                      </div>
                    </div>

                    {/* Actions - Full width on mobile */}
                    <div className="flex items-center gap-2 justify-end sm:flex-shrink-0">
                      {appointment.isNoShow ? (
                        <>
                          <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] sm:text-xs font-medium">
                            <UserX size={10} className="sm:w-3 sm:h-3" />
                            No Show
                          </span>
                          <button
                            onClick={() => handleUndoNoShow(appointment.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                            title="Undo"
                          >
                            <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </>
                      ) : appointment.isCheckedIn ? (
                        <>
                          <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-[10px] sm:text-xs font-medium">
                            <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                            Checked-In
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(appointment.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                            title="Undo"
                          >
                            <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleNoShow(appointment.id)}
                            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#2F2F2F] hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 rounded-lg text-[10px] sm:text-xs transition-colors flex items-center gap-1"
                          >
                            <UserX size={12} className="sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">No Show</span>
                          </button>
                          <button
                            onClick={() => handleCheckIn(appointment.id)}
                            className="px-2.5 py-1.5 sm:px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] sm:text-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                            <span>Check-In</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-3" strokeWidth={1} />
                <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No appointments found</h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {searchQuery || filterStatus !== 'all' 
                    ? "Try adjusting your search or filters" 
                    : "No appointments scheduled for this period"}
                </p>
              </div>
            )
          ) : (
            filteredPastCheckIns.length > 0 ? (
              filteredPastCheckIns.map((checkin) => (
                <div
                  key={checkin.id}
                  className="bg-[#1A1A1A] rounded-xl p-3 border border-gray-800"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={checkin.memberImage || DefaultAvatar}
                        alt={checkin.memberName}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h3 className="text-white font-medium text-xs sm:text-sm truncate">{checkin.memberName}</h3>
                          <span className="text-gray-500 text-[10px] hidden xs:inline">•</span>
                          <span className="text-gray-400 text-[10px] sm:text-xs truncate hidden xs:inline">{checkin.appointmentType}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-gray-400 text-[10px] sm:text-xs">{formatDate(checkin.checkInDate)}</span>
                          <span className="text-gray-600 text-[10px]">•</span>
                          <span className="text-gray-400 text-[10px] sm:text-xs">{checkin.scheduledTime}</span>
                          <span className="text-gray-600 text-[10px]">•</span>
                          <span className="text-orange-400 text-[10px] sm:text-xs">Checked-In {checkin.checkInTime}</span>
                        </div>
                        <span className="text-gray-400 text-[10px] xs:hidden">{checkin.appointmentType}</span>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-[10px] sm:text-xs font-medium self-end sm:self-auto flex-shrink-0">
                      <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                      Completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-3" strokeWidth={1} />
                <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No check-in history</h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {searchQuery 
                    ? "Try adjusting your search" 
                    : "Check-in history will appear here"}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Sidebar */}
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
        toggleDropdown={toggleSidebarDropdown}
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

      {/* Sidebar Modals */}
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
          <div className="bg-[#181818] rounded-xl p-4 sm:p-6 max-w-md mx-3 sm:mx-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToCancel && (
        <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-4 sm:p-6 max-w-md mx-3 sm:mx-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Cancel Task</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm">Are you sure you want to cancel this task?</p>
            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90 text-sm"
              >
                No
              </button>
              <button
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-sm"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
