/* eslint-disable no-unused-vars */
import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

// sidebar related import
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import EditTaskModal from "../../components/task-components/edit-task-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditAppointmentModal from "../../components/user-panel-components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModal from "../../components/user-panel-components/appointments-components/appointment-action-modal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import Sidebar from "../../components/central-sidebar"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import { Toaster } from "react-hot-toast"


const marketplaceProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: "5,00 €",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1xUYD-Gqa5d08aoyqp4g1i6vs4lySrH4cA&s",
    link: "https://example.com/product/1",
  },
  {
    id: 2,
    name: "Snickers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: "5,00 €",
    image:
      "https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/105/365/563/original/1507255_01.jpg.jpeg?action=crop&width=750",
    link: "https://example.com/product/2",
  },
]

export default function MarketplacePage() {
  const sidebarSystem = useSidebarSystem();
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const trainingVideos = trainingVideosData

  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc") // new state


  const getFilteredProducts = () => {
    return marketplaceProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }



  const sortProducts = (products, field, direction) => {
    return [...products].sort((a, b) => {
      let aValue = a[field]
      let bValue = b[field]
  
      // Special handling for price
      if (field === "price") {
        const parsePrice = (priceStr) =>
          parseFloat(priceStr.replace("€", "").replace(",", ".").trim())
        aValue = parsePrice(aValue)
        bValue = parsePrice(bValue)
      } else {
        // Normalize strings
        if (typeof aValue === "string") aValue = aValue.toLowerCase()
        if (typeof bValue === "string") bValue = bValue.toLowerCase()
      }
  
      // Handle comparison based on direction
      if (direction === "asc") {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
      } else {
        if (aValue > bValue) return -1
        if (aValue < bValue) return 1
      }
      return 0
    })
  }

  const filtered = getFilteredProducts()
const sortedProducts = sortProducts(filtered, sortBy, sortDirection)
  

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
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white lg:p-3 md:p-3 sm:p-2 p-1
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
          : 'mr-0' // No margin when closed
        }
    `}>
        <div className="md:p-6 p-3">
          <div className="flex justify-between items-center w-full">

            <h1 className="text-white oxanium_font text-xl mb-5 md:text-2xl">Marketplace</h1>
            <div></div>
            <div className=" block">
              <IoIosMenu
                onClick={toggleRightSidebar}
                size={25}
                className="cursor-pointer mb-6 text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search by name, brand or article number......"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181818] text-white rounded-xl px-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
              />
            </div>

            {/* Sort by Field */}
            <div className="flex items-center gap-2">


              <label htmlFor="" className="text-sm">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="md:w-auto w-full cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="brand">Brand</option>
                <option value="articleNo">Article No.</option>
              </select>
            </div>

            {/* Sort Direction */}
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="md:w-auto w-full cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[140px]"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>          
            {sortedProducts.map((product) => (
            <div key={product.id} className="bg-[#2a2a2a] rounded-2xl overflow-hidden relative">
              <div className="relative w-full h-48 bg-white">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => window.open(product.link, "_blank")}
                  className="absolute bottom-3 right-3 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                  aria-label="Open product link"
                >
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className="p-4 bg-[#2a2a2a] text-white">
                <h3 className="text-base font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-1">{product.brand}</p>
                <p className="text-sm text-gray-400 mb-2">Art. No: {product.articleNo}</p>
                <p className="text-lg font-bold text-white">{product.price}</p>
              </div>
            </div>
          ))}
          </div>

          {getFilteredProducts().length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your search.</p>
            </div>
          )}
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
    </>

  )
}
