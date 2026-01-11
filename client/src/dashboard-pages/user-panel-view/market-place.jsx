/* eslint-disable no-unused-vars */
import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

// sidebar related import
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import { Toaster } from "react-hot-toast"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"


const marketplaceProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: "5,00 €",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1xUYD-Gqa5d08aoyqp4g1i6vs4lySrH4cA&s",
    link: "https://example.com/product/1",
    pinned: true,
    infoText: "Premium basketball shoes with enhanced ankle support and cushioning. Made from breathable materials."
  },
  {
    id: 2,
    name: "Snickers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: "5,00 €",
    image: "https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/105/365/563/original/1507255_01.jpg.jpeg?action=crop&width=750",
    link: "https://example.com/product/2",
    pinned: false,
    infoText: "Limited edition collaboration with Off-White. Features deconstructed design elements."
  },
  // Add more products with pinned and infoText fields as needed
];


export default function MarketplacePage() {
  const sidebarSystem = useSidebarSystem();
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const trainingVideos = trainingVideosData

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [productForInfo, setProductForInfo] = useState(null);


  const [sortDirection, setSortDirection] = useState("asc") // new state

  const [sortBy, setSortBy] = useState("name-asc");


  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc" // "asc" or "desc"
  });


  const getFilteredProducts = () => {
    return marketplaceProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }



  const sortProducts = (products, sortValue) => {
    const [field, direction] = sortValue.split("-");

    return [...products].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Special handling for price
      if (field === "price") {
        const parsePrice = (priceStr) =>
          parseFloat(priceStr.replace("€", "").replace(",", ".").trim());
        aValue = parsePrice(aValue);
        bValue = parsePrice(bValue);
      } else {
        // Normalize strings
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
      }

      // Handle comparison based on direction
      if (direction === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
  };


  const filtered = getFilteredProducts();
  const sortedProducts = sortProducts(filtered, sortBy);

  const handleSortFieldChange = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field ? prev.direction : "asc"
    }))
  }

  // Add this function to toggle sort direction:
  const toggleSortDirection = () => {
    setSortConfig(prev => ({
      ...prev,
      direction: prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const openInfoModal = (product) => {
    setProductForInfo(product);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setProductForInfo(null);
  };

  const openEditModal = (product) => {
    // Implement or adapt your edit modal logic here
    console.log("Edit product:", product);
  };


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
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem;

 
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

            {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className=" ">
              <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            ) : (<div onClick={toggleRightSidebar} className=" ">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by name, brand or article number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181818] text-white rounded-xl px-10 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
              />
            </div>

            {/* Single Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="md:w-auto w-full cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[200px]"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="brand-asc">Brand (A-Z)</option>
                <option value="brand-desc">Brand (Z-A)</option>
                <option value="articleNo-asc">Article No. (Ascending)</option>
                <option value="articleNo-desc">Article No. (Descending)</option>
              </select>
            </div>
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

                  {/* Top-right action buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Info Icon Button */}
                    <button
                      onClick={() => openInfoModal(product)}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                      aria-label="Show product information"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* External Link Button */}
                    <button
                      onClick={() => window.open(product.link, "_blank")}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                      aria-label="Open product link"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
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

      {isInfoModalOpen && productForInfo && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Product Information</h2>
                <button
                  onClick={closeInfoModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{productForInfo.productName || productForInfo.name}</h3>
                <p className="text-gray-400 text-sm mb-1">Brand: {productForInfo.brandName || productForInfo.brand}</p>
                <p className="text-gray-400 text-sm mb-3">Article No: {productForInfo.articleNo}</p>

                {productForInfo.infoText ? (
                  <div className="bg-[#101010] rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{productForInfo.infoText}</p>
                  </div>
                ) : (
                  <div className="bg-[#101010] rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">No additional information available</p>
                    <button
                      onClick={() => {
                        closeInfoModal();
                        openEditModal(productForInfo);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                    >
                      Add information
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">

                <button
                  onClick={closeInfoModal}
                  className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
