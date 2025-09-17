
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import { TrendingUp, Users, Calendar, DollarSign, Clock, Target, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { IoIosMenu } from "react-icons/io"
import StatCard from "../../components/analytics-components/StatCard"
import ChartCard from "../../components/analytics-components/ChartCard"
import { analyticsData } from "../../utils/user-panel-states/analytics-states"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"


import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import Sidebar from "../../components/central-sidebar"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import AppointmentActionModal from "../../components/appointments-components/appointment-action-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import MemberOverviewModal from "../../components/communication-components/MemberOverviewModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import EditTaskModal from "../../components/task-components/edit-task-modal"
import { Toaster } from "react-hot-toast"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const sidebarSystem = useSidebarSystem();
  const [selectedAnalyticsFilter, setSelectedAnalyticsFilter] = useState("All members")
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const analyticsFilterRef = useRef(null)
  const trainingVideos = trainingVideosData


  const analyticsFilters = [
    "All members",
    "Checked in",
    "Cancelled appointment",
    "Finances",
    "Selling",
    "Leads",
    "Top-selling by revenue",
    "Most frequently sold",
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analyticsFilterRef.current && !analyticsFilterRef.current.contains(event.target)) {
        setIsAnalyticsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const renderFilteredContent = () => {
    switch (selectedAnalyticsFilter) {
      case "All members":
        return (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              <StatCard
                title="Total Revenue"
                value={analyticsData.overview.totalRevenue}
                change={analyticsData.overview.revenueGrowth}
                icon={DollarSign}
                prefix="$"
              />
              <StatCard
                title="Total Members"
                value={analyticsData.overview.totalMembers}
                change={analyticsData.overview.memberGrowth}
                icon={Users}
              />
              <StatCard
                title="Total Appointments"
                value={analyticsData.overview.totalAppointments}
                change={analyticsData.overview.appointmentGrowth}
                icon={Calendar}
              />
              <StatCard
                title="Avg Session Duration"
                value={analyticsData.overview.averageSessionDuration}
                change={analyticsData.overview.sessionGrowth}
                icon={Clock}
                suffix=" min"
              />
            </div>

            <ChartCard title="Revenue & Appointments Trend" className="col-span-full">
              <Chart options={revenueChartOptions} series={revenueChartSeries} type="line" height={300} />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Staff Performance">
                <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {analyticsData.staffPerformance.map((staff) => (
                    <div key={staff.name} className="p-4 bg-black rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{staff.name}</h4>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span className="text-sm">★</span>
                          <span className="text-sm">{staff.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Appointments</p>
                          <p className="text-white font-semibold">{staff.appointments}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Revenue</p>
                          <p className="text-white font-semibold">${staff.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Member Retention Metrics">
                <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {analyticsData.memberRetention.map((data) => (
                    <div key={data.month} className="p-4 bg-black rounded-xl">
                      <h4 className="font-semibold text-white mb-3">{data.month}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-green-400">Retained</p>
                          <p className="text-white font-bold">{data.retained}%</p>
                        </div>
                        <div>
                          <p className="text-blue-400">New</p>
                          <p className="text-white font-bold">{data.new}</p>
                        </div>
                        <div>
                          <p className="text-red-400">Churned</p>
                          <p className="text-white font-bold">{data.churned}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Key Performance Indicators">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">94.2%</div>
                  <div className="text-sm text-gray-400">Member Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                  <div className="text-sm text-gray-400">Retention Rate</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">$145</div>
                  <div className="text-sm text-gray-400">Avg Revenue/Member</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">2.3x</div>
                  <div className="text-sm text-gray-400">ROI on Marketing</div>
                </div>
              </div>
            </ChartCard>
          </>
        )

      case "Checked in":
        return (
          <ChartCard title="Currently Checked In Members" className="col-span-full">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
              {analyticsData.checkedInMembers.map((member, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{member.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Check-in: <span className="text-green-400">{member.checkInTime}</span>
                    </p>
                    <p className="text-gray-400">
                      Service: <span className="text-blue-400">{member.service}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Cancelled appointment":
        return (
          <ChartCard title="Recent Cancelled Appointments" className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.cancelledAppointments.map((appointment, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{appointment.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Service: <span className="text-blue-400">{appointment.service}</span>
                    </p>
                    <p className="text-gray-400">
                      Cancelled: <span className="text-red-400">{appointment.cancelTime}</span>
                    </p>
                    <p className="text-gray-400">
                      Reason: <span className="text-yellow-400">{appointment.reason}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Finances":
        return (
          <div className="space-y-6">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              <StatCard
                title="Monthly Revenue"
                value={analyticsData.overview.totalRevenue}
                change={analyticsData.overview.revenueGrowth}
                icon={DollarSign}
                prefix="$"
              />
              <StatCard title="Average Revenue/Member" value={145} change={8.2} icon={Target} prefix="$" />
              <StatCard title="Outstanding Payments" value={12500} change={-15.3} icon={Clock} prefix="$" />
              <StatCard title="Profit Margin" value={34.2} change={5.1} icon={TrendingUp} suffix="%" />
            </div>
            <ChartCard title="Revenue Breakdown by Service" className="col-span-full">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-5"
  } gap-4`}
>
  {analyticsData.topServices.map((service, index) => {
    const isLastOdd =
      isRightSidebarOpen &&
      analyticsData.topServices.length % 2 !== 0 &&
      index === analyticsData.topServices.length - 1;

    return (
      <div
        key={index}
        className={`p-4 bg-black rounded-xl text-center ${
          isLastOdd ? "lg:col-span-2" : ""
        }`}
      >
        <h4 className="font-semibold text-white mb-2">{service.name}</h4>
        <div className="text-2xl font-bold text-green-400 mb-1">
          ${service.revenue.toLocaleString()}
        </div>
        <p className="text-sm text-gray-400">{service.sessions} sessions</p>
        <p className="text-sm text-blue-400">Avg: ${service.avgPrice}</p>
      </div>
    );
  })}
</div>

            </ChartCard>
          </div>
        )

      case "Leads":
        return (
          <ChartCard title="Recent Leads" className="col-span-full">
         <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
              {analyticsData.leads.map((lead, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{lead.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Source: <span className="text-blue-400">{lead.source}</span>
                    </p>
                    <p className="text-gray-400">
                      Interest: <span className="text-purple-400">{lead.interest}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Score:</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: `${lead.score}%` }}></div>
                      </div>
                      <span className="text-green-400 font-semibold">{lead.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Top-selling by revenue":
        return (
          <ChartCard title="Top Services by Revenue" className="col-span-full">
            <div className="space-y-4">
              {analyticsData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">${service.revenue.toLocaleString()}</div>
                    <p className="text-sm text-gray-400">Avg: ${service.avgPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Most frequently sold":
        return (
          <ChartCard title="Most Popular Services" className="col-span-full">
            <div className="space-y-4">
              {analyticsData.topServices
                .sort((a, b) => b.sessions - a.sessions)
                .map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{service.name}</h4>
                        <p className="text-sm text-gray-400">${service.revenue.toLocaleString()} revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-400">{service.sessions}</div>
                      <p className="text-sm text-gray-400">sessions</p>
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Select a filter to view analytics data</p>
          </div>
        )
    }
  }

  // Revenue Chart Options
  const revenueChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: analyticsData.revenueByMonth.map((item) => item.month),
      labels: { style: { colors: "#9CA3AF" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: "Revenue ($)", style: { color: "#9CA3AF" } },
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
        },
      },
      {
        opposite: true,
        title: { text: "Appointments", style: { color: "#9CA3AF" } },
        labels: { style: { colors: "#9CA3AF" } },
      },
    ],
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
    },
    tooltip: { theme: "dark" },
  }

  const revenueChartSeries = [
    {
      name: "Revenue",
      type: "area",
      data: analyticsData.revenueByMonth.map((item) => item.revenue),
    },
    {
      name: "Appointments",
      type: "line",
      yAxisIndex: 1,
      data: analyticsData.revenueByMonth.map((item) => item.appointments),
    },
  ]


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
      customLinks,setCustomLinks, communications, setCommunications,
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
   
    <div
      className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4
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

      <div className="bg-[#2F2F2F] border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center  gap-4">
              <div>
                <h1 className="text-white oxanium_font text-xl md:text-2xl">Analytics</h1>
              </div>
            </div>

            <div className="relative" ref={analyticsFilterRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnalyticsFilterOpen(!isAnalyticsFilterOpen)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-black rounded-xl text-white text-sm hover:bg-gray-800 min-w-[160px] justify-between"
                >
                  {selectedAnalyticsFilter}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isAnalyticsFilterOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className="block">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
              </div>
              {isAnalyticsFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-600 z-50 py-2">
                  {analyticsFilters.map((filter) => (
                    <button
                      key={filter}
                      className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-black transition-colors"
                      onClick={() => {
                        setSelectedAnalyticsFilter(filter)
                        setIsAnalyticsFilterOpen(false)
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 py-8 space-y-8">{renderFilteredContent()}</div>

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
