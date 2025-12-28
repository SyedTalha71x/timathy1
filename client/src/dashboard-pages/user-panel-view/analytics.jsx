/* eslint-disable no-unused-vars */

import { useState, useRef } from "react"
import { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"

import Sidebar from "../../components/central-sidebar"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
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

  // Get training videos data
  const trainingVideos = trainingVideosData

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
  // These wrapper functions pass local state to hook functions
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
  // CHART CONFIGURATIONS
  // ==============================
  // Get chart configurations from imported functions
  const monthlyBreakdownChart = getMonthlyBreakdownChartConfig()
  const popularTimesChart = getPopularTimesChartConfig()
  const memberActivityChart = getMemberActivityChartConfig()
  const membersByTypeChart = getMembersByTypeChartConfig()
  const leadsChart = getLeadsChartConfig()
  const conversionRateChart = getConversionRateChartConfig()
  const topServicesByRevenueChart = getTopServicesByRevenueChartConfig()
  const mostFrequentlySoldChart = getMostFrequentlySoldChartConfig()

  // ==============================
  // RENDER FUNCTIONS
  // ==============================
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
                  options={monthlyBreakdownChart.options}
                  series={monthlyBreakdownChart.series}
                  type="line"
                  height={350}
                />
              </div>
            </div>

            {/* Popular Booking Times Chart */}
            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Most Popular Booking Times</h3>
              <div className="min-w-[600px]">
                <Chart 
                  options={popularTimesChart.options} 
                  series={popularTimesChart.series} 
                  type="bar" 
                  height={350} 
                />
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
                  options={memberActivityChart.options}
                  series={memberActivityChart.series}
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
                  options={membersByTypeChart.options}
                  series={membersByTypeChart.series}
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

            <LeadOriginMap data={leadOriginMapData} />


            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">New Leads & Converted</h3>
              <div className="min-w-[600px]">
                <Chart 
                  options={leadsChart.options} 
                  series={leadsChart.series} 
                  type="bar" 
                  height={350} 
                />
              </div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Conversion Rate (%)</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={conversionRateChart.options}
                  series={conversionRateChart.series}
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
                  options={topServicesByRevenueChart.options}
                  series={topServicesByRevenueChart.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>

            <div className="bg-[#2F2F2F] rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Most Frequently Sold</h3>
              <div className="min-w-[600px]">
                <Chart
                  options={mostFrequentlySoldChart.options}
                  series={mostFrequentlySoldChart.series}
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

              {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="block ">
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              ) : (<div onClick={toggleRightSidebar} className="block ">
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              )}
            </div>


            <div className="flex gap-3 md:mt-10 mt-5  pt-3 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 px-4 ml-1 cursor-pointer  py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-lg ${activeTab === tab.name
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
      </div>
    </>
  )
}