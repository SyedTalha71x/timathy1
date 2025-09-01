/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Search,
  ChevronDown,
  Cake,
  Eye,
  Info,
  AlertTriangle,
  Calendar,
  History,
  MessageCircle,
  UserPlus,
  Clock,
  Users,
  Filter,
  Grid3X3,
  List,
  File,
  Dumbbell,
} from "lucide-react"
import DefaultAvatar from "../../../public/default-avatar.avif"
import toast, { Toaster } from "react-hot-toast"
import AddAppointmentModal from "../../components/appointments-components/add-appointment-modal"
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal"
import { IoIosMenu } from "react-icons/io"
import Avatar from "../../../public/default-avatar.avif"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { useNavigate } from "react-router-dom"
import { SidebarArea } from "../../components/custom-sidebar"
import HistoryModal from "../../components/user-panel-members-components/HistoryModal"
import NotifyMemberModal from "../../components/user-panel-members-components/NotifyMemberModal"
import CreateTempMemberModal from "../../components/user-panel-members-components/CreateTempMemberModal"
import EditMemberModal from "../../components/user-panel-members-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/user-panel-members-components/AddBillingPeriodModal"
import ContingentModal from "../../components/user-panel-members-components/ShowContigentModal"
import ViewDetailsModal from "../../components/user-panel-members-components/ViewDetailsModal"
import AppointmentModal from "../../components/user-panel-members-components/AppointmentModal"
import FilterModal from "../../components/user-panel-members-components/FilterModal"
import TrainingPlansModal from "../../components/user-panel-members-components/TrainingPlanModal"
import { MemberDocumentModal } from "../../components/user-panel-members-components/MemberDocumentModal"

export default function Members() {
  const navigate = useNavigate()
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [tempMemberModalTab, setTempMemberModalTab] = useState("details")
  const [editModalTab, setEditModalTab] = useState("details")

  const [sortBy, setSortBy] = useState("alphabetical")
  const [sortDirection, setSortDirection] = useState("asc")

  const sortOptions = [
    { id: "alphabetical", label: "Alphabetical" },
    { id: "status", label: "Status" },
    { id: "relations", label: "Relations Count" },
    { id: "age", label: "Age" },
    { id: "expiring", label: "Contracts Expiring Soon" },
  ]

  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [archivedFilter, setArchivedFilter] = useState("active")
  const [filterStatus, setFilterStatus] = useState("all")

  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")

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

  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")

  const [showDocumentModal, setShowDocumentModal] = useState(false)
const [selectedMemberForDocuments, setSelectedMemberForDocuments] = useState(null)


const handleDocumentClick = (member) => {
  setSelectedMemberForDocuments(member)
  setShowDocumentModal(true)
}


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
    autoArchivePeriod: 6,
    relations: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
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

  const availableMembersLeads = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

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
    const member = members.find((m) => m.id === memberId)
    if (member && member.memberType === "temporary") {
      if (window.confirm("Are you sure you want to archive this temporary member?")) {
        setMembers((prev) =>
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
    const member = members.find((m) => m.id === memberId)
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
      country: "United States",
      memberNumber: "M001",
      image: null,
      reason: "",
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
      autoArchiveDate: null,
      documents: [
        {
          id: "doc-1-1",
          name: "Medical Clearance Certificate.pdf",
          type: "pdf",
          size: "1.2 MB",
          uploadDate: "2023-01-15",
          category: "medical",
        },
        {
          id: "doc-1-2",
          name: "Emergency Contact Form.pdf",
          type: "pdf",
          size: "0.8 MB",
          uploadDate: "2023-01-16",
          category: "emergency",
        },
        {
          id: "doc-1-3",
          name: "Fitness Assessment Report.xlsx",
          type: "xlsx",
          size: "1.5 MB",
          uploadDate: "2023-02-01",
          category: "fitness",
        },
        {
          id: "doc-1-4",
          name: "Insurance Policy.pdf",
          type: "pdf",
          size: "2.1 MB",
          uploadDate: "2023-01-20",
          category: "legal",
        }
      ],
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
      country: "United States",
      memberNumber: "M002",
      image: null,
      isActive: false,
      reason: "Vacation Leaves",
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
      autoArchiveDate: null,
      documents: [
        {
          id: "doc-2-1",
          name: "Health Declaration.pdf",
          type: "pdf",
          size: "0.7 MB",
          uploadDate: "2021-11-20",
          category: "medical",
        },
        {
          id: "doc-2-2",
          name: "Personal Training Goals.docx",
          type: "docx",
          size: "0.3 MB",
          uploadDate: "2021-12-01",
          category: "fitness",
        },
        {
          id: "doc-2-3",
          name: "Identification Copy.jpg",
          type: "jpg",
          size: "2.8 MB",
          uploadDate: "2021-11-18",
          category: "personal",
        }
      ],
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Johnson",
      title: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1234567892",
      street: "789 Pine St",
      zipCode: "10112",
      city: "Chicago",
      country: "United States",
      memberNumber: "M003",
      image: null,
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Prefers morning sessions",
      noteStartDate: "2023-03-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1988-11-30",
      about: "Fitness enthusiast and marathon runner.",
      joinDate: "2022-06-15",
      contractStart: "2022-06-15",
      contractEnd: "2023-12-15",
      autoArchiveDate: null,
      documents: [
        {
          id: "doc-3-1",
          name: "Marathon Training Plan.pdf",
          type: "pdf",
          size: "3.2 MB",
          uploadDate: "2022-07-01",
          category: "fitness",
        },
        {
          id: "doc-3-2",
          name: "Injury History Report.docx",
          type: "docx",
          size: "0.6 MB",
          uploadDate: "2022-06-20",
          category: "medical",
        },
        {
          id: "doc-3-3",
          name: "Emergency Contacts.txt",
          type: "txt",
          size: "0.1 MB",
          uploadDate: "2022-06-16",
          category: "emergency",
        },
        {
          id: "doc-3-4",
          name: "Nutrition Guidelines.xlsx",
          type: "xlsx",
          size: "1.8 MB",
          uploadDate: "2022-08-15",
          category: "fitness",
        },
        {
          id: "doc-3-5",
          name: "Waiver Form.pdf",
          type: "pdf",
          size: "0.4 MB",
          uploadDate: "2022-06-15",
          category: "legal",
        }
      ],
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

    if (filterStatus === "active") {
      filtered = filtered.filter((member) => member.isActive && !member.isArchived)
    } else if (filterStatus === "paused") {
      filtered = filtered.filter((member) => !member.isActive && !member.isArchived)
    } else if (filterStatus === "archived") {
      filtered = filtered.filter((member) => member.isArchived)
    }

    if (memberTypeFilter === "full") {
      filtered = filtered.filter((member) => member.memberType === "full")
    } else if (memberTypeFilter === "temporary") {
      filtered = filtered.filter((member) => member.memberType === "temporary")
    }

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title)
        return sortDirection === "asc" ? comparison : -comparison
      })
    } else if (sortBy === "status") {
      filtered.sort((a, b) => {
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
    setEditModalTab("details")
  }

  const handleViewDetails = (member) => {
    setSelectedMember(member)
    setActiveTab("details")
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

  const [showTrainingPlansModal, setShowTrainingPlansModal] = useState(false)
  const [selectedMemberForTrainingPlans, setSelectedMemberForTrainingPlans] = useState(null)
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

  const handleCalendarClick = (member) => {
    setSelectedMemberForAppointments(member)
    setShowAppointmentModal(true)
  }

  const handleTrainingPlansClick = (member) => {
    setSelectedMemberForTrainingPlans(member)
    setShowTrainingPlansModal(true)
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

  const handleHistoryClick = (member) => {
    setSelectedMember(member)
    setShowHistoryModal(true)
  }

  const handleChatClick = (member) => {
    window.location.href = `/dashboard/communication`
  }

  const handleRelationClick = (member) => {
    setSelectedMember(member)
    setActiveTab("relations")
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
      <div
        className={`flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative  ${
          isRightSidebarOpen ? "lg:mr-96 md:mr-96 sm:mr-96" : "mr-0"
        }`}
      >
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 w-full">
            {/* Left Section (Members + View Mode) */}
            <div className="flex w-full lg:w-auto justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl oxanium_font text-white">Members</h1>

                {/* View Mode Switch (only visible on small + tablet, left beside heading) */}
                <div className="flex items-center gap-1 bg-black rounded-xl p-1 lg:hidden">
                  <span className="text-xs text-gray-400 px-2">View</span>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                    }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* IoIosMenu (right side on small/tablet, hidden on lg+) */}
              <div className="block lg:hidden">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
            </div>

            {/* Right Section (buttons + sort + desktop view mode + desktop menu) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Create Member */}
              <button
                onClick={() => setShowCreateTempMemberModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
              >
                <UserPlus size={16} />
                Create Temp Member
              </button>

              {/* Filter */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-black min-w-[160px]"
              >
                <Filter size={16} />
                Filter
              </button>

              {/* Sort Dropdown */}
              <div className="relative sort-dropdown w-full sm:w-auto">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full sm:w-auto flex cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-black min-w-[160px]"
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
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] flex items-center justify-between ${
                            option.id === sortBy && sortDirection === "asc" ? "bg-black" : ""
                          }`}
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
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] flex items-center justify-between ${
                            option.id === sortBy && sortDirection === "desc" ? "bg-black" : ""
                          }`}
                        >
                          <span>{option.label}</span>
                          <span className="text-gray-400">↓</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop View Mode (only visible on lg+) */}
              <div className="hidden lg:flex items-center gap-1 bg-black rounded-xl p-1">
                <span className="text-xs text-gray-400 px-2">View</span>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-[#FF843E] text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>

              {/* Desktop Menu (only visible on lg+) */}
              <div className="hidden lg:block">
                <IoIosMenu
                  onClick={toggleRightSidebar}
                  size={25}
                  className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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

          <div
  className={`open_sans_font ${
    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"
  }`}
>
  {filteredAndSortedMembers().length > 0 ? (
    filteredAndSortedMembers().map((member) => (
      <div
        key={member.id}
        className={`bg-[#161616] rounded-xl relative ${viewMode === "grid" ? "p-4" : "p-4 sm:p-6"}`}
      >
        {/* Note indicator - positioned absolutely in top-left */}
        {member.note && (
          <div className="absolute top-3 left-3 z-10">
            <div className="relative">
              <div
                className={`${
                  member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
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
                        {member.noteImportance === "important" ? "(Important)" : "(Unimportant Note)"}
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

        {/* Main content layout - different for grid vs list */}
        {viewMode === "grid" ? (
          // Grid layout
          <div className="flex flex-col">
            <div className="flex flex-col items-center mb-4">
              <img
                src={member.image || DefaultAvatar}
                className="h-20 w-20 rounded-full flex-shrink-0 object-cover mb-3"
                alt=""
              />
              <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h3 className="text-white font-medium truncate text-lg">
                    {member.title}
                    {member.dateOfBirth && ` (${calculateAge(member.dateOfBirth)})`}
                  </h3>

                  <div className="flex items-center gap-2">
                    {member.isArchived ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">Archived</span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
                        }`}
                      >
                        {member.isActive ? "Active" : `Paused${member.reason ? ` (${member.reason})` : ""}`}
                      </span>
                    )}

                    {isBirthday(member.dateOfBirth) && <Cake size={16} className="text-yellow-500" />}
                  </div>
                </div>

                <div className="text-sm mt-1 flex items-center gap-1">
                  <p className="text-gray-400">Member Type:</p>
                  <span className="text-gray-400">
                    {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                  </span>
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

            {/* Action buttons - Icons only in first row */}
            <div className="grid grid-cols-5 gap-2 mt-auto">
              <button
                onClick={() => handleCalendarClick(member)}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="View Appointments"
              >
                <Calendar size={16} />
              </button>
              <button
                onClick={() => handleTrainingPlansClick(member)}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Training Plans"
              >
                <Dumbbell size={16} />
              </button>
              <button
                onClick={() => handleHistoryClick(member)}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="View History"
              >
                <History size={16} />
              </button>
              <button
                 onClick={() => handleDocumentClick(member)}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Document Management"
              >
                <File size={16} />
              </button>
              <button
                onClick={() => handleChatClick(member)}
                className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                title="Start Chat"
              >
                <MessageCircle size={16} />
              </button>
            </div>

            {/* Second row - Text buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleViewDetails(member)}
                className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-1 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Eye size={14} />
                <span className="text-xs">View Details</span>
              </button>
              <button
                onClick={() => handleEditMember(member)}
                className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-1 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
              >
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>
        ) : (
          // List layout
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 pl-4">
            {/* Left side - Profile info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={member.image || DefaultAvatar}
                className="h-12 w-12 sm:h-20 sm:w-20 rounded-full flex-shrink-0 object-cover"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <h3 className="text-white font-medium text-base sm:text-lg truncate">
                    {member.title}
                    {member.dateOfBirth && ` (${calculateAge(member.dateOfBirth)})`}
                  </h3>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {member.isArchived ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">Archived</span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
                        }`}
                      >
                        {member.isActive ? "Active" : `Paused${member.reason ? ` (${member.reason})` : ""}`}
                      </span>
                    )}

                    {isBirthday(member.dateOfBirth) && <Cake size={16} className="text-yellow-500" />}
                  </div>
                </div>

                <div className="text-sm mt-1 flex flex-col sm:items-start gap-1">
                  <div className="flex items-center gap-1">
                    <p className="text-gray-400">Member Type:</p>
                    <span className="text-gray-400">
                      {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    {member.memberType === "full" ? (
                      <>
                        Contract: {member.contractStart} -{" "}
                        <span className={isContractExpiringSoon(member.contractEnd) ? "text-red-500" : ""}>
                          {member.contractEnd}
                        </span>
                        {isContractExpiringSoon(member.contractEnd) && (
                          <Info size={14} className="text-red-500" />
                        )}
                      </>
                    ) : (
                      <>
                        No Contract - Auto-archive: {member.autoArchiveDate}
                        {member.autoArchiveDate && new Date(member.autoArchiveDate) <= new Date() && (
                          <Clock size={14} className="text-orange-500" />
                        )}
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-1">
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

            {/* Right side - Action buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
              {/* First row - 5 icon buttons only */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={() => handleCalendarClick(member)}
                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                  title="View Appointments"
                >
                  <Calendar size={16} />
                </button>
                <button
                  onClick={() => handleTrainingPlansClick(member)}
                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                  title="Training Plans"
                >
                  <Dumbbell size={16} />
                </button>
                <button
                  onClick={() => handleHistoryClick(member)}
                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                  title="View History"
                >
                  <History size={16} />
                </button>
                <button
                  onClick={() => handleDocumentClick(member)}
                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                  title="Document Management"
                >
                  <File size={16} />
                </button>
                <button
                  onClick={() => handleChatClick(member)}
                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                  title="Start Chat"
                >
                  <MessageCircle size={16} />
                </button>
              </div>

              {/* Second row - Text buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleViewDetails(member)}
                  className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-3 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  <span className="text-sm">View Details</span>
                </button>
                <button
                  onClick={() => handleEditMember(member)}
                  className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-3 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                >
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    ))
  ) : (
    <div className="text-red-600 text-center text-sm cursor-pointer col-span-full">
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

          {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

          <FilterModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            filterOptions={filterOptions}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            memberTypeFilter={memberTypeFilter}
            setMemberTypeFilter={setMemberTypeFilter}
          />

          <CreateTempMemberModal
            show={showCreateTempMemberModal}
            onClose={() => setShowCreateTempMemberModal(false)}
            tempMemberForm={tempMemberForm}
            setTempMemberForm={setTempMemberForm}
            tempMemberModalTab={tempMemberModalTab}
            setTempMemberModalTab={setTempMemberModalTab}
            handleCreateTempMember={handleCreateTempMember}
            handleTempMemberInputChange={handleTempMemberInputChange}
            handleImgUpload={handleImgUpload}
            editingRelations={editingRelations}
            setEditingRelations={setEditingRelations}
            newRelation={newRelation}
            setNewRelation={setNewRelation}
            availableMembersLeads={availableMembersLeads}
            relationOptions={relationOptions}
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
      </div>

      <ViewDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedMember(null)
        }}
        selectedMember={selectedMember}
        memberRelations={memberRelations}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        redirectToContract={redirectToContract}
        handleEditMember={handleEditMember}
        setEditModalTab={setEditModalTab}
        DefaultAvatar={DefaultAvatar}
      />
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false)
          setSelectedMemberForAppointments(null)
        }}
        selectedMember={selectedMemberForAppointments}
        getMemberAppointments={getMemberAppointments}
        appointmentTypes={appointmentTypes}
        handleEditAppointment={handleEditAppointment}
        handleDeleteAppointment={handleDeleteAppointment}
        memberContingent={memberContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
      />
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
      <MemberDocumentModal
  member={selectedMemberForDocuments}
  isOpen={showDocumentModal}
  onClose={() => {
    setShowDocumentModal(false)
    setSelectedMemberForDocuments(null)
  }}
/>
      <ContingentModal
        showContingentModal={showContingentModal}
        setShowContingentModal={setShowContingentModal}
        selectedMemberForAppointments={selectedMemberForAppointments}
        getBillingPeriods={getBillingPeriods}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={handleBillingPeriodChange}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        currentBillingPeriod={currentBillingPeriod}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        handleSaveContingent={handleSaveContingent}
      />
      <AddBillingPeriodModal
        open={showAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        onClose={() => setShowAddBillingPeriodModal(false)}
        onAdd={handleAddBillingPeriod}
      />
      <TrainingPlansModal
        isOpen={showTrainingPlansModal}
        onClose={() => {
          setShowTrainingPlansModal(false)
          setSelectedMemberForTrainingPlans(null)
        }}
        selectedMember={selectedMemberForTrainingPlans}
        memberTrainingPlans={memberTrainingPlans[selectedMemberForTrainingPlans?.id] || []}
        availableTrainingPlans={availableTrainingPlans}
        onAssignPlan={handleAssignTrainingPlan}
        onRemovePlan={handleRemoveTrainingPlan}
      />
      <HistoryModal
        show={showHistoryModal}
        member={selectedMember}
        memberHistory={memberHistory}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        onClose={() => setShowHistoryModal(false)}
      />
      <NotifyMemberModal open={isNotifyMemberOpen} action={notifyAction} onClose={() => setIsNotifyMemberOpen(false)} />
    </>
  )
}
