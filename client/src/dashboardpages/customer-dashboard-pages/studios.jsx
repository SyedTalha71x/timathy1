"use client"

/* eslint-disable react/no-unescaped-entities */
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
  Download,
  TrendingUp,
  Clock,
  XCircle,
  CheckCircle,
  Pause,
  UserCheck,
  Upload,
  Building2,
  Network,
} from "lucide-react"
import DefaultStudioImage from "../../../public/default-avatar.avif"
import toast, { Toaster } from "react-hot-toast"

export default function Studios() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedStudio, setSelectedStudio] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [sortBy, setSortBy] = useState("alphabetical")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)

  // New franchise-related states
  const [viewMode, setViewMode] = useState("studios") // "studios" or "franchise"
  const [isCreateFranchiseModalOpen, setIsCreateFranchiseModalOpen] = useState(false)
  const [isEditFranchiseModalOpen, setIsEditFranchiseModalOpen] = useState(false)
  const [isAssignStudioModalOpen, setIsAssignStudioModalOpen] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState(null)
  const [selectedFranchiseForAssignment, setSelectedFranchiseForAssignment] = useState(null)

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
  const [isStaffsModalOpen, setIsStaffsModalOpen] = useState(false)
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false)
  const [isContractsModalOpen, setIsContractsModalOpen] = useState(false)
  const [isFinancesModalOpen, setIsFinancesModalOpen] = useState(false)
  const [selectedStudioForModal, setSelectedStudioForModal] = useState(null)

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

  const [financesPeriod, setFinancesPeriod] = useState("month")

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    website: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    contractStart: "",
    contractEnd: "",
    ownerName: "",
    taxId: "",
  })

  // Franchise form state
  const [franchiseForm, setFranchiseForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    website: "",
    about: "",
    ownerName: "",
    taxId: "",
    loginEmail: "",
    loginPassword: "",
    confirmPassword: "",
  })

  // Franchise data state
  const [franchises, setFranchises] = useState([
    {
      id: 1,
      name: "FitChain Franchise Group",
      email: "info@fitchain.com",
      phone: "+49123456789",
      street: "Franchise Straße 1",
      zipCode: "10115",
      city: "Berlin",
      website: "www.fitchain.com",
      about: "Leading fitness franchise with multiple studio locations across Germany.",
      ownerName: "Klaus Weber",
      taxId: "DE111222333",
      loginEmail: "admin@fitchain.com",
      loginPassword: "franchise123",
      createdDate: "2023-01-15",
      studioCount: 2,
    },
  ])

  const [studioClasses, setStudioClasses] = useState({
    1: [
      { id: 1, title: "Strength Training", schedule: "Mon, Wed, Fri", time: "10:00 - 11:00" },
      { id: 2, title: "Cardio Session", schedule: "Tue, Thu", time: "14:00 - 15:00" },
    ],
    2: [{ id: 3, title: "Yoga Class", schedule: "Mon, Wed, Fri", time: "09:00 - 10:30" }],
  })

  const [studioStats, setStudioStats] = useState({
    1: { members: 120, trainers: 8, classes: 15 },
    2: { members: 85, trainers: 5, classes: 10 },
  })

  const [studioMembers, setStudioMembers] = useState({
    1: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+49123456789",
        membershipType: "Premium",
        joinDate: "2023-01-15",
        status: "active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+49987654321",
        membershipType: "Basic",
        joinDate: "2023-02-20",
        status: "active",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+49555666777",
        membershipType: "Premium",
        joinDate: "2023-03-10",
        status: "inactive",
      },
    ],
    2: [
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+49111222333",
        membershipType: "Basic",
        joinDate: "2023-01-05",
        status: "active",
      },
      {
        id: 5,
        name: "Tom Brown",
        email: "tom@example.com",
        phone: "+49444555666",
        membershipType: "Premium",
        joinDate: "2023-02-15",
        status: "active",
      },
    ],
  })

  const [studioStaffs, setStudioStaffs] = useState({
    1: [
      {
        id: 1,
        name: "Alex Trainer",
        email: "alex@fitnessforlife.de",
        phone: "+49123456789",
        role: "Head Trainer",
        joinDate: "2022-01-15",
        status: "active",
      },
      {
        id: 2,
        name: "Lisa Coach",
        email: "lisa@fitnessforlife.de",
        phone: "+49987654321",
        role: "Fitness Coach",
        joinDate: "2022-03-20",
        status: "active",
      },
      {
        id: 3,
        name: "Mark Instructor",
        email: "mark@fitnessforlife.de",
        phone: "+49555666777",
        role: "Yoga Instructor",
        joinDate: "2022-06-10",
        status: "active",
      },
    ],
    2: [
      {
        id: 4,
        name: "Emma Personal",
        email: "emma@powergym.com",
        phone: "+49111222333",
        role: "Personal Trainer",
        joinDate: "2021-12-05",
        status: "active",
      },
      {
        id: 5,
        name: "David Manager",
        email: "david@powergym.com",
        phone: "+49444555666",
        role: "Studio Manager",
        joinDate: "2021-11-15",
        status: "active",
      },
    ],
  })

  const [studioLeads, setStudioLeads] = useState({
    1: [
      {
        id: 1,
        name: "Peter Potential",
        email: "peter@example.com",
        phone: "+49123456789",
        source: "Website",
        status: "new",
        contactDate: "2024-01-15",
      },
      {
        id: 2,
        name: "Anna Interested",
        email: "anna@example.com",
        phone: "+49987654321",
        source: "Referral",
        status: "contacted",
        contactDate: "2024-01-10",
      },
      {
        id: 3,
        name: "Chris Prospect",
        email: "chris@example.com",
        phone: "+49555666777",
        source: "Social Media",
        status: "converted",
        contactDate: "2024-01-05",
      },
    ],
    2: [
      {
        id: 4,
        name: "Sophie Lead",
        email: "sophie@example.com",
        phone: "+49111222333",
        source: "Google Ads",
        status: "new",
        contactDate: "2024-01-12",
      },
      {
        id: 5,
        name: "Robert Inquiry",
        email: "robert@example.com",
        phone: "+49444555666",
        source: "Walk-in",
        status: "contacted",
        contactDate: "2024-01-08",
      },
    ],
  })

  const [studioContracts, setStudioContracts] = useState({
    1: [
      {
        id: 1,
        memberName: "John Doe",
        duration: "12 months",
        startDate: "2023-01-15",
        endDate: "2024-01-15",
        status: "active",
        files: ["contract_john.pdf", "terms_john.pdf"],
      },
      {
        id: 2,
        memberName: "Jane Smith",
        duration: "6 months",
        startDate: "2023-02-20",
        endDate: "2023-08-20",
        status: "paused",
        files: ["contract_jane.pdf"],
      },
      {
        id: 3,
        memberName: "Mike Johnson",
        duration: "12 months",
        startDate: "2023-03-10",
        endDate: "2024-03-10",
        status: "inactive",
        files: ["contract_mike.pdf", "cancellation_mike.pdf"],
      },
    ],
    2: [
      {
        id: 4,
        memberName: "Sarah Wilson",
        duration: "24 months",
        startDate: "2023-01-05",
        endDate: "2025-01-05",
        status: "active",
        files: ["contract_sarah.pdf"],
      },
      {
        id: 5,
        memberName: "Tom Brown",
        duration: "12 months",
        startDate: "2023-02-15",
        endDate: "2024-02-15",
        status: "active",
        files: ["contract_tom.pdf", "addendum_tom.pdf"],
      },
    ],
  })

  const [studioFinances, setStudioFinances] = useState({
    1: {
      month: { totalRevenue: 45000, successfulPayments: 42000, pendingPayments: 2500, failedPayments: 500 },
      quarter: { totalRevenue: 135000, successfulPayments: 128000, pendingPayments: 5500, failedPayments: 1500 },
      year: { totalRevenue: 540000, successfulPayments: 515000, pendingPayments: 18000, failedPayments: 7000 },
    },
    2: {
      month: { totalRevenue: 32000, successfulPayments: 30000, pendingPayments: 1500, failedPayments: 500 },
      quarter: { totalRevenue: 96000, successfulPayments: 91000, pendingPayments: 3500, failedPayments: 1500 },
      year: { totalRevenue: 384000, successfulPayments: 365000, pendingPayments: 12000, failedPayments: 7000 },
    },
  })

  const [isClassesModalOpen, setIsClassesModalOpen] = useState(false)
  const [selectedStudioForClasses, setSelectedStudioForClasses] = useState(null)

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
        taxId: selectedStudio.taxId,
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
        ownerName: selectedFranchise.ownerName,
        taxId: selectedFranchise.taxId,
        loginEmail: selectedFranchise.loginEmail,
        loginPassword: selectedFranchise.loginPassword,
        confirmPassword: selectedFranchise.loginPassword,
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

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target
    setMemberEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      ownerName: "",
      taxId: "",
      loginEmail: "",
      loginPassword: "",
      confirmPassword: "",
    })
  }

  const handleMemberEditSubmit = (e) => {
    e.preventDefault()

    if (isMembersModalOpen) {
      setStudioMembers((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((member) =>
          member.id === selectedMemberForEdit.id ? { ...member, ...memberEditForm } : member,
        ),
      }))
    } else if (isStaffsModalOpen) {
      setStudioStaffs((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((staff) =>
          staff.id === selectedMemberForEdit.id
            ? { ...staff, ...memberEditForm, role: memberEditForm.membershipType }
            : staff,
        ),
      }))
    } else if (isLeadsModalOpen) {
      setStudioLeads((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((lead) =>
          lead.id === selectedMemberForEdit.id
            ? { ...lead, ...memberEditForm, source: memberEditForm.membershipType }
            : lead,
        ),
      }))
    }

    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    toast.success("Details updated successfully")
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

  const [studios, setStudios] = useState([
    {
      id: 1,
      name: "Fitness for Life GmbH",
      email: "info@fitnessforlife.de",
      phone: "+49123456789",
      street: "Hauptstraße 123",
      zipCode: "10115",
      city: "Berlin",
      image: null,
      isActive: true,
      note: "Premium partner, VIP treatment",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      website: "www.fitnessforlife.de",
      about: "Premium fitness studio with state-of-the-art equipment and certified trainers.",
      joinDate: "2022-03-01",
      contractStart: "2022-03-01",
      contractEnd: "2023-03-01",
      ownerName: "Hans Mueller",
      taxId: "DE123456789",
      franchiseId: 1, // Assigned to franchise
    },
    {
      id: 2,
      name: "PowerGym AG",
      email: "contact@powergym.com",
      phone: "+49987654321",
      street: "Friedrichstraße 45",
      zipCode: "20354",
      city: "Hamburg",
      image: null,
      isActive: false,
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      website: "www.powergym.com",
      about: "Specialized in strength training and bodybuilding with professional coaching.",
      joinDate: "2021-11-15",
      contractStart: "2021-11-15",
      contractEnd: "2024-04-15",
      ownerName: "Maria Schmidt",
      taxId: "DE987654321",
      franchiseId: 1, // Assigned to franchise
    },
  ])

  const filterOptions = [
    {
      id: "all",
      label: `All ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.length : franchises.length})`,
    },
    {
      id: "active",
      label: `Active ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.filter((m) => m.isActive).length : franchises.length})`,
    },
    {
      id: "inactive",
      label: `Inactive ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.filter((m) => !m.isActive).length : 0})`,
    },
  ]

  const sortOptions = [
    { id: "alphabetical", label: "Alphabetical" },
    { id: "expiring", label: "Contracts Expiring Soon" },
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
    }

    return filtered
  }

  const filteredAndSortedFranchises = () => {
    const filtered = franchises.filter((franchise) => franchise.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }

  const getStudiosByFranchise = (franchiseId) => {
    return studios.filter((studio) => studio.franchiseId === franchiseId)
  }

  const getUnassignedStudios = () => {
    return studios.filter((studio) => !studio.franchiseId)
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "New Studio Registered",
      description: "Fitness for Life GmbH has completed registration and is awaiting approval.",
    },
    {
      id: 2,
      heading: "Contract Expiring",
      description: "PowerGym AG's contract is expiring in 30 days. Consider sending a renewal notice.",
    },
  ])

  const handleFilterSelect = (filterId) => {
    setFilterStatus(filterId)
    setIsFilterDropdownOpen(false)
  }

  const handleSortSelect = (sortId) => {
    setSortBy(sortId)
    setIsSortDropdownOpen(false)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
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

  const redirectToContract = () => {
    window.location.href = "/dashboard/contract"
  }

  const handleLogoChange = (e) => {
    e.preventDefault()
    toast.success("Logo update functionality would be implemented here")
  }

  const handleViewClasses = (studio) => {
    setSelectedStudioForClasses(studio)
    setIsClassesModalOpen(true)
  }

  const addNewClass = (studioId) => {
    const newClass = {
      id: Math.max(...studioClasses[studioId].map((c) => c.id), 0) + 1,
      title: "New Class",
      schedule: "TBD",
      time: "TBD",
    }

    setStudioClasses((prev) => ({
      ...prev,
      [studioId]: [...prev[studioId], newClass],
    }))

    toast.success("New class added successfully")
  }

  const handleOpenMembersModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsMembersModalOpen(true)
  }

  const handleOpenStaffsModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsStaffsModalOpen(true)
  }

  const handleOpenLeadsModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsLeadsModalOpen(true)
  }

  const handleOpenContractsModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsContractsModalOpen(true)
  }

  const handleOpenFinancesModal = (studio) => {
    setSelectedStudioForModal(studio)
    setIsFinancesModalOpen(true)
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

  const toggleContractStatus = (contractId, newStatus) => {
    setStudioContracts((prev) => ({
      ...prev,
      [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((contract) =>
        contract.id === contractId ? { ...contract, status: newStatus } : contract,
      ),
    }))
    toast.success(`Contract status updated to ${newStatus}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="text-green-500" />
      case "inactive":
        return <XCircle size={16} className="text-red-500" />
      case "paused":
        return <Pause size={16} className="text-yellow-500" />
      default:
        return <Clock size={16} className="text-gray-500" />
    }
  }

  const getLeadStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-900 text-blue-300"
      case "contacted":
        return "bg-yellow-900 text-yellow-300"
      case "converted":
        return "bg-green-900 text-green-300"
      default:
        return "bg-gray-900 text-gray-300"
    }
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

      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <div className="flex md:flex-row flex-col md:items-center items-start gap-4">
              <h1 className="text-xl sm:text-2xl oxanium_font text-white">
                {viewMode === "studios" ? "Studios" : "Franchises"}
              </h1>

              {/* View Mode Toggle */}
              <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
                <button
                  onClick={() => setViewMode("studios")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === "studios" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Building size={16} className="inline mr-2" />
                  Studios
                </button>
                <button
                  onClick={() => setViewMode("franchise")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === "franchise" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Network size={16} className="inline mr-2" />
                  Franchise
                </button>
              </div>
            </div>

            <div className="flex md:items-center items-start  md:flex-row flex-col gap-3 w-full sm:w-auto">
              {viewMode === "franchise" && (
                <button
                  onClick={() => setIsCreateFranchiseModalOpen(true)}
                  className="bg-[#3F74FF] md:w-auto w-full  justify-center  hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create Franchise
                </button>
              )}

              <div className="relative w-full md:w-auto filter-dropdown flex-1 sm:flex-none">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
                >
                  <span className="truncate">{filterOptions.find((opt) => opt.id === filterStatus)?.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform flex-shrink-0 ${
                      isFilterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${
                          option.id === filterStatus ? "bg-[#000000]" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative w-full md:w-auto sort-dropdown flex-1 sm:flex-none">
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
                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${
                          option.id === sortBy ? "bg-[#000000]" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
                />
              </div>
              {viewMode === "studios" && (
                <button
                  onClick={() => setIsAssignStudioModalOpen(true)}
                  className="bg-[#FF843E] justify-center cursor-pointer hover:bg-[#FF843E]/90 px-4 py-3 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Network size={16} />
                  Assign to Franchise
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
                              className={`${
                                studio.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
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
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                            <img
                              src={studio.image || DefaultStudioImage}
                              className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0 object-cover"
                              alt=""
                            />
                            <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h3 className="text-white font-medium truncate text-lg sm:text-base">{studio.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                      studio.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
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
                                Contract: {studio.contractStart} -{" "}
                                <span className={isContractExpiringSoon(studio.contractEnd) ? "text-red-500" : ""}>
                                  {studio.contractEnd}
                                </span>
                                {isContractExpiringSoon(studio.contractEnd) && (
                                  <Info size={16} className="text-red-500 ml-1" />
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center md:justify-end justify-center">
                            {studio.franchiseId && (
                              <button
                                onClick={() => handleUnassignStudio(studio.id)}
                                className="text-gray-200 cursor-pointer bg-red-600 hover:bg-red-700 rounded-xl py-2 px-4 transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                <span className="hidden sm:inline">Unassign</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleViewDetails(studio)}
                              className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">View Details</span>
                            </button>

                            <button
                              onClick={() => handleEditStudio(studio)}
                              className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Edit size={16} />
                              <span className="hidden sm:inline">Edit</span>
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
                            <span className="">Staffs</span>
                          </button>

                          <button
                            onClick={() => handleOpenContractsModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <span className="">Contracts</span>
                          </button>

                          <button
                            onClick={() => handleOpenFinancesModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <span className="">Finances</span>
                          </button>

                          <button
                            onClick={() => handleOpenLeadsModal(studio)}
                            className="flex md:w-auto w-full justify-center items-center cursor-pointer  gap-2 border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <span className="">Leads</span>
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
                      : filterStatus === "inactive"
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
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                          <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Building2 size={24} className="text-white" />
                          </div>
                          <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <h3 className="text-white font-medium truncate text-lg sm:text-base">{franchise.name}</h3>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900 text-purple-300">
                                Franchise
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin size={14} className="text-gray-400" />
                              <p className="text-gray-400 text-sm truncate text-center sm:text-left">
                                {franchise.city}, {franchise.zipCode}
                              </p>
                            </div>
                            <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left">
                              Owner: {franchise.ownerName} 
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center md:justify-end justify-center">
                          <button
                            onClick={() => handleEditFranchise(franchise)}
                            className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Edit size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center md:flex-row flex-col mt-3">
                        <div className="flex items-center md:w-auto w-full justify-center gap-2 bg-transparent border border-slate-700/50 px-4 py-2 rounded-lg text-sm">
                          <Building size={16} />
                          <span>{franchise.studioCount}</span>
                          <span>Studios</span>
                        </div>
                        <div className="flex items-center md:w-auto w-full justify-center gap-2 bg-transparent border border-slate-700/50 px-4 py-2 rounded-lg text-sm">
                          <span>Login: {franchise.loginEmail}</span>
                        </div>
                      </div>

                      {/* Show assigned studios */}
                      {getStudiosByFranchise(franchise.id).length > 0 && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                          <h4 className="text-sm text-gray-400 mb-2">Assigned Studios:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getStudiosByFranchise(franchise.id).map((studio) => (
                              <div
                                key={studio.id}
                                className="bg-[#0F0F0F] rounded-lg p-3 flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-white text-sm font-medium">{studio.name}</p>
                                  <p className="text-gray-400 text-xs">{studio.city}</p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    studio.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                                  }`}
                                >
                                  {studio.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

        <aside
          className={`w-80 bg-[#181818] p-6 fixed top-0 bottom-0 right-0 z-50 lg:static lg:block ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } transition-transform duration-500 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
            <button onClick={() => setIsRightSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 open_sans_font">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-[#1C1C1C] rounded-xl p-4 relative">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
                <h3 className="open_sans_font_700 mb-2">{notification.heading}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{notification.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Create/Edit Franchise Modal */}
      {(isCreateFranchiseModalOpen || isEditFranchiseModalOpen) && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {isCreateFranchiseModalOpen ? "Create Franchise" : "Edit Franchise"}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateFranchiseModalOpen(false)
                    setIsEditFranchiseModalOpen(false)
                    setSelectedFranchise(null)
                    setFranchiseForm({
                      name: "",
                      email: "",
                      phone: "",
                      street: "",
                      zipCode: "",
                      city: "",
                      website: "",
                      about: "",
                      ownerName: "",
                      taxId: "",
                      loginEmail: "",
                      loginPassword: "",
                      confirmPassword: "",
                    })
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <form
                onSubmit={handleFranchiseSubmit}
                className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]"
              >
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Franchise Name</label>
                  <input
                    type="text"
                    name="name"
                    value={franchiseForm.name}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={franchiseForm.ownerName}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={franchiseForm.email}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={franchiseForm.phone}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={franchiseForm.website}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Tax ID</label>
                  <input
                    type="text"
                    name="taxId"
                    value={franchiseForm.taxId}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={franchiseForm.street}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={franchiseForm.zipCode}
                      onChange={handleFranchiseInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={franchiseForm.city}
                      onChange={handleFranchiseInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={franchiseForm.about}
                    onChange={handleFranchiseInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                    placeholder="Describe the franchise..."
                  />
                </div>

                <div className="border border-slate-700 rounded-xl p-4">
                  <h4 className="text-sm text-gray-200 font-medium mb-4">Login Credentials</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Login Email</label>
                      <input
                        type="email"
                        name="loginEmail"
                        value={franchiseForm.loginEmail}
                        onChange={handleFranchiseInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Password</label>
                      <input
                        type="password"
                        name="loginPassword"
                        value={franchiseForm.loginPassword}
                        onChange={handleFranchiseInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={franchiseForm.confirmPassword}
                        onChange={handleFranchiseInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
                  {isCreateFranchiseModalOpen ? "Create Franchise" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Studio to Franchise Modal */}
      {isAssignStudioModalOpen && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Assign Studios to Franchise</h2>
                <button onClick={() => setIsAssignStudioModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Franchise Selection */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Select Franchise</label>
                  <select
                    value={selectedFranchiseForAssignment?.id || ""}
                    onChange={(e) => {
                      const franchise = franchises.find((f) => f.id === Number.parseInt(e.target.value))
                      setSelectedFranchiseForAssignment(franchise)
                    }}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  >
                    <option value="">Select a franchise...</option>
                    {franchises.map((franchise) => (
                      <option key={franchise.id} value={franchise.id}>
                        {franchise.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unassigned Studios */}
                <div>
                  <h3 className="text-white font-medium mb-3">Unassigned Studios</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {getUnassignedStudios().length > 0 ? (
                      getUnassignedStudios().map((studio) => (
                        <div key={studio.id} className="bg-[#161616] rounded-xl p-4 flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-medium">{studio.name}</h4>
                            <p className="text-gray-400 text-sm">
                              {studio.city}, {studio.zipCode}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedFranchiseForAssignment) {
                                handleAssignStudio(selectedFranchiseForAssignment.id, studio.id)
                              } else {
                                toast.error("Please select a franchise first")
                              }
                            }}
                            disabled={!selectedFranchiseForAssignment}
                            className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm"
                          >
                            Assign
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4">All studios are already assigned to franchises</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All existing modals remain the same */}
      {isMembersModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Members ({studioMembers[selectedStudioForModal.id]?.length || 0})
                </h2>
                <button
                  onClick={() => {
                    setIsMembersModalOpen(false)
                    setSelectedStudioForModal(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {studioMembers[selectedStudioForModal.id]?.map((member) => (
                  <div key={member.id} className="bg-[#161616] rounded-xl p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{member.name}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            member.status === "active" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>
                          {member.email} • {member.phone}
                        </p>
                        <p>
                          Membership: {member.membershipType} • Joined: {member.joinDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditMember(member)}
                      className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isStaffsModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Staff ({studioStaffs[selectedStudioForModal.id]?.length || 0})
                </h2>
                <button
                  onClick={() => {
                    setIsStaffsModalOpen(false)
                    setSelectedStudioForModal(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {studioStaffs[selectedStudioForModal.id]?.map((staff) => (
                  <div key={staff.id} className="bg-[#161616] rounded-xl p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{staff.name}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            staff.status === "active" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>
                          {staff.email} • {staff.phone}
                        </p>
                        <p>
                          Role: {staff.role} • Joined: {staff.joinDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditMember(staff)}
                      className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeadsModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Leads ({studioLeads[selectedStudioForModal.id]?.length || 0})
                </h2>
                <button
                  onClick={() => {
                    setIsLeadsModalOpen(false)
                    setSelectedStudioForModal(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {studioLeads[selectedStudioForModal.id]?.map((lead) => (
                  <div key={lead.id} className="bg-[#161616] rounded-xl p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{lead.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getLeadStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>
                          {lead.email} • {lead.phone}
                        </p>
                        <p>
                          Source: {lead.source} • Contact Date: {lead.contactDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditMember(lead)}
                      className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isContractsModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl my-8 relative">
            <div className="lg:p-6 p-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Contracts ({studioContracts[selectedStudioForModal.id]?.length || 0})
                </h2>
                <button
                  onClick={() => {
                    setIsContractsModalOpen(false)
                    setSelectedStudioForModal(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {studioContracts[selectedStudioForModal.id]?.map((contract) => (
                  <div key={contract.id} className="bg-[#161616] rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{contract.memberName}</h3>
                          <div className="">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                contract.status === "active"
                                  ? "bg-green-900 text-green-300"
                                  : contract.status === "paused"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-red-900 text-red-300"
                              }`}
                            >
                              {contract.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>
                            Duration: {contract.duration} ({contract.startDate} - {contract.endDate})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                        <p className="text-sm text-gray-400">Attached Files:</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <input
                            type="file"
                            id={`file-upload-${contract.id}`}
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(contract.id, e.target.files)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={`file-upload-${contract.id}`}
                            className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors w-full sm:w-auto"
                          >
                            <Upload size={14} />
                            <span className="whitespace-nowrap">Upload Files</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {contract.files.map((file, index) => (
                          <button
                            key={index}
                            onClick={() => handleDownloadFile(file)}
                            className="bg-[#2F2F2F] hover:bg-[#3F3F3F] px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                          >
                            <Download size={14} />
                            <span className="truncate max-w-[150px]">{file}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFinancesModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="lg:p-6 p-3 custom-scrollbar overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Finances
                </h2>
                <button
                  onClick={() => {
                    setIsFinancesModalOpen(false)
                    setSelectedStudioForModal(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-400 block mb-2">Observation Period</label>
                <select
                  value={financesPeriod}
                  onChange={(e) => setFinancesPeriod(e.target.value)}
                  className="bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm border border-gray-700"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {studioFinances[selectedStudioForModal.id] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#161616] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-green-500" size={24} />
                      <h3 className="text-white font-medium">Total Revenue</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-500">
                      €{studioFinances[selectedStudioForModal.id][financesPeriod].totalRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#161616] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="text-green-500" size={24} />
                      <h3 className="text-white font-medium">Successful Payments</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-500">
                      €{studioFinances[selectedStudioForModal.id][financesPeriod].successfulPayments.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#161616] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-yellow-500" size={24} />
                      <h3 className="text-white font-medium">Pending Payments</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-500">
                      €{studioFinances[selectedStudioForModal.id][financesPeriod].pendingPayments.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#161616] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="text-red-500" size={24} />
                      <h3 className="text-white font-medium">Failed Payments</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-500">
                      €{studioFinances[selectedStudioForModal.id][financesPeriod].failedPayments.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-[#161616] rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Payment Success Rate</h4>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${
                        (studioFinances[selectedStudioForModal.id][financesPeriod].successfulPayments /
                          studioFinances[selectedStudioForModal.id][financesPeriod].totalRevenue) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {(
                    (studioFinances[selectedStudioForModal.id][financesPeriod].successfulPayments /
                      studioFinances[selectedStudioForModal.id][financesPeriod].totalRevenue) *
                    100
                  ).toFixed(1)}
                  % success rate
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditMemberModalOpen && selectedMemberForEdit && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative ">
            <div className="p-6  ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  Edit {isMembersModalOpen ? "Member" : isStaffsModalOpen ? "Staff" : "Lead"}
                </h2>
                <button
                  onClick={() => {
                    setIsEditMemberModalOpen(false)
                    setSelectedMemberForEdit(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <form onSubmit={handleMemberEditSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={memberEditForm.name}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={memberEditForm.email}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={memberEditForm.phone}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    {isMembersModalOpen ? "Membership Type" : isStaffsModalOpen ? "Role" : "Source"}
                  </label>
                  <input
                    type="text"
                    name="membershipType"
                    value={memberEditForm.membershipType}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    {isLeadsModalOpen ? "Contact Date" : "Join Date"}
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={memberEditForm.joinDate}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Status</label>
                  <select
                    name="status"
                    value={memberEditForm.status}
                    onChange={handleMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  >
                    {isLeadsModalOpen ? (
                      <>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </>
                    ) : (
                      <>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </>
                    )}
                  </select>
                </div>

                <button type="submit" className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedStudio && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Studio</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedStudio(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedStudio.image || DefaultStudioImage}
                      alt="Studio Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    id="logo"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        toast.success("Logo selected successfully")
                      }
                    }}
                  />
                  <label
                    htmlFor="logo"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                  >
                    Update logo
                  </label>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={editForm.ownerName}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
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
                  <label className="text-sm text-gray-200 block mb-2">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={editForm.website}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Tax ID</label>
                  <input
                    type="text"
                    name="taxId"
                    value={editForm.taxId}
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

                <div className="border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm text-gray-200 font-medium">Special Note</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="noteImportance"
                        checked={editForm.noteImportance === "important"}
                        onChange={(e) => {
                          setEditForm({
                            ...editForm,
                            noteImportance: e.target.checked ? "important" : "unimportant",
                          })
                        }}
                        className="mr-2 h-4 w-4 accent-[#FF843E]"
                      />
                      <label htmlFor="noteImportance" className="text-sm text-gray-200">
                        Important
                      </label>
                    </div>
                  </div>

                  <textarea
                    name="note"
                    value={editForm.note}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
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

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={editForm.about}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract Start</label>
                    <input
                      type="date"
                      name="contractStart"
                      value={editForm.contractStart}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract End</label>
                    <input
                      type="date"
                      name="contractEnd"
                      value={editForm.contractEnd}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isViewDetailsModalOpen && selectedStudio && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
            <div className="p-6 custom-scrollbar overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Studio Details</h2>
                <button
                  onClick={() => {
                    setIsViewDetailsModalOpen(false)
                    setSelectedStudio(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-4 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudio.image || DefaultStudioImage}
                    alt="Studio Logo"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStudio.name}</h3>
                    <p className="text-gray-400">
                      Contract: {selectedStudio.contractStart} -
                      <span className={isContractExpiringSoon(selectedStudio.contractEnd) ? "text-red-500" : ""}>
                        {selectedStudio.contractEnd}
                      </span>
                    </p>
                    {selectedStudio.franchiseId && (
                      <p className="text-purple-400 text-sm">
                        Franchise: {franchises.find((f) => f.id === selectedStudio.franchiseId)?.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Owner</p>
                    <p>{selectedStudio.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tax ID</p>
                    <p>{selectedStudio.taxId}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{selectedStudio.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p>{selectedStudio.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Website</p>
                  <p>{selectedStudio.website}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p>{`${selectedStudio.street}, ${selectedStudio.zipCode} ${selectedStudio.city}`}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      <p className="text-xl font-semibold">{studioStats[selectedStudio.id]?.members || 0}</p>
                    </div>
                    <p className="text-xs text-gray-400">Members</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Building size={16} className="text-green-400" />
                      <p className="text-xl font-semibold">{studioStats[selectedStudio.id]?.trainers || 0}</p>
                    </div>
                    <p className="text-xs text-gray-400">Trainers</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">About</p>
                  <p>{selectedStudio.about}</p>
                </div>

                {selectedStudio.note && (
                  <div>
                    <p className="text-sm text-gray-400">Special Note</p>
                    <p>{selectedStudio.note}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Note Period: {selectedStudio.noteStartDate} to {selectedStudio.noteEndDate}
                    </p>
                    <p className="text-sm text-gray-400">Importance: {selectedStudio.noteImportance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isClassesModalOpen && selectedStudioForClasses && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForClasses.name}'s Classes
                </h2>
                <button
                  onClick={() => {
                    setIsClassesModalOpen(false)
                    setSelectedStudioForClasses(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-4 text-white">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Total Classes: {studioClasses[selectedStudioForClasses.id]?.length || 0}
                  </p>
                  <button
                    onClick={() => addNewClass(selectedStudioForClasses.id)}
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Class
                  </button>
                </div>

                {studioClasses[selectedStudioForClasses.id]?.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {studioClasses[selectedStudioForClasses.id].map((classItem) => (
                      <div key={classItem.id} className="bg-[#161616] rounded-xl p-4">
                        <h3 className="font-medium">{classItem.title}</h3>
                        <div className="flex justify-between mt-2 text-sm text-gray-400">
                          <p>{classItem.schedule}</p>
                          <p>{classItem.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No classes available</p>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <p className="text-sm">
                    <span className="text-gray-400">Members:</span>{" "}
                    {studioStats[selectedStudioForClasses.id]?.members || 0}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Trainers:</span>{" "}
                    {studioStats[selectedStudioForClasses.id]?.trainers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
