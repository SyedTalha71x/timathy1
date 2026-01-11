/* eslint-disable no-unused-vars */
import { useState } from "react"
import CreateNoteModal from "../../components/user-panel-components/notes-components/CreateNoteModal"
import EditNoteModal from "../../components/user-panel-components/notes-components/EditNoteModal"
import DeleteConfirmModal from "../../components/user-panel-components/notes-components/DeleteConfirmModal"
import { Toaster } from "react-hot-toast"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"

import { useSidebarSystem } from "../../hooks/useSidebarSystem"

import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

import {demoNotesforUserPanel} from '../../utils/user-panel-states/notes-states'

export default function NotesApp() {
  const sidebarSystem = useSidebarSystem();
  const [activeTab, setActiveTab] = useState("personal")
  const [notes, setNotes] = useState(demoNotesforUserPanel)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewingNote, setViewingNote] = useState(null)

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const trainingVideos = trainingVideosData





  const createNote = (noteData) => {
    const note = {
      id: Date.now(),
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], note],
    }))
  }

  const updateNote = (id, updatedNote) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((note) =>
        note.id === id ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } : note,
      ),
    }))
  }

  const deleteNote = (id) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((note) => note.id !== id),
    }))
    setDeleteConfirm(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }


  const currentNotes = notes[activeTab]

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
    min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
    transition-all duration-500 ease-in-out flex-1
    ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
          : 'mr-0' // No margin when closed
        }
  `}>
        <div className=" ">
          <div className="mb-8 flex justify-between items-center w-full">
            <h1 className="text-xl md:text-2xl font-bold oxanium_font whitespace-nowrap">Notes</h1>
          
            {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className=" ">
            <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
          </div>
          ) : (<div onClick={toggleRightSidebar} className="  ">
            <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
          </div>
          )}
          </div>

          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "personal" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
            >
              Personal Notes
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "studio" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
            >
              Studio Notes
            </button>
          </div>

          <div className="mb-8 flex justify-end items-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>

          {/* Notes Grid */}
          {currentNotes.length === 0 ? (
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
              <h3 className="text-xl font-medium text-gray-300 mb-3">No notes yet</h3>
              <p className="text-gray-500 mb-6">Create your first {activeTab} note to get started</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Note
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
  isRightSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
} gap-6`}>
  {currentNotes.map((note) => (
    <div
      key={note.id}
      className="bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 h-64 flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white line-clamp-1 flex-1 mr-2">
            {note.title}
          </h3>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-1 overflow-hidden">
          {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-xs text-gray-500">
            Created: {formatDate(note.createdAt)}
          </p>

          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setViewingNote(note)}
              className="text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="View note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            <button
              onClick={() => setEditingNote(note)}
              className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Edit note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414
                    a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={() => setDeleteConfirm(note)}
              className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 
                    7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
          
          )}
        </div>

        <CreateNoteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={createNote} />

        <EditNoteModal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          note={editingNote}
          onSave={(updatedNote) => updateNote(editingNote.id, updatedNote)}
        />

        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteNote(deleteConfirm.id)}
          noteTitle={deleteConfirm?.title}
        />
      </div>

      {viewingNote && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-[#1A1A1A] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-800">
      <div className="p-6 border-b border-gray-800 flex justify-between items-start">
        <h2 className="text-2xl font-bold text-white pr-8">{viewingNote.title}</h2>
        <button
          onClick={() => setViewingNote(null)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
        <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
          {viewingNote.content}
        </p>
      </div>
      <div className="p-6 border-t border-gray-800 text-xs text-gray-500 space-y-1">
        <p>Created: {formatDate(viewingNote.createdAt)}</p>
        {viewingNote.updatedAt !== viewingNote.createdAt && (
          <p>Updated: {formatDate(viewingNote.updatedAt)}</p>
        )}
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