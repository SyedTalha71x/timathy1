import React, { useState, useCallback, createContext, useRef, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./components/sidebar"
import DashboardHeader from "./components/DashboardHeader"
import CentralSidebar from "./components/central-sidebar"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"

// Sidebar Modals
import { WidgetSelectionModal } from "../../components/shared/widgets/components/widget-selection-modal"


/**
 * Context for pages with custom sidebars (like Selling)
 * Allows child pages to communicate their sidebar state to the layout
 */
export const ExternalSidebarContext = createContext({
  isExternalSidebarOpen: false,
  setIsExternalSidebarOpen: () => {},
  toggleExternalSidebar: () => {}
})

/**
 * Dashboard Layout Component
 * 
 * Main layout wrapper for the dashboard.
 * - Manages sidebar open/close state for mobile
 * - Renders DashboardHeader (handles both mobile + desktop header)
 * - Renders Sidebar (pure navigation)
 * - Renders CentralSidebar (right sidebar with widgets)
 * - Renders page content via Outlet
 */
const Dashboardlayout = () => {
  const location = useLocation()
  const mainRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)

  // Scroll main content to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [location.pathname])
  
  // External sidebar state for pages with custom sidebars (e.g., Selling)
  const [isExternalSidebarOpen, setIsExternalSidebarOpen] = useState(false)
  const toggleExternalSidebar = useCallback(() => setIsExternalSidebarOpen(prev => !prev), [])

  // Detect if we're on a page with custom sidebar or no sidebar (Selling, Leads, My Area)
  const isSellingPage = location.pathname.includes("/selling")
  const isLeadsPage = location.pathname.includes("/leads")
  const isMyAreaPage = location.pathname.includes("/my-area")
  const hasNoRightSidebar = isSellingPage || isLeadsPage || isMyAreaPage

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const toggleLeftSidebarCollapse = useCallback(() => setIsLeftSidebarCollapsed(prev => !prev), [])

  // Central Sidebar System
  const sidebarSystem = useSidebarSystem()
  
  const {
    // State
    isRightSidebarOpen, isSidebarEditing, isRightWidgetModalOpen, openDropdownIndex,
    selectedMemberType, isChartDropdownOpen, editingTask, todoFilter, isEditTaskModalOpen,
    isTodoFilterDropdownOpen, taskToCancel, taskToDelete, activeNoteId, isSpecialNoteModalOpen,
    selectedAppointmentForNote, rightSidebarWidgets,
    
    // Setters
    setIsRightWidgetModalOpen, setSelectedMemberType, setIsChartDropdownOpen,
    setIsWidgetModalOpen, setEditingTask, setTodoFilter, setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen, setTaskToCancel, setTaskToDelete, setActiveNoteId,
    setIsSpecialNoteModalOpen, setSelectedAppointmentForNote,
    
    // Actions
    toggleRightSidebar, closeSidebar: closeRightSidebar, toggleSidebarEditing,
    toggleDropdown, redirectToCommunication, moveRightSidebarWidget, removeRightSidebarWidget,
    getWidgetPlacementStatus, handleAddRightSidebarWidget, handleTaskComplete, handleEditTask,
    handleUpdateTask, handleCancelTask, handleDeleteTask, isBirthdayToday,
    handleSendBirthdayMessage, handleEditNote, handleDumbbellClick, handleCheckIn,
    handleAppointmentOptionsModal, handleSaveSpecialNote, truncateUrl, renderSpecialNoteIcon,
    
    // Data
    customLinks, todos, setTodos, expiringContracts, birthdays, notifications,
    appointments, setAppointments, memberTypes, todoFilterOptions,
  } = sidebarSystem

  // Wrapper functions for sidebar
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos)
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos)
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos)
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos)
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments)
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments)
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments)

  return (
    <ExternalSidebarContext.Provider value={{ isExternalSidebarOpen, setIsExternalSidebarOpen, toggleExternalSidebar }}>
      {/* Global styles for widget drag & drop animations + selection/drag prevention */}
      <style>
        {`
          /* Prevent text selection and icon/image dragging */
          .dashboard-root {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          .dashboard-root img,
          .dashboard-root svg {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
          }
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
      
      <div className="dashboard-root bg-surface-dark min-h-screen">
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar - Navigation only */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={toggleLeftSidebarCollapse}
          />

          {/* Main Content Area */}
          <main
            ref={mainRef}
            className={`
              flex-1 md:h-screen h-[calc(100vh-3.5rem)] overflow-y-auto 
              lg:pt-0 md:pt-14 sm:pt-14 pt-14
              pb-10 p-2
              transition-all duration-500 ease-in-out
              ${(isSellingPage ? isExternalSidebarOpen : isRightSidebarOpen) && !isLeadsPage && !isMyAreaPage ? "lg:mr-[400px] mr-0" : "mr-0"}
            `}
          >
            {/* Header - handles both mobile + desktop views */}
            <DashboardHeader 
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isRightSidebarOpen={isSellingPage ? isExternalSidebarOpen : isRightSidebarOpen}
              toggleRightSidebar={isSellingPage ? toggleExternalSidebar : toggleRightSidebar}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
              toggleLeftSidebarCollapse={toggleLeftSidebarCollapse}
              hideRightSidebarToggle={hasNoRightSidebar}
            />

            {/* Page Content */}
            <Outlet />
          </main>

          {/* Central Sidebar (Right) - Hidden on Selling and Leads pages */}
          {!hasNoRightSidebar && (
            <CentralSidebar 
              isRightSidebarOpen={isRightSidebarOpen} 
              toggleRightSidebar={toggleRightSidebar} 
              isSidebarEditing={isSidebarEditing} 
              toggleSidebarEditing={toggleSidebarEditing} 
              rightSidebarWidgets={rightSidebarWidgets} 
              moveRightSidebarWidget={moveRightSidebarWidget} 
              removeRightSidebarWidget={removeRightSidebarWidget} 
              setIsRightWidgetModalOpen={setIsRightWidgetModalOpen} 
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
          )}

          {/* Widget Selection Modal */}
          <WidgetSelectionModal 
            isOpen={isRightWidgetModalOpen} 
            onClose={() => setIsRightWidgetModalOpen(false)} 
            onSelectWidget={handleAddRightSidebarWidget} 
            getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")} 
            widgetArea="sidebar" 
          />
          
          {/* Mobile overlay for right sidebar */}
          {isRightSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
              onClick={closeRightSidebar} 
            />
          )}
          
          {/* Task Modals */}
          {isEditTaskModalOpen && editingTask && (
            <EditTaskModal 
              task={editingTask} 
              onClose={() => { setIsEditTaskModalOpen(false); setEditingTask(null) }} 
              onUpdateTask={handleUpdateTaskWrapper} 
            />
          )}
          
          {taskToDelete && (
            <div className="fixed inset-0 text-content-primary bg-black/50 flex items-center justify-center z-50">
              <div className="bg-surface-card rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
                <p className="text-content-secondary mb-6">Are you sure you want to delete this task?</p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setTaskToDelete(null)} 
                    className="px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button/90"
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
            <div className="fixed inset-0 bg-black/50 text-content-primary flex items-center justify-center z-50">
              <div className="bg-surface-card rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
                <p className="text-content-secondary mb-6">Are you sure you want to cancel this task?</p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setTaskToCancel(null)} 
                    className="px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button/90"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => handleCancelTaskWrapper(taskToCancel)} 
                    className="px-4 py-2 bg-primary-hover text-white rounded-xl hover:bg-primary-hover"
                  >
                    Cancel Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ExternalSidebarContext.Provider>
  )
}

export default Dashboardlayout
