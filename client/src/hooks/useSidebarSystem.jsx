/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Info } from "react-feather" 
import { CalendarIcon, Edit, X } from "lucide-react"
import {
  appointmentsData,
  availableMembersLeadsNew,
  birthdaysData,
  communicationsData,
  customLinksData,
  expiringContractsData,
  memberContingentDataNew,
  memberRelationsData,
  memberTypesData,
  mockTrainingPlansNew,
  mockVideosNew,
  notificationData,
  todosData,
} from "../utils/user-panel-states/myarea-states"
import { createPortal } from "react-dom"

export const useSidebarSystem = () => {
  const navigate = useNavigate()


  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  // ===== SIDEBAR STATES =====
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)

  const [customLinks, setCustomLinks] = useState(customLinksData)
  const [todos, setTodos] = useState(todosData)
  const [birthdays, setBirthdays] = useState(birthdaysData)
  const [expiringContracts, setExpiringContracts] = useState(expiringContractsData)
  const [notifications, setNotifications] = useState(notificationData)
  const [appointments, setAppointments] = useState(appointmentsData)
  const [memberContingentData, setMemberContingentData] = useState(memberContingentDataNew)
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)

  const memberTypes = memberTypesData
  const availableMembersLeads = availableMembersLeadsNew
  const mockTrainingPlans = mockTrainingPlansNew
  const mockVideos = mockVideosNew

  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]

  // ===== TASK/TODO STATES =====
  const [editingTask, setEditingTask] = useState(null)
  const [todoFilter, setTodoFilter] = useState("all")
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const [taskToCancel, setTaskToCancel] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // ===== BIRTHDAY STATES =====
  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")

  // ===== NOTE STATES =====
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [isSpecialNoteModalOpen, setIsSpecialNoteModalOpen] = useState(false)
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState(null)

  // ===== TRAINING PLAN STATES =====
  const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)

  // ===== APPOINTMENT STATES =====
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)
  const [showAppointmentOptionsModal, setShowAppointmentOptionsModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [freeAppointments, setFreeAppointments] = useState([])

  // ===== MEMBER STATES =====
  const [selectedMember, setSelectedMember] = useState(null)
  const [isMemberOverviewModalOpen, setIsMemberOverviewModalOpen] = useState(false)
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editModalTab, setEditModalTab] = useState("details")

  // ===== NOTIFICATION STATES =====
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")

  // ===== HISTORY STATES =====
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [memberHistory, setMemberHistory] = useState({})

  // ===== BILLING/CONTINGENT STATES =====
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("January 2025")
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current")
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [newBillingPeriod, setNewBillingPeriod] = useState("")
  const [showContingentModal, setShowContingentModal] = useState(false)

  // ===== MEMBER RELATIONS STATES =====
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  // ===== EDIT FORM STATES =====
  const [editForm, setEditForm] = useState({
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
    contractStart: "",
    contractEnd: "",
  })

  // ===== WIDGET STATES =====
  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "expiringContracts", type: "expiringContracts", position: 1 },
    { id: "appointments", type: "appointments", position: 2 },
    { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
    { id: "websiteLink", type: "websiteLink", position: 4 },
    { id: "communications", type: "communications", position: 5 },
    { id: "todo", type: "todo", position: 6 },
    { id: "birthday", type: "birthday", position: 7 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 8 },
    { id: "notes", type: "notes", position: 9 },
    { id: "sidebarShiftSchedule", type: "shiftSchedule", position: 10 }

  ])

  const [rightSidebarWidgets, setRightSidebarWidgets] = useState([
    // { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
    { id: "sidebarAppointments", type: "appointments", position: 4 },
    { id: "sidebarChart", type: "chart", position: 5 },
    { id: "sidebarExpiringContracts", type: "expiringContracts", position: 6 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 7 },
    { id: "sidebarStaffCheckIn", type: "staffCheckIn", position: 8 },
    { id: "notes", type: "notes", position: 9 },
    { id: "sidebarShiftSchedule", type: "shiftSchedule", position: 10 }
  ])

  // Training Plans States
  const [memberTrainingPlans, setMemberTrainingPlans] = useState({})
  const [availableTrainingPlans, setAvailableTrainingPlans] = useState([
    {
      id: 1,
      name: "Beginner Full Body",
      description: "Complete full body workout for beginners",
      duration: "4 weeks",
      difficulty: "Beginner",
    },
    {
      id: 2,
      name: "Advanced Strength Training",
      description: "High intensity strength building program",
      duration: "8 weeks",
      difficulty: "Advanced",
    },
    {
      id: 3,
      name: "Weight Loss Circuit",
      description: "Fat burning circuit training program",
      duration: "6 weeks",
      difficulty: "Intermediate",
    },
    {
      id: 4,
      name: "Muscle Building Split",
      description: "Targeted muscle building program",
      duration: "12 weeks",
      difficulty: "Intermediate",
    },
  ])

  // ===== REFS =====
  const notePopoverRef = useRef(null)

  // ===== SIDEBAR FUNCTIONS =====
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const toggleSidebarEditing = () => {
    setIsSidebarEditing(!isSidebarEditing)
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  // ===== WIDGET FUNCTIONS =====
  const moveRightSidebarWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= rightSidebarWidgets.length) return
    const newWidgets = [...rightSidebarWidgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setRightSidebarWidgets(updatedWidgets)
  }

  const removeRightSidebarWidget = (id) => {
    setRightSidebarWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  const getWidgetPlacementStatus = useCallback(
    (widgetType, widgetArea = "dashboard") => {
      if (widgetArea === "dashboard") {
        const existsInMain = widgets.some((widget) => widget.type === widgetType)
        if (existsInMain) {
          return { canAdd: false, location: "dashboard" }
        }
        return { canAdd: true, location: null }
      } else if (widgetArea === "sidebar") {
        const existsInSidebar = rightSidebarWidgets.some((widget) => widget.type === widgetType)
        if (existsInSidebar) {
          return { canAdd: false, location: "sidebar" }
        }
        return { canAdd: true, location: null }
      }
      return { canAdd: true, location: null }
    },
    [widgets, rightSidebarWidgets],
  )

  const handleAddRightSidebarWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType, "sidebar")
    if (!canAdd) {
      toast.error(`This widget is already added to your ${location}.`)
      return
    }
    const newWidget = {
      id: `rightWidget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      position: rightSidebarWidgets.length,
    }
    setRightSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar`)
  }

  // ===== TASK FUNCTIONS =====
  const handleTaskComplete = (taskId, todos, setTodos) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === taskId
          ? { ...todo, completed: !todo.completed, status: todo.completed ? "ongoing" : "completed" }
          : todo,
      ),
    )
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsEditTaskModalOpen(true)
  }

  const handleUpdateTask = (updatedTask, setTodos) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)))
  }

  const handleCancelTask = (taskId, setTodos) => {
    setTodos((prev) => prev.map((todo) => (todo.id === taskId ? { ...todo, status: "cancelled" } : todo)))
    setTaskToCancel(null)
  }

  const handleDeleteTask = (taskId, setTodos) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId))
    setTaskToDelete(null)
  }

  // ===== BIRTHDAY FUNCTIONS =====
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const isBirthdayToday = (date) => {
    return date === today
  }

  const handleSendBirthdayMessage = (person) => {
    setSelectedBirthdayPerson(person)
    setBirthdayMessage(`Happy Birthday ${person.name}! 🎉 Wishing you a wonderful day filled with joy and celebration!`)
    setIsBirthdayMessageModalOpen(true)
  }

  // ===== APPOINTMENT FUNCTIONS =====
  const handleEditNote = (appointmentId, currentNote, appointments) => {
    const appointment = appointments.find((app) => app.id === appointmentId)
    if (appointment) {
      setIsSpecialNoteModalOpen(false)
      setSelectedAppointmentForNote(null)
      setTimeout(() => {
        setSelectedAppointmentForNote(appointment)
        setIsSpecialNoteModalOpen(true)
      }, 10)
    }
  }

  const handleDumbbellClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedUserForTrainingPlan(appointment)
    setIsTrainingPlanModalOpen(true)
  }

  const handleCheckIn = (appointmentId, appointments, setAppointments) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment,
      ),
    )
    toast.success(
      appointments.find((app) => app.id === appointmentId)?.isCheckedIn
        ? "Member checked In successfully"
        : "Member check in successfully",
    )
  }

  const handleAppointmentOptionsModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentOptionsModal(true)
    setIsEditAppointmentModalOpen(false)
  }

  const handleSaveSpecialNote = (appointmentId, updatedNote, setAppointments) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, specialNote: updatedNote } : app)),
    )
    toast.success("Special note updated successfully")
  }

  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

  const handleCancelAppointment = () => {
    setShowAppointmentOptionsModal(false)
    setNotifyAction("cancel")
    if (selectedAppointment) {
      const updatedApp = { ...selectedAppointment, status: "cancelled", isCancelled: true }
      setSelectedAppointment(updatedApp)
      setIsNotifyMemberOpen(true)
    }
  }

  const actuallyHandleCancelAppointment = (shouldNotify, appointments, setAppointments) => {
    if (!appointments || !setAppointments || !selectedAppointment) return
    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointments(updatedAppointments)
    toast.success("Appointment cancelled successfully")
    if (shouldNotify) {
      console.log("Notifying member about cancellation")
    }
    setSelectedAppointment(null)
  }

  const handleDeleteAppointment = (id) => {
    setSelectedAppointment(null)
    setIsEditAppointmentModalOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsEditAppointmentModalOpen(true)
    setShowAppointmentModal(false)
  }

  const handleCreateNewAppointment = () => {
    setShowAppointmentModal(false)
    navigate("/dashboard/appointments?action=create")
  }

  // ===== MEMBER FUNCTIONS =====
  const handleViewMemberDetails = () => {
    if (selectedAppointment) {
      const mockMember = {
        id: selectedAppointment.id,
        title: selectedAppointment.name,
        firstName: selectedAppointment.name.split(" ")[0] || selectedAppointment.name,
        lastName: selectedAppointment.name.split(" ").slice(1).join(" ") || "",
        name: selectedAppointment.name,
        email: selectedAppointment.email || "",
        phone: selectedAppointment.phone || "",
        street: selectedAppointment.street || "",
        zipCode: selectedAppointment.zipCode || "",
        city: selectedAppointment.city || "",
        dateOfBirth: selectedAppointment.dateOfBirth || "",
        joinDate: selectedAppointment.joinDate || "",
        about: selectedAppointment.about || "",
        memberType: selectedAppointment.memberType || "",
        contractStart: selectedAppointment.contractStart || "",
        contractEnd: selectedAppointment.contractEnd || "",
        autoArchiveDate: selectedAppointment.autoArchiveDate || "",
        image: selectedAppointment.image || null,
        note: selectedAppointment.specialNote?.text || null,
        noteStartDate: selectedAppointment.specialNote?.startDate,
        noteEndDate: selectedAppointment.specialNote?.endDate,
        noteImportance: selectedAppointment.specialNote?.isImportant ? "important" : "unimportant",
      }
      setSelectedMember(mockMember)
      setIsMemberOverviewModalOpen(true)
      setShowAppointmentOptionsModal(false)
    }
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    toast.success("Member notified successfully!")
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false
    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)
    return endDate <= oneMonthFromNow && endDate >= today
  }

  const redirectToContract = () => {
    navigate("/dashboard/contract")
    setIsMemberDetailsModalOpen(false)
    setSelectedMember(null)
  }

  const handleCalendarFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    if (selectedMember) {
      setShowAppointmentModal(true)
    }
  }

  const handleHistoryFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    setShowHistoryModal(true)
  }

  const handleCommunicationFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    navigate("/dashboard/communication")
  }

  const handleViewDetailedInfo = () => {
    setIsMemberOverviewModalOpen(false)
    setActiveMemberDetailsTab("details")
    setIsMemberDetailsModalOpen(true)
  }

  const handleEditFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    setEditForm({
      firstName: selectedMember.firstName || "",
      lastName: selectedMember.lastName || "",
      email: selectedMember.email || "",
      phone: selectedMember.phone || "",
      street: selectedMember.street || "",
      zipCode: selectedMember.zipCode || "",
      city: selectedMember.city || "",
      dateOfBirth: selectedMember.dateOfBirth || "",
      about: selectedMember.about || "",
      note: selectedMember.note || "",
      noteStartDate: selectedMember.noteStartDate || "",
      noteEndDate: selectedMember.noteEndDate || "",
      noteImportance: selectedMember.noteImportance || "unimportant",
      contractStart: selectedMember.contractStart || "",
      contractEnd: selectedMember.contractEnd || "",
    })
    setIsEditModalOpen(true)
  }

  const getMemberAppointments = (memberId, appointments) => {
    return appointments.filter((app) => app.id === memberId)
  }

  // ===== BILLING/CONTINGENT FUNCTIONS =====
  const handleManageContingent = (memberContingentData) => {
    const memberId = selectedMember?.id
    if (memberId && memberContingentData[memberId]) {
      setTempContingent(memberContingentData[memberId].current)
      setSelectedBillingPeriod("current")
    } else {
      setTempContingent({ used: 0, total: 0 })
      setSelectedBillingPeriod("current")
    }
    setShowContingentModal(true)
  }

  const getBillingPeriods = (memberId, memberContingentData) => {
    const memberData = memberContingentData[memberId]
    if (!memberData) return []
    const periods = [{ id: "current", label: `Current (${currentBillingPeriod})`, data: memberData.current }]
    if (memberData.future) {
      Object.entries(memberData.future).forEach(([period, data]) => {
        periods.push({
          id: period,
          label: `Future (${period})`,
          data: data,
        })
      })
    }
    return periods
  }

  const handleAddBillingPeriod = (memberContingentData, setMemberContingentData) => {
    if (newBillingPeriod.trim() && selectedMember) {
      const updatedContingent = { ...memberContingentData }
      if (!updatedContingent[selectedMember.id].future) {
        updatedContingent[selectedMember.id].future = {}
      }
      updatedContingent[selectedMember.id].future[newBillingPeriod] = { used: 0, total: 0 }
      setMemberContingentData(updatedContingent)
      setNewBillingPeriod("")
      setShowAddBillingPeriodModal(false)
      toast.success("New billing period added successfully")
    }
  }

  const handleSaveContingent = (memberContingentData, setMemberContingentData) => {
    const memberId = selectedMember?.id
    if (memberId && memberContingentData[memberId]) {
      const updatedContingent = { ...memberContingentData }
      if (selectedBillingPeriod === "current") {
        updatedContingent[memberId].current = { ...tempContingent }
      } else {
        if (!updatedContingent[memberId].future) {
          updatedContingent[memberId].future = {}
        }
        updatedContingent[memberId].future[selectedBillingPeriod] = { ...tempContingent }
      }
      setMemberContingentData(updatedContingent)
      toast.success("Contingent updated successfully!")
    }
    setShowContingentModal(false)
  }

  // ===== EDIT FORM FUNCTIONS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = (e, appointments, setAppointments) => {
    e.preventDefault()
    const updatedAppointments = appointments.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          name: `${editForm.firstName} ${editForm.lastName}`,
          email: editForm.email,
          phone: editForm.phone,
          street: editForm.street,
          zipCode: editForm.zipCode,
          city: editForm.city,
          dateOfBirth: editForm.dateOfBirth,
          about: editForm.about,
          note: editForm.note,
          noteStartDate: editForm.noteStartDate,
          noteEndDate: editForm.noteEndDate,
          noteImportance: editForm.noteImportance,
          contractStart: editForm.contractStart,
          contractEnd: editForm.contractEnd,
        }
      }
      return member
    })
    setAppointments(updatedAppointments)
    setSelectedMember({
      ...selectedMember,
      ...editForm,
      name: `${editForm.firstName} ${editForm.lastName}`,
    })
    setIsEditModalOpen(false)
    toast.success("Member details have been updated successfully")
  }

  // ===== RELATION FUNCTIONS =====
  const handleAddRelation = (memberRelations, setMemberRelations) => {
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all fields")
      return
    }
    const relationId = Date.now()
    const updatedRelations = { ...memberRelations }
    if (!updatedRelations[selectedMember.id]) {
      updatedRelations[selectedMember.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }
    updatedRelations[selectedMember.id][newRelation.category].push({
      id: relationId,
      name: newRelation.name,
      relation: newRelation.relation,
      type: newRelation.type,
    })
    setMemberRelations(updatedRelations)
    setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelation = (category, relationId, memberRelations, setMemberRelations) => {
    const updatedRelations = { ...memberRelations }
    updatedRelations[selectedMember.id][category] = updatedRelations[selectedMember.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  const handleArchiveMember = (memberId, appointments, setAppointments) => {
    const member = appointments.find((m) => m.id === memberId)
    if (member && member.memberType === "temporary") {
      if (window.confirm("Are you sure you want to archive this temporary member?")) {
        setAppointments((prev) =>
          prev.map((member) =>
            member.id === memberId
              ? { ...member, isArchived: true, archivedDate: new Date().toISOString().split("T")[0] }
              : member,
          ),
        )
        toast.success("Temporary member archived successfully")
      }
    } else {
      toast.error("Only temporary members can be archived")
    }
  }

  const handleUnarchiveMember = (memberId, appointments, setAppointments) => {
    const member = appointments.find((m) => m.id === memberId)
    if (member && member.memberType === "temporary") {
      setAppointments((prev) =>
        prev.map((member) => (member.id === memberId ? { ...member, isArchived: false, archivedDate: null } : member)),
      )
      toast.success("Temporary member unarchived successfully")
    } else {
      toast.error("Only temporary members can be unarchived")
    }
  }

  // ===== UTILITY FUNCTIONS =====
  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null
  
      const handleNoteClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(activeNoteId === memberId ? null : memberId)
      }
  
      const handleMouseEnter = (e) => {
        e.stopPropagation()
        // Clear any existing timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }
        
        // Set a small delay before showing to prevent flickering
        const timeout = setTimeout(() => {
          setHoveredNoteId(memberId)
        }, 300)
        setHoverTimeout(timeout)
      }
  
      const handleMouseLeave = (e) => {
        e.stopPropagation()
        // Clear the timeout if mouse leaves before delay
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }
        setHoveredNoteId(null)
      }
  
      const handleEditClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(null) // Close the note popover
        setHoveredNoteId(null) // Close hover popover
        handleEditNote(memberId, specialNote) // Open the edit modal
      }
  
      // Determine if we should show the popover (either clicked or hovered)
      const shouldShowPopover = activeNoteId === memberId || hoveredNoteId === memberId
  
      return (
        <div className="relative">
          <div
            className={`${specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer transition-all duration-200 hover:scale-110`}
            onClick={handleNoteClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>
  
          {shouldShowPopover && (
            createPortal(
              <div
                ref={notePopoverRef}
                className="fixed w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999]"
                style={{
                  top: (() => {
                    const trigger = document.querySelector(`[data-note-trigger="${memberId}"]`);
                    if (!trigger) return '50%';
                    const rect = trigger.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const popoverHeight = 200; // approximate height
  
                    // If not enough space below, show above
                    if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
                      return `${rect.top - popoverHeight - 8}px`;
                    }
                    return `${rect.bottom + 8}px`;
                  })(),
                  left: (() => {
                    const trigger = document.querySelector(`[data-note-trigger="${memberId}"]`);
                    if (!trigger) return '50%';
                    const rect = trigger.getBoundingClientRect();
                    const popoverWidth = 296; // w-74 = 296px
  
                    // Keep within viewport
                    let left = rect.left;
                    if (left + popoverWidth > window.innerWidth) {
                      left = window.innerWidth - popoverWidth - 16;
                    }
                    if (left < 16) left = 16;
  
                    return `${left}px`;
                  })(),
                }}
                onMouseEnter={() => {
                  // Keep open when hovering over popover
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(memberId)
                  }
                }}
                onMouseLeave={() => {
                  // Only close if it was opened via hover (not click)
                  if (hoveredNoteId === memberId) {
                    setHoveredNoteId(null)
                  }
                }}
              >
                <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {specialNote.isImportant ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex text-sm gap-1 items-center font-medium">
                    <div>Special Note</div>
                    <div className="text-sm text-gray-400">
                      {specialNote.isImportant ? "(Important)" : ""}
                    </div>
                  </h4>
                  <button
                    onClick={handleEditClick}
                    className="ml-auto text-gray-400 hover:text-white mr-2 transition-colors"
                    title="Edit Note"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveNoteId(null)
                      setHoveredNoteId(null)
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
                  {specialNote.startDate && specialNote.endDate ? (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <CalendarIcon size={12} />
                        Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                        {new Date(specialNote.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-300 flex items-center gap-1.5">
                        <CalendarIcon size={12} />
                        Always valid
                      </p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )
          )}
          
          {/* Add data attribute to the trigger for positioning */}
          <div 
            data-note-trigger={memberId}
            className="hidden"
          />
        </div>
      )
    },
    [activeNoteId, setActiveNoteId, hoveredNoteId, hoverTimeout, handleEditNote],
  )

  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "canceled", label: "Canceled", color: "#ef4444" },
  ]

  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  // Functions related to adding training plan

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

  // ===== RETURN ALL STATES AND FUNCTIONS =====
  return {
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

  }
}
