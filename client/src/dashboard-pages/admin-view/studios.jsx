
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Search,
  ChevronDown,
  Eye,
  Info,
  AlertTriangle,
  MapPin,
  Plus,
  Building,
  Users,
  Edit,
  UserCheck,
  Building2,
  Network,
  EyeOff,
  HistoryIcon,
} from "lucide-react"

import {
  FranchiseData,
  studioappointmentsMainData,
  studioappointmentsStaffData,
  studioappointmentTypeMainData,
  studioappointmentTypeStaffData,
  studioContractHistoryData,
  studioContractsData,
  studioDataNew,
  studiofreeAppointmentsMainData,
  studiofreeAppointmentsStaffData,
  studioHistoryMainData,
  studiomemberHistoryNew,
  studioMembersData,
  studioStaffData,
  studiostaffHistoryNew,
  studioStatsData,
} from "../../utils/admin-panel-states/states"

import DefaultStudioImage from "../../../public/gray-avatar-fotor-20250912192528.png"
import toast, { Toaster } from "react-hot-toast"
import { RiContractFill } from "react-icons/ri"
import { IoIosMenu } from "react-icons/io"

import FranchiseModal from "../../components/admin-dashboard-components/studios-modal/franchise-modal"
import AssignStudioModal from "../../components/admin-dashboard-components/studios-modal/assign-studios-modal"
import StudioManagementModal from "../../components/admin-dashboard-components/studios-modal/studio-management-modal"
import FranchiseDetailsModal from "../../components/admin-dashboard-components/studios-modal/franchise-details-modal"

import EditMemberModal from "../../components/admin-dashboard-components/studios-modal/members-component/edit-member-modal"
import EditStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/edit-staff-modal"
import StudioDetailsModal from "../../components/admin-dashboard-components/studios-modal/studios-detail-modal"

import EditStudioModal from '../../components/admin-dashboard-components/studios-modal/edit-studio-modal'
import ContractsModal from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-modal"
import AddStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/add-staff-modal"
import { ViewStaffModal } from "../../components/admin-dashboard-components/studios-modal/staff-components/view-staff-details"
import MemberDetailsModal from "../../components/admin-dashboard-components/studios-modal/members-component/members-detail"
import ContractDetailsModal from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-details"
import StudioHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/studio-history"
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import Sidebar from "../../components/admin-dashboard-components/central-sidebar"
import StudioMembersModal from "../../components/admin-dashboard-components/studios-modal/members-component/MemberOverviewModal"
import StudioStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/StaffOverviewModal"
import MemberHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/member-history-modal"
import { MemberDocumentModal } from "../../components/admin-dashboard-components/studios-modal/members-component/members-document-modal"
import AppointmentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/appointment-modal"
import EditAppointmentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/edit-appointment-modal"
import AddAppointmentModal from "../../components/admin-dashboard-components/studios-modal/members-component/add-appointment-modal"
import ContingentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/show-contigent-modal"
import AddBillingPeriodModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/add-biling-period-modal"
import StaffHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/staff-components/staff-history-modal"
import { StaffDocumentModal } from "../../components/admin-dashboard-components/studios-modal/staff-components/staff-document-modal"
import AppointmentModalStaff from "../../components/admin-dashboard-components/studios-modal/staff-components/appointment-modal"
import AddAppointmentModalStaff from "../../components/admin-dashboard-components/studios-modal/staff-components/add-appointment-modal"
import EditAppointmentModalStaff from "../../components/admin-dashboard-components/studios-modal/staff-components/edit-appointment-modal"
import ContingentModalStaff from "../../components/admin-dashboard-components/studios-modal/staff-components/show-contigent-modal"
import AddBillingPeriodModalStaff from "../../components/admin-dashboard-components/studios-modal/staff-components/add-billing-period"
import { ContractHistoryModal } from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-history-modal"

export default function Studios() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedStudio, setSelectedStudio] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [franchiseSearchQuery, setFranchiseSearchQuery] = useState("")
  const [unassignedStudioSearchQuery, setUnassignedStudioSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [sortBy, setSortBy] = useState("alphabetical")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)

  // New franchise-related states
  const [viewMode, setViewMode] = useState("studios") // "studios" or "franchise"
  const [isCreateFranchiseModalOpen, setIsCreateFranchiseModalOpen] = useState(false)
  const [isEditFranchiseModalOpen, setIsEditFranchiseModalOpen] = useState(false)
  const [isFranchiseDetailsModalOpen, setIsFranchiseDetailsModalOpen] = useState(false)
  const [isAssignStudioModalOpen, setIsAssignStudioModalOpen] = useState(false)
  const [isStudioManagementModalOpen, setIsStudioManagementModalOpen] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState(null)
  const [selectedFranchiseForAssignment, setSelectedFranchiseForAssignment] = useState(null)
  const [selectedFranchiseForManagement, setSelectedFranchiseForManagement] = useState(null)

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
  const [isStaffsModalOpen, setIsStaffsModalOpen] = useState(false)
  const [isContractsModalOpen, setIsContractsModalOpen] = useState(false)
  const [selectedStudioForModal, setSelectedStudioForModal] = useState(null)

  const [isEditStaffModalOpen, setisEditStaffModalOpen] = useState(false)
  const [selectedStaffForEdit, setselectedStaffForEdit] = useState(null)

  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
  const [memberEditForm, setMemberEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "",
    joinDate: "",
    status: "active",
  })

  // New states for view details modals
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [isStaffDetailsModalOpen, setIsStaffDetailsModalOpen] = useState(false)
  const [isContractDetailsModalOpen, setIsContractDetailsModalOpen] = useState(false)
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null)

  // New states for adding new items
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)

  const [financesPeriod, setFinancesPeriod] = useState("month")
  const [showPassword, setShowPassword] = useState({})

  const [editForm, setEditForm] = useState({
    // =========================
    // Basic Studio Information
    // =========================
    name: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    website: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    ownerName: "",
  
    // =========================
    // Schedule and Operations
    // =========================
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    closingDays: "",
    openingHoursList: [], // [{ day, startTime, endTime }]
    closingDaysList: [], // [{ date, description }]
  
    // =========================
    // Branding
    // =========================
    logoUrl: "",
    logoFile: null,
  
    // =========================
    // Resources / Appointments
    // =========================
    maxCapacity: 10,
    appointmentTypes: [], // [{ name, duration, capacity, color, interval, images }]
    trialTraining: { name: "Trial Training", duration: 60, capacity: 1, color: "#1890ff" },
  
    // =========================
    // Contracts
    // =========================
    contractTypes: [], // [{ name, duration, cost, billingPeriod, userCapacity, autoRenewal, renewalPeriod, renewalPrice, cancellationPeriod }]
    contractSections: [
      { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
      { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
    ],
    contractPauseReasons: [
      { name: "Vacation", maxDays: 30 },
      { name: "Medical", maxDays: 90 },
    ],
    noticePeriod: 30,
    extensionPeriod: 12,
    allowMemberSelfCancellation: false,
  
    // =========================
    // Communication
    // =========================
    autoArchiveDuration: 30,
    emailNotifications: true,
    chatNotifications: true,
    studioChatNotifications: true,
    memberChatNotifications: true,
    emailSignature: "Best regards,\n{Studio_Name} Team",
    appointmentNotifications: [
      {
        type: "booking",
        title: "Appointment Confirmation",
        message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.",
        sendVia: ["email", "platform"],
        enabled: true,
      },
      {
        type: "cancellation",
        title: "Appointment Cancellation",
        message: "Hello {Member_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.",
        sendVia: ["email", "platform"],
        enabled: true,
      },
      {
        type: "rescheduled",
        title: "Appointment Rescheduled",
        message: "Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.",
        sendVia: ["email", "platform"],
        enabled: true,
      },
    ],
    broadcastMessages: [],
  
    emailConfig: {
      smtpServer: "",
      smtpPort: 587,
      emailAddress: "",
      password: "",
      useSSL: false,
      senderName: "",
      smtpUser: "",
      smtpPass: "",
    },
  
    birthdayMessages: {
      enabled: false,
      subject: "Happy Birthday from {Studio_Name}",
      message: "Dear {Member_Name},\nWishing you a wonderful birthday! Your {Studio_Name} family celebrates you today.",
      sendVia: ["email"],
      sendTime: "09:00",
    },
  
    // =========================
    // Appearance
    // =========================
    appearance: {
      theme: "dark",
      primaryColor: "#FF843E",
      secondaryColor: "#1890ff",
      allowUserThemeToggle: true,
    },
  
    // =========================
    // Configuration
    // =========================
    roles: [], // [{ name, permissions: ["read", "write", "delete"] }]
    permissionTemplates: [], // [{ name, roles: [...] }]
    leadSources: [], // [{ name }]
    tags: [], // [{ name, color }]
  
    currency: "EUR",
    vatRates: [
      { name: "Standard", rate: 19 },
      { name: "Reduced", rate: 7 },
    ],
  
    additionalContractDocuments: [],
    additionalDocs: [],
  })


  const [franchiseForm, setFranchiseForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    website: "",
    about: "",
    ownerFirstName: "",
    ownerLastName: "",
    country: "",
    specialNote: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
    loginEmail: "",
    loginPassword: "",
    confirmPassword: "",
    logo: null,
  })

  // Franchise data state
  const [franchises, setFranchises] = useState(FranchiseData)
  const [studioStats, setStudioStats] = useState(studioStatsData)
  const [studioMembers, setStudioMembers] = useState(studioMembersData)
  const [studioStaffs, setStudioStaffs] = useState(studioStaffData)
  const [studioContracts, setStudioContracts] = useState(studioContractsData)


  // for studio history itself
  const [showHistory, setShowHistory] = useState(false)
  const [historyTabMain, setHistoryTabMain] = useState("general")

  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [staffSearchQuery, setStaffSearchQuery] = useState("")


  // for members
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [memberHistory, setMemberHistory] = useState(studiomemberHistoryNew)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showAppointmentModalMain, setShowAppointmentModalMain] = useState(false)
  const [appointmentsMain, setAppointmentsMain] = useState(studioappointmentsMainData)
  const [appointmentTypesMain, setAppointmentTypesMain] = useState(studioappointmentTypeMainData)
  const [freeAppointmentsMain, setFreeAppointmentsMain] = useState(studiofreeAppointmentsMainData)
  const [selectedAppointmentDataMain, setSelectedAppointmentDataMain] = useState(null)
  const [showAddAppointmentModalMain, setShowAddAppointmentModalMain] = useState(false)
  const [showSelectedAppointmentModalMain, setShowSelectedAppointmentModalMain] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false)
  const [notifyActionMain, setNotifyActionMain] = useState("")
  const [memberContingent, setMemberContingent] = useState({
    1: {
      current: { used: 2, total: 7 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
    2: {
      current: { used: 1, total: 8 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
  })

  const [showContingentModalMain, setShowContingentModalMain] = useState(false)
  const [tempContingentMain, setTempContingentMain] = useState({ used: 0, total: 0 })
  const [currentBillingPeriodMain, setCurrentBillingPeriodMain] = useState("04.14.25 - 04.18.2025")
  const [selectedBillingPeriodMain, setSelectedBillingPeriodMain] = useState("current")
  const [showAddBillingPeriodModalMain, setShowAddBillingPeriodModalMain] = useState(false)
  const [newBillingPeriodMain, setNewBillingPeriodMain] = useState("")

  const getBillingPeriodsMain = (memberId) => {
    const memberData = memberContingent[memberId]
    if (!memberData) return []
    const periods = [{ id: "current", label: `Current (${currentBillingPeriodMain})`, data: memberData.current }]
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


  // for staff 
  const [showStaffHistoryModal, setShowStaffHistoryModal] = useState(false)
  const [staffHistory, setstaffHistory] = useState(studiostaffHistoryNew)
  const [historyTabStaff, setHistoryTabStaff] = useState("general")
  const [showDocumentModalStaff, setShowDocumentModalStaff] = useState(false)
  const [showAppointmentModalStaff, setShowAppointmentModalStaff] = useState(false)
  const [appointmentsStaff, setAppointmentsStaff] = useState(studioappointmentsStaffData)
  const [appointmentTypesStaff, setAppointmentTypesStaff] = useState(studioappointmentTypeStaffData)
  const [freeAppointmentsStaff, setFreeAppointmentsStaff] = useState(studiofreeAppointmentsStaffData)
  const [appointmentStaffToDelete, setAppointmentStaffToDelete] = useState(null)

  const [selectedAppointmentDataStaff, setSelectedAppointmentDataStaff] = useState(null)
  const [showAddAppointmentModalStaff, setShowAddAppointmentModalStaff] = useState(false)
  const [showSelectedAppointmentModalStaff, setShowSelectedAppointmentModalStaff] = useState(false)

  const [staffContingent, setStaffContingent] = useState({
    1: {
      current: { used: 2, total: 7 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
    2: {
      current: { used: 1, total: 8 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
  })

  const [showContingentModalStaff, setShowContingentModalStaff] = useState(false)
  const [tempContingentStaff, setTempContingentStaff] = useState({ used: 0, total: 0 })
  const [currentBillingPeriodStaff, setCurrentBillingPeriodStaff] = useState("04.14.25 - 04.18.2025")
  const [selectedBillingPeriodStaff, setSelectedBillingPeriodStaff] = useState("current")
  const [showAddBillingPeriodModalStaff, setShowAddBillingPeriodModalStaff] = useState(false)
  const [newBillingPeriodStaff, setNewBillingPeriodStaff] = useState("")

  const [isNotifyMemberOpenStaff, setIsNotifyMemberOpenStaff] = useState(false)
  const [notifyActionStaff, setNotifyActionStaff] = useState("")

  const getBillingPeriodsStaff = (staffId) => {
    const staffData = staffContingent[staffId]
    if (!staffData) return []
    const periods = [{ id: "current", label: `Current (${currentBillingPeriodMain})`, data: staffData.current }]
    if (staffData.future) {
      Object.entries(staffData.future).forEach(([period, data]) => {
        periods.push({
          id: period,
          label: `Future (${period})`,
          data: data,
        })
      })
    }
    return periods
  }

  // for contracts 

  const [contractHistory, setcontractHistory] = useState(studioContractHistoryData)
  const [isContractHistoryModalOpen, setIsContractHistoryModalOpen] = useState(false)
  const [selectedContractForHistory, setSelectedContractForHistory] = useState(null)




  //sidebar related logic and states
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    { id: "sidebar-notes", type: "notes", position: 4 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic

  const handleCloseModal = () => {
    setIsEditFranchiseModalOpen(false)
    setIsCreateFranchiseModalOpen(false)
  }

  const handleAssignStudioCloseModal = () => {
    setIsAssignStudioModalOpen(false)
  }

  const handleStudioManagementCloseModal = () => {
    setIsStudioManagementModalOpen(false)
    setSelectedFranchiseForManagement(null)
  }

  const handlePeriodChange = (newPeriod) => {
    setFinancesPeriod(newPeriod)
  }

  const togglePasswordVisibility = (franchiseId) => {
    setShowPassword((prev) => ({
      ...prev,
      [franchiseId]: !prev[franchiseId],
    }))
  }

  useEffect(() => {
    if (selectedStudio) {
      setEditForm({
        name: selectedStudio.name,
        email: selectedStudio.email,
        phone: selectedStudio.phone,
        street: selectedStudio.street,
        zipCode: selectedStudio.zipCode,
        city: selectedStudio.city,
        website: selectedStudio.website,
        about: selectedStudio.about,
        note: selectedStudio.note,
        noteStartDate: selectedStudio.noteStartDate,
        noteEndDate: selectedStudio.noteEndDate,
        noteImportance: selectedStudio.noteImportance,
        contractStart: selectedStudio.contractStart,
        contractEnd: selectedStudio.contractEnd,
        ownerName: selectedStudio.ownerName,
        taxId: selectedStudio.taxId || "",
        iban: selectedStudio.iban || "",
        country: selectedStudio.country || "",
        openingHours: selectedStudio.openingHours || {
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        closingDays: selectedStudio.closingDays || "",
      })
    }
  }, [selectedStudio])

  useEffect(() => {
    if (selectedFranchise) {
      setFranchiseForm({
        name: selectedFranchise.name,
        email: selectedFranchise.email,
        phone: selectedFranchise.phone,
        street: selectedFranchise.street,
        zipCode: selectedFranchise.zipCode,
        city: selectedFranchise.city,
        website: selectedFranchise.website,
        about: selectedFranchise.about,
        ownerFirstName: selectedFranchise.ownerFirstName || "",
        ownerLastName: selectedFranchise.ownerLastName || "",
        country: selectedFranchise.country || "",
        specialNote: selectedFranchise.specialNote || "",
        noteImportance: selectedFranchise.noteImportance || "unimportant",
        noteStartDate: selectedFranchise.noteStartDate || "",
        noteEndDate: selectedFranchise.noteEndDate || "",
        loginEmail: selectedFranchise.loginEmail,
        loginPassword: selectedFranchise.loginPassword,
        confirmPassword: selectedFranchise.loginPassword,
        logo: selectedFranchise.logo || null,
      })
    }
  }, [selectedFranchise])

  useEffect(() => {
    if (selectedMemberForEdit) {
      setMemberEditForm({
        name: selectedMemberForEdit.name,
        email: selectedMemberForEdit.email,
        phone: selectedMemberForEdit.phone,
        membershipType: selectedMemberForEdit.membershipType || selectedMemberForEdit.role || "",
        joinDate: selectedMemberForEdit.joinDate,
        status: selectedMemberForEdit.status,
      })
    }
  }, [selectedMemberForEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFranchiseInputChange = (e) => {
    const { name, value } = e.target
    setFranchiseForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFranchiseForm((prev) => ({
          ...prev,
          logo: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()

    const updatedStudios = studios.map((studio) => {
      if (studio.id === selectedStudio.id) {
        return {
          ...studio,
          ...editForm,
        }
      }
      return studio
    })

    setStudios(updatedStudios)
    setIsEditModalOpen(false)
    setSelectedStudio(null)
    toast.success("Studio details have been updated successfully")
  }

  const handleFranchiseSubmit = (e) => {
    e.preventDefault()

    if (franchiseForm.loginPassword !== franchiseForm.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (selectedFranchise) {
      // Edit existing franchise
      const updatedFranchises = franchises.map((franchise) => {
        if (franchise.id === selectedFranchise.id) {
          return {
            ...franchise,
            ...franchiseForm,
          }
        }
        return franchise
      })
      setFranchises(updatedFranchises)
      setIsEditFranchiseModalOpen(false)
      setSelectedFranchise(null)
      toast.success("Franchise updated successfully")
    } else {
      // Create new franchise
      const newFranchise = {
        id: Math.max(...franchises.map((f) => f.id), 0) + 1,
        ...franchiseForm,
        createdDate: new Date().toISOString().split("T")[0],
        studioCount: 0,
      }
      setFranchises([...franchises, newFranchise])
      setIsCreateFranchiseModalOpen(false)
      toast.success("Franchise created successfully")
    }

    setFranchiseForm({
      name: "",
      email: "",
      phone: "",
      street: "",
      zipCode: "",
      city: "",
      website: "",
      about: "",
      ownerFirstName: "",
      ownerLastName: "",
      country: "",
      specialNote: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
      loginEmail: "",
      loginPassword: "",
      confirmPassword: "",
      logo: null,
    })
  }

  const handleMemberEditSubmit = (e, formData) => {
    e.preventDefault()

    if (isMembersModalOpen) {
      setStudioMembers((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((member) =>
          member.id === selectedMemberForEdit.id ? { ...member, ...formData } : member,
        ),
      }))
    } else if (isStaffsModalOpen) {
      setStudioStaffs((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((staff) =>
          staff.id === selectedMemberForEdit.id ? { ...staff, ...formData, role: formData.membershipType } : staff,
        ),
      }))
    }

    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    toast.success("Details updated successfully")
  }

  // New handlers for view details
  const handleViewMemberDetails = (member) => {
    setSelectedItemForDetails(member)
    setIsMemberDetailsModalOpen(true)
  }

  const handleViewStaffDetails = (staff) => {
    setSelectedItemForDetails(staff)
    setIsStaffDetailsModalOpen(true)
  }

  const handleViewContractDetails = (contract) => {
    setSelectedItemForDetails(contract)
    setIsContractDetailsModalOpen(true)
  }

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

  const [studios, setStudios] = useState(studioDataNew)

  const filterOptions = [
    {
      id: "all",
      label: `All ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.length : franchises.length})`,
    },
    {
      id: "active",
      label: `Active ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.filter((m) => m.isActive).length : franchises.filter((f) => !f.isArchived).length})`,
    },
    {
      id: "archived",
      label: `${viewMode === "studios" ? "Inactive Studios" : "Archived Franchises"} (${viewMode === "studios" ? studios.filter((m) => !m.isActive).length : franchises.filter((f) => f.isArchived).length})`,
    },
  ]

  const sortOptions =
    viewMode === "studios"
      ? [
        { id: "alphabetical", label: "Alphabetical" },
        { id: "memberCount", label: "Studio Member Count (High to Low)" },
        { id: "memberCountLow", label: "Studio Member Count (Low to High)" },
      ]
      : [
        { id: "alphabetical", label: "Alphabetical" },
        { id: "studioCount", label: "Studio Count (High to Low)" },
        { id: "studioCountLow", label: "Studio Count (Low to High)" },
      ]

  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false

    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)

    return endDate <= oneMonthFromNow && endDate >= today
  }

  const filteredAndSortedStudios = () => {
    let filtered = studios.filter((studio) => studio.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filterStatus !== "all") {
      filtered = filtered.filter((studio) => (filterStatus === "active" ? studio.isActive : !studio.isActive))
    }

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "expiring") {
      filtered.sort((a, b) => {
        if (!a.contractEnd) return 1
        if (!b.contractEnd) return -1
        return new Date(a.contractEnd) - new Date(b.contractEnd)
      })
    } else if (sortBy === "memberCount") {
      filtered.sort((a, b) => (studioStats[b.id]?.members || 0) - (studioStats[a.id]?.members || 0))
    } else if (sortBy === "memberCountLow") {
      filtered.sort((a, b) => (studioStats[a.id]?.members || 0) - (studioStats[b.id]?.members || 0))
    }

    return filtered
  }

  const filteredAndSortedFranchises = () => {
    let filtered = franchises.filter((franchise) =>
      franchise.name.toLowerCase().includes(franchiseSearchQuery.toLowerCase()),
    )

    if (filterStatus !== "all") {
      if (filterStatus === "archived") {
        filtered = filtered.filter((franchise) => franchise.isArchived)
      } else {
        filtered = filtered.filter((franchise) => !franchise.isArchived)
      }
    }

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "studioCount") {
      filtered.sort((a, b) => getStudiosByFranchise(b.id).length - getStudiosByFranchise(a.id).length)
    } else if (sortBy === "studioCountLow") {
      filtered.sort((a, b) => getStudiosByFranchise(a.id).length - getStudiosByFranchise(b.id).length)
    }

    return filtered
  }

  const getStudiosByFranchise = (franchiseId) => {
    return studios.filter((studio) => studio.franchiseId === franchiseId)
  }

  const getUnassignedStudios = () => {
    return studios.filter((studio) => !studio.franchiseId)
  }

  const getFilteredUnassignedStudios = () => {
    return getUnassignedStudios().filter((studio) =>
      studio.name.toLowerCase().includes(unassignedStudioSearchQuery.toLowerCase()),
    )
  }

  const handleFilterSelect = (filterId) => {
    setFilterStatus(filterId)
    setIsFilterDropdownOpen(false)
  }

  const handleSortSelect = (sortId) => {
    setSortBy(sortId)
    setIsSortDropdownOpen(false)
  }

  const handleEditStudio = (studio) => {
    setSelectedStudio(studio)
    setIsEditModalOpen(true)
  }

  const handleEditFranchise = (franchise) => {
    setSelectedFranchise(franchise)
    setIsEditFranchiseModalOpen(true)
  }

  const handleViewDetails = (studio) => {
    setSelectedStudio(studio)
    setIsViewDetailsModalOpen(true)
  }

  const handleViewFranchiseDetails = (franchise) => {
    setSelectedFranchise(franchise)
    setIsFranchiseDetailsModalOpen(true)
  }

  const handleGoToContract = (studio) => {
    setSelectedStudioForModal(studio)
    setIsContractsModalOpen(true)
    setIsViewDetailsModalOpen(false)
  }

  const handleArchiveFranchise = (franchiseId) => {
    const updatedFranchises = franchises.map((franchise) => {
      if (franchise.id === franchiseId) {
        return { ...franchise, isArchived: !franchise.isArchived }
      }
      return franchise
    })
    setFranchises(updatedFranchises)
    toast.success("Franchise archived successfully")
  }

  const handleAssignStudio = (franchiseId, studioId) => {
    const updatedStudios = studios.map((studio) => {
      if (studio.id === studioId) {
        return { ...studio, franchiseId }
      }
      return studio
    })
    setStudios(updatedStudios)

    // Update franchise studio count
    const updatedFranchises = franchises.map((franchise) => {
      if (franchise.id === franchiseId) {
        return { ...franchise, studioCount: franchise.studioCount + 1 }
      }
      return franchise
    })
    setFranchises(updatedFranchises)

    setIsAssignStudioModalOpen(false)
    toast.success("Studio assigned to franchise successfully")
  }

  const handleUnassignStudio = (studioId) => {
    const studio = studios.find((s) => s.id === studioId)
    const updatedStudios = studios.map((s) => {
      if (s.id === studioId) {
        return { ...s, franchiseId: null }
      }
      return s
    })
    setStudios(updatedStudios)

    // Update franchise studio count
    if (studio.franchiseId) {
      const updatedFranchises = franchises.map((franchise) => {
        if (franchise.id === studio.franchiseId) {
          return { ...franchise, studioCount: Math.max(0, franchise.studioCount - 1) }
        }
        return franchise
      })
      setFranchises(updatedFranchises)
    }

    toast.success("Studio unassigned from franchise")
  }

  const handleOpenStudioManagement = (franchise) => {
    setSelectedFranchiseForManagement(franchise)
    setIsStudioManagementModalOpen(true)
  }

  const handleOpenMembersModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsMembersModalOpen(true)
  }

  const handleOpenStaffsModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsStaffsModalOpen(true)
  }

  const handleOpenContractsModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsContractsModalOpen(true)
  }

  const handleEditMember = (member) => {
    setSelectedMemberForEdit(member)
    setIsEditMemberModalOpen(true)
  }

  const handleDownloadFile = (fileName) => {
    toast.success(`Downloading ${fileName}`)
  }

  const handleFileUpload = (contractId, files) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => file.name)

      setStudioContracts((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((contract) =>
          contract.id === contractId ? { ...contract, files: [...contract.files, ...newFiles] } : contract,
        ),
      }))

      toast.success(`${newFiles.length} file(s) uploaded successfully`)
    }
  }

  const getFilteredMembers = () => {
    if (!selectedStudioForModal || !studioMembers[selectedStudioForModal.id]) return []

    return studioMembers[selectedStudioForModal.id].filter(
      (member) =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.phone.includes(memberSearchQuery),
    )
  }

  const getFilteredStaff = () => {
    if (!selectedStudioForModal || !studioStaffs[selectedStudioForModal.id]) return []

    return studioStaffs[selectedStudioForModal.id].filter(
      (staff) =>
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.phone.includes(staffSearchQuery) ||
        staff.role.toLowerCase().includes(staffSearchQuery.toLowerCase()),
    )
  }

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  // new state and functions for member

  const handleHistoryFromOverview = (member) => {
    console.log("Setting member for history:", member)
    setSelectedMemberForEdit(member) // This sets the member for history
    setShowHistoryModal(true) // This should open the member history modal
  }

  const handleDocumentFromOverview = (member) => {
    setSelectedMemberForEdit(member) // Change this from setselectedStaffForEdit
    setShowDocumentModal(true)
  }

  const handleCalendarFromOverview = (member) => {
    setSelectedMemberForEdit(member)
    setShowAppointmentModalMain(true)
  }

  const getMemberAppointmentsMain = (memberId) => {
    return appointmentsMain.filter((app) => app.memberId === memberId)
  }

  const handleEditAppointmentMain = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedMemberForEdit?.title || "Member",
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentDataMain(fullAppointment)
    setShowSelectedAppointmentModalMain(true)
    setShowAppointmentModalMain(false)
  }

  const handleDeleteAppointmentMain = (id) => {
    setAppointmentToDelete(id)
  }


  const handleCreateNewAppointmentMain = () => {
    setShowAddAppointmentModalMain(true)
    setShowAppointmentModalMain(false)
  }

  const handleManageContingentMain = (memberId) => {
    const memberData = memberContingent[memberId]
    if (memberData) {
      setTempContingentMain(memberData.current)
      setSelectedBillingPeriodMain("current")
    } else {
      setTempContingentMain({ used: 0, total: 0 })
    }
    setShowContingentModalMain(true)
  }

  const handleBillingPeriodChange = (periodId) => {
    setSelectedBillingPeriodMain(periodId)
    const memberData = memberContingent[selectedMemberForEdit.id]
    if (periodId === "current") {
      setTempContingentMain(memberData.current)
    } else {
      setTempContingentMain(memberData.future[periodId] || { used: 0, total: 0 })
    }
  }

  // 
  const handleSaveContingentMain = () => {
    if (selectedMemberForEdit) {
      const updatedContingent = { ...memberContingent }
      if (selectedBillingPeriodMain === "current") {
        updatedContingent[selectedMemberForEdit.id].current = { ...tempContingentMain }
      } else {
        if (!updatedContingent[selectedMemberForEdit.id].future) {
          updatedContingent[selectedMemberForEdit.id].future = {}
        }
        updatedContingent[selectedMemberForEdit.id].future[selectedBillingPeriodMain] = { ...tempContingentMain }
      }
      setMemberContingent(updatedContingent)
      toast.success("Contingent updated successfully")
    }
    setShowContingentModalMain(false)
  }

  // 
  const handleAddBillingPeriodMain = () => {
    if (newBillingPeriodMain.trim() && selectedMemberForEdit) {
      const updatedContingent = { ...memberContingent }
      if (!updatedContingent[selectedMemberForEdit.id].future) {
        updatedContingent[selectedMemberForEdit.id].future = {}
      }
      updatedContingent[selectedMemberForEdit.id].future[newBillingPeriodMain] = { used: 0, total: 0 }
      setMemberContingent(updatedContingent)
      setNewBillingPeriodMain("")
      setShowAddBillingPeriodModalMain(false)
      toast.success("New billing period added successfully")
    }
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointmentsMain.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForEdit?.id,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    setShowAddAppointmentModalMain(false)
  }

  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentDataMain) {
      setSelectedAppointmentDataMain({
        ...selectedAppointmentDataMain,
        ...changes,
      })
    }
  }


  // functions and other things for staff
  const handleAppointmentChangeStaff = (changes) => {
    if (selectedAppointmentDataStaff) {
      setSelectedAppointmentDataStaff({
        ...selectedAppointmentDataStaff,
        ...changes,
      })
    }
  }
  const handleStaffHistoryFromOverview = (staff) => {
    setselectedStaffForEdit(staff)
    setShowStaffHistoryModal(true)
  }

  const handleStaffDocumentFromOverview = (staff) => {
    setselectedStaffForEdit(staff)
    setShowDocumentModalStaff(true)
  }

  const handleStaffCalendarFromOverview = (staff) => {
    setselectedStaffForEdit(staff)
    setShowAppointmentModalStaff(true)
  }

  // const getStaffAppointments = (staffId) => {
  //   return appointmentsStaff.filter((app) => app.staffId === staffId)
  // }

  // const handleEditAppointmentStaff = (appointment) => {
  //   const fullAppointment = {
  //     ...appointment,
  //     name: selectedStaffForEdit?.title || "Staff",
  //     specialNote: appointment.specialNote || {
  //       text: "",
  //       isImportant: false,
  //       startDate: "",
  //       endDate: "",
  //     },
  //   }
  //   setSelectedAppointmentDataStaff(fullAppointment)
  //   setShowSelectedAppointmentModalStaff(true)
  //   setShowAppointmentModalStaff(false)
  // }

  // const handleDeleteAppointmentStaff = (id) => {
  //   setAppointmentStaffToDelete(id)
  // }

  // const handleCreateNewAppointmentStaff = () => {
  //   setShowAddAppointmentModalStaff(true)
  //   setShowAppointmentModalStaff(false)
  // }

  // const handleManageContingentStaff = (staffId) => {
  //   const staffData = staffContingent[staffId]
  //   if (staffData) {
  //     setTempContingentStaff(staffData.current)
  //     setSelectedBillingPeriodStaff("current")
  //   } else {
  //     setTempContingentStaff({ used: 0, total: 0 })
  //   }
  //   setShowContingentModalStaff(true)
  // }

  // const handleAddAppointmentSubmitStaff = (data) => {
  //   const newAppointment = {
  //     id: Math.max(0, ...appointmentsStaff.map((a) => a.id)) + 1,
  //     ...data,
  //     staffId: selectedStaffForEdit?.id,
  //   }
  //   setAppointmentsStaff([...appointmentsStaff, newAppointment])
  //   setShowAddAppointmentModalStaff(false)
  // }

  // const handleBillingPeriodChangeStaff = (periodId) => {
  //   setSelectedBillingPeriodStaff(periodId)
  //   const staffData = staffContingent[selectedStaffForEdit.id]
  //   if (periodId === "current") {
  //     setTempContingentStaff(staffData.current)
  //   } else {
  //     setTempContingentStaff(staffData.future[periodId] || { used: 0, total: 0 })
  //   }
  // }

  // const handleAddBillingPeriodStaff = () => {
  //   if (newBillingPeriodStaff.trim() && selectedStaffForEdit) {
  //     const updatedContingent = { ...staffContingent }
  //     if (!updatedContingent[selectedStaffForEdit.id].future) {
  //       updatedContingent[selectedStaffForEdit.id].future = {}
  //     }
  //     updatedContingent[selectedStaffForEdit.id].future[newBillingPeriodStaff] = { used: 0, total: 0 }
  //     setStaffContingent(updatedContingent)
  //     setNewBillingPeriodStaff("")
  //     setShowAddBillingPeriodModalStaff(false)
  //     toast.success("New billing period added successfully")
  //   }
  // }

  // const handleSaveContingentStaff = () => {
  //   if (selectedStaffForEdit) {
  //     const updatedContingent = { ...staffContingent }
  //     if (selectedBillingPeriodStaff === "current") {
  //       updatedContingent[selectedStaffForEdit.id].current = { ...tempContingentStaff }
  //     } else {
  //       if (!updatedContingent[selectedStaffForEdit.id].future) {
  //         updatedContingent[selectedStaffForEdit.id].future = {}
  //       }
  //       updatedContingent[selectedStaffForEdit.id].future[selectedBillingPeriodStaff] = { ...tempContingentStaff }
  //     }
  //     setStaffContingent(updatedContingent)
  //     toast.success("Contingent updated successfully")
  //   }
  //   setShowContingentModalStaff(false)
  // }

  const handleViewContractHistory = (contract) => {
    setSelectedContractForHistory(contract)
    setIsContractHistoryModalOpen(true)
  }


  return (
    <>
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

      <div
        className={`
      min-h-screen rounded-3xl relative bg-[#1C1C1C] text-white 
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"}
    `}
      >
        <div className="flex-1 min-w-0 p-4 pb-36 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center md:flex-row flex-col justify-start md:gap-0 gap-2">
                <h1 className="text-xl sm:text-2xl oxanium_font text-white">
                  {viewMode === "studios" ? "Studios" : "Franchises"}
                </h1>
              </div>
              <div
                onClick={toggleRightSidebar}
                className="cursor-pointer lg:hidden md:hidden block  text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md "
              >
                <IoIosMenu size={26} />
              </div>
            </div>

            <div className="flex md:items-center items-start  md:flex-row flex-col gap-3 w-full sm:w-auto">
              <div className="relative w-full md:w-auto filter-dropdown flex-1 sm:flex-none">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
                >
                  <span className="truncate">{filterOptions.find((opt) => opt.id === filterStatus)?.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform flex-shrink-0 ${isFilterDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${option.id === filterStatus ? "bg-[#000000]" : ""
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative w-full md:w-auto sort-dropdown flex-1 sm:flex-none">
                <div>
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
                  >
                    <span className="truncate">Sort: {sortOptions.find((opt) => opt.id === sortBy)?.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform flex-shrink-0 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${option.id === sortBy ? "bg-[#000000]" : ""
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                onClick={toggleRightSidebar}
                className="cursor-pointer lg:block md:block hidden  text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md "
              >
                <IoIosMenu size={26} />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex md:flex-row flex-col gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${viewMode === "studios" ? "studios" : "franchises"}...`}
                  value={viewMode === "studios" ? searchQuery : franchiseSearchQuery}
                  onChange={(e) => {
                    if (viewMode === "studios") {
                      setSearchQuery(e.target.value)
                    } else {
                      setFranchiseSearchQuery(e.target.value)
                    }
                  }}
                  className="w-full bg-[#101010] pl-10 pr-4 py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
                />
              </div>
              <div className="flex  bg-[#000000] rounded-xl border border-slate-300/30 p-1">
                <button
                  onClick={() => setViewMode("studios")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${viewMode === "studios" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                  <Building size={16} className="inline mr-2" />
                  Studios
                </button>
                <button
                  onClick={() => setViewMode("franchise")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${viewMode === "franchise" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                  <Network size={16} className="inline mr-2" />
                  Franchise
                </button>
              </div>
              {viewMode === "studios" ? (
                <button
                  onClick={() => setIsAssignStudioModalOpen(true)}
                  className="bg-[#FF843E] justify-center cursor-pointer hover:bg-[#FF843E]/90 px-4 py-3 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Network size={16} />
                  Assign to Franchise
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateFranchiseModalOpen(true)}
                  className="bg-blue-600 md:w-auto w-full  justify-center  hover:bg-[#3F74FF]/90 px-4 py-1 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create Franchise
                </button>
              )}
            </div>
          </div>

          <div className="bg-black rounded-xl open_sans_font p-4">
            {viewMode === "studios" ? (
              // Studios View
              filteredAndSortedStudios().length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedStudios().map((studio) => (
                    <div key={studio.id} className="bg-[#161616] rounded-xl p-6 relative">
                      {studio.note && (
                        <div className="absolute p-2 top-0 left-0 z-10">
                          <div className="relative">
                            <div
                              className={`${studio.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveNoteId(activeNoteId === studio.id ? null : studio.id)
                              }}
                            >
                              {studio.noteImportance === "important" ? (
                                <AlertTriangle size={18} className="text-white" />
                              ) : (
                                <Info size={18} className="text-white" />
                              )}
                            </div>

                            {activeNoteId === studio.id && (
                              <div
                                ref={notePopoverRef}
                                className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
                              >
                                <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                                  {studio.noteImportance === "important" ? (
                                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                                  ) : (
                                    <Info className="text-blue-500 shrink-0" size={18} />
                                  )}
                                  <h4 className="text-white flex gap-1 items-center font-medium">
                                    <div>Special Note</div>
                                    <div className="text-sm text-gray-400">
                                      {studio.noteImportance === "important" ? "(Important)" : "(Unimportant)"}
                                    </div>
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveNoteId(null)
                                    }}
                                    className="ml-auto text-gray-400 hover:text-white"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>

                                <div className="p-3">
                                  <p className="text-white text-sm leading-relaxed">{studio.note}</p>

                                  {studio.noteStartDate && studio.noteEndDate && (
                                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                                      <p className="text-xs text-gray-300">
                                        Valid from {studio.noteStartDate} to {studio.noteEndDate}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="flex flex-col sm:flex-row mt-3 items-center sm:items-start gap-4 w-full sm:w-auto">
                            <img
                              src={studio.image || DefaultStudioImage}
                              className="h-20 w-20 sm:h-16 sm:w-16 rounded-xl flex-shrink-0 object-cover"
                              alt=""
                            />
                            <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h3 className="text-white font-medium truncate text-lg sm:text-base">{studio.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${studio.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                                      }`}
                                  >
                                    {studio.isActive ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin size={14} className="text-gray-400" />
                                <p className="text-gray-400 text-sm truncate text-center sm:text-left">
                                  {studio.city}, {studio.zipCode}
                                </p>
                              </div>
                              <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left flex items-center">
                                Contract Period: {studio.contractStart} -{" "}
                                <span className={isContractExpiringSoon(studio.contractEnd) ? "text-red-500" : ""}>
                                  {studio.contractEnd}
                                </span>
                                {isContractExpiringSoon(studio.contractEnd) && (
                                  <Info size={16} className="text-red-500 ml-1" />
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center md:flex-row flex-col md:justify-end justify-center">
                            <button
                              onClick={() => {
                                setSelectedStudio(studio) // Set the studio first
                                setShowHistory(true)
                              }}
                              className="text-gray-200 md:w-auto w-full cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <HistoryIcon size={16} />
                              <span className="">History</span>
                            </button>
                            <button
                              onClick={() => handleViewDetails(studio)}
                              className="text-gray-200 md:w-auto w-full cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              <span className="inline">View Details</span>
                            </button>

                            <button
                              onClick={() => handleEditStudio(studio)}
                              className="text-gray-200 md:w-auto w-full cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Edit size={16} />
                              <span className="inline">Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center md:flex-row flex-col mt-3">
                          <button
                            onClick={() => handleOpenMembersModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Users size={16} />
                            <span>{studioStats[studio.id]?.members || 0}</span>
                            <span className="">Members</span>
                          </button>

                          <button
                            onClick={() => handleOpenStaffsModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <UserCheck size={16} />
                            <span>{studioStats[studio.id]?.trainers || 0}</span>
                            <span className="">Staff</span>
                          </button>

                          <button
                            onClick={() => handleOpenContractsModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <RiContractFill size={16} />
                            <span>{studioStats[studio.id]?.contracts || 0}</span>
                            <span className="">Contracts</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-600 text-center text-sm cursor-pointer">
                  <p className="text-gray-400">
                    {filterStatus === "active"
                      ? "No active studios found."
                      : filterStatus === "archived"
                        ? "No inactive studios found."
                        : "No studios found."}
                  </p>
                </div>
              )
            ) : // Franchises View
              filteredAndSortedFranchises().length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedFranchises().map((franchise) => (
                    <div key={franchise.id} className="bg-[#161616] rounded-xl p-6 relative">
                      {franchise.specialNote && (
                        <div className="absolute p-2 top-0 left-0 z-10">
                          <div className="relative">
                            <div
                              className={`${franchise.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveNoteId(
                                  activeNoteId === `franchise-${franchise.id}` ? null : `franchise-${franchise.id}`,
                                )
                              }}
                            >
                              {franchise.noteImportance === "important" ? (
                                <AlertTriangle size={18} className="text-white" />
                              ) : (
                                <Info size={18} className="text-white" />
                              )}
                            </div>

                            {activeNoteId === `franchise-${franchise.id}` && (
                              <div
                                ref={notePopoverRef}
                                className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
                              >
                                <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                                  {franchise.noteImportance === "important" ? (
                                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                                  ) : (
                                    <Info className="text-blue-500 shrink-0" size={18} />
                                  )}
                                  <h4 className="text-white flex gap-1 items-center font-medium">
                                    <div>Special Note</div>
                                    <div className="text-sm text-gray-400">
                                      {franchise.noteImportance === "important" ? "(Important)" : "(Unimportant)"}
                                    </div>
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveNoteId(null)
                                    }}
                                    className="ml-auto text-gray-400 hover:text-white"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>

                                <div className="p-3">
                                  <p className="text-white text-sm leading-relaxed">{franchise.specialNote}</p>

                                  {franchise.noteStartDate && franchise.noteEndDate && (
                                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                                      <p className="text-xs text-gray-300">
                                        Valid from {franchise.noteStartDate} to {franchise.noteEndDate}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                            <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                              {franchise.logo ? (
                                <img
                                  src={franchise.logo || "/placeholder.svg"}
                                  alt={franchise.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 size={24} className="text-white" />
                              )}
                            </div>
                            <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h3 className="text-white font-medium truncate text-lg sm:text-base">{franchise.name}</h3>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${franchise.isArchived ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}
                                >
                                  {franchise.isArchived ? "Archived" : "Active"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin size={14} className="text-gray-400" />
                                <p className="text-gray-400 text-sm truncate text-center sm:text-left">
                                  {franchise.city}, {franchise.zipCode}
                                </p>
                              </div>
                              <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left">
                                Owner: {franchise.ownerFirstName} {franchise.ownerLastName}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center md:flex-row flex-col md:justify-end justify-center">
                            <button
                              onClick={() => handleViewFranchiseDetails(franchise)}
                              className="text-gray-200 md:w-auto w-full cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              <span className="inline">View Details</span>
                            </button>
                            <button
                              onClick={() => handleEditFranchise(franchise)}
                              className="text-gray-200 md:w-auto w-full cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Edit size={16} />
                              <span className="inline">Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center md:flex-row flex-col mt-3">
                          <button
                            onClick={() => handleOpenStudioManagement(franchise)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer gap-2 bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Building size={16} />
                            <span>{getStudiosByFranchise(franchise.id).length}</span>
                            <span>Studios</span>
                          </button>
                          <div className="flex items-center md:w-auto w-full justify-center gap-2 bg-transparent border border-slate-700/50 px-4 py-2 rounded-lg text-sm">
                            <span>Login: {franchise.loginEmail}</span>
                          </div>
                          <div className="flex items-center md:w-auto w-full justify-center gap-2 bg-transparent border border-slate-700/50 px-4 py-2 rounded-lg text-sm">
                            <span>Password: </span>
                            <span className="font-mono">
                              {showPassword[franchise.id] ? franchise.loginPassword : "••••••••"}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(franchise.id)}
                              className="ml-1 text-gray-400 hover:text-white"
                            >
                              {showPassword[franchise.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
                  <p>No franchises found.</p>
                  <button
                    onClick={() => setIsCreateFranchiseModalOpen(true)}
                    className="mt-4 bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm"
                  >
                    Create Your First Franchise
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Member related modals */}
      {/* start  */}
      <StudioMembersModal
        isOpen={isMembersModalOpen}
        studio={selectedStudioForModal}
        studioMembers={studioMembers}
        memberSearchQuery={memberSearchQuery}
        setMemberSearchQuery={setMemberSearchQuery}
        getFilteredMembers={getFilteredMembers}
        onClose={() => {
          setIsMembersModalOpen(false)
          setSelectedStudioForModal(null)
          setMemberSearchQuery("")
        }}
        onViewMember={handleViewMemberDetails}
        onEditMember={handleEditMember}
        handleHistoryFromOverview={handleHistoryFromOverview}
        handleDocumentFromOverview={handleDocumentFromOverview}
        handleCalendarFromOverview={handleCalendarFromOverview}
      />

      <EditMemberModal
        isOpen={isEditMemberModalOpen}
        onClose={() => setIsEditMemberModalOpen(false)}
        selectedMember={selectedMemberForEdit}
        onSave={handleMemberEditSubmit}
      />

      <MemberDetailsModal
        isOpen={isMemberDetailsModalOpen}
        onClose={() => setIsMemberDetailsModalOpen(false)}
        member={selectedItemForDetails}
      />

      <MemberHistoryModalMain
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedMemberForEdit(null)
        }}
        selectedMember={selectedMemberForEdit} // Change from 'member' to 'selectedMember'
        memberHistory={memberHistory}
        historyTabMain={historyTabMain}
        setHistoryTabMain={setHistoryTabMain}
      />

      <MemberDocumentModal
        member={selectedMemberForEdit}
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false)
          setSelectedMemberForEdit(null) // Reset when closing
        }}
      />

      <AppointmentModalMain
        isOpen={showAppointmentModalMain}
        onClose={() => {
          setShowAppointmentModalMain(false)
          setSelectedMemberForEdit(null)
        }}
        selectedMemberMain={selectedMemberForEdit}
        getMemberAppointmentsMain={getMemberAppointmentsMain}
        appointmentTypesMain={appointmentTypesMain}
        handleEditAppointmentMain={handleEditAppointmentMain}
        handleDeleteAppointmentMain={handleDeleteAppointmentMain}
        memberContingent={memberContingent}
        currentBillingPeriodMain={currentBillingPeriodMain}
        handleManageContingentMain={handleManageContingentMain}
        handleCreateNewAppointmentMain={handleCreateNewAppointmentMain}
      />

      {showAddAppointmentModalMain && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModalMain}
          onClose={() => setShowAddAppointmentModalMain(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          freeAppointmentsMain={freeAppointmentsMain}
        />
      )}
      {showSelectedAppointmentModalMain && selectedAppointmentDataMain && (
        <EditAppointmentModalMain
          selectedAppointmentMain={selectedAppointmentDataMain}
          setSelectedAppointmentMain={setSelectedAppointmentDataMain}
          appointmentTypesMain={appointmentTypesMain}
          freeAppointmentsMain={freeAppointmentsMain}
          handleAppointmentChange={handleAppointmentChange}
          appointmentsMain={appointmentsMain}
          setAppointmentsMain={setAppointmentsMain}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          onDelete={handleDeleteAppointmentMain}
        />
      )}

      <ContingentModalMain
        showContingentModalMain={showContingentModalMain}
        setShowContingentModalMain={setShowContingentModalMain}
        selectedMemberForAppointmentsMain={selectedMemberForEdit}
        getBillingPeriodsMain={getBillingPeriodsMain}
        selectedBillingPeriodMain={selectedBillingPeriodMain}
        handleBillingPeriodChange={handleBillingPeriodChange}
        setShowAddBillingPeriodModalMain={setShowAddBillingPeriodModalMain}
        currentBillingPeriodMain={currentBillingPeriodMain}
        tempContingentMain={tempContingentMain}
        setTempContingentMain={setTempContingentMain}
        handleSaveContingentMain={handleSaveContingentMain}
      />
      <AddBillingPeriodModalMain
        open={showAddBillingPeriodModalMain}
        newBillingPeriodMain={newBillingPeriodMain}
        setNewBillingPeriodMain={setNewBillingPeriodMain}
        onClose={() => setShowAddBillingPeriodModalMain(false)}
        onAdd={handleAddBillingPeriodMain}
      />
      {/* end --------- */}



      {/* Staff related modals */}
      {/* start  */}
      <StudioStaffModal
        isOpen={isStaffsModalOpen}
        studio={selectedStudioForModal}
        studioStaffs={studioStaffs}
        staffSearchQuery={staffSearchQuery}
        setStaffSearchQuery={setStaffSearchQuery}
        getFilteredStaff={getFilteredStaff}
        onClose={() => {
          setIsStaffsModalOpen(false)
          setSelectedStudioForModal(null)
          setStaffSearchQuery("")
        }}
        onAddStaff={() => setIsAddStaffModalOpen(true)}
        onViewStaff={handleViewStaffDetails}
        onEditStaff={(staff) => {
          setselectedStaffForEdit(staff)
          setisEditStaffModalOpen(true)
        }}
        handleHistoryFromOverview={handleStaffHistoryFromOverview}
        handleDocumentFromOverview={handleStaffDocumentFromOverview}
      />

      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => {
          setisEditStaffModalOpen(false)
          setselectedStaffForEdit(null)
        }}
        onSave={(updatedStaff) => {
          setStudioStaffs((prev) => ({
            ...prev,
            [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((staff) =>
              staff.id === updatedStaff.id ? updatedStaff : staff,
            ),
          }))
          setisEditStaffModalOpen(false)
          toast.success("Staff member updated successfully")
        }}
        staff={selectedStaffForEdit}
        handleRemovalStaff={(staff) => {
          setStudioStaffs((prev) => ({
            ...prev,
            [selectedStudioForModal.id]: prev[selectedStudioForModal.id].filter((s) => s.id !== staff.id),
          }))
          setisEditStaffModalOpen(false)
          toast.success("Staff member removed successfully")
        }}
      />

      {isStaffDetailsModalOpen && selectedItemForDetails && (
        <ViewStaffModal
          isVisible={isStaffDetailsModalOpen}
          onClose={() => setIsStaffDetailsModalOpen(false)}
          staffData={selectedItemForDetails}
        />
      )}

      {isAddStaffModalOpen && (
        <AddStaffModal
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          onSave={(newStaff) => {
            setStudioStaffs((prev) => ({
              ...prev,
              [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), newStaff],
            }))
            setIsAddStaffModalOpen(false)
            toast.success("Staff member added successfully")
          }}
        />
      )}

      <StaffHistoryModalMain
        isOpen={showStaffHistoryModal}
        onClose={() => {
          setShowStaffHistoryModal(false)
          setselectedStaffForEdit(null)
        }}
        selectedStaff={selectedStaffForEdit}
        staffHistory={staffHistory}
        historyTabMain={historyTabStaff}
        setHistoryTabMain={setHistoryTabStaff}
      />

      <StaffDocumentModal
        staff={selectedStaffForEdit}
        isOpen={showDocumentModalStaff}
        onClose={() => {
          setShowDocumentModalStaff(false)
          setselectedStaffForEdit(null)
        }}
      />

      {/* <AppointmentModalStaff
        isOpen={showAppointmentModalStaff}
        onClose={() => {
          setShowAppointmentModalStaff(false)
          setselectedStaffForEdit(null)
        }}
        selectedStaff={selectedStaffForEdit}
        getStaffAppointmentsStaff={getStaffAppointments}
        appointmentTypesStaff={appointmentTypesStaff}
        handleEditAppointmentStaff={handleEditAppointmentStaff}
        handleDeleteAppointmentStaff={handleDeleteAppointmentStaff}
        staffContingent={staffContingent}
        currentBillingPeriodStaff={currentBillingPeriodStaff}
        handleManageContingentStaff={handleManageContingentStaff}
        handleCreateNewAppointmentStaff={handleCreateNewAppointmentStaff}
      />

      {showAddAppointmentModalStaff && (
        <AddAppointmentModalStaff
          isOpen={showAddAppointmentModalStaff}
          onClose={() => setShowAddAppointmentModalStaff(false)}
          appointmentTypesStaff={appointmentTypesStaff}
          onSubmit={handleAddAppointmentSubmitStaff}
          setIsNotifyStaffOpen={setIsNotifyMemberOpenStaff}
          setNotifyActionStaff={setNotifyActionStaff}
          freeAppointmentsStaff={freeAppointmentsStaff}
        />
      )}

      {showSelectedAppointmentModalStaff && selectedAppointmentDataStaff && (
        <EditAppointmentModalStaff
          selectedAppointmentStaff={selectedAppointmentDataStaff}
          setSelectedAppointmentStaff={setSelectedAppointmentDataStaff}
          appointmentTypesStaff={appointmentTypesStaff}
          freeAppointmentsStaff={freeAppointmentsStaff}
          handleAppointmentChangeStaff={handleAppointmentChangeStaff}
          appointmentsStaff={appointmentsStaff}
          setAppointmentsStaff={setAppointmentsStaff}
          setIsNotifyStaffOpen={setIsNotifyMemberOpenStaff}
          setNotifyActionStaff={setNotifyActionStaff}
          onDelete={handleDeleteAppointmentStaff}
        />
      )}

      <ContingentModalStaff
        showContingentModalStaff={showContingentModalStaff}
        setShowContingentModalStaff={setShowContingentModalStaff}
        selectedMemberForAppointmentsStaff={selectedMemberForEdit}
        getBillingPeriodsStaff={getBillingPeriodsStaff}
        selectedBillingPeriodStaff={selectedBillingPeriodStaff}
        handleBillingPeriodChangeStaff={handleBillingPeriodChangeStaff}
        setShowAddBillingPeriodModalStaff={setShowAddBillingPeriodModalStaff}
        currentBillingPeriodStaff={currentBillingPeriodStaff}
        tempContingentStaff={tempContingentStaff}
        setTempContingentStaff={setTempContingentStaff}
        handleSaveContingentStaff={handleSaveContingentStaff}
      />

<AddBillingPeriodModalStaff
        open={showAddBillingPeriodModalStaff}
        newBillingPeriodStaff={newBillingPeriodStaff}
        setNewBillingPeriodStaff={setNewBillingPeriodStaff}
        onClose={() => setShowAddBillingPeriodModalStaff(false)}
        onAdd={handleAddBillingPeriodStaff}
      /> */}

      {/* end ----- */}








      {/* contract related modal */}
      {/* start */}
      <ContractsModal
        isOpen={isContractsModalOpen}
        onClose={() => setIsContractsModalOpen(false)}
        selectedStudio={selectedStudioForModal}
        studioContracts={studioContracts}
        handleFileUpload={handleFileUpload}
        handleDownloadFile={handleDownloadFile}
        onViewDetails={handleViewContractDetails}
        handleViewContractHistory={handleViewContractHistory} // Add this prop
      />

      <ContractDetailsModal
        isOpen={isContractDetailsModalOpen}
        onClose={() => setIsContractDetailsModalOpen(false)}
        contract={selectedItemForDetails}
      />

      {isContractHistoryModalOpen && selectedContractForHistory && (
        <ContractHistoryModal
          contract={selectedContractForHistory}
          history={contractHistory[selectedStudioForModal?.id] || []} // Use studio ID for history
          onClose={() => {
            setIsContractHistoryModalOpen(false)
            setSelectedContractForHistory(null)
          }}
        />
      )}
      {/* end ----- */}

      {/* Main Studio related Modals */}
      {/* start  */}
      <EditStudioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedStudio={selectedStudio}
        editForm={editForm}
        setEditForm={setEditForm}
        handleInputChange={handleInputChange}
        handleEditSubmit={handleEditSubmit}
        DefaultStudioImage={DefaultStudioImage}
      />

      <StudioDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => setIsViewDetailsModalOpen(false)}
        studio={selectedStudio}
        franchises={franchises}
        studioStats={studioStats}
        DefaultStudioImage={DefaultStudioImage}
        isContractExpiringSoon={isContractExpiringSoon}
        onEditStudio={handleEditStudio}
        onGoToContract={handleGoToContract}
        onViewFranchiseDetails={handleViewFranchiseDetails}
      />

      <StudioHistoryModalMain
        show={showHistory}
        studio={selectedStudio}
        studioHistoryMain={studioHistoryMainData}
        historyTabMain={historyTabMain}
        setHistoryTabMain={setHistoryTabMain}
        onClose={() => {
          setShowHistory(false)
          setSelectedStudio(null)
        }}
      />
      {/* Create/Edit Franchise Modal */}
      <FranchiseModal
        isCreateModalOpen={isCreateFranchiseModalOpen}
        isEditModalOpen={isEditFranchiseModalOpen}
        onClose={handleCloseModal}
        franchiseForm={franchiseForm}
        onInputChange={handleFranchiseInputChange}
        onSubmit={handleFranchiseSubmit}
        onLogoUpload={handleLogoUpload}
        onArchive={handleArchiveFranchise}
        selectedFranchise={selectedFranchise}
      />

      {/* Franchise Details Modal */}
      <FranchiseDetailsModal
        isOpen={isFranchiseDetailsModalOpen}
        onClose={() => setIsFranchiseDetailsModalOpen(false)}
        franchise={selectedFranchise}
        onEditFranchise={handleEditFranchise}
        assignedStudios={selectedFranchise ? getStudiosByFranchise(selectedFranchise.id) : []}
        onArchiveFranchise={handleArchiveFranchise}
      />

      {/* Assign Studio to Franchise Modal */}
      <AssignStudioModal
        isOpen={isAssignStudioModalOpen}
        onClose={handleAssignStudioCloseModal}
        franchises={franchises}
        selectedFranchiseForAssignment={selectedFranchiseForAssignment}
        onFranchiseSelect={setSelectedFranchiseForAssignment}
        unassignedStudios={getFilteredUnassignedStudios()}
        onAssignStudio={handleAssignStudio}
        toast={toast}
        searchQuery={unassignedStudioSearchQuery}
        onSearchChange={setUnassignedStudioSearchQuery}
      />

      {/* Studio Management Modal */}
      <StudioManagementModal
        isOpen={isStudioManagementModalOpen}
        onClose={handleStudioManagementCloseModal}
        franchise={selectedFranchiseForManagement}
        assignedStudios={selectedFranchiseForManagement ? getStudiosByFranchise(selectedFranchiseForManagement.id) : []}
        unassignedStudios={getUnassignedStudios()}
        onAssignStudio={handleAssignStudio}
        onUnassignStudio={handleUnassignStudio}
        onEditStudio={handleEditStudio}
        toast={toast}
      />
      {/* end----- */}

      {/* sidebar related modals  */}
      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={() => {
          setIsEditing(!isEditing)
        }} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}
    </>
  )
}
