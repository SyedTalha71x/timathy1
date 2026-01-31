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
  MessageCircle,
  Dumbbell,
  Eye,
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"

import ViewManagementModal from "../../components/myarea-components/ViewManagementModal"
import StaffCheckInWidget from "../../components/myarea-components/widgets/StaffWidgetCheckIn"
import DraggableWidget from "../../components/myarea-components/DraggableWidget"
import ContingentModal from "../../components/myarea-components/ContigentModal"

import { WidgetSelectionModal } from "../../components/widget-selection-modal"

import { notificationData, memberContingentDataNew, mockTrainingPlansNew, mockVideosNew, memberRelationsData, mockMemberHistoryNew, mockMemberRelationsNew, availableMembersLeadsNew, customLinksData, communicationsData, birthdaysData, memberTypesData, expiringContractsData, bulletinBoardData } from "../../utils/studio-states/myarea-states"
import BirthdayMessageModal from "../../components/myarea-components/BirthdayMessageModal"
import NotesWidget from "../../components/myarea-components/widgets/NotesWidget"
import BulletinBoardWidget from "../../components/myarea-components/widgets/BulletinBoardWidget"
import ToDoWidget from "../../components/myarea-components/widgets/ToDoWidget"
import ShiftScheduleWidget from "../../components/myarea-components/widgets/ShiftScheduleWidget"
import { createPortal } from "react-dom"
import AnalyticsChartWidget from "../../components/myarea-components/widgets/AnalyticsChartWidget"
import WebsiteLinksWidget from "../../components/myarea-components/widgets/WebsiteLinksWidget"

import { appointmentsData } from "../../utils/studio-states"

export default function MyArea() {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const navigate = useNavigate()
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 })

  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")

  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const [isSpecialNoteModalOpen, setIsSpecialNoteModalOpen] = useState(false)
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState(null)

  const [hoveredNoteId, setHoveredNoteId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const [isMemberOverviewModalOpen, setisMemberOverviewModalOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details")
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
  const [appointments, setAppointments] = useState(appointmentsData)
  const [birthdays, setBirthdays] = useState(birthdaysData)
  const [expiringContracts, setExpiringContracts] = useState(expiringContractsData)

  const [widgets, setWidgets] = useState([
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
  ])

  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)
  const [activeNoteId, setActiveNoteId] = useState(null)

  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)

  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current")
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [newBillingPeriod, setNewBillingPeriod] = useState("")
  const [showContingentModal, setShowContingentModal] = useState(false)

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

  const handleEditSubmit = (e) => {
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
        const existsInMain = widgets.some((widget) => widget.type === widgetType)
        if (existsInMain) {
          return { canAdd: false, location: "dashboard" }
        }
        return { canAdd: true, location: null }
      }
      return { canAdd: true, location: null }
    },
    [widgets],
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
      setIsSpecialNoteModalOpen(false)
      setSelectedAppointmentForNote(null)

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
      text: `→ ${memberTypes[selectedMemberType].growth} more in 2024`,
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

  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId, event) => {
      if (!specialNote || !specialNote.text?.trim()) return null

      const isActive =
        !specialNote.startDate ||
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
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }

        const rect = e.currentTarget.getBoundingClientRect()
        setNotePosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        })

        const timeout = setTimeout(() => {
          setActiveNoteId(memberId)
        }, 300)
        setHoverTimeout(timeout)
      }

      const handleMouseLeave = (e) => {
        e.stopPropagation()
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
          setHoverTimeout(null)
        }
        if (activeNoteId !== memberId) {
          setActiveNoteId(null)
        }
      }

      const handleEditClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(null)
        handleEditNote(memberId, specialNote)
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

          {activeNoteId === memberId &&
            createPortal(
              <div
                ref={notePopoverRef}
                className="fixed w-64 sm:w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[99999]"
                style={{
                  top: notePosition.top,
                  left: notePosition.left,
                }}
                onMouseEnter={() => setActiveNoteId(memberId)}
                onMouseLeave={() => setActiveNoteId(null)}
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
            )}
        </div>
      )
    },
    [activeNoteId, notePosition, hoverTimeout],
  )

  const handleViewMemberDetails = (appointmentIdOrMemberId) => {
    const appointment = appointments.find(app => app.id === appointmentIdOrMemberId)

    if (appointment) {
      const memberIdToNavigate = appointment.memberId || appointment.id
      if (memberIdToNavigate) {
        navigate(`/dashboard/member-details/${memberIdToNavigate}`)
      } else {
        toast.error("Member not found for this appointment")
      }
    } else {
      toast.error("Appointment not found")
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
  }

  const getMemberAppointments = (memberId) => {
    return appointments.filter(app => app.id === memberId)
  }

  const handleAppointmentOptionsModal = (appointment) => {
    if (appointment?.memberId) {
      navigate(`/dashboard/member-details/${appointment.memberId}`)
    }
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
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-1 md:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Top Row (Title) */}
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">My Area</h1>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex justify-center md:justify-end gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2 flex justify-center items-center md:w-auto w-full text-sm gap-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
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
                                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center relative">
                                        <img
                                          src={Avatar || "/placeholder.svg"}
                                          alt=""
                                          className="w-full h-full rounded-xl"
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
                        <WebsiteLinksWidget
                          isEditing={isEditing}
                          onRemove={() => removeWidget(widget.id)}
                          customLinks={customLinks}
                          onAddLink={(newLink) => setCustomLinks((prev) => [...prev, newLink])}
                          onEditLink={(updatedLink) => {
                            setCustomLinks((currentLinks) =>
                              currentLinks.map((link) =>
                                link.id === updatedLink.id ? { ...link, ...updatedLink } : link
                              )
                            )
                          }}
                          onRemoveLink={(linkId) => {
                            setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== linkId))
                          }}
                        />
                      )}

                      {/* New ToDoWidget Component */}
                      {widget.type === "todo" && (
                        <ToDoWidget isSidebarEditing={isEditing} />
                      )}

                      {widget.type === "birthday" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upcoming Birthday</h2>
                          </div>

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
                                        {birthday.dateOfBirth && (
                                          <span className="text-zinc-400 font-normal">
                                            ({calculateAge(birthday.dateOfBirth)})
                                          </span>
                                        )}
                                        {isBirthdayToday(birthday.date) && (
                                          <span className="text-yellow-500">🎂</span>
                                        )}
                                      </h3>
                                      <p className="text-xs text-zinc-400">
                                        {birthday.date}
                                      </p>
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

        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "dashboard")}
          widgetArea="dashboard"
        />
      </div>
    </>
  )
}
