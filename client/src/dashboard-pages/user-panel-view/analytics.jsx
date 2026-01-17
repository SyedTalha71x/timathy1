/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import { 
  Calendar, 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CreditCard
} from "lucide-react"

import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { appointmentsData, LeadOriginMap, leadOriginMapData } from "../../utils/user-panel-states/analytics-states"
import {
  tabs,
  membersData,
  leadsData,
  financesData,
  getMonthlyBreakdownChartConfig,
  getPopularTimesChartConfig,
  getMemberActivityChartConfig,
  getMembersByTypeChartConfig,
  getLeadsChartConfig,
  getConversionRateChartConfig,
  getTopServicesByRevenueChartConfig,
  getMostFrequentlySoldChartConfig
} from "../../utils/user-panel-states/analytics-states"

// ==============================
// STAT CARD COMPONENT - Compact Version
// ==============================
const StatCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "", iconBg = "bg-blue-500/20", iconColor = "text-blue-400" }) => {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <div className="bg-[#2F2F2F] rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-lg flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
            </h3>
            {change !== undefined && (
              <span className={`flex items-center text-xs px-1.5 py-0.5 rounded ${
                isNeutral 
                  ? "text-gray-400 bg-gray-500/20" 
                  : isPositive 
                    ? "text-green-400 bg-green-500/20" 
                    : "text-red-400 bg-red-500/20"
              }`}>
                {isNeutral ? "—" : isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {!isNeutral && <span>{Math.abs(change)}%</span>}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs sm:text-sm truncate">{title}</p>
        </div>
      </div>
    </div>
  )
}

// ==============================
// CHART CARD COMPONENT
// ==============================
const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-[#2F2F2F] rounded-xl p-4 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}

// ==============================
// TIME PERIOD OPTIONS
// ==============================
const timePeriodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
  { value: "allTime", label: "All Time" },
]

export default function AnalyticsDashboard() {
  // ==============================
  // NAVIGATION & SIDEBAR HOOKS
  // ==============================
  const navigate = useNavigate()
  const sidebarSystem = useSidebarSystem()

  // ==============================
  // COMPONENT STATES
  // ==============================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const analyticsFilterRef = useRef(null)
  const [activeTab, setActiveTab] = useState("Appointments")
  
  // New states for enhanced features
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("thisMonth")
  const [isTimePeriodDropdownOpen, setIsTimePeriodDropdownOpen] = useState(false)
  const timePeriodRef = useRef(null)

  // Get training videos data
  const trainingVideos = trainingVideosData

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePeriodRef.current && !timePeriodRef.current.contains(event.target)) {
        setIsTimePeriodDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ==============================
  // EXTRACT STATES & FUNCTIONS FROM SIDEBAR HOOK
  // ==============================
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

    // Data states from sidebar
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

    // Additional sidebar data
    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,

    // Options and filters
    todoFilterOptions,
    relationOptions,
    appointmentTypes,

    // Training plan functions
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, 
    availableTrainingPlans, 
    setAvailableTrainingPlans
  } = sidebarSystem

  // ==============================
  // WRAPPER FUNCTIONS
  // ==============================
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

  // ==============================
  // CHART CONFIGURATIONS WITH RESPONSIVE OPTIONS
  // ==============================
  const getResponsiveChartHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 280 : 350
    }
    return 350
  }

  const monthlyBreakdownChart = getMonthlyBreakdownChartConfig()
  const popularTimesChart = getPopularTimesChartConfig()
  const memberActivityChart = getMemberActivityChartConfig()
  const membersByTypeChart = getMembersByTypeChartConfig()
  const leadsChart = getLeadsChartConfig()
  const conversionRateChart = getConversionRateChartConfig()
  const topServicesByRevenueChart = getTopServicesByRevenueChartConfig()
  const mostFrequentlySoldChart = getMostFrequentlySoldChartConfig()

  // ==============================
  // TAB ICONS MAPPING
  // ==============================
  const tabIcons = {
    Appointments: Calendar,
    Members: Users,
    Leads: UserPlus,
    Finances: DollarSign
  }

  // ==============================
  // RENDER FUNCTIONS
  // ==============================
  const renderTabContent = () => {
    switch (activeTab) {
      case "Appointments":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stat Cards - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                title="Bookings"
                value={appointmentsData.totals.bookings}
                change={12}
                icon={CalendarDays}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                title="Check-ins"
                value={appointmentsData.totals.checkIns}
                change={8}
                icon={UserCheck}
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />
              <StatCard
                title="Cancellations"
                value={appointmentsData.totals.cancellations}
                change={-15}
                icon={UserX}
                iconBg="bg-red-500/20"
                iconColor="text-red-400"
              />
              <StatCard
                title="Late Cancellations"
                value={appointmentsData.totals.lateCancellations}
                change={0}
                icon={Clock}
                iconBg="bg-yellow-500/20"
                iconColor="text-yellow-400"
              />
              <StatCard
                title="No Shows"
                value={appointmentsData.totals.noShows}
                change={0}
                icon={AlertCircle}
                iconBg="bg-orange-500/20"
                iconColor="text-orange-400"
              />
            </div>

            {/* Monthly Breakdown Chart */}
            <ChartCard title="Monthly Breakdown">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...monthlyBreakdownChart.options,
                      chart: {
                        ...monthlyBreakdownChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={monthlyBreakdownChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Popular Booking Times Chart */}
            <ChartCard title="Most Popular Booking Times">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart 
                    options={{
                      ...popularTimesChart.options,
                      chart: {
                        ...popularTimesChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={popularTimesChart.series} 
                    type="bar" 
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Members":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Total Members Card - Compact */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs sm:text-sm">Total Members</p>
                    <div className="text-3xl sm:text-4xl font-bold text-white">{membersData.totalMembers}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-lg">
                  <TrendingUp className="text-green-400" size={16} />
                  <span className="text-green-400 text-sm font-semibold">+18%</span>
                </div>
              </div>
            </div>

            {/* Member Activity Chart */}
            <ChartCard title="Member Activity">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...memberActivityChart.options,
                      chart: {
                        ...memberActivityChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={memberActivityChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Members by Type Chart */}
            <ChartCard title="Members by Membership Type">
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Chart
                    options={membersByTypeChart.options}
                    series={membersByTypeChart.series}
                    type="donut"
                    height={320}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Leads":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Total Leads Card - Compact, Blue like Members */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <UserPlus size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs sm:text-sm">Total Leads</p>
                    <div className="text-3xl sm:text-4xl font-bold text-white">{leadsData.totalLeads}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-lg">
                  <TrendingUp className="text-green-400" size={16} />
                  <span className="text-green-400 text-sm font-semibold">+24%</span>
                </div>
              </div>
            </div>

            {/* Lead Origin Map */}
            <LeadOriginMap data={leadOriginMapData} height={350} />

            {/* New Leads & Converted Chart */}
            <ChartCard title="New Leads & Converted">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart 
                    options={{
                      ...leadsChart.options,
                      chart: {
                        ...leadsChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={leadsChart.series} 
                    type="bar" 
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Conversion Rate Chart */}
            <ChartCard title="Conversion Rate (%)">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...conversionRateChart.options,
                      chart: {
                        ...conversionRateChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={conversionRateChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Finances":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Financial Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                title="Total Revenue"
                value={financesData.totalRevenue}
                change={22}
                icon={DollarSign}
                prefix="$"
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />
              <StatCard
                title="Avg Revenue/Member"
                value={financesData.averageRevenuePerMember.toFixed(2)}
                change={5}
                icon={CreditCard}
                prefix="$"
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                title="Outstanding Payments"
                value={financesData.outstandingPayments}
                change={-8}
                icon={AlertCircle}
                prefix="$"
                iconBg="bg-red-500/20"
                iconColor="text-red-400"
              />
            </div>

            {/* Top Services by Revenue Chart */}
            <ChartCard title="Top Services/Products by Revenue">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart
                    options={{
                      ...topServicesByRevenueChart.options,
                      chart: {
                        ...topServicesByRevenueChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={topServicesByRevenueChart.series}
                    type="bar"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Most Frequently Sold Chart */}
            <ChartCard title="Most Frequently Sold">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart
                    options={{
                      ...mostFrequentlySoldChart.options,
                      chart: {
                        ...mostFrequentlySoldChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={mostFrequentlySoldChart.series}
                    type="bar"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      default:
        return null
    }
  }

  // ==============================
  // MAIN COMPONENT RETURN
  // ==============================
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
          /* Hide scrollbar but keep functionality */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
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
          min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-3 md:p-6
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
            ? "lg:mr-86 mr-0"
            : "mr-0"
          }
        `}
      >
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* ============================== */}
          {/* HEADER */}
          {/* ============================== */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Analytics</h1>
              
              {/* Time Period Filter - inline with title */}
              <div className="relative" ref={timePeriodRef}>
                <button
                  onClick={() => setIsTimePeriodDropdownOpen(!isTimePeriodDropdownOpen)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-sm text-white transition-colors"
                >
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    {timePeriodOptions.find(o => o.value === selectedTimePeriod)?.label}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTimePeriodDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTimePeriodDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-50 overflow-hidden">
                    {timePeriodOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedTimePeriod(option.value)
                          setIsTimePeriodDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#3F3F3F] transition-colors ${
                          selectedTimePeriod === option.value 
                            ? 'bg-blue-600/20 text-blue-400' 
                            : 'text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

          {/* ============================== */}
          {/* TAB NAVIGATION */}
          {/* ============================== */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.name] || tab.icon
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.name
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F] hover:text-white"
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {tab.name}
                </button>
              )
            })}
          </div>

          {/* ============================== */}
          {/* TAB CONTENT */}
          {/* ============================== */}
          <div>{renderTabContent()}</div>
        </div>
      </div>

      {/* ============================== */}
      {/* SIDEBAR COMPONENT */}
      {/* ============================== */}
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

      {/* ============================== */}
      {/* SIDEBAR RELATED MODALS */}
      {/* ============================== */}
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
    </>
  )
}
