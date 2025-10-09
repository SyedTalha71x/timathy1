/* eslint-disable no-unused-vars */

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { IoIosMenu } from "react-icons/io"
import { FaCalendarAlt, FaUsers, FaUserPlus, FaDollarSign } from "react-icons/fa"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Chart from "react-apexcharts"

import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import Sidebar from "../../components/central-sidebar"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import MemberOverviewModal from "../../components/user-panel-components/communication-components/MemberOverviewModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { Toaster } from "react-hot-toast"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import { appointmentsData } from "../../utils/user-panel-states/analytics-states"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

const tabs = [
  { name: "Appointments", icon: FaCalendarAlt },
  { name: "Members", icon: FaUsers },
  { name: "Leads", icon: FaUserPlus },
  { name: "Finances", icon: FaDollarSign },
]

const membersData = {
  totalMembers: 342,
  newFullMembers: [12, 15, 18, 22, 19, 25, 28, 30, 27],
  newTempMembers: [5, 8, 6, 9, 7, 10, 8, 11, 9],
  inactiveMembers: [3, 2, 4, 3, 5, 2, 4, 3, 2],
  pausedMembers: [1, 2, 1, 3, 2, 1, 2, 1, 3],
  membersByType: [
    { type: "Premium", count: 145 },
    { type: "Standard", count: 98 },
    { type: "Basic", count: 67 },
    { type: "Trial", count: 32 },
  ],
}

const leadsData = {
  totalLeads: 89,
  monthlyData: [
    { month: "Apr", newLeads: 8, converted: 3, convertedPercent: 37.5 },
    { month: "May", newLeads: 12, converted: 5, convertedPercent: 41.7 },
    { month: "Jun", newLeads: 10, converted: 4, convertedPercent: 40.0 },
    { month: "Jul", newLeads: 15, converted: 7, convertedPercent: 46.7 },
    { month: "Aug", newLeads: 11, converted: 5, convertedPercent: 45.5 },
    { month: "Sep", newLeads: 9, converted: 3, convertedPercent: 33.3 },
    { month: "Oct", newLeads: 13, converted: 6, convertedPercent: 46.2 },
    { month: "Nov", newLeads: 14, converted: 7, convertedPercent: 50.0 },
    { month: "Dec", newLeads: 16, converted: 8, convertedPercent: 50.0 },
  ],
}

const financesData = {
  totalRevenue: 45680,
  averageRevenuePerMember: 133.57,
  outstandingPayments: 2340,
  topServicesByRevenue: [
    { name: "Personal Training", revenue: 18500 },
    { name: "Group Classes", revenue: 12300 },
    { name: "Nutrition Coaching", revenue: 8900 },
    { name: "Massage Therapy", revenue: 5980 },
  ],
  mostFrequentlySold: [
    { name: "Monthly Membership", count: 245 },
    { name: "Personal Training Session", count: 189 },
    { name: "Group Class Pass", count: 156 },
    { name: "Nutrition Plan", count: 98 },
    { name: "Massage Session", count: 67 },
  ],
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const sidebarSystem = useSidebarSystem()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const analyticsFilterRef = useRef(null)
  const trainingVideos = trainingVideosData

  const [activeTab, setActiveTab] = useState("Appointments")

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

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem

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

  // main content related to analytics page

  const monthlyBreakdownChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: appointmentsData.monthlyBreakdown.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => value.toString(),
      },
    },
  }

  const monthlyBreakdownChartSeries = [
    {
      name: "Bookings",
      data: appointmentsData.monthlyBreakdown.map((item) => item.bookings),
    },
    {
      name: "Check-ins",
      data: appointmentsData.monthlyBreakdown.map((item) => item.checkIns),
    },
    {
      name: "All Cancellations",
      data: appointmentsData.monthlyBreakdown.map((item) => item.cancellations),
    },
    {
      name: "Late Cancellations",
      data: appointmentsData.monthlyBreakdown.map((item) => item.lateCancellations),
    },
    {
      name: "No Shows",
      data: appointmentsData.monthlyBreakdown.map((item) => item.noShows),
    },
  ]

  const popularTimesChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: appointmentsData.popularTimes.map((item) => item.time),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} bookings`,
      },
    },
  }

  const popularTimesChartSeries = [
    {
      name: "Bookings",
      data: appointmentsData.popularTimes.map((item) => item.count),
    },
  ]

  const memberActivityChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
    },
  }

  const memberActivityChartSeries = [
    {
      name: "New Full Members",
      data: membersData.newFullMembers,
    },
    {
      name: "New Temp Members",
      data: membersData.newTempMembers,
    },
    {
      name: "Set Inactive",
      data: membersData.inactiveMembers,
    },
    {
      name: "Set Paused",
      data: membersData.pausedMembers,
    },
  ]

  const membersByTypeChartOptions = {
    chart: {
      type: "donut",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
    labels: membersData.membersByType.map((item) => item.type),
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Members",
              color: "#9CA3AF",
              formatter: () => membersData.totalMembers.toString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    tooltip: {
      theme: "dark",
    },
  }

  const membersByTypeChartSeries = membersData.membersByType.map((item) => item.count)

  const leadsChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6", "#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: leadsData.monthlyData.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
    },
  }

  const leadsChartSeries = [
    {
      name: "New Leads",
      data: leadsData.monthlyData.map((item) => item.newLeads),
    },
    {
      name: "Converted",
      data: leadsData.monthlyData.map((item) => item.converted),
    },
  ]

  const conversionRateChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: leadsData.monthlyData.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (value) => `${value}%`,
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  }

  const conversionRateChartSeries = [
    {
      name: "Conversion Rate",
      data: leadsData.monthlyData.map((item) => item.convertedPercent),
    },
  ]

  const topServicesByRevenueChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: financesData.topServicesByRevenue.map((item) => item.name),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (value) => `$${value}`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `$${value}`,
      },
    },
  }

  const topServicesByRevenueChartSeries = [
    {
      name: "Revenue",
      data: financesData.topServicesByRevenue.map((item) => item.revenue),
    },
  ]

  const mostFrequentlySoldChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: financesData.mostFrequentlySold.map((item) => item.name),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "10px",
        },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} sold`,
      },
    },
  }

  const mostFrequentlySoldChartSeries = [
    {
      name: "Units Sold",
      data: financesData.mostFrequentlySold.map((item) => item.count),
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "Appointments":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">{appointmentsData.totals.bookings}</div>
                <div className="text-sm text-gray-400">Bookings</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">{appointmentsData.totals.checkIns}</div>
                <div className="text-sm text-gray-400">Check-ins</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">{appointmentsData.totals.cancellations}</div>
                <div className="text-sm text-gray-400">Cancellations</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  {appointmentsData.totals.lateCancellations}
                </div>
                <div className="text-sm text-gray-400">Late Cancellations</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">{appointmentsData.totals.noShows}</div>
                <div className="text-sm text-gray-400">No Shows</div>
              </div>
            </div>

            {/* Monthly Breakdown Chart */}
            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Breakdown</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={monthlyBreakdownChartOptions}
                  series={monthlyBreakdownChartSeries}
                  type="line"
                  height={350}
                />
              </div>
            </div>

            {/* Popular Booking Times Chart */}
            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Most Popular Booking Times</h3>
              <div className="min-w-[600px]">
                <Chart options={popularTimesChartOptions} series={popularTimesChartSeries} type="bar" height={350} />
              </div>
            </div>
          </div>
        )

      case "Members":
        return (
          <div className="space-y-6">
            <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">{membersData.totalMembers}</div>
              <div className="text-lg text-gray-400">Total Members</div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Member Activity</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={memberActivityChartOptions}
                  series={memberActivityChartSeries}
                  type="line"
                  height={350}
                />
              </div>
            </div>

            {/* Members by Type Chart */}
            <div className="bg-[#2F2F2F] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Members by Membership Type</h3>
              <div className="flex justify-center">
                <Chart
                  options={membersByTypeChartOptions}
                  series={membersByTypeChartSeries}
                  type="donut"
                  height={350}
                />
              </div>
            </div>
          </div>
        )

      case "Leads":
        return (
          <div className="space-y-6">
            <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">{leadsData.totalLeads}</div>
              <div className="text-lg text-gray-400">Total Leads</div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">New Leads & Converted</h3>
              <div className="min-w-[600px]">
                <Chart options={leadsChartOptions} series={leadsChartSeries} type="bar" height={350} />
              </div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Conversion Rate (%)</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={conversionRateChartOptions}
                  series={conversionRateChartSeries}
                  type="line"
                  height={350}
                />
              </div>
            </div>
          </div>
        )

      case "Finances":
        return (
          <div className="space-y-6">
            {/* Financial Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  ${financesData.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  ${financesData.averageRevenuePerMember.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Avg Revenue/Member</div>
              </div>
              <div className="bg-[#2F2F2F] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  ${financesData.outstandingPayments.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Outstanding Payments</div>
              </div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Top Services/Products by Revenue</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={topServicesByRevenueChartOptions}
                  series={topServicesByRevenueChartSeries}
                  type="bar"
                  height={350}
                />
              </div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Most Frequently Sold</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={mostFrequentlySoldChartOptions}
                  series={mostFrequentlySoldChartSeries}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
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
      ${
        isRightSidebarOpen
          ? "lg:mr-86 mr-0" // Adjust right margin when sidebar is open on larger screens
          : "mr-0" // No margin when closed
      }
    `}
      >
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <div className=" ">
          <div className="">
            <div className="flex items-center justify-between">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Analytics</h1>

              {/* <IoIosMenu
                onClick={toggleRightSidebar}
                size={25}
                className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
              /> */}
              <div onClick={toggleRightSidebar}>
            <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
          </div>
            </div>


            <div className="flex gap-3 md:mt-10 mt-5  pt-3 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 px-4 ml-1 cursor-pointer  py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-lg ${
                      activeTab === tab.name
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F] hover:text-white"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.name}
                  </button>
                )
              })}
            </div>

            <div className="mt-6">{renderTabContent()}</div>
          </div>
        </div>

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
       <TrainingPlansModal
                                                isOpen={isTrainingPlanModalOpen}
                                                onClose={() => {
                                                  setIsTrainingPlanModalOpen(false)
                                                  setSelectedUserForTrainingPlan(null)
                                                }}
                                                selectedMember={selectedUserForTrainingPlan} // Make sure this is passed correctly
                                                memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
                                                availableTrainingPlans={availableTrainingPlans}
                                                onAssignPlan={handleAssignTrainingPlan} // Make sure this function is passed
                                                onRemovePlan={handleRemoveTrainingPlan} // Make sure this function is passed
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
    </>
  )
}
