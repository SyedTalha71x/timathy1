"use client"
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Search,
  ChevronDown,
  Cake,
  Eye,
  FileText,
  Info,
  AlertTriangle,
  Calendar,
  History,
  MessageCircle,
  Edit3,
  Trash2,
  Archive,
  ArchiveRestore,
  UserPlus,
  Clock,
  Users,
  Filter,
  Lock,
  Plus,
  Grid3X3,
  List,
} from "lucide-react"
import DefaultAvatar from "../../public/default-avatar.avif"
import toast, { Toaster } from "react-hot-toast"
import AddAppointmentModal from "../components/appointments-components/add-appointment-modal"
import EditAppointmentModal from "../components/appointments-components/selected-appointment-modal"
import { IoIosMenu } from "react-icons/io"
import Avatar from "../../public/default-avatar.avif"
import Rectangle1 from "../../public/Rectangle 1.png"
import { useNavigate } from "react-router-dom"
import { SidebarArea } from "../components/custom-sidebar"

export default function Members() {
  const navigate = useNavigate()
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [activeTab, setActiveTab] = useState("details") // For View Details Modal
  const [tempMemberModalTab, setTempMemberModalTab] = useState("details") // For Create Temp Member Modal
  const [editModalTab, setEditModalTab] = useState("details") // For Edit Member Modal

  const [sortBy, setSortBy] = useState("alphabetical")
const [sortDirection, setSortDirection] = useState("asc") // 'asc' or 'desc'

const sortOptions = [
  { id: "alphabetical", label: "Alphabetical" },
  { id: "status", label: "Status" },
  { id: "relations", label: "Relations Count" },
  { id: "age", label: "Age" },
  { id: "expiring", label: "Contracts Expiring Soon" },
]


  // New states for enhanced functionality
  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false) // Combined filter modal
  const [memberTypeFilter, setMemberTypeFilter] = useState("all") // all, full, temporary
  const [archivedFilter, setArchivedFilter] = useState("active") // active, archived, all
  const [filterStatus, setFilterStatus] = useState("all") // For primary status filter (All, Active, Paused, Archived)

  // Calendar and Appointment states - Enhanced from communication
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")

  // Enhanced contingent management
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
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current")
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [newBillingPeriod, setNewBillingPeriod] = useState("")

  // Available billing periods
  const getBillingPeriods = (memberId) => {
    const memberData = memberContingent[memberId]
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

  // History states
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")

  // Relations states
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  const [memberRelations, setMemberRelations] = useState({
    1: {
      family: [
        { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
        { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
        { name: "Lisa Doe", relation: "Sister", id: 103, type: "manual" },
      ],
      friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }],
      relationship: [
        { name: "Marie Smith", relation: "Partner", id: 301, type: "member" },
        { name: "Julia Brown", relation: "Ex-Partner", id: 302, type: "manual" },
      ],
      work: [
        { name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" },
        { name: "Mr. Johnson", relation: "Boss", id: 402, type: "manual" },
      ],
      other: [{ name: "Mrs. Smith", relation: "Neighbor", id: 501, type: "manual" }],
    },
    2: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
  })

  // Temporary member form state
  const [tempMemberForm, setTempMemberForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    img: null,
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    autoArchivePeriod: 6, // weeks
    relations: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    }
  })
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

  const [viewMode, setViewMode] = useState("grid")

  const getRelationsCount = (memberId) => {
    const relations = memberRelations[memberId]
    if (!relations) return 0
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0)
  }

  // Enhanced appointment states from communication
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      date: "2025-03-15T10:00",
      status: "upcoming",
      type: "Consultation",
      memberId: 1,
      specialNote: {
        text: "First time client, needs introduction to equipment",
        isImportant: true,
        startDate: "2025-03-15",
        endDate: "2025-03-20",
      },
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      date: "2025-03-20T14:30",
      status: "upcoming",
      type: "Follow-up",
      memberId: 1,
    },
    {
      id: 3,
      title: "Annual Review",
      date: "2025-04-05T11:00",
      status: "upcoming",
      type: "Annual Review",
      memberId: 2,
    },
  ])
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Consultation", duration: 30, color: "bg-blue-700" },
    { name: "Follow-up", duration: 45, color: "bg-green-700" },
    { name: "Annual Review", duration: 60, color: "bg-purple-600" },
    { name: "Training", duration: 60, color: "bg-orange-600" },
    { name: "Assessment", duration: 90, color: "bg-red-600" },
  ])
  const [freeAppointments, setFreeAppointments] = useState([
    { id: 1, date: "2025-03-15", time: "9:00 AM" },
    { id: 2, date: "2025-03-15", time: "11:00 AM" },
    { id: 3, date: "2025-03-15", time: "2:00 PM" },
    { id: 4, date: "2025-03-20", time: "10:00 AM" },
    { id: 5, date: "2025-03-20", time: "1:30 PM" },
    { id: 6, date: "2025-04-05", time: "9:30 AM" },
    { id: 7, date: "2025-04-05", time: "3:00 PM" },
  ])

  // History data
  const [memberHistory, setMemberHistory] = useState({
    1: {
      general: [
        {
          id: 1,
          date: "2025-01-15",
          action: "Email updated",
          details: "Changed from old@email.com to john@example.com",
          user: "Admin",
        },
        { id: 2, date: "2025-01-10", action: "Phone updated", details: "Updated phone number", user: "Admin" },
      ],
      checkins: [
        { id: 1, date: "2025-01-20T09:30", type: "Check-in", location: "Main Entrance", user: "John Doe" },
        { id: 2, date: "2025-01-20T11:45", type: "Check-out", location: "Main Entrance", user: "John Doe" },
      ],
      appointments: [
        { id: 1, date: "2025-01-18T10:00", title: "Personal Training", status: "completed", trainer: "Mike Johnson" },
        { id: 2, date: "2025-01-15T14:30", title: "Consultation", status: "completed", trainer: "Sarah Wilson" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
        {
          id: 2,
          date: "2024-12-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        {
          id: 1,
          date: "2024-03-01",
          action: "Contract signed",
          details: "Initial 12-month membership contract",
          user: "Admin",
        },
        { id: 2, date: "2024-02-28", action: "Contract updated", details: "Extended contract duration", user: "Admin" },
      ],
    },
    2: {
      general: [],
      checkins: [],
      appointments: [],
      finance: [],
      contracts: [],
    },
  })

  // Available members/leads for relations
  const availableMembersLeads = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  // Relation options by category
  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  useEffect(() => {
    if (selectedMember) {
      setEditForm({
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        email: selectedMember.email,
        phone: selectedMember.phone,
        street: selectedMember.street,
        zipCode: selectedMember.zipCode,
        city: selectedMember.city,
        dateOfBirth: selectedMember.dateOfBirth,
        about: selectedMember.about,
        note: selectedMember.note,
        noteStartDate: selectedMember.noteStartDate,
        noteEndDate: selectedMember.noteEndDate,
        noteImportance: selectedMember.noteImportance,
        contractStart: selectedMember.contractStart,
        contractEnd: selectedMember.contractEnd,
      })
    }
  }, [selectedMember])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTempMemberInputChange = (e) => {
    const { name, value } = e.target
    setTempMemberForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const updatedMembers = members.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          ...editForm,
          title: `${editForm.firstName} ${editForm.lastName}`,
        }
      }
      return member
    })
    setMembers(updatedMembers)
    setIsEditModalOpen(false)
    setSelectedMember(null)
    toast.success("Member details have been updated successfully")
  }

  const handleCreateTempMember = (e) => {
    e.preventDefault()
    const newId = Math.max(...members.map((m) => m.id)) + 1
    const autoArchiveDate = new Date()
    autoArchiveDate.setDate(autoArchiveDate.getDate() + tempMemberForm.autoArchivePeriod * 7)
    const newTempMember = {
      id: newId,
      ...tempMemberForm,
      title: `${tempMemberForm.firstName} ${tempMemberForm.lastName}`,
      isActive: true,
      isArchived: false,
      memberType: "temporary",
      joinDate: new Date().toISOString().split("T")[0],
      contractStart: "",
      contractEnd: "",
      autoArchiveDate: autoArchiveDate.toISOString().split("T")[0],
      image: null,
    }
    setMembers((prev) => [...prev, newTempMember])
    setShowCreateTempMemberModal(false)
    setTempMemberForm({
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
      autoArchivePeriod: 6,
    })
    toast.success("Temporary member created successfully")
  }

  const handleArchiveMember = (memberId) => {
    const member = members.find(m => m.id === memberId)
    if (member && member.memberType === "temporary") {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId
            ? { ...member, isArchived: true, archivedDate: new Date().toISOString().split("T")[0] }
            : member,
        ),
      )
      toast.success("Temporary member archived successfully")
    } else {
      toast.error("Only temporary members can be archived")
    }
  }

  const handleUnarchiveMember = (memberId) => {
    const member = members.find(m => m.id === memberId)
    if (member && member.memberType === "temporary") {
      setMembers((prev) =>
        prev.map((member) => (member.id === memberId ? { ...member, isArchived: false, archivedDate: null } : member)),
      )
      toast.success("Temporary member unarchived successfully")
    } else {
      toast.error("Only temporary members can be unarchived")
    }
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

  const [members, setMembers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      title: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      image: null,
      reason: '',
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Allergic to peanuts",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1990-05-15",
      about: "Experienced developer with a passion for clean code.",
      joinDate: "2022-03-01",
      contractStart: "2022-03-01",
      contractEnd: "2023-03-01",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      title: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      street: "456 Oak St",
      zipCode: "67890",
      city: "Los Angeles",
      image: null,
      isActive: false,
      reason: 'Vacation Leaves',
      isArchived: false,
      memberType: "full",
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      dateOfBirth: "1985-08-22",
      about: "Certified PMP with 10 years of experience in IT project management.",
      joinDate: "2021-11-15",
      contractStart: "2021-11-15",
      contractEnd: "2024-04-15",
    },
  ])

  const filterOptions = [
    { id: "all", label: `All Members (${members.length})` },
    { id: "active", label: `Active Members (${members.filter((m) => m.isActive && !m.isArchived).length})` },
    { id: "paused", label: `Paused Members (${members.filter((m) => !m.isActive && !m.isArchived).length})` },
    { id: "archived", label: `Archived Members (${members.filter((m) => m.isArchived).length})` },
  ]


  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false
    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)
    return endDate <= oneMonthFromNow && endDate >= today
  }

const filteredAndSortedMembers = () => {
  let filtered = members.filter((member) => member.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Apply primary status filter (Active, Paused, Archived)
  if (filterStatus === "active") {
    filtered = filtered.filter((member) => member.isActive && !member.isArchived)
  } else if (filterStatus === "paused") {
    filtered = filtered.filter((member) => !member.isActive && !member.isArchived)
  } else if (filterStatus === "archived") {
    filtered = filtered.filter((member) => member.isArchived)
  }

  // Apply member type filter
  if (memberTypeFilter === "full") {
    filtered = filtered.filter((member) => member.memberType === "full")
  } else if (memberTypeFilter === "temporary") {
    filtered = filtered.filter((member) => member.memberType === "temporary")
  }

  // Apply sorting
  if (sortBy === "alphabetical") {
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortDirection === "asc" ? comparison : -comparison
    })
  } else if (sortBy === "status") {
    filtered.sort((a, b) => {
      // Priority: Active > Paused > Archived
      const getStatusPriority = (member) => {
        if (member.isArchived) return 3
        if (!member.isActive) return 2
        return 1
      }
      const comparison = getStatusPriority(a) - getStatusPriority(b)
      return sortDirection === "asc" ? comparison : -comparison
    })
  } else if (sortBy === "relations") {
    filtered.sort((a, b) => {
      const comparison = getRelationsCount(a.id) - getRelationsCount(b.id)
      return sortDirection === "asc" ? comparison : -comparison
    })
  } else if (sortBy === "age") {
    filtered.sort((a, b) => {
      const getAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }
      const comparison = getAge(a.dateOfBirth) - getAge(b.dateOfBirth)
      return sortDirection === "asc" ? comparison : -comparison
    })
  } else if (sortBy === "expiring") {
    filtered.sort((a, b) => {
      if (!a.contractEnd) return 1
      if (!b.contractEnd) return -1
      const comparison = new Date(a.contractEnd) - new Date(b.contractEnd)
      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  return filtered
}

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ])

  const handleFilterSelect = (filterId) => {
    setFilterStatus(filterId)
  }

  const handleSortSelect = (sortId) => {
    setSortBy(sortId)
    setIsSortDropdownOpen(false)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleEditMember = (member) => {
    setSelectedMember(member)
    setIsEditModalOpen(true)
    setEditModalTab("details") // Default to details tab when opening edit modal
  }

  const handleViewDetails = (member) => {
    setSelectedMember(member)
    setActiveTab("details") // Default to details tab when opening view details modal
    setIsViewDetailsModalOpen(true)
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

  const isBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()
  }

  const redirectToContract = () => {
    window.location.href = "/dashboard/contract"
  }


  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempMemberForm((prev) => ({ ...prev, img: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }


  // Enhanced Calendar functions from communication
  const handleCalendarClick = (member) => {
    setSelectedMemberForAppointments(member)
    setShowAppointmentModal(true)
  }

  const handleManageContingent = (memberId) => {
    const memberData = memberContingent[memberId]
    if (memberData) {
      setTempContingent(memberData.current)
      setSelectedBillingPeriod("current")
    } else {
      setTempContingent({ used: 0, total: 0 })
    }
    setShowContingentModal(true)
  }

  const handleBillingPeriodChange = (periodId) => {
    setSelectedBillingPeriod(periodId)
    const memberData = memberContingent[selectedMemberForAppointments.id]
    if (periodId === "current") {
      setTempContingent(memberData.current)
    } else {
      setTempContingent(memberData.future[periodId] || { used: 0, total: 0 })
    }
  }

  const handleSaveContingent = () => {
    if (selectedMemberForAppointments) {
      const updatedContingent = { ...memberContingent }
      if (selectedBillingPeriod === "current") {
        updatedContingent[selectedMemberForAppointments.id].current = { ...tempContingent }
      } else {
        if (!updatedContingent[selectedMemberForAppointments.id].future) {
          updatedContingent[selectedMemberForAppointments.id].future = {}
        }
        updatedContingent[selectedMemberForAppointments.id].future[selectedBillingPeriod] = { ...tempContingent }
      }
      setMemberContingent(updatedContingent)
      toast.success("Contingent updated successfully")
    }
    setShowContingentModal(false)
  }

  const handleAddBillingPeriod = () => {
    if (newBillingPeriod.trim() && selectedMemberForAppointments) {
      const updatedContingent = { ...memberContingent }
      if (!updatedContingent[selectedMemberForAppointments.id].future) {
        updatedContingent[selectedMemberForAppointments.id].future = {}
      }
      updatedContingent[selectedMemberForAppointments.id].future[newBillingPeriod] = { used: 0, total: 0 }
      setMemberContingent(updatedContingent)
      setNewBillingPeriod("")
      setShowAddBillingPeriodModal(false)
      toast.success("New billing period added successfully")
    }
  }

  // Enhanced appointment functions from communication
  const handleEditAppointment = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedMemberForAppointments?.title || "Member",
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentData(fullAppointment)
    setShowSelectedAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleCreateNewAppointment = () => {
    setShowAddAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointments.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForAppointments?.id,
    }
    setAppointments([...appointments, newAppointment])
    setShowAddAppointmentModal(false)
  }

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null)
    setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }


  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentData) {
      setSelectedAppointmentData({
        ...selectedAppointmentData,
        ...changes,
      })
    }
  }

  // History functions
  const handleHistoryClick = (member) => {
    setSelectedMember(member)
    setShowHistoryModal(true)
  }

  // Chat function
  const handleChatClick = (member) => {
    // Redirect to communications with member selected
    window.location.href = `/dashboard/communication`
  }

  // Relations functions
  const handleRelationClick = (member) => {
    setSelectedMember(member)
    setActiveTab("relations") // Directly open relations tab in View Details
    setIsViewDetailsModalOpen(true)
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

  // Get member appointments
  const getMemberAppointments = (memberId) => {
    return appointments.filter((app) => app.memberId === memberId)
  }

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
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
      <div className={`flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative  ${isRightSidebarOpen
        ? 'lg:mr-96 md:mr-96 sm:mr-96' // Adjust right margin when sidebar is open on larger screens
        : 'mr-0' // No margin when closed
        }`}>
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <div className="flex md:w-auto w-full items-center gap-3 justify-between">
              <h1 className="text-xl sm:text-2xl oxanium_font text-white">Members</h1>
              <div></div>
              <div className="md:hidden block">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
              <div className="flex items-center gap-1 bg-black rounded-xl p-1">
                <span className="text-xs text-gray-400 px-2">View</span>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  title="Grid View"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center md:flex-row flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCreateTempMemberModal(true)}
                className="md:w-auto w-full justify-center flex items-center gap-2 px-4 py-2 bg-gray-700 cursor-pointer  hover:bg-gray-700 text-white rounded-xl text-sm"
              >
                <UserPlus size={16} />
                Create Temp Member
              </button>
              {/* Combined Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="md:w-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
              >
                <Filter size={16} />
                Filter
              </button>
              <div className="relative sort-dropdown flex-1 sm:flex-none">
  <button
    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
    className={`md:w-auto w-full flex cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
  >
    <span className="truncate">
      Sort: {sortOptions.find((opt) => opt.id === sortBy)?.label} 
      {sortDirection === "asc" ? " ↑" : " ↓"}
    </span>
    <ChevronDown
      size={16}
      className={`transform transition-transform flex-shrink-0 ${isSortDropdownOpen ? "rotate-180" : ""}`}
    />
  </button>
  {isSortDropdownOpen && (
    <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
      {sortOptions.map((option) => (
        <div key={option.id}>
          <button
            onClick={() => {
              setSortBy(option.id)
              setSortDirection("asc")
              setIsSortDropdownOpen(false)
            }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] flex items-center justify-between ${option.id === sortBy && sortDirection === "asc" ? "bg-[#000000]" : ""}`}
          >
            <span>{option.label}</span>
            <span className="text-gray-400">↑</span>
          </button>
          <button
            onClick={() => {
              setSortBy(option.id)
              setSortDirection("desc")
              setIsSortDropdownOpen(false)
            }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] flex items-center justify-between ${option.id === sortBy && sortDirection === "desc" ? "bg-[#000000]" : ""}`}
          >
            <span>{option.label}</span>
            <span className="text-gray-400">↓</span>
          </button>
        </div>
      ))}
    </div>
  )}
</div>
              <div className="md:block hidden">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
            </div>
          </div>
          <SidebarArea
            isOpen={isRightSidebarOpen}
            onClose={closeSidebar}
            communications={communications}
            todos={todos}
            birthdays={birthdays}
            customLinks={customLinks}
            setCustomLinks={setCustomLinks}
            redirectToCommunication={redirectToCommunication}
            redirectToTodos={redirectToTodos}
            toggleDropdown={toggleDropdown}
            openDropdownIndex={openDropdownIndex}
            setEditingLink={setEditingLink}
          />

          {/* Overlay for mobile screens only */}
          {isRightSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Combined Filter Modal */}
          {showFilterModal && (
  <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
    <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white open_sans_font_700 text-lg font-semibold">Filter Members</h2>
          <button
            onClick={() => setShowFilterModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} className="cursor-pointer" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Primary Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Member Status</label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilterStatus(option.id)}
                  className={`w-full px-4 py-2 text-left text-sm rounded-xl border transition-colors ${
                    option.id === filterStatus
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-[#101010] border-slate-300/30 text-white hover:bg-[#2F2F2F]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Member Type</label>
                <select
                  value={memberTypeFilter}
                  onChange={(e) => setMemberTypeFilter(e.target.value)}
                  className="w-full bg-[#101010] text-white rounded-xl px-4 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="full">Full Members (with contract)</option>
                  <option value="temporary">Temporary Members (without contract)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowFilterModal(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<div className="flex flex-col space-y-4 mb-6">
  <div className="flex gap-3">
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#101010] pl-10 pr-4 py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
      />
    </div>
  </div>
</div>


          {/* Create Temporary Member Modal */}
          {showCreateTempMemberModal && (
            <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
              <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white open_sans_font_700 text-lg font-semibold">Create Temporary Member</h2>
                    <button
                      onClick={() => setShowCreateTempMemberModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} className="cursor-pointer" />
                    </button>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="text-yellow-500 " size={50} />
                      <div>
                        <p className="text-yellow-200 text-sm font-medium mb-1">Temporary Member Information</p>
                        <p className="text-yellow-300/80 text-xs">
                          Temporary members are members without a contract and are not included in payment runs. They
                          will be automatically archived after the specified period.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation for Create Temp Member */}
                  <div className="flex border-b border-gray-700 mb-6">
                    <button
                      onClick={() => setTempMemberModalTab("details")}
                      className={`px-4 py-2 text-sm font-medium ${tempMemberModalTab === "details"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setTempMemberModalTab("note")}
                      className={`px-4 py-2 text-sm font-medium ${tempMemberModalTab === "note"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Special Note
                    </button>
                    <button
                      onClick={() => setTempMemberModalTab("relations")}
                      className={`px-4 py-2 text-sm font-medium ${tempMemberModalTab === "relations"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Relations
                    </button>
                  </div>

                  <form
                    onSubmit={handleCreateTempMember}
                    className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]"
                  >
                    {tempMemberModalTab === "details" && (
                      <>
                        <div className="flex flex-col items-start">
                                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                                    <img
                                      src={tempMemberForm.img || Avatar}
                                      alt="Profile"
                                      width={96}
                                      height={96}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" id="avatar-upload" />
                                  <label
                                    htmlFor="avatar-upload"
                                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
                                  >
                                    Upload picture
                                  </label>
                                </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={tempMemberForm.firstName}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={tempMemberForm.lastName}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={tempMemberForm.email}
                            onChange={handleTempMemberInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={tempMemberForm.phone}
                            onChange={handleTempMemberInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Street</label>
                          <input
                            type="text"
                            name="street"
                            value={tempMemberForm.street}
                            onChange={handleTempMemberInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={tempMemberForm.zipCode}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={tempMemberForm.city}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={tempMemberForm.dateOfBirth}
                            onChange={handleTempMemberInputChange}
                            className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">About</label>
                          <textarea
                            name="about"
                            value={tempMemberForm.about}
                            onChange={handleTempMemberInputChange}
                            className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Auto-Archive Period (weeks)</label>
                          <input
                            type="number"
                            name="autoArchivePeriod"
                            value={tempMemberForm.autoArchivePeriod}
                            onChange={handleTempMemberInputChange}
                            min="1"
                            max="52"
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Member will be automatically archived after this period
                          </p>
                        </div>
                     
                      </>
                    )}

                    {tempMemberModalTab === "note" && (
                      <div className="border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm text-gray-200 font-medium">Special Note</label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="tempNoteImportance"
                              checked={tempMemberForm.noteImportance === "important"}
                              onChange={(e) => {
                                setTempMemberForm({
                                  ...tempMemberForm,
                                  noteImportance: e.target.checked ? "important" : "unimportant",
                                })
                              }}
                              className="mr-2 h-4 w-4 accent-[#FF843E]"
                            />
                            <label htmlFor="tempNoteImportance" className="text-sm text-gray-200">
                              Important
                            </label>
                          </div>
                        </div>
                        <textarea
                          name="note"
                          value={tempMemberForm.note}
                          onChange={handleTempMemberInputChange}
                          className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                          placeholder="Enter special note..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                            <input
                              type="date"
                              name="noteStartDate"
                              value={tempMemberForm.noteStartDate}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">End Date</label>
                            <input
                              type="date"
                              name="noteEndDate"
                              value={tempMemberForm.noteEndDate}
                              onChange={handleTempMemberInputChange}
                              className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

{tempMemberModalTab === "relations" && (
  <div className="border border-slate-700 rounded-xl p-4">
    <div className="flex items-center justify-between mb-4">
      <label className="text-sm text-gray-200 font-medium">Relations</label>
      <button
        type="button"
        onClick={() => setEditingRelations(!editingRelations)}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        {editingRelations ? "Done" : "Edit"}
      </button>
    </div>
    {editingRelations && (
      <div className="mb-4 p-3 bg-[#101010] rounded-xl">
        <div className="grid grid-cols-1 gap-2 mb-2">
          <select
            value={newRelation.type}
            onChange={(e) => {
              const type = e.target.value
              setNewRelation({ ...newRelation, type, name: "", selectedMemberId: null })
            }}
            className="bg-[#222] text-white rounded px-3 py-2 text-sm"
          >
            <option value="manual">Manual Entry</option>
            <option value="member">Select Member</option>
            <option value="lead">Select Lead</option>
          </select>
          {newRelation.type === "manual" ? (
            <input
              type="text"
              placeholder="Name"
              value={newRelation.name}
              onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
              className="bg-[#222] text-white rounded px-3 py-2 text-sm"
            />
          ) : (
            <select
              value={newRelation.selectedMemberId || ""}
              onChange={(e) => {
                const selectedId = e.target.value
                const selectedPerson = availableMembersLeads.find(
                  (p) => p.id.toString() === selectedId,
                )
                setNewRelation({
                  ...newRelation,
                  selectedMemberId: selectedId,
                  name: selectedPerson ? selectedPerson.name : "",
                })
              }}
              className="bg-[#222] text-white rounded px-3 py-2 text-sm"
            >
              <option value="">Select {newRelation.type}</option>
              {availableMembersLeads
                .filter((p) => p.type === newRelation.type)
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.type})
                  </option>
                ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={newRelation.category}
            onChange={(e) =>
              setNewRelation({ ...newRelation, category: e.target.value, relation: "" })
            }
            className="bg-[#222] text-white rounded px-3 py-2 text-sm"
          >
            <option value="family">Family</option>
            <option value="friendship">Friendship</option>
            <option value="relationship">Relationship</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <select
            value={newRelation.relation}
            onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
            className="bg-[#222] text-white rounded px-3 py-2 text-sm"
          >
            <option value="">Select Relation</option>
            {relationOptions[newRelation.category]?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!newRelation.name || !newRelation.relation) {
              toast.error("Please fill in all fields")
              return
            }
            // Add relation to tempMemberForm instead of memberRelations
            const relationId = Date.now()
            const newRel = {
              id: relationId,
              name: newRelation.name,
              relation: newRelation.relation,
              type: newRelation.type,
            }
            
            // Initialize relations if not exists
            if (!tempMemberForm.relations) {
              setTempMemberForm(prev => ({
                ...prev,
                relations: {
                  family: [],
                  friendship: [],
                  relationship: [],
                  work: [],
                  other: [],
                }
              }))
            }
            
            // Add the new relation
            setTempMemberForm(prev => ({
              ...prev,
              relations: {
                ...prev.relations,
                [newRelation.category]: [...(prev.relations?.[newRelation.category] || []), newRel]
              }
            }))
            
            setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
            toast.success("Relation added successfully")
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
        >
          Add Relation
        </button>
      </div>
    )}
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {tempMemberForm.relations &&
        Object.entries(tempMemberForm.relations).map(([category, relations]) =>
          relations.map((relation) => (
            <div
              key={relation.id}
              className="flex items-center justify-between bg-[#101010] rounded px-3 py-2"
            >
              <div className="text-sm">
                <span className="text-white">{relation.name}</span>
                <span className="text-gray-400 ml-2">({relation.relation})</span>
                <span className="text-blue-400 ml-2 capitalize">- {category}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    relation.type === "member"
                      ? "bg-green-600 text-green-100"
                      : relation.type === "lead"
                        ? "bg-blue-600 text-blue-100"
                        : "bg-gray-600 text-gray-100"
                  }`}
                >
                  {relation.type}
                </span>
              </div>
              {editingRelations && (
                <button
                  type="button"
                  onClick={() => {
                    // Remove relation from tempMemberForm
                    setTempMemberForm(prev => ({
                      ...prev,
                      relations: {
                        ...prev.relations,
                        [category]: prev.relations[category].filter(rel => rel.id !== relation.id)
                      }
                    }))
                    toast.success("Relation deleted successfully")
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )),
        )}
      {(!tempMemberForm.relations || Object.values(tempMemberForm.relations).every(arr => arr.length === 0)) && (
        <div className="text-gray-500 text-sm text-center py-4">
          No relations added yet
        </div>
      )}
    </div>
  </div>
)}
                    <button
                      type="submit"
                      className="w-full bg-gray-700 text-white rounded-xl py-2 text-sm cursor-pointer"
                    >
                      Create Temporary Member
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Member Modal */}
          {isEditModalOpen && selectedMember && (
            <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
              <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Member</h2>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false)
                        setSelectedMember(null)
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} className="cursor-pointer" />
                    </button>
                  </div>

                  {/* Tab Navigation for Edit Member */}
                  <div className="flex border-b border-gray-700 mb-6">
                    <button
                      onClick={() => setEditModalTab("details")}
                      className={`px-4 py-2 text-sm font-medium ${editModalTab === "details"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setEditModalTab("note")}
                      className={`px-4 py-2 text-sm font-medium ${editModalTab === "note"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Special Note
                    </button>
                    <button
                      onClick={() => setEditModalTab("relations")}
                      className={`px-4 py-2 text-sm font-medium ${editModalTab === "relations"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      Relations
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                    {editModalTab === "details" && (
                      <>
                        <div className="flex flex-col items-start">
                          <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                            <img
                              src={selectedMember.image || DefaultAvatar}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                toast.success("Avatar selected successfully")
                              }
                            }}
                          />
                          <label
                            htmlFor="avatar"
                            className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                          >
                            Update picture
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={editForm.firstName}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={editForm.lastName}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Street</label>
                          <input
                            type="text"
                            name="street"
                            value={editForm.street}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={editForm.zipCode}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={editForm.city}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editForm.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">About</label>
                          <textarea
                            name="about"
                            value={editForm.about}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    {editModalTab === "note" && (
                      <div className="border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm text-gray-200 font-medium">Special Note</label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="editNoteImportance"
                              checked={editForm.noteImportance === "important"}
                              onChange={(e) => {
                                setEditForm({
                                  ...editForm,
                                  noteImportance: e.target.checked ? "important" : "unimportant",
                                })
                              }}
                              className="mr-2 h-4 w-4 accent-[#FF843E]"
                            />
                            <label htmlFor="editNoteImportance" className="text-sm text-gray-200">
                              Important
                            </label>
                          </div>
                        </div>
                        <textarea
                          name="note"
                          value={editForm.note}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                          placeholder="Enter special note..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                            <input
                              type="date"
                              name="noteStartDate"
                              value={editForm.noteStartDate}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-200 block mb-2">End Date</label>
                            <input
                              type="date"
                              name="noteEndDate"
                              value={editForm.noteEndDate}
                              onChange={handleInputChange}
                              className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {editModalTab === "relations" && (
                      <div className="border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm text-gray-200 font-medium">Relations</label>
                          <button
                            type="button"
                            onClick={() => setEditingRelations(!editingRelations)}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            {editingRelations ? "Done" : "Edit"}
                          </button>
                        </div>
                        {editingRelations && (
                          <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                            <div className="grid grid-cols-1 gap-2 mb-2">
                              <select
                                value={newRelation.type}
                                onChange={(e) => {
                                  const type = e.target.value
                                  setNewRelation({ ...newRelation, type, name: "", selectedMemberId: null })
                                }}
                                className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                              >
                                <option value="manual">Manual Entry</option>
                                <option value="member">Select Member</option>
                                <option value="lead">Select Lead</option>
                              </select>
                              {newRelation.type === "manual" ? (
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={newRelation.name}
                                  onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                                  className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                                />
                              ) : (
                                <select
                                  value={newRelation.selectedMemberId || ""}
                                  onChange={(e) => {
                                    const selectedId = e.target.value
                                    const selectedPerson = availableMembersLeads.find(
                                      (p) => p.id.toString() === selectedId,
                                    )
                                    setNewRelation({
                                      ...newRelation,
                                      selectedMemberId: selectedId,
                                      name: selectedPerson ? selectedPerson.name : "",
                                    })
                                  }}
                                  className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                                >
                                  <option value="">Select {newRelation.type}</option>
                                  {availableMembersLeads
                                    .filter((p) => p.type === newRelation.type)
                                    .map((person) => (
                                      <option key={person.id} value={person.id}>
                                        {person.name} ({person.type})
                                      </option>
                                    ))}
                                </select>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <select
                                value={newRelation.category}
                                onChange={(e) =>
                                  setNewRelation({ ...newRelation, category: e.target.value, relation: "" })
                                }
                                className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                              >
                                <option value="family">Family</option>
                                <option value="friendship">Friendship</option>
                                <option value="relationship">Relationship</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                              </select>
                              <select
                                value={newRelation.relation}
                                onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
                                className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                              >
                                <option value="">Select Relation</option>
                                {relationOptions[newRelation.category]?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddRelation}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                            >
                              Add Relation
                            </button>
                          </div>
                        )}
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedMember &&
                            memberRelations[selectedMember.id] &&
                            Object.entries(memberRelations[selectedMember.id]).map(([category, relations]) =>
                              relations.map((relation) => (
                                <div
                                  key={relation.id}
                                  className="flex items-center justify-between bg-[#101010] rounded px-3 py-2"
                                >
                                  <div className="text-sm">
                                    <span className="text-white">{relation.name}</span>
                                    <span className="text-gray-400 ml-2">({relation.relation})</span>
                                    <span className="text-blue-400 ml-2 capitalize">- {category}</span>
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
                                  {editingRelations && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRelation(category, relation.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              )),
                            )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer"
                      >
                        Save Changes
                      </button>
                      {selectedMember && selectedMember.memberType === "temporary" && (
  <button
    type="button"
    onClick={() => {
      if (selectedMember.isArchived) {
        handleUnarchiveMember(selectedMember.id)
      } else {
        handleArchiveMember(selectedMember.id)
      }
      setIsEditModalOpen(false)
    }}
    className={`px-4 py-2 rounded-xl text-sm ${selectedMember.isArchived
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
      }`}
  >
    {selectedMember.isArchived ? (
      <>
        <ArchiveRestore size={16} className="inline mr-1" />
        Unarchive
      </>
    ) : (
      <>
        <Archive size={16} className="inline mr-1" />
        Archive
      </>
    )}
  </button>
)}

                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className={`open_sans_font ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols- gap-4" : "flex flex-col gap-3"
            }`}
          >



            <div className="bg-black rounded-xl open_sans_font p-4">
              {filteredAndSortedMembers().length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedMembers().map((member) => (
                    <div key={member.id} className="bg-[#161616] rounded-xl p-6 relative">
                      {member.note && (
                        <div className="absolute p-2 top-0 left-0 z-10">
                          <div className="relative">
                            <div
                              className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveNoteId(activeNoteId === member.id ? null : member.id)
                              }}
                            >
                              {member.noteImportance === "important" ? (
                                <AlertTriangle size={18} className="text-white" />
                              ) : (
                                <Info size={18} className="text-white" />
                              )}
                            </div>
                            {activeNoteId === member.id && (
                              <div
                                ref={notePopoverRef}
                                className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
                              >
                                <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                                  {member.noteImportance === "important" ? (
                                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                                  ) : (
                                    <Info className="text-blue-500 shrink-0" size={18} />
                                  )}
                                  <h4 className="text-white flex gap-1 items-center font-medium">
                                    <div>Special Note</div>
                                    <div className="text-sm text-gray-400">
                                      {member.noteImportance === "important" ? "(Important)" : "(Unimportant)"}
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
                                  <p className="text-white text-sm leading-relaxed">{member.note}</p>
                                  {member.noteStartDate && member.noteEndDate && (
                                    <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                                      <p className="text-xs text-gray-300">
                                        Valid from {member.noteStartDate} to {member.noteEndDate}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                          <img
                            src={member.image || DefaultAvatar}
                            className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0 object-cover"
                            alt=""
                          />
                          <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                            <h3 className="text-white font-medium truncate text-lg sm:text-base">
  {member.title}
  {member.dateOfBirth && ` (${calculateAge(member.dateOfBirth)})`}
</h3>

                              <div className="flex items-center gap-2">
                                {member.isArchived ? (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                                    Archived
                                  </span>
                                ) : (
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
                                      }`}
                                  >
                                    {member.isActive
                                      ? "Active"
                                      : `Paused${member.reason ? ` (${member.reason})` : ""}`}
                                  </span>
                                )}

                                {isBirthday(member.dateOfBirth) && <Cake size={16} className="text-yellow-500" />}
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left flex items-center">
                              {member.memberType === "full" ? (
                                <>
                                  Contract: {member.contractStart} -{" "}
                                  <span className={isContractExpiringSoon(member.contractEnd) ? "text-red-500" : ""}>
                                    {member.contractEnd}
                                  </span>
                                  {isContractExpiringSoon(member.contractEnd) && (
                                    <Info size={16} className="text-red-500 ml-1" />
                                  )}
                                </>
                              ) : (
                                <>
                                  No Contract - Auto-archive: {member.autoArchiveDate}
                                  {member.autoArchiveDate && new Date(member.autoArchiveDate) <= new Date() && (
                                    <Clock size={16} className="text-orange-500 ml-1" />
                                  )}
                                </>
                              )}
                            </p>
                            <div className="md:text-md mt-1 text-sm flex items-center gap-1">


                              <p>Member Type:</p>

                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${member.memberType === "full"
                                  ? "bg-blue-900 text-blue-300"
                                  : "bg-purple-900 text-purple-300"
                                  }`}
                              >
                                {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                              </span>
                            </div>
                            {/* Relations button always displayed */}
                            <div className="mt-2">
                              <button
                                onClick={() => handleRelationClick(member)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <Users size={12} />
                                Relations ({Object.values(memberRelations[member.id] || {}).flat().length})
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end gap-2 lg:flex-row md:flex-row flex-col mt-4 sm:mt-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleCalendarClick(member)}
                            className="text-white md:w-auto w-full  bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            title="View Appointments"
                          >
                            <Calendar size={16} />
                          </button>
                          <button
                            onClick={() => handleHistoryClick(member)}
                            className="text-white md:w-auto w-full  bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            title="View History"
                          >
                            <History size={16} />
                          </button>
                          <button
                            onClick={() => handleChatClick(member)}
                            className="text-white md:w-auto w-full  bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            title="Start Chat"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleViewDetails(member)}
                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm w-full sm:w-auto"
                          >
                            Edit
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
                      ? "No active members found."
                      : filterStatus === "paused"
                        ? "No paused members found."
                        : filterStatus === "archived"
                          ? "No archived members found."
                          : "No members found."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {isViewDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
                <button
                  onClick={() => {
                    setIsViewDetailsModalOpen(false)
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
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "details"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                    }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("note")}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "note" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                    }`}
                >
                  Special Note
                </button>
                <button
                  onClick={() => setActiveTab("relations")}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "relations"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                    }`}
                >
                  Relations
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === "details" && (
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
                      {selectedMember.memberType === "full" && (
  <div className="mt-2 p-2 bg-blue-900/20 border border-blue-600/30 rounded-lg">
    <p className="text-blue-200 text-xs flex items-center gap-1">
      <Info size={12} />
      Full members with contracts cannot be archived. Only temporary members can be archived.
    </p>
  </div>
)}
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
                    <button
                      onClick={() => {
                        setIsViewDetailsModalOpen(false)
                        handleEditMember(selectedMember)
                      }}
                      className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                    >
                      Edit Member
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "note" && (
                <div className="space-y-4 text-white">
                  <h3 className="text-lg font-semibold mb-4">Special Note</h3>
                  {selectedMember.note ? (
                    <div className="border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        {selectedMember.noteImportance === "important" ? (
                          <AlertTriangle className="text-yellow-500" size={20} />
                        ) : (
                          <Info className="text-blue-500" size={20} />
                        )}
                        <p className="font-medium">
                          {selectedMember.noteImportance === "important" ? "Important Note" : "General Note"}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed">{selectedMember.note}</p>
                      {selectedMember.noteStartDate && selectedMember.noteEndDate && (
                        <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                          <p className="text-xs text-gray-300">
                            Valid from {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">No special note for this member.</div>
                  )}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        setIsViewDetailsModalOpen(false)
                        handleEditMember(selectedMember)
                        setEditModalTab("note") // Open edit modal to note tab
                      }}
                      className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                    >
                      Edit Note
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "relations" && (
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
                                        // Handle click for member/lead relations
                                        toast.info(`Clicked on ${relation.name} (${relation.type})`)
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
                                      toast.info(`Clicked on ${relation.name} (${relation.type})`)
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
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        setIsViewDetailsModalOpen(false)
                        handleEditMember(selectedMember)
                        setEditModalTab("relations") // Open edit modal to relations tab
                      }}
                      className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                    >
                      Edit Relations
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Appointment Modal from Communication */}
      {showAppointmentModal && selectedMemberForAppointments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">{selectedMemberForAppointments.title}'s Appointments</h2>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false)
                    setSelectedMemberForAppointments(null)
                  }}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                {getMemberAppointments(selectedMemberForAppointments.id).length > 0 ? (
                  getMemberAppointments(selectedMemberForAppointments.id).map((appointment) => {
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
                              className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAppointment(appointment.id)
                              }}
                              className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                            >
                              <Trash2 size={14} />
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
                  Contingent ({currentBillingPeriod}):{" "}
                  {memberContingent[selectedMemberForAppointments.id]?.current?.used || 0} /{" "}
                  {memberContingent[selectedMemberForAppointments.id]?.current?.total || 0}
                </div>
                <button
                  onClick={() => handleManageContingent(selectedMemberForAppointments.id)}
                  className="flex items-center gap-1 bg-gray-700 text-white hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                >
                  <Edit3 size={16} />
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
      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModal}
          onClose={() => setShowAddAppointmentModal(false)}
          appointmentTypes={appointmentTypes}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          freeAppointments={freeAppointments}
        />
      )}
      {/* Edit Appointment Modal */}
      {showSelectedAppointmentModal && selectedAppointmentData && (
        <EditAppointmentModal
          selectedAppointment={selectedAppointmentData}
          setSelectedAppointment={setSelectedAppointmentData}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={handleAppointmentChange}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointment}
        />
      )}
      {/* Enhanced Contingent Management Modal */}
      {showContingentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Manage Appointment Contingent</h2>
                <button
                  onClick={() => setShowContingentModal(false)}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Billing Period Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Billing Period</label>
                <div className="space-y-2">
                  {selectedMemberForAppointments &&
                    getBillingPeriods(selectedMemberForAppointments.id).map((period) => (
                      <button
                        key={period.id}
                        onClick={() => handleBillingPeriodChange(period.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedBillingPeriod === period.id
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-[#222222] border-gray-600 text-gray-300 hover:bg-[#2A2A2A]"
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{period.label}</span>
                          <span className="text-sm">
                            {period.data.used}/{period.data.total}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
                {/* Add New Billing Period Button */}
                <button
                  onClick={() => setShowAddBillingPeriodModal(true)}
                  className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Future Billing Period
                </button>
              </div>
              {/* Contingent Management */}
              <div className="space-y-4">
                <div className="bg-[#222222] rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">
                    {selectedBillingPeriod === "current"
                      ? `Current Period (${currentBillingPeriod})`
                      : `Future Period (${selectedBillingPeriod})`}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Used Appointments</label>
                      <input
                        type="number"
                        min={0}
                        max={tempContingent.total}
                        value={tempContingent.used}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, used: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#333333] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                        Total Appointments
                        {selectedBillingPeriod === "current" && (
                          <Lock size={14} className="text-gray-500" title="Locked for current period" />
                        )}
                      </label>
                      <input
                        type="number"
                        min={selectedBillingPeriod === "current" ? tempContingent.used : 0}
                        value={tempContingent.total}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, total: Number.parseInt(e.target.value) })
                        }
                        disabled={selectedBillingPeriod === "current"}
                        className={`w-full rounded-xl px-4 py-2 text-sm ${selectedBillingPeriod === "current"
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-[#333333] text-white"
                          }`}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-white font-medium">
                      {tempContingent.total - tempContingent.used} appointments
                    </span>
                  </div>
                </div>
                {selectedBillingPeriod === "current" && (
                  <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
                    <p className="text-yellow-200 text-sm flex items-center gap-2">
                      <Lock size={14} />
                      Total appointments are locked for the current billing period. You can only edit used appointments.
                    </p>
                  </div>
                )}
                {selectedBillingPeriod !== "current" && (
                  <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                    <p className="text-blue-200 text-sm flex items-center gap-2">
                      <Info size={14} />
                      You can edit both used and total appointments for future billing periods.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowContingentModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContingent}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Billing Period Modal */}
      {showAddBillingPeriodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Add Future Billing Period</h2>
                <button
                  onClick={() => setShowAddBillingPeriodModal(false)}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Billing Period (e.g., "07.14.25 - 07.18.2025")
                  </label>
                  <input
                    type="text"
                    value={newBillingPeriod}
                    onChange={(e) => setNewBillingPeriod(e.target.value)}
                    placeholder="MM.DD.YY - MM.DD.YYYY"
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                  <p className="text-blue-200 text-sm">
                    <Info className="inline mr-1" size={14} />
                    New billing periods will start with 0 used appointments and 0 total appointments. You can edit these
                    values after creation.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setShowAddBillingPeriodModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBillingPeriod}
                  disabled={!newBillingPeriod.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm"
                >
                  Add Period
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* History Modal */}
      {showHistoryModal && selectedMember && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
    <div className="bg-[#181818] rounded-xl text-white p-3 sm:p-4 md:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">
          History - {selectedMember.firstName} {selectedMember.lastName}
        </h2>
        <button onClick={() => setShowHistoryModal(false)} className="text-gray-300 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      {/* Mobile: Vertical tabs, Desktop: Horizontal tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-1 space-y-1 sm:space-y-0 bg-[#141414] rounded-lg p-1">
          <button
            onClick={() => setHistoryTab("general")}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${historyTab === "general" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
          >
            General Changes
          </button>
          <button
            onClick={() => setHistoryTab("checkins")}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${historyTab === "checkins" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
          >
            Check-ins & Check-outs
          </button>
          <button
            onClick={() => setHistoryTab("appointments")}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${historyTab === "appointments" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
          >
            Past Appointments
          </button>
          <button
            onClick={() => setHistoryTab("finance")}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${historyTab === "finance" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
          >
            Finance Transactions
          </button>
          <button
            onClick={() => setHistoryTab("contracts")}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${historyTab === "contracts" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
          >
            Contract Changes
          </button>
        </div>
      </div>
      
      <div className="bg-[#141414] rounded-xl p-3 sm:p-4">
        {historyTab === "general" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">General Changes</h3>
            <div className="space-y-3">
              {memberHistory[selectedMember.id]?.general?.map((change) => (
                <div key={change.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm sm:text-base">{change.action}</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {change.date} by {change.user}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="text-gray-300">{change.details}</p>
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No general changes recorded</p>}
            </div>
          </div>
        )}
        
        {historyTab === "checkins" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Check-ins & Check-outs</h3>
            <div className="space-y-3">
              {memberHistory[selectedMember.id]?.checkins?.map((activity) => (
                <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <p className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                        <span
                          className={`w-2 h-2 rounded-full ${activity.type === "Check-in" ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></span>
                        {activity.type}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {new Date(activity.date).toLocaleDateString()} at{" "}
                        {new Date(activity.date).toLocaleTimeString()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300">Location: {activity.location}</p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No check-in/check-out history</p>}
            </div>
          </div>
        )}
        
        {historyTab === "appointments" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Past Appointments</h3>
            <div className="space-y-3">
              {memberHistory[selectedMember.id]?.appointments?.map((appointment) => (
                <div key={appointment.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm sm:text-base">{appointment.title}</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {new Date(appointment.date).toLocaleDateString()} at{" "}
                        {new Date(appointment.date).toLocaleTimeString()} with {appointment.trainer}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs self-start sm:self-auto ${appointment.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 text-white"
                        }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No past appointments</p>}
            </div>
          </div>
        )}
        
        {historyTab === "finance" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Finance Transactions</h3>
            <div className="space-y-3">
              {memberHistory[selectedMember.id]?.finance?.map((transaction) => (
                <div key={transaction.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm sm:text-base">
                        {transaction.type} - {transaction.amount}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">{transaction.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs self-start sm:self-auto ${transaction.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 text-white"
                        }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">{transaction.description}</p>
                </div>
              )) || <p className="text-gray-400 text-sm">No financial transactions</p>}
            </div>
          </div>
        )}
        
        {historyTab === "contracts" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contract Changes</h3>
            <div className="space-y-3">
              {memberHistory[selectedMember.id]?.contracts?.map((contract) => (
                <div key={contract.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm sm:text-base">{contract.action}</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {contract.date} by {contract.user}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">{contract.details}</p>
                </div>
              )) || <p className="text-gray-400 text-sm">No contract changes</p>}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setShowHistoryModal(false)}
        className="mt-4 sm:mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
      >
        Close
      </button>
    </div>
  </div>
)}
      {/* Notify Member Modal */}
      {isNotifyMemberOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Notify Member</h2>
                <button onClick={() => setIsNotifyMemberOpen(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {notifyAction === "book" && "Would you like to notify the member about their new appointment?"}
                {notifyAction === "change" && "Would you like to notify the member about changes to their appointment?"}
                {notifyAction === "delete" &&
                  "Would you like to notify the member that their appointment has been cancelled?"}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsNotifyMemberOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    toast.success("Member has been notified successfully!")
                    setIsNotifyMemberOpen(false)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-xl"
                >
                  Yes, Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
