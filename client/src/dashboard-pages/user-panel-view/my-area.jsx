// user panel --- my area 

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  MoreVertical,
  X,
  Clock,
  ChevronDown,
  Edit,
  Check,
  Plus,
  AlertTriangle,
  Info,
  CalendarIcon,
  Menu,
  ExternalLink,
  Settings,
  MessageCircle,
  Dumbbell,
  FileText,
  Eye,
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"


import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import MemberOverviewModal from "../../components/myarea-components/MemberOverviewModal"
import ViewManagementModal from "../../components/myarea-components/ViewManagementModal"
import StaffCheckInWidget from "../../components/myarea-components/widgets/StaffWidgetCheckIn"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import DraggableWidget from "../../components/myarea-components/DraggableWidget"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"

import Sidebar from "../../components/myarea-components/MyAreaSidebar"
import { SpecialNoteEditModal } from "../../components/myarea-components/SpecialNoteEditModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"

import { notificationData, memberContingentDataNew, mockTrainingPlansNew, mockVideosNew, memberRelationsData, mockMemberHistoryNew, mockMemberRelationsNew, availableMembersLeadsNew, customLinksData, communicationsData, todosData, appointmentsData, birthdaysData, memberTypesData, expiringContractsData, bulletinBoardData } from "../../utils/user-panel-states/myarea-states"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import BirthdayMessageModal from "../../components/myarea-components/BirthdayMessageModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import NotesWidget from "../../components/myarea-components/widgets/NotesWidjets"
import BulletinBoardWidget from "../../components/myarea-components/widgets/BulletinBoardWidget"
import AddTaskModal from "../../components/user-panel-components/task-components/add-task-modal"
import { configuredTagsData } from "../../utils/user-panel-states/todo-states"
import ShiftScheduleWidget from "../../components/myarea-components/widgets/ShiftScheduleWidget"
import { createPortal } from "react-dom"
import AnalyticsChartWidget from "../../components/myarea-components/widgets/AnalyticsChartWidget"
import { MemberDocumentModal } from "../../components/myarea-components/MemberDocumentManageModal"


export default function MyArea() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const navigate = useNavigate()
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)

  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })


  const [showAppointmentOptionsModal, setshowAppointmentOptionsModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")

  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToCancel, setTaskToCancel] = useState(null)
  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")

  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [freeAppointments, setFreeAppointments] = useState([])
  const today = new Date().toISOString().split("T")[0]

  const [isSpecialNoteModalOpen, setIsSpecialNoteModalOpen] = useState(false)
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState(null)


  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const [isMemberOverviewModalOpen, setisMemberOverviewModalOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details") // 'details', 'relations'
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)

  const [selectedMember, setSelectedMember] = useState(null)
  const [memberHistory, setMemberHistory] = useState({})
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("January 2025")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editModalTab, setEditModalTab] = useState("details")

  const [notifications, setnotifications] = useState(notificationData)
  const [memberContingentData, setMemberContingentData] = useState(memberContingentDataNew)

  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedMemberForDocuments, setSelectedMemberForDocuments] = useState(null)


  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)


  const DefaultAvatar = Avatar
  const availableMembersLeads = availableMembersLeadsNew
  const mockMemberRelations = mockMemberRelationsNew
  const mockMemberHistory = mockMemberHistoryNew
  const mockTrainingPlans = mockTrainingPlansNew
  const mockVideos = mockVideosNew
  const memberTypes = memberTypesData



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

  const [customLinks, setCustomLinks] = useState(customLinksData)

  const [communications, setCommunications] = useState(communicationsData)

  const [todos, setTodos] = useState(todosData)

  const [appointments, setAppointments] = useState(appointmentsData)

  const [birthdays, setBirthdays] = useState(birthdaysData)

  const [expiringContracts, setExpiringContracts] = useState(expiringContractsData)


  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "expiringContracts", type: "expiringContracts", position: 1 }, // Moved to start of grid
    { id: "appointments", type: "appointments", position: 2 },
    { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
    { id: "websiteLink", type: "websiteLink", position: 4 },
    { id: "todo", type: "todo", position: 5 },
    { id: "birthday", type: "birthday", position: 6 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 7 }, // Add this line
    { id: "notes", type: "notes", position: 8 },
    { id: "shiftSchedule", type: "shiftSchedule", position: 9 }
  ])

  // Add right sidebar widgets state
  const [rightSidebarWidgets, setRightSidebarWidgets] = useState([
    { id: "todo", type: "todo", position: 0 },
    { id: "birthday", type: "birthday", position: 1 },
    { id: "websiteLinks", type: "websiteLinks", position: 2 },
    { id: "sidebarAppointments", type: "appointments", position: 3 },
    { id: "sidebarChart", type: "chart", position: 4 },
    { id: "sidebarExpiringContracts", type: "expiringContracts", position: 5 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 6 }, // Add this line

    { id: "sidebarStaffCheckIn", type: "staffCheckIn", position: 7 },
    { id: "notes", type: "notes", position: 8 },
    { id: "shiftSchedule", type: "shiftSchedule", position: 9 }
  ])

  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen)
  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)
  const toggleSidebarEditing = () => setIsSidebarEditing(!isSidebarEditing) // Toggle sidebar edit mode
  const [activeNoteId, setActiveNoteId] = useState(null)
  const todoFilterDropdownRef = useRef(null)

  const [selectedAppointment, setselectedAppointment] = useState()
  const [isEditAppointmentModalOpen, setisEditAppointmentModalOpen] = useState(false)

  const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)

  const [editingLink, setEditingLink] = useState(null)


  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 }) // For contingent modal
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current") // For contingent modal
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false) // For contingent modal
  const [newBillingPeriod, setNewBillingPeriod] = useState("") // For contingent modal
  const [showContingentModal, setShowContingentModal] = useState(false)

  const [tasks, setTasks] = useState([])
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)


  const notePopoverRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
        setActiveNoteId(null)
      }
    }
    if (activeNoteId !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeNoteId])


  useEffect(() => {
    setMemberHistory(mockMemberHistory)
    setMemberRelations(mockMemberRelations)
    setMemberContingentData(memberContingentData)
  }, [])

  useEffect(() => {
    if (selectedMember && isEditModalOpen) {
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
    }
  }, [selectedMember, isEditModalOpen])

  useEffect(() => {
    const savedViewsData = localStorage.getItem("dashboardViews")
    if (savedViewsData) {
      const views = JSON.parse(savedViewsData)
      setSavedViews(views)

      // Load standard view if exists
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null)
      }
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(event.target)) {
        setIsChartDropdownOpen(false)
      }
      if (todoFilterDropdownRef.current && !todoFilterDropdownRef.current.contains(event.target)) {
        setIsTodoFilterDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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




  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  const handleAddTask = (newTask) => {
    setTodos(prevTodos => [...prevTodos, newTask]) // Also add to todos if needed
    toast.success("Task added successfully!")
  }



  const handleEditSubmit = (e) => {
    e.preventDefault()

    // Update appointments array (since your members are stored in appointments)
    const updatedAppointments = appointments.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          name: `${editForm.firstName} ${editForm.lastName}`, // Update the name field too
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


  const handleDeleteRelation = (category, relationId) => {
    const updatedRelations = { ...memberRelations }
    updatedRelations[selectedMember.id][category] = updatedRelations[selectedMember.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  const handleArchiveMember = (memberId) => {
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

  const handleUnarchiveMember = (memberId) => {
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

  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  const handleAddRelation = () => {
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

  const handleSaveContingent = () => {
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
      alert("Contingent updated successfully!")
    }
    setShowContingentModal(false)
  }
  const getBillingPeriods = (memberId) => {
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
  const handleAddBillingPeriod = () => {
    if (newBillingPeriod.trim() && selectedMember) {
      const updatedContingent = { ...memberContingentData }
      if (!updatedContingent[selectedMember.id].future) {
        updatedContingent[selectedMember.id].future = {}
      }
      updatedContingent[selectedMember.id].future[newBillingPeriod] = { used: 0, total: 0 }
      setMemberContingentData(updatedContingent)
      setNewBillingPeriod("")
      setShowAddBillingPeriodModal(false)
      alert("New billing period added successfully")
    }
  }

  const getWidgetPlacementStatus = useCallback(
    (widgetType, widgetArea = "dashboard") => {
      if (widgetArea === "dashboard") {
        // Only check main dashboard widgets for dashboard area
        const existsInMain = widgets.some((widget) => widget.type === widgetType)
        if (existsInMain) {
          return { canAdd: false, location: "dashboard" }
        }
        return { canAdd: true, location: null }
      } else if (widgetArea === "sidebar") {
        // Only check sidebar widgets for sidebar area
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

  const moveWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= widgets.length) return
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setWidgets(updatedWidgets)
  }

  const removeWidget = (id) => {
    setWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      // Update positions after removal
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  const moveRightSidebarWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= rightSidebarWidgets.length) return
    const newWidgets = [...rightSidebarWidgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setRightSidebarWidgets(updatedWidgets)
  }

  const removeRightSidebarWidget = (id) => {
    setRightSidebarWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      // Update positions after removal
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  const addCustomLink = () => {
    setEditingLink({})
  }

  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
  }

  const handleCheckIn = (appointmentId) => {
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

  const handleEditNote = (appointmentId, currentNote) => {
    const appointment = appointments.find((app) => app.id === appointmentId)
    if (appointment) {
      // Close any existing modal first to ensure clean state
      setIsSpecialNoteModalOpen(false)
      setSelectedAppointmentForNote(null)

      // Use setTimeout to ensure state is cleared before opening
      setTimeout(() => {
        setSelectedAppointmentForNote(appointment)
        setIsSpecialNoteModalOpen(true)
      }, 10)
    }
  }

  const handleSaveSpecialNote = (appointmentId, updatedNote) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, specialNote: updatedNote } : app)),
    )
    toast.success("Special note updated successfully")
  }

  const isBirthdayToday = (date) => {
    return date === today
  }

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing")
      case "canceled":
        return todos.filter((todo) => todo.status === "canceled")
      case "completed":
        return todos.filter((todo) => todo.status === "completed")
      default:
        return todos
    }
  }

  const handleTaskComplete = (taskId) => {
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

  const handleUpdateTask = (updatedTask) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)))
  }

  const handleDeleteTask = (taskId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId))
    setTaskToDelete(null)
  }

  const handleCancelTask = (taskId) => {
    setTodos((prev) => prev.map((todo) => (todo.id === taskId ? { ...todo, status: "cancelled" } : todo)))
    setTaskToCancel(null)
  }

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

  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]

  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ]

  const WebsiteLinkModal = ({ link, onClose }) => {
    const [title, setTitle] = useState(link?.title?.trim() || "")
    const [url, setUrl] = useState(link?.url?.trim() || "")

    const handleSave = () => {
      if (!title.trim() || !url.trim()) return
      if (link?.id) {
        updateCustomLink(link.id, "title", title)
        updateCustomLink(link.id, "url", url)
      } else {
        const newLink = {
          id: `link${Date.now()}`,
          url: url.trim(),
          title: title.trim(),
        }
        setCustomLinks((prev) => [...prev, newLink])
      }
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Website link</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !url.trim()}
                className={`px-4 py-2 text-sm rounded-xl ${!title.trim() || !url.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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

  const handleHistoryFromOverview = () => {
    setisMemberOverviewModalOpen(false)
    setShowHistoryModal(true)
  }

  const handleCommunicationFromOverview = () => {
    setisMemberOverviewModalOpen(false)
    navigate("/dashboard/communication")
  }

  const handleTrainingPlansFromOverview = () =>{
    setisMemberOverviewModalOpen(false)
    setIsTrainingPlanModalOpen(true)
  }

  const handleDocumentClick = (member) => {
    setSelectedMemberForDocuments(member)
    setShowDocumentModal(true)
  }

  const handleViewDetailedInfo = () => {
    setisMemberOverviewModalOpen(false)
    setActiveMemberDetailsTab("details")
    setIsMemberDetailsModalOpen(true)
  }




  const handleEditFromOverview = () => {
    setisMemberOverviewModalOpen(false)

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

  const handleCalendarFromOverview = () => {
    setisMemberOverviewModalOpen(false)
    if (selectedMember) {
      setShowAppointmentModal(true)
    }
  }


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


  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId, event) => {
      if (!specialNote?.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null


      const handleNoteClick = (e) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setNotePosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        })
        setActiveNoteId(activeNoteId === memberId ? null : memberId)
      }

      const handleMouseEnter = (e) => {
        e.stopPropagation()
        // Clear any existing timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }

        const rect = e.currentTarget.getBoundingClientRect()
        setNotePosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        })

        // Set a small delay before showing to prevent flickering
        const timeout = setTimeout(() => {
          setActiveNoteId(memberId)
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
        // Only hide if it's not actively clicked/open
        if (activeNoteId !== memberId) {
          setActiveNoteId(null)
        }
      }

      const handleEditClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(null) // Close the note popover
        handleEditNote(memberId, specialNote) // Open the edit modal
      }

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

          {activeNoteId === memberId && (
            createPortal(
              <div
                ref={notePopoverRef}
                className="fixed w-64 sm:w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999]"
                style={{
                  top: notePosition.top,
                  left: notePosition.left,
                }}
                onMouseEnter={() => setActiveNoteId(memberId)} // Keep open when hovering over popover
                onMouseLeave={() => setActiveNoteId(null)} // Close when leaving popover
              >
                <div className="bg-gray-800 p-2 sm:p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                  {specialNote.isImportant ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  ) : (
                    <Info className="text-blue-500 shrink-0" size={18} />
                  )}
                  <h4 className="text-white flex gap-1 items-center font-medium">
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
        </div>
      )
    },
    [activeNoteId, notePosition, hoverTimeout],
  )

  const handleViewMemberDetails = () => {
    if (selectedAppointment) {
      // Create a more complete mock member object from appointment data
      const mockMember = {
        id: selectedAppointment.id,
        title: selectedAppointment.name,
        firstName: selectedAppointment.name.split(' ')[0] || selectedAppointment.name,
        lastName: selectedAppointment.name.split(' ').slice(1).join(' ') || '',
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
        noteImportance: selectedAppointment.specialNote?.isImportant ? "important" : "unimportant"
      }

      setSelectedMember(mockMember)
      setisMemberOverviewModalOpen(true)
      setshowAppointmentOptionsModal(false)
    }
  }

  const redirectToContract = () => {
    navigate("/dashboard/contract")
    setIsMemberDetailsModalOpen(false)
    setSelectedMember(null)
  }

  const handleManageContingent = () => {
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

  const handleCreateNewAppointment = () => {
    setShowAppointmentModal(false)
    navigate("/dashboard/appointments?action=create")
  }

  const getMemberAppointments = (memberId) => {
    // Return appointments for the specific member
    return appointments.filter(app => app.id === memberId)
  }

  const handleEditAppointment = (appointment) => {
    setselectedAppointment(appointment)
    setisEditAppointmentModalOpen(true)
    setShowAppointmentModal(false)
  }

  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

  const handleAppointmentOptionsModal = (appointment) => {
    setselectedAppointment(appointment)
    setshowAppointmentOptionsModal(true)
    setisEditAppointmentModalOpen(false) // Ensure edit modal is closed
  }

  const handleCancelAppointment = () => {
    setshowAppointmentOptionsModal(false)
    setNotifyAction("cancel")
    if (selectedAppointment) {
      // Update the selected appointment's status locally for the modal
      const updatedApp = { ...selectedAppointment, status: "cancelled", isCancelled: true }
      setselectedAppointment(updatedApp)
      setIsNotifyMemberOpen(true) // Show notification modal
    }
  }

  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointments || !setAppointments || !selectedAppointment) return
    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointments(updatedAppointments)
    toast.success("Appointment cancelled successfully")
    if (shouldNotify) {
      console.log("Notifying member about cancellation")
    }
    setselectedAppointment(null) // Clear selected appointment after action
  }

  const handleDeleteAppointment = (id) => {
    // setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setselectedAppointment(null)
    setisEditAppointmentModalOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    toast.success("Member notified successfully!")
  }

  const handleSendBirthdayMessage = (person) => {
    setSelectedBirthdayPerson(person)
    setBirthdayMessage(`Happy Birthday ${person.name}! 🎉 Wishing you a wonderful day filled with joy and celebration!`)
    setIsBirthdayMessageModalOpen(true)
  }

  const handleSendCustomBirthdayMessage = () => {
    if (birthdayMessage.trim()) {
      toast.success(`Birthday message sent to ${selectedBirthdayPerson.name}!`)
      setIsBirthdayMessageModalOpen(false)
      setBirthdayMessage("")
      setSelectedBirthdayPerson(null)
    }

    setBirthdayMessage("")
    setSelectedBirthdayPerson(null)
  }

  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "canceled", label: "Canceled", color: "#ef4444" },
  ]

  const handleDumbbellClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedUserForTrainingPlan(appointment)
    setIsTrainingPlanModalOpen(true)
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
      <div className="flex flex-col md:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        {isRightSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden block" onClick={toggleRightSidebar} />
        )}
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-1 md:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Top Row (Title + Menu on mobile, Title only on desktop) */}
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">My Area</h1>

                </div>

                {/* Menu Icon → visible on mobile and medium screens */}
                <div onClick={toggleRightSidebar} className="lg:hidden block">
                  <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex   justify-center md:justify-end gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2  flex justify-center items-center md:w-auto w-full text-sm gap-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <Eye size={16} />
                    <span className="md:inline hidden">{currentView ? currentView.name : "Standard View"}</span>
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
                  className={`px-6 py-2 text-sm flex md:w-auto w-full justify-center items-center gap-2 rounded-xl transition-colors ${isEditing ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-200"
                    }`}
                >
                  {isEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">{isEditing ? "Done" : "Edit Dashboard"}</span>
                </button>
              </div>
            </div>

            {/* Widgets */}
            <div className="space-y-4">
              {/* Chart Widget - Full Width (rendered separately if it's always full width) */}
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
                    {/* <div className="p-4 bg-[#2F2F2F] rounded-xl">
                      <div className="relative mb-3" ref={chartDropdownRef}>
                        <button
                          onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                        >
                          {selectedMemberType}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {isChartDropdownOpen && (
                          <div className="absolute z-10 mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg">
                            {Object.keys(memberTypes).map((type) => (
                              <button
                                key={type}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                onClick={() => {
                                  setSelectedMemberType(type)
                                  setIsChartDropdownOpen(false)
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
                      </div>
                    </div> */}
                    <AnalyticsChartWidget
                      isEditing={isEditing}
                      onRemove={() => removeWidget(widget.id)}
                    />
                  </DraggableWidget>
                ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets
                  .filter((widget) => widget.type !== "chart") // Filter out chart, as it's handled separately
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
                        <div className="space-y-3 p-4 rounded-xl max-h-[340px] overflow-y-auto custom-scrollbar bg-[#2F2F2F] h-full flex flex-col">
                          <div className="flex justify-between items-center flex-shrink-0">
                            <h2 className="text-lg font-semibold">Expiring Contracts</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {expiringContracts.map((contract) => (
                                <Link to={"/dashboard/contract"} key={contract.id}>
                                  <div className="p-4 bg-black rounded-xl hover:bg-zinc-900 transition-colors">
                                    <div className="flex justify-between items-start gap-3">
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium break-words line-clamp-2">
                                          {contract.title}
                                        </h3>
                                        <p className="text-xs mt-1 text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis">
                                          Expires: {contract.expiryDate}
                                        </p>
                                      </div>
                                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap flex-shrink-0">
                                        {contract.status}
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {widget.type === "appointments" && (
                        <div className="space-y-3 p-4 rounded-xl md:h-[340px] h-auto bg-[#2F2F2F]">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                          </div>
                          <div className="space-y-2 max-h-[25vh] overflow-y-auto custom-scrollbar pr-1">
                            {appointments.length > 0 ? (
                              appointments.map((appointment, index) => (
                                <div
                                  key={appointment.id}
                                  className={`${appointment.color} rounded-xl cursor-pointer p-3 relative`}
                                >
                                  {/* Icons container with fixed positioning and proper spacing */}
                                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                    {renderSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                    <div
                                      className="cursor-pointer mt-2 ml-1 rounded transition-colors"
                                      onClick={(e) => handleDumbbellClick(appointment, e)}
                                    >
                                      <Dumbbell size={16} />
                                    </div>
                                  </div>

                                  <div
                                    className="flex flex-col items-center justify-between gap-2 cursor-pointer pl-8"
                                    onClick={() => {
                                      handleAppointmentOptionsModal(appointment)
                                    }}
                                  >
                                    <div className="flex items-center gap-2 relative w-full justify-center">
                                      <div className="w-12 h-12 rounded-xl  bg-white/20 flex items-center justify-center relative">
                                        <img
                                          src={Avatar || "/placeholder.svg"}
                                          alt=""
                                          className="w-full h-full rounded-xl "
                                        />
                                      </div>
                                      <div className="text-white text-left flex-1">
                                        <p className="font-semibold text-sm">{appointment.name} {appointment.lastName || ""}</p>
                                        <p className="text-xs flex gap-1 items-center opacity-80">
                                          <Clock size={14} />
                                          {appointment.time} | {appointment.date.split("|")[0]}
                                        </p>
                                        <p className="text-xs opacity-80 mt-1">
                                          {appointment.isTrial ? "Trial Session" : appointment.type}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full justify-center">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCheckIn(appointment.id)
                                        }}
                                        className={`px-3 py-1 text-xs font-medium rounded-lg ${appointment.isCheckedIn
                                          ? "border border-white/50 text-white bg-transparent"
                                          : "bg-black text-white"
                                          }`}
                                      >
                                        {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-white text-center">No appointments scheduled for this date.</p>
                            )}
                          </div>
                          <div className="flex justify-center">
                            <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "staffCheckIn" && <StaffCheckInWidget />}
                      {widget.type === "websiteLink" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Website Links</h2>
                          {!isEditing &&  <button
                              onClick={addCustomLink}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                            >
                              <Plus size={18} />
                            </button>}
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {customLinks.map((link) => (
                                <div
                                  key={link.id}
                                  className="p-5 bg-black rounded-xl flex items-center justify-between"
                                >
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate">{link.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400 truncate max-w-[200px]">
                                      {truncateUrl(link.url)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => window.open(link.url, "_blank")}
                                      className="p-2 hover:bg-zinc-700 rounded-lg"
                                    >
                                      <ExternalLink size={16} />
                                    </button>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDropdown(`link-${link.id}`)
                                        }}
                                        className="p-2 hover:bg-zinc-700 rounded-lg"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      {openDropdownIndex === `link-${link.id}` && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setEditingLink(link)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              removeCustomLink(link.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                      {widget.type === "todo" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">To-Do</h2>
                          {!isEditing &&  <button
                              onClick={() => setIsAddTaskModalOpen(true)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              <Plus size={18} />
                            </button>}
                          </div>
                          <div className="relative mb-3 w-full" ref={todoFilterDropdownRef}>
                            <button
                              onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                              className="flex  justify-between items-center w-full gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                            >
                              {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {isTodoFilterDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
                                {todoFilterOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                    onClick={() => {
                                      setTodoFilter(option.value)
                                      setIsTodoFilterDropdownOpen(false)
                                    }}
                                  >
                                    {option.color && (
                                      <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: option.color }}
                                      />
                                    )}
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {getFilteredTodos()
                                .slice(0, 3)
                                .map((todo) => (
                                  <div
                                    key={todo.id}
                                    className="p-3 bg-black rounded-xl flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleTaskComplete(todo.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <div className="flex-1">
                                        <h3
                                          className={`font-semibold text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}
                                        >
                                          {todo.title}
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                          Due: {todo.dueDate} {todo.dueTime && `at ${todo.dueTime}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDropdown(`main-todo-${todo.id}`)
                                        }}
                                        className="p-1 hover:bg-zinc-700 rounded"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      {openDropdownIndex === `main-todo-${todo.id}` && (
                                        <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                          <button
                                            onClick={() => {
                                              handleEditTask(todo)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                          >
                                            Edit Task
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTaskToCancel(todo.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                          >
                                            Cancel Task
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTaskToDelete(todo.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                          >
                                            Delete Task
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link to={"/dashboard/to-do"} className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "birthday" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upcoming Birthday</h2>
                          </div>

                          {/* Scrollable area */}
                          <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {birthdays.map((birthday) => (
                                <div
                                  key={birthday.id}
                                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 justify-between ${isBirthdayToday(birthday.date)
                                      ? "bg-yellow-900/30 border border-yellow-600"
                                      : "bg-black"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl overflow-hidden">
                                      <img
                                        src={birthday.avatar || "/placeholder.svg"}
                                        className="h-full w-full object-cover"
                                        alt=""
                                      />
                                    </div>

                                    <div>
                                      <h3 className="font-semibold text-sm flex items-center gap-1">
                                        {birthday.name}
                                        {isBirthdayToday(birthday.date) && (
                                          <span className="text-yellow-500">🎂</span>
                                        )}
                                      </h3>
                                      <p className="text-xs text-zinc-400">{birthday.date}</p>
                                    </div>
                                  </div>

                                  {isBirthdayToday(birthday.date) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendBirthdayMessage(birthday);
                                      }}
                                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                      title="Send Birthday Message"
                                    >
                                      <MessageCircle size={16} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {widget.type === "bulletinBoard" && <BulletinBoardWidget isSidebarEditing={isEditing} />}

                      {widget.type === "notes" && <NotesWidget isSidebarEditing={isEditing} />}

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
        {taskToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  onClick={() => handleDeleteTask(taskToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {taskToCancel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  onClick={() => handleCancelTask(taskToCancel)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Cancel Task
                </button>
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
          todos={todos}
          setTodos={setTodos}
          handleTaskComplete={handleTaskComplete}
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
          handleCheckIn={handleCheckIn}
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
          hasUnreadNotifications={2} // Add appropriate value
          setIsWidgetModalOpen={setIsWidgetModalOpen}
          handleEditNote={handleEditNote}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          isSpecialNoteModalOpen={isSpecialNoteModalOpen}
          setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
          selectedAppointmentForNote={selectedAppointmentForNote}
          setSelectedAppointmentForNote={setSelectedAppointmentForNote}
          handleSaveSpecialNote={handleSaveSpecialNote}
          onSaveSpecialNote={handleSaveSpecialNote}
          notifications={notifications}

        />
        {isAddTaskModalOpen && <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
          configuredTags={configuredTags}
        />}

        {isEditTaskModalOpen && editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => {
              setIsEditTaskModalOpen(false)
              setEditingTask(null)
            }}
            onUpdateTask={handleUpdateTask}
          />
        )}



        <AppointmentActionModalV2
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setshowAppointmentOptionsModal(false)
            setselectedAppointment(null) // Reset the selected appointment when closing
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setshowAppointmentOptionsModal(false) // Close the options modal
            setisEditAppointmentModalOpen(true) // Open the edit modal
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
        />

        <NotifyMemberModal
          isOpen={isNotifyMemberOpen}
          onClose={() => setIsNotifyMemberOpen(false)}
          notifyAction={notifyAction}
          actuallyHandleCancelAppointment={actuallyHandleCancelAppointment}
          handleNotifyMember={handleNotifyMember}
        />

        <BirthdayMessageModal
          isOpen={isBirthdayMessageModalOpen}
          onClose={() => {
            setIsBirthdayMessageModalOpen(false)
            setBirthdayMessage("")
            setSelectedBirthdayPerson(null)
          }}
          selectedBirthdayPerson={selectedBirthdayPerson}
          birthdayMessage={birthdayMessage}
          setBirthdayMessage={setBirthdayMessage}
          handleSendCustomBirthdayMessage={handleSendCustomBirthdayMessage}
        />

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

        {editingLink && <WebsiteLinkModal link={editingLink} onClose={() => setEditingLink(null)} />}
        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "dashboard")}
          widgetArea="dashboard"
        />
        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
          widgetArea="sidebar"
        />

        {isEditAppointmentModalOpen && selectedAppointment && (
          <EditAppointmentModalV2
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setselectedAppointment}
            appointmentTypes={appointmentTypes}
            freeAppointments={freeAppointments}
            handleAppointmentChange={(changes) => {
              setselectedAppointment({ ...selectedAppointment, ...changes })
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointment}
            onClose={() => {
              setisEditAppointmentModalOpen(false)
              setselectedAppointment(null) // Reset the selected appointment
            }}
          />
        )}

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

        <SpecialNoteEditModal
          isOpen={isSpecialNoteModalOpen}
          onClose={() => {
            setIsSpecialNoteModalOpen(false)
            setSelectedAppointmentForNote(null)
          }}
          appointment={selectedAppointmentForNote}
          onSave={handleSaveSpecialNote}
        />

        <MemberOverviewModal
          isOpen={isMemberOverviewModalOpen}
          onClose={() => {
            setisMemberOverviewModalOpen(false)
            setSelectedMember(null) // Clear selectedMember instead of selectedAppointment
          }}
          selectedMember={selectedMember} // Pass selectedMember instead of selectedAppointment
          calculateAge={calculateAge}
          isContractExpiringSoon={isContractExpiringSoon}
          handleCalendarFromOverview={handleCalendarFromOverview}
          handleHistoryFromOverview={handleHistoryFromOverview}
          handleCommunicationFromOverview={handleCommunicationFromOverview}
          handleViewDetailedInfo={handleViewDetailedInfo}
          handleEditFromOverview={handleEditFromOverview}
          handleTrainingPlansFromOverview={handleTrainingPlansFromOverview}
          handleDocumentFromOverview={handleDocumentClick}
        />

        <MemberDocumentModal
                member={selectedMemberForDocuments}
                isOpen={showDocumentModal}
                onClose={() => {
                  setShowDocumentModal(false)
                  setSelectedMemberForDocuments(null)
                }}
              />

        <AppointmentModal
          show={showAppointmentModal}
          member={selectedMember}
          onClose={() => {
            setShowAppointmentModal(false)
            setSelectedMember(null)
          }}
          getMemberAppointments={getMemberAppointments}
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
          getBillingPeriods={getBillingPeriods}
          selectedBillingPeriod={selectedBillingPeriod}
          handleBillingPeriodChange={setSelectedBillingPeriod}
          setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
          tempContingent={tempContingent}
          setTempContingent={setTempContingent}
          currentBillingPeriod={currentBillingPeriod}
          handleSaveContingent={handleSaveContingent}
        />

        <AddBillingPeriodModal
          show={showAddBillingPeriodModal}
          setShow={setShowAddBillingPeriodModal}
          newBillingPeriod={newBillingPeriod}
          setNewBillingPeriod={setNewBillingPeriod}
          handleAddBillingPeriod={handleAddBillingPeriod}
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
          handleEditSubmit={handleEditSubmit}
          editingRelations={editingRelations}
          setEditingRelations={setEditingRelations}
          newRelation={newRelation}
          setNewRelation={setNewRelation}
          availableMembersLeads={availableMembersLeads}
          relationOptions={relationOptions}
          handleAddRelation={handleAddRelation}
          memberRelations={memberRelations}
          handleDeleteRelation={handleDeleteRelation}
          handleArchiveMember={handleArchiveMember}
          handleUnarchiveMember={handleUnarchiveMember}
        />


        
      </div>
    </>
  )
}
