// user panel --- my area 

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Check, Plus, Eye } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

// ============================================
// Component Imports
// ============================================
import ViewManagementModal from "../../components/shared/widgets/components/ViewManagementModal"
import DraggableWidget from "../../components/shared/widgets/components/DraggableWidget"
import { WidgetSelectionModal } from "../../components/shared/widgets/components/widget-selection-modal"

// Widget Imports
import AnalyticsChartWidget from "../../components/shared/widgets/AnalyticsChartWidget"
import UpcomingAppointmentsWidget from "../../components/shared/widgets/UpcomingAppointmentsWidget"
import StaffCheckInWidget from "../../components/shared/widgets/StaffWidgetCheckIn"
import WebsiteLinksWidget from "../../components/shared/widgets/WebsiteLinksWidget"
import ToDoWidget from "../../components/shared/widgets/ToDoWidget"
import UpcomingBirthdaysWidget from "../../components/shared/widgets/UpcomingBirthdaysWidget"
import BulletinBoardWidget from "../../components/shared/widgets/BulletinBoardWidget"
import NotesWidget from "../../components/shared/widgets/NotesWidget"
import ShiftScheduleWidget from "../../components/shared/widgets/ShiftScheduleWidget"
import ExpiringContractsWidget from "../../components/shared/widgets/ExpiringContractsWidget"

// Modal Imports
import AppointmentActionModal from "../../components/studio-components/appointments-components/AppointmentActionModal"
import EditMemberModalMain from "../../components/studio-components/members-components/EditMemberModal"
import EditLeadModal from "../../components/studio-components/lead-studio-components/edit-lead-modal"
import TrainingPlansModalMain from "../../components/shared/training/TrainingPlanModal"
import EditAppointmentModal from "../../components/shared/appointments/EditAppointmentModal"

// ============================================
// Data Imports
// ============================================
import { 
  memberRelationsData, 
  availableMembersLeadsNew, 
  customLinksData 
} from "../../utils/studio-states/myarea-states"

import { 
  appointmentsData, 
  membersData, 
  leadsData, 
  leadRelationsData, 
  freeAppointmentsData, 
  appointmentTypesData 
} from "../../utils/studio-states"

// ============================================
// Constants
// ============================================
const DEFAULT_WIDGETS = [
  { id: "chart", type: "chart", position: 0 },
  { id: "expiringContracts", type: "expiringContracts", position: 1 },
  { id: "appointments", type: "appointments", position: 2 },
  { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
  { id: "websiteLink", type: "websiteLink", position: 4 },
  { id: "todo", type: "todo", position: 5 },
  { id: "birthday", type: "birthday", position: 6 },
  { id: "bulletinBoard", type: "bulletinBoard", position: 7 },
  { id: "notes", type: "notes", position: 8 },
  { id: "shiftSchedule", type: "shiftSchedule", position: 9 }
]

const RELATION_OPTIONS = {
  family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
  friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
  relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
  work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
  other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
}

const LEAD_COLUMNS = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "qualified", title: "Qualified" },
  { id: "negotiation", title: "Negotiation" },
  { id: "won", title: "Won" },
  { id: "lost", title: "Lost" },
]

const TRAINING_PLANS_DATA = {
  1: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-15" }],
  3: [{ id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced", assignedDate: "2025-01-10" }],
  4: [
    { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate", assignedDate: "2025-01-05" },
    { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate", assignedDate: "2025-01-20" }
  ],
  6: [{ id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner", assignedDate: "2025-01-18" }],
}

const AVAILABLE_TRAINING_PLANS = [
  { id: 1, name: "Beginner Full Body", description: "Complete full body workout for beginners", duration: "4 weeks", difficulty: "Beginner" },
  { id: 2, name: "Advanced Strength Training", description: "High intensity strength building program", duration: "8 weeks", difficulty: "Advanced" },
  { id: 3, name: "Weight Loss Circuit", description: "Fat burning circuit training program", duration: "6 weeks", difficulty: "Intermediate" },
  { id: 4, name: "Muscle Building Split", description: "Targeted muscle building program", duration: "12 weeks", difficulty: "Intermediate" },
]

// ============================================
// Main Component
// ============================================
export default function MyArea() {
  const navigate = useNavigate()

  // ============================================
  // Dashboard State
  // ============================================
  const [isEditing, setIsEditing] = useState(false)
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS)
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)

  // ============================================
  // View Management State
  // ============================================
  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // ============================================
  // Widget Data State
  // ============================================
  const [customLinks, setCustomLinks] = useState(customLinksData)
  const [appointments, setAppointments] = useState(appointmentsData)
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)

  // ============================================
  // Appointment Modal State
  // ============================================
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointmentForAction, setSelectedAppointmentForAction] = useState(null)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)

  // ============================================
  // Edit Member Modal State
  // ============================================
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
  const [editMemberActiveTab, setEditMemberActiveTab] = useState("note")
  const [editingRelationsMain, setEditingRelationsMain] = useState(false)
  const [newRelationMain, setNewRelationMain] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [editFormMain, setEditFormMain] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    notes: [],
  })

  // ============================================
  // Edit Lead Modal State
  // ============================================
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null)
  const [editLeadActiveTab, setEditLeadActiveTab] = useState("note")

  // ============================================
  // Training Plan Modal State
  // ============================================
  const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)
  const [memberTrainingPlans, setMemberTrainingPlans] = useState(TRAINING_PLANS_DATA)
  const [availableTrainingPlans] = useState(AVAILABLE_TRAINING_PLANS)

  // ============================================
  // Effects - View Management Persistence
  // ============================================
  useEffect(() => {
    const savedViewsData = localStorage.getItem("dashboardViews")
    if (savedViewsData) {
      const views = JSON.parse(savedViewsData)
      setSavedViews(views)

      const standardView = views.find((view) => view.isStandard)
      if (standardView) {
        setWidgets([...standardView.widgets])
        setCurrentView(standardView)
      }
    }
  }, [])

  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem("dashboardViews", JSON.stringify(savedViews))
    }
  }, [savedViews])

  // ============================================
  // Widget Management Handlers
  // ============================================
  const toggleEditing = () => setIsEditing(!isEditing)

  const getWidgetPlacementStatus = useCallback(
    (widgetType, widgetArea = "dashboard") => {
      if (widgetArea === "dashboard") {
        const existsInMain = widgets.some((widget) => widget.type === widgetType)
        if (existsInMain) {
          return { canAdd: false, location: "dashboard" }
        }
        return { canAdd: true, location: null }
      }
      return { canAdd: true, location: null }
    },
    [widgets]
  )

  const moveWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= widgets.length) return
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setWidgets(updatedWidgets)
  }

  const removeWidget = (id) => {
    setWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  const handleAddWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType, "dashboard")
    if (!canAdd) {
      toast.error(`This widget is already added to your ${location}.`)
      return
    }
    const newWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      position: widgets.length,
    }
    setWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added successfully`)
  }

  // ============================================
  // Appointment Handlers
  // ============================================
  const handleCheckIn = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId 
          ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } 
          : appointment
      )
    )
    const appointment = appointments.find((app) => app.id === appointmentId)
    toast.success(appointment?.isCheckedIn ? "Member checked out successfully" : "Member checked in successfully")
  }

  const handleAppointmentOptionsModal = (appointment) => {
    if (appointment.isBlocked || appointment.type === "Blocked Time") {
      return
    }
    setSelectedAppointmentForAction(appointment)
    setIsAppointmentActionModalOpen(true)
  }

  const handleEditAppointment = () => {
    setIsAppointmentActionModalOpen(false)
    setIsEditAppointmentModalOpen(true)
  }

  const handleCancelAppointment = () => {
    if (selectedAppointmentForAction) {
      setAppointments(prev => prev.map(app =>
        app.id === selectedAppointmentForAction.id
          ? { ...app, isCancelled: true }
          : app
      ))
    }
    setIsAppointmentActionModalOpen(false)
    setSelectedAppointmentForAction(null)
  }

  const handleDeleteAppointment = () => {
    setAppointments(prev => prev.filter(a => a.id !== selectedAppointmentForAction?.id))
    setIsAppointmentActionModalOpen(false)
    setSelectedAppointmentForAction(null)
  }

  const handleViewMemberDetails = () => {
    setIsAppointmentActionModalOpen(false)
    if (!selectedAppointmentForAction) return

    const memberId = selectedAppointmentForAction.memberId
    const leadId = selectedAppointmentForAction.leadId

    if (memberId) {
      const memberName = selectedAppointmentForAction.lastName
        ? `${selectedAppointmentForAction.name} ${selectedAppointmentForAction.lastName}`
        : selectedAppointmentForAction.name

      navigate('/dashboard/members', {
        state: { filterMemberId: memberId, filterMemberName: memberName }
      })
    } else if (leadId) {
      navigate('/dashboard/leads', {
        state: { filterLeadId: leadId }
      })
    }
  }

  // ============================================
  // Edit Member Modal Handlers
  // ============================================
  const handleOpenEditMemberModal = (member, tab = "note") => {
    if (!member) return

    setSelectedMemberForEdit({
      ...member,
      note: member.note || "",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteImportance: member.noteImportance || "unimportant",
    })

    setEditFormMain({
      firstName: member.firstName || member.name?.split(" ")[0] || "",
      lastName: member.lastName || member.name?.split(" ").slice(1).join(" ") || "",
      email: member.email || "",
      phone: member.phone || "",
      street: member.street || "",
      zipCode: member.zipCode || "",
      city: member.city || "",
      dateOfBirth: member.dateOfBirth || "",
      about: member.about || "",
      note: member.note || "",
      noteStartDate: member.noteStartDate || "",
      noteEndDate: member.noteEndDate || "",
      noteImportance: member.noteImportance || "unimportant",
      notes: member.notes || [],
    })

    setEditMemberActiveTab(tab)
    setIsEditMemberModalOpen(true)
  }

  const handleInputChangeMain = (e) => {
    const { name, value } = e.target
    setEditFormMain((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmitMain = (e, localRelations = null) => {
    e?.preventDefault()

    if (localRelations && selectedMemberForEdit?.id) {
      setMemberRelations((prev) => ({
        ...prev,
        [selectedMemberForEdit.id]: localRelations,
      }))
    }

    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    setEditingRelationsMain(false)
    toast.success("Member details have been updated successfully")
  }

  const handleAddRelationMain = () => {
    if (!selectedMemberForEdit || !newRelationMain.name || !newRelationMain.relation) return

    const memberId = selectedMemberForEdit.id
    const category = newRelationMain.category

    const newRelation = {
      id: Date.now(),
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
      memberId: newRelationMain.selectedMemberId,
    }

    setMemberRelations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: [...(prev[memberId]?.[category] || []), newRelation],
      },
    }))

    setNewRelationMain({
      name: "",
      relation: "",
      category: "family",
      type: "manual",
      selectedMemberId: null,
    })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelationMain = (memberId, category, relationId) => {
    setMemberRelations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: prev[memberId]?.[category]?.filter((r) => r.id !== relationId) || [],
      },
    }))
    toast.success("Relation deleted successfully")
  }

  const handleCloseEditMemberModal = () => {
    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    setEditingRelationsMain(false)
  }

  // ============================================
  // Edit Lead Modal Handlers
  // ============================================
  const handleOpenEditLeadModal = (leadId, tab = "note") => {
    const lead = leadsData.find(l => l.id === leadId)
    if (!lead) return

    setSelectedLeadForEdit({
      ...lead,
      note: lead.note || "",
      noteStartDate: lead.noteStartDate || "",
      noteEndDate: lead.noteEndDate || "",
      noteImportance: lead.noteImportance || "unimportant",
    })
    setEditLeadActiveTab(tab)
    setIsEditLeadModalOpen(true)
  }

  const handleSaveEditLead = () => {
    setIsEditLeadModalOpen(false)
    setSelectedLeadForEdit(null)
    toast.success("Lead details have been updated successfully")
  }

  const handleCloseEditLeadModal = () => {
    setIsEditLeadModalOpen(false)
    setSelectedLeadForEdit(null)
  }

  // ============================================
  // Training Plan Handlers
  // ============================================
  const handleDumbbellClick = (appointment, e) => {
    if (e) e.stopPropagation()

    const memberData = {
      id: appointment.memberId,
      firstName: appointment.name,
      lastName: appointment.lastName || '',
      email: appointment.email || '',
    }

    setSelectedUserForTrainingPlan(memberData)
    setIsTrainingPlanModalOpen(true)
  }

  const handleAssignTrainingPlan = (memberId, planId) => {
    const plan = availableTrainingPlans.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = {
        ...plan,
        assignedDate: new Date().toLocaleDateString(),
      }

      setMemberTrainingPlans((prev) => ({
        ...prev,
        [memberId]: [...(prev[memberId] || []), assignedPlan],
      }))

      toast.success(`Training plan "${plan.name}" assigned successfully!`)
    }
  }

  const handleRemoveTrainingPlan = (memberId, planId) => {
    setMemberTrainingPlans((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId),
    }))
    toast.success("Training plan removed successfully!")
  }

  const handleCloseTrainingPlanModal = () => {
    setIsTrainingPlanModalOpen(false)
    setSelectedUserForTrainingPlan(null)
  }

  // ============================================
  // Helper Functions
  // ============================================
  const getMemberById = (memberId) => {
    if (!memberId) return null
    return membersData.find(m => m.id === memberId) || null
  }

  // ============================================
  // Website Links Handlers
  // ============================================
  const handleAddLink = (newLink) => setCustomLinks((prev) => [...prev, newLink])

  const handleEditLink = (updatedLink) => {
    setCustomLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === updatedLink.id ? { ...link, ...updatedLink } : link
      )
    )
  }

  const handleRemoveLink = (linkId) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== linkId))
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: "#333", color: "#fff" },
        }}
      />

      <div className="flex flex-col md:flex-row rounded-3xl bg-surface-base text-content-primary min-h-screen">
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-1 md:p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 justify-between">
                <h1 className="text-xl font-bold">My Area</h1>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center md:justify-end gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2 flex justify-center items-center md:w-auto w-full text-sm gap-2 bg-surface-button text-content-primary hover:bg-surface-button-hover rounded-lg cursor-pointer"
                  >
                    <Eye size={16} />
                    <span className="md:inline hidden">
                      {currentView ? currentView.name : "Standard View"}
                    </span>
                  </button>
                )}

                {isEditing && (
                  <button
                    onClick={() => setIsWidgetModalOpen(true)}
                    className="py-2 px-4 bg-black md:w-auto w-full justify-center text-white rounded-xl text-sm flex items-center gap-1"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Widget</span>
                  </button>
                )}

                <button
                  onClick={toggleEditing}
                  className={`px-6 py-2 text-sm flex md:w-auto w-full justify-center items-center gap-2 rounded-xl transition-colors ${
                    isEditing ? "bg-orange-500 text-white" : "bg-zinc-700 text-zinc-200"
                  }`}
                >
                  {isEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">
                    {isEditing ? "Done" : "Edit Dashboard"}
                  </span>
                </button>
              </div>
            </div>

            {/* Widgets Grid */}
            <div className="space-y-4">
              {/* Chart Widget - Full Width */}
              {widgets
                .filter((widget) => widget.type === "chart")
                .sort((a, b) => a.position - b.position)
                .map((widget) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={widgets.findIndex((w) => w.id === widget.id)}
                    moveWidget={moveWidget}
                    removeWidget={removeWidget}
                    isEditing={isEditing}
                    widgets={widgets}
                  >
                    <AnalyticsChartWidget
                      isEditing={isEditing}
                      onRemove={() => removeWidget(widget.id)}
                    />
                  </DraggableWidget>
                ))}

              {/* Other Widgets - Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets
                  .filter((widget) => widget.type !== "chart")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => (
                    <DraggableWidget
                      key={widget.id}
                      id={widget.id}
                      index={widgets.findIndex((w) => w.id === widget.id)}
                      moveWidget={moveWidget}
                      removeWidget={removeWidget}
                      isEditing={isEditing}
                      widgets={widgets}
                    >
                      {widget.type === "expiringContracts" && (
                        <ExpiringContractsWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "appointments" && (
                        <UpcomingAppointmentsWidget
                          isSidebarEditing={isEditing}
                          appointments={appointments}
                          onAppointmentClick={handleAppointmentOptionsModal}
                          onCheckIn={handleCheckIn}
                          onOpenEditMemberModal={handleOpenEditMemberModal}
                          onOpenEditLeadModal={handleOpenEditLeadModal}
                          onOpenTrainingPlansModal={handleDumbbellClick}
                          getMemberById={getMemberById}
                          showCollapseButton={false}
                          useFixedHeight={true}
                          backgroundColor="bg-surface-button"
                          showDatePicker={true}
                          initialDate={new Date()}
                        />
                      )}

                      {widget.type === "staffCheckIn" && <StaffCheckInWidget />}

                      {widget.type === "websiteLink" && (
                        <WebsiteLinksWidget
                          isEditing={isEditing}
                          onRemove={() => removeWidget(widget.id)}
                          customLinks={customLinks}
                          onAddLink={handleAddLink}
                          onEditLink={handleEditLink}
                          onRemoveLink={handleRemoveLink}
                        />
                      )}

                      {widget.type === "todo" && (
                        <ToDoWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "birthday" && (
                        <UpcomingBirthdaysWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "bulletinBoard" && (
                        <BulletinBoardWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "notes" && (
                        <NotesWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "shiftSchedule" && (
                        <ShiftScheduleWidget
                          isEditing={isEditing}
                          onRemove={() => removeWidget(widget.id)}
                        />
                      )}
                    </DraggableWidget>
                  ))}
              </div>
            </div>
          </div>
        </main>

        {/* ============================================ */}
        {/* Modals */}
        {/* ============================================ */}

        {/* View Management Modal */}
        <ViewManagementModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          savedViews={savedViews}
          setSavedViews={setSavedViews}
          currentView={currentView}
          setCurrentView={setCurrentView}
          widgets={widgets}
          setWidgets={setWidgets}
        />

        {/* Widget Selection Modal */}
        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "dashboard")}
          widgetArea="dashboard"
        />

        {/* Appointment Action Modal */}
        <AppointmentActionModal
          isOpen={isAppointmentActionModalOpen}
          onClose={() => {
            setIsAppointmentActionModalOpen(false)
            setSelectedAppointmentForAction(null)
          }}
          appointmentMain={selectedAppointmentForAction}
          onEdit={handleEditAppointment}
          onCancel={handleCancelAppointment}
          onDelete={handleDeleteAppointment}
          onViewMember={handleViewMemberDetails}
          onEditMemberNote={handleOpenEditMemberModal}
          onOpenEditLeadModal={handleOpenEditLeadModal}
          memberRelations={memberRelationsData}
          leadRelations={leadRelationsData}
          appointmentsMain={appointments}
          setAppointmentsMain={setAppointments}
        />

        {/* Edit Appointment Modal */}
        {isEditAppointmentModalOpen && selectedAppointmentForAction && (
          <EditAppointmentModal
            selectedAppointmentMain={selectedAppointmentForAction}
            setSelectedAppointmentMain={setSelectedAppointmentForAction}
            appointmentTypesMain={appointmentTypesData}
            freeAppointmentsMain={freeAppointmentsData}
            handleAppointmentChange={(changes) => 
              setSelectedAppointmentForAction((prev) => ({ ...prev, ...changes }))
            }
            appointmentsMain={appointments}
            setAppointmentsMain={setAppointments}
            setIsNotifyMemberOpenMain={() => {}}
            setNotifyActionMain={() => {}}
            onDelete={() => {
              setAppointments(prev => prev.filter(a => a.id !== selectedAppointmentForAction?.id))
              setIsEditAppointmentModalOpen(false)
              setSelectedAppointmentForAction(null)
            }}
            onClose={() => {
              setIsEditAppointmentModalOpen(false)
              setSelectedAppointmentForAction(null)
            }}
            onOpenEditMemberModal={handleOpenEditMemberModal}
            onOpenEditLeadModal={handleOpenEditLeadModal}
            memberRelations={memberRelationsData}
            leadRelations={leadRelationsData}
          />
        )}

        {/* Edit Member Modal */}
        {isEditMemberModalOpen && selectedMemberForEdit && (
          <EditMemberModalMain
            isOpen={isEditMemberModalOpen}
            onClose={handleCloseEditMemberModal}
            selectedMemberMain={selectedMemberForEdit}
            editModalTabMain={editMemberActiveTab}
            setEditModalTabMain={setEditMemberActiveTab}
            editFormMain={editFormMain}
            handleInputChangeMain={handleInputChangeMain}
            handleEditSubmitMain={handleEditSubmitMain}
            editingRelationsMain={editingRelationsMain}
            setEditingRelationsMain={setEditingRelationsMain}
            newRelationMain={newRelationMain}
            setNewRelationMain={setNewRelationMain}
            availableMembersLeadsMain={availableMembersLeadsNew}
            relationOptionsMain={RELATION_OPTIONS}
            handleAddRelationMain={handleAddRelationMain}
            memberRelationsMain={memberRelations}
            handleDeleteRelationMain={handleDeleteRelationMain}
          />
        )}

        {/* Edit Lead Modal */}
        {isEditLeadModalOpen && selectedLeadForEdit && (
          <EditLeadModal
            isVisible={isEditLeadModalOpen}
            onClose={handleCloseEditLeadModal}
            onSave={handleSaveEditLead}
            leadData={selectedLeadForEdit}
            memberRelationsLead={leadRelationsData[selectedLeadForEdit?.id] || {}}
            setMemberRelationsLead={() => {}}
            availableMembersLeads={availableMembersLeadsNew}
            columns={LEAD_COLUMNS}
            initialTab={editLeadActiveTab}
          />
        )}

        {/* Training Plans Modal */}
        <TrainingPlansModalMain
          isOpen={isTrainingPlanModalOpen}
          onClose={handleCloseTrainingPlanModal}
          selectedMember={selectedUserForTrainingPlan}
          memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
          availableTrainingPlans={availableTrainingPlans}
          onAssignPlan={handleAssignTrainingPlan}
          onRemovePlan={handleRemoveTrainingPlan}
        />
      </div>
    </>
  )
}
