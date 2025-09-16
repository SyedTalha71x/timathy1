/* eslint-disable no-unused-vars */
import { useCallback, useRef, useState } from "react";
import { AlertTriangle, CalendarIcon, ChevronDown, Copy, Edit, Info, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the date picker
import "../../custom-css/marketing-table-style.css";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { IoIosMenu } from "react-icons/io";
import { appointmentsData, availableMembersLeadsNew, birthdaysData, communicationsData, customLinksData, expiringContractsData, memberContingentDataNew, memberRelationsData, memberTypesData, mockTrainingPlansNew, mockVideosNew, notificationData, todosData } from "../../utils/user-panel-states/myarea-states";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../components/central-sidebar";
import MemberOverviewModal from "../../components/communication-components/MemberOverviewModal";
import AppointmentActionModal from "../../components/appointments-components/appointment-action-modal";
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal";
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal";
import { WidgetSelectionModal } from "../../components/widget-selection-modal";
import EditMemberModal from "../../components/myarea-components/EditMemberModal";
import ContingentModal from "../../components/myarea-components/ContigentModal";
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal";
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal";
import AppointmentModal from "../../components/myarea-components/AppointmentModal";
import HistoryModal from "../../components/myarea-components/HistoryModal";


import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import EditTaskModal from "../../components/task-components/edit-task-modal";


import { useSidebarSystem } from "../../hooks/useSidebarSystem";
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal";

const MarketingTable = () => {

  const sidebarSystem = useSidebarSystem();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [metaLoggedIn, setMetaLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 4;
  const navigate = useNavigate();

  // sidebar related states
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [todoFilter, setTodoFilter] = useState("all")
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const [taskToCancel, setTaskToCancel] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [isSpecialNoteModalOpen, setIsSpecialNoteModalOpen] = useState(false)
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState(null)
  const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
  const [selectedUserForTrainingPlan, setSelectedUserForTrainingPlan] = useState(null)
  const [selectedAppointment, setselectedAppointment] = useState()
  const [isEditAppointmentModalOpen, setisEditAppointmentModalOpen] = useState(false)
  const [showAppointmentOptionsModal, setshowAppointmentOptionsModal] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [freeAppointments, setFreeAppointments] = useState([])


  const notePopoverRef = useRef(null)
  const memberTypes = memberTypesData

  const [customLinks, setCustomLinks] = useState(customLinksData)
  const [communications, setCommunications] = useState(communicationsData)
  const [todos, setTodos] = useState(todosData)
  const [birthdays, setBirthdays] = useState(birthdaysData)
  const [expiringContracts, setExpiringContracts] = useState(expiringContractsData)
  const [notifications, setnotifications] = useState(notificationData)
  const [appointments, setAppointments] = useState(appointmentsData)

  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isMemberOverviewModalOpen, setisMemberOverviewModalOpen] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details") // 'details', 'relations'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("January 2025")

  const [memberContingentData, setMemberContingentData] = useState(memberContingentDataNew)

    const mockTrainingPlans = mockTrainingPlansNew
    const mockVideos = mockVideosNew
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [memberRelations, setMemberRelations] = useState(memberRelationsData)
  const availableMembersLeads = availableMembersLeadsNew

  const [memberHistory, setMemberHistory] = useState({})

  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 }) // For contingent modal
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current") // For contingent modal
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false) // For contingent modal
  const [newBillingPeriod, setNewBillingPeriod] = useState("") // For contingent modal
  const [showContingentModal, setShowContingentModal] = useState(false)


  const [editModalTab, setEditModalTab] = useState("details")


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


  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]



  // marketing page related logic
  const [isCopied, setIsCopied] = useState(false);

  const trialTrainingUrl = "https://example.com/trial-training";

  const campaigns = [
    {
      id: 1,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 2,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 3,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 4,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 5,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const startIndex = (currentPage - 1) * campaignsPerPage;
  const paginatedCampaigns = campaigns.slice(startIndex, startIndex + campaignsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when page changes
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(trialTrainingUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  const handleMetaLogin = () => {
    // Implement Meta login logic here
    setMetaLoggedIn(true);
  };



  // again sidebar related logic
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ]

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

  const toggleSidebarEditing = () => setIsSidebarEditing(!isSidebarEditing) // Toggle sidebar edit mode


  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "expiringContracts", type: "expiringContracts", position: 1 }, // Moved to start of grid
    { id: "appointments", type: "appointments", position: 2 },
    { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
    { id: "websiteLink", type: "websiteLink", position: 4 },
    { id: "communications", type: "communications", position: 5 },
    { id: "todo", type: "todo", position: 6 },
    { id: "birthday", type: "birthday", position: 7 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 8 }, // Add this line
  ])

  const [rightSidebarWidgets, setRightSidebarWidgets] = useState([
    { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
    { id: "sidebarAppointments", type: "appointments", position: 4 },
    { id: "sidebarChart", type: "chart", position: 5 },
    { id: "sidebarExpiringContracts", type: "expiringContracts", position: 6 },
    { id: "bulletinBoard", type: "bulletinBoard", position: 7 }, // Add this line

    { id: "sidebarStaffCheckIn", type: "staffCheckIn", position: 8 },
  ])

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


  const todoFilterOptions = [
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]

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

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
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
  const handleDumbbellClick = (appointment, e) => {
    e.stopPropagation()
    setSelectedUserForTrainingPlan(appointment)
    setIsTrainingPlanModalOpen(true)
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
  const handleAppointmentOptionsModal = (appointment) => {
    setselectedAppointment(appointment)
    setshowAppointmentOptionsModal(true)
    setisEditAppointmentModalOpen(false) // Ensure edit modal is closed
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
  const handleSaveSpecialNote = (appointmentId, updatedNote) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, specialNote: updatedNote } : app)),
    )
    toast.success("Special note updated successfully")
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
  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

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

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    toast.success("Member notified successfully!")
  }

  const handleDeleteAppointment = (id) => {
    // setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setselectedAppointment(null)
    setisEditAppointmentModalOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
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
    setisMemberOverviewModalOpen(false)
    if (selectedMember) {
      setShowAppointmentModal(true)
    }
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

  const getMemberAppointments = (memberId) => {
    // Return appointments for the specific member
    return appointments.filter(app => app.id === memberId)
  }


  const handleEditAppointment = (appointment) => {
    setselectedAppointment(appointment)
    setisEditAppointmentModalOpen(true)
    setShowAppointmentModal(false)
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

  const handleUpdateTask = (updatedTask) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)))
  }

  const handleCancelTask = (taskId) => {
    setTodos((prev) => prev.map((todo) => (todo.id === taskId ? { ...todo, status: "cancelled" } : todo)))
    setTaskToCancel(null)
  }

  const handleDeleteTask = (taskId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId))
    setTaskToDelete(null)
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
      <div className=" min-h-screen">
        <div
          className={`
          min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-4 p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen
              ? 'lg:mr-86 mr-0'
              : 'mr-0'
            }
        `}
        >
          <div className="p-3">
            <div className="flex justify-between items-center mb-8 relative flex-wrap gap-4">
              <div className="w-full flex justify-between items-center md:w-auto">
                <h1 className="text-2xl oxanium_font text-white">Marketing</h1>

                <div></div>
                <div className="md:hidden block">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
              </div>
              <div className="flex lg:flex-row flex-col lg:gap-4 items-center gap-2 w-full lg:w-auto">
                <button
                  className="flex justify-center open_sans_font items-center gap-2 cursor-pointer bg-blue-600 text-white px-7 py-2 rounded-xl text-sm w-full lg:w-auto"
                  onClick={handleMetaLogin}
                >
                  {metaLoggedIn ? "Logged In" : "Login with Meta"}
                </button>
                <button
                  className="flex justify-center open_sans_font items-center gap-2 cursor-pointer bg-black text-white px-7 py-2 rounded-xl text-sm w-full lg:w-auto"
                  onClick={() => setIsDateOpen((prev) => !prev)}
                >
                  Date
                  <ChevronDown size={16} />
                </button>
                <div className="md:block hidden">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
              </div>

              {isDateOpen && (
                <div className="absolute top-full right-6 z-20 bg-black text-white p-4 rounded-xl mt-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                    dateFormat="MMM dd, yyyy"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center lg:flex-row flex-col gap-2 mb-8">
              <input
                type="text"
                value={trialTrainingUrl}
                readOnly
                className="flex-1 bg-[#141414] text-sm text-white rounded-xl p-2 pr-10 outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-2 text-sm bg-[#F27A30] text-white px-4 py-2 rounded-xl hover:bg-[#e6691d] transition-colors"
              >
                <Copy size={16} />
                {isCopied ? "Copied!" : "Copy URL"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[1200px] md:min-w-[800px] w-full">
                <div className="grid grid-cols-5 text-sm text-white pb-4">
                  <div className="font-medium open_sans_font_700">Name</div>
                  <div className="font-medium open_sans_font_700">Reach</div>
                  <div className="font-medium open_sans_font_700">Impression</div>
                  <div className="font-medium open_sans_font_700">CPC</div>
                  <div className="font-medium open_sans_font_700">Time</div>
                </div>

                <div className="space-y-4 open_sans_font">
                  {paginatedCampaigns.map((campaign) => (
                    <div key={campaign.id} className="grid grid-cols-5 bg-[#141414] rounded-xl p-4">
                      <div>
                        <span className="text-white">{campaign.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white">{campaign.reach.value}</span>
                        <span className="text-sm text-gray-400">{campaign.reach.label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white">{campaign.impression.value}</span>
                        <span className="text-sm text-gray-400">{campaign.impression.label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white">{campaign.cpc.value}</span>
                        <span className="text-sm text-gray-400">{campaign.cpc.label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white whitespace-nowrap">{campaign.time.value}</span>
                        <span className="text-sm text-gray-400">{campaign.time.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {campaigns.length > campaignsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded-xl transition-colors border ${currentPage === page
                        ? "bg-[#F27A30] text-white border-transparent"
                        : "bg-black text-white border-gray-800 hover:bg-gray-900"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
                >
                  Next
                </button>
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

         <TrainingPlanModal
                  isOpen={isTrainingPlanModalOpen}
                  onClose={() => setIsTrainingPlanModalOpen(false)}
                  user={selectedUserForTrainingPlan}
                  trainingPlans={mockTrainingPlans}
                  getDifficultyColor={getDifficultyColor}
                  getVideoById={getVideoById}
                />


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


        <NotifyMemberModal
          isOpen={isNotifyMemberOpen}
          onClose={() => setIsNotifyMemberOpen(false)}
          notifyAction={notifyAction}
          actuallyHandleCancelAppointment={actuallyHandleCancelAppointment}
          handleNotifyMember={handleNotifyMember}
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
              setIsEditTaskModalOpen(false)
              setEditingTask(null)
            }}
            onUpdateTask={handleUpdateTask}
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
                  onClick={() => handleCancelTask(taskToCancel)}
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
  );
};

export default MarketingTable;