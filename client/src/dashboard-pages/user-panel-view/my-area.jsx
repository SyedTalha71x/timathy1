
/* eslint-disable react/no-unescaped-entities */
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
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Avatar from "../../../public/avatar.png"

import AppointmentActionModal from "../../components/appointments-components/appointment-action-modal"
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal"
import EditTaskModal from "../../components/task-components/edit-task-modal"
import ViewManagementModal from "../../components/myarea-components/view-management-modal"
import StaffCheckInWidget from "../../components/myarea-components/staff-widget-checkin"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import DraggableWidget from "../../components/myarea-components/DraggableWidget"
import MemberOverviewModal from "../../components/communication-components/MemberOverviewModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"

import Sidebar from "../../components/myarea-components/MyAreaSidebar"
import { SpecialNoteEditModal } from "../../components/myarea-components/SpecialNoteEditModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"

import { notificationData, memberContingentDataNew, mockTrainingPlansNew, mockVideosNew, memberRelationsData, mockMemberHistoryNew, mockMemberRelationsNew, availableMembersLeadsNew, customLinksData, communicationsData, todosData, appointmentsData, birthdaysData, memberTypesData, expiringContractsData } from "../../utils/user-panel-states/myarea-states"


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

  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)

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
    { id: "communications", type: "communications", position: 5 },
    { id: "todo", type: "todo", position: 6 },
    { id: "birthday", type: "birthday", position: 7 },
    // Removed topSelling and mostFrequent
  ])

  // Add right sidebar widgets state
  const [rightSidebarWidgets, setRightSidebarWidgets] = useState([
    { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
    { id: "sidebarAppointments", type: "appointments", position: 4 },
    { id: "sidebarChart", type: "chart", position: 5 },
    { id: "sidebarExpiringContracts", type: "expiringContracts", position: 6 },
    { id: "sidebarStaffCheckIn", type: "staffCheckIn", position: 7 },
  ])

  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen)
  const redirectToTodos = () => navigate("/dashboard/to-do")
  const redirectToCommunication = () => navigate("/dashboard/communication")
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


  const notePopoverRef = useRef(null)

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




  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      case "pending":
        return todos.filter((todo) => todo.status === "pending")
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

      return (
        <div className="relative">
          <div
            className={`${specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
              } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {activeNoteId === memberId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
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
                    {specialNote.isImportant ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={() => handleEditNote(memberId, specialNote)}
                  className="ml-auto text-gray-400 hover:text-white mr-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveNoteId(null)
                  }}
                  className="text-gray-400 hover:text-white"
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
            </div>
          )}
        </div>
      )
    },
    [activeNoteId, setActiveNoteId],
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
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]

  const handleDumbbellClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedUserForTrainingPlan(appointment)
    setIsTrainingPlanModalOpen(true)
  }

  const getVideoById = (videoId) => {
    return mockVideos.find((video) => video.id === videoId)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-600"
      case "intermediate":
        return "bg-yellow-600"
      case "advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
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
      <div className="flex flex-col md:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        {isRightSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden block" onClick={toggleRightSidebar} />
        )}
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-1 md:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Top Row (Title + Menu on mobile, Title only on desktop) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">My Area</h1>
                  {currentView && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                      {currentView.name}
                    </span>
                  )}
                </div>

                {/* Menu Icon → visible on mobile and medium screens */}
                <button
                  onClick={toggleRightSidebar}
                  className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-xl lg:hidden"
                >
                  <Menu size={20} />
                </button>
              </div>

              {/* Buttons Section */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2 bg-zinc-700 md:w-auto w-full text-zinc-200 rounded-xl text-sm flex justify-center items-center gap-2"
                  >
                    <Settings size={16} />
                    {currentView ? currentView.name : "Standard View"}
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
                    <div className="p-4 bg-[#2F2F2F] rounded-xl">
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
                    </div>
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
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Expiring Contracts</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {expiringContracts.map((contract) => (
                                <Link to={"/dashboard/contract"} key={contract.id}>
                                  <div className="p-4 bg-black rounded-xl hover:bg-zinc-900 transition-colors">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="text-sm font-medium">{contract.title}</h3>
                                        <p className="text-xs mt-1 text-zinc-400">Expires: {contract.expiryDate}</p>
                                      </div>
                                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
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
                                  <div></div>
                                  <div className="absolute p-2 top-0 left-0 z-10 flex flex-col gap-1">
                                    {renderSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                  </div>

                                  <div
                                    className="flex flex-col items-center justify-between gap-2 cursor-pointer"
                                    onClick={() => {
                                      handleAppointmentOptionsModal(appointment)
                                    }}
                                  >
                                    <div className="flex items-center gap-2 ml-5 relative w-full justify-center">
                                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                                        <img
                                          src={Avatar || "/placeholder.svg"}
                                          alt=""
                                          className="w-full h-full rounded-full"
                                        />
                                      </div>
                                      <div className="text-white text-left">
                                        <p className="font-semibold">{appointment.name}</p>
                                        <p className="text-xs flex gap-1 items-center opacity-80">
                                          <Clock size={14} />
                                          {appointment.time} | {appointment.date.split("|")[0]}
                                        </p>
                                        <p className="text-xs opacity-80 mt-1">
                                          {appointment.isTrial ? "Trial Session" : appointment.type}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCheckIn(appointment.id)
                                        }}
                                        className={`px-3 py-1 text-xs font-medium rounded-lg ${appointment.isCheckedIn
                                          ? " border border-white/50 text-white bg-transparent"
                                          : "bg-black text-white"
                                          }`}
                                      >
                                        {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                      </button>
                                      <div
                                        className="cursor-pointer rounded  transition-colors"
                                        onClick={(e) => handleDumbbellClick(appointment, e)}
                                      >
                                        <Dumbbell size={16} />
                                      </div>
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
                          <button
                            onClick={addCustomLink}
                            className="w-full p-3 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900 mt-auto"
                          >
                            Add website link...
                          </button>
                        </div>
                      )}
                      {widget.type === "communications" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Communications</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {communications.slice(0, 3).map((comm) => (
                                <div
                                  onClick={redirectToCommunication}
                                  key={comm.id}
                                  className="p-3 cursor-pointer bg-black rounded-xl"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <img
                                      src={comm.avatar || "/placeholder.svg"}
                                      alt="User"
                                      className="rounded-full h-10 w-10"
                                    />
                                    <div>
                                      <h3 className="text-sm font-medium">{comm.name}</h3>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-400 mb-1">{comm.message}</p>
                                    <p className="text-xs flex gap-1 items-center text-zinc-400">
                                      <Clock size={12} />
                                      {comm.time}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link to={"/dashboard/communication"} className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "todo" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">TO-DO</h2>
                          </div>
                          <div className="relative mb-3" ref={todoFilterDropdownRef}>
                            <button
                              onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                            >
                              {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {isTodoFilterDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-32 bg-[#2F2F2F] rounded-xl shadow-lg">
                                {todoFilterOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                    onClick={() => {
                                      setTodoFilter(option.value)
                                      setIsTodoFilterDropdownOpen(false)
                                    }}
                                  >
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
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {birthdays.slice(0, 3).map((birthday) => (
                                <div
                                  key={birthday.id}
                                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 justify-between ${isBirthdayToday(birthday.date)
                                    ? "bg-yellow-900/30 border border-yellow-600"
                                    : "bg-black"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <img
                                        src={birthday.avatar || "/placeholder.svg"}
                                        className="h-10 w-10 rounded-full"
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-sm flex items-center gap-1">
                                        {birthday.name}
                                        {isBirthdayToday(birthday.date) && <span className="text-yellow-500">🎂</span>}
                                      </h3>
                                      <p className="text-xs text-zinc-400">{birthday.date}</p>
                                    </div>
                                  </div>
                                  {isBirthdayToday(birthday.date) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSendBirthdayMessage(birthday)
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
                    </DraggableWidget>
                  ))}
              </div>
            </div>
          </div>
        </main>
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

        <AppointmentActionModal
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

        {isNotifyMemberOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
            onClick={() => setIsNotifyMemberOpen(false)}
          >
            <div
              className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify Member</h2>
                <button
                  onClick={() => {
                    setIsNotifyMemberOpen(false)
                  }}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
                >
                  {" "}
                  <X size={20} />{" "}
                </button>
              </div>
              <div className="p-6">
                <p className="text-white text-sm">
                  {" "}
                  Do you want to notify the member about this{" "}
                  {notifyAction === "change"
                    ? "change"
                    : notifyAction === "cancel"
                      ? "cancellation"
                      : notifyAction === "delete"
                        ? "deletion"
                        : "booking"}{" "}
                  ?{" "}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => {
                    if (notifyAction === "cancel") {
                      actuallyHandleCancelAppointment(true) // Confirm cancellation and notify
                    } else {
                      handleNotifyMember(true) // Confirm other changes and notify
                    }
                    setIsNotifyMemberOpen(false)
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                >
                  {" "}
                  Yes, Notify Member{" "}
                </button>
                <button
                  onClick={() => {
                    if (notifyAction === "cancel") {
                      actuallyHandleCancelAppointment(false) // Confirm cancellation without notifying
                    } else {
                      handleNotifyMember(false) // Cancel other changes and don't notify (triggers revert)
                    }
                    setIsNotifyMemberOpen(false)
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  {" "}
                  No, Don't Notify{" "}
                </button>
              </div>
            </div>
          </div>
        )}

        {isBirthdayMessageModalOpen && selectedBirthdayPerson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Send Birthday Message</h2>
                  <button
                    onClick={() => {
                      setIsBirthdayMessageModalOpen(false)
                      setBirthdayMessage("")
                      setSelectedBirthdayPerson(null)
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
                  <img
                    src={selectedBirthdayPerson.avatar || "/placeholder.svg"}
                    className="h-10 w-10 rounded-full"
                    alt=""
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{selectedBirthdayPerson.name}</h3>
                    <p className="text-xs text-zinc-400">Birthday: {selectedBirthdayPerson.date}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-400">Your Message</label>
                  <textarea
                    value={birthdayMessage}
                    onChange={(e) => setBirthdayMessage(e.target.value)}
                    className="w-full p-3 bg-black rounded-xl text-sm outline-none resize-none"
                    rows={4}
                    placeholder="Write your birthday message..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsBirthdayMessageModalOpen(false)
                      setBirthdayMessage("")
                      setSelectedBirthdayPerson(null)
                    }}
                    className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendCustomBirthdayMessage}
                    disabled={!birthdayMessage.trim()}
                    className={`px-4 py-2 text-sm rounded-xl ${!birthdayMessage.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
          <EditAppointmentModal
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

        <TrainingPlanModal
          isOpen={isTrainingPlanModalOpen}
          onClose={() => setIsTrainingPlanModalOpen(false)}
          user={selectedUserForTrainingPlan}
          trainingPlans={mockTrainingPlans}
          getDifficultyColor={getDifficultyColor}
          getVideoById={getVideoById}
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
        />

        {showAppointmentModal && selectedMember && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">{selectedMember.firstName}'s Appointments</h2>
                  <button
                    onClick={() => {
                      setShowAppointmentModal(false)
                      setSelectedMember(null)
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3 mb-4">
                  <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                  {getMemberAppointments(selectedMember.id).length > 0 ? (
                    getMemberAppointments(selectedMember.id).map((appointment) => {
                      const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                      const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"
                      return (
                        <div
                          key={appointment.id}
                          className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm text-white">{appointment.title}</p>
                              <div>
                                <p className="text-sm text-white/70">
                                  {new Date(appointment.date).toLocaleString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-xs text-white/70">
                                  {new Date(appointment.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditAppointment(appointment)
                                }}
                                className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-pencil"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelAppointment(appointment.id)
                                }}
                                className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                      No appointments scheduled
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
                  <div className="text-sm text-gray-300">
                    Contingent ({currentBillingPeriod}): {memberContingentData[selectedMember.id]?.current?.used || 0} /{" "}
                    {memberContingentData[selectedMember.id]?.current?.total || 0}
                  </div>
                  <button
                    onClick={handleManageContingent}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Manage
                  </button>
                </div>
                <button
                  onClick={handleCreateNewAppointment}
                  className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
                >
                  Create New Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistoryModal && selectedMember && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  History - {selectedMember.firstName} {selectedMember.lastName}
                </h2>
                <button
                  onClick={() => {
                    setShowHistoryModal(false)
                    setSelectedMember(null)
                  }}
                  className="text-gray-300 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
                {[
                  { id: "general", label: "General Changes" },
                  { id: "checkins", label: "Check-ins & Check-outs" },
                  { id: "appointments", label: "Past Appointments" },
                  { id: "finance", label: "Finance Transactions" },
                  { id: "contracts", label: "Contract Changes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${historyTab === tab.id ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="bg-[#141414] rounded-xl p-4">
                {historyTab === "general" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General Changes</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.general?.map((change) => (
                        <div key={change.id} className="bg-[#1C1C1C] rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-white">{change.action}</p>
                              <p className="text-sm text-gray-400">
                                {change.date} by {change.user}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-300">{change.details}</p>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No general changes recorded</p>}
                    </div>
                  </div>
                )}
                {historyTab === "checkins" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Check-ins & Check-outs</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.checkins?.map((activity) => (
                        <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${activity.type === "Check-in" ? "bg-green-500" : "bg-red-500"
                                    }`}
                                ></span>
                                {activity.type}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(activity.date).toLocaleDateString()} at{" "}
                                {new Date(activity.date).toLocaleTimeString()}
                              </p>
                              <p className="text-sm text-gray-300">Location: {activity.location}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No check-in/check-out history</p>}
                    </div>
                  </div>
                )}
                {historyTab === "appointments" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.appointments?.map((appointment) => (
                        <div key={appointment.id} className="bg-[#1C1C1C] rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-white">{appointment.title}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(appointment.date).toLocaleDateString()} at{" "}
                                {new Date(appointment.date).toLocaleTimeString()} with {appointment.trainer}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs ${appointment.status === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-orange-600 text-white"
                                }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No past appointments</p>}
                    </div>
                  </div>
                )}
                {historyTab === "finance" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Finance Transactions</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.finance?.map((transaction) => (
                        <div key={transaction.id} className="bg-[#1C1C1C] rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-white">
                                {transaction.type} - {transaction.amount}
                              </p>
                              <p className="text-sm text-gray-400">{transaction.date}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs ${transaction.status === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-orange-600 text-white"
                                }`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{transaction.description}</p>
                        </div>
                      )) || <p className="text-gray-400">No financial transactions</p>}
                    </div>
                  </div>
                )}
                {historyTab === "contracts" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contract Changes</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.contracts?.map((contract) => (
                        <div key={contract.id} className="bg-[#1C1C1C] rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-white">{contract.action}</p>
                              <p className="text-sm text-gray-400">
                                {contract.date} by {contract.user}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{contract.details}</p>
                        </div>
                      )) || <p className="text-gray-400">No contract changes</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isMemberDetailsModalOpen && selectedMember && (
          <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
                  <button
                    onClick={() => {
                      setIsMemberDetailsModalOpen(false)
                      setSelectedMember(null)
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} className="cursor-pointer" />
                  </button>
                </div>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-700 mb-6">
                  <button
                    onClick={() => setActiveMemberDetailsTab("details")}
                    className={`px-4 py-2 text-sm font-medium ${activeMemberDetailsTab === "details"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveMemberDetailsTab("relations")}
                    className={`px-4 py-2 text-sm font-medium ${activeMemberDetailsTab === "relations"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Relations
                  </button>
                </div>
                {/* Tab Content */}
                {activeMemberDetailsTab === "details" && (
                  <div className="space-y-4 text-white">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedMember.image || DefaultAvatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${selectedMember.memberType === "full"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-purple-900 text-purple-300"
                              }`}
                          >
                            {selectedMember.memberType === "full"
                              ? "Full Member (with contract)"
                              : "Temporary Member (without contract)"}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">
                          {selectedMember.memberType === "full" ? (
                            <>
                              Contract: {selectedMember.contractStart} -
                              <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                                {selectedMember.contractEnd}
                              </span>
                            </>
                          ) : (
                            <>Auto-archive date: {selectedMember.autoArchiveDate}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p>{selectedMember.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p>{selectedMember.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      <p>{`${selectedMember.street}, ${selectedMember.zipCode} ${selectedMember.city}`}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Date of Birth</p>
                        <p>
                          {selectedMember.dateOfBirth} (Age: {calculateAge(selectedMember.dateOfBirth)})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Join Date</p>
                        <p>{selectedMember.joinDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">About</p>
                      <p>{selectedMember.about}</p>
                    </div>
                    {selectedMember.note && (
                      <div>
                        <p className="text-sm text-gray-400">Special Note</p>
                        <p>{selectedMember.note}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Note Period: {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                        </p>
                        <p className="text-sm text-gray-400">Importance: {selectedMember.noteImportance}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                      {selectedMember.memberType === "full" && (
                        <button
                          onClick={redirectToContract}
                          className="flex items-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                        >
                          <FileText size={16} />
                          View Contract
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {activeMemberDetailsTab === "relations" && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Relations Tree Visualization */}
                    <div className="bg-[#161616] rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                      <div className="flex flex-col items-center space-y-8">
                        {/* Central Member */}
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                          {selectedMember.title}
                        </div>
                        {/* Connection Lines and Categories */}
                        <div className="relative w-full">
                          {/* Horizontal line */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                          {/* Category sections */}
                          <div className="grid grid-cols-5 gap-4 pt-8">
                            {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                              <div key={category} className="flex flex-col items-center space-y-4">
                                {/* Vertical line */}
                                <div className="w-0.5 h-8 bg-gray-600"></div>
                                {/* Category header */}
                                <div
                                  className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${category === "family"
                                    ? "bg-yellow-600 text-yellow-100"
                                    : category === "friendship"
                                      ? "bg-green-600 text-green-100"
                                      : category === "relationship"
                                        ? "bg-red-600 text-red-100"
                                        : category === "work"
                                          ? "bg-blue-600 text-blue-100"
                                          : "bg-gray-600 text-gray-100"
                                    }`}
                                >
                                  {category}
                                </div>
                                {/* Relations in this category */}
                                <div className="space-y-2">
                                  {relations.map((relation) => (
                                    <div
                                      key={relation.id}
                                      className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${relation.type === "member" || relation.type === "lead"
                                        ? "border border-blue-500/30"
                                        : ""
                                        }`}
                                      onClick={() => {
                                        if (relation.type === "member" || relation.type === "lead") {
                                          alert(`Clicked on ${relation.name} (${relation.type})`)
                                        }
                                      }}
                                    >
                                      <div className="text-white text-sm font-medium">{relation.name}</div>
                                      <div className="text-gray-400 text-xs">({relation.relation})</div>
                                      <div
                                        className={`text-xs mt-1 px-1 py-0.5 rounded ${relation.type === "member"
                                          ? "bg-green-600 text-green-100"
                                          : relation.type === "lead"
                                            ? "bg-blue-600 text-blue-100"
                                            : "bg-gray-600 text-gray-100"
                                          }`}
                                      >
                                        {relation.type}
                                      </div>
                                    </div>
                                  ))}
                                  {relations.length === 0 && (
                                    <div className="text-gray-500 text-xs text-center">No relations</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Relations List */}
                    <div className="bg-[#161616] rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                      <div className="space-y-4">
                        {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                          <div key={category}>
                            <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                            <div className="space-y-2 ml-4">
                              {relations.length > 0 ? (
                                relations.map((relation) => (
                                  <div
                                    key={relation.id}
                                    className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${relation.type === "member" || relation.type === "lead"
                                      ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                      : ""
                                      }`}
                                    onClick={() => {
                                      if (relation.type === "member" || relation.type === "lead") {
                                        alert(`Clicked on ${relation.name} (${relation.type})`)
                                      }
                                    }}
                                  >
                                    <div>
                                      <span className="text-white font-medium">{relation.name}</span>
                                      <span className="text-gray-400 ml-2">- {relation.relation}</span>
                                      <span
                                        className={`ml-2 text-xs px-2 py-0.5 rounded ${relation.type === "member"
                                          ? "bg-green-600 text-green-100"
                                          : relation.type === "lead"
                                            ? "bg-blue-600 text-blue-100"
                                            : "bg-gray-600 text-gray-100"
                                          }`}
                                      >
                                        {relation.type}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">No {category} relations</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
